"use client";

import { useState, useEffect, useCallback } from "react";
import { parseLyrics } from "../utils/lyricParser";
import { useAuth } from "../contexts/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

// When in production, we might fetch from a different backend origin
// If NEXT_PUBLIC_API_URL is just "/api", we assume it's a relative path on the same origin
const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== "/api")
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, "")
  : "";

function mapSongFromApi(song) {
  return {
    id: song._id,
    title: song.title,
    artist: song.artist,
    rawLyrics: song.lyrics,
    lyrics: parseLyrics(song.lyrics),
    audio: song.audioUrl ? `${BACKEND_BASE}${song.audioUrl}` : null,
  };
}

export default function useLocalStorageSongs() {
  const { authFetch, isAuthLoaded, isAuthenticated } = useAuth();
  const [songs, setSongs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchSongs = useCallback(async () => {
    if (!isAuthLoaded) return;
    if (!isAuthenticated) {
      setSongs([]);
      setIsLoaded(true);
      return;
    }

    const response = await authFetch(`${API_BASE}/songs`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load songs");
    }

    const data = await response.json();
    setSongs(data.map(mapSongFromApi));
  }, [authFetch, isAuthLoaded, isAuthenticated]);

  useEffect(() => {
    setIsLoaded(false);
    (async () => {
      try {
        await fetchSongs();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, [fetchSongs]);

  const saveSong = useCallback(async (song) => {
    const payload = {
      title: song.title,
      artist: song.artist,
      lyrics: song.rawLyrics || "",
    };

    const isUpdate = Boolean(song.id);
    const endpoint = isUpdate ? `${API_BASE}/songs/${song.id}` : `${API_BASE}/songs`;
    const method = isUpdate ? "PUT" : "POST";

    const response = await authFetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Unable to save song");
    }

    const savedData = await response.json();
    await fetchSongs();
    return savedData;
  }, [fetchSongs, authFetch]);

  const deleteSong = useCallback(async (id) => {
    const response = await authFetch(`${API_BASE}/songs/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Unable to delete song");
    }

    await fetchSongs();
  }, [fetchSongs, authFetch]);

  const uploadAudio = useCallback(async (id, file) => {
    const formData = new FormData();
    formData.append("audio", file);
    const response = await authFetch(`${API_BASE}/songs/${id}/audio`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to upload audio");
    }
    await fetchSongs();
  }, [fetchSongs, authFetch]);

  const removeAudio = useCallback(async (id) => {
    const response = await authFetch(`${API_BASE}/songs/${id}/audio`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Failed to remove audio");
    }
    await fetchSongs();
  }, [fetchSongs, authFetch]);

  const autoSync = useCallback(async (id) => {
    const response = await authFetch(`${API_BASE}/songs/${id}/auto-sync`, { method: "POST" });
    
    if (!response.ok) {
      // Safely try to parse JSON, or fallback to status text
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        throw new Error(data.message || "AI Sync failed");
      } else {
        throw new Error(`Server Error: ${response.statusText} (${response.status})`);
      }
    }
    
    await fetchSongs();
  }, [fetchSongs, authFetch]);

  return { songs, isLoaded, saveSong, deleteSong, uploadAudio, removeAudio, autoSync, refreshSongs: fetchSongs };

}

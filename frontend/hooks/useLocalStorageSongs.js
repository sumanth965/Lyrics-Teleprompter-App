"use client";

import { useState, useEffect, useCallback } from "react";
import { parseLyrics } from "../utils/lyricParser";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function mapSongFromApi(song) {
  return {
    id: song._id,
    title: song.title,
    artist: song.artist,
    rawLyrics: song.lyrics,
    lyrics: parseLyrics(song.lyrics),
  };
}

export default function useLocalStorageSongs() {
  const [songs, setSongs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchSongs = useCallback(async () => {
    const response = await fetch(`${API_BASE}/songs`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load songs");
    }

    const data = await response.json();
    setSongs(data.map(mapSongFromApi));
  }, []);

  useEffect(() => {
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

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Unable to save song");
    }

    await fetchSongs();
  }, [fetchSongs]);

  const deleteSong = useCallback(async (id) => {
    const response = await fetch(`${API_BASE}/songs/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Unable to delete song");
    }

    await fetchSongs();
  }, [fetchSongs]);

  return { songs, isLoaded, saveSong, deleteSong, refreshSongs: fetchSongs };
}

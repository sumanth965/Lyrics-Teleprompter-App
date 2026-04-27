"use client";

import { useState, useEffect, useCallback } from "react";
import defaultSongs from "../data/songs.json";

const STORAGE_KEY = "obsidian_stage_songs";

export default function useLocalStorageSongs() {
  const [songs, setSongs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load songs on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let customSongs = [];
    if (stored) {
      try {
        customSongs = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored songs", e);
      }
    }
    
    // Merge default songs with custom ones, ensuring IDs don't collide
    const merged = [...defaultSongs];
    customSongs.forEach(custom => {
      const exists = merged.find(s => s.id === custom.id);
      if (!exists) {
        merged.push(custom);
      } else {
        // Overwrite default if custom version exists with same ID
        const index = merged.findIndex(s => s.id === custom.id);
        merged[index] = custom;
      }
    });

    setSongs(merged);
    setIsLoaded(true);
  }, []);

  const saveSong = useCallback((song) => {
    setSongs((prev) => {
      const idx = prev.findIndex((s) => s.id === song.id);
      let nextSongs;
      if (idx >= 0) {
        nextSongs = [...prev];
        nextSongs[idx] = song;
      } else {
        nextSongs = [...prev, song];
      }

      // We only want to persist the CUSTOM (non-default) songs to localStorage
      // or at least identify which ones are overrides.
      // For simplicity, we'll store everything that isn't identical to defaults.
      const customOnly = nextSongs.filter(s => {
        const defaultMatch = defaultSongs.find(ds => ds.id === s.id);
        return !defaultMatch || JSON.stringify(defaultMatch) !== JSON.stringify(s);
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(customOnly));
      return nextSongs;
    });
  }, []);

  const deleteSong = useCallback((id) => {
    setSongs((prev) => {
      const nextSongs = prev.filter((s) => s.id !== id);
      const customOnly = nextSongs.filter(s => {
        const defaultMatch = defaultSongs.find(ds => ds.id === s.id);
        return !defaultMatch || JSON.stringify(defaultMatch) !== JSON.stringify(s);
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customOnly));
      return nextSongs;
    });
  }, []);

  return { songs, isLoaded, saveSong, deleteSong };
}

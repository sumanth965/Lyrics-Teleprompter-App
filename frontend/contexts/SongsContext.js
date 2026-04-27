"use client";

import { createContext, useContext } from "react";
import useLocalStorageSongs from "../hooks/useLocalStorageSongs";

const SongsContext = createContext(null);

export function SongsProvider({ children }) {
  const songData = useLocalStorageSongs();

  return (
    <SongsContext.Provider value={songData}>
      {children}
    </SongsContext.Provider>
  );
}

export function useSongs() {
  const context = useContext(SongsContext);
  if (!context) {
    throw new Error("useSongs must be used within a SongsProvider");
  }
  return context;
}

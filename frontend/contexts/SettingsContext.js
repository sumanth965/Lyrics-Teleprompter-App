"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const SettingsContext = createContext(null);
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

const fallbackSettings = {
  scrollSpeed: 1,
  fontSize: 48,
  theme: "dark",
  lineSpacing: 1.6,
  autoScroll: true,
  syncOffset: 0,
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(fallbackSettings);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  const fetchSettings = useCallback(async () => {
    const response = await fetch(`${API_BASE}/settings`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch settings");
    }
    const data = await response.json();
    setSettings({
      scrollSpeed: data.scrollSpeed ?? fallbackSettings.scrollSpeed,
      fontSize: data.fontSize ?? fallbackSettings.fontSize,
      theme: data.theme ?? fallbackSettings.theme,
      lineSpacing: data.lineSpacing ?? fallbackSettings.lineSpacing,
      autoScroll: data.autoScroll ?? fallbackSettings.autoScroll,
      syncOffset: data.syncOffset ?? fallbackSettings.syncOffset,
    });
  }, []);


  useEffect(() => {
    (async () => {
      try {
        await fetchSettings();
      } catch (error) {
        console.error(error);
      } finally {
        setIsSettingsLoaded(true);
      }
    })();
  }, [fetchSettings]);

  const updateSettings = useCallback(async (nextValues) => {
    const updated = { ...settings, ...nextValues };
    setSettings(updated);

    const response = await fetch(`${API_BASE}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextValues),
    });

    if (!response.ok) {
      throw new Error("Failed to update settings");
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isSettingsLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}

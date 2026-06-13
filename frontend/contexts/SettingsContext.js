"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

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

function normalizeSettings(data = {}) {
  return {
    scrollSpeed: data.scrollSpeed ?? fallbackSettings.scrollSpeed,
    fontSize: data.fontSize ?? fallbackSettings.fontSize,
    theme: data.theme ?? fallbackSettings.theme,
    lineSpacing: data.lineSpacing ?? fallbackSettings.lineSpacing,
    autoScroll: data.autoScroll ?? fallbackSettings.autoScroll,
    syncOffset: data.syncOffset ?? fallbackSettings.syncOffset,
  };
}

export function SettingsProvider({ children }) {
  const { authFetch, isAuthLoaded, isAuthenticated } = useAuth();
  const [settings, setSettings] = useState(fallbackSettings);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!isAuthLoaded) return;
    if (!isAuthenticated) {
      setSettings(fallbackSettings);
      setIsSettingsLoaded(true);
      return;
    }

    const response = await authFetch(`${API_BASE}/settings`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch settings");
    const data = await response.json();
    setSettings(normalizeSettings(data));
    setIsSettingsLoaded(true);
  }, [authFetch, isAuthLoaded, isAuthenticated]);

  useEffect(() => {
    (async () => {
      try {
        await fetchSettings();
      } catch (error) {
        console.error(error);
        setSettings(fallbackSettings);
        setIsSettingsLoaded(true);
      }
    })();
  }, [fetchSettings]);

  const updateSettings = useCallback(async (nextValues) => {
    const updated = { ...settings, ...nextValues };
    setSettings(updated);

    if (!isAuthenticated) return;

    const response = await authFetch(`${API_BASE}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextValues),
    });

    if (!response.ok) throw new Error("Failed to update settings");
  }, [settings, authFetch, isAuthenticated]);

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

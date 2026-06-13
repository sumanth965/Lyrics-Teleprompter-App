"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";
const TOKEN_KEY = "lyricsTeleprompterToken";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  const storeSession = useCallback((authData) => {
    setUser(authData.user);
    setToken(authData.token);
    localStorage.setItem(TOKEN_KEY, authData.token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const authFetch = useCallback(async (url, options = {}) => {
    const headers = new Headers(options.headers || {});
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);

    if (activeToken) headers.set("Authorization", `Bearer ${activeToken}`);

    return fetch(url, {
      ...options,
      headers,
    });
  }, [token]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        setIsAuthLoaded(true);
        return;
      }

      setToken(savedToken);
      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${savedToken}` },
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Session expired");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error(error);
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsAuthLoaded(true);
      }
    };

    loadCurrentUser();
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Registration failed");
    storeSession(data);
    return data.user;
  }, [storeSession]);

  const login = useCallback(async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Login failed");
    storeSession(data);
    return data.user;
  }, [storeSession]);

  const value = useMemo(() => ({
    user,
    token,
    register,
    login,
    logout,
    authFetch,
    isAuthLoaded,
    isAuthenticated: Boolean(user && token),
  }), [user, token, register, login, logout, authFetch, isAuthLoaded]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

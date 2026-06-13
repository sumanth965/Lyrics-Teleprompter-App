"use client";

import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthLoaded, isAuthenticated } = useAuth();

  if (!isAuthLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-[#22C55E]">
        <p className="font-mono text-sm uppercase tracking-widest">Checking session...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#0a0a0a] px-6 text-center text-[#f4f4f4]">
        <h1 className="text-4xl font-black uppercase tracking-tight">Sign in required</h1>
        <p className="max-w-md text-white/50">Log in or create an account to access your private songs, settings, and stage player.</p>
        <div className="flex gap-3">
          <Link href="/login" className="rounded-xl bg-[#22C55E] px-6 py-3 font-black text-[#003915]">Login</Link>
          <Link href="/register" className="rounded-xl border border-white/10 px-6 py-3 font-black text-white">Register</Link>
        </div>
      </main>
    );
  }

  return children;
}

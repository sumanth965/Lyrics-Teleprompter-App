"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push("/library");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f4f4f4]">
      <Navbar />
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 pt-24">
        <h1 className="mb-2 text-4xl font-black uppercase tracking-tight">Welcome back</h1>
        <p className="mb-8 text-white/50">Log in to access your private repertoire.</p>
        <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          {error && <div className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
          <label className="block text-xs font-black uppercase tracking-widest text-white/40">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none focus:border-[#22C55E]" />
          <label className="block text-xs font-black uppercase tracking-widest text-white/40">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none focus:border-[#22C55E]" />
          <button disabled={isSubmitting} className="w-full rounded-xl bg-[#22C55E] py-4 font-black text-[#003915] disabled:opacity-60">{isSubmitting ? "LOGGING IN..." : "LOGIN"}</button>
          <p className="text-center text-sm text-white/50">New here? <Link href="/register" className="font-bold text-[#22C55E]">Create an account</Link></p>
        </form>
      </section>
    </main>
  );
}

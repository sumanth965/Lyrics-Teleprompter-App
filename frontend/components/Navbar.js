"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthLoaded, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Library", href: "/library" },
    { name: "Studio", href: "/studio" },
    { name: "Stage", href: "/player" },
  ];

  return (
    <>
      <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-[#0a0a0a]/80 px-6 py-4 backdrop-blur-xl md:px-12">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16a34a] flex items-center justify-center text-black font-black">O</div>
            <span className="text-xl font-black tracking-tighter transition-colors group-hover:text-[#22C55E]">OBSIDIAN STAGE</span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-[#22C55E]" : "text-white/40 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden h-1 w-24 rounded-full bg-white/5 sm:block overflow-hidden">
              <div className={`h-full bg-[#22C55E] transition-all duration-500 ${
                pathname === "/" ? "w-1/4" : 
                pathname === "/library" ? "w-2/4" : 
                pathname === "/studio" ? "w-3/4" : "w-full"
              }`} />
            </div>
            
            {isAuthLoaded && isAuthenticated ? (
              <div className="hidden items-center gap-3 md:flex">
                <span className="max-w-40 truncate text-[10px] font-black uppercase tracking-widest text-white/50">{user?.name || user?.email}</span>
                <button onClick={logout} className="rounded-full border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white">Logout</button>
                <Link href="/player" className="rounded-full border border-[#22C55E]/20 bg-[#22C55E]/5 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-[#22C55E] transition-all hover:bg-[#22C55E]/10">Go Live</Link>
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white">Login</Link>
                <Link href="/register" className="rounded-full bg-[#22C55E] px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#003915]">Register</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white md:hidden"
            >
              <span className="material-symbols-outlined">
                {isMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[99] bg-[#0a0a0a] p-8 pt-24 md:hidden">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-sm font-black uppercase tracking-[0.2em] transition-all ${
                    isActive ? "border-[#22C55E]/30 bg-[#22C55E]/5 text-[#22C55E]" : "text-white/40"
                  }`}
                >
                  {link.name}
                  <span className="material-symbols-outlined text-sm opacity-30">arrow_forward_ios</span>
                </Link>
              );
            })}
            
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="mt-4 flex items-center justify-center gap-3 rounded-2xl border border-white/10 p-6 text-sm font-black uppercase tracking-[0.2em] text-white/70"
              >
                Logout {user?.email ? `(${user.email})` : ""}
              </button>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="rounded-2xl border border-white/10 p-5 text-center text-sm font-black uppercase tracking-[0.2em] text-white/70">Login</Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)} className="rounded-2xl bg-[#22C55E] p-5 text-center text-sm font-black uppercase tracking-[0.2em] text-[#003915]">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

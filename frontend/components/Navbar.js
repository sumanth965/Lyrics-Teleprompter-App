"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Library", href: "/library" },
    { name: "Studio", href: "/studio" },
    { name: "Stage", href: "/player" },
  ];

  return (
    <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-[#0a0a0a]/80 px-6 py-4 backdrop-blur-xl md:px-12">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16a34a] flex items-center justify-center text-black font-black">O</div>
          <span className="text-xl font-black tracking-tighter transition-colors group-hover:text-[#22C55E]">OBSIDIAN STAGE</span>
        </Link>
        
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
          <Link href="/player" className="rounded-full border border-[#22C55E]/20 bg-[#22C55E]/5 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-[#22C55E] transition-all hover:bg-[#22C55E]/10 active:scale-95">
            Go Live
          </Link>
        </div>
      </div>
    </nav>
  );
}

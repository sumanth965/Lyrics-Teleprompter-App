"use client";

import Link from "next/link";
import SongCard from "../../components/SongCard";
import { useSongs } from "../../contexts/SongsContext";

export default function LibraryPage() {
  const { songs, isLoaded } = useSongs();

  if (!isLoaded) {
    return <div className="bg-[#131313] min-h-screen text-[#e5e2e1] p-20">Loading Library...</div>;
  }

  return (
    <div className="bg-[#131313] text-[#e5e2e1]">
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-[#131313]/70 px-8 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <Link href="/" className="text-xl font-black tracking-tighter text-[#22C55E]">OBSIDIAN STAGE</Link>
        <div className="hidden items-center gap-8 tracking-tight md:flex">
          <Link className="text-[#e5e2e1]/50 transition-all duration-200 hover:text-[#e5e2e1]" href="/">Home</Link>
          <Link className="border-b-2 border-[#22C55E] pb-1 font-bold text-[#22C55E]" href="/library">Library</Link>
          <Link className="text-[#e5e2e1]/50 transition-all duration-200 hover:text-[#e5e2e1]" href="/studio">Studio</Link>
          <a className="text-[#e5e2e1]/50 transition-all duration-200 hover:text-[#e5e2e1]" href="#">Settings</a>
        </div>
        <button className="rounded-xl bg-[#22C55E] px-6 py-2 font-bold text-[#003915] transition-all duration-200 active:scale-95">Go Live</button>
      </nav>

      <div className="flex h-screen overflow-hidden pt-20">
        <aside className="hidden h-screen w-64 flex-col border-r border-[#3d4a3d]/15 bg-[#131313] py-8 lg:flex">
          <nav className="flex-1 space-y-2">
            <a className="flex items-center gap-4 px-8 py-3 text-[#e5e2e1]/40 transition-colors duration-300 hover:bg-[#2a2a2a] hover:text-[#e5e2e1]" href="#"><span className="material-symbols-outlined">queue_music</span><span className="text-[0.75rem] uppercase tracking-widest">Current Set</span></a>
            <a className="flex items-center gap-4 border-r-4 border-[#22C55E] bg-[#22C55E]/10 px-8 py-3 text-[#22C55E]" href="#"><span className="material-symbols-outlined">library_music</span><span className="text-[0.75rem] uppercase tracking-widest">Library</span></a>
            <Link className="flex items-center gap-4 px-8 py-3 text-[#e5e2e1]/40 transition-colors duration-300 hover:bg-[#2a2a2a] hover:text-[#e5e2e1]" href="/player"><span className="material-symbols-outlined">teleprompter</span><span className="text-[0.75rem] uppercase tracking-widest">Player</span></Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto px-8 py-8 md:px-12">
          <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="mb-2 text-5xl font-black uppercase tracking-tight">Song Library</h1>
              <p className="text-sm tracking-wide text-[#bccbb9]">1,248 ASSETS SYNCED ACROSS STUDIO</p>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-8 pb-24 md:grid-cols-2 xl:grid-cols-3">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

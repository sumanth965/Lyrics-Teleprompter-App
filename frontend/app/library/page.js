"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SongCard from "../../components/SongCard";
import { useSongs } from "../../contexts/SongsContext";

export default function LibraryPage() {
  const { songs, isLoaded } = useSongs();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredSongs = useMemo(() => {
    const query = search.trim().toLowerCase();
    let result = songs;
    
    if (query) {
      result = result.filter((song) =>
        song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query)
      );
    }

    if (filter === "audio") {
      result = result.filter(song => song.audio);
    } else if (filter === "recent") {
      // Just a mock filter for now
      result = [...result].reverse();
    }

    return result;
  }, [search, songs, filter]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-[#22C55E]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#22C55E] border-t-transparent"></div>
          <p className="font-mono text-sm tracking-widest uppercase">Initializing Library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f4f4f4] font-sans selection:bg-[#22C55E]/30 selection:text-[#22C55E]">
      {/* Premium Navbar */}
      <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-[#0a0a0a]/80 px-6 py-4 backdrop-blur-xl md:px-12">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16a34a] flex items-center justify-center text-black font-black">O</div>
            <span className="text-xl font-black tracking-tighter transition-colors group-hover:text-[#22C55E]">OBSIDIAN STAGE</span>
          </Link>
          
          <div className="hidden items-center gap-10 text-xs font-bold uppercase tracking-widest md:flex">
            <Link className="text-white/40 transition-colors hover:text-white" href="/">Dashboard</Link>
            <Link className="text-[#22C55E]" href="/library">Library</Link>
            <Link className="text-white/40 transition-colors hover:text-white" href="/studio">Studio</Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden h-1 w-24 rounded-full bg-white/5 sm:block overflow-hidden">
              <div className="h-full w-1/3 bg-[#22C55E]" />
            </div>
            <button className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/10 active:scale-95">
              Live Mode
            </button>
          </div>
        </div>
      </nav>

      <div className="flex pt-20">
        {/* Dynamic Sidebar */}
        <aside className="fixed left-0 hidden h-[calc(100vh-80px)] w-72 flex-col border-r border-white/5 bg-[#0a0a0a] p-8 lg:flex">
          <div className="mb-10 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Filters</p>
            <nav className="space-y-1">
              <button 
                onClick={() => setFilter("all")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all ${filter === "all" ? "bg-[#22C55E]/10 text-[#22C55E]" : "text-white/40 hover:bg-white/5 hover:text-white"}`}
              >
                <span className="material-symbols-outlined text-lg">all_inclusive</span> All Repertoire
              </button>
              <button 
                onClick={() => setFilter("audio")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all ${filter === "audio" ? "bg-[#22C55E]/10 text-[#22C55E]" : "text-white/40 hover:bg-white/5 hover:text-white"}`}
              >
                <span className="material-symbols-outlined text-lg">music_note</span> With Audio
              </button>
              <button 
                onClick={() => setFilter("recent")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all ${filter === "recent" ? "bg-[#22C55E]/10 text-[#22C55E]" : "text-white/40 hover:bg-white/5 hover:text-white"}`}
              >
                <span className="material-symbols-outlined text-lg">history</span> Recently Played
              </button>
            </nav>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Shortcuts</p>
            <nav className="space-y-1">
              <Link href="/studio" className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-white/40 transition-all hover:bg-white/5 hover:text-white">
                <span className="material-symbols-outlined text-lg">add_box</span> Create New
              </Link>
              <Link href="/player" className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-white/40 transition-all hover:bg-white/5 hover:text-white">
                <span className="material-symbols-outlined text-lg">stadium</span> Stage View
              </Link>
            </nav>
          </div>

          <div className="mt-auto rounded-2xl bg-gradient-to-br from-zinc-900 to-black p-6 border border-white/5">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#22C55E]">Performance Tip</p>
            <p className="text-[11px] leading-relaxed text-white/50">Use 'Space' in the player to quickly toggle playback during rehearsal.</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="min-h-screen w-full lg:ml-72">
          <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-12">
            
            <header className="mb-12">
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div className="space-y-2">
                  <h1 className="text-4xl font-black uppercase tracking-tight md:text-6xl">My Repertoire</h1>
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/30">
                    <span className="h-1 w-8 rounded-full bg-[#22C55E]" />
                    {filteredSongs.length} Ready for Stage
                  </div>
                </div>
                
                <div className="relative w-full md:w-96">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20">search</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title or artist..."
                    className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-[#22C55E]/50 focus:bg-white/[0.08]"
                  />
                </div>
              </div>
            </header>

            {/* Grid with improved responsive behavior */}
            {filteredSongs.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] text-center">
                <span className="material-symbols-outlined mb-4 text-4xl text-white/10">search_off</span>
                <p className="text-lg font-bold text-white/40">No songs found matching your search</p>
                <button onClick={() => setSearch("")} className="mt-4 text-sm font-bold text-[#22C55E] hover:underline">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 pb-32 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredSongs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 z-[100] flex w-full items-center justify-around border-t border-white/5 bg-[#0a0a0a]/80 p-4 backdrop-blur-xl md:hidden">
        <Link href="/" className="flex flex-col items-center gap-1 text-white/40">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </Link>
        <Link href="/library" className="flex flex-col items-center gap-1 text-[#22C55E]">
          <span className="material-symbols-outlined">library_music</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Library</span>
        </Link>
        <Link href="/studio" className="flex flex-col items-center gap-1 text-white/40">
          <span className="material-symbols-outlined">edit_note</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Studio</span>
        </Link>
      </nav>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SongCard from "../../components/SongCard";
import { useSongs } from "../../contexts/SongsContext";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function LibraryPage() {
  const { songs, isLoaded } = useSongs();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [setlist, setSetlist] = useState([]);

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
    } else if (filter === "missing-audio") {
      result = result.filter(song => !song.audio);
    } else if (filter === "recent") {
      result = [...result].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (filter === "artist") {
      result = [...result].sort((a, b) => a.artist.localeCompare(b.artist));
    } else if (filter === "title") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
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
    <ProtectedRoute>
    <div className="min-h-screen bg-[#0a0a0a] text-[#f4f4f4] font-sans selection:bg-[#22C55E]/30 selection:text-[#22C55E]">
      {/* Premium Navbar */}
      <Navbar />

      <div className="flex pt-20">

        {/* Main Content Area */}
        <main className="min-h-screen w-full">
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

            <div className="mb-8 flex flex-wrap gap-2">
              {[
                ["all", "All"], ["audio", "Has audio"], ["missing-audio", "Missing audio"], ["recent", "Recently added"], ["artist", "Artist"], ["title", "Title"],
              ].map(([value, label]) => (
                <button key={value} onClick={() => setFilter(value)} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider ${filter === value ? "bg-[#22C55E] text-black" : "bg-white/5 text-white/50 hover:text-white"}`}>{label}</button>
              ))}
            </div>

            <section className="mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black uppercase">Setlist Builder</h2>
                  <p className="text-xs text-white/40">Drag songs here, then drag inside the setlist to reorder for stage.</p>
                </div>
                <button onClick={() => setSetlist([])} className="text-xs font-bold text-red-300 hover:text-red-200">Clear</button>
              </div>
              <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const id = event.dataTransfer.getData("song/id"); const song = songs.find((item) => item.id === id); if (song && !setlist.some((item) => item.id === id)) setSetlist((items) => [...items, song]); }} className="min-h-24 rounded-2xl border border-dashed border-white/10 p-3">
                {setlist.length === 0 ? <p className="p-4 text-sm text-white/30">Drop songs here to create a setlist.</p> : setlist.map((song, index) => (
                  <div key={song.id} draggable onDragStart={(event) => event.dataTransfer.setData("setlist/index", String(index))} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const from = Number(event.dataTransfer.getData("setlist/index")); if (Number.isNaN(from)) return; setSetlist((items) => { const next = [...items]; const [moved] = next.splice(from, 1); next.splice(index, 0, moved); return next; }); }} className="mb-2 flex cursor-grab items-center justify-between rounded-xl bg-black/30 p-3 text-sm">
                    <span><strong>{index + 1}. {song.title}</strong> <span className="text-white/40">— {song.artist}</span></span>
                    <Link href={`/player?songId=${song.id}`} className="text-[#22C55E]">Play</Link>
                  </div>
                ))}
              </div>
            </section>

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
                  <div key={song.id} draggable onDragStart={(event) => event.dataTransfer.setData("song/id", song.id)}><SongCard song={song} /></div>
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
    </ProtectedRoute>
  );
}

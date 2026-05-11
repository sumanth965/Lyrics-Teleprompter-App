"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SongCard from "../../components/SongCard";
import { useSongs } from "../../contexts/SongsContext";

export default function LibraryPage() {
  const { songs, isLoaded } = useSongs();
  const [search, setSearch] = useState("");

  const filteredSongs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return songs;
    return songs.filter((song) => song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query));
  }, [search, songs]);

  if (!isLoaded) return <main className="min-h-screen bg-[#131313] p-20 text-[#e5e2e1]">Loading library...</main>;

  return (
    <div className="bg-[#131313] text-[#e5e2e1]">
      <header>
        <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-[#131313]/80 px-8 py-4 backdrop-blur-md" aria-label="Primary">
          <Link href="/" className="text-xl font-black tracking-tight text-[#22C55E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4be277]">StageLyrics</Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link className="text-[#e5e2e1]/70 hover:text-white" href="/">Home</Link>
            <Link className="border-b-2 border-[#22C55E] pb-1 font-bold text-[#22C55E]" href="/library">Library</Link>
            <Link className="text-[#e5e2e1]/70 hover:text-white" href="/studio">Studio</Link>
            <Link className="text-[#e5e2e1]/70 hover:text-white" href="/player">Player</Link>
          </div>
        </nav>
      </header>
      <div className="flex min-h-screen overflow-hidden pt-20">
        <aside className="hidden w-64 border-r border-[#3d4a3d]/15 bg-[#131313] py-8 lg:flex" aria-label="Section navigation">
          <nav className="w-full space-y-2">
            <Link className="flex items-center gap-4 px-8 py-3 text-[#e5e2e1]/50 hover:bg-[#2a2a2a] hover:text-white" href="/studio"><span className="material-symbols-outlined">queue_music</span><span className="text-xs uppercase tracking-widest">Song Editor</span></Link>
            <Link className="flex items-center gap-4 border-r-4 border-[#22C55E] bg-[#22C55E]/10 px-8 py-3 text-[#22C55E]" href="/library"><span className="material-symbols-outlined">library_music</span><span className="text-xs uppercase tracking-widest">Library</span></Link>
            <Link className="flex items-center gap-4 px-8 py-3 text-[#e5e2e1]/50 hover:bg-[#2a2a2a] hover:text-white" href="/player"><span className="material-symbols-outlined">teleprompter</span><span className="text-xs uppercase tracking-widest">Player</span></Link>
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto px-8 py-8 md:px-12">
          <header className="mb-8">
            <h1 className="mb-2 text-4xl font-black tracking-tight">Song Library</h1>
            <p className="text-sm text-[#c8d0c6]">{search.trim() ? `${filteredSongs.length} of ${songs.length} songs match your search.` : `${songs.length} songs available.`}</p>
          </header>
          <label htmlFor="song-search" className="mb-2 block text-sm font-medium text-[#c8d0c6]">Search songs</label>
          <input id="song-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title or artist" className="mb-8 w-full rounded-xl border border-[#3d4a3d]/40 bg-[#111] px-4 py-3 text-sm outline-none focus:border-[#22C55E]" />
          <section className="grid grid-cols-1 gap-8 pb-24 md:grid-cols-2 xl:grid-cols-3" aria-label="Songs">
            {filteredSongs.map((song) => <SongCard key={song.id} song={song} />)}
          </section>
        </main>
      </div>
    </div>
  );
}

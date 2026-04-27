"use client";

import { useState, useCallback, useRef } from "react";
import { useSongs } from "../contexts/SongsContext";
import { parseLyrics } from "../utils/lyricParser";
import Link from "next/link";

export default function StudioScreen() {
  const { songs, saveSong, deleteSong } = useSongs();
  
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [rawLyrics, setRawLyrics] = useState("");
  
  const fileInputRef = useRef(null);

  const onEdit = (song) => {
    setEditingId(song.id);
    setTitle(song.title);
    setArtist(song.artist);
    // Convert array back to string if they want to edit raw
    setRawLyrics(song.lyrics.map(l => `[${formatTime(l.time)}] ${l.text}`).join("\n"));
  };

  const onNew = () => {
    setEditingId(Date.now()); // Simple unique ID
    setTitle("New Song");
    setArtist("Unknown Artist");
    setRawLyrics("");
  };

  const onSave = () => {
    const parsed = parseLyrics(rawLyrics);
    saveSong({
      id: editingId,
      title,
      artist,
      lyrics: parsed,
      bpm: 120, // Default for now
      audio: "", // Placeholder
    });
    setEditingId(null);
  };

  const onImportClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawLyrics(event.target.result);
      if (!title || title === "New Song") {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    };
    reader.readAsText(file);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins.toString().padStart(2, "0")}:${secs.padStart(5, "0")}`;
  };

  if (editingId) {
    return (
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1] p-8 md:p-12">
        <header className="mb-12">
           <button onClick={() => setEditingId(null)} className="mb-4 text-[#22C55E] flex items-center gap-2 hover:underline">
             <span className="material-symbols-outlined">arrow_back</span> Back to Studio
           </button>
           <h1 className="text-4xl font-black uppercase tracking-tight">Lyric Editor</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#bccbb9]">Song Title</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#131313] border border-[#3d4a3d]/30 p-4 font-bold text-xl rounded-xl focus:border-[#22C55E] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#bccbb9]">Artist</label>
              <input 
                value={artist} 
                onChange={e => setArtist(e.target.value)}
                className="w-full bg-[#131313] border border-[#3d4a3d]/30 p-4 rounded-xl focus:border-[#22C55E] outline-none"
              />
            </div>
            <div className="pt-6">
               <button onClick={onSave} className="w-full bg-[#22C55E] text-[#003915] font-black py-4 rounded-xl active:scale-95 transition-transform">
                 SAVE TO LOCAL LIBRARY
               </button>
            </div>
          </div>

          <div className="space-y-4 flex flex-col">
            <div className="flex justify-between items-end">
              <label className="text-xs uppercase tracking-widest text-[#bccbb9]">Lyrics (.LRC or .TXT format)</label>
              <button onClick={onImportClick} className="text-[#22C55E] text-xs font-bold hover:underline">
                IMPORT FILE
              </button>
              <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept=".txt,.lrc" />
            </div>
            <textarea 
              value={rawLyrics}
              onChange={e => setRawLyrics(e.target.value)}
              placeholder="[00:05.00] Line one\n[00:10.00] Line two..."
              className="flex-1 min-h-[400px] bg-[#0a0a0a] border border-[#3d4a3d]/30 p-6 font-mono text-sm rounded-xl focus:border-[#22C55E] outline-none resize-none"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] p-8 md:p-12">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="mb-2 text-5xl font-black uppercase tracking-tight">Studio</h1>
          <p className="text-sm tracking-wide text-[#bccbb9]">LOCAL WORKSPACE & ASSET MANAGEMENT</p>
        </div>
        <button onClick={onNew} className="rounded-xl bg-[#22C55E] px-8 py-3 font-bold text-[#003915] active:scale-95 transition-transform">
          CREATE NEW ASSET
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {songs.map(song => (
          <div key={song.id} className="group relative bg-[#1a1a1a] border border-[#3d4a3d]/20 p-6 rounded-2xl hover:border-[#22C55E]/40 transition-all duration-300">
            <h3 className="text-xl font-bold mb-1">{song.title}</h3>
            <p className="text-sm text-[#bccbb9] mb-6 uppercase tracking-wider">{song.artist}</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onEdit(song)}
                className="flex-1 bg-[#2a2a2a] py-2 rounded-lg text-sm font-bold hover:bg-[#333] transition-colors"
                title="Edit lyrics and metadata"
              >
                EDIT
              </button>
              <Link 
                href={`/player?songId=${song.id}`}
                className="flex-1 bg-[#22C55E]/10 py-2 rounded-lg text-sm font-bold text-[#22C55E] text-center hover:bg-[#22C55E]/20 transition-colors"
              >
                PLAY
              </Link>
              <button 
                onClick={() => deleteSong(song.id)}
                className="p-2 text-red-500/40 hover:text-red-500 transition-colors"
                title="Delete local copy"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
            {/* Visual indicator for local overrides/custom songs */}
            <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[#22C55E] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}

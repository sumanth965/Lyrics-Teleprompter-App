"use client";

import { useState, useRef } from "react";
import { useSongs } from "../contexts/SongsContext";
import { parseLyrics } from "../utils/lyricParser";
import Link from "next/link";

export default function StudioScreen() {
  const { songs, saveSong, deleteSong, uploadAudio, removeAudio } = useSongs();

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [rawLyrics, setRawLyrics] = useState("");

  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const [uploadingId, setUploadingId] = useState(null);

  const onEdit = (song) => {
    setEditingId(song.id);
    setTitle(song.title);
    setArtist(song.artist);
    setRawLyrics(song.rawLyrics || song.lyrics.map((l) => `[${formatTime(l.time)}] ${l.text}`).join("\n"));
  };

  const onNew = () => {
    setEditingId(null);
    setTitle("New Song");
    setArtist("Unknown Artist");
    setRawLyrics("");
  };

  const onSave = async () => {
    try {
      await saveSong({
        id: editingId,
        title,
        artist,
        rawLyrics,
        lyrics: parseLyrics(rawLyrics),
      });
      setEditingId(null);
    } catch (error) {
      console.error(error);
    }
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

  const onAudioUploadForSong = async (songId, file) => {
    if (!file) return;
    setUploadingId(songId);
    try {
      await uploadAudio(songId, file);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingId(null);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins.toString().padStart(2, "0")}:${secs.padStart(5, "0")}`;
  };

  if (editingId !== null || title) {
    return (
      <div className="min-h-screen bg-[#131313] p-8 text-[#e5e2e1] md:p-12">
        <header className="mb-12">
          <button onClick={() => { setEditingId(null); setTitle(""); }} className="mb-4 flex items-center gap-2 text-[#22C55E] hover:underline">
            <span className="material-symbols-outlined">arrow_back</span> Back to Studio
          </button>
          <h1 className="text-4xl font-black uppercase tracking-tight">Lyric Editor</h1>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#bccbb9]">Song Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#3d4a3d]/30 bg-[#131313] p-4 text-xl font-bold outline-none focus:border-[#22C55E]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#bccbb9]">Artist</label>
              <input
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full rounded-xl border border-[#3d4a3d]/30 bg-[#131313] p-4 outline-none focus:border-[#22C55E]"
              />
            </div>
            <div className="pt-6">
              <button onClick={onSave} className="w-full rounded-xl bg-[#22C55E] py-4 font-black text-[#003915] transition-transform active:scale-95">
                SAVE TO DATABASE
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-end justify-between">
              <label className="text-xs uppercase tracking-widest text-[#bccbb9]">Lyrics (.LRC or .TXT format)</label>
              <button onClick={onImportClick} className="text-xs font-bold text-[#22C55E] hover:underline">
                IMPORT FILE
              </button>
              <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept=".txt,.lrc" />
            </div>
            <textarea
              value={rawLyrics}
              onChange={(e) => setRawLyrics(e.target.value)}
              placeholder="[00:05.00] Line one\n[00:10.00] Line two..."
              className="min-h-[400px] flex-1 resize-none rounded-xl border border-[#3d4a3d]/30 bg-[#0a0a0a] p-6 font-mono text-sm outline-none focus:border-[#22C55E]"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131313] p-8 text-[#e5e2e1] md:p-12">
      <header className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 text-5xl font-black uppercase tracking-tight">Studio</h1>
          <p className="text-sm tracking-wide text-[#bccbb9]">DATABASE WORKSPACE & ASSET MANAGEMENT</p>
        </div>
        <button onClick={onNew} className="rounded-xl bg-[#22C55E] px-8 py-3 font-bold text-[#003915] transition-transform active:scale-95">
          CREATE NEW ASSET
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {songs.map((song) => (
          <div key={song.id} className="group relative rounded-2xl border border-[#3d4a3d]/20 bg-[#1a1a1a] p-6 transition-all duration-300 hover:border-[#22C55E]/40">
            <div className="mb-1 flex items-start justify-between">
              <h3 className="text-xl font-bold">{song.title}</h3>
              {/* Audio status dot */}
              <span
                className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                  song.audio ? "bg-[#22C55E]" : "bg-zinc-700"
                }`}
                title={song.audio ? "Audio attached" : "No audio"}
              />
            </div>
            <p className="mb-6 text-sm uppercase tracking-wider text-[#bccbb9]">{song.artist}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onEdit(song)}
                className="flex-1 rounded-lg bg-[#2a2a2a] py-2 text-sm font-bold transition-colors hover:bg-[#333]"
                title="Edit lyrics and metadata"
              >
                EDIT
              </button>
              <Link
                href={`/player?songId=${song.id}`}
                className="flex-1 rounded-lg bg-[#22C55E]/10 py-2 text-center text-sm font-bold text-[#22C55E] transition-colors hover:bg-[#22C55E]/20"
              >
                PLAY
              </Link>
              {/* Audio upload / remove */}
              <label
                className={`cursor-pointer rounded-lg p-2 transition-colors ${
                  uploadingId === song.id
                    ? "text-zinc-500"
                    : song.audio
                    ? "text-[#22C55E] hover:bg-[#22C55E]/10"
                    : "text-zinc-500 hover:text-[#22C55E] hover:bg-[#22C55E]/10"
                }`}
                title={song.audio ? "Replace audio" : "Upload audio"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  disabled={uploadingId === song.id}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) onAudioUploadForSong(song.id, file);
                    e.target.value = "";
                  }}
                />
              </label>
              {song.audio && (
                <button
                  onClick={() => removeAudio(song.id).catch(console.error)}
                  className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  title="Remove audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => deleteSong(song.id).catch(console.error)}
                className="p-2 text-red-500/40 transition-colors hover:text-red-500"
                title="Delete song"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
            <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#22C55E] opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

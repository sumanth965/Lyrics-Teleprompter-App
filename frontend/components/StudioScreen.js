"use client";

import { useState, useRef } from "react";
import { useSongs } from "../contexts/SongsContext";
import { applyLyricOffset, formatLrcTime, parseLyrics, validateLrc } from "../utils/lyricParser";
import { useToast } from "./ToastProvider";
import Link from "next/link";
import Navbar from "./Navbar";

export default function StudioScreen() {
  const { songs, saveSong, deleteSong, uploadAudio, removeAudio, autoSync } = useSongs();
  const { showToast } = useToast();

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [rawLyrics, setRawLyrics] = useState("");
  const [notes, setNotes] = useState("");
  const [songKey, setSongKey] = useState("");
  const [bpm, setBpm] = useState("");
  const [capo, setCapo] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [offset, setOffset] = useState(0);
  const [timingAudio, setTimingAudio] = useState(null);
  const [tapIndex, setTapIndex] = useState(0);
  const [aiStatus, setAiStatus] = useState("");

  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [existingAudio, setExistingAudio] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const onEdit = (song) => {
    setEditingId(song.id);
    setTitle(song.title);
    setArtist(song.artist);
    setRawLyrics(song.rawLyrics || song.lyrics.map((l) => `[${formatTime(l.time)}] ${l.text}`).join("\n"));
    setExistingAudio(song.audio);
    setNotes(song.notes || "");
    setSongKey(song.key || "");
    setBpm(song.bpm || "");
    setCapo(song.capo || "");
    setSelectedAudioFile(null);
  };

  const onNew = () => {
    setEditingId(null);
    setTitle("New Song");
    setArtist("Unknown Artist");
    setRawLyrics("");
    setExistingAudio(null);
    setSelectedAudioFile(null);
    setNotes("");
    setSongKey("");
    setBpm("");
    setCapo("");
  };

  const lrcValidation = validateLrc(rawLyrics);
  const parsedPreview = parseLyrics(rawLyrics);

  const applyOffset = () => {
    setRawLyrics(applyLyricOffset(rawLyrics, offset));
    showToast(`Applied ${offset}s bulk lyric offset.`);
  };

  const tapTimestamp = () => {
    if (!timingAudio || !parsedPreview[tapIndex]) return;
    const lines = rawLyrics.split(/\r?\n/);
    let lyricCount = -1;
    const next = lines.map((line) => {
      if (!line.trim()) return line;
      lyricCount += 1;
      if (lyricCount !== tapIndex) return line;
      return `[${formatLrcTime(timingAudio.currentTime)}] ${line.replace(/^\[\d+:\d+(?:\.\d+)?\]\s*/, "")}`;
    });
    setRawLyrics(next.join("\n"));
    setTapIndex((value) => Math.min(value + 1, parsedPreview.length - 1));
  };

  const onSave = async () => {
    if (!title || !artist) {
      showToast("Title and Artist are required.", "error");
      return;
    }

    if (!rawLyrics.trim() && !selectedAudioFile && !existingAudio) {
      showToast("At least one asset is required (Lyrics or Audio file).", "error");
      return;
    }

    setIsSaving(true);
    try {
      const savedSong = await saveSong({
        id: editingId,
        title,
        artist,
        rawLyrics,
        lyrics: rawLyrics.trim() ? parseLyrics(rawLyrics) : [],
        notes,
        key: songKey,
        bpm: bpm ? Number(bpm) : null,
        capo,
      });

      // Handle optional audio upload if a file was selected
      if (selectedAudioFile) {
        const songId = editingId || (savedSong && (savedSong._id || savedSong.id));
        if (songId) {
          setUploadingId(songId);
          await uploadAudio(songId, selectedAudioFile);
        } else {
          console.error("Could not determine song ID for upload", savedSong);
        }
      }

      setEditingId(null);
      setTitle("");
      setArtist("");
      setRawLyrics("");
      setExistingAudio(null);
      setSelectedAudioFile(null);
      showToast("Song saved.");
    } catch (error) {
      console.error(error);
      showToast("Save failed: " + error.message, "error");
    } finally {
      setUploadingId(null);
      setIsSaving(false);
    }
  };

  const onCancel = () => {
    setEditingId(null);
    setTitle("");
    setArtist("");
    setRawLyrics("");
    setExistingAudio(null);
    setSelectedAudioFile(null);
    setNotes("");
    setSongKey("");
    setBpm("");
    setCapo("");
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
      showToast(err.message || "Audio upload failed", "error");
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
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1]">
        <Navbar />
        <div className="p-8 pt-32 md:p-12 md:pt-32">
          <header className="mb-12">
          <button onClick={onCancel} className="mb-4 flex items-center gap-2 text-[#22C55E] hover:underline">
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
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <input value={songKey} onChange={(e) => setSongKey(e.target.value)} placeholder="Key" className="rounded-xl border border-[#3d4a3d]/30 bg-[#131313] p-3 outline-none focus:border-[#22C55E]" />
              <input value={bpm} onChange={(e) => setBpm(e.target.value)} placeholder="BPM" type="number" className="rounded-xl border border-[#3d4a3d]/30 bg-[#131313] p-3 outline-none focus:border-[#22C55E]" />
              <input value={capo} onChange={(e) => setCapo(e.target.value)} placeholder="Capo" className="rounded-xl border border-[#3d4a3d]/30 bg-[#131313] p-3 outline-none focus:border-[#22C55E]" />
              <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Song notes" className="rounded-xl border border-[#3d4a3d]/30 bg-[#131313] p-3 outline-none focus:border-[#22C55E]" />
            </div>
            <div className="space-y-4 rounded-2xl border border-[#3d4a3d]/20 bg-[#1a1a1a] p-6">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-[#bccbb9]">Audio File (Optional)</label>
                {existingAudio && !selectedAudioFile && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#22C55E]">
                    <span className="material-symbols-outlined text-sm">check_circle</span> CURRENTLY ATTACHED
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => audioInputRef.current?.click()}
                  className={`flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition-all ${
                    selectedAudioFile 
                      ? "border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]" 
                      : "border-[#3d4a3d]/40 bg-[#131313] text-[#bccbb9] hover:border-[#22C55E]/50"
                  }`}
                >
                  <span className="material-symbols-outlined">
                    {selectedAudioFile ? "check_circle" : "audiotrack"}
                  </span>
                  {selectedAudioFile ? selectedAudioFile.name : existingAudio ? "REPLACE AUDIO" : "SELECT AUDIO FILE"}
                </button>
                
                {selectedAudioFile && (
                  <button onClick={() => setSelectedAudioFile(null)} className="text-[#bccbb9] hover:text-red-400">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
                <input 
                  type="file" 
                  ref={audioInputRef} 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedAudioFile(file);
                      if (!title || title === "New Song") {
                        setTitle(file.name.replace(/\.[^/.]+$/, ""));
                      }
                    }
                  }} 
                  className="hidden" 
                  accept="audio/*" 
                />
              </div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-600">Supports MP3, WAV, M4A. Auto-sync works best with clear vocals.</p>
            </div>

            <div className="flex gap-4 pt-6">
              <button 
                onClick={onSave} 
                disabled={uploadingId !== null || isSaving}
                className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-[#22C55E] py-4 font-black text-[#003915] transition-transform active:scale-95 disabled:opacity-50"
              >
                {uploadingId || isSaving ? (
                  <>
                    <span className="animate-spin material-symbols-outlined">sync</span>
                    {uploadingId ? "UPLOADING..." : "SAVING..."}
                  </>
                ) : (
                  "SAVE ASSET"
                )}
              </button>

              {editingId && existingAudio && (
                <button
                  onClick={async () => {
                    if (uploadingId) return;
                    setUploadingId(editingId);
                    try {
                      setAiStatus("Sending audio to AI provider...");
                      await autoSync(editingId);
                      showToast("AI Sync complete! Lyrics updated.");
                      // The context will update 'songs', but we should refresh our local rawLyrics
                      const updatedSong = songs.find(s => s.id === editingId);
                      if (updatedSong) {
                        setRawLyrics(updatedSong.rawLyrics);
                      }
                    } catch (err) {
                      showToast(err.message, "error");
                    } finally {
                      setUploadingId(null);
                      setAiStatus("");
                    }
                  }}
                  disabled={uploadingId !== null}
                  className="flex items-center justify-center gap-3 rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10 px-6 font-bold text-[#22C55E] transition-all hover:bg-[#22C55E]/20"
                  title="AI Auto-Sync (Beta)"
                >
                  <span className={`material-symbols-outlined ${uploadingId ? "animate-pulse" : ""}`}>auto_fix_high</span>
                  AI SYNC
                </button>
              )}
              {aiStatus && (
                <p className="text-xs font-bold uppercase tracking-wider text-[#22C55E]">{aiStatus}</p>
              )}
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
            <div className="flex flex-wrap gap-2 rounded-xl border border-[#3d4a3d]/20 bg-[#1a1a1a] p-3 text-xs">
              <button onClick={() => setPreviewMode(!previewMode)} className="rounded-lg bg-[#2a2a2a] px-3 py-2 font-bold text-[#22C55E]">{previewMode ? "EDIT" : "PREVIEW"}</button>
              <input value={offset} onChange={(e) => setOffset(e.target.value)} type="number" step="0.05" className="w-24 rounded-lg bg-[#0a0a0a] px-3 py-2" />
              <button onClick={applyOffset} className="rounded-lg bg-[#2a2a2a] px-3 py-2 font-bold">APPLY OFFSET</button>
              <button onClick={tapTimestamp} className="rounded-lg bg-[#22C55E] px-3 py-2 font-black text-[#003915]">TAP TO TIMESTAMP LINE {tapIndex + 1}</button>
              <audio controls src={existingAudio || undefined} onPlay={(e) => setTimingAudio(e.currentTarget)} onTimeUpdate={(e) => setTimingAudio(e.currentTarget)} className="h-8 max-w-full" />
            </div>
            {!lrcValidation.valid && <div className="rounded-xl border border-yellow-400/30 bg-yellow-950/40 p-3 text-xs text-yellow-100">{lrcValidation.issues.slice(0, 4).map((issue) => <div key={`${issue.line}-${issue.message}`}>Line {issue.line}: {issue.message}</div>)}</div>}
            <div className="flex h-16 items-end gap-1 rounded-xl border border-[#3d4a3d]/20 bg-[#0a0a0a] p-3" aria-label="Waveform preview">{Array.from({ length: 64 }).map((_, index) => <span key={index} className="w-1 rounded bg-[#22C55E]/60" style={{ height: `${20 + ((index * 17) % 44)}px` }} />)}</div>
            {previewMode ? (
              <div className="min-h-[400px] flex-1 overflow-auto rounded-xl border border-[#3d4a3d]/30 bg-[#0a0a0a] p-6 font-mono text-sm">{parsedPreview.map((line, index) => <div key={`${line.time}-${index}`} className={index === tapIndex ? "text-[#22C55E]" : "text-[#e5e2e1]"}>[{formatLrcTime(line.time)}] {line.text}</div>)}</div>
            ) : (
              <textarea
                value={rawLyrics}
                onChange={(e) => setRawLyrics(e.target.value)}
                placeholder="[00:05.00] Line one\n[00:10.00] Line two..."
                className="min-h-[400px] flex-1 resize-none rounded-xl border border-[#3d4a3d]/30 bg-[#0a0a0a] p-6 font-mono text-sm outline-none focus:border-[#22C55E]"
              />
            )}
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1]">
      <Navbar />
      <div className="p-8 pt-32 md:p-12 md:pt-32">
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
                  onClick={() => { if (window.confirm(`Remove audio from ${song.title}?`)) removeAudio(song.id).then(() => showToast("Audio removed.")).catch((err) => showToast(err.message, "error")); }}
                  className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  title="Remove audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
              {/* AI Auto-Sync Button */}
              {song.audio && (
                <button
                  onClick={async () => {
                    if (uploadingId) return;
                    setUploadingId(song.id);
                    try {
                      setAiStatus(`Syncing ${song.title}...`);
                      await autoSync(song.id);
                      showToast("AI Sync complete!");
                    } catch (err) {
                      showToast(err.message, "error");
                    } finally {
                      setUploadingId(null);
                      setAiStatus("");
                    }
                  }}
                  disabled={uploadingId === song.id}
                  className={`rounded-lg p-2 transition-all ${
                    uploadingId === song.id
                      ? "animate-pulse text-[#22C55E]"
                      : "text-zinc-500 hover:bg-[#22C55E]/10 hover:text-[#22C55E]"
                  }`}
                  title="AI Auto-Sync (Beta)"
                >
                  <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                </button>
              )}
              <button
                onClick={() => { if (window.confirm(`Delete ${song.title}? This cannot be undone.`)) deleteSong(song.id).then(() => showToast("Song deleted.")).catch((err) => showToast(err.message, "error")); }}
                className="p-2 text-red-500/40 transition-colors hover:text-red-500"
                title="Delete song"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
            <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#22C55E] opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}

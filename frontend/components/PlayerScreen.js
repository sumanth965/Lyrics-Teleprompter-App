"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSongs } from "../contexts/SongsContext";
import { useSettings } from "../contexts/SettingsContext";
import useScroll from "../hooks/useScroll";
import useAudioSync from "../hooks/useAudioSync";
import LyricsDisplay from "./LyricsDisplay";
import Controls from "./Controls";
import AudioPlayer from "./AudioPlayer";

export default function PlayerScreen({ songId, routeBase = "/player" }) {
  const { songs, uploadAudio, removeAudio } = useSongs();
  const { settings, updateSettings, isSettingsLoaded } = useSettings();
  const selectedSong = useMemo(() => songs.find((song) => song.id === songId) ?? null, [songId, songs]);
  const lyrics = selectedSong?.lyrics ?? [];
  const audioSrc = selectedSong?.audio;

  const [speed, setSpeed] = useState(settings.scrollSpeed);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetToken, setResetToken] = useState(0);


  const {
    audioRef,
    currentTime,
    duration,
    activeIndex,
    isAudioReady,
    audioError,
    handleCanPlay,
    handleLoadedMetadata,
    handleTimeUpdate,
    handleEnded,
    handleAudioError,
    seekTo,
  } = useAudioSync({
    lyrics,
    isPlaying,
    playbackRate: speed,
    resetToken,
  });

  const { containerRef, followElement, restartScroll } = useScroll({
    isPlaying: settings.autoScroll && isPlaying,
    speed,
  });

  const isAudioMissing = !audioSrc;

  const onAudioUpload = useCallback(async (file) => {
    if (!selectedSong) return;
    try {
      await uploadAudio(selectedSong.id, file);
    } catch (err) {
      console.error(err);
    }
  }, [selectedSong, uploadAudio]);

  const onAudioRemove = useCallback(async () => {
    if (!selectedSong) return;
    try {
      await removeAudio(selectedSong.id);
    } catch (err) {
      console.error(err);
    }
  }, [selectedSong, removeAudio]);

  const onPlayPause = useCallback(() => {
    if (isAudioMissing || !isAudioReady || audioError) return;
    setIsPlaying((prev) => !prev);
  }, [audioError, isAudioMissing, isAudioReady]);

  const onRestart = useCallback(() => {
    setIsPlaying(false);
    restartScroll();
    setResetToken((value) => value + 1);
  }, [restartScroll]);

  const onSpeedChange = useCallback((nextSpeed) => {
    setSpeed(nextSpeed);
    updateSettings({ scrollSpeed: nextSpeed }).catch(console.error);
  }, [updateSettings]);

  const onSeek = useCallback((nextTime) => {
    seekTo(nextTime);
  }, [seekTo]);

  const onKeyDown = useCallback((event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      onPlayPause();
      return;
    }

    if (event.code === "ArrowUp") {
      event.preventDefault();
      onSpeedChange(Math.min(3, Number((speed + 0.1).toFixed(1))));
      return;
    }

    if (event.code === "ArrowDown") {
      event.preventDefault();
      onSpeedChange(Math.max(0.5, Number((speed - 0.1).toFixed(1))));
    }
  }, [onPlayPause, onSpeedChange, speed]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  if (!selectedSong) {
    return (
      <div className="flex h-screen items-center justify-center bg-black px-6 text-center text-white">
        <p className="text-lg text-zinc-300">Song not found. Please select a song from the library.</p>
      </div>
    );
  }

  const controlsDisabled = isAudioMissing || !isAudioReady || audioError;

  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={`relative h-screen overflow-hidden ${settings.theme === "dark" ? "bg-black text-white" : "bg-white text-zinc-950"}`}>
      {/* Hidden Audio Element for Logic */}
      <audio
        ref={audioRef}
        src={audioSrc}
        className="hidden"
        onTimeUpdate={(event) => handleTimeUpdate(event.currentTarget.currentTime)}
        onCanPlay={handleCanPlay}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          handleEnded();
        }}
        onError={() => {
          setIsPlaying(false);
          handleAudioError();
        }}
      />


      {/* Advanced Responsive Header */}
      <header className="absolute top-0 z-40 w-full border-b border-zinc-800/50 bg-black/60 px-4 py-3 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link 
            href="/library" 
            className="flex items-center gap-2 rounded-full bg-zinc-800/80 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="hidden sm:inline">Library</span>
          </Link>

          <div className="flex-1 text-center">
            <h1 className="truncate text-base font-bold md:text-xl">{selectedSong.title}</h1>
            <p className="truncate text-xs text-zinc-400 md:text-sm">{selectedSong.artist}</p>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`rounded-full p-2 transition ${showSettings ? "bg-green-500 text-black" : "bg-zinc-800/80 text-white hover:bg-zinc-700"}`}
            aria-label="Toggle Settings"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </button>
        </div>

        {/* Horizontal Song Navigation */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {songs.map((song) => (
            <Link
              key={song.id}
              href={`${routeBase}?songId=${song.id}`}
              className={`whitespace-nowrap rounded-full px-4 py-1 text-xs transition-all ${
                song.id === selectedSong.id
                  ? "bg-green-500 font-bold text-black shadow-lg shadow-green-500/20"
                  : "border border-zinc-700/50 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {song.title}
            </Link>
          ))}
        </div>
      </header>

      {/* Settings Overlay */}
      {showSettings && (
        <div className="absolute top-24 left-4 right-4 z-50 rounded-2xl border border-zinc-800 bg-zinc-900/95 p-6 shadow-2xl backdrop-blur-2xl transition-all md:left-auto md:right-8 md:w-96">

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Stage Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-zinc-400 hover:text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Font Size</span>
                  <span className="font-mono text-green-400">{settings.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="96"
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: Number(e.target.value) }).catch(console.error)}
                  className="w-full accent-green-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Line Spacing</span>
                  <span className="font-mono text-green-400">{settings.lineSpacing}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="2.8"
                  step="0.1"
                  value={settings.lineSpacing}
                  onChange={(e) => updateSettings({ lineSpacing: Number(e.target.value) }).catch(console.error)}
                  className="w-full accent-green-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Scroll Speed</span>
                  <span className="font-mono text-green-400">{speed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={speed}
                  onChange={(e) => onSpeedChange(Number(e.target.value))}
                  className="w-full accent-green-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" }).catch(console.error)}
                  className="flex-1 rounded-xl border border-zinc-700 py-3 text-sm font-medium transition hover:bg-zinc-800"
                >
                  {settings.theme === "dark" ? "🌙 Dark" : "☀️ Light"}
                </button>
                <button
                  onClick={() => updateSettings({ autoScroll: !settings.autoScroll }).catch(console.error)}
                  className={`flex-1 rounded-xl border py-3 text-sm font-medium transition ${settings.autoScroll ? "border-green-500/50 bg-green-500/10 text-green-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"}`}
                >
                  Scroll: {settings.autoScroll ? "ON" : "OFF"}
                </button>
              </div>

              {/* Audio Management */}
              <div className="pt-4 border-t border-zinc-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Audio Source</h3>
                {audioSrc ? (
                  <div className="flex items-center justify-between rounded-xl bg-zinc-800/50 p-3">
                    <div className="flex items-center gap-2 truncate">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                      <span className="truncate text-xs text-zinc-300">Audio Linked</span>
                    </div>
                    <button
                      onClick={onAudioRemove}
                      className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 p-4 transition hover:border-green-500/50 hover:bg-zinc-800">
                    <svg className="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    <span className="text-sm font-bold text-zinc-400">Upload Audio</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="audio/*"
                      onChange={(e) => onAudioUpload(e.target.files[0])}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      <div ref={containerRef} className="teleprompter-scroll h-full overflow-y-auto pt-44 pb-44">


        {lyrics.length === 0 ? (
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-[35vh] text-center">
            <p className="text-xl text-zinc-400 md:text-2xl">No lyrics available for this song.</p>
          </div>
        ) : (
          <LyricsDisplay
            lyrics={lyrics}
            activeIndex={activeIndex}
            onActiveLineChange={followElement}
            fontSize={settings.fontSize}
            lineSpacing={settings.lineSpacing}
            darkMode={settings.theme === "dark"}
          />
        )}
      </div>

      <Controls
        isPlaying={isPlaying}
        onPlayPause={onPlayPause}
        onRestart={onRestart}
        speed={speed}
        onSpeedChange={onSpeedChange}
        disabled={controlsDisabled}
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
      />
    </div>
  );
}

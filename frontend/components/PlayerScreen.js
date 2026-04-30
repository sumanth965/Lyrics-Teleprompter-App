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

  return (
    <div className={`h-screen overflow-hidden ${settings.theme === "dark" ? "bg-black text-white" : "bg-zinc-100 text-zinc-950"}`}>
      <AudioPlayer
        src={audioSrc}
        audioRef={audioRef}
        songId={songId}
        hasAudio={!isAudioMissing}
        onUpload={onAudioUpload}
        onRemove={isAudioMissing ? undefined : onAudioRemove}
        onTimeUpdate={handleTimeUpdate}
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

      <div ref={containerRef} className="teleprompter-scroll h-full overflow-y-auto pb-44">
        <div className="sticky top-0 z-10 border-b border-zinc-800 bg-black/80 px-6 py-4 text-center backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-zinc-400">Now playing</p>
          <h1 className="text-xl font-bold md:text-2xl">{selectedSong.title}</h1>
          <p className="text-sm text-zinc-400 md:text-base">{selectedSong.artist}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <Link href="/library" className="rounded-full border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-900">
              Library
            </Link>
            {songs.map((song) => (
              <Link
                key={song.id}
                href={`${routeBase}?songId=${song.id}`}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  song.id === selectedSong.id
                    ? "bg-green-500 font-semibold text-black"
                    : "border border-zinc-700 text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                {song.title}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs">
            <label className="flex items-center gap-2">
              Font
              <input
                type="range"
                min="24"
                max="96"
                value={settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: Number(e.target.value) }).catch(console.error)}
              />
            </label>
            <label className="flex items-center gap-2">
              Line Spacing
              <input
                type="range"
                min="1"
                max="2.8"
                step="0.1"
                value={settings.lineSpacing}
                onChange={(e) => updateSettings({ lineSpacing: Number(e.target.value) }).catch(console.error)}
              />
            </label>
            <button
              type="button"
              onClick={() => updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" }).catch(console.error)}
              className="rounded border border-zinc-600 px-2 py-1"
            >
              Theme: {settings.theme}
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ autoScroll: !settings.autoScroll }).catch(console.error)}
              className="rounded border border-zinc-600 px-2 py-1"
            >
              Auto Scroll: {settings.autoScroll ? "On" : "Off"}
            </button>
          </div>
          {!isSettingsLoaded && <p className="mt-2 text-xs text-zinc-400">Loading saved settings...</p>}
        </div>

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

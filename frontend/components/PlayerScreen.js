"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSongs } from "../contexts/SongsContext";
import useScroll from "../hooks/useScroll";
import useAudioSync from "../hooks/useAudioSync";
import LyricsDisplay from "./LyricsDisplay";
import Controls from "./Controls";
import AudioPlayer from "./AudioPlayer";

export default function PlayerScreen({ songId, routeBase = "/player" }) {
  const { songs } = useSongs();
  const selectedSong = useMemo(() => songs.find((song) => song.id === songId) ?? null, [songId, songs]);
  const lyrics = selectedSong?.lyrics ?? [];
  const audioSrc = selectedSong?.audio;

  const [speed, setSpeed] = useState(1);
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

  const { containerRef, followElement, restartScroll } = useScroll({ isPlaying, speed });

  const isAudioMissing = !audioSrc;

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
  }, []);

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
      setSpeed((prev) => Math.min(3, Number((prev + 0.1).toFixed(1))));
      return;
    }

    if (event.code === "ArrowDown") {
      event.preventDefault();
      setSpeed((prev) => Math.max(0.5, Number((prev - 0.1).toFixed(1))));
    }
  }, [onPlayPause]);

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
    <div className="h-screen overflow-hidden bg-black text-white">
      <AudioPlayer
        src={audioSrc}
        audioRef={audioRef}
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

      <div ref={containerRef} className="teleprompter-scroll h-full overflow-y-auto pb-36">
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
        </div>

        {lyrics.length === 0 ? (
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-[35vh] text-center">
            <p className="text-xl text-zinc-400 md:text-2xl">No lyrics available for this song.</p>
          </div>
        ) : (
          <LyricsDisplay lyrics={lyrics} activeIndex={activeIndex} onActiveLineChange={followElement} />
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

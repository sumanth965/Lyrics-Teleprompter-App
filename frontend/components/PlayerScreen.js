"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import songs from "../data/songs.json";
import useScroll from "../hooks/useScroll";
import useAudioSync from "../hooks/useAudioSync";
import LyricsDisplay from "./LyricsDisplay";
import Controls from "./Controls";
import AudioPlayer from "./AudioPlayer";

export default function PlayerScreen({ songId }) {
  const selectedSong = useMemo(() => songs.find((song) => song.id === songId) ?? null, [songId]);
  const lyrics = selectedSong?.lyrics ?? [];
  const audioSrc = selectedSong?.audio;

  const [speed, setSpeed] = useState(1);
  const [audioTime, setAudioTime] = useState(0);
  const [restartTick, setRestartTick] = useState(0);
  const [audioReady, setAudioReady] = useState(false);

  const { containerRef, isPlaying, play, pause, restart, followElement } = useScroll(speed);
  const syncedIndex = useAudioSync(lyrics, audioTime);
  const isAudioMissing = !audioSrc;

  const animationFrameRef = useRef(null);
  const latestTimeRef = useRef(0);

  const debouncedTimeUpdate = useCallback((nextTime) => {
    latestTimeRef.current = nextTime;

    if (animationFrameRef.current) return;

    animationFrameRef.current = requestAnimationFrame(() => {
      setAudioTime(latestTimeRef.current);
      animationFrameRef.current = null;
    });
  }, []);

  useEffect(() => () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const onPlayPause = useCallback(() => {
    if (isAudioMissing) return;
    if (isPlaying) pause();
    else play();
  }, [isAudioMissing, isPlaying, pause, play]);

  const onRestart = useCallback(() => {
    pause();
    restart();
    setAudioTime(0);
    setRestartTick((value) => value + 1);
  }, [pause, restart]);

  const onSpeedChange = useCallback((nextSpeed) => {
    setSpeed(nextSpeed);
  }, []);

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

  const controlsDisabled = isAudioMissing || !audioReady;

  return (
    <div className="h-screen overflow-hidden bg-black text-white">
      <AudioPlayer
        src={audioSrc}
        isPlaying={isPlaying}
        playbackRate={speed}
        onTimeUpdate={debouncedTimeUpdate}
        onCanPlay={() => setAudioReady(true)}
        onEnded={pause}
        resetToken={restartTick}
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
                href={`/player?songId=${song.id}`}
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
          <LyricsDisplay lyrics={lyrics} activeIndex={syncedIndex} onActiveLineChange={followElement} />
        )}
      </div>

      <Controls
        isPlaying={isPlaying}
        onPlayPause={onPlayPause}
        onRestart={onRestart}
        speed={speed}
        onSpeedChange={onSpeedChange}
        disabled={controlsDisabled}
      />
    </div>
  );
}

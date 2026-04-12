"use client";

import { useEffect, useRef } from "react";

export default function AudioPlayer({
  src,
  isPlaying,
  playbackRate,
  onTimeUpdate,
  onCanPlay,
  onEnded,
  resetToken,
}) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (!audioRef.current || !src) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // user gesture lock or unsupported media
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, src]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
  }, [resetToken]);

  if (!src) {
    return (
      <div className="fixed right-4 top-4 z-20 w-72 rounded-lg border border-zinc-800 bg-zinc-900/90 p-3">
        <p className="mb-2 text-xs uppercase tracking-wide text-zinc-400">Audio Sync</p>
        <p className="text-sm text-zinc-500">Audio file is missing for this song.</p>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-4 z-20 w-72 rounded-lg border border-zinc-800 bg-zinc-900/90 p-3">
      <p className="mb-2 text-xs uppercase tracking-wide text-zinc-400">Audio Sync</p>
      <audio
        ref={audioRef}
        src={src}
        controls
        className="w-full"
        onTimeUpdate={(event) => onTimeUpdate(event.currentTarget.currentTime)}
        onLoadedData={onCanPlay}
        onEnded={onEnded}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

export default function AudioPlayer({ src, isPlaying, onTimeUpdate, onRestart }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // Ignore autoplay interruption until the user interacts.
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
  }, [onRestart]);

  if (!src) return null;

  return (
    <div className="fixed right-4 top-4 z-20 w-72 rounded-lg border border-zinc-800 bg-zinc-900/90 p-3">
      <p className="mb-2 text-xs uppercase tracking-wide text-zinc-400">Audio Sync</p>
      <audio
        ref={audioRef}
        src={src}
        controls
        className="w-full"
        onTimeUpdate={(event) => onTimeUpdate(event.currentTarget.currentTime)}
      />
    </div>
  );
}

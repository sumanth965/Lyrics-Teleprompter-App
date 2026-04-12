"use client";

import { useEffect, useRef } from "react";

export default function AudioPlayer({
  src,
  isPlaying,
  speed,
  restartSignal,
  onTimeUpdate,
  onDuration,
  onEnded,
  onError,
}) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    onTimeUpdate(0);
  }, [restartSignal, onTimeUpdate]);

  if (!src) {
    return (
      <div className="rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm text-red-200">
        Audio file is missing for this song.
      </div>
    );
  }

  return (
    <audio
      ref={audioRef}
      src={src}
      preload="metadata"
      onLoadedMetadata={(event) => onDuration(event.currentTarget.duration || 0)}
      onTimeUpdate={(event) => onTimeUpdate(event.currentTarget.currentTime)}
      onEnded={onEnded}
      onError={onError}
      className="hidden"
    />
  );
}

"use client";

import { formatSeconds } from "../utils/timeHelper";
import SpeedSlider from "./SpeedSlider";

export default function Controls({
  isPlaying,
  onPlayPause,
  onRestart,
  speed,
  onSpeedChange,
  disabled = false,
  currentTime = 0,
  duration = 0,
  onSeek,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950/90 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPlayPause}
            disabled={disabled}
            className="rounded-full bg-green-500 px-5 py-2 font-semibold text-black transition enabled:hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button
            type="button"
            onClick={onRestart}
            disabled={disabled}
            className="rounded-full border border-zinc-600 px-5 py-2 font-semibold text-white transition enabled:hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Restart
          </button>
        </div>

        <div className="flex w-full max-w-xl flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>{formatSeconds(currentTime)}</span>
            <span>{formatSeconds(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.max(duration, 0)}
            step="0.01"
            value={Math.min(currentTime, duration || 0)}
            disabled={disabled || duration <= 0}
            onChange={(event) => onSeek(Number(event.target.value))}
            className="w-full accent-green-400 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Playback progress"
          />
        </div>

        <SpeedSlider value={speed} onChange={onSpeedChange} disabled={disabled} />
      </div>
    </div>
  );
}

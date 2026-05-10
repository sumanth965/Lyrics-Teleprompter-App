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
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800/50 bg-black/60 px-4 py-4 pb-8 backdrop-blur-xl md:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
        
        {/* Playback Actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onPlayPause}
            disabled={disabled}
            className={`group relative flex h-14 w-14 items-center justify-center rounded-full transition-all active:scale-95 ${
              isPlaying 
                ? "bg-zinc-800 text-white hover:bg-zinc-700" 
                : "bg-green-500 text-black hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isPlaying ? (
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="h-6 w-6 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <button
            type="button"
            onClick={onRestart}
            disabled={disabled}
            className="flex h-12 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-6 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <span>Restart</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex w-full flex-1 flex-col gap-2">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
            <span>{formatSeconds(currentTime)}</span>
            <div className="h-1 w-1 rounded-full bg-zinc-800" />
            <span>{formatSeconds(duration)}</span>
          </div>
          <div className="relative group">
            <input
              type="range"
              min="0"
              max={Math.max(duration, 0)}
              step="0.01"
              value={Math.min(currentTime, duration || 0)}
              disabled={disabled || duration <= 0}
              onChange={(event) => onSeek(Number(event.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-green-500 transition-all hover:h-2 disabled:cursor-not-allowed"
              aria-label="Playback progress"
            />
          </div>
        </div>

        {/* Speed Control */}
        <div className="hidden w-48 md:block">
          <SpeedSlider value={speed} onChange={onSpeedChange} disabled={disabled} />
        </div>
      </div>
    </div>
  );
}

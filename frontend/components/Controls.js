"use client";

import SpeedSlider from "./SpeedSlider";

export default function Controls({ isPlaying, speed, onTogglePlay, onRestart, currentTime, duration, onSpeedChange }) {
  return (
    <div className="sticky bottom-0 left-0 right-0 border-t border-zinc-800 bg-black/95 px-4 py-4 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTogglePlay}
            className="rounded-xl bg-yellow-400 px-6 py-2.5 font-semibold text-black transition-all duration-300 hover:bg-yellow-300"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="rounded-xl border border-zinc-600 px-6 py-2.5 font-semibold text-white transition-all duration-300 hover:border-zinc-400"
          >
            Restart
          </button>
          <div className="text-sm text-gray-400">
            {currentTime} / {duration}
          </div>
        </div>

        <SpeedSlider value={speed} onChange={onSpeedChange} />
      </div>
    </div>
  );
}

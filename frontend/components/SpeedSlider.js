"use client";

export default function SpeedSlider({ value, onChange, disabled = false }) {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <label htmlFor="speed" className="text-sm text-zinc-300">
        Scroll Speed: <span className="font-semibold text-white">{value.toFixed(1)}x</span>
      </label>
      <input
        id="speed"
        type="range"
        min="0.5"
        max="3"
        step="0.1"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-green-400 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

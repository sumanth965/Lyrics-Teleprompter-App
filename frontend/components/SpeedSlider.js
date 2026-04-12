"use client";

export default function SpeedSlider({ value, onChange }) {
  return (
    <div className="w-full max-w-sm">
      <label htmlFor="speed" className="mb-2 block text-sm text-gray-300">
        Speed: <span className="font-semibold text-yellow-400">{value.toFixed(1)}x</span>
      </label>
      <input
        id="speed"
        type="range"
        min="0.5"
        max="3"
        step="0.1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-700 accent-yellow-400"
      />
    </div>
  );
}

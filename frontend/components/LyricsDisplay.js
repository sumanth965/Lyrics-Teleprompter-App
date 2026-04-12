"use client";

import { memo, useEffect, useRef } from "react";

function LyricsDisplay({ lyrics, activeIndex, onActiveLineChange }) {
  const lineRefs = useRef([]);

  useEffect(() => {
    if (activeIndex < 0) return;
    const activeLine = lineRefs.current[activeIndex];
    if (activeLine) {
      onActiveLineChange?.(activeLine);
    }
  }, [activeIndex, onActiveLineChange]);

  if (!Array.isArray(lyrics) || lyrics.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-[35vh] text-center">
        <p className="text-xl text-zinc-400 md:text-2xl">No lyrics available for this song.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-[35vh] text-center">
      {lyrics.map((line, index) => (
        <p
          key={`${line.time}-${index}`}
          ref={(element) => {
            lineRefs.current[index] = element;
          }}
          className={`text-2xl leading-relaxed transition-all duration-300 md:text-4xl ${
            index === activeIndex
              ? "scale-105 font-semibold text-green-400 brightness-110 opacity-100"
              : "text-zinc-400 opacity-60"
          }`}
        >
          {line.text}
        </p>
      ))}
    </div>
  );
}

export default memo(LyricsDisplay);

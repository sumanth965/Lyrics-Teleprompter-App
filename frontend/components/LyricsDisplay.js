"use client";

import { useEffect, useRef } from "react";

export default function LyricsDisplay({ lyrics, activeIndex }) {
  const lineRefs = useRef([]);

  useEffect(() => {
    const activeLine = lineRefs.current[activeIndex];
    if (activeLine) {
      activeLine.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-[35vh] text-center">
      {lyrics.map((line, index) => (
        <p
          key={`${line.time}-${index}`}
          ref={(element) => {
            lineRefs.current[index] = element;
          }}
          className={`text-2xl leading-relaxed transition-all duration-500 md:text-4xl ${
            index === activeIndex
              ? "scale-105 font-semibold text-green-400"
              : "text-zinc-400"
          }`}
        >
          {line.text}
        </p>
      ))}
    </div>
  );
}

"use client";

import { memo } from "react";

function LyricsDisplay({ lyrics, activeIndex, lineRefs }) {
  if (!lyrics?.length) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 text-center text-lg text-gray-400">
        No lyrics found for this song.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-[32vh] text-center">
      <div className="space-y-7">
        {lyrics.map((line, index) => {
          const isActive = index === activeIndex;

          return (
            <p
              key={`${line.time}-${index}`}
              ref={(element) => {
                lineRefs.current[index] = element;
              }}
              className={`text-2xl md:text-4xl leading-relaxed transition-all duration-300 will-change-transform ${
                isActive
                  ? "text-yellow-400 scale-110 font-semibold opacity-100"
                  : "text-gray-400 opacity-50 blur-[0.4px]"
              }`}
            >
              {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default memo(LyricsDisplay);

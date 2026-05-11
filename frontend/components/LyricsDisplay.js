"use client";

import { memo, useEffect, useRef } from "react";

function LyricsDisplay({ lyrics, activeIndex, onActiveLineChange, fontSize = 48, lineSpacing = 1.6, darkMode = true }) {
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
    <div className="scrolling-content mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-[45vh] text-center">

      {lyrics.map((line, index) => {
        const isMarker = line.isMarker;
        const isActive = index === activeIndex;
        
        return (
          <p
            key={`${line.time}-${index}`}
            ref={(element) => {
              lineRefs.current[index] = element;
            }}
            style={{ 
              fontSize: isMarker ? `${fontSize * 0.5}px` : `${fontSize}px`, 
              lineHeight: lineSpacing,
              marginTop: isMarker ? "2rem" : "0",
              marginBottom: isMarker ? "0.5rem" : "0"
            }}
            className={`transition-all duration-100 ${
              isMarker 
                ? "italic text-zinc-500 font-medium tracking-widest uppercase" 
                : isActive
                  ? "scale-105 font-semibold text-green-400 brightness-110 opacity-100"
                  : darkMode
                    ? "text-zinc-400 opacity-60"
                    : "text-zinc-600 opacity-70"
            }`}

          >
            {line.text}
          </p>
        );
      })}

    </div>
  );
}

export default memo(LyricsDisplay);

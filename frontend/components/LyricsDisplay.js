"use client";

import { memo, useEffect, useMemo, useRef } from "react";

function LyricsDisplay({ lyrics, activeIndex, activeWordIndex = -1, wordHighlight = false, onActiveLineChange, fontSize = 48, lineSpacing = 1.6, darkMode = true }) {
  const lineRefs = useRef([]);

  useEffect(() => {
    if (activeIndex < 0) return;
    const activeLine = lineRefs.current[activeIndex];
    if (activeLine) {
      onActiveLineChange?.(activeLine);
    }
  }, [activeIndex, onActiveLineChange]);

  const renderedLines = useMemo(() => lyrics.map((line) => ({ ...line, words: String(line.text || "").split(/(\s+)/) })), [lyrics]);

  if (!Array.isArray(lyrics) || lyrics.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-[35vh] text-center">
        <p className="text-xl text-zinc-400 md:text-2xl">No lyrics available for this song.</p>
      </div>
    );
  }

  return (
    <div className="scrolling-content mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-[45vh] text-center">

      {renderedLines.map((line, index) => {
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
            {wordHighlight && isActive && !isMarker
              ? line.words.map((word, wordIndex) => {
                const lyricWordIndex = line.words.slice(0, wordIndex + 1).filter((part) => part.trim()).length - 1;
                const isActiveWord = word.trim() && lyricWordIndex === activeWordIndex;
                return (
                  <span
                    key={`${word}-${wordIndex}`}
                    className={isActiveWord ? "rounded-md bg-green-400 px-1 text-black shadow-lg shadow-green-400/20" : undefined}
                  >
                    {word}
                  </span>
                );
              })
              : line.text}
          </p>
        );
      })}

    </div>
  );
}

export default memo(LyricsDisplay);

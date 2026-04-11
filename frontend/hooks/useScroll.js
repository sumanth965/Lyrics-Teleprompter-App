"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Auto-scroll helper for teleprompter mode.
 * Uses setInterval for predictable speed control.
 */
export default function useScroll(speed = 1) {
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying || !containerRef.current) return;

    const interval = setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop += speed * 0.8;
      }
    }, 16);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const restart = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  return {
    containerRef,
    isPlaying,
    play,
    pause,
    restart,
  };
}

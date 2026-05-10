"use client";

import { useCallback, useEffect, useRef } from "react";
import { computeCenteredScrollTop, smoothStep } from "../utils/scrollHelper";

export default function useScroll({ isPlaying, speed = 1 }) {
  const containerRef = useRef(null);
  const targetScrollRef = useRef(0);
  const rafRef = useRef(null);

  const lastUserScrollRef = useRef(0);
  const isUserScrollingRef = useRef(false);

  const stopAnimation = useCallback(() => {
    if (!rafRef.current) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = () => {
      isUserScrollingRef.current = true;
      lastUserScrollRef.current = Date.now();
    };

    container.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleWheel, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleWheel);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      stopAnimation();
      return;
    }

    const tick = () => {
      const container = containerRef.current;
      if (!container) return;

      // Resume auto-scroll after 3 seconds of no user interaction
      if (isUserScrollingRef.current && Date.now() - lastUserScrollRef.current > 3000) {
        isUserScrollingRef.current = false;
      }

      if (!isUserScrollingRef.current) {
        // Increased easing for snappier response to lyric changes
        const easingFactor = Math.min(0.15 * speed, 0.5);
        container.scrollTop = smoothStep(container.scrollTop, targetScrollRef.current, easingFactor);
      }

      
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return stopAnimation;
  }, [isPlaying, speed, stopAnimation]);

  const followElement = useCallback((element) => {
    const container = containerRef.current;
    if (!container || !element) return;

    targetScrollRef.current = computeCenteredScrollTop(container, element);

    // If not playing, jump immediately
    if (!isPlaying) {
      container.scrollTop = targetScrollRef.current;
    }
  }, [isPlaying]);

  const restartScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    isUserScrollingRef.current = false;
    targetScrollRef.current = 0;
    container.scrollTop = 0;
  }, []);

  return {
    containerRef,
    followElement,
    restartScroll,
  };
}

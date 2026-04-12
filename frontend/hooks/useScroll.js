"use client";

import { useCallback, useEffect, useRef } from "react";
import { computeCenteredScrollTop, smoothStep } from "../utils/scrollHelper";

export default function useScroll({ isPlaying, speed = 1 }) {
  const containerRef = useRef(null);
  const targetScrollRef = useRef(0);
  const rafRef = useRef(null);

  const stopAnimation = useCallback(() => {
    if (!rafRef.current) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      stopAnimation();
      return;
    }

    const tick = () => {
      const container = containerRef.current;
      if (!container) return;

      const easingFactor = Math.min(0.08 * speed, 0.35);
      container.scrollTop = smoothStep(container.scrollTop, targetScrollRef.current, easingFactor);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return stopAnimation;
  }, [isPlaying, speed, stopAnimation]);

  const followElement = useCallback((element) => {
    const container = containerRef.current;
    if (!container || !element) return;

    targetScrollRef.current = computeCenteredScrollTop(container, element);

    if (!isPlaying) {
      container.scrollTop = targetScrollRef.current;
    }
  }, [isPlaying]);

  const restartScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    targetScrollRef.current = 0;
    container.scrollTop = 0;
  }, []);

  return {
    containerRef,
    followElement,
    restartScroll,
  };
}

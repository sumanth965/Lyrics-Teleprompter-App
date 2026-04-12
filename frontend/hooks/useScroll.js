"use client";

import { useEffect, useRef } from "react";
import { getCenteredScrollTop, smoothScrollTo } from "../utils/scrollHelper";

export default function useScroll({ activeIndex, speed = 1 }) {
  const containerRef = useRef(null);
  const lineRefs = useRef([]);

  useEffect(() => {
    if (activeIndex < 0) return;

    const container = containerRef.current;
    const target = lineRefs.current[activeIndex];

    if (!container || !target) return;

    const destination = getCenteredScrollTop(container, target);
    const duration = Math.max(120, 360 / speed);

    return smoothScrollTo(container, destination, duration);
  }, [activeIndex, speed]);

  return {
    containerRef,
    lineRefs,
  };
}

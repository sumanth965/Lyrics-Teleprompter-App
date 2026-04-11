"use client";

import { useMemo } from "react";

/**
 * Resolve which lyric line should be active based on current audio time.
 */
export default function useAudioSync(lyrics, currentTime) {
  return useMemo(() => {
    if (!Array.isArray(lyrics) || lyrics.length === 0) return 0;

    let index = 0;
    for (let i = 0; i < lyrics.length; i += 1) {
      if (currentTime >= lyrics[i].time) {
        index = i;
      } else {
        break;
      }
    }

    return index;
  }, [lyrics, currentTime]);
}

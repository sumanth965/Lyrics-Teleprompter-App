"use client";

import { useMemo } from "react";
import { findActiveLyricIndex } from "../utils/timeHelper";

export default function useAudioSync(lyrics, currentTime) {
  return useMemo(() => findActiveLyricIndex(lyrics, currentTime), [lyrics, currentTime]);
}

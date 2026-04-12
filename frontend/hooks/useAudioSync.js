"use client";

import { useMemo } from "react";
import { getActiveLyricIndex } from "../utils/timeHelper";

export default function useAudioSync(lyrics, currentTime) {
  return useMemo(() => getActiveLyricIndex(lyrics, currentTime), [lyrics, currentTime]);
}

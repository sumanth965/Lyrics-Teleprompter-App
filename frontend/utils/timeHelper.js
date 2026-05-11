export function findActiveLyricIndex(lyrics, currentTime) {
  if (!Array.isArray(lyrics) || lyrics.length === 0) return -1;

  let low = 0;
  let high = lyrics.length - 1;
  let active = -1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (currentTime >= Number(lyrics[mid]?.time ?? 0)) {
      active = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return active === -1 ? 0 : active;
}



export function formatSeconds(seconds) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

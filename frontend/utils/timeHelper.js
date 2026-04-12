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

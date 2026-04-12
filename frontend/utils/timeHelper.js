export function formatTime(seconds = 0) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function getActiveLyricIndex(lyrics = [], currentTime = 0) {
  if (!Array.isArray(lyrics) || lyrics.length === 0) {
    return -1;
  }

  let left = 0;
  let right = lyrics.length - 1;
  let answer = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (currentTime >= lyrics[mid].time) {
      answer = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return answer;
}

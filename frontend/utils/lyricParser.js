/**
 * Parses .lrc or .txt content into the internal lyrics format.
 * @param {string} content - The file content.
 * @returns {Array<{time: number, text: string}>}
 */
export function parseLyrics(content) {
  if (!content) return [];

  const lines = content.split(/\r?\n/);
  const lrcRegex = /^\[(\d+):(\d+(?:\.\d+)?)\](.*)/;
  const parsedLyrics = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(lrcRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      const text = match[3].trim();
      const time = minutes * 60 + seconds;
      parsedLyrics.push({ time, text });
    } else {
      // Fallback for plain text: assume 5s intervals if no timestamps found yet
      // In a real editor, users would sync these manually later.
      const lastTime = parsedLyrics.length > 0 ? parsedLyrics[parsedLyrics.length - 1].time : -5;
      parsedLyrics.push({ time: lastTime + 5, text: trimmed });
    }
  }

  return parsedLyrics.sort((a, b) => a.time - b.time);
}

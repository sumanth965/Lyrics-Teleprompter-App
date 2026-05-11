/**
 * Parses .lrc or .txt content into the internal lyrics format.
 * @param {string} content - The file content.
 * @returns {Array<{time: number, text: string}>}
 */
export function parseLyrics(content) {
  if (!content) return [];

  const lines = content.split(/\r?\n/);
  const lrcRegex = /^\[(\d+):(\d+(?:\.\d+)?)\](.*)/;
  // Matches lines that are just markers like [Verse 1], (Chorus), or {Bridge}
  const markerRegex = /^\[[^\]]+\]$|^\([^)]+\)$|^\{[^}]+\}$/;
  
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
      const isMarker = markerRegex.test(text);
      parsedLyrics.push({ time, text, isMarker });
    } else {
      const isMarker = markerRegex.test(trimmed);
      // Fallback for plain text or markers
      const lastTime = parsedLyrics.length > 0 ? parsedLyrics[parsedLyrics.length - 1].time : 0;
      
      if (isMarker) {
        // Markers start with the last time, will be fixed in second pass
        parsedLyrics.push({ time: lastTime, text: trimmed, isMarker: true });
      } else {
        // Only actual lyrics get the 5s fallback if no timestamps are present
        parsedLyrics.push({ time: lastTime + 5, text: trimmed, isMarker: false });
      }
    }
  }

  // Second pass: Ripple marker times backwards from the next timed lyric
  // This ensures markers appear right before their section without adding gaps.
  for (let i = parsedLyrics.length - 2; i >= 0; i--) {
    if (parsedLyrics[i].isMarker) {
      // Set marker time to just before the next element
      parsedLyrics[i].time = Math.max(0, parsedLyrics[i+1].time - 0.001);
    }
  }

  return parsedLyrics.sort((a, b) => a.time - b.time);
}


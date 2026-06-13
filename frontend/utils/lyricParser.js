/**
 * Parses .lrc or .txt content into the internal lyrics format.
 * @param {string} content - The file content.
 * @returns {Array<{time: number, text: string, isMarker?: boolean}>}
 */
export function parseLyrics(content) {
  if (!content) return [];

  const lines = content.split(/\r?\n/);
  const lrcRegex = /^\[(\d+):(\d+(?:\.\d+)?)\](.*)/;
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
      parsedLyrics.push({ time, text, isMarker: markerRegex.test(text) });
    } else {
      const isMarker = markerRegex.test(trimmed);
      const lastTime = parsedLyrics.length > 0 ? parsedLyrics[parsedLyrics.length - 1].time : 0;
      parsedLyrics.push({ time: isMarker ? lastTime : lastTime + 5, text: trimmed, isMarker });
    }
  }

  for (let i = parsedLyrics.length - 2; i >= 0; i--) {
    if (parsedLyrics[i].isMarker) {
      parsedLyrics[i].time = Math.max(0, parsedLyrics[i + 1].time - 0.001);
    }
  }

  return parsedLyrics.sort((a, b) => a.time - b.time);
}

export function formatLrcTime(seconds = 0) {
  const safe = Math.max(0, Number(seconds) || 0);
  const mins = Math.floor(safe / 60).toString().padStart(2, "0");
  const secs = (safe % 60).toFixed(2).padStart(5, "0");
  return `${mins}:${secs}`;
}

export function validateLrc(content) {
  const issues = [];
  const timestampRegex = /^\[(\d+):(\d+(?:\.\d{1,3})?)\]\s*(.*)$/;
  let previous = -1;

  content.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const match = trimmed.match(timestampRegex);
    if (!match) {
      issues.push({ line: index + 1, message: "Missing or invalid [mm:ss.xx] timestamp." });
      return;
    }
    const seconds = Number(match[1]) * 60 + Number(match[2]);
    if (Number(match[2]) >= 60) {
      issues.push({ line: index + 1, message: "Seconds must be less than 60." });
    }
    if (!match[3].trim()) {
      issues.push({ line: index + 1, message: "Lyric text is empty." });
    }
    if (seconds < previous) {
      issues.push({ line: index + 1, message: "Timestamp is earlier than the previous lyric." });
    }
    previous = seconds;
  });

  return { valid: issues.length === 0, issues };
}

export function applyLyricOffset(content, offsetSeconds) {
  const offset = Number(offsetSeconds) || 0;
  return content.split(/\r?\n/).map((line) => {
    const match = line.match(/^\[(\d+):(\d+(?:\.\d+)?)\](.*)$/);
    if (!match) return line;
    const nextTime = Number(match[1]) * 60 + Number(match[2]) + offset;
    return `[${formatLrcTime(nextTime)}]${match[3]}`;
  }).join("\n");
}

const { normalizeText, tokenize } = require("./lyricPreprocessor");

function levenshtein(a, b) {
  if (a === b) return 0;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let last = i - 1;
    prev[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = tmp;
    }
  }
  return prev[b.length];
}

function similarity(a, b) {
  const left = normalizeText(a);
  const right = normalizeText(b);
  if (!left && !right) return 1;
  if (!left || !right) return 0;
  return 1 - levenshtein(left, right) / Math.max(left.length, right.length);
}

function wordOverlap(a, b) {
  const left = new Set(tokenize(a));
  const right = tokenize(b);
  if (!left.size || !right.length) return 0;
  return right.filter((word) => left.has(word)).length / Math.max(left.size, right.length);
}

function findBestLyricMatch(transcript, lyricMeta, previousLineIndex = 0, sensitivity = 0.65) {
  const normalizedTranscript = normalizeText(transcript);
  if (!normalizedTranscript) return null;
  const radius = sensitivity > 0.75 ? 3 : sensitivity < 0.45 ? 12 : 7;
  const candidates = lyricMeta.lines
    .filter((line) => !line.isMarker && line.normalizedText)
    .map((line) => ({
      line,
      distance: Math.abs(line.index - previousLineIndex),
      local: Math.abs(line.index - previousLineIndex) <= radius,
    }))
    .filter((candidate) => candidate.local || sensitivity < 0.8);

  let best = null;
  for (const candidate of candidates) {
    const fuzzy = similarity(normalizedTranscript, candidate.line.normalizedText);
    const overlap = wordOverlap(candidate.line.normalizedText, normalizedTranscript);
    const continuity = Math.max(0, 1 - candidate.distance / Math.max(lyricMeta.lines.length, 1));
    const score = fuzzy * 0.45 + overlap * 0.4 + continuity * 0.15;
    if (!best || score > best.score) best = { candidate, fuzzy, overlap, continuity, score };
  }
  if (!best) return null;
  const transcriptWords = tokenize(normalizedTranscript);
  const lineWords = best.candidate.line.words.map((word) => word.word);
  const activeWordIndex = Math.max(0, lineWords.findIndex((word) => transcriptWords.includes(word)));
  return {
    lineIndex: best.candidate.line.index,
    wordIndex: activeWordIndex === -1 ? 0 : activeWordIndex,
    matchedText: best.candidate.line.originalText,
    fuzzyScore: best.fuzzy,
    wordOverlap: best.overlap,
    continuity: best.continuity,
    score: best.score,
  };
}

module.exports = { similarity, wordOverlap, findBestLyricMatch };

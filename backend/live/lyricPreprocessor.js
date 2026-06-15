function normalizeText(value = "") {
  return String(value)
    .normalize("NFKC")
    .replace(/\[[^\]]*\]|\([^)]*\)/g, " ")
    .toLocaleLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text = "") {
  const normalized = normalizeText(text);
  return normalized ? normalized.split(" ").filter(Boolean) : [];
}

function lineText(line) {
  return typeof line === "string" ? line : line?.text || "";
}

function preprocessLyrics(lyrics = []) {
  const sourceLines = Array.isArray(lyrics) ? lyrics : String(lyrics).split(/\r?\n/);
  const lines = sourceLines.map((line, index) => {
    const originalText = lineText(line);
    const words = tokenize(originalText).map((word, wordIndex) => ({ word, wordIndex, lineIndex: index }));
    return {
      index,
      originalText,
      normalizedText: normalizeText(originalText),
      words,
      isMarker: Boolean(line?.isMarker),
      time: line?.time ?? null,
    };
  });

  const wordTokens = [];
  const tokenToLine = [];
  lines.forEach((line) => {
    line.words.forEach((token) => {
      tokenToLine.push({ lineIndex: line.index, wordIndex: token.wordIndex });
      wordTokens.push(token.word);
    });
  });

  const searchableWindows = lines.map((line, index) => {
    const nearby = lines.slice(Math.max(0, index - 1), Math.min(lines.length, index + 2));
    return {
      lineIndex: index,
      text: nearby.map((entry) => entry.normalizedText).filter(Boolean).join(" "),
    };
  });

  return {
    normalizedFullText: lines.map((line) => line.normalizedText).filter(Boolean).join(" "),
    lines,
    wordTokens,
    tokenToLine,
    searchableWindows,
  };
}

module.exports = { normalizeText, tokenize, preprocessLyrics };

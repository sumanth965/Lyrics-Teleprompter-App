function computeConfidence({ speechConfidence = 0.7, fuzzyScore = 0, wordOverlap = 0, continuity = 0, jumpPenalty = 0 }) {
  const raw = speechConfidence * 0.25 + fuzzyScore * 0.3 + wordOverlap * 0.3 + continuity * 0.15 - jumpPenalty;
  return Math.max(0, Math.min(1, Number(raw.toFixed(3))));
}
module.exports = { computeConfidence };

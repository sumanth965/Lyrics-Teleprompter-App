const { findBestLyricMatch } = require("./fuzzyMatcher");
const { computeConfidence } = require("./confidence");

class MockAlignmentEngine {
  constructor() {
    this.name = "mock-rolling-transcript";
    this.version = "1.0.0";
    this.sessions = new Map();
  }

  startSession(sessionId, lyricMeta, options = {}) {
    this.sessions.set(sessionId, { lyricMeta, options, previousLineIndex: 0, transcriptBuffer: "", paused: false });
    return { engineName: this.name, engineVersion: this.version };
  }

  processAudioChunk(sessionId, chunk = {}) {
    const session = this.sessions.get(sessionId);
    if (!session || session.paused) return null;
    const transcript = chunk.transcript || chunk.text || "";
    if (transcript) session.transcriptBuffer = `${session.transcriptBuffer} ${transcript}`.trim().split(" ").slice(-32).join(" ");
    const match = findBestLyricMatch(session.transcriptBuffer, session.lyricMeta, session.previousLineIndex, session.options.sensitivity);
    if (!match) return null;
    const jumpPenalty = Math.abs(match.lineIndex - session.previousLineIndex) > 6 ? 0.08 : 0;
    const confidence = computeConfidence({ ...match, speechConfidence: chunk.confidence ?? 0.72, jumpPenalty });
    session.previousLineIndex = match.lineIndex;
    return { ...match, confidence, transcriptFragment: session.transcriptBuffer, trackingStatus: confidence < 0.45 ? "low_confidence" : "tracking" };
  }

  pauseSession(sessionId) { const s = this.sessions.get(sessionId); if (s) s.paused = true; }
  resumeSession(sessionId) { const s = this.sessions.get(sessionId); if (s) s.paused = false; }
  resetSession(sessionId) { const s = this.sessions.get(sessionId); if (s) { s.previousLineIndex = 0; s.transcriptBuffer = ""; } }
  endSession(sessionId) { this.sessions.delete(sessionId); }
}

function createAlignmentEngine() {
  return new MockAlignmentEngine();
}

module.exports = { createAlignmentEngine, MockAlignmentEngine };

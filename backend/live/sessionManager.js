const crypto = require("crypto");
const { preprocessLyrics } = require("./lyricPreprocessor");

class LiveSessionManager {
  constructor(engine) { this.engine = engine; this.sessions = new Map(); }
  start({ songId, lyrics, language = "auto", sensitivity = 0.65, userId = null }) {
    const sessionId = crypto.randomUUID();
    const lyricMeta = preprocessLyrics(lyrics || []);
    const engineInfo = this.engine.startSession(sessionId, lyricMeta, { language, sensitivity });
    const session = { sessionId, songId, userId, language, sensitivity, startedAt: Date.now(), lyricMeta, ...engineInfo };
    this.sessions.set(sessionId, session);
    return session;
  }
  processAudioChunk(sessionId, chunk) { return this.engine.processAudioChunk(sessionId, chunk); }
  pause(sessionId) { this.engine.pauseSession(sessionId); }
  resume(sessionId) { this.engine.resumeSession(sessionId); }
  reset(sessionId) { this.engine.resetSession(sessionId); }
  end(sessionId) { this.engine.endSession(sessionId); this.sessions.delete(sessionId); }
}
module.exports = LiveSessionManager;

const { DeepgramClient } = require("@deepgram/sdk");
const { findBestLyricMatch } = require("./fuzzyMatcher");
const { computeConfidence } = require("./confidence");

class DeepgramAlignmentEngine {
  constructor() {
    this.name = "deepgram-live-transcript";
    this.version = "2.0.0";
    this.sessions = new Map();
    this.deepgram = new DeepgramClient(process.env.DEEPGRAM_API_KEY);
  }

  async startSession(sessionId, lyricMeta, options = {}, onPositionUpdate) {
    // Resolve language — "auto" defaults to "hi" for Devanagari / Hindi lyrics,
    // otherwise use whatever the caller specified.
    const lang = options.language === "auto" ? "hi" : options.language || "hi";
    console.log(`[Deepgram] Starting session ${sessionId} with language=${lang}`);

    // v5 SDK: connect() returns a WrappedListenV1Socket that starts closed
    const socket = await this.deepgram.listen.v1.connect({
      model: "nova-2",
      language: lang,
      smart_format: true,
      // Omit encoding and sample_rate so Deepgram auto-detects the WebM container
    });

    const session = { 
      lyricMeta, 
      options, 
      previousLineIndex: 0, 
      transcriptBuffer: "", 
      paused: false,
      socket,
      onPositionUpdate
    };

    // v5 SDK: events are "open", "message", "close", "error"
    // "message" receives parsed JSON data (transcript results)
    socket.on("open", () => {
      console.log(`[Deepgram] Connection opened for session ${sessionId}`);
    });

    socket.on("message", (data) => {
      if (session.paused) return;
      
      // v5 SDK: message data is already parsed JSON
      // Transcript data comes in data.channel.alternatives
      const alternatives = data?.channel?.alternatives;
      if (!alternatives || !alternatives[0]) {
        // Log non-transcript messages for debugging
        if (data?.type) console.log(`[Deepgram] Non-transcript message type: ${data.type}`);
        return;
      }
      
      const transcript = alternatives[0].transcript;
      if (!transcript) return;
      
      console.log(`[Deepgram] Transcript: "${transcript}" (confidence: ${alternatives[0].confidence})`);
      
      session.transcriptBuffer = `${session.transcriptBuffer} ${transcript}`.trim().split(" ").slice(-32).join(" ");
      const match = findBestLyricMatch(session.transcriptBuffer, session.lyricMeta, session.previousLineIndex, session.options.sensitivity);
      
      if (!match) return;
      
      const jumpPenalty = Math.abs(match.lineIndex - session.previousLineIndex) > 6 ? 0.08 : 0;
      const speechConfidence = alternatives[0].confidence || 0.9;
      const confidence = computeConfidence({ ...match, speechConfidence, jumpPenalty });
      
      session.previousLineIndex = match.lineIndex;
      
      const update = { ...match, confidence, transcriptFragment: session.transcriptBuffer, trackingStatus: confidence < 0.45 ? "low_confidence" : "tracking" };
      console.log(`[Deepgram] Match for "${transcript}": lineIndex=${match.lineIndex}, fuzzy=${match.fuzzyScore}, overlap=${match.wordOverlap}, final_confidence=${confidence}`);
      
      if (session.onPositionUpdate) {
        session.onPositionUpdate(update);
      }
    });

    socket.on("error", (error) => {
      console.error(`[Deepgram] Error for session ${sessionId}:`, error);
    });

    socket.on("close", () => {
      console.log(`[Deepgram] Connection closed for session ${sessionId}`);
    });

    // v5 SDK: socket starts closed, must call connect() then waitForOpen()
    socket.connect();
    await socket.waitForOpen();

    this.sessions.set(sessionId, session);
    return { engineName: this.name, engineVersion: this.version };
  }

  processAudioChunk(sessionId, chunk = {}) {
    const session = this.sessions.get(sessionId);
    if (!session || session.paused) return null;
    
    if (chunk.audio && session.socket) {
      try {
        const audioBuffer = Buffer.isBuffer(chunk.audio) ? chunk.audio : Buffer.from(chunk.audio, "base64");
        console.log(`[Deepgram] Sending ${audioBuffer.length} bytes of audio for session ${sessionId}`);
        // v5 SDK: use sendMedia() for binary audio data
        session.socket.sendMedia(audioBuffer);
      } catch (err) {
        console.error("Error sending audio to deepgram:", err);
      }
    }
    
    return null; // asynchronous updates will be handled by onPositionUpdate
  }

  pauseSession(sessionId) { const s = this.sessions.get(sessionId); if (s) s.paused = true; }
  resumeSession(sessionId) { const s = this.sessions.get(sessionId); if (s) s.paused = false; }
  resetSession(sessionId) { const s = this.sessions.get(sessionId); if (s) { s.previousLineIndex = 0; s.transcriptBuffer = ""; } }
  endSession(sessionId) { 
    const s = this.sessions.get(sessionId); 
    if (s && s.socket) {
      try { s.socket.close(); } catch (_) { /* ignore */ }
    }
    this.sessions.delete(sessionId); 
  }
}

function createAlignmentEngine() {
  if (!process.env.DEEPGRAM_API_KEY) {
    console.warn("WARNING: DEEPGRAM_API_KEY is not defined. Voice syncing will not work.");
  }
  return new DeepgramAlignmentEngine();
}

module.exports = { createAlignmentEngine, DeepgramAlignmentEngine };

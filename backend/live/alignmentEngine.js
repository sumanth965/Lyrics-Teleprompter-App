const { DeepgramClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
const { findBestLyricMatch } = require("./fuzzyMatcher");
const { computeConfidence } = require("./confidence");

class DeepgramAlignmentEngine {
  constructor() {
    this.name = "deepgram-live-transcript";
    this.version = "1.0.0";
    this.sessions = new Map();
    this.deepgram = new DeepgramClient(process.env.DEEPGRAM_API_KEY);
  }

  startSession(sessionId, lyricMeta, options = {}, onPositionUpdate) {
    const connection = this.deepgram.listen.live({
      model: "nova-2",
      language: options.language === "auto" ? "en" : options.language || "en",
      smart_format: true,
      encoding: "webm-opus",
      sample_rate: 48000,
    });

    const session = { 
      lyricMeta, 
      options, 
      previousLineIndex: 0, 
      transcriptBuffer: "", 
      paused: false,
      connection,
      onPositionUpdate
    };

    connection.on(LiveTranscriptionEvents.Open, () => {
      console.log(`[Deepgram] Connection opened for session ${sessionId}`);
    });

    connection.on(LiveTranscriptionEvents.Transcript, (data) => {
      if (session.paused) return;
      
      const transcript = data.channel.alternatives[0].transcript;
      if (!transcript) return;
      
      session.transcriptBuffer = `${session.transcriptBuffer} ${transcript}`.trim().split(" ").slice(-32).join(" ");
      const match = findBestLyricMatch(session.transcriptBuffer, session.lyricMeta, session.previousLineIndex, session.options.sensitivity);
      
      if (!match) return;
      
      const jumpPenalty = Math.abs(match.lineIndex - session.previousLineIndex) > 6 ? 0.08 : 0;
      const speechConfidence = data.channel.alternatives[0].confidence || 0.9;
      const confidence = computeConfidence({ ...match, speechConfidence, jumpPenalty });
      
      session.previousLineIndex = match.lineIndex;
      
      const update = { ...match, confidence, transcriptFragment: session.transcriptBuffer, trackingStatus: confidence < 0.45 ? "low_confidence" : "tracking" };
      if (session.onPositionUpdate) {
        session.onPositionUpdate(update);
      }
    });

    connection.on(LiveTranscriptionEvents.Error, (error) => {
      console.error(`[Deepgram] Error for session ${sessionId}:`, error);
    });

    connection.on(LiveTranscriptionEvents.Close, () => {
      console.log(`[Deepgram] Connection closed for session ${sessionId}`);
    });

    this.sessions.set(sessionId, session);
    return { engineName: this.name, engineVersion: this.version };
  }

  processAudioChunk(sessionId, chunk = {}) {
    const session = this.sessions.get(sessionId);
    if (!session || session.paused) return null;
    
    if (chunk.audio && session.connection) {
      try {
        const audioBuffer = Buffer.from(chunk.audio, "base64");
        session.connection.send(audioBuffer);
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
    if (s && s.connection) {
      s.connection.finish();
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

const WebSocket = require("ws");
const LiveSessionManager = require("./sessionManager");
const { createAlignmentEngine } = require("./alignmentEngine");

function send(ws, type, payload = {}) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type, ...payload }));
}

function attachLiveWebSocketServer(server) {
  const wss = new WebSocket.Server({ server, path: process.env.LIVE_WS_PATH || "/ws/live" });
  const manager = new LiveSessionManager(createAlignmentEngine());

  wss.on("connection", (ws) => {
    let sessionId = null;
    send(ws, "engine:status", { status: "ready", engineName: "mock-rolling-transcript" });
    ws.on("message", (data, isBinary) => {
      const receivedAt = Date.now();
      if (isBinary) {
        if (!sessionId) return send(ws, "session:error", { message: "Start a live session before streaming audio." });
        manager.processAudioChunk(sessionId, { audio: data, timestamp: receivedAt });
        return;
      }
      let message;
      try { message = JSON.parse(data.toString()); } catch (_err) { return send(ws, "session:error", { message: "Invalid live tracking message." }); }
      if (message.type === "session:start") {
        const session = manager.start(message, (update) => {
          send(ws, "position:update", { ...update, latency: 50 }); // rough estimate latency
        });
        sessionId = session.sessionId;
        return send(ws, "session:ready", { sessionId, engineName: session.engineName, engineVersion: session.engineVersion });
      }
      if (!sessionId) return send(ws, "session:error", { message: "No active live session." });
      if (message.type === "audio:chunk") {
        manager.processAudioChunk(sessionId, message);
      } else if (message.type === "session:pause") { manager.pause(sessionId); send(ws, "engine:status", { status: "paused" }); }
      else if (message.type === "session:resume") { manager.resume(sessionId); send(ws, "engine:status", { status: "ready" }); }
      else if (message.type === "session:reset") { manager.reset(sessionId); send(ws, "position:update", { lineIndex: 0, wordIndex: 0, confidence: 0, latency: 0, trackingStatus: "reset" }); }
      else if (message.type === "session:end") { manager.end(sessionId); send(ws, "session:ended", { sessionId }); sessionId = null; }
    });
    ws.on("close", () => { if (sessionId) manager.end(sessionId); });
  });
  return wss;
}
module.exports = { attachLiveWebSocketServer };

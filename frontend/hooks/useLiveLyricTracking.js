"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_STATE = {
  lineIndex: -1,
  wordIndex: -1,
  confidence: 0,
  latency: 0,
  transcriptPreview: "",
  trackingStatus: "idle",
  microphoneStatus: "idle",
  socketStatus: "disconnected",
  engineStatus: "unknown",
  error: "",
};

function getLiveWebSocketUrl() {
  const configured = process.env.NEXT_PUBLIC_LIVE_WS_URL;
  if (configured) return configured;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return `${apiBase.replace(/^http/, "ws").replace(/\/$/, "")}/ws/live`;
}

export default function useLiveLyricTracking({ song, lyrics, sensitivity = 0.65, enabled = true }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const socketRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const manuallyStoppedRef = useRef(false);

  const cleanupMedia = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    recorderRef.current = null;
    streamRef.current = null;
  }, []);

  const send = useCallback((message) => {
    const socket = socketRef.current;
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
  }, []);

  const connect = useCallback(() => new Promise((resolve, reject) => {
    if (!enabled) return reject(new Error("Live tracking is disabled."));
    if (socketRef.current?.readyState === WebSocket.OPEN) return resolve(socketRef.current);
    const socket = new WebSocket(getLiveWebSocketUrl());
    socketRef.current = socket;
    setState((prev) => ({ ...prev, socketStatus: "connecting", error: "" }));
    socket.onopen = () => { setState((prev) => ({ ...prev, socketStatus: "connected" })); resolve(socket); };
    socket.onerror = () => { setState((prev) => ({ ...prev, socketStatus: "error", error: "Live tracking backend is unavailable." })); reject(new Error("WebSocket unavailable")); };
    socket.onclose = () => {
      setState((prev) => ({ ...prev, socketStatus: "disconnected", trackingStatus: manuallyStoppedRef.current ? "idle" : "disconnected" }));
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "position:update") {
        setState((prev) => ({
          ...prev,
          lineIndex: message.lineIndex ?? message.activeLineIndex ?? prev.lineIndex,
          wordIndex: message.wordIndex ?? message.activeWordIndex ?? prev.wordIndex,
          confidence: message.confidence ?? prev.confidence,
          latency: message.latency ?? prev.latency,
          transcriptPreview: message.transcriptFragment || prev.transcriptPreview,
          trackingStatus: message.trackingStatus || "tracking",
        }));
      } else if (message.type === "engine:status") {
        setState((prev) => ({ ...prev, engineStatus: message.status, trackingStatus: message.status === "paused" ? "paused" : prev.trackingStatus }));
      } else if (message.type === "session:error") {
        setState((prev) => ({ ...prev, error: message.message || "Live tracking error.", trackingStatus: "error" }));
      } else if (message.type === "session:ready") {
        setState((prev) => ({ ...prev, engineStatus: "ready", trackingStatus: "tracking" }));
      }
    };
  }), [enabled]);

  const start = useCallback(async () => {
    manuallyStoppedRef.current = false;
    const socket = await connect();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    setState((prev) => ({ ...prev, microphoneStatus: "active", trackingStatus: "starting", error: "" }));
    socket.send(JSON.stringify({ type: "session:start", songId: song?.id, lyrics, language: song?.language || "auto", sensitivity, audioFormat: "webm-opus" }));
    const recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : undefined });
    recorderRef.current = recorder;
    recorder.ondataavailable = async (event) => {
      if (!event.data.size) return;
      const audio = await event.data.arrayBuffer();
      if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: "audio:chunk", audio: btoa(String.fromCharCode(...new Uint8Array(audio).slice(0, 12000))), timestamp: Date.now() }));
    };
    recorder.start(350);
  }, [connect, lyrics, sensitivity, song]);

  const pause = useCallback(() => { recorderRef.current?.pause?.(); send({ type: "session:pause" }); setState((prev) => ({ ...prev, trackingStatus: "paused" })); }, [send]);
  const resume = useCallback(() => { recorderRef.current?.resume?.(); send({ type: "session:resume" }); setState((prev) => ({ ...prev, trackingStatus: "tracking" })); }, [send]);
  const reset = useCallback(() => { send({ type: "session:reset" }); setState((prev) => ({ ...prev, lineIndex: -1, wordIndex: -1, confidence: 0, transcriptPreview: "", trackingStatus: "reset" })); }, [send]);
  const stop = useCallback(() => { manuallyStoppedRef.current = true; send({ type: "session:end" }); cleanupMedia(); socketRef.current?.close(); setState(DEFAULT_STATE); }, [cleanupMedia, send]);

  useEffect(() => () => stop(), [stop]);

  return { ...state, start, pause, resume, reset, stop };
}

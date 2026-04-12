"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { findActiveLyricIndex } from "../utils/timeHelper";

export default function useAudioSync({ lyrics, isPlaying, playbackRate, resetToken }) {
  const audioRef = useRef(null);
  const frameRef = useRef(null);
  const latestTimeRef = useRef(0);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const activeIndex = useMemo(() => findActiveLyricIndex(lyrics, currentTime), [lyrics, currentTime]);

  const updatePlaybackState = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // blocked by browser gesture policy
      });
      return;
    }

    audio.pause();
  }, [isPlaying]);

  const handleTimeUpdate = useCallback((nextTime) => {
    latestTimeRef.current = nextTime;

    if (frameRef.current) return;

    frameRef.current = requestAnimationFrame(() => {
      setCurrentTime(latestTimeRef.current);
      frameRef.current = null;
    });
  }, []);

  const handleLoadedMetadata = useCallback((event) => {
    const nextDuration = Number(event.currentTarget.duration) || 0;
    setDuration(nextDuration);
    setIsAudioReady(true);
    setAudioError(false);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsAudioReady(true);
    setAudioError(false);
  }, []);

  const handleEnded = useCallback(() => {
    setCurrentTime(0);
  }, []);

  const handleAudioError = useCallback(() => {
    setAudioError(true);
    setIsAudioReady(false);
  }, []);

  const seekTo = useCallback((nextTime) => {
    const audio = audioRef.current;
    if (!audio) return;

    const clampedTime = Math.min(Math.max(nextTime, 0), Number(audio.duration) || 0);
    audio.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  }, []);

  useEffect(() => {
    updatePlaybackState();
  }, [updatePlaybackState]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    latestTimeRef.current = 0;
  }, [resetToken]);

  useEffect(() => () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  }, []);

  return {
    audioRef,
    currentTime,
    duration,
    activeIndex,
    isAudioReady,
    audioError,
    handleCanPlay,
    handleLoadedMetadata,
    handleTimeUpdate,
    handleEnded,
    handleAudioError,
    seekTo,
  };
}

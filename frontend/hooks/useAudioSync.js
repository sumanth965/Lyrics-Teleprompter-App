


"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { findActiveLyricIndex } from "../utils/timeHelper";

export default function useAudioSync({ lyrics, isPlaying, playbackRate, resetToken, syncOffset = 0 }) {
  const audioRef = useRef(null);
  const frameRef = useRef(null);
  const latestTimeRef = useRef(0);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [audioError, setAudioError] = useState(false);
  
  const lastUiUpdateRef = useRef(0);
  const playPromiseRef = useRef(null);

  // High-precision polling loop for active index
  useEffect(() => {
    if (!isPlaying) return;

    let rafId;
    const poll = () => {
      const audio = audioRef.current;
      if (audio) {
        const time = audio.currentTime;
        const adjustedTime = Math.max(0, time + syncOffset);
        
        // 1. Immediate sync for lyrics (high precision)
        const nextIndex = findActiveLyricIndex(lyrics, adjustedTime);
        setActiveIndex(current => current !== nextIndex ? nextIndex : current);
        
        // 2. Throttled update for UI progress bar (low overhead)
        const now = performance.now();
        if (now - lastUiUpdateRef.current > 100) { // 10fps for progress bar
          setCurrentTime(time);
          lastUiUpdateRef.current = now;
        }
      }
      rafId = requestAnimationFrame(poll);
    };

    rafId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, lyrics, syncOffset]);

  const updatePlaybackState = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromiseRef.current = playPromise;
        playPromise.catch((error) => {
          if (error.name !== "AbortError") {
            console.warn("Playback prevented or aborted:", error);
          }
        });
      }
    } else {
      const playPromise = playPromiseRef.current;
      if (playPromise !== undefined && playPromise !== null) {
        playPromise
          .then(() => {
            if (!isPlaying && playPromiseRef.current === playPromise) {
              audio.pause();
              playPromiseRef.current = null;
            }
          })
          .catch(() => {
            playPromiseRef.current = null;
          });
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);


  const handleTimeUpdate = useCallback((nextTime) => {
    // Only update if not polling (e.g. initial load or manual seek)
    if (!isPlaying) {
      setCurrentTime(nextTime);
    }
  }, [isPlaying]);

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

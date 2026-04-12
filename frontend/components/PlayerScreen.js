"use client";

import Link from "next/link";
import { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import Controls from "./Controls";
import LyricsDisplay from "./LyricsDisplay";
import useAudioSync from "../hooks/useAudioSync";
import useScroll from "../hooks/useScroll";
import { formatTime } from "../utils/timeHelper";

export default function PlayerScreen({ song, invalidSongId = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [restartSignal, setRestartSignal] = useState(0);
  const [audioError, setAudioError] = useState(false);

  const activeIndex = useAudioSync(song.lyrics || [], currentTime);
  const { containerRef, lineRefs } = useScroll({ activeIndex, speed });

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    setRestartSignal((value) => value + 1);
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-black text-white">
      <AudioPlayer
        src={song.audio}
        isPlaying={isPlaying}
        speed={speed}
        restartSignal={restartSignal}
        onTimeUpdate={setCurrentTime}
        onDuration={setDuration}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setAudioError(true);
          setIsPlaying(false);
        }}
      />

      <header className="shrink-0 border-b border-zinc-800 px-6 py-4 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Now Playing</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">{song.title}</h1>
        <p className="text-gray-400">{song.artist}</p>
        {invalidSongId && <p className="mt-2 text-sm text-red-300">Invalid songId. Loaded default song.</p>}
        {audioError && <p className="mt-2 text-sm text-red-300">Audio failed to load. Check file path.</p>}
        <Link href="/library" className="mt-3 inline-block text-sm text-yellow-400 transition-all duration-300 hover:text-yellow-300">
          Back to Library
        </Link>
      </header>

      <section ref={containerRef} className="teleprompter-scroll flex-1 overflow-y-auto">
        <LyricsDisplay lyrics={song.lyrics} activeIndex={activeIndex} lineRefs={lineRefs} />
      </section>

      <Controls
        isPlaying={isPlaying}
        speed={speed}
        onTogglePlay={() => setIsPlaying((value) => !value)}
        onRestart={handleRestart}
        currentTime={formatTime(currentTime)}
        duration={formatTime(duration)}
        onSpeedChange={setSpeed}
      />
    </main>
  );
}

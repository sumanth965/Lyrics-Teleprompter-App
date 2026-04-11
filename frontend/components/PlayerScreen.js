"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import songs from "../data/songs.json";
import useScroll from "../hooks/useScroll";
import useAudioSync from "../hooks/useAudioSync";
import LyricsDisplay from "./LyricsDisplay";
import Controls from "./Controls";
import AudioPlayer from "./AudioPlayer";

export default function PlayerScreen({ songId }) {
  const selectedSong = useMemo(() => songs.find((song) => song.id === songId) ?? songs[0], [songId]);

  const [speed, setSpeed] = useState(1);
  const [audioTime, setAudioTime] = useState(0);
  const [restartTick, setRestartTick] = useState(0);

  const { containerRef, isPlaying, play, pause, restart } = useScroll(speed);
  const syncedIndex = useAudioSync(selectedSong.lyrics, audioTime);

  const onPlayPause = () => (isPlaying ? pause() : play());

  const onRestart = () => {
    restart();
    setAudioTime(0);
    setRestartTick((value) => value + 1);
  };

  return (
    <div className="h-screen overflow-hidden bg-black text-white">
      <AudioPlayer src={selectedSong.audio} isPlaying={isPlaying} onTimeUpdate={setAudioTime} onRestart={restartTick} />

      <div ref={containerRef} className="teleprompter-scroll h-full overflow-y-auto pb-36">
        <div className="sticky top-0 z-10 border-b border-zinc-800 bg-black/80 px-6 py-4 text-center backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-zinc-400">Now playing</p>
          <h1 className="text-xl font-bold md:text-2xl">{selectedSong.title}</h1>
          <p className="text-sm text-zinc-400 md:text-base">{selectedSong.artist}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <Link href="/library" className="rounded-full border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-900">
              Library
            </Link>
            {songs.map((song) => (
              <Link
                key={song.id}
                href={`/player?song=${song.id}`}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  song.id === selectedSong.id
                    ? "bg-green-500 font-semibold text-black"
                    : "border border-zinc-700 text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                {song.title}
              </Link>
            ))}
          </div>
        </div>

        <LyricsDisplay lyrics={selectedSong.lyrics} activeIndex={syncedIndex} />
      </div>

      <Controls isPlaying={isPlaying} onPlayPause={onPlayPause} onRestart={onRestart} speed={speed} onSpeedChange={setSpeed} />
    </div>
  );
}

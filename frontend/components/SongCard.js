"use client";

import { useRouter } from "next/navigation";

export default function SongCard({ song }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/player?songId=${song.id}`)}
      className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-left transition-all duration-300 hover:border-yellow-500/50 hover:bg-zinc-900"
    >
      <h3 className="text-xl font-semibold text-white">{song.title}</h3>
      <p className="mt-1 text-sm text-gray-400">{song.artist}</p>
      <p className="mt-4 text-xs text-gray-500">{song.lyrics?.length || 0} lyric lines</p>
    </button>
  );
}

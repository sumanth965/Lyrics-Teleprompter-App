"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PlayerScreen from "../../components/PlayerScreen";
import { useSongs } from "../../contexts/SongsContext";

export default function PlayerPage() {
  const searchParams = useSearchParams();
  const { songs, isLoaded } = useSongs();

  const songId = searchParams.get("songId");

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <p>Loading Player...</p>
      </main>
    );
  }

  const selectedSong = songs.find((s) => s.id === songId);

  if (!songs.length) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-zinc-950 px-6 text-center text-zinc-100">
        <h1 className="text-3xl font-bold">No songs available</h1>
        <p className="max-w-lg text-zinc-400">Seed your database and add songs in Studio to start the teleprompter player.</p>
        <Link href="/" className="rounded-lg border border-zinc-700 px-4 py-2 font-medium hover:bg-zinc-900">
          Back Home
        </Link>
      </main>
    );
  }

  if (!selectedSong) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-zinc-950 px-6 text-center text-zinc-100">
        <h1 className="text-3xl font-bold">No song selected</h1>
        <p className="max-w-lg text-zinc-400">Choose a song from the library to open the player.</p>
        <Link href="/library" className="rounded-lg border border-zinc-700 px-4 py-2 font-medium hover:bg-zinc-900">
          Go to Library
        </Link>
      </main>
    );
  }

  return <PlayerScreen key={songId} songId={songId} />;
}

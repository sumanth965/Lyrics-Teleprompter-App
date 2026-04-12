import Link from "next/link";
import PlayerScreen from "../../components/PlayerScreen";
import songs from "../../data/songs.json";

function parseSongId(songIdParam) {
  if (!songIdParam) return null;

  const parsedSongId = Number(songIdParam);
  if (Number.isNaN(parsedSongId)) return null;

  return songs.some((song) => song.id === parsedSongId) ? parsedSongId : null;
}

export default async function PlayerPage({ searchParams }) {
  const params = await searchParams;
  const songId = parseSongId(params?.songId);

  if (!songs.length) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-zinc-950 px-6 text-center text-zinc-100">
        <h1 className="text-3xl font-bold">No songs available</h1>
        <p className="max-w-lg text-zinc-400">Add song entries in <code>data/songs.json</code> to start the teleprompter player.</p>
        <Link href="/" className="rounded-lg border border-zinc-700 px-4 py-2 font-medium hover:bg-zinc-900">
          Back Home
        </Link>
      </main>
    );
  }

  if (!songId) {
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

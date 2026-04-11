import Link from "next/link";
import PlayerScreen from "../../components/PlayerScreen";
import songs from "../../data/songs.json";

function resolveSongId(songParam) {
  const parsedSongId = Number(songParam);
  if (Number.isNaN(parsedSongId)) return songs[0]?.id;

  const songExists = songs.some((song) => song.id === parsedSongId);
  return songExists ? parsedSongId : songs[0]?.id;
}

export default async function PlayerPage({ searchParams }) {
  const params = await searchParams;
  const songId = resolveSongId(params?.song);

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

  return <PlayerScreen songId={songId} />;
}

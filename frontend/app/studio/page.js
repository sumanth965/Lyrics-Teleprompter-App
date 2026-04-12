import Link from "next/link";
import PlayerScreen from "../../components/PlayerScreen";
import songs from "../../data/songs.json";

function parseSongId(songIdParam) {
  if (!songIdParam) return null;

  const parsedSongId = Number(songIdParam);
  if (Number.isNaN(parsedSongId)) return null;

  return songs.some((song) => song.id === parsedSongId) ? parsedSongId : null;
}

export default async function StudioPage({ searchParams }) {
  const params = await searchParams;

  if (!songs.length) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-zinc-950 px-6 text-center text-zinc-100">
        <h1 className="text-3xl font-bold">Studio is empty</h1>
        <p className="max-w-lg text-zinc-400">Add songs in <code>data/songs.json</code> to launch the studio teleprompter.</p>
        <Link href="/library" className="rounded-lg border border-zinc-700 px-4 py-2 font-medium hover:bg-zinc-900">
          Go to Library
        </Link>
      </main>
    );
  }

  const songId = parseSongId(params?.songId) ?? songs[0].id;

  return <PlayerScreen key={songId} songId={songId} routeBase="/studio" />;
}

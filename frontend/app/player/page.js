import Link from "next/link";
import PlayerScreen from "../../components/PlayerScreen";
import songs from "../../data/songs.json";

function resolveSong(songIdParam) {
  if (!songs.length) {
    return { song: null, invalidSongId: false };
  }

  const numericSongId = Number(songIdParam);

  if (!Number.isFinite(numericSongId)) {
    return { song: songs[0], invalidSongId: false };
  }

  const matchedSong = songs.find((song) => song.id === numericSongId);

  if (!matchedSong) {
    return { song: songs[0], invalidSongId: true };
  }

  return { song: matchedSong, invalidSongId: false };
}

export default async function PlayerPage({ searchParams }) {
  const params = await searchParams;
  const { song, invalidSongId } = resolveSong(params?.songId);

  if (!songs.length) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4 text-center text-white">
        <div>
          <p className="text-2xl font-semibold">No songs in library.</p>
          <p className="mt-2 text-gray-400">Add songs to data/songs.json.</p>
          <Link href="/library" className="mt-6 inline-block rounded-lg bg-yellow-400 px-4 py-2 font-medium text-black">
            Open Library
          </Link>
        </div>
      </main>
    );
  }

  return <PlayerScreen song={song} invalidSongId={invalidSongId} />;
}

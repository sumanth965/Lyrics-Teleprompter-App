import Link from "next/link";
import Navbar from "../../components/Navbar";
import songs from "../../data/songs.json";

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Song Library</h1>
        <p className="mb-8 text-zinc-400">Choose a song to open it in teleprompter mode.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {songs.map((song) => (
            <Link
              key={song.id}
              href={`/player?song=${song.id}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-green-500 hover:bg-zinc-800"
            >
              <h2 className="text-xl font-semibold text-white">{song.title}</h2>
              <p className="mt-1 text-zinc-400">{song.artist}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

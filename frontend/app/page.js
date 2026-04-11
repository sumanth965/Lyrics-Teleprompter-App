import Link from "next/link";
import songs from "../data/songs.json";

export default function HomePage() {
  const featuredSong = songs[0];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-green-400">Obsidian Stage</p>

        <div className="space-y-5">
          <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
            Lyrics teleprompter that actually works on stage.
          </h1>
          <p className="max-w-2xl text-base text-zinc-300 md:text-lg">
            Pick a song from your library, open focused player mode, and control auto-scroll with audio-sync support.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/library"
            className="inline-flex items-center justify-center rounded-lg bg-green-500 px-6 py-3 font-semibold text-black transition hover:bg-green-400"
          >
            Open Library
          </Link>
          <Link
            href={featuredSong ? `/player?song=${featuredSong.id}` : "/player"}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-6 py-3 font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Launch Player
          </Link>
        </div>

        {featuredSong ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-400">Featured song</p>
            <h2 className="text-2xl font-bold">{featuredSong.title}</h2>
            <p className="text-zinc-400">{featuredSong.artist}</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}

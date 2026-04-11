import Link from "next/link";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-4xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Lyrics Teleprompter App</h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-300 md:text-xl">
          A smooth, responsive teleprompter experience for singers with adjustable lyric speed and optional audio sync.
        </p>

        <Link
          href="/library"
          className="mt-10 rounded-full bg-green-500 px-8 py-3 text-lg font-semibold text-black transition hover:bg-green-400"
        >
          Start Singing
        </Link>
      </main>
    </div>
  );
}

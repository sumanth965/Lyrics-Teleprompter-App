import Link from "next/link";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold md:text-6xl">Production-Ready Lyrics Teleprompter</h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-400">
          Smooth scrolling, audio synchronization, and focused active-line highlighting for professional live performance.
        </p>
        <Link
          href="/library"
          className="mt-10 rounded-xl bg-yellow-400 px-7 py-3 font-semibold text-black transition-all duration-300 hover:bg-yellow-300"
        >
          Open Library
        </Link>
      </section>
    </main>
  );
}

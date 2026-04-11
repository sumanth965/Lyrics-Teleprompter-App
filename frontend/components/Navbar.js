import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-800 bg-black/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-wide text-white">
          Lyrics Teleprompter App
        </Link>
        <div className="flex items-center gap-4 text-sm text-zinc-300">
          <Link href="/library" className="transition hover:text-white">
            Library
          </Link>
          <Link href="/player" className="transition hover:text-white">
            Player
          </Link>
        </div>
      </nav>
    </header>
  );
}

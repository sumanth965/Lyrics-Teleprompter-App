import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 border-b border-zinc-800 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-yellow-400">
          Lyrics Teleprompter
        </Link>
        <div className="flex items-center gap-5 text-sm text-gray-300">
          <Link href="/library" className="transition-all duration-300 hover:text-white">
            Library
          </Link>
          <Link href="/player" className="transition-all duration-300 hover:text-white">
            Player
          </Link>
        </div>
      </div>
    </nav>
  );
}

import Link from "next/link";

const brandName = "StageLyrics";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] selection:bg-[#22c55e]/30">
      <header>
        <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-[#131313]/80 px-6 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-md md:px-8">
          <Link href="/" className="text-xl font-black tracking-tight text-[#22C55E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4be277]">{brandName}</Link>
          <div className="hidden items-center gap-8 tracking-tight md:flex">
            <Link className="text-[#e5e2e1]/75 transition hover:text-white" href="/library">Library</Link>
            <Link className="text-[#e5e2e1]/75 transition hover:text-white" href="/studio">Studio</Link>
            <Link className="text-[#e5e2e1]/75 transition hover:text-white" href="/player">Player</Link>
          </div>
          <Link href="/library" className="rounded-xl bg-gradient-to-br from-[#4be277] to-[#22c55e] px-5 py-2 font-bold text-[#003915] shadow-lg shadow-[#4be277]/20 transition active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4be277]">Open Library</Link>
        </nav>
      </header>

      <main>
        <section className="relative flex min-h-[840px] items-center justify-center overflow-hidden px-6 pt-24 md:px-8">
          <div className="absolute inset-0 z-0">
            <img src="/hero-stage.svg" alt="Abstract stage lights over a dark concert background" className="h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-[#131313]/80" />
          </div>
          <div className="relative z-10 max-w-5xl space-y-8 text-center">
            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">Confident lyrics, every song.</h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#c8d0c6] md:text-xl">{brandName} is a live-performance teleprompter that keeps lyrics readable, synced, and easy to control across rehearsal and stage use.</p>
            <div className="flex flex-col justify-center gap-4 pt-4 md:flex-row">
              <Link href="/studio" className="rounded-xl bg-gradient-to-br from-[#4be277] to-[#22c55e] px-10 py-4 text-lg font-bold text-[#003915] transition hover:shadow-2xl hover:shadow-[#4be277]/30">Create Song</Link>
              <Link href="/player" className="rounded-xl bg-[#2f2f2f] px-10 py-4 text-lg font-semibold text-[#e5e2e1] transition hover:bg-[#3a3a3a]">Open Player</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-[#3d4a3d]/15 bg-[#131313] py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 text-center md:flex-row md:text-left">
          <div>
            <div className="text-lg font-black tracking-tight text-[#22C55E]">{brandName}</div>
            <p className="text-xs text-[#e5e2e1]/60">© 2026 {brandName}. Reliable lyrics for live performance.</p>
          </div>
          <nav aria-label="Footer" className="flex gap-6 text-xs font-medium uppercase tracking-wider text-[#e5e2e1]/70">
            <Link href="/library" className="hover:text-[#22C55E]">Library</Link>
            <Link href="/studio" className="hover:text-[#22C55E]">Studio</Link>
            <Link href="/player" className="hover:text-[#22C55E]">Player</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

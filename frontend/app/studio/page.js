import Link from "next/link";

export default function StudioPage() {
  return (
    <div className="h-screen overflow-hidden bg-[#131313] font-body text-[#e5e2e1] select-none">
      <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-[#131313]/70 px-8 py-4 backdrop-blur-md">
        <Link href="/" className="text-xl font-black tracking-tighter text-[#22C55E]">
          OBSIDIAN STAGE
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link className="font-inter tracking-tight text-[#e5e2e1]/50 transition-all duration-200 hover:text-[#e5e2e1]" href="/library">
            Library
          </Link>
          <Link className="border-b-2 border-[#22C55E] pb-1 font-inter font-bold tracking-tight text-[#22C55E] transition-all duration-200" href="/studio">
            Studio
          </Link>
          <a className="font-inter tracking-tight text-[#e5e2e1]/50 transition-all duration-200 hover:text-[#e5e2e1]" href="#">
            Settings
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="rounded-full bg-[#22c55e] px-6 py-2 text-sm font-bold tracking-tight text-[#004b1e] transition-all duration-100 active:scale-95">
            Go Live
          </button>
        </div>
      </header>

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-[#3d4a3d]/15 bg-[#131313] py-8 lg:flex">
        <div className="mb-12 mt-16 px-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-[#3d4a3d]/20 bg-[#2a2a2a]">
              <img
                className="h-full w-full object-cover"
                alt="Dramatic portrait of a male vocalist in a dark recording studio with professional lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzyxlUuQSTADAIA15Gqe6_ycmED6xUXwBrBY_SmQGB7Y13FDtRh8C4qSO64JsZIxYh6FtzAbYlHEKIik0tfuDQifLmIS0OSkJ28KKmL9QzjmURcZHx1tc_y94kKGw0TlvcfPqGUhQuAplX9ZdWm6nPzMrStn4z_vGUXEho9RstjHAeX0rE102wK-HQZal4StOwQtRZ5e55MZPALiQSfv4E9u84OicOnIhjyh0LudtoJKV3vdyq1usDdEET4mPHIIGvDp9gu_hsWfur"
              />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold leading-none tracking-widest text-[#22C55E]">Lead Vocalist</p>
              <p className="text-[10px] tracking-widest text-[#e5e2e1]/40">Active Session</p>
            </div>
          </div>
          <button className="w-full rounded-lg border border-[#22C55E]/20 bg-[#22C55E]/10 py-3 text-[10px] font-bold tracking-widest text-[#22C55E] transition-all hover:bg-[#22C55E]/20">
            New Setlist
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          <a className="flex items-center gap-4 border-r-4 border-[#22C55E] bg-[#22C55E]/10 px-8 py-4 text-[#22C55E] transition-colors duration-300" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              queue_music
            </span>
            <span className="font-inter text-[0.75rem] tracking-widest">Current Set</span>
          </a>
          <Link className="flex items-center gap-4 px-8 py-4 text-[#e5e2e1]/40 transition-colors duration-300 hover:bg-[#2a2a2a] hover:text-[#e5e2e1]" href="/library">
            <span className="material-symbols-outlined">library_music</span>
            <span className="font-inter text-[0.75rem] tracking-widest">Library</span>
          </Link>
          <a className="flex items-center gap-4 px-8 py-4 text-[#e5e2e1]/40 transition-colors duration-300 hover:bg-[#2a2a2a] hover:text-[#e5e2e1]" href="#">
            <span className="material-symbols-outlined">history</span>
            <span className="font-inter text-[0.75rem] tracking-widest">History</span>
          </a>
          <a className="flex items-center gap-4 px-8 py-4 text-[#e5e2e1]/40 transition-colors duration-300 hover:bg-[#2a2a2a] hover:text-[#e5e2e1]" href="#">
            <span className="material-symbols-outlined">settings_input_component</span>
            <span className="font-inter text-[0.75rem] tracking-widest">Hardware</span>
          </a>
        </nav>
      </aside>

      <main className="relative ml-0 flex h-screen flex-col overflow-hidden bg-[#131313] pt-20 lg:ml-64">
        <div className="pointer-events-none absolute left-8 right-8 top-24 z-30 flex items-start justify-between">
          <div className="rounded-lg bg-[#201f1f]/40 p-6 backdrop-blur-sm">
            <h1 className="mb-2 text-4xl font-extrabold tracking-tighter text-[#e5e2e1] uppercase">Neon Horizon</h1>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#bccbb9]/60 uppercase">Tempo</span>
                <span className="font-mono text-xl font-bold tracking-tighter text-[#4be277]">128 BPM</span>
              </div>
              <div className="h-full w-[1px] self-stretch bg-[#3d4a3d]/30" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#bccbb9]/60 uppercase">Key</span>
                <span className="font-mono text-xl font-bold tracking-tighter text-[#e5e2e1]">Eb Major</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-[#2a2a2a]/60 p-6 text-right backdrop-blur-sm">
            <span className="mb-1 block text-[10px] font-bold tracking-[0.2em] text-[#bccbb9]/60 uppercase">Time Remaining</span>
            <span className="font-mono text-4xl font-black tracking-tighter text-[#e5e2e1]">03:42</span>
          </div>
        </div>

        <div className="scrolling-content flex flex-grow flex-col items-center justify-center overflow-hidden px-4 md:px-24">
          <div className="w-full max-w-5xl space-y-12 py-96 text-center transition-all duration-700">
            <p className="text-[2.75rem] leading-tight font-bold tracking-tight text-[#bccbb9] opacity-20">Lost in the echoes of a digital dream</p>
            <p className="text-[2.75rem] leading-tight font-bold tracking-tight text-[#bccbb9] opacity-40">Walking through shadows where light used to beam</p>
            <div className="relative py-8">
              <p className="active-lyric-glow scale-105 text-[3.5rem] leading-none font-extrabold tracking-tight text-white transition-transform">BUT THE NEON HORIZON IS CALLING MY NAME</p>
              <div className="absolute -left-12 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#4be277]" />
                <div className="h-[2px] w-8 bg-[#4be277]" />
              </div>
            </div>
            <p className="text-[2.75rem] leading-tight font-bold tracking-tight text-[#bccbb9] opacity-40">Igniting the sparks of a long-lost flame</p>
            <p className="text-[2.75rem] leading-tight font-bold tracking-tight text-[#bccbb9] opacity-20">We are the circuits, we are the wire</p>
            <p className="text-[2.75rem] leading-tight font-bold tracking-tight text-[#bccbb9] opacity-10">Burning forever in electronic fire</p>
          </div>
        </div>

        <div className="fixed bottom-12 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 px-4">
          <div className="absolute -top-4 left-4 right-4 h-1 overflow-hidden rounded-full bg-[#353534]">
            <div className="relative h-full w-1/3 bg-[#4be277] shadow-[0_0_8px_rgba(75,226,119,0.8)]">
              <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#4be277] blur-[2px]" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#3d4a3d]/10 bg-[#201f1f]/70 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div className="flex items-center gap-6 px-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[8px] font-bold tracking-widest text-[#bccbb9] uppercase">Speed</span>
                  <span className="font-mono text-[8px] text-[#4be277]">1.2X</span>
                </div>
                <input className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-[#353534] accent-[#4be277]" type="range" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[8px] font-bold tracking-widest text-[#bccbb9] uppercase">Size</span>
                  <span className="font-mono text-[8px] text-[#e5e2e1]">100%</span>
                </div>
                <input className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-[#353534] accent-[#e5e2e1]" type="range" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex h-12 w-12 items-center justify-center rounded-full text-[#e5e2e1] transition-colors hover:bg-[#353534]">
                <span className="material-symbols-outlined text-3xl">skip_previous</span>
              </button>
              <button className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#4be277] to-[#22c55e] text-[#003915] shadow-lg shadow-[#4be277]/20 transition-transform active:scale-95">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  pause
                </span>
              </button>
              <button className="flex h-12 w-12 items-center justify-center rounded-full text-[#e5e2e1] transition-colors hover:bg-[#353534]">
                <span className="material-symbols-outlined text-3xl">skip_next</span>
              </button>
            </div>

            <div className="flex items-center gap-3 px-4">
              <button className="rounded-lg p-3 text-[#bccbb9] transition-all hover:bg-[#353534]">
                <span className="material-symbols-outlined">restart_alt</span>
              </button>
              <button className="rounded-lg p-3 text-[#bccbb9] transition-all hover:bg-[#353534]">
                <span className="material-symbols-outlined">mic</span>
              </button>
              <button className="rounded-lg p-3 text-[#bccbb9] transition-all hover:bg-[#353534]">
                <span className="material-symbols-outlined">fullscreen</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="pointer-events-none fixed bottom-0 z-10 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <p className="text-[10px] font-medium tracking-[0.05em] text-[#e5e2e1]/30 uppercase">© 2024 OBSIDIAN STAGE. ENGINEERED FOR PERFORMANCE.</p>
          <div className="pointer-events-auto flex gap-6">
            <a className="text-[10px] font-medium tracking-[0.05em] text-[#e5e2e1]/30 uppercase transition-opacity hover:text-[#22C55E]" href="#">Terms</a>
            <a className="text-[10px] font-medium tracking-[0.05em] text-[#e5e2e1]/30 uppercase transition-opacity hover:text-[#22C55E]" href="#">Privacy</a>
            <a className="text-[10px] font-medium tracking-[0.05em] text-[#e5e2e1]/30 uppercase transition-opacity hover:text-[#22C55E]" href="#">Hardware Sync</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

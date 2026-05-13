import Link from "next/link";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <main className="bg-[#131313] text-[#e5e2e1] selection:bg-[#22c55e]/30">
      <Navbar />

      <section className="relative flex min-h-[920px] items-center justify-center overflow-hidden px-8 pt-24">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8s8yEQhJ5AXPx1_O5wtW6EED2j1IqBKZIoYoFM57RZNS6-3uhX1-XIWychlOjCl-OA2vGbFeJ-tovCDnScRaizXZC7hS2Y3CidDFUursCCXemzqO-9UPmiuS4kiBP0PqBCh8l5_HIp0NzmFFySwnxPzZGEz7RRjYRVbBjeaA2kmFwFdVP5BLhDLynXR4gWeodkDpUVccQuEeD5NvRft1PCNVSLrzPO8-RypJv4-tJ9Uq_Yde3LQwbojy3ltxXn8yXtBMCxCHyqTKC"
            alt="Music stage with green laser lights and atmospheric smoke"
            className="h-full w-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-[#131313]/80" />
        </div>

        <div className="relative z-10 max-w-5xl space-y-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#3d4a3d]/25 bg-[#2a2a2a] px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#4be277]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.05em] text-[#bccbb9]">Engineered for Performance</span>
          </div>

          <h1 className="text-6xl font-black leading-[0.9] tracking-tighter text-shadow-[0_0_20px_rgba(34,197,94,0.4)] md:text-8xl">
            NEVER MISS
            <br />
            <span className="text-[#4be277]">A BEAT AGAIN.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#bccbb9] md:text-xl">
            The professional lyrics teleprompter designed for the stage. Tactile control, crystal clarity, and seamless
            device synchronization for the high-pressure environment of live music.
          </p>

          <div className="flex flex-col justify-center gap-4 pt-4 md:flex-row">
            <button className="rounded-xl bg-gradient-to-br from-[#4be277] to-[#22c55e] px-10 py-5 text-lg font-extrabold text-[#003915] transition-all hover:shadow-2xl hover:shadow-[#4be277]/40 active:scale-95">
              Start Singing
            </button>
            <button className="rounded-xl bg-[#353534] px-10 py-5 text-lg font-bold text-[#e5e2e1] transition-all hover:bg-[#393939]">
              View Hardware Sync
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-8 py-32">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="group relative flex min-h-[450px] flex-col justify-end overflow-hidden rounded-2xl bg-[#201f1f] p-12 md:col-span-2">
            <div className="absolute right-0 top-0 p-8">
              <span className="material-symbols-outlined text-6xl text-[#4be277]/20 transition-colors duration-500 group-hover:text-[#4be277]">
                speed
              </span>
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-4xl font-bold tracking-tight">Smooth Scrolling</h3>
              <p className="max-w-md text-lg text-[#bccbb9]">
                Adaptive speed engine that follows your vocal delivery. Zero latency, infinite precision.
              </p>
              <div className="flex gap-4 pt-4">
                <span className="rounded bg-[#2a2a2a] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.05em] text-[#4be277]">
                  Ultra-Low Jitter
                </span>
                <span className="rounded bg-[#2a2a2a] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.05em] text-[#4be277]">
                  60FPS Engine
                </span>
              </div>
            </div>
            <div className="absolute bottom-12 right-12 h-2/3 w-1/2 opacity-20 transition-opacity group-hover:opacity-40">
              <div className="space-y-4 text-3xl font-bold opacity-50">
                <div className="text-white">Is this the real life?</div>
                <div className="text-[#bccbb9]">Is this just fantasy?</div>
                <div className="text-[#bccbb9]/50">Caught in a landslide...</div>
              </div>
            </div>
          </div>

          <div className="group relative flex flex-col gap-6 overflow-hidden rounded-2xl bg-[#201f1f] p-8">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS6HUFVJlkTiAeeae9D6SeqOP-JRo0urIyt7aerCrViw-m-sp43JLDCEIaXMnclYpG3h9gLCzBLs5v48McvxPsBMxsRb1wcHJ-nHSCwgguxCLCvAo-5gEJpWi3US0dWUOds9CbJ_ULeDVBxW9hwuDk--3ZTrTA3BstXEZKsYtPCLxNtAZhWVzrEmdnB8XKqBG__EHGZJvpJhlcEBxnYwNydEAEsOtXFCT9ggmR6rdZVsU_-_EkYKeIdD7SMh4LEjXco7lHk4JVn7zm"
              alt="Studio setup with synchronized devices"
              className="h-48 w-full rounded-lg object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
            />
            <div className="space-y-4">
              <h3 className="text-2xl font-bold tracking-tight">Multi-device Support</h3>
              <p className="text-[#bccbb9]">Sync your setlist across iPad, Android, and Desktop. One conductor, infinite screens.</p>
              <div className="flex items-center gap-4 text-[#bccbb9]/40">
                <span className="material-symbols-outlined">tablet_mac</span>
                <span className="material-symbols-outlined">smartphone</span>
                <span className="material-symbols-outlined">laptop_mac</span>
              </div>
            </div>
          </div>

          <div className="group relative flex flex-col gap-6 overflow-hidden rounded-2xl bg-[#201f1f] p-8">
            <div className="flex h-48 items-center justify-center overflow-hidden rounded-lg bg-[#2a2a2a]">
              <div className="flex h-20 items-end gap-1">
                <div className="h-full w-1 animate-pulse bg-[#4be277]" />
                <div className="h-2/3 w-1 animate-pulse bg-[#4be277]" />
                <div className="h-3/4 w-1 animate-pulse bg-[#4be277]" />
                <div className="h-1/2 w-1 animate-pulse bg-[#4be277]" />
                <div className="h-5/6 w-1 animate-pulse bg-[#4be277]" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold tracking-tight">Audio Sync</h3>
              <p className="text-[#bccbb9]">
                Intelligent BPM detection matches your scroll to the drummer&apos;s click track automatically.
              </p>
            </div>
          </div>

          <div className="group relative flex flex-col items-center gap-12 overflow-hidden rounded-2xl bg-[#201f1f] p-12 md:col-span-2 md:flex-row">
            <div className="flex-1 space-y-6">
              <div className="inline-block rounded border border-[#4be277]/20 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.05em] text-[#4be277]">
                Hardware Integration
              </div>
              <h3 className="text-4xl font-bold tracking-tight">Studio-Grade Reliability</h3>
              <p className="text-lg text-[#bccbb9]">
                Designed for the stage environment. High contrast, large hit targets, and offline mode. When the Wi-Fi fails,
                the show goes on.
              </p>
            </div>
            <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-[#3d4a3d]/25 bg-[#2a2a2a] shadow-inner md:w-1/3">
              <span className="material-symbols-outlined text-8xl text-[#4be277]/10">settings_input_component</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-32">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#201f1f] to-[#353534] p-16 text-center">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#4be277] to-transparent" />
          <h2 className="mb-8 text-5xl font-black leading-tight tracking-tighter md:text-7xl">
            READY TO
            <br />
            DOMINATE THE STAGE?
          </h2>
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
            <button className="rounded-xl bg-gradient-to-br from-[#4be277] to-[#22c55e] px-12 py-6 text-xl font-black text-[#003915] transition-all hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]">
              Start Singing
            </button>
            <p className="font-medium text-[#bccbb9]/60">No credit card required. Free 30-day session trial.</p>
          </div>
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#4be277]/5 blur-[100px]" />
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#4be277]/5 blur-[100px]" />
        </div>
      </section>

      <footer className="w-full border-t border-[#3d4a3d]/15 bg-[#131313] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-8 md:flex-row">
          <div className="flex flex-col gap-4">
            <div className="text-lg font-black tracking-tighter text-[#22C55E]">OBSIDIAN STAGE</div>
            <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-[#e5e2e1]/30">
              © 2026 OBSIDIAN STAGE. ENGINEERED FOR PERFORMANCE.
            </p>
          </div>
          <div className="flex gap-8 text-[10px] font-medium uppercase tracking-[0.05em]">
            <a className="text-[#e5e2e1]/30 opacity-80 transition-opacity hover:text-[#22C55E] hover:opacity-100" href="#">
              Terms
            </a>
            <a className="text-[#e5e2e1]/30 opacity-80 transition-opacity hover:text-[#22C55E] hover:opacity-100" href="#">
              Privacy
            </a>
            <a className="text-[#e5e2e1]/30 opacity-80 transition-opacity hover:text-[#22C55E] hover:opacity-100" href="#">
              Hardware Sync
            </a>
            <a className="text-[#e5e2e1]/30 opacity-80 transition-opacity hover:text-[#22C55E] hover:opacity-100" href="#">
              API
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

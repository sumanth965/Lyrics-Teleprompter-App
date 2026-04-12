import Link from "next/link";

const songs = [
  { title: "Neon Horizon", artist: "Echoes of Silence", bpm: 128, key: "Am", time: "04:22", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB49aw64LjMwp7QFoZWBSn9QM_Qw7btChsXE3pK4uqekHo-dfOsfALyHAA5ArKEQSF0m4zoLanZVgVqROvSWX627Cluarh8n-qtRsooVR-dWhXlsyhV13qwcTFf14ufcNUpoEX-H6rLiW0KphM3HBsmEPA017m7GgYJeA07TEbA74wCWfsQwk0GtX-iY4FHSH2348guLCa4due2tZNyYNxRbrbgxev46ZcCuzNi4wT3OeZoJEjbVIaRBuwFClV5bi02PGTHDdad4EJR" },
  { title: "Obsidian Pulse", artist: "Vortex Theory", bpm: 115, key: "F#m", time: "03:58", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDz3nA1OsTLuSDuBXJ08myN1hO15go3AJ_LgSMe4cFkxivDBsgYWCmlKrmh1o9YKd_tHomsVb8b9M-sOIB52i8Qk1tNbnkb9-Nev6e6N5h1DedJZoJj1nCMQ8ZcMmPJxpzaHq_VjoDkERROF8Ktq9t5LKnCOdRT3OiyXjoarcikXyWCsa7S6rrZJene57tHRZScQ63FmSkzgbLpEj5_UzeQEAKcYJI5G8fy40tpoybaDIP7N5R_wVUh8wHYTzIZQ89F38jnZ-H1EiiV" },
  { title: "Frictionless", artist: "Liquid Glass", bpm: 142, key: "C", time: "05:10", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyS7f7vThuHoHHyAsLXKdJI2oMR-bYAZt_GWB8c4Qz3W_pw2x6kEuRzNFyIiwcqcoy2z1WbHWFjuHc7YxSy9VPvEm397tRGCipuf-9hjjqgKnNcs8DV6J4S3B0Iov1omzawcaxIRd8IXRC6bGZBES4mXSEPwe2ih2sFCT72j2CnslmEKMkk_aqDJqh_fBVslRsza9ZvN_PxzgMGq3OGJDU5YFIH2BWyUBTBYNDdrhLeYWaJ64y4hua7RbQGtLviza1FSjhjN2hIe_o" },
  { title: "Midnight Logic", artist: "Quartz Project", bpm: 92, key: "Gm", time: "03:45", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoPFWvpSDmElt8cKfPxs3gXqNC011GUXZFlMXIe8NDfFBCFInEa5fpTmPI9rFsfRkxUyIn73NXwWbxUUdYK6bRtj2r1E8RVZibYfgczPeHPDOW2IYAPofMfZrgDxrZ2hWEooXFBnCP2m1oAPJSxDa96zt7TOpO_ttN7-OTAAP5MdpJzGUD2jqzEy9yfOuOKxMpfmIoCyb2hFySObnaX3JT-HZBxu4HYFEJMHDM-MdcWq1_RGgaBIo7HoWLdySR4NxEtHh1jz6vCfvZ" },
  { title: "Static Void", artist: "The Architects", bpm: 175, key: "Eb", time: "02:31", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLWXklFL1kXw9gNqjYWZRckqAfwOVC8fn9NZE-WnDykVntpbkpssq4o-cL0sX2uR0rEH6IEoLTTDnl18srWq9gTk_OfOEBtXbRIQtIwDcU5rs6-wFT1-XQZWABr7Ueolz3rUw_-vrilvMwb5w9tJpn4V7cwu3ljD1ub-zKf8r95H7ynPyCrcu2hk0mfuA2KvNhsJYJ4__Y9gEG-tgqUatbHgJF_55uhsoTw9NMC9x_ySIN-vPDzQa5fLGz_P9s2aZqkfbMUlJn3nrd" },
  { title: "Titanium Echo", artist: "Metalsmith", bpm: 108, key: "Dm", time: "04:15", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4fJKsrc-BueTASQAEkPy8kLne2pFQ61kHMUiS2VmEqk_yFRfyXeMIhR8TALXmuZBO0Uv2doHic0QQxZY4gmZHBtTci4GnwEhFsy2EO7AO_aauTqNV52ZJ16pa2BL3wzVH-7JI4Yl2h6Wnd5Ggtv0BHi8MfvPlmp1vhLLjoYo__eLQeijyns3NmBAvNDo2Ct_vrnJnVZDEUTpvslOoXuceOU4ny8Rx9fa730PkbJzVnKMcsBUxHrsahIAVZVSE_oKbk1zKFZIXyH4L" },
];

export default function LibraryPage() {
  return (
    <div className="bg-[#131313] text-[#e5e2e1]">
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-[#131313]/70 px-8 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <Link href="/" className="text-xl font-black tracking-tighter text-[#22C55E]">OBSIDIAN STAGE</Link>
        <div className="hidden items-center gap-8 tracking-tight md:flex">
          <Link className="border-b-2 border-[#22C55E] pb-1 font-bold text-[#22C55E]" href="/library">Library</Link>
          <Link className="text-[#e5e2e1]/50 transition-all duration-200 hover:text-[#e5e2e1]" href="/studio">Studio</Link>
          <a className="text-[#e5e2e1]/50 transition-all duration-200 hover:text-[#e5e2e1]" href="#">Settings</a>
        </div>
        <button className="rounded-xl bg-[#22C55E] px-6 py-2 font-bold text-[#003915] transition-all duration-200 active:scale-95">Go Live</button>
      </nav>

      <div className="flex h-screen overflow-hidden pt-20">
        <aside className="hidden h-screen w-64 flex-col border-r border-[#3d4a3d]/15 bg-[#131313] py-8 lg:flex">
          <nav className="flex-1 space-y-2">
            <a className="flex items-center gap-4 px-8 py-3 text-[#e5e2e1]/40 transition-colors duration-300 hover:bg-[#2a2a2a] hover:text-[#e5e2e1]" href="#"><span className="material-symbols-outlined">queue_music</span><span className="text-[0.75rem] uppercase tracking-widest">Current Set</span></a>
            <a className="flex items-center gap-4 border-r-4 border-[#22C55E] bg-[#22C55E]/10 px-8 py-3 text-[#22C55E]" href="#"><span className="material-symbols-outlined">library_music</span><span className="text-[0.75rem] uppercase tracking-widest">Library</span></a>
            <Link className="flex items-center gap-4 px-8 py-3 text-[#e5e2e1]/40 transition-colors duration-300 hover:bg-[#2a2a2a] hover:text-[#e5e2e1]" href="/player"><span className="material-symbols-outlined">teleprompter</span><span className="text-[0.75rem] uppercase tracking-widest">Player</span></Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto px-8 py-8 md:px-12">
          <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="mb-2 text-5xl font-black uppercase tracking-tight">Song Library</h1>
              <p className="text-sm tracking-wide text-[#bccbb9]">1,248 ASSETS SYNCED ACROSS STUDIO</p>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-8 pb-24 md:grid-cols-2 xl:grid-cols-3">
            {songs.map((song) => (
              <Link key={song.title} href="/player" className="group relative rounded-lg bg-[#1c1b1b] p-6 transition-all duration-300 hover:bg-[#201f1f]">
                <div className="flex gap-6">
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg shadow-lg">
                    <img alt={song.title} src={song.image} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="material-symbols-outlined text-4xl text-[#4be277]">play_circle</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center overflow-hidden">
                    <h3 className="truncate text-lg font-bold transition-colors group-hover:text-[#4be277]">{song.title}</h3>
                    <p className="mb-4 text-sm font-medium uppercase tracking-tighter text-[#bccbb9]">{song.artist}</p>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="flex flex-col"><span className="text-[10px] font-bold uppercase tracking-widest text-[#bccbb9]/60">BPM</span><span>{song.bpm}</span></div>
                      <div className="flex flex-col"><span className="text-[10px] font-bold uppercase tracking-widest text-[#bccbb9]/60">Key</span><span>{song.key}</span></div>
                      <div className="flex flex-col"><span className="text-[10px] font-bold uppercase tracking-widest text-[#bccbb9]/60">Time</span><span>{song.time}</span></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

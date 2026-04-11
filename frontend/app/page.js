export default function HomePage() {
  const songs = [
    {
      title: "Neon Horizon",
      artist: "Echoes of Silence",
      bpm: "128",
      key: "Am",
      time: "04:22",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB49aw64LjMwp7QFoZWBSn9QM_Qw7btChsXE3pK4uqekHo-dfOsfALyHAA5ArKEQSF0m4zoLanZVgVqROvSWX627Cluarh8n-qtRsooVR-dWhXlsyhV13qwcTFf14ufcNUpoEX-H6rLiW0KphM3HBsmEPA017m7GgYJeA07TEbA74wCWfsQwk0GtX-iY4FHSH2348guLCa4due2tZNyYNxRbrbgxev46ZcCuzNi4wT3OeZoJEjbVIaRBuwFClV5bi02PGTHDdad4EJR",
      alt: "abstract album art featuring vibrant neon green light waves against a textured black background with cinematic depth",
    },
    {
      title: "Obsidian Pulse",
      artist: "Vortex Theory",
      bpm: "115",
      key: "F#m",
      time: "03:58",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDz3nA1OsTLuSDuBXJ08myN1hO15go3AJ_LgSMe4cFkxivDBsgYWCmlKrmh1o9YKd_tHomsVb8b9M-sOIB52i8Qk1tNbnkb9-Nev6e6N5h1DedJZoJj1nCMQ8ZcMmPJxpzaHq_VjoDkERROF8Ktq9t5LKnCOdRT3OiyXjoarcikXyWCsa7S6rrZJene57tHRZScQ63FmSkzgbLpEj5_UzeQEAKcYJI5G8fy40tpoybaDIP7N5R_wVUh8wHYTzIZQ89F38jnZ-H1EiiV",
      alt: "moody high-contrast photo of a DJ console in a dark club with sharp green laser beams piercing through haze",
    },
    {
      title: "Frictionless",
      artist: "Liquid Glass",
      bpm: "142",
      key: "C",
      time: "05:10",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAyS7f7vThuHoHHyAsLXKdJI2oMR-bYAZt_GWB8c4Qz3W_pw2x6kEuRzNFyIiwcqcoy2z1WbHWFjuHc7YxSy9VPvEm397tRGCipuf-9hjjqgKnNcs8DV6J4S3B0Iov1omzawcaxIRd8IXRC6bGZBES4mXSEPwe2ih2sFCT72j2CnslmEKMkk_aqDJqh_fBVslRsza9ZvN_PxzgMGq3OGJDU5YFIH2BWyUBTBYNDdrhLeYWaJ64y4hua7RbQGtLviza1FSjhjN2hIe_o",
      alt: "minimalist photography of a single bright green light bulb glowing in an otherwise pitch black minimalist music studio",
    },
    {
      title: "Midnight Logic",
      artist: "Quartz Project",
      bpm: "92",
      key: "Gm",
      time: "03:45",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBoPFWvpSDmElt8cKfPxs3gXqNC011GUXZFlMXIe8NDfFBCFInEa5fpTmPI9rFsfRkxUyIn73NXwWbxUUdYK6bRtj2r1E8RVZibYfgczPeHPDOW2IYAPofMfZrgDxrZ2hWEooXFBnCP2m1oAPJSxDa96zt7TOpO_ttN7-OTAAP5MdpJzGUD2jqzEy9yfOuOKxMpfmIoCyb2hFySObnaX3JT-HZBxu4HYFEJMHDM-MdcWq1_RGgaBIo7HoWLdySR4NxEtHh1jz6vCfvZ",
      alt: "extreme close-up of a high-end chrome microphone with green reflections from studio lighting and bokeh background",
    },
    {
      title: "Static Void",
      artist: "The Architects",
      bpm: "175",
      key: "Eb",
      time: "02:31",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCLWXklFL1kXw9gNqjYWZRckqAfwOVC8fn9NZE-WnDykVntpbkpssq4o-cL0sX2uR0rEH6IEoLTTDnl18srWq9gTk_OfOEBtXbRIQtIwDcU5rs6-wFT1-XQZWABr7Ueolz3rUw_-vrilvMwb5w9tJpn4V7cwu3ljD1ub-zKf8r95H7ynPyCrcu2hk0mfuA2KvNhsJYJ4__Y9gEG-tgqUatbHgJF_55uhsoTw9NMC9x_ySIN-vPDzQa5fLGz_P9s2aZqkfbMUlJn3nrd",
      alt: "abstract geometric composition with metallic textures and neon green accents in a futuristic architecture style",
    },
    {
      title: "Titanium Echo",
      artist: "Metalsmith",
      bpm: "108",
      key: "Dm",
      time: "04:15",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB4fJKsrc-BueTASQAEkPy8kLne2pFQ61kHMUiS2VmEqk_yFRfyXeMIhR8TALXmuZBO0Uv2doHic0QQxZY4gmZHBtTci4GnwEhFsy2EO7AO_aauTqNV52ZJ16pa2BL3wzVH-7JI4Yl2h6Wnd5Ggtv0BHi8MfvPlmp1vhLLjoYo__eLQeijyns3NmBAvNDo2Ct_vrnJnVZDEUTpvslOoXuceOU4ny8Rx9fa730PkbJzVnKMcsBUxHrsahIAVZVSE_oKbk1zKFZIXyH4L",
      alt: "dramatic wide shot of an empty concert arena stage with green floodlights and thick floor haze",
    },
  ];

  return (
    <div className="bg-[#131313] text-[#e5e2e1] selection:bg-[#4be277] selection:text-[#003915]">
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-[#131313]/70 px-8 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <div className="text-xl font-black tracking-tighter text-[#22C55E]">OBSIDIAN STAGE</div>
        <div className="hidden items-center gap-8 tracking-tight md:flex">
          <a className="border-b-2 border-[#22C55E] pb-1 font-bold text-[#22C55E]" href="#">Library</a>
          <a className="text-[#e5e2e1]/50 transition-all duration-200 hover:text-[#e5e2e1]" href="#">Studio</a>
          <a className="text-[#e5e2e1]/50 transition-all duration-200 hover:text-[#e5e2e1]" href="#">Settings</a>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-sm text-[#bccbb9]">search</span>
            <input
              className="w-64 rounded-full border-none bg-[#1c1b1b] py-2 pr-4 pl-10 text-sm focus:ring-1 focus:ring-[#4be277]"
              placeholder="Search track, artist, or BPM..."
              type="text"
            />
          </div>
          <button className="rounded-xl bg-[#22C55E] px-6 py-2 font-bold text-[#003915] transition-all duration-200 active:scale-95">
            Go Live
          </button>
        </div>
      </nav>

      <div className="flex h-screen overflow-hidden pt-20">
        <aside className="hidden h-screen w-64 flex-col border-r border-[#3d4a3d]/15 bg-[#131313] py-8 lg:flex">
          <div className="mb-10 flex items-center gap-3 px-8">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-[#2a2a2a]">
              <img
                className="h-full w-full object-cover"
                alt="close-up portrait of a professional singer with stage lighting and atmospheric smoke in background"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0yjB-2kgIwiuQRhzW5eFZlBN3CVpGX4wDRYcf95vtNyPzON3QC0ft0ZMVGDP6lJqfSBEV3WbG5QC8XYxexQWxyciWiWulOJQPaYhe2gokhLqJbQHDRgcCl9kQ8lfzYR7YuaBZoSmx08hNN5kwUq_TkQUX00wY2RS97ifC0_eKGAeBSSfk0c62V3-hKrwCRV7421ws30sZZDfbM7atYbSsK7HgWnkYO2YiV9oS3BannLvfUZUjhJIBDjXzpJtgK86L3crXj1PW7X2q"
              />
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest text-[#22C55E] uppercase">Lead Vocalist</div>
              <div className="text-[10px] tracking-[0.1em] text-[#bccbb9] uppercase">Active Session</div>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              ["queue_music", "Current Set", false],
              ["library_music", "Library", true],
              ["history", "History", false],
              ["settings_input_component", "Hardware", false],
            ].map(([icon, label, active]) => (
              <a
                key={label}
                className={`flex items-center gap-4 px-8 py-3 transition-colors duration-300 ${
                  active
                    ? "border-r-4 border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]"
                    : "text-[#e5e2e1]/40 hover:bg-[#2a2a2a] hover:text-[#e5e2e1]"
                }`}
                href="#"
              >
                <span className="material-symbols-outlined">{icon}</span>
                <span className="text-[0.75rem] tracking-widest uppercase">{label}</span>
              </a>
            ))}
          </nav>

          <div className="mt-auto px-6">
            <button className="w-full rounded-xl border border-[#22C55E]/30 py-4 text-xs font-bold tracking-widest text-[#22C55E] uppercase transition-colors hover:bg-[#22C55E]/5">
              New Setlist
            </button>
          </div>
        </aside>

        <main className="no-scrollbar flex-1 overflow-y-auto bg-[#131313] px-8 py-8 md:px-12">
          <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="mb-2 text-5xl font-black tracking-tight uppercase">Song Library</h1>
              <p className="text-sm tracking-wide text-[#bccbb9]">1,248 ASSETS SYNCED ACROSS STUDIO</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 rounded-full bg-[#2a2a2a] px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors hover:bg-[#393939]">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Genre
              </button>
              <button className="flex items-center gap-2 rounded-full bg-[#2a2a2a] px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors hover:bg-[#393939]">
                <span className="material-symbols-outlined text-sm">sort</span>
                Latest
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-8 pb-24 md:grid-cols-2 xl:grid-cols-3">
            {songs.map((song) => (
              <div
                key={song.title}
                className="group relative rounded-lg bg-[#1c1b1b] p-6 transition-all duration-300 hover:bg-[#201f1f]"
              >
                <div className="flex gap-6">
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg shadow-lg">
                    <img
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={song.alt}
                      src={song.image}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="material-symbols-outlined text-4xl text-[#4be277]">play_circle</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center overflow-hidden">
                    <h3 className="truncate text-lg font-bold transition-colors group-hover:text-[#4be277]">{song.title}</h3>
                    <p className="mb-4 text-sm font-medium tracking-tighter text-[#bccbb9] uppercase">{song.artist}</p>
                    <div className="flex items-center gap-4">
                      {[
                        ["BPM", song.bpm],
                        ["Key", song.key],
                        ["Time", song.time],
                      ].map(([label, value]) => (
                        <div key={`${song.title}-${label}`} className="flex flex-col">
                          <span className="text-[10px] font-bold tracking-widest text-[#bccbb9]/60 uppercase">{label}</span>
                          <span className="font-mono text-xs">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <div className="pointer-events-none fixed bottom-0 z-50 w-full px-6 pb-6">
        <div className="pointer-events-auto mx-auto flex h-20 max-w-5xl items-center rounded-2xl border border-[#3d4a3d]/15 bg-[#201f1f]/70 px-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex min-w-[200px] items-center gap-4">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md">
              <img
                className="h-full w-full object-cover"
                alt="album art thumbnail"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNFYQvOyO5QJno4jDCBwh2xYGzc8r0wiPyE0TV1bMw5X2Na34H_G56czjOXx0Dy0BUj_WcYN0JWvndm1h-r2DpD-yfur58ba7ipb8jZ2_KRyMWEBhbhZibdlexMQugpuP_3GzNnu05uMlOyMSeqT5quDQjX7vXnpKl9vNYqHS0EmBLOgfZMqgTIimmXfdbKNULrZ9dQpMNnXr6pb5WJ_66n1Yf4f1mn5rG2XgTQY3s3qe7PKMZoFm4hym0QZaT83ru_TYh3kAhY2Ax"
              />
            </div>
            <div className="overflow-hidden">
              <div className="truncate text-sm font-bold">Neon Horizon</div>
              <div className="truncate text-[10px] tracking-widest text-[#bccbb9] uppercase">Preparing Session...</div>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center gap-1">
            <div className="flex items-center gap-6">
              <button className="material-symbols-outlined text-[#e5e2e1]/50 hover:text-[#e5e2e1]">skip_previous</button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4be277] text-[#003915]">
                <span className="material-symbols-outlined text-2xl">play_arrow</span>
              </button>
              <button className="material-symbols-outlined text-[#e5e2e1]/50 hover:text-[#e5e2e1]">skip_next</button>
            </div>
            <div className="relative mt-1 h-1 w-full max-w-md overflow-hidden rounded-full bg-[#353534]">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-[#4be277] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>
          </div>

          <div className="flex min-w-[200px] items-center justify-end gap-6">
            <button className="material-symbols-outlined text-[#bccbb9] hover:text-[#4be277]">lyrics</button>
            <button className="material-symbols-outlined text-[#bccbb9] hover:text-[#4be277]">volume_up</button>
            <div className="h-8 w-px bg-[#3d4a3d]/30" />
            <div className="flex flex-col items-end">
              <div className="text-[10px] font-bold tracking-widest text-[#4be277] uppercase">Sync Status</div>
              <div className="font-mono text-xs">LATENCY: 4ms</div>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 mb-20 w-full border-t border-[#3d4a3d]/15 bg-[#131313] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-8 md:flex-row">
          <div className="text-[10px] font-medium tracking-[0.05em] text-[#e5e2e1]/30 uppercase">
            © 2024 OBSIDIAN STAGE. ENGINEERED FOR PERFORMANCE.
          </div>
          <div className="flex gap-8">
            {[
              "Terms",
              "Privacy",
              "Hardware Sync",
              "API",
            ].map((item) => (
              <a
                key={item}
                className="text-[10px] font-medium tracking-[0.05em] text-[#e5e2e1]/30 uppercase transition-opacity duration-200 hover:text-[#22C55E]"
                href="#"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

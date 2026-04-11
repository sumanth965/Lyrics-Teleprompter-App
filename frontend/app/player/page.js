export default function PlayerPage() {
  return (
    <div className="bg-[#131313] text-[#e5e2e1] font-[Inter,Arial,Helvetica,sans-serif] overflow-hidden h-screen select-none">
      <header className="fixed top-0 z-50 w-full bg-[#131313]/70 backdrop-blur-md flex justify-between items-center px-8 py-4">
        <div className="text-xl font-black tracking-tighter text-[#22C55E]">OBSIDIAN STAGE</div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-[#e5e2e1]/50 hover:text-[#e5e2e1] tracking-tight transition-all duration-200" href="#">
            Library
          </a>
          <a
            className="text-[#22C55E] font-bold border-b-2 border-[#22C55E] pb-1 tracking-tight transition-all duration-200"
            href="#"
          >
            Studio
          </a>
          <a className="text-[#e5e2e1]/50 hover:text-[#e5e2e1] tracking-tight transition-all duration-200" href="#">
            Settings
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="bg-[#22c55e] text-[#004b1e] px-6 py-2 rounded-full font-bold text-sm tracking-tight active:scale-95 duration-100 transition-all">
            Go Live
          </button>
        </div>
      </header>

      <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#131313] py-8 z-40 border-r border-[#3d4a3d]/15">
        <div className="px-8 mb-12 mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2a2a2a] border border-[#3d4a3d]/20">
              <img
                className="w-full h-full object-cover"
                alt="Dramatic portrait of a male vocalist in a dark recording studio with professional lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzyxlUuQSTADAIA15Gqe6_ycmED6xUXwBrBY_SmQGB7Y13FDtRh8C4qSO64JsZIxYh6FtzAbYlHEKIik0tfuDQifLmIS0OSkJ28KKmL9QzjmURcZHx1tc_y94kKGw0TlvcfPqGUhQuAplX9ZdWm6nPzMrStn4z_vGUXEho9RstjHAeX0rE102wK-HQZal4StOwQtRZ5e55MZPALiQSfv4E9u84OicOnIhjyh0LudtoJKV3vdyq1usDdEET4mPHIIGvDp9gu_hsWfur"
              />
            </div>
            <div>
              <p className="text-[#22C55E] font-bold text-xs uppercase tracking-widest leading-none mb-1">Lead Vocalist</p>
              <p className="text-[#e5e2e1]/40 text-[10px] uppercase tracking-widest">Active Session</p>
            </div>
          </div>
          <button className="w-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#22C55E]/20 transition-all">
            New Setlist
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          <a className="flex items-center gap-4 px-8 py-4 text-[#22C55E] border-r-4 border-[#22C55E] bg-[#22C55E]/10 transition-colors duration-300" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              queue_music
            </span>
            <span className="uppercase tracking-widest text-[0.75rem]">Current Set</span>
          </a>
          <a className="flex items-center gap-4 px-8 py-4 text-[#e5e2e1]/40 hover:bg-[#2a2a2a] hover:text-[#e5e2e1] transition-colors duration-300" href="#">
            <span className="material-symbols-outlined">library_music</span>
            <span className="uppercase tracking-widest text-[0.75rem]">Library</span>
          </a>
          <a className="flex items-center gap-4 px-8 py-4 text-[#e5e2e1]/40 hover:bg-[#2a2a2a] hover:text-[#e5e2e1] transition-colors duration-300" href="#">
            <span className="material-symbols-outlined">history</span>
            <span className="uppercase tracking-widest text-[0.75rem]">History</span>
          </a>
          <a className="flex items-center gap-4 px-8 py-4 text-[#e5e2e1]/40 hover:bg-[#2a2a2a] hover:text-[#e5e2e1] transition-colors duration-300" href="#">
            <span className="material-symbols-outlined">settings_input_component</span>
            <span className="uppercase tracking-widest text-[0.75rem]">Hardware</span>
          </a>
        </nav>
      </aside>

      <main className="ml-0 lg:ml-64 pt-20 h-screen flex flex-col relative overflow-hidden bg-[#131313]">
        <div className="absolute top-24 left-8 right-8 z-30 flex justify-between items-start pointer-events-none">
          <div className="bg-[#201f1f]/40 backdrop-blur-sm p-6 rounded-2xl">
            <h1 className="text-4xl font-extrabold tracking-tighter text-[#e5e2e1] mb-2 uppercase">Neon Horizon</h1>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bccbb9]/60">Tempo</span>
                <span className="text-xl font-bold text-[#4be277] font-mono tracking-tighter">128 BPM</span>
              </div>
              <div className="w-[1px] h-full bg-[#3d4a3d]/30 self-stretch" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bccbb9]/60">Key</span>
                <span className="text-xl font-bold text-[#e5e2e1] font-mono tracking-tighter">Eb Major</span>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2a2a]/60 backdrop-blur-sm p-6 rounded-2xl text-right">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bccbb9]/60 block mb-1">Time Remaining</span>
            <span className="text-4xl font-black text-[#e5e2e1] font-mono tracking-tighter">03:42</span>
          </div>
        </div>

        <div className="flex-grow scrolling-content flex flex-col items-center justify-center overflow-hidden px-4 md:px-24">
          <div className="w-full max-w-5xl space-y-12 py-96 text-center transition-all duration-700">
            <p className="text-[#bccbb9] opacity-20 text-[2.75rem] font-bold tracking-tight leading-tight">Lost in the echoes of a digital dream</p>
            <p className="text-[#bccbb9] opacity-40 text-[2.75rem] font-bold tracking-tight leading-tight">Walking through shadows where light used to beam</p>

            <div className="py-8 relative">
              <p className="text-white text-[3.5rem] font-extrabold tracking-tight leading-none active-lyric-glow scale-105 transition-transform">
                BUT THE NEON HORIZON IS CALLING MY NAME
              </p>
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#4be277] animate-pulse" />
                <div className="h-[2px] w-8 bg-[#4be277]" />
              </div>
            </div>

            <p className="text-[#bccbb9] opacity-40 text-[2.75rem] font-bold tracking-tight leading-tight">Igniting the sparks of a long-lost flame</p>
            <p className="text-[#bccbb9] opacity-20 text-[2.75rem] font-bold tracking-tight leading-tight">We are the circuits, we are the wire</p>
            <p className="text-[#bccbb9] opacity-10 text-[2.75rem] font-bold tracking-tight leading-tight">Burning forever in electronic fire</p>
          </div>
        </div>

        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
          <div className="absolute -top-4 left-4 right-4 h-1 bg-[#353534] rounded-full overflow-hidden">
            <div className="h-full bg-[#4be277] w-1/3 shadow-[0_0_8px_rgba(75,226,119,0.8)] relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#4be277] rounded-full blur-[2px]" />
            </div>
          </div>

          <div className="bg-[#201f1f]/70 backdrop-blur-xl rounded-[1rem] p-4 flex items-center justify-between shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-[#3d4a3d]/10">
            <div className="flex items-center gap-6 px-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[#bccbb9]">Speed</span>
                  <span className="text-[8px] font-mono text-[#4be277]">1.2X</span>
                </div>
                <input className="w-24 h-1 bg-[#353534] accent-[#4be277] cursor-pointer appearance-none rounded-full" type="range" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[#bccbb9]">Size</span>
                  <span className="text-[8px] font-mono text-[#e5e2e1]">100%</span>
                </div>
                <input className="w-24 h-1 bg-[#353534] accent-[#e5e2e1] cursor-pointer appearance-none rounded-full" type="range" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#353534] transition-colors text-[#e5e2e1]">
                <span className="material-symbols-outlined text-3xl">skip_previous</span>
              </button>
              <button className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#4be277] to-[#22c55e] text-[#003915] shadow-lg shadow-[#4be277]/20 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  pause
                </span>
              </button>
              <button className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#353534] transition-colors text-[#e5e2e1]">
                <span className="material-symbols-outlined text-3xl">skip_next</span>
              </button>
            </div>

            <div className="flex items-center gap-3 px-4">
              <button className="p-3 rounded-lg hover:bg-[#353534] text-[#bccbb9] transition-all">
                <span className="material-symbols-outlined">restart_alt</span>
              </button>
              <button className="p-3 rounded-lg hover:bg-[#353534] text-[#bccbb9] transition-all">
                <span className="material-symbols-outlined">mic</span>
              </button>
              <button className="p-3 rounded-lg hover:bg-[#353534] text-[#bccbb9] transition-all">
                <span className="material-symbols-outlined">fullscreen</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full z-10 pointer-events-none">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <p className="text-[10px] font-medium tracking-[0.05em] uppercase text-[#e5e2e1]/30">
            © 2024 OBSIDIAN STAGE. ENGINEERED FOR PERFORMANCE.
          </p>
          <div className="flex gap-6 pointer-events-auto">
            <a className="text-[10px] font-medium tracking-[0.05em] uppercase text-[#e5e2e1]/30 hover:text-[#22C55E] transition-opacity" href="#">
              Terms
            </a>
            <a className="text-[10px] font-medium tracking-[0.05em] uppercase text-[#e5e2e1]/30 hover:text-[#22C55E] transition-opacity" href="#">
              Privacy
            </a>
            <a className="text-[10px] font-medium tracking-[0.05em] uppercase text-[#e5e2e1]/30 hover:text-[#22C55E] transition-opacity" href="#">
              Hardware Sync
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

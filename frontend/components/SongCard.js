import Link from "next/link";

export default function SongCard({ song }) {
  // Generate a consistent abstract color for the song based on its title
  const getPlaceholderGradient = (str) => {
    const hash = str.split("").reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const h1 = Math.abs(hash % 360);
    const h2 = (h1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${h1}, 70%, 40%), hsl(${h2}, 80%, 20%))`;
  };

  return (
    <Link
      href={`/player?songId=${song.id}`}
      className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.03] p-5 transition-all duration-500 hover:border-[#22C55E]/30 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-[#22C55E]/10 active:scale-[0.98]"
    >
      <div className="flex items-center gap-6">
        {/* Dynamic Album Art / Icon */}
        <div 
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl shadow-2xl"
          style={{ background: !song.image ? getPlaceholderGradient(song.title) : "transparent" }}
        >
          {song.image ? (
            <img 
              alt={song.title} 
              src={song.image} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-125" 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-black/20">
              <span className="material-symbols-outlined text-3xl text-white/40 group-hover:scale-110 transition-transform">music_note</span>
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22C55E] text-black shadow-lg shadow-[#22C55E]/50">
              <span className="material-symbols-outlined text-2xl font-black">play_arrow</span>
            </div>
          </div>
        </div>

        {/* Text & Metadata */}
        <div className="flex flex-1 flex-col justify-center overflow-hidden">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h3 className="truncate text-lg font-black tracking-tight text-white transition-colors group-hover:text-[#22C55E]">
              {song.title}
            </h3>
            {song.audio && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22C55E]/10" title="Audio Attached">
                <span className="material-symbols-outlined text-[12px] text-[#22C55E] font-black">graphic_eq</span>
              </div>
            )}
          </div>
          
          <p className="mb-4 truncate text-xs font-bold uppercase tracking-[0.15em] text-white/40 group-hover:text-white/60 transition-colors">
            {song.artist}
          </p>

          <div className="flex items-center gap-4 border-t border-white/5 pt-3">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">BPM</span>
              <span className="text-xs font-mono font-bold text-white/60">{song.bpm || "120"}</span>
            </div>
            <div className="h-6 w-px bg-white/5" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Key</span>
              <span className="text-xs font-mono font-bold text-white/60">{song.key || "C"}</span>
            </div>
            <div className="h-6 w-px bg-white/5" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">DUR</span>
              <span className="text-xs font-mono font-bold text-white/60">{song.duration || "4:20"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-[#22C55E] opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-20" />
    </Link>
  );
}

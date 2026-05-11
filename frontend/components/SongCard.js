import Link from "next/link";

export default function SongCard({ song }) {
  return (
    <Link
      href={`/player?songId=${song.id}`}
      className="group relative rounded-lg bg-[#1c1b1b] p-6 transition-all duration-300 hover:bg-[#201f1f]"
    >
      <div className="flex gap-6">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg shadow-lg">
          <img alt={`${song.title} by ${song.artist} cover art`} src={song.image || "/song-cover.svg"} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="material-symbols-outlined text-4xl text-[#4be277]">play_circle</span>
          </div>
        </div>
        <div className="flex flex-col justify-center overflow-hidden">
          <h3 className="truncate text-lg font-bold transition-colors group-hover:text-[#4be277]">{song.title}</h3>
          <p className="mb-4 text-sm font-medium uppercase tracking-tighter text-[#bccbb9]">{song.artist}</p>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex flex-col"><span className="text-[10px] font-bold uppercase tracking-widest text-[#bccbb9]/60">BPM</span><span>{song.bpm ?? "--"}</span></div>
            <div className="flex flex-col"><span className="text-[10px] font-bold uppercase tracking-widest text-[#bccbb9]/60">Key</span><span>{song.key ?? "--"}</span></div>
            <div className="flex flex-col"><span className="text-[10px] font-bold uppercase tracking-widest text-[#bccbb9]/60">Time</span><span>{song.time ?? "--:--"}</span></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

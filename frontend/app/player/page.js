import { Suspense } from "react";
import PlayerContent from "../../components/PlayerContent";

export default function PlayerPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22C55E] border-t-transparent"></div>
          <p className="text-zinc-400 text-sm">Loading Stage Player...</p>
        </div>
      </main>
    }>
      <PlayerContent />
    </Suspense>
  );
}

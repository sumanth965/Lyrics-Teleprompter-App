"use client";

export default function AudioPlayer({
  src,
  audioRef,
  onTimeUpdate,
  onCanPlay,
  onLoadedMetadata,
  onEnded,
  onError,
}) {
  if (!src) {
    return (
      <div className="fixed right-4 top-4 z-20 w-72 rounded-lg border border-zinc-800 bg-zinc-900/90 p-3">
        <p className="mb-2 text-xs uppercase tracking-wide text-zinc-400">Audio Sync</p>
        <p className="text-sm text-zinc-500">Audio file is missing for this song.</p>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-4 z-20 w-72 rounded-lg border border-zinc-800 bg-zinc-900/90 p-3">
      <p className="mb-2 text-xs uppercase tracking-wide text-zinc-400">Audio Sync</p>
      <audio
        ref={audioRef}
        src={src}
        controls
        className="w-full"
        onTimeUpdate={(event) => onTimeUpdate(event.currentTarget.currentTime)}
        onCanPlay={onCanPlay}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        onError={onError}
      />
    </div>
  );
}

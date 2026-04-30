"use client";

export default function AudioPlayer({
  src,
  audioRef,
  songId,
  hasAudio,
  onUpload,
  onRemove,
  onTimeUpdate,
  onCanPlay,
  onLoadedMetadata,
  onEnded,
  onError,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !onUpload) return;
    onUpload(file);
    // Reset so the same file can be re-selected if needed
    e.target.value = "";
  };

  return (
    <div className="fixed right-4 top-4 z-20 w-72 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/95 shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Audio Sync
          </p>
        </div>
        {hasAudio && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            title="Remove audio"
            className="rounded p-1 text-zinc-600 transition hover:bg-zinc-800 hover:text-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
            </svg>
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        {src ? (
          <audio
            ref={audioRef}
            src={src}
            controls
            className="w-full rounded-lg"
            onTimeUpdate={(event) => onTimeUpdate(event.currentTarget.currentTime)}
            onCanPlay={onCanPlay}
            onLoadedMetadata={onLoadedMetadata}
            onEnded={onEnded}
            onError={onError}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 py-3 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-zinc-700 text-zinc-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-400">No audio file</p>
              <p className="mt-0.5 text-[10px] text-zinc-600">Upload to enable sync playback</p>
            </div>
            {onUpload && (
              <label className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-300 transition hover:border-green-500/50 hover:bg-zinc-700 hover:text-green-400">
                UPLOAD AUDIO
                <input
                  type="file"
                  className="hidden"
                  accept="audio/mp3,audio/wav,audio/ogg,audio/m4a,audio/flac,audio/aac,.mp3,.wav,.ogg,.m4a,.flac,.aac"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

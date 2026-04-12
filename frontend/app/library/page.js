import Navbar from "../../components/Navbar";
import SongCard from "../../components/SongCard";
import songs from "../../data/songs.json";

export default function LibraryPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold md:text-4xl">Song Library</h1>
        <p className="mt-2 text-gray-400">Choose a song to start teleprompter mode.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>
    </main>
  );
}

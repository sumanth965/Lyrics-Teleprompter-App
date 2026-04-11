import PlayerScreen from "../../components/PlayerScreen";
import songs from "../../data/songs.json";

export default async function PlayerPage({ searchParams }) {
  const params = await searchParams;
  const requestedSong = Number(params?.song);
  const fallbackId = songs[0]?.id ?? 1;
  const songId = Number.isFinite(requestedSong) ? requestedSong : fallbackId;

  return <PlayerScreen songId={songId} />;
}

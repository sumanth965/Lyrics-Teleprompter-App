const Song = require("../models/Song");

const getSongs = async (req, res) => {
  const songs = await Song.find().sort({ createdAt: -1 });
  res.json(songs);
};

const getSongById = async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }
  res.json(song);
};

const createSong = async (req, res) => {
  const { title, artist, lyrics } = req.body;

  if (!title || !artist || !lyrics) {
    return res.status(400).json({ message: "title, artist, and lyrics are required" });
  }

  const created = await Song.create({ title, artist, lyrics });
  res.status(201).json(created);
};

const updateSong = async (req, res) => {
  const { title, artist, lyrics } = req.body;
  const song = await Song.findById(req.params.id);

  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }

  if (title !== undefined) song.title = title;
  if (artist !== undefined) song.artist = artist;
  if (lyrics !== undefined) song.lyrics = lyrics;

  const updated = await song.save();
  res.json(updated);
};

const deleteSong = async (req, res) => {
  const song = await Song.findById(req.params.id);

  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }

  await song.deleteOne();
  res.json({ message: "Song deleted" });
};

module.exports = {
  getSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
};

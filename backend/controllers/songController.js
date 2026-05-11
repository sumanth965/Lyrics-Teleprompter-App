const path = require("path");
const fs = require("fs");
const Song = require("../models/Song");
const catchAsync = require("../utils/catchAsync");

const getSongs = catchAsync(async (req, res) => {
  const songs = await Song.find().sort({ createdAt: -1 });
  res.json(songs);
});

const getSongById = catchAsync(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }
  res.json(song);
});

const createSong = catchAsync(async (req, res) => {
  const { title, artist, lyrics } = req.body;

  if (!title || !artist || !lyrics) {
    return res.status(400).json({ message: "title, artist, and lyrics are required" });
  }

  const created = await Song.create({ title, artist, lyrics });
  res.status(201).json(created);
});

const updateSong = catchAsync(async (req, res) => {
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
});

const deleteSong = catchAsync(async (req, res) => {
  const song = await Song.findById(req.params.id);

  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }

  // Remove audio file if present
  if (song.audioUrl) {
    const filePath = path.resolve(__dirname, "..", song.audioUrl.replace(/^\//, ""));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await song.deleteOne();
  res.json({ message: "Song deleted" });
});

const uploadAudio = catchAsync(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No audio file provided" });
  }

  // Remove old audio file if it exists and differs
  if (song.audioUrl) {
    const oldPath = path.resolve(__dirname, "..", song.audioUrl.replace(/^\//, ""));
    if (fs.existsSync(oldPath) && oldPath !== req.file.path) {
      fs.unlinkSync(oldPath);
    }
  }

  // Store as a root-relative URL: /uploads/audio/<filename>
  song.audioUrl = `/uploads/audio/${req.file.filename}`;
  await song.save();

  res.json({ audioUrl: song.audioUrl, message: "Audio uploaded successfully" });
});

const deleteAudio = catchAsync(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }

  if (song.audioUrl) {
    const filePath = path.resolve(__dirname, "..", song.audioUrl.replace(/^\//, ""));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    song.audioUrl = null;
    await song.save();
  }

  res.json({ message: "Audio removed" });
});

const autoSync = catchAsync(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song || !song.audioUrl) {
    return res.status(400).json({ message: "Song or audio file missing" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your_openai_api_key_here") {
    return res.status(400).json({ 
      message: "OpenAI API Key is missing. Please add it to your .env file and restart the server." 
    });
  }

  const { OpenAI } = require("openai");
  const openai = new OpenAI({ apiKey });

  const audioPath = path.resolve(__dirname, "..", song.audioUrl.replace(/^\//, ""));
  
  if (!fs.existsSync(audioPath)) {
    return res.status(404).json({ message: "Audio file not found on server" });
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });

    const lrcLyrics = transcription.segments.map(segment => {
      const time = segment.start;
      const mins = Math.floor(time / 60).toString().padStart(2, "0");
      const secs = (time % 60).toFixed(2).padStart(5, "0");
      return `[${mins}:${secs}] ${segment.text.trim()}`;
    }).join("\n");

    song.lyrics = lrcLyrics;
    await song.save();

    res.json({ lyrics: lrcLyrics, message: "AI Sync complete" });
  } catch (error) {
    console.error("AI Sync Error:", error);
    
    let userMessage = "AI transcription failed.";
    if (error.status === 429) {
      userMessage = "OpenAI Quota Exceeded. Please check your billing/balance at platform.openai.com.";
    } else if (error.status === 401) {
      userMessage = "Invalid OpenAI API Key. Please check your .env file.";
    }

    res.status(error.status || 500).json({ 
      message: userMessage, 
      error: error.message 
    });
  }
});

module.exports = {
  getSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
  uploadAudio,
  deleteAudio,
  autoSync,
};


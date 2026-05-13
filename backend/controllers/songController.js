const path = require("path");
const fs = require("fs");
const Song = require("../models/Song");
const catchAsync = require("../utils/catchAsync");
const { OpenAI } = require("openai");

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

  if (!title || !artist) {
    return res.status(400).json({ message: "Title and artist are required" });
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
  console.log(`Starting AI Sync for song ID: ${req.params.id}`);
  
  const song = await Song.findById(req.params.id);
  if (!song || !song.audioUrl) {
    return res.status(400).json({ message: "Song or audio file missing" });
  }

  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    console.error("Groq/OpenAI API Key is missing.");
    return res.status(400).json({ 
      message: "API Key is missing. Please add GROQ_API_KEY to your .env file." 
    });
  }

  let openai;
  try {
    openai = new OpenAI({ 
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
      timeout: 60000,
    });
  } catch (initError) {
    console.error("Failed to initialize AI client:", initError);
    return res.status(500).json({ message: "AI Client initialization failed", error: initError.message });
  }

  const audioPath = path.resolve(__dirname, "..", song.audioUrl.replace(/^\//, ""));
  console.log(`Loading audio from: ${audioPath}`);
  
  if (!fs.existsSync(audioPath)) {
    console.error(`Audio file not found: ${audioPath}`);
    return res.status(404).json({ message: "Audio file not found on server" });
  }

  const { language } = req.body || {}; // Safe destructuring

  try {
    console.log(`Calling Groq Whisper API (Language: ${language || "auto-detect"})...`);
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-large-v3-turbo", // Use turbo for stability and speed
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
      language: language || undefined, // Pass language if provided
    });

    console.log("Transcription received from AI provider.");

    if (!transcription.segments || !Array.isArray(transcription.segments)) {
      console.warn("No segments found in transcription response.");
      return res.status(500).json({ 
        message: "AI returned no segments. The audio might be too quiet or contain no speech.",
        fullResponse: transcription
      });
    }

    const lrcLyrics = transcription.segments.map(segment => {
      const time = segment.start;
      const mins = Math.floor(time / 60).toString().padStart(2, "0");
      const secs = (time % 60).toFixed(2).padStart(5, "0");
      return `[${mins}:${secs}] ${segment.text.trim()}`;
    }).join("\n");

    if (!lrcLyrics) {
      return res.status(400).json({ message: "AI generated empty lyrics. Please check the audio file." });
    }

    song.lyrics = lrcLyrics;
    await song.save();

    console.log("AI Sync successfully completed and saved.");
    res.json({ lyrics: lrcLyrics, message: "AI Sync complete" });
  } catch (error) {
    console.error("CRITICAL AI Sync Error:", error);
    
    let userMessage = "AI transcription failed.";
    const status = error.status || error.response?.status || 500;

    if (status === 429) {
      userMessage = "AI Quota Exceeded. Please check your billing/balance at the provider dashboard.";
    } else if (status === 401) {
      userMessage = "Invalid AI API Key. Please check your .env file.";
    } else if (status === 413) {
      userMessage = "Audio file too large. Max size for AI sync is 25MB.";
    }

    res.status(status).json({ 
      message: userMessage, 
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
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


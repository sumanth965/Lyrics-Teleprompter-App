const path = require("path");
const fs = require("fs");
const Song = require("../models/Song");
const catchAsync = require("../utils/catchAsync");
const { OpenAI } = require("openai");

const getSongs = catchAsync(async (req, res) => {
  const { audio, artist, title, recent } = req.query;
  const query = { user: req.user._id };
  if (audio === "has") query.audioUrl = { $ne: null };
  if (audio === "missing") query.audioUrl = null;
  if (artist) query.artist = new RegExp(artist, "i");
  if (title) query.title = new RegExp(title, "i");
  if (recent === "true") {
    query.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
  }
  const songs = await Song.find(query).sort({ createdAt: -1 });
  res.json(songs);
});

const getSongById = catchAsync(async (req, res) => {
  const song = await Song.findOne({ _id: req.params.id, user: req.user._id });
  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }
  res.json(song);
});

const createSong = catchAsync(async (req, res) => {
  const { title, artist, lyrics, notes, key, bpm, capo, chords, arrangement, displaySettings } = req.body;

  if (!title || !artist) {
    return res.status(400).json({ message: "Title and artist are required" });
  }

  const created = await Song.create({ title, artist, lyrics, notes, key, bpm, capo, chords, arrangement, displaySettings, user: req.user._id });
  res.status(201).json(created);
});

const updateSong = catchAsync(async (req, res) => {
  const { title, artist, lyrics, notes, key, bpm, capo, chords, arrangement, displaySettings } = req.body;
  const song = await Song.findOne({ _id: req.params.id, user: req.user._id });

  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }

  if (title !== undefined) song.title = title;
  if (artist !== undefined) song.artist = artist;
  if (lyrics !== undefined && lyrics !== song.lyrics) {
    song.lyricVersions.push({ lyrics: song.lyrics });
    song.lyrics = lyrics;
  }
  if (notes !== undefined) song.notes = notes;
  if (key !== undefined) song.key = key;
  if (bpm !== undefined) song.bpm = bpm || null;
  if (capo !== undefined) song.capo = capo;
  if (chords !== undefined) song.chords = chords;
  if (arrangement !== undefined) song.arrangement = arrangement;
  if (displaySettings !== undefined) song.displaySettings = displaySettings;

  const updated = await song.save();
  res.json(updated);
});

const deleteSong = catchAsync(async (req, res) => {
  const song = await Song.findOne({ _id: req.params.id, user: req.user._id });

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
  const song = await Song.findOne({ _id: req.params.id, user: req.user._id });
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
  song.audioUrl = process.env.AUDIO_PUBLIC_BASE_URL
    ? `${process.env.AUDIO_PUBLIC_BASE_URL.replace(/\/$/, "")}/${req.file.filename}`
    : `/uploads/audio/${req.file.filename}`;
  song.audioMetadata = {
    originalFilename: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    duration: req.body.duration ? Number(req.body.duration) : undefined,
    storageProvider: process.env.AUDIO_PUBLIC_BASE_URL ? "cloud-compatible" : "local",
  };
  await song.save();

  res.json({ audioUrl: song.audioUrl, audioMetadata: song.audioMetadata, message: "Audio uploaded successfully" });
});

const deleteAudio = catchAsync(async (req, res) => {
  const song = await Song.findOne({ _id: req.params.id, user: req.user._id });
  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }

  if (song.audioUrl) {
    const filePath = path.resolve(__dirname, "..", song.audioUrl.replace(/^\//, ""));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    song.audioUrl = null;
    song.audioMetadata = undefined;
    await song.save();
  }

  res.json({ message: "Audio removed" });
});

const autoSync = catchAsync(async (req, res) => {
  console.log(`Starting AI Sync for song ID: ${req.params.id}`);
  
  const song = await Song.findOne({ _id: req.params.id, user: req.user._id });
  if (!song || !song.audioUrl) {
    return res.status(400).json({ message: "Song or audio file missing" });
  }

  const provider = (process.env.AI_PROVIDER || (process.env.GROQ_API_KEY ? "groq" : "openai")).toLowerCase();
  const apiKey = provider === "groq" ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    console.error("Groq/OpenAI API Key is missing.");
    return res.status(400).json({ 
      message: `API key is missing. Set AI_PROVIDER=${provider} with ${provider === "groq" ? "GROQ_API_KEY" : "OPENAI_API_KEY"}.` 
    });
  }

  let openai;
  try {
    openai = new OpenAI({ 
      apiKey,
      baseURL: provider === "groq" ? (process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1") : (process.env.OPENAI_BASE_URL || undefined),
      timeout: Number(process.env.AI_TIMEOUT_MS || 60000),
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
    console.log(`Calling ${provider} transcription API (Language: ${language || "auto-detect"})...`);
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: provider === "groq" ? (process.env.GROQ_TRANSCRIPTION_MODEL || "whisper-large-v3-turbo") : (process.env.OPENAI_TRANSCRIPTION_MODEL || "whisper-1"),
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


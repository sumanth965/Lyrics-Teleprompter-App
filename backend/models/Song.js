const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    lyrics: {
      type: String,
      default: "",
    },
    audioUrl: {
      type: String,
      default: null,
    },
    audioMetadata: {
      originalFilename: String,
      mimeType: String,
      size: Number,
      duration: Number,
      storageProvider: { type: String, default: "local" },
    },
    notes: { type: String, default: "" },
    key: { type: String, default: "" },
    bpm: { type: Number, default: null },
    capo: { type: String, default: "" },
    chords: { type: String, default: "" },
    arrangement: { type: String, default: "" },
    displaySettings: {
      fontSize: Number,
      scrollSpeed: Number,
      syncOffset: Number,
      theme: String,
    },
    lyricVersions: [{ lyrics: String, createdAt: { type: Date, default: Date.now } }],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model("Song", songSchema);

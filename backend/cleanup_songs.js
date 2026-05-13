const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Song = require("./models/Song");

dotenv.config();

const cleanup = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected.");

    // Find songs where audioUrl is null, empty, or missing
    const result = await Song.deleteMany({
      $or: [
        { audioUrl: null },
        { audioUrl: "" },
        { audioUrl: { $exists: false } }
      ]
    });

    console.log(`Cleanup complete. Removed ${result.deletedCount} songs without audio.`);
    process.exit(0);
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  }
};

cleanup();

const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Song = require("./models/Song");
const Settings = require("./models/Settings");
const songs = require("./data/songs.json");

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await Song.deleteMany();
    await Song.insertMany(songs);

    await Settings.findOneAndUpdate(
      {},
      {
        scrollSpeed: 1,
        fontSize: 48,
        theme: "dark",
        lineSpacing: 1.6,
        autoScroll: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed", error);
    process.exit(1);
  }
};

seed();

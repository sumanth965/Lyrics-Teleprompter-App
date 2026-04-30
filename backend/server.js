const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const songRoutes = require("./routes/songRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

dotenv.config();


const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://lyrics-teleprompter-app.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));


app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/songs", songRoutes);
app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

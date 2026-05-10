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
  "https://lyrics-teleprompter.onrender.com",
  "https://lyrics-teleprompter-app.vercel.app" // Just in case they use vercel
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or is a subdomain of render.com
    const isAllowed = allowedOrigins.indexOf(origin) !== -1 || 
                     origin.endsWith(".onrender.com");
    
    if (!isAllowed) {
      console.warn(`Blocked by CORS: ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

app.use("/api/songs", songRoutes);
app.use("/api/settings", settingsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
});


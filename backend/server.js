const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const songRoutes = require("./routes/songRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));

const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const rateLimitMax = Number(process.env.RATE_LIMIT_MAX || 300);
const requestBuckets = new Map();
app.use((req, res, next) => {
  const key = req.ip || "unknown";
  const now = Date.now();
  const bucket = requestBuckets.get(key) || { count: 0, resetAt: now + rateLimitWindowMs };
  if (bucket.resetAt <= now) {
    bucket.count = 0;
    bucket.resetAt = now + rateLimitWindowMs;
  }
  bucket.count += 1;
  requestBuckets.set(key, bucket);
  if (bucket.count > rateLimitMax) {
    return res.status(429).json({ message: "Too many requests. Please slow down." });
  }
  return next();
});

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

app.get("/api/health/live", (_req, res) => {
  res.json({ status: "live", timestamp: new Date() });
});

app.get("/api/health/ready", (_req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({
    status: ready ? "ready" : "not_ready",
    dbState: mongoose.connection.readyState,
    timestamp: new Date(),
  });
});

app.get("/api/health", (_req, res) => {
  res.redirect(307, "/api/health/live");
});

app.use("/api/auth", authRoutes);
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  if (!process.env.MONGO_URI) {
    console.warn("WARNING: MONGO_URI is not defined. Database features will be unavailable.");
  }
  connectDB().catch(err => {
    console.error("Delayed MongoDB Connection Error:", err.message);
  });
});


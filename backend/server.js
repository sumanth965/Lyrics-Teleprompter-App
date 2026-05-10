const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const songRoutes = require("./routes/songRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// Use permissive CORS for debugging production issues
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Database connection check middleware
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: "Database connection not ready", 
      state: mongoose.connection.readyState 
    });
  }
  next();
});

app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    dbState: mongoose.connection.readyState,
    timestamp: new Date() 
  });
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

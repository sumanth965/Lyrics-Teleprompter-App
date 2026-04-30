const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const songRoutes = require("./routes/songRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

dotenv.config();


const app = express();

app.use(cors());
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

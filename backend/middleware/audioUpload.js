const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.resolve(__dirname, "../uploads/audio");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const songId = req.params.id;
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    cb(null, `${songId}-${unique}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = new Map([[".mp3", "audio/mpeg"], [".wav", "audio/wav"], [".ogg", "audio/ogg"], [".m4a", "audio/mp4"], [".flac", "audio/flac"], [".aac", "audio/aac"]]);
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.has(ext) && file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported audio format: ${ext}`), false);
  }
};

const audioUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});

module.exports = audioUpload;

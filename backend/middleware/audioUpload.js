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
    cb(null, `${songId}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = [".mp3", ".wav", ".ogg", ".m4a", ".flac", ".aac"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
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

const express = require("express");
const {
  getSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
  uploadAudio,
  deleteAudio,
} = require("../controllers/songController");
const audioUpload = require("../middleware/audioUpload");

const router = express.Router();

router.route("/").get(getSongs).post(createSong);
router.route("/:id").get(getSongById).put(updateSong).delete(deleteSong);
router.post("/:id/audio", audioUpload.single("audio"), uploadAudio);
router.delete("/:id/audio", deleteAudio);
router.post("/:id/auto-sync", require("../controllers/songController").autoSync);

module.exports = router;

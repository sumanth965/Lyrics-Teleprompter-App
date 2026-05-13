const express = require("express");
const {
  getSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
  uploadAudio,
  deleteAudio,
  autoSync,
} = require("../controllers/songController");
const audioUpload = require("../middleware/audioUpload");

const router = express.Router();

router.route("/").get(getSongs).post(createSong);
router.route("/:id").get(getSongById).put(updateSong).delete(deleteSong);
router.post("/:id/audio", audioUpload.single("audio"), uploadAudio);
router.delete("/:id/audio", deleteAudio);


// AI Sync Route
router.route("/:id/auto-sync")
  .post(autoSync)
  .get((req, res) => {
    res.status(405).json({ 
      message: "Method Not Allowed. Use POST instead of GET.",
      hint: "Check that your frontend is sending a POST request."
    });
  });

module.exports = router;

const express = require("express");
const {
  getSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
} = require("../controllers/songController");

const router = express.Router();

router.route("/").get(getSongs).post(createSong);
router.route("/:id").get(getSongById).put(updateSong).delete(deleteSong);

module.exports = router;

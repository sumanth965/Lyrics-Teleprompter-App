const express = require("express");
const { getSettings, updateSettings } = require("../controllers/settingsController");

const router = express.Router();

router.route("/").get(getSettings).put(updateSettings);

module.exports = router;

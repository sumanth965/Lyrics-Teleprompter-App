const Settings = require("../models/Settings");
const catchAsync = require("../utils/catchAsync");

const defaultSettings = {
  scrollSpeed: 1,
  fontSize: 48,
  theme: "dark",
  lineSpacing: 1.6,
  autoScroll: true,
};

const getSettings = catchAsync(async (req, res) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(defaultSettings);
  }

  res.json(settings);
});

const updateSettings = catchAsync(async (req, res) => {
  const payload = req.body;

  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings(defaultSettings);
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && key in defaultSettings) {
      settings[key] = value;
    }
  });

  const saved = await settings.save();
  res.json(saved);
});

module.exports = {
  getSettings,
  updateSettings,
};


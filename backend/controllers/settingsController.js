const Settings = require("../models/Settings");
const catchAsync = require("../utils/catchAsync");

const defaultSettings = {
  scrollSpeed: 1,
  fontSize: 48,
  theme: "dark",
  lineSpacing: 1.6,
  autoScroll: true,
  syncOffset: 0,
};

const normalizeSettings = (settings) => ({
  scrollSpeed: settings.scrollSpeed ?? defaultSettings.scrollSpeed,
  fontSize: settings.fontSize ?? defaultSettings.fontSize,
  theme: settings.theme ?? defaultSettings.theme,
  lineSpacing: settings.lineSpacing ?? defaultSettings.lineSpacing,
  autoScroll: settings.autoScroll ?? defaultSettings.autoScroll,
  syncOffset: settings.syncOffset ?? defaultSettings.syncOffset,
});

const getSettings = catchAsync(async (req, res) => {
  let settings = await Settings.findOne({ user: req.user._id });

  if (!settings) {
    settings = await Settings.create({ ...defaultSettings, user: req.user._id });
  }

  res.json(settings);
});

const updateSettings = catchAsync(async (req, res) => {
  const updates = {};
  Object.entries(req.body || {}).forEach(([key, value]) => {
    if (value !== undefined && key in defaultSettings) updates[key] = value;
  });

  let settings = await Settings.findOne({ user: req.user._id });
  if (!settings) settings = new Settings({ ...defaultSettings, user: req.user._id });

  Object.entries(updates).forEach(([key, value]) => {
    settings[key] = value;
  });

  const saved = await settings.save();
  res.json(normalizeSettings(saved));
});

module.exports = {
  getSettings,
  updateSettings,
};

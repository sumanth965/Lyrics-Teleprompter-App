const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    scrollSpeed: {
      type: Number,
      default: 1,
      min: 0.5,
      max: 3,
    },
    fontSize: {
      type: Number,
      default: 48,
      min: 20,
      max: 120,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "dark",
    },
    lineSpacing: {
      type: Number,
      default: 1.6,
      min: 1,
      max: 3,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);

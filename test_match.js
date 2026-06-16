const { preprocessLyrics } = require("./backend/live/lyricPreprocessor");
const { findBestLyricMatch } = require("./backend/live/fuzzyMatcher");
const { computeConfidence } = require("./backend/live/confidence");

const lyrics = [
  { time: 0, text: "जय हो जय हो शंकरा" },
  { time: 5, text: "आदिदेव शंकरा" },
  { time: 10, text: "तेरे जाप के बिना चले ये सांस किस तरह" }
];

const lyricMeta = preprocessLyrics(lyrics);
console.log("Lines:", lyricMeta.lines.length);

const transcript = "jay ho jay ho shankara"; // English transcript of Hindi
const match = findBestLyricMatch(transcript, lyricMeta, 0, 0.65);
console.log("Match:", match);

if (match) {
  const confidence = computeConfidence({ ...match, speechConfidence: 0.9, jumpPenalty: 0 });
  console.log("Confidence:", confidence);
}

const transcript2 = "जय हो जय हो शंकरा"; // Hindi transcript
const match2 = findBestLyricMatch(transcript2, lyricMeta, 0, 0.65);
console.log("Match 2:", match2);

if (match2) {
  const confidence2 = computeConfidence({ ...match2, speechConfidence: 0.9, jumpPenalty: 0 });
  console.log("Confidence 2:", confidence2);
}

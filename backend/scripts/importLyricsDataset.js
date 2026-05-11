const fs = require("fs");
const path = require("path");

const datasetDir = path.resolve(__dirname, "../data/datasets");
const datasetCsvPath = path.join(datasetDir, "LYRICS_DATASET.csv");
const datasetTxtPath = path.join(datasetDir, "lyrics_dataset.txt");
const outputPath = path.resolve(__dirname, "../data/songs.json");
const maxSongs = Number(process.env.MAX_IMPORT_SONGS || 250);

function parseCsv(content) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i += 1;
      row.push(field);
      if (row.some((item) => item !== "")) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function normalizeLyrics(rawLyrics) {
  if (!rawLyrics) return "";
  return rawLyrics
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function importDataset() {
  if (!fs.existsSync(datasetCsvPath)) {
    throw new Error(`CSV dataset not found at ${datasetCsvPath}`);
  }

  const content = fs.readFileSync(datasetCsvPath, "utf8");
  const rows = parseCsv(content);
  const [header, ...dataRows] = rows;

  const artistIndex = header.indexOf("Artist Name");
  const titleIndex = header.indexOf("Song Name");
  const lyricsIndex = header.indexOf("Lyrics");

  if (artistIndex === -1 || titleIndex === -1 || lyricsIndex === -1) {
    throw new Error("CSV is missing one of the required columns: Artist Name, Song Name, Lyrics");
  }

  const MIN_LYRICS_LENGTH = 50;
  const songs = [];
  for (const dataRow of dataRows) {
    if (songs.length >= maxSongs) break;
    const title = (dataRow[titleIndex] || "").trim();
    const artist = (dataRow[artistIndex] || "").trim();
    const lyrics = normalizeLyrics(dataRow[lyricsIndex] || "");
    if (!title || !artist || !lyrics) continue;
    if (lyrics.length < MIN_LYRICS_LENGTH) continue;
    songs.push({ title, artist, lyrics });
  }

  if (fs.existsSync(datasetTxtPath)) {
    const textLyrics = normalizeLyrics(fs.readFileSync(datasetTxtPath, "utf8"));
    if (textLyrics.length >= MIN_LYRICS_LENGTH) {
      songs.unshift({
        title: "Lyrics Dataset Text Sample",
        artist: "Imported Dataset",
        lyrics: textLyrics,
      });
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(songs, null, 2));
  console.log(`Imported ${songs.length} songs to ${outputPath}`);
}

try {
  importDataset();
} catch (error) {
  console.error("Failed to import dataset", error);
  process.exit(1);
}

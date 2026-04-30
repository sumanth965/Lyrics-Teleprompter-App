const fs = require("fs");
const path = require("path");

const datasetPath = path.resolve(__dirname, "../../LYRICS_DATASET.csv");
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
    .replace(/\r/g, "\n")
    .split(/\n|\s{2,}/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function importDataset() {
  if (!fs.existsSync(datasetPath)) {
    throw new Error(`Dataset not found at ${datasetPath}`);
  }

  const content = fs.readFileSync(datasetPath, "utf8");
  const rows = parseCsv(content);
  const [header, ...dataRows] = rows;

  const artistIndex = header.indexOf("Artist Name");
  const titleIndex = header.indexOf("Song Name");
  const lyricsIndex = header.indexOf("Lyrics");

  if (artistIndex === -1 || titleIndex === -1 || lyricsIndex === -1) {
    throw new Error("CSV is missing one of the required columns: Artist Name, Song Name, Lyrics");
  }

  const songs = [];
  for (const dataRow of dataRows) {
    if (songs.length >= maxSongs) break;
    const title = (dataRow[titleIndex] || "").trim();
    const artist = (dataRow[artistIndex] || "").trim();
    const lyrics = normalizeLyrics(dataRow[lyricsIndex] || "");
    if (!title || !artist || !lyrics) continue;
    songs.push({ title, artist, lyrics });
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

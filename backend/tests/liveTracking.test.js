const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeText, preprocessLyrics } = require('../live/lyricPreprocessor');
const { findBestLyricMatch } = require('../live/fuzzyMatcher');
const { computeConfidence } = require('../live/confidence');
const LiveSessionManager = require('../live/sessionManager');
const { MockAlignmentEngine } = require('../live/alignmentEngine');

test('normalizes multilingual lyrics while removing punctuation and stage directions', () => {
  assert.equal(normalizeText('[Verse] Hello, mundo! Ça va?'), 'hello mundo ça va');
});

test('preprocesses lines and maps words back to lyric lines', () => {
  const meta = preprocessLyrics([{ text: 'First line' }, { text: 'Second bright line' }]);
  assert.equal(meta.lines.length, 2);
  assert.deepEqual(meta.tokenToLine[2], { lineIndex: 1, wordIndex: 0 });
  assert.equal(meta.searchableWindows[0].text, 'first line second bright line');
});

test('fuzzy matcher recovers nearby lyric line and word', () => {
  const meta = preprocessLyrics([{ text: 'Amazing grace' }, { text: 'How sweet the sound' }]);
  const match = findBestLyricMatch('sweet sound', meta, 0, 0.65);
  assert.equal(match.lineIndex, 1);
  assert.ok(match.score > 0.35);
});

test('confidence score combines speech, fuzzy, overlap, and continuity', () => {
  const confidence = computeConfidence({ speechConfidence: 0.8, fuzzyScore: 0.7, wordOverlap: 0.9, continuity: 1 });
  assert.ok(confidence > 0.8);
});

test('session manager emits structured position updates', () => {
  const manager = new LiveSessionManager(new MockAlignmentEngine());
  const session = manager.start({ songId: 'song-1', lyrics: [{ text: 'one more time' }] });
  const update = manager.processAudioChunk(session.sessionId, { transcript: 'one more', timestamp: Date.now() });
  assert.equal(update.lineIndex, 0);
  assert.equal(update.trackingStatus, 'tracking');
  manager.end(session.sessionId);
});

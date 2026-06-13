import test from "node:test";
import assert from "node:assert/strict";
import { applyLyricOffset, parseLyrics, validateLrc } from "../utils/lyricParser.js";

test("parseLyrics parses timestamps and markers", () => {
  const parsed = parseLyrics("[00:01.50] Hello\n[Chorus]\n[00:03.00] World");
  assert.equal(parsed[0].time, 1.5);
  assert.equal(parsed[1].isMarker, true);
  assert.equal(parsed[2].text, "World");
});

test("validateLrc reports invalid and out-of-order lines", () => {
  const result = validateLrc("[00:05.00] Later\n[00:04.00] Earlier\nNo stamp");
  assert.equal(result.valid, false);
  assert.equal(result.issues.length, 2);
});

test("applyLyricOffset shifts timestamps without going below zero", () => {
  assert.equal(applyLyricOffset("[00:01.00] Test", -2), "[00:00.00] Test");
});

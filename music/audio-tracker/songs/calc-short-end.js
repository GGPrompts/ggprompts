#!/usr/bin/env node
/**
 * calc-short-end.js
 *
 * Calculates the optimal shortEndSeq index for songs over 90 seconds.
 * For each qualifying song, finds the sequence index where cumulative
 * duration is closest to 90 seconds.
 *
 * Usage: node music/audio-tracker/songs/calc-short-end.js
 */

const fs = require('fs');
const path = require('path');

const SONGS_DIR = __dirname;
const TARGET_SECONDS = 90;

const files = fs.readdirSync(SONGS_DIR)
  .filter(f => f.endsWith('.json') && f !== 'index.json')
  .sort();

const report = {};

for (const file of files) {
  const filePath = path.join(SONGS_DIR, file);
  let song;
  try {
    song = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    continue;
  }

  const seq = song.sequence || song.seq;
  if (!seq || seq.length === 0) continue;

  const bpm = song.bpm;
  const rpb = song.rpb || song.rowsPerBeat || 4;
  if (!bpm) continue;

  const secondsPerRow = 60 / (bpm * rpb);
  const patterns = song.patterns;
  if (!patterns || patterns.length === 0) continue;

  // Calculate cumulative duration at each seq index
  let totalDuration = 0;
  const cumulativeDurations = [];

  for (let i = 0; i < seq.length; i++) {
    const patIdx = seq[i][0]; // use channel 0's pattern index
    const pat = patterns[patIdx];
    if (!pat) continue;
    const patLen = pat.len || pat.length || 0;
    const seqDuration = patLen * secondsPerRow;
    totalDuration += seqDuration;
    cumulativeDurations.push(totalDuration);
  }

  // Only include songs over 90 seconds
  if (totalDuration <= TARGET_SECONDS) continue;

  // Find seq index where cumulative duration is closest to 90s
  // shortEndSeq is the index at which playback should stop (exclusive),
  // so we want the last seq entry whose cumulative end is <= ~90s
  let bestIdx = 0;
  let bestDiff = Infinity;

  for (let i = 0; i < cumulativeDurations.length; i++) {
    const diff = Math.abs(cumulativeDurations[i] - TARGET_SECONDS);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }

  // shortEndSeq = bestIdx + 1 (the seq length for short playback)
  const shortEndSeq = bestIdx + 1;
  const shortDuration = Math.round(cumulativeDurations[bestIdx] * 10) / 10;

  report[file] = {
    currentDuration: Math.round(totalDuration * 10) / 10,
    shortEndSeq,
    shortDuration
  };
}

console.log(JSON.stringify(report, null, 2));

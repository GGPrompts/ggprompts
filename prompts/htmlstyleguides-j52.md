# Write script to calculate optimal shortEndSeq for long songs

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-j52` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | ready |
| **Created** | 2026-02-22 21:55:13 |
| **Updated** | 2026-02-22 22:10:03 |

## Description

Create a Node.js script (can be temporary/one-off) that reads all song JSON files, calculates duration, and for songs over 90 seconds, finds the optimal shortEndSeq value. Algorithm: 1) Calculate seconds per sequence entry (sum pattern lengths for that seq row × secondsPerRow), 2) Find the seq index where cumulative duration is closest to ~90 seconds, 3) Prefer landing on a section boundary where patterns change, 4) Output a JSON map of {filename: suggestedShortEndSeq} with current and proposed durations. Songs to process: all 57 songs over 90 seconds identified in the epic. The output will be used to bulk-update song files.

## Worker Prompt & Notes

## prepared.prompt

## Context
57 songs are over 90 seconds. We need to find the optimal sequence index where each should end for short playback (~90s target). This data will be used to add shortEndSeq markers to song JSON files.

## Task
Write a Node.js script (music/audio-tracker/songs/calc-short-end.js) that:
1. Reads all song JSON files from the songs directory
2. For each song, calculates cumulative duration per sequence entry: secondsPerRow = 60 / (bpm * (rpb || 4)), then sum pattern lengths for each seq row
3. For songs over 90 seconds total, finds the seq index where cumulative duration is closest to 90 seconds
4. Outputs a JSON report to stdout: { "filename.json": { "currentDuration": N, "shortEndSeq": N, "shortDuration": N }, ... }
5. Only includes songs that are over 90 seconds

Run with: node music/audio-tracker/songs/calc-short-end.js

## Key Files
- music/audio-tracker/songs/*.json (song format: bpm, rpb, patterns[].len, seq[][])
- Song duration = sum of pattern lengths across all seq entries × (60 / (bpm × rpb))

## When Done
Close issue: bd close htmlstyleguides-j52 --reason "Script created and tested"

# Add shortEndSeq support to visualizer engine analysis

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-aa6` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | ready |
| **Created** | 2026-02-22 21:55:03 |
| **Updated** | 2026-02-22 22:10:05 |

## Description

When a song has a 'shortEndSeq' field, the visualizer engine should trim its pre-analysis to only include rows up to that sequence index. This means: 1) timeline[] array stops at the shortEndSeq boundary, 2) energy[] array is similarly trimmed, 3) totalRows and totalDuration reflect the short version, 4) sectionChanges[] only includes changes before shortEndSeq. Key file: music/visualizer/engine.js (analyzeSong function, lines ~180-343). The analysis.loopEnd should be set to shortEndSeq when present. All 54 music videos automatically benefit since they read analysis.totalRows and analysis.timeline.length — no per-video changes needed. The visualizer always plays the short version (videos don't need full-length playback).

## Worker Prompt & Notes

## prepared.prompt

## Context
Music videos should play the short version of songs when shortEndSeq is set. The visualizer engine computes pre-analysis (timeline, energy, sectionChanges, totalRows, totalDuration) — if we trim these at shortEndSeq, all 54 videos automatically get shorter without any per-video changes.

## Task
Update the analyzeSong function in music/visualizer/engine.js:
1. After computing loopEnd (line ~326), check if song.shortEndSeq exists and is less than loopEnd
2. If so, use shortEndSeq as the effective loopEnd for analysis computation
3. This means timeline[], energy[], sectionChanges[] only include rows up to shortEndSeq
4. totalRows and totalDuration reflect the short version
5. Set analysis.loopEnd to shortEndSeq

Also update the cursor calculation (line ~374+) so playback stops when reaching the end of the short version. The visualizer should call ChipPlayer.setShortMode(true) when loading a song with shortEndSeq.

## Key Files
- music/visualizer/engine.js (analyzeSong ~line 180-343, cursor calc ~line 374+)

## When Done
Close issue: bd close htmlstyleguides-aa6 --reason "Visualizer engine trims analysis at shortEndSeq"

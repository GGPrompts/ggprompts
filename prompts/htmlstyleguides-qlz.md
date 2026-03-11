# Add shortEndSeq support to ChipPlayer playback engine

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-qlz` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | ready |
| **Created** | 2026-02-22 21:54:57 |
| **Updated** | 2026-02-22 22:09:35 |

## Description

Add support for a new song JSON field 'shortEndSeq' (integer, optional). When present and the consumer requests short mode, ChipPlayer should stop playback (not loop) when seqIndex reaches shortEndSeq. The playback engine needs a way for consumers to opt into short mode — suggest adding a 'shortMode' option to play() or a setShortMode() method. When shortMode is off (default), ignore shortEndSeq and play/loop the full song as today. When shortMode is on and shortEndSeq exists, stop at that point. Key file: music/audio-tracker/playback-engine.js (advanceWithLoop function around line 310-324). Must not break existing behavior — all current consumers should work unchanged.

## Worker Prompt & Notes

## prepared.prompt

## Context
Adding shortEndSeq support so music videos and Rhythm Hero can play shorter versions of long songs while the tracker/jukebox plays the full version.

## Task
Update ChipPlayer in music/audio-tracker/playback-engine.js to support shortEndSeq:
1. Add a module-level var shortMode = false
2. Add public method setShortMode(enabled) to toggle it
3. In advanceWithLoop() (line ~310), when shortMode is true AND song.shortEndSeq exists: if seqIndex reaches song.shortEndSeq, stop playback (call stop() or set playing=false) instead of looping
4. When shortMode is false (default), behavior is unchanged — loops normally using loopEndSeq
5. Expose shortMode state via a getter if needed

The key change is in advanceWithLoop():
```js
if (seqIndex >= loopEnd) {
  if (shortMode && song.shortEndSeq && seqIndex >= song.shortEndSeq) {
    // Stop instead of loop
    stop();
    return;
  }
  seqIndex = loopStart;
}
```

Actually, check shortEndSeq BEFORE the normal loop check — shortEndSeq may be less than loopEndSeq.

## Key Files
- music/audio-tracker/playback-engine.js (advanceWithLoop at line ~310, public API at line ~326)

## When Done
Close issue: bd close htmlstyleguides-qlz --reason "ChipPlayer now supports shortEndSeq with setShortMode"

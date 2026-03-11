# Sound Effect Generator tool

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-t3d` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | ready |
| **Created** | 2026-02-23 02:54:32 |
| **Updated** | 2026-02-23 03:07:40 |

## Description

sfxr/jsfxr-style procedural sound effect generator in tools/sfx-generator/. Parameter sliders for laser, explosion, powerup, coin, jump, etc. Real-time audio preview via Web Audio API. Export as WAV and as JSON instrument definitions compatible with the audio tracker synth format. Complements chiptune music section and games.

## Worker Prompt & Notes

## prepared.prompt

## Context
The project has a chiptune music section with a tracker and synth engine (music/audio-tracker/synth.js) supporting sine, square, sawtooth, triangle, pulse25, pulse12, noise, fm, pluck waves. This tool creates a standalone SFX generator that complements both the music section and the browser games.

## Task
Build an sfxr-style sound effect generator in tools/sfx-generator/. Pick a fitting aesthetic (suggest: dark synth/electronic theme with neon accents). Features needed:

- Preset categories: laser, explosion, powerup, coin, jump, hit, blip, random
- Parameter sliders grouped by section:
  - Waveform: sine, square, sawtooth, triangle, noise, pulse
  - Envelope: attack, sustain, decay, release
  - Frequency: start, min, slide, delta slide
  - Vibrato: depth, speed
  - Arpeggiation: multiplier, speed
  - Filters: lowpass freq/resonance, highpass freq
  - Phaser: offset, sweep
  - Volume, compression
- Real-time preview via Web Audio API (play on any param change with debounce)
- Randomize button (full random), Mutate button (small variations from current)
- Export: WAV file download, JSON param export, copy as audio tracker instrument JSON (compatible with synth.js format)
- localStorage autosave of current state
- Undo/redo for parameter changes
- Keyboard shortcuts + help overlay
- Responsive @media (max-width: 768px)

## Key Files
- tools/sfx-generator/index.html — main UI (inline CSS, theme)
- tools/sfx-generator/sfx-engine.js — Web Audio synthesis, WAV encoding, param presets
- tools/index.html — add Rococo card for this tool
- music/audio-tracker/synth.js — reference for wave types and instrument JSON format

## Architecture Notes
- Engine (window.SFXEngine) should be DOM-free
- WAV encoding is straightforward: write PCM samples to a DataView with RIFF header
- For tracker-compatible export, map sfx params to the synth.js instrument format (wave, a, d, s, r, vol, filterType, filterFreq, etc.)
- Presets can be hardcoded param objects (like sfxr's classic sounds)

## When Done
- Add card to tools/index.html hub page
- Close issue: bd close htmlstyleguides-t3d --reason "SFX generator complete"

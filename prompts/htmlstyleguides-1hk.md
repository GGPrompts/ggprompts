# Integrate background music from audio tracker

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-1hk` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:02:33 |
| **Updated** | 2026-02-26 03:30:34 |

## Description

Add BGM to Arcane Bastion using existing chiptune songs from the audio tracker. Use calmer tracks during build phase and switch to intense battle tracks (Neon Velocity, Megabyte Menace, Hacking the Mainframe) during combat. Boss waves should trigger boss-specific tracks like Megabyte Menace. Include volume controls and mute toggle.

## Worker Prompt & Notes

## prepared.prompt

## Context
Arcane Bastion has no background music — only synth SFX. The audio tracker's `ChipPlayer` provides a standalone playback engine perfect for embedding. A custom theme (arcane-bastion.json) and several existing battle tracks are available. This issue is blocked until the custom theme is composed (htmlstyleguides-t3q).

## Task
Integrate the ChipPlayer as BGM into the tower defense game:

1. **Load ChipPlayer** — Add `<script src="../../music/audio-tracker/synth.js"></script>` and `<script src="../../music/audio-tracker/playback-engine.js"></script>` to `index.html` before game scripts.

2. **BGM Manager** — Add a BGM management section to the Audio IIFE in engine.js:
   - `Audio.initBGM()` — Initialize ChipPlayer, load song list
   - `Audio.playBGM(songFile)` — Fetch and play a song JSON from `../../music/audio-tracker/songs/`
   - `Audio.stopBGM()` / `Audio.pauseBGM()` / `Audio.resumeBGM()`
   - `Audio.setBGMVolume(vol)` — Default 0.3 (lower than SFX)
   - Track list: `arcane-bastion.json` (main theme), `boss-battle.json` (boss waves), `neon-velocity.json` (late waves)

3. **State Integration** — Wire BGM to game states:
   - Menu: No music (or very quiet ambient)
   - Build phase: Play arcane-bastion.json (calmer section or lower volume)
   - Combat: Play arcane-bastion.json at full energy
   - Boss waves (5, 10, 15, 20): Switch to boss-battle.json
   - Pause: Pause BGM
   - Victory/Game Over: Stop BGM, play victory/defeat jingle

4. **UI Controls** — Add a music toggle button (🎵) next to the existing volume/sound controls in the HUD top bar. Include a volume slider or simple on/off toggle.

## Key Files
- `games/tower-defense/index.html` — Add script tags, music toggle button in HUD
- `games/tower-defense/engine.js` — Audio IIFE (lines 79-209), state machine transitions
- `music/audio-tracker/playback-engine.js` — ChipPlayer API: init(), load(), play(), stop(), pause(), resume(), setVolume()
- `music/audio-tracker/synth.js` — Required dependency for ChipPlayer

## When Done
Close issue: bd close htmlstyleguides-1hk --reason="Integrated ChipPlayer BGM with state-based track switching"

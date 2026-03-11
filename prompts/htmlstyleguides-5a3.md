# Integrate audio tracker playback into survivors engine

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-5a3` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | — |
| **Created** | 2026-02-16 18:57:48 |
| **Updated** | 2026-02-16 19:14:27 |

## Description

Add the ability for the survivors game to load and play chiptune tracker JSON songs as background music during gameplay.

The survivors engine.js Audio module currently only has synthesized SFX (note, noise, weaponSound). It needs a music playback system that can:
- Load a tracker JSON song file
- Play it through the music gain bus (from the volume fix)
- Loop the song using loopStartSeq/loopEndSeq markers
- Start/stop music on game start/end
- Each theme HTML file specifies which song to load via THEME config

## Worker Prompt & Notes

## Retro
- What worked: Clean separation via initExternal() on ChipPlayer let us share the AudioContext and route through musicGain without modifying ChipPlayer's core playback logic. Adding loopStartSeq/loopEndSeq support was straightforward.
- What was unclear: Nothing major -- the task was well-scoped with clear file references.

# Fix survivors SFX volume balance vs audio tracker tracks

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-0wr` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | — |
| **Created** | 2026-02-16 18:57:22 |
| **Updated** | 2026-02-16 19:04:17 |

## Description

The sound effects in the survivors game are 3-4x quieter than the audio tracker song playback. When background music tracks are added to survivors, the SFX will be drowned out.

Current state in engine.js:
- masterGain: 0.4
- SFX note volumes: 0.08-0.15
- SFX noise volumes: 0.1
- Ambient gain: 0.06

Need to either boost SFX volumes or add a separate music gain node that can be mixed lower relative to SFX. A dedicated music bus at ~0.25x the SFX level would let background tracks play without overwhelming gameplay sounds.

## Worker Prompt & Notes

## Retro
- What worked: Clear task spec made implementation straightforward. Adding a parallel gain bus without touching existing SFX routing was clean.
- What was unclear: Nothing significant - the task was well-defined.

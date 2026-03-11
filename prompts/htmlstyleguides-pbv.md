# Survivors: Rhythm-driven gameplay — sync spawning and visuals to JSON music tracks

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-pbv` |
| **Status** | closed |
| **Priority** | 4 |
| **Labels** | — |
| **Created** | 2026-02-16 16:23:52 |
| **Updated** | 2026-02-24 00:07:04 |

## Description

Design epic for integrating the JSON music language (audio/ folder) with the survivors game engine to create rhythm-synced gameplay.

Concept: Use the structured beat/tempo/intensity data from JSON music tracks to drive game systems, creating a unique visual-rhythmic experience (not a rhythm game — no button presses to the beat, purely aesthetic/mechanical sync).

## Spawn System Integration
- Enemy spawn waves pulse with the beat (spawn bursts on downbeats)
- Spawn intensity scales with musical intensity/dynamics (quiet sections = breather, chorus = dense waves)
- Boss spawns timed to dramatic musical moments (drops, key changes)
- Enemy movement speed could subtly sync to BPM
- Different enemy types mapped to different instruments/channels

## Visual/Canvas Integration
- Background effects react to music (pulse, color shift, particle intensity)
- Screen shake / zoom on heavy beats
- Color palette shifts between song sections (verse vs chorus)
- Particle effects synced to percussion hits
- Camera or viewport subtle breathing with the rhythm
- Environment elements (stars, debris, fog) pulsing with bass

## Technical Approach
- Parse JSON music format for beat timestamps, BPM, section markers, intensity curves
- Create a MusicDirector system that the game loop queries each frame
- Expose current beat phase, section type, intensity level to all game systems
- Tracks could define difficulty curves implicitly through their structure
- Each theme/world could have its own signature track

## Inspiration
- Crypt of the Necrodancer (rhythm + roguelike) but without requiring player input on beat
- Geometry Wars (visual intensity matching gameplay)
- Rez (synesthetic game-music fusion)
- Tetris Effect (visual/audio atmosphere enhancement)

References: audio/ folder JSON music language research, existing survivors engine.js spawn system

## Worker Prompt & Notes

## prepared.prompt

This is an EPIC - not ready for direct execution. Needs breakdown into subtasks first.

No JSON music files found in the audio/ folder yet. Before this epic can proceed:
1. Define the JSON music format spec
2. Create sample music tracks
3. Build MusicDirector system
4. Integrate with spawn system
5. Add visual beat sync

Run /gg-brainstorm to break this into concrete subtasks when ready.

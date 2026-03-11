# Refactor fencing video to use StickFight.attack() and contact-driven sparks

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-3qh` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | ready |
| **Created** | 2026-02-22 02:16:29 |
| **Updated** | 2026-02-22 02:39:29 |

## Description

Refactor fencing-match-in-a-thunderstorm-video.html to use true StickFight.attack() exchanges instead of pose-only pantomime. Replace fixed-midpoint beat-timed sparks with contact-driven impact FX from the engine's hit resolution. Use the new choreography/camera systems from the battle direction engine upgrade.

## Worker Prompt & Notes

## prepared.prompt

## Context
The fencing video currently uses pure pose pantomime — setPose/setTarget with no StickFight.attack() calls. Sparks spawn at a fixed midpoint between fencers on every beat, not from actual contact. After engine upgrades add choreography and contact events, this video should be the reference implementation.

## Task
Refactor `fencing-match-in-a-thunderstorm-video.html` to use the engine's combat and choreography systems.

### Requirements
1. Replace pose-only fencing sequences with `StickFight.choreograph()` exchanges that use real `attack()` calls with proper hit resolution
2. Replace fixed-midpoint spark spawning with a `StickFight.onContact()` callback that spawns sparks at the actual contact point from the hit event
3. Use `StickFight.hitStop()` on clashes for 2-3 frames of freeze
4. Use `StickFight.screenShake()` on heavy hits
5. Keep the existing visual aesthetic (lightning, rain, atmosphere) — only change the combat choreography and FX triggers
6. Maintain section-based scene changes (the mapSection structure stays)

### Key sections to refactor
- Duel exchanges (currently manual setPose alternations)
- Spark/flash spawning (currently on beat at midpoint)
- The killing blow / finale sequence

## Key Files
- `music/visualizer/fencing-match-in-a-thunderstorm-video.html` (889 lines)
- `music/visualizer/stick-fight-engine.js` (engine API reference)

## When Done
Close issue: `bd close 3qh --reason "Refactored fencing video to use attack() exchanges and contact-driven sparks"`

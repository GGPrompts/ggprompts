# Add new enemy types

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-hfy` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:03:11 |
| **Updated** | 2026-02-26 03:23:03 |

## Description

Add 4-5 new enemy types: Burrower (tunnels underground, untargetable for segments of path), Swarm (20+ tiny units with very low HP), Berserker (speeds up as HP decreases), Mirror Knight (reflects a percentage of damage back to towers), Phantom Carriage (carries 3 enemies inside, releases them on death). Introduce at appropriate wave thresholds.

## Worker Prompt & Notes

## prepared.prompt

## Context
Arcane Bastion has 16 enemy types + 4 bosses. Adding new enemy types with unique behaviors increases variety and replayability. The enemy system in enemies.js is well-structured with a TYPES object, behavior dispatch in updateBehavior(), and per-type draw functions.

## Task
Add 4-5 new enemy types to `games/tower-defense/enemies.js`:

1. **Burrower** (wave 12+): Tunnels underground for 2s segments (untargetable while burrowed, pops up between segments). Behavior: "burrow". Draw with dirt particles when emerging.
2. **Swarm** (wave 8+): Very low HP (10), very fast (130 speed), spawns in groups of 15-20. Small size (0.3). Gold: 2 each. Behavior: "walk".
3. **Berserker** (wave 14+): HP 180, speeds up as HP decreases (up to 2x speed at 10% HP). Red glow intensifies with rage. Behavior: "enrage". Gold: 28.
4. **Mirror Knight** (wave 16+): HP 140, armor 3, reflects 15% damage back (reduces tower HP? or just visual). Shiny metallic draw with mirror shield. Behavior: "reflect". Gold: 32.
5. **Phantom Carriage** (wave 18+): HP 250, speed 30, carries 3 random basic enemies inside. On death, releases them at current position. Behavior: "carrier". Gold: 15 (passengers give their own gold). Size: 0.9.

For each type:
- Add to TYPES object with full stats
- Add a drawXxx() function matching existing art style (geometric shapes, glows, accents)
- Add behavior handling in updateBehavior()
- Add to waveUnlocks at appropriate wave threshold
- Add to getWave() composition logic

## Key Files
- `games/tower-defense/enemies.js` — TYPES object (~line 870), drawEnemy functions (~lines 48-800), updateBehavior() (~line 1231), waveUnlocks (~line 1415), getWave() (~line 1432)

## When Done
Close issue: bd close htmlstyleguides-hfy --reason="Added 4-5 new enemy types with unique behaviors"

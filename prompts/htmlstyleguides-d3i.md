# Add more synthesized sound effects

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-d3i` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:02:43 |
| **Updated** | 2026-02-26 03:24:48 |

## Description

Expand the procedural audio SFX in Arcane Bastion. Add: ambient portal hum (looping), synergy activation chime, critical hit impact, shield break shatter, enemy ability cast sounds (boss fire nova, hydra summon, lich heal, dragon phase), nexus low-health alarm (pulsing warning when <25 HP), and freeze/root/stun application sounds.

## Worker Prompt & Notes

## prepared.prompt

## Context
Arcane Bastion has 11 synthesized SFX via Web Audio API in the Audio IIFE (engine.js lines 79-209). The sounds are functional but sparse — many game events lack audio feedback. Adding more SFX will make gameplay feel more polished and responsive.

## Task
Expand the Audio IIFE in `games/tower-defense/engine.js` with these new synthesized sounds:

1. **portalHum()** — Looping ambient hum for spawn portals (low sine drone ~80Hz + slow LFO, very quiet). Start on wave start, stop on wave complete.
2. **synergyActivate()** — Sparkly chime when a synergy bonus triggers (ascending arpeggiated sines 800→1200→1600Hz, short, bright)
3. **criticalHit()** — Punchy impact for critical/high damage (short noise burst + low square wave hit, ~150Hz, 80ms)
4. **shieldBreak()** — Glass shatter when enemy shield HP depletes (noise burst with highpass filter sweep 2000→8000Hz, 200ms)
5. **bossAbility()** — Ominous whoosh when boss uses special ability (filtered sawtooth sweep 200→100Hz + noise, 400ms)
6. **nexusAlarm()** — Pulsing warning when nexus HP < 25 (alternating square tones 600/400Hz, 150ms each, looping). Start/stop based on HP threshold.
7. **freezeHit()** — Crystalline freeze sound (high sine 2000Hz with fast vibrato, 150ms)
8. **rootHit()** — Earthy thud for root/stun (triangle wave 120Hz + noise, short)

Wire each sound to its trigger point:
- portalHum: wave start/complete in engine state transitions
- synergyActivate: when synergy bonus applied in towers.js (add Audio.synergyActivate() call)
- criticalHit: when damage exceeds threshold in enemy applyDamage
- shieldBreak: when shield HP reaches 0 in enemies.js
- bossAbility: in executeBossAbility() in enemies.js
- nexusAlarm: check in game loop when nexus HP crosses 25% threshold
- freezeHit/rootHit: in applyStatus() for freeze/root/stun types

## Key Files
- `games/tower-defense/engine.js` — Audio IIFE (lines 79-209), state transitions, game loop
- `games/tower-defense/enemies.js` — applyDamage(), applyStatus(), executeBossAbility()
- `games/tower-defense/towers.js` — synergy detection in checkSynergies()

## When Done
Close issue: bd close htmlstyleguides-d3i --reason="Added 8 new synthesized SFX with trigger wiring"

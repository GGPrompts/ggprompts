# Add tower idle and attack animations

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-33l` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:03:27 |
| **Updated** | 2026-02-26 03:22:50 |

## Description

Enhance tower visuals with: idle animations (gentle bob, glow pulse, element-specific ambient effects like flickering flames or orbiting ice shards), attack wind-up animations (brief charge-up before firing), and upgrade transformation effects (particle burst + brief glow when upgrading). Each element should have distinct visual character in its animations.

## Worker Prompt & Notes

## prepared.prompt

## Context
Tower visuals in Arcane Bastion are static — they draw the same frame regardless of state. Adding idle animations, attack wind-ups, and upgrade effects will make towers feel alive and give better visual feedback during gameplay.

## Task
Enhance tower rendering in `games/tower-defense/towers.js` with animations:

### Idle Animations (all towers)
Each tower type's `drawTower(ctx, x, y, size, tier, time)` function already receives a `time` parameter. Add element-specific idle effects:
- **Fire**: Flickering flame particles rising from top (use sin(time) for flicker)
- **Ice**: Slowly orbiting ice crystal shards (3 small diamonds rotating)
- **Lightning**: Random small arcs/sparks between tower points (every ~2s)
- **Earth**: Subtle ground vibration (tiny y-offset oscillation)
- **Arcane**: Rotating mystical rune circle at base (fading symbols)
- **Nature**: Gentle leaf particles drifting upward
- **Shadow**: Dark wisps curling around tower (semi-transparent)
- **Light**: Soft pulsing golden aura (radius oscillates)

### Attack Flash
When a tower fires (track via `lastAttackTime` on tower object), show a brief 150ms brightening/scale pulse. In the tower draw loop in engine.js (~line 1258), check `time - tw.lastAttackTime < 0.15` and apply a glow or slight scale increase.

### Upgrade Transformation
When a tower is upgraded, trigger a particle burst effect at the tower position. Add an `Audio.upgrade()` call if not already wired. Use `ArcaneFX.spawnParticles()` with the tower's element palette.

## Key Files
- `games/tower-defense/towers.js` — drawTower functions per type (lines 100-800), tower definitions
- `games/tower-defense/engine.js` — tower render loop (~line 1258), upgrade handler (~line 503)
- `games/tower-defense/effects.js` — spawnParticles(), element palettes

## When Done
Close issue: bd close htmlstyleguides-33l --reason="Added idle animations, attack flash, and upgrade effects to all 8 tower types"

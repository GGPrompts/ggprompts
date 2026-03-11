# Implement class-specific signature abilities

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-bga` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | — |
| **Created** | 2026-02-16 17:37:11 |
| **Updated** | 2026-02-16 18:23:22 |

## Description

Each class gets one signature active ability (separate from weapons, on its own cooldown/resource).

GUNNER — Overclock: 5s window of 2x attack speed + all projectiles pierce. 45s cooldown.
DARK KNIGHT — Raise Dead: Summon 3-5 skeleton minions that attack nearby enemies for 10s. 60s cooldown.
RANGER — Trap Field: Place 5 bear traps in a ring around the player. Enemies that walk over them take damage + are rooted 2s. 40s cooldown.
WARLOCK — Gravity Well: Create a vortex at cursor position that pulls all enemies toward center and deals DoT for 5s. 50s cooldown.

Implementation:
1. Add classAbility to player state with cooldown tracking
2. Activate via dedicated key (Space? Q? or auto when ready?)
3. Render ability icon + cooldown indicator on HUD
4. Each ability needs: activation logic, visual effects, sound effects
5. Ability power scales with level/stats (warlock scales with ability power, gunner with attack speed, etc.)

Files: engine.js (new ability system, HUD, key binding), all 4 theme HTMLs (ability config in THEME)

## Worker Prompt & Notes

## Retro
- What worked: Reading the full engine.js before editing gave clear understanding of patterns (pools, effects, weapon handlers, class skills). Following existing patterns for audio, particles, active effects, and HUD made integration smooth.
- What was unclear: Blood Ritual healing needed rethinking since area effects damage enemies asynchronously through the game loop, not synchronously in the activation function. Settled on per-explosion estimation.

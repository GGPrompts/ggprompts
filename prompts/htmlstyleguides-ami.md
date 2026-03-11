# Rail shooter game (House of the Dead style)

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-ami` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 04:17:56 |
| **Updated** | 2026-02-26 04:28:05 |

## Description

On-rails light gun shooter inspired by House of the Dead / Time Crisis arcade games. Fixed camera travels through scenes (mansion, lab, streets, etc.) with enemies popping out from behind cover, doorways, and windows. Player aims and clicks to shoot. Features: mouse/touch aiming with crosshair cursor, enemies with varied pop-out patterns and attack timers, innocent civilians you must NOT shoot (penalty), weapon reloading mechanic (click off-screen or press R), multiple levels/scenes with boss encounters, combo scoring system, health bar with hit feedback, ammo counter. Canvas-based rendering with pre-drawn scene backgrounds and sprite-style enemies. Retro arcade cabinet aesthetic with CRT scanline overlay. Goes in games/ section.

## Worker Prompt & Notes

## prepared.prompt

## Context
The games section has 14+ browser games built with vanilla HTML/CSS/JS, no build step, deployed on GitHub Pages. This adds a House of the Dead-style on-rails light gun shooter.

## Task
Create a rail shooter game in `games/rail-shooter/`.

Build an on-rails light gun shooter where the camera travels through scenes with enemies popping out that the player must quickly shoot. Canvas-based rendering.

### Core Mechanics
- Mouse/touch aiming with crosshair cursor (hide default cursor, draw custom crosshair)
- Click to shoot at enemies popping out from behind cover, doorways, windows
- Enemies have pop-out animations and attack timers — shoot them before they shoot you
- Innocent civilians occasionally run across — shooting them costs health/points (penalty)
- Reload mechanic: limited magazine (6-8 shots), click off-screen or press R to reload
- Health bar: enemies deal damage if not shot in time, civilians cost health too

### Scene System
- Multiple scenes/levels that auto-scroll (mansion hallways, lab corridors, city streets, graveyard)
- Canvas-drawn backgrounds with layered depth (foreground cover objects, mid-ground, background)
- Enemies spawn at predefined points with pop-out/peek animations
- Boss encounters at end of each level (large enemy, multiple hit zones, attack patterns)

### Visual Style
- Retro arcade cabinet aesthetic with CRT scanline overlay
- Dark, moody color palettes per scene (gothic mansion = purples/grays, lab = greens/whites)
- Hit feedback: blood splatter effects, enemy knockback, screen flash on player damage
- Muzzle flash on shoot, shell casings particle effect
- HUD styled like an arcade cabinet: health, ammo, score, combo counter, level name

### Scoring
- Points per enemy killed, bonus for headshots / quick kills
- Combo multiplier for consecutive hits without missing
- Penalty for shooting civilians
- High score saved to localStorage
- End-of-level results screen with accuracy %, enemies killed, rating (S/A/B/C/D)

### Files
- `games/rail-shooter/index.html` — Main game file, self-contained or with a separate engine.js if needed
- Add a card to `games/index.html` using the existing card pattern

Use `game-card-accent-red` for the card accent and `badge-velvet` for the primary badge.

## Key Files
- games/rail-shooter/index.html (new)
- games/index.html (add card)

## When Done
Close issue: bd close htmlstyleguides-ami --reason "Rail shooter game created"

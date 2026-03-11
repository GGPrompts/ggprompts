# Heli Attack browser game

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-fi7` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 04:16:27 |
| **Updated** | 2026-02-26 04:26:43 |

## Description

Side-scrolling shooter inspired by the classic Miniclip Heli Attack series. Player controls a soldier on the ground, shooting down helicopters and enemies with an escalating arsenal of weapons (machine gun, rockets, lasers, bouncing grenades, etc.). Features: weapon pickups/cycling, enemy helicopters with varied attack patterns, platforming elements, score tracking, increasing difficulty waves. Canvas-based rendering, retro arcade aesthetic. Goes in games/ section.

## Worker Prompt & Notes

## prepared.prompt

## Context
The games section has 14+ browser games built with vanilla HTML/CSS/JS, no build step, deployed on GitHub Pages. This adds a Heli Attack-style side-scrolling shooter.

## Task
Create a Heli Attack browser game in `games/heli-attack/`.

Build a side-scrolling shooter where the player controls a soldier on the ground shooting down helicopters and enemies with an escalating arsenal. Canvas-based rendering.

### Core Mechanics
- Player soldier: move left/right (A/D or arrows), jump (W or space), aim with mouse, click to shoot
- Enemy helicopters fly in from sides with varied patterns (hovering, strafing, diving)
- Ground enemies that shoot back
- Weapon system: start with machine gun, pick up upgrades (shotgun, rockets, laser, bouncing grenades, railgun)
- Weapon cycling with number keys or scroll wheel
- Ammo management (machine gun infinite, others limited)
- Health bar, score counter, wave/level system

### Visual Style
- Retro pixel-art inspired aesthetic with a military/action theme
- Parallax scrolling background (sky, mountains, buildings)
- Particle effects for explosions, bullet trails, debris
- Screen shake on big explosions
- HUD: health, ammo, current weapon, score, wave number

### Game Flow
- Waves of increasing difficulty
- Weapon pickups drop from destroyed enemies
- Boss helicopters every 5 waves (larger, more health, special attacks)
- High score saved to localStorage

### Files
- `games/heli-attack/index.html` — Main game file, self-contained or with a separate engine.js if needed
- Add a card to `games/index.html` using the existing card pattern (accent color, badges, Play button)

Use `game-card-accent-green` for the card accent and `badge-neon-green` for the primary badge.

## Key Files
- games/heli-attack/index.html (new)
- games/index.html (add card)

## When Done
Close issue: bd close htmlstyleguides-fi7 --reason "Heli Attack game created"

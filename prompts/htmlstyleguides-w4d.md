# Refactor tavern brawl video to use pairwise combat beats

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-w4d` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | ready |
| **Created** | 2026-02-22 02:16:30 |
| **Updated** | 2026-02-22 02:39:29 |

## Description

Refactor tavern-brawl-crescendo-video.html to include pairwise combat beats via StickFight.attack() instead of mostly ambient chaos posing. Replace beat-driven impact stars with contact-driven FX. Patrons should have visible anticipation, impact, and recovery phases per exchange.

## Worker Prompt & Notes

## prepared.prompt

## Context
The tavern brawl video uses pose-only pantomime with beat-driven impact stars at fixed patron positions. No StickFight.attack() calls. The brawl should feel like actual fights breaking out — visible punches landing, people getting knocked back, chairs thrown with impact.

## Task
Refactor `tavern-brawl-crescendo-video.html` to include pairwise combat beats.

### Requirements
1. During brawl sections, pair up nearby patrons and run `StickFight.choreograph()` exchanges between them
2. Replace beat-driven `spawnImpactStar()` at fixed patron head positions with `StickFight.onContact()` callbacks that spawn impact FX at actual hit points
3. Add visible anticipation (wind-up poses), impact (hit-stop + contact FX), and recovery phases per exchange
4. Keep the waltz→brawl progression and the existing tavern atmosphere
5. Maintain the thrown objects and dust cloud systems (those are fine as ambient effects)
6. Not every patron needs to fight — some can cower, flee, or just get knocked around

### Key sections to refactor
- Brawl choreography (currently random pose assignments on beats)
- Impact FX spawning
- Patron pairing/targeting logic

## Key Files
- `music/visualizer/tavern-brawl-crescendo-video.html` (1030 lines)
- `music/visualizer/stick-fight-engine.js` (engine API reference)

## When Done
Close issue: `bd close w4d --reason "Refactored tavern brawl with pairwise combat beats and contact-driven FX"`

# Add kill streak and combo visual feedback

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-9os` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:03:33 |
| **Updated** | 2026-02-26 03:38:48 |

## Description

Add satisfying feedback for rapid kills: screen shake on big hits/boss damage, brief screen flash on boss kill, combo counter that appears when killing enemies in rapid succession (2x, 3x, 5x, 10x with escalating text size), and bonus gold for kill streaks. Add a subtle camera shake on nexus hit as well for negative feedback.

## Worker Prompt & Notes

## prepared.prompt

## Context
Arcane Bastion lacks juicy feedback for rapid kills. Adding kill streaks, screen effects, and combo bonuses makes combat feel more impactful and rewarding, especially during intense late-game waves.

## Task
Add kill streak and combo visual feedback to the tower defense game:

1. **Kill Streak Tracker** — In engine.js, track consecutive kills:
   - `killStreak` counter, `lastKillTime` timestamp
   - Streak resets if no kill within 2 seconds
   - Milestones: 3x, 5x, 10x, 15x, 25x

2. **Combo Counter Display** — Floating combo text:
   - Show "3x COMBO!" etc. as a large, centered floating text
   - Text scales up with streak (font size increases)
   - Colors escalate: white → yellow → orange → red → purple
   - Fade out after 1.5s if no new kill
   - Render on the canvas above enemies but below HUD

3. **Screen Shake** — Add subtle canvas shake effect:
   - Light shake on boss ability hit (2px, 200ms)
   - Medium shake on nexus damage (4px, 300ms)
   - Heavy shake on boss death (6px, 500ms)
   - Implement by offsetting ctx.translate() in the render loop with a decaying random offset

4. **Screen Flash** — Brief overlay flash:
   - White flash on boss kill (opacity 0.3, 150ms fade)
   - Red flash on nexus hit (opacity 0.2, 200ms fade)
   - Render as a fullscreen rect over the canvas

5. **Streak Gold Bonus** — Award bonus gold for sustained streaks:
   - 5x streak: +5 bonus gold
   - 10x streak: +15 bonus gold  
   - 25x streak: +50 bonus gold
   - Show bonus as green floating "+5 STREAK BONUS" damage number

## Key Files
- `games/tower-defense/engine.js` — kill handler (~line 1007 where totalKills increments), render loop, gold rewards
- `games/tower-defense/effects.js` — spawnDamageNumber() for floating text, particle system
- `games/tower-defense/enemies.js` — death callback, nexus hit handler

## When Done
Close issue: bd close htmlstyleguides-9os --reason="Added kill streak combos, screen shake, screen flash, and streak gold bonuses"

# Add difficulty mode selection

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-sfh` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:02:55 |
| **Updated** | 2026-02-26 04:15:36 |

## Description

Add Easy/Normal/Hard difficulty selection on the menu screen. Easy: more starting gold, slower scaling, +50 nexus HP. Normal: current balance. Hard: less starting gold, faster scaling, -25 nexus HP, enemies gain random elite modifiers earlier. Save best wave per difficulty in localStorage.

## Worker Prompt & Notes

## prepared.prompt

## Context
Arcane Bastion has a single difficulty level. Adding Easy/Normal/Hard modes broadens appeal — casual players can enjoy the game while hardcore players get a real challenge. Difficulty affects economy, scaling, and starting conditions.

## Task
Add difficulty selection to `games/tower-defense/`:

1. **Menu UI** (index.html) — Add difficulty selector on menu screen:
   - Three buttons/cards: Easy, Normal, Hard
   - Default highlight on Normal
   - Brief description under each:
     - Easy: "More gold, slower enemies, forgiving"
     - Normal: "The intended experience"
     - Hard: "Ruthless scaling, scarce resources"
   - Style to match existing menu aesthetic (dark theme, glow accents)

2. **Difficulty Settings** (engine.js) — Define difficulty multipliers:
   ```
   EASY:   { startGold: 600, nexusHP: 150, hpMult: 0.75, speedMult: 0.85, goldMult: 1.3, armorMult: 0.8 }
   NORMAL: { startGold: 400, nexusHP: 100, hpMult: 1.0,  speedMult: 1.0,  goldMult: 1.0, armorMult: 1.0 }
   HARD:   { startGold: 300, nexusHP: 75,  hpMult: 1.35, speedMult: 1.15, goldMult: 0.8, armorMult: 1.3 }
   ```

3. **Apply to Game** — In `newGame()`, set starting gold and nexus HP from difficulty. Pass difficulty multipliers to enemies.js `getWave()` to scale hpMult, speedMult, armorBonus.

4. **Save Per Difficulty** — Use separate localStorage keys: `arcane-best-easy`, `arcane-best-normal`, `arcane-best-hard`. Show all three on menu screen.

5. **Visual Indicator** — Show current difficulty in HUD (small text or icon next to wave counter).

## Key Files
- `games/tower-defense/index.html` — menu screen (#menu-screen, ~line 611), add difficulty buttons
- `games/tower-defense/engine.js` — newGame() (~line 642), game state vars (line 37-40), localStorage (line 217)
- `games/tower-defense/enemies.js` — getWave() scaling formulas (~line 1432)

## When Done
Close issue: bd close htmlstyleguides-sfh --reason="Added Easy/Normal/Hard difficulty modes with per-difficulty high scores"

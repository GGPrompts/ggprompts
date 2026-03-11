# Per-class high scores and stats tracking

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-otk` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | — |
| **Created** | 2026-02-16 17:57:50 |
| **Updated** | 2026-02-16 18:10:16 |

## Description

Add separate high score tracking for each class (classId) in localStorage.

1. Restructure high score storage: instead of a single best score, store per-class records:
   { gunner: { bestTime, bestKills, bestWave, runs }, darkknight: {...}, ranger: {...}, warlock: {...} }
2. Show class-specific high scores on the game over screen ('Your best as Gunner: ...')
3. Add a leaderboard/stats panel to the hub index showing all 4 classes' bests side by side
4. Track per-class: best survival time, most kills, highest wave reached, total runs, total kills
5. Migrate existing high score data to the first class the player used (or cyberpunk/gunner as default)
6. Show class mastery indicators — e.g. star rating based on milestones per class

Files: engine.js (SaveManager, game over screen), index.html (leaderboard display), all level HTMLs (game over rendering)

## Worker Prompt & Notes

## Retro
- What worked: Clear task breakdown made implementation straightforward. Migration path from old save format was well-defined.
- What was unclear: Concurrent file modifications from other agents caused some edit retries, but did not affect final result.

# Level progression — world warp on victory

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-227` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | — |
| **Created** | 2026-02-16 13:13:45 |
| **Updated** | 2026-02-16 14:19:28 |

## Description

Define victory condition per level (survive X minutes or kill the boss). On victory, save state and redirect to shop page for next world. Order: cyberpunk → gothic → forest → cosmic. Final cosmic level is endgame.

## Worker Prompt & Notes

## Retro
- What worked: Clean separation between THEME config (victoryCondition/worldOrder) and engine logic (checkVictoryCondition/triggerVictory) made it easy to add per-world settings without touching engine code per theme.
- What was unclear: Nothing major -- the boss names in theme files were straightforward to identify.

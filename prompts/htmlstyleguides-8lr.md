# Currency system — earn gold during level runs

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-8lr` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | — |
| **Created** | 2026-02-16 13:13:29 |
| **Updated** | 2026-02-16 14:15:28 |

## Description

Add currency earned from kills, gems, time survived, and boss kills during gameplay. Display gold counter in HUD. Currency persists to save state at end of level. Bonus gold for completing a level.

## Worker Prompt & Notes

## Retro
- What worked: Clean integration points - killEnemy, gem pickup, and game loop timer made gold sources easy to hook in. SaveManager.recordRun already existed as the perfect place to persist gold.
- What was unclear: Nothing major - the existing code structure was well-organized and easy to extend.

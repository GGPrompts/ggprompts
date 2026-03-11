# Skill tree system

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-abc` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | — |
| **Created** | 2026-02-16 13:13:45 |
| **Updated** | 2026-02-16 14:32:18 |

## Description

Design and implement a skill tree with branching paths. Skills unlock new abilities or enhance existing ones (dash distance, invuln duration, crit chance, lifesteal). Interactive tree on shop page. Skill points earned per level completed.

## Worker Prompt & Notes

## Retro
- What worked: Engine already had pierce/crit infrastructure making skill tree effects straightforward to wire up. The shop template's modular save/render pattern made adding a new section clean.
- What was unclear: Whether multi-projectile should apply only to projectile weapon type or all weapons. Went with projectile-only for balance.

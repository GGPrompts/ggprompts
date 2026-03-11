# Save system — localStorage + JSON export/import

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-rnk` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | — |
| **Created** | 2026-02-16 13:13:09 |
| **Updated** | 2026-02-16 14:13:07 |

## Description

Design the save state schema and implement read/write to localStorage. Include export-to-JSON and import-from-JSON for sharing builds. Schema covers: gold/currency, current world, inventory (loot drops), skill tree, permanent upgrades, run stats (total kills, best time). Base64 URL hash encoding for shareable build links.

## Worker Prompt & Notes

## Retro
- What worked: Clean IIFE module pattern matching existing Audio module style. Simple localStorage API with migration scaffolding.
- What was unclear: Nothing major - the task was well-specified with clear schema and method signatures.

# Loot drop inventory system

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-fjj` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | — |
| **Created** | 2026-02-16 13:13:45 |
| **Updated** | 2026-02-16 14:38:28 |

## Description

Enemies and bosses can drop loot items during runs. Items stored in inventory in save state. Items provide passive bonuses or active abilities. Inventory UI on shop page. Rarity tiers (common, rare, epic, legendary).

## Worker Prompt & Notes

## Retro
- What worked: Clean separation of loot table definition, drop pool pattern matching existing gem/particle pools, and reusing the save manager pattern for equipped items
- What was unclear: Nothing significant -- the codebase patterns were very consistent and easy to extend

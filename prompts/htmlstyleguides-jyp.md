# Shop page template — between-levels store

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-jyp` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | — |
| **Created** | 2026-02-16 13:13:45 |
| **Updated** | 2026-02-16 14:22:22 |

## Description

Self-contained HTML shop page. Reads save state from localStorage, displays upgrades/items, lets player spend currency, writes updated state back. Each shop themed to the NEXT world. Card-based UI with item descriptions, costs, and owned indicators.

## Worker Prompt & Notes

## Retro
- What worked: SaveManager schema in engine.js was clean and well-documented, easy to mirror in standalone shop page
- What was unclear: nothing major, the worldOrder pattern made the continue-to-next-world flow straightforward

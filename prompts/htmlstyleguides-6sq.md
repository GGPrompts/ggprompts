# 4 themed shop pages — cyberpunk, gothic, forest, cosmic

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-6sq` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | — |
| **Created** | 2026-02-16 13:13:45 |
| **Updated** | 2026-02-16 14:43:48 |

## Description

Build 4 self-contained HTML shop pages, each styled to match its theme. Cyberpunk: neon tech dealer. Gothic: dark merchant. Forest: woodland trader. Cosmic: alien bazaar. All share same shop logic with unique visuals and flavor text.

## Worker Prompt & Notes

## prepared.prompt

## Context
Each world transition goes through a themed shop. The 4 shops should feel like part of the world — a neon tech dealer for cyberpunk, a dark apothecary for gothic, a woodland spirit for forest, and an alien bazaar for cosmic.

## Task
Build 4 themed shop pages based on the shop template.

### Requirements
1. Create 4 files:
   - `games/survivors/shop-gothic.html` — after cyberpunk, before gothic
   - `games/survivors/shop-forest.html` — after gothic, before forest
   - `games/survivors/shop-cosmic.html` — after forest, before cosmic
   - `games/survivors/shop-victory.html` — after cosmic, final stats screen
2. Each shop uses the same buy/save logic from shop-template
3. Each has unique:
   - Color palette matching destination theme
   - Google Font pairing
   - Merchant character/flavor text
   - Background visual (CSS gradients/patterns)
   - Item descriptions rewritten to match theme flavor
4. Victory page shows: total gold earned, total kills, worlds completed, time played, equipped items
5. All self-contained HTML, responsive, no build tools

## Key Files
- `games/survivors/shop-gothic.html` — NEW
- `games/survivors/shop-forest.html` — NEW
- `games/survivors/shop-cosmic.html` — NEW
- `games/survivors/shop-victory.html` — NEW
- `games/survivors/shop-template.html` — reference for shared logic

## Dependencies
- Requires shop template from htmlstyleguides-jyp
- Requires upgrades catalog from htmlstyleguides-vn7

## Parallelization
All 4 shop pages can be built in parallel by separate agents since they are independent files.

## When Done
Close issue: bd close htmlstyleguides-6sq --reason "4 themed shop pages built"

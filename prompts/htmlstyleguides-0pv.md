# Add multiple maps with varying difficulty

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-0pv` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:02:49 |
| **Updated** | 2026-02-26 03:49:17 |

## Description

Create 2-3 additional maps beyond the current one. Ideas: a map with a single long winding path (easier, more tower slots), a map with multiple short paths converging (harder, split attention), and a map with a central island requiring bridge chokepoints. Each map should have its own spawn point layout and nexus position. Add map selection to the menu screen.

## Worker Prompt & Notes

## prepared.prompt

## Context
Arcane Bastion has one hardcoded map layout. Multiple maps with different path configurations and strategic challenges add significant replayability and variety.

## Task
Add 2-3 new maps and a map selection system:

1. **Map Data Structure** — Refactor map.js to support multiple map definitions:
   - Extract current map into `MAPS.arcaneBastion` (25x16 grid)
   - Each map: `{ name, description, difficulty, cols, rows, grid, spawnPoints, nexusPos }`
   - `ArcaneMap.init(mapId)` loads the selected map

2. **New Maps**:

   **Serpent's Path** (Easy, 25x16):
   - Single long winding S-curve path from top-left to bottom-right
   - Lots of buildable space along curves
   - 2 spawn points (top-left, bottom-left)
   - Nexus at bottom-right
   - Good for beginners — long path gives more time

   **The Crossroads** (Hard, 25x16):
   - 4 short paths converging on center nexus from each edge
   - Very limited build space near nexus
   - 4 spawn points (all edges)
   - Requires split attention and efficient tower placement

   **Fortress Isle** (Medium, 25x16):
   - Central island with nexus, connected by 2 bridge chokepoints
   - Water/void tiles (unbuildable, impassable) surrounding island
   - 2 spawn points on opposite shores
   - Rewards chokepoint defense strategy

3. **Map Selection UI** (index.html):
   - Show map cards on menu screen between difficulty and start button
   - Each card: map name, difficulty label, small ASCII/visual preview
   - Highlight selected map

4. **Pathfinding** — Each map defines its own spawn points and paths. A* pathfinding in map.js already supports arbitrary layouts — just need different grid data.

5. **Per-Map Saves** — Store best wave per map+difficulty combo in localStorage.

## Key Files
- `games/tower-defense/map.js` — buildMap1() (~line 51), grid system, cell types, A* pathfinding, spawn/nexus positions
- `games/tower-defense/engine.js` — newGame() to accept mapId, menu screen handlers
- `games/tower-defense/index.html` — menu screen UI for map selection

## When Done
Close issue: bd close htmlstyleguides-0pv --reason="Added 2-3 new maps with selection UI and per-map high scores"

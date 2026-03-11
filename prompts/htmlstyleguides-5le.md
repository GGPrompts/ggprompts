# Maze Generator tool

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-5le` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:23:55 |
| **Updated** | 2026-02-26 03:30:59 |

## Description

Generate and solve mazes with different algorithms (DFS, Prim's, Kruskal's). Adjustable grid size. Animated generation visualization. Solve with BFS/A* pathfinding. Export as PNG. Fits in tools/ section with Rococo card on tools/index.html.

## Worker Prompt & Notes

## prepared.prompt

## Context
The tools section has 9 creative tools. This adds a maze generator with algorithm visualization.

## Task
Create a Maze Generator tool in `tools/maze-generator/`.

Build an interactive tool where users can:
- Generate mazes with multiple algorithms: DFS (recursive backtracker), Prims, Kruskals
- Adjustable grid size (10x10 up to 50x50)
- Animated generation visualization (watch the maze being carved)
- Solve the maze with BFS or A* pathfinding (animated)
- Adjustable animation speed
- Start/pause/step controls
- Color customization (walls, path, solution, visited)
- Export as PNG

Use canvas rendering for performance. Use a clean, educational aesthetic with algorithm info panels. Add a Rococo-themed card to `tools/index.html` following the existing card pattern.

## Key Files
- tools/maze-generator/index.html (new)
- tools/index.html (add card)

## When Done
Close issue: bd close htmlstyleguides-5le --reason "Maze generator created"

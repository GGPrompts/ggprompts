# Tiling/Pattern Maker tool

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-chp` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:23:32 |
| **Updated** | 2026-02-26 03:30:32 |

## Description

Design repeating tessellation patterns with geometric shapes. Preview seamless tile repetition in real-time. Export as PNG/SVG. Fits in tools/ section with Rococo card on tools/index.html.

## Worker Prompt & Notes

## prepared.prompt

## Context
The tools section has 9 creative tools. This adds a tiling/pattern maker for designing seamless repeating patterns.

## Task
Create a Tiling/Pattern Maker tool in `tools/pattern-maker/`.

Build an interactive editor where users can:
- Place geometric shapes (triangles, squares, hexagons, circles, lines) on a tile canvas
- Adjust colors, sizes, rotation of shapes
- Preview seamless repetition in real-time (show the tile repeated in a grid)
- Control tile size and background color
- Export as PNG

Use a unique visual theme (not already used by other tools). Add a Rococo-themed card to `tools/index.html` following the existing card pattern (`.card-pattern-maker` class with custom gradient + accent).

## Key Files
- tools/pattern-maker/index.html (new)
- tools/index.html (add card)

## When Done
Close issue: bd close htmlstyleguides-chp --reason "Pattern maker tool created"

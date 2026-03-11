# Fractal Explorer tool

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-idi` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:24:01 |
| **Updated** | 2026-02-26 03:30:21 |

## Description

Interactive Mandelbrot and Julia set viewer. Click to zoom, pan around. Adjustable color mapping and iteration depth. Smooth coloring. Fits in tools/ section with Rococo card on tools/index.html.

## Worker Prompt & Notes

## prepared.prompt

## Context
The tools section has 9 creative tools. This adds a fractal explorer for interactive Mandelbrot/Julia set visualization.

## Task
Create a Fractal Explorer tool in `tools/fractal-explorer/`.

Build an interactive viewer where users can:
- View the Mandelbrot set rendered on canvas
- Click to zoom in, scroll wheel to zoom in/out
- Pan by dragging
- Switch between Mandelbrot and Julia set modes
- For Julia sets: click on Mandelbrot to pick the c parameter
- Adjustable max iterations (50-5000)
- Multiple color palettes (classic rainbow, fire, ocean, grayscale, custom)
- Smooth coloring (escape-time with interpolation)
- Coordinates display (show complex number at cursor)
- Reset view button
- Export as PNG

Use canvas rendering. Optimize with web workers if needed for responsiveness. Use a dark, cosmic aesthetic. Add a Rococo-themed card to `tools/index.html` following the existing card pattern.

## Key Files
- tools/fractal-explorer/index.html (new)
- tools/index.html (add card)

## When Done
Close issue: bd close htmlstyleguides-idi --reason "Fractal explorer created"

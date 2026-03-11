# Isometric Scene Builder tool

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-kcb` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:23:35 |
| **Updated** | 2026-02-26 03:30:15 |

## Description

Place cubes and objects on an isometric grid to build little diorama scenes. Drag-and-drop interface. Export as PNG. Fits in tools/ section with Rococo card on tools/index.html.

## Worker Prompt & Notes

## prepared.prompt

## Context
The tools section has 9 creative tools. This adds an isometric scene builder for constructing little 3D diorama scenes.

## Task
Create an Isometric Scene Builder tool in `tools/isometric/`.

Build an interactive editor where users can:
- Place isometric cubes/blocks on a grid (click to place, right-click to remove)
- Multiple block types: solid colors, grass-topped, water, wood, stone, etc.
- Stack blocks vertically (build upward)
- Color picker for custom block colors
- Rotate view (or at least flip perspective)
- Clear scene
- Export as PNG

Use an isometric pixel-art aesthetic with a clean, light background. Render using canvas for performance. Add a Rococo-themed card to `tools/index.html` following the existing card pattern.

## Key Files
- tools/isometric/index.html (new)
- tools/index.html (add card)

## When Done
Close issue: bd close htmlstyleguides-kcb --reason "Isometric scene builder created"

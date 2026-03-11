# SVG Icon Editor tool

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-ct0` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:23:49 |
| **Updated** | 2026-02-26 03:32:48 |

## Description

Draw simple vector icons on a grid using basic shapes (rect, circle, line, path). Snap to grid. Export as clean SVG. Fits in tools/ section with Rococo card on tools/index.html.

## Worker Prompt & Notes

## prepared.prompt

## Context
The tools section has 9 creative tools. This adds an SVG icon editor for creating simple vector icons.

## Task
Create an SVG Icon Editor tool in `tools/svg-icon/`.

Build an interactive editor where users can:
- Draw on a grid canvas using basic SVG shapes (rect, circle, ellipse, line, polyline, path)
- Snap to grid for clean icon design
- Fill and stroke color controls with opacity
- Stroke width control
- Select, move, resize, delete shapes
- Undo/redo
- Adjustable grid size (16x16, 24x24, 32x32, 48x48)
- Export as clean SVG code (copy to clipboard or download)
- Preview at multiple sizes (16px, 24px, 32px, 48px side by side)

Use a clean blueprint/drafting aesthetic (light blue grid lines). Add a Rococo-themed card to `tools/index.html` following the existing card pattern.

## Key Files
- tools/svg-icon/index.html (new)
- tools/index.html (add card)

## When Done
Close issue: bd close htmlstyleguides-ct0 --reason "SVG icon editor created"

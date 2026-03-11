# CSS Box Shadow Designer tool

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-by4` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:23:43 |
| **Updated** | 2026-02-26 03:29:46 |

## Description

Visual editor for layered CSS box-shadows. Add multiple shadow layers, adjust offset/blur/spread/color with live preview. Copy generated CSS to clipboard. Fits in tools/ section with Rococo card on tools/index.html.

## Worker Prompt & Notes

## prepared.prompt

## Context
The tools section has 9 creative tools. This adds a CSS box shadow designer with visual layer editing.

## Task
Create a CSS Box Shadow Designer tool in `tools/box-shadow/`.

Build an interactive editor where users can:
- Add multiple shadow layers (stack box-shadows)
- Per-layer controls: x-offset, y-offset, blur, spread, color (with alpha), inset toggle
- Reorder and delete layers
- Live preview on a customizable target element (change size, border-radius, background)
- Generated CSS code output with syntax highlighting
- Copy CSS to clipboard
- Preset shadows (subtle, material, neumorphic, hard, layered glow)

Use a dark design-tool aesthetic (dark background so shadows are clearly visible). Add a Rococo-themed card to `tools/index.html` following the existing card pattern.

## Key Files
- tools/box-shadow/index.html (new)
- tools/index.html (add card)

## When Done
Close issue: bd close htmlstyleguides-by4 --reason "Box shadow designer created"

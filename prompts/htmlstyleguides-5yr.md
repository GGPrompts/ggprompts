# ASCII Art Editor tool

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-5yr` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:23:33 |
| **Updated** | 2026-02-26 03:29:44 |

## Description

Paint with characters on a grid canvas. Include image-to-ASCII converter. Export as plain text. Fits in tools/ section with Rococo card on tools/index.html.

## Worker Prompt & Notes

## prepared.prompt

## Context
The tools section has 9 creative tools. This adds an ASCII art editor for painting with text characters.

## Task
Create an ASCII Art Editor tool in `tools/ascii-art/`.

Build an interactive editor where users can:
- Paint characters on a grid canvas (click/drag to place characters)
- Character palette with common ASCII art characters (box drawing, blocks, symbols)
- Adjustable grid size (width x height in characters)
- Eraser tool and fill tool
- Multiple font size options for the grid
- Copy to clipboard as plain text
- Clear canvas

Use a retro terminal/monospace aesthetic (green-on-black or amber-on-black CRT style). Add a Rococo-themed card to `tools/index.html` following the existing card pattern.

## Key Files
- tools/ascii-art/index.html (new)
- tools/index.html (add card)

## When Done
Close issue: bd close htmlstyleguides-5yr --reason "ASCII art editor created"

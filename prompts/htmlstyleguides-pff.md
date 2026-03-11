# Pixel Art Editor tool

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-pff` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | ready |
| **Created** | 2026-02-23 02:54:30 |
| **Updated** | 2026-02-23 03:07:40 |

## Description

Grid-based pixel art editor in tools/pixel-art/. Features: layers, palette management, onion skinning for animation frames, export to PNG/sprite sheet. Complements existing pixel art style guide and game assets. Vanilla HTML/CSS/JS, no build step.

## Worker Prompt & Notes

## prepared.prompt

## Context
The tools section has one tool (Stick Figure Animator). This adds a pixel art editor — a natural fit since there's already a pixel-art style guide (styles/pixel-art.html) with NES-inspired aesthetics that can inform the theme.

## Task
Build a grid-based pixel art editor in tools/pixel-art/. Use the pixel-art style guide aesthetic (Press Start 2P font, NES color palette, CRT scanline vibes). Features needed:

- Canvas grid with configurable size (8x8 to 64x64), zoom/pan
- Drawing tools: pencil, eraser, line, rectangle, fill bucket, color picker (eyedropper)
- Layer system with visibility toggles and reordering
- Palette sidebar with preset NES palette + custom colors
- Onion skinning for animation frames (previous frame ghost)
- Animation frame strip: add/delete/reorder/duplicate frames, play preview
- Undo/redo (Ctrl+Z / Ctrl+Shift+Z)
- Export: PNG (single frame), sprite sheet PNG (all frames), JSON project save/load
- localStorage autosave
- Keyboard shortcuts + help overlay (? key)
- Responsive @media (max-width: 768px)

## Key Files
- tools/pixel-art/index.html — main editor (inline CSS, theme)
- tools/pixel-art/pixel-engine.js — grid logic, drawing tools, layers, undo/redo
- tools/pixel-art/pixel-export.js — PNG/sprite sheet export
- tools/index.html — add Rococo card for this tool
- styles/pixel-art.html — reference for aesthetic/colors

## Architecture Notes
- Engine module (window.PixelEngine) should be DOM-free like AnimatorEngine
- Use canvas for the grid, not DOM elements
- GIF export from animator (tools/animator/gif-export.js) can be referenced for the LZW/quantizer pattern if adding GIF animation export
- Google Fonts only external CDN dependency

## When Done
- Add card to tools/index.html hub page
- Update count in master /index.html if applicable
- Close issue: bd close htmlstyleguides-pff --reason "Pixel art editor complete"

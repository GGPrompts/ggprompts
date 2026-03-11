# Kid Paint drawing tool

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-hsy` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | ready |
| **Created** | 2026-02-23 02:54:35 |
| **Updated** | 2026-02-23 03:07:40 |

## Description

Fun, simple drawing tool in tools/kid-paint/ aimed at kids. Big chunky buttons, bright playful UI. Features: rainbow brushes, color-cycling pens, stamps/stickers, glitter/sparkle effects, fun shapes, eraser, fill bucket, silly sound effects on draw actions. Big canvas, very low barrier to entry. Export drawings as PNG. Vanilla HTML/CSS/JS.

## Worker Prompt & Notes

## prepared.prompt

## Context
The other tools (animator, pixel editor, SFX generator, palette studio) are creative tools aimed at makers. Kid Paint is different — it's aimed at kids, prioritizing fun and simplicity over power features. Think MS Paint meets Lisa Frank.

## Task
Build a fun, simple drawing tool in tools/kid-paint/ aimed at kids. Bright, playful aesthetic with big chunky UI. Features needed:

- Large canvas (fills most of the screen)
- Big, colorful tool buttons with icons/emoji labels:
  - Pencil (various sizes: thin, medium, thick)
  - Rainbow brush (cycles through colors as you draw)
  - Glitter/sparkle pen (draws with random sparkle particles)
  - Spray can (airbrush effect)
  - Shape stamps (star, heart, smiley, flower, lightning bolt, etc.)
  - Eraser (big chunky)
  - Fill bucket
  - Line tool, rectangle, circle/oval
- Color palette: bright, kid-friendly colors (8-12 big swatches) + rainbow option
- Fun sound effects on actions (pop on stamp, swoosh on brush, sprinkle on glitter) — use Web Audio API, procedural (no audio files)
- Sticker stamps: drag-and-place fun stickers (drawn via canvas, not images)
- Clear canvas button with "Are you sure?" confirmation
- Save as PNG download
- Touch-friendly: large hit targets, works on tablets
- NO complex features: no layers, no undo history panel, no export formats (keep it simple)
- Optional: simple undo (Ctrl+Z) via canvas snapshot stack
- Responsive — should work on phones/tablets too

## Key Files
- tools/kid-paint/index.html — everything (inline CSS + JS, or split engine if large)
- tools/index.html — add Rococo card for this tool

## Architecture Notes
- Can be mostly self-contained in index.html given the simpler scope
- If splitting: kid-paint-engine.js for drawing logic, stamps, and sound effects
- Sound effects: short procedural tones via OscillatorNode (don't need a full audio engine)
- Canvas stamps can be drawn procedurally (star = polygon, heart = bezier curves, etc.)
- Use big rounded buttons (border-radius: 50% or pill shapes), playful font (consider Bubblegum Sans, Fredoka One, or Patrick Hand from Google Fonts)
- Background could be a subtle paper texture via CSS gradient pattern

## When Done
- Add card to tools/index.html hub page
- Close issue: bd close htmlstyleguides-hsy --reason "Kid Paint complete"

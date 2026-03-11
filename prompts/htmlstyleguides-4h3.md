# Color Palette Studio tool

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-4h3` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | ready |
| **Created** | 2026-02-23 02:54:33 |
| **Updated** | 2026-02-23 03:07:40 |

## Description

Color palette builder in tools/palette-studio/. Color theory tools (complementary, triadic, split-complementary, analogous). Extract palettes from uploaded images. Live preview swatches. Export as CSS :root variables, directly useful for creating new style guides. Vanilla HTML/CSS/JS.

## Worker Prompt & Notes

## prepared.prompt

## Context
The project has 155 CSS style guides, each defining palettes in :root CSS variables. A color palette studio would directly feed into creating new style guides by letting users build harmonious palettes and export them as ready-to-use CSS.

## Task
Build a color palette builder in tools/palette-studio/. Use a clean, minimal aesthetic so colors take center stage (suggest: light/neutral background, subtle UI, let the swatches be the hero). Features needed:

- Color picker: HSL wheel or square + sliders for H/S/L and R/G/B, hex input
- Harmony generators: complementary, analogous, triadic, split-complementary, tetradic, monochromatic
- Palette strip: 3-8 color swatches, click to edit, drag to reorder, lock individual colors
- Image palette extraction: upload an image, extract dominant colors (canvas getImageData + quantization)
- Contrast checker: WCAG AA/AAA compliance between any two selected colors
- Shade/tint generator: auto-generate lighter/darker variants of a color
- Export formats:
  - CSS :root variables (--color-primary, --color-secondary, etc.)
  - JSON object
  - Copy individual hex/rgb/hsl values
- localStorage autosave
- Undo/redo
- Keyboard shortcuts + help overlay
- Responsive @media (max-width: 768px)

## Key Files
- tools/palette-studio/index.html — main UI (inline CSS)
- tools/palette-studio/palette-engine.js — color math (HSL↔RGB, harmony algorithms, contrast ratio, image quantization)
- tools/index.html — add Rococo card for this tool
- styles/pixel-art.html — reference for how style guides define color palettes in :root

## Architecture Notes
- Engine (window.PaletteEngine) should be DOM-free, pure color math
- Image quantization: median-cut (like gif-export.js) or simple k-means on pixel data
- WCAG contrast ratio formula: (L1 + 0.05) / (L2 + 0.05) where L is relative luminance
- HSL ↔ RGB conversion is well-defined, implement from scratch (no library needed)

## When Done
- Add card to tools/index.html hub page
- Close issue: bd close htmlstyleguides-4h3 --reason "Color palette studio complete"

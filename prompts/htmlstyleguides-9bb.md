# Font Pairing Playground tool

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-9bb` |
| **Status** | closed |
| **Priority** | 3 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:23:36 |
| **Updated** | 2026-02-26 03:30:20 |

## Description

Preview Google Font combinations on sample layouts. Test heading + body font pairings. Save favorite combos. Fits in tools/ section with Rococo card on tools/index.html.

## Worker Prompt & Notes

## prepared.prompt

## Context
The tools section has 9 creative tools. This adds a font pairing playground for previewing Google Font combinations.

## Task
Create a Font Pairing Playground tool in `tools/font-pairing/`.

Build an interactive tool where users can:
- Browse and select Google Fonts for heading and body text (load via Google Fonts API link tags)
- Preview the pairing on sample layouts (article, card, hero section mockups)
- Adjust font sizes, weights, line-height, letter-spacing
- Curated suggestions for popular pairings (e.g., Playfair Display + Source Sans)
- Copy the Google Fonts `<link>` tag and CSS to clipboard
- Save favorite pairings to localStorage

Use a clean, typographic-focused aesthetic (lots of whitespace, minimal chrome). Add a Rococo-themed card to `tools/index.html` following the existing card pattern.

## Key Files
- tools/font-pairing/index.html (new)
- tools/index.html (add card)

## When Done
Close issue: bd close htmlstyleguides-9bb --reason "Font pairing playground created"

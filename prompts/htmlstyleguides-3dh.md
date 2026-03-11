# Enrich landing page project cards with real assets

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-3dh` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | — |
| **Created** | 2026-02-22 04:39:34 |
| **Updated** | 2026-02-22 04:42:57 |

## Description

Customize the Dispatches from My Forge project cards with real screenshots, style-matched designs, and proper asset management. Create a landing/ folder for assets.

## Worker Prompt & Notes

## prepared.prompt

## Context
The landing page "Dispatches from My Forge" section has basic cards. Now enrich them with real project assets and style-matched designs.

## Setup
Create `landing/` folder for all landing page assets. Move existing `images/useless-glitch-backdrop.png` there too. Update CSS references.

## Asset Copying
Copy these files into `landing/`:
- From TabzChrome (public repo): `docs/screenshots/hero-dark.png` — quad-terminal hero shot
- The existing `images/useless-glitch-backdrop.png` — move to `landing/`

For TabzChrome, clone or use gh api to download:
```bash
# TabzChrome is public, clone to tmp and copy
gh repo clone GGPrompts/TabzChrome /tmp/tabzchrome 2>/dev/null
cp /tmp/tabzchrome/docs/screenshots/hero-dark.png landing/tabzchrome-hero.png
```

## Card Enrichments

### VetRD Card
- Match the civic style guide aesthetic: navy (#1a2744) + gold (#e6a812) palette, Playfair Display serif headers
- Add a gold accent bar at top (4px gradient like the civic card)
- Light gray gradient background (#e2e6ed to #eff1f5) instead of the current dark zinc
- This card should visually feel like VetRD.org — warm, trustworthy, institutional
- Make the card bigger to showcase the design treatment

### useless.io Card
- Keep the glitch backdrop, no individual product images
- Make the card bigger so the backdrop is more visible
- Could add some of the satirical product names as floating text or a fake price tag

### TabzChrome Card
- Feature the hero-dark.png screenshot prominently — this is the money shot showing 4 terminals running simultaneously
- Make this card larger to show the screenshot well
- Maybe add the YouTube video link as a small "Watch Demo" button
- YouTube URL: https://youtu.be/uY-YbAW7yg4

### Portfolio Style Guides Card
- Could echo the glassmorphism aesthetic that the actual site uses
- Maybe show a mini grid of template category icons

## Key Files
- `/home/matt/projects/htmlstyleguides/landing.html` — main file to modify
- Move `images/useless-glitch-backdrop.png` to `landing/useless-glitch-backdrop.png`

## Style Reference
The civic card CSS from index.html:
```css
.card-civic {
    font-family: "Inter", sans-serif;
    background: linear-gradient(135deg, #e2e6ed 0%, #eff1f5 100%);
    border: 1px solid #d6dbe5;
    color: #1a2744;
}
.card-civic::before {
    height: 4px;
    background: linear-gradient(90deg, #e6a812, #f0bc3a);
}
.card-civic h2 {
    font-family: "Playfair Display", Georgia, serif;
    color: #1a2744;
}
```

## When Done
Close issue: bd close htmlstyleguides-3dh --reason "summary"

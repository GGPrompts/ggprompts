# Data Visualization Gallery

Interactive data visualizations built with vanilla Canvas and SVG. Each visualization tells a data story through animation, interactivity, and beautiful design.

## Structure

```
dataviz/
├── index.html              # Hub page (data/analytical aesthetic)
├── CLAUDE.md               # This file
└── [viz-name]/             # Each visualization in its own folder
    └── index.html          # Self-contained visualization
```

## Design Philosophy

- Each visualization is a **self-contained HTML file** with inline `<style>` and `<script>`
- Uses **Canvas and/or SVG** for rendering — no D3.js or other charting libraries
- **Real or realistic datasets** embedded as JS arrays/objects (no external data fetching required)
- **Interactive**: hover tooltips, click to filter, animated transitions, playback controls
- **Vanilla HTML/CSS/JS only** — no build step, no frameworks
- Each viz should be **beautiful** and **tell a data story**

## Visual Standards

- **Dark backgrounds** with bright, high-contrast data elements
- **Smooth animations** — use `requestAnimationFrame` for Canvas, CSS transitions for SVG/DOM
- **Responsive** — include `@media (max-width: 768px)` breakpoints, handle canvas resize
- **Typography** — use Google Fonts, clean sans-serif for labels, monospace for numbers
- **Color coding** — use meaningful color palettes (by continent, category, sentiment, etc.)
- **Tooltips** — show contextual data on hover/tap with smooth fade transitions

## Interaction Patterns

- **Hover tooltips**: Show detailed data for the element under the cursor
- **Click to filter**: Toggle categories, select individual data points
- **Animated transitions**: Smooth interpolation when data changes (sorting, filtering, time scrubbing)
- **Playback controls**: Play/pause, speed slider, timeline scrubber for time-series data
- **Responsive touch**: Support tap interactions on mobile

## Data Guidelines

- Embed data directly in the HTML file as JavaScript arrays or objects
- Use **real data** when possible (population, GDP, climate, etc.) with approximate but accurate numbers
- Credit data sources in a footer or info panel
- Structure data for easy iteration: arrays of objects with consistent keys

## Canvas Best Practices

- Always handle `devicePixelRatio` for sharp rendering on Retina displays
- Resize canvas on window resize events
- Use `requestAnimationFrame` for animations, not `setInterval`
- Cache computed values (positions, colors) to avoid recalculating every frame
- Draw in layers: background, data elements, labels, overlays

## SVG Best Practices

- Use SVG `viewBox` for responsive scaling
- Leverage CSS transitions for smooth state changes
- Use `<g>` groups for logical data groupings
- Prefer `transform` over direct coordinate changes for animations

## File Conventions

- **Naming**: kebab-case folder names (`world-population`, `climate-change`, `tech-salaries`)
- **CSS variables**: Define palette/spacing/fonts in `:root {}`
- **Responsive**: All files include `@media (max-width: 768px)` breakpoints
- **Navigation**: Back link to hub page (`../index.html`) and main site (`../../index.html`)

## Adding a New Visualization

1. Create `dataviz/{viz-name}/index.html`
2. Embed the dataset as a JS object/array
3. Implement Canvas or SVG rendering with interactivity
4. Add responsive breakpoints and touch support
5. Add a card to `dataviz/index.html` with a mini-chart decoration
6. Add `<script defer src="../../prompt-viewer.js"></script>` before `</body>`

## Prompt Viewer

Add to every page before `</body>`:
```html
<!-- Hub page -->
<script defer src="../prompt-viewer.js"></script>

<!-- Individual viz pages -->
<script defer src="../../prompt-viewer.js"></script>
```

# Interactive Tutorials

Step-by-step coding lessons themed with existing style guides. Hub page at `tutorials/index.html` uses a **chalkboard classroom** aesthetic.

## Structure

```
tutorials/
  index.html              # Hub page (chalkboard-themed card grid)
  CLAUDE.md               # This file
  css-grid/               # CSS Grid tutorial (blueprint theme)
    index.html            # Complete interactive tutorial
  [topic-name]/           # Future tutorials
    index.html            # Each tutorial in its own subfolder
```

## What a Tutorial Is

An interactive, step-by-step coding lesson that teaches a specific CSS or web technology concept. Each tutorial is themed with one of the project's existing CSS style guides, making the learning experience visually distinctive.

## Tutorial Requirements

### File Structure
- Each tutorial is a self-contained HTML file in its own subfolder: `tutorials/{topic}/index.html`
- Vanilla HTML/CSS/JS only, no frameworks, no build step
- Include `<script defer src="../../prompt-viewer.js"></script>` before `</body>`

### Required UI Elements

1. **Step Navigation** -- prev/next buttons to move between lesson steps
2. **Progress Indicator** -- step counter or progress bar at the top showing current position
3. **Editable Code Area** -- `<textarea>` where users can modify CSS/HTML code
4. **Live Preview Panel** -- a container that updates in real-time as the user types
5. **Explanation Text** -- clear description of the concept for each step
6. **Reset Button** -- restores the default code for the current step

### Step Content

Each tutorial should have 6-8 steps, progressing from basics to advanced:
- Each step teaches one concept
- Default code is provided that the user can modify
- The live preview immediately reflects changes
- Brief, clear explanations (not walls of text)

### Theming

- Each tutorial borrows its visual language (CSS variables, fonts, colors) from an existing style guide in `/styles/`
- The tutorial chrome (navigation, progress bar, panels) uses the style guide's palette
- The live preview area may use a neutral background so user output is clearly visible

### Responsive Design

- Include `@media (max-width: 768px)` breakpoints
- On mobile, stack the code editor and preview vertically
- Navigation buttons remain accessible at all sizes

## Planned Tutorials

| Topic | Style Guide Theme | Status |
|-------|------------------|--------|
| CSS Grid | Blueprint | Complete |
| Flexbox | Bauhaus | Planned |
| CSS Animations | Art Deco | Planned |
| CSS Variables | Vaporwave | Planned |

## Adding a New Tutorial

1. Create a subdirectory under `tutorials/` (e.g., `tutorials/flexbox/`)
2. Add an `index.html` -- pick a style guide from `/styles/` for theming
3. Extract CSS variables from the chosen style guide into your `:root {}`
4. Build 6-8 progressive steps with editable code + live preview
5. Add a card to `tutorials/index.html` (chalkboard styling)
6. Update the count in the hub page header

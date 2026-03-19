# Challenges

Interactive coding challenges. Hub page at `challenges/index.html` uses a **competitive arcade** aesthetic (dark background, neon accents, scoreboard feel). Individual challenges use a clean, modern challenge UI.

## Structure

```
challenges/
  CLAUDE.md               # This file
  index.html              # Hub page (arcade scoreboard card grid)
  css-flag/
    index.html            # CSS Flag Challenge — recreate flags with CSS
  css-shapes/
    index.html            # CSS Shapes Challenge — recreate shapes with pure CSS
  [future-challenge]/
    index.html            # Each challenge is self-contained
```

## Challenge Types

1. **CSS Art** — Recreate a target image (flag, icon, scene) using only CSS
2. **Code Golf** — Solve a problem in the fewest characters possible
3. **Timed Puzzles** — Fix broken code, debug CSS, or complete patterns under time pressure

## Difficulty Levels

- **Beginner** — Green badge. Straightforward tasks, hints available, no time pressure.
- **Intermediate** — Amber badge. Multi-step problems, fewer hints, moderate complexity.
- **Advanced** — Red badge. Complex techniques, minimal hints, optional time limits.

## Challenge Page Structure

Each challenge is a self-contained `index.html` with inline `<style>` and `<script>`. Required elements:

1. **Target/Goal Display** — What the user is trying to recreate or solve
2. **Code Editor Area** — A `<textarea>` for writing CSS/HTML/JS
3. **Live Preview** — Updates in real time as the user types
4. **Scoring System** — Pixel comparison, character count, or correctness check
5. **Hints System** — Progressive hints revealed one at a time
6. **Submit/Check Button** — Validates the solution and shows score
7. **Back link** to `../index.html`
8. **Prompt viewer** — `<script defer src="../../prompt-viewer.js"></script>`

## Conventions

- Vanilla HTML/CSS/JS only, no build step, no frameworks
- Each challenge file is fully self-contained (inline styles and scripts)
- Responsive design with `@media (max-width: 768px)` breakpoints
- All files use kebab-case naming
- CSS variables in `:root {}` for theming
- Google Fonts loaded via `<link>` in `<head>`

## Scoring Approaches

### Pixel Comparison (CSS Art challenges)
Render both target and user attempt to offscreen canvases, compare pixel data, calculate percentage match.

### Character Count (Code Golf)
Count non-whitespace characters in the solution. Lower is better. Show par score.

### Correctness (Timed Puzzles)
Check specific output conditions. Binary pass/fail per test case.

## Adding a New Challenge

1. Create a subdirectory under `challenges/` (e.g., `challenges/my-challenge/`)
2. Add an `index.html` with the challenge UI
3. Add a card to `challenges/index.html` (arcade styling, difficulty badge)
4. Include `<script defer src="../../prompt-viewer.js"></script>` before `</body>`

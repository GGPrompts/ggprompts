# HTML Style Guides Project

A collection of CSS design system showcases, interactive educational stories, styled tech reference guides, CSS architecture maps, a chiptune music studio, browser games, creative tools, a daily AI newspaper, and a live API widget bazaar. Everything runs on GitHub Pages with zero build tools or frameworks.

## Project Structure

```
/
├── index.html              # Master index (links to all sections)
├── prompt-viewer.js        # Floating source/prompt viewer (loaded by all pages)
├── prompts/                # Archived build prompts + manifest
│   ├── manifest.json       # Maps page paths → prompt file paths
│   ├── README.md           # Index of all 70 archived prompts
│   └── *.md                # Individual prompt files (beads exports)
├── styles/                 # 204 CSS design system showcases
│   └── CLAUDE.md           # How to build style guides
├── stories/                # 45 interactive educational stories
│   ├── CLAUDE.md           # How to build stories
│   ├── STORY-CREATION-GUIDE.md  # Deep reference (audio, parallel workflows)
│   ├── briefs/             # Research briefs (Markdown)
│   ├── audio/              # Optional narration MP3s
│   └── [story-name]/       # Each story in its own folder
│       └── index.html      # Story file (may include media assets alongside)
├── techguides/             # 62 styled developer reference docs
│   └── CLAUDE.md           # How to build tech guides
├── music/                  # Chiptune music studio (Mozart's Study)
│   ├── CLAUDE.md           # How to use the music section
│   ├── index.html          # Hub page — song browser + tool links
│   ├── audio-tracker/      # FamiTracker-inspired sequencer + organ
│   └── visualizer/         # Canvas visualizer + music videos
│       ├── CLAUDE.md       # How to build renderers & videos
│       ├── video-utils.js  # Shared helpers (lerp, rand, rgba, etc.)
│       ├── video-base-styles.css  # Shared video CSS with CSS vars
│       └── base-renderer.js      # Video renderer factory
├── tools/                  # Creative tools (interactive editors)
│   ├── CLAUDE.md           # How to build tools
│   ├── index.html          # Hub page (Rococo-themed card grid)
│   ├── animator/           # Stick Figure Animation Studio
│   │   ├── index.html      # Editor (Darkroom-themed, full app)
│   │   ├── animator-engine.js  # Figure management, IK, keyframes, undo
│   │   ├── timeline.js     # Timeline UI with scrubber + playback
│   │   └── gif-export.js   # Pure-JS GIF encoder (LZW + quantizer)
│   └── slides/             # HTML presentation viewer & editor
│       ├── CLAUDE.md       # How to build slide decks
│       ├── index.html      # Hub page — lists presentations
│       ├── view.html       # Presentation viewer (?deck=name)
│       ├── edit.html       # Visual slide editor
│       ├── engine.js       # Viewer engine (nav, transitions, rendering)
│       ├── editor.js       # Editor engine (drag, resize, text editing)
│       ├── themes/         # Theme JS modules (default, graffiti, cyberpunk)
│       ├── assets/         # Deck images (prefix with deck name)
│       └── decks/          # JSON presentation files
├── kids/                  # Kids' Corner (PWA, toddler-friendly)
│   ├── CLAUDE.md           # How to build kids content
│   ├── index.html          # Hub page (carnival-fairground themed)
│   ├── manifest.json       # PWA manifest for fullscreen iPad
│   ├── sw.js               # Service worker for offline support
│   ├── games/              # Tap-and-play games
│   │   ├── bubblepop/      # Bubble popping game
│   │   └── fairy-defense/  # Tap monsters to beautify with sparkles
│   ├── create/             # Creative tools for kids
│   │   └── kid-paint/      # Drawing canvas (also in tools/)
│   └── stories/            # Simplified interactive stories
├── news/                  # Daily AI news (The AI Dispatch)
│   ├── CLAUDE.md           # Section conventions
│   ├── index.html          # Archive hub (newspaper-themed)
│   └── YYYY-MM-DD/         # One folder per daily edition
│       └── index.html      # Self-contained broadsheet edition
├── architecture/           # 33 CSS architecture maps (Blueprint Room)
│   ├── index.html          # Hub page (blueprint-themed card grid)
│   ├── briefs/             # Research briefs (Markdown)
│   └── [project-name]/     # Each map in its own folder
│       └── index.html      # Interactive architecture map
├── api-alley/              # Live API widget bazaar (269 APIs, 18 categories)
│   ├── CLAUDE.md           # How to build API Alley pages
│   ├── index.html          # Hub page (neon alley aesthetic)
│   ├── data/               # JSON catalogs of free APIs per category
│   └── [category]/         # One page per category with live widgets
│       └── index.html      # 6-8 widgets, data-viz style, real fetch() calls
└── games/                  # Browser games (modular JS)
    ├── casino-audio-engine.js  # Shared CasinoAudio for casino games
    ├── casino-theme.css        # Shared Vegas palette for casino games
    └── survivors/          # Survivors roguelike (arena + shop + themes)
```

## Core Principles

- **No build step**: All files work directly in a browser. Deployed via GitHub Pages.
- **No frameworks**: Vanilla HTML/CSS/JS only.
- **Google Fonts**: The only external CDN dependency. Loaded via `<link>` in `<head>`.

### Style guides & tech guides — single-file, self-contained
- Each is one `.html` file with inline `<style>` and optional inline `<script>`. No external CSS/JS.

### Stories, games & tools — modular is fine
- Stories, games, and tools can use multiple files (shared JS, theme configs, JSON data, media assets).
- The only hard rule: it must work on GitHub Pages with no build step.
- Stories may embed YouTube iframes and link to external resources (Wikipedia, etc.).

## Prompt Viewer (`prompt-viewer.js`)

Every HTML page loads `prompt-viewer.js` via `<script defer>`. It adds a floating button cluster in the bottom-right corner:

- **GitHub icon** (always) — opens the page's source on GitHub
- **Prompt icon** (when available) — opens a modal showing the build prompt(s) used to generate the page

### How it works
- On load, fetches `prompts/manifest.json` which maps page paths → prompt file paths
- Manifest values can be a single string or an array (pages built with multiple prompts)
- The modal fetches raw `.md` files from the site and displays them with a copy button
- Buttons are invisible until the user hovers near the bottom-right corner (tiny dot hint)

### Prompt sources
- `/prompts/*.md` — 70 archived worker prompts from beads (games, tools, music, animation, landing page)
- `/stories/briefs/*.md` — 31 story research briefs
- `/architecture/briefs/*.md` — 18 architecture research briefs
- ~26% of pages have explicit prompts; the rest were built from slash command skills or ad-hoc conversations

### When adding new pages
1. Add `<script defer src="RELATIVE_PATH/prompt-viewer.js"></script>` before `</body>`
2. If the page has a build prompt, add the mapping to `prompts/manifest.json`

### TODO (GGPrompts rebrand)
- Add slash command / skill info to section index pages (for pages without individual prompts)
- Point `ggprompts.com` DNS to GitHub Pages
- Update page titles / meta tags for rebrand

## Shared Modules

### Music Videos (`music/visualizer/`)
New music videos should use the shared modules instead of inline boilerplate:
- **`video-utils.js`** — Global helpers: `lerp`, `lerpExp`, `clamp01`, `rand`, `randInt`, `pickRandom`, `hexToRgb`, `rgba`
- **`video-base-styles.css`** — Structural CSS with CSS custom properties (`--vid-bg`, `--vid-accent`, `--vid-font`, etc.)
- **`base-renderer.js`** — `BaseRenderer(slug, name, config)` factory handles `window.Renderers` registration, beat detection, and `beatPulse` decay

See `music/visualizer/CLAUDE.md` for the full video template and API docs.

### Casino Games (`games/`)
The 3 casino games share:
- **`casino-audio-engine.js`** — `window.CasinoAudio` IIFE with `init()`, `play(type)`, `register(name, fn)` + 7 built-in sounds (flip, deal, place, click, buttonClick, win, fanfare, coin). Each game registers its unique sounds via `CasinoAudio.register()`.
- **`casino-theme.css`** — 23 shared `:root` variables for the Vegas aesthetic (`--felt-green`, `--gold`, `--neon-pink`, `--chrome`, font stacks, gradients, glows). Each game adds only its unique variables inline.

### Stick Figure Animation Studio (`tools/animator/`)
The animator loads shared modules from `music/visualizer/` (unmodified):
- **`stick-fight-engine.js`** — `window.StickFight` skeleton/pose/ragdoll toolkit (13 joints, 12 named poses, FK/IK)
- **`video-utils.js`** — `lerp`, `clamp01`, `rand`, etc.

See `tools/CLAUDE.md` for the animator architecture, IK solver, keyframe format, and how to extend it.

## Cross-Cutting Patterns

- **Naming**: All files use kebab-case (`dark-academia.html`, `curl-wget.html`)
- **CSS variables**: Every file defines its palette/spacing/fonts in `:root {}`
- **Responsive**: All files include `@media (max-width: 768px)` breakpoints
- **Navigation**: Each section has its own `index.html` with card grid; cards link to individual files

## Index Updates

When adding new content, update the relevant index:
- Style guides: `/index.html` (add card with `.card-{name}` class + CSS)
- Stories: `/stories/index.html` (add card with metadata tags)
- Tech guides: `/techguides/index.html` (add card in appropriate tier)
- Tools: `/tools/index.html` (add Rococo card linking to the tool)
- Kids: `/kids/index.html` (add card with big emoji icon)
- Architecture: `/architecture/index.html` (add card in blueprint grid)
- API Alley: `/api-alley/index.html` (add shop front card with neon glow)
- News: `/news/index.html` (updated automatically by `/news` skill)

Also update the counts/descriptions in the master `/index.html` nav links if applicable.

## Git

- Push with: `git config --global credential.helper store && echo "https://GGPrompts:$(gh auth token --user GGPrompts)@github.com" > ~/.git-credentials && git push origin main`
- Always use `--user GGPrompts` explicitly

# Kids' Corner

Toddler-friendly games, creative tools, and stories for ages 2-4. PWA-enabled for fullscreen iPad use with Guided Access.

## Design

Based on the **Carnival Fairground** style guide (`styles/carnival-fairground.html`):
- **Fonts**: Lilita One (headings), Fredoka (body), Bungee Shade (title), Concert One (subheadings)
- **Colors**: Cotton candy pink, balloon red/blue/green, popcorn yellow, taffy purple
- **Background**: Bright daytime sky — no dark themes

## Structure

```
kids/
├── index.html          # Hub page — big picture cards, no text nav
├── manifest.json       # PWA manifest (display: standalone)
├── sw.js               # Service worker (offline-first)
├── games/              # Tap-and-play games
│   ├── bubblepop/      # DOM-based bubble popping (copied from model-arena)
│   └── fairy-defense/  # Canvas game — tap monsters to beautify with sparkles
├── create/             # Creative tools
│   └── kid-paint/      # Canvas drawing app (copied from tools/kid-paint)
└── stories/            # Simplified interactive stories (placeholder)
```

## Rules for Kids' Content

- **Giant tap targets**: Minimum 80px, ideally 100px+
- **No text navigation**: Use big emoji/icons, not words
- **No failure states**: Games should be stress-free, no game over
- **Bright colors**: Use carnival palette, avoid dark/muted themes
- **Touch-first**: All interactions via tap. Disable pinch-zoom, scroll bounce
- **Audio**: Web Audio API only (procedural). Keep sounds happy and gentle
- **Back button**: Every page needs a big colorful back button to the hub

## PWA / iPad Setup

The hub page includes:
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- `<link rel="manifest" href="manifest.json">`
- `touch-action: manipulation` on body
- `user-scalable=no` in viewport meta

Users add to iPad home screen, then enable **Guided Access** (Settings > Accessibility) to lock kids into the app.

## Adding New Content

1. Create game/tool/story in appropriate subfolder
2. Add a card to `kids/index.html` with big emoji icon and carnival styling
3. Include a back button linking to `../../` (or appropriate relative path to hub)
4. Update `sw.js` cache list if the content should work offline

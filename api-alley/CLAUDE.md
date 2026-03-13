# API Alley

A geocities-style bazaar of live API widgets. Each page is a category (weather, space, animals, finance, etc.) packed with multiple free API sources, all pulling real data in the browser.

## Structure

```
api-alley/
├── index.html          # Hub page (neon alley / bazaar aesthetic)
├── CLAUDE.md           # This file
├── data/               # JSON database of discovered APIs
│   ├── weather.json    # APIs grouped by category
│   ├── space.json
│   └── ...
└── [category]/         # One page per category, many APIs per page
    └── index.html      # Live widgets + geocities aesthetic
```

## Design Philosophy

- Each category page is a **dense bazaar stall** — many API widgets crammed together, each showing live data
- The aesthetic is **geocities meets neon alley** — tiled backgrounds, animated gifs, marquee tags, visitor counters, garish colors, Comic Sans where appropriate
- Despite the chaos, every widget actually works and shows real data
- Each widget credits its API source with a link

## Page Structure

Each category page should include:
1. A ridiculous themed header for the category
2. Multiple API widgets, each in its own garish container
3. Live `fetch()` calls to free APIs (no API keys required when possible)
4. Fallback/error states that are on-theme (e.g., "under construction" gif when an API is down)
5. A mix of data displays: tables, counters, tickers, maps, random generators

## Data Format

Each JSON file in `data/` catalogs APIs for that category:

```json
{
  "category": "weather",
  "description": "Atmospheric data from around the globe",
  "apis": [
    {
      "name": "Open-Meteo",
      "url": "https://open-meteo.com",
      "base_endpoint": "https://api.open-meteo.com/v1/forecast",
      "auth": "none",
      "description": "Free weather forecast API, no key required",
      "sample_endpoint": "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true",
      "response_format": "json",
      "cors": true,
      "status": "active"
    }
  ]
}
```

Key fields:
- **auth**: `none`, `key-free-tier`, `oauth` — prefer `none` for instant browser use
- **cors**: `true`/`false` — must be `true` for direct browser `fetch()`, otherwise needs a proxy note
- **status**: `active`, `degraded`, `dead` — update when APIs go offline

## Rules

- **No API keys in HTML** — only use APIs that are free and keyless, or document the free tier signup
- **No build step** — vanilla HTML/CSS/JS, all `fetch()` from the browser
- **Self-contained pages** — each category page has inline styles and scripts
- **CORS matters** — only use APIs that support CORS for direct browser calls. Note any that need a proxy
- **Graceful failure** — APIs die. Every widget needs an error state that's funny, not broken
- **Credit sources** — every widget links back to the API docs

## Categories (19 live, 453 APIs)

All categories are built and live (one page each, many APIs per page):

- AI & Dev Tools (ai-dev)
- Animals & Nature (animals)
- Dev Tools & Meta APIs (dev-tools)
- Finance & Crypto (finance)
- Food & Drink (food)
- Games & Trivia (games)
- Government & Public Data (government)
- Health & Fitness (health)
- History & Culture (history)
- Language & Text (language)
- Music & Art (music-art)
- News & Media (news-media)
- Random Generators (random)
- Science & Math (science)
- Space & Astronomy (space)
- Sports (sports)
- Transportation (transportation)
- Weather & Climate (weather)
- World Data & Geography (world-data)

## Hub Page (index.html)

The hub should look like the entrance to a neon-lit alley at night:
- Dark background with neon signs for each category
- Each "shop front" links to a category page
- Animated elements (flickering neon, scrolling marquees)
- API count badges showing how many live sources each category has
- A big "OPEN 24/7" sign because APIs never sleep (except when they do)

## Adding New APIs

1. Add the API to the appropriate `data/[category].json` file
2. Build or update the widget on the category page
3. Test that the `fetch()` works from GitHub Pages (CORS!)
4. Add error handling for when it inevitably goes down

## Prompt Viewer

Add to every page before `</body>`:
```html
<script defer src="../prompt-viewer.js"></script>
```

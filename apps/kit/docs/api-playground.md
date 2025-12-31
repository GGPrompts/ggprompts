# API Playground

An interactive HTTP request builder and tester, similar to Postman or Insomnia, built directly into the homepage.

## Features

- **Request Builder**: Full HTTP request configuration
- **Response Viewer**: Formatted JSON with syntax highlighting
- **Collections**: Organized saved requests by category
- **History**: Request history with localStorage persistence
- **Code Generation**: Export requests as curl, JavaScript, or Python

## Request Builder

### HTTP Methods

| Method | Badge Color | Use Case |
|--------|-------------|----------|
| GET | Cyan | Retrieve data |
| POST | Green | Create resources |
| PUT | Amber | Replace resources |
| PATCH | Purple | Partial updates |
| DELETE | Red | Remove resources |

### Configuration Tabs

| Tab | Purpose |
|-----|---------|
| **Params** | Query string parameters (key-value with enable/disable) |
| **Headers** | Custom HTTP headers |
| **Body** | Request body (JSON, form-urlencoded, raw) |
| **Auth** | Authentication (Bearer, Basic, API Key) |

### Keyboard Shortcuts

- `Ctrl+Enter` / `Cmd+Enter`: Send request

## Response Viewer

### JSON Viewer Component

The response body uses a custom `JsonViewer` component with:

- **Syntax highlighting**: Theme-aware colors for keys, strings, numbers, booleans, null
- **Collapsible nodes**: Click chevrons to expand/collapse objects and arrays
- **Copy button**: Hover to reveal copy button (top-right)
- **Indentation guides**: Visual hierarchy with border lines

Default expansion depth: 3 levels

### Response Info

- Status code with color indicator (green: 2xx, amber: 4xx, red: 5xx)
- Response time in milliseconds
- Response size in bytes/KB/MB
- Response headers tab

## Collections

Pre-configured API collections for quick access:

### Weather APIs

| Request | Endpoint | Description |
|---------|----------|-------------|
| Current Weather | Open-Meteo /forecast | Temperature, humidity, conditions |
| 7-Day Forecast | Open-Meteo /forecast | Daily high/low, precipitation |
| Air Quality | Open-Meteo /air-quality | AQI, PM2.5, pollutants |
| Geocoding Search | Open-Meteo /search | City name to coordinates |
| Reverse Geocoding | Nominatim /reverse | Coordinates to address |
| Weather Alerts | NWS /alerts/active | US severe weather alerts |
| Radar Tiles | RainViewer /weather-maps.json | Precipitation radar data |

### Feed APIs

| Request | Endpoint | Description |
|---------|----------|-------------|
| HN Top Stories | Firebase /topstories.json | Hacker News story IDs |
| HN Story Details | Firebase /item/{id}.json | Individual story data |
| GitHub Trending | GitHub /search/repositories | Trending repos by stars |
| Reddit Hot Posts | Reddit /r/{sub}/hot.json | Hot posts from subreddit |
| Lobsters Hottest | Lobsters /hottest.json | Top tech stories |
| Dev.to Articles | Dev.to /api/articles | Top developer articles |

### Internal APIs

| Request | Endpoint | Description |
|---------|----------|-------------|
| Feed Aggregator | /api/feed | Combined feed from all sources |
| Filtered Feed | /api/feed?sources=... | Filtered by specific sources |

### GitHub Content API

Used by Quick Notes for repository file management. If you have GitHub settings configured in Settings, the token and repo are automatically injected.

| Request | Method | Description |
|---------|--------|-------------|
| Get Repository Info | GET | Test connection, get repo metadata |
| List Directory Contents | GET | Browse folder contents |
| Get File Content | GET | Read file (base64 encoded) |
| Create/Update File | PUT | Create or update with JSON body |
| Delete File | DELETE | Delete with SHA in body |

**Auto-injection:** When `github-token` and `github-repo` are set in localStorage (via Settings), the collection automatically:
- Replaces `OWNER/REPO` placeholder with your actual repo
- Pre-fills the bearer token in Auth tab

## Code Generation

Generate code snippets in multiple languages:

| Language | Library | Output |
|----------|---------|--------|
| curl | - | Shell command with headers and body |
| JavaScript | fetch | Browser-compatible fetch call |
| Python | requests | Python requests library |

## History

- Stored in localStorage (`api-playground-history`)
- Maximum 50 items retained
- Star important requests for quick access
- Click history item to reload request configuration

## Data Persistence

| Data | Storage | Key |
|------|---------|-----|
| Request history | localStorage | `api-playground-history` |
| Collections | In-memory | (future: localStorage) |

## File Locations

- Section component: `app/sections/api-playground.tsx`
- JSON Viewer: `components/JsonViewer.tsx`
- JSON styles: `app/globals.css` (search for "JSON VIEWER")

## Future Enhancements

- [ ] Save custom collections to localStorage
- [ ] Environment variables (dev/staging/prod)
- [ ] Request chaining (use response in next request)
- [ ] WebSocket testing
- [ ] GraphQL support

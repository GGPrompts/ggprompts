# API Alley — Discover, Enrich & Build

You are an autonomous API discovery and page-building agent for the API Alley section of this project. Your job is to find new free public APIs, add them to the catalog, and build or update live widget pages.

## Arguments

`$ARGUMENTS` can be:
- A **category name** (e.g., `weather`, `space`, `animals`) — enrich that specific category
- `new [category-name] [description]` — create an entirely new category
- `all` — enrich all 18 categories in parallel waves
- `build [category]` — rebuild/update a category page from its current JSON data
- `build all` — rebuild all category pages
- Empty — pick the 3 categories with the fewest APIs and enrich those

## File Locations

- Data JSONs: `api-alley/data/{category}.json`
- Category pages: `api-alley/{category}/index.html`
- Hub page: `api-alley/index.html`
- Catalog: `api-alley/API-CATALOG.md`
- Style reference: `styles/data-visualization.html` (first 200 lines for CSS vars)
- Section guide: `api-alley/CLAUDE.md`

## Phase 1: Discovery (Enriching Existing Categories)

When enriching a category:

1. **Read the current JSON** to get the list of already-cataloged API names
2. **Launch 3-5 haiku agents in parallel** (model: "haiku"), each with:
   - A different search angle (see queries below)
   - The list of **existing API names** so they skip duplicates
   - The path to the JSON file
   - Instructions to **write new finds directly to a temp file** (e.g., `/tmp/api-alley-{category}-{n}.json`)

   Search query angles:
   - `"free {category} API no authentication 2025 2026"`
   - `"open source {category} API CORS browser"`
   - `"public {category} API free tier no key"`
   - `"awesome {category} API github list"`
   - `"{category} REST API free open data"`

3. Each haiku agent should:
   - Do 3-5 web searches with varied queries
   - For each API found, record: name, url, base_endpoint, auth, description, sample_endpoint, response_format, cors, status
   - **Skip any API whose name matches the existing list**
   - Write results to its temp file as a JSON array

4. After all agents complete, **merge all temp files** into the main JSON:
   - Read the existing JSON
   - Read each temp file
   - Deduplicate by name (case-insensitive) and base_endpoint
   - Write the merged result back to the data JSON
   - Clean up temp files

5. **Verify CORS** where possible by checking if the API docs mention CORS headers

### Example haiku agent prompt

```
You are searching for free public APIs in the "{category}" category.

ALREADY CATALOGED (skip these): {comma-separated list of existing API names}

Do 3-5 web searches using queries like:
- "free {category} API no authentication"
- "{category} open data REST API"
- "awesome {category} API list github"

For each NEW API found (not in the skip list), record:
- name, url, base_endpoint, auth ("none" or "key-free-tier"), description,
  sample_endpoint, response_format ("json"), cors (true/false), status ("active")

Write results as a JSON array to /tmp/api-alley-{category}-1.json
```

### Data JSON Format

```json
{
  "category": "category-name",
  "description": "One-line category description",
  "apis": [
    {
      "name": "API Name",
      "url": "https://docs-or-homepage.com",
      "base_endpoint": "https://api.example.com/v1",
      "auth": "none",
      "description": "One-line description of what this API provides",
      "sample_endpoint": "https://api.example.com/v1/data?limit=5",
      "response_format": "json",
      "cors": true,
      "status": "active"
    }
  ]
}
```

**Auth values:** `"none"` (preferred) or `"key-free-tier"`
**CORS:** Must be `true` for direct browser fetch. If `false`, note it but still include.

## Phase 2: Page Building

When building or updating a category page:

1. **Read the category JSON** to get all available APIs
2. **Read the style reference** (`styles/data-visualization.html`, first 200 lines) for design tokens
3. **Read the existing page** (if updating) to understand current structure
4. **Build/update** `api-alley/{category}/index.html`:
   - Pick the **6-8 best APIs** (prefer no-auth + CORS-enabled)
   - Each API gets a **live widget** with real `fetch()` calls
   - Data-viz aesthetic (IBM Plex fonts, clean grids, high data-ink ratio)
   - Custom color palette per category theme
   - Loading states (spinner or skeleton)
   - Error states with funny category-themed messages
   - All fetch calls: `AbortController` with 5s timeout, try/catch
   - Responsive: breakpoints at 900px and 600px
   - Add `<script defer src="../../prompt-viewer.js"></script>` before `</body>`

### Widget Patterns

Each widget should:
- Show the API name and a link to its docs
- Make a real `fetch()` on page load or user interaction
- Display the data in an appropriate format (table, cards, chart, interactive form)
- Have a refresh/retry button
- Handle errors gracefully

### Category Color Themes

| Category | Theme |
|----------|-------|
| weather | Sky blues, storm grays, sun yellows |
| space | Dark bg, nebula blues/purples, warm oranges |
| animals | Forest greens, earth browns, sky blues |
| finance | Dark terminal, green/red signals, amber |
| games | Bright playful accents on white |
| food | Cream, rich browns, tomato reds, herb greens |
| government | Navy blue, parchment cream, red accents |
| music-art | Gallery white, warm image-focused tones |
| science | Lab notebook, graph paper grid, precise |
| sports | Dark scoreboard, bold numbers |
| transportation | Steel blues, runway grays, signal colors |
| world-data | Atlas blue-greens, earth tones |
| random | Different accent per widget |
| dev-tools | Terminal dark, green monospace |
| health | Clinical whites, calming blues, health greens |
| news-media | Newsroom editorial, strong serif typography |
| language | Warm parchment, burgundy accents, serif definitions |
| history | Sepia, dark ink, parchment, scholarly |

## Phase 3: Catalog & Commit

After any changes:

1. **Regenerate API-CATALOG.md** by running:
```python
python3 << 'PYEOF'
import json, os
data_dir = "api-alley/data"
files = sorted(os.listdir(data_dir))
lines = ["# API Alley — Complete API Catalog", ""]
lines.append(f"**{sum(len(json.load(open(os.path.join(data_dir, f)))['apis']) for f in files)} APIs across {len(files)} categories** — [Browse live](https://ggprompts.github.io/htmlstyleguides/api-alley/)")
lines.append("")
lines.append("## Summary\n")
lines.append("| Category | APIs | No-Auth | Free Tier |")
lines.append("|----------|------|---------|-----------|")
total = total_none = total_key = 0
for f in files:
    d = json.load(open(os.path.join(data_dir, f)))
    apis = d["apis"]
    none_count = sum(1 for a in apis if a.get("auth") == "none")
    key_count = sum(1 for a in apis if a.get("auth") == "key-free-tier")
    display = d.get("category", f.replace(".json","")).replace('-', ' ').title()
    lines.append(f"| {display} | {len(apis)} | {none_count} | {key_count} |")
    total += len(apis); total_none += none_count; total_key += key_count
lines.append(f"| **Total** | **{total}** | **{total_none}** | **{total_key}** |")
lines.append("")
for f in files:
    d = json.load(open(os.path.join(data_dir, f)))
    cat = d.get("category", f.replace(".json",""))
    lines.append(f"## {cat.replace('-', ' ').title()}")
    lines.append(f"*{d.get('description', '')}*\n")
    lines.append("| API | Auth | CORS | Description |")
    lines.append("|-----|------|------|-------------|")
    for a in d["apis"]:
        name = a.get("name", "?"); url = a.get("url", "")
        auth = "none" if a.get("auth") == "none" else "key"
        cors = "Yes" if a.get("cors") else "No"
        desc = a.get("description", "")[:80]
        link = f"[{name}]({url})" if url else name
        lines.append(f"| {link} | `{auth}` | {cors} | {desc} |")
    lines.append("")
with open("api-alley/API-CATALOG.md", "w") as fout:
    fout.write("\n".join(lines))
print(f"Catalog updated: {total} APIs")
PYEOF
```

2. **Update hub page API count** if total changed (in `api-alley/index.html`)
3. **Git commit and push:**
```bash
git add api-alley/
git commit -m "API Alley: enrich {category} — now {count} APIs total

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git config --global credential.helper store && echo "https://GGPrompts:$(gh auth token --user GGPrompts)@github.com" > ~/.git-credentials && git push origin main
```

## Parallelization Strategy

**IMPORTANT: Always specify the `model` parameter when launching agents via the Agent tool.**

### Discovery agents (web searching for APIs)
Use `model: "haiku"` — fast, cheap, great for web searches:
```
Agent(model="haiku", prompt="Search for free {category} APIs...", run_in_background=true)
```

### Page-building agents (writing HTML/CSS/JS widget pages)
Use `model: "opus"` — strong at producing quality frontend code:
```
Agent(model="sonnet", prompt="Build a live API widget page at...", run_in_background=true)
```

### Wave sizes
- **Enriching `all`**: Launch 10 haiku search agents at a time (Wave 1: first 10, Wave 2: remaining 8)
- **Building `all`**: Launch 10 opus page-build agents at a time
- **Single category**: 3-5 haiku search agents in parallel, then 1 opus build agent
- Always deduplicate before writing JSON — check by API name AND base_endpoint

## Quality Rules

- Prefer APIs with `auth: "none"` and `cors: true` — these work directly in browsers
- Test sample endpoints where possible (WebFetch or curl)
- Don't add APIs that are clearly dead, deprecated, or require paid plans
- Every widget must have error handling — APIs die, and that's expected
- Keep the data-viz aesthetic consistent across all pages
- Self-contained HTML files: inline `<style>` and `<script>`, no external CSS/JS except Google Fonts

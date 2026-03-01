# The AI Dispatch — Daily AI News

A daily AI news publication styled as a classic broadsheet newspaper. Each edition is a self-contained HTML page using the newspaper design system from `styles/newspaper.html`.

## Structure

```
news/
├── CLAUDE.md           # This file
├── index.html          # Archive hub page (reverse-chronological list)
└── YYYY-MM-DD/         # One folder per edition
    └── index.html      # That day's edition (self-contained HTML)
```

## How It Works

Run `/news` to generate today's edition. The skill:
1. Researches current AI news via WebSearch (4 parallel agents)
2. Deduplicates against the last 3 editions
3. Editorially plans the layout (Claude decides which sections to use)
4. Builds a self-contained HTML page with inlined newspaper CSS
5. Updates the archive hub and pushes to GitHub

## Edition Conventions

- **Self-contained**: Each edition is a single `.html` file with all CSS inlined
- **No JavaScript**: Pure static HTML/CSS
- **Newspaper CSS**: Adapted from `styles/newspaper.html` (Playfair Display, Libre Baskerville, PT Sans Narrow)
- **Source attribution**: Every story links to its source — never fabricate URLs
- **External links**: Always `target="_blank" rel="noopener"`
- **Responsive**: Mobile breakpoints from the newspaper style guide
- **Masthead**: "THE AI DISPATCH" with date, volume, and issue number
- **Volume**: 1 (increment yearly)
- **Issue number**: Sequential count of all editions

## Editorial Freedom

Unlike rigid templates, Claude decides which newspaper components to use based on the day's news:

| Component | Class | Usage |
|-----------|-------|-------|
| Lead story | `.card-lead` | 1-2 per edition, biggest stories |
| Column story | `.card-column` | 3-6 per edition, standard coverage |
| Brief | `.card-brief` | 2-5 per edition, quick hits |
| Feature box | `.card-feature` | 0-2, in-depth pieces |
| Pull quote | `.pull-quote` | 0-2, notable quotes |
| Data table | `.data-table` | 0-1, benchmarks or comparisons |
| Breaking alert | `.alert-breaking` | Only for genuinely breaking news |
| Column layouts | `.cols-2`, `.cols-3` | As appropriate for content |

**Only constants:** masthead with date, at least one lead story, source attribution, footer with archive link.

## Hub Page (`index.html`)

The archive page lists all editions reverse-chronologically. Each entry has:
- Date
- Lead headline
- Brief summary
- Link to the edition

New entries are added at the top of the `#archive-list` element by the `/news` skill.

## File Naming

- Editions: `news/YYYY-MM-DD/index.html`
- Hub: `news/index.html`
- No other files needed — everything is inlined

## Deduplication

The skill reads the 3 most recent editions and extracts headlines and source URLs. Stories matching recent coverage are dropped before editorial planning.

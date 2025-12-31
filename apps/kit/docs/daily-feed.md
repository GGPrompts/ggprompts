# Daily Feed Section

Aggregated content feed from multiple tech/dev sources.

## API Endpoints

```
GET /api/feed                           # All sources (~100 items)
GET /api/feed?sources=hackernews,reddit # Specific sources
GET /api/feed?subreddits=rust,golang    # Custom subreddits
```

## Content Sources

| Source | API | Items | Notes |
|--------|-----|-------|-------|
| Hacker News | Firebase API | ~30 | Top stories |
| GitHub | Search API | ~10 | Trending repos (last 7 days) |
| Reddit | JSON endpoints | ~25 | 5 subreddits × 5 items |
| Lobsters | hottest.json | ~20 | Computing-focused |
| Dev.to | Public API | ~15 | Top articles |

### Default Subreddits
- r/commandline
- r/ClaudeAI
- r/ClaudeCode
- r/cli
- r/tui

## Features

- **Sort options**: Trending (HN-style algorithm), Newest, Top Rated
- **Multi-select filtering**: Click source buttons to filter by multiple sources
- **Save items**: Bookmark items for later (persists in localStorage)
- **Hide items**: Remove items from feed (can be cleared)
- **Custom subreddits**: Add/remove subreddits via settings popover
- **Source toggle**: Enable/disable content sources
- **15-minute caching**: Server-side + client-side caching

## Data Caching (TanStack Query)

Query key: `["feed", enabledSources, subreddits]`

- **Stale time**: 15 minutes (matches server cache)
- **Cache time**: 30 minutes

Data persists across tab navigation. See [state-management.md](state-management.md) for details.

## Feed Item Schema

```typescript
interface FeedItem {
  id: string
  title: string
  url: string
  source: "hackernews" | "github" | "reddit" | "lobsters" | "devto"
  author?: string
  score: number
  commentCount?: number
  commentsUrl?: string
  createdAt: string
  subreddit?: string      // Reddit only
  tags?: string[]         // Lobsters, Dev.to, GitHub
  description?: string    // GitHub repos
}
```

## Sort Algorithm (Trending)

Uses HN-style gravity decay:
```typescript
trendingScore = score / Math.pow(hoursAgo + 2, 1.8)
```

## Preferences (localStorage)

Key: `daily-feed-preferences`

```typescript
{
  enabledSources: string[]      // Which sources to fetch
  subreddits: string[]          // Custom subreddit list
  savedItems: string[]          // Bookmarked item IDs
  hiddenItems: string[]         // Hidden item IDs
  savedItemsData: FeedItem[]    // Full data for saved items
  sortBy: "trending" | "newest" | "top"
}
```

## File Locations

- Section component: `app/sections/daily-feed.tsx`
- API route: `app/api/feed/route.ts`
- Types: `app/api/feed/types.ts`
- Fetchers: `app/api/feed/fetchers/`
  - `hackernews.ts`
  - `github.ts`
  - `reddit.ts`
  - `lobsters.ts`
  - `devto.ts`

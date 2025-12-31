# State Management

This project uses a hybrid approach to state management, separating server state from client state.

## Architecture

| State Type | Solution | Purpose |
|------------|----------|---------|
| Server State | TanStack Query | API data (weather, feed) with caching |
| Client State | localStorage | User preferences (saved items, unit prefs) |
| UI State | React useState | Temporary UI state (search, modals) |

## TanStack Query

Used for all API data fetching with built-in caching and refetching.

### Configuration

Provider: `components/QueryProvider.tsx`

```typescript
// Default options
{
  staleTime: 5 * 60 * 1000,   // Data fresh for 5 minutes
  gcTime: 30 * 60 * 1000,     // Cache kept for 30 minutes
  retry: 1,                    // Retry failed requests once
  refetchOnWindowFocus: false, // Don't refetch on tab focus
}
```

### Weather Query

Key: `["weather", latitude, longitude, tempUnit]`

- **Stale time**: 5 minutes
- **Auto-refetch**: Every 5 minutes when "Live" mode is on
- **Enabled**: After geolocation is resolved

### Feed Query

Key: `["feed", enabledSources, subreddits]`

- **Stale time**: 15 minutes (matches server cache)
- **Enabled**: After preferences loaded from localStorage

## localStorage Keys

### Weather Preferences
- `weather-temp-unit`: `"fahrenheit"` | `"celsius"`
- `weather-location`: `{ latitude, longitude, name }` - persisted location for instant loading

### Feed Preferences
Key: `daily-feed-preferences`

```typescript
{
  enabledSources: FeedSource[]    // Which sources to fetch
  subreddits: string[]            // Custom subreddit list
  savedItems: string[]            // Bookmarked item IDs
  hiddenItems: string[]           // Hidden item IDs
  savedItemsData: FeedItem[]      // Full data for saved items
  sortBy: "trending" | "newest" | "top"
}
```

## Benefits

1. **Caching**: Data persists across tab navigation without refetching
2. **Deduplication**: Multiple components can use same query key
3. **Background refetch**: Data stays fresh automatically
4. **Loading states**: Built-in isLoading, error handling
5. **Optimistic updates**: Possible for user actions

## File Locations

- Query provider: `components/QueryProvider.tsx`
- Weather queries: `app/sections/weather.tsx`
- Feed queries: `app/sections/daily-feed.tsx`

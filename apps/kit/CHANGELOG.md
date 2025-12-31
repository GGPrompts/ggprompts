# Changelog

Record of completed features and changes.

## 2025-11-26

### Improved
- **State Management**: Added TanStack Query for API data caching
  - Weather data cached for 5 minutes, persists across tab switches
  - Feed data cached for 15 minutes (matches server cache)
  - Auto-refetch when "Live" mode enabled
  - No more unnecessary API calls when navigating between sections

### Documentation
- Added `docs/state-management.md` for state architecture

---

## 2024-11-26

### Added
- **Home Section**: Dashboard overview with live weather/feed stats, clickable cards
- **Weather Section**: Full weather dashboard
  - Geolocation with fallback
  - Temperature unit toggle (°F/°C)
  - Live weather data from Open-Meteo
  - Weather alerts from NWS API
  - Hourly and 7-day forecasts
  - Air quality index
  - Animated weather radar from RainViewer
  - Historical comparison
- **Daily Feed Section**: Aggregated content feed
  - 5 sources: Hacker News, GitHub, Reddit, Lobsters, Dev.to
  - Sort options (Trending, Newest, Top)
  - Multi-select source filtering
  - Save/hide items
  - Custom subreddits
  - 15-minute server-side caching
- **Theme System**: 4 themes (Terminal, Amber, Carbon, Light)
- **Background Options**: gradient, mesh, textured, minimal, none
- **Mobile Support**: Sheet drawer navigation

### Infrastructure
- Next.js 15 with App Router
- Tailwind CSS + shadcn/ui components
- Documentation reorganization (docs/ folder)

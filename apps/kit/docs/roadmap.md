# Roadmap

Future enhancements and planned features.

## Recently Completed

- **AI Workspace Multi-Provider** - Gemini + Codex CLI support, Claude agents dropdown, provider-specific settings
- **AI Workspace Settings Overhaul** - Editable quick prompts, simplified model names, empty system prompt default
- **Projects → AI Workspace Navigation** - "Chat with Claude" button properly passes project context
- **Integrations Page** - Central hub showing all connected services, API status, configuration links
- **World Clocks** - Multiple timezone display on Home page, configurable with popular timezones
- **Tasks / Quick Todo** - Simple task list with checkboxes, reordering, localStorage persistence, completion tracking
- **Section Visibility** - Toggle sections on/off in Settings, reorder with up/down buttons, persisted to localStorage
- **Paper Trading / Stocks Dashboard** - Real-time quotes, paper trading with $100k balance, portfolio tracking, watchlists
- **Search Hub** - Multi-engine search + AI chat + Image AI (7 search engines, 6 AI assistants, 7 image generators including Sora) with keyboard shortcuts
- **Bookmarks** - Folder-based organization, icon/list view toggle, search, GitHub sync, favicon auto-fetch
- **Sidebar Jump Links** - Sub-items now navigate to specific sections (scroll/switch tabs)
- **Weather Alert Badge** - Shows count in sidebar (green for 0, red for active alerts)
- **Quick Notes Improvements** - Default to View mode, anchor links work, code block spacing fixed, path input for new notes
- **Quick Notes** - GitHub-synced markdown editor with file browser, theme-aware preview, auto-save
- **GitHub Integration** - Settings panel for token/repo, auto-injection into API Playground
- **Markdown Preview Styles** - Theme-aware rendering with `.md-*` CSS classes
- **API Playground** - HTTP request builder with collections, history, JSON viewer
- **Accordion Sidebar** - Expandable sections with contextual sub-items
- **10 Themes** - Terminal, Amber, Carbon, Light, Ocean, Sunset, Forest, Midnight, Neon, Slate
- **JsonViewer Component** - Theme-aware syntax highlighting with collapsible nodes

## In Progress

(none currently)

## Up Next (Low Effort)

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Quote of the Day** | Motivational quotes API | Low |
| **Dynamic Weather Theme** | Auto-switch theme/background based on local weather conditions | Low-Medium |
| **Keyboard Shortcuts** | Global hotkeys for navigation (g w → Weather, / → Search) | Medium |

## Planned Sections

### System Status / Uptime Monitor
Monitor personal services:
- Check if portfolio/sites are up
- Visual status indicators
- Response time tracking
- Alerts when something goes down
- **Complexity**: Medium

### AI Chat Widget ✅ COMPLETED
See AI Workspace section - supports Claude, Gemini, Codex CLIs + Docker models.

### Data Viz / Personal Analytics
Visualize personal data:
- GitHub contribution stats
- Custom metrics tracking
- Charts with Recharts
- **Complexity**: Medium

### Calendar / Agenda View
Show upcoming events:
- Today's schedule at a glance
- Google Calendar API integration
- Countdown to important dates
- **Complexity**: Medium (OAuth)

### Gmail / Email Widget
Quick email overview from homepage:
- Unread count and inbox summary
- Recent important emails list
- Quick actions (archive, mark read)
- Storage usage indicator
- Gmail API integration (reuse Google OAuth from Calendar)
- **Complexity**: Medium (OAuth already needed for Calendar)

## Ideas / Backlog

- PWA support for mobile installation
- Keyboard shortcuts system (global hotkeys)
- Custom widgets API (user-defined sections)
- WebSocket connections for real-time data
- Sync settings across devices
- Bookmarks import/export (Chrome format)
- Bookmarks keyboard shortcuts

## Reference Templates

These templates from `~/projects/portfolio-style-guides/app/templates/` can be adapted:

| Template | Use For |
|----------|---------|
| `kanban-board` | Tasks with drag-and-drop |
| `chat-helpbot` | AI Chat Widget |
| `uptime-monitor` | System Status |
| `analytics-dashboard` | Data Viz |
| `docs-hub` | Bookmarks search |
| `form-builder` | Quick Notes editor |

---

*Move completed items to CHANGELOG.md*

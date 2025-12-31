# Projects Dashboard - Implementation Plan

## Status

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1: Core Infrastructure | ✅ Complete | API routes, types, basic table |
| Phase 2: Main Dashboard View | ✅ Complete | TanStack Table, filters, actions |
| Phase 3: Project Detail View | ✅ Complete | Route, tabs, overview, commands, kanban, links |
| Phase 4: Data Persistence | ✅ Complete | Sync repo, pinned projects, migration |

### What's Been Built (Phase 1 & 2)

**API Routes:**
- `GET /api/projects/github` - Fetches all GitHub repos with pagination (up to 1000 repos)
- `GET /api/projects/local` - Scans `~/projects/` for local projects with git info

**Types & Helpers (`lib/projects.ts`):**
- `GitHubRepo`, `LocalProject`, `Project` interfaces
- `mergeProjects()` - Merges by matching git remote URL to GitHub html_url
- `detectTechStack()` - Detects Node.js, Go, Rust, Python, TypeScript, Next.js, Vite, Docker
- Status badge helpers

**Dashboard Section (`app/sections/projects-dashboard.tsx`):**
- TanStack Table with sortable columns: Name, Branch, Tech, Stars, Issues, Updated
- Filters: Global search, status dropdown (All/Cloned/Remote/Local/Modified/Archived), tech multi-select
- Status badges: Cloned (both), Remote (GitHub only), Local (local only), Private, Archived
- Git status: Branch name, clean/dirty/untracked status, ahead/behind counts
- Actions: Open Terminal, Open VS Code, Open Folder, Open GitHub
- Loading skeletons and error handling

**Integration:**
- Added to `useSectionPreferences` hook
- Added to sidebar navigation with FolderGit2 icon
- Added to SectionSettings for visibility toggle
- Added Projects card to Home dashboard

### What's Been Built (Phase 3)

**Project Detail Route (`app/projects/[slug]/page.tsx`):**
- Dynamic route for individual project pages
- Fetches and merges GitHub + local data
- Tabbed interface with 4 tabs

**Layout (`app/projects/layout.tsx`):**
- Back navigation to dashboard
- Consistent header styling

**Components:**
- `ProjectOverview.tsx` - Project info, stats, status badges, quick actions
- `ProjectCommands.tsx` - npm scripts + custom commands, run/copy functionality
- `ProjectKanban.tsx` - 3-column drag-drop task board (todo/in-progress/done)
- `ProjectLinks.tsx` - Project bookmarks with type categories

**Storage:**
- Commands: `localStorage` key `project-commands-{slug}`
- Tasks: `localStorage` key `project-tasks-{slug}`
- Links: `localStorage` key `project-links-{slug}`

**Navigation:**
- Project name in table links to detail page
- Info icon button in actions column
- Back button returns to dashboard

### What's Been Built (Phase 4)

**API Route:**
- `GET/PUT /api/projects/meta` - Read/write projects-meta.json to sync repo

**Types (`lib/projects.ts`):**
- `ProjectTask`, `ProjectLink`, `ProjectCommand` - Shared types
- `ProjectMeta` - Per-project metadata (pinned, tasks, links, commands)
- `ProjectsMetaFile` - Full metadata file structure

**Hook (`hooks/useProjectMeta.ts`):**
- `useProjectMeta(slug)` - Project-specific metadata with CRUD operations
- `useAllProjectsMeta()` - Dashboard-level metadata for pinned status
- Optimistic updates for snappy UX
- localStorage fallback when not authenticated
- Migration from localStorage to sync repo

**Updated Components:**
- `ProjectKanban.tsx` - Uses sync hook, shows sync status, migration dialog
- `ProjectCommands.tsx` - Syncs custom commands (npm scripts still local)
- `ProjectLinks.tsx` - Syncs project links
- `projects-dashboard.tsx` - Pin/unpin button, pinned filter, pinned projects sorted to top

**Features:**
- Sync status indicator (cloud icon) on each tab
- Pin/unpin projects in dashboard (appear at top)
- "Pinned" status filter option
- Migration dialog prompts user to sync localStorage data

---

## Overview

A new section for personal-homepage that displays all projects in a sortable/filterable table, with individual project detail pages featuring kanban boards, links, and terminal commands.

**Key Design Decisions:**
- **Route-based details** - Full pages for project details (not drawer)
- **Hybrid data source** - GitHub repos + local projects, merged when they match
- **Multi-device support** - GitHub is source of truth, local paths are device-specific
- **Pinned projects** - Favorites pinned to top
- **Task storage** - JSON file in project folders (`.dashboard.json`) or localStorage

---

## Architecture: Hybrid Data Model

### Why Hybrid?
User works across multiple devices (desktop, laptop, Termux on phone). Need:
- Project metadata accessible everywhere (via GitHub)
- Local terminal actions only where project is cloned
- Device-specific path mappings

### Data Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub API                                │
│  - Fetch user's repositories                                     │
│  - Stars, issues, PRs, last updated                              │
│  - Sync repo for metadata (kanban, links, commands)              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Merged Project List                         │
│  - GitHub repos + local-only projects                            │
│  - Matched by git remote URL                                     │
│  - Local status shown when path available                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Device-Specific Storage                       │
│  - localStorage: local path mappings                             │
│  - localStorage: pinned projects                                 │
│  - Scanned from ~/projects/ on desktop                           │
└─────────────────────────────────────────────────────────────────┘
```

### Project States
| Scenario | Badge | Available Actions |
|----------|-------|-------------------|
| GitHub repo + local clone | `Cloned` | Terminal, VS Code, GitHub, View Details |
| GitHub repo, no local | `Remote` | GitHub, Clone, View Details |
| Local project, no GitHub | `Local` | Terminal, VS Code, View Details |
| Archived repo | `Archived` | GitHub, View Details |

---

## Phase 1: Core Infrastructure

### 1.1 API Route - GitHub Repos
**File:** `app/api/projects/github/route.ts`

Fetches all user repositories:
```typescript
interface GitHubRepo {
  id: number
  name: string
  full_name: string         // owner/repo
  description: string | null
  html_url: string
  clone_url: string
  ssh_url: string
  language: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  pushed_at: string
  created_at: string
  archived: boolean
  private: boolean
  default_branch: string
}
```

Uses existing OAuth token from `useAuth()`.

### 1.2 API Route - Local Project Scanner
**File:** `app/api/projects/local/route.ts`

Scans `~/projects/` directory and returns:
```typescript
interface LocalProject {
  name: string              // Folder name
  path: string              // Full path
  description?: string      // From package.json or README
  techStack: string[]       // Detected from files
  git: {
    branch: string
    remoteUrl?: string      // GitHub URL for matching
    status: 'clean' | 'dirty' | 'untracked'
    ahead: number
    behind: number
  } | null
  lastModified: string
  scripts?: string[]        // npm scripts if available
}
```

**Detection Logic:**
- `package.json` → Node.js project, extract name, description, scripts
- `go.mod` → Go project
- `Cargo.toml` → Rust project
- `pyproject.toml` / `requirements.txt` → Python project
- `.git/` → Git info via `git status --porcelain`, `git branch`, `git remote -v`

### 1.3 Merged Project Type
```typescript
interface Project {
  // Identity
  id: string                // GitHub repo id or local path hash
  name: string
  slug: string              // URL-safe identifier

  // Sources
  github?: GitHubRepo
  local?: LocalProject

  // Computed
  source: 'github' | 'local' | 'both'
  description: string
  techStack: string[]

  // User data (synced via GitHub)
  pinned: boolean
  tasks: ProjectTask[]
  links: ProjectLink[]
  commands: ProjectCommand[]
}
```

---

## Phase 2: Main Dashboard View

### 2.1 Section Component
**File:** `app/sections/projects-dashboard.tsx`

**Template Reference:** `my-portfolio/app/templates/project-technical/page.tsx` (lines 646-691 for table pattern)

**Features:**
- TanStack Table with columns:
  | Column | Source | Sortable | Filterable |
  |--------|--------|----------|------------|
  | Name | Local | ✓ | ✓ (search) |
  | Description | Local | - | - |
  | Branch | Git | ✓ | - |
  | Status | Git | ✓ | ✓ (dropdown) |
  | Tech | Detected | - | ✓ (multi-select) |
  | Stars | GitHub | ✓ | - |
  | Issues | GitHub | ✓ | - |
  | Updated | GitHub | ✓ | - |
  | Actions | - | - | - |

- **Filter Bar:**
  - Search input (name/description)
  - Tech stack toggle group (All, Node.js, Go, Rust, Python)
  - Status filter (All, Clean, Dirty)
  - Show archived toggle

- **Actions Column:**
  - Open Terminal (via TabzChrome)
  - Open in VS Code (`code .`)
  - Open GitHub (if remote exists)
  - View Details (opens drawer/page)

- **Toolbar:**
  - Refresh button
  - Column visibility toggle
  - View mode (table/cards) - future

### 2.2 Integration Points
- Add to `hooks/useSectionPreferences.ts` type definition
- Add to sidebar navigation in `app/page.tsx`
- Add to `SectionSettings.tsx` for visibility toggle

---

## Phase 3: Project Detail View

### 3.1 Detail Route
**File:** `app/projects/[slug]/page.tsx`

**Template Reference:** `my-portfolio/app/templates/project-case-study/page.tsx` (lines 245-579 for tabs pattern)

**Route:** `/projects/[slug]` where slug is `owner--repo-name` or `local--folder-name`

**Tabs:**

#### Overview Tab
- Project name, description, README preview
- Quick stats (stars, issues, last updated)
- Tech stack badges
- Quick action buttons (terminal, VS Code, GitHub)

#### Kanban Tab
- Simple 3-column board: Todo | In Progress | Done
- Tasks stored in localStorage per project: `projects-{slug}-tasks`
- Optional: Sync with GitHub Issues (future enhancement)

```typescript
interface ProjectTask {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  createdAt: string
  updatedAt: string
}
```

#### Links Tab
- Project-specific bookmarks (docs, deployed URL, Figma, etc.)
- Stored in localStorage: `projects-{slug}-links`
- Same structure as bookmarks but project-scoped

```typescript
interface ProjectLink {
  id: string
  name: string
  url: string
  icon?: string
  type: 'docs' | 'deploy' | 'design' | 'other'
}
```

#### Commands Tab
- Project-specific terminal shortcuts
- Pre-populated from package.json scripts
- Custom commands can be added
- Click to run via TabzChrome

```typescript
interface ProjectCommand {
  id: string
  name: string
  command: string
  description?: string
  category: 'dev' | 'build' | 'test' | 'deploy' | 'custom'
}
```

---

## Phase 4: Data Persistence

### 4.1 Storage Strategy

| Data | Storage | Sync |
|------|---------|------|
| GitHub repos | React Query cache (5 min) | Auto-refresh |
| Local projects | API scan, React Query (1 min) | On-demand |
| Local path mappings | localStorage | Device-specific |
| Pinned projects | Sync repo `projects-meta.json` | Cross-device |
| Kanban tasks | Sync repo `projects-meta.json` | Cross-device |
| Project links | Sync repo `projects-meta.json` | Cross-device |
| Custom commands | Sync repo `projects-meta.json` | Cross-device |

### 4.2 Sync Repo Structure
Store project metadata in user's configured sync repo (same as bookmarks/notes):

**File:** `projects-meta.json`
```json
{
  "projects": {
    "owner/repo-name": {
      "pinned": true,
      "tasks": [
        { "id": "1", "title": "Fix bug", "status": "todo", "createdAt": "..." }
      ],
      "links": [
        { "id": "1", "name": "Docs", "url": "https://...", "type": "docs" }
      ],
      "commands": [
        { "id": "1", "name": "Dev", "command": "npm run dev", "category": "dev" }
      ]
    }
  },
  "localPaths": {}  // NOT synced - device-specific, stays in localStorage
}
```

### 4.3 Alternative: Project Folder JSON
For local-only projects or if user prefers, can also store in project folder:

**File:** `.dashboard.json` in project root
```json
{
  "tasks": [...],
  "links": [...],
  "commands": [...]
}
```

This is useful for:
- Projects not on GitHub
- Keeping project config with the code
- Version controlling the dashboard config

---

## Component Dependencies

### From shadcn/ui (already installed):
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Card`, `CardHeader`, `CardContent`
- `Badge`
- `Button`
- `Input`
- `Drawer` or `Dialog`
- `DropdownMenu`
- `ToggleGroup`
- `ScrollArea`
- `Skeleton` (loading states)

### From TanStack (already installed):
- `@tanstack/react-table` - Sorting, filtering, pagination
- `@tanstack/react-query` - Data fetching, caching

### Existing Hooks:
- `useTerminalExtension` - Terminal spawning
- `useAuth` - GitHub OAuth token
- `useSectionPreferences` - Section visibility

---

## File Structure

```
app/
├── api/
│   └── projects/
│       ├── github/
│       │   └── route.ts          # ✅ Fetch GitHub repos
│       ├── local/
│       │   └── route.ts          # ✅ Scan local projects
│       └── meta/
│           └── route.ts          # ✅ Read/write projects-meta.json
├── projects/
│   ├── layout.tsx                # ✅ Back navigation layout
│   └── [slug]/
│       └── page.tsx              # ✅ Project detail page (route-based)
├── sections/
│   └── projects-dashboard.tsx    # ✅ Main dashboard section (table view)
components/
├── projects/
│   ├── ProjectKanban.tsx         # ✅ Kanban board component (synced)
│   ├── ProjectLinks.tsx          # ✅ Links management (synced)
│   ├── ProjectCommands.tsx       # ✅ Commands management (synced)
│   └── ProjectOverview.tsx       # ✅ Overview tab content
hooks/
└── useProjectMeta.ts             # ✅ Project metadata sync hook
lib/
└── projects.ts                   # ✅ Types, helpers, merge logic
```

---

## Implementation Order

### Phase 1 & 2: Core Infrastructure + Dashboard ✅
1. [x] Create `/api/projects/local/route.ts` - filesystem scanner
2. [x] Create `/api/projects/github/route.ts` - GitHub repos API
3. [x] Create `lib/projects.ts` - types and merge logic
4. [x] Create `projects-dashboard.tsx` section with TanStack Table
5. [x] Add to navigation and section preferences
6. [x] Implement sorting (name, stars, issues, updated)
7. [x] Add filtering (search, tech stack, status)
8. [x] Add action buttons (terminal, VS Code, Open Folder, GitHub)
9. [x] Style with glass morphism
10. [x] Fetch and display GitHub stats (stars, issues)
11. [x] Handle rate limiting gracefully
12. [x] Loading states and skeletons
13. [x] Error handling

### Phase 3: Detail View ✅
14. [x] Create `/app/projects/[slug]/page.tsx` route
15. [x] Implement Overview tab
16. [x] Implement Commands tab (pre-populate from package.json)
17. [x] Implement Kanban tab with drag-drop
18. [x] Implement Links tab

### Phase 4: Data Persistence ✅
19. [x] Create `/api/projects/meta/route.ts` for sync repo
20. [x] localStorage fallback for tasks/links
21. [x] Pinned projects functionality
22. [x] Cross-device sync via GitHub repo
23. [x] Migration from localStorage to sync repo
24. [x] Sync status indicators

### Polish (Pending)
25. [ ] Mobile responsive design improvements
26. [ ] Column visibility toggle
27. [ ] Documentation

---

## Decisions Made

1. **Route-based details** ✓
   - Full page for project details at `/projects/[slug]`
   - Table columns show quick info, route shows full details
   - Shareable URLs, browser back button

2. **Sync repo for metadata** ✓
   - Tasks, links, commands stored in `projects-meta.json` in sync repo
   - Works across devices (desktop, laptop, Termux)
   - Alternative: `.dashboard.json` in project folder for local-only

3. **Hybrid detection** ✓
   - GitHub API for remote repos
   - Local scan for ~/projects/
   - Auto-match by git remote URL
   - Manual path attachment for unmatched repos

4. **Pinned projects** ✓
   - Pin favorites to top of table
   - Stored in sync repo for cross-device access

## Future Enhancements

- GitHub Issues integration for kanban
- Clone repo directly from dashboard
- Project templates/scaffolding
- Activity feed (recent commits, PRs)

---

## Notes

- Reuse patterns from `bookmarks.tsx` for terminal integration
- Follow existing glass morphism styling
- Use CSS variables for theme compatibility
- Keep bundle size small - lazy load detail view

# Architecture

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: shadcn/ui components (44+ components in `components/ui/`)
- **Styling**: Tailwind CSS 4 with CSS variables for theming
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (OAuth + email/password)
- **Animations**: Framer Motion
- **Toasts**: Sonner
- **Fonts**: Inter (sans) + JetBrains Mono (mono)

## Directory Structure

```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Landing page
├── globals.css             # Theme definitions + utilities
├── auth/
│   ├── callback/route.ts   # OAuth callback handler
│   └── github-connect/     # GitHub OAuth for marketplace
├── claude-code/            # Claude Code Marketplace
│   ├── page.tsx            # Landing page with featured
│   ├── skills/             # Skills browse & detail
│   ├── commands/           # Commands browse & detail
│   ├── agents/             # Agents browse & detail
│   ├── toolkit/            # User's curated toolkit
│   ├── download-zip/       # ZIP download API route
│   ├── actions.ts          # Toolkit server actions
│   ├── review-actions.ts   # Reviews server actions
│   └── github-sync-actions.ts # GitHub sync actions
├── forums/
│   ├── page.tsx            # Forum list
│   └── [id]/page.tsx       # Forum post detail
├── login/page.tsx          # Sign in page
├── signup/page.tsx         # Registration page
├── profile/page.tsx        # User dashboard (protected)
├── prompts/page.tsx        # Prompt library
└── settings/page.tsx       # User settings (protected)

components/
├── ThemeProvider.tsx       # Theme context + useTheme hook
├── BackgroundProvider.tsx  # Background animation context
├── MasterBackground.tsx    # Animated gradient background
├── claude-code/            # Claude Code Marketplace components
│   ├── AddToToolkitButton.tsx
│   ├── CopyPromptButton.tsx
│   ├── DownloadZipButton.tsx
│   ├── ReviewForm.tsx
│   ├── ReviewsList.tsx
│   └── StarRating.tsx
├── github-sync/            # GitHub sync components
│   ├── SyncToGitHubButton.tsx
│   └── GitHubSyncSettings.tsx
├── forums/                 # Forum-specific components
│   ├── ForumPostCard.tsx
│   ├── CommentList.tsx
│   └── CommentForm.tsx
├── navigation/
│   └── Navigation.tsx      # Header with theme switcher
├── profile/                # Profile components
│   ├── ProfileHeader.tsx
│   ├── ProfileTabs.tsx
│   └── ProfileSettings.tsx
├── prompts/                # Prompt library components
│   ├── SearchBar.tsx
│   ├── CategoryFilter.tsx
│   ├── PromptGrid.tsx
│   ├── PromptCard.tsx
│   └── SendToTerminalButton.tsx  # Queue prompts to TabzChrome
└── ui/                     # shadcn/ui components (44+)

hooks/
├── index.ts                # Barrel export for all hooks
└── useTabzChrome.tsx       # TabzChrome integration (WebSocket + REST)

lib/
├── avatar.ts               # DiceBear + OAuth avatar system
├── types.ts                # TypeScript types for database
├── utils.ts                # cn() utility for classnames
├── auth/                   # Auth utilities (if any)
└── supabase/
    ├── client.ts           # Browser Supabase client
    └── server.ts           # Server Supabase client
```

## Route Protection

Protected routes check for authentication and redirect to `/login`:

```typescript
// Pattern used in protected pages
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  redirect('/login')  // or router.push('/login') in client components
}
```

Protected routes:
- `/profile` - User dashboard
- `/settings` - User settings
- `/claude-code/toolkit` - User's Claude Code toolkit

## Claude Code Marketplace

The Claude Code Marketplace allows users to browse, curate, and sync Claude Code plugins (skills, commands, agents, hooks, MCPs).

### Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   GGPrompts.com          →    GitHub Repo    →   Claude Code│
│   (Browse/Curate UI)          (Storage)          (Runtime)  │
│                                                             │
│   - Search/filter             - my-gg-plugins    - /plugin  │
│   - Categories                - .claude/skills/  - reads    │
│   - Ratings/reviews           - auto-synced        from repo│
│   - Toggle on/off                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Browse | Search/filter components by type/category | `/claude-code/[type]` pages |
| Toolkit | User's curated selection | `user_toolkit` table |
| GitHub Sync | Push toolkit to GitHub repo | GitHub OAuth + API |
| Copy Prompt | Generate install prompts | `CopyPromptButton.tsx` |
| Download ZIP | Download as .claude/ folder | `/claude-code/download-zip` |
| Ratings | Star ratings + reviews | `component_reviews` table |

### Component Types

- **Skills**: Specialized knowledge (e.g., Next.js, TDD, debugging)
- **Commands**: Slash commands (e.g., /handoff, /security-scan)
- **Agents**: Specialized personas (e.g., DevOps Engineer, Data Scientist)
- **Hooks**: Event hooks (e.g., PreToolUse security, notifications)
- **MCPs**: MCP server configurations

## Custom Hooks

### useTabzChrome

Integration with [TabzChrome](https://github.com/username/TabzChrome) for sending prompts directly to Claude Code.

```typescript
const { isAvailable, queueToChat } = useTabzChrome()

// Queue a prompt to the TabzChrome chat bar
await queueToChat("Implement user authentication")
```

**Methods:**
- `queueToChat(prompt)` - Sends prompt to chat bar via WebSocket (`QUEUE_COMMAND`). The prompt appears for review before submission.
- `spawnTerminal(options)` - Spawns a terminal session with optional command.
- `checkAvailability()` - Re-check if TabzChrome is running.

**How it works:** Uses WebSocket connection to `ws://localhost:8129` to queue prompts. Falls back to clipboard copy when TabzChrome isn't available.

## Data Flow

### Server Components (default)
- Pages like `/prompts`, `/forums` fetch data server-side
- Use `createClient` from `lib/supabase/server.ts`
- Data passed to client components as props

### Client Components
- Interactive pages like `/settings` use `'use client'`
- Use `createClient` from `lib/supabase/client.ts`
- Fetch data in `useEffect` or event handlers

## Provider Hierarchy

```tsx
// app/layout.tsx
<html data-theme={theme}>
  <body>
    <BackgroundProvider>
      <ThemeProvider>
        <MasterBackground />
        <Navigation />
        {children}
        <Toaster />
      </ThemeProvider>
    </BackgroundProvider>
  </body>
</html>
```

# Database

GGPrompts uses Supabase (PostgreSQL) as its database. This is the same database as the original GGPrompts project.

## Tables

### `users`

User profiles linked to Supabase Auth.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key (matches auth.users.id) |
| `email` | text | User's email |
| `username` | text | Unique username |
| `display_name` | text | Display name |
| `avatar_url` | text | Avatar URL (DiceBear or OAuth) |
| `bio` | text | User bio |
| `role` | text | User role (default: 'user') |
| `reputation` | int | Reputation score |
| `privacy_settings` | jsonb | Privacy preferences |
| `created_at` | timestamp | Account creation date |
| `updated_at` | timestamp | Last update |

### `prompts`

User-submitted AI prompts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `title` | text | Prompt title |
| `content` | text | Prompt content |
| `description` | text | Short description |
| `category` | text | Category slug |
| `tags` | text[] | Array of tags |
| `user_id` | uuid | Author (FK to users) |
| `username` | text | Author username (denormalized) |
| `like_count` | int | Number of likes |
| `usage_count` | int | Times used |
| `is_template` | bool | Has template fields |
| `template_fields` | jsonb | Template field definitions |
| `attribution_url` | text | Source URL |
| `attribution_text` | text | Attribution text |
| `created_at` | timestamp | Creation date |
| `updated_at` | timestamp | Last update |

### `posts` (Forum Posts)

Forum discussion posts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `title` | text | Post title |
| `content` | text | Post content |
| `user_id` | uuid | Author (FK to users) |
| `forum_id` | uuid | Forum category (optional) |
| `view_count` | int | View count |
| `created_at` | timestamp | Creation date |
| `updated_at` | timestamp | Last update |

### `comments` (Forum Comments)

Comments on forum posts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `content` | text | Comment content |
| `post_id` | uuid | Parent post (FK to posts) |
| `user_id` | uuid | Author (FK to users) |
| `parent_id` | uuid | Parent comment (for replies) |
| `is_deleted` | bool | Soft delete flag |
| `created_at` | timestamp | Creation date |
| `updated_at` | timestamp | Last update |

## Claude Code Marketplace Tables

### `components`

Claude Code plugins: skills, agents, hooks, mcps, commands.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `type` | text | Component type (skill, agent, hook, mcp, command) |
| `slug` | text | Unique URL slug |
| `name` | text | Display name |
| `description` | text | Short description |
| `category` | text | Category slug (FK to component_categories) |
| `tags` | text[] | Array of tags |
| `files` | jsonb | Array of {path, content} objects |
| `author_id` | uuid | Author (FK to users) |
| `author_name` | text | Author display name |
| `source_url` | text | Original source URL |
| `version` | text | Semantic version |
| `license` | text | License (default: MIT) |
| `downloads` | int | Download/add count |
| `rating` | numeric | Average rating (1-5) |
| `rating_count` | int | Number of ratings |
| `is_official` | bool | Official Anthropic component |
| `is_featured` | bool | Featured on homepage |
| `is_verified` | bool | Verified by moderators |
| `created_at` | timestamp | Creation date |
| `updated_at` | timestamp | Last update |

### `component_categories`

Categories for organizing Claude Code components.

| Column | Type | Description |
|--------|------|-------------|
| `slug` | text | Primary key (e.g., 'web-development') |
| `name` | text | Display name |
| `description` | text | Category description |
| `icon` | text | Lucide icon name |
| `component_type` | text | Limit to specific type (optional) |
| `sort_order` | int | Display order |

**Categories**: web-development, ui-design, terminal, ai-ml, integrations, meta, debugging, thinking, workflow, analysis, prompts, devops, database, testing, security, documentation, mobile, api-development, code-review, data-science

### `user_toolkit`

User-selected components for their Claude Code setup.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | User (FK to users) |
| `component_id` | uuid | Component (FK to components) |
| `enabled` | bool | Currently enabled |
| `is_forked` | bool | Always true (legacy column, kept for compatibility) |
| `added_at` | timestamp | When added to toolkit |

> **Note**: The `is_forked` column is always set to `true`. Previously this distinguished between "synced" (linked to GGPrompts source) and "forked" (user's copy) items. As of Phase 7.1, all toolkit items are the user's own copy.

### `user_github_sync`

GitHub repo sync settings for Claude Code plugins.

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | uuid | Primary key (FK to users) |
| `repo_name` | text | Repository name (default: my-gg-plugins) |
| `repo_full_name` | text | Full repo name (e.g., username/repo) |
| `is_private` | bool | Private repository |
| `last_synced_at` | timestamp | Last sync time |
| `sync_status` | text | Status: synced, pending, error |
| `sync_error` | text | Error message if failed |
| `github_token_encrypted` | text | Encrypted GitHub token |

### `component_reviews`

User ratings and reviews for Claude Code components.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `component_id` | uuid | Component (FK to components) |
| `user_id` | uuid | Reviewer (FK to users) |
| `rating` | int | Rating 1-5 |
| `review` | text | Review text (optional) |
| `created_at` | timestamp | Review date |
| `updated_at` | timestamp | Last update |

## Prompt Categories

Prompt categories stored in the `category` field:

- `development-code` - Development & Code
- `creative-marketing` - Creative & Marketing
- `productivity-workflow` - Productivity & Workflow
- `business-strategy` - Business & Strategy
- `learning-education` - Learning & Education
- `writing-content` - Writing & Content
- `agents` - Agents (Claude Code agents, AI personas)
- `data-analysis` - Data Analysis
- `research-discovery` - Research & Discovery

## TypeScript Types

Located in `lib/types.ts`:

```typescript
interface User {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  created_at: string
}

interface Prompt {
  id: string
  title: string
  content: string
  description: string | null
  category: string | null
  tags: string[] | null
  user_id: string | null
  username: string | null
  like_count: number
  usage_count: number
  // ... see lib/types.ts for full definition
}

interface ForumPost {
  id: string
  title: string
  content: string
  user_id: string
  users?: User | null  // Joined user data
  // ...
}

interface ForumComment {
  id: string
  content: string
  post_id: string
  user_id: string
  users?: User | null  // Joined user data
  // ...
}

// Claude Code Marketplace types
type ComponentType = 'skill' | 'agent' | 'hook' | 'mcp' | 'command'

interface Component {
  id: string
  type: ComponentType
  slug: string
  name: string
  description: string | null
  category: string | null
  tags: string[]
  files: { path: string; content: string }[]
  author_id: string | null
  author_name: string | null
  source_url: string | null
  version: string
  license: string | null
  downloads: number
  rating: number | null
  rating_count: number
  is_official: boolean
  is_featured: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

interface UserToolkit {
  id: string
  user_id: string
  component_id: string
  enabled: boolean
  is_forked: boolean  // Always true (legacy field)
  added_at: string
  component?: Component
}

interface UserGithubSync {
  user_id: string
  repo_name: string
  repo_full_name: string | null
  is_private: boolean
  last_synced_at: string | null
  sync_status: 'synced' | 'pending' | 'error' | null
  sync_error: string | null
}
```

## Common Queries

### Fetch prompts with filters

```typescript
let query = supabase
  .from('prompts')
  .select('*')
  .order('created_at', { ascending: false })

if (searchQuery) {
  query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
}

if (category) {
  query = query.ilike('category', category)
}
```

### Fetch forum posts with user data

```typescript
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    users (id, username, avatar_url)
  `)
  .order('created_at', { ascending: false })
```

### Update user profile

```typescript
await supabase
  .from('users')
  .update({
    display_name: displayName,
    username: username,
    bio: bio,
    avatar_url: avatarUrl,
    updated_at: new Date().toISOString()
  })
  .eq('id', user.id)
```

## Supabase Clients

### Server-side (RSC, API routes)

```typescript
import { createClient } from '@/lib/supabase/server'

// In an async server component or API route
const supabase = await createClient()
const { data } = await supabase.from('prompts').select('*')
```

### Client-side (React components)

```typescript
import { createClient } from '@/lib/supabase/client'

// In a client component
const supabase = createClient()
const { data } = await supabase.from('users').select('*')
```

## Security & Performance Audit (December 2025)

### Fixed Issues

#### Security: Function Search Path (FIXED)
All public functions now have `SET search_path = ''` to prevent search path manipulation attacks:
- `update_prompt_counts`
- `update_updated_at_column`
- `create_default_collections`
- `generate_share_token`

#### Performance: RLS InitPlan (FIXED)
All RLS policies now use `(select auth.uid())` instead of `auth.uid()` directly, preventing re-evaluation for each row. Affected tables:
- `users`, `prompt_likes`, `prompt_bookmarks`, `forum_members`
- `user_collections`, `user_prompts`, `user_library`
- `prompt_forks`, `collection_shares`

#### Performance: Duplicate Policies (FIXED)
Removed duplicate permissive policies that caused redundant evaluation:
- `prompt_bookmarks`: Consolidated 6 duplicate policies into 3
- `users`: Removed overly permissive `users_select_consolidated` policy

### Remaining Issues (Action Required)

#### Leaked Password Protection (Paid Feature)
**Status**: WARN - Pro plan required
**Note**: HaveIBeenPwned integration requires Supabase Pro plan. Acceptable risk for free tier.
**Link**: https://supabase.com/docs/guides/auth/password-security

#### Postgres Version Update
**Status**: WARN - Requires Supabase upgrade
**Current**: supabase-postgres-15.8.1.094
**Fix**: Upgrade via Supabase Dashboard → Settings → General → Upgrade
**Link**: https://supabase.com/docs/guides/platform/upgrading

### Acceptable Risks (INFO Level)

#### Unindexed Foreign Keys
Low-volume tables where index overhead outweighs benefits:
- `admin_notifications.admin_id_fkey`
- `collection_shares.shared_by_fkey`
- `pending_avatars.reviewed_by_fkey`, `user_id_fkey`
- `posts.last_reply_user_id_fkey`
- `prompt_discussions.user_id_fkey`
- `prompt_forks.approved_by_fkey`

#### Unused Indexes
Many indexes were created proactively but haven't been used yet. These can be removed if they remain unused after the app scales:
- Various indexes on `posts`, `comments`, `user_collections`, `user_prompts`, etc.
- Monitor via: `SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;`

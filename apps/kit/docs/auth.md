# Authentication

GitHub OAuth authentication via Supabase for Quick Notes and Bookmarks sync.

## Overview

- **Provider**: Supabase Auth with GitHub OAuth
- **Scope**: `repo` (for GitHub API access to sync notes/bookmarks)
- **Session**: Managed by Supabase, persisted in cookies

## Setup

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Configuration

1. Create project at [supabase.com](https://supabase.com)
2. Authentication → Providers → Enable GitHub
3. Create GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers)
4. Add redirect URLs in Supabase (Authentication → URL Configuration):
   - `http://localhost:3001/auth/callback`
   - `https://your-domain.vercel.app/auth/callback`

## Architecture

```
AuthProvider (components/AuthProvider.tsx)
├── useAuth() hook
│   ├── user: User | null
│   ├── session: Session | null
│   ├── loading: boolean
│   ├── isConfigured: boolean
│   ├── signInWithProvider(provider)
│   ├── signOut()
│   └── getGitHubToken(): Promise<string | null>
└── Wraps entire app in layout.tsx

AuthModal (components/AuthModal.tsx)
└── GitHub OAuth button, shown when user needs to sign in

Profile Section (app/sections/profile.tsx)
├── User info (avatar, name, email)
├── Connected services status
├── Sync status (Quick Notes, Bookmarks)
└── Repository settings
```

## Key Files

| File | Purpose |
|------|---------|
| `lib/supabase.ts` | Browser Supabase client |
| `lib/supabase-server.ts` | Server Supabase client |
| `components/AuthProvider.tsx` | Auth context + `useAuth()` hook |
| `components/AuthModal.tsx` | OAuth login modal |
| `app/auth/callback/route.ts` | OAuth callback handler |
| `app/sections/profile.tsx` | Profile section UI |

## Usage

### Check Auth State

```tsx
import { useAuth } from "@/components/AuthProvider"

function MyComponent() {
  const { user, loading, isConfigured } = useAuth()

  if (loading) return <Spinner />
  if (!isConfigured) return <SetupMessage />
  if (!user) return <SignInPrompt />

  return <AuthenticatedContent />
}
```

### Get GitHub Token for API Calls

```tsx
const { getGitHubToken } = useAuth()

const token = await getGitHubToken()
if (token) {
  // Use token for GitHub API calls
  const result = await getContents(token, repo, path)
}
```

### Sign In

```tsx
const { signInWithProvider } = useAuth()

<Button onClick={() => signInWithProvider("github")}>
  Sign in with GitHub
</Button>
```

## Features Using Auth

- **Quick Notes**: Uses OAuth token to sync markdown files with GitHub
- **Bookmarks**: Uses OAuth token to sync bookmarks.json with GitHub
- **Profile**: Shows user info, sync status, repository settings

## User Flow

1. User visits Quick Notes or Bookmarks → sees "Sign in with GitHub" prompt
2. Clicks sign in → redirected to GitHub OAuth
3. Authorizes app → redirected back to `/auth/callback`
4. Session created → user configures repository in Profile
5. Notes/Bookmarks sync automatically using OAuth token

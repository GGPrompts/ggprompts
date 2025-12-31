# GGPrompts Changelog

## December 6, 2025

### User Component Submission Flow
- Created `/claude-code/submit` page for submitting skills, commands, and agents
- New server action `submitComponent()` in `app/claude-code/actions.ts`
- Form component `components/claude-code/SubmitComponentForm.tsx` with:
  - Component type selector (skill, agent, command)
  - Name, description, category, content fields
  - Tag input (up to 5 tags)
  - Optional source URL
  - Client-side validation
- Added "Submit" button to marketplace hero section
- Auto-generated slugs with uniqueness check
- Author attribution from user profile

### Admin Component Review Dashboard
- Added `status` column to components table (pending, approved, rejected)
- Created `/admin/components` admin dashboard for reviewing submissions
- Server actions in `app/admin/components/actions.ts`:
  - `approveComponent()` - approve a pending component
  - `rejectComponent()` - reject a component
  - `deleteComponent()` - permanently delete a component
  - `toggleFeatured()` - toggle featured status
- Table view with status filters (All, Pending, Approved, Rejected) and type filters
- Action buttons: Approve, Reject, Feature, Delete, View
- Confirmation dialog for delete actions
- User submissions now have `status: 'pending'` by default
- Browse pages only show `status: 'approved'` components to public

### Bulk Content Moderation Tools
- Added checkbox selection column to admin components table
- Select-all header checkbox with indeterminate state support
- Bulk action toolbar appears when 1+ items selected (sticky positioning)
- New server actions in `app/admin/components/actions.ts`:
  - `bulkApproveComponents(ids[])` - approve multiple components
  - `bulkRejectComponents(ids[])` - reject multiple components
  - `bulkDeleteComponents(ids[])` - delete multiple with related records cleanup
- Toolbar shows: Approve, Reject, Delete buttons with selection count
- Confirmation dialog for bulk delete operations
- Loading states and toast feedback for all bulk actions
- Selection auto-clears after successful batch operation

### Auto-Sync from my-gg-plugins Repository
- Extracted sync logic into reusable `lib/sync-plugins.ts` module
- GitHub webhook endpoint at `/api/webhooks/github-sync`:
  - Verifies GitHub signature using `GITHUB_WEBHOOK_SECRET` env var
  - Only processes push events to main branch
  - Returns sync results (items synced, errors)
- Manual "Sync from GitHub" button on admin dashboard header
- Server action `triggerPluginSync()` for admin-only manual sync
- Simplified `/admin/sync-plugins` route to use shared function
- SyncButton component shows last sync time after successful sync

### Export Approved Components to GitHub
- Created `lib/export-to-github.ts` module for GitHub Contents API integration
- Exports approved user-submitted components (author_name != 'GGPrompts')
- Respects existing repo structure:
  - Skills: `skills/{slug}/SKILL.md`
  - Commands: `commands/{slug}.md`
  - Agents: `agents/{slug}.md`
- "Export to GitHub" button on admin dashboard with confirmation dialog
- Server action `triggerGitHubExport()` with admin verification
- Creates new files or updates existing ones (handles SHA for updates)
- Rate limiting with 500ms delay between API calls
- ExportButton shows last export count and time

### Official Components author_id
- Set `author_id` on all 20 official GGPrompts components
- Updated `lib/sync-plugins.ts` to include author_id in sync operations
- Enables simpler RLS policies using author_id instead of author_name

---

## December 5, 2025

### Forum Admin Moderation
- Added admin delete buttons for posts and comments
- Server actions in `app/forums/actions.ts` with admin verification
- Delete post button appears next to post title for admins
- Delete comment buttons on each comment for admins
- Soft delete for comments (marks as `[deleted]`)

### Claude Code Component Content Sync
- Created sync script: `scripts/sync-plugins-to-db.ts`
- Syncs content from `~/projects/my-gg-plugins` repo to database
- All skills, agents, and commands now show actual `.md` content in View modal
- GitHub source URLs set for all components
- 11 skills, 1 agent, 8 commands synced with full content

---

## Earlier (December 2025)

### Phase 1-4: Claude Code Marketplace Foundation
See [docs/CLAUDE_CODE_MARKETPLACE_PLAN.md](docs/CLAUDE_CODE_MARKETPLACE_PLAN.md) for details on:
- Database schema and RLS policies
- Browse pages with search/filter
- User toolkit with add/remove/toggle
- GitHub sync with OAuth
- Ratings and reviews system
- Copy Prompt and Download ZIP features

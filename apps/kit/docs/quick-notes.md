# Quick Notes

GitHub-synced markdown notes for your personal homepage. Edit files directly from your browser and sync with any GitHub repository (e.g., an Obsidian vault).

## Setup

### 1. Create a GitHub Personal Access Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens/new)
2. Create a new token (classic) with the `repo` scope
3. Copy the token (starts with `ghp_`)

### 2. Configure in Settings

1. Navigate to **Settings** section
2. Under **GitHub Integration**:
   - Paste your token in "Personal Access Token"
   - Enter repo path: `username/repo-name` (e.g., `myuser/ObsidianVault`)
3. Click **Test Connection** to verify

## Features

### File Browser

- Tree view of all files and folders
- Click folders to expand/collapse
- Only `.md` files are editable (other files are dimmed)
- Refresh button to reload file list
- Create new notes with the + button

### Markdown Editor

- Full-text editing with monospace font
- Auto-save with 2-second debounce (edits saved automatically)
- Manual save button (Ctrl+S not yet implemented)
- Character count in footer
- Last saved timestamp

### Preview Mode

Toggle between Edit and Preview modes with theme-aware markdown rendering.

**Supported Markdown:**

| Element | Syntax | Notes |
|---------|--------|-------|
| Headers | `# ## ### ####` | h1 has bottom border, h1/h2 have subtle glow |
| Bold | `**text**` or `__text__` | |
| Italic | `*text*` or `_text_` | Uses theme primary color |
| Bold+Italic | `***text***` | |
| Strikethrough | `~~text~~` | |
| Links | `[text](url)` | Opens in new tab, hover glow |
| Images | `![alt](url)` | Rounded corners with border |
| Inline code | `` `code` `` | Theme-aware background |
| Code blocks | ` ``` ` | Monospace with theme border |
| Blockquotes | `> quote` | Left border accent |
| Unordered lists | `- item` or `* item` | Bullets in primary color |
| Ordered lists | `1. item` | |
| Task lists | `- [ ]` / `- [x]` | Checkboxes with theme styling |
| Horizontal rules | `---` or `***` | Gradient fade effect |

**Theme Adaptations:**

- Dark themes get subtle glow effects on headers and links
- Light theme removes glows for clean look
- Carbon theme uses grayscale only
- Neon theme has extra glow effects
- Each theme has custom italic colors matching the palette

### Offline Support

- Recently viewed files are cached locally
- If GitHub is unreachable, cached version loads
- Cache stored in localStorage with prefix `github-notes-cache-`

## GitHub API

Uses the GitHub Contents API:

| Operation | Endpoint | Method |
|-----------|----------|--------|
| List directory | `/repos/{owner}/{repo}/contents/{path}` | GET |
| Get file | `/repos/{owner}/{repo}/contents/{path}` | GET |
| Create/Update file | `/repos/{owner}/{repo}/contents/{path}` | PUT |
| Delete file | `/repos/{owner}/{repo}/contents/{path}` | DELETE |

### Rate Limits

- Authenticated requests: 5,000/hour
- File size limit: 100MB (GitHub limit)
- Files are base64 encoded in transit

## Files

| File | Description |
|------|-------------|
| `lib/github.ts` | GitHub API helper functions |
| `app/sections/quick-notes.tsx` | Main section component |
| `app/page.tsx` (GitHubSettings) | Settings panel for token/repo |
| `app/globals.css` | Markdown preview styles (search "MARKDOWN PREVIEW") |

## localStorage Keys

| Key | Description |
|-----|-------------|
| `github-token` | GitHub Personal Access Token |
| `github-repo` | Repository path (`owner/repo`) |
| `github-notes-cache-{path}` | Cached file contents |

## Commit Messages

All changes create commits with message format:
- Create: `Create {filename} from homepage`
- Update: `Update {filename} from homepage`
- Delete: `Delete {filename} from homepage`

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid or expired token | Create new token in GitHub settings |
| 404 Not Found | Repo doesn't exist or no access | Check repo path and token permissions |
| 403 Forbidden | Rate limit or insufficient scope | Wait or create token with `repo` scope |
| 409 Conflict | SHA mismatch (file changed externally) | Refresh and re-edit |

## Navigation

Added to sidebar with sub-items:
- **Browse Files**: Main file browser view
- **Recent**: (Placeholder for future feature)

## Future Enhancements

- [ ] Recent files list from cache
- [ ] Search within files (grep)
- [ ] Create new folders
- [ ] Move/rename files
- [ ] Keyboard shortcuts (Ctrl+S, Ctrl+N)
- [ ] Split view (editor + preview side by side)
- [ ] Syntax highlighting in editor
- [ ] Image support (view images from repo)
- [ ] Conflict resolution UI

# Claude Jobs

Automated and on-demand AI prompts across multiple projects using Claude, Codex, or Gemini.

## Overview

Claude Jobs enables running prompts against multiple projects simultaneously using your choice of AI backend (Claude, OpenAI Codex, or Google Gemini). Features include event-driven triggers, smart pre-checks to avoid wasting tokens, and a results inbox. Results are stored locally with plans for GitHub sync.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Homepage UI   │────▶│  Next.js API    │────▶│  AI Backend     │
│   (trigger)     │     │  /api/jobs/run  │     │  (per project)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        │                                       ┌───────┼───────┐
        ▼                                       ▼       ▼       ▼
┌─────────────────┐                          Claude  Codex  Gemini
│   localStorage  │◀────────────────────────────────────┘
│   (jobs.json)   │
│   (results)     │
└─────────────────┘
```

## AI Backends

Jobs can run on any of three AI backends:

| Backend | CLI Command | Streaming | Notes |
|---------|-------------|-----------|-------|
| **Claude** | `claude --print --output-format stream-json` | Yes | Default, uses Claude Code CLI |
| **Codex** | `codex exec -m gpt-5 --sandbox read-only` | No | OpenAI Codex with high reasoning |
| **Gemini** | `gemini -p` | No | Google Gemini, free tier available |

Select the backend when creating a job. Each has different strengths:
- **Claude** - Best for code understanding and file operations
- **Codex** - Strong reasoning, good for complex debugging
- **Gemini** - Free tier, good for second opinions

## Data Model

### Job Definition

```typescript
type JobBackend = 'claude' | 'codex' | 'gemini'

interface Job {
  id: string
  name: string
  prompt: string                    // The prompt to send to the AI
  projectPaths: string[]            // Local project paths to run against
  trigger: JobTrigger
  backend: JobBackend               // Which AI to use (default: 'claude')
  preCheck?: PreCheck               // Optional cheap check before running AI

  // Execution state
  lastRun?: Date
  lastSkipped?: Date                // When pre-check caused skip
  lastResultUrl?: string            // GitHub Issue URL
  status?: 'idle' | 'running' | 'needs-human' | 'error'
}

type JobTrigger =
  | 'manual'                        // Click to run
  | 'on-login'                      // When app opens after being away
  | 'on-device-change'              // New IP/device detected
  | 'before-first-prompt'           // Before first chat message of session

interface PreCheck {
  command: string                   // Shell command to run (no Claude)
  skipIf: 'empty' | 'non-empty' | 'matches'
  pattern?: string                  // Regex for 'matches' mode
}
```

### Job Run Result

```typescript
interface JobRun {
  jobId: string
  startedAt: Date
  completedAt?: Date
  projects: ProjectRunResult[]
  githubIssueUrl?: string
}

interface ProjectRunResult {
  path: string
  name: string
  preCheckSkipped: boolean          // True if pre-check caused skip
  output?: string                   // Claude's response
  error?: string
  needsHuman: boolean               // Claude flagged for intervention
}
```

## Storage

### Current Implementation (localStorage)

Jobs and results are stored in browser localStorage:

```
localStorage:
├── claude-jobs          # Job definitions (JSON array)
└── job-results          # Job run results (JSON array)
```

Managed via:
- `lib/jobs/storage.ts` - Job CRUD operations
- `hooks/useJobResults.ts` - Results with reactive updates

### Future: GitHub Sync

Planned migration to GitHub for cross-device sync:

```
~/.homepage-data/  (or configured GitHub repo)
├── notes/
├── bookmarks/
└── jobs/
    ├── jobs.json           # Job definitions
    └── results/            # Job results (optional)
```

## Pre-Check Examples

### Git Sync Check

Skip if no local changes AND no upstream changes:

```typescript
preCheck: {
  command: "git fetch && git status --porcelain && git log HEAD..@{u} --oneline",
  skipIf: 'empty'
}
```

### Dependency Check

Skip if lockfile unchanged since last run:

```typescript
preCheck: {
  command: "git diff HEAD~1 --name-only | grep -E 'package-lock|yarn.lock|Cargo.lock'",
  skipIf: 'empty'
}
```

### Always Run

Omit `preCheck` to always run the Claude prompt.

## UI Components

### 1. Jobs List (New Section)

Location: `app/sections/jobs.tsx`

```
┌─────────────────────────────────────────────────────────────┐
│ Jobs                                              [+ New]   │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔄 Sync All Projects                           [▶ Run]  │ │
│ │    3 projects • on-login • Last: 2h ago ✓              │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⚠️ Security Audit                             [▶ Run]  │ │
│ │    5 projects • manual • Last: 3d ago (needs-human)    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

Features:
- List all jobs with status
- Manual run button
- Click to expand: prompt, projects, run history
- Badge on nav item when `needs-human` jobs exist

### 2. Batch Prompt from Projects Table

Add to: `app/sections/projects-dashboard.tsx`

```
┌──┬────────────────┬────────┬───────────────────────────────┐
│☑ │ personal-site  │ main ● │ ...                           │
│☑ │ api-server     │ main ✓ │ ...                           │
│☐ │ mobile-app     │ dev  ● │ ...                           │
└──┴────────────────┴────────┴───────────────────────────────┘
         │
         │ [Batch Prompt] button in header (when items selected)
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Send prompt to 2 projects                              [X]  │
├─────────────────────────────────────────────────────────────┤
│ Prompt:                                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Sync with remote, summarize changes                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ☐ Save as job for later                                     │
│   Name: [________________________]                          │
│   Trigger: [on-login ▼]                                     │
│   Pre-check: [git status ▼]                                 │
│                                                             │
│                                    [Cancel] [Run Now]       │
└─────────────────────────────────────────────────────────────┘
```

### 3. On-Login Runner

Modal that appears when login-triggered jobs exist:

```
┌─────────────────────────────────────────────────────────────┐
│ Welcome back!                                          [X]  │
├─────────────────────────────────────────────────────────────┤
│ Running startup jobs...                                     │
│                                                             │
│ ✓ Sync All Projects                                         │
│   └─ 3/3 projects clean (skipped - no changes)             │
│                                                             │
│ ◐ Code Review                                               │
│   └─ Running on personal-site...                           │
│                                                             │
│                           [View Details] [Skip Remaining]   │
└─────────────────────────────────────────────────────────────┘
```

### 4. Needs-Human Notification

Badge on Jobs nav item + notification panel:

```
┌─────────────────────────────────────────────────────────────┐
│ 🔔 Claude needs your attention                              │
├─────────────────────────────────────────────────────────────┤
│ Security Audit found issues in api-server                   │
│ 3 days ago                                                  │
│                                      [View Issue] [Dismiss] │
└─────────────────────────────────────────────────────────────┘
```

## API Routes

### POST /api/jobs/run

Run a job (or ad-hoc prompt) against projects.

```typescript
// Request
{
  jobId?: string              // Run existing job
  // OR ad-hoc:
  prompt: string
  projectPaths: string[]
  preCheck?: PreCheck
}

// Response (SSE stream)
data: { type: 'pre-check', project: string, skipped: boolean }
data: { type: 'start', project: string }
data: { type: 'content', project: string, text: string }
data: { type: 'complete', project: string, needsHuman: boolean }
data: { type: 'done', githubIssueUrl: string }
```

### GET /api/jobs

List all jobs with current status.

### POST /api/jobs

Create or update a job definition.

### GET /api/jobs/needs-human

Fetch GitHub Issues with `needs-human` label for notifications.

## Implementation Phases

### Phase 1: Core Infrastructure ✅

1. ✅ Job data model and storage (`lib/jobs/types.ts`, `lib/jobs/storage.ts`)
2. ✅ `/api/jobs/run` endpoint with pre-check support and parallel execution
3. ✅ `/api/jobs` endpoint for CRUD operations
4. ✅ localStorage-based storage (GitHub sync deferred)

### Phase 2: UI Components ✅

1. ✅ Jobs section with list view (`app/sections/jobs.tsx`)
2. ✅ Job creation/edit modal
3. ✅ Running job progress modal with streaming output
4. ✅ Checkbox column in projects table
5. ✅ Batch prompt modal with "Save as job" option

### Phase 3: Results & Triggers ✅

1. ✅ Results storage and types (`hooks/useJobResults.ts`)
2. ✅ Results Inbox UI with list and detail views
3. ✅ On-login trigger detection (`hooks/useLoginTrigger.ts`)
4. ✅ Startup jobs modal (`components/StartupJobsModal.tsx`)
5. ✅ Needs-human badge on Jobs nav item

### Phase 4: Future Enhancements (Planned)

1. GitHub sync for jobs and results
2. Prompt templates library
3. Device change detection
4. GitHub Issues integration for results

## Example Jobs

### Git Sync

```json
{
  "name": "Sync All Projects",
  "prompt": "Run git fetch, check for upstream changes. If there are changes, summarize them. If there are conflicts with local changes, create a GitHub issue labeled 'needs-human' with details. Otherwise just report status.",
  "projectPaths": ["/home/user/projects/site", "/home/user/projects/api"],
  "trigger": "on-login",
  "preCheck": {
    "command": "git fetch && git status --porcelain && git log HEAD..@{u} --oneline",
    "skipIf": "empty"
  }
}
```

### Dependency Audit

```json
{
  "name": "Security Audit",
  "prompt": "Run npm audit or equivalent. Summarize any high/critical vulnerabilities. If any are found, create a GitHub issue labeled 'needs-human'.",
  "projectPaths": ["/home/user/projects/site"],
  "trigger": "manual"
}
```

### Code Review

```json
{
  "name": "Weekly Review",
  "prompt": "Review commits from the past week. Note any code smells, potential bugs, or improvements. Be concise.",
  "projectPaths": ["/home/user/projects/site"],
  "trigger": "manual",
  "preCheck": {
    "command": "git log --since='7 days ago' --oneline",
    "skipIf": "empty"
  }
}
```

## Parallel Execution

To avoid overwhelming the system when running against many projects, jobs execute with a configurable concurrency limit:

```typescript
interface JobConfig {
  maxParallel: number  // Default: 3, max concurrent claude processes
}
```

Execution flow:
```
Projects: [A, B, C, D, E] with maxParallel: 3

Time 0:  [A running] [B running] [C running] [D queued] [E queued]
Time 1:  [A done ✓]  [B running] [C running] [D starting] [E queued]
Time 2:  [A done ✓]  [B done ✓]  [C running] [D running] [E starting]
...
```

Results stream to the UI as each project completes, so you see progress incrementally.

## Results Inbox

A dedicated feed for browsing all job outputs, not just `needs-human` notifications.

### Inbox UI

```
┌─────────────────────────────────────────────────────────────┐
│ Results Inbox                          [Filter ▼] [Mark Read]│
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ● Sync All Projects                        2 hours ago  │ │
│ │   3/3 projects synced • No changes                      │ │
│ │   [View Full Report]                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⚠ Security Audit                           3 days ago   │ │
│ │   Found 2 high vulnerabilities in api-server            │ │
│ │   [View Full Report] [View GitHub Issue]                │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ● Code Review                              5 days ago   │ │
│ │   Reviewed 12 commits across 2 projects                 │ │
│ │   [View Full Report]                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Expanded Report View

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Inbox                                             │
│                                                             │
│ Security Audit                                              │
│ Ran 3 days ago • 5 projects • 2 issues found               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ## api-server ⚠️                                            │
│                                                             │
│ Found 2 high-severity vulnerabilities:                      │
│                                                             │
│ 1. **lodash** (4.17.20) - Prototype pollution               │
│    Recommendation: Upgrade to 4.17.21                       │
│                                                             │
│ 2. **express** (4.17.1) - Open redirect                     │
│    Recommendation: Upgrade to 4.18.0+                       │
│                                                             │
│ ## personal-site ✓                                          │
│                                                             │
│ No vulnerabilities found. All dependencies up to date.      │
│                                                             │
│ ## mobile-app ✓                                             │
│                                                             │
│ No vulnerabilities found.                                   │
│                                                             │
│                              [Open GitHub Issue] [Re-run]   │
└─────────────────────────────────────────────────────────────┘
```

### Storage

Results stored in GitHub (same repo as job definitions):

```
~/.homepage-data/
└── jobs/
    ├── jobs.json           # Job definitions
    └── results/
        ├── 2024-01-15-sync-all.md
        ├── 2024-01-12-security-audit.md
        └── ...
```

Older results can link to GitHub Issues for archival, with local storage for recent results (faster access).

## Prompt Templates

A library of reusable, well-structured prompt templates inspired by community patterns.

### Template Structure

```typescript
interface PromptTemplate {
  id: string
  name: string
  category: TemplateCategory
  description: string

  // The prompt with optional variables
  prompt: string
  variables?: TemplateVariable[]

  // Suggested configuration
  suggestedPreCheck?: PreCheck
  suggestedTrigger?: JobTrigger

  // Metadata
  author?: string
  tags?: string[]
}

interface TemplateVariable {
  name: string           // e.g., "branch"
  description: string    // e.g., "Target branch to compare against"
  default?: string       // e.g., "main"
  required: boolean
}

type TemplateCategory =
  | 'git-ops'           // Sync, merge, branch management
  | 'code-quality'      // Reviews, audits, linting
  | 'security'          // Vulnerability scans, dependency checks
  | 'documentation'     // README updates, changelog generation
  | 'maintenance'       // Cleanup, dependency updates
  | 'content'           // News updates, content generation
  | 'custom'            // User-created templates
```

### Built-in Templates

#### Git Operations

```markdown
### Git Sync

**Category:** git-ops
**Trigger:** on-login
**Pre-check:** `git fetch && git status --porcelain && git log HEAD..@{u} --oneline`

**Prompt:**
Check the git status of this project:
1. Fetch latest changes from origin
2. Compare local branch with remote
3. If there are upstream changes, summarize what changed
4. If there are local uncommitted changes, list them
5. If there would be merge conflicts, create a GitHub issue labeled 'needs-human' with:
   - The conflicting files
   - A suggested resolution approach
   - Do NOT attempt to resolve automatically

Output format:
- **Status:** Clean | Has Changes | Conflicts
- **Summary:** Brief description of state
```

#### Code Quality

```markdown
### Code Review

**Category:** code-quality
**Trigger:** manual
**Pre-check:** `git log --since='{{days}} days ago' --oneline`

**Variables:**
- `days` (default: 7) - How many days back to review

**Prompt:**
Review commits from the past {{days}} days in this project:

## Context
- Focus on code quality, not feature correctness
- Be concise - flag issues, don't lecture

## Review Checklist
- [ ] Security issues (hardcoded secrets, SQL injection, XSS)
- [ ] Performance concerns (N+1 queries, unnecessary re-renders)
- [ ] Error handling gaps
- [ ] Code duplication
- [ ] Naming clarity
- [ ] Missing tests for critical paths

## Output Format
### Summary
One paragraph overall assessment.

### Issues Found
1. **[Severity]** File:line - Description
   Suggestion: How to fix

### Positive Notes
Brief mention of good patterns observed.

If critical issues found, create GitHub issue labeled 'needs-human'.
```

#### Security

```markdown
### Dependency Audit

**Category:** security
**Trigger:** manual
**Pre-check:** `git diff HEAD~10 --name-only | grep -E 'package.*json|Cargo|go\.(mod|sum)|requirements'`

**Prompt:**
Audit dependencies for security vulnerabilities:

1. Run the appropriate audit command:
   - Node.js: `npm audit` or `yarn audit`
   - Python: `pip-audit` or `safety check`
   - Rust: `cargo audit`
   - Go: `govulncheck ./...`

2. For each HIGH or CRITICAL vulnerability:
   - Package name and version
   - CVE if available
   - Description of the risk
   - Recommended fix (upgrade version or alternative)

3. If any HIGH/CRITICAL found, create GitHub issue labeled 'needs-human' with full details.

4. For MODERATE/LOW, just summarize count.

## Output Format
**Status:** ✅ Clean | ⚠️ X issues found

**Critical/High:**
(list each with details)

**Summary:**
- X critical, Y high, Z moderate, W low
- Recommended action: [upgrade/review/none needed]
```

#### Documentation

```markdown
### Changelog Generator

**Category:** documentation
**Trigger:** manual
**Pre-check:** `git log --since='{{since}}' --oneline | head -1`

**Variables:**
- `since` (default: "last month") - Time range for changelog

**Prompt:**
Generate a changelog entry for commits since {{since}}:

1. Group commits by type:
   - **Added** - New features
   - **Changed** - Changes to existing functionality
   - **Fixed** - Bug fixes
   - **Security** - Security patches
   - **Deprecated** - Soon-to-be removed features
   - **Removed** - Removed features

2. Write user-facing descriptions (not commit messages)
3. Link to relevant PRs/issues if referenced in commits
4. Follow Keep a Changelog format

## Output Format
## [Unreleased] - {{date}}

### Added
- Feature description (#PR)

### Fixed
- Bug fix description (#PR)

(etc.)
```

#### Maintenance

```markdown
### Dead Code Finder

**Category:** maintenance
**Trigger:** manual

**Prompt:**
Scan this project for potentially dead code:

1. **Unused exports** - Exported functions/components not imported elsewhere
2. **Unused dependencies** - Packages in package.json not imported in code
3. **Commented code** - Large blocks of commented-out code
4. **Unused variables** - Defined but never used
5. **Orphan files** - Files not imported by anything

Focus on high-confidence findings. Don't flag:
- Test utilities
- Public API exports
- Config files
- Type definitions that might be used externally

## Output Format
### High Confidence (Safe to Remove)
- `path/to/file.ts` - Reason

### Review Recommended
- `path/to/file.ts` - Reason (might be used by X)

### Statistics
- X unused exports
- Y unused dependencies
- Z orphan files
```

### Template UI

```
┌─────────────────────────────────────────────────────────────┐
│ New Job                                                [X]  │
├─────────────────────────────────────────────────────────────┤
│ Template: [Select a template ▼]                             │
│           ┌─────────────────────────────────────────────┐   │
│           │ 📁 Git Operations                           │   │
│           │    Git Sync                                 │   │
│           │    Branch Cleanup                           │   │
│           │ 📁 Code Quality                             │   │
│           │    Code Review                              │   │
│           │    Mobile Audit                             │   │
│           │ 📁 Security                                 │   │
│           │    Dependency Audit                         │   │
│           │    Secret Scanner                           │   │
│           │ 📁 Documentation                            │   │
│           │    Changelog Generator                      │   │
│           │    README Updater                           │   │
│           │ ─────────────────────                       │   │
│           │ + Create Custom Template                    │   │
│           └─────────────────────────────────────────────┘   │
│                                                             │
│ [Template selected: Code Review]                            │
│                                                             │
│ Variables:                                                  │
│ Days to review: [7_____]                                    │
│                                                             │
│ Projects: [Select projects...]                              │
│                                                             │
│ Trigger: [manual ▼]                                         │
│                                                             │
│ Pre-check: ☑ Use suggested (git log --since='7 days'...)   │
│                                                             │
│                                    [Cancel] [Create Job]    │
└─────────────────────────────────────────────────────────────┘
```

### Custom Templates

Users can create and save their own templates:

```
~/.homepage-data/
└── jobs/
    ├── jobs.json
    ├── results/
    └── templates/
        └── custom-templates.json
```

Or contribute back to a shared `claude-job-templates` repo for community use.

## Open Questions

1. **Job editing UI** - Inline edit or separate form?
2. **Template variables** - Simple `{{var}}` replacement or more powerful templating?
3. **Error retry** - Auto-retry failed projects?
4. **Result retention** - How long to keep local results before archiving to GitHub?

## Related Docs

- [AI Workspace](./ai-workspace.md) - Chat interface
- [Navigation](./navigation.md) - Adding the Jobs section
- [State Management](./state-management.md) - Data flow patterns

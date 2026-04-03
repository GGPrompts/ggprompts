# Agent Instructions

This repo contains many self-contained HTML pages and small assets. Use **ggbd** (beads) when it adds real value, not as a hard requirement.

## When To Use ggbd

Use ggbd for:
- Multi-step work that spans sessions
- Changes that touch shared/global assets (site-wide CSS, shared JS, indexes like `music/audio-tracker/songs/index.json`)
- Bugs/features with follow-ups, QA notes, or dependencies

Skip ggbd for:
- Single, contained pages or one-off assets that are unlikely to need follow-up

## Quick Reference

```bash
ggbd ready              # Find available work
ggbd show <id>          # View issue details
ggbd update <id> --status in_progress  # Claim work
ggbd close <id>         # Complete work
# Supabase auto-syncs (no manual sync needed)
```

## Landing The Plane (When Shipping)

Only do this workflow when you (the user) ask to land changes (commit/push), or when we're finishing a change that should clearly be published.

Workflow:

1. File ggbd issues for follow-ups (only if needed)
2. Run relevant quality gates (tests/linters/build) if applicable
3. Update/close ggbd issue(s) if used
4. Publish:
   ```bash
   git pull --rebase
   # Supabase auto-syncs (no manual sync needed)
   git push
   git status  # should show "up to date with origin"
   ```
5. Hand off: brief context for next session

If we are not shipping in this session, it's fine to stop without committing/pushing. In that case, leave a clear handoff summary (what changed, where, and what remains).

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->

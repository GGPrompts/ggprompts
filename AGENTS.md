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

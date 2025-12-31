# GGPrompts Development Plan

For completed work, see [CHANGELOG.md](CHANGELOG.md).

## Current Status

The Claude Code Marketplace is feature-complete with:
- User submission flow with admin review
- Bulk moderation tools
- Bidirectional GitHub sync (auto-sync from repo, export to repo)
- Full content display in View modals

## Environment Variables (Production)

| Variable | Purpose | Status |
|----------|---------|--------|
| `GITHUB_WEBHOOK_SECRET` | Verify GitHub webhook signatures | Configured |
| `GITHUB_EXPORT_TOKEN` | PAT with `repo` scope for export | Configured |

## GitHub Webhook Setup

The webhook syncs official content from `GGPrompts/my-gg-plugins` on push:

1. Go to repo Settings > Webhooks > Add webhook
2. Payload URL: `https://ggprompts-next.vercel.app/api/webhooks/github-sync`
3. Content type: `application/json`
4. Secret: Value of `GITHUB_WEBHOOK_SECRET` env var
5. Events: Just the push event

## Next Steps

### Content Population: Hooks & MCPs

Populate the new Hooks and MCPs sections with quality content from official and community sources.

#### Phase 1: Research & Discovery

**Hooks Sources**
- [ ] Anthropic official docs - search for hook examples in Claude Code documentation
- [ ] Claude Code GitHub repo - look for example hooks in `/examples` or `/hooks`
- [ ] Community examples - search GitHub for "claude code hooks"

**MCP Sources**
- [ ] [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) - curated community list
- [ ] [Docker MCP Toolkit](https://github.com/docker/mcp-toolkit) - meta-MCP with 200+ servers
- [ ] [Anthropic MCP servers](https://github.com/anthropics/mcp-servers) - official reference implementations
- [ ] [modelcontextprotocol.io](https://modelcontextprotocol.io) - official MCP docs and examples

#### Phase 2: Curation Criteria

For each component, evaluate:
- **Quality**: Well-documented, maintained, working code
- **Usefulness**: Solves real problems, broad appeal
- **Safety**: No security concerns, respects permissions
- **Uniqueness**: Not duplicating existing marketplace content

#### Phase 3: Content Creation

**Hooks to add:**
- [ ] Pre-commit validation hook (lint/format before commits)
- [ ] Post-tool logging hook (audit trail)
- [ ] Notification hook (Slack/Discord alerts)
- [ ] Permission guard hook (block dangerous operations)
- [ ] Cost tracking hook (token usage monitoring)

**MCPs to add:**
- [ ] Docker MCP Toolkit (featured - gateway to 200+ MCPs)
- [ ] Filesystem MCP (official Anthropic)
- [ ] GitHub MCP (official Anthropic)
- [ ] PostgreSQL/database MCPs
- [ ] Browser automation MCP
- [ ] Memory/knowledge graph MCP
- [ ] Slack/Discord integration MCPs

#### Phase 4: Integration

- [ ] Create database entries with proper metadata
- [ ] Link mcp-manager agent to Docker MCP Toolkit
- [ ] Add "Recommended Pairing" badges (e.g., mcp-manager + docker-mcp)
- [ ] Feature Docker MCP Toolkit on marketplace landing page

---

### Possible Future Improvements
- [ ] Scheduled auto-sync (cron job as backup to webhook)
- [ ] Email notifications for submission status changes
- [ ] Component versioning and update history
- [ ] User analytics dashboard
- [ ] Featured components rotation

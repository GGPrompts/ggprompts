# Seed Marketplace from News Digests

Review and add MCPs, hooks, and skills discovered in daily news digests to the GGPrompts Claude Code marketplace.

## Step 1: Scan News Data

Read the news JSON files to extract potential marketplace items:

```bash
ls -la lib/news/data/2025-*.json | tail -10
```

Then read the most recent 7 days of news files (or specify a date range).

Extract from each file:
- `newMcpServers[]` - MCP server discoveries
- `notableHooks[]` - Hook examples and patterns
- `trendingSkills[]` - Skills from SkillsMP and community

## Step 2: Check for Duplicates

Query the database to find which items already exist:

```typescript
// Check by source_url OR by name+type combination
const existing = await supabase
  .from('components')
  .select('source_url, name, type')
  .in('source_url', extractedSourceUrls)
```

## Step 3: Present Items for Review

Use AskUserQuestion to show discovered items grouped by type:

**Question: "Which items would you like to add to the marketplace?"**

Options (multi-select):
- Add all new MCPs (X items)
- Add all new Hooks (X items)
- Add all new Skills (X items)
- Pick individually
- Skip - don't add anything

If "Pick individually" selected, show each item with:
- Name and description
- Source/attribution
- Option to include or skip

## Step 4: Generate Content

For each selected item, generate a proper setup guide prompt.

### MCP Server Template

```markdown
# {name} - {short_description}

## What it does
{detailed_description}

## Quick Setup (Docker MCP Toolkit)
If you have Docker MCP toolkit installed:
```
mcp-add {server-name}
```

## Manual Plugin Setup
Add to your plugin's `.mcp.json`:
```json
{
  "mcpServers": {
    "{server-name}": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "mcp/{server-name}"],
      "env": {}
    }
  }
}
```

## Configuration
{list any required config, secrets, env vars from the MCP catalog data}

## Example Usage
Once enabled, try asking Claude:
{2-3 example prompts based on the server's purpose}

---
*Source: {source_url}*
*Added from GGPrompts Daily News Digest*
```

### Hook Template

```markdown
# {name}

## What it does
{description}

## Hook Type
`{type}` - {explanation of when this hook fires}

## Configuration
Add to your plugin's `hooks/hooks.json` or `~/.claude/settings.json`:

```json
{
  "hooks": {
    "{type}": [
      {
        "matcher": "{matcher_pattern}",
        "hooks": [
          {
            "type": "command",
            "command": "{command}"
          }
        ]
      }
    ]
  }
}
```

## When to Use
{practical use cases}

## Customization
{how to adapt this hook for different needs}

---
*Source: {source_url}*
*Credit: {author_name}*
```

### Skill Template

```markdown
# {name}

## What it does
{description}

## Installation
Add to your plugin's `skills/{slug}/SKILL.md`:

```markdown
---
name: {slug}
description: {description}
---

{skill_content_if_available}
```

## When Claude Uses This
{triggers and use cases}

## Category
{category}

---
*Source: {marketplace_url}*
*Credit: SkillsMP*
```

## Step 5: Insert to Database

For each item, insert into the `components` table:

```typescript
await supabase.from('components').insert({
  type: 'mcp' | 'hook' | 'skill',
  slug: generateSlug(name),
  name: name,
  description: shortDescription,
  category: mapToCategory(item.category),
  tags: extractTags(item),
  files: [{
    path: getFilePath(type), // 'README.md' for MCPs, 'hooks.json' for hooks, 'SKILL.md' for skills
    content: generatedContent
  }],
  author_id: null, // Community-sourced
  author_name: item.authorName || 'Community',
  source_url: item.sourceUrl,
  version: '1.0.0',
  license: 'MIT',
  downloads: 0,
  rating: null,
  rating_count: 0,
  is_official: false,
  is_featured: false,
  is_verified: false,
  status: 'approved' // Pre-approved since editorially curated
})
```

## Step 6: Summary

After insertion, display:
- Number of items added by type
- Links to view them in the marketplace
- Any items that failed (with reasons)

## Category Mapping

Map news categories to component_categories:

| News Category | Component Category |
|---------------|-------------------|
| Database | database |
| Testing | testing |
| Security | security |
| DevOps | devops |
| Research | documentation |
| Communication | integrations |
| Workflow | workflow |
| Meta | meta |
| Git | devops |

## Important Notes

1. **Don't duplicate** - Always check source_url and name+type before inserting
2. **Credit creators** - Use author_name from the news data (e.g., "Docker MCP Catalog", "GitButler", "SkillsMP")
3. **Quality content** - Generate helpful setup guides, not just raw configs
4. **Approved status** - These are editorially curated, so auto-approve
5. **Revalidate paths** - After inserting, revalidate `/claude-code/mcps`, `/claude-code/hooks`, `/claude-code/skills`

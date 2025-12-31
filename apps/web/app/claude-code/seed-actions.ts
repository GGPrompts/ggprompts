'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ComponentType } from '@/lib/types'

// Types for news data structures
interface NewsMcpServer {
  id: string
  name: string
  description: string
  category: string
  installCommand: string
  sourceUrl: string
}

interface NewsHook {
  id: string
  name: string
  type: string
  description: string
  sourceUrl: string
}

interface NewsSkill {
  id: string
  name: string
  description: string
  category: string
  stars: number
  sourceUrl: string
  marketplaceUrl: string
}

export interface SeedComponentData {
  type: ComponentType
  name: string
  description: string
  category: string
  content: string
  authorName: string
  sourceUrl: string
  tags?: string[]
}

export interface SeedResult {
  success: boolean
  inserted: number
  skipped: number
  errors: string[]
}

// Category mapping from news categories to component categories
const CATEGORY_MAP: Record<string, string> = {
  'Database': 'database',
  'database': 'database',
  'Testing': 'testing',
  'testing': 'testing',
  'Security': 'security',
  'security': 'security',
  'DevOps': 'devops',
  'devops': 'devops',
  'Research': 'documentation',
  'research': 'documentation',
  'Communication': 'integrations',
  'communication': 'integrations',
  'Workflow': 'workflow',
  'workflow': 'workflow',
  'Meta': 'meta',
  'meta': 'meta',
  'Git': 'devops',
  'git': 'devops',
  'Backend': 'api-development',
  'backend': 'api-development',
  'AI': 'ai-ml',
  'ai': 'ai-ml',
  'Data Extraction': 'data-science',
  'Social': 'integrations',
}

function mapCategory(newsCategory: string): string {
  return CATEGORY_MAP[newsCategory] || 'integrations'
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function getFilePath(type: ComponentType): string {
  switch (type) {
    case 'mcp':
      return 'README.md'
    case 'hook':
      return 'hooks.json'
    case 'skill':
      return 'SKILL.md'
    case 'command':
      return 'command.md'
    case 'agent':
      return 'agent.md'
    default:
      return 'README.md'
  }
}

/**
 * Check which source URLs already exist in the database
 */
export async function checkExistingComponents(sourceUrls: string[]): Promise<Set<string>> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('components')
    .select('source_url')
    .in('source_url', sourceUrls)

  return new Set(data?.map(c => c.source_url).filter(Boolean) || [])
}

/**
 * Check which name+type combinations already exist
 */
export async function checkExistingByNameType(
  items: Array<{ name: string; type: ComponentType }>
): Promise<Set<string>> {
  const supabase = await createClient()

  // Query for each type separately
  const types = [...new Set(items.map(i => i.type))]
  const existing = new Set<string>()

  for (const type of types) {
    const names = items.filter(i => i.type === type).map(i => i.name.toLowerCase())
    const { data } = await supabase
      .from('components')
      .select('name, type')
      .eq('type', type)
      .in('name', names)

    data?.forEach(c => {
      existing.add(`${c.type}:${c.name.toLowerCase()}`)
    })
  }

  return existing
}

/**
 * Generate setup guide content for an MCP server
 */
export function generateMcpContent(mcp: NewsMcpServer): string {
  const serverName = mcp.name.replace('-mcp-server', '').replace('-mcp', '').replace('mcp-', '')

  return `# ${mcp.name}

## What it does
${mcp.description}

## Quick Setup (Docker MCP Toolkit)
If you have Docker MCP toolkit installed:
\`\`\`bash
${mcp.installCommand}
\`\`\`

## Manual Plugin Setup
Add to your plugin's \`.mcp.json\`:
\`\`\`json
{
  "mcpServers": {
    "${serverName}": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "mcp/${serverName}"],
      "env": {}
    }
  }
}
\`\`\`

## Example Usage
Once enabled, ask Claude to help you with tasks related to ${mcp.category.toLowerCase()}.

---
*Source: [${mcp.sourceUrl}](${mcp.sourceUrl})*
*Added from GGPrompts Daily News Digest*
`
}

/**
 * Generate setup guide content for a hook
 */
export function generateHookContent(hook: NewsHook): string {
  // Parse hook type to provide context
  const hookTypeDescriptions: Record<string, string> = {
    'PreToolUse': 'Fires before Claude uses any tool - can block or modify tool calls',
    'PostToolUse': 'Fires after Claude successfully uses a tool - great for formatting, logging',
    'Stop': 'Fires when Claude finishes responding - useful for notifications, commits',
    'SessionStart': 'Fires when a Claude Code session begins - load context, set environment',
    'SessionEnd': 'Fires when a session ends - cleanup, logging',
    'UserPromptSubmit': 'Fires when user submits a prompt - validation, preprocessing',
    'Notification': 'Fires when Claude sends notifications - custom alerts',
    'PreCompact': 'Fires before conversation compaction - preserve important context',
  }

  const hookType = hook.type.split('/')[0] // Handle "PreToolUse/PostToolUse/Stop" format
  const typeDescription = hookTypeDescriptions[hookType] || 'Custom event handler'

  return `# ${hook.name}

## What it does
${hook.description}

## Hook Type
\`${hook.type}\` - ${typeDescription}

## Configuration
Add to your plugin's \`hooks/hooks.json\` or \`~/.claude/settings.json\`:

\`\`\`json
{
  "hooks": {
    "${hookType}": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "your-script-here.sh"
          }
        ]
      }
    ]
  }
}
\`\`\`

## When to Use
This hook is useful when you want to ${hook.description.toLowerCase().replace(/\.$/, '')}.

## Customization
- Modify the \`matcher\` field to target specific tools (e.g., \`"Write|Edit"\` for file operations)
- Add environment variables or arguments to the command
- Chain multiple hooks for complex workflows

---
*Source: [${hook.sourceUrl}](${hook.sourceUrl})*
*Added from GGPrompts Daily News Digest*
`
}

/**
 * Generate setup guide content for a skill
 */
export function generateSkillContent(skill: NewsSkill): string {
  const slug = generateSlug(skill.name)

  return `# ${skill.name}

## What it does
${skill.description}

## Installation
Create \`skills/${slug}/SKILL.md\` in your plugin:

\`\`\`markdown
---
name: ${slug}
description: ${skill.description}
---

# ${skill.name}

${skill.description}

## When to Use
Claude will automatically invoke this skill when working on tasks related to ${skill.category.toLowerCase()}.

## Capabilities
- ${skill.description}
\`\`\`

## Category
${skill.category}

---
*Source: [SkillsMP](${skill.marketplaceUrl})*
*Original: [${skill.sourceUrl}](${skill.sourceUrl})*
`
}

/**
 * Seed multiple components to the database
 */
export async function seedComponents(components: SeedComponentData[]): Promise<SeedResult> {
  const supabase = await createClient()

  const result: SeedResult = {
    success: true,
    inserted: 0,
    skipped: 0,
    errors: []
  }

  for (const component of components) {
    try {
      // Generate unique slug
      let slug = generateSlug(component.name)

      // Check if slug exists
      const { data: existing } = await supabase
        .from('components')
        .select('slug')
        .eq('slug', slug)
        .maybeSingle()

      if (existing) {
        slug = `${slug}-${Date.now().toString(36)}`
      }

      // Check if source_url already exists
      if (component.sourceUrl) {
        const { data: existingSource } = await supabase
          .from('components')
          .select('id')
          .eq('source_url', component.sourceUrl)
          .maybeSingle()

        if (existingSource) {
          result.skipped++
          continue
        }
      }

      // Insert component
      const { error } = await supabase.from('components').insert({
        type: component.type,
        slug,
        name: component.name,
        description: component.description,
        category: mapCategory(component.category),
        tags: component.tags || [],
        files: [{
          path: getFilePath(component.type),
          content: component.content
        }],
        author_id: null,
        author_name: component.authorName,
        source_url: component.sourceUrl,
        version: '1.0.0',
        license: 'MIT',
        downloads: 0,
        rating: null,
        rating_count: 0,
        is_official: false,
        is_featured: false,
        is_verified: false,
        status: 'approved'
      })

      if (error) {
        result.errors.push(`Failed to insert ${component.name}: ${error.message}`)
      } else {
        result.inserted++
      }
    } catch (err) {
      result.errors.push(`Error processing ${component.name}: ${err}`)
    }
  }

  // Revalidate marketplace pages
  if (result.inserted > 0) {
    revalidatePath('/claude-code')
    revalidatePath('/claude-code/mcps')
    revalidatePath('/claude-code/hooks')
    revalidatePath('/claude-code/skills')
  }

  result.success = result.errors.length === 0
  return result
}

/**
 * Get count of existing components by type
 */
export async function getComponentCounts(): Promise<Record<ComponentType, number>> {
  const supabase = await createClient()

  const types: ComponentType[] = ['skill', 'agent', 'hook', 'mcp', 'command']
  const counts: Record<string, number> = {}

  for (const type of types) {
    const { count } = await supabase
      .from('components')
      .select('*', { count: 'exact', head: true })
      .eq('type', type)
      .eq('status', 'approved')

    counts[type] = count || 0
  }

  return counts as Record<ComponentType, number>
}

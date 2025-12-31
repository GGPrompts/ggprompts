import { NextResponse } from 'next/server'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { homedir } from 'os'

interface AgentInfo {
  name: string
  description: string
  model?: string
  filename: string
}

// Parse YAML frontmatter from agent markdown files
function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const frontmatter: Record<string, string> = {}
  const lines = match[1].split('\n')

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      frontmatter[key] = value
    }
  }

  return frontmatter
}

export async function GET() {
  try {
    const agentsDir = join(homedir(), '.claude', 'agents')
    const agents: AgentInfo[] = []

    try {
      const files = await readdir(agentsDir)

      for (const file of files) {
        if (!file.endsWith('.md') || file === 'README.txt') continue

        try {
          const content = await readFile(join(agentsDir, file), 'utf-8')
          const frontmatter = parseFrontmatter(content)

          agents.push({
            name: frontmatter.name || file.replace('.md', ''),
            description: frontmatter.description || '',
            model: frontmatter.model,
            filename: file.replace('.md', ''),
          })
        } catch {
          // Skip files that can't be read
        }
      }
    } catch {
      // Directory doesn't exist or can't be read
    }

    // Sort alphabetically by name
    agents.sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({ agents })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to list agents', agents: [] },
      { status: 500 }
    )
  }
}

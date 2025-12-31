import { createClient } from '@/lib/supabase/server'
import * as fs from 'fs'
import * as path from 'path'

const PLUGINS_REPO_PATH = path.join(process.env.HOME || '/home/matt', 'projects/my-gg-plugins')
const GITHUB_BASE_URL = 'https://github.com/GGPrompts/my-gg-plugins/tree/main'
const GGPROMPTS_USER_ID = '0dc17858-d9c7-48ba-a021-2c2273a8b19d'

interface FileEntry {
  path: string
  content: string
}

export interface SyncResult {
  type: string
  slug: string
  status: string
  files?: number
}

export interface SyncResponse {
  success: boolean
  synced: number
  errors: number
  results: SyncResult[]
}

function readSkillFiles(skillPath: string): FileEntry[] {
  const files: FileEntry[] = []

  const skillMdPath = path.join(skillPath, 'SKILL.md')
  if (fs.existsSync(skillMdPath)) {
    files.push({
      path: 'SKILL.md',
      content: fs.readFileSync(skillMdPath, 'utf-8')
    })
  }

  const refsPath = path.join(skillPath, 'references')
  if (fs.existsSync(refsPath) && fs.statSync(refsPath).isDirectory()) {
    for (const refFile of fs.readdirSync(refsPath)) {
      if (refFile.endsWith('.md')) {
        files.push({
          path: `references/${refFile}`,
          content: fs.readFileSync(path.join(refsPath, refFile), 'utf-8')
        })
      }
    }
  }

  const assetsPath = path.join(skillPath, 'assets')
  if (fs.existsSync(assetsPath) && fs.statSync(assetsPath).isDirectory()) {
    const walkDir = (dir: string, basePath: string) => {
      for (const item of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, item)
        const relativePath = path.join(basePath, item)
        if (fs.statSync(fullPath).isDirectory()) {
          walkDir(fullPath, relativePath)
        } else if (item.endsWith('.md')) {
          files.push({
            path: relativePath,
            content: fs.readFileSync(fullPath, 'utf-8')
          })
        }
      }
    }
    walkDir(assetsPath, 'assets')
  }

  return files
}

function readSingleFile(filePath: string): FileEntry[] {
  if (fs.existsSync(filePath)) {
    return [{
      path: path.basename(filePath),
      content: fs.readFileSync(filePath, 'utf-8')
    }]
  }
  return []
}

/**
 * Sync components from the local my-gg-plugins repository to the database.
 * This function can be called from API routes, webhooks, or server actions.
 */
export async function syncPluginsToDatabase(): Promise<SyncResponse> {
  const supabase = await createClient()
  const results: SyncResult[] = []

  // Check if repo exists
  if (!fs.existsSync(PLUGINS_REPO_PATH)) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      results: [{ type: 'error', slug: '', status: `Repository not found at ${PLUGINS_REPO_PATH}` }]
    }
  }

  // Sync skills
  const skillsDir = path.join(PLUGINS_REPO_PATH, 'skills')
  if (fs.existsSync(skillsDir)) {
    for (const skillSlug of fs.readdirSync(skillsDir)) {
      const skillPath = path.join(skillsDir, skillSlug)
      if (!fs.statSync(skillPath).isDirectory()) continue

      const files = readSkillFiles(skillPath)
      if (files.length === 0) continue

      const { error } = await supabase
        .from('components')
        .update({
          files,
          source_url: `${GITHUB_BASE_URL}/skills/${skillSlug}`,
          author_id: GGPROMPTS_USER_ID,
          updated_at: new Date().toISOString()
        })
        .eq('slug', skillSlug)
        .eq('type', 'skill')

      results.push({
        type: 'skill',
        slug: skillSlug,
        status: error ? `error: ${error.message}` : 'synced',
        files: files.length
      })
    }
  }

  // Sync agents
  const agentsDir = path.join(PLUGINS_REPO_PATH, 'agents')
  if (fs.existsSync(agentsDir)) {
    for (const agentFile of fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'))) {
      const slug = agentFile.replace('.md', '')
      const files = readSingleFile(path.join(agentsDir, agentFile))

      const { error } = await supabase
        .from('components')
        .update({
          files,
          source_url: `${GITHUB_BASE_URL}/agents/${agentFile}`,
          author_id: GGPROMPTS_USER_ID,
          updated_at: new Date().toISOString()
        })
        .eq('slug', slug)
        .eq('type', 'agent')

      results.push({
        type: 'agent',
        slug,
        status: error ? `error: ${error.message}` : 'synced'
      })
    }
  }

  // Sync commands
  const commandsDir = path.join(PLUGINS_REPO_PATH, 'commands')
  if (fs.existsSync(commandsDir)) {
    for (const cmdFile of fs.readdirSync(commandsDir).filter(f => f.endsWith('.md'))) {
      const slug = cmdFile.replace('.md', '')
      const files = readSingleFile(path.join(commandsDir, cmdFile))

      const { error } = await supabase
        .from('components')
        .update({
          files,
          source_url: `${GITHUB_BASE_URL}/commands/${cmdFile}`,
          author_id: GGPROMPTS_USER_ID,
          updated_at: new Date().toISOString()
        })
        .eq('slug', slug)
        .eq('type', 'command')

      results.push({
        type: 'command',
        slug,
        status: error ? `error: ${error.message}` : 'synced'
      })
    }
  }

  const synced = results.filter(r => r.status === 'synced').length
  const errors = results.filter(r => r.status.startsWith('error')).length

  return {
    success: errors === 0,
    synced,
    errors,
    results
  }
}

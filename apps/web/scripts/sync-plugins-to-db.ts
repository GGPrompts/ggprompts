/**
 * Sync script to populate the database with actual content from the my-gg-plugins repo
 *
 * Usage: npx tsx scripts/sync-plugins-to-db.ts
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables from .env.local
config({ path: '.env.local' })

const PLUGINS_REPO_PATH = path.join(process.env.HOME || '~', 'projects/my-gg-plugins')
const GITHUB_BASE_URL = 'https://github.com/GGPrompts/my-gg-plugins/tree/main'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface FileEntry {
  path: string
  content: string
}

/**
 * Read all files from a skill directory (SKILL.md + references/)
 */
function readSkillFiles(skillPath: string): FileEntry[] {
  const files: FileEntry[] = []

  // Read main SKILL.md
  const skillMdPath = path.join(skillPath, 'SKILL.md')
  if (fs.existsSync(skillMdPath)) {
    files.push({
      path: 'SKILL.md',
      content: fs.readFileSync(skillMdPath, 'utf-8')
    })
  }

  // Read references/ directory if it exists
  const refsPath = path.join(skillPath, 'references')
  if (fs.existsSync(refsPath) && fs.statSync(refsPath).isDirectory()) {
    const refFiles = fs.readdirSync(refsPath)
    for (const refFile of refFiles) {
      if (refFile.endsWith('.md')) {
        files.push({
          path: `references/${refFile}`,
          content: fs.readFileSync(path.join(refsPath, refFile), 'utf-8')
        })
      }
    }
  }

  // Read assets/ directory if it exists
  const assetsPath = path.join(skillPath, 'assets')
  if (fs.existsSync(assetsPath) && fs.statSync(assetsPath).isDirectory()) {
    const walkDir = (dir: string, basePath: string) => {
      const items = fs.readdirSync(dir)
      for (const item of items) {
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

/**
 * Read a single .md file for agents/commands/hooks
 */
function readSingleFile(filePath: string): FileEntry[] {
  if (fs.existsSync(filePath)) {
    return [{
      path: path.basename(filePath),
      content: fs.readFileSync(filePath, 'utf-8')
    }]
  }
  return []
}

async function syncSkills() {
  const skillsDir = path.join(PLUGINS_REPO_PATH, 'skills')
  if (!fs.existsSync(skillsDir)) {
    console.log('No skills directory found')
    return
  }

  const skillDirs = fs.readdirSync(skillsDir).filter(d =>
    fs.statSync(path.join(skillsDir, d)).isDirectory()
  )

  console.log(`Found ${skillDirs.length} skills to sync`)

  for (const skillSlug of skillDirs) {
    const skillPath = path.join(skillsDir, skillSlug)
    const files = readSkillFiles(skillPath)

    if (files.length === 0) {
      console.log(`  Skipping ${skillSlug} - no files found`)
      continue
    }

    const sourceUrl = `${GITHUB_BASE_URL}/skills/${skillSlug}`

    // Update the database
    const { error } = await supabase
      .from('components')
      .update({
        files: files,
        source_url: sourceUrl,
        updated_at: new Date().toISOString()
      })
      .eq('slug', skillSlug)
      .eq('type', 'skill')

    if (error) {
      console.log(`  ❌ ${skillSlug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${skillSlug}: ${files.length} files synced`)
    }
  }
}

async function syncAgents() {
  const agentsDir = path.join(PLUGINS_REPO_PATH, 'agents')
  if (!fs.existsSync(agentsDir)) {
    console.log('No agents directory found')
    return
  }

  const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'))
  console.log(`Found ${agentFiles.length} agents to sync`)

  for (const agentFile of agentFiles) {
    const slug = agentFile.replace('.md', '')
    const files = readSingleFile(path.join(agentsDir, agentFile))
    const sourceUrl = `${GITHUB_BASE_URL}/agents/${agentFile}`

    const { error } = await supabase
      .from('components')
      .update({
        files: files,
        source_url: sourceUrl,
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .eq('type', 'agent')

    if (error) {
      console.log(`  ❌ ${slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${slug}: synced`)
    }
  }
}

async function syncCommands() {
  const commandsDir = path.join(PLUGINS_REPO_PATH, 'commands')
  if (!fs.existsSync(commandsDir)) {
    console.log('No commands directory found')
    return
  }

  const commandFiles = fs.readdirSync(commandsDir).filter(f => f.endsWith('.md'))
  console.log(`Found ${commandFiles.length} commands to sync`)

  for (const commandFile of commandFiles) {
    const slug = commandFile.replace('.md', '')
    const files = readSingleFile(path.join(commandsDir, commandFile))
    const sourceUrl = `${GITHUB_BASE_URL}/commands/${commandFile}`

    const { error } = await supabase
      .from('components')
      .update({
        files: files,
        source_url: sourceUrl,
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .eq('type', 'command')

    if (error) {
      console.log(`  ❌ ${slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${slug}: synced`)
    }
  }
}

async function syncHooks() {
  const hooksDir = path.join(PLUGINS_REPO_PATH, 'hooks')
  if (!fs.existsSync(hooksDir)) {
    console.log('No hooks directory found')
    return
  }

  const hookFiles = fs.readdirSync(hooksDir).filter(f => f.endsWith('.md'))
  console.log(`Found ${hookFiles.length} hooks to sync`)

  for (const hookFile of hookFiles) {
    const slug = hookFile.replace('.md', '')
    const files = readSingleFile(path.join(hooksDir, hookFile))
    const sourceUrl = `${GITHUB_BASE_URL}/hooks/${hookFile}`

    const { error } = await supabase
      .from('components')
      .update({
        files: files,
        source_url: sourceUrl,
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .eq('type', 'hook')

    if (error) {
      console.log(`  ❌ ${slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${slug}: synced`)
    }
  }
}

async function main() {
  console.log('=== Syncing plugins from my-gg-plugins repo ===\n')
  console.log(`Repo path: ${PLUGINS_REPO_PATH}`)
  console.log(`GitHub URL: ${GITHUB_BASE_URL}\n`)

  if (!fs.existsSync(PLUGINS_REPO_PATH)) {
    console.error(`Repo not found at ${PLUGINS_REPO_PATH}`)
    process.exit(1)
  }

  console.log('--- Skills ---')
  await syncSkills()

  console.log('\n--- Agents ---')
  await syncAgents()

  console.log('\n--- Commands ---')
  await syncCommands()

  console.log('\n--- Hooks ---')
  await syncHooks()

  console.log('\n=== Sync complete ===')
}

main().catch(console.error)

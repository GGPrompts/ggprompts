'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Component, ComponentType, UserGithubSync } from '@/lib/types'

export interface GitHubSyncResult {
  success: boolean
  error?: string
  repoUrl?: string
}

export interface GitHubSyncStatus {
  connected: boolean
  connectionType?: 'oauth' | 'pat'
  repoName?: string
  repoFullName?: string
  lastSyncedAt?: string
  syncStatus?: 'synced' | 'pending' | 'error' | null
  syncError?: string
}

// File path mappings for each component type
const typePathMap: Record<ComponentType, string> = {
  skill: 'skills',
  agent: 'agents',
  command: 'commands',
  hook: 'hooks',
  mcp: 'mcps'
}

/**
 * Get user's GitHub sync status
 */
export async function getGitHubSyncStatus(): Promise<GitHubSyncStatus> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { connected: false }
  }

  const { data: syncData } = await supabase
    .from('user_github_sync')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!syncData || !syncData.github_token_encrypted) {
    return { connected: false }
  }

  // Detect connection type based on token format
  // Fine-grained PATs start with 'github_pat_', classic PATs start with 'ghp_'
  const token = syncData.github_token_encrypted
  const isPat = token.startsWith('github_pat_') || token.startsWith('ghp_')

  return {
    connected: true,
    connectionType: isPat ? 'pat' : 'oauth',
    repoName: syncData.repo_name,
    repoFullName: syncData.repo_full_name,
    lastSyncedAt: syncData.last_synced_at,
    syncStatus: syncData.sync_status as 'synced' | 'pending' | 'error' | null,
    syncError: syncData.sync_error
  }
}

/**
 * Disconnect GitHub from the user's account
 */
export async function disconnectGitHub(): Promise<GitHubSyncResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('user_github_sync')
    .update({
      github_token_encrypted: null,
      sync_status: null,
      sync_error: null
    })
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to disconnect GitHub:', error)
    return { success: false, error: 'Failed to disconnect GitHub' }
  }

  revalidatePath('/settings')
  revalidatePath('/claude-code/toolkit')

  return { success: true }
}

/**
 * Update the repository name
 */
export async function updateRepoName(repoName: string): Promise<GitHubSyncResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Validate repo name
  const validRepoName = /^[a-zA-Z0-9_.-]+$/
  if (!validRepoName.test(repoName)) {
    return { success: false, error: 'Invalid repository name' }
  }

  // Get current sync data to get username
  const { data: syncData } = await supabase
    .from('user_github_sync')
    .select('repo_full_name')
    .eq('user_id', user.id)
    .single()

  let repoFullName = syncData?.repo_full_name
  if (repoFullName) {
    // Update the repo name part of full name
    const username = repoFullName.split('/')[0]
    repoFullName = `${username}/${repoName}`
  }

  const { error } = await supabase
    .from('user_github_sync')
    .update({
      repo_name: repoName,
      repo_full_name: repoFullName
    })
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to update repo name:', error)
    return { success: false, error: 'Failed to update repository name' }
  }

  revalidatePath('/settings')

  return { success: true }
}

/**
 * Generate the .claude folder structure from user's toolkit
 */
async function generateClaudeFiles(
  components: Component[]
): Promise<Array<{ path: string; content: string }>> {
  const files: Array<{ path: string; content: string }> = []

  for (const component of components) {
    const basePath = typePathMap[component.type]

    // Add frontmatter to track the source
    const frontmatter = `---
# Managed by GGPrompts - https://ggprompts.com
# Source: https://ggprompts.com/claude-code/${typePathMap[component.type]}/${component.slug}
# Component: ${component.slug}
# Synced: ${new Date().toISOString()}
---

`

    if (component.files && component.files.length > 0) {
      // Use the component's files
      for (const file of component.files) {
        const fileName = file.path
        let filePath: string

        if (component.type === 'skill') {
          // Skills go in their own folder
          filePath = `${basePath}/${component.slug}/${fileName}`
        } else {
          // Commands, hooks, etc. are single files
          filePath = `${basePath}/${component.slug}.md`
        }

        // Only add frontmatter to markdown files
        const content = fileName.endsWith('.md')
          ? frontmatter + file.content
          : file.content

        files.push({ path: filePath, content })
      }
    }
  }

  // Build plugin configuration with explicit sources using "./" prefix
  // This is required for plugins to be loadable as marketplace sources
  const commands: Record<string, { description: string; source: string }> = {}
  const skills: Record<string, { description: string; source: string }> = {}
  const agents: Record<string, { description: string; source: string }> = {}
  const hooks: Record<string, { description: string; source: string }> = {}

  // Build marketplace plugins array
  const marketplacePlugins: Array<{
    id: string
    type: string
    name: string
    description: string
    source: string
  }> = []

  for (const component of components) {
    const basePath = typePathMap[component.type]
    const description = component.description || `${component.name} ${component.type}`

    // Build source path with "./" prefix (required for validation)
    let sourcePath: string
    if (component.type === 'skill') {
      sourcePath = `./${basePath}/${component.slug}/SKILL.md`
    } else {
      sourcePath = `./${basePath}/${component.slug}.md`
    }

    // Add to type-specific config for plugin.json
    switch (component.type) {
      case 'command':
        commands[component.slug] = { description, source: sourcePath }
        break
      case 'skill':
        skills[component.slug] = { description, source: sourcePath }
        break
      case 'agent':
        agents[component.slug] = { description, source: sourcePath }
        break
      case 'hook':
        hooks[component.slug] = { description, source: sourcePath }
        break
    }

    // Add to marketplace plugins array
    marketplacePlugins.push({
      id: component.slug,
      type: component.type,
      name: component.name,
      description,
      source: sourcePath
    })
  }

  // Generate .claude-plugin/plugin.json with explicit sources
  const pluginJson: Record<string, unknown> = {
    name: "my-ggprompts-toolkit",
    version: "1.0.0",
    description: "Curated Claude Code plugins synced from GGPrompts",
    homepage: "https://ggprompts.com/claude-code/toolkit",
    keywords: ["ggprompts", "toolkit", "curated"]
  }

  // Only add non-empty sections
  if (Object.keys(commands).length > 0) pluginJson.commands = commands
  if (Object.keys(skills).length > 0) pluginJson.skills = skills
  if (Object.keys(agents).length > 0) pluginJson.agents = agents
  if (Object.keys(hooks).length > 0) pluginJson.hooks = hooks

  files.push({
    path: '.claude-plugin/plugin.json',
    content: JSON.stringify(pluginJson, null, 2)
  })

  // Generate .claude-plugin/marketplace.json for loadable marketplace sources
  // All source paths must start with "./" per validation requirements
  const marketplaceJson = {
    name: "my-ggprompts-toolkit",
    version: "1.0.0",
    description: "Curated Claude Code plugins synced from GGPrompts",
    plugins: marketplacePlugins
  }

  files.push({
    path: '.claude-plugin/marketplace.json',
    content: JSON.stringify(marketplaceJson, null, 2)
  })

  // Add a README for the repo
  files.push({
    path: 'README.md',
    content: `# My GGPrompts Toolkit

This repository contains my curated Claude Code plugins, synced from [GGPrompts](https://ggprompts.com).

## Structure

This plugin follows the official Anthropic plugin format:

\`\`\`
.claude-plugin/
  plugin.json       # Plugin manifest with explicit sources
  marketplace.json  # Marketplace source listing (required for loading)
commands/           # Slash commands
agents/             # Subagents
skills/             # Skills (each in its own directory)
hooks/              # Hook configurations
\`\`\`

All source paths use the \`./\` prefix format required for validation.

## Usage

Clone this repo and load it in Claude Code:

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/my-gg-plugins.git
cd my-gg-plugins
claude plugin load .
\`\`\`

Or add it to your Claude Code settings to auto-load on startup.

## Managing Your Toolkit

Visit [ggprompts.com/claude-code/toolkit](https://ggprompts.com/claude-code/toolkit) to:
- Browse and add components to your toolkit
- Enable/disable specific plugins
- Sync changes to this repository

---

*Managed by [GGPrompts](https://ggprompts.com) - The control plane for your Claude Code setup*
`
  })

  return files
}

/**
 * Create or get the repository
 */
async function ensureRepository(
  token: string,
  repoName: string,
  isPrivate: boolean
): Promise<{ success: boolean; error?: string; repoFullName?: string }> {
  // First, check if repo exists
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GGPrompts'
    }
  })

  if (!userResponse.ok) {
    return { success: false, error: 'Failed to fetch GitHub user info' }
  }

  const user = await userResponse.json()
  const username = user.login
  const repoFullName = `${username}/${repoName}`

  // Check if repo exists
  const repoCheckResponse = await fetch(`https://api.github.com/repos/${repoFullName}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GGPrompts'
    }
  })

  if (repoCheckResponse.status === 404) {
    // Create the repository
    const createResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GGPrompts',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repoName,
        description: 'My Claude Code toolkit - managed by GGPrompts',
        private: isPrivate,
        auto_init: true // Initialize with a README so we have a default branch
      })
    })

    if (!createResponse.ok) {
      const errorData = await createResponse.json()
      console.error('Failed to create repo:', errorData)
      return { success: false, error: `Failed to create repository: ${errorData.message}` }
    }

    // Wait a moment for the repo to be initialized
    await new Promise(resolve => setTimeout(resolve, 2000))
  } else if (!repoCheckResponse.ok) {
    return { success: false, error: 'Failed to check repository status' }
  }

  return { success: true, repoFullName }
}

/**
 * Get the default branch and its SHA
 */
async function getDefaultBranch(
  token: string,
  repoFullName: string
): Promise<{ branch: string; sha: string } | null> {
  // Get repo info for default branch
  const repoResponse = await fetch(`https://api.github.com/repos/${repoFullName}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GGPrompts'
    }
  })

  if (!repoResponse.ok) return null
  const repo = await repoResponse.json()
  const defaultBranch = repo.default_branch || 'main'

  // Get the SHA of the default branch
  const refResponse = await fetch(`https://api.github.com/repos/${repoFullName}/git/refs/heads/${defaultBranch}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GGPrompts'
    }
  })

  if (!refResponse.ok) return null
  const ref = await refResponse.json()

  return { branch: defaultBranch, sha: ref.object.sha }
}

/**
 * Create a tree with all the files
 */
async function createTree(
  token: string,
  repoFullName: string,
  baseTreeSha: string,
  files: Array<{ path: string; content: string }>
): Promise<string | null> {
  const tree = files.map(file => ({
    path: file.path,
    mode: '100644' as const,
    type: 'blob' as const,
    content: file.content
  }))

  const response = await fetch(`https://api.github.com/repos/${repoFullName}/git/trees`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GGPrompts',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree
    })
  })

  if (!response.ok) {
    console.error('Failed to create tree:', await response.text())
    return null
  }

  const data = await response.json()
  return data.sha
}

/**
 * Create a commit
 */
async function createCommit(
  token: string,
  repoFullName: string,
  treeSha: string,
  parentSha: string,
  message: string
): Promise<string | null> {
  const response = await fetch(`https://api.github.com/repos/${repoFullName}/git/commits`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GGPrompts',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      tree: treeSha,
      parents: [parentSha]
    })
  })

  if (!response.ok) {
    console.error('Failed to create commit:', await response.text())
    return null
  }

  const data = await response.json()
  return data.sha
}

/**
 * Update the branch reference to point to the new commit
 */
async function updateBranchRef(
  token: string,
  repoFullName: string,
  branch: string,
  commitSha: string
): Promise<boolean> {
  const response = await fetch(`https://api.github.com/repos/${repoFullName}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GGPrompts',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sha: commitSha
    })
  })

  return response.ok
}

/**
 * Delete a file from the repository
 */
async function deleteFile(
  token: string,
  repoFullName: string,
  path: string,
  branch: string
): Promise<boolean> {
  try {
    // First get the file's SHA
    const getResponse = await fetch(`https://api.github.com/repos/${repoFullName}/contents/${path}?ref=${branch}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GGPrompts'
      }
    })

    if (!getResponse.ok) {
      // File doesn't exist, nothing to delete
      return true
    }

    const fileData = await getResponse.json()

    // Delete the file
    const deleteResponse = await fetch(`https://api.github.com/repos/${repoFullName}/contents/${path}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GGPrompts',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Remove ${path} (removed from GGPrompts toolkit)`,
        sha: fileData.sha,
        branch
      })
    })

    return deleteResponse.ok
  } catch (error) {
    console.error(`Failed to delete ${path}:`, error)
    return false
  }
}

/**
 * Delete files that were previously synced but are no longer in the toolkit
 */
async function deleteRemovedFiles(
  token: string,
  repoFullName: string,
  branch: string,
  previousFiles: string[],
  currentFiles: string[]
): Promise<string[]> {
  const currentSet = new Set(currentFiles)
  const filesToDelete = previousFiles.filter(f => !currentSet.has(f))
  const deletedFiles: string[] = []

  for (const file of filesToDelete) {
    const success = await deleteFile(token, repoFullName, file, branch)
    if (success) {
      deletedFiles.push(file)
    }
  }

  return deletedFiles
}

/**
 * Sync the user's toolkit to their GitHub repository
 */
export async function syncToGitHub(): Promise<GitHubSyncResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Get the user's GitHub sync settings
  const { data: syncData } = await supabase
    .from('user_github_sync')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!syncData || !syncData.github_token_encrypted) {
    return { success: false, error: 'GitHub not connected' }
  }

  const token = syncData.github_token_encrypted
  const repoName = syncData.repo_name || 'my-gg-plugins'
  const isPrivate = syncData.is_private || false
  const previousSyncedFiles: string[] = (syncData.last_synced_files as string[]) || []

  // Update status to pending
  await supabase
    .from('user_github_sync')
    .update({ sync_status: 'pending', sync_error: null })
    .eq('user_id', user.id)

  try {
    // Ensure the repository exists
    const repoResult = await ensureRepository(token, repoName, isPrivate)
    if (!repoResult.success) {
      await supabase
        .from('user_github_sync')
        .update({ sync_status: 'error', sync_error: repoResult.error })
        .eq('user_id', user.id)
      return { success: false, error: repoResult.error }
    }

    const repoFullName = repoResult.repoFullName!

    // Get user's enabled toolkit components
    const { data: toolkitItems } = await supabase
      .from('user_toolkit')
      .select(`
        id,
        enabled,
        components (*)
      `)
      .eq('user_id', user.id)
      .eq('enabled', true)

    const components = (toolkitItems || [])
      .map(item => item.components as unknown as Component)
      .filter(Boolean)

    // Generate the file structure
    const files = await generateClaudeFiles(components)
    const currentFilePaths = files.map(f => f.path)

    // Get the default branch info
    const branchInfo = await getDefaultBranch(token, repoFullName)
    if (!branchInfo) {
      throw new Error('Failed to get branch information')
    }

    // Get the current tree SHA
    const commitResponse = await fetch(`https://api.github.com/repos/${repoFullName}/git/commits/${branchInfo.sha}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GGPrompts'
      }
    })

    if (!commitResponse.ok) {
      throw new Error('Failed to get current commit')
    }

    const commitData = await commitResponse.json()
    const baseTreeSha = commitData.tree.sha

    // Create a new tree with the files
    const newTreeSha = await createTree(token, repoFullName, baseTreeSha, files)
    if (!newTreeSha) {
      throw new Error('Failed to create file tree')
    }

    // Create a commit
    const componentCount = components.length
    const commitMessage = `Sync from GGPrompts - ${componentCount} component${componentCount !== 1 ? 's' : ''}\n\nSynced at ${new Date().toISOString()}`

    const newCommitSha = await createCommit(token, repoFullName, newTreeSha, branchInfo.sha, commitMessage)
    if (!newCommitSha) {
      throw new Error('Failed to create commit')
    }

    // Update the branch reference
    const updateSuccess = await updateBranchRef(token, repoFullName, branchInfo.branch, newCommitSha)
    if (!updateSuccess) {
      throw new Error('Failed to update branch')
    }

    // Delete files that were in the previous sync but not in the current one
    if (previousSyncedFiles.length > 0) {
      const deletedFiles = await deleteRemovedFiles(
        token,
        repoFullName,
        branchInfo.branch,
        previousSyncedFiles,
        currentFilePaths
      )
      if (deletedFiles.length > 0) {
        console.log(`Cleaned up ${deletedFiles.length} removed files:`, deletedFiles)
      }
    }

    // Update the sync status and save current file paths
    await supabase
      .from('user_github_sync')
      .update({
        repo_full_name: repoFullName,
        last_synced_at: new Date().toISOString(),
        sync_status: 'synced',
        sync_error: null,
        last_synced_files: currentFilePaths
      })
      .eq('user_id', user.id)

    revalidatePath('/claude-code/toolkit')
    revalidatePath('/settings')

    return {
      success: true,
      repoUrl: `https://github.com/${repoFullName}`
    }
  } catch (error) {
    console.error('Sync error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    await supabase
      .from('user_github_sync')
      .update({
        sync_status: 'error',
        sync_error: errorMessage
      })
      .eq('user_id', user.id)

    return { success: false, error: errorMessage }
  }
}

/**
 * Save a Personal Access Token for GitHub sync
 * This is an alternative to OAuth for privacy-conscious users who want fine-grained control
 */
export async function savePersonalAccessToken(token: string): Promise<GitHubSyncResult & { username?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Validate the token by calling GitHub API
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GGPrompts'
    }
  })

  if (!userResponse.ok) {
    if (userResponse.status === 401) {
      return { success: false, error: 'Invalid token. Please check your Personal Access Token.' }
    }
    return { success: false, error: 'Failed to validate token with GitHub' }
  }

  const githubUser = await userResponse.json()
  const username = githubUser.login

  // Check if user already has a sync record
  const { data: existingSync } = await supabase
    .from('user_github_sync')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existingSync) {
    // Update existing record
    const { error } = await supabase
      .from('user_github_sync')
      .update({
        github_token_encrypted: token,
        repo_full_name: null, // User will configure repo name separately
        sync_status: null,
        sync_error: null
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Failed to save PAT:', error)
      return { success: false, error: 'Failed to save token' }
    }
  } else {
    // Create new record
    const { error } = await supabase
      .from('user_github_sync')
      .insert({
        user_id: user.id,
        github_token_encrypted: token,
        repo_name: 'my-gg-plugins',
        is_private: true
      })

    if (error) {
      console.error('Failed to save PAT:', error)
      return { success: false, error: 'Failed to save token' }
    }
  }

  revalidatePath('/settings')
  revalidatePath('/claude-code/toolkit')

  return { success: true, username }
}

/**
 * Represents a component found in the user's GitHub repository
 */
export interface RepoComponent {
  name: string
  slug: string
  type: ComponentType
  path: string
  source: 'ggprompts' | 'user'
  description?: string
}

/**
 * Result of fetching repo contents
 */
export interface RepoContentsResult {
  success: boolean
  error?: string
  repoFullName?: string
  repoUrl?: string
  components?: RepoComponent[]
}

/**
 * Fetch the contents of the user's GitHub plugin repository
 * Identifies all components and whether they're GGPrompts-managed or user-added
 */
export async function getRepoContents(): Promise<RepoContentsResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Get the user's GitHub sync settings
  const { data: syncData } = await supabase
    .from('user_github_sync')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!syncData || !syncData.github_token_encrypted) {
    return { success: false, error: 'GitHub not connected' }
  }

  if (!syncData.repo_full_name) {
    return { success: false, error: 'Repository not configured' }
  }

  const token = syncData.github_token_encrypted
  const repoFullName = syncData.repo_full_name
  const lastSyncedFiles: string[] = (syncData.last_synced_files as string[]) || []
  const ggpromptsFilesSet = new Set(lastSyncedFiles)

  try {
    // Fetch the repo tree recursively
    const treeResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/git/trees/HEAD?recursive=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GGPrompts'
        }
      }
    )

    if (!treeResponse.ok) {
      if (treeResponse.status === 404) {
        return { success: false, error: 'Repository not found' }
      }
      return { success: false, error: 'Failed to fetch repository contents' }
    }

    const treeData = await treeResponse.json()
    const files: Array<{ path: string; type: string }> = treeData.tree || []

    // Parse the file structure to identify components
    const components: RepoComponent[] = []
    const typeDirectories: Record<string, ComponentType> = {
      'skills': 'skill',
      'agents': 'agent',
      'commands': 'command',
      'hooks': 'hook',
      'mcps': 'mcp'
    }

    // Track which components we've seen (to avoid duplicates from nested files)
    const seenComponents = new Set<string>()

    for (const file of files) {
      if (file.type !== 'blob') continue

      const pathParts = file.path.split('/')
      if (pathParts.length < 2) continue

      const topDir = pathParts[0]
      const componentType = typeDirectories[topDir]
      if (!componentType) continue

      let slug: string
      let name: string

      if (componentType === 'skill') {
        // Skills are in folders: skills/{slug}/SKILL.md or skills/{slug}/*.md
        if (pathParts.length < 3) continue
        slug = pathParts[1]
        // Only count the skill once (by its folder)
        if (seenComponents.has(`skill:${slug}`)) continue
        seenComponents.add(`skill:${slug}`)
      } else {
        // Other types are single files: {type}/{slug}.md
        const fileName = pathParts[1]
        if (!fileName.endsWith('.md')) continue
        slug = fileName.replace(/\.md$/, '')
        if (seenComponents.has(`${componentType}:${slug}`)) continue
        seenComponents.add(`${componentType}:${slug}`)
      }

      // Convert slug to display name
      name = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      // Determine if this is a GGPrompts-managed file
      const isGGPrompts = ggpromptsFilesSet.has(file.path) ||
        // For skills, check if any file in the skill folder is managed
        (componentType === 'skill' &&
          lastSyncedFiles.some(f => f.startsWith(`skills/${slug}/`)))

      components.push({
        name,
        slug,
        type: componentType,
        path: file.path,
        source: isGGPrompts ? 'ggprompts' : 'user'
      })
    }

    // Sort by type, then by name
    components.sort((a, b) => {
      if (a.type !== b.type) {
        const typeOrder: ComponentType[] = ['skill', 'agent', 'command', 'hook', 'mcp']
        return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
      }
      return a.name.localeCompare(b.name)
    })

    return {
      success: true,
      repoFullName,
      repoUrl: `https://github.com/${repoFullName}`,
      components
    }
  } catch (error) {
    console.error('Error fetching repo contents:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Extended sync status that includes last_synced_files for toolkit page
 */
export interface FullSyncData extends GitHubSyncStatus {
  lastSyncedFiles?: string[]
}

/**
 * Get full sync data including list of synced files
 * Used by toolkit page to show per-component sync status
 */
export async function getFullSyncData(): Promise<FullSyncData> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { connected: false }
  }

  const { data: syncData } = await supabase
    .from('user_github_sync')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!syncData || !syncData.github_token_encrypted) {
    return { connected: false }
  }

  const token = syncData.github_token_encrypted
  const isPat = token.startsWith('github_pat_') || token.startsWith('ghp_')

  return {
    connected: true,
    connectionType: isPat ? 'pat' : 'oauth',
    repoName: syncData.repo_name,
    repoFullName: syncData.repo_full_name,
    lastSyncedAt: syncData.last_synced_at,
    syncStatus: syncData.sync_status as 'synced' | 'pending' | 'error' | null,
    syncError: syncData.sync_error,
    lastSyncedFiles: (syncData.last_synced_files as string[]) || []
  }
}

/**
 * Result of updating a component file
 */
export interface UpdateFileResult {
  success: boolean
  error?: string
  commitUrl?: string
}

/**
 * Update a single file in the user's GitHub repository
 * Used for editing components from the toolkit
 */
export async function updateComponentFile(
  filePath: string,
  content: string,
  commitMessage?: string
): Promise<UpdateFileResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Get sync data
  const { data: syncData } = await supabase
    .from('user_github_sync')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!syncData || !syncData.github_token_encrypted) {
    return { success: false, error: 'GitHub not connected' }
  }

  if (!syncData.repo_full_name) {
    return { success: false, error: 'Repository not configured. Please sync to GitHub first.' }
  }

  const token = syncData.github_token_encrypted
  const repoFullName = syncData.repo_full_name

  try {
    // Get current file SHA (needed for update)
    const getResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/contents/${filePath}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GGPrompts'
        }
      }
    )

    let fileSha: string | undefined
    if (getResponse.ok) {
      const fileData = await getResponse.json()
      fileSha = fileData.sha
    } else if (getResponse.status !== 404) {
      return { success: false, error: 'Failed to check existing file' }
    }

    // Create or update the file
    const message = commitMessage || `Update ${filePath} from GGPrompts`
    const body: Record<string, string> = {
      message,
      content: Buffer.from(content).toString('base64'),
      branch: 'main'
    }

    if (fileSha) {
      body.sha = fileSha
    }

    const updateResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GGPrompts',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    )

    if (!updateResponse.ok) {
      const error = await updateResponse.json()
      return { success: false, error: error.message || `HTTP ${updateResponse.status}` }
    }

    const result = await updateResponse.json()

    revalidatePath('/claude-code/toolkit')

    return {
      success: true,
      commitUrl: result.commit?.html_url
    }
  } catch (error) {
    console.error('Failed to update file:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Source status of a file in the repo
 */
export type FileSourceStatus = 'ggprompts' | 'user-modified' | 'not-found'

/**
 * Result of checking file conflict status
 */
export interface ConflictCheckResult {
  success: boolean
  error?: string
  status?: FileSourceStatus
  content?: string
}

/**
 * Check if a file in the user's repo has been modified from the GGPrompts version
 * Detects based on presence of GGPrompts frontmatter
 */
export async function checkComponentConflict(
  filePath: string
): Promise<ConflictCheckResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Get sync data
  const { data: syncData } = await supabase
    .from('user_github_sync')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!syncData || !syncData.github_token_encrypted) {
    return { success: false, error: 'GitHub not connected' }
  }

  if (!syncData.repo_full_name) {
    return { success: false, error: 'Repository not configured' }
  }

  const token = syncData.github_token_encrypted
  const repoFullName = syncData.repo_full_name

  try {
    // Fetch the file content
    const response = await fetch(
      `https://api.github.com/repos/${repoFullName}/contents/${filePath}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GGPrompts'
        }
      }
    )

    if (response.status === 404) {
      return { success: true, status: 'not-found' }
    }

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch file' }
    }

    const fileData = await response.json()
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8')

    // Check for GGPrompts frontmatter
    const hasGGPromptsFrontmatter = content.includes('# Managed by GGPrompts')

    return {
      success: true,
      status: hasGGPromptsFrontmatter ? 'ggprompts' : 'user-modified',
      content
    }
  } catch (error) {
    console.error('Failed to check conflict:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Fetch a file's content from the user's GitHub repository
 */
export async function fetchFileContent(
  filePath: string
): Promise<{ success: boolean; error?: string; content?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Get sync data
  const { data: syncData } = await supabase
    .from('user_github_sync')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!syncData || !syncData.github_token_encrypted) {
    return { success: false, error: 'GitHub not connected' }
  }

  if (!syncData.repo_full_name) {
    return { success: false, error: 'Repository not configured' }
  }

  const token = syncData.github_token_encrypted
  const repoFullName = syncData.repo_full_name

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoFullName}/contents/${filePath}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GGPrompts'
        }
      }
    )

    if (response.status === 404) {
      return { success: false, error: 'File not found' }
    }

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch file' }
    }

    const fileData = await response.json()
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8')

    return { success: true, content }
  } catch (error) {
    console.error('Failed to fetch file:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}


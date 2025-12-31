import { createClient } from '@/lib/supabase/server'

const GITHUB_OWNER = 'GGPrompts'
const GITHUB_REPO = 'my-gg-plugins'
const GITHUB_BRANCH = 'main'

interface FileEntry {
  path: string
  content: string
}

interface Component {
  id: string
  slug: string
  name: string
  type: 'skill' | 'agent' | 'command'
  description: string
  content?: string
  files?: FileEntry[]
  author_name?: string
}

export interface ExportResult {
  componentId: string
  slug: string
  type: string
  status: 'created' | 'updated' | 'skipped' | 'error'
  message?: string
  path?: string
}

export interface ExportResponse {
  success: boolean
  exported: number
  skipped: number
  errors: number
  results: ExportResult[]
}

/**
 * Get file SHA if it exists (needed for updates)
 */
async function getFileSha(path: string, token: string): Promise<string | null> {
  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }
  )

  if (response.ok) {
    const data = await response.json()
    return data.sha
  }
  return null
}

/**
 * Create or update a file in the GitHub repository
 */
async function createOrUpdateFile(
  path: string,
  content: string,
  message: string,
  token: string
): Promise<{ success: boolean; created: boolean; error?: string }> {
  // Check if file exists to get SHA for update
  const existingSha = await getFileSha(path, token)

  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch: GITHUB_BRANCH
  }

  if (existingSha) {
    body.sha = existingSha
  }

  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify(body)
    }
  )

  if (!response.ok) {
    const error = await response.json()
    return {
      success: false,
      created: false,
      error: error.message || `HTTP ${response.status}`
    }
  }

  return {
    success: true,
    created: !existingSha
  }
}

/**
 * Generate markdown content for a component
 */
function generateMarkdownContent(component: Component): string {
  // If component has files with content, use the first file's content
  if (component.files && component.files.length > 0) {
    const mainFile = component.files.find(f =>
      f.path === 'SKILL.md' || f.path.endsWith('.md')
    )
    if (mainFile) {
      return mainFile.content
    }
  }

  // Otherwise generate from component fields
  const lines: string[] = []

  lines.push(`# ${component.name}`)
  lines.push('')
  lines.push(component.description)
  lines.push('')

  if (component.content) {
    lines.push(component.content)
  }

  return lines.join('\n')
}

/**
 * Get the file path for a component in the repository
 */
function getComponentPath(component: Component): string {
  switch (component.type) {
    case 'skill':
      return `skills/${component.slug}/SKILL.md`
    case 'agent':
      return `agents/${component.slug}.md`
    case 'command':
      return `commands/${component.slug}.md`
    default:
      throw new Error(`Unknown component type: ${component.type}`)
  }
}

/**
 * Export a single component to GitHub
 */
async function exportComponent(
  component: Component,
  token: string
): Promise<ExportResult> {
  try {
    const path = getComponentPath(component)
    const content = generateMarkdownContent(component)
    const message = `Add ${component.type}: ${component.name}\n\nSubmitted by ${component.author_name || 'community'}`

    const result = await createOrUpdateFile(path, content, message, token)

    if (result.success) {
      return {
        componentId: component.id,
        slug: component.slug,
        type: component.type,
        status: result.created ? 'created' : 'updated',
        path
      }
    } else {
      return {
        componentId: component.id,
        slug: component.slug,
        type: component.type,
        status: 'error',
        message: result.error,
        path
      }
    }
  } catch (error) {
    return {
      componentId: component.id,
      slug: component.slug,
      type: component.type,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Export all approved user-submitted components to GitHub.
 * Only exports components where author_name != 'GGPrompts' (user submissions).
 */
export async function exportApprovedComponentsToGitHub(): Promise<ExportResponse> {
  const token = process.env.GITHUB_EXPORT_TOKEN

  if (!token) {
    return {
      success: false,
      exported: 0,
      skipped: 0,
      errors: 1,
      results: [{
        componentId: '',
        slug: '',
        type: '',
        status: 'error',
        message: 'GITHUB_EXPORT_TOKEN environment variable not set'
      }]
    }
  }

  const supabase = await createClient()

  // Get approved components that are NOT official (user submissions only)
  const { data: components, error } = await supabase
    .from('components')
    .select('id, slug, name, type, description, content, files, author_name')
    .eq('status', 'approved')
    .neq('author_name', 'GGPrompts')
    .order('created_at', { ascending: true })

  if (error) {
    return {
      success: false,
      exported: 0,
      skipped: 0,
      errors: 1,
      results: [{
        componentId: '',
        slug: '',
        type: '',
        status: 'error',
        message: `Database error: ${error.message}`
      }]
    }
  }

  if (!components || components.length === 0) {
    return {
      success: true,
      exported: 0,
      skipped: 0,
      errors: 0,
      results: []
    }
  }

  const results: ExportResult[] = []

  for (const component of components) {
    const result = await exportComponent(component as Component, token)
    results.push(result)

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const exported = results.filter(r => r.status === 'created' || r.status === 'updated').length
  const skipped = results.filter(r => r.status === 'skipped').length
  const errors = results.filter(r => r.status === 'error').length

  return {
    success: errors === 0,
    exported,
    skipped,
    errors,
    results
  }
}

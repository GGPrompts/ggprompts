// GitHub API helper for Quick Notes integration

// ============================================================================
// TYPES
// ============================================================================

export interface GitHubFile {
  name: string
  path: string
  sha: string
  type: "file" | "dir"
  size?: number
  download_url?: string | null
}

export interface GitHubFileContent {
  content: string  // base64 encoded
  sha: string
  name: string
  path: string
  size: number
  encoding: string
}

export interface GitHubError {
  message: string
  status: number
}

// ============================================================================
// HELPERS
// ============================================================================

const GITHUB_API_BASE = "https://api.github.com"

function parseRepo(repo: string): { owner: string; repo: string } {
  const parts = repo.split("/")
  if (parts.length !== 2) {
    throw new Error("Invalid repo format. Expected 'owner/repo'")
  }
  return { owner: parts[0], repo: parts[1] }
}

async function githubFetch<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    const githubError: GitHubError = {
      message: error.message || response.statusText,
      status: response.status,
    }
    throw githubError
  }

  return response.json()
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Get contents of a directory or file from a GitHub repository
 */
export async function getContents(
  token: string,
  repo: string,
  path: string = ""
): Promise<GitHubFile[]> {
  const { owner, repo: repoName } = parseRepo(repo)
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  const endpoint = `/repos/${owner}/${repoName}/contents/${cleanPath}`

  const result = await githubFetch<GitHubFile | GitHubFile[]>(endpoint, token)

  // If it's a single file, wrap in array
  if (!Array.isArray(result)) {
    return [result]
  }

  // Sort: folders first, then files, both alphabetically
  return result.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name)
    }
    return a.type === "dir" ? -1 : 1
  })
}

/**
 * Get the content of a specific file
 */
export async function getFile(
  token: string,
  repo: string,
  path: string
): Promise<{ content: string; sha: string; name: string }> {
  const { owner, repo: repoName } = parseRepo(repo)
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  const endpoint = `/repos/${owner}/${repoName}/contents/${cleanPath}`

  const result = await githubFetch<GitHubFileContent>(endpoint, token)

  // Decode base64 content
  const content = decodeBase64(result.content)

  return {
    content,
    sha: result.sha,
    name: result.name,
  }
}

/**
 * Save (create or update) a file in the repository
 */
export async function saveFile(
  token: string,
  repo: string,
  path: string,
  content: string,
  sha: string | null,
  message: string
): Promise<{ sha: string }> {
  const { owner, repo: repoName } = parseRepo(repo)
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  const endpoint = `/repos/${owner}/${repoName}/contents/${cleanPath}`

  const body: {
    message: string
    content: string
    sha?: string
  } = {
    message,
    content: encodeBase64(content),
  }

  // Include SHA only for updates (not new files)
  if (sha) {
    body.sha = sha
  }

  const result = await githubFetch<{ content: GitHubFileContent }>(endpoint, token, {
    method: "PUT",
    body: JSON.stringify(body),
  })

  return { sha: result.content.sha }
}

/**
 * Delete a file from the repository
 */
export async function deleteFile(
  token: string,
  repo: string,
  path: string,
  sha: string,
  message: string
): Promise<void> {
  const { owner, repo: repoName } = parseRepo(repo)
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  const endpoint = `/repos/${owner}/${repoName}/contents/${cleanPath}`

  await githubFetch(endpoint, token, {
    method: "DELETE",
    body: JSON.stringify({
      message,
      sha,
    }),
  })
}

/**
 * Test connection to GitHub with the provided token
 */
export async function testConnection(
  token: string,
  repo: string
): Promise<{ success: boolean; repoName: string; error?: string }> {
  try {
    const { owner, repo: repoName } = parseRepo(repo)
    const result = await githubFetch<{ full_name: string; private: boolean }>(
      `/repos/${owner}/${repoName}`,
      token
    )
    return {
      success: true,
      repoName: result.full_name,
    }
  } catch (error) {
    const githubError = error as GitHubError
    let errorMessage = "Connection failed"

    if (githubError.status === 401) {
      errorMessage = "Invalid or expired token"
    } else if (githubError.status === 404) {
      errorMessage = "Repository not found or no access"
    } else if (githubError.status === 403) {
      errorMessage = "Rate limit exceeded or insufficient permissions"
    } else if (githubError.message) {
      errorMessage = githubError.message
    }

    return {
      success: false,
      repoName: "",
      error: errorMessage,
    }
  }
}

/**
 * Get the default branch of a repository
 */
export async function getDefaultBranch(
  token: string,
  repo: string
): Promise<string> {
  const { owner, repo: repoName } = parseRepo(repo)
  const result = await githubFetch<{ default_branch: string }>(
    `/repos/${owner}/${repoName}`,
    token
  )
  return result.default_branch
}

// ============================================================================
// BASE64 UTILITIES
// ============================================================================

/**
 * Encode string to base64 (handles UTF-8)
 */
function encodeBase64(str: string): string {
  // Use TextEncoder for proper UTF-8 handling
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)

  // Convert to binary string
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  return btoa(binary)
}

/**
 * Decode base64 to string (handles UTF-8)
 */
function decodeBase64(base64: string): string {
  // Remove any whitespace/newlines from GitHub's response
  const cleanBase64 = base64.replace(/\s/g, "")

  // Decode base64 to binary string
  const binary = atob(cleanBase64)

  // Convert to Uint8Array
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  // Decode UTF-8
  const decoder = new TextDecoder()
  return decoder.decode(bytes)
}

// ============================================================================
// LOCAL CACHE HELPERS
// ============================================================================

const CACHE_PREFIX = "github-notes-cache-"

export interface CachedFile {
  content: string
  sha: string
  path: string
  name: string
  cachedAt: number
}

/**
 * Cache a file locally for offline access
 */
export function cacheFile(file: CachedFile): void {
  try {
    localStorage.setItem(
      `${CACHE_PREFIX}${file.path}`,
      JSON.stringify(file)
    )
  } catch {
    // localStorage might be full, ignore
  }
}

/**
 * Get a cached file
 */
export function getCachedFile(path: string): CachedFile | null {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${path}`)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch {
    // Ignore parse errors
  }
  return null
}

/**
 * Get all cached file paths
 */
export function getCachedFilePaths(): string[] {
  const paths: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(CACHE_PREFIX)) {
      paths.push(key.replace(CACHE_PREFIX, ""))
    }
  }
  return paths
}

/**
 * Clear file cache
 */
export function clearFileCache(): void {
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key))
}

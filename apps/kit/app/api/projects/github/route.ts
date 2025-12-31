import { NextRequest, NextResponse } from "next/server"
import type { GitHubRepo } from "@/lib/projects"

export const dynamic = "force-dynamic"

const GITHUB_API_BASE = "https://api.github.com"

interface GitHubApiRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  clone_url: string
  ssh_url: string
  language: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  pushed_at: string
  created_at: string
  archived: boolean
  private: boolean
  default_branch: string
}

async function fetchAllRepos(token: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = []
  let page = 1
  const perPage = 100

  while (true) {
    const response = await fetch(
      `${GITHUB_API_BASE}/user/repos?per_page=${perPage}&page=${page}&sort=pushed&direction=desc`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `GitHub API error: ${response.status}`)
    }

    const data: GitHubApiRepo[] = await response.json()

    if (data.length === 0) break

    repos.push(
      ...data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        ssh_url: repo.ssh_url,
        language: repo.language,
        topics: repo.topics || [],
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        open_issues_count: repo.open_issues_count,
        pushed_at: repo.pushed_at,
        created_at: repo.created_at,
        archived: repo.archived,
        private: repo.private,
        default_branch: repo.default_branch,
      }))
    )

    // Check if we've received all repos
    if (data.length < perPage) break
    page++

    // Safety limit
    if (page > 10) break
  }

  return repos
}

export async function GET(request: NextRequest) {
  // Get token from Authorization header
  const authHeader = request.headers.get("Authorization")
  const token = authHeader?.replace("Bearer ", "")

  if (!token) {
    return NextResponse.json(
      { error: "Authorization token required" },
      { status: 401 }
    )
  }

  try {
    const repos = await fetchAllRepos(token)
    return NextResponse.json({ repos, count: repos.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch repos"
    console.error("GitHub API error:", message)

    // Handle rate limiting
    if (message.includes("rate limit")) {
      return NextResponse.json(
        { error: "GitHub API rate limit exceeded. Please try again later." },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

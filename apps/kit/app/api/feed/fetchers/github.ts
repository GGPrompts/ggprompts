import { FeedItem } from "../types"

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  owner: {
    login: string
  }
  stargazers_count: number
  language: string | null
  created_at: string
  topics: string[]
}

interface GitHubSearchResponse {
  items: GitHubRepo[]
  total_count: number
}

export async function fetchGitHub(limit: number = 10, page: number = 1): Promise<{ items: FeedItem[]; hasMore: boolean }> {
  try {
    // Get repos created in the last 7 days, sorted by stars
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const dateStr = weekAgo.toISOString().split("T")[0]

    const res = await fetch(
      `https://api.github.com/search/repositories?q=created:>${dateStr}&sort=stars&order=desc&per_page=${limit}&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Note: Without auth, rate limit is 60/hour
          // User-Agent is required by GitHub API
          "User-Agent": "personal-homepage-feed",
        },
        next: { revalidate: 900 }, // 15 min cache
      }
    )

    if (!res.ok) {
      if (res.status === 403) {
        console.warn("GitHub API rate limited")
        return { items: [], hasMore: false }
      }
      throw new Error(`GitHub API error: ${res.status}`)
    }

    const data: GitHubSearchResponse = await res.json()
    const hasMore = page * limit < data.total_count && page < 10 // GitHub limits to 1000 results (10 pages of 100)

    return {
      items: data.items.map((repo): FeedItem => ({
        id: `gh-${repo.id}`,
        title: repo.full_name,
        url: repo.html_url,
        source: "github",
        author: repo.owner.login,
        score: repo.stargazers_count,
        description: repo.description || undefined,
        tags: [
          ...(repo.language ? [repo.language.toLowerCase()] : []),
          ...repo.topics.slice(0, 3),
        ],
        createdAt: repo.created_at,
      })),
      hasMore,
    }
  } catch (error) {
    console.error("Failed to fetch GitHub:", error)
    return { items: [], hasMore: false }
  }
}

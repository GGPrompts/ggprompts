export type FeedSource = "hackernews" | "github" | "reddit" | "lobsters" | "devto"

export interface FeedItem {
  id: string
  title: string
  url: string
  source: FeedSource
  author?: string
  score: number
  commentCount?: number
  commentsUrl?: string
  createdAt: string
  subreddit?: string
  tags?: string[]
  description?: string
}

export interface FeedResponse {
  items: FeedItem[]
  fetchedAt: string
  sources: {
    source: FeedSource
    count: number
    error?: string
  }[]
  pagination: {
    page: number
    hasMore: boolean
    cursors?: Partial<Record<FeedSource, string>> // For cursor-based pagination (Reddit)
  }
}

export const SOURCE_CONFIG: Record<FeedSource, { name: string; limit: number }> = {
  hackernews: { name: "Hacker News", limit: 30 },
  github: { name: "GitHub", limit: 10 },
  reddit: { name: "Reddit", limit: 25 }, // 5 per subreddit
  lobsters: { name: "Lobsters", limit: 20 },
  devto: { name: "Dev.to", limit: 15 },
}

export const REDDIT_SUBREDDITS = [
  "commandline",
  "ClaudeAI",
  "ClaudeCode",
  "cli",
  "tui",
]

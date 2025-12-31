import { FeedItem } from "../types"

interface LobstersItem {
  short_id: string
  title: string
  url: string
  created_at: string
  score: number
  comment_count: number
  comments_url: string
  submitter_user: {
    username: string
  }
  tags: string[]
}

export async function fetchLobsters(limit: number = 20, page: number = 1): Promise<{ items: FeedItem[]; hasMore: boolean }> {
  try {
    // Lobsters hottest.json only returns ~25 items
    // For pagination, we use /page/N.json which shows newest
    const url = page === 1
      ? "https://lobste.rs/hottest.json"
      : `https://lobste.rs/page/${page}.json`

    const res = await fetch(url, {
      next: { revalidate: 900 }, // 15 min cache
    })

    if (!res.ok) {
      throw new Error(`Lobsters API error: ${res.status}`)
    }

    const items: LobstersItem[] = await res.json()
    const hasMore = items.length >= limit // Lobsters typically returns 25 items per page

    return {
      items: items.slice(0, limit).map((item): FeedItem => ({
        id: `lobsters-${item.short_id}`,
        title: item.title,
        url: item.url || item.comments_url, // Some are text posts
        source: "lobsters",
        author: item.submitter_user.username,
        score: item.score,
        commentCount: item.comment_count,
        commentsUrl: item.comments_url,
        createdAt: item.created_at,
        tags: item.tags,
      })),
      hasMore,
    }
  } catch (error) {
    console.error("Failed to fetch Lobsters:", error)
    return { items: [], hasMore: false }
  }
}

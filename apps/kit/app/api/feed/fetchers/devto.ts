import { FeedItem } from "../types"

interface DevToArticle {
  id: number
  title: string
  url: string
  published_at: string
  public_reactions_count: number
  comments_count: number
  user: {
    username: string
  }
  tag_list: string[]
  description: string
}

export async function fetchDevTo(limit: number = 15, page: number = 1): Promise<{ items: FeedItem[]; hasMore: boolean }> {
  try {
    // Fetch top articles from the past day
    const res = await fetch(
      `https://dev.to/api/articles?top=1&per_page=${limit}&page=${page}`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 900 }, // 15 min cache
      }
    )

    if (!res.ok) {
      throw new Error(`Dev.to API error: ${res.status}`)
    }

    const articles: DevToArticle[] = await res.json()
    const hasMore = articles.length >= limit

    return {
      items: articles.map((article): FeedItem => ({
        id: `devto-${article.id}`,
        title: article.title,
        url: article.url,
        source: "devto",
        author: article.user.username,
        score: article.public_reactions_count,
        commentCount: article.comments_count,
        commentsUrl: `${article.url}#comments`,
        createdAt: article.published_at,
        tags: article.tag_list.slice(0, 4),
        description: article.description,
      })),
      hasMore,
    }
  } catch (error) {
    console.error("Failed to fetch Dev.to:", error)
    return { items: [], hasMore: false }
  }
}

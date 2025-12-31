import { FeedItem, REDDIT_SUBREDDITS } from "../types"

interface RedditPost {
  data: {
    id: string
    title: string
    url: string
    permalink: string
    author: string
    score: number
    num_comments: number
    created_utc: number
    subreddit: string
    is_self: boolean
    selftext?: string
    link_flair_text?: string
  }
}

interface RedditResponse {
  data: {
    children: RedditPost[]
    after: string | null
  }
}

async function fetchSubreddit(
  subreddit: string,
  limit: number = 5,
  after?: string
): Promise<{ items: FeedItem[]; after: string | null }> {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}${after ? `&after=${after}` : ""}`
    const res = await fetch(url, {
      headers: {
        // Reddit requires a User-Agent
        "User-Agent": "personal-homepage-feed/1.0",
      },
      next: { revalidate: 900 }, // 15 min cache
    })

    if (!res.ok) {
      console.warn(`Reddit r/${subreddit} error: ${res.status}`)
      return { items: [], after: null }
    }

    const data: RedditResponse = await res.json()

    const items = data.data.children
      .filter((post) => {
        // Filter out stickied/pinned posts and ads
        const d = post.data
        return d.title && !d.title.includes("[Megathread]")
      })
      .map((post): FeedItem => {
        const d = post.data
        return {
          id: `reddit-${d.id}`,
          title: d.title,
          url: d.is_self
            ? `https://reddit.com${d.permalink}`
            : d.url,
          source: "reddit",
          author: d.author,
          score: d.score,
          commentCount: d.num_comments,
          commentsUrl: `https://reddit.com${d.permalink}`,
          createdAt: new Date(d.created_utc * 1000).toISOString(),
          subreddit: d.subreddit,
          tags: d.link_flair_text ? [d.link_flair_text.toLowerCase()] : [],
        }
      })

    return { items, after: data.data.after }
  } catch (error) {
    console.error(`Failed to fetch r/${subreddit}:`, error)
    return { items: [], after: null }
  }
}

// Cursors format: "subreddit1:after1,subreddit2:after2,..."
export async function fetchReddit(
  limitPerSubreddit: number = 5,
  customSubreddits?: string[],
  cursorsStr?: string
): Promise<{ items: FeedItem[]; hasMore: boolean; cursors: string }> {
  try {
    const subreddits = customSubreddits && customSubreddits.length > 0
      ? customSubreddits
      : REDDIT_SUBREDDITS

    // Parse cursors string into map
    const cursorsMap: Record<string, string> = {}
    if (cursorsStr) {
      cursorsStr.split(",").forEach((pair) => {
        const [sub, cursor] = pair.split(":")
        if (sub && cursor) cursorsMap[sub] = cursor
      })
    }

    // Fetch all subreddits in parallel
    const results = await Promise.all(
      subreddits.map((sub) =>
        fetchSubreddit(sub, limitPerSubreddit, cursorsMap[sub])
          .then((result) => ({ subreddit: sub, ...result }))
      )
    )

    // Build new cursors string
    const newCursors = results
      .filter((r) => r.after)
      .map((r) => `${r.subreddit}:${r.after}`)
      .join(",")

    // Check if any subreddit has more items
    const hasMore = results.some((r) => r.after !== null)

    // Flatten items
    const items = results.flatMap((r) => r.items)

    return { items, hasMore, cursors: newCursors }
  } catch (error) {
    console.error("Failed to fetch Reddit:", error)
    return { items: [], hasMore: false, cursors: "" }
  }
}

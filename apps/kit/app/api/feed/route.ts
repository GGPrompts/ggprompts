import { NextRequest, NextResponse } from "next/server"
import { FeedItem, FeedResponse, FeedSource, SOURCE_CONFIG } from "./types"
import { fetchHackerNews } from "./fetchers/hackernews"
import { fetchGitHub } from "./fetchers/github"
import { fetchReddit } from "./fetchers/reddit"
import { fetchLobsters } from "./fetchers/lobsters"
import { fetchDevTo } from "./fetchers/devto"

export const dynamic = "force-dynamic"
export const revalidate = 900 // 15 minutes

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sourcesParam = searchParams.get("sources")
  const subredditsParam = searchParams.get("subreddits")
  const pageParam = searchParams.get("page")
  const redditCursorsParam = searchParams.get("redditCursors")

  // Parse page number (default to 1)
  const page = Math.max(1, parseInt(pageParam || "1", 10))

  // Parse requested sources, default to all
  const requestedSources: FeedSource[] = sourcesParam
    ? (sourcesParam.split(",") as FeedSource[])
    : (Object.keys(SOURCE_CONFIG) as FeedSource[])

  // Parse custom subreddits if provided
  const customSubreddits = subredditsParam
    ? subredditsParam.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined

  // Validate sources
  const validSources = requestedSources.filter(
    (s) => s in SOURCE_CONFIG
  )

  if (validSources.length === 0) {
    return NextResponse.json(
      { error: "No valid sources specified" },
      { status: 400 }
    )
  }

  // Fetch from all requested sources in parallel
  const fetchPromises: Promise<{
    source: FeedSource
    items: FeedItem[]
    hasMore: boolean
    cursor?: string
    error?: string
  }>[] = []

  if (validSources.includes("hackernews")) {
    fetchPromises.push(
      fetchHackerNews(SOURCE_CONFIG.hackernews.limit, page)
        .then((result) => ({ source: "hackernews" as FeedSource, ...result }))
        .catch((e) => ({ source: "hackernews" as FeedSource, items: [], hasMore: false, error: e.message }))
    )
  }

  if (validSources.includes("github")) {
    fetchPromises.push(
      fetchGitHub(SOURCE_CONFIG.github.limit, page)
        .then((result) => ({ source: "github" as FeedSource, ...result }))
        .catch((e) => ({ source: "github" as FeedSource, items: [], hasMore: false, error: e.message }))
    )
  }

  if (validSources.includes("reddit")) {
    fetchPromises.push(
      fetchReddit(5, customSubreddits, redditCursorsParam || undefined) // 5 per subreddit
        .then((result) => ({ source: "reddit" as FeedSource, items: result.items, hasMore: result.hasMore, cursor: result.cursors }))
        .catch((e) => ({ source: "reddit" as FeedSource, items: [], hasMore: false, error: e.message }))
    )
  }

  if (validSources.includes("lobsters")) {
    fetchPromises.push(
      fetchLobsters(SOURCE_CONFIG.lobsters.limit, page)
        .then((result) => ({ source: "lobsters" as FeedSource, ...result }))
        .catch((e) => ({ source: "lobsters" as FeedSource, items: [], hasMore: false, error: e.message }))
    )
  }

  if (validSources.includes("devto")) {
    fetchPromises.push(
      fetchDevTo(SOURCE_CONFIG.devto.limit, page)
        .then((result) => ({ source: "devto" as FeedSource, ...result }))
        .catch((e) => ({ source: "devto" as FeedSource, items: [], hasMore: false, error: e.message }))
    )
  }

  const results = await Promise.all(fetchPromises)

  // Combine all items
  const allItems: FeedItem[] = results.flatMap((r) => r.items)

  // Sort by score (descending) then by date (newest first)
  allItems.sort((a, b) => {
    // Normalize scores across sources (HN/Reddit scores vs GitHub stars)
    const scoreA = a.score
    const scoreB = b.score

    if (scoreB !== scoreA) {
      return scoreB - scoreA
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  // Check if any source has more items
  const hasMore = results.some((r) => r.hasMore)

  // Build cursors object for sources that need it (Reddit)
  const cursors: Partial<Record<FeedSource, string>> = {}
  const redditResult = results.find((r) => r.source === "reddit")
  if (redditResult?.cursor) {
    cursors.reddit = redditResult.cursor
  }

  const response: FeedResponse = {
    items: allItems,
    fetchedAt: new Date().toISOString(),
    sources: results.map((r) => ({
      source: r.source,
      count: r.items.length,
      error: r.error,
    })),
    pagination: {
      page,
      hasMore,
      cursors: Object.keys(cursors).length > 0 ? cursors : undefined,
    },
  }

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
    },
  })
}

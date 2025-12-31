import { NextRequest, NextResponse } from 'next/server'
import { TrendingVideo } from '@/lib/news/types'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

// In-memory cache with TTL
interface CacheEntry {
  data: TrendingVideo[]
  timestamp: number
}

const cache: Map<string, CacheEntry> = new Map()
const CACHE_TTL = 4 * 60 * 60 * 1000 // 4 hours in ms

// Default search queries for AI coding content
const DEFAULT_QUERIES = [
  'Claude Code tutorial',
  'AI prompt engineering',
  'Cursor AI coding',
  'AI coding assistant',
]

// Parse ISO 8601 duration to seconds
function parseDurationToSeconds(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = match[1] ? parseInt(match[1]) : 0
  const minutes = match[2] ? parseInt(match[2]) : 0
  const seconds = match[3] ? parseInt(match[3]) : 0

  return hours * 3600 + minutes * 60 + seconds
}

// Convert ISO 8601 duration to readable format
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return ''

  const hours = match[1] ? parseInt(match[1]) : 0
  const minutes = match[2] ? parseInt(match[2]) : 0
  const seconds = match[3] ? parseInt(match[3]) : 0

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Search YouTube for videos
async function searchVideos(query: string, maxResults: number = 5): Promise<string[]> {
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    order: 'viewCount',
    publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
    maxResults: maxResults.toString(),
    key: YOUTUBE_API_KEY!,
  })

  const response = await fetch(`${YOUTUBE_API_BASE}/search?${params}`)
  if (!response.ok) {
    throw new Error(`YouTube search failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data.items?.map((item: { id: { videoId: string } }) => item.id.videoId) || []
}

// Get video details (view count, duration, etc.)
async function getVideoDetails(videoIds: string[]): Promise<TrendingVideo[]> {
  if (videoIds.length === 0) return []

  const params = new URLSearchParams({
    part: 'snippet,statistics,contentDetails',
    id: videoIds.join(','),
    key: YOUTUBE_API_KEY!,
  })

  const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`)
  if (!response.ok) {
    throw new Error(`YouTube video details failed: ${response.statusText}`)
  }

  const data = await response.json()

  return data.items?.map((item: {
    id: string
    snippet: {
      title: string
      channelTitle: string
      channelId: string
      thumbnails: { high?: { url: string }, medium?: { url: string }, default?: { url: string } }
      publishedAt: string
    }
    statistics: { viewCount: string }
    contentDetails: { duration: string }
  }) => ({
    id: item.id,
    title: item.snippet.title,
    channelName: item.snippet.channelTitle,
    channelUrl: `https://www.youtube.com/channel/${item.snippet.channelId}`,
    thumbnailUrl: item.snippet.thumbnails.high?.url ||
                  item.snippet.thumbnails.medium?.url ||
                  item.snippet.thumbnails.default?.url || '',
    videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
    viewCount: parseInt(item.statistics.viewCount) || 0,
    publishedAt: item.snippet.publishedAt,
    duration: formatDuration(item.contentDetails.duration),
    durationSeconds: parseDurationToSeconds(item.contentDetails.duration),
  })) || []
}

export async function GET(request: NextRequest) {
  // Check for API key
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: 'YouTube API key not configured' },
      { status: 500 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const queries = searchParams.get('queries')?.split(',') || DEFAULT_QUERIES
  const limit = Math.min(parseInt(searchParams.get('limit') || '4'), 10)
  const minDuration = parseInt(searchParams.get('minDuration') || '0') // minimum duration in seconds
  const skipCache = searchParams.get('skipCache') === 'true'

  // Generate cache key from queries and minDuration
  const cacheKey = `${queries.sort().join('|')}|min:${minDuration}`

  // Check cache
  if (!skipCache) {
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        videos: cached.data.slice(0, limit),
        cached: true,
        cachedAt: new Date(cached.timestamp).toISOString(),
      })
    }
  }

  try {
    // Search for videos across all queries
    const allVideoIds: string[] = []
    const seenIds = new Set<string>()

    for (const query of queries) {
      const videoIds = await searchVideos(query.trim(), 3)
      for (const id of videoIds) {
        if (!seenIds.has(id)) {
          seenIds.add(id)
          allVideoIds.push(id)
        }
      }
    }

    // Get full details for all videos
    const videos = await getVideoDetails(allVideoIds)

    // Filter by minimum duration, sort by view count
    const sortedVideos = videos
      .filter((v) => (v.durationSeconds ?? 0) >= minDuration)
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10) // Keep top 10 for cache

    // Update cache
    cache.set(cacheKey, {
      data: sortedVideos,
      timestamp: Date.now(),
    })

    return NextResponse.json({
      videos: sortedVideos.slice(0, limit),
      cached: false,
      fetchedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('YouTube API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

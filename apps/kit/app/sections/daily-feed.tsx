"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import {
  RefreshCw,
  ExternalLink,
  MessageSquare,
  ArrowUpRight,
  Flame,
  Github,
  MessageCircle,
  Bug,
  Code2,
  Settings2,
  Plus,
  X,
  Clock,
  TrendingUp,
  AlertCircle,
  Bookmark,
  EyeOff,
  Trash2,
  Star,
  ArrowDownWideNarrow,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ============================================================================
// TYPES
// ============================================================================

type FeedSource = "hackernews" | "github" | "reddit" | "lobsters" | "devto"
type SortOption = "trending" | "newest" | "top"

interface FeedItem {
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

interface FeedResponse {
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
    cursors?: Partial<Record<FeedSource, string>>
  }
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SOURCE_CONFIG: Record<FeedSource, {
  name: string
  icon: React.ElementType
  color: string
  bg: string
}> = {
  hackernews: { name: "Hacker News", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  github: { name: "GitHub", icon: Github, color: "text-white", bg: "bg-white/10" },
  reddit: { name: "Reddit", icon: MessageCircle, color: "text-orange-400", bg: "bg-orange-400/10" },
  lobsters: { name: "Lobsters", icon: Bug, color: "text-red-500", bg: "bg-red-500/10" },
  devto: { name: "Dev.to", icon: Code2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
}

const DEFAULT_SUBREDDITS = ["commandline", "ClaudeAI", "ClaudeCode", "cli", "tui"]

const STORAGE_KEY = "daily-feed-preferences"

// Fetch function for useQuery - routes through server API
async function fetchFeedData(
  enabledSources: FeedSource[],
  subreddits?: string[],
  page: number = 1,
  redditCursors?: string,
): Promise<FeedResponse> {
  const params = new URLSearchParams()

  if (enabledSources.length > 0) {
    params.set("sources", enabledSources.join(","))
  }

  // Pass custom subreddits to server
  if (subreddits && subreddits.length > 0 && enabledSources.includes("reddit")) {
    params.set("subreddits", subreddits.join(","))
  }

  // Pagination parameters
  if (page > 1) {
    params.set("page", page.toString())
  }

  if (redditCursors) {
    params.set("redditCursors", redditCursors)
  }

  const url = `/api/feed${params.toString() ? `?${params}` : ""}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch feed: ${res.status}`)
  }

  return res.json()
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}

function formatScore(score: number): string {
  if (score >= 1000) {
    return `${(score / 1000).toFixed(1)}k`
  }
  return score.toString()
}

// ============================================================================
// FEED CARD COMPONENT
// ============================================================================

function FeedCard({
  item,
  isSaved,
  onSave,
  onHide,
  onRemove,
  showRemove = false,
  itemIndex,
}: {
  item: FeedItem
  isSaved: boolean
  onSave: () => void
  onHide: () => void
  onRemove?: () => void
  showRemove?: boolean
  itemIndex: number
}) {
  const config = SOURCE_CONFIG[item.source]
  const Icon = config.icon

  return (
    <Card className="glass border-white/10 p-4 hover:border-primary/30 transition-colors group" data-tabz-item={`feed-${itemIndex}`}>
      <div className="flex items-start gap-3">
        {/* Source Icon */}
        <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2 group-hover:underline"
            data-tabz-action="open-link"
          >
            {item.title}
            <ExternalLink className="inline-block ml-1 h-3 w-3 opacity-0 group-hover:opacity-50" />
          </a>

          {/* Description (for GitHub repos) */}
          {item.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {item.description}
            </p>
          )}

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
            {/* Source Badge */}
            <Badge variant="outline" className={`${config.color} border-current/30 text-xs py-0`}>
              {config.name}
            </Badge>

            {/* Subreddit (Reddit only) */}
            {item.subreddit && (
              <span className="text-orange-400">r/{item.subreddit}</span>
            )}

            {/* Score */}
            <span className="flex items-center gap-1">
              {item.source === "github" ? (
                <Star className="h-3 w-3 text-yellow-500" />
              ) : (
                <TrendingUp className="h-3 w-3" />
              )}
              {formatScore(item.score)}
            </span>

            {/* Comments */}
            {item.commentCount !== undefined && item.commentsUrl && (
              <a
                href={item.commentsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
                data-tabz-action="open-link"
              >
                <MessageSquare className="h-3 w-3" />
                {item.commentCount}
              </a>
            )}

            {/* Time */}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(item.createdAt)}
            </span>

            {/* Author */}
            {item.author && (
              <span className="hidden sm:inline">by {item.author}</span>
            )}
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.slice(0, 4).map((tag, tagIndex) => (
                <Badge
                  key={`${tag}-${tagIndex}`}
                  variant="secondary"
                  className="text-xs py-0 bg-primary/10 text-primary/80"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          {/* Save Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${isSaved ? "text-primary" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
            onClick={onSave}
            title={isSaved ? "Remove from saved" : "Save for later"}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>

          {/* Hide Button */}
          {!showRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
              onClick={onHide}
              title="Hide this item"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          )}

          {/* Remove Button (for saved view) */}
          {showRemove && onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
              onClick={onRemove}
              title="Remove from saved"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// SUBREDDIT SETTINGS
// ============================================================================

function SubredditSettings({
  subreddits,
  onUpdate,
}: {
  subreddits: string[]
  onUpdate: (subreddits: string[]) => void
}) {
  const [newSubreddit, setNewSubreddit] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)

  const addSubreddit = () => {
    const cleaned = newSubreddit.trim().replace(/^r\//, "")
    if (cleaned && !subreddits.includes(cleaned)) {
      onUpdate([...subreddits, cleaned])
      setNewSubreddit("")
    }
  }

  const removeSubreddit = (sub: string) => {
    onUpdate(subreddits.filter((s) => s !== sub))
  }

  const resetToDefaults = () => {
    onUpdate(DEFAULT_SUBREDDITS)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Subreddits</span>
          <Badge variant="secondary" className="ml-1">{subreddits.length}</Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 glass border-white/10" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Reddit Subreddits</h4>
            <p className="text-xs text-muted-foreground">
              Add or remove subreddits to customize your feed
            </p>
          </div>

          <Separator className="bg-white/10" />

          {/* Add New */}
          <div className="flex gap-2">
            <Input
              placeholder="subreddit name"
              value={newSubreddit}
              onChange={(e) => setNewSubreddit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSubreddit()}
              className="flex-1"
            />
            <Button size="icon" onClick={addSubreddit} disabled={!newSubreddit.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Current Subreddits */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {subreddits.map((sub) => (
              <div
                key={sub}
                className="flex items-center justify-between p-2 rounded-lg bg-white/5"
              >
                <span className="text-sm">r/{sub}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-red-400"
                  onClick={() => removeSubreddit(sub)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <Separator className="bg-white/10" />

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={resetToDefaults}
          >
            Reset to Defaults
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ============================================================================
// SOURCE TOGGLE
// ============================================================================

function SourceToggle({
  enabledSources,
  onToggle,
}: {
  enabledSources: FeedSource[]
  onToggle: (source: FeedSource) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Sources</span>
          <Badge variant="secondary" className="ml-1">{enabledSources.length}/5</Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 glass border-white/10" align="end">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-1">Content Sources</h4>
            <p className="text-xs text-muted-foreground">
              Toggle sources to include in your feed
            </p>
          </div>

          <Separator className="bg-white/10" />

          {(Object.keys(SOURCE_CONFIG) as FeedSource[]).map((source) => {
            const config = SOURCE_CONFIG[source]
            const Icon = config.icon
            const isEnabled = enabledSources.includes(source)

            return (
              <div
                key={source}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${config.bg}`}>
                    <Icon className={`h-3 w-3 ${config.color}`} />
                  </div>
                  <span className="text-sm">{config.name}</span>
                </div>
                <Checkbox
                  checked={isEnabled}
                  onCheckedChange={() => onToggle(source)}
                />
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DailyFeedSection({
  activeSubItem,
  onSubItemHandled
}: {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
}) {
  // Filter state
  const [viewMode, setViewMode] = React.useState<"all" | "saved" | "filtered">("all")
  const [selectedSources, setSelectedSources] = React.useState<Set<FeedSource>>(new Set())
  const [enabledSources, setEnabledSources] = React.useState<FeedSource[]>([
    "hackernews", "github", "reddit", "lobsters", "devto"
  ])
  const [subreddits, setSubreddits] = React.useState<string[]>(DEFAULT_SUBREDDITS)
  const [sortBy, setSortBy] = React.useState<SortOption>("trending")
  const [prefsLoaded, setPrefsLoaded] = React.useState(false)

  // Saved/Hidden state
  const [savedItems, setSavedItems] = React.useState<Set<string>>(new Set())
  const [hiddenItems, setHiddenItems] = React.useState<Set<string>>(new Set())
  const [savedItemsData, setSavedItemsData] = React.useState<Map<string, FeedItem>>(new Map())

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const [accumulatedItems, setAccumulatedItems] = React.useState<FeedItem[]>([])
  const [redditCursors, setRedditCursors] = React.useState<string | undefined>()
  const [hasMore, setHasMore] = React.useState(true)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)

  // Load preferences from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const prefs = JSON.parse(saved)
        if (prefs.enabledSources) setEnabledSources(prefs.enabledSources)
        if (prefs.subreddits) setSubreddits(prefs.subreddits)
        if (prefs.savedItems) setSavedItems(new Set(prefs.savedItems))
        if (prefs.hiddenItems) setHiddenItems(new Set(prefs.hiddenItems))
        if (prefs.savedItemsData) setSavedItemsData(new Map(Object.entries(prefs.savedItemsData)))
        if (prefs.sortBy) setSortBy(prefs.sortBy)
      }
    } catch (e) {
      console.error("Failed to load preferences:", e)
    }
    setPrefsLoaded(true)
  }, [])

  // Feed data query with TanStack Query - all sources via server API
  const subredditsKey = JSON.stringify(subreddits)
  const {
    data: feedData,
    isLoading: loading,
    error,
    refetch: fetchFeed,
  } = useQuery({
    queryKey: ["feed", enabledSources, subredditsKey],
    queryFn: () => fetchFeedData(enabledSources, subreddits),
    staleTime: 15 * 60 * 1000, // Data fresh for 15 minutes (matches server cache)
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes
    enabled: prefsLoaded, // Only fetch after preferences are loaded
  })

  // Update accumulated items when initial data loads
  React.useEffect(() => {
    if (feedData?.items) {
      setAccumulatedItems(feedData.items)
      setHasMore(feedData.pagination?.hasMore ?? false)
      setRedditCursors(feedData.pagination?.cursors?.reddit)
      setCurrentPage(1)
    }
  }, [feedData])

  // Reset pagination when sources or subreddits change
  React.useEffect(() => {
    setCurrentPage(1)
    setAccumulatedItems([])
    setRedditCursors(undefined)
    setHasMore(true)
  }, [enabledSources, subredditsKey])

  // Load more items
  const loadMore = React.useCallback(async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    try {
      const nextPage = currentPage + 1
      const moreData = await fetchFeedData(enabledSources, subreddits, nextPage, redditCursors)

      // Dedupe items by id
      const existingIds = new Set(accumulatedItems.map((item) => item.id))
      const newItems = moreData.items.filter((item) => !existingIds.has(item.id))

      setAccumulatedItems((prev) => [...prev, ...newItems])
      setCurrentPage(nextPage)
      setHasMore(moreData.pagination?.hasMore ?? false)
      setRedditCursors(moreData.pagination?.cursors?.reddit)
    } catch (err) {
      console.error("Failed to load more items:", err)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMore, currentPage, enabledSources, subreddits, redditCursors, accumulatedItems])

  const items = accumulatedItems.length > 0 ? accumulatedItems : (feedData?.items ?? [])
  const fetchedAt = feedData?.fetchedAt ?? null
  const sourceStats = feedData?.sources ?? []

  // Save preferences to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        enabledSources,
        subreddits,
        savedItems: Array.from(savedItems),
        hiddenItems: Array.from(hiddenItems),
        savedItemsData: Object.fromEntries(savedItemsData),
        sortBy,
      }))
    } catch (e) {
      console.error("Failed to save preferences:", e)
    }
  }, [enabledSources, subreddits, savedItems, hiddenItems, savedItemsData, sortBy])

  // Save/Hide handlers
  const toggleSave = (item: FeedItem) => {
    setSavedItems((prev) => {
      const next = new Set(prev)
      if (next.has(item.id)) {
        next.delete(item.id)
      } else {
        next.add(item.id)
        // Also store the item data
        setSavedItemsData((prevData) => {
          const nextData = new Map(prevData)
          nextData.set(item.id, item)
          return nextData
        })
      }
      return next
    })
  }

  const hideItem = (itemId: string) => {
    setHiddenItems((prev) => new Set(prev).add(itemId))
  }

  const removeFromSaved = (itemId: string) => {
    setSavedItems((prev) => {
      const next = new Set(prev)
      next.delete(itemId)
      return next
    })
    setSavedItemsData((prev) => {
      const next = new Map(prev)
      next.delete(itemId)
      return next
    })
  }

  const clearHidden = () => {
    setHiddenItems(new Set())
  }

  // Toggle source selection for multi-select filtering
  const toggleSourceFilter = (source: FeedSource) => {
    setSelectedSources((prev) => {
      const next = new Set(prev)
      if (next.has(source)) {
        next.delete(source)
        // If no sources selected, go back to "all" mode
        if (next.size === 0) {
          setViewMode("all")
        }
      } else {
        next.add(source)
        setViewMode("filtered")
      }
      return next
    })
  }

  // Select only one source (for quick single-select)
  const selectSingleSource = (source: FeedSource) => {
    setSelectedSources(new Set([source]))
    setViewMode("filtered")
  }

  // Clear source filters and show all
  const showAll = () => {
    setSelectedSources(new Set())
    setViewMode("all")
  }

  // Show saved items
  const showSaved = () => {
    setSelectedSources(new Set())
    setViewMode("saved")
  }

  // Handle sub-item navigation from sidebar
  React.useEffect(() => {
    if (activeSubItem) {
      const timer = setTimeout(() => {
        if (activeSubItem === "saved") {
          showSaved()
        } else if (activeSubItem === "refresh") {
          fetchFeed()
        } else if (activeSubItem === "sources") {
          // Switch back to All view and scroll to toolbar
          showAll()
          const element = document.getElementById("feed-toolbar")
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }
        onSubItemHandled?.()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [activeSubItem, onSubItemHandled, fetchFeed])

  // Toggle source
  const toggleSource = (source: FeedSource) => {
    setEnabledSources((prev) => {
      if (prev.includes(source)) {
        // Don't allow disabling all sources
        if (prev.length === 1) return prev
        return prev.filter((s) => s !== source)
      }
      return [...prev, source]
    })
  }

  // Sort function
  const sortItems = React.useCallback((itemsToSort: FeedItem[]) => {
    const sorted = [...itemsToSort]
    switch (sortBy) {
      case "top":
        // Sort by score (highest first)
        return sorted.sort((a, b) => b.score - a.score)
      case "newest":
        // Sort by date (newest first)
        return sorted.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      case "trending":
      default:
        // Trending: score weighted by recency (higher score + more recent = better)
        // Using a decay factor based on hours since posted
        return sorted.sort((a, b) => {
          const now = Date.now()
          const hoursA = (now - new Date(a.createdAt).getTime()) / (1000 * 60 * 60)
          const hoursB = (now - new Date(b.createdAt).getTime()) / (1000 * 60 * 60)
          // Gravity/decay factor (similar to HN algorithm)
          const gravity = 1.8
          const trendingA = a.score / Math.pow(hoursA + 2, gravity)
          const trendingB = b.score / Math.pow(hoursB + 2, gravity)
          return trendingB - trendingA
        })
    }
  }, [sortBy])

  // Filter items
  const filteredItems = React.useMemo(() => {
    // For saved view, show saved items from storage
    if (viewMode === "saved") {
      return sortItems(Array.from(savedItemsData.values()))
    }

    // Deduplicate items by source+id (in case API returns duplicates)
    const seen = new Set<string>()
    const uniqueItems = items.filter((item) => {
      const key = `${item.source}-${item.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    // Filter out hidden items
    const visibleItems = uniqueItems.filter((item) => !hiddenItems.has(item.id))

    // If "all" mode or no sources selected, show all visible items
    if (viewMode === "all" || selectedSources.size === 0) {
      return sortItems(visibleItems)
    }

    // Filter by selected sources (multi-select)
    return sortItems(visibleItems.filter((item) => selectedSources.has(item.source)))
  }, [items, viewMode, selectedSources, hiddenItems, savedItemsData, sortItems])

  // Get counts per source
  const sourceCounts = React.useMemo(() => {
    const visibleItems = items.filter((item) => !hiddenItems.has(item.id))
    const counts: Record<string, number> = { all: visibleItems.length, saved: savedItems.size }
    visibleItems.forEach((item) => {
      counts[item.source] = (counts[item.source] || 0) + 1
    })
    return counts
  }, [items, hiddenItems, savedItems.size])

  return (
    <div className="p-6 h-full flex flex-col" data-tabz-section="daily-feed">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold terminal-glow mb-1">Daily Feed</h1>
          <p className="text-muted-foreground text-sm">
            {fetchedAt ? (
              <>Updated {timeAgo(fetchedAt)} &middot; {items.length} items{currentPage > 1 && ` (page ${currentPage})`}</>
            ) : (
              "Aggregated content from across the web"
            )}
          </p>
        </div>

        <div id="feed-toolbar" className="flex items-center gap-2 scroll-mt-6">
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-[130px] h-9">
              <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Trending
                </div>
              </SelectItem>
              <SelectItem value="newest">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Newest
                </div>
              </SelectItem>
              <SelectItem value="top">
                <div className="flex items-center gap-2">
                  <Star className="h-3.5 w-3.5" />
                  Top Rated
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <SourceToggle enabledSources={enabledSources} onToggle={toggleSource} />
          <SubredditSettings subreddits={subreddits} onUpdate={setSubreddits} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchFeed()}
            disabled={loading}
            className="gap-2"
            data-tabz-action="refresh-feed"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Source Filter Tabs - Multi-select */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 flex flex-wrap items-center gap-2">
          {/* All Button */}
          <Button
            variant={viewMode === "all" ? "default" : "ghost"}
            size="sm"
            onClick={showAll}
            className={`gap-1.5 ${viewMode === "all" ? "" : "opacity-70 hover:opacity-100"}`}
            data-tabz-action="filter-all"
          >
            All
            <Badge variant="secondary" className="ml-1 text-xs bg-white/10">{sourceCounts.all || 0}</Badge>
          </Button>

          {/* Saved Button */}
          <Button
            variant={viewMode === "saved" ? "default" : "ghost"}
            size="sm"
            onClick={showSaved}
            className={`gap-1.5 ${viewMode === "saved" ? "" : "opacity-70 hover:opacity-100"}`}
            data-tabz-action="filter-saved"
          >
            <Bookmark className={`h-3.5 w-3.5 ${viewMode === "saved" ? "" : "text-muted-foreground"}`} />
            <span className="hidden sm:inline">Saved</span>
            <Badge variant="secondary" className="ml-1 text-xs bg-white/10">{sourceCounts.saved || 0}</Badge>
          </Button>

          <Separator orientation="vertical" className="h-6 bg-white/20" />

          {/* Source Filters - Multi-select */}
          {(Object.keys(SOURCE_CONFIG) as FeedSource[]).map((source) => {
            const config = SOURCE_CONFIG[source]
            const Icon = config.icon
            const count = sourceCounts[source] || 0
            const isSelected = selectedSources.has(source)

            if (!enabledSources.includes(source)) return null

            return (
              <Button
                key={source}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                onClick={() => toggleSourceFilter(source)}
                className={`gap-1.5 ${isSelected ? "" : "opacity-70 hover:opacity-100"}`}
                title="Click to toggle filter"
                data-tabz-action={`filter-${source}`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? "" : "text-muted-foreground"}`} />
                <span className="hidden sm:inline">{config.name}</span>
                <Badge variant="secondary" className="ml-1 text-xs bg-white/10">{count}</Badge>
              </Button>
            )
          })}
        </div>

        {/* Clear Hidden Button */}
        {hiddenItems.size > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearHidden}
            className="gap-1 text-xs"
          >
            <EyeOff className="h-3 w-3" />
            Clear {hiddenItems.size} hidden
          </Button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="glass border-red-500/30 rounded-lg p-4 mb-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-400">Failed to load feed</p>
            <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : "Unknown error"}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchFeed()} className="ml-auto">
            Retry
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && items.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your feed...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && !error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center glass rounded-lg p-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No items found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try enabling more sources or adjusting your subreddits
            </p>
            <Button variant="outline" onClick={() => fetchFeed()}>
              Refresh Feed
            </Button>
          </div>
        </div>
      )}

      {/* Feed List */}
      {filteredItems.length > 0 && (
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-3 pb-6 pr-1" data-tabz-list="feed-items">
            {filteredItems.map((item, index) => (
              <FeedCard
                key={`${item.source}-${item.id}`}
                item={item}
                isSaved={savedItems.has(item.id)}
                onSave={() => toggleSave(item)}
                onHide={() => hideItem(item.id)}
                onRemove={() => removeFromSaved(item.id)}
                showRemove={viewMode === "saved"}
                itemIndex={index}
              />
            ))}

            {/* Load More Button */}
            {viewMode !== "saved" && hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Loading more...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Load More
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      {/* Source Stats Footer */}
      {sourceStats.length > 0 && !loading && (
        <div className="pt-4 border-t border-white/10 mt-auto">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {sourceStats.map((stat) => {
              const config = SOURCE_CONFIG[stat.source]
              const Icon = config.icon
              return (
                <div key={stat.source} className="flex items-center gap-1">
                  <Icon className={`h-3 w-3 ${stat.error ? "text-red-400" : config.color}`} />
                  <span>
                    {config.name}: {stat.error ? "error" : stat.count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

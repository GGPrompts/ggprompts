"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/components/AuthProvider"
import { motion, AnimatePresence } from "framer-motion"
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  Star,
  GitFork,
  Eye,
  Code,
  Activity,
  Clock,
  RefreshCw,
  Search,
  Filter,
  ExternalLink,
  User,
  Calendar,
  Folder,
  MessageSquare,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  CircleDot,
  X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface GitHubActivityProps {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
}

interface GitHubEvent {
  id: string
  type: string
  actor: {
    login: string
    avatar_url: string
  }
  repo: {
    name: string
    url: string
  }
  payload: {
    action?: string
    ref?: string
    ref_type?: string
    commits?: Array<{
      sha: string
      message: string
    }>
    pull_request?: {
      title: string
      number: number
      html_url: string
    }
    issue?: {
      title: string
      number: number
      html_url: string
    }
    comment?: {
      body: string
      html_url: string
    }
    forkee?: {
      full_name: string
      html_url: string
    }
    release?: {
      tag_name: string
      name: string
      html_url: string
    }
  }
  created_at: string
}

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  language: string | null
  updated_at: string
  pushed_at: string
  topics: string[]
  fork: boolean
  archived: boolean
  visibility: string
  default_branch: string
  open_issues_count: number
}

interface GitHubUser {
  login: string
  avatar_url: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  html_url: string
  created_at: string
}

type EventFilter = "all" | "push" | "pr" | "issue" | "star" | "fork" | "create" | "comment"

const STORAGE_KEY = "github-username"
const DEFAULT_USERNAME = "mattvr"

const EVENT_FILTERS: { value: EventFilter; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All", icon: <Activity className="h-3 w-3" /> },
  { value: "push", label: "Commits", icon: <GitCommit className="h-3 w-3" /> },
  { value: "pr", label: "PRs", icon: <GitPullRequest className="h-3 w-3" /> },
  { value: "issue", label: "Issues", icon: <CircleDot className="h-3 w-3" /> },
  { value: "star", label: "Stars", icon: <Star className="h-3 w-3" /> },
  { value: "fork", label: "Forks", icon: <GitFork className="h-3 w-3" /> },
  { value: "create", label: "Creates", icon: <GitBranch className="h-3 w-3" /> },
  { value: "comment", label: "Comments", icon: <MessageSquare className="h-3 w-3" /> },
]

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
}

// ============================================================================
// HOOKS
// ============================================================================

function useUsername() {
  const { user, loading: authLoading, getGitHubToken } = useAuth()
  const [username, setUsername] = useState<string>(DEFAULT_USERNAME)
  const [isLoaded, setIsLoaded] = useState(false)

  // Get the authenticated user's GitHub username
  const authUsername = user?.user_metadata?.user_name as string | undefined

  // Check if we're viewing our own profile
  const isOwnProfile = !!authUsername && username.toLowerCase() === authUsername.toLowerCase()

  // Get GitHub username from authenticated user or localStorage
  useEffect(() => {
    if (authLoading) return

    // Priority: 1) authenticated GitHub user, 2) localStorage, 3) default
    const saved = localStorage.getItem(STORAGE_KEY)

    if (authUsername) {
      setUsername(authUsername)
    } else if (saved) {
      setUsername(saved)
    }
    setIsLoaded(true)
  }, [user, authLoading, authUsername])

  // Save to localStorage on change (only if manually changed, not from auth)
  useEffect(() => {
    if (isLoaded && username) {
      localStorage.setItem(STORAGE_KEY, username)
    }
  }, [username, isLoaded])

  return { username, setUsername, isLoaded, isOwnProfile, getGitHubToken }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function timeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return `${Math.floor(seconds / 604800)}w ago`
}

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

function getEventTypeFilter(eventType: string): EventFilter {
  switch (eventType) {
    case "PushEvent":
      return "push"
    case "PullRequestEvent":
    case "PullRequestReviewEvent":
    case "PullRequestReviewCommentEvent":
      return "pr"
    case "IssuesEvent":
      return "issue"
    case "WatchEvent":
      return "star"
    case "ForkEvent":
      return "fork"
    case "CreateEvent":
    case "DeleteEvent":
      return "create"
    case "IssueCommentEvent":
    case "CommitCommentEvent":
      return "comment"
    default:
      return "all"
  }
}

function getEventIcon(eventType: string): React.ReactNode {
  switch (eventType) {
    case "PushEvent":
      return <GitCommit className="h-4 w-4 text-emerald-500" />
    case "PullRequestEvent":
    case "PullRequestReviewEvent":
    case "PullRequestReviewCommentEvent":
      return <GitPullRequest className="h-4 w-4 text-purple-500" />
    case "IssuesEvent":
      return <CircleDot className="h-4 w-4 text-green-500" />
    case "WatchEvent":
      return <Star className="h-4 w-4 text-yellow-500" />
    case "ForkEvent":
      return <GitFork className="h-4 w-4 text-cyan-500" />
    case "CreateEvent":
      return <GitBranch className="h-4 w-4 text-blue-500" />
    case "DeleteEvent":
      return <X className="h-4 w-4 text-red-500" />
    case "IssueCommentEvent":
    case "CommitCommentEvent":
      return <MessageSquare className="h-4 w-4 text-orange-500" />
    case "ReleaseEvent":
      return <BookOpen className="h-4 w-4 text-pink-500" />
    default:
      return <Activity className="h-4 w-4 text-muted-foreground" />
  }
}

function getEventDescription(event: GitHubEvent): string {
  const { type, payload, repo } = event
  const repoName = repo.name.split("/")[1] || repo.name

  switch (type) {
    case "PushEvent":
      const commitCount = payload.commits?.length || 0
      if (commitCount === 0) return `Updated branch in ${repoName}`
      return `Pushed ${commitCount} commit${commitCount !== 1 ? "s" : ""} to ${repoName}`
    case "PullRequestEvent":
      return `${payload.action === "opened" ? "Opened" : payload.action === "closed" ? "Closed" : "Updated"} PR #${payload.pull_request?.number} in ${repoName}`
    case "IssuesEvent":
      return `${payload.action === "opened" ? "Opened" : payload.action === "closed" ? "Closed" : "Updated"} issue #${payload.issue?.number} in ${repoName}`
    case "WatchEvent":
      return `Starred ${repoName}`
    case "ForkEvent":
      return `Forked ${repoName}`
    case "CreateEvent":
      if (payload.ref_type === "repository") return `Created repository ${repoName}`
      return `Created ${payload.ref_type} ${payload.ref} in ${repoName}`
    case "DeleteEvent":
      return `Deleted ${payload.ref_type} ${payload.ref} in ${repoName}`
    case "IssueCommentEvent":
      return `Commented on issue #${payload.issue?.number} in ${repoName}`
    case "CommitCommentEvent":
      return `Commented on a commit in ${repoName}`
    case "PullRequestReviewEvent":
      return `Reviewed PR #${payload.pull_request?.number} in ${repoName}`
    case "PullRequestReviewCommentEvent":
      return `Commented on PR #${payload.pull_request?.number} in ${repoName}`
    case "ReleaseEvent":
      return `Released ${payload.release?.tag_name} in ${repoName}`
    default:
      return `${type.replace("Event", "")} in ${repoName}`
  }
}

function generateActivityData(events: GitHubEvent[]): { day: string; count: number; level: number }[] {
  // Generate last 52 weeks of data (simplified contribution graph)
  const now = new Date()
  const data: { day: string; count: number; level: number }[] = []

  // Count events by date
  const eventCounts = new Map<string, number>()
  events.forEach((event) => {
    const date = new Date(event.created_at).toISOString().split("T")[0]
    eventCounts.set(date, (eventCounts.get(date) || 0) + 1)
  })

  // Generate last 91 days (13 weeks)
  for (let i = 90; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    const count = eventCounts.get(dateStr) || 0
    const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4
    data.push({ day: dateStr, count, level })
  }

  return data
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function GitHubActivity({ activeSubItem, onSubItemHandled }: GitHubActivityProps) {
  const queryClient = useQueryClient()
  const { username, setUsername, isLoaded, isOwnProfile, getGitHubToken } = useUsername()

  const [usernameInput, setUsernameInput] = useState(username)
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)
  const [eventFilter, setEventFilter] = useState<EventFilter>("all")
  const [repoSearch, setRepoSearch] = useState("")
  const [repoSort, setRepoSort] = useState<"updated" | "stars" | "name">("updated")
  const [showRepoDetails, setShowRepoDetails] = useState(false)

  // Sync username input with stored username
  useEffect(() => {
    if (isLoaded) {
      setUsernameInput(username)
    }
  }, [username, isLoaded])

  // Handle sub-item navigation
  useEffect(() => {
    if (activeSubItem) {
      onSubItemHandled?.()
    }
  }, [activeSubItem, onSubItemHandled])

  // Fetch user profile
  const { data: userData, isLoading: userLoading, error: userError } = useQuery<GitHubUser>({
    queryKey: ["github-user", username, isOwnProfile],
    queryFn: async () => {
      const headers: HeadersInit = {}
      if (isOwnProfile) {
        const token = await getGitHubToken()
        if (token) headers.Authorization = `Bearer ${token}`
      }
      const res = await fetch(`https://api.github.com/users/${username}`, { headers })
      if (!res.ok) {
        if (res.status === 404) throw new Error("User not found")
        if (res.status === 403) throw new Error("Rate limited - try again later")
        throw new Error("Failed to fetch user")
      }
      return res.json()
    },
    enabled: isLoaded && !!username,
    staleTime: 300000, // 5 minutes
    retry: false,
  })

  // Fetch events (includes private events when viewing own profile with auth)
  const { data: eventsData, isLoading: eventsLoading, refetch: refetchEvents } = useQuery<GitHubEvent[]>({
    queryKey: ["github-events", username, isOwnProfile],
    queryFn: async () => {
      const headers: HeadersInit = {}
      // Use authenticated endpoint for own profile to see private activity
      let url = `https://api.github.com/users/${username}/events/public?per_page=100`
      if (isOwnProfile) {
        const token = await getGitHubToken()
        if (token) {
          headers.Authorization = `Bearer ${token}`
          // Remove /public to get all events including private
          url = `https://api.github.com/users/${username}/events?per_page=100`
        }
      }
      const res = await fetch(url, { headers })
      if (!res.ok) {
        if (res.status === 404) throw new Error("User not found")
        if (res.status === 403) throw new Error("Rate limited")
        throw new Error("Failed to fetch events")
      }
      return res.json()
    },
    enabled: isLoaded && !!username,
    staleTime: 60000, // 1 minute
    retry: false,
  })

  // Fetch repositories (includes private repos when viewing own profile with auth)
  const { data: reposData, isLoading: reposLoading, refetch: refetchRepos } = useQuery<GitHubRepo[]>({
    queryKey: ["github-repos", username, isOwnProfile],
    queryFn: async () => {
      const headers: HeadersInit = {}
      // Use authenticated endpoint for own profile to see private repos
      let url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
      if (isOwnProfile) {
        const token = await getGitHubToken()
        if (token) {
          headers.Authorization = `Bearer ${token}`
          // Use /user/repos to get all repos including private
          url = `https://api.github.com/user/repos?sort=pushed&per_page=100&affiliation=owner`
        }
      }
      const res = await fetch(url, { headers })
      if (!res.ok) {
        if (res.status === 404) throw new Error("User not found")
        if (res.status === 403) throw new Error("Rate limited")
        throw new Error("Failed to fetch repos")
      }
      return res.json()
    },
    enabled: isLoaded && !!username,
    staleTime: 300000, // 5 minutes
    retry: false,
  })

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (!eventsData) return []
    if (eventFilter === "all") return eventsData
    return eventsData.filter((event) => getEventTypeFilter(event.type) === eventFilter)
  }, [eventsData, eventFilter])

  // Filtered and sorted repos
  const filteredRepos = useMemo(() => {
    if (!reposData) return []
    let repos = [...reposData]

    // Filter by search
    if (repoSearch) {
      const search = repoSearch.toLowerCase()
      repos = repos.filter(
        (repo) =>
          repo.name.toLowerCase().includes(search) ||
          repo.description?.toLowerCase().includes(search) ||
          repo.language?.toLowerCase().includes(search) ||
          repo.topics?.some((t) => t.toLowerCase().includes(search))
      )
    }

    // Sort
    switch (repoSort) {
      case "stars":
        return repos.sort((a, b) => b.stargazers_count - a.stargazers_count)
      case "name":
        return repos.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return repos.sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    }
  }, [reposData, repoSearch, repoSort])

  // Activity visualization data
  const activityData = useMemo(() => {
    return generateActivityData(eventsData || [])
  }, [eventsData])

  // Event counts by type
  const eventCounts = useMemo(() => {
    const counts: Record<EventFilter, number> = {
      all: 0,
      push: 0,
      pr: 0,
      issue: 0,
      star: 0,
      fork: 0,
      create: 0,
      comment: 0,
    }
    eventsData?.forEach((event) => {
      counts.all++
      const filter = getEventTypeFilter(event.type)
      counts[filter]++
    })
    return counts
  }, [eventsData])

  // Stats
  const stats = useMemo(() => {
    if (!reposData) return { totalStars: 0, totalForks: 0, languages: new Map<string, number>() }
    const languages = new Map<string, number>()
    let totalStars = 0
    let totalForks = 0
    reposData.forEach((repo) => {
      if (!repo.fork) {
        totalStars += repo.stargazers_count
        totalForks += repo.forks_count
        if (repo.language) {
          languages.set(repo.language, (languages.get(repo.language) || 0) + 1)
        }
      }
    })
    return { totalStars, totalForks, languages }
  }, [reposData])

  // Handle username change
  const handleUsernameSubmit = () => {
    if (usernameInput && usernameInput !== username) {
      setUsername(usernameInput)
      setSelectedRepo(null)
    }
  }

  // Refresh all data
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["github-user", username] })
    refetchEvents()
    refetchRepos()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground terminal-glow">GitHub Activity</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track public GitHub activity and repositories</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Input
              placeholder="GitHub username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUsernameSubmit()}
              className="w-40"
            />
            <Button variant="outline" size="sm" onClick={handleUsernameSubmit}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error State */}
      {userError && (
        <Card className="glass border-red-500/50 bg-red-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-red-500">
                  {userError instanceof Error ? userError.message : "Failed to load user"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Check the username and try again
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Profile Card */}
      {userData && (
        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={userData.avatar_url}
                  alt={userData.login}
                  className="h-16 w-16 rounded-full border-2 border-primary/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">{userData.name || userData.login}</h2>
                    <a
                      href={userData.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">@{userData.login}</p>
                  {userData.bio && (
                    <p className="mt-1 text-sm text-muted-foreground max-w-md">{userData.bio}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {isOwnProfile && reposData ? reposData.length : userData.public_repos}
                  </p>
                  <p className="text-xs text-muted-foreground">Repos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{formatNumber(userData.followers)}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{formatNumber(userData.following)}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-500">{formatNumber(stats.totalStars)}</p>
                  <p className="text-xs text-muted-foreground">Total Stars</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Visualization */}
      {activityData.length > 0 && (
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Activity (Last 13 Weeks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {activityData.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.005 }}
                  title={`${day.day}: ${day.count} events`}
                  className={`h-3 w-3 rounded-sm ${
                    day.level === 0
                      ? "bg-muted/30"
                      : day.level === 1
                        ? "bg-emerald-900/50"
                        : day.level === 2
                          ? "bg-emerald-700/70"
                          : day.level === 3
                            ? "bg-emerald-500/80"
                            : "bg-emerald-400"
                  }`}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-end gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="h-3 w-3 rounded-sm bg-muted/30" />
                <div className="h-3 w-3 rounded-sm bg-emerald-900/50" />
                <div className="h-3 w-3 rounded-sm bg-emerald-700/70" />
                <div className="h-3 w-3 rounded-sm bg-emerald-500/80" />
                <div className="h-3 w-3 rounded-sm bg-emerald-400" />
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Feed */}
        <Card className="glass border-border flex flex-col h-[680px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <Badge variant="outline">{eventCounts.all} events</Badge>
            </div>
            {/* Event Type Filters */}
            <div className="mt-3 flex flex-wrap gap-1">
              {EVENT_FILTERS.map((filter) => (
                <Button
                  key={filter.value}
                  variant={eventFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEventFilter(filter.value)}
                  className="gap-1 h-7 text-xs"
                >
                  {filter.icon}
                  {filter.label}
                  {filter.value !== "all" && eventCounts[filter.value] > 0 && (
                    <span className="ml-1 text-[10px] opacity-70">({eventCounts[filter.value]})</span>
                  )}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {eventsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <Activity className="h-8 w-8 mb-2" />
                  <p>No activity found</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="space-y-2 px-3 py-2">
                    {filteredEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-lg border border-border p-3 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getEventIcon(event.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{getEventDescription(event)}</p>
                            {event.payload.commits && event.payload.commits.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {event.payload.commits.slice(0, 3).map((commit) => (
                                  <div key={commit.sha} className="flex items-start gap-2 text-xs">
                                    <a
                                      href={`https://github.com/${event.repo.name}/commit/${commit.sha}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-muted-foreground font-mono hover:text-primary transition-colors"
                                    >
                                      {commit.sha.slice(0, 7)}
                                    </a>
                                    <span className="text-muted-foreground truncate">
                                      {commit.message.split("\n")[0]}
                                    </span>
                                  </div>
                                ))}
                                {event.payload.commits.length > 3 && (
                                  <p className="text-xs text-muted-foreground">
                                    +{event.payload.commits.length - 3} more commits
                                  </p>
                                )}
                              </div>
                            )}
                            {event.payload.pull_request && (
                              <a
                                href={event.payload.pull_request.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                {event.payload.pull_request.title}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {event.payload.issue && (
                              <a
                                href={event.payload.issue.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                {event.payload.issue.title}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            <div className="mt-1 flex items-center gap-2">
                              <a
                                href={`https://github.com/${event.repo.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                              >
                                <Folder className="h-3 w-3" />
                                {event.repo.name}
                              </a>
                              <span className="text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {timeAgo(event.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Repositories */}
        <Card className="glass border-border flex flex-col h-[680px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Repositories
              </CardTitle>
              <Badge variant="outline">{reposData?.length || 0} repos</Badge>
            </div>
            <div className="mt-3 space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search repositories..."
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={repoSort === "updated" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRepoSort("updated")}
                >
                  Recent
                </Button>
                <Button
                  variant={repoSort === "stars" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRepoSort("stars")}
                >
                  Stars
                </Button>
                <Button
                  variant={repoSort === "name" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRepoSort("name")}
                >
                  Name
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {reposLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredRepos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <Folder className="h-8 w-8 mb-2" />
                  <p>No repositories found</p>
                </div>
              ) : (
                <div className="space-y-2 px-3 py-2">
                  {filteredRepos.map((repo) => (
                    <motion.div
                      key={repo.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => {
                        setSelectedRepo(repo)
                        setShowRepoDetails(true)
                      }}
                      className={`cursor-pointer rounded-lg border p-3 transition-all ${
                        selectedRepo?.id === repo.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground truncate">{repo.name}</p>
                            {repo.fork && (
                              <Badge variant="outline" className="h-5 text-xs">
                                <GitFork className="h-3 w-3 mr-1" />
                                Fork
                              </Badge>
                            )}
                            {repo.archived && (
                              <Badge variant="secondary" className="h-5 text-xs">
                                Archived
                              </Badge>
                            )}
                          </div>
                          {repo.description && (
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                              {repo.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-3 flex-wrap">
                            {repo.language && (
                              <div className="flex items-center gap-1">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{
                                    backgroundColor: LANGUAGE_COLORS[repo.language] || "#8b949e",
                                  }}
                                />
                                <span className="text-xs text-muted-foreground">{repo.language}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="h-3 w-3" />
                              {formatNumber(repo.stargazers_count)}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <GitFork className="h-3 w-3" />
                              {formatNumber(repo.forks_count)}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Updated {timeAgo(repo.pushed_at)}
                            </span>
                          </div>
                          {repo.topics && repo.topics.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {repo.topics.slice(0, 4).map((topic) => (
                                <Badge key={topic} variant="secondary" className="h-5 text-xs">
                                  {topic}
                                </Badge>
                              ))}
                              {repo.topics.length > 4 && (
                                <Badge variant="outline" className="h-5 text-xs">
                                  +{repo.topics.length - 4}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="ml-2 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Repository Details Modal */}
      <AnimatePresence>
        {showRepoDetails && selectedRepo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowRepoDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <Card className="glass border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {selectedRepo.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRepoDetails(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedRepo.description && (
                    <p className="text-sm text-muted-foreground">{selectedRepo.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted/30 p-3 text-center">
                      <Star className="h-5 w-5 mx-auto text-yellow-500" />
                      <p className="mt-1 text-xl font-bold text-foreground">
                        {formatNumber(selectedRepo.stargazers_count)}
                      </p>
                      <p className="text-xs text-muted-foreground">Stars</p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-3 text-center">
                      <GitFork className="h-5 w-5 mx-auto text-cyan-500" />
                      <p className="mt-1 text-xl font-bold text-foreground">
                        {formatNumber(selectedRepo.forks_count)}
                      </p>
                      <p className="text-xs text-muted-foreground">Forks</p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-3 text-center">
                      <Eye className="h-5 w-5 mx-auto text-purple-500" />
                      <p className="mt-1 text-xl font-bold text-foreground">
                        {formatNumber(selectedRepo.watchers_count)}
                      </p>
                      <p className="text-xs text-muted-foreground">Watchers</p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-3 text-center">
                      <CircleDot className="h-5 w-5 mx-auto text-green-500" />
                      <p className="mt-1 text-xl font-bold text-foreground">
                        {selectedRepo.open_issues_count}
                      </p>
                      <p className="text-xs text-muted-foreground">Open Issues</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    {selectedRepo.language && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Language</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor: LANGUAGE_COLORS[selectedRepo.language] || "#8b949e",
                            }}
                          />
                          <span className="text-sm font-medium">{selectedRepo.language}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Default Branch</span>
                      <Badge variant="outline">{selectedRepo.default_branch}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Visibility</span>
                      <Badge variant="secondary">{selectedRepo.visibility}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Push</span>
                      <span className="text-sm">{formatDate(selectedRepo.pushed_at)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Updated</span>
                      <span className="text-sm">{formatDate(selectedRepo.updated_at)}</span>
                    </div>
                  </div>

                  {selectedRepo.topics && selectedRepo.topics.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Topics</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedRepo.topics.map((topic) => (
                            <Badge key={topic} variant="secondary">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    className="w-full gap-2"
                    onClick={() => window.open(selectedRepo.html_url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on GitHub
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Statistics */}
      {stats.languages.size > 0 && (
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Array.from(stats.languages.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([lang, count]) => (
                  <motion.div
                    key={lang}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: LANGUAGE_COLORS[lang] || "#8b949e" }}
                    />
                    <span className="text-sm font-medium">{lang}</span>
                    <Badge variant="secondary" className="h-5 text-xs">
                      {count}
                    </Badge>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

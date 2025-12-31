"use client"

import * as React from "react"
import {
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Clock,
  Star,
  FolderOpen,
  Code2,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCw,
  Save,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { JsonViewer } from "@/components/JsonViewer"
import { useAuth } from "@/components/AuthProvider"

// ============================================================================
// TYPES
// ============================================================================

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
type AuthType = "none" | "bearer" | "basic" | "apikey"
type BodyType = "none" | "json" | "form-urlencoded" | "raw"

interface KeyValuePair {
  id: string
  key: string
  value: string
  enabled: boolean
}

interface RequestConfig {
  method: HttpMethod
  url: string
  params: KeyValuePair[]
  headers: KeyValuePair[]
  body: {
    type: BodyType
    content: string
  }
  auth: {
    type: AuthType
    token: string
    username: string
    password: string
    apiKeyName: string
    apiKeyValue: string
  }
}

interface ResponseData {
  status: number
  statusText: string
  time: number
  size: number
  headers: Record<string, string>
  body: string
}

interface HistoryItem {
  id: string
  method: HttpMethod
  url: string
  status: number
  time: number
  timestamp: Date
  starred: boolean
}

interface SavedRequest {
  id: string
  name: string
  method: HttpMethod
  url: string
  config: RequestConfig
}

interface Collection {
  id: string
  name: string
  requests: SavedRequest[]
  expanded: boolean
}

interface HealthStatus {
  status: number | null // null = not checked, 0 = error
  time: number
  checkedAt: Date
}

// ============================================================================
// CONSTANTS
// ============================================================================

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  POST: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  PUT: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  PATCH: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  DELETE: "text-red-400 bg-red-400/10 border-red-400/30",
}

const DEFAULT_CONFIG: RequestConfig = {
  method: "GET",
  url: "https://jsonplaceholder.typicode.com/posts/1",
  params: [],
  headers: [
    { id: "1", key: "Content-Type", value: "application/json", enabled: true },
  ],
  body: {
    type: "none",
    content: "",
  },
  auth: {
    type: "none",
    token: "",
    username: "",
    password: "",
    apiKeyName: "X-API-Key",
    apiKeyValue: "",
  },
}

const SAMPLE_COLLECTIONS: Collection[] = [
  {
    id: "weather",
    name: "Weather APIs",
    expanded: true,
    requests: [
      {
        id: "w1",
        name: "Current Weather",
        method: "GET",
        url: "https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=fahrenheit&timezone=auto",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=fahrenheit&timezone=auto",
        },
      },
      {
        id: "w2",
        name: "7-Day Forecast",
        method: "GET",
        url: "https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&temperature_unit=fahrenheit&timezone=auto&forecast_days=7",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&temperature_unit=fahrenheit&timezone=auto&forecast_days=7",
        },
      },
      {
        id: "w3",
        name: "Air Quality",
        method: "GET",
        url: "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=37.7749&longitude=-122.4194&current=us_aqi,pm2_5,pm10,ozone,carbon_monoxide",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=37.7749&longitude=-122.4194&current=us_aqi,pm2_5,pm10,ozone,carbon_monoxide",
        },
      },
      {
        id: "w4",
        name: "Geocoding Search",
        method: "GET",
        url: "https://geocoding-api.open-meteo.com/v1/search?name=San%20Francisco&count=5&language=en&format=json",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://geocoding-api.open-meteo.com/v1/search?name=San%20Francisco&count=5&language=en&format=json",
        },
      },
      {
        id: "w5",
        name: "Reverse Geocoding",
        method: "GET",
        url: "https://nominatim.openstreetmap.org/reverse?lat=37.7749&lon=-122.4194&format=json",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://nominatim.openstreetmap.org/reverse?lat=37.7749&lon=-122.4194&format=json",
          headers: [
            { id: "1", key: "User-Agent", value: "PersonalHomepage/1.0", enabled: true },
          ],
        },
      },
      {
        id: "w6",
        name: "Weather Alerts (NWS)",
        method: "GET",
        url: "https://api.weather.gov/alerts/active?point=37.7749,-122.4194",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://api.weather.gov/alerts/active?point=37.7749,-122.4194",
          headers: [
            { id: "1", key: "User-Agent", value: "PersonalHomepage/1.0", enabled: true },
            { id: "2", key: "Accept", value: "application/geo+json", enabled: true },
          ],
        },
      },
      {
        id: "w7",
        name: "Radar Tiles",
        method: "GET",
        url: "https://api.rainviewer.com/public/weather-maps.json",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://api.rainviewer.com/public/weather-maps.json",
        },
      },
    ],
  },
  {
    id: "feed",
    name: "Feed APIs",
    expanded: false,
    requests: [
      {
        id: "f1",
        name: "HN Top Stories",
        method: "GET",
        url: "https://hacker-news.firebaseio.com/v0/topstories.json",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://hacker-news.firebaseio.com/v0/topstories.json",
        },
      },
      {
        id: "f2",
        name: "HN Story Details",
        method: "GET",
        url: "https://hacker-news.firebaseio.com/v0/item/1.json",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://hacker-news.firebaseio.com/v0/item/1.json",
        },
      },
      {
        id: "f3",
        name: "GitHub Trending",
        method: "GET",
        url: "https://api.github.com/search/repositories?q=created:>2024-01-01&sort=stars&order=desc&per_page=10",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://api.github.com/search/repositories?q=created:>2024-01-01&sort=stars&order=desc&per_page=10",
          headers: [
            { id: "1", key: "Accept", value: "application/vnd.github.v3+json", enabled: true },
            { id: "2", key: "User-Agent", value: "personal-homepage-feed", enabled: true },
          ],
        },
      },
      {
        id: "f4",
        name: "Reddit Hot Posts",
        method: "GET",
        url: "https://www.reddit.com/r/commandline/hot.json?limit=5",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://www.reddit.com/r/commandline/hot.json?limit=5",
          headers: [
            { id: "1", key: "User-Agent", value: "personal-homepage-feed/1.0", enabled: true },
          ],
        },
      },
      {
        id: "f5",
        name: "Lobsters Hottest",
        method: "GET",
        url: "https://lobste.rs/hottest.json",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://lobste.rs/hottest.json",
        },
      },
      {
        id: "f6",
        name: "Dev.to Articles",
        method: "GET",
        url: "https://dev.to/api/articles?top=1&per_page=15",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://dev.to/api/articles?top=1&per_page=15",
          headers: [
            { id: "1", key: "Accept", value: "application/json", enabled: true },
          ],
        },
      },
    ],
  },
  {
    id: "internal",
    name: "Internal APIs",
    expanded: false,
    requests: [
      {
        id: "i1",
        name: "Feed Aggregator",
        method: "GET",
        url: "/api/feed",
        config: {
          ...DEFAULT_CONFIG,
          url: "/api/feed",
        },
      },
      {
        id: "i2",
        name: "Feed (HN + GitHub)",
        method: "GET",
        url: "/api/feed?sources=hackernews,github",
        config: {
          ...DEFAULT_CONFIG,
          url: "/api/feed?sources=hackernews,github",
        },
      },
    ],
  },
  {
    id: "github-content",
    name: "GitHub Content API",
    expanded: false,
    requests: [
      {
        id: "gh1",
        name: "Get Repository Info",
        method: "GET",
        url: "https://api.github.com/repos/OWNER/REPO",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://api.github.com/repos/OWNER/REPO",
          headers: [
            { id: "1", key: "Accept", value: "application/vnd.github.v3+json", enabled: true },
            { id: "2", key: "User-Agent", value: "PersonalHomepage/1.0", enabled: true },
          ],
          auth: {
            ...DEFAULT_CONFIG.auth,
            type: "bearer",
            token: "",
          },
        },
      },
      {
        id: "gh2",
        name: "List Directory Contents",
        method: "GET",
        url: "https://api.github.com/repos/OWNER/REPO/contents/PATH",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://api.github.com/repos/OWNER/REPO/contents/PATH",
          headers: [
            { id: "1", key: "Accept", value: "application/vnd.github.v3+json", enabled: true },
            { id: "2", key: "User-Agent", value: "PersonalHomepage/1.0", enabled: true },
          ],
          auth: {
            ...DEFAULT_CONFIG.auth,
            type: "bearer",
            token: "",
          },
        },
      },
      {
        id: "gh3",
        name: "Get File Content",
        method: "GET",
        url: "https://api.github.com/repos/OWNER/REPO/contents/README.md",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://api.github.com/repos/OWNER/REPO/contents/README.md",
          headers: [
            { id: "1", key: "Accept", value: "application/vnd.github.v3+json", enabled: true },
            { id: "2", key: "User-Agent", value: "PersonalHomepage/1.0", enabled: true },
          ],
          auth: {
            ...DEFAULT_CONFIG.auth,
            type: "bearer",
            token: "",
          },
        },
      },
      {
        id: "gh4",
        name: "Create/Update File",
        method: "PUT",
        url: "https://api.github.com/repos/OWNER/REPO/contents/PATH",
        config: {
          ...DEFAULT_CONFIG,
          method: "PUT",
          url: "https://api.github.com/repos/OWNER/REPO/contents/PATH",
          headers: [
            { id: "1", key: "Accept", value: "application/vnd.github.v3+json", enabled: true },
            { id: "2", key: "User-Agent", value: "PersonalHomepage/1.0", enabled: true },
          ],
          body: {
            type: "json",
            content: `{
  "message": "Update file via API",
  "content": "BASE64_ENCODED_CONTENT",
  "sha": "FILE_SHA_FOR_UPDATES"
}`,
          },
          auth: {
            ...DEFAULT_CONFIG.auth,
            type: "bearer",
            token: "",
          },
        },
      },
      {
        id: "gh5",
        name: "Delete File",
        method: "DELETE",
        url: "https://api.github.com/repos/OWNER/REPO/contents/PATH",
        config: {
          ...DEFAULT_CONFIG,
          method: "DELETE",
          url: "https://api.github.com/repos/OWNER/REPO/contents/PATH",
          headers: [
            { id: "1", key: "Accept", value: "application/vnd.github.v3+json", enabled: true },
            { id: "2", key: "User-Agent", value: "PersonalHomepage/1.0", enabled: true },
          ],
          body: {
            type: "json",
            content: `{
  "message": "Delete file via API",
  "sha": "FILE_SHA_REQUIRED"
}`,
          },
          auth: {
            ...DEFAULT_CONFIG.auth,
            type: "bearer",
            token: "",
          },
        },
      },
    ],
  },
  {
    id: "stocks",
    name: "Stocks APIs",
    expanded: false,
    requests: [
      {
        id: "s1",
        name: "Get Quotes (Watchlist)",
        method: "GET",
        url: "/api/stocks?symbols=AAPL,MSFT,GOOGL,NVDA",
        config: {
          ...DEFAULT_CONFIG,
          url: "/api/stocks?symbols=AAPL,MSFT,GOOGL,NVDA",
        },
      },
      {
        id: "s2",
        name: "Get Single Quote",
        method: "GET",
        url: "/api/stocks?symbols=AAPL&metrics=true",
        config: {
          ...DEFAULT_CONFIG,
          url: "/api/stocks?symbols=AAPL&metrics=true",
        },
      },
      {
        id: "s3",
        name: "Historical Data (1D)",
        method: "GET",
        url: "/api/stocks/history?symbol=AAPL&timeframe=1D",
        config: {
          ...DEFAULT_CONFIG,
          url: "/api/stocks/history?symbol=AAPL&timeframe=1D",
        },
      },
      {
        id: "s4",
        name: "Historical Data (1M)",
        method: "GET",
        url: "/api/stocks/history?symbol=AAPL&timeframe=1M",
        config: {
          ...DEFAULT_CONFIG,
          url: "/api/stocks/history?symbol=AAPL&timeframe=1M",
        },
      },
      {
        id: "s5",
        name: "Historical Data (1Y)",
        method: "GET",
        url: "/api/stocks/history?symbol=AAPL&timeframe=1Y",
        config: {
          ...DEFAULT_CONFIG,
          url: "/api/stocks/history?symbol=AAPL&timeframe=1Y",
        },
      },
      {
        id: "s6",
        name: "Search Stocks",
        method: "GET",
        url: "/api/stocks/search?q=apple",
        config: {
          ...DEFAULT_CONFIG,
          url: "/api/stocks/search?q=apple",
        },
      },
      {
        id: "s7",
        name: "API Status",
        method: "GET",
        url: "/api/status",
        config: {
          ...DEFAULT_CONFIG,
          url: "/api/status",
        },
      },
    ],
  },
  {
    id: "spacex",
    name: "SpaceX API",
    expanded: false,
    requests: [
      {
        id: "sx1",
        name: "Next Launch",
        method: "GET",
        url: "https://api.spacexdata.com/v5/launches/next",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://api.spacexdata.com/v5/launches/next",
        },
      },
      {
        id: "sx2",
        name: "Upcoming Launches",
        method: "GET",
        url: "https://api.spacexdata.com/v5/launches/upcoming",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://api.spacexdata.com/v5/launches/upcoming",
        },
      },
      {
        id: "sx3",
        name: "Past Launches",
        method: "GET",
        url: "https://api.spacexdata.com/v5/launches/past",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://api.spacexdata.com/v5/launches/past",
        },
      },
      {
        id: "sx4",
        name: "All Rockets",
        method: "GET",
        url: "https://api.spacexdata.com/v4/rockets",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://api.spacexdata.com/v4/rockets",
        },
      },
      {
        id: "sx5",
        name: "All Launchpads",
        method: "GET",
        url: "https://api.spacexdata.com/v4/launchpads",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://api.spacexdata.com/v4/launchpads",
        },
      },
      {
        id: "sx6",
        name: "Company Info",
        method: "GET",
        url: "https://api.spacexdata.com/v4/company",
        config: {
          ...DEFAULT_CONFIG,
          url: "https://api.spacexdata.com/v4/company",
        },
      },
    ],
  },
  {
    id: "ai",
    name: "AI APIs",
    expanded: false,
    requests: [
      {
        id: "ai1",
        name: "List Available Models",
        method: "GET",
        url: "/api/ai/models",
        config: {
          ...DEFAULT_CONFIG,
          url: "/api/ai/models",
        },
      },
      {
        id: "ai2",
        name: "Chat Completion",
        method: "POST",
        url: "/api/ai/chat",
        config: {
          ...DEFAULT_CONFIG,
          method: "POST",
          url: "/api/ai/chat",
          body: {
            type: "json",
            content: `{
  "messages": [
    { "role": "user", "content": "Hello, what can you help me with?" }
  ],
  "model": "claude-sonnet",
  "temperature": 0.7
}`,
          },
        },
      },
    ],
  },
  {
    id: "jobs",
    name: "Claude Jobs API",
    expanded: false,
    requests: [
      {
        id: "job1",
        name: "List All Jobs",
        method: "GET",
        url: "/api/jobs",
        config: {
          ...DEFAULT_CONFIG,
          url: "/api/jobs",
        },
      },
      {
        id: "job2",
        name: "Run Job",
        method: "POST",
        url: "/api/jobs/run",
        config: {
          ...DEFAULT_CONFIG,
          method: "POST",
          url: "/api/jobs/run",
          body: {
            type: "json",
            content: `{
  "prompt": "Summarize the README",
  "projectPaths": ["/home/matt/projects/personal-homepage"],
  "backend": "claude"
}`,
          },
        },
      },
    ],
  },
  {
    id: "projects",
    name: "Projects API",
    expanded: false,
    requests: [
      {
        id: "proj1",
        name: "List Local Projects",
        method: "GET",
        url: "/api/projects/local",
        config: {
          ...DEFAULT_CONFIG,
          url: "/api/projects/local",
        },
      },
      {
        id: "proj2",
        name: "Get GitHub Repos",
        method: "GET",
        url: "/api/projects/github",
        config: {
          ...DEFAULT_CONFIG,
          url: "/api/projects/github",
        },
      },
      {
        id: "proj3",
        name: "Get Project Metadata",
        method: "GET",
        url: "/api/projects/meta",
        config: {
          ...DEFAULT_CONFIG,
          url: "/api/projects/meta",
        },
      },
    ],
  },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return "text-emerald-400"
  if (status >= 300 && status < 400) return "text-cyan-400"
  if (status >= 400 && status < 500) return "text-amber-400"
  if (status >= 500) return "text-red-400"
  return "text-muted-foreground"
}

function getStatusIcon(status: number) {
  if (status >= 200 && status < 300) return <CheckCircle className="h-4 w-4" />
  if (status >= 400) return <XCircle className="h-4 w-4" />
  return <AlertCircle className="h-4 w-4" />
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatJSON(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2)
  } catch {
    return str
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ApiPlaygroundSection({
  activeSubItem,
  onSubItemHandled
}: {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
}) {
  const { getGitHubToken } = useAuth()

  // Request config state
  const [config, setConfig] = React.useState<RequestConfig>(DEFAULT_CONFIG)
  const [response, setResponse] = React.useState<ResponseData | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("params")
  const [responseTab, setResponseTab] = React.useState("body")
  const [copied, setCopied] = React.useState(false)

  // History & Collections
  const [history, setHistory] = React.useState<HistoryItem[]>([])
  const [collections, setCollections] = React.useState<Collection[]>(SAMPLE_COLLECTIONS)
  const [sidebarTab, setSidebarTab] = React.useState<"collections" | "history">("collections")

  // Health check state
  const [healthStatuses, setHealthStatuses] = React.useState<Map<string, HealthStatus>>(new Map())
  const [checkingHealth, setCheckingHealth] = React.useState<Set<string>>(new Set())

  // Handle sub-item navigation (switch to collections or history tab)
  React.useEffect(() => {
    if (activeSubItem === "collections" || activeSubItem === "history") {
      setSidebarTab(activeSubItem)
      onSubItemHandled?.()
    }
  }, [activeSubItem, onSubItemHandled])

  // Code generation
  const [codeLanguage, setCodeLanguage] = React.useState("curl")

  // Load history from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("api-playground-history")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setHistory(parsed.map((item: HistoryItem) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        })))
      } catch (e) {
        console.error("Failed to load history", e)
      }
    }
  }, [])

  // Inject GitHub settings from localStorage into collections
  React.useEffect(() => {
    const githubToken = localStorage.getItem("github-token") || ""
    const githubRepo = localStorage.getItem("github-repo") || ""

    if (githubToken || githubRepo) {
      setCollections(prev => prev.map(collection => {
        if (collection.id !== "github-content") return collection

        return {
          ...collection,
          requests: collection.requests.map(request => {
            // Replace OWNER/REPO in URL with actual repo
            let newUrl = request.url
            if (githubRepo) {
              newUrl = newUrl.replace("OWNER/REPO", githubRepo)
            }

            return {
              ...request,
              url: newUrl,
              config: {
                ...request.config,
                url: newUrl,
                auth: {
                  ...request.config.auth,
                  token: githubToken,
                },
              },
            }
          }),
        }
      }))
    }
  }, [])

  // Save history to localStorage
  React.useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("api-playground-history", JSON.stringify(history))
    }
  }, [history])

  // Send request
  const sendRequest = async () => {
    if (!config.url) return

    setLoading(true)
    const startTime = Date.now()

    try {
      // Build URL with params
      let url = config.url
      const enabledParams = config.params.filter(p => p.enabled && p.key)
      if (enabledParams.length > 0) {
        const queryString = enabledParams
          .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
          .join("&")
        url += (url.includes("?") ? "&" : "?") + queryString
      }

      // Build headers
      const headers: Record<string, string> = {}
      config.headers
        .filter(h => h.enabled && h.key)
        .forEach(h => {
          headers[h.key] = h.value
        })

      // Add auth headers
      if (config.auth.type === "bearer" && config.auth.token) {
        headers["Authorization"] = `Bearer ${config.auth.token}`
      } else if (config.auth.type === "basic" && config.auth.username) {
        const encoded = btoa(`${config.auth.username}:${config.auth.password}`)
        headers["Authorization"] = `Basic ${encoded}`
      } else if (config.auth.type === "apikey" && config.auth.apiKeyName && config.auth.apiKeyValue) {
        headers[config.auth.apiKeyName] = config.auth.apiKeyValue
      }

      // Build body
      let body: string | undefined
      if (config.method !== "GET" && config.body.type !== "none") {
        body = config.body.content
        if (config.body.type === "json") {
          headers["Content-Type"] = headers["Content-Type"] || "application/json"
        } else if (config.body.type === "form-urlencoded") {
          headers["Content-Type"] = "application/x-www-form-urlencoded"
        }
      }

      // Make request
      const res = await fetch(url, {
        method: config.method,
        headers,
        body,
      })

      const endTime = Date.now()
      const responseText = await res.text()

      // Get response headers
      const responseHeaders: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      setResponse({
        status: res.status,
        statusText: res.statusText,
        time: endTime - startTime,
        size: new Blob([responseText]).size,
        headers: responseHeaders,
        body: responseText,
      })

      // Add to history
      const historyItem: HistoryItem = {
        id: generateId(),
        method: config.method,
        url: config.url,
        status: res.status,
        time: endTime - startTime,
        timestamp: new Date(),
        starred: false,
      }
      setHistory(prev => [historyItem, ...prev.slice(0, 49)])
    } catch (error) {
      const endTime = Date.now()
      setResponse({
        status: 0,
        statusText: "Error",
        time: endTime - startTime,
        size: 0,
        headers: {},
        body: error instanceof Error ? error.message : "Request failed",
      })
    } finally {
      setLoading(false)
    }
  }

  // Key-value pair helpers
  const addKeyValue = (type: "params" | "headers") => {
    const newPair: KeyValuePair = {
      id: generateId(),
      key: "",
      value: "",
      enabled: true,
    }
    setConfig(prev => ({
      ...prev,
      [type]: [...prev[type], newPair],
    }))
  }

  const removeKeyValue = (id: string, type: "params" | "headers") => {
    setConfig(prev => ({
      ...prev,
      [type]: prev[type].filter(p => p.id !== id),
    }))
  }

  const updateKeyValue = (
    id: string,
    field: "key" | "value" | "enabled",
    value: string | boolean,
    type: "params" | "headers"
  ) => {
    setConfig(prev => ({
      ...prev,
      [type]: prev[type].map(p => (p.id === id ? { ...p, [field]: value } : p)),
    }))
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate code snippet
  const generateCode = (language: string): string => {
    const { method, url } = config

    if (language === "curl") {
      let cmd = `curl -X ${method} "${url}"`
      config.headers
        .filter(h => h.enabled && h.key)
        .forEach(h => {
          cmd += ` \\\n  -H "${h.key}: ${h.value}"`
        })
      if (config.body.type === "json" && config.body.content) {
        cmd += ` \\\n  -d '${config.body.content.replace(/\n/g, "")}'`
      }
      return cmd
    }

    if (language === "javascript") {
      const headers: Record<string, string> = {}
      config.headers.filter(h => h.enabled && h.key).forEach(h => {
        headers[h.key] = h.value
      })
      return `fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 2)}${config.body.type === "json" && config.body.content ? `,
  body: JSON.stringify(${config.body.content})` : ""}
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))`
    }

    if (language === "python") {
      const headerLines = config.headers
        .filter(h => h.enabled && h.key)
        .map(h => `    "${h.key}": "${h.value}"`)
        .join(",\n")
      return `import requests

response = requests.${method.toLowerCase()}(
    "${url}",
    headers={
${headerLines}
    }${config.body.type === "json" && config.body.content ? `,
    json=${config.body.content}` : ""}
)
print(response.json())`
    }

    return "// Select a language"
  }

  // Load saved request
  const loadRequest = (request: SavedRequest) => {
    setConfig(request.config)
  }

  // Toggle collection expand
  const toggleCollection = (id: string) => {
    setCollections(prev =>
      prev.map(c => (c.id === id ? { ...c, expanded: !c.expanded } : c))
    )
  }

  // Toggle star on history item
  const toggleStar = (id: string) => {
    setHistory(prev =>
      prev.map(h => (h.id === id ? { ...h, starred: !h.starred } : h))
    )
  }

  // Run health check on a single request
  const checkRequestHealth = async (request: SavedRequest): Promise<HealthStatus> => {
    const startTime = Date.now()
    try {
      // Build URL - handle relative URLs
      let url = request.config.url
      if (url.startsWith("/")) {
        url = window.location.origin + url
      }

      // Build headers
      const headers: Record<string, string> = {}
      request.config.headers
        .filter(h => h.enabled && h.key)
        .forEach(h => {
          headers[h.key] = h.value
        })

      // Add auth headers - use OAuth token for GitHub API
      const isGitHubApi = url.includes("api.github.com")
      if (isGitHubApi) {
        const oauthToken = await getGitHubToken()
        if (oauthToken) {
          headers["Authorization"] = `Bearer ${oauthToken}`
        }
      } else if (request.config.auth.type === "bearer" && request.config.auth.token) {
        headers["Authorization"] = `Bearer ${request.config.auth.token}`
      }

      const res = await fetch(url, {
        method: request.config.method,
        headers,
        signal: AbortSignal.timeout(10000), // 10s timeout
      })

      return {
        status: res.status,
        time: Date.now() - startTime,
        checkedAt: new Date(),
      }
    } catch {
      return {
        status: 0, // 0 indicates network error
        time: Date.now() - startTime,
        checkedAt: new Date(),
      }
    }
  }

  // Run health check on all requests in a collection
  const checkCollectionHealth = async (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId)
    if (!collection) return

    // Mark all requests in this collection as checking
    setCheckingHealth(prev => {
      const next = new Set(prev)
      collection.requests.forEach(r => next.add(r.id))
      return next
    })

    // Run all checks in parallel
    const results = await Promise.all(
      collection.requests.map(async (request) => {
        const status = await checkRequestHealth(request)
        return { requestId: request.id, status }
      })
    )

    // Update statuses
    setHealthStatuses(prev => {
      const next = new Map(prev)
      results.forEach(({ requestId, status }) => {
        next.set(requestId, status)
      })
      return next
    })

    // Clear checking state
    setCheckingHealth(prev => {
      const next = new Set(prev)
      collection.requests.forEach(r => next.delete(r.id))
      return next
    })
  }

  // Get health summary for a collection
  const getCollectionHealthSummary = (collection: Collection) => {
    let passed = 0
    let failed = 0
    let unchecked = 0

    collection.requests.forEach(r => {
      const status = healthStatuses.get(r.id)
      if (!status) {
        unchecked++
      } else if (status.status && status.status >= 200 && status.status < 400) {
        passed++
      } else {
        failed++
      }
    })

    return { passed, failed, unchecked, total: collection.requests.length }
  }

  // Keyboard shortcut: Ctrl+Enter to send
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        sendRequest()
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [config])

  return (
    <div className="min-h-full lg:h-full flex flex-col lg:flex-row gap-4 p-4 lg:p-6" data-tabz-section="api-playground">
      {/* Sidebar - Collections & History */}
      <div className="lg:w-72 flex-shrink-0 lg:h-full">
        <div className="glass rounded-lg p-4 h-full flex flex-col">
          <Tabs value={sidebarTab} onValueChange={(v) => setSidebarTab(v as "collections" | "history")} className="flex flex-col flex-1 min-h-0">
            <TabsList className="grid w-full grid-cols-2 mb-4 flex-shrink-0">
              <TabsTrigger value="collections" className="text-xs">
                <FolderOpen className="h-3.5 w-3.5 mr-1.5" />
                Collections
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                History
              </TabsTrigger>
            </TabsList>

            {/* Collections Tab */}
            <TabsContent value="collections" className="space-y-2 mt-0 flex-1 overflow-y-auto">
              {collections.map(collection => {
                const summary = getCollectionHealthSummary(collection)
                const isChecking = collection.requests.some(r => checkingHealth.has(r.id))

                return (
                  <div key={collection.id}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleCollection(collection.id)}
                        className="flex-1 flex items-center gap-2 p-2 rounded hover:bg-primary/5 transition-colors text-sm"
                      >
                        {collection.expanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="flex-1 text-left font-medium">{collection.name}</span>
                        {/* Health summary badges */}
                        {summary.failed > 0 && (
                          <Badge variant="destructive" className="text-[10px] px-1.5">
                            {summary.failed}
                          </Badge>
                        )}
                        {summary.passed > 0 && summary.failed === 0 && (
                          <Badge className="text-[10px] px-1.5 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            {summary.passed}/{summary.total}
                          </Badge>
                        )}
                        {summary.unchecked === summary.total && (
                          <Badge variant="outline" className="text-xs">
                            {collection.requests.length}
                          </Badge>
                        )}
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          checkCollectionHealth(collection.id)
                        }}
                        disabled={isChecking}
                        title="Check all endpoints"
                      >
                        {isChecking ? (
                          <RotateCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Activity className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>

                    {collection.expanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-border/20 pl-3">
                        {collection.requests.map(request => {
                          const status = healthStatuses.get(request.id)
                          const isCheckingThis = checkingHealth.has(request.id)

                          return (
                            <button
                              key={request.id}
                              onClick={() => loadRequest(request)}
                              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-primary/5 transition-colors text-xs group"
                            >
                              {/* Status indicator */}
                              <span className="w-2 h-2 rounded-full flex-shrink-0">
                                {isCheckingThis ? (
                                  <span className="block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                ) : status ? (
                                  status.status && status.status >= 200 && status.status < 400 ? (
                                    <span className="block w-2 h-2 rounded-full bg-emerald-400" />
                                  ) : (
                                    <span className="block w-2 h-2 rounded-full bg-red-400" />
                                  )
                                ) : (
                                  <span className="block w-2 h-2 rounded-full bg-muted-foreground/30" />
                                )}
                              </span>
                              <Badge variant="outline" className={`text-[10px] px-1 ${METHOD_COLORS[request.method]}`}>
                                {request.method}
                              </Badge>
                              <span className="truncate text-muted-foreground flex-1 text-left">{request.name}</span>
                              {/* Show response time on hover if checked */}
                              {status && (
                                <span className="text-[10px] text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {status.time}ms
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}

              <Button variant="outline" size="sm" className="w-full mt-3" disabled>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                New Collection
              </Button>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-1 mt-0 flex-1 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  No request history yet
                </p>
              ) : (
                history.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setConfig(prev => ({ ...prev, method: item.method, url: item.url }))}
                    className="flex items-start gap-2 p-2 rounded hover:bg-primary/5 cursor-pointer transition-colors group"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStar(item.id)
                      }}
                      className="mt-0.5"
                    >
                      <Star
                        className={`h-3 w-3 ${
                          item.starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] px-1 ${METHOD_COLORS[item.method]}`}>
                          {item.method}
                        </Badge>
                        <span className={`text-xs ${getStatusColor(item.status)}`}>
                          {item.status || "ERR"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {item.url.replace(/^https?:\/\//, "")}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        {item.time}ms · {item.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Request Builder */}
        <div className="glass rounded-lg p-4">
          {/* URL Bar */}
          <div className="flex gap-2 mb-4">
            <Select
              value={config.method}
              onValueChange={(v) => setConfig(prev => ({ ...prev, method: v as HttpMethod }))}
            >
              <SelectTrigger className="w-28" data-tabz-input="http-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["GET", "POST", "PUT", "PATCH", "DELETE"] as HttpMethod[]).map(method => (
                  <SelectItem key={method} value={method}>
                    <span className={METHOD_COLORS[method].split(" ")[0]}>{method}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={config.url}
              onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
              placeholder="Enter request URL..."
              className="flex-1 font-mono text-sm"
              data-tabz-input="api-url"
            />

            <Button onClick={sendRequest} disabled={loading || !config.url} data-tabz-action="send-request">
              {loading ? (
                <RotateCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">Send</span>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            Press <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Ctrl</kbd>+<kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Enter</kbd> to send
          </p>

          {/* Request Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-3">
              <TabsTrigger value="params" className="text-xs">
                Params
                {config.params.filter(p => p.enabled && p.key).length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 text-[10px] px-1">
                    {config.params.filter(p => p.enabled && p.key).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="headers" className="text-xs">
                Headers
                {config.headers.filter(h => h.enabled && h.key).length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 text-[10px] px-1">
                    {config.headers.filter(h => h.enabled && h.key).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="body" className="text-xs">Body</TabsTrigger>
              <TabsTrigger value="auth" className="text-xs">Auth</TabsTrigger>
            </TabsList>

            {/* Params Tab */}
            <TabsContent value="params" className="mt-0">
              <div className="space-y-2">
                {config.params.map(param => (
                  <div key={param.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={param.enabled}
                      onChange={(e) => updateKeyValue(param.id, "enabled", e.target.checked, "params")}
                      className="rounded"
                    />
                    <Input
                      placeholder="Key"
                      value={param.key}
                      onChange={(e) => updateKeyValue(param.id, "key", e.target.value, "params")}
                      className="flex-1 text-sm"
                    />
                    <Input
                      placeholder="Value"
                      value={param.value}
                      onChange={(e) => updateKeyValue(param.id, "value", e.target.value, "params")}
                      className="flex-1 text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeKeyValue(param.id, "params")}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addKeyValue("params")}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Parameter
                </Button>
              </div>
            </TabsContent>

            {/* Headers Tab */}
            <TabsContent value="headers" className="mt-0">
              <div className="space-y-2">
                {config.headers.map(header => (
                  <div key={header.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={header.enabled}
                      onChange={(e) => updateKeyValue(header.id, "enabled", e.target.checked, "headers")}
                      className="rounded"
                    />
                    <Input
                      placeholder="Header"
                      value={header.key}
                      onChange={(e) => updateKeyValue(header.id, "key", e.target.value, "headers")}
                      className="flex-1 text-sm"
                    />
                    <Input
                      placeholder="Value"
                      value={header.value}
                      onChange={(e) => updateKeyValue(header.id, "value", e.target.value, "headers")}
                      className="flex-1 text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeKeyValue(header.id, "headers")}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addKeyValue("headers")}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Header
                </Button>
              </div>
            </TabsContent>

            {/* Body Tab */}
            <TabsContent value="body" className="mt-0">
              <div className="space-y-3">
                <Select
                  value={config.body.type}
                  onValueChange={(v) => setConfig(prev => ({
                    ...prev,
                    body: { ...prev.body, type: v as BodyType },
                  }))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="form-urlencoded">Form URL Encoded</SelectItem>
                    <SelectItem value="raw">Raw</SelectItem>
                  </SelectContent>
                </Select>

                {config.body.type !== "none" && (
                  <div>
                    <Textarea
                      value={config.body.content}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        body: { ...prev.body, content: e.target.value },
                      }))}
                      placeholder={config.body.type === "json" ? '{\n  "key": "value"\n}' : "Enter body content..."}
                      className="font-mono text-sm h-40"
                      data-tabz-input="request-body"
                    />
                    {config.body.type === "json" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setConfig(prev => ({
                          ...prev,
                          body: { ...prev.body, content: formatJSON(prev.body.content) },
                        }))}
                      >
                        Format JSON
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Auth Tab */}
            <TabsContent value="auth" className="mt-0">
              <div className="space-y-4">
                <Select
                  value={config.auth.type}
                  onValueChange={(v) => setConfig(prev => ({
                    ...prev,
                    auth: { ...prev.auth, type: v as AuthType },
                  }))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Auth</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                    <SelectItem value="apikey">API Key</SelectItem>
                  </SelectContent>
                </Select>

                {config.auth.type === "bearer" && (
                  <div>
                    <Label className="text-xs">Token</Label>
                    <Input
                      type="password"
                      value={config.auth.token}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        auth: { ...prev.auth, token: e.target.value },
                      }))}
                      placeholder="Enter bearer token..."
                      className="mt-1"
                    />
                  </div>
                )}

                {config.auth.type === "basic" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Username</Label>
                      <Input
                        value={config.auth.username}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          auth: { ...prev.auth, username: e.target.value },
                        }))}
                        placeholder="Username"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Password</Label>
                      <Input
                        type="password"
                        value={config.auth.password}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          auth: { ...prev.auth, password: e.target.value },
                        }))}
                        placeholder="Password"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {config.auth.type === "apikey" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Header Name</Label>
                      <Input
                        value={config.auth.apiKeyName}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          auth: { ...prev.auth, apiKeyName: e.target.value },
                        }))}
                        placeholder="X-API-Key"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Value</Label>
                      <Input
                        type="password"
                        value={config.auth.apiKeyValue}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          auth: { ...prev.auth, apiKeyValue: e.target.value },
                        }))}
                        placeholder="API key value"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Response Viewer */}
        <div className="glass rounded-lg p-4 flex-1 min-h-[300px] flex flex-col overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <RotateCw className="h-8 w-8 animate-spin text-primary/50" />
            </div>
          ) : response ? (
            <>
              {/* Response Header */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(response.status)}
                  <span className={`font-bold ${getStatusColor(response.status)}`}>
                    {response.status} {response.statusText}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {response.time}ms
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {formatBytes(response.size)}
                </Badge>

                <div className="flex-1" />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(response.body)}
                >
                  {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  Copy
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Code2 className="h-3.5 w-3.5 mr-1" />
                      Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Generate Code</DialogTitle>
                      <DialogDescription>
                        Copy code snippets in your preferred language
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="curl">cURL</SelectItem>
                          <SelectItem value="javascript">JavaScript (fetch)</SelectItem>
                          <SelectItem value="python">Python (requests)</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative">
                        <pre className="bg-background/50 border border-border/20 rounded-lg p-4 overflow-x-auto max-h-80 text-sm">
                          <code className="text-primary font-mono whitespace-pre-wrap">
                            {generateCode(codeLanguage)}
                          </code>
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(generateCode(codeLanguage))}
                        >
                          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Response Tabs */}
              <Tabs value={responseTab} onValueChange={setResponseTab} className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TabsList className="mb-3">
                  <TabsTrigger value="body" className="text-xs">Body</TabsTrigger>
                  <TabsTrigger value="headers" className="text-xs">
                    Headers
                    <Badge variant="secondary" className="ml-1.5 text-[10px] px-1">
                      {Object.keys(response.headers).length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="body" className="flex-1 mt-0 min-h-0">
                  <div className="h-full max-h-[300px] lg:max-h-none overflow-auto bg-background/50 border border-border/20 rounded-lg p-4">
                    <JsonViewer data={response.body} expandDepth={3} />
                  </div>
                </TabsContent>

                <TabsContent value="headers" className="flex-1 mt-0 min-h-0">
                  <div className="h-full max-h-[300px] lg:max-h-none overflow-auto bg-background/50 border border-border/20 rounded-lg">
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries(response.headers).map(([key, value]) => (
                          <tr key={key} className="border-b border-border/10 last:border-0">
                            <td className="p-2 font-mono text-cyan-400">{key}</td>
                            <td className="p-2 font-mono text-muted-foreground">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <Send className="h-12 w-12 mb-4 opacity-20" />
              <p>No response yet</p>
              <p className="text-sm">Send a request to see the response</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

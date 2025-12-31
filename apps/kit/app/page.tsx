"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Cloud,
  Newspaper,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Home,
  Bookmark,
  RefreshCw,
  RotateCw,
  MapPin,
  ArrowUp,
  ArrowDown,
  Zap,
  FileText,
  CheckCircle2,
  Search,
  TrendingUp,
  User,
  Link2,
  FolderGit2,
  Github,
  MessageSquare,
  Play,
  Bitcoin,
  Rocket,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ThemeCustomizer } from "@/components/ThemeCustomizer"
import { ThemeSettingsPanel } from "@/components/ThemeSettingsPanel"
import { SectionSettings } from "@/components/SectionSettings"
import { useAuth } from "@/components/AuthProvider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSectionPreferences, ToggleableSection, DEFAULT_SECTION_ORDER, DEFAULT_VISIBILITY } from "@/hooks/useSectionPreferences"
import { useEnvironment, requiresLocalhost } from "@/hooks/useEnvironment"
import { WorldClocks } from "@/components/WorldClocks"
import { LocalOnlyOverlay, LocalOnlyBadge, EnvironmentBadge } from "@/components/LocalOnlyOverlay"

// Import page content components
import WeatherDashboard from "./sections/weather"
import DailyFeedSection from "./sections/daily-feed"
import ApiPlaygroundSection from "./sections/api-playground"
import QuickNotesSection from "./sections/quick-notes"
import BookmarksSection from "./sections/bookmarks"
import SearchHubSection from "./sections/search-hub"
import AIWorkspaceSection from "./sections/ai-workspace"
import StocksDashboard from "./sections/stocks-dashboard"
import ProfileSection from "./sections/profile"
import TasksSection from "./sections/tasks"
import ProjectsDashboard from "./sections/projects-dashboard"
import JobsSection from "./sections/jobs"
import IntegrationsSection from "./sections/integrations"
import CryptoDashboard from "./sections/crypto-dashboard"
import SpaceXTracker from "./sections/spacex-tracker"
import GitHubActivity from "./sections/github-activity"
import DisastersMonitor from "./sections/disasters-monitor"
import MarketPulseSection from "./sections/market-pulse"
import SetupSection from "./sections/setup"
import { useLoginTrigger } from "@/hooks/useLoginTrigger"
import { StartupJobsModal } from "@/components/StartupJobsModal"
import { useJobResults } from "@/hooks/useJobResults"

// ============================================================================
// TYPES
// ============================================================================

// Re-export Section type from hook for consistency
type Section = "home" | ToggleableSection | "settings"

interface NavigationItem {
  id: Section
  label: string
  icon: React.ElementType
  description: string
}

// ============================================================================
// NAVIGATION CONFIG
// ============================================================================

const navigationItems: NavigationItem[] = [
  { id: "weather", label: "Weather", icon: Cloud, description: "Live weather monitoring" },
  { id: "feed", label: "Daily Feed", icon: Newspaper, description: "Aggregated content" },
  { id: "market-pulse", label: "Market Pulse", icon: TrendingUp, description: "Tech salary & job trends" },
  { id: "api-playground", label: "API Playground", icon: Zap, description: "Test & debug APIs" },
  { id: "notes", label: "Docs Editor", icon: FileText, description: "GitHub-synced documentation" },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark, description: "Quick links" },
  { id: "search", label: "Search Hub", icon: Search, description: "Search, AI & Image" },
  { id: "ai-workspace", label: "AI Workspace", icon: MessageSquare, description: "Chat with AI models" },
  { id: "stocks", label: "Paper Trading", icon: TrendingUp, description: "Practice stock trading" },
  { id: "crypto", label: "Crypto", icon: Bitcoin, description: "Live cryptocurrency prices" },
  { id: "spacex", label: "SpaceX Launches", icon: Rocket, description: "Track rocket launches" },
  { id: "github-activity", label: "GitHub Activity", icon: Github, description: "GitHub events & repos" },
  { id: "disasters", label: "Disasters", icon: AlertCircle, description: "Earthquakes & alerts" },
  { id: "tasks", label: "Scratchpad", icon: CheckCircle2, description: "Quick notes and todos" },
  { id: "projects", label: "Projects", icon: FolderGit2, description: "GitHub & local repos" },
  { id: "jobs", label: "Jobs", icon: Play, description: "Claude batch prompts" },
  { id: "integrations", label: "Integrations", icon: Link2, description: "Connected services" },
  { id: "profile", label: "Profile", icon: User, description: "Account & sync" },
  { id: "setup", label: "Setup Wizard", icon: Sparkles, description: "Initial configuration" },
  { id: "settings", label: "Settings", icon: Settings, description: "Theme & preferences" },
]

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

function SidebarContent({
  activeSection,
  setActiveSection,
  jobsNeedsHumanCount = 0,
  collapsed = false,
  mobile = false,
  onNavigate,
  userAvatar,
  userName,
  sectionOrder,
  sectionVisibility,
  prefsLoaded = false,
  isLocal = false,
}: {
  activeSection: Section
  setActiveSection: (section: Section) => void
  jobsNeedsHumanCount?: number
  collapsed?: boolean
  mobile?: boolean
  onNavigate?: () => void
  userAvatar?: string | null
  userName?: string | null
  sectionOrder: ToggleableSection[]
  sectionVisibility: Record<ToggleableSection, boolean>
  prefsLoaded?: boolean
  isLocal?: boolean
}) {
  const handleSectionClick = (id: Section) => {
    setActiveSection(id)
    onNavigate?.() // Close mobile menu when section is clicked
  }

  const handleHomeClick = () => {
    setActiveSection("home")
    onNavigate?.()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header - clickable to return home */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleHomeClick}
            className={`p-4 border-b border-border/20 transition-all duration-300 w-full text-left hover:bg-primary/5 ${collapsed && !mobile ? 'px-3' : ''}`}
            data-tabz-section="home"
            data-tabz-action="navigate"
          >
            <div className={`flex items-center gap-3 transition-all duration-300 ${collapsed && !mobile ? 'justify-center' : ''}`}>
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div className={`flex-1 transition-[max-width,opacity] duration-300 overflow-hidden ${collapsed && !mobile ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">Personal Home</p>
                  <EnvironmentBadge isLocal={isLocal} collapsed={collapsed && !mobile} />
                </div>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
              {userAvatar && !collapsed && (
                <Avatar className="h-8 w-8 border border-primary/20 flex-shrink-0">
                  <AvatarImage src={userAvatar} alt={userName || "User"} />
                  <AvatarFallback>{userName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              )}
            </div>
          </button>
        </TooltipTrigger>
        {(collapsed && !mobile) && (
          <TooltipContent side="right">
            <p>Home</p>
          </TooltipContent>
        )}
      </Tooltip>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {/* Reorder and filter navigation items based on preferences */}
          {(() => {
            // Use defaults during SSR/before hydration to prevent mismatch
            const effectiveOrder = prefsLoaded ? sectionOrder : DEFAULT_SECTION_ORDER
            const effectiveVisibility = prefsLoaded ? sectionVisibility : DEFAULT_VISIBILITY

            const orderedItems: NavigationItem[] = []
            // First, add ordered toggleable sections that are visible
            for (const id of effectiveOrder) {
              if (effectiveVisibility[id]) {
                const item = navigationItems.find((i) => i.id === id)
                if (item) orderedItems.push(item)
              }
            }
            // Then always add settings at the end
            const settingsItem = navigationItems.find((i) => i.id === "settings")
            if (settingsItem) orderedItems.push(settingsItem)
            return orderedItems
          })().map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <li key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleSectionClick(item.id)}
                      className={`
                        w-full flex items-center rounded-lg transition-[background-color,color,padding,gap] duration-200
                        ${collapsed && !mobile ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'}
                        ${isActive
                          ? 'glass text-primary border-glow'
                          : 'hover:bg-primary/10 text-muted-foreground hover:text-foreground'
                        }
                      `}
                      data-tabz-section={item.id}
                      data-tabz-action="navigate"
                    >
                      <div className="relative flex-shrink-0">
                        <Icon className="h-5 w-5" />
                        {/* Jobs needs-human badge */}
                        {item.id === "jobs" && jobsNeedsHumanCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-500 text-[9px] flex items-center justify-center text-white font-medium">
                            {jobsNeedsHumanCount > 9 ? '!' : jobsNeedsHumanCount}
                          </span>
                        )}
                      </div>
                      <span className={`flex-1 text-left transition-[max-width,opacity] duration-300 overflow-hidden whitespace-nowrap ${
                        collapsed && !mobile ? 'max-w-0 opacity-0' : 'max-w-[180px] opacity-100'
                      }`}>{item.label}</span>
                      {/* Local-only badge for sections requiring localhost */}
                      {!isLocal && requiresLocalhost(item.id) && !(collapsed && !mobile) && (
                        <LocalOnlyBadge />
                      )}
                    </button>
                  </TooltipTrigger>
                  {collapsed && !mobile && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-border/20 transition-all duration-300 ${collapsed && !mobile ? 'px-3' : ''}`}>
        <div className={`text-xs text-muted-foreground transition-all duration-300 overflow-hidden ${
          collapsed && !mobile ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-3 w-3" />
            <span>Last updated: Just now</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// HOME SECTION
// ============================================================================

// Default location (San Francisco)
const DEFAULT_LOCATION = {
  latitude: 37.7749,
  longitude: -122.4194,
  name: "San Francisco, CA",
}

// Weather code to condition mapping
function getConditionFromCode(code: number): string {
  if (code === 0) return "Clear"
  if (code <= 3) return "Partly Cloudy"
  if (code <= 48) return "Foggy"
  if (code <= 67) return "Rainy"
  if (code <= 77) return "Snowy"
  if (code <= 82) return "Showers"
  return "Stormy"
}

// Fetch weather summary for home card
async function fetchHomeWeather(lat: number, lon: number, unit: "fahrenheit" | "celsius") {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: "temperature_2m,weather_code",
    daily: "temperature_2m_max,temperature_2m_min",
    temperature_unit: unit,
    forecast_days: "1",
    timezone: "auto",
  })
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!res.ok) throw new Error("Failed to fetch weather")
  const data = await res.json()
  return {
    temp: Math.round(data.current.temperature_2m),
    condition: getConditionFromCode(data.current.weather_code),
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
  }
}

function HomeSection({ onNavigate, userName, isVisible, prefsLoaded, sectionOrder }: { onNavigate: (section: Section) => void; userName?: string | null; isVisible: (section: ToggleableSection) => boolean; prefsLoaded: boolean; sectionOrder: ToggleableSection[] }) {
  // Use default visibility (all visible) during SSR to prevent hydration mismatch
  const checkVisible = (section: ToggleableSection) => prefsLoaded ? isVisible(section) : true
  // Use default order during SSR to prevent hydration mismatch
  const effectiveOrder = prefsLoaded ? sectionOrder : DEFAULT_SECTION_ORDER
  // Get saved location and temp unit from localStorage (same as Weather section)
  const [location, setLocation] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("weather-location")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          // Invalid JSON
        }
      }
    }
    return DEFAULT_LOCATION
  })

  const [tempUnit] = React.useState<"fahrenheit" | "celsius">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("weather-temp-unit")
      if (saved === "celsius" || saved === "fahrenheit") return saved
    }
    return "fahrenheit"
  })

  // Use same query key pattern as Weather section for cache sharing
  const { data: weather, isLoading: weatherLoading } = useQuery({
    queryKey: ["home-weather", location.latitude, location.longitude, tempUnit],
    queryFn: () => fetchHomeWeather(location.latitude, location.longitude, tempUnit),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  // Listen for location changes from Weather section
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "weather-location" && e.newValue) {
        try {
          setLocation(JSON.parse(e.newValue))
        } catch {
          // Invalid JSON
        }
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  // Fetch feed count using same query as Daily Feed section
  const { data: feedData } = useQuery({
    queryKey: ["feed", ["hackernews", "github", "reddit", "lobsters", "devto"], ["commandline", "ClaudeAI", "ClaudeCode", "cli", "tui"]],
    queryFn: async () => {
      const res = await fetch("/api/feed")
      if (!res.ok) throw new Error("Failed to fetch feed")
      return res.json()
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const feedCount = feedData?.items?.length ?? null

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold terminal-glow mb-2">
        Welcome Home{userName ? `, ${userName.split(' ')[0]}` : ''}
      </h1>
      <p className="text-muted-foreground mb-6">Your personal dashboard overview</p>

      {/* World Clocks Widget */}
      <div className="mb-6">
        <WorldClocks />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Render tiles in order from section preferences */}
        {effectiveOrder.map((sectionId) => {
          if (!checkVisible(sectionId)) return null

          // Weather tile - has dynamic data
          if (sectionId === "weather") {
            return (
              <button
                key={sectionId}
                onClick={() => onNavigate("weather")}
                className="glass rounded-lg p-6 text-left hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                data-tabz-section="weather"
                data-tabz-action="navigate"
              >
                <div className="flex items-start justify-between mb-4">
                  <Cloud className="h-8 w-8 text-primary" />
                  {weather && (
                    <span className="text-3xl font-bold text-primary">{weather.temp}°</span>
                  )}
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Weather</h3>
                {weather ? (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{weather.condition}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-0.5">
                        <ArrowUp className="h-3 w-3 text-red-400" />
                        {weather.high}°
                      </span>
                      <span className="flex items-center gap-0.5">
                        <ArrowDown className="h-3 w-3 text-blue-400" />
                        {weather.low}°
                      </span>
                    </div>
                    <p className="flex items-center gap-1 text-xs">
                      <MapPin className="h-3 w-3" />
                      {location.name}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {weatherLoading ? "Loading weather data..." : "Unable to load weather"}
                  </p>
                )}
              </button>
            )
          }

          // Feed tile - has dynamic data
          if (sectionId === "feed") {
            return (
              <button
                key={sectionId}
                onClick={() => onNavigate("feed")}
                className="glass rounded-lg p-6 text-left hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                data-tabz-section="feed"
                data-tabz-action="navigate"
              >
                <div className="flex items-start justify-between mb-4">
                  <Newspaper className="h-8 w-8 text-primary" />
                  {feedCount !== null && (
                    <span className="text-3xl font-bold text-primary">{feedCount}</span>
                  )}
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Daily Feed</h3>
                {feedCount !== null ? (
                  <p className="text-sm text-muted-foreground">
                    {feedCount} items from HN, GitHub, Reddit & more
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Loading feed...</p>
                )}
              </button>
            )
          }

          // Static tiles configuration
          const tileConfig: Record<ToggleableSection, { icon: React.ElementType; label: string; description: string } | null> = {
            weather: null, // Handled above
            feed: null, // Handled above
            "market-pulse": { icon: TrendingUp, label: "Market Pulse", description: "Tech salary & job trends" },
            "api-playground": { icon: Zap, label: "API Playground", description: "Test and debug API requests" },
            notes: { icon: FileText, label: "Docs Editor", description: "GitHub-synced documentation" },
            bookmarks: { icon: Bookmark, label: "Bookmarks", description: "Organized quick links" },
            search: { icon: Search, label: "Search Hub", description: "Multi-engine web search" },
            "ai-workspace": { icon: MessageSquare, label: "AI Workspace", description: "Chat with Claude & local models" },
            stocks: { icon: TrendingUp, label: "Paper Trading", description: "Practice stock trading" },
            crypto: { icon: Bitcoin, label: "Crypto", description: "Live cryptocurrency prices" },
            spacex: { icon: Rocket, label: "SpaceX Launches", description: "Track rocket launches" },
            "github-activity": { icon: Github, label: "GitHub Activity", description: "GitHub events & repos" },
            disasters: { icon: AlertCircle, label: "Disasters", description: "Earthquakes & alerts" },
            tasks: { icon: CheckCircle2, label: "Scratchpad", description: "Quick notes and todos" },
            projects: { icon: FolderGit2, label: "Projects", description: "GitHub & local repos" },
            jobs: { icon: Play, label: "Jobs", description: "Claude batch prompts" },
            integrations: { icon: Link2, label: "Integrations", description: "Connected services" },
            profile: { icon: User, label: "Profile", description: "Account & sync status" },
            setup: { icon: Sparkles, label: "Setup Wizard", description: "Initial configuration" },
          }

          const config = tileConfig[sectionId]
          if (!config) return null

          const Icon = config.icon
          return (
            <button
              key={sectionId}
              onClick={() => onNavigate(sectionId)}
              className="glass rounded-lg p-6 text-left hover:border-primary/50 hover:bg-primary/5 transition-colors group"
              data-tabz-section={sectionId}
              data-tabz-action="navigate"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{config.label}</h3>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </button>
          )
        })}

        {/* Settings Card - always visible at the end */}
        <button
          onClick={() => onNavigate("settings")}
          className="glass rounded-lg p-6 text-left hover:border-primary/50 hover:bg-primary/5 transition-colors group"
          data-tabz-section="settings"
          data-tabz-action="navigate"
        >
          <div className="flex items-start justify-between mb-4">
            <Settings className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Settings</h3>
          <p className="text-sm text-muted-foreground">Customize themes and preferences</p>
        </button>
      </div>
    </div>
  )
}


// ============================================================================
// SETTINGS SECTION
// ============================================================================

function ApiKeysSettings() {
  const [copied, setCopied] = React.useState<string | null>(null)
  const { data: apiStatus, isLoading } = useQuery<{ apis: { finnhub: boolean; alphaVantage: boolean; github: boolean } }>({
    queryKey: ["api-status"],
    queryFn: async () => {
      const res = await fetch("/api/status")
      if (!res.ok) throw new Error("Failed to fetch status")
      return res.json()
    },
    staleTime: 30000,
  })

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const apis = [
    {
      id: "finnhub",
      name: "Finnhub",
      description: "Real-time stock quotes for Paper Trading",
      envVar: "FINNHUB_API_KEY",
      docsUrl: "https://finnhub.io/register",
      configured: apiStatus?.apis.finnhub ?? false,
      note: "Free tier: 60 requests/min",
    },
    {
      id: "alphaVantage",
      name: "Alpha Vantage",
      description: "Historical chart data for Paper Trading",
      envVar: "ALPHA_VANTAGE_API_KEY",
      docsUrl: "https://www.alphavantage.co/support/#api-key",
      configured: apiStatus?.apis.alphaVantage ?? false,
      note: "Free tier: 25 requests/day, 5/min",
    },
    {
      id: "github",
      name: "GitHub (Server)",
      description: "Optional server-side GitHub access",
      envVar: "GITHUB_TOKEN",
      docsUrl: "https://github.com/settings/tokens/new",
      configured: apiStatus?.apis.github ?? false,
      note: "Client-side GitHub is configured separately above",
    },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        These API keys are configured via environment variables in <code className="px-1 py-0.5 bg-muted rounded text-xs">.env.local</code>
      </p>

      <div className="space-y-3">
        {apis.map((api) => (
          <div
            key={api.id}
            className={`rounded-lg border p-4 ${
              api.configured
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-border"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{api.name}</h4>
                  {isLoading ? (
                    <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
                  ) : api.configured ? (
                    <span className="text-xs bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full">
                      Configured
                    </span>
                  ) : (
                    <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full">
                      Not Set
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{api.description}</p>
                {api.note && (
                  <p className="text-xs text-muted-foreground mt-1 italic">{api.note}</p>
                )}
              </div>
            </div>

            {!api.configured && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted/50 px-3 py-1.5 rounded text-xs font-mono">
                    {api.envVar}=your_key_here
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`${api.envVar}=`, api.id)}
                    className="h-8"
                  >
                    {copied === api.id ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    )}
                  </Button>
                </div>
                <a
                  href={api.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  Get API key <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pt-2 text-xs text-muted-foreground">
        After adding keys to <code className="px-1 py-0.5 bg-muted rounded">.env.local</code>, restart your dev server with <code className="px-1 py-0.5 bg-muted rounded">npm run dev</code>
      </div>
    </div>
  )
}

function SettingsSection({ activeSubItem, onSubItemHandled }: { activeSubItem?: string | null; onSubItemHandled?: () => void }) {
  // Scroll to sub-item when activeSubItem changes
  React.useEffect(() => {
    if (activeSubItem) {
      // Small delay to ensure DOM is ready after section switch
      const timer = setTimeout(() => {
        const element = document.getElementById(`settings-${activeSubItem}`)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        onSubItemHandled?.()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [activeSubItem, onSubItemHandled])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold terminal-glow mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Customize your dashboard</p>

      <div className="max-w-3xl">
        <div id="settings-appearance" className="glass rounded-lg p-6 mb-6 scroll-mt-6" data-tabz-settings="appearance">
          <h3 className="font-semibold mb-6">Theme & Appearance</h3>
          <ThemeSettingsPanel />
        </div>

        <div id="settings-sections" className="glass rounded-lg p-6 mb-6 scroll-mt-6" data-tabz-settings="sections">
          <h3 className="font-semibold mb-4">Sections</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Toggle sections on or off and reorder them in the sidebar
          </p>
          <SectionSettings />
        </div>

        <div className="glass rounded-lg p-6 mb-6" data-tabz-settings="github">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <h3 className="font-semibold">GitHub Integration</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            GitHub sync is now managed through the Profile section. Sign in with GitHub to sync Quick Notes and Bookmarks.
          </p>
          <p className="text-xs text-muted-foreground">
            Go to <span className="text-primary">Profile</span> in the sidebar to sign in and configure your repository.
          </p>
        </div>

        <div id="settings-feed-config" className="glass rounded-lg p-6 mb-6 scroll-mt-6" data-tabz-settings="feed-config">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Feed Configuration</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Feed sources and subreddits are configured directly in the Daily Feed section using the Sources and Subreddits buttons in the toolbar.
          </p>
          <p className="text-xs text-muted-foreground">
            Go to <span className="text-primary">Daily Feed</span> in the sidebar to configure your content sources.
          </p>
        </div>

        <div id="settings-api-keys" className="glass rounded-lg p-6 scroll-mt-6" data-tabz-settings="api-keys">
          <h3 className="font-semibold mb-4">API Keys</h3>
          <ApiKeysSettings />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PersonalHomepage() {
  const { user } = useAuth()
  const { visibility, order, isVisible, isLoaded } = useSectionPreferences()
  const { isLocal } = useEnvironment()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState<Section>("home")
  const [activeSubItem, setActiveSubItem] = React.useState<string | null>(null)
  const [aiWorkspaceProject, setAiWorkspaceProject] = React.useState<string | null>(null)
  const [sectionRestored, setSectionRestored] = React.useState(false)

  // Restore active section from localStorage after mount (avoids hydration mismatch)
  React.useEffect(() => {
    const saved = localStorage.getItem("active-section")
    if (saved && navigationItems.some(item => item.id === saved)) {
      setActiveSection(saved as Section)
    }
    setSectionRestored(true)
  }, [])

  // Persist active section to localStorage (only after initial restore)
  React.useEffect(() => {
    if (sectionRestored) {
      localStorage.setItem("active-section", activeSection)
    }
  }, [activeSection, sectionRestored])

  // Get user info for personalization
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.user_metadata?.user_name || null
  const userAvatar = user?.user_metadata?.avatar_url || null
  const [weatherAlertCount, setWeatherAlertCount] = React.useState<number>(0)

  // On-login trigger for startup jobs
  const { pendingJobs, hasPendingJobs, clearPendingJobs } = useLoginTrigger()
  const [showStartupModal, setShowStartupModal] = React.useState(false)

  // Job results for needs-human badge
  const { needsHumanCount } = useJobResults()

  // Show startup modal when there are pending jobs
  React.useEffect(() => {
    if (hasPendingJobs) {
      setShowStartupModal(true)
    }
  }, [hasPendingJobs])

  // Clear sub-item after scroll completes
  const clearSubItem = React.useCallback(() => {
    setActiveSubItem(null)
  }, [])

  // Render the active section content
  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <HomeSection onNavigate={setActiveSection} userName={userName} isVisible={isVisible} prefsLoaded={isLoaded} sectionOrder={order} />
      case "weather":
        return <WeatherDashboard activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} onAlertCountChange={setWeatherAlertCount} />
      case "feed":
        return <DailyFeedSection activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} />
      case "market-pulse":
        return <MarketPulseSection activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} />
      case "api-playground":
        return <ApiPlaygroundSection activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} />
      case "notes":
        return <QuickNotesSection activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} onNavigateToSettings={() => setActiveSection("profile")} />
      case "bookmarks":
        return <BookmarksSection activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} onNavigateToSettings={() => setActiveSection("profile")} />
      case "search":
        return <SearchHubSection activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} />
      case "ai-workspace":
        if (!isLocal) {
          return <LocalOnlyOverlay sectionName="AI Workspace" description="This feature streams from local AI CLIs (Claude, Gemini, Codex) that require localhost to run." />
        }
        return <AIWorkspaceSection activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} initialProjectPath={aiWorkspaceProject} onProjectPathConsumed={() => setAiWorkspaceProject(null)} />
      case "stocks":
        return <StocksDashboard activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} onNavigateToSettings={() => setActiveSection("settings")} />
      case "crypto":
        return <CryptoDashboard activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} />
      case "spacex":
        return <SpaceXTracker activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} />
      case "github-activity":
        return <GitHubActivity activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} />
      case "disasters":
        return <DisastersMonitor activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} />
      case "tasks":
        return <TasksSection activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} onNavigateToSettings={() => setActiveSection("profile")} />
      case "projects":
        if (!isLocal) {
          return <LocalOnlyOverlay sectionName="Projects" description="This feature scans your local ~/projects/ directory and requires localhost to access the file system." />
        }
        return <ProjectsDashboard activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} onNavigateToSection={(section, projectPath) => {
          if (section === 'ai-workspace' && projectPath) {
            setAiWorkspaceProject(projectPath)
          }
          setActiveSection(section as Section)
        }} />
      case "jobs":
        if (!isLocal) {
          return <LocalOnlyOverlay sectionName="Jobs" description="This feature executes Claude CLI commands against local projects and requires localhost to run." />
        }
        return <JobsSection activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} />
      case "integrations":
        return <IntegrationsSection activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} onNavigateToSection={(section) => setActiveSection(section as Section)} />
      case "profile":
        return <ProfileSection />
      case "setup":
        return <SetupSection activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} />
      case "settings":
        return <SettingsSection activeSubItem={activeSubItem} onSubItemHandled={clearSubItem} />
      default:
        return <HomeSection onNavigate={setActiveSection} userName={userName} isVisible={isVisible} prefsLoaded={isLoaded} sectionOrder={order} />
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen relative z-10">
        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 lg:hidden glass"
              data-tabz-action="toggle-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 glass-dark border-r-border/20 p-0" data-tabz-container="mobile-sidebar">
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Main navigation for the dashboard</SheetDescription>
            </VisuallyHidden>
            <SidebarContent
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              jobsNeedsHumanCount={needsHumanCount}
              mobile
              onNavigate={() => setMobileMenuOpen(false)}
              userAvatar={userAvatar}
              userName={userName}
              sectionOrder={order}
              sectionVisibility={visibility}
              prefsLoaded={isLoaded}
              isLocal={isLocal}
            />
          </SheetContent>
        </Sheet>

        <div className="flex h-screen">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block relative flex-shrink-0">
            <aside
              className={`h-full glass-dark border-r border-border/20 transition-[width] duration-300 ease-in-out overflow-hidden ${
                sidebarCollapsed ? 'w-[80px]' : 'w-[280px]'
              }`}
              data-tabz-container="sidebar"
            >
              <SidebarContent
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                jobsNeedsHumanCount={needsHumanCount}
                collapsed={sidebarCollapsed}
                userAvatar={userAvatar}
                userName={userName}
                sectionOrder={order}
                sectionVisibility={visibility}
                prefsLoaded={isLoaded}
                isLocal={isLocal}
              />
            </aside>

            {/* Collapse Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute -right-4 top-20 glass rounded-full h-8 w-8 z-20"
              data-tabz-action="toggle-sidebar"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-auto" data-tabz-container="main" data-tabz-section={activeSection}>
            {/* Mobile header spacer */}
            <div className="h-16 lg:hidden" />

            {renderContent()}
          </main>
        </div>

        {/* Startup Jobs Modal */}
        <StartupJobsModal
          open={showStartupModal}
          jobs={pendingJobs}
          onClose={() => {
            setShowStartupModal(false)
            clearPendingJobs()
          }}
          onSkipAll={() => {
            setShowStartupModal(false)
            clearPendingJobs()
          }}
        />
      </div>
    </TooltipProvider>
  )
}

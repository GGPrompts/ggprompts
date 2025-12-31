"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Github,
  Cloud,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Key,
  Link2,
  Settings,
  TrendingUp,
  Rss,
  Rocket,
  Bot,
  Terminal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/AuthProvider"

// ============================================================================
// TYPES
// ============================================================================

type SectionNav = "profile" | "settings" | "feed"

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ElementType
  category: "auth" | "api" | "data"
  status: "connected" | "disconnected" | "partial"
  statusMessage?: string
  docsUrl?: string
  configLocation?: SectionNav
}

// ============================================================================
// INTEGRATION CARD COMPONENT
// ============================================================================

function IntegrationCard({
  integration,
  onNavigate,
}: {
  integration: Integration
  onNavigate?: (section: SectionNav) => void
}) {
  const Icon = integration.icon

  const statusConfig = {
    connected: {
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      label: "Connected",
    },
    disconnected: {
      icon: XCircle,
      color: "text-muted-foreground",
      bg: "bg-muted/10",
      border: "border-border",
      label: "Not Connected",
    },
    partial: {
      icon: RefreshCw,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      label: "Partially Configured",
    },
  }

  const config = statusConfig[integration.status]
  const StatusIcon = config.icon

  return (
    <Card className={`glass p-5 ${config.border} transition-colors`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-3 rounded-lg ${config.bg} flex-shrink-0`}>
          <Icon className={`h-6 w-6 ${config.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{integration.name}</h3>
            <Badge
              variant="outline"
              className={`${config.color} border-current/30 text-xs py-0`}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {integration.description}
          </p>

          {/* Status message */}
          {integration.statusMessage && (
            <p className="text-xs text-muted-foreground mb-3 italic">
              {integration.statusMessage}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {integration.configLocation && onNavigate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate(integration.configLocation!)}
                className="gap-1"
              >
                <Settings className="h-3 w-3" />
                Configure
              </Button>
            )}
            {integration.docsUrl && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-1"
              >
                <a
                  href={integration.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                  Docs
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function IntegrationsSection({
  activeSubItem,
  onSubItemHandled,
  onNavigateToSection,
}: {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
  onNavigateToSection?: (section: SectionNav) => void
}) {
  const { user } = useAuth()

  // Fetch API status
  const { data: apiStatus, isLoading } = useQuery<{
    apis: { finnhub: boolean; alphaVantage: boolean; github: boolean }
  }>({
    queryKey: ["api-status"],
    queryFn: async () => {
      const res = await fetch("/api/status")
      if (!res.ok) throw new Error("Failed to fetch status")
      return res.json()
    },
    staleTime: 30000,
  })

  // Handle sub-item navigation
  React.useEffect(() => {
    if (activeSubItem) {
      const element = document.getElementById(`integrations-${activeSubItem}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      onSubItemHandled?.()
    }
  }, [activeSubItem, onSubItemHandled])

  // Build integrations list based on current status
  const integrations: Integration[] = [
    {
      id: "github-oauth",
      name: "GitHub (OAuth)",
      description: "Sign in with GitHub to sync Quick Notes and Bookmarks across devices",
      icon: Github,
      category: "auth",
      status: user ? "connected" : "disconnected",
      statusMessage: user
        ? `Signed in as ${user.user_metadata?.user_name || user.email}`
        : "Sign in to enable cloud sync features",
      configLocation: "profile",
      docsUrl: "https://docs.github.com/en/apps/oauth-apps",
    },
    {
      id: "github-api",
      name: "GitHub API (Server)",
      description: "Server-side GitHub access for enhanced features",
      icon: Github,
      category: "api",
      status: apiStatus?.apis.github ? "connected" : "disconnected",
      statusMessage: apiStatus?.apis.github
        ? "GITHUB_TOKEN configured in environment"
        : "Optional: Set GITHUB_TOKEN in .env.local",
      configLocation: "settings",
      docsUrl: "https://github.com/settings/tokens/new",
    },
    {
      id: "finnhub",
      name: "Finnhub",
      description: "Real-time stock quotes for Paper Trading (60 requests/min free tier)",
      icon: TrendingUp,
      category: "api",
      status: apiStatus?.apis.finnhub ? "connected" : "disconnected",
      statusMessage: apiStatus?.apis.finnhub
        ? "API key configured"
        : "Set FINNHUB_API_KEY in .env.local",
      configLocation: "settings",
      docsUrl: "https://finnhub.io/register",
    },
    {
      id: "alpha-vantage",
      name: "Alpha Vantage",
      description: "Historical stock data and charts (25 requests/day free tier)",
      icon: TrendingUp,
      category: "api",
      status: apiStatus?.apis.alphaVantage ? "connected" : "disconnected",
      statusMessage: apiStatus?.apis.alphaVantage
        ? "API key configured"
        : "Set ALPHA_VANTAGE_API_KEY in .env.local",
      configLocation: "settings",
      docsUrl: "https://www.alphavantage.co/support/#api-key",
    },
    {
      id: "open-meteo",
      name: "Open-Meteo",
      description: "Weather data including forecasts, radar, and alerts",
      icon: Cloud,
      category: "data",
      status: "connected",
      statusMessage: "Free API, no configuration required",
      docsUrl: "https://open-meteo.com/",
    },
    {
      id: "feeds",
      name: "Content Feeds",
      description: "HN, GitHub Trending, Reddit, Lobsters, Dev.to aggregation",
      icon: Rss,
      category: "data",
      status: "connected",
      statusMessage: "Public APIs, no configuration required",
      configLocation: "feed",
    },
    {
      id: "spacex",
      name: "SpaceX API",
      description: "Launch schedules, rocket data, and mission tracking",
      icon: Rocket,
      category: "data",
      status: "connected",
      statusMessage: "Free public API, no configuration required",
      docsUrl: "https://github.com/r-spacex/SpaceX-API",
    },
    {
      id: "claude-cli",
      name: "Claude CLI",
      description: "AI Workspace and Claude Jobs powered by Claude Code CLI",
      icon: Terminal,
      category: "api",
      status: "connected",
      statusMessage: "Uses local Claude CLI installation",
      docsUrl: "https://docs.anthropic.com/en/docs/claude-code",
    },
  ]

  // Group by category
  const authIntegrations = integrations.filter((i) => i.category === "auth")
  const apiIntegrations = integrations.filter((i) => i.category === "api")
  const dataIntegrations = integrations.filter((i) => i.category === "data")

  // Stats
  const connectedCount = integrations.filter((i) => i.status === "connected").length
  const totalCount = integrations.length

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold terminal-glow">Integrations</h1>
        <Badge variant="outline" className="text-primary border-primary/30">
          {connectedCount}/{totalCount} connected
        </Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Connect external services to enhance your dashboard
      </p>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted/20 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="max-w-3xl space-y-8">
          {/* Authentication */}
          <div id="integrations-auth" className="scroll-mt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Authentication
            </h2>
            <div className="space-y-4">
              {authIntegrations.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onNavigate={onNavigateToSection}
                />
              ))}
            </div>
          </div>

          {/* API Keys */}
          <div id="integrations-apis" className="scroll-mt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              API Services
            </h2>
            <div className="space-y-4">
              {apiIntegrations.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onNavigate={onNavigateToSection}
                />
              ))}
            </div>
          </div>

          {/* Data Sources */}
          <div id="integrations-data" className="scroll-mt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Rss className="h-5 w-5 text-primary" />
              Data Sources
            </h2>
            <div className="space-y-4">
              {dataIntegrations.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onNavigate={onNavigateToSection}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

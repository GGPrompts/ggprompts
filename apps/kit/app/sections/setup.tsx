"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  CheckCircle2,
  XCircle,
  Cloud,
  TrendingUp,
  Github,
  Terminal,
  Settings2,
  Eye,
  EyeOff,
  GripVertical,
  Download,
  Upload,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ExternalLink,
  Bot,
  Key,
  Server,
  Folder,
  Sparkles,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/AuthProvider"
import { useTerminalExtension } from "@/hooks/useTerminalExtension"
import {
  useSectionPreferences,
  ToggleableSection,
  DEFAULT_SECTION_ORDER,
  DEFAULT_VISIBILITY,
} from "@/hooks/useSectionPreferences"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// ============================================================================
// TYPES
// ============================================================================

type WizardStep = "api-keys" | "sections" | "tabz" | "import-export" | "complete"

interface ApiKeyConfig {
  id: string
  name: string
  description: string
  storageKey: string
  icon: React.ElementType
  docsUrl?: string
  free?: boolean
  note?: string
  envVar?: string
  testable?: boolean
}

// Section metadata for setup display
const sectionMeta: Record<ToggleableSection, {
  label: string
  icon: React.ElementType
  description: string
  requiredApis?: string[]
}> = {
  weather: { label: "Weather", icon: Cloud, description: "Live weather monitoring", requiredApis: [] },
  feed: { label: "Daily Feed", icon: Cloud, description: "Aggregated content" },
  "market-pulse": { label: "Market Pulse", icon: TrendingUp, description: "Tech salary & job trends" },
  "api-playground": { label: "API Playground", icon: Settings2, description: "Test & debug APIs" },
  notes: { label: "Docs Editor", icon: Cloud, description: "GitHub-synced documentation", requiredApis: ["github"] },
  bookmarks: { label: "Bookmarks", icon: Cloud, description: "Quick links", requiredApis: ["github"] },
  search: { label: "Search Hub", icon: Cloud, description: "Search, AI & Image" },
  "ai-workspace": { label: "AI Workspace", icon: Bot, description: "Chat with AI models", requiredApis: ["anthropic", "openai", "google-ai"] },
  stocks: { label: "Paper Trading", icon: TrendingUp, description: "Practice stock trading", requiredApis: ["finnhub", "alpha-vantage"] },
  crypto: { label: "Crypto", icon: Cloud, description: "Live cryptocurrency prices" },
  spacex: { label: "SpaceX Launches", icon: Cloud, description: "Track rocket launches" },
  "github-activity": { label: "GitHub Activity", icon: Github, description: "GitHub events & repos", requiredApis: ["github"] },
  disasters: { label: "Disasters", icon: Cloud, description: "Earthquakes & alerts" },
  tasks: { label: "Scratchpad", icon: Cloud, description: "Quick notes and todos" },
  projects: { label: "Projects", icon: Folder, description: "GitHub & local repos" },
  jobs: { label: "Jobs", icon: Cloud, description: "Claude batch prompts", requiredApis: ["anthropic"] },
  integrations: { label: "Integrations", icon: Cloud, description: "Connected services" },
  profile: { label: "Profile", icon: Cloud, description: "Account & sync" },
  setup: { label: "Setup Wizard", icon: Sparkles, description: "Initial configuration" },
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getStoredApiKey(key: string): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem(key) || ""
}

function setStoredApiKey(key: string, value: string): void {
  if (typeof window === "undefined") return
  if (value.trim()) {
    localStorage.setItem(key, value.trim())
  } else {
    localStorage.removeItem(key)
  }
}

// ============================================================================
// STEP INDICATOR COMPONENT
// ============================================================================

function StepIndicator({
  steps,
  currentStep,
  onStepClick
}: {
  steps: { id: WizardStep; label: string }[]
  currentStep: WizardStep
  onStepClick: (step: WizardStep) => void
}) {
  const currentIndex = steps.findIndex(s => s.id === currentStep)

  return (
    <div className="flex items-center justify-center gap-2 mb-8" data-tabz-section="step-indicator">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isPast = index < currentIndex

        return (
          <React.Fragment key={step.id}>
            <button
              onClick={() => onStepClick(step.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${isActive
                  ? "glass border-primary text-primary"
                  : isPast
                    ? "glass-dark text-muted-foreground hover:text-foreground"
                    : "text-muted-foreground/50 hover:text-muted-foreground"
                }
              `}
              data-tabz-button={`step-${step.id}`}
            >
              <span className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                ${isActive
                  ? "bg-primary text-primary-foreground"
                  : isPast
                    ? "bg-emerald-500/20 text-emerald-500"
                    : "bg-muted/50 text-muted-foreground"
                }
              `}>
                {isPast ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ============================================================================
// API KEY INPUT COMPONENT
// ============================================================================

function ApiKeyInput({
  config,
  value,
  onChange,
  status,
  onTest,
  testing,
}: {
  config: ApiKeyConfig
  value: string
  onChange: (value: string) => void
  status: "valid" | "invalid" | "unknown" | "free"
  onTest?: () => void
  testing?: boolean
}) {
  const [showKey, setShowKey] = React.useState(false)
  const Icon = config.icon

  const statusConfig = {
    valid: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Connected" },
    invalid: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", label: "Invalid" },
    unknown: { icon: Key, color: "text-muted-foreground", bg: "bg-muted/10", label: "Not Configured" },
    free: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Free" },
  }

  const currentStatus = statusConfig[status]
  const StatusIcon = currentStatus.icon

  return (
    <Card
      className={`glass p-4 transition-colors ${
        status === "valid" || status === "free"
          ? "border-emerald-500/30"
          : status === "invalid"
            ? "border-red-500/30"
            : "border-border"
      }`}
      data-tabz-card={`api-key-${config.id}`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${currentStatus.bg} flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${currentStatus.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{config.name}</h4>
            <Badge
              variant="outline"
              className={`${currentStatus.color} border-current/30 text-xs py-0`}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {currentStatus.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{config.description}</p>

          {config.note && (
            <p className="text-xs text-muted-foreground mb-3 italic">{config.note}</p>
          )}

          {!config.free && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showKey ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={config.envVar ? `${config.envVar} or paste key` : "Paste your API key"}
                    className="font-mono text-sm pr-10"
                    data-tabz-input={`${config.id}-api-key`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowKey(!showKey)}
                    data-tabz-button={`toggle-${config.id}-visibility`}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {config.testable && onTest && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onTest}
                    disabled={!value.trim() || testing}
                    data-tabz-button={`test-${config.id}`}
                  >
                    {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Test"}
                  </Button>
                )}
              </div>

              {config.docsUrl && (
                <a
                  href={config.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  data-tabz-link={`${config.id}-docs`}
                >
                  Get API key <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// SORTABLE SECTION ITEM
// ============================================================================

function SortableSectionItem({
  sectionId,
  isEnabled,
  onToggleVisibility,
}: {
  sectionId: ToggleableSection
  isEnabled: boolean
  onToggleVisibility: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionId })

  const meta = sectionMeta[sectionId]
  const Icon = meta?.icon || Cloud

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
        isEnabled
          ? "border-border bg-background/50"
          : "border-border/50 bg-muted/10 opacity-60"
      } ${isDragging ? "opacity-30" : ""}`}
      data-tabz-section-item={sectionId}
    >
      <button
        className="touch-none cursor-grab active:cursor-grabbing p-1 -m-1 rounded hover:bg-muted/50 transition-colors"
        {...attributes}
        {...listeners}
        data-tabz-drag-handle={sectionId}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className={`h-8 w-8 rounded flex items-center justify-center flex-shrink-0 ${
        isEnabled ? "bg-primary/20" : "bg-muted/20"
      }`}>
        <Icon className={`h-4 w-4 ${isEnabled ? "text-primary" : "text-muted-foreground"}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${!isEnabled && "text-muted-foreground"}`}>
          {meta?.label || sectionId}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {meta?.description}
        </p>
        {meta?.requiredApis && meta.requiredApis.length > 0 && (
          <p className="text-xs text-amber-500 mt-0.5">
            Requires: {meta.requiredApis.join(", ")}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isEnabled ? (
          <Eye className="h-4 w-4 text-muted-foreground" />
        ) : (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        )}
        <Switch
          checked={isEnabled}
          onCheckedChange={onToggleVisibility}
          data-tabz-switch={`section-${sectionId}`}
        />
      </div>
    </div>
  )
}

// ============================================================================
// STEP 1: API KEYS
// ============================================================================

function ApiKeysStep() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch server-side API status
  const { data: apiStatus, isLoading, refetch } = useQuery<{
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

  // Client-side API key states
  const [finnhubKey, setFinnhubKey] = React.useState(() => getStoredApiKey("finnhub-api-key"))
  const [alphaVantageKey, setAlphaVantageKey] = React.useState(() => getStoredApiKey("alpha-vantage-api-key"))
  const [anthropicKey, setAnthropicKey] = React.useState(() => getStoredApiKey("anthropic-api-key"))
  const [openaiKey, setOpenaiKey] = React.useState(() => getStoredApiKey("openai-api-key"))
  const [googleAiKey, setGoogleAiKey] = React.useState(() => getStoredApiKey("google-ai-key"))

  // Test states
  const [testingFinnhub, setTestingFinnhub] = React.useState(false)
  const [finnhubStatus, setFinnhubStatus] = React.useState<"valid" | "invalid" | "unknown">("unknown")

  // Save keys to localStorage
  React.useEffect(() => {
    setStoredApiKey("finnhub-api-key", finnhubKey)
  }, [finnhubKey])

  React.useEffect(() => {
    setStoredApiKey("alpha-vantage-api-key", alphaVantageKey)
  }, [alphaVantageKey])

  React.useEffect(() => {
    setStoredApiKey("anthropic-api-key", anthropicKey)
  }, [anthropicKey])

  React.useEffect(() => {
    setStoredApiKey("openai-api-key", openaiKey)
  }, [openaiKey])

  React.useEffect(() => {
    setStoredApiKey("google-ai-key", googleAiKey)
  }, [googleAiKey])

  // Test Finnhub API key
  const testFinnhub = async () => {
    if (!finnhubKey.trim()) return
    setTestingFinnhub(true)
    try {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${finnhubKey.trim()}`)
      if (res.ok) {
        const data = await res.json()
        if (data.c && data.c > 0) {
          setFinnhubStatus("valid")
        } else {
          setFinnhubStatus("invalid")
        }
      } else {
        setFinnhubStatus("invalid")
      }
    } catch {
      setFinnhubStatus("invalid")
    } finally {
      setTestingFinnhub(false)
    }
  }

  const apiConfigs: ApiKeyConfig[] = [
    {
      id: "open-meteo",
      name: "Open-Meteo (Weather)",
      description: "Weather data including forecasts, radar, and alerts",
      storageKey: "",
      icon: Cloud,
      free: true,
      note: "Free API, no configuration required",
    },
    {
      id: "finnhub",
      name: "Finnhub",
      description: "Real-time stock quotes for Paper Trading",
      storageKey: "finnhub-api-key",
      icon: TrendingUp,
      docsUrl: "https://finnhub.io/register",
      envVar: "FINNHUB_API_KEY",
      note: "Free tier: 60 requests/min",
      testable: true,
    },
    {
      id: "alpha-vantage",
      name: "Alpha Vantage",
      description: "Historical chart data for Paper Trading",
      storageKey: "alpha-vantage-api-key",
      icon: TrendingUp,
      docsUrl: "https://www.alphavantage.co/support/#api-key",
      envVar: "ALPHA_VANTAGE_API_KEY",
      note: "Free tier: 25 requests/day, 5/min",
    },
    {
      id: "anthropic",
      name: "Anthropic (Claude)",
      description: "AI chat and code assistance in AI Workspace",
      storageKey: "anthropic-api-key",
      icon: Bot,
      docsUrl: "https://console.anthropic.com/settings/keys",
      note: "Required for AI Workspace and Jobs sections",
    },
    {
      id: "openai",
      name: "OpenAI",
      description: "GPT models for AI Workspace",
      storageKey: "openai-api-key",
      icon: Bot,
      docsUrl: "https://platform.openai.com/api-keys",
      note: "Optional, enables GPT models in AI Workspace",
    },
    {
      id: "google-ai",
      name: "Google AI (Gemini)",
      description: "Gemini models for AI Workspace",
      storageKey: "google-ai-key",
      icon: Bot,
      docsUrl: "https://aistudio.google.com/app/apikey",
      note: "Optional, enables Gemini models in AI Workspace",
    },
  ]

  const getKeyValue = (id: string): string => {
    switch (id) {
      case "finnhub": return finnhubKey
      case "alpha-vantage": return alphaVantageKey
      case "anthropic": return anthropicKey
      case "openai": return openaiKey
      case "google-ai": return googleAiKey
      default: return ""
    }
  }

  const setKeyValue = (id: string, value: string) => {
    switch (id) {
      case "finnhub": setFinnhubKey(value); break
      case "alpha-vantage": setAlphaVantageKey(value); break
      case "anthropic": setAnthropicKey(value); break
      case "openai": setOpenaiKey(value); break
      case "google-ai": setGoogleAiKey(value); break
    }
  }

  const getStatus = (id: string): "valid" | "invalid" | "unknown" | "free" => {
    if (id === "open-meteo") return "free"
    if (id === "finnhub") {
      if (apiStatus?.apis.finnhub) return "valid"
      if (finnhubStatus === "valid") return "valid"
      if (finnhubStatus === "invalid") return "invalid"
      return finnhubKey.trim() ? "unknown" : "unknown"
    }
    if (id === "alpha-vantage") {
      return apiStatus?.apis.alphaVantage ? "valid" : alphaVantageKey.trim() ? "unknown" : "unknown"
    }
    const value = getKeyValue(id)
    return value.trim() ? "unknown" : "unknown"
  }

  return (
    <div className="space-y-6" data-tabz-step="api-keys">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Configure API Keys</h2>
        <p className="text-muted-foreground">
          Add API keys to unlock features. Most features work without any keys.
        </p>
      </div>

      {/* GitHub OAuth Status */}
      <Card className={`glass p-4 ${user ? "border-emerald-500/30" : "border-border"}`} data-tabz-card="github-oauth">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg ${user ? "bg-emerald-500/10" : "bg-muted/10"} flex-shrink-0`}>
            <Github className={`h-5 w-5 ${user ? "text-emerald-500" : "text-muted-foreground"}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">GitHub OAuth</h4>
              <Badge
                variant="outline"
                className={`${user ? "text-emerald-500" : "text-muted-foreground"} border-current/30 text-xs py-0`}
              >
                {user ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Connected
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Connected
                  </>
                )}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Sign in with GitHub to sync Quick Notes and Bookmarks across devices
            </p>
            {user ? (
              <p className="text-xs text-emerald-500">
                Signed in as @{user.user_metadata?.user_name || user.email}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Go to Profile section to sign in
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* API Keys */}
      <div className="space-y-4">
        {apiConfigs.map((config) => (
          <ApiKeyInput
            key={config.id}
            config={config}
            value={getKeyValue(config.id)}
            onChange={(v) => setKeyValue(config.id, v)}
            status={getStatus(config.id)}
            onTest={config.id === "finnhub" ? testFinnhub : undefined}
            testing={config.id === "finnhub" ? testingFinnhub : false}
          />
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground pt-4">
        <p>
          Environment variable API keys (from .env.local) take precedence over stored keys.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// STEP 2: SECTIONS
// ============================================================================

function SectionsStep() {
  const {
    visibility,
    order,
    isLoaded,
    toggleVisibility,
    reorder,
    resetToDefaults,
  } = useSectionPreferences()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  if (!isLoaded) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-14 bg-muted/20 rounded-lg" />
        ))}
      </div>
    )
  }

  const visibleCount = Object.values(visibility).filter(Boolean).length

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = order.indexOf(active.id as ToggleableSection)
      const newIndex = order.indexOf(over.id as ToggleableSection)
      const newOrder = arrayMove(order, oldIndex, newIndex)
      reorder(newOrder)
    }
  }

  return (
    <div className="space-y-6" data-tabz-step="sections">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Choose Your Sections</h2>
        <p className="text-muted-foreground">
          Toggle sections on/off and drag to reorder. Changes save automatically.
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {visibleCount} of {order.length} sections visible
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetToDefaults}
          className="text-xs h-7 gap-1"
          data-tabz-button="reset-sections"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {order.map((sectionId) => (
              <SortableSectionItem
                key={sectionId}
                sectionId={sectionId}
                isEnabled={visibility[sectionId]}
                onToggleVisibility={() => toggleVisibility(sectionId)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <p className="text-xs text-muted-foreground text-center pt-2">
        Home and Settings are always visible. Hidden sections won&apos;t appear in the sidebar.
      </p>
    </div>
  )
}

// ============================================================================
// STEP 3: TABZCHROME
// ============================================================================

function TabzChromeStep() {
  const {
    available,
    backendRunning,
    authenticated,
    error,
    hasToken,
    defaultWorkDir,
    setApiToken,
    clearApiToken,
    refreshStatus,
    updateDefaultWorkDir,
    runCommand,
  } = useTerminalExtension()

  const [tokenInput, setTokenInput] = React.useState("")
  const [showToken, setShowToken] = React.useState(false)
  const [tokenError, setTokenError] = React.useState<string | null>(null)
  const [workDirInput, setWorkDirInput] = React.useState(defaultWorkDir)
  const [refreshing, setRefreshing] = React.useState(false)
  const [testingSpawn, setTestingSpawn] = React.useState(false)
  const [spawnResult, setSpawnResult] = React.useState<string | null>(null)

  React.useEffect(() => {
    setWorkDirInput(defaultWorkDir)
  }, [defaultWorkDir])

  const handleTokenSubmit = async () => {
    if (!tokenInput.trim()) return
    setTokenError(null)
    const success = await setApiToken(tokenInput.trim())
    if (success) {
      setTokenInput("")
      setShowToken(false)
    } else {
      setTokenError("Could not verify token. Make sure the TabzChrome backend is running.")
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    setTokenError(null)
    await refreshStatus()
    setRefreshing(false)
  }

  const handleTestSpawn = async () => {
    setTestingSpawn(true)
    setSpawnResult(null)
    try {
      const result = await runCommand("echo 'Setup wizard test - TabzChrome is working!'", {
        name: "Setup Test",
        workingDir: workDirInput || defaultWorkDir,
      })
      if (result.success) {
        setSpawnResult("success")
      } else {
        setSpawnResult(result.error || "Failed to spawn terminal")
      }
    } catch (err) {
      setSpawnResult(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setTestingSpawn(false)
    }
  }

  return (
    <div className="space-y-6" data-tabz-step="tabz">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">TabzChrome Integration</h2>
        <p className="text-muted-foreground">
          Connect TabzChrome to launch terminals from bookmarks and control browser tabs.
        </p>
      </div>

      {/* Connection Status */}
      <Card className="glass p-4" data-tabz-card="connection-status">
        <div className="space-y-4">
          {/* Backend Status */}
          <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
            <div className="flex items-center gap-3">
              <Server className={`h-5 w-5 ${backendRunning ? "text-emerald-400" : "text-muted-foreground"}`} />
              <div>
                <p className="font-medium">Backend Server</p>
                <p className="text-xs text-muted-foreground">localhost:8129</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={backendRunning
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-muted text-muted-foreground"
                }
              >
                {backendRunning ? "Running" : "Not Running"}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleRefresh}
                disabled={refreshing}
                data-tabz-button="refresh-status"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Auth Status */}
          <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
            <div className="flex items-center gap-3">
              <Key className={`h-5 w-5 ${authenticated ? "text-emerald-400" : hasToken ? "text-amber-400" : "text-muted-foreground"}`} />
              <div>
                <p className="font-medium">API Token</p>
                <p className="text-xs text-muted-foreground">
                  {authenticated
                    ? "Authenticated"
                    : hasToken
                    ? "Token stored (not verified)"
                    : "Not configured"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {authenticated ? (
                <>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                    Connected
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={clearApiToken}
                    data-tabz-button="clear-token"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Required
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && !authenticated && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-amber-400">{error}</p>
        </div>
      )}

      {/* Token Input */}
      {!authenticated && (
        <Card className="glass p-4" data-tabz-card="token-input">
          <Label className="text-sm mb-2 block">API Token</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showToken ? "text" : "password"}
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value)
                  setTokenError(null)
                }}
                placeholder="Paste your TabzChrome API token"
                className="font-mono text-sm pr-10"
                data-tabz-input="tabz-api-token"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowToken(!showToken)}
                data-tabz-button="toggle-token-visibility"
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              onClick={handleTokenSubmit}
              disabled={!tokenInput.trim()}
              data-tabz-button="save-token"
            >
              Save
            </Button>
          </div>
          {tokenError && (
            <p className="text-xs text-destructive mt-2">{tokenError}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Get your API token from TabzChrome extension: <strong>Settings &rarr; API Token &rarr; Copy</strong>
          </p>
        </Card>
      )}

      {/* Default Working Directory */}
      <Card className="glass p-4" data-tabz-card="default-workdir">
        <Label className="text-sm mb-2 block">Default Working Directory</Label>
        <div className="flex gap-2">
          <Input
            value={workDirInput}
            onChange={(e) => setWorkDirInput(e.target.value)}
            placeholder="~/projects"
            className="font-mono text-sm"
            data-tabz-input="default-workdir"
          />
          <Button
            onClick={() => updateDefaultWorkDir(workDirInput)}
            disabled={workDirInput === defaultWorkDir}
            variant={workDirInput === defaultWorkDir ? "outline" : "default"}
            data-tabz-button="save-workdir"
          >
            {workDirInput === defaultWorkDir ? "Saved" : "Save"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Used when launching terminals without a specific working directory.
        </p>
      </Card>

      {/* Test Spawn Button */}
      {authenticated && (
        <Card className="glass p-4" data-tabz-card="test-spawn">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Test Terminal Spawn</h4>
              <p className="text-sm text-muted-foreground">
                Spawn a test terminal to verify everything is working
              </p>
            </div>
            <Button
              onClick={handleTestSpawn}
              disabled={testingSpawn}
              data-tabz-button="test-spawn"
            >
              {testingSpawn ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Terminal className="h-4 w-4 mr-2" />
                  Test Spawn
                </>
              )}
            </Button>
          </div>
          {spawnResult && (
            <div className={`mt-3 p-2 rounded text-sm ${
              spawnResult === "success"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}>
              {spawnResult === "success" ? "Terminal spawned successfully!" : spawnResult}
            </div>
          )}
        </Card>
      )}

      {/* Extension Link */}
      <div className="text-center text-sm text-muted-foreground">
        <a
          href="https://github.com/anthropics/tabz-chrome"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline inline-flex items-center gap-1"
          data-tabz-link="extension-install"
        >
          Install TabzChrome Extension <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}

// ============================================================================
// STEP 4: IMPORT/EXPORT
// ============================================================================

function ImportExportStep() {
  const { visibility, order, reorder } = useSectionPreferences()
  const { defaultWorkDir, updateDefaultWorkDir } = useTerminalExtension()

  const [importError, setImportError] = React.useState<string | null>(null)
  const [importSuccess, setImportSuccess] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const exportConfig = () => {
    const config = {
      version: 1,
      exportedAt: new Date().toISOString(),
      apiKeys: {
        finnhub: getStoredApiKey("finnhub-api-key") ? "***configured***" : null,
        alphaVantage: getStoredApiKey("alpha-vantage-api-key") ? "***configured***" : null,
        anthropic: getStoredApiKey("anthropic-api-key") ? "***configured***" : null,
        openai: getStoredApiKey("openai-api-key") ? "***configured***" : null,
        googleAi: getStoredApiKey("google-ai-key") ? "***configured***" : null,
      },
      sections: {
        visibility,
        order,
      },
      tabzChrome: {
        token: getStoredApiKey("tabz-api-token") ? "***configured***" : null,
        defaultWorkDir,
      },
    }

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `personal-homepage-config-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportError(null)
    setImportSuccess(false)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string)

        if (!config.version) {
          throw new Error("Invalid config file: missing version")
        }

        // Import sections preferences
        if (config.sections) {
          if (config.sections.visibility) {
            localStorage.setItem("section-preferences", JSON.stringify({
              visibility: config.sections.visibility,
              order: config.sections.order || order,
            }))
          }
        }

        // Import TabzChrome settings
        if (config.tabzChrome?.defaultWorkDir) {
          updateDefaultWorkDir(config.tabzChrome.defaultWorkDir)
        }

        setImportSuccess(true)
        // Reload to apply changes
        setTimeout(() => window.location.reload(), 1500)
      } catch (err) {
        setImportError(err instanceof Error ? err.message : "Failed to parse config file")
      }
    }
    reader.readAsText(file)
  }

  const resetToDefaults = () => {
    if (!confirm("This will reset all settings to defaults. API keys will NOT be deleted. Continue?")) {
      return
    }

    localStorage.setItem("section-preferences", JSON.stringify({
      visibility: DEFAULT_VISIBILITY,
      order: DEFAULT_SECTION_ORDER,
    }))
    updateDefaultWorkDir("~/projects")
    window.location.reload()
  }

  return (
    <div className="space-y-6" data-tabz-step="import-export">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Import / Export Settings</h2>
        <p className="text-muted-foreground">
          Backup your configuration or restore from a previous export.
        </p>
      </div>

      {/* Export */}
      <Card className="glass p-6" data-tabz-card="export">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
            <Download className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-1">Export Configuration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download your current settings as a JSON file. API keys are not exported for security.
            </p>
            <Button onClick={exportConfig} data-tabz-button="export-config">
              <Download className="h-4 w-4 mr-2" />
              Export Config
            </Button>
          </div>
        </div>
      </Card>

      {/* Import */}
      <Card className="glass p-6" data-tabz-card="import">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-1">Import Configuration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Restore settings from a previously exported JSON file.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              data-tabz-button="import-config"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Config
            </Button>
            {importError && (
              <p className="text-sm text-destructive mt-2">{importError}</p>
            )}
            {importSuccess && (
              <p className="text-sm text-emerald-500 mt-2">
                Config imported successfully! Reloading...
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Reset */}
      <Card className="glass p-6 border-destructive/20" data-tabz-card="reset">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-destructive/10 flex-shrink-0">
            <RotateCcw className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-1">Reset to Defaults</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Reset section visibility and order to defaults. API keys will be preserved.
            </p>
            <Button
              variant="destructive"
              onClick={resetToDefaults}
              data-tabz-button="reset-defaults"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// STEP 5: COMPLETE
// ============================================================================

function CompleteStep({ onStartOver }: { onStartOver: () => void }) {
  return (
    <div className="space-y-6 text-center py-8" data-tabz-step="complete">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <Sparkles className="h-6 w-6 text-primary absolute -top-1 -right-1 animate-pulse" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">Setup Complete!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your personal homepage is configured and ready to use.
          You can always return here to adjust settings.
        </p>
      </div>

      <div className="pt-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          Use the sidebar to navigate between sections, or click below to start fresh.
        </p>
        <Button
          variant="outline"
          onClick={onStartOver}
          className="gap-2"
          data-tabz-button="start-over"
        >
          <RotateCcw className="h-4 w-4" />
          Review Setup Again
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SetupSection({
  activeSubItem,
  onSubItemHandled,
}: {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
}) {
  const [currentStep, setCurrentStep] = React.useState<WizardStep>("api-keys")

  const steps: { id: WizardStep; label: string }[] = [
    { id: "api-keys", label: "API Keys" },
    { id: "sections", label: "Sections" },
    { id: "tabz", label: "TabzChrome" },
    { id: "import-export", label: "Import/Export" },
    { id: "complete", label: "Done" },
  ]

  const currentIndex = steps.findIndex(s => s.id === currentStep)
  const isFirst = currentIndex === 0
  const isLast = currentIndex === steps.length - 1

  // Handle sub-item navigation
  React.useEffect(() => {
    if (activeSubItem) {
      const step = steps.find(s => s.id === activeSubItem)
      if (step) {
        setCurrentStep(step.id)
      }
      onSubItemHandled?.()
    }
  }, [activeSubItem, onSubItemHandled])

  const renderStep = () => {
    switch (currentStep) {
      case "api-keys":
        return <ApiKeysStep />
      case "sections":
        return <SectionsStep />
      case "tabz":
        return <TabzChromeStep />
      case "import-export":
        return <ImportExportStep />
      case "complete":
        return <CompleteStep onStartOver={() => setCurrentStep("api-keys")} />
      default:
        return <ApiKeysStep />
    }
  }

  return (
    <div className="p-6" data-tabz-section="setup">
      <h1 className="text-3xl font-bold terminal-glow mb-2">Setup Wizard</h1>
      <p className="text-muted-foreground mb-8">
        Configure your personal homepage in a few easy steps
      </p>

      <div className="max-w-3xl mx-auto">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />

        <div className="glass rounded-xl p-6 mb-6">
          {renderStep()}
        </div>

        {/* Navigation - hidden on complete step */}
        {currentStep !== "complete" && (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(steps[currentIndex - 1].id)}
              disabled={isFirst}
              data-tabz-button="prev-step"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {currentIndex + 1} of {steps.length - 1}
            </div>

            {currentStep === "import-export" ? (
              <Button
                onClick={() => setCurrentStep("complete")}
                className="bg-emerald-600 hover:bg-emerald-700"
                data-tabz-button="finish-setup"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Finish
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentStep(steps[currentIndex + 1].id)}
                data-tabz-button="next-step"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

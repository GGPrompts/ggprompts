"use client"

import * as React from "react"
import {
  Search,
  Globe,
  Code2,
  HelpCircle,
  Package,
  BookOpen,
  Youtube,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Bot,
  Zap,
  Brain,
  Compass,
  MessageCircle,
  Image,
  Palette,
  Wand2,
  ImagePlus,
  Brush,
  Camera,
  Clipboard,
  Check,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TabzConnectionStatus } from "@/components/TabzConnectionStatus"

// ============================================================================
// TYPES
// ============================================================================

type Category = "search" | "ai" | "image"

interface SearchEngine {
  id: string
  name: string
  shortcut: string
  icon: React.ElementType
  urlTemplate: string
  placeholder: string
  color: string
  category: Category
  note?: string // For services with limitations
  copyPrompt?: boolean // If true, copy prompt to clipboard instead of URL param
}

// ============================================================================
// ENGINES CONFIG
// ============================================================================

const allEngines: SearchEngine[] = [
  // Search Engines
  {
    id: "google",
    name: "Google",
    shortcut: "g",
    icon: Globe,
    urlTemplate: "https://www.google.com/search?q={query}",
    placeholder: "Search the web...",
    color: "text-blue-400",
    category: "search",
  },
  {
    id: "github",
    name: "GitHub",
    shortcut: "gh",
    icon: Code2,
    urlTemplate: "https://github.com/search?q={query}&type=repositories",
    placeholder: "Search repositories...",
    color: "text-purple-400",
    category: "search",
  },
  {
    id: "stackoverflow",
    name: "Stack Overflow",
    shortcut: "so",
    icon: HelpCircle,
    urlTemplate: "https://stackoverflow.com/search?q={query}",
    placeholder: "Search questions...",
    color: "text-orange-400",
    category: "search",
  },
  {
    id: "npm",
    name: "npm",
    shortcut: "npm",
    icon: Package,
    urlTemplate: "https://www.npmjs.com/search?q={query}",
    placeholder: "Search packages...",
    color: "text-red-400",
    category: "search",
  },
  {
    id: "mdn",
    name: "MDN",
    shortcut: "mdn",
    icon: BookOpen,
    urlTemplate: "https://developer.mozilla.org/en-US/search?q={query}",
    placeholder: "Search MDN docs...",
    color: "text-sky-400",
    category: "search",
  },
  {
    id: "youtube",
    name: "YouTube",
    shortcut: "yt",
    icon: Youtube,
    urlTemplate: "https://www.youtube.com/results?search_query={query}",
    placeholder: "Search videos...",
    color: "text-red-500",
    category: "search",
  },
  {
    id: "reddit",
    name: "Reddit",
    shortcut: "r",
    icon: MessageSquare,
    urlTemplate: "https://www.reddit.com/search/?q={query}",
    placeholder: "Search Reddit...",
    color: "text-orange-500",
    category: "search",
  },
  // AI Assistants
  {
    id: "chatgpt",
    name: "ChatGPT",
    shortcut: "gpt",
    icon: Sparkles,
    urlTemplate: "https://chatgpt.com/?q={query}",
    placeholder: "Ask ChatGPT...",
    color: "text-emerald-400",
    category: "ai",
  },
  {
    id: "claude",
    name: "Claude",
    shortcut: "cl",
    icon: Bot,
    urlTemplate: "https://claude.ai/new?q={query}",
    placeholder: "Ask Claude...",
    color: "text-amber-400",
    category: "ai",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    shortcut: "px",
    icon: Compass,
    urlTemplate: "https://www.perplexity.ai/search?q={query}",
    placeholder: "Search with Perplexity...",
    color: "text-cyan-400",
    category: "ai",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    shortcut: "ds",
    icon: Brain,
    urlTemplate: "https://chat.deepseek.com/?q={query}",
    placeholder: "Ask DeepSeek...",
    color: "text-blue-500",
    category: "ai",
  },
  {
    id: "phind",
    name: "Phind",
    shortcut: "ph",
    icon: Zap,
    urlTemplate: "https://www.phind.com/search?q={query}",
    placeholder: "Search with Phind...",
    color: "text-violet-400",
    category: "ai",
  },
  {
    id: "you",
    name: "You.com",
    shortcut: "you",
    icon: MessageCircle,
    urlTemplate: "https://you.com/search?q={query}&tbm=youchat",
    placeholder: "Ask You.com...",
    color: "text-indigo-400",
    category: "ai",
  },
  // Image Generation
  {
    id: "sora",
    name: "Sora",
    shortcut: "sora",
    icon: Sparkles,
    urlTemplate: "https://sora.chatgpt.com/",
    placeholder: "Describe a video or image...",
    color: "text-emerald-400",
    category: "image",
    copyPrompt: true,
  },
  {
    id: "bing-image",
    name: "Bing Create",
    shortcut: "bi",
    icon: ImagePlus,
    urlTemplate: "https://www.bing.com/images/create",
    placeholder: "Describe an image...",
    color: "text-cyan-400",
    category: "image",
    copyPrompt: true,
  },
  {
    id: "ideogram",
    name: "Ideogram",
    shortcut: "ideo",
    icon: Palette,
    urlTemplate: "https://ideogram.ai/",
    placeholder: "Describe an image...",
    color: "text-purple-400",
    category: "image",
    copyPrompt: true,
  },
  {
    id: "leonardo",
    name: "Leonardo.ai",
    shortcut: "leo",
    icon: Wand2,
    urlTemplate: "https://app.leonardo.ai/ai-generations",
    placeholder: "Describe an image...",
    color: "text-amber-400",
    category: "image",
    copyPrompt: true,
  },
  {
    id: "tensor",
    name: "Tensor.Art",
    shortcut: "ta",
    icon: Brush,
    urlTemplate: "https://tensor.art/",
    placeholder: "Search models or generate...",
    color: "text-pink-400",
    category: "image",
    copyPrompt: true,
  },
  {
    id: "playground",
    name: "Playground",
    shortcut: "pg",
    icon: Camera,
    urlTemplate: "https://playground.com/create",
    placeholder: "Describe an image...",
    color: "text-emerald-400",
    category: "image",
    copyPrompt: true,
  },
  {
    id: "lexica",
    name: "Lexica",
    shortcut: "lex",
    icon: Image,
    urlTemplate: "https://lexica.art/",
    placeholder: "Search or describe...",
    color: "text-rose-400",
    category: "image",
    copyPrompt: true,
  },
]

const searchEngines = allEngines.filter((e) => e.category === "search")
const aiEngines = allEngines.filter((e) => e.category === "ai")
const imageEngines = allEngines.filter((e) => e.category === "image")

// ============================================================================
// STORAGE
// ============================================================================

const STORAGE_KEY = "search-hub-prefs"

interface SearchPrefs {
  defaultEngine: string
  activeCategory: Category
  recentSearches: { query: string; engine: string; timestamp: string }[]
}

function loadPrefs(): SearchPrefs {
  if (typeof window === "undefined") {
    return { defaultEngine: "google", activeCategory: "search", recentSearches: [] }
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    // Invalid JSON
  }
  return { defaultEngine: "google", activeCategory: "search", recentSearches: [] }
}

function savePrefs(prefs: SearchPrefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SearchHubSection({
  activeSubItem,
  onSubItemHandled,
}: {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
}) {
  const [query, setQuery] = React.useState("")
  const [selectedEngine, setSelectedEngine] = React.useState<string>("google")
  const [activeCategory, setActiveCategory] = React.useState<Category>("search")
  const [prefs, setPrefs] = React.useState<SearchPrefs>({ defaultEngine: "google", activeCategory: "search", recentSearches: [] })
  const [copied, setCopied] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const currentEngines = activeCategory === "search"
    ? searchEngines
    : activeCategory === "ai"
      ? aiEngines
      : imageEngines

  // Load preferences on mount
  React.useEffect(() => {
    const loaded = loadPrefs()
    setPrefs(loaded)
    setActiveCategory(loaded.activeCategory || "search")
    // Set engine based on saved category
    const savedEngine = allEngines.find((e) => e.id === loaded.defaultEngine)
    if (savedEngine && savedEngine.category === loaded.activeCategory) {
      setSelectedEngine(loaded.defaultEngine)
    } else {
      // Default to first engine in category
      const defaultEngines: Record<Category, string> = {
        search: "google",
        ai: "chatgpt",
        image: "sora",
      }
      setSelectedEngine(defaultEngines[loaded.activeCategory] || "google")
    }
  }, [])

  // Auto-focus input when section opens
  React.useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Handle sub-item navigation
  React.useEffect(() => {
    if (activeSubItem) {
      onSubItemHandled?.()
    }
  }, [activeSubItem, onSubItemHandled])


  // Keyboard shortcuts for engine selection
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle when input is focused
      if (document.activeElement !== inputRef.current) return

      // Alt + number to select engine (avoids Win key and Ctrl+num browser conflicts)
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.key >= "1" && e.key <= "9") {
        e.preventDefault()
        const index = parseInt(e.key) - 1
        if (currentEngines[index]) {
          setSelectedEngine(currentEngines[index].id)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentEngines])

  const currentEngine = allEngines.find((e) => e.id === selectedEngine) || currentEngines[0]
  const Icon = currentEngine.icon

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim()) return

    // Copy to clipboard if engine requires it
    if (currentEngine.copyPrompt) {
      try {
        await navigator.clipboard.writeText(query.trim())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    }

    // Build URL (may or may not include query based on engine config)
    const url = currentEngine.urlTemplate.replace("{query}", encodeURIComponent(query.trim()))

    // Save to recent searches
    const newSearch = { query: query.trim(), engine: selectedEngine, timestamp: new Date().toISOString() }
    const updatedPrefs = {
      ...prefs,
      recentSearches: [newSearch, ...prefs.recentSearches.slice(0, 9)],
    }
    setPrefs(updatedPrefs)
    savePrefs(updatedPrefs)

    // Open in new tab
    window.open(url, "_blank")

    // Clear input
    setQuery("")
  }

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category)
    // Switch to first engine in new category
    const defaultEngines: Record<Category, string> = {
      search: "google",
      ai: "chatgpt",
      image: "sora",
    }
    const defaultEngine = defaultEngines[category]
    setSelectedEngine(defaultEngine)
    // Save preference
    const updatedPrefs = { ...prefs, activeCategory: category, defaultEngine }
    setPrefs(updatedPrefs)
    savePrefs(updatedPrefs)
    inputRef.current?.focus()
  }

  const handleEngineSelect = (engineId: string) => {
    setSelectedEngine(engineId)
    // Save as default
    const updatedPrefs = { ...prefs, defaultEngine: engineId }
    setPrefs(updatedPrefs)
    savePrefs(updatedPrefs)
    // Focus input after selection
    inputRef.current?.focus()
  }

  const handleRecentSearch = (recent: { query: string; engine: string }) => {
    const engine = allEngines.find((e) => e.id === recent.engine)
    if (engine) {
      setActiveCategory(engine.category)
    }
    setQuery(recent.query)
    setSelectedEngine(recent.engine)
    inputRef.current?.focus()
  }

  const clearRecentSearches = () => {
    const updatedPrefs = { ...prefs, recentSearches: [] }
    setPrefs(updatedPrefs)
    savePrefs(updatedPrefs)
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-start justify-between mb-1 sm:mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold terminal-glow">Search Hub</h1>
        <TabzConnectionStatus size="sm" className="hidden sm:flex" />
      </div>
      <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">Quick search across engines and AI assistants</p>

      {/* Search Form */}
      <div className="max-w-2xl mx-auto">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleCategoryChange("search")}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${activeCategory === "search"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
              }
            `}
          >
            <Search className="h-4 w-4" />
            Search
          </button>
          <button
            onClick={() => handleCategoryChange("ai")}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${activeCategory === "ai"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
              }
            `}
          >
            <Sparkles className="h-4 w-4" />
            AI Chat
          </button>
          <button
            onClick={() => handleCategoryChange("image")}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${activeCategory === "image"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
              }
            `}
          >
            <Image className="h-4 w-4" />
            Image AI
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="glass rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-2 rounded-lg bg-primary/10 ${currentEngine.color} flex-shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={currentEngine.placeholder}
                    className="text-base sm:text-lg h-11 sm:h-12 bg-transparent border border-transparent rounded-lg px-3 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0 focus-visible:border-primary/30"
                  />
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button type="submit" disabled={!query.trim()} className="h-11 sm:h-10 flex-1 sm:flex-initial">
                  {activeCategory === "ai" ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Ask
                    </>
                  ) : activeCategory === "image" ? (
                    <>
                      <Image className="h-4 w-4 mr-2" />
                      Generate
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Engine Selection */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {currentEngines.map((engine, index) => {
                const EngineIcon = engine.icon
                const isSelected = selectedEngine === engine.id
                return (
                  <button
                    key={engine.id}
                    type="button"
                    onClick={() => handleEngineSelect(engine.id)}
                    className={`
                      flex items-center gap-1 sm:gap-1.5 px-2.5 py-2 sm:px-3 sm:py-1.5 rounded-md text-sm transition-all
                      ${isSelected
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
                      }
                    `}
                  >
                    <EngineIcon className={`h-4 w-4 sm:h-3.5 sm:w-3.5 ${isSelected ? engine.color : ""}`} />
                    <span className="hidden sm:inline">{engine.name}</span>
                    <span className="sm:hidden text-xs">{engine.shortcut}</span>
                    {engine.copyPrompt && (
                      <Clipboard className="h-3 w-3 opacity-50 hidden sm:block" />
                    )}
                    <kbd className="ml-1 text-[10px] opacity-50 font-mono hidden sm:inline-flex items-center gap-0.5">
                      Alt+{index + 1}
                    </kbd>
                  </button>
                )
              })}
            </div>

            {/* Copied feedback */}
            {copied && (
              <div className="flex items-center gap-2 mt-3 text-sm text-emerald-400">
                <Check className="h-4 w-4" />
                <span>Prompt copied to clipboard - paste when page loads</span>
              </div>
            )}
          </div>
        </form>

        {/* Quick Tips - hidden on mobile */}
        <div className="hidden sm:block glass rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium mb-3">Quick Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-mono">
                Alt+1-{currentEngines.length}
              </Badge>
              <span>Switch between {
                activeCategory === "ai" ? "AI assistants" :
                activeCategory === "image" ? "image generators" :
                "search engines"
              }</span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-mono">Enter</Badge>
              <span>{
                activeCategory === "ai" ? "Send prompt in new tab" :
                activeCategory === "image" ? "Generate in new tab" :
                "Execute search in new tab"
              }</span>
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="h-3.5 w-3.5 text-primary" />
              <span>Your default {
                activeCategory === "ai" ? "assistant" :
                activeCategory === "image" ? "generator" :
                "engine"
              } is saved automatically</span>
            </li>
          </ul>
        </div>

        {/* Recent Searches */}
        {prefs.recentSearches.length > 0 && (
          <div className="glass rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Recent</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRecentSearches}
                className="text-xs text-muted-foreground hover:text-foreground h-7"
              >
                Clear all
              </Button>
            </div>
            <ul className="space-y-1">
              {prefs.recentSearches.slice(0, 5).map((recent, index) => {
                const engine = allEngines.find((e) => e.id === recent.engine)
                const RecentIcon = engine?.icon || Globe
                const categoryLabel = engine?.category === "ai" ? "AI" :
                  engine?.category === "image" ? "Image" : "Search"
                return (
                  <li key={index}>
                    <button
                      onClick={() => handleRecentSearch(recent)}
                      className="w-full flex items-center gap-2 px-2 py-2 sm:py-1.5 rounded hover:bg-primary/5 text-sm text-left transition-colors"
                    >
                      <RecentIcon className={`h-4 w-4 sm:h-3.5 sm:w-3.5 flex-shrink-0 ${engine?.color || ""}`} />
                      <span className="flex-1 truncate min-w-0">{recent.query}</span>
                      <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">
                        {categoryLabel}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{engine?.shortcut}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

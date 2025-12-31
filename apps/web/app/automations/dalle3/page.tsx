'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { toast } from 'sonner'
import {
  Sparkles,
  Copy,
  Trash2,
  ExternalLink,
  ChevronDown,
  History,
  X,
  Code,
} from 'lucide-react'

// Types
interface DalleConfig {
  subject: string
  style: string
  aspect: string
  mood: string
}

interface HistoryItem {
  id: string
  prompt: string
  config: DalleConfig
  timestamp: number
}

// Options
const STYLE_OPTIONS = [
  'photorealistic',
  'digital art',
  'watercolor',
  'oil painting',
  '3D render',
  'pixel art',
  'minimalist',
  'anime',
]

const ASPECT_OPTIONS = ['square', 'wide', 'portrait']

const MOOD_OPTIONS = ['bright', 'dark', 'moody', 'warm', 'cool', 'vibrant']

// Selectors for TabzChrome automation
const SELECTORS = [
  { id: 'prompt-input', description: 'Main prompt textarea for image description' },
  { id: 'style-select', description: 'Art style dropdown (photorealistic, digital art, etc.)' },
  { id: 'aspect-select', description: 'Aspect ratio dropdown (square, wide, portrait)' },
  { id: 'mood-select', description: 'Mood/lighting dropdown (bright, dark, moody, etc.)' },
  { id: 'btn-generate', description: 'Opens ChatGPT DALL-E 3 and auto-fills prompt' },
  { id: 'btn-copy-prompt', description: 'Copies composed prompt to clipboard' },
  { id: 'btn-clear', description: 'Clears all form fields' },
  { id: 'output-preview', description: 'Shows the composed prompt preview' },
  { id: 'history-list', description: 'List of recent prompt generations' },
  { id: 'btn-load-preset-avatar', description: 'Load avatar preset prompt' },
  { id: 'btn-load-preset-logo', description: 'Load logo preset prompt' },
  { id: 'btn-load-preset-scene', description: 'Load scene preset prompt' },
]

// Presets
const PRESETS = {
  avatar: {
    subject: 'A friendly robot avatar with a round head, glowing blue eyes, silver metallic body, and a warm smile',
    style: 'digital art',
    aspect: 'square',
    mood: 'bright',
  },
  logo: {
    subject: 'Minimalist logo for a tech startup, featuring a stylized terminal cursor. Modern, clean, vector style',
    style: 'minimalist',
    aspect: 'square',
    mood: 'bright',
  },
  scene: {
    subject: 'Cozy home office at night, multiple monitors showing code, warm lamp light, rain on the window, lo-fi aesthetic',
    style: 'digital art',
    aspect: 'wide',
    mood: 'warm',
  },
}

const CHATGPT_DALLE_URL = 'https://chatgpt.com/g/g-iLoR8U3iA-dall-e3'
const HISTORY_KEY = 'dalle3-history'
const MAX_HISTORY = 10

export default function Dalle3Page() {
  const [config, setConfig] = useState<DalleConfig>({
    subject: '',
    style: 'digital art',
    aspect: 'square',
    mood: 'bright',
  })
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [selectorsOpen, setSelectorsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(true)

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY)
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {
        console.error('Failed to parse history')
      }
    }
  }, [])

  // Save history to localStorage
  const saveHistory = useCallback((newHistory: HistoryItem[]) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
    setHistory(newHistory)
  }, [])

  // Compose the final prompt
  const composedPrompt = config.subject
    ? `${config.subject}. Style: ${config.style}. Aspect ratio: ${config.aspect}. Mood: ${config.mood}.`
    : ''

  // Handle generate - opens ChatGPT and adds to history
  const handleGenerate = () => {
    if (!config.subject.trim()) {
      toast.error('Please enter a subject to generate')
      return
    }

    // Add to history
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      prompt: composedPrompt,
      config: { ...config },
      timestamp: Date.now(),
    }
    const newHistory = [newItem, ...history].slice(0, MAX_HISTORY)
    saveHistory(newHistory)

    // Open ChatGPT DALL-E 3
    window.open(CHATGPT_DALLE_URL, '_blank')

    // Copy prompt to clipboard for easy paste
    navigator.clipboard.writeText(composedPrompt).then(() => {
      toast.success('Prompt copied! Paste it in ChatGPT DALL-E 3')
    })
  }

  // Handle copy prompt
  const handleCopy = () => {
    if (!composedPrompt) {
      toast.error('Nothing to copy')
      return
    }
    navigator.clipboard.writeText(composedPrompt).then(() => {
      toast.success('Prompt copied to clipboard')
    })
  }

  // Handle clear
  const handleClear = () => {
    setConfig({
      subject: '',
      style: 'digital art',
      aspect: 'square',
      mood: 'bright',
    })
    toast.info('Form cleared')
  }

  // Load preset
  const loadPreset = (preset: keyof typeof PRESETS) => {
    setConfig(PRESETS[preset])
    toast.success(`Loaded ${preset} preset`)
  }

  // Load from history
  const loadFromHistory = (item: HistoryItem) => {
    setConfig(item.config)
    toast.success('Loaded from history')
  }

  // Delete from history
  const deleteFromHistory = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id)
    saveHistory(newHistory)
    toast.info('Removed from history')
  }

  // Clear all history
  const clearHistory = () => {
    saveHistory([])
    toast.info('History cleared')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-style-gradient" aria-hidden="true" />

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            DALL-E 3 Image Generation
          </h1>
          <p className="text-muted-foreground">
            Generate images using ChatGPT&apos;s DALL-E 3. Fill in the options below,
            then click Generate to open ChatGPT with your prompt.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt Builder */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Prompt Builder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subject Input */}
                <div className="space-y-2">
                  <Label htmlFor="prompt-input">Subject</Label>
                  <Textarea
                    id="prompt-input"
                    placeholder="Describe what you want to generate... (e.g., 'A friendly robot avatar with glowing blue eyes')"
                    value={config.subject}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, subject: e.target.value }))
                    }
                    className="min-h-[100px] bg-background/50"
                  />
                </div>

                {/* Style Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Style Select */}
                  <div className="space-y-2">
                    <Label htmlFor="style-select">Style</Label>
                    <Select
                      value={config.style}
                      onValueChange={(value) =>
                        setConfig((c) => ({ ...c, style: value }))
                      }
                    >
                      <SelectTrigger id="style-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STYLE_OPTIONS.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Aspect Select */}
                  <div className="space-y-2">
                    <Label htmlFor="aspect-select">Aspect Ratio</Label>
                    <Select
                      value={config.aspect}
                      onValueChange={(value) =>
                        setConfig((c) => ({ ...c, aspect: value }))
                      }
                    >
                      <SelectTrigger id="aspect-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ASPECT_OPTIONS.map((aspect) => (
                          <SelectItem key={aspect} value={aspect}>
                            {aspect}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mood Select */}
                  <div className="space-y-2">
                    <Label htmlFor="mood-select">Mood</Label>
                    <Select
                      value={config.mood}
                      onValueChange={(value) =>
                        setConfig((c) => ({ ...c, mood: value }))
                      }
                    >
                      <SelectTrigger id="mood-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MOOD_OPTIONS.map((mood) => (
                          <SelectItem key={mood} value={mood}>
                            {mood}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <Label>Quick Presets</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      id="btn-load-preset-avatar"
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('avatar')}
                    >
                      Avatar
                    </Button>
                    <Button
                      id="btn-load-preset-logo"
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('logo')}
                    >
                      Logo
                    </Button>
                    <Button
                      id="btn-load-preset-scene"
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('scene')}
                    >
                      Scene
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  id="output-preview"
                  className="p-4 rounded-lg bg-background/50 border border-border min-h-[80px]"
                >
                  {composedPrompt ? (
                    <p className="text-foreground">{composedPrompt}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Enter a subject to see the composed prompt...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                id="btn-generate"
                size="lg"
                onClick={handleGenerate}
                disabled={!config.subject.trim()}
                className="flex-1 sm:flex-none"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Generate in ChatGPT
              </Button>
              <Button
                id="btn-copy-prompt"
                variant="secondary"
                size="lg"
                onClick={handleCopy}
                disabled={!composedPrompt}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Prompt
              </Button>
              <Button
                id="btn-clear"
                variant="outline"
                size="lg"
                onClick={handleClear}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
              <Card className="glass">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/20 transition-colors rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        Recent ({history.length})
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          historyOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div
                      id="history-list"
                      className="space-y-2 max-h-[400px] overflow-y-auto"
                    >
                      {history.length === 0 ? (
                        <p className="text-muted-foreground text-sm text-center py-4">
                          No history yet. Generate some prompts!
                        </p>
                      ) : (
                        <>
                          {history.map((item) => (
                            <div
                              key={item.id}
                              className="group p-3 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors cursor-pointer"
                              onClick={() => loadFromHistory(item)}
                            >
                              <p className="text-sm text-foreground line-clamp-2 mb-1">
                                {item.config.subject}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(item.timestamp).toLocaleDateString()}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteFromHistory(item.id)
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-muted-foreground"
                            onClick={clearHistory}
                          >
                            Clear History
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        </div>

        {/* Selectors Panel */}
        <div className="mt-8">
          <Collapsible open={selectorsOpen} onOpenChange={setSelectorsOpen}>
            <Card className="glass-dark border-dashed">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/20 transition-colors rounded-t-lg">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-secondary" />
                      TabzChrome Selectors
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        selectorsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">
                    Use these selectors with TabzChrome MCP tools for automation:
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {SELECTORS.map((selector) => (
                      <div
                        key={selector.id}
                        className="flex items-start gap-2 p-2 rounded bg-background/30"
                      >
                        <code className="text-xs text-primary font-mono whitespace-nowrap">
                          #{selector.id}
                        </code>
                        <span className="text-xs text-muted-foreground">
                          {selector.description}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded bg-background/50 border border-border">
                    <p className="text-xs font-medium text-foreground mb-2">
                      Example workflow:
                    </p>
                    <pre className="text-xs text-muted-foreground overflow-x-auto">
{`# Fill prompt
mcp-cli call tabz/tabz_fill '{"selector": "#prompt-input", "value": "robot avatar"}'

# Select style
mcp-cli call tabz/tabz_click '{"selector": "#style-select"}'

# Generate
mcp-cli call tabz/tabz_click '{"selector": "#btn-generate"}'`}
                    </pre>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      </main>
    </div>
  )
}

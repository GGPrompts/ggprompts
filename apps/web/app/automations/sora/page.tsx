'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Video,
  Copy,
  ExternalLink,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  MonitorPlay,
  Palette,
  Trash2,
  Code2,
} from 'lucide-react'
import { Button, Card, Badge } from '@ggprompts/ui'

// Duration options
const DURATION_OPTIONS = [
  { value: '5s', label: '5 seconds', description: 'Quick clip' },
  { value: '10s', label: '10 seconds', description: 'Standard (default)' },
  { value: '20s', label: '20 seconds', description: 'Extended scene' },
]

// Aspect ratio options
const ASPECT_OPTIONS = [
  { value: '16:9', label: '16:9', description: 'Landscape (YouTube, desktop)' },
  { value: '9:16', label: '9:16', description: 'Portrait (TikTok, Reels)' },
  { value: '1:1', label: '1:1', description: 'Square (Instagram)' },
]

// Style options
const STYLE_OPTIONS = [
  { value: 'cinematic', label: 'Cinematic', description: 'Film-like, dramatic lighting' },
  { value: 'animation', label: 'Animation', description: 'Animated, cartoon-style' },
  { value: 'realistic', label: 'Realistic', description: 'Photo-realistic rendering' },
  { value: 'artistic', label: 'Artistic', description: 'Stylized, creative interpretation' },
  { value: 'anime', label: 'Anime', description: 'Japanese animation style' },
  { value: 'documentary', label: 'Documentary', description: 'Natural, observational' },
]

// Selectors for TabzChrome automation
const SELECTORS = [
  { id: 'video-prompt', description: 'Main prompt textarea for video description' },
  { id: 'duration-select', description: 'Select duration (5s, 10s, 20s)' },
  { id: 'aspect-select', description: 'Select aspect ratio (16:9, 9:16, 1:1)' },
  { id: 'style-select', description: 'Select style (cinematic, animation, etc.)' },
  { id: 'btn-generate', description: 'Open Sora with prompt' },
  { id: 'btn-copy', description: 'Copy prompt to clipboard' },
  { id: 'history-list', description: 'Container for recent prompts' },
  { id: 'preview-panel', description: 'Shows composed/preview prompt' },
]

// Example prompts for inspiration
const EXAMPLE_PROMPTS = [
  {
    title: 'Developer Scene',
    prompt: 'A developer working late at night, their screen glowing in a dark room. They open a Chrome browser sidebar revealing multiple terminal windows. Cozy lo-fi aesthetic, soft desk lamp light, rain on window.',
    style: 'cinematic',
  },
  {
    title: 'Product Demo',
    prompt: 'Smooth screen recording style video showing a browser extension sidebar opening from the right side of Chrome. Multiple terminal tabs appear with colorful text. Modern, clean UI, professional product demo aesthetic.',
    style: 'realistic',
  },
  {
    title: 'Cyberpunk Abstract',
    prompt: 'Digital streams of code flowing through a neon-lit cyberpunk cityscape. Binary rain falls past glowing terminal windows floating in space. Camera slowly pushes through layers of holographic UI elements. Blade Runner meets Matrix aesthetic.',
    style: 'artistic',
  },
]

interface HistoryItem {
  id: string
  prompt: string
  duration: string
  aspect: string
  style: string
  timestamp: Date
}

export default function SoraAutomationPage() {
  const [videoPrompt, setVideoPrompt] = useState('')
  const [duration, setDuration] = useState('10s')
  const [aspect, setAspect] = useState('16:9')
  const [style, setStyle] = useState('cinematic')
  const [copied, setCopied] = useState(false)
  const [selectorsOpen, setSelectorsOpen] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])

  // Build the full prompt with style
  const buildFullPrompt = useCallback(() => {
    if (!videoPrompt.trim()) return ''
    const styleLabel = STYLE_OPTIONS.find(s => s.value === style)?.label || style
    return `${videoPrompt.trim()} Style: ${styleLabel}.`
  }, [videoPrompt, style])

  // Copy prompt to clipboard
  const handleCopy = async () => {
    const fullPrompt = buildFullPrompt()
    if (!fullPrompt) return
    await navigator.clipboard.writeText(fullPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Open Sora in browser
  const handleGenerate = () => {
    // Add to history
    if (videoPrompt.trim()) {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        prompt: videoPrompt.trim(),
        duration,
        aspect,
        style,
        timestamp: new Date(),
      }
      setHistory(prev => [newItem, ...prev].slice(0, 10)) // Keep last 10
    }

    // Open Sora drafts page
    window.open('https://sora.chatgpt.com/drafts', '_blank')
  }

  // Load example prompt
  const loadExample = (example: typeof EXAMPLE_PROMPTS[0]) => {
    setVideoPrompt(example.prompt)
    setStyle(example.style)
  }

  // Load from history
  const loadFromHistory = (item: HistoryItem) => {
    setVideoPrompt(item.prompt)
    setDuration(item.duration)
    setAspect(item.aspect)
    setStyle(item.style)
  }

  // Remove from history
  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/automations"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Automations
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500">
              <Video className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Sora AI Video</h1>
            <Badge variant="secondary">Automation</Badge>
          </div>

          <p className="text-muted-foreground">
            Generate AI videos using OpenAI Sora. Compose video prompts, configure duration and style, then open Sora to generate.
          </p>
        </div>

        {/* Prompt Input Section */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Video Prompt
          </h2>

          <div className="mb-4">
            <label htmlFor="video-prompt" className="block text-sm font-medium mb-2">
              Describe Your Video
            </label>
            <textarea
              id="video-prompt"
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              placeholder="e.g., A developer working late at night, their screen glowing in a dark room. Camera slowly zooms in on the colorful terminal output. Cozy lo-fi aesthetic, soft desk lamp light, rain on window..."
              rows={5}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Tip: Include camera movements, lighting, and atmosphere for best results.
            </p>
          </div>

          {/* Example prompts */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Try:</span>
            {EXAMPLE_PROMPTS.map((example, i) => (
              <button
                key={i}
                onClick={() => loadExample(example)}
                className="text-sm px-2 py-1 rounded-md bg-muted/50 hover:bg-muted text-foreground transition-colors"
              >
                {example.title}
              </button>
            ))}
          </div>
        </Card>

        {/* Configuration Options */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MonitorPlay className="h-5 w-5 text-primary" />
            Video Configuration
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Duration Select */}
            <div>
              <label htmlFor="duration-select" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Duration
              </label>
              <select
                id="duration-select"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              >
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {DURATION_OPTIONS.find(d => d.value === duration)?.description}
              </p>
            </div>

            {/* Aspect Ratio Select */}
            <div>
              <label htmlFor="aspect-select" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MonitorPlay className="h-4 w-4 text-muted-foreground" />
                Aspect Ratio
              </label>
              <select
                id="aspect-select"
                value={aspect}
                onChange={(e) => setAspect(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              >
                {ASPECT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {ASPECT_OPTIONS.find(a => a.value === aspect)?.description}
              </p>
            </div>

            {/* Style Select */}
            <div>
              <label htmlFor="style-select" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                Style
              </label>
              <select
                id="style-select"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              >
                {STYLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {STYLE_OPTIONS.find(s => s.value === style)?.description}
              </p>
            </div>
          </div>
        </Card>

        {/* Preview Panel */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>

          <div
            id="preview-panel"
            className="p-4 rounded-lg bg-muted/30 border border-border/50 min-h-[100px]"
          >
            {buildFullPrompt() ? (
              <div className="space-y-3">
                <p className="text-foreground">{buildFullPrompt()}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{duration}</Badge>
                  <Badge variant="outline">{aspect}</Badge>
                  <Badge variant="outline">{STYLE_OPTIONS.find(s => s.value === style)?.label}</Badge>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Enter a video description above to see the preview...
              </p>
            )}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            id="btn-generate"
            onClick={handleGenerate}
            size="lg"
            className="flex-1 sm:flex-none"
            disabled={!videoPrompt.trim()}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Sora
          </Button>

          <Button
            id="btn-copy"
            variant="outline"
            size="lg"
            onClick={handleCopy}
            className="flex-1 sm:flex-none"
            disabled={!videoPrompt.trim()}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Prompt
              </>
            )}
          </Button>
        </div>

        {/* History Section */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Prompts
          </h2>

          <div id="history-list" className="space-y-2">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No recent prompts. Generated prompts will appear here.
              </p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.prompt}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">{item.duration}</Badge>
                      <Badge variant="outline" className="text-xs">{item.aspect}</Badge>
                      <Badge variant="outline" className="text-xs">{item.style}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadFromHistory(item)}
                      className="h-8 px-2"
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromHistory(item.id)}
                      className="h-8 px-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Tips Card */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Sora Tips</h2>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/30 rounded-lg p-3">
              <h3 className="font-medium mb-2">Camera Movements</h3>
              <p className="text-muted-foreground">
                &quot;Camera slowly zooms&quot;, &quot;tracking shot&quot;, &quot;panning left&quot;, &quot;aerial view descending&quot;
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-3">
              <h3 className="font-medium mb-2">Lighting</h3>
              <p className="text-muted-foreground">
                &quot;Soft desk lamp light&quot;, &quot;neon glow&quot;, &quot;golden hour&quot;, &quot;dramatic shadows&quot;
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-3">
              <h3 className="font-medium mb-2">Atmosphere</h3>
              <p className="text-muted-foreground">
                &quot;Rain on window&quot;, &quot;dust particles in light&quot;, &quot;lens flare&quot;, &quot;fog&quot;
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-3">
              <h3 className="font-medium mb-2">References</h3>
              <p className="text-muted-foreground">
                &quot;Lo-fi aesthetic&quot;, &quot;Blade Runner style&quot;, &quot;product demo&quot;, &quot;documentary feel&quot;
              </p>
            </div>
          </div>
        </Card>

        {/* Selectors Panel */}
        <Card className="glass border-border/50 rounded-xl overflow-hidden">
          <button
            onClick={() => setSelectorsOpen(!selectorsOpen)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              TabzChrome Selectors
            </h2>
            {selectorsOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {selectorsOpen && (
            <div className="px-6 pb-6">
              <p className="text-sm text-muted-foreground mb-4">
                All interactive elements on this page can be automated via TabzChrome MCP tools.
              </p>
              <div className="grid gap-2">
                {SELECTORS.map((selector) => (
                  <div
                    key={selector.id}
                    className="flex items-start gap-3 py-2 px-3 rounded-lg bg-muted/30"
                  >
                    <code className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-mono shrink-0">
                      #{selector.id}
                    </code>
                    <span className="text-sm text-muted-foreground">{selector.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  GitBranch,
  Copy,
  Download,
  ExternalLink,
  Check,
  ChevronDown,
  ChevronUp,
  Workflow,
  MessageSquare,
  Code2,
  Sparkles,
} from 'lucide-react'
import { Button, Card, Badge } from '@ggprompts/ui'

// Diagram types
const DIAGRAM_TYPES = [
  { value: 'flowchart', label: 'Flowchart', description: 'Processes, decisions, workflows' },
  { value: 'sequence', label: 'Sequence Diagram', description: 'API calls, interactions over time' },
  { value: 'architecture', label: 'Architecture', description: 'System components, infrastructure' },
  { value: 'erd', label: 'ERD', description: 'Database schemas, data models' },
  { value: 'mindmap', label: 'Mindmap', description: 'Brainstorming, concept relationships' },
]

// Style levels
const DIAGRAM_STYLES = [
  { value: 'simple', label: 'Simple', description: 'Basic overview' },
  { value: 'detailed', label: 'Detailed', description: 'Standard complexity' },
  { value: 'technical', label: 'Technical', description: 'Full technical detail' },
]

// Selectors for TabzChrome automation
const SELECTORS = [
  { id: 'diagram-type', description: 'Select diagram type (flowchart, sequence, architecture, etc.)' },
  { id: 'diagram-subject', description: 'Textarea for diagram description/subject' },
  { id: 'diagram-style', description: 'Select detail level (simple, detailed, technical)' },
  { id: 'btn-chatgpt-method', description: 'Button to use Diagrams GPT in ChatGPT' },
  { id: 'btn-mermaid-method', description: 'Button to use Mermaid Live Editor (faster)' },
  { id: 'mermaid-output', description: 'Textarea for Mermaid code input/output' },
  { id: 'mermaid-preview', description: 'Live preview container for Mermaid diagram' },
  { id: 'btn-copy-mermaid', description: 'Copy Mermaid code to clipboard' },
  { id: 'btn-download-png', description: 'Download diagram as PNG' },
  { id: 'btn-open-mermaid-live', description: 'Open current code in Mermaid Live' },
]

// Default Mermaid example
const DEFAULT_MERMAID = `flowchart TB
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`

export default function DiagramsAutomationPage() {
  const [diagramType, setDiagramType] = useState('flowchart')
  const [diagramSubject, setDiagramSubject] = useState('')
  const [diagramStyle, setDiagramStyle] = useState('detailed')
  const [mermaidCode, setMermaidCode] = useState(DEFAULT_MERMAID)
  const [activeMethod, setActiveMethod] = useState<'chatgpt' | 'mermaid'>('mermaid')
  const [copied, setCopied] = useState(false)
  const [selectorsOpen, setSelectorsOpen] = useState(false)
  const [mermaidLoaded, setMermaidLoaded] = useState(false)

  // Load Mermaid.js dynamically
  useEffect(() => {
    const loadMermaid = async () => {
      if (typeof window !== 'undefined' && !window.mermaid) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js'
        script.async = true
        script.onload = () => {
          window.mermaid?.initialize({
            startOnLoad: false,
            theme: 'dark',
            themeVariables: {
              primaryColor: '#ffc857',
              primaryTextColor: '#fff',
              primaryBorderColor: '#ffc857',
              lineColor: '#888',
              secondaryColor: '#333',
              tertiaryColor: '#444',
            },
          })
          setMermaidLoaded(true)
        }
        document.head.appendChild(script)
      } else if (window.mermaid) {
        setMermaidLoaded(true)
      }
    }
    loadMermaid()
  }, [])

  // Render Mermaid diagram
  const renderMermaid = useCallback(async () => {
    if (!mermaidLoaded || !window.mermaid) return

    const previewElement = document.getElementById('mermaid-preview')
    if (!previewElement) return

    try {
      previewElement.innerHTML = ''
      const id = `mermaid-${Date.now()}`
      const { svg } = await window.mermaid.render(id, mermaidCode)
      previewElement.innerHTML = svg
    } catch {
      previewElement.innerHTML = `<div class="text-destructive text-sm p-4">Invalid Mermaid syntax. Check your code.</div>`
    }
  }, [mermaidCode, mermaidLoaded])

  // Re-render when code changes
  useEffect(() => {
    if (mermaidLoaded && activeMethod === 'mermaid') {
      const timeout = setTimeout(renderMermaid, 300)
      return () => clearTimeout(timeout)
    }
  }, [mermaidCode, mermaidLoaded, activeMethod, renderMermaid])

  // Copy to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(mermaidCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Download as PNG
  const handleDownload = async () => {
    const previewElement = document.getElementById('mermaid-preview')
    const svg = previewElement?.querySelector('svg')
    if (!svg) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width * 2
      canvas.height = img.height * 2
      ctx.scale(2, 2)
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)

      const link = document.createElement('a')
      link.download = `diagram-${diagramType}-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  // Open ChatGPT Diagrams GPT
  const handleOpenChatGPT = () => {
    window.open('https://chatgpt.com/g/g-5QhhdsfDj-diagrams-show-me', '_blank')
  }

  // Open Mermaid Live with code
  const handleOpenMermaidLive = () => {
    const encoded = btoa(mermaidCode)
    window.open(`https://mermaid.live/edit#base64:${encoded}`, '_blank')
  }

  // Build prompt for ChatGPT
  const buildPrompt = () => {
    return `Create a ${diagramType}${diagramStyle !== 'detailed' ? ` (${diagramStyle})` : ''} showing: ${diagramSubject || '[describe what you want to diagram]'}`
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
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
              <GitBranch className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Diagrams</h1>
            <Badge variant="secondary">Automation</Badge>
          </div>

          <p className="text-muted-foreground">
            Create architecture diagrams, flowcharts, and ERDs via Diagrams GPT or direct Mermaid code.
          </p>
        </div>

        {/* Configuration Section */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" />
            Diagram Configuration
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* Diagram Type Select */}
            <div>
              <label htmlFor="diagram-type" className="block text-sm font-medium mb-2">
                Diagram Type
              </label>
              <select
                id="diagram-type"
                value={diagramType}
                onChange={(e) => setDiagramType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              >
                {DIAGRAM_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {DIAGRAM_TYPES.find((t) => t.value === diagramType)?.description}
              </p>
            </div>

            {/* Style Select */}
            <div>
              <label htmlFor="diagram-style" className="block text-sm font-medium mb-2">
                Detail Level
              </label>
              <select
                id="diagram-style"
                value={diagramStyle}
                onChange={(e) => setDiagramStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              >
                {DIAGRAM_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {DIAGRAM_STYLES.find((s) => s.value === diagramStyle)?.description}
              </p>
            </div>

            {/* Prompt Preview */}
            <div>
              <label className="block text-sm font-medium mb-2">Generated Prompt</label>
              <div className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground min-h-[40px]">
                {buildPrompt()}
              </div>
            </div>
          </div>

          {/* Subject Textarea */}
          <div>
            <label htmlFor="diagram-subject" className="block text-sm font-medium mb-2">
              What to Diagram
            </label>
            <textarea
              id="diagram-subject"
              value={diagramSubject}
              onChange={(e) => setDiagramSubject(e.target.value)}
              placeholder="e.g., User authentication flow with OAuth, Database schema for a task management app, System architecture for a Chrome extension..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
            />
          </div>
        </Card>

        {/* Method Selection */}
        <div className="flex gap-2 mb-4">
          <Button
            id="btn-chatgpt-method"
            variant={activeMethod === 'chatgpt' ? 'default' : 'outline'}
            onClick={() => setActiveMethod('chatgpt')}
            className="flex-1"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            ChatGPT Diagrams GPT
          </Button>
          <Button
            id="btn-mermaid-method"
            variant={activeMethod === 'mermaid' ? 'default' : 'outline'}
            onClick={() => setActiveMethod('mermaid')}
            className="flex-1"
          >
            <Code2 className="h-4 w-4 mr-2" />
            Direct Mermaid
          </Button>
        </div>

        {/* Method Content */}
        {activeMethod === 'chatgpt' ? (
          <Card className="glass border-border/50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              ChatGPT Diagrams GPT
            </h2>

            <p className="text-muted-foreground mb-4">
              Use the Diagrams GPT to create professional diagrams with AI assistance.
              Fill in the configuration above, then click the button to open ChatGPT.
            </p>

            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium mb-2">Workflow Steps:</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Configure diagram type and describe what you want</li>
                <li>Click &quot;Open Diagrams GPT&quot; below</li>
                <li>Paste your description into ChatGPT</li>
                <li>Allow the plugin when prompted</li>
                <li>View and download your diagram</li>
              </ol>
            </div>

            <Button onClick={handleOpenChatGPT} className="w-full" size="lg">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Diagrams GPT
            </Button>
          </Card>
        ) : (
          <Card className="glass border-border/50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              Mermaid Editor
            </h2>

            <div className="grid lg:grid-cols-2 gap-4">
              {/* Code Editor */}
              <div>
                <label htmlFor="mermaid-output" className="block text-sm font-medium mb-2">
                  Mermaid Code
                </label>
                <textarea
                  id="mermaid-output"
                  value={mermaidCode}
                  onChange={(e) => setMermaidCode(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-mono text-sm resize-none"
                  spellCheck={false}
                />
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium mb-2">Live Preview</label>
                <div
                  id="mermaid-preview"
                  className="w-full min-h-[280px] px-3 py-2 rounded-lg bg-muted/30 border border-border flex items-center justify-center overflow-auto"
                >
                  {!mermaidLoaded && (
                    <span className="text-muted-foreground text-sm">Loading Mermaid...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                id="btn-copy-mermaid"
                variant="outline"
                onClick={handleCopy}
                className="flex-1 sm:flex-none"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>

              <Button
                id="btn-download-png"
                variant="outline"
                onClick={handleDownload}
                className="flex-1 sm:flex-none"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>

              <Button
                id="btn-open-mermaid-live"
                variant="outline"
                onClick={handleOpenMermaidLive}
                className="flex-1 sm:flex-none"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Mermaid Live
              </Button>
            </div>
          </Card>
        )}

        {/* Mermaid Quick Reference */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Mermaid Quick Reference</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-muted/30 rounded-lg p-3">
              <h3 className="font-medium mb-2">Flowchart</h3>
              <pre className="text-xs text-muted-foreground overflow-x-auto">
{`flowchart TB
    A[Start] --> B{Decision}
    B -->|Yes| C[Do this]
    B -->|No| D[Do that]`}
              </pre>
            </div>

            <div className="bg-muted/30 rounded-lg p-3">
              <h3 className="font-medium mb-2">Sequence</h3>
              <pre className="text-xs text-muted-foreground overflow-x-auto">
{`sequenceDiagram
    Client->>Server: Request
    Server-->>Client: Response`}
              </pre>
            </div>

            <div className="bg-muted/30 rounded-lg p-3">
              <h3 className="font-medium mb-2">Architecture (Subgraphs)</h3>
              <pre className="text-xs text-muted-foreground overflow-x-auto">
{`flowchart TB
    subgraph Frontend
        UI[React App]
    end
    subgraph Backend
        API[Server]
    end
    UI --> API`}
              </pre>
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

// Extend window type for Mermaid
declare global {
  interface Window {
    mermaid?: {
      initialize: (config: Record<string, unknown>) => void
      render: (id: string, code: string) => Promise<{ svg: string }>
    }
  }
}

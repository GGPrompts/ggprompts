'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Palette,
  Copy,
  ExternalLink,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Sparkles,
  Instagram,
  Presentation,
  Image,
  FileText,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Design types for Canva
const DESIGN_TYPES = [
  { value: 'social-post', label: 'Social Media Post', icon: Instagram, dimensions: '1080x1080' },
  { value: 'presentation', label: 'Presentation', icon: Presentation, dimensions: '1920x1080' },
  { value: 'logo', label: 'Logo', icon: Image, dimensions: '500x500' },
  { value: 'poster', label: 'Poster', icon: FileText, dimensions: '1080x1920' },
  { value: 'flyer', label: 'Flyer', icon: Share2, dimensions: '1080x1920' },
]

// Style options
const DESIGN_STYLES = [
  { value: 'modern', label: 'Modern', description: 'Clean lines, minimal' },
  { value: 'minimalist', label: 'Minimalist', description: 'Simple and elegant' },
  { value: 'bold', label: 'Bold', description: 'Strong colors, impact' },
  { value: 'elegant', label: 'Elegant', description: 'Sophisticated, refined' },
  { value: 'playful', label: 'Playful', description: 'Fun, colorful' },
  { value: 'professional', label: 'Professional', description: 'Business-ready' },
]

// Template suggestions
const TEMPLATES = [
  { id: 'template-instagram', label: 'Instagram Post', type: 'social-post', description: 'Square format, social-ready' },
  { id: 'template-pitch-deck', label: 'Pitch Deck', type: 'presentation', description: 'Investor-ready slides' },
  { id: 'template-brand-logo', label: 'Brand Logo', type: 'logo', description: 'Professional branding' },
  { id: 'template-event-poster', label: 'Event Poster', type: 'poster', description: 'Eye-catching promotion' },
]

// Color presets
const COLOR_PRESETS = [
  { value: '#ffc857', label: 'Amber' },
  { value: '#10b981', label: 'Emerald' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ef4444', label: 'Red' },
  { value: '#f97316', label: 'Orange' },
]

// Selectors for TabzChrome automation
const SELECTORS = [
  { id: 'design-type', description: 'Select design type (social-post, presentation, logo, poster, flyer)' },
  { id: 'design-prompt', description: 'Textarea for design description' },
  { id: 'design-style', description: 'Select design style (modern, minimalist, bold, etc.)' },
  { id: 'design-dimensions', description: 'Input for custom dimensions (e.g., 1080x1080)' },
  { id: 'brand-colors', description: 'Color picker for brand/primary color' },
  { id: 'templates-grid', description: 'Grid of suggested template buttons' },
  { id: 'btn-open-canva', description: 'Open Canva GPT in ChatGPT' },
  { id: 'btn-copy', description: 'Copy generated prompt to clipboard' },
  { id: 'prompt-preview', description: 'Preview of the generated prompt' },
]

export default function CanvaAutomationPage() {
  const [designType, setDesignType] = useState('social-post')
  const [designPrompt, setDesignPrompt] = useState('')
  const [designStyle, setDesignStyle] = useState('modern')
  const [dimensions, setDimensions] = useState('1080x1080')
  const [brandColor, setBrandColor] = useState('#ffc857')
  const [copied, setCopied] = useState(false)
  const [selectorsOpen, setSelectorsOpen] = useState(false)

  // Update dimensions when design type changes
  const handleTypeChange = (value: string) => {
    setDesignType(value)
    const typeConfig = DESIGN_TYPES.find(t => t.value === value)
    if (typeConfig) {
      setDimensions(typeConfig.dimensions)
    }
  }

  // Select a template
  const handleTemplateSelect = (template: typeof TEMPLATES[0]) => {
    setDesignType(template.type)
    const typeConfig = DESIGN_TYPES.find(t => t.value === template.type)
    if (typeConfig) {
      setDimensions(typeConfig.dimensions)
    }
  }

  // Build the prompt for Canva GPT
  const buildPrompt = () => {
    const typeLabel = DESIGN_TYPES.find(t => t.value === designType)?.label || 'design'
    const styleLabel = DESIGN_STYLES.find(s => s.value === designStyle)?.label || 'modern'

    let prompt = `Create a ${typeLabel.toLowerCase()}`

    if (designPrompt) {
      prompt += ` for ${designPrompt}`
    }

    prompt += `. Style: ${styleLabel.toLowerCase()}.`
    prompt += ` Dimensions: ${dimensions}.`
    prompt += ` Primary color: ${brandColor}.`

    return prompt
  }

  // Copy prompt to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildPrompt())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Open Canva GPT
  const handleOpenCanva = () => {
    const url = 'https://chatgpt.com/g/g-alKfVrz9K-canva'
    window.open(url, '_blank')
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
            <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Canva</h1>
            <Badge variant="secondary">Automation</Badge>
          </div>

          <p className="text-muted-foreground">
            Create professional designs via Canva GPT. Select design type, describe what you want, and open Canva with context.
          </p>
        </div>

        {/* Design Type Selection */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Design Type
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {DESIGN_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.value}
                  id={`design-type-${type.value}`}
                  onClick={() => handleTypeChange(type.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border transition-all',
                    designType === type.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium text-center">{type.label}</span>
                </button>
              )
            })}
          </div>

          {/* Hidden select for automation */}
          <select
            id="design-type"
            value={designType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="sr-only"
            aria-label="Design type"
          >
            {DESIGN_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </Card>

        {/* Description */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Description</h2>

          <div>
            <label htmlFor="design-prompt" className="block text-sm font-medium mb-2">
              What do you want to create?
            </label>
            <textarea
              id="design-prompt"
              value={designPrompt}
              onChange={(e) => setDesignPrompt(e.target.value)}
              placeholder="e.g., my tech startup launch announcement, a summer sale promotion, company anniversary celebration..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
            />
          </div>
        </Card>

        {/* Customization */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Customization</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Style Select */}
            <div>
              <label htmlFor="design-style" className="block text-sm font-medium mb-2">
                Style
              </label>
              <select
                id="design-style"
                value={designStyle}
                onChange={(e) => setDesignStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              >
                {DESIGN_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {DESIGN_STYLES.find((s) => s.value === designStyle)?.description}
              </p>
            </div>

            {/* Dimensions Input */}
            <div>
              <label htmlFor="design-dimensions" className="block text-sm font-medium mb-2">
                Dimensions
              </label>
              <input
                id="design-dimensions"
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="1080x1080"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-1">Width x Height in pixels</p>
            </div>

            {/* Color Picker */}
            <div>
              <label htmlFor="brand-colors" className="block text-sm font-medium mb-2">
                Primary Color
              </label>
              <div className="flex gap-2">
                <input
                  id="brand-colors"
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                />
                <div className="flex gap-1 flex-wrap flex-1">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBrandColor(color.value)}
                      title={color.label}
                      className={cn(
                        'w-8 h-8 rounded-md border-2 transition-all',
                        brandColor === color.value
                          ? 'border-foreground scale-110'
                          : 'border-transparent hover:scale-105'
                      )}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Templates */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Quick Templates</h2>

          <div id="templates-grid" className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                id={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="flex flex-col items-start p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all text-left"
              >
                <span className="font-medium text-sm">{template.label}</span>
                <span className="text-xs text-muted-foreground">{template.description}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Prompt Preview & Actions */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Generated Prompt</h2>

          <div
            id="prompt-preview"
            className="px-4 py-3 rounded-lg bg-muted/30 border border-border/50 mb-4"
          >
            <p className="text-sm">{buildPrompt()}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              id="btn-open-canva"
              onClick={handleOpenCanva}
              size="lg"
              className="flex-1 sm:flex-none"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Canva GPT
            </Button>

            <Button
              id="btn-copy"
              variant="outline"
              onClick={handleCopy}
              size="lg"
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
                  Copy Prompt
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Workflow Instructions */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Workflow</h2>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 font-bold">
                1
              </div>
              <h3 className="font-medium mb-1">Configure</h3>
              <p className="text-sm text-muted-foreground">
                Select design type, style, and describe your vision
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 font-bold">
                2
              </div>
              <h3 className="font-medium mb-1">Open Canva</h3>
              <p className="text-sm text-muted-foreground">
                Click the button to open Canva GPT
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 font-bold">
                3
              </div>
              <h3 className="font-medium mb-1">Paste & Generate</h3>
              <p className="text-sm text-muted-foreground">
                Paste the prompt and let Canva create your design
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 font-bold">
                4
              </div>
              <h3 className="font-medium mb-1">Download</h3>
              <p className="text-sm text-muted-foreground">
                Edit in Canva and download your final design
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

'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import {
  FileText,
  Upload,
  Play,
  Copy,
  Send,
  Terminal,
  ChevronDown,
  ChevronUp,
  Check,
  Zap,
  Eye,
  Settings,
  List,
  Rocket
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

// Sample prompty files (in production, these would come from an API or file system)
const SAMPLE_PROMPTY_FILES = [
  {
    id: 'dalle3',
    name: 'DALL-E 3 Image Generation',
    path: 'images/dalle3.prompty',
    content: `---
name: DALL-E 3 Image Generation
description: Generate images using ChatGPT DALL-E 3
tags: [imagegen, dalle, chatgpt]
---

Generate a {{subject:A mystical forest}} in {{style:photorealistic|digital art|watercolor|oil painting}} style.

Additional details: {{details}}

Aspect ratio: {{aspect:square|wide|portrait}}`,
  },
  {
    id: 'diagrams',
    name: 'Diagram Generator',
    path: 'diagrams/diagrams.prompty',
    content: `---
name: Diagram Generator
description: Create diagrams using Mermaid or Diagrams GPT
tags: [diagrams, mermaid, flowchart]
---

Create a {{type:flowchart|sequence|architecture|ERD}} diagram for:

{{subject}}

Style: {{style:simple|detailed|technical}}
Include: {{include:labels|descriptions|both}}`,
  },
  {
    id: 'research',
    name: 'Research Query',
    path: 'research/consensus.prompty',
    content: `---
name: Research Query
description: Multi-source research aggregation
tags: [research, search, aggregation]
---

Research topic: {{topic}}

Sources to search:
- {{source1:Web|GitHub|Academic}}
- {{source2:Web|GitHub|Academic}}

Depth: {{depth:quick|standard|comprehensive}}
Output format: {{format:summary|detailed|bullet points}}`,
  },
  {
    id: 'sora',
    name: 'Sora Video Generation',
    path: 'video/sora.prompty',
    content: `---
name: Sora Video Generation
description: Generate videos using Sora
tags: [video, sora, ai]
---

Create a {{duration:5|10|15|20}} second video of:

{{prompt}}

Style: {{style:cinematic|documentary|animated|abstract}}
Camera: {{camera:static|pan|zoom|tracking}}`,
  },
]

// Parse prompty frontmatter and content
interface PromptyVariable {
  name: string
  defaultValue: string
  options: string[] | null
  type: 'text' | 'select' | 'number' | 'textarea'
}

interface ParsedPrompty {
  name: string
  description: string
  tags: string[]
  content: string
  variables: PromptyVariable[]
  workflowSteps: string[]
}

function parsePrompty(raw: string): ParsedPrompty {
  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

  let name = 'Untitled'
  let description = ''
  let tags: string[] = []
  let content = raw

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1]
    content = frontmatterMatch[2].trim()

    // Parse frontmatter
    const nameMatch = frontmatter.match(/name:\s*(.+)/)
    const descMatch = frontmatter.match(/description:\s*(.+)/)
    const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/)

    if (nameMatch) name = nameMatch[1].trim()
    if (descMatch) description = descMatch[1].trim()
    if (tagsMatch) {
      tags = tagsMatch[1].split(',').map(t => t.trim())
    }
  }

  // Extract variables from content
  const variables: PromptyVariable[] = []
  const varRegex = /\{\{(\w+)(?::([^}]+))?\}\}/g
  let match
  const seenVars = new Set<string>()

  while ((match = varRegex.exec(content)) !== null) {
    const varName = match[1]
    if (seenVars.has(varName)) continue
    seenVars.add(varName)

    const varConfig = match[2] || ''

    // Check if it's a dropdown (has | separator)
    if (varConfig.includes('|')) {
      const options = varConfig.split('|').map(o => o.trim())
      variables.push({
        name: varName,
        defaultValue: options[0],
        options,
        type: 'select',
      })
    } else if (varConfig === 'number') {
      variables.push({
        name: varName,
        defaultValue: '',
        options: null,
        type: 'number',
      })
    } else if (varName.toLowerCase().includes('prompt') || varName.toLowerCase().includes('subject') || varName.toLowerCase().includes('details')) {
      variables.push({
        name: varName,
        defaultValue: varConfig,
        options: null,
        type: 'textarea',
      })
    } else {
      variables.push({
        name: varName,
        defaultValue: varConfig,
        options: null,
        type: 'text',
      })
    }
  }

  // Extract workflow steps (mcp-cli commands)
  const workflowSteps: string[] = []
  const mcpRegex = /mcp-cli\s+call\s+[^\n]+/g
  let mcpMatch
  while ((mcpMatch = mcpRegex.exec(content)) !== null) {
    workflowSteps.push(mcpMatch[0])
  }

  return { name, description, tags, content, variables, workflowSteps }
}

function substituteVariables(content: string, values: Record<string, string>): string {
  let result = content
  for (const [key, value] of Object.entries(values)) {
    const regex = new RegExp(`\\{\\{${key}(?::[^}]+)?\\}\\}`, 'g')
    result = result.replace(regex, value || `{{${key}}}`)
  }
  return result
}

// Selectors Panel Component (inline as per requirements)
interface Selector {
  id: string
  description: string
}

function SelectorsPanel({ selectors }: { selectors: Selector[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div id="selectors-panel" className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="glass border-border/50">
          <CollapsibleTrigger asChild>
            <Button
              id="btn-toggle-selectors"
              variant="ghost"
              className="w-full flex items-center justify-between p-3"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <Settings className="h-4 w-4" />
                TabzChrome Selectors
              </span>
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-3 pt-0 space-y-1 max-h-64 overflow-y-auto">
              {selectors.map((selector) => (
                <div
                  key={selector.id}
                  className="flex items-start gap-2 text-xs py-1 border-b border-border/30 last:border-0"
                >
                  <code className="text-primary font-mono shrink-0">
                    #{selector.id}
                  </code>
                  <span className="text-muted-foreground">
                    {selector.description}
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  )
}

export default function PromptLauncherPage() {
  const [selectedPrompty, setSelectedPrompty] = useState<string>('')
  const [customPrompty, setCustomPrompty] = useState<string>('')
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [targetTerminal, setTargetTerminal] = useState<string>('copy-only')
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)

  // Get current prompty content
  const currentPrompty = useMemo(() => {
    if (customPrompty) {
      return parsePrompty(customPrompty)
    }
    const file = SAMPLE_PROMPTY_FILES.find(f => f.id === selectedPrompty)
    if (file) {
      return parsePrompty(file.content)
    }
    return null
  }, [selectedPrompty, customPrompty])

  // Initialize variable values when prompty changes
  useEffect(() => {
    if (currentPrompty) {
      const initialValues: Record<string, string> = {}
      currentPrompty.variables.forEach(v => {
        initialValues[v.name] = v.defaultValue
      })
      setVariableValues(initialValues)
    }
  }, [currentPrompty])

  // Generate preview
  const preview = useMemo(() => {
    if (!currentPrompty) return ''
    return substituteVariables(currentPrompty.content, variableValues)
  }, [currentPrompty, variableValues])

  // Handle file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setCustomPrompty(content)
        setSelectedPrompty('')
      }
      reader.readAsText(file)
    }
  }, [])

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(preview)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [preview])

  // Handle send to terminal
  const handleSend = useCallback(async () => {
    if (targetTerminal === 'copy-only') {
      await handleCopy()
      return
    }

    // In production, this would send to the actual terminal via TabzChrome API
    console.log('Sending to terminal:', targetTerminal, preview)
    setSent(true)
    setTimeout(() => setSent(false), 2000)
  }, [targetTerminal, preview, handleCopy])

  // Handle execute MCP workflow
  const handleExecuteMCP = useCallback(() => {
    if (!currentPrompty?.workflowSteps.length) return

    // In production, this would execute MCP commands via TabzChrome
    console.log('Executing MCP workflow:', currentPrompty.workflowSteps)
    alert('MCP workflow execution would start here. Steps:\n\n' + currentPrompty.workflowSteps.join('\n'))
  }, [currentPrompty])

  // Update variable value
  const updateVariable = useCallback((name: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [name]: value }))
  }, [])

  // Selectors for TabzChrome automation
  const selectors: Selector[] = [
    { id: 'prompty-select', description: 'Dropdown of available prompty files' },
    { id: 'prompty-upload', description: 'Upload custom prompty file' },
    { id: 'variables-form', description: 'Dynamic form for template variables' },
    { id: 'preview-panel', description: 'Live preview with substituted values' },
    { id: 'target-terminal', description: 'Select which terminal to send to' },
    { id: 'btn-copy', description: 'Copy rendered prompt to clipboard' },
    { id: 'btn-send', description: 'Send to selected terminal' },
    { id: 'btn-execute-mcp', description: 'Execute full MCP workflow' },
    { id: 'workflow-steps', description: 'Display workflow steps from prompty' },
    { id: 'btn-toggle-selectors', description: 'Toggle selectors panel' },
  ]

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Rocket className="h-4 w-4" />
            <span className="text-sm font-medium">Automation Page</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-mono font-bold mb-3">
            <span className="gradient-text-theme">Prompt Launcher</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Load any .prompty file, fill template variables dynamically, preview, and execute.
            Works with all prompty files from TabzChrome.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column: Prompty Selection & Variables */}
          <div className="space-y-6">
            {/* Prompty Selector */}
            <Card className="glass border-border/50 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Select Prompty
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="prompty-select">Choose a prompty file</Label>
                  <Select
                    value={selectedPrompty}
                    onValueChange={(value) => {
                      setSelectedPrompty(value)
                      setCustomPrompty('')
                    }}
                  >
                    <SelectTrigger id="prompty-select" className="mt-1">
                      <SelectValue placeholder="Select a prompty file..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SAMPLE_PROMPTY_FILES.map((file) => (
                        <SelectItem key={file.id} value={file.id}>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({file.path})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex-1 h-px bg-border" />
                  <span>or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div>
                  <Label htmlFor="prompty-upload">Upload custom prompty</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      id="prompty-upload"
                      type="file"
                      accept=".prompty,.txt,.md"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                    <Button variant="outline" size="icon" asChild>
                      <label htmlFor="prompty-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4" />
                      </label>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Show loaded prompty info */}
              {currentPrompty && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{currentPrompty.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {currentPrompty.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {currentPrompty.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Variables Form */}
            {currentPrompty && currentPrompty.variables.length > 0 && (
              <Card className="glass border-border/50 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Template Variables
                </h2>

                <form id="variables-form" className="space-y-4">
                  {currentPrompty.variables.map((variable) => (
                    <div key={variable.name}>
                      <Label htmlFor={`var-${variable.name}`} className="capitalize">
                        {variable.name.replace(/_/g, ' ')}
                      </Label>

                      {variable.type === 'select' && variable.options ? (
                        <Select
                          value={variableValues[variable.name] || variable.options[0]}
                          onValueChange={(value) => updateVariable(variable.name, value)}
                        >
                          <SelectTrigger id={`var-${variable.name}`} className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {variable.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : variable.type === 'textarea' ? (
                        <Textarea
                          id={`var-${variable.name}`}
                          value={variableValues[variable.name] || ''}
                          onChange={(e) => updateVariable(variable.name, e.target.value)}
                          placeholder={variable.defaultValue || `Enter ${variable.name}...`}
                          className="mt-1"
                          rows={3}
                        />
                      ) : variable.type === 'number' ? (
                        <Input
                          id={`var-${variable.name}`}
                          type="number"
                          value={variableValues[variable.name] || ''}
                          onChange={(e) => updateVariable(variable.name, e.target.value)}
                          placeholder={variable.defaultValue || '0'}
                          className="mt-1"
                        />
                      ) : (
                        <Input
                          id={`var-${variable.name}`}
                          type="text"
                          value={variableValues[variable.name] || ''}
                          onChange={(e) => updateVariable(variable.name, e.target.value)}
                          placeholder={variable.defaultValue || `Enter ${variable.name}...`}
                          className="mt-1"
                        />
                      )}
                    </div>
                  ))}
                </form>
              </Card>
            )}
          </div>

          {/* Right Column: Preview & Actions */}
          <div className="space-y-6">
            {/* Preview Panel */}
            <Card className="glass border-border/50 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Preview
              </h2>

              <div
                id="preview-panel"
                className="bg-background/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap min-h-[200px] border border-border/30"
              >
                {preview || (
                  <span className="text-muted-foreground italic">
                    Select a prompty file to see the preview...
                  </span>
                )}
              </div>
            </Card>

            {/* Workflow Steps */}
            {currentPrompty && currentPrompty.workflowSteps.length > 0 && (
              <Card className="glass border-border/50 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <List className="h-5 w-5 text-primary" />
                  Workflow Steps
                </h2>

                <div id="workflow-steps" className="space-y-2">
                  {currentPrompty.workflowSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 bg-background/50 rounded border border-border/30"
                    >
                      <Badge variant="outline" className="shrink-0">
                        {index + 1}
                      </Badge>
                      <code className="text-xs font-mono break-all">
                        {step}
                      </code>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Target Selection & Actions */}
            <Card className="glass border-border/50 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Target & Actions
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="target-terminal">Send to</Label>
                  <Select
                    value={targetTerminal}
                    onValueChange={setTargetTerminal}
                  >
                    <SelectTrigger id="target-terminal" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="copy-only">
                        <div className="flex items-center gap-2">
                          <Copy className="h-4 w-4" />
                          Copy to clipboard only
                        </div>
                      </SelectItem>
                      <SelectItem value="terminal-1">
                        <div className="flex items-center gap-2">
                          <Terminal className="h-4 w-4" />
                          Terminal 1 (Main)
                        </div>
                      </SelectItem>
                      <SelectItem value="terminal-2">
                        <div className="flex items-center gap-2">
                          <Terminal className="h-4 w-4" />
                          Terminal 2
                        </div>
                      </SelectItem>
                      <SelectItem value="chatgpt">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          ChatGPT Tab
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    id="btn-copy"
                    variant="outline"
                    onClick={handleCopy}
                    disabled={!preview}
                    className="flex-1 min-w-[120px]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>

                  <Button
                    id="btn-send"
                    onClick={handleSend}
                    disabled={!preview}
                    className="flex-1 min-w-[120px]"
                  >
                    {sent ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Sent!
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>

                  {currentPrompty && currentPrompty.workflowSteps.length > 0 && (
                    <Button
                      id="btn-execute-mcp"
                      variant="secondary"
                      onClick={handleExecuteMCP}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Execute MCP Workflow ({currentPrompty.workflowSteps.length} steps)
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Selectors Panel */}
      <SelectorsPanel selectors={selectors} />
    </div>
  )
}

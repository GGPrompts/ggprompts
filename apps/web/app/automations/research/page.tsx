'use client'

import { useState } from 'react'
import {
  Search,
  Globe,
  Github,
  GraduationCap,
  Bot,
  Copy,
  Terminal,
  Download,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react'
import { Button, Input, Checkbox, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@ggprompts/ui'

interface ResearchResult {
  source: 'web' | 'github' | 'consensus' | 'llm'
  title: string
  snippet: string
  url?: string
  metadata?: Record<string, string>
}

// Mock results for demonstration
const mockResults: ResearchResult[] = [
  {
    source: 'web',
    title: 'Understanding Large Language Models: A Comprehensive Guide',
    snippet: 'Large Language Models (LLMs) are neural networks trained on vast amounts of text data...',
    url: 'https://example.com/llm-guide',
    metadata: { date: '2024-12-15' },
  },
  {
    source: 'web',
    title: 'The Future of AI in Software Development',
    snippet: 'AI-powered tools are transforming how developers write, test, and deploy code...',
    url: 'https://example.com/ai-software',
    metadata: { date: '2024-12-10' },
  },
  {
    source: 'github',
    title: 'anthropics/claude-code',
    snippet: 'Claude Code is an agentic coding tool that lives in your terminal. Stars: 25.3k',
    url: 'https://github.com/anthropics/claude-code',
    metadata: { stars: '25.3k', language: 'TypeScript' },
  },
  {
    source: 'github',
    title: 'langchain-ai/langchain',
    snippet: 'Building applications with LLMs through composability. Stars: 92k',
    url: 'https://github.com/langchain-ai/langchain',
    metadata: { stars: '92k', language: 'Python' },
  },
  {
    source: 'consensus',
    title: 'Transformer Models in NLP: A Meta-Analysis',
    snippet: 'This systematic review examines 150+ papers on transformer architectures...',
    url: 'https://consensus.app/papers/transformers',
    metadata: { citations: '2,341', year: '2023' },
  },
  {
    source: 'consensus',
    title: 'AI Code Generation: Efficacy and Limitations',
    snippet: 'Study finds AI-generated code increases developer productivity by 55% on average...',
    url: 'https://consensus.app/papers/ai-code-gen',
    metadata: { citations: '891', year: '2024' },
  },
  {
    source: 'llm',
    title: 'Claude Analysis',
    snippet: 'Based on my training data, the key considerations for implementing LLM-based research tools include: 1) Source diversity and credibility verification, 2) Result aggregation strategies...',
    metadata: { model: 'Claude 3.5 Sonnet' },
  },
  {
    source: 'llm',
    title: 'ChatGPT Analysis',
    snippet: 'When researching AI topics, consider cross-referencing academic databases like arXiv and Semantic Scholar with practical implementations on GitHub...',
    metadata: { model: 'GPT-4' },
  },
]

// Selectors documentation for TabzChrome automation
const selectors = [
  { id: 'research-query', description: 'Main search input field' },
  { id: 'src-web', description: 'Checkbox: Enable web search' },
  { id: 'src-github', description: 'Checkbox: Enable GitHub repos/code search' },
  { id: 'src-consensus', description: 'Checkbox: Enable academic papers (Consensus GPT)' },
  { id: 'src-llm', description: 'Checkbox: Enable LLM responses' },
  { id: 'btn-search', description: 'Execute search across selected sources' },
  { id: 'results-panel', description: 'Container for all aggregated results' },
  { id: 'results-web', description: 'Web search results section' },
  { id: 'results-github', description: 'GitHub results section' },
  { id: 'results-papers', description: 'Academic papers section' },
  { id: 'results-llm', description: 'LLM responses section' },
  { id: 'btn-copy-all', description: 'Copy all findings as markdown' },
  { id: 'btn-send-terminal', description: 'Send results to Claude terminal' },
  { id: 'btn-export-json', description: 'Export results as JSON file' },
]

export default function ResearchPage() {
  const [query, setQuery] = useState('')
  const [sources, setSources] = useState({
    web: true,
    github: true,
    consensus: false,
    llm: true,
  })
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<ResearchResult[]>([])
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [showSelectors, setShowSelectors] = useState(true)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Filter mock results based on selected sources
    const filtered = mockResults.filter(r => {
      if (r.source === 'web' && sources.web) return true
      if (r.source === 'github' && sources.github) return true
      if (r.source === 'consensus' && sources.consensus) return true
      if (r.source === 'llm' && sources.llm) return true
      return false
    })

    setResults(filtered)
    setIsSearching(false)
  }

  const generateMarkdown = () => {
    let md = `# Research: ${query}\n\n`
    md += `_Generated: ${new Date().toISOString()}_\n\n`

    const grouped: Record<string, ResearchResult[]> = {}
    results.forEach(r => {
      if (!grouped[r.source]) grouped[r.source] = []
      grouped[r.source].push(r)
    })

    Object.entries(grouped).forEach(([source, items]) => {
      md += `## ${source.charAt(0).toUpperCase() + source.slice(1)} Results\n\n`
      items.forEach(item => {
        md += `### ${item.title}\n`
        md += `${item.snippet}\n`
        if (item.url) md += `[Link](${item.url})\n`
        md += '\n'
      })
    })

    return md
  }

  const handleCopyAll = async () => {
    const md = generateMarkdown()
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportJSON = () => {
    const data = {
      query,
      timestamp: new Date().toISOString(),
      sources: Object.entries(sources).filter(([, v]) => v).map(([k]) => k),
      results,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `research-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSendTerminal = () => {
    const md = generateMarkdown()
    // TabzChrome integration would send this to terminal
    console.log('Send to terminal:', md)
    alert('TabzChrome integration: This would send results to your Claude terminal session.')
  }

  const getResultsBySource = (source: string) =>
    results.filter(r => r.source === source)

  const sourceIcons = {
    web: Globe,
    github: Github,
    consensus: GraduationCap,
    llm: Bot,
  }

  const ResultCard = ({ result }: { result: ResearchResult }) => {
    const Icon = sourceIcons[result.source]
    return (
      <div className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{result.title}</h4>
              {result.metadata && (
                <div className="flex gap-1 shrink-0">
                  {Object.entries(result.metadata).map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {value}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{result.snippet}</p>
            {result.url && (
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
              >
                View source <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <Search className="h-4 w-4" />
          <span className="text-sm font-medium">Automation Page</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Multi-Source Research Hub</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Search across web, GitHub, academic papers, and LLMs. Aggregate and export findings.
        </p>
      </div>

      {/* Search Section */}
      <div className="glass border-border/50 rounded-xl p-6 mb-6">
        {/* Search Input */}
        <div className="flex gap-3 mb-4">
          <Input
            id="research-query"
            type="text"
            placeholder="Enter your research query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button
            id="btn-search"
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Search</span>
          </Button>
        </div>

        {/* Source Toggles */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              id="src-web"
              checked={sources.web}
              onCheckedChange={(checked) =>
                setSources(s => ({ ...s, web: checked as boolean }))
              }
            />
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Web</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              id="src-github"
              checked={sources.github}
              onCheckedChange={(checked) =>
                setSources(s => ({ ...s, github: checked as boolean }))
              }
            />
            <Github className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">GitHub</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              id="src-consensus"
              checked={sources.consensus}
              onCheckedChange={(checked) =>
                setSources(s => ({ ...s, consensus: checked as boolean }))
              }
            />
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Academic Papers</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              id="src-llm"
              checked={sources.llm}
              onCheckedChange={(checked) =>
                setSources(s => ({ ...s, llm: checked as boolean }))
              }
            />
            <Bot className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">LLM Analysis</span>
          </label>
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div id="results-panel" className="glass border-border/50 rounded-xl p-6 mb-6">
          {/* Results Header with Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold">
              Results <Badge variant="secondary">{results.length}</Badge>
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button
                id="btn-copy-all"
                variant="outline"
                size="sm"
                onClick={handleCopyAll}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="ml-2">{copied ? 'Copied!' : 'Copy All'}</span>
              </Button>
              <Button
                id="btn-send-terminal"
                variant="outline"
                size="sm"
                onClick={handleSendTerminal}
              >
                <Terminal className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Send to Terminal</span>
              </Button>
              <Button
                id="btn-export-json"
                variant="outline"
                size="sm"
                onClick={handleExportJSON}
              >
                <Download className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Export JSON</span>
              </Button>
            </div>
          </div>

          {/* Tabbed Results */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All ({results.length})
              </TabsTrigger>
              {sources.web && getResultsBySource('web').length > 0 && (
                <TabsTrigger value="web">
                  Web ({getResultsBySource('web').length})
                </TabsTrigger>
              )}
              {sources.github && getResultsBySource('github').length > 0 && (
                <TabsTrigger value="github">
                  GitHub ({getResultsBySource('github').length})
                </TabsTrigger>
              )}
              {sources.consensus && getResultsBySource('consensus').length > 0 && (
                <TabsTrigger value="papers">
                  Papers ({getResultsBySource('consensus').length})
                </TabsTrigger>
              )}
              {sources.llm && getResultsBySource('llm').length > 0 && (
                <TabsTrigger value="llm">
                  LLM ({getResultsBySource('llm').length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {results.map((result, i) => (
                <ResultCard key={i} result={result} />
              ))}
            </TabsContent>

            <TabsContent id="results-web" value="web" className="space-y-3">
              {getResultsBySource('web').map((result, i) => (
                <ResultCard key={i} result={result} />
              ))}
            </TabsContent>

            <TabsContent id="results-github" value="github" className="space-y-3">
              {getResultsBySource('github').map((result, i) => (
                <ResultCard key={i} result={result} />
              ))}
            </TabsContent>

            <TabsContent id="results-papers" value="papers" className="space-y-3">
              {getResultsBySource('consensus').map((result, i) => (
                <ResultCard key={i} result={result} />
              ))}
            </TabsContent>

            <TabsContent id="results-llm" value="llm" className="space-y-3">
              {getResultsBySource('llm').map((result, i) => (
                <ResultCard key={i} result={result} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && !isSearching && (
        <div className="glass border-border/50 rounded-xl p-12 text-center mb-6">
          <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Enter a query and select sources to begin your research
          </p>
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="glass border-border/50 rounded-xl p-12 text-center mb-6">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            Searching across selected sources...
          </p>
        </div>
      )}

      {/* Selectors Panel */}
      <div id="selectors-panel" className="glass border-border/50 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowSelectors(!showSelectors)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">TabzChrome Selectors</span>
            <Badge variant="secondary" className="text-xs">
              {selectors.length} elements
            </Badge>
          </div>
          {showSelectors ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {showSelectors && (
          <div className="p-4 pt-0 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-3">
              Use these selectors with TabzChrome MCP tools (tabz_click, tabz_fill, etc.)
            </p>
            <div className="grid gap-2">
              {selectors.map((selector) => (
                <div
                  key={selector.id}
                  className="flex items-center gap-3 text-sm p-2 rounded bg-muted/30"
                >
                  <code className="font-mono text-primary text-xs bg-primary/10 px-2 py-0.5 rounded">
                    #{selector.id}
                  </code>
                  <span className="text-muted-foreground text-xs">
                    {selector.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

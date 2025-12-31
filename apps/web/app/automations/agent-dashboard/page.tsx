'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress, Switch, Textarea, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@ggprompts/ui'
import {
  Plus,
  Trash2,
  Send,
  RefreshCw,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronUp,
  Terminal,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  GitPullRequest,
  GitCommit,
} from 'lucide-react'

// Types
interface Agent {
  id: string
  name: string
  sessionName: string
  state: 'idle' | 'processing' | 'awaiting_input'
  contextPercent: number
  recentOutput: string[]
  linkedIssue?: { number: number; title: string }
  linkedPR?: { number: number; url: string }
  startedAt: string
}

// Mock data for demo
const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Feature Worker',
    sessionName: 'claude-feature-1',
    state: 'processing',
    contextPercent: 45,
    recentOutput: [
      '> Reading file src/components/...',
      '> Analyzing patterns...',
      '> Writing implementation...',
    ],
    linkedIssue: { number: 42, title: 'Add user authentication' },
    startedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'agent-2',
    name: 'Bug Fixer',
    sessionName: 'claude-bugfix-1',
    state: 'idle',
    contextPercent: 23,
    recentOutput: ['> Task completed', '> Waiting for next task...'],
    linkedPR: { number: 87, url: 'https://github.com/org/repo/pull/87' },
    startedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'agent-3',
    name: 'Doc Writer',
    sessionName: 'claude-docs-1',
    state: 'awaiting_input',
    contextPercent: 67,
    recentOutput: [
      '> Generated README.md',
      '? Choose documentation style:',
      '  1. Technical',
      '  2. User-friendly',
    ],
    linkedIssue: { number: 15, title: 'Improve API documentation' },
    startedAt: new Date(Date.now() - 900000).toISOString(),
  },
]

// Selector reference for automation
const SELECTORS = [
  { id: 'agent-list', description: 'Container for agent cards' },
  { id: 'agent-{id}-card', description: 'Individual agent card' },
  { id: 'agent-{id}-status', description: 'Status indicator (idle/processing/done)' },
  { id: 'agent-{id}-context', description: 'Context usage percentage' },
  { id: 'agent-{id}-output', description: 'Recent output preview' },
  { id: 'agent-{id}-kill', description: 'Kill button for agent' },
  { id: 'agent-{id}-send', description: 'Send prompt button for agent' },
  { id: 'btn-spawn-new', description: 'Spawn new agent button' },
  { id: 'btn-kill-all', description: 'Kill all agents button' },
  { id: 'global-prompt', description: 'Textarea for broadcast prompt' },
  { id: 'btn-send-all', description: 'Send prompt to all agents' },
  { id: 'refresh-interval', description: 'Auto-refresh toggle switch' },
  { id: 'connection-status', description: 'TabzChrome connection indicator' },
]

export default function AgentDashboardPage() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [isConnected, setIsConnected] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [globalPrompt, setGlobalPrompt] = useState('')
  const [selectorsOpen, setSelectorsOpen] = useState(false)

  // Check TabzChrome connection
  const checkConnection = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8129/api/health', {
        method: 'GET',
        signal: AbortSignal.timeout(2000),
      })
      setIsConnected(res.ok)
      return res.ok
    } catch {
      setIsConnected(false)
      return false
    }
  }, [])

  // Fetch agents from TabzChrome
  const fetchAgents = useCallback(async () => {
    const connected = await checkConnection()
    if (!connected) return

    try {
      const res = await fetch('http://localhost:8129/api/agents')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setAgents(data)
        }
      }
    } catch {
      // Keep mock data on error
    }
  }, [checkConnection])

  // Auto-refresh effect
  useEffect(() => {
    checkConnection()
    if (autoRefresh) {
      const interval = setInterval(fetchAgents, 5000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, fetchAgents, checkConnection])

  // Spawn new agent
  const handleSpawnAgent = async () => {
    if (!isConnected) {
      // Demo mode - add mock agent
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: `Worker ${agents.length + 1}`,
        sessionName: `claude-worker-${agents.length + 1}`,
        state: 'idle',
        contextPercent: 0,
        recentOutput: ['> Spawned...', '> Ready for tasks'],
        startedAt: new Date().toISOString(),
      }
      setAgents([...agents, newAgent])
      return
    }

    try {
      await fetch('http://localhost:8129/api/spawn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Claude: Worker ${agents.length + 1}`,
          command: 'claude --dangerously-skip-permissions',
        }),
      })
      await fetchAgents()
    } catch (err) {
      console.error('Failed to spawn agent:', err)
    }
  }

  // Kill agent
  const handleKillAgent = async (agentId: string) => {
    if (!isConnected) {
      // Demo mode
      setAgents(agents.filter((a) => a.id !== agentId))
      return
    }

    try {
      await fetch(`http://localhost:8129/api/agents/${agentId}`, {
        method: 'DELETE',
      })
      await fetchAgents()
    } catch (err) {
      console.error('Failed to kill agent:', err)
    }
  }

  // Kill all agents
  const handleKillAll = async () => {
    if (!isConnected) {
      setAgents([])
      return
    }

    for (const agent of agents) {
      await handleKillAgent(agent.id)
    }
  }

  // Send prompt to agent
  const handleSendPrompt = async (agentId: string, prompt: string) => {
    if (!isConnected || !prompt.trim()) return

    try {
      await fetch(`http://localhost:8129/api/agents/${agentId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
    } catch (err) {
      console.error('Failed to send prompt:', err)
    }
  }

  // Send to all agents
  const handleSendAll = async () => {
    if (!globalPrompt.trim()) return

    for (const agent of agents) {
      await handleSendPrompt(agent.id, globalPrompt)
    }
    setGlobalPrompt('')
  }

  // Status badge color
  const getStatusColor = (state: Agent['state']) => {
    switch (state) {
      case 'idle':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'processing':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50'
      case 'awaiting_input':
        return 'bg-muted text-muted-foreground border-muted'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  // Status icon
  const getStatusIcon = (state: Agent['state']) => {
    switch (state) {
      case 'idle':
        return <CheckCircle className="h-3 w-3" />
      case 'processing':
        return <RefreshCw className="h-3 w-3 animate-spin" />
      case 'awaiting_input':
        return <Clock className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  // Format time ago
  const getTimeAgo = (isoDate: string) => {
    const diff = Date.now() - new Date(isoDate).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-style-gradient" />
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text-theme">Agent Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and control Claude Code workers
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div
              id="connection-status"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                isConnected
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4" />
                  <span>Demo Mode</span>
                </>
              )}
            </div>

            {/* Spawn Button */}
            <Button id="btn-spawn-new" onClick={handleSpawnAgent}>
              <Plus className="h-4 w-4 mr-2" />
              Spawn Agent
            </Button>
          </div>
        </div>

        {/* Agent Grid */}
        <div id="agent-list" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              id={`${agent.id}-card`}
              className="glass border-border/50 hover:border-primary/50 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                  </div>
                  <Badge
                    id={`${agent.id}-status`}
                    className={`flex items-center gap-1 ${getStatusColor(agent.state)}`}
                  >
                    {getStatusIcon(agent.state)}
                    {agent.state.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {agent.sessionName} • Started {getTimeAgo(agent.startedAt)}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Context Usage */}
                <div id={`${agent.id}-context`}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Context Usage</span>
                    <span
                      className={
                        agent.contextPercent > 70 ? 'text-destructive' : 'text-foreground'
                      }
                    >
                      {agent.contextPercent}%
                    </span>
                  </div>
                  <Progress
                    value={agent.contextPercent}
                    className={agent.contextPercent > 70 ? '[&>div]:bg-destructive' : ''}
                  />
                </div>

                {/* Recent Output */}
                <div id={`${agent.id}-output`} className="space-y-1">
                  <span className="text-xs text-muted-foreground">Recent Output</span>
                  <div className="bg-background/50 rounded-md p-2 font-mono text-xs max-h-24 overflow-y-auto">
                    {agent.recentOutput.map((line, i) => (
                      <div key={i} className="text-muted-foreground">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                {/* GitHub Integration */}
                {(agent.linkedIssue || agent.linkedPR) && (
                  <div className="flex flex-wrap gap-2">
                    {agent.linkedIssue && (
                      <Badge variant="outline" className="text-xs">
                        <GitCommit className="h-3 w-3 mr-1" />
                        #{agent.linkedIssue.number}
                      </Badge>
                    )}
                    {agent.linkedPR && (
                      <Badge variant="secondary" className="text-xs">
                        <GitPullRequest className="h-3 w-3 mr-1" />
                        PR #{agent.linkedPR.number}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    id={`${agent.id}-send`}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleSendPrompt(agent.id, globalPrompt)}
                    disabled={!globalPrompt.trim()}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Send
                  </Button>
                  <Button
                    id={`${agent.id}-kill`}
                    size="sm"
                    variant="destructive"
                    onClick={() => handleKillAgent(agent.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {agents.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No agents running</p>
              <p className="text-sm mt-1">Click &quot;Spawn Agent&quot; to start a new worker</p>
            </div>
          )}
        </div>

        {/* Global Controls */}
        <Card className="glass border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Global Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Global Prompt */}
            <div>
              <label htmlFor="global-prompt" className="text-sm text-muted-foreground mb-2 block">
                Broadcast Prompt
              </label>
              <Textarea
                id="global-prompt"
                placeholder="Enter a prompt to send to agents..."
                value={globalPrompt}
                onChange={(e) => setGlobalPrompt(e.target.value)}
                className="bg-background/50"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                id="btn-send-all"
                onClick={handleSendAll}
                disabled={!globalPrompt.trim() || agents.length === 0}
                className="flex-1 sm:flex-none"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to All
              </Button>

              <Button
                id="btn-kill-all"
                variant="destructive"
                onClick={handleKillAll}
                disabled={agents.length === 0}
                className="flex-1 sm:flex-none"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Kill All
              </Button>

              <div className="flex items-center gap-2 ml-0 sm:ml-auto">
                <label htmlFor="refresh-interval" className="text-sm text-muted-foreground">
                  Auto-refresh
                </label>
                <Switch
                  id="refresh-interval"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selectors Panel */}
        <Collapsible
          open={selectorsOpen}
          onOpenChange={setSelectorsOpen}
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="glass-dark border-border/50 w-80">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer py-3 hover:bg-muted/20 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    MCP Selectors ({SELECTORS.length})
                  </CardTitle>
                  {selectorsOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {SELECTORS.map((sel) => (
                    <div key={sel.id} className="text-xs">
                      <code className="text-primary font-mono">#{sel.id}</code>
                      <p className="text-muted-foreground">{sel.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  )
}

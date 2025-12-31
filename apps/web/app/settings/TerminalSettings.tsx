'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTabzChrome } from '@/hooks'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Badge,
} from '@ggprompts/ui'
import {
  Terminal,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Loader2,
  Zap,
  FolderOpen,
} from 'lucide-react'
import { toast } from 'sonner'

// Terminal preferences stored in localStorage
interface TerminalPreferences {
  defaultWorkingDir: string
  defaultAI: 'claude' | 'codex' | 'gemini' | 'shell'
  yoloMode: boolean
  autoSend: boolean
  useTabzWorkingDir: boolean
}

// TabzChrome browser settings response
interface TabzBrowserSettings {
  success: boolean
  globalWorkingDir: string
  defaultProfileName: string
}

const DEFAULT_PREFERENCES: TerminalPreferences = {
  defaultWorkingDir: '~',
  defaultAI: 'claude',
  yoloMode: false,
  autoSend: false,
  useTabzWorkingDir: false,
}

const AI_OPTIONS = [
  { value: 'claude', label: 'Claude', description: 'Anthropic Claude Code CLI' },
  { value: 'codex', label: 'Codex', description: 'OpenAI Codex CLI' },
  { value: 'gemini', label: 'Gemini', description: 'Google Gemini CLI' },
  { value: 'shell', label: 'Shell', description: 'Plain shell command' },
]

const TABZ_API_BASE = 'http://localhost:8129'

function isLocalhost(): boolean {
  if (typeof window === 'undefined') return false
  const hostname = window.location.hostname
  return hostname === 'localhost' || hostname === '127.0.0.1'
}

export function TerminalSettings() {
  const { isAvailable, isChecking, checkAvailability, spawnTerminal } = useTabzChrome()
  const [isLocal, setIsLocal] = useState(false)

  // Check if running on localhost
  useEffect(() => {
    setIsLocal(isLocalhost())
  }, [])
  const [preferences, setPreferences] = useState<TerminalPreferences>(DEFAULT_PREFERENCES)
  const [hasChanges, setHasChanges] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [tabzSettings, setTabzSettings] = useState<TabzBrowserSettings | null>(null)
  const [isLoadingTabzSettings, setIsLoadingTabzSettings] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ggprompts-terminal-prefs')
    if (saved) {
      try {
        setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(saved) })
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Fetch TabzChrome browser settings when connected
  const fetchTabzSettings = async () => {
    if (!isAvailable) return
    setIsLoadingTabzSettings(true)
    try {
      const res = await fetch(`${TABZ_API_BASE}/api/browser/settings`, {
        signal: AbortSignal.timeout(2000),
      })
      if (res.ok) {
        const data = await res.json()
        setTabzSettings(data)
      }
    } catch {
      // Ignore fetch errors
    } finally {
      setIsLoadingTabzSettings(false)
    }
  }

  // Load TabzChrome settings when available
  useEffect(() => {
    if (isAvailable) {
      fetchTabzSettings()
    } else {
      setTabzSettings(null)
    }
  }, [isAvailable])

  // Save preferences
  const handleSave = () => {
    localStorage.setItem('ggprompts-terminal-prefs', JSON.stringify(preferences))
    setHasChanges(false)
    toast.success('Terminal preferences saved')
  }

  // Update a preference
  const updatePreference = <K extends keyof TerminalPreferences>(
    key: K,
    value: TerminalPreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  // Test connection
  const handleTestConnection = async () => {
    setIsTesting(true)
    const success = await spawnTerminal({
      name: 'GGPrompts Connection Test',
      command: 'echo "TabzChrome connected successfully!" && sleep 2',
    })

    if (success) {
      toast.success('Connection test successful!', {
        description: 'A test terminal session was opened in TabzChrome',
      })
    } else {
      toast.error('Connection test failed', {
        description: 'Make sure TabzChrome backend is running on localhost:8129',
      })
    }
    setIsTesting(false)
  }

  return (
    <>
      {/* Connection Status Card */}
      <Card className="glass-dark border-primary/30">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            TabzChrome Connection
          </CardTitle>
          <CardDescription>
            Send prompts directly to your terminal with TabzChrome
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Display */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-3">
              {!isLocal ? (
                // Remote site - extension handles everything
                <>
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <div>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      Extension Mode
                    </span>
                    <p className="text-xs text-muted-foreground">
                      &quot;Send to Terminal&quot; buttons work via TabzChrome extension
                    </p>
                  </div>
                </>
              ) : isChecking ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Checking connection...</span>
                </>
              ) : isAvailable ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Connected
                    </span>
                    <p className="text-xs text-muted-foreground">
                      TabzChrome backend running on localhost:8129
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground font-medium">Not Connected</span>
                    <p className="text-xs text-muted-foreground">
                      Start the TabzChrome backend to enable spawn features
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isLocal && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => checkAvailability()}
                    disabled={isChecking}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  {isAvailable && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTestConnection}
                      disabled={isTesting}
                    >
                      {isTesting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      Test
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Remote site info */}
          {!isLocal && (
            <div className="text-sm text-muted-foreground p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <p>
                On remote sites, the TabzChrome browser extension handles &quot;Send to Terminal&quot;
                clicks automatically. No backend connection needed.
              </p>
            </div>
          )}

          {/* Setup Link - only show on localhost when not connected */}
          {isLocal && !isAvailable && !isChecking && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/tabzchrome">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Setup Guide
                </Link>
              </Button>
              <span className="text-xs text-muted-foreground">
                Learn how to install and configure TabzChrome
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Spawn Terminal Preferences - Only shown on localhost with backend connected */}
      {isLocal && isAvailable && (
        <Card className="glass-dark border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-primary">Spawn Terminal Preferences</CardTitle>
                <CardDescription>
                  Settings for spawning new terminal sessions with AI commands
                </CardDescription>
              </div>
              {hasChanges && (
                <Button size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Default Working Directory */}
            <div className="space-y-3">
              <Label htmlFor="workingDir" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Default Working Directory
              </Label>
              <Input
                id="workingDir"
                value={preferences.defaultWorkingDir}
                onChange={(e) => updatePreference('defaultWorkingDir', e.target.value)}
                placeholder="~/projects"
                className="glass-dark border-primary/30 font-mono"
                disabled={preferences.useTabzWorkingDir}
              />
              <p className="text-xs text-muted-foreground">
                New terminal tabs will start in this directory
              </p>

              {/* TabzChrome Working Directory Option */}
              <div className="space-y-3 pt-2">
                {/* Use TabzChrome Working Directory Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="useTabzWorkingDir" className="text-sm font-medium">
                      Use TabzChrome working directory
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically use TabzChrome&apos;s configured directory
                    </p>
                  </div>
                  <Switch
                    id="useTabzWorkingDir"
                    checked={preferences.useTabzWorkingDir}
                    onCheckedChange={(checked) => updatePreference('useTabzWorkingDir', checked)}
                  />
                </div>

                {/* Show TabzChrome's Current Directory */}
                {tabzSettings?.globalWorkingDir && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 min-w-0">
                      <Terminal className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs text-muted-foreground">TabzChrome:</span>
                        <p className="font-mono text-sm truncate">{tabzSettings.globalWorkingDir}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 ml-2"
                      onClick={() => {
                        updatePreference('defaultWorkingDir', tabzSettings.globalWorkingDir)
                        updatePreference('useTabzWorkingDir', false)
                        toast.success('Working directory updated')
                      }}
                    >
                      Use this
                    </Button>
                  </div>
                )}

                {isLoadingTabzSettings && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading TabzChrome settings...
                  </div>
                )}
              </div>
            </div>

            {/* Default AI */}
            <div className="space-y-2">
              <Label htmlFor="defaultAI">Default AI Tool</Label>
              <Select
                value={preferences.defaultAI}
                onValueChange={(value) =>
                  updatePreference('defaultAI', value as TerminalPreferences['defaultAI'])
                }
              >
                <SelectTrigger className="glass-dark border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-dark border-primary/30">
                  {AI_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">
                          - {option.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Which AI CLI to launch when spawning a new terminal
              </p>
            </div>

            <Separator className="border-primary/20" />

            {/* YOLO Mode Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="space-y-0.5">
                <Label htmlFor="yoloMode" className="flex items-center gap-2 cursor-pointer">
                  YOLO Mode
                  <Badge variant="secondary" className="text-xs">
                    Claude Only
                  </Badge>
                </Label>
                <p className="text-xs text-muted-foreground">
                  Spawn Claude with --dangerously-skip-permissions
                </p>
              </div>
              <Switch
                id="yoloMode"
                checked={preferences.yoloMode}
                onCheckedChange={(checked) => updatePreference('yoloMode', checked)}
              />
            </div>

            {/* Auto-send Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="space-y-0.5">
                <Label htmlFor="autoSend" className="cursor-pointer">Auto-send on Click</Label>
                <p className="text-xs text-muted-foreground">
                  Skip confirmation when spawning terminals
                </p>
              </div>
              <Switch
                id="autoSend"
                checked={preferences.autoSend}
                onCheckedChange={(checked) => updatePreference('autoSend', checked)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="glass-dark border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <Terminal className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">About TabzChrome Integration</h4>
              <p className="text-sm text-muted-foreground mb-3">
                TabzChrome adds a terminal sidebar to Chrome. Click &quot;Send to Terminal&quot; on any
                prompt to queue it to the TabzChrome chat bar.
              </p>
              <div className="text-sm text-muted-foreground space-y-1 mb-3">
                <p><strong>Extension Mode:</strong> Works on any website - the TabzChrome extension intercepts clicks automatically.</p>
                {isLocal && (
                  <p><strong>Localhost Mode:</strong> Additional features like spawning new terminal tabs with AI commands.</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/tabzchrome">Learn More</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href="https://github.com/mbenhamd/tabz-chrome"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Github,
  Link2,
  Unlink,
  ExternalLink,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Lock,
  Globe,
  Settings2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Key
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  getGitHubSyncStatus,
  disconnectGitHub,
  updateRepoName,
  syncToGitHub,
  savePersonalAccessToken,
  GitHubSyncStatus
} from '@/app/claude-code/github-sync-actions'
import { createClient } from '@/lib/supabase/client'

export function GitHubSyncSettings() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [status, setStatus] = useState<GitHubSyncStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [repoName, setRepoName] = useState('my-gg-plugins')
  const [isSyncing, setIsSyncing] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // PAT input state
  const [showPatSection, setShowPatSection] = useState(false)
  const [patInput, setPatInput] = useState('')
  const [showPatValue, setShowPatValue] = useState(false)
  const [isSavingPat, setIsSavingPat] = useState(false)
  const [loggedInWithGitHub, setLoggedInWithGitHub] = useState(false)

  // Check for success/error from OAuth callback
  useEffect(() => {
    const connected = searchParams.get('github_connected')
    const error = searchParams.get('error')

    if (connected === 'true') {
      toast.success('GitHub connected successfully!', {
        description: 'You can now sync your toolkit to GitHub.'
      })
      // Clean up URL
      const url = new URL(window.location.href)
      url.searchParams.delete('github_connected')
      window.history.replaceState({}, '', url.toString())
    }

    if (error) {
      toast.error('GitHub connection failed', {
        description: decodeURIComponent(error)
      })
      // Clean up URL
      const url = new URL(window.location.href)
      url.searchParams.delete('error')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  // Load initial status and check if user logged in with GitHub
  useEffect(() => {
    async function loadStatus() {
      try {
        // Check if user logged in with GitHub
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const hasGitHubIdentity = user.identities?.some(
            (identity) => identity.provider === 'github'
          )
          setLoggedInWithGitHub(hasGitHubIdentity || false)
        }

        const syncStatus = await getGitHubSyncStatus()
        setStatus(syncStatus)
        if (syncStatus.repoName) {
          setRepoName(syncStatus.repoName)
        }
      } catch (error) {
        console.error('Failed to load GitHub status:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStatus()
  }, [])

  // Handle connect GitHub using linkIdentity to preserve session
  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const supabase = createClient()
      const baseUrl = window.location.origin
      const redirectTo = `${baseUrl}/auth/github-connect?next=${encodeURIComponent('/settings?tab=github')}`

      const { data, error } = await supabase.auth.linkIdentity({
        provider: 'github',
        options: {
          scopes: 'repo',
          redirectTo
        }
      })

      if (error) {
        // If identity is already linked, user signed in with GitHub originally
        // Using signInWithOAuth would replace their session (log them out)
        // Recommend PAT instead for users who signed in with GitHub
        if (error.message?.includes('already linked')) {
          toast.info('You signed in with GitHub. Please use a Personal Access Token to grant repo access.', {
            description: 'This avoids session conflicts with your GitHub login.',
            duration: 6000
          })
          setShowPatSection(true)
          setIsConnecting(false)
          return
        }
        throw error
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Failed to initiate GitHub connection:', error)
      toast.error('Failed to initiate GitHub connection')
      setIsConnecting(false)
    }
  }

  // Handle disconnect
  const handleDisconnect = async () => {
    startTransition(async () => {
      const result = await disconnectGitHub()
      if (result.success) {
        setStatus({ connected: false })
        toast.success('GitHub disconnected')
      } else {
        toast.error(result.error || 'Failed to disconnect')
      }
    })
  }

  // Handle repo name update
  const handleUpdateRepoName = async () => {
    if (!hasChanges) return

    startTransition(async () => {
      const result = await updateRepoName(repoName)
      if (result.success) {
        setHasChanges(false)
        toast.success('Repository name updated')
        // Refresh status
        const newStatus = await getGitHubSyncStatus()
        setStatus(newStatus)
      } else {
        toast.error(result.error || 'Failed to update repository name')
      }
    })
  }

  // Handle sync
  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const result = await syncToGitHub()
      if (result.success) {
        toast.success('Synced to GitHub!', {
          description: 'Your toolkit has been pushed to GitHub.',
          action: result.repoUrl ? {
            label: 'View Repository',
            onClick: () => window.open(result.repoUrl, '_blank')
          } : undefined
        })
        // Refresh status
        const newStatus = await getGitHubSyncStatus()
        setStatus(newStatus)
      } else {
        toast.error('Sync failed', {
          description: result.error
        })
      }
    } catch (error) {
      console.error('Sync error:', error)
      toast.error('Failed to sync')
    } finally {
      setIsSyncing(false)
    }
  }

  // Handle save PAT
  const handleSavePat = async () => {
    if (!patInput.trim()) {
      toast.error('Please enter a Personal Access Token')
      return
    }

    setIsSavingPat(true)
    try {
      const result = await savePersonalAccessToken(patInput.trim())
      if (result.success) {
        toast.success('Personal Access Token saved!', {
          description: `Connected as ${result.username}. You can now sync your toolkit.`
        })
        setPatInput('')
        setShowPatSection(false)
        // Refresh status
        const newStatus = await getGitHubSyncStatus()
        setStatus(newStatus)
      } else {
        toast.error('Failed to save token', {
          description: result.error
        })
      }
    } catch (error) {
      console.error('PAT save error:', error)
      toast.error('Failed to save Personal Access Token')
    } finally {
      setIsSavingPat(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="glass-dark border-primary/30">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="glass-dark border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#24292e]">
                <Github className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-primary">GitHub Sync</CardTitle>
                <CardDescription>
                  Sync your Claude Code toolkit to a GitHub repository
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={status?.connected ? 'default' : 'secondary'}
              className={cn(
                status?.connected && 'bg-green-500/20 text-green-400 border-green-500/50'
              )}
            >
              {status?.connected ? (
                <>
                  {status.connectionType === 'pat' ? (
                    <Key className="w-3 h-3 mr-1" />
                  ) : (
                    <Check className="w-3 h-3 mr-1" />
                  )}
                  {status.connectionType === 'pat' ? 'Connected via PAT' : 'Connected'}
                </>
              ) : (
                'Not Connected'
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!status?.connected ? (
            // Not connected state
            <div className="space-y-4">
              <div className="glass rounded-lg p-4 border border-border/50">
                <h4 className="font-medium mb-2">Why connect GitHub?</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Automatically sync your selected plugins to a repository</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Clone once, <code className="text-xs bg-muted px-1 rounded">git pull</code> to update</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Use your toolkit across all your projects</span>
                  </li>
                </ul>
              </div>

              {loggedInWithGitHub ? (
                // User logged in with GitHub - show PAT section directly
                <div className="space-y-4">
                  <div className="glass rounded-lg p-4 border border-blue-500/30 bg-blue-500/5">
                    <div className="flex items-start gap-3">
                      <Github className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-blue-400">You&apos;re signed in with GitHub</p>
                        <p className="text-xs text-muted-foreground">
                          To sync your toolkit, we need a Personal Access Token with repository permissions.
                          Your login doesn&apos;t include these permissions for security reasons.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // User logged in with email or other provider
                <>
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-full"
                  >
                    {isConnecting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Github className="w-4 h-4 mr-2" />
                    )}
                    Connect GitHub Account
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    We&apos;ll request access to create and update repositories on your behalf.
                  </p>
                </>
              )}

              {/* PAT Section - always available, auto-expanded for GitHub users */}
              <div className="pt-2">
                {!loggedInWithGitHub && (
                  <button
                    type="button"
                    onClick={() => setShowPatSection(!showPatSection)}
                    className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Key className="w-4 h-4" />
                    Or use a Personal Access Token
                    {showPatSection ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}

                <AnimatePresence>
                  {(showPatSection || loggedInWithGitHub) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-4 glass rounded-lg p-4 border border-border/50">
                        <div className="space-y-2">
                          <Label htmlFor="pat" className="text-sm">Personal Access Token</Label>
                          <div className="relative">
                            <Input
                              id="pat"
                              type={showPatValue ? 'text' : 'password'}
                              value={patInput}
                              onChange={(e) => setPatInput(e.target.value)}
                              placeholder="github_pat_..."
                              className="glass-dark border-primary/30 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPatValue(!showPatValue)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPatValue ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground space-y-2">
                          <p>
                            Create a{' '}
                            <a
                              href="https://github.com/settings/tokens?type=beta"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 underline hover:text-blue-300 inline-flex items-center gap-1"
                            >
                              fine-grained token
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            {' '}with these permissions:
                          </p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li><strong>Contents</strong> - Read and write</li>
                            <li><strong>Administration</strong> - Read and write (to create repos)</li>
                          </ul>
                        </div>

                        <Button
                          onClick={handleSavePat}
                          disabled={isSavingPat || !patInput.trim()}
                          className="w-full"
                          variant="secondary"
                        >
                          {isSavingPat ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Key className="w-4 h-4 mr-2" />
                          )}
                          Save Token
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            // Connected state
            <>
              {/* Sync Status */}
              {status.syncStatus && (
                <div className={cn(
                  'glass rounded-lg p-4 border',
                  status.syncStatus === 'synced' && 'border-green-500/50 bg-green-500/5',
                  status.syncStatus === 'error' && 'border-destructive/50 bg-destructive/5',
                  status.syncStatus === 'pending' && 'border-yellow-500/50 bg-yellow-500/5'
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {status.syncStatus === 'synced' && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                      {status.syncStatus === 'error' && (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      )}
                      {status.syncStatus === 'pending' && (
                        <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {status.syncStatus === 'synced' && 'Last sync successful'}
                          {status.syncStatus === 'error' && 'Sync failed'}
                          {status.syncStatus === 'pending' && 'Sync in progress...'}
                        </p>
                        {status.lastSyncedAt && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(status.lastSyncedAt).toLocaleString()}
                          </p>
                        )}
                        {status.syncError && (
                          <p className="text-xs text-destructive mt-1">
                            {status.syncError}
                          </p>
                        )}
                      </div>
                    </div>
                    {status.repoFullName && (
                      <a
                        href={`https://github.com/${status.repoFullName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View Repo
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              <Separator className="border-primary/20" />

              {/* Repository Settings */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repoName">Repository Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="repoName"
                      value={repoName}
                      onChange={(e) => {
                        setRepoName(e.target.value)
                        setHasChanges(e.target.value !== status.repoName)
                      }}
                      placeholder="my-gg-plugins"
                      className="glass-dark border-primary/30"
                    />
                    <AnimatePresence>
                      {hasChanges && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <Button
                            onClick={handleUpdateRepoName}
                            disabled={isPending}
                            size="sm"
                          >
                            {isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Save'
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The repository will be created at{' '}
                    <code className="bg-muted px-1 rounded">
                      github.com/your-username/{repoName}
                    </code>
                  </p>
                </div>
              </div>

              <Separator className="border-primary/20" />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="flex-1"
                >
                  {isSyncing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Sync Now
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="glass border-destructive/30 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Unlink className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-dark border-primary/30">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Disconnect GitHub?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove the connection to GitHub. Your repository and its
                        contents will not be deleted, but automatic syncing will stop.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="glass border-border">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDisconnect}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        Disconnect
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="glass-dark border-border/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            How it works
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>
            When you sync, GGPrompts pushes your enabled toolkit components to your GitHub repository
            in the <code className="bg-muted px-1 rounded">.claude/</code> folder structure that
            Claude Code expects.
          </p>
          <p>
            <strong>On your machine:</strong> Clone the repo once, then <code className="bg-muted px-1 rounded">git pull</code>{' '}
            whenever you update your toolkit on GGPrompts.
          </p>
          <p>
            <strong>In Claude Code:</strong> Point to your cloned repo and use{' '}
            <code className="bg-muted px-1 rounded">/plugin</code> to access your curated toolkit.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

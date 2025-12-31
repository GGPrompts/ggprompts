'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Github, Loader2, Check, AlertCircle, ExternalLink, Settings, AlertTriangle } from 'lucide-react'
import {
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  cn,
} from '@ggprompts/ui'
import { toast } from 'sonner'
import {
  getGitHubSyncStatus,
  syncToGitHub,
  GitHubSyncStatus
} from '@/app/claude-code/github-sync-actions'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface SyncToGitHubButtonProps {
  className?: string
  variant?: 'default' | 'outline'
}

export function SyncToGitHubButton({ className, variant = 'outline' }: SyncToGitHubButtonProps) {
  const router = useRouter()
  const [status, setStatus] = useState<GitHubSyncStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  // Load status on mount
  useEffect(() => {
    async function loadStatus() {
      try {
        const syncStatus = await getGitHubSyncStatus()
        setStatus(syncStatus)
      } catch (error) {
        console.error('Failed to load GitHub status:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStatus()
  }, [])

  // Handle connect using linkIdentity to preserve session
  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const supabase = createClient()
      const baseUrl = window.location.origin
      const redirectTo = `${baseUrl}/auth/github-connect?next=${encodeURIComponent('/claude-code/toolkit')}`

      const { data, error } = await supabase.auth.linkIdentity({
        provider: 'github',
        options: {
          scopes: 'repo',
          redirectTo
        }
      })

      if (error) {
        // If identity is already linked, try signInWithOAuth for the same account
        if (error.message?.includes('already linked')) {
          toast.info('GitHub already linked. Refreshing connection...')
          const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
              scopes: 'repo',
              redirectTo
            }
          })
          if (oauthError) throw oauthError
          if (oauthData.url) {
            window.location.href = oauthData.url
          }
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
        setShowDialog(false)
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

  if (isLoading) {
    return (
      <Button variant={variant} disabled className={className}>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Loading...
      </Button>
    )
  }

  // Not connected - show connect button
  if (!status?.connected) {
    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button variant={variant} className={className}>
            <Github className="h-4 w-4 mr-2" />
            Connect GitHub
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-dark border-primary/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              Connect GitHub
            </DialogTitle>
            <DialogDescription>
              Connect your GitHub account to sync your toolkit to a repository.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="glass rounded-lg p-4 border border-border/50">
              <h4 className="font-medium mb-2">What happens when you connect:</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>We&apos;ll create a <code className="text-xs bg-muted px-1 rounded">my-gg-plugins</code> repository</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Your enabled toolkit items will be synced</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Clone once, <code className="text-xs bg-muted px-1 rounded">git pull</code> to update</span>
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Github className="h-4 w-4 mr-2" />
              )}
              Connect GitHub
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Connected - show sync button with status
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant={variant} className={cn(className, 'gap-2')}>
          <Github className="h-4 w-4" />
          Sync to GitHub
          {status.syncStatus === 'synced' && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
              <Check className="w-3 h-3 mr-1" />
              Synced
            </Badge>
          )}
          {status.syncStatus === 'error' && (
            <Badge variant="secondary" className="bg-destructive/20 text-destructive text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Error
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-dark border-primary/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Sync to GitHub
          </DialogTitle>
          <DialogDescription>
            Push your enabled toolkit components to your GitHub repository.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Current status */}
          <div className={cn(
            'glass rounded-lg p-4 border',
            status.syncStatus === 'synced' && 'border-green-500/50 bg-green-500/5',
            status.syncStatus === 'error' && 'border-destructive/50 bg-destructive/5',
            !status.syncStatus && 'border-border/50'
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {status.syncStatus === 'synced' && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
                {status.syncStatus === 'error' && (
                  <AlertCircle className="w-5 h-5 text-destructive" />
                )}
                {!status.syncStatus && (
                  <Github className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-sm">
                    {status.repoFullName || 'Repository'}
                  </p>
                  {status.lastSyncedAt ? (
                    <p className="text-xs text-muted-foreground">
                      Last synced: {new Date(status.lastSyncedAt).toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Never synced
                    </p>
                  )}
                </div>
              </div>
              {status.repoFullName && (
                <a
                  href={`https://github.com/${status.repoFullName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  View
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            {status.syncError && (
              <p className="text-xs text-destructive mt-2">
                {status.syncError}
              </p>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            This will sync all your enabled toolkit items to the <code className="bg-muted px-1 rounded">.claude/</code> folder in your repository.
          </p>

          {/* Warning about overwriting */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="font-medium mb-1">Managed files will be overwritten</p>
              <p className="text-amber-200/80">
                Files synced from GGPrompts (skills, commands, agents, etc.) will be replaced on each sync.
                Manual edits to these files will be lost. Your other files are safe.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" asChild className="flex-1 sm:flex-none">
            <Link href="/settings?tab=github">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
          <Button onClick={handleSync} disabled={isSyncing} className="flex-1 sm:flex-none">
            {isSyncing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Github className="h-4 w-4 mr-2" />
            )}
            Sync Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@ggprompts/ui'
import { RefreshCw, Github, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { triggerPluginSync } from './actions'

export function SyncButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastSync, setLastSync] = useState<{ synced: number; time: Date } | null>(null)

  const handleSync = async () => {
    setIsLoading(true)
    try {
      const result = await triggerPluginSync()

      if (result.error) {
        toast.error(result.error)
      } else if (result.success) {
        toast.success(`Synced ${result.synced} components from repository`, {
          description: result.errors > 0 ? `${result.errors} errors occurred` : undefined
        })
        setLastSync({ synced: result.synced, time: new Date() })
      } else {
        toast.warning(`Sync completed with ${result.errors} errors`, {
          description: `${result.synced} components synced`
        })
        setLastSync({ synced: result.synced, time: new Date() })
      }
    } catch (error) {
      toast.error('Sync failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={isLoading}
        className="gap-2"
      >
        {isLoading ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Github className="h-4 w-4" />
        )}
        {isLoading ? 'Syncing...' : 'Sync from GitHub'}
      </Button>
      {lastSync && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>
            {lastSync.synced} synced at {lastSync.time.toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  )
}

'use client'

import { useTabzChrome } from '@/hooks'
import { Badge, Button } from '@ggprompts/ui'
import { Terminal, Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

export function TabzChromeStatus() {
  const { isAvailable, isChecking, lastChecked, checkAvailability } = useTabzChrome()

  return (
    <div className="inline-flex flex-col items-center gap-3">
      <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/30 border border-border/50">
        <Terminal className="h-5 w-5 text-muted-foreground" />

        {isChecking ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Checking TabzChrome...</span>
          </>
        ) : isAvailable ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400">TabzChrome Connected</span>
            <Badge variant="secondary" className="text-xs">
              Ready
            </Badge>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">TabzChrome Not Detected</span>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-1"
          onClick={() => checkAvailability()}
          disabled={isChecking}
        >
          <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>

      {!isAvailable && !isChecking && (
        <p className="text-xs text-muted-foreground max-w-sm">
          Start the TabzChrome backend on localhost:8129 to enable one-click terminal integration.
        </p>
      )}

      {lastChecked && (
        <p className="text-xs text-muted-foreground">
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}

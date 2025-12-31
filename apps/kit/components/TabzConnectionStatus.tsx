"use client"

import * as React from "react"
import { useTerminalExtension } from "@/hooks/useTerminalExtension"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { RefreshCw, Unplug, Plug2 } from "lucide-react"

interface TabzConnectionStatusProps {
  /** Show label text next to the indicator */
  showLabel?: boolean
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Additional CSS classes */
  className?: string
}

/**
 * TabzConnectionStatus - Shows green/red indicator for TabzChrome REST API connection
 *
 * Place this component in a header, status bar, or sidebar to show
 * real-time connection status with the TabzChrome backend at localhost:8129.
 *
 * Features:
 * - Visual indicator (green = connected, red = disconnected)
 * - Tooltip with connection details
 * - Click to refresh connection status
 *
 * Data attributes for TabzChrome bridge:
 * - data-tabz-bridge="true" - Indicates bridge-connected element
 * - data-tabz-action="status" - Indicates this is a status indicator
 */
export function TabzConnectionStatus({
  showLabel = false,
  size = "md",
  className = "",
}: TabzConnectionStatusProps) {
  const { backendRunning, authenticated, error, isLoaded, refreshStatus } = useTerminalExtension()
  const [isChecking, setIsChecking] = React.useState(false)

  // Determine connection status from terminal extension state
  const isConnected = backendRunning && authenticated

  const handleRefresh = React.useCallback(async () => {
    setIsChecking(true)
    await refreshStatus()
    setIsChecking(false)
  }, [refreshStatus])

  // Size classes
  const sizeClasses = {
    sm: {
      indicator: "h-2 w-2",
      icon: "h-3 w-3",
      text: "text-xs",
      button: "h-6 px-1.5",
    },
    md: {
      indicator: "h-2.5 w-2.5",
      icon: "h-4 w-4",
      text: "text-sm",
      button: "h-7 px-2",
    },
    lg: {
      indicator: "h-3 w-3",
      icon: "h-5 w-5",
      text: "text-base",
      button: "h-8 px-2.5",
    },
  }

  const classes = sizeClasses[size]

  // Status message based on state
  const getStatusMessage = () => {
    if (!isLoaded) return "Checking connection..."
    if (!backendRunning) return "Backend not running on localhost:8129"
    if (!authenticated) return "API token not configured or invalid"
    return "Connected to TabzChrome backend"
  }

  // Help text based on state
  const getHelpText = () => {
    if (!backendRunning) return "Start the TabzChrome backend server."
    if (!authenticated) return "Add your API token in Profile or Setup settings."
    return "Ready to spawn terminals and run commands."
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 ${classes.button} ${className}`}
            onClick={handleRefresh}
            disabled={isChecking}
            data-tabz-bridge="true"
            data-tabz-action="status"
          >
            {isChecking || !isLoaded ? (
              <RefreshCw className={`${classes.icon} animate-spin text-muted-foreground`} />
            ) : isConnected ? (
              <>
                <span
                  className={`${classes.indicator} rounded-full bg-emerald-500 shadow-[0_0_6px_2px_rgba(16,185,129,0.4)]`}
                  aria-label="Connected"
                />
                {showLabel && (
                  <span className={`${classes.text} text-emerald-500`}>TabzChrome</span>
                )}
              </>
            ) : (
              <>
                <span
                  className={`${classes.indicator} rounded-full bg-red-500/70`}
                  aria-label="Disconnected"
                />
                {showLabel && (
                  <span className={`${classes.text} text-muted-foreground`}>TabzChrome</span>
                )}
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className="max-w-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <Plug2 className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium text-emerald-500">TabzChrome Connected</span>
                </>
              ) : (
                <>
                  <Unplug className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-red-500">TabzChrome Disconnected</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{getStatusMessage()}</p>
            <p className="text-xs text-muted-foreground">{getHelpText()}</p>
            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}
            <p className="text-xs text-muted-foreground/70 italic">Click to refresh status</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

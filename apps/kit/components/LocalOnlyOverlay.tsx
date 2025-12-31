"use client"

import { useState } from "react"
import { AlertTriangle, Copy, Check, Terminal, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LocalOnlyOverlayProps {
  sectionName: string
  description?: string
}

export function LocalOnlyOverlay({ sectionName, description }: LocalOnlyOverlayProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const commands = [
    { key: "cd", text: "cd ~/projects/personal-homepage", label: "Navigate to project" },
    { key: "run", text: "npm run dev", label: "Start dev server" },
  ]

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="glass rounded-xl p-8 max-w-lg w-full text-center">
        <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-amber-500" />
        </div>

        <h2 className="text-2xl font-bold mb-2">{sectionName}</h2>
        <p className="text-muted-foreground mb-6">
          {description || "This feature requires localhost to function."}
        </p>

        <div className="glass-dark rounded-lg p-4 mb-6 text-left">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <Terminal className="h-4 w-4" />
            <span>Run locally:</span>
          </div>

          <div className="space-y-2">
            {commands.map((cmd) => (
              <div
                key={cmd.key}
                className="flex items-center gap-2 bg-background/50 rounded-md overflow-hidden"
              >
                <code className="flex-1 px-3 py-2 text-sm font-mono text-foreground">
                  {cmd.text}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(cmd.text, cmd.key)}
                  className="h-full px-3 rounded-none border-l border-border/20 hover:bg-primary/10"
                >
                  {copied === cmd.key ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="mb-2">
            This section uses Node.js APIs that aren&apos;t available in serverless environments.
          </p>
          <p className="text-xs">
            Features like file system access, CLI execution, and local project scanning require a local development server.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Small badge component for sidebar navigation items
 */
export function LocalOnlyBadge({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500" />
    )
  }

  return (
    <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded flex-shrink-0">
      Local
    </span>
  )
}

/**
 * Environment badge for sidebar header
 */
export function EnvironmentBadge({
  isLocal,
  collapsed = false,
}: {
  isLocal: boolean
  collapsed?: boolean
}) {
  if (collapsed) {
    return (
      <span
        className={`h-2 w-2 rounded-full ${
          isLocal ? "bg-emerald-500" : "bg-blue-500"
        }`}
        title={isLocal ? "Running locally" : "Deployed"}
      />
    )
  }

  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${
        isLocal
          ? "bg-emerald-500/20 text-emerald-500"
          : "bg-blue-500/20 text-blue-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isLocal ? "bg-emerald-500" : "bg-blue-500"
        }`}
      />
      {isLocal ? "Local" : "Deployed"}
    </span>
  )
}

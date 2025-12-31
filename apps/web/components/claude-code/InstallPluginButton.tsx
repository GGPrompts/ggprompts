'use client'

import { useState } from 'react'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Tooltip, TooltipContent, TooltipTrigger } from '@ggprompts/ui'
import { Terminal, Copy, Check, Loader2 } from 'lucide-react'
import { useTabzChrome, type PluginScope } from '@ggprompts/tabz'
import { toast } from 'sonner'

interface InstallPluginButtonProps {
  slug: string
  marketplace?: string
  defaultScope?: PluginScope
  className?: string
}

const SCOPE_OPTIONS: { value: PluginScope; label: string; description: string }[] = [
  { value: 'user', label: 'User', description: 'Available everywhere' },
  { value: 'project', label: 'Project', description: 'Shared with team' },
  { value: 'local', label: 'Local', description: 'This project only' },
]

export function InstallPluginButton({
  slug,
  marketplace = 'GGPrompts/my-gg-plugins',
  defaultScope = 'user',
  className,
}: InstallPluginButtonProps) {
  const { isAvailable, installPlugin } = useTabzChrome()
  const [installing, setInstalling] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedScope, setSelectedScope] = useState<PluginScope>(defaultScope)

  // Extract marketplace name for display
  const marketplaceName = marketplace.includes('/') ? marketplace.split('/').pop() : marketplace

  const handleInstall = async (scope: PluginScope) => {
    setInstalling(true)
    try {
      const success = await installPlugin({ slug, marketplace, scope })
      if (success) {
        toast.success('Install command sent to Claude Code', {
          description: `Installing ${slug} with ${scope} scope`,
        })
      } else {
        toast.error('Failed to send command', {
          description: 'Make sure TabzChrome is running and connected',
        })
      }
    } catch (error) {
      console.error('Install error:', error)
      toast.error('Failed to install plugin')
    } finally {
      setInstalling(false)
    }
  }

  const handleCopy = async () => {
    const command = `/plugin install ${slug}@${marketplaceName} --scope ${selectedScope}`
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      toast.success('Command copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy command')
    }
  }

  // If TabzChrome is available, show install dropdown
  if (isAvailable) {
    return (
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={installing}
                className={`h-7 w-7 p-0 ${className || ''}`}
              >
                {installing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Terminal className="h-3.5 w-3.5" />
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Install to Claude Code</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Install Scope</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SCOPE_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => {
                setSelectedScope(option.value)
                handleInstall(option.value)
              }}
            >
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="h-3 w-3 mr-2" />
            Copy command
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Fallback: Copy command button when TabzChrome is not available
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className={`h-7 w-7 p-0 ${className || ''}`}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy install command</TooltipContent>
    </Tooltip>
  )
}

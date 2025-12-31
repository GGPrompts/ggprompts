'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Terminal, Check, Copy, ChevronDown } from 'lucide-react'
import { useTabzChrome } from '@/hooks'
import { toast } from 'sonner'

interface SendToTerminalButtonProps {
  content: string
  title?: string
  workingDir?: string
  variant?: 'icon' | 'button' | 'dropdown'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  onSent?: () => void
}

export function SendToTerminalButton({
  content,
  title: _title = 'GGPrompts',
  workingDir: _workingDir,
  variant = 'icon',
  size = 'default',
  className = '',
  onSent,
}: SendToTerminalButtonProps) {
  const { isAvailable, queueToChat } = useTabzChrome()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  // Unused but kept for backwards compatibility
  void _title
  void _workingDir

  const handleSendToTerminal = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      setSending(true)

      // Try WebSocket API (works from any site - browsers allow HTTPS→localhost)
      if (isAvailable) {
        const success = await queueToChat(content)

        if (success) {
          setSent(true)
          toast.success('Queued to chat!', {
            description: 'Prompt added to TabzChrome chat bar',
          })
          onSent?.()
          setTimeout(() => setSent(false), 2000)
          setSending(false)
          return
        }
      }

      // Fallback for localhost without backend: copy to clipboard
      try {
        await navigator.clipboard.writeText(content)
        setSent(true)
        toast.success('Copied to clipboard!', {
          description: 'TabzChrome backend not running - prompt copied instead',
        })
        onSent?.()
        setTimeout(() => setSent(false), 2000)
      } catch (error) {
        console.error('Failed to copy:', error)
        toast.error('Failed to copy prompt')
      }

      setSending(false)
    },
    [content, isAvailable, queueToChat, onSent]
  )

  const handleCopyOnly = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()

      try {
        await navigator.clipboard.writeText(content)
        setSent(true)
        toast.success('Prompt copied to clipboard!')
        setTimeout(() => setSent(false), 2000)
      } catch (error) {
        console.error('Failed to copy:', error)
        toast.error('Failed to copy prompt')
      }
    },
    [content]
  )

  // Icon-only button (for card view)
  // data-terminal-command allows TabzChrome extension to handle clicks on remote sites
  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${className}`}
              onClick={handleSendToTerminal}
              disabled={sending}
              data-terminal-command={content}
            >
              {sent ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Terminal className="h-4 w-4" />
              )}
              <span className="sr-only">Send to terminal</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isAvailable ? 'Send to Terminal' : 'Copy to clipboard'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Dropdown with options (for detail view)
  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className={`gap-2 ${className}`}
            disabled={sending}
            data-terminal-command={content}
          >
            {sent ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Terminal className="h-4 w-4" />
            )}
            Send to Terminal
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleSendToTerminal} data-terminal-command={content}>
            <Terminal className="h-4 w-4 mr-2" />
            {isAvailable ? 'Send to Terminal' : 'Copy to clipboard'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyOnly}>
            <Copy className="h-4 w-4 mr-2" />
            Copy prompt only
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Regular button
  return (
    <Button
      variant="outline"
      size={size}
      className={`gap-2 ${className}`}
      onClick={handleSendToTerminal}
      disabled={sending}
      data-terminal-command={content}
    >
      {sent ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Terminal className="h-4 w-4" />
      )}
      {isAvailable ? 'Send to Terminal' : 'Copy to Clipboard'}
    </Button>
  )
}

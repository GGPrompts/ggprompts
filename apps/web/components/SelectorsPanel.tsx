'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Copy, Check, Hash, TextCursorInput, List, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface Selector {
  id: string
  description: string
  type?: 'button' | 'input' | 'select' | 'container'
}

export interface SelectorsPanelProps {
  selectors: Selector[]
  pageTitle?: string
}

const typeIcons = {
  button: Square,
  input: TextCursorInput,
  select: List,
  container: Hash,
}

const STORAGE_KEY = 'selectors-panel-collapsed'

export function SelectorsPanel({ selectors, pageTitle }: SelectorsPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      setIsCollapsed(stored === 'true')
    }
  }, [])

  // Save collapsed state to localStorage
  const toggleCollapsed = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem(STORAGE_KEY, String(newState))
  }

  const copyToClipboard = async (selector: string) => {
    try {
      await navigator.clipboard.writeText(selector)
      setCopiedId(selector)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy selector:', err)
    }
  }

  const getIcon = (type?: Selector['type']) => {
    const IconComponent = type ? typeIcons[type] : Hash
    return IconComponent
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-72 glass rounded-lg shadow-lg transition-all duration-300 ease-in-out"
      data-testid="selectors-panel"
    >
      {/* Header */}
      <button
        onClick={toggleCollapsed}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-primary/5 rounded-t-lg transition-colors"
        data-testid="selectors-panel-toggle"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <span className="font-medium text-foreground">
            {pageTitle ? `${pageTitle} Selectors` : 'Selectors'}
          </span>
        </div>
        {isCollapsed ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? 'max-h-0' : 'max-h-80'
        }`}
      >
        <div className="border-t border-border/50 overflow-y-auto max-h-72 p-2 space-y-1">
          {selectors.map((selector) => {
            const Icon = getIcon(selector.type)
            const isCopied = copiedId === selector.id

            return (
              <Tooltip key={selector.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => copyToClipboard(selector.id)}
                    className="w-full text-left p-2 rounded-md hover:bg-primary/10 transition-colors group"
                    data-testid={`selector-item-${selector.id.replace('#', '').replace(/[[\]]/g, '-')}`}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-primary truncate">
                            {selector.id}
                          </code>
                          {isCopied ? (
                            <Check className="h-3 w-3 text-green-500 shrink-0" />
                          ) : (
                            <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {selector.description}
                        </p>
                      </div>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{isCopied ? 'Copied!' : 'Click to copy'}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}

          {selectors.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No selectors defined
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

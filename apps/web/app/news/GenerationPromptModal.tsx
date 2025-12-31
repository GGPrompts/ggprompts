'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Badge,
  Button,
} from '@ggprompts/ui'
import {
  Copy,
  Check,
  FileCode,
  Maximize2,
  Minimize2,
  Github,
  ExternalLink,
  Loader2,
  Terminal,
  Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import { MarkdownContent } from '@/components/claude-code/MarkdownContent'
import { getGenerateNewsPrompt } from './actions'

interface GenerationPromptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  modelUsed: string
  generatedAt: string
  promptGistUrl: string
}

export function GenerationPromptModal({
  open,
  onOpenChange,
  modelUsed,
  generatedAt,
  promptGistUrl,
}: GenerationPromptModalProps) {
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [promptContent, setPromptContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch the prompt content when modal opens
  useEffect(() => {
    if (open && !promptContent) {
      setLoading(true)
      getGenerateNewsPrompt()
        .then(setPromptContent)
        .finally(() => setLoading(false))
    }
  }, [open, promptContent])

  const copyContent = async () => {
    if (!promptContent) return
    await navigator.clipboard.writeText(promptContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied to clipboard!')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl w-[95vw] h-[90vh] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
        accessibleTitle="How This Page Was Made"
      >
        {/* Header */}
        <DialogHeader className={`px-6 py-4 border-b border-border/50 shrink-0 transition-all duration-200 ${isExpanded ? 'py-3' : ''}`}>
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileCode className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl flex items-center gap-2">
                  How This Page Was Made
                </DialogTitle>
                {!isExpanded && (
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">Slash Command</Badge>
                    <span className="flex items-center gap-1">
                      <Terminal className="h-3 w-3" />
                      /generate-news
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {!isExpanded && (
            <DialogDescription className="text-left pt-2">
              This AI news digest was generated using a Claude Code slash command that gathers data from multiple sources and curates it for prompt engineers.
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Generation Info Bar */}
        <div className="px-6 py-3 bg-muted/20 border-b border-border/30 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Model:</span>
            <Badge variant="secondary" className="font-mono text-xs">
              {modelUsed}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Generated:</span>
            <span>{new Date(generatedAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {/* Content Label + Actions */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Generation Prompt
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Collapse' : 'Expand content area'}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={copyContent}
                  disabled={!promptContent}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Prompt Content */}
            <div className="glass rounded-lg border border-border/50 overflow-hidden">
              <div className="p-4 overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : promptContent ? (
                  <MarkdownContent content={promptContent} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="mb-4">Unable to load prompt content.</p>
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={promptGistUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <Github className="h-4 w-4" />
                        View on GitHub Gist
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/50 shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Want to use this prompt for your own news digest?
            </p>
            <Button asChild variant="default" size="sm">
              <a
                href={promptGistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Github className="h-4 w-4" />
                Fork the Prompt
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  FileText,
  Sparkles,
  Command,
  Bot,
  Github,
  ExternalLink,
  FolderOpen,
  Webhook,
  Plug,
  Pencil,
  X,
  Save,
  Loader2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { ComponentType } from '@/lib/types'
import { RepoComponent, fetchFileContent, updateComponentFile } from '@/app/claude-code/github-sync-actions'
import { MarkdownContent } from '@/components/claude-code/MarkdownContent'

interface RepoComponentModalProps {
  component: RepoComponent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  repoFullName?: string
}

const typeConfig: Record<ComponentType, { icon: React.ElementType; color: string; label: string; path: string }> = {
  skill: { icon: Sparkles, color: 'text-purple-500', label: 'Skill', path: 'skills' },
  command: { icon: Command, color: 'text-green-500', label: 'Command', path: 'commands' },
  agent: { icon: Bot, color: 'text-blue-500', label: 'Agent', path: 'agents' },
  hook: { icon: Webhook, color: 'text-orange-500', label: 'Hook', path: 'hooks' },
  mcp: { icon: Plug, color: 'text-cyan-500', label: 'MCP', path: 'mcps' },
}

// Get file path for a component
function getFilePath(type: ComponentType, slug: string): string {
  const basePath = typeConfig[type].path
  if (type === 'skill') {
    return `${basePath}/${slug}/SKILL.md`
  }
  return `${basePath}/${slug}.md`
}

export function RepoComponentModal({
  component,
  open,
  onOpenChange,
  repoFullName,
}: RepoComponentModalProps) {
  const [content, setContent] = useState<string>('')
  const [editContent, setEditContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [copied, setCopied] = useState(false)

  // Fetch content when modal opens
  useEffect(() => {
    if (open && component && repoFullName) {
      fetchContent()
    }
    if (!open) {
      setContent('')
      setEditContent('')
      setEditMode(false)
      setError(null)
    }
  }, [open, component, repoFullName])

  const fetchContent = async () => {
    if (!component) return

    setLoading(true)
    setError(null)

    try {
      const filePath = getFilePath(component.type, component.slug)
      const result = await fetchFileContent(filePath)

      if (result.success && result.content) {
        setContent(result.content)
      } else {
        setError(result.error || 'Failed to fetch content')
      }
    } catch (err) {
      setError('Failed to fetch content')
    } finally {
      setLoading(false)
    }
  }

  const handleEnterEditMode = () => {
    setEditContent(content)
    setEditMode(true)
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setEditContent('')
    setError(null)
  }

  const handleSave = async () => {
    if (!component || !repoFullName) return

    setSaving(true)
    setError(null)

    try {
      const filePath = getFilePath(component.type, component.slug)

      const result = await updateComponentFile(
        filePath,
        editContent,
        `Update ${component.name} from GGPrompts`
      )

      if (result.success) {
        toast.success('Changes saved to GitHub!', {
          description: result.commitUrl ? 'View commit on GitHub' : undefined,
          action: result.commitUrl ? {
            label: 'View',
            onClick: () => window.open(result.commitUrl, '_blank')
          } : undefined
        })
        setContent(editContent)
        setEditMode(false)
        setEditContent('')
      } else {
        throw new Error(result.error || 'Failed to save')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save changes'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = async () => {
    const textToCopy = editMode ? editContent : content
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied to clipboard!')
  }

  if (!component) return null

  const config = typeConfig[component.type]
  const Icon = config.icon
  const filePath = getFilePath(component.type, component.slug)
  const githubUrl = repoFullName
    ? `https://github.com/${repoFullName}/blob/main/${filePath}`
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl w-[95vw] h-[85vh] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden"
        accessibleTitle={component.name}
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/50 shrink-0">
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className={`h-6 w-6 ${config.color}`} />
              </div>
              <div>
                <DialogTitle className="text-xl flex items-center gap-2">
                  {component.type === 'command' ? `/${component.slug}` : component.name}
                  {component.source === 'ggprompts' ? (
                    <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                      GGPrompts
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Your file
                    </Badge>
                  )}
                  {editMode && (
                    <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                      Editing
                    </Badge>
                  )}
                </DialogTitle>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">{config.label}</Badge>
                </div>
              </div>
            </div>
          </div>
          <DialogDescription className="text-left pt-2 font-mono text-xs">
            {filePath}
          </DialogDescription>
        </DialogHeader>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {/* GitHub Link */}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-lg p-4 border border-border/50 flex items-center gap-3 hover:border-primary/50 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-[#24292e]">
                  <Github className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-medium text-primary group-hover:underline">
                    <FolderOpen className="h-4 w-4" />
                    View on GitHub
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {repoFullName}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            )}

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions bar */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {editMode ? 'Edit Content' : 'Content'}
              </span>
              <div className="flex items-center gap-2">
                {!editMode && !loading && content && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={handleEnterEditMode}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={handleCopy}
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
                  </>
                )}

                {editMode && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={handleCancelEdit}
                      disabled={saving}
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-2"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save to GitHub
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Content area */}
            <div className="glass rounded-lg border border-border/50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-mono text-sm">{filePath.split('/').pop()}</span>
                </div>
              </div>

              <div className="p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading content...</span>
                  </div>
                ) : error && !content ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Failed to load content</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={fetchContent}
                    >
                      Retry
                    </Button>
                  </div>
                ) : editMode ? (
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="font-mono text-sm min-h-[400px] resize-none bg-muted/20"
                    placeholder="Enter content..."
                  />
                ) : (
                  <MarkdownContent content={content} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/50 shrink-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {component.source === 'ggprompts'
                ? 'Managed by GGPrompts - edits will be overwritten on next sync'
                : 'Your custom file - edits are saved directly to your repo'}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

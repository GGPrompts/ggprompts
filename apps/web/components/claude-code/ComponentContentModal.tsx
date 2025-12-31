'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Badge, Button, Textarea } from '@ggprompts/ui'
import {
  Copy,
  Check,
  FileText,
  Maximize2,
  Minimize2,
  Download,
  Star,
  User,
  Clock,
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
} from 'lucide-react'
import { toast } from 'sonner'
import type { Component, ComponentType } from '@/lib/types'
import { MarkdownContent } from './MarkdownContent'
import { fetchFileContent, updateComponentFile } from '@/app/claude-code/github-sync-actions'

interface ComponentContentModalProps {
  component: Component | null
  open: boolean
  onOpenChange: (open: boolean) => void
  editable?: boolean
  repoFullName?: string
  typePath?: string
}

const typeConfig: Record<ComponentType, { icon: React.ElementType; color: string; label: string }> = {
  skill: { icon: Sparkles, color: 'text-purple-500', label: 'Skill' },
  command: { icon: Command, color: 'text-green-500', label: 'Command' },
  agent: { icon: Bot, color: 'text-blue-500', label: 'Agent' },
  hook: { icon: Webhook, color: 'text-orange-500', label: 'Hook' },
  mcp: { icon: Plug, color: 'text-cyan-500', label: 'MCP' },
}

// Check if content is a placeholder that should show GitHub link instead
function isPlaceholderContent(content: string): boolean {
  const placeholders = [
    'see source',
    'view source',
    'see github',
    'full content',
    'check source',
  ]
  const lower = content.toLowerCase().trim()
  return placeholders.some(p => lower.includes(p)) && content.length < 200
}

// Get file path in the synced repo for a component
function getComponentFilePath(type: ComponentType, slug: string, typePath: string): string {
  if (type === 'skill') {
    return `${typePath}/${slug}/SKILL.md`
  }
  return `${typePath}/${slug}.md`
}

export function ComponentContentModal({
  component,
  open,
  onOpenChange,
  editable = false,
  repoFullName,
  typePath,
}: ComponentContentModalProps) {
  const [copied, setCopied] = useState(false)
  const [copiedFile, setCopiedFile] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Edit mode state
  const [editMode, setEditMode] = useState(false)
  const [editContent, setEditContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset edit mode when modal closes
  useEffect(() => {
    if (!open) {
      setEditMode(false)
      setEditContent({})
      setError(null)
    }
  }, [open])

  if (!component) return null

  const config = typeConfig[component.type]
  const Icon = config.icon
  const files = component.files || []

  const copyContent = async (content: string, fileName?: string) => {
    await navigator.clipboard.writeText(content)
    if (fileName) {
      setCopiedFile(fileName)
      setTimeout(() => setCopiedFile(null), 2000)
    } else {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    toast.success('Copied to clipboard!')
  }

  const copyAllContent = async () => {
    const allContent = files
      .filter(f => f.path)
      .map(f => `# ${f.path}\n\n${editMode ? (editContent[f.path] || f.content) : f.content || ''}`)
      .join('\n\n---\n\n')
    await copyContent(allContent)
  }

  // Enter edit mode - fetch fresh content from GitHub
  const handleEnterEditMode = async () => {
    if (!typePath) return

    setLoading(true)
    setError(null)

    try {
      // For now, use a single main file path
      const filePath = getComponentFilePath(component.type, component.slug, typePath)
      const result = await fetchFileContent(filePath)

      if (result.success && result.content) {
        setEditContent({ [filePath]: result.content })
        setEditMode(true)
      } else {
        // Fall back to component files if GitHub fetch fails
        const initialContent: Record<string, string> = {}
        files.forEach(f => {
          if (f.path && f.content) {
            initialContent[f.path] = f.content
          }
        })
        setEditContent(initialContent)
        setEditMode(true)
        if (result.error) {
          toast.info('Using cached content - GitHub fetch failed')
        }
      }
    } catch (err) {
      setError('Failed to load content for editing')
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditMode(false)
    setEditContent({})
    setError(null)
  }

  // Save changes to GitHub
  const handleSave = async () => {
    if (!typePath || !repoFullName) return

    setSaving(true)
    setError(null)

    try {
      // Get the file path
      const filePath = getComponentFilePath(component.type, component.slug, typePath)
      const content = editContent[filePath]

      if (!content) {
        throw new Error('No content to save')
      }

      const result = await updateComponentFile(
        filePath,
        content,
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
        setEditMode(false)
        setEditContent({})
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

  // Get GitHub URL for viewing the file
  const getGitHubViewUrl = () => {
    if (!repoFullName || !typePath) return null
    const filePath = getComponentFilePath(component.type, component.slug, typePath)
    return `https://github.com/${repoFullName}/blob/main/${filePath}`
  }

  const githubViewUrl = getGitHubViewUrl()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl w-[95vw] h-[90vh] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
        accessibleTitle={component.name}
      >
        {/* Header */}
        <DialogHeader className={`px-6 py-4 border-b border-border/50 shrink-0 transition-all duration-200 ${isExpanded ? 'py-3' : ''}`}>
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-primary/10`}>
                <Icon className={`h-6 w-6 ${config.color}`} />
              </div>
              <div>
                <DialogTitle className="text-xl flex items-center gap-2">
                  {component.type === 'command' ? `/${component.slug}` : component.name}
                  {component.is_official && (
                    <Badge variant="secondary" className="text-xs">Official</Badge>
                  )}
                  {editMode && (
                    <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                      Editing
                    </Badge>
                  )}
                </DialogTitle>
                {!isExpanded && (
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">{config.label}</Badge>
                    </span>
                    <span>v{component.version}</span>
                    {component.author_name && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {component.author_name}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {!isExpanded && component.description && (
            <DialogDescription className="text-left pt-2">
              {component.description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Main Content */}
        <div className={`flex-1 overflow-y-auto px-6 py-4 ${editMode ? 'flex flex-col' : ''}`}>
          <div className={editMode ? 'flex flex-col flex-1 gap-4' : 'space-y-4'}>
            {/* GitHub Link - show link to user's repo when editable */}
            {editable && githubViewUrl && (
              <a
                href={githubViewUrl}
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
                    View in your GitHub repo
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {repoFullName}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            )}

            {/* Fallback to source URL when not editable */}
            {!editable && component.source_url && (
              <a
                href={component.source_url}
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
                    View full source on GitHub
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Browse all files, folder structure, and version history
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

            {/* Content Label + Actions */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {editMode ? 'Edit Content' : (files.length === 1 ? 'Content' : `Files (${files.length})`)}
              </span>
              <div className="flex items-center gap-2">
                {/* Edit/Save/Cancel buttons */}
                {editable && !editMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleEnterEditMode}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </>
                    )}
                  </Button>
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

                {!editMode && (
                  <>
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
                      onClick={copyAllContent}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy All
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Edit Mode Content */}
            {editMode && typePath && (
              <div className="glass rounded-lg border border-border/50 overflow-hidden flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/30 shrink-0">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-mono text-sm">
                      {getComponentFilePath(component.type, component.slug, typePath)}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col min-h-0">
                  <Textarea
                    value={editContent[getComponentFilePath(component.type, component.slug, typePath)] || ''}
                    onChange={(e) => setEditContent({
                      ...editContent,
                      [getComponentFilePath(component.type, component.slug, typePath)]: e.target.value
                    })}
                    className="font-mono text-sm flex-1 resize-none bg-muted/20"
                    placeholder="Loading content..."
                  />
                </div>
              </div>
            )}

            {/* View Mode Content */}
            {!editMode && files.filter(file => file.path).map((file) => {
              const isMarkdown = file.path?.endsWith('.md') ?? false
              const isPlaceholder = isPlaceholderContent(file.content || '')

              return (
                <div key={file.path} className="glass rounded-lg border border-border/50 overflow-hidden">
                  {/* File Header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/30">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-mono text-sm">{file.path}</span>
                    </div>
                    {!isPlaceholder && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1"
                        onClick={() => copyContent(file.content, file.path)}
                      >
                        {copiedFile === file.path ? (
                          <>
                            <Check className="h-3 w-3 text-green-500" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* File Content */}
                  <div className="p-4 overflow-x-auto">
                    {isPlaceholder && component.source_url ? (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-4">
                          Full content available on GitHub
                        </p>
                        <Button asChild variant="outline" size="sm">
                          <a
                            href={component.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            <Github className="h-4 w-4" />
                            View on GitHub
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    ) : isMarkdown ? (
                      <MarkdownContent content={file.content} />
                    ) : (
                      <pre className="font-mono text-sm whitespace-pre-wrap break-words text-foreground leading-relaxed bg-muted/20 rounded-lg p-4">
                        {file.content}
                      </pre>
                    )}
                  </div>
                </div>
              )
            })}

            {!editMode && files.length === 0 && (
              <div className="glass rounded-lg p-8 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">No inline content available for this component.</p>
                {component.source_url && (
                  <Button asChild variant="outline">
                    <a
                      href={component.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      <Github className="h-4 w-4" />
                      View source on GitHub
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Stats */}
        <div className="px-6 py-4 border-t border-border/50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {component.rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  {component.rating.toFixed(1)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                {component.downloads} downloads
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(component.created_at).toLocaleDateString()}
              </span>
            </div>

            {component.tags && component.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {component.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

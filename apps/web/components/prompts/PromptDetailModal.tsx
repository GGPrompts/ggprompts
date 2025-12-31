'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Badge, Avatar, AvatarFallback, AvatarImage, Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ggprompts/ui'
import {
  Heart,
  Copy,
  Check,
  Calendar,
  Bookmark,
  FileText,
  Edit2,
  X,
  Save,
  User,
  Loader2,
  Maximize2,
  Minimize2,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Prompt } from '@/lib/types'
import { isTemplate, parseTemplate } from '@/lib/prompt-template'
import { PromptTemplateRenderer } from './PromptTemplateRenderer'
import { usePromptInteractions } from '@/hooks/usePromptInteractions'
import { useAuth } from '@/hooks/useAuth'
import { useUserRole } from '@/hooks/useUserRole'
import { generateDiceBearAvatar, getInitials } from '@/lib/avatar'
import { updatePrompt, deletePrompt } from '@/lib/database/prompts'
import { CATEGORIES } from '@/lib/constants/categories'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ggprompts/ui'
import { SendToTerminalButton } from './SendToTerminalButton'

interface PromptDetailModalProps {
  prompt: Prompt | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: (updatedPrompt: Prompt) => void
  onDelete?: (promptId: string) => void
}

export function PromptDetailModal({
  prompt,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: PromptDetailModalProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { isAdmin } = useUserRole()
  const [copied, setCopied] = useState(false)
  const [filledContent, setFilledContent] = useState<string>('')
  const [editMode, setEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const copyButtonRef = useRef<HTMLButtonElement>(null)

  // Edit state
  const [editedTitle, setEditedTitle] = useState('')
  const [editedContent, setEditedContent] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [editedCategory, setEditedCategory] = useState('')
  const [editedTags, setEditedTags] = useState('')

  // Check if current user owns this prompt
  const isOwner = useMemo(() => {
    if (!user || !prompt) return false
    return user.id === prompt.user_id
  }, [user, prompt])

  // Check if current user can edit (owner or admin)
  const canEdit = useMemo(() => {
    if (!user || !prompt) return false
    return isOwner || isAdmin
  }, [user, prompt, isOwner, isAdmin])

  // Use the interactions hook
  const {
    isLiked,
    isBookmarked,
    likeCount,
    usageCount,
    handleLike,
    handleBookmark,
    handleCopy,
    isAuthenticated,
    loading: interactionsLoading,
  } = usePromptInteractions({
    promptId: prompt?.id || '',
    initialLikeCount: prompt?.like_count || 0,
    initialUsageCount: prompt?.usage_count || 0,
  })

  // Reset edit state when prompt changes
  useEffect(() => {
    if (prompt) {
      setEditedTitle(prompt.title)
      setEditedContent(prompt.content)
      setEditedDescription(prompt.description || '')
      setEditedCategory(prompt.category || '')
      setEditedTags(prompt.tags?.join(', ') || '')
    }
  }, [prompt])

  // Reset edit mode and expanded state when modal closes
  useEffect(() => {
    if (!open) {
      setEditMode(false)
      setIsExpanded(false)
    }
  }, [open])

  // Check if this prompt is a template
  const promptIsTemplate = useMemo(() => {
    if (!prompt) return false
    return prompt.is_template || isTemplate(prompt.content)
  }, [prompt])

  // Get template field count for display
  const fieldCount = useMemo(() => {
    if (!prompt || !promptIsTemplate) return 0
    const parsed = parseTemplate(prompt.content)
    return parsed.fields.length
  }, [prompt, promptIsTemplate])

  // Handle filled content updates from template renderer
  const handleFilledContentChange = useCallback((content: string) => {
    setFilledContent(content)
  }, [])

  // Get the content to copy (filled content for templates, raw content otherwise)
  const getContentToCopy = useCallback(() => {
    if (!prompt) return ''
    if (promptIsTemplate && filledContent) {
      return filledContent
    }
    return prompt.content
  }, [prompt, promptIsTemplate, filledContent])

  if (!prompt) return null

  const onCopy = async () => {
    const contentToCopy = getContentToCopy()
    const success = await handleCopy(contentToCopy)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const onLikeClick = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    await handleLike()
  }

  const onBookmarkClick = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    await handleBookmark()
  }

  const handleSave = async () => {
    if (!prompt || !user) return

    if (!editedTitle.trim() || !editedContent.trim()) {
      toast.error('Title and content are required')
      return
    }

    if (!editedCategory) {
      toast.error('Please select a category')
      return
    }

    setIsSaving(true)

    // Parse tags from comma-separated string
    const tags = editedTags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    try {
      const updatedPrompt = await updatePrompt(prompt.id, {
        title: editedTitle.trim(),
        content: editedContent.trim(),
        description: editedDescription.trim() || null,
        category: editedCategory,
        tags,
      }, user.id, isAdmin)

      toast.success('Prompt updated successfully!')

      if (onUpdate) {
        onUpdate(updatedPrompt)
      }
      setEditMode(false)
    } catch (error) {
      console.error('Failed to update prompt:', error)
      toast.error('Failed to update prompt. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!prompt || !user) return

    setIsDeleting(true)

    try {
      await deletePrompt(prompt.id, user.id, isAdmin)
      toast.success('Prompt deleted successfully!')
      setShowDeleteConfirm(false)
      onOpenChange(false)
      if (onDelete) {
        onDelete(prompt.id)
      }
    } catch (error) {
      console.error('Failed to delete prompt:', error)
      toast.error('Failed to delete prompt. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Generate avatar URL for the author
  const authorAvatarUrl = prompt.username
    ? generateDiceBearAvatar(prompt.username)
    : generateDiceBearAvatar('anonymous')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl w-[95vw] h-[90vh] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
        accessibleTitle={prompt.title}
      >
        {/* Header - Metadata Bar */}
        <DialogHeader className={`px-6 py-4 border-b border-border/50 shrink-0 transition-all duration-200 ${isExpanded ? 'py-3' : ''}`}>
          {editMode ? (
            <div className="space-y-3 pr-8">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Prompt title..."
                className="text-xl font-semibold"
              />
              <Input
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Brief description..."
              />
              <div className="flex gap-3">
                <Select value={editedCategory} onValueChange={setEditedCategory}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={editedTags}
                  onChange={(e) => setEditedTags(e.target.value)}
                  placeholder="Tags (comma-separated)..."
                  className="flex-1"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 pr-8">
                <div className="space-y-2">
                  <DialogTitle className="text-xl">{prompt.title}</DialogTitle>
                  {!isExpanded && (
                    <div className="flex flex-wrap gap-2">
                      {prompt.category && (
                        <Badge variant="secondary">{prompt.category}</Badge>
                      )}
                      {promptIsTemplate && (
                        <Badge
                          variant="outline"
                          className="gap-1 border-primary/50 text-primary"
                        >
                          <FileText className="h-3 w-3" />
                          Template ({fieldCount}{' '}
                          {fieldCount === 1 ? 'field' : 'fields'})
                        </Badge>
                      )}
                      {prompt.tags &&
                        prompt.tags.length > 0 &&
                        prompt.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>
              </div>
              {!isExpanded && prompt.description && (
                <DialogDescription className="text-left pt-2">
                  {prompt.description}
                </DialogDescription>
              )}
            </>
          )}
        </DialogHeader>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col min-h-0">
          <div className="flex flex-col flex-1 gap-4 min-h-0">
            {/* Content Label + Expand/Copy Buttons */}
            <div className="flex items-center justify-between shrink-0">
              <span className="text-sm font-medium text-muted-foreground">
                {promptIsTemplate ? 'Fill in the fields below' : 'Prompt Content'}
              </span>
              <div className="flex items-center gap-2">
                {!editMode && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsExpanded(!isExpanded)}
                    title={isExpanded ? 'Collapse' : 'Expand prompt area'}
                  >
                    {isExpanded ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
                <SendToTerminalButton
                  content={getContentToCopy()}
                  title={prompt.title}
                  variant="button"
                  size="sm"
                />
                <Button
                  ref={copyButtonRef}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={onCopy}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      {promptIsTemplate ? 'Copy Filled' : 'Copy'}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Content Display/Editor */}
            <div className={`glass rounded-lg p-4 border border-border/50 ${editMode ? 'flex-1 flex flex-col min-h-0' : 'flex-1 min-h-[200px] overflow-y-auto'}`}>
              {editMode ? (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Write your prompt here..."
                  className="flex-1 font-mono text-sm resize-none border-0 p-0 focus-visible:ring-0 min-h-0"
                />
              ) : promptIsTemplate ? (
                <PromptTemplateRenderer
                  content={prompt.content}
                  onFilledContentChange={handleFilledContentChange}
                  onTabOut={() => copyButtonRef.current?.focus()}
                />
              ) : (
                <div className="font-mono text-sm whitespace-pre-wrap break-words text-foreground">
                  {prompt.content}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Stats & Actions */}
        <DialogFooter className="px-6 py-4 border-t border-border/50 shrink-0">
          <div className="flex items-center justify-between w-full flex-wrap gap-4">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={authorAvatarUrl} alt={prompt.username || 'Author'} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(prompt.username)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium flex items-center gap-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  {prompt.username || 'Anonymous'}
                </p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(prompt.created_at)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Usage Count */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground px-2">
                <Copy className="h-4 w-4" />
                <span>{usageCount}</span>
              </div>

              {/* Like Button */}
              <Button
                variant={isLiked ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={onLikeClick}
                disabled={interactionsLoading}
              >
                <Heart
                  className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`}
                />
                {likeCount}
              </Button>

              {/* Bookmark Button */}
              <Button
                variant={isBookmarked ? 'default' : 'outline'}
                size="icon"
                className="h-9 w-9"
                onClick={onBookmarkClick}
                disabled={interactionsLoading}
              >
                <Bookmark
                  className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`}
                />
                <span className="sr-only">
                  {isBookmarked ? 'Remove bookmark' : 'Save prompt'}
                </span>
              </Button>

              {/* Edit/Save Buttons (for prompt owners and admins) */}
              {canEdit && (
                <>
                  {editMode ? (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-2"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          setEditMode(false)
                          setEditedTitle(prompt.title)
                          setEditedContent(prompt.content)
                          setEditedDescription(prompt.description || '')
                          setEditedCategory(prompt.category || '')
                          setEditedTags(prompt.tags?.join(', ') || '')
                        }}
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => setEditMode(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </>
              )}

              {/* Delete Button (admin only) */}
              {isAdmin && !editMode && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{prompt.title}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  )
}

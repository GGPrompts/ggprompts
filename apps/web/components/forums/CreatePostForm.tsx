'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea, Label } from '@ggprompts/ui'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { createPost, validatePostData } from '@/lib/database/forums'
import { useAuth } from '@/hooks/useAuth'

export function CreatePostForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('You must be logged in to create a post')
      router.push('/login')
      return
    }

    // Validate
    const validation = validatePostData({ title, content })
    if (!validation.valid) {
      const newErrors: { title?: string; content?: string } = {}
      validation.errors.forEach((error) => {
        if (error.toLowerCase().includes('title')) {
          newErrors.title = error
        } else if (error.toLowerCase().includes('content')) {
          newErrors.content = error
        }
      })
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const post = await createPost({
        title,
        content,
        user_id: user.id,
      })

      toast.success('Post created successfully!')
      router.push(`/forums/${post.id}`)
    } catch (error) {
      console.error('Failed to create post:', error)
      toast.error('Failed to create post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a descriptive title for your post..."
          maxLength={200}
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {title.length}/200 characters
        </p>
      </div>

      {/* Content Field */}
      <div className="space-y-2">
        <Label htmlFor="content">
          Content <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here. You can use markdown for formatting."
          rows={12}
          className={`resize-none ${errors.content ? 'border-destructive' : ''}`}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Supports markdown formatting
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !title.trim() || !content.trim()}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Post'
          )}
        </Button>
      </div>
    </form>
  )
}

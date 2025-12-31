'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, ArrowLeft, Sparkles, Bot, Command, X } from 'lucide-react'
import { toast } from 'sonner'
import { submitComponent, SubmitComponentData } from '@/app/claude-code/actions'
import { ComponentCategory } from '@/lib/types'

interface SubmitComponentFormProps {
  categories: ComponentCategory[]
}

const componentTypes = [
  { value: 'skill', label: 'Skill', icon: Sparkles, description: 'Specialized knowledge and workflows' },
  { value: 'agent', label: 'Agent', icon: Bot, description: 'AI personas with specific behaviors' },
  { value: 'command', label: 'Command', icon: Command, description: 'Slash commands for common tasks' },
] as const

export function SubmitComponentForm({ categories }: SubmitComponentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [type, setType] = useState<'skill' | 'agent' | 'command'>('skill')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [sourceUrl, setSourceUrl] = useState('')

  const [errors, setErrors] = useState<{
    name?: string
    description?: string
    category?: string
    content?: string
  }>({})

  // Filter categories based on selected type
  const filteredCategories = categories.filter(
    cat => !cat.component_type || cat.component_type === type
  )

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag])
        setTagInput('')
      }
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!name.trim()) {
      newErrors.name = 'Name is required'
    } else if (name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    } else if (name.length > 50) {
      newErrors.name = 'Name must be 50 characters or less'
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required'
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    } else if (description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less'
    }

    if (!category) {
      newErrors.category = 'Please select a category'
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required'
    } else if (content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsSubmitting(true)

    const data: SubmitComponentData = {
      name: name.trim(),
      type,
      description: description.trim(),
      category,
      content: content.trim(),
      tags: tags.length > 0 ? tags : undefined,
      sourceUrl: sourceUrl.trim() || undefined,
    }

    const result = await submitComponent(data)

    if (result.success && result.slug) {
      toast.success('Component submitted successfully!')
      router.push(`/claude-code/${type}s/${result.slug}`)
    } else {
      toast.error(result.error || 'Failed to submit component')
      setIsSubmitting(false)
    }
  }

  const selectedTypeConfig = componentTypes.find(t => t.value === type)
  const TypeIcon = selectedTypeConfig?.icon || Sparkles

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Component Type */}
      <div className="space-y-2">
        <Label>
          Component Type <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {componentTypes.map((typeOption) => {
            const Icon = typeOption.icon
            const isSelected = type === typeOption.value
            return (
              <button
                key={typeOption.value}
                type="button"
                onClick={() => {
                  setType(typeOption.value)
                  setCategory('') // Reset category when type changes
                }}
                className={`
                  p-4 rounded-lg border text-left transition-all
                  ${isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'
                  }
                `}
              >
                <Icon className={`h-5 w-5 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="font-medium text-sm">{typeOption.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{typeOption.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Enter ${type} name...`}
          maxLength={50}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {name.length}/50 characters
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Briefly describe what this ${type} does...`}
          rows={2}
          maxLength={200}
          className={`resize-none ${errors.description ? 'border-destructive' : ''}`}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {description.length}/200 characters
        </p>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">
          Category <span className="text-destructive">*</span>
        </Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category}</p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">
          Content <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Enter the ${type} content in markdown format...`}
          rows={12}
          className={`resize-none font-mono text-sm ${errors.content ? 'border-destructive' : ''}`}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Write in markdown format. This is the main content that will be shown to users.
        </p>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (optional)</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <Input
          id="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Type a tag and press Enter..."
          disabled={tags.length >= 5}
        />
        <p className="text-sm text-muted-foreground">
          {tags.length}/5 tags. Press Enter to add.
        </p>
      </div>

      {/* Source URL */}
      <div className="space-y-2">
        <Label htmlFor="sourceUrl">Source URL (optional)</Label>
        <Input
          id="sourceUrl"
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://github.com/..."
        />
        <p className="text-sm text-muted-foreground">
          Link to the source repository or documentation.
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
        <Button
          type="submit"
          disabled={isSubmitting || !name.trim() || !description.trim() || !category || !content.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <TypeIcon className="h-4 w-4 mr-2" />
              Submit {selectedTypeConfig?.label}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

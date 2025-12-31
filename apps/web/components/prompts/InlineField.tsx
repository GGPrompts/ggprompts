'use client'

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { validateTemplateField, ValidationError } from '@/lib/prompt-template'
import { AlertCircle } from 'lucide-react'

interface InlineFieldProps {
  fieldId: string
  hint: string
  value: string
  onChange: (fieldId: string, value: string) => void
  onNavigate?: (direction: 'next' | 'prev') => void
  isActive?: boolean
  onActivate?: () => void
  showValidation?: boolean
}

export function InlineField({
  fieldId,
  hint,
  value,
  onChange,
  onNavigate,
  isActive = false,
  onActivate,
  showValidation = false,
}: InlineFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [hasBeenTouched, setHasBeenTouched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync local state when external value changes
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value)
    }
  }, [value, isEditing])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Handle external activation (from tab navigation)
  useEffect(() => {
    if (isActive && !isEditing) {
      setIsEditing(true)
    }
  }, [isActive, isEditing])

  // Validate when value changes (after blur) and field has been touched
  useEffect(() => {
    if (showValidation && hasBeenTouched) {
      const { errors } = validateTemplateField(fieldId, value, hint)
      setValidationErrors(errors)
    }
  }, [value, showValidation, hasBeenTouched, fieldId, hint])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      if (!isEditing) {
        setEditValue(value)
        setIsEditing(true)
        onActivate?.()
      }
    },
    [isEditing, value, onActivate]
  )

  const handleSave = useCallback(() => {
    onChange(fieldId, editValue)
    setIsEditing(false)
    setHasBeenTouched(true)
  }, [fieldId, editValue, onChange])

  const handleCancel = useCallback(() => {
    setEditValue(value)
    setIsEditing(false)
  }, [value])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSave()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      } else if (e.key === 'Tab') {
        e.preventDefault()
        onChange(fieldId, editValue)
        setIsEditing(false)
        onNavigate?.(e.shiftKey ? 'prev' : 'next')
      }
      // Stop propagation for typing keys
      e.stopPropagation()
    },
    [handleSave, handleCancel, onChange, fieldId, editValue, onNavigate]
  )

  // Calculate width based on content
  const getWidth = () => {
    const content = editValue || hint
    const charWidth = 8 // approximate px per character
    const padding = 24
    const minWidth = 60
    const maxWidth = 300
    return Math.min(maxWidth, Math.max(minWidth, content.length * charWidth + padding))
  }

  const displayText = value || hint
  const isEmpty = !value
  const hasError = showValidation && validationErrors.length > 0
  const errorMessage = validationErrors[0]?.message

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={hint}
        className={cn(
          'inline-template-field-input',
          'inline px-2 py-0.5 mx-0.5',
          'bg-primary/20 border rounded',
          'text-foreground font-mono text-sm',
          'focus:outline-none focus:ring-2',
          hasError
            ? 'border-destructive focus:ring-destructive/50'
            : 'border-primary/50 focus:ring-primary/50',
          'placeholder:text-muted-foreground/70'
        )}
        style={{ width: `${getWidth()}px` }}
        aria-label={`Edit ${hint || fieldId}`}
        aria-invalid={hasError}
      />
    )
  }

  return (
    <span
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick(e as unknown as React.MouseEvent)
        }
      }}
      className={cn(
        'inline-template-field',
        'inline-flex items-center gap-1 px-2 py-0.5 mx-0.5',
        'rounded cursor-pointer transition-all duration-200',
        'font-mono text-sm',
        hasError
          ? 'bg-destructive/10 text-destructive border border-destructive/50 hover:bg-destructive/20'
          : isEmpty
            ? 'bg-primary/10 text-primary/70 border border-dashed border-primary/40 hover:bg-primary/20 hover:border-primary/60'
            : 'bg-primary/20 text-foreground border border-primary/30 hover:bg-primary/30',
        'focus:outline-none focus:ring-2 focus:ring-primary/50'
      )}
      style={{ minWidth: `${getWidth()}px` }}
      role="button"
      tabIndex={0}
      title={hasError ? errorMessage : `Click to edit: ${hint || fieldId}`}
      aria-label={`Template field: ${hint || fieldId}. ${value ? `Current value: ${value}` : 'Empty'}${hasError ? `. Error: ${errorMessage}` : ''}. Click to edit.`}
      aria-invalid={hasError}
    >
      {displayText}
      {hasError && (
        <AlertCircle className="h-3 w-3 text-destructive shrink-0" />
      )}
    </span>
  )
}

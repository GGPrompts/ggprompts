'use client'

import { useState, useCallback, useMemo, ReactNode } from 'react'
import { InlineField } from './InlineField'
import {
  parseTemplate,
  fillTemplate,
  TemplateField,
  getFieldProgress,
  validateAllFields,
} from '@/lib/prompt-template'
import { cn } from '@/lib/utils'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface PromptTemplateRendererProps {
  content: string
  onFilledContentChange?: (filledContent: string) => void
  onTabOut?: () => void
  className?: string
  showValidation?: boolean
  showProgress?: boolean
}

interface ParsedSegment {
  type: 'text' | 'field'
  content: string
  field?: TemplateField
}

export function PromptTemplateRenderer({
  content,
  onFilledContentChange,
  onTabOut,
  className,
  showValidation = false,
  showProgress = false,
}: PromptTemplateRendererProps) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [activeFieldIndex, setActiveFieldIndex] = useState<number | null>(null)

  // Parse template and get field order
  const parsed = useMemo(() => parseTemplate(content), [content])
  const fieldOrder = useMemo(() => parsed.fields.map((f) => f.id), [parsed.fields])

  // Get progress and validation state
  const progress = useMemo(
    () => getFieldProgress(content, fieldValues),
    [content, fieldValues]
  )
  const validation = useMemo(
    () => validateAllFields(content, fieldValues),
    [content, fieldValues]
  )

  // Parse content into segments (text and fields)
  const segments = useMemo((): ParsedSegment[] => {
    const result: ParsedSegment[] = []
    const fieldRegex = /\{\{([^:}]+)(?::([^}]+))?\}\}/g
    let lastIndex = 0
    let match

    while ((match = fieldRegex.exec(content)) !== null) {
      // Add text before the field
      if (match.index > lastIndex) {
        result.push({
          type: 'text',
          content: content.slice(lastIndex, match.index),
        })
      }

      // Add the field
      const fieldId = match[1].trim()
      const hint = match[2]?.trim() || ''
      const field = parsed.fields.find((f) => f.id === fieldId)

      result.push({
        type: 'field',
        content: match[0],
        field: field || {
          id: fieldId,
          name: fieldId,
          hint,
          placeholder: hint || fieldId,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          fullMatch: match[0],
        },
      })

      lastIndex = fieldRegex.lastIndex
    }

    // Add remaining text
    if (lastIndex < content.length) {
      result.push({
        type: 'text',
        content: content.slice(lastIndex),
      })
    }

    return result
  }, [content, parsed.fields])

  // Handle field value change
  const handleFieldChange = useCallback(
    (fieldId: string, value: string) => {
      const newValues = { ...fieldValues, [fieldId]: value }
      setFieldValues(newValues)

      // Notify parent of filled content
      if (onFilledContentChange) {
        const filled = fillTemplate(content, newValues)
        onFilledContentChange(filled)
      }
    },
    [fieldValues, content, onFilledContentChange]
  )

  // Handle tab navigation between fields
  const handleNavigate = useCallback(
    (currentFieldId: string, direction: 'next' | 'prev') => {
      const currentIndex = fieldOrder.indexOf(currentFieldId)
      if (currentIndex === -1) return

      let nextIndex: number
      if (direction === 'next') {
        // If on last field and tabbing forward, exit to copy button
        if (currentIndex === fieldOrder.length - 1) {
          onTabOut?.()
          return
        }
        nextIndex = currentIndex + 1
      } else {
        // If on first field and tabbing backward, stay on first
        if (currentIndex === 0) {
          return
        }
        nextIndex = currentIndex - 1
      }

      setActiveFieldIndex(nextIndex)

      // Reset active after a short delay to allow the field to activate
      setTimeout(() => setActiveFieldIndex(null), 100)
    },
    [fieldOrder, onTabOut]
  )

  // Get the current filled content for copying
  const getFilledContent = useCallback(() => {
    return fillTemplate(content, fieldValues)
  }, [content, fieldValues])

  // Render segments
  const renderedContent = useMemo((): ReactNode[] => {
    let fieldCounter = 0

    return segments.map((segment, index) => {
      if (segment.type === 'text') {
        // Preserve whitespace and newlines
        return (
          <span key={`text-${index}`} className="whitespace-pre-wrap">
            {segment.content}
          </span>
        )
      }

      if (segment.type === 'field' && segment.field) {
        const currentFieldIndex = fieldCounter
        fieldCounter++
        const fieldId = segment.field.id

        return (
          <InlineField
            key={`field-${fieldId}-${index}`}
            fieldId={fieldId}
            hint={segment.field.placeholder}
            value={fieldValues[fieldId] || ''}
            onChange={handleFieldChange}
            onNavigate={(direction) => handleNavigate(fieldId, direction)}
            isActive={activeFieldIndex === currentFieldIndex}
            onActivate={() => setActiveFieldIndex(currentFieldIndex)}
            showValidation={showValidation}
          />
        )
      }

      return null
    })
  }, [segments, fieldValues, handleFieldChange, handleNavigate, activeFieldIndex])

  return (
    <div className={className}>
      {/* Progress indicator */}
      {showProgress && progress.total > 0 && (
        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          {progress.filled === progress.total ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-primary/60" />
          )}
          <span>
            {progress.filled} of {progress.total} fields filled
            {progress.percentage > 0 && progress.percentage < 100 && (
              <span className="ml-1 text-muted-foreground/60">
                ({progress.percentage}%)
              </span>
            )}
          </span>
          {showValidation && validation.errors.length > 0 && (
            <span className="text-destructive">
              ({validation.errors.length} error{validation.errors.length !== 1 ? 's' : ''})
            </span>
          )}
        </div>
      )}

      <div className="font-mono text-sm whitespace-pre-wrap break-words">
        {renderedContent}
      </div>
    </div>
  )
}

// Export a hook for getting filled content externally
export function useTemplateValues() {
  const [values, setValues] = useState<Record<string, string>>({})

  const setValue = useCallback((fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }))
  }, [])

  const reset = useCallback(() => {
    setValues({})
  }, [])

  return { values, setValue, reset }
}

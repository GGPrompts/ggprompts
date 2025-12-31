// lib/prompt-template.ts
// Core utility for handling prompt templates with {{field:hint}} syntax

export interface TemplateField {
  id: string
  name: string
  hint: string
  placeholder: string
  startIndex: number
  endIndex: number
  fullMatch: string
}

export interface ParsedTemplate {
  content: string
  fields: TemplateField[]
  hasFields: boolean
}

/**
 * Format a field ID into a human-readable name
 * e.g., "target_audience" -> "Target Audience"
 */
function formatFieldName(fieldId: string): string {
  return fieldId
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

/**
 * Parse template content and extract all fields
 */
export function parseTemplate(content: string): ParsedTemplate {
  // Support both {{field:hint}} (preferred) and {{field}} syntax
  const fieldRegex = /\{\{([^:}]+)(?::([^}]+))?\}\}/g
  const fields: TemplateField[] = []
  const seen = new Set<string>()
  let match

  while ((match = fieldRegex.exec(content)) !== null) {
    const fieldId = match[1]?.trim()
    const hint = match[2]?.trim() || ''

    if (!fieldId) continue

    // Track field even if duplicate (for position info)
    // but only add to fields array once
    const field: TemplateField = {
      id: fieldId,
      name: formatFieldName(fieldId),
      hint: hint,
      placeholder: hint || formatFieldName(fieldId),
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      fullMatch: match[0],
    }

    if (!seen.has(fieldId)) {
      seen.add(fieldId)
      fields.push(field)
    }
  }

  return {
    content,
    fields,
    hasFields: fields.length > 0,
  }
}

/**
 * Check if content contains template fields
 */
export function isTemplate(content: string): boolean {
  const fieldRegex = /\{\{([^:}]+)(?::([^}]+))?\}\}/
  return fieldRegex.test(content)
}

/**
 * Fill template with provided field values
 */
export function fillTemplate(
  content: string,
  values: Record<string, string>
): string {
  let filledContent = content

  // Replace all {{field:hint}} patterns
  filledContent = filledContent.replace(
    /\{\{([^:}]+)(?::([^}]+))?\}\}/g,
    (match, fieldId, hint) => {
      const value = values[fieldId?.trim()]
      if (value && value.trim()) {
        return value
      }
      // Keep placeholder text if no value provided
      return hint?.trim() || formatFieldName(fieldId?.trim() || '')
    }
  )

  return filledContent
}

/**
 * Get a preview of the template with placeholder markers
 */
export function getTemplatePreview(
  content: string,
  maxLength: number = 150
): string {
  const preview = content.replace(/\{\{([^:}]+)(?::[^}]+)?\}\}/g, '[...]')

  if (preview.length <= maxLength) return preview
  return preview.substring(0, maxLength).trim() + '...'
}

/**
 * Extract unique field IDs from template content
 */
export function getFieldIds(content: string): string[] {
  const parsed = parseTemplate(content)
  return parsed.fields.map((f) => f.id)
}

/**
 * Initialize empty values object for all fields in a template
 */
export function initializeFieldValues(
  content: string
): Record<string, string> {
  const parsed = parseTemplate(content)
  const values: Record<string, string> = {}
  parsed.fields.forEach((field) => {
    values[field.id] = ''
  })
  return values
}

// ============================================================================
// Template Field Validation
// ============================================================================

export interface ValidationError {
  fieldId: string
  type: 'required' | 'format' | 'length'
  message: string
}

export interface ValidationWarning {
  fieldId: string
  type: 'suggestion' | 'length'
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  filledCount: number
  totalCount: number
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    // Try with http prefix
    try {
      new URL('https://' + url)
      return url.includes('.')
    } catch {
      return false
    }
  }
}

/**
 * Validate a single template field based on its hint
 */
export function validateTemplateField(
  fieldId: string,
  value: string,
  hint?: string
): { errors: ValidationError[]; warnings: ValidationWarning[] } {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const hintLower = (hint || '').toLowerCase()

  // Check for required fields
  if (hintLower.includes('required') || hintLower.includes('*required*')) {
    if (!value || value.trim() === '') {
      errors.push({
        fieldId,
        type: 'required',
        message: `This field is required`,
      })
      return { errors, warnings }
    }
  }

  // Skip further validation if empty and not required
  if (!value || value.trim() === '') {
    return { errors, warnings }
  }

  // Email validation
  if (hintLower.includes('email') || hintLower.includes('@')) {
    if (!isValidEmail(value)) {
      errors.push({
        fieldId,
        type: 'format',
        message: 'Please enter a valid email address',
      })
    }
  }

  // URL validation
  if (
    hintLower.includes('url') ||
    hintLower.includes('website') ||
    hintLower.includes('link')
  ) {
    if (!isValidUrl(value)) {
      errors.push({
        fieldId,
        type: 'format',
        message: 'Please enter a valid URL',
      })
    }
  }

  // Number validation
  if (
    hintLower.includes('number') ||
    hintLower.includes('amount') ||
    hintLower.includes('count') ||
    hintLower.includes('age')
  ) {
    if (isNaN(Number(value))) {
      errors.push({
        fieldId,
        type: 'format',
        message: 'Please enter a valid number',
      })
    }
  }

  // Length warnings (not errors)
  if (value.length > 500) {
    warnings.push({
      fieldId,
      type: 'length',
      message: 'This field is quite long. Consider being more concise.',
    })
  }

  return { errors, warnings }
}

/**
 * Validate all template fields
 */
export function validateAllFields(
  content: string,
  values: Record<string, string>
): ValidationResult {
  const parsed = parseTemplate(content)
  const allErrors: ValidationError[] = []
  const allWarnings: ValidationWarning[] = []
  let filledCount = 0

  parsed.fields.forEach((field) => {
    const value = values[field.id] || ''
    if (value.trim()) {
      filledCount++
    }

    const { errors, warnings } = validateTemplateField(
      field.id,
      value,
      field.hint
    )
    allErrors.push(...errors)
    allWarnings.push(...warnings)
  })

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    filledCount,
    totalCount: parsed.fields.length,
  }
}

/**
 * Check if all required fields are filled
 */
export function hasRequiredFieldsFilled(
  content: string,
  values: Record<string, string>
): boolean {
  const parsed = parseTemplate(content)

  return parsed.fields.every((field) => {
    const hintLower = (field.hint || '').toLowerCase()
    const isRequired =
      hintLower.includes('required') || hintLower.includes('*required*')

    if (!isRequired) return true

    const value = values[field.id] || ''
    return value.trim() !== ''
  })
}

/**
 * Get count of filled vs total fields
 */
export function getFieldProgress(
  content: string,
  values: Record<string, string>
): { filled: number; total: number; percentage: number } {
  const parsed = parseTemplate(content)
  let filled = 0

  parsed.fields.forEach((field) => {
    const value = values[field.id] || ''
    if (value.trim()) {
      filled++
    }
  })

  const total = parsed.fields.length
  const percentage = total > 0 ? Math.round((filled / total) * 100) : 100

  return { filled, total, percentage }
}

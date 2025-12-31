'use client'

import { useEffect, useRef, useCallback, type KeyboardEvent } from 'react'
import { Input } from '@ggprompts/ui'
import { Search } from 'lucide-react'

interface MarketplaceSearchInputProps {
  name: string
  placeholder: string
  defaultValue?: string
}

export function MarketplaceSearchInput({
  name,
  placeholder,
  defaultValue,
}: MarketplaceSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      const isEditable = target.isContentEditable
      const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select'

      if (e.key === '/' && !isInput && !isEditable) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle Escape to clear and blur
  const handleInputKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      const input = inputRef.current
      if (input) {
        if (input.value) {
          input.value = ''
        }
        input.blur()
      }
    }
  }, [])

  return (
    <div className="relative flex-1 min-w-0 md:min-w-[200px] lg:min-w-[300px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        name={name}
        placeholder={`${placeholder} (press /)`}
        defaultValue={defaultValue}
        onKeyDown={handleInputKeyDown}
        className="pl-10 h-11 glass border-border/50 focus:border-primary/50"
      />
    </div>
  )
}

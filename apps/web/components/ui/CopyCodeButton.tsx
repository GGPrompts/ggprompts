'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface CopyCodeButtonProps {
  content: string
  className?: string
}

export function CopyCodeButton({ content, className }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'absolute top-2 right-2 p-2 rounded-md',
        'bg-muted/50 hover:bg-muted border border-border/50',
        'opacity-0 group-hover:opacity-100',
        'transform scale-90 group-hover:scale-100',
        'transition-all duration-200 ease-out',
        'text-muted-foreground hover:text-foreground',
        'focus:opacity-100 focus:scale-100 focus:outline-none focus:ring-2 focus:ring-primary/50',
        className
      )}
      title="Copy code"
      aria-label={copied ? 'Copied!' : 'Copy code to clipboard'}
    >
      <span className="relative block h-4 w-4">
        <Copy
          className={cn(
            'absolute inset-0 h-4 w-4 transition-all duration-200',
            copied ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
          )}
        />
        <Check
          className={cn(
            'absolute inset-0 h-4 w-4 text-green-500 transition-all duration-200',
            copied ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          )}
        />
      </span>
    </button>
  )
}

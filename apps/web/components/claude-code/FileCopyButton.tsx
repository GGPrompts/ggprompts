'use client'

import { useState } from 'react'
import { Button } from '@ggprompts/ui'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface FileCopyButtonProps {
  content: string
  fileName?: string
  size?: 'sm' | 'default' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'ghost'
  label?: string
}

export function FileCopyButton({
  content,
  fileName,
  size = 'sm',
  variant = 'ghost',
  label = 'Copy'
}: FileCopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success(fileName ? `Copied ${fileName}` : 'Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleCopy}
      className="gap-1.5"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-500" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </Button>
  )
}

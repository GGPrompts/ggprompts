'use client'

import { useState } from 'react'
import { Button } from '@ggprompts/ui'
import { Eye } from 'lucide-react'
import { ComponentContentModal } from './ComponentContentModal'
import type { Component } from '@/lib/types'

interface ViewContentButtonProps {
  component: Component
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function ViewContentButton({
  component,
  variant = 'default',
  size = 'default',
  className,
}: ViewContentButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setOpen(true)}
      >
        <Eye className="h-4 w-4 mr-2" />
        View Content
      </Button>

      <ComponentContentModal
        component={component}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

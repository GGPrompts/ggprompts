'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { Plus, Loader2 } from 'lucide-react'

interface CreatePromptButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function CreatePromptButton({
  variant = 'default',
  size = 'default',
  className,
}: CreatePromptButtonProps) {
  const { user, loading } = useAuth()

  // Don't show anything while loading
  if (loading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    )
  }

  // Only show for authenticated users
  if (!user) {
    return null
  }

  return (
    <Button variant={variant} size={size} className={className} asChild>
      <Link href="/prompts/new">
        <Plus className="w-4 h-4 mr-2" />
        Create Prompt
      </Link>
    </Button>
  )
}

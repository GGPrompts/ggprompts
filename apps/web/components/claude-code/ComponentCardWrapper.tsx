'use client'

import { Component } from '@/lib/types'
import { ComponentCard } from './ComponentCard'
import { addToToolkit, toggleComponentBookmark } from '@/app/claude-code/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ComponentCardWrapperProps {
  component: Component
  isInToolkit: boolean
  isBookmarked: boolean
  isAuthenticated: boolean
}

export function ComponentCardWrapper({
  component,
  isInToolkit,
  isBookmarked,
  isAuthenticated
}: ComponentCardWrapperProps) {
  const router = useRouter()

  const handleAddToToolkit = async (componentId: string) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add to toolkit')
      router.push(`/login?redirect=/claude-code/${component.type}s`)
      return
    }

    const result = await addToToolkit(componentId)

    if (result.success) {
      toast.success(`Added ${component.name} to toolkit`)
    } else {
      toast.error(result.error || 'Failed to add to toolkit')
      throw new Error(result.error)
    }
  }

  const handleToggleBookmark = async (componentId: string) => {
    if (!isAuthenticated) {
      toast.error('Please log in to bookmark')
      router.push(`/login?redirect=/claude-code/${component.type}s`)
      return
    }

    const result = await toggleComponentBookmark(componentId)

    if (result.success) {
      if (result.bookmarked) {
        toast.success(`Bookmarked ${component.name}`)
      } else {
        toast.success(`Removed bookmark`)
      }
    } else {
      toast.error(result.error || 'Failed to toggle bookmark')
      throw new Error(result.error)
    }
  }

  return (
    <ComponentCard
      component={component}
      isInToolkit={isInToolkit}
      isBookmarked={isBookmarked}
      onAddToToolkit={handleAddToToolkit}
      onToggleBookmark={handleToggleBookmark}
    />
  )
}

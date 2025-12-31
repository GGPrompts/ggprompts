'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useCallback } from 'react'
import { cn } from '@ggprompts/ui'
import { Check, Sparkles } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants/categories'

interface CategoryFilterProps {
  currentCategories?: string[]
}

export function CategoryFilter({ currentCategories = [] }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const scrollToResults = useCallback(() => {
    // Small delay to let the DOM update
    setTimeout(() => {
      const resultsSection = document.querySelector('section.border-t')
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }, [])

  const handleCategoryClick = (categoryValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // Toggle category in/out of the array
    let newCategories: string[]
    if (currentCategories.includes(categoryValue)) {
      // Remove category
      newCategories = currentCategories.filter(c => c !== categoryValue)
    } else {
      // Add category
      newCategories = [...currentCategories, categoryValue]
    }

    // Update URL param
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','))
    } else {
      params.delete('categories')
    }

    // Reset to page 1 when filtering
    params.delete('page')

    startTransition(() => {
      router.push(`/prompts?${params.toString()}`, { scroll: false })
      // Only scroll when first applying category filter (going from 0 to 1+)
      if (currentCategories.length === 0 && newCategories.length > 0) {
        scrollToResults()
      }
    })
  }

  const clearAllCategories = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('categories')
    params.delete('page')

    startTransition(() => {
      router.push(`/prompts?${params.toString()}`, { scroll: false })
    })
  }

  const hasActiveCategories = currentCategories.length > 0

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {/* "All" button to clear selection */}
      <button
        onClick={clearAllCategories}
        disabled={isPending}
        className={cn(
          'glass px-4 py-2 rounded-full flex items-center gap-2 transition-all border',
          !hasActiveCategories
            ? 'border-primary bg-primary/20 text-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)]'
            : 'border-border/50 hover:border-primary/30 text-foreground'
        )}
      >
        <Sparkles className="w-4 h-4" />
        <span className="font-medium text-sm">All</span>
      </button>

      {CATEGORIES.map((category) => {
        const isActive = currentCategories.includes(category.value)
        const Icon = category.icon

        return (
          <button
            key={category.value}
            onClick={() => handleCategoryClick(category.value)}
            disabled={isPending}
            className={cn(
              'px-4 py-2 rounded-full flex items-center gap-2 transition-all border',
              isActive
                ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]'
                : 'glass border-border/50 hover:border-primary/30 text-foreground'
            )}
          >
            {isActive ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            <span className="font-medium text-sm">{category.name}</span>
          </button>
        )
      })}
    </div>
  )
}

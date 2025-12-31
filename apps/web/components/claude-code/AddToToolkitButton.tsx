'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@ggprompts/ui'
import { Plus, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { addToToolkit } from '@/app/claude-code/actions'

interface AddToToolkitButtonProps {
  componentId: string
  componentName: string
  isInToolkit: boolean
  isAuthenticated: boolean
  redirectPath: string
  size?: 'sm' | 'default' | 'lg'
}

export function AddToToolkitButton({
  componentId,
  componentName,
  isInToolkit,
  isAuthenticated,
  redirectPath,
  size = 'sm'
}: AddToToolkitButtonProps) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(isInToolkit)
  const router = useRouter()

  const handleAdd = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add to toolkit')
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`)
      return
    }

    if (added || adding) return

    setAdding(true)

    const result = await addToToolkit(componentId)

    if (result.success) {
      setAdded(true)
      toast.success(`Added ${componentName} to toolkit`)
    } else {
      toast.error(result.error || 'Failed to add to toolkit')
    }

    setAdding(false)
  }

  return (
    <Button
      size={size}
      disabled={adding || added}
      onClick={handleAdd}
    >
      {adding ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Adding...
        </>
      ) : added ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          In Toolkit
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-2" />
          Add to Toolkit
        </>
      )}
    </Button>
  )
}

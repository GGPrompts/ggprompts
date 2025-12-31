'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { deletePost } from '@/app/forums/actions'

interface DeletePostButtonProps {
  postId: string
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This will also delete all comments.')) {
      return
    }

    startTransition(async () => {
      const result = await deletePost(postId)
      if (result.success) {
        router.push('/forums')
      } else {
        alert(result.error || 'Failed to delete post')
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
      onClick={handleDelete}
      disabled={isPending}
      title="Delete post (Admin)"
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </>
      )}
    </Button>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@ggprompts/ui'
import { PromptCard } from '@/components/prompts/PromptCard'
import { PromptDetailModal } from '@/components/prompts/PromptDetailModal'
import { Prompt } from '@/lib/types'
import { Bookmark, Loader2 } from 'lucide-react'
import { getUserBookmarkedPrompts } from '@/lib/database/prompt-interactions'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export function BookmarkedPromptsList() {
  const { user } = useAuth()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const bookmarkedPrompts = await getUserBookmarkedPrompts(user.id)
        setPrompts(bookmarkedPrompts)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch bookmarks:', err)
        setError('Failed to load bookmarked prompts')
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [user])

  const handlePromptClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <Card className="border-border/30 bg-transparent">
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading bookmarks...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-border/30 bg-transparent">
        <CardContent className="py-16">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (prompts.length === 0) {
    return (
      <Card className="border-border/30 bg-transparent">
        <CardContent className="py-16">
          <div className="text-center">
            <div className="glass rounded-full p-4 w-fit mx-auto mb-4">
              <Bookmark className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No bookmarked prompts</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Save prompts you want to use later by clicking the bookmark icon.
            </p>
            <Button asChild className="gap-2">
              <Link href="/prompts">
                Browse Prompts
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/30 bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          Saved Prompts
          <span className="text-sm font-normal text-muted-foreground">
            ({prompts.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onClick={() => handlePromptClick(prompt)}
            />
          ))}
        </div>

        <PromptDetailModal
          prompt={selectedPrompt}
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open)
            // Refresh list when modal closes to reflect any unbookmark action
            if (!open && user) {
              getUserBookmarkedPrompts(user.id)
                .then(setPrompts)
                .catch(console.error)
            }
          }}
        />
      </CardContent>
    </Card>
  )
}

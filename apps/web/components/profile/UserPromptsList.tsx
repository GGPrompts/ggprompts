'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@ggprompts/ui'
import { PromptCard } from '@/components/prompts/PromptCard'
import { PromptDetailModal } from '@/components/prompts/PromptDetailModal'
import { Prompt } from '@/lib/types'
import { Sparkles, Plus } from 'lucide-react'
import Link from 'next/link'

interface UserPromptsListProps {
  prompts: Prompt[]
}

export function UserPromptsList({ prompts }: UserPromptsListProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handlePromptClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setModalOpen(true)
  }

  if (prompts.length === 0) {
    return (
      <Card className="border-border/30 bg-transparent">
        <CardContent className="py-16">
          <div className="text-center">
            <div className="glass rounded-full p-4 w-fit mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No prompts yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't created any prompts. Share your first prompt with the community!
            </p>
            <Button asChild className="gap-2">
              <Link href="/prompts/new">
                <Plus className="h-4 w-4" />
                Create Your First Prompt
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
          <Sparkles className="h-5 w-5 text-primary" />
          My Prompts
        </CardTitle>
        <Button asChild variant="outline" size="sm" className="gap-2 border-primary/50">
          <Link href="/prompts/new">
            <Plus className="h-4 w-4" />
            New Prompt
          </Link>
        </Button>
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
          onOpenChange={setModalOpen}
        />
      </CardContent>
    </Card>
  )
}

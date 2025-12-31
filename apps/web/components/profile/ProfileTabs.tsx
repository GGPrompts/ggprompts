'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ggprompts/ui'
import { UserPromptsList } from './UserPromptsList'
import { UserPostsList } from './UserPostsList'
import { BookmarkedPromptsList } from './BookmarkedPromptsList'
import { UserToolkitList } from './UserToolkitList'
import { Prompt, ForumPost, Component, UserToolkit } from '@/lib/types'
import { Sparkles, MessageSquare, Bookmark, Package } from 'lucide-react'

interface ToolkitItemWithComponent extends UserToolkit {
  component: Component
}

interface ProfileTabsProps {
  prompts: Prompt[]
  posts: ForumPost[]
  toolkitItems: ToolkitItemWithComponent[]
}

export function ProfileTabs({ prompts, posts, toolkitItems }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="prompts" className="space-y-6">
      <TabsList className="glass border border-border/50 p-1 h-auto flex-wrap">
        <TabsTrigger value="prompts" className="gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">My Prompts</span>
          <span className="sm:hidden">Prompts</span>
        </TabsTrigger>
        <TabsTrigger value="bookmarks" className="gap-2">
          <Bookmark className="h-4 w-4" />
          <span className="hidden sm:inline">Saved</span>
          <span className="sm:hidden">Saved</span>
        </TabsTrigger>
        <TabsTrigger value="toolkit" className="gap-2">
          <Package className="h-4 w-4" />
          <span className="hidden sm:inline">My Toolkit</span>
          <span className="sm:hidden">Toolkit</span>
        </TabsTrigger>
        <TabsTrigger value="posts" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">My Posts</span>
          <span className="sm:hidden">Posts</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="prompts">
        <UserPromptsList prompts={prompts} />
      </TabsContent>

      <TabsContent value="bookmarks">
        <BookmarkedPromptsList />
      </TabsContent>

      <TabsContent value="toolkit">
        <UserToolkitList toolkitItems={toolkitItems} />
      </TabsContent>

      <TabsContent value="posts">
        <UserPostsList posts={posts} />
      </TabsContent>
    </Tabs>
  )
}

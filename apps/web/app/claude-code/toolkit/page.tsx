import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Package,
} from 'lucide-react'
import { SyncToGitHubButton, ToolkitGrid } from '@/components/github-sync'
import { DownloadZipButton } from '@/components/claude-code/DownloadZipButton'

export default async function ToolkitPage() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?redirect=/claude-code/toolkit')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/claude-code"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Marketplace
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Toolkit</h1>
              <p className="text-muted-foreground text-sm">
                Your personal Claude Code plugins from GitHub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DownloadZipButton />
            <SyncToGitHubButton />
          </div>
        </div>
      </div>

      {/* Toolkit Grid */}
      <ToolkitGrid />
    </div>
  )
}

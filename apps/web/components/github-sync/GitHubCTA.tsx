'use client'

import { Github } from 'lucide-react'
import { SyncToGitHubButton } from './SyncToGitHubButton'

export function GitHubCTA() {
  return (
    <div className="glass border-border/50 rounded-2xl p-8 text-center">
      <Github className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h2 className="text-2xl font-bold mb-2">Sync to Your GitHub</h2>
      <p className="text-muted-foreground max-w-xl mx-auto mb-6">
        Connect your GitHub account to sync your curated toolkit. Your selections are stored in your own repo,
        giving you full control and version history.
      </p>
      <SyncToGitHubButton variant="default" className="h-11 px-8" />
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Component } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Trash2, ExternalLink, Github, Circle } from 'lucide-react'
import { toast } from 'sonner'
import { removeFromToolkit, toggleToolkitEnabled } from '../actions'
import { ComponentContentModal } from '@/components/claude-code/ComponentContentModal'

interface ToolkitItemProps {
  component: Component
  enabled: boolean
  typePath: string
  isSynced?: boolean
  repoFullName?: string
  githubConnected?: boolean
}

export function ToolkitItem({
  component,
  enabled,
  typePath,
  isSynced = false,
  repoFullName,
  githubConnected = false
}: ToolkitItemProps) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  const [removing, setRemoving] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const handleToggle = async (checked: boolean) => {
    setToggling(true)
    setIsEnabled(checked)

    const result = await toggleToolkitEnabled(component.id, checked)

    if (!result.success) {
      setIsEnabled(!checked) // Revert on error
      toast.error(result.error || 'Failed to update')
    }

    setToggling(false)
  }

  const handleRemove = async () => {
    setRemoving(true)

    const result = await removeFromToolkit(component.id)

    if (result.success) {
      toast.success(`Removed ${component.name} from toolkit`)
    } else {
      toast.error(result.error || 'Failed to remove')
      setRemoving(false)
    }
  }

  if (removing) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 text-destructive animate-pulse">
        <span>Removing {component.name}...</span>
      </div>
    )
  }

  // Status indicator config - simplified to just synced vs not synced
  const statusConfig = {
    synced: { color: 'text-green-500', label: 'Synced to GitHub' },
    notSynced: { color: 'text-muted-foreground/50', label: 'Not synced - sync to GitHub to push' },
    noConnection: { color: 'text-muted-foreground/30', label: 'Connect GitHub to sync' },
  }

  const getStatus = () => {
    if (!githubConnected) return statusConfig.noConnection
    if (isSynced) return statusConfig.synced
    return statusConfig.notSynced
  }

  const status = getStatus()

  return (
    <>
      <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
        isEnabled ? 'bg-muted/30' : 'bg-muted/10 opacity-60'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={toggling}
            aria-label={`Toggle ${component.name}`}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/claude-code/${typePath}/${component.slug}`}
                className="font-medium hover:text-primary truncate"
              >
                {component.name}
              </Link>
              {component.is_official && (
                <Badge variant="secondary" className="text-xs shrink-0">Official</Badge>
              )}
              {/* Status indicator */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="shrink-0">
                    <Circle className={`h-2 w-2 fill-current ${status.color}`} />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{status.label}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {component.description && (
              <p className="text-xs text-muted-foreground truncate">
                {component.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <span className="text-xs text-muted-foreground">v{component.version}</span>

          {/* GitHub view/edit button - show when synced */}
          {githubConnected && isSynced && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setModalOpen(true)}
                >
                  <Github className="h-4 w-4" />
                  <span className="sr-only">View/Edit on GitHub</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View/Edit</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                asChild
              >
                <Link href={`/claude-code/${typePath}/${component.slug}`}>
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View details</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleRemove}
                disabled={removing}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove from toolkit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* View/Edit Modal */}
      <ComponentContentModal
        component={component}
        open={modalOpen}
        onOpenChange={setModalOpen}
        editable={isSynced && githubConnected}
        repoFullName={repoFullName}
        typePath={typePath}
      />
    </>
  )
}

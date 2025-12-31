"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  GitBranch,
  RefreshCw,
  ArrowDown,
  ArrowUp,
  Check,
  X,
  Plus,
  Minus,
  File,
  FileText,
  Trash2,
  RotateCw,
  ChevronRight,
  ChevronDown,
  CloudDownload,
  CloudUpload,
  GitCommit,
  Undo2,
  Archive,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/projects"

interface GitFile {
  path: string
  status: "modified" | "added" | "deleted" | "renamed" | "copied" | "untracked"
  staged: boolean
  oldPath?: string
}

interface GitStatus {
  branch: string
  upstream: string | null
  ahead: number
  behind: number
  status: "clean" | "dirty" | "untracked"
  files: GitFile[]
  stashCount: number
}

interface ProjectSourceControlProps {
  project: Project
}

const statusIcons: Record<GitFile["status"], React.ReactNode> = {
  modified: <FileText className="h-4 w-4 text-amber-500" />,
  added: <Plus className="h-4 w-4 text-emerald-500" />,
  deleted: <Trash2 className="h-4 w-4 text-red-500" />,
  renamed: <FileText className="h-4 w-4 text-blue-500" />,
  copied: <File className="h-4 w-4 text-blue-500" />,
  untracked: <File className="h-4 w-4 text-muted-foreground" />,
}

const statusLabels: Record<GitFile["status"], string> = {
  modified: "M",
  added: "A",
  deleted: "D",
  renamed: "R",
  copied: "C",
  untracked: "U",
}

export default function ProjectSourceControl({ project }: ProjectSourceControlProps) {
  const queryClient = useQueryClient()
  const [commitMessage, setCommitMessage] = React.useState("")
  const [selectedFiles, setSelectedFiles] = React.useState<Set<string>>(new Set())
  const [stagedOpen, setStagedOpen] = React.useState(true)
  const [unstagedOpen, setUnstagedOpen] = React.useState(true)
  const [untrackedOpen, setUntrackedOpen] = React.useState(true)
  const [actionOutput, setActionOutput] = React.useState<string | null>(null)

  const projectPath = project.local?.path

  // Fetch git status
  const {
    data: gitStatus,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["git-status", projectPath],
    queryFn: async () => {
      if (!projectPath) throw new Error("No local path")
      const res = await fetch(`/api/git?path=${encodeURIComponent(projectPath)}`)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to get git status")
      }
      return res.json() as Promise<GitStatus>
    },
    enabled: !!projectPath,
    refetchInterval: 30000, // Refresh every 30s
    staleTime: 10000,
  })

  // Git action mutation
  const gitAction = useMutation({
    mutationFn: async ({
      action,
      files,
      message,
    }: {
      action: string
      files?: string[]
      message?: string
    }) => {
      const res = await fetch("/api/git", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: projectPath, action, files, message }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Git operation failed")
      }
      return res.json()
    },
    onSuccess: (data) => {
      setActionOutput(data.output || "Operation completed")
      queryClient.invalidateQueries({ queryKey: ["git-status", projectPath] })
      queryClient.invalidateQueries({ queryKey: ["projects-local"] })
      setSelectedFiles(new Set())
      if (data.output?.includes("commit")) {
        setCommitMessage("")
      }
    },
    onError: (err) => {
      setActionOutput(`Error: ${err.message}`)
    },
  })

  // Split files into categories
  const stagedFiles = gitStatus?.files.filter((f) => f.staged) || []
  const unstagedFiles = gitStatus?.files.filter((f) => !f.staged && f.status !== "untracked") || []
  const untrackedFiles = gitStatus?.files.filter((f) => f.status === "untracked") || []

  const toggleFileSelection = (path: string) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(path)) {
      newSelected.delete(path)
    } else {
      newSelected.add(path)
    }
    setSelectedFiles(newSelected)
  }

  const handleStage = (files?: string[]) => {
    gitAction.mutate({ action: "stage", files })
  }

  const handleUnstage = (files?: string[]) => {
    gitAction.mutate({ action: "unstage", files })
  }

  const handleCommit = () => {
    if (!commitMessage.trim()) return
    gitAction.mutate({ action: "commit", message: commitMessage.trim() })
  }

  const handleDiscard = (files: string[]) => {
    if (files.length === 0) return
    if (!confirm(`Discard changes to ${files.length} file(s)? This cannot be undone.`)) return
    gitAction.mutate({ action: "discard", files })
  }

  if (!projectPath) {
    return (
      <Card className="glass">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Local Project Required</h3>
          <p className="text-sm text-muted-foreground">
            Source control is only available for local projects.
            Clone this repository to use source control features.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="p-8 text-center">
          <RotateCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading git status...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="glass">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Git Status</h3>
          <p className="text-sm text-muted-foreground mb-4">{(error as Error).message}</p>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!gitStatus) return null

  const hasChanges = gitStatus.files.length > 0
  const canCommit = stagedFiles.length > 0 && commitMessage.trim().length > 0

  return (
    <div className="space-y-4">
      {/* Branch & Actions Header */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Branch Info */}
            <div className="flex items-center gap-3">
              <GitBranch className="h-5 w-5 text-primary" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">{gitStatus.branch}</span>
                  {gitStatus.upstream && (
                    <span className="text-xs text-muted-foreground">
                      → {gitStatus.upstream}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {gitStatus.ahead > 0 && (
                    <span className="text-emerald-500 flex items-center gap-1">
                      <ArrowUp className="h-3 w-3" />
                      {gitStatus.ahead}
                    </span>
                  )}
                  {gitStatus.behind > 0 && (
                    <span className="text-amber-500 flex items-center gap-1">
                      <ArrowDown className="h-3 w-3" />
                      {gitStatus.behind}
                    </span>
                  )}
                  {gitStatus.status === "clean" && gitStatus.ahead === 0 && gitStatus.behind === 0 && (
                    <span className="text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Up to date
                    </span>
                  )}
                  {gitStatus.stashCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <Archive className="h-3 w-3 mr-1" />
                      {gitStatus.stashCount} stash{gitStatus.stashCount > 1 ? "es" : ""}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => gitAction.mutate({ action: "fetch" })}
                      disabled={gitAction.isPending}
                    >
                      <CloudDownload className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Fetch</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => gitAction.mutate({ action: "pull" })}
                      disabled={gitAction.isPending || gitStatus.behind === 0}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Pull</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => gitAction.mutate({ action: "push" })}
                      disabled={gitAction.isPending || gitStatus.ahead === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Push</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => gitAction.mutate({ action: "sync" })}
                      disabled={gitAction.isPending}
                    >
                      <RefreshCw className={cn("h-4 w-4 mr-2", gitAction.isPending && "animate-spin")} />
                      Sync
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Fetch, Pull & Push</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commit Box */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Commit message"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canCommit) {
                  handleCommit()
                }
              }}
              disabled={gitAction.isPending}
              className="flex-1"
            />
            <Button
              onClick={handleCommit}
              disabled={!canCommit || gitAction.isPending}
            >
              {gitAction.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GitCommit className="h-4 w-4 mr-2" />
              )}
              Commit
            </Button>
          </div>
          {stagedFiles.length === 0 && hasChanges && (
            <p className="text-xs text-muted-foreground mt-2">
              Stage changes before committing
            </p>
          )}
        </CardContent>
      </Card>

      {/* Changes */}
      <div className="space-y-2">
        {/* Staged Changes */}
        {stagedFiles.length > 0 && (
          <FileSection
            title="Staged Changes"
            count={stagedFiles.length}
            files={stagedFiles}
            isOpen={stagedOpen}
            onToggle={() => setStagedOpen(!stagedOpen)}
            selectedFiles={selectedFiles}
            onToggleSelect={toggleFileSelection}
            actions={
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => handleUnstage()}
                disabled={gitAction.isPending}
              >
                <Minus className="h-3 w-3 mr-1" />
                Unstage All
              </Button>
            }
            onUnstage={(file) => handleUnstage([file])}
          />
        )}

        {/* Unstaged Changes */}
        {unstagedFiles.length > 0 && (
          <FileSection
            title="Changes"
            count={unstagedFiles.length}
            files={unstagedFiles}
            isOpen={unstagedOpen}
            onToggle={() => setUnstagedOpen(!unstagedOpen)}
            selectedFiles={selectedFiles}
            onToggleSelect={toggleFileSelection}
            actions={
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => handleDiscard(unstagedFiles.map((f) => f.path))}
                  disabled={gitAction.isPending}
                >
                  <Undo2 className="h-3 w-3 mr-1" />
                  Discard All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => handleStage()}
                  disabled={gitAction.isPending}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Stage All
                </Button>
              </div>
            }
            onStage={(file) => handleStage([file])}
            onDiscard={(file) => handleDiscard([file])}
          />
        )}

        {/* Untracked Files */}
        {untrackedFiles.length > 0 && (
          <FileSection
            title="Untracked"
            count={untrackedFiles.length}
            files={untrackedFiles}
            isOpen={untrackedOpen}
            onToggle={() => setUntrackedOpen(!untrackedOpen)}
            selectedFiles={selectedFiles}
            onToggleSelect={toggleFileSelection}
            actions={
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => handleStage(untrackedFiles.map((f) => f.path))}
                disabled={gitAction.isPending}
              >
                <Plus className="h-3 w-3 mr-1" />
                Stage All
              </Button>
            }
            onStage={(file) => handleStage([file])}
          />
        )}

        {/* Clean state */}
        {!hasChanges && (
          <Card className="glass">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Working Tree Clean</h3>
              <p className="text-sm text-muted-foreground">
                No changes to commit
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Output */}
      {actionOutput && (
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              Output
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setActionOutput(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[150px]">
              <pre className="text-xs font-mono whitespace-pre-wrap text-muted-foreground">
                {actionOutput}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// File Section Component
function FileSection({
  title,
  count,
  files,
  isOpen,
  onToggle,
  selectedFiles,
  onToggleSelect,
  actions,
  onStage,
  onUnstage,
  onDiscard,
}: {
  title: string
  count: number
  files: GitFile[]
  isOpen: boolean
  onToggle: () => void
  selectedFiles: Set<string>
  onToggleSelect: (path: string) => void
  actions?: React.ReactNode
  onStage?: (file: string) => void
  onUnstage?: (file: string) => void
  onDiscard?: (file: string) => void
}) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="glass">
        <CollapsibleTrigger asChild>
          <CardHeader className="py-2 px-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{title}</span>
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              </div>
              <div onClick={(e) => e.stopPropagation()}>{actions}</div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-2 px-2">
            <div className="space-y-0.5">
              {files.map((file) => (
                <div
                  key={`${file.staged ? "staged" : "unstaged"}-${file.path}`}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/50 group"
                >
                  {statusIcons[file.status]}
                  <span className="flex-1 text-sm font-mono truncate" title={file.path}>
                    {file.oldPath ? `${file.oldPath} → ${file.path}` : file.path}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1 py-0",
                      file.status === "modified" && "text-amber-500 border-amber-500/30",
                      file.status === "added" && "text-emerald-500 border-emerald-500/30",
                      file.status === "deleted" && "text-red-500 border-red-500/30",
                      file.status === "renamed" && "text-blue-500 border-blue-500/30",
                      file.status === "untracked" && "text-muted-foreground"
                    )}
                  >
                    {statusLabels[file.status]}
                  </Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onStage && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onStage(file.path)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Stage</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {onUnstage && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onUnstage(file.path)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Unstage</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {onDiscard && file.status !== "untracked" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:text-red-500"
                              onClick={() => onDiscard(file.path)}
                            >
                              <Undo2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Discard Changes</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

"use client"

import * as React from "react"
import {
  Terminal,
  Play,
  Copy,
  Plus,
  Trash2,
  Pencil,
  Check,
  Cloud,
  CloudOff,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTerminalExtension } from "@/hooks/useTerminalExtension"
import { type Project, type ProjectCommand } from "@/lib/projects"
import { useProjectMeta } from "@/hooks/useProjectMeta"

interface ProjectCommandsProps {
  project: Project
}

const CATEGORY_COLORS: Record<string, string> = {
  dev: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  build: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  test: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  deploy: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  custom: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

// Generate npm script commands from package.json scripts
function getNpmCommands(scripts: string[] | undefined): ProjectCommand[] {
  if (!scripts) return []

  const categoryMap: Record<string, ProjectCommand["category"]> = {
    dev: "dev",
    start: "dev",
    serve: "dev",
    watch: "dev",
    build: "build",
    compile: "build",
    test: "test",
    "test:watch": "test",
    "test:coverage": "test",
    deploy: "deploy",
    publish: "deploy",
  }

  return scripts.map((script) => ({
    id: `npm-${script}`,
    name: script,
    command: `npm run ${script}`,
    category: categoryMap[script] || "custom",
  }))
}

export default function ProjectCommands({ project }: ProjectCommandsProps) {
  const { available: terminalAvailable, runCommand } = useTerminalExtension()
  const {
    meta,
    isLoading,
    isSyncing,
    syncStatus,
    addCommand,
    updateCommand,
    deleteCommand,
  } = useProjectMeta(project.slug)

  const customCommands = meta.commands
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [editingCommand, setEditingCommand] = React.useState<ProjectCommand | null>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  // Form state
  const [formName, setFormName] = React.useState("")
  const [formCommand, setFormCommand] = React.useState("")
  const [formDescription, setFormDescription] = React.useState("")
  const [formCategory, setFormCategory] = React.useState<ProjectCommand["category"]>("custom")

  // Get all commands (npm scripts + custom)
  const npmCommands = getNpmCommands(project.local?.scripts)
  const allCommands = [...npmCommands, ...customCommands]

  // Group commands by category
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, ProjectCommand[]> = {
      dev: [],
      build: [],
      test: [],
      deploy: [],
      custom: [],
    }
    allCommands.forEach((cmd) => {
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [allCommands])

  const resetForm = () => {
    setFormName("")
    setFormCommand("")
    setFormDescription("")
    setFormCategory("custom")
    setEditingCommand(null)
  }

  const handleAddCommand = () => {
    addCommand({
      name: formName,
      command: formCommand,
      description: formDescription || undefined,
      category: formCategory,
    })
    resetForm()
    setAddDialogOpen(false)
  }

  const handleUpdateCommand = () => {
    if (!editingCommand) return
    updateCommand(editingCommand.id, {
      name: formName,
      command: formCommand,
      description: formDescription || undefined,
      category: formCategory,
    })
    resetForm()
    setAddDialogOpen(false)
  }

  const handleDeleteCommand = (id: string) => {
    deleteCommand(id)
  }

  const openEditDialog = (command: ProjectCommand) => {
    setEditingCommand(command)
    setFormName(command.name)
    setFormCommand(command.command)
    setFormDescription(command.description || "")
    setFormCategory(command.category)
    setAddDialogOpen(true)
  }

  const handleRunCommand = (command: ProjectCommand) => {
    if (!terminalAvailable || !project.local?.path) return
    runCommand(command.command, {
      workingDir: project.local.path,
      name: `${project.name}: ${command.name}`,
    })
  }

  const handleCopyCommand = async (command: ProjectCommand) => {
    await navigator.clipboard.writeText(command.command)
    setCopiedId(command.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const canRun = terminalAvailable && project.local?.path

  // Sync status icon
  const SyncStatusIcon = () => {
    switch (syncStatus) {
      case "synced":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Cloud className="h-4 w-4 text-emerald-500" />
              </TooltipTrigger>
              <TooltipContent>Custom commands synced to GitHub</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "syncing":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
              </TooltipTrigger>
              <TooltipContent>Syncing...</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "error":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </TooltipTrigger>
              <TooltipContent>Sync error</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "offline":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CloudOff className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>Offline (stored locally)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Commands</h2>
          <p className="text-sm text-muted-foreground">
            Run terminal commands for this project
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SyncStatusIcon />
          <Button size="sm" onClick={() => { resetForm(); setAddDialogOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Command
          </Button>
        </div>
      </div>

      {/* No local path warning */}
      {!project.local?.path && (
        <div className="glass rounded-lg p-4 border-amber-500/30">
          <p className="text-sm text-amber-500">
            This project is not cloned locally. Commands can be copied but not run.
          </p>
        </div>
      )}

      {/* Commands by Category */}
      {Object.entries(groupedCommands).map(([category, commands]) => {
        if (commands.length === 0) return null
        return (
          <Card key={category} className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
                <Badge variant="outline" className={CATEGORY_COLORS[category]}>
                  {category}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  {commands.length} command{commands.length !== 1 ? "s" : ""}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {commands.map((cmd) => (
                  <div
                    key={cmd.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50 group hover:bg-muted/80 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{cmd.name}</span>
                        {cmd.id.startsWith("npm-") && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            npm
                          </Badge>
                        )}
                      </div>
                      <code className="text-xs text-muted-foreground font-mono block truncate">
                        {cmd.command}
                      </code>
                      {cmd.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {cmd.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Run button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={!canRun}
                        onClick={() => handleRunCommand(cmd)}
                        title={canRun ? "Run command" : "Terminal not available"}
                      >
                        <Play className="h-4 w-4 text-emerald-400" />
                      </Button>
                      {/* Copy button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopyCommand(cmd)}
                        title="Copy command"
                      >
                        {copiedId === cmd.id ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      {/* Edit/Delete for custom commands only */}
                      {cmd.id.startsWith("custom-") && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            onClick={() => openEditDialog(cmd)}
                            title="Edit command"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive"
                            onClick={() => handleDeleteCommand(cmd.id)}
                            title="Delete command"
                            disabled={isSyncing}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Empty state */}
      {allCommands.length === 0 && (
        <div className="glass rounded-lg p-8 text-center text-muted-foreground">
          <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No commands available</p>
          <p className="text-sm mt-1">
            Add custom commands or clone a project with package.json scripts
          </p>
        </div>
      )}

      {/* Add/Edit Command Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setAddDialogOpen(open) }}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>
              {editingCommand ? "Edit Command" : "Add Command"}
            </DialogTitle>
            <DialogDescription>
              {editingCommand
                ? "Update this custom command"
                : "Add a custom terminal command for this project"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Start Dev Server"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Command</label>
              <Input
                value={formCommand}
                onChange={(e) => setFormCommand(e.target.value)}
                placeholder="npm run dev"
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Category</label>
              <Select value={formCategory} onValueChange={(v) => setFormCategory(v as ProjectCommand["category"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev">Development</SelectItem>
                  <SelectItem value="build">Build</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="deploy">Deploy</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Description (optional)
              </label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Starts the development server with hot reload"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setAddDialogOpen(false) }}>
              Cancel
            </Button>
            <Button
              onClick={editingCommand ? handleUpdateCommand : handleAddCommand}
              disabled={!formName || !formCommand || isSyncing}
            >
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingCommand ? (
                "Save Changes"
              ) : (
                "Add Command"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import * as React from "react"
import {
  Plus,
  Trash2,
  GripVertical,
  CheckCircle2,
  Circle,
  Clock,
  Cloud,
  CloudOff,
  Loader2,
  AlertCircle,
  Upload,
  Columns3,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Project, type ProjectTask, type KanbanColumn } from "@/lib/projects"
import { useProjectMeta } from "@/hooks/useProjectMeta"

interface ProjectKanbanProps {
  project: Project
}

// Available column colors
const COLUMN_COLORS = [
  { id: "border-t-gray-500", label: "Gray", bg: "bg-gray-500" },
  { id: "border-t-red-500", label: "Red", bg: "bg-red-500" },
  { id: "border-t-orange-500", label: "Orange", bg: "bg-orange-500" },
  { id: "border-t-amber-500", label: "Amber", bg: "bg-amber-500" },
  { id: "border-t-yellow-500", label: "Yellow", bg: "bg-yellow-500" },
  { id: "border-t-lime-500", label: "Lime", bg: "bg-lime-500" },
  { id: "border-t-emerald-500", label: "Emerald", bg: "bg-emerald-500" },
  { id: "border-t-cyan-500", label: "Cyan", bg: "bg-cyan-500" },
  { id: "border-t-blue-500", label: "Blue", bg: "bg-blue-500" },
  { id: "border-t-indigo-500", label: "Indigo", bg: "bg-indigo-500" },
  { id: "border-t-violet-500", label: "Violet", bg: "bg-violet-500" },
  { id: "border-t-purple-500", label: "Purple", bg: "bg-purple-500" },
  { id: "border-t-pink-500", label: "Pink", bg: "bg-pink-500" },
]

// Get icon for column based on common patterns
function getColumnIcon(columnId: string, title: string): React.ReactNode {
  const lowerTitle = title.toLowerCase()
  if (lowerTitle.includes("done") || lowerTitle.includes("complete") || lowerTitle.includes("finished")) {
    return <CheckCircle2 className="h-4 w-4" />
  }
  if (lowerTitle.includes("progress") || lowerTitle.includes("doing") || lowerTitle.includes("active")) {
    return <Clock className="h-4 w-4" />
  }
  return <Circle className="h-4 w-4" />
}

export default function ProjectKanban({ project }: ProjectKanbanProps) {
  const {
    meta,
    columns,
    isLoading,
    isSyncing,
    syncStatus,
    isConfigured,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    migrateFromLocalStorage,
    hasLocalStorageData,
  } = useProjectMeta(project.slug)

  const tasks = meta.tasks

  // Task dialogs
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [addToColumn, setAddToColumn] = React.useState<string>("todo")
  const [editingTask, setEditingTask] = React.useState<ProjectTask | null>(null)
  const [deleteConfirm, setDeleteConfirm] = React.useState<ProjectTask | null>(null)
  const [draggedTask, setDraggedTask] = React.useState<ProjectTask | null>(null)
  const [dragOverColumn, setDragOverColumn] = React.useState<string | null>(null)
  const [showMigrationDialog, setShowMigrationDialog] = React.useState(false)

  // Column dialogs
  const [columnDialogOpen, setColumnDialogOpen] = React.useState(false)
  const [editingColumn, setEditingColumn] = React.useState<KanbanColumn | null>(null)
  const [deleteColumnConfirm, setDeleteColumnConfirm] = React.useState<KanbanColumn | null>(null)
  const [moveTasksToColumn, setMoveTasksToColumn] = React.useState<string>("")

  // Form state for tasks
  const [formTitle, setFormTitle] = React.useState("")
  const [formDescription, setFormDescription] = React.useState("")

  // Form state for columns
  const [columnFormTitle, setColumnFormTitle] = React.useState("")
  const [columnFormColor, setColumnFormColor] = React.useState("border-t-gray-500")

  // Check for migration on mount
  React.useEffect(() => {
    if (isConfigured && hasLocalStorageData && !isLoading) {
      setShowMigrationDialog(true)
    }
  }, [isConfigured, hasLocalStorageData, isLoading])

  const resetForm = () => {
    setFormTitle("")
    setFormDescription("")
    setEditingTask(null)
  }

  const resetColumnForm = () => {
    setColumnFormTitle("")
    setColumnFormColor("border-t-gray-500")
    setEditingColumn(null)
  }

  const handleAddTask = () => {
    addTask({
      title: formTitle,
      description: formDescription || undefined,
      status: addToColumn,
    })
    resetForm()
    setAddDialogOpen(false)
  }

  const handleUpdateTask = () => {
    if (!editingTask) return
    updateTask(editingTask.id, {
      title: formTitle,
      description: formDescription || undefined,
    })
    resetForm()
    setAddDialogOpen(false)
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
    setDeleteConfirm(null)
  }

  const openAddDialog = (column: string) => {
    resetForm()
    setAddToColumn(column)
    setAddDialogOpen(true)
  }

  const openEditDialog = (task: ProjectTask) => {
    setEditingTask(task)
    setFormTitle(task.title)
    setFormDescription(task.description || "")
    setAddToColumn(task.status)
    setAddDialogOpen(true)
  }

  // Column handlers
  const openAddColumnDialog = () => {
    resetColumnForm()
    setColumnDialogOpen(true)
  }

  const openEditColumnDialog = (column: KanbanColumn) => {
    setEditingColumn(column)
    setColumnFormTitle(column.title)
    setColumnFormColor(column.color)
    setColumnDialogOpen(true)
  }

  const handleAddColumn = () => {
    addColumn({
      title: columnFormTitle,
      color: columnFormColor,
    })
    resetColumnForm()
    setColumnDialogOpen(false)
  }

  const handleUpdateColumn = () => {
    if (!editingColumn) return
    updateColumn(editingColumn.id, {
      title: columnFormTitle,
      color: columnFormColor,
    })
    resetColumnForm()
    setColumnDialogOpen(false)
  }

  const handleDeleteColumn = () => {
    if (!deleteColumnConfirm) return
    deleteColumn(deleteColumnConfirm.id, moveTasksToColumn || undefined)
    setDeleteColumnConfirm(null)
    setMoveTasksToColumn("")
  }

  const openDeleteColumnDialog = (column: KanbanColumn) => {
    setDeleteColumnConfirm(column)
    // Default to first remaining column
    const firstOther = columns.find((c) => c.id !== column.id)
    setMoveTasksToColumn(firstOther?.id || "")
  }

  const moveColumnLeft = (columnId: string) => {
    const index = columns.findIndex((c) => c.id === columnId)
    if (index <= 0) return // Already first or not found
    const newOrder = [...columns.map((c) => c.id)]
    // Swap with previous
    ;[newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]]
    reorderColumns(newOrder)
  }

  const moveColumnRight = (columnId: string) => {
    const index = columns.findIndex((c) => c.id === columnId)
    if (index < 0 || index >= columns.length - 1) return // Already last or not found
    const newOrder = [...columns.map((c) => c.id)]
    // Swap with next
    ;[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
    reorderColumns(newOrder)
  }

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, task: ProjectTask) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", task.id)
    setTimeout(() => {
      const element = document.getElementById(`task-${task.id}`)
      if (element) {
        element.style.opacity = "0.5"
      }
    }, 0)
  }

  const handleDragEnd = () => {
    if (draggedTask) {
      const element = document.getElementById(`task-${draggedTask.id}`)
      if (element) {
        element.style.opacity = "1"
      }
    }
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumn(columnId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement
    if (!relatedTarget?.closest("[data-column]")) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== columnId) {
      moveTask(draggedTask.id, columnId)
    }
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const getColumnTasks = (columnId: string) => {
    return tasks.filter((t) => t.status === columnId)
  }

  const handleMigrate = async () => {
    await migrateFromLocalStorage()
    setShowMigrationDialog(false)
  }

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
              <TooltipContent>Synced to GitHub</TooltipContent>
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
          <h2 className="text-lg font-semibold">Kanban Board</h2>
          <p className="text-sm text-muted-foreground">
            Track tasks for this project
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openAddColumnDialog}
                  className="gap-1.5"
                >
                  <Columns3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Column</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add a new column</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex items-center gap-2">
            <SyncStatusIcon />
            <span className="text-sm text-muted-foreground">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnTasks = getColumnTasks(column.id)
          const isOver = dragOverColumn === column.id

          return (
            <div
              key={column.id}
              data-column={column.id}
              className={`glass rounded-lg p-4 border-t-4 ${column.color} transition-colors flex-shrink-0 w-72 ${
                isOver ? "bg-primary/10 ring-2 ring-primary/50" : ""
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 group/header">
                <div className="flex items-center gap-2 overflow-hidden">
                  {getColumnIcon(column.id, column.title)}
                  <span className="font-medium truncate" title={column.title}>{column.title}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex-shrink-0">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="flex items-center flex-shrink-0">
                  {/* Reorder buttons - only show when multiple columns */}
                  {columns.length > 1 && (
                    <>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover/header:opacity-50 hover:!opacity-100 disabled:!opacity-20"
                              onClick={() => moveColumnLeft(column.id)}
                              disabled={columns.findIndex((c) => c.id === column.id) === 0}
                            >
                              <ChevronLeft className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move left</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover/header:opacity-50 hover:!opacity-100 disabled:!opacity-20"
                              onClick={() => moveColumnRight(column.id)}
                              disabled={columns.findIndex((c) => c.id === column.id) === columns.length - 1}
                            >
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move right</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="w-px h-4 bg-border mx-1 opacity-0 group-hover/header:opacity-50" />
                    </>
                  )}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-50 hover:opacity-100"
                          onClick={() => openEditColumnDialog(column)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit column</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {columns.length > 1 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-50 hover:opacity-100 text-destructive"
                            onClick={() => openDeleteColumnDialog(column)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete column</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => openAddDialog(column.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2 min-h-[100px]">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    id={`task-${task.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className="bg-background/50 rounded-lg p-3 border cursor-move hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-medium text-sm cursor-pointer hover:text-primary"
                          onClick={() => openEditDialog(task)}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive"
                        onClick={() => setDeleteConfirm(task)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Empty state */}
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <p>No tasks</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => openAddDialog(column.id)}
                      className="mt-1"
                    >
                      Add one
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add/Edit Task Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setAddDialogOpen(open) }}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Add Task"}
            </DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Update this task"
                : `Add a new task to ${columns.find((c) => c.id === addToColumn)?.title || "column"}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title</label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Task title"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Description (optional)
              </label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Add more details..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setAddDialogOpen(false) }}>
              Cancel
            </Button>
            <Button
              onClick={editingTask ? handleUpdateTask : handleAddTask}
              disabled={!formTitle.trim() || isSyncing}
            >
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingTask ? (
                "Save Changes"
              ) : (
                "Add Task"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteConfirm?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDeleteTask(deleteConfirm.id)}
              disabled={isSyncing}
            >
              {isSyncing ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Migration Dialog */}
      <Dialog open={showMigrationDialog} onOpenChange={setShowMigrationDialog}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Migrate Local Data</DialogTitle>
            <DialogDescription>
              You have tasks stored locally for this project. Would you like to sync them to GitHub for cross-device access?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMigrationDialog(false)}>
              Keep Local
            </Button>
            <Button onClick={handleMigrate} disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Migrating...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Sync to GitHub
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Column Dialog */}
      <Dialog open={columnDialogOpen} onOpenChange={(open) => { if (!open) resetColumnForm(); setColumnDialogOpen(open) }}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>
              {editingColumn ? "Edit Column" : "Add Column"}
            </DialogTitle>
            <DialogDescription>
              {editingColumn
                ? "Update this column's settings"
                : "Create a new column for your Kanban board"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Column Name</label>
              <Input
                value={columnFormTitle}
                onChange={(e) => setColumnFormTitle(e.target.value)}
                placeholder="e.g., Backlog, Review, Testing"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLUMN_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setColumnFormColor(color.id)}
                    className={`w-8 h-8 rounded-full ${color.bg} transition-all ${
                      columnFormColor === color.id
                        ? "ring-2 ring-offset-2 ring-primary ring-offset-background scale-110"
                        : "hover:scale-105"
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetColumnForm(); setColumnDialogOpen(false) }}>
              Cancel
            </Button>
            <Button
              onClick={editingColumn ? handleUpdateColumn : handleAddColumn}
              disabled={!columnFormTitle.trim() || isSyncing}
            >
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingColumn ? (
                "Save Changes"
              ) : (
                "Add Column"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Column Confirmation */}
      <Dialog open={!!deleteColumnConfirm} onOpenChange={(open) => { if (!open) { setDeleteColumnConfirm(null); setMoveTasksToColumn("") } }}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Delete Column</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{deleteColumnConfirm?.title}" column?
              {getColumnTasks(deleteColumnConfirm?.id || "").length > 0 && (
                <span className="block mt-2 text-amber-500">
                  This column has {getColumnTasks(deleteColumnConfirm?.id || "").length} task(s).
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {getColumnTasks(deleteColumnConfirm?.id || "").length > 0 && (
            <div className="py-2">
              <label className="text-sm font-medium mb-1.5 block">Move tasks to:</label>
              <Select value={moveTasksToColumn} onValueChange={setMoveTasksToColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  {columns
                    .filter((c) => c.id !== deleteColumnConfirm?.id)
                    .map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteColumnConfirm(null); setMoveTasksToColumn("") }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteColumn}
              disabled={isSyncing || (getColumnTasks(deleteColumnConfirm?.id || "").length > 0 && !moveTasksToColumn)}
            >
              {isSyncing ? "Deleting..." : "Delete Column"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  StickyNote,
  ListTodo,
  FolderGit2,
  User,
  Inbox,
  RotateCw,
  AlertCircle,
  Github,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select"
import { getFile, saveFile, type GitHubError } from "@/lib/github"
import { useAuth } from "@/components/AuthProvider"
import { AuthModal } from "@/components/AuthModal"

// ============================================================================
// TYPES
// ============================================================================

interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: string
  completedAt?: string
}

interface GitHubRepo {
  name: string
  full_name: string
}

interface QuickNote {
  id: string
  project: string // "general" | "personal" | project name
  text: string
  createdAt: string
  updatedAt?: string
}

interface NotesData {
  version: number
  notes: QuickNote[]
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = "quick-tasks"
const NOTES_FILE = "quicknotes.json"

const DEFAULT_NOTES_DATA: NotesData = {
  version: 1,
  notes: [],
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function loadTasks(): Task[] {
  if (typeof window === "undefined") return []
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    // Invalid JSON
  }
  return []
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return `Today at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" })
}

// ============================================================================
// TASK ITEM COMPONENT
// ============================================================================

function TaskItem({
  task,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  task: Task
  onToggle: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}) {
  return (
    <div
      className={`group flex items-center gap-3 p-3 rounded-lg border transition-all ${
        task.completed
          ? "border-border/30 bg-muted/20 opacity-60"
          : "border-border bg-background/50 hover:border-primary/30"
      }`}
      data-tabz-item={`task-${task.id}`}
    >
      {/* Reorder buttons */}
      <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0"
          onClick={onMoveUp}
          disabled={isFirst}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0"
          onClick={onMoveDown}
          disabled={isLast}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Checkbox */}
      <button
        onClick={onToggle}
        className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full"
      >
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
        )}
      </button>

      {/* Task text */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${
            task.completed ? "line-through text-muted-foreground" : "text-foreground"
          }`}
        >
          {task.text}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
          <Clock className="h-3 w-3" />
          {task.completed && task.completedAt
            ? `Completed ${formatDate(task.completedAt)}`
            : `Added ${formatDate(task.createdAt)}`}
        </p>
      </div>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

// ============================================================================
// NOTE ITEM COMPONENT
// ============================================================================

function NoteItem({
  note,
  onDelete,
}: {
  note: QuickNote
  onDelete: () => void
}) {
  return (
    <div className="group flex items-start gap-3 p-3 rounded-lg border border-border bg-background/50 hover:border-primary/30 transition-all">
      <StickyNote className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground whitespace-pre-wrap">{note.text}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <Clock className="h-3 w-3" />
          {formatDate(note.createdAt)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

// ============================================================================
// NOTES TAB COMPONENT (GitHub Storage)
// ============================================================================

function NotesTab({ onNavigateToSettings }: { onNavigateToSettings?: () => void }) {
  const queryClient = useQueryClient()
  const { user, getGitHubToken } = useAuth()
  const [newNoteText, setNewNoteText] = React.useState("")
  const [selectedProject, setSelectedProject] = React.useState("general")
  const [showAuthModal, setShowAuthModal] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // GitHub config
  const [token, setToken] = React.useState<string | null>(null)
  const [repo, setRepo] = React.useState<string | null>(null)
  const [fileSha, setFileSha] = React.useState<string | null>(null)

  // Load token and repo
  React.useEffect(() => {
    const loadToken = async () => {
      const authToken = await getGitHubToken()
      setToken(authToken)
    }
    loadToken()
    const savedRepo = localStorage.getItem("github-notes-repo")
    setRepo(savedRepo)
  }, [user, getGitHubToken])

  // Fetch notes from GitHub
  const {
    data: notesData,
    isLoading: notesLoading,
    error: notesError,
    refetch,
  } = useQuery({
    queryKey: ["quicknotes", repo],
    queryFn: async () => {
      if (!token || !repo) return DEFAULT_NOTES_DATA
      try {
        const result = await getFile(token, repo, NOTES_FILE)
        setFileSha(result.sha)
        return JSON.parse(result.content) as NotesData
      } catch (err) {
        const githubError = err as GitHubError
        if (githubError.status === 404) {
          // File doesn't exist yet
          setFileSha(null)
          return DEFAULT_NOTES_DATA
        }
        throw err
      }
    },
    enabled: !!token && !!repo,
    staleTime: 30 * 1000,
  })

  // Fetch GitHub repos for the selector
  const { data: reposData } = useQuery({
    queryKey: ["projects-github"],
    queryFn: async () => {
      if (!token) return { repos: [], count: 0 }
      const res = await fetch("/api/projects/github", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return { repos: [], count: 0 }
      return res.json() as Promise<{ repos: GitHubRepo[]; count: number }>
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  })

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: NotesData) => {
      if (!token || !repo) throw new Error("Not configured")
      const content = JSON.stringify(data, null, 2)
      const result = await saveFile(token, repo, NOTES_FILE, content, fileSha, "Update quick notes")
      setFileSha(result.sha)
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["quicknotes", repo], data)
    },
  })

  const handleAddNote = () => {
    const text = newNoteText.trim()
    if (!text || !notesData) return

    const newNote: QuickNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      project: selectedProject,
      text,
      createdAt: new Date().toISOString(),
    }

    const updatedData: NotesData = {
      ...notesData,
      notes: [newNote, ...notesData.notes],
    }

    saveMutation.mutate(updatedData)
    setNewNoteText("")
    inputRef.current?.focus()
  }

  const handleDeleteNote = (id: string) => {
    if (!notesData) return

    const updatedData: NotesData = {
      ...notesData,
      notes: notesData.notes.filter((n) => n.id !== id),
    }

    saveMutation.mutate(updatedData)
  }

  // Group notes by project
  const groupedNotes = React.useMemo(() => {
    if (!notesData?.notes) return new Map<string, QuickNote[]>()

    const groups = new Map<string, QuickNote[]>()
    for (const note of notesData.notes) {
      const existing = groups.get(note.project) || []
      existing.push(note)
      groups.set(note.project, existing)
    }
    return groups
  }, [notesData?.notes])

  // Get display name for project
  const getProjectDisplayName = (project: string) => {
    if (project === "general") return "General"
    if (project === "personal") return "Personal"
    return project
  }

  // Get icon for project
  const getProjectIcon = (project: string) => {
    if (project === "general") return <Inbox className="h-4 w-4" />
    if (project === "personal") return <User className="h-4 w-4" />
    return <FolderGit2 className="h-4 w-4" />
  }

  const totalNotes = notesData?.notes.length || 0
  const repos = reposData?.repos || []
  const isConfigured = !!token && !!repo

  // Not logged in state
  if (!user) {
    return (
      <Card className="glass p-8 text-center">
        <Github className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Sign in to use Notes</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Notes are synced to your GitHub repository
        </p>
        <Button onClick={() => setShowAuthModal(true)}>
          <Github className="h-4 w-4 mr-2" />
          Sign in with GitHub
        </Button>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </Card>
    )
  }

  // Repo not configured state
  if (!repo) {
    return (
      <Card className="glass p-8 text-center">
        <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Configure Notes Repository</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select a GitHub repo to sync your notes
        </p>
        <Button variant="outline" onClick={onNavigateToSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Go to Settings
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add Note Input */}
      <Card className="glass p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">
                <div className="flex items-center gap-2">
                  <Inbox className="h-4 w-4" />
                  General
                </div>
              </SelectItem>
              <SelectItem value="personal">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal
                </div>
              </SelectItem>
              {repos.length > 0 && <SelectSeparator />}
              {repos.map((repo) => (
                <SelectItem key={repo.full_name} value={repo.name}>
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="h-4 w-4" />
                    {repo.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAddNote()
            }}
            className="flex gap-3 flex-1"
          >
            <Input
              ref={inputRef}
              placeholder="Quick note..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              className="flex-1"
              disabled={saveMutation.isPending}
            />
            <Button type="submit" disabled={!newNoteText.trim() || saveMutation.isPending || !isConfigured}>
              {saveMutation.isPending ? (
                <RotateCw className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {!saveMutation.isPending && "Add"}
            </Button>
          </form>
        </div>
      </Card>

      {/* Loading State */}
      {notesLoading && (
        <Card className="glass p-8 text-center">
          <RotateCw className="h-8 w-8 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading notes...</p>
        </Card>
      )}

      {/* Empty State */}
      {!notesLoading && totalNotes === 0 && (
        <Card className="glass p-8 text-center">
          <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No notes yet</h3>
          <p className="text-sm text-muted-foreground">
            Add a quick note above to get started
          </p>
        </Card>
      )}

      {/* Notes grouped by project */}
      {!notesLoading && Array.from(groupedNotes.entries()).map(([project, notes]) => (
        <div key={project} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {getProjectIcon(project)}
            {getProjectDisplayName(project)} ({notes.length})
          </h3>
          <div className="space-y-2">
            {notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onDelete={() => handleDeleteNote(note.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// TASKS TAB COMPONENT
// ============================================================================

function TasksTab() {
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [newTaskText, setNewTaskText] = React.useState("")
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [showCompleted, setShowCompleted] = React.useState(true)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Load tasks from localStorage
  React.useEffect(() => {
    setTasks(loadTasks())
    setIsLoaded(true)
  }, [])

  // Save tasks whenever they change
  React.useEffect(() => {
    if (isLoaded) {
      saveTasks(tasks)
    }
  }, [tasks, isLoaded])

  // Add a new task
  const addTask = () => {
    const text = newTaskText.trim()
    if (!text) return

    const newTask: Task = {
      id: generateId(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [newTask, ...prev])
    setNewTaskText("")
    inputRef.current?.focus()
  }

  // Toggle task completion
  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task
      )
    )
  }

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  // Move task up
  const moveUp = (index: number) => {
    if (index === 0) return
    setTasks((prev) => {
      const newTasks = [...prev]
      ;[newTasks[index - 1], newTasks[index]] = [newTasks[index], newTasks[index - 1]]
      return newTasks
    })
  }

  // Move task down
  const moveDown = (index: number) => {
    setTasks((prev) => {
      if (index >= prev.length - 1) return prev
      const newTasks = [...prev]
      ;[newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]]
      return newTasks
    })
  }

  // Clear completed tasks
  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }

  // Split tasks into pending and completed
  const pendingTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  const totalTasks = tasks.length
  const completedCount = completedTasks.length
  const pendingCount = pendingTasks.length

  return (
    <div className="space-y-6">
      {/* Add Task Input */}
      <Card className="glass p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addTask()
          }}
          className="flex gap-3"
        >
          <Input
            ref={inputRef}
            placeholder="What needs to be done?"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="flex-1"
            data-tabz-input="new-task"
          />
          <Button type="submit" disabled={!newTaskText.trim()} data-tabz-action="add-task">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>
      </Card>

      {/* Empty State */}
      {totalTasks === 0 && isLoaded && (
        <Card className="glass p-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
          <p className="text-sm text-muted-foreground">
            Add your first task above to get started
          </p>
        </Card>
      )}

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div id="tasks-pending" className="scroll-mt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Circle className="h-4 w-4" />
            To Do ({pendingCount})
          </h3>
          <div className="space-y-2" data-tabz-list="tasks">
            {pendingTasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
                onMoveUp={() => moveUp(tasks.indexOf(task))}
                onMoveDown={() => moveDown(tasks.indexOf(task))}
                isFirst={index === 0}
                isLast={index === pendingTasks.length - 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div id="tasks-completed" className="scroll-mt-6">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="text-sm font-medium text-muted-foreground flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Completed ({completedCount})
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showCompleted ? "" : "-rotate-90"}`}
              />
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompleted}
              className="text-xs h-7 gap-1 text-muted-foreground hover:text-red-400"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </Button>
          </div>
          {showCompleted && (
            <div className="space-y-2">
              {completedTasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  onMoveUp={() => moveUp(tasks.indexOf(task))}
                  onMoveDown={() => moveDown(tasks.indexOf(task))}
                  isFirst={index === 0}
                  isLast={index === completedTasks.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TasksSection({
  activeSubItem,
  onSubItemHandled,
  onNavigateToSettings,
}: {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
  onNavigateToSettings?: () => void
}) {
  const { user, getGitHubToken } = useAuth()
  const [activeTab, setActiveTab] = React.useState("tasks")

  // Handle sub-item navigation
  React.useEffect(() => {
    if (activeSubItem) {
      if (activeSubItem === "notes") {
        setActiveTab("notes")
      } else {
        const element = document.getElementById(`tasks-${activeSubItem}`)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
      onSubItemHandled?.()
    }
  }, [activeSubItem, onSubItemHandled])

  // Get repo config for notes count
  const [token, setToken] = React.useState<string | null>(null)
  const [repo, setRepo] = React.useState<string | null>(null)

  React.useEffect(() => {
    const loadToken = async () => {
      const authToken = await getGitHubToken()
      setToken(authToken)
    }
    loadToken()
    setRepo(localStorage.getItem("github-notes-repo"))
  }, [user, getGitHubToken])

  // Count notes for badge (from GitHub)
  const { data: notesData } = useQuery({
    queryKey: ["quicknotes", repo],
    queryFn: async () => {
      if (!token || !repo) return DEFAULT_NOTES_DATA
      try {
        const result = await getFile(token, repo, NOTES_FILE)
        return JSON.parse(result.content) as NotesData
      } catch {
        return DEFAULT_NOTES_DATA
      }
    },
    enabled: !!token && !!repo,
    staleTime: 30 * 1000,
  })

  const notesCount = notesData?.notes?.length || 0

  return (
    <div className="p-6" data-tabz-section="tasks">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold terminal-glow">Scratchpad</h1>
      </div>
      <p className="text-muted-foreground mb-6">Capture thoughts and track todos</p>

      <div className="max-w-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="tasks" className="gap-2">
              <ListTodo className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              <StickyNote className="h-4 w-4" />
              Notes
              {notesCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  {notesCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <TasksTab />
          </TabsContent>

          <TabsContent value="notes">
            <NotesTab onNavigateToSettings={onNavigateToSettings} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

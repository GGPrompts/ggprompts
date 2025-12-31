"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Bookmark,
  Folder,
  FolderOpen,
  FolderPlus,
  Plus,
  Search,
  Grid,
  List,
  ChevronRight,
  Home,
  Trash2,
  Pencil,
  ExternalLink,
  Settings,
  RotateCw,
  X,
  Copy,
  AppWindow,
  Terminal,
  Play,
  Check,
  MessageSquare,
  Palette,
  ClipboardPaste,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getFile, saveFile, type GitHubError } from "@/lib/github"
import { useAuth } from "@/components/AuthProvider"
import { AuthModal } from "@/components/AuthModal"
import { useTerminalExtension } from "@/hooks/useTerminalExtension"
import { Github, User } from "lucide-react"
import { toast } from "sonner"

// ============================================================================
// TYPES
// ============================================================================

// Context action for terminal bookmarks
interface TerminalContextAction {
  label: string
  command: string
}

interface BookmarkItem {
  id: string
  name: string
  url: string
  folderId: string | null
  icon?: string
  description?: string
  createdAt: string
  // Terminal integration
  type?: "link" | "terminal"
  command?: string
  workingDir?: string
  // TabzChrome-specific fields
  profile?: string           // TabzChrome terminal profile name
  autoExecute?: boolean      // Run command immediately vs paste only (default true)
  sendToChat?: boolean       // Queue in TabzChrome chat input instead
  color?: string             // Terminal tab color
  contextActions?: TerminalContextAction[]  // Additional context menu items
}

interface FolderItem {
  id: string
  name: string
  parentId: string | null
  icon?: string
}

interface BookmarksData {
  bookmarks: BookmarkItem[]
  folders: FolderItem[]
}

// ============================================================================
// CONSTANTS
// ============================================================================

const BOOKMARKS_FILE = "bookmarks.json"
const STORAGE_KEY = "bookmarks-prefs"

const DEFAULT_DATA: BookmarksData = {
  bookmarks: [],
  folders: [],
}

// Sample data for first-time users
const SAMPLE_DATA: BookmarksData = {
  folders: [
    { id: "dev", name: "Development", parentId: null, icon: "💻" },
    { id: "social", name: "Social", parentId: null, icon: "💬" },
    { id: "tools", name: "Tools", parentId: null, icon: "🔧" },
  ],
  bookmarks: [
    { id: "1", name: "GitHub", url: "https://github.com", folderId: "dev", description: "Code hosting", createdAt: new Date().toISOString() },
    { id: "2", name: "Stack Overflow", url: "https://stackoverflow.com", folderId: "dev", description: "Q&A for developers", createdAt: new Date().toISOString() },
    { id: "3", name: "Twitter", url: "https://twitter.com", folderId: "social", createdAt: new Date().toISOString() },
    { id: "4", name: "Reddit", url: "https://reddit.com", folderId: "social", createdAt: new Date().toISOString() },
  ],
}

// ============================================================================
// HELPERS
// ============================================================================

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    return ""
  }
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return url
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BookmarksSection({
  activeSubItem,
  onSubItemHandled,
  onNavigateToSettings,
}: {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
  onNavigateToSettings?: () => void
}) {
  const queryClient = useQueryClient()
  const { user, getGitHubToken } = useAuth()
  const {
    available: terminalAvailable,
    backendRunning,
    error: terminalError,
    defaultWorkDir,
    updateDefaultWorkDir,
    runCommand,
    spawnWithOptions,
    pasteToTerminal,
    sendToChat,
  } = useTerminalExtension()

  // Handler for launching terminals with toast feedback
  const handleLaunchTerminal = React.useCallback(async (
    command: string,
    options?: { workingDir?: string; name?: string }
  ) => {
    console.log("[Bookmarks] Launching terminal:", { command, options })
    const result = await runCommand(command, options)
    console.log("[Bookmarks] Terminal result:", result)
    if (result.success) {
      toast.success(`Terminal launched: ${options?.name || "Terminal"}`)
    } else {
      toast.error(result.error || "Failed to launch terminal")
    }
  }, [runCommand])

  // GitHub config
  const [token, setToken] = React.useState<string | null>(null)
  const [repo, setRepo] = React.useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = React.useState(false)

  // UI state
  const [viewMode, setViewMode] = React.useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          return JSON.parse(saved).viewMode || "grid"
        } catch {}
      }
    }
    return "grid"
  })
  const [currentFolderId, setCurrentFolderId] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showSearch, setShowSearch] = React.useState(false)
  const [workDirInput, setWorkDirInput] = React.useState(defaultWorkDir)
  const [showWorkDirEdit, setShowWorkDirEdit] = React.useState(false)

  // Sync workDirInput when defaultWorkDir changes
  React.useEffect(() => {
    setWorkDirInput(defaultWorkDir)
  }, [defaultWorkDir])

  // Dialog state
  const [addBookmarkOpen, setAddBookmarkOpen] = React.useState(false)
  const [addFolderOpen, setAddFolderOpen] = React.useState(false)
  const [editItem, setEditItem] = React.useState<BookmarkItem | FolderItem | null>(null)
  const [editType, setEditType] = React.useState<"bookmark" | "folder">("bookmark")
  const [deleteConfirm, setDeleteConfirm] = React.useState<{ item: BookmarkItem | FolderItem; type: "bookmark" | "folder" } | null>(null)

  // Form state
  const [formName, setFormName] = React.useState("")
  const [formUrl, setFormUrl] = React.useState("")
  const [formDescription, setFormDescription] = React.useState("")
  const [formFolderId, setFormFolderId] = React.useState<string>("root")
  const [formIcon, setFormIcon] = React.useState("")
  const [formType, setFormType] = React.useState<"link" | "terminal">("link")
  const [formCommand, setFormCommand] = React.useState("")
  const [formWorkingDir, setFormWorkingDir] = React.useState("")
  // TabzChrome-specific form fields
  const [formProfile, setFormProfile] = React.useState("")
  const [formAutoExecute, setFormAutoExecute] = React.useState(true)
  const [formSendToChat, setFormSendToChat] = React.useState(false)
  const [formColor, setFormColor] = React.useState("")
  const [formContextActions, setFormContextActions] = React.useState<TerminalContextAction[]>([])

  // Load token from auth, repo from localStorage
  React.useEffect(() => {
    const loadToken = async () => {
      const authToken = await getGitHubToken()
      setToken(authToken)
    }
    loadToken()

    const savedRepo = localStorage.getItem("github-bookmarks-repo")
    setRepo(savedRepo)
  }, [user, getGitHubToken])

  // Save view mode preference
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ viewMode }))
  }, [viewMode])

  // Handle sub-item navigation
  React.useEffect(() => {
    if (activeSubItem) {
      if (activeSubItem === "search") {
        setShowSearch(true)
      } else if (activeSubItem === "all") {
        setCurrentFolderId(null)
        setSearchQuery("")
        setShowSearch(false)
      }
      onSubItemHandled?.()
    }
  }, [activeSubItem, onSubItemHandled])

  // Fetch bookmarks data
  const {
    data: bookmarksData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookmarks", repo],
    queryFn: async () => {
      if (!token || !repo) return DEFAULT_DATA
      try {
        const result = await getFile(token, repo, BOOKMARKS_FILE)
        return JSON.parse(result.content) as BookmarksData
      } catch (err) {
        const githubError = err as GitHubError
        if (githubError.status === 404) {
          // File doesn't exist yet, return sample data
          return SAMPLE_DATA
        }
        throw err
      }
    },
    enabled: !!token && !!repo,
    staleTime: 5 * 60 * 1000,
  })

  // Get SHA for updates
  const [fileSha, setFileSha] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (token && repo) {
      getFile(token, repo, BOOKMARKS_FILE)
        .then((result) => setFileSha(result.sha))
        .catch(() => setFileSha(null))
    }
  }, [token, repo, bookmarksData])

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: BookmarksData) => {
      if (!token || !repo) throw new Error("Not configured")
      const content = JSON.stringify(data, null, 2)
      const result = await saveFile(token, repo, BOOKMARKS_FILE, content, fileSha, "Update bookmarks")
      setFileSha(result.sha)
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["bookmarks", repo], data)
    },
  })

  const data = bookmarksData || DEFAULT_DATA

  // Get current folder and breadcrumb path
  const currentFolder = data.folders.find((f) => f.id === currentFolderId) || null
  const getBreadcrumbs = (): FolderItem[] => {
    const crumbs: FolderItem[] = []
    let folder = currentFolder
    while (folder) {
      crumbs.unshift(folder)
      folder = data.folders.find((f) => f.id === folder?.parentId) || null
    }
    return crumbs
  }

  // Filter items for current view
  const getVisibleItems = () => {
    if (searchQuery.trim()) {
      // Search across ALL bookmarks and folders
      const query = searchQuery.toLowerCase()
      const matchingBookmarks = data.bookmarks.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.url.toLowerCase().includes(query) ||
          b.description?.toLowerCase().includes(query)
      )
      const matchingFolders = data.folders.filter((f) =>
        f.name.toLowerCase().includes(query)
      )
      return { folders: matchingFolders, bookmarks: matchingBookmarks }
    }

    // Show items in current folder
    const folders = data.folders.filter((f) => f.parentId === currentFolderId)
    const bookmarks = data.bookmarks.filter((b) => b.folderId === currentFolderId)
    return { folders, bookmarks }
  }

  const { folders: visibleFolders, bookmarks: visibleBookmarks } = getVisibleItems()

  // Count items in a folder (recursive)
  const countFolderItems = (folderId: string): number => {
    const directBookmarks = data.bookmarks.filter((b) => b.folderId === folderId).length
    const subFolders = data.folders.filter((f) => f.parentId === folderId)
    const subFolderItems = subFolders.reduce((acc, f) => acc + countFolderItems(f.id), 0)
    return directBookmarks + subFolderItems + subFolders.length
  }

  // CRUD operations
  const addBookmark = () => {
    const newBookmark: BookmarkItem = {
      id: generateId(),
      name: formName,
      url: formType === "terminal" ? `terminal://${formCommand}` : (formUrl.startsWith("http") ? formUrl : `https://${formUrl}`),
      folderId: formFolderId === "root" ? null : formFolderId,
      description: formDescription || undefined,
      icon: formIcon || undefined,
      createdAt: new Date().toISOString(),
      type: formType,
      command: formType === "terminal" ? formCommand : undefined,
      workingDir: formType === "terminal" && formWorkingDir ? formWorkingDir : undefined,
      // TabzChrome-specific fields
      profile: formType === "terminal" && formProfile ? formProfile : undefined,
      autoExecute: formType === "terminal" ? formAutoExecute : undefined,
      sendToChat: formType === "terminal" && formSendToChat ? formSendToChat : undefined,
      color: formType === "terminal" && formColor ? formColor : undefined,
      contextActions: formType === "terminal" && formContextActions.length > 0 ? formContextActions : undefined,
    }
    const newData = { ...data, bookmarks: [...data.bookmarks, newBookmark] }
    saveMutation.mutate(newData)
    resetForm()
    setAddBookmarkOpen(false)
  }

  const addFolder = () => {
    const newFolder: FolderItem = {
      id: generateId(),
      name: formName,
      parentId: formFolderId === "root" ? null : formFolderId,
      icon: formIcon || undefined,
    }
    const newData = { ...data, folders: [...data.folders, newFolder] }
    saveMutation.mutate(newData)
    resetForm()
    setAddFolderOpen(false)
  }

  const updateBookmark = () => {
    if (!editItem) return
    const updated = data.bookmarks.map((b) =>
      b.id === editItem.id
        ? {
            ...b,
            name: formName,
            url: formType === "terminal" ? `terminal://${formCommand}` : (formUrl.startsWith("http") ? formUrl : `https://${formUrl}`),
            folderId: formFolderId === "root" ? null : formFolderId,
            description: formDescription || undefined,
            icon: formIcon || undefined,
            type: formType,
            command: formType === "terminal" ? formCommand : undefined,
            workingDir: formType === "terminal" && formWorkingDir ? formWorkingDir : undefined,
            // TabzChrome-specific fields
            profile: formType === "terminal" && formProfile ? formProfile : undefined,
            autoExecute: formType === "terminal" ? formAutoExecute : undefined,
            sendToChat: formType === "terminal" && formSendToChat ? formSendToChat : undefined,
            color: formType === "terminal" && formColor ? formColor : undefined,
            contextActions: formType === "terminal" && formContextActions.length > 0 ? formContextActions : undefined,
          }
        : b
    )
    saveMutation.mutate({ ...data, bookmarks: updated })
    resetForm()
    setEditItem(null)
  }

  const updateFolder = () => {
    if (!editItem) return
    const updated = data.folders.map((f) =>
      f.id === editItem.id
        ? {
            ...f,
            name: formName,
            parentId: formFolderId === "root" ? null : formFolderId,
            icon: formIcon || undefined,
          }
        : f
    )
    saveMutation.mutate({ ...data, folders: updated })
    resetForm()
    setEditItem(null)
  }

  const deleteBookmark = (id: string) => {
    const updated = data.bookmarks.filter((b) => b.id !== id)
    saveMutation.mutate({ ...data, bookmarks: updated })
    setDeleteConfirm(null)
  }

  const deleteFolder = (id: string) => {
    // Also delete all bookmarks and subfolders in this folder
    const folderIds = [id]
    const getSubFolderIds = (parentId: string) => {
      data.folders
        .filter((f) => f.parentId === parentId)
        .forEach((f) => {
          folderIds.push(f.id)
          getSubFolderIds(f.id)
        })
    }
    getSubFolderIds(id)

    const updatedFolders = data.folders.filter((f) => !folderIds.includes(f.id))
    const updatedBookmarks = data.bookmarks.filter((b) => !folderIds.includes(b.folderId || ""))
    saveMutation.mutate({ folders: updatedFolders, bookmarks: updatedBookmarks })
    setDeleteConfirm(null)
  }

  const resetForm = () => {
    setFormName("")
    setFormUrl("")
    setFormDescription("")
    setFormFolderId(currentFolderId || "root")
    setFormIcon("")
    setFormType("link")
    setFormCommand("")
    setFormWorkingDir("")
    // Reset TabzChrome-specific fields
    setFormProfile("")
    setFormAutoExecute(true)
    setFormSendToChat(false)
    setFormColor("")
    setFormContextActions([])
  }

  const openEditBookmark = (bookmark: BookmarkItem) => {
    setEditItem(bookmark)
    setEditType("bookmark")
    setFormName(bookmark.name)
    setFormUrl(bookmark.type === "terminal" ? "" : bookmark.url)
    setFormDescription(bookmark.description || "")
    setFormFolderId(bookmark.folderId || "root")
    setFormIcon(bookmark.icon || "")
    setFormType(bookmark.type || "link")
    setFormCommand(bookmark.command || "")
    setFormWorkingDir(bookmark.workingDir || "")
    // TabzChrome-specific fields
    setFormProfile(bookmark.profile || "")
    setFormAutoExecute(bookmark.autoExecute !== false) // default true
    setFormSendToChat(bookmark.sendToChat || false)
    setFormColor(bookmark.color || "")
    setFormContextActions(bookmark.contextActions || [])
  }

  const openEditFolder = (folder: FolderItem) => {
    setEditItem(folder)
    setEditType("folder")
    setFormName(folder.name)
    setFormFolderId(folder.parentId || "root")
    setFormIcon(folder.icon || "")
  }

  // Not configured state
  if (!token || !repo) {
    if (!user) {
      return (
        <>
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Sign In to Sync Bookmarks</h2>
              <p className="text-muted-foreground mb-4">
                Sign in with GitHub to sync your bookmarks across devices.
              </p>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-[#24292e] hover:bg-[#24292e]/90 text-white"
              >
                <Github className="h-4 w-4 mr-2" />
                Sign in with GitHub
              </Button>
            </div>
          </div>
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
      )
    }

    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Configure Repository</h2>
          <p className="text-muted-foreground mb-4">
            You're signed in! Now configure which GitHub repository to use for syncing your bookmarks.
          </p>
          <Button onClick={onNavigateToSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Configure in Profile
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold terminal-glow mb-1">Bookmarks</h1>
          <p className="text-muted-foreground text-sm">
            {data.bookmarks.length} links in {data.folders.length} folders
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search toggle */}
          <Button
            variant={showSearch ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setShowSearch(!showSearch)
              if (showSearch) setSearchQuery("")
            }}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* View toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Default Working Dir */}
          <div className="hidden sm:flex items-center gap-1">
            {showWorkDirEdit ? (
              <div className="flex items-center gap-1">
                <Input
                  value={workDirInput}
                  onChange={(e) => setWorkDirInput(e.target.value)}
                  className="h-8 w-40 text-xs font-mono"
                  placeholder="~/projects"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateDefaultWorkDir(workDirInput)
                      setShowWorkDirEdit(false)
                    } else if (e.key === "Escape") {
                      setWorkDirInput(defaultWorkDir)
                      setShowWorkDirEdit(false)
                    }
                  }}
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    updateDefaultWorkDir(workDirInput)
                    setShowWorkDirEdit(false)
                  }}
                >
                  <Check className="h-4 w-4 text-emerald-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setWorkDirInput(defaultWorkDir)
                    setShowWorkDirEdit(false)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs font-mono text-muted-foreground hover:text-foreground gap-1"
                onClick={() => setShowWorkDirEdit(true)}
                title="Default working directory for terminals"
              >
                <Terminal className="h-3 w-3" />
                {defaultWorkDir}
              </Button>
            )}
          </div>

          {/* Add buttons */}
          <Button variant="outline" size="sm" onClick={() => { resetForm(); setAddFolderOpen(true) }}>
            <FolderPlus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Folder</span>
          </Button>
          <Button size="sm" onClick={() => { resetForm(); setAddBookmarkOpen(true) }}>
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add</span>
          </Button>

          {/* Refresh */}
          <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isLoading}>
            <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookmarks..."
            className="pl-10 pr-10"
            autoFocus
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Breadcrumbs */}
      {!searchQuery && (
        <div className="flex items-center gap-1 text-sm mb-4 overflow-x-auto">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => setCurrentFolderId(null)}
          >
            <Home className="h-4 w-4" />
          </Button>
          {getBreadcrumbs().map((folder, i) => (
            <React.Fragment key={folder.id}>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => setCurrentFolderId(folder.id)}
              >
                {folder.icon && <span className="mr-1">{folder.icon}</span>}
                {folder.name}
              </Button>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <RotateCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-destructive">
            Failed to load bookmarks
          </div>
        ) : visibleFolders.length === 0 && visibleBookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Bookmark className="h-12 w-12 mb-4" />
            <p>{searchQuery ? "No results found" : "No bookmarks yet"}</p>
            {!searchQuery && (
              <Button variant="outline" className="mt-4" onClick={() => { resetForm(); setAddBookmarkOpen(true) }}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first bookmark
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {visibleFolders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolderId(folder.id)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  openEditFolder(folder)
                }}
                className="group flex flex-col items-center p-3 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <div className="h-12 w-12 flex items-center justify-center text-2xl mb-1 rounded-lg bg-white/15">
                  {folder.icon || <Folder className="h-8 w-8 text-primary" />}
                </div>
                <span className="text-xs text-center line-clamp-2">{folder.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  {countFolderItems(folder.id)} items
                </span>
              </button>
            ))}
            {visibleBookmarks.map((bookmark) => (
              <ContextMenu key={bookmark.id}>
                <ContextMenuTrigger asChild>
                  {bookmark.type === "terminal" ? (
                    <button
                      data-terminal-command={bookmark.command}
                      data-tabz-action={bookmark.sendToChat ? "send-chat" : bookmark.autoExecute === false ? "paste-terminal" : "spawn-terminal"}
                      data-tabz-command={bookmark.command}
                      data-tabz-project={bookmark.workingDir}
                      data-tabz-profile={bookmark.profile}
                      data-tabz-item={`bookmark-${bookmark.id}`}
                      className="group flex flex-col items-center p-3 rounded-lg hover:bg-primary/10 transition-colors relative"
                      onClick={() => {
                        if (bookmark.sendToChat) {
                          sendToChat(bookmark.command || "")
                          toast.success("Sent to TabzChrome chat")
                        } else {
                          handleLaunchTerminal(bookmark.command || "", { workingDir: bookmark.workingDir, name: bookmark.name })
                        }
                      }}
                    >
                      {/* Color indicator bar */}
                      {bookmark.color && (
                        <div
                          className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full"
                          style={{ backgroundColor: bookmark.color }}
                        />
                      )}
                      <div className="h-12 w-12 flex items-center justify-center mb-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 relative">
                        {bookmark.icon ? (
                          <span className="text-2xl">{bookmark.icon}</span>
                        ) : bookmark.sendToChat ? (
                          <MessageSquare className="h-6 w-6 text-emerald-400" />
                        ) : bookmark.autoExecute === false ? (
                          <ClipboardPaste className="h-6 w-6 text-emerald-400" />
                        ) : (
                          <Terminal className="h-6 w-6 text-emerald-400" />
                        )}
                      </div>
                      <span className="text-xs text-center line-clamp-2">{bookmark.name}</span>
                      {/* Profile badge or working dir */}
                      {bookmark.profile ? (
                        <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 mt-0.5 font-mono">
                          {bookmark.profile}
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-muted-foreground truncate max-w-full mt-0.5 font-mono">
                          {bookmark.workingDir || <span className="italic">{defaultWorkDir}</span>}
                        </span>
                      )}
                    </button>
                  ) : (
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center p-3 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <div className="h-12 w-12 flex items-center justify-center mb-1 rounded-lg bg-white/15">
                        {bookmark.icon ? (
                          <span className="text-2xl">{bookmark.icon}</span>
                        ) : (
                          <img
                            src={getFaviconUrl(bookmark.url)}
                            alt=""
                            className="h-7 w-7"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          />
                        )}
                      </div>
                      <span className="text-xs text-center line-clamp-2">{bookmark.name}</span>
                    </a>
                  )}
                </ContextMenuTrigger>
                <ContextMenuContent className="w-56 bg-popover/95 backdrop-blur-sm">
                  {bookmark.type === "terminal" ? (
                    <>
                      {bookmark.command && (
                        <>
                          <ContextMenuItem
                            onClick={() => handleLaunchTerminal(bookmark.command!, { workingDir: bookmark.workingDir, name: bookmark.name })}
                            disabled={!terminalAvailable}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Run in Terminal
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={async () => {
                              const result = await pasteToTerminal(bookmark.command!, {
                                workingDir: bookmark.workingDir,
                                name: bookmark.name,
                                profile: bookmark.profile,
                                color: bookmark.color,
                              })
                              if (result.success) {
                                toast.success(`Command pasted to terminal`)
                              } else {
                                toast.error(result.error || "Failed to paste to terminal")
                              }
                            }}
                            disabled={!terminalAvailable}
                          >
                            <ClipboardPaste className="h-4 w-4 mr-2" />
                            Paste to Terminal
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => {
                              sendToChat(bookmark.command!)
                              toast.success("Sent to TabzChrome chat")
                            }}
                            disabled={!terminalAvailable}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send to Chat
                          </ContextMenuItem>
                        </>
                      )}
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(bookmark.command || "")
                          toast.success("Command copied")
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Command
                      </ContextMenuItem>
                      {/* Custom context actions from bookmark */}
                      {bookmark.contextActions && bookmark.contextActions.length > 0 && (
                        <>
                          <ContextMenuSeparator />
                          {bookmark.contextActions.map((action, idx) => (
                            <ContextMenuItem
                              key={idx}
                              onClick={() => handleLaunchTerminal(action.command, { workingDir: bookmark.workingDir, name: action.label })}
                              disabled={!terminalAvailable}
                            >
                              <Terminal className="h-4 w-4 mr-2" />
                              {action.label}
                            </ContextMenuItem>
                          ))}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <ContextMenuItem asChild>
                        <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in New Tab
                        </a>
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => window.open(bookmark.url, '_blank', 'noopener,noreferrer')}
                      >
                        <AppWindow className="h-4 w-4 mr-2" />
                        Open in New Window
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        onClick={() => navigator.clipboard.writeText(bookmark.url)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </ContextMenuItem>
                    </>
                  )}
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => openEditBookmark(bookmark)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </ContextMenuItem>
                  <ContextMenuItem
                    className="text-destructive"
                    onClick={() => setDeleteConfirm({ item: bookmark, type: "bookmark" })}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-1">
            {visibleFolders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors group"
              >
                <button
                  onClick={() => setCurrentFolderId(folder.id)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <div className="h-8 w-8 flex items-center justify-center text-lg flex-shrink-0 rounded-md bg-white/15">
                    {folder.icon || <Folder className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{folder.name}</p>
                    <p className="text-xs text-muted-foreground">{countFolderItems(folder.id)} items</p>
                  </div>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-popover/95 backdrop-blur-sm">
                    <DropdownMenuItem onClick={() => openEditFolder(folder)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeleteConfirm({ item: folder, type: "folder" })}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            {visibleBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors group"
              >
                {bookmark.type === "terminal" ? (
                  <button
                    data-terminal-command={bookmark.command}
                    data-tabz-action={bookmark.sendToChat ? "send-chat" : bookmark.autoExecute === false ? "paste-terminal" : "spawn-terminal"}
                    data-tabz-command={bookmark.command}
                    data-tabz-project={bookmark.workingDir}
                    data-tabz-profile={bookmark.profile}
                    data-tabz-item={`bookmark-${bookmark.id}`}
                    className="flex items-center gap-3 min-w-0 text-left"
                    onClick={() => {
                      if (bookmark.sendToChat) {
                        sendToChat(bookmark.command || "")
                        toast.success("Sent to TabzChrome chat")
                      } else {
                        handleLaunchTerminal(bookmark.command || "", { workingDir: bookmark.workingDir, name: bookmark.name })
                      }
                    }}
                  >
                    <div
                      className="h-8 w-8 flex items-center justify-center flex-shrink-0 rounded-md bg-emerald-500/20 border border-emerald-500/30"
                      style={bookmark.color ? { borderColor: bookmark.color } : undefined}
                    >
                      {bookmark.icon ? (
                        <span className="text-lg">{bookmark.icon}</span>
                      ) : bookmark.sendToChat ? (
                        <MessageSquare className="h-5 w-5 text-emerald-400" />
                      ) : bookmark.autoExecute === false ? (
                        <ClipboardPaste className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Terminal className="h-5 w-5 text-emerald-400" />
                      )}
                    </div>
                    <div className="min-w-0 w-48 lg:w-64 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{bookmark.name}</p>
                        {bookmark.profile && (
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 font-mono shrink-0">
                            {bookmark.profile}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate font-mono">{bookmark.command || <span className="italic">no command</span>}</p>
                    </div>
                    <p className="text-xs text-muted-foreground hidden lg:block w-32 lg:w-48 truncate font-mono flex-shrink-0">
                      {bookmark.workingDir || <span className="italic">{defaultWorkDir}</span>}
                    </p>
                    {bookmark.sendToChat ? (
                      <MessageSquare className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    ) : bookmark.autoExecute === false ? (
                      <ClipboardPaste className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Play className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    )}
                  </button>
                ) : (
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 min-w-0"
                  >
                    <div className="h-8 w-8 flex items-center justify-center flex-shrink-0 rounded-md bg-white/15">
                      {bookmark.icon ? (
                        <span className="text-lg">{bookmark.icon}</span>
                      ) : (
                        <img
                          src={getFaviconUrl(bookmark.url)}
                          alt=""
                          className="h-5 w-5"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      )}
                    </div>
                    <div className="min-w-0 w-48 lg:w-64 flex-shrink-0">
                      <p className="font-medium truncate">{bookmark.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{getDomain(bookmark.url)}</p>
                    </div>
                    {bookmark.description && (
                      <p className="text-xs text-muted-foreground hidden lg:block w-32 lg:w-48 truncate flex-shrink-0">
                        {bookmark.description}
                      </p>
                    )}
                  </a>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-popover/95 backdrop-blur-sm">
                    {bookmark.type === "terminal" ? (
                      <>
                        {bookmark.command && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleLaunchTerminal(bookmark.command!, { workingDir: bookmark.workingDir, name: bookmark.name })}
                              disabled={!terminalAvailable}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Run in Terminal
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                const result = await pasteToTerminal(bookmark.command!, {
                                  workingDir: bookmark.workingDir,
                                  name: bookmark.name,
                                  profile: bookmark.profile,
                                  color: bookmark.color,
                                })
                                if (result.success) {
                                  toast.success(`Command pasted to terminal`)
                                } else {
                                  toast.error(result.error || "Failed to paste to terminal")
                                }
                              }}
                              disabled={!terminalAvailable}
                            >
                              <ClipboardPaste className="h-4 w-4 mr-2" />
                              Paste to Terminal
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                sendToChat(bookmark.command!)
                                toast.success("Sent to TabzChrome chat")
                              }}
                              disabled={!terminalAvailable}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send to Chat
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(bookmark.command || "")
                            toast.success("Command copied")
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Command
                        </DropdownMenuItem>
                        {/* Custom context actions from bookmark */}
                        {bookmark.contextActions && bookmark.contextActions.length > 0 && (
                          <>
                            <DropdownMenuSeparator />
                            {bookmark.contextActions.map((action, idx) => (
                              <DropdownMenuItem
                                key={idx}
                                onClick={() => handleLaunchTerminal(action.command, { workingDir: bookmark.workingDir, name: action.label })}
                                disabled={!terminalAvailable}
                              >
                                <Terminal className="h-4 w-4 mr-2" />
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in New Tab
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => window.open(bookmark.url, '_blank', 'noopener,noreferrer')}
                        >
                          <AppWindow className="h-4 w-4 mr-2" />
                          Open in New Window
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => navigator.clipboard.writeText(bookmark.url)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openEditBookmark(bookmark)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeleteConfirm({ item: bookmark, type: "bookmark" })}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Bookmark Dialog */}
      <Dialog open={addBookmarkOpen} onOpenChange={setAddBookmarkOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Add Bookmark</DialogTitle>
            <DialogDescription>Add a web link or terminal command</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Type selector - prominent toggle between Link and Terminal */}
            <div className="mb-2">
              <div className="flex gap-2 p-1 rounded-lg bg-muted/50">
                <button
                  type="button"
                  onClick={() => setFormType("link")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                    formType === "link"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ExternalLink className="h-4 w-4" />
                  Web Link
                </button>
                <button
                  type="button"
                  onClick={() => setFormType("terminal")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                    formType === "terminal"
                      ? "bg-emerald-500/20 shadow-sm text-emerald-400 border border-emerald-500/30"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  disabled={!terminalAvailable}
                  title={!terminalAvailable ? "TabzChrome extension required" : undefined}
                >
                  <Terminal className="h-4 w-4" />
                  Terminal
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 text-center">
                {formType === "link"
                  ? "Opens a URL in a new browser tab"
                  : "Spawns a terminal with a command"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={formType === "terminal" ? "LazyGit" : "My Website"}
              />
            </div>
            {formType === "link" ? (
              <div>
                <label className="text-sm font-medium mb-1.5 block">URL</label>
                <Input
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Command</label>
                  <Input
                    value={formCommand}
                    onChange={(e) => setFormCommand(e.target.value)}
                    placeholder="lazygit"
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Working Directory</label>
                  <Input
                    value={formWorkingDir}
                    onChange={(e) => setFormWorkingDir(e.target.value)}
                    placeholder={defaultWorkDir || "~/projects"}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave blank to use page default: <code className="text-primary">{defaultWorkDir}</code>
                  </p>
                </div>
                {/* TabzChrome-specific options */}
                <div className="border-t pt-4 mt-2">
                  <p className="text-xs text-muted-foreground mb-3">TabzChrome Options</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Profile (optional)</label>
                      <Input
                        value={formProfile}
                        onChange={(e) => setFormProfile(e.target.value)}
                        placeholder="Default"
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Tab Color (optional)</label>
                      <Input
                        value={formColor}
                        onChange={(e) => setFormColor(e.target.value)}
                        placeholder="#10b981"
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="autoExecute"
                        checked={formAutoExecute}
                        onCheckedChange={(checked) => setFormAutoExecute(checked === true)}
                      />
                      <Label htmlFor="autoExecute" className="text-sm cursor-pointer">
                        Auto-execute command (run immediately)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sendToChat"
                        checked={formSendToChat}
                        onCheckedChange={(checked) => setFormSendToChat(checked === true)}
                      />
                      <Label htmlFor="sendToChat" className="text-sm cursor-pointer">
                        Send to TabzChrome chat input
                      </Label>
                    </div>
                  </div>
                  {/* Context Actions */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Context Actions (optional)</label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormContextActions([...formContextActions, { label: "", command: "" }])}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    {formContextActions.map((action, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          value={action.label}
                          onChange={(e) => {
                            const updated = [...formContextActions]
                            updated[index] = { ...updated[index], label: e.target.value }
                            setFormContextActions(updated)
                          }}
                          placeholder="Label"
                          className="text-sm flex-1"
                        />
                        <Input
                          value={action.command}
                          onChange={(e) => {
                            const updated = [...formContextActions]
                            updated[index] = { ...updated[index], command: e.target.value }
                            setFormContextActions(updated)
                          }}
                          placeholder="Command"
                          className="font-mono text-sm flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0"
                          onClick={() => {
                            setFormContextActions(formContextActions.filter((_, i) => i !== index))
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Folder</label>
              <Select value={formFolderId} onValueChange={setFormFolderId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Root</SelectItem>
                  {data.folders.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.icon && `${f.icon} `}{f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description (optional)</label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="A brief description"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Icon (optional emoji)</label>
              <Input
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
                placeholder={formType === "terminal" ? "🖥️" : "🌐"}
                className="w-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddBookmarkOpen(false)}>Cancel</Button>
            <Button
              onClick={addBookmark}
              disabled={!formName || (formType === "link" ? !formUrl : !formCommand) || saveMutation.isPending}
            >
              {saveMutation.isPending ? "Saving..." : formType === "terminal" ? "Add Command" : "Add Bookmark"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Folder Dialog */}
      <Dialog open={addFolderOpen} onOpenChange={setAddFolderOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Add Folder</DialogTitle>
            <DialogDescription>Create a new folder to organize bookmarks</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="My Folder"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Parent Folder</label>
              <Select value={formFolderId} onValueChange={setFormFolderId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Root</SelectItem>
                  {data.folders.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.icon && `${f.icon} `}{f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Icon (optional emoji)</label>
              <Input
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
                placeholder="📁"
                className="w-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFolderOpen(false)}>Cancel</Button>
            <Button onClick={addFolder} disabled={!formName || saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Add Folder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Edit {editType === "bookmark" ? "Bookmark" : "Folder"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            {editType === "bookmark" && (
              <>
                {/* Type selector - prominent toggle */}
                <div className="mb-2">
                  <div className="flex gap-2 p-1 rounded-lg bg-muted/50">
                    <button
                      type="button"
                      onClick={() => setFormType("link")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                        formType === "link"
                          ? "bg-background shadow-sm text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Web Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType("terminal")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                        formType === "terminal"
                          ? "bg-emerald-500/20 shadow-sm text-emerald-400 border border-emerald-500/30"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      disabled={!terminalAvailable}
                      title={!terminalAvailable ? "TabzChrome extension required" : undefined}
                    >
                      <Terminal className="h-4 w-4" />
                      Terminal
                    </button>
                  </div>
                </div>
                {formType === "link" ? (
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">URL</label>
                    <Input
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Command</label>
                      <Input
                        value={formCommand}
                        onChange={(e) => setFormCommand(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Working Directory</label>
                      <Input
                        value={formWorkingDir}
                        onChange={(e) => setFormWorkingDir(e.target.value)}
                        placeholder={defaultWorkDir || "~/projects"}
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Leave blank to use page default: <code className="text-primary">{defaultWorkDir}</code>
                      </p>
                    </div>
                    {/* TabzChrome-specific options */}
                    <div className="border-t pt-4 mt-2">
                      <p className="text-xs text-muted-foreground mb-3">TabzChrome Options</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Profile (optional)</label>
                          <Input
                            value={formProfile}
                            onChange={(e) => setFormProfile(e.target.value)}
                            placeholder="Default"
                            className="font-mono text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Tab Color (optional)</label>
                          <Input
                            value={formColor}
                            onChange={(e) => setFormColor(e.target.value)}
                            placeholder="#10b981"
                            className="font-mono text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 mt-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="editAutoExecute"
                            checked={formAutoExecute}
                            onCheckedChange={(checked) => setFormAutoExecute(checked === true)}
                          />
                          <Label htmlFor="editAutoExecute" className="text-sm cursor-pointer">
                            Auto-execute command (run immediately)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="editSendToChat"
                            checked={formSendToChat}
                            onCheckedChange={(checked) => setFormSendToChat(checked === true)}
                          />
                          <Label htmlFor="editSendToChat" className="text-sm cursor-pointer">
                            Send to TabzChrome chat input
                          </Label>
                        </div>
                      </div>
                      {/* Context Actions */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Context Actions (optional)</label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormContextActions([...formContextActions, { label: "", command: "" }])}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                        {formContextActions.map((action, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Input
                              value={action.label}
                              onChange={(e) => {
                                const updated = [...formContextActions]
                                updated[index] = { ...updated[index], label: e.target.value }
                                setFormContextActions(updated)
                              }}
                              placeholder="Label"
                              className="text-sm flex-1"
                            />
                            <Input
                              value={action.command}
                              onChange={(e) => {
                                const updated = [...formContextActions]
                                updated[index] = { ...updated[index], command: e.target.value }
                                setFormContextActions(updated)
                              }}
                              placeholder="Command"
                              className="font-mono text-sm flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 shrink-0"
                              onClick={() => {
                                setFormContextActions(formContextActions.filter((_, i) => i !== index))
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Description</label>
                  <Input
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                  />
                </div>
              </>
            )}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                {editType === "bookmark" ? "Folder" : "Parent Folder"}
              </label>
              <Select value={formFolderId} onValueChange={setFormFolderId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Root</SelectItem>
                  {data.folders
                    .filter((f) => f.id !== editItem?.id)
                    .map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.icon && `${f.icon} `}{f.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Icon</label>
              <Input
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
                className="w-20"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteConfirm({ item: editItem!, type: editType })
                setEditItem(null)
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
              <Button
                onClick={editType === "bookmark" ? updateBookmark : updateFolder}
                disabled={!formName || saveMutation.isPending}
              >
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Delete {deleteConfirm?.type === "bookmark" ? "Bookmark" : "Folder"}</DialogTitle>
            <DialogDescription>
              {deleteConfirm?.type === "folder"
                ? "This will also delete all bookmarks and subfolders inside this folder."
                : "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirm?.type === "bookmark") {
                  deleteBookmark(deleteConfirm.item.id)
                } else if (deleteConfirm?.type === "folder") {
                  deleteFolder(deleteConfirm.item.id)
                }
              }}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

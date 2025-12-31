"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  FileText,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Save,
  RotateCw,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  File,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  getContents,
  getFile,
  saveFile,
  deleteFile,
  getDefaultBranch,
  cacheFile,
  getCachedFile,
  getCachedFilePaths,
  type GitHubFile,
  type GitHubError,
} from "@/lib/github"
import { useAuth } from "@/components/AuthProvider"
import { AuthModal } from "@/components/AuthModal"
import { RepoSelector } from "@/components/RepoSelector"
import { Github, User, GitBranch } from "lucide-react"

// ============================================================================
// TYPES
// ============================================================================

interface FileTreeNode extends GitHubFile {
  children?: FileTreeNode[]
  isExpanded?: boolean
  isLoading?: boolean
}

interface EditorState {
  path: string
  name: string
  content: string
  originalContent: string
  sha: string
  isDirty: boolean
  isSaving: boolean
  lastSaved: Date | null
}

// ============================================================================
// CONSTANTS
// ============================================================================

const AUTO_SAVE_DELAY = 2000 // 2 seconds

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function isMarkdownFile(name: string): boolean {
  return name.toLowerCase().endsWith(".md")
}

function getFileIcon(file: GitHubFile) {
  if (file.type === "dir") {
    return Folder
  }
  if (isMarkdownFile(file.name)) {
    return FileText
  }
  return File
}

// Simple markdown to HTML converter (basic implementation)
function renderMarkdown(markdown: string): string {
  // Normalize line endings (Windows \r\n -> \n)
  let html = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // Extract code blocks first and replace with placeholders to protect from other processing
  // Use a format that won't be matched by markdown patterns (not __ which is bold)
  const codeBlocks: string[] = []
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const normalizedCode = code
      .split('\n')
      .map((line: string) => line.trimEnd())
      .join('\n')
      .replace(/\n{2,}/g, '\n')
      .trim()
    const placeholder = `\x00CODEBLOCK${codeBlocks.length}\x00`
    codeBlocks.push(`<pre class="md-pre"><code class="md-code-block">${normalizedCode.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`)
    return placeholder
  })

  html = html
    // Escape HTML (after code blocks extracted)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headers
    .replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
    // Bold and italic (order matters - do bold first)
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="md-strong">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="md-em">$1</em>')
    .replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    .replace(/__(.+?)__/g, '<strong class="md-strong">$1</strong>')
    .replace(/_(.+?)_/g, '<em class="md-em">$1</em>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del class="md-del">$1</del>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="md-img" />')
    // Links (anchor links stay in page, external links open new tab)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
      if (href.startsWith('#')) {
        return `<a href="${href}" class="md-link">${text}</a>`
      }
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="md-link">${text}</a>`
    })
    // Blockquotes (can be multi-line)
    .replace(/^> (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')
    // Task lists
    .replace(/^- \[x\] (.+)$/gm, '<li class="md-task md-task-done"><span class="md-checkbox">✓</span>$1</li>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="md-task"><span class="md-checkbox">○</span>$1</li>')
    // Unordered lists
    .replace(/^\* (.+)$/gm, '<li class="md-li">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="md-li md-li-ordered">$1</li>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="md-hr" />')
    .replace(/^\*\*\*$/gm, '<hr class="md-hr" />')
    // Paragraphs (lines with content that aren't already wrapped)
    .replace(/^(?!<[hblupid]|<li|<hr|<pre|<code|\x00)(.+)$/gm, '<p class="md-p">$1</p>')

  // Restore code blocks from placeholders
  codeBlocks.forEach((block, i) => {
    html = html.replace(`\x00CODEBLOCK${i}\x00`, block)
  })

  return html
}

// ============================================================================
// FILE TREE COMPONENT
// ============================================================================

function FileTreeItem({
  node,
  depth,
  selectedPath,
  onSelect,
  onToggleExpand,
  expandedPaths,
  repo,
  defaultBranch,
}: {
  node: FileTreeNode
  depth: number
  selectedPath: string | null
  onSelect: (file: FileTreeNode) => void
  onToggleExpand: (path: string) => void
  expandedPaths: Set<string>
  repo: string | null
  defaultBranch: string
}) {
  const Icon = getFileIcon(node)
  const isDir = node.type === "dir"
  const isExpanded = expandedPaths.has(node.path)
  const isSelected = selectedPath === node.path
  const isMarkdown = isMarkdownFile(node.name)

  const handleClick = () => {
    if (isDir) {
      onToggleExpand(node.path)
    } else if (isMarkdown) {
      onSelect(node)
    } else if (repo) {
      // Open non-markdown files on GitHub
      window.open(`https://github.com/${repo}/blob/${defaultBranch}/${node.path}`, "_blank")
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={`
          group w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors cursor-pointer
          ${isSelected ? "bg-primary/20 text-primary" : "hover:bg-primary/10 text-foreground"}
        `}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isDir && (
          <span className="flex-shrink-0">
            {node.isLoading ? (
              <RotateCw className="h-3.5 w-3.5 animate-spin" />
            ) : isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </span>
        )}
        {!isDir && <span className="w-3.5" />}
        {isDir && isExpanded ? (
          <FolderOpen className="h-4 w-4 text-primary flex-shrink-0" />
        ) : (
          <Icon className={`h-4 w-4 flex-shrink-0 ${isMarkdown ? "text-primary" : isDir ? "" : "text-muted-foreground"}`} />
        )}
        <span className="truncate flex-1">{node.name}</span>
        {!isDir && !isMarkdown && (
          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 flex-shrink-0" />
        )}
      </button>

      {isDir && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
              expandedPaths={expandedPaths}
              repo={repo}
              defaultBranch={defaultBranch}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// NO CONFIG MESSAGE
// ============================================================================

function NoConfigMessage({
  onNavigateToSettings,
  isLoggedIn,
  onShowAuth,
}: {
  onNavigateToSettings: () => void
  isLoggedIn: boolean
  onShowAuth: () => void
}) {
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="glass rounded-lg p-8 max-w-md">
          <User className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign In to Sync Notes</h2>
          <p className="text-muted-foreground mb-6">
            Sign in with GitHub to sync your notes across devices. Your notes are stored in a GitHub repository you control.
          </p>
          <Button onClick={onShowAuth} className="bg-[#24292e] hover:bg-[#24292e]/90 text-white">
            <Github className="h-4 w-4 mr-2" />
            Sign in with GitHub
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="glass rounded-lg p-8 max-w-md">
        <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Repository Not Configured</h2>
        <p className="text-muted-foreground mb-6">
          You're signed in! Now configure which GitHub repository to use for syncing your notes.
        </p>
        <Button onClick={onNavigateToSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Configure in Profile
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function QuickNotesSection({
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

  // GitHub config
  const [token, setToken] = React.useState<string | null>(null)
  const [repo, setRepo] = React.useState<string | null>(null)
  const [defaultBranch, setDefaultBranch] = React.useState<string>("main")
  const [showAuthModal, setShowAuthModal] = React.useState(false)

  // UI state
  const [expandedPaths, setExpandedPaths] = React.useState<Set<string>>(new Set([""])) // Root expanded
  const [directoryContents, setDirectoryContents] = React.useState<Map<string, GitHubFile[]>>(new Map())
  const [loadingPaths, setLoadingPaths] = React.useState<Set<string>>(new Set())
  const [selectedFile, setSelectedFile] = React.useState<FileTreeNode | null>(null)
  const [showPreview, setShowPreview] = React.useState(true)
  const [showOnlyMarkdown, setShowOnlyMarkdown] = React.useState(false)
  const [loadingAllDirs, setLoadingAllDirs] = React.useState(false)
  const [newFileName, setNewFileName] = React.useState("")
  const [newFileDialogOpen, setNewFileDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  // Editor state
  const [editor, setEditor] = React.useState<EditorState | null>(null)
  const autoSaveTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  // Load token from auth, repo from localStorage
  React.useEffect(() => {
    const loadToken = async () => {
      const authToken = await getGitHubToken()
      setToken(authToken)
    }
    loadToken()

    const savedRepo = localStorage.getItem("github-notes-repo")
    setRepo(savedRepo)
  }, [user, getGitHubToken])

  // Fetch default branch when repo changes
  React.useEffect(() => {
    if (!token || !repo) return

    const fetchBranch = async () => {
      try {
        const branch = await getDefaultBranch(token, repo)
        setDefaultBranch(branch)
      } catch {
        // Fall back to "main" if we can't fetch
        setDefaultBranch("main")
      }
    }
    fetchBranch()
  }, [token, repo])

  // Handle repo change - clear state and save to localStorage
  const handleRepoChange = React.useCallback((newRepo: string) => {
    setRepo(newRepo)
    localStorage.setItem("github-notes-repo", newRepo)
    // Clear editor and file state when switching repos
    setEditor(null)
    setSelectedFile(null)
    setDirectoryContents(new Map())
    setExpandedPaths(new Set([""]))
    // Invalidate queries to refetch for new repo
    queryClient.invalidateQueries({ queryKey: ["github-contents"] })
  }, [queryClient])

  // Handle sub-item navigation from sidebar
  React.useEffect(() => {
    if (activeSubItem) {
      const timer = setTimeout(() => {
        if (activeSubItem === "files") {
          const element = document.getElementById("notes-files")
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }
        // "recent" is not implemented yet - just clear it
        onSubItemHandled?.()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [activeSubItem, onSubItemHandled])

  // Fetch root directory
  const {
    data: rootFiles,
    isLoading: isLoadingRoot,
    error: rootError,
    refetch: refetchRoot,
  } = useQuery({
    queryKey: ["github-contents", repo, ""],
    queryFn: () => getContents(token!, repo!, ""),
    enabled: !!token && !!repo,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })

  // Handle directory expansion
  const handleToggleExpand = async (path: string) => {
    const newExpanded = new Set(expandedPaths)

    if (newExpanded.has(path)) {
      // Collapse
      newExpanded.delete(path)
      setExpandedPaths(newExpanded)
    } else {
      // Expand
      newExpanded.add(path)
      setExpandedPaths(newExpanded)

      // Fetch directory contents if not already loaded
      if (!directoryContents.has(path) && token && repo) {
        setLoadingPaths(prev => new Set(prev).add(path))
        try {
          const contents = await getContents(token, repo, path)
          setDirectoryContents(prev => new Map(prev).set(path, contents))
        } catch (error) {
          console.error("Failed to load directory:", error)
        } finally {
          setLoadingPaths(prev => {
            const next = new Set(prev)
            next.delete(path)
            return next
          })
        }
      }
    }
  }

  // Recursively load all directories and find which have markdown files
  const loadAllDirectoriesAndExpand = React.useCallback(async () => {
    if (!token || !repo || !rootFiles) return

    setLoadingAllDirs(true)
    const newContents = new Map(directoryContents)
    const foldersWithMarkdown = new Set<string>()

    // Recursive function to load a directory and its subdirectories
    const loadDir = async (files: GitHubFile[], parentPath: string): Promise<boolean> => {
      let hasMarkdown = false

      for (const file of files) {
        if (file.type === "dir") {
          // Load this directory if not already loaded
          let contents = newContents.get(file.path)
          if (!contents) {
            try {
              contents = await getContents(token, repo, file.path)
              newContents.set(file.path, contents)
            } catch {
              continue
            }
          }
          // Recursively check subdirectory
          const subHasMarkdown = await loadDir(contents, file.path)
          if (subHasMarkdown) {
            hasMarkdown = true
            foldersWithMarkdown.add(file.path)
          }
        } else if (isMarkdownFile(file.name)) {
          hasMarkdown = true
        }
      }

      return hasMarkdown
    }

    // Start from root
    const rootHasMarkdown = await loadDir(rootFiles, "")
    if (rootHasMarkdown) {
      foldersWithMarkdown.add("")
    }

    // Update state
    setDirectoryContents(newContents)
    // Expand all folders that have markdown files
    setExpandedPaths(new Set(foldersWithMarkdown))
    setLoadingAllDirs(false)
  }, [token, repo, rootFiles, directoryContents])

  // When markdown filter is toggled on, load all directories
  React.useEffect(() => {
    if (showOnlyMarkdown && rootFiles) {
      loadAllDirectoriesAndExpand()
    }
  }, [showOnlyMarkdown]) // Only trigger when filter changes, not when loadAllDirectoriesAndExpand changes

  // Check if a node or its descendants have markdown files
  const hasMarkdownDescendants = (node: FileTreeNode): boolean => {
    if (node.type !== "dir") {
      return isMarkdownFile(node.name)
    }
    if (!node.children) {
      // Not loaded yet - we don't know, so keep it visible
      return !directoryContents.has(node.path)
    }
    return node.children.some(child => hasMarkdownDescendants(child))
  }

  // Build tree structure from flat file list
  const buildTreeFromPath = (
    files: GitHubFile[],
    parentPath: string
  ): FileTreeNode[] => {
    // First, build all nodes with their children (recursively)
    const nodes = files.map((file) => {
      const node: FileTreeNode = {
        ...file,
        isExpanded: expandedPaths.has(file.path),
        isLoading: loadingPaths.has(file.path),
      }

      if (file.type === "dir" && expandedPaths.has(file.path)) {
        const contents = directoryContents.get(file.path)
        if (contents) {
          node.children = buildTreeFromPath(contents, file.path)
        }
      }

      return node
    })

    // If not filtering, return all nodes
    if (!showOnlyMarkdown) {
      return nodes
    }

    // Filter nodes based on markdown-only setting
    return nodes.filter((node) => {
      // Keep markdown files
      if (node.type !== "dir") {
        return isMarkdownFile(node.name)
      }

      // For directories: only show if they have markdown descendants
      return hasMarkdownDescendants(node)
    })
  }

  // Load file content
  const handleSelectFile = async (file: FileTreeNode) => {
    if (!token || !repo) return

    // Check for unsaved changes
    if (editor?.isDirty) {
      const confirm = window.confirm(
        "You have unsaved changes. Do you want to discard them?"
      )
      if (!confirm) return
    }

    setSelectedFile(file)

    // On mobile, scroll to the editor panel for feedback
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        const editorEl = document.getElementById("notes-editor")
        if (editorEl) {
          editorEl.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    }

    // Clear auto-save timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    try {
      // Try to get from cache first for instant display
      const cached = getCachedFile(file.path)
      if (cached) {
        setEditor({
          path: file.path,
          name: file.name,
          content: cached.content,
          originalContent: cached.content,
          sha: cached.sha,
          isDirty: false,
          isSaving: false,
          lastSaved: null,
        })
      }

      // Then fetch fresh from GitHub
      const result = await getFile(token, repo, file.path)

      // Update cache
      cacheFile({
        path: file.path,
        name: file.name,
        content: result.content,
        sha: result.sha,
        cachedAt: Date.now(),
      })

      setEditor({
        path: file.path,
        name: result.name,
        content: result.content,
        originalContent: result.content,
        sha: result.sha,
        isDirty: false,
        isSaving: false,
        lastSaved: null,
      })
    } catch (error) {
      const githubError = error as GitHubError
      console.error("Failed to load file:", githubError)

      // Try to use cached version if available
      const cached = getCachedFile(file.path)
      if (cached) {
        setEditor({
          path: file.path,
          name: file.name,
          content: cached.content,
          originalContent: cached.content,
          sha: cached.sha,
          isDirty: false,
          isSaving: false,
          lastSaved: null,
        })
      }
    }
  }

  // Handle content change with auto-save
  const handleContentChange = (newContent: string) => {
    if (!editor) return

    setEditor({
      ...editor,
      content: newContent,
      isDirty: newContent !== editor.originalContent,
    })

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    // Set new auto-save timer
    if (newContent !== editor.originalContent) {
      autoSaveTimerRef.current = setTimeout(() => {
        handleSave(newContent)
      }, AUTO_SAVE_DELAY)
    }
  }

  // Save file mutation
  const saveMutation = useMutation({
    mutationFn: async ({
      content,
      sha,
    }: {
      content: string
      sha: string
    }) => {
      if (!token || !repo || !editor) throw new Error("Not configured")
      return saveFile(
        token,
        repo,
        editor.path,
        content,
        sha,
        `Update ${editor.name} from homepage`
      )
    },
    onSuccess: (result, variables) => {
      if (!editor) return

      // Update cache
      cacheFile({
        path: editor.path,
        name: editor.name,
        content: variables.content,
        sha: result.sha,
        cachedAt: Date.now(),
      })

      setEditor({
        ...editor,
        sha: result.sha,
        originalContent: variables.content,
        isDirty: false,
        isSaving: false,
        lastSaved: new Date(),
      })
    },
    onError: (error) => {
      console.error("Save failed:", error)
      if (editor) {
        setEditor({
          ...editor,
          isSaving: false,
        })
      }
    },
  })

  // Handle save
  const handleSave = (content?: string) => {
    if (!editor) return

    const contentToSave = content ?? editor.content

    setEditor({
      ...editor,
      isSaving: true,
    })

    saveMutation.mutate({
      content: contentToSave,
      sha: editor.sha,
    })
  }

  // Create new file mutation
  const createFileMutation = useMutation({
    mutationFn: async (filePath: string) => {
      if (!token || !repo) throw new Error("Not configured")

      // Use the path as-is (user can type folder/note.md)
      const fileName = filePath.includes("/")
        ? filePath.substring(filePath.lastIndexOf("/") + 1)
        : filePath

      return saveFile(
        token,
        repo,
        filePath,
        `# ${fileName.replace(".md", "")}\n\n`,
        null,
        `Create ${fileName} from homepage`
      )
    },
    onSuccess: () => {
      setNewFileDialogOpen(false)
      setNewFileName("")
      // Refetch the current directory
      refetchRoot()
    },
  })

  // Delete file mutation
  const deleteFileMutation = useMutation({
    mutationFn: async () => {
      if (!token || !repo || !editor) throw new Error("Not configured")
      return deleteFile(
        token,
        repo,
        editor.path,
        editor.sha,
        `Delete ${editor.name} from homepage`
      )
    },
    onSuccess: () => {
      setDeleteDialogOpen(false)
      setEditor(null)
      setSelectedFile(null)
      refetchRoot()
    },
  })

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [])

  // If not configured, show message
  if (!token || !repo) {
    return (
      <>
        <NoConfigMessage
          onNavigateToSettings={onNavigateToSettings || (() => {})}
          isLoggedIn={!!user}
          onShowAuth={() => setShowAuthModal(true)}
        />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    )
  }

  // Build file tree
  const fileTree = rootFiles ? buildTreeFromPath(rootFiles, "") : []

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 p-4 lg:p-6" data-tabz-section="quick-notes">
      {/* File Browser Panel */}
      <div id="notes-files" className="lg:w-72 flex-shrink-0 scroll-mt-6">
        <div className="glass rounded-lg p-4 h-full flex flex-col">
          {/* Repo Selector */}
          <div className="mb-4">
            <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              Repository
            </label>
            <RepoSelector
              value={repo || ""}
              onValueChange={handleRepoChange}
              token={token}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Files
            </h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${showOnlyMarkdown ? "text-primary" : ""}`}
                onClick={() => setShowOnlyMarkdown(!showOnlyMarkdown)}
                disabled={loadingAllDirs}
                title={showOnlyMarkdown ? "Show all files" : "Show only .md files (loads all folders)"}
              >
                {loadingAllDirs ? (
                  <RotateCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileText className={`h-3.5 w-3.5 ${showOnlyMarkdown ? "text-primary" : ""}`} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  setDirectoryContents(new Map())
                  refetchRoot()
                }}
                disabled={isLoadingRoot}
              >
                <RotateCw
                  className={`h-3.5 w-3.5 ${isLoadingRoot ? "animate-spin" : ""}`}
                />
              </Button>
              <Dialog open={newFileDialogOpen} onOpenChange={setNewFileDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass">
                  <DialogHeader>
                    <DialogTitle>New Note</DialogTitle>
                    <DialogDescription>
                      Create a new markdown file (use folder/name.md for subfolders)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="folder/note.md"
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                      autoFocus
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setNewFileDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        const name = newFileName.endsWith(".md")
                          ? newFileName
                          : `${newFileName}.md`
                        createFileMutation.mutate(name)
                      }}
                      disabled={!newFileName || createFileMutation.isPending}
                    >
                      {createFileMutation.isPending ? (
                        <RotateCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* File Tree */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingRoot ? (
              <div className="flex items-center justify-center py-8">
                <RotateCw className="h-6 w-6 animate-spin text-primary/50" />
              </div>
            ) : rootError ? (
              <div className="text-center py-8 text-sm text-red-400">
                <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                Failed to load files
              </div>
            ) : (
              <div className="space-y-0.5" data-tabz-list="notes">
                {fileTree.map((node) => (
                  <FileTreeItem
                    key={node.path}
                    node={node}
                    depth={0}
                    selectedPath={selectedFile?.path || null}
                    onSelect={handleSelectFile}
                    onToggleExpand={handleToggleExpand}
                    expandedPaths={expandedPaths}
                    repo={repo}
                    defaultBranch={defaultBranch}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Repo info */}
          <div className="pt-3 mt-3 border-t border-border/20">
            <a
              href={`https://github.com/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="truncate">{repo}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Editor Panel */}
      <div id="notes-editor" className="flex-1 flex flex-col min-w-0 scroll-mt-4">
        {editor ? (
          <div className="glass rounded-lg flex flex-col h-full overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between p-3 border-b border-border/20">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="font-medium text-sm truncate">{editor.name}</span>
                {editor.isDirty && (
                  <Badge variant="outline" className="text-[10px] px-1.5">
                    Unsaved
                  </Badge>
                )}
                {editor.isSaving && (
                  <Badge variant="outline" className="text-[10px] px-1.5 text-amber-400">
                    <RotateCw className="h-3 w-3 animate-spin mr-1" />
                    Saving...
                  </Badge>
                )}
                {editor.lastSaved && !editor.isDirty && !editor.isSaving && (
                  <Badge variant="outline" className="text-[10px] px-1.5 text-emerald-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Saved
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="h-8"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      Preview
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSave()}
                  disabled={!editor.isDirty || editor.isSaving}
                  className="h-8"
                  data-tabz-action="save-note"
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save
                </Button>
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass">
                    <DialogHeader>
                      <DialogTitle>Delete Note</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{editor.name}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteFileMutation.mutate()}
                        disabled={deleteFileMutation.isPending}
                      >
                        {deleteFileMutation.isPending ? (
                          <RotateCw className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-hidden">
              {showPreview ? (
                <div
                  className="md-preview h-full overflow-y-auto p-4"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(editor.content) }}
                />
              ) : (
                <textarea
                  value={editor.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-full p-4 bg-transparent resize-none focus:outline-none font-mono text-sm"
                  placeholder="Start writing..."
                  spellCheck={false}
                  data-tabz-input="note-editor"
                />
              )}
            </div>

            {/* Editor Footer */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-border/20 text-xs text-muted-foreground">
              <span>{editor.content.length} characters</span>
              <div className="flex items-center gap-3">
                {editor.lastSaved && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last saved{" "}
                    {editor.lastSaved.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
                <span className="text-[10px]">Auto-save enabled</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass rounded-lg flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-20" />
            <p>Select a file to edit</p>
            <p className="text-sm">or create a new note</p>
          </div>
        )}
      </div>
    </div>
  )
}

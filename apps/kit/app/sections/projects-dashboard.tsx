"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  FolderGit2,
  Terminal,
  ExternalLink,
  Github,
  RotateCw,
  Search,
  ChevronUp,
  ChevronDown,
  Star,
  GitBranch,
  Clock,
  Code,
  Filter,
  ArrowUpDown,
  CircleAlert,
  FolderOpen,
  X,
  Info,
  Pin,
  PinOff,
  Loader2,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  SkipForward,
  Save,
  FileText,
  MessageSquare,
  Columns,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/AuthProvider"
import { AuthModal } from "@/components/AuthModal"
import { useTerminalExtension } from "@/hooks/useTerminalExtension"
import { toast } from "sonner"
import {
  mergeProjects,
  getStatusBadge,
  getGitStatusBadge,
  type Project,
  type GitHubRepo,
  type LocalProject,
} from "@/lib/projects"
import { useAllProjectsMeta } from "@/hooks/useProjectMeta"
import type { JobStreamEvent, CreateJobRequest } from "@/lib/jobs/types"

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function SortableHeader({
  column,
  children,
}: {
  column: { getIsSorted: () => false | "asc" | "desc"; toggleSorting: (desc?: boolean) => void }
  children: React.ReactNode
}) {
  const sorted = column.getIsSorted()
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {children}
      {sorted === "asc" ? (
        <ChevronUp className="ml-2 h-4 w-4" />
      ) : sorted === "desc" ? (
        <ChevronDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
      )}
    </Button>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProjectsDashboard({
  activeSubItem,
  onSubItemHandled,
  onNavigateToSection,
}: {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
  onNavigateToSection?: (section: string, repo?: string) => void
}) {
  const { user, getGitHubToken } = useAuth()
  const { available: terminalAvailable, runCommand } = useTerminalExtension()
  const { isPinned, togglePinned, isConfigured: metaConfigured, isSyncing: metaSyncing } = useAllProjectsMeta()

  // Handler for launching terminals with toast feedback
  const handleLaunchTerminal = React.useCallback(async (
    command: string,
    options?: { workingDir?: string; name?: string }
  ) => {
    const result = await runCommand(command, options)
    if (result.success) {
      toast.success(`Launched: ${options?.name || "Terminal"}`)
    } else {
      toast.error(result.error || "Failed to launch")
    }
  }, [runCommand])
  const [showAuthModal, setShowAuthModal] = React.useState(false)

  const queryClient = useQueryClient()

  // Column visibility - persisted in localStorage
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('projects-column-visibility')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          // Ignore parse errors
        }
      }
    }
    // Default: show all columns
    return {}
  })

  // Persist column visibility changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('projects-column-visibility', JSON.stringify(columnVisibility))
    }
  }, [columnVisibility])

  // Column labels for the visibility dropdown
  const columnLabels: Record<string, string> = {
    select: "Select",
    name: "Name",
    branch: "Branch",
    techStack: "Tech Stack",
    stars: "Stars",
    issues: "Issues",
    pushed_at: "Updated",
    actions: "Actions",
  }

  // Table state
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "pushed_at", desc: true },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  // Filters - persisted in localStorage
  const [statusFilter, setStatusFilter] = React.useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('projects-status-filter') || 'all'
    }
    return 'all'
  })
  const [techFilter, setTechFilter] = React.useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('projects-tech-filter')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          // Ignore parse errors
        }
      }
    }
    return []
  })

  // Persist filter changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('projects-status-filter', statusFilter)
    }
  }, [statusFilter])

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('projects-tech-filter', JSON.stringify(techFilter))
    }
  }, [techFilter])

  // Batch prompt modal state
  const [batchPromptOpen, setBatchPromptOpen] = React.useState(false)
  const [batchPrompt, setBatchPrompt] = React.useState("")
  const [saveAsJob, setSaveAsJob] = React.useState(false)
  const [jobName, setJobName] = React.useState("")
  const [isRunningBatch, setIsRunningBatch] = React.useState(false)
  const [batchProgress, setBatchProgress] = React.useState<{
    path: string
    name: string
    status: 'pending' | 'running' | 'skipped' | 'complete' | 'error'
    output: string
    error?: string
    needsHuman?: boolean
  }[]>([])

  // Handle sub-item navigation
  React.useEffect(() => {
    if (activeSubItem) {
      onSubItemHandled?.()
    }
  }, [activeSubItem, onSubItemHandled])

  // Fetch GitHub repos
  const {
    data: githubData,
    isLoading: githubLoading,
    error: githubError,
    refetch: refetchGithub,
  } = useQuery({
    queryKey: ["projects-github"],
    queryFn: async () => {
      const token = await getGitHubToken()
      if (!token) return { repos: [] as GitHubRepo[], count: 0 }

      const res = await fetch("/api/projects/github", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to fetch repos")
      }
      return res.json() as Promise<{ repos: GitHubRepo[]; count: number }>
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  // Fetch local projects
  const {
    data: localData,
    isLoading: localLoading,
    error: localError,
    refetch: refetchLocal,
  } = useQuery({
    queryKey: ["projects-local"],
    queryFn: async () => {
      const res = await fetch("/api/projects/local")
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to scan projects")
      }
      return res.json() as Promise<{ projects: LocalProject[]; count: number }>
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  // Merge projects
  const projects = React.useMemo(() => {
    return mergeProjects(githubData?.repos || [], localData?.projects || [])
  }, [githubData?.repos, localData?.projects])

  // Get unique tech stacks for filter
  const allTechStacks = React.useMemo(() => {
    const techs = new Set<string>()
    projects.forEach((p) => p.techStack.forEach((t) => techs.add(t)))
    return Array.from(techs).sort()
  }, [projects])

  // Filter and sort projects (pinned first)
  const filteredProjects = React.useMemo(() => {
    let filtered = projects

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => {
        if (statusFilter === "cloned") return p.source === "both"
        if (statusFilter === "remote") return p.source === "github"
        if (statusFilter === "local") return p.source === "local"
        if (statusFilter === "dirty") return p.local?.git?.status === "dirty"
        if (statusFilter === "archived") return p.github?.archived
        if (statusFilter === "pinned") return isPinned(p.slug)
        return true
      })
    }

    // Tech filter
    if (techFilter.length > 0) {
      filtered = filtered.filter((p) =>
        techFilter.some((tech) => p.techStack.includes(tech))
      )
    }

    // Sort pinned projects to top (stable sort)
    return [...filtered].sort((a, b) => {
      const aPinned = isPinned(a.slug)
      const bPinned = isPinned(b.slug)
      if (aPinned && !bPinned) return -1
      if (!aPinned && bPinned) return 1
      return 0
    })
  }, [projects, statusFilter, techFilter, isPinned])

  // Table columns
  const columns = React.useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            data-tabz-action="select-all"
          />
        ),
        cell: ({ row }) => {
          // Only allow selecting projects with local paths
          const hasLocal = !!row.original.local
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              disabled={!hasLocal}
              aria-label="Select row"
              className={!hasLocal ? "opacity-30" : ""}
              data-tabz-action="select"
            />
          )
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
        cell: ({ row }) => {
          const project = row.original
          const badge = getStatusBadge(project)
          const pinned = isPinned(project.slug)
          return (
            <div className="flex items-center gap-2">
              {pinned ? (
                <Pin className="h-4 w-4 text-amber-500 flex-shrink-0" />
              ) : (
                <FolderGit2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="font-medium truncate hover:text-primary hover:underline"
                  >
                    {project.name}
                  </Link>
                  <Badge variant={badge.variant} className="text-[10px] px-1.5 py-0">
                    {badge.label}
                  </Badge>
                  {project.github?.private && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      Private
                    </Badge>
                  )}
                </div>
                {project.description && (
                  <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          )
        },
        filterFn: (row, _, filterValue) => {
          const project = row.original
          const search = filterValue.toLowerCase()
          return (
            project.name.toLowerCase().includes(search) ||
            project.description?.toLowerCase().includes(search) ||
            false
          )
        },
      },
      {
        accessorKey: "branch",
        header: "Branch",
        cell: ({ row }) => {
          const project = row.original
          const git = project.local?.git
          if (!git) return <span className="text-muted-foreground">-</span>

          const statusBadge = getGitStatusBadge(git.status)
          return (
            <div className="flex items-center gap-2">
              <GitBranch className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-sm">{git.branch}</span>
              <span className={`text-xs ${statusBadge.color}`}>{statusBadge.label}</span>
              {(git.ahead > 0 || git.behind > 0) && (
                <span className="text-xs text-muted-foreground">
                  {git.ahead > 0 && `+${git.ahead}`}
                  {git.ahead > 0 && git.behind > 0 && "/"}
                  {git.behind > 0 && `-${git.behind}`}
                </span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "techStack",
        header: "Tech",
        cell: ({ row }) => {
          const stack = row.original.techStack
          if (stack.length === 0) return <span className="text-muted-foreground">-</span>
          return (
            <div className="flex flex-wrap gap-1">
              {stack.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {tech}
                </Badge>
              ))}
              {stack.length > 3 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  +{stack.length - 3}
                </Badge>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "stars",
        header: ({ column }) => <SortableHeader column={column}>Stars</SortableHeader>,
        accessorFn: (row) => row.github?.stargazers_count ?? 0,
        cell: ({ row }) => {
          const stars = row.original.github?.stargazers_count
          if (stars === undefined) return <span className="text-muted-foreground">-</span>
          return (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-400" />
              <span>{stars}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "issues",
        header: ({ column }) => <SortableHeader column={column}>Issues</SortableHeader>,
        accessorFn: (row) => row.github?.open_issues_count ?? 0,
        cell: ({ row }) => {
          const issues = row.original.github?.open_issues_count
          if (issues === undefined) return <span className="text-muted-foreground">-</span>
          return (
            <div className="flex items-center gap-1">
              <CircleAlert className="h-3 w-3 text-muted-foreground" />
              <span>{issues}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "pushed_at",
        header: ({ column }) => <SortableHeader column={column}>Updated</SortableHeader>,
        accessorFn: (row) => row.github?.pushed_at || row.local?.lastModified || "",
        cell: ({ row }) => {
          const date = row.original.github?.pushed_at || row.original.local?.lastModified
          if (!date) return <span className="text-muted-foreground">-</span>
          const d = new Date(date)
          const now = new Date()
          const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))

          let relative = ""
          if (diffDays === 0) relative = "Today"
          else if (diffDays === 1) relative = "Yesterday"
          else if (diffDays < 7) relative = `${diffDays}d ago`
          else if (diffDays < 30) relative = `${Math.floor(diffDays / 7)}w ago`
          else if (diffDays < 365) relative = `${Math.floor(diffDays / 30)}mo ago`
          else relative = `${Math.floor(diffDays / 365)}y ago`

          return (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{relative}</span>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const project = row.original
          const pinned = isPinned(project.slug)
          return (
            <div className="flex items-center gap-1">
              {/* Pin/Unpin - only if meta is configured */}
              {metaConfigured && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => togglePinned(project.slug)}
                        disabled={metaSyncing}
                        data-tabz-action={pinned ? "unpin" : "pin"}
                      >
                        {pinned ? (
                          <PinOff className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Pin className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {pinned ? "Unpin project" : "Pin to top"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {/* Terminal - only if local */}
              {project.local && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleLaunchTerminal("", { workingDir: project.local!.path, name: project.name })}
                  title={terminalAvailable ? "Open Terminal" : "Terminal not connected"}
                  disabled={!terminalAvailable}
                  data-tabz-action="open-terminal"
                  data-tabz-project={project.local.path}
                >
                  <Terminal className="h-4 w-4" />
                </Button>
              )}
              {/* VS Code - only if local */}
              {project.local && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleLaunchTerminal(`code "${project.local!.path}"`, { name: `VS Code: ${project.name}` })}
                  title={terminalAvailable ? "Open in VS Code" : "Terminal not connected"}
                  disabled={!terminalAvailable}
                  data-tabz-action="open-vscode"
                >
                  <Code className="h-4 w-4" />
                </Button>
              )}
              {/* Browse files with TFE - only if local */}
              {project.local && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    handleLaunchTerminal("tfe", { workingDir: project.local!.path, name: `TFE: ${project.name}` })
                  }}
                  title={terminalAvailable ? "Browse Files (TFE)" : "Terminal not connected"}
                  disabled={!terminalAvailable}
                  data-tabz-action="open-folder"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              )}
              {/* Chat - only if both local and remote (cloned) */}
              {project.source === 'both' && project.local && onNavigateToSection && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onNavigateToSection("ai-workspace", project.local!.path)}
                        data-tabz-action="open-chat"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Chat with Claude</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {/* Docs - only if has github */}
              {project.github && onNavigateToSection && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          // Set the repo for Quick Notes and navigate
                          localStorage.setItem("github-notes-repo", project.github!.full_name)
                          onNavigateToSection("notes")
                        }}
                        data-tabz-action="open-docs"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Browse Docs</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {/* GitHub - only if has github */}
              {project.github && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                  data-tabz-action="open-github"
                >
                  <a
                    href={project.github.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open on GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {/* Details */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                asChild
                data-tabz-action="view-details"
              >
                <Link href={`/projects/${project.slug}`} title="View Details">
                  <Info className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )
        },
      },
    ],
    [terminalAvailable, handleLaunchTerminal, isPinned, togglePinned, metaConfigured, metaSyncing, onNavigateToSection]
  )

  // TanStack Table instance
  const table = useReactTable({
    data: filteredProjects,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.slug,
    enableRowSelection: (row) => !!row.original.local, // Only local projects can be selected
  })

  // Get selected projects with local paths
  const selectedProjects = React.useMemo(() => {
    return Object.keys(rowSelection)
      .map((slug) => filteredProjects.find((p) => p.slug === slug))
      .filter((p): p is Project => !!p && !!p.local)
  }, [rowSelection, filteredProjects])

  const isLoading = githubLoading || localLoading
  const hasError = githubError || localError

  // Not signed in state
  if (!user) {
    return (
      <>
        <div className="h-full flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <FolderGit2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign In for Full Features</h2>
            <p className="text-muted-foreground mb-4">
              Sign in with GitHub to see all your repositories. Local projects are still available.
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
    <div className="h-full flex flex-col p-4 lg:p-6" data-tabz-section="projects">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold terminal-glow mb-1">Projects</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Loading projects...</span>
              </>
            ) : (
              <>
                {filteredProjects.length} projects
                {githubData?.count ? ` (${githubData.count} GitHub` : ""}
                {localData?.count ? `, ${localData.count} local)` : githubData?.count ? ")" : ""}
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Batch Prompt - visible when items selected */}
          {selectedProjects.length > 0 && (
            <Button
              onClick={() => {
                setBatchPromptOpen(true)
                setBatchPrompt("")
                setSaveAsJob(false)
                setJobName("")
              }}
              data-tabz-action="open-batch-prompt"
              data-tabz-count={selectedProjects.length}
            >
              <Play className="h-4 w-4 mr-2" />
              Batch Prompt ({selectedProjects.length})
            </Button>
          )}

          {/* Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchGithub()
              refetchLocal()
            }}
            disabled={isLoading}
            data-tabz-action="refresh-projects"
          >
            <RotateCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 h-9"
            data-tabz-input="project-search"
          />
          {globalFilter && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setGlobalFilter("")}
              data-tabz-action="clear-search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Status filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] h-9" data-tabz-input="status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" data-tabz-action="filter-status-all">All Status</SelectItem>
            <SelectItem value="pinned" data-tabz-action="filter-status-pinned">Pinned</SelectItem>
            <SelectItem value="cloned" data-tabz-action="filter-status-cloned">Cloned</SelectItem>
            <SelectItem value="remote" data-tabz-action="filter-status-remote">Remote Only</SelectItem>
            <SelectItem value="local" data-tabz-action="filter-status-local">Local Only</SelectItem>
            <SelectItem value="dirty" data-tabz-action="filter-status-dirty">Modified</SelectItem>
            <SelectItem value="archived" data-tabz-action="filter-status-archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* Tech filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9" data-tabz-action="open-tech-filter">
              <Filter className="h-4 w-4 mr-2" />
              Tech
              {techFilter.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                  {techFilter.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48" data-tabz-list="tech-filters">
            <DropdownMenuLabel>Filter by Tech</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allTechStacks.map((tech) => (
              <DropdownMenuCheckboxItem
                key={tech}
                checked={techFilter.includes(tech)}
                onCheckedChange={(checked) => {
                  setTechFilter(
                    checked
                      ? [...techFilter, tech]
                      : techFilter.filter((t) => t !== tech)
                  )
                }}
                data-tabz-action={`filter-tech-${tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                {tech}
              </DropdownMenuCheckboxItem>
            ))}
            {techFilter.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTechFilter([])} data-tabz-action="clear-tech-filter">
                  Clear all
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9" data-tabz-action="open-columns">
              <Columns className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48" data-tabz-list="column-visibility">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table.getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  data-tabz-action={`toggle-column-${column.id}`}
                >
                  {columnLabels[column.id] || column.id}
                </DropdownMenuCheckboxItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setColumnVisibility({})}
              data-tabz-action="show-all-columns"
            >
              Show all
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear filters */}
        {(statusFilter !== "all" || techFilter.length > 0 || globalFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusFilter("all")
              setTechFilter([])
              setGlobalFilter("")
            }}
            className="h-9 text-muted-foreground"
            data-tabz-action="clear-all-filters"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Error state */}
      {hasError && (
        <div className="glass rounded-lg p-4 mb-4 border-destructive/50">
          <p className="text-sm text-destructive">
            {githubError instanceof Error ? githubError.message : ""}
            {localError instanceof Error ? localError.message : ""}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto glass rounded-lg" data-tabz-list="projects">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={columns.length}>
                    <div className="h-12 bg-muted/20 rounded animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <FolderGit2 className="h-12 w-12 mb-4" />
                    <p>No projects found</p>
                    {(statusFilter !== "all" || techFilter.length > 0) && (
                      <Button
                        variant="link"
                        onClick={() => {
                          setStatusFilter("all")
                          setTechFilter([])
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-tabz-item={`project-${row.original.slug}`}
                  data-tabz-selected={row.getIsSelected() ? "true" : undefined}
                  data-tabz-source={row.original.source}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer stats */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div>
          Showing {table.getRowModel().rows.length} of {projects.length} projects
          {selectedProjects.length > 0 && (
            <span className="ml-2 text-primary">
              • {selectedProjects.length} selected
            </span>
          )}
        </div>
        {!terminalAvailable && (
          <div className="flex items-center gap-1">
            <Terminal className="h-3 w-3" />
            <span>Terminal extension not detected</span>
          </div>
        )}
      </div>

      {/* Batch Prompt Modal */}
      <BatchPromptModal
        open={batchPromptOpen}
        onClose={() => {
          setBatchPromptOpen(false)
          setIsRunningBatch(false)
          setBatchProgress([])
        }}
        projects={selectedProjects}
        prompt={batchPrompt}
        setPrompt={setBatchPrompt}
        saveAsJob={saveAsJob}
        setSaveAsJob={setSaveAsJob}
        jobName={jobName}
        setJobName={setJobName}
        isRunning={isRunningBatch}
        setIsRunning={setIsRunningBatch}
        progress={batchProgress}
        setProgress={setBatchProgress}
        onComplete={() => {
          queryClient.invalidateQueries({ queryKey: ['jobs'] })
          setRowSelection({})
        }}
      />
    </div>
  )
}

// ============================================================================
// BATCH PROMPT MODAL
// ============================================================================

interface BatchPromptModalProps {
  open: boolean
  onClose: () => void
  projects: Project[]
  prompt: string
  setPrompt: (prompt: string) => void
  saveAsJob: boolean
  setSaveAsJob: (save: boolean) => void
  jobName: string
  setJobName: (name: string) => void
  isRunning: boolean
  setIsRunning: (running: boolean) => void
  progress: {
    path: string
    name: string
    status: 'pending' | 'running' | 'skipped' | 'complete' | 'error'
    output: string
    error?: string
    needsHuman?: boolean
  }[]
  setProgress: React.Dispatch<React.SetStateAction<{
    path: string
    name: string
    status: 'pending' | 'running' | 'skipped' | 'complete' | 'error'
    output: string
    error?: string
    needsHuman?: boolean
  }[]>>
  onComplete: () => void
}

function BatchPromptModal({
  open,
  onClose,
  projects,
  prompt,
  setPrompt,
  saveAsJob,
  setSaveAsJob,
  jobName,
  setJobName,
  isRunning,
  setIsRunning,
  progress,
  setProgress,
  onComplete,
}: BatchPromptModalProps) {
  const queryClient = useQueryClient()
  const [expandedProject, setExpandedProject] = React.useState<string | null>(null)
  const abortControllerRef = React.useRef<AbortController | null>(null)

  // Save job mutation
  const saveJobMutation = useMutation({
    mutationFn: async (data: CreateJobRequest) => {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to save job')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })

  const projectPaths = projects.map((p) => p.local!.path)

  const handleRun = async () => {
    if (!prompt.trim() || projectPaths.length === 0) return

    // Save as job first if requested
    if (saveAsJob && jobName.trim()) {
      await saveJobMutation.mutateAsync({
        name: jobName.trim(),
        prompt: prompt.trim(),
        projectPaths,
        trigger: 'manual',
      })
    }

    // Initialize progress
    setProgress(
      projects.map((p) => ({
        path: p.local!.path,
        name: p.name,
        status: 'pending',
        output: '',
      }))
    )
    setIsRunning(true)

    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/jobs/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          projectPaths,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) throw new Error('Failed to start job')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue
          const data = line.slice(6)

          try {
            const event: JobStreamEvent = JSON.parse(data)
            handleEvent(event)
          } catch {
            // Ignore parse errors
          }
        }
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') return

      console.error('Batch run error:', error)
      setProgress((prev) =>
        prev.map((p) =>
          p.status === 'pending' || p.status === 'running'
            ? { ...p, status: 'error', error: (error as Error).message }
            : p
        )
      )
    } finally {
      onComplete()
    }
  }

  const handleEvent = (event: JobStreamEvent) => {
    setProgress((prev) => {
      const idx = prev.findIndex((p) => p.path === event.project)
      if (idx === -1) return prev

      const updated = [...prev]
      const project = { ...updated[idx] }

      switch (event.type) {
        case 'pre-check':
          project.status = event.skipped ? 'skipped' : 'pending'
          break
        case 'start':
          project.status = 'running'
          break
        case 'content':
          project.output += event.text || ''
          break
        case 'complete':
          project.status = 'complete'
          project.needsHuman = event.needsHuman
          if (event.error) {
            project.status = 'error'
            project.error = event.error
          }
          break
        case 'error':
          project.status = 'error'
          project.error = event.error
          break
      }

      updated[idx] = project
      return updated
    })
  }

  const handleCancel = () => {
    abortControllerRef.current?.abort()
    setIsRunning(false)
  }

  const isDone = isRunning && progress.every(
    (p) => p.status === 'complete' || p.status === 'skipped' || p.status === 'error'
  )
  const hasErrors = progress.some((p) => p.status === 'error')
  const needsHuman = progress.some((p) => p.needsHuman)

  return (
    <Dialog open={open} onOpenChange={(open) => !open && !isRunning && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col" data-tabz-region="batch-prompt-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isRunning && !isDone && <Loader2 className="h-4 w-4 animate-spin" />}
            {isDone && hasErrors && <XCircle className="h-4 w-4 text-destructive" />}
            {isDone && needsHuman && !hasErrors && (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
            {isDone && !hasErrors && !needsHuman && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            {isRunning ? 'Running Batch Prompt' : 'Batch Prompt'}
          </DialogTitle>
          <DialogDescription>
            {isRunning
              ? `Running on ${projects.length} projects...`
              : `Send a prompt to ${projects.length} selected projects`}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {!isRunning ? (
            <div className="space-y-6 py-4">
              {/* Selected projects */}
              <div className="space-y-2">
                <Label>Selected Projects ({projects.length})</Label>
                <div className="flex flex-wrap gap-1">
                  {projects.map((p) => (
                    <Badge key={p.slug} variant="secondary">
                      {p.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Prompt */}
              <div className="space-y-2">
                <Label htmlFor="batch-prompt">Prompt</Label>
                <Textarea
                  id="batch-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter the prompt to run on all selected projects..."
                  className="min-h-[150px]"
                  data-tabz-input="batch-prompt"
                />
              </div>

              {/* Save as job option */}
              <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="save-as-job"
                    checked={saveAsJob}
                    onCheckedChange={(checked) => setSaveAsJob(!!checked)}
                    data-tabz-action="toggle-save-job"
                  />
                  <Label htmlFor="save-as-job" className="cursor-pointer">
                    Save as job for later
                  </Label>
                </div>

                {saveAsJob && (
                  <div className="space-y-2 pl-6">
                    <Label htmlFor="job-name">Job Name</Label>
                    <Input
                      id="job-name"
                      value={jobName}
                      onChange={(e) => setJobName(e.target.value)}
                      placeholder="e.g., Weekly Code Review"
                      data-tabz-input="job-name"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2 py-4" data-tabz-list="batch-progress">
              {progress.map((project) => (
                <Card
                  key={project.path}
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                    expandedProject === project.path ? 'border-primary' : ''
                  }`}
                  onClick={() =>
                    setExpandedProject(
                      expandedProject === project.path ? null : project.path
                    )
                  }
                  data-tabz-item={`batch-${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  data-tabz-status={project.status}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    {project.status === 'pending' && (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    {project.status === 'running' && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                    {project.status === 'skipped' && (
                      <SkipForward className="h-4 w-4 text-muted-foreground" />
                    )}
                    {project.status === 'complete' && !project.needsHuman && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {project.status === 'complete' && project.needsHuman && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    {project.status === 'error' && (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{project.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {project.status === 'pending' && 'Waiting...'}
                        {project.status === 'running' && 'Running Claude...'}
                        {project.status === 'skipped' && 'Skipped'}
                        {project.status === 'complete' &&
                          (project.needsHuman ? 'Needs review' : 'Complete')}
                        {project.status === 'error' && project.error}
                      </div>
                    </div>
                  </CardContent>

                  {expandedProject === project.path && project.output && (
                    <CardContent className="pt-0 pb-3 px-3">
                      <pre className="text-xs font-mono whitespace-pre-wrap max-h-[200px] overflow-auto p-2 bg-muted/50 rounded">
                        {project.output}
                      </pre>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          {!isRunning ? (
            <>
              <Button variant="outline" onClick={onClose} data-tabz-action="cancel-batch">
                Cancel
              </Button>
              <Button
                onClick={handleRun}
                disabled={!prompt.trim() || (saveAsJob && !jobName.trim())}
                data-tabz-action="run-batch"
              >
                <Play className="h-4 w-4 mr-2" />
                Run Now
              </Button>
            </>
          ) : isDone ? (
            <Button onClick={onClose} data-tabz-action="close-batch">Close</Button>
          ) : (
            <Button variant="destructive" onClick={handleCancel} data-tabz-action="abort-batch">
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

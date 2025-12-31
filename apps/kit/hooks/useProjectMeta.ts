"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/components/AuthProvider"
import {
  type ProjectsMetaFile,
  type ProjectMeta,
  type ProjectTask,
  type ProjectLink,
  type ProjectCommand,
  type KanbanColumn,
  DEFAULT_PROJECT_META,
  DEFAULT_PROJECTS_META,
  DEFAULT_KANBAN_COLUMNS,
} from "@/lib/projects"

// ============================================================================
// CONSTANTS
// ============================================================================

const QUERY_KEY = "projects-meta"
const REPO_STORAGE_KEY = "github-bookmarks-repo" // Same as bookmarks
const LOCAL_STORAGE_PREFIX = "project-"

// ============================================================================
// TYPES
// ============================================================================

type SyncStatus = "synced" | "syncing" | "offline" | "error"

interface UseProjectMetaReturn {
  // Data
  meta: ProjectMeta
  allMeta: ProjectsMetaFile | null
  columns: KanbanColumn[]

  // Status
  isLoading: boolean
  isSyncing: boolean
  syncStatus: SyncStatus
  isConfigured: boolean

  // Task operations
  addTask: (task: Omit<ProjectTask, "id" | "createdAt" | "updatedAt">) => void
  updateTask: (taskId: string, updates: Partial<ProjectTask>) => void
  deleteTask: (taskId: string) => void
  moveTask: (taskId: string, newStatus: string) => void

  // Column operations
  addColumn: (column: Omit<KanbanColumn, "id" | "order">) => void
  updateColumn: (columnId: string, updates: Partial<Omit<KanbanColumn, "id">>) => void
  deleteColumn: (columnId: string, moveTasksTo?: string) => void
  reorderColumns: (columnIds: string[]) => void

  // Link operations
  addLink: (link: Omit<ProjectLink, "id">) => void
  updateLink: (linkId: string, updates: Partial<ProjectLink>) => void
  deleteLink: (linkId: string) => void

  // Command operations
  addCommand: (command: Omit<ProjectCommand, "id">) => void
  updateCommand: (commandId: string, updates: Partial<ProjectCommand>) => void
  deleteCommand: (commandId: string) => void

  // Pin operations
  togglePinned: () => void

  // Migration
  migrateFromLocalStorage: () => Promise<void>
  hasLocalStorageData: boolean

  // Refetch
  refetch: () => void
}

// ============================================================================
// LOCAL STORAGE HELPERS
// ============================================================================

function getLocalStorageKey(slug: string, type: "tasks" | "links" | "commands"): string {
  return `${LOCAL_STORAGE_PREFIX}${type}-${slug}`
}

function loadFromLocalStorage(slug: string): ProjectMeta {
  if (typeof window === "undefined") return DEFAULT_PROJECT_META

  try {
    const tasks = localStorage.getItem(getLocalStorageKey(slug, "tasks"))
    const links = localStorage.getItem(getLocalStorageKey(slug, "links"))
    const commands = localStorage.getItem(getLocalStorageKey(slug, "commands"))

    return {
      pinned: false, // Pinned wasn't in localStorage before
      tasks: tasks ? JSON.parse(tasks) : [],
      links: links ? JSON.parse(links) : [],
      commands: commands ? JSON.parse(commands) : [],
    }
  } catch {
    return DEFAULT_PROJECT_META
  }
}

function saveToLocalStorage(slug: string, meta: ProjectMeta): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(getLocalStorageKey(slug, "tasks"), JSON.stringify(meta.tasks))
    localStorage.setItem(getLocalStorageKey(slug, "links"), JSON.stringify(meta.links))
    localStorage.setItem(getLocalStorageKey(slug, "commands"), JSON.stringify(meta.commands))
  } catch {
    // Ignore storage errors
  }
}

function clearLocalStorage(slug: string): void {
  if (typeof window === "undefined") return

  localStorage.removeItem(getLocalStorageKey(slug, "tasks"))
  localStorage.removeItem(getLocalStorageKey(slug, "links"))
  localStorage.removeItem(getLocalStorageKey(slug, "commands"))
}

function hasLocalData(slug: string): boolean {
  if (typeof window === "undefined") return false

  const tasks = localStorage.getItem(getLocalStorageKey(slug, "tasks"))
  const links = localStorage.getItem(getLocalStorageKey(slug, "links"))
  const commands = localStorage.getItem(getLocalStorageKey(slug, "commands"))

  const hasTasks = tasks && JSON.parse(tasks).length > 0
  const hasLinks = links && JSON.parse(links).length > 0
  const hasCommands = commands && JSON.parse(commands).length > 0

  return !!(hasTasks || hasLinks || hasCommands)
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useProjectMeta(projectSlug: string): UseProjectMetaReturn {
  const queryClient = useQueryClient()
  const { user, getGitHubToken } = useAuth()

  const [token, setToken] = useState<string | null>(null)
  const [repo, setRepo] = useState<string | null>(null)
  const [fileSha, setFileSha] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("offline")

  // Load token and repo
  useEffect(() => {
    const loadAuth = async () => {
      const authToken = await getGitHubToken()
      setToken(authToken)
    }
    loadAuth()

    const savedRepo = localStorage.getItem(REPO_STORAGE_KEY)
    setRepo(savedRepo)
  }, [user, getGitHubToken])

  const isConfigured = !!(token && repo)

  // Fetch metadata from sync repo
  const {
    data: remoteData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY, repo],
    queryFn: async (): Promise<ProjectsMetaFile> => {
      if (!token || !repo) throw new Error("Not configured")

      const res = await fetch(`/api/projects/meta?repo=${encodeURIComponent(repo)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to fetch metadata")
      }

      const result = await res.json()
      setFileSha(result.sha)
      return result.data
    },
    enabled: isConfigured,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  })

  // Update sync status based on query state
  useEffect(() => {
    if (!isConfigured) {
      setSyncStatus("offline")
    } else if (error) {
      setSyncStatus("error")
    } else if (isLoading) {
      setSyncStatus("syncing")
    } else {
      setSyncStatus("synced")
    }
  }, [isConfigured, isLoading, error])

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: ProjectsMetaFile) => {
      if (!token || !repo) throw new Error("Not configured")

      setSyncStatus("syncing")

      const res = await fetch(`/api/projects/meta?repo=${encodeURIComponent(repo)}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, sha: fileSha }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to save metadata")
      }

      const result = await res.json()
      setFileSha(result.sha)
      return result.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, repo], data)
      setSyncStatus("synced")
    },
    onError: () => {
      setSyncStatus("error")
    },
  })

  // Get current project's metadata
  const currentMeta: ProjectMeta = isConfigured && remoteData
    ? (remoteData.projects[projectSlug] || DEFAULT_PROJECT_META)
    : loadFromLocalStorage(projectSlug)

  // Helper to update project metadata
  const updateProjectMeta = useCallback(
    (updater: (current: ProjectMeta) => ProjectMeta) => {
      const newMeta = updater(currentMeta)

      if (isConfigured && remoteData) {
        // Update in sync repo
        const newData: ProjectsMetaFile = {
          ...remoteData,
          projects: {
            ...remoteData.projects,
            [projectSlug]: newMeta,
          },
          updatedAt: new Date().toISOString(),
        }

        // Optimistic update
        queryClient.setQueryData([QUERY_KEY, repo], newData)

        // Persist to server
        saveMutation.mutate(newData)
      } else {
        // Fallback to localStorage
        saveToLocalStorage(projectSlug, newMeta)
        // Force re-render by updating query cache with local data
        queryClient.setQueryData([QUERY_KEY, null], null)
      }
    },
    [currentMeta, isConfigured, remoteData, projectSlug, repo, queryClient, saveMutation]
  )

  // ============================================================================
  // TASK OPERATIONS
  // ============================================================================

  const addTask = useCallback(
    (task: Omit<ProjectTask, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString()
      const newTask: ProjectTask = {
        ...task,
        id: `task-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      }

      updateProjectMeta((meta) => ({
        ...meta,
        tasks: [...meta.tasks, newTask],
      }))
    },
    [updateProjectMeta]
  )

  const updateTask = useCallback(
    (taskId: string, updates: Partial<ProjectTask>) => {
      updateProjectMeta((meta) => ({
        ...meta,
        tasks: meta.tasks.map((t) =>
          t.id === taskId
            ? { ...t, ...updates, updatedAt: new Date().toISOString() }
            : t
        ),
      }))
    },
    [updateProjectMeta]
  )

  const deleteTask = useCallback(
    (taskId: string) => {
      updateProjectMeta((meta) => ({
        ...meta,
        tasks: meta.tasks.filter((t) => t.id !== taskId),
      }))
    },
    [updateProjectMeta]
  )

  const moveTask = useCallback(
    (taskId: string, newStatus: string) => {
      updateTask(taskId, { status: newStatus })
    },
    [updateTask]
  )

  // ============================================================================
  // COLUMN OPERATIONS
  // ============================================================================

  // Get columns with fallback to defaults
  const columns: KanbanColumn[] = currentMeta.columns?.length
    ? [...currentMeta.columns].sort((a, b) => a.order - b.order)
    : DEFAULT_KANBAN_COLUMNS

  const addColumn = useCallback(
    (column: Omit<KanbanColumn, "id" | "order">) => {
      const currentColumns = currentMeta.columns?.length
        ? currentMeta.columns
        : DEFAULT_KANBAN_COLUMNS

      const maxOrder = Math.max(...currentColumns.map((c) => c.order), -1)
      const newColumn: KanbanColumn = {
        ...column,
        id: `col-${Date.now()}`,
        order: maxOrder + 1,
      }

      updateProjectMeta((meta) => ({
        ...meta,
        columns: [...currentColumns, newColumn],
      }))
    },
    [currentMeta.columns, updateProjectMeta]
  )

  const updateColumn = useCallback(
    (columnId: string, updates: Partial<Omit<KanbanColumn, "id">>) => {
      const currentColumns = currentMeta.columns?.length
        ? currentMeta.columns
        : DEFAULT_KANBAN_COLUMNS

      updateProjectMeta((meta) => ({
        ...meta,
        columns: currentColumns.map((c) =>
          c.id === columnId ? { ...c, ...updates } : c
        ),
      }))
    },
    [currentMeta.columns, updateProjectMeta]
  )

  const deleteColumn = useCallback(
    (columnId: string, moveTasksTo?: string) => {
      const currentColumns = currentMeta.columns?.length
        ? currentMeta.columns
        : DEFAULT_KANBAN_COLUMNS

      // Don't allow deleting the last column
      if (currentColumns.length <= 1) return

      // Find the first remaining column to move tasks to if not specified
      const targetColumnId = moveTasksTo || currentColumns.find((c) => c.id !== columnId)?.id

      updateProjectMeta((meta) => ({
        ...meta,
        columns: currentColumns
          .filter((c) => c.id !== columnId)
          .map((c, idx) => ({ ...c, order: idx })), // Re-order
        tasks: targetColumnId
          ? meta.tasks.map((t) =>
              t.status === columnId ? { ...t, status: targetColumnId, updatedAt: new Date().toISOString() } : t
            )
          : meta.tasks.filter((t) => t.status !== columnId), // Delete orphaned tasks if no target
      }))
    },
    [currentMeta.columns, updateProjectMeta]
  )

  const reorderColumns = useCallback(
    (columnIds: string[]) => {
      const currentColumns = currentMeta.columns?.length
        ? currentMeta.columns
        : DEFAULT_KANBAN_COLUMNS

      // Create a map for quick lookup
      const columnMap = new Map(currentColumns.map((c) => [c.id, c]))

      // Reorder based on the provided order
      const reordered = columnIds
        .map((id, idx) => {
          const col = columnMap.get(id)
          return col ? { ...col, order: idx } : null
        })
        .filter((c): c is KanbanColumn => c !== null)

      updateProjectMeta((meta) => ({
        ...meta,
        columns: reordered,
      }))
    },
    [currentMeta.columns, updateProjectMeta]
  )

  // ============================================================================
  // LINK OPERATIONS
  // ============================================================================

  const addLink = useCallback(
    (link: Omit<ProjectLink, "id">) => {
      const newLink: ProjectLink = {
        ...link,
        id: `link-${Date.now()}`,
      }

      updateProjectMeta((meta) => ({
        ...meta,
        links: [...meta.links, newLink],
      }))
    },
    [updateProjectMeta]
  )

  const updateLink = useCallback(
    (linkId: string, updates: Partial<ProjectLink>) => {
      updateProjectMeta((meta) => ({
        ...meta,
        links: meta.links.map((l) =>
          l.id === linkId ? { ...l, ...updates } : l
        ),
      }))
    },
    [updateProjectMeta]
  )

  const deleteLink = useCallback(
    (linkId: string) => {
      updateProjectMeta((meta) => ({
        ...meta,
        links: meta.links.filter((l) => l.id !== linkId),
      }))
    },
    [updateProjectMeta]
  )

  // ============================================================================
  // COMMAND OPERATIONS
  // ============================================================================

  const addCommand = useCallback(
    (command: Omit<ProjectCommand, "id">) => {
      const newCommand: ProjectCommand = {
        ...command,
        id: `custom-${Date.now()}`,
      }

      updateProjectMeta((meta) => ({
        ...meta,
        commands: [...meta.commands, newCommand],
      }))
    },
    [updateProjectMeta]
  )

  const updateCommand = useCallback(
    (commandId: string, updates: Partial<ProjectCommand>) => {
      updateProjectMeta((meta) => ({
        ...meta,
        commands: meta.commands.map((c) =>
          c.id === commandId ? { ...c, ...updates } : c
        ),
      }))
    },
    [updateProjectMeta]
  )

  const deleteCommand = useCallback(
    (commandId: string) => {
      updateProjectMeta((meta) => ({
        ...meta,
        commands: meta.commands.filter((c) => c.id !== commandId),
      }))
    },
    [updateProjectMeta]
  )

  // ============================================================================
  // PIN OPERATIONS
  // ============================================================================

  const togglePinned = useCallback(() => {
    updateProjectMeta((meta) => ({
      ...meta,
      pinned: !meta.pinned,
    }))
  }, [updateProjectMeta])

  // ============================================================================
  // MIGRATION
  // ============================================================================

  const hasLocalStorageData = hasLocalData(projectSlug)

  const migrateFromLocalStorage = useCallback(async () => {
    if (!isConfigured || !remoteData) return

    const localData = loadFromLocalStorage(projectSlug)

    // Only migrate if there's local data and remote is empty
    const remoteMeta = remoteData.projects[projectSlug]
    if (
      (localData.tasks.length > 0 ||
        localData.links.length > 0 ||
        localData.commands.length > 0) &&
      (!remoteMeta ||
        (remoteMeta.tasks.length === 0 &&
          remoteMeta.links.length === 0 &&
          remoteMeta.commands.length === 0))
    ) {
      // Merge local into remote
      const newData: ProjectsMetaFile = {
        ...remoteData,
        projects: {
          ...remoteData.projects,
          [projectSlug]: {
            pinned: remoteMeta?.pinned || false,
            tasks: [...(remoteMeta?.tasks || []), ...localData.tasks],
            links: [...(remoteMeta?.links || []), ...localData.links],
            commands: [...(remoteMeta?.commands || []), ...localData.commands],
          },
        },
        updatedAt: new Date().toISOString(),
      }

      // Save to remote
      await saveMutation.mutateAsync(newData)

      // Clear localStorage after successful migration
      clearLocalStorage(projectSlug)
    }
  }, [isConfigured, remoteData, projectSlug, saveMutation])

  return {
    meta: currentMeta,
    allMeta: remoteData || null,
    columns,
    isLoading,
    isSyncing: saveMutation.isPending,
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
    addLink,
    updateLink,
    deleteLink,
    addCommand,
    updateCommand,
    deleteCommand,
    togglePinned,
    migrateFromLocalStorage,
    hasLocalStorageData,
    refetch,
  }
}

// ============================================================================
// HOOK FOR ACCESSING ALL PROJECT METADATA (for pinned status in dashboard)
// ============================================================================

export function useAllProjectsMeta(): {
  meta: ProjectsMetaFile | null
  isLoading: boolean
  isSyncing: boolean
  isConfigured: boolean
  getPinnedSlugs: () => string[]
  isPinned: (slug: string) => boolean
  togglePinned: (slug: string) => void
} {
  const queryClient = useQueryClient()
  const { user, getGitHubToken } = useAuth()
  const [token, setToken] = useState<string | null>(null)
  const [repo, setRepo] = useState<string | null>(null)
  const [fileSha, setFileSha] = useState<string | null>(null)

  useEffect(() => {
    const loadAuth = async () => {
      const authToken = await getGitHubToken()
      setToken(authToken)
    }
    loadAuth()

    const savedRepo = localStorage.getItem(REPO_STORAGE_KEY)
    setRepo(savedRepo)
  }, [user, getGitHubToken])

  const isConfigured = !!(token && repo)

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY, repo],
    queryFn: async (): Promise<ProjectsMetaFile> => {
      if (!token || !repo) throw new Error("Not configured")

      const res = await fetch(`/api/projects/meta?repo=${encodeURIComponent(repo)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to fetch metadata")
      }

      const result = await res.json()
      setFileSha(result.sha)
      return result.data
    },
    enabled: isConfigured,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  // Save mutation for toggling pinned status
  const saveMutation = useMutation({
    mutationFn: async (newData: ProjectsMetaFile) => {
      if (!token || !repo) throw new Error("Not configured")

      const res = await fetch(`/api/projects/meta?repo=${encodeURIComponent(repo)}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: newData, sha: fileSha }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to save metadata")
      }

      const result = await res.json()
      setFileSha(result.sha)
      return result.data
    },
    onSuccess: (savedData) => {
      queryClient.setQueryData([QUERY_KEY, repo], savedData)
    },
  })

  const getPinnedSlugs = useCallback(() => {
    if (!data) return []
    return Object.entries(data.projects)
      .filter(([_, meta]) => meta.pinned)
      .map(([slug]) => slug)
  }, [data])

  const isPinned = useCallback(
    (slug: string) => {
      if (!data) return false
      return data.projects[slug]?.pinned || false
    },
    [data]
  )

  const togglePinned = useCallback(
    (slug: string) => {
      if (!isConfigured || !data) return

      const currentMeta = data.projects[slug] || DEFAULT_PROJECT_META
      const newData: ProjectsMetaFile = {
        ...data,
        projects: {
          ...data.projects,
          [slug]: {
            ...currentMeta,
            pinned: !currentMeta.pinned,
          },
        },
        updatedAt: new Date().toISOString(),
      }

      // Optimistic update
      queryClient.setQueryData([QUERY_KEY, repo], newData)

      // Persist
      saveMutation.mutate(newData)
    },
    [isConfigured, data, repo, queryClient, saveMutation]
  )

  return {
    meta: data || null,
    isLoading,
    isSyncing: saveMutation.isPending,
    isConfigured,
    getPinnedSlugs,
    isPinned,
    togglePinned,
  }
}

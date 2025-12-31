"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Play,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  FolderGit2,
  Trash2,
  Edit2,
  Loader2,
  Terminal,
  SkipForward,
  RefreshCw,
  Inbox,
  Circle,
  ArrowLeft,
  Eye,
  EyeOff,
  Bot,
  Zap,
  Sparkles,
  Pin,
} from "lucide-react"
import type { Job, JobTrigger, JobBackend, PreCheck, JobStreamEvent, CreateJobRequest, JobResult, ProjectRunResult } from "@/lib/jobs/types"
import type { LocalProject } from "@/lib/projects"
import { useJobResults } from "@/hooks/useJobResults"
import { useAllProjectsMeta } from "@/hooks/useProjectMeta"

// ============================================================================
// HELPERS
// ============================================================================

function getStatusIcon(status: Job['status']) {
  switch (status) {
    case 'running':
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />
    case 'needs-human':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />
    case 'error':
      return <XCircle className="h-4 w-4 text-destructive" />
    default:
      return <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
  }
}

function getStatusBadge(status: Job['status']) {
  switch (status) {
    case 'running':
      return { label: 'Running', variant: 'default' as const }
    case 'needs-human':
      return { label: 'Needs Review', variant: 'outline' as const, className: 'border-amber-500 text-amber-500' }
    case 'error':
      return { label: 'Error', variant: 'destructive' as const }
    default:
      return { label: 'Idle', variant: 'secondary' as const }
  }
}

function getTriggerLabel(trigger: JobTrigger) {
  switch (trigger) {
    case 'on-login':
      return 'On Login'
    case 'on-device-change':
      return 'On Device Change'
    case 'before-first-prompt':
      return 'Before First Prompt'
    default:
      return 'Manual'
  }
}

function getBackendIcon(backend: JobBackend) {
  switch (backend) {
    case 'codex':
      return <Zap className="h-4 w-4" />
    case 'gemini':
      return <Sparkles className="h-4 w-4" />
    case 'claude':
    default:
      return <Bot className="h-4 w-4" />
  }
}

function getBackendLabel(backend: JobBackend) {
  switch (backend) {
    case 'codex':
      return 'Codex'
    case 'gemini':
      return 'Gemini'
    case 'claude':
    default:
      return 'Claude'
  }
}

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return 'Never'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

// ============================================================================
// JOB CREATION/EDIT MODAL
// ============================================================================

interface JobModalProps {
  open: boolean
  onClose: () => void
  job?: Job | null
  projects: LocalProject[]
  projectsLoading?: boolean
}

function JobModal({ open, onClose, job, projects, projectsLoading }: JobModalProps) {
  const queryClient = useQueryClient()
  const { isPinned, isConfigured: metaConfigured } = useAllProjectsMeta()
  const isEditing = !!job

  // Form state
  const [name, setName] = React.useState(job?.name || '')
  const [prompt, setPrompt] = React.useState(job?.prompt || '')
  const [selectedProjects, setSelectedProjects] = React.useState<string[]>(job?.projectPaths || [])
  const [trigger, setTrigger] = React.useState<JobTrigger>(job?.trigger || 'manual')
  const [backend, setBackend] = React.useState<JobBackend>(job?.backend || 'claude')
  const [usePreCheck, setUsePreCheck] = React.useState(!!job?.preCheck)
  const [preCheckCommand, setPreCheckCommand] = React.useState(job?.preCheck?.command || '')
  const [preCheckSkipIf, setPreCheckSkipIf] = React.useState<PreCheck['skipIf']>(job?.preCheck?.skipIf || 'empty')
  const [maxParallel, setMaxParallel] = React.useState(job?.maxParallel || 3)
  const [showPinnedOnly, setShowPinnedOnly] = React.useState(false)

  // Filter projects based on pinned filter
  const filteredProjects = React.useMemo(() => {
    if (!showPinnedOnly || !metaConfigured) return projects
    return projects.filter((p) => {
      // Extract slug from path (last segment)
      const slug = p.path.split('/').pop() || p.path
      return isPinned(slug)
    })
  }, [projects, showPinnedOnly, metaConfigured, isPinned])

  // Reset form when job changes
  React.useEffect(() => {
    if (open) {
      setName(job?.name || '')
      setPrompt(job?.prompt || '')
      setSelectedProjects(job?.projectPaths || [])
      setTrigger(job?.trigger || 'manual')
      setBackend(job?.backend || 'claude')
      setUsePreCheck(!!job?.preCheck)
      setPreCheckCommand(job?.preCheck?.command || '')
      setPreCheckSkipIf(job?.preCheck?.skipIf || 'empty')
      setMaxParallel(job?.maxParallel || 3)
    }
  }, [open, job])

  const saveMutation = useMutation({
    mutationFn: async (data: CreateJobRequest) => {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save job')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      onClose()
    },
  })

  const handleSave = () => {
    const data: CreateJobRequest = {
      ...(isEditing && job?.id ? { id: job.id } : {}),
      name: name.trim(),
      prompt: prompt.trim(),
      projectPaths: selectedProjects,
      trigger,
      backend,
      maxParallel,
      ...(usePreCheck && preCheckCommand
        ? {
            preCheck: {
              command: preCheckCommand,
              skipIf: preCheckSkipIf,
            },
          }
        : {}),
    }
    saveMutation.mutate(data)
  }

  const toggleProject = (path: string) => {
    setSelectedProjects((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    )
  }

  const isValid = name.trim() && prompt.trim() && selectedProjects.length > 0

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Job' : 'New Job'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the job configuration'
              : 'Create a new Claude job to run across projects'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="job-name">Job Name</Label>
              <Input
                id="job-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sync All Projects"
              />
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <Label htmlFor="job-prompt">Prompt</Label>
              <Textarea
                id="job-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter the Claude prompt..."
                className="min-h-[120px]"
              />
            </div>

            {/* Projects */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Projects ({selectedProjects.length} selected)</Label>
                {metaConfigured && (
                  <Button
                    variant={showPinnedOnly ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 gap-1.5"
                    onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                  >
                    <Pin className={`h-3.5 w-3.5 ${showPinnedOnly ? 'text-amber-500' : ''}`} />
                    Pinned only
                  </Button>
                )}
              </div>
              <div className="border rounded-lg max-h-[200px] overflow-y-auto">
                {projectsLoading ? (
                  <div className="p-4 text-center text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading projects...
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    {showPinnedOnly ? 'No pinned projects' : 'No local projects found'}
                  </div>
                ) : (
                  filteredProjects.map((project) => {
                    const slug = project.path.split('/').pop() || project.path
                    const pinned = metaConfigured && isPinned(slug)
                    return (
                      <label
                        key={project.path}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                      >
                        <Checkbox
                          checked={selectedProjects.includes(project.path)}
                          onCheckedChange={() => toggleProject(project.path)}
                        />
                        {pinned ? (
                          <Pin className="h-4 w-4 text-amber-500" />
                        ) : (
                          <FolderGit2 className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{project.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {project.path}
                          </div>
                        </div>
                      </label>
                    )
                  })
                )}
              </div>
            </div>

            {/* Trigger */}
            <div className="space-y-2">
              <Label>Trigger</Label>
              <Select value={trigger} onValueChange={(v) => setTrigger(v as JobTrigger)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="on-login">On Login</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {trigger === 'manual'
                  ? 'Run manually by clicking the Run button'
                  : 'Automatically run when you log in'}
              </p>
            </div>

            {/* Backend */}
            <div className="space-y-2">
              <Label>AI Backend</Label>
              <Select value={backend} onValueChange={(v) => setBackend(v as JobBackend)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      Claude
                    </div>
                  </SelectItem>
                  <SelectItem value="codex">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Codex (OpenAI)
                    </div>
                  </SelectItem>
                  <SelectItem value="gemini">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Gemini (Google)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {backend === 'claude' && 'Use Claude Code CLI for streaming output'}
                {backend === 'codex' && 'Use OpenAI Codex CLI (gpt-5)'}
                {backend === 'gemini' && 'Use Google Gemini CLI'}
              </p>
            </div>

            {/* Pre-check */}
            <Collapsible open={usePreCheck} onOpenChange={setUsePreCheck}>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="use-precheck"
                  checked={usePreCheck}
                  onCheckedChange={(checked) => setUsePreCheck(!!checked)}
                />
                <Label htmlFor="use-precheck" className="cursor-pointer">
                  Use pre-check (skip if nothing to do)
                </Label>
              </div>

              <CollapsibleContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Pre-check Command</Label>
                  <Input
                    value={preCheckCommand}
                    onChange={(e) => setPreCheckCommand(e.target.value)}
                    placeholder="e.g., git status --porcelain"
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Skip If Output Is</Label>
                  <Select
                    value={preCheckSkipIf}
                    onValueChange={(v) => setPreCheckSkipIf(v as PreCheck['skipIf'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty">Empty (no changes)</SelectItem>
                      <SelectItem value="non-empty">Non-empty (has changes)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Max Parallel */}
            <div className="space-y-2">
              <Label>Max Parallel Projects</Label>
              <Select
                value={maxParallel.toString()}
                onValueChange={(v) => setMaxParallel(parseInt(v))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Number of Claude processes to run simultaneously
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid || saveMutation.isPending}
          >
            {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Job'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// RUNNING JOB MODAL
// ============================================================================

interface ProjectProgress {
  path: string
  name: string
  status: 'pending' | 'pre-check' | 'running' | 'skipped' | 'complete' | 'error'
  output: string
  error?: string
  needsHuman?: boolean
}

interface RunningJobModalProps {
  open: boolean
  onClose: () => void
  jobName: string
  projectPaths: string[]
  prompt: string
  preCheck?: PreCheck
  maxParallel?: number
  jobId?: string
  onSaveResult?: (result: Omit<JobResult, 'isRead' | 'summary'>) => void
}

function RunningJobModal({
  open,
  onClose,
  jobName,
  projectPaths,
  prompt,
  preCheck,
  maxParallel,
  jobId,
  onSaveResult,
}: RunningJobModalProps) {
  const [progress, setProgress] = React.useState<ProjectProgress[]>([])
  const [isDone, setIsDone] = React.useState(false)
  const [expandedProject, setExpandedProject] = React.useState<string | null>(null)
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const runIdRef = React.useRef<string>('')
  const startTimeRef = React.useRef<string>('')
  const queryClient = useQueryClient()

  // Initialize progress when modal opens
  React.useEffect(() => {
    if (open) {
      setProgress(
        projectPaths.map((path) => ({
          path,
          name: path.split('/').pop() || path,
          status: 'pending',
          output: '',
        }))
      )
      setIsDone(false)
      setExpandedProject(null)
      startJob()
    } else {
      // Cleanup when closing
      abortControllerRef.current?.abort()
    }

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [open])

  const startJob = async () => {
    abortControllerRef.current = new AbortController()
    startTimeRef.current = new Date().toISOString()
    runIdRef.current = `run_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    try {
      const response = await fetch('/api/jobs/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(jobId ? { jobId } : { prompt, projectPaths, preCheck, maxParallel }),
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error('Failed to start job')
      }

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

      console.error('Job run error:', error)
      setProgress((prev) =>
        prev.map((p) =>
          p.status === 'pending' || p.status === 'running'
            ? { ...p, status: 'error', error: (error as Error).message }
            : p
        )
      )
    } finally {
      setIsDone(true)
      queryClient.invalidateQueries({ queryKey: ['jobs'] })

      // Save result to inbox - use latest progress from state
      setProgress((currentProgress) => {
        const hasErrors = currentProgress.some(p => p.status === 'error')
        const hasNeedsHuman = currentProgress.some(p => p.needsHuman)

        const projectResults: ProjectRunResult[] = currentProgress.map(p => ({
          path: p.path,
          name: p.name,
          preCheckSkipped: p.status === 'skipped',
          output: p.output,
          error: p.error,
          needsHuman: p.needsHuman || false,
          startedAt: startTimeRef.current,
          completedAt: new Date().toISOString(),
        }))

        onSaveResult?.({
          id: runIdRef.current,
          jobId: jobId || 'adhoc',
          jobName,
          startedAt: startTimeRef.current,
          completedAt: new Date().toISOString(),
          projects: projectResults,
          status: hasErrors ? 'error' : hasNeedsHuman ? 'needs-human' : 'complete',
        })

        return currentProgress
      })
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
          if (event.preCheckOutput) {
            project.output = `Pre-check output:\n${event.preCheckOutput}\n\n`
          }
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
        case 'done':
          setIsDone(true)
          break
      }

      updated[idx] = project
      return updated
    })
  }

  const handleCancel = () => {
    abortControllerRef.current?.abort()
    setIsDone(true)
  }

  const completedCount = progress.filter(
    (p) => p.status === 'complete' || p.status === 'skipped' || p.status === 'error'
  ).length
  const hasErrors = progress.some((p) => p.status === 'error')
  const needsHuman = progress.some((p) => p.needsHuman)

  return (
    <Dialog open={open} onOpenChange={(open) => !open && isDone && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {!isDone && <Loader2 className="h-4 w-4 animate-spin" />}
            {isDone && hasErrors && <XCircle className="h-4 w-4 text-destructive" />}
            {isDone && needsHuman && !hasErrors && (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
            {isDone && !hasErrors && !needsHuman && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            {jobName}
          </DialogTitle>
          <DialogDescription>
            {isDone
              ? `Completed ${completedCount}/${progress.length} projects`
              : `Running on ${progress.length} projects...`}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-2 py-4">
            {progress.map((project) => (
              <Collapsible
                key={project.path}
                open={expandedProject === project.path}
                onOpenChange={(open) =>
                  setExpandedProject(open ? project.path : null)
                }
              >
                <CollapsibleTrigger asChild>
                  <Card
                    className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                      expandedProject === project.path ? 'border-primary' : ''
                    }`}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      {project.status === 'pending' && (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                      {project.status === 'pre-check' && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
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
                          {project.status === 'pre-check' && 'Running pre-check...'}
                          {project.status === 'running' && 'Running Claude...'}
                          {project.status === 'skipped' && 'Skipped (pre-check)'}
                          {project.status === 'complete' &&
                            (project.needsHuman ? 'Needs review' : 'Complete')}
                          {project.status === 'error' && project.error}
                        </div>
                      </div>

                      {project.output && (
                        expandedProject === project.path ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )
                      )}
                    </CardContent>
                  </Card>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  {project.output && (
                    <Card className="mt-1 border-l-4 border-l-primary">
                      <CardContent className="p-3">
                        <pre className="text-xs font-mono whitespace-pre-wrap max-h-[300px] overflow-auto">
                          {project.output}
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          {!isDone ? (
            <Button variant="destructive" onClick={handleCancel}>
              Cancel
            </Button>
          ) : (
            <Button onClick={onClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// JOB CARD
// ============================================================================

interface JobCardProps {
  job: Job
  onRun: () => void
  onEdit: () => void
  onDelete: () => void
  isExpanded: boolean
  onToggleExpand: () => void
}

function JobCard({ job, onRun, onEdit, onDelete, isExpanded, onToggleExpand }: JobCardProps) {
  const statusBadge = getStatusBadge(job.status)

  return (
    <Card className="glass">
      <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
        <CardContent className="p-4">
          {/* Header Row */}
          <div className="flex items-start gap-3">
            {getStatusIcon(job.status)}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold terminal-glow">{job.name}</h3>
                <Badge
                  variant={statusBadge.variant}
                  className={'className' in statusBadge ? statusBadge.className : undefined}
                >
                  {statusBadge.label}
                </Badge>
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  {getBackendIcon(job.backend || 'claude')}
                  {getBackendLabel(job.backend || 'claude')}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getTriggerLabel(job.trigger)}
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <FolderGit2 className="h-3 w-3" />
                  {job.projectPaths.length} project{job.projectPaths.length !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last run: {formatRelativeTime(job.lastRun)}
                </span>
                {job.lastSkipped && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <SkipForward className="h-3 w-3" />
                    Skipped: {formatRelativeTime(job.lastSkipped)}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRun()
                      }}
                      disabled={job.status === 'running'}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Run Now</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit()
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* Expanded Content */}
          <CollapsibleContent className="pt-4 mt-4 border-t">
            <div className="space-y-4">
              {/* Prompt */}
              <div>
                <Label className="text-xs text-muted-foreground">Prompt</Label>
                <pre className="mt-1 p-3 rounded-lg bg-muted/50 text-sm font-mono whitespace-pre-wrap">
                  {job.prompt}
                </pre>
              </div>

              {/* Projects */}
              <div>
                <Label className="text-xs text-muted-foreground">Target Projects</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {job.projectPaths.map((path) => (
                    <Badge key={path} variant="secondary" className="font-mono text-xs">
                      {path.split('/').pop()}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Pre-check */}
              {job.preCheck && (
                <div>
                  <Label className="text-xs text-muted-foreground">Pre-check</Label>
                  <div className="mt-1 p-3 rounded-lg bg-muted/50 font-mono text-sm">
                    <code>{job.preCheck.command}</code>
                    <span className="text-muted-foreground ml-2">
                      (skip if {job.preCheck.skipIf})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  )
}

// ============================================================================
// RESULTS INBOX VIEW
// ============================================================================

interface ResultsInboxViewProps {
  results: JobResult[]
  onSelectResult: (id: string) => void
  onMarkAllRead: () => void
}

function ResultsInboxView({ results, onSelectResult, onMarkAllRead }: ResultsInboxViewProps) {
  if (results.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="p-12 text-center">
          <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No results yet</h3>
          <p className="text-muted-foreground">
            Run a job to see results here
          </p>
        </CardContent>
      </Card>
    )
  }

  const unreadCount = results.filter(r => !r.isRead).length

  return (
    <div className="space-y-3">
      {/* Inbox Header */}
      {unreadCount > 0 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-sm text-muted-foreground">
            {unreadCount} unread result{unreadCount !== 1 ? 's' : ''}
          </span>
          <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
            <Eye className="h-4 w-4 mr-1.5" />
            Mark all read
          </Button>
        </div>
      )}

      {/* Results List */}
      {results.map((result) => (
        <Card
          key={result.id}
          className={`glass cursor-pointer hover:bg-muted/50 transition-colors ${
            !result.isRead ? 'border-l-4 border-l-primary' : ''
          }`}
          onClick={() => onSelectResult(result.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Status Icon */}
              {result.status === 'complete' && (
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              )}
              {result.status === 'needs-human' && (
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              )}
              {result.status === 'error' && (
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold truncate">{result.jobName}</span>
                  {!result.isRead && (
                    <Circle className="h-2 w-2 fill-primary text-primary flex-shrink-0" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  {result.summary}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FolderGit2 className="h-3 w-3" />
                    {result.projects.length} project{result.projects.length !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(result.completedAt)}
                  </span>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ============================================================================
// RESULT DETAIL VIEW
// ============================================================================

interface ResultDetailViewProps {
  result?: JobResult
  onBack: () => void
  onMarkRead: () => void
  onDelete: () => void
  onRerun: (result: JobResult) => void
}

function ResultDetailView({ result, onBack, onMarkRead, onDelete, onRerun }: ResultDetailViewProps) {
  const [expandedProject, setExpandedProject] = React.useState<string | null>(null)

  if (!result) {
    return (
      <Card className="glass">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Result not found</p>
          <Button variant="link" onClick={onBack}>
            Go back
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Inbox
        </Button>
        <div className="flex items-center gap-2">
          {result.jobId !== 'adhoc' && (
            <Button variant="outline" size="sm" onClick={() => onRerun(result)}>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Re-run
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Result Info */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-start gap-3">
            {result.status === 'complete' && (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            )}
            {result.status === 'needs-human' && (
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            )}
            {result.status === 'error' && (
              <XCircle className="h-6 w-6 text-destructive" />
            )}
            <div>
              <CardTitle className="text-xl">{result.jobName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Ran {formatRelativeTime(result.completedAt)} on {result.projects.length} project{result.projects.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Project Results */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground px-1">Project Results</h3>
        {result.projects.map((project) => (
          <Collapsible
            key={project.path}
            open={expandedProject === project.path}
            onOpenChange={(open) => setExpandedProject(open ? project.path : null)}
          >
            <Card className="glass">
              <CollapsibleTrigger asChild>
                <CardContent className="p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    {project.preCheckSkipped && (
                      <SkipForward className="h-4 w-4 text-muted-foreground" />
                    )}
                    {!project.preCheckSkipped && !project.error && !project.needsHuman && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {project.needsHuman && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    {project.error && (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}

                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {project.preCheckSkipped && '(skipped)'}
                        {project.needsHuman && '(needs review)'}
                        {project.error && `Error: ${project.error}`}
                      </span>
                    </div>

                    {project.output && (
                      expandedProject === project.path ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )
                    )}
                  </div>
                </CardContent>
              </CollapsibleTrigger>

              <CollapsibleContent>
                {project.output && (
                  <CardContent className="pt-0 pb-3 px-3">
                    <div className="border-t pt-3">
                      <pre className="text-xs font-mono whitespace-pre-wrap max-h-[400px] overflow-auto p-3 bg-muted/30 rounded-lg">
                        {project.output}
                      </pre>
                    </div>
                  </CardContent>
                )}
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function JobsSection({
  activeSubItem,
  onSubItemHandled,
}: {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
}) {
  const queryClient = useQueryClient()
  const { results, saveResult, markRead, markAllRead, deleteResult, unreadCount, needsHumanCount, isLoaded: resultsLoaded } = useJobResults()

  // View state: 'jobs' or 'inbox'
  const [view, setView] = React.useState<'jobs' | 'inbox'>('jobs')
  const [selectedResultId, setSelectedResultId] = React.useState<string | null>(null)

  // Modal state
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [editingJob, setEditingJob] = React.useState<Job | null>(null)
  const [runningJob, setRunningJob] = React.useState<{
    job: Job
  } | null>(null)
  const [expandedJobId, setExpandedJobId] = React.useState<string | null>(null)

  // Handle sub-item navigation
  React.useEffect(() => {
    if (activeSubItem) {
      onSubItemHandled?.()
    }
  }, [activeSubItem, onSubItemHandled])

  // Fetch jobs
  const { data: jobsData, isLoading: jobsLoading, refetch: refetchJobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await fetch('/api/jobs')
      if (!res.ok) throw new Error('Failed to fetch jobs')
      return res.json() as Promise<{ jobs: Job[] }>
    },
    refetchInterval: 5000, // Poll for status updates
  })

  // Fetch local projects for job creation
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['local-projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects/local')
      if (!res.ok) return []
      const data = await res.json()
      return (data.projects || []) as LocalProject[]
    },
    staleTime: 5 * 60 * 1000,
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await fetch(`/api/jobs?id=${jobId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete job')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })

  const jobs = jobsData?.jobs || []

  return (
    <>
      <div className="h-full flex flex-col p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold terminal-glow">Jobs</h1>
            <p className="text-muted-foreground mt-1">
              Run Claude prompts across multiple projects
            </p>
          </div>

          <div className="flex items-center gap-2">
            {needsHumanCount > 0 && (
              <Badge variant="outline" className="mr-2 border-amber-500 text-amber-500">
                {needsHumanCount} need{needsHumanCount !== 1 ? '' : 's'} review
              </Badge>
            )}

            {/* View Toggle */}
            <div className="flex rounded-lg border bg-muted/30 p-0.5">
              <Button
                variant={view === 'jobs' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => { setView('jobs'); setSelectedResultId(null) }}
                className="h-7 px-3"
              >
                <Terminal className="h-4 w-4 mr-1.5" />
                Jobs
              </Button>
              <Button
                variant={view === 'inbox' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => { setView('inbox'); setSelectedResultId(null) }}
                className="h-7 px-3 relative"
              >
                <Inbox className="h-4 w-4 mr-1.5" />
                Inbox
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] flex items-center justify-center text-primary-foreground">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={() => refetchJobs()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {view === 'jobs' && (
              <Button onClick={() => setCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Job
              </Button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1">
          {view === 'jobs' ? (
            // Jobs List View
            <>
              {jobsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="glass">
                      <CardContent className="p-4">
                        <div className="h-16 bg-muted/20 rounded animate-pulse" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <Card className="glass">
                  <CardContent className="p-12 text-center">
                    <Terminal className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first job to run Claude prompts across your projects
                    </p>
                    <Button onClick={() => setCreateModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Job
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isExpanded={expandedJobId === job.id}
                      onToggleExpand={() =>
                        setExpandedJobId(expandedJobId === job.id ? null : job.id)
                      }
                      onRun={() => setRunningJob({ job })}
                      onEdit={() => setEditingJob(job)}
                      onDelete={() => {
                        if (confirm(`Delete job "${job.name}"?`)) {
                          deleteMutation.mutate(job.id)
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : selectedResultId ? (
            // Result Detail View
            <ResultDetailView
              result={results.find(r => r.id === selectedResultId)}
              onBack={() => setSelectedResultId(null)}
              onMarkRead={() => markRead(selectedResultId)}
              onDelete={() => {
                deleteResult(selectedResultId)
                setSelectedResultId(null)
              }}
              onRerun={(result) => {
                const job = jobs.find(j => j.id === result.jobId)
                if (job) {
                  setRunningJob({ job })
                  setSelectedResultId(null)
                }
              }}
            />
          ) : (
            // Results Inbox View
            <ResultsInboxView
              results={results}
              onSelectResult={(id) => {
                setSelectedResultId(id)
                markRead(id)
              }}
              onMarkAllRead={markAllRead}
            />
          )}
        </ScrollArea>
      </div>

      {/* Create/Edit Modal */}
      <JobModal
        open={createModalOpen || !!editingJob}
        onClose={() => {
          setCreateModalOpen(false)
          setEditingJob(null)
        }}
        job={editingJob}
        projects={projects}
        projectsLoading={projectsLoading}
      />

      {/* Running Job Modal */}
      {runningJob && (
        <RunningJobModal
          open={!!runningJob}
          onClose={() => setRunningJob(null)}
          jobName={runningJob.job.name}
          projectPaths={runningJob.job.projectPaths}
          prompt={runningJob.job.prompt}
          preCheck={runningJob.job.preCheck}
          maxParallel={runningJob.job.maxParallel}
          jobId={runningJob.job.id}
          onSaveResult={saveResult}
        />
      )}
    </>
  )
}

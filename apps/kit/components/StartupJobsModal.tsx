"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  SkipForward,
  Clock,
  FolderGit2,
} from "lucide-react"
import type { Job, JobStreamEvent, ProjectRunResult, JobResult } from "@/lib/jobs/types"
import { useJobResults } from "@/hooks/useJobResults"

interface ProjectProgress {
  path: string
  name: string
  status: 'pending' | 'running' | 'skipped' | 'complete' | 'error'
  output: string
  error?: string
  needsHuman?: boolean
  preCheckSkipped?: boolean
}

interface JobProgress {
  job: Job
  status: 'pending' | 'running' | 'complete' | 'error' | 'skipped'
  projects: ProjectProgress[]
}

interface StartupJobsModalProps {
  open: boolean
  jobs: Job[]
  onClose: () => void
  onSkipAll: () => void
}

export function StartupJobsModal({ open, jobs, onClose, onSkipAll }: StartupJobsModalProps) {
  const { saveResult } = useJobResults()
  const [jobProgress, setJobProgress] = React.useState<JobProgress[]>([])
  const [isRunning, setIsRunning] = React.useState(false)
  const [currentJobIndex, setCurrentJobIndex] = React.useState(-1)
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const startTimeRef = React.useRef<string>('')

  // Initialize job progress when modal opens
  React.useEffect(() => {
    if (open && jobs.length > 0) {
      setJobProgress(
        jobs.map(job => ({
          job,
          status: 'pending',
          projects: job.projectPaths.map(path => ({
            path,
            name: path.split('/').pop() || path,
            status: 'pending',
            output: '',
          })),
        }))
      )
      setCurrentJobIndex(-1)
      setIsRunning(false)
    }
  }, [open, jobs])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const runNextJob = async (index: number) => {
    if (index >= jobProgress.length) {
      setIsRunning(false)
      return
    }

    setCurrentJobIndex(index)
    const jobProg = jobProgress[index]

    // Update job status to running
    setJobProgress(prev => prev.map((jp, i) =>
      i === index ? { ...jp, status: 'running' } : jp
    ))

    abortControllerRef.current = new AbortController()
    startTimeRef.current = new Date().toISOString()
    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    try {
      const response = await fetch('/api/jobs/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: jobProg.job.id }),
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
            handleEvent(index, event)
          } catch {
            // Ignore parse errors
          }
        }
      }

      // Job completed - update status
      setJobProgress(prev => {
        const updated = [...prev]
        const jp = { ...updated[index] }
        const hasErrors = jp.projects.some(p => p.status === 'error')
        const hasNeedsHuman = jp.projects.some(p => p.needsHuman)
        jp.status = hasErrors ? 'error' : hasNeedsHuman ? 'complete' : 'complete'
        updated[index] = jp

        // Save result
        const projectResults: ProjectRunResult[] = jp.projects.map(p => ({
          path: p.path,
          name: p.name,
          preCheckSkipped: p.status === 'skipped',
          output: p.output,
          error: p.error,
          needsHuman: p.needsHuman || false,
          startedAt: startTimeRef.current,
          completedAt: new Date().toISOString(),
        }))

        saveResult({
          id: runId,
          jobId: jp.job.id,
          jobName: jp.job.name,
          startedAt: startTimeRef.current,
          completedAt: new Date().toISOString(),
          projects: projectResults,
          status: hasErrors ? 'error' : hasNeedsHuman ? 'needs-human' : 'complete',
        })

        return updated
      })
    } catch (error) {
      if ((error as Error).name === 'AbortError') return

      console.error('Startup job error:', error)
      setJobProgress(prev => prev.map((jp, i) =>
        i === index ? { ...jp, status: 'error' } : jp
      ))
    }

    // Run next job
    runNextJob(index + 1)
  }

  const handleEvent = (jobIndex: number, event: JobStreamEvent) => {
    setJobProgress(prev => {
      const updated = [...prev]
      const jp = { ...updated[jobIndex] }
      const projectIndex = jp.projects.findIndex(p => p.path === event.project)

      if (projectIndex === -1) return prev

      const projects = [...jp.projects]
      const project = { ...projects[projectIndex] }

      switch (event.type) {
        case 'pre-check':
          project.status = event.skipped ? 'skipped' : 'pending'
          project.preCheckSkipped = event.skipped
          if (event.preCheckOutput) {
            project.output = `Pre-check: ${event.preCheckOutput}\n`
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
      }

      projects[projectIndex] = project
      jp.projects = projects
      updated[jobIndex] = jp
      return updated
    })
  }

  const handleRunAll = () => {
    setIsRunning(true)
    runNextJob(0)
  }

  const handleSkipRemaining = () => {
    abortControllerRef.current?.abort()
    setIsRunning(false)
    onSkipAll()
  }

  const handleClose = () => {
    if (isRunning) {
      abortControllerRef.current?.abort()
    }
    onClose()
  }

  const allDone = jobProgress.every(jp =>
    jp.status === 'complete' || jp.status === 'error' || jp.status === 'skipped'
  )
  const hasErrors = jobProgress.some(jp => jp.status === 'error')
  const hasNeedsHuman = jobProgress.some(jp =>
    jp.projects.some(p => p.needsHuman)
  )

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {!isRunning && !allDone && "Welcome back!"}
            {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}
            {isRunning && "Running startup jobs..."}
            {allDone && hasErrors && <XCircle className="h-4 w-4 text-destructive" />}
            {allDone && hasNeedsHuman && !hasErrors && (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
            {allDone && !hasErrors && !hasNeedsHuman && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            {allDone && "Jobs complete"}
          </DialogTitle>
          <DialogDescription>
            {!isRunning && !allDone && (
              <>You have {jobs.length} startup job{jobs.length !== 1 ? 's' : ''} ready to run.</>
            )}
            {isRunning && (
              <>Running job {currentJobIndex + 1} of {jobProgress.length}...</>
            )}
            {allDone && (
              <>All startup jobs have finished.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3 py-4">
            {jobProgress.map((jp, index) => (
              <Card
                key={jp.job.id}
                className={`transition-colors ${
                  index === currentJobIndex ? 'border-primary' : ''
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    {jp.status === 'pending' && (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    {jp.status === 'running' && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                    {jp.status === 'skipped' && (
                      <SkipForward className="h-4 w-4 text-muted-foreground" />
                    )}
                    {jp.status === 'complete' && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {jp.status === 'error' && (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{jp.job.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <FolderGit2 className="h-3 w-3" />
                        {jp.job.projectPaths.length} project{jp.job.projectPaths.length !== 1 ? 's' : ''}

                        {jp.status === 'running' && (
                          <span className="text-primary">
                            {jp.projects.filter(p => p.status === 'complete' || p.status === 'skipped').length}/{jp.projects.length}
                          </span>
                        )}

                        {jp.status === 'complete' && (
                          <span className="text-green-500">
                            {jp.projects.filter(p => !p.preCheckSkipped && !p.error).length} completed
                            {jp.projects.filter(p => p.needsHuman).length > 0 && (
                              <>, {jp.projects.filter(p => p.needsHuman).length} need review</>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Show project progress when running */}
                  {jp.status === 'running' && (
                    <div className="mt-3 space-y-1 pl-7">
                      {jp.projects.map(project => (
                        <div
                          key={project.path}
                          className="text-xs flex items-center gap-2"
                        >
                          {project.status === 'pending' && (
                            <Clock className="h-3 w-3 text-muted-foreground" />
                          )}
                          {project.status === 'running' && (
                            <Loader2 className="h-3 w-3 animate-spin text-primary" />
                          )}
                          {project.status === 'skipped' && (
                            <SkipForward className="h-3 w-3 text-muted-foreground" />
                          )}
                          {project.status === 'complete' && (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          )}
                          {project.status === 'error' && (
                            <XCircle className="h-3 w-3 text-destructive" />
                          )}
                          <span className={project.status === 'running' ? 'text-primary' : 'text-muted-foreground'}>
                            {project.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          {!isRunning && !allDone && (
            <>
              <Button variant="outline" onClick={onSkipAll}>
                Skip All
              </Button>
              <Button onClick={handleRunAll}>
                <Play className="h-4 w-4 mr-2" />
                Run All
              </Button>
            </>
          )}
          {isRunning && (
            <Button variant="destructive" onClick={handleSkipRemaining}>
              Skip Remaining
            </Button>
          )}
          {allDone && (
            <Button onClick={handleClose}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

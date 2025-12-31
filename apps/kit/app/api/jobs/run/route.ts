/**
 * Claude Jobs - Run API
 * Execute a job or ad-hoc prompt against projects
 *
 * POST /api/jobs/run
 * Body: { jobId } OR { prompt, projectPaths, preCheck? }
 * Response: SSE stream of job events
 */

import { NextRequest } from 'next/server'
import { getJob, updateJobRunStatus } from '@/lib/jobs/storage'
import { runJobOnProjects, generateRunId, getProjectName } from '@/lib/jobs/runner'
import type { RunJobRequest, JobStreamEvent, JobRun, ProjectRunResult, JobBackend } from '@/lib/jobs/types'

export async function POST(request: NextRequest) {
  try {
    const body: RunJobRequest = await request.json()
    const { jobId, prompt, projectPaths, backend, preCheck, maxParallel } = body

    // Resolve job details
    let resolvedPrompt: string
    let resolvedProjectPaths: string[]
    let resolvedBackend: JobBackend = backend || 'claude'
    let resolvedPreCheck = preCheck
    let resolvedMaxParallel = maxParallel || 3
    let jobName = 'Ad-hoc Job'

    if (jobId) {
      // Run existing job
      const job = await getJob(jobId)
      if (!job) {
        return new Response(
          JSON.stringify({ error: 'Job not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        )
      }

      resolvedPrompt = job.prompt
      resolvedProjectPaths = job.projectPaths
      resolvedBackend = job.backend || 'claude'
      resolvedPreCheck = job.preCheck
      resolvedMaxParallel = job.maxParallel || 3
      jobName = job.name

      // Update job status to running
      await updateJobRunStatus(jobId, 'running')
    } else {
      // Ad-hoc job
      if (!prompt || !projectPaths || projectPaths.length === 0) {
        return new Response(
          JSON.stringify({ error: 'prompt and projectPaths required for ad-hoc jobs' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      resolvedPrompt = prompt
      resolvedProjectPaths = projectPaths
    }

    const runId = generateRunId()
    const encoder = new TextEncoder()

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        const allResults: ProjectRunResult[] = []
        let hasNeedsHuman = false
        let hasError = false

        // Helper to send SSE event
        const sendEvent = (event: JobStreamEvent) => {
          const data = JSON.stringify({ ...event, runId })
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        }

        try {
          // Run job on all projects
          const results = await runJobOnProjects(
            resolvedPrompt,
            resolvedProjectPaths,
            resolvedPreCheck,
            resolvedMaxParallel,
            resolvedBackend,
            sendEvent
          )

          allResults.push(...results)
          hasNeedsHuman = results.some(r => r.needsHuman)
          hasError = results.some(r => !!r.error)

          // Build job run result
          const jobRun: JobRun = {
            id: runId,
            jobId: jobId || 'adhoc',
            jobName,
            startedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            projects: allResults,
            status: hasError ? 'error' : hasNeedsHuman ? 'needs-human' : 'complete'
          }

          // Send done event
          sendEvent({
            type: 'done',
            runId
          })

          // Update job status if this was a saved job
          if (jobId) {
            const status = hasError ? 'error' : hasNeedsHuman ? 'needs-human' : 'idle'
            await updateJobRunStatus(jobId, status)
          }

          controller.close()
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          sendEvent({
            type: 'error',
            error: errorMessage,
            runId
          })

          if (jobId) {
            await updateJobRunStatus(jobId, 'error')
          }

          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error) {
    console.error('Jobs run API error:', error)

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

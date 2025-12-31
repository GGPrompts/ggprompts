/**
 * Claude Jobs - Jobs API
 * CRUD operations for job definitions
 *
 * GET /api/jobs - List all jobs
 * POST /api/jobs - Create or update a job
 * DELETE /api/jobs?id=xxx - Delete a job
 */

import { NextRequest } from 'next/server'
import { getJobs, getJob, createJob, deleteJob } from '@/lib/jobs/storage'
import type { CreateJobRequest } from '@/lib/jobs/types'

/**
 * GET /api/jobs - List all jobs
 * Query params:
 *   - trigger: Filter by trigger type
 *   - status: Filter by status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trigger = searchParams.get('trigger')
    const status = searchParams.get('status')
    const id = searchParams.get('id')

    // Get single job by ID
    if (id) {
      const job = await getJob(id)
      if (!job) {
        return new Response(
          JSON.stringify({ error: 'Job not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        )
      }
      return Response.json(job)
    }

    // Get all jobs with optional filters
    let jobs = await getJobs()

    if (trigger) {
      jobs = jobs.filter(job => job.trigger === trigger)
    }

    if (status) {
      jobs = jobs.filter(job => job.status === status)
    }

    return Response.json({ jobs })
  } catch (error) {
    console.error('Jobs GET error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * POST /api/jobs - Create or update a job
 * Body: CreateJobRequest
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateJobRequest = await request.json()

    // Validate required fields
    if (!body.name || !body.prompt || !body.projectPaths || body.projectPaths.length === 0) {
      return new Response(
        JSON.stringify({ error: 'name, prompt, and projectPaths are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!body.trigger) {
      return new Response(
        JSON.stringify({ error: 'trigger is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate trigger type
    const validTriggers = ['manual', 'on-login', 'on-device-change', 'before-first-prompt']
    if (!validTriggers.includes(body.trigger)) {
      return new Response(
        JSON.stringify({ error: `Invalid trigger. Must be one of: ${validTriggers.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate pre-check if provided
    if (body.preCheck) {
      if (!body.preCheck.command) {
        return new Response(
          JSON.stringify({ error: 'preCheck.command is required when preCheck is provided' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      const validSkipIf = ['empty', 'non-empty', 'matches']
      if (!validSkipIf.includes(body.preCheck.skipIf)) {
        return new Response(
          JSON.stringify({ error: `Invalid preCheck.skipIf. Must be one of: ${validSkipIf.join(', ')}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      if (body.preCheck.skipIf === 'matches' && !body.preCheck.pattern) {
        return new Response(
          JSON.stringify({ error: 'preCheck.pattern is required when skipIf is "matches"' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    const job = await createJob(body)
    return Response.json(job, { status: body.id ? 200 : 201 })
  } catch (error) {
    console.error('Jobs POST error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * DELETE /api/jobs?id=xxx - Delete a job
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'id query parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const deleted = await deleteJob(id)

    if (!deleted) {
      return new Response(
        JSON.stringify({ error: 'Job not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Jobs DELETE error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

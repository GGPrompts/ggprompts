/**
 * Claude Jobs - Storage
 * File-based storage for job definitions (server-side)
 */

import { promises as fs } from 'fs'
import path from 'path'
import type { Job, JobsData, CreateJobRequest, JobStatus } from './types'

const STORAGE_DIR = process.env.JOBS_STORAGE_DIR || path.join(process.cwd(), '.jobs-data')
const JOBS_FILE = path.join(STORAGE_DIR, 'jobs.json')

const CURRENT_VERSION = 1

/**
 * Ensure storage directory exists
 */
async function ensureStorageDir(): Promise<void> {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true })
  } catch (error) {
    // Directory might already exist
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }
}

/**
 * Load jobs data from file
 */
async function loadJobsData(): Promise<JobsData> {
  try {
    await ensureStorageDir()
    const data = await fs.readFile(JOBS_FILE, 'utf-8')
    return JSON.parse(data) as JobsData
  } catch (error) {
    // File doesn't exist yet, return empty
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { jobs: [], version: CURRENT_VERSION }
    }
    throw error
  }
}

/**
 * Save jobs data to file
 */
async function saveJobsData(data: JobsData): Promise<void> {
  await ensureStorageDir()
  await fs.writeFile(JOBS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * Generate a unique job ID
 */
function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Get all jobs
 */
export async function getJobs(): Promise<Job[]> {
  const data = await loadJobsData()
  return data.jobs
}

/**
 * Get a job by ID
 */
export async function getJob(id: string): Promise<Job | null> {
  const data = await loadJobsData()
  return data.jobs.find(job => job.id === id) || null
}

/**
 * Create a new job
 */
export async function createJob(request: CreateJobRequest): Promise<Job> {
  const data = await loadJobsData()
  const now = new Date().toISOString()

  const job: Job = {
    id: request.id || generateJobId(),
    name: request.name,
    prompt: request.prompt,
    projectPaths: request.projectPaths,
    trigger: request.trigger,
    backend: request.backend || 'claude',
    preCheck: request.preCheck,
    maxParallel: request.maxParallel,
    status: 'idle',
    createdAt: now,
    updatedAt: now
  }

  // Check if updating existing job
  const existingIndex = data.jobs.findIndex(j => j.id === job.id)
  if (existingIndex >= 0) {
    // Preserve creation date and last run info
    const existing = data.jobs[existingIndex]
    job.createdAt = existing.createdAt
    job.lastRun = existing.lastRun
    job.lastSkipped = existing.lastSkipped
    job.lastResultUrl = existing.lastResultUrl
    data.jobs[existingIndex] = job
  } else {
    data.jobs.push(job)
  }

  await saveJobsData(data)
  return job
}

/**
 * Update a job
 */
export async function updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
  const data = await loadJobsData()
  const index = data.jobs.findIndex(job => job.id === id)

  if (index === -1) {
    return null
  }

  const job = data.jobs[index]
  const updatedJob: Job = {
    ...job,
    ...updates,
    id: job.id, // Don't allow changing ID
    createdAt: job.createdAt, // Don't allow changing creation date
    updatedAt: new Date().toISOString()
  }

  data.jobs[index] = updatedJob
  await saveJobsData(data)
  return updatedJob
}

/**
 * Delete a job
 */
export async function deleteJob(id: string): Promise<boolean> {
  const data = await loadJobsData()
  const index = data.jobs.findIndex(job => job.id === id)

  if (index === -1) {
    return false
  }

  data.jobs.splice(index, 1)
  await saveJobsData(data)
  return true
}

/**
 * Update job status and last run info
 */
export async function updateJobRunStatus(
  id: string,
  status: JobStatus,
  lastResultUrl?: string
): Promise<Job | null> {
  return updateJob(id, {
    status,
    lastRun: new Date().toISOString(),
    lastResultUrl
  })
}

/**
 * Mark job as skipped due to pre-check
 */
export async function markJobSkipped(id: string): Promise<Job | null> {
  return updateJob(id, {
    lastSkipped: new Date().toISOString()
  })
}

/**
 * Get jobs by trigger type
 */
export async function getJobsByTrigger(trigger: Job['trigger']): Promise<Job[]> {
  const jobs = await getJobs()
  return jobs.filter(job => job.trigger === trigger)
}

/**
 * Get jobs that need human attention
 */
export async function getJobsNeedingHuman(): Promise<Job[]> {
  const jobs = await getJobs()
  return jobs.filter(job => job.status === 'needs-human')
}

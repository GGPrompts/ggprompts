/**
 * Claude Jobs - Type Definitions
 * Automated and on-demand Claude Code prompts across multiple projects
 */

/**
 * Job trigger types
 */
export type JobTrigger =
  | 'manual'              // Click to run
  | 'on-login'            // When app opens after being away
  | 'on-device-change'    // New IP/device detected
  | 'before-first-prompt' // Before first chat message of session

/**
 * Job backend types - which AI to run
 */
export type JobBackend = 'claude' | 'codex' | 'gemini'

/**
 * Pre-check configuration - cheap shell command to run before Claude
 */
export interface PreCheck {
  command: string           // Shell command to run (no Claude)
  skipIf: 'empty' | 'non-empty' | 'matches'
  pattern?: string          // Regex for 'matches' mode
}

/**
 * Job execution status
 */
export type JobStatus = 'idle' | 'running' | 'needs-human' | 'error'

/**
 * Job definition
 */
export interface Job {
  id: string
  name: string
  prompt: string            // The prompt to run
  projectPaths: string[]    // Local project paths to run against
  trigger: JobTrigger
  backend: JobBackend       // Which AI backend to use (default: 'claude')
  preCheck?: PreCheck       // Optional cheap check before running AI
  maxParallel?: number      // Max concurrent processes (default: 3)

  // Execution state
  lastRun?: string          // ISO date string
  lastSkipped?: string      // When pre-check caused skip
  lastResultUrl?: string    // GitHub Issue URL
  status?: JobStatus

  // Metadata
  createdAt: string         // ISO date string
  updatedAt: string         // ISO date string
}

/**
 * Result of running a job against a single project
 */
export interface ProjectRunResult {
  path: string
  name: string              // Derived from path (last segment)
  preCheckSkipped: boolean  // True if pre-check caused skip
  preCheckOutput?: string   // Output from pre-check command
  output?: string           // Claude's response
  error?: string            // Error message if failed
  needsHuman: boolean       // Claude flagged for intervention
  startedAt: string         // ISO date string
  completedAt?: string      // ISO date string
}

/**
 * Complete job run result
 */
export interface JobRun {
  id: string                // Unique run ID
  jobId: string
  jobName: string
  startedAt: string         // ISO date string
  completedAt?: string      // ISO date string
  projects: ProjectRunResult[]
  githubIssueUrl?: string
  status: 'running' | 'complete' | 'error' | 'needs-human'
}

/**
 * Request to run a job
 */
export interface RunJobRequest {
  jobId?: string            // Run existing job
  // OR ad-hoc:
  prompt?: string
  projectPaths?: string[]
  backend?: JobBackend      // Default: 'claude'
  preCheck?: PreCheck
  maxParallel?: number      // Default: 3
}

/**
 * SSE event types for job streaming
 */
export type JobStreamEventType =
  | 'pre-check'   // Pre-check completed
  | 'start'       // Claude started for a project
  | 'content'     // Content chunk from Claude
  | 'complete'    // Project completed
  | 'done'        // All projects done
  | 'error'       // Error occurred

export interface JobStreamEvent {
  type: JobStreamEventType
  project?: string          // Project path
  projectName?: string      // Project name (derived from path)
  skipped?: boolean         // For pre-check: whether project was skipped
  preCheckOutput?: string   // For pre-check: command output
  text?: string             // For content: chunk of text
  output?: string           // For complete: full output
  needsHuman?: boolean      // For complete: whether needs human review
  error?: string            // For error: error message
  githubIssueUrl?: string   // For done: issue URL
  runId?: string            // Run ID for tracking
}

/**
 * Jobs storage structure
 */
export interface JobsData {
  jobs: Job[]
  version: number           // Schema version for migrations
}

/**
 * Stored job result (for Results Inbox)
 */
export interface JobResult {
  id: string                // Same as JobRun.id
  jobId: string
  jobName: string
  startedAt: string         // ISO date string
  completedAt: string       // ISO date string
  projects: ProjectRunResult[]
  status: 'complete' | 'error' | 'needs-human'
  isRead: boolean           // Whether user has viewed this result
  summary?: string          // Brief summary for list view
}

/**
 * Results storage structure
 */
export interface JobResultsData {
  results: JobResult[]
  version: number
}

/**
 * Create/update job request
 */
export interface CreateJobRequest {
  id?: string               // If provided, updates existing job
  name: string
  prompt: string
  projectPaths: string[]
  trigger: JobTrigger
  backend?: JobBackend      // Default: 'claude'
  preCheck?: PreCheck
  maxParallel?: number
}

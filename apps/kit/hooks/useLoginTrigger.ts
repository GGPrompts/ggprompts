/**
 * On-Login Trigger Hook
 * Tracks user visits and triggers on-login jobs when returning to the app
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Job } from '@/lib/jobs/types'

const LAST_VISIT_KEY = 'last-visit-timestamp'
const SESSION_CHECK_KEY = 'login-trigger-checked'
const STALE_THRESHOLD_MS = 30 * 60 * 1000 // 30 minutes - consider stale after this

interface LoginTriggerState {
  pendingJobs: Job[]
  isChecking: boolean
  hasChecked: boolean
}

export function useLoginTrigger() {
  const [state, setState] = useState<LoginTriggerState>({
    pendingJobs: [],
    isChecking: false,
    hasChecked: false,
  })
  const checkInitiatedRef = useRef(false)

  // Check if we've already checked this session
  const hasCheckedThisSession = useCallback((): boolean => {
    if (typeof window === 'undefined') return true
    return sessionStorage.getItem(SESSION_CHECK_KEY) === 'true'
  }, [])

  // Mark that we've checked this session
  const markChecked = useCallback(() => {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(SESSION_CHECK_KEY, 'true')
    setState(prev => ({ ...prev, hasChecked: true }))
  }, [])

  // Get last visit timestamp
  const getLastVisit = useCallback((): number | null => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(LAST_VISIT_KEY)
    return stored ? parseInt(stored, 10) : null
  }, [])

  // Update last visit timestamp
  const updateLastVisit = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(LAST_VISIT_KEY, Date.now().toString())
  }, [])

  // Check if enough time has passed since last visit
  const isStaleVisit = useCallback((): boolean => {
    const lastVisit = getLastVisit()
    if (!lastVisit) return true // First visit
    return Date.now() - lastVisit > STALE_THRESHOLD_MS
  }, [getLastVisit])

  // Fetch on-login jobs
  const fetchOnLoginJobs = useCallback(async (): Promise<Job[]> => {
    try {
      const res = await fetch('/api/jobs?trigger=on-login')
      if (!res.ok) return []
      const data = await res.json()
      return data.jobs || []
    } catch {
      return []
    }
  }, [])

  // Filter jobs that should run (not recently run)
  const filterJobsToRun = useCallback((jobs: Job[]): Job[] => {
    const now = Date.now()
    return jobs.filter(job => {
      // Skip if currently running
      if (job.status === 'running') return false

      // If never run, should run
      if (!job.lastRun) return true

      // If last run was more than stale threshold ago, should run
      const lastRun = new Date(job.lastRun).getTime()
      return now - lastRun > STALE_THRESHOLD_MS
    })
  }, [])

  // Main check function - runs once per session
  const checkAndQueueJobs = useCallback(async () => {
    // Prevent multiple checks in the same session
    if (checkInitiatedRef.current || hasCheckedThisSession()) {
      setState(prev => ({ ...prev, hasChecked: true }))
      return
    }

    checkInitiatedRef.current = true
    setState(prev => ({ ...prev, isChecking: true }))

    try {
      // Check if this is a stale visit
      if (!isStaleVisit()) {
        // Not stale, just update timestamp and skip
        updateLastVisit()
        markChecked()
        setState(prev => ({ ...prev, isChecking: false }))
        return
      }

      // Fetch on-login jobs
      const onLoginJobs = await fetchOnLoginJobs()
      if (onLoginJobs.length === 0) {
        updateLastVisit()
        markChecked()
        setState(prev => ({ ...prev, isChecking: false }))
        return
      }

      // Filter to jobs that should actually run
      const jobsToRun = filterJobsToRun(onLoginJobs)

      // Update state with pending jobs
      setState(prev => ({
        ...prev,
        pendingJobs: jobsToRun,
        isChecking: false,
      }))

      // Update last visit timestamp
      updateLastVisit()
    } catch (error) {
      console.error('Error checking login trigger:', error)
      markChecked()
      setState(prev => ({ ...prev, isChecking: false }))
    }
  }, [hasCheckedThisSession, isStaleVisit, fetchOnLoginJobs, filterJobsToRun, updateLastVisit, markChecked])

  // Clear pending jobs (after user dismisses or jobs complete)
  const clearPendingJobs = useCallback(() => {
    markChecked()
    setState(prev => ({ ...prev, pendingJobs: [] }))
  }, [markChecked])

  // Remove a specific job from pending (e.g., after it starts running)
  const removePendingJob = useCallback((jobId: string) => {
    setState(prev => ({
      ...prev,
      pendingJobs: prev.pendingJobs.filter(j => j.id !== jobId),
    }))
  }, [])

  // Run the check on mount
  useEffect(() => {
    checkAndQueueJobs()
  }, [checkAndQueueJobs])

  return {
    pendingJobs: state.pendingJobs,
    isChecking: state.isChecking,
    hasChecked: state.hasChecked,
    hasPendingJobs: state.pendingJobs.length > 0,
    clearPendingJobs,
    removePendingJob,
  }
}

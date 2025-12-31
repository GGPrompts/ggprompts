/**
 * Client-side storage for job results
 * Results are stored in localStorage for cross-session access
 */

import { useState, useEffect, useCallback } from 'react'
import type { JobResult, JobResultsData, ProjectRunResult } from '@/lib/jobs/types'

const STORAGE_KEY = 'job-results'
const CURRENT_VERSION = 1
const MAX_RESULTS = 50 // Keep last 50 results

function loadResults(): JobResultsData {
  if (typeof window === 'undefined') {
    return { results: [], version: CURRENT_VERSION }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { results: [], version: CURRENT_VERSION }
    }
    return JSON.parse(stored) as JobResultsData
  } catch {
    return { results: [], version: CURRENT_VERSION }
  }
}

function saveResults(data: JobResultsData): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save job results:', error)
  }
}

function generateSummary(projects: ProjectRunResult[]): string {
  const completed = projects.filter(p => !p.preCheckSkipped && !p.error).length
  const skipped = projects.filter(p => p.preCheckSkipped).length
  const errors = projects.filter(p => p.error).length
  const needsHuman = projects.filter(p => p.needsHuman).length

  const parts: string[] = []
  if (completed > 0) parts.push(`${completed} completed`)
  if (skipped > 0) parts.push(`${skipped} skipped`)
  if (errors > 0) parts.push(`${errors} failed`)
  if (needsHuman > 0) parts.push(`${needsHuman} need review`)

  return parts.join(', ') || 'No projects processed'
}

export function useJobResults() {
  const [data, setData] = useState<JobResultsData>({ results: [], version: CURRENT_VERSION })
  const [isLoaded, setIsLoaded] = useState(false)

  // Load results on mount
  useEffect(() => {
    setData(loadResults())
    setIsLoaded(true)
  }, [])

  // Save a new result
  const saveResult = useCallback((result: Omit<JobResult, 'isRead' | 'summary'>) => {
    setData(prev => {
      const newResult: JobResult = {
        ...result,
        isRead: false,
        summary: generateSummary(result.projects),
      }

      // Add to beginning, remove duplicates, limit to MAX_RESULTS
      const filtered = prev.results.filter(r => r.id !== result.id)
      const updated: JobResultsData = {
        ...prev,
        results: [newResult, ...filtered].slice(0, MAX_RESULTS),
      }

      saveResults(updated)
      return updated
    })
  }, [])

  // Get all results
  const getResults = useCallback((): JobResult[] => {
    return data.results
  }, [data.results])

  // Get a single result by ID
  const getResult = useCallback((id: string): JobResult | undefined => {
    return data.results.find(r => r.id === id)
  }, [data.results])

  // Mark a result as read
  const markRead = useCallback((id: string) => {
    setData(prev => {
      const updated: JobResultsData = {
        ...prev,
        results: prev.results.map(r =>
          r.id === id ? { ...r, isRead: true } : r
        ),
      }
      saveResults(updated)
      return updated
    })
  }, [])

  // Mark all results as read
  const markAllRead = useCallback(() => {
    setData(prev => {
      const updated: JobResultsData = {
        ...prev,
        results: prev.results.map(r => ({ ...r, isRead: true })),
      }
      saveResults(updated)
      return updated
    })
  }, [])

  // Delete a result
  const deleteResult = useCallback((id: string) => {
    setData(prev => {
      const updated: JobResultsData = {
        ...prev,
        results: prev.results.filter(r => r.id !== id),
      }
      saveResults(updated)
      return updated
    })
  }, [])

  // Get unread count
  const getUnreadCount = useCallback((): number => {
    return data.results.filter(r => !r.isRead).length
  }, [data.results])

  // Get needs-human count (unread only)
  const getNeedsHumanCount = useCallback((): number => {
    return data.results.filter(r => !r.isRead && r.status === 'needs-human').length
  }, [data.results])

  return {
    results: data.results,
    isLoaded,
    saveResult,
    getResults,
    getResult,
    markRead,
    markAllRead,
    deleteResult,
    unreadCount: data.results.filter(r => !r.isRead).length,
    needsHumanCount: data.results.filter(r => !r.isRead && r.status === 'needs-human').length,
  }
}

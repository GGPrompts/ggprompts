'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'

type UserRole = 'user' | 'admin'

interface UseUserRoleReturn {
  role: UserRole | null
  isAdmin: boolean
  loading: boolean
}

/**
 * Hook for fetching and caching the current user's role
 * Returns isAdmin boolean for easy permission checks
 */
export function useUserRole(): UseUserRoleReturn {
  const { user, loading: authLoading } = useAuth()
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setRole(null)
      setLoading(false)
      return
    }

    const fetchRole = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Failed to fetch user role:', error)
          setRole('user') // Default to user on error
        } else {
          setRole((data?.role as UserRole) || 'user')
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error)
        setRole('user')
      } finally {
        setLoading(false)
      }
    }

    fetchRole()
  }, [user, authLoading])

  return {
    role,
    isAdmin: role === 'admin',
    loading: loading || authLoading,
  }
}

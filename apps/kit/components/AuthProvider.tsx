"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js"
import { getSupabaseClient, AUTH_PROVIDERS, AuthProvider as AuthProviderType, isSupabaseConfigured } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isConfigured: boolean
  signInWithProvider: (provider: AuthProviderType) => Promise<void>
  signOut: () => Promise<void>
  getGitHubToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = getSupabaseClient()

  useEffect(() => {
    // If Supabase is not configured, skip auth
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Error getting session:", error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log("Auth state changed:", event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Store provider_token when user signs in (it's only available right after OAuth)
        if (event === "SIGNED_IN" && session?.provider_token) {
          localStorage.setItem("github-provider-token", session.provider_token)
        }

        // Clear stored token on sign out
        if (event === "SIGNED_OUT") {
          localStorage.removeItem("github-provider-token")
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signInWithProvider = useCallback(async (provider: AuthProviderType) => {
    if (!supabase) {
      throw new Error("Supabase not configured")
    }

    const redirectTo = typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : undefined

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        scopes: provider === AUTH_PROVIDERS.GITHUB ? "repo" : undefined,
      },
    })

    if (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }, [supabase])

  const signOut = useCallback(async () => {
    if (!supabase) {
      throw new Error("Supabase not configured")
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }, [supabase])

  const getGitHubToken = useCallback(async (): Promise<string | null> => {
    if (!supabase) {
      return null
    }

    try {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        return null
      }

      // Try to get provider_token from session first (available right after OAuth)
      if (data.session.provider_token) {
        // Store it for future use
        localStorage.setItem("github-provider-token", data.session.provider_token)
        return data.session.provider_token
      }

      // Fall back to stored token (Supabase doesn't persist provider_token)
      const storedToken = localStorage.getItem("github-provider-token")
      return storedToken
    } catch (error) {
      console.error("Error getting GitHub token:", error)
      return null
    }
  }, [supabase])

  const value: AuthContextType = {
    user,
    session,
    loading,
    isConfigured: isSupabaseConfigured,
    signInWithProvider,
    signOut,
    getGitHubToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export function createClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not configured - auth features disabled")
    return null
  }
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
}

// Singleton instance for client-side use
let client: SupabaseClient | null | undefined = undefined

export function getSupabaseClient(): SupabaseClient | null {
  if (client === undefined) {
    client = createClient()
  }
  return client
}

// Auth provider options
export const AUTH_PROVIDERS = {
  GITHUB: "github",
  GOOGLE: "google",
} as const

export type AuthProvider = (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS]

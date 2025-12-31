import { createClient } from '@/lib/supabase/server'
import { Component } from '@/lib/types'
import ClaudeCodeClient from './ClaudeCodeClient'

export default async function ClaudeCodePage() {
  const supabase = await createClient()

  // Fetch featured components (only approved)
  const { data: featured } = await supabase
    .from('components')
    .select('*')
    .eq('is_featured', true)
    .eq('status', 'approved')
    .order('downloads', { ascending: false })
    .limit(6)

  // Fetch counts by type (only approved)
  const { data: typeCounts } = await supabase
    .from('components')
    .select('type')
    .eq('status', 'approved')

  const counts = {
    skill: 0,
    agent: 0,
    command: 0,
    hook: 0,
    mcp: 0,
  }

  typeCounts?.forEach((item) => {
    if (item.type in counts) {
      counts[item.type as keyof typeof counts]++
    }
  })

  return (
    <ClaudeCodeClient
      featured={featured as Component[] | null}
      counts={counts}
    />
  )
}

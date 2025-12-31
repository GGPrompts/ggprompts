import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncPluginsToDatabase } from '@/lib/sync-plugins'

export async function POST() {
  const supabase = await createClient()

  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  // Run the sync using the shared function
  const result = await syncPluginsToDatabase()

  return NextResponse.json(result)
}

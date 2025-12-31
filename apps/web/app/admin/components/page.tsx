import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Component, ComponentStatus } from '@/lib/types'
import { ComponentAdminTable } from './ComponentAdminTable'
import { SyncButton } from './SyncButton'
import { ExportButton } from './ExportButton'
import { Badge } from '@ggprompts/ui'
import { Shield } from 'lucide-react'
import Link from 'next/link'

interface AdminComponentsPageProps {
  searchParams: Promise<{
    status?: ComponentStatus | 'all'
    type?: string
  }>
}

export default async function AdminComponentsPage({ searchParams }: AdminComponentsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Check authentication and admin status
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?returnTo=/admin/components')
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'admin') {
    redirect('/')
  }

  // Build query
  let query = supabase
    .from('components')
    .select('*')
    .order('created_at', { ascending: false })

  // Apply status filter
  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }

  // Apply type filter
  if (params.type && params.type !== 'all') {
    query = query.eq('type', params.type)
  }

  const { data: components } = await query

  // Get counts by status
  const { data: allComponents } = await supabase
    .from('components')
    .select('status')

  const counts = {
    all: allComponents?.length || 0,
    pending: allComponents?.filter(c => c.status === 'pending').length || 0,
    approved: allComponents?.filter(c => c.status === 'approved').length || 0,
    rejected: allComponents?.filter(c => c.status === 'rejected').length || 0,
  }

  const currentStatus = params.status || 'all'
  const currentType = params.type || 'all'

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Shield className="h-6 w-6 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold">Component Admin</h1>
            </div>
            <p className="text-muted-foreground">
              Review, approve, and manage user-submitted components
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SyncButton />
            <ExportButton />
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="glass border-border/50 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <Link
                key={status}
                href={`/admin/components?status=${status}${currentType !== 'all' ? `&type=${currentType}` : ''}`}
              >
                <Badge
                  variant={currentStatus === status ? 'default' : 'outline'}
                  className={`cursor-pointer ${
                    status === 'pending' && counts.pending > 0 ? 'border-yellow-500/50' : ''
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="ml-1 text-xs opacity-70">({counts[status]})</span>
                </Badge>
              </Link>
            ))}
          </div>

          <div className="h-4 w-px bg-border mx-2" />

          <span className="text-sm font-medium text-muted-foreground">Type:</span>
          <div className="flex flex-wrap gap-2">
            {['all', 'skill', 'agent', 'command'].map((type) => (
              <Link
                key={type}
                href={`/admin/components?type=${type}${currentStatus !== 'all' ? `&status=${currentStatus}` : ''}`}
              >
                <Badge
                  variant={currentType === type ? 'default' : 'outline'}
                  className="cursor-pointer"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Components Table */}
      {components && components.length > 0 ? (
        <ComponentAdminTable components={components as Component[]} />
      ) : (
        <div className="glass border-border/50 rounded-xl p-12 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No components found</h3>
          <p className="text-muted-foreground">
            {currentStatus === 'pending'
              ? 'No pending components to review.'
              : 'Try adjusting your filters.'}
          </p>
        </div>
      )}
    </div>
  )
}

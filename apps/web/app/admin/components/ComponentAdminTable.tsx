'use client'

import { useState } from 'react'
import { Component } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Check,
  X,
  Trash2,
  ExternalLink,
  Star,
  Sparkles,
  Bot,
  Command,
  Clock,
  User,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import {
  approveComponent,
  rejectComponent,
  deleteComponent,
  toggleFeatured,
  bulkApproveComponents,
  bulkRejectComponents,
  bulkDeleteComponents
} from './actions'
import Link from 'next/link'

interface ComponentAdminTableProps {
  components: Component[]
}

const typeIcons = {
  skill: Sparkles,
  agent: Bot,
  command: Command,
  hook: Command,
  mcp: Command,
}

const typeColors = {
  skill: 'text-purple-500',
  agent: 'text-blue-500',
  command: 'text-green-500',
  hook: 'text-orange-500',
  mcp: 'text-cyan-500',
}

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50',
  approved: 'bg-green-500/10 text-green-500 border-green-500/50',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/50',
}

export function ComponentAdminTable({ components }: ComponentAdminTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [bulkLoading, setBulkLoading] = useState<'approve' | 'reject' | 'delete' | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [componentToDelete, setComponentToDelete] = useState<Component | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const allSelected = components.length > 0 && selectedIds.size === components.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < components.length

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(components.map(c => c.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
  }

  const handleApprove = async (component: Component) => {
    setLoadingId(component.id)
    const result = await approveComponent(component.id)
    if (result.success) {
      toast.success(`"${component.name}" approved`)
    } else {
      toast.error(result.error || 'Failed to approve')
    }
    setLoadingId(null)
  }

  const handleReject = async (component: Component) => {
    setLoadingId(component.id)
    const result = await rejectComponent(component.id)
    if (result.success) {
      toast.success(`"${component.name}" rejected`)
    } else {
      toast.error(result.error || 'Failed to reject')
    }
    setLoadingId(null)
  }

  const handleDelete = async () => {
    if (!componentToDelete) return

    setLoadingId(componentToDelete.id)
    const result = await deleteComponent(componentToDelete.id)
    if (result.success) {
      toast.success(`"${componentToDelete.name}" deleted`)
    } else {
      toast.error(result.error || 'Failed to delete')
    }
    setLoadingId(null)
    setDeleteDialogOpen(false)
    setComponentToDelete(null)
  }

  const handleToggleFeatured = async (component: Component) => {
    setLoadingId(component.id)
    const result = await toggleFeatured(component.id, !component.is_featured)
    if (result.success) {
      toast.success(component.is_featured ? 'Removed from featured' : 'Added to featured')
    } else {
      toast.error(result.error || 'Failed to update')
    }
    setLoadingId(null)
  }

  const openDeleteDialog = (component: Component) => {
    setComponentToDelete(component)
    setDeleteDialogOpen(true)
  }

  // Bulk action handlers
  const handleBulkApprove = async () => {
    setBulkLoading('approve')
    const ids = Array.from(selectedIds)
    const result = await bulkApproveComponents(ids)
    if (result.success) {
      toast.success(`${result.count} component${result.count !== 1 ? 's' : ''} approved`)
      clearSelection()
    } else {
      toast.error(result.error || 'Failed to approve components')
    }
    setBulkLoading(null)
  }

  const handleBulkReject = async () => {
    setBulkLoading('reject')
    const ids = Array.from(selectedIds)
    const result = await bulkRejectComponents(ids)
    if (result.success) {
      toast.success(`${result.count} component${result.count !== 1 ? 's' : ''} rejected`)
      clearSelection()
    } else {
      toast.error(result.error || 'Failed to reject components')
    }
    setBulkLoading(null)
  }

  const handleBulkDelete = async () => {
    setBulkLoading('delete')
    const ids = Array.from(selectedIds)
    const result = await bulkDeleteComponents(ids)
    if (result.success) {
      toast.success(`${result.count} component${result.count !== 1 ? 's' : ''} deleted`)
      clearSelection()
    } else {
      toast.error(result.error || 'Failed to delete components')
    }
    setBulkLoading(null)
    setBulkDeleteDialogOpen(false)
  }

  return (
    <>
      {/* Bulk Action Toolbar */}
      {selectedIds.size > 0 && (
        <div className="glass border-border/50 rounded-xl p-4 mb-4 sticky top-4 z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {selectedIds.size} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkApprove}
                disabled={bulkLoading !== null}
                className="text-green-500 border-green-500/50 hover:bg-green-500/10"
              >
                {bulkLoading === 'approve' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Approve ({selectedIds.size})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkReject}
                disabled={bulkLoading !== null}
                className="text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/10"
              >
                {bulkLoading === 'reject' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                Reject ({selectedIds.size})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkDeleteDialogOpen(true)}
                disabled={bulkLoading !== null}
                className="text-red-500 border-red-500/50 hover:bg-red-500/10"
              >
                {bulkLoading === 'delete' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete ({selectedIds.size})
              </Button>
              <div className="h-4 w-px bg-border mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                disabled={bulkLoading !== null}
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="glass border-border/50 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) {
                      (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = someSelected
                    }
                  }}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[300px]">Component</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components.map((component) => {
              const TypeIcon = typeIcons[component.type] || Command
              const isLoading = loadingId === component.id
              const isSelected = selectedIds.has(component.id)

              return (
                <TableRow
                  key={component.id}
                  className={`group ${isSelected ? 'bg-muted/50' : ''}`}
                  data-state={isSelected ? 'selected' : undefined}
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(component.id)}
                      aria-label={`Select ${component.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-muted/50 ${typeColors[component.type]}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/claude-code/${component.type}s/${component.slug}`}
                            className="font-medium hover:text-primary truncate"
                          >
                            {component.name}
                          </Link>
                          {component.is_featured && (
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          )}
                          {component.is_official && (
                            <Badge variant="secondary" className="text-xs">Official</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {component.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={typeColors[component.type]}>
                      {component.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      {component.author_name || 'Anonymous'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[component.status]}>
                      {component.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(component.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          {component.status !== 'approved' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(component)}
                              className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          {component.status !== 'rejected' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(component)}
                              className="h-8 w-8 p-0 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFeatured(component)}
                            className={`h-8 w-8 p-0 ${
                              component.is_featured
                                ? 'text-yellow-500 hover:text-yellow-600'
                                : 'text-muted-foreground hover:text-yellow-500'
                            } hover:bg-yellow-500/10`}
                            title={component.is_featured ? 'Remove from featured' : 'Add to featured'}
                          >
                            <Star className={`h-4 w-4 ${component.is_featured ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(component)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 w-8 p-0"
                            title="View"
                          >
                            <Link href={`/claude-code/${component.type}s/${component.slug}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Component</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete &quot;{componentToDelete?.name}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} Components</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {selectedIds.size} component{selectedIds.size !== 1 ? 's' : ''}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {bulkLoading === 'delete' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                `Delete ${selectedIds.size} Component${selectedIds.size !== 1 ? 's' : ''}`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

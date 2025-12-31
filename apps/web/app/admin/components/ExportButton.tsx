'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { triggerGitHubExport } from './actions'

export function ExportButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [lastExport, setLastExport] = useState<{ exported: number; time: Date } | null>(null)

  const handleExport = async () => {
    setIsLoading(true)
    setDialogOpen(false)

    try {
      const result = await triggerGitHubExport()

      if (result.error) {
        toast.error(result.error)
      } else if (result.exported === 0 && result.errors === 0) {
        toast.info('No user-submitted components to export', {
          description: 'Only approved components from users (not GGPrompts) are exported'
        })
      } else if (result.success) {
        toast.success(`Exported ${result.exported} components to GitHub`, {
          description: result.results
            .filter(r => r.status === 'created' || r.status === 'updated')
            .map(r => `${r.status}: ${r.slug}`)
            .slice(0, 5)
            .join(', ') + (result.exported > 5 ? '...' : '')
        })
        setLastExport({ exported: result.exported, time: new Date() })
      } else {
        toast.warning(`Export completed with ${result.errors} errors`, {
          description: `${result.exported} components exported`
        })
        if (result.exported > 0) {
          setLastExport({ exported: result.exported, time: new Date() })
        }
      }
    } catch (error) {
      toast.error('Export failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDialogOpen(true)}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isLoading ? 'Exporting...' : 'Export to GitHub'}
        </Button>
        {lastExport && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>
              {lastExport.exported} exported at {lastExport.time.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export to GitHub Repository</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This will export all approved user-submitted components to the
                GGPrompts/my-gg-plugins GitHub repository.
              </p>
              <p className="text-sm">
                Only components submitted by users (not official GGPrompts content)
                will be exported.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleExport}>
              Export to GitHub
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

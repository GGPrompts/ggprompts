'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function PromptsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Prompts page error:', error)
  }, [error])

  return (
    <div className="flex flex-col min-h-[60vh] items-center justify-center p-4">
      <Card className="glass border-border/50 max-w-md w-full">
        <CardContent className="pt-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="text-muted-foreground text-sm">
              We couldn&apos;t load the prompts. This might be a temporary issue.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} variant="default" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Go home
              </Link>
            </Button>
          </div>

          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeCustomizer } from '@/components/ThemeCustomizer'

export default function StyleguideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeCustomizer />
        <Button
          variant="outline"
          size="icon"
          className="glass border-primary/30 hover:border-primary/50 h-9 w-9"
          asChild
        >
          <Link href="/" title="Back to Home">
            <Home className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      {children}
    </>
  )
}

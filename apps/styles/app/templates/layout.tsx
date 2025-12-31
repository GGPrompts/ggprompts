'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeCustomizer } from '@/components/ThemeCustomizer'

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Extract template name from pathname (e.g., /templates/dashboard -> dashboard)
  const templateName = pathname.split('/').filter(Boolean)[1] || ''

  // Construct GitHub URL for the template source
  const githubUrl = templateName
    ? `https://github.com/GGPrompts/portfolio-style-guides/blob/master/app/templates/${templateName}/page.tsx`
    : 'https://github.com/GGPrompts/portfolio-style-guides/tree/master/app/templates'

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeCustomizer />
        {templateName && (
          <Button
            variant="outline"
            size="icon"
            className="glass border-primary/30 hover:border-primary/50 h-9 w-9"
            asChild
          >
            <Link href={githubUrl} target="_blank" rel="noopener noreferrer" title="View Source on GitHub">
              <Github className="w-4 h-4" />
            </Link>
          </Button>
        )}
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
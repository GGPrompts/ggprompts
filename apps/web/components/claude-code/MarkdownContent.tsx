'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn, Badge } from '@ggprompts/ui'
import { CopyCodeButton } from '@/components/ui/CopyCodeButton'
import { Bot, Sparkles, Command, Webhook, Plug } from 'lucide-react'

// Helper to extract text content from React children
function extractTextContent(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (!children) return ''

  if (Array.isArray(children)) {
    return children.map(extractTextContent).join('')
  }

  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode }
    return extractTextContent(props.children)
  }

  return ''
}

// Parse YAML frontmatter from markdown content
interface Frontmatter {
  name?: string
  model?: string
  description?: string
  [key: string]: string | undefined
}

function parseFrontmatter(content: string): { frontmatter: Frontmatter | null; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: null, body: content }
  }

  const frontmatterStr = match[1]
  const body = content.slice(match[0].length)

  // Simple YAML parser for key: value pairs
  const frontmatter: Frontmatter = {}
  const lines = frontmatterStr.split('\n')

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      frontmatter[key] = value
    }
  }

  return { frontmatter, body }
}

interface MarkdownContentProps {
  content: string
  className?: string
  showFrontmatter?: boolean
}

export function MarkdownContent({ content, className, showFrontmatter = true }: MarkdownContentProps) {
  const { frontmatter, body } = parseFrontmatter(content)

  // Model display names and colors
  const modelConfig: Record<string, { label: string; color: string }> = {
    haiku: { label: 'Haiku', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    sonnet: { label: 'Sonnet', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    opus: { label: 'Opus', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  }

  return (
    <div className={cn('prose prose-invert max-w-none', className)}>
      {/* Frontmatter display */}
      {showFrontmatter && frontmatter && Object.keys(frontmatter).length > 0 && (
        <div className="not-prose mb-6 p-4 rounded-lg bg-muted/30 border border-border/50">
          {frontmatter.name && (
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-foreground">{frontmatter.name}</span>
              {frontmatter.model && (
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    modelConfig[frontmatter.model]?.color || 'bg-muted text-muted-foreground'
                  )}
                >
                  {modelConfig[frontmatter.model]?.label || frontmatter.model}
                </Badge>
              )}
            </div>
          )}
          {frontmatter.description && (
            <p className="text-sm text-muted-foreground">{frontmatter.description}</p>
          )}
          {/* Show other frontmatter fields */}
          {Object.entries(frontmatter)
            .filter(([key]) => !['name', 'model', 'description'].includes(key))
            .map(([key, value]) => (
              <div key={key} className="mt-2 text-xs">
                <span className="text-muted-foreground">{key}:</span>{' '}
                <span className="text-foreground/80">{value}</span>
              </div>
            ))}
        </div>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mt-5 mb-3 text-foreground">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold mt-3 mb-2 text-foreground">{children}</h4>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-4 text-foreground/90 leading-relaxed">{children}</p>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1 text-foreground/90">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground/90">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground/90">{children}</li>
          ),
          // Code
          code: ({ className, children, ...props }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className={cn('font-mono text-sm', className)} {...props}>
                {children}
              </code>
            )
          },
          pre: ({ children }) => {
            const codeText = extractTextContent(children)
            return (
              <div className="relative group mb-4">
                <pre className="bg-muted/30 border border-border/50 rounded-lg p-4 pr-12 overflow-x-auto text-sm">
                  {children}
                </pre>
                <CopyCodeButton content={codeText} />
              </div>
            )
          },
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground mb-4">
              {children}
            </blockquote>
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {children}
            </a>
          ),
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-border/50 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/30">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold border-b border-border/50">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-b border-border/30">{children}</td>
          ),
          // Horizontal rule
          hr: () => <hr className="border-border/50 my-6" />,
          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
}

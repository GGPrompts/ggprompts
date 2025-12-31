'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  GitCommit,
  Copy,
  Play,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  AlertTriangle,
  FileText,
  Plus,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Commit types following conventional commits
const COMMIT_TYPES = [
  { value: 'feat', label: 'feat', description: 'New feature', color: 'bg-green-500' },
  { value: 'fix', label: 'fix', description: 'Bug fix', color: 'bg-red-500' },
  { value: 'docs', label: 'docs', description: 'Documentation', color: 'bg-blue-500' },
  { value: 'style', label: 'style', description: 'Formatting', color: 'bg-purple-500' },
  { value: 'refactor', label: 'refactor', description: 'Code restructure', color: 'bg-orange-500' },
  { value: 'test', label: 'test', description: 'Tests', color: 'bg-yellow-500' },
  { value: 'chore', label: 'chore', description: 'Maintenance', color: 'bg-gray-500' },
]

// Selectors for TabzChrome automation
const SELECTORS = [
  { id: 'commit-type', description: 'Select commit type (feat, fix, docs, style, refactor, test, chore)' },
  { id: 'commit-scope', description: 'Input for optional scope (e.g., auth, api, ui)' },
  { id: 'commit-message', description: 'Input for short commit message' },
  { id: 'commit-body', description: 'Textarea for extended commit body' },
  { id: 'commit-breaking', description: 'Checkbox for breaking change flag' },
  { id: 'commit-breaking-desc', description: 'Textarea for breaking change description' },
  { id: 'commit-footer', description: 'Input for footer (closes #, co-authored)' },
  { id: 'btn-preview', description: 'Button to preview formatted commit message' },
  { id: 'btn-copy', description: 'Copy commit message to clipboard' },
  { id: 'btn-execute', description: 'Run git commit command' },
  { id: 'staged-files', description: 'Container showing list of staged files' },
  { id: 'btn-stage-all', description: 'Button to stage all changes' },
  { id: 'btn-refresh-status', description: 'Button to refresh git status' },
  { id: 'commit-output', description: 'Output area showing formatted commit message' },
]

export default function CommitAutomationPage() {
  const [commitType, setCommitType] = useState('feat')
  const [scope, setScope] = useState('')
  const [message, setMessage] = useState('')
  const [body, setBody] = useState('')
  const [isBreaking, setIsBreaking] = useState(false)
  const [breakingDesc, setBreakingDesc] = useState('')
  const [closesIssues, setClosesIssues] = useState('')
  const [coAuthors, setCoAuthors] = useState<string[]>(['Claude <noreply@anthropic.com>'])
  const [newCoAuthor, setNewCoAuthor] = useState('')
  const [stagedFiles, setStagedFiles] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [selectorsOpen, setSelectorsOpen] = useState(false)
  const [executed, setExecuted] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  // Build the commit message
  const buildCommitMessage = () => {
    const parts: string[] = []

    // Header: type(scope): message
    let header = commitType
    if (scope) {
      header += `(${scope})`
    }
    header += `: ${message || 'describe your changes'}`
    parts.push(header)

    // Body
    if (body) {
      parts.push('')
      parts.push(body)
    }

    // Breaking change
    if (isBreaking && breakingDesc) {
      parts.push('')
      parts.push(`BREAKING CHANGE: ${breakingDesc}`)
    }

    // Closes issues
    if (closesIssues) {
      parts.push('')
      parts.push(`Closes ${closesIssues}`)
    }

    // Claude Code signature
    parts.push('')
    parts.push('🤖 Generated with [Claude Code](https://claude.com/claude-code)')

    // Co-authors
    coAuthors.forEach((author) => {
      parts.push('')
      parts.push(`Co-Authored-By: ${author}`)
    })

    return parts.join('\n')
  }

  // Copy to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildCommitMessage())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simulate execute (shows what would be run)
  const handleExecute = () => {
    setExecuted(true)
    setTimeout(() => setExecuted(false), 3000)
  }

  // Add co-author
  const addCoAuthor = () => {
    if (newCoAuthor && !coAuthors.includes(newCoAuthor)) {
      setCoAuthors([...coAuthors, newCoAuthor])
      setNewCoAuthor('')
    }
  }

  // Remove co-author
  const removeCoAuthor = (author: string) => {
    setCoAuthors(coAuthors.filter((a) => a !== author))
  }

  // Simulate refresh git status
  const handleRefreshStatus = () => {
    // In real usage, this would call git status
    // For demo, show sample files
    setStagedFiles([
      'M  src/components/Header.tsx',
      'A  src/utils/helpers.ts',
      'M  package.json',
    ])
  }

  // Simulate stage all
  const handleStageAll = () => {
    setStagedFiles([
      'M  src/components/Header.tsx',
      'A  src/utils/helpers.ts',
      'M  package.json',
      'M  README.md',
    ])
  }

  const commitMessage = buildCommitMessage()

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/automations"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Automations
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
              <GitCommit className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Conventional Commit Composer</h1>
            <Badge variant="secondary">Automation</Badge>
          </div>

          <p className="text-muted-foreground">
            Compose conventional commits with proper format. Type, scope, message, breaking changes.
            Preview and execute git commit.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Commit Type Section */}
            <Card className="glass border-border/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GitCommit className="h-5 w-5 text-primary" />
                Commit Type
              </h2>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2" id="commit-type">
                {COMMIT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setCommitType(type.value)}
                    data-value={type.value}
                    className={cn(
                      'flex flex-col items-center gap-1 p-2 rounded-lg border transition-all',
                      commitType === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    <div className={cn('w-3 h-3 rounded-full', type.color)} />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {COMMIT_TYPES.find((t) => t.value === commitType)?.description}
              </p>
            </Card>

            {/* Scope & Message Section */}
            <Card className="glass border-border/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Scope & Message
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="commit-scope" className="block text-sm font-medium mb-2">
                    Scope <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    id="commit-scope"
                    type="text"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    placeholder="e.g., auth, api, ui, db"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="commit-message" className="block text-sm font-medium mb-2">
                    Short Message <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="commit-message"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g., add user authentication flow"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use imperative mood: &quot;add&quot; not &quot;added&quot;, &quot;fix&quot; not
                    &quot;fixed&quot;
                  </p>
                </div>
              </div>
            </Card>

            {/* Body Section */}
            <Card className="glass border-border/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Extended Body</h2>

              <textarea
                id="commit-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Explain what changes were made and why. Provide context for reviewers..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
              />
            </Card>

            {/* Footer Section */}
            <Card className="glass border-border/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Footer & Breaking Changes
              </h2>

              <div className="space-y-4">
                {/* Breaking Change */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="commit-breaking"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <label htmlFor="commit-breaking" className="text-sm font-medium cursor-pointer">
                      Breaking Change
                    </label>
                    <p className="text-xs text-muted-foreground">
                      This commit introduces breaking API changes
                    </p>
                  </div>
                </div>

                {isBreaking && (
                  <textarea
                    id="commit-breaking-desc"
                    value={breakingDesc}
                    onChange={(e) => setBreakingDesc(e.target.value)}
                    placeholder="Describe the breaking change and migration path..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-destructive/50 focus:border-destructive focus:ring-1 focus:ring-destructive outline-none transition-colors resize-none"
                  />
                )}

                {/* Closes Issues */}
                <div>
                  <label htmlFor="commit-footer" className="block text-sm font-medium mb-2">
                    Closes Issues
                  </label>
                  <input
                    id="commit-footer"
                    type="text"
                    value={closesIssues}
                    onChange={(e) => setClosesIssues(e.target.value)}
                    placeholder="e.g., #123, #456"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>

                {/* Co-Authors */}
                <div>
                  <label className="block text-sm font-medium mb-2">Co-Authors</label>
                  <div className="space-y-2">
                    {coAuthors.map((author) => (
                      <div
                        key={author}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 text-sm"
                      >
                        <span className="flex-1 truncate">{author}</span>
                        <button
                          onClick={() => removeCoAuthor(author)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCoAuthor}
                        onChange={(e) => setNewCoAuthor(e.target.value)}
                        placeholder="Name <email@example.com>"
                        className="flex-1 px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && addCoAuthor()}
                      />
                      <Button variant="outline" size="sm" onClick={addCoAuthor}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Preview & Staged Files */}
          <div className="space-y-6">
            {/* Staged Files */}
            <Card className="glass border-border/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Staged Files</h2>
                <div className="flex gap-2">
                  <Button
                    id="btn-refresh-status"
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshStatus}
                  >
                    Refresh
                  </Button>
                  <Button id="btn-stage-all" variant="outline" size="sm" onClick={handleStageAll}>
                    Stage All
                  </Button>
                </div>
              </div>

              <div
                id="staged-files"
                className="min-h-[100px] rounded-lg bg-muted/30 border border-border p-3"
              >
                {stagedFiles.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Click &quot;Refresh&quot; to load staged files
                  </p>
                ) : (
                  <ul className="space-y-1 font-mono text-sm">
                    {stagedFiles.map((file, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span
                          className={cn(
                            'w-5 text-center',
                            file.startsWith('M') && 'text-yellow-500',
                            file.startsWith('A') && 'text-green-500',
                            file.startsWith('D') && 'text-red-500'
                          )}
                        >
                          {file.charAt(0)}
                        </span>
                        <span className="text-muted-foreground">{file.slice(3)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>

            {/* Preview */}
            <Card className="glass border-border/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  Commit Preview
                </h2>
                <Button
                  id="btn-preview"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? 'Hide' : 'Show'}
                </Button>
              </div>

              {showPreview && (
                <pre
                  id="commit-output"
                  className="min-h-[200px] rounded-lg bg-muted/30 border border-border p-4 text-sm font-mono whitespace-pre-wrap overflow-auto"
                >
                  {commitMessage}
                </pre>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  id="btn-copy"
                  variant="outline"
                  onClick={handleCopy}
                  className="flex-1 sm:flex-none"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Message
                    </>
                  )}
                </Button>

                <Button
                  id="btn-execute"
                  onClick={handleExecute}
                  disabled={!message}
                  className="flex-1 sm:flex-none"
                >
                  {executed ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Committed!
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Execute Commit
                    </>
                  )}
                </Button>
              </div>

              {executed && (
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm">
                  <p className="font-medium text-green-500 mb-1">Commit created successfully!</p>
                  <p className="text-muted-foreground font-mono text-xs">
                    git commit -m &quot;{commitType}
                    {scope ? `(${scope})` : ''}: {message}&quot;
                  </p>
                </div>
              )}
            </Card>

            {/* Git Command Reference */}
            <Card className="glass border-border/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Commit Format</h2>
              <pre className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 overflow-x-auto">
                {`type(scope): short message

Extended body with details.

BREAKING CHANGE: description

Closes #123

🤖 Generated with Claude Code

Co-Authored-By: Name <email>`}
              </pre>
            </Card>
          </div>
        </div>

        {/* Selectors Panel */}
        <Card className="glass border-border/50 rounded-xl overflow-hidden mt-6">
          <button
            onClick={() => setSelectorsOpen(!selectorsOpen)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              TabzChrome Selectors
            </h2>
            {selectorsOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {selectorsOpen && (
            <div className="px-6 pb-6">
              <p className="text-sm text-muted-foreground mb-4">
                All interactive elements on this page can be automated via TabzChrome MCP tools.
              </p>
              <div className="grid gap-2">
                {SELECTORS.map((selector) => (
                  <div
                    key={selector.id}
                    className="flex items-start gap-3 py-2 px-3 rounded-lg bg-muted/30"
                  >
                    <code className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-mono shrink-0">
                      #{selector.id}
                    </code>
                    <span className="text-sm text-muted-foreground">{selector.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

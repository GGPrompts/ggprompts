'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  GitPullRequest,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Play,
  FileText,
  GitBranch,
  AlertCircle,
} from 'lucide-react'
import { Button, Card, Badge } from '@ggprompts/ui'

// PR types
const PR_TYPES = [
  { value: 'feat', label: 'feat', description: 'New feature' },
  { value: 'fix', label: 'fix', description: 'Bug fix' },
  { value: 'docs', label: 'docs', description: 'Documentation' },
  { value: 'refactor', label: 'refactor', description: 'Code refactor' },
  { value: 'test', label: 'test', description: 'Tests' },
  { value: 'chore', label: 'chore', description: 'Maintenance' },
]

// Selectors for TabzChrome automation
const SELECTORS = [
  { id: 'pr-title', description: 'Title input for the PR' },
  { id: 'pr-type', description: 'Type select (feat, fix, docs, refactor, test, chore)' },
  { id: 'pr-summary', description: 'Summary bullets textarea' },
  { id: 'pr-test-plan', description: 'Test plan checklist textarea' },
  { id: 'target-repo', description: 'Repository input (owner/repo format)' },
  { id: 'target-branch', description: 'Base branch (default: main)' },
  { id: 'source-branch', description: 'Source branch (current working branch)' },
  { id: 'btn-preview', description: 'Preview formatted PR body' },
  { id: 'btn-copy-command', description: 'Copy gh pr create command to clipboard' },
  { id: 'btn-create-pr', description: 'Execute gh pr create command' },
  { id: 'preview-panel', description: 'Shows formatted PR body preview' },
  { id: 'command-output', description: 'Shows generated gh command' },
]

export default function GitHubPRAutomationPage() {
  const [prType, setPrType] = useState('feat')
  const [prTitle, setPrTitle] = useState('')
  const [prSummary, setPrSummary] = useState('')
  const [prTestPlan, setPrTestPlan] = useState('')
  const [targetRepo, setTargetRepo] = useState('')
  const [targetBranch, setTargetBranch] = useState('main')
  const [sourceBranch, setSourceBranch] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectorsOpen, setSelectorsOpen] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<{ success: boolean; message: string } | null>(null)

  // Format summary bullets
  const formatSummary = () => {
    if (!prSummary.trim()) return ''
    return prSummary
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => `- ${line.trim().replace(/^[-*]\s*/, '')}`)
      .join('\n')
  }

  // Format test plan checklist
  const formatTestPlan = () => {
    if (!prTestPlan.trim()) return ''
    return prTestPlan
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => `- [ ] ${line.trim().replace(/^[-*\[\]x ]+/i, '')}`)
      .join('\n')
  }

  // Build the PR body
  const buildPRBody = () => {
    const summary = formatSummary()
    const testPlan = formatTestPlan()

    let body = '## Summary\n'
    body += summary || '- [Add summary bullet points]'
    body += '\n\n## Test Plan\n'
    body += testPlan || '- [ ] [Add test plan items]'
    body += '\n\n---\nGenerated with [Claude Code](https://claude.com/claude-code)'

    return body
  }

  // Build the full PR title
  const buildFullTitle = () => {
    const title = prTitle.trim() || 'description'
    return `${prType}: ${title}`
  }

  // Build the gh command
  const buildGHCommand = () => {
    const fullTitle = buildFullTitle()
    const body = buildPRBody()
    const escapedBody = body.replace(/'/g, "'\"'\"'")

    let command = `gh pr create --title "${fullTitle}" --body '${escapedBody}'`

    if (targetBranch && targetBranch !== 'main') {
      command += ` --base ${targetBranch}`
    }

    if (targetRepo) {
      command += ` --repo ${targetRepo}`
    }

    return command
  }

  // Copy to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildGHCommand())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle preview toggle
  const handlePreview = () => {
    setShowPreview(!showPreview)
  }

  // Simulate PR creation (in real use, TabzChrome would execute the command)
  const handleCreatePR = async () => {
    setExecuting(true)
    setExecutionResult(null)

    // Simulate execution delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real scenario, this would be handled by the terminal
    // For now, show a message about using the command
    setExecutionResult({
      success: true,
      message: 'Command ready! Copy and run in your terminal, or use TabzChrome to execute via tmux.',
    })

    setExecuting(false)
  }

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
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
              <GitPullRequest className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">GitHub PR</h1>
            <Badge variant="secondary">Automation</Badge>
          </div>

          <p className="text-muted-foreground">
            Compose and create GitHub PRs with proper formatting. Generate gh pr create commands
            with structured summary and test plan sections.
          </p>
        </div>

        {/* PR Configuration */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            PR Details
          </h2>

          {/* Type and Title Row */}
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {/* PR Type */}
            <div>
              <label htmlFor="pr-type" className="block text-sm font-medium mb-2">
                Type
              </label>
              <select
                id="pr-type"
                value={prType}
                onChange={(e) => setPrType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              >
                {PR_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {PR_TYPES.find((t) => t.value === prType)?.description}
              </p>
            </div>

            {/* PR Title */}
            <div className="md:col-span-3">
              <label htmlFor="pr-title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                id="pr-title"
                type="text"
                value={prTitle}
                onChange={(e) => setPrTitle(e.target.value)}
                placeholder="add user authentication flow"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Preview: <code className="text-primary">{buildFullTitle()}</code>
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-4">
            <label htmlFor="pr-summary" className="block text-sm font-medium mb-2">
              Summary Bullets
            </label>
            <textarea
              id="pr-summary"
              value={prSummary}
              onChange={(e) => setPrSummary(e.target.value)}
              placeholder="Add new login component&#10;Integrate with OAuth provider&#10;Add session management"
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter one item per line. Will be formatted as bullet points.
            </p>
          </div>

          {/* Test Plan */}
          <div>
            <label htmlFor="pr-test-plan" className="block text-sm font-medium mb-2">
              Test Plan Checklist
            </label>
            <textarea
              id="pr-test-plan"
              value={prTestPlan}
              onChange={(e) => setPrTestPlan(e.target.value)}
              placeholder="Verify login flow works&#10;Check session persistence&#10;Test error handling"
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter one item per line. Will be formatted as checkboxes.
            </p>
          </div>
        </Card>

        {/* Branch Configuration */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Branch Configuration
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Repository */}
            <div>
              <label htmlFor="target-repo" className="block text-sm font-medium mb-2">
                Repository (optional)
              </label>
              <input
                id="target-repo"
                type="text"
                value={targetRepo}
                onChange={(e) => setTargetRepo(e.target.value)}
                placeholder="owner/repo"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-1">Leave empty for current repo</p>
            </div>

            {/* Base Branch */}
            <div>
              <label htmlFor="target-branch" className="block text-sm font-medium mb-2">
                Base Branch
              </label>
              <input
                id="target-branch"
                type="text"
                value={targetBranch}
                onChange={(e) => setTargetBranch(e.target.value)}
                placeholder="main"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-1">Target branch for merge</p>
            </div>

            {/* Source Branch */}
            <div>
              <label htmlFor="source-branch" className="block text-sm font-medium mb-2">
                Source Branch (optional)
              </label>
              <input
                id="source-branch"
                type="text"
                value={sourceBranch}
                onChange={(e) => setSourceBranch(e.target.value)}
                placeholder="current branch"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-1">Defaults to current branch</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            id="btn-preview"
            variant="outline"
            onClick={handlePreview}
            className="flex-1 sm:flex-none"
          >
            <FileText className="h-4 w-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Preview PR'}
          </Button>

          <Button
            id="btn-copy-command"
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
                Copy Command
              </>
            )}
          </Button>

          <Button
            id="btn-create-pr"
            onClick={handleCreatePR}
            disabled={executing}
            className="flex-1 sm:flex-none"
          >
            {executing ? (
              <>
                <div className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Create PR
              </>
            )}
          </Button>
        </div>

        {/* Execution Result */}
        {executionResult && (
          <Card
            className={`border-border/50 rounded-xl p-4 mb-6 ${
              executionResult.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                className={`h-5 w-5 shrink-0 ${
                  executionResult.success ? 'text-green-500' : 'text-red-500'
                }`}
              />
              <p className="text-sm">{executionResult.message}</p>
            </div>
          </Card>
        )}

        {/* Preview Panel */}
        {showPreview && (
          <Card id="preview-panel" className="glass border-border/50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              PR Preview
            </h2>

            {/* Title Preview */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Title</h3>
              <p className="text-lg font-semibold">{buildFullTitle()}</p>
            </div>

            {/* Body Preview */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Body</h3>
              <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                {buildPRBody()}
              </div>
            </div>
          </Card>
        )}

        {/* Command Output */}
        <Card id="command-output" className="glass border-border/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            Generated Command
          </h2>

          <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="whitespace-pre-wrap break-all">{buildGHCommand()}</pre>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Run this command in your terminal, or let TabzChrome execute it via tmux send-keys.
          </p>
        </Card>

        {/* Selectors Panel */}
        <Card className="glass border-border/50 rounded-xl overflow-hidden">
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

'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Plus, GitPullRequest, Bot, Tag, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

// Mock data for demo - in production, this would come from GitHub API
interface Issue {
  number: number
  title: string
  labels: string[]
  assignee?: string
  workerAssigned?: string
  linkedPR?: { number: number; status: 'open' | 'ready' | 'merged' }
  state: 'open' | 'closed'
  hasInProgressLabel: boolean
}

const mockIssues: Issue[] = [
  { number: 1, title: 'Setup authentication flow', labels: ['auth', 'priority:high'], state: 'closed', hasInProgressLabel: false },
  { number: 2, title: 'Add dark mode support', labels: ['ui', 'enhancement'], state: 'open', hasInProgressLabel: false },
  { number: 3, title: 'Implement user profiles', labels: ['feature'], state: 'open', hasInProgressLabel: true, workerAssigned: 'ctt-profiles-abc', linkedPR: { number: 5, status: 'ready' } },
  { number: 4, title: 'Fix navigation bug', labels: ['bug', 'ui'], state: 'open', hasInProgressLabel: false },
  { number: 5, title: 'Add API rate limiting', labels: ['backend', 'security'], state: 'open', hasInProgressLabel: true, workerAssigned: 'ctt-security-xyz' },
  { number: 6, title: 'Database optimization', labels: ['backend', 'performance'], state: 'open', hasInProgressLabel: false, linkedPR: { number: 8, status: 'open' } },
  { number: 7, title: 'Write unit tests', labels: ['testing'], state: 'closed', hasInProgressLabel: false, linkedPR: { number: 9, status: 'merged' } },
  { number: 8, title: 'Update dependencies', labels: ['maintenance'], state: 'open', hasInProgressLabel: false },
]

const repositories = [
  { owner: 'GGPrompts', repo: 'ggprompts-next' },
  { owner: 'GGPrompts', repo: 'TabzChrome' },
  { owner: 'GGPrompts', repo: 'claude-plugins' },
]

// Inline SelectorsPanel component
function SelectorsPanel({ selectors }: { selectors: { id: string; description: string }[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div id="selectors-panel" className="fixed bottom-4 right-4 z-50">
      <div className="glass rounded-lg overflow-hidden max-w-md">
        <button
          id="btn-toggle-selectors"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 text-sm font-mono text-foreground hover:bg-primary/10 transition-colors"
        >
          <span>Selectors ({selectors.length})</span>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        {isOpen && (
          <div className="max-h-64 overflow-y-auto border-t border-border/50">
            <table className="w-full text-xs font-mono">
              <tbody>
                {selectors.map(({ id, description }) => (
                  <tr key={id} className="border-b border-border/30 last:border-0">
                    <td className="p-2 text-primary font-medium whitespace-nowrap">#{id}</td>
                    <td className="p-2 text-muted-foreground">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function IssueCard({ issue }: { issue: Issue }) {
  const prStatusColors = {
    open: 'bg-yellow-500/20 text-yellow-400',
    ready: 'bg-green-500/20 text-green-400',
    merged: 'bg-purple-500/20 text-purple-400',
  }

  return (
    <div
      id={`issue-${issue.number}`}
      className="glass p-3 rounded-lg space-y-2 cursor-grab hover:border-primary/50 transition-colors"
      draggable
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-foreground leading-tight">
          #{issue.number} {issue.title}
        </h4>
      </div>

      {issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {issue.labels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-primary/20 text-primary"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-border/30">
        <div className="flex items-center gap-2">
          {issue.workerAssigned && (
            <div className="flex items-center gap-1 text-xs text-secondary">
              <Bot className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{issue.workerAssigned}</span>
            </div>
          )}

          {issue.linkedPR && (
            <button
              id={`issue-${issue.number}-pr`}
              className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${prStatusColors[issue.linkedPR.status]}`}
            >
              <GitPullRequest className="w-3 h-3" />
              #{issue.linkedPR.number}
            </button>
          )}
        </div>

        <button
          id={`issue-${issue.number}-assign`}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
          title="Assign worker"
        >
          <Bot className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function KanbanColumn({
  id,
  title,
  issues,
  color
}: {
  id: string
  title: string
  issues: Issue[]
  color: string
}) {
  return (
    <div id={id} className="flex flex-col min-h-[400px]">
      <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${color}`}>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
          {issues.length}
        </span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {issues.map((issue) => (
          <IssueCard key={issue.number} issue={issue} />
        ))}
        {issues.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            No issues
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProjectBoardPage() {
  const [selectedRepo, setSelectedRepo] = useState(`${repositories[0].owner}/${repositories[0].repo}`)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- setIssues will be used when GitHub API is integrated
  const [issues, setIssues] = useState<Issue[]>(mockIssues)
  const [labelFilter, setLabelFilter] = useState<string>('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Get unique labels from all issues
  const allLabels = [...new Set(issues.flatMap((i) => i.labels))]

  // Filter issues by label
  const filteredIssues = labelFilter
    ? issues.filter((i) => i.labels.includes(labelFilter))
    : issues

  // Column logic from the issue spec
  const backlog = filteredIssues.filter(
    (i) => i.state === 'open' && !i.hasInProgressLabel && !i.linkedPR
  )
  const inProgress = filteredIssues.filter(
    (i) => i.state === 'open' && (i.hasInProgressLabel || i.workerAssigned)
  )
  const inReview = filteredIssues.filter(
    (i) => i.state === 'open' && i.linkedPR && i.linkedPR.status !== 'merged'
  )
  const done = filteredIssues.filter(
    (i) => i.state === 'closed' || (i.linkedPR && i.linkedPR.status === 'merged')
  )

  // Simulate refresh from GitHub
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // In production: gh issue list --state open --json number,title,labels,assignees
    // and: gh pr list --json number,title,headRefName,state
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(handleRefresh, 30000)
    return () => clearInterval(interval)
  }, [])

  // Selector definitions for SelectorsPanel
  const selectors = [
    { id: 'board-container', description: 'Main kanban container' },
    { id: 'column-backlog', description: 'Backlog column' },
    { id: 'column-inprogress', description: 'In Progress column' },
    { id: 'column-review', description: 'In Review column' },
    { id: 'column-done', description: 'Done column' },
    { id: 'issue-{num}', description: 'Issue card by number' },
    { id: 'issue-{num}-assign', description: 'Assign worker button' },
    { id: 'issue-{num}-pr', description: 'Linked PR badge' },
    { id: 'btn-refresh', description: 'Refresh from GitHub' },
    { id: 'btn-create-issue', description: 'Create new issue' },
    { id: 'repo-select', description: 'Repository selector' },
    { id: 'filter-labels', description: 'Filter by labels' },
    { id: 'btn-toggle-selectors', description: 'Toggle selectors panel' },
  ]

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Background gradient */}
      <div className="bg-style-gradient" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="glass rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Project Board</h1>
              <p className="text-sm text-muted-foreground">
                GitHub Issues Kanban with TabzChrome automation
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Repo selector */}
              <select
                id="repo-select"
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className="glass px-3 py-2 rounded-md text-sm text-foreground bg-transparent border-border/50 focus:border-primary outline-none"
              >
                {repositories.map((r) => (
                  <option key={`${r.owner}/${r.repo}`} value={`${r.owner}/${r.repo}`}>
                    {r.owner}/{r.repo}
                  </option>
                ))}
              </select>

              {/* Label filter */}
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  id="filter-labels"
                  value={labelFilter}
                  onChange={(e) => setLabelFilter(e.target.value)}
                  className="glass pl-9 pr-3 py-2 rounded-md text-sm text-foreground bg-transparent border-border/50 focus:border-primary outline-none"
                >
                  <option value="">All labels</option>
                  {allLabels.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Refresh button */}
              <button
                id="btn-refresh"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="glass flex items-center gap-2 px-4 py-2 rounded-md text-sm text-foreground hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              {/* Create issue button */}
              <button
                id="btn-create-issue"
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Issue
              </button>
            </div>
          </div>

          {/* Last updated */}
          <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <a
              href={`https://github.com/${selectedRepo}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              View on GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Kanban Board */}
        <div id="board-container" className="glass rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KanbanColumn
              id="column-backlog"
              title="Backlog"
              issues={backlog}
              color="border-muted-foreground"
            />
            <KanbanColumn
              id="column-inprogress"
              title="In Progress"
              issues={inProgress}
              color="border-secondary"
            />
            <KanbanColumn
              id="column-review"
              title="In Review"
              issues={inReview}
              color="border-primary"
            />
            <KanbanColumn
              id="column-done"
              title="Done"
              issues={done}
              color="border-green-500"
            />
          </div>
        </div>

        {/* Worker Status Legend */}
        <div className="glass rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Worker Status</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-secondary" />
              <span className="text-muted-foreground">ctt-profiles-abc</span>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-secondary" />
              <span className="text-muted-foreground">ctt-security-xyz</span>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selectors Panel */}
      <SelectorsPanel selectors={selectors} />
    </div>
  )
}

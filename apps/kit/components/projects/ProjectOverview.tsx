"use client"

import * as React from "react"
import {
  FolderGit2,
  Terminal,
  Code,
  Github,
  FolderOpen,
  GitBranch,
  Star,
  GitFork,
  CircleAlert,
  Clock,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTerminalExtension } from "@/hooks/useTerminalExtension"
import { getStatusBadge, getGitStatusBadge, type Project } from "@/lib/projects"

interface ProjectOverviewProps {
  project: Project
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  const { available: terminalAvailable, runCommand } = useTerminalExtension()
  const statusBadge = getStatusBadge(project)

  // Format relative time
  const formatRelativeTime = (dateStr: string | undefined) => {
    if (!dateStr) return null
    const d = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const lastUpdated = project.github?.pushed_at || project.local?.lastModified
  const gitInfo = project.local?.git

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FolderGit2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold terminal-glow">{project.name}</h1>
                <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                {project.github?.private && (
                  <Badge variant="outline">Private</Badge>
                )}
                {project.github?.archived && (
                  <Badge variant="secondary">Archived</Badge>
                )}
              </div>
              {project.description && (
                <p className="text-muted-foreground mt-1">{project.description}</p>
              )}
              {project.github?.full_name && (
                <p className="text-sm text-muted-foreground mt-1 font-mono">
                  {project.github.full_name}
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {project.local && terminalAvailable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => runCommand("", { workingDir: project.local!.path, name: project.name })}
              >
                <Terminal className="h-4 w-4 mr-2" />
                Terminal
              </Button>
            )}
            {project.local && terminalAvailable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => runCommand(`code "${project.local!.path}"`, { name: `VS Code: ${project.name}` })}
              >
                <Code className="h-4 w-4 mr-2" />
                VS Code
              </Button>
            )}
            {project.local && terminalAvailable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => runCommand("tfe", { workingDir: project.local!.path, name: `TFE: ${project.name}` })}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
            )}
            {project.github && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.github.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Tech Stack */}
        {project.techStack.length > 0 && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Git Info */}
        {gitInfo && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Git Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm">{gitInfo.branch}</span>
                  <span className={`text-sm ${getGitStatusBadge(gitInfo.status).color}`}>
                    {getGitStatusBadge(gitInfo.status).label}
                  </span>
                </div>
                {(gitInfo.ahead > 0 || gitInfo.behind > 0) && (
                  <div className="text-sm text-muted-foreground">
                    {gitInfo.ahead > 0 && (
                      <span className="text-emerald-500">↑ {gitInfo.ahead} ahead</span>
                    )}
                    {gitInfo.ahead > 0 && gitInfo.behind > 0 && " · "}
                    {gitInfo.behind > 0 && (
                      <span className="text-amber-500">↓ {gitInfo.behind} behind</span>
                    )}
                  </div>
                )}
                {project.local?.path && (
                  <div className="text-xs text-muted-foreground font-mono truncate">
                    {project.local.path}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* GitHub Stats */}
        {project.github && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                GitHub Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400" />
                  <div>
                    <div className="font-semibold">{project.github.stargazers_count}</div>
                    <div className="text-xs text-muted-foreground">Stars</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <GitFork className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{project.github.forks_count}</div>
                    <div className="text-xs text-muted-foreground">Forks</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CircleAlert className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{project.github.open_issues_count}</div>
                    <div className="text-xs text-muted-foreground">Issues</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatRelativeTime(lastUpdated)}</span>
                <span className="text-xs text-muted-foreground">
                  ({new Date(lastUpdated).toLocaleDateString()})
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* GitHub Topics */}
      {project.github?.topics && project.github.topics.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.github.topics.map((topic) => (
                <Badge key={topic} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* npm Scripts Preview (if available) */}
      {project.local?.scripts && project.local.scripts.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Scripts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.local.scripts.slice(0, 10).map((script) => (
                <Badge
                  key={script}
                  variant="secondary"
                  className="font-mono text-xs cursor-pointer hover:bg-secondary/80"
                  onClick={() => {
                    if (terminalAvailable && project.local?.path) {
                      runCommand(`npm run ${script}`, {
                        workingDir: project.local.path,
                        name: `${project.name}: ${script}`,
                      })
                    }
                  }}
                >
                  {script}
                </Badge>
              ))}
              {project.local.scripts.length > 10 && (
                <span className="text-xs text-muted-foreground">
                  +{project.local.scripts.length - 10} more
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Click to run in terminal (requires terminal extension)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

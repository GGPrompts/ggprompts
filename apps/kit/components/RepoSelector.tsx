"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2, GitFork, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface GitHubRepo {
  id: number
  full_name: string
  name: string
  private: boolean
  fork: boolean
  pushed_at: string
  description: string | null
}

interface RepoSelectorProps {
  value: string
  onValueChange: (value: string) => void
  token: string | null
  disabled?: boolean
}

function formatPushedAt(pushedAt: string): string {
  const date = new Date(pushedAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  const diffWeeks = Math.floor(diffDays / 7)
  if (diffWeeks < 4) return `${diffWeeks}w ago`
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths}mo ago`
  const diffYears = Math.floor(diffDays / 365)
  return `${diffYears}y ago`
}

export function RepoSelector({ value, onValueChange, token, disabled }: RepoSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [repos, setRepos] = React.useState<GitHubRepo[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [hasFetched, setHasFetched] = React.useState(false)

  // Fetch repos when popover opens
  const fetchRepos = React.useCallback(async () => {
    if (!token || hasFetched) return

    setLoading(true)
    setError(null)

    try {
      // Fetch user's repos, sorted by most recently pushed
      const response = await fetch(
        "https://api.github.com/user/repos?sort=pushed&direction=desc&per_page=100&affiliation=owner",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      )

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data: GitHubRepo[] = await response.json()
      setRepos(data)
      setHasFetched(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch repos")
    } finally {
      setLoading(false)
    }
  }, [token, hasFetched])

  // Fetch when popover opens
  React.useEffect(() => {
    if (open && !hasFetched) {
      fetchRepos()
    }
  }, [open, hasFetched, fetchRepos])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || !token}
          className="w-full justify-between glass-dark font-normal"
        >
          {value || "Select repository..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search repositories..." />
          <CommandList>
            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Loading repos...</span>
              </div>
            )}
            {error && (
              <div className="py-6 text-center text-sm text-destructive">
                {error}
              </div>
            )}
            {!loading && !error && (
              <>
                <CommandEmpty>No repository found.</CommandEmpty>
                <CommandGroup>
                  {repos.map((repo) => (
                    <CommandItem
                      key={repo.id}
                      value={repo.full_name}
                      onSelect={(currentValue) => {
                        onValueChange(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0",
                            value === repo.full_name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex items-center gap-1.5 min-w-0">
                          {repo.private && <Lock className="h-3 w-3 shrink-0 text-amber-500" />}
                          {repo.fork && <GitFork className="h-3 w-3 shrink-0 text-muted-foreground" />}
                          <span className="truncate">{repo.name}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {formatPushedAt(repo.pushed_at)}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

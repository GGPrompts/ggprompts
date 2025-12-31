"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Github,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Bookmark,
  Settings,
  User,
  ExternalLink,
  Loader2,
  Terminal,
  X,
  Key,
  Server,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/AuthProvider"
import { AuthModal } from "@/components/AuthModal"
import { RepoSelector } from "@/components/RepoSelector"
import { useTerminalExtension } from "@/hooks/useTerminalExtension"

interface SyncStatus {
  lastSync: string | null
  itemCount: number
  repo: string | null
}

export default function ProfileSection() {
  const { user, loading, signOut, getGitHubToken, isConfigured } = useAuth()
  const {
    available: terminalAvailable,
    backendRunning,
    authenticated: terminalAuthenticated,
    error: terminalError,
    hasToken: hasTerminalToken,
    defaultWorkDir,
    setApiToken,
    clearApiToken,
    refreshStatus,
    updateDefaultWorkDir,
    isLoaded: terminalLoaded,
  } = useTerminalExtension()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [notesRepo, setNotesRepo] = useState(
    () => typeof window !== "undefined" ? localStorage.getItem("github-notes-repo") || "" : ""
  )
  const [bookmarksRepo, setBookmarksRepo] = useState(
    () => typeof window !== "undefined" ? localStorage.getItem("github-bookmarks-repo") || "" : ""
  )
  const [token, setToken] = useState<string | null>(null)
  const [terminalTokenInput, setTerminalTokenInput] = useState("")
  const [terminalTokenError, setTerminalTokenError] = useState<string | null>(null)
  const [showTerminalToken, setShowTerminalToken] = useState(false)
  const [refreshingTerminal, setRefreshingTerminal] = useState(false)
  const [workDirInput, setWorkDirInput] = useState(defaultWorkDir)

  // Sync workDirInput when defaultWorkDir loads
  useEffect(() => {
    setWorkDirInput(defaultWorkDir)
  }, [defaultWorkDir])

  // Load token when user is available
  useEffect(() => {
    const loadToken = async () => {
      const authToken = await getGitHubToken()
      setToken(authToken)
    }
    if (user) {
      loadToken()
    }
  }, [user, getGitHubToken])

  // Get sync status from localStorage
  const getNotesStatus = (): SyncStatus => {
    if (typeof window === "undefined") return { lastSync: null, itemCount: 0, repo: null }
    const repo = localStorage.getItem("github-notes-repo")

    // Count cached files and find most recent cache time
    let itemCount = 0
    let mostRecentCache: number | null = null

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("github-notes-cache-")) {
        itemCount++
        try {
          const cached = JSON.parse(localStorage.getItem(key) || "{}")
          if (cached.cachedAt && (!mostRecentCache || cached.cachedAt > mostRecentCache)) {
            mostRecentCache = cached.cachedAt
          }
        } catch {}
      }
    }

    return {
      lastSync: mostRecentCache ? new Date(mostRecentCache).toISOString() : null,
      itemCount,
      repo,
    }
  }

  const getBookmarksStatus = (): SyncStatus => {
    if (typeof window === "undefined") return { lastSync: null, itemCount: 0, repo: null }
    const repo = localStorage.getItem("github-bookmarks-repo")
    // Bookmarks don't have persistent cache - just show if repo is configured
    return { lastSync: null, itemCount: 0, repo }
  }

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return "Never"
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setSigningOut(false)
    }
  }

  const handleNotesRepoChange = (repo: string) => {
    setNotesRepo(repo)
    localStorage.setItem("github-notes-repo", repo)
  }

  const handleBookmarksRepoChange = (repo: string) => {
    setBookmarksRepo(repo)
    localStorage.setItem("github-bookmarks-repo", repo)
  }

  const handleTerminalTokenSubmit = async () => {
    if (!terminalTokenInput.trim()) return
    setTerminalTokenError(null)
    const success = await setApiToken(terminalTokenInput.trim())
    if (success) {
      setTerminalTokenInput("")
      setShowTerminalToken(false)
    } else {
      setTerminalTokenError("Could not verify token. Make sure the TabzChrome backend is running.")
    }
  }

  const handleRefreshTerminal = async () => {
    setRefreshingTerminal(true)
    setTerminalTokenError(null)
    await refreshStatus()
    setRefreshingTerminal(false)
  }

  const notesStatus = getNotesStatus()
  const bookmarksStatus = getBookmarksStatus()

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Supabase not configured
  if (!isConfigured) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-xl p-8 text-center">
          <div className="w-20 h-20 rounded-full glass-dark mx-auto mb-6 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Auth Not Configured</h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Add your Supabase credentials to enable GitHub authentication
          </p>
          <div className="glass-dark p-4 rounded-lg text-left max-w-md mx-auto">
            <p className="text-sm font-mono text-muted-foreground">
              # Add to .env.local<br />
              NEXT_PUBLIC_SUPABASE_URL=...<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-xl p-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 rounded-full glass-dark mx-auto mb-6 flex items-center justify-center">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Sign in with GitHub to sync your Quick Notes and Bookmarks across devices
            </p>
            <Button
              onClick={() => setShowAuthModal(true)}
              className="bg-[#24292e] hover:bg-[#24292e]/90 text-white"
            >
              <Github className="h-5 w-5 mr-2" />
              Sign in with GitHub
            </Button>
          </motion.div>
        </div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    )
  }

  // Logged in
  const githubUsername = user.user_metadata?.user_name || user.user_metadata?.preferred_username
  const avatarUrl = user.user_metadata?.avatar_url
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || githubUsername

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="h-16 w-16 border-2 border-primary/20 flex-shrink-0">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback>{fullName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="text-xl font-bold truncate">{fullName}</h2>
              {githubUsername && (
                <a
                  href={`https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  @{githubUsername}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <p className="text-sm text-muted-foreground mt-1 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={signingOut}
            className="glass-dark flex-shrink-0 w-full sm:w-auto"
          >
            {signingOut ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4 mr-2" />
            )}
            Sign Out
          </Button>
        </div>
      </div>

      {/* Connected Services */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Connected Services
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
            <div className="flex items-center gap-3">
              <Github className="h-5 w-5" />
              <div>
                <p className="font-medium">GitHub</p>
                <p className="text-xs text-muted-foreground">@{githubUsername}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
              Connected
            </Badge>
          </div>
        </div>
      </div>

      {/* Sync Status */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          Sync Status
        </h3>
        <div className="space-y-3">
          {/* Quick Notes */}
          <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-400" />
              <div>
                <p className="font-medium">Quick Notes</p>
                <p className="text-xs text-muted-foreground">
                  {notesStatus.itemCount > 0
                    ? `${notesStatus.itemCount} files cached`
                    : notesRepo
                    ? "Ready to browse"
                    : "No repository selected"}
                </p>
              </div>
            </div>
            <div className="text-right">
              {notesStatus.lastSync ? (
                <Badge variant="outline" className="text-xs">
                  {formatLastSync(notesStatus.lastSync)}
                </Badge>
              ) : notesRepo ? (
                <Badge variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-400">
                  Configured
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  Not configured
                </Badge>
              )}
            </div>
          </div>

          {/* Bookmarks */}
          <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
            <div className="flex items-center gap-3">
              <Bookmark className="h-5 w-5 text-amber-400" />
              <div>
                <p className="font-medium">Bookmarks</p>
                <p className="text-xs text-muted-foreground">
                  {bookmarksRepo
                    ? `Syncing to ${bookmarksRepo.split('/')[1] || bookmarksRepo}`
                    : "No repository selected"}
                </p>
              </div>
            </div>
            <div className="text-right">
              {bookmarksRepo ? (
                <Badge variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-400">
                  Configured
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  Not configured
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Repository Settings */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Repository Settings
        </h3>
        <div className="space-y-6">
          {/* Quick Notes Repo */}
          <div>
            <Label className="text-sm mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              Quick Notes Repository
            </Label>
            <RepoSelector
              value={notesRepo}
              onValueChange={handleNotesRepoChange}
              token={token}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Browse and edit files in any repository
            </p>
          </div>

          {/* Bookmarks Repo */}
          <div>
            <Label className="text-sm mb-2 flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-amber-400" />
              Bookmarks Repository
            </Label>
            <RepoSelector
              value={bookmarksRepo}
              onValueChange={handleBookmarksRepoChange}
              token={token}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Where your bookmarks.json is stored
            </p>
          </div>
        </div>
      </div>

      {/* Terminal Integration */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-400" />
            TabzChrome Terminal
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRefreshTerminal}
            disabled={refreshingTerminal}
          >
            <RefreshCw className={`h-4 w-4 ${refreshingTerminal ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Backend Status */}
          <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
            <div className="flex items-center gap-3">
              <Server className={`h-5 w-5 ${backendRunning ? "text-emerald-400" : "text-muted-foreground"}`} />
              <div>
                <p className="font-medium">Backend Server</p>
                <p className="text-xs text-muted-foreground">localhost:8129</p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={backendRunning
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-muted text-muted-foreground"
              }
            >
              {backendRunning ? "Running" : "Not Running"}
            </Badge>
          </div>

          {/* Auth Status */}
          <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
            <div className="flex items-center gap-3">
              <Key className={`h-5 w-5 ${terminalAuthenticated ? "text-emerald-400" : hasTerminalToken ? "text-amber-400" : "text-muted-foreground"}`} />
              <div>
                <p className="font-medium">API Token</p>
                <p className="text-xs text-muted-foreground">
                  {terminalAuthenticated
                    ? "Authenticated"
                    : hasTerminalToken
                    ? "Token stored (not verified)"
                    : "Not configured"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {terminalAuthenticated ? (
                <>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                    Connected
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={clearApiToken}
                    title="Remove token"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : hasTerminalToken ? (
                <>
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                    Stored
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={clearApiToken}
                    title="Remove token"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Required
                </Badge>
              )}
            </div>
          </div>

          {/* Error Message */}
          {terminalError && !terminalAvailable && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-400">{terminalError}</p>
            </div>
          )}

          {/* Token Input */}
          {!terminalAuthenticated && (
            <div className="pt-2">
              <Label className="text-sm mb-2 block">API Token</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showTerminalToken ? "text" : "password"}
                    value={terminalTokenInput}
                    onChange={(e) => {
                      setTerminalTokenInput(e.target.value)
                      setTerminalTokenError(null)
                    }}
                    placeholder="Paste your TabzChrome API token"
                    className="font-mono text-sm pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowTerminalToken(!showTerminalToken)}
                  >
                    {showTerminalToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  onClick={handleTerminalTokenSubmit}
                  disabled={!terminalTokenInput.trim()}
                >
                  Save
                </Button>
              </div>
              {terminalTokenError && (
                <p className="text-xs text-destructive mt-2">{terminalTokenError}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Get your API token from TabzChrome extension: <strong>Settings &rarr; API Token &rarr; Copy</strong>.
                Required for launching terminals from bookmarks.
              </p>
            </div>
          )}

          {/* Default Working Directory */}
          <div className="pt-2 border-t border-border/50">
            <Label className="text-sm mb-2 block">Default Working Directory</Label>
            <div className="flex gap-2">
              <Input
                value={workDirInput}
                onChange={(e) => setWorkDirInput(e.target.value)}
                placeholder="~/projects"
                className="font-mono text-sm"
              />
              <Button
                onClick={() => updateDefaultWorkDir(workDirInput)}
                disabled={workDirInput === defaultWorkDir}
                variant={workDirInput === defaultWorkDir ? "outline" : "default"}
              >
                {workDirInput === defaultWorkDir ? "Saved" : "Save"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Used when launching terminals without a specific working directory.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

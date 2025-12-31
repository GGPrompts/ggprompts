"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Book,
  GitBranch,
  GitCommit,
  GitFork,
  GitMerge,
  GitPullRequest,
  Star,
  Eye,
  Code,
  FileText,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Clock,
  Plus,
  Minus,
  Check,
  X,
  AlertCircle,
  MessageSquare,
  Users,
  Tag,
  Play,
  Circle,
  ExternalLink,
  Copy,
  Download,
  Settings,
  History,
  Activity,
  Package,
  Shield,
  Lock,
  Globe,
} from "lucide-react"
import { Card, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Progress, Separator, Avatar, AvatarFallback, AvatarImage, ScrollArea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@ggprompts/ui"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

// TypeScript Interfaces
interface User {
  id: string
  name: string
  username: string
  avatar: string
}

interface Repository {
  id: string
  name: string
  owner: string
  description: string
  language: string
  languages: { name: string; percentage: number; color: string }[]
  stars: number
  forks: number
  watchers: number
  openIssues: number
  openPRs: number
  defaultBranch: string
  visibility: "public" | "private"
  updatedAt: string
  license: string
  topics: string[]
}

interface Commit {
  hash: string
  shortHash: string
  message: string
  author: User
  date: string
  additions: number
  deletions: number
  verified: boolean
}

interface Branch {
  name: string
  isDefault: boolean
  protected: boolean
  aheadBehind: { ahead: number; behind: number }
  lastCommit: string
}

interface PullRequest {
  number: number
  title: string
  author: User
  status: "open" | "merged" | "closed"
  draft: boolean
  checks: { name: string; status: "success" | "failure" | "pending" }[]
  reviewers: User[]
  createdAt: string
  labels: { name: string; color: string }[]
  comments: number
  additions: number
  deletions: number
}

interface Issue {
  number: number
  title: string
  labels: { name: string; color: string }[]
  assignees: User[]
  status: "open" | "closed"
  createdAt: string
  comments: number
  author: User
}

interface FileNode {
  name: string
  type: "file" | "folder"
  path: string
  children?: FileNode[]
  lastCommit?: string
  lastCommitDate?: string
}

interface WorkflowRun {
  id: string
  name: string
  status: "success" | "failure" | "pending" | "cancelled"
  branch: string
  commit: string
  triggeredBy: User
  duration: string
  startedAt: string
}

interface Release {
  tag: string
  name: string
  description: string
  publishedAt: string
  author: User
  assets: { name: string; downloads: number }[]
  prerelease: boolean
}

interface Contributor {
  user: User
  commits: number
  additions: number
  deletions: number
}

// Mock Data
const mockUsers: User[] = [
  { id: "1", name: "Sarah Chen", username: "sarahchen", avatar: "" },
  { id: "2", name: "Alex Rivera", username: "arivera", avatar: "" },
  { id: "3", name: "Marcus Johnson", username: "mjohnson", avatar: "" },
  { id: "4", name: "Emily Watson", username: "ewatson", avatar: "" },
  { id: "5", name: "David Kim", username: "dkim", avatar: "" },
]

const mockRepo: Repository = {
  id: "repo-1",
  name: "quantum-ui",
  owner: "acme-labs",
  description:
    "A next-generation UI framework for building performant, accessible web applications with quantum-inspired design patterns.",
  language: "TypeScript",
  languages: [
    { name: "TypeScript", percentage: 68.4, color: "hsl(199 89% 48%)" },
    { name: "JavaScript", percentage: 18.2, color: "hsl(45 93% 47%)" },
    { name: "CSS", percentage: 8.7, color: "hsl(264 67% 60%)" },
    { name: "HTML", percentage: 3.1, color: "hsl(12 76% 61%)" },
    { name: "Shell", percentage: 1.6, color: "hsl(var(--primary))" },
  ],
  stars: 12847,
  forks: 1923,
  watchers: 342,
  openIssues: 127,
  openPRs: 34,
  defaultBranch: "main",
  visibility: "public",
  updatedAt: "2 hours ago",
  license: "MIT",
  topics: ["ui-framework", "typescript", "react", "design-system", "accessibility"],
}

const mockBranches: Branch[] = [
  { name: "main", isDefault: true, protected: true, aheadBehind: { ahead: 0, behind: 0 }, lastCommit: "2 hours ago" },
  { name: "develop", isDefault: false, protected: true, aheadBehind: { ahead: 12, behind: 0 }, lastCommit: "30 minutes ago" },
  { name: "feature/dark-mode", isDefault: false, protected: false, aheadBehind: { ahead: 5, behind: 3 }, lastCommit: "1 day ago" },
  { name: "fix/button-accessibility", isDefault: false, protected: false, aheadBehind: { ahead: 2, behind: 8 }, lastCommit: "3 hours ago" },
  { name: "release/v2.0", isDefault: false, protected: true, aheadBehind: { ahead: 0, behind: 45 }, lastCommit: "1 week ago" },
]

const mockCommits: Commit[] = [
  {
    hash: "a1b2c3d4e5f6789012345678901234567890abcd",
    shortHash: "a1b2c3d",
    message: "feat(components): add quantum ripple effect to buttons",
    author: mockUsers[0],
    date: "2 hours ago",
    additions: 127,
    deletions: 23,
    verified: true,
  },
  {
    hash: "b2c3d4e5f67890123456789012345678901abcde",
    shortHash: "b2c3d4e",
    message: "fix(a11y): improve keyboard navigation in dropdown menu",
    author: mockUsers[1],
    date: "5 hours ago",
    additions: 45,
    deletions: 12,
    verified: true,
  },
  {
    hash: "c3d4e5f6789012345678901234567890abcdef12",
    shortHash: "c3d4e5f",
    message: "docs: update API reference for v2.0 migration",
    author: mockUsers[2],
    date: "8 hours ago",
    additions: 234,
    deletions: 89,
    verified: false,
  },
  {
    hash: "d4e5f67890123456789012345678901abcdef123",
    shortHash: "d4e5f67",
    message: "refactor: optimize bundle size by tree-shaking unused icons",
    author: mockUsers[0],
    date: "1 day ago",
    additions: 12,
    deletions: 156,
    verified: true,
  },
  {
    hash: "e5f678901234567890123456789012abcdef1234",
    shortHash: "e5f6789",
    message: "test: add unit tests for form validation hooks",
    author: mockUsers[3],
    date: "1 day ago",
    additions: 312,
    deletions: 0,
    verified: true,
  },
  {
    hash: "f6789012345678901234567890123abcdef12345",
    shortHash: "f678901",
    message: "chore(deps): bump framer-motion from 10.16.4 to 10.16.5",
    author: mockUsers[4],
    date: "2 days ago",
    additions: 34,
    deletions: 34,
    verified: true,
  },
]

const mockPullRequests: PullRequest[] = [
  {
    number: 892,
    title: "feat: implement dark mode support with system preference detection",
    author: mockUsers[0],
    status: "open",
    draft: false,
    checks: [
      { name: "build", status: "success" },
      { name: "test", status: "success" },
      { name: "lint", status: "success" },
    ],
    reviewers: [mockUsers[1], mockUsers[2]],
    createdAt: "3 hours ago",
    labels: [
      { name: "enhancement", color: "hsl(var(--primary))" },
      { name: "accessibility", color: "hsl(264 67% 60%)" },
    ],
    comments: 8,
    additions: 423,
    deletions: 67,
  },
  {
    number: 891,
    title: "fix: resolve memory leak in useInfiniteScroll hook",
    author: mockUsers[1],
    status: "open",
    draft: false,
    checks: [
      { name: "build", status: "success" },
      { name: "test", status: "pending" },
      { name: "lint", status: "success" },
    ],
    reviewers: [mockUsers[0]],
    createdAt: "1 day ago",
    labels: [{ name: "bug", color: "hsl(0 72% 51%)" }],
    comments: 12,
    additions: 34,
    deletions: 89,
  },
  {
    number: 890,
    title: "[WIP] refactor: migrate to new animation system",
    author: mockUsers[2],
    status: "open",
    draft: true,
    checks: [
      { name: "build", status: "failure" },
      { name: "test", status: "failure" },
      { name: "lint", status: "success" },
    ],
    reviewers: [],
    createdAt: "2 days ago",
    labels: [
      { name: "refactor", color: "hsl(199 89% 48%)" },
      { name: "work-in-progress", color: "hsl(45 93% 47%)" },
    ],
    comments: 3,
    additions: 1247,
    deletions: 892,
  },
  {
    number: 885,
    title: "docs: add comprehensive theming guide",
    author: mockUsers[3],
    status: "merged",
    draft: false,
    checks: [
      { name: "build", status: "success" },
      { name: "test", status: "success" },
      { name: "lint", status: "success" },
    ],
    reviewers: [mockUsers[0], mockUsers[4]],
    createdAt: "1 week ago",
    labels: [{ name: "documentation", color: "hsl(var(--secondary))" }],
    comments: 5,
    additions: 567,
    deletions: 23,
  },
]

const mockIssues: Issue[] = [
  {
    number: 456,
    title: "Button component doesn't respect disabled state styling",
    labels: [
      { name: "bug", color: "hsl(0 72% 51%)" },
      { name: "good first issue", color: "hsl(var(--primary))" },
    ],
    assignees: [mockUsers[1]],
    status: "open",
    createdAt: "2 days ago",
    comments: 4,
    author: mockUsers[3],
  },
  {
    number: 455,
    title: "Add RTL (Right-to-Left) support for all components",
    labels: [
      { name: "enhancement", color: "hsl(var(--primary))" },
      { name: "accessibility", color: "hsl(264 67% 60%)" },
    ],
    assignees: [],
    status: "open",
    createdAt: "3 days ago",
    comments: 15,
    author: mockUsers[0],
  },
  {
    number: 454,
    title: "Modal component causes body scroll on iOS Safari",
    labels: [
      { name: "bug", color: "hsl(0 72% 51%)" },
      { name: "mobile", color: "hsl(199 89% 48%)" },
    ],
    assignees: [mockUsers[0], mockUsers[2]],
    status: "open",
    createdAt: "4 days ago",
    comments: 8,
    author: mockUsers[4],
  },
  {
    number: 450,
    title: "TypeScript types are not exported correctly",
    labels: [{ name: "bug", color: "hsl(0 72% 51%)" }],
    assignees: [mockUsers[4]],
    status: "closed",
    createdAt: "1 week ago",
    comments: 6,
    author: mockUsers[1],
  },
]

const mockFileTree: FileNode[] = [
  {
    name: "src",
    type: "folder",
    path: "src",
    children: [
      {
        name: "components",
        type: "folder",
        path: "src/components",
        children: [
          { name: "Button.tsx", type: "file", path: "src/components/Button.tsx", lastCommit: "feat: add quantum ripple", lastCommitDate: "2 hours ago" },
          { name: "Modal.tsx", type: "file", path: "src/components/Modal.tsx", lastCommit: "fix: iOS scroll issue", lastCommitDate: "4 days ago" },
          { name: "Input.tsx", type: "file", path: "src/components/Input.tsx", lastCommit: "refactor: consolidate styles", lastCommitDate: "1 week ago" },
          { name: "index.ts", type: "file", path: "src/components/index.ts", lastCommit: "chore: update exports", lastCommitDate: "2 days ago" },
        ],
      },
      {
        name: "hooks",
        type: "folder",
        path: "src/hooks",
        children: [
          { name: "useTheme.ts", type: "file", path: "src/hooks/useTheme.ts", lastCommit: "feat: dark mode detection", lastCommitDate: "3 hours ago" },
          { name: "useInfiniteScroll.ts", type: "file", path: "src/hooks/useInfiniteScroll.ts", lastCommit: "fix: memory leak", lastCommitDate: "1 day ago" },
        ],
      },
      { name: "index.ts", type: "file", path: "src/index.ts", lastCommit: "chore: update exports", lastCommitDate: "2 days ago" },
    ],
  },
  {
    name: "docs",
    type: "folder",
    path: "docs",
    children: [
      { name: "getting-started.md", type: "file", path: "docs/getting-started.md", lastCommit: "docs: update quickstart", lastCommitDate: "1 week ago" },
      { name: "theming.md", type: "file", path: "docs/theming.md", lastCommit: "docs: add theming guide", lastCommitDate: "1 week ago" },
    ],
  },
  { name: "package.json", type: "file", path: "package.json", lastCommit: "chore(deps): bump framer-motion", lastCommitDate: "2 days ago" },
  { name: "README.md", type: "file", path: "README.md", lastCommit: "docs: update badges", lastCommitDate: "3 days ago" },
  { name: "tsconfig.json", type: "file", path: "tsconfig.json", lastCommit: "chore: strict mode", lastCommitDate: "2 weeks ago" },
  { name: ".gitignore", type: "file", path: ".gitignore", lastCommit: "chore: ignore .env", lastCommitDate: "1 month ago" },
]

const mockWorkflows: WorkflowRun[] = [
  {
    id: "run-1",
    name: "CI",
    status: "success",
    branch: "main",
    commit: "a1b2c3d",
    triggeredBy: mockUsers[0],
    duration: "2m 34s",
    startedAt: "2 hours ago",
  },
  {
    id: "run-2",
    name: "CI",
    status: "pending",
    branch: "fix/button-accessibility",
    commit: "b2c3d4e",
    triggeredBy: mockUsers[1],
    duration: "Running...",
    startedAt: "5 minutes ago",
  },
  {
    id: "run-3",
    name: "Deploy Preview",
    status: "success",
    branch: "feature/dark-mode",
    commit: "c3d4e5f",
    triggeredBy: mockUsers[0],
    duration: "4m 12s",
    startedAt: "1 day ago",
  },
  {
    id: "run-4",
    name: "CI",
    status: "failure",
    branch: "refactor/animation-system",
    commit: "d4e5f67",
    triggeredBy: mockUsers[2],
    duration: "1m 45s",
    startedAt: "2 days ago",
  },
  {
    id: "run-5",
    name: "Release",
    status: "success",
    branch: "main",
    commit: "e5f6789",
    triggeredBy: mockUsers[0],
    duration: "8m 23s",
    startedAt: "1 week ago",
  },
]

const mockReleases: Release[] = [
  {
    tag: "v2.0.0-beta.3",
    name: "v2.0.0 Beta 3",
    description: "Third beta release with dark mode support and improved accessibility.",
    publishedAt: "3 days ago",
    author: mockUsers[0],
    assets: [
      { name: "quantum-ui-2.0.0-beta.3.tgz", downloads: 1247 },
      { name: "quantum-ui-2.0.0-beta.3.zip", downloads: 342 },
    ],
    prerelease: true,
  },
  {
    tag: "v1.9.2",
    name: "v1.9.2 - Patch Release",
    description: "Bug fixes for modal scroll issues and TypeScript export errors.",
    publishedAt: "1 week ago",
    author: mockUsers[0],
    assets: [
      { name: "quantum-ui-1.9.2.tgz", downloads: 8923 },
      { name: "quantum-ui-1.9.2.zip", downloads: 1456 },
    ],
    prerelease: false,
  },
  {
    tag: "v1.9.1",
    name: "v1.9.1",
    description: "Minor fixes and performance improvements.",
    publishedAt: "3 weeks ago",
    author: mockUsers[3],
    assets: [
      { name: "quantum-ui-1.9.1.tgz", downloads: 12456 },
      { name: "quantum-ui-1.9.1.zip", downloads: 2134 },
    ],
    prerelease: false,
  },
]

const mockContributors: Contributor[] = [
  { user: mockUsers[0], commits: 487, additions: 45678, deletions: 12345 },
  { user: mockUsers[1], commits: 234, additions: 23456, deletions: 8901 },
  { user: mockUsers[2], commits: 189, additions: 18234, deletions: 5678 },
  { user: mockUsers[3], commits: 156, additions: 12890, deletions: 4532 },
  { user: mockUsers[4], commits: 98, additions: 8765, deletions: 2345 },
]

const contributionData = [
  { week: "W1", commits: 45 },
  { week: "W2", commits: 62 },
  { week: "W3", commits: 38 },
  { week: "W4", commits: 78 },
  { week: "W5", commits: 52 },
  { week: "W6", commits: 89 },
  { week: "W7", commits: 67 },
  { week: "W8", commits: 94 },
  { week: "W9", commits: 71 },
  { week: "W10", commits: 56 },
  { week: "W11", commits: 83 },
  { week: "W12", commits: 102 },
]

// File Tree Component
function FileTreeNode({ node, level = 0 }: { node: FileNode; level?: number }) {
  const [isOpen, setIsOpen] = useState(level < 1)

  if (node.type === "folder") {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 w-full py-1.5 px-2 hover:bg-primary/5 rounded text-left group">
          <span style={{ paddingLeft: `${level * 16}px` }} className="flex items-center gap-2 flex-1">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {isOpen ? (
              <FolderOpen className="h-4 w-4 text-secondary" />
            ) : (
              <Folder className="h-4 w-4 text-secondary" />
            )}
            <span className="text-foreground text-sm">{node.name}</span>
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {node.children?.map((child) => (
            <FileTreeNode key={child.path} node={child} level={level + 1} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <div
      className="flex items-center gap-2 py-1.5 px-2 hover:bg-primary/5 rounded cursor-pointer group"
      style={{ paddingLeft: `${level * 16 + 24}px` }}
    >
      <FileText className="h-4 w-4 text-muted-foreground" />
      <span className="text-foreground text-sm flex-1">{node.name}</span>
      <span className="text-muted-foreground text-xs hidden group-hover:block truncate max-w-[200px]">
        {node.lastCommit}
      </span>
      <span className="text-muted-foreground text-xs">{node.lastCommitDate}</span>
    </div>
  )
}

export default function GitDashboard() {
  const [selectedBranch, setSelectedBranch] = useState(mockRepo.defaultBranch)
  const [issueFilter, setIssueFilter] = useState<"open" | "closed" | "all">("open")

  const getStatusIcon = (status: "success" | "failure" | "pending" | "cancelled") => {
    switch (status) {
      case "success":
        return <Check className="h-4 w-4 text-primary" />
      case "failure":
        return <X className="h-4 w-4 text-red-400" />
      case "pending":
        return <Circle className="h-4 w-4 text-amber-400 animate-pulse" />
      case "cancelled":
        return <X className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPRStatusBadge = (pr: PullRequest) => {
    if (pr.draft) {
      return (
        <Badge className="bg-muted text-muted-foreground border-border">
          Draft
        </Badge>
      )
    }
    switch (pr.status) {
      case "open":
        return (
          <Badge className="bg-primary/20 text-primary border-primary/30">
            Open
          </Badge>
        )
      case "merged":
        return (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            Merged
          </Badge>
        )
      case "closed":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Closed
          </Badge>
        )
    }
  }

  const filteredIssues = mockIssues.filter((issue) => {
    if (issueFilter === "all") return true
    return issue.status === issueFilter
  })

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Repository Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass border-primary/30 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Book className="h-6 w-6 text-primary" />
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-lg">{mockRepo.owner}</span>
                    <span className="text-muted-foreground">/</span>
                    <h1 className="text-2xl md:text-3xl font-mono font-bold text-primary terminal-glow">
                      {mockRepo.name}
                    </h1>
                  </div>
                  <Badge className="bg-muted text-muted-foreground border-border">
                    {mockRepo.visibility === "public" ? (
                      <Globe className="h-3 w-3 mr-1" />
                    ) : (
                      <Lock className="h-3 w-3 mr-1" />
                    )}
                    {mockRepo.visibility}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4 max-w-3xl">
                  {mockRepo.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {mockRepo.topics.map((topic) => (
                    <Badge
                      key={topic}
                      className="bg-secondary/20 text-secondary border-secondary/30 text-xs"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="sm" className="border-primary/30 text-foreground hover:bg-primary/10">
                  <Eye className="h-4 w-4 mr-2" />
                  Watch
                  <Badge className="ml-2 bg-background text-foreground border-border text-xs">
                    {mockRepo.watchers}
                  </Badge>
                </Button>
                <Button variant="outline" size="sm" className="border-primary/30 text-foreground hover:bg-primary/10">
                  <GitFork className="h-4 w-4 mr-2" />
                  Fork
                  <Badge className="ml-2 bg-background text-foreground border-border text-xs">
                    {mockRepo.forks.toLocaleString()}
                  </Badge>
                </Button>
                <Button variant="outline" size="sm" className="border-primary/30 text-foreground hover:bg-primary/10">
                  <Star className="h-4 w-4 mr-2" />
                  Star
                  <Badge className="ml-2 bg-background text-foreground border-border text-xs">
                    {mockRepo.stars.toLocaleString()}
                  </Badge>
                </Button>
              </div>
            </div>

            <Separator className="my-4 bg-border/50" />

            {/* Repo Stats Row */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{mockBranches.length}</span>
                <span className="text-muted-foreground">branches</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{mockReleases.length}</span>
                <span className="text-muted-foreground">releases</span>
              </div>
              <div className="flex items-center gap-2">
                <GitCommit className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium">1,247</span>
                <span className="text-muted-foreground">commits</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{mockContributors.length}</span>
                <span className="text-muted-foreground">contributors</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{mockRepo.license} license</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Updated {mockRepo.updatedAt}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="code" className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="glass border-primary/30 w-max md:w-auto">
                <TabsTrigger value="code" className="text-xs sm:text-sm whitespace-nowrap">
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="issues" className="text-xs sm:text-sm whitespace-nowrap">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Issues
                  <Badge className="ml-2 bg-muted text-muted-foreground text-xs">
                    {mockRepo.openIssues}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pulls" className="text-xs sm:text-sm whitespace-nowrap">
                  <GitPullRequest className="h-4 w-4 mr-2" />
                  Pull Requests
                  <Badge className="ml-2 bg-muted text-muted-foreground text-xs">
                    {mockRepo.openPRs}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="actions" className="text-xs sm:text-sm whitespace-nowrap">
                  <Play className="h-4 w-4 mr-2" />
                  Actions
                </TabsTrigger>
                <TabsTrigger value="insights" className="text-xs sm:text-sm whitespace-nowrap">
                  <Activity className="h-4 w-4 mr-2" />
                  Insights
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Code Tab */}
            <TabsContent value="code" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* File Browser */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Branch Selector & Actions */}
                  <Card className="glass border-primary/30 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                          <SelectTrigger className="w-[180px] bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-border">
                            {mockBranches.map((branch) => (
                              <SelectItem key={branch.name} value={branch.name}>
                                <div className="flex items-center gap-2">
                                  {branch.name}
                                  {branch.isDefault && (
                                    <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
                                      default
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2 sm:ml-auto">
                        <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-primary/10">
                          <GitBranch className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Branches</span>
                        </Button>
                        <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-primary/10">
                          <Tag className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Tags</span>
                        </Button>
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                          <Download className="h-4 w-4 mr-2" />
                          Code
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* File Tree */}
                  <Card className="glass border-primary/30">
                    <div className="p-4 border-b border-border/50">
                      <div className="flex items-center gap-2 text-sm">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs bg-primary/20 text-primary">
                            {mockCommits[0].author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground font-medium">
                          {mockCommits[0].author.username}
                        </span>
                        <span className="text-muted-foreground truncate flex-1">
                          {mockCommits[0].message}
                        </span>
                        <span className="text-muted-foreground font-mono text-xs">
                          {mockCommits[0].shortHash}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {mockCommits[0].date}
                        </span>
                      </div>
                    </div>
                    <ScrollArea className="h-[400px]">
                      <div className="p-2">
                        {mockFileTree.map((node) => (
                          <FileTreeNode key={node.path} node={node} />
                        ))}
                      </div>
                    </ScrollArea>
                  </Card>

                  {/* README Preview */}
                  <Card className="glass border-secondary/30 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Book className="h-5 w-5 text-secondary" />
                      <h3 className="text-lg font-semibold text-secondary">README.md</h3>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <h1 className="text-2xl font-bold text-foreground mb-4">
                        Quantum UI
                      </h1>
                      <p className="text-muted-foreground mb-4">
                        A next-generation UI framework for building performant, accessible web
                        applications with quantum-inspired design patterns.
                      </p>
                      <h2 className="text-lg font-semibold text-foreground mb-3">
                        Installation
                      </h2>
                      <div className="glass-dark rounded-lg p-4 font-mono text-sm mb-4">
                        <code className="text-primary">npm install @acme/quantum-ui</code>
                      </div>
                      <h2 className="text-lg font-semibold text-foreground mb-3">
                        Quick Start
                      </h2>
                      <div className="glass-dark rounded-lg p-4 font-mono text-sm text-muted-foreground">
                        <pre>{`import { Button, Modal } from '@acme/quantum-ui'

function App() {
  return (
    <Button variant="quantum">
      Click me
    </Button>
  )
}`}</pre>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* About */}
                  <Card className="glass border-primary/30 p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-3">About</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {mockRepo.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ExternalLink className="h-4 w-4" />
                      <a href="#" className="text-primary hover:underline">
                        quantum-ui.acme.dev
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {mockRepo.topics.map((topic) => (
                        <Badge
                          key={topic}
                          className="bg-secondary/20 text-secondary border-secondary/30 text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </Card>

                  {/* Releases */}
                  <Card className="glass border-primary/30 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground">Releases</h3>
                      <Badge className="bg-muted text-muted-foreground text-xs">
                        {mockReleases.length}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {mockReleases.slice(0, 2).map((release) => (
                        <div key={release.tag} className="flex items-start gap-3">
                          <Tag className="h-4 w-4 text-primary mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-foreground font-mono text-sm">
                                {release.tag}
                              </span>
                              {release.prerelease && (
                                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                                  Pre-release
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-xs">
                              {release.publishedAt}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Contributors */}
                  <Card className="glass border-primary/30 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground">Contributors</h3>
                      <Badge className="bg-muted text-muted-foreground text-xs">
                        {mockContributors.length}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mockContributors.map((contributor) => (
                        <Avatar
                          key={contributor.user.id}
                          className="h-8 w-8 border-2 border-background"
                        >
                          <AvatarFallback className="text-xs bg-primary/20 text-primary">
                            {contributor.user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </Card>

                  {/* Languages */}
                  <Card className="glass border-primary/30 p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Languages</h3>
                    <div className="flex h-2 rounded-full overflow-hidden mb-4">
                      {mockRepo.languages.map((lang) => (
                        <div
                          key={lang.name}
                          className="h-full"
                          style={{
                            width: `${lang.percentage}%`,
                            backgroundColor: lang.color,
                          }}
                        />
                      ))}
                    </div>
                    <div className="space-y-2">
                      {mockRepo.languages.map((lang) => (
                        <div key={lang.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: lang.color }}
                            />
                            <span className="text-foreground">{lang.name}</span>
                          </div>
                          <span className="text-muted-foreground font-mono">
                            {lang.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Commit History */}
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Recent Commits
                  </h3>
                  <Button variant="outline" size="sm" className="border-border text-foreground">
                    View all commits
                  </Button>
                </div>
                <div className="space-y-3">
                  {mockCommits.map((commit, idx) => (
                    <motion.div
                      key={commit.hash}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="glass-dark border-border/30 rounded-lg p-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="text-xs bg-primary/20 text-primary">
                              {commit.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground font-medium text-sm truncate">
                              {commit.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>{commit.author.username}</span>
                              <span>committed</span>
                              <span>{commit.date}</span>
                              {commit.verified && (
                                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                                  <Check className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-primary font-mono">
                              +{commit.additions}
                            </span>
                            <span className="text-red-400 font-mono">
                              -{commit.deletions}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-secondary font-mono text-sm bg-background px-2 py-1 rounded">
                              {commit.shortHash}
                            </code>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Issues Tab */}
            <TabsContent value="issues" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <Button
                      variant={issueFilter === "open" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIssueFilter("open")}
                      className={issueFilter === "open" ? "bg-primary text-primary-foreground" : "border-border"}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {mockIssues.filter((i) => i.status === "open").length} Open
                    </Button>
                    <Button
                      variant={issueFilter === "closed" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIssueFilter("closed")}
                      className={issueFilter === "closed" ? "bg-primary text-primary-foreground" : "border-border"}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {mockIssues.filter((i) => i.status === "closed").length} Closed
                    </Button>
                  </div>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    New Issue
                  </Button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredIssues.map((issue, idx) => (
                      <motion.div
                        key={issue.number}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className="glass-dark border-border/30 rounded-lg p-4 hover:border-primary/30 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          {issue.status === "open" ? (
                            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          ) : (
                            <Check className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-foreground font-medium hover:text-primary cursor-pointer">
                                {issue.title}
                              </span>
                              {issue.labels.map((label) => (
                                <Badge
                                  key={label.name}
                                  className="text-xs"
                                  style={{
                                    backgroundColor: `${label.color}20`,
                                    color: label.color,
                                    borderColor: `${label.color}50`,
                                  }}
                                >
                                  {label.name}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>#{issue.number}</span>
                              <span>opened {issue.createdAt} by {issue.author.username}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {issue.assignees.length > 0 && (
                              <div className="flex -space-x-2">
                                {issue.assignees.map((assignee) => (
                                  <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
                                    <AvatarFallback className="text-xs bg-primary/20 text-primary">
                                      {assignee.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                            )}
                            {issue.comments > 0 && (
                              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                <MessageSquare className="h-4 w-4" />
                                {issue.comments}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Card>
            </TabsContent>

            {/* Pull Requests Tab */}
            <TabsContent value="pulls" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <Button variant="default" size="sm" className="bg-primary text-primary-foreground">
                      <GitPullRequest className="h-4 w-4 mr-2" />
                      {mockPullRequests.filter((pr) => pr.status === "open").length} Open
                    </Button>
                    <Button variant="outline" size="sm" className="border-border">
                      <GitMerge className="h-4 w-4 mr-2" />
                      {mockPullRequests.filter((pr) => pr.status === "merged").length} Merged
                    </Button>
                  </div>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    New Pull Request
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockPullRequests.map((pr, idx) => (
                    <motion.div
                      key={pr.number}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="glass-dark border-border/30 rounded-lg p-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {pr.status === "open" ? (
                            <GitPullRequest className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          ) : pr.status === "merged" ? (
                            <GitMerge className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-foreground font-medium hover:text-primary cursor-pointer">
                                {pr.title}
                              </span>
                              {getPRStatusBadge(pr)}
                              {pr.labels.map((label) => (
                                <Badge
                                  key={label.name}
                                  className="text-xs"
                                  style={{
                                    backgroundColor: `${label.color}20`,
                                    color: label.color,
                                    borderColor: `${label.color}50`,
                                  }}
                                >
                                  {label.name}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span>#{pr.number}</span>
                              <span>opened {pr.createdAt} by {pr.author.username}</span>
                              <div className="flex items-center gap-1">
                                <Plus className="h-3 w-3 text-primary" />
                                <span className="text-primary">{pr.additions}</span>
                                <Minus className="h-3 w-3 text-red-400 ml-1" />
                                <span className="text-red-400">{pr.deletions}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 md:flex-shrink-0">
                          {/* Status Checks */}
                          <div className="flex items-center gap-1">
                            {pr.checks.map((check, i) => (
                              <div key={i} title={`${check.name}: ${check.status}`}>
                                {getStatusIcon(check.status)}
                              </div>
                            ))}
                          </div>

                          {/* Reviewers */}
                          {pr.reviewers.length > 0 && (
                            <div className="flex -space-x-2">
                              {pr.reviewers.map((reviewer) => (
                                <Avatar key={reviewer.id} className="h-6 w-6 border-2 border-background">
                                  <AvatarFallback className="text-xs bg-secondary/20 text-secondary">
                                    {reviewer.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          )}

                          {pr.comments > 0 && (
                            <div className="flex items-center gap-1 text-muted-foreground text-sm">
                              <MessageSquare className="h-4 w-4" />
                              {pr.comments}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Actions Tab */}
            <TabsContent value="actions" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Workflow Runs
                  </h3>
                  <Button variant="outline" size="sm" className="border-border">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Workflows
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockWorkflows.map((workflow, idx) => (
                    <motion.div
                      key={workflow.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="glass-dark border-border/30 rounded-lg p-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background">
                            {getStatusIcon(workflow.status)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-foreground font-medium">
                                {workflow.name}
                              </span>
                              <Badge className="bg-muted text-muted-foreground text-xs font-mono">
                                {workflow.branch}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{workflow.commit}</span>
                              <span>triggered by {workflow.triggeredBy.username}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {workflow.duration}
                          </div>
                          <span>{workflow.startedAt}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Contribution Graph */}
                <Card className="glass border-primary/30 p-6">
                  <h3 className="text-lg font-semibold text-primary mb-6">
                    Contribution Activity
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={contributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                      <XAxis
                        dataKey="week"
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="commits"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary) / 0.2)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>

                {/* Language Breakdown */}
                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-6">
                    Language Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={mockRepo.languages}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="percentage"
                        nameKey="name"
                      >
                        {mockRepo.languages.map((lang, index) => (
                          <Cell key={`cell-${index}`} fill={lang.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        formatter={(value: number) => [`${value}%`, "Percentage"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {mockRepo.languages.slice(0, 4).map((lang) => (
                      <div key={lang.name} className="flex items-center gap-2 text-sm">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: lang.color }}
                        />
                        <span className="text-muted-foreground">{lang.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Top Contributors */}
                <Card className="glass border-primary/30 p-6 md:col-span-2">
                  <h3 className="text-lg font-semibold text-primary mb-6">
                    Top Contributors
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {mockContributors.map((contributor, idx) => (
                      <motion.div
                        key={contributor.user.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="glass-dark border-border/30 rounded-lg p-4 text-center"
                      >
                        <Avatar className="h-12 w-12 mx-auto mb-3">
                          <AvatarFallback className="text-lg bg-primary/20 text-primary">
                            {contributor.user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-foreground font-medium text-sm">
                          {contributor.user.name}
                        </p>
                        <p className="text-muted-foreground text-xs mb-2">
                          @{contributor.user.username}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <span className="text-primary font-mono">{contributor.commits}</span>
                          <span className="text-muted-foreground">commits</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs mt-1">
                          <span className="text-primary">+{contributor.additions.toLocaleString()}</span>
                          <span className="text-red-400">-{contributor.deletions.toLocaleString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Releases */}
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Release History
                  </h3>
                  <Button variant="outline" size="sm" className="border-border">
                    Draft New Release
                  </Button>
                </div>

                <div className="space-y-4">
                  {mockReleases.map((release, idx) => (
                    <motion.div
                      key={release.tag}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="glass-dark border-border/30 rounded-lg p-5"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Tag className="h-5 w-5 text-primary" />
                            <span className="text-foreground font-mono font-bold text-lg">
                              {release.tag}
                            </span>
                            {release.prerelease && (
                              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                                Pre-release
                              </Badge>
                            )}
                          </div>
                          <h4 className="text-foreground font-medium mb-2">{release.name}</h4>
                          <p className="text-muted-foreground text-sm mb-3">
                            {release.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-xs bg-primary/20 text-primary">
                                  {release.author.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span>{release.author.username}</span>
                            </div>
                            <span>released {release.publishedAt}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {release.assets.map((asset) => (
                            <div
                              key={asset.name}
                              className="flex items-center gap-3 text-sm"
                            >
                              <Button variant="outline" size="sm" className="border-border h-8">
                                <Download className="h-3.5 w-3.5 mr-2" />
                                <span className="font-mono text-xs">{asset.name}</span>
                              </Button>
                              <span className="text-muted-foreground text-xs">
                                {asset.downloads.toLocaleString()} downloads
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

"use client"

import React, { useState, useMemo } from "react"
import { motion, Reorder, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Target,
  TrendingUp,
  Users,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  Play,
  Square,
  Settings,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronUp,
  User,
  Timer,
  Link2,
  Flag,
  Zap,
  BarChart3,
  TrendingDown,
  Award,
  AlertTriangle,
} from "lucide-react"
import { Card, Button, Badge, Progress, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from "@ggprompts/ui"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface TeamMember {
  id: string
  name: string
  avatar: string
  capacity: number // hours per sprint
  allocated: number // hours already allocated
  availability: number // percentage (accounting for PTO, meetings, etc.)
}

interface Story {
  id: string
  title: string
  userStory: {
    asA: string
    iWant: string
    soThat: string
  }
  storyPoints: number
  acceptanceCriteria: string[]
  technicalNotes: string[]
  status: "backlog" | "sprint-backlog" | "in-progress" | "code-review" | "testing" | "done"
  assignee: TeamMember | null
  labels: string[]
  priority: "low" | "medium" | "high" | "critical"
  estimatedHours: number
  actualHours: number
  dependencies: string[]
  linkedIssues: string[]
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
}

interface SprintData {
  name: string
  number: number
  startDate: Date
  endDate: Date
  goals: string[]
  committed: number
  completed: number
  velocity: number
}

interface BurndownPoint {
  day: number
  date: Date
  ideal: number
  actual: number
  scopeChange: number
}

interface VelocityData {
  sprint: string
  committed: number
  completed: number
}

// ============================================================================
// MOCK DATA
// ============================================================================

const TEAM_MEMBERS: TeamMember[] = [
  { id: "1", name: "Sarah Chen", avatar: "SC", capacity: 80, allocated: 65, availability: 100 },
  { id: "2", name: "Mike Johnson", avatar: "MJ", capacity: 80, allocated: 72, availability: 100 },
  { id: "3", name: "Emily Davis", avatar: "ED", capacity: 80, allocated: 55, availability: 100 },
  { id: "4", name: "Alex Kumar", avatar: "AK", capacity: 80, allocated: 68, availability: 90 },
  { id: "5", name: "Jessica Lee", avatar: "JL", capacity: 80, allocated: 48, availability: 80 },
  { id: "6", name: "David Park", avatar: "DP", capacity: 80, allocated: 70, availability: 100 },
  { id: "7", name: "Maria Garcia", avatar: "MG", capacity: 80, allocated: 58, availability: 100 },
]

const CURRENT_SPRINT: SprintData = {
  name: "Sprint 23 - Q1 Features",
  number: 23,
  startDate: new Date(2025, 0, 13),
  endDate: new Date(2025, 0, 26),
  goals: [
    "Complete user authentication refactor",
    "Implement real-time notifications",
    "Launch dark mode feature",
  ],
  committed: 45,
  completed: 28,
  velocity: 42,
}

const VELOCITY_HISTORY: VelocityData[] = [
  { sprint: "Sprint 18", committed: 38, completed: 35 },
  { sprint: "Sprint 19", committed: 40, completed: 38 },
  { sprint: "Sprint 20", committed: 42, completed: 40 },
  { sprint: "Sprint 21", committed: 43, completed: 41 },
  { sprint: "Sprint 22", committed: 44, completed: 42 },
  { sprint: "Sprint 23", committed: 45, completed: 28 }, // Current sprint (in progress)
]

// Burndown data for 14-day sprint (Day 8 of 14)
const BURNDOWN_DATA: BurndownPoint[] = [
  { day: 0, date: new Date(2025, 0, 13), ideal: 45, actual: 45, scopeChange: 0 },
  { day: 1, date: new Date(2025, 0, 14), ideal: 41.8, actual: 44, scopeChange: 0 },
  { day: 2, date: new Date(2025, 0, 15), ideal: 38.6, actual: 42, scopeChange: 0 },
  { day: 3, date: new Date(2025, 0, 16), ideal: 35.4, actual: 39, scopeChange: 2 }, // Scope added
  { day: 4, date: new Date(2025, 0, 17), ideal: 32.1, actual: 36, scopeChange: 0 },
  { day: 5, date: new Date(2025, 0, 18), ideal: 28.9, actual: 33, scopeChange: 0 },
  { day: 6, date: new Date(2025, 0, 19), ideal: 25.7, actual: 30, scopeChange: 0 },
  { day: 7, date: new Date(2025, 0, 20), ideal: 22.5, actual: 28, scopeChange: 0 },
  { day: 8, date: new Date(2025, 0, 21), ideal: 19.3, actual: 17, scopeChange: 0 }, // Current day - ahead!
]

const MOCK_STORIES: Story[] = [
  // BACKLOG (5 stories)
  {
    id: "story-1",
    title: "Implement GraphQL API endpoints",
    userStory: {
      asA: "backend developer",
      iWant: "GraphQL endpoints for user queries",
      soThat: "frontend can fetch data more efficiently",
    },
    storyPoints: 8,
    acceptanceCriteria: [
      "User query resolver implemented",
      "Authentication middleware integrated",
      "Query performance under 100ms",
      "Schema documented in GraphQL playground",
    ],
    technicalNotes: [
      "Use Apollo Server v4",
      "Implement DataLoader for N+1 prevention",
      "Add Redis caching layer",
    ],
    status: "backlog",
    assignee: null,
    labels: ["backend", "api", "performance"],
    priority: "high",
    estimatedHours: 24,
    actualHours: 0,
    dependencies: [],
    linkedIssues: ["TASK-456"],
    createdAt: new Date(2025, 0, 5),
  },
  {
    id: "story-2",
    title: "Design mobile navigation component",
    userStory: {
      asA: "mobile user",
      iWant: "an intuitive navigation drawer",
      soThat: "I can easily access all app sections",
    },
    storyPoints: 5,
    acceptanceCriteria: [
      "Swipe gesture support",
      "Smooth animations (60fps)",
      "Accessibility compliant",
      "Dark mode support",
    ],
    technicalNotes: [
      "Use Framer Motion for animations",
      "Test on iOS and Android",
      "Ensure backdrop blur works on mobile",
    ],
    status: "backlog",
    assignee: null,
    labels: ["frontend", "mobile", "ux"],
    priority: "medium",
    estimatedHours: 16,
    actualHours: 0,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 6),
  },
  {
    id: "story-3",
    title: "Optimize database query performance",
    userStory: {
      asA: "database administrator",
      iWant: "optimized queries for reports",
      soThat: "dashboard loads in under 2 seconds",
    },
    storyPoints: 8,
    acceptanceCriteria: [
      "Add composite indexes on frequently queried columns",
      "Reduce query time by 60%",
      "Document query optimization strategies",
      "Set up query monitoring",
    ],
    technicalNotes: [
      "Analyze slow query log",
      "Consider query result caching",
      "Review ORM-generated queries",
    ],
    status: "backlog",
    assignee: null,
    labels: ["database", "performance", "backend"],
    priority: "high",
    estimatedHours: 20,
    actualHours: 0,
    dependencies: [],
    linkedIssues: ["BUG-789"],
    createdAt: new Date(2025, 0, 7),
  },
  {
    id: "story-4",
    title: "Add export to CSV functionality",
    userStory: {
      asA: "data analyst",
      iWant: "to export reports as CSV",
      soThat: "I can analyze data in Excel",
    },
    storyPoints: 3,
    acceptanceCriteria: [
      "Export button in reports section",
      "Handle large datasets (10k+ rows)",
      "Include filters in export",
      "Show download progress",
    ],
    technicalNotes: [
      "Use papaparse library",
      "Stream large files",
      "Add server-side export endpoint",
    ],
    status: "backlog",
    assignee: null,
    labels: ["feature", "data", "frontend"],
    priority: "low",
    estimatedHours: 12,
    actualHours: 0,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 8),
  },
  {
    id: "story-5",
    title: "Implement rate limiting middleware",
    userStory: {
      asA: "security engineer",
      iWant: "rate limiting on API endpoints",
      soThat: "we prevent abuse and DDoS attacks",
    },
    storyPoints: 5,
    acceptanceCriteria: [
      "Configure limits per endpoint",
      "Return proper 429 status codes",
      "Add rate limit headers",
      "Whitelist internal services",
    ],
    technicalNotes: [
      "Use Redis for distributed rate limiting",
      "Implement token bucket algorithm",
      "Add monitoring/alerting",
    ],
    status: "backlog",
    assignee: null,
    labels: ["security", "backend", "infrastructure"],
    priority: "critical",
    estimatedHours: 16,
    actualHours: 0,
    dependencies: [],
    linkedIssues: ["SEC-123"],
    createdAt: new Date(2025, 0, 9),
  },

  // SPRINT BACKLOG (4 stories)
  {
    id: "story-6",
    title: "Refactor authentication flow",
    userStory: {
      asA: "user",
      iWant: "a streamlined login experience",
      soThat: "I can access my account quickly",
    },
    storyPoints: 8,
    acceptanceCriteria: [
      "Support OAuth providers (Google, GitHub)",
      "Remember me functionality",
      "Session management with JWT refresh",
      "Secure password reset flow",
    ],
    technicalNotes: [
      "Migrate to NextAuth.js v5",
      "Implement CSRF protection",
      "Add rate limiting to login endpoint",
    ],
    status: "sprint-backlog",
    assignee: TEAM_MEMBERS[0],
    labels: ["auth", "security", "frontend"],
    priority: "critical",
    estimatedHours: 24,
    actualHours: 0,
    dependencies: [],
    linkedIssues: ["FEAT-234"],
    createdAt: new Date(2025, 0, 10),
  },
  {
    id: "story-7",
    title: "Design dark mode color palette",
    userStory: {
      asA: "user",
      iWant: "a dark mode option",
      soThat: "I can use the app comfortably at night",
    },
    storyPoints: 3,
    acceptanceCriteria: [
      "WCAG AA contrast compliance",
      "Smooth theme transition",
      "Persist user preference",
      "All components styled",
    ],
    technicalNotes: [
      "Use CSS variables for theming",
      "Test with color blindness simulator",
      "Ensure chart readability",
    ],
    status: "sprint-backlog",
    assignee: TEAM_MEMBERS[2],
    labels: ["design", "ux", "frontend"],
    priority: "high",
    estimatedHours: 12,
    actualHours: 0,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 11),
  },
  {
    id: "story-8",
    title: "Set up WebSocket server",
    userStory: {
      asA: "user",
      iWant: "real-time updates",
      soThat: "I see changes without refreshing",
    },
    storyPoints: 5,
    acceptanceCriteria: [
      "Socket.io server configured",
      "Authentication on connection",
      "Heartbeat/reconnection logic",
      "Room-based broadcasting",
    ],
    technicalNotes: [
      "Use Redis adapter for horizontal scaling",
      "Implement connection pooling",
      "Add monitoring/metrics",
    ],
    status: "sprint-backlog",
    assignee: TEAM_MEMBERS[1],
    labels: ["backend", "real-time", "infrastructure"],
    priority: "high",
    estimatedHours: 16,
    actualHours: 0,
    dependencies: [],
    linkedIssues: ["FEAT-567"],
    createdAt: new Date(2025, 0, 11),
  },
  {
    id: "story-9",
    title: "Create notification center UI",
    userStory: {
      asA: "user",
      iWant: "a notification center",
      soThat: "I can see all updates in one place",
    },
    storyPoints: 5,
    acceptanceCriteria: [
      "Dropdown with notification list",
      "Mark as read/unread",
      "Infinite scroll for history",
      "Real-time notification badge",
    ],
    technicalNotes: [
      "Use shadcn/ui Popover component",
      "Optimize re-renders with React.memo",
      "Add skeleton loading states",
    ],
    status: "sprint-backlog",
    assignee: TEAM_MEMBERS[4],
    labels: ["frontend", "ux", "real-time"],
    priority: "medium",
    estimatedHours: 16,
    actualHours: 0,
    dependencies: ["story-8"],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 12),
  },

  // IN PROGRESS (WIP: 4 stories)
  {
    id: "story-10",
    title: "Implement user profile page",
    userStory: {
      asA: "user",
      iWant: "to view and edit my profile",
      soThat: "I can keep my information up to date",
    },
    storyPoints: 5,
    acceptanceCriteria: [
      "Display user information",
      "Edit form with validation",
      "Avatar upload with crop",
      "Save changes with optimistic updates",
    ],
    technicalNotes: [
      "Use React Hook Form + Zod",
      "Implement image cropping with react-easy-crop",
      "Add upload progress indicator",
    ],
    status: "in-progress",
    assignee: TEAM_MEMBERS[2],
    labels: ["frontend", "user-management"],
    priority: "medium",
    estimatedHours: 16,
    actualHours: 10,
    dependencies: ["story-6"],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 9),
    startedAt: new Date(2025, 0, 18),
  },
  {
    id: "story-11",
    title: "Add email notification system",
    userStory: {
      asA: "user",
      iWant: "email notifications for important events",
      soThat: "I stay informed even when offline",
    },
    storyPoints: 3,
    acceptanceCriteria: [
      "Transactional email templates",
      "User notification preferences",
      "Queue-based email delivery",
      "Track delivery status",
    ],
    technicalNotes: [
      "Use Resend or SendGrid",
      "React Email for templates",
      "Bull queue for async processing",
    ],
    status: "in-progress",
    assignee: TEAM_MEMBERS[1],
    labels: ["backend", "email", "notifications"],
    priority: "medium",
    estimatedHours: 12,
    actualHours: 8,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 10),
    startedAt: new Date(2025, 0, 19),
  },
  {
    id: "story-12",
    title: "Build activity feed component",
    userStory: {
      asA: "user",
      iWant: "to see recent activity",
      soThat: "I can track what's happening",
    },
    storyPoints: 3,
    acceptanceCriteria: [
      "Timeline view with icons",
      "Filter by activity type",
      "Lazy loading on scroll",
      "Relative timestamps (e.g., '2 hours ago')",
    ],
    technicalNotes: [
      "Use Intersection Observer API",
      "Format timestamps with date-fns",
      "Add activity type icons",
    ],
    status: "in-progress",
    assignee: TEAM_MEMBERS[4],
    labels: ["frontend", "ux"],
    priority: "low",
    estimatedHours: 12,
    actualHours: 6,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 11),
    startedAt: new Date(2025, 0, 20),
  },
  {
    id: "story-13",
    title: "Implement search functionality",
    userStory: {
      asA: "user",
      iWant: "to search across all content",
      soThat: "I can find what I need quickly",
    },
    storyPoints: 5,
    acceptanceCriteria: [
      "Full-text search with fuzzy matching",
      "Search suggestions/autocomplete",
      "Filter by content type",
      "Highlight search terms in results",
    ],
    technicalNotes: [
      "Use ElasticSearch or Algolia",
      "Debounce search input",
      "Add keyboard navigation (arrow keys)",
    ],
    status: "in-progress",
    assignee: TEAM_MEMBERS[3],
    labels: ["backend", "frontend", "search"],
    priority: "high",
    estimatedHours: 20,
    actualHours: 14,
    dependencies: [],
    linkedIssues: ["FEAT-890"],
    createdAt: new Date(2025, 0, 10),
    startedAt: new Date(2025, 0, 17),
  },

  // CODE REVIEW (3 stories)
  {
    id: "story-14",
    title: "Add loading skeleton screens",
    userStory: {
      asA: "user",
      iWant: "visual feedback while content loads",
      soThat: "I know the app is working",
    },
    storyPoints: 2,
    acceptanceCriteria: [
      "Skeleton for all async content",
      "Match actual content layout",
      "Smooth transition when loaded",
      "Accessible (announce loading state)",
    ],
    technicalNotes: [
      "Use shadcn/ui Skeleton component",
      "Implement with Suspense boundaries",
      "Add aria-busy attributes",
    ],
    status: "code-review",
    assignee: TEAM_MEMBERS[2],
    labels: ["frontend", "ux", "accessibility"],
    priority: "medium",
    estimatedHours: 8,
    actualHours: 7,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 12),
    startedAt: new Date(2025, 0, 16),
  },
  {
    id: "story-15",
    title: "Optimize image loading",
    userStory: {
      asA: "user on slow connection",
      iWant: "images to load efficiently",
      soThat: "pages load faster",
    },
    storyPoints: 3,
    acceptanceCriteria: [
      "Use next/image for all images",
      "Implement lazy loading",
      "Responsive image sizes",
      "WebP format with fallback",
    ],
    technicalNotes: [
      "Configure next.config.js image domains",
      "Set up blur placeholders",
      "Use priority for above-fold images",
    ],
    status: "code-review",
    assignee: TEAM_MEMBERS[5],
    labels: ["frontend", "performance", "optimization"],
    priority: "medium",
    estimatedHours: 10,
    actualHours: 9,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 11),
    startedAt: new Date(2025, 0, 15),
  },
  {
    id: "story-16",
    title: "Add error boundary components",
    userStory: {
      asA: "user",
      iWant: "graceful error handling",
      soThat: "the app doesn't crash completely",
    },
    storyPoints: 2,
    acceptanceCriteria: [
      "Error boundary wraps each route",
      "Friendly error messages",
      "Error reporting to monitoring service",
      "Retry/reload options",
    ],
    technicalNotes: [
      "Use Next.js error.tsx files",
      "Integrate Sentry for error tracking",
      "Add fallback UI components",
    ],
    status: "code-review",
    assignee: TEAM_MEMBERS[0],
    labels: ["frontend", "error-handling", "reliability"],
    priority: "high",
    estimatedHours: 8,
    actualHours: 8,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 10),
    startedAt: new Date(2025, 0, 14),
  },

  // TESTING (3 stories)
  {
    id: "story-17",
    title: "Write E2E tests for checkout flow",
    userStory: {
      asA: "QA engineer",
      iWant: "automated E2E tests",
      soThat: "we catch regressions early",
    },
    storyPoints: 5,
    acceptanceCriteria: [
      "Test happy path checkout",
      "Test error scenarios",
      "Test mobile responsive",
      "Integrate with CI/CD",
    ],
    technicalNotes: [
      "Use Playwright for E2E",
      "Set up test database seeding",
      "Mock payment gateway in tests",
    ],
    status: "testing",
    assignee: TEAM_MEMBERS[6],
    labels: ["testing", "qa", "e2e"],
    priority: "high",
    estimatedHours: 16,
    actualHours: 15,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 9),
    startedAt: new Date(2025, 0, 13),
  },
  {
    id: "story-18",
    title: "Implement analytics tracking",
    userStory: {
      asA: "product manager",
      iWant: "user behavior analytics",
      soThat: "we can make data-driven decisions",
    },
    storyPoints: 3,
    acceptanceCriteria: [
      "Track page views",
      "Track button clicks",
      "Track user conversions",
      "Respect user privacy settings",
    ],
    technicalNotes: [
      "Use Google Analytics 4",
      "Add custom event tracking",
      "Implement consent management",
    ],
    status: "testing",
    assignee: TEAM_MEMBERS[5],
    labels: ["analytics", "tracking", "frontend"],
    priority: "medium",
    estimatedHours: 10,
    actualHours: 10,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 10),
    startedAt: new Date(2025, 0, 14),
  },
  {
    id: "story-19",
    title: "Add accessibility improvements",
    userStory: {
      asA: "user with disabilities",
      iWant: "an accessible application",
      soThat: "I can use all features independently",
    },
    storyPoints: 5,
    acceptanceCriteria: [
      "Keyboard navigation works everywhere",
      "Screen reader announcements",
      "ARIA labels on interactive elements",
      "Color contrast meets WCAG AA",
    ],
    technicalNotes: [
      "Use axe-core for automated testing",
      "Test with NVDA/VoiceOver",
      "Add focus visible styles",
    ],
    status: "testing",
    assignee: TEAM_MEMBERS[2],
    labels: ["accessibility", "a11y", "frontend"],
    priority: "critical",
    estimatedHours: 16,
    actualHours: 16,
    dependencies: [],
    linkedIssues: ["A11Y-456"],
    createdAt: new Date(2025, 0, 8),
    startedAt: new Date(2025, 0, 13),
  },

  // DONE (6 stories)
  {
    id: "story-20",
    title: "Set up CI/CD pipeline",
    userStory: {
      asA: "developer",
      iWant: "automated deployments",
      soThat: "we ship features faster",
    },
    storyPoints: 5,
    acceptanceCriteria: [
      "GitHub Actions workflow configured",
      "Automated tests run on PR",
      "Deploy to staging on merge",
      "Production deployment gate",
    ],
    technicalNotes: [
      "Use Vercel for deployments",
      "Add lint and type checking",
      "Configure preview deployments",
    ],
    status: "done",
    assignee: TEAM_MEMBERS[1],
    labels: ["devops", "ci-cd", "infrastructure"],
    priority: "high",
    estimatedHours: 16,
    actualHours: 14,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 5),
    startedAt: new Date(2025, 0, 13),
    completedAt: new Date(2025, 0, 17),
  },
  {
    id: "story-21",
    title: "Design component library",
    userStory: {
      asA: "designer",
      iWant: "a component library",
      soThat: "we maintain design consistency",
    },
    storyPoints: 3,
    acceptanceCriteria: [
      "Install shadcn/ui components",
      "Create custom theme configuration",
      "Document usage patterns",
      "Build Storybook showcase",
    ],
    technicalNotes: [
      "Use shadcn/ui as foundation",
      "Add custom variants",
      "Set up design tokens",
    ],
    status: "done",
    assignee: TEAM_MEMBERS[2],
    labels: ["design-system", "frontend", "documentation"],
    priority: "medium",
    estimatedHours: 12,
    actualHours: 11,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 6),
    startedAt: new Date(2025, 0, 14),
    completedAt: new Date(2025, 0, 18),
  },
  {
    id: "story-22",
    title: "Configure database migrations",
    userStory: {
      asA: "backend developer",
      iWant: "version-controlled database schema",
      soThat: "we can safely update production",
    },
    storyPoints: 3,
    acceptanceCriteria: [
      "Prisma schema defined",
      "Migration workflow documented",
      "Seed data for development",
      "Rollback strategy in place",
    ],
    technicalNotes: [
      "Use Prisma for ORM",
      "Set up shadow database for migrations",
      "Add migration testing",
    ],
    status: "done",
    assignee: TEAM_MEMBERS[1],
    labels: ["database", "backend", "migrations"],
    priority: "high",
    estimatedHours: 10,
    actualHours: 9,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 7),
    startedAt: new Date(2025, 0, 15),
    completedAt: new Date(2025, 0, 19),
  },
  {
    id: "story-23",
    title: "Implement logging system",
    userStory: {
      asA: "developer",
      iWant: "structured logging",
      soThat: "I can debug issues in production",
    },
    storyPoints: 2,
    acceptanceCriteria: [
      "Winston logger configured",
      "Log levels properly used",
      "Logs sent to monitoring service",
      "PII data redacted from logs",
    ],
    technicalNotes: [
      "Use Winston or Pino",
      "Integrate with DataDog/LogRocket",
      "Add request ID tracing",
    ],
    status: "done",
    assignee: TEAM_MEMBERS[3],
    labels: ["observability", "backend", "logging"],
    priority: "medium",
    estimatedHours: 8,
    actualHours: 7,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 8),
    startedAt: new Date(2025, 0, 16),
    completedAt: new Date(2025, 0, 19),
  },
  {
    id: "story-24",
    title: "Add unit tests for utilities",
    userStory: {
      asA: "developer",
      iWant: "unit tests for utility functions",
      soThat: "we prevent regressions",
    },
    storyPoints: 2,
    acceptanceCriteria: [
      "80% code coverage on utils",
      "Tests run in CI",
      "Edge cases covered",
      "Fast test execution (<5s)",
    ],
    technicalNotes: [
      "Use Vitest for testing",
      "Add coverage reporting",
      "Mock external dependencies",
    ],
    status: "done",
    assignee: TEAM_MEMBERS[4],
    labels: ["testing", "unit-tests", "quality"],
    priority: "medium",
    estimatedHours: 8,
    actualHours: 8,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 9),
    startedAt: new Date(2025, 0, 17),
    completedAt: new Date(2025, 0, 20),
  },
  {
    id: "story-25",
    title: "Create responsive layout system",
    userStory: {
      asA: "mobile user",
      iWant: "a responsive interface",
      soThat: "I can use the app on any device",
    },
    storyPoints: 3,
    acceptanceCriteria: [
      "Mobile-first CSS",
      "Breakpoints at 640, 768, 1024, 1280px",
      "Touch-friendly targets (44x44px minimum)",
      "Test on real devices",
    ],
    technicalNotes: [
      "Use Tailwind responsive utilities",
      "Add container queries where appropriate",
      "Test with Chrome DevTools device emulation",
    ],
    status: "done",
    assignee: TEAM_MEMBERS[2],
    labels: ["frontend", "responsive", "mobile"],
    priority: "high",
    estimatedHours: 12,
    actualHours: 11,
    dependencies: [],
    linkedIssues: [],
    createdAt: new Date(2025, 0, 6),
    startedAt: new Date(2025, 0, 14),
    completedAt: new Date(2025, 0, 18),
  },
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getDaysRemaining = (endDate: Date): number => {
  const today = new Date()
  const diff = endDate.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const getCurrentDay = (startDate: Date): number => {
  const today = new Date()
  const diff = today.getTime() - startDate.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const getSprintProgress = (committed: number, completed: number): number => {
  return Math.round((completed / committed) * 100)
}

const getWIPCount = (stories: Story[]): number => {
  return stories.filter((s) => s.status === "in-progress").length
}

const getAverageCycleTime = (stories: Story[]): number => {
  const completedStories = stories.filter((s) => s.status === "done" && s.startedAt && s.completedAt)
  if (completedStories.length === 0) return 0

  const totalHours = completedStories.reduce((sum, story) => {
    const start = story.startedAt!.getTime()
    const end = story.completedAt!.getTime()
    return sum + (end - start) / (1000 * 60 * 60)
  }, 0)

  return Math.round(totalHours / completedStories.length)
}

const getPriorityColor = (priority: Story["priority"]): string => {
  switch (priority) {
    case "critical":
      return "text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/30"
    case "high":
      return "text-orange-700 dark:text-orange-400 bg-orange-500/10 border-orange-500/30"
    case "medium":
      return "text-yellow-700 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
    case "low":
      return "text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/30"
  }
}

const getStatusColor = (status: Story["status"]): string => {
  switch (status) {
    case "backlog":
      return "bg-slate-500/30 text-slate-700 dark:text-slate-300"
    case "sprint-backlog":
      return "bg-blue-500/30 text-blue-700 dark:text-blue-300"
    case "in-progress":
      return "bg-yellow-500/30 text-yellow-700 dark:text-yellow-300"
    case "code-review":
      return "bg-purple-500/30 text-purple-700 dark:text-purple-300"
    case "testing":
      return "bg-orange-500/30 text-orange-700 dark:text-orange-300"
    case "done":
      return "bg-primary/30 text-primary"
  }
}

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SprintBoard() {
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [estimationMode, setEstimationMode] = useState(false)
  const [estimatingStory, setEstimatingStory] = useState<Story | null>(null)
  const [activeTab, setActiveTab] = useState("board")
  const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set())

  const daysRemaining = getDaysRemaining(CURRENT_SPRINT.endDate)
  const currentDay = getCurrentDay(CURRENT_SPRINT.startDate)
  const sprintProgress = getSprintProgress(CURRENT_SPRINT.committed, CURRENT_SPRINT.completed)
  const wipCount = getWIPCount(stories)
  const avgCycleTime = getAverageCycleTime(stories)

  // Calculate team capacity
  const totalCapacity = TEAM_MEMBERS.reduce((sum, member) => sum + member.capacity * (member.availability / 100), 0)
  const totalAllocated = TEAM_MEMBERS.reduce((sum, member) => sum + member.allocated, 0)
  const capacityUsed = Math.round((totalAllocated / totalCapacity) * 100)

  // Sprint health indicator
  const sprintHealth = useMemo(() => {
    const onTrack = currentDay > 0 ? CURRENT_SPRINT.completed >= (CURRENT_SPRINT.committed * currentDay) / 14 : true
    const wipOk = wipCount <= 5
    const capacityOk = capacityUsed < 90

    if (onTrack && wipOk && capacityOk) return "healthy"
    if (!onTrack || !wipOk) return "at-risk"
    return "warning"
  }, [currentDay, wipCount, capacityUsed])

  const columns = useMemo(
    () => [
      { id: "backlog", title: "Backlog", wipLimit: null, color: "slate" },
      { id: "sprint-backlog", title: "Sprint Backlog", wipLimit: null, color: "blue" },
      { id: "in-progress", title: "In Progress", wipLimit: 5, color: "yellow" },
      { id: "code-review", title: "Code Review", wipLimit: 4, color: "purple" },
      { id: "testing", title: "Testing", wipLimit: 4, color: "orange" },
      { id: "done", title: "Done", wipLimit: null, color: "emerald" },
    ],
    []
  )

  const getColumnStories = (columnId: string) => {
    return stories.filter((s) => s.status === columnId)
  }

  const handleDragEnd = (columnId: string, newOrder: Story[]) => {
    // Update the order of stories in this column
    const otherStories = stories.filter((s) => s.status !== columnId)
    setStories([...otherStories, ...newOrder])
  }

  const moveStory = (storyId: string, newStatus: Story["status"]) => {
    setStories(
      stories.map((s) =>
        s.id === storyId
          ? {
              ...s,
              status: newStatus,
              startedAt: newStatus === "in-progress" && !s.startedAt ? new Date() : s.startedAt,
              completedAt: newStatus === "done" ? new Date() : undefined,
            }
          : s
      )
    )
  }

  const toggleStoryExpansion = (storyId: string) => {
    setExpandedStories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(storyId)) {
        newSet.delete(storyId)
      } else {
        newSet.add(storyId)
      }
      return newSet
    })
  }

  const startEstimation = (story: Story) => {
    setEstimatingStory(story)
    setEstimationMode(true)
  }

  const submitEstimation = (points: number) => {
    if (estimatingStory) {
      setStories(stories.map((s) => (s.id === estimatingStory.id ? { ...s, storyPoints: points } : s)))
      setEstimationMode(false)
      setEstimatingStory(null)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Sprint Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 lg:mb-6"
      >
        <Card className="glass border-border/40 p-4 lg:p-5">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
            {/* Sprint Info */}
            <div className="space-y-3 lg:space-y-2">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {CURRENT_SPRINT.name}
                </h1>
                <Badge
                  className={`${
                    sprintHealth === "healthy"
                      ? "bg-primary/20 text-primary border-primary/30"
                      : sprintHealth === "warning"
                      ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30"
                      : "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30"
                  }`}
                >
                  {sprintHealth === "healthy" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {sprintHealth === "warning" && <AlertCircle className="w-3 h-3 mr-1" />}
                  {sprintHealth === "at-risk" && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {sprintHealth === "healthy" ? "Healthy" : sprintHealth === "warning" ? "Warning" : "At Risk"}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 lg:gap-6 text-xs lg:text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>
                    {CURRENT_SPRINT.startDate.toLocaleDateString()} - {CURRENT_SPRINT.endDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-primary">
                    {daysRemaining} days remaining
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="w-4 h-4 text-secondary" />
                  <span>
                    Day {currentDay + 1} of 14
                  </span>
                </div>
              </div>

              {/* Sprint Goals - Collapsible on desktop */}
              <div className="space-y-1 lg:space-y-1.5">
                <h3 className="text-xs lg:text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Target className="w-3 h-3 lg:w-4 lg:h-4" />
                  Sprint Goals
                </h3>
                <ul className="space-y-0.5 lg:space-y-1">
                  {CURRENT_SPRINT.goals.map((goal, index) => (
                    <li key={index} className="text-xs lg:text-sm text-foreground/80 flex items-start gap-1.5">
                      <Circle className="w-2.5 h-2.5 lg:w-3 lg:h-3 mt-0.5 text-primary fill-primary" />
                      <span className="line-clamp-1 lg:line-clamp-none">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sprint Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:min-w-[200px]">
              <div className="glass-dark p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Story Points</div>
                <div className="text-2xl font-bold text-primary">
                  {CURRENT_SPRINT.completed}/{CURRENT_SPRINT.committed}
                </div>
                <Progress value={sprintProgress} className="mt-2 h-2" />
              </div>

              <div className="glass-dark p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">WIP</div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{wipCount}</div>
                <div className="text-xs text-muted-foreground/70 mt-1">Limit: 5</div>
              </div>

              <div className="glass-dark p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Avg Cycle Time</div>
                <div className="text-2xl font-bold text-secondary">{avgCycleTime}h</div>
                <div className="text-xs text-muted-foreground/70 mt-1">Per story</div>
              </div>

              <div className="glass-dark p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Capacity</div>
                <div className="text-2xl font-bold text-accent">{capacityUsed}%</div>
                <Progress value={capacityUsed} className="mt-2 h-2" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border/30">
            <Button className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30">
              <Play className="w-4 h-4 mr-2" />
              Start Sprint
            </Button>
            <Button className="bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/30">
              <Square className="w-4 h-4 mr-2" />
              End Sprint
            </Button>
            <Button className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30">
              <Settings className="w-4 h-4 mr-2" />
              Sprint Settings
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="glass border-white/10 mb-6 w-max md:w-auto">
            <TabsTrigger value="board" className="text-xs sm:text-sm whitespace-nowrap">Sprint Board</TabsTrigger>
            <TabsTrigger value="burndown" className="text-xs sm:text-sm whitespace-nowrap">Burndown Chart</TabsTrigger>
            <TabsTrigger value="velocity" className="text-xs sm:text-sm whitespace-nowrap">Velocity</TabsTrigger>
            <TabsTrigger value="capacity" className="text-xs sm:text-sm whitespace-nowrap">Team Capacity</TabsTrigger>
          </TabsList>
        </div>

        {/* SPRINT BOARD TAB */}
        <TabsContent value="board" className="space-y-6">
          {/* Board Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {columns.map((column) => {
              const columnStories = getColumnStories(column.id)
              const wipViolation = column.wipLimit && columnStories.length > column.wipLimit

              return (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col"
                >
                  {/* Column Header */}
                  <div
                    className={`glass p-4 rounded-t-lg ${
                      wipViolation ? "bg-destructive/10 border-destructive/30" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{column.title}</h3>
                      <Badge className={`${getStatusColor(column.id as Story["status"])}`}>
                        {columnStories.length}
                      </Badge>
                    </div>

                    {column.wipLimit && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className={wipViolation ? "text-destructive" : "text-muted-foreground"}>
                          WIP Limit: {column.wipLimit}
                        </span>
                        {wipViolation && <AlertTriangle className="w-3 h-3 text-destructive" />}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground/70 mt-1">
                      {columnStories.reduce((sum, s) => sum + s.storyPoints, 0)} points
                    </div>
                  </div>

                  {/* Stories (Drag & Drop) */}
                  <Reorder.Group
                    axis="y"
                    values={columnStories}
                    onReorder={(newOrder) => handleDragEnd(column.id, newOrder)}
                    className="glass border-t-0 rounded-b-lg p-2 space-y-2 min-h-[200px] max-h-[min(60vh,500px)] lg:max-h-[400px] overflow-y-auto scrollbar-visible flex-1"
                  >
                    <AnimatePresence>
                      {columnStories.map((story) => (
                        <Reorder.Item key={story.id} value={story}>
                          <StoryCard
                            story={story}
                            onExpand={() => toggleStoryExpansion(story.id)}
                            isExpanded={expandedStories.has(story.id)}
                            onEstimate={() => startEstimation(story)}
                            onMove={moveStory}
                            onViewDetails={() => setSelectedStory(story)}
                          />
                        </Reorder.Item>
                      ))}
                    </AnimatePresence>
                  </Reorder.Group>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        {/* BURNDOWN CHART TAB */}
        <TabsContent value="burndown">
          <BurndownChart data={BURNDOWN_DATA} sprint={CURRENT_SPRINT} />
        </TabsContent>

        {/* VELOCITY TAB */}
        <TabsContent value="velocity">
          <VelocityChart data={VELOCITY_HISTORY} />
        </TabsContent>

        {/* TEAM CAPACITY TAB */}
        <TabsContent value="capacity">
          <TeamCapacity members={TEAM_MEMBERS} />
        </TabsContent>
      </Tabs>

      {/* Story Details Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)}>
        <DialogContent className="glass-overlay max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedStory && <StoryDetails story={selectedStory} onClose={() => setSelectedStory(null)} />}
        </DialogContent>
      </Dialog>

      {/* Estimation Poker Dialog */}
      <Dialog open={estimationMode} onOpenChange={setEstimationMode}>
        <DialogContent className="glass-overlay">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Estimation Poker</DialogTitle>
          </DialogHeader>
          {estimatingStory && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">{estimatingStory.title}</h3>
                <p className="text-sm text-muted-foreground">
                  As a <span className="text-primary">{estimatingStory.userStory.asA}</span>, I want{" "}
                  <span className="text-primary">{estimatingStory.userStory.iWant}</span>, so that{" "}
                  <span className="text-primary">{estimatingStory.userStory.soThat}</span>.
                </p>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-3">Select Story Points (Fibonacci):</div>
                <div className="grid grid-cols-4 gap-3">
                  {FIBONACCI.map((points) => (
                    <motion.button
                      key={points}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => submitEstimation(points)}
                      className="glass-dark rounded-lg p-4 text-2xl font-bold text-primary hover:bg-primary/20 hover:border-primary/30 transition-colors"
                    >
                      {points}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground/70 space-y-1">
                <p>• 1-2 points: Simple task (few hours)</p>
                <p>• 3-5 points: Medium complexity (1-2 days)</p>
                <p>• 8-13 points: Complex task (3-5 days)</p>
                <p>• 21+ points: Consider breaking down the story</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================================
// STORY CARD COMPONENT
// ============================================================================

interface StoryCardProps {
  story: Story
  onExpand: () => void
  isExpanded: boolean
  onEstimate: () => void
  onMove: (storyId: string, newStatus: Story["status"]) => void
  onViewDetails: () => void
}

function StoryCard({ story, onExpand, isExpanded, onEstimate, onMove, onViewDetails }: StoryCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-dark rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors"
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <GripVertical className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
          <h4 className="text-sm font-semibold text-foreground truncate" title={story.title}>
            {story.title}
          </h4>
        </div>

        <Badge className="bg-primary/20 text-primary border-primary/30 flex-shrink-0">
          {story.storyPoints} pts
        </Badge>
      </div>

      {/* Priority & Labels */}
      <div className="flex flex-wrap gap-1 mb-2">
        <Badge className={`text-xs ${getPriorityColor(story.priority)}`}>
          <Flag className="w-3 h-3 mr-1" />
          {story.priority}
        </Badge>

        {story.labels.slice(0, 2).map((label) => (
          <Badge key={label} variant="outline" className="text-xs text-muted-foreground">
            {label}
          </Badge>
        ))}

        {story.labels.length > 2 && (
          <Badge variant="outline" className="text-xs text-muted-foreground/70">
            +{story.labels.length - 2}
          </Badge>
        )}
      </div>

      {/* Assignee */}
      {story.assignee && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
            {story.assignee.avatar}
          </div>
          <span>{story.assignee.name}</span>
        </div>
      )}

      {/* Time Tracking */}
      {story.status !== "backlog" && story.status !== "sprint-backlog" && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Timer className="w-3 h-3" />
          <span>
            {story.actualHours}h / {story.estimatedHours}h
          </span>
          <Progress
            value={(story.actualHours / story.estimatedHours) * 100}
            className="h-1 flex-1"
          />
        </div>
      )}

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 pt-3 border-t border-border/30"
          >
            {/* User Story */}
            <div className="text-xs text-muted-foreground">
              <span className="text-primary">As a {story.userStory.asA}</span>, I want{" "}
              <span className="text-primary">{story.userStory.iWant}</span>, so that{" "}
              <span className="text-primary">{story.userStory.soThat}</span>.
            </div>

            {/* Acceptance Criteria */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">Acceptance Criteria:</div>
              <ul className="space-y-1">
                {story.acceptanceCriteria.slice(0, 3).map((criteria, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 mt-0.5 text-primary flex-shrink-0" />
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
              {story.acceptanceCriteria.length > 3 && (
                <button
                  onClick={onViewDetails}
                  className="text-xs text-primary hover:text-primary/80 mt-1"
                >
                  +{story.acceptanceCriteria.length - 3} more
                </button>
              )}
            </div>

            {/* Dependencies */}
            {story.dependencies.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <Link2 className="w-3 h-3" />
                <span>{story.dependencies.length} dependencies</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onEstimate}
                className="text-xs hover:border-primary/30 hover:bg-primary/10"
              >
                <Zap className="w-3 h-3 mr-1" />
                Estimate
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onViewDetails}
                className="text-xs hover:border-secondary/30 hover:bg-secondary/10"
              >
                Details
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand/Collapse Button */}
      <button
        onClick={onExpand}
        className="w-full flex items-center justify-center pt-2 text-muted-foreground/70 hover:text-foreground transition-colors"
      >
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    </motion.div>
  )
}

// ============================================================================
// STORY DETAILS COMPONENT
// ============================================================================

interface StoryDetailsProps {
  story: Story
  onClose: () => void
}

function StoryDetails({ story }: StoryDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold gradient-text-theme">
            {story.title}
          </h2>
          <Badge className={`${getPriorityColor(story.priority)}`}>
            <Flag className="w-3 h-3 mr-1" />
            {story.priority}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {story.labels.map((label) => (
            <Badge key={label} variant="outline" className="text-muted-foreground">
              {label}
            </Badge>
          ))}
        </div>
      </div>

      {/* User Story */}
      <Card className="glass-dark p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">User Story</h3>
        <p className="text-foreground/80">
          As a <span className="text-primary font-semibold">{story.userStory.asA}</span>, I want{" "}
          <span className="text-primary font-semibold">{story.userStory.iWant}</span>, so that{" "}
          <span className="text-primary font-semibold">{story.userStory.soThat}</span>.
        </p>
      </Card>

      {/* Story Points & Time */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-dark p-4">
          <div className="text-sm text-muted-foreground mb-1">Story Points</div>
          <div className="text-3xl font-bold text-primary">{story.storyPoints}</div>
        </Card>
        <Card className="glass-dark p-4">
          <div className="text-sm text-muted-foreground mb-1">Time Estimate</div>
          <div className="text-3xl font-bold text-secondary">{story.estimatedHours}h</div>
        </Card>
      </div>

      {/* Assignee */}
      {story.assignee && (
        <Card className="glass-dark p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Assigned To</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
              {story.assignee.avatar}
            </div>
            <div>
              <div className="font-semibold text-foreground">{story.assignee.name}</div>
              <div className="text-xs text-muted-foreground">
                {story.assignee.allocated}h / {story.assignee.capacity}h allocated
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Acceptance Criteria */}
      <Card className="glass-dark p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Acceptance Criteria</h3>
        <ul className="space-y-2">
          {story.acceptanceCriteria.map((criteria, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-foreground/80">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span>{criteria}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Technical Notes */}
      <Card className="glass-dark p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Technical Notes</h3>
        <ul className="space-y-2">
          {story.technicalNotes.map((note, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-foreground/80">
              <Circle className="w-2 h-2 mt-1.5 text-primary fill-primary flex-shrink-0" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Dependencies & Linked Issues */}
      {(story.dependencies.length > 0 || story.linkedIssues.length > 0) && (
        <Card className="glass-dark p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Dependencies & Links</h3>
          <div className="space-y-3">
            {story.dependencies.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground/70 mb-1">Depends on:</div>
                <div className="flex flex-wrap gap-2">
                  {story.dependencies.map((dep) => (
                    <Badge key={dep} variant="outline" className="text-amber-400 border-amber-500/30">
                      <Link2 className="w-3 h-3 mr-1" />
                      {dep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {story.linkedIssues.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground/70 mb-1">Linked issues:</div>
                <div className="flex flex-wrap gap-2">
                  {story.linkedIssues.map((issue) => (
                    <Badge key={issue} variant="outline" className="text-secondary border-secondary/30">
                      {issue}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

// ============================================================================
// BURNDOWN CHART COMPONENT
// ============================================================================

interface BurndownChartProps {
  data: BurndownPoint[]
  sprint: SprintData
}

function BurndownChart({ data, sprint }: BurndownChartProps) {
  const maxPoints = sprint.committed + 5 // Add some padding
  const chartWidth = 800
  const chartHeight = 400
  const padding = { top: 20, right: 40, bottom: 40, left: 60 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  // Calculate scales
  const xScale = (day: number) => (day / 14) * innerWidth
  const yScale = (points: number) => innerHeight - (points / maxPoints) * innerHeight

  // Generate path for ideal line
  const idealPath = data
    .map((point, index) => {
      const x = xScale(point.day)
      const y = yScale(point.ideal)
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    })
    .join(" ")

  // Generate path for actual line
  const actualPath = data
    .map((point, index) => {
      const x = xScale(point.day)
      const y = yScale(point.actual)
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    })
    .join(" ")

  // Generate area path for actual (for gradient fill)
  const actualAreaPath =
    actualPath +
    ` L ${xScale(data[data.length - 1].day)} ${innerHeight} L ${xScale(0)} ${innerHeight} Z`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="glass p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text-theme">
            Burndown Chart
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-muted-foreground"></div>
              <span className="text-sm text-muted-foreground">Ideal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-primary"></div>
              <span className="text-sm text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500/20 border border-amber-500/50"></div>
              <span className="text-sm text-muted-foreground">Scope Change</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="overflow-x-auto">
          <svg width={chartWidth} height={chartHeight} className="text-slate-300">
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>

            <g transform={`translate(${padding.left}, ${padding.top})`}>
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const y = (innerHeight / 5) * i
                const points = maxPoints - (maxPoints / 5) * i
                return (
                  <g key={i}>
                    <line
                      x1="0"
                      y1={y}
                      x2={innerWidth}
                      y2={y}
                      stroke="rgba(148, 163, 184, 0.1)"
                      strokeWidth="1"
                    />
                    <text x="-10" y={y} textAnchor="end" alignmentBaseline="middle" fontSize="12" fill="rgb(148, 163, 184)">
                      {Math.round(points)}
                    </text>
                  </g>
                )
              })}

              {/* X-axis labels */}
              {[0, 2, 4, 6, 8, 10, 12, 14].map((day) => {
                const x = xScale(day)
                return (
                  <text
                    key={day}
                    x={x}
                    y={innerHeight + 25}
                    textAnchor="middle"
                    fontSize="12"
                    fill="rgb(148, 163, 184)"
                  >
                    Day {day}
                  </text>
                )
              })}

              {/* Actual area (with gradient) */}
              <path d={actualAreaPath} fill="url(#actualGradient)" />

              {/* Ideal line */}
              <path d={idealPath} stroke="rgb(100, 116, 139)" strokeWidth="2" fill="none" strokeDasharray="5,5" />

              {/* Actual line */}
              <path d={actualPath} stroke="hsl(var(--primary))" strokeWidth="3" fill="none" />

              {/* Data points */}
              {data.map((point) => (
                <g key={point.day}>
                  {/* Ideal point */}
                  <circle cx={xScale(point.day)} cy={yScale(point.ideal)} r="4" fill="rgb(100, 116, 139)" />

                  {/* Actual point */}
                  <circle cx={xScale(point.day)} cy={yScale(point.actual)} r="5" fill="hsl(var(--primary))" stroke="hsl(var(--primary) / 0.4)" strokeWidth="2" />

                  {/* Scope change indicator */}
                  {point.scopeChange > 0 && (
                    <rect
                      x={xScale(point.day) - 6}
                      y={yScale(point.actual) - 20}
                      width="12"
                      height="12"
                      fill="rgba(245, 158, 11, 0.2)"
                      stroke="rgba(245, 158, 11, 0.5)"
                      strokeWidth="1"
                    />
                  )}
                </g>
              ))}

              {/* Current day indicator */}
              {data.length > 0 && (
                <line
                  x1={xScale(data[data.length - 1].day)}
                  y1="0"
                  x2={xScale(data[data.length - 1].day)}
                  y2={innerHeight}
                  stroke="hsl(var(--secondary))"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                  opacity="0.5"
                />
              )}
            </g>

            {/* Axis labels */}
            <text
              x={chartWidth / 2}
              y={chartHeight - 5}
              textAnchor="middle"
              fontSize="14"
              fill="rgb(148, 163, 184)"
              fontWeight="600"
            >
              Sprint Days
            </text>
            <text
              x="15"
              y={chartHeight / 2}
              textAnchor="middle"
              fontSize="14"
              fill="rgb(148, 163, 184)"
              fontWeight="600"
              transform={`rotate(-90, 15, ${chartHeight / 2})`}
            >
              Story Points Remaining
            </text>
          </svg>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="glass-dark p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="text-lg font-bold text-primary">Ahead of Schedule</div>
              </div>
            </div>
          </Card>

          <Card className="glass-dark p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-secondary" />
              <div>
                <div className="text-sm text-muted-foreground">Velocity Trend</div>
                <div className="text-lg font-bold text-secondary">+5% vs Last Sprint</div>
              </div>
            </div>
          </Card>

          <Card className="glass-dark p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-amber-400" />
              <div>
                <div className="text-sm text-muted-foreground">Scope Changes</div>
                <div className="text-lg font-bold text-amber-400">+2 Points (Day 3)</div>
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </motion.div>
  )
}

// ============================================================================
// VELOCITY CHART COMPONENT
// ============================================================================

interface VelocityChartProps {
  data: VelocityData[]
}

function VelocityChart({ data }: VelocityChartProps) {
  const maxVelocity = Math.max(...data.map((d) => Math.max(d.committed, d.completed))) + 5
  const chartWidth = 800
  const chartHeight = 400
  const padding = { top: 20, right: 40, bottom: 60, left: 60 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  const barWidth = innerWidth / data.length / 2.5
  const groupWidth = innerWidth / data.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="glass p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text-theme">
            Velocity Trend
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-secondary/30 border border-secondary/50"></div>
              <span className="text-sm text-muted-foreground">Committed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary/30 border border-primary/50"></div>
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="overflow-x-auto">
          <svg width={chartWidth} height={chartHeight} className="text-slate-300">
            <g transform={`translate(${padding.left}, ${padding.top})`}>
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const y = (innerHeight / 5) * i
                const value = maxVelocity - (maxVelocity / 5) * i
                return (
                  <g key={i}>
                    <line
                      x1="0"
                      y1={y}
                      x2={innerWidth}
                      y2={y}
                      stroke="rgba(148, 163, 184, 0.1)"
                      strokeWidth="1"
                    />
                    <text x="-10" y={y} textAnchor="end" alignmentBaseline="middle" fontSize="12" fill="rgb(148, 163, 184)">
                      {Math.round(value)}
                    </text>
                  </g>
                )
              })}

              {/* Bars */}
              {data.map((sprint, index) => {
                const xCenter = index * groupWidth + groupWidth / 2
                const committedHeight = (sprint.committed / maxVelocity) * innerHeight
                const completedHeight = (sprint.completed / maxVelocity) * innerHeight

                return (
                  <g key={sprint.sprint}>
                    {/* Committed bar */}
                    <rect
                      x={xCenter - barWidth - 2}
                      y={innerHeight - committedHeight}
                      width={barWidth}
                      height={committedHeight}
                      fill="rgba(59, 130, 246, 0.3)"
                      stroke="rgba(59, 130, 246, 0.5)"
                      strokeWidth="1"
                      rx="4"
                    />

                    {/* Completed bar */}
                    <rect
                      x={xCenter + 2}
                      y={innerHeight - completedHeight}
                      width={barWidth}
                      height={completedHeight}
                      fill="hsl(var(--primary) / 0.3)"
                      stroke="hsl(var(--primary) / 0.5)"
                      strokeWidth="1"
                      rx="4"
                    />

                    {/* Sprint label */}
                    <text
                      x={xCenter}
                      y={innerHeight + 20}
                      textAnchor="middle"
                      fontSize="11"
                      fill="rgb(148, 163, 184)"
                      transform={`rotate(-45, ${xCenter}, ${innerHeight + 20})`}
                    >
                      {sprint.sprint}
                    </text>

                    {/* Values */}
                    <text
                      x={xCenter - barWidth / 2 - 2}
                      y={innerHeight - committedHeight - 5}
                      textAnchor="middle"
                      fontSize="11"
                      fill="rgb(59, 130, 246)"
                      fontWeight="600"
                    >
                      {sprint.committed}
                    </text>
                    <text
                      x={xCenter + barWidth / 2 + 2}
                      y={innerHeight - completedHeight - 5}
                      textAnchor="middle"
                      fontSize="11"
                      fill="hsl(var(--primary))"
                      fontWeight="600"
                    >
                      {sprint.completed}
                    </text>
                  </g>
                )
              })}
            </g>

            {/* Axis labels */}
            <text
              x={chartWidth / 2}
              y={chartHeight - 5}
              textAnchor="middle"
              fontSize="14"
              fill="rgb(148, 163, 184)"
              fontWeight="600"
            >
              Sprint
            </text>
            <text
              x="15"
              y={chartHeight / 2}
              textAnchor="middle"
              fontSize="14"
              fill="rgb(148, 163, 184)"
              fontWeight="600"
              transform={`rotate(-90, 15, ${chartHeight / 2})`}
            >
              Story Points
            </text>
          </svg>
        </div>

        {/* Velocity Insights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card className="glass-dark p-4">
            <div className="text-sm text-muted-foreground mb-1">Avg Velocity</div>
            <div className="text-2xl font-bold text-primary">
              {Math.round(data.reduce((sum, d) => sum + d.completed, 0) / data.length)}
            </div>
            <div className="text-xs text-muted-foreground/70 mt-1">points/sprint</div>
          </Card>

          <Card className="glass-dark p-4">
            <div className="text-sm text-muted-foreground mb-1">Commitment Accuracy</div>
            <div className="text-2xl font-bold text-secondary">
              {Math.round(
                (data.reduce((sum, d) => sum + d.completed, 0) / data.reduce((sum, d) => sum + d.committed, 0)) *
                  100
              )}
              %
            </div>
            <div className="text-xs text-muted-foreground/70 mt-1">completed vs committed</div>
          </Card>

          <Card className="glass-dark p-4">
            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              Trend
              <TrendingUp className="w-3 h-3" />
            </div>
            <div className="text-2xl font-bold text-primary">+12%</div>
            <div className="text-xs text-muted-foreground/70 mt-1">vs 3 sprints ago</div>
          </Card>

          <Card className="glass-dark p-4">
            <div className="text-sm text-muted-foreground mb-1">Predictability</div>
            <div className="text-2xl font-bold text-accent">High</div>
            <div className="text-xs text-muted-foreground/70 mt-1">±2 points variance</div>
          </Card>
        </div>
      </Card>
    </motion.div>
  )
}

// ============================================================================
// TEAM CAPACITY COMPONENT
// ============================================================================

interface TeamCapacityProps {
  members: TeamMember[]
}

function TeamCapacity({ members }: TeamCapacityProps) {
  const totalCapacity = members.reduce((sum, m) => sum + m.capacity * (m.availability / 100), 0)
  const totalAllocated = members.reduce((sum, m) => sum + m.allocated, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="glass p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text-theme">
            Team Capacity
          </h2>
          <div className="text-sm text-muted-foreground">
            <span className="text-primary font-semibold">{totalAllocated}h</span> /{" "}
            <span className="text-foreground/80">{Math.round(totalCapacity)}h</span> allocated
          </div>
        </div>

        {/* Overall Capacity Bar */}
        <Card className="glass-dark p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground/80">Overall Team Capacity</span>
            <span className="text-sm font-bold text-secondary">
              {Math.round((totalAllocated / totalCapacity) * 100)}%
            </span>
          </div>
          <Progress value={(totalAllocated / totalCapacity) * 100} className="h-3" />
        </Card>

        {/* Individual Team Members */}
        <div className="space-y-4">
          {members.map((member) => {
            const adjustedCapacity = member.capacity * (member.availability / 100)
            const utilizationPercent = Math.round((member.allocated / adjustedCapacity) * 100)
            const isOverallocated = utilizationPercent > 100
            const isNearCapacity = utilizationPercent > 90 && !isOverallocated

            return (
              <Card key={member.id} className="glass-dark p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{member.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {member.availability < 100 && (
                          <span className="text-amber-400">{member.availability}% available</span>
                        )}
                        {member.availability === 100 && <span>Full availability</span>}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        isOverallocated
                          ? "text-destructive"
                          : isNearCapacity
                          ? "text-amber-400"
                          : "text-primary"
                      }`}
                    >
                      {utilizationPercent}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {member.allocated}h / {Math.round(adjustedCapacity)}h
                    </div>
                  </div>
                </div>

                <Progress
                  value={utilizationPercent}
                  className={`h-2 ${
                    isOverallocated
                      ? "[&>div]:bg-destructive"
                      : isNearCapacity
                      ? "[&>div]:bg-amber-500"
                      : ""
                  }`}
                />

                {isOverallocated && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-destructive">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Overallocated by {member.allocated - Math.round(adjustedCapacity)}h</span>
                  </div>
                )}

                {isNearCapacity && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-amber-400">
                    <AlertCircle className="w-3 h-3" />
                    <span>Near capacity - {Math.round(adjustedCapacity - member.allocated)}h remaining</span>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Capacity Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="glass-dark p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Team Members</div>
                <div className="text-2xl font-bold text-primary">{members.length}</div>
              </div>
            </div>
          </Card>

          <Card className="glass-dark p-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-secondary" />
              <div>
                <div className="text-sm text-muted-foreground">Avg Utilization</div>
                <div className="text-2xl font-bold text-secondary">
                  {Math.round(
                    members.reduce(
                      (sum, m) => sum + (m.allocated / (m.capacity * (m.availability / 100))) * 100,
                      0
                    ) / members.length
                  )}
                  %
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass-dark p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
              <div>
                <div className="text-sm text-muted-foreground">At Risk</div>
                <div className="text-2xl font-bold text-amber-400">
                  {members.filter((m) => (m.allocated / (m.capacity * (m.availability / 100))) * 100 > 90).length}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </motion.div>
  )
}
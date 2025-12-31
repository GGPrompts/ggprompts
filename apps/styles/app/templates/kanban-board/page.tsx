"use client"

import React, { useState, useMemo } from "react"
import { motion, Reorder, AnimatePresence } from "framer-motion"
import {
  Plus,
  Search,
  Filter,
  Settings,
  MoreVertical,
  Calendar,
  Paperclip,
  MessageSquare,
  CheckSquare,
  AlertCircle,
  Flag,
  Users,
  Tag,
  X,
  ChevronDown,
  Clock,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Archive,
  RotateCcw,
} from "lucide-react"
import { Button, Card, Badge, Input, Textarea, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Label, Avatar, AvatarFallback, AvatarImage, Checkbox, Progress } from "@ggprompts/ui"

// ============================================================================
// TYPES
// ============================================================================

type Priority = "high" | "medium" | "low"
type CardStatus = "backlog" | "todo" | "in-progress" | "review" | "done"

interface TeamMember {
  id: string
  name: string
  avatar: string
  color: string
}

interface Tag {
  id: string
  label: string
  color: string
}

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}

interface KanbanCard {
  id: string
  title: string
  description: string
  priority: Priority
  assignee: TeamMember
  tags: Tag[]
  dueDate: Date | null
  attachmentCount: number
  commentCount: number
  checklist: ChecklistItem[]
  createdAt: Date
}

interface Column {
  id: CardStatus
  title: string
  cards: KanbanCard[]
  limit?: number
}

// ============================================================================
// MOCK DATA
// ============================================================================

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    color: "hsl(210, 100%, 50%)",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    color: "hsl(var(--primary))",
  },
  {
    id: "3",
    name: "Emily Watson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    color: "hsl(280, 100%, 50%)",
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    color: "hsl(45, 100%, 50%)",
  },
  {
    id: "5",
    name: "Olivia Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    color: "hsl(330, 100%, 50%)",
  },
  {
    id: "6",
    name: "James Park",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    color: "hsl(15, 100%, 50%)",
  },
]

const AVAILABLE_TAGS: Tag[] = [
  { id: "1", label: "Bug", color: "hsl(0, 84%, 60%)" },
  { id: "2", label: "Feature", color: "hsl(210, 100%, 56%)" },
  { id: "3", label: "Design", color: "hsl(280, 100%, 60%)" },
  { id: "4", label: "Backend", color: "hsl(var(--primary))" },
  { id: "5", label: "Frontend", color: "hsl(45, 100%, 51%)" },
  { id: "6", label: "Documentation", color: "hsl(200, 100%, 40%)" },
  { id: "7", label: "Testing", color: "hsl(330, 100%, 50%)" },
  { id: "8", label: "Security", color: "hsl(0, 100%, 45%)" },
  { id: "9", label: "Performance", color: "hsl(30, 100%, 50%)" },
  { id: "10", label: "Refactor", color: "hsl(260, 100%, 60%)" },
]

const getRandomDate = (daysOffset: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  return date
}

const INITIAL_CARDS: KanbanCard[] = [
  // Backlog
  {
    id: "card-1",
    title: "Implement dark mode toggle",
    description: "Add a theme switcher component to the settings page",
    priority: "medium",
    assignee: TEAM_MEMBERS[0],
    tags: [AVAILABLE_TAGS[1], AVAILABLE_TAGS[4]],
    dueDate: getRandomDate(14),
    attachmentCount: 2,
    commentCount: 3,
    checklist: [
      { id: "cl-1", label: "Design mockups", completed: true },
      { id: "cl-2", label: "Implement component", completed: false },
      { id: "cl-3", label: "Add tests", completed: false },
    ],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "card-2",
    title: "Database migration for user profiles",
    description: "Update schema to support extended user profile fields",
    priority: "high",
    assignee: TEAM_MEMBERS[1],
    tags: [AVAILABLE_TAGS[3], AVAILABLE_TAGS[7]],
    dueDate: getRandomDate(7),
    attachmentCount: 5,
    commentCount: 8,
    checklist: [
      { id: "cl-4", label: "Create migration script", completed: false },
      { id: "cl-5", label: "Test on staging", completed: false },
      { id: "cl-6", label: "Deploy to production", completed: false },
    ],
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "card-3",
    title: "Write API documentation",
    description: "Document all REST endpoints with examples",
    priority: "low",
    assignee: TEAM_MEMBERS[2],
    tags: [AVAILABLE_TAGS[5]],
    dueDate: getRandomDate(21),
    attachmentCount: 0,
    commentCount: 1,
    checklist: [
      { id: "cl-7", label: "List all endpoints", completed: true },
      { id: "cl-8", label: "Write descriptions", completed: false },
      { id: "cl-9", label: "Add code examples", completed: false },
      { id: "cl-10", label: "Review with team", completed: false },
    ],
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "card-4",
    title: "Refactor authentication service",
    description: "Clean up legacy auth code and improve error handling",
    priority: "medium",
    assignee: TEAM_MEMBERS[3],
    tags: [AVAILABLE_TAGS[9], AVAILABLE_TAGS[3]],
    dueDate: getRandomDate(10),
    attachmentCount: 1,
    commentCount: 4,
    checklist: [],
    createdAt: new Date("2024-01-08"),
  },

  // Todo
  {
    id: "card-5",
    title: "Fix memory leak in WebSocket handler",
    description: "Users report browser crashes after extended sessions",
    priority: "high",
    assignee: TEAM_MEMBERS[4],
    tags: [AVAILABLE_TAGS[0], AVAILABLE_TAGS[8]],
    dueDate: getRandomDate(3),
    attachmentCount: 3,
    commentCount: 12,
    checklist: [
      { id: "cl-11", label: "Reproduce issue", completed: true },
      { id: "cl-12", label: "Identify root cause", completed: true },
      { id: "cl-13", label: "Implement fix", completed: false },
      { id: "cl-14", label: "Test thoroughly", completed: false },
    ],
    createdAt: new Date("2024-01-18"),
  },
  {
    id: "card-6",
    title: "Add email notification system",
    description: "Send notifications for important events",
    priority: "medium",
    assignee: TEAM_MEMBERS[5],
    tags: [AVAILABLE_TAGS[1], AVAILABLE_TAGS[3]],
    dueDate: getRandomDate(12),
    attachmentCount: 2,
    commentCount: 5,
    checklist: [
      { id: "cl-15", label: "Set up email service", completed: false },
      { id: "cl-16", label: "Create templates", completed: false },
      { id: "cl-17", label: "Add subscription settings", completed: false },
    ],
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "card-7",
    title: "Optimize image loading",
    description: "Implement lazy loading and image compression",
    priority: "medium",
    assignee: TEAM_MEMBERS[0],
    tags: [AVAILABLE_TAGS[8], AVAILABLE_TAGS[4]],
    dueDate: getRandomDate(8),
    attachmentCount: 4,
    commentCount: 2,
    checklist: [
      { id: "cl-18", label: "Audit current images", completed: true },
      { id: "cl-19", label: "Implement lazy loading", completed: false },
      { id: "cl-20", label: "Add image compression", completed: false },
    ],
    createdAt: new Date("2024-01-14"),
  },
  {
    id: "card-8",
    title: "Create onboarding tutorial",
    description: "Interactive guide for new users",
    priority: "low",
    assignee: TEAM_MEMBERS[2],
    tags: [AVAILABLE_TAGS[1], AVAILABLE_TAGS[4]],
    dueDate: getRandomDate(20),
    attachmentCount: 1,
    commentCount: 3,
    checklist: [],
    createdAt: new Date("2024-01-13"),
  },

  // In Progress
  {
    id: "card-9",
    title: "Build analytics dashboard",
    description: "Real-time metrics and user behavior tracking",
    priority: "high",
    assignee: TEAM_MEMBERS[1],
    tags: [AVAILABLE_TAGS[1], AVAILABLE_TAGS[4]],
    dueDate: getRandomDate(5),
    attachmentCount: 7,
    commentCount: 15,
    checklist: [
      { id: "cl-21", label: "Design layout", completed: true },
      { id: "cl-22", label: "Implement charts", completed: true },
      { id: "cl-23", label: "Connect to API", completed: true },
      { id: "cl-24", label: "Add filters", completed: false },
      { id: "cl-25", label: "Polish UI", completed: false },
    ],
    createdAt: new Date("2024-01-19"),
  },
  {
    id: "card-10",
    title: "Implement file upload system",
    description: "Support for multiple file types with drag-and-drop",
    priority: "high",
    assignee: TEAM_MEMBERS[3],
    tags: [AVAILABLE_TAGS[1], AVAILABLE_TAGS[3]],
    dueDate: getRandomDate(4),
    attachmentCount: 3,
    commentCount: 9,
    checklist: [
      { id: "cl-26", label: "Set up storage", completed: true },
      { id: "cl-27", label: "Build upload UI", completed: true },
      { id: "cl-28", label: "Add validation", completed: false },
      { id: "cl-29", label: "Test edge cases", completed: false },
    ],
    createdAt: new Date("2024-01-17"),
  },
  {
    id: "card-11",
    title: "Fix responsive layout bugs",
    description: "Several components break on mobile devices",
    priority: "medium",
    assignee: TEAM_MEMBERS[4],
    tags: [AVAILABLE_TAGS[0], AVAILABLE_TAGS[4]],
    dueDate: getRandomDate(6),
    attachmentCount: 2,
    commentCount: 6,
    checklist: [
      { id: "cl-30", label: "Audit all pages", completed: true },
      { id: "cl-31", label: "Fix navigation", completed: true },
      { id: "cl-32", label: "Fix forms", completed: false },
      { id: "cl-33", label: "Fix tables", completed: false },
    ],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "card-12",
    title: "Add search functionality",
    description: "Full-text search across all content",
    priority: "medium",
    assignee: TEAM_MEMBERS[5],
    tags: [AVAILABLE_TAGS[1], AVAILABLE_TAGS[3]],
    dueDate: getRandomDate(9),
    attachmentCount: 1,
    commentCount: 4,
    checklist: [
      { id: "cl-34", label: "Set up search index", completed: true },
      { id: "cl-35", label: "Build search UI", completed: false },
      { id: "cl-36", label: "Add filters", completed: false },
    ],
    createdAt: new Date("2024-01-11"),
  },

  // Review
  {
    id: "card-13",
    title: "Redesign settings page",
    description: "New UI with improved organization",
    priority: "low",
    assignee: TEAM_MEMBERS[0],
    tags: [AVAILABLE_TAGS[2], AVAILABLE_TAGS[4]],
    dueDate: getRandomDate(11),
    attachmentCount: 8,
    commentCount: 7,
    checklist: [
      { id: "cl-37", label: "Design mockups", completed: true },
      { id: "cl-38", label: "Implement UI", completed: true },
      { id: "cl-39", label: "Add animations", completed: true },
      { id: "cl-40", label: "Get design approval", completed: false },
    ],
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "card-14",
    title: "Add two-factor authentication",
    description: "TOTP-based 2FA for enhanced security",
    priority: "high",
    assignee: TEAM_MEMBERS[1],
    tags: [AVAILABLE_TAGS[1], AVAILABLE_TAGS[7]],
    dueDate: getRandomDate(2),
    attachmentCount: 4,
    commentCount: 11,
    checklist: [
      { id: "cl-41", label: "Implement backend", completed: true },
      { id: "cl-42", label: "Build setup flow", completed: true },
      { id: "cl-43", label: "Add backup codes", completed: true },
      { id: "cl-44", label: "Security audit", completed: false },
    ],
    createdAt: new Date("2024-01-21"),
  },
  {
    id: "card-15",
    title: "Improve error messages",
    description: "Make errors more user-friendly and actionable",
    priority: "medium",
    assignee: TEAM_MEMBERS[2],
    tags: [AVAILABLE_TAGS[4]],
    dueDate: getRandomDate(13),
    attachmentCount: 0,
    commentCount: 2,
    checklist: [
      { id: "cl-45", label: "Audit all errors", completed: true },
      { id: "cl-46", label: "Rewrite messages", completed: true },
      { id: "cl-47", label: "Add helpful links", completed: true },
      { id: "cl-48", label: "Test with users", completed: false },
    ],
    createdAt: new Date("2024-01-09"),
  },

  // Done
  {
    id: "card-16",
    title: "Set up CI/CD pipeline",
    description: "Automated testing and deployment",
    priority: "high",
    assignee: TEAM_MEMBERS[3],
    tags: [AVAILABLE_TAGS[3], AVAILABLE_TAGS[6]],
    dueDate: getRandomDate(-5),
    attachmentCount: 6,
    commentCount: 18,
    checklist: [
      { id: "cl-49", label: "Configure GitHub Actions", completed: true },
      { id: "cl-50", label: "Add test suite", completed: true },
      { id: "cl-51", label: "Set up staging", completed: true },
      { id: "cl-52", label: "Deploy to production", completed: true },
    ],
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "card-17",
    title: "Update dependencies",
    description: "Upgrade all packages to latest versions",
    priority: "medium",
    assignee: TEAM_MEMBERS[4],
    tags: [AVAILABLE_TAGS[3], AVAILABLE_TAGS[7]],
    dueDate: getRandomDate(-2),
    attachmentCount: 1,
    commentCount: 4,
    checklist: [
      { id: "cl-53", label: "Check compatibility", completed: true },
      { id: "cl-54", label: "Update packages", completed: true },
      { id: "cl-55", label: "Run tests", completed: true },
      { id: "cl-56", label: "Deploy", completed: true },
    ],
    createdAt: new Date("2024-01-03"),
  },
  {
    id: "card-18",
    title: "Add loading skeletons",
    description: "Improve perceived performance",
    priority: "low",
    assignee: TEAM_MEMBERS[5],
    tags: [AVAILABLE_TAGS[4]],
    dueDate: getRandomDate(-7),
    attachmentCount: 3,
    commentCount: 2,
    checklist: [
      { id: "cl-57", label: "Design skeletons", completed: true },
      { id: "cl-58", label: "Implement components", completed: true },
      { id: "cl-59", label: "Add to all pages", completed: true },
    ],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "card-19",
    title: "Fix login redirect bug",
    description: "Users not redirected after successful login",
    priority: "high",
    assignee: TEAM_MEMBERS[0],
    tags: [AVAILABLE_TAGS[0], AVAILABLE_TAGS[3]],
    dueDate: getRandomDate(-3),
    attachmentCount: 0,
    commentCount: 5,
    checklist: [
      { id: "cl-60", label: "Reproduce bug", completed: true },
      { id: "cl-61", label: "Fix logic", completed: true },
      { id: "cl-62", label: "Test all scenarios", completed: true },
      { id: "cl-63", label: "Deploy hotfix", completed: true },
    ],
    createdAt: new Date("2024-01-22"),
  },
  {
    id: "card-20",
    title: "Implement rate limiting",
    description: "Prevent API abuse",
    priority: "high",
    assignee: TEAM_MEMBERS[1],
    tags: [AVAILABLE_TAGS[3], AVAILABLE_TAGS[7]],
    dueDate: getRandomDate(-1),
    attachmentCount: 2,
    commentCount: 8,
    checklist: [
      { id: "cl-64", label: "Research solutions", completed: true },
      { id: "cl-65", label: "Implement middleware", completed: true },
      { id: "cl-66", label: "Add monitoring", completed: true },
      { id: "cl-67", label: "Document limits", completed: true },
    ],
    createdAt: new Date("2024-01-04"),
  },
  {
    id: "card-21",
    title: "Create component library",
    description: "Reusable UI components with Storybook",
    priority: "medium",
    assignee: TEAM_MEMBERS[2],
    tags: [AVAILABLE_TAGS[4], AVAILABLE_TAGS[5]],
    dueDate: getRandomDate(-4),
    attachmentCount: 12,
    commentCount: 14,
    checklist: [
      { id: "cl-68", label: "Set up Storybook", completed: true },
      { id: "cl-69", label: "Document components", completed: true },
      { id: "cl-70", label: "Add examples", completed: true },
      { id: "cl-71", label: "Deploy docs", completed: true },
    ],
    createdAt: new Date("2024-01-02"),
  },
]

const INITIAL_COLUMNS: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    cards: INITIAL_CARDS.filter((c) => ["card-1", "card-2", "card-3", "card-4"].includes(c.id)),
  },
  {
    id: "todo",
    title: "To Do",
    cards: INITIAL_CARDS.filter((c) => ["card-5", "card-6", "card-7", "card-8"].includes(c.id)),
    limit: 5,
  },
  {
    id: "in-progress",
    title: "In Progress",
    cards: INITIAL_CARDS.filter((c) => ["card-9", "card-10", "card-11", "card-12"].includes(c.id)),
    limit: 4,
  },
  {
    id: "review",
    title: "Review",
    cards: INITIAL_CARDS.filter((c) => ["card-13", "card-14", "card-15"].includes(c.id)),
  },
  {
    id: "done",
    title: "Done",
    cards: INITIAL_CARDS.filter((c) =>
      ["card-16", "card-17", "card-18", "card-19", "card-20", "card-21"].includes(c.id)
    ),
  },
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case "high":
      return "text-red-600 dark:text-red-400 border-red-500/50 bg-red-500/10"
    case "medium":
      return "text-amber-600 dark:text-amber-400 border-amber-500/50 bg-amber-500/10"
    case "low":
      return "text-primary border-primary/50 bg-primary/10"
  }
}

const isOverdue = (dueDate: Date | null): boolean => {
  if (!dueDate) return false
  return dueDate < new Date()
}

const getDueDateColor = (dueDate: Date | null): string => {
  if (!dueDate) return "text-muted-foreground"
  if (isOverdue(dueDate)) return "text-red-600 dark:text-red-400"

  const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  if (daysUntilDue <= 3) return "text-amber-600 dark:text-amber-400"

  return "text-muted-foreground"
}

const formatDate = (date: Date): string => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return "Today"
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const calculateChecklistProgress = (checklist: ChecklistItem[]): number => {
  if (checklist.length === 0) return 0
  const completed = checklist.filter((item) => item.completed).length
  return (completed / checklist.length) * 100
}

// ============================================================================
// KANBAN CARD COMPONENT
// ============================================================================

interface KanbanCardProps {
  card: KanbanCard
  onEdit: (card: KanbanCard) => void
  onDelete: (cardId: string) => void
}

const KanbanCardComponent: React.FC<KanbanCardProps> = ({ card, onEdit, onDelete }) => {
  const checklistProgress = calculateChecklistProgress(card.checklist)
  const dueDateColor = getDueDateColor(card.dueDate)
  const overdueFlag = isOverdue(card.dueDate)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className="glass border-border/40 p-4 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1 leading-tight">{card.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{card.description}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(card)}>
                <Edit2 className="h-3 w-3 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-3 w-3 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="h-3 w-3 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="h-3 w-3 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                onClick={() => onDelete(card.id)}
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tags */}
        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {card.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-5"
                style={{
                  borderColor: tag.color,
                  color: tag.color,
                  backgroundColor: `${tag.color}10`,
                }}
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Checklist Progress */}
        {card.checklist.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CheckSquare className="h-3 w-3" />
                <span>
                  {card.checklist.filter((i) => i.completed).length}/{card.checklist.length}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{Math.round(checklistProgress)}%</span>
            </div>
            <Progress value={checklistProgress} className="h-1" />
          </div>
        )}

        {/* Card Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Priority Badge */}
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${getPriorityColor(card.priority)}`}>
              <Flag className="h-2.5 w-2.5 mr-1" />
              {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
            </Badge>

            {/* Due Date */}
            {card.dueDate && (
              <div className={`flex items-center gap-1 text-xs ${dueDateColor}`}>
                {overdueFlag && <AlertCircle className="h-3 w-3" />}
                <Calendar className="h-3 w-3" />
                <span>{formatDate(card.dueDate)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Attachments */}
            {card.attachmentCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Paperclip className="h-3 w-3" />
                <span>{card.attachmentCount}</span>
              </div>
            )}

            {/* Comments */}
            {card.commentCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                <span>{card.commentCount}</span>
              </div>
            )}

            {/* Assignee Avatar */}
            <Avatar className="h-6 w-6 border-2" style={{ borderColor: card.assignee.color }}>
              <AvatarImage src={card.assignee.avatar} alt={card.assignee.name} />
              <AvatarFallback className="text-xs">
                {card.assignee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// ============================================================================
// KANBAN COLUMN COMPONENT
// ============================================================================

interface KanbanColumnProps {
  column: Column
  onCardsReorder: (columnId: CardStatus, newCards: KanbanCard[]) => void
  onEditCard: (card: KanbanCard) => void
  onDeleteCard: (cardId: string) => void
  onAddCard: (columnId: CardStatus) => void
  onDeleteColumn: (columnId: CardStatus) => void
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onCardsReorder,
  onEditCard,
  onDeleteCard,
  onAddCard,
  onDeleteColumn,
}) => {
  const isAtLimit = column.limit && column.cards.length >= column.limit

  return (
    <div className="flex flex-col min-w-[min(280px,calc(100vw-2rem))] max-w-[280px] md:min-w-[320px] md:max-w-[320px] h-[calc(100vh-320px)] md:h-[calc(100vh-280px)]">
      {/* Column Header */}
      <div className="glass border-border/40 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">{column.title}</h2>
            <Badge variant="secondary" className="text-xs h-5">
              {column.cards.length}
              {column.limit && ` / ${column.limit}`}
            </Badge>
            {isAtLimit && (
              <AlertCircle className="h-4 w-4 text-amber-500" />
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAddCard(column.id)}>
                <Plus className="h-3 w-3 mr-2" />
                Add Card
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-3 w-3 mr-2" />
                Column Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="h-3 w-3 mr-2" />
                Archive All Cards
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => onDeleteColumn(column.id)}
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 scrollbar-visible">
        <Reorder.Group
          axis="y"
          values={column.cards}
          onReorder={(newCards) => onCardsReorder(column.id, newCards)}
          className="space-y-3"
        >
          <AnimatePresence>
            {column.cards.map((card) => (
              <Reorder.Item key={card.id} value={card} className="list-none">
                <KanbanCardComponent card={card} onEdit={onEditCard} onDelete={onDeleteCard} />
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>

        {/* Empty State */}
        {column.cards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass border-border/40 border-dashed rounded-lg p-8 text-center"
          >
            <div className="text-muted-foreground text-sm">No cards yet</div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => onAddCard(column.id)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Card
            </Button>
          </motion.div>
        )}
      </div>

      {/* Add Card Button */}
      <Button
        variant="ghost"
        className="w-full mt-3 border border-dashed border-border/40 hover:border-primary/50"
        onClick={() => onAddCard(column.id)}
        disabled={!!isAtLimit}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Card
      </Button>
    </div>
  )
}

// ============================================================================
// ADD CARD DIALOG
// ============================================================================

interface AddCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  columnId: CardStatus | null
  onAddCard: (columnId: CardStatus, card: Omit<KanbanCard, "id" | "createdAt">) => void
  editCard?: KanbanCard | null
  onUpdateCard?: (card: KanbanCard) => void
}

const AddCardDialog: React.FC<AddCardDialogProps> = ({
  open,
  onOpenChange,
  columnId,
  onAddCard,
  editCard,
  onUpdateCard,
}) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [assignee, setAssignee] = useState<TeamMember>(TEAM_MEMBERS[0])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [dueDate, setDueDate] = useState("")
  const [attachmentCount, setAttachmentCount] = useState(0)
  const [commentCount, setCommentCount] = useState(0)

  // Populate form when editing
  React.useEffect(() => {
    if (editCard) {
      setTitle(editCard.title)
      setDescription(editCard.description)
      setPriority(editCard.priority)
      setAssignee(editCard.assignee)
      setSelectedTags(editCard.tags)
      setDueDate(editCard.dueDate ? editCard.dueDate.toISOString().split("T")[0] : "")
      setAttachmentCount(editCard.attachmentCount)
      setCommentCount(editCard.commentCount)
    } else {
      // Reset form
      setTitle("")
      setDescription("")
      setPriority("medium")
      setAssignee(TEAM_MEMBERS[0])
      setSelectedTags([])
      setDueDate("")
      setAttachmentCount(0)
      setCommentCount(0)
    }
  }, [editCard, open])

  const handleSubmit = () => {
    if (!title.trim() || !columnId) return

    const cardData = {
      title,
      description,
      priority,
      assignee,
      tags: selectedTags,
      dueDate: dueDate ? new Date(dueDate) : null,
      attachmentCount,
      commentCount,
      checklist: [],
    }

    if (editCard && onUpdateCard) {
      onUpdateCard({
        ...editCard,
        ...cardData,
      })
    } else {
      onAddCard(columnId, cardData)
    }

    onOpenChange(false)
  }

  const toggleTag = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.find((t) => t.id === tag.id) ? prev.filter((t) => t.id !== tag.id) : [...prev, tag]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editCard ? "Edit Card" : "Add New Card"}</DialogTitle>
          <DialogDescription>
            {editCard ? "Update the card details below" : "Create a new card for your board"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter card title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter card description..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Flag className="h-3 w-3 text-red-500" />
                      High
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Flag className="h-3 w-3 text-amber-500" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Flag className="h-3 w-3 text-primary" />
                      Low
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assignee */}
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={assignee.id} onValueChange={(id) => setAssignee(TEAM_MEMBERS.find((m) => m.id === id)!)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_MEMBERS.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-[10px]">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = selectedTags.find((t) => t.id === tag.id)
                return (
                  <Badge
                    key={tag.id}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    style={
                      isSelected
                        ? {
                            backgroundColor: tag.color,
                            borderColor: tag.color,
                            color: "white",
                          }
                        : {
                            borderColor: tag.color,
                            color: tag.color,
                            backgroundColor: `${tag.color}10`,
                          }
                    }
                    onClick={() => toggleTag(tag)}
                  >
                    {tag.label}
                  </Badge>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Attachment Count (for demo purposes) */}
            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments</Label>
              <Input
                id="attachments"
                type="number"
                min="0"
                value={attachmentCount}
                onChange={(e) => setAttachmentCount(parseInt(e.target.value) || 0)}
              />
            </div>

            {/* Comment Count (for demo purposes) */}
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Input
                id="comments"
                type="number"
                min="0"
                value={commentCount}
                onChange={(e) => setCommentCount(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            {editCard ? "Update Card" : "Create Card"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// MAIN KANBAN BOARD COMPONENT
// ============================================================================

export default function KanbanBoard() {
  // State
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all")
  const [filterAssignee, setFilterAssignee] = useState<string>("all")
  const [filterTag, setFilterTag] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "created">("priority")
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false)
  const [selectedColumnForNewCard, setSelectedColumnForNewCard] = useState<CardStatus | null>(null)
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort cards
  const filteredColumns = useMemo(() => {
    return columns.map((column) => {
      let filteredCards = [...column.cards]

      // Search filter
      if (searchQuery) {
        filteredCards = filteredCards.filter(
          (card) =>
            card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // Priority filter
      if (filterPriority !== "all") {
        filteredCards = filteredCards.filter((card) => card.priority === filterPriority)
      }

      // Assignee filter
      if (filterAssignee !== "all") {
        filteredCards = filteredCards.filter((card) => card.assignee.id === filterAssignee)
      }

      // Tag filter
      if (filterTag !== "all") {
        filteredCards = filteredCards.filter((card) => card.tags.some((tag) => tag.id === filterTag))
      }

      // Sort cards
      filteredCards.sort((a, b) => {
        switch (sortBy) {
          case "dueDate":
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return a.dueDate.getTime() - b.dueDate.getTime()
          case "priority":
            const priorityOrder = { high: 0, medium: 1, low: 2 }
            return priorityOrder[a.priority] - priorityOrder[b.priority]
          case "created":
            return b.createdAt.getTime() - a.createdAt.getTime()
          default:
            return 0
        }
      })

      return {
        ...column,
        cards: filteredCards,
      }
    })
  }, [columns, searchQuery, filterPriority, filterAssignee, filterTag, sortBy])

  // Handlers
  const handleCardsReorder = (columnId: CardStatus, newCards: KanbanCard[]) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, cards: newCards } : col))
    )
  }

  const handleAddCard = (columnId: CardStatus, cardData: Omit<KanbanCard, "id" | "createdAt">) => {
    const newCard: KanbanCard = {
      ...cardData,
      id: `card-${Date.now()}`,
      createdAt: new Date(),
    }

    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
      )
    )
  }

  const handleUpdateCard = (updatedCard: KanbanCard) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
      }))
    )
    setEditingCard(null)
  }

  const handleDeleteCard = (cardId: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      }))
    )
  }

  const handleEditCard = (card: KanbanCard) => {
    setEditingCard(card)
    // Find which column this card is in
    const column = columns.find((col) => col.cards.some((c) => c.id === card.id))
    if (column) {
      setSelectedColumnForNewCard(column.id)
      setIsAddCardDialogOpen(true)
    }
  }

  const handleOpenAddCardDialog = (columnId: CardStatus) => {
    setSelectedColumnForNewCard(columnId)
    setEditingCard(null)
    setIsAddCardDialogOpen(true)
  }

  const handleDeleteColumn = (columnId: CardStatus) => {
    setColumns((prev) => prev.filter((col) => col.id !== columnId))
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    setFilterPriority("all")
    setFilterAssignee("all")
    setFilterTag("all")
    setSortBy("priority")
  }

  const activeFiltersCount = [
    searchQuery !== "",
    filterPriority !== "all",
    filterAssignee !== "all",
    filterTag !== "all",
  ].filter(Boolean).length

  // Calculate statistics
  const totalCards = columns.reduce((acc, col) => acc + col.cards.length, 0)
  const overdueCards = columns.reduce(
    (acc, col) => acc + col.cards.filter((card) => isOverdue(card.dueDate)).length,
    0
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/40 glass">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold terminal-glow mb-2 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Project Management Board</h1>
              <p className="text-muted-foreground">
                Organize and track your team's work with drag-and-drop simplicity
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4 px-4 py-2 glass rounded-lg border border-border/40">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm font-semibold">{totalCards}</div>
                    <div className="text-xs text-muted-foreground">Total Cards</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-border/40" />
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="text-sm font-semibold">{overdueCards}</div>
                    <div className="text-xs text-muted-foreground">Overdue</div>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Sort by Priority</SelectItem>
                  <SelectItem value="dueDate">Sort by Due Date</SelectItem>
                  <SelectItem value="created">Sort by Created</SelectItem>
                </SelectContent>
              </Select>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                  <RotateCcw className="h-3 w-3 mr-2" />
                  Reset
                </Button>
              )}
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="glass rounded-lg border border-border/40 p-4">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Priority Filter */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Priority</Label>
                        <Select
                          value={filterPriority}
                          onValueChange={(v) => setFilterPriority(v as Priority | "all")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Assignee Filter */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Assignee</Label>
                        <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Members</SelectItem>
                            {TEAM_MEMBERS.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Tag Filter */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Tag</Label>
                        <Select value={filterTag} onValueChange={setFilterTag}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Tags</SelectItem>
                            {AVAILABLE_TAGS.map((tag) => (
                              <SelectItem key={tag.id} value={tag.id}>
                                {tag.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="w-full px-4 py-4 md:py-8">
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-visible touch-pan-x overscroll-x-contain">
          {filteredColumns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onCardsReorder={handleCardsReorder}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
              onAddCard={handleOpenAddCardDialog}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}

          {/* Add Column Button */}
          <div className="flex flex-col min-w-[280px] max-w-[280px] md:min-w-[320px] md:max-w-[320px] h-[calc(100vh-320px)] md:h-[calc(100vh-280px)]">
            <Button
              variant="outline"
              className="w-full h-24 border-dashed border-border/40 hover:border-primary/50"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Column
            </Button>
          </div>
        </div>
      </div>

      {/* Add/Edit Card Dialog */}
      <AddCardDialog
        open={isAddCardDialogOpen}
        onOpenChange={setIsAddCardDialogOpen}
        columnId={selectedColumnForNewCard}
        onAddCard={handleAddCard}
        editCard={editingCard}
        onUpdateCard={handleUpdateCard}
      />
    </div>
  )
}

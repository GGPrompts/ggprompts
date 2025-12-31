// lib/constants/categories.ts
// Shared category definitions for prompts

import {
  Code,
  Palette,
  Lightbulb,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Bot,
  BarChart,
  Search,
  Terminal,
  Columns,
  LucideIcon,
} from 'lucide-react'

export interface Category {
  name: string
  value: string
  icon: LucideIcon
  description?: string
}

export const CATEGORIES: Category[] = [
  {
    name: 'Development',
    value: 'development-code',
    icon: Code,
    description: 'Code, debugging, and software development',
  },
  {
    name: 'Creative',
    value: 'creative-marketing',
    icon: Palette,
    description: 'Marketing, design, and creative projects',
  },
  {
    name: 'Productivity',
    value: 'productivity-workflow',
    icon: Lightbulb,
    description: 'Workflow optimization and productivity',
  },
  {
    name: 'Business',
    value: 'business-strategy',
    icon: Briefcase,
    description: 'Strategy, planning, and business operations',
  },
  {
    name: 'Education',
    value: 'learning-education',
    icon: GraduationCap,
    description: 'Learning, teaching, and educational content',
  },
  {
    name: 'Writing',
    value: 'writing-content',
    icon: MessageSquare,
    description: 'Content creation and writing assistance',
  },
  {
    name: 'Agents',
    value: 'agents',
    icon: Bot,
    description: 'Claude Code agents, custom AI personas, and specialized assistants',
  },
  {
    name: 'Data Analysis',
    value: 'data-analysis',
    icon: BarChart,
    description: 'Data processing and analytical tasks',
  },
  {
    name: 'Research',
    value: 'research-discovery',
    icon: Search,
    description: 'Research, discovery, and exploration',
  },
  {
    name: 'TabzChrome',
    value: 'tabzchrome',
    icon: Terminal,
    description: 'Terminal workflows, MCP automation, and TabzChrome integrations',
  },
  {
    name: 'Tmux',
    value: 'tmux',
    icon: Columns,
    description: 'Tmux sessions, panes, send-keys automation, and multi-terminal workflows',
  },
]

// Helper to get category by value
export function getCategoryByValue(value: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.value === value)
}

// Helper to get category name by value
export function getCategoryName(value: string): string {
  return getCategoryByValue(value)?.name || value
}

// Category values as a type for type safety
export type CategoryValue = (typeof CATEGORIES)[number]['value']

import { AgentCard } from './AgentCard'
import type { Agent } from './AgentCard'

export { AgentCard }
export type { Agent }

// Sample agents for demo/testing
export const sampleAgents: Agent[] = [
  {
    id: '1',
    name: 'code-reviewer',
    description: 'Expert code review for security, performance, and maintainability. Use after writing significant code or before merging changes.',
    tools: ['Read', 'Grep', 'Glob', 'Bash'],
    model: 'sonnet',
    pattern: 'reviewer',
    author: 'claude',
  },
  {
    id: '2',
    name: 'researcher',
    description: 'Research and analyze information without making changes. Use for codebase exploration, documentation lookup, and information synthesis.',
    tools: ['Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch'],
    model: 'sonnet',
    pattern: 'researcher',
    author: 'claude',
  },
  {
    id: '3',
    name: 'quick-search',
    description: 'Fast responses for simple questions and lookups. Use for quick searches, simple explanations, and file lookups.',
    tools: ['Read', 'Grep', 'Glob'],
    model: 'haiku',
    pattern: 'quick',
    author: 'claude',
  },
  {
    id: '4',
    name: 'frontend-dev',
    description: 'Frontend development specialist for React, Next.js, and modern web. Use for UI components, styling, and client-side logic.',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob', 'Bash'],
    model: 'sonnet',
    pattern: 'specialist',
    author: 'claude',
  },
  {
    id: '5',
    name: 'orchestrator',
    description: 'Coordinates complex multi-step tasks by delegating to specialized sub-agents. Use for large features or tasks requiring multiple specialists.',
    tools: ['Read', 'Grep', 'Glob', 'Task', 'TodoWrite'],
    model: 'opus',
    pattern: 'orchestrator',
    author: 'claude',
  },
  {
    id: '6',
    name: 'prompt-engineer',
    description: 'Craft and refine prompts for AI systems. Use for creating system prompts, agent definitions, or optimizing existing prompts.',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob', 'WebSearch'],
    model: 'opus',
    pattern: 'specialist',
    author: 'claude',
  },
]

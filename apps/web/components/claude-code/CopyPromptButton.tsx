'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

// Detect target AI tool from file content
type TargetTool = 'claude' | 'codex' | 'gemini' | 'aider' | 'universal'

function detectTargetTool(files: { path: string; content: string }[]): TargetTool {
  const content = files.map(f => f.content).join('\n').toLowerCase()

  // Check frontmatter model field first
  const modelMatch = content.match(/^---[\s\S]*?model:\s*(\w+)[\s\S]*?---/m)
  if (modelMatch) {
    const model = modelMatch[1].toLowerCase()
    if (['haiku', 'sonnet', 'opus', 'claude'].some(m => model.includes(m))) {
      return 'claude'
    }
    if (['codex', 'gpt', 'openai', 'o1', 'o3'].some(m => model.includes(m))) {
      return 'codex'
    }
    if (['gemini', 'google', 'bard'].some(m => model.includes(m))) {
      return 'gemini'
    }
  }

  // Check content for tool-specific patterns
  if (content.includes('claude code') || content.includes('claude --agent') || content.includes('~/.claude/')) {
    return 'claude'
  }
  if (content.includes('codex') || content.includes('openai codex')) {
    return 'codex'
  }
  if (content.includes('gemini') || content.includes('google ai')) {
    return 'gemini'
  }
  if (content.includes('aider')) {
    return 'aider'
  }

  return 'universal'
}

interface CopyPromptButtonProps {
  componentName: string
  componentType: string
  description: string | null
  files: { path: string; content: string }[]
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
}

export function CopyPromptButton({
  componentName,
  componentType,
  description,
  files,
  size = 'sm',
  variant = 'outline'
}: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false)

  const targetTool = detectTargetTool(files)
  const slug = componentName.toLowerCase().replace(/\s+/g, '-')

  const generatePrompt = () => {
    const typeLabel = componentType === 'skill' ? 'skill' :
                      componentType === 'command' ? 'slash command' :
                      componentType === 'agent' ? 'agent' :
                      componentType === 'hook' ? 'hook' : 'component'

    const toolLabel = targetTool === 'claude' ? 'Claude Code' :
                      targetTool === 'codex' ? 'Codex' :
                      targetTool === 'gemini' ? 'Gemini' :
                      targetTool === 'aider' ? 'Aider' : 'your AI coding assistant'

    let prompt = `Create the following ${typeLabel} for ${toolLabel}:\n\n`
    prompt += `## ${componentName}\n`

    if (description) {
      prompt += `Purpose: ${description}\n\n`
    }

    // Include the content of each file
    files.forEach((file) => {
      if (files.length > 1) {
        prompt += `### File: ${file.path}\n`
      }
      prompt += '```\n'
      prompt += file.content
      prompt += '\n```\n\n'
    })

    // Add installation instructions based on target tool
    prompt += `---\n\n`
    prompt += `**Installation Instructions:**\n`

    if (targetTool === 'claude') {
      // Claude Code specific instructions
      if (componentType === 'skill') {
        prompt += `1. Create the folder: \`~/.claude/skills/${slug}/\`\n`
        prompt += `2. Save the content above as \`SKILL.md\` in that folder\n`
        prompt += `3. Restart Claude Code to load the skill\n`
      } else if (componentType === 'command') {
        prompt += `1. Create the file: \`~/.claude/commands/${slug}.md\`\n`
        prompt += `2. Save the content above in that file\n`
        prompt += `3. Use with \`/${slug}\` in Claude Code\n`
      } else if (componentType === 'agent') {
        prompt += `1. Create the folder: \`~/.claude/agents/${slug}/\`\n`
        prompt += `2. Save the content above as \`${slug}.md\` in that folder\n`
        prompt += `3. Run with \`claude --agent ${slug}\`\n`
      } else if (componentType === 'hook') {
        prompt += `1. Add the hook configuration to your \`~/.claude/settings.json\`\n`
        prompt += `2. Save any script files to your preferred location\n`
        prompt += `3. Restart Claude Code to activate the hook\n`
      }
    } else if (targetTool === 'codex') {
      // OpenAI Codex instructions
      prompt += `1. Save the content above as \`${slug}.md\` in your agents folder\n`
      prompt += `2. Configure your Codex CLI to use this agent\n`
      prompt += `3. Run with \`codex --agent ${slug}\` or similar command\n`
    } else if (targetTool === 'gemini') {
      // Gemini instructions
      prompt += `1. Save the content above as \`${slug}.md\`\n`
      prompt += `2. Use with Gemini CLI or Google AI Studio\n`
      prompt += `3. Reference the file when starting a new session\n`
    } else if (targetTool === 'aider') {
      // Aider instructions
      prompt += `1. Save the content above as \`${slug}.md\`\n`
      prompt += `2. Use with \`aider --read ${slug}.md\` to load as context\n`
      prompt += `3. Or add to your \`.aider.conf.yml\` read list\n`
    } else {
      // Universal/generic instructions
      prompt += `This agent can be used with multiple AI coding assistants:\n\n`
      prompt += `**Claude Code:**\n`
      prompt += `- Save to \`~/.claude/agents/${slug}/${slug}.md\`\n`
      prompt += `- Run with \`claude --agent ${slug}\`\n\n`
      prompt += `**Codex:**\n`
      prompt += `- Save to your agents folder and run with \`codex --agent ${slug}\`\n\n`
      prompt += `**Aider:**\n`
      prompt += `- Save and use with \`aider --read ${slug}.md\`\n\n`
      prompt += `**Other tools:**\n`
      prompt += `- Copy the content and paste as system prompt or context\n`
    }

    return prompt
  }

  const handleCopy = async () => {
    const prompt = generatePrompt()

    const toolLabel = targetTool === 'claude' ? 'Claude Code' :
                      targetTool === 'codex' ? 'Codex' :
                      targetTool === 'gemini' ? 'Gemini' :
                      targetTool === 'aider' ? 'Aider' : 'multi-tool'

    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      toast.success('Setup prompt copied!', {
        description: targetTool === 'universal'
          ? 'Includes instructions for Claude Code, Codex, and Aider'
          : `Configured for ${toolLabel}`
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleCopy}
      className="gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy Setup Prompt
        </>
      )}
    </Button>
  )
}

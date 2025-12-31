'use server'

import fs from 'fs/promises'
import path from 'path'

export async function getGenerateNewsPrompt(): Promise<string> {
  try {
    const commandPath = path.join(process.cwd(), '.claude/commands/generate-news.md')
    const content = await fs.readFile(commandPath, 'utf-8')
    return content
  } catch (error) {
    console.error('Failed to read generate-news.md:', error)
    return ''
  }
}

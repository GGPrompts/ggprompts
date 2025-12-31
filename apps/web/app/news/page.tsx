import { loadLatestNews, getAvailableDates } from '@/lib/news/loader'
import NewsPageClient from './NewsPageClient'

export const metadata = {
  title: 'AI News Digest | GGPrompts',
  description: 'Daily curated AI news for prompt engineers and AI developers. Updates on Claude Code, Gemini CLI, OpenAI Codex, and more.',
}

export default function NewsPage() {
  const news = loadLatestNews()
  const availableDates = getAvailableDates()

  return (
    <NewsPageClient
      news={news}
      availableDates={availableDates}
      currentDate={news.date}
    />
  )
}

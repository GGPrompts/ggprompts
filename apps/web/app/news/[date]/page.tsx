import { notFound, redirect } from 'next/navigation'
import { loadNewsByDate, getAvailableDates, loadLatestNews } from '@/lib/news/loader'
import NewsPageClient from '../NewsPageClient'

interface Props {
  params: Promise<{ date: string }>
}

export async function generateMetadata({ params }: Props) {
  const { date } = await params
  const news = loadNewsByDate(date)

  if (!news) {
    return {
      title: 'News Not Found | GGPrompts',
    }
  }

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return {
    title: `AI News - ${formattedDate} | GGPrompts`,
    description: `AI news digest for ${formattedDate}. ${news.hero.headline}`,
  }
}

export default async function NewsDatePage({ params }: Props) {
  const { date } = await params
  const availableDates = getAvailableDates()

  // Validate date format
  if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    notFound()
  }

  // If this is the latest date, redirect to /news
  const latestNews = loadLatestNews()
  if (date === latestNews.date) {
    redirect('/news')
  }

  const news = loadNewsByDate(date)

  if (!news) {
    notFound()
  }

  return (
    <NewsPageClient
      news={news}
      availableDates={availableDates}
      currentDate={date}
    />
  )
}

// Generate static params for all available dates
export async function generateStaticParams() {
  const dates = getAvailableDates()
  return dates.map((date) => ({ date }))
}

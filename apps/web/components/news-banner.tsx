import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Newspaper, ArrowRight } from 'lucide-react'
import latestNews from '@/lib/news/data/latest.json'

export function NewsBanner() {
  const { hero, pulse, date } = latestNews

  // Format date for display
  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  // Take first 3 topics
  const topics = pulse.topTopics.slice(0, 3)

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <Link href="/news" className="block">
          <div className="glass border border-border/50 hover:border-primary/30 transition-all rounded-xl p-4 md:p-6 group">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Left: Icon + Label */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <Newspaper className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">Today in AI</span>
                  <span className="text-xs text-muted-foreground">{displayDate}</span>
                </div>
              </div>

              {/* Center: Headline + Topics */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 md:line-clamp-2 mb-2">
                  {hero.headline}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <Badge
                      key={topic}
                      variant="secondary"
                      className="text-xs bg-secondary/50 hover:bg-secondary/70"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Right: CTA */}
              <div className="flex items-center gap-2 text-sm font-medium text-primary shrink-0">
                <span className="hidden sm:inline">Read digest</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}

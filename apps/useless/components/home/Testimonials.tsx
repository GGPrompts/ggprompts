'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@ggprompts/ui'
import { Button } from '@ggprompts/ui'
import { cn } from '@ggprompts/ui'

const testimonials = [
  {
    id: 1,
    name: 'Karen M.',
    avatar: '👩‍💼',
    rating: 5,
    quote: "I've never felt more accomplished doing absolutely nothing. The product exceeded my lowest expectations.",
    product: 'Invisible Socks™',
    verified: true,
  },
  {
    id: 2,
    name: 'Dave T.',
    avatar: '👨‍🔧',
    rating: 5,
    quote: "The Invisible Socks exceeded my expectations by being exactly as invisible as promised. I can't even find them.",
    product: 'Invisible Socks™',
    verified: true,
  },
  {
    id: 3,
    name: 'Alex K.',
    avatar: '👩‍🍳',
    rating: 5,
    quote: "My Self-Aware Toaster judged my breakfast choices and honestly? It was right. I needed that reality check.",
    product: 'Self-Aware Toaster 3000',
    verified: true,
  },
  {
    id: 4,
    name: 'Jordan P.',
    avatar: '🧑‍💻',
    rating: 1,
    quote: "1 star because it works exactly as described. I don't know what I expected. This is on me.",
    product: 'WiFi-Enabled Rock',
    verified: true,
  },
  {
    id: 5,
    name: 'Sandra L.',
    avatar: '👩‍🎨',
    rating: 5,
    quote: "The 'K' Watch has improved my relationships by ending conversations 73% faster. My friends hate it. 10/10.",
    product: 'The "K" Watch',
    verified: true,
  },
  {
    id: 6,
    name: 'Mike R.',
    avatar: '👨‍💼',
    rating: 5,
    quote: "Bought this for my ex. It was the perfect gift because it's completely useless. Just like our relationship was.",
    product: 'Emotional Support Void',
    verified: true,
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const current = testimonials[currentIndex]

  const next = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const prev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">What Our Customers Say</h2>
          <p className="text-muted-foreground">Real reviews from real people with questionable judgment</p>
        </div>

        <Card className="glass relative overflow-hidden border-primary/20 p-8 md:p-12">
          {/* Decorative quote marks */}
          <Quote className="absolute left-6 top-6 h-12 w-12 text-primary/10" />
          <Quote className="absolute bottom-6 right-6 h-12 w-12 rotate-180 text-primary/10" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              {/* Rating */}
              <div className="mb-6 flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < current.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground/30'
                    )}
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-8 text-center text-xl font-medium leading-relaxed md:text-2xl">
                "{current.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-2xl">
                  {current.avatar}
                </div>
                <div className="text-center">
                  <div className="font-semibold">{current.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {current.verified && (
                      <span className="mr-2 text-primary">✓ Verified Purchase</span>
                    )}
                    <span className="italic">— {current.product}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlaying(false)
                    setCurrentIndex(idx)
                  }}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    idx === currentIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  )}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}

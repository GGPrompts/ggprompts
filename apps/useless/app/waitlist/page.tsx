'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Mail,
  CheckCircle,
  Users,
  Sparkles,
  Clock,
  Bell,
  X,
  ArrowRight,
  Rocket,
} from 'lucide-react'
import { Button } from '@ggprompts/ui'
import { Card } from '@ggprompts/ui'
import { Badge } from '@ggprompts/ui'
import { Input } from '@ggprompts/ui'
import { Checkbox } from '@ggprompts/ui'
import Link from 'next/link'

// Countdown Timer
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 md:gap-6">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass border-primary/20 p-3 md:p-6 text-center">
            <div className="text-2xl md:text-4xl font-mono font-bold text-primary mb-1">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {unit.label}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

// Animated Counter
function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / 2000, 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          requestAnimationFrame(animateCount)
        }
      }
      requestAnimationFrame(animateCount)
    }
  }, [inView, end])

  return (
    <span ref={ref} className="text-primary font-bold">
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

// Success Modal
function SuccessModal({
  isOpen,
  onClose,
  position,
}: {
  isOpen: boolean
  onClose: () => void
  position: number
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <Card className="glass border-primary/30 p-8 text-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute right-4 top-4"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20"
              >
                <CheckCircle className="h-10 w-10 text-primary" />
              </motion.div>

              <h3 className="mb-2 text-2xl font-bold">You've Made a Terrible Decision!</h3>
              <p className="mb-2 text-muted-foreground">
                You're #{position.toLocaleString()} in line to waste your money
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                We'll email you when new useless products drop so you can regret those too.
              </p>

              <Button onClick={onClose} className="w-full">
                I Accept My Fate
              </Button>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Upcoming Products
const upcomingProducts = [
  {
    name: 'WiFi-Enabled Pet Rock 2.0',
    tagline: 'Now with cloud connectivity. Still does nothing.',
    emoji: '🪨',
    eta: 'Q1 2025',
  },
  {
    name: 'Self-Deprecating Mirror',
    tagline: "Shows your reflection and sighs disappointedly.",
    emoji: '🪞',
    eta: 'Q2 2025',
  },
  {
    name: 'Quantum Uncertainty Dice',
    tagline: "Results exist in superposition until you look. Then it's always a 1.",
    emoji: '🎲',
    eta: 'Maybe',
  },
]

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [notifyOnLaunch, setNotifyOnLaunch] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [waitlistCount, setWaitlistCount] = useState(12847)

  // Launch date (30 days from now)
  const launchDate = new Date()
  launchDate.setDate(launchDate.getDate() + 30)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.includes('@')) {
      setWaitlistCount((prev) => prev + 1)
      setIsSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Glow effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 md:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
              <Sparkles className="mr-1 h-3 w-3" />
              Coming Soon™ (Probably)
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
              <span className="gradient-text-theme">
                Be First to Waste Your Money
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Get notified when we release more things you don't need.
              Early access to maximum regret. Limited spots available.*
            </p>
            <p className="mb-12 text-xs text-muted-foreground">
              *Not actually limited. We'll take anyone.
            </p>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12 flex items-center justify-center gap-2"
            >
              <Users className="h-5 w-5 text-primary" />
              <span className="text-lg">
                Join <AnimatedCounter end={waitlistCount} suffix="+" /> other poor decision makers
              </span>
            </motion.div>

            {/* Countdown */}
            <div className="mb-12">
              <div className="mb-6 flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm uppercase tracking-wider text-muted-foreground">
                  Next Product Drop In
                </span>
              </div>
              <CountdownTimer targetDate={launchDate} />
            </div>

            {/* Email Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mx-auto max-w-md"
            >
              <Card className="glass border-primary/20 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-10"
                      required
                      aria-label="Email address"
                    />
                  </div>

                  <div className="flex items-start gap-2 text-left">
                    <Checkbox
                      id="notify"
                      checked={notifyOnLaunch}
                      onCheckedChange={(checked) => setNotifyOnLaunch(checked as boolean)}
                    />
                    <label
                      htmlFor="notify"
                      className="cursor-pointer text-sm text-muted-foreground"
                    >
                      Yes, spam me with products I'll regret not buying
                    </label>
                  </div>

                  <Button type="submit" className="h-12 w-full text-lg" disabled={!email}>
                    Reserve My Spot in Line
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    🎁 Early birds get first dibs on disappointment
                  </p>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Products */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold">Coming Soon</h2>
            <p className="text-muted-foreground">
              Sneak peek at upcoming useless innovations
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {upcomingProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="glass group relative h-full border-primary/20 p-6 transition-all hover:border-primary/50">
                  <Badge className="absolute right-4 top-4 bg-primary/20 text-primary">
                    {product.eta}
                  </Badge>
                  <div className="mb-4 text-5xl">{product.emoji}</div>
                  <h3 className="mb-2 font-bold group-hover:text-primary">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{product.tagline}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl"
        >
          <Card className="glass border-primary/30 p-8 text-center md:p-12">
            <Bell className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Don't Miss Your Chance to Miss Out
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join the waitlist and be among the first to own things that serve no purpose.
            </p>
            <Button size="lg" asChild>
              <Link href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Rocket className="mr-2 h-5 w-5" />
                Take Me to the Top
              </Link>
            </Button>
          </Card>
        </motion.div>
      </section>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSubmitted}
        onClose={() => setIsSubmitted(false)}
        position={waitlistCount}
      />
    </div>
  )
}

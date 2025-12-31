'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Mail,
  CheckCircle,
  Users,
  Sparkles,
  Clock,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Copy,
  ChevronDown,
  Zap,
  Shield,
  TrendingUp,
  Bell,
  Gift,
  X,
  ArrowRight,
  Star,
  Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'

// Countdown Timer Component
const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
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
    { label: 'Seconds', value: timeLeft.seconds }
  ]

  return (
    <div className="grid grid-cols-4 gap-4 md:gap-6">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass p-4 md:p-6 text-center border-glow">
            <div className="text-3xl md:text-5xl font-mono font-bold terminal-glow mb-2">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
              {unit.label}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

// Animated Counter
const AnimatedCounter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
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
    <div ref={ref} className="text-4xl md:text-5xl font-bold terminal-glow">
      {count.toLocaleString()}{suffix}
    </div>
  )
}

// Success Modal
const SuccessModal = ({ isOpen, onClose, position }: { isOpen: boolean; onClose: () => void; position: number }) => {
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
            <Card className="glass p-8 text-center border-glow">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-primary" />
              </motion.div>

              <h3 className="text-2xl font-bold mb-2">You're on the list!</h3>
              <p className="text-muted-foreground mb-6">
                You're #{position.toLocaleString()} in line
              </p>

              <div className="glass p-4 rounded-lg mb-6">
                <p className="text-sm mb-2">Share your referral link to move up:</p>
                <div className="flex gap-2">
                  <Input
                    value={`https://example.com/ref/${Math.random().toString(36).substr(2, 9)}`}
                    readOnly
                    className="text-xs"
                  />
                  <Button size="sm" variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Get 3 friends to join and skip 100 spots!
                </p>
              </div>

              <Button onClick={onClose} className="w-full">
                Got it!
              </Button>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Exit Intent Popup
const ExitIntentPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
          >
            <Card className="glass p-8 relative border-glow">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute right-4 top-4"
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="text-center">
                <Gift className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">Wait! Don't miss out</h3>
                <p className="text-muted-foreground mb-6">
                  Join now and get <span className="text-primary font-bold">50% off</span> when we launch
                </p>

                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="mb-4"
                />
                <Button className="w-full mb-4">
                  Claim My Discount
                </Button>
                <p className="text-xs text-muted-foreground">
                  Limited to first 1,000 subscribers
                </p>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function WaitlistTemplate() {
  const [email, setEmail] = useState('')
  const [notifyOnLaunch, setNotifyOnLaunch] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [waitlistCount, setWaitlistCount] = useState(4782)
  const [formProgress, setFormProgress] = useState(0)

  // Launch date (30 days from now)
  const launchDate = new Date()
  launchDate.setDate(launchDate.getDate() + 30)

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isSubmitted) {
        setShowExitIntent(true)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [isSubmitted])

  // Form progress
  useEffect(() => {
    if (!email) setFormProgress(0)
    else if (email.includes('@')) setFormProgress(100)
    else setFormProgress(50)
  }, [email])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.includes('@')) {
      setWaitlistCount(prev => prev + 1)
      setIsSubmitted(true)
      // Track analytics: waitlist_signup
    }
  }

  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Built for speed and performance' },
    { icon: Shield, title: 'Secure by Default', description: 'Enterprise-grade security' },
    { icon: TrendingUp, title: 'Grow Your Business', description: '10x your productivity' },
    { icon: Sparkles, title: 'AI-Powered', description: 'Smart automation built-in' }
  ]

  const faqs = [
    {
      question: 'When will the product launch?',
      answer: 'We\'re launching in 30 days! Join the waitlist to be notified the moment we go live.'
    },
    {
      question: 'Will there be early bird pricing?',
      answer: 'Yes! Waitlist members get exclusive 50% off for the first month after launch.'
    },
    {
      question: 'Can I try it before launch?',
      answer: 'Beta testers will be selected from the waitlist. The earlier you join, the better your chances!'
    },
    {
      question: 'What happens to my data?',
      answer: 'Your email is only used for launch notifications. We never share or sell your information.'
    },
    {
      question: 'How does the referral program work?',
      answer: 'Share your unique referral link. For every 3 friends who join, you skip 100 spots in line!'
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[10%] left-[5%] w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[5%] w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 glass sticky top-0 z-40 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl">ProductName</span>
            </div>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Badge className="mb-6 px-4 py-1.5 text-sm border-glow">
              <Sparkles className="w-3 h-3 mr-2" />
              Coming Soon
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              The Future of Productivity
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of early adopters waiting for the most innovative productivity tool ever built.
            </p>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 mb-12"
            >
              <Users className="w-5 h-5 text-primary" />
              <AnimatedCounter end={waitlistCount} suffix="+" />
              <span className="text-muted-foreground">people joined</span>
            </motion.div>

            {/* Countdown */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm uppercase tracking-wider">Launching in</span>
              </div>
              <CountdownTimer targetDate={launchDate} />
            </div>

            {/* Email Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-md mx-auto"
            >
              <Card className="glass p-6 border-glow">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Progress Bar */}
                  <div className="h-1 bg-muted rounded-full overflow-hidden mb-4">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${formProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>

                  <div className="flex items-start gap-2 text-left">
                    <Checkbox
                      id="notify"
                      checked={notifyOnLaunch}
                      onCheckedChange={(checked) => setNotifyOnLaunch(checked as boolean)}
                    />
                    <label htmlFor="notify" className="text-sm text-muted-foreground cursor-pointer">
                      Notify me on launch and send exclusive early bird offers
                    </label>
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg" disabled={!email}>
                    Join the Waitlist
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    🎁 Get 50% off when we launch · No credit card required
                  </p>
                </form>
              </Card>
            </motion.div>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <p className="text-sm text-muted-foreground mb-4">Share with friends:</p>
              <div className="flex justify-center gap-4">
                {[Twitter, Linkedin, Facebook, Share2].map((Icon, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="glass"
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Product Preview */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <Card className="glass p-4 border-glow overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center cursor-pointer border-glow"
                >
                  <Star className="w-10 h-10 text-primary" />
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Join the Waitlist?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Be among the first to experience these game-changing features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass p-6 text-center h-full border-glow">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="glass border-glow rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="glass p-12 text-center border-glow">
              <Bell className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Don't Miss the Launch
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join <AnimatedCounter end={waitlistCount} suffix="+" /> others on the waitlist
              </p>
              <Button size="lg" className="text-lg px-8">
                Reserve Your Spot
                <ChevronDown className="w-5 h-5 ml-2" />
              </Button>
            </Card>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary" />
                <span className="font-bold">ProductName</span>
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <SuccessModal
        isOpen={isSubmitted}
        onClose={() => setIsSubmitted(false)}
        position={waitlistCount}
      />
      <ExitIntentPopup
        isOpen={showExitIntent}
        onClose={() => setShowExitIntent(false)}
      />
    </div>
  )
}

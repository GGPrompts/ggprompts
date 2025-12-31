'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Rocket,
  Star,
  Download,
  Play,
  CheckCircle,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Sparkles,
  Clock,
  ExternalLink,
  ChevronRight,
  Award,
  Gift,
  Timer,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  BookOpen,
  Code,
  Terminal,
  Database,
  Cloud,
  MessageSquare,
  Heart,
  Share2,
  Copy,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'

// Countdown Timer for Launch Offer
const LaunchCountdown = ({ endDate }: { endDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime()
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [endDate])

  return (
    <div className="flex gap-2 md:gap-4 justify-center">
      {[
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Sec', value: timeLeft.seconds }
      ].map((unit, index) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="glass p-2 md:p-4 rounded-lg border-glow min-w-[60px] md:min-w-[80px]">
            <div className="text-2xl md:text-4xl font-mono font-bold terminal-glow">
              {String(unit.value).padStart(2, '0')}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">{unit.label}</div>
        </div>
      ))}
    </div>
  )
}

// Animated Stats Counter
const StatsCounter = ({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) => {
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
    <div ref={ref} className="text-3xl md:text-4xl font-bold terminal-glow">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  )
}

// Product Hunt Badge
const ProductHuntBadge = () => {
  return (
    <motion.a
      href="https://www.producthunt.com"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      className="inline-block"
    >
      <Card className="glass-dark p-4 flex items-center gap-3 border-glow">
        <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <Award className="w-6 h-6 text-orange-500" />
        </div>
        <div className="text-left">
          <div className="text-xs text-muted-foreground">#1 Product of the Day</div>
          <div className="font-bold flex items-center gap-1">
            Product Hunt <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </Card>
    </motion.a>
  )
}

// Before/After Comparison
const BeforeAfter = () => {
  const [showAfter, setShowAfter] = useState(false)

  return (
    <Card className="glass-overlay p-8 border-glow">
      <div className="flex justify-center gap-4 mb-6">
        <Button
          variant={!showAfter ? 'default' : 'outline'}
          onClick={() => setShowAfter(false)}
        >
          Before
        </Button>
        <Button
          variant={showAfter ? 'default' : 'outline'}
          onClick={() => setShowAfter(true)}
        >
          After
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={showAfter ? 'after' : 'before'}
          initial={{ opacity: 0, x: showAfter ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: showAfter ? -20 : 20 }}
          className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-lg flex items-center justify-center"
        >
          {showAfter ? (
            <div className="text-center p-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">10x Faster</h3>
              <p className="text-muted-foreground">Tasks completed in seconds</p>
            </div>
          ) : (
            <div className="text-center p-8">
              <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-bold mb-2">Slow & Manual</h3>
              <p className="text-muted-foreground">Hours of repetitive work</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  )
}

export default function ProductLaunchTemplate() {
  const [copied, setCopied] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleProgress = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])

  // Launch offer ends in 48 hours
  const offerEndDate = new Date()
  offerEndDate.setHours(offerEndDate.getHours() + 48)

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const features = [
    { icon: Zap, title: 'Lightning Fast', description: '10x faster than alternatives' },
    { icon: Shield, title: 'Enterprise Security', description: 'Bank-level encryption' },
    { icon: Code, title: 'Developer Friendly', description: 'Powerful API & webhooks' },
    { icon: Cloud, title: 'Cloud Native', description: 'Scalable infrastructure' },
    { icon: Database, title: 'Smart Database', description: 'Auto-optimized queries' },
    { icon: Terminal, title: 'CLI Included', description: 'Automate everything' }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO at TechCorp',
      image: '👩‍💼',
      quote: 'This tool saved us 100+ hours per month. Absolutely game-changing!',
      rating: 5
    },
    {
      name: 'Mike Johnson',
      role: 'Founder at StartupXYZ',
      image: '👨‍💻',
      quote: 'The beta changed how we work. Now we can\'t imagine life without it.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Manager',
      image: '👩‍🔬',
      quote: 'Best investment we made this year. ROI in just 2 weeks.',
      rating: 5
    }
  ]

  const steps = [
    { number: '01', title: 'Sign Up', description: 'Create your account in 30 seconds' },
    { number: '02', title: 'Connect', description: 'Integrate with your favorite tools' },
    { number: '03', title: 'Automate', description: 'Watch the magic happen' }
  ]

  const pressMentions = [
    { name: 'TechCrunch', logo: '📰' },
    { name: 'The Verge', logo: '🌐' },
    { name: 'Wired', logo: '⚡' },
    { name: 'Forbes', logo: '💼' }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[20%] left-[10%] w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        {/* Launch Banner */}
        <div className="border-b border-primary/50 bg-primary/10 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary animate-pulse" />
                <span className="font-bold">NOW AVAILABLE</span>
                <Badge className="border-glow">Limited Launch Offer</Badge>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Offer ends in:</span>
                <LaunchCountdown endDate={offerEndDate} />
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="border-b border-border/50 glass sticky top-[60px] z-40 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl">ProductName</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                Docs
              </Button>
              <Button size="sm">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge className="px-4 py-1.5 text-sm border-glow">
                  <Star className="w-3 h-3 mr-2" />
                  Launched Today
                </Badge>

                <h1 className="text-5xl md:text-7xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  The Wait is
                  <br />
                  <span className="text-primary">Over</span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground">
                  The productivity tool 10,000+ people have been waiting for is finally here.
                </p>
              </div>

              {/* Product Hunt Badge */}
              <ProductHuntBadge />

              {/* Launch Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="glass p-4 text-center border-glow">
                  <StatsCounter end={10000} suffix="+" />
                  <div className="text-xs text-muted-foreground mt-1">Early Users</div>
                </Card>
                <Card className="glass p-4 text-center border-glow">
                  <StatsCounter end={5000} suffix="+" />
                  <div className="text-xs text-muted-foreground mt-1">Downloads</div>
                </Card>
                <Card className="glass p-4 text-center border-glow">
                  <StatsCounter end={98} suffix="%" />
                  <div className="text-xs text-muted-foreground mt-1">Satisfaction</div>
                </Card>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="text-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download Now
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              {/* Early Bird Pricing */}
              <Card className="glass-dark p-6 border-glow">
                <div className="flex items-start gap-4">
                  <Gift className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Launch Special: 60% Off</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      First 1,000 customers get lifetime discount
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold terminal-glow">$19</span>
                      <span className="text-lg text-muted-foreground line-through">$49</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Product Video/Demo */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ scale: scaleProgress }}
            >
              <Card className="glass-dark p-4 border-glow">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center cursor-pointer border-glow"
                  >
                    <Play className="w-10 h-10 text-primary ml-1" />
                  </motion.div>

                  {/* Animated Elements */}
                  <motion.div
                    className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full text-xs font-bold"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Live Demo
                  </motion.div>
                </div>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Card className="glass p-4 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-bold">2.4x ROI</div>
                  <div className="text-xs text-muted-foreground">Average return</div>
                </Card>
                <Card className="glass p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-bold">500+ Teams</div>
                  <div className="text-xs text-muted-foreground">Already using</div>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Showcase */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Packed with Power
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need, nothing you don't
            </p>
          </motion.div>

          <Tabs defaultValue="overview" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="glass p-6 h-full border-glow">
                      <feature.icon className="w-8 h-8 text-primary mb-4" />
                      <h3 className="font-bold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="features">
              <BeforeAfter />
            </TabsContent>

            <TabsContent value="technical">
              <Card className="glass-overlay p-8 border-glow">
                <pre className="text-sm overflow-x-auto">
                  <code>{`// Quick Start Guide
npm install productname

// Initialize
import { Product } from 'productname'
const app = new Product({ apiKey: 'YOUR_KEY' })

// Start building
app.automate('task-name')
  .run()
  .then(result => console.log(result))

// That's it! 🚀`}</code>
                </pre>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Beta Users Love It
            </h2>
            <p className="text-xl text-muted-foreground">
              Here's what our early adopters say
            </p>
          </motion.div>

          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="glass-dark p-6 h-full border-glow">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                    <Separator className="my-4" />
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{testimonial.image}</div>
                      <div>
                        <div className="font-bold text-sm">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Quick Start Guide */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center mb-16">
              Get Started in 3 Steps
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <Card className="glass-dark p-6 text-center h-full border-glow">
                    <div className="text-5xl font-mono font-bold text-primary/30 mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </Card>
                  {index < steps.length - 1 && (
                    <ChevronRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 text-muted-foreground" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Press Mentions */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground mb-8">Featured in</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {pressMentions.map((press, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="flex items-center gap-3 text-xl opacity-60 hover:opacity-100 transition-opacity"
                >
                  <span className="text-3xl">{press.logo}</span>
                  <span className="font-bold">{press.name}</span>
                </motion.div>
              ))}
            </div>
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
            <Card className="glass-overlay p-12 text-center border-glow relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <div className="relative z-10">
                <Timer className="w-16 h-16 mx-auto mb-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Launch Offer Ends Soon
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Join 10,000+ users and save 60% for life
                </p>

                <div className="mb-8">
                  <LaunchCountdown endDate={offerEndDate} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-lg">
                    <Download className="w-5 h-5 mr-2" />
                    Get Started Now
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleCopy}>
                    {copied ? <Check className="w-5 h-5 mr-2" /> : <Share2 className="w-5 h-5 mr-2" />}
                    {copied ? 'Copied!' : 'Share'}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-6">
                  No credit card required · 14-day money-back guarantee
                </p>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-bold">ProductName</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  The productivity tool you've been waiting for.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="#" className="block hover:text-primary transition-colors">Features</a>
                  <a href="#" className="block hover:text-primary transition-colors">Pricing</a>
                  <a href="#" className="block hover:text-primary transition-colors">Roadmap</a>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4">Resources</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="#" className="block hover:text-primary transition-colors">Documentation</a>
                  <a href="#" className="block hover:text-primary transition-colors">API Reference</a>
                  <a href="#" className="block hover:text-primary transition-colors">Support</a>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4">Connect</h4>
                <div className="flex gap-4">
                  {[Twitter, Github, Linkedin, Mail].map((Icon, index) => (
                    <Button key={index} variant="ghost" size="sm">
                      <Icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <Separator className="my-8" />
            <div className="text-center text-sm text-muted-foreground">
              © 2024 ProductName. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

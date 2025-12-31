'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Smartphone,
  Download,
  Star,
  Shield,
  Zap,
  Users,
  Lock,
  Globe,
  Play,
  CheckCircle,
  ChevronRight,
  Apple,
  Chrome,
  Menu,
  X,
  Bell,
  Heart,
  MessageSquare,
  TrendingUp,
  Award,
  CreditCard,
  ArrowRight,
  Check,
  Sparkles,
  Cloud,
  Fingerprint,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'

// App Store Badge Component
const AppStoreBadge = ({ store }: { store: 'ios' | 'android' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="glass-dark px-6 py-3 rounded-lg flex items-center gap-3 border border-border/50 hover:border-primary/50 transition-colors"
    >
      {store === 'ios' ? (
        <>
          <Apple className="w-8 h-8" />
          <div className="text-left">
            <div className="text-xs text-muted-foreground">Download on the</div>
            <div className="font-bold">App Store</div>
          </div>
        </>
      ) : (
        <>
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
          </svg>
          <div className="text-left">
            <div className="text-xs text-muted-foreground">Get it on</div>
            <div className="font-bold">Google Play</div>
          </div>
        </>
      )}
    </motion.button>
  )
}

// Phone Mockup Component
const PhoneMockup = ({ children, variant = 'dark' }: { children: React.ReactNode; variant?: 'dark' | 'light' }) => {
  return (
    <div className={`relative mx-auto w-[280px] h-[580px] ${variant === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800`}>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-10" />

      {/* Screen */}
      <div className="relative w-full h-full bg-gradient-to-br from-background to-muted rounded-[2.3rem] overflow-hidden">
        {children}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-600 rounded-full" />
    </div>
  )
}

// Animated Counter
const AnimatedCounter = ({ end, suffix = '', decimals = 0 }: { end: number; suffix?: string; decimals?: number }) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / 2000, 1)
        setCount(progress * end)
        if (progress < 1) {
          requestAnimationFrame(animateCount)
        }
      }
      requestAnimationFrame(animateCount)
    }
  }, [inView, end])

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold terminal-glow">
      {count.toFixed(decimals)}{suffix}
    </div>
  )
}

export default function LandingAppTemplate() {
  const [activeScreenshot, setActiveScreenshot] = useState(0)
  const { scrollYProgress } = useScroll()
  const phoneY = useTransform(scrollYProgress, [0, 0.3], [100, 0])
  const phoneOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  const screenshots = [
    { title: 'Dashboard', description: 'Beautiful overview of your data' },
    { title: 'Analytics', description: 'Powerful insights at your fingertips' },
    { title: 'Settings', description: 'Customize everything your way' },
    { title: 'Notifications', description: 'Stay updated in real-time' }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance on all devices'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted end-to-end'
    },
    {
      icon: Cloud,
      title: 'Cloud Sync',
      description: 'Access your data anywhere, anytime'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get notified about what matters most'
    },
    {
      icon: Heart,
      title: 'Intuitive Design',
      description: 'Beautiful UI that\'s easy to use'
    },
    {
      icon: Fingerprint,
      title: 'Biometric Auth',
      description: 'Face ID and Touch ID support'
    }
  ]

  const steps = [
    {
      step: '01',
      title: 'Download the App',
      description: 'Available on iOS and Android',
      icon: Download
    },
    {
      step: '02',
      title: 'Create Account',
      description: 'Sign up in under 30 seconds',
      icon: Users
    },
    {
      step: '03',
      title: 'Start Using',
      description: 'Enjoy all premium features',
      icon: Sparkles
    }
  ]

  const testimonials = [
    {
      name: 'Alex Morgan',
      role: 'Product Designer',
      image: '👨‍💼',
      quote: 'Best app I\'ve used this year. Clean, fast, and powerful.',
      rating: 5
    },
    {
      name: 'Sarah Kim',
      role: 'Entrepreneur',
      image: '👩‍💻',
      quote: 'Increased my productivity by 10x. Can\'t live without it!',
      rating: 5
    },
    {
      name: 'David Chen',
      role: 'Developer',
      image: '👨‍🔬',
      quote: 'The attention to detail is incredible. Highly recommended.',
      rating: 5
    }
  ]

  const faqs = [
    {
      question: 'Is the app free to use?',
      answer: 'Yes! We offer a generous free tier with all core features. Premium plans unlock advanced features and increased limits.'
    },
    {
      question: 'Which platforms are supported?',
      answer: 'Our app is available on iOS (iPhone & iPad), Android, and web. Your data syncs seamlessly across all devices.'
    },
    {
      question: 'How secure is my data?',
      answer: 'We use bank-level encryption (AES-256) and never store your data unencrypted. We\'re also SOC 2 Type II certified.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Absolutely! You can cancel your subscription at any time, no questions asked. Your data remains accessible on the free plan.'
    },
    {
      question: 'Do you offer a free trial?',
      answer: 'Yes! All premium plans come with a 14-day free trial. No credit card required to start.'
    }
  ]

  const securityBadges = [
    { icon: Shield, text: 'SOC 2 Certified' },
    { icon: Lock, text: 'AES-256 Encryption' },
    { icon: Fingerprint, text: 'Biometric Auth' },
    { icon: Eye, text: 'Privacy First' }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[10%] left-[10%] w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 glass sticky top-0 z-40 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl">AppName</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</a>
              <a href="#faq" className="text-sm hover:text-primary transition-colors">FAQ</a>
              <Button size="sm">Download</Button>
            </nav>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
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
                  <Star className="w-3 h-3 mr-2 fill-current" />
                  4.9 Rating · 10K+ Downloads
                </Badge>

                <h1 className="text-5xl md:text-7xl font-bold terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Your Perfect
                  <br />
                  <span className="text-primary">Mobile App</span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground">
                  Everything you need, beautifully designed and incredibly powerful.
                </p>
              </div>

              {/* App Store Badges */}
              <div className="flex flex-wrap gap-4">
                <AppStoreBadge store="ios" />
                <AppStoreBadge store="android" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div>
                  <AnimatedCounter end={4.9} suffix="/5" decimals={1} />
                  <div className="text-sm text-muted-foreground mt-1">App Rating</div>
                </div>
                <div>
                  <AnimatedCounter end={50} suffix="K+" />
                  <div className="text-sm text-muted-foreground mt-1">Downloads</div>
                </div>
                <div>
                  <AnimatedCounter end={98} suffix="%" />
                  <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="flex flex-wrap gap-3 pt-4">
                {securityBadges.map((badge, index) => (
                  <div key={index} className="glass px-3 py-2 rounded-lg flex items-center gap-2 text-xs">
                    <badge.icon className="w-4 h-4 text-primary" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Phone Mockup */}
            <motion.div
              style={{ y: phoneY, opacity: phoneOpacity }}
              className="relative"
            >
              <PhoneMockup>
                <motion.div
                  key={activeScreenshot}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full h-full p-4 flex flex-col"
                >
                  <div className="flex-1 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                    <div className="text-center p-4">
                      <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary" />
                      <h3 className="font-bold mb-1">{screenshots[activeScreenshot].title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {screenshots[activeScreenshot].description}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    {screenshots.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveScreenshot(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === activeScreenshot ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </PhoneMockup>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-10 -right-10 glass p-4 rounded-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <TrendingUp className="w-6 h-6 text-primary" />
              </motion.div>
              <motion.div
                className="absolute -bottom-10 -left-10 glass p-4 rounded-2xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Award className="w-6 h-6 text-primary" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to boost your productivity and stay organized
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-muted-foreground">
              It's incredibly easy to start
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <Card className="glass-dark p-8 text-center h-full border-glow">
                  <div className="text-5xl font-mono font-bold text-primary/30 mb-6">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
                {index < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 text-muted-foreground z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Screenshots Carousel */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Beautiful Interface
            </h2>
            <p className="text-xl text-muted-foreground">
              Designed to delight, built to perform
            </p>
          </motion.div>

          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {screenshots.map((screenshot, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="glass-dark p-4 border-glow">
                    <div className="aspect-[9/16] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                      <div className="text-center p-4">
                        <Play className="w-12 h-12 mx-auto mb-3 text-primary" />
                        <h3 className="font-bold text-sm mb-1">{screenshot.title}</h3>
                        <p className="text-xs text-muted-foreground">{screenshot.description}</p>
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

        {/* Testimonials */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Loved by Users
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users have to say
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-dark p-6 h-full border-glow">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <Separator className="my-4" />
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{testimonial.image}</div>
                    <div>
                      <div className="font-bold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that's right for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="glass-dark p-8 border-glow">
              <Badge className="mb-4">Free</Badge>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">$0</div>
                <div className="text-muted-foreground">Forever free</div>
              </div>
              <ul className="space-y-3 mb-8">
                {['All core features', 'Up to 100 items', 'Cloud sync', 'Mobile & web access'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </Card>

            <Card className="glass-overlay p-8 border-primary border-glow relative">
              <Badge className="mb-4 bg-primary text-primary-foreground">Pro</Badge>
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="text-xs">Popular</Badge>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">$9</div>
                <div className="text-muted-foreground">per month</div>
              </div>
              <ul className="space-y-3 mb-8">
                {['Everything in Free', 'Unlimited items', 'Priority support', 'Advanced analytics', 'Team collaboration', 'Custom integrations'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                14-day free trial · No credit card required
              </p>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="container mx-auto px-4 py-20">
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
            <Card className="glass-overlay p-12 text-center border-glow">
              <Smartphone className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of users who trust AppName
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <AppStoreBadge store="ios" />
                <AppStoreBadge store="android" />
              </div>

              <p className="text-sm text-muted-foreground">
                Free to download · Premium features available
              </p>
            </Card>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <span className="font-bold">AppName</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your perfect mobile companion.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="#" className="block hover:text-primary transition-colors">Features</a>
                  <a href="#" className="block hover:text-primary transition-colors">Pricing</a>
                  <a href="#" className="block hover:text-primary transition-colors">Download</a>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4">Support</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="#" className="block hover:text-primary transition-colors">Help Center</a>
                  <a href="#" className="block hover:text-primary transition-colors">Privacy</a>
                  <a href="#" className="block hover:text-primary transition-colors">Terms</a>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="#" className="block hover:text-primary transition-colors">About</a>
                  <a href="#" className="block hover:text-primary transition-colors">Blog</a>
                  <a href="#" className="block hover:text-primary transition-colors">Contact</a>
                </div>
              </div>
            </div>
            <Separator className="my-8" />
            <div className="text-center text-sm text-muted-foreground">
              © 2024 AppName. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

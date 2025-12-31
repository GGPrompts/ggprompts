'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  CheckCircle,
  Shield,
  Lock,
  X,
  ArrowRight,
  Sparkles,
  Star,
  Download,
  Gift,
  Clock,
  Users,
  Zap,
  AlertCircle,
  Eye,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

// Progress Bar Component
const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-secondary"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}

// Exit Intent Popup
const ExitIntentPopup = ({ isOpen, onClose, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}) => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.includes('@')) {
      onSubmit(email)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <Card className="glass-overlay p-8 relative border-glow border-2 border-primary">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute right-2 top-2"
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <Gift className="w-20 h-20 mx-auto mb-4 text-primary" />
                </motion.div>

                <h3 className="text-2xl font-bold mb-2 terminal-glow">Wait! Don't Leave Empty-Handed</h3>
                <p className="text-muted-foreground mb-2">
                  Get an <span className="text-primary font-bold">EXTRA 20% OFF</span>
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Plus exclusive bonus content not available anywhere else
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-primary/50"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg" size="lg">
                    Claim My Bonus Offer
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    🔒 Limited to first 100 people today
                  </p>
                </form>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Thank You State
const ThankYouState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto text-center py-20"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/20 flex items-center justify-center"
      >
        <CheckCircle className="w-12 h-12 text-primary" />
      </motion.div>

      <h2 className="text-4xl md:text-5xl font-bold mb-4 terminal-glow">
        You're In!
      </h2>

      <p className="text-xl text-muted-foreground mb-8">
        Check your email inbox (and spam folder) for your exclusive content.
      </p>

      <Card className="glass-dark p-6 mb-8 border-glow">
        <h3 className="font-bold mb-4">What happens next?</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">1</span>
            </div>
            <div>
              <p className="text-sm">Check your email in the next 5 minutes</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">2</span>
            </div>
            <div>
              <p className="text-sm">Click the confirmation link to activate your access</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">3</span>
            </div>
            <div>
              <p className="text-sm">Get instant access to your exclusive content</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-center gap-4">
        <Button variant="outline">
          Share with Friends
        </Button>
        <Button>
          Explore More
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  )
}

export default function SqueezePageTemplate() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const [showUrgency, setShowUrgency] = useState(false)
  const [spotsLeft, setSpotsLeft] = useState(47)

  // Calculate form progress
  useEffect(() => {
    let progress = 0
    if (name) progress += 50
    if (email.includes('@')) progress += 50
    setFormProgress(progress)
  }, [name, email])

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isSubmitted && !showExitIntent) {
        setShowExitIntent(true)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [isSubmitted, showExitIntent])

  // Urgency timer
  useEffect(() => {
    const timer = setTimeout(() => setShowUrgency(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Decrease spots every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft(prev => Math.max(prev - 1, 20))
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.includes('@')) {
      // Track: squeeze_page_conversion
      setIsSubmitted(true)
    }
  }

  const handleExitIntentSubmit = (exitEmail: string) => {
    // Track: exit_intent_conversion
    setEmail(exitEmail)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <ThankYouState />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Minimal Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Urgency Banner */}
      <AnimatePresence>
        {showUrgency && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-40 border-b border-primary/50 bg-primary/10 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-4 text-sm">
              <AlertCircle className="w-4 h-4 text-primary animate-pulse" />
              <span className="font-bold">Only {spotsLeft} spots left today!</span>
              <Badge className="border-glow animate-pulse">Limited Time</Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          {/* Badge */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Badge className="px-4 py-2 text-sm border-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              Free Exclusive Training
            </Badge>
          </motion.div>

          {/* Headline - Single Powerful Message */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow leading-tight">
            Double Your Productivity
            <br />
            <span className="text-primary">in 30 Days</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto">
            Join 50,000+ professionals who transformed their workflow with our proven system
          </p>

          {/* Bullet Points - 3-5 Key Benefits */}
          <Card className="glass-overlay p-8 border-glow max-w-lg mx-auto">
            <ul className="space-y-4 text-left">
              {[
                'Learn the exact framework used by top performers',
                'Step-by-step action plan you can implement today',
                'Exclusive productivity tools & templates ($297 value)',
                'Lifetime access to our private community',
                'Zero fluff, only actionable strategies'
              ].map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </Card>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['👨‍💼', '👩‍💻', '👨‍🔬', '👩‍🎨'].map((emoji, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                    {emoji}
                  </div>
                ))}
              </div>
              <span className="text-muted-foreground">
                <span className="font-bold text-foreground">50,241</span> members
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-muted-foreground">4.9/5 rating</span>
            </div>
          </div>

          {/* Email Form - Minimal Fields */}
          <Card className="glass-overlay p-8 border-2 border-primary border-glow max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Progress Indicator */}
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Complete your signup</span>
                  <span>{formProgress}%</span>
                </div>
                <ProgressBar progress={formProgress} />
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Your first name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 text-lg border-primary/50 focus:border-primary"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Your best email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 text-lg border-primary/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* High-Contrast CTA */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-xl font-bold border-glow"
                disabled={formProgress < 100}
              >
                {formProgress < 100 ? (
                  <>Fill in your details above</>
                ) : (
                  <>
                    Get Instant Access
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </>
                )}
              </Button>

              {/* Trust Indicators */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span>100% secure. We respect your privacy.</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-primary" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-primary" />
                    <span>Instant access</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-primary" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </form>
          </Card>

          {/* Single Testimonial - Trust Builder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-lg mx-auto"
          >
            <Card className="glass-dark p-6 border-glow">
              <div className="flex gap-1 mb-3 justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm italic mb-4 text-center">
                &ldquo;This changed everything for me. I went from overwhelmed to in complete control of my time. Best decision I made this year.&rdquo;
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="text-2xl">👨‍💼</div>
                <div className="text-left">
                  <div className="font-bold text-sm">Michael Chen</div>
                  <div className="text-xs text-muted-foreground">Product Manager, Google</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Additional Trust Signals */}
          <div className="flex flex-wrap justify-center gap-6 opacity-60">
            {[
              { icon: Shield, text: 'Money-Back Guarantee' },
              { icon: Users, text: '50K+ Students' },
              { icon: TrendingUp, text: 'Proven Results' }
            ].map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <badge.icon className="w-4 h-4" />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>

          {/* Privacy Statement */}
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            We respect your privacy. Your information is safe and will never be shared or sold.
            Unsubscribe at any time with one click.
          </p>
        </motion.div>
      </div>

      {/* Exit Intent Popup */}
      <ExitIntentPopup
        isOpen={showExitIntent}
        onClose={() => setShowExitIntent(false)}
        onSubmit={handleExitIntentSubmit}
      />

      {/* Subtle Background Elements */}
      <div className="fixed bottom-8 left-8 opacity-30 text-xs text-muted-foreground hidden md:block">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-3 h-3" />
          <span>{Math.floor(Math.random() * 100) + 200} people viewing</span>
        </div>
        <div className="flex items-center gap-2">
          <Download className="w-3 h-3" />
          <span>{Math.floor(Math.random() * 20) + 30} signed up today</span>
        </div>
      </div>
    </div>
  )
}

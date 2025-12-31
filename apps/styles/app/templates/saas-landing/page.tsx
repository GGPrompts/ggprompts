'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import {
  ChevronRight,
  CheckCircle,
  Zap,
  Shield,
  Globe,
  BarChart,
  Users,
  Code,
  Terminal,
  Star,
  ArrowRight,
  Play,
  Lock,
  Cpu,
  Database,
  Cloud,
  Sparkles,
  TrendingUp,
  Clock,
  ChevronDown,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Check,
  X,
  Rocket,
  Building,
  CreditCard,
  Layers,
  Activity,
  Server,
  GitBranch,
  Package,
  FileCode,
  Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          requestAnimationFrame(animateCount)
        }
      }
      requestAnimationFrame(animateCount)
    }
  }, [inView, end, duration])

  return (
    <div ref={ref} className="font-mono text-4xl md:text-5xl terminal-glow">
      {count.toLocaleString()}{suffix}
    </div>
  )
}

// Floating Background Elements
const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.div
        className="absolute top-[60%] right-[10%] w-96 h-96 rounded-full bg-secondary/5 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[30%] w-80 h-80 rounded-full bg-primary/5 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  )
}

// Main Landing Page Component
export default function SaaSLandingPage() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])

  const [email, setEmail] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('pro')

  const features = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'AI-Powered Automation',
      description: 'Leverage cutting-edge machine learning to automate complex workflows and boost productivity by 10x.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption with SOC 2 Type II certification. Your data is protected with military-grade security.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global CDN',
      description: 'Lightning-fast performance with 200+ edge locations worldwide. Sub-100ms latency guaranteed.'
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Real-time Sync',
      description: 'Instant data synchronization across all devices with conflict-free resolution and offline support.'
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: 'Version Control',
      description: 'Complete audit trail with unlimited version history and one-click rollback capabilities.'
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: 'Advanced Analytics',
      description: 'Deep insights with custom dashboards, predictive analytics, and automated reporting.'
    }
  ]

  const benefits = [
    {
      title: 'Scale Without Limits',
      description: 'Our infrastructure automatically scales to handle millions of requests without breaking a sweat. From startup to enterprise, we grow with you.',
      metrics: ['99.99% Uptime SLA', 'Auto-scaling', 'Zero downtime deploys'],
      image: '/api/placeholder/600/400'
    },
    {
      title: 'Developer-First Platform',
      description: 'Built by developers, for developers. Clean APIs, comprehensive SDKs, and documentation that actually makes sense.',
      metrics: ['REST & GraphQL APIs', '10+ SDK languages', 'Webhook support'],
      image: '/api/placeholder/600/400',
      reverse: true
    },
    {
      title: 'Collaborate in Real-Time',
      description: 'Work together seamlessly with live collaboration features, instant messaging, and smart conflict resolution.',
      metrics: ['Live cursors', 'Real-time sync', 'Team workspaces'],
      image: '/api/placeholder/600/400'
    }
  ]

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$29',
      description: 'Perfect for small teams',
      features: [
        '5 team members',
        '10GB storage',
        'Basic analytics',
        'Email support',
        '99.9% uptime SLA'
      ],
      notIncluded: [
        'Advanced security',
        'Custom integrations',
        'Priority support'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$99',
      description: 'For growing businesses',
      popular: true,
      features: [
        '25 team members',
        '100GB storage',
        'Advanced analytics',
        'Priority support',
        '99.99% uptime SLA',
        'Advanced security',
        'Custom integrations',
        'API access'
      ],
      notIncluded: [
        'Dedicated account manager',
        'Custom contracts'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Unlimited team members',
        'Unlimited storage',
        'Custom analytics',
        'Dedicated support',
        '99.999% uptime SLA',
        'Advanced security',
        'Custom integrations',
        'Full API access',
        'Dedicated account manager',
        'Custom contracts',
        'On-premise option'
      ],
      notIncluded: []
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO at TechCorp',
      content: 'This platform transformed how we build and deploy applications. The developer experience is unmatched.',
      rating: 5,
      company: 'TechCorp'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Engineering Lead',
      content: 'We cut our deployment time by 80% and haven\'t had a single incident in 6 months. Absolutely game-changing.',
      rating: 5,
      company: 'StartupXYZ'
    },
    {
      name: 'Emily Watson',
      role: 'Product Manager',
      content: 'The real-time collaboration features have made our remote team more productive than ever before.',
      rating: 5,
      company: 'DesignHub'
    },
    {
      name: 'David Kim',
      role: 'Founder & CEO',
      content: 'Scaling from 10 to 10,000 users was seamless. The platform just handles everything automatically.',
      rating: 5,
      company: 'ScaleUp Inc'
    }
  ]

  const faqs = [
    {
      question: 'How does the free trial work?',
      answer: 'Start with a 14-day free trial of our Professional plan. No credit card required. You\'ll have access to all features and can cancel anytime.'
    },
    {
      question: 'Can I change plans later?',
      answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we\'ll prorate any differences.'
    },
    {
      question: 'What kind of support do you offer?',
      answer: 'We offer email support for Starter plans, priority support with <2hr response time for Professional, and dedicated support with instant response for Enterprise customers.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Security is our top priority. We use bank-level encryption, are SOC 2 Type II certified, and conduct regular third-party security audits. Your data is encrypted at rest and in transit.'
    },
    {
      question: 'Do you offer custom integrations?',
      answer: 'Yes! Professional and Enterprise plans include access to our API and webhook system. Enterprise customers can also request custom integrations built by our team.'
    },
    {
      question: 'What\'s your uptime guarantee?',
      answer: 'We guarantee 99.9% uptime for Starter, 99.99% for Professional, and 99.999% for Enterprise plans. Check our status page for real-time monitoring.'
    }
  ]

  const integrations = [
    'GitHub', 'GitLab', 'Slack', 'Discord', 'Jira', 'Linear',
    'Notion', 'Figma', 'AWS', 'Google Cloud', 'Azure', 'Vercel'
  ]

  const stats = [
    { label: 'Active Users', value: 50000, suffix: '+' },
    { label: 'Deployments Daily', value: 1000000, suffix: '+' },
    { label: 'Uptime', value: 99.99, suffix: '%' },
    { label: 'Happy Customers', value: 5000, suffix: '+' }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      <FloatingElements />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          className="max-w-6xl mx-auto text-center z-10"
          style={{ opacity, scale }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 glass border-primary/50 text-primary">
              <Sparkles className="w-3 h-3 mr-1" />
              Trusted by 5,000+ companies
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ship Faster with
            <br />
            <span className="terminal-glow">
              AI-Powered DevOps
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The complete platform for modern development teams. Deploy, scale, and collaborate
            with confidence. From idea to production in minutes, not months.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button size="lg" className="glass-dark border-primary/50 text-primary hover:bg-primary/20 group">
              Start Free Trial
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-secondary/50 text-secondary hover:bg-secondary/10 group">
              <Play className="mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Badge className="glass-dark border-secondary/30 px-4 py-2">
              <Shield className="w-4 h-4 mr-2 text-secondary" />
              SOC 2 Certified
            </Badge>
            <Badge className="glass-dark border-secondary/30 px-4 py-2">
              <Lock className="w-4 h-4 mr-2 text-secondary" />
              GDPR Compliant
            </Badge>
            <Badge className="glass-dark border-secondary/30 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2 text-secondary" />
              ISO 27001
            </Badge>
          </motion.div>
        </motion.div>

        {/* Animated Terminal Window */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-primary/50" />
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center glass-dark rounded-lg p-6 border-glow"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 glass border-primary/50 text-primary">
              Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features that scale with your business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass-dark border-secondary/30 p-6 hover:border-primary/50 transition-all duration-300 group h-full">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 glass rounded-lg border border-primary/30 group-hover:border-primary/50 transition-colors">
                      <div className="text-primary">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-secondary">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits with Alternating Layout */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 glass border-primary/50 text-primary">
              Benefits
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Why Teams Choose Us
            </h2>
          </motion.div>

          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className={`flex flex-col ${benefit.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 mb-20`}
              initial={{ opacity: 0, x: benefit.reverse ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4 text-secondary">
                  {benefit.title}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {benefit.description}
                </p>
                <div className="space-y-3">
                  {benefit.metrics.map((metric) => (
                    <div key={metric} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-foreground">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="glass-dark rounded-lg p-8 border border-secondary/30">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <Terminal className="w-20 h-20 text-primary/50" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 glass border-primary/50 text-primary">
              Pricing
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free, scale as you grow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={selectedPlan === plan.id ? 'scale-105' : ''}
              >
                <Card
                  className={`
                    p-6 h-full cursor-pointer transition-all duration-300
                    ${plan.popular
                      ? 'glass border-primary/50 shadow-primary/20 shadow-2xl'
                      : 'glass-dark border-secondary/30 hover:border-secondary/50'
                    }
                    ${selectedPlan === plan.id ? 'ring-2 ring-primary/50' : ''}
                  `}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white border-0">
                      Most Popular
                    </Badge>
                  )}

                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold terminal-glow">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-muted-foreground">/month</span>}
                  </div>

                  <Button
                    className={`w-full mb-6 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90'
                        : 'glass-dark border-secondary/50 hover:bg-secondary/10'
                    }`}
                  >
                    {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 opacity-50">
                        <X className="w-5 h-5 text-red-400 mt-0.5" />
                        <span className="text-sm line-through">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 glass border-primary/50 text-primary">
              Testimonials
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Loved by Developers Worldwide
            </h2>
          </motion.div>

          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="glass-dark border-secondary/30 p-6 h-full">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full glass border border-primary/30" />
                      <div>
                        <p className="font-semibold text-secondary">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="glass-dark border-secondary/30 text-secondary" />
            <CarouselNext className="glass-dark border-secondary/30 text-secondary" />
          </Carousel>
        </div>
      </section>

      {/* Integrations Marquee */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 glass border-primary/50 text-primary">
              Integrations
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Works With Your Stack
            </h2>
          </motion.div>

          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              {[...integrations, ...integrations].map((integration, index) => (
                <div
                  key={`${integration}-${index}`}
                  className="glass-dark px-6 py-3 rounded-lg border border-secondary/30 whitespace-nowrap flex items-center gap-2"
                >
                  <Package className="w-4 h-4 text-primary" />
                  <span className="text-secondary">{integration}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 glass border-primary/50 text-primary">
              FAQ
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="glass-dark border border-secondary/30 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-secondary hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass border border-primary/50 rounded-2xl p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Stay Updated
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get the latest updates, tips, and best practices delivered to your inbox
            </p>

            <form
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault()
                console.log('Subscribe:', email)
              }}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 glass-dark border-secondary/30 text-foreground placeholder:text-muted-foreground"
                required
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
              >
                <Send className="mr-2 w-4 h-4" />
                Subscribe
              </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of teams shipping better software, faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 group"
              >
                <Rocket className="mr-2 group-hover:translate-y-[-2px] transition-transform" />
                Start Building Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary/50 text-secondary hover:bg-secondary/10"
              >
                <CreditCard className="mr-2" />
                View Enterprise Plans
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-12">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-secondary/20 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-secondary mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-secondary mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-secondary mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-secondary mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground mb-4 md:mb-0">
              © 2024 SaaS Platform. All rights reserved.
            </div>

            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
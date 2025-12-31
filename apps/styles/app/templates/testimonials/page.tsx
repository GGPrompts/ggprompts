'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Quote,
  Play,
  Building2,
  Users,
  TrendingUp,
  Award,
  Heart,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Code,
  Palette,
  ShoppingCart,
  DollarSign,
  Clock,
  BarChart3,
  MessageSquare
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'CEO',
    company: 'TechFlow Inc',
    industry: 'Technology',
    avatar: '👩‍💼',
    rating: 5,
    quote: 'This platform transformed how our team collaborates. The AI-powered insights alone have saved us countless hours and helped us make data-driven decisions with confidence.',
    stats: { metric: '300%', label: 'Productivity Increase' },
    featured: true,
    videoThumbnail: true
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'CTO',
    company: 'DataStream',
    industry: 'Technology',
    avatar: '👨‍💻',
    rating: 5,
    quote: 'The best investment we\'ve made for our engineering team. The API is robust, documentation is excellent, and support team is incredibly responsive.',
    stats: { metric: '10x', label: 'Faster Deployment' },
    featured: true,
    videoThumbnail: false
  },
  {
    id: 3,
    name: 'Emily Thompson',
    role: 'Product Manager',
    company: 'DesignCo',
    industry: 'Design',
    avatar: '👩‍🎨',
    rating: 5,
    quote: 'Absolutely love the intuitive interface. Our designers and developers can now work seamlessly together without the usual friction.',
    stats: { metric: '85%', label: 'Time Saved' },
    featured: false,
    videoThumbnail: false
  },
  {
    id: 4,
    name: 'James Park',
    role: 'Founder',
    company: 'StartupXYZ',
    industry: 'Startup',
    avatar: '👨‍💼',
    rating: 5,
    quote: 'As a startup, we needed something that could scale with us. This platform has been rock-solid from day one and continues to impress as we grow.',
    stats: { metric: '$500K', label: 'Annual Savings' },
    featured: true,
    videoThumbnail: true
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    role: 'VP of Operations',
    company: 'RetailMax',
    industry: 'E-commerce',
    avatar: '👩',
    rating: 5,
    quote: 'The automation features are game-changing. We\'ve streamlined operations across 50+ stores and our customers are happier than ever.',
    stats: { metric: '50+', label: 'Stores Connected' },
    featured: false,
    videoThumbnail: false
  },
  {
    id: 6,
    name: 'David Kumar',
    role: 'Head of Engineering',
    company: 'CloudScale',
    industry: 'Technology',
    avatar: '👨‍🔬',
    rating: 5,
    quote: 'The performance and reliability are unmatched. We process millions of requests daily and have had zero downtime in 18 months.',
    stats: { metric: '99.99%', label: 'Uptime' },
    featured: false,
    videoThumbnail: false
  },
  {
    id: 7,
    name: 'Rachel Kim',
    role: 'Marketing Director',
    company: 'GrowthAgency',
    industry: 'Marketing',
    avatar: '👩‍💻',
    rating: 5,
    quote: 'The analytics and reporting capabilities have given us insights we never had before. ROI tracking is now effortless.',
    stats: { metric: '250%', label: 'ROI Increase' },
    featured: false,
    videoThumbnail: false
  },
  {
    id: 8,
    name: 'Tom Williams',
    role: 'Developer',
    company: 'CodeCraft',
    industry: 'Technology',
    avatar: '👨‍💻',
    rating: 5,
    quote: 'Best developer experience I\'ve had with any platform. The CLI tools are powerful and the documentation is top-notch.',
    stats: { metric: '5★', label: 'Developer Rating' },
    featured: false,
    videoThumbnail: false
  },
  {
    id: 9,
    name: 'Amanda Foster',
    role: 'CFO',
    company: 'FinanceFirst',
    industry: 'Finance',
    avatar: '👩‍💼',
    rating: 5,
    quote: 'The security features and compliance certifications give us peace of mind. Perfect for handling sensitive financial data.',
    stats: { metric: 'SOC 2', label: 'Certified' },
    featured: false,
    videoThumbnail: false
  },
  {
    id: 10,
    name: 'Chris Martinez',
    role: 'Operations Lead',
    company: 'LogisticsHub',
    industry: 'Logistics',
    avatar: '👨',
    rating: 5,
    quote: 'Integrations with our existing tools were seamless. The onboarding team was exceptional and we were up and running in days.',
    stats: { metric: '3 days', label: 'Setup Time' },
    featured: false,
    videoThumbnail: false
  },
  {
    id: 11,
    name: 'Jennifer Lee',
    role: 'Customer Success',
    company: 'SupportPro',
    industry: 'SaaS',
    avatar: '👩',
    rating: 5,
    quote: 'Our customer satisfaction scores have skyrocketed. The platform makes it easy to deliver exceptional service at scale.',
    stats: { metric: '98%', label: 'CSAT Score' },
    featured: false,
    videoThumbnail: false
  },
  {
    id: 12,
    name: 'Alex Brown',
    role: 'Product Designer',
    company: 'CreativeStudio',
    industry: 'Design',
    avatar: '👨‍🎨',
    rating: 5,
    quote: 'The design system and component library are beautiful. It\'s clear that the team cares deeply about user experience.',
    stats: { metric: '4.9★', label: 'UX Rating' },
    featured: false,
    videoThumbnail: false
  }
]

// Company logos
const companies = [
  { name: 'TechFlow', logo: '🚀' },
  { name: 'DataStream', logo: '💾' },
  { name: 'DesignCo', logo: '🎨' },
  { name: 'StartupXYZ', logo: '⚡' },
  { name: 'RetailMax', logo: '🛍️' },
  { name: 'CloudScale', logo: '☁️' },
  { name: 'GrowthAgency', logo: '📈' },
  { name: 'CodeCraft', logo: '💻' },
  { name: 'FinanceFirst', logo: '💰' },
  { name: 'LogisticsHub', logo: '📦' },
  { name: 'SupportPro', logo: '🎯' },
  { name: 'CreativeStudio', logo: '✨' }
]

// Case studies
const caseStudies = [
  {
    company: 'TechFlow Inc',
    industry: 'Technology',
    icon: Code,
    title: 'How TechFlow scaled to 1M users',
    result: '300% productivity increase',
    timeframe: '6 months'
  },
  {
    company: 'RetailMax',
    industry: 'E-commerce',
    icon: ShoppingCart,
    title: 'RetailMax connects 50+ stores seamlessly',
    result: '$500K annual savings',
    timeframe: '1 year'
  },
  {
    company: 'DesignCo',
    industry: 'Design',
    icon: Palette,
    title: 'DesignCo streamlines creative workflow',
    result: '85% time saved',
    timeframe: '3 months'
  }
]

const industries = ['All', 'Technology', 'E-commerce', 'Design', 'Startup', 'Marketing', 'Finance']

export default function TestimonialsPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('All')
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

  const filteredTestimonials = selectedIndustry === 'All'
    ? testimonials
    : testimonials.filter(t => t.industry === selectedIndustry)

  const featuredTestimonials = testimonials.filter(t => t.featured)
  const currentTestimonial = featuredTestimonials[currentTestimonialIndex]

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) =>
      prev === featuredTestimonials.length - 1 ? 0 : prev + 1
    )
  }

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) =>
      prev === 0 ? featuredTestimonials.length - 1 : prev - 1
    )
  }

  return (
    <div className="min-h-screen text-foreground">
      {/* Hero Section with Featured Testimonial */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
            <Heart className="w-3 h-3 mr-1" />
            Loved by 50,000+ Teams
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Trusted by industry leaders
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Don't just take our word for it. Here's what our customers have to say
            about transforming their workflows and achieving remarkable results.
          </p>
        </motion.div>

        {/* Featured Testimonial Carousel */}
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass border-primary/30 p-12 relative overflow-hidden">
            {/* Decorative quote marks */}
            <Quote className="absolute top-8 left-8 w-16 h-16 text-primary/10" />
            <Quote className="absolute bottom-8 right-8 w-16 h-16 text-primary/10 rotate-180" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                {/* Video Badge */}
                {currentTestimonial.videoThumbnail && (
                  <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
                    <Play className="w-3 h-3 mr-1" />
                    Watch Video Testimonial
                  </Badge>
                )}

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-primary fill-primary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-2xl font-medium text-center mb-8 leading-relaxed">
                  "{currentTestimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl border-2 border-primary/30">
                    {currentTestimonial.avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg">{currentTestimonial.name}</div>
                    <div className="text-muted-foreground">
                      {currentTestimonial.role} at {currentTestimonial.company}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="glass rounded-lg p-6 max-w-xs mx-auto border border-border/20">
                  <div className="text-4xl font-bold text-primary text-center mb-2">
                    {currentTestimonial.stats.metric}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    {currentTestimonial.stats.label}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {/* Dots */}
              <div className="flex gap-2">
                {featuredTestimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonialIndex(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      idx === currentTestimonialIndex
                        ? "bg-primary w-8"
                        : "bg-muted-foreground/30"
                    )}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            { icon: Users, value: '50K+', label: 'Happy Customers' },
            { icon: Star, value: '4.9/5', label: 'Average Rating' },
            { icon: Award, value: '15+', label: 'Industry Awards' },
            { icon: TrendingUp, value: '98%', label: 'Satisfaction Rate' }
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx} className="glass border-border/30 p-6 text-center">
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            )
          })}
        </motion.div>
      </section>

      {/* Company Logos */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          Trusted by leading companies worldwide
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 max-w-5xl mx-auto">
          {companies.map((company, idx) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="text-4xl opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              title={company.name}
            >
              {company.logo}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Industry Filter */}
      <section className="container mx-auto px-4 py-8">
        <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry} className="w-full">
          <TabsList className="glass border-border/30 w-full max-w-4xl mx-auto h-auto p-1 flex flex-wrap">
            {industries.map((industry) => (
              <TabsTrigger
                key={industry}
                value={industry}
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex-1 min-w-[100px]"
              >
                {industry}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      {/* Testimonials Grid */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredTestimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="glass border-border/30 p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl border border-primary/20">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-bold">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                    {testimonial.videoThumbnail && (
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-sm mb-4 flex-grow italic text-muted-foreground">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Footer */}
                  <div className="pt-4 border-t border-border/20">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <Building2 className="w-3 h-3 inline mr-1" />
                        <span className="font-medium">{testimonial.company}</span>
                      </div>
                      <Badge variant="outline" className="border-primary/30 text-xs">
                        {testimonial.industry}
                      </Badge>
                    </div>
                    <div className="mt-3 glass rounded-lg p-3 border border-border/10">
                      <div className="text-lg font-bold text-primary">
                        {testimonial.stats.metric}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.stats.label}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Video Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">See it in action</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch our customers share their success stories
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {featuredTestimonials.filter(t => t.videoThumbnail).map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="glass border-border/30 overflow-hidden group cursor-pointer">
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-background/10 transition-all" />
                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16 relative z-10 group-hover:scale-110 transition-transform"
                  >
                    <Play className="w-6 h-6" />
                  </Button>
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    3:24
                  </Badge>
                </div>
                {/* Info */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl border border-primary/20">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {testimonial.quote}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Customer Success Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Deep dives into how our customers achieved remarkable results
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {caseStudies.map((study, idx) => {
            const Icon = study.icon
            return (
              <motion.div
                key={study.company}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="glass border-border/30 p-6 h-full flex flex-col group hover:border-primary/30 transition-all cursor-pointer">
                  <Icon className="w-10 h-10 text-primary mb-4" />
                  <Badge variant="outline" className="mb-3 w-fit border-primary/30">
                    {study.industry}
                  </Badge>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                    {study.title}
                  </h3>
                  <div className="space-y-2 mb-4 flex-grow">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Result: <span className="font-medium text-foreground">{study.result}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Timeline: <span className="font-medium text-foreground">{study.timeframe}</span></span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full group-hover:border-primary/50">
                    Read Case Study
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Metrics Overview */}
      <section className="container mx-auto px-4 py-16">
        <Card className="glass border-primary/30 p-12 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">Results that speak for themselves</h2>
            <p className="text-muted-foreground">
              Real metrics from real customers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: TrendingUp, value: '300%', label: 'Avg. Productivity Gain' },
              { icon: DollarSign, value: '$2M+', label: 'Customer Savings' },
              { icon: Clock, value: '85%', label: 'Time Saved' },
              { icon: BarChart3, value: '10x', label: 'Faster Deployment' }
            ].map((metric, idx) => {
              const Icon = metric.icon
              return (
                <div key={idx} className="text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-4xl font-bold text-primary mb-2">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </div>
              )
            })}
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="glass border-primary/30 p-12 text-center max-w-3xl mx-auto">
          <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-4">Join our success stories</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your free trial today and see why thousands of teams trust us
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Talk to Sales
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}

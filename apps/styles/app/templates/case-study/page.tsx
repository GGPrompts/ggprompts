'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Quote,
  Calendar,
  Users,
  Target,
  Zap,
  Code2,
  Lightbulb,
  TrendingUp,
  ChevronRight,
  ExternalLink,
  Github
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'

// Animated Counter Component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 })
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, value, motionValue])

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString() + suffix
      }
    })
  }, [springValue, suffix])

  return <span ref={ref} className="terminal-glow">0{suffix}</span>
}

// Before/After Slider Component
function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After"
}: {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100))
    setSliderPosition(percent)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    handleMove(e.touches[0].clientX)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', () => setIsDragging(false))
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', () => setIsDragging(false))
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', () => setIsDragging(false))
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', () => setIsDragging(false))
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] overflow-hidden rounded-xl glass border border-border/30"
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* After Image (bottom layer) */}
      <div className="absolute inset-0">
        <Image
          src={afterImage}
          alt={afterLabel}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4 glass-dark px-3 py-1 rounded-md">
          <span className="text-xs font-mono text-primary">{afterLabel}</span>
        </div>
      </div>

      {/* Before Image (top layer with clip) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt={beforeLabel}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4 glass-dark px-3 py-1 rounded-md">
          <span className="text-xs font-mono text-primary">{beforeLabel}</span>
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-primary border-glow cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full border-2 border-background flex items-center justify-center">
          <div className="flex gap-1">
            <ChevronRight className="w-3 h-3 rotate-180" />
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Timeline Component for Solution Approach
function Timeline({ steps }: { steps: Array<{ title: string; description: string; icon?: React.ReactNode }> }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary to-primary/50" />

      {steps.map((step, index) => {
        const ref = useRef(null)
        const isInView = useInView(ref, { once: true, margin: "-100px" })

        return (
          <motion.div
            key={index}
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative flex items-start gap-6 mb-12"
          >
            {/* Icon */}
            <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full glass border-2 border-primary border-glow">
              <div className="text-primary">
                {step.icon || <Code2 className="w-6 h-6" />}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-2">
              <h3 className="text-xl font-semibold mb-2 terminal-glow">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function CaseStudyTemplate() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  // Sample data - replace with actual project data
  const projectData = {
    title: "E-Commerce Platform Redesign",
    subtitle: "Transforming User Experience with Modern Architecture",
    heroImage: "/screenshots/project-hero.jpg",
    client: "TechCorp Industries",
    duration: "6 months",
    team: "4 developers, 2 designers",

    problem: {
      statement: "The existing e-commerce platform was struggling with performance issues, poor mobile experience, and declining conversion rates.",
      challenges: [
        "Legacy codebase with technical debt",
        "Slow page load times affecting SEO",
        "Non-responsive design losing mobile users",
        "Complex checkout process causing cart abandonment"
      ]
    },

    solution: {
      approach: "Complete frontend rewrite using modern stack with focus on performance and user experience.",
      steps: [
        {
          title: "Research & Analysis",
          description: "Conducted user interviews, analyzed competitors, and identified pain points in the current system.",
          icon: <Target className="w-6 h-6" />
        },
        {
          title: "Architecture Planning",
          description: "Designed a scalable microservices architecture with Next.js for the frontend and Node.js microservices.",
          icon: <Lightbulb className="w-6 h-6" />
        },
        {
          title: "Implementation",
          description: "Built component library, implemented SSR/SSG for performance, and created responsive designs.",
          icon: <Code2 className="w-6 h-6" />
        },
        {
          title: "Testing & Optimization",
          description: "Performed extensive testing, optimized Core Web Vitals, and implemented progressive enhancement.",
          icon: <Zap className="w-6 h-6" />
        },
        {
          title: "Deployment & Monitoring",
          description: "Rolled out with blue-green deployment strategy and set up comprehensive monitoring.",
          icon: <TrendingUp className="w-6 h-6" />
        }
      ]
    },

    techStack: [
      "Next.js 14", "TypeScript", "Tailwind CSS", "PostgreSQL",
      "Redis", "Docker", "AWS", "Stripe API", "Framer Motion", "GraphQL"
    ],

    challenges: [
      {
        challenge: "Migrating from legacy monolith to microservices",
        solution: "Implemented strangler fig pattern for gradual migration without downtime."
      },
      {
        challenge: "Handling high traffic during peak sales",
        solution: "Implemented caching strategies with Redis and CDN optimization."
      },
      {
        challenge: "Complex state management across components",
        solution: "Used Zustand for lightweight state management with TypeScript support."
      },
      {
        challenge: "SEO requirements with dynamic content",
        solution: "Leveraged Next.js ISR for optimal SEO while maintaining dynamic content."
      }
    ],

    results: {
      metrics: [
        { label: "Page Load Speed", value: 75, suffix: "% faster" },
        { label: "Conversion Rate", value: 42, suffix: "% increase" },
        { label: "Mobile Traffic", value: 65, suffix: "% growth" },
        { label: "Bounce Rate", value: 35, suffix: "% decrease" }
      ],
      testimonial: {
        quote: "The redesigned platform exceeded our expectations. The performance improvements and user experience enhancements have directly translated to increased revenue.",
        author: "Sarah Chen",
        role: "CTO, TechCorp Industries"
      }
    },

    screenshots: [
      "/screenshots/project-1.jpg",
      "/screenshots/project-2.jpg",
      "/screenshots/project-3.jpg",
      "/screenshots/project-4.jpg",
      "/screenshots/project-5.jpg"
    ],

    demoVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",

    links: {
      live: "https://example.com",
      github: "https://github.com/username/project"
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y, opacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
          <Image
            src={projectData.heroImage}
            alt={projectData.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 border-primary/50 bg-primary/10 text-primary">
              Case Study
            </Badge>
            <h1 className="text-5xl md:text-7xl font-mono font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {projectData.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {projectData.subtitle}
            </p>

            <div className="flex flex-wrap gap-6 justify-center text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Client:</span>
                <span className="text-foreground">{projectData.client}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Duration:</span>
                <span className="text-foreground">{projectData.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Team:</span>
                <span className="text-foreground">{projectData.team}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-primary rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 terminal-glow flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-500" />
              The Problem
            </h2>

            <Card className="glass border-border/30 mb-8">
              <CardContent className="p-8">
                <p className="text-lg mb-6">
                  {projectData.problem.statement}
                </p>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Key Challenges
                  </h3>
                  {projectData.problem.challenges.map((challenge, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      <p className="text-muted-foreground">{challenge}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Solution Approach */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 terminal-glow flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-primary" />
              The Solution
            </h2>

            <p className="text-lg mb-12 text-muted-foreground">
              {projectData.solution.approach}
            </p>

            <Timeline steps={projectData.solution.steps} />
          </div>
        </motion.div>
      </section>

      {/* Technical Stack */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 terminal-glow flex items-center gap-3">
              <Code2 className="w-8 h-8 text-primary" />
              Tech Stack
            </h2>

            <div className="flex flex-wrap gap-3">
              {projectData.techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Badge
                    variant="outline"
                    className="px-4 py-2 text-sm border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 terminal-glow flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary" />
              Challenges & Solutions
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              {projectData.challenges.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="glass border-border/30 rounded-lg px-6 border-b-0"
                >
                  <AccordionTrigger className="hover:no-underline py-6">
                    <span className="text-left font-semibold">{item.challenge}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-muted-foreground">
                    {item.solution}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </section>

      {/* Results/Metrics */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 terminal-glow flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              Results & Impact
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {projectData.results.metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="glass border-border/30 text-center p-6">
                    <div className="text-3xl md:text-4xl font-bold mb-2">
                      <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                    </div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Testimonial */}
            {projectData.results.testimonial && (
              <Card className="glass border-border/30 p-8">
                <Quote className="w-8 h-8 text-primary/50 mb-4" />
                <blockquote className="text-lg mb-4 italic">
                  "{projectData.results.testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {projectData.results.testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{projectData.results.testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{projectData.results.testimonial.role}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </motion.div>
      </section>

      {/* Before/After Comparison */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 terminal-glow text-center">
              Before & After
            </h2>

            <BeforeAfterSlider
              beforeImage="/screenshots/before.jpg"
              afterImage="/screenshots/after.jpg"
              beforeLabel="Original Design"
              afterLabel="Redesigned"
            />
          </div>
        </motion.div>
      </section>

      {/* Image Gallery */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 terminal-glow text-center">
              Project Gallery
            </h2>

            <Carousel className="w-full">
              <CarouselContent>
                {projectData.screenshots.map((screenshot, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="glass border-border/30">
                        <CardContent className="flex aspect-video items-center justify-center p-0">
                          <Image
                            src={screenshot}
                            alt={`Screenshot ${index + 1}`}
                            width={1200}
                            height={675}
                            className="rounded-lg object-cover w-full h-full"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="glass border-border/30 hover:bg-primary/10" />
              <CarouselNext className="glass border-border/30 hover:bg-primary/10" />
            </Carousel>
          </div>
        </motion.div>
      </section>

      {/* Video Demo */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 terminal-glow text-center flex items-center justify-center gap-3">
              <PlayCircle className="w-8 h-8 text-primary" />
              Video Demo
            </h2>

            <Card className="glass border-border/30 overflow-hidden">
              <div className="relative aspect-video">
                <iframe
                  src={projectData.demoVideo}
                  title="Project Demo"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <Card className="glass border-border/30 p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 terminal-glow">
                View the Project
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Experience the live application or explore the codebase on GitHub.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                {projectData.links.live && (
                  <Button
                    size="lg"
                    className="gap-2 border-glow"
                    asChild
                  >
                    <a href={projectData.links.live} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      View Live Project
                    </a>
                  </Button>
                )}

                {projectData.links.github && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2"
                    asChild
                  >
                    <a href={projectData.links.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                      View on GitHub
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Next Project Navigation */}
      <section className="py-20 container mx-auto px-4">
        <Separator className="mb-20 bg-border/30" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Previous Project */}
              <Link href="/case-studies/previous-project">
                <Card className="glass border-border/30 p-6 group hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-3 mb-2">
                    <ArrowLeft className="w-4 h-4 text-primary group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm text-muted-foreground">Previous</span>
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    Mobile App Development
                  </h3>
                </Card>
              </Link>

              {/* Next Project */}
              <Link href="/case-studies/next-project">
                <Card className="glass border-border/30 p-6 group hover:scale-[1.02] transition-transform text-right">
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <span className="text-sm text-muted-foreground">Next</span>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    SaaS Dashboard Design
                  </h3>
                </Card>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SpaceBackground } from '@/components/SpaceBackground';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { BorderTrail } from '@/components/ui/border-trail';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { AnimatedBackground } from '@/components/ui/animated-background';
import {
  ExternalLink,
  Github,
  Terminal,
  Code2,
  Cpu,
  Database,
  Globe,
  Zap,
  BookOpen,
  CheckCircle2,
  Circle,
  ArrowLeft,
  ArrowRight,
  Play,
  Calendar,
  Users,
  Star,
  GitBranch,
  Eye
} from 'lucide-react';

// Mock project data - replace with your actual project data
const projectData = {
  id: 'terminal-chat-app',
  title: 'Terminal Chat Application',
  tagline: 'Real-time chat with a beautiful TUI interface',
  description: 'A sophisticated terminal-based chat application built with Bubbletea and Lipgloss, featuring real-time WebSocket communication, custom UI components, and a modern developer experience.',
  category: 'TUI Application',
  status: 'Production',
  featured: true,

  // Key metrics
  metrics: {
    stars: 127,
    forks: 23,
    contributors: 5,
    commits: 234,
    views: 1420,
    duration: '3 weeks',
    linesOfCode: '4,532',
    testCoverage: 87
  },

  // Technologies
  stack: {
    primary: ['Go', 'Bubbletea', 'Lipgloss'],
    backend: ['WebSocket', 'Redis', 'PostgreSQL'],
    tools: ['Docker', 'GitHub Actions', 'Make'],
    testing: ['Go Test', 'Testify', 'Mock']
  },

  // Features
  features: [
    {
      title: 'Real-time Messaging',
      description: 'WebSocket-based real-time communication with message history',
      status: 'completed'
    },
    {
      title: 'Custom TUI Components',
      description: 'Beautiful, reusable terminal UI components built with Lipgloss',
      status: 'completed'
    },
    {
      title: 'User Authentication',
      description: 'Secure JWT-based authentication with session management',
      status: 'completed'
    },
    {
      title: 'Message Persistence',
      description: 'PostgreSQL backend for message history and user data',
      status: 'completed'
    },
    {
      title: 'File Sharing',
      description: 'Share files and images through the terminal interface',
      status: 'in-progress'
    },
    {
      title: 'Voice Messages',
      description: 'Record and play voice messages in terminal',
      status: 'planned'
    }
  ],

  // Timeline
  timeline: [
    { date: '2024-01-15', event: 'Project Initiated', type: 'milestone' },
    { date: '2024-01-20', event: 'Core TUI Framework Complete', type: 'feature' },
    { date: '2024-01-25', event: 'WebSocket Integration', type: 'feature' },
    { date: '2024-02-01', event: 'First Beta Release', type: 'release' },
    { date: '2024-02-05', event: 'Database Integration', type: 'feature' },
    { date: '2024-02-10', event: 'Production Launch', type: 'milestone' }
  ],

  // Gallery
  gallery: [
    { type: 'screenshot', url: '/screenshots/chat-main.png', caption: 'Main chat interface' },
    { type: 'screenshot', url: '/screenshots/chat-login.png', caption: 'Login screen' },
    { type: 'video', url: '/demos/chat-demo.mp4', caption: 'Live demo' },
    { type: 'screenshot', url: '/screenshots/chat-settings.png', caption: 'Settings panel' }
  ],

  // Links
  links: {
    github: 'https://github.com/username/terminal-chat',
    demo: 'https://chat-demo.example.com',
    documentation: 'https://docs.example.com/terminal-chat'
  },

  // Challenges & Solutions
  challenges: [
    {
      challenge: 'Rendering complex UI in terminal',
      solution: 'Developed custom Lipgloss components with sophisticated layout system',
      impact: 'Achieved 60fps refresh rate with minimal CPU usage'
    },
    {
      challenge: 'Real-time synchronization',
      solution: 'Implemented WebSocket with Redis pub/sub for scalability',
      impact: 'Supports 1000+ concurrent users per server'
    },
    {
      challenge: 'Cross-platform compatibility',
      solution: 'Extensive testing on Windows Terminal, iTerm2, and Linux terminals',
      impact: '100% compatibility across major terminal emulators'
    }
  ],

  // Testimonials
  testimonials: [
    {
      author: 'Developer',
      role: 'Senior Engineer at TechCorp',
      content: 'This is the most beautiful TUI application I\'ve ever used. The attention to detail is incredible.',
      avatar: '/avatars/dev1.png'
    },
    {
      author: 'User',
      role: 'Open Source Contributor',
      content: 'Finally, a chat app that respects the terminal workflow. Love the keyboard shortcuts!',
      avatar: '/avatars/dev2.png'
    }
  ]
};

export default function ProjectCaseStudy() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  return (
    <main className="min-h-screen relative">
      <SpaceBackground speed={0.3} opacity={0.5} />
      <ScrollProgress className="top-0 z-50" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 font-mono">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
            <span>/</span>
            <span className="text-primary">{projectData.category}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Title Section */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-5xl md:text-6xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {projectData.title}
                  </h1>
                  <Badge className="font-mono" variant="outline">{projectData.status}</Badge>
                  {projectData.featured && (
                    <Badge className="font-mono bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-xl text-foreground/80 max-w-3xl">
                  {projectData.tagline}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button className="gap-2">
                  <Play className="h-4 w-4" />
                  Live Demo
                </Button>
                <Button variant="outline" className="gap-2">
                  <Github className="h-4 w-4" />
                  View Code
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {Object.entries(projectData.metrics).map(([key, value]) => (
                <Card key={key} className="glass-dark border-border/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-mono font-bold text-primary">{value}</p>
                    <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="w-max md:w-auto max-w-2xl mx-auto glass-dark">
                <TabsTrigger value="overview" className="font-mono text-xs sm:text-sm whitespace-nowrap">Overview</TabsTrigger>
                <TabsTrigger value="technical" className="font-mono text-xs sm:text-sm whitespace-nowrap">Technical</TabsTrigger>
                <TabsTrigger value="features" className="font-mono text-xs sm:text-sm whitespace-nowrap">Features</TabsTrigger>
                <TabsTrigger value="gallery" className="font-mono text-xs sm:text-sm whitespace-nowrap">Gallery</TabsTrigger>
                <TabsTrigger value="timeline" className="font-mono text-xs sm:text-sm whitespace-nowrap">Timeline</TabsTrigger>
              </TabsList>
            </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid lg:grid-cols-3 gap-8"
                >
                  {/* Main Description */}
                  <Card className="lg:col-span-2 glass-dark border-glow">
                    <CardHeader>
                      <CardTitle className="font-mono text-2xl">About This Project</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <p className="text-foreground/80 leading-relaxed">
                        {projectData.description}
                      </p>

                      <Separator className="my-6" />

                      <h3 className="font-mono text-lg text-primary">Key Achievements</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                          <span>Built a fully functional real-time chat system in the terminal</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                          <span>Achieved sub-100ms message delivery latency</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                          <span>Implemented custom UI components from scratch</span>
                        </li>
                      </ul>

                      <h3 className="font-mono text-lg text-primary mt-6">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {projectData.stack.primary.map((tech) => (
                          <HoverCard key={tech}>
                            <HoverCardTrigger asChild>
                              <Badge
                                variant="secondary"
                                className="cursor-pointer font-mono hover:bg-primary hover:text-primary-foreground transition-colors"
                              >
                                {tech}
                              </Badge>
                            </HoverCardTrigger>
                            <HoverCardContent className="glass-overlay border-glow">
                              <p className="font-mono font-semibold">{tech}</p>
                              <p className="text-sm text-muted-foreground">Primary technology used in this project</p>
                            </HoverCardContent>
                          </HoverCard>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Side Info */}
                  <div className="space-y-6">
                    {/* Quick Links */}
                    <Card className="glass-dark border-glow">
                      <CardHeader>
                        <CardTitle className="font-mono">Quick Links</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Github className="h-4 w-4" />
                          GitHub Repository
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Globe className="h-4 w-4" />
                          Live Demo
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <BookOpen className="h-4 w-4" />
                          Documentation
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Contributors */}
                    <Card className="glass-dark border-glow">
                      <CardHeader>
                        <CardTitle className="font-mono">Contributors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex -space-x-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Avatar key={i} className="border-2 border-background">
                              <AvatarFallback>C{i}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">
                          {projectData.metrics.contributors} contributors
                        </p>
                      </CardContent>
                    </Card>

                    {/* Test Coverage */}
                    <Card className="glass-dark border-glow">
                      <CardHeader>
                        <CardTitle className="font-mono">Test Coverage</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Overall</span>
                            <span className="font-mono text-primary">{projectData.metrics.testCoverage}%</span>
                          </div>
                          <Progress value={projectData.metrics.testCoverage} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Technical Tab */}
              <TabsContent value="technical" className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  {/* Tech Stack Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(projectData.stack).map(([category, techs]) => (
                      <Card key={category} className="glass-dark border-glow relative overflow-hidden">
                        <BorderTrail />
                        <CardHeader>
                          <CardTitle className="font-mono capitalize text-lg">{category}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {techs.map((tech) => (
                              <div
                                key={tech}
                                className="flex items-center gap-2 p-2 rounded hover:bg-primary/10 transition-colors cursor-pointer"
                                onClick={() => setSelectedTech(tech)}
                              >
                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                <span className="font-mono text-sm">{tech}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Architecture Diagram Placeholder */}
                  <Card className="glass-dark border-glow">
                    <CardHeader>
                      <CardTitle className="font-mono">System Architecture</CardTitle>
                      <CardDescription>High-level overview of the application architecture</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 rounded-lg bg-card/50 border border-border/50 flex items-center justify-center">
                        <p className="text-muted-foreground font-mono">Architecture Diagram</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Challenges & Solutions */}
                  <div className="space-y-6">
                    <h2 className="text-3xl font-mono font-bold text-primary">Challenges & Solutions</h2>
                    {projectData.challenges.map((item, index) => (
                      <Card key={index} className="glass-dark border-glow">
                        <CardContent className="p-6">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Challenge</p>
                              <p className="font-mono text-destructive">{item.challenge}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Solution</p>
                              <p className="text-foreground/90">{item.solution}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Impact</p>
                              <p className="font-mono text-primary">{item.impact}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectData.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="glass-dark border-glow h-full">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="font-mono text-lg">{feature.title}</CardTitle>
                              {feature.status === 'completed' && (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                              )}
                              {feature.status === 'in-progress' && (
                                <div className="flex items-center gap-1">
                                  <Circle className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  <span className="text-xs text-yellow-500">In Progress</span>
                                </div>
                              )}
                              {feature.status === 'planned' && (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-foreground/70">{feature.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <Card className="glass-dark border-glow">
                    <CardHeader>
                      <CardTitle className="font-mono">Project Gallery</CardTitle>
                      <CardDescription>Screenshots and demos of the application</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Carousel className="w-full">
                        <CarouselContent>
                          {projectData.gallery.map((item, index) => (
                            <CarouselItem key={index}>
                              <div className="p-1">
                                <Card className="border-border/50 bg-card/50">
                                  <CardContent className="flex aspect-video items-center justify-center p-6">
                                    {item.type === 'screenshot' ? (
                                      <div className="text-center">
                                        <Terminal className="h-12 w-12 mx-auto mb-2 text-primary" />
                                        <p className="text-sm text-muted-foreground">{item.caption}</p>
                                      </div>
                                    ) : (
                                      <div className="text-center">
                                        <Play className="h-12 w-12 mx-auto mb-2 text-primary" />
                                        <p className="text-sm text-muted-foreground">{item.caption}</p>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="glass-dark border-glow">
                    <CardHeader>
                      <CardTitle className="font-mono">Development Timeline</CardTitle>
                      <CardDescription>Key milestones and releases</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-96">
                        <div className="space-y-8">
                          {projectData.timeline.map((item, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="relative">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                  item.type === 'milestone' ? 'bg-primary' :
                                  item.type === 'release' ? 'bg-primary' :
                                  'bg-secondary'
                                }`}>
                                  {item.type === 'milestone' && <Zap className="h-5 w-5 text-primary-foreground" />}
                                  {item.type === 'release' && <Terminal className="h-5 w-5 text-primary-foreground" />}
                                  {item.type === 'feature' && <Code2 className="h-5 w-5 text-secondary-foreground" />}
                                </div>
                                {index < projectData.timeline.length - 1 && (
                                  <div className="absolute top-10 left-5 w-0.5 h-16 bg-border" />
                                )}
                              </div>
                              <div className="flex-1 pb-8">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-mono text-sm text-muted-foreground">{item.date}</p>
                                  <Badge variant="outline" className="text-xs">
                                    {item.type}
                                  </Badge>
                                </div>
                                <p className="font-semibold">{item.event}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
          </Tabs>

          {/* Testimonials */}
          <section className="mt-16 space-y-8">
            <h2 className="text-3xl font-mono font-bold text-center bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              What People Are Saying
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projectData.testimonials.map((testimonial, index) => (
                <Card key={index} className="glass-dark border-glow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-foreground/90 italic mb-4">"{testimonial.content}"</p>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Next/Previous Project Navigation */}
          <div className="flex items-center justify-between mt-16">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Previous Project
            </Button>
            <Button variant="outline" className="gap-2">
              Next Project
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
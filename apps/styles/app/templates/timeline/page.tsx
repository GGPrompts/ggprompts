"use client"

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Calendar, Building2, GraduationCap, Award, Code2, BookOpen, Download, Filter, Mail, Github, Linkedin, Globe, ChevronRight, Star, Briefcase, Clock, CheckCircle2, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { SpaceBackground } from '@/components/SpaceBackground'

// Sample data - replace with your actual data
const experiences = [
  {
    id: 1,
    company: "Tech Corp",
    role: "Senior Full Stack Developer",
    duration: "2022 - Present",
    startDate: new Date(2022, 0),
    endDate: null,
    description: "Leading development of cloud-native applications using Next.js, TypeScript, and AWS. Mentoring junior developers and architecting scalable solutions.",
    achievements: [
      "Reduced API response time by 60%",
      "Led team of 5 developers",
      "Implemented CI/CD pipeline"
    ],
    technologies: ["Next.js", "TypeScript", "AWS", "Docker", "PostgreSQL"],
    type: "work"
  },
  {
    id: 2,
    company: "StartupXYZ",
    role: "Full Stack Developer",
    duration: "2020 - 2022",
    startDate: new Date(2020, 3),
    endDate: new Date(2022, 0),
    description: "Built and maintained React applications with Node.js backends. Collaborated with design team to implement responsive UI components.",
    achievements: [
      "Developed 3 production applications",
      "Improved test coverage to 85%",
      "Reduced bundle size by 40%"
    ],
    technologies: ["React", "Node.js", "MongoDB", "Redux", "Jest"],
    type: "work"
  },
  {
    id: 3,
    company: "Digital Agency",
    role: "Frontend Developer",
    duration: "2018 - 2020",
    startDate: new Date(2018, 6),
    endDate: new Date(2020, 3),
    description: "Created responsive websites and web applications for various clients. Focused on performance optimization and accessibility.",
    achievements: [
      "Delivered 20+ client projects",
      "Achieved 100% Lighthouse scores",
      "Introduced component library"
    ],
    technologies: ["JavaScript", "HTML/CSS", "Vue.js", "Webpack", "Sass"],
    type: "work"
  }
]

const education = [
  {
    id: 4,
    institution: "University of Technology",
    degree: "Master of Computer Science",
    duration: "2016 - 2018",
    startDate: new Date(2016, 8),
    endDate: new Date(2018, 5),
    description: "Specialized in distributed systems and machine learning. Thesis on scalable web architectures.",
    achievements: ["GPA: 3.9/4.0", "Dean's List", "Research Assistant"],
    type: "education"
  },
  {
    id: 5,
    institution: "State University",
    degree: "Bachelor of Computer Science",
    duration: "2012 - 2016",
    startDate: new Date(2012, 8),
    endDate: new Date(2016, 5),
    description: "Foundation in computer science fundamentals, algorithms, and software engineering.",
    achievements: ["Cum Laude", "ACM Programming Team", "Hackathon Winner"],
    type: "education"
  }
]

const skills = {
  "Frontend": [
    { name: "React/Next.js", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "Tailwind CSS", level: 95 },
    { name: "Vue.js", level: 75 },
    { name: "Framer Motion", level: 85 }
  ],
  "Backend": [
    { name: "Node.js", level: 90 },
    { name: "Python", level: 80 },
    { name: "PostgreSQL", level: 85 },
    { name: "MongoDB", level: 75 },
    { name: "Redis", level: 70 }
  ],
  "DevOps": [
    { name: "Docker", level: 85 },
    { name: "AWS", level: 80 },
    { name: "CI/CD", level: 90 },
    { name: "Kubernetes", level: 65 },
    { name: "Terraform", level: 60 }
  ],
  "Tools": [
    { name: "Git", level: 95 },
    { name: "VS Code", level: 95 },
    { name: "Figma", level: 70 },
    { name: "Jest/Testing", level: 85 },
    { name: "Webpack", level: 75 }
  ]
}

const certifications = [
  {
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    credentialId: "AWS-XXX-12345"
  },
  {
    name: "Google Cloud Professional",
    issuer: "Google",
    date: "2022",
    credentialId: "GCP-XXX-67890"
  },
  {
    name: "Meta Frontend Developer",
    issuer: "Meta",
    date: "2021",
    credentialId: "META-XXX-54321"
  }
]

const projects = [
  {
    name: "E-commerce Platform",
    description: "Full-stack e-commerce solution with payment integration",
    technologies: ["Next.js", "Stripe", "PostgreSQL"],
    link: "/case-studies/ecommerce"
  },
  {
    name: "Real-time Chat App",
    description: "WebSocket-based chat application with video calling",
    technologies: ["React", "Socket.io", "WebRTC"],
    link: "/case-studies/chat-app"
  },
  {
    name: "Analytics Dashboard",
    description: "Data visualization dashboard for business metrics",
    technologies: ["Vue.js", "D3.js", "Python"],
    link: "/case-studies/analytics"
  }
]

const publications = [
  {
    title: "Optimizing React Performance at Scale",
    platform: "Medium",
    date: "2023",
    link: "https://medium.com/@example"
  },
  {
    title: "Building Resilient Microservices",
    platform: "Dev.to",
    date: "2022",
    link: "https://dev.to/example"
  }
]

const testimonials = [
  {
    name: "John Smith",
    role: "CTO at Tech Corp",
    content: "An exceptional developer who consistently delivers high-quality code and innovative solutions. A true asset to any team.",
    avatar: "/avatars/john.jpg"
  },
  {
    name: "Sarah Johnson",
    role: "Product Manager at StartupXYZ",
    content: "Outstanding technical skills combined with excellent communication. Always goes above and beyond to ensure project success.",
    avatar: "/avatars/sarah.jpg"
  }
]

// Timeline Node Component
const TimelineNode = ({ isActive = false, isPast = true }) => (
  <div className="relative">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "w-4 h-4 rounded-full border-2 bg-background",
        isActive && "border-primary terminal-glow",
        isPast && !isActive && "border-primary/50 bg-primary/20",
        !isPast && !isActive && "border-muted-foreground/30"
      )}
    />
    {isActive && (
      <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/50 animate-ping" />
    )}
  </div>
)

// Timeline Card Component
const TimelineCard = ({ item, index, type }: { item: any; index: number; type: string }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative grid grid-cols-[auto,1fr] md:grid-cols-[1fr,auto,1fr] gap-x-4 md:gap-x-8",
        "items-center"
      )}
    >
      {/* Left content */}
      <div className={cn(
        "md:text-right",
        index % 2 !== 0 && "md:col-start-3",
        "hidden md:block"
      )}>
        {index % 2 === 0 && (
          <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {type === 'work' ? (
                    <Building2 className="w-4 h-4 text-primary" />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-primary" />
                  )}
                  <CardTitle className="text-lg">
                    {type === 'work' ? item.role : item.degree}
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="text-primary/70 font-mono text-sm">
                {type === 'work' ? item.company : item.institution}
              </CardDescription>
              <Badge variant="outline" className="w-fit mt-2 border-primary/30">
                <Clock className="w-3 h-3 mr-1" />
                {item.duration}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {item.description}
              </p>
              {item.achievements && (
                <div className="space-y-1 mb-3">
                  {item.achievements.map((achievement: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{achievement}</span>
                    </div>
                  ))}
                </div>
              )}
              {item.technologies && (
                <div className="flex flex-wrap gap-1">
                  {item.technologies.map((tech: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Center timeline */}
      <div className="flex flex-col items-center">
        <TimelineNode isActive={isHovered} isPast={item.endDate ? new Date() > item.endDate : false} />
        <div className={cn(
          "w-0.5 h-32 bg-gradient-to-b",
          item.endDate && new Date() > item.endDate
            ? "from-primary/50 to-primary/20"
            : "from-primary/20 to-transparent"
        )} />
      </div>

      {/* Right content */}
      <div className={cn(
        "text-left",
        index % 2 === 0 && "md:col-start-3"
      )}>
        {/* Mobile: show all cards */}
        <div className="md:hidden">
          <TimelineCardContent item={item} type={type} />
        </div>
        {/* Desktop: show odd items */}
        {index % 2 !== 0 && (
          <div className="hidden md:block">
            <TimelineCardContent item={item} type={type} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Extract card content for reuse
const TimelineCardContent = ({ item, type }: { item: any; type: any }) => (
  <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {type === 'work' ? (
            <Building2 className="w-4 h-4 text-primary" />
          ) : (
            <GraduationCap className="w-4 h-4 text-primary" />
          )}
          <CardTitle className="text-lg">
            {type === 'work' ? item.role : item.degree}
          </CardTitle>
        </div>
      </div>
      <CardDescription className="text-primary/70 font-mono text-sm">
        {type === 'work' ? item.company : item.institution}
      </CardDescription>
      <Badge variant="outline" className="w-fit mt-2 border-primary/30">
        <Clock className="w-3 h-3 mr-1" />
        {item.duration}
      </Badge>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-3">
        {item.description}
      </p>
      {item.achievements && (
        <div className="space-y-1 mb-3">
          {item.achievements.map((achievement: string, i: number) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{achievement}</span>
            </div>
          ))}
        </div>
      )}
      {item.technologies && (
        <div className="flex flex-wrap gap-1">
          {item.technologies.map((tech: string, i: number) => (
            <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
              {tech}
            </Badge>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
)

// Years of Experience Counter
const ExperienceCounter = () => {
  const [years, setYears] = useState(0)
  const startYear = 2018 // Update with your actual start year
  const totalYears = new Date().getFullYear() - startYear

  useEffect(() => {
    const timer = setInterval(() => {
      setYears(prev => {
        if (prev < totalYears) return prev + 1
        clearInterval(timer)
        return totalYears
      })
    }, 100)
    return () => clearInterval(timer)
  }, [totalYears])

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="text-center"
    >
      <div className="text-4xl md:text-6xl font-bold text-primary terminal-glow font-mono">
        {years}+
      </div>
      <p className="text-sm text-muted-foreground mt-2">Years of Experience</p>
    </motion.div>
  )
}

// Skill Bar Component
const SkillBar = ({ skill, index }: { skill: any; index: number }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(skill.level)
    }, index * 100)
    return () => clearTimeout(timer)
  }, [skill.level, index])

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{skill.name}</span>
        <span className="text-xs text-primary font-mono">{skill.level}%</span>
      </div>
      <Progress value={progress} className="h-2 bg-primary/10" />
    </div>
  )
}

// Main Timeline Page Component
export default function TimelinePage() {
  const [filter, setFilter] = useState('all')
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Combine and sort timeline items
  const timelineItems = [...experiences, ...education].sort(
    (a, b) => (b.startDate?.getTime() || 0) - (a.startDate?.getTime() || 0)
  )

  const filteredItems = filter === 'all'
    ? timelineItems
    : timelineItems.filter(item => item.type === filter)

  const handleDownloadResume = () => {
    // Implement PDF download logic
    console.log('Downloading resume...')
  }

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />

      {/* Scroll Progress Indicator */}
      <motion.div
        style={{ scaleY }}
        className="fixed left-0 top-0 w-1 h-full bg-gradient-to-b from-primary via-primary/50 to-transparent origin-top z-50"
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Timeline & Resume
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            My professional journey, skills, and achievements
          </p>

          {/* Download Resume Button */}
          <Button
            size="lg"
            onClick={handleDownloadResume}
            className="glass border-primary/30 hover:border-primary/50 group"
          >
            <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
            Download Resume (PDF)
          </Button>
        </motion.div>

        {/* Years Counter and Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          <Card className="glass border-primary/20 p-6">
            <ExperienceCounter />
          </Card>
          <Card className="glass border-primary/20 p-6 text-center">
            <div className="text-3xl font-bold text-primary font-mono">50+</div>
            <p className="text-sm text-muted-foreground mt-2">Projects Completed</p>
          </Card>
          <Card className="glass border-primary/20 p-6 text-center">
            <div className="text-3xl font-bold text-primary font-mono">15+</div>
            <p className="text-sm text-muted-foreground mt-2">Technologies</p>
          </Card>
          <Card className="glass border-primary/20 p-6 text-center">
            <div className="text-3xl font-bold text-primary font-mono">3</div>
            <p className="text-sm text-muted-foreground mt-2">Certifications</p>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="timeline" className="space-y-8">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 glass w-max md:w-auto">
              <TabsTrigger value="timeline" className="text-xs sm:text-sm whitespace-nowrap">Timeline</TabsTrigger>
              <TabsTrigger value="skills" className="text-xs sm:text-sm whitespace-nowrap">Skills</TabsTrigger>
              <TabsTrigger value="projects" className="text-xs sm:text-sm whitespace-nowrap">Projects</TabsTrigger>
              <TabsTrigger value="about" className="text-xs sm:text-sm whitespace-nowrap">About</TabsTrigger>
            </TabsList>
          </div>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-8">
            {/* Filter Buttons */}
            <div className="flex justify-center gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className={cn(
                  "border-primary/30",
                  filter === 'all' && "bg-primary/20 text-primary"
                )}
              >
                <Filter className="w-4 h-4 mr-2" />
                All
              </Button>
              <Button
                variant={filter === 'work' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('work')}
                className={cn(
                  "border-primary/30",
                  filter === 'work' && "bg-primary/20 text-primary"
                )}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Work
              </Button>
              <Button
                variant={filter === 'education' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('education')}
                className={cn(
                  "border-primary/30",
                  filter === 'education' && "bg-primary/20 text-primary"
                )}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Education
              </Button>
            </div>

            {/* Timeline */}
            <div className="relative max-w-4xl mx-auto">
              {filteredItems.map((item, index) => (
                <TimelineCard key={item.id} item={item} index={index} type={item.type} />
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(skills).map(([category, categorySkills], categoryIndex) => (
                <Card key={category} className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-primary" />
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categorySkills.map((skill, index) => (
                      <SkillBar
                        key={skill.name}
                        skill={skill}
                        index={categoryIndex * 5 + index}
                      />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Certifications & Awards
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass border-primary/20 hover:border-primary/40 transition-all">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{cert.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {cert.issuer} • {cert.date}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline" className="text-xs border-primary/30">
                          ID: {cert.credentialId}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="glass border-primary/20 hover:border-primary/40 transition-all h-full">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {project.name}
                        <ExternalLink className="w-4 h-4 text-primary" />
                      </CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.map((tech: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full border border-primary/30 hover:bg-primary/10"
                        asChild
                      >
                        <a href={project.link}>
                          View Case Study
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Publications */}
            {publications.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Publications & Talks
                </h3>
                <div className="space-y-4">
                  {publications.map((pub, index) => (
                    <Card key={index} className="glass border-primary/20">
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <div>
                          <CardTitle className="text-base">{pub.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {pub.platform} • {pub.date}
                          </CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={pub.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-8">
            {/* Contact Card */}
            <Card className="glass border-primary/20 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Get In Touch</CardTitle>
                <CardDescription>
                  Let's discuss your next project or opportunity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="border-primary/30" asChild>
                    <a href="mailto:your.email@example.com">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="border-primary/30" asChild>
                    <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="border-primary/30" asChild>
                    <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="border-primary/30" asChild>
                    <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">
                What Others Say
              </h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass border-primary/20 h-full">
                      <CardHeader>
                        <div className="flex items-start gap-2 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <CardDescription className="text-sm italic">
                          "{testimonial.content}"
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-bold">
                              {testimonial.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
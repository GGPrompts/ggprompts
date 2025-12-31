'use client'

import { motion } from 'framer-motion'
import {
  Download,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Calendar,
  MapPin,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  CheckCircle,
  ExternalLink,
  Star,
  TrendingUp,
  Users,
  Zap,
  Brain,
  Sparkles
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export default function ResumeTimelinePage() {
  const timelineData = [
    {
      year: '2024',
      title: 'AI-Powered Development Lead',
      company: 'Claude Projects Initiative',
      description: 'Built 50+ production applications with Claude, pioneering AI-assisted development workflows',
      achievements: ['50 Claude projects', '100% deployment rate', '5x productivity increase'],
      type: 'work'
    },
    {
      year: '2023',
      title: 'Senior Full-Stack Developer',
      company: 'TechForward Solutions',
      description: 'Led development of enterprise SaaS platform serving 10,000+ users',
      achievements: ['Microservices architecture', 'React/Next.js frontend', 'DevOps automation'],
      type: 'work'
    },
    {
      year: '2022',
      title: 'Full-Stack Developer',
      company: 'Digital Innovations Lab',
      description: 'Developed real-time collaboration tools and data visualization dashboards',
      achievements: ['WebSocket implementation', 'D3.js visualizations', 'AWS deployment'],
      type: 'work'
    },
    {
      year: '2021',
      title: 'Bachelor of Computer Science',
      company: 'Tech University',
      description: 'Graduated with honors, specialized in AI and Machine Learning',
      achievements: ['3.9 GPA', 'Dean\'s List', 'Best Thesis Award'],
      type: 'education'
    },
    {
      year: '2020',
      title: 'Junior Developer',
      company: 'StartupHub',
      description: 'Built MVPs for multiple startups, focusing on rapid prototyping',
      achievements: ['5 successful launches', 'React Native apps', 'Node.js backends'],
      type: 'work'
    }
  ]

  const skills = [
    { name: 'React/Next.js', level: 95, category: 'Frontend' },
    { name: 'TypeScript', level: 90, category: 'Languages' },
    { name: 'Node.js', level: 85, category: 'Backend' },
    { name: 'Claude AI', level: 95, category: 'AI Tools' },
    { name: 'Python', level: 80, category: 'Languages' },
    { name: 'AWS/Vercel', level: 85, category: 'Cloud' },
    { name: 'PostgreSQL', level: 75, category: 'Database' },
    { name: 'Docker', level: 70, category: 'DevOps' },
    { name: 'TailwindCSS', level: 90, category: 'Frontend' },
    { name: 'GraphQL', level: 75, category: 'API' }
  ]

  const projects = [
    {
      name: 'AI Code Assistant Platform',
      description: 'Built with Claude to help 1000+ developers',
      tech: ['Next.js', 'Claude API', 'Vercel'],
      metrics: '1000+ users'
    },
    {
      name: 'Real-time Analytics Dashboard',
      description: 'Enterprise dashboard processing 1M+ events/day',
      tech: ['React', 'WebSockets', 'D3.js'],
      metrics: '1M+ events/day'
    },
    {
      name: 'E-commerce Marketplace',
      description: 'Full-stack marketplace with AI recommendations',
      tech: ['Next.js', 'Stripe', 'PostgreSQL'],
      metrics: '$100K+ GMV'
    },
    {
      name: 'Terminal UI Framework',
      description: 'Beautiful TUI apps with Bubbletea/Lipgloss',
      tech: ['Go', 'Bubbletea', 'Lipgloss'],
      metrics: '500+ stars'
    }
  ]

  const achievements = [
    { icon: Sparkles, title: '50 Claude Projects', description: 'Pioneer in AI-assisted development' },
    { icon: TrendingUp, title: '5x Productivity', description: 'Increased output with AI workflows' },
    { icon: Users, title: '10K+ Users Served', description: 'Apps reaching global audience' },
    { icon: Award, title: 'Best Innovation 2024', description: 'For AI development practices' }
  ]

  const certifications = [
    { name: 'AWS Solutions Architect', year: '2023', issuer: 'Amazon' },
    { name: 'Google Cloud Professional', year: '2023', issuer: 'Google' },
    { name: 'Meta React Certificate', year: '2022', issuer: 'Meta' }
  ]

  return (
    <div className="min-h-screen text-foreground">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Card className="glass border-white/10 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Avatar className="w-32 h-32 border-4 border-primary/30">
                  <AvatarImage src="/api/placeholder/128/128" alt="Matt Johnson" />
                  <AvatarFallback className="bg-primary/20 text-3xl">MJ</AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2 terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Matt Johnson</h1>
                <h2 className="text-2xl text-muted-foreground mb-4">AI-Powered Full-Stack Developer</h2>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    <MapPin className="w-3 h-3 mr-1" />
                    San Francisco, CA
                  </Badge>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    <Mail className="w-3 h-3 mr-1" />
                    matt@example.com
                  </Badge>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Available for hire
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-6 max-w-2xl">
                  Pioneering AI-assisted development with Claude. Built 50+ production applications
                  leveraging cutting-edge AI workflows. Passionate about creating beautiful,
                  performant web experiences and terminal applications.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button className="bg-primary/20 hover:bg-primary/30 border border-primary/30">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                  <Button variant="outline" className="border-primary/30">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Me
                  </Button>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="hover:text-primary">
                      <Github className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="hover:text-primary">
                      <Linkedin className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="hover:text-primary">
                      <Twitter className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Achievement Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 terminal-glow">Key Achievements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass border-white/10 p-4 h-full">
                  <achievement.icon className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-1">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="timeline" className="mb-12">
          <TabsList className="glass border-white/10 mb-8">
            <TabsTrigger value="timeline">Career Timeline</TabsTrigger>
            <TabsTrigger value="skills">Skills Matrix</TabsTrigger>
            <TabsTrigger value="projects">Featured Projects</TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass border-white/10 p-8">
                <h3 className="text-2xl font-bold mb-8 terminal-glow">Career Journey</h3>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-secondary/50 to-primary/50" />

                  {/* Timeline items */}
                  <div className="space-y-8">
                    {timelineData.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="relative flex items-start gap-6"
                      >
                        {/* Timeline dot */}
                        <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full glass border-2 border-primary/50">
                          {item.type === 'work' ? (
                            <Briefcase className="w-6 h-6 text-primary" />
                          ) : (
                            <GraduationCap className="w-6 h-6 text-secondary" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-mono text-primary">{item.year}</span>
                            <Badge variant="outline" className={cn(
                              "border-white/20",
                              item.type === 'work' ? 'text-primary' : 'text-secondary'
                            )}>
                              {item.type === 'work' ? 'Work' : 'Education'}
                            </Badge>
                          </div>
                          <h4 className="text-xl font-semibold mb-1">{item.title}</h4>
                          <p className="text-muted-foreground mb-2">{item.company}</p>
                          <p className="mb-3">{item.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {item.achievements.map((achievement, j) => (
                              <Badge key={j} variant="secondary" className="bg-primary/10 text-primary">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass border-white/10 p-8">
                <h3 className="text-2xl font-bold mb-8 terminal-glow">Technical Proficiency</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {skills.map((skill, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                    >
                      <div className="mb-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-primary" />
                          <span className="font-medium">{skill.name}</span>
                          <Badge variant="outline" className="text-xs border-white/20">
                            {skill.category}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress
                        value={skill.level}
                        className="h-2 bg-muted/50"
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-6 glass rounded-lg border border-primary/20">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Development Expertise
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">Claude Integration</h5>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-primary" />
                          50+ production projects
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-primary" />
                          Custom workflow automation
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-primary" />
                          Prompt engineering expertise
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">AI Tools & Frameworks</h5>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-primary" />
                          LangChain & Vector DBs
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-primary" />
                          OpenAI API integration
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-primary" />
                          RAG implementation
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass border-white/10 p-8">
                <h3 className="text-2xl font-bold mb-8 terminal-glow">Featured Projects</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="glass border-border/30 p-6 h-full">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold">{project.name}</h4>
                          <Button size="icon" variant="ghost" className="hover:text-primary">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech.map((tech, j) => (
                            <Badge key={j} variant="outline" className="border-primary/30 text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Zap className="w-4 h-4" />
                          {project.metrics}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 glass rounded-lg border border-primary/20 text-center">
                  <p className="text-muted-foreground mb-2">
                    Built <span className="text-primary font-bold">50+ projects</span> with Claude AI
                  </p>
                  <Button variant="link" className="text-primary hover:text-primary">
                    View All Projects <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Education & Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="glass border-white/10 p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Education
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Bachelor of Computer Science</h4>
                <p className="text-muted-foreground">Tech University • 2021</p>
                <p className="text-sm mt-1">Specialized in AI/ML • 3.9 GPA • Dean's List</p>
              </div>
              <div>
                <h4 className="font-semibold">AI Development Bootcamp</h4>
                <p className="text-muted-foreground">Claude Academy • 2024</p>
                <p className="text-sm mt-1">Advanced prompt engineering and AI workflows</p>
              </div>
            </div>
          </Card>

          <Card className="glass border-white/10 p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Certifications
            </h3>
            <div className="space-y-3">
              {certifications.map((cert, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <Badge variant="outline" className="border-primary/30">
                    {cert.year}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="glass border-primary/30 p-8 text-center border-glow">
            <h3 className="text-2xl font-bold mb-4 terminal-glow">Let's Build Something Amazing</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              I'm currently available for freelance work and exciting full-time opportunities.
              Let's discuss how AI-powered development can transform your next project.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-primary/20 hover:bg-primary/30 border border-primary/30">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule a Call
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
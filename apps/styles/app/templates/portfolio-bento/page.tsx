"use client"

import React, { useState } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Briefcase,
  Code,
  Palette,
  Zap,
  Star,
  GitFork,
  Activity,
  TrendingUp,
  Coffee,
  Music,
  Camera,
  Book,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  Send,
  Award,
  Target,
  Users,
  Calendar,
  Clock,
  Sparkles,
  Terminal,
  Quote,
  GripVertical,
  Eye,
  ThumbsUp
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Avatar, AvatarFallback, AvatarImage, Input, Textarea, Progress, Separator, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ggprompts/ui"

// Mock data
const profile = {
  name: "Taylor Rivers",
  role: "Full-Stack Developer & UI/UX Designer",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
  location: "Seattle, WA",
  email: "taylor@rivers.dev",
  bio: "Building delightful digital experiences with modern web technologies. Coffee enthusiast ☕, open source contributor 🌟, and lifelong learner 📚",
  stats: {
    projects: 47,
    contributions: 2341,
    followers: 1829,
    stars: 3421
  }
}

const projects = [
  {
    id: 1,
    title: "TaskFlow Pro",
    description: "A beautiful task management app with real-time collaboration",
    image: "/api/placeholder/600/400",
    tags: ["React", "Firebase", "TailwindCSS"],
    stats: { stars: 234, views: 1823 },
    color: "from-blue-500/20 to-cyan-500/20",
    size: "large"
  },
  {
    id: 2,
    title: "DevTools CLI",
    description: "Command-line toolkit for modern developers",
    image: "/api/placeholder/400/300",
    tags: ["Node.js", "TypeScript"],
    stats: { stars: 567, views: 3421 },
    color: "from-purple-500/20 to-pink-500/20",
    size: "medium"
  },
  {
    id: 3,
    title: "Design System",
    description: "Comprehensive component library",
    image: "/api/placeholder/400/300",
    tags: ["React", "Storybook"],
    stats: { stars: 892, views: 5234 },
    color: "from-green-500/20 to-emerald-500/20",
    size: "medium"
  },
  {
    id: 4,
    title: "API Gateway",
    description: "Microservices orchestration platform",
    image: "/api/placeholder/600/400",
    tags: ["Go", "Docker", "Kubernetes"],
    stats: { stars: 421, views: 2134 },
    color: "from-orange-500/20 to-red-500/20",
    size: "large"
  }
]

const skills = [
  { name: "React/Next.js", level: 95, color: "bg-blue-500" },
  { name: "TypeScript", level: 90, color: "bg-cyan-500" },
  { name: "Node.js", level: 85, color: "bg-green-500" },
  { name: "UI/UX Design", level: 88, color: "bg-purple-500" },
  { name: "Python", level: 75, color: "bg-yellow-500" },
  { name: "DevOps", level: 70, color: "bg-orange-500" }
]

const testimonials = [
  {
    id: 1,
    author: "Sarah Chen",
    role: "Product Manager at Axiom",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content: "Taylor's ability to bridge design and engineering is exceptional. The products we built together exceeded all expectations.",
    rating: 5
  },
  {
    id: 2,
    author: "Marcus Johnson",
    role: "CTO at StartupX",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    content: "One of the most talented developers I've worked with. Delivers high-quality code and great user experiences.",
    rating: 5
  },
  {
    id: 3,
    author: "Elena Rodriguez",
    role: "Designer at Figma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    content: "Taylor has an eye for detail and a deep understanding of user needs. A true design-minded developer.",
    rating: 5
  }
]

const githubActivity = [
  { date: "2024-01-20", commits: 8, type: "commit" },
  { date: "2024-01-19", commits: 5, type: "commit" },
  { date: "2024-01-18", commits: 12, type: "commit" },
  { date: "2024-01-17", commits: 3, type: "commit" },
  { date: "2024-01-16", commits: 7, type: "commit" }
]

const interests = [
  { icon: Coffee, label: "Coffee", color: "text-amber-500" },
  { icon: Music, label: "Music", color: "text-purple-500" },
  { icon: Camera, label: "Photography", color: "text-blue-500" },
  { icon: Book, label: "Reading", color: "text-green-500" }
]

type BentoCard = {
  id: string
  component: React.ReactNode
  className: string
}

export default function BentoPortfolio() {
  const [isReordering, setIsReordering] = useState(false)
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("sending")
    await new Promise(resolve => setTimeout(resolve, 1500))
    setFormStatus("sent")
    setTimeout(() => {
      setFormStatus("idle")
      setContactForm({ name: "", email: "", message: "" })
    }, 3000)
  }

  // Hero Card
  const HeroCard = (
    <Card className="glass border-white/10 overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-start gap-6 mb-6">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>TR</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 terminal-glow">{profile.name}</h1>
            <p className="text-muted-foreground mb-3">{profile.role}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Available for hire
              </span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          {profile.bio}
        </p>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Projects", value: profile.stats.projects, icon: Briefcase },
            { label: "Commits", value: profile.stats.contributions, icon: Activity },
            { label: "Followers", value: profile.stats.followers, icon: Users },
            { label: "Stars", value: profile.stats.stars, icon: Star }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="glass rounded-lg p-3 mb-2">
                <stat.icon className="w-5 h-5 mx-auto text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-6">
          {[
            { icon: Github, href: "https://github.com", color: "hover:text-foreground" },
            { icon: Linkedin, href: "https://linkedin.com", color: "hover:text-blue-400" },
            { icon: Twitter, href: "https://twitter.com", color: "hover:text-secondary" },
            { icon: Mail, href: "mailto:taylor@rivers.dev", color: "hover:text-primary" }
          ].map(({ icon: Icon, href, color }) => (
            <a
              key={href}
              href={href}
              className={`glass rounded-lg p-2 text-muted-foreground transition-colors ${color}`}
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  // Skills Card
  const SkillsCard = (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5 text-primary" />
          Skills & Expertise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{skill.name}</span>
              <span className="text-xs text-muted-foreground">{skill.level}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-full ${skill.color}`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  // Projects Grid
  const ProjectsCard = (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Featured Projects
        </CardTitle>
        <CardDescription>Recent work and open source contributions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.02 }}
              className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${project.color} border border-white/10 p-4 cursor-pointer group`}
            >
              <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors" />
              <div className="relative z-10">
                <h4 className="font-bold mb-1">{project.title}</h4>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {project.stats.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {project.stats.views}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  // Testimonials Card
  const TestimonialsCard = (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-primary" />
          Testimonials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            whileHover={{ scale: 1.02 }}
            className="glass-dark rounded-lg p-4 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </div>
              <div className="flex gap-0.5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "{testimonial.content}"
            </p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )

  // GitHub Activity Card
  const GitHubCard = (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="w-5 h-5 text-primary" />
          GitHub Activity
        </CardTitle>
        <CardDescription>Recent contributions and commits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {githubActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="glass rounded-lg p-2">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {activity.commits} commits
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <Progress
                  value={(activity.commits / 15) * 100}
                  className="h-1.5 mt-2"
                />
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4 bg-white/10" />

        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">234</p>
            <p className="text-xs text-muted-foreground">PRs</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">567</p>
            <p className="text-xs text-muted-foreground">Issues</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">89%</p>
            <p className="text-xs text-muted-foreground">Review Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Interests Card
  const InterestsCard = (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Interests & Hobbies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {interests.map((interest) => (
            <motion.div
              key={interest.label}
              whileHover={{ scale: 1.05 }}
              className="glass-dark rounded-lg p-4 text-center cursor-pointer border border-white/10"
            >
              <interest.icon className={`w-8 h-8 mx-auto mb-2 ${interest.color}`} />
              <p className="text-sm font-medium">{interest.label}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  // Contact Card
  const ContactCard = (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          Get In Touch
        </CardTitle>
        <CardDescription>Let's build something amazing together</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Your name"
            value={contactForm.name}
            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
            className="glass-dark border-white/20"
            required
          />
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={contactForm.email}
            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
            className="glass-dark border-white/20"
            required
          />
          <Textarea
            placeholder="Your message..."
            value={contactForm.message}
            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
            className="glass-dark border-white/20 resize-none"
            rows={4}
            required
          />
          <Button
            type="submit"
            className="w-full"
            disabled={formStatus !== "idle"}
          >
            {formStatus === "idle" && (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
            {formStatus === "sending" && "Sending..."}
            {formStatus === "sent" && "Message Sent! ✓"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )

  // Stats Card
  const StatsCard = (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          This Year
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { label: "Projects Completed", value: 12, icon: Target, color: "text-blue-400" },
          { label: "Lines of Code", value: "45K+", icon: Code, color: "text-green-400" },
          { label: "Client Rating", value: "4.9/5", icon: Award, color: "text-yellow-400" },
          { label: "Coffee Consumed", value: "∞", icon: Coffee, color: "text-amber-400" }
        ].map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="glass rounded-lg p-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <span className="text-lg font-bold text-primary">{stat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1800px] mx-auto mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow mb-2">Bento Portfolio</h1>
            <p className="text-muted-foreground">
              A modular, grid-based portfolio layout
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsReordering(!isReordering)}
            className="border-primary/30"
          >
            <GripVertical className="w-4 h-4 mr-2" />
            {isReordering ? "Done" : "Rearrange"}
          </Button>
        </div>
      </motion.div>

      {/* Bento Grid */}
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {/* Hero - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            {HeroCard}
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {SkillsCard}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {StatsCard}
          </motion.div>

          {/* Projects - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            {ProjectsCard}
          </motion.div>

          {/* GitHub Activity */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {GitHubCard}
          </motion.div>

          {/* Interests */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            {InterestsCard}
          </motion.div>

          {/* Testimonials - Spans 2 columns, 2 rows */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 lg:row-span-2"
          >
            {TestimonialsCard}
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2"
          >
            {ContactCard}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="max-w-[1800px] mx-auto mt-16 pt-8 border-t border-white/10"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 {profile.name}. Built with Next.js & shadcn/ui
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4 fill-red-400 text-red-400" />
              Made with passion
            </span>
            <span className="flex items-center gap-1">
              <Coffee className="w-4 h-4 text-amber-400" />
              Fueled by coffee
            </span>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

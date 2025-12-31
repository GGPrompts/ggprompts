"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Mail,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Send,
  Download,
  Briefcase,
  GraduationCap,
  Award,
  Terminal,
  Code2,
  Palette,
  Database,
  Globe,
  Sparkles,
  ChevronDown,
  X,
  Check,
  MapPin,
  Calendar,
  Clock
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Mock data
const profile = {
  name: "Jordan Mitchell",
  title: "Product Designer & Creative Developer",
  tagline: "Crafting digital experiences that blend beauty with functionality",
  location: "Brooklyn, NY",
  availability: "Available for freelance",
  email: "hello@jordanmitchell.co",
  social: {
    github: "jordanmitchell",
    linkedin: "jordan-mitchell",
    twitter: "jordan_creates"
  }
}

const projects = [
  {
    id: 1,
    title: "Zenith Design System",
    category: "Design System",
    year: "2024",
    description: "A comprehensive design system for modern web applications with 120+ components and extensive documentation.",
    tags: ["React", "Storybook", "Figma", "TypeScript"],
    image: "/api/placeholder/800/600",
    link: "https://zenith.design",
    featured: true
  },
  {
    id: 2,
    title: "Aurora Analytics",
    category: "SaaS Platform",
    year: "2024",
    description: "Real-time analytics platform with beautiful data visualizations and predictive insights.",
    tags: ["Next.js", "D3.js", "PostgreSQL", "TailwindCSS"],
    image: "/api/placeholder/800/600",
    link: "https://aurora-analytics.app",
    featured: true
  },
  {
    id: 3,
    title: "Mindful App",
    category: "Mobile App",
    year: "2023",
    description: "Meditation and mindfulness app with guided sessions and progress tracking.",
    tags: ["React Native", "Firebase", "Animations", "Wellness"],
    image: "/api/placeholder/800/600",
    link: "https://mindfulapp.io",
    featured: false
  },
  {
    id: 4,
    title: "Codecast Platform",
    category: "Education",
    year: "2023",
    description: "Interactive coding tutorial platform with live code execution and AI-powered feedback.",
    tags: ["WebAssembly", "Monaco Editor", "AI", "Education"],
    image: "/api/placeholder/800/600",
    link: "https://codecast.dev",
    featured: true
  },
  {
    id: 5,
    title: "Portfolio Generator",
    category: "Developer Tool",
    year: "2023",
    description: "CLI tool to generate beautiful portfolio websites from JSON configuration.",
    tags: ["Node.js", "CLI", "Templates", "Open Source"],
    image: "/api/placeholder/800/600",
    link: "https://github.com/portfolio-gen",
    featured: false
  },
  {
    id: 6,
    title: "Neon CMS",
    category: "Content Platform",
    year: "2022",
    description: "Headless CMS with a focus on developer experience and content versioning.",
    tags: ["GraphQL", "Node.js", "MongoDB", "API"],
    image: "/api/placeholder/800/600",
    link: "https://neoncms.io",
    featured: false
  }
]

const skills = [
  { name: "UI/UX Design", icon: Palette, level: "Expert" },
  { name: "Frontend Development", icon: Code2, level: "Expert" },
  { name: "TypeScript", icon: Terminal, level: "Advanced" },
  { name: "React & Next.js", icon: Code2, level: "Expert" },
  { name: "Database Design", icon: Database, level: "Advanced" },
  { name: "Design Systems", icon: Sparkles, level: "Expert" }
]

const experience = [
  {
    role: "Senior Product Designer",
    company: "Axiom Digital",
    period: "2022 - Present",
    description: "Leading design for enterprise SaaS products, managing a team of 4 designers."
  },
  {
    role: "Design Engineer",
    company: "Starlight Labs",
    period: "2020 - 2022",
    description: "Bridged design and engineering, building design systems and component libraries."
  },
  {
    role: "UI Designer",
    company: "Freelance",
    period: "2018 - 2020",
    description: "Worked with startups and agencies on branding, web design, and product design."
  }
]

const education = [
  {
    degree: "B.S. in Computer Science",
    school: "NYU Tandon School of Engineering",
    year: "2018"
  },
  {
    degree: "UX Design Certification",
    school: "Nielsen Norman Group",
    year: "2020"
  }
]

export default function MinimalPortfolio() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState("work")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("sending")

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setFormStatus("sent")
    setTimeout(() => {
      setFormStatus("idle")
      setFormData({ name: "", email: "", message: "" })
    }, 3000)
  }

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen">
      {/* Minimal Header/Nav */}
      <header className="fixed top-0 left-0 right-0 z-[60] backdrop-blur-md border-b border-white/10 bg-background/95">
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight text-foreground">
            JM
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => scrollToSection("work")}
              className="text-sm transition-colors"
              style={{ color: activeSection === "work" ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}
            >
              Work
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm transition-colors"
              style={{ color: activeSection === "about" ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm transition-colors"
              style={{ color: activeSection === "contact" ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}
            >
              Contact
            </button>
          </div>

          <div className="flex items-center gap-4">
            {[
              { icon: Github, href: `https://github.com/${profile.social.github}`, label: 'GitHub' },
              { icon: Linkedin, href: `https://linkedin.com/in/${profile.social.linkedin}`, label: 'LinkedIn' },
              { icon: Twitter, href: `https://twitter.com/${profile.social.twitter}`, label: 'Twitter' }
            ].map(({ icon: Icon, href, label }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors text-foreground hover:text-primary"
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-5xl mx-auto text-center">
          <div>
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
              {profile.availability}
            </Badge>

            <h1 className="text-6xl md:text-8xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6 leading-tight">
              {profile.name.split(" ")[0]}
              <br />
              <span className="terminal-glow">{profile.name.split(" ")[1]}</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {profile.tagline}
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-12">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {profile.email}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => scrollToSection("work")}
                className="group"
              >
                View My Work
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30"
                onClick={() => scrollToSection("contact")}
              >
                Get In Touch
              </Button>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <ChevronDown className="w-6 h-6 text-muted-foreground animate-bounce" />
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="min-h-screen py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4">Selected Work</h2>
            <p className="text-xl text-muted-foreground">
              A curated collection of my recent projects
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setSelectedProject(project.id)}
                onMouseLeave={() => setSelectedProject(null)}
              >
                <Card className="group glass border-white/10 overflow-hidden hover:border-primary/30 transition-all duration-500">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full bg-background/50"
                    />
                    {project.featured && (
                      <Badge className="absolute top-4 right-4 bg-primary/20 text-primary border-primary/50">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                          {project.category} • {project.year}
                        </p>
                        <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {selectedProject === project.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {project.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      className="group/btn p-0 h-auto font-semibold"
                      asChild
                    >
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        View Project
                        <ExternalLink className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen py-24 px-6 bg-background/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4">About Me</h2>
            <p className="text-xl text-muted-foreground max-w-3xl">
              I'm a designer and developer who believes great products are born from the intersection of beautiful design and thoughtful engineering.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Skills & Expertise
              </h3>
              <div className="space-y-6">
                {skills.map((skill) => {
                  const Icon = skill.icon
                  return (
                    <div key={skill.name} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="glass rounded-lg p-2">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{skill.name}</span>
                        </div>
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          {skill.level}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Experience & Education */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                Experience
              </h3>
              <div className="space-y-6 mb-12">
                {experience.map((job, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-primary/30">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background" />
                    <div className="mb-1">
                      <h4 className="font-semibold text-lg">{job.role}</h4>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <p className="text-xs text-primary mb-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {job.period}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                Education
              </h3>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="glass rounded-lg p-4 border border-white/10">
                    <h4 className="font-semibold mb-1">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">{edu.school}</p>
                    <p className="text-xs text-primary mt-2">{edu.year}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Download Resume */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button size="lg" variant="outline" className="border-primary/30 group">
              <Download className="mr-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
              Download Resume
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center justify-center py-24 px-6">
        <div className="max-w-2xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4">Let's Talk</h2>
            <p className="text-xl text-muted-foreground">
              Have a project in mind? Let's create something amazing together.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-white/10">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="glass-dark border-white/20 focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="glass-dark border-white/20 focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your project..."
                      rows={6}
                      className="glass-dark border-white/20 focus:border-primary resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full group"
                    disabled={formStatus === "sending" || formStatus === "sent"}
                  >
                    {formStatus === "idle" && (
                      <>
                        Send Message
                        <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                    {formStatus === "sending" && "Sending..."}
                    {formStatus === "sent" && (
                      <>
                        <Check className="mr-2 w-4 h-4" />
                        Message Sent!
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Or email me directly at</p>
              <a
                href={`mailto:${profile.email}`}
                className="text-primary hover:underline font-medium"
              >
                {profile.email}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-muted-foreground">
              © 2024 {profile.name}. Designed & built with care.
            </p>

            <div className="flex items-center gap-6">
              {[
                { icon: Github, href: `https://github.com/${profile.social.github}`, label: "GitHub" },
                { icon: Linkedin, href: `https://linkedin.com/in/${profile.social.linkedin}`, label: "LinkedIn" },
                { icon: Twitter, href: `https://twitter.com/${profile.social.twitter}`, label: "Twitter" }
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

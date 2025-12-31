'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  FileText,
  Image as ImageIcon,
  Palette,
  Type,
  Award,
  Newspaper,
  Video,
  Mic,
  Mail,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Building2,
  Calendar,
  Users,
  TrendingUp,
  Sparkles,
  Quote,
  Camera,
  Share2
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// Brand assets
const logoVariations = [
  { id: 'primary', name: 'Primary Logo', format: 'SVG, PNG', bg: 'dark', size: '2.3 MB' },
  { id: 'white', name: 'White Logo', format: 'SVG, PNG', bg: 'primary', size: '1.8 MB' },
  { id: 'black', name: 'Black Logo', format: 'SVG, PNG', bg: 'light', size: '1.8 MB' },
  { id: 'icon', name: 'Icon Only', format: 'SVG, PNG, ICO', bg: 'dark', size: '1.2 MB' },
  { id: 'wordmark', name: 'Wordmark', format: 'SVG, PNG', bg: 'dark', size: '1.5 MB' },
  { id: 'stacked', name: 'Stacked', format: 'SVG, PNG', bg: 'dark', size: '2.1 MB' }
]

// Color palette
const colors = [
  { name: 'Primary', hex: '#10B981', rgb: '16, 185, 129', hsl: '160, 84%, 39%', usage: 'Main brand color, CTAs, links' },
  { name: 'Secondary', hex: '#06B6D4', rgb: '6, 182, 212', hsl: '187, 94%, 43%', usage: 'Accents, highlights' },
  { name: 'Background', hex: '#0C0D0D', rgb: '12, 13, 13', hsl: '220, 13%, 5%', usage: 'Page backgrounds' },
  { name: 'Foreground', hex: '#F0FDFA', rgb: '240, 253, 250', hsl: '160, 84%, 95%', usage: 'Text, content' },
  { name: 'Muted', hex: '#374151', rgb: '55, 65, 81', hsl: '220, 13%, 25%', usage: 'Secondary text' },
  { name: 'Border', hex: '#2A4D43', rgb: '42, 77, 67', hsl: '160, 60%, 25%', usage: 'Borders, dividers' }
]

// Typography
const typography = [
  { name: 'Heading Font', family: 'Inter', weight: '700', usage: 'Headers, titles', link: 'https://fonts.google.com/specimen/Inter' },
  { name: 'Body Font', family: 'Inter', weight: '400', usage: 'Body text, paragraphs', link: 'https://fonts.google.com/specimen/Inter' },
  { name: 'Mono Font', family: 'JetBrains Mono', weight: '400-700', usage: 'Code, technical content', link: 'https://fonts.google.com/specimen/JetBrains+Mono' }
]

// Press releases
const pressReleases = [
  {
    title: 'Company Announces $50M Series B Funding',
    date: 'March 15, 2024',
    category: 'Funding',
    summary: 'Leading venture capital firms invest in our vision for the future of work collaboration.',
    link: '#'
  },
  {
    title: 'Global Expansion: New Offices in London, Tokyo, and Singapore',
    date: 'February 20, 2024',
    category: 'Expansion',
    summary: 'Strategic expansion to serve growing international customer base across three continents.',
    link: '#'
  },
  {
    title: 'Product 3.0 Launch with AI-Powered Features',
    date: 'January 10, 2024',
    category: 'Product',
    summary: 'Major platform update introduces machine learning capabilities and advanced automation.',
    link: '#'
  },
  {
    title: 'Achieves 50,000 Customer Milestone',
    date: 'December 5, 2023',
    category: 'Milestone',
    summary: 'Platform reaches significant adoption milestone with customers in 150+ countries.',
    link: '#'
  },
  {
    title: 'Wins "Best SaaS Product of the Year" Award',
    date: 'November 12, 2023',
    category: 'Award',
    summary: 'Industry recognition for innovation, user experience, and customer satisfaction.',
    link: '#'
  },
  {
    title: 'Partnership with Fortune 500 Company',
    date: 'October 8, 2023',
    category: 'Partnership',
    summary: 'Strategic partnership to bring enterprise-grade collaboration to large organizations.',
    link: '#'
  }
]

// Media coverage
const mediaCoverage = [
  {
    outlet: 'TechCrunch',
    logo: '📰',
    title: 'How This Startup is Revolutionizing Team Collaboration',
    date: 'March 2024',
    link: '#'
  },
  {
    outlet: 'Forbes',
    logo: '💼',
    title: '30 Under 30: Meet the Founders Building the Future',
    date: 'February 2024',
    link: '#'
  },
  {
    outlet: 'The Wall Street Journal',
    logo: '📊',
    title: 'SaaS Startup Raises $50M in Competitive Funding Round',
    date: 'March 2024',
    link: '#'
  },
  {
    outlet: 'VentureBeat',
    logo: '🚀',
    title: 'AI-Powered Analytics Platform Gains Traction',
    date: 'January 2024',
    link: '#'
  },
  {
    outlet: 'Fast Company',
    logo: '⚡',
    title: 'The Most Innovative Companies of 2024',
    date: 'February 2024',
    link: '#'
  },
  {
    outlet: 'Business Insider',
    logo: '💡',
    title: 'Inside the Company Culture at This Unicorn Startup',
    date: 'December 2023',
    link: '#'
  }
]

// Company stats
const companyFacts = [
  { label: 'Founded', value: '2019' },
  { label: 'Headquarters', value: 'San Francisco, CA' },
  { label: 'Employees', value: '150+' },
  { label: 'Customers', value: '50,000+' },
  { label: 'Countries', value: '150+' },
  { label: 'Funding', value: '$65M' }
]

// Founder bios
const founders = [
  {
    name: 'Sarah Johnson',
    role: 'Co-Founder & CEO',
    avatar: '👩‍💼',
    bio: 'Sarah is a seasoned tech executive with 15 years of experience in product and engineering leadership. Prior to founding the company, she was VP of Product at Google, where she led teams building collaboration tools used by millions. She holds a BS in Computer Science from Stanford University and is passionate about empowering teams to do their best work.',
    achievements: ['Forbes 30 Under 30', 'TechCrunch Disrupt Winner', 'Stanford Engineering Award'],
    contact: 'sarah@company.com'
  },
  {
    name: 'Michael Chen',
    role: 'Co-Founder & CTO',
    avatar: '👨‍💻',
    bio: 'Michael is a technologist and researcher specializing in distributed systems and AI. He was previously a Principal Engineer at Amazon, where he architected large-scale infrastructure serving billions of requests. He holds a PhD in Artificial Intelligence from MIT and has published over 20 papers on machine learning and systems design.',
    achievements: ['MIT Technology Review Innovator', 'ACM Distinguished Member', 'IEEE Fellow'],
    contact: 'michael@company.com'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Co-Founder & CPO',
    avatar: '👩‍🎨',
    bio: 'Emily is a product designer and UX leader with a track record of creating beloved products. She was Head of Design at Airbnb, where she led the redesign of their mobile and web experiences. Emily studied Design at RISD and believes deeply in human-centered design that makes technology accessible to everyone.',
    achievements: ['Fast Company Innovation Award', 'AIGA Design Medal', 'Apple Design Award'],
    contact: 'emily@company.com'
  }
]

export default function PressKitPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedColor(id)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  return (
    <div className="min-h-screen text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
            <Newspaper className="w-3 h-3 mr-1" />
            Press Kit
          </Badge>
          <h1 className="text-4xl md:text-6xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6 terminal-glow">
            Media & Brand Resources
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Everything you need to write about us or use our brand. Download logos,
            read our story, and get in touch with our press team.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Download Full Kit
            </Button>
            <Button size="lg" variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Contact Press Team
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-16 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {companyFacts.map((fact, idx) => (
            <Card key={idx} className="glass border-border/30 p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{fact.value}</div>
              <div className="text-xs text-muted-foreground">{fact.label}</div>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Logo Downloads */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Logo Variations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Download our logos in various formats and configurations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {logoVariations.map((logo, idx) => (
            <motion.div
              key={logo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="glass border-border/30 overflow-hidden group hover:border-primary/30 transition-all">
                {/* Logo Preview */}
                <div className={cn(
                  "aspect-video flex items-center justify-center text-6xl p-8",
                  logo.bg === 'dark' && 'bg-background',
                  logo.bg === 'light' && 'bg-muted',
                  logo.bg === 'primary' && 'bg-primary/20'
                )}>
                  ⭐
                </div>
                {/* Info */}
                <div className="p-6">
                  <h3 className="font-bold mb-2">{logo.name}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{logo.format}</span>
                    <span>{logo.size}</span>
                  </div>
                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Usage Guidelines */}
        <motion.div
          className="mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass border-border/30 p-8">
            <h3 className="text-xl font-bold mb-4">Logo Usage Guidelines</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Maintain clear space around the logo equal to the height of the icon</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Use provided color variations on appropriate backgrounds</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Don't distort, rotate, or modify the logo proportions</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Don't use unapproved colors or apply effects like shadows or gradients</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </section>

      {/* Color Palette */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Brand Colors</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our color system across all brand touchpoints
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {colors.map((color, idx) => (
            <motion.div
              key={color.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="glass border-border/30 overflow-hidden">
                {/* Color Swatch */}
                <div
                  className="h-32"
                  style={{ backgroundColor: color.hex }}
                />
                {/* Info */}
                <div className="p-6">
                  <h3 className="font-bold mb-4">{color.name}</h3>
                  <div className="space-y-3">
                    {/* HEX */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1">HEX</Label>
                      <div className="flex items-center gap-2">
                        <Input value={color.hex} readOnly className="glass border-border/20 text-sm" />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(color.hex, `${color.name}-hex`)}
                        >
                          {copiedColor === `${color.name}-hex` ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    {/* RGB */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1">RGB</Label>
                      <div className="flex items-center gap-2">
                        <Input value={color.rgb} readOnly className="glass border-border/20 text-sm" />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(color.rgb, `${color.name}-rgb`)}
                        >
                          {copiedColor === `${color.name}-rgb` ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    {/* Usage */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1">Usage</Label>
                      <p className="text-xs text-muted-foreground">{color.usage}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Typography</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our font system for consistent brand communication
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {typography.map((font, idx) => (
            <motion.div
              key={font.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="glass border-border/30 p-6">
                <Type className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">{font.name}</h3>
                <div className="mb-4 text-4xl font-bold" style={{ fontFamily: font.family }}>
                  Aa
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Family:</span>
                    <span className="font-medium">{font.family}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="font-medium">{font.weight}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Usage:</span>
                    <p className="text-xs text-muted-foreground mt-1">{font.usage}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href={font.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Font
                  </a>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Press Releases */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Press Releases</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Latest company news and announcements
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {pressReleases.map((release, idx) => (
            <motion.div
              key={release.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="glass border-border/30 p-6 hover:border-primary/30 transition-all group cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="border-primary/30">
                        {release.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{release.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {release.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{release.summary}</p>
                  </div>
                  <FileText className="w-8 h-8 text-muted-foreground/30 ml-4" />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    Read More
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Media Coverage */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">In the News</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Recent media coverage and mentions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {mediaCoverage.map((article, idx) => (
            <motion.div
              key={article.outlet}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="glass border-border/30 p-6 h-full flex flex-col hover:border-primary/30 transition-all group cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{article.logo}</div>
                  <div>
                    <h4 className="font-bold">{article.outlet}</h4>
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                  </div>
                </div>
                <p className="text-sm mb-4 flex-grow group-hover:text-primary transition-colors">
                  {article.title}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Read Article
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Founder Bios */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Founder Biographies</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the team behind our vision
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {founders.map((founder, idx) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="glass border-border/30 p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-6xl border-2 border-primary/30">
                      {founder.avatar}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{founder.name}</h3>
                    <p className="text-primary mb-4">{founder.role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {founder.bio}
                    </p>
                    {/* Achievements */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Notable Achievements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {founder.achievements.map((achievement) => (
                          <Badge key={achievement} variant="outline" className="border-primary/30">
                            <Award className="w-3 h-3 mr-1" />
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {/* Contact */}
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${founder.contact}`} className="text-primary hover:underline">
                        {founder.contact}
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Media Contact */}
      <section className="container mx-auto px-4 py-16">
        <Card className="glass border-primary/30 p-12 text-center max-w-3xl mx-auto">
          <Mic className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-4">Media Inquiries</h2>
          <p className="text-muted-foreground mb-6">
            For press inquiries, interviews, or additional information
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <a href="mailto:press@company.com" className="text-lg font-medium hover:text-primary transition-colors">
                press@company.com
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Response time: Within 24 hours
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Mail className="w-4 h-4 mr-2" />
              Contact Press Team
            </Button>
            <Button size="lg" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Full Kit
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}

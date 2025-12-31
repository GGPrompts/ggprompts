'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Target,
  Eye,
  Heart,
  Users,
  TrendingUp,
  Award,
  Lightbulb,
  Rocket,
  Shield,
  Globe,
  Zap,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  ArrowRight,
  Linkedin,
  Twitter,
  Github,
  Mail,
  Building2,
  Sparkles,
  Coffee,
  Code,
  Palette,
  Trophy
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Timeline data
const timeline = [
  {
    year: '2024',
    title: 'Global Expansion',
    description: 'Opened offices in London, Tokyo, and Singapore. Reached 50,000+ customers worldwide.',
    icon: Globe,
    current: true
  },
  {
    year: '2023',
    title: 'Series B Funding',
    description: 'Raised $50M Series B led by Sequoia Capital. Launched AI-powered analytics.',
    icon: TrendingUp,
    current: false
  },
  {
    year: '2022',
    title: 'Product 2.0 Launch',
    description: 'Major platform redesign with 200+ new features. Won "Best SaaS Product" award.',
    icon: Award,
    current: false
  },
  {
    year: '2021',
    title: 'Series A Funding',
    description: 'Raised $15M Series A. Team grew to 50 people. Reached 10,000 customers.',
    icon: Rocket,
    current: false
  },
  {
    year: '2020',
    title: 'First Enterprise Customers',
    description: 'Onboarded Fortune 500 companies. Achieved SOC 2 compliance.',
    icon: Building2,
    current: false
  },
  {
    year: '2019',
    title: 'Company Founded',
    description: 'Founded by three friends in a San Francisco garage. Launched MVP with 100 beta users.',
    icon: Sparkles,
    current: false
  }
]

// Team members
const team = [
  {
    name: 'Sarah Johnson',
    role: 'Co-Founder & CEO',
    avatar: '👩‍💼',
    bio: '15 years in tech. Previously VP at Google. Stanford CS grad.',
    linkedin: '#',
    twitter: '#',
    location: 'San Francisco'
  },
  {
    name: 'Michael Chen',
    role: 'Co-Founder & CTO',
    avatar: '👨‍💻',
    bio: 'Former Principal Engineer at Amazon. MIT PhD in AI.',
    linkedin: '#',
    twitter: '#',
    location: 'San Francisco'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Co-Founder & CPO',
    avatar: '👩‍🎨',
    bio: 'Ex-Head of Design at Airbnb. RISD Design grad.',
    linkedin: '#',
    twitter: '#',
    location: 'San Francisco'
  },
  {
    name: 'David Park',
    role: 'VP of Engineering',
    avatar: '👨‍🔬',
    bio: 'Built infrastructure at Stripe. Carnegie Mellon CS.',
    linkedin: '#',
    github: '#',
    location: 'New York'
  },
  {
    name: 'Lisa Anderson',
    role: 'VP of Sales',
    avatar: '👩',
    bio: '10 years in enterprise sales. Former Salesforce exec.',
    linkedin: '#',
    location: 'Chicago'
  },
  {
    name: 'James Kim',
    role: 'VP of Marketing',
    avatar: '👨',
    bio: 'Growth marketing expert. Previously at HubSpot.',
    linkedin: '#',
    twitter: '#',
    location: 'Boston'
  },
  {
    name: 'Rachel Foster',
    role: 'Head of Customer Success',
    avatar: '👩‍💼',
    bio: 'Customer experience leader. Ex-Zendesk.',
    linkedin: '#',
    location: 'Austin'
  },
  {
    name: 'Alex Martinez',
    role: 'Head of Product Design',
    avatar: '👨‍🎨',
    bio: 'Design systems expert. Former Figma designer.',
    linkedin: '#',
    twitter: '#',
    location: 'Seattle'
  },
  {
    name: 'Jennifer Lee',
    role: 'Head of Data Science',
    avatar: '👩‍🔬',
    bio: 'ML researcher. PhD from Berkeley. Ex-Netflix.',
    linkedin: '#',
    github: '#',
    location: 'San Francisco'
  },
  {
    name: 'Chris Williams',
    role: 'Head of Security',
    avatar: '👨‍💻',
    bio: 'Cybersecurity specialist. Former DoD.',
    linkedin: '#',
    location: 'Washington DC'
  },
  {
    name: 'Amanda Brown',
    role: 'Head of HR',
    avatar: '👩',
    bio: 'People operations leader. Built teams at Slack.',
    linkedin: '#',
    location: 'San Francisco'
  },
  {
    name: 'Tom Garcia',
    role: 'Head of Finance',
    avatar: '👨‍💼',
    bio: 'CFO with SaaS expertise. Former Goldman Sachs.',
    linkedin: '#',
    location: 'New York'
  }
]

// Company values
const values = [
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Every decision starts with our customers. Their success is our success.',
    color: 'text-red-500'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We embrace creativity and encourage bold ideas that push boundaries.',
    color: 'text-yellow-500'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work together, share knowledge, and lift each other up.',
    color: 'text-blue-500'
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'We do the right thing, even when no one is watching.',
    color: 'text-green-500'
  },
  {
    icon: Zap,
    title: 'Excellence',
    description: 'We set high standards and continuously improve our craft.',
    color: 'text-purple-500'
  },
  {
    icon: Globe,
    title: 'Inclusivity',
    description: 'We celebrate diversity and create a welcoming environment for all.',
    color: 'text-secondary'
  }
]

// Culture highlights
const culture = [
  {
    icon: Coffee,
    title: 'Remote-First',
    description: 'Work from anywhere. Offices are optional.',
    stat: '60% remote'
  },
  {
    icon: Calendar,
    title: 'Unlimited PTO',
    description: 'Take time off when you need it.',
    stat: 'Avg 25 days/year'
  },
  {
    icon: Trophy,
    title: 'Learning Budget',
    description: '$2,000/year for courses and conferences.',
    stat: '$2K budget'
  },
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Premium health, dental, and mental health coverage.',
    stat: '100% covered'
  },
  {
    icon: Code,
    title: 'Latest Tech',
    description: 'MacBook Pro and your choice of equipment.',
    stat: 'Your choice'
  },
  {
    icon: Users,
    title: 'Team Events',
    description: 'Quarterly offsites and weekly team activities.',
    stat: '4x per year'
  }
]

// Investors
const investors = [
  { name: 'Sequoia Capital', logo: '🌲', tier: 'Series B Lead' },
  { name: 'Andreessen Horowitz', logo: '⚡', tier: 'Series B' },
  { name: 'Y Combinator', logo: '🚀', tier: 'Seed' },
  { name: 'Founders Fund', logo: '💎', tier: 'Series A' },
  { name: 'Accel', logo: '🔥', tier: 'Series A Lead' },
  { name: 'GV (Google Ventures)', logo: '🔍', tier: 'Series B' }
]

// Milestones
const milestones = [
  { value: '50K+', label: 'Customers' },
  { value: '150+', label: 'Team Members' },
  { value: '5', label: 'Global Offices' },
  { value: '$65M', label: 'Funding Raised' },
  { value: '99.99%', label: 'Uptime' },
  { value: '4.9/5', label: 'Customer Rating' }
]

export default function AboutPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const filteredTeam = selectedDepartment === 'all'
    ? team
    : team.filter(member => {
        if (selectedDepartment === 'leadership') {
          return member.role.includes('Co-Founder') || member.role.includes('VP') || member.role.includes('Head')
        }
        return true
      })

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
            <Building2 className="w-3 h-3 mr-1" />
            About Us
          </Badge>
          <h1 className="text-4xl md:text-6xl font-mono font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">
            Building the future of work
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            We're on a mission to empower teams worldwide with tools that make work
            more productive, collaborative, and enjoyable. Founded in 2019, we've grown
            from a small startup to a global company serving 50,000+ customers.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Join Our Team
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Our Story
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-16 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {milestones.map((milestone, idx) => (
            <Card key={idx} className="glass border-border/30 p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{milestone.value}</div>
              <div className="text-xs text-muted-foreground">{milestone.label}</div>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass border-primary/30 p-8 h-full">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To empower every team to work smarter, collaborate seamlessly, and
                achieve extraordinary results through innovative technology.
              </p>
            </Card>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass border-primary/30 p-8 h-full">
              <Eye className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A world where work is a source of fulfillment, creativity thrives,
                and teams achieve their full potential with the right tools.
              </p>
            </Card>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass border-primary/30 p-8 h-full">
              <Heart className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground leading-relaxed">
                Customer-first mindset, relentless innovation, authentic collaboration,
                unwavering integrity, pursuit of excellence, and inclusive culture.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {values.map((value, idx) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <Card className="glass border-border/30 p-6 h-full hover:border-primary/30 transition-all">
                  <Icon className={cn("w-10 h-10 mb-4", value.color)} />
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From a garage startup to a global company
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {timeline.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Timeline line */}
                {idx !== timeline.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-border/30" />
                )}

                <div className="flex gap-6 mb-12">
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 z-10",
                    item.current
                      ? "bg-primary/20 border-primary"
                      : "glass border-border/30"
                  )}>
                    <Icon className={cn("w-6 h-6", item.current ? "text-primary" : "text-muted-foreground")} />
                  </div>

                  {/* Content */}
                  <Card className={cn(
                    "flex-1 p-6",
                    item.current
                      ? "glass border-primary/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                      : "glass-dark border-border/20"
                  )}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <Badge variant={item.current ? "default" : "outline"} className={item.current ? "bg-primary" : ""}>
                        {item.year}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </Card>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Talented people from around the world, united by a common mission
          </p>
        </div>

        {/* Department Filter */}
        <Tabs value={selectedDepartment} onValueChange={setSelectedDepartment} className="w-full mb-12">
          <TabsList className="glass border-border/30 max-w-md mx-auto">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              All Team
            </TabsTrigger>
            <TabsTrigger value="leadership" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Leadership
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Team Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {filteredTeam.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="glass border-border/30 p-6 h-full text-center group hover:border-primary/30 transition-all">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-4xl mx-auto mb-4 border-2 border-primary/20 group-hover:border-primary/40 transition-all">
                    {member.avatar}
                  </div>

                  {/* Info */}
                  <h3 className="font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {member.bio}
                  </p>

                  {/* Location */}
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />
                    {member.location}
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-2">
                    {member.linkedin && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Linkedin className="w-4 h-4" />
                      </Button>
                    )}
                    {member.twitter && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Twitter className="w-4 h-4" />
                      </Button>
                    )}
                    {member.github && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Github className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Culture & Benefits */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Life at Our Company</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We believe in taking care of our team
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {culture.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <Card className="glass border-border/30 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                    <Badge variant="outline" className="border-primary/30">
                      {item.stat}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Investors */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Backed by the Best</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Supported by world-class investors who believe in our vision
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {investors.map((investor, idx) => (
            <motion.div
              key={investor.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="glass-dark border-border/20 p-6 text-center hover:border-primary/30 transition-all">
                <div className="text-4xl mb-3">{investor.logo}</div>
                <h4 className="text-sm font-bold mb-1">{investor.name}</h4>
                <p className="text-xs text-muted-foreground">{investor.tier}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="glass border-primary/30 p-12 text-center max-w-4xl mx-auto">
          <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-4">Join our team</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always looking for talented people who share our passion for
            building great products and making an impact.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View Open Positions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}

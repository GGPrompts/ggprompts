'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Terminal,
  Code2,
  Rocket,
  Heart,
  Users,
  Trophy,
  MapPin,
  Calendar,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
  Mail,
  ChevronRight,
  Filter,
  Building2,
  Target,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Coffee,
  Gamepad2,
  Music,
  Book,
  Camera
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

// Mock data - replace with your actual data
const teamMembers = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    department: 'leadership',
    location: 'San Francisco',
    bio: 'Visionary leader with 15+ years in tech innovation. Former VP at Google.',
    quote: 'Building the future, one line of code at a time.',
    avatar: '/team/sarah.jpg',
    skills: ['Strategy', 'Product', 'Leadership', 'AI/ML'],
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com'
    },
    achievements: ['Forbes 30 Under 30', 'YC Alumni', '3x Founder'],
    funFact: 'Can solve a Rubik\'s cube in under 60 seconds'
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'CTO & Co-Founder',
    department: 'leadership',
    location: 'San Francisco',
    bio: 'Technical architect with expertise in distributed systems and cloud infrastructure.',
    quote: 'Code is poetry, infrastructure is the canvas.',
    avatar: '/team/marcus.jpg',
    skills: ['Architecture', 'DevOps', 'Rust', 'Go'],
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com'
    },
    achievements: ['ACM Fellow', 'Open Source Contributor', 'Patent Holder'],
    funFact: 'Built first computer at age 10'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'VP of Engineering',
    department: 'engineering',
    location: 'New York',
    bio: 'Leading engineering teams to build scalable, innovative solutions.',
    avatar: '/team/emily.jpg',
    skills: ['React', 'Node.js', 'Python', 'Team Leadership'],
    social: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    },
    funFact: 'Speaks 4 languages fluently'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Senior Frontend Engineer',
    department: 'engineering',
    location: 'Remote',
    bio: 'Crafting beautiful, performant user interfaces with modern web technologies.',
    avatar: '/team/david.jpg',
    skills: ['TypeScript', 'Next.js', 'Tailwind', 'WebGL'],
    social: {
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    },
    funFact: 'Amateur astronomer'
  },
  {
    id: 5,
    name: 'Lisa Wang',
    role: 'Product Designer',
    department: 'design',
    location: 'San Francisco',
    bio: 'Creating intuitive, accessible designs that delight users.',
    avatar: '/team/lisa.jpg',
    skills: ['Figma', 'Prototyping', 'User Research', 'Motion Design'],
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    funFact: 'Collects vintage keyboards'
  },
  {
    id: 6,
    name: 'Alex Thompson',
    role: 'Backend Engineer',
    department: 'engineering',
    location: 'London',
    bio: 'Building robust, scalable backend systems and APIs.',
    avatar: '/team/alex.jpg',
    skills: ['Go', 'PostgreSQL', 'Redis', 'Kubernetes'],
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    funFact: 'Home barista champion'
  }
]

const companyValues = [
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Innovation First',
    description: 'We push boundaries and challenge the status quo to create breakthrough solutions.'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Collaboration',
    description: 'Great ideas come from diverse perspectives working together towards a common goal.'
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'User Obsessed',
    description: 'Every decision we make starts with how it impacts our users and their experience.'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Integrity',
    description: 'We build trust through transparency, honesty, and ethical practices.'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Move Fast',
    description: 'Speed and agility are our competitive advantages in a rapidly changing world.'
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Excellence',
    description: 'We hold ourselves to the highest standards in everything we do.'
  }
]

const timeline = [
  {
    year: '2020',
    title: 'Founded',
    description: 'Started in a garage with a vision to revolutionize software development'
  },
  {
    year: '2021',
    title: 'Seed Funding',
    description: 'Raised $2M from top-tier investors to accelerate growth'
  },
  {
    year: '2022',
    title: '100+ Customers',
    description: 'Reached major milestone serving enterprises worldwide'
  },
  {
    year: '2023',
    title: 'Series A',
    description: '$15M funding round led by Sequoia Capital'
  },
  {
    year: '2024',
    title: 'Global Expansion',
    description: 'Opened offices in London, Tokyo, and Sydney'
  },
  {
    year: '2025',
    title: 'Industry Leader',
    description: 'Recognized as the #1 platform in developer tools'
  }
]

const openPositions = [
  {
    title: 'Senior Backend Engineer',
    department: 'Engineering',
    location: 'San Francisco / Remote',
    type: 'Full-time'
  },
  {
    title: 'Product Manager',
    department: 'Product',
    location: 'New York',
    type: 'Full-time'
  },
  {
    title: 'UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time'
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'San Francisco',
    type: 'Full-time'
  }
]

const partners = [
  { name: 'Google Cloud', logo: '/partners/google.svg' },
  { name: 'AWS', logo: '/partners/aws.svg' },
  { name: 'Microsoft', logo: '/partners/microsoft.svg' },
  { name: 'Vercel', logo: '/partners/vercel.svg' },
  { name: 'GitHub', logo: '/partners/github.svg' },
  { name: 'Stripe', logo: '/partners/stripe.svg' }
]

const officeImages = [
  { src: '/office/office1.jpg', alt: 'Main office space' },
  { src: '/office/office2.jpg', alt: 'Team collaboration area' },
  { src: '/office/office3.jpg', alt: 'Kitchen and lounge' },
  { src: '/office/office4.jpg', alt: 'Hackathon event' },
  { src: '/office/office5.jpg', alt: 'Team outing' },
  { src: '/office/office6.jpg', alt: 'Conference room' }
]

export default function TeamPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [statsInView, setStatsInView] = useState(false)
  const statsRef = useRef(null)
  const isStatsInView = useInView(statsRef, { once: true })

  useEffect(() => {
    if (isStatsInView) {
      setStatsInView(true)
    }
  }, [isStatsInView])

  const filteredTeam = teamMembers.filter(member => {
    const departmentMatch = selectedDepartment === 'all' || member.department === selectedDepartment
    const locationMatch = selectedLocation === 'all' || member.location === selectedLocation
    return departmentMatch && locationMatch
  })

  const AnimatedCounter = ({ target, label, suffix = '' }: { target: number; label: string; suffix?: string }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (statsInView) {
        const duration = 2000
        const steps = 60
        const increment = target / steps
        let current = 0

        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            setCount(target)
            clearInterval(timer)
          } else {
            setCount(Math.floor(current))
          }
        }, duration / steps)

        return () => clearInterval(timer)
      }
    }, [target, statsInView])

    return (
      <div className="text-center">
        <div className="text-4xl font-bold terminal-glow text-primary">
          {count}{suffix}
        </div>
        <div className="text-sm text-muted-foreground mt-1">{label}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      {/* Mission Statement Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 20, 0],
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <div className="glass rounded-3xl p-12 border-glow">
            <Terminal className="w-16 h-16 mx-auto mb-6 text-primary terminal-glow" />
            <h1 className="text-5xl md:text-7xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6 terminal-glow">
              Building Tomorrow&apos;s Technology
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We&apos;re a team of passionate innovators, engineers, and dreamers united by a single mission:
              to create technology that empowers developers and transforms industries. Together, we&apos;re not
              just writing code—we&apos;re shaping the future.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Company Stats */}
      <section ref={statsRef} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-2xl p-8 border-glow">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <AnimatedCounter target={50} suffix="+" label="Team Members" />
              <AnimatedCounter target={4} label="Global Offices" />
              <AnimatedCounter target={1000} suffix="+" label="Happy Customers" />
              <AnimatedCounter target={5} label="Years of Innovation" />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text terminal-glow">Meet Our Team</h2>
            <p className="text-muted-foreground">The brilliant minds behind our success</p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48 glass border-white/20">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="product">Product</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-48 glass border-white/20">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="San Francisco">San Francisco</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="London">London</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leadership Section */}
          {(selectedDepartment === 'all' || selectedDepartment === 'leadership') && (
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-primary">Leadership Team</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {filteredTeam
                  .filter(member => member.department === 'leadership')
                  .map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="glass border-white/20 overflow-hidden group">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                          className="p-8"
                        >
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="relative">
                              <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-colors">
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                                {/* Replace with actual image */}
                                {/* <Image
                                  src={member.avatar}
                                  alt={member.name}
                                  width={128}
                                  height={128}
                                  className="object-cover"
                                /> */}
                              </div>
                              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <Star className="w-4 h-4 text-background" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-2xl font-bold mb-1">{member.name}</h4>
                              <p className="text-primary mb-3">{member.role}</p>
                              <p className="text-muted-foreground mb-4">{member.bio}</p>
                              {member.quote && (
                                <blockquote className="italic text-sm border-l-2 border-primary pl-4 mb-4">
                                  &ldquo;{member.quote}&rdquo;
                                </blockquote>
                              )}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {member.skills.map(skill => (
                                  <Badge key={skill} variant="outline" className="border-primary/30">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                              {member.achievements && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {member.achievements.map(achievement => (
                                    <div key={achievement} className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Trophy className="w-3 h-3 text-primary" />
                                      {achievement}
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="flex gap-3">
                                {member.social.linkedin && (
                                  <Link href={member.social.linkedin} target="_blank">
                                    <Button size="icon" variant="ghost" className="hover:text-primary">
                                      <Linkedin className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                )}
                                {member.social.twitter && (
                                  <Link href={member.social.twitter} target="_blank">
                                    <Button size="icon" variant="ghost" className="hover:text-primary">
                                      <Twitter className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                )}
                                {member.social.github && (
                                  <Link href={member.social.github} target="_blank">
                                    <Button size="icon" variant="ghost" className="hover:text-primary">
                                      <Github className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          {/* Team Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeam
              .filter(member => member.department !== 'leadership')
              .map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass border-white/20 overflow-hidden group h-full">
                    <motion.div
                      whileHover={{
                        rotateY: 5,
                        rotateX: -5,
                        scale: 1.05
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ perspective: 1000 }}
                      className="p-6 h-full flex flex-col"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors">
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{member.name}</h4>
                          <p className="text-sm text-primary">{member.role}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {member.location}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 flex-1">{member.bio}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {member.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs border-primary/30">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      {member.funFact && (
                        <div className="text-xs text-muted-foreground mb-4 flex items-center gap-2">
                          <Coffee className="w-3 h-3 text-primary" />
                          Fun fact: {member.funFact}
                        </div>
                      )}
                      <div className="flex gap-2 pt-4 border-t border-white/10">
                        {member.social.linkedin && (
                          <Link href={member.social.linkedin} target="_blank">
                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-primary">
                              <Linkedin className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                        {member.social.twitter && (
                          <Link href={member.social.twitter} target="_blank">
                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-primary">
                              <Twitter className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                        {member.social.github && (
                          <Link href={member.social.github} target="_blank">
                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-primary">
                              <Github className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 terminal-glow">Our Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-white/20 p-6 h-full group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <div className="text-primary">{value.icon}</div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 terminal-glow">Our Journey</h2>
            <p className="text-muted-foreground">From humble beginnings to industry leadership</p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary via-cyan-500 to-primary" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <Card className="glass border-white/20 p-6 inline-block">
                    <div className="text-2xl font-bold text-primary mb-2">{item.year}</div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Culture Gallery */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 terminal-glow">Life at Our Company</h2>
            <p className="text-muted-foreground">Where work meets passion</p>
          </motion.div>

          <Tabs defaultValue="gallery" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
              <TabsTrigger value="perks">Perks & Benefits</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {officeImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="glass border-white/20 overflow-hidden group">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative"
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Camera className="w-12 h-12 text-primary/30" />
                        </div>
                        {/* Replace with actual images */}
                        {/* <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                        /> */}
                      </motion.div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="perks">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                  { icon: <Heart className="w-5 h-5" />, title: 'Health & Wellness', desc: 'Comprehensive health, dental, and vision coverage' },
                  { icon: <Calendar className="w-5 h-5" />, title: 'Flexible PTO', desc: 'Unlimited vacation policy with minimum 3 weeks' },
                  { icon: <Building2 className="w-5 h-5" />, title: 'Remote Work', desc: 'Work from anywhere with quarterly team meetups' },
                  { icon: <Trophy className="w-5 h-5" />, title: 'Learning Budget', desc: '$2,500 annual budget for courses and conferences' },
                  { icon: <Coffee className="w-5 h-5" />, title: 'Office Perks', desc: 'Free meals, snacks, and premium coffee' },
                  { icon: <Gamepad2 className="w-5 h-5" />, title: 'Fun Activities', desc: 'Game nights, hackathons, and team outings' }
                ].map((perk, index) => (
                  <motion.div
                    key={perk.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="glass border-white/20 p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <div className="text-primary">{perk.icon}</div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{perk.title}</h3>
                          <p className="text-sm text-muted-foreground">{perk.desc}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-4 bg-gradient-to-t from-primary/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 terminal-glow">Join Our Team</h2>
            <p className="text-muted-foreground">Help us build the future of technology</p>
          </motion.div>

          <div className="space-y-4 mb-8">
            {openPositions.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass border-white/20 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {position.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {position.location}
                        </span>
                        <Badge variant="outline" className="border-primary/30">
                          {position.type}
                        </Badge>
                      </div>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 group">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10">
              View All Open Positions
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Partners/Investors */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 terminal-glow">Our Partners</h2>
            <p className="text-muted-foreground">Trusted by industry leaders</p>
          </motion.div>

          <div className="glass rounded-2xl p-8 border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center justify-center"
                >
                  <div className="w-24 h-24 rounded-lg bg-white/5 flex items-center justify-center group hover:bg-white/10 transition-colors">
                    <Globe className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 border-glow"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Mission?</h2>
            <p className="text-muted-foreground mb-8">
              Be part of something bigger. Shape the future with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 group">
                View Open Positions
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10">
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
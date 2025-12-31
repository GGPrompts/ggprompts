'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Sparkles,
  Target,
  Palette,
  Code,
  TrendingUp,
  Users,
  Award,
  Calendar,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Star,
  Briefcase,
  Rocket,
  Zap,
  Globe,
  Layers,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Play,
  ExternalLink,
  Clock,
  DollarSign,
  Shield,
  BarChart,
  Lightbulb,
  Heart,
  Database,
  Cloud,
  Terminal,
  FileCode,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'

// Animated Counter
const AnimatedCounter = ({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / 2000, 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          requestAnimationFrame(animateCount)
        }
      }
      requestAnimationFrame(animateCount)
    }
  }, [inView, end])

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold terminal-glow">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  )
}

// Portfolio Item Component
const PortfolioItem = ({ project, index }: { project: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <Card className="glass-dark overflow-hidden border-glow h-full">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-0 flex items-center justify-center gap-4"
              >
                <Button size="sm" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  View Case Study
                </Button>
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <Badge>{project.category}</Badge>
            <Badge variant="outline">{project.year}</Badge>
          </div>
          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{project.duration}</span>
            <span>·</span>
            <TrendingUp className="w-3 h-3" />
            <span>{project.result}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function LandingAgencyTemplate() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    budget: ''
  })
  const [selectedService, setSelectedService] = useState<number | null>(null)

  const { scrollYProgress } = useScroll()
  const scaleProgress = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])

  const services = [
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Custom websites and web applications built with cutting-edge technology',
      features: ['React/Next.js', 'E-commerce', 'CMS Integration', 'API Development']
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive designs that users love and convert',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems']
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications',
      features: ['iOS & Android', 'React Native', 'App Store Optimization', 'Push Notifications']
    },
    {
      icon: TrendingUp,
      title: 'Digital Marketing',
      description: 'Data-driven strategies to grow your online presence',
      features: ['SEO', 'Content Strategy', 'Social Media', 'Analytics']
    },
    {
      icon: Code,
      title: 'Custom Software',
      description: 'Tailored solutions for your unique business needs',
      features: ['Enterprise Apps', 'Automation', 'Integrations', 'Consulting']
    },
    {
      icon: Shield,
      title: 'Support & Maintenance',
      description: '24/7 support to keep your digital assets running smoothly',
      features: ['Bug Fixes', 'Updates', 'Monitoring', 'Security']
    }
  ]

  const portfolio = [
    {
      title: 'E-commerce Platform Redesign',
      category: 'Web Development',
      description: 'Complete redesign and development of a high-traffic e-commerce platform',
      year: '2024',
      duration: '4 months',
      result: '+150% conversion'
    },
    {
      title: 'Banking Mobile App',
      category: 'Mobile App',
      description: 'Secure mobile banking application with biometric authentication',
      year: '2024',
      duration: '6 months',
      result: '4.8★ rating'
    },
    {
      title: 'SaaS Dashboard',
      category: 'UI/UX Design',
      description: 'Modern analytics dashboard for a B2B SaaS platform',
      year: '2023',
      duration: '3 months',
      result: '40% ↑ engagement'
    },
    {
      title: 'Healthcare Portal',
      category: 'Web Development',
      description: 'HIPAA-compliant patient portal and appointment system',
      year: '2023',
      duration: '5 months',
      result: '10K+ users'
    },
    {
      title: 'Brand Identity System',
      category: 'Design',
      description: 'Complete brand identity and design system for a startup',
      year: '2024',
      duration: '2 months',
      result: '3x recognition'
    },
    {
      title: 'Logistics Platform',
      category: 'Custom Software',
      description: 'Real-time tracking and management system for logistics company',
      year: '2023',
      duration: '8 months',
      result: '60% efficiency'
    }
  ]

  const team = [
    { name: 'Sarah Chen', role: 'Creative Director', image: '👩‍🎨', specialty: 'Brand Strategy' },
    { name: 'Mike Johnson', role: 'Lead Developer', image: '👨‍💻', specialty: 'Full-Stack' },
    { name: 'Emily Rodriguez', role: 'UX Designer', image: '👩‍💼', specialty: 'User Research' },
    { name: 'David Kim', role: 'Tech Lead', image: '👨‍🔬', specialty: 'Architecture' }
  ]

  const process = [
    {
      step: '01',
      title: 'Discovery',
      description: 'We deep-dive into your business goals, target audience, and requirements',
      icon: Target,
      duration: '1-2 weeks'
    },
    {
      step: '02',
      title: 'Strategy',
      description: 'Develop a comprehensive roadmap and technical architecture',
      icon: Lightbulb,
      duration: '1 week'
    },
    {
      step: '03',
      title: 'Design',
      description: 'Create beautiful, user-centered designs and prototypes',
      icon: Palette,
      duration: '2-4 weeks'
    },
    {
      step: '04',
      title: 'Development',
      description: 'Build your product with clean, scalable code',
      icon: Code,
      duration: '4-12 weeks'
    },
    {
      step: '05',
      title: 'Testing',
      description: 'Rigorous QA to ensure everything works perfectly',
      icon: CheckCircle,
      duration: '1-2 weeks'
    },
    {
      step: '06',
      title: 'Launch',
      description: 'Deploy to production and provide ongoing support',
      icon: Rocket,
      duration: 'Ongoing'
    }
  ]

  const stats = [
    { number: 150, suffix: '+', label: 'Projects Delivered' },
    { number: 98, suffix: '%', label: 'Client Satisfaction' },
    { number: 12, suffix: '+', label: 'Years Experience' },
    { number: 50, suffix: '+', label: 'Team Members' }
  ]

  const testimonials = [
    {
      quote: 'Working with this agency transformed our business. They delivered beyond expectations and on time.',
      author: 'John Smith',
      role: 'CEO, TechCorp',
      image: '👨‍💼',
      rating: 5
    },
    {
      quote: 'The team\'s expertise and professionalism are unmatched. Our new platform is performing incredibly well.',
      author: 'Lisa Anderson',
      role: 'Founder, StartupXYZ',
      image: '👩‍💼',
      rating: 5
    },
    {
      quote: 'Best decision we made was partnering with them. The ROI has been phenomenal.',
      author: 'Robert Chen',
      role: 'CMO, E-commerce Co.',
      image: '👨‍💻',
      rating: 5
    }
  ]

  const clients = [
    { name: 'TechCorp', logo: '🚀' },
    { name: 'StartupXYZ', logo: '⚡' },
    { name: 'E-commerce Co.', logo: '🛍️' },
    { name: 'FinanceApp', logo: '💰' },
    { name: 'HealthTech', logo: '🏥' },
    { name: 'EduPlatform', logo: '📚' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Track: contact_form_submit
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[15%] left-[5%] w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[5%] w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 glass sticky top-0 z-40 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl">AgencyName</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-sm hover:text-primary transition-colors">Services</a>
              <a href="#portfolio" className="text-sm hover:text-primary transition-colors">Portfolio</a>
              <a href="#process" className="text-sm hover:text-primary transition-colors">Process</a>
              <a href="#team" className="text-sm hover:text-primary transition-colors">Team</a>
              <Button size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Book a Call
              </Button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-8 mb-16"
            >
              <Badge className="px-4 py-1.5 text-sm border-glow">
                <Award className="w-3 h-3 mr-2" />
                Award-Winning Digital Agency
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold terminal-glow max-w-4xl mx-auto font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                We Build Digital
                <br />
                <span className="text-primary">Experiences</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Transform your vision into reality with our expert team of designers, developers, and strategists.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="text-lg">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  <Play className="w-5 h-5 mr-2" />
                  View Our Work
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="glass p-6 text-center border-glow">
                    <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                    <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Logos */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground mb-8">Trusted by industry leaders</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {clients.map((client, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <span className="text-3xl">{client.logo}</span>
                  <span className="font-bold text-lg">{client.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Services */}
        <section id="services" className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              End-to-end digital solutions tailored to your business needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedService(index)}
                className="cursor-pointer"
              >
                <Card className={`glass p-6 h-full border-glow transition-all ${selectedService === index ? 'border-primary' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Portfolio/Case Studies */}
        <section id="portfolio" className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured Work
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real results for real clients
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {portfolio.map((project, index) => (
              <PortfolioItem key={index} project={project} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Projects
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* Process/Methodology */}
        <section id="process" className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A proven methodology that delivers results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {process.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="glass-dark p-6 h-full border-glow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl font-mono font-bold text-primary/30">
                      {item.step}
                    </div>
                    <Badge variant="outline" className="text-xs">{item.duration}</Badge>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
                {index < process.length - 1 && index % 3 !== 2 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 text-muted-foreground z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section id="team" className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Meet the Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Talented experts passionate about creating amazing digital experiences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-dark p-6 text-center border-glow">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                  <Badge variant="outline" className="text-xs">{member.specialty}</Badge>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Client Success Stories
            </h2>
            <p className="text-xl text-muted-foreground">
              Don't just take our word for it
            </p>
          </motion.div>

          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="glass-dark p-6 h-full border-glow">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                    <Separator className="my-4" />
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{testimonial.image}</div>
                      <div className="text-left">
                        <div className="font-bold text-sm">{testimonial.author}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Contact Form */}
        <section id="contact" className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">
                Let's Build Something Amazing
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Ready to start your project? Get in touch and let's discuss how we can help.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground">hello@agencyname.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Phone</h3>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Office</h3>
                    <p className="text-sm text-muted-foreground">
                      123 Innovation Street<br />
                      San Francisco, CA 94103
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                {[Twitter, Linkedin, Github, Instagram].map((Icon, index) => (
                  <Button key={index} variant="outline" size="sm">
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="glass-overlay p-8 border-glow">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email *</label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Company</label>
                      <Input
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Your Company"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Budget Range</label>
                      <Input
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="$10K - $50K"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Project Details *</label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your project..."
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Send Message
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    We'll get back to you within 24 hours
                  </p>
                </form>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-bold">AgencyName</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Building digital experiences that drive results.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Services</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="#" className="block hover:text-primary transition-colors">Web Development</a>
                  <a href="#" className="block hover:text-primary transition-colors">UI/UX Design</a>
                  <a href="#" className="block hover:text-primary transition-colors">Mobile Apps</a>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="#" className="block hover:text-primary transition-colors">About</a>
                  <a href="#" className="block hover:text-primary transition-colors">Portfolio</a>
                  <a href="#" className="block hover:text-primary transition-colors">Careers</a>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="#" className="block hover:text-primary transition-colors">Privacy</a>
                  <a href="#" className="block hover:text-primary transition-colors">Terms</a>
                  <a href="#" className="block hover:text-primary transition-colors">Cookies</a>
                </div>
              </div>
            </div>
            <Separator className="my-8" />
            <div className="text-center text-sm text-muted-foreground">
              © 2024 AgencyName. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

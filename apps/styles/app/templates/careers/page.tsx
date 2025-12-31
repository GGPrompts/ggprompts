'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Heart,
  Zap,
  TrendingUp,
  Award,
  Coffee,
  Home,
  Plane,
  GraduationCap,
  Shield,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  Code,
  Palette,
  BarChart,
  Database,
  Settings,
  MessageSquare,
  Target,
  Rocket,
  Globe,
  Calendar,
  Building2,
  ChevronRight,
  X
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

// Job openings
const jobOpenings = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    remote: 'Hybrid',
    salary: '$150k - $200k',
    description: 'Build scalable backend systems and APIs that power our platform.',
    requirements: ['5+ years experience', 'Node.js/Python', 'Cloud platforms', 'System design'],
    icon: Code
  },
  {
    id: 2,
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    remote: 'Remote',
    salary: '$120k - $160k',
    description: 'Design beautiful, intuitive interfaces that delight our users.',
    requirements: ['3+ years experience', 'Figma expert', 'Design systems', 'User research'],
    icon: Palette
  },
  {
    id: 3,
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
    remote: 'Hybrid',
    salary: '$140k - $180k',
    description: 'Define product strategy and drive execution from concept to launch.',
    requirements: ['4+ years PM experience', 'B2B SaaS', 'Data-driven', 'Technical background'],
    icon: Target
  },
  {
    id: 4,
    title: 'Data Scientist',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    remote: 'Hybrid',
    salary: '$130k - $170k',
    description: 'Build ML models and analytics to power intelligent features.',
    requirements: ['PhD or 5+ years', 'Python/R', 'Machine learning', 'Statistics'],
    icon: BarChart
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Austin, TX',
    type: 'Full-time',
    remote: 'Remote',
    salary: '$130k - $170k',
    description: 'Build and maintain cloud infrastructure and deployment pipelines.',
    requirements: ['4+ years DevOps', 'Kubernetes/Docker', 'AWS/GCP', 'CI/CD'],
    icon: Database
  },
  {
    id: 6,
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Chicago, IL',
    type: 'Full-time',
    remote: 'Hybrid',
    salary: '$80k - $120k',
    description: 'Help customers achieve success and drive product adoption.',
    requirements: ['3+ years CS experience', 'SaaS background', 'Excellent communication', 'Data analysis'],
    icon: Users
  },
  {
    id: 7,
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    remote: 'Remote',
    salary: '$100k - $140k',
    description: 'Drive growth through creative marketing campaigns and strategies.',
    requirements: ['4+ years marketing', 'B2B experience', 'Digital marketing', 'Analytics'],
    icon: Sparkles
  },
  {
    id: 8,
    title: 'Sales Development Rep',
    department: 'Sales',
    location: 'Boston, MA',
    type: 'Full-time',
    remote: 'Hybrid',
    salary: '$60k - $80k + commission',
    description: 'Generate and qualify leads for the sales team.',
    requirements: ['1+ years SDR', 'Excellent communication', 'Self-motivated', 'CRM experience'],
    icon: TrendingUp
  },
  {
    id: 9,
    title: 'Technical Writer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    remote: 'Remote',
    salary: '$90k - $120k',
    description: 'Create comprehensive documentation for developers and end users.',
    requirements: ['3+ years tech writing', 'Developer docs', 'API documentation', 'Clear communication'],
    icon: MessageSquare
  },
  {
    id: 10,
    title: 'QA Engineer',
    department: 'Engineering',
    location: 'Seattle, WA',
    type: 'Full-time',
    remote: 'Hybrid',
    salary: '$110k - $140k',
    description: 'Ensure product quality through automated and manual testing.',
    requirements: ['3+ years QA', 'Test automation', 'Selenium/Cypress', 'CI/CD'],
    icon: Settings
  },
  {
    id: 11,
    title: 'Frontend Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    remote: 'Hybrid',
    salary: '$140k - $180k',
    description: 'Build responsive, performant web applications with modern frameworks.',
    requirements: ['4+ years frontend', 'React/Vue/Angular', 'TypeScript', 'Performance optimization'],
    icon: Code
  },
  {
    id: 12,
    title: 'UX Researcher',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    remote: 'Remote',
    salary: '$110k - $150k',
    description: 'Conduct user research to inform product and design decisions.',
    requirements: ['3+ years UX research', 'Qual & quant methods', 'User testing', 'Data analysis'],
    icon: Palette
  }
]

// Benefits
const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive medical, dental, and vision coverage for you and your family.',
    details: ['100% premium coverage', 'Mental health support', 'Gym membership', 'Wellness stipend']
  },
  {
    icon: Home,
    title: 'Remote-First',
    description: 'Work from anywhere with flexible hours and optional office access.',
    details: ['60% remote workforce', 'Home office stipend', 'Co-working allowance', 'Async culture']
  },
  {
    icon: Calendar,
    title: 'Unlimited PTO',
    description: 'Take time off when you need it with no arbitrary limits.',
    details: ['Unlimited vacation', 'Sick leave', 'Parental leave', 'Avg 25 days/year']
  },
  {
    icon: GraduationCap,
    title: 'Learning & Growth',
    description: '$2,000 annual budget for courses, conferences, and books.',
    details: ['Conference tickets', 'Online courses', 'Books & learning', 'Mentorship program']
  },
  {
    icon: DollarSign,
    title: 'Competitive Pay',
    description: 'Above-market salaries with equity and performance bonuses.',
    details: ['Market-leading salary', 'Stock options', 'Performance bonus', 'Annual raises']
  },
  {
    icon: Coffee,
    title: 'Team Culture',
    description: 'Quarterly offsites, team lunches, and regular social events.',
    details: ['Quarterly offsites', 'Weekly team lunch', 'Happy hours', 'Game nights']
  },
  {
    icon: Plane,
    title: 'Travel Perks',
    description: 'Travel to team events and explore new cities on us.',
    details: ['Team offsites', 'Conference travel', 'Office visits', 'Workation options']
  },
  {
    icon: Shield,
    title: 'Life Insurance',
    description: 'Comprehensive life and disability insurance coverage.',
    details: ['Life insurance', 'Disability insurance', 'AD&D coverage', 'Legal assistance']
  },
  {
    icon: Rocket,
    title: 'Latest Equipment',
    description: 'MacBook Pro, external monitor, and your choice of accessories.',
    details: ['MacBook Pro M3', '4K monitor', 'Ergonomic setup', 'Software licenses']
  }
]

// Company values
const companyValues = [
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work together and lift each other up'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We embrace bold ideas and creativity'
  },
  {
    icon: Heart,
    title: 'Empathy',
    description: 'We care about our customers and teammates'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We set high standards and deliver quality'
  }
]

// Hiring process steps
const hiringProcess = [
  {
    step: 1,
    title: 'Application',
    description: 'Submit your application and resume through our portal',
    duration: '1 day'
  },
  {
    step: 2,
    title: 'Initial Screen',
    description: '30-minute call with our recruiting team',
    duration: '3-5 days'
  },
  {
    step: 3,
    title: 'Technical Interview',
    description: 'Role-specific assessment with the hiring manager',
    duration: '1 week'
  },
  {
    step: 4,
    title: 'Team Interviews',
    description: 'Meet with team members and cross-functional partners',
    duration: '1 week'
  },
  {
    step: 5,
    title: 'Offer',
    description: 'Receive your offer and join our team!',
    duration: '3-5 days'
  }
]

const departments = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Customer Success']
const locations = ['All', 'Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Boston, MA', 'Chicago, IL', 'Seattle, WA']

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [selectedJob, setSelectedJob] = useState<typeof jobOpenings[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = selectedDepartment === 'All' || job.department === selectedDepartment
    const matchesLocation = selectedLocation === 'All' ||
                           job.location.includes(selectedLocation) ||
                           (selectedLocation === 'Remote' && job.remote === 'Remote')

    return matchesSearch && matchesDepartment && matchesLocation
  })

  const handleJobClick = (job: typeof jobOpenings[0]) => {
    setSelectedJob(job)
    setIsDialogOpen(true)
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
            <Briefcase className="w-3 h-3 mr-1" />
            We're Hiring!
          </Badge>
          <h1 className="text-4xl md:text-6xl font-mono font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Join our mission
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            We're building the future of work collaboration. Join a team of talented,
            passionate people making a real impact on how teams work together.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View Open Positions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Why Work Here
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { icon: Users, value: '150+', label: 'Team Members' },
            { icon: Globe, value: '15+', label: 'Countries' },
            { icon: Briefcase, value: '12+', label: 'Open Positions' },
            { icon: Award, value: '4.9/5', label: 'Glassdoor Rating' }
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx} className="glass border-border/30 p-6 text-center">
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            )
          })}
        </motion.div>
      </section>

      {/* Company Values */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide how we work and make decisions
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {companyValues.map((value, idx) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <Card className="glass border-border/30 p-6 text-center h-full">
                  <Icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Benefits & Perks</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We invest in our team's success and well-being
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className="glass border-border/30 p-6 h-full">
                  <Icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{benefit.description}</p>
                  <ul className="space-y-2">
                    {benefit.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Open Positions */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Open Positions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find your next opportunity
          </p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="glass border-border/30 rounded-lg p-6">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search positions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass border-border/30 pl-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Department Filter */}
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="glass border-border/30">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="glass-dark border-border/30">
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="glass border-border/30">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="glass-dark border-border/30">
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>{filteredJobs.length} positions found</span>
              {(searchQuery || selectedDepartment !== 'All' || selectedLocation !== 'All') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedDepartment('All')
                    setSelectedLocation('All')
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="max-w-5xl mx-auto space-y-4">
          <AnimatePresence mode="wait">
            {filteredJobs.map((job, idx) => {
              const Icon = job.icon
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                >
                  <Card
                    className="glass border-border/30 p-6 hover:border-primary/30 transition-all group cursor-pointer"
                    onClick={() => handleJobClick(job)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">{job.description}</p>

                          {/* Meta Info */}
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {job.department}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.type}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {job.salary}
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex gap-2 mt-3">
                            <Badge variant="outline" className="border-primary/30">
                              {job.remote}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* No Results */}
          {filteredJobs.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No positions found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('')
                setSelectedDepartment('All')
                setSelectedLocation('All')
              }}>
                Clear filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Hiring Process */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Hiring Process</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transparent, respectful, and designed to find the best mutual fit
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {hiringProcess.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {idx !== hiringProcess.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-border/30" />
              )}

              <div className="flex gap-6 mb-12">
                {/* Step Number */}
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 border-2 border-primary/30 z-10">
                  <span className="text-lg font-bold text-primary">{step.step}</span>
                </div>

                {/* Content */}
                <Card className="glass border-border/30 p-6 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <Badge variant="outline" className="border-primary/30">
                      {step.duration}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="glass border-primary/30 p-12 text-center max-w-4xl mx-auto">
          <Rocket className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-4">Don't see the right role?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always looking for talented people. Send us your resume and
            we'll reach out if there's a match.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Submit General Application
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Contact Recruiting
            </Button>
          </div>
        </Card>
      </section>

      {/* Job Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-overlay border-border/30 max-w-3xl">
          {selectedJob && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <selectedJob.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl mb-2">{selectedJob.title}</DialogTitle>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {selectedJob.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedJob.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedJob.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {selectedJob.salary}
                      </div>
                    </div>
                  </div>
                </div>
                <DialogDescription className="text-base">
                  {selectedJob.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Requirements */}
                <div>
                  <h4 className="font-semibold mb-3">Requirements</h4>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-primary">
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Share Position
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

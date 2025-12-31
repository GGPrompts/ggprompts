"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  Filter,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Laptop,
  Mail,
  MapPin,
  Search,
  Send,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
  Bell,
  FileText,
  Building,
  Zap,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

// TypeScript Interfaces
interface Company {
  id: string
  name: string
  logo: string
  industry: string
  size: string
  rating: number
  openRoles: number
}

interface Job {
  id: string
  title: string
  company: Company
  location: string
  salary: { min: number; max: number; currency: string }
  type: "full-time" | "part-time" | "contract" | "internship"
  experience: "entry" | "mid" | "senior" | "lead"
  remote: "remote" | "hybrid" | "onsite"
  postedAt: string
  tags: string[]
  description: string
  requirements: string[]
  benefits: string[]
  applicantCount: number
  isBookmarked: boolean
}

interface FilterState {
  jobTypes: string[]
  experienceLevels: string[]
  remoteOptions: string[]
  salaryRange: [number, number]
  companySizes: string[]
  postedWithin: string
}

// Mock Data
const companies: Company[] = [
  { id: "c1", name: "TechCorp AI", logo: "TC", industry: "Artificial Intelligence", size: "1000-5000", rating: 4.8, openRoles: 24 },
  { id: "c2", name: "CloudScale", logo: "CS", industry: "Cloud Computing", size: "500-1000", rating: 4.6, openRoles: 18 },
  { id: "c3", name: "DataFlow", logo: "DF", industry: "Data Analytics", size: "200-500", rating: 4.5, openRoles: 12 },
  { id: "c4", name: "SecureNet", logo: "SN", industry: "Cybersecurity", size: "100-200", rating: 4.7, openRoles: 8 },
  { id: "c5", name: "FinTech Pro", logo: "FP", industry: "Financial Technology", size: "1000-5000", rating: 4.4, openRoles: 31 },
  { id: "c6", name: "HealthAI", logo: "HA", industry: "Healthcare Tech", size: "500-1000", rating: 4.9, openRoles: 15 },
]

const jobs: Job[] = [
  {
    id: "j1",
    title: "Senior Frontend Engineer",
    company: companies[0],
    location: "San Francisco, CA",
    salary: { min: 150000, max: 200000, currency: "USD" },
    type: "full-time",
    experience: "senior",
    remote: "hybrid",
    postedAt: "2 hours ago",
    tags: ["React", "TypeScript", "Next.js", "GraphQL"],
    description: "We're looking for a Senior Frontend Engineer to lead our web platform development. You'll work on cutting-edge AI-powered interfaces and collaborate with a world-class team.",
    requirements: [
      "5+ years of frontend development experience",
      "Expert knowledge of React and TypeScript",
      "Experience with state management (Redux, Zustand)",
      "Strong understanding of web performance optimization",
      "Experience with design systems and component libraries",
    ],
    benefits: ["Unlimited PTO", "Health, dental & vision", "401k matching", "Learning budget", "Remote-friendly"],
    applicantCount: 47,
    isBookmarked: false,
  },
  {
    id: "j2",
    title: "Machine Learning Engineer",
    company: companies[0],
    location: "Remote",
    salary: { min: 180000, max: 250000, currency: "USD" },
    type: "full-time",
    experience: "senior",
    remote: "remote",
    postedAt: "5 hours ago",
    tags: ["Python", "PyTorch", "MLOps", "AWS"],
    description: "Join our ML team to build and deploy production machine learning systems. You'll work on large-scale models and innovative AI applications.",
    requirements: [
      "MS/PhD in Computer Science or related field",
      "5+ years of ML engineering experience",
      "Strong Python and deep learning frameworks",
      "Experience with MLOps and model deployment",
      "Published research is a plus",
    ],
    benefits: ["Stock options", "Annual bonus", "Conference budget", "Home office stipend", "Flexible hours"],
    applicantCount: 89,
    isBookmarked: true,
  },
  {
    id: "j3",
    title: "DevOps Engineer",
    company: companies[1],
    location: "Seattle, WA",
    salary: { min: 130000, max: 170000, currency: "USD" },
    type: "full-time",
    experience: "mid",
    remote: "hybrid",
    postedAt: "1 day ago",
    tags: ["Kubernetes", "Terraform", "AWS", "CI/CD"],
    description: "Help us scale our cloud infrastructure to serve millions of users. You'll design and implement robust deployment pipelines and monitoring systems.",
    requirements: [
      "3+ years of DevOps experience",
      "Strong Kubernetes and container orchestration",
      "Infrastructure as Code (Terraform, Pulumi)",
      "Experience with major cloud providers",
      "Strong scripting skills (Python, Bash)",
    ],
    benefits: ["Relocation assistance", "Gym membership", "Team offsites", "Parental leave", "Mental health support"],
    applicantCount: 32,
    isBookmarked: false,
  },
  {
    id: "j4",
    title: "Product Designer",
    company: companies[2],
    location: "New York, NY",
    salary: { min: 120000, max: 160000, currency: "USD" },
    type: "full-time",
    experience: "mid",
    remote: "onsite",
    postedAt: "2 days ago",
    tags: ["Figma", "User Research", "Design Systems", "Prototyping"],
    description: "Create beautiful, intuitive interfaces for our data analytics platform. You'll lead design initiatives and work closely with product and engineering.",
    requirements: [
      "4+ years of product design experience",
      "Strong portfolio showcasing B2B/SaaS work",
      "Expert in Figma and prototyping tools",
      "Experience conducting user research",
      "Understanding of frontend development",
    ],
    benefits: ["Creative freedom", "Design tool budget", "Gallery visits", "Flexible schedule", "Health benefits"],
    applicantCount: 56,
    isBookmarked: true,
  },
  {
    id: "j5",
    title: "Security Analyst",
    company: companies[3],
    location: "Austin, TX",
    salary: { min: 100000, max: 140000, currency: "USD" },
    type: "full-time",
    experience: "entry",
    remote: "hybrid",
    postedAt: "3 days ago",
    tags: ["SIEM", "Penetration Testing", "SOC", "Compliance"],
    description: "Join our security operations team to protect our clients from cyber threats. Great opportunity for growing your security career.",
    requirements: [
      "1-2 years of security experience",
      "Security certifications (CISSP, CEH, etc.)",
      "Knowledge of security frameworks",
      "Experience with SIEM tools",
      "Strong analytical skills",
    ],
    benefits: ["Certification sponsorship", "Training budget", "Mentorship program", "Career growth", "Competitive salary"],
    applicantCount: 78,
    isBookmarked: false,
  },
  {
    id: "j6",
    title: "Backend Engineer (Go)",
    company: companies[4],
    location: "Chicago, IL",
    salary: { min: 140000, max: 180000, currency: "USD" },
    type: "full-time",
    experience: "senior",
    remote: "remote",
    postedAt: "4 days ago",
    tags: ["Go", "PostgreSQL", "gRPC", "Microservices"],
    description: "Build high-performance financial systems that process millions of transactions. You'll work on our core payment infrastructure.",
    requirements: [
      "5+ years of backend development",
      "Strong Go experience",
      "Database design and optimization",
      "Distributed systems knowledge",
      "FinTech experience preferred",
    ],
    benefits: ["Equity package", "Performance bonus", "Financial wellness", "Premium insurance", "Sabbatical program"],
    applicantCount: 41,
    isBookmarked: false,
  },
  {
    id: "j7",
    title: "Data Scientist",
    company: companies[5],
    location: "Boston, MA",
    salary: { min: 125000, max: 165000, currency: "USD" },
    type: "full-time",
    experience: "mid",
    remote: "hybrid",
    postedAt: "5 days ago",
    tags: ["Python", "SQL", "Machine Learning", "Statistics"],
    description: "Apply data science to healthcare challenges. You'll analyze patient data and build predictive models that improve health outcomes.",
    requirements: [
      "MS in Data Science or related field",
      "3+ years of data science experience",
      "Strong statistical modeling skills",
      "Healthcare domain knowledge preferred",
      "Experience with clinical data",
    ],
    benefits: ["Mission-driven work", "Research opportunities", "Publication support", "Health coverage", "Wellness programs"],
    applicantCount: 63,
    isBookmarked: false,
  },
  {
    id: "j8",
    title: "UX Researcher",
    company: companies[2],
    location: "Remote",
    salary: { min: 95000, max: 130000, currency: "USD" },
    type: "contract",
    experience: "mid",
    remote: "remote",
    postedAt: "1 week ago",
    tags: ["User Research", "Usability Testing", "Surveys", "Analytics"],
    description: "Lead user research initiatives to inform product decisions. You'll conduct studies, synthesize findings, and present insights to stakeholders.",
    requirements: [
      "3+ years of UX research experience",
      "Experience with qualitative and quantitative methods",
      "Strong presentation skills",
      "Experience with research tools",
      "B2B/SaaS background preferred",
    ],
    benefits: ["Flexible contract", "Remote work", "Competitive rate", "Interesting projects", "Growth potential"],
    applicantCount: 29,
    isBookmarked: false,
  },
  {
    id: "j9",
    title: "Junior Software Developer",
    company: companies[1],
    location: "Denver, CO",
    salary: { min: 70000, max: 90000, currency: "USD" },
    type: "full-time",
    experience: "entry",
    remote: "onsite",
    postedAt: "1 week ago",
    tags: ["JavaScript", "Python", "REST APIs", "Git"],
    description: "Start your software development career with us. You'll learn from senior engineers and work on real production systems.",
    requirements: [
      "BS in Computer Science or bootcamp graduate",
      "Basic programming knowledge",
      "Eagerness to learn",
      "Good communication skills",
      "Team player",
    ],
    benefits: ["Mentorship", "Training programs", "Career path", "Young team", "Fun office"],
    applicantCount: 156,
    isBookmarked: false,
  },
  {
    id: "j10",
    title: "Engineering Manager",
    company: companies[4],
    location: "New York, NY",
    salary: { min: 200000, max: 280000, currency: "USD" },
    type: "full-time",
    experience: "lead",
    remote: "hybrid",
    postedAt: "2 weeks ago",
    tags: ["Leadership", "Agile", "Technical Strategy", "Team Building"],
    description: "Lead a team of talented engineers building next-generation financial products. You'll shape technical strategy and grow your team.",
    requirements: [
      "7+ years of engineering experience",
      "3+ years of management experience",
      "Strong technical background",
      "Experience scaling teams",
      "FinTech experience preferred",
    ],
    benefits: ["Executive benefits", "Large equity", "Leadership coaching", "Board exposure", "Travel opportunities"],
    applicantCount: 23,
    isBookmarked: true,
  },
]

// Filter options
const jobTypes = ["full-time", "part-time", "contract", "internship"]
const experienceLevels = ["entry", "mid", "senior", "lead"]
const remoteOptions = ["remote", "hybrid", "onsite"]
const companySizes = ["1-50", "50-200", "200-500", "500-1000", "1000-5000", "5000+"]
const postedWithinOptions = ["24h", "3d", "1w", "2w", "1m", "any"]

export default function JobBoard() {
  // State
  const [searchQuery, setSearchQuery] = useState("")
  const [locationQuery, setLocationQuery] = useState("")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [alertEmail, setAlertEmail] = useState("")
  const [showAlertSuccess, setShowAlertSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    jobTypes: [],
    experienceLevels: [],
    remoteOptions: [],
    salaryRange: [0, 300000],
    companySizes: [],
    postedWithin: "any",
  })

  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>(
    jobs.filter(j => j.isBookmarked).map(j => j.id)
  )

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search query
      if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false
      }

      // Location query
      if (locationQuery && !job.location.toLowerCase().includes(locationQuery.toLowerCase())) {
        return false
      }

      // Job type filter
      if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(job.type)) {
        return false
      }

      // Experience filter
      if (filters.experienceLevels.length > 0 && !filters.experienceLevels.includes(job.experience)) {
        return false
      }

      // Remote filter
      if (filters.remoteOptions.length > 0 && !filters.remoteOptions.includes(job.remote)) {
        return false
      }

      // Salary filter
      if (job.salary.min < filters.salaryRange[0] || job.salary.max > filters.salaryRange[1]) {
        return false
      }

      // Bookmarked tab
      if (activeTab === "saved" && !bookmarkedJobs.includes(job.id)) {
        return false
      }

      return true
    })
  }, [searchQuery, locationQuery, filters, activeTab, bookmarkedJobs])

  // Toggle bookmark
  const toggleBookmark = (jobId: string) => {
    setBookmarkedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    )
  }

  // Handle filter change
  const toggleFilter = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      return { ...prev, [filterType]: newValues }
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      jobTypes: [],
      experienceLevels: [],
      remoteOptions: [],
      salaryRange: [0, 300000],
      companySizes: [],
      postedWithin: "any",
    })
    setSearchQuery("")
    setLocationQuery("")
  }

  // Handle job alert signup
  const handleAlertSignup = () => {
    if (alertEmail) {
      setShowAlertSuccess(true)
      setTimeout(() => setShowAlertSuccess(false), 3000)
      setAlertEmail("")
    }
  }

  // Get remote icon
  const getRemoteIcon = (remote: string) => {
    switch (remote) {
      case "remote": return <Globe className="h-3.5 w-3.5" />
      case "hybrid": return <Laptop className="h-3.5 w-3.5" />
      case "onsite": return <Building2 className="h-3.5 w-3.5" />
      default: return null
    }
  }

  // Format salary
  const formatSalary = (min: number, max: number) => {
    const formatter = (n: number) => `$${(n / 1000).toFixed(0)}k`
    return `${formatter(min)} - ${formatter(max)}`
  }

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Job Type */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Job Type</h4>
        <div className="space-y-2">
          {jobTypes.map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.jobTypes.includes(type)}
                onCheckedChange={() => toggleFilter("jobTypes", type)}
              />
              <span className="text-sm text-muted-foreground capitalize">{type.replace("-", " ")}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Experience Level */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Experience Level</h4>
        <div className="space-y-2">
          {experienceLevels.map(level => (
            <label key={level} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.experienceLevels.includes(level)}
                onCheckedChange={() => toggleFilter("experienceLevels", level)}
              />
              <span className="text-sm text-muted-foreground capitalize">{level} Level</span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Work Location */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Work Location</h4>
        <div className="space-y-2">
          {remoteOptions.map(option => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.remoteOptions.includes(option)}
                onCheckedChange={() => toggleFilter("remoteOptions", option)}
              />
              <span className="text-sm text-muted-foreground capitalize flex items-center gap-1.5">
                {getRemoteIcon(option)}
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Salary Range */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Salary Range</h4>
        <div className="px-2">
          <Slider
            value={filters.salaryRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, salaryRange: value as [number, number] }))}
            min={0}
            max={300000}
            step={10000}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>${(filters.salaryRange[0] / 1000).toFixed(0)}k</span>
            <span>${(filters.salaryRange[1] / 1000).toFixed(0)}k+</span>
          </div>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full border-border/50 text-muted-foreground hover:text-foreground"
        onClick={clearFilters}
      >
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">
            Job Board
          </h1>
          <p className="text-muted-foreground mt-2">
            Find your next opportunity from {jobs.length}+ open positions
          </p>
        </motion.div>

        {/* Search Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass border-primary/30 p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Job title, keyword, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="City, state, or 'Remote'"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search Jobs</span>
                <span className="sm:hidden">Search</span>
              </Button>

              {/* Mobile filter button */}
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden border-border/50 gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="glass w-[300px]">
                  <SheetHeader>
                    <SheetTitle className="text-foreground">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge
                className={`cursor-pointer transition-colors ${
                  filters.remoteOptions.includes("remote")
                    ? "bg-primary/20 text-primary border-primary/30"
                    : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                }`}
                onClick={() => toggleFilter("remoteOptions", "remote")}
              >
                <Globe className="h-3 w-3 mr-1" />
                Remote
              </Badge>
              <Badge
                className={`cursor-pointer transition-colors ${
                  filters.experienceLevels.includes("entry")
                    ? "bg-primary/20 text-primary border-primary/30"
                    : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                }`}
                onClick={() => toggleFilter("experienceLevels", "entry")}
              >
                <GraduationCap className="h-3 w-3 mr-1" />
                Entry Level
              </Badge>
              <Badge
                className={`cursor-pointer transition-colors ${
                  filters.jobTypes.includes("full-time")
                    ? "bg-primary/20 text-primary border-primary/30"
                    : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                }`}
                onClick={() => toggleFilter("jobTypes", "full-time")}
              >
                <Briefcase className="h-3 w-3 mr-1" />
                Full-time
              </Badge>
              <Badge
                className={`cursor-pointer transition-colors ${
                  filters.salaryRange[0] >= 100000
                    ? "bg-primary/20 text-primary border-primary/30"
                    : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                }`}
                onClick={() => setFilters(prev => ({
                  ...prev,
                  salaryRange: prev.salaryRange[0] >= 100000 ? [0, 300000] : [100000, 300000]
                }))}
              >
                <DollarSign className="h-3 w-3 mr-1" />
                $100k+
              </Badge>
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[280px_1fr_400px] gap-6">
          {/* Filter Sidebar - Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block"
          >
            <Card className="glass border-primary/30 p-5 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  Filters
                </h3>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                  {filteredJobs.length} results
                </Badge>
              </div>
              <FilterContent />
            </Card>
          </motion.div>

          {/* Job Listings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="glass border-primary/30">
                <TabsTrigger value="all" className="text-sm">
                  All Jobs
                  <Badge className="ml-2 bg-muted/50 text-muted-foreground text-xs">{jobs.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="saved" className="text-sm">
                  <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                  Saved
                  <Badge className="ml-2 bg-muted/50 text-muted-foreground text-xs">{bookmarkedJobs.length}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {filteredJobs.map((job, idx) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2, delay: idx * 0.03 }}
                        >
                          <Card
                            className={`glass-dark p-4 cursor-pointer transition-all hover:border-primary/50 ${
                              selectedJob?.id === job.id ? "border-primary/50 ring-1 ring-primary/20" : "border-border/30"
                            }`}
                            onClick={() => setSelectedJob(job)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                {/* Company Logo */}
                                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-primary font-bold text-sm">{job.company.logo}</span>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
                                  <p className="text-sm text-muted-foreground">{job.company.name}</p>

                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {job.location}
                                    </span>
                                    <span className="text-xs text-secondary flex items-center gap-1">
                                      <DollarSign className="h-3 w-3" />
                                      {formatSalary(job.salary.min, job.salary.max)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Bookmark */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleBookmark(job.id)
                                }}
                              >
                                {bookmarkedJobs.includes(job.id) ? (
                                  <BookmarkCheck className="h-4 w-4 text-primary" />
                                ) : (
                                  <Bookmark className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-xs capitalize">
                                {getRemoteIcon(job.remote)}
                                <span className="ml-1">{job.remote}</span>
                              </Badge>
                              <Badge className="bg-muted/50 text-muted-foreground border-border/30 text-xs capitalize">
                                {job.type.replace("-", " ")}
                              </Badge>
                              {job.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} className="bg-primary/10 text-primary border-primary/20 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {job.tags.length > 2 && (
                                <Badge className="bg-muted/50 text-muted-foreground border-border/30 text-xs">
                                  +{job.tags.length - 2}
                                </Badge>
                              )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {job.postedAt}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {job.applicantCount} applicants
                              </span>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {filteredJobs.length === 0 && (
                      <div className="text-center py-12">
                        <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
                        <p className="text-muted-foreground text-sm">Try adjusting your filters or search terms</p>
                        <Button variant="outline" className="mt-4" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="saved" className="mt-4">
                <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {filteredJobs.map((job, idx) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2, delay: idx * 0.03 }}
                        >
                          <Card
                            className={`glass-dark p-4 cursor-pointer transition-all hover:border-primary/50 ${
                              selectedJob?.id === job.id ? "border-primary/50 ring-1 ring-primary/20" : "border-border/30"
                            }`}
                            onClick={() => setSelectedJob(job)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-primary font-bold text-sm">{job.company.logo}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
                                  <p className="text-sm text-muted-foreground">{job.company.name}</p>
                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {job.location}
                                    </span>
                                    <span className="text-xs text-secondary flex items-center gap-1">
                                      <DollarSign className="h-3 w-3" />
                                      {formatSalary(job.salary.min, job.salary.max)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleBookmark(job.id)
                                }}
                              >
                                <BookmarkCheck className="h-4 w-4 text-primary" />
                              </Button>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {bookmarkedJobs.length === 0 && (
                      <div className="text-center py-12">
                        <Bookmark className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No saved jobs</h3>
                        <p className="text-muted-foreground text-sm">Bookmark jobs you're interested in</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Right Panel - Job Detail / Company Cards / Salary Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            {/* Job Detail Panel */}
            {selectedJob ? (
              <Card className="glass border-primary/30 p-5 sticky top-6">
                <ScrollArea className="h-[calc(100vh-400px)]">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">{selectedJob.company.logo}</span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">{selectedJob.title}</h2>
                        <p className="text-muted-foreground">{selectedJob.company.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-muted-foreground">{selectedJob.company.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedJob(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Key Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="glass-dark rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Salary</p>
                      <p className="text-sm font-semibold text-secondary">
                        {formatSalary(selectedJob.salary.min, selectedJob.salary.max)}
                      </p>
                    </div>
                    <div className="glass-dark rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
                      <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                        {getRemoteIcon(selectedJob.remote)}
                        {selectedJob.location}
                      </p>
                    </div>
                    <div className="glass-dark rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Experience</p>
                      <p className="text-sm font-semibold text-foreground capitalize">{selectedJob.experience} Level</p>
                    </div>
                    <div className="glass-dark rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Type</p>
                      <p className="text-sm font-semibold text-foreground capitalize">{selectedJob.type.replace("-", " ")}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {selectedJob.tags.map(tag => (
                      <Badge key={tag} className="bg-primary/10 text-primary border-primary/20 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Separator className="bg-border/50 my-4" />

                  {/* Description */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedJob.description}</p>
                  </div>

                  {/* Requirements */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Requirements</h4>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Benefits</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.benefits.map((benefit, idx) => (
                        <Badge key={idx} className="bg-secondary/10 text-secondary border-secondary/20 text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Salary Insights */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Salary Insights
                    </h4>
                    <div className="glass-dark rounded-lg p-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span>Market Low</span>
                        <span>Market High</span>
                      </div>
                      <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-gradient-to-r from-primary/50 to-secondary rounded-full"
                          style={{
                            left: `${(selectedJob.salary.min / 300000) * 100}%`,
                            width: `${((selectedJob.salary.max - selectedJob.salary.min) / 300000) * 100}%`
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-2">
                        <span className="text-muted-foreground">$0k</span>
                        <span className="text-secondary font-mono">{formatSalary(selectedJob.salary.min, selectedJob.salary.max)}</span>
                        <span className="text-muted-foreground">$300k</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                {/* Quick Apply */}
                <div className="pt-4 border-t border-border/30 space-y-2">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <Zap className="h-4 w-4" />
                    Quick Apply
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-border/50 text-foreground"
                      onClick={() => toggleBookmark(selectedJob.id)}
                    >
                      {bookmarkedJobs.includes(selectedJob.id) ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="flex-1 border-border/50 text-foreground">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Site
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <>
                {/* Featured Companies */}
                <Card className="glass border-secondary/30 p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Building className="h-4 w-4 text-secondary" />
                    Featured Companies
                  </h3>
                  <div className="space-y-3">
                    {companies.slice(0, 4).map((company, idx) => (
                      <motion.div
                        key={company.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className="glass-dark rounded-lg p-3 cursor-pointer hover:border-secondary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                            <span className="text-secondary font-bold text-xs">{company.logo}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground truncate">{company.name}</h4>
                            <p className="text-xs text-muted-foreground">{company.industry}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-primary">{company.openRoles}</p>
                            <p className="text-xs text-muted-foreground">roles</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-muted-foreground">{company.rating}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{company.size} employees</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Job Alerts */}
                <Card className="glass border-primary/30 p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    Job Alerts
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Get notified when new jobs match your search criteria
                  </p>

                  <AnimatePresence mode="wait">
                    {showAlertSuccess ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-dark rounded-lg p-4 text-center"
                      >
                        <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium text-foreground">Alert Created!</p>
                        <p className="text-xs text-muted-foreground">We'll email you when new jobs match</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={alertEmail}
                            onChange={(e) => setAlertEmail(e.target.value)}
                            className="pl-10 bg-background/50 border-border/50"
                          />
                        </div>
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={handleAlertSignup}
                          disabled={!alertEmail}
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          Create Alert
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Stats */}
                <Card className="glass border-border/30 p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Job Market Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">New jobs today</span>
                      <span className="text-sm font-mono text-primary">+127</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Remote positions</span>
                      <span className="text-sm font-mono text-secondary">34%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Avg. salary (Senior)</span>
                      <span className="text-sm font-mono text-foreground">$165k</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Top skill demand</span>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">React</Badge>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </motion.div>
        </div>

        {/* Mobile Job Detail Sheet */}
        <Sheet open={!!selectedJob && window.innerWidth < 1024} onOpenChange={() => setSelectedJob(null)}>
          <SheetContent side="bottom" className="glass h-[85vh] rounded-t-2xl">
            {selectedJob && (
              <ScrollArea className="h-full">
                <SheetHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">{selectedJob.company.logo}</span>
                    </div>
                    <div>
                      <SheetTitle className="text-foreground text-left">{selectedJob.title}</SheetTitle>
                      <p className="text-muted-foreground text-sm">{selectedJob.company.name}</p>
                    </div>
                  </div>
                </SheetHeader>

                <div className="space-y-4 pb-20">
                  {/* Key Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-dark rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Salary</p>
                      <p className="text-sm font-semibold text-secondary">
                        {formatSalary(selectedJob.salary.min, selectedJob.salary.max)}
                      </p>
                    </div>
                    <div className="glass-dark rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
                      <p className="text-sm font-semibold text-foreground">{selectedJob.location}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Requirements</h4>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Benefits</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.benefits.map((benefit, idx) => (
                        <Badge key={idx} className="bg-secondary/10 text-secondary border-secondary/20 text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fixed Apply Button */}
                <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/30">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <Zap className="h-4 w-4" />
                    Quick Apply
                  </Button>
                </div>
              </ScrollArea>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

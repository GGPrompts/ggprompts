"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Edit3,
  Filter,
  Globe,
  Mail,
  MapPin,
  Merge,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Tag,
  Trash2,
  Upload,
  User,
  Users,
  X,
  MessageSquare,
  Video,
  FileText,
  Clock,
  Check,
  AlertCircle,
  DollarSign,
  ArrowUpRight,
  Copy,
  Star,
  StarOff,
} from "lucide-react"
import { Card, Button, Badge, Input, Checkbox, Avatar, AvatarFallback, AvatarImage, Sheet, SheetContent, SheetHeader, SheetTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, Separator, ScrollArea, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Label, Textarea } from "@ggprompts/ui"

// TypeScript Interfaces
interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface Deal {
  id: string
  name: string
  value: number
  stage: string
  probability: number
}

interface Company {
  id: string
  name: string
  domain: string
  industry: string
  size: string
  annualRevenue?: number
  location?: string
  logo?: string
}

interface Activity {
  id: string
  type: "email" | "call" | "meeting" | "note" | "deal"
  title: string
  description: string
  timestamp: string
  user: User
}

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: Company
  title?: string
  tags: string[]
  owner: User
  source: string
  createdAt: string
  lastContactedAt?: string
  customFields: Record<string, string>
  starred: boolean
  activities: Activity[]
}

interface Segment {
  id: string
  name: string
  filters: string[]
  contactCount: number
  isDynamic: boolean
  color: string
}

// Mock Data
const mockUsers: User[] = [
  { id: "u1", name: "Sarah Chen", email: "sarah@company.com", avatar: "" },
  { id: "u2", name: "Mike Johnson", email: "mike@company.com", avatar: "" },
  { id: "u3", name: "Emily Davis", email: "emily@company.com", avatar: "" },
]

const mockCompanies: Company[] = [
  {
    id: "c1",
    name: "TechCorp Inc",
    domain: "techcorp.com",
    industry: "Technology",
    size: "51-200",
    annualRevenue: 5000000,
    location: "San Francisco, CA",
  },
  {
    id: "c2",
    name: "Global Solutions",
    domain: "globalsolutions.io",
    industry: "Consulting",
    size: "201-500",
    annualRevenue: 15000000,
    location: "New York, NY",
  },
  {
    id: "c3",
    name: "StartupXYZ",
    domain: "startupxyz.com",
    industry: "SaaS",
    size: "11-50",
    annualRevenue: 1200000,
    location: "Austin, TX",
  },
  {
    id: "c4",
    name: "Enterprise Ltd",
    domain: "enterprise.co",
    industry: "Finance",
    size: "501-1000",
    annualRevenue: 50000000,
    location: "Chicago, IL",
  },
  {
    id: "c5",
    name: "DataDriven Co",
    domain: "datadriven.ai",
    industry: "AI/ML",
    size: "11-50",
    annualRevenue: 3000000,
    location: "Seattle, WA",
  },
]

const mockActivities: Activity[] = [
  {
    id: "a1",
    type: "email",
    title: "Sent proposal",
    description: "Sent Q4 pricing proposal via email",
    timestamp: "2024-01-15T10:30:00Z",
    user: mockUsers[0],
  },
  {
    id: "a2",
    type: "call",
    title: "Discovery call",
    description: "30-minute call to discuss requirements",
    timestamp: "2024-01-14T14:00:00Z",
    user: mockUsers[0],
  },
  {
    id: "a3",
    type: "meeting",
    title: "Product demo",
    description: "Presented product features to stakeholders",
    timestamp: "2024-01-12T11:00:00Z",
    user: mockUsers[1],
  },
  {
    id: "a4",
    type: "note",
    title: "Budget confirmed",
    description: "Client confirmed $50k budget for Q1",
    timestamp: "2024-01-10T09:15:00Z",
    user: mockUsers[0],
  },
  {
    id: "a5",
    type: "deal",
    title: "Deal created",
    description: "Created opportunity worth $45,000",
    timestamp: "2024-01-08T16:30:00Z",
    user: mockUsers[2],
  },
]

const mockContacts: Contact[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: mockCompanies[0],
    title: "VP of Engineering",
    tags: ["Decision Maker", "Technical"],
    owner: mockUsers[0],
    source: "Website",
    createdAt: "2024-01-01T00:00:00Z",
    lastContactedAt: "2024-01-15T10:30:00Z",
    customFields: { LinkedIn: "linkedin.com/in/johnsmith" },
    starred: true,
    activities: mockActivities,
  },
  {
    id: "2",
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma.wilson@globalsolutions.io",
    phone: "+1 (555) 234-5678",
    company: mockCompanies[1],
    title: "Director of Operations",
    tags: ["Decision Maker", "Budget Holder"],
    owner: mockUsers[1],
    source: "Referral",
    createdAt: "2024-01-03T00:00:00Z",
    lastContactedAt: "2024-01-14T09:00:00Z",
    customFields: { LinkedIn: "linkedin.com/in/emmawilson" },
    starred: false,
    activities: mockActivities.slice(0, 3),
  },
  {
    id: "3",
    firstName: "Alex",
    lastName: "Chen",
    email: "alex@startupxyz.com",
    phone: "+1 (555) 345-6789",
    company: mockCompanies[2],
    title: "CEO",
    tags: ["Founder", "Decision Maker"],
    owner: mockUsers[0],
    source: "LinkedIn",
    createdAt: "2024-01-05T00:00:00Z",
    lastContactedAt: "2024-01-13T15:00:00Z",
    customFields: { Twitter: "@alexchen" },
    starred: true,
    activities: mockActivities.slice(1, 4),
  },
  {
    id: "4",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@enterprise.co",
    phone: "+1 (555) 456-7890",
    company: mockCompanies[3],
    title: "CFO",
    tags: ["Budget Holder", "Executive"],
    owner: mockUsers[2],
    source: "Conference",
    createdAt: "2024-01-07T00:00:00Z",
    lastContactedAt: "2024-01-12T11:00:00Z",
    customFields: {},
    starred: false,
    activities: mockActivities.slice(2, 5),
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Kim",
    email: "david.kim@datadriven.ai",
    phone: "+1 (555) 567-8901",
    company: mockCompanies[4],
    title: "CTO",
    tags: ["Technical", "Evaluator"],
    owner: mockUsers[0],
    source: "Webinar",
    createdAt: "2024-01-08T00:00:00Z",
    lastContactedAt: "2024-01-11T14:30:00Z",
    customFields: { GitHub: "github.com/davidkim" },
    starred: false,
    activities: mockActivities.slice(0, 2),
  },
  {
    id: "6",
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa@techcorp.com",
    phone: "+1 (555) 678-9012",
    company: mockCompanies[0],
    title: "Product Manager",
    tags: ["Technical", "Influencer"],
    owner: mockUsers[1],
    source: "Website",
    createdAt: "2024-01-10T00:00:00Z",
    lastContactedAt: "2024-01-10T10:00:00Z",
    customFields: {},
    starred: false,
    activities: mockActivities.slice(3, 5),
  },
  {
    id: "7",
    firstName: "James",
    lastName: "Brown",
    email: "james.brown@globalsolutions.io",
    phone: "+1 (555) 789-0123",
    company: mockCompanies[1],
    title: "IT Director",
    tags: ["Technical", "Evaluator"],
    owner: mockUsers[2],
    source: "Cold Outreach",
    createdAt: "2024-01-12T00:00:00Z",
    lastContactedAt: "2024-01-09T16:00:00Z",
    customFields: {},
    starred: true,
    activities: mockActivities.slice(1, 3),
  },
  {
    id: "8",
    firstName: "Sophie",
    lastName: "Taylor",
    email: "sophie@enterprise.co",
    phone: "+1 (555) 890-1234",
    company: mockCompanies[3],
    title: "Head of Procurement",
    tags: ["Budget Holder", "Decision Maker"],
    owner: mockUsers[0],
    source: "Referral",
    createdAt: "2024-01-14T00:00:00Z",
    lastContactedAt: "2024-01-08T09:30:00Z",
    customFields: {},
    starred: false,
    activities: mockActivities.slice(0, 4),
  },
]

const mockSegments: Segment[] = [
  {
    id: "s1",
    name: "Decision Makers",
    filters: ["tag:Decision Maker"],
    contactCount: 5,
    isDynamic: true,
    color: "primary",
  },
  {
    id: "s2",
    name: "Recently Active",
    filters: ["lastContact:7days"],
    contactCount: 6,
    isDynamic: true,
    color: "secondary",
  },
  {
    id: "s3",
    name: "Enterprise Accounts",
    filters: ["companySize:500+"],
    contactCount: 3,
    isDynamic: true,
    color: "accent",
  },
  {
    id: "s4",
    name: "Starred Contacts",
    filters: ["starred:true"],
    contactCount: 3,
    isDynamic: false,
    color: "primary",
  },
]

const allTags = [
  "Decision Maker",
  "Technical",
  "Budget Holder",
  "Founder",
  "Executive",
  "Evaluator",
  "Influencer",
]

type SortField = "name" | "company" | "lastContactedAt" | "createdAt"
type SortDirection = "asc" | "desc"

export default function ContactManagement() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const [selectedOwner, setSelectedOwner] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("lastContactedAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [activeView, setActiveView] = useState<"contacts" | "companies">("contacts")
  const [showAddContact, setShowAddContact] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showMerge, setShowMerge] = useState(false)
  const [showTagManager, setShowTagManager] = useState(false)

  // Filtered and sorted contacts
  const filteredContacts = useMemo(() => {
    let result = [...contacts]

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.firstName.toLowerCase().includes(query) ||
          c.lastName.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.company?.name.toLowerCase().includes(query)
      )
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter((c) =>
        selectedTags.some((tag) => c.tags.includes(tag))
      )
    }

    // Filter by company
    if (selectedCompany !== "all") {
      result = result.filter((c) => c.company?.id === selectedCompany)
    }

    // Filter by owner
    if (selectedOwner !== "all") {
      result = result.filter((c) => c.owner.id === selectedOwner)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "name":
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          )
          break
        case "company":
          comparison = (a.company?.name || "").localeCompare(b.company?.name || "")
          break
        case "lastContactedAt":
          comparison =
            new Date(a.lastContactedAt || 0).getTime() -
            new Date(b.lastContactedAt || 0).getTime()
          break
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    return result
  }, [contacts, searchQuery, selectedTags, selectedCompany, selectedOwner, sortField, sortDirection])

  // Toggle contact selection
  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    )
  }

  // Select all contacts
  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(filteredContacts.map((c) => c.id))
    }
  }

  // Toggle star
  const toggleStar = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId ? { ...c, starred: !c.starred } : c
      )
    )
  }

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  // Get initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  // Activity icon
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "call":
        return <Phone className="h-4 w-4" />
      case "meeting":
        return <Video className="h-4 w-4" />
      case "note":
        return <FileText className="h-4 w-4" />
      case "deal":
        return <DollarSign className="h-4 w-4" />
    }
  }

  // Bulk delete
  const handleBulkDelete = () => {
    setContacts((prev) =>
      prev.filter((c) => !selectedContacts.includes(c.id))
    )
    setSelectedContacts([])
  }

  // Export contacts
  const handleExport = () => {
    const dataToExport =
      selectedContacts.length > 0
        ? contacts.filter((c) => selectedContacts.includes(c.id))
        : filteredContacts
    const csv = [
      ["First Name", "Last Name", "Email", "Phone", "Company", "Title", "Tags"],
      ...dataToExport.map((c) => [
        c.firstName,
        c.lastName,
        c.email,
        c.phone || "",
        c.company?.name || "",
        c.title || "",
        c.tags.join("; "),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "contacts.csv"
    a.click()
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">
                Contact Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage contacts, companies, and relationships
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 text-foreground hover:bg-primary/10"
                onClick={() => setShowImport(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Import</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-secondary/30 text-foreground hover:bg-secondary/10"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setShowAddContact(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>

          {/* View Tabs */}
          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "contacts" | "companies")}>
            <TabsList className="glass border-primary/30">
              <TabsTrigger value="contacts" className="data-[state=active]:bg-primary/20">
                <Users className="h-4 w-4 mr-2" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="companies" className="data-[state=active]:bg-primary/20">
                <Building2 className="h-4 w-4 mr-2" />
                Companies
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="glass border-primary/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Total Contacts</p>
              <Users className="h-5 w-5 text-primary/50" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-primary font-mono">
              {contacts.length}
            </p>
            <p className="text-muted-foreground text-xs mt-1">+12 this month</p>
          </Card>

          <Card className="glass border-secondary/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Companies</p>
              <Building2 className="h-5 w-5 text-secondary/50" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-secondary font-mono">
              {mockCompanies.length}
            </p>
            <p className="text-muted-foreground text-xs mt-1">+3 this month</p>
          </Card>

          <Card className="glass border-accent/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Active Today</p>
              <Clock className="h-5 w-5 text-accent/50" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-accent font-mono">24</p>
            <p className="text-muted-foreground text-xs mt-1">interactions</p>
          </Card>

          <Card className="glass border-primary/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Segments</p>
              <Tag className="h-5 w-5 text-primary/50" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-primary font-mono">
              {mockSegments.length}
            </p>
            <p className="text-muted-foreground text-xs mt-1">smart lists</p>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid lg:grid-cols-4 gap-6"
        >
          {/* Sidebar - Segments & Tags */}
          <Card className="glass border-primary/30 p-4 lg:col-span-1 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-primary">Segments</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 mb-6">
              {mockSegments.map((segment) => (
                <button
                  key={segment.id}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${segment.color}`} />
                    <span className="text-sm text-foreground">{segment.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {segment.contactCount}
                  </Badge>
                </button>
              ))}
            </div>

            <Separator className="bg-primary/20 my-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-primary">Tags</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setShowTagManager(true)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className={`cursor-pointer transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/20"
                  }`}
                  onClick={() =>
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    )
                  }
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-xs text-muted-foreground"
                onClick={() => setSelectedTags([])}
              >
                Clear filters
              </Button>
            )}
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search and Filters */}
            <Card className="glass border-primary/30 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts, companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-primary/30"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger className="w-full md:w-[180px] bg-background/50 border-primary/30">
                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      {mockCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                    <SelectTrigger className="w-full md:w-[180px] bg-background/50 border-primary/30">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Owners</SelectItem>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="icon"
                    className={`border-primary/30 ${showFilters ? "bg-primary/20" : ""}`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Expanded Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <Separator className="bg-primary/20 my-4" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">
                          Source
                        </Label>
                        <Select>
                          <SelectTrigger className="bg-background/50 border-primary/30">
                            <SelectValue placeholder="Any source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any source</SelectItem>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="conference">Conference</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">
                          Last Contact
                        </Label>
                        <Select>
                          <SelectTrigger className="bg-background/50 border-primary/30">
                            <SelectValue placeholder="Any time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any time</SelectItem>
                            <SelectItem value="7days">Last 7 days</SelectItem>
                            <SelectItem value="30days">Last 30 days</SelectItem>
                            <SelectItem value="90days">Last 90 days</SelectItem>
                            <SelectItem value="never">Never contacted</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">
                          Company Size
                        </Label>
                        <Select>
                          <SelectTrigger className="bg-background/50 border-primary/30">
                            <SelectValue placeholder="Any size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any size</SelectItem>
                            <SelectItem value="1-10">1-10</SelectItem>
                            <SelectItem value="11-50">11-50</SelectItem>
                            <SelectItem value="51-200">51-200</SelectItem>
                            <SelectItem value="201-500">201-500</SelectItem>
                            <SelectItem value="500+">500+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">
                          Industry
                        </Label>
                        <Select>
                          <SelectTrigger className="bg-background/50 border-primary/30">
                            <SelectValue placeholder="Any industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any industry</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                            <SelectItem value="saas">SaaS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Bulk Actions */}
            <AnimatePresence>
              {selectedContacts.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <Card className="glass border-secondary/30 p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <p className="text-sm text-foreground">
                        <span className="text-secondary font-mono font-bold">
                          {selectedContacts.length}
                        </span>{" "}
                        contact{selectedContacts.length > 1 ? "s" : ""} selected
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/30 text-foreground"
                        >
                          <Tag className="h-4 w-4 mr-2" />
                          Add Tag
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/30 text-foreground"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/30 text-foreground"
                          onClick={handleExport}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/30 text-foreground"
                          onClick={() => setShowMerge(true)}
                        >
                          <Merge className="h-4 w-4 mr-2" />
                          Merge
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive/30 text-destructive hover:bg-destructive/10"
                          onClick={handleBulkDelete}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contact Table */}
            <Card className="glass border-primary/30 overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-primary/5 border-b border-primary/20 text-xs text-muted-foreground font-medium">
                <div className="col-span-1 flex items-center">
                  <Checkbox
                    checked={
                      selectedContacts.length === filteredContacts.length &&
                      filteredContacts.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </div>
                <button
                  className="col-span-3 flex items-center gap-1 hover:text-foreground transition-colors"
                  onClick={() => handleSort("name")}
                >
                  Name
                  {sortField === "name" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    ))}
                </button>
                <button
                  className="col-span-2 flex items-center gap-1 hover:text-foreground transition-colors"
                  onClick={() => handleSort("company")}
                >
                  Company
                  {sortField === "company" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    ))}
                </button>
                <div className="col-span-2">Contact Info</div>
                <div className="col-span-2">Tags</div>
                <button
                  className="col-span-1 flex items-center gap-1 hover:text-foreground transition-colors"
                  onClick={() => handleSort("lastContactedAt")}
                >
                  Last Contact
                  {sortField === "lastContactedAt" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    ))}
                </button>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Table Body */}
              <ScrollArea className="h-[500px] md:h-[600px]">
                <div className="divide-y divide-primary/10">
                  {filteredContacts.map((contact, idx) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.02 }}
                      className={`p-4 hover:bg-primary/5 transition-colors cursor-pointer ${
                        selectedContacts.includes(contact.id) ? "bg-primary/10" : ""
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      {/* Mobile Layout */}
                      <div className="md:hidden space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedContacts.includes(contact.id)}
                              onCheckedChange={() => toggleContactSelection(contact.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Avatar className="h-10 w-10 border border-primary/30">
                              <AvatarFallback className="bg-primary/20 text-primary text-sm">
                                {getInitials(contact.firstName, contact.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-foreground">
                                  {contact.firstName} {contact.lastName}
                                </p>
                                {contact.starred && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{contact.title}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" /> Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="h-4 w-4 mr-2" /> Log Call
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit3 className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {contact.company?.name || "No company"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(contact.lastContactedAt)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {contact.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{contact.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                        <div className="col-span-1 flex items-center gap-2">
                          <Checkbox
                            checked={selectedContacts.includes(contact.id)}
                            onCheckedChange={() => toggleContactSelection(contact.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            className="text-muted-foreground hover:text-yellow-500 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleStar(contact.id)
                            }}
                          >
                            {contact.starred ? (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <div className="col-span-3 flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-primary/30">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {getInitials(contact.firstName, contact.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {contact.firstName} {contact.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {contact.title}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          {contact.company ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-secondary/20 flex items-center justify-center">
                                <Building2 className="h-3 w-3 text-secondary" />
                              </div>
                              <span className="text-sm text-foreground truncate">
                                {contact.company.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </div>
                        <div className="col-span-2 space-y-1">
                          <p className="text-sm text-foreground truncate">{contact.email}</p>
                          <p className="text-xs text-muted-foreground">{contact.phone}</p>
                        </div>
                        <div className="col-span-2 flex flex-wrap gap-1">
                          {contact.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {contact.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{contact.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <div className="col-span-1 text-sm text-muted-foreground">
                          {formatDate(contact.lastContactedAt)}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" /> Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="h-4 w-4 mr-2" /> Log Call
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="h-4 w-4 mr-2" /> Schedule Meeting
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Edit3 className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Table Footer */}
              <div className="p-4 border-t border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary/5">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredContacts.length} of {contacts.length} contacts
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled className="border-primary/30">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled className="border-primary/30">
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Contact Detail Sheet */}
        <Sheet open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
          <SheetContent className="w-full sm:max-w-xl glass border-primary/30 overflow-y-auto">
            {selectedContact && (
              <>
                <SheetHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/30">
                        <AvatarFallback className="bg-primary/20 text-primary text-xl">
                          {getInitials(selectedContact.firstName, selectedContact.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <SheetTitle className="text-xl text-foreground">
                          {selectedContact.firstName} {selectedContact.lastName}
                        </SheetTitle>
                        <p className="text-muted-foreground">{selectedContact.title}</p>
                        {selectedContact.company && (
                          <p className="text-sm text-secondary flex items-center gap-1 mt-1">
                            <Building2 className="h-3 w-3" />
                            {selectedContact.company.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStar(selectedContact.id)}
                    >
                      {selectedContact.starred ? (
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      <Mail className="h-4 w-4 mr-2" /> Email
                    </Button>
                    <Button variant="outline" size="sm" className="border-primary/30 text-foreground">
                      <Phone className="h-4 w-4 mr-2" /> Call
                    </Button>
                    <Button variant="outline" size="sm" className="border-primary/30 text-foreground">
                      <Calendar className="h-4 w-4 mr-2" /> Meeting
                    </Button>
                    <Button variant="outline" size="sm" className="border-primary/30 text-foreground">
                      <FileText className="h-4 w-4 mr-2" /> Note
                    </Button>
                  </div>
                </SheetHeader>

                <Separator className="bg-primary/20 my-6" />

                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="w-full glass border-primary/30">
                    <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                    <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
                    <TabsTrigger value="company" className="flex-1">Company</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-6 space-y-6">
                    {/* Contact Info */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-primary">Contact Information</h4>
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{selectedContact.email}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        {selectedContact.phone && (
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{selectedContact.phone}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {selectedContact.company?.location && (
                          <div className="flex items-center gap-3 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{selectedContact.company.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedContact.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <Plus className="h-3 w-3 mr-1" /> Add
                        </Button>
                      </div>
                    </div>

                    {/* Custom Fields */}
                    {Object.keys(selectedContact.customFields).length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-primary">Custom Fields</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedContact.customFields).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{key}</span>
                              <span className="text-foreground">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary">Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Owner</span>
                          <span className="text-foreground">{selectedContact.owner.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Source</span>
                          <span className="text-foreground">{selectedContact.source}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created</span>
                          <span className="text-foreground">
                            {new Date(selectedContact.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Contact</span>
                          <span className="text-foreground">
                            {formatDate(selectedContact.lastContactedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="mt-6">
                    <div className="space-y-4">
                      {selectedContact.activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex gap-3 p-3 glass-dark rounded-lg border-primary/20"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              activity.type === "email"
                                ? "bg-primary/20 text-primary"
                                : activity.type === "call"
                                ? "bg-secondary/20 text-secondary"
                                : activity.type === "meeting"
                                ? "bg-accent/20 text-accent"
                                : activity.type === "deal"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <span>{activity.user.name}</span>
                              <span>•</span>
                              <span>{formatDate(activity.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="company" className="mt-6">
                    {selectedContact.company ? (
                      <div className="space-y-6">
                        <Card className="glass-dark border-primary/20 p-4">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-secondary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">
                                {selectedContact.company.name}
                              </h4>
                              <a
                                href={`https://${selectedContact.company.domain}`}
                                className="text-sm text-primary flex items-center gap-1 hover:underline"
                              >
                                <Globe className="h-3 w-3" />
                                {selectedContact.company.domain}
                                <ArrowUpRight className="h-3 w-3" />
                              </a>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Industry</p>
                              <p className="text-foreground">{selectedContact.company.industry}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Size</p>
                              <p className="text-foreground">{selectedContact.company.size} employees</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Revenue</p>
                              <p className="text-foreground">
                                ${(selectedContact.company.annualRevenue || 0).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Location</p>
                              <p className="text-foreground">{selectedContact.company.location}</p>
                            </div>
                          </div>
                        </Card>

                        <div>
                          <h4 className="text-sm font-semibold text-primary mb-3">
                            Other Contacts at {selectedContact.company.name}
                          </h4>
                          <div className="space-y-2">
                            {contacts
                              .filter(
                                (c) =>
                                  c.company?.id === selectedContact.company?.id &&
                                  c.id !== selectedContact.id
                              )
                              .map((c) => (
                                <div
                                  key={c.id}
                                  className="flex items-center gap-3 p-2 glass-dark rounded-lg border-primary/20 cursor-pointer hover:bg-primary/10"
                                  onClick={() => setSelectedContact(c)}
                                >
                                  <Avatar className="h-8 w-8 border border-primary/30">
                                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                      {getInitials(c.firstName, c.lastName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">
                                      {c.firstName} {c.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{c.title}</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No company associated</p>
                        <Button variant="outline" size="sm" className="mt-4 border-primary/30">
                          <Plus className="h-4 w-4 mr-2" /> Add Company
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Add Contact Dialog */}
        <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
          <DialogContent className="glass border-primary/30 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Contact</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                  <Input id="firstName" className="mt-1 bg-background/50 border-primary/30" />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                  <Input id="lastName" className="mt-1 bg-background/50 border-primary/30" />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input id="email" type="email" className="mt-1 bg-background/50 border-primary/30" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-foreground">Phone</Label>
                <Input id="phone" className="mt-1 bg-background/50 border-primary/30" />
              </div>
              <div>
                <Label htmlFor="company" className="text-foreground">Company</Label>
                <Select>
                  <SelectTrigger className="mt-1 bg-background/50 border-primary/30">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title" className="text-foreground">Title</Label>
                <Input id="title" className="mt-1 bg-background/50 border-primary/30" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddContact(false)} className="border-primary/30 text-foreground">
                Cancel
              </Button>
              <Button className="bg-primary text-primary-foreground" onClick={() => setShowAddContact(false)}>
                Add Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Dialog */}
        <Dialog open={showImport} onOpenChange={setShowImport}>
          <DialogContent className="glass border-primary/30 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Import Contacts</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground mb-2">Drop your CSV file here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <Button variant="outline" className="border-primary/30 text-foreground">
                  Choose File
                </Button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Supported format: CSV with headers (First Name, Last Name, Email, Phone, Company, Title)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowImport(false)} className="border-primary/30 text-foreground">
                Cancel
              </Button>
              <Button className="bg-primary text-primary-foreground" disabled>
                Import
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Merge Dialog */}
        <Dialog open={showMerge} onOpenChange={setShowMerge}>
          <DialogContent className="glass border-primary/30 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Merge Duplicate Contacts</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {selectedContacts.length >= 2 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Select the primary contact. Other contacts will be merged into it.
                  </p>
                  {contacts
                    .filter((c) => selectedContacts.includes(c.id))
                    .map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center gap-3 p-3 glass-dark rounded-lg border-primary/20 cursor-pointer hover:bg-primary/10"
                      >
                        <Avatar className="h-10 w-10 border border-primary/30">
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {getInitials(contact.firstName, contact.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{contact.email}</p>
                        </div>
                        <Checkbox />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select at least 2 contacts to merge
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMerge(false)} className="border-primary/30 text-foreground">
                Cancel
              </Button>
              <Button
                className="bg-primary text-primary-foreground"
                disabled={selectedContacts.length < 2}
              >
                Merge Contacts
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Tag Manager Dialog */}
        <Dialog open={showTagManager} onOpenChange={setShowTagManager}>
          <DialogContent className="glass border-primary/30 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Manage Tags</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex gap-2">
                <Input placeholder="New tag name..." className="bg-background/50 border-primary/30" />
                <Button className="bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {allTags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center justify-between p-2 glass-dark rounded-lg border-primary/20"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-foreground">{tag}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {contacts.filter((c) => c.tags.includes(tag)).length}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTagManager(false)} className="border-primary/30 text-foreground">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

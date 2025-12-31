"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Bell,
  ChevronDown,
  Clock,
  Download,
  Edit3,
  FileText,
  Forward,
  Image,
  Inbox,
  Mail,
  MailOpen,
  Menu,
  MoreHorizontal,
  Paperclip,
  Plus,
  RefreshCw,
  Reply,
  ReplyAll,
  Search,
  Send,
  Settings,
  Star,
  Tag,
  Trash2,
  X,
  AlertCircle,
  File,
  CheckCircle2,
  Circle,
  Filter,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

// TypeScript Interfaces
interface EmailAddress {
  name: string
  email: string
  avatar?: string
}

interface Attachment {
  id: string
  name: string
  size: string
  type: "image" | "document" | "pdf" | "other"
  url?: string
}

interface Email {
  id: string
  threadId: string
  from: EmailAddress
  to: EmailAddress[]
  cc?: EmailAddress[]
  subject: string
  body: string
  bodyPreview: string
  date: Date
  isRead: boolean
  isStarred: boolean
  labels: string[]
  attachments?: Attachment[]
  replyTo?: string
}

interface Folder {
  id: string
  name: string
  icon: React.ElementType
  unreadCount: number
  isSystem: boolean
  color?: string
}

interface Label {
  id: string
  name: string
  color: string
}

// Mock Data
const mockFolders: Folder[] = [
  { id: "inbox", name: "Inbox", icon: Inbox, unreadCount: 12, isSystem: true },
  { id: "starred", name: "Starred", icon: Star, unreadCount: 0, isSystem: true },
  { id: "sent", name: "Sent", icon: Send, unreadCount: 0, isSystem: true },
  { id: "drafts", name: "Drafts", icon: Edit3, unreadCount: 2, isSystem: true },
  { id: "spam", name: "Spam", icon: AlertCircle, unreadCount: 5, isSystem: true },
  { id: "trash", name: "Trash", icon: Trash2, unreadCount: 0, isSystem: true },
]

const mockLabels: Label[] = [
  { id: "work", name: "Work", color: "hsl(var(--primary))" },
  { id: "personal", name: "Personal", color: "hsl(var(--secondary))" },
  { id: "important", name: "Important", color: "hsl(0 84% 60%)" },
  { id: "finance", name: "Finance", color: "hsl(45 93% 47%)" },
]

const mockEmails: Email[] = [
  {
    id: "1",
    threadId: "t1",
    from: { name: "Alex Chen", email: "alex@company.com" },
    to: [{ name: "You", email: "you@email.com" }],
    subject: "Q4 Product Roadmap Review",
    body: `Hi team,

I wanted to share the updated Q4 product roadmap for your review. We've made significant progress on several key initiatives:

1. **AI-powered recommendations** - On track for October launch
2. **Mobile app redesign** - UX testing completed, development in progress
3. **API v3** - Documentation complete, beta testing begins next week

Please review the attached presentation and let me know if you have any questions or concerns. We'll discuss in detail during our weekly sync.

Best regards,
Alex`,
    bodyPreview: "I wanted to share the updated Q4 product roadmap for your review...",
    date: new Date(Date.now() - 1000 * 60 * 15),
    isRead: false,
    isStarred: true,
    labels: ["work", "important"],
    attachments: [
      { id: "a1", name: "Q4_Roadmap.pdf", size: "2.4 MB", type: "pdf" },
      { id: "a2", name: "Timeline.png", size: "845 KB", type: "image" },
    ],
  },
  {
    id: "2",
    threadId: "t2",
    from: { name: "Sarah Miller", email: "sarah.m@startup.io" },
    to: [{ name: "You", email: "you@email.com" }],
    cc: [{ name: "Team", email: "team@startup.io" }],
    subject: "Re: Partnership Opportunity",
    body: `Thanks for reaching out! We'd love to explore a potential partnership.

I've reviewed your proposal and I think there's a strong alignment between our products. A few thoughts:

- Your integration capabilities would complement our workflow automation
- The combined solution could address enterprise pain points
- Timeline seems aggressive but achievable

Let's schedule a call to discuss next steps. How does next Tuesday at 2pm work for you?

Looking forward to it,
Sarah`,
    bodyPreview: "Thanks for reaching out! We'd love to explore a potential partnership...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
    isStarred: false,
    labels: ["work"],
  },
  {
    id: "3",
    threadId: "t3",
    from: { name: "GitHub", email: "noreply@github.com" },
    to: [{ name: "You", email: "you@email.com" }],
    subject: "[portfolio-style-guides] Pull request merged: Template improvements",
    body: `The pull request #142 has been merged into main.

**Summary of changes:**
- Added 5 new dashboard templates
- Fixed responsive issues on mobile
- Updated documentation

View the full diff: https://github.com/...

---
You're receiving this because you're subscribed to this repository.`,
    bodyPreview: "The pull request #142 has been merged into main...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 5),
    isRead: true,
    isStarred: false,
    labels: [],
  },
  {
    id: "4",
    threadId: "t4",
    from: { name: "Stripe", email: "billing@stripe.com" },
    to: [{ name: "You", email: "you@email.com" }],
    subject: "Your invoice for December 2024",
    body: `Your monthly invoice is ready.

**Invoice Details:**
- Period: December 1-31, 2024
- Amount: $299.00
- Status: Payment successful

Your payment method ending in 4242 has been charged.

View your invoice: https://dashboard.stripe.com/...

Thank you for your business!
The Stripe Team`,
    bodyPreview: "Your monthly invoice is ready. Amount: $299.00...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true,
    isStarred: false,
    labels: ["finance"],
    attachments: [
      { id: "a3", name: "Invoice_Dec2024.pdf", size: "156 KB", type: "pdf" },
    ],
  },
  {
    id: "5",
    threadId: "t5",
    from: { name: "David Park", email: "david@design.co" },
    to: [{ name: "You", email: "you@email.com" }],
    subject: "Design assets ready for review",
    body: `Hey!

The design assets for the new landing page are ready. I've attached the Figma export and the component library.

Key highlights:
- Hero section with animated gradients
- New icon set (100+ icons)
- Dark mode variants for all components

Let me know what you think! Happy to make adjustments.

Cheers,
David`,
    bodyPreview: "The design assets for the new landing page are ready...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    isRead: false,
    isStarred: true,
    labels: ["work"],
    attachments: [
      { id: "a4", name: "Landing_Page_v2.fig", size: "12.8 MB", type: "other" },
      { id: "a5", name: "Icons.zip", size: "4.2 MB", type: "other" },
      { id: "a6", name: "Preview.png", size: "1.1 MB", type: "image" },
    ],
  },
  {
    id: "6",
    threadId: "t6",
    from: { name: "LinkedIn", email: "messages@linkedin.com" },
    to: [{ name: "You", email: "you@email.com" }],
    subject: "5 new people viewed your profile",
    body: `Your profile is getting noticed!

5 people viewed your profile this week. Here's who's looking:
- Engineering Manager at TechCorp
- Senior Developer at StartupXYZ
- Recruiter at BigTech

Upgrade to Premium to see all your viewers and message anyone on LinkedIn.`,
    bodyPreview: "Your profile is getting noticed! 5 people viewed your profile...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 72),
    isRead: true,
    isStarred: false,
    labels: [],
  },
  {
    id: "7",
    threadId: "t7",
    from: { name: "Mom", email: "mom@family.com" },
    to: [{ name: "You", email: "you@email.com" }],
    subject: "Dinner on Sunday?",
    body: `Hi sweetie,

Are you free for dinner on Sunday? Dad is grilling and we'd love to see you.

Let me know!

Love,
Mom`,
    bodyPreview: "Are you free for dinner on Sunday? Dad is grilling...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 96),
    isRead: true,
    isStarred: true,
    labels: ["personal"],
  },
  {
    id: "8",
    threadId: "t8",
    from: { name: "Vercel", email: "notifications@vercel.com" },
    to: [{ name: "You", email: "you@email.com" }],
    subject: "Deployment successful: portfolio-style-guides",
    body: `Your deployment was successful!

**Project:** portfolio-style-guides
**Environment:** Production
**URL:** https://portfolio-style-guides.vercel.app
**Duration:** 45s

View deployment details in your dashboard.`,
    bodyPreview: "Your deployment was successful! Project: portfolio-style-guides...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 120),
    isRead: true,
    isStarred: false,
    labels: ["work"],
  },
]

export default function EmailInboxPage() {
  // State
  const [folders] = useState<Folder[]>(mockFolders)
  const [labels] = useState<Label[]>(mockLabels)
  const [emails, setEmails] = useState<Email[]>(mockEmails)
  const [selectedFolder, setSelectedFolder] = useState("inbox")
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [showCompose, setShowCompose] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filterLabel, setFilterLabel] = useState<string | null>(null)
  const [composeData, setComposeData] = useState({
    to: "",
    cc: "",
    subject: "",
    body: "",
  })

  // Filtered emails based on folder, search, and labels
  const filteredEmails = useMemo(() => {
    let result = [...emails]

    // Filter by folder
    if (selectedFolder === "starred") {
      result = result.filter((e) => e.isStarred)
    } else if (selectedFolder === "sent") {
      result = [] // Empty for demo
    } else if (selectedFolder === "drafts") {
      result = [] // Empty for demo
    } else if (selectedFolder === "spam") {
      result = [] // Empty for demo
    } else if (selectedFolder === "trash") {
      result = [] // Empty for demo
    }

    // Filter by label
    if (filterLabel) {
      result = result.filter((e) => e.labels.includes(filterLabel))
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (e) =>
          e.subject.toLowerCase().includes(query) ||
          e.from.name.toLowerCase().includes(query) ||
          e.from.email.toLowerCase().includes(query) ||
          e.bodyPreview.toLowerCase().includes(query)
      )
    }

    return result.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [emails, selectedFolder, searchQuery, filterLabel])

  // Mark email as read when selected
  useEffect(() => {
    if (selectedEmail && !selectedEmail.isRead) {
      setEmails((prev) =>
        prev.map((e) =>
          e.id === selectedEmail.id ? { ...e, isRead: true } : e
        )
      )
    }
  }, [selectedEmail])

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = diff / (1000 * 60 * 60)

    if (hours < 1) {
      return `${Math.floor(diff / (1000 * 60))}m ago`
    } else if (hours < 24) {
      return `${Math.floor(hours)}h ago`
    } else if (hours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  // Toggle star
  const toggleStar = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEmails((prev) =>
      prev.map((email) =>
        email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
      )
    )
  }

  // Toggle selection
  const toggleSelection = (emailId: string) => {
    setSelectedEmails((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(emailId)) {
        newSet.delete(emailId)
      } else {
        newSet.add(emailId)
      }
      return newSet
    })
  }

  // Select all
  const selectAll = () => {
    if (selectedEmails.size === filteredEmails.length) {
      setSelectedEmails(new Set())
    } else {
      setSelectedEmails(new Set(filteredEmails.map((e) => e.id)))
    }
  }

  // Delete selected
  const deleteSelected = () => {
    setEmails((prev) => prev.filter((e) => !selectedEmails.has(e.id)))
    setSelectedEmails(new Set())
    if (selectedEmail && selectedEmails.has(selectedEmail.id)) {
      setSelectedEmail(null)
    }
  }

  // Archive selected
  const archiveSelected = () => {
    setEmails((prev) => prev.filter((e) => !selectedEmails.has(e.id)))
    setSelectedEmails(new Set())
    if (selectedEmail && selectedEmails.has(selectedEmail.id)) {
      setSelectedEmail(null)
    }
  }

  // Mark as read/unread
  const markAsRead = (read: boolean) => {
    setEmails((prev) =>
      prev.map((e) =>
        selectedEmails.has(e.id) ? { ...e, isRead: read } : e
      )
    )
    setSelectedEmails(new Set())
  }

  // Get attachment icon
  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "image":
        return Image
      case "pdf":
        return FileText
      default:
        return File
    }
  }

  // Get label color
  const getLabelColor = (labelId: string) => {
    return labels.find((l) => l.id === labelId)?.color || "hsl(var(--muted-foreground))"
  }

  // Get label name
  const getLabelName = (labelId: string) => {
    return labels.find((l) => l.id === labelId)?.name || labelId
  }

  // Send compose
  const handleSend = () => {
    // In a real app, this would send the email
    setShowCompose(false)
    setComposeData({ to: "", cc: "", subject: "", body: "" })
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-border px-4 py-3"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground hidden sm:block">
                Mail
              </h1>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-2 mt-3 overflow-hidden"
            >
              <Badge
                variant={filterLabel === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterLabel(null)}
              >
                All
              </Badge>
              {labels.map((label) => (
                <Badge
                  key={label.id}
                  variant={filterLabel === label.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterLabel(label.id)}
                  style={{
                    borderColor: filterLabel === label.id ? undefined : label.color,
                    color: filterLabel === label.id ? undefined : label.color,
                  }}
                >
                  {label.name}
                </Badge>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-64 glass border-r border-border flex-shrink-0 flex flex-col absolute md:relative z-20 h-full md:h-auto"
            >
              <div className="p-4">
                <Button
                  className="w-full gap-2"
                  onClick={() => setShowCompose(true)}
                >
                  <Plus className="h-4 w-4" />
                  Compose
                </Button>
              </div>

              <ScrollArea className="flex-1 px-2">
                {/* Folders */}
                <div className="space-y-1">
                  {folders.map((folder) => {
                    const Icon = folder.icon
                    const isActive = selectedFolder === folder.id
                    return (
                      <button
                        key={folder.id}
                        onClick={() => {
                          setSelectedFolder(folder.id)
                          setSelectedEmail(null)
                          if (window.innerWidth < 768) setShowSidebar(false)
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm">{folder.name}</span>
                        </div>
                        {folder.unreadCount > 0 && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0"
                          >
                            {folder.unreadCount}
                          </Badge>
                        )}
                      </button>
                    )
                  })}
                </div>

                <Separator className="my-4" />

                {/* Labels */}
                <div className="mb-2 px-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Labels
                  </span>
                </div>
                <div className="space-y-1">
                  {labels.map((label) => (
                    <button
                      key={label.id}
                      onClick={() => {
                        setFilterLabel(filterLabel === label.id ? null : label.id)
                        if (window.innerWidth < 768) setShowSidebar(false)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        filterLabel === label.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: label.color }}
                      />
                      <span className="text-sm">{label.name}</span>
                    </button>
                  ))}
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Plus className="h-3 w-3" />
                    <span className="text-sm">Create label</span>
                  </button>
                </div>
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Email List */}
        <div
          className={`flex-1 flex flex-col border-r border-border min-w-0 ${
            selectedEmail ? "hidden md:flex md:w-[400px] md:flex-shrink-0" : "flex"
          }`}
        >
          {/* Toolbar */}
          <div className="glass-dark border-b border-border px-4 py-2 flex items-center gap-2">
            <Checkbox
              checked={
                selectedEmails.size === filteredEmails.length &&
                filteredEmails.length > 0
              }
              onCheckedChange={selectAll}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                // Refresh - in a real app would fetch new emails
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            {selectedEmails.size > 0 && (
              <>
                <Separator orientation="vertical" className="h-5" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={archiveSelected}
                >
                  <Archive className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={deleteSelected}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => markAsRead(true)}>
                      <MailOpen className="h-4 w-4 mr-2" />
                      Mark as read
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => markAsRead(false)}>
                      <Mail className="h-4 w-4 mr-2" />
                      Mark as unread
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Tag className="h-4 w-4 mr-2" />
                      Add label
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Clock className="h-4 w-4 mr-2" />
                      Snooze
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span className="text-xs text-muted-foreground ml-2">
                  {selectedEmails.size} selected
                </span>
              </>
            )}
            <div className="flex-1" />
            <span className="text-xs text-muted-foreground">
              {filteredEmails.length} emails
            </span>
          </div>

          {/* Email List */}
          <ScrollArea className="flex-1">
            <AnimatePresence mode="popLayout">
              {filteredEmails.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-muted-foreground"
                >
                  <Inbox className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm">No emails found</p>
                </motion.div>
              ) : (
                filteredEmails.map((email, idx) => (
                  <motion.div
                    key={email.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.02 }}
                    onClick={() => setSelectedEmail(email)}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-border cursor-pointer transition-colors ${
                      selectedEmail?.id === email.id
                        ? "bg-primary/10"
                        : "hover:bg-muted/50"
                    } ${!email.isRead ? "bg-muted/30" : ""}`}
                  >
                    <div className="flex items-center gap-2 pt-1">
                      <Checkbox
                        checked={selectedEmails.has(email.id)}
                        onCheckedChange={() => toggleSelection(email.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => toggleStar(email.id, e)}
                        className="text-muted-foreground hover:text-yellow-500 transition-colors"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            email.isStarred
                              ? "fill-yellow-500 text-yellow-500"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-sm truncate ${
                            !email.isRead
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {email.from.name}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatDate(email.date)}
                        </span>
                      </div>
                      <p
                        className={`text-sm truncate mb-1 ${
                          !email.isRead
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {email.subject}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {email.bodyPreview}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {email.labels.map((label) => (
                          <div
                            key={label}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getLabelColor(label) }}
                            title={getLabelName(label)}
                          />
                        ))}
                        {email.attachments && email.attachments.length > 0 && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Paperclip className="h-3 w-3" />
                            <span className="text-xs">
                              {email.attachments.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>

        {/* Email Preview */}
        <AnimatePresence mode="wait">
          {selectedEmail ? (
            <motion.div
              key={selectedEmail.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col min-w-0"
            >
              {/* Preview Header */}
              <div className="glass-dark border-b border-border px-4 py-3 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedEmail(null)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => archiveSelected()}
                >
                  <Archive className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setEmails((prev) =>
                      prev.filter((e) => e.id !== selectedEmail.id)
                    )
                    setSelectedEmail(null)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-5" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 md:p-6 space-y-6">
                  {/* Subject */}
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-semibold text-foreground">
                      {selectedEmail.subject}
                    </h2>
                    <button
                      onClick={(e) => toggleStar(selectedEmail.id, e)}
                      className="text-muted-foreground hover:text-yellow-500 transition-colors flex-shrink-0"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          selectedEmail.isStarred
                            ? "fill-yellow-500 text-yellow-500"
                            : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Labels */}
                  {selectedEmail.labels.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedEmail.labels.map((label) => (
                        <Badge
                          key={label}
                          variant="outline"
                          style={{
                            borderColor: getLabelColor(label),
                            color: getLabelColor(label),
                          }}
                        >
                          {getLabelName(label)}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* From/To */}
                  <Card className="glass p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-medium">
                          {selectedEmail.from.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="font-medium text-foreground">
                              {selectedEmail.from.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {selectedEmail.from.email}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {selectedEmail.date.toLocaleString()}
                          </p>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span>To: </span>
                          {selectedEmail.to.map((t) => t.email).join(", ")}
                          {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                            <>
                              <br />
                              <span>Cc: </span>
                              {selectedEmail.cc.map((c) => c.email).join(", ")}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Body */}
                  <div className="prose prose-invert max-w-none">
                    <div className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
                      {selectedEmail.body}
                    </div>
                  </div>

                  {/* Attachments */}
                  {selectedEmail.attachments &&
                    selectedEmail.attachments.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Attachments ({selectedEmail.attachments.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedEmail.attachments.map((attachment) => {
                            const Icon = getAttachmentIcon(attachment.type)
                            return (
                              <Card
                                key={attachment.id}
                                className="glass-dark p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
                              >
                                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {attachment.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {attachment.size}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        setComposeData({
                          to: selectedEmail.from.email,
                          cc: "",
                          subject: `Re: ${selectedEmail.subject}`,
                          body: `\n\n---\nOn ${selectedEmail.date.toLocaleString()}, ${selectedEmail.from.name} wrote:\n\n${selectedEmail.body}`,
                        })
                        setShowCompose(true)
                      }}
                    >
                      <Reply className="h-4 w-4" />
                      Reply
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <ReplyAll className="h-4 w-4" />
                      Reply All
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        setComposeData({
                          to: "",
                          cc: "",
                          subject: `Fwd: ${selectedEmail.subject}`,
                          body: `\n\n---\nForwarded message:\nFrom: ${selectedEmail.from.name} <${selectedEmail.from.email}>\nDate: ${selectedEmail.date.toLocaleString()}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`,
                        })
                        setShowCompose(true)
                      }}
                    >
                      <Forward className="h-4 w-4" />
                      Forward
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:flex flex-1 items-center justify-center text-muted-foreground"
            >
              <div className="text-center">
                <Mail className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Select an email to read</p>
                <p className="text-sm">
                  Click on an email from the list to view its contents
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Compose Modal */}
      <Dialog open={showCompose} onOpenChange={setShowCompose}>
        <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">To</label>
              <Input
                placeholder="recipient@example.com"
                value={composeData.to}
                onChange={(e) =>
                  setComposeData((prev) => ({ ...prev, to: e.target.value }))
                }
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Cc</label>
              <Input
                placeholder="cc@example.com"
                value={composeData.cc}
                onChange={(e) =>
                  setComposeData((prev) => ({ ...prev, cc: e.target.value }))
                }
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Subject</label>
              <Input
                placeholder="Subject"
                value={composeData.subject}
                onChange={(e) =>
                  setComposeData((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Message</label>
              <Textarea
                placeholder="Write your message..."
                value={composeData.body}
                onChange={(e) =>
                  setComposeData((prev) => ({ ...prev, body: e.target.value }))
                }
                className="min-h-[200px] bg-background/50"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Image className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setShowCompose(false)}>
                Discard
              </Button>
              <Button onClick={handleSend} className="gap-2">
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

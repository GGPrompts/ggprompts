"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Star,
  StarOff,
  Clock,
  Settings,
  Trash2,
  MoreHorizontal,
  Hash,
  GripVertical,
  Bold,
  Italic,
  Code,
  Link2,
  Highlighter,
  MessageSquare,
  Share2,
  Download,
  Copy,
  ExternalLink,
  Image,
  Quote,
  List,
  ListOrdered,
  CheckSquare,
  Type,
  Heading1,
  Heading2,
  Heading3,
  AlertCircle,
  Minus,
  ChevronUp,
  Menu,
  X,
  Calendar,
  Tag,
  Globe,
  Lock,
  Users,
  ArrowLeft,
} from "lucide-react"
import { Card, Button, Badge, ScrollArea, Separator, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Popover, PopoverContent, PopoverTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@ggprompts/ui"

// TypeScript Interfaces
interface Block {
  id: string
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bullet' | 'numbered' | 'toggle' | 'quote' | 'code' | 'callout' | 'divider' | 'image' | 'todo'
  content: string
  children?: Block[]
  properties?: Record<string, any>
  checked?: boolean
}

interface Property {
  name: string
  type: 'text' | 'number' | 'select' | 'multi-select' | 'date' | 'checkbox' | 'url'
  value: any
}

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  blockId?: string
}

interface Page {
  id: string
  title: string
  icon?: string
  cover?: string
  parentId?: string
  blocks: Block[]
  properties: Property[]
  createdAt: string
  updatedAt: string
  comments: Comment[]
}

interface Workspace {
  pages: Page[]
  favorites: string[]
  recentPages: string[]
}

// Mock Data
const initialWorkspace: Workspace = {
  pages: [
    {
      id: "page-1",
      title: "Project Roadmap",
      icon: "🗺️",
      cover: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop",
      blocks: [
        { id: "b1", type: "heading1", content: "Q1 2025 Goals" },
        { id: "b2", type: "paragraph", content: "This document outlines our key objectives for the first quarter of 2025. We're focusing on three main areas: product development, user growth, and team expansion." },
        { id: "b3", type: "heading2", content: "Product Development" },
        { id: "b4", type: "bullet", content: "Launch v2.0 of the platform" },
        { id: "b5", type: "bullet", content: "Implement real-time collaboration" },
        { id: "b6", type: "bullet", content: "Add AI-powered features" },
        { id: "b7", type: "heading2", content: "User Growth" },
        { id: "b8", type: "numbered", content: "Reach 100k monthly active users" },
        { id: "b9", type: "numbered", content: "Improve retention by 25%" },
        { id: "b10", type: "numbered", content: "Launch referral program" },
        { id: "b11", type: "callout", content: "Remember: Focus on quality over quantity. Sustainable growth is our priority.", properties: { emoji: "💡" } },
        { id: "b12", type: "divider", content: "" },
        { id: "b13", type: "heading2", content: "Team Expansion" },
        { id: "b14", type: "todo", content: "Hire 2 senior engineers", checked: true },
        { id: "b15", type: "todo", content: "Hire product designer", checked: false },
        { id: "b16", type: "todo", content: "Hire DevOps engineer", checked: false },
        { id: "b17", type: "quote", content: "The best way to predict the future is to create it. - Peter Drucker" },
        { id: "b18", type: "code", content: "// Milestone tracking\nconst milestones = [\n  { name: 'Alpha', date: '2025-01-15' },\n  { name: 'Beta', date: '2025-02-28' },\n  { name: 'Launch', date: '2025-03-31' }\n];", properties: { language: "javascript" } },
      ],
      properties: [
        { name: "Status", type: "select", value: "In Progress" },
        { name: "Due Date", type: "date", value: "2025-03-31" },
        { name: "Owner", type: "text", value: "Team Lead" },
        { name: "Priority", type: "select", value: "High" },
        { name: "Tags", type: "multi-select", value: ["planning", "q1", "roadmap"] },
      ],
      createdAt: "2024-12-01",
      updatedAt: "2024-12-27",
      comments: [
        { id: "c1", author: "Sarah", avatar: "S", content: "Great roadmap! Should we add a section for marketing initiatives?", timestamp: "2 hours ago", blockId: "b7" },
        { id: "c2", author: "Mike", avatar: "M", content: "The timeline looks realistic. Let's review weekly.", timestamp: "1 day ago" },
      ],
    },
    {
      id: "page-2",
      title: "Meeting Notes",
      icon: "📝",
      parentId: "page-1",
      blocks: [
        { id: "b1", type: "heading1", content: "Weekly Standup - Dec 27" },
        { id: "b2", type: "heading3", content: "Attendees" },
        { id: "b3", type: "paragraph", content: "Sarah, Mike, Alex, Jordan" },
        { id: "b4", type: "heading3", content: "Discussion Points" },
        { id: "b5", type: "toggle", content: "Sprint Review", children: [
          { id: "b5-1", type: "bullet", content: "Completed 18/20 story points" },
          { id: "b5-2", type: "bullet", content: "Blocked on API integration" },
        ]},
        { id: "b6", type: "toggle", content: "Action Items", children: [
          { id: "b6-1", type: "todo", content: "Follow up with vendor", checked: false },
          { id: "b6-2", type: "todo", content: "Update documentation", checked: true },
        ]},
      ],
      properties: [
        { name: "Type", type: "select", value: "Meeting" },
        { name: "Date", type: "date", value: "2024-12-27" },
      ],
      createdAt: "2024-12-27",
      updatedAt: "2024-12-27",
      comments: [],
    },
    {
      id: "page-3",
      title: "Design System",
      icon: "🎨",
      blocks: [
        { id: "b1", type: "heading1", content: "Design Tokens" },
        { id: "b2", type: "paragraph", content: "Our design system is built on a foundation of reusable tokens." },
        { id: "b3", type: "code", content: ":root {\n  --primary: hsl(160 84% 39%);\n  --secondary: hsl(173 80% 40%);\n  --background: hsl(220 13% 5%);\n}", properties: { language: "css" } },
      ],
      properties: [
        { name: "Status", type: "select", value: "Active" },
        { name: "Version", type: "text", value: "2.0" },
      ],
      createdAt: "2024-11-15",
      updatedAt: "2024-12-20",
      comments: [],
    },
    {
      id: "page-4",
      title: "API Documentation",
      icon: "📚",
      blocks: [
        { id: "b1", type: "heading1", content: "REST API Reference" },
        { id: "b2", type: "paragraph", content: "Complete documentation for our REST API endpoints." },
      ],
      properties: [],
      createdAt: "2024-10-01",
      updatedAt: "2024-12-15",
      comments: [],
    },
    {
      id: "page-5",
      title: "Personal Notes",
      icon: "🔒",
      blocks: [],
      properties: [],
      createdAt: "2024-12-20",
      updatedAt: "2024-12-27",
      comments: [],
    },
  ],
  favorites: ["page-1", "page-3"],
  recentPages: ["page-1", "page-2", "page-3"],
}

// Slash command options
const slashCommands = [
  { id: "paragraph", label: "Text", description: "Plain text block", icon: Type, type: "paragraph" as const },
  { id: "heading1", label: "Heading 1", description: "Large heading", icon: Heading1, type: "heading1" as const },
  { id: "heading2", label: "Heading 2", description: "Medium heading", icon: Heading2, type: "heading2" as const },
  { id: "heading3", label: "Heading 3", description: "Small heading", icon: Heading3, type: "heading3" as const },
  { id: "bullet", label: "Bullet List", description: "Unordered list", icon: List, type: "bullet" as const },
  { id: "numbered", label: "Numbered List", description: "Ordered list", icon: ListOrdered, type: "numbered" as const },
  { id: "todo", label: "To-do", description: "Checkbox item", icon: CheckSquare, type: "todo" as const },
  { id: "toggle", label: "Toggle", description: "Collapsible content", icon: ChevronRight, type: "toggle" as const },
  { id: "quote", label: "Quote", description: "Quote block", icon: Quote, type: "quote" as const },
  { id: "code", label: "Code", description: "Code block", icon: Code, type: "code" as const },
  { id: "callout", label: "Callout", description: "Highlighted block", icon: AlertCircle, type: "callout" as const },
  { id: "divider", label: "Divider", description: "Horizontal line", icon: Minus, type: "divider" as const },
]

export default function NotionWorkspace() {
  const [workspace, setWorkspace] = useState<Workspace>(initialWorkspace)
  const [currentPageId, setCurrentPageId] = useState("page-1")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(["page-1"]))
  const [slashMenuOpen, setSlashMenuOpen] = useState(false)
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 })
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [formattingToolbar, setFormattingToolbar] = useState<{ show: boolean; x: number; y: number }>({ show: false, x: 0, y: 0 })
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  const currentPage = workspace.pages.find(p => p.id === currentPageId)
  const childPages = workspace.pages.filter(p => p.parentId === currentPageId)

  // Get page breadcrumbs
  const getBreadcrumbs = (pageId: string): Page[] => {
    const breadcrumbs: Page[] = []
    let page = workspace.pages.find(p => p.id === pageId)
    while (page) {
      breadcrumbs.unshift(page)
      page = page.parentId ? workspace.pages.find(p => p.id === page?.parentId) : undefined
    }
    return breadcrumbs
  }

  // Toggle favorite
  const toggleFavorite = (pageId: string) => {
    setWorkspace(prev => ({
      ...prev,
      favorites: prev.favorites.includes(pageId)
        ? prev.favorites.filter(id => id !== pageId)
        : [...prev.favorites, pageId]
    }))
  }

  // Toggle page expansion in sidebar
  const togglePageExpanded = (pageId: string) => {
    setExpandedPages(prev => {
      const next = new Set(prev)
      if (next.has(pageId)) {
        next.delete(pageId)
      } else {
        next.add(pageId)
      }
      return next
    })
  }

  // Add new block
  const addBlock = (type: Block['type'], afterBlockId?: string) => {
    if (!currentPage) return

    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: "",
      checked: type === 'todo' ? false : undefined,
      properties: type === 'callout' ? { emoji: "💡" } : type === 'code' ? { language: "javascript" } : undefined,
    }

    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => {
        if (page.id !== currentPageId) return page
        const blockIndex = afterBlockId
          ? page.blocks.findIndex(b => b.id === afterBlockId)
          : page.blocks.length - 1
        const newBlocks = [...page.blocks]
        newBlocks.splice(blockIndex + 1, 0, newBlock)
        return { ...page, blocks: newBlocks, updatedAt: new Date().toISOString() }
      })
    }))

    setSlashMenuOpen(false)
    setActiveBlockId(newBlock.id)
  }

  // Update block content
  const updateBlockContent = (blockId: string, content: string) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => {
        if (page.id !== currentPageId) return page
        return {
          ...page,
          blocks: page.blocks.map(block =>
            block.id === blockId ? { ...block, content } : block
          ),
          updatedAt: new Date().toISOString()
        }
      })
    }))
  }

  // Toggle todo
  const toggleTodo = (blockId: string) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => {
        if (page.id !== currentPageId) return page
        return {
          ...page,
          blocks: page.blocks.map(block =>
            block.id === blockId ? { ...block, checked: !block.checked } : block
          ),
        }
      })
    }))
  }

  // Delete block
  const deleteBlock = (blockId: string) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => {
        if (page.id !== currentPageId) return page
        return {
          ...page,
          blocks: page.blocks.filter(block => block.id !== blockId),
          updatedAt: new Date().toISOString()
        }
      })
    }))
  }

  // Handle key press in block
  const handleBlockKeyDown = (e: React.KeyboardEvent, blockId: string) => {
    if (e.key === '/' && !slashMenuOpen) {
      e.preventDefault()
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setSlashMenuPosition({ x: rect.left, y: rect.bottom + 8 })
      setSlashMenuOpen(true)
      setActiveBlockId(blockId)
    } else if (e.key === 'Enter' && !e.shiftKey && !slashMenuOpen) {
      e.preventDefault()
      addBlock('paragraph', blockId)
    } else if (e.key === 'Backspace' && (e.target as HTMLElement).textContent === '') {
      e.preventDefault()
      deleteBlock(blockId)
    } else if (e.key === 'Escape') {
      setSlashMenuOpen(false)
    }
  }

  // Render block
  const renderBlock = (block: Block, index: number) => {
    const blockClasses = "group relative px-2 py-1 rounded-md hover:bg-muted/30 transition-colors"

    const BlockWrapper = ({ children }: { children: React.ReactNode }) => (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.02 }}
        className={blockClasses}
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <button className="p-1 rounded hover:bg-muted/50 text-muted-foreground">
            <Plus className="h-4 w-4" />
          </button>
          <button className="p-1 rounded hover:bg-muted/50 text-muted-foreground cursor-grab">
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
        {children}
      </motion.div>
    )

    switch (block.type) {
      case 'heading1':
        return (
          <BlockWrapper key={block.id}>
            <h1
              className="text-2xl md:text-3xl font-bold text-foreground outline-none"
              contentEditable
              suppressContentEditableWarning
              onKeyDown={(e) => handleBlockKeyDown(e, block.id)}
              onBlur={(e) => updateBlockContent(block.id, e.currentTarget.textContent || '')}
            >
              {block.content}
            </h1>
          </BlockWrapper>
        )
      case 'heading2':
        return (
          <BlockWrapper key={block.id}>
            <h2
              className="text-xl md:text-2xl font-semibold text-foreground outline-none"
              contentEditable
              suppressContentEditableWarning
              onKeyDown={(e) => handleBlockKeyDown(e, block.id)}
              onBlur={(e) => updateBlockContent(block.id, e.currentTarget.textContent || '')}
            >
              {block.content}
            </h2>
          </BlockWrapper>
        )
      case 'heading3':
        return (
          <BlockWrapper key={block.id}>
            <h3
              className="text-lg md:text-xl font-medium text-foreground outline-none"
              contentEditable
              suppressContentEditableWarning
              onKeyDown={(e) => handleBlockKeyDown(e, block.id)}
              onBlur={(e) => updateBlockContent(block.id, e.currentTarget.textContent || '')}
            >
              {block.content}
            </h3>
          </BlockWrapper>
        )
      case 'paragraph':
        return (
          <BlockWrapper key={block.id}>
            <p
              className="text-foreground/90 outline-none min-h-[1.5em]"
              contentEditable
              suppressContentEditableWarning
              onKeyDown={(e) => handleBlockKeyDown(e, block.id)}
              onBlur={(e) => updateBlockContent(block.id, e.currentTarget.textContent || '')}
            >
              {block.content}
            </p>
          </BlockWrapper>
        )
      case 'bullet':
        return (
          <BlockWrapper key={block.id}>
            <div className="flex items-start gap-2">
              <span className="text-primary mt-1.5">•</span>
              <p
                className="flex-1 text-foreground/90 outline-none"
                contentEditable
                suppressContentEditableWarning
                onKeyDown={(e) => handleBlockKeyDown(e, block.id)}
                onBlur={(e) => updateBlockContent(block.id, e.currentTarget.textContent || '')}
              >
                {block.content}
              </p>
            </div>
          </BlockWrapper>
        )
      case 'numbered':
        return (
          <BlockWrapper key={block.id}>
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground min-w-[1.5em]">{index + 1}.</span>
              <p
                className="flex-1 text-foreground/90 outline-none"
                contentEditable
                suppressContentEditableWarning
                onKeyDown={(e) => handleBlockKeyDown(e, block.id)}
                onBlur={(e) => updateBlockContent(block.id, e.currentTarget.textContent || '')}
              >
                {block.content}
              </p>
            </div>
          </BlockWrapper>
        )
      case 'todo':
        return (
          <BlockWrapper key={block.id}>
            <div className="flex items-start gap-2">
              <button
                onClick={() => toggleTodo(block.id)}
                className={`mt-1 w-4 h-4 rounded border ${block.checked ? 'bg-primary border-primary' : 'border-muted-foreground'} flex items-center justify-center`}
              >
                {block.checked && <CheckSquare className="h-3 w-3 text-primary-foreground" />}
              </button>
              <p
                className={`flex-1 outline-none ${block.checked ? 'text-muted-foreground line-through' : 'text-foreground/90'}`}
                contentEditable
                suppressContentEditableWarning
                onKeyDown={(e) => handleBlockKeyDown(e, block.id)}
                onBlur={(e) => updateBlockContent(block.id, e.currentTarget.textContent || '')}
              >
                {block.content}
              </p>
            </div>
          </BlockWrapper>
        )
      case 'toggle':
        return (
          <BlockWrapper key={block.id}>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 w-full text-left">
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-90" />
                <span className="text-foreground/90">{block.content}</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 mt-2 space-y-1">
                {block.children?.map((child, i) => renderBlock(child, i))}
              </CollapsibleContent>
            </Collapsible>
          </BlockWrapper>
        )
      case 'quote':
        return (
          <BlockWrapper key={block.id}>
            <blockquote
              className="border-l-4 border-primary/50 pl-4 text-foreground/80 italic outline-none"
              contentEditable
              suppressContentEditableWarning
              onKeyDown={(e) => handleBlockKeyDown(e, block.id)}
              onBlur={(e) => updateBlockContent(block.id, e.currentTarget.textContent || '')}
            >
              {block.content}
            </blockquote>
          </BlockWrapper>
        )
      case 'code':
        return (
          <BlockWrapper key={block.id}>
            <div className="glass-dark rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/30">
                <span className="text-xs text-muted-foreground font-mono">{block.properties?.language || 'code'}</span>
                <button className="p-1 rounded hover:bg-muted/50 text-muted-foreground">
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <pre
                className="p-4 text-sm font-mono text-foreground/90 overflow-x-auto outline-none"
                contentEditable
                suppressContentEditableWarning
                onKeyDown={(e) => handleBlockKeyDown(e, block.id)}
                onBlur={(e) => updateBlockContent(block.id, e.currentTarget.textContent || '')}
              >
                {block.content}
              </pre>
            </div>
          </BlockWrapper>
        )
      case 'callout':
        return (
          <BlockWrapper key={block.id}>
            <div className="glass border-primary/30 rounded-lg p-4 flex items-start gap-3">
              <span className="text-xl">{block.properties?.emoji || '💡'}</span>
              <p
                className="flex-1 text-foreground/90 outline-none"
                contentEditable
                suppressContentEditableWarning
                onKeyDown={(e) => handleBlockKeyDown(e, block.id)}
                onBlur={(e) => updateBlockContent(block.id, e.currentTarget.textContent || '')}
              >
                {block.content}
              </p>
            </div>
          </BlockWrapper>
        )
      case 'divider':
        return (
          <BlockWrapper key={block.id}>
            <Separator className="my-4 bg-border/50" />
          </BlockWrapper>
        )
      default:
        return null
    }
  }

  // Render sidebar page item
  const renderPageItem = (page: Page, depth: number = 0) => {
    const hasChildren = workspace.pages.some(p => p.parentId === page.id)
    const isExpanded = expandedPages.has(page.id)
    const isFavorite = workspace.favorites.includes(page.id)
    const isActive = currentPageId === page.id
    const children = workspace.pages.filter(p => p.parentId === page.id)

    return (
      <div key={page.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
            isActive ? 'bg-primary/20 text-primary' : 'hover:bg-muted/50 text-foreground/80'
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            setCurrentPageId(page.id)
            setMobileSidebarOpen(false)
          }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                togglePageExpanded(page.id)
              }}
              className="p-0.5 rounded hover:bg-muted/50"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )}
          <span className="text-sm">{page.icon || '📄'}</span>
          <span className="flex-1 text-sm truncate">{page.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(page.id)
            }}
            className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted/50"
          >
            {isFavorite ? (
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            ) : (
              <StarOff className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {children.map(child => renderPageItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  // Filter pages by search
  const filteredPages = searchQuery
    ? workspace.pages.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : workspace.pages.filter(p => !p.parentId)

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 260 : 0,
          x: mobileSidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 768 ? -260 : 0)
        }}
        className={`fixed md:relative h-screen glass-dark border-r border-border/30 z-50 md:z-auto flex flex-col overflow-hidden ${
          mobileSidebarOpen ? 'left-0' : '-left-[260px] md:left-0'
        }`}
        style={{ width: 260 }}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-b border-border/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Workspace</span>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1 rounded hover:bg-muted/50 md:hidden"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md bg-muted/30 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* Favorites */}
            {workspace.favorites.length > 0 && !searchQuery && (
              <div className="mb-4">
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Favorites
                </p>
                {workspace.favorites.map(id => {
                  const page = workspace.pages.find(p => p.id === id)
                  if (!page) return null
                  return (
                    <div
                      key={page.id}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                        currentPageId === page.id ? 'bg-primary/20 text-primary' : 'hover:bg-muted/50 text-foreground/80'
                      }`}
                      onClick={() => {
                        setCurrentPageId(page.id)
                        setMobileSidebarOpen(false)
                      }}
                    >
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm">{page.icon || '📄'}</span>
                      <span className="flex-1 text-sm truncate">{page.title}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Recent */}
            {!searchQuery && (
              <div className="mb-4">
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Recent
                </p>
                {workspace.recentPages.slice(0, 3).map(id => {
                  const page = workspace.pages.find(p => p.id === id)
                  if (!page) return null
                  return (
                    <div
                      key={page.id}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                        currentPageId === page.id ? 'bg-primary/20 text-primary' : 'hover:bg-muted/50 text-foreground/80'
                      }`}
                      onClick={() => {
                        setCurrentPageId(page.id)
                        setMobileSidebarOpen(false)
                      }}
                    >
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{page.icon || '📄'}</span>
                      <span className="flex-1 text-sm truncate">{page.title}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* All Pages */}
            <div>
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {searchQuery ? 'Search Results' : 'Pages'}
              </p>
              {filteredPages.map(page => renderPageItem(page))}
            </div>
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border/30">
          <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-muted/50 text-muted-foreground text-sm">
            <Plus className="h-4 w-4" />
            <span>New Page</span>
          </button>
          <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-muted/50 text-muted-foreground text-sm">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-2 p-3 border-b border-border/30 glass-dark">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-muted/50"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <span className="font-medium text-foreground truncate">
            {currentPage?.icon} {currentPage?.title}
          </span>
        </div>

        {currentPage ? (
          <ScrollArea className="flex-1">
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-12">
              {/* Cover Image */}
              {currentPage.cover && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative h-40 md:h-60 -mx-4 md:-mx-8 mb-6 rounded-b-lg overflow-hidden"
                >
                  <img
                    src={currentPage.cover}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </motion.div>
              )}

              {/* Page Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                {/* Breadcrumbs */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4 overflow-x-auto">
                  {getBreadcrumbs(currentPageId).map((page, i, arr) => (
                    <React.Fragment key={page.id}>
                      <button
                        onClick={() => setCurrentPageId(page.id)}
                        className="hover:text-foreground whitespace-nowrap"
                      >
                        {page.icon} {page.title}
                      </button>
                      {i < arr.length - 1 && <ChevronRight className="h-3 w-3 flex-shrink-0" />}
                    </React.Fragment>
                  ))}
                </div>

                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-4">
                  <button className="text-4xl md:text-6xl hover:bg-muted/30 rounded-lg p-2 -m-2 transition-colors">
                    {currentPage.icon || '📄'}
                  </button>
                  <div className="flex-1">
                    <h1
                      className="text-3xl md:text-4xl font-bold text-foreground outline-none"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      {currentPage.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <span>Updated {new Date(currentPage.updatedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{currentPage.blocks.length} blocks</span>
                      {currentPage.comments.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {currentPage.comments.length}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavorite(currentPageId)}
                      className="p-2 rounded-md hover:bg-muted/50"
                    >
                      {workspace.favorites.includes(currentPageId) ? (
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                      <DialogTrigger asChild>
                        <button className="p-2 rounded-md hover:bg-muted/50">
                          <Share2 className="h-5 w-5 text-muted-foreground" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="glass border-border/30">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">Share & Export</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-3">
                              <Globe className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Share to web</p>
                                <p className="text-xs text-muted-foreground">Publish as public page</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="text-foreground">
                              Enable
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-3">
                              <Users className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Invite people</p>
                                <p className="text-xs text-muted-foreground">Collaborate in real-time</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="text-foreground">
                              Invite
                            </Button>
                          </div>
                          <Separator className="bg-border/30" />
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" className="flex-1 text-foreground">
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Link
                            </Button>
                            <Button variant="outline" className="flex-1 text-foreground">
                              <Download className="h-4 w-4 mr-2" />
                              Export MD
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <button className="p-2 rounded-md hover:bg-muted/50">
                      <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Page Properties */}
                {currentPage.properties.length > 0 && (
                  <Card className="glass border-border/30 p-4 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentPage.properties.map((prop, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground min-w-[80px]">{prop.name}</span>
                          {prop.type === 'select' && (
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              {prop.value}
                            </Badge>
                          )}
                          {prop.type === 'multi-select' && (
                            <div className="flex flex-wrap gap-1">
                              {prop.value.map((v: string, j: number) => (
                                <Badge key={j} className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                                  {v}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {prop.type === 'date' && (
                            <span className="text-sm text-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {prop.value}
                            </span>
                          )}
                          {prop.type === 'text' && (
                            <span className="text-sm text-foreground">{prop.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </motion.div>

              {/* Block Editor */}
              <div ref={editorRef} className="space-y-1 min-h-[400px]">
                {currentPage.blocks.map((block, index) => renderBlock(block, index))}

                {/* Add block placeholder */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 px-2 py-2 text-muted-foreground hover:bg-muted/30 rounded-md cursor-pointer group"
                  onClick={() => addBlock('paragraph')}
                >
                  <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Type / for commands...
                  </span>
                </motion.div>
              </div>

              {/* Child Pages */}
              {childPages.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    Sub-pages
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {childPages.map(page => (
                      <Card
                        key={page.id}
                        className="glass border-border/30 p-4 cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => setCurrentPageId(page.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{page.icon || '📄'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{page.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {page.blocks.length} blocks
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              {currentPage.comments.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comments ({currentPage.comments.length})
                  </h3>
                  <div className="space-y-3">
                    {currentPage.comments.map(comment => (
                      <Card key={comment.id} className="glass-dark border-border/30 p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                            {comment.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground text-sm">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm text-foreground/80">{comment.content}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Backlinks */}
              <div className="mt-12">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Backlinks
                </h3>
                <p className="text-sm text-muted-foreground">No pages link to this page yet.</p>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Select a page to get started</p>
          </div>
        )}
      </main>

      {/* Slash Command Menu */}
      <AnimatePresence>
        {slashMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed z-50 glass border-border/30 rounded-lg shadow-lg overflow-hidden"
            style={{
              left: Math.min(slashMenuPosition.x, typeof window !== 'undefined' ? window.innerWidth - 250 : 300),
              top: slashMenuPosition.y,
              width: 240
            }}
          >
            <Command className="bg-transparent">
              <CommandInput placeholder="Search blocks..." className="border-0" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Basic Blocks">
                  {slashCommands.map(cmd => (
                    <CommandItem
                      key={cmd.id}
                      onSelect={() => addBlock(cmd.type)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded bg-muted/50 flex items-center justify-center">
                        <cmd.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{cmd.label}</p>
                        <p className="text-xs text-muted-foreground">{cmd.description}</p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formatting Toolbar (placeholder for selection-based toolbar) */}
      <AnimatePresence>
        {formattingToolbar.show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="fixed z-50 glass border-border/30 rounded-lg shadow-lg p-1 flex items-center gap-1"
            style={{ left: formattingToolbar.x, top: formattingToolbar.y }}
          >
            <button className="p-1.5 rounded hover:bg-muted/50">
              <Bold className="h-4 w-4 text-foreground" />
            </button>
            <button className="p-1.5 rounded hover:bg-muted/50">
              <Italic className="h-4 w-4 text-foreground" />
            </button>
            <button className="p-1.5 rounded hover:bg-muted/50">
              <Code className="h-4 w-4 text-foreground" />
            </button>
            <button className="p-1.5 rounded hover:bg-muted/50">
              <Link2 className="h-4 w-4 text-foreground" />
            </button>
            <button className="p-1.5 rounded hover:bg-muted/50">
              <Highlighter className="h-4 w-4 text-foreground" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

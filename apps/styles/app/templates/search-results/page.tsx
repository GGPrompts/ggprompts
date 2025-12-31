'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Mic, X, Filter, Clock, Star, ChevronDown, ChevronUp,
  Grid, List, Calendar, FileText, Code, Image, Film, Music,
  Bookmark, Share2, Eye, ChevronLeft, ChevronRight, Settings,
  TrendingUp, Hash, User, Folder, Tag, Link2, AlertCircle,
  Sparkles, History, Save, Trash2, ExternalLink, Copy,
  MoreVertical, SlidersHorizontal, Info
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

// Mock data for search results
const mockResults = {
  all: [
    {
      id: 1,
      type: 'article',
      title: 'Getting Started with Next.js 15',
      url: 'docs.example.com/nextjs/getting-started',
      description: 'Learn how to build modern web applications with Next.js 15 App Router, Server Components, and the latest features. This comprehensive guide covers...',
      date: '2024-03-15',
      author: 'John Doe',
      thumbnail: '/api/placeholder/120/80',
      relevance: 0.98,
      views: 12500,
      tags: ['Next.js', 'React', 'Web Development']
    },
    {
      id: 2,
      type: 'documentation',
      title: 'React Server Components Deep Dive',
      url: 'react.dev/learn/server-components',
      description: 'Understanding the architecture and benefits of React Server Components. How they work, when to use them, and best practices for...',
      date: '2024-03-10',
      author: 'React Team',
      relevance: 0.95,
      views: 8200,
      tags: ['React', 'Server Components', 'Performance']
    },
    {
      id: 3,
      type: 'code',
      title: 'useSearchFilter.ts',
      url: 'github.com/example/hooks/useSearchFilter.ts',
      description: `export function useSearchFilter<T>(items: T[], query: string, keys: (keyof T)[]) {
  return useMemo(() => {
    if (!query) return items;
    const lowerQuery = query.toLowerCase();`,
      date: '2024-03-08',
      author: 'jane_dev',
      language: 'TypeScript',
      lines: 45,
      relevance: 0.92,
      stars: 234
    },
    {
      id: 4,
      type: 'media',
      title: 'Building a Search Interface - Tutorial',
      url: 'youtube.com/watch?v=example',
      description: 'Complete tutorial on building an advanced search interface with React and TypeScript. Covers filtering, pagination, and...',
      date: '2024-03-05',
      author: 'Tech Academy',
      duration: '45:30',
      thumbnail: '/api/placeholder/120/80',
      relevance: 0.89,
      views: 5600
    },
    {
      id: 5,
      type: 'article',
      title: 'Performance Optimization Techniques',
      url: 'blog.example.com/performance-optimization',
      description: 'Explore advanced techniques for optimizing React applications including code splitting, lazy loading, memoization, and...',
      date: '2024-03-12',
      author: 'Sarah Chen',
      thumbnail: '/api/placeholder/120/80',
      relevance: 0.87,
      views: 9800,
      tags: ['Performance', 'React', 'Optimization']
    }
  ]
}

// Mock search suggestions
const searchSuggestions = [
  'next.js app router tutorial',
  'next.js server components',
  'next.js 15 features',
  'next.js deployment vercel',
  'next.js api routes'
]

// Mock recent searches
const recentSearches = [
  { query: 'React Server Components', timestamp: '2 hours ago' },
  { query: 'TypeScript generics', timestamp: '5 hours ago' },
  { query: 'Tailwind CSS utilities', timestamp: 'Yesterday' },
  { query: 'Framer Motion animations', timestamp: '2 days ago' }
]

// Mock saved searches
const savedSearches = [
  { name: 'React Updates', query: 'React latest features' },
  { name: 'Performance', query: 'web performance optimization' },
  { name: 'Design Systems', query: 'component library patterns' }
]

export default function SearchResultsTemplate() {
  const [query, setQuery] = useState('next.js')
  const [isSearching, setIsSearching] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState('10')
  const [sortBy, setSortBy] = useState('relevance')
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    dateRange: 'all',
    fileTypes: [],
    rating: [0]
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<string[]>([])

  // Simulate search loading
  useEffect(() => {
    if (query) {
      setIsSearching(true)
      const timer = setTimeout(() => setIsSearching(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [query])

  const highlightMatch = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-primary/30 text-primary rounded-sm px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  const ResultCard = ({ result }: { result: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {result.thumbnail && viewMode === 'list' && (
              <img
                src={result.thumbnail}
                alt=""
                className="w-24 h-16 rounded object-cover border border-primary/20"
              />
            )}
            <div className="flex-1 min-w-0">
              {/* Title and URL */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-secondary group-hover:text-secondary transition-colors line-clamp-1">
                    {highlightMatch(result.title, query)}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-primary/60 mt-0.5">
                    <Link2 className="w-3 h-3" />
                    <span className="truncate">{result.url}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-dark border-primary/20">
                    <DropdownMenuItem className="text-secondary">
                      <Eye className="w-4 h-4 mr-2" /> Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-secondary">
                      <ExternalLink className="w-4 h-4 mr-2" /> Open in new tab
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-secondary">
                      <Copy className="w-4 h-4 mr-2" /> Copy link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-primary/20" />
                    <DropdownMenuItem className="text-secondary">
                      <Bookmark className="w-4 h-4 mr-2" /> Save
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-secondary">
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                {result.type === 'code' ? (
                  <code className="text-xs bg-background/50 p-1 rounded border border-primary/20 block">
                    {result.description}
                  </code>
                ) : (
                  highlightMatch(result.description, query)
                )}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {result.type}
                </Badge>
                <span className="text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {result.date}
                </span>
                {result.author && (
                  <span className="text-gray-500 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {result.author}
                  </span>
                )}
                {result.views && (
                  <span className="text-gray-500 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {result.views.toLocaleString()} views
                  </span>
                )}
                {result.stars && (
                  <span className="text-gray-500 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {result.stars}
                  </span>
                )}
                {result.duration && (
                  <span className="text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {result.duration}
                  </span>
                )}
              </div>

              {/* Tags */}
              {result.tags && (
                <div className="flex gap-1 mt-2">
                  {result.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 border-primary/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const LoadingSkeleton = () => (
    <Card className="glass border-primary/20">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Skeleton className="w-24 h-16 rounded bg-primary/10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4 bg-primary/10" />
            <Skeleton className="h-4 w-full bg-primary/10" />
            <Skeleton className="h-4 w-2/3 bg-primary/10" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-5 w-16 bg-primary/10" />
              <Skeleton className="h-5 w-20 bg-primary/10" />
              <Skeleton className="h-5 w-24 bg-primary/10" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen ">
      <TooltipProvider>
        <div className="container mx-auto p-8">
          {/* Search Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="glass-dark border-primary/20">
              <CardContent className="p-6">
                <div className="relative">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="Search for anything..."
                        className="pl-10 pr-10 h-12 bg-background/50 border-primary/30 text-secondary placeholder:text-muted-foreground focus:border-primary text-lg"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-primary hover:text-primary"
                      >
                        <Mic className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button className="h-12 px-6 bg-primary/20 border-primary/30 text-primary hover:bg-primary/30">
                      Search
                    </Button>
                  </div>

                  {/* Search Suggestions */}
                  <AnimatePresence>
                    {showSuggestions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 z-50"
                      >
                        <Card className="glass-dark border-primary/20">
                          <CardContent className="p-2">
                            {searchSuggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="px-3 py-2 text-sm text-gray-400 hover:bg-primary/10 hover:text-secondary rounded cursor-pointer transition-colors flex items-center gap-2"
                              >
                                <Search className="w-3 h-3 text-primary" />
                                {suggestion}
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Options */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Advanced Search
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHistory(!showHistory)}
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <History className="w-4 h-4 mr-2" />
                      Search History
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Press <kbd className="px-2 py-0.5 bg-background border border-primary/20 rounded text-primary">⌘K</kbd> to focus search
                  </div>
                </div>

                {/* Advanced Search Panel */}
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-primary/20"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-xs text-gray-500 mb-1">Exact phrase</Label>
                          <Input
                            placeholder='"exact words"'
                            className="h-9 bg-background/50 border-primary/20 text-secondary text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-1">Any of these</Label>
                          <Input
                            placeholder="OR searches"
                            className="h-9 bg-background/50 border-primary/20 text-secondary text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-1">None of these</Label>
                          <Input
                            placeholder="-exclude"
                            className="h-9 bg-background/50 border-primary/20 text-secondary text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-1">Site/Domain</Label>
                          <Input
                            placeholder="example.com"
                            className="h-9 bg-background/50 border-primary/20 text-secondary text-sm"
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        <span className="text-primary">Tips:</span> Use quotes for exact phrases, OR for alternatives, - to exclude, site: to search specific domains
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Filter Controls */}
              <Card className="glass border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-secondary flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filters
                    </span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-500 hover:text-secondary">
                      Clear all
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Category Filter */}
                  <div>
                    <Label className="text-xs text-gray-500 mb-2 block">Category</Label>
                    <div className="space-y-2">
                      {['Articles (24)', 'Documentation (18)', 'Code (35)', 'Media (12)', 'Forums (8)'].map((cat) => (
                        <div key={cat} className="flex items-center space-x-2">
                          <Checkbox className="border-primary/30 data-[state=checked]:bg-primary/20" />
                          <Label className="text-sm text-gray-400 cursor-pointer hover:text-secondary">
                            {cat}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-primary/20" />

                  {/* Date Range */}
                  <div>
                    <Label className="text-xs text-gray-500 mb-2 block">Date Range</Label>
                    <RadioGroup defaultValue="all">
                      {['All time', 'Past 24 hours', 'Past week', 'Past month', 'Past year'].map((range) => (
                        <div key={range} className="flex items-center space-x-2 mb-2">
                          <RadioGroupItem value={range.toLowerCase().replace(' ', '-')} className="border-primary/30" />
                          <Label className="text-sm text-gray-400 cursor-pointer hover:text-secondary">
                            {range}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Separator className="bg-primary/20" />

                  {/* File Type */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                      <Label className="text-xs text-gray-500">File Type</Label>
                      <ChevronDown className="w-3 h-3 text-gray-500" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2">
                      {['PDF', 'DOC', 'TXT', 'MD', 'JSON', 'XML'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox className="border-primary/30 data-[state=checked]:bg-primary/20" />
                          <Label className="text-sm text-gray-400 cursor-pointer hover:text-secondary">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator className="bg-primary/20" />

                  {/* Rating Filter */}
                  <div>
                    <Label className="text-xs text-gray-500 mb-2 block">Minimum Rating</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        defaultValue={[0]}
                        max={5}
                        step={0.5}
                        className="flex-1"
                      />
                      <span className="text-sm text-primary w-8">0</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-3 h-3 text-gray-600 fill-gray-600" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Search History (Conditional) */}
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="glass border-primary/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-secondary flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Search History
                          </span>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <X className="w-3 h-3" onClick={() => setShowHistory(false)} />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="recent" className="w-full">
                          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                            <TabsList className="grid w-max md:w-full grid-cols-2 bg-background/50">
                              <TabsTrigger value="recent" className="text-xs sm:text-sm whitespace-nowrap">Recent</TabsTrigger>
                              <TabsTrigger value="saved" className="text-xs sm:text-sm whitespace-nowrap">Saved</TabsTrigger>
                            </TabsList>
                          </div>
                          <TabsContent value="recent" className="mt-3 space-y-2">
                            {recentSearches.map((search, index) => (
                              <div key={index} className="group flex items-center justify-between p-2 rounded hover:bg-primary/10 cursor-pointer">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-400 group-hover:text-secondary truncate">
                                    {search.query}
                                  </p>
                                  <p className="text-xs text-gray-600">{search.timestamp}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                            <Button variant="ghost" size="sm" className="w-full text-gray-500 hover:text-secondary">
                              <Trash2 className="w-3 h-3 mr-2" />
                              Clear history
                            </Button>
                          </TabsContent>
                          <TabsContent value="saved" className="mt-3 space-y-2">
                            {savedSearches.map((search, index) => (
                              <div key={index} className="group flex items-center justify-between p-2 rounded hover:bg-primary/10 cursor-pointer">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-primary truncate">
                                    {search.name}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">{search.query}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <Star className="w-3 h-3 fill-current" />
                                </Button>
                              </div>
                            ))}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3 space-y-4">
              {/* Results Header */}
              <Card className="glass border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-secondary">
                          Search Results
                        </h2>
                        {!isSearching && (
                          <span className="text-sm text-gray-500">
                            About 1,250 results (0.42 seconds)
                          </span>
                        )}
                      </div>
                      {appliedFilters.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {appliedFilters.map((filter) => (
                            <Badge key={filter} variant="secondary" className="bg-primary/10 border-primary/20">
                              {filter}
                              <X className="w-3 h-3 ml-1 cursor-pointer" />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-32 h-9 bg-background/50 border-primary/20 text-secondary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-dark border-primary/20">
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="popularity">Popularity</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex border border-primary/20 rounded">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-9 w-9 ${viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-gray-500'}`}
                          onClick={() => setViewMode('list')}
                        >
                          <List className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-9 w-9 ${viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-gray-500'}`}
                          onClick={() => setViewMode('grid')}
                        >
                          <Grid className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Search Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-background/50 border border-primary/20 p-1">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary/20">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="articles" className="data-[state=active]:bg-primary/20">
                    <FileText className="w-4 h-4 mr-2" />
                    Articles
                  </TabsTrigger>
                  <TabsTrigger value="docs" className="data-[state=active]:bg-primary/20">
                    <Folder className="w-4 h-4 mr-2" />
                    Documentation
                  </TabsTrigger>
                  <TabsTrigger value="code" className="data-[state=active]:bg-primary/20">
                    <Code className="w-4 h-4 mr-2" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="media" className="data-[state=active]:bg-primary/20">
                    <Film className="w-4 h-4 mr-2" />
                    Media
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  {/* Results or Loading */}
                  {isSearching ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <LoadingSkeleton key={i} />
                      ))}
                    </div>
                  ) : mockResults.all.length > 0 ? (
                    <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}`}>
                      {mockResults.all.map((result) => (
                        <ResultCard key={result.id} result={result} />
                      ))}
                    </div>
                  ) : (
                    // No Results State
                    <Card className="glass border-primary/20">
                      <CardContent className="p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-secondary mb-2">
                          No results found
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Try adjusting your search terms or filters
                        </p>
                        <div className="space-y-2 text-left max-w-md mx-auto">
                          <p className="text-sm text-gray-500">Suggestions:</p>
                          <ul className="text-sm text-gray-400 space-y-1">
                            <li>• Check your spelling</li>
                            <li>• Try more general keywords</li>
                            <li>• Remove some filters</li>
                            <li>• Use different search operators</li>
                          </ul>
                        </div>
                        <div className="mt-6">
                          <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {['React hooks', 'TypeScript', 'Next.js', 'Tailwind CSS'].map((term) => (
                              <Badge
                                key={term}
                                variant="outline"
                                className="border-primary/30 text-primary cursor-pointer hover:bg-primary/10"
                              >
                                {term}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="articles" className="mt-4">
                  <div className="space-y-4">
                    {mockResults.all
                      .filter(r => r.type === 'article')
                      .map((result) => (
                        <ResultCard key={result.id} result={result} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="docs" className="mt-4">
                  <div className="space-y-4">
                    {mockResults.all
                      .filter(r => r.type === 'documentation')
                      .map((result) => (
                        <ResultCard key={result.id} result={result} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="code" className="mt-4">
                  <div className="space-y-4">
                    {mockResults.all
                      .filter(r => r.type === 'code')
                      .map((result) => (
                        <ResultCard key={result.id} result={result} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="media" className="mt-4">
                  <div className="space-y-4">
                    {mockResults.all
                      .filter(r => r.type === 'media')
                      .map((result) => (
                        <ResultCard key={result.id} result={result} />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Pagination */}
              {!isSearching && mockResults.all.length > 0 && (
                <Card className="glass border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          Showing {((currentPage - 1) * parseInt(itemsPerPage)) + 1}-{Math.min(currentPage * parseInt(itemsPerPage), 1250)} of 1,250 results
                        </span>
                        <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                          <SelectTrigger className="w-20 h-8 bg-background/50 border-primary/20 text-secondary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-dark border-primary/20">
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-gray-500">per page</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="h-8 w-8 border-primary/20 text-primary hover:bg-primary/10 disabled:opacity-30"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        {[1, 2, 3, 4, 5].map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={`h-8 w-8 ${
                              currentPage === page
                                ? 'bg-primary/20 border-primary/40 text-primary'
                                : 'border-primary/20 text-gray-500 hover:text-primary hover:bg-primary/10'
                            }`}
                          >
                            {page}
                          </Button>
                        ))}
                        <span className="text-gray-600 px-2">...</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 border-primary/20 text-gray-500 hover:text-primary hover:bg-primary/10"
                        >
                          125
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="h-8 w-8 border-primary/20 text-primary hover:bg-primary/10"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  )
}
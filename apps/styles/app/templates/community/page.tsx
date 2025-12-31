'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  TrendingUp,
  Users,
  Search,
  Filter,
  Plus,
  ThumbsUp,
  MessageCircle,
  Eye,
  Pin,
  Lock,
  CheckCircle2,
  Star,
  Award,
  Trophy,
  Clock,
  Flame,
  Sparkles,
  BookOpen,
  Code,
  HelpCircle,
  Lightbulb,
  Bug,
  Megaphone,
  Rocket,
  Heart,
  Shield
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// Types
interface ForumCategory {
  id: string
  name: string
  description: string
  icon: any
  color: string
  topicCount: number
  postCount: number
  lastActivity: string
}

interface Discussion {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    role: string
    reputation: number
  }
  category: string
  tags: string[]
  upvotes: number
  replies: number
  views: number
  createdAt: string
  lastReply?: string
  isPinned?: boolean
  isLocked?: boolean
  isSolved?: boolean
  isTrending?: boolean
}

interface User {
  rank: number
  name: string
  avatar: string
  reputation: number
  posts: number
  badges: string[]
}

// Mock Data - Forum Categories
const categories: ForumCategory[] = [
  {
    id: 'general',
    name: 'General Discussion',
    description: 'General topics and community conversations',
    icon: MessageSquare,
    color: 'text-blue-500',
    topicCount: 1245,
    postCount: 8932,
    lastActivity: '2 minutes ago',
  },
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'Official news, updates, and announcements',
    icon: Megaphone,
    color: 'text-purple-500',
    topicCount: 156,
    postCount: 2341,
    lastActivity: '1 hour ago',
  },
  {
    id: 'help',
    name: 'Help & Support',
    description: 'Get help with issues and troubleshooting',
    icon: HelpCircle,
    color: 'text-green-500',
    topicCount: 3421,
    postCount: 12456,
    lastActivity: '5 minutes ago',
  },
  {
    id: 'features',
    name: 'Feature Requests',
    description: 'Suggest and vote on new features',
    icon: Lightbulb,
    color: 'text-yellow-500',
    topicCount: 892,
    postCount: 4567,
    lastActivity: '15 minutes ago',
  },
  {
    id: 'bugs',
    name: 'Bug Reports',
    description: 'Report bugs and technical issues',
    icon: Bug,
    color: 'text-red-500',
    topicCount: 567,
    postCount: 2891,
    lastActivity: '30 minutes ago',
  },
  {
    id: 'tutorials',
    name: 'Tutorials & Guides',
    description: 'Learn with community-created tutorials',
    icon: BookOpen,
    color: 'text-secondary',
    topicCount: 423,
    postCount: 3245,
    lastActivity: '1 hour ago',
  },
  {
    id: 'development',
    name: 'Development',
    description: 'API, SDK, and development discussions',
    icon: Code,
    color: 'text-orange-500',
    topicCount: 789,
    postCount: 5432,
    lastActivity: '20 minutes ago',
  },
  {
    id: 'showcase',
    name: 'Showcase',
    description: 'Share your projects and creations',
    icon: Rocket,
    color: 'text-pink-500',
    topicCount: 634,
    postCount: 4123,
    lastActivity: '45 minutes ago',
  },
]

// Mock Data - Discussions (50+ topics)
const discussions: Discussion[] = [
  {
    id: 'd1',
    title: 'Welcome to the Community! Introduce Yourself',
    content: 'New to the community? Say hello and tell us about yourself!',
    author: {
      name: 'Admin Team',
      avatar: '👤',
      role: 'Admin',
      reputation: 9999,
    },
    category: 'general',
    tags: ['welcome', 'introduction'],
    upvotes: 342,
    replies: 1245,
    views: 8932,
    createdAt: '2024-01-15',
    lastReply: '2 minutes ago',
    isPinned: true,
  },
  {
    id: 'd2',
    title: 'v2.0 Released - Major Update with New Features',
    content: 'Exciting new features and improvements in version 2.0',
    author: {
      name: 'Sarah Mitchell',
      avatar: '👩',
      role: 'Team',
      reputation: 5432,
    },
    category: 'announcements',
    tags: ['release', 'update', 'v2.0'],
    upvotes: 567,
    replies: 89,
    views: 3421,
    createdAt: '2024-05-15',
    lastReply: '1 hour ago',
    isPinned: true,
    isTrending: true,
  },
  {
    id: 'd3',
    title: 'How to set up authentication with OAuth 2.0?',
    content: 'I\'m trying to implement OAuth 2.0 authentication but running into issues...',
    author: {
      name: 'John Doe',
      avatar: '👨',
      role: 'Member',
      reputation: 234,
    },
    category: 'help',
    tags: ['authentication', 'oauth', 'help'],
    upvotes: 45,
    replies: 12,
    views: 567,
    createdAt: '2024-05-14',
    lastReply: '5 minutes ago',
    isSolved: true,
  },
  {
    id: 'd4',
    title: 'Feature Request: Dark mode for mobile app',
    content: 'Would love to see dark mode support in the mobile application',
    author: {
      name: 'Alex Chen',
      avatar: '👦',
      role: 'Member',
      reputation: 456,
    },
    category: 'features',
    tags: ['mobile', 'dark-mode', 'ui'],
    upvotes: 234,
    replies: 34,
    views: 1234,
    createdAt: '2024-05-13',
    lastReply: '15 minutes ago',
    isTrending: true,
  },
  {
    id: 'd5',
    title: 'Bug: Dashboard not loading on Safari',
    content: 'The dashboard page fails to load on Safari 17.x',
    author: {
      name: 'Emma Wilson',
      avatar: '👧',
      role: 'Member',
      reputation: 678,
    },
    category: 'bugs',
    tags: ['bug', 'safari', 'dashboard'],
    upvotes: 67,
    replies: 8,
    views: 345,
    createdAt: '2024-05-14',
    lastReply: '30 minutes ago',
  },
  {
    id: 'd6',
    title: 'Complete Guide to API Integration',
    content: 'Step-by-step tutorial for integrating with our API',
    author: {
      name: 'Mike Johnson',
      avatar: '👨',
      role: 'Moderator',
      reputation: 2345,
    },
    category: 'tutorials',
    tags: ['api', 'tutorial', 'guide'],
    upvotes: 456,
    replies: 67,
    views: 2345,
    createdAt: '2024-05-10',
    lastReply: '1 hour ago',
  },
  {
    id: 'd7',
    title: 'Best practices for GraphQL queries',
    content: 'Discussion about optimizing GraphQL queries and performance',
    author: {
      name: 'Lisa Park',
      avatar: '👩',
      role: 'Member',
      reputation: 890,
    },
    category: 'development',
    tags: ['graphql', 'performance', 'best-practices'],
    upvotes: 123,
    replies: 23,
    views: 789,
    createdAt: '2024-05-13',
    lastReply: '20 minutes ago',
  },
  {
    id: 'd8',
    title: 'My E-commerce Platform Built with Your Product',
    content: 'Sharing my experience building a full e-commerce platform',
    author: {
      name: 'David Lee',
      avatar: '👨',
      role: 'Member',
      reputation: 1234,
    },
    category: 'showcase',
    tags: ['showcase', 'e-commerce', 'success-story'],
    upvotes: 345,
    replies: 45,
    views: 1567,
    createdAt: '2024-05-12',
    lastReply: '45 minutes ago',
  },
  {
    id: 'd9',
    title: 'Tips for improving page load performance',
    content: 'What are your best tips for optimizing page load times?',
    author: {
      name: 'Rachel Green',
      avatar: '👩',
      role: 'Member',
      reputation: 567,
    },
    category: 'general',
    tags: ['performance', 'optimization', 'discussion'],
    upvotes: 89,
    replies: 34,
    views: 678,
    createdAt: '2024-05-14',
    lastReply: '10 minutes ago',
  },
  {
    id: 'd10',
    title: 'Webhook events not firing consistently',
    content: 'I\'m experiencing intermittent webhook delivery issues',
    author: {
      name: 'Tom Hardy',
      avatar: '👨',
      role: 'Member',
      reputation: 345,
    },
    category: 'bugs',
    tags: ['webhooks', 'bug', 'api'],
    upvotes: 34,
    replies: 6,
    views: 234,
    createdAt: '2024-05-15',
    lastReply: '25 minutes ago',
  },
  // Additional discussions for variety
  {
    id: 'd11',
    title: 'How to handle rate limiting in production?',
    content: 'Best strategies for managing API rate limits at scale',
    author: { name: 'Chris Evans', avatar: '👨', role: 'Member', reputation: 789 },
    category: 'development',
    tags: ['api', 'rate-limiting', 'production'],
    upvotes: 156,
    replies: 28,
    views: 892,
    createdAt: '2024-05-13',
    lastReply: '35 minutes ago',
  },
  {
    id: 'd12',
    title: 'Monthly Community Challenge - May 2024',
    content: 'Join our monthly coding challenge and win prizes!',
    author: { name: 'Community Team', avatar: '👥', role: 'Team', reputation: 8888 },
    category: 'announcements',
    tags: ['challenge', 'event', 'prizes'],
    upvotes: 234,
    replies: 56,
    views: 1456,
    createdAt: '2024-05-01',
    lastReply: '2 hours ago',
    isPinned: true,
  },
  {
    id: 'd13',
    title: 'Error handling best practices',
    content: 'How do you handle errors in your applications?',
    author: { name: 'Nina Patel', avatar: '👩', role: 'Member', reputation: 456 },
    category: 'general',
    tags: ['errors', 'best-practices', 'discussion'],
    upvotes: 67,
    replies: 19,
    views: 456,
    createdAt: '2024-05-14',
    lastReply: '1 hour ago',
  },
  {
    id: 'd14',
    title: 'Request: Bulk export feature',
    content: 'Would be great to have a bulk export option for data',
    author: { name: 'Oscar Martinez', avatar: '👨', role: 'Member', reputation: 234 },
    category: 'features',
    tags: ['export', 'feature-request', 'data'],
    upvotes: 123,
    replies: 17,
    views: 678,
    createdAt: '2024-05-13',
    lastReply: '50 minutes ago',
  },
  {
    id: 'd15',
    title: 'Tutorial: Building real-time notifications',
    content: 'Complete guide to implementing real-time notifications',
    author: { name: 'Paula Dean', avatar: '👩', role: 'Moderator', reputation: 3456 },
    category: 'tutorials',
    tags: ['tutorial', 'real-time', 'notifications'],
    upvotes: 389,
    replies: 52,
    views: 1890,
    createdAt: '2024-05-11',
    lastReply: '3 hours ago',
  },
  {
    id: 'd16',
    title: 'Memory leak in v1.9.5?',
    content: 'Experiencing high memory usage after upgrading',
    author: { name: 'Quinn Roberts', avatar: '👨', role: 'Member', reputation: 567 },
    category: 'bugs',
    tags: ['bug', 'memory', 'performance'],
    upvotes: 45,
    replies: 11,
    views: 289,
    createdAt: '2024-05-14',
    lastReply: '40 minutes ago',
  },
  {
    id: 'd17',
    title: 'My SaaS Dashboard - 1 Year Later',
    content: 'Lessons learned from building a SaaS dashboard',
    author: { name: 'Robert Smith', avatar: '👨', role: 'Member', reputation: 1567 },
    category: 'showcase',
    tags: ['showcase', 'saas', 'lessons-learned'],
    upvotes: 456,
    replies: 68,
    views: 2345,
    createdAt: '2024-05-10',
    lastReply: '1.5 hours ago',
  },
  {
    id: 'd18',
    title: 'TypeScript migration guide?',
    content: 'Looking for advice on migrating from JavaScript to TypeScript',
    author: { name: 'Sophia Turner', avatar: '👩', role: 'Member', reputation: 345 },
    category: 'help',
    tags: ['typescript', 'migration', 'help'],
    upvotes: 78,
    replies: 15,
    views: 567,
    createdAt: '2024-05-14',
    lastReply: '15 minutes ago',
    isSolved: true,
  },
  {
    id: 'd19',
    title: 'Security best practices for APIs',
    content: 'Discussion on securing API endpoints and data',
    author: { name: 'Tyler Brooks', avatar: '👨', role: 'Member', reputation: 890 },
    category: 'development',
    tags: ['security', 'api', 'best-practices'],
    upvotes: 234,
    replies: 41,
    views: 1234,
    createdAt: '2024-05-12',
    lastReply: '2 hours ago',
    isTrending: true,
  },
  {
    id: 'd20',
    title: 'What are you building this week?',
    content: 'Share what you\'re working on and get feedback from the community',
    author: { name: 'Uma Thurman', avatar: '👩', role: 'Member', reputation: 456 },
    category: 'general',
    tags: ['discussion', 'projects', 'community'],
    upvotes: 89,
    replies: 67,
    views: 890,
    createdAt: '2024-05-13',
    lastReply: '5 minutes ago',
  },
]

// Mock Data - Leaderboard
const leaderboard: User[] = [
  { rank: 1, name: 'Sarah Mitchell', avatar: '👩', reputation: 5432, posts: 1234, badges: ['🏆', '⭐', '💎'] },
  { rank: 2, name: 'Mike Johnson', avatar: '👨', reputation: 4567, posts: 987, badges: ['🏆', '⭐'] },
  { rank: 3, name: 'Paula Dean', avatar: '👩', reputation: 3456, posts: 756, badges: ['🏆', '⭐'] },
  { rank: 4, name: 'David Lee', avatar: '👨', reputation: 2345, posts: 645, badges: ['⭐', '💎'] },
  { rank: 5, name: 'Robert Smith', avatar: '👨', reputation: 1567, posts: 534, badges: ['⭐'] },
  { rank: 6, name: 'Lisa Park', avatar: '👩', reputation: 1234, posts: 423, badges: ['⭐'] },
  { rank: 7, name: 'Alex Chen', avatar: '👦', reputation: 890, posts: 312, badges: ['💎'] },
  { rank: 8, name: 'Emma Wilson', avatar: '👧', reputation: 789, posts: 289, badges: [] },
  { rank: 9, name: 'Tom Hardy', avatar: '👨', reputation: 678, posts: 256, badges: [] },
  { rank: 10, name: 'Rachel Green', avatar: '👩', reputation: 567, posts: 234, badges: [] },
]

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'latest' | 'trending' | 'top'>('latest')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [newPostOpen, setNewPostOpen] = useState(false)
  const [upvotedPosts, setUpvotedPosts] = useState<Set<string>>(new Set())

  // Filter and sort discussions
  const filteredDiscussions = useMemo(() => {
    let filtered = discussions

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((d) => d.category === selectedCategory)
    }

    if (selectedTag) {
      filtered = filtered.filter((d) => d.tags.includes(selectedTag))
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.content.toLowerCase().includes(query) ||
          d.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      switch (sortBy) {
        case 'trending':
          return (b.upvotes + b.replies) - (a.upvotes + a.replies)
        case 'top':
          return b.upvotes - a.upvotes
        case 'latest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return sorted
  }, [searchQuery, selectedCategory, selectedTag, sortBy])

  const trendingDiscussions = useMemo(() => {
    return discussions.filter((d) => d.isTrending).slice(0, 5)
  }, [])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    discussions.forEach((d) => d.tags.forEach((tag) => tags.add(tag)))
    return Array.from(tags).slice(0, 15)
  }, [])

  const handleUpvote = (discussionId: string) => {
    setUpvotedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(discussionId)) {
        newSet.delete(discussionId)
      } else {
        newSet.add(discussionId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Users className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Community Forum</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with developers, share knowledge, and get help from the community
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Discussions', value: discussions.length, icon: MessageSquare },
            { label: 'Members', value: '12.5K', icon: Users },
            { label: 'Categories', value: categories.length, icon: BookOpen },
            { label: 'Solved', value: discussions.filter((d) => d.isSolved).length, icon: CheckCircle2 },
          ].map((stat, index) => (
            <Card key={index} className="glass p-4 text-center">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Categories</h2>
            <Button onClick={() => setNewPostOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Discussion
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  className="glass cursor-pointer h-full"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <category.icon className={cn('w-8 h-8', category.color)} />
                      <Badge variant="secondary">{category.topicCount}</Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{category.postCount} posts</span>
                      <span>{category.lastActivity}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Discussions */}
          <div className="space-y-6">
            {/* Filters */}
            <Card className="glass p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger className="w-full md:w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tag Filter */}
              {selectedTag && (
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm text-muted-foreground">Filtered by:</span>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSelectedTag(null)}
                  >
                    {selectedTag} ✕
                  </Badge>
                </div>
              )}
            </Card>

            {/* Discussions List */}
            <div className="space-y-3">
              {filteredDiscussions.map((discussion, index) => (
                <DiscussionCard
                  key={discussion.id}
                  discussion={discussion}
                  index={index}
                  isUpvoted={upvotedPosts.has(discussion.id)}
                  onUpvote={handleUpvote}
                  onTagClick={setSelectedTag}
                />
              ))}

              {filteredDiscussions.length === 0 && (
                <Card className="glass p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No discussions found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or start a new discussion
                  </p>
                  <Button onClick={() => setNewPostOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Start Discussion
                  </Button>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending */}
            <Card className="glass p-6">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold">Trending Now</h3>
              </div>
              <div className="space-y-3">
                {trendingDiscussions.map((discussion) => (
                  <div key={discussion.id} className="space-y-2">
                    <h4 className="text-sm font-semibold line-clamp-2 cursor-pointer hover:text-primary">
                      {discussion.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {discussion.upvotes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {discussion.replies}
                      </div>
                    </div>
                    <Separator className="mt-2" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Leaderboard */}
            <Card className="glass p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold">Top Contributors</h3>
              </div>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((user) => (
                  <div key={user.rank} className="flex items-center gap-3">
                    <div className="text-lg font-bold text-muted-foreground w-6">
                      #{user.rank}
                    </div>
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.reputation} rep
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {user.badges.map((badge, i) => (
                        <span key={i}>{badge}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Popular Tags */}
            <Card className="glass p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Popular Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/20"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* New Post Dialog */}
        <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
          <DialogContent className="glass-overlay max-w-2xl">
            <DialogHeader>
              <DialogTitle>Start a New Discussion</DialogTitle>
              <DialogDescription>
                Share your thoughts, ask questions, or start a conversation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input placeholder="What's your discussion about?" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea placeholder="Share details, ask questions..." rows={8} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <Input placeholder="Add tags (comma separated)" />
              </div>
              <Button className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Post Discussion
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Discussion Card Component
interface DiscussionCardProps {
  discussion: Discussion
  index: number
  isUpvoted: boolean
  onUpvote: (id: string) => void
  onTagClick: (tag: string) => void
}

function DiscussionCard({ discussion, index, isUpvoted, onUpvote, onTagClick }: DiscussionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card className="glass hover:border-primary/50 transition-all">
        <div className="p-6">
          <div className="flex gap-4">
            {/* Upvote Section */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => onUpvote(discussion.id)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  isUpvoted ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10'
                )}
              >
                <ThumbsUp className={cn('w-5 h-5', isUpvoted && 'fill-current')} />
              </button>
              <span className="text-sm font-semibold">
                {discussion.upvotes + (isUpvoted ? 1 : 0)}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              {/* Header */}
              <div className="flex items-start gap-2 flex-wrap">
                {discussion.isPinned && (
                  <Pin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                )}
                {discussion.isLocked && (
                  <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                )}
                {discussion.isSolved && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                )}
                {discussion.isTrending && (
                  <Flame className="w-4 h-4 text-orange-500 flex-shrink-0 mt-1" />
                )}
                <h3 className="text-lg font-semibold cursor-pointer hover:text-primary flex-1">
                  {discussion.title}
                </h3>
              </div>

              {/* Content Preview */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {discussion.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {discussion.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/20"
                    onClick={() => onTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{discussion.author.avatar}</span>
                    <span className="font-semibold">{discussion.author.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {discussion.author.role}
                    </Badge>
                  </div>
                  <span>•</span>
                  <span>{discussion.createdAt}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {discussion.replies}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {discussion.views}
                  </div>
                </div>
              </div>

              {discussion.lastReply && (
                <div className="text-xs text-muted-foreground">
                  Last reply {discussion.lastReply}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

import { Send } from 'lucide-react'

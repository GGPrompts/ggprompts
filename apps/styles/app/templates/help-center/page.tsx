'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Book,
  MessageCircle,
  Video,
  HelpCircle,
  FileText,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Clock,
  TrendingUp,
  Star,
  Bookmark,
  Send,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Settings,
  Shield,
  Zap,
  CreditCard,
  Users,
  Code,
  Database,
  Mail,
  Smartphone,
  Play
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
interface Category {
  id: string
  name: string
  description: string
  icon: any
  articleCount: number
  color: string
}

interface Article {
  id: string
  title: string
  summary: string
  content: string
  categoryId: string
  tags: string[]
  views: number
  helpful: number
  notHelpful: number
  lastUpdated: string
  readTime: number
  featured?: boolean
  videoUrl?: string
  relatedArticles?: string[]
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

// Mock Data - Categories
const categories: Category[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Learn the basics and set up your account',
    icon: Sparkles,
    articleCount: 12,
    color: 'text-blue-500',
  },
  {
    id: 'account-settings',
    name: 'Account & Settings',
    description: 'Manage your profile, preferences, and security',
    icon: Settings,
    articleCount: 18,
    color: 'text-purple-500',
  },
  {
    id: 'billing',
    name: 'Billing & Payments',
    description: 'Subscription plans, invoices, and payment methods',
    icon: CreditCard,
    articleCount: 15,
    color: 'text-green-500',
  },
  {
    id: 'features',
    name: 'Features & Tools',
    description: 'Explore all features and how to use them',
    icon: Zap,
    articleCount: 24,
    color: 'text-yellow-500',
  },
  {
    id: 'integrations',
    name: 'Integrations',
    description: 'Connect with third-party apps and services',
    icon: Code,
    articleCount: 20,
    color: 'text-secondary',
  },
  {
    id: 'security',
    name: 'Security & Privacy',
    description: 'Data protection, compliance, and best practices',
    icon: Shield,
    articleCount: 14,
    color: 'text-red-500',
  },
  {
    id: 'collaboration',
    name: 'Team & Collaboration',
    description: 'Invite members, manage permissions, and collaborate',
    icon: Users,
    articleCount: 16,
    color: 'text-indigo-500',
  },
  {
    id: 'mobile',
    name: 'Mobile Apps',
    description: 'iOS and Android app guides and troubleshooting',
    icon: Smartphone,
    articleCount: 10,
    color: 'text-pink-500',
  },
  {
    id: 'api',
    name: 'API & Developers',
    description: 'API documentation, SDKs, and developer resources',
    icon: Database,
    articleCount: 22,
    color: 'text-orange-500',
  },
]

// Mock Data - Articles
const articles: Article[] = [
  {
    id: 'a1',
    title: 'Quick Start Guide: Your First 5 Minutes',
    summary: 'Get up and running in under 5 minutes with this comprehensive quick start guide.',
    content: 'Complete walkthrough of initial setup...',
    categoryId: 'getting-started',
    tags: ['Quick Start', 'Beginner', 'Setup'],
    views: 15420,
    helpful: 1234,
    notHelpful: 23,
    lastUpdated: '2024-05-15',
    readTime: 5,
    featured: true,
    videoUrl: 'https://youtube.com/example',
  },
  {
    id: 'a2',
    title: 'How to Create Your First Project',
    summary: 'Step-by-step instructions for creating and configuring your first project.',
    content: 'Detailed project creation guide...',
    categoryId: 'getting-started',
    tags: ['Projects', 'Tutorial'],
    views: 12340,
    helpful: 987,
    notHelpful: 34,
    lastUpdated: '2024-05-10',
    readTime: 7,
    featured: true,
  },
  {
    id: 'a3',
    title: 'Understanding the Dashboard',
    summary: 'Navigate your dashboard like a pro with this complete overview.',
    content: 'Dashboard navigation guide...',
    categoryId: 'getting-started',
    tags: ['Dashboard', 'UI', 'Navigation'],
    views: 9876,
    helpful: 756,
    notHelpful: 12,
    lastUpdated: '2024-05-12',
    readTime: 6,
  },
  {
    id: 'a4',
    title: 'Enabling Two-Factor Authentication',
    summary: 'Secure your account with 2FA using authenticator apps or SMS.',
    content: '2FA setup instructions...',
    categoryId: 'account-settings',
    tags: ['Security', '2FA', 'Authentication'],
    views: 8765,
    helpful: 654,
    notHelpful: 8,
    lastUpdated: '2024-05-14',
    readTime: 4,
    featured: true,
  },
  {
    id: 'a5',
    title: 'Changing Your Email Address',
    summary: 'Update your account email address safely and verify the change.',
    content: 'Email change procedure...',
    categoryId: 'account-settings',
    tags: ['Email', 'Account'],
    views: 6543,
    helpful: 432,
    notHelpful: 15,
    lastUpdated: '2024-05-08',
    readTime: 3,
  },
  {
    id: 'a6',
    title: 'Managing Notification Preferences',
    summary: 'Customize which notifications you receive and how you receive them.',
    content: 'Notification settings guide...',
    categoryId: 'account-settings',
    tags: ['Notifications', 'Preferences'],
    views: 5432,
    helpful: 321,
    notHelpful: 7,
    lastUpdated: '2024-05-06',
    readTime: 5,
  },
  {
    id: 'a7',
    title: 'Understanding Pricing Plans',
    summary: 'Compare our pricing tiers and find the right plan for your needs.',
    content: 'Pricing plans comparison...',
    categoryId: 'billing',
    tags: ['Pricing', 'Plans', 'Subscription'],
    views: 11234,
    helpful: 890,
    notHelpful: 45,
    lastUpdated: '2024-05-13',
    readTime: 8,
    featured: true,
  },
  {
    id: 'a8',
    title: 'How to Upgrade Your Plan',
    summary: 'Upgrade to a higher tier plan and unlock additional features.',
    content: 'Plan upgrade instructions...',
    categoryId: 'billing',
    tags: ['Upgrade', 'Subscription'],
    views: 7654,
    helpful: 567,
    notHelpful: 23,
    lastUpdated: '2024-05-11',
    readTime: 4,
  },
  {
    id: 'a9',
    title: 'Downloading Invoices and Receipts',
    summary: 'Access and download your billing history and payment receipts.',
    content: 'Invoice download guide...',
    categoryId: 'billing',
    tags: ['Invoices', 'Receipts', 'Billing'],
    views: 4321,
    helpful: 234,
    notHelpful: 12,
    lastUpdated: '2024-05-07',
    readTime: 3,
  },
  {
    id: 'a10',
    title: 'Using Advanced Search Filters',
    summary: 'Master advanced search with filters, operators, and saved searches.',
    content: 'Advanced search tutorial...',
    categoryId: 'features',
    tags: ['Search', 'Filters', 'Advanced'],
    views: 6789,
    helpful: 456,
    notHelpful: 18,
    lastUpdated: '2024-05-09',
    readTime: 10,
  },
  {
    id: 'a11',
    title: 'Creating Custom Workflows',
    summary: 'Automate your processes with custom workflows and triggers.',
    content: 'Workflow creation guide...',
    categoryId: 'features',
    tags: ['Workflows', 'Automation'],
    views: 8901,
    helpful: 678,
    notHelpful: 34,
    lastUpdated: '2024-05-12',
    readTime: 12,
  },
  {
    id: 'a12',
    title: 'Setting Up Real-time Collaboration',
    summary: 'Enable live collaboration features for your team.',
    content: 'Collaboration setup...',
    categoryId: 'collaboration',
    tags: ['Collaboration', 'Real-time', 'Team'],
    views: 5678,
    helpful: 345,
    notHelpful: 9,
    lastUpdated: '2024-05-10',
    readTime: 7,
  },
  {
    id: 'a13',
    title: 'Connecting Slack Integration',
    summary: 'Integrate Slack to receive notifications and manage tasks.',
    content: 'Slack integration setup...',
    categoryId: 'integrations',
    tags: ['Slack', 'Integration', 'Notifications'],
    views: 9012,
    helpful: 723,
    notHelpful: 28,
    lastUpdated: '2024-05-14',
    readTime: 6,
    featured: true,
  },
  {
    id: 'a14',
    title: 'GitHub Integration Setup',
    summary: 'Connect your GitHub repositories and sync issues automatically.',
    content: 'GitHub integration guide...',
    categoryId: 'integrations',
    tags: ['GitHub', 'Integration', 'Version Control'],
    views: 7234,
    helpful: 589,
    notHelpful: 21,
    lastUpdated: '2024-05-11',
    readTime: 8,
  },
  {
    id: 'a15',
    title: 'REST API Quick Start',
    summary: 'Get started with our REST API in minutes with authentication and examples.',
    content: 'API quick start guide...',
    categoryId: 'api',
    tags: ['API', 'REST', 'Developer'],
    views: 10234,
    helpful: 834,
    notHelpful: 37,
    lastUpdated: '2024-05-13',
    readTime: 15,
    featured: true,
  },
  {
    id: 'a16',
    title: 'Webhook Configuration',
    summary: 'Set up webhooks to receive real-time event notifications.',
    content: 'Webhook setup instructions...',
    categoryId: 'api',
    tags: ['Webhooks', 'API', 'Events'],
    views: 6123,
    helpful: 412,
    notHelpful: 19,
    lastUpdated: '2024-05-09',
    readTime: 9,
  },
  {
    id: 'a17',
    title: 'Mobile App Installation Guide',
    summary: 'Download and install our mobile apps on iOS and Android.',
    content: 'Mobile installation steps...',
    categoryId: 'mobile',
    tags: ['Mobile', 'iOS', 'Android', 'Installation'],
    views: 8456,
    helpful: 612,
    notHelpful: 25,
    lastUpdated: '2024-05-12',
    readTime: 4,
  },
  {
    id: 'a18',
    title: 'GDPR Compliance Guide',
    summary: 'Understanding how we handle your data in compliance with GDPR.',
    content: 'GDPR compliance details...',
    categoryId: 'security',
    tags: ['GDPR', 'Privacy', 'Compliance'],
    views: 4567,
    helpful: 298,
    notHelpful: 14,
    lastUpdated: '2024-05-08',
    readTime: 12,
  },
  {
    id: 'a19',
    title: 'Inviting Team Members',
    summary: 'Add team members and assign roles and permissions.',
    content: 'Team invitation guide...',
    categoryId: 'collaboration',
    tags: ['Team', 'Invitations', 'Permissions'],
    views: 7890,
    helpful: 567,
    notHelpful: 22,
    lastUpdated: '2024-05-11',
    readTime: 5,
  },
  {
    id: 'a20',
    title: 'Exporting Your Data',
    summary: 'Export all your data in various formats for backup or migration.',
    content: 'Data export instructions...',
    categoryId: 'account-settings',
    tags: ['Export', 'Data', 'Backup'],
    views: 5234,
    helpful: 389,
    notHelpful: 16,
    lastUpdated: '2024-05-10',
    readTime: 6,
  },
]

// Mock Data - FAQs
const faqs: FAQ[] = [
  {
    id: 'faq1',
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your inbox. Make sure to check your spam folder if you don\'t see the email within a few minutes.',
    category: 'Account',
  },
  {
    id: 'faq2',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you won\'t be charged for the next cycle.',
    category: 'Billing',
  },
  {
    id: 'faq3',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for enterprise plans. All payments are processed securely through our payment partners.',
    category: 'Billing',
  },
  {
    id: 'faq4',
    question: 'Is my data encrypted?',
    answer: 'Yes, all data is encrypted both in transit (using TLS 1.3) and at rest (using AES-256 encryption). We follow industry-standard security practices and are SOC 2 Type II certified.',
    category: 'Security',
  },
  {
    id: 'faq5',
    question: 'How many team members can I add?',
    answer: 'The number of team members depends on your plan. Starter plans include 3 members, Professional plans include 10 members, and Enterprise plans offer unlimited team members.',
    category: 'Teams',
  },
  {
    id: 'faq6',
    question: 'Do you offer a free trial?',
    answer: 'Yes! We offer a 14-day free trial for all paid plans. No credit card is required to start your trial, and you can upgrade at any time during or after the trial period.',
    category: 'Billing',
  },
  {
    id: 'faq7',
    question: 'Can I import data from other platforms?',
    answer: 'Absolutely! We support imports from CSV files and have native integrations with popular platforms. Our support team can also help with bulk migrations for enterprise customers.',
    category: 'Getting Started',
  },
  {
    id: 'faq8',
    question: 'What happens if I exceed my plan limits?',
    answer: 'We\'ll notify you when you approach your plan limits. You can either upgrade to a higher tier or optimize your usage. We don\'t charge overage fees without prior notification.',
    category: 'Billing',
  },
  {
    id: 'faq9',
    question: 'Is there a mobile app available?',
    answer: 'Yes, we have native mobile apps for both iOS and Android. You can download them from the App Store or Google Play Store. Most features available on the web are also available on mobile.',
    category: 'Mobile',
  },
  {
    id: 'faq10',
    question: 'How do I contact support?',
    answer: 'You can contact our support team via email at support@example.com, through the in-app chat widget, or by submitting a ticket through your account dashboard. Enterprise customers have access to priority phone support.',
    category: 'Support',
  },
]

// Video tutorials
const videoTutorials = [
  {
    id: 'v1',
    title: 'Getting Started in 5 Minutes',
    duration: '5:23',
    views: 12450,
    thumbnail: '🎬',
  },
  {
    id: 'v2',
    title: 'Advanced Features Deep Dive',
    duration: '15:47',
    views: 8234,
    thumbnail: '🎬',
  },
  {
    id: 'v3',
    title: 'Team Collaboration Best Practices',
    duration: '8:15',
    views: 6789,
    thumbnail: '🎬',
  },
  {
    id: 'v4',
    title: 'API Integration Tutorial',
    duration: '12:30',
    views: 5432,
    thumbnail: '🎬',
  },
]

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [helpfulArticles, setHelpfulArticles] = useState<Set<string>>(new Set())
  const [notHelpfulArticles, setNotHelpfulArticles] = useState<Set<string>>(new Set())
  const [contactFormOpen, setContactFormOpen] = useState(false)

  // Search and filter articles
  const filteredArticles = useMemo(() => {
    let filtered = articles

    if (selectedCategory) {
      filtered = filtered.filter((article) => article.categoryId === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.summary.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  const popularArticles = useMemo(() => {
    return [...articles].sort((a, b) => b.views - a.views).slice(0, 6)
  }, [])

  const recentArticles = useMemo(() => {
    return [...articles].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()).slice(0, 6)
  }, [])

  const featuredArticles = useMemo(() => {
    return articles.filter((article) => article.featured)
  }, [])

  const handleHelpful = (articleId: string, helpful: boolean) => {
    if (helpful) {
      setHelpfulArticles((prev) => new Set(prev).add(articleId))
      setNotHelpfulArticles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(articleId)
        return newSet
      })
    } else {
      setNotHelpfulArticles((prev) => new Set(prev).add(articleId))
      setHelpfulArticles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(articleId)
        return newSet
      })
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-3">
            <Book className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Help Center</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers, learn new skills, and get the most out of our platform
          </p>

          {/* Search Bar */}
          <Card className="glass p-2 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for help articles, guides, and tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg border-0 bg-transparent"
              />
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {articles.length} articles
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              {videoTutorials.length} videos
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              {faqs.length} FAQs
            </div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        {!searchQuery && !selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Browse by Category</h2>
              <Badge variant="secondary">{categories.length} categories</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card
                    className="glass cursor-pointer h-full transition-all duration-300 hover:border-primary/50"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <category.icon className={cn('w-8 h-8', category.color)} />
                        <Badge variant="secondary">{category.articleCount}</Badge>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      <div className="flex items-center text-sm text-primary">
                        View articles <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Featured Articles */}
        {!searchQuery && !selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">Featured Articles</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  index={index}
                  onClick={() => setSelectedArticle(article)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Popular & Recent Articles Tabs */}
        {!searchQuery && !selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs defaultValue="popular" className="space-y-6">
              <TabsList className="glass">
                <TabsTrigger value="popular">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Popular Articles
                </TabsTrigger>
                <TabsTrigger value="recent">
                  <Clock className="w-4 h-4 mr-2" />
                  Recently Updated
                </TabsTrigger>
              </TabsList>

              <TabsContent value="popular" className="space-y-3">
                {popularArticles.map((article, index) => (
                  <ArticleListItem
                    key={article.id}
                    article={article}
                    index={index}
                    onClick={() => setSelectedArticle(article)}
                  />
                ))}
              </TabsContent>

              <TabsContent value="recent" className="space-y-3">
                {recentArticles.map((article, index) => (
                  <ArticleListItem
                    key={article.id}
                    article={article}
                    index={index}
                    onClick={() => setSelectedArticle(article)}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* Video Tutorials */}
        {!searchQuery && !selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <Video className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Video Tutorials</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {videoTutorials.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="glass cursor-pointer overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-6xl">
                      {video.thumbnail}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          {video.duration}
                        </div>
                        <div>{video.views.toLocaleString()} views</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* FAQs */}
        {!searchQuery && !selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>

            <Card className="glass">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border-border/50">
                    <AccordionTrigger className="px-6 hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <Badge variant="outline" className="shrink-0">
                          {faq.category}
                        </Badge>
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </motion.div>
        )}

        {/* Search Results */}
        {(searchQuery || selectedCategory) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedCategory
                    ? categories.find((c) => c.id === selectedCategory)?.name
                    : 'Search Results'}
                </h2>
                <p className="text-muted-foreground">{filteredArticles.length} articles found</p>
              </div>
              {selectedCategory && (
                <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                  Clear Filter
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {filteredArticles.map((article, index) => (
                <ArticleListItem
                  key={article.id}
                  article={article}
                  index={index}
                  onClick={() => setSelectedArticle(article)}
                />
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <Card className="glass p-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or browse our categories
                </p>
                <Button onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}>
                  Browse All Categories
                </Button>
              </Card>
            )}
          </motion.div>
        )}

        {/* Contact Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-dark p-8 text-center">
            <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setContactFormOpen(true)}>
                <Send className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Email Us
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Article Detail Dialog */}
        <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
          <DialogContent className="glass-overlay max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedArticle && (
              <div className="space-y-6">
                <DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <DialogTitle className="text-2xl pr-8">{selectedArticle.title}</DialogTitle>
                      <Button variant="ghost" size="icon">
                        <Bookmark className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedArticle.readTime} min read
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {selectedArticle.views.toLocaleString()} views
                      </div>
                      <div>Updated {selectedArticle.lastUpdated}</div>
                    </div>
                  </div>
                </DialogHeader>

                <DialogDescription className="text-base leading-relaxed">
                  {selectedArticle.summary}
                </DialogDescription>

                {selectedArticle.videoUrl && (
                  <Card className="glass p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">Video Tutorial Available</div>
                        <div className="text-sm text-muted-foreground">Watch a step-by-step guide</div>
                      </div>
                      <Button>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Watch
                      </Button>
                    </div>
                  </Card>
                )}

                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground/90 leading-relaxed">
                    {selectedArticle.content}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="text-center">
                    <p className="font-semibold mb-3">Was this article helpful?</p>
                    <div className="flex justify-center gap-3">
                      <Button
                        variant={helpfulArticles.has(selectedArticle.id) ? 'default' : 'outline'}
                        onClick={() => handleHelpful(selectedArticle.id, true)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Yes ({selectedArticle.helpful + (helpfulArticles.has(selectedArticle.id) ? 1 : 0)})
                      </Button>
                      <Button
                        variant={notHelpfulArticles.has(selectedArticle.id) ? 'default' : 'outline'}
                        onClick={() => handleHelpful(selectedArticle.id, false)}
                      >
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        No ({selectedArticle.notHelpful + (notHelpfulArticles.has(selectedArticle.id) ? 1 : 0)})
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Contact Form Dialog */}
        <Dialog open={contactFormOpen} onOpenChange={setContactFormOpen}>
          <DialogContent className="glass-overlay">
            <DialogHeader>
              <DialogTitle>Contact Support</DialogTitle>
              <DialogDescription>
                Fill out the form below and we'll get back to you within 24 hours.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input placeholder="What do you need help with?" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea placeholder="Describe your issue in detail..." rows={6} />
              </div>
              <Button className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Article Card Component
function ArticleCard({ article, index, onClick }: { article: Article; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="glass cursor-pointer h-full" onClick={onClick}>
        <div className="p-6 space-y-4">
          {article.featured && (
            <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          <h3 className="font-semibold text-lg line-clamp-2">{article.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} min
            </div>
            <div>{article.views.toLocaleString()} views</div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Article List Item Component
function ArticleListItem({ article, index, onClick }: { article: Article; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card className="glass cursor-pointer transition-all duration-300 hover:border-primary/50" onClick={onClick}>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">{article.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{article.summary}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime} min read
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {article.views.toLocaleString()} views
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

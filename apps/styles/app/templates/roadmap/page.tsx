'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  Download,
  Bell,
  ThumbsUp,
  MessageSquare,
  Tag,
  Users,
  Sparkles,
  XCircle,
  Circle,
  BarChart3,
  Star,
  ArrowUpRight
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// Types
type FeatureStatus = 'shipped' | 'in-progress' | 'planned' | 'cancelled'
type FeatureCategory = 'feature' | 'improvement' | 'bugfix' | 'security' | 'performance'

interface Feature {
  id: string
  title: string
  description: string
  status: FeatureStatus
  category: FeatureCategory
  quarter: string
  year: number
  votes: number
  comments: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
  progress?: number
  eta?: string
  assignee?: string
  relatedFeatures?: string[]
}

// Mock data - 50+ features across multiple quarters
const roadmapFeatures: Feature[] = [
  // Q1 2024 - Shipped
  {
    id: 'f1',
    title: 'Dark Mode Support',
    description: 'Full dark mode theme across the entire application with auto-detection based on system preferences.',
    status: 'shipped',
    category: 'feature',
    quarter: 'Q1',
    year: 2024,
    votes: 342,
    comments: 45,
    priority: 'high',
    tags: ['UI', 'Accessibility', 'Design'],
    progress: 100,
  },
  {
    id: 'f2',
    title: 'Advanced Search Filters',
    description: 'Multi-criteria search with filters, saved searches, and instant results.',
    status: 'shipped',
    category: 'feature',
    quarter: 'Q1',
    year: 2024,
    votes: 289,
    comments: 32,
    priority: 'high',
    tags: ['Search', 'UX'],
    progress: 100,
  },
  {
    id: 'f3',
    title: 'Real-time Collaboration',
    description: 'Live cursor tracking, presence indicators, and simultaneous editing capabilities.',
    status: 'shipped',
    category: 'feature',
    quarter: 'Q1',
    year: 2024,
    votes: 512,
    comments: 78,
    priority: 'critical',
    tags: ['Collaboration', 'Real-time'],
    progress: 100,
  },
  {
    id: 'f4',
    title: 'API Rate Limit Optimization',
    description: 'Improved rate limiting with better caching and request batching.',
    status: 'shipped',
    category: 'performance',
    quarter: 'Q1',
    year: 2024,
    votes: 156,
    comments: 23,
    priority: 'medium',
    tags: ['API', 'Performance'],
    progress: 100,
  },
  {
    id: 'f5',
    title: 'Mobile App Beta',
    description: 'Native mobile applications for iOS and Android with feature parity to web.',
    status: 'shipped',
    category: 'feature',
    quarter: 'Q1',
    year: 2024,
    votes: 823,
    comments: 156,
    priority: 'critical',
    tags: ['Mobile', 'iOS', 'Android'],
    progress: 100,
  },
  // Q2 2024 - In Progress
  {
    id: 'f6',
    title: 'Advanced Analytics Dashboard',
    description: 'Comprehensive analytics with custom reports, data visualization, and export capabilities.',
    status: 'in-progress',
    category: 'feature',
    quarter: 'Q2',
    year: 2024,
    votes: 445,
    comments: 67,
    priority: 'high',
    tags: ['Analytics', 'Dashboard', 'Reports'],
    progress: 75,
    eta: 'June 2024',
  },
  {
    id: 'f7',
    title: 'Two-Factor Authentication',
    description: 'Enhanced security with 2FA via authenticator apps, SMS, and backup codes.',
    status: 'in-progress',
    category: 'security',
    quarter: 'Q2',
    year: 2024,
    votes: 678,
    comments: 89,
    priority: 'critical',
    tags: ['Security', 'Authentication'],
    progress: 60,
    eta: 'May 2024',
  },
  {
    id: 'f8',
    title: 'Workflow Automation',
    description: 'Create custom workflows with triggers, actions, and conditions.',
    status: 'in-progress',
    category: 'feature',
    quarter: 'Q2',
    year: 2024,
    votes: 534,
    comments: 92,
    priority: 'high',
    tags: ['Automation', 'Workflows'],
    progress: 45,
    eta: 'June 2024',
  },
  {
    id: 'f9',
    title: 'Performance Monitoring',
    description: 'Real-time performance metrics, error tracking, and alerting system.',
    status: 'in-progress',
    category: 'performance',
    quarter: 'Q2',
    year: 2024,
    votes: 312,
    comments: 43,
    priority: 'medium',
    tags: ['Monitoring', 'Performance'],
    progress: 30,
    eta: 'July 2024',
  },
  {
    id: 'f10',
    title: 'Custom Themes',
    description: 'Create and share custom color themes with the community.',
    status: 'in-progress',
    category: 'feature',
    quarter: 'Q2',
    year: 2024,
    votes: 267,
    comments: 54,
    priority: 'medium',
    tags: ['UI', 'Customization'],
    progress: 85,
    eta: 'May 2024',
  },
  {
    id: 'f11',
    title: 'AI-Powered Suggestions',
    description: 'Smart content suggestions using machine learning and natural language processing.',
    status: 'in-progress',
    category: 'feature',
    quarter: 'Q2',
    year: 2024,
    votes: 892,
    comments: 134,
    priority: 'high',
    tags: ['AI', 'Machine Learning'],
    progress: 55,
    eta: 'June 2024',
  },
  // Q3 2024 - Planned
  {
    id: 'f12',
    title: 'Offline Mode',
    description: 'Full offline functionality with automatic sync when connection is restored.',
    status: 'planned',
    category: 'feature',
    quarter: 'Q3',
    year: 2024,
    votes: 723,
    comments: 98,
    priority: 'high',
    tags: ['Offline', 'Sync', 'Mobile'],
  },
  {
    id: 'f13',
    title: 'Video Conferencing Integration',
    description: 'Built-in video calls with screen sharing and recording capabilities.',
    status: 'planned',
    category: 'feature',
    quarter: 'Q3',
    year: 2024,
    votes: 456,
    comments: 67,
    priority: 'medium',
    tags: ['Video', 'Communication'],
  },
  {
    id: 'f14',
    title: 'Advanced Permissions System',
    description: 'Granular permissions with custom roles, resource-level access control.',
    status: 'planned',
    category: 'security',
    quarter: 'Q3',
    year: 2024,
    votes: 589,
    comments: 76,
    priority: 'high',
    tags: ['Security', 'Permissions'],
  },
  {
    id: 'f15',
    title: 'GraphQL API',
    description: 'New GraphQL endpoint alongside REST API for flexible data querying.',
    status: 'planned',
    category: 'feature',
    quarter: 'Q3',
    year: 2024,
    votes: 412,
    comments: 54,
    priority: 'medium',
    tags: ['API', 'GraphQL'],
  },
  {
    id: 'f16',
    title: 'Internationalization',
    description: 'Support for 20+ languages with automatic translation and RTL layout.',
    status: 'planned',
    category: 'feature',
    quarter: 'Q3',
    year: 2024,
    votes: 634,
    comments: 87,
    priority: 'high',
    tags: ['i18n', 'Localization'],
  },
  {
    id: 'f17',
    title: 'Smart Notifications',
    description: 'Intelligent notification system with priority levels and custom schedules.',
    status: 'planned',
    category: 'improvement',
    quarter: 'Q3',
    year: 2024,
    votes: 345,
    comments: 45,
    priority: 'medium',
    tags: ['Notifications', 'UX'],
  },
  {
    id: 'f18',
    title: 'Database Performance Upgrades',
    description: 'Query optimization, indexing improvements, and caching layer enhancements.',
    status: 'planned',
    category: 'performance',
    quarter: 'Q3',
    year: 2024,
    votes: 278,
    comments: 32,
    priority: 'high',
    tags: ['Database', 'Performance'],
  },
  // Q4 2024 - Planned
  {
    id: 'f19',
    title: 'White Label Solution',
    description: 'Complete white-labeling with custom branding, domains, and configurations.',
    status: 'planned',
    category: 'feature',
    quarter: 'Q4',
    year: 2024,
    votes: 512,
    comments: 71,
    priority: 'high',
    tags: ['Enterprise', 'Branding'],
  },
  {
    id: 'f20',
    title: 'Advanced Import/Export',
    description: 'Support for multiple file formats with data mapping and validation.',
    status: 'planned',
    category: 'feature',
    quarter: 'Q4',
    year: 2024,
    votes: 389,
    comments: 52,
    priority: 'medium',
    tags: ['Data', 'Import', 'Export'],
  },
  {
    id: 'f21',
    title: 'Compliance Dashboard',
    description: 'GDPR, HIPAA, SOC2 compliance tools with audit logs and reporting.',
    status: 'planned',
    category: 'security',
    quarter: 'Q4',
    year: 2024,
    votes: 445,
    comments: 63,
    priority: 'high',
    tags: ['Compliance', 'Security'],
  },
  {
    id: 'f22',
    title: 'AI Content Moderation',
    description: 'Automated content moderation using AI with manual review workflows.',
    status: 'planned',
    category: 'feature',
    quarter: 'Q4',
    year: 2024,
    votes: 567,
    comments: 78,
    priority: 'medium',
    tags: ['AI', 'Moderation'],
  },
  {
    id: 'f23',
    title: 'Marketplace',
    description: 'Plugin marketplace for third-party integrations and extensions.',
    status: 'planned',
    category: 'feature',
    quarter: 'Q4',
    year: 2024,
    votes: 823,
    comments: 145,
    priority: 'high',
    tags: ['Marketplace', 'Integrations'],
  },
  {
    id: 'f24',
    title: 'Advanced File Storage',
    description: 'CDN integration, versioning, and unlimited storage for enterprise plans.',
    status: 'planned',
    category: 'feature',
    quarter: 'Q4',
    year: 2024,
    votes: 412,
    comments: 58,
    priority: 'medium',
    tags: ['Storage', 'CDN'],
  },
  // Q1 2025 - Planned
  {
    id: 'f25',
    title: 'Blockchain Integration',
    description: 'Web3 features with wallet connection and NFT support.',
    status: 'planned',
    category: 'feature',
    quarter: 'Q1',
    year: 2025,
    votes: 678,
    comments: 112,
    priority: 'low',
    tags: ['Web3', 'Blockchain'],
  },
  {
    id: 'f26',
    title: 'Voice Commands',
    description: 'Hands-free operation with natural language voice interface.',
    status: 'planned',
    category: 'feature',
    quarter: 'Q1',
    year: 2025,
    votes: 534,
    comments: 89,
    priority: 'low',
    tags: ['Voice', 'Accessibility'],
  },
  {
    id: 'f27',
    title: 'Advanced Testing Tools',
    description: 'Built-in A/B testing, feature flags, and experiment management.',
    status: 'planned',
    category: 'feature',
    quarter: 'Q1',
    year: 2025,
    votes: 389,
    comments: 54,
    priority: 'medium',
    tags: ['Testing', 'Experiments'],
  },
  {
    id: 'f28',
    title: 'Desktop App',
    description: 'Native desktop applications for Windows, macOS, and Linux.',
    status: 'planned',
    category: 'feature',
    quarter: 'Q1',
    year: 2025,
    votes: 756,
    comments: 98,
    priority: 'medium',
    tags: ['Desktop', 'Native'],
  },
  // Cancelled
  {
    id: 'f29',
    title: 'Bitcoin Payments',
    description: 'Direct cryptocurrency payment option (replaced by standard payment processor).',
    status: 'cancelled',
    category: 'feature',
    quarter: 'Q2',
    year: 2024,
    votes: 234,
    comments: 67,
    priority: 'low',
    tags: ['Payments', 'Crypto'],
  },
  {
    id: 'f30',
    title: 'Legacy Browser Support',
    description: 'IE11 compatibility (discontinued due to low usage).',
    status: 'cancelled',
    category: 'improvement',
    quarter: 'Q1',
    year: 2024,
    votes: 89,
    comments: 23,
    priority: 'low',
    tags: ['Browser', 'Compatibility'],
  },
]

const statusConfig = {
  shipped: {
    label: 'Shipped',
    icon: CheckCircle2,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  },
  'in-progress': {
    label: 'In Progress',
    icon: Clock,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  planned: {
    label: 'Planned',
    icon: Circle,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
  },
}

const categoryConfig = {
  feature: { label: 'Feature', color: 'text-blue-400' },
  improvement: { label: 'Improvement', color: 'text-green-400' },
  bugfix: { label: 'Bug Fix', color: 'text-red-400' },
  security: { label: 'Security', color: 'text-purple-400' },
  performance: { label: 'Performance', color: 'text-orange-400' },
}

export default function RoadmapPage() {
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline')
  const [selectedStatus, setSelectedStatus] = useState<FeatureStatus | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [votedFeatures, setVotedFeatures] = useState<Set<string>>(new Set())

  // Filter and search logic
  const filteredFeatures = useMemo(() => {
    return roadmapFeatures.filter((feature) => {
      const matchesStatus = selectedStatus === 'all' || feature.status === selectedStatus
      const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory
      const matchesSearch =
        searchQuery === '' ||
        feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesStatus && matchesCategory && matchesSearch
    })
  }, [selectedStatus, selectedCategory, searchQuery])

  // Group by quarter
  const groupedByQuarter = useMemo(() => {
    const groups: Record<string, Feature[]> = {}
    filteredFeatures.forEach((feature) => {
      const key = `${feature.quarter} ${feature.year}`
      if (!groups[key]) groups[key] = []
      groups[key].push(feature)
    })
    return groups
  }, [filteredFeatures])

  const handleVote = (featureId: string) => {
    setVotedFeatures((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(featureId)) {
        newSet.delete(featureId)
      } else {
        newSet.add(featureId)
      }
      return newSet
    })
  }

  const quarterOrder = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025']

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Product Roadmap</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what we're building, vote on features, and shape the future of our platform
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
            { label: 'Shipped', value: roadmapFeatures.filter((f) => f.status === 'shipped').length, icon: CheckCircle2, color: 'text-green-500' },
            { label: 'In Progress', value: roadmapFeatures.filter((f) => f.status === 'in-progress').length, icon: Clock, color: 'text-blue-500' },
            { label: 'Planned', value: roadmapFeatures.filter((f) => f.status === 'planned').length, icon: Circle, color: 'text-purple-500' },
            { label: 'Total Votes', value: roadmapFeatures.reduce((sum, f) => sum + f.votes, 0), icon: ThumbsUp, color: 'text-primary' },
          ].map((stat, index) => (
            <Card key={index} className="glass p-6">
              <div className="flex items-center gap-3">
                <stat.icon className={cn('w-8 h-8', stat.color)} />
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="feature">Features</SelectItem>
                  <SelectItem value="improvement">Improvements</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* View Mode Toggle */}
        <div className="flex justify-center">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
            <TabsList>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div className="space-y-12">
            {quarterOrder.map((quarter, qIndex) => {
              const features = groupedByQuarter[quarter] || []
              if (features.length === 0) return null

              return (
                <motion.div
                  key={quarter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qIndex * 0.1 }}
                  className="space-y-6"
                >
                  {/* Quarter Header */}
                  <div className="sticky top-4 z-10">
                    <Card className="glass-overlay p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-6 h-6 text-primary" />
                          <h2 className="text-2xl font-bold">{quarter}</h2>
                          <Badge variant="secondary">{features.length} features</Badge>
                        </div>
                        <div className="flex gap-2">
                          {['shipped', 'in-progress', 'planned', 'cancelled'].map((status) => {
                            const count = features.filter((f) => f.status === status).length
                            if (count === 0) return null
                            const config = statusConfig[status as FeatureStatus]
                            return (
                              <Badge key={status} variant="outline" className={cn(config.bg, config.border)}>
                                <config.icon className={cn('w-3 h-3 mr-1', config.color)} />
                                {count}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Features Grid */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                      <FeatureCard
                        key={feature.id}
                        feature={feature}
                        index={index}
                        isVoted={votedFeatures.has(feature.id)}
                        onVote={handleVote}
                        onClick={() => setSelectedFeature(feature)}
                      />
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {filteredFeatures.map((feature, index) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                index={index}
                isVoted={votedFeatures.has(feature.id)}
                onVote={handleVote}
                onClick={() => setSelectedFeature(feature)}
                listView
              />
            ))}
          </motion.div>
        )}

        {/* Feature Detail Modal */}
        <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
          <DialogContent className="glass-overlay max-w-3xl max-h-[80vh] overflow-y-auto">
            {selectedFeature && (
              <>
                <DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <DialogTitle className="text-2xl">{selectedFeature.title}</DialogTitle>
                      <Badge className={cn(statusConfig[selectedFeature.status].bg, statusConfig[selectedFeature.status].border)}>
                        {statusConfig[selectedFeature.status].label}
                      </Badge>
                    </div>
                    <DialogDescription className="text-base">
                      {selectedFeature.description}
                    </DialogDescription>
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Meta Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Quarter</div>
                      <div className="font-semibold">{selectedFeature.quarter} {selectedFeature.year}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Category</div>
                      <div className="font-semibold">{categoryConfig[selectedFeature.category].label}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Priority</div>
                      <Badge variant="outline" className="capitalize">{selectedFeature.priority}</Badge>
                    </div>
                    {selectedFeature.eta && (
                      <div>
                        <div className="text-sm text-muted-foreground">ETA</div>
                        <div className="font-semibold">{selectedFeature.eta}</div>
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  {selectedFeature.progress !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="text-muted-foreground">{selectedFeature.progress}%</span>
                      </div>
                      <Progress value={selectedFeature.progress} className="h-2" />
                    </div>
                  )}

                  <Separator />

                  {/* Tags */}
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeature.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Engagement */}
                  <div className="flex items-center gap-6">
                    <Button
                      variant={votedFeatures.has(selectedFeature.id) ? 'default' : 'outline'}
                      onClick={() => handleVote(selectedFeature.id)}
                      className="gap-2"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {selectedFeature.votes + (votedFeatures.has(selectedFeature.id) ? 1 : 0)} votes
                    </Button>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageSquare className="w-4 h-4" />
                      {selectedFeature.comments} comments
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Feature Card Component
interface FeatureCardProps {
  feature: Feature
  index: number
  isVoted: boolean
  onVote: (id: string) => void
  onClick: () => void
  listView?: boolean
}

function FeatureCard({ feature, index, isVoted, onVote, onClick, listView }: FeatureCardProps) {
  const config = statusConfig[feature.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: listView ? 1.01 : 1.02 }}
    >
      <Card
        className={cn(
          'glass cursor-pointer h-full transition-all duration-300 hover:border-primary/50',
          config.border
        )}
        onClick={onClick}
      >
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg line-clamp-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{feature.description}</p>
            </div>
            <config.icon className={cn('w-5 h-5 flex-shrink-0', config.color)} />
          </div>

          {/* Progress Bar */}
          {feature.progress !== undefined && feature.status === 'in-progress' && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{feature.progress}%</span>
              </div>
              <Progress value={feature.progress} className="h-1.5" />
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {feature.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {feature.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{feature.tags.length - 3}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onVote(feature.id)
                }}
                className={cn(
                  'flex items-center gap-1.5 hover:text-primary transition-colors',
                  isVoted && 'text-primary'
                )}
              >
                <ThumbsUp className={cn('w-4 h-4', isVoted && 'fill-current')} />
                {feature.votes + (isVoted ? 1 : 0)}
              </button>
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                {feature.comments}
              </div>
            </div>
            <Badge variant="outline" className={cn('text-xs', categoryConfig[feature.category].color)}>
              {categoryConfig[feature.category].label}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

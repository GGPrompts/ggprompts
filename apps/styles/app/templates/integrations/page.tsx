'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Slack,
  Mail,
  Github,
  Chrome,
  Database,
  Cloud,
  MessageSquare,
  Calendar,
  FileText,
  Video,
  Lock,
  CreditCard,
  Package,
  TrendingUp,
  Users,
  Zap,
  Code,
  Globe,
  Smartphone,
  ShoppingCart,
  BarChart,
  Settings,
  Plus,
  Check,
  ArrowRight,
  ExternalLink,
  Star,
  Sparkles,
  Clock,
  Filter,
  X
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// Integrations data
const integrations = [
  {
    id: 'slack',
    name: 'Slack',
    icon: MessageSquare,
    category: 'Communication',
    description: 'Get real-time notifications in your Slack channels',
    rating: 4.8,
    installs: '50K+',
    popular: true,
    features: ['Instant notifications', 'Custom channels', 'Bot commands', 'Thread support'],
    setupTime: '2 min',
    verified: true
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    category: 'Development',
    description: 'Sync code repositories and track deployments',
    rating: 4.9,
    installs: '75K+',
    popular: true,
    features: ['Auto-sync repos', 'PR integration', 'Issue tracking', 'Webhooks'],
    setupTime: '3 min',
    verified: true
  },
  {
    id: 'gmail',
    name: 'Gmail',
    icon: Mail,
    category: 'Communication',
    description: 'Send and receive emails directly from the platform',
    rating: 4.7,
    installs: '100K+',
    popular: true,
    features: ['Email automation', 'Template system', 'Tracking', 'Scheduling'],
    setupTime: '2 min',
    verified: true
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    icon: Cloud,
    category: 'Storage',
    description: 'Sync and backup files to Google Drive',
    rating: 4.6,
    installs: '90K+',
    popular: true,
    features: ['Auto-backup', 'File sync', 'Shared folders', 'Version control'],
    setupTime: '2 min',
    verified: true
  },
  {
    id: 'zoom',
    name: 'Zoom',
    icon: Video,
    category: 'Communication',
    description: 'Schedule and join meetings with one click',
    rating: 4.5,
    installs: '60K+',
    features: ['Meeting scheduler', 'Auto-join', 'Recording', 'Calendar sync'],
    setupTime: '3 min',
    verified: true
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: CreditCard,
    category: 'Payment',
    description: 'Accept payments and manage subscriptions',
    rating: 4.9,
    installs: '85K+',
    popular: true,
    features: ['Payment processing', 'Subscription mgmt', 'Invoicing', 'Analytics'],
    setupTime: '5 min',
    verified: true
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    icon: BarChart,
    category: 'Analytics',
    description: 'Track user behavior and conversion metrics',
    rating: 4.6,
    installs: '70K+',
    features: ['Event tracking', 'Custom reports', 'Real-time data', 'Goals'],
    setupTime: '3 min',
    verified: true
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: ShoppingCart,
    category: 'E-commerce',
    description: 'Sync products and orders from your store',
    rating: 4.7,
    installs: '45K+',
    features: ['Product sync', 'Order management', 'Inventory', 'Analytics'],
    setupTime: '4 min',
    verified: true
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    icon: TrendingUp,
    category: 'CRM',
    description: 'Sync contacts, leads, and opportunities',
    rating: 4.8,
    installs: '55K+',
    features: ['Contact sync', 'Lead tracking', 'Pipeline mgmt', 'Reporting'],
    setupTime: '5 min',
    verified: true
  },
  {
    id: 'jira',
    name: 'Jira',
    icon: Package,
    category: 'Project Management',
    description: 'Track issues and manage sprints',
    rating: 4.5,
    installs: '65K+',
    features: ['Issue sync', 'Sprint planning', 'Board views', 'Automation'],
    setupTime: '4 min',
    verified: true
  },
  {
    id: 'trello',
    name: 'Trello',
    icon: Package,
    category: 'Project Management',
    description: 'Sync boards and cards automatically',
    rating: 4.6,
    installs: '50K+',
    features: ['Board sync', 'Card automation', 'Checklists', 'Power-ups'],
    setupTime: '2 min',
    verified: true
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: FileText,
    category: 'Productivity',
    description: 'Import and export data to Notion databases',
    rating: 4.7,
    installs: '40K+',
    features: ['Database sync', 'Page creation', 'Templates', 'Exports'],
    setupTime: '3 min',
    verified: true
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    icon: Calendar,
    category: 'Productivity',
    description: 'Sync events and schedule meetings',
    rating: 4.8,
    installs: '80K+',
    features: ['Event sync', 'Meeting scheduler', 'Reminders', 'Availability'],
    setupTime: '2 min',
    verified: true
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: Cloud,
    category: 'Storage',
    description: 'Cloud storage and file synchronization',
    rating: 4.5,
    installs: '55K+',
    features: ['File sync', 'Sharing', 'Backups', 'Team folders'],
    setupTime: '3 min',
    verified: true
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    icon: Users,
    category: 'Support',
    description: 'Customer support ticket integration',
    rating: 4.6,
    installs: '35K+',
    features: ['Ticket sync', 'Auto-responses', 'SLA tracking', 'Analytics'],
    setupTime: '4 min',
    verified: true
  },
  {
    id: 'intercom',
    name: 'Intercom',
    icon: MessageSquare,
    category: 'Support',
    description: 'Live chat and customer messaging',
    rating: 4.7,
    installs: '42K+',
    features: ['Live chat', 'Bot automation', 'User segmentation', 'Analytics'],
    setupTime: '3 min',
    verified: true
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    icon: TrendingUp,
    category: 'CRM',
    description: 'Marketing automation and CRM',
    rating: 4.8,
    installs: '48K+',
    features: ['Contact sync', 'Email campaigns', 'Workflows', 'Analytics'],
    setupTime: '5 min',
    verified: true
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    icon: Mail,
    category: 'Marketing',
    description: 'Email marketing and automation',
    rating: 4.5,
    installs: '52K+',
    features: ['List sync', 'Campaigns', 'Automation', 'Analytics'],
    setupTime: '3 min',
    verified: true
  },
  {
    id: 'twilio',
    name: 'Twilio',
    icon: Smartphone,
    category: 'Communication',
    description: 'SMS and voice communication',
    rating: 4.7,
    installs: '38K+',
    features: ['SMS sending', 'Voice calls', 'WhatsApp', 'Verification'],
    setupTime: '4 min',
    verified: true
  },
  {
    id: 'zapier',
    name: 'Zapier',
    icon: Zap,
    category: 'Automation',
    description: 'Connect with 5000+ apps',
    rating: 4.9,
    installs: '95K+',
    popular: true,
    features: ['Multi-step zaps', 'Filters', 'Delays', '5000+ apps'],
    setupTime: '2 min',
    verified: true
  },
  {
    id: 'aws',
    name: 'AWS',
    icon: Cloud,
    category: 'Infrastructure',
    description: 'Deploy and manage cloud resources',
    rating: 4.6,
    installs: '30K+',
    features: ['S3 storage', 'Lambda functions', 'RDS', 'CloudWatch'],
    setupTime: '10 min',
    verified: true
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: Database,
    category: 'Database',
    description: 'Connect to PostgreSQL databases',
    rating: 4.8,
    installs: '25K+',
    features: ['Direct queries', 'Backups', 'Migrations', 'Monitoring'],
    setupTime: '5 min',
    verified: true
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    icon: Database,
    category: 'Database',
    description: 'NoSQL database integration',
    rating: 4.7,
    installs: '28K+',
    features: ['Collections', 'Aggregations', 'Atlas cloud', 'Monitoring'],
    setupTime: '5 min',
    verified: true
  },
  {
    id: 'figma',
    name: 'Figma',
    icon: Chrome,
    category: 'Design',
    description: 'Design collaboration and handoff',
    rating: 4.8,
    installs: '32K+',
    features: ['File import', 'Version tracking', 'Comments', 'Prototypes'],
    setupTime: '3 min',
    verified: true
  },
  {
    id: 'vercel',
    name: 'Vercel',
    icon: Globe,
    category: 'Development',
    description: 'Deploy and host web applications',
    rating: 4.9,
    installs: '40K+',
    features: ['Auto-deploy', 'Preview URLs', 'Analytics', 'Edge functions'],
    setupTime: '3 min',
    verified: true
  }
]

// Coming soon integrations
const comingSoon = [
  { name: 'Linear', icon: Package, category: 'Project Management' },
  { name: 'Discord', icon: MessageSquare, category: 'Communication' },
  { name: 'Telegram', icon: MessageSquare, category: 'Communication' },
  { name: 'Airtable', icon: Database, category: 'Database' },
  { name: 'Microsoft Teams', icon: Users, category: 'Communication' },
  { name: 'Asana', icon: Package, category: 'Project Management' },
]

const categories = ['All', 'Popular', 'Communication', 'Development', 'Storage', 'Analytics', 'CRM', 'Project Management']

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedIntegration, setSelectedIntegration] = useState<typeof integrations[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' ||
                           (selectedCategory === 'Popular' && integration.popular) ||
                           integration.category === selectedCategory
    const matchesVerified = !verifiedOnly || integration.verified

    return matchesSearch && matchesCategory && matchesVerified
  })

  const handleIntegrationClick = (integration: typeof integrations[0]) => {
    setSelectedIntegration(integration)
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
            200+ Integrations
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Connect everything you use
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Seamlessly integrate with your favorite tools and services.
            No code required, setup in minutes.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-2xl mx-auto mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass border-border/30 pl-12 pr-12 h-14 text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { value: '200+', label: 'Integrations' },
            { value: '2 min', label: 'Avg Setup Time' },
            { value: '99.9%', label: 'Uptime' },
            { value: '24/7', label: 'Sync' }
          ].map((stat, idx) => (
            <Card key={idx} className="glass border-border/30 p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Category Tabs & Filters */}
      <section className="container mx-auto px-4 py-8 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1">
            <TabsList className="glass border-border/30 w-full max-w-5xl h-auto p-1 flex flex-wrap">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex-1 min-w-[100px]"
                >
                  {category}
                  {category === 'Popular' && (
                    <Sparkles className="w-3 h-3 ml-1" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Card className="glass border-border/30 p-4 mt-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={verifiedOnly}
                      onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
                    />
                    <Label htmlFor="verified" className="text-sm cursor-pointer">
                      Verified only
                    </Label>
                  </div>
                  <Badge variant="outline" className="border-primary/30">
                    {filteredIntegrations.length} results
                  </Badge>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Popular Integrations Highlight */}
      {selectedCategory === 'All' && !searchQuery && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">Most Popular</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {integrations.filter(i => i.popular).slice(0, 4).map((integration, idx) => {
              const Icon = integration.icon
              return (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <Card
                    className="glass border-primary/30 p-6 cursor-pointer hover:border-primary/50 transition-all group"
                    onClick={() => handleIntegrationClick(integration)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs border-primary/30">
                        Popular
                      </Badge>
                    </div>
                    <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {integration.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-primary fill-primary mr-1" />
                        {integration.rating}
                      </div>
                      <span>•</span>
                      <span>{integration.installs} installs</span>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* All Integrations Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {selectedCategory === 'All' ? 'All Integrations' : selectedCategory}
          </h2>
          <Button variant="outline" onClick={() => setIsRequestDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Request Integration
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + searchQuery}
            className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredIntegrations.map((integration, idx) => {
              const Icon = integration.icon
              return (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.03, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className="glass border-border/30 p-5 cursor-pointer hover:border-primary/30 transition-all group h-full flex flex-col"
                      onClick={() => handleIntegrationClick(integration)}
                    >
                      {/* Icon & Badge */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        {integration.verified && (
                          <Badge variant="outline" className="text-[10px] border-primary/30 h-5">
                            ✓
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <h3 className="font-bold mb-1 text-sm group-hover:text-primary transition-colors">
                        {integration.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-grow">
                        {integration.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/20">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-primary fill-primary mr-1" />
                          {integration.rating}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {integration.setupTime}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* No Results */}
        {filteredIntegrations.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No integrations found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setVerifiedOnly(false); }}>
              Clear filters
            </Button>
          </motion.div>
        )}
      </section>

      {/* Coming Soon Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Coming Soon</h2>
        </div>
        <div className="grid md:grid-cols-6 gap-4">
          {comingSoon.map((integration, idx) => {
            const Icon = integration.icon
            return (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className="glass-dark border-border/20 p-4 text-center opacity-60">
                  <div className="w-8 h-8 rounded-lg bg-muted/20 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <h4 className="text-sm font-medium">{integration.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{integration.category}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* API Documentation CTA */}
      <section className="container mx-auto px-4 py-12">
        <Card className="glass border-primary/30 p-8 text-center max-w-3xl mx-auto">
          <Code className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Build Custom Integrations</h2>
          <p className="text-muted-foreground mb-6">
            Use our REST API and webhooks to build custom integrations tailored to your needs
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button>
              View API Docs
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline">
              Get API Key
            </Button>
          </div>
        </Card>
      </section>

      {/* Integration Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-overlay border-border/30 max-w-2xl">
          {selectedIntegration && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <selectedIntegration.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <DialogTitle className="text-2xl">{selectedIntegration.name}</DialogTitle>
                      {selectedIntegration.verified && (
                        <Badge variant="outline" className="border-primary/30">
                          ✓ Verified
                        </Badge>
                      )}
                      {selectedIntegration.popular && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-primary fill-primary mr-1" />
                        {selectedIntegration.rating} rating
                      </div>
                      <span>•</span>
                      <span>{selectedIntegration.installs} installs</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedIntegration.setupTime} setup
                      </div>
                    </div>
                  </div>
                </div>
                <DialogDescription className="text-base">
                  {selectedIntegration.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Category */}
                <div>
                  <Badge variant="outline" className="border-border/30">
                    {selectedIntegration.category}
                  </Badge>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold mb-3">Key Features</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedIntegration.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Setup Info */}
                <Card className="glass-dark border-border/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Setup Time</div>
                      <div className="text-lg font-bold text-primary">{selectedIntegration.setupTime}</div>
                    </div>
                    <Zap className="w-8 h-8 text-primary/50" />
                  </div>
                </Card>

                {/* CTA Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Integration
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Docs
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Request Integration Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="glass-overlay border-border/30 max-w-md">
          <DialogHeader>
            <DialogTitle>Request an Integration</DialogTitle>
            <DialogDescription>
              Can't find what you're looking for? Let us know and we'll prioritize it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="integration-name">Integration Name *</Label>
              <Input
                id="integration-name"
                placeholder="e.g., Linear, Discord"
                className="glass border-border/30 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="use-case">Use Case *</Label>
              <Textarea
                id="use-case"
                placeholder="Tell us how you'd use this integration..."
                className="glass border-border/30 mt-1 min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="glass border-border/30 mt-1"
              />
            </div>
            <Button className="w-full">
              Submit Request
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

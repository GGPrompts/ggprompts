'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Shield,
  Cpu,
  Cloud,
  Code,
  Lock,
  TrendingUp,
  Users,
  Globe,
  Smartphone,
  Database,
  Layers,
  Search,
  Bell,
  BarChart3,
  FileText,
  Terminal,
  GitBranch,
  Box,
  Sparkles,
  Check,
  ArrowRight,
  Play,
  Star,
  Rocket,
  Target,
  Award,
  ChevronRight
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

// Features data with categories
const allFeatures = [
  {
    id: 'performance',
    category: 'Performance',
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed with edge caching and CDN distribution',
    details: 'Our infrastructure ensures sub-100ms response times globally with 99.99% uptime SLA.',
    benefits: ['< 50ms API response', 'Global CDN', 'Edge caching', 'Auto-scaling'],
    metrics: { value: '50ms', label: 'Avg Response Time' }
  },
  {
    id: 'security',
    category: 'Security',
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance certifications',
    details: 'SOC 2 Type II, GDPR, and HIPAA compliant with end-to-end encryption.',
    benefits: ['256-bit encryption', 'SOC 2 certified', 'GDPR compliant', 'Penetration tested'],
    metrics: { value: '99.99%', label: 'Security Score' }
  },
  {
    id: 'ai-powered',
    category: 'AI & ML',
    icon: Cpu,
    title: 'AI-Powered Insights',
    description: 'Machine learning models that adapt to your usage patterns',
    details: 'Advanced ML algorithms provide predictive analytics and automated recommendations.',
    benefits: ['Predictive analytics', 'Auto-optimization', 'Smart alerts', 'Pattern detection'],
    metrics: { value: '40%', label: 'Efficiency Gain' }
  },
  {
    id: 'cloud-native',
    category: 'Infrastructure',
    icon: Cloud,
    title: 'Cloud Native',
    description: 'Built on modern cloud infrastructure for reliability',
    details: 'Multi-region deployment with automatic failover and data replication.',
    benefits: ['Multi-region', 'Auto-failover', 'Data replication', '99.99% uptime'],
    metrics: { value: '5', label: 'Global Regions' }
  },
  {
    id: 'api-first',
    category: 'Developer',
    icon: Code,
    title: 'API-First Design',
    description: 'RESTful and GraphQL APIs with comprehensive documentation',
    details: 'Well-documented APIs with SDKs in 8+ languages and real-time webhooks.',
    benefits: ['REST & GraphQL', '8+ SDK languages', 'Webhooks', 'OpenAPI spec'],
    metrics: { value: '100%', label: 'API Coverage' }
  },
  {
    id: 'access-control',
    category: 'Security',
    icon: Lock,
    title: 'Advanced Access Control',
    description: 'Role-based permissions and SSO integration',
    details: 'Granular RBAC with support for SAML, OAuth, and custom authentication.',
    benefits: ['RBAC', 'SSO/SAML', 'OAuth 2.0', '2FA/MFA'],
    metrics: { value: '100+', label: 'Permission Levels' }
  },
  {
    id: 'analytics',
    category: 'Analytics',
    icon: TrendingUp,
    title: 'Real-time Analytics',
    description: 'Live dashboards and custom reporting',
    details: 'Track every metric that matters with customizable dashboards and exports.',
    benefits: ['Live dashboards', 'Custom reports', 'Data exports', 'Alerts'],
    metrics: { value: '1M+', label: 'Events/Second' }
  },
  {
    id: 'collaboration',
    category: 'Team',
    icon: Users,
    title: 'Team Collaboration',
    description: 'Built for teams with comments, mentions, and shared workspaces',
    details: 'Real-time collaboration with activity feeds and notification management.',
    benefits: ['Shared workspaces', 'Comments & mentions', 'Activity feeds', 'Permissions'],
    metrics: { value: 'Unlimited', label: 'Team Members' }
  },
  {
    id: 'internationalization',
    category: 'Global',
    icon: Globe,
    title: 'Global Reach',
    description: 'Multi-language and multi-currency support',
    details: 'Localized for 40+ languages with automatic currency conversion.',
    benefits: ['40+ languages', 'Multi-currency', 'RTL support', 'Timezone handling'],
    metrics: { value: '150+', label: 'Countries' }
  },
  {
    id: 'mobile',
    category: 'Platform',
    icon: Smartphone,
    title: 'Mobile-First',
    description: 'Native mobile apps and responsive web design',
    details: 'iOS, Android, and web apps with offline-first architecture.',
    benefits: ['iOS & Android', 'Offline mode', 'Push notifications', 'Responsive design'],
    metrics: { value: '4.8★', label: 'App Store Rating' }
  },
  {
    id: 'database',
    category: 'Infrastructure',
    icon: Database,
    title: 'Scalable Database',
    description: 'Distributed database architecture that grows with you',
    details: 'Auto-scaling database with automatic backups and point-in-time recovery.',
    benefits: ['Auto-scaling', 'Hourly backups', 'Point-in-time recovery', 'Read replicas'],
    metrics: { value: '10TB+', label: 'Data Capacity' }
  },
  {
    id: 'integrations',
    category: 'Integrations',
    icon: Layers,
    title: '200+ Integrations',
    description: 'Connect with all your favorite tools',
    details: 'Pre-built integrations plus custom webhooks and API access.',
    benefits: ['200+ native', 'Custom webhooks', 'Zapier support', 'API access'],
    metrics: { value: '200+', label: 'Integrations' }
  },
  {
    id: 'search',
    category: 'Features',
    icon: Search,
    title: 'Advanced Search',
    description: 'Full-text search with filters and saved queries',
    details: 'Powered by enterprise search with sub-second query performance.',
    benefits: ['Full-text search', 'Advanced filters', 'Saved queries', 'Autocomplete'],
    metrics: { value: '<1s', label: 'Search Speed' }
  },
  {
    id: 'notifications',
    category: 'Features',
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Customizable alerts via email, SMS, and push',
    details: 'AI-powered notification management to reduce noise.',
    benefits: ['Email/SMS/Push', 'Custom triggers', 'Digest mode', 'Smart filtering'],
    metrics: { value: '10M+', label: 'Daily Notifications' }
  },
  {
    id: 'reporting',
    category: 'Analytics',
    icon: BarChart3,
    title: 'Custom Reports',
    description: 'Build and schedule custom reports',
    details: 'Drag-and-drop report builder with scheduled delivery.',
    benefits: ['Report builder', 'Scheduled delivery', 'PDF/CSV export', 'Templates'],
    metrics: { value: '50+', label: 'Report Templates' }
  },
  {
    id: 'documentation',
    category: 'Developer',
    icon: FileText,
    title: 'Rich Documentation',
    description: 'Interactive docs with code examples',
    details: 'Comprehensive guides, API reference, and interactive tutorials.',
    benefits: ['Interactive tutorials', 'Code samples', 'API playground', 'Video guides'],
    metrics: { value: '500+', label: 'Doc Pages' }
  },
  {
    id: 'cli',
    category: 'Developer',
    icon: Terminal,
    title: 'Powerful CLI',
    description: 'Command-line tools for automation',
    details: 'Full-featured CLI with scripting support and CI/CD integration.',
    benefits: ['Cross-platform', 'Scripting support', 'CI/CD ready', 'Auto-updates'],
    metrics: { value: '50+', label: 'CLI Commands' }
  },
  {
    id: 'version-control',
    category: 'Developer',
    icon: GitBranch,
    title: 'Version Control',
    description: 'Track changes and rollback when needed',
    details: 'Full audit trail with one-click rollbacks and branching support.',
    benefits: ['Change tracking', 'One-click rollback', 'Branching', 'Diff viewer'],
    metrics: { value: '90d', label: 'History Retention' }
  },
  {
    id: 'containers',
    category: 'Infrastructure',
    icon: Box,
    title: 'Container Support',
    description: 'Docker and Kubernetes ready',
    details: 'Official Docker images with Kubernetes Helm charts.',
    benefits: ['Docker images', 'K8s Helm charts', 'Auto-scaling', 'Health checks'],
    metrics: { value: '1M+', label: 'Container Pulls' }
  },
  {
    id: 'automation',
    category: 'Features',
    icon: Sparkles,
    title: 'Workflow Automation',
    description: 'Automate repetitive tasks with visual workflows',
    details: 'No-code workflow builder with 100+ pre-built templates.',
    benefits: ['Visual builder', '100+ templates', 'Conditional logic', 'Scheduling'],
    metrics: { value: '100+', label: 'Workflow Templates' }
  }
]

const categories = [
  { name: 'All', icon: Sparkles },
  { name: 'Performance', icon: Zap },
  { name: 'Security', icon: Shield },
  { name: 'Developer', icon: Code },
  { name: 'Analytics', icon: BarChart3 },
  { name: 'Team', icon: Users },
  { name: 'Infrastructure', icon: Cloud }
]

const useCases = [
  {
    icon: Rocket,
    title: 'Startups',
    description: 'Launch faster with production-ready infrastructure',
    features: ['Quick setup', 'Scalable from day 1', 'Startup credits'],
  },
  {
    icon: Target,
    title: 'Enterprise',
    description: 'Enterprise-grade security and compliance',
    features: ['SOC 2 certified', 'SSO/SAML', 'Dedicated support'],
  },
  {
    icon: Award,
    title: 'Agencies',
    description: 'Manage multiple clients with ease',
    features: ['White-label options', 'Multi-tenant', 'Client billing'],
  },
]

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedFeature, setSelectedFeature] = useState<typeof allFeatures[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredFeatures = selectedCategory === 'All'
    ? allFeatures
    : allFeatures.filter(f => f.category === selectedCategory)

  const handleFeatureClick = (feature: typeof allFeatures[0]) => {
    setSelectedFeature(feature)
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
            20+ Powerful Features
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Everything you need to succeed
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            A comprehensive platform packed with features designed to help you build,
            scale, and optimize your applications with confidence.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { value: '99.99%', label: 'Uptime SLA' },
            { value: '<50ms', label: 'Response Time' },
            { value: '200+', label: 'Integrations' },
            { value: '24/7', label: 'Support' }
          ].map((stat, idx) => (
            <Card key={idx} className="glass border-border/30 p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-4 py-8">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="glass border-border/30 w-full max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto p-1">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger
                  key={category.name}
                  value={category.name}
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden lg:inline">{category.name}</span>
                  <span className="lg:hidden">{category.name.slice(0, 4)}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredFeatures.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.03 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.03, rotateY: 5 }}
                    transition={{ duration: 0.3 }}
                    style={{ perspective: 1000 }}
                  >
                    <Card
                      className="glass border-border/30 p-6 h-full cursor-pointer hover:border-primary/50 transition-all group"
                      onClick={() => handleFeatureClick(feature)}
                    >
                      {/* Icon with glow */}
                      <div className="mb-4 relative">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-all">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <Badge
                          variant="outline"
                          className="absolute -top-2 -right-2 text-xs bg-background border-primary/30"
                        >
                          {feature.category}
                        </Badge>
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {feature.description}
                      </p>

                      {/* Metric */}
                      <div className="glass-dark rounded-lg p-3 border border-border/20">
                        <div className="text-2xl font-bold text-primary">
                          {feature.metrics.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {feature.metrics.label}
                        </div>
                      </div>

                      {/* Learn More */}
                      <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        Learn more
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-0 transition-all" />
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Feature Comparison Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Compare Plans</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All features are available across all plans with varying limits
          </p>
        </div>

        <Card className="glass border-border/30 p-8 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {['Starter', 'Professional', 'Enterprise'].map((plan, idx) => (
              <div key={plan} className="text-center">
                <h3 className="text-xl font-bold mb-4">{plan}</h3>
                <div className="space-y-3">
                  {allFeatures.slice(0, 8).map((feature) => (
                    <div key={feature.id} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-left">{feature.title}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" variant={idx === 1 ? 'default' : 'outline'}>
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Built for every team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're a startup, enterprise, or agency, we have you covered
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {useCases.map((useCase, idx) => {
            const Icon = useCase.icon
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="glass border-border/30 p-8 h-full">
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>
                  <p className="text-muted-foreground mb-6">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="glass border-primary/30 p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of teams already using our platform
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </Card>
      </section>

      {/* Feature Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-overlay border-border/30 max-w-2xl">
          {selectedFeature && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <selectedFeature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">{selectedFeature.title}</DialogTitle>
                    <Badge variant="outline" className="mt-1 border-primary/30">
                      {selectedFeature.category}
                    </Badge>
                  </div>
                </div>
                <DialogDescription className="text-base">
                  {selectedFeature.details}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Key Benefits */}
                <div>
                  <h4 className="font-semibold mb-3">Key Benefits</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedFeature.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metric Highlight */}
                <Card className="glass-dark border-border/20 p-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {selectedFeature.metrics.value}
                  </div>
                  <div className="text-muted-foreground">
                    {selectedFeature.metrics.label}
                  </div>
                </Card>

                {/* CTA */}
                <div className="flex gap-3">
                  <Button className="flex-1">
                    Try it now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Learn more
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

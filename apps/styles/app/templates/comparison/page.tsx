'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  X,
  Minus,
  Star,
  Trophy,
  Shield,
  Zap,
  Heart,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight,
  Info,
  Crown
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// Product columns
const products = [
  {
    id: 'competitor-a',
    name: 'Competitor A',
    tagline: 'Basic solution',
    price: '$49',
    period: '/month',
    logo: '🔵',
    highlighted: false,
    color: 'blue'
  },
  {
    id: 'competitor-b',
    name: 'Competitor B',
    tagline: 'Enterprise focused',
    price: '$199',
    period: '/month',
    logo: '🟣',
    highlighted: false,
    color: 'purple'
  },
  {
    id: 'our-product',
    name: 'Our Product',
    tagline: 'Best value & features',
    price: '$79',
    period: '/month',
    logo: '⭐',
    highlighted: true,
    color: 'primary',
    badge: 'Best Value'
  },
  {
    id: 'competitor-c',
    name: 'Competitor C',
    tagline: 'Budget option',
    price: '$29',
    period: '/month',
    logo: '🟢',
    highlighted: false,
    color: 'green'
  },
]

// Comparison categories and features
const comparisonData = [
  {
    category: 'Core Features',
    icon: Zap,
    features: [
      {
        name: 'Projects',
        tooltip: 'Number of projects you can create',
        values: {
          'competitor-a': '10',
          'competitor-b': '100',
          'our-product': 'Unlimited',
          'competitor-c': '5'
        }
      },
      {
        name: 'Storage',
        tooltip: 'Cloud storage included in plan',
        values: {
          'competitor-a': '50GB',
          'competitor-b': '500GB',
          'our-product': '1TB',
          'competitor-c': '10GB'
        }
      },
      {
        name: 'Team Members',
        tooltip: 'Maximum team size',
        values: {
          'competitor-a': '5',
          'competitor-b': '50',
          'our-product': 'Unlimited',
          'competitor-c': '3'
        }
      },
      {
        name: 'API Calls',
        tooltip: 'Monthly API request limit',
        values: {
          'competitor-a': '10K',
          'competitor-b': '100K',
          'our-product': '1M',
          'competitor-c': '5K'
        }
      },
      {
        name: 'Bandwidth',
        tooltip: 'Monthly data transfer limit',
        values: {
          'competitor-a': '100GB',
          'competitor-b': '500GB',
          'our-product': 'Unlimited',
          'competitor-c': '50GB'
        }
      }
    ]
  },
  {
    category: 'Advanced Features',
    icon: Sparkles,
    features: [
      {
        name: 'AI-Powered Analytics',
        tooltip: 'Machine learning insights',
        values: {
          'competitor-a': false,
          'competitor-b': true,
          'our-product': true,
          'competitor-c': false
        }
      },
      {
        name: 'Custom Integrations',
        tooltip: 'Build your own integrations',
        values: {
          'competitor-a': false,
          'competitor-b': true,
          'our-product': true,
          'competitor-c': false
        }
      },
      {
        name: 'Advanced Automation',
        tooltip: 'Workflow automation tools',
        values: {
          'competitor-a': 'limited',
          'competitor-b': true,
          'our-product': true,
          'competitor-c': false
        }
      },
      {
        name: 'Real-time Collaboration',
        tooltip: 'Live co-editing and updates',
        values: {
          'competitor-a': true,
          'competitor-b': true,
          'our-product': true,
          'competitor-c': false
        }
      },
      {
        name: 'Version Control',
        tooltip: 'Track changes and rollback',
        values: {
          'competitor-a': 'limited',
          'competitor-b': true,
          'our-product': true,
          'competitor-c': false
        }
      },
      {
        name: 'White Label',
        tooltip: 'Custom branding options',
        values: {
          'competitor-a': false,
          'competitor-b': true,
          'our-product': true,
          'competitor-c': false
        }
      }
    ]
  },
  {
    category: 'Security & Compliance',
    icon: Shield,
    features: [
      {
        name: 'SOC 2 Certified',
        tooltip: 'Security compliance certification',
        values: {
          'competitor-a': false,
          'competitor-b': true,
          'our-product': true,
          'competitor-c': false
        }
      },
      {
        name: 'GDPR Compliant',
        tooltip: 'European data protection',
        values: {
          'competitor-a': true,
          'competitor-b': true,
          'our-product': true,
          'competitor-c': 'limited'
        }
      },
      {
        name: 'HIPAA Compliant',
        tooltip: 'Healthcare data protection',
        values: {
          'competitor-a': false,
          'competitor-b': true,
          'our-product': true,
          'competitor-c': false
        }
      },
      {
        name: 'SSO/SAML',
        tooltip: 'Single sign-on support',
        values: {
          'competitor-a': false,
          'competitor-b': true,
          'our-product': true,
          'competitor-c': false
        }
      },
      {
        name: '2FA/MFA',
        tooltip: 'Two-factor authentication',
        values: {
          'competitor-a': true,
          'competitor-b': true,
          'our-product': true,
          'competitor-c': true
        }
      },
      {
        name: 'Encrypted Backups',
        tooltip: 'Automatic encrypted backups',
        values: {
          'competitor-a': 'weekly',
          'competitor-b': 'daily',
          'our-product': 'hourly',
          'competitor-c': 'manual'
        }
      }
    ]
  },
  {
    category: 'Support & Performance',
    icon: TrendingUp,
    features: [
      {
        name: 'Support Hours',
        tooltip: 'Customer support availability',
        values: {
          'competitor-a': 'Business',
          'competitor-b': '24/7',
          'our-product': '24/7',
          'competitor-c': 'Email only'
        }
      },
      {
        name: 'Response Time',
        tooltip: 'Average support response time',
        values: {
          'competitor-a': '24 hours',
          'competitor-b': '4 hours',
          'our-product': '1 hour',
          'competitor-c': '48 hours'
        }
      },
      {
        name: 'Dedicated Manager',
        tooltip: 'Personal account manager',
        values: {
          'competitor-a': false,
          'competitor-b': true,
          'our-product': true,
          'competitor-c': false
        }
      },
      {
        name: 'Uptime SLA',
        tooltip: 'Guaranteed uptime percentage',
        values: {
          'competitor-a': '99.5%',
          'competitor-b': '99.9%',
          'our-product': '99.99%',
          'competitor-c': '99%'
        }
      },
      {
        name: 'API Response Time',
        tooltip: 'Average API latency',
        values: {
          'competitor-a': '200ms',
          'competitor-b': '100ms',
          'our-product': '50ms',
          'competitor-c': '500ms'
        }
      },
      {
        name: 'Onboarding Training',
        tooltip: 'Personalized onboarding sessions',
        values: {
          'competitor-a': false,
          'competitor-b': true,
          'our-product': true,
          'competitor-c': false
        }
      }
    ]
  },
  {
    category: 'Integrations & Ecosystem',
    icon: Users,
    features: [
      {
        name: 'Native Integrations',
        tooltip: 'Pre-built integrations',
        values: {
          'competitor-a': '50+',
          'competitor-b': '150+',
          'our-product': '200+',
          'competitor-c': '20+'
        }
      },
      {
        name: 'API Access',
        tooltip: 'REST/GraphQL API',
        values: {
          'competitor-a': 'REST',
          'competitor-b': 'Both',
          'our-product': 'Both',
          'competitor-c': false
        }
      },
      {
        name: 'Webhooks',
        tooltip: 'Real-time event webhooks',
        values: {
          'competitor-a': 'limited',
          'competitor-b': true,
          'our-product': true,
          'competitor-c': false
        }
      },
      {
        name: 'Zapier/Make',
        tooltip: 'No-code automation support',
        values: {
          'competitor-a': true,
          'competitor-b': true,
          'our-product': true,
          'competitor-c': false
        }
      },
      {
        name: 'SDK Languages',
        tooltip: 'Official SDK support',
        values: {
          'competitor-a': '3',
          'competitor-b': '6',
          'our-product': '8+',
          'competitor-c': '1'
        }
      }
    ]
  }
]

export default function ComparisonPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const renderValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-primary mx-auto" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
      )
    }

    if (value === 'limited') {
      return <Minus className="w-5 h-5 text-muted-foreground mx-auto" />
    }

    return <span className="text-sm font-medium">{value}</span>
  }

  const filteredData = selectedCategory === 'all'
    ? comparisonData
    : comparisonData.filter(c => c.category.toLowerCase().includes(selectedCategory))

  return (
    <TooltipProvider>
      <div className="min-h-screen text-foreground pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
              <Trophy className="w-3 h-3 mr-1" />
              Compare & Choose
            </Badge>
            <h1 className="text-4xl md:text-6xl font-mono font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              See how we stack up
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              A transparent comparison with leading competitors. We believe in giving you
              all the facts to make the best decision for your team.
            </p>
          </motion.div>

          {/* Quick Summary Cards */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { icon: Trophy, label: 'Best Features', value: '200+' },
              { icon: Heart, label: 'Customer Rating', value: '4.9/5' },
              { icon: Star, label: 'Best Value', value: '40% Savings' }
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <Card key={idx} className="glass border-border/30 p-6 text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </Card>
              )
            })}
          </motion.div>
        </section>

        {/* Category Filter */}
        <section className="container mx-auto px-4 py-8 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="glass border-border/30 w-full max-w-5xl mx-auto h-auto p-1 grid grid-cols-3 sm:grid-cols-6">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm">
                <span className="hidden sm:inline">All Features</span>
                <span className="sm:hidden">All</span>
              </TabsTrigger>
              {comparisonData.map((cat) => {
                const Icon = cat.icon
                return (
                  <TabsTrigger
                    key={cat.category}
                    value={cat.category.toLowerCase()}
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm"
                  >
                    <Icon className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">{cat.category.split(' ')[0]}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </section>

        {/* Comparison Table */}
        <section className="container mx-auto px-4 py-8">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Product Headers */}
              <div className="grid grid-cols-5 gap-4 mb-6">
                <div className="col-span-1" /> {/* Empty cell for feature names */}
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className={cn(
                      "p-6 text-center relative",
                      product.highlighted
                        ? "glass border-primary/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                        : "glass-dark border-border/30"
                    )}>
                      {product.highlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground border-0 px-3 py-1">
                            <Crown className="w-3 h-3 mr-1" />
                            {product.badge}
                          </Badge>
                        </div>
                      )}
                      <div className="text-4xl mb-3">{product.logo}</div>
                      <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mb-4">{product.tagline}</p>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-primary">{product.price}</span>
                        <span className="text-sm text-muted-foreground">{product.period}</span>
                      </div>
                      <Button
                        className={cn(
                          "w-full",
                          product.highlighted ? "bg-primary hover:bg-primary/90" : ""
                        )}
                        variant={product.highlighted ? "default" : "outline"}
                      >
                        {product.highlighted ? 'Get Started' : 'Learn More'}
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Feature Rows */}
              {filteredData.map((category, categoryIdx) => {
                const Icon = category.icon
                return (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: categoryIdx * 0.1 }}
                    className="mb-8"
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-4 py-3 border-b border-border/30">
                      <Icon className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-bold">{category.category}</h2>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {category.features.map((feature, featureIdx) => (
                        <motion.div
                          key={feature.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: featureIdx * 0.03 }}
                          className="grid grid-cols-5 gap-4 items-center"
                        >
                          {/* Feature Name */}
                          <div className="col-span-1 flex items-center gap-2">
                            <span className="text-sm font-medium">{feature.name}</span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent className="glass-dark border-border/30">
                                <p className="text-xs max-w-xs">{feature.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>

                          {/* Product Values */}
                          {products.map((product) => (
                            <Card
                              key={product.id}
                              className={cn(
                                "p-4 text-center",
                                product.highlighted
                                  ? "glass border-primary/30"
                                  : "glass-dark border-border/20"
                              )}
                            >
                              {renderValue(feature.values[product.id as keyof typeof feature.values])}
                            </Card>
                          ))}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}

              {/* Bottom CTA Row */}
              <div className="grid grid-cols-5 gap-4 mt-12">
                <div className="col-span-1" />
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className={cn(
                      "p-6 text-center",
                      product.highlighted
                        ? "glass border-primary/50"
                        : "glass-dark border-border/30"
                    )}
                  >
                    <Button
                      className={cn(
                        "w-full",
                        product.highlighted ? "bg-primary hover:bg-primary/90" : ""
                      )}
                      variant={product.highlighted ? "default" : "outline"}
                    >
                      {product.highlighted ? (
                        <>
                          Choose {product.name}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        'View Details'
                      )}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile-Friendly Alternative */}
        <section className="container mx-auto px-4 py-8 lg:hidden">
          <Card className="glass border-border/30 p-6">
            <h3 className="text-lg font-bold mb-4">Best viewed on desktop</h3>
            <p className="text-sm text-muted-foreground mb-4">
              For the best comparison experience, view this page on a larger screen.
              Or select individual products to compare:
            </p>
            <div className="space-y-3">
              {products.map((product) => (
                <Button
                  key={product.id}
                  variant={product.highlighted ? "default" : "outline"}
                  className="w-full justify-between"
                >
                  <span>{product.logo} {product.name}</span>
                  <span className="text-sm">{product.price}{product.period}</span>
                </Button>
              ))}
            </div>
          </Card>
        </section>

        {/* Why Choose Us Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="glass border-primary/30 p-12 max-w-4xl mx-auto">
            <div className="text-center">
              <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">Why choose us?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                More features, better performance, and superior support at a price
                that makes sense for teams of all sizes.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  Schedule Demo
                </Button>
                <Button size="lg" variant="outline">
                  See Pricing
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Trust Signals */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Shield, label: 'SOC 2 Certified' },
              { icon: Users, label: '50K+ Customers' },
              { icon: Star, label: '4.9/5 Rating' },
              { icon: TrendingUp, label: '99.99% Uptime' }
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <Card key={idx} className="glass-dark border-border/20 p-6 text-center">
                  <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium">{item.label}</div>
                </Card>
              )
            })}
          </div>
        </section>
      </div>
    </TooltipProvider>
  )
}

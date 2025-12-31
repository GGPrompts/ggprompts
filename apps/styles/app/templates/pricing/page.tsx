'use client'

import { useState, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Info, Sparkles, Building2, ChevronDown, Shield, ArrowRight, HelpCircle } from 'lucide-react'
import { Card, Badge, Button, Switch, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, cn } from "@ggprompts/ui"

// Pricing tiers data
const pricingTiers = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals and small projects',
    monthlyPrice: 9,
    annualPrice: 90,
    features: [
      '5 Projects',
      '10GB Storage',
      'Basic Analytics',
      'Email Support',
      '48-hour response time',
      'Basic integrations',
      'SSL Certificate',
    ],
    limitations: [
      'No custom domain',
      'Limited API calls',
      'No team members',
      'No priority support',
    ],
    testimonial: {
      name: 'Alex Chen',
      role: 'Freelancer',
      content: 'Great for getting started. All the essentials I needed.',
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing teams and businesses',
    monthlyPrice: 29,
    annualPrice: 290,
    popular: true,
    features: [
      'Unlimited Projects',
      '100GB Storage',
      'Advanced Analytics',
      'Priority Email Support',
      '24-hour response time',
      'All integrations',
      'Custom domain',
      'Team collaboration (5 users)',
      'API Access',
      'Advanced security',
      'Custom SSL',
      'Version control',
    ],
    limitations: [
      'Limited API rate',
      'No dedicated support',
    ],
    testimonial: {
      name: 'Sarah Mitchell',
      role: 'Startup Founder',
      content: 'The perfect balance of features and price. Scaled with our growth.',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Comprehensive solution for large organizations',
    monthlyPrice: 99,
    annualPrice: 990,
    features: [
      'Unlimited Everything',
      'Unlimited Storage',
      'Custom Analytics Dashboard',
      'Dedicated Account Manager',
      '1-hour response time',
      'Custom integrations',
      'Multiple custom domains',
      'Unlimited team members',
      'Unlimited API calls',
      'Enterprise security',
      'SLA guarantee',
      'Custom contracts',
      'Onboarding assistance',
      'Training sessions',
      'White-label options',
    ],
    limitations: [],
    testimonial: {
      name: 'Michael Roberts',
      role: 'CTO, TechCorp',
      content: 'Enterprise-grade features with exceptional support. Worth every penny.',
    },
  },
]

// Feature comparison data
const featureComparison = [
  {
    category: 'Core Features',
    features: [
      { name: 'Projects', starter: '5', professional: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'Storage', starter: '10GB', professional: '100GB', enterprise: 'Unlimited' },
      { name: 'Users', starter: '1', professional: '5', enterprise: 'Unlimited' },
      { name: 'API Calls', starter: '1,000/mo', professional: '100,000/mo', enterprise: 'Unlimited' },
    ],
  },
  {
    category: 'Analytics & Reporting',
    features: [
      { name: 'Basic Analytics', starter: true, professional: true, enterprise: true },
      { name: 'Advanced Analytics', starter: false, professional: true, enterprise: true },
      { name: 'Custom Reports', starter: false, professional: false, enterprise: true },
      { name: 'Real-time Data', starter: false, professional: true, enterprise: true },
    ],
  },
  {
    category: 'Support & Security',
    features: [
      { name: 'Email Support', starter: '48hr', professional: '24hr', enterprise: '1hr' },
      { name: 'Phone Support', starter: false, professional: false, enterprise: true },
      { name: 'Dedicated Manager', starter: false, professional: false, enterprise: true },
      { name: 'SSL Certificate', starter: 'Basic', professional: 'Custom', enterprise: 'Enterprise' },
      { name: '2FA Authentication', starter: true, professional: true, enterprise: true },
      { name: 'SSO', starter: false, professional: false, enterprise: true },
    ],
  },
  {
    category: 'Integrations',
    features: [
      { name: 'Basic Integrations', starter: true, professional: true, enterprise: true },
      { name: 'Premium Integrations', starter: false, professional: true, enterprise: true },
      { name: 'Custom Integrations', starter: false, professional: false, enterprise: true },
      { name: 'API Access', starter: false, professional: true, enterprise: true },
    ],
  },
]

// FAQ data
const pricingFAQs = [
  {
    question: 'Can I change plans at any time?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be prorated for the remainder of your billing cycle. When downgrading, the change will take effect at the start of your next billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and wire transfers for Enterprise plans. All payments are processed securely through Stripe.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, all plans come with a 14-day free trial. No credit card required. You can explore all features and upgrade at any time during or after the trial.',
  },
  {
    question: 'What happens to my data if I cancel?',
    answer: 'Your data remains accessible for 30 days after cancellation. You can export all your data at any time. After 30 days, data is permanently deleted in accordance with our privacy policy.',
  },
  {
    question: 'Do you offer discounts for nonprofits or education?',
    answer: 'Yes! We offer 50% discounts for qualified nonprofit organizations and educational institutions. Contact our sales team with proof of eligibility.',
  },
  {
    question: 'What\'s included in the money-back guarantee?',
    answer: 'All plans include a 30-day money-back guarantee. If you\'re not satisfied within the first 30 days, we\'ll refund your payment in full, no questions asked.',
  },
  {
    question: 'Can I add more users to my plan?',
    answer: 'Professional plans can add additional users for $5/user/month. Enterprise plans include unlimited users. Starter plans are limited to single users.',
  },
  {
    question: 'What kind of support can I expect?',
    answer: 'Support quality varies by plan. Starter gets email support with 48-hour response. Professional gets priority email with 24-hour response. Enterprise gets dedicated account management with 1-hour response times and phone support.',
  },
]

// Currencies
const currencies = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual')
  const [selectedCurrency, setSelectedCurrency] = useState('USD')

  const currentCurrency = currencies.find(c => c.code === selectedCurrency) || currencies[0]

  const calculatePrice = (tier: typeof pricingTiers[0]) => {
    const basePrice = billingPeriod === 'monthly' ? tier.monthlyPrice : tier.annualPrice / 12
    // Mock currency conversion (in real app, use actual rates)
    const conversionRates: Record<string, number> = {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110,
    }
    return Math.round(basePrice * conversionRates[selectedCurrency])
  }

  const calculateSavings = (tier: typeof pricingTiers[0]) => {
    const monthlyCost = tier.monthlyPrice * 12
    const annualCost = tier.annualPrice
    const savings = monthlyCost - annualCost
    const percentage = Math.round((savings / monthlyCost) * 100)
    return { amount: savings, percentage }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen text-foreground">
        {/* Header */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <motion.h1
              className="text-5xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 terminal-glow"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Simple, Transparent Pricing
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Choose the perfect plan for your needs. Always flexible, always transparent.
            </motion.p>
          </div>

          {/* Money-back guarantee banner */}
          <motion.div
            className="glass border-primary/30 rounded-lg p-4 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">
                30-Day Money-Back Guarantee • No Questions Asked • Cancel Anytime
              </span>
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </motion.div>

          {/* Billing Toggle & Currency Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-3">
              <Label htmlFor="billing-toggle" className="text-sm font-medium">
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={billingPeriod === 'annual'}
                onCheckedChange={(checked) => setBillingPeriod(checked ? 'annual' : 'monthly')}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="billing-toggle" className="text-sm font-medium">
                Annual
                <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary border-primary/30">
                  Save up to 17%
                </Badge>
              </Label>
            </div>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-[140px] glass border-border/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-dark border-border/30">
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => {
              const savings = calculateSavings(tier)
              const isPopular = tier.popular

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="relative"
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                      <Badge className="bg-primary text-primary-foreground border-0 px-4 py-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      rotateY: 5,
                      rotateX: -2
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ perspective: 1000 }}
                    className="h-full"
                  >
                    <Card className={cn(
                      "glass h-full flex flex-col p-6",
                      isPopular ? "border-primary/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]" : "border-border/30"
                    )}>
                      {/* Tier Header */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">
                            {currentCurrency.symbol}{calculatePrice(tier)}
                          </span>
                          <span className="text-muted-foreground">
                            /per {billingPeriod === 'monthly' ? 'month' : 'month'}
                          </span>
                        </div>
                        {billingPeriod === 'annual' && (
                          <p className="text-sm text-primary mt-1">
                            Save {currentCurrency.symbol}{Math.round(savings.amount * (currentCurrency.code === 'USD' ? 1 : 0.85))} ({savings.percentage}%)
                          </p>
                        )}
                        {billingPeriod === 'annual' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Billed annually at {currentCurrency.symbol}{Math.round(tier.annualPrice * (currentCurrency.code === 'USD' ? 1 : 0.85))}
                          </p>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Button
                        className={cn(
                          "w-full mb-6",
                          isPopular ? "bg-primary hover:bg-primary/90" : ""
                        )}
                        variant={isPopular ? "default" : "outline"}
                      >
                        {tier.id === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>

                      {/* Features */}
                      <div className="space-y-3 flex-grow">
                        <h4 className="text-sm font-semibold text-muted-foreground">INCLUDES:</h4>
                        {tier.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}

                        {tier.limitations.length > 0 && (
                          <>
                            <div className="border-t border-border/20 my-4" />
                            {tier.limitations.map((limitation, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <X className="w-4 h-4 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground/70">{limitation}</span>
                              </div>
                            ))}
                          </>
                        )}
                      </div>

                      {/* Testimonial */}
                      {tier.testimonial && (
                        <div className="mt-6 pt-6 border-t border-border/20">
                          <p className="text-xs text-muted-foreground italic mb-2">
                            "{tier.testimonial.content}"
                          </p>
                          <p className="text-xs font-medium">
                            — {tier.testimonial.name}, {tier.testimonial.role}
                          </p>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>

          {/* Enterprise CTA */}
          <motion.div
            className="glass border-border/30 rounded-lg p-8 mb-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <Building2 className="w-8 h-8 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Need a Custom Solution?</h3>
                  <p className="text-muted-foreground">
                    Get a personalized plan tailored to your organization's specific needs
                  </p>
                </div>
              </div>
              <Button size="lg" variant="outline" className="whitespace-nowrap">
                Contact Sales Team
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>

          {/* Feature Comparison Table */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">Detailed Feature Comparison</h2>
            <div className="overflow-x-auto">
              <Card className="glass border-border/30">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/30">
                      <TableHead className="w-[300px]">Features</TableHead>
                      <TableHead className="text-center">Starter</TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          Professional
                          <Badge variant="outline" className="ml-1 text-xs border-primary/30 text-primary">
                            Popular
                          </Badge>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">Enterprise</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {featureComparison.map((category) => (
                      <Fragment key={category.category}>
                        <TableRow className="border-border/30 bg-muted/5">
                          <TableCell colSpan={4} className="font-semibold text-primary">
                            {category.category}
                          </TableCell>
                        </TableRow>
                        {category.features.map((feature) => (
                          <TableRow key={feature.name} className="border-border/30">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {feature.name}
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="w-3 h-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent className="glass-dark border-border/30">
                                    <p className="text-xs max-w-xs">
                                      Learn more about {feature.name} in our documentation
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {typeof feature.starter === 'boolean' ? (
                                feature.starter ? (
                                  <Check className="w-4 h-4 text-primary mx-auto" />
                                ) : (
                                  <X className="w-4 h-4 text-muted-foreground/50 mx-auto" />
                                )
                              ) : (
                                <span className="text-sm">{feature.starter}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {typeof feature.professional === 'boolean' ? (
                                feature.professional ? (
                                  <Check className="w-4 h-4 text-primary mx-auto" />
                                ) : (
                                  <X className="w-4 h-4 text-muted-foreground/50 mx-auto" />
                                )
                              ) : (
                                <span className="text-sm">{feature.professional}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {typeof feature.enterprise === 'boolean' ? (
                                feature.enterprise ? (
                                  <Check className="w-4 h-4 text-primary mx-auto" />
                                ) : (
                                  <X className="w-4 h-4 text-muted-foreground/50 mx-auto" />
                                )
                              ) : (
                                <span className="text-sm">{feature.enterprise}</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Everything you need to know about our pricing and plans
              </p>
            </div>

            <Card className="glass border-border/30 p-6">
              <Accordion type="single" collapsible className="w-full">
                {pricingFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border/30">
                    <AccordionTrigger className="hover:text-primary transition-colors">
                      <div className="flex items-center gap-2 text-left">
                        <HelpCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

            {/* Contact Support */}
            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Still have questions? We're here to help.
              </p>
              <Button variant="outline">
                Contact Support
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  )
}
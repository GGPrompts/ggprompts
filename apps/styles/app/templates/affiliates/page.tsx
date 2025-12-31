'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Gift,
  Download,
  Link2,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Clock,
  CreditCard,
  FileText,
  HelpCircle,
  Rocket,
  Star,
  Target,
  Zap,
  Globe,
  Mail,
  Share2,
  MessageSquare,
  Shield,
  Trophy
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

// Types
interface CommissionTier {
  name: string
  range: string
  rate: number
  bonus?: string
  color: string
}

interface Testimonial {
  name: string
  role: string
  avatar: string
  earnings: string
  quote: string
  rating: number
}

interface Resource {
  id: string
  name: string
  type: 'banner' | 'link' | 'guide' | 'template'
  description: string
  size?: string
  downloads?: number
}

interface FAQ {
  question: string
  answer: string
  category: string
}

// Mock Data - Commission Tiers
const commissionTiers: CommissionTier[] = [
  {
    name: 'Bronze',
    range: '0-10 referrals',
    rate: 20,
    color: 'text-orange-600',
  },
  {
    name: 'Silver',
    range: '11-25 referrals',
    rate: 25,
    bonus: '+$100 bonus',
    color: 'text-gray-400',
  },
  {
    name: 'Gold',
    range: '26-50 referrals',
    rate: 30,
    bonus: '+$250 bonus',
    color: 'text-yellow-500',
  },
  {
    name: 'Platinum',
    range: '51-100 referrals',
    rate: 35,
    bonus: '+$500 bonus',
    color: 'text-secondary',
  },
  {
    name: 'Diamond',
    range: '100+ referrals',
    rate: 40,
    bonus: '+$1000 bonus + perks',
    color: 'text-purple-500',
  },
]

// Mock Data - Testimonials
const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Tech Blogger',
    avatar: '👩',
    earnings: '$12,450/mo',
    quote: 'The affiliate program transformed my blog income. The commission rates are incredibly generous and the support team is always helpful.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'YouTube Creator',
    avatar: '👨',
    earnings: '$8,920/mo',
    quote: 'I\'ve been part of many affiliate programs, but this one stands out. High conversion rates and excellent tracking tools.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Course Instructor',
    avatar: '👩',
    earnings: '$15,780/mo',
    quote: 'Reached Diamond tier in 6 months! The recurring commissions mean stable passive income every month.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Podcast Host',
    avatar: '👨',
    earnings: '$6,340/mo',
    quote: 'Easy to integrate, great conversion rates, and payments are always on time. Highly recommend!',
    rating: 5,
  },
]

// Mock Data - Resources
const resources: Resource[] = [
  {
    id: 'r1',
    name: 'Leaderboard Banner (728x90)',
    type: 'banner',
    description: 'High-converting leaderboard banner for website headers',
    size: '728x90px',
    downloads: 1234,
  },
  {
    id: 'r2',
    name: 'Square Banner (300x300)',
    type: 'banner',
    description: 'Perfect for sidebar placements and social media',
    size: '300x300px',
    downloads: 892,
  },
  {
    id: 'r3',
    name: 'Skyscraper Banner (160x600)',
    type: 'banner',
    description: 'Vertical banner for sidebar placement',
    size: '160x600px',
    downloads: 567,
  },
  {
    id: 'r4',
    name: 'Mobile Banner (320x100)',
    type: 'banner',
    description: 'Optimized for mobile devices',
    size: '320x100px',
    downloads: 445,
  },
  {
    id: 'r5',
    name: 'Affiliate Marketing Guide',
    type: 'guide',
    description: 'Complete guide to maximizing your affiliate earnings',
    downloads: 2341,
  },
  {
    id: 'r6',
    name: 'Email Templates Pack',
    type: 'template',
    description: '10 pre-written email templates for your campaigns',
    downloads: 1567,
  },
  {
    id: 'r7',
    name: 'Social Media Copy Kit',
    type: 'template',
    description: 'Ready-to-use social media post templates',
    downloads: 1893,
  },
  {
    id: 'r8',
    name: 'Text Links Collection',
    type: 'link',
    description: 'Optimized text links with your tracking code',
    downloads: 3421,
  },
]

// Mock Data - FAQs
const faqs: FAQ[] = [
  {
    question: 'How much can I earn as an affiliate?',
    answer: 'Your earnings depend on your referrals and tier level. Our affiliates earn anywhere from a few hundred to over $50,000 per month. You earn 20-40% recurring commission on all referred customers, plus tier bonuses.',
    category: 'Earnings',
  },
  {
    question: 'When and how do I get paid?',
    answer: 'Payouts are processed on the 1st of each month for the previous month\'s earnings. We support PayPal, bank transfer, and Stripe. Minimum payout threshold is $100.',
    category: 'Payments',
  },
  {
    question: 'How long do cookies last?',
    answer: 'Our cookies last for 90 days, giving you plenty of time to earn commission from your referrals. If someone clicks your link and signs up within 90 days, you get credit.',
    category: 'Tracking',
  },
  {
    question: 'What is a recurring commission?',
    answer: 'Unlike one-time payments, you earn commission every month as long as your referred customer maintains their subscription. This creates stable, passive income.',
    category: 'Earnings',
  },
  {
    question: 'Can I promote on social media?',
    answer: 'Absolutely! You can promote on any platform including social media, blogs, YouTube, podcasts, email newsletters, and more. We provide materials for all channels.',
    category: 'Promotion',
  },
  {
    question: 'Is there a limit to how many referrals I can make?',
    answer: 'No limits! The more you refer, the higher your tier and commission rate. Our top affiliates have thousands of active referrals.',
    category: 'Referrals',
  },
  {
    question: 'Do I need a website to join?',
    answer: 'No, a website is not required. Many successful affiliates promote through social media, YouTube, podcasts, or email lists.',
    category: 'Requirements',
  },
  {
    question: 'What support do you provide?',
    answer: 'We offer dedicated affiliate support, marketing materials, tracking dashboard, conversion optimization tips, and a private community of top affiliates.',
    category: 'Support',
  },
  {
    question: 'How do I track my performance?',
    answer: 'Your affiliate dashboard provides real-time analytics including clicks, conversions, earnings, top-performing content, and more. Access it anytime 24/7.',
    category: 'Tracking',
  },
  {
    question: 'What are the tier bonuses?',
    answer: 'As you reach new tiers, you receive one-time cash bonuses: Silver ($100), Gold ($250), Platinum ($500), Diamond ($1000) plus exclusive perks like priority support and early feature access.',
    category: 'Bonuses',
  },
]

const benefits = [
  {
    icon: DollarSign,
    title: 'Recurring Commissions',
    description: 'Earn 20-40% monthly recurring revenue for every customer you refer',
    color: 'text-green-500',
  },
  {
    icon: TrendingUp,
    title: 'Tier-Based System',
    description: 'Higher commission rates as you grow - up to 40% for Diamond affiliates',
    color: 'text-blue-500',
  },
  {
    icon: Clock,
    title: '90-Day Cookies',
    description: 'Extended cookie duration gives your referrals more time to convert',
    color: 'text-purple-500',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track clicks, conversions, and earnings in your personalized dashboard',
    color: 'text-secondary',
  },
  {
    icon: Gift,
    title: 'Tier Bonuses',
    description: 'Cash bonuses up to $1,000 when you reach new referral milestones',
    color: 'text-yellow-500',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'Priority support from our affiliate team and access to private community',
    color: 'text-pink-500',
  },
]

const steps = [
  {
    number: 1,
    title: 'Sign Up Free',
    description: 'Create your affiliate account in under 60 seconds. No approval wait time.',
    icon: Rocket,
  },
  {
    number: 2,
    title: 'Get Your Links',
    description: 'Access your unique tracking links and marketing materials instantly.',
    icon: Link2,
  },
  {
    number: 3,
    title: 'Promote & Share',
    description: 'Share on your blog, social media, email list, or any platform you choose.',
    icon: Share2,
  },
  {
    number: 4,
    title: 'Earn Commissions',
    description: 'Get paid monthly recurring commissions for every active customer.',
    icon: DollarSign,
  },
]

export default function AffiliatesPage() {
  const [calculatorReferrals, setCalculatorReferrals] = useState([10])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    traffic: '',
  })

  // Calculate potential earnings
  const calculateEarnings = (referrals: number) => {
    const avgSubscription = 49 // Average monthly subscription
    let commissionRate = 0.20

    // Determine tier
    if (referrals >= 100) commissionRate = 0.40
    else if (referrals >= 51) commissionRate = 0.35
    else if (referrals >= 26) commissionRate = 0.30
    else if (referrals >= 11) commissionRate = 0.25

    const monthlyEarnings = referrals * avgSubscription * commissionRate
    const yearlyEarnings = monthlyEarnings * 12

    return {
      monthly: monthlyEarnings,
      yearly: yearlyEarnings,
      rate: commissionRate * 100,
    }
  }

  const earnings = calculateEarnings(calculatorReferrals[0])

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
            <Award className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-6xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">
              Affiliate Program
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of affiliates earning recurring commissions. Promote a product you love and get paid every month.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8">
              <Rocket className="w-5 h-5 mr-2" />
              Join Now - It's Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <FileText className="w-5 h-5 mr-2" />
              View Terms
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 pt-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>No approval needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Instant access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>90-day cookies</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Active Affiliates', value: '12,500+', icon: Users },
            { label: 'Avg. Commission', value: '$3,240/mo', icon: DollarSign },
            { label: 'Total Paid Out', value: '$8.5M+', icon: CreditCard },
            { label: 'Conversion Rate', value: '12.3%', icon: TrendingUp },
          ].map((stat, index) => (
            <Card key={index} className="glass p-6 text-center">
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Why Join Our Program?</h2>
            <p className="text-muted-foreground">Industry-leading benefits and support</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass h-full p-6">
                  <benefit.icon className={cn('w-10 h-10 mb-4', benefit.color)} />
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Commission Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Commission Structure</h2>
            <p className="text-muted-foreground">Earn more as you grow - up to 40% recurring</p>
          </div>

          <Card className="glass overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier</TableHead>
                  <TableHead>Referrals</TableHead>
                  <TableHead>Commission Rate</TableHead>
                  <TableHead>Bonus</TableHead>
                  <TableHead className="text-right">Monthly Potential*</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissionTiers.map((tier, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Trophy className={cn('w-5 h-5', tier.color)} />
                        <span className="font-semibold">{tier.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tier.range}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-base font-bold">
                        {tier.rate}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tier.bonus ? (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
                          {tier.bonus}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${((parseInt(tier.range.split('-')[1] || tier.range.split('+')[0]) * 49 * tier.rate) / 100).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <p className="text-sm text-muted-foreground text-center">
            * Based on average customer value of $49/month
          </p>
        </motion.div>

        {/* Earnings Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Calculate Your Potential</h2>
            <p className="text-muted-foreground">See how much you could earn</p>
          </div>

          <Card className="glass-dark p-8 max-w-3xl mx-auto">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-lg font-semibold">Number of Referrals</label>
                  <Badge variant="secondary" className="text-lg">
                    {calculatorReferrals[0]}
                  </Badge>
                </div>
                <Slider
                  value={calculatorReferrals}
                  onValueChange={setCalculatorReferrals}
                  max={200}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0</span>
                  <span>200+</span>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Commission Rate</div>
                  <div className="text-3xl font-bold text-primary">{earnings.rate}%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Monthly Earnings</div>
                  <div className="text-3xl font-bold text-green-500">
                    ${earnings.monthly.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Yearly Earnings</div>
                  <div className="text-3xl font-bold text-blue-500">
                    ${earnings.yearly.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
                <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm">
                  With <span className="font-bold text-primary">{calculatorReferrals[0]}</span> referrals,
                  you'd earn <span className="font-bold text-primary">${earnings.monthly.toLocaleString()}/month</span> in
                  recurring passive income!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-muted-foreground">Get started in 4 simple steps</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card className="glass h-full p-6 text-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-2xl font-bold">
                    {step.number}
                  </div>
                  <step.icon className="w-12 h-12 text-primary mx-auto mb-4 mt-4" />
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Success Stories</h2>
            <p className="text-muted-foreground">Hear from our top-performing affiliates</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass h-full p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div className="flex-1">
                      <div className="font-bold text-lg">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <Badge className="mt-1 bg-green-500/10 text-green-500 border-green-500/30">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {testimonial.earnings}
                      </Badge>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">&ldquo;{testimonial.quote}&rdquo;</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Marketing Resources</h2>
            <p className="text-muted-foreground">Everything you need to succeed</p>
          </div>

          <Tabs defaultValue="banners" className="max-w-4xl mx-auto">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="glass grid w-max md:w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="banners" className="text-xs sm:text-sm whitespace-nowrap">Banners</TabsTrigger>
                <TabsTrigger value="links" className="text-xs sm:text-sm whitespace-nowrap">Links</TabsTrigger>
                <TabsTrigger value="guides" className="text-xs sm:text-sm whitespace-nowrap">Guides</TabsTrigger>
                <TabsTrigger value="templates" className="text-xs sm:text-sm whitespace-nowrap">Templates</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="banners" className="space-y-3 mt-6">
              {resources.filter((r) => r.type === 'banner').map((resource) => (
                <Card key={resource.id} className="glass p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{resource.name}</div>
                        <div className="text-sm text-muted-foreground">{resource.description}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{resource.size}</span>
                          <span>•</span>
                          <span>{resource.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="links" className="space-y-3 mt-6">
              {resources.filter((r) => r.type === 'link').map((resource) => (
                <Card key={resource.id} className="glass p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Link2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{resource.name}</div>
                        <div className="text-sm text-muted-foreground">{resource.description}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Get Links
                    </Button>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="guides" className="space-y-3 mt-6">
              {resources.filter((r) => r.type === 'guide').map((resource) => (
                <Card key={resource.id} className="glass p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{resource.name}</div>
                        <div className="text-sm text-muted-foreground">{resource.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {resource.downloads} downloads
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="templates" className="space-y-3 mt-6">
              {resources.filter((r) => r.type === 'template').map((resource) => (
                <Card key={resource.id} className="glass p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{resource.name}</div>
                        <div className="text-sm text-muted-foreground">{resource.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {resource.downloads} downloads
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Payout Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card className="glass p-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Payout Schedule</h3>
                  <p className="text-muted-foreground">
                    Reliable and timely payments every month
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Payment Day</div>
                    <div className="text-lg font-semibold">1st of each month</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Minimum Payout</div>
                    <div className="text-lg font-semibold">$100</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Payment Methods</div>
                    <div className="text-lg font-semibold">PayPal, Bank, Stripe</div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>All payments are secure and processed automatically</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know</p>
          </div>

          <Card className="glass max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="border-border/50">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
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

        {/* Sign Up CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Card className="glass-dark p-12 text-center">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 12,500+ affiliates earning recurring commissions. Sign up free and get instant access to your dashboard and marketing materials.
            </p>

            <div className="max-w-md mx-auto space-y-4">
              <Input
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                placeholder="Website or social media (optional)"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
              <Button size="lg" className="w-full text-lg">
                <Rocket className="w-5 h-5 mr-2" />
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-xs text-muted-foreground">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

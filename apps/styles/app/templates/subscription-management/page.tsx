'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, X, Zap, Crown, Rocket, Star, TrendingUp, Users,
  Database, Clock, Shield, Sparkles, ChevronRight, Settings,
  AlertCircle, Calendar, CreditCard, Package, BarChart3,
  Globe, Lock, PlayCircle, PauseCircle, XCircle, Percent,
  ArrowUpRight, ArrowDownRight, Plus, Minus, History
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    annualPrice: 0,
    icon: Sparkles,
    description: 'Perfect for trying out our platform',
    features: [
      { name: '5 Projects', included: true },
      { name: '1 GB Storage', included: true },
      { name: '10,000 API Calls/month', included: true },
      { name: 'Community Support', included: true },
      { name: 'Advanced Analytics', included: false },
      { name: 'Custom Domains', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Team Collaboration', included: false },
    ],
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    annualPrice: 290,
    icon: Rocket,
    description: 'Great for small projects',
    features: [
      { name: '25 Projects', included: true },
      { name: '10 GB Storage', included: true },
      { name: '100,000 API Calls/month', included: true },
      { name: 'Email Support', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'Custom Domains', included: true },
      { name: 'Priority Support', included: false },
      { name: 'Team Collaboration', included: false },
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    annualPrice: 990,
    icon: Crown,
    description: 'For professionals and growing teams',
    features: [
      { name: 'Unlimited Projects', included: true },
      { name: '100 GB Storage', included: true },
      { name: '1,000,000 API Calls/month', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Custom Domains', included: true },
      { name: '5 Team Members', included: true },
      { name: 'API Access', included: true },
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    annualPrice: 2990,
    icon: Building,
    description: 'For large organizations',
    features: [
      { name: 'Unlimited Everything', included: true },
      { name: 'Unlimited Storage', included: true },
      { name: 'Unlimited API Calls', included: true },
      { name: 'Dedicated Support', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Custom Domains', included: true },
      { name: 'Unlimited Team Members', included: true },
      { name: 'SLA Guarantee', included: true },
    ],
    popular: false,
  },
]

const addOns = [
  { id: 'storage-50', name: 'Additional Storage (50GB)', price: 9.99, icon: Database, description: 'Add extra storage for your projects' },
  { id: 'storage-100', name: 'Additional Storage (100GB)', price: 17.99, icon: Database, description: 'More storage for growing needs' },
  { id: 'api-calls', name: 'Extra API Calls (100k)', price: 4.99, icon: Zap, description: 'Increase your API quota' },
  { id: 'team-member', name: 'Additional Team Member', price: 12.99, icon: Users, description: 'Add more collaborators' },
  { id: 'priority-support', name: 'Priority Support', price: 29.99, icon: Shield, description: '24/7 dedicated support' },
  { id: 'white-label', name: 'White Label', price: 49.99, icon: Star, description: 'Remove branding' },
  { id: 'custom-domain', name: 'Custom Domain', price: 5.99, icon: Globe, description: 'Use your own domain' },
  { id: 'advanced-analytics', name: 'Advanced Analytics', price: 19.99, icon: BarChart3, description: 'Detailed insights and reports' },
  { id: 'sso', name: 'Single Sign-On', price: 39.99, icon: Lock, description: 'Enterprise SSO integration' },
  { id: 'backup', name: 'Automated Backups', price: 14.99, icon: Database, description: 'Daily automated backups' },
]

const usageData = [
  { name: 'Projects', used: 12, limit: 25, unit: 'projects', percentage: 48 },
  { name: 'Storage', used: 6.5, limit: 10, unit: 'GB', percentage: 65 },
  { name: 'API Calls', used: 45000, limit: 100000, unit: 'calls', percentage: 45 },
  { name: 'Team Members', used: 3, limit: 5, unit: 'members', percentage: 60 },
]

const planHistory = [
  { date: '2025-01-01', action: 'Upgraded to Pro', from: 'Starter', to: 'Pro', amount: 99 },
  { date: '2024-06-15', action: 'Added Storage Add-on', from: null, to: 'Storage 50GB', amount: 9.99 },
  { date: '2024-01-01', action: 'Subscribed to Starter', from: 'Free', to: 'Starter', amount: 29 },
]

function Building(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}

export default function SubscriptionManagementPage() {
  const [currentPlan, setCurrentPlan] = useState('pro')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(['storage-50'])
  const [showCancellation, setShowCancellation] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const currentPlanData = plans.find(p => p.id === currentPlan)!
  const daysUntilRenewal = 23

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev =>
      prev.includes(id)
        ? prev.filter(addon => addon !== id)
        : [...prev, id]
    )
    toast.success(
      selectedAddOns.includes(id)
        ? 'Add-on removed'
        : 'Add-on added to your subscription'
    )
  }

  const calculateTotal = () => {
    const planPrice = billingCycle === 'monthly'
      ? currentPlanData.price
      : currentPlanData.annualPrice / 12

    const addOnTotal = selectedAddOns.reduce((sum, id) => {
      const addOn = addOns.find(a => a.id === id)
      return sum + (addOn?.price || 0)
    }, 0)

    return planPrice + addOnTotal
  }

  const handlePlanChange = (newPlan: string) => {
    const oldPlan = plans.find(p => p.id === currentPlan)
    const newPlanData = plans.find(p => p.id === newPlan)

    if (oldPlan && newPlanData) {
      if (newPlanData.price > oldPlan.price) {
        toast.success(`Upgraded to ${newPlanData.name} plan!`)
      } else {
        toast.success(`Downgraded to ${newPlanData.name} plan. Changes take effect next billing cycle.`)
      }
    }

    setCurrentPlan(newPlan)
  }

  const handlePause = () => {
    toast.success('Subscription paused. You can resume anytime.')
  }

  const handleCancel = () => {
    toast.error('Subscription cancelled. Access until end of billing period.')
    setShowCancellation(false)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow mb-2">Subscription Management</h1>
            <p className="text-muted-foreground">Manage your plan and add-ons</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="glass">
              <History className="w-4 h-4 mr-2" />
              Billing History
            </Button>
          </div>
        </motion.div>

        {/* Current Plan Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-overlay border-glow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                    {currentPlanData.icon && <currentPlanData.icon className="w-8 h-8 text-primary" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{currentPlanData.name} Plan</h2>
                      {currentPlanData.popular && (
                        <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{currentPlanData.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Renews in {daysUntilRenewal} days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span>Visa •••• 4242</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-3xl font-bold">
                      ${calculateTotal().toFixed(2)}
                      <span className="text-lg text-muted-foreground font-normal">/month</span>
                    </p>
                    {billingCycle === 'annual' && (
                      <p className="text-sm text-green-500">Save 17% with annual billing</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="glass">
                          <PauseCircle className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-overlay">
                        <DialogHeader>
                          <DialogTitle>Pause Subscription</DialogTitle>
                          <DialogDescription>
                            Temporarily pause your subscription. You can resume anytime.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-muted-foreground">
                            Your subscription will be paused immediately. You won't be charged during the pause period,
                            but you'll lose access to premium features.
                          </p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button onClick={handlePause}>Pause Subscription</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog open={showCancellation} onOpenChange={setShowCancellation}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass-overlay">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                          <AlertDialogDescription>
                            We're sorry to see you go. Your subscription will remain active until the end of your current billing period.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4">
                          <Label>Why are you cancelling? (Optional)</Label>
                          <textarea
                            className="w-full mt-2 p-3 rounded-lg glass border border-border"
                            rows={3}
                            placeholder="Let us know how we can improve..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                          <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground">
                            Cancel Subscription
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-overlay">
            <CardHeader>
              <CardTitle>Current Usage</CardTitle>
              <CardDescription>Track your usage across all features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {usageData.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <Label>{item.name}</Label>
                      <span className="text-sm text-muted-foreground">
                        {item.used.toLocaleString()} / {item.limit.toLocaleString()} {item.unit}
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {item.percentage}% used
                      {item.percentage > 80 && (
                        <span className="text-yellow-500 ml-2">⚠️ Consider upgrading</span>
                      )}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing Cycle Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="glass-overlay rounded-full p-1.5 inline-flex">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                "rounded-full transition-all",
                billingCycle === 'monthly' ? '' : 'glass'
              )}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === 'annual' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('annual')}
              className={cn(
                "rounded-full transition-all",
                billingCycle === 'annual' ? '' : 'glass'
              )}
            >
              Annual
              <Badge className="ml-2 bg-green-500 text-white">Save 17%</Badge>
            </Button>
          </div>
        </motion.div>

        {/* Plans Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const isCurrent = plan.id === currentPlan
            const price = billingCycle === 'monthly' ? plan.price : plan.annualPrice

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className={cn(
                  "glass-overlay transition-all h-full flex flex-col",
                  isCurrent && "border-primary border-2 border-glow",
                  plan.popular && "ring-2 ring-primary/50"
                )}>
                  <CardHeader>
                    {plan.popular && (
                      <Badge className="w-fit bg-primary text-primary-foreground mb-2">
                        Most Popular
                      </Badge>
                    )}
                    {isCurrent && (
                      <Badge className="w-fit bg-green-500 text-white mb-2">
                        Current Plan
                      </Badge>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="text-3xl font-bold">${price}</span>
                      <span className="text-muted-foreground">
                        {billingCycle === 'monthly' ? '/month' : '/year'}
                      </span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          )}
                          <span className={cn(
                            "text-sm",
                            !feature.included && "text-muted-foreground"
                          )}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full mt-6"
                      variant={isCurrent ? 'outline' : plan.popular ? 'default' : 'outline'}
                      onClick={() => !isCurrent && handlePlanChange(plan.id)}
                      disabled={isCurrent}
                    >
                      {isCurrent ? (
                        'Current Plan'
                      ) : plan.price > currentPlanData.price ? (
                        <>
                          <ArrowUpRight className="w-4 h-4 mr-2" />
                          Upgrade
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="w-4 h-4 mr-2" />
                          Downgrade
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Add-ons Marketplace */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="glass-overlay">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Add-ons Marketplace
              </CardTitle>
              <CardDescription>Enhance your plan with additional features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {addOns.map((addOn, index) => {
                  const Icon = addOn.icon
                  const isSelected = selectedAddOns.includes(addOn.id)

                  return (
                    <motion.div
                      key={addOn.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + index * 0.05 }}
                      className={cn(
                        "glass rounded-xl p-4 cursor-pointer transition-all hover:border-primary/50",
                        isSelected && "border-primary border-2"
                      )}
                      onClick={() => toggleAddOn(addOn.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        {isSelected && (
                          <Badge className="bg-green-500 text-white">Active</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1">{addOn.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{addOn.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">${addOn.price}/mo</span>
                        <Button
                          size="sm"
                          variant={isSelected ? 'destructive' : 'default'}
                        >
                          {isSelected ? (
                            <>
                              <Minus className="w-3 h-3 mr-1" />
                              Remove
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Plan History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card className="glass-overlay">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Plan Change History
              </CardTitle>
              <CardDescription>Your subscription changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planHistory.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 glass rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        {item.from && ` • ${item.from} → ${item.to}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${item.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">per month</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}

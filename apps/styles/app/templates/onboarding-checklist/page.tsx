"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/ThemeProvider"
import {
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  Trophy,
  Star,
  Target,
  Rocket,
  User,
  Mail,
  Shield,
  CreditCard,
  Users,
  Settings,
  Zap,
  FileText,
  Video,
  Bell,
  SkipForward,
  RotateCcw,
  Play,
  ArrowRight,
  Award,
  TrendingUp,
  PartyPopper,
  Flame,
  Gift,
  Bookmark,
  Upload,
  Download,
  ExternalLink,
  HelpCircle,
  Info,
  AlertCircle,
  MessageSquare,
  Share2,
  Copy,
  Eye,
  Lock,
  Unlock,
  Calendar,
  Link2,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Progress, Separator, Switch, Checkbox } from "@ggprompts/ui"

interface ChecklistItem {
  id: string
  title: string
  description: string
  estimatedTime: string
  icon: any
  category: "setup" | "learn" | "engage"
  completed: boolean
  skipped: boolean
  expanded: boolean
  quickActions: {
    label: string
    icon: any
    action: string
  }[]
  tips?: string[]
}

const initialChecklistItems: ChecklistItem[] = [
  {
    id: "profile",
    title: "Complete Your Profile",
    description: "Add your photo, bio, and contact information to personalize your account.",
    estimatedTime: "5 min",
    icon: User,
    category: "setup",
    completed: false,
    skipped: false,
    expanded: false,
    quickActions: [
      { label: "Edit Profile", icon: User, action: "edit-profile" },
      { label: "Upload Photo", icon: Upload, action: "upload-photo" },
    ],
    tips: ["A complete profile increases trust by 85%", "Add social links to boost credibility"],
  },
  {
    id: "verify-email",
    title: "Verify Your Email",
    description: "Confirm your email address to unlock all features and ensure account security.",
    estimatedTime: "2 min",
    icon: Mail,
    category: "setup",
    completed: false,
    skipped: false,
    expanded: false,
    quickActions: [
      { label: "Resend Email", icon: Mail, action: "resend-email" },
      { label: "Change Email", icon: Settings, action: "change-email" },
    ],
    tips: ["Check your spam folder", "Verification expires in 24 hours"],
  },
  {
    id: "2fa",
    title: "Enable Two-Factor Authentication",
    description: "Add an extra layer of security to protect your account from unauthorized access.",
    estimatedTime: "3 min",
    icon: Shield,
    category: "setup",
    completed: false,
    skipped: false,
    expanded: false,
    quickActions: [
      { label: "Setup 2FA", icon: Shield, action: "setup-2fa" },
      { label: "Learn More", icon: HelpCircle, action: "learn-2fa" },
    ],
    tips: ["Use an authenticator app for best security", "Save backup codes in a safe place"],
  },
  {
    id: "billing",
    title: "Add Payment Method",
    description: "Add a payment method to unlock premium features and avoid service interruption.",
    estimatedTime: "4 min",
    icon: CreditCard,
    category: "setup",
    completed: false,
    skipped: false,
    expanded: false,
    quickActions: [
      { label: "Add Card", icon: CreditCard, action: "add-card" },
      { label: "View Plans", icon: TrendingUp, action: "view-plans" },
    ],
    tips: ["First month is free", "Cancel anytime without fees"],
  },
  {
    id: "invite-team",
    title: "Invite Team Members",
    description: "Collaborate better by inviting your team. Share workspaces and work together.",
    estimatedTime: "5 min",
    icon: Users,
    category: "engage",
    completed: false,
    skipped: false,
    expanded: false,
    quickActions: [
      { label: "Invite", icon: Mail, action: "invite-team" },
      { label: "Copy Link", icon: Copy, action: "copy-invite" },
    ],
    tips: ["Free plan includes up to 3 members", "Team members get instant access"],
  },
  {
    id: "watch-tutorial",
    title: "Watch Getting Started Video",
    description: "Learn the basics with our 5-minute tutorial video covering key features.",
    estimatedTime: "5 min",
    icon: Video,
    category: "learn",
    completed: false,
    skipped: false,
    expanded: false,
    quickActions: [
      { label: "Watch Now", icon: Play, action: "watch-video" },
      { label: "Read Guide", icon: FileText, action: "read-guide" },
    ],
    tips: ["Available in 12 languages", "Earn achievement badge after watching"],
  },
  {
    id: "first-project",
    title: "Create Your First Project",
    description: "Start using the platform by creating your first project or workspace.",
    estimatedTime: "8 min",
    icon: Rocket,
    category: "engage",
    completed: false,
    skipped: false,
    expanded: false,
    quickActions: [
      { label: "New Project", icon: Rocket, action: "new-project" },
      { label: "Use Template", icon: FileText, action: "use-template" },
    ],
    tips: ["Choose from 50+ templates", "Projects are automatically saved"],
  },
  {
    id: "customize",
    title: "Customize Your Settings",
    description: "Personalize your experience with theme, language, and notification preferences.",
    estimatedTime: "4 min",
    icon: Settings,
    category: "setup",
    completed: false,
    skipped: false,
    expanded: false,
    quickActions: [
      { label: "Settings", icon: Settings, action: "open-settings" },
      { label: "Themes", icon: Sparkles, action: "view-themes" },
    ],
    tips: ["4 beautiful themes available", "Dark mode saves battery on mobile"],
  },
  {
    id: "integrations",
    title: "Connect Your Tools",
    description: "Integrate with Slack, GitHub, and other tools you already use daily.",
    estimatedTime: "6 min",
    icon: Zap,
    category: "setup",
    completed: false,
    skipped: false,
    expanded: false,
    quickActions: [
      { label: "Browse Apps", icon: Zap, action: "browse-apps" },
      { label: "Connect", icon: Link2, action: "connect-app" },
    ],
    tips: ["20+ integrations available", "Sync data automatically"],
  },
  {
    id: "docs",
    title: "Read Documentation",
    description: "Explore our comprehensive docs to learn about advanced features and tips.",
    estimatedTime: "10 min",
    icon: FileText,
    category: "learn",
    completed: false,
    skipped: false,
    expanded: false,
    quickActions: [
      { label: "Open Docs", icon: FileText, action: "open-docs" },
      { label: "Shortcuts", icon: Zap, action: "view-shortcuts" },
    ],
    tips: ["Searchable documentation", "Code examples included"],
  },
  {
    id: "notifications",
    title: "Configure Notifications",
    description: "Choose how and when you want to be notified about important updates.",
    estimatedTime: "3 min",
    icon: Bell,
    category: "setup",
    completed: false,
    skipped: false,
    expanded: false,
    quickActions: [
      { label: "Preferences", icon: Bell, action: "notification-prefs" },
      { label: "Test", icon: AlertCircle, action: "test-notification" },
    ],
    tips: ["Quiet hours feature available", "Get notifications via email, SMS, or push"],
  },
  {
    id: "share",
    title: "Share Your First Update",
    description: "Post your first update, share progress, or start a discussion with your team.",
    estimatedTime: "5 min",
    icon: MessageSquare,
    category: "engage",
    completed: false,
    skipped: false,
    expanded: false,
    quickActions: [
      { label: "New Post", icon: MessageSquare, action: "new-post" },
      { label: "Examples", icon: Eye, action: "view-examples" },
    ],
    tips: ["Use @mentions to notify team members", "Add images and files"],
  },
]

const milestones = [
  { percentage: 25, title: "Getting Started", icon: Rocket, reward: "Beginner Badge" },
  { percentage: 50, title: "Halfway There", icon: Target, reward: "+50 Points" },
  { percentage: 75, title: "Almost Done", icon: TrendingUp, reward: "Pro Badge" },
  { percentage: 100, title: "Onboarding Complete", icon: Trophy, reward: "Expert Badge + Bonus" },
]

export default function OnboardingChecklistTemplate() {
  const { theme } = useTheme()
  const [items, setItems] = useState<ChecklistItem[]>(initialChecklistItems)
  const [showReminders, setShowReminders] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)
  const [lastMilestone, setLastMilestone] = useState(0)
  const [allExpanded, setAllExpanded] = useState(false)

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.filter((item) => !item.skipped).length
  const progress = (completedCount / items.length) * 100
  const activeProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  useEffect(() => {
    // Check for milestone achievements
    const currentMilestone = milestones.findIndex((m, i) => progress >= m.percentage && progress < (milestones[i + 1]?.percentage || 101))
    if (currentMilestone > lastMilestone) {
      setShowCelebration(true)
      setLastMilestone(currentMilestone)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [progress])

  const toggleComplete = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed, skipped: false } : item
      )
    )
  }

  const toggleSkip = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, skipped: !item.skipped, completed: false } : item
      )
    )
  }

  const toggleExpanded = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, expanded: !item.expanded } : item)))
  }

  const toggleExpandAll = () => {
    setAllExpanded(!allExpanded)
    setItems(items.map((item) => ({ ...item, expanded: !allExpanded })))
  }

  const resetProgress = () => {
    setItems(initialChecklistItems)
    setLastMilestone(0)
    setShowCelebration(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "setup":
        return "text-primary"
      case "learn":
        return "text-blue-500"
      case "engage":
        return "text-purple-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "setup":
        return "Setup"
      case "learn":
        return "Learn"
      case "engage":
        return "Engage"
      default:
        return category
    }
  }

  const groupedItems = {
    setup: items.filter((item) => item.category === "setup"),
    learn: items.filter((item) => item.category === "learn"),
    engage: items.filter((item) => item.category === "engage"),
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="inline-flex items-center justify-center p-4 rounded-full glass border-glow mb-4"
          >
            <Rocket className="h-8 w-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow mb-2">Welcome Onboarding</h1>
          <p className="text-muted-foreground">Complete these tasks to get the most out of your account</p>
        </div>

        {/* Progress Card */}
        <Card className="glass-overlay border-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold terminal-glow">Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {completedCount} of {items.length} tasks completed
                </p>
              </div>
              <div className="relative">
                <svg className="h-24 w-24 -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/20"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-primary"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - progress / 100) }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold terminal-glow">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {milestones.map((milestone, index) => {
                const isAchieved = progress >= milestone.percentage
                return (
                  <motion.div
                    key={milestone.percentage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isAchieved
                        ? "border-primary bg-primary/10"
                        : "border-border/50 glass"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <milestone.icon
                        className={`h-5 w-5 ${isAchieved ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span className="text-xs font-medium">{milestone.percentage}%</span>
                    </div>
                    <p className="text-xs font-medium mb-1">{milestone.title}</p>
                    <Badge variant={isAchieved ? "default" : "outline"} className="text-[10px] h-5">
                      {isAchieved ? <Check className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                      {milestone.reward}
                    </Badge>
                  </motion.div>
                )
              })}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-muted-foreground">
                  {items.filter((i) => !i.completed && !i.skipped).length}
                </p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-muted-foreground">
                  {items.filter((i) => i.skipped).length}
                </p>
                <p className="text-xs text-muted-foreground">Skipped</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={toggleExpandAll}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {allExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
            <div className="flex items-center gap-2">
              <Switch
                id="reminders"
                checked={showReminders}
                onCheckedChange={setShowReminders}
              />
              <label htmlFor="reminders" className="text-sm text-muted-foreground">
                Show reminders
              </label>
            </div>
          </div>
          <Button onClick={resetProgress} variant="outline" size="sm" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset Progress
          </Button>
        </div>

        {/* Checklist Items by Category */}
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold capitalize">{category}</h3>
                <Badge variant="outline" className="text-[10px]">
                  {categoryItems.filter((i) => i.completed).length} / {categoryItems.length}
                </Badge>
              </div>

              <div className="space-y-3">
                {categoryItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`transition-all ${
                        item.completed
                          ? "glass border-primary/50"
                          : item.skipped
                          ? "glass opacity-50"
                          : "glass-overlay border-glow"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <div className="flex items-center gap-3 pt-1">
                            <motion.button
                              onClick={() => toggleComplete(item.id)}
                              className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                item.completed
                                  ? "bg-primary border-primary"
                                  : "border-border hover:border-primary"
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {item.completed && <Check className="h-4 w-4 text-primary-foreground" />}
                            </motion.button>
                            <div className={`p-2 rounded-lg ${item.completed ? "bg-primary/20" : "bg-muted/20"}`}>
                              <item.icon className={`h-5 w-5 ${getCategoryColor(item.category)}`} />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <h4
                                  className={`font-semibold mb-1 ${
                                    item.completed ? "line-through text-muted-foreground" : ""
                                  }`}
                                >
                                  {item.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="gap-1 whitespace-nowrap">
                                  <Clock className="h-3 w-3" />
                                  {item.estimatedTime}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleExpanded(item.id)}
                                  className="h-8 w-8"
                                >
                                  {item.expanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* Expanded content */}
                            <AnimatePresence>
                              {item.expanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pt-3 space-y-3">
                                    {/* Quick actions */}
                                    <div className="flex flex-wrap gap-2">
                                      {item.quickActions.map((action) => (
                                        <Button
                                          key={action.action}
                                          variant="outline"
                                          size="sm"
                                          className="gap-2"
                                        >
                                          <action.icon className="h-3 w-3" />
                                          {action.label}
                                        </Button>
                                      ))}
                                    </div>

                                    {/* Tips */}
                                    {item.tips && item.tips.length > 0 && (
                                      <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                                        <div className="flex items-start gap-2">
                                          <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                          <div className="text-xs space-y-1">
                                            <p className="font-medium">Pro Tips:</p>
                                            <ul className="text-muted-foreground space-y-0.5">
                                              {item.tips.map((tip, i) => (
                                                <li key={i}>• {tip}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Skip option */}
                                    {!item.completed && !item.skipped && (
                                      <Button
                                        onClick={() => toggleSkip(item.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="gap-2 text-muted-foreground"
                                      >
                                        <SkipForward className="h-3 w-3" />
                                        Skip this task
                                      </Button>
                                    )}

                                    {item.skipped && (
                                      <Button
                                        onClick={() => toggleSkip(item.id)}
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                      >
                                        <RotateCcw className="h-3 w-3" />
                                        Unskip this task
                                      </Button>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Reminder card */}
        {showReminders && completedCount < items.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass border-primary/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Keep Going!</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      You're {Math.round(progress)}% complete. Finish your onboarding to unlock all features and
                      earn rewards.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Calendar className="h-3 w-3" />
                        Set Reminder
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowReminders(false)}>
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-lg pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 0.3,
                }}
              >
                {milestones[lastMilestone] && (() => {
                  const MilestoneIcon = milestones[lastMilestone].icon
                  return <MilestoneIcon className="h-32 w-32 text-primary mx-auto mb-4" />
                })()}
              </motion.div>
              <h2 className="text-3xl font-bold terminal-glow mb-2">
                {milestones[lastMilestone]?.title}!
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                You've earned: {milestones[lastMilestone]?.reward}
              </p>
              <div className="flex gap-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="h-8 w-8 text-primary fill-primary" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

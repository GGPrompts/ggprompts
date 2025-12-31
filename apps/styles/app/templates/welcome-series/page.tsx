"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/ThemeProvider"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  Video,
  FileText,
  Award,
  Star,
  Sparkles,
  Rocket,
  Target,
  Zap,
  Users,
  Settings,
  TrendingUp,
  BookOpen,
  Play,
  Pause,
  SkipForward,
  Eye,
  EyeOff,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Download,
  Share2,
  Clock,
  Calendar,
  ArrowRight,
  Gift,
  Trophy,
  Flame,
  Shield,
  Lock,
  Unlock,
  CheckCircle2,
  Circle,
  Bell,
  BellOff,
  Heart,
  MessageSquare,
  Code,
  Terminal,
  Lightbulb,
  Compass,
  Map,
  Flag,
  PartyPopper,
  Crown,
  Medal,
  Gem,
  Link2,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Send,
  ArrowUpRight,
  User,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Progress, Separator, Tabs, TabsContent, TabsList, TabsTrigger, Switch } from "@ggprompts/ui"

interface DayContent {
  day: number
  title: string
  subtitle: string
  icon: any
  theme: string
  completed: boolean
  email: {
    subject: string
    preview: string
    content: string[]
    cta: { label: string; icon: any }
  }
  video?: {
    title: string
    duration: string
    thumbnail: string
    url: string
    watched: boolean
  }
  tips: {
    title: string
    items: string[]
  }
  resources: {
    title: string
    description: string
    icon: any
    link: string
  }[]
  achievement?: {
    badge: string
    title: string
    description: string
    icon: any
  }
}

const welcomeSeries: DayContent[] = [
  {
    day: 1,
    title: "Welcome to the Community",
    subtitle: "Your journey begins today",
    icon: Rocket,
    theme: "primary",
    completed: false,
    email: {
      subject: "🎉 Welcome! Let's get you started",
      preview: "We're excited to have you here. Here's everything you need to know...",
      content: [
        "Welcome to our community! We're thrilled to have you join us.",
        "Over the next 7 days, we'll guide you through everything you need to know to make the most of your experience.",
        "Today, let's start with the basics: setting up your profile, exploring the dashboard, and understanding key features.",
        "Don't worry if it feels like a lot – we're here to help every step of the way!",
      ],
      cta: { label: "Complete Your Profile", icon: User },
    },
    video: {
      title: "Getting Started in 5 Minutes",
      duration: "5:23",
      thumbnail: "/videos/day1-thumb.jpg",
      url: "/videos/day1.mp4",
      watched: false,
    },
    tips: {
      title: "Day 1 Quick Wins",
      items: [
        "Upload a profile photo to increase trust by 85%",
        "Complete your bio to help others connect with you",
        "Verify your email to unlock all features",
        "Join 2-3 communities that interest you",
      ],
    },
    resources: [
      {
        title: "Quick Start Guide",
        description: "Essential steps to get up and running",
        icon: FileText,
        link: "/docs/quick-start",
      },
      {
        title: "Feature Overview",
        description: "What you can do with your account",
        icon: Sparkles,
        link: "/docs/features",
      },
    ],
  },
  {
    day: 2,
    title: "Master the Basics",
    subtitle: "Essential features you'll use daily",
    icon: Target,
    theme: "blue",
    completed: false,
    email: {
      subject: "📚 Day 2: Master the core features",
      preview: "Learn the essential tools you'll use every day...",
      content: [
        "Great progress yesterday! Today we're diving into the features you'll use most.",
        "We'll cover: creating your first project, navigating the dashboard, using keyboard shortcuts, and customizing your workspace.",
        "These fundamentals will save you hours of time and make your workflow much smoother.",
        "Pro tip: Most power users say learning shortcuts is the #1 productivity boost!",
      ],
      cta: { label: "Explore Features", icon: Compass },
    },
    video: {
      title: "Essential Features Tutorial",
      duration: "8:45",
      thumbnail: "/videos/day2-thumb.jpg",
      url: "/videos/day2.mp4",
      watched: false,
    },
    tips: {
      title: "Productivity Boosters",
      items: [
        "Press ? to see all keyboard shortcuts",
        "Use Cmd/Ctrl + K for quick search",
        "Star your favorite projects for quick access",
        "Enable notifications for important updates",
      ],
    },
    resources: [
      {
        title: "Keyboard Shortcuts",
        description: "Work faster with these shortcuts",
        icon: Terminal,
        link: "/docs/shortcuts",
      },
      {
        title: "Best Practices",
        description: "Tips from experienced users",
        icon: Lightbulb,
        link: "/docs/best-practices",
      },
    ],
    achievement: {
      badge: "Quick Learner",
      title: "Day 2 Complete",
      description: "You're mastering the basics!",
      icon: Star,
    },
  },
  {
    day: 3,
    title: "Collaborate with Your Team",
    subtitle: "Working better together",
    icon: Users,
    theme: "purple",
    completed: false,
    email: {
      subject: "👥 Day 3: Team collaboration made easy",
      preview: "Discover how to work seamlessly with your team...",
      content: [
        "You're making great progress! Today is all about collaboration.",
        "Learn how to invite team members, share projects, use comments and mentions, and track team activity.",
        "Great teamwork starts with great tools. We've built features that make collaboration natural and efficient.",
        "Fun fact: Teams who use our collaboration features report 40% faster project completion!",
      ],
      cta: { label: "Invite Your Team", icon: Users },
    },
    video: {
      title: "Team Collaboration Best Practices",
      duration: "7:12",
      thumbnail: "/videos/day3-thumb.jpg",
      url: "/videos/day3.mp4",
      watched: false,
    },
    tips: {
      title: "Collaboration Tips",
      items: [
        "Use @mentions to notify specific team members",
        "Create shared workspaces for projects",
        "Set up team permissions and roles",
        "Use comments for async communication",
      ],
    },
    resources: [
      {
        title: "Team Management",
        description: "How to organize your team effectively",
        icon: Users,
        link: "/docs/team",
      },
      {
        title: "Permissions Guide",
        description: "Control access and security",
        icon: Shield,
        link: "/docs/permissions",
      },
    ],
  },
  {
    day: 4,
    title: "Customize Your Workflow",
    subtitle: "Make it work your way",
    icon: Settings,
    theme: "amber",
    completed: false,
    email: {
      subject: "⚙️ Day 4: Customize everything to fit your needs",
      preview: "Personalize your experience for maximum productivity...",
      content: [
        "Halfway through the series! Today we're focusing on customization.",
        "Discover themes, notification settings, integrations, dashboard layouts, and advanced preferences.",
        "The best tools adapt to you, not the other way around. Let's make this platform truly yours.",
        "Power tip: Users who customize their workspace are 2x more likely to stick with it long-term!",
      ],
      cta: { label: "Open Settings", icon: Settings },
    },
    video: {
      title: "Advanced Customization Guide",
      duration: "6:30",
      thumbnail: "/videos/day4-thumb.jpg",
      url: "/videos/day4.mp4",
      watched: false,
    },
    tips: {
      title: "Customization Ideas",
      items: [
        "Choose a theme that matches your vibe",
        "Set up custom notification rules",
        "Connect your favorite integrations",
        "Create custom dashboards for different projects",
      ],
    },
    resources: [
      {
        title: "Themes Gallery",
        description: "Browse and customize themes",
        icon: Sparkles,
        link: "/themes",
      },
      {
        title: "Integrations",
        description: "Connect your favorite tools",
        icon: Zap,
        link: "/integrations",
      },
    ],
    achievement: {
      badge: "Customizer",
      title: "Workflow Master",
      description: "You've personalized your experience!",
      icon: Crown,
    },
  },
  {
    day: 5,
    title: "Advanced Features",
    subtitle: "Level up your skills",
    icon: Zap,
    theme: "cyan",
    completed: false,
    email: {
      subject: "⚡ Day 5: Unlock advanced features",
      preview: "Ready to become a power user? Let's dive deep...",
      content: [
        "You've mastered the basics – now it's time for advanced techniques!",
        "Today: automation, API access, advanced search, bulk operations, and hidden features.",
        "These power features separate casual users from experts. You're about to join the expert club!",
        "Did you know? Our API powers over 10,000 integrations across the ecosystem.",
      ],
      cta: { label: "Explore API Docs", icon: Code },
    },
    video: {
      title: "Power User Secrets",
      duration: "9:15",
      thumbnail: "/videos/day5-thumb.jpg",
      url: "/videos/day5.mp4",
      watched: false,
    },
    tips: {
      title: "Power User Tricks",
      items: [
        "Set up automations to save hours weekly",
        "Use advanced search with operators",
        "Create API integrations for custom workflows",
        "Utilize bulk actions for efficiency",
      ],
    },
    resources: [
      {
        title: "API Documentation",
        description: "Build custom integrations",
        icon: Code,
        link: "/docs/api",
      },
      {
        title: "Automation Guide",
        description: "Automate repetitive tasks",
        icon: Zap,
        link: "/docs/automation",
      },
    ],
  },
  {
    day: 6,
    title: "Tips & Tricks",
    subtitle: "Hidden gems and shortcuts",
    icon: Lightbulb,
    theme: "green",
    completed: false,
    email: {
      subject: "💡 Day 6: Tips, tricks, and hidden gems",
      preview: "Insider secrets from our most successful users...",
      content: [
        "Almost done with the series! Today we're sharing insider tips.",
        "Learn hidden features, productivity hacks, common mistakes to avoid, and expert workflows.",
        "These are the tips that make the difference between good and great.",
        "Bonus: We've included tips from our top 100 power users!",
      ],
      cta: { label: "View All Tips", icon: Sparkles },
    },
    video: {
      title: "Hidden Features You'll Love",
      duration: "5:50",
      thumbnail: "/videos/day6-thumb.jpg",
      url: "/videos/day6.mp4",
      watched: false,
    },
    tips: {
      title: "Pro Tips",
      items: [
        "Use templates to speed up common tasks",
        "Create reusable snippets and components",
        "Set up smart filters for better organization",
        "Leverage browser extensions for extra features",
      ],
    },
    resources: [
      {
        title: "Template Library",
        description: "Start faster with templates",
        icon: FileText,
        link: "/templates",
      },
      {
        title: "Community Tips",
        description: "Learn from other users",
        icon: MessageSquare,
        link: "/community/tips",
      },
    ],
    achievement: {
      badge: "Pro Explorer",
      title: "Hidden Gems Found",
      description: "You've discovered advanced features!",
      icon: Gem,
    },
  },
  {
    day: 7,
    title: "Your Journey Continues",
    subtitle: "Next steps and resources",
    icon: Trophy,
    theme: "gradient",
    completed: false,
    email: {
      subject: "🏆 Day 7: You've completed the welcome series!",
      preview: "Congratulations! Here's what comes next...",
      content: [
        "Congratulations on completing the welcome series! 🎉",
        "You've learned the essentials, mastered advanced features, and discovered hidden gems.",
        "But this is just the beginning! Continue exploring, join the community, and keep learning.",
        "Remember: We're always here to help. Reach out anytime you need support.",
        "Thank you for being part of our community. We can't wait to see what you build!",
      ],
      cta: { label: "View Your Dashboard", icon: Rocket },
    },
    video: {
      title: "What's Next: Your Success Path",
      duration: "4:20",
      thumbnail: "/videos/day7-thumb.jpg",
      url: "/videos/day7.mp4",
      watched: false,
    },
    tips: {
      title: "Continue Your Journey",
      items: [
        "Join our weekly webinars for live demos",
        "Connect with the community in our forum",
        "Subscribe to our newsletter for updates",
        "Share your success story with others",
      ],
    },
    resources: [
      {
        title: "Community Forum",
        description: "Connect with other users",
        icon: MessageSquare,
        link: "/community",
      },
      {
        title: "Advanced Courses",
        description: "Take your skills further",
        icon: BookOpen,
        link: "/learn",
      },
      {
        title: "Support Center",
        description: "Get help when you need it",
        icon: Heart,
        link: "/support",
      },
    ],
    achievement: {
      badge: "Graduate",
      title: "Welcome Series Complete",
      description: "You're now a certified power user!",
      icon: Trophy,
    },
  },
]

export default function WelcomeSeriesTemplate() {
  const { theme } = useTheme()
  const [currentDay, setCurrentDay] = useState(0)
  const [series, setSeries] = useState(welcomeSeries)
  const [subscribed, setSubscribed] = useState(true)
  const [showAchievement, setShowAchievement] = useState(false)

  const day = series[currentDay]
  const completedCount = series.filter((d) => d.completed).length
  const progress = (completedCount / series.length) * 100

  const markAsRead = () => {
    const newSeries = [...series]
    newSeries[currentDay].completed = true
    setSeries(newSeries)

    // Show achievement if day has one
    if (day.achievement) {
      setShowAchievement(true)
      setTimeout(() => setShowAchievement(false), 3000)
    }

    // Auto-advance to next unread day
    const nextUnread = series.findIndex((d, i) => i > currentDay && !d.completed)
    if (nextUnread !== -1) {
      setTimeout(() => setCurrentDay(nextUnread), 500)
    }
  }

  const markVideoWatched = () => {
    if (day.video) {
      const newSeries = [...series]
      newSeries[currentDay].video!.watched = true
      setSeries(newSeries)
    }
  }

  const goToDay = (dayIndex: number) => {
    setCurrentDay(dayIndex)
  }

  const nextLesson = () => {
    if (currentDay < series.length - 1) {
      setCurrentDay(currentDay + 1)
    }
  }

  const previousLesson = () => {
    if (currentDay > 0) {
      setCurrentDay(currentDay - 1)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="inline-flex items-center justify-center p-4 rounded-full glass border-glow mb-4"
          >
            <Mail className="h-8 w-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold terminal-glow mb-2 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">7-Day Welcome Series</h1>
          <p className="text-muted-foreground">
            Your guided journey to becoming a power user
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="glass-overlay border-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Day {currentDay + 1} of {series.length} • {completedCount} lessons completed
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="subscribe"
                  checked={subscribed}
                  onCheckedChange={setSubscribed}
                />
                <label htmlFor="subscribe" className="text-sm">
                  {subscribed ? (
                    <span className="flex items-center gap-1">
                      <Bell className="h-4 w-4" />
                      Subscribed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <BellOff className="h-4 w-4" />
                      Unsubscribed
                    </span>
                  )}
                </label>
              </div>
            </div>

            <Progress value={progress} className="h-2 mb-4" />

            {/* Day indicators */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {series.map((d, index) => (
                <motion.button
                  key={d.day}
                  onClick={() => goToDay(index)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 transition-all ${
                    index === currentDay
                      ? "border-primary bg-primary/10"
                      : d.completed
                      ? "border-primary/50 bg-primary/5"
                      : "border-border glass"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    {d.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">Day {d.day}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDay}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Day header */}
                <Card className="glass-overlay border-glow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-primary/20 border border-primary/30`}>
                          <day.icon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">Day {day.day}</Badge>
                            {day.completed && (
                              <Badge className="bg-primary">
                                <Check className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="terminal-glow">{day.title}</CardTitle>
                          <CardDescription>{day.subtitle}</CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={day.completed ? "text-primary" : "text-muted-foreground"}
                      >
                        {day.completed ? (
                          <BookmarkCheck className="h-5 w-5" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Email preview */}
                <Card className="glass">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">Email Message</CardTitle>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">{day.email.subject}</p>
                      <p className="text-sm text-muted-foreground">{day.email.preview}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {day.email.content.map((paragraph, index) => (
                      <p key={index} className="text-sm leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                    <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                      <day.email.cta.icon className="h-4 w-4" />
                      {day.email.cta.label}
                      <ExternalLink className="h-4 w-4 ml-auto" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Video tutorial */}
                {day.video && (
                  <Card className="glass">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Video className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">Video Tutorial</CardTitle>
                        </div>
                        {day.video.watched && (
                          <Badge variant="outline" className="gap-1">
                            <Eye className="h-3 w-3" />
                            Watched
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="aspect-video rounded-lg bg-muted/20 border border-border/50 flex items-center justify-center cursor-pointer group relative overflow-hidden"
                        onClick={markVideoWatched}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 text-center">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 border-2 border-primary mb-3"
                          >
                            <Play className="h-8 w-8 text-primary fill-primary" />
                          </motion.div>
                          <p className="font-semibold mb-1">{day.video.title}</p>
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {day.video.duration}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tips & Tricks */}
                <Card className="glass">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{day.tips.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {day.tips.items.map((tip, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Mark as read button */}
                {!day.completed && (
                  <Button
                    onClick={markAsRead}
                    className="w-full gap-2 bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <Check className="h-5 w-5" />
                    Mark as Read & Continue
                  </Button>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    onClick={previousLesson}
                    variant="outline"
                    disabled={currentDay === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous Day
                  </Button>
                  <Button
                    onClick={nextLesson}
                    variant="outline"
                    disabled={currentDay === series.length - 1}
                    className="gap-2"
                  >
                    Next Day
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resources */}
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Resources</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {day.resources.map((resource, index) => (
                  <motion.a
                    key={index}
                    href={resource.link}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg glass-dark border border-border/50 hover:border-primary/50 transition-all group cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <resource.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-0.5">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">{resource.description}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </motion.a>
                ))}
              </CardContent>
            </Card>

            {/* Achievement */}
            {day.achievement && (
              <Card className="glass border-primary/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Achievement</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div
                      className={`inline-flex items-center justify-center p-4 rounded-full mb-3 ${
                        day.completed ? "bg-primary/20 border-2 border-primary" : "bg-muted/20 border-2 border-muted"
                      }`}
                    >
                      <day.achievement.icon
                        className={`h-8 w-8 ${day.completed ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <p className="font-semibold mb-1">{day.achievement.title}</p>
                    <p className="text-sm text-muted-foreground mb-3">{day.achievement.description}</p>
                    <Badge variant={day.completed ? "default" : "outline"} className="gap-1">
                      {day.completed ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      {day.achievement.badge}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress summary */}
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Series Progress</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-lg glass-dark">
                    <p className="text-2xl font-bold text-primary">{completedCount}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="p-3 rounded-lg glass-dark">
                    <p className="text-2xl font-bold text-muted-foreground">
                      {series.length - completedCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Share */}
            <Card className="glass">
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-3">Share your progress</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="flex-1">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Achievement celebration */}
      <AnimatePresence>
        {showAchievement && day.achievement && (
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
                  repeat: 2,
                }}
                className="inline-block mb-4"
              >
                <day.achievement.icon className="h-32 w-32 text-primary" />
              </motion.div>
              <h2 className="text-3xl font-bold terminal-glow mb-2">Achievement Unlocked!</h2>
              <p className="text-lg mb-1">{day.achievement.title}</p>
              <Badge className="text-base px-4 py-1">
                {day.achievement.badge}
              </Badge>
              <div className="flex gap-2 justify-center mt-6">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="h-6 w-6 text-primary fill-primary" />
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

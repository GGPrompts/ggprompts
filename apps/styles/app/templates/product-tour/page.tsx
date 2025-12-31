"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/ThemeProvider"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  SkipForward,
  Sparkles,
  Zap,
  Target,
  Users,
  BarChart3,
  Settings,
  Bell,
  Mail,
  Keyboard,
  Play,
  RotateCcw,
  ArrowRight,
  Trophy,
  Star,
  Rocket,
  Eye,
  MessageSquare,
  FileText,
  Layout,
  Search,
  Filter,
  Download,
  Share2,
} from "lucide-react"

import { Button, Card, CardContent, Badge, Progress } from "@ggprompts/ui"

// Tour step configuration
const tourSteps = [
  {
    id: "welcome",
    title: "Welcome to Your Dashboard",
    description: "Let's take a quick tour of the most powerful features to help you get started.",
    icon: Rocket,
    target: null,
    position: "center",
    highlight: false,
    actions: [
      { label: "Show me", primary: true },
      { label: "Skip tour", primary: false },
    ],
  },
  {
    id: "dashboard",
    title: "Real-time Analytics",
    description: "Track your metrics with beautiful, interactive charts. All data updates in real-time.",
    icon: BarChart3,
    target: "dashboard-card",
    position: "bottom-right",
    highlight: true,
    tip: "Click any chart to see detailed breakdowns",
  },
  {
    id: "search",
    title: "Powerful Search",
    description: "Find anything instantly with our advanced search. Use filters to narrow down results.",
    icon: Search,
    target: "search-bar",
    position: "bottom-center",
    highlight: true,
    tip: "Try using keyboard shortcuts: Cmd/Ctrl + K",
  },
  {
    id: "notifications",
    title: "Stay Updated",
    description: "Never miss important updates. Customize your notification preferences anytime.",
    icon: Bell,
    target: "notifications-icon",
    position: "bottom-left",
    highlight: true,
    tip: "Click the bell icon to view all notifications",
  },
  {
    id: "team",
    title: "Collaborate with Your Team",
    description: "Invite team members, assign roles, and work together seamlessly.",
    icon: Users,
    target: "team-section",
    position: "top-right",
    highlight: true,
    tip: "Premium feature: Up to 50 team members",
  },
  {
    id: "settings",
    title: "Customize Everything",
    description: "Personalize your experience with powerful customization options and preferences.",
    icon: Settings,
    target: "settings-button",
    position: "bottom-right",
    highlight: true,
    tip: "Access settings anytime from the sidebar",
  },
  {
    id: "keyboard",
    title: "Keyboard Shortcuts",
    description: "Work faster with keyboard shortcuts. Press ? to see all available shortcuts.",
    icon: Keyboard,
    target: "keyboard-hint",
    position: "top-center",
    highlight: true,
    tip: "Power users save 2+ hours per week",
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "You've completed the tour. Start exploring and make the most of your dashboard.",
    icon: Trophy,
    target: null,
    position: "center",
    highlight: false,
    actions: [
      { label: "Start exploring", primary: true },
      { label: "Restart tour", primary: false },
    ],
  },
]

export default function ProductTourTemplate() {
  const { theme } = useTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const step = tourSteps[currentStep]
  const progress = ((currentStep + 1) / tourSteps.length) * 100

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return

      if (e.key === "ArrowRight" || e.key === "Enter") {
        handleNext()
      } else if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "Escape") {
        handleSkip()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentStep, isActive])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep])
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    setIsActive(false)
  }

  const handleComplete = () => {
    setShowCelebration(true)
    setTimeout(() => {
      setIsActive(false)
      setShowCelebration(false)
    }, 3000)
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setCompletedSteps([])
    setIsActive(true)
    setShowCelebration(false)
  }

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  if (!isActive && !showCelebration) {
    return (
      <div className="min-h-screen p-8">
        <DemoInterface onStartTour={() => setIsActive(true)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 relative">
      {/* Demo interface in background */}
      <DemoInterface onStartTour={() => setIsActive(true)} />

      {/* Tour overlay */}
      <AnimatePresence>
        {isActive && (
          <>
            {/* Backdrop with spotlight effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 pointer-events-none"
              style={{
                background: step.highlight
                  ? `radial-gradient(circle 300px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), transparent 0%, rgba(0, 0, 0, 0.8) 100%)`
                  : "rgba(0, 0, 0, 0.8)",
              }}
            />

            {/* Tour tooltip */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`fixed z-50 pointer-events-auto ${getPositionClasses(step.position)}`}
            >
              <Card className="glass-overlay max-w-md border-glow">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                        <step.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold terminal-glow">{step.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          Step {currentStep + 1} of {tourSteps.length}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSkip}
                      className="h-8 w-8 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>

                  {/* Tip badge */}
                  {step.tip && (
                    <div className="mb-4 p-3 rounded-lg glass border border-primary/20">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-foreground/90">{step.tip}</p>
                      </div>
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className="mb-4">
                    <Progress value={progress} className="h-1.5" />
                  </div>

                  {/* Step indicators */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {tourSteps.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => goToStep(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentStep
                            ? "w-6 bg-primary"
                            : completedSteps.includes(index)
                            ? "w-2 bg-primary/60"
                            : "w-2 bg-muted"
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>

                  {/* Navigation */}
                  {step.actions ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={step.id === "complete" ? handleRestart : handleSkip}
                        variant="outline"
                        className="flex-1"
                      >
                        {step.actions[1].label}
                      </Button>
                      <Button
                        onClick={step.id === "complete" ? handleComplete : handleNext}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        {step.actions[0].label}
                        {step.id !== "complete" && <ArrowRight className="h-4 w-4 ml-2" />}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <Button
                        onClick={handlePrevious}
                        variant="outline"
                        disabled={currentStep === 0}
                        className="gap-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button onClick={handleSkip} variant="ghost" size="sm" className="gap-2">
                        <SkipForward className="h-4 w-4" />
                        Skip tour
                      </Button>
                      <Button onClick={handleNext} className="gap-2 bg-primary hover:bg-primary/90">
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Keyboard hints */}
                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-muted rounded text-[10px]">←</kbd>
                      <kbd className="px-2 py-1 bg-muted rounded text-[10px]">→</kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-muted rounded text-[10px]">ESC</kbd>
                      <span>Exit</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Arrow pointer */}
              {step.highlight && step.position !== "center" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`absolute ${getArrowClasses(step.position)} w-4 h-4 border-primary/30 glass-overlay`}
                  style={{
                    transform: `rotate(45deg)`,
                    borderWidth: "1px",
                  }}
                />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Celebration animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-lg"
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
                  repeatDelay: 0.5,
                }}
                className="inline-block"
              >
                <Trophy className="h-24 w-24 text-primary mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2 terminal-glow">Tour Complete!</h2>
              <p className="text-muted-foreground mb-4">You're ready to start exploring</p>
              <div className="flex gap-2 justify-center">
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

// Helper function to get position classes
function getPositionClasses(position: string | null) {
  switch (position) {
    case "top-left":
      return "top-24 left-8"
    case "top-center":
      return "top-24 left-1/2 -translate-x-1/2"
    case "top-right":
      return "top-24 right-8"
    case "bottom-left":
      return "bottom-24 left-8"
    case "bottom-center":
      return "bottom-24 left-1/2 -translate-x-1/2"
    case "bottom-right":
      return "bottom-24 right-8"
    case "center":
      return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    default:
      return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  }
}

// Helper function to get arrow position
function getArrowClasses(position: string | null) {
  switch (position) {
    case "top-left":
    case "top-center":
    case "top-right":
      return "-bottom-2 left-8"
    case "bottom-left":
    case "bottom-center":
    case "bottom-right":
      return "-top-2 left-8"
    default:
      return "hidden"
  }
}

// Demo interface component
function DemoInterface({ onStartTour }: { onStartTour: () => void }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">Product Tour Demo</h1>
          <p className="text-muted-foreground">Click "Start Tour" to begin the interactive walkthrough</p>
        </div>
        <Button onClick={onStartTour} className="gap-2 bg-primary hover:bg-primary/90">
          <Play className="h-4 w-4" />
          Start Tour
        </Button>
      </div>

      {/* Search bar */}
      <Card id="search-bar" className="glass border-glow">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search anything... (Cmd/Ctrl + K)"
              className="flex-1 bg-transparent outline-none"
            />
            <Badge variant="outline" className="gap-1">
              <Filter className="h-3 w-3" />
              Filters
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dashboard card */}
        <Card id="dashboard-card" className="lg:col-span-2 glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Analytics Overview</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" id="notifications-icon">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" id="settings-button">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="h-48 rounded-lg bg-muted/20 border border-border/50 flex items-center justify-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>

        {/* Team section */}
        <Card id="team-section" className="glass">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Team Members</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Team Member {i}</p>
                    <p className="text-xs text-muted-foreground">member{i}@example.com</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keyboard hint */}
      <Card id="keyboard-hint" className="glass">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Keyboard Shortcuts Available</span>
            </div>
            <Badge variant="outline">Press ? to view all</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

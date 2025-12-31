"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  FileText,
  HelpCircle,
  Lock,
  Maximize2,
  MessageSquare,
  Pause,
  Play,
  PlayCircle,
  Settings,
  SkipBack,
  SkipForward,
  Star,
  ThumbsUp,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import { Card, Button, Badge, Progress, Separator, ScrollArea, Collapsible, CollapsibleContent, CollapsibleTrigger, RadioGroup, RadioGroupItem, Label, Tabs, TabsContent, TabsList, TabsTrigger, Avatar, AvatarFallback, Textarea } from "@ggprompts/ui"

// TypeScript Interfaces
interface Instructor {
  id: string
  name: string
  title: string
  avatar: string
  courses: number
  students: number
  rating: number
}

interface Resource {
  id: string
  name: string
  type: "pdf" | "code" | "slides" | "link"
  size?: string
  url: string
}

interface Lesson {
  id: string
  title: string
  type: "video" | "article" | "quiz"
  duration: string
  isCompleted: boolean
  isLocked: boolean
  videoUrl?: string
  resources?: Resource[]
}

interface Section {
  id: string
  title: string
  lessons: Lesson[]
  duration: string
}

interface Course {
  id: string
  title: string
  description: string
  instructor: Instructor
  totalLessons: number
  totalDuration: string
  rating: number
  enrolledCount: number
  lastUpdated: string
  level: "beginner" | "intermediate" | "advanced"
  sections: Section[]
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface Discussion {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  replies: number
}

interface RelatedCourse {
  id: string
  title: string
  instructor: string
  rating: number
  students: number
  duration: string
  level: string
}

// Mock Data
const courseData: Course = {
  id: "course-1",
  title: "Complete Next.js 15 Masterclass",
  description:
    "Master modern web development with Next.js 15, React Server Components, and App Router",
  instructor: {
    id: "inst-1",
    name: "Sarah Chen",
    title: "Senior Software Engineer",
    avatar: "SC",
    courses: 12,
    students: 45000,
    rating: 4.9,
  },
  totalLessons: 48,
  totalDuration: "12h 30m",
  rating: 4.8,
  enrolledCount: 12453,
  lastUpdated: "December 2024",
  level: "intermediate",
  sections: [
    {
      id: "section-1",
      title: "Getting Started",
      duration: "45m",
      lessons: [
        {
          id: "lesson-1",
          title: "Course Introduction",
          type: "video",
          duration: "5:30",
          isCompleted: true,
          isLocked: false,
          resources: [
            { id: "r1", name: "Course Slides.pdf", type: "pdf", size: "2.4 MB", url: "#" },
          ],
        },
        {
          id: "lesson-2",
          title: "Setting Up Your Environment",
          type: "video",
          duration: "12:15",
          isCompleted: true,
          isLocked: false,
          resources: [
            { id: "r2", name: "setup-guide.md", type: "code", size: "4 KB", url: "#" },
          ],
        },
        {
          id: "lesson-3",
          title: "Understanding the App Router",
          type: "video",
          duration: "18:45",
          isCompleted: false,
          isLocked: false,
        },
        {
          id: "lesson-4",
          title: "Section 1 Quiz",
          type: "quiz",
          duration: "10m",
          isCompleted: false,
          isLocked: false,
        },
      ],
    },
    {
      id: "section-2",
      title: "React Server Components",
      duration: "1h 30m",
      lessons: [
        {
          id: "lesson-5",
          title: "What are Server Components?",
          type: "video",
          duration: "15:00",
          isCompleted: false,
          isLocked: false,
        },
        {
          id: "lesson-6",
          title: "Server vs Client Components",
          type: "video",
          duration: "22:30",
          isCompleted: false,
          isLocked: false,
        },
        {
          id: "lesson-7",
          title: "Data Fetching Patterns",
          type: "article",
          duration: "15m read",
          isCompleted: false,
          isLocked: false,
        },
        {
          id: "lesson-8",
          title: "Hands-on: Building a Dashboard",
          type: "video",
          duration: "35:00",
          isCompleted: false,
          isLocked: true,
        },
      ],
    },
    {
      id: "section-3",
      title: "Advanced Routing",
      duration: "2h 15m",
      lessons: [
        {
          id: "lesson-9",
          title: "Dynamic Routes",
          type: "video",
          duration: "20:00",
          isCompleted: false,
          isLocked: true,
        },
        {
          id: "lesson-10",
          title: "Parallel & Intercepting Routes",
          type: "video",
          duration: "25:00",
          isCompleted: false,
          isLocked: true,
        },
        {
          id: "lesson-11",
          title: "Route Groups & Layouts",
          type: "video",
          duration: "18:00",
          isCompleted: false,
          isLocked: true,
        },
      ],
    },
    {
      id: "section-4",
      title: "Deployment & Optimization",
      duration: "1h 45m",
      lessons: [
        {
          id: "lesson-12",
          title: "Vercel Deployment",
          type: "video",
          duration: "15:00",
          isCompleted: false,
          isLocked: true,
        },
        {
          id: "lesson-13",
          title: "Performance Optimization",
          type: "video",
          duration: "30:00",
          isCompleted: false,
          isLocked: true,
        },
        {
          id: "lesson-14",
          title: "Final Project",
          type: "video",
          duration: "45:00",
          isCompleted: false,
          isLocked: true,
        },
        {
          id: "lesson-15",
          title: "Course Completion",
          type: "article",
          duration: "5m",
          isCompleted: false,
          isLocked: true,
        },
      ],
    },
  ],
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the primary purpose of the App Router in Next.js 15?",
    options: [
      "To handle API requests only",
      "To provide file-system based routing with React Server Components",
      "To replace React entirely",
      "To manage database connections",
    ],
    correctIndex: 1,
    explanation:
      "The App Router provides file-system based routing with native support for React Server Components, layouts, and streaming.",
  },
  {
    id: "q2",
    question: "Which directive marks a component as a Client Component?",
    options: [
      "'use server'",
      "'use client'",
      "'client-only'",
      "'react-client'",
    ],
    correctIndex: 1,
    explanation:
      "The 'use client' directive at the top of a file marks all exports as Client Components.",
  },
  {
    id: "q3",
    question: "What is the default behavior of components in the App Router?",
    options: [
      "Client Components",
      "Server Components",
      "Static Components",
      "Hybrid Components",
    ],
    correctIndex: 1,
    explanation:
      "By default, all components in the App Router are Server Components unless marked with 'use client'.",
  },
]

const discussions: Discussion[] = [
  {
    id: "d1",
    author: "Michael Torres",
    avatar: "MT",
    content:
      "Great explanation! Quick question - how does this differ from the Pages Router approach?",
    timestamp: "2 hours ago",
    likes: 12,
    replies: 3,
  },
  {
    id: "d2",
    author: "Emma Wilson",
    avatar: "EW",
    content:
      "The hands-on examples are really helpful. I was able to implement this in my project right away.",
    timestamp: "5 hours ago",
    likes: 24,
    replies: 1,
  },
  {
    id: "d3",
    author: "David Kim",
    avatar: "DK",
    content:
      "Could you cover more about error boundaries in the next lesson? That would be super useful.",
    timestamp: "1 day ago",
    likes: 8,
    replies: 2,
  },
]

const relatedCourses: RelatedCourse[] = [
  {
    id: "rc1",
    title: "TypeScript for React Developers",
    instructor: "Alex Johnson",
    rating: 4.7,
    students: 8500,
    duration: "8h 15m",
    level: "Intermediate",
  },
  {
    id: "rc2",
    title: "Advanced React Patterns",
    instructor: "Sarah Chen",
    rating: 4.9,
    students: 6200,
    duration: "10h 30m",
    level: "Advanced",
  },
  {
    id: "rc3",
    title: "Full-Stack with Prisma & PostgreSQL",
    instructor: "James Liu",
    rating: 4.6,
    students: 4100,
    duration: "14h 45m",
    level: "Intermediate",
  },
  {
    id: "rc4",
    title: "Testing React Applications",
    instructor: "Maria Garcia",
    rating: 4.8,
    students: 3800,
    duration: "6h 20m",
    level: "Intermediate",
  },
]

export default function CoursePlatform() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentLesson, setCurrentLesson] = useState<Lesson>(
    courseData.sections[0].lessons[2]
  )
  const [expandedSections, setExpandedSections] = useState<string[]>(["section-1"])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [videoProgress, setVideoProgress] = useState(35)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Calculate course progress
  const completedLessons = courseData.sections.reduce(
    (acc, section) => acc + section.lessons.filter((l) => l.isCompleted).length,
    0
  )
  const totalLessons = courseData.sections.reduce(
    (acc, section) => acc + section.lessons.length,
    0
  )
  const progressPercent = Math.round((completedLessons / totalLessons) * 100)

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  // Handle lesson click
  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.isLocked) {
      setCurrentLesson(lesson)
      setShowQuiz(lesson.type === "quiz")
      setQuizSubmitted(false)
      setQuizAnswers({})
    }
  }

  // Handle quiz submission
  const handleQuizSubmit = () => {
    setQuizSubmitted(true)
    const allCorrect = quizQuestions.every(
      (q) => quizAnswers[q.id] === q.options[q.correctIndex]
    )
    if (allCorrect) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }

  // Get lesson icon
  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.isCompleted) {
      return <CheckCircle2 className="h-4 w-4 text-primary" />
    }
    if (lesson.isLocked) {
      return <Lock className="h-4 w-4 text-muted-foreground" />
    }
    switch (lesson.type) {
      case "video":
        return <PlayCircle className="h-4 w-4 text-secondary" />
      case "article":
        return <FileText className="h-4 w-4 text-secondary" />
      case "quiz":
        return <HelpCircle className="h-4 w-4 text-secondary" />
    }
  }

  // Calculate quiz score
  const calculateQuizScore = () => {
    let correct = 0
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.options[q.correctIndex]) {
        correct++
      }
    })
    return correct
  }

  return (
    <div className="min-h-screen">
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="glass border-primary/30 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <Award className="h-16 w-16 text-primary mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Perfect Score!
              </h2>
              <p className="text-muted-foreground">
                You answered all questions correctly
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-border/30 p-4 md:p-6"
      >
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
                {courseData.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {courseData.instructor.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">
                    {courseData.instructor.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span>{courseData.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{courseData.enrolledCount.toLocaleString()}</span>
                </div>
                <Badge
                  variant="outline"
                  className="border-secondary/30 text-secondary capitalize"
                >
                  {courseData.level}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-muted-foreground">Your Progress</p>
                <p className="text-lg font-bold text-primary font-mono">
                  {progressPercent}%
                </p>
              </div>
              <div className="w-32 hidden sm:block">
                <Progress value={progressPercent} className="h-2" />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden border-border/30"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <BookOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Progress */}
          <div className="sm:hidden mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-bold text-primary">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row">
        {/* Video/Content Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 p-4 md:p-6"
        >
          {/* Video Player */}
          {currentLesson.type === "video" && !showQuiz && (
            <Card className="glass border-border/30 overflow-hidden mb-6">
              <div className="relative aspect-video bg-background/50 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center z-10"
                >
                  <PlayCircle className="h-16 w-16 md:h-20 md:w-20 text-primary/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Video Player Placeholder</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    {currentLesson.title}
                  </p>
                </motion.div>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 glass-dark p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-foreground hover:text-primary"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-foreground hover:text-primary hidden sm:flex"
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-foreground hover:text-primary hidden sm:flex"
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>

                    <div className="flex-1 mx-2">
                      <Progress value={videoProgress} className="h-1.5" />
                    </div>

                    <span className="text-xs text-muted-foreground font-mono hidden sm:block">
                      6:32 / {currentLesson.duration}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-foreground hover:text-primary"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-foreground hover:text-primary hidden sm:flex"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-foreground hover:text-primary"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Article Content */}
          {currentLesson.type === "article" && !showQuiz && (
            <Card className="glass border-border/30 p-6 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {currentLesson.title}
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  This is placeholder content for the article lesson. In a real
                  implementation, this would contain the full article content with
                  proper formatting, code examples, images, and other rich media.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Articles are great for explaining concepts in depth, providing
                  code references, and supplementing video content with additional
                  resources and explanations.
                </p>
              </div>
            </Card>
          )}

          {/* Quiz Content */}
          {showQuiz && (
            <Card className="glass border-border/30 p-4 md:p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Section Quiz</h2>
                {quizSubmitted && (
                  <Badge
                    className={`${
                      calculateQuizScore() === quizQuestions.length
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    Score: {calculateQuizScore()}/{quizQuestions.length}
                  </Badge>
                )}
              </div>

              <div className="space-y-8">
                {quizQuestions.map((question, idx) => {
                  const isCorrect =
                    quizSubmitted &&
                    quizAnswers[question.id] === question.options[question.correctIndex]
                  const isWrong =
                    quizSubmitted &&
                    quizAnswers[question.id] &&
                    quizAnswers[question.id] !== question.options[question.correctIndex]

                  return (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-lg border ${
                        isCorrect
                          ? "border-primary/30 bg-primary/5"
                          : isWrong
                          ? "border-red-500/30 bg-red-500/5"
                          : "border-border/30 bg-background/30"
                      }`}
                    >
                      <p className="font-medium text-foreground mb-4">
                        {idx + 1}. {question.question}
                      </p>

                      <RadioGroup
                        value={quizAnswers[question.id] || ""}
                        onValueChange={(value) =>
                          !quizSubmitted &&
                          setQuizAnswers((prev) => ({ ...prev, [question.id]: value }))
                        }
                        disabled={quizSubmitted}
                      >
                        {question.options.map((option, optIdx) => {
                          const isCorrectOption =
                            quizSubmitted && optIdx === question.correctIndex
                          const isSelectedWrong =
                            quizSubmitted &&
                            quizAnswers[question.id] === option &&
                            optIdx !== question.correctIndex

                          return (
                            <div
                              key={optIdx}
                              className={`flex items-center space-x-3 p-3 rounded-lg ${
                                isCorrectOption
                                  ? "bg-primary/10"
                                  : isSelectedWrong
                                  ? "bg-red-500/10"
                                  : "hover:bg-background/50"
                              }`}
                            >
                              <RadioGroupItem
                                value={option}
                                id={`${question.id}-${optIdx}`}
                              />
                              <Label
                                htmlFor={`${question.id}-${optIdx}`}
                                className={`cursor-pointer flex-1 ${
                                  isCorrectOption
                                    ? "text-primary"
                                    : isSelectedWrong
                                    ? "text-red-400"
                                    : "text-foreground"
                                }`}
                              >
                                {option}
                              </Label>
                              {isCorrectOption && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                              {isSelectedWrong && (
                                <X className="h-4 w-4 text-red-400" />
                              )}
                            </div>
                          )
                        })}
                      </RadioGroup>

                      {quizSubmitted && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 text-sm text-muted-foreground bg-background/30 p-3 rounded-lg"
                        >
                          <span className="font-medium text-secondary">
                            Explanation:
                          </span>{" "}
                          {question.explanation}
                        </motion.p>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {!quizSubmitted ? (
                <Button
                  onClick={handleQuizSubmit}
                  className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                >
                  Submit Quiz
                </Button>
              ) : (
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-border/30"
                    onClick={() => {
                      setQuizSubmitted(false)
                      setQuizAnswers({})
                    }}
                  >
                    Retry Quiz
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                    Continue to Next Lesson
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Lesson Info & Resources */}
          {!showQuiz && (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="glass border-border/30">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="glass border-border/30 p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {currentLesson.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    In this lesson, you&apos;ll learn the fundamental concepts and
                    practical applications. We&apos;ll cover best practices,
                    common patterns, and hands-on examples to solidify your
                    understanding.
                  </p>

                  <Separator className="my-4 bg-border/30" />

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{currentLesson.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm capitalize">{currentLesson.type}</span>
                    </div>
                  </div>
                </Card>

                {/* Instructor Card */}
                <Card className="glass border-border/30 p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    About the Instructor
                  </h3>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {courseData.instructor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {courseData.instructor.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {courseData.instructor.title}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                        <span>{courseData.instructor.courses} courses</span>
                        <span>
                          {courseData.instructor.students.toLocaleString()} students
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                          {courseData.instructor.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="resources">
                <Card className="glass border-border/30 p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Downloadable Resources
                  </h3>
                  {currentLesson.resources && currentLesson.resources.length > 0 ? (
                    <div className="space-y-3">
                      {currentLesson.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/20"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-secondary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {resource.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {resource.size}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No resources available for this lesson.
                    </p>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="discussion">
                <Card className="glass border-border/30 p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Lesson Discussion
                  </h3>

                  {/* New Comment */}
                  <div className="mb-6">
                    <Textarea
                      placeholder="Ask a question or share your thoughts..."
                      className="bg-background/30 border-border/30 text-foreground placeholder:text-muted-foreground resize-none"
                      rows={3}
                    />
                    <Button className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>

                  <Separator className="my-4 bg-border/30" />

                  {/* Comments List */}
                  <div className="space-y-4">
                    {discussions.map((discussion) => (
                      <div
                        key={discussion.id}
                        className="p-4 rounded-lg bg-background/30 border border-border/20"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-secondary/20 text-secondary text-xs">
                              {discussion.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground text-sm">
                                {discussion.author}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {discussion.timestamp}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {discussion.content}
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                                <ThumbsUp className="h-3 w-3" />
                                {discussion.likes}
                              </button>
                              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                                <MessageSquare className="h-3 w-3" />
                                {discussion.replies} replies
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Certificate Preview */}
          <Card className="glass border-primary/30 p-4 md:p-6 mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Certificate of Completion
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Complete all lessons to earn your certificate
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-lg font-bold text-primary font-mono">
                    {completedLessons}/{totalLessons}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                  disabled={completedLessons < totalLessons}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <Progress value={progressPercent} className="h-2 mt-4" />
          </Card>

          {/* Related Courses */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Related Courses
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedCourses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="glass border-border/30 p-4 hover:border-primary/30 transition-colors cursor-pointer">
                    <h4 className="font-medium text-foreground mb-2 line-clamp-1">
                      {course.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {course.instructor}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        {course.rating}
                      </span>
                      <span>{course.students.toLocaleString()} students</span>
                      <span>{course.duration}</span>
                      <Badge
                        variant="outline"
                        className="border-border/30 text-muted-foreground text-xs"
                      >
                        {course.level}
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Curriculum Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="w-full lg:w-96 border-l border-border/30 bg-background/50"
            >
              <div className="sticky top-0 p-4 glass-dark border-b border-border/30 flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Course Content</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {completedLessons}/{totalLessons} completed
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-8 w-8"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-4 space-y-2">
                  {courseData.sections.map((section, sectionIdx) => {
                    const sectionCompleted = section.lessons.filter(
                      (l) => l.isCompleted
                    ).length
                    const isExpanded = expandedSections.includes(section.id)

                    return (
                      <Collapsible
                        key={section.id}
                        open={isExpanded}
                        onOpenChange={() => toggleSection(section.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <button className="w-full p-3 rounded-lg glass-dark border border-border/20 hover:border-primary/30 transition-colors text-left">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-foreground">
                                    Section {sectionIdx + 1}
                                  </span>
                                  {sectionCompleted === section.lessons.length && (
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                <p className="text-sm text-foreground font-medium mt-1 truncate">
                                  {section.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {sectionCompleted}/{section.lessons.length} lessons •{" "}
                                  {section.duration}
                                </p>
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 text-muted-foreground transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <div className="mt-2 ml-2 space-y-1">
                            {section.lessons.map((lesson) => (
                              <button
                                key={lesson.id}
                                onClick={() => handleLessonClick(lesson)}
                                disabled={lesson.isLocked}
                                className={`w-full p-3 rounded-lg text-left transition-colors flex items-center gap-3 ${
                                  currentLesson.id === lesson.id
                                    ? "bg-primary/10 border border-primary/30"
                                    : lesson.isLocked
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-background/50 border border-transparent"
                                }`}
                              >
                                {getLessonIcon(lesson)}
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-sm truncate ${
                                      currentLesson.id === lesson.id
                                        ? "text-primary font-medium"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {lesson.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {lesson.duration}
                                  </p>
                                </div>
                                {currentLesson.id === lesson.id && (
                                  <ChevronRight className="h-4 w-4 text-primary" />
                                )}
                              </button>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  })}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Sidebar Toggle (when closed) */}
      {!sidebarOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 right-6 lg:hidden p-4 rounded-full glass border-primary/30 shadow-lg"
        >
          <BookOpen className="h-5 w-5 text-primary" />
        </motion.button>
      )}
    </div>
  )
}

"use client"

import React, { useState, useRef } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Eye,
  Settings,
  Circle,
  CheckCircle2,
  X,
  Check,
  Clock,
  Trophy,
  Award,
  Target,
  BarChart3,
  TrendingUp,
  Users,
  Download,
  Save,
  Play,
  RotateCcw,
  Shuffle,
  Star,
  Zap,
  Brain,
  GraduationCap,
  FileQuestion,
  ListChecks,
  Hash,
  AlignLeft,
  Link2,
  Flag,
  Sparkles,
  Medal,
  Crown,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCheck,
  XCircle,
  Timer,
  Layers,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"

// Question types
const questionTypes = [
  { id: "multiple-choice", label: "Multiple Choice", icon: Circle, color: "text-blue-400", description: "Single correct answer" },
  { id: "true-false", label: "True/False", icon: CheckCircle2, color: "text-green-400", description: "Binary choice" },
  { id: "multiple-select", label: "Multiple Select", icon: CheckCheck, color: "text-purple-400", description: "Multiple correct answers" },
  { id: "fill-blank", label: "Fill in the Blank", icon: AlignLeft, color: "text-orange-400", description: "Text input answer" },
  { id: "matching", label: "Matching", icon: Link2, color: "text-pink-400", description: "Match pairs" },
  { id: "ordering", label: "Ordering", icon: ListChecks, color: "text-secondary", description: "Arrange in correct order" },
]

// Quiz templates
const quizTemplates = [
  {
    id: "general-knowledge",
    name: "General Knowledge Quiz",
    description: "A mix of general knowledge questions",
    icon: Brain,
    category: "Education",
    timeLimit: 300,
    passingScore: 70,
    questions: [
      {
        type: "multiple-choice",
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: "Paris",
        points: 10,
        explanation: "Paris is the capital and largest city of France.",
      },
      {
        type: "true-false",
        question: "The Great Wall of China is visible from space.",
        correctAnswer: "false",
        points: 10,
        explanation: "This is a common misconception. The Great Wall is not visible from space with the naked eye.",
      },
      {
        type: "multiple-choice",
        question: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7",
        points: 10,
        explanation: "There are 7 continents: Africa, Antarctica, Asia, Europe, North America, Oceania, and South America.",
      },
    ],
  },
  {
    id: "programming-basics",
    name: "Programming Fundamentals",
    description: "Test your programming knowledge",
    icon: GraduationCap,
    category: "Technology",
    timeLimit: 600,
    passingScore: 75,
    questions: [
      {
        type: "multiple-choice",
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlinks and Text Markup Language"
        ],
        correctAnswer: "Hyper Text Markup Language",
        points: 10,
        explanation: "HTML stands for Hyper Text Markup Language, the standard markup language for web pages.",
      },
      {
        type: "multiple-select",
        question: "Which of these are programming languages?",
        options: ["Python", "HTML", "JavaScript", "CSS"],
        correctAnswers: ["Python", "JavaScript"],
        points: 15,
        explanation: "Python and JavaScript are programming languages. HTML and CSS are markup/styling languages.",
      },
      {
        type: "fill-blank",
        question: "A function that calls itself is called a _____ function.",
        correctAnswer: "recursive",
        points: 10,
        explanation: "Recursion is when a function calls itself to solve a problem.",
      },
    ],
  },
  {
    id: "math-fundamentals",
    name: "Math Fundamentals",
    description: "Basic mathematics assessment",
    icon: Hash,
    category: "Mathematics",
    timeLimit: 900,
    passingScore: 80,
    questions: [
      {
        type: "multiple-choice",
        question: "What is 15% of 200?",
        options: ["20", "25", "30", "35"],
        correctAnswer: "30",
        points: 10,
        explanation: "15% of 200 = 0.15 × 200 = 30",
      },
      {
        type: "ordering",
        question: "Arrange these numbers from smallest to largest:",
        items: ["0.5", "1/3", "0.25", "2/3"],
        correctOrder: ["0.25", "1/3", "0.5", "2/3"],
        points: 15,
        explanation: "In decimal form: 0.25 < 0.33 < 0.5 < 0.67",
      },
    ],
  },
]

export default function QuizBuilderPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
  const [quizSettings, setQuizSettings] = useState({
    title: "Untitled Quiz",
    description: "",
    timeLimit: 0, // 0 = no limit, in seconds
    passingScore: 70,
    showInstantFeedback: true,
    showCorrectAnswers: true,
    randomizeQuestions: false,
    randomizeOptions: false,
    allowRetake: true,
    certificateEnabled: false,
    leaderboardEnabled: false,
  })
  const [previewMode, setPreviewMode] = useState(false)
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false)
  const [showResultsDialog, setShowResultsDialog] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<any>({})
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  const questionIdCounter = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Add question
  const addQuestion = (questionType: string) => {
    const newQuestion = {
      id: `q-${++questionIdCounter.current}`,
      type: questionType,
      question: "Untitled Question",
      options: questionType === "true-false"
        ? ["True", "False"]
        : ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: "",
      correctAnswers: [],
      correctOrder: [],
      pairs: [{ left: "Item 1", right: "Match 1" }, { left: "Item 2", right: "Match 2" }],
      points: 10,
      timeLimit: 0,
      explanation: "",
    }
    setQuestions([...questions, newQuestion])
    setSelectedQuestion(newQuestion)
  }

  // Delete question
  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId))
    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion(null)
    }
  }

  // Duplicate question
  const duplicateQuestion = (question: any) => {
    const newQuestion = {
      ...question,
      id: `q-${++questionIdCounter.current}`,
      question: `${question.question} (Copy)`,
    }
    setQuestions([...questions, newQuestion])
  }

  // Update question
  const updateQuestion = (questionId: string, property: string, value: any) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, [property]: value } : q
    ))
    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion({ ...selectedQuestion, [property]: value })
    }
  }

  // Load template
  const loadTemplate = (template: any) => {
    setQuestions(template.questions.map((q: any) => ({
      ...q,
      id: `q-${++questionIdCounter.current}`,
    })))
    setQuizSettings({
      ...quizSettings,
      title: template.name,
      description: template.description,
      timeLimit: template.timeLimit,
      passingScore: template.passingScore,
    })
    setShowTemplatesDialog(false)
  }

  // Export quiz
  const exportQuiz = () => {
    const quizData = {
      settings: quizSettings,
      questions,
    }
    const blob = new Blob([JSON.stringify(quizData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${quizSettings.title.replace(/\s+/g, "-").toLowerCase()}.json`
    a.click()
  }

  // Calculate score
  const calculateScore = () => {
    let correct = 0
    let totalPoints = 0
    let earnedPoints = 0

    questions.forEach(q => {
      totalPoints += q.points || 0
      const userAnswer = userAnswers[q.id]

      if (q.type === "multiple-choice" || q.type === "true-false" || q.type === "fill-blank") {
        if (userAnswer?.toLowerCase() === q.correctAnswer?.toLowerCase()) {
          correct++
          earnedPoints += q.points || 0
        }
      } else if (q.type === "multiple-select") {
        const correctSet = new Set(q.correctAnswers || [])
        const userSet = new Set(userAnswer || [])
        if (correctSet.size === userSet.size && [...correctSet].every(a => userSet.has(a))) {
          correct++
          earnedPoints += q.points || 0
        }
      }
    })

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
    const passed = percentage >= quizSettings.passingScore

    return { correct, total: questions.length, earnedPoints, totalPoints, percentage, passed }
  }

  // Start timer
  const startTimer = () => {
    if (quizSettings.timeLimit > 0) {
      setTimeRemaining(quizSettings.timeLimit)
      setTimerActive(true)
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setQuizCompleted(true)
            setTimerActive(false)
            if (timerRef.current) clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  // Stop timer
  const stopTimer = () => {
    setTimerActive(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const results = quizCompleted ? calculateScore() : null

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
                <Brain className="w-8 h-8" />
                Quiz & Assessment Builder
              </h1>
              <p className="text-muted-foreground mt-2">
                Create engaging quizzes with scoring, time limits, and instant feedback
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowTemplatesDialog(true)}>
                <Layers className="w-4 h-4 mr-2" />
                Templates
              </Button>
              <Button variant="outline" size="sm" onClick={exportQuiz}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => {
                setPreviewMode(!previewMode)
                setQuizStarted(false)
                setQuizCompleted(false)
                setUserAnswers({})
                setCurrentQuestionIndex(0)
                stopTimer()
              }}>
                {previewMode ? <Settings className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {previewMode ? "Edit" : "Take Quiz"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Builder */}
        {!previewMode ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Question Types Palette */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-12 lg:col-span-3"
            >
              <Card className="glass-dark sticky top-4">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Question Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <ScrollArea className="h-[700px]">
                    <div className="space-y-2">
                      {questionTypes.map(qType => (
                        <motion.button
                          key={qType.id}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => addQuestion(qType.id)}
                          className="w-full text-left p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-all bg-card/50 hover:bg-card"
                        >
                          <div className="flex items-start gap-3">
                            <qType.icon className={`w-5 h-5 ${qType.color} mt-0.5`} />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">{qType.label}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {qType.description}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Quiz Stats */}
                    <div className="space-y-3 p-3 rounded-lg bg-muted/30">
                      <div className="text-xs font-semibold text-muted-foreground uppercase">Quiz Stats</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Questions</span>
                          <Badge>{questions.length}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Points</span>
                          <Badge>{questions.reduce((sum, q) => sum + (q.points || 0), 0)}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Time Limit</span>
                          <Badge variant="outline">
                            {quizSettings.timeLimit > 0 ? `${Math.floor(quizSettings.timeLimit / 60)}m` : "None"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Passing Score</span>
                          <Badge variant="outline">{quizSettings.passingScore}%</Badge>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quiz Canvas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-12 lg:col-span-6"
            >
              <Card className="glass">
                <CardHeader>
                  <div className="space-y-3">
                    <Input
                      value={quizSettings.title}
                      onChange={(e) => setQuizSettings({ ...quizSettings, title: e.target.value })}
                      className="text-2xl font-bold border-0 bg-transparent px-0 focus-visible:ring-0"
                      placeholder="Quiz Title"
                    />
                    <Textarea
                      value={quizSettings.description}
                      onChange={(e) => setQuizSettings({ ...quizSettings, description: e.target.value })}
                      className="text-sm text-muted-foreground border-0 bg-transparent px-0 focus-visible:ring-0 resize-none"
                      placeholder="Quiz description (optional)"
                      rows={2}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[700px] pr-4">
                    {questions.length === 0 ? (
                      <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">Create Your Quiz</h3>
                        <p className="text-sm text-muted-foreground">
                          Add questions from the palette to get started
                        </p>
                      </div>
                    ) : (
                      <Reorder.Group axis="y" values={questions} onReorder={setQuestions} className="space-y-4">
                        {questions.map((question, index) => (
                          <Reorder.Item key={question.id} value={question}>
                            <motion.div
                              layout
                              whileHover={{ scale: 1.01 }}
                              onClick={() => setSelectedQuestion(question)}
                              className={`group border-2 rounded-xl p-5 cursor-pointer transition-all ${
                                selectedQuestion?.id === question.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50 bg-card/50"
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className="cursor-grab active:cursor-grabbing">
                                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="text-xs">Q{index + 1}</Badge>
                                        <Badge className="text-xs">{question.points} pts</Badge>
                                        {question.timeLimit > 0 && (
                                          <Badge variant="secondary" className="text-xs">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {question.timeLimit}s
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="font-medium">{question.question}</div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          duplicateQuestion(question)
                                        }}
                                      >
                                        <Copy className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          deleteQuestion(question.id)
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Question Preview */}
                                  <div className="pl-4 space-y-2">
                                    {question.type === "multiple-choice" || question.type === "true-false" ? (
                                      <div className="space-y-2">
                                        {question.options?.map((opt: string, i: number) => (
                                          <div
                                            key={i}
                                            className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                                              opt === question.correctAnswer ? "bg-primary/10 border border-primary/30" : "bg-muted/30"
                                            }`}
                                          >
                                            {opt === question.correctAnswer ? (
                                              <CheckCircle2 className="w-4 h-4 text-primary" />
                                            ) : (
                                              <Circle className="w-4 h-4 text-muted-foreground" />
                                            )}
                                            <span>{opt}</span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : question.type === "multiple-select" ? (
                                      <div className="space-y-2">
                                        {question.options?.map((opt: string, i: number) => (
                                          <div
                                            key={i}
                                            className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                                              question.correctAnswers?.includes(opt) ? "bg-primary/10 border border-primary/30" : "bg-muted/30"
                                            }`}
                                          >
                                            {question.correctAnswers?.includes(opt) ? (
                                              <CheckCircle2 className="w-4 h-4 text-primary" />
                                            ) : (
                                              <Circle className="w-4 h-4 text-muted-foreground" />
                                            )}
                                            <span>{opt}</span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : question.type === "fill-blank" ? (
                                      <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">Correct Answer:</div>
                                        <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-sm font-mono">
                                          {question.correctAnswer || "(not set)"}
                                        </div>
                                      </div>
                                    ) : null}
                                    {question.explanation && (
                                      <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                        <div className="text-xs text-blue-400 font-semibold mb-1">Explanation:</div>
                                        <div className="text-sm text-muted-foreground">{question.explanation}</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Properties Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-12 lg:col-span-3"
            >
              <Card className="glass-dark sticky top-4">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    {selectedQuestion ? "Question Settings" : "Quiz Settings"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[700px] pr-4">
                    {selectedQuestion ? (
                      <div className="space-y-6">
                        {/* Question Text */}
                        <div className="space-y-2">
                          <Label>Question</Label>
                          <Textarea
                            value={selectedQuestion.question}
                            onChange={(e) => updateQuestion(selectedQuestion.id, "question", e.target.value)}
                            rows={3}
                          />
                        </div>

                        {/* Points */}
                        <div className="space-y-2">
                          <Label>Points</Label>
                          <Input
                            type="number"
                            value={selectedQuestion.points}
                            onChange={(e) => updateQuestion(selectedQuestion.id, "points", parseInt(e.target.value) || 0)}
                            min="0"
                          />
                        </div>

                        {/* Time Limit */}
                        <div className="space-y-2">
                          <Label>Time Limit (seconds)</Label>
                          <Input
                            type="number"
                            value={selectedQuestion.timeLimit}
                            onChange={(e) => updateQuestion(selectedQuestion.id, "timeLimit", parseInt(e.target.value) || 0)}
                            min="0"
                            placeholder="0 = no limit"
                          />
                        </div>

                        <Separator />

                        {/* Options & Correct Answer */}
                        {(selectedQuestion.type === "multiple-choice" || selectedQuestion.type === "multiple-select") && (
                          <div className="space-y-3">
                            <Label>Options</Label>
                            <div className="space-y-2">
                              {selectedQuestion.options?.map((option: string, index: number) => (
                                <div key={index} className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...selectedQuestion.options]
                                        newOptions[index] = e.target.value
                                        updateQuestion(selectedQuestion.id, "options", newOptions)
                                      }}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newOptions = selectedQuestion.options.filter((_: any, i: number) => i !== index)
                                        updateQuestion(selectedQuestion.id, "options", newOptions)
                                      }}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  {selectedQuestion.type === "multiple-choice" ? (
                                    <div className="flex items-center gap-2 pl-2">
                                      <Checkbox
                                        checked={selectedQuestion.correctAnswer === option}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            updateQuestion(selectedQuestion.id, "correctAnswer", option)
                                          }
                                        }}
                                      />
                                      <Label className="text-xs text-muted-foreground">Correct answer</Label>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 pl-2">
                                      <Checkbox
                                        checked={selectedQuestion.correctAnswers?.includes(option)}
                                        onCheckedChange={(checked) => {
                                          const currentAnswers = selectedQuestion.correctAnswers || []
                                          if (checked) {
                                            updateQuestion(selectedQuestion.id, "correctAnswers", [...currentAnswers, option])
                                          } else {
                                            updateQuestion(selectedQuestion.id, "correctAnswers", currentAnswers.filter((a: string) => a !== option))
                                          }
                                        }}
                                      />
                                      <Label className="text-xs text-muted-foreground">Correct answer</Label>
                                    </div>
                                  )}
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newOptions = [...(selectedQuestion.options || []), `Option ${(selectedQuestion.options?.length || 0) + 1}`]
                                  updateQuestion(selectedQuestion.id, "options", newOptions)
                                }}
                                className="w-full"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Option
                              </Button>
                            </div>
                          </div>
                        )}

                        {selectedQuestion.type === "true-false" && (
                          <div className="space-y-2">
                            <Label>Correct Answer</Label>
                            <Select
                              value={selectedQuestion.correctAnswer}
                              onValueChange={(value) => updateQuestion(selectedQuestion.id, "correctAnswer", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select answer" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="True">True</SelectItem>
                                <SelectItem value="False">False</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {selectedQuestion.type === "fill-blank" && (
                          <div className="space-y-2">
                            <Label>Correct Answer</Label>
                            <Input
                              value={selectedQuestion.correctAnswer || ""}
                              onChange={(e) => updateQuestion(selectedQuestion.id, "correctAnswer", e.target.value)}
                              placeholder="Enter the correct answer"
                            />
                          </div>
                        )}

                        <Separator />

                        {/* Explanation */}
                        <div className="space-y-2">
                          <Label>Explanation (Optional)</Label>
                          <Textarea
                            value={selectedQuestion.explanation || ""}
                            onChange={(e) => updateQuestion(selectedQuestion.id, "explanation", e.target.value)}
                            placeholder="Explain why this is the correct answer..."
                            rows={3}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* General Settings */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Overall Time Limit (minutes)</Label>
                            <Input
                              type="number"
                              value={quizSettings.timeLimit > 0 ? Math.floor(quizSettings.timeLimit / 60) : 0}
                              onChange={(e) => setQuizSettings({ ...quizSettings, timeLimit: (parseInt(e.target.value) || 0) * 60 })}
                              min="0"
                              placeholder="0 = no limit"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Passing Score (%)</Label>
                            <div className="space-y-2">
                              <Slider
                                value={[quizSettings.passingScore]}
                                onValueChange={(value) => setQuizSettings({ ...quizSettings, passingScore: value[0] })}
                                min={0}
                                max={100}
                                step={5}
                              />
                              <div className="text-center text-sm font-medium">{quizSettings.passingScore}%</div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Options */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Show Instant Feedback</Label>
                            <Switch
                              checked={quizSettings.showInstantFeedback}
                              onCheckedChange={(checked) => setQuizSettings({ ...quizSettings, showInstantFeedback: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Show Correct Answers</Label>
                            <Switch
                              checked={quizSettings.showCorrectAnswers}
                              onCheckedChange={(checked) => setQuizSettings({ ...quizSettings, showCorrectAnswers: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Randomize Questions</Label>
                            <Switch
                              checked={quizSettings.randomizeQuestions}
                              onCheckedChange={(checked) => setQuizSettings({ ...quizSettings, randomizeQuestions: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Randomize Options</Label>
                            <Switch
                              checked={quizSettings.randomizeOptions}
                              onCheckedChange={(checked) => setQuizSettings({ ...quizSettings, randomizeOptions: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Allow Retake</Label>
                            <Switch
                              checked={quizSettings.allowRetake}
                              onCheckedChange={(checked) => setQuizSettings({ ...quizSettings, allowRetake: checked })}
                            />
                          </div>
                        </div>

                        <Separator />

                        {/* Advanced Features */}
                        <div className="space-y-4">
                          <Label className="font-semibold">Advanced Features</Label>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-amber-400" />
                              <Label>Enable Certificates</Label>
                            </div>
                            <Switch
                              checked={quizSettings.certificateEnabled}
                              onCheckedChange={(checked) => setQuizSettings({ ...quizSettings, certificateEnabled: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-amber-400" />
                              <Label>Enable Leaderboard</Label>
                            </div>
                            <Switch
                              checked={quizSettings.leaderboardEnabled}
                              onCheckedChange={(checked) => setQuizSettings({ ...quizSettings, leaderboardEnabled: checked })}
                            />
                          </div>
                        </div>

                        <Separator />

                        {/* Quick Actions */}
                        <div className="space-y-3">
                          <Label className="font-semibold">Quick Actions</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" onClick={() => setShowTemplatesDialog(true)}>
                              <Layers className="w-4 h-4 mr-2" />
                              Templates
                            </Button>
                            <Button variant="outline" size="sm" onClick={exportQuiz}>
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                            <Button variant="outline" size="sm">
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button variant="outline" size="sm">
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Analytics
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          /* Preview Mode - Quiz Taking */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            {!quizStarted ? (
              <Card className="glass">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-3">{quizSettings.title}</h2>
                  {quizSettings.description && (
                    <p className="text-lg text-muted-foreground mb-8">{quizSettings.description}</p>
                  )}

                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                    <div className="p-4 rounded-lg bg-muted/30">
                      <FileQuestion className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{questions.length}</div>
                      <div className="text-xs text-muted-foreground">Questions</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">
                        {quizSettings.timeLimit > 0 ? `${Math.floor(quizSettings.timeLimit / 60)}m` : "∞"}
                      </div>
                      <div className="text-xs text-muted-foreground">Time Limit</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{quizSettings.passingScore}%</div>
                      <div className="text-xs text-muted-foreground">To Pass</div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    onClick={() => {
                      setQuizStarted(true)
                      startTimer()
                    }}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ) : quizCompleted ? (
              <Card className="glass">
                <CardContent className="p-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="text-center mb-8"
                  >
                    <div className={`w-24 h-24 rounded-full ${results!.passed ? "bg-green-500/20" : "bg-red-500/20"} flex items-center justify-center mx-auto mb-6`}>
                      {results!.passed ? (
                        <Trophy className="w-12 h-12 text-green-500" />
                      ) : (
                        <XCircle className="w-12 h-12 text-red-500" />
                      )}
                    </div>
                    <h2 className="text-3xl font-bold mb-3">
                      {results!.passed ? "Congratulations!" : "Keep Practicing"}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      {results!.passed
                        ? "You've passed the quiz successfully!"
                        : "You didn't pass this time, but you can try again."}
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                    <div className="p-6 rounded-xl glass-dark text-center">
                      <div className="text-4xl font-bold mb-2">{results!.percentage}%</div>
                      <div className="text-sm text-muted-foreground">Your Score</div>
                    </div>
                    <div className="p-6 rounded-xl glass-dark text-center">
                      <div className="text-4xl font-bold mb-2">
                        {results!.correct}/{results!.total}
                      </div>
                      <div className="text-sm text-muted-foreground">Correct Answers</div>
                    </div>
                    <div className="p-6 rounded-xl glass-dark text-center">
                      <div className="text-4xl font-bold mb-2">
                        {results!.earnedPoints}/{results!.totalPoints}
                      </div>
                      <div className="text-sm text-muted-foreground">Points Earned</div>
                    </div>
                    <div className="p-6 rounded-xl glass-dark text-center">
                      <div className="text-4xl font-bold mb-2">{quizSettings.passingScore}%</div>
                      <div className="text-sm text-muted-foreground">Passing Score</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    {quizSettings.allowRetake && (
                      <Button
                        onClick={() => {
                          setQuizCompleted(false)
                          setQuizStarted(false)
                          setUserAnswers({})
                          setCurrentQuestionIndex(0)
                          stopTimer()
                        }}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake Quiz
                      </Button>
                    )}
                    {results!.passed && quizSettings.certificateEnabled && (
                      <Button variant="outline">
                        <Award className="w-4 h-4 mr-2" />
                        Get Certificate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
                      <CardDescription className="mt-1">
                        {questions[currentQuestionIndex]?.points} points
                      </CardDescription>
                    </div>
                    {quizSettings.timeLimit > 0 && (
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        timeRemaining < 60 ? "bg-red-500/20 text-red-400" : "bg-muted"
                      }`}>
                        <Timer className="w-4 h-4" />
                        <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
                      </div>
                    )}
                  </div>
                  <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mt-4" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-xl font-medium">{questions[currentQuestionIndex]?.question}</div>

                  {questions[currentQuestionIndex]?.type === "multiple-choice" && (
                    <RadioGroup
                      value={userAnswers[questions[currentQuestionIndex].id]}
                      onValueChange={(value) => setUserAnswers({ ...userAnswers, [questions[currentQuestionIndex].id]: value })}
                    >
                      <div className="space-y-3">
                        {questions[currentQuestionIndex]?.options?.map((opt: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 cursor-pointer transition-colors"
                          >
                            <RadioGroupItem value={opt} id={`opt-${i}`} />
                            <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer">{opt}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}

                  {questions[currentQuestionIndex]?.type === "true-false" && (
                    <RadioGroup
                      value={userAnswers[questions[currentQuestionIndex].id]}
                      onValueChange={(value) => setUserAnswers({ ...userAnswers, [questions[currentQuestionIndex].id]: value })}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 cursor-pointer transition-colors">
                          <RadioGroupItem value="True" id="opt-true" />
                          <Label htmlFor="opt-true" className="flex-1 cursor-pointer">True</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 cursor-pointer transition-colors">
                          <RadioGroupItem value="False" id="opt-false" />
                          <Label htmlFor="opt-false" className="flex-1 cursor-pointer">False</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}

                  {questions[currentQuestionIndex]?.type === "fill-blank" && (
                    <Input
                      value={userAnswers[questions[currentQuestionIndex].id] || ""}
                      onChange={(e) => setUserAnswers({ ...userAnswers, [questions[currentQuestionIndex].id]: e.target.value })}
                      placeholder="Type your answer here..."
                      className="text-lg"
                    />
                  )}

                  <div className="flex items-center justify-between pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                      disabled={currentQuestionIndex === 0}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      onClick={() => {
                        if (currentQuestionIndex < questions.length - 1) {
                          setCurrentQuestionIndex(currentQuestionIndex + 1)
                        } else {
                          setQuizCompleted(true)
                          stopTimer()
                        }
                      }}
                    >
                      {currentQuestionIndex < questions.length - 1 ? (
                        <>
                          Next
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Submit Quiz
                          <Flag className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Templates Dialog */}
        <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
          <DialogContent className="glass-overlay max-w-[95vw] sm:max-w-5xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Quiz Templates
              </DialogTitle>
              <DialogDescription>
                Start with a pre-built quiz template
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[500px]">
              <div className="grid grid-cols-2 gap-4 p-1">
                {quizTemplates.map(template => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => loadTemplate(template)}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <template.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">{template.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary">{template.questions.length} questions</Badge>
                        <Badge variant="outline">{template.category}</Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {Math.floor(template.timeLimit / 60)}m
                        </Badge>
                        <Badge variant="outline">{template.passingScore}% to pass</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

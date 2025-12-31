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
  CheckSquare,
  List,
  Star,
  BarChart3,
  Grid3x3,
  Type,
  Image,
  Save,
  Download,
  Upload,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Shuffle,
  ArrowRight,
  Flag,
  Layers,
  FileText,
  TrendingUp,
  Users,
  ThumbsUp,
  MessageSquare,
  Target,
  Award,
  ClipboardList,
  Sparkles,
  Play,
  RotateCcw,
  Share2,
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
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"

// Question type definitions
const questionTypes = [
  { id: "multiple-choice", label: "Multiple Choice", icon: Circle, color: "text-blue-400", description: "Single selection from options" },
  { id: "checkboxes", label: "Checkboxes", icon: CheckSquare, color: "text-green-400", description: "Multiple selections allowed" },
  { id: "dropdown", label: "Dropdown", icon: List, color: "text-purple-400", description: "Select from dropdown menu" },
  { id: "linear-scale", label: "Linear Scale", icon: BarChart3, color: "text-orange-400", description: "Rate on a numeric scale" },
  { id: "matrix", label: "Matrix Grid", icon: Grid3x3, color: "text-pink-400", description: "Multiple questions, same answers" },
  { id: "short-answer", label: "Short Answer", icon: Type, color: "text-secondary", description: "Brief text response" },
  { id: "paragraph", label: "Long Answer", icon: FileText, color: "text-indigo-400", description: "Extended text response" },
  { id: "rating", label: "Star Rating", icon: Star, color: "text-amber-400", description: "Rate with stars" },
  { id: "image-choice", label: "Image Choice", icon: Image, color: "text-accent", description: "Select from images" },
]

// Survey templates
const surveyTemplates = [
  {
    id: "nps",
    name: "Net Promoter Score (NPS)",
    description: "Measure customer loyalty and satisfaction",
    icon: TrendingUp,
    category: "Customer Feedback",
    questions: [
      {
        id: "1",
        type: "linear-scale",
        question: "How likely are you to recommend our product to a friend or colleague?",
        scaleMin: 0,
        scaleMax: 10,
        scaleMinLabel: "Not at all likely",
        scaleMaxLabel: "Extremely likely",
        required: true,
      },
      {
        id: "2",
        type: "paragraph",
        question: "What is the primary reason for your score?",
        required: false,
      },
    ],
  },
  {
    id: "csat",
    name: "Customer Satisfaction (CSAT)",
    description: "Quick satisfaction survey",
    icon: ThumbsUp,
    category: "Customer Feedback",
    questions: [
      {
        id: "1",
        type: "rating",
        question: "How satisfied are you with your recent experience?",
        required: true,
      },
      {
        id: "2",
        type: "paragraph",
        question: "What could we do to improve?",
        required: false,
      },
    ],
  },
  {
    id: "employee-engagement",
    name: "Employee Engagement",
    description: "Measure workplace satisfaction",
    icon: Users,
    category: "Employee",
    questions: [
      {
        id: "1",
        type: "linear-scale",
        question: "I feel valued at work",
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: "Strongly Disagree",
        scaleMaxLabel: "Strongly Agree",
        required: true,
      },
      {
        id: "2",
        type: "linear-scale",
        question: "I have the resources I need to do my job well",
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: "Strongly Disagree",
        scaleMaxLabel: "Strongly Agree",
        required: true,
      },
      {
        id: "3",
        type: "paragraph",
        question: "What can leadership do to improve the work environment?",
        required: false,
      },
    ],
  },
  {
    id: "product-feedback",
    name: "Product Feedback",
    description: "Gather insights about your product",
    icon: MessageSquare,
    category: "Product",
    questions: [
      {
        id: "1",
        type: "multiple-choice",
        question: "How often do you use our product?",
        options: ["Daily", "Weekly", "Monthly", "Rarely"],
        required: true,
      },
      {
        id: "2",
        type: "checkboxes",
        question: "Which features do you use most? (Select all that apply)",
        options: ["Feature A", "Feature B", "Feature C", "Feature D"],
        required: true,
      },
      {
        id: "3",
        type: "rating",
        question: "How would you rate the overall user experience?",
        required: true,
      },
      {
        id: "4",
        type: "paragraph",
        question: "What new features would you like to see?",
        required: false,
      },
    ],
  },
  {
    id: "event-feedback",
    name: "Event Feedback",
    description: "Post-event satisfaction survey",
    icon: Award,
    category: "Event",
    questions: [
      {
        id: "1",
        type: "rating",
        question: "How would you rate the overall event?",
        required: true,
      },
      {
        id: "2",
        type: "matrix",
        question: "Please rate the following aspects:",
        rows: ["Venue", "Content Quality", "Speakers", "Organization"],
        columns: ["Poor", "Fair", "Good", "Excellent"],
        required: true,
      },
      {
        id: "3",
        type: "multiple-choice",
        question: "Would you attend this event again?",
        options: ["Definitely", "Probably", "Maybe", "Probably not", "Definitely not"],
        required: true,
      },
      {
        id: "4",
        type: "paragraph",
        question: "What can we improve for next time?",
        required: false,
      },
    ],
  },
]

export default function SurveyBuilderPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
  const [sections, setSections] = useState([{ id: "section1", name: "Section 1", questions: [] }])
  const [currentSection, setCurrentSection] = useState("section1")
  const [surveySettings, setSurveySettings] = useState({
    title: "Untitled Survey",
    description: "",
    thankYouTitle: "Thank you!",
    thankYouMessage: "Your response has been recorded.",
    showProgressBar: true,
    randomizeQuestions: false,
    oneQuestionPerPage: false,
    allowResponseEditing: true,
    collectEmail: false,
  })
  const [previewMode, setPreviewMode] = useState(false)
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false)
  const [logicRules, setLogicRules] = useState<any[]>([])
  const [showLogicDialog, setShowLogicDialog] = useState(false)
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0)
  const [showThankYou, setShowThankYou] = useState(false)

  const questionIdCounter = useRef(0)

  // Add question to survey
  const addQuestion = (questionType: string) => {
    const newQuestion = {
      id: `q-${++questionIdCounter.current}`,
      type: questionType,
      question: "Untitled Question",
      required: false,
      options: ["Option 1", "Option 2", "Option 3"],
      scaleMin: 1,
      scaleMax: 5,
      scaleMinLabel: "Low",
      scaleMaxLabel: "High",
      rows: ["Row 1", "Row 2"],
      columns: ["Column 1", "Column 2"],
      imageUrl: "",
      sectionId: currentSection,
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

  // Update question property
  const updateQuestion = (questionId: string, property: string, value: any) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, [property]: value } : q
    ))
    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion({ ...selectedQuestion, [property]: value })
    }
  }

  // Add logic rule
  const addLogicRule = (questionId: string) => {
    const newRule = {
      id: `rule-${Date.now()}`,
      questionId,
      condition: "equals",
      value: "",
      action: "skip-to",
      targetQuestionId: "",
    }
    setLogicRules([...logicRules, newRule])
  }

  // Load template
  const loadTemplate = (template: any) => {
    setQuestions(template.questions.map((q: any, i: number) => ({
      ...q,
      id: `q-${++questionIdCounter.current}`,
      sectionId: currentSection
    })))
    setSurveySettings({ ...surveySettings, title: template.name, description: template.description })
    setShowTemplatesDialog(false)
  }

  // Export survey
  const exportSurvey = () => {
    const surveyData = {
      settings: surveySettings,
      questions,
      sections,
      logicRules,
    }
    const blob = new Blob([JSON.stringify(surveyData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${surveySettings.title.replace(/\s+/g, "-").toLowerCase()}.json`
    a.click()
  }

  const currentSectionQuestions = questions.filter(q => q.sectionId === currentSection)
  const previewQuestions = surveySettings.oneQuestionPerPage
    ? [currentSectionQuestions[currentPreviewPage]]
    : currentSectionQuestions

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
              <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow flex items-center gap-3">
                <ClipboardList className="w-8 h-8" />
                Survey Builder
              </h1>
              <p className="text-muted-foreground mt-2">
                Create powerful surveys with logic jumps, randomization, and advanced question types
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowTemplatesDialog(true)}>
                <Layers className="w-4 h-4 mr-2" />
                Templates
              </Button>
              <Button variant="outline" size="sm" onClick={exportSurvey}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm" onClick={() => {
                setPreviewMode(!previewMode)
                setShowThankYou(false)
                setCurrentPreviewPage(0)
              }}>
                {previewMode ? <Settings className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {previewMode ? "Edit" : "Preview"}
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
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Survey Canvas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-12 lg:col-span-6"
            >
              <Card className="glass">
                <CardHeader>
                  <div className="space-y-3">
                    <Input
                      value={surveySettings.title}
                      onChange={(e) => setSurveySettings({ ...surveySettings, title: e.target.value })}
                      className="text-2xl font-bold border-0 bg-transparent px-0 focus-visible:ring-0"
                      placeholder="Survey Title"
                    />
                    <Textarea
                      value={surveySettings.description}
                      onChange={(e) => setSurveySettings({ ...surveySettings, description: e.target.value })}
                      className="text-sm text-muted-foreground border-0 bg-transparent px-0 focus-visible:ring-0 resize-none"
                      placeholder="Survey description (optional)"
                      rows={2}
                    />
                  </div>
                  {sections.length > 1 && (
                    <div className="flex items-center gap-2 pt-4">
                      {sections.map((section, index) => (
                        <Button
                          key={section.id}
                          variant={currentSection === section.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentSection(section.id)}
                        >
                          {section.name}
                        </Button>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSection = { id: `section${sections.length + 1}`, name: `Section ${sections.length + 1}`, questions: [] }
                          setSections([...sections, newSection])
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[700px] pr-4">
                    {currentSectionQuestions.length === 0 ? (
                      <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">Start Creating</h3>
                        <p className="text-sm text-muted-foreground">
                          Add questions from the palette to build your survey
                        </p>
                      </div>
                    ) : (
                      <Reorder.Group axis="y" values={currentSectionQuestions} onReorder={(newOrder) => {
                        const otherQuestions = questions.filter(q => q.sectionId !== currentSection)
                        setQuestions([...otherQuestions, ...newOrder])
                      }} className="space-y-4">
                        {currentSectionQuestions.map((question, index) => (
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
                                        <Badge variant="outline" className="text-xs">
                                          Q{index + 1}
                                        </Badge>
                                        {question.required && (
                                          <Badge variant="destructive" className="text-xs">Required</Badge>
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
                                  <div className="pl-4">
                                    {question.type === "multiple-choice" || question.type === "dropdown" ? (
                                      <div className="space-y-2">
                                        {question.options?.map((opt: string, i: number) => (
                                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Circle className="w-4 h-4" />
                                            <span>{opt}</span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : question.type === "checkboxes" ? (
                                      <div className="space-y-2">
                                        {question.options?.map((opt: string, i: number) => (
                                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CheckSquare className="w-4 h-4" />
                                            <span>{opt}</span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : question.type === "linear-scale" ? (
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                          <span>{question.scaleMinLabel}</span>
                                          <span>{question.scaleMaxLabel}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {Array.from({ length: question.scaleMax - question.scaleMin + 1 }).map((_, i) => (
                                            <div key={i} className="flex-1 text-center">
                                              <div className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center text-sm">
                                                {question.scaleMin + i}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : question.type === "rating" ? (
                                      <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                          <Star key={i} className="w-6 h-6 text-muted-foreground" />
                                        ))}
                                      </div>
                                    ) : question.type === "matrix" ? (
                                      <div className="space-y-2">
                                        <div className="grid gap-2" style={{ gridTemplateColumns: `150px repeat(${question.columns?.length || 0}, 1fr)` }}>
                                          <div></div>
                                          {question.columns?.map((col: string, i: number) => (
                                            <div key={i} className="text-xs text-muted-foreground text-center">{col}</div>
                                          ))}
                                          {question.rows?.map((row: string, i: number) => (
                                            <React.Fragment key={i}>
                                              <div className="text-sm text-muted-foreground">{row}</div>
                                              {question.columns?.map((_: string, j: number) => (
                                                <div key={j} className="flex justify-center">
                                                  <Circle className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                              ))}
                                            </React.Fragment>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <Input placeholder="Answer will appear here..." disabled className="bg-muted/30" />
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
                    {selectedQuestion ? "Question Settings" : "Survey Settings"}
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

                        {/* Required Toggle */}
                        <div className="flex items-center justify-between">
                          <Label>Required Question</Label>
                          <Switch
                            checked={selectedQuestion.required}
                            onCheckedChange={(checked) => updateQuestion(selectedQuestion.id, "required", checked)}
                          />
                        </div>

                        <Separator />

                        {/* Type-specific settings */}
                        {(selectedQuestion.type === "multiple-choice" ||
                          selectedQuestion.type === "checkboxes" ||
                          selectedQuestion.type === "dropdown") && (
                          <div className="space-y-2">
                            <Label>Options</Label>
                            <div className="space-y-2">
                              {selectedQuestion.options?.map((option: string, index: number) => (
                                <div key={index} className="flex items-center gap-2">
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

                        {selectedQuestion.type === "linear-scale" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label>Min Value</Label>
                                <Input
                                  type="number"
                                  value={selectedQuestion.scaleMin}
                                  onChange={(e) => updateQuestion(selectedQuestion.id, "scaleMin", parseInt(e.target.value))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Max Value</Label>
                                <Input
                                  type="number"
                                  value={selectedQuestion.scaleMax}
                                  onChange={(e) => updateQuestion(selectedQuestion.id, "scaleMax", parseInt(e.target.value))}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Min Label</Label>
                              <Input
                                value={selectedQuestion.scaleMinLabel}
                                onChange={(e) => updateQuestion(selectedQuestion.id, "scaleMinLabel", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Max Label</Label>
                              <Input
                                value={selectedQuestion.scaleMaxLabel}
                                onChange={(e) => updateQuestion(selectedQuestion.id, "scaleMaxLabel", e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                        {selectedQuestion.type === "matrix" && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Rows</Label>
                              {selectedQuestion.rows?.map((row: string, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                  <Input
                                    value={row}
                                    onChange={(e) => {
                                      const newRows = [...selectedQuestion.rows]
                                      newRows[index] = e.target.value
                                      updateQuestion(selectedQuestion.id, "rows", newRows)
                                    }}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newRows = selectedQuestion.rows.filter((_: any, i: number) => i !== index)
                                      updateQuestion(selectedQuestion.id, "rows", newRows)
                                    }}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newRows = [...(selectedQuestion.rows || []), `Row ${(selectedQuestion.rows?.length || 0) + 1}`]
                                  updateQuestion(selectedQuestion.id, "rows", newRows)
                                }}
                                className="w-full"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Row
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <Label>Columns</Label>
                              {selectedQuestion.columns?.map((col: string, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                  <Input
                                    value={col}
                                    onChange={(e) => {
                                      const newCols = [...selectedQuestion.columns]
                                      newCols[index] = e.target.value
                                      updateQuestion(selectedQuestion.id, "columns", newCols)
                                    }}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newCols = selectedQuestion.columns.filter((_: any, i: number) => i !== index)
                                      updateQuestion(selectedQuestion.id, "columns", newCols)
                                    }}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newCols = [...(selectedQuestion.columns || []), `Column ${(selectedQuestion.columns?.length || 0) + 1}`]
                                  updateQuestion(selectedQuestion.id, "columns", newCols)
                                }}
                                className="w-full"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Column
                              </Button>
                            </div>
                          </div>
                        )}

                        <Separator />

                        {/* Logic Jump */}
                        <div className="space-y-3">
                          <Label className="flex items-center gap-2">
                            <ArrowRight className="w-4 h-4" />
                            Logic Jump
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => setShowLogicDialog(true)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Logic Rule
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Skip to different questions based on the answer
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Survey Settings */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Show Progress Bar</Label>
                            <Switch
                              checked={surveySettings.showProgressBar}
                              onCheckedChange={(checked) => setSurveySettings({ ...surveySettings, showProgressBar: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Randomize Questions</Label>
                            <Switch
                              checked={surveySettings.randomizeQuestions}
                              onCheckedChange={(checked) => setSurveySettings({ ...surveySettings, randomizeQuestions: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>One Question Per Page</Label>
                            <Switch
                              checked={surveySettings.oneQuestionPerPage}
                              onCheckedChange={(checked) => setSurveySettings({ ...surveySettings, oneQuestionPerPage: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Collect Email</Label>
                            <Switch
                              checked={surveySettings.collectEmail}
                              onCheckedChange={(checked) => setSurveySettings({ ...surveySettings, collectEmail: checked })}
                            />
                          </div>
                        </div>

                        <Separator />

                        {/* Thank You Page */}
                        <div className="space-y-3">
                          <Label className="font-semibold">Thank You Page</Label>
                          <div className="space-y-2">
                            <Label className="text-xs">Title</Label>
                            <Input
                              value={surveySettings.thankYouTitle}
                              onChange={(e) => setSurveySettings({ ...surveySettings, thankYouTitle: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Message</Label>
                            <Textarea
                              value={surveySettings.thankYouMessage}
                              onChange={(e) => setSurveySettings({ ...surveySettings, thankYouMessage: e.target.value })}
                              rows={3}
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
                            <Button variant="outline" size="sm" onClick={exportSurvey}>
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                            <Button variant="outline" size="sm">
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
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
          /* Preview Mode */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            {!showThankYou ? (
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-2xl">{surveySettings.title}</CardTitle>
                  {surveySettings.description && (
                    <CardDescription className="text-base">{surveySettings.description}</CardDescription>
                  )}
                  {surveySettings.showProgressBar && (
                    <div className="pt-4">
                      <Progress value={surveySettings.oneQuestionPerPage
                        ? ((currentPreviewPage + 1) / currentSectionQuestions.length) * 100
                        : 50
                      } />
                      <p className="text-sm text-muted-foreground mt-2">
                        {surveySettings.oneQuestionPerPage
                          ? `Question ${currentPreviewPage + 1} of ${currentSectionQuestions.length}`
                          : `${currentSectionQuestions.length} questions`
                        }
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-8">
                  {previewQuestions?.filter(Boolean).map((q, index) => (
                    <div key={q.id} className="space-y-3">
                      <Label className="text-base">
                        {surveySettings.oneQuestionPerPage ? "" : `${index + 1}. `}
                        {q.question}
                        {q.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      {q.type === "multiple-choice" && (
                        <RadioGroup>
                          {q.options?.map((opt: string, i: number) => (
                            <div key={i} className="flex items-center space-x-2">
                              <RadioGroupItem value={opt} id={`${q.id}-${i}`} />
                              <Label htmlFor={`${q.id}-${i}`}>{opt}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                      {q.type === "checkboxes" && (
                        <div className="space-y-2">
                          {q.options?.map((opt: string, i: number) => (
                            <div key={i} className="flex items-center space-x-2">
                              <Checkbox id={`${q.id}-${i}`} />
                              <Label htmlFor={`${q.id}-${i}`}>{opt}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                      {q.type === "dropdown" && (
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {q.options?.map((opt: string, i: number) => (
                              <SelectItem key={i} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {q.type === "linear-scale" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{q.scaleMinLabel}</span>
                            <span>{q.scaleMaxLabel}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            {Array.from({ length: q.scaleMax - q.scaleMin + 1 }).map((_, i) => (
                              <button
                                key={i}
                                className="flex-1 aspect-square rounded-full border-2 border-border hover:border-primary hover:bg-primary/10 transition-colors flex items-center justify-center font-medium"
                              >
                                {q.scaleMin + i}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {q.type === "rating" && (
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className="w-10 h-10 text-muted-foreground hover:text-amber-400 cursor-pointer transition-colors" />
                          ))}
                        </div>
                      )}
                      {(q.type === "short-answer" || q.type === "paragraph") && (
                        q.type === "paragraph" ? (
                          <Textarea placeholder="Your answer..." rows={4} />
                        ) : (
                          <Input placeholder="Your answer..." />
                        )
                      )}
                      {q.type === "matrix" && (
                        <div className="overflow-x-auto">
                          <div className="inline-block min-w-full">
                            <div className="space-y-3">
                              <div className="grid gap-3" style={{ gridTemplateColumns: `200px repeat(${q.columns?.length || 0}, 1fr)` }}>
                                <div></div>
                                {q.columns?.map((col: string, i: number) => (
                                  <div key={i} className="text-sm font-medium text-center">{col}</div>
                                ))}
                              </div>
                              {q.rows?.map((row: string, i: number) => (
                                <div key={i} className="grid gap-3" style={{ gridTemplateColumns: `200px repeat(${q.columns?.length || 0}, 1fr)` }}>
                                  <div className="text-sm">{row}</div>
                                  <RadioGroup className="contents">
                                    {q.columns?.map((_: string, j: number) => (
                                      <div key={j} className="flex justify-center">
                                        <RadioGroupItem value={`${i}-${j}`} />
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-6">
                    {surveySettings.oneQuestionPerPage && currentPreviewPage > 0 && (
                      <Button variant="outline" onClick={() => setCurrentPreviewPage(currentPreviewPage - 1)}>
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    )}
                    <Button
                      className="ml-auto"
                      onClick={() => {
                        if (surveySettings.oneQuestionPerPage && currentPreviewPage < currentSectionQuestions.length - 1) {
                          setCurrentPreviewPage(currentPreviewPage + 1)
                        } else {
                          setShowThankYou(true)
                        }
                      }}
                    >
                      {surveySettings.oneQuestionPerPage && currentPreviewPage < currentSectionQuestions.length - 1 ? (
                        <>
                          Next
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass">
                <CardContent className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <Flag className="w-10 h-10 text-green-500" />
                    </div>
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-3">{surveySettings.thankYouTitle}</h2>
                  <p className="text-lg text-muted-foreground mb-6">{surveySettings.thankYouMessage}</p>
                  <Button onClick={() => {
                    setShowThankYou(false)
                    setCurrentPreviewPage(0)
                  }}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Take Survey Again
                  </Button>
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
                Survey Templates
              </DialogTitle>
              <DialogDescription>
                Choose from professional survey templates to get started quickly
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[500px]">
              <div className="grid grid-cols-2 gap-4 p-1">
                {surveyTemplates.map(template => (
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
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{template.questions.length} questions</Badge>
                        <Badge variant="outline">{template.category}</Badge>
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

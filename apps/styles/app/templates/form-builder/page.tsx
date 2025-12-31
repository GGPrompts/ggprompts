"use client"

import React, { useState, useRef } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Eye,
  Code,
  Save,
  Download,
  Upload,
  Settings,
  Type,
  Mail,
  Hash,
  Calendar,
  CheckSquare,
  Circle,
  List,
  FileText,
  Upload as UploadIcon,
  Phone,
  Link,
  Star,
  AlignLeft,
  Image,
  ToggleLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Sparkles,
  Wand2,
  Palette,
  Layout,
  GitBranch,
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

// Field type definitions
const fieldTypes = [
  { id: "text", label: "Short Text", icon: Type, color: "text-blue-400" },
  { id: "email", label: "Email", icon: Mail, color: "text-purple-400" },
  { id: "number", label: "Number", icon: Hash, color: "text-green-400" },
  { id: "tel", label: "Phone", icon: Phone, color: "text-orange-400" },
  { id: "url", label: "URL", icon: Link, color: "text-secondary" },
  { id: "date", label: "Date", icon: Calendar, color: "text-pink-400" },
  { id: "textarea", label: "Long Text", icon: FileText, color: "text-indigo-400" },
  { id: "select", label: "Dropdown", icon: List, color: "text-yellow-400" },
  { id: "radio", label: "Radio Buttons", icon: Circle, color: "text-red-400" },
  { id: "checkbox", label: "Checkboxes", icon: CheckSquare, color: "text-accent" },
  { id: "file", label: "File Upload", icon: UploadIcon, color: "text-violet-400" },
  { id: "rating", label: "Rating", icon: Star, color: "text-amber-400" },
  { id: "toggle", label: "Toggle", icon: ToggleLeft, color: "text-lime-400" },
  { id: "heading", label: "Heading", icon: AlignLeft, color: "text-slate-400" },
  { id: "paragraph", label: "Paragraph", icon: FileText, color: "text-gray-400" },
  { id: "image", label: "Image", icon: Image, color: "text-fuchsia-400" },
]

// Validation rule types
const validationRules = [
  { id: "required", label: "Required" },
  { id: "minLength", label: "Min Length" },
  { id: "maxLength", label: "Max Length" },
  { id: "min", label: "Min Value" },
  { id: "max", label: "Max Value" },
  { id: "pattern", label: "Pattern (Regex)" },
  { id: "email", label: "Email Format" },
  { id: "url", label: "URL Format" },
  { id: "phone", label: "Phone Format" },
]

// Form templates
const formTemplates = [
  {
    id: "contact",
    name: "Contact Form",
    description: "Simple contact form with name, email, and message",
    fields: [
      { id: "1", type: "text", label: "Full Name", required: true },
      { id: "2", type: "email", label: "Email Address", required: true },
      { id: "3", type: "textarea", label: "Message", required: true },
    ],
  },
  {
    id: "registration",
    name: "Event Registration",
    description: "Registration form for events",
    fields: [
      { id: "1", type: "text", label: "First Name", required: true },
      { id: "2", type: "text", label: "Last Name", required: true },
      { id: "3", type: "email", label: "Email", required: true },
      { id: "4", type: "tel", label: "Phone Number" },
      { id: "5", type: "select", label: "Ticket Type", options: ["General", "VIP", "Student"], required: true },
    ],
  },
  {
    id: "feedback",
    name: "Feedback Survey",
    description: "Customer feedback form",
    fields: [
      { id: "1", type: "rating", label: "Overall Experience", required: true },
      { id: "2", type: "radio", label: "Would you recommend us?", options: ["Yes", "No", "Maybe"], required: true },
      { id: "3", type: "textarea", label: "Additional Comments" },
    ],
  },
  {
    id: "application",
    name: "Job Application",
    description: "Employment application form",
    fields: [
      { id: "1", type: "heading", content: "Personal Information" },
      { id: "2", type: "text", label: "Full Name", required: true },
      { id: "3", type: "email", label: "Email", required: true },
      { id: "4", type: "tel", label: "Phone" },
      { id: "5", type: "heading", content: "Application Details" },
      { id: "6", type: "select", label: "Position", options: ["Developer", "Designer", "Manager"], required: true },
      { id: "7", type: "file", label: "Resume/CV", required: true },
      { id: "8", type: "textarea", label: "Cover Letter" },
    ],
  },
]

export default function FormBuilderPage() {
  const [fields, setFields] = useState<any[]>([])
  const [selectedField, setSelectedField] = useState<any>(null)
  const [pages, setPages] = useState([{ id: "page1", name: "Page 1", fields: [] }])
  const [currentPage, setCurrentPage] = useState("page1")
  const [formSettings, setFormSettings] = useState({
    title: "Untitled Form",
    description: "",
    submitButtonText: "Submit",
    multiStep: false,
    showProgress: true,
  })
  const [previewMode, setPreviewMode] = useState(false)
  const [showCodeDialog, setShowCodeDialog] = useState(false)
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("build")
  const [conditionalLogic, setConditionalLogic] = useState<any[]>([])
  const [draggedField, setDraggedField] = useState<string | null>(null)

  const fieldIdCounter = useRef(0)

  // Add field to form
  const addField = (fieldType: string) => {
    const newField = {
      id: `field-${++fieldIdCounter.current}`,
      type: fieldType,
      label: `${fieldTypes.find(f => f.id === fieldType)?.label || "Field"}`,
      placeholder: "",
      required: false,
      validation: [],
      options: fieldType === "select" || fieldType === "radio" || fieldType === "checkbox"
        ? ["Option 1", "Option 2", "Option 3"]
        : [],
      content: fieldType === "heading" ? "Heading Text" : fieldType === "paragraph" ? "Paragraph text..." : "",
      pageId: currentPage,
    }
    setFields([...fields, newField])
    setSelectedField(newField)
  }

  // Delete field
  const deleteField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId))
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
  }

  // Duplicate field
  const duplicateField = (field: any) => {
    const newField = {
      ...field,
      id: `field-${++fieldIdCounter.current}`,
      label: `${field.label} (Copy)`,
    }
    setFields([...fields, newField])
  }

  // Update field property
  const updateField = (fieldId: string, property: string, value: any) => {
    setFields(fields.map(f =>
      f.id === fieldId ? { ...f, [property]: value } : f
    ))
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, [property]: value })
    }
  }

  // Add validation rule
  const addValidation = (fieldId: string, rule: string) => {
    const field = fields.find(f => f.id === fieldId)
    if (field) {
      const validation = field.validation || []
      updateField(fieldId, "validation", [...validation, { rule, value: "" }])
    }
  }

  // Export form as JSON
  const exportJSON = () => {
    const formData = {
      settings: formSettings,
      fields,
      pages,
      conditionalLogic,
    }
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${formSettings.title.replace(/\s+/g, "-").toLowerCase()}.json`
    a.click()
  }

  // Load template
  const loadTemplate = (template: any) => {
    setFields(template.fields.map((f: any, i: number) => ({
      ...f,
      id: `field-${++fieldIdCounter.current}`,
      pageId: currentPage
    })))
    setFormSettings({ ...formSettings, title: template.name })
    setShowTemplatesDialog(false)
  }

  // Generate code
  const generateCode = () => {
    const code = `// Generated Form Component
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ${formSettings.title.replace(/\s+/g, "")}() {
  const [formData, setFormData] = useState({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">${formSettings.title}</h2>
        {formSettings.description && <p className="text-muted-foreground">${formSettings.description}</p>}
      </div>
${fields.map(field => {
  if (field.type === "text" || field.type === "email" || field.type === "number") {
    return `      <div className="space-y-2">
        <Label htmlFor="${field.id}">${field.label}${field.required ? " *" : ""}</Label>
        <Input
          id="${field.id}"
          type="${field.type}"
          placeholder="${field.placeholder || ""}"
          ${field.required ? 'required' : ''}
        />
      </div>`
  } else if (field.type === "textarea") {
    return `      <div className="space-y-2">
        <Label htmlFor="${field.id}">${field.label}${field.required ? " *" : ""}</Label>
        <Textarea
          id="${field.id}"
          placeholder="${field.placeholder || ""}"
          ${field.required ? 'required' : ''}
        />
      </div>`
  }
  return ""
}).join("\n")}
      <Button type="submit">${formSettings.submitButtonText}</Button>
    </form>
  )
}`
    return code
  }

  const currentPageFields = fields.filter(f => f.pageId === currentPage)

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
              <h1 className="text-3xl font-bold terminal-glow flex items-center gap-3 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                <Wand2 className="w-8 h-8" />
                Multi-step Form Builder
              </h1>
              <p className="text-muted-foreground mt-2">
                Create powerful forms with drag-and-drop, conditional logic, and multi-step support
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowTemplatesDialog(true)}>
                <Layout className="w-4 h-4 mr-2" />
                Templates
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowCodeDialog(true)}>
                <Code className="w-4 h-4 mr-2" />
                View Code
              </Button>
              <Button variant="outline" size="sm" onClick={exportJSON}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => setPreviewMode(!previewMode)}>
                {previewMode ? <Settings className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {previewMode ? "Edit" : "Preview"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Builder */}
        {!previewMode ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Field Palette - Left Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-12 lg:col-span-2"
            >
              <Card className="glass-dark sticky top-4">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Field Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-1">
                      {fieldTypes.map(fieldType => (
                        <motion.button
                          key={fieldType.id}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => addField(fieldType.id)}
                          className="w-full text-left px-3 py-2 rounded-lg border border-border/50 hover:border-primary/50 transition-all flex items-center gap-2 bg-card/50 hover:bg-card"
                        >
                          <fieldType.icon className={`w-4 h-4 ${fieldType.color}`} />
                          <span className="text-sm">{fieldType.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Form Canvas - Center */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-12 lg:col-span-6"
            >
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <Input
                        value={formSettings.title}
                        onChange={(e) => setFormSettings({ ...formSettings, title: e.target.value })}
                        className="text-xl font-bold border-0 bg-transparent px-0 focus-visible:ring-0"
                        placeholder="Form Title"
                      />
                      <Input
                        value={formSettings.description}
                        onChange={(e) => setFormSettings({ ...formSettings, description: e.target.value })}
                        className="text-sm text-muted-foreground border-0 bg-transparent px-0 focus-visible:ring-0"
                        placeholder="Form description (optional)"
                      />
                    </div>
                  </div>
                  {formSettings.multiStep && (
                    <div className="flex items-center gap-2 pt-4">
                      {pages.map((page, index) => (
                        <Button
                          key={page.id}
                          variant={currentPage === page.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page.id)}
                        >
                          {index + 1}. {page.name}
                        </Button>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newPage = { id: `page${pages.length + 1}`, name: `Page ${pages.length + 1}`, fields: [] }
                          setPages([...pages, newPage])
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    {currentPageFields.length === 0 ? (
                      <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">Start Building</h3>
                        <p className="text-sm text-muted-foreground">
                          Drag fields from the palette or click to add them to your form
                        </p>
                      </div>
                    ) : (
                      <Reorder.Group axis="y" values={currentPageFields} onReorder={(newOrder) => {
                        const otherFields = fields.filter(f => f.pageId !== currentPage)
                        setFields([...otherFields, ...newOrder])
                      }} className="space-y-3">
                        {currentPageFields.map((field) => (
                          <Reorder.Item key={field.id} value={field}>
                            <motion.div
                              layout
                              whileHover={{ scale: 1.01 }}
                              onClick={() => setSelectedField(field)}
                              className={`group border-2 rounded-xl p-4 cursor-pointer transition-all ${
                                selectedField?.id === field.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50 bg-card/50"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="cursor-grab active:cursor-grabbing">
                                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  {field.type === "heading" ? (
                                    <h3 className="text-xl font-bold">{field.content}</h3>
                                  ) : field.type === "paragraph" ? (
                                    <p className="text-muted-foreground">{field.content}</p>
                                  ) : field.type === "image" ? (
                                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                      <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                      <p className="text-sm text-muted-foreground">Image placeholder</p>
                                    </div>
                                  ) : (
                                    <>
                                      <Label className="text-sm font-medium flex items-center gap-2">
                                        {field.label}
                                        {field.required && <span className="text-destructive">*</span>}
                                      </Label>
                                      <div className="mt-2">
                                        {field.type === "textarea" ? (
                                          <Textarea placeholder={field.placeholder || "Type here..."} disabled />
                                        ) : field.type === "select" ? (
                                          <Select disabled>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select an option" />
                                            </SelectTrigger>
                                          </Select>
                                        ) : field.type === "radio" ? (
                                          <RadioGroup disabled>
                                            {field.options?.map((opt: string, i: number) => (
                                              <div key={i} className="flex items-center space-x-2">
                                                <RadioGroupItem value={opt} id={`${field.id}-${i}`} />
                                                <Label htmlFor={`${field.id}-${i}`}>{opt}</Label>
                                              </div>
                                            ))}
                                          </RadioGroup>
                                        ) : field.type === "checkbox" ? (
                                          <div className="space-y-2">
                                            {field.options?.map((opt: string, i: number) => (
                                              <div key={i} className="flex items-center space-x-2">
                                                <Checkbox id={`${field.id}-${i}`} disabled />
                                                <Label htmlFor={`${field.id}-${i}`}>{opt}</Label>
                                              </div>
                                            ))}
                                          </div>
                                        ) : field.type === "rating" ? (
                                          <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                              <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
                                            ))}
                                          </div>
                                        ) : field.type === "toggle" ? (
                                          <Switch disabled />
                                        ) : field.type === "file" ? (
                                          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                                            <UploadIcon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">Click or drag to upload</p>
                                          </div>
                                        ) : (
                                          <Input type={field.type} placeholder={field.placeholder || "Enter value..."} disabled />
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      duplicateField(field)
                                    }}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteField(field.id)
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
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

            {/* Properties Panel - Right Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-12 lg:col-span-4"
            >
              <Card className="glass-dark sticky top-4">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    {selectedField ? "Field Properties" : "Form Settings"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    {selectedField ? (
                      <div className="space-y-6">
                        {/* Basic Properties */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Field Type</Label>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                              {(() => {
                                const fieldType = fieldTypes.find(ft => ft.id === selectedField.type)
                                return fieldType ? (
                                  <>
                                    <fieldType.icon className={`w-4 h-4 ${fieldType.color}`} />
                                    <span className="text-sm">{fieldType.label}</span>
                                  </>
                                ) : null
                              })()}
                            </div>
                          </div>

                          {!["heading", "paragraph", "image"].includes(selectedField.type) && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="field-label">Label</Label>
                                <Input
                                  id="field-label"
                                  value={selectedField.label}
                                  onChange={(e) => updateField(selectedField.id, "label", e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="field-placeholder">Placeholder</Label>
                                <Input
                                  id="field-placeholder"
                                  value={selectedField.placeholder || ""}
                                  onChange={(e) => updateField(selectedField.id, "placeholder", e.target.value)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <Label htmlFor="field-required">Required Field</Label>
                                <Switch
                                  id="field-required"
                                  checked={selectedField.required}
                                  onCheckedChange={(checked) => updateField(selectedField.id, "required", checked)}
                                />
                              </div>
                            </>
                          )}

                          {(selectedField.type === "heading" || selectedField.type === "paragraph") && (
                            <div className="space-y-2">
                              <Label htmlFor="field-content">Content</Label>
                              <Textarea
                                id="field-content"
                                value={selectedField.content || ""}
                                onChange={(e) => updateField(selectedField.id, "content", e.target.value)}
                                rows={selectedField.type === "paragraph" ? 4 : 2}
                              />
                            </div>
                          )}

                          {(selectedField.type === "select" || selectedField.type === "radio" || selectedField.type === "checkbox") && (
                            <div className="space-y-2">
                              <Label>Options</Label>
                              <div className="space-y-2">
                                {selectedField.options?.map((option: string, index: number) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Input
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...selectedField.options]
                                        newOptions[index] = e.target.value
                                        updateField(selectedField.id, "options", newOptions)
                                      }}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newOptions = selectedField.options.filter((_: any, i: number) => i !== index)
                                        updateField(selectedField.id, "options", newOptions)
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
                                    const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`]
                                    updateField(selectedField.id, "options", newOptions)
                                  }}
                                  className="w-full"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Option
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* Validation Rules */}
                        {!["heading", "paragraph", "image"].includes(selectedField.type) && (
                          <div className="space-y-4">
                            <Label className="text-sm font-semibold">Validation Rules</Label>
                            <div className="space-y-2">
                              {validationRules.map(rule => (
                                <div key={rule.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`validation-${rule.id}`}
                                    checked={selectedField.validation?.some((v: any) => v.rule === rule.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        addValidation(selectedField.id, rule.id)
                                      } else {
                                        const newValidation = selectedField.validation?.filter((v: any) => v.rule !== rule.id) || []
                                        updateField(selectedField.id, "validation", newValidation)
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`validation-${rule.id}`} className="text-sm">
                                    {rule.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Separator />

                        {/* Conditional Logic */}
                        <div className="space-y-4">
                          <Label className="text-sm font-semibold flex items-center gap-2">
                            <GitBranch className="w-4 h-4" />
                            Conditional Logic
                          </Label>
                          <Button variant="outline" size="sm" className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Condition
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Show or hide this field based on answers to other questions
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Form Settings */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="submit-text">Submit Button Text</Label>
                            <Input
                              id="submit-text"
                              value={formSettings.submitButtonText}
                              onChange={(e) => setFormSettings({ ...formSettings, submitButtonText: e.target.value })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="multi-step">Multi-step Form</Label>
                            <Switch
                              id="multi-step"
                              checked={formSettings.multiStep}
                              onCheckedChange={(checked) => setFormSettings({ ...formSettings, multiStep: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-progress">Show Progress Bar</Label>
                            <Switch
                              id="show-progress"
                              checked={formSettings.showProgress}
                              onCheckedChange={(checked) => setFormSettings({ ...formSettings, showProgress: checked })}
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <Label className="text-sm font-semibold">Quick Actions</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" onClick={() => setShowTemplatesDialog(true)}>
                              <Layout className="w-4 h-4 mr-2" />
                              Templates
                            </Button>
                            <Button variant="outline" size="sm" onClick={exportJSON}>
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setShowCodeDialog(true)}>
                              <Code className="w-4 h-4 mr-2" />
                              Code
                            </Button>
                            <Button variant="outline" size="sm">
                              <Save className="w-4 h-4 mr-2" />
                              Save
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
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-2xl">{formSettings.title}</CardTitle>
                {formSettings.description && (
                  <CardDescription>{formSettings.description}</CardDescription>
                )}
                {formSettings.showProgress && formSettings.multiStep && (
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Step {pages.findIndex(p => p.id === currentPage) + 1} of {pages.length}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(((pages.findIndex(p => p.id === currentPage) + 1) / pages.length) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${((pages.findIndex(p => p.id === currentPage) + 1) / pages.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {currentPageFields.map(field => (
                  <div key={field.id}>
                    {field.type === "heading" ? (
                      <h3 className="text-xl font-bold">{field.content}</h3>
                    ) : field.type === "paragraph" ? (
                      <p className="text-muted-foreground">{field.content}</p>
                    ) : field.type === "image" ? (
                      <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                        <Image className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Image placeholder</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>
                          {field.label}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {field.type === "textarea" ? (
                          <Textarea placeholder={field.placeholder || "Type here..."} />
                        ) : field.type === "select" ? (
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((opt: string, i: number) => (
                                <SelectItem key={i} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.type === "radio" ? (
                          <RadioGroup>
                            {field.options?.map((opt: string, i: number) => (
                              <div key={i} className="flex items-center space-x-2">
                                <RadioGroupItem value={opt} id={`preview-${field.id}-${i}`} />
                                <Label htmlFor={`preview-${field.id}-${i}`}>{opt}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        ) : field.type === "checkbox" ? (
                          <div className="space-y-2">
                            {field.options?.map((opt: string, i: number) => (
                              <div key={i} className="flex items-center space-x-2">
                                <Checkbox id={`preview-${field.id}-${i}`} />
                                <Label htmlFor={`preview-${field.id}-${i}`}>{opt}</Label>
                              </div>
                            ))}
                          </div>
                        ) : field.type === "rating" ? (
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} className="w-8 h-8 text-muted-foreground hover:text-amber-400 cursor-pointer transition-colors" />
                            ))}
                          </div>
                        ) : field.type === "toggle" ? (
                          <Switch />
                        ) : field.type === "file" ? (
                          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                            <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click or drag to upload</p>
                          </div>
                        ) : (
                          <Input type={field.type} placeholder={field.placeholder || "Enter value..."} />
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex items-center justify-between pt-6">
                  {formSettings.multiStep && pages.findIndex(p => p.id === currentPage) > 0 && (
                    <Button variant="outline">
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  <Button className="ml-auto">
                    {formSettings.multiStep && pages.findIndex(p => p.id === currentPage) < pages.length - 1 ? (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      formSettings.submitButtonText
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Code Dialog */}
        <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
          <DialogContent className="glass-overlay max-w-[95vw] sm:max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Generated Code
              </DialogTitle>
              <DialogDescription>
                Copy this code to use in your React application
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[500px]">
              <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-primary">{generateCode()}</code>
              </pre>
            </ScrollArea>
            <DialogFooter>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(generateCode())
                }}
              >
                Copy Code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Templates Dialog */}
        <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
          <DialogContent className="glass-overlay max-w-[95vw] sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Form Templates
              </DialogTitle>
              <DialogDescription>
                Start with a pre-built template and customize it to your needs
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {formTemplates.map(template => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => loadTemplate(template)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{template.fields.length} fields</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

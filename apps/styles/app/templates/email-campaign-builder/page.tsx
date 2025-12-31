"use client"

import * as React from "react"
import {
  Mail,
  Send,
  Save,
  Eye,
  Plus,
  Trash,
  GripVertical,
  Image as ImageIcon,
  Type,
  Minus,
  Link as LinkIcon,
  Share2,
  Users,
  Calendar,
  Clock,
  Target,
  Settings,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  ChevronRight,
  Smartphone,
  Monitor,
  Code,
  Palette,
  AlignLeft,
  AlignCenter,
  Bold,
  Italic,
  List,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  PlayCircle,
  Zap
} from "lucide-react"
import { motion, AnimatePresence, Reorder } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Block types for the email builder
type BlockType = "header" | "text" | "image" | "button" | "divider" | "social" | "footer" | "columns"

interface EmailBlock {
  id: string
  type: BlockType
  content: any
}

// Available content blocks
const blockTypes = [
  {
    type: "header" as BlockType,
    icon: Type,
    label: "Header",
    description: "Title and heading text"
  },
  {
    type: "text" as BlockType,
    icon: AlignLeft,
    label: "Text",
    description: "Paragraph content"
  },
  {
    type: "image" as BlockType,
    icon: ImageIcon,
    label: "Image",
    description: "Image with optional link"
  },
  {
    type: "button" as BlockType,
    icon: Target,
    label: "Button",
    description: "Call-to-action button"
  },
  {
    type: "divider" as BlockType,
    icon: Minus,
    label: "Divider",
    description: "Horizontal separator"
  },
  {
    type: "social" as BlockType,
    icon: Share2,
    label: "Social Links",
    description: "Social media icons"
  },
  {
    type: "footer" as BlockType,
    icon: AlignCenter,
    label: "Footer",
    description: "Legal text and links"
  },
  {
    type: "columns" as BlockType,
    icon: List,
    label: "Columns",
    description: "Multi-column layout"
  }
]

// Recipient segments
const segments = [
  { id: "all", name: "All Subscribers", count: 45230 },
  { id: "active", name: "Active Users", count: 32145 },
  { id: "trial", name: "Trial Users", count: 5678 },
  { id: "premium", name: "Premium Members", count: 12340 },
  { id: "inactive", name: "Inactive (30+ days)", count: 8920 }
]

// Email templates for quick start
const quickTemplates = [
  { id: "blank", name: "Blank Canvas", description: "Start from scratch" },
  { id: "newsletter", name: "Newsletter", description: "Pre-built newsletter layout" },
  { id: "announcement", name: "Announcement", description: "Product announcement template" },
  { id: "promotion", name: "Promotion", description: "Sale/discount template" }
]

export default function EmailCampaignBuilderPage() {
  const [blocks, setBlocks] = React.useState<EmailBlock[]>([
    {
      id: "1",
      type: "header",
      content: { text: "Welcome to Our Newsletter", align: "center", size: "2xl" }
    },
    {
      id: "2",
      type: "text",
      content: { text: "This is your monthly update with the latest news and features." }
    },
    {
      id: "3",
      type: "button",
      content: {
        text: "Read More",
        url: "#",
        color: "#10b981",
        align: "center"
      }
    }
  ])

  const [selectedBlock, setSelectedBlock] = React.useState<string | null>(null)
  const [campaignName, setCampaignName] = React.useState("Monthly Newsletter - November 2025")
  const [subject, setSubject] = React.useState("Your November Update")
  const [subjectVariant, setSubjectVariant] = React.useState("November Newsletter: What's New")
  const [preheader, setPreheader] = React.useState("Don't miss these updates")
  const [selectedSegment, setSelectedSegment] = React.useState("all")
  const [scheduleType, setScheduleType] = React.useState<"immediate" | "scheduled" | "automated">("immediate")
  const [scheduleDate, setScheduleDate] = React.useState("2025-11-22")
  const [scheduleTime, setScheduleTime] = React.useState("10:00")
  const [enableABTest, setEnableABTest] = React.useState(false)
  const [previewDevice, setPreviewDevice] = React.useState<"desktop" | "mobile">("desktop")
  const [showSendDialog, setShowSendDialog] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  const selectedSegmentData = segments.find(s => s.id === selectedSegment)

  const addBlock = (type: BlockType) => {
    const newBlock: EmailBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type)
    }
    setBlocks([...blocks, newBlock])
  }

  const getDefaultContent = (type: BlockType) => {
    switch (type) {
      case "header":
        return { text: "Heading Text", align: "left", size: "xl" }
      case "text":
        return { text: "Your paragraph text goes here." }
      case "image":
        return { url: "https://images.unsplash.com/photo-1557821552-17105176677c?w=600", alt: "Image", link: "" }
      case "button":
        return { text: "Click Here", url: "#", color: "#10b981", align: "center" }
      case "divider":
        return { color: "#e5e7eb", width: "100%" }
      case "social":
        return { platforms: ["facebook", "twitter", "instagram", "linkedin"] }
      case "footer":
        return { text: "© 2025 Acme Inc. All rights reserved.", links: [] }
      case "columns":
        return { columns: [{ text: "Column 1" }, { text: "Column 2" }] }
      default:
        return {}
    }
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id))
    if (selectedBlock === id) setSelectedBlock(null)
  }

  const updateBlock = (id: string, content: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b))
  }

  const renderBlock = (block: EmailBlock) => {
    const isSelected = selectedBlock === block.id

    return (
      <motion.div
        key={block.id}
        layout
        className={`group relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
          isSelected ? "border-primary bg-primary/5" : "border-transparent hover:border-muted-foreground/20"
        }`}
        onClick={() => setSelectedBlock(block.id)}
      >
        {/* Drag Handle */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            deleteBlock(block.id)
          }}
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-destructive/10 hover:bg-destructive/20"
        >
          <Trash className="h-4 w-4 text-destructive" />
        </button>

        {/* Block Content */}
        <div className="ml-6">
          {block.type === "header" && (
            <h2 className={`font-bold text-${block.content.size} text-${block.content.align}`}>
              {block.content.text}
            </h2>
          )}
          {block.type === "text" && (
            <p className="text-gray-700">{block.content.text}</p>
          )}
          {block.type === "image" && (
            <img
              src={block.content.url}
              alt={block.content.alt}
              className="w-full h-48 object-cover rounded"
            />
          )}
          {block.type === "button" && (
            <div className={`text-${block.content.align}`}>
              <button
                className="px-6 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: block.content.color }}
              >
                {block.content.text}
              </button>
            </div>
          )}
          {block.type === "divider" && (
            <hr style={{ borderColor: block.content.color, width: block.content.width }} />
          )}
          {block.type === "social" && (
            <div className="flex gap-3 justify-center">
              {block.content.platforms?.map((platform: string) => (
                <div key={platform} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {platform[0].toUpperCase()}
                </div>
              ))}
            </div>
          )}
          {block.type === "footer" && (
            <div className="text-center text-sm text-gray-600">
              <p>{block.content.text}</p>
            </div>
          )}
          {block.type === "columns" && (
            <div className="grid grid-cols-2 gap-4">
              {block.content.columns?.map((col: any, i: number) => (
                <div key={i} className="border p-3 rounded">
                  {col.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  const renderBlockEditor = () => {
    const block = blocks.find(b => b.id === selectedBlock)
    if (!block) return <div className="text-center text-muted-foreground py-8">Select a block to edit</div>

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Badge>{block.type}</Badge>
          <span className="text-sm font-medium capitalize">{block.type} Settings</span>
        </div>

        {block.type === "header" && (
          <>
            <div>
              <Label className="mb-2 block">Text</Label>
              <Input
                value={block.content.text}
                onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              />
            </div>
            <div>
              <Label className="mb-2 block">Size</Label>
              <Select
                value={block.content.size}
                onValueChange={(value) => updateBlock(block.id, { ...block.content, size: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xl">Large</SelectItem>
                  <SelectItem value="2xl">Extra Large</SelectItem>
                  <SelectItem value="3xl">Huge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Alignment</Label>
              <div className="flex gap-2">
                {["left", "center", "right"].map(align => (
                  <Button
                    key={align}
                    variant={block.content.align === align ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateBlock(block.id, { ...block.content, align })}
                  >
                    {align}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {block.type === "text" && (
          <div>
            <Label className="mb-2 block">Content</Label>
            <Textarea
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              rows={6}
            />
          </div>
        )}

        {block.type === "image" && (
          <>
            <div>
              <Label className="mb-2 block">Image URL</Label>
              <div className="flex gap-2">
                <Input
                  value={block.content.url}
                  onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                  placeholder="https://..."
                />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Alt Text</Label>
              <Input
                value={block.content.alt}
                onChange={(e) => updateBlock(block.id, { ...block.content, alt: e.target.value })}
              />
            </div>
            <div>
              <Label className="mb-2 block">Link URL (optional)</Label>
              <Input
                value={block.content.link}
                onChange={(e) => updateBlock(block.id, { ...block.content, link: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </>
        )}

        {block.type === "button" && (
          <>
            <div>
              <Label className="mb-2 block">Button Text</Label>
              <Input
                value={block.content.text}
                onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              />
            </div>
            <div>
              <Label className="mb-2 block">Button URL</Label>
              <Input
                value={block.content.url}
                onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label className="mb-2 block">Button Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={block.content.color}
                  onChange={(e) => updateBlock(block.id, { ...block.content, color: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={block.content.color}
                  onChange={(e) => updateBlock(block.id, { ...block.content, color: e.target.value })}
                  className="flex-1 font-mono"
                />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Alignment</Label>
              <div className="flex gap-2">
                {["left", "center", "right"].map(align => (
                  <Button
                    key={align}
                    variant={block.content.align === align ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateBlock(block.id, { ...block.content, align })}
                  >
                    {align}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  const campaignChecklist = [
    { id: "subject", label: "Subject line set", checked: subject.length > 0 },
    { id: "preheader", label: "Preheader text added", checked: preheader.length > 0 },
    { id: "content", label: "Email content added", checked: blocks.length > 0 },
    { id: "cta", label: "Call-to-action included", checked: blocks.some(b => b.type === "button") },
    { id: "segment", label: "Audience selected", checked: selectedSegment !== "" },
    { id: "schedule", label: "Send time configured", checked: true },
    { id: "preview", label: "Previewed on mobile", checked: true },
    { id: "test", label: "Test email sent", checked: false }
  ]

  const completedChecks = campaignChecklist.filter(c => c.checked).length
  const checklistProgress = (completedChecks / campaignChecklist.length) * 100

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="glass p-3 rounded-xl">
                <PlayCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Email Campaign Builder
                </h1>
                <p className="text-muted-foreground mt-1">
                  Drag-and-drop email builder with scheduling
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave}>
                {saved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Saved
                  </>
                ) : isSaving ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </>
                )}
              </Button>
              <Button onClick={() => setShowSendDialog(true)}>
                <Send className="h-4 w-4 mr-2" />
                Send Campaign
              </Button>
            </div>
          </div>

          {/* Campaign Name */}
          <Input
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="text-xl font-semibold border-none bg-transparent focus-visible:ring-0 px-0"
            placeholder="Campaign name..."
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Content Blocks Palette */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="glass p-4">
              <h3 className="text-sm font-semibold mb-3">Content Blocks</h3>
              <ScrollArea className="h-[700px]">
                <div className="space-y-2">
                  {blockTypes.map((blockType) => (
                    <button
                      key={blockType.type}
                      onClick={() => addBlock(blockType.type)}
                      className="w-full p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <blockType.icon className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{blockType.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{blockType.description}</p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </motion.div>

          {/* Email Canvas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-6"
          >
            <Card className="glass p-6">
              <Tabs defaultValue="build" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="build">
                    <Settings className="h-4 w-4 mr-2" />
                    Build
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="build" className="space-y-4">
                  {/* Email Settings */}
                  <div className="glass-dark p-4 rounded-lg space-y-3">
                    <div>
                      <Label className="text-xs mb-1 block">Subject Line</Label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter subject..."
                      />
                    </div>

                    <div>
                      <Label className="text-xs mb-1 block">Preheader Text</Label>
                      <Input
                        value={preheader}
                        onChange={(e) => setPreheader(e.target.value)}
                        placeholder="Preview text..."
                      />
                    </div>

                    {/* A/B Test Toggle */}
                    <div className="flex items-center justify-between pt-2">
                      <Label className="text-xs">A/B Test Subject Line</Label>
                      <Switch checked={enableABTest} onCheckedChange={setEnableABTest} />
                    </div>

                    {enableABTest && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <Label className="text-xs mb-1 block">Variant B Subject</Label>
                        <Input
                          value={subjectVariant}
                          onChange={(e) => setSubjectVariant(e.target.value)}
                          placeholder="Alternative subject..."
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Email Blocks */}
                  <ScrollArea className="h-[550px]">
                    <div className="space-y-3 pr-4">
                      <AnimatePresence>
                        {blocks.length === 0 ? (
                          <div className="text-center py-16 text-muted-foreground">
                            <Mail className="h-16 w-16 mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-medium mb-2">Start Building Your Email</p>
                            <p className="text-sm">Add content blocks from the left panel</p>
                          </div>
                        ) : (
                          blocks.map((block) => renderBlock(block))
                        )}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>

                  {/* Quick Add */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addBlock("text")}
                      className="flex-1"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Text
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addBlock("image")}
                      className="flex-1"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Image
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addBlock("button")}
                      className="flex-1"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Button
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  {/* Preview Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant={previewDevice === "desktop" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreviewDevice("desktop")}
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        Desktop
                      </Button>
                      <Button
                        variant={previewDevice === "mobile" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreviewDevice("mobile")}
                      >
                        <Smartphone className="h-4 w-4 mr-2" />
                        Mobile
                      </Button>
                    </div>

                    <Button variant="outline" size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send Test
                    </Button>
                  </div>

                  {/* Email Preview */}
                  <ScrollArea className="h-[600px]">
                    <div className="glass-dark p-4 rounded-lg">
                      {/* Email Header */}
                      <div className="border-b border-border pb-3 mb-4">
                        <div className="text-xs text-muted-foreground mb-1">Subject:</div>
                        <div className="font-semibold">{subject}</div>
                        {preheader && (
                          <>
                            <div className="text-xs text-muted-foreground mt-2 mb-1">Preheader:</div>
                            <div className="text-sm text-muted-foreground">{preheader}</div>
                          </>
                        )}
                      </div>

                      {/* Email Body */}
                      <div
                        className={`mx-auto bg-white text-gray-900 rounded-lg overflow-hidden ${
                          previewDevice === "mobile" ? "max-w-[375px]" : "max-w-[600px]"
                        }`}
                      >
                        <div className="p-8">
                          <div className="space-y-6">
                            {blocks.map((block) => (
                              <div key={block.id}>
                                {block.type === "header" && (
                                  <h2
                                    className={`font-bold text-${block.content.size} text-${block.content.align}`}
                                  >
                                    {block.content.text}
                                  </h2>
                                )}
                                {block.type === "text" && <p className="text-gray-700">{block.content.text}</p>}
                                {block.type === "image" && (
                                  <img
                                    src={block.content.url}
                                    alt={block.content.alt}
                                    className="w-full rounded-lg"
                                  />
                                )}
                                {block.type === "button" && (
                                  <div className={`text-${block.content.align}`}>
                                    <a
                                      href={block.content.url}
                                      className="inline-block px-6 py-3 rounded-lg text-white font-semibold"
                                      style={{ backgroundColor: block.content.color }}
                                    >
                                      {block.content.text}
                                    </a>
                                  </div>
                                )}
                                {block.type === "divider" && (
                                  <hr
                                    style={{
                                      borderColor: block.content.color,
                                      width: block.content.width
                                    }}
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Footer */}
                          <Separator className="my-8" />
                          <div className="text-center text-xs text-gray-500">
                            <p className="mb-2">
                              <a href="#" className="text-gray-500 hover:underline">
                                Unsubscribe
                              </a>
                              {" | "}
                              <a href="#" className="text-gray-500 hover:underline">
                                View in Browser
                              </a>
                            </p>
                            <p>Acme Inc, 123 Business St, San Francisco, CA 94102</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Settings Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="space-y-4">
              {/* Block Editor */}
              <Card className="glass p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Block Settings
                </h3>
                <ScrollArea className="h-[300px]">
                  {renderBlockEditor()}
                </ScrollArea>
              </Card>

              {/* Audience */}
              <Card className="glass p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Audience
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-2 block">Recipient Segment</Label>
                    <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {segments.map((segment) => (
                          <SelectItem key={segment.id} value={segment.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{segment.name}</span>
                              <span className="text-xs text-muted-foreground ml-3">
                                {segment.count.toLocaleString()}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedSegmentData && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Will send to {selectedSegmentData.count.toLocaleString()} recipients
                      </p>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="h-3 w-3 mr-2" />
                    Upload Contact List
                  </Button>
                </div>
              </Card>

              {/* Schedule */}
              <Card className="glass p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Send Schedule
                </h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={scheduleType === "immediate"}
                        onChange={() => setScheduleType("immediate")}
                        className="text-primary"
                      />
                      <span className="text-sm">Send Immediately</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={scheduleType === "scheduled"}
                        onChange={() => setScheduleType("scheduled")}
                        className="text-primary"
                      />
                      <span className="text-sm">Schedule for Later</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={scheduleType === "automated"}
                        onChange={() => setScheduleType("automated")}
                        className="text-primary"
                      />
                      <span className="text-sm">Automated (Trigger-based)</span>
                    </label>
                  </div>

                  {scheduleType === "scheduled" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3"
                    >
                      <div>
                        <Label className="text-xs mb-1 block">Date</Label>
                        <Input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Time</Label>
                        <Input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>

              {/* Campaign Checklist */}
              <Card className="glass p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Checklist
                  </h3>
                  <Badge variant={checklistProgress === 100 ? "default" : "secondary"}>
                    {completedChecks}/{campaignChecklist.length}
                  </Badge>
                </div>

                <Progress value={checklistProgress} className="mb-4" />

                <div className="space-y-2">
                  {campaignChecklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-sm">
                      {item.checked ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className={item.checked ? "text-muted-foreground" : ""}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Send Confirmation Dialog */}
        <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
          <DialogContent className="glass-overlay">
            <DialogHeader>
              <DialogTitle>Send Campaign?</DialogTitle>
              <DialogDescription>
                Review your campaign details before sending
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="glass-dark p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Campaign:</span>
                  <span className="font-medium">{campaignName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recipients:</span>
                  <span className="font-medium">{selectedSegmentData?.count.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-medium">{subject}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Schedule:</span>
                  <span className="font-medium capitalize">{scheduleType}</span>
                </div>
                {enableABTest && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">A/B Test:</span>
                    <span className="font-medium">Enabled</span>
                  </div>
                )}
              </div>

              {checklistProgress < 100 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium">Checklist incomplete</div>
                    <div className="text-muted-foreground">
                      {campaignChecklist.length - completedChecks} items remaining
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowSendDialog(false)
                // Handle send logic
              }}>
                <Send className="h-4 w-4 mr-2" />
                Confirm Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

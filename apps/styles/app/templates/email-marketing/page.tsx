"use client"

import * as React from "react"
import {
  Mail,
  Send,
  Eye,
  Copy,
  Check,
  Search,
  Filter,
  Download,
  Code,
  Smartphone,
  Monitor,
  Settings,
  Plus,
  Image as ImageIcon,
  Type,
  Palette,
  Zap,
  TrendingUp,
  Users,
  Target,
  Calendar,
  Clock,
  BarChart3,
  Layout,
  Newspaper,
  Package,
  Megaphone,
  PartyPopper,
  BookOpen,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Star,
  Heart,
  MessageSquare,
  Share2,
  PlayCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button, Input, Badge, Card, Tabs, TabsContent, TabsList, TabsTrigger, Label, Textarea, Switch, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, ScrollArea, Slider, Progress } from "@ggprompts/ui"

// Marketing email templates
const marketingTemplates = [
  {
    id: "newsletter-basic",
    name: "Basic Newsletter",
    icon: Newspaper,
    category: "Newsletter",
    layout: "single-column",
    description: "Clean single-column newsletter layout"
  },
  {
    id: "newsletter-featured",
    name: "Featured Newsletter",
    icon: Star,
    category: "Newsletter",
    layout: "featured-hero",
    description: "Newsletter with hero image and featured content"
  },
  {
    id: "newsletter-digest",
    name: "Content Digest",
    icon: BookOpen,
    category: "Newsletter",
    layout: "multi-article",
    description: "Multiple articles with images"
  },
  {
    id: "product-announcement",
    name: "Product Announcement",
    icon: Megaphone,
    category: "Product",
    layout: "centered-cta",
    description: "Announce new products or features"
  },
  {
    id: "promotional",
    name: "Promotional Campaign",
    icon: PartyPopper,
    category: "Promotion",
    layout: "sale-banner",
    description: "Sales, discounts, and special offers"
  },
  {
    id: "event-invitation",
    name: "Event Invitation",
    icon: Calendar,
    category: "Events",
    layout: "event-card",
    description: "Webinar, conference, or event invites"
  },
  {
    id: "blog-digest",
    name: "Blog Roundup",
    icon: BookOpen,
    category: "Content",
    layout: "blog-grid",
    description: "Curated blog posts and articles"
  },
  {
    id: "re-engagement",
    name: "Re-engagement",
    icon: UserPlus,
    category: "Retention",
    layout: "win-back",
    description: "Win back inactive subscribers"
  }
]

// Spam score checker rules
const spamChecks = [
  { id: "subject-caps", label: "No excessive CAPS in subject", check: (subject: string) => !(subject.match(/[A-Z]{5,}/)) },
  { id: "subject-spam-words", label: "No spam trigger words", check: (subject: string) => !/(free|winner|click here|act now)/i.test(subject) },
  { id: "unsubscribe-link", label: "Includes unsubscribe link", check: (body: string) => /unsubscribe/i.test(body) },
  { id: "text-to-image", label: "Balanced text-to-image ratio", check: () => true },
  { id: "from-name", label: "Recognizable from name", check: () => true },
  { id: "alt-text", label: "Images have alt text", check: (body: string) => !/<img[^>]*>/.test(body) || /alt=/.test(body) }
]

// Email client compatibility
const emailClients = [
  { name: "Gmail", icon: Mail, compatibility: 95 },
  { name: "Outlook", icon: Mail, compatibility: 90 },
  { name: "Apple Mail", icon: Mail, compatibility: 98 },
  { name: "Yahoo", icon: Mail, compatibility: 92 },
  { name: "Mobile", icon: Smartphone, compatibility: 96 }
]

export default function EmailMarketingPage() {
  const [selectedTemplate, setSelectedTemplate] = React.useState(marketingTemplates[0])
  const [subject, setSubject] = React.useState("Your Monthly Newsletter - November 2025")
  const [preheader, setPreheader] = React.useState("Discover new features, tips, and exclusive content")
  const [heroImage, setHeroImage] = React.useState("https://images.unsplash.com/photo-1557821552-17105176677c?w=600")
  const [ctaText, setCtaText] = React.useState("Read More")
  const [ctaUrl, setCtaUrl] = React.useState("#")
  const [ctaColor, setCtaColor] = React.useState("#10b981")
  const [previewDevice, setPreviewDevice] = React.useState<"desktop" | "mobile">("desktop")
  const [showSpamScore, setShowSpamScore] = React.useState(false)
  const [enableABTest, setEnableABTest] = React.useState(false)
  const [variantSubject, setVariantSubject] = React.useState("November Newsletter: What's New")

  const spamScore = React.useMemo(() => {
    const emailBody = "Sample email body with unsubscribe link"
    const passedChecks = spamChecks.filter(check => check.check(subject + " " + emailBody)).length
    return Math.round((passedChecks / spamChecks.length) * 100)
  }, [subject])

  const renderNewsletterPreview = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center py-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold mb-2" style={{ color: ctaColor }}>
            Acme Newsletter
          </h1>
          <p className="text-gray-600 text-sm">November 2025 • Volume 42</p>
        </div>

        {/* Hero Section */}
        {selectedTemplate.layout === "featured-hero" && (
          <div className="mb-6">
            <img
              src={heroImage}
              alt="Newsletter hero"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-3">Featured Story: Innovation in Action</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Discover how our latest features are transforming the way teams collaborate.
              Join thousands of users who are already experiencing the difference.
            </p>
            <a
              href={ctaUrl}
              className="inline-block px-6 py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: ctaColor }}
            >
              {ctaText}
            </a>
          </div>
        )}

        {/* Content Sections */}
        <div className={selectedTemplate.layout === "blog-grid" ? "grid grid-cols-2 gap-6" : "space-y-8"}>
          {/* Article 1 */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400"
              alt="Article 1"
              className="w-full h-48 object-cover rounded-lg mb-3"
            />
            <Badge className="mb-2">Product Update</Badge>
            <h3 className="text-xl font-bold mb-2">New Dashboard Analytics</h3>
            <p className="text-gray-700 mb-3 text-sm leading-relaxed">
              Get deeper insights with our redesigned analytics dashboard featuring real-time data visualization.
            </p>
            <a href="#" className="text-sm font-semibold" style={{ color: ctaColor }}>
              Learn More →
            </a>
          </div>

          {/* Article 2 */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400"
              alt="Article 2"
              className="w-full h-48 object-cover rounded-lg mb-3"
            />
            <Badge className="mb-2">Tutorial</Badge>
            <h3 className="text-xl font-bold mb-2">5 Tips for Better Collaboration</h3>
            <p className="text-gray-700 mb-3 text-sm leading-relaxed">
              Maximize your team's productivity with these proven collaboration strategies.
            </p>
            <a href="#" className="text-sm font-semibold" style={{ color: ctaColor }}>
              Read Guide →
            </a>
          </div>

          {/* Article 3 */}
          {selectedTemplate.layout === "multi-article" && (
            <div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400"
                alt="Article 3"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <Badge className="mb-2">Case Study</Badge>
              <h3 className="text-xl font-bold mb-2">How TechCorp Scaled 10x</h3>
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                Learn how this startup grew from 10 to 100 employees using our platform.
              </p>
              <a href="#" className="text-sm font-semibold" style={{ color: ctaColor }}>
                Read Story →
              </a>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Get Started?</h3>
          <p className="text-gray-700 mb-6">
            Join 50,000+ teams already using our platform
          </p>
          <a
            href={ctaUrl}
            className="inline-block px-8 py-4 rounded-lg text-white font-semibold text-lg"
            style={{ backgroundColor: ctaColor }}
          >
            {ctaText}
          </a>
        </div>

        {/* Social Links */}
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Follow us on social media</p>
          <div className="flex justify-center gap-4 mb-6">
            {[
              { icon: MessageSquare, label: "Twitter" },
              { icon: Share2, label: "LinkedIn" },
              { icon: Heart, label: "Instagram" }
            ].map((social, i) => (
              <a
                key={i}
                href="#"
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <social.icon className="h-5 w-5 text-gray-700" />
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderPromotionalPreview = () => {
    return (
      <div className="space-y-6">
        {/* Sale Banner */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 text-center rounded-lg">
          <p className="text-sm font-semibold mb-2">LIMITED TIME OFFER</p>
          <h1 className="text-4xl font-bold mb-2">Black Friday Sale</h1>
          <p className="text-2xl mb-4">Save up to 50% on all plans</p>
          <div className="text-sm">Ends in: 2 days 14 hours 23 minutes</div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="bg-gray-100 h-40 rounded-lg mb-3 flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
              <Badge className="mb-2 bg-red-500">50% OFF</Badge>
              <h3 className="font-bold mb-1">Pro Plan</h3>
              <div className="mb-3">
                <span className="text-2xl font-bold" style={{ color: ctaColor }}>$49</span>
                <span className="text-gray-500 line-through ml-2">$99</span>
              </div>
              <Button className="w-full" style={{ backgroundColor: ctaColor }}>
                Claim Deal
              </Button>
            </div>
          ))}
        </div>

        {/* Urgency CTA */}
        <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-lg text-center">
          <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Don't Miss Out!</h3>
          <p className="text-gray-700 mb-4">This exclusive offer expires soon</p>
          <Button size="lg" style={{ backgroundColor: ctaColor }}>
            Shop Now
          </Button>
        </div>
      </div>
    )
  }

  const renderEventPreview = () => {
    return (
      <div className="space-y-6">
        {/* Event Header */}
        <div className="relative">
          <img
            src={heroImage}
            alt="Event"
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent rounded-lg flex items-end">
            <div className="p-6 text-white">
              <Badge className="mb-2">Virtual Event</Badge>
              <h1 className="text-3xl font-bold mb-2">Annual Tech Summit 2025</h1>
              <p className="text-lg">December 15, 2025 • 10:00 AM PST</p>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="glass-dark p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Join Industry Leaders</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Connect with over 5,000 professionals at our flagship event.
            Featuring keynote speakers, hands-on workshops, and networking opportunities.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-1" />
              <div>
                <div className="font-semibold">When</div>
                <div className="text-sm text-gray-600">December 15-16, 2025</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-1" />
              <div>
                <div className="font-semibold">Time</div>
                <div className="text-sm text-gray-600">10:00 AM - 6:00 PM PST</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary mt-1" />
              <div>
                <div className="font-semibold">Speakers</div>
                <div className="text-sm text-gray-600">20+ industry experts</div>
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full" style={{ backgroundColor: ctaColor }}>
            Register Now - Free
          </Button>
        </div>

        {/* Agenda Preview */}
        <div>
          <h3 className="text-xl font-bold mb-4">Event Highlights</h3>
          <div className="space-y-3">
            {[
              { time: "10:00 AM", title: "Keynote: Future of AI", speaker: "Jane Smith, CEO" },
              { time: "11:30 AM", title: "Workshop: Building at Scale", speaker: "John Doe, CTO" },
              { time: "2:00 PM", title: "Panel: Innovation Trends", speaker: "Multiple Speakers" }
            ].map((session, i) => (
              <div key={i} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="text-sm font-semibold text-primary">{session.time}</div>
                <div className="flex-1">
                  <div className="font-semibold">{session.title}</div>
                  <div className="text-sm text-gray-600">{session.speaker}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderPreview = () => {
    if (selectedTemplate.category === "Promotion") {
      return renderPromotionalPreview()
    } else if (selectedTemplate.category === "Events") {
      return renderEventPreview()
    }
    return renderNewsletterPreview()
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
          <div className="flex items-center gap-3 mb-4">
            <div className="glass p-3 rounded-xl">
              <Megaphone className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Marketing Email Templates
              </h1>
              <p className="text-muted-foreground mt-1">
                Newsletters, promotions, and engagement campaigns
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            {[
              { label: "Templates", value: "8", icon: Layout },
              { label: "Avg. Open Rate", value: "32%", icon: Eye },
              { label: "Click Rate", value: "4.2%", icon: Target },
              { label: "Spam Score", value: `${spamScore}%`, icon: CheckCircle },
              { label: "Mobile Ready", value: "100%", icon: Smartphone }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass p-4">
                  <div className="flex items-center gap-3">
                    <stat.icon className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Template Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <Card className="glass p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Templates
              </h3>

              <ScrollArea className="h-[700px]">
                <div className="space-y-2">
                  {marketingTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedTemplate.id === template.id
                          ? "bg-primary/20 border-primary/50"
                          : "hover:bg-muted/50"
                      } border`}
                    >
                      <div className="flex items-start gap-3">
                        <template.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm mb-1">{template.name}</div>
                          <Badge variant="secondary" className="text-xs mb-1">
                            {template.category}
                          </Badge>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {template.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </motion.div>

          {/* Main Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-6"
          >
            <Card className="glass p-6">
              <Tabs defaultValue="design" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="design">
                    <Palette className="h-4 w-4 mr-2" />
                    Design
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="test">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Test
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="design" className="space-y-4">
                  {/* Subject Line */}
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Type className="h-4 w-4" />
                      Subject Line
                    </Label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter subject line..."
                      className="font-medium"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {subject.length} characters • Aim for 30-50
                    </p>
                  </div>

                  {/* Preheader */}
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4" />
                      Preheader Text
                    </Label>
                    <Input
                      value={preheader}
                      onChange={(e) => setPreheader(e.target.value)}
                      placeholder="Preview text..."
                    />
                  </div>

                  <Separator />

                  {/* Hero Image */}
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <ImageIcon className="h-4 w-4" />
                      Hero Image URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={heroImage}
                        onChange={(e) => setHeroImage(e.target.value)}
                        placeholder="https://..."
                        className="flex-1"
                      />
                      <Button variant="outline">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* CTA Settings */}
                  <div className="glass-dark p-4 rounded-lg space-y-4">
                    <Label className="text-sm font-semibold">Call-to-Action</Label>

                    <div>
                      <Label className="text-xs mb-1 block">Button Text</Label>
                      <Input
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="text-xs mb-1 block">Button URL</Label>
                      <Input
                        value={ctaUrl}
                        onChange={(e) => setCtaUrl(e.target.value)}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <Label className="text-xs mb-1 block">Button Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={ctaColor}
                          onChange={(e) => setCtaColor(e.target.value)}
                          className="w-16 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={ctaColor}
                          onChange={(e) => setCtaColor(e.target.value)}
                          className="flex-1 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* A/B Testing */}
                  <div className="glass-dark p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        A/B Test Subject Line
                      </Label>
                      <Switch
                        checked={enableABTest}
                        onCheckedChange={setEnableABTest}
                      />
                    </div>

                    {enableABTest && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <Label className="text-xs mb-1 block">Variant B Subject</Label>
                        <Input
                          value={variantSubject}
                          onChange={(e) => setVariantSubject(e.target.value)}
                          placeholder="Alternative subject line..."
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          50% of recipients will receive each variant
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Personalization */}
                  <div className="glass-dark p-4 rounded-lg">
                    <Label className="text-sm font-semibold mb-3 block">Personalization Tokens</Label>
                    <div className="flex flex-wrap gap-2">
                      {["firstName", "lastName", "company", "location"].map((token) => (
                        <Button
                          key={token}
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSubject(subject + ` {{${token}}}`)
                          }}
                        >
                          {token}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export HTML
                    </Button>
                    <Button variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Send Test
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  {/* Preview Controls */}
                  <div className="flex items-center justify-between mb-4">
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
                  </div>

                  {/* Email Preview */}
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
                    <ScrollArea className="h-[600px]">
                      <div
                        className={`mx-auto bg-white text-gray-900 rounded-lg overflow-hidden ${
                          previewDevice === "mobile" ? "max-w-[375px]" : "max-w-[600px]"
                        }`}
                      >
                        <div className="p-8">
                          {renderPreview()}

                          {/* Unsubscribe Footer */}
                          <Separator className="my-8" />
                          <div className="text-center text-xs text-gray-500">
                            <p className="mb-2">You're receiving this because you subscribed to our newsletter</p>
                            <p>
                              <a href="#" className="text-gray-500 hover:underline">
                                Unsubscribe
                              </a>
                              {" | "}
                              <a href="#" className="text-gray-500 hover:underline">
                                Update Preferences
                              </a>
                              {" | "}
                              <a href="#" className="text-gray-500 hover:underline">
                                View in Browser
                              </a>
                            </p>
                            <p className="mt-3">Acme Inc, 123 Business St, San Francisco, CA 94102</p>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="test" className="space-y-4">
                  {/* Spam Score */}
                  <Card className="glass-dark p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Spam Score Check
                      </h3>
                      <Badge variant={spamScore >= 80 ? "default" : "destructive"}>
                        {spamScore}%
                      </Badge>
                    </div>

                    <Progress value={spamScore} className="mb-4" />

                    <div className="space-y-2">
                      {spamChecks.map((check) => {
                        const passed = check.check(subject + " unsubscribe")
                        return (
                          <div key={check.id} className="flex items-center gap-2 text-sm">
                            {passed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className={passed ? "text-muted-foreground" : ""}>
                              {check.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </Card>

                  {/* Email Client Compatibility */}
                  <Card className="glass-dark p-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Email Client Compatibility
                    </h3>
                    <div className="space-y-3">
                      {emailClients.map((client) => (
                        <div key={client.name}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <client.icon className="h-4 w-4" />
                              <span className="text-sm">{client.name}</span>
                            </div>
                            <span className="text-sm font-semibold">{client.compatibility}%</span>
                          </div>
                          <Progress value={client.compatibility} />
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Preview Text Analysis */}
                  <Card className="glass-dark p-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Subject Line Analysis
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Character count:</span>
                        <span className={subject.length > 50 ? "text-yellow-500" : "text-green-500"}>
                          {subject.length}/50
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Word count:</span>
                        <span>{subject.split(" ").length} words</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Emojis:</span>
                        <span>{(subject.match(/[\u{1F600}-\u{1F64F}]/gu) || []).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Personalization:</span>
                        <span>{subject.includes("{{") ? "✓ Yes" : "✗ No"}</span>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Settings Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="space-y-4">
              {/* Template Info */}
              <Card className="glass p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Template Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Template</Label>
                    <p className="font-medium">{selectedTemplate.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Category</Label>
                    <p className="text-sm">{selectedTemplate.category}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Layout</Label>
                    <p className="text-sm capitalize">{selectedTemplate.layout.replace(/-/g, " ")}</p>
                  </div>
                </div>
              </Card>

              {/* Campaign Settings */}
              <Card className="glass p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Campaign Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-2 block">From Name</Label>
                    <Input defaultValue="Acme Inc" className="text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs mb-2 block">From Email</Label>
                    <Input defaultValue="newsletter@acme.com" className="text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs mb-2 block">Reply-To</Label>
                    <Input defaultValue="support@acme.com" className="text-sm" />
                  </div>
                </div>
              </Card>

              {/* Best Practices */}
              <Card className="glass p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Marketing Tips
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Send at optimal times (Tue-Thu, 10 AM)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Use compelling preheader text</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Keep one clear CTA per email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Optimize for mobile first</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Segment your audience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Test before sending</span>
                  </li>
                </ul>
              </Card>

              {/* Deliverability */}
              <Card className="glass p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Deliverability
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>SPF Record</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>DKIM Signature</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>DMARC Policy</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>List Hygiene</span>
                    <Badge>Excellent</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

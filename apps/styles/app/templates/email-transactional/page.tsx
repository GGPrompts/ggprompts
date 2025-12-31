"use client"

import * as React from "react"
import {
  Mail,
  Send,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  Eye,
  Code,
  Smartphone,
  Monitor,
  Settings,
  Plus,
  Edit,
  Trash,
  Image as ImageIcon,
  Type,
  Palette,
  Zap,
  Lock,
  CreditCard,
  Package,
  ShoppingCart,
  RefreshCw,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button, Input, Badge, Card, Tabs, TabsContent, TabsList, TabsTrigger, Label, Textarea, Switch, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, ScrollArea } from "@ggprompts/ui"

// Email template types
const emailTemplates = [
  {
    id: "welcome",
    name: "Welcome Email",
    icon: Mail,
    category: "Onboarding",
    subject: "Welcome to {{companyName}}! Let's get started",
    preheader: "Your account is ready. Here's what to do next.",
    description: "Sent when a user creates an account"
  },
  {
    id: "order-confirmation",
    name: "Order Confirmation",
    icon: CheckCircle,
    category: "Commerce",
    subject: "Order #{{orderNumber}} confirmed - Thank you!",
    preheader: "Your order has been received and is being processed.",
    description: "Sent after successful order placement"
  },
  {
    id: "shipping",
    name: "Shipping Notification",
    icon: Package,
    category: "Commerce",
    subject: "Your order #{{orderNumber}} has shipped!",
    preheader: "Track your package: {{trackingNumber}}",
    description: "Sent when order ships"
  },
  {
    id: "password-reset",
    name: "Password Reset",
    icon: Lock,
    category: "Security",
    subject: "Reset your {{companyName}} password",
    preheader: "Click the link below to reset your password.",
    description: "Sent when user requests password reset"
  },
  {
    id: "verification",
    name: "Account Verification",
    icon: CheckCircle,
    category: "Security",
    subject: "Verify your email address",
    preheader: "Please confirm your email to activate your account.",
    description: "Sent after registration"
  },
  {
    id: "invoice",
    name: "Invoice/Receipt",
    icon: CreditCard,
    category: "Commerce",
    subject: "Invoice #{{invoiceNumber}} from {{companyName}}",
    preheader: "Your receipt for {{amount}} is ready.",
    description: "Sent after payment"
  },
  {
    id: "refund",
    name: "Refund Confirmation",
    icon: RefreshCw,
    category: "Commerce",
    subject: "Refund processed for order #{{orderNumber}}",
    preheader: "{{amount}} has been refunded to your account.",
    description: "Sent when refund is processed"
  },
  {
    id: "subscription-renewal",
    name: "Subscription Renewal",
    icon: Calendar,
    category: "Billing",
    subject: "Your {{planName}} subscription renews soon",
    preheader: "Renewal date: {{renewalDate}}",
    description: "Sent before subscription renewal"
  },
  {
    id: "trial-expiring",
    name: "Trial Expiring",
    icon: Clock,
    category: "Billing",
    subject: "Your trial expires in {{daysLeft}} days",
    preheader: "Upgrade now to continue using {{companyName}}.",
    description: "Sent before trial ends"
  },
  {
    id: "account-deletion",
    name: "Account Deletion",
    icon: XCircle,
    category: "Security",
    subject: "Your account will be deleted in {{daysLeft}} days",
    preheader: "Cancel this request if you want to keep your account.",
    description: "Sent after deletion request"
  }
]

// Email templates content
const emailContent: Record<string, string> = {
  welcome: `
    <h1 style="color: #10b981; margin-bottom: 24px;">Welcome to Acme Inc!</h1>
    <p style="margin-bottom: 16px;">Hi {{name}},</p>
    <p style="margin-bottom: 16px;">Thank you for signing up! We're excited to have you on board.</p>
    <p style="margin-bottom: 24px;">Here's what you can do next:</p>
    <ul style="margin-bottom: 24px;">
      <li style="margin-bottom: 8px;">Complete your profile</li>
      <li style="margin-bottom: 8px;">Invite your team members</li>
      <li style="margin-bottom: 8px;">Explore our features</li>
    </ul>
    <a href="{{dashboardUrl}}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-bottom: 24px;">Get Started</a>
    <p style="color: #64748b; font-size: 14px;">Need help? Check out our <a href="{{helpUrl}}" style="color: #10b981;">Help Center</a> or reply to this email.</p>
  `,
  "order-confirmation": `
    <h1 style="color: #10b981; margin-bottom: 24px;">Order Confirmed!</h1>
    <p style="margin-bottom: 16px;">Hi {{name}},</p>
    <p style="margin-bottom: 24px;">Thank you for your order! We've received your order #{{orderNumber}} and it's being processed.</p>
    <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <h2 style="margin-bottom: 16px;">Order Summary</h2>
      <div style="margin-bottom: 12px;">
        <strong>Order Number:</strong> {{orderNumber}}<br/>
        <strong>Order Date:</strong> {{orderDate}}<br/>
        <strong>Total:</strong> {{total}}
      </div>
    </div>
    <a href="{{orderUrl}}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-bottom: 24px;">View Order Details</a>
    <p style="color: #64748b; font-size: 14px;">Questions? Contact our support team at support@acme.com</p>
  `,
  shipping: `
    <h1 style="color: #10b981; margin-bottom: 24px;">Your Order Has Shipped!</h1>
    <p style="margin-bottom: 16px;">Hi {{name}},</p>
    <p style="margin-bottom: 24px;">Great news! Your order #{{orderNumber}} has been shipped and is on its way.</p>
    <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <h2 style="margin-bottom: 16px;">Shipping Details</h2>
      <div style="margin-bottom: 12px;">
        <strong>Tracking Number:</strong> {{trackingNumber}}<br/>
        <strong>Carrier:</strong> {{carrier}}<br/>
        <strong>Estimated Delivery:</strong> {{estimatedDelivery}}
      </div>
    </div>
    <a href="{{trackingUrl}}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-bottom: 24px;">Track Your Package</a>
  `,
  "password-reset": `
    <h1 style="color: #10b981; margin-bottom: 24px;">Reset Your Password</h1>
    <p style="margin-bottom: 16px;">Hi {{name}},</p>
    <p style="margin-bottom: 16px;">We received a request to reset your password for your Acme Inc account.</p>
    <p style="margin-bottom: 24px;">Click the button below to reset your password. This link will expire in 1 hour.</p>
    <a href="{{resetUrl}}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-bottom: 24px;">Reset Password</a>
    <p style="color: #64748b; font-size: 14px; margin-bottom: 16px;">If you didn't request this, please ignore this email or contact support if you have concerns.</p>
    <p style="color: #64748b; font-size: 12px;">Security tip: Never share your password with anyone.</p>
  `,
  verification: `
    <h1 style="color: #10b981; margin-bottom: 24px;">Verify Your Email Address</h1>
    <p style="margin-bottom: 16px;">Hi {{name}},</p>
    <p style="margin-bottom: 16px;">Thanks for signing up! Please verify your email address to activate your account.</p>
    <p style="margin-bottom: 24px;">Click the button below to confirm your email:</p>
    <a href="{{verificationUrl}}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-bottom: 24px;">Verify Email Address</a>
    <p style="color: #64748b; font-size: 14px;">This link will expire in 24 hours. If you didn't create an account, please ignore this email.</p>
  `,
  invoice: `
    <h1 style="color: #10b981; margin-bottom: 24px;">Invoice #{{invoiceNumber}}</h1>
    <p style="margin-bottom: 24px;">Hi {{name}},</p>
    <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <h2 style="margin-bottom: 16px;">Invoice Details</h2>
      <div style="margin-bottom: 12px;">
        <strong>Invoice Number:</strong> {{invoiceNumber}}<br/>
        <strong>Date:</strong> {{invoiceDate}}<br/>
        <strong>Amount:</strong> {{amount}}<br/>
        <strong>Status:</strong> <span style="color: #10b981;">Paid</span>
      </div>
    </div>
    <a href="{{invoiceUrl}}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-bottom: 24px;">Download Invoice</a>
    <p style="color: #64748b; font-size: 14px;">Thank you for your business!</p>
  `,
  refund: `
    <h1 style="color: #10b981; margin-bottom: 24px;">Refund Processed</h1>
    <p style="margin-bottom: 16px;">Hi {{name}},</p>
    <p style="margin-bottom: 24px;">Your refund for order #{{orderNumber}} has been processed.</p>
    <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <h2 style="margin-bottom: 16px;">Refund Details</h2>
      <div style="margin-bottom: 12px;">
        <strong>Order Number:</strong> {{orderNumber}}<br/>
        <strong>Refund Amount:</strong> {{amount}}<br/>
        <strong>Method:</strong> {{paymentMethod}}<br/>
        <strong>Processing Time:</strong> 5-10 business days
      </div>
    </div>
    <p style="color: #64748b; font-size: 14px;">The refund will appear on your statement as "ACME REFUND".</p>
  `,
  "subscription-renewal": `
    <h1 style="color: #10b981; margin-bottom: 24px;">Subscription Renewal Notice</h1>
    <p style="margin-bottom: 16px;">Hi {{name}},</p>
    <p style="margin-bottom: 24px;">Your {{planName}} subscription will automatically renew on {{renewalDate}}.</p>
    <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <h2 style="margin-bottom: 16px;">Renewal Details</h2>
      <div style="margin-bottom: 12px;">
        <strong>Plan:</strong> {{planName}}<br/>
        <strong>Amount:</strong> {{amount}}<br/>
        <strong>Renewal Date:</strong> {{renewalDate}}<br/>
        <strong>Payment Method:</strong> {{paymentMethod}}
      </div>
    </div>
    <a href="{{billingUrl}}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-bottom: 24px;">Manage Subscription</a>
  `,
  "trial-expiring": `
    <h1 style="color: #10b981; margin-bottom: 24px;">Your Trial Expires Soon</h1>
    <p style="margin-bottom: 16px;">Hi {{name}},</p>
    <p style="margin-bottom: 16px;">Your free trial ends in {{daysLeft}} days on {{expiryDate}}.</p>
    <p style="margin-bottom: 24px;">Upgrade now to continue using all features without interruption.</p>
    <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <h2 style="margin-bottom: 16px;">What You'll Keep</h2>
      <ul>
        <li>Unlimited projects</li>
        <li>Advanced analytics</li>
        <li>Priority support</li>
        <li>Custom integrations</li>
      </ul>
    </div>
    <a href="{{upgradeUrl}}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-bottom: 24px;">Upgrade Now</a>
  `,
  "account-deletion": `
    <h1 style="color: #ef4444; margin-bottom: 24px;">Account Deletion Scheduled</h1>
    <p style="margin-bottom: 16px;">Hi {{name}},</p>
    <p style="margin-bottom: 16px;">We received a request to delete your account.</p>
    <p style="margin-bottom: 24px;">Your account and all associated data will be permanently deleted in {{daysLeft}} days on {{deletionDate}}.</p>
    <div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #ef4444;">
      <strong>This action cannot be undone.</strong><br/>
      All your data, projects, and settings will be permanently deleted.
    </div>
    <a href="{{cancelUrl}}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-bottom: 24px;">Cancel Deletion</a>
    <p style="color: #64748b; font-size: 14px;">If you didn't request this, please contact support immediately.</p>
  `
}

export default function EmailTransactionalPage() {
  const [selectedTemplate, setSelectedTemplate] = React.useState(emailTemplates[0])
  const [subject, setSubject] = React.useState(selectedTemplate.subject)
  const [preheader, setPreheader] = React.useState(selectedTemplate.preheader)
  const [emailBody, setEmailBody] = React.useState(emailContent[selectedTemplate.id])
  const [viewMode, setViewMode] = React.useState<"html" | "text">("html")
  const [previewDevice, setPreviewDevice] = React.useState<"desktop" | "mobile">("desktop")
  const [showVariables, setShowVariables] = React.useState(false)
  const [copiedCode, setCopiedCode] = React.useState(false)
  const [customVariables, setCustomVariables] = React.useState({
    name: "John Doe",
    companyName: "Acme Inc",
    orderNumber: "ORD-2024-1234",
    orderDate: "Nov 22, 2025",
    total: "$149.99",
    trackingNumber: "1Z999AA1234567890",
    carrier: "UPS",
    estimatedDelivery: "Nov 25, 2025",
    amount: "$149.99",
    invoiceNumber: "INV-2024-5678",
    invoiceDate: "Nov 22, 2025",
    planName: "Pro Plan",
    renewalDate: "Dec 22, 2025",
    paymentMethod: "Visa ****1234",
    daysLeft: "3",
    expiryDate: "Nov 25, 2025",
    deletionDate: "Nov 29, 2025",
    dashboardUrl: "#",
    helpUrl: "#",
    orderUrl: "#",
    trackingUrl: "#",
    resetUrl: "#",
    verificationUrl: "#",
    invoiceUrl: "#",
    billingUrl: "#",
    upgradeUrl: "#",
    cancelUrl: "#"
  })

  const [brandColors, setBrandColors] = React.useState({
    primary: "#10b981",
    background: "#ffffff",
    text: "#1f2937"
  })

  React.useEffect(() => {
    setSubject(selectedTemplate.subject)
    setPreheader(selectedTemplate.preheader)
    setEmailBody(emailContent[selectedTemplate.id])
  }, [selectedTemplate])

  const renderEmailPreview = () => {
    let processedBody = emailBody
    Object.entries(customVariables).forEach(([key, value]) => {
      processedBody = processedBody.replace(new RegExp(`{{${key}}}`, "g"), value)
    })

    if (viewMode === "text") {
      const textVersion = processedBody
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim()
      return <pre className="whitespace-pre-wrap font-mono text-sm">{textVersion}</pre>
    }

    return (
      <div
        className="email-preview"
        dangerouslySetInnerHTML={{ __html: processedBody }}
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: brandColors.text,
          lineHeight: "1.6"
        }}
      />
    )
  }

  const exportHTML = () => {
    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, sans-serif;
      background-color: #f3f4f6;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: ${brandColors.background};
      padding: 32px;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        padding: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    ${emailBody}
    <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
      This email was sent to {{email}}.<br>
      <a href="{{unsubscribeUrl}}" style="color: #9ca3af;">Unsubscribe</a> |
      <a href="{{preferencesUrl}}" style="color: #9ca3af;">Email Preferences</a>
    </p>
    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
      Acme Inc, 123 Business St, San Francisco, CA 94102
    </p>
  </div>
</body>
</html>
    `.trim()

    navigator.clipboard.writeText(fullHTML)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const insertVariable = (variable: string) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value
      const before = text.substring(0, start)
      const after = text.substring(end)
      setEmailBody(before + `{{${variable}}}` + after)
    }
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
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Transactional Email Templates
              </h1>
              <p className="text-muted-foreground mt-1">
                Professional email templates for key user interactions
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Templates", value: "10", icon: Mail },
              { label: "Avg. Open Rate", value: "45%", icon: Eye },
              { label: "Variables", value: "20+", icon: Settings },
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
          {/* Template Selector Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <Card className="glass p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Templates
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search templates..." className="pl-9" />
                </div>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {emailTemplates.map((template) => (
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

          {/* Main Editor Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-6"
          >
            <Card className="glass p-6">
              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="editor">
                    <Edit className="h-4 w-4 mr-2" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="space-y-4">
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
                      {subject.length} characters (recommended: 30-50)
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
                      placeholder="Enter preheader text..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Preview text shown after subject in inbox
                    </p>
                  </div>

                  <Separator />

                  {/* Email Body */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Email Body (HTML)
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowVariables(!showVariables)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Variables
                      </Button>
                    </div>

                    {showVariables && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="glass p-3 rounded-lg mb-3"
                      >
                        <p className="text-xs font-medium mb-2">Click to insert:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.keys(customVariables).map((variable) => (
                            <Button
                              key={variable}
                              variant="secondary"
                              size="sm"
                              onClick={() => insertVariable(variable)}
                              className="text-xs h-6"
                            >
                              {variable}
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <Textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="font-mono text-sm min-h-[400px]"
                      placeholder="Enter email HTML..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button onClick={exportHTML} className="flex-1">
                      {copiedCode ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Export HTML
                        </>
                      )}
                    </Button>
                    <Button variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Send Test
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
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === "html" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("html")}
                      >
                        HTML
                      </Button>
                      <Button
                        variant={viewMode === "text" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("text")}
                      >
                        Text
                      </Button>
                    </div>
                  </div>

                  {/* Email Preview */}
                  <div className="glass-dark p-4 rounded-lg">
                    {/* Email Header */}
                    <div className="border-b border-border pb-3 mb-4">
                      <div className="text-xs text-muted-foreground mb-1">Subject:</div>
                      <div className="font-semibold">
                        {subject.replace(/{{(\w+)}}/g, (_, key) => customVariables[key as keyof typeof customVariables] || `{{${key}}}`)}
                      </div>
                      {preheader && (
                        <>
                          <div className="text-xs text-muted-foreground mt-2 mb-1">Preheader:</div>
                          <div className="text-sm text-muted-foreground">
                            {preheader.replace(/{{(\w+)}}/g, (_, key) => customVariables[key as keyof typeof customVariables] || `{{${key}}}`)}
                          </div>
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
                        {renderEmailPreview()}

                        {/* Unsubscribe Footer */}
                        <Separator className="my-6" />
                        <div className="text-center text-xs text-gray-500">
                          <p className="mb-2">This email was sent to john@example.com</p>
                          <p>
                            <a href="#" className="text-gray-500 hover:underline">
                              Unsubscribe
                            </a>
                            {" | "}
                            <a href="#" className="text-gray-500 hover:underline">
                              Email Preferences
                            </a>
                          </p>
                          <p className="mt-2">Acme Inc, 123 Business St, San Francisco, CA 94102</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                    <Label className="text-xs text-muted-foreground">Use Case</Label>
                    <p className="text-sm">{selectedTemplate.description}</p>
                  </div>
                </div>
              </Card>

              {/* Brand Customization */}
              <Card className="glass p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Brand Colors
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1 block">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={brandColors.primary}
                        onChange={(e) =>
                          setBrandColors({ ...brandColors, primary: e.target.value })
                        }
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={brandColors.primary}
                        onChange={(e) =>
                          setBrandColors({ ...brandColors, primary: e.target.value })
                        }
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Logo URL</Label>
                    <Input placeholder="https://..." className="text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Company Name</Label>
                    <Input
                      value={customVariables.companyName}
                      onChange={(e) =>
                        setCustomVariables({
                          ...customVariables,
                          companyName: e.target.value
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
              </Card>

              {/* Test Variables */}
              <Card className="glass p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Test Variables
                </h3>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3 pr-4">
                    {Object.entries(customVariables).slice(0, 10).map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-xs mb-1 block capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                        <Input
                          value={value}
                          onChange={(e) =>
                            setCustomVariables({
                              ...customVariables,
                              [key]: e.target.value
                            })
                          }
                          className="text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>

              {/* Best Practices */}
              <Card className="glass p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Best Practices
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Keep subject lines under 50 characters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Always include preheader text</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Test on mobile devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Include unsubscribe link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Use inline CSS for compatibility</span>
                  </li>
                </ul>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

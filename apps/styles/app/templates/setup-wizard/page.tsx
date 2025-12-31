"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/ThemeProvider"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  User,
  Users,
  Bell,
  Zap,
  Save,
  X,
  Upload,
  Mail,
  Smartphone,
  Clock,
  Globe,
  Shield,
  Key,
  Palette,
  Settings,
  CheckCircle2,
  Circle,
  Loader2,
  PartyPopper,
  Rocket,
  Star,
  Award,
  Building,
  Briefcase,
  MapPin,
  Phone,
  Link2,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  MessageSquare,
  Video,
  FileText,
  Database,
  Cloud,
  Webhook,
  Code,
  Terminal,
  Monitor,
  Laptop,
  Tablet,
  AlertCircle,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Switch, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, RadioGroup, RadioGroupItem, Checkbox, Badge, Progress, Separator } from "@ggprompts/ui"

const wizardSteps = [
  {
    id: "welcome",
    title: "Welcome!",
    description: "Let's set up your account in just a few steps",
    icon: Sparkles,
  },
  {
    id: "account",
    title: "Account Preferences",
    description: "Tell us about yourself",
    icon: User,
  },
  {
    id: "team",
    title: "Team Setup",
    description: "Invite your team members",
    icon: Users,
  },
  {
    id: "integrations",
    title: "Connect Integrations",
    description: "Connect your favorite tools",
    icon: Zap,
  },
  {
    id: "notifications",
    title: "Notification Preferences",
    description: "Choose how you want to stay updated",
    icon: Bell,
  },
  {
    id: "review",
    title: "Review & Confirm",
    description: "Check your settings before completing",
    icon: CheckCircle2,
  },
  {
    id: "complete",
    title: "All Set!",
    description: "Your account is ready to go",
    icon: Award,
  },
]

const integrations = [
  { id: "slack", name: "Slack", icon: MessageSquare, color: "text-purple-500" },
  { id: "github", name: "GitHub", icon: Github, color: "text-foreground" },
  { id: "zoom", name: "Zoom", icon: Video, color: "text-blue-500" },
  { id: "notion", name: "Notion", icon: FileText, color: "text-foreground" },
  { id: "aws", name: "AWS", icon: Cloud, color: "text-orange-500" },
  { id: "stripe", name: "Stripe", icon: Database, color: "text-purple-500" },
  { id: "webhooks", name: "Webhooks", icon: Webhook, color: "text-primary" },
  { id: "api", name: "REST API", icon: Code, color: "text-primary" },
]

export default function SetupWizardTemplate() {
  const { theme } = useTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    role: "",
    timezone: "",
    language: "en",
    teamMembers: [{ email: "", role: "member" }],
    selectedIntegrations: [] as string[],
    notifications: {
      email: true,
      push: false,
      sms: false,
      weekly: true,
      mentions: true,
      updates: false,
    },
  })

  const step = wizardSteps[currentStep]
  const progress = ((currentStep + 1) / wizardSteps.length) * 100
  const canProceed = validateStep(currentStep, formData)

  function validateStep(stepIndex: number, data: typeof formData) {
    switch (stepIndex) {
      case 1: // Account
        return data.fullName && data.email && data.company
      case 2: // Team
        return true // Optional step
      case 3: // Integrations
        return true // Optional step
      case 4: // Notifications
        return true // Optional step
      default:
        return true
    }
  }

  const handleNext = async () => {
    if (currentStep === wizardSteps.length - 2) {
      // Last step before complete - simulate save
      setIsSaving(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSaving(false)
    }

    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }

    if (currentStep === wizardSteps.length - 2) {
      setShowSuccess(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveAndExit = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert("Progress saved! You can continue setup later.")
  }

  const addTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { email: "", role: "member" }],
    })
  }

  const removeTeamMember = (index: number) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter((_, i) => i !== index),
    })
  }

  const toggleIntegration = (id: string) => {
    setFormData({
      ...formData,
      selectedIntegrations: formData.selectedIntegrations.includes(id)
        ? formData.selectedIntegrations.filter((i) => i !== id)
        : [...formData.selectedIntegrations, id],
    })
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="inline-flex items-center justify-center p-4 rounded-full glass border-glow mb-4"
          >
            <step.icon className="h-8 w-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold terminal-glow mb-2 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{step.title}</h1>
          <p className="text-muted-foreground">{step.description}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep + 1} of {wizardSteps.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 mb-4" />

          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {wizardSteps.map((s, index) => (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <motion.button
                  onClick={() => index <= currentStep && setCurrentStep(index)}
                  disabled={index > currentStep}
                  className={`relative h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all ${
                    index < currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : index === currentStep
                      ? "border-primary bg-background"
                      : "border-muted bg-background"
                  }`}
                  whileHover={index <= currentStep ? { scale: 1.1 } : {}}
                  whileTap={index <= currentStep ? { scale: 0.95 } : {}}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <s.icon className={`h-5 w-5 ${index === currentStep ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                </motion.button>
                <span className="text-xs text-center max-w-[80px] hidden md:block">
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <Card className="glass-overlay border-glow mb-6">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && <WelcomeStep />}
                {currentStep === 1 && <AccountStep formData={formData} setFormData={setFormData} />}
                {currentStep === 2 && (
                  <TeamStep
                    formData={formData}
                    setFormData={setFormData}
                    addTeamMember={addTeamMember}
                    removeTeamMember={removeTeamMember}
                  />
                )}
                {currentStep === 3 && (
                  <IntegrationsStep
                    selectedIntegrations={formData.selectedIntegrations}
                    toggleIntegration={toggleIntegration}
                  />
                )}
                {currentStep === 4 && <NotificationsStep formData={formData} setFormData={setFormData} />}
                {currentStep === 5 && <ReviewStep formData={formData} />}
                {currentStep === 6 && <CompleteStep />}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handleSaveAndExit}
            variant="outline"
            disabled={currentStep === 0 || currentStep === wizardSteps.length - 1 || isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save & Exit
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentStep === 0 || currentStep === wizardSteps.length - 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed || (currentStep === wizardSteps.length - 1)}
              className="gap-2 bg-primary hover:bg-primary/90 min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : currentStep === wizardSteps.length - 2 ? (
                <>
                  Complete
                  <Check className="h-4 w-4" />
                </>
              ) : currentStep === wizardSteps.length - 1 ? (
                "Done"
              ) : (
                <>
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Success animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-lg pointer-events-none"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 2,
                }}
              >
                <PartyPopper className="h-32 w-32 text-primary" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Step components
function WelcomeStep() {
  return (
    <div className="text-center space-y-6 py-8">
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Rocket className="h-20 w-20 text-primary mx-auto mb-6" />
      </motion.div>
      <h2 className="text-2xl font-bold terminal-glow">Welcome to Your New Workspace!</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        We'll guide you through a quick setup process to get your account configured perfectly.
        This will only take a few minutes.
      </p>
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
        {[
          { icon: User, label: "Personalize", desc: "Your profile" },
          { icon: Users, label: "Collaborate", desc: "Invite team" },
          { icon: Zap, label: "Integrate", desc: "Connect tools" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-lg glass border border-primary/20"
          >
            <item.icon className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-sm">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AccountStep({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">
            Company <span className="text-destructive">*</span>
          </Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Acme Inc."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="founder">Founder</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="est">Eastern Time (EST)</SelectItem>
              <SelectItem value="pst">Pacific Time (PST)</SelectItem>
              <SelectItem value="cst">Central Time (CST)</SelectItem>
              <SelectItem value="gmt">GMT</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 rounded-lg glass border border-primary/20 flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium mb-1">Your data is secure</p>
          <p className="text-muted-foreground">
            All information is encrypted and never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  )
}

function TeamStep({ formData, setFormData, addTeamMember, removeTeamMember }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Invite Team Members</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add your team members now or skip and invite them later.
        </p>
      </div>

      <div className="space-y-4">
        {formData.teamMembers.map((member: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 items-end"
          >
            <div className="flex-1 space-y-2">
              <Label htmlFor={`email-${index}`}>Email</Label>
              <Input
                id={`email-${index}`}
                type="email"
                value={member.email}
                onChange={(e) => {
                  const newMembers = [...formData.teamMembers]
                  newMembers[index].email = e.target.value
                  setFormData({ ...formData, teamMembers: newMembers })
                }}
                placeholder="teammate@example.com"
              />
            </div>
            <div className="w-40 space-y-2">
              <Label htmlFor={`role-${index}`}>Role</Label>
              <Select
                value={member.role}
                onValueChange={(value) => {
                  const newMembers = [...formData.teamMembers]
                  newMembers[index].role = value
                  setFormData({ ...formData, teamMembers: newMembers })
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.teamMembers.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeTeamMember(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      <Button type="button" variant="outline" onClick={addTeamMember} className="w-full gap-2">
        <Users className="h-4 w-4" />
        Add Another Team Member
      </Button>

      <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
        <div className="flex items-start gap-2">
          <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium mb-1">Team collaboration features</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Shared workspaces and projects</li>
              <li>• Real-time collaboration</li>
              <li>• Role-based access control</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function IntegrationsStep({ selectedIntegrations, toggleIntegration }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Connect Your Tools</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select the integrations you'd like to enable. You can add more later.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {integrations.map((integration) => {
          const isSelected = selectedIntegrations.includes(integration.id)
          return (
            <motion.button
              key={integration.id}
              onClick={() => toggleIntegration(integration.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border glass hover:border-primary/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <integration.icon className={`h-8 w-8 mx-auto mb-2 ${integration.color}`} />
              <p className="text-sm font-medium">{integration.name}</p>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      <Separator />

      <div className="p-4 rounded-lg glass border border-primary/20">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium mb-1">Enterprise integrations</p>
            <p className="text-muted-foreground mb-2">
              Need custom integrations? Our Enterprise plan includes:
            </p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Custom API integrations</li>
              <li>• Dedicated support</li>
              <li>• SSO & advanced security</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationsStep({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose how and when you want to receive notifications.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-4">Notification Channels</h4>
          <div className="space-y-4">
            {[
              { key: "email", label: "Email notifications", icon: Mail, desc: "Receive updates via email" },
              { key: "push", label: "Push notifications", icon: Bell, desc: "Browser push notifications" },
              { key: "sms", label: "SMS notifications", icon: Smartphone, desc: "Text message alerts" },
            ].map((channel) => (
              <div key={channel.key} className="flex items-center justify-between p-4 rounded-lg glass">
                <div className="flex items-center gap-3">
                  <channel.icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{channel.label}</p>
                    <p className="text-sm text-muted-foreground">{channel.desc}</p>
                  </div>
                </div>
                <Switch
                  checked={formData.notifications[channel.key]}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      notifications: { ...formData.notifications, [channel.key]: checked },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium mb-4">What to Notify</h4>
          <div className="space-y-3">
            {[
              { key: "mentions", label: "Mentions and replies", desc: "When someone mentions you" },
              { key: "updates", label: "Product updates", desc: "New features and improvements" },
              { key: "weekly", label: "Weekly summary", desc: "Your activity summary" },
            ].map((option) => (
              <div key={option.key} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div>
                  <p className="font-medium text-sm">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.desc}</p>
                </div>
                <Switch
                  checked={formData.notifications[option.key]}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      notifications: { ...formData.notifications, [option.key]: checked },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewStep({ formData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Review Your Settings</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please review your settings before completing the setup.
        </p>
      </div>

      <div className="space-y-4">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{formData.fullName || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{formData.email || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Company:</span>
              <span className="font-medium">{formData.company || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium">{formData.role || "Not set"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              {formData.teamMembers.filter((m: any) => m.email).length} team member(s) invited
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              {formData.selectedIntegrations.length} integration(s) selected
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{formData.notifications.email ? "Enabled" : "Disabled"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Push:</span>
              <span>{formData.notifications.push ? "Enabled" : "Disabled"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SMS:</span>
              <span>{formData.notifications.sms ? "Enabled" : "Disabled"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CompleteStep() {
  return (
    <div className="text-center space-y-6 py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 10 }}
      >
        <Award className="h-24 w-24 text-primary mx-auto mb-6" />
      </motion.div>
      <h2 className="text-2xl font-bold terminal-glow">Setup Complete!</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Your account is now fully configured and ready to use. Let's get started!
      </p>

      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
        {[
          { icon: Rocket, label: "Quick Start Guide", desc: "Learn the basics" },
          { icon: FileText, label: "Documentation", desc: "Detailed guides" },
          { icon: MessageSquare, label: "Support", desc: "Get help anytime" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-lg glass border border-primary/20 cursor-pointer"
          >
            <item.icon className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-sm">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 justify-center mt-6">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <Star className="h-6 w-6 text-primary fill-primary" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

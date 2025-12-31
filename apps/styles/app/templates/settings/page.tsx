"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/ThemeProvider"
import {
  User,
  Settings,
  Palette,
  Shield,
  Bell,
  Lock,
  Link,
  Keyboard,
  Code,
  Search,
  Upload,
  Download,
  Save,
  X,
  Check,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Terminal,
  Trash2,
  Key,
  Globe,
  Webhook,
  Mail,
  Smartphone,
  MessageSquare,
  Eye,
  EyeOff,
  LogOut,
  Activity,
  Database,
  Cookie,
  FileDown,
  AlertTriangle,
  Zap,
  Bug,
  Command,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  ExternalLink,
  Plus,
  Copy,
  RefreshCw,
  Clock,
  Calendar,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  HelpCircle,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Hash,
  AtSign,
  Link2,
  Unlink,
  ToggleLeft,
  ToggleRight,
  Sliders,
  Type,
  Minus,
  Server,
  Cloud,
  FolderOpen,
  FileText,
  Image,
  Film,
  Music,
  Mic,
  Camera,
  CameraOff,
  MicOff,
  Users,
  BarChart3,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Button, Input, Label, Switch, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, RadioGroup, RadioGroupItem, Checkbox, Slider, Separator, Badge, ScrollArea, Avatar, AvatarFallback, AvatarImage, Alert, AlertDescription, AlertTitle, Progress, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, cn } from "@ggprompts/ui"
import { toast } from "sonner"

// Settings categories configuration
const settingsCategories = [
  { id: "profile", label: "Profile", icon: User, description: "Personal information and public profile" },
  { id: "account", label: "Account", icon: Settings, description: "Account settings and preferences" },
  { id: "appearance", label: "Appearance", icon: Palette, description: "Theme and visual customization" },
  { id: "privacy", label: "Privacy", icon: Shield, description: "Data and privacy controls" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Alert and notification preferences" },
  { id: "security", label: "Security", icon: Lock, description: "Password and authentication settings" },
  { id: "integrations", label: "Integrations", icon: Link, description: "Connected apps and services" },
  { id: "shortcuts", label: "Shortcuts", icon: Keyboard, description: "Keyboard shortcuts and commands" },
  { id: "advanced", label: "Advanced", icon: Code, description: "Developer options and experimental features" },
]

// Mock data for demonstrations
const mockConnectedApps = [
  { id: 1, name: "GitHub", icon: Github, status: "connected", lastSync: "2 hours ago" },
  { id: 2, name: "Slack", icon: MessageSquare, status: "connected", lastSync: "1 day ago" },
  { id: 3, name: "Google Drive", icon: Cloud, status: "connected", lastSync: "3 days ago" },
  { id: 4, name: "Notion", icon: FileText, status: "disconnected", lastSync: "Never" },
]

const mockActiveSessions = [
  { id: 1, device: "Chrome on MacOS", location: "San Francisco, CA", time: "Current session", current: true },
  { id: 2, device: "Safari on iPhone", location: "San Francisco, CA", time: "2 hours ago", current: false },
  { id: 3, device: "Firefox on Windows", location: "New York, NY", time: "1 day ago", current: false },
]

const mockSecurityLog = [
  { id: 1, action: "Password changed", time: "2024-01-15 14:30", status: "success" },
  { id: 2, action: "Two-factor authentication enabled", time: "2024-01-10 09:15", status: "success" },
  { id: 3, action: "Failed login attempt", time: "2024-01-08 22:45", status: "warning" },
  { id: 4, action: "New device login", time: "2024-01-05 16:20", status: "info" },
]

const defaultShortcuts = [
  { id: 1, action: "Save", keys: ["Cmd", "S"], customizable: true },
  { id: 2, action: "Open command palette", keys: ["Cmd", "K"], customizable: true },
  { id: 3, action: "Toggle theme", keys: ["Cmd", "Shift", "L"], customizable: true },
  { id: 4, action: "Search", keys: ["Cmd", "F"], customizable: true },
  { id: 5, action: "New file", keys: ["Cmd", "N"], customizable: true },
  { id: 6, action: "Close tab", keys: ["Cmd", "W"], customizable: true },
]

export default function SettingsTemplate() {
  const [activeCategory, setActiveCategory] = useState("profile")
  const [searchQuery, setSearchQuery] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Settings state
  const { theme, setTheme } = useTheme()
  const [fontSize, setFontSize] = useState([14])
  const [density, setDensity] = useState("comfortable")
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [smsNotifs, setSmsNotifs] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)
  const [publicProfile, setPublicProfile] = useState(true)
  const [showEmail, setShowEmail] = useState(false)
  const [dataCollection, setDataCollection] = useState(true)
  const [cookies, setCookies] = useState("essential")
  const [debugMode, setDebugMode] = useState(false)
  const [experimentalFeatures, setExperimentalFeatures] = useState(false)
  const [developerMode, setDeveloperMode] = useState(false)

  // Handle save
  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    setHasChanges(false)
    toast.success("Settings saved successfully", {
      description: "Your preferences have been updated.",
    })
  }

  // Handle cancel
  const handleCancel = () => {
    setHasChanges(false)
    toast.info("Changes discarded", {
      description: "Your settings have been reverted.",
    })
  }

  // Filter categories based on search
  const filteredCategories = searchQuery
    ? settingsCategories.filter(cat =>
        cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : settingsCategories

  // Mark as changed whenever a setting is modified
  const handleSettingChange = (callback: () => void) => {
    callback()
    setHasChanges(true)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary terminal-glow mb-2 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-muted-foreground">Manage your account and application preferences</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Import/Export */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="glass border-primary/30">
                    <Sliders className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-dark border-primary/30">
                  <DropdownMenuLabel>Settings Management</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Export Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Save/Cancel buttons */}
              <AnimatePresence>
                {hasChanges && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="glass border-border"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-primary hover:bg-primary/90 text-black"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings..."
              className="pl-10 glass-dark border-primary/30 focus:border-primary"
            />
          </div>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="glass-dark border-primary/30">
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-1">
                  {filteredCategories.map((category) => {
                    const Icon = category.icon
                    const isActive = activeCategory === category.id
                    return (
                      <motion.button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                          "hover:bg-primary/10 hover:border-primary/30",
                          isActive && "bg-primary/20 border border-primary/50"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className={cn(
                          "w-5 h-5",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )} />
                        <div className="flex-1 text-left">
                          <p className={cn(
                            "font-medium text-sm",
                            isActive ? "text-primary" : "text-foreground"
                          )}>
                            {category.label}
                          </p>
                          <p className="text-xs text-muted-foreground hidden md:block">
                            {category.description}
                          </p>
                        </div>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 text-primary" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </ScrollArea>
            </Card>
          </motion.div>

          {/* Content area */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-3"
          >
            <ScrollArea className="h-[600px]">
              {/* Profile Settings */}
              {activeCategory === "profile" && (
                <div className="space-y-6">
                  <Card className="glass-dark border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-primary">Profile Information</CardTitle>
                      <CardDescription>Update your personal information and public profile</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Avatar Upload */}
                      <div className="flex items-center gap-6">
                        <Avatar className="w-24 h-24 border-2 border-primary/50">
                          <AvatarImage src="/images/avatars/at-150x150.png" />
                          <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                            AT
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <Label>Profile Picture</Label>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="glass border-primary/30">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload
                            </Button>
                            <Button size="sm" variant="outline" className="glass border-border">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 5MB.</p>
                        </div>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Personal Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            className="glass-dark border-primary/30"
                            onChange={() => setHasChanges(true)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            className="glass-dark border-primary/30"
                            onChange={() => setHasChanges(true)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            className="glass-dark border-primary/30"
                            onChange={() => setHasChanges(true)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            className="glass-dark border-primary/30"
                            onChange={() => setHasChanges(true)}
                          />
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself..."
                          rows={4}
                          className="glass-dark border-primary/30"
                          onChange={() => setHasChanges(true)}
                        />
                        <p className="text-xs text-muted-foreground">Brief description for your public profile.</p>
                      </div>

                      {/* Social Links */}
                      <div className="space-y-2">
                        <Label>Social Media Links</Label>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Github className="w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="github.com/username"
                              className="glass-dark border-primary/30"
                              onChange={() => setHasChanges(true)}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Twitter className="w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="twitter.com/username"
                              className="glass-dark border-primary/30"
                              onChange={() => setHasChanges(true)}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Linkedin className="w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="linkedin.com/in/username"
                              className="glass-dark border-primary/30"
                              onChange={() => setHasChanges(true)}
                            />
                          </div>
                          <Button size="sm" variant="outline" className="glass border-primary/30">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Link
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Account Settings */}
              {activeCategory === "account" && (
                <div className="space-y-6">
                  <Card className="glass-dark border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-primary">Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences and settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          placeholder="johndoe"
                          className="glass-dark border-primary/30"
                          onChange={() => setHasChanges(true)}
                        />
                        <p className="text-xs text-muted-foreground">This is your unique identifier.</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en" onValueChange={() => setHasChanges(true)}>
                          <SelectTrigger className="glass-dark border-primary/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-dark border-primary/30">
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="pst" onValueChange={() => setHasChanges(true)}>
                          <SelectTrigger className="glass-dark border-primary/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-dark border-primary/30">
                            <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                            <SelectItem value="est">Eastern Time (EST)</SelectItem>
                            <SelectItem value="cst">Central Time (CST)</SelectItem>
                            <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                            <SelectItem value="utc">UTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator className="border-primary/20" />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Account Actions</h3>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full glass border-primary/30 justify-start">
                            <FileDown className="w-4 h-4 mr-2" />
                            Download Account Data
                          </Button>
                          <Button variant="outline" className="w-full glass border-yellow-500/30 text-yellow-400 hover:text-yellow-300 justify-start">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Deactivate Account
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" className="w-full glass border-red-500/30 text-red-400 hover:text-red-300 justify-start">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass-dark border-red-500/30">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-red-400">Delete Account?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="glass border-border">Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white">
                                  Delete Account
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Appearance Settings */}
              {activeCategory === "appearance" && (
                <div className="space-y-6">
                  <Card className="glass-dark border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-primary">Theme Settings</CardTitle>
                      <CardDescription>Customize the look and feel of the application</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Theme Selector */}
                      <div className="space-y-3">
                        <Label>Theme</Label>
                        <RadioGroup value={theme} onValueChange={(value) => handleSettingChange(() => setTheme(value as any))}>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <label className="cursor-pointer">
                              <RadioGroupItem value="dark" className="sr-only" />
                              <div className={cn(
                                "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                                String(theme) === "dark"
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:bg-muted"
                              )}>
                                <Moon className="w-4 h-4" />
                                <span className="text-sm">Dark</span>
                              </div>
                            </label>
                            <label className="cursor-pointer">
                              <RadioGroupItem value="light" className="sr-only" />
                              <div className={cn(
                                "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                                String(theme) === "light"
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:bg-muted"
                              )}>
                                <Sun className="w-4 h-4" />
                                <span className="text-sm">Light</span>
                              </div>
                            </label>
                            <label className="cursor-pointer">
                              <RadioGroupItem value="auto" className="sr-only" />
                              <div className={cn(
                                "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                                String(theme) === "auto"
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:bg-muted"
                              )}>
                                <Monitor className="w-4 h-4" />
                                <span className="text-sm">Auto</span>
                              </div>
                            </label>
                            <label className="cursor-pointer">
                              <RadioGroupItem value="terminal" className="sr-only" />
                              <div className={cn(
                                "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                                String(theme) === "terminal"
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:bg-muted"
                              )}>
                                <Terminal className="w-4 h-4" />
                                <span className="text-sm">Terminal</span>
                              </div>
                            </label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Theme Selector */}
                      <div className="space-y-3">
                        <Label>Theme</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { name: "terminal", color: "#10b981", label: "Terminal" },
                            { name: "amber", color: "#ffc857", label: "Amber" },
                            { name: "carbon", color: "#ffffff", label: "Carbon" },
                            { name: "light", color: "#0066cc", label: "Light" }
                          ].map((themeOption) => (
                            <button
                              key={themeOption.name}
                              onClick={() => handleSettingChange(() => setTheme(themeOption.name as any))}
                              className={cn(
                                "h-16 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1",
                                String(theme) === themeOption.name
                                  ? "border-primary scale-105"
                                  : "border-border hover:bg-muted"
                              )}
                              style={{
                                background: `linear-gradient(135deg, ${themeOption.color}22, ${themeOption.color}44)`
                              }}
                            >
                              <span className="text-xs font-mono text-muted-foreground">{themeOption.label}</span>
                              {String(theme) === themeOption.name && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Font Size */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Font Size</Label>
                          <span className="text-sm text-muted-foreground">{fontSize}px</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Type className="w-4 h-4 text-muted-foreground" />
                          <Slider
                            value={fontSize}
                            onValueChange={(value) => handleSettingChange(() => setFontSize(value))}
                            min={12}
                            max={20}
                            step={1}
                            className="flex-1"
                          />
                          <Type className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>

                      {/* Layout Density */}
                      <div className="space-y-3">
                        <Label>Layout Density</Label>
                        <RadioGroup value={density} onValueChange={(value) => handleSettingChange(() => setDensity(value))}>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <RadioGroupItem value="compact" />
                              <span className="text-sm">Compact</span>
                              <span className="text-xs text-muted-foreground">More content, less spacing</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <RadioGroupItem value="comfortable" />
                              <span className="text-sm">Comfortable</span>
                              <span className="text-xs text-muted-foreground">Balanced spacing</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <RadioGroupItem value="spacious" />
                              <span className="text-sm">Spacious</span>
                              <span className="text-xs text-muted-foreground">More breathing room</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Preview Panel */}
                      <div className="space-y-3">
                        <Label>Preview</Label>
                        <Card className="glass border-primary/30 p-4">
                          <div className="space-y-3">
                            <h3 className="text-lg font-medium text-primary">Sample Content</h3>
                            <p className="text-sm text-foreground/80" style={{ fontSize: `${fontSize}px` }}>
                              This is how your content will appear with the current settings.
                              The active theme is <span className="text-primary font-semibold capitalize">{theme}</span>.
                            </p>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="border-primary/50 text-primary">
                                Active
                              </Badge>
                              <Badge variant="secondary">
                                Preview
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Privacy Settings */}
              {activeCategory === "privacy" && (
                <div className="space-y-6">
                  <Card className="glass-dark border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-primary">Privacy Controls</CardTitle>
                      <CardDescription>Manage your data and privacy preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Profile Visibility */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Profile Visibility</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor="public-profile">Public Profile</Label>
                              <p className="text-xs text-muted-foreground">Make your profile visible to everyone</p>
                            </div>
                            <Switch
                              id="public-profile"
                              checked={publicProfile}
                              onCheckedChange={(checked) => handleSettingChange(() => setPublicProfile(checked))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor="show-email">Show Email Address</Label>
                              <p className="text-xs text-muted-foreground">Display email on your public profile</p>
                            </div>
                            <Switch
                              id="show-email"
                              checked={showEmail}
                              onCheckedChange={(checked) => handleSettingChange(() => setShowEmail(checked))}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Data Collection */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Data Collection</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor="analytics">Analytics & Performance</Label>
                              <p className="text-xs text-muted-foreground">Help us improve by sharing usage data</p>
                            </div>
                            <Switch
                              id="analytics"
                              checked={dataCollection}
                              onCheckedChange={(checked) => handleSettingChange(() => setDataCollection(checked))}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Cookie Preferences */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Cookie Preferences</h3>
                        <RadioGroup value={cookies} onValueChange={(value) => handleSettingChange(() => setCookies(value))}>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <RadioGroupItem value="essential" />
                              <div>
                                <span className="text-sm">Essential Only</span>
                                <p className="text-xs text-muted-foreground">Only cookies required for the site to function</p>
                              </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <RadioGroupItem value="functional" />
                              <div>
                                <span className="text-sm">Functional</span>
                                <p className="text-xs text-muted-foreground">Includes personalization and analytics</p>
                              </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <RadioGroupItem value="all" />
                              <div>
                                <span className="text-sm">All Cookies</span>
                                <p className="text-xs text-muted-foreground">All cookies including marketing</p>
                              </div>
                            </label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Data Management */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Data Management</h3>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full glass border-primary/30 justify-start">
                            <Database className="w-4 h-4 mr-2" />
                            View Stored Data
                          </Button>
                          <Button variant="outline" className="w-full glass border-primary/30 justify-start">
                            <FileDown className="w-4 h-4 mr-2" />
                            Export My Data
                          </Button>
                          <Button variant="outline" className="w-full glass border-red-500/30 text-red-400 hover:text-red-300 justify-start">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete My Data
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Notification Settings */}
              {activeCategory === "notifications" && (
                <div className="space-y-6">
                  <Card className="glass-dark border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-primary">Notification Preferences</CardTitle>
                      <CardDescription>Choose how and when you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Notification Channels */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Notification Channels</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-muted-foreground" />
                              <div className="space-y-1">
                                <Label htmlFor="email-notifs">Email Notifications</Label>
                                <p className="text-xs text-muted-foreground">Receive updates via email</p>
                              </div>
                            </div>
                            <Switch
                              id="email-notifs"
                              checked={emailNotifs}
                              onCheckedChange={(checked) => handleSettingChange(() => setEmailNotifs(checked))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Smartphone className="w-5 h-5 text-muted-foreground" />
                              <div className="space-y-1">
                                <Label htmlFor="push-notifs">Push Notifications</Label>
                                <p className="text-xs text-muted-foreground">Browser and mobile notifications</p>
                              </div>
                            </div>
                            <Switch
                              id="push-notifs"
                              checked={pushNotifs}
                              onCheckedChange={(checked) => handleSettingChange(() => setPushNotifs(checked))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <MessageSquare className="w-5 h-5 text-muted-foreground" />
                              <div className="space-y-1">
                                <Label htmlFor="sms-notifs">SMS Notifications</Label>
                                <p className="text-xs text-muted-foreground">Text message alerts</p>
                              </div>
                            </div>
                            <Switch
                              id="sms-notifs"
                              checked={smsNotifs}
                              onCheckedChange={(checked) => handleSettingChange(() => setSmsNotifs(checked))}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Notification Categories */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Notification Types</h3>
                        <div className="space-y-3">
                          {[
                            { label: "Security Alerts", description: "Login attempts and security updates", icon: Shield },
                            { label: "Account Updates", description: "Changes to your account settings", icon: Settings },
                            { label: "Product Updates", description: "New features and improvements", icon: Zap },
                            { label: "Marketing", description: "Promotional offers and newsletters", icon: Mail },
                            { label: "Social", description: "Comments, likes, and mentions", icon: Users },
                            { label: "Reports", description: "Weekly and monthly summaries", icon: BarChart3 },
                          ].map((category) => {
                            const Icon = category.icon
                            return (
                              <div key={category.label} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Icon className="w-5 h-5 text-muted-foreground" />
                                  <div className="space-y-1">
                                    <Label>{category.label}</Label>
                                    <p className="text-xs text-muted-foreground">{category.description}</p>
                                  </div>
                                </div>
                                <Switch
                                  defaultChecked={category.label === "Security Alerts"}
                                  onCheckedChange={() => setHasChanges(true)}
                                />
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Frequency Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Frequency</h3>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="frequency">Email Digest Frequency</Label>
                            <Select defaultValue="daily" onValueChange={() => setHasChanges(true)}>
                              <SelectTrigger className="glass-dark border-primary/30">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="glass-dark border-primary/30">
                                <SelectItem value="realtime">Real-time</SelectItem>
                                <SelectItem value="daily">Daily Digest</SelectItem>
                                <SelectItem value="weekly">Weekly Summary</SelectItem>
                                <SelectItem value="monthly">Monthly Roundup</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Do Not Disturb */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Do Not Disturb</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor="dnd">Enable Do Not Disturb</Label>
                              <p className="text-xs text-muted-foreground">Mute all notifications during specific hours</p>
                            </div>
                            <Switch
                              id="dnd"
                              onCheckedChange={() => setHasChanges(true)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="dnd-start">Start Time</Label>
                              <Input
                                id="dnd-start"
                                type="time"
                                defaultValue="22:00"
                                className="glass-dark border-primary/30"
                                onChange={() => setHasChanges(true)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="dnd-end">End Time</Label>
                              <Input
                                id="dnd-end"
                                type="time"
                                defaultValue="08:00"
                                className="glass-dark border-primary/30"
                                onChange={() => setHasChanges(true)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security Settings */}
              {activeCategory === "security" && (
                <div className="space-y-6">
                  <Card className="glass-dark border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-primary">Password & Authentication</CardTitle>
                      <CardDescription>Secure your account with strong authentication</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Password Change */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Change Password</h3>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input
                              id="current-password"
                              type="password"
                              className="glass-dark border-primary/30"
                              onChange={() => setHasChanges(true)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                              id="new-password"
                              type="password"
                              className="glass-dark border-primary/30"
                              onChange={() => setHasChanges(true)}
                            />
                            <Progress value={60} className="h-2" />
                            <p className="text-xs text-muted-foreground">Password strength: Good</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              className="glass-dark border-primary/30"
                              onChange={() => setHasChanges(true)}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Two-Factor Authentication */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/30">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">Two-Factor Authentication</p>
                              <p className="text-xs text-muted-foreground">
                                {twoFactor ? "Enabled - Your account is secure" : "Add an extra layer of security"}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={twoFactor}
                            onCheckedChange={(checked) => handleSettingChange(() => setTwoFactor(checked))}
                          />
                        </div>
                        {twoFactor && (
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full glass border-primary/30 justify-start">
                              <Key className="w-4 h-4 mr-2" />
                              Generate Backup Codes
                            </Button>
                            <Button variant="outline" className="w-full glass border-primary/30 justify-start">
                              <Smartphone className="w-4 h-4 mr-2" />
                              Configure Authenticator App
                            </Button>
                          </div>
                        )}
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Active Sessions */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-primary">Active Sessions</h3>
                          <Button size="sm" variant="outline" className="glass border-red-500/30 text-red-400">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out All
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {mockActiveSessions.map((session) => (
                            <div
                              key={session.id}
                              className="flex items-center justify-between p-3 rounded-lg glass border border-primary/20"
                            >
                              <div className="flex items-center gap-3">
                                <Monitor className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">{session.device}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Globe className="w-3 h-3" />
                                    {session.location}
                                    <span>•</span>
                                    <Clock className="w-3 h-3" />
                                    {session.time}
                                  </div>
                                </div>
                              </div>
                              {session.current ? (
                                <Badge className="bg-primary/20 text-primary border-primary/50">
                                  Current
                                </Badge>
                              ) : (
                                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                                  <LogOut className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Security Log */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Security Activity</h3>
                        <ScrollArea className="h-48">
                          <div className="space-y-2">
                            {mockSecurityLog.map((log) => (
                              <div
                                key={log.id}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5"
                              >
                                {log.status === "success" ? (
                                  <CheckCircle2 className="w-4 h-4 text-primary" />
                                ) : log.status === "warning" ? (
                                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                                ) : (
                                  <Info className="w-4 h-4 text-secondary" />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm">{log.action}</p>
                                  <p className="text-xs text-muted-foreground">{log.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Integrations */}
              {activeCategory === "integrations" && (
                <div className="space-y-6">
                  <Card className="glass-dark border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-primary">Connected Apps</CardTitle>
                      <CardDescription>Manage your third-party integrations and API access</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Connected Apps */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockConnectedApps.map((app) => {
                          const Icon = app.icon
                          return (
                            <Card key={app.id} className="glass border-primary/20">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                      <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{app.name}</p>
                                      <p className="text-xs text-muted-foreground">Last sync: {app.lastSync}</p>
                                    </div>
                                  </div>
                                  <Badge
                                    variant={app.status === "connected" ? "default" : "secondary"}
                                    className={app.status === "connected" ? "bg-primary/20 text-primary border-primary/50" : ""}
                                  >
                                    {app.status}
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  {app.status === "connected" ? (
                                    <>
                                      <Button size="sm" variant="outline" className="flex-1 glass border-primary/30">
                                        <RefreshCw className="w-3 h-3 mr-1" />
                                        Sync
                                      </Button>
                                      <Button size="sm" variant="outline" className="flex-1 glass border-red-500/30 text-red-400">
                                        <Unlink className="w-3 h-3 mr-1" />
                                        Disconnect
                                      </Button>
                                    </>
                                  ) : (
                                    <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-black">
                                      <Link2 className="w-3 h-3 mr-1" />
                                      Connect
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>

                      <Button variant="outline" className="w-full glass border-primary/30">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Integration
                      </Button>

                      <Separator className="border-primary/20" />

                      {/* API Keys */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-primary">API Keys</h3>
                          <Button size="sm" className="bg-primary hover:bg-primary/90 text-black">
                            <Plus className="w-4 h-4 mr-2" />
                            Generate Key
                          </Button>
                        </div>
                        <Alert className="glass border-primary/30">
                          <Key className="h-4 w-4" />
                          <AlertTitle>API Access</AlertTitle>
                          <AlertDescription>
                            Your API keys allow programmatic access to your account. Keep them secure!
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 rounded-lg glass border border-primary/20">
                            <div className="flex items-center gap-3">
                              <Hash className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <code className="text-sm font-mono text-primary">sk_live_...abc123</code>
                                <p className="text-xs text-muted-foreground">Created 30 days ago • Last used 2 hours ago</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost">
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-400">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Webhooks */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-primary">Webhooks</h3>
                          <Button size="sm" variant="outline" className="glass border-primary/30">
                            <Webhook className="w-4 h-4 mr-2" />
                            Add Endpoint
                          </Button>
                        </div>
                        <div className="text-center py-8 text-muted-foreground">
                          <Webhook className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                          <p className="text-sm">No webhook endpoints configured</p>
                          <p className="text-xs mt-1">Add an endpoint to receive real-time updates</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Keyboard Shortcuts */}
              {activeCategory === "shortcuts" && (
                <div className="space-y-6">
                  <Card className="glass-dark border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-primary">Keyboard Shortcuts</CardTitle>
                      <CardDescription>Customize keyboard shortcuts for quick actions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Alert className="glass border-secondary/30">
                        <Keyboard className="h-4 w-4" />
                        <AlertTitle>Pro Tip</AlertTitle>
                        <AlertDescription>
                          Press <kbd className="px-2 py-1 text-xs bg-muted rounded">Cmd</kbd> + <kbd className="px-2 py-1 text-xs bg-muted rounded">K</kbd> to open the command palette
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-2">
                        {defaultShortcuts.map((shortcut) => (
                          <div
                            key={shortcut.id}
                            className="flex items-center justify-between p-3 rounded-lg glass border border-primary/20 hover:bg-primary/5"
                          >
                            <div className="flex items-center gap-3">
                              <Command className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{shortcut.action}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {shortcut.keys.map((key, index) => (
                                  <React.Fragment key={index}>
                                    <kbd className="px-2 py-1 text-xs bg-muted rounded border border-border">
                                      {key}
                                    </kbd>
                                    {index < shortcut.keys.length - 1 && (
                                      <span className="text-muted-foreground">+</span>
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                              {shortcut.customizable && (
                                <Button size="sm" variant="ghost" className="ml-2">
                                  Edit
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator className="border-primary/20" />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Command Palette</h3>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="cmd-palette">Enable Command Palette</Label>
                            <p className="text-xs text-muted-foreground">Quick access to all commands</p>
                          </div>
                          <Switch
                            id="cmd-palette"
                            defaultChecked
                            onCheckedChange={() => setHasChanges(true)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Advanced Settings */}
              {activeCategory === "advanced" && (
                <div className="space-y-6">
                  <Card className="glass-dark border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-primary">Developer Options</CardTitle>
                      <CardDescription>Advanced settings for power users and developers</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Alert className="glass border-yellow-500/30">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                          These settings are for advanced users. Incorrect configuration may affect app performance.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="dev-mode">Developer Mode</Label>
                            <p className="text-xs text-muted-foreground">Enable developer tools and console</p>
                          </div>
                          <Switch
                            id="dev-mode"
                            checked={developerMode}
                            onCheckedChange={(checked) => handleSettingChange(() => setDeveloperMode(checked))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="debug">Debug Mode</Label>
                            <p className="text-xs text-muted-foreground">Show detailed error messages and logs</p>
                          </div>
                          <Switch
                            id="debug"
                            checked={debugMode}
                            onCheckedChange={(checked) => handleSettingChange(() => setDebugMode(checked))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="experimental">Experimental Features</Label>
                            <p className="text-xs text-muted-foreground">Try new features before release</p>
                          </div>
                          <Switch
                            id="experimental"
                            checked={experimentalFeatures}
                            onCheckedChange={(checked) => handleSettingChange(() => setExperimentalFeatures(checked))}
                          />
                        </div>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Performance */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Performance</h3>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="cache">Cache Size</Label>
                            <Select defaultValue="auto" onValueChange={() => setHasChanges(true)}>
                              <SelectTrigger className="glass-dark border-primary/30">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="glass-dark border-primary/30">
                                <SelectItem value="auto">Automatic</SelectItem>
                                <SelectItem value="small">50 MB</SelectItem>
                                <SelectItem value="medium">200 MB</SelectItem>
                                <SelectItem value="large">500 MB</SelectItem>
                                <SelectItem value="unlimited">Unlimited</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button variant="outline" className="w-full glass border-primary/30 justify-start">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear Cache
                          </Button>
                        </div>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Console */}
                      {developerMode && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-primary">Console Output</h3>
                          <div className="font-mono text-xs p-4 rounded-lg bg-background/50 border border-primary/30 h-32 overflow-auto">
                            <div className="text-primary">[INFO] Developer mode enabled</div>
                            <div className="text-secondary">[DEBUG] Settings panel loaded</div>
                            <div className="text-yellow-400">[WARN] Experimental features active</div>
                            <div className="text-muted-foreground">[LOG] Cache size: automatic</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </ScrollArea>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
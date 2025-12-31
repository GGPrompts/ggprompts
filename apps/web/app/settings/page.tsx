"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/ThemeProvider"
import { useBackground, type BackgroundMediaType } from "@/components/BackgroundProvider"
import { createClient } from "@/lib/supabase/client"
import { getAvatarUrl, getInitials, getDiceBearStyles, generateDiceBearAvatar } from "@/lib/avatar"
import {
  User,
  Settings,
  Palette,
  Save,
  X,
  Check,
  ChevronRight,
  Trash2,
  Loader2,
  Sliders,
  Download,
  RefreshCw,
  Shuffle,
  Github,
  Calendar,
  Terminal,
  Layers,
  ImageIcon,
  Video,
  Link,
  AlertCircle,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { GitHubSyncSettings } from "@/components/github-sync/GitHubSyncSettings"
import { TerminalSettings } from "./TerminalSettings"

import type { User as SupabaseUser } from "@supabase/supabase-js"

// Settings categories configuration
const settingsCategories = [
  { id: "profile", label: "Profile", icon: User, description: "Personal information and public profile" },
  { id: "account", label: "Account", icon: Settings, description: "Account settings and preferences" },
  { id: "appearance", label: "Appearance", icon: Palette, description: "Theme and visual customization" },
  { id: "github", label: "GitHub Sync", icon: Github, description: "Sync Claude Code toolkit to GitHub" },
  { id: "terminal", label: "Terminal", icon: Terminal, description: "TabzChrome integration settings" },
]

// Theme configuration with display info
const themeOptions = [
  { name: "terminal", color: "#10b981", label: "Terminal" },
  { name: "amber", color: "#ffc857", label: "Amber" },
  { name: "carbon", color: "#ffffff", label: "Carbon" },
  { name: "light", color: "#0066cc", label: "Light" },
  { name: "ocean", color: "#00d4ff", label: "Ocean" },
  { name: "sunset", color: "#ff6633", label: "Sunset" },
  { name: "forest", color: "#8aff00", label: "Forest" },
  { name: "midnight", color: "#ff66ff", label: "Midnight" },
  { name: "neon", color: "#ff0099", label: "Neon" },
  { name: "slate", color: "#33b3ff", label: "Slate" },
]

interface Profile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  email: string | null
  created_at: string
}

function SettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Get initial tab from URL, default to "profile"
  const tabParam = searchParams.get('tab')
  const validTabs = ['profile', 'account', 'appearance', 'github', 'terminal']
  const initialTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'profile'

  const [activeCategory, setActiveCategory] = useState(initialTab)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Auth state
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  // Profile form state
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [avatarStyle, setAvatarStyle] = useState<string | null>(null)

  // Account state
  const [email, setEmail] = useState("")
  const [language, setLanguage] = useState("en")

  // Theme state
  const { theme, setTheme } = useTheme()
  const {
    backgroundTone,
    setBackgroundTone,
    backgroundTones,
    backgroundUrl,
    setBackgroundUrl,
    backgroundMediaType,
    setBackgroundMediaType,
    backgroundOpacity,
    setBackgroundOpacity
  } = useBackground()

  // Avatar URL computation
  const avatarUrl = user ? getAvatarUrl(user, {
    avatar_url: avatarStyle ? generateDiceBearAvatar(username || email || user.id, avatarStyle as Parameters<typeof generateDiceBearAvatar>[1]) : profile?.avatar_url,
    username
  }) : null

  // Load user data on mount
  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (!authUser) {
          router.push('/login')
          return
        }

        setUser(authUser)
        setEmail(authUser.email || "")

        // Fetch profile from users table
        const { data: profileData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          toast.error('Failed to load profile')
        } else if (profileData) {
          setProfile(profileData)
          setDisplayName(profileData.display_name || "")
          setUsername(profileData.username || "")
          setBio(profileData.bio || "")
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        toast.error('Failed to load user data')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [supabase, router])

  // Handle save
  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      // Build avatar URL if user selected a custom style
      const newAvatarUrl = avatarStyle
        ? generateDiceBearAvatar(username || email || user.id, avatarStyle as Parameters<typeof generateDiceBearAvatar>[1])
        : profile?.avatar_url

      const { error } = await supabase
        .from('users')
        .update({
          display_name: displayName || null,
          username: username || null,
          bio: bio || null,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // Update local profile state
      setProfile(prev => prev ? {
        ...prev,
        display_name: displayName || null,
        username: username || null,
        bio: bio || null,
        avatar_url: newAvatarUrl || null
      } : null)

      // Dispatch event so Navigation and other components can update
      // Compute the actual avatar URL that will be displayed (could be OAuth fallback)
      const displayAvatarUrl = newAvatarUrl || user.user_metadata?.avatar_url || user.user_metadata?.picture || generateDiceBearAvatar(username || email || user.id)
      window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { avatarUrl: displayAvatarUrl } }))

      setHasChanges(false)
      setAvatarStyle(null) // Reset style selection after save
      toast.success("Settings saved successfully", {
        description: "Your preferences have been updated.",
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    // Revert to original profile data
    if (profile) {
      setDisplayName(profile.display_name || "")
      setUsername(profile.username || "")
      setBio(profile.bio || "")
    }
    setAvatarStyle(null)
    setHasChanges(false)
    toast.info("Changes discarded", {
      description: "Your settings have been reverted.",
    })
  }

  // Mark as changed whenever a setting is modified
  const handleSettingChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    setter(value)
    setHasChanges(true)
  }

  // Handle theme change
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as typeof theme)
    toast.success(`Theme changed to ${newTheme}`, {
      description: "Your new theme has been applied.",
    })
  }

  // Randomize avatar style
  const randomizeAvatarStyle = () => {
    const styles = getDiceBearStyles()
    const randomStyle = styles[Math.floor(Math.random() * styles.length)]
    setAvatarStyle(randomStyle)
    setHasChanges(true)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary terminal-glow mb-2">
                Settings
              </h1>
              <p className="text-muted-foreground">Manage your account and application preferences</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Import/Export */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="glass border-primary/30 hidden sm:flex">
                    <Sliders className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-dark border-primary/30">
                  <DropdownMenuLabel>Settings Management</DropdownMenuLabel>
                  <DropdownMenuSeparator />
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
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
              <div className="p-4 space-y-1">
                {settingsCategories.map((category) => {
                  const Icon = category.icon
                  const isActive = activeCategory === category.id
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
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
            <ScrollArea className="h-[calc(100vh-280px)] min-h-[400px]">
              {/* Profile Settings */}
              {activeCategory === "profile" && (
                <div className="space-y-6">
                  <Card className="glass-dark border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-primary">Profile Information</CardTitle>
                      <CardDescription>Update your personal information and public profile</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Avatar Display */}
                      <div className="flex items-center gap-6">
                        <Avatar className="w-24 h-24 border-2 border-primary/50">
                          <AvatarImage src={avatarUrl || undefined} />
                          <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                            {getInitials(displayName || username || email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <Label>Profile Picture</Label>
                          <p className="text-sm text-muted-foreground">
                            {avatarStyle
                              ? "Preview: Custom DiceBear avatar"
                              : profile?.avatar_url?.includes('dicebear')
                                ? "Using custom DiceBear avatar"
                                : user.user_metadata?.avatar_url
                                  ? "Using your OAuth profile picture"
                                  : "Auto-generated from your username"}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="glass border-primary/30"
                              onClick={randomizeAvatarStyle}
                            >
                              <Shuffle className="w-4 h-4 mr-2" />
                              Randomize Style
                            </Button>
                            {/* Show "Use OAuth Avatar" if user has OAuth avatar and isn't currently using it */}
                            {user.user_metadata?.avatar_url && (
                              profile?.avatar_url?.includes('dicebear') || avatarStyle
                            ) && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="glass border-primary/30"
                                onClick={() => {
                                  setAvatarStyle(null)
                                  // Set to empty string to trigger OAuth avatar usage
                                  setProfile(prev => prev ? { ...prev, avatar_url: null } : null)
                                  setHasChanges(true)
                                }}
                              >
                                <User className="w-4 h-4 mr-2" />
                                Use OAuth Avatar
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Avatar Style Picker (shown when randomizing) */}
                      {avatarStyle && (
                        <div className="space-y-3">
                          <Label>Avatar Style Preview</Label>
                          <div className="flex flex-wrap gap-2">
                            {getDiceBearStyles().slice(0, 10).map((style) => {
                              const previewUrl = generateDiceBearAvatar(username || email || user.id, style, 48)
                              return (
                                <button
                                  key={style}
                                  onClick={() => {
                                    setAvatarStyle(style)
                                    setHasChanges(true)
                                  }}
                                  className={cn(
                                    "p-1 rounded-lg border-2 transition-all",
                                    avatarStyle === style
                                      ? "border-primary scale-105"
                                      : "border-transparent hover:border-primary/50"
                                  )}
                                >
                                  <img
                                    src={previewUrl}
                                    alt={style}
                                    className="w-12 h-12 rounded"
                                  />
                                </button>
                              )
                            })}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Click to select a style, then save to apply
                          </p>
                        </div>
                      )}

                      <Separator className="border-primary/20" />

                      {/* Personal Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => handleSettingChange(setDisplayName, e.target.value)}
                            placeholder="Your display name"
                            className="glass-dark border-primary/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={username}
                            onChange={(e) => handleSettingChange(setUsername, e.target.value)}
                            placeholder="username"
                            className="glass-dark border-primary/30"
                          />
                          <p className="text-xs text-muted-foreground">This is your unique identifier.</p>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => handleSettingChange(setBio, e.target.value)}
                          placeholder="Tell us about yourself..."
                          rows={4}
                          className="glass-dark border-primary/30"
                        />
                        <p className="text-xs text-muted-foreground">Brief description for your public profile.</p>
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
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          disabled
                          className="glass-dark border-primary/30 opacity-60"
                        />
                        <p className="text-xs text-muted-foreground">
                          Email is managed by your authentication provider.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={language} onValueChange={(value) => handleSettingChange(setLanguage, value)}>
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

                      {profile?.created_at && (
                        <div className="flex items-center gap-3 py-3 px-4 glass rounded-lg border border-border/50">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Member Since</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(profile.created_at).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                      <Separator className="border-primary/20" />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Danger Zone</h3>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full glass border-destructive/30 text-destructive hover:text-destructive hover:bg-destructive/10 justify-start">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Account
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-dark border-destructive/30">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-destructive">Delete Account?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="glass border-border">Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                Delete Account
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
                      {/* Theme Grid */}
                      <div className="space-y-3">
                        <Label>Select Theme</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                          {themeOptions.map((themeOption) => (
                            <button
                              key={themeOption.name}
                              onClick={() => handleThemeChange(themeOption.name)}
                              className={cn(
                                "h-20 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2",
                                theme === themeOption.name
                                  ? "border-primary scale-105 ring-2 ring-primary/30"
                                  : "border-border hover:bg-muted/50 hover:border-primary/50"
                              )}
                              style={{
                                background: `linear-gradient(135deg, ${themeOption.color}22, ${themeOption.color}44)`
                              }}
                            >
                              <div
                                className="w-6 h-6 rounded-full border-2 border-foreground/30"
                                style={{ backgroundColor: themeOption.color }}
                              />
                              <span className="text-xs font-mono text-muted-foreground">{themeOption.label}</span>
                              {theme === themeOption.name && (
                                <Check className="w-4 h-4 text-primary absolute" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Background Tone */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          Background Tone
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Adjust the background gradient independently from your theme
                        </p>
                        <div className="grid grid-cols-5 gap-2">
                          {backgroundTones.map((tone) => {
                            const toneColors: Record<string, string> = {
                              'charcoal': 'bg-slate-800',
                              'deep-purple': 'bg-purple-900',
                              'pure-black': 'bg-black',
                              'light': 'bg-slate-100',
                              'ocean': 'bg-blue-900',
                              'sunset': 'bg-pink-900',
                              'forest': 'bg-green-900',
                              'midnight': 'bg-indigo-950',
                              'neon-dark': 'bg-neutral-900',
                              'slate': 'bg-slate-700'
                            }
                            const toneLabels: Record<string, string> = {
                              'charcoal': 'Charcoal',
                              'deep-purple': 'Purple',
                              'pure-black': 'Black',
                              'light': 'Light',
                              'ocean': 'Ocean',
                              'sunset': 'Sunset',
                              'forest': 'Forest',
                              'midnight': 'Midnight',
                              'neon-dark': 'Neon',
                              'slate': 'Slate'
                            }
                            return (
                              <button
                                key={tone}
                                onClick={() => setBackgroundTone(tone)}
                                className={cn(
                                  "w-full aspect-square rounded-lg border-2 transition-all relative group",
                                  toneColors[tone],
                                  backgroundTone === tone
                                    ? "border-primary ring-2 ring-primary/30 scale-105"
                                    : "border-transparent hover:border-primary/50 hover:scale-105"
                                )}
                                title={toneLabels[tone]}
                              >
                                {backgroundTone === tone && (
                                  <Check
                                    className={cn(
                                      "absolute inset-0 m-auto w-4 h-4 drop-shadow-lg",
                                      tone === 'light' ? "text-slate-900" : "text-slate-100"
                                    )}
                                  />
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Custom Background URL */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Custom Background
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Set a custom image or video URL as your page background
                        </p>

                        {/* Media Type Selector */}
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Type</Label>
                          <div className="flex gap-2">
                            {(['none', 'image', 'video'] as BackgroundMediaType[]).map((type) => {
                              const icons = {
                                none: <X className="w-4 h-4" />,
                                image: <ImageIcon className="w-4 h-4" />,
                                video: <Video className="w-4 h-4" />
                              }
                              const labels = { none: 'None', image: 'Image', video: 'Video' }
                              return (
                                <Button
                                  key={type}
                                  size="sm"
                                  variant={backgroundMediaType === type ? "default" : "outline"}
                                  className={cn(
                                    "flex-1 gap-2",
                                    backgroundMediaType === type
                                      ? "bg-primary text-primary-foreground"
                                      : "glass border-primary/30"
                                  )}
                                  onClick={() => setBackgroundMediaType(type)}
                                >
                                  {icons[type]}
                                  {labels[type]}
                                </Button>
                              )
                            })}
                          </div>
                        </div>

                        {/* URL Input (shown when type is not 'none') */}
                        {backgroundMediaType !== 'none' && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="backgroundUrl" className="text-xs text-muted-foreground flex items-center gap-1">
                                <Link className="w-3 h-3" />
                                URL
                              </Label>
                              <Input
                                id="backgroundUrl"
                                type="url"
                                value={backgroundUrl}
                                onChange={(e) => setBackgroundUrl(e.target.value)}
                                placeholder={backgroundMediaType === 'image' ? 'https://example.com/image.jpg' : 'https://example.com/video.mp4'}
                                className="glass-dark border-primary/30 font-mono text-sm"
                              />
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Use direct URLs to images (jpg, png, gif) or videos (mp4, webm)
                              </p>
                            </div>

                            {/* Opacity Slider */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs text-muted-foreground">Opacity</Label>
                                <span className="text-xs font-mono text-primary">{backgroundOpacity}%</span>
                              </div>
                              <Slider
                                value={[backgroundOpacity]}
                                onValueChange={([value]) => setBackgroundOpacity(value)}
                                min={5}
                                max={100}
                                step={5}
                                className="w-full"
                              />
                              <p className="text-xs text-muted-foreground">
                                Lower opacity keeps your theme visible. Recommended: 15-30%
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      <Separator className="border-primary/20" />

                      {/* Preview Panel */}
                      <div className="space-y-3">
                        <Label>Preview</Label>
                        <Card className="glass border-primary/30 p-4">
                          <div className="space-y-3">
                            <h3 className="text-lg font-medium text-primary terminal-glow">Sample Content</h3>
                            <p className="text-sm text-foreground/80">
                              This is how your content will appear with the current settings.
                              The active theme is <span className="text-primary font-semibold capitalize">{theme}</span>.
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <span className="px-2 py-1 text-xs rounded-md bg-primary/20 text-primary border border-primary/50">
                                Primary
                              </span>
                              <span className="px-2 py-1 text-xs rounded-md bg-secondary/20 text-secondary-foreground border border-secondary/50">
                                Secondary
                              </span>
                              <span className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground border border-border">
                                Muted
                              </span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* GitHub Sync Settings */}
              {activeCategory === "github" && (
                <div className="space-y-6">
                  <GitHubSyncSettings />
                </div>
              )}

              {/* Terminal Settings */}
              {activeCategory === "terminal" && (
                <div className="space-y-6">
                  <TerminalSettings />
                </div>
              )}
            </ScrollArea>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Loading fallback
function SettingsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}

// Default export with Suspense wrapper for useSearchParams
export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent />
    </Suspense>
  )
}

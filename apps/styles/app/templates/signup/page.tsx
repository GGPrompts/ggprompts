"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Shield,
  Sparkles,
  Upload,
  Github,
  Chrome,
  Bell,
  Palette,
  Globe,
  Check,
  X,
} from "lucide-react"
import { Button, Input, Label, Checkbox, Badge, Progress, Separator, RadioGroup, RadioGroupItem } from "@ggprompts/ui"

type Step = "account" | "profile" | "preferences"

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState<Step>("account")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Account step
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Profile step
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [usernameChecking, setUsernameChecking] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)

  // Preferences step
  const [theme, setTheme] = useState("terminal")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength += 25
    if (pwd.length >= 12) strength += 15
    if (/[a-z]/.test(pwd)) strength += 15
    if (/[A-Z]/.test(pwd)) strength += 15
    if (/[0-9]/.test(pwd)) strength += 15
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 15
    return Math.min(strength, 100)
  }

  const passwordStrength = calculatePasswordStrength(password)

  const getStrengthLabel = (strength: number) => {
    if (strength < 30) return { label: "Weak", color: "text-destructive" }
    if (strength < 60) return { label: "Fair", color: "text-yellow-500" }
    if (strength < 80) return { label: "Good", color: "text-blue-500" }
    return { label: "Strong", color: "text-primary" }
  }

  const strengthInfo = getStrengthLabel(passwordStrength)

  // Password requirements
  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains number", met: /[0-9]/.test(password) },
    { label: "Contains special character", met: /[^a-zA-Z0-9]/.test(password) },
  ]

  // Check username availability
  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null)
      return
    }

    setUsernameChecking(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Simulate availability check
    const available = !["admin", "user", "test"].includes(username.toLowerCase())
    setUsernameAvailable(available)
    setUsernameChecking(false)
  }

  // Validate each step
  const validateAccountStep = () => {
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (passwordStrength < 60) {
      newErrors.password = "Please choose a stronger password"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateProfileStep = () => {
    const newErrors: Record<string, string> = {}

    if (!fullName) {
      newErrors.fullName = "Full name is required"
    }

    if (!username) {
      newErrors.username = "Username is required"
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (usernameAvailable === false) {
      newErrors.username = "This username is already taken"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === "account" && validateAccountStep()) {
      setCurrentStep("profile")
      setErrors({})
    } else if (currentStep === "profile" && validateProfileStep()) {
      setCurrentStep("preferences")
      setErrors({})
    }
  }

  const handleBack = () => {
    if (currentStep === "preferences") {
      setCurrentStep("profile")
    } else if (currentStep === "profile") {
      setCurrentStep("account")
    }
    setErrors({})
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSuccess(true)
    setIsLoading(false)
  }

  const handleSocialSignup = async (provider: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const stepProgress = {
    account: 33,
    profile: 66,
    preferences: 100,
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Success State */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 glass-overlay rounded-2xl flex items-center justify-center z-50 p-8"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="w-24 h-24 text-primary mx-auto mb-6" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold mb-3 terminal-glow"
                >
                  Account Created Successfully!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-muted-foreground mb-6"
                >
                  We've sent a verification email to <strong>{email}</strong>
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={() => (window.location.href = "/templates/email-verification")}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Verify Email
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign Up Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl border-glow">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-dark mb-4"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Shield className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold terminal-glow mb-2 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Create Account</h1>
            <p className="text-muted-foreground">Join us and start your journey today</p>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Step {currentStep === "account" ? 1 : currentStep === "profile" ? 2 : 3} of 3
              </span>
              <span className="text-sm text-muted-foreground">{stepProgress[currentStep]}%</span>
            </div>
            <Progress value={stepProgress[currentStep]} className="h-2" />
            <div className="flex justify-between mt-3">
              {["account", "profile", "preferences"].map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center gap-2 ${
                    currentStep === step ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      stepProgress[currentStep] > stepProgress[step as Step]
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step
                        ? "bg-primary/20 border-2 border-primary"
                        : "bg-muted"
                    }`}
                  >
                    {stepProgress[currentStep] > stepProgress[step as Step] ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs font-medium capitalize hidden sm:inline">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Account Step */}
            {currentStep === "account" && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Social Signup */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full glass-dark border-white/20 hover:border-primary/50 group"
                    onClick={() => handleSocialSignup("google")}
                    disabled={isLoading}
                  >
                    <Chrome className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                    Sign up with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full glass-dark border-white/20 hover:border-primary/50 group"
                    onClick={() => handleSocialSignup("github")}
                    disabled={isLoading}
                  >
                    <Github className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                    Sign up with GitHub
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Or with email
                  </span>
                  <Separator className="flex-1" />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setErrors((prev) => ({ ...prev, email: "" }))
                      }}
                      className={`pl-10 glass-dark ${errors.email ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setErrors((prev) => ({ ...prev, password: "" }))
                      }}
                      className={`pl-10 pr-10 glass-dark ${errors.password ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength */}
                  {password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Password strength</span>
                        <span className={`font-medium ${strengthInfo.color}`}>{strengthInfo.label}</span>
                      </div>
                      <Progress value={passwordStrength} className="h-1" />

                      {/* Requirements Checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
                        {passwordRequirements.map((req, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-1 text-xs ${
                              req.met ? "text-primary" : "text-muted-foreground"
                            }`}
                          >
                            {req.met ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                            {req.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                      }}
                      className={`pl-10 pr-10 glass-dark ${
                        errors.confirmPassword ? "border-destructive" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => {
                      setAcceptTerms(checked as boolean)
                      setErrors((prev) => ({ ...prev, terms: "" }))
                    }}
                  />
                  <label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.terms}
                  </p>
                )}
              </motion.div>
            )}

            {/* Profile Step */}
            {currentStep === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Profile Picture */}
                <div className="space-y-2">
                  <Label>Profile Picture (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full glass-dark flex items-center justify-center overflow-hidden">
                      {profilePicture ? (
                        <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="profilePicture"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="glass-dark"
                        onClick={() => document.getElementById("profilePicture")?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF (max. 2MB)</p>
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value)
                        setErrors((prev) => ({ ...prev, fullName: "" }))
                      }}
                      className={`pl-10 glass-dark ${errors.fullName ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      @
                    </span>
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
                        setUsername(value)
                        setErrors((prev) => ({ ...prev, username: "" }))
                        checkUsername(value)
                      }}
                      className={`pl-8 pr-10 glass-dark ${errors.username ? "border-destructive" : ""}`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameChecking && (
                        <motion.div
                          className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                      {!usernameChecking && usernameAvailable === true && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                      {!usernameChecking && usernameAvailable === false && (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  </div>
                  {usernameAvailable === true && (
                    <p className="text-xs text-primary flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Username is available
                    </p>
                  )}
                  {errors.username && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.username}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Preferences Step */}
            {currentStep === "preferences" && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Theme Selection */}
                <div className="space-y-3">
                  <Label>Preferred Theme</Label>
                  <RadioGroup value={theme} onValueChange={setTheme}>
                    <div className="grid grid-cols-2 gap-3">
                      {["terminal", "amber", "carbon", "light"].map((t) => (
                        <div key={t} className="relative">
                          <RadioGroupItem value={t} id={t} className="peer sr-only" />
                          <Label
                            htmlFor={t}
                            className={`flex items-center gap-3 glass-dark p-4 rounded-lg cursor-pointer border-2 transition-all ${
                              theme === t ? "border-primary bg-primary/5" : "border-transparent hover:border-primary/30"
                            }`}
                          >
                            <Palette className="w-4 h-4" />
                            <span className="capitalize">{t}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notification Preferences
                  </Label>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between glass-dark p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <label htmlFor="emailNotif" className="text-sm font-medium">
                          Email Notifications
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Receive updates and alerts via email
                        </p>
                      </div>
                      <Checkbox
                        id="emailNotif"
                        checked={emailNotifications}
                        onCheckedChange={(checked) => setEmailNotifications(checked as boolean)}
                      />
                    </div>

                    <div className="flex items-center justify-between glass-dark p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <label htmlFor="pushNotif" className="text-sm font-medium">
                          Push Notifications
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Get instant updates on your device
                        </p>
                      </div>
                      <Checkbox
                        id="pushNotif"
                        checked={pushNotifications}
                        onCheckedChange={(checked) => setPushNotifications(checked as boolean)}
                      />
                    </div>

                    <div className="flex items-center justify-between glass-dark p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <label htmlFor="marketing" className="text-sm font-medium">
                          Marketing Emails
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Receive news, tips, and special offers
                        </p>
                      </div>
                      <Checkbox
                        id="marketing"
                        checked={marketingEmails}
                        onCheckedChange={(checked) => setMarketingEmails(checked as boolean)}
                      />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="glass-dark p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Account Summary
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Email: {email}</p>
                    <p>Name: {fullName}</p>
                    <p>Username: @{username}</p>
                    <p>Theme: {theme}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep !== "account" && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="glass-dark border-white/20"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}

            {currentStep !== "preferences" ? (
              <Button onClick={handleNext} className="flex-1 bg-primary hover:bg-primary/90">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-primary hover:bg-primary/90 group relative overflow-hidden"
                disabled={isLoading}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: isLoading ? "100%" : "-100%" }}
                  transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                />
                <span className="relative flex items-center">
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </>
                  )}
                </span>
              </Button>
            )}
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/templates/login" className="text-primary hover:underline font-medium">
              Sign in
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

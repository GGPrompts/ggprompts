"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Shield,
  Clock,
  RefreshCw,
  KeyRound,
  Check,
  X,
  Sparkles,
  Info,
} from "lucide-react"
import { Button, Input, Label, Badge, Progress, Separator } from "@ggprompts/ui"

type ResetState = "request" | "sent" | "reset"

export default function PasswordResetPage() {
  const [state, setState] = useState<ResetState>("request")
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(600) // 10 minutes in seconds

  // Timer for link expiration
  useEffect(() => {
    if (state === "sent" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [state, timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

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

  const passwordStrength = calculatePasswordStrength(newPassword)

  const getStrengthLabel = (strength: number) => {
    if (strength < 30) return { label: "Weak", color: "text-destructive" }
    if (strength < 60) return { label: "Fair", color: "text-yellow-500" }
    if (strength < 80) return { label: "Good", color: "text-blue-500" }
    return { label: "Strong", color: "text-primary" }
  }

  const strengthInfo = getStrengthLabel(passwordStrength)

  // Password requirements
  const passwordRequirements = [
    { label: "At least 8 characters", met: newPassword.length >= 8 },
    { label: "Contains uppercase", met: /[A-Z]/.test(newPassword) },
    { label: "Contains lowercase", met: /[a-z]/.test(newPassword) },
    { label: "Contains number", met: /[0-9]/.test(newPassword) },
    { label: "Contains special char", met: /[^a-zA-Z0-9]/.test(newPassword) },
  ]

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!email) {
      setErrors({ email: "Email is required" })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Please enter a valid email address" })
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setState("sent")
    setTimeRemaining(600)
  }

  const handleResendEmail = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setTimeRemaining(600)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: Record<string, string> = {}

    if (!newPassword) {
      newErrors.newPassword = "Password is required"
    } else if (passwordStrength < 60) {
      newErrors.newPassword = "Please choose a stronger password"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSuccess(true)
    setIsLoading(false)

    setTimeout(() => {
      window.location.href = "/templates/login"
    }, 2500)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
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
                  <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-4" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold mb-2 terminal-glow"
                >
                  Password Reset Successfully!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-muted-foreground"
                >
                  Redirecting to login...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl border-glow">
          <AnimatePresence mode="wait">
            {/* Request State */}
            {state === "request" && (
              <motion.div
                key="request"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-dark mb-4"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <KeyRound className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h1 className="text-3xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow mb-2">Reset Password</h1>
                  <p className="text-muted-foreground">
                    Enter your email and we'll send you a reset link
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleRequestReset} className="space-y-5">
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
                          setErrors({})
                        }}
                        className={`pl-10 glass-dark ${errors.email ? "border-destructive" : ""}`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Security Tips */}
                  <div className="glass-dark p-4 rounded-lg space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Info className="w-4 h-4 text-primary" />
                      Security Tips
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
                      <li>The reset link will expire in 10 minutes</li>
                      <li>Check your spam folder if you don't see the email</li>
                      <li>Only request a reset from a trusted device</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 group relative overflow-hidden"
                    disabled={isLoading}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: isLoading ? "100%" : "-100%" }}
                      transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                    />
                    <span className="relative flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Reset Link
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </Button>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                  <a
                    href="/templates/login"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </a>
                </div>
              </motion.div>
            )}

            {/* Sent State */}
            {state === "sent" && (
              <motion.div
                key="sent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-dark mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  >
                    <Mail className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h1 className="text-3xl font-bold terminal-glow mb-2">Check Your Email</h1>
                  <p className="text-muted-foreground">
                    We've sent a password reset link to
                  </p>
                  <p className="text-primary font-medium mt-1">{email}</p>
                </div>

                {/* Instructions */}
                <div className="space-y-4 mb-6">
                  <div className="glass-dark p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-primary">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">Check your inbox</p>
                        <p className="text-xs text-muted-foreground">
                          Look for an email from our security team
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-dark p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-primary">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">Click the reset link</p>
                        <p className="text-xs text-muted-foreground">
                          This will take you to a secure page to set your new password
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-dark p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-primary">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">Create a new password</p>
                        <p className="text-xs text-muted-foreground">
                          Choose a strong password that you haven't used before
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Link Expiration Timer */}
                <div className="glass-dark p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Link expires in</span>
                    </div>
                    <Badge variant={timeRemaining < 120 ? "destructive" : "secondary"} className="glass">
                      {formatTime(timeRemaining)}
                    </Badge>
                  </div>
                  <Progress
                    value={(timeRemaining / 600) * 100}
                    className="h-1"
                  />
                </div>

                {/* Resend / Demo Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full glass-dark border-white/20 hover:border-primary/50"
                    onClick={handleResendEmail}
                    disabled={isLoading || timeRemaining < 540}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    {timeRemaining < 540 ? `Resend available in ${600 - timeRemaining}s` : "Resend Email"}
                  </Button>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => setState("reset")}
                  >
                    Demo: Skip to Reset
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Spam Notice */}
                <div className="mt-6 glass-dark p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground text-center">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    Didn't receive the email? Check your spam folder or{" "}
                    <button className="text-primary hover:underline" onClick={handleResendEmail}>
                      contact support
                    </button>
                  </p>
                </div>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                  <a
                    href="/templates/login"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </a>
                </div>
              </motion.div>
            )}

            {/* Reset State */}
            {state === "reset" && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-dark mb-4"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Lock className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h1 className="text-3xl font-bold terminal-glow mb-2">Create New Password</h1>
                  <p className="text-muted-foreground">
                    Choose a strong password to secure your account
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleResetPassword} className="space-y-5">
                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value)
                          const { newPassword, ...rest } = errors
                          setErrors(rest)
                        }}
                        className={`pl-10 pr-10 glass-dark ${errors.newPassword ? "border-destructive" : ""}`}
                        disabled={isLoading}
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
                    {newPassword && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Password strength</span>
                          <span className={`font-medium ${strengthInfo.color}`}>{strengthInfo.label}</span>
                        </div>
                        <Progress value={passwordStrength} className="h-1" />

                        {/* Requirements Grid */}
                        <div className="grid grid-cols-2 gap-1 mt-2">
                          {passwordRequirements.map((req, index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-1 text-xs ${
                                req.met ? "text-primary" : "text-muted-foreground"
                              }`}
                            >
                              {req.met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                              {req.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {errors.newPassword && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          const { confirmPassword, ...rest } = errors
                          setErrors(rest)
                        }}
                        className={`pl-10 pr-10 glass-dark ${
                          errors.confirmPassword ? "border-destructive" : ""
                        }`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {confirmPassword && newPassword === confirmPassword && (
                      <p className="text-xs text-primary flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Passwords match
                      </p>
                    )}

                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Security Notice */}
                  <div className="glass-dark p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">Security Recommendations</p>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
                          <li>Use a unique password not used on other sites</li>
                          <li>Include a mix of letters, numbers, and symbols</li>
                          <li>Avoid personal information like names or dates</li>
                          <li>Consider using a password manager</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 group relative overflow-hidden"
                    disabled={isLoading}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: isLoading ? "100%" : "-100%" }}
                      transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                    />
                    <span className="relative flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          Reset Password
                          <CheckCircle2 className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </span>
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

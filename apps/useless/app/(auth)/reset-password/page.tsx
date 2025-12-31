"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Check,
  X,
  RefreshCw,
  Sparkles,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@ggprompts/ui"
import { Input } from "@ggprompts/ui"
import { Label } from "@ggprompts/ui"
import { Progress } from "@ggprompts/ui"
import { Badge } from "@ggprompts/ui"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [tokenError, setTokenError] = useState(false)

  // Check for token on mount
  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) {
      setTokenError(true)
    }
  }, [searchParams])

  // Floating particles animation
  const floatingParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }))

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
    if (strength < 30) return { label: "Weak (like your excuses)", color: "text-destructive" }
    if (strength < 60) return { label: "Fair (we've seen worse)", color: "text-yellow-500" }
    if (strength < 80) return { label: "Good (gold star for you)", color: "text-blue-500" }
    return { label: "Strong (we're impressed!)", color: "text-primary" }
  }

  const strengthInfo = getStrengthLabel(passwordStrength)

  // Humorous password requirements
  const passwordRequirements = [
    {
      label: "At least 8 characters (like your excuses)",
      met: password.length >= 8
    },
    {
      label: "One uppercase (for SHOUTING)",
      met: /[A-Z]/.test(password)
    },
    {
      label: "One lowercase (for whispering)",
      met: /[a-z]/.test(password)
    },
    {
      label: "One number (math is hard, we know)",
      met: /[0-9]/.test(password)
    },
    {
      label: "One special character (!@#$%^&* - pick your favorite expletive)",
      met: /[^a-zA-Z0-9]/.test(password)
    },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!password) {
      newErrors.password = "Password is required (obviously)"
    } else if (passwordStrength < 60) {
      newErrors.password = "Please choose a stronger password. We believe in you. Sort of."
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password (we need to make sure you meant it)"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match. Take a deep breath and try again."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const token = searchParams.get("token")

      // Call Better Auth's reset-password endpoint directly
      const response = await authClient.$fetch("/reset-password", {
        method: "POST",
        body: {
          newPassword: password,
          token,
        },
      })

      if (response.error) {
        throw new Error(response.error.message || "Password reset failed")
      }

      setSuccess(true)
      toast.success("Password Reset!", {
        description: "Try not to forget this one. We believe in you.",
      })

      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong"

      // Check if it's a token error
      if (errorMessage.toLowerCase().includes("token") ||
          errorMessage.toLowerCase().includes("expired") ||
          errorMessage.toLowerCase().includes("invalid")) {
        setTokenError(true)
        toast.error("Link Expired", {
          description: "This link has expired, much like our patience. Request a new one.",
        })
      } else {
        setErrors({ general: errorMessage })
        toast.error("Oops!", { description: errorMessage })
      }
      setIsLoading(false)
    }
  }

  // Token Error State
  if (tokenError) {
    return (
      <>
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-destructive/20 blur-sm"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass rounded-2xl p-8 shadow-2xl border-glow text-center">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass-dark mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold terminal-glow mb-3"
            >
              Link Expired (Oops!)
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mb-6"
            >
              This reset link has expired, much like our patience. But hey, we're still here for you!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <Button
                onClick={() => router.push("/forgot-password")}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Request a New Link
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="w-full glass-dark border-white/20"
              >
                Back to Login
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-xs text-muted-foreground"
            >
              Reset links expire after 1 hour. Time flies when you're procrastinating!
            </motion.p>
          </div>
        </motion.div>
      </>
    )
  }

  return (
    <>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/20 blur-sm"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
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
              role="dialog"
              aria-label="Password reset successful"
              aria-modal="true"
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
                  Password Reset!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-muted-foreground mb-2"
                >
                  Try not to forget this one.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm text-primary font-medium mb-4"
                >
                  We believe in you. Sort of.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-xs text-muted-foreground"
                >
                  Redirecting to login...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Password Card */}
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
              <KeyRound className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-bold terminal-glow mb-2">New Password, New You</h1>
            <p className="text-muted-foreground text-sm">(Same Bad Decisions)</p>
            <Badge variant="secondary" className="mt-3 glass-dark">
              <Sparkles className="w-3 h-3 mr-1" />
              Fresh Start Loading...
            </Badge>
          </motion.div>

          {/* Error Alert */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="glass-dark border border-destructive/50 rounded-lg p-4 flex items-start gap-3" role="alert">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">{errors.general}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="password">New Password</Label>
              <p className="text-xs text-muted-foreground">Please make this one memorable. Or at least write it down somewhere.</p>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Something better than 'password123'"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, password: "" }))
                  }}
                  className={`pl-10 pr-10 glass-dark ${errors.password ? "border-destructive" : ""}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Password strength</span>
                    <span className={`font-medium ${strengthInfo.color}`}>{strengthInfo.label}</span>
                  </div>
                  <Progress value={passwordStrength} className="h-1" />
                </motion.div>
              )}

              {errors.password && (
                <p className="text-xs text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {errors.password}
                </p>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Type it again (we're double-checking)"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                  }}
                  className={`pl-10 pr-10 glass-dark ${errors.confirmPassword ? "border-destructive" : ""}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  aria-pressed={showConfirmPassword}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {errors.confirmPassword}
                </p>
              )}
            </motion.div>

            {/* Password Requirements Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-dark rounded-lg p-4 space-y-2"
            >
              <p className="text-sm font-medium text-primary mb-2">Password Requirements</p>
              {passwordRequirements.map((req, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className={`flex items-center gap-2 text-xs ${
                    req.met ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {req.met ? (
                    <Check className="w-3 h-3 shrink-0" />
                  ) : (
                    <X className="w-3 h-3 shrink-0" />
                  )}
                  <span>{req.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
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
                      <KeyRound className="w-4 h-4 mr-2" />
                      Reset Password
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
          </form>

          {/* Back to Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-sm text-muted-foreground"
          >
            Remember your password?{" "}
            <a href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </a>
          </motion.div>
        </div>

        {/* Fun Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          <p>
            This time, maybe consider a password manager? Just a thought.
          </p>
        </motion.div>
      </motion.div>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md relative z-10">
        <div className="glass rounded-2xl p-8 shadow-2xl border-glow text-center">
          <motion.div
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

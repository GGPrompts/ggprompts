"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Shield,
  Check,
  X,
  Github,
} from "lucide-react"
import { Button } from "@ggprompts/ui"
import { Input } from "@ggprompts/ui"
import { Label } from "@ggprompts/ui"
import { Checkbox } from "@ggprompts/ui"
import { Progress } from "@ggprompts/ui"
import { signUp, signInWithGitHub } from "@/lib/auth-client"

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [isGitHubLoading, setIsGitHubLoading] = useState(false)

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      await signUp.email({
        email,
        password,
        name,
      })

      setSuccess(true)
      // Don't redirect immediately, let them see the success message
      setTimeout(() => {
        router.push("/products")
      }, 3000)
    } catch (error: any) {
      setErrors({ general: error?.message || "Sign up failed. Please try again." })
      setIsLoading(false)
    }
  }

  const handleGitHubSignUp = async () => {
    setIsGitHubLoading(true)
    setErrors({})
    try {
      await signInWithGitHub()
    } catch (error: any) {
      setErrors({ general: error?.message || "GitHub sign up failed. Please try again." })
      setIsGitHubLoading(false)
    }
  }

  return (
    <>
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
              aria-label="Account created successfully"
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
                  Welcome to Useless.io!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-muted-foreground mb-4"
                >
                  You've received <strong className="text-primary">$1,000 UselessBucks</strong> to spend on our totally real products!
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm text-muted-foreground"
                >
                  Redirecting to products...
                </motion.p>
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
            <h1 className="text-3xl font-bold terminal-glow mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join us and get $1,000 UselessBucks free!</p>
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
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setErrors((prev) => ({ ...prev, name: "" }))
                }}
                className={`glass-dark ${errors.name ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-xs text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {errors.name}
                </p>
              )}
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
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Password strength</span>
                    <span className={`font-medium ${strengthInfo.color}`}>{strengthInfo.label}</span>
                  </div>
                  <Progress value={passwordStrength} className="h-1" />

                  {/* Requirements Checklist */}
                  <div className="grid grid-cols-1 gap-1 mt-2">
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
                <p className="text-xs text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
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
            </div>

            {/* Terms */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => {
                    setAcceptTerms(checked as boolean)
                    setErrors((prev) => ({ ...prev, terms: "" }))
                  }}
                  disabled={isLoading}
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
                <p className="text-xs text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Submit Button */}
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
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background/50 backdrop-blur-sm px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* GitHub OAuth */}
          <Button
            type="button"
            variant="outline"
            className="w-full glass-dark border-white/20 hover:border-primary/50 hover:bg-primary/10 transition-all group"
            onClick={handleGitHubSignUp}
            disabled={isLoading || isGitHubLoading}
          >
            {isGitHubLoading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Connecting to GitHub...
              </>
            ) : (
              <>
                <Github className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Continue with GitHub
              </>
            )}
          </Button>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </a>
          </div>
        </div>
      </motion.div>
    </>
  )
}

"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Github,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getSupabase } from "@/lib/supabase/client"
import { signInWithEmail } from "@/lib/auth/actions"

// Google icon component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [success, setSuccess] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  // Check for OAuth error from callback
  useEffect(() => {
    const error = searchParams.get("error")
    if (error === "auth") {
      setErrors({ general: "Authentication failed. Please try again." })
    }
  }, [searchParams])

  // Validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    const result = await signInWithEmail(email, password)

    if (result.error) {
      setErrors({ general: result.error })
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push("/")
    }, 1500)
  }

  const handleOAuthLogin = async (provider: "github" | "google") => {
    setOauthLoading(provider)
    const supabase = getSupabase()

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setErrors({ general: error.message })
      setOauthLoading(null)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />

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
              className="absolute inset-0 glass-overlay rounded-2xl flex items-center justify-center z-50"
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
                  className="text-2xl font-bold mb-2"
                >
                  Welcome Back!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-muted-foreground"
                >
                  Redirecting to your dashboard...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl border-glow">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-dark mb-4"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Shield className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold terminal-glow mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
            <Badge variant="outline" className="mt-3 glass-dark text-secondary border-secondary/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Secure Authentication
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
                <div className="glass-dark border border-destructive/50 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">{errors.general}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Login Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 mb-6"
          >
            <Button
              variant="outline"
              className="w-full glass-dark border-border hover:border-primary/50 transition-all group"
              onClick={() => handleOAuthLogin("google")}
              disabled={isLoading || oauthLoading !== null}
            >
              {oauthLoading === "google" ? (
                <motion.div
                  className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <GoogleIcon className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
              )}
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full glass-dark border-border hover:border-primary/50 transition-all group"
              onClick={() => handleOAuthLogin("github")}
              disabled={isLoading || oauthLoading !== null}
            >
              {oauthLoading === "github" ? (
                <motion.div
                  className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Github className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
              )}
              Continue with GitHub
            </Button>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 mb-6"
          >
            <Separator className="flex-1 bg-border/50" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Or continue with email
            </span>
            <Separator className="flex-1 bg-border/50" />
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  className={`pl-10 glass-dark border-border focus:border-primary/50 transition-all ${
                    errors.email ? "border-destructive/50 focus:border-destructive" : ""
                  }`}
                  disabled={isLoading || oauthLoading !== null}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  className={`pl-10 pr-10 glass-dark border-border focus:border-primary/50 transition-all ${
                    errors.password ? "border-destructive/50 focus:border-destructive" : ""
                  }`}
                  disabled={isLoading || oauthLoading !== null}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading || oauthLoading !== null}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading || oauthLoading !== null}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-sm text-primary hover:underline transition-all"
              >
                Forgot password?
              </a>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group relative overflow-hidden"
                disabled={isLoading || oauthLoading !== null}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent"
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
          </form>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="text-primary hover:underline font-medium transition-all"
              >
                Sign up for free
              </a>
            </p>
          </motion.div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 pt-6 border-t border-border/30"
          >
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Zap className="w-3 h-3" />
              <span>Protected by 256-bit SSL encryption</span>
            </div>
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          <p>
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Loading fallback for Suspense
function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass rounded-2xl p-8 animate-pulse">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-muted mb-4" />
          <div className="h-8 w-48 bg-muted rounded mb-2" />
          <div className="h-4 w-64 bg-muted rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}

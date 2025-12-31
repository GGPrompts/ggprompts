"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Brain,
  Lightbulb,
  Send,
} from "lucide-react"
import { Button } from "@ggprompts/ui"
import { Input } from "@ggprompts/ui"
import { Label } from "@ggprompts/ui"
import { Badge } from "@ggprompts/ui"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({})
  const [success, setSuccess] = useState(false)

  // Floating particles animation
  const floatingParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }))

  // Ridiculous security tips
  const securityTips = [
    "Pro tip: 'password123' is not secure. Neither is 'password124'.",
    "Have you tried turning your brain off and on again?",
    "Writing passwords on sticky notes is fine. Just make them invisible sticky notes.",
    "Your password should be as memorable as that embarrassing thing from 8th grade.",
  ]

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!email) {
      setErrors({ email: "Email is required (we can't read your mind... yet)" })
      return
    }

    if (!validateEmail(email)) {
      setErrors({ email: "That doesn't look like an email. Nice try though." })
      return
    }

    setIsLoading(true)
    try {
      // Call Better Auth's forget-password endpoint directly
      const response = await authClient.$fetch("/forget-password", {
        method: "POST",
        body: {
          email,
          redirectTo: "/reset-password",
        },
      })

      if (response.error) {
        // For security, we don't reveal if the email exists
        // Better Auth handles this by not exposing user enumeration
        console.error("[ForgotPassword]", response.error)
      }

      // Always show success to prevent email enumeration
      setSuccess(true)
      toast.success("Reset link sent!", {
        description: "Check your inbox. Or spam. Or that folder you forgot about.",
      })
    } catch (error: unknown) {
      // Even on error, show success to prevent email enumeration
      console.error("[ForgotPassword]", error)
      setSuccess(true)
      toast.success("Reset link sent!", {
        description: "Check your inbox. Or spam. Or that folder you forgot about.",
      })
    } finally {
      setIsLoading(false)
    }
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
              aria-label="Reset email sent"
              aria-modal="true"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Send className="w-20 h-20 text-primary mx-auto mb-4" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold mb-3 terminal-glow"
                >
                  Check Your Inbox!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-muted-foreground mb-4"
                >
                  If that email exists in our system, we've sent something.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm text-muted-foreground"
                >
                  Check your inbox, spam, promotions, that folder you forgot about...
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6"
                >
                  <a
                    href="/login"
                    className="text-primary hover:underline font-medium text-sm"
                  >
                    Back to Login
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forgot Password Card */}
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
              <Brain className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold terminal-glow mb-2">Memory Problems?</h1>
            <p className="text-muted-foreground">Don't worry, we won't judge. Much.</p>
            <Badge variant="secondary" className="mt-3 glass-dark">
              <KeyRound className="w-3 h-3 mr-1" />
              Password Recovery
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
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
                  placeholder="the-email-you-hopefully-remember@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  className={`pl-10 glass-dark border-white/20 focus:border-primary/50 transition-all ${
                    errors.email ? "border-destructive/50 focus:border-destructive" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-destructive flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-3 h-3" aria-hidden="true" />
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Ridiculous Security Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-dark rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Lightbulb className="w-4 h-4" />
                <span>Helpful Security Tips</span>
              </div>
              <ul className="space-y-2">
                {securityTips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-xs text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-primary mt-0.5">*</span>
                    {tip}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group relative overflow-hidden"
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
                      Sending Recovery Email...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Reset Link
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
            className="mt-6 text-center"
          >
            <a
              href="/login"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Wait, I remember now! Back to Login
            </a>
          </motion.div>

          {/* Fun Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 pt-6 border-t border-border/30"
          >
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3" />
              <span>We promise not to laugh at your password habits</span>
            </div>
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          <p>
            Still having trouble? Maybe try that password manager you've been meaning to set up.
          </p>
        </motion.div>
      </motion.div>
    </>
  )
}

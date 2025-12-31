"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Trophy,
  Coffee,
  Zap,
  AlertTriangle,
  PartyPopper,
} from "lucide-react"
import { Button } from "@ggprompts/ui"
import { Input } from "@ggprompts/ui"
import { Label } from "@ggprompts/ui"
import { Badge } from "@ggprompts/ui"
import { Progress } from "@ggprompts/ui"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

type PageState = "loading" | "pending" | "success" | "error"
type ErrorType = "expired" | "invalid" | "already_verified" | "unknown"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [pageState, setPageState] = useState<PageState>("loading")
  const [errorType, setErrorType] = useState<ErrorType>("unknown")
  const [email, setEmail] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [expiryTime, setExpiryTime] = useState(600) // 10 minutes in seconds
  const [verificationCount] = useState(Math.floor(Math.random() * 50000) + 12847)

  // Floating particles animation
  const floatingParticles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }))

  // Check URL params on mount
  useEffect(() => {
    const error = searchParams.get("error")
    const success = searchParams.get("success")

    // Simulate loading state
    const timer = setTimeout(() => {
      if (success === "true") {
        setPageState("success")
      } else if (error) {
        setPageState("error")
        if (error === "expired") {
          setErrorType("expired")
        } else if (error === "invalid") {
          setErrorType("invalid")
        } else if (error === "already_verified") {
          setErrorType("already_verified")
        } else {
          setErrorType("unknown")
        }
      } else {
        setPageState("pending")
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchParams])

  // Countdown timer for link expiration
  useEffect(() => {
    if (pageState !== "pending") return

    const timer = setInterval(() => {
      setExpiryTime((prev) => {
        if (prev <= 0) return 0
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [pageState])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [resendCooldown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Please enter your email address first. We're not mind readers... yet.")
      return
    }

    setIsResending(true)
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: "/verify-email?success=true",
      })
      toast.success("Verification email sent! Check your inbox (or spam, no judgment).")
      setResendCooldown(60)
      setExpiryTime(600)
    } catch {
      toast.error("Failed to send email. The internet gremlins are at it again.")
    } finally {
      setIsResending(false)
    }
  }

  const getErrorContent = () => {
    switch (errorType) {
      case "expired":
        return {
          title: "This Link Has Expired",
          subtitle: "Like milk. Or your attention span.",
          message: "Verification links are only valid for 10 minutes. We have trust issues, okay?",
          icon: Clock,
          iconColor: "text-yellow-500",
        }
      case "invalid":
        return {
          title: "Invalid Link Detected",
          subtitle: "Did you copy it wrong? We won't judge. (We will.)",
          message: "This verification link is invalid. Either it's been tampered with, or you've discovered a bug. Congrats?",
          icon: AlertTriangle,
          iconColor: "text-destructive",
        }
      case "already_verified":
        return {
          title: "Already Verified!",
          subtitle: "Overachiever.",
          message: "You've already verified this email. Clicking extra times doesn't give you bonus points. Though that would be a fun feature...",
          icon: CheckCircle2,
          iconColor: "text-primary",
        }
      default:
        return {
          title: "Something Went Wrong",
          subtitle: "Shocking, we know.",
          message: "An unknown error occurred. We blame cosmic rays. Or maybe JavaScript. Probably JavaScript.",
          icon: AlertCircle,
          iconColor: "text-destructive",
        }
    }
  }

  // Loading state
  if (pageState === "loading") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass rounded-2xl p-8 shadow-2xl border-glow text-center">
          <motion.div
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-xl font-bold terminal-glow mb-2">Checking Verification Status...</h2>
          <p className="text-muted-foreground text-sm">
            Please hold while we consult the digital oracle.
          </p>
        </div>
      </motion.div>
    )
  }

  // Success state
  if (pageState === "success") {
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass rounded-2xl p-8 shadow-2xl border-glow">
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-center mb-6"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <PartyPopper className="w-20 h-20 text-primary mx-auto" />
                </motion.div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold terminal-glow mb-2">
                You Did It!
              </h1>
              <p className="text-muted-foreground mb-1">(The Bar Was Low)</p>
              <Badge variant="secondary" className="mt-2 glass-dark">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Email Verified
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 space-y-4"
            >
              <div className="glass-dark rounded-lg p-4">
                <p className="text-sm text-center">
                  Your email is verified. You've proven you can click a link.{" "}
                  <span className="text-primary font-medium">Impressive.</span>
                </p>
              </div>

              <div className="glass-dark rounded-lg p-4 border border-primary/30">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">Welcome to useless.io!</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your <strong className="text-primary">$1,000 UselessBucks</strong> are waiting to be wasted on products that serve no purpose whatsoever.
                </p>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                <span>You are verification #{verificationCount.toLocaleString()}. </span>
                <span className="opacity-70">We're not sure why we're counting.</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6"
            >
              <Button
                onClick={() => router.push("/products")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                <span className="relative flex items-center justify-center">
                  Start Shopping (for Regrets)
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 pt-6 border-t border-border/30"
            >
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Coffee className="w-3 h-3" />
                <span>Time to make questionable purchase decisions</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </>
    )
  }

  // Error state
  if (pageState === "error") {
    const errorContent = getErrorContent()
    const ErrorIcon = errorContent.icon

    return (
      <>
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass rounded-2xl p-8 shadow-2xl border-glow">
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-center mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ErrorIcon className={`w-20 h-20 mx-auto ${errorContent.iconColor}`} />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold terminal-glow mb-1">
                {errorContent.title}
              </h1>
              <p className="text-muted-foreground text-sm">
                {errorContent.subtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6"
            >
              <div className="glass-dark rounded-lg p-4 border border-destructive/20">
                <p className="text-sm text-center text-muted-foreground">
                  {errorContent.message}
                </p>
              </div>
            </motion.div>

            {/* Request New Link Form */}
            {errorType !== "already_verified" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 glass-dark border-white/20 focus:border-primary/50 transition-all"
                      disabled={isResending}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleResendEmail}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  disabled={isResending || resendCooldown > 0}
                >
                  {isResending ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      Wait {resendCooldown}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Request New Link
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Already Verified - Go to Login */}
            {errorType === "already_verified" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6"
              >
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group"
                >
                  <span className="flex items-center justify-center">
                    Go to Login
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 pt-6 border-t border-border/30 text-center"
            >
              <a
                href="/login"
                className="text-sm text-primary hover:underline"
              >
                Back to Login
              </a>
            </motion.div>
          </div>
        </motion.div>
      </>
    )
  }

  // Pending state (default)
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
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
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Mail className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold terminal-glow mb-2">
              Waiting for Proof of Life
            </h1>
            <p className="text-muted-foreground">
              We sent you an email. It's probably in your spam.
            </p>
            <p className="text-muted-foreground text-sm mt-1 opacity-70">
              Along with all your hopes and dreams.
            </p>
            <Badge variant="secondary" className="mt-3 glass-dark">
              <Clock className="w-3 h-3 mr-1" />
              Awaiting Verification
            </Badge>
          </motion.div>

          {/* Timer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="glass-dark rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Link expires in</span>
                <span className={`text-lg font-mono font-bold ${expiryTime < 60 ? "text-destructive" : "text-primary"}`}>
                  {formatTime(expiryTime)}
                </span>
              </div>
              <Progress value={(expiryTime / 600) * 100} className="h-1" />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {expiryTime < 60
                  ? "Tick tock... the clock is judging you."
                  : "No pressure, but also... pressure."}
              </p>
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3 mb-6"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Instructions (that you'll probably ignore)
            </h3>

            {[
              { step: 1, text: "Check your inbox (or that tab you've had open for 3 weeks)" },
              { step: 2, text: "Click the big shiny button in the email" },
              { step: 3, text: "Return here to bask in the glory of verification" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-3 glass-dark rounded-lg p-3"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {item.step}
                </div>
                <p className="text-sm">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Resend Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/50 backdrop-blur-sm px-2 text-muted-foreground">
                  Didn't get it?
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="resend-email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="resend-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 glass-dark border-white/20 focus:border-primary/50 transition-all"
                    disabled={isResending}
                  />
                </div>
              </div>

              <Button
                onClick={handleResendEmail}
                variant="outline"
                className="w-full glass-dark border-white/20 hover:border-primary/50 hover:bg-primary/10 transition-all"
                disabled={isResending || resendCooldown > 0}
              >
                {isResending ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Sending another one...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Patience, young one ({resendCooldown}s)
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    We'll send another. We've got nothing but time.
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Fun Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 pt-6 border-t border-border/30"
          >
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Zap className="w-3 h-3" />
              <span>Fun fact: {verificationCount.toLocaleString()} emails verified and counting</span>
            </div>
          </motion.div>

          {/* Back to Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-4 text-center"
          >
            <a
              href="/login"
              className="text-sm text-primary hover:underline"
            >
              Already verified? Sign in
            </a>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass rounded-2xl p-8 shadow-2xl border-glow text-center">
          <motion.div
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-xl font-bold terminal-glow mb-2">Loading...</h2>
          <p className="text-muted-foreground text-sm">
            Please hold while we consult the digital oracle.
          </p>
        </div>
      </motion.div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}

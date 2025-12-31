"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  ArrowRight,
  Shield,
  Sparkles,
  Edit,
  HelpCircle,
  Info,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

type VerificationState = "pending" | "verifying" | "success" | "error"

export default function EmailVerificationPage() {
  const [state, setState] = useState<VerificationState>("pending")
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [email, setEmail] = useState("user@example.com")
  const [isEditing, setIsEditing] = useState(false)
  const [newEmail, setNewEmail] = useState(email)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [autoVerifyProgress, setAutoVerifyProgress] = useState(0)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Timer for code expiration
  useEffect(() => {
    if (state === "pending" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [state, timeRemaining])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setCanResend(true)
    }
  }, [resendCooldown])

  // Auto-verify simulation
  useEffect(() => {
    if (state === "pending" && autoVerifyProgress < 100) {
      const timer = setInterval(() => {
        setAutoVerifyProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            return 100
          }
          return prev + 1
        })
      }, 50)
      return () => clearInterval(timer)
    }
  }, [state, autoVerifyProgress])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...verificationCode]
    newCode[index] = value.slice(-1)
    setVerificationCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newCode.every((digit) => digit !== "") && index === 5) {
      setTimeout(() => handleVerify(newCode), 300)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newCode = [...verificationCode]

    pastedData.split("").forEach((char, index) => {
      if (index < 6) newCode[index] = char
    })

    setVerificationCode(newCode)

    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus()
      setTimeout(() => handleVerify(newCode), 300)
    } else if (pastedData.length > 0) {
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
    }
  }

  const handleVerify = async (code?: string[]) => {
    const codeToVerify = code || verificationCode
    const codeString = codeToVerify.join("")

    if (codeString.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setState("verifying")
    setError("")
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate verification (123456 is the valid code)
    if (codeString === "123456" || Math.random() > 0.3) {
      setState("success")
      setTimeout(() => {
        window.location.href = "/templates/login"
      }, 3000)
    } else {
      setState("error")
      setError("Invalid verification code. Please try again.")
      setVerificationCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
      setTimeout(() => setState("pending"), 2000)
    }

    setIsLoading(false)
  }

  const handleResend = async () => {
    if (!canResend || resendCooldown > 0) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setTimeRemaining(300)
    setResendCooldown(60)
    setCanResend(false)
    setVerificationCode(["", "", "", "", "", ""])
    setError("")

    setIsLoading(false)
  }

  const handleEmailChange = async () => {
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setEmail(newEmail)
    setIsEditing(false)
    setTimeRemaining(300)
    setVerificationCode(["", "", "", "", "", ""])

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20 blur-sm"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <AnimatePresence mode="wait">
          {/* Success State */}
          {state === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-2xl p-8 shadow-2xl border-glow text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl glass-dark">
                  <CheckCircle2 className="w-16 h-16 text-primary" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold terminal-glow mb-3"
              >
                Email Verified!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-8"
              >
                Your email has been successfully verified. Welcome aboard!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-dark p-6 rounded-lg mb-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <p className="font-semibold">Account Activated</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  You now have full access to all features. Redirecting to dashboard...
                </p>
                <div className="mt-4">
                  <Progress value={100} className="h-1" />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Error State */}
          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl p-8 shadow-2xl border-glow"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-dark mb-4">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Verifying State */}
          {state === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl p-8 shadow-2xl border-glow text-center"
            >
              <div className="mb-6">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-dark"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Shield className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
              <h2 className="text-2xl font-bold terminal-glow mb-2">Verifying...</h2>
              <p className="text-muted-foreground mb-6">Please wait while we verify your code</p>
              <div className="max-w-xs mx-auto">
                <Progress value={66} className="h-2" />
              </div>
            </motion.div>
          )}

          {/* Pending State */}
          {state === "pending" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-2xl p-8 shadow-2xl border-glow"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-dark mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Mail className="w-8 h-8 text-primary" />
                </motion.div>
                <h1 className="text-3xl font-bold terminal-glow mb-2 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Verify Your Email</h1>
                <p className="text-muted-foreground mb-4">
                  We've sent a verification code to
                </p>

                {/* Email Display/Edit */}
                {!isEditing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className="glass-dark text-secondary border-secondary/30 text-base px-4 py-2">
                      <Mail className="w-4 h-4 mr-2" />
                      {email}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(true)
                        setNewEmail(email)
                      }}
                      className="glass-dark"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="glass-dark p-4 rounded-lg mt-3"
                  >
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="glass"
                        placeholder="Enter new email"
                      />
                      <Button size="sm" onClick={handleEmailChange} disabled={isLoading}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Auto-verify progress */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-dark p-4 rounded-lg mb-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Auto-checking for verification...</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{autoVerifyProgress}%</span>
                </div>
                <Progress value={autoVerifyProgress} className="h-1" />
              </motion.div>

              {/* Code Input */}
              <div className="space-y-4 mb-6">
                <Label className="text-center block">Enter 6-Digit Code</Label>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {verificationCode.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-12 h-14 text-center text-xl font-bold glass-dark ${
                        error ? "border-destructive animate-shake" : ""
                      }`}
                      disabled={isLoading}
                    />
                  ))}
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-destructive flex items-center justify-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Timer and Resend */}
              <div className="glass-dark p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Code expires in</span>
                  </div>
                  <Badge
                    variant={timeRemaining < 60 ? "destructive" : "secondary"}
                    className="glass"
                  >
                    {formatTime(timeRemaining)}
                  </Badge>
                </div>
                <Progress value={(timeRemaining / 300) * 100} className="h-1" />
              </div>

              {/* Resend Button */}
              <Button
                variant="outline"
                className="w-full glass-dark border-white/20 hover:border-primary/50 mb-6"
                onClick={handleResend}
                disabled={!canResend || resendCooldown > 0 || isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                {resendCooldown > 0
                  ? `Resend available in ${resendCooldown}s`
                  : "Resend Verification Email"}
              </Button>

              {/* Verify Button */}
              <Button
                onClick={() => handleVerify()}
                className="w-full bg-primary hover:bg-primary/90 group relative overflow-hidden mb-6"
                disabled={
                  isLoading || verificationCode.join("").length !== 6
                }
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
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Email
                      <CheckCircle2 className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </span>
              </Button>

              {/* Help Section */}
              <div className="space-y-3">
                <Separator />

                <div className="glass-dark p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm space-y-2">
                      <p className="font-medium">Didn't receive the email?</p>
                      <ul className="text-muted-foreground space-y-1 list-disc ml-4">
                        <li>Check your spam or junk folder</li>
                        <li>Make sure {email} is correct</li>
                        <li>Wait a few minutes and try resending</li>
                        <li>Check your email filters and blocklists</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="w-full glass-dark"
                  onClick={() => (window.location.href = "/support")}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-border/30">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  <span>Verification codes are valid for 5 minutes</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Sign Up */}
        {state === "pending" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-sm text-muted-foreground"
          >
            Wrong email?{" "}
            <a href="/templates/signup" className="text-primary hover:underline font-medium">
              Go back to sign up
            </a>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

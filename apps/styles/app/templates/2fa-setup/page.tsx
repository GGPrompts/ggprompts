"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Smartphone,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Key,
  Lock,
  Mail,
  MessageSquare,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Info,
  Sparkles,
  Trash2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type SetupStep = "choose" | "setup" | "verify" | "backup" | "success"

export default function TwoFactorAuthPage() {
  const [step, setStep] = useState<SetupStep>("choose")
  const [method, setMethod] = useState<"app" | "sms">("app")
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [showDisableConfirm, setShowDisableConfirm] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Mock data
  const secretKey = "JBSWY3DPEHPK3PXP"
  const backupCodes = [
    "8A3B-C9D2-E1F4",
    "2G5H-I6J7-K8L9",
    "M3N4-O5P6-Q7R8",
    "S9T1-U2V3-W4X5",
    "Y6Z7-A8B9-C1D2",
    "E3F4-G5H6-I7J8",
    "K9L1-M2N3-O4P5",
    "Q6R7-S8T9-U1V2",
  ]

  const devices = [
    { id: 1, name: "iPhone 14 Pro", location: "San Francisco, CA", lastUsed: "2 hours ago", current: true },
    { id: 2, name: "MacBook Pro", location: "San Francisco, CA", lastUsed: "1 day ago", current: false },
    { id: 3, name: "Chrome on Windows", location: "New York, NY", lastUsed: "3 days ago", current: false },
  ]

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...verificationCode]
    newCode[index] = value.slice(-1)
    setVerificationCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
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
    if (pastedData.length > 0) {
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
    }
  }

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerify = async () => {
    const code = verificationCode.join("")

    if (code.length !== 6) {
      setErrors({ code: "Please enter a valid 6-digit code" })
      return
    }

    setIsLoading(true)
    setErrors({})
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate verification
    if (code === "123456" || code.length === 6) {
      setStep("backup")
    } else {
      setErrors({ code: "Invalid code. Please try again." })
    }

    setIsLoading(false)
  }

  const handleSetupComplete = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStep("success")
    setIs2FAEnabled(true)
    setIsLoading(false)
  }

  const handleDisable2FA = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIs2FAEnabled(false)
    setShowDisableConfirm(false)
    setStep("choose")
    setIsLoading(false)
  }

  const downloadBackupCodes = () => {
    const content = `Two-Factor Authentication Backup Codes
Generated: ${new Date().toLocaleDateString()}

${backupCodes.join("\n")}

Keep these codes in a safe place. Each code can only be used once.`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "2fa-backup-codes.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
        className="w-full max-w-4xl relative z-10"
      >
        <div className="glass rounded-2xl p-8 shadow-2xl border-glow">
          <AnimatePresence mode="wait">
            {/* Choose Method */}
            {step === "choose" && (
              <motion.div
                key="choose"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-dark mb-4"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Shield className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h1 className="text-3xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow mb-2">
                    Two-Factor Authentication
                  </h1>
                  <p className="text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                  {is2FAEnabled && (
                    <Badge variant="outline" className="mt-3 glass-dark text-secondary border-secondary/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      2FA Enabled
                    </Badge>
                  )}
                </div>

                {!is2FAEnabled ? (
                  <>
                    <div className="glass-dark p-5 rounded-lg mb-6">
                      <div className="flex items-start gap-3 mb-4">
                        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium mb-2">Why enable 2FA?</p>
                          <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
                            <li>Protects your account even if your password is compromised</li>
                            <li>Prevents unauthorized access from unknown devices</li>
                            <li>Industry-standard security practice</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <Label>Choose your verification method</Label>
                      <RadioGroup value={method} onValueChange={(v) => setMethod(v as "app" | "sms")}>
                        <div className="space-y-3">
                          <div className="relative">
                            <RadioGroupItem value="app" id="app" className="peer sr-only" />
                            <Label
                              htmlFor="app"
                              className={`flex items-start gap-4 glass-dark p-5 rounded-lg cursor-pointer border-2 transition-all ${
                                method === "app"
                                  ? "border-primary bg-primary/5"
                                  : "border-transparent hover:border-primary/30"
                              }`}
                            >
                              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                <Smartphone className="w-6 h-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold mb-1">Authenticator App</p>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Use an app like Google Authenticator or Authy
                                </p>
                                <Badge variant="secondary" className="glass text-xs">
                                  <Check className="w-3 h-3 mr-1" />
                                  Recommended
                                </Badge>
                              </div>
                            </Label>
                          </div>

                          <div className="relative">
                            <RadioGroupItem value="sms" id="sms" className="peer sr-only" />
                            <Label
                              htmlFor="sms"
                              className={`flex items-start gap-4 glass-dark p-5 rounded-lg cursor-pointer border-2 transition-all ${
                                method === "sms"
                                  ? "border-primary bg-primary/5"
                                  : "border-transparent hover:border-primary/30"
                              }`}
                            >
                              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                                <MessageSquare className="w-6 h-6 text-secondary" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold mb-1">SMS Text Message</p>
                                <p className="text-sm text-muted-foreground">
                                  Receive codes via text message to your phone
                                </p>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button
                      onClick={() => setStep("setup")}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <Tabs defaultValue="status" className="w-full">
                    <TabsList className="glass-dark w-full">
                      <TabsTrigger value="status" className="flex-1">Status</TabsTrigger>
                      <TabsTrigger value="devices" className="flex-1">Devices</TabsTrigger>
                      <TabsTrigger value="backup" className="flex-1">Backup Codes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="status" className="space-y-4 mt-6">
                      <div className="glass-dark p-5 rounded-lg">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                              <Smartphone className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">Authenticator App</p>
                              <p className="text-sm text-muted-foreground">Active since Nov 15, 2024</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="glass">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Your account is protected with two-factor authentication using an authenticator app.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-dark border-destructive/50 text-destructive hover:bg-destructive/10"
                          onClick={() => setShowDisableConfirm(true)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Disable 2FA
                        </Button>
                      </div>

                      <AnimatePresence>
                        {showDisableConfirm && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass-dark border border-destructive/50 rounded-lg p-5"
                          >
                            <div className="flex items-start gap-3 mb-4">
                              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                              <div>
                                <p className="font-semibold mb-1">Disable Two-Factor Authentication?</p>
                                <p className="text-sm text-muted-foreground">
                                  This will make your account less secure. Are you sure you want to continue?
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDisableConfirm(false)}
                                className="glass-dark"
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={handleDisable2FA}
                                disabled={isLoading}
                              >
                                {isLoading ? "Disabling..." : "Yes, Disable 2FA"}
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </TabsContent>

                    <TabsContent value="devices" className="space-y-3 mt-6">
                      {devices.map((device) => (
                        <div key={device.id} className="glass-dark p-4 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Smartphone className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{device.name}</p>
                                  {device.current && (
                                    <Badge variant="secondary" className="text-xs">Current</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">{device.location}</p>
                                <p className="text-xs text-muted-foreground">Last used: {device.lastUsed}</p>
                              </div>
                            </div>
                            {!device.current && (
                              <Button variant="ghost" size="sm" className="text-destructive">
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="backup" className="space-y-4 mt-6">
                      <div className="glass-dark p-5 rounded-lg">
                        <div className="flex items-start gap-3 mb-4">
                          <Key className="w-5 h-5 text-primary shrink-0" />
                          <div>
                            <p className="font-semibold mb-1">Backup Codes</p>
                            <p className="text-sm text-muted-foreground">
                              Use these codes to access your account if you lose your device
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {backupCodes.slice(0, 4).map((code, index) => (
                            <div key={index} className="glass p-3 rounded font-mono text-sm text-center">
                              {code}
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="glass-dark"
                            onClick={downloadBackupCodes}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="glass-dark">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </motion.div>
            )}

            {/* Setup Step */}
            {step === "setup" && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-dark mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {method === "app" ? (
                      <QrCode className="w-8 h-8 text-primary" />
                    ) : (
                      <MessageSquare className="w-8 h-8 text-primary" />
                    )}
                  </motion.div>
                  <h2 className="text-2xl font-bold terminal-glow mb-2">
                    {method === "app" ? "Scan QR Code" : "Enter Phone Number"}
                  </h2>
                  <p className="text-muted-foreground">
                    {method === "app"
                      ? "Use your authenticator app to scan this code"
                      : "We'll send you a verification code"}
                  </p>
                </div>

                {method === "app" ? (
                  <div className="space-y-6">
                    {/* QR Code */}
                    <div className="flex justify-center">
                      <div className="glass-dark p-6 rounded-2xl">
                        <div className="w-64 h-64 bg-white rounded-xl flex items-center justify-center">
                          <div className="text-center p-4">
                            <QrCode className="w-32 h-32 mx-auto mb-2 text-gray-800" />
                            <p className="text-xs text-gray-600 font-mono">{secretKey}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="glass-dark p-5 rounded-lg space-y-4">
                      <p className="text-sm font-medium">Setup Instructions:</p>
                      <ol className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                            1
                          </span>
                          <span>Download an authenticator app like Google Authenticator or Authy</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                            2
                          </span>
                          <span>Scan the QR code with your authenticator app</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                            3
                          </span>
                          <span>Enter the 6-digit code from the app in the next step</span>
                        </li>
                      </ol>
                    </div>

                    {/* Manual Entry */}
                    <div className="glass-dark p-4 rounded-lg">
                      <p className="text-sm font-medium mb-3">Can't scan? Enter this key manually:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 glass p-3 rounded font-mono text-sm">{secretKey}</code>
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-dark shrink-0"
                          onClick={handleCopySecret}
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="pl-10 glass-dark"
                        />
                      </div>
                    </div>

                    <div className="glass-dark p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          Standard SMS rates may apply. Make sure you have access to this number.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setStep("choose")}
                    className="glass-dark"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep("verify")}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Verify Step */}
            {step === "verify" && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-dark mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Key className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h2 className="text-2xl font-bold terminal-glow mb-2">Enter Verification Code</h2>
                  <p className="text-muted-foreground">
                    {method === "app"
                      ? "Enter the 6-digit code from your authenticator app"
                      : `We sent a code to ${phoneNumber}`}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Code Input */}
                  <div className="space-y-2">
                    <Label className="text-center block">Verification Code</Label>
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
                            errors.code ? "border-destructive" : ""
                          }`}
                        />
                      ))}
                    </div>
                    {errors.code && (
                      <p className="text-xs text-destructive flex items-center justify-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.code}
                      </p>
                    )}
                  </div>

                  {method === "sms" && (
                    <div className="text-center">
                      <Button variant="ghost" size="sm" className="text-primary">
                        Resend Code
                      </Button>
                    </div>
                  )}

                  <Button
                    onClick={handleVerify}
                    className="w-full bg-primary hover:bg-primary/90 group relative overflow-hidden"
                    disabled={isLoading || verificationCode.join("").length !== 6}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: isLoading ? "100%" : "-100%" }}
                      transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                    />
                    <span className="relative">
                      {isLoading ? "Verifying..." : "Verify Code"}
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setStep("setup")}
                    className="w-full glass-dark"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Backup Codes Step */}
            {step === "backup" && (
              <motion.div
                key="backup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-dark mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Key className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h2 className="text-2xl font-bold terminal-glow mb-2">Save Backup Codes</h2>
                  <p className="text-muted-foreground">
                    Store these codes in a safe place to access your account if you lose your device
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="glass-dark p-6 rounded-lg">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {backupCodes.map((code, index) => (
                        <div
                          key={index}
                          className="glass p-4 rounded-lg font-mono text-center text-sm hover:bg-white/5 transition-colors"
                        >
                          {code}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 glass-dark"
                        onClick={downloadBackupCodes}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 glass-dark"
                        onClick={() => {
                          navigator.clipboard.writeText(backupCodes.join("\n"))
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2000)
                        }}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy All
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="glass-dark p-5 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                      <div className="text-sm space-y-2">
                        <p className="font-medium">Important:</p>
                        <ul className="text-muted-foreground space-y-1 list-disc ml-4">
                          <li>Each code can only be used once</li>
                          <li>Store them in a password manager or safe place</li>
                          <li>Don't share these codes with anyone</li>
                          <li>You can regenerate new codes anytime</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSetupComplete}
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
                      {isLoading ? "Completing Setup..." : "Complete Setup"}
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </span>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Success Step */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl glass-dark mb-6">
                    <CheckCircle2 className="w-16 h-16 text-primary" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold terminal-glow mb-3"
                >
                  2FA Enabled Successfully!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground mb-8"
                >
                  Your account is now protected with two-factor authentication
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-dark p-6 rounded-lg mb-8 max-w-md mx-auto"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <p className="font-semibold">What's Next?</p>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>You'll need your authenticator app when signing in</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Keep your backup codes in a safe place</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>You can manage 2FA settings anytime in your account</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <Button
                    onClick={() => setStep("choose")}
                    className="w-full max-w-xs bg-primary hover:bg-primary/90"
                  >
                    View Settings
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full max-w-xs glass-dark"
                    onClick={() => (window.location.href = "/templates/login")}
                  >
                    Return to Dashboard
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

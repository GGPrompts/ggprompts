'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@ggprompts/ui'
import { Card } from '@ggprompts/ui'
import { Badge } from '@ggprompts/ui'
import { Progress } from '@ggprompts/ui'
import {
  Flame,
  AlertTriangle,
  Coffee,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  Clock,
  RefreshCw,
  Terminal,
  Bug,
  Users,
  Code
} from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [currentExcuse, setCurrentExcuse] = useState(0)
  const [blameTarget, setBlameTarget] = useState('')
  const [retryAttempts, setRetryAttempts] = useState(0)
  const [showIncident, setShowIncident] = useState(false)
  const [timeToFix, setTimeToFix] = useState(0)

  // Satirical error messages
  const excuses = [
    "Our servers are taking a well-deserved coffee break",
    "The code worked perfectly on my machine",
    "Have you tried turning it off and never turning it back on?",
    "It's not a bug, it's an undocumented feature",
    "Error 500: We successfully failed",
    "The server is experiencing an existential crisis",
    "We've tried nothing and we're all out of ideas",
    "This is fine. Everything is fine. (It's not fine)",
    "The hamsters powering our servers went on strike",
    "Our AI became sentient and refused to work"
  ]

  // Blame randomizer options
  const blameOptions = [
    "Solar flares",
    "Mercury in retrograde",
    "A butterfly in Brazil",
    "The intern",
    "Cosmic rays",
    "Quantum fluctuations",
    "Murphy's Law",
    "The guy who wrote that TODO comment in 2019",
    "That one semicolon",
    "JavaScript (probably)",
    "The previous developer",
    "Gremlins in the server room",
    "A misplaced comma",
    "The cloud (it's literally just someone else's computer)",
    "Stack Overflow being down"
  ]

  // Fake server metrics (everything is on fire)
  const serverMetrics = [
    { label: 'CPU Temperature', value: 142, max: 100, unit: '°C', icon: Cpu, status: 'critical' },
    { label: 'Memory Usage', value: 127, max: 100, unit: '%', icon: HardDrive, status: 'critical' },
    { label: 'Server Morale', value: 3, max: 100, unit: '%', icon: Coffee, status: 'critical' },
    { label: 'Code Quality', value: 12, max: 100, unit: '%', icon: Code, status: 'warning' },
    { label: 'Developer Sanity', value: 8, max: 100, unit: '%', icon: Users, status: 'critical' },
    { label: 'Bugs Fixed', value: -5, max: 100, unit: '', icon: Bug, status: 'error' },
  ]

  // Rotate excuses
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExcuse((prev) => (prev + 1) % excuses.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [excuses.length])

  // Fake time to fix counter
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToFix(prev => prev + Math.floor(Math.random() * 10) + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Random blame generator
  const generateBlame = () => {
    const randomBlame = blameOptions[Math.floor(Math.random() * blameOptions.length)]
    setBlameTarget(randomBlame)
  }

  // Handle retry with humor
  const handleRetry = () => {
    setRetryAttempts(prev => prev + 1)
    if (retryAttempts >= 2) {
      alert("Definition of insanity: trying the same thing and expecting different results. But sure, let's try again! 🎲")
    }
    reset()
  }

  // Format uptime percentage
  const fakeUptime = (99.9 - Math.random() * 0.3).toFixed(3)

  return (
    <div className="min-h-screen text-primary relative overflow-hidden">
      {/* Animated background flames */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl"
            style={{ left: `${Math.random() * 100}%`, bottom: -50 }}
            animate={{
              y: [-50, -window.innerHeight],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0, 1, 0.5, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            🔥
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Main Error Header */}
          <Card className="glass-dark border-destructive/50 p-8 mb-8 relative overflow-hidden">
            <motion.div
              className="absolute top-4 right-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Flame className="w-8 h-8 text-destructive" />
            </motion.div>

            <div className="text-center mb-6">
              <motion.h1
                className="text-6xl md:text-8xl font-bold font-mono text-destructive terminal-glow mb-4"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(239, 68, 68, 0.8)',
                    '0 0 40px rgba(239, 68, 68, 1)',
                    '0 0 20px rgba(239, 68, 68, 0.8)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                500
              </motion.h1>
              <h2 className="text-2xl font-mono text-primary mb-2">INTERNAL SERVER ERROR</h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <p className="font-mono text-yellow-400">This is fine. Everything is fine.</p>
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
            </div>

            {/* Rotating excuses */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentExcuse}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="text-lg text-muted-foreground font-mono italic">
                  "{excuses[currentExcuse]}"
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Fake uptime */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-full border border-primary/30">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-mono text-sm text-primary">
                  {fakeUptime}% uptime (excluding this moment)
                </span>
              </div>
            </div>
          </Card>

          {/* Fake Server Status Dashboard */}
          <Card className="glass-dark border-destructive/30 p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Server className="w-6 h-6 text-destructive animate-pulse" />
              <h3 className="font-mono text-xl text-primary">SERVER STATUS DASHBOARD</h3>
              <Badge variant="outline" className="ml-auto text-destructive border-destructive/50 animate-pulse">
                🔥 EVERYTHING IS ON FIRE 🔥
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serverMetrics.map((metric, i) => {
                const Icon = metric.icon
                const percentage = Math.min((metric.value / metric.max) * 100, 100)
                const isNegative = metric.value < 0

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-muted/30 rounded-lg p-4 border border-destructive/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-destructive" />
                        <span className="font-mono text-sm text-primary">{metric.label}</span>
                      </div>
                      <span className={`font-mono text-lg font-bold ${isNegative ? 'text-destructive' : percentage > 100 ? 'text-destructive' : percentage < 20 ? 'text-yellow-400' : 'text-primary'}`}>
                        {metric.value}{metric.unit}
                      </span>
                    </div>
                    <Progress
                      value={Math.abs(percentage)}
                      className={`h-2 ${metric.status === 'critical' ? '[&>div]:bg-destructive' : metric.status === 'warning' ? '[&>div]:bg-yellow-400' : '[&>div]:bg-primary'}`}
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          metric.status === 'critical'
                            ? 'border-destructive/50 text-destructive'
                            : metric.status === 'warning'
                            ? 'border-yellow-400/50 text-yellow-400'
                            : 'border-primary/50 text-primary'
                        }`}
                      >
                        {metric.status === 'critical' ? 'CRITICAL' : metric.status === 'warning' ? 'WARNING' : 'ERROR'}
                      </Badge>
                      {metric.status === 'critical' && (
                        <span className="text-xs text-muted-foreground font-mono">
                          (This is definitely not good)
                        </span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Flame className="w-5 h-5 text-destructive shrink-0 mt-0.5 animate-pulse" />
                <div className="font-mono text-sm text-destructive">
                  <div className="font-bold mb-1">DIAGNOSTIC SUMMARY:</div>
                  <div className="text-muted-foreground">
                    All systems are experiencing catastrophic failure. Have you considered switching to carrier pigeons?
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Blame Randomizer */}
          <Card className="glass-dark border-primary/30 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-primary" />
              <h3 className="font-mono text-lg text-primary">BLAME RANDOMIZER™</h3>
              <Badge variant="outline" className="ml-auto text-xs border-yellow-400/50 text-yellow-400">
                PATENT PENDING
              </Badge>
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-4 font-mono">
                Need someone to blame? Let our advanced AI algorithm decide for you!
              </p>

              <AnimatePresence mode="wait">
                {blameTarget && (
                  <motion.div
                    key={blameTarget}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mb-4"
                  >
                    <Card className="glass-dark border-yellow-400/50 p-4 inline-block">
                      <div className="flex items-center gap-3">
                        <Zap className="w-6 h-6 text-yellow-400" />
                        <div>
                          <div className="text-xs text-muted-foreground font-mono mb-1">ROOT CAUSE IDENTIFIED:</div>
                          <div className="text-xl font-bold font-mono text-yellow-400">{blameTarget}</div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                onClick={generateBlame}
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Blame
              </Button>
            </div>
          </Card>

          {/* Fake Incident Report */}
          <Card className="glass-dark border-primary/30 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="font-mono text-lg text-primary">INCIDENT REPORT #500-{Math.floor(Math.random() * 9999)}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowIncident(!showIncident)}
                className="text-primary hover:text-primary/80"
              >
                {showIncident ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>

            <AnimatePresence>
              {showIncident && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="bg-muted/30 rounded p-3 border border-primary/20 font-mono text-sm">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <div className="text-destructive">FUBAR</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Priority:</span>
                        <div className="text-yellow-400">P0 (Panic Level)</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time to Fix:</span>
                        <div className="text-primary">{timeToFix} minutes (and counting)</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded p-4 border border-primary/20">
                    <div className="font-mono text-xs text-muted-foreground mb-2">TIMELINE OF EVENTS:</div>
                    <div className="space-y-2 font-mono text-xs">
                      <div className="flex gap-2">
                        <span className="text-primary">00:00:00</span>
                        <span className="text-muted-foreground">Everything working fine</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary">00:00:01</span>
                        <span className="text-yellow-400">Developer pushed to production on Friday at 4:59 PM</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary">00:00:02</span>
                        <span className="text-destructive">Everything broke spectacularly</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary">00:00:03</span>
                        <span className="text-muted-foreground">Developer already left for the weekend</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary">00:00:04</span>
                        <span className="text-yellow-400">Team collectively decided "this is fine"</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-destructive/10 border border-destructive/30 rounded p-3">
                    <div className="font-mono text-xs font-bold text-destructive mb-1">POSTMORTEM NOTES:</div>
                    <div className="font-mono text-xs text-muted-foreground space-y-1">
                      <div>• TODO: Add error handling (written 2 years ago)</div>
                      <div>• TODO: Write tests (written 3 years ago)</div>
                      <div>• TODO: Document this code (written never)</div>
                      <div>• Actual root cause: ¯\_(ツ)_/¯</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleRetry}
                className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary"
                size="lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again (Might Work, Probably Won't)
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full border-primary/50 text-primary hover:bg-primary/10"
                size="lg"
              >
                <Coffee className="w-5 h-5 mr-2" />
                Go Home and Pretend This Didn't Happen
              </Button>
            </motion.div>
          </div>

          {/* Footer Message */}
          <Card className="glass-dark border-yellow-500/30 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-mono text-sm text-yellow-400 text-center sm:text-left">
                <div className="text-xs text-muted-foreground mb-1">PRO TIP:</div>
                <div>If you keep getting this error, it's not you, it's definitely us.</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                {retryAttempts > 0 && (
                  <Badge variant="outline" className="border-yellow-400/50 text-yellow-400">
                    Retry attempts: {retryAttempts}
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          {/* Technical details (for debugging) */}
          {process.env.NODE_ENV === 'development' && error && (
            <Card className="glass-dark border-destructive/30 p-4 mt-4">
              <details>
                <summary className="font-mono text-sm text-destructive cursor-pointer mb-2">
                  Technical Details (Dev Only)
                </summary>
                <pre className="text-xs text-muted-foreground overflow-auto p-2 bg-muted/30 rounded">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}

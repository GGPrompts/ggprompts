'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Terminal } from 'lucide-react'
import { Button } from '@ggprompts/ui'

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
]

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'CRITICAL' | 'SUCCESS'

interface LogEntry {
  id: number
  level: LogLevel
  message: string
  timestamp: string
}

const INITIAL_LOGS: Omit<LogEntry, 'id' | 'timestamp'>[] = [
  { level: 'INFO', message: 'Initializing uselessness...' },
  { level: 'INFO', message: 'Loading fake inventory database...' },
  { level: 'SUCCESS', message: 'Connected to /dev/null successfully' },
  { level: 'WARN', message: 'Product quality too high, reducing...' },
  { level: 'DEBUG', message: 'User appears to be sentient' },
  { level: 'INFO', message: 'Checking UselessBucks balance...' },
  { level: 'WARN', message: 'Warning: User may actually buy something' },
  { level: 'ERROR', message: 'Success detected. Reverting...' },
  { level: 'DEBUG', message: 'Generating artificial scarcity...' },
  { level: 'CRITICAL', message: 'Money is fake. This is fine.' },
  { level: 'INFO', message: 'Validating non-existent shipping addresses...' },
  { level: 'WARN', message: 'Self-Aware Toaster is judging you' },
  { level: 'DEBUG', message: 'WiFi Rock signal strength: undefined' },
  { level: 'ERROR', message: 'Productivity detected in sector 7. Deploying countermeasures.' },
  { level: 'SUCCESS', message: 'Developer mode activated. You are now 40% more useless.' },
]

const COMMAND_RESPONSES = [
  "Command not recognized. Have you tried turning it off and on again?",
  "Error 418: I'm a teapot. Please try a valid command.",
  "Processing... Processing... Just kidding, nothing happened.",
  "Nice try. The computer says no.",
  "That command has been deprecated since before you were born.",
  "Invalid command. But we appreciate your enthusiasm.",
  "Error: Too much competence detected. Access denied.",
  "Command executed successfully! (This is a lie)",
  "Syntax error on line 1. And 2. And all of them.",
  "Permission denied. Try asking nicely.",
]

function getTimestamp(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function getLevelColor(level: LogLevel): string {
  switch (level) {
    case 'INFO':
      return 'text-cyan-400'
    case 'WARN':
      return 'text-yellow-400'
    case 'ERROR':
      return 'text-red-400'
    case 'DEBUG':
      return 'text-purple-400'
    case 'CRITICAL':
      return 'text-red-500 font-bold animate-pulse'
    case 'SUCCESS':
      return 'text-green-400'
    default:
      return 'text-foreground'
  }
}

export function KonamiCode() {
  const [isOpen, setIsOpen] = useState(false)
  const [keySequence, setKeySequence] = useState<string[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [commandInput, setCommandInput] = useState('')
  const logContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const logIdRef = useRef(0)

  // Handle keydown for Konami code detection
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // ESC to close
      if (event.code === 'Escape' && isOpen) {
        setIsOpen(false)
        return
      }

      // Don't track keys if modal is open and user is typing
      if (isOpen && document.activeElement === inputRef.current) {
        return
      }

      const newSequence = [...keySequence, event.code].slice(-KONAMI_CODE.length)
      setKeySequence(newSequence)

      // Check if the sequence matches the Konami code
      if (newSequence.length === KONAMI_CODE.length) {
        const isMatch = newSequence.every((key, index) => key === KONAMI_CODE[index])
        if (isMatch) {
          setIsOpen(true)
          setKeySequence([])
        }
      }
    },
    [keySequence, isOpen]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Initialize logs when modal opens
  useEffect(() => {
    if (isOpen) {
      setLogs([])
      logIdRef.current = 0

      // Add logs with a staggered delay
      INITIAL_LOGS.forEach((log, index) => {
        setTimeout(() => {
          setLogs((prev) => [
            ...prev,
            {
              ...log,
              id: logIdRef.current++,
              timestamp: getTimestamp(),
            },
          ])
        }, index * 200)
      })

      // Focus input after a short delay
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commandInput.trim()) return

    // Add user command to logs
    setLogs((prev) => [
      ...prev,
      {
        id: logIdRef.current++,
        level: 'INFO',
        message: `> ${commandInput}`,
        timestamp: getTimestamp(),
      },
    ])

    // Add random response after a short delay
    setTimeout(() => {
      const randomResponse =
        COMMAND_RESPONSES[Math.floor(Math.random() * COMMAND_RESPONSES.length)]
      setLogs((prev) => [
        ...prev,
        {
          id: logIdRef.current++,
          level: 'ERROR',
          message: randomResponse,
          timestamp: getTimestamp(),
        },
      ])
    }, 300)

    setCommandInput('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl glass-overlay rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-black/40">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary terminal-glow" />
                <span className="font-mono text-sm font-semibold terminal-glow">
                  DEVELOPER MODE - useless.io v0.0.1-alpha-broken
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Console Output */}
            <div
              ref={logContainerRef}
              className="h-80 overflow-y-auto p-4 font-mono text-sm bg-black/60 scrollbar-visible"
            >
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-1 flex gap-2"
                >
                  <span className="text-muted-foreground/60">[{log.timestamp}]</span>
                  <span className={`font-semibold ${getLevelColor(log.level)}`}>
                    [{log.level}]
                  </span>
                  <span className="text-foreground/90">{log.message}</span>
                </motion.div>
              ))}
              <div className="h-1" /> {/* Spacer for scroll */}
            </div>

            {/* Command Input */}
            <form
              onSubmit={handleCommandSubmit}
              className="flex items-center gap-2 px-4 py-3 border-t border-border/60 bg-black/40"
            >
              <span className="text-primary font-mono terminal-glow">$</span>
              <input
                ref={inputRef}
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Enter command..."
                className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground/50"
              />
              <Button type="submit" variant="ghost" size="sm" className="text-xs">
                Execute
              </Button>
            </form>

            {/* Footer */}
            <div className="px-4 py-2 text-xs text-muted-foreground/60 text-center border-t border-border/40 bg-black/20">
              Press <kbd className="px-1.5 py-0.5 rounded bg-muted/50 font-mono">ESC</kbd> to
              exit | Hint: Nothing here actually works
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@ggprompts/ui'
import { Button } from '@ggprompts/ui'
import { Card } from '@ggprompts/ui'
import { Home, ArrowLeft, Terminal, AlertCircle, ShoppingBag, ShoppingCart, Wifi, Zap, DollarSign } from 'lucide-react'
import { Badge } from '@ggprompts/ui'

export default function NotFound() {
  const router = useRouter()
  const [command, setCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [showCursor, setShowCursor] = useState(true)
  const [matrixChars, setMatrixChars] = useState<Array<{ id: number; x: number; chars: string }>>([])
  const [glitchText, setGlitchText] = useState('404')
  const [typewriterText, setTypewriterText] = useState('')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  const fullMessage = "ERROR: This product was so useless it ceased to exist. Even we couldn't make something this pointless."

  // Fake "suggested" useless products that also don't exist
  const fakeProducts = [
    { name: 'Invisible Ink for Blank Pages', price: 'FREE.99', stock: 'Out of Stock' },
    { name: 'WiFi-Enabled Rock (Disconnected)', price: '$404.04', stock: 'Never in Stock' },
    { name: 'Self-Aware Toaster (Existential Crisis Edition)', price: '∞ UselessBucks', stock: 'Sold Out' },
    { name: 'Waterproof Tea Bag', price: '$0.00', stock: 'Discontinued' }
  ]

  // ASCII Art for 404 - Useless themed
  const asciiArt = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██╗  ██╗ ██████╗ ██╗  ██╗    ██╗   ██╗███████╗███████╗     ║
║   ██║  ██║██╔═████╗██║  ██║    ██║   ██║██╔════╝██╔════╝     ║
║   ███████║██║██╔██║███████║    ██║   ██║███████╗█████╗       ║
║   ╚════██║████╔╝██║╚════██║    ██║   ██║╚════██║██╔══╝       ║
║        ██║╚██████╔╝     ██║    ╚██████╔╝███████║███████╗     ║
║        ╚═╝ ╚═════╝      ╚═╝     ╚═════╝ ╚══════╝╚══════╝     ║
║                                                               ║
║          ██╗     ███████╗███████╗███████╗██╗                 ║
║          ██║     ██╔════╝██╔════╝██╔════╝██║                 ║
║          ██║     █████╗  ███████╗███████╗██║                 ║
║          ██║     ██╔══╝  ╚════██║╚════██║╚═╝                 ║
║          ███████╗███████╗███████║███████║██╗                 ║
║          ╚══════╝╚══════╝╚══════╝╚══════╝╚═╝                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝`

  // Terminal commands for useless-io
  const suggestedCommands = [
    { cmd: 'cd /home', action: () => router.push('/'), description: 'Return to homepage' },
    { cmd: 'ls /products', action: () => router.push('/products'), description: 'Browse useless products' },
    { cmd: 'cat /cart', action: () => router.push('/cart'), description: 'View your cart' },
    { cmd: 'whoami', action: () => setCommandHistory(prev => [...prev, '> You are a valued customer of useless things']), description: 'Check your identity' },
    { cmd: 'history -c', action: () => setCommandHistory([]), description: 'Clear command history' },
  ]

  // Typewriter effect
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullMessage.length) {
        setTypewriterText(fullMessage.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [])

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Matrix rain effect
  useEffect(() => {
    const chars = '01$¢£€¥₿USELESS404VOID'
    const columns = typeof window !== 'undefined' ? Math.floor(window.innerWidth / 20) : 50

    const initialMatrix = Array.from({ length: columns }, (_, i) => ({
      id: i,
      x: i * 20,
      chars: Array.from({ length: 30 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    }))

    setMatrixChars(initialMatrix)

    const interval = setInterval(() => {
      setMatrixChars(prev => prev.map(col => ({
        ...col,
        chars: col.chars.slice(1) + chars[Math.floor(Math.random() * chars.length)]
      })))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Glitch effect
  useEffect(() => {
    const glitchChars = ['404', '4Ø4', '4O4', '▓0▓', '███', 'ERR', '???', 'N/A', '$$$']
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchText(glitchChars[Math.floor(Math.random() * glitchChars.length)])
        setTimeout(() => setGlitchText('404'), 100)
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Handle terminal commands
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    setCommandHistory(prev => [...prev, `$ ${command}`])

    const matchedCommand = suggestedCommands.find(sc => sc.cmd === command.trim())
    if (matchedCommand) {
      setCommandHistory(prev => [...prev, `> Executing: ${matchedCommand.description}...`])
      setTimeout(() => matchedCommand.action(), 500)
    } else {
      setCommandHistory(prev => [...prev, `> bash: ${command}: command not found (try something useless)`])
    }

    setCommand('')

    // Auto-scroll terminal
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 100)
  }

  // Handle navigation when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      router.push('/')
    }
  }, [countdown, router])

  // Optional countdown redirect
  const startCountdown = () => {
    setCountdown(10)
  }

  // Countdown timer effect
  useEffect(() => {
    if (countdown === null || countdown <= 0) return

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 0) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [countdown])

  return (
    <div className="min-h-screen text-primary relative overflow-hidden">
      {/* Matrix Background */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        {matrixChars.map(col => (
          <motion.div
            key={col.id}
            className="absolute text-primary font-mono text-xs whitespace-pre"
            style={{ left: `${col.x}px` }}
            initial={{ y: -500 }}
            animate={{ y: '100vh' }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {col.chars.split('').map((char, i) => (
              <div key={i} style={{ opacity: 1 - (i / 30) }}>{char}</div>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* ASCII Art Header */}
          <Card className="glass-dark border-primary/30 p-6 mb-8 overflow-hidden">
            <pre className="text-primary text-[8px] sm:text-xs md:text-sm font-mono text-center overflow-x-auto terminal-glow">
              {asciiArt}
            </pre>

            {/* Glitch Effect on 404 */}
            <div className="text-center mt-6">
              <motion.h1
                className="text-5xl md:text-8xl font-bold font-mono relative inline-block text-primary terminal-glow"
                animate={{
                  textShadow: [
                    '0 0 10px rgba(var(--primary-rgb), 0.8), 0 0 20px rgba(var(--primary-rgb), 0.6)',
                    '0 0 15px rgba(var(--primary-rgb), 1), 0 0 30px rgba(var(--primary-rgb), 0.8)',
                    '0 0 10px rgba(var(--primary-rgb), 0.8), 0 0 20px rgba(var(--primary-rgb), 0.6)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="relative">
                  {glitchText}
                  <span className="absolute inset-0 text-secondary opacity-50" style={{ transform: 'translate(2px, -2px)' }}>
                    {glitchText}
                  </span>
                  <span className="absolute inset-0 text-destructive opacity-30" style={{ transform: 'translate(-2px, 2px)' }}>
                    {glitchText}
                  </span>
                </span>
              </motion.h1>
            </div>
          </Card>

          {/* Error Message with Typewriter */}
          <Card className="glass-dark border-primary/30 p-6 mb-8">
            <div className="font-mono text-sm space-y-2">
              <div className="text-destructive flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>PRODUCT NOT FOUND</span>
              </div>
              <div className="text-primary">
                {typewriterText}
                {showCursor && <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />}
              </div>
              <div className="text-muted-foreground text-xs mt-4">
                The page you're looking for is as real as our products' usefulness.
              </div>
            </div>
          </Card>

          {/* Interactive Terminal */}
          <Card className="glass-dark border-primary/30 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="font-mono text-primary">RECOVERY TERMINAL</span>
            </div>

            <div
              ref={terminalRef}
              className="bg-muted/50 rounded p-4 h-48 overflow-y-auto font-mono text-sm mb-4"
            >
              <div className="text-muted-foreground">
                useless@shop:~$ Available commands:
              </div>
              {suggestedCommands.map(sc => (
                <div key={sc.cmd} className="text-primary/70 text-xs">
                  {sc.cmd} - {sc.description}
                </div>
              ))}
              {commandHistory.map((cmd, i) => (
                <div key={i} className={cmd.startsWith('>') ? 'text-yellow-400' : 'text-primary'}>
                  {cmd}
                </div>
              ))}
            </div>

            <form onSubmit={handleCommand} className="flex gap-2">
              <span className="text-primary font-mono">$</span>
              <Input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="flex-1 bg-muted/30 border-primary/30 font-mono placeholder:text-muted-foreground"
                placeholder="Enter command..."
              />
            </form>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/">
                <Card className="glass-dark border-primary/30 p-4 hover:border-primary/50 transition-all cursor-pointer h-full">
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <div className="font-mono text-sm">cd /home</div>
                      <div className="text-xs text-muted-foreground">Return to base</div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/products">
                <Card className="glass-dark border-primary/30 p-4 hover:border-primary/50 transition-all cursor-pointer h-full">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <div className="font-mono text-sm">ls /products</div>
                      <div className="text-xs text-muted-foreground">Browse useless stuff</div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => router.back()}
                className="w-full h-full bg-transparent hover:bg-primary/10 border-0 p-0"
              >
                <Card className="glass-dark border-primary/30 p-4 hover:border-primary/50 transition-all w-full">
                  <div className="flex items-center gap-3">
                    <ArrowLeft className="w-5 h-5 text-primary shrink-0" />
                    <div className="text-left">
                      <div className="font-mono text-sm">cd ..</div>
                      <div className="text-xs text-muted-foreground">Go back</div>
                    </div>
                  </div>
                </Card>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={startCountdown}
                disabled={countdown !== null}
                className="w-full h-full bg-transparent hover:bg-primary/10 border-0 p-0"
              >
                <Card className="glass-dark border-primary/30 p-4 hover:border-primary/50 transition-all w-full">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5 text-primary shrink-0" />
                    <div className="text-left">
                      <div className="font-mono text-sm">auto-recover</div>
                      <div className="text-xs text-muted-foreground">
                        {countdown !== null ? `Redirecting in ${countdown}s...` : 'Auto redirect'}
                      </div>
                    </div>
                  </div>
                </Card>
              </Button>
            </motion.div>
          </div>

          {/* Fake "Suggested Products" */}
          <Card className="glass-dark border-primary/30 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-mono text-lg text-primary">SIMILAR PRODUCTS THAT ALSO DON'T EXIST</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fakeProducts.map((product, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-muted/30 rounded p-3 border border-primary/20 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-mono text-sm text-primary mb-1">{product.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{product.price}</span>
                        <Badge variant="outline" className="text-xs border-destructive/50 text-destructive">
                          {product.stock}
                        </Badge>
                      </div>
                    </div>
                    {i === 0 && <Zap className="w-4 h-4 text-yellow-400 shrink-0" />}
                    {i === 1 && <Wifi className="w-4 h-4 text-primary shrink-0" />}
                    {i === 2 && <AlertCircle className="w-4 h-4 text-destructive shrink-0" />}
                    {i === 3 && <DollarSign className="w-4 h-4 text-secondary shrink-0" />}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
              <div className="font-mono text-xs text-yellow-400 text-center">
                💡 PRO TIP: None of these products are real, just like the page you were looking for
              </div>
            </div>
          </Card>

          {/* Report This Useless Page Button */}
          <Card className="glass-dark border-primary/30 p-4 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-mono text-sm text-muted-foreground">
                Found a problem? Report it to the void.
              </div>
              <Button
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10"
                onClick={() => {
                  setReportSubmitted(true)
                  setTimeout(() => setReportSubmitted(false), 3000)
                }}
                disabled={reportSubmitted}
              >
                {reportSubmitted ? '✓ Report Filed in /dev/null' : 'Report This Useless Page'}
              </Button>
            </div>
          </Card>

          {/* Satirical Footer Message */}
          <Card className="glass-dark border-yellow-500/30 p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="font-mono text-sm text-yellow-400">
                <span className="text-xs block sm:inline">SYSTEM MESSAGE:</span>{' '}
                <span className="text-muted-foreground">This 404 page is ironically the most useful thing we sell. It actually works.</span>
              </div>
              <Link href="/products">
                <Button
                  variant="outline"
                  className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 whitespace-nowrap"
                >
                  Shop Anyway
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CommandHistory {
  command: string
  output: React.ReactNode
  timestamp: Date
}

interface FileSystem {
  [key: string]: {
    type: 'file' | 'directory'
    content?: string
    children?: FileSystem
  }
}

const ASCII_HEADER = `
███╗   ███╗ █████╗ ████████╗████████╗
████╗ ████║██╔══██╗╚══██╔══╝╚══██╔══╝
██╔████╔██║███████║   ██║      ██║
██║╚██╔╝██║██╔══██║   ██║      ██║
██║ ╚═╝ ██║██║  ██║   ██║      ██║
╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝      ╚═╝
`

const HELP_TEXT = `
Available Commands:
─────────────────────────────────────────────────────
  help              Show this help message
  about             Display personal information
  skills            List technical skills
  projects          Show project portfolio (50 projects)
  projects -web     Show web projects
  projects -tui     Show TUI/CLI projects
  experience        Display work experience
  education         Show educational background
  contact           Display contact information
  resume            Download resume (PDF)
  clear             Clear terminal
  ls                List current directory
  cd <dir>          Change directory
  cat <file>        Display file contents
  tree              Show directory structure
  whoami            Display user info
  date              Show current date/time
  echo <text>       Echo text back
  history           Show command history
  matrix            Enter the Matrix
  hack              "Hack" the mainframe
  coffee            Brew some coffee
  exit              Close terminal

Shortcuts:
  ↑/↓               Navigate command history
  Tab               Auto-complete commands
  Ctrl+L            Clear screen
  Ctrl+C            Cancel current command
`

const SKILLS_DATA = {
  languages: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'SQL'],
  frontend: ['React', 'Next.js', 'Vue', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
  backend: ['Node.js', 'Express', 'FastAPI', 'GraphQL', 'PostgreSQL', 'MongoDB'],
  cloud: ['AWS', 'Vercel', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
  tools: ['Git', 'Linux', 'Vim', 'tmux', 'OBS Studio', 'Figma'],
  tui: ['Bubbletea', 'Lipgloss', 'Charm', 'Rich', 'Textual', 'Blessed']
}

const PROJECTS_WEB = [
  { name: 'E-Commerce Platform', tech: 'Next.js, Stripe, PostgreSQL', stars: 245 },
  { name: 'Real-time Chat App', tech: 'React, Socket.io, Redis', stars: 189 },
  { name: 'AI Content Generator', tech: 'OpenAI API, Next.js, Tailwind', stars: 432 },
  { name: 'Task Management System', tech: 'Vue 3, Pinia, Supabase', stars: 156 },
  { name: 'Social Media Dashboard', tech: 'React, D3.js, REST APIs', stars: 278 },
  { name: 'Video Streaming Platform', tech: 'Next.js, WebRTC, AWS S3', stars: 367 },
  { name: 'Learning Management System', tech: 'React, GraphQL, MongoDB', stars: 199 },
  { name: 'Finance Tracker', tech: 'Vue, Chart.js, Firebase', stars: 223 },
  { name: 'Weather Forecast App', tech: 'React Native, Weather API', stars: 145 },
  { name: 'Blog Platform', tech: 'Astro, MDX, Tailwind', stars: 312 }
]

const PROJECTS_TUI = [
  { name: 'Terminal File Manager', tech: 'Bubbletea, Lipgloss', stars: 567 },
  { name: 'Git UI Dashboard', tech: 'Charm, Go', stars: 423 },
  { name: 'System Monitor', tech: 'Python, Rich', stars: 389 },
  { name: 'Database Client', tech: 'Rust, TUI-rs', stars: 445 },
  { name: 'Task Runner CLI', tech: 'Node.js, Blessed', stars: 278 },
  { name: 'Log Analyzer', tech: 'Go, Bubbletea', stars: 334 },
  { name: 'Network Scanner', tech: 'Python, Textual', stars: 412 },
  { name: 'Code Editor TUI', tech: 'Rust, Crossterm', stars: 523 },
  { name: 'Password Manager', tech: 'Go, Charm', stars: 367 },
  { name: 'ASCII Art Generator', tech: 'Python, Rich', stars: 289 }
]

const FILE_SYSTEM: FileSystem = {
  'README.md': { type: 'file', content: '# Matt\'s Portfolio\n\nWelcome to my interactive terminal resume!\n\nType `help` to see available commands.' },
  'projects': {
    type: 'directory',
    children: {
      'web': {
        type: 'directory',
        children: {
          'ecommerce.md': { type: 'file', content: '# E-Commerce Platform\nBuilt with Next.js and Stripe\n⭐ 245 stars on GitHub' },
          'chat-app.md': { type: 'file', content: '# Real-time Chat\nWebSocket-based messaging\n⭐ 189 stars' }
        }
      },
      'tui': {
        type: 'directory',
        children: {
          'file-manager.md': { type: 'file', content: '# Terminal File Manager\nBuilt with Bubbletea/Lipgloss\n⭐ 567 stars' },
          'git-ui.md': { type: 'file', content: '# Git Dashboard\nInteractive Git interface\n⭐ 423 stars' }
        }
      }
    }
  },
  'skills': {
    type: 'directory',
    children: {
      'languages.txt': { type: 'file', content: SKILLS_DATA.languages.join('\n') },
      'frameworks.txt': { type: 'file', content: [...SKILLS_DATA.frontend, ...SKILLS_DATA.backend].join('\n') }
    }
  },
  'contact.txt': { type: 'file', content: 'Email: matt@example.com\nGitHub: github.com/matt\nLinkedIn: linkedin.com/in/matt' }
}

export default function TerminalResume() {
  const [history, setHistory] = useState<CommandHistory[]>([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentDirectory, setCurrentDirectory] = useState('~')
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showMatrix, setShowMatrix] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const commands = [
    'help', 'about', 'skills', 'projects', 'experience', 'education',
    'contact', 'resume', 'clear', 'ls', 'cd', 'cat', 'tree', 'whoami',
    'date', 'echo', 'history', 'matrix', 'hack', 'coffee', 'exit'
  ]

  const typeText = useCallback((text: string, callback?: () => void) => {
    setIsTyping(true)
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        index++
      } else {
        clearInterval(interval)
        setIsTyping(false)
        callback?.()
      }
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const processCommand = useCallback((cmd: string) => {
    const parts = cmd.trim().toLowerCase().split(' ')
    const command = parts[0]
    const args = parts.slice(1).join(' ')

    let output: React.ReactNode = null

    switch (command) {
      case 'help':
        output = <pre className="text-primary whitespace-pre-wrap font-mono text-sm">{HELP_TEXT}</pre>
        break

      case 'about':
        output = (
          <div className="text-secondary space-y-2">
            <p className="text-primary">╔══════════════════════════════════════╗</p>
            <p className="text-primary">║         About Matt                   ║</p>
            <p className="text-primary">╚══════════════════════════════════════╝</p>
            <p>Full-Stack Developer | TUI Enthusiast | Open Source Contributor</p>
            <p className="text-muted-foreground">📍 Location: San Francisco, CA</p>
            <p className="text-muted-foreground">🚀 Focus: Building elegant terminal and web applications</p>
            <p className="text-muted-foreground">💡 Passion: Creating intuitive user experiences</p>
            <p className="text-muted-foreground">🎯 Goal: Pushing the boundaries of what's possible in the terminal</p>
          </div>
        )
        break

      case 'skills':
        output = (
          <div className="text-secondary space-y-3">
            <div className="text-primary font-bold">Technical Skills Matrix:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(SKILLS_DATA).map(([category, skills]) => (
                <div key={category}>
                  <span className="text-yellow-400">{category.toUpperCase()}:</span>
                  <div className="ml-4 text-foreground/80">
                    {skills.map(skill => (
                      <div key={skill}>• {skill}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
        break

      case 'projects':
        if (args === '-web') {
          output = (
            <div className="text-secondary space-y-2">
              <div className="text-primary font-bold">Web Projects (10 of 25):</div>
              {PROJECTS_WEB.map((project, i) => (
                <div key={i} className="flex justify-between">
                  <span>{i + 1}. {project.name}</span>
                  <span className="text-muted-foreground">{project.tech}</span>
                  <span className="text-yellow-400">⭐ {project.stars}</span>
                </div>
              ))}
            </div>
          )
        } else if (args === '-tui') {
          output = (
            <div className="text-secondary space-y-2">
              <div className="text-primary font-bold">TUI/CLI Projects (10 of 25):</div>
              {PROJECTS_TUI.map((project, i) => (
                <div key={i} className="flex justify-between">
                  <span>{i + 1}. {project.name}</span>
                  <span className="text-muted-foreground">{project.tech}</span>
                  <span className="text-yellow-400">⭐ {project.stars}</span>
                </div>
              ))}
            </div>
          )
        } else {
          output = (
            <div className="text-secondary space-y-2">
              <div className="text-primary font-bold">Project Portfolio (50 total):</div>
              <p>📊 25 Web Applications | 25 TUI/CLI Tools</p>
              <p className="text-muted-foreground">Use `projects -web` or `projects -tui` to filter</p>
              <div className="mt-4">
                <p className="text-yellow-400">Featured Projects:</p>
                <p>• Terminal File Manager - ⭐ 567 stars</p>
                <p>• AI Content Generator - ⭐ 432 stars</p>
                <p>• Code Editor TUI - ⭐ 523 stars</p>
                <p>• Video Streaming Platform - ⭐ 367 stars</p>
              </div>
              <p className="text-muted-foreground/60 mt-2">Total GitHub Stars: 12,453 ⭐</p>
            </div>
          )
        }
        break

      case 'experience':
        output = (
          <div className="text-secondary space-y-3">
            <div className="text-primary font-bold">Work Experience:</div>
            <div className="space-y-3">
              <div>
                <p className="text-yellow-400">Senior Full-Stack Developer</p>
                <p className="text-muted-foreground">Tech Corp • 2021-Present</p>
                <p>• Led development of microservices architecture</p>
                <p>• Built real-time data processing pipelines</p>
              </div>
              <div>
                <p className="text-yellow-400">Software Engineer</p>
                <p className="text-muted-foreground">StartupXYZ • 2019-2021</p>
                <p>• Developed core product features</p>
                <p>• Implemented CI/CD pipelines</p>
              </div>
            </div>
          </div>
        )
        break

      case 'education':
        output = (
          <div className="text-secondary space-y-2">
            <div className="text-primary font-bold">Education:</div>
            <p className="text-yellow-400">B.S. Computer Science</p>
            <p className="text-muted-foreground">University of California • 2015-2019</p>
            <p>• GPA: 3.8/4.0</p>
            <p>• Dean's List</p>
            <p>• ACM Programming Team</p>
          </div>
        )
        break

      case 'contact':
        output = (
          <div className="text-secondary space-y-2">
            <div className="text-primary font-bold">Contact Information:</div>
            <p>📧 Email: <span className="text-blue-400 underline">matt@example.com</span></p>
            <p>🐙 GitHub: <span className="text-blue-400 underline">github.com/matt</span></p>
            <p>💼 LinkedIn: <span className="text-blue-400 underline">linkedin.com/in/matt</span></p>
            <p>🌐 Website: <span className="text-blue-400 underline">matt-portfolio.vercel.app</span></p>
            <p>🐦 Twitter: <span className="text-blue-400 underline">@matt_codes</span></p>
          </div>
        )
        break

      case 'resume':
        output = (
          <div className="text-secondary">
            <p className="text-primary">📄 Downloading resume.pdf...</p>
            <div className="mt-2 bg-primary/20 border border-primary/30 p-2 rounded">
              <p>[████████████████████] 100%</p>
              <p className="text-muted-foreground text-sm mt-1">Resume downloaded successfully!</p>
            </div>
          </div>
        )
        break

      case 'clear':
        setHistory([])
        return

      case 'ls':
        output = (
          <div className="text-secondary grid grid-cols-3 gap-4">
            <span className="text-blue-400">projects/</span>
            <span className="text-blue-400">skills/</span>
            <span>README.md</span>
            <span>contact.txt</span>
          </div>
        )
        break

      case 'cd':
        if (args) {
          setCurrentDirectory(args === '..' ? '~' : `~/${args}`)
          output = <span className="text-muted-foreground">Changed directory to {args}</span>
        } else {
          output = <span className="text-red-400">Error: Please specify a directory</span>
        }
        break

      case 'cat':
        if (args) {
          const file = FILE_SYSTEM[args]
          if (file && file.type === 'file') {
            output = <pre className="text-foreground/80 whitespace-pre-wrap">{file.content}</pre>
          } else {
            output = <span className="text-red-400">cat: {args}: No such file</span>
          }
        } else {
          output = <span className="text-red-400">Error: Please specify a file</span>
        }
        break

      case 'tree':
        output = (
          <pre className="text-secondary font-mono text-sm">{`
~/
├── projects/
│   ├── web/
│   │   ├── ecommerce.md
│   │   └── chat-app.md
│   └── tui/
│       ├── file-manager.md
│       └── git-ui.md
├── skills/
│   ├── languages.txt
│   └── frameworks.txt
├── README.md
└── contact.txt
          `}</pre>
        )
        break

      case 'whoami':
        output = (
          <div className="text-secondary">
            <p>matt@portfolio-terminal</p>
            <p className="text-muted-foreground">UID=1000(matt) GID=1000(developers)</p>
          </div>
        )
        break

      case 'date':
        output = <span className="text-secondary">{new Date().toString()}</span>
        break

      case 'echo':
        output = <span className="text-secondary">{args || ''}</span>
        break

      case 'history':
        output = (
          <div className="text-secondary space-y-1">
            {history.map((item, i) => (
              <div key={i}>
                <span className="text-muted-foreground">{i + 1}</span> {item.command}
              </div>
            ))}
          </div>
        )
        break

      case 'matrix':
        setShowMatrix(true)
        setTimeout(() => setShowMatrix(false), 5000)
        output = <span className="text-green-400">Entering the Matrix... 🕶️</span>
        break

      case 'hack':
        output = (
          <div className="text-green-400 font-mono">
            <p>ACCESSING MAINFRAME...</p>
            <p>[████████████████████] 100%</p>
            <p>ACCESS GRANTED</p>
            <p className="text-yellow-400 mt-2">⚠️ Just kidding! This is just a resume 😄</p>
          </div>
        )
        break

      case 'coffee':
        output = (
          <pre className="text-amber-600 font-mono text-sm">{`
      )  (
     (   ) )
      ) ( (
    _______)_
 .-'---------|
( C|/\\/\\/\\/\\/|
 '-./\\/\\/\\/\\/|
   '_________'
    '-------'
☕ Coffee is ready!
          `}</pre>
        )
        break

      case 'exit':
        output = <span className="text-red-400">Terminal session ended. Refresh to restart.</span>
        break

      default:
        if (command) {
          output = <span className="text-red-400">Command not found: {command}. Type 'help' for available commands.</span>
        }
    }

    if (output) {
      setHistory(prev => [...prev, { command: cmd, output, timestamp: new Date() }])
    }
  }, [history])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentCommand.trim()) return

    processCommand(currentCommand)
    setCurrentCommand('')
    setHistoryIndex(-1)
    setSuggestions([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentCommand(history[history.length - 1 - newIndex].command)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentCommand(history[history.length - 1 - newIndex].command)
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentCommand('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const matches = commands.filter(cmd => cmd.startsWith(currentCommand.toLowerCase()))
      if (matches.length === 1) {
        setCurrentCommand(matches[0])
        setSuggestions([])
      } else if (matches.length > 1) {
        setSuggestions(matches)
      }
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault()
      setHistory([])
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      setCurrentCommand('')
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const initialCommands = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      processCommand('echo Welcome to Matt\'s Interactive Terminal Resume!')
      await new Promise(resolve => setTimeout(resolve, 1000))
      processCommand('echo Type "help" to see available commands')
    }
    initialCommands()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen text-primary p-4 font-mono">
      <AnimatePresence>
        {showMatrix && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background z-50 overflow-hidden"
          >
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute text-green-400 text-xs animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animation: 'fall 5s linear infinite'
                }}
              >
                {Math.random() > 0.5 ? '0' : '1'}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <motion.pre
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary text-xs sm:text-sm md:text-base mb-4 terminal-glow"
        >
          {ASCII_HEADER}
        </motion.pre>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-lg p-4 h-[600px] overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-primary/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-muted-foreground text-sm">matt@portfolio — bash — 120×30</span>
          </div>

          <div
            ref={terminalRef}
            className="h-[520px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-800 scrollbar-track-transparent"
          >
            <AnimatePresence>
              {history.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-3"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-primary">{currentDirectory}</span>
                    <span className="text-secondary">$</span>
                    <span className="text-foreground">{item.command}</span>
                  </div>
                  {item.output && (
                    <div className="mt-1 ml-4">
                      {item.output}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex items-start gap-2">
              <span className="text-primary">{currentDirectory}</span>
              <span className="text-secondary">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-foreground outline-none caret-primary"
                spellCheck={false}
                autoComplete="off"
                disabled={isTyping}
              />
            </form>

            {suggestions.length > 0 && (
              <div className="mt-2 ml-4 flex gap-4 text-muted-foreground">
                {suggestions.map(s => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 text-center text-muted-foreground text-sm"
        >
          <p>Hint: Try commands like 'skills', 'projects', 'matrix', or 'hack' 😉</p>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  )
}
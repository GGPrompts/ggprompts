'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, Search, ArrowLeft, Terminal, AlertCircle } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [matrixChars, setMatrixChars] = useState<Array<{ id: number; x: number; chars: string }>>([]);
  const [glitchText, setGlitchText] = useState('404');
  const [searchQuery, setSearchQuery] = useState('');
  const [typewriterText, setTypewriterText] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const fullMessage = "ERROR: The requested resource could not be located in the system hierarchy.";

  // ASCII Art for 404
  const asciiArt = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  ██╗  ██╗ ██████╗ ██╗  ██╗    ███╗   ██╗ ██████╗ ████████╗  ║
║  ██║  ██║██╔═████╗██║  ██║    ████╗  ██║██╔═══██╗╚══██╔══╝  ║
║  ███████║██║██╔██║███████║    ██╔██╗ ██║██║   ██║   ██║     ║
║  ╚════██║████╔╝██║╚════██║    ██║╚██╗██║██║   ██║   ██║     ║
║       ██║╚██████╔╝     ██║    ██║ ╚████║╚██████╔╝   ██║     ║
║       ╚═╝ ╚═════╝      ╚═╝    ╚═╝  ╚═══╝ ╚═════╝    ╚═╝     ║
║                                                               ║
║           ███████╗ ██████╗ ██╗   ██╗███╗   ██╗██████╗       ║
║           ██╔════╝██╔═══██╗██║   ██║████╗  ██║██╔══██╗      ║
║           █████╗  ██║   ██║██║   ██║██╔██╗ ██║██║  ██║      ║
║           ██╔══╝  ██║   ██║██║   ██║██║╚██╗██║██║  ██║      ║
║           ██║     ╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝      ║
║           ╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝`;

  // Suggested commands for terminal
  const suggestedCommands = [
    { cmd: 'cd /home', action: () => router.push('/'), description: 'Return to homepage' },
    { cmd: 'ls /projects', action: () => router.push('/projects'), description: 'List all projects' },
    { cmd: 'cat /about', action: () => router.push('/about'), description: 'Read about me' },
    { cmd: 'mail /contact', action: () => router.push('/contact'), description: 'Send a message' },
    { cmd: 'history -c', action: () => setCommandHistory([]), description: 'Clear command history' },
  ];

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullMessage.length) {
        setTypewriterText(fullMessage.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Matrix rain effect
  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns = Math.floor(window.innerWidth / 20);

    const initialMatrix = Array.from({ length: columns }, (_, i) => ({
      id: i,
      x: i * 20,
      chars: Array.from({ length: 30 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    }));

    setMatrixChars(initialMatrix);

    const interval = setInterval(() => {
      setMatrixChars(prev => prev.map(col => ({
        ...col,
        chars: col.chars.slice(1) + chars[Math.floor(Math.random() * chars.length)]
      })));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Glitch effect
  useEffect(() => {
    const glitchChars = ['404', '4Ø4', '4O4', '▓0▓', '███', 'ERR', '???'];
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchText(glitchChars[Math.floor(Math.random() * glitchChars.length)]);
        setTimeout(() => setGlitchText('404'), 100);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle terminal commands
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setCommandHistory(prev => [...prev, `$ ${command}`]);

    const matchedCommand = suggestedCommands.find(sc => sc.cmd === command.trim());
    if (matchedCommand) {
      setCommandHistory(prev => [...prev, `> Executing: ${matchedCommand.description}...`]);
      setTimeout(() => matchedCommand.action(), 500);
    } else {
      setCommandHistory(prev => [...prev, `> bash: ${command}: command not found`]);
    }

    setCommand('');

    // Auto-scroll terminal
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 100);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle navigation when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      router.push('/');
    }
  }, [countdown, router]);

  // Optional countdown redirect
  const startCountdown = () => {
    setCountdown(10);
  };

  // Countdown timer effect
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 0) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <div className="min-h-screen text-primary relative overflow-hidden">
      {/* Matrix Background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {matrixChars.map(col => (
          <div
            key={col.id}
            className="absolute text-primary font-mono text-xs whitespace-pre"
            style={{
              left: `${col.x}px`,
              animation: `fall ${20 + Math.random() * 10}s linear infinite`,
            }}
          >
            {col.chars.split('').map((char, i) => (
              <div key={i} style={{ opacity: 1 - (i / 30) }}>{char}</div>
            ))}
          </div>
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
            <pre className="text-primary text-xs sm:text-sm font-mono text-center overflow-x-auto terminal-glow">
              {asciiArt}
            </pre>

            {/* Glitch Effect on 404 */}
            <div className="text-center mt-6">
              <motion.h1
                className="text-5xl md:text-8xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative inline-block"
                animate={{
                  textShadow: [
                    '0 0 10px rgba(16, 185, 129, 0.8), 0 0 20px rgba(16, 185, 129, 0.6)',
                    '0 0 15px rgba(16, 185, 129, 1), 0 0 30px rgba(16, 185, 129, 0.8)',
                    '0 0 10px rgba(16, 185, 129, 0.8), 0 0 20px rgba(16, 185, 129, 0.6)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="relative">
                  {glitchText}
                  <span className="absolute inset-0 text-secondary opacity-50" style={{ transform: 'translate(2px, -2px)' }}>
                    {glitchText}
                  </span>
                  <span className="absolute inset-0 text-red-500 opacity-30" style={{ transform: 'translate(-2px, 2px)' }}>
                    {glitchText}
                  </span>
                </span>
              </motion.h1>
            </div>
          </Card>

          {/* Error Message with Typewriter */}
          <Card className="glass-dark border-primary/30 p-6 mb-8">
            <div className="font-mono text-sm space-y-2">
              <div className="text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>SYSTEM ERROR</span>
              </div>
              <div className="text-primary">
                {typewriterText}
                {showCursor && <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />}
              </div>
              <div className="text-secondary text-xs mt-4">
                bash: /usr/bin/page: No such file or directory
              </div>
            </div>
          </Card>

          {/* Interactive Terminal */}
          <Card className="glass-dark border-primary/30 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Terminal className="w-4 h-4" />
              <span className="font-mono">RECOVERY TERMINAL</span>
            </div>

            <div
              ref={terminalRef}
              className="bg-muted/50 rounded p-4 h-48 overflow-y-auto font-mono text-sm mb-4"
            >
              <div className="text-secondary">
                matt@portfolio:~$ Available commands:
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
                className="flex-1 bg-muted/30 border-primary/30 text-primary font-mono placeholder:text-primary/30"
                placeholder="Enter command..."
              />
            </form>
          </Card>

          {/* Search Bar */}
          <Card className="glass-dark border-primary/30 p-6 mb-8">
            <h3 className="text-lg font-mono mb-4 text-primary">SEARCH SYSTEM FILES</h3>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-muted/30 border-primary/30 text-primary placeholder:text-primary/30"
                placeholder="grep -r 'search query' /"
              />
              <Button type="submit" className="bg-primary/20 hover:bg-primary/30 border border-primary/50">
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/">
                <Card className="glass-dark border-primary/30 p-4 hover:border-primary/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-mono text-sm">cd /home</div>
                      <div className="text-xs text-primary/60">Return to base</div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => router.back()}
                className="w-full h-full bg-transparent hover:bg-primary/10 border-0 p-0"
              >
                <Card className="glass-dark border-primary/30 p-4 hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-3">
                    <ArrowLeft className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-mono text-sm">cd ..</div>
                      <div className="text-xs text-primary/60">Go back</div>
                    </div>
                  </div>
                </Card>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={startCountdown}
                disabled={countdown !== null}
                className="w-full h-full bg-transparent hover:bg-primary/10 border-0 p-0"
              >
                <Card className="glass-dark border-primary/30 p-4 hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-mono text-sm">auto-recover</div>
                      <div className="text-xs text-primary/60">
                        {countdown !== null ? `Redirecting in ${countdown}s...` : 'Auto redirect'}
                      </div>
                    </div>
                  </div>
                </Card>
              </Button>
            </motion.div>
          </div>

          {/* Report Issue */}
          <Card className="glass-dark border-yellow-500/30 p-4">
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm text-yellow-400">
                <span className="text-xs">REPORT BUG:</span> If this page should exist, please notify the sysadmin
              </div>
              <Button
                variant="outline"
                className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                onClick={() => window.open('https://github.com/yourusername/portfolio/issues', '_blank')}
              >
                Report Issue
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
}
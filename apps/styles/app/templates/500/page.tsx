'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, RefreshCw, AlertTriangle, Terminal, Database, Cpu, HardDrive } from 'lucide-react';

export default function ServerError() {
  const router = useRouter();
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [kernelLogs, setKernelLogs] = useState<string[]>([]);
  const [glitchText, setGlitchText] = useState('500');
  const [systemStatus, setSystemStatus] = useState('CRITICAL');
  const [rebootProgress, setRebootProgress] = useState<number | null>(null);
  const [memoryDump, setMemoryDump] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [typewriterText, setTypewriterText] = useState('');

  const fullMessage = "KERNEL PANIC: Unable to handle kernel paging request at virtual address 0xdeadbeef";

  // ASCII Art for Kernel Panic
  const asciiArt = `
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║  ██╗  ██╗███████╗██████╗ ███╗   ██╗███████╗██╗                      ║
║  ██║ ██╔╝██╔════╝██╔══██╗████╗  ██║██╔════╝██║                      ║
║  █████╔╝ █████╗  ██████╔╝██╔██╗ ██║█████╗  ██║                      ║
║  ██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╗██║██╔══╝  ██║                      ║
║  ██║  ██╗███████╗██║  ██║██║ ╚████║███████╗███████╗                 ║
║  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝                 ║
║                                                                       ║
║  ██████╗  █████╗ ███╗   ██╗██╗ ██████╗    ██╗██╗                    ║
║  ██╔══██╗██╔══██╗████╗  ██║██║██╔════╝    ██║██║                    ║
║  ██████╔╝███████║██╔██╗ ██║██║██║         ██║██║                    ║
║  ██╔═══╝ ██╔══██║██║╚██╗██║██║██║         ╚═╝╚═╝                    ║
║  ██║     ██║  ██║██║ ╚████║██║╚██████╗    ██╗██╗                    ║
║  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝ ╚═════╝    ╚═╝╚═╝                    ║
║                                                                       ║
║                     [ SYSTEM HALTED ]                                ║
╚═══════════════════════════════════════════════════════════════════════╝`;

  // Generate fake kernel panic logs
  const generateKernelLogs = () => {
    return [
      '[  0.000000] Kernel panic - not syncing: Fatal exception in interrupt',
      '[  0.000001] CPU: 0 PID: 1337 Comm: node Not tainted 5.15.0-generic',
      '[  0.000002] Hardware name: Portfolio Server v2.0',
      '[  0.000003] Call Trace:',
      '[  0.000004]  <TASK>',
      '[  0.000005]  dump_stack_lvl+0x4a/0x5f',
      '[  0.000006]  panic+0x149/0x321',
      '[  0.000007]  ? handle_page_fault+0x1d8/0x2e0',
      '[  0.000008]  page_fault_oops+0x83/0x160',
      '[  0.000009]  exc_page_fault+0x68/0x150',
      '[  0.000010]  asm_exc_page_fault+0x22/0x30',
      '[  0.000011] RIP: 0010:portfolio_render+0x42/0x100',
      '[  0.000012] Code: 48 8b 40 68 48 85 c0 74 0b 48 8b 40 10 48 85 c0 74 02 ff',
      '[  0.000013] RSP: 0018:ffffb8d4c0003e58 EFLAGS: 00010246',
      '[  0.000014] RAX: 00000000deadbeef RBX: ffff9c2d80000000 RCX: 0000000000000000',
      '[  0.000015] RDX: 0000000000000001 RSI: ffffb8d4c0003e70 RDI: ffff9c2d81234567',
      '[  0.000016] ---[ end Kernel panic - not syncing ]---',
    ];
  };

  // Generate memory dump
  const generateMemoryDump = () => {
    const dump = [];
    for (let i = 0; i < 8; i++) {
      const addr = (0xffff8000 + i * 16).toString(16).toUpperCase();
      const bytes = Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
      ).join(' ');
      dump.push(`0x${addr}: ${bytes}`);
    }
    return dump;
  };

  // Suggested commands for recovery
  const suggestedCommands = [
    { cmd: 'sudo reboot', action: () => startReboot(), description: 'Attempt system restart' },
    { cmd: 'dmesg | tail', action: () => showKernelLogs(), description: 'View kernel logs' },
    { cmd: 'free -h', action: () => showMemoryStatus(), description: 'Check memory status' },
    { cmd: 'systemctl status', action: () => showSystemStatus(), description: 'Check system services' },
    { cmd: 'cd /home', action: () => router.push('/'), description: 'Emergency exit to home' },
    { cmd: 'journalctl -xe', action: () => showJournalLogs(), description: 'View system journal' },
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

  // Initialize kernel logs
  useEffect(() => {
    setKernelLogs(generateKernelLogs());
    setMemoryDump(generateMemoryDump());
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Glitch effect for 500
  useEffect(() => {
    const glitchChars = ['500', '5ØØ', '5OO', '▓▓▓', '███', 'ERR', '!!!', '5XX'];
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setGlitchText(glitchChars[Math.floor(Math.random() * glitchChars.length)]);
        setTimeout(() => setGlitchText('500'), 150);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // System status flicker
  useEffect(() => {
    const statuses = ['CRITICAL', 'FAILING', 'ERROR', 'PANIC', 'HALTED'];
    const interval = setInterval(() => {
      setSystemStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle terminal commands
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setCommandHistory(prev => [...prev, `root@emergency:~# ${command}`]);

    const matchedCommand = suggestedCommands.find(sc => sc.cmd === command.trim());
    if (matchedCommand) {
      setCommandHistory(prev => [...prev, `> Executing: ${matchedCommand.description}...`]);
      setTimeout(() => matchedCommand.action(), 500);
    } else {
      setCommandHistory(prev => [...prev, `> bash: ${command}: command not found (system in recovery mode)`]);
    }

    setCommand('');

    // Auto-scroll terminal
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 100);
  };

  const startReboot = () => {
    setRebootProgress(0);
    setCommandHistory(prev => [...prev, '> Initiating emergency reboot sequence...']);
  };

  // Reboot progress effect
  useEffect(() => {
    if (rebootProgress === null || rebootProgress >= 100) return;

    const interval = setInterval(() => {
      setRebootProgress(prev => {
        if (prev === null || prev >= 100) {
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [rebootProgress]);

  // Handle navigation when reboot completes
  useEffect(() => {
    if (rebootProgress === 100) {
      setCommandHistory(prev => [...prev, '> Reboot complete. Redirecting to home...']);
      const timeout = setTimeout(() => {
        router.push('/');
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [rebootProgress, router]);

  const showKernelLogs = () => {
    kernelLogs.forEach(log => {
      setCommandHistory(prev => [...prev, log]);
    });
  };

  const showMemoryStatus = () => {
    setCommandHistory(prev => [
      ...prev,
      '              total        used        free      shared  buff/cache   available',
      'Mem:           15Gi       12Gi       256Mi       1.0Gi       3.2Gi       2.1Gi',
      'Swap:         2.0Gi       2.0Gi         0B',
      '> WARNING: System memory critical!'
    ]);
  };

  const showSystemStatus = () => {
    setCommandHistory(prev => [
      ...prev,
      '● portfolio.service - Portfolio Web Server',
      '     Loaded: loaded (/etc/systemd/system/portfolio.service; enabled)',
      '     Active: failed (Result: core-dump)',
      '    Process: 1337 ExecStart=/usr/bin/node server.js (code=dumped, signal=SEGV)',
      '   Main PID: 1337 (code=dumped, signal=SEGV)',
      '> CRITICAL: Main service has crashed!'
    ]);
  };

  const showJournalLogs = () => {
    setCommandHistory(prev => [
      ...prev,
      '-- Journal begins at ' + new Date().toISOString() + ' --',
      'portfolio.service: Main process exited, code=dumped, status=11/SEGV',
      'portfolio.service: Failed with result "core-dump".',
      'systemd[1]: portfolio.service: Service hold-off time over, scheduling restart.',
      'systemd[1]: portfolio.service: Scheduled restart job, restart counter is at 5.',
      'systemd[1]: Stopped Portfolio Web Server.',
      'systemd[1]: portfolio.service: Start request repeated too quickly.',
      'systemd[1]: portfolio.service: Failed with result "start-limit-hit".',
      '> ERROR: Service restart limit reached!'
    ]);
  };

  return (
    <div className="min-h-screen text-red-500 relative overflow-hidden">
      {/* Scanlines Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.1) 2px, rgba(255, 0, 0, 0.1) 4px)',
        }}
      />

      {/* Static Noise */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5' /%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* ASCII Art Header */}
          <Card className="bg-card border-red-500/50 p-6 mb-8 overflow-hidden shadow-[0_0_30px_rgba(255,0,0,0.3)]">
            <pre className="text-red-500 text-xs sm:text-sm font-mono text-center overflow-x-auto"
              style={{ textShadow: '0 0 10px rgba(255, 0, 0, 0.8)' }}>
              {asciiArt}
            </pre>

            {/* Glitch Effect on 500 */}
            <div className="text-center mt-6">
              <motion.h1
                className="text-5xl md:text-8xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative inline-block"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.6)',
                    '0 0 30px rgba(255, 0, 0, 1), 0 0 60px rgba(255, 0, 0, 0.8)',
                    '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.6)',
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="relative">
                  {glitchText}
                  <span className="absolute inset-0 text-orange-500 opacity-50"
                    style={{ transform: 'translate(3px, -3px)', clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}>
                    {glitchText}
                  </span>
                  <span className="absolute inset-0 text-blue-500 opacity-30"
                    style={{ transform: 'translate(-3px, 3px)', clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}>
                    {glitchText}
                  </span>
                </span>
              </motion.h1>
            </div>

            {/* System Status Badge */}
            <div className="text-center mt-4">
              <Badge variant="destructive" className="bg-red-900/50 text-red-300 border-red-500 animate-pulse">
                SYSTEM STATUS: {systemStatus}
              </Badge>
            </div>
          </Card>

          {/* Kernel Panic Message */}
          <Card className="bg-card/90 border-red-500/50 p-6 mb-8 shadow-[0_0_20px_rgba(255,0,0,0.2)]">
            <div className="font-mono text-sm space-y-2">
              <div className="text-red-500 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
                <span className="font-bold">KERNEL PANIC</span>
              </div>
              <div className="text-red-400">
                {typewriterText}
                {showCursor && <span className="inline-block w-2 h-4 bg-red-400 ml-1 animate-pulse" />}
              </div>
              <div className="text-orange-400 text-xs mt-4 space-y-1">
                <div>Stack trace:</div>
                <div className="ml-4 text-orange-300/70">at Object.render (/app/pages/unknown.tsx:42:13)</div>
                <div className="ml-4 text-orange-300/70">at processTicksAndRejections (node:internal/process:96:5)</div>
                <div className="ml-4 text-orange-300/70">at async Server.handleRequest (/app/server.js:1337:7)</div>
              </div>
            </div>
          </Card>

          {/* System Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card/90 border-red-500/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-red-400" />
                <span className="font-mono text-sm text-red-400">CPU</span>
              </div>
              <div className="font-mono text-xs text-red-300">
                <div>Load: 98.7%</div>
                <div>Temp: 89°C ⚠️</div>
                <div>Cores: 4/4 busy</div>
              </div>
            </Card>

            <Card className="bg-card/90 border-red-500/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-red-400" />
                <span className="font-mono text-sm text-red-400">MEMORY</span>
              </div>
              <div className="font-mono text-xs text-red-300">
                <div>Used: 15.7/16 GB</div>
                <div>Swap: 2/2 GB</div>
                <div>OOM Risk: HIGH</div>
              </div>
            </Card>

            <Card className="bg-card/90 border-red-500/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-red-400" />
                <span className="font-mono text-sm text-red-400">DISK</span>
              </div>
              <div className="font-mono text-xs text-red-300">
                <div>Core dump: 2.3 GB</div>
                <div>Logs: 847 MB</div>
                <div>Space: 2% free</div>
              </div>
            </Card>
          </div>

          {/* Memory Dump */}
          <Card className="bg-card/90 border-yellow-500/30 p-4 mb-8">
            <div className="font-mono text-xs">
              <div className="text-yellow-400 mb-2">MEMORY DUMP:</div>
              <div className="text-yellow-300/50 space-y-1 overflow-x-auto">
                {memoryDump.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          </Card>

          {/* Recovery Terminal */}
          <Card className="bg-card/90 border-red-500/50 p-6 mb-8 shadow-[0_0_20px_rgba(255,0,0,0.2)]">
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Terminal className="w-4 h-4 text-red-400" />
              <span className="font-mono text-red-400">EMERGENCY RECOVERY CONSOLE</span>
              <Badge variant="outline" className="ml-auto text-xs border-red-500/50 text-red-400">
                ROOT ACCESS
              </Badge>
            </div>

            <div
              ref={terminalRef}
              className="bg-background rounded p-4 h-56 overflow-y-auto font-mono text-sm mb-4"
            >
              <div className="text-yellow-400 mb-2">
                [EMERGENCY MODE] Available recovery commands:
              </div>
              {suggestedCommands.map(sc => (
                <div key={sc.cmd} className="text-red-300/70 text-xs">
                  {sc.cmd} - {sc.description}
                </div>
              ))}
              <div className="mt-2 text-orange-400 text-xs">
                WARNING: System running in emergency mode with limited functionality
              </div>
              {commandHistory.map((cmd, i) => (
                <div key={i} className={
                  cmd.startsWith('>') ? 'text-yellow-400' :
                  cmd.startsWith('[') ? 'text-orange-400 text-xs' :
                  'text-red-400'
                }>
                  {cmd}
                </div>
              ))}
            </div>

            <form onSubmit={handleCommand} className="flex gap-2">
              <span className="text-red-400 font-mono">root@emergency:~#</span>
              <Input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="flex-1 bg-background border-red-500/30 text-red-400 font-mono placeholder:text-red-400/30"
                placeholder="Enter recovery command..."
              />
            </form>

            {rebootProgress !== null && (
              <div className="mt-4">
                <div className="text-yellow-400 font-mono text-sm mb-2">
                  System Reboot Progress: {rebootProgress}%
                </div>
                <div className="w-full bg-background border border-red-500/30 rounded">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded"
                    initial={{ width: '0%' }}
                    animate={{ width: `${rebootProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/">
                <Card className="bg-card/90 border-red-500/30 p-4 hover:border-red-400/50 transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-red-400" />
                    <div>
                      <div className="font-mono text-sm text-red-400">emergency exit</div>
                      <div className="text-xs text-red-400/60">Abandon and go home</div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => window.location.reload()}
                className="w-full h-full bg-transparent hover:bg-red-500/10 border-0 p-0"
              >
                <Card className="bg-card/90 border-red-500/30 p-4 hover:border-red-400/50 transition-all hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-red-400" />
                    <div className="text-left">
                      <div className="font-mono text-sm text-red-400">force reload</div>
                      <div className="text-xs text-red-400/60">Try again (F5)</div>
                    </div>
                  </div>
                </Card>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={startReboot}
                disabled={rebootProgress !== null}
                className="w-full h-full bg-transparent hover:bg-red-500/10 border-0 p-0"
              >
                <Card className="bg-card/90 border-red-500/30 p-4 hover:border-red-400/50 transition-all hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-red-400" />
                    <div className="text-left">
                      <div className="font-mono text-sm text-red-400">system reboot</div>
                      <div className="text-xs text-red-400/60">
                        {rebootProgress !== null ? `Rebooting... ${rebootProgress}%` : 'Restart system'}
                      </div>
                    </div>
                  </div>
                </Card>
              </Button>
            </motion.div>
          </div>

          {/* Report Issue */}
          <Card className="bg-card/90 border-orange-500/50 p-4 shadow-[0_0_15px_rgba(255,165,0,0.2)]">
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm text-orange-400">
                <span className="text-xs">CRITICAL FAILURE:</span> Server encountered an unrecoverable error
              </div>
              <Button
                variant="outline"
                className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                onClick={() => window.open('https://github.com/yourusername/portfolio/issues', '_blank')}
              >
                Report Crash
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
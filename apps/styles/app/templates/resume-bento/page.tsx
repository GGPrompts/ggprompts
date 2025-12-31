'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  GitCommitHorizontal,
  Coffee,
  Code2,
  Zap,
  Star,
  TrendingUp,
  Terminal,
  Rocket,
  Brain,
  Sparkles,
  Package,
  GitBranch,
  FileCode,
  Database,
  Cloud,
  Cpu,
  Globe,
  Heart,
  Activity
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Mock data for 50 Claude projects
const claudeProjects = [
  "AI-powered code review bot", "Natural language SQL generator", "Smart documentation writer",
  "Automated test case generator", "Code refactoring assistant", "API endpoint analyzer",
  "Security vulnerability scanner", "Performance optimization tool", "Database schema designer",
  "React component generator", "TypeScript migration helper", "CSS-to-Tailwind converter",
  "GraphQL query builder", "Docker compose generator", "CI/CD pipeline builder",
  "Error message translator", "Code complexity analyzer", "Smart debugging assistant",
  "Architecture diagram generator", "API documentation writer", "Unit test generator",
  "Code style formatter", "Dependency vulnerability checker", "Build optimization tool",
  "Smart linter configurator", "Database query optimizer", "Cloud cost calculator",
  "Serverless function generator", "Kubernetes config builder", "Git workflow optimizer",
  "Code translation tool", "Smart regex builder", "Data validation generator",
  "API mock server builder", "Performance profiler", "Memory leak detector",
  "Code coverage analyzer", "Smart bundler configurator", "Database migration tool",
  "API rate limit calculator", "Cloud architecture advisor", "Security audit tool",
  "Code smell detector", "Technical debt analyzer", "Smart package manager",
  "Environment config generator", "API response validator", "Code documentation scorer",
  "Smart error handler", "Performance budget tool"
];

// Mock commit data
const recentCommits = [
  { id: 1, message: "feat: Add AI-powered code review", time: "2 minutes ago", repo: "claude-tools" },
  { id: 2, message: "fix: Resolve memory leak in parser", time: "15 minutes ago", repo: "ast-analyzer" },
  { id: 3, message: "docs: Update API documentation", time: "1 hour ago", repo: "claude-api" },
  { id: 4, message: "perf: Optimize token processing", time: "3 hours ago", repo: "llm-optimizer" },
  { id: 5, message: "feat: Implement smart caching", time: "5 hours ago", repo: "cache-manager" },
];

// Tech stack items
const techStack = [
  { name: "TypeScript", level: 95, color: "from-blue-500 to-blue-600" },
  { name: "React/Next.js", level: 90, color: "from-cyan-500 to-blue-500" },
  { name: "Node.js", level: 85, color: "from-green-500 to-emerald-500" },
  { name: "Python", level: 80, color: "from-yellow-500 to-orange-500" },
  { name: "Claude AI", level: 100, color: "from-purple-500 to-pink-500" },
  { name: "TailwindCSS", level: 88, color: "from-teal-500 to-secondary" },
];

// Favorite tools
const favoriteTools = [
  { name: "VS Code", icon: Code2 },
  { name: "GitHub", icon: GitBranch },
  { name: "Docker", icon: Package },
  { name: "PostgreSQL", icon: Database },
  { name: "AWS", icon: Cloud },
  { name: "Vercel", icon: Globe },
];

export default function ResumeBentoPage() {
  const [projectCount, setProjectCount] = useState(0);
  const [coffeeCount, setCoffeeCount] = useState(0);
  const [linesOfCode, setLinesOfCode] = useState(0);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Animate counters
  useEffect(() => {
    const projectInterval = setInterval(() => {
      setProjectCount(prev => prev < 50 ? prev + 1 : 50);
    }, 50);
    const coffeeInterval = setInterval(() => {
      setCoffeeCount(prev => prev < 847 ? prev + 7 : 847);
    }, 30);
    const linesInterval = setInterval(() => {
      setLinesOfCode(prev => prev < 124567 ? prev + 1234 : 124567);
    }, 20);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(projectInterval);
      clearInterval(coffeeInterval);
      clearInterval(linesInterval);
      clearInterval(timeInterval);
    };
  }, []);

  // Generate contribution graph data
  const generateContributions = () => {
    const contributions = [];
    for (let week = 0; week < 52; week++) {
      for (let day = 0; day < 7; day++) {
        contributions.push({
          week,
          day,
          count: Math.floor(Math.random() * 5),
        });
      }
    }
    return contributions;
  };

  const contributions = generateContributions();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-5xl font-mono font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Matt&apos;s Developer Dashboard
          </h1>
          <p className="text-muted-foreground">Building the future with AI, one project at a time</p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[120px]">

          {/* Available for Hire - Large Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 md:row-span-2"
          >
            <Card className="glass h-full p-6 border-primary/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-xl opacity-50 animate-pulse" />
                    <div className="relative w-3 h-3 bg-primary rounded-full" />
                  </div>
                  <h2 className="text-xl font-bold text-primary">Available for Hire</h2>
                </div>
                <p className="text-foreground/80 mb-4">
                  Full-stack developer specializing in AI-powered applications and modern web technologies.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-primary/20 text-primary border-primary/30">Remote</Badge>
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30">Contract</Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Full-time</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4" />
                    <span>Available Worldwide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span>Response time: &lt; 24 hours</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="md:row-span-2"
          >
            <Card className="glass h-full p-4 border-secondary/20">
              <h3 className="text-lg font-semibold mb-4 text-secondary">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-foreground/80">Projects</span>
                  </div>
                  <span className="text-xl font-bold text-purple-400">{projectCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground/80">Lines of Code</span>
                  </div>
                  <span className="text-xl font-bold text-primary">{linesOfCode.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-foreground/80">Coffee Consumed</span>
                  </div>
                  <span className="text-xl font-bold text-orange-400">{coffeeCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-foreground/80">GitHub Stars</span>
                  </div>
                  <span className="text-xl font-bold text-yellow-400">2.3k</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Clock/Current Focus */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass h-full p-4 border-purple-500/20 flex flex-col items-center justify-center">
              <div className="text-3xl font-mono font-bold text-purple-400 mb-2">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs text-muted-foreground">Currently coding</div>
            </Card>
          </motion.div>

          {/* Current Tech Focus */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2"
          >
            <Card className="glass h-full p-4 border-pink-500/20">
              <h3 className="text-sm font-semibold mb-3 text-pink-400 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Currently Learning
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/30">
                  Claude AI API
                </Badge>
                <Badge className="bg-gradient-to-r from-blue-500/20 to-secondary/20 border-blue-500/30">
                  Rust
                </Badge>
                <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
                  WebAssembly
                </Badge>
              </div>
            </Card>
          </motion.div>

          {/* Live Activity Feed - Large Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2 md:row-span-3"
          >
            <Card className="glass h-full p-4 border-primary/20">
              <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                <GitCommitHorizontal className="w-5 h-5" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentCommits.map((commit, index) => (
                  <motion.div
                    key={commit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-3 rounded-lg bg-card/30 border border-border/30 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 group-hover:animate-pulse" />
                      <div className="flex-1">
                        <div className="text-sm text-foreground/80 mb-1">{commit.message}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="text-secondary">{commit.repo}</span>
                          <span>•</span>
                          <span>{commit.time}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* GitHub Contribution Graph - Wide Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="md:col-span-2 md:row-span-2"
          >
            <Card className="glass h-full p-4 border-secondary/20">
              <h3 className="text-lg font-semibold mb-4 text-secondary flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Contribution Graph
              </h3>
              <div className="flex gap-1 flex-wrap">
                {contributions.map((contrib, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-3 h-3 rounded-sm transition-all hover:scale-110",
                      contrib.count === 0 && "bg-muted",
                      contrib.count === 1 && "bg-primary/40",
                      contrib.count === 2 && "bg-primary/60",
                      contrib.count === 3 && "bg-primary/80",
                      contrib.count >= 4 && "bg-primary"
                    )}
                    title={`${contrib.count} contributions`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-muted" />
                  <div className="w-3 h-3 rounded-sm bg-primary/40" />
                  <div className="w-3 h-3 rounded-sm bg-primary/60" />
                  <div className="w-3 h-3 rounded-sm bg-primary/80" />
                  <div className="w-3 h-3 rounded-sm bg-primary" />
                </div>
                <span>More</span>
              </div>
            </Card>
          </motion.div>

          {/* Tech Stack - Tall Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="md:row-span-3"
          >
            <Card className="glass h-full p-4 border-purple-500/20">
              <h3 className="text-lg font-semibold mb-4 text-purple-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Tech Stack
              </h3>
              <div className="space-y-3">
                {techStack.map((tech, index) => (
                  <div key={tech.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground/80">{tech.name}</span>
                      <span className="text-xs text-muted-foreground">{tech.level}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${tech.level}%` }}
                        transition={{ delay: 0.1 * index, duration: 1 }}
                        className={cn("h-full rounded-full bg-gradient-to-r", tech.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Favorite Tools */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="md:col-span-1"
          >
            <Card className="glass h-full p-4 border-orange-500/20">
              <h3 className="text-sm font-semibold mb-3 text-orange-400">Favorite Tools</h3>
              <div className="grid grid-cols-3 gap-2">
                {favoriteTools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <motion.div
                      key={tool.name}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="aspect-square flex items-center justify-center rounded-lg bg-card/30 border border-orange-500/20 hover:border-orange-500/40 transition-colors"
                      title={tool.name}
                    >
                      <Icon className="w-5 h-5 text-orange-400" />
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Projects Showcase - Extra Wide */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="md:col-span-4 md:row-span-2"
          >
            <Card className="glass h-full p-4 border-secondary/20">
              <h3 className="text-lg font-semibold mb-4 text-secondary flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                50 Claude AI Projects
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                {claudeProjects.map((project, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedProject(index === selectedProject ? null : index)}
                    className={cn(
                      "p-2 rounded-lg bg-card/30 border cursor-pointer transition-all text-xs",
                      selectedProject === index
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-border hover:border-secondary/50 text-muted-foreground hover:text-foreground/80"
                    )}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <Terminal className="w-3 h-3" />
                      <span className="font-mono text-[10px]">#{index + 1}</span>
                    </div>
                    <div className="line-clamp-2">{project}</div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Fun Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 }}
            className="md:col-span-2"
          >
            <Card className="glass h-full p-4 border-pink-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <span className="text-sm text-foreground/80">Favorite Language</span>
                </div>
                <Badge className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/30">
                  TypeScript
                </Badge>
              </div>
            </Card>
          </motion.div>

          {/* Productivity Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            className="md:col-span-2"
          >
            <Card className="glass h-full p-4 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground/80">Productivity Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={87} className="w-20 h-2" />
                  <span className="text-sm font-bold text-primary">87%</span>
                </div>
              </div>
            </Card>
          </motion.div>

        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <p>Built with Next.js, TypeScript, and lots of ☕</p>
          <p className="mt-1">© 2024 Matt&apos;s Portfolio • All projects powered by Claude AI</p>
        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
}
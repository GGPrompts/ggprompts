/**
 * Portfolio Content Data
 * Structured content for Matt M.'s Full Stack Prompt Engineer portfolio
 * Generated: 2025-11-22
 */

export const hero = {
  tagline: "From Zero to Deploy: Building with AI at Terminal Velocity",
  subtitle:
    "Six months ago, I'd never written a line of code. Today, I build production-ready web apps and terminal tools—proving that AI doesn't replace developers, it creates them. Former Program Analyst turned Full Stack Prompt Engineer, combining strategic architecture thinking with Claude Code velocity.",
  alternatives: {
    taglines: [
      "Full Stack Prompt Engineer: Where Strategic Thinking Meets AI-Powered Development",
      "Shipping Real Software in 6 Months—Thanks to Claude Code and Terminal Focus",
    ],
  },
} as const;

export const about = {
  title: "The Journey: Analyst to Engineer in 180 Days",
  content: `I spent years as a Program Analyst, architecting IT systems and translating requirements into technical specs—but I never wrote the code. Six months ago, that changed. With Claude Code as my pair programmer, I went from zero coding experience to shipping production applications.

My background isn't traditional. I was an EA beta tester for Command & Conquer, achieving top 10 global rankings. That gaming experience taught me something crucial: complex systems are puzzles waiting to be solved. Build orders, resource optimization, split-second strategic decisions—these translate directly to software architecture, state management, and real-time system design.

I call myself a **Full Stack Prompt Engineer** not as a joke, but as a philosophy. I embrace AI-assisted development because it lets me focus on what I'm best at: understanding problems, designing architectures, and shipping solutions. Claude Code handles the syntax gymnastics while I handle the strategy.

My technical interests gravitate toward what I call "power user tools"—terminal UIs built with Go/Bubbletea, browser-based development environments with xterm.js integration, real-time collaborative apps. I love the terminal aesthetic because it strips away the noise and reveals the structure underneath.

This portfolio showcases 45+ projects built in six months. Some are rough experiments. Others are production-ready. All of them represent a belief that **the best time to start building is now**, and the best tools are the ones that multiply your velocity—whether that's AI, the command line, or both.`,
  stats: {
    monthsLearning: 6,
    projectsCompleted: 45,
    primaryTool: "Claude Code",
    previousRole: "Program Analyst",
  },
} as const;

export const skills = {
  languages: {
    title: "Languages",
    items: [
      {
        name: "TypeScript",
        description: "Primary language for full-stack development",
        proficiency: "advanced",
      },
      {
        name: "JavaScript",
        description: "Frontend and Node.js applications",
        proficiency: "advanced",
      },
      {
        name: "Go",
        description: "Terminal applications and CLI tools",
        proficiency: "intermediate",
      },
    ],
  },
  frontend: {
    title: "Frontend",
    items: [
      {
        name: "React",
        description: "Component architecture and state management",
      },
      {
        name: "Next.js 15",
        description: "Server components, App Router, static generation",
      },
      {
        name: "Tailwind CSS",
        description: "Rapid UI development with custom design systems",
      },
      {
        name: "Framer Motion",
        description: "Complex animations and 3D interactions",
      },
      {
        name: "Canvas API",
        description: "Custom visualizations and interactive graphics",
      },
      {
        name: "xterm.js",
        description: "Terminal emulation in the browser",
      },
    ],
  },
  backend: {
    title: "Backend & Infrastructure",
    items: [
      {
        name: "Supabase",
        description: "PostgreSQL, real-time subscriptions, authentication",
      },
      {
        name: "Node.js",
        description: "API development and server-side logic",
      },
      {
        name: "Vercel",
        description: "Deployment and edge functions",
      },
      {
        name: "Real-time Systems",
        description: "WebSocket architecture, live collaboration",
      },
    ],
  },
  terminal: {
    title: "Terminal / CLI",
    items: [
      {
        name: "Bubbletea",
        description: "Interactive terminal UI framework (Go)",
      },
      {
        name: "Lipgloss",
        description: "Terminal styling and layout",
      },
      {
        name: "tmux",
        description: "Terminal workflow orchestration",
      },
      {
        name: "Unix Tools",
        description: "grep, awk, sed, shell scripting",
      },
    ],
  },
  aiDevelopment: {
    title: "AI-Assisted Development",
    items: [
      {
        name: "Claude Code",
        description: "Primary development environment",
      },
      {
        name: "Prompt Engineering",
        description: "System design through conversation",
      },
      {
        name: "AI Pair Programming",
        description: "Iterative development workflow",
      },
    ],
  },
  architecture: {
    title: "Architecture & Design",
    items: [
      {
        name: "Component Systems",
        description: "Reusable UI architecture",
      },
      {
        name: "Design Systems",
        description: "Glassmorphism, terminal aesthetics",
      },
      {
        name: "Real-time Architecture",
        description: "Event-driven systems",
      },
      {
        name: "Browser-Based IDEs",
        description: "Building development tools for the web",
      },
    ],
  },
} as const;

export const timeline = [
  {
    period: "1998-2008",
    title: "Gaming & Strategic Thinking",
    description: "EA Beta Tester for Command & Conquer series",
    highlights: [
      "EA Beta Tester for Command & Conquer series",
      "Top 10 Global Rankings in competitive RTS games",
      "Developed deep understanding of complex system optimization",
      "Mastered resource management under pressure",
      "Built pattern recognition skills in chaotic environments",
    ],
    skills: [
      "Complex system optimization",
      "Resource management under pressure",
      "Split-second decision-making patterns",
      "Pattern recognition in chaotic environments",
    ],
  },
  {
    period: "2008-2024",
    title: "Program Analyst Role",
    description: "IT Architecture & Systems Analysis",
    highlights: [
      "Designed enterprise system architectures",
      "Translated business requirements into technical specifications",
      "Led cross-functional technical projects",
      "Built expertise in systems thinking and architecture design",
    ],
    skills: [
      "Systems thinking and architecture design",
      "Technical documentation",
      "Cross-functional collaboration",
      "Problem decomposition",
    ],
  },
  {
    period: "May 2024",
    title: "The Pivot",
    description: "First Line of Code Written",
    highlights: [
      "Discovered Claude Code as pair programming tool",
      "Built first project: Simple terminal-based todo app in Go",
      "Realized AI could bridge the experience gap",
      "Committed to learning full-stack development",
    ],
    milestone: true,
  },
  {
    period: "June-August 2024",
    title: "Foundation Building",
    description: "Learning Phase: TypeScript, React, Next.js fundamentals",
    highlights: [
      "Built 10+ practice projects (calculators, dashboards, utilities)",
      "Discovered passion for terminal UIs and Bubbletea framework",
      "Started developing 'Full Stack Prompt Engineering' workflow",
      "Established core skill set in modern web development",
    ],
    projectCount: 10,
  },
  {
    period: "September-October 2024",
    title: "Production Projects",
    description: "First Production Deploy: Real-time collaborative tool on Vercel",
    highlights: [
      "Built browser-based terminal emulator with xterm.js",
      "Shipped multiple Supabase-backed applications",
      "Developed custom design system (glassmorphism + terminal aesthetic)",
      "Achieved production-ready code quality",
    ],
    milestone: true,
  },
  {
    period: "November 2024",
    title: "Portfolio Milestone",
    description: "45+ Projects Completed in 6 months",
    highlights: [
      "Mix of web applications (Next.js) and TUI tools (Go/Bubbletea)",
      "Established unique visual style across all projects",
      "Created comprehensive portfolio to showcase the journey",
      "Documented AI-assisted development workflows",
    ],
    projectCount: 45,
    milestone: true,
  },
  {
    period: "Current Focus (2025)",
    title: "Real-time Development Tools",
    description:
      "Browser-based IDEs, terminal applications, and design systems",
    highlights: [
      "Real-time Development Tools: Browser-based IDEs and collaboration platforms",
      "Terminal Applications: Building sophisticated CLI tools with Go",
      "Design Systems: Perfecting glassmorphic + terminal aesthetic",
      "Open Source: Contributing to Bubbletea/Lipgloss ecosystem",
      "Teaching: Documenting AI-assisted development workflows",
    ],
    current: true,
  },
] as const;

export const seo = {
  homepage: {
    title: "Matt M. - Full Stack Prompt Engineer | TypeScript, React, Next.js, Go",
    description:
      "Matt M. - Full Stack Prompt Engineer. Zero to 45+ projects in 6 months using Claude Code. TypeScript, React, Next.js, Go, and terminal-first development.",
    keywords: [
      "Full Stack Developer",
      "Prompt Engineer",
      "Claude Code",
      "TypeScript",
      "React",
      "Next.js",
      "Go",
      "Terminal UI",
      "Bubbletea",
      "AI-Assisted Development",
    ],
  },
  about: {
    title: "About Matt M. - From Program Analyst to Full Stack Developer",
    description:
      "From Program Analyst to Full Stack Developer in 6 months with Claude Code. Building production apps, terminal UIs, and embracing AI-assisted development.",
  },
  projects: {
    title: "Projects - 45+ Apps Built in 6 Months | Matt M.",
    description:
      "45+ projects built in 6 months: Next.js web apps, Go terminal tools, real-time systems. See what's possible when AI meets strategic thinking and velocity.",
  },
  alternative: {
    title: "Matt M. - AI-Assisted Full Stack Development Portfolio",
    description:
      "Matt M.: Program Analyst turned Full Stack Prompt Engineer. 45+ projects in 6 months with Claude Code, TypeScript, React, Next.js, and Go.",
  },
} as const;

export const callsToAction = [
  "Let's build something together",
  "See the full project showcase",
  "From strategic thinking to shipping code",
  "Explore 45+ projects built with AI velocity",
  "Terminal-first. AI-assisted. Production-ready.",
] as const;

export const pullQuotes = [
  "AI doesn't replace developers—it creates them",
  "Strategic gaming thinking translates directly to software architecture",
  "Six months. 45+ projects. Zero to production.",
  "The best time to start building is now",
  "Focus on strategy. Let AI handle the syntax.",
] as const;

export const socialBio =
  "Full Stack Prompt Engineer | TypeScript • React • Next.js • Go | Building with Claude Code | Former EA Beta Tester → Production Developer in 6 months" as const;

/**
 * Helper function to get all skills as a flat array
 */
export function getAllSkills() {
  return Object.values(skills).flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      category: category.title,
    }))
  );
}

/**
 * Helper function to get timeline milestones only
 */
export function getMilestones() {
  return timeline.filter((event) =>
    ('milestone' in event && event.milestone) || ('current' in event && event.current)
  );
}

/**
 * Helper function to get total projects from timeline
 */
export function getTotalProjects() {
  return timeline.reduce(
    (sum, event) => sum + ('projectCount' in event ? event.projectCount : 0),
    0
  );
}

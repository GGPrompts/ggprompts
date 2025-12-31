/**
 * Portfolio Projects Data
 * Generated from GitHub research on 2025-11-22
 *
 * This file contains comprehensive project information for Matt M.'s portfolio
 * @see /home/user/my-portfolio/project-data-research.json for full research data
 * @see /home/user/my-portfolio/PORTFOLIO_PROJECT_SUMMARY.md for analysis
 */

export interface ProjectLink {
  type: 'github' | 'demo' | 'docs' | 'npm';
  url: string;
  label?: string;
}

export interface Project {
  id: string;
  name: string;
  category: 'Developer Tools' | 'TUI Application' | 'Web Application' | 'Browser Extension' | 'Template' | 'Game';
  description: string;
  tagline: string;
  techStack: string[];
  keyFeatures: string[];
  links: ProjectLink[];
  stats?: {
    stars?: number;
    forks?: number;
    contributors?: number;
  };
  highlights?: string[];
  screenshots?: string[];
  demoVideo?: string;
  featured?: boolean;
  year?: number;
}

export const featuredProjects: Project[] = [
  {
    id: 'claude-global-commands',
    name: 'ClaudeGlobalCommands',
    category: 'Developer Tools',
    description: 'A comprehensive collection of optimized AI agents and workflows for Claude Code',
    tagline: 'Slash Your AI Costs by 43.7%',
    techStack: ['Python', 'YAML', 'Claude Code', 'Playwright', 'Bash'],
    keyFeatures: [
      '30+ specialized AI agents across software development, business, and infrastructure',
      '15+ multi-agent workflows for coordinated automation',
      '43.7% token reduction translating to proportional API cost savings',
      '30-45% faster workflow execution through hierarchical architecture',
      'Automated CSS regression detection using Playwright',
      '60% overhead reduction by adopting YAML format over XML',
      'Intelligent task routing through `/execute` command',
      'Production-ready, battle-tested prompts',
    ],
    highlights: [
      '43.7% token reduction = direct API cost savings',
      '30-45% faster execution through hierarchical architecture',
      'Hierarchical design replaces parallel processing for efficiency',
      'Template extraction eliminates code duplication',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/ClaudeGlobalCommands' },
    ],
    stats: {
      stars: 122,
      forks: 14,
    },
    featured: true,
    year: 2024,
  },
  {
    id: 'tfe',
    name: 'TFE',
    category: 'TUI Application',
    description: 'A powerful and clean terminal-based file explorer built with Go and Bubbletea',
    tagline: 'Terminal File Manager Meets AI',
    techStack: ['Go', 'Bubbletea', 'Lipgloss', 'Chroma', 'Glamour'],
    keyFeatures: [
      'Integrated AI prompts library with fillable input fields and variable substitution',
      'Dual-pane split-screen with live preview and syntax highlighting',
      'Full mobile support on Android/Termux with touch gestures',
      'Inline HD image previews via graphics protocols (Kitty, iTerm2, Sixel)',
      'Git workspace intelligence with visual status indicators',
      'Safe file deletion with integrated trash/recycle bin',
      'F-key shortcuts (F1-F12) inspired by Midnight Commander',
      'Context-aware help system that adapts to current mode',
    ],
    highlights: [
      'Only terminal file manager with integrated AI prompts library',
      'Works beautifully on desktop and mobile (Termux) with full touch support',
      '13-file modular architecture optimized for maintainability',
      'Native graphics protocol support for HD image rendering',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/TFE' },
    ],
    stats: {
      stars: 5,
      forks: 1,
    },
    featured: true,
    year: 2024,
  },
  {
    id: 'gg-hub',
    name: 'gg-hub',
    category: 'Web Application',
    description: 'Terminal-first developer workspace with beautiful UI',
    tagline: 'Manage 20 Projects with Integrated Terminals',
    techStack: [
      'React 19',
      'TypeScript',
      'Vite',
      'Zustand',
      'React Query',
      'React Spring',
      'xterm.js',
      'tmux',
    ],
    keyFeatures: [
      'Manages 20 projects (14 web apps + 6 TUI applications)',
      'Real-time status detection for running development servers',
      'Tabz terminal integration in resizable right sidebar',
      'Multi-terminal support with tmux session management',
      'Smart port management with automatic conflict resolution',
      '50+ developer commands in quick commands panel',
      'Green matrix-themed UI with smooth animations',
      'One-click actions for starting, stopping, and opening projects',
    ],
    highlights: [
      'Browser-based portfolio with integrated multi-terminal support',
      'Session persistence through tmux',
      'Split pane modes: horizontal, vertical, window, and background',
      'Live preview capability for running projects',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/gg-hub' },
    ],
    featured: true,
    year: 2024,
  },
  {
    id: 'tabz',
    name: 'Tabz',
    category: 'Web Application',
    description: 'Simple tab-based terminal interface with React + xterm.js',
    tagline: '15 Terminal Types in Your Browser',
    techStack: [
      'React',
      'TypeScript',
      'Vite',
      'xterm.js',
      'Node.js',
      'Express',
      'node-pty',
      'WebSocket',
      'Zustand',
    ],
    keyFeatures: [
      'Multiple terminals in browser tabs like VS Code\'s terminal panel',
      '15 terminal types: Claude Code, Bash, TFE, LazyGit, and more',
      'Terminal emulation powered by xterm.js with WebGL rendering',
      'Tmux integration with dual context menus for sessions and panes',
      'Keyboard shortcuts via Alt+Key combinations',
      'Optional gg-hub integration for auto-populated spawn menu',
      'Real-time WebSocket communication for terminal I/O',
    ],
    highlights: [
      'Persistent Node.js backend with PTY (pseudo-terminal) support',
      'Full terminal emulation including ANSI color codes and special characters',
      'Extracted from larger Opustrator project for focused functionality',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/Tabz' },
    ],
    stats: {
      stars: 1,
      contributors: 2,
    },
    featured: true,
    year: 2024,
  },
  {
    id: 'bit',
    name: 'bit',
    category: 'TUI Application',
    description: 'CLI/TUI logo designer with ANSI font library, gradients, shadows, and export options',
    tagline: '100+ Terminal Fonts with Multi-Language Export',
    techStack: ['Go', 'Bubbletea', 'Lipgloss'],
    keyFeatures: [
      '100+ embedded bitmap fonts (classic terminal, retro gaming, pixel, decorative)',
      'Color gradients (horizontal and vertical directions)',
      'Shadow effects with adjustable position and style',
      'Text scaling from 0.5x to 4x',
      '14 vibrant ANSI colors plus unlimited hex color support',
      'Multi-format export: TXT, Go, JavaScript, Python, Rust, Bash',
      'Character, word, and line spacing adjustments',
      'Multi-line text input with per-row cursor tracking',
    ],
    highlights: [
      '100+ Font Styles spanning classic, retro gaming, modern pixel, decorative designs',
      'All fonts under permissive open-source licenses for commercial use',
      'Embedded .bit files (JSON format) with go:embed for self-contained binaries',
      'Lazy loading for memory efficiency',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/bit' },
    ],
    featured: true,
    year: 2024,
  },
  {
    id: 'claude-code-cheatsheet',
    name: 'Claude Code WSL Quick Reference',
    category: 'Developer Tools',
    description: 'Browser-based interactive cheat sheet for Claude Code users new to WSL',
    tagline: 'Click-to-Copy Commands for WSL Beginners',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    keyFeatures: [
      'Click-to-copy command functionality for instant clipboard access',
      'Organized command categories across 6 main areas',
      'Add custom commands via interface with local persistence',
      'Configure Windows and WSL usernames for accurate path generation',
      'Dark theme interface optimized for extended use',
      'Browser localStorage for automatic customization saving',
      'Termux (Android terminal) support for mobile development',
    ],
    highlights: [
      'Zero external dependencies for maximum portability',
      'Responsive layout from mobile to desktop',
      'Can be deployed to GitHub Pages for personal use',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/claude-code-cheatsheet' },
    ],
    stats: {
      stars: 7,
      forks: 6,
    },
    featured: true,
    year: 2024,
  },
];

export const tuiProjects: Project[] = [
  {
    id: 'tui-classics',
    name: 'TUIClassics',
    category: 'Game',
    description: 'TUI Games! - Classic games reimagined for the terminal',
    tagline: 'Windows 95 Nostalgia Meets Modern Terminals',
    techStack: ['Go', 'Bubbletea', 'Lipgloss'],
    keyFeatures: [
      '6 classic games: Minesweeper, Solitaire, 2048, Keyboard Hero, Snake, Balatro',
      'Beautiful TUI rendering with mouse and keyboard support',
      'Integrated launcher menu for game selection',
      'Persistent high score tracking and statistics',
      'Satisfying animations (waterfalls, cascade reveals, explosions)',
      'Cross-platform compatibility (Linux, macOS, Windows)',
      'Integration with TFE (Terminal File Explorer)',
    ],
    highlights: [
      'Beautiful, fully-interactive TUI versions of classic games',
      'Windows 95 school computer days nostalgia',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/TUIClassics' },
    ],
    stats: {
      stars: 1,
    },
    year: 2024,
  },
  {
    id: 'tui-launcher',
    name: 'tui-launcher',
    category: 'TUI Application',
    description: 'Visual terminal launcher with tree navigation, multi-select spawning, and tmux integration',
    tagline: 'Organize and Launch Projects with Hierarchical Navigation',
    techStack: ['Go', 'Bubble Tea', 'Lipgloss', 'Bash'],
    keyFeatures: [
      'Hierarchical organization of projects, tools, and commands',
      'Multi-select spawning (spacebar selection, Enter to execute)',
      'Tmux integration with configurable layouts (quad splits, tiled)',
      'Context-aware execution adapting to existing sessions',
      'Project-scoped working directories',
      'Saved configuration profiles for complex setups',
    ],
    highlights: [
      'Tree navigation for intuitive browsing',
      'Automatic tmux environment detection',
      'Batch launch support for multiple commands',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/tui-launcher' },
    ],
    year: 2024,
  },
  {
    id: 'tkan',
    name: 'tkan',
    category: 'TUI Application',
    description: 'Terminal Project Tracker - Kanban board for the terminal',
    tagline: 'Visual Kanban Board with Drag-and-Drop',
    techStack: ['Go', 'Bubbletea', 'Lipgloss', 'Huh', 'YAML'],
    keyFeatures: [
      'Visual Kanban board with 5 columns: BACKLOG, TODO, PROGRESS, REVIEW, DONE',
      'Solitaire-style stacked card display with text wrapping',
      'Mouse-driven drag-and-drop between and within columns',
      'Toggleable detail panel for full card metadata',
      'Multi-project support with .tkan.yaml file discovery',
      'Keyboard navigation (arrow keys + vim bindings)',
      'GitHub Projects integration option',
      'Card lifecycle management (create, edit, delete)',
    ],
    highlights: [
      'YAML-based persistence for local storage',
      'Version control integration via plain-text files',
      'Immediate persistence on changes',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/tkan' },
    ],
    year: 2024,
  },
  {
    id: 'tmuxplexer',
    name: 'tmuxplexer',
    category: 'TUI Application',
    description: 'Tmux session manager with live previews',
    tagline: 'Manage tmux Sessions with Visual Previews',
    techStack: ['Go', 'tmux'],
    keyFeatures: [
      'View all tmux sessions at a glance',
      'Kill, attach, and detach operations',
      'Claude Code statusline integration',
      'Send keys to sessions',
      'Live preview of session contents',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/tmuxplexer' },
    ],
    year: 2024,
  },
];

export const webProjects: Project[] = [
  {
    id: 'thumb-command',
    name: 'ThumbCommand',
    category: 'Web Application',
    description: 'Mobile-optimized web dashboard for tmux, Termux & Claude Code for ARM64 Android',
    tagline: 'Beautiful Mobile-First Terminal Management',
    techStack: [
      'Vite',
      'React 18',
      'TypeScript',
      'Tailwind CSS v4',
      'shadcn/ui',
      'Express.js',
      'Socket.io',
    ],
    keyFeatures: [
      'Touch-optimized interface designed for thumb navigation',
      'Dashboard with feature navigation',
      'tmux session control (view, monitor, send commands, kill panes)',
      'Terminal interface with command history and real-time output',
      'WebSocket integration for live monitoring',
      'Progressive Web App capable',
      'Dark theme with gradient backgrounds',
    ],
    highlights: [
      'Chose Vite over Next.js - Next.js doesn\'t work on Termux ARM64 due to missing SWC binaries',
      'Mobile-first responsive design',
      'Real-time updates without manual refresh',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/ThumbCommand' },
    ],
    year: 2024,
  },
  {
    id: 'doodle-den',
    name: 'DoodleDen',
    category: 'Web Application',
    description: 'Ad-free, open-source learning app for children ages 2-4',
    tagline: 'Privacy-First Educational App for Toddlers',
    techStack: ['React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Tauri 2.0', 'Rust'],
    keyFeatures: [
      'Full-featured drawing board powered by Excalidraw',
      'Large buttons, high contrast, smooth animations for young users',
      'Dark/light mode switching',
      'Kid-friendly UI with purple, green, and blue color schemes',
      'Save and export capabilities',
      'Zero tracking - all data remains local',
      'No ads or monetization',
    ],
    highlights: [
      'Respecting their attention and development',
      'Created by a parent addressing concerns about monetized children\'s apps',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/DoodleDen' },
    ],
    year: 2024,
  },
];

export const browserExtensions: Project[] = [
  {
    id: 'tabz-chrome',
    name: 'TabzChrome',
    category: 'Browser Extension',
    description: 'Chrome extension for managing tmux sessions in a persistent sidebar',
    tagline: 'Always-Visible Terminal Access in Chrome',
    techStack: [
      'React',
      'TypeScript',
      'xterm.js',
      'Tailwind CSS',
      'Node.js',
      'Express',
      'WebSocket',
      'Chrome Manifest V3',
    ],
    keyFeatures: [
      'Display active tmux sessions in sidebar panel',
      'Switch between multiple terminal sessions with one click',
      '15+ terminal types (Bash, Claude Code, LazyGit, etc.)',
      'Full xterm.js emulation with real-time I/O',
      'Quick commands panel with built-in and custom shortcuts',
      'Always visible across all browser tabs',
      'Dark and light theme options',
      'Adjustable font sizes (12-24px)',
      'Keyboard shortcut activation (Ctrl+Shift+9)',
    ],
    highlights: [
      'Extension queries tmux every 2s (single source of truth)',
      '40% codebase complexity reduction by eliminating state sync bugs',
      'Two operation modes: spawn terminals or copy to clipboard',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/TabzChrome' },
    ],
    year: 2024,
  },
];

export const templates: Project[] = [
  {
    id: 'tui-template',
    name: 'TUITemplate',
    category: 'Template',
    description: 'TUI templates for Go with Bubble Tea, dynamic layouts, and mouse support',
    tagline: 'Production-Ready Framework for Building TUIs',
    techStack: ['Bubbletea', 'Lipgloss', 'Bubbles', 'YAML', 'Glamour', 'Huh', 'Chroma'],
    keyFeatures: [
      'Clean separation of concerns (main, types, model, update, view)',
      'Multiple layout systems (single-pane, dual-pane, multi-panel, tabbed)',
      'Complete keyboard and mouse support',
      'Pre-configured Lipgloss styles with theme support',
      'Component library (lists, inputs, dialogs, menus, tables)',
      'Visual effects library (metaballs, waves, rainbow cycling)',
      '9 template files covering all TUI aspects',
      'Project generation and scaffolding scripts',
    ],
    highlights: [
      'Production-ready framework extracting best practices from TFE',
      'YAML configuration with hot-reload support',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/TUITemplate' },
    ],
    year: 2024,
  },
  {
    id: '3d-terminals-starter',
    name: '3d-terminals-starter',
    category: 'Template',
    description: 'Template for 3D scenes with working terminals using React Three Fiber and xterm.js',
    tagline: 'Interactive 3D Environments with Functional Terminals',
    techStack: [
      'React 18',
      'React Three Fiber',
      '@react-three/drei',
      'xterm.js',
      'Vite',
      'Node.js',
      'Express',
      'WebSocket',
      'node-pty',
    ],
    keyFeatures: [
      'Interactive 3D objects with click-to-flip mechanism',
      'Real terminal access with full bash functionality',
      'Persistent sessions (terminals stay alive when flipped back)',
      'Visual effects: stars, dynamic lighting, glow effects',
      'Complete backend with WebSocket-driven terminal lifecycle',
      'xterm.js terminals rendered directly in 3D scene',
    ],
    highlights: [
      'WebSocket bridge pattern connecting React Three Fiber to xterm.js',
      'node-pty spawns actual terminal processes',
      'Bidirectional I/O piping through WebSocket',
    ],
    links: [
      { type: 'github', url: 'https://github.com/GGPrompts/3d-terminals-starter' },
    ],
    year: 2024,
  },
];

// Combine all projects for easy access
export const allProjects: Project[] = [
  ...featuredProjects,
  ...tuiProjects,
  ...webProjects,
  ...browserExtensions,
  ...templates,
];

// Helper functions
export function getProjectById(id: string): Project | undefined {
  return allProjects.find((project) => project.id === id);
}

export function getProjectsByCategory(category: Project['category']): Project[] {
  return allProjects.filter((project) => project.category === category);
}

export function getFeaturedProjects(): Project[] {
  return featuredProjects;
}

export function getTUIProjects(): Project[] {
  return [...tuiProjects, ...featuredProjects.filter(p => p.category === 'TUI Application')];
}

export function getWebProjects(): Project[] {
  return [...webProjects, ...featuredProjects.filter(p => p.category === 'Web Application')];
}

// Stats for portfolio summary
export const portfolioStats = {
  totalProjects: allProjects.length,
  totalStars: 140,
  totalForks: 20,
  categories: {
    'Developer Tools': allProjects.filter(p => p.category === 'Developer Tools').length,
    'TUI Application': allProjects.filter(p => p.category === 'TUI Application').length,
    'Web Application': allProjects.filter(p => p.category === 'Web Application').length,
    'Browser Extension': allProjects.filter(p => p.category === 'Browser Extension').length,
    'Template': allProjects.filter(p => p.category === 'Template').length,
    'Game': allProjects.filter(p => p.category === 'Game').length,
  },
  technologies: {
    languages: ['Go', 'TypeScript', 'JavaScript', 'Python', 'Rust'],
    tuiFrameworks: ['Bubbletea', 'Lipgloss', 'Bubbles', 'Huh', 'Chroma', 'Glamour'],
    webFrameworks: ['React', 'Next.js', 'Vite', 'Zustand', 'React Query', 'Framer Motion'],
    terminal: ['xterm.js', 'node-pty', 'tmux'],
  },
  achievements: [
    '43.7% token reduction in Claude Code workflows',
    '100+ ANSI fonts library with multi-language export',
    'Only terminal file manager with AI prompts library',
    '15 terminal types in browser-based emulation',
    'Mobile tmux management on ARM64 Android',
    '3D scenes with working terminal emulators',
  ],
};

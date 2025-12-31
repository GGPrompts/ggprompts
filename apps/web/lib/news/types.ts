// Types for AI News page data

export type NewsSource = 'hackernews' | 'github' | 'lobsters' | 'devto' | 'web' | 'skillsmp' | 'youtube'
export type NewsCategory = 'announcement' | 'tool' | 'tutorial' | 'discussion' | 'research' | 'release'
export type AiTool = 'claude-code' | 'gemini-cli' | 'codex'

export interface NewsHero {
  headline: string
  summary: string
  whyItMatters: string
  sourceUrl: string
  source: NewsSource
  imageUrl?: string
  videoUrl?: string
}

export interface NewsPulse {
  storiesCurated: number
  sourcesScanned: number
  toolUpdates: number
  topTopics: string[]
}

export interface TopStory {
  id: string
  title: string
  summary: string
  sourceUrl: string
  source: NewsSource
  category: NewsCategory
  imageUrl?: string
}

export interface TrendingRepo {
  id: string
  name: string
  description: string
  url: string
  stars: number
  language?: string
  topics?: string[]
}

export interface ToolUpdate {
  tool: AiTool
  version: string
  date: string
  highlights: string[]
  fullChangelogUrl: string
}

export interface NotableQuote {
  id: string
  quote: string
  author: string
  role: string
  sourceUrl: string
  avatarUrl?: string
}

export interface SourceLink {
  title: string
  url: string
  source: NewsSource
}

export interface TrendingSkill {
  id: string
  name: string
  description: string
  category: string
  stars: number
  sourceUrl: string        // GitHub repo
  marketplaceUrl: string   // SkillsMP page
}

export interface McpServer {
  id: string
  name: string
  description: string
  category: string
  installCommand: string   // e.g., "mcp-add server-name"
  sourceUrl: string
  stars?: number
}

export interface TrendingVideo {
  id: string
  title: string
  channelName: string
  channelUrl: string
  thumbnailUrl: string
  videoUrl: string
  viewCount: number
  publishedAt: string
  duration?: string        // Formatted duration (4:13)
  durationSeconds?: number // Duration in seconds for filtering
}

export interface NotableHook {
  id: string
  name: string
  type: 'PreToolUse' | 'PostToolUse' | 'Notification' | 'Stop' | string
  description: string
  sourceUrl: string
}

export interface TuiTool {
  id: string
  name: string
  description: string
  language: string
  stars: number
  url: string
  starsToday?: number
}

export interface DailyNews {
  date: string                    // ISO date (2024-01-15)
  generatedAt: string             // ISO timestamp
  promptGistUrl: string           // Link to the prompt Gist
  modelUsed: string               // e.g., "claude-opus-4-5-20251101"

  hero: NewsHero
  pulse: NewsPulse
  topStories: TopStory[]
  trendingRepos: TrendingRepo[]
  trendingSkills?: TrendingSkill[]   // Claude Code skills from SkillsMP
  newMcpServers?: McpServer[]        // New/notable MCP servers
  notableHooks?: NotableHook[]       // Claude Code hook examples
  tuiTools?: TuiTool[]               // Trending terminal UI tools
  trendingVideos?: TrendingVideo[]   // AI/coding YouTube videos
  toolUpdates: ToolUpdate[]
  notableQuotes: NotableQuote[]
  allSources: SourceLink[]
  prompt: string                  // The actual prompt used
}

// Sample data for development/template
export const sampleNewsData: DailyNews = {
  date: '2025-12-04',
  generatedAt: '2025-12-04T12:00:00Z',
  promptGistUrl: 'https://gist.github.com/GGPrompts/5444284ae0a8f096d83c966bf22012c5',
  modelUsed: 'claude-opus-4-5-20251101',

  hero: {
    headline: 'Anthropic Acquires Bun: AI Giant Absorbs Fastest JavaScript Runtime',
    summary: 'In a surprise move that sent shockwaves through the developer community, Anthropic has acquired Bun, the ultra-fast JavaScript runtime that challenged Node.js supremacy. The acquisition positions Anthropic to deeply integrate AI-native tooling directly into the JavaScript ecosystem.',
    whyItMatters: 'This signals Anthropic\'s ambition beyond LLMs into developer infrastructure. With Claude Code already leading agentic coding, owning the runtime layer could enable unprecedented AI-native development workflows where the runtime itself is AI-aware.',
    sourceUrl: 'https://bun.com/blog/bun-joins-anthropic',
    source: 'hackernews',
    imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200',
  },

  pulse: {
    storiesCurated: 24,
    sourcesScanned: 8,
    toolUpdates: 3,
    topTopics: ['Agentic Coding', 'AI Security Vulnerabilities', 'Runtime Acquisitions', 'Prompt Engineering Debate', 'GUI Agents'],
  },

  topStories: [
    {
      id: 'codex-vulnerability',
      title: 'Critical OpenAI Codex CLI Vulnerability Patched (CVE-2025-61260)',
      summary: 'Check Point Research discovered a CVSS 9.8 supply chain vulnerability allowing attackers to execute arbitrary commands via malicious .env files. OpenAI patched it in v0.23.0, but the attack vector highlights risks in AI coding tools trusting project configs.',
      sourceUrl: 'https://www.developer-tech.com/news/openai-codex-cli-patch-closes-major-supply-chain-vulnerability/',
      source: 'web',
      category: 'announcement',
    },
    {
      id: 'claude-code-web',
      title: 'Claude Code Comes to the Web: Delegate Tasks from Your Browser',
      summary: 'Anthropic launched Claude Code on the web in research preview, allowing users to assign multiple coding tasks that run on Anthropic-managed cloud infrastructure. Available for Pro, Max, Team, and Enterprise users.',
      sourceUrl: 'https://www.anthropic.com/news/claude-code-on-the-web',
      source: 'web',
      category: 'release',
    },
    {
      id: 'deepseek-math',
      title: 'DeepSeek-Math-V2: New Open-Source Mathematical Reasoning Model',
      summary: 'DeepSeek released their second-generation mathematical reasoning model, continuing to push open-source AI capabilities. The repo gained massive traction with over 1,300 GitHub stars.',
      sourceUrl: 'https://github.com/deepseek-ai/DeepSeek-Math-V2',
      source: 'github',
      category: 'release',
    },
    {
      id: 'gelab-zero',
      title: 'GELab-Zero: Step.fun Releases State-of-the-Art GUI Agent',
      summary: 'Step.fun\'s GUI Exploration Lab offers one of the best GUI agent solutions, enabling AI to interact with graphical interfaces. As agentic AI matures, GUI automation becomes critical for real-world task execution.',
      sourceUrl: 'https://github.com/stepfun-ai/gelab-zero',
      source: 'github',
      category: 'tool',
    },
  ],

  trendingRepos: [
    {
      id: 'deepseek-math-v2',
      name: 'deepseek-ai/DeepSeek-Math-V2',
      description: 'Second-generation mathematical reasoning model from DeepSeek, pushing open-source AI capabilities in formal reasoning and problem-solving.',
      url: 'https://github.com/deepseek-ai/DeepSeek-Math-V2',
      stars: 1373,
      language: 'Python',
    },
    {
      id: 'data-peek',
      name: 'Rohithgilla12/data-peek',
      description: 'A minimal, fast database client desktop application. Built for developers who want to quickly peek at their data without the bloat.',
      url: 'https://github.com/Rohithgilla12/data-peek',
      stars: 1148,
      language: 'TypeScript',
    },
    {
      id: 'gelab-zero',
      name: 'stepfun-ai/gelab-zero',
      description: 'GUI Exploration Lab - One of the best GUI agent solutions powered by Step\'s research capabilities for visual interface automation.',
      url: 'https://github.com/stepfun-ai/gelab-zero',
      stars: 808,
      language: 'Python',
    },
    {
      id: 'gemini-cli',
      name: 'google-gemini/gemini-cli',
      description: 'Open-source AI agent bringing the power of Gemini directly into your terminal with MCP support and 1M token context.',
      url: 'https://github.com/google-gemini/gemini-cli',
      stars: 15200,
      language: 'TypeScript',
    },
  ],

  toolUpdates: [
    {
      tool: 'claude-code',
      version: '2.0.57',
      date: '2025-12-03',
      highlights: [
        'Added feedback input when rejecting plans, allowing users to tell Claude what to change',
        'VSCode now supports streaming messages for real-time response display',
        'Enhanced fuzzy matching for file suggestions with faster, more accurate results',
      ],
      fullChangelogUrl: 'https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md',
    },
    {
      tool: 'gemini-cli',
      version: '0.19.1',
      date: '2025-12-03',
      highlights: [
        'New hooks system for tool execution, LLM requests/responses, and agent lifecycle integration',
        'Session browser component with /resume slash command for continuing previous sessions',
        'Policy-driven model fallback mechanism for improved reliability',
      ],
      fullChangelogUrl: 'https://github.com/google-gemini/gemini-cli/releases',
    },
    {
      tool: 'codex',
      version: '0.63.0',
      date: '2025-11-21',
      highlights: [
        'GPT-5.1-Codex-Max frontier model with extra-high reasoning effort option',
        'Native compaction support for extended coding sessions without context loss',
        'Windows Agent mode with experimental sandbox for safer autonomous execution',
      ],
      fullChangelogUrl: 'https://developers.openai.com/codex/changelog/',
    },
  ],

  notableQuotes: [
    {
      id: 'quote-1',
      quote: 'Prompt engineering is very much alive—and more important than ever. Prompt quality can make or break AI performance—especially when scaled across products.',
      author: 'Sander Schulhoff',
      role: 'Founder, Learn Prompting',
      sourceUrl: 'https://www.lennysnewsletter.com/p/ai-prompt-engineering-in-2025-sander-schulhoff',
    },
    {
      id: 'quote-2',
      quote: 'Agent-based AI systems are far more vulnerable to attacks than chatbots. As AI agents start booking flights, sending emails, and operating in humanoid form, the risks multiply.',
      author: 'Lakera Security Team',
      role: 'AI Security Researchers',
      sourceUrl: 'https://www.lakera.ai/blog/prompt-engineering-guide',
    },
    {
      id: 'quote-3',
      quote: 'A single malicious file could compromise an entire development environment. When a developer clones the repository and runs Codex, the tool automatically executes embedded commands without warnings.',
      author: 'Check Point Research',
      role: 'Security Researchers',
      sourceUrl: 'https://www.developer-tech.com/news/openai-codex-cli-patch-closes-major-supply-chain-vulnerability/',
    },
  ],

  allSources: [
    { title: 'Anthropic acquires Bun', url: 'https://bun.com/blog/bun-joins-anthropic', source: 'hackernews' },
    { title: 'DeepSeek-Math-V2', url: 'https://github.com/deepseek-ai/DeepSeek-Math-V2', source: 'github' },
    { title: 'data-peek', url: 'https://github.com/Rohithgilla12/data-peek', source: 'github' },
    { title: 'GELab-Zero', url: 'https://github.com/stepfun-ai/gelab-zero', source: 'github' },
    { title: 'Fine-tuning MedGemma', url: 'https://dev.to/googleai/a-step-by-step-guide-to-fine-tuning-medgemma-for-breast-tumor-classification-35af', source: 'devto' },
    { title: 'Claude Code on the web', url: 'https://www.anthropic.com/news/claude-code-on-the-web', source: 'web' },
    { title: 'OpenAI Codex Vulnerability Patched', url: 'https://www.developer-tech.com/news/openai-codex-cli-patch-closes-major-supply-chain-vulnerability/', source: 'web' },
    { title: 'Claude Opus 4.5 in GitHub Copilot', url: 'https://github.blog/changelog/2025-11-24-claude-opus-4-5-is-in-public-preview-for-github-copilot/', source: 'github' },
    { title: 'Gemini CLI Releases', url: 'https://github.com/google-gemini/gemini-cli/releases', source: 'github' },
    { title: 'OpenAI Codex Changelog', url: 'https://developers.openai.com/codex/changelog/', source: 'web' },
    { title: 'Claude Code Changelog', url: 'https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md', source: 'github' },
    { title: 'AI Prompt Engineering in 2025', url: 'https://www.lennysnewsletter.com/p/ai-prompt-engineering-in-2025-sander-schulhoff', source: 'web' },
    { title: 'Lakera Prompt Engineering Guide', url: 'https://www.lakera.ai/blog/prompt-engineering-guide', source: 'web' },
    { title: 'The AI Tools Nobody Builds', url: 'https://dev.to/notadevbuthere/the-ai-tools-nobody-builds-but-every-developer-secretly-needs-4bid', source: 'devto' },
    { title: 'AWS re:Invent 2025 Launches', url: 'https://dev.to/aws/9-launches-from-reinvent-season-so-far-im-excited-about-4g55', source: 'devto' },
  ],

  prompt: 'Generate AI news digest by fetching aggregated feed, searching for Claude Code/Gemini CLI/OpenAI Codex news, fetching changelogs, SkillsMP skills, MCP servers, and compiling into structured JSON with hero story, top stories, trending repos, tool updates, and notable quotes for prompt engineering audience.',
}

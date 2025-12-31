# GGPrompts - Competitive Prompting & Visual News Platform

A plan to transform GGPrompts into a competitive prompt engineering platform with AI-generated visual content, live streaming battles, and gamification for the developer/gamer crowd.

## Overview

Three major feature additions:
1. **AI-Generated Visual News** - Automated, beautifully rendered AI news
2. **Prompt Showcasing** - Screenshots, examples, and iteration history
3. **Competitive Prompting** - Head-to-head battles, streaming, leaderboards

---

## Part 1: AI-Generated Visual News Page

### Concept

Not another text-based news feed. AI-generated visual journalism using the `project-visual` template style from `portfolio-style-guides`:
- Masonry grids
- 3D card effects
- Animated statistics
- Before/after comparisons
- Interactive galleries

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Cron/Scheduler │────▶│  Claude -p      │────▶│  Supabase       │
│  (nightly)      │     │  news-gen.md    │     │  stories table  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                                ┌─────────────────┐
                                                │  /news page     │
                                                │  Visual render  │
                                                └─────────────────┘
```

### Story Data Structure

```typescript
interface GeneratedStory {
  id: string
  headline: string
  summary: string
  sections: StorySection[]
  images: string[]           // Generated via Gemini or sourced
  sources: string[]
  promptVersion: string      // Link to gist version
  generatedAt: Date
  tokensUsed: number
}

type StorySection =
  | { type: 'stat'; label: string; value: string; change?: string }
  | { type: 'comparison'; before: string; after: string }
  | { type: 'gallery'; images: string[]; captions: string[] }
  | { type: 'quote'; text: string; author: string }
  | { type: 'timeline'; events: { date: string; title: string }[] }
  | { type: 'code'; language: string; snippet: string }
```

### Prompt Transparency Feature

Each news page includes:
- Link to the prompt gist that generated it
- Version number (e.g., "Generated with prompt v23")
- Changelog showing prompt evolution

```markdown
## Prompt Changelog
- v23: Added source verification step
- v20: Switched to structured JSON output
- v15: Removed "be concise" - was cutting too much
- v12: Added visual component hints for better rendering
- v1: Initial prompt
```

**Value**: People learning prompt engineering see real iteration, not just finished prompts.

### Automation Options

**Option A: Standalone cron**
```bash
# crontab
0 6 * * * cd ~/projects/ggprompts-next && claude -p "$(cat prompts/news-gen.md)" --allowedTools Bash,Read,Write,WebSearch
```

**Option B: Jobs system integration**
Use existing jobs infrastructure from `personal-homepage` to manage runs, view results inbox, handle failures.

---

## Part 2: Enhanced Prompt Showcasing

### The Problem

Most prompt sites are walls of text:
```
Here's a prompt: [giant text block]
Tags: coding, refactor
Upvotes: 234
```

No proof it works. No examples. No iteration history.

### The Solution

Each prompt on GGPrompts includes:

| Element | Description |
|---------|-------------|
| **Screenshots** | Gallery of actual outputs |
| **Before/After** | For refactoring/editing prompts |
| **Example Projects** | Real projects it was used on |
| **Failure Cases** | What it doesn't handle well |
| **Iteration History** | How it evolved (git-backed) |
| **Try It** | Interactive demo with example inputs |
| **Community Results** | User-submitted screenshots |

### Visual Template Integration

Use templates from `portfolio-style-guides`:
- `project-visual` for showcase galleries
- `project-case-study` for detailed prompt breakdowns
- `comparison` template for before/after
- Masonry grids for community screenshots

---

## Part 3: Competitive Prompting (Esports)

### Concept

"GG" in GGPrompts = "Good Game"

Target audience: Gamers, especially RTS players (SC2, etc.) who already think in terms of:
- APM (actions per minute)
- Build orders
- Resource management
- Parallel execution
- Optimization

### Competition Formats

| Mode | Terminals | Tokens | Time | Description |
|------|-----------|--------|------|-------------|
| **One-shot** | 1 | Single prompt | 60 sec | Pure prompt skill, great for clips |
| **Sprint** | 1 | 50k cap | 5 min | Tight economy, no waste |
| **Standard** | 2 | 200k cap | 15 min | Balanced, good for streaming |
| **Chaos** | Unlimited | Unlimited | 10 min | Subagent spam, max parallelism |
| **Eco** | 1 | 25k cap | 10 min | Big brain efficiency plays |

### One-Shot Battles (Clip-Friendly)

Perfect for short attention spans:
- Single prompt, one chance
- Output renders in 30-60 seconds
- Side-by-side comparison
- Viewer vote determines winner
- Easy to compile "best of" reels
- Shareable, debatable

### Live Stats Overlay

```
┌─────────────────────────────────────────────────────────────┐
│  PLAYER 1                      │  PLAYER 2                  │
│  ████████░░ 340k tokens        │  ███░░░░░░ 125k tokens     │
│                                │                            │
│  Tools: 47                     │  Tools: 23                 │
│  ├─ Read: 18                   │  ├─ Read: 12               │
│  ├─ Edit: 12                   │  ├─ Edit: 6                │
│  ├─ Bash: 9                    │  ├─ Bash: 3                │
│  └─ Task: 8 (subagents)        │  └─ Task: 2                │
│                                │                            │
│  [Live terminal feed]          │  [Live terminal feed]      │
└─────────────────────────────────────────────────────────────┘
│                    ⏱️ 4:32 remaining                         │
│              Chat voting: 52% vs 48%                        │
└─────────────────────────────────────────────────────────────┘
```

### Tracking via Hooks

Claude Code hooks can capture:
- Every tool call (Read, Write, Edit, Bash, Task)
- Token usage per message
- Subagent spawns
- Timing data

Pipe to overlay for live streaming stats.

### Handicap System

Higher ranked players get constraints:
- Fewer terminals allowed
- Token deficit
- No subagents
- Shorter time limit

Forces creative solutions, keeps matches competitive.

### Seasonal Metas

Rotate rules to keep it fresh:
- "This month: no subagents"
- "Haiku mode: prompts under 100 words"
- "Legacy: Claude 2.1 only"
- "Eco season: 25k token cap"

### Leaderboards

Use existing templates from `portfolio-style-guides`:
- Global rankings
- Mode-specific rankings
- Efficiency ratings (output quality / tokens spent)
- Win streaks
- Tournament brackets

---

## Part 4: Streaming Infrastructure

### TabzChrome Integration

Use `TabzChrome-simplified` for perfect streaming setup:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Chrome Window (single OBS capture)                                  │
├─────────────────────────────────────────┬───────────────────────────┤
│                                         │  TabzChrome Sidebar       │
│                                         │  ┌─────────────────────┐  │
│    Live App Preview                     │  │ > Building dashboard │  │
│    (localhost:3000)                     │  │   with auth...       │  │
│                                         │  │                      │  │
│    [The actual UI being built]          │  │ Claude: Creating     │  │
│                                         │  │ login component...   │  │
│                                         │  │                      │  │
│                                         │  │ ████░░ 45k tokens    │  │
│                                         │  └─────────────────────┘  │
└─────────────────────────────────────────┴───────────────────────────┘
```

Benefits:
- One window capture for everything
- Prompt and output visible together
- No scene switching needed
- Works for head-to-head (two Chrome windows)

### Streamer Mode

Auto-redact sensitive data for safe streaming:

```
[x] Streamer Mode
    [x] Hide env variables (API_KEY=****)
    [x] Anonymize paths (/home/player/)
    [x] Redact bearer tokens
    [x] Blur .env file contents
    [x] Sanitize connection strings
```

**Required for ranked play** - prevents accidental leaks and info sharing.

### Patterns to Redact

```typescript
const redactPatterns = [
  /API_KEY=.*/g,
  /Bearer [A-Za-z0-9-_]+/g,
  /\/home\/\w+\//g,  // Replace with /home/player/
  /postgres:\/\/.*@/g,
  /GITHUB_TOKEN=.*/g,
  /sk-[A-Za-z0-9]+/g,  // OpenAI keys
  /anthropic_[A-Za-z0-9]+/g,
]
```

---

## Implementation Phases

### Phase 1: Visual News Page
1. Create `/news` route
2. Design story schema and Supabase table
3. Build visual story renderer using portfolio templates
4. Write initial news generation prompt
5. Set up nightly cron automation
6. Add prompt gist integration with version display

### Phase 2: Enhanced Prompt Showcasing
1. Add screenshot upload to prompts
2. Build gallery view for prompt outputs
3. Add iteration history (git-backed)
4. Create "Try It" interactive demo component
5. Add community screenshots feature

### Phase 3: Competitive Infrastructure
1. Build competition lobby system
2. Integrate Claude Code hooks for stats tracking
3. Create real-time overlay components
4. Build voting system
5. Implement leaderboards (use existing templates)

### Phase 4: Streaming Features
1. Add streamer mode to TabzChrome
2. Build stats overlay components
3. Create tournament bracket system
4. Add replay/clip saving

---

## Technical Resources

### Existing Assets

| Resource | Location | Use |
|----------|----------|-----|
| Visual templates | `~/projects/portfolio-style-guides` | News page, leaderboards |
| Theme system | 10 themes, 6 backgrounds | Customization |
| Jobs infrastructure | `~/projects/personal-homepage` | Automation |
| Terminal sidebar | `~/projects/TabzChrome-simplified` | Streaming |
| Prompt library | GGPrompts existing | Content |

### Key Templates to Use

From `portfolio-style-guides`:
- `project-visual` - News story showcase
- `leaderboard` - Rankings
- `comparison` - Before/after
- `dashboard` - Stats display
- `timeline` - Prompt evolution history

---

## Success Metrics

- Daily active users viewing news
- Prompts submitted with screenshots
- Competitions hosted per week
- Average viewer count on streams
- Prompt gist forks
- Community screenshot submissions

---

## Notes

- "Go hard now" - leverage current AI pricing while it lasts
- Build reusable infrastructure that reduces future AI dependency
- Target the RTS/gamer demographic with competitive framing
- One-shot battles = shareable content = organic growth
- Prompt transparency differentiates from every other prompt site

---

*Document created from brainstorming session - December 2024*

---
description: Generate daily AI news digest for GGPrompts
---

# Daily AI News Digest Generator

Generate a daily AI news digest for GGPrompts. Gather real data from multiple sources, then write to the site.

## Step 0: Options Menu

Before fetching any data, use AskUserQuestion to present these options:

**Question 1: "What would you like to do?"**
- **Preview only** - Fetch data and output JSON without writing files (for testing)
- **Generate and save** - Fetch data, write files, and auto-commit+push to git
- **Regenerate section** - Only regenerate a specific section (no auto-commit)

**Question 2 (if "Regenerate section" selected): "Which section(s)?" (multi-select)**
- Tool Updates (Claude Code, Gemini CLI, Codex changelogs)
- Trending Skills (from SkillsMP)
- MCP Servers (from catalog)
- Claude Code Hooks (from docs/GitHub)
- TUI Tools (terminal UI tools from GitHub)
- Top Stories (from feed + web search)
- Trending Videos (from YouTube API)

If regenerating sections, read the existing `lib/news/data/latest.json` first, then only fetch/update the selected section(s).

## Step 1: Fetch Data Sources

Fetch all of these in parallel:

1. **Aggregated feed**: https://personal-homepage-virid.vercel.app/api/feed
   - Filter for AI/LLM/coding-related content

2. **Web searches** (run all in parallel):
   - "Claude Code news" for the current month and year
   - "Gemini CLI updates" for the current month and year
   - "OpenAI Codex news" for the current month and year
   - "AI prompt engineering news" for the current month and year
   - "new MCP server site:github.com" for the current month and year
   - "Claude Code hooks examples" for the current month and year
   - "terminal TUI tool site:github.com" for the current month and year

3. **Trending GitHub repos**: Use `trotd --json -n 20 -p gh` to get today's trending repos
   - Filter for AI/LLM/coding-related repos (look for keywords: ai, llm, agent, mcp, rag, prompt, coding)
   - Pick 4 most relevant repos for prompt engineers
   - Use the `url`, `description`, `language`, and `stars_today` fields from the output

4. **Changelogs** (fetch in parallel):
   - https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
   - https://github.com/google-gemini/gemini-cli/releases
   - https://developers.openai.com/codex/changelog/

5. **Claude Skills**: https://skillsmp.com/feed.xml
   - Pick 4 trending/new skills relevant to prompt engineering
   - Credit SkillsMP as the source
   - Set stars to 0 (SkillsMP doesn't provide repo URLs in a parseable format)

6. **MCP Servers**: Search the Docker MCP catalog using mcp-find
   - Run multiple searches: "mcp" (limit 30), "ai", "database", "api", "dev"
   - Look for servers with detailed descriptions indicating recent updates
   - Pick 4 interesting/useful servers that would benefit prompt engineers and AI developers
   - Include the install command format: `mcp-add {server-name}`
   - These servers are part of the Docker MCP toolkit and can be dynamically enabled

7. **YouTube Videos**: Fetch from `/api/youtube/trending?minDuration=180` endpoint
   - First, check if the dev server is running: `curl -s http://localhost:4001 > /dev/null`
   - If not running OR if locked (check for `.next/dev/lock`), kill any existing process first:
     ```bash
     pkill -f "next dev" 2>/dev/null; sleep 2
     npm run dev &
     sleep 8  # Wait for server to be ready
     ```
   - Use `minDuration=180` (3 minutes) to filter out shorts and get substantive content
   - The endpoint searches for: Claude Code, AI prompt engineering, Cursor AI, AI coding
   - Returns top videos from the last 7 days sorted by view count
   - Pick 4 most relevant videos for prompt engineers
   - **Fallback**: If the API returns an error (missing key or server issues), keep the previous day's trendingVideos from latest.json, but update view counts via web search if possible

8. **Claude Code Hooks**: Search for hook examples and patterns
   - Fetch official docs: `https://code.claude.com/docs/en/hooks` (canonical URL, avoid redirects)
   - Also check: `https://blog.gitbutler.com/automate-your-ai-workflows-with-claude-code-hooks`
   - Search GitHub for "claude code hooks" or "claude-code hooks"
   - Look for hooks in categories: PreToolUse, PostToolUse, Notification, SessionStart, Stop
   - Pick 2-3 interesting/useful hook examples with descriptions
   - Include the hook type and a practical use case for each

9. **TUI Tools**: TUI tools rarely appear in daily GitHub trending. Use these sources instead:
   - Fetch curated list: `https://github.com/rothgar/awesome-tuis` for comprehensive options
   - Web search for recent bubbletea (Go) and ratatui (Rust) projects
   - **Safe defaults** (well-maintained, popular): lazygit, yazi, k9s, gitui, posting, rainfrog
   - Pick 3-4 tools, mixing established favorites with newer discoveries
   - Include: name, description, language, stars (can estimate from awesome-tuis), GitHub URL
   - Focus on tools useful for productivity, dev workflows, or beautiful terminal experiences

## Step 1.5: Deduplicate Against Recent Digests

Before generating the digest, check for duplicate content from recent days:

1. **Read recent digests**: Glob for `lib/news/data/2025-*.json` and get the **14 most recent files** (excluding today)
2. **Extract hero URLs from all 14 days** - hero stories should NEVER repeat within two weeks (matches web search lookback):
   ```bash
   jq -r '.hero.sourceUrl' lib/news/data/2025-12-{04,05,06,07,08,09,10,11,12,13,14,15,16,17}.json 2>/dev/null | sort -u
   ```
   (Adjust date range to cover 14 most recent files)
3. **Extract top stories/repos from last 3 days** - these can repeat after 3 days if still relevant:
   ```bash
   jq -r '.topStories[].sourceUrl, .trendingRepos[].url' lib/news/data/2025-12-{12,13,14}.json 2>/dev/null | sort -u
   ```
   (Adjust the date ranges to match the most recent files)
4. **Build exclusion sets**:
   - **Hero exclusion set**: All hero URLs from past 14 days
   - **Story exclusion set**: Top stories and repos from past 3 days
5. **Apply during selection**:
   - **Hero**: MUST NOT use any URL from the 14-day hero exclusion set. Pick the next best story.
   - **Top Stories**: Avoid URLs from 3-day story exclusion set. If a story is too important to skip, reframe it with a fresh angle.
   - **Trending Repos**: Prefer repos not featured in the last 3 days, but okay to repeat if still trending
6. **Log duplicates found**: Note any stories that were skipped due to recent coverage

This ensures each day's digest feels fresh and hero stories don't repeat within two weeks.

## Step 2: Generate JSON

Create a JSON object matching the DailyNews interface in `lib/news/types.ts`.

Key sections to populate:
- **hero**: The single most compelling story (acquisitions, major releases, security issues)
- **pulse**: Stats about curation (stories count, sources scanned, tool updates, top 4-5 topics)
- **topStories**: 4 most interesting stories for prompt engineers
- **trendingRepos**: 4 relevant GitHub repos with real star counts
- **trendingSkills**: 4 Claude Code skills from SkillsMP (include both GitHub and marketplace URLs)
- **newMcpServers**: 3-4 new/notable MCP servers with install commands
- **notableHooks**: 2-3 interesting Claude Code hook examples with type and description
- **tuiTools**: 3-4 trending terminal UI tools (bubbletea, ratatui, textual ecosystem)
- **trendingVideos**: 4 AI/coding YouTube videos (tutorials, news, podcasts)
- **toolUpdates**: Latest versions of Claude Code, Gemini CLI, and Codex with 3 highlights each
- **notableQuotes**: 3 interesting quotes from the sources (not marketing fluff)
- **allSources**: All sources used, with proper attribution

## Step 3: Editorial Guidelines

- **Hero**: Pick the most compelling story - acquisitions, major releases, security issues get priority
- **Top Stories**: Prioritize actionable news for prompt engineers and AI developers
- **Skills**: Always credit SkillsMP (https://skillsmp.com) as the source
- **MCP Servers**: Focus on practical tools (databases, APIs, dev tools)
- **Hooks**: Include the hook type (PreToolUse, PostToolUse, etc.) and practical use case
- **TUI Tools**: Highlight tools from charm.sh/bubbletea (Go) and ratatui (Rust) ecosystems. Focus on beautiful, productive terminal experiences
- **Videos**: Prioritize tutorials, deep-dives, and genuine content over clickbait. Prefer videos from known AI/dev creators (Fireship, Matt Wolfe, AI Explained, etc.)
- **Quotes**: Find genuine insights from developers/researchers, not PR statements
- **Tone**: Engaging but not sensational; informative for a technical audience
- **Images**: Use relevant Unsplash URLs for the hero image when appropriate

## Step 4: Write to Site (if not preview mode)

**If "Preview only" was selected:**
- Output the complete JSON to the conversation
- Do NOT write any files
- End with: "Preview complete. Run again and select 'Generate and save' to write files."

**If "Generate and save" or "Regenerate section" was selected:**
1. Read the current date and format as YYYY-MM-DD
2. Set `generatedAt` to the actual current UTC timestamp (e.g., `new Date().toISOString()`)
3. **Validate JSON structure** before writing:
   - Ensure all required fields are present (hero, pulse, topStories, trendingRepos, toolUpdates, notableQuotes, allSources)
   - Verify arrays have expected lengths (4 stories, 4 repos, 3 tool updates, etc.)
   - Check that all URLs are valid (no placeholders or empty strings)
4. Write the JSON to: `lib/news/data/YYYY-MM-DD.json`
5. Copy to: `lib/news/data/latest.json`
6. Confirm what was written

Do NOT modify `lib/news/types.ts` - the page reads from the JSON files.

## Step 5: Verify

Run `npm run build` to ensure no TypeScript errors from the new data.

## Step 6: Commit and Push (if "Generate and save" selected)

**Only for "Generate and save" mode** (not preview or regenerate section):

After the build passes, automatically commit and push the changes:

1. Stage the new files: `git add lib/news/data/YYYY-MM-DD.json lib/news/data/latest.json`
2. Commit with a descriptive message summarizing the digest content:
   ```
   content: add daily AI news digest for {date}

   - Hero: {brief hero summary}
   - Top stories: {2-3 story titles}
   - New MCP servers: {server names}
   - Notable hooks: {hook names}
   - TUI tools: {tool names}
   - Skills: {skill names}

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
   ```
3. Push to origin: `git push`
4. Confirm the push was successful

This allows the command to run unattended (e.g., before bed) and have everything committed and deployed.

## Attribution Requirements

Always include these in the allSources array:
- `{ "title": "SkillsMP - Claude Skills Marketplace", "url": "https://skillsmp.com", "source": "skillsmp" }` (if skills were included)
- Any other aggregators used

## Example Output Structure

```json
{
  "date": "YYYY-MM-DD",  // Use actual current date
  "generatedAt": "YYYY-MM-DDTHH:MM:SSZ",  // Use actual current UTC timestamp
  "promptGistUrl": "https://gist.github.com/GGPrompts/5444284ae0a8f096d83c966bf22012c5",
  "modelUsed": "claude-opus-4-5-20251101",
  "hero": { ... },
  "pulse": { ... },
  "topStories": [ ... ],
  "trendingRepos": [ ... ],
  "trendingSkills": [ ... ],
  "newMcpServers": [ ... ],
  "notableHooks": [
    {
      "name": "Pre-commit Linter",
      "type": "PreToolUse",
      "description": "Runs ESLint before any file write operations",
      "sourceUrl": "https://github.com/..."
    }
  ],
  "tuiTools": [
    {
      "name": "lazygit",
      "description": "Simple terminal UI for git commands",
      "language": "Go",
      "stars": 45000,
      "url": "https://github.com/jesseduffield/lazygit"
    }
  ],
  "trendingVideos": [ ... ],
  "toolUpdates": [ ... ],
  "notableQuotes": [ ... ],
  "allSources": [ ... ],
  "prompt": "Generated via /generate-news slash command. Claude fetches data from 9 sources in parallel (aggregated RSS feed, 7 web searches, GitHub trending via trotd, SkillsMP feed, Claude Code/Gemini CLI/Codex changelogs, Docker MCP catalog via mcp-find, YouTube trending API, Claude Code hooks docs, awesome-tuis list), deduplicates against the past 7 days of digests, then curates into structured JSON."
}
```

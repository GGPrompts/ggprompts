# 🚀 Quick Start - Using Claude.ai Today

**Budget**: $986 remaining
**Goal**: Build project pages while company is here
**Strategy**: Multiple Claude.ai sessions in parallel → merge branches later

---

## ✅ **Setup Complete!**

Your repo is now organized and ready:
- ✅ Portfolio homepage merged to master
- ✅ Templates safe in `/app/templates/` (NEVER EDIT)
- ✅ Session tracker created: `CLAUDE_AI_SESSIONS.md`
- ✅ Repo organization plan: `REPO_ORGANIZATION.md`

---

## 🎯 **Next 3 Sessions (High ROI)**

### **Session 1: Individual Project Pages** (~$350, HIGH VALUE)

**Copy this to Claude.ai:**
```
Build individual project pages for my top 12 projects.

CRITICAL RULES:
- Create files at /app/projects/[slug]/page.tsx
- DO NOT edit anything in /app/templates/ (use as reference only)
- Use data from /lib/projects-data.ts
- Each page needs: hero, features, tech stack, screenshots, GitHub link

Build these 12 projects using parallel Opus agents (6 at a time):

1. ClaudeGlobalCommands - Use /app/templates/case-study/ as reference
   - 122 stars, 14 forks
   - Highlight: 43.7% token reduction

2. TabzChrome - Use /app/templates/project-visual/ as reference
   - Chrome extension showcase

3. terminal-tabs - Use /app/templates/project-technical/ as reference
   - Full-featured terminal app

4. TFE - Use /app/templates/project-technical/ as reference
   - Terminal file manager with AI prompts

5. Modular3d - Use /app/templates/project-visual/ as reference
   - 3D terminals in space

6. GGPrompts - Use /app/templates/saas-landing/ as reference
   - Live site: ggprompts.com

7. bit - Use /app/templates/project-visual/ as reference
   - ANSI logo designer, 100+ fonts

8. tkan - Use /app/templates/project-technical/ as reference
   - Kanban TUI

9. gg-hub - Use /app/templates/project-technical/ as reference
   - Developer workspace manager

10. tmuxplexer - Use /app/templates/project-technical/ as reference
    - Tmux session manager TUI

11. TUIClassics - Use /app/templates/project-visual/ as reference
    - Terminal games collection

12. Oblique - Use /app/templates/project-visual/ as reference
    - Tilt-based PWA

Create /public/screenshots/[project-name]/ directories for screenshots.
Add placeholder images where needed.
Link from featured projects section on homepage.
```

**Expected Output:**
- Branch: `claude/build-project-pages-xxxxx`
- 12 new pages in `/app/projects/[slug]/page.tsx`
- Screenshot directories created
- Updated navigation/routing

---

### **Session 2: Projects Gallery Page** (~$250, HIGH VALUE)

**Copy this to Claude.ai:**
```
Build a comprehensive projects gallery page at /app/projects/page.tsx

CRITICAL RULES:
- DO NOT edit /app/templates/
- Reference /app/templates/search-results/ for inspiration only

Features to implement:
1. Masonry grid layout displaying all 45+ projects
2. Filter by category:
   - TUI (Terminal User Interface)
   - Web Applications
   - 3D Applications
   - Go CLI Tools
   - AI Tools
   - Chrome Extensions
   - All

3. Search bar (searches: name, description, tech stack, tags)

4. Tag filtering system
   - Each project has tags from tech stack
   - Click tag to filter
   - Show tag count

5. Sort options:
   - Most Stars
   - Most Recent
   - Alphabetical
   - Most Forks

6. Project cards show:
   - Screenshot/thumbnail (or placeholder)
   - Project name
   - Description (truncated)
   - GitHub stars/forks
   - Tech stack badges
   - Link to /app/projects/[slug]

7. Animations:
   - Framer Motion fade-in
   - Hover effects on cards
   - Smooth filter transitions

Use data from /lib/projects-data.ts
Match terminal theme aesthetic
Mobile responsive
```

**Expected Output:**
- Branch: `claude/build-projects-gallery-xxxxx`
- New file: `/app/projects/page.tsx`
- Filterable, searchable gallery
- Links to individual project pages

---

### **Session 3: Project Screenshots** (~$150, MEDIUM VALUE)

**Copy this to Claude.ai:**
```
Help organize project screenshots and create placeholders.

Tasks:
1. Create directory structure:
   /public/screenshots/[project-name]/
   For each of the 12 projects from Session 1

2. For each project, list what screenshots should be taken:
   - Main interface screenshot
   - Feature highlights (2-3)
   - Demo GIF/video (for TUI apps)

3. Create placeholder images using canvas-design skill:
   - Terminal-themed placeholder with project name
   - 1200x630 size (good for OG images too)
   - Phosphor green aesthetic
   - Include tech stack icons/badges

4. Create OBS recording guide for TUI apps:
   - Settings for terminal recording
   - Recommended resolution
   - Export settings
   - Example workflow

5. Generate mock screenshots for projects without live demos:
   - Use canvas-design skill
   - Create terminal-style mockups
   - Show key features visually

DO NOT edit /app/templates/
```

**Expected Output:**
- Branch: `claude/add-project-media-xxxxx`
- Screenshot directories created
- Placeholder images generated
- OBS recording guide

---

## ⚡ **Running Parallel Sessions**

Open 3 browser tabs on Claude.ai:
- **Tab 1**: Session 1 (Project Pages)
- **Tab 2**: Session 2 (Gallery)
- **Tab 3**: Session 3 (Screenshots)

Each session:
1. Creates its own branch
2. Works on different files (no conflicts!)
3. Commits & pushes automatically

---

## 🔀 **End of Day: Merge Everything**

```bash
# 1. Fetch all new branches
cd /home/matt/projects/my-portfolio
git fetch --all

# 2. View Claude branches
git branch -a | grep claude

# 3. Checkout master
git checkout master

# 4. Merge each session (one at a time)
git merge claude/build-project-pages-xxxxx
git merge claude/build-projects-gallery-xxxxx
git merge claude/add-project-media-xxxxx

# 5. Push to origin
git push origin master

# 6. Done! 🎉
```

---

## 📊 **Quick Reference**

**Templates Location**: `/app/templates/` (27 templates, DO NOT EDIT)

**Build Locations** (OK to create/edit):
- Project pages: `/app/projects/[slug]/page.tsx`
- Gallery: `/app/projects/page.tsx`
- Screenshots: `/public/screenshots/[project-name]/`
- New components: `/components/`
- New data: `/lib/`

**Available Templates for Reference**:
- Case Study: `/app/templates/case-study/`
- Technical: `/app/templates/project-technical/`
- Visual: `/app/templates/project-visual/`
- SaaS: `/app/templates/saas-landing/`
- Timeline: `/app/templates/timeline/`

**Current Homepage**: http://localhost:3000
- Hero with Terminal Velocity
- Featured 6 projects
- About section
- Contact section

---

## ✅ **After Claude.ai Sessions**

Update `CLAUDE_AI_SESSIONS.md`:
```markdown
### ✅ Session 2: Individual Project Pages
**Branch**: claude/build-project-pages-xxxxx (paste actual branch name)
**Credits Used**: ~$XXX (check usage)
**Date**: Nov 22, 2025
**Status**: ✅ Complete, ready to merge
```

---

## 🎯 **Success Metrics**

By end of today, you should have:
- ✅ 12 individual project pages
- ✅ Projects gallery with filter/search
- ✅ Screenshot organization + placeholders
- ✅ All branches merged to master
- ✅ Ready to deploy to Vercel

**Budget Used**: ~$750 of $986
**Budget Remaining**: ~$236 (for tomorrow's polish/deploy)

---

**Ready to start?** Open 3 Claude.ai tabs and copy the session prompts! 🚀

**Track progress in**: `CLAUDE_AI_SESSIONS.md`

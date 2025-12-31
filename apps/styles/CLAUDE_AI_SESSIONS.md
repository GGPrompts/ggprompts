# Claude.ai Build Sessions - Tracker & Instructions

**Project**: my-portfolio
**Budget**: $986 remaining (as of Nov 22, 2025)
**Goal**: Build out portfolio pages using templates as reference (DO NOT EDIT TEMPLATES)

---

## 🎯 **Golden Rules for Claude.ai Sessions**

### **CRITICAL: Protect Templates**
```
✅ DO: Reference templates for inspiration
✅ DO: Build NEW pages in /app/projects/, /app/about/, etc.
❌ DON'T: Edit anything in /app/templates/
❌ DON'T: Modify template files directly
```

### **File Organization**
```
/app/templates/          ← NEVER TOUCH (27 production templates)
/app/page.tsx            ← Portfolio homepage ✅ (done)
/app/projects/           ← Individual project pages (BUILD HERE)
/app/projects/page.tsx   ← Projects gallery (BUILD HERE)
/app/about/              ← About page (BUILD HERE)
/components/             ← Shared components (OK to add)
/lib/                    ← Data files (OK to add/modify)
/public/                 ← Assets (OK to add)
```

### **Branching Strategy**
- Each Claude.ai session creates a new branch: `claude/feature-name-xxxxx`
- Always start from `master` branch
- Merge branches at end of day
- No conflicts since each session works on different files

---

## 📋 **Completed Sessions**

### ✅ Session 1: Portfolio Homepage
**Branch**: `claude/design-portfolio-page-012agigmW4WJgBcvENfegW4U` (MERGED to master)
**Credits Used**: ~$200-300
**Date**: Nov 22, 2025

**What Was Built:**
- Portfolio homepage (`/app/page.tsx`)
- HeroSection.tsx - "Terminal Velocity" hero
- FeaturedProjects.tsx - Top 6 projects
- AboutSection.tsx - Journey narrative
- ContactSection.tsx - Contact info
- Terminal Velocity artwork (PNG + PDF)
- Projects data (22 GitHub repos analyzed)
- Portfolio content data

**Files Created**: 22 files, 5,566+ lines
**Status**: ✅ Merged to master, pushed to origin

---

## 🚧 **Planned Sessions**

### Session 2: Individual Project Pages
**Target Branch**: `claude/build-project-pages-xxxxx`
**Estimated Credits**: $300-400
**Priority**: HIGH

**Scope:**
Build 12 individual project pages at `/app/projects/[slug]/page.tsx`

**Projects to Build:**
1. **ClaudeGlobalCommands** - Use Case Study template as reference
2. **TabzChrome** - Use Visual Showcase template
3. **terminal-tabs** - Use Technical Deep Dive template
4. **TFE** - Use Technical Deep Dive template
5. **Modular3d** - Use Visual Showcase template
6. **GGPrompts** - Use SaaS Landing template
7. **bit** - Use Visual Showcase template
8. **tkan** - Use Project Technical template
9. **gg-hub** - Use Project Technical template
10. **tmuxplexer** - Use Project Technical template
11. **TUIClassics** - Use Visual Showcase template
12. **Oblique** - Use Visual Showcase template

**Instructions for Claude.ai:**
```
Build individual project pages for my top 12 projects.

IMPORTANT:
- Create files at /app/projects/[slug]/page.tsx
- Reference templates in /app/templates/ for inspiration (DO NOT EDIT TEMPLATES)
- Use data from /lib/projects-data.ts
- Add screenshots to /public/screenshots/[project-name]/
- Each page should have: hero, features, tech stack, screenshots, GitHub link

Use parallel Opus agents to build 6 pages simultaneously, then 6 more.

Projects list: [paste from above]
```

---

### Session 3: Projects Gallery Page
**Target Branch**: `claude/build-projects-gallery-xxxxx`
**Estimated Credits**: $200-300
**Priority**: HIGH

**Scope:**
Build comprehensive projects gallery at `/app/projects/page.tsx`

**Features Needed:**
- Display all 45+ projects in masonry grid
- Filter by category (TUI, Web, 3D, Go, AI, Chrome)
- Search functionality
- Tag filtering
- Sort by stars/date/name
- Link to individual project pages

**Instructions for Claude.ai:**
```
Build a comprehensive projects gallery page at /app/projects/page.tsx

Features:
- Masonry grid layout of all projects
- Filter by category (TUI, Web, 3D, Go, AI, Chrome Extensions)
- Search bar (searches name, description, tech stack)
- Tag filtering system
- Sort options (stars, date, name)
- Links to individual project pages at /app/projects/[slug]

Use data from /lib/projects-data.ts
Reference /app/templates/search-results/ for inspiration (DO NOT EDIT TEMPLATE)
```

---

### Session 4: Screenshots & Media
**Target Branch**: `claude/add-project-media-xxxxx`
**Estimated Credits**: $100-200
**Priority**: MEDIUM

**Scope:**
Generate/organize project screenshots and demos

**Deliverables:**
- Screenshot organization in `/public/screenshots/[project-name]/`
- Guide for recording TUI demos with OBS
- Placeholder images where needed
- Image optimization

**Instructions for Claude.ai:**
```
Help organize project screenshots and media assets.

Tasks:
1. Create directory structure: /public/screenshots/[project-name]/
2. List what screenshots are needed for each project
3. Create placeholder images with project names (using canvas-design skill)
4. Provide OBS recording guide for TUI apps
5. Generate mock screenshots for projects without live demos
```

---

### Session 5: About & Resume Pages
**Target Branch**: `claude/build-about-resume-xxxxx`
**Estimated Credits**: $100-200
**Priority**: MEDIUM

**Scope:**
Build dedicated About and Resume pages

**Deliverables:**
- `/app/about/page.tsx` - Expanded about section
- `/app/resume/page.tsx` - Link to terminal resume template
- Skills showcase
- Timeline visualization

**Instructions for Claude.ai:**
```
Build About and Resume pages.

1. About Page (/app/about/page.tsx):
   - Expanded journey narrative
   - Skills taxonomy with proficiency levels
   - Interactive timeline
   - Philosophy on AI-assisted development
   - Reference /app/templates/timeline/ (DO NOT EDIT)

2. Resume Page (/app/resume/page.tsx):
   - Redirect to /templates/resume-terminal
   - OR: Build custom resume using Terminal Resume template as reference
   - Download PDF option
```

---

### Session 6: SEO & Deploy Prep
**Target Branch**: `claude/seo-deploy-prep-xxxxx`
**Estimated Credits**: $50-100
**Priority**: LOW

**Scope:**
SEO optimization and deployment preparation

**Deliverables:**
- Meta tags for all pages
- OpenGraph images
- Sitemap generation
- robots.txt
- Performance optimization

---

## 📊 **Session Tracking**

| Session | Branch | Status | Credits | Date | Files |
|---------|--------|--------|---------|------|-------|
| 1. Portfolio Homepage | `claude/design-portfolio-page-012...` | ✅ Merged | ~$250 | Nov 22 | 22 files |
| 2. Project Pages | TBD | ⏳ Planned | ~$350 | - | - |
| 3. Gallery | TBD | ⏳ Planned | ~$250 | - | - |
| 4. Media | TBD | ⏳ Planned | ~$150 | - | - |
| 5. About/Resume | TBD | ⏳ Planned | ~$150 | - | - |
| 6. SEO/Deploy | TBD | ⏳ Planned | ~$75 | - | - |
| **TOTAL** | - | - | **~$1,225** | - | - |

**Budget**: $986 remaining → Can do Sessions 2-4 today!

---

## 🔀 **End of Day Merge Strategy**

```bash
# 1. Fetch all branches
git fetch --all

# 2. View all Claude branches
git branch -a | grep claude

# 3. Merge each session branch
git checkout master
git merge claude/build-project-pages-xxxxx
git merge claude/build-projects-gallery-xxxxx
git merge claude/add-project-media-xxxxx

# 4. Resolve any conflicts (unlikely if sessions worked on different files)

# 5. Push to origin
git push origin master

# 6. Celebrate! 🎉
```

---

## 💡 **Tips for Claude.ai Sessions**

### **Starting a Session:**
1. Copy instructions from "Planned Sessions" above
2. Paste into Claude.ai chat
3. Let it create the branch and build
4. Note the branch name for later merging

### **During the Session:**
- Claude.ai will commit and push automatically
- You can have multiple sessions open in different browser tabs
- Each session works independently

### **After the Session:**
- Update this file with branch name, credits used, date
- Move session from "Planned" to "Completed"
- Don't merge yet - wait until end of day

### **Parallel Sessions:**
You can run 3-4 Claude.ai sessions simultaneously in different tabs!
- Tab 1: Build project pages 1-6
- Tab 2: Build project pages 7-12
- Tab 3: Build gallery page
- Tab 4: Generate screenshots

---

## 📞 **Quick Reference**

**Current State:**
- ✅ Templates: 27 production templates in `/app/templates/`
- ✅ Homepage: Portfolio homepage with hero, projects, about, contact
- ✅ Theme System: 4 themes (terminal, amber, carbon, light) with switcher
- ✅ Data: Projects data (22 repos), portfolio content
- ✅ Components: 29 shadcn components + custom portfolio components

**What's Missing:**
- ⏳ Individual project pages
- ⏳ Projects gallery/filter page
- ⏳ Project screenshots
- ⏳ About/Resume pages

**Templates Available for Reference:**
- Case Study: `/app/templates/case-study/`
- Technical Deep Dive: `/app/templates/project-technical/`
- Visual Showcase: `/app/templates/project-visual/`
- SaaS Landing: `/app/templates/saas-landing/`
- Timeline: `/app/templates/timeline/`
- Terminal Resume: `/app/templates/resume-terminal/`

---

**Last Updated**: Nov 22, 2025
**Next Session**: Individual Project Pages
**Budget Remaining**: $986

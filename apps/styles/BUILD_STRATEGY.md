# Portfolio Build Strategy - $900 Credit Sprint

**Time Available**: ~18 hours until tomorrow night
**Projects**: 51 total
**Goal**: Production-ready portfolio with featured projects

---

## 📊 Project Breakdown

### By Type (from PROJECTS_DATA.json)
- **Terminal Apps**: 11 (terminal-tabs, TabzChrome, opustrator, etc.)
- **Web Apps**: 18 (GGPrompts, CellBlocks, DoodleDen, etc.)
- **TUI Tools**: 6 (TUIClassics, gh-tui, tkan, csv-viewer, etc.)
- **3D Apps**: 3 (3dMatrixCards, 3d-terminals-starter, Modular3d)
- **Go Apps**: 7 (projhub, tmuxplexer, TFE, bit, etc.)
- **Unknown/Incomplete**: 6

### By Documentation Quality
- **Well-Documented** (has README + CLAUDE.md): 24 projects ⭐
- **Has README**: 33 projects
- **Needs Docs**: 18 projects

---

## 🎯 Build Priority Tiers

### Tier 1: HERO PROJECTS (Build Full Pages) - 6 projects
**These are your portfolio stars - get live demos, screenshots, full write-ups**

1. **TabzChrome-simplified** - Chrome Extension with context menus
   - Live demo video needed
   - Screenshot of context menu in action
   - Architecture diagram

2. **terminal-tabs** - Full-featured terminal app
   - Screenshots of split layouts
   - Feature comparison table
   - Live demo or video

3. **opustrator** - Infinite canvas with animated backgrounds
   - Showcase all 7 backgrounds
   - Demo of draggable terminals
   - SVG drawing feature

4. **Modular3d** - 3D terminals in space
   - Video of terminals in 3D
   - View layout showcase
   - Technical deep dive

5. **TUIClassics** - Terminal games collection
   - Screenshots of all games
   - Installation guide
   - Live GIF demos

6. **GGPrompts** - AI prompt platform
   - Live site link
   - Feature overview
   - Screenshots

### Tier 2: FEATURED PROJECTS (Cards Only) - 12 projects
**Show these in gallery with good descriptions, but no full pages yet**

7. CellBlocks (Command management)
8. tkan (Kanban TUI)
9. tmuxplexer (Tmux manager TUI)
10. 3dMatrixCards (3D card display)
11. DoodleDen (Kids learning app)
12. Oblique (Tilt-based PWA)
13. PortfolioHub (Meta project!)
14. TUITemplate (Go TUI starter)
15. gh-tui (GitHub TUI)
16. csv-viewer (CSV TUI)
17. projhub (Project launcher)
18. ultrawide-parallax (Horizontal scroll canvas)

### Tier 3: GALLERY (Brief Mentions) - Remaining 33
**Just list with name, description, tech stack in a filterable grid**

---

## 🏗️ Implementation Plan

### Phase 1: Data Structure (30 min) ✅
- [x] Scan all projects
- [x] Create PROJECTS_DATA.json
- [ ] Enhance JSON with:
  - Tech stack (extract from package.json)
  - GitHub URLs
  - Live URLs
  - Screenshots folder
  - Category tags

### Phase 2: Featured Projects (3-4 hours)
**For each Tier 1 project:**
- [ ] Extract detailed features from README
- [ ] Take/find screenshots
- [ ] Record demo videos (if applicable)
- [ ] Write compelling description
- [ ] List tech stack
- [ ] Add to projects.json

### Phase 3: Project Components (2 hours)
- [ ] Create `ProjectCard` component (for gallery)
- [ ] Create `ProjectPage` template (for Tier 1)
- [ ] Create `ProjectGallery` with filters
- [ ] Create `FeaturedProjects` carousel

### Phase 4: Portfolio Pages (2-3 hours)
- [ ] `/projects` - All projects gallery
- [ ] `/projects/[slug]` - Individual project pages (Tier 1)
- [ ] Update homepage hero with featured project
- [ ] Add project categories/filters

### Phase 5: Content & Media (2 hours)
- [ ] Create screenshots for Tier 1 projects
- [ ] Record demo videos (TabzChrome, opustrator, Modular3d)
- [ ] Optimize all images
- [ ] Add GitHub links

### Phase 6: Polish & Deploy (1 hour)
- [ ] SEO optimization (meta tags, descriptions)
- [ ] Performance audit
- [ ] Mobile responsiveness check
- [ ] Deploy to Vercel
- [ ] Test all links

---

## 📋 Quick Wins (Do First!)

### 1. Extract Tech Stacks (15 min)
```bash
# Parse package.json from each web app
# Create tech stack badges
```

### 2. Screenshot Gathering (30 min)
```bash
# Check public/ folders for existing screenshots
# Take new ones where needed
```

### 3. GitHub Links (10 min)
```bash
# Generate GitHub URLs
# Add to projects.json
```

### 4. Category Tagging (20 min)
```bash
# Tag each project: Terminal, TUI, Web, 3D, Go, AI, etc.
# Add difficulty: Starter, Production, Experimental
```

---

## 🎨 Portfolio Structure

```
/
├─ / (homepage)
│  ├─ Hero with featured project
│  ├─ Quick stats (51 projects, X tech stacks)
│  └─ Featured projects carousel (Tier 1)
│
├─ /projects (all projects)
│  ├─ Filterable gallery
│  ├─ Category tabs
│  └─ Search
│
├─ /projects/[slug] (Tier 1 only)
│  ├─ Hero with demo
│  ├─ Features
│  ├─ Tech stack
│  ├─ Screenshots
│  └─ GitHub/Live links
│
└─ /about
   ├─ Bio
   ├─ Tech stack overview
   └─ Contact
```

---

## 💪 Let's Start Building!

**Next Command**: Choose where to start:
1. "Enhance projects data with tech stacks"
2. "Build ProjectCard component"
3. "Create first project page for TabzChrome"
4. "Build projects gallery page"

**Your call!** 🚀

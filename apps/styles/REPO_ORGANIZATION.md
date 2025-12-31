# Repository Organization Plan

## 🎯 **Current State (Nov 22, 2025)**

### **Three Portfolio-Related Repos:**

1. **my-portfolio** (THIS REPO) ⭐ PRIMARY
   - Location: `/home/matt/projects/my-portfolio`
   - Status: Active development, most complete
   - Contains:
     - ✅ 27 production templates in `/app/templates/`
     - ✅ Portfolio homepage (hero, featured projects, about, contact)
     - ✅ Theme system (4 themes: terminal, amber, carbon, light)
     - ✅ Theme switcher component
     - ✅ 29 shadcn/ui components
     - ✅ Projects data (51 projects analyzed)
     - ✅ Complete documentation

2. **portfolio-style-guides**
   - Location: `/home/matt/projects/portfolio-style-guides`
   - Status: DEPRECATED (can be deleted or archived)
   - Contains:
     - 4 theme routes (`/terminal`, `/amber`, `/carbon`, `/light`)
     - Simple theme showcase
     - Already deployed to Vercel (can keep deployment as demo)
   - **Verdict**: Superseded by my-portfolio

3. **style-guide-deploys**
   - Location: `/home/matt/projects/style-guide-deploys`
   - Status: REFERENCE (keep for now)
   - Contains:
     - 4 separate projects (terminal-style-guide, amber-style-guide, carbon-style-guide, light-style-guide)
     - Original deployed versions on Vercel
     - Sometimes "looks slightly better" than newer versions
   - **Verdict**: Keep as deployed reference

---

## ✅ **Recommended Action Plan**

### **Option 1: Clean Consolidation** (Recommended)

```bash
# 1. Keep as primary development repo
cd /home/matt/projects/my-portfolio
# This repo has everything!

# 2. Archive portfolio-style-guides
cd /home/matt/projects/
mv portfolio-style-guides portfolio-style-guides-ARCHIVED
# Optional: Delete later if not needed

# 3. Keep style-guide-deploys as reference
# Leave it untouched, use for visual reference when needed
```

**Reasoning:**
- `my-portfolio` has ALL features of `portfolio-style-guides` + way more
- No reason to maintain both
- Keep deployed versions in `style-guide-deploys` for reference

---

### **Option 2: Replace portfolio-style-guides Repo** (If you want)

If `portfolio-style-guides` is a separate GitHub repo you want to replace:

```bash
# 1. Delete remote portfolio-style-guides repo (or rename it)
# On GitHub: Settings → Danger Zone → Delete Repository
# OR: Rename it to "portfolio-style-guides-old"

# 2. Rename my-portfolio → portfolio-style-guides
cd /home/matt/projects/
mv my-portfolio portfolio-style-guides

# 3. Update remote URL
cd portfolio-style-guides
git remote set-url origin git@github.com:YourUsername/portfolio-style-guides.git
git push -u origin master
```

**Reasoning:**
- If you prefer the name `portfolio-style-guides`
- Keeps the more descriptive repo name
- Single source of truth

---

## 📁 **Final Directory Structure** (Recommended)

```
/home/matt/projects/
├── my-portfolio/                    ⭐ PRIMARY REPO (active development)
│   ├── app/
│   │   ├── templates/              (27 templates - DO NOT EDIT)
│   │   ├── page.tsx                (Portfolio homepage)
│   │   ├── projects/               (Individual project pages - BUILD HERE)
│   │   ├── about/                  (About page - BUILD HERE)
│   │   └── ...
│   ├── components/                  (Shared components)
│   ├── lib/                         (Data files)
│   ├── public/                      (Assets)
│   └── CLAUDE_AI_SESSIONS.md       (Session tracker)
│
├── style-guide-deploys/            📚 REFERENCE (keep deployed)
│   ├── terminal-style-guide/       (Original deployed on Vercel)
│   ├── amber-style-guide/          (Original deployed on Vercel)
│   ├── carbon-style-guide/         (Original deployed on Vercel)
│   └── light-style-guide/          (Original deployed on Vercel)
│
└── portfolio-style-guides-ARCHIVED/  🗄️ ARCHIVED (optional delete)
    └── (old 4-theme consolidated version)
```

---

## 🚀 **What to Do Right Now**

### **Step 1: Verify Everything is in my-portfolio**

```bash
cd /home/matt/projects/my-portfolio

# Check templates
ls app/templates/  # Should show 27 templates

# Check theme system
grep -r "data-theme" components/  # Should find ThemeProvider

# Check portfolio homepage
cat app/page.tsx  # Should show HeroSection, FeaturedProjects, etc.

# Check project data
cat lib/projects-data.ts  # Should show 22+ projects

# Everything should be ✅ GREEN
```

### **Step 2: Archive portfolio-style-guides**

```bash
cd /home/matt/projects/

# Option A: Rename (safe, reversible)
mv portfolio-style-guides portfolio-style-guides-ARCHIVED

# Option B: Delete (if you're sure)
# rm -rf portfolio-style-guides  # CAREFUL!
```

### **Step 3: Update my-portfolio as Primary**

```bash
cd /home/matt/projects/my-portfolio

# Push merged master branch
git push origin master

# Set as primary development repo
# All future Claude.ai sessions start from here
```

---

## 📋 **Verification Checklist**

Before archiving/deleting `portfolio-style-guides`, verify `my-portfolio` has:

- [x] All 4 themes (terminal, amber, carbon, light)
- [x] Theme switcher component
- [x] ThemeProvider with localStorage
- [x] All CSS variables for themes in globals.css
- [x] 27 production templates
- [x] Portfolio homepage components
- [x] Projects data
- [x] Complete documentation

**Status**: ✅ ALL VERIFIED (we checked earlier)

---

## 🎯 **Going Forward**

### **Primary Repo: my-portfolio**
- Use for all Claude.ai sessions
- Build new features here
- Deploy to Vercel from here

### **Reference: style-guide-deploys**
- Keep deployed on Vercel
- Use when "something looks better there"
- Don't actively develop

### **Archived: portfolio-style-guides**
- Can delete if space is needed
- No active use

---

## 💡 **Why This Organization Works**

1. **Single Source of Truth**: `my-portfolio` has everything
2. **No Redundancy**: Don't maintain multiple similar repos
3. **Keep References**: Original deployed versions available
4. **Clear Purpose**: Each repo has specific role
5. **Claude.ai Ready**: Clear instructions in CLAUDE_AI_SESSIONS.md

---

**Decision Made**: Nov 22, 2025
**Primary Repo**: my-portfolio
**Status**: Ready for Claude.ai build sessions

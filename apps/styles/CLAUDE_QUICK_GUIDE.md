# 🚀 Claude Quick Reference Guide

## Super Quick Template Updates

### One-Line Commands for Claude:

```bash
# Update specific template
@case-study: add testimonials section
@tech-deep: fix code snippets
@visual-show: enhance animations
@resume-bento: update to 75 projects
@resume-term: add 'awards' command
@timeline-adv: add filter for categories

# Bulk updates
@all-projects: add loading states
@all-resumes: update contact info
@all: switch to amber theme

# Quick fixes
@gallery: fix preview cards
@resume-*: add LinkedIn links
@project-*: improve mobile view
```

## Template Quick Codes

| Quick Code | Full Path | Description |
|------------|-----------|-------------|
| **@cs** | project-case-study | Case study with timeline |
| **@td** | project-technical | Technical documentation |
| **@vs** | project-visual | Visual showcase |
| **@rt** | resume-timeline | Timeline resume |
| **@rb** | resume-bento | Bento grid resume |
| **@trm** | resume-terminal | Terminal resume |
| **@ta** | timeline | Advanced timeline |
| **@sl** | saas-landing | SaaS landing page |
| **@gal** | templates/page | Main gallery |

## Common Patterns

### Add Feature
```
"@cs: add video gallery to overview tab"
"@rb: add spotify now-playing card"
"@trm: add ASCII art for 'logo' command"
```

### Fix Issue
```
"@td: fix performance chart not showing"
"@vs: fix image gallery overlap on mobile"
"@rt: fix timeline dates alignment"
```

### Update Data
```
"@rb: show 75 projects, 500k lines of code"
"@cs: update metrics to show real data"
"@trm: update projects list to categorize by year"
```

### Theme Change
```
"@all: use amber theme"
"@cs,@td,@vs: switch to carbon theme"
"@rb: apply light theme"
```

## Smart Combinations

### Update Multiple Templates
```
"@cs,@td,@vs: add breadcrumb navigation"
"@all-resumes: add download PDF button"
"@project-*: add share buttons"
```

### Cross-Template Features
```
"Copy testimonials from @cs to @ta"
"Use @rb activity feed in @vs sidebar"
"Apply @trm command system to @td API docs"
```

## File Location Shortcuts

```
# Core template files
templates/           → Main folder
@{tag}/page.tsx     → Template file
components/ui/      → Shared components
SpaceBackground     → Background animation

# Mock data location
Top of each file    → const projectData/profileData
```

## Quick Testing URLs

```
http://localhost:3000/templates           → Gallery (@gal)
http://localhost:3000/templates/test      → Test page

# Project templates
.../project-case-study    → @cs
.../project-technical     → @td
.../project-visual        → @vs

# Resume templates
.../resume-timeline       → @rt
.../resume-bento         → @rb
.../resume-terminal      → @trm
.../timeline             → @ta

# Landing pages
.../saas-landing         → @sl
```

## Data Structure Quick Ref

### Project Templates use:
```javascript
const projectData = {
  title, description, category, status,
  metrics, stack, features, timeline,
  gallery, links, challenges, testimonials
}
```

### Resume Templates use:
```javascript
const profileData = {
  name, title, location, bio, availability,
  experience, education, skills, projects,
  achievements, social, contact
}
```

## Emergency Fixes

```
# If template won't load
"@cs: remove AnimatePresence, simplify animations"

# If too slow
"@vs: reduce animation complexity"

# If data missing
"@rb: add fallback data for undefined fields"

# If commands broken
"@trm: debug command parser, check switch statement"
```

## Pro Tips

1. **Use shortest codes** when possible (@cs vs @case-study)
2. **Combine tags** for bulk updates (@all, @project-*, @resume-*)
3. **Reference sections** directly ("in overview tab", "in skills section")
4. **Specify position** ("after testimonials", "before footer")
5. **Include purpose** ("for better UX", "to fix mobile bug")

---

**Remember**: The more specific you are with tags and locations, the faster and more accurate updates will be!
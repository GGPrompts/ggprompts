# Template Registry & Quick Reference

## 🏷️ Template Tags for Claude

When working with Claude, use these short tags to quickly reference templates:

### Project Templates
```
@case-study     - /app/templates/project-case-study/page.tsx
@tech-deep      - /app/templates/project-technical/page.tsx
@visual-show    - /app/templates/project-visual/page.tsx
```

### Resume Templates
```
@resume-time    - /app/templates/resume-timeline/page.tsx
@resume-bento   - /app/templates/resume-bento/page.tsx
@resume-term    - /app/templates/resume-terminal/page.tsx
@timeline-adv   - /app/templates/timeline/page.tsx (Advanced Timeline)
```

### Landing Pages
```
@saas-land      - /app/templates/saas-landing/page.tsx
```

### Gallery & Showcase
```
@gallery        - /app/templates/page.tsx (Main gallery)
```

## 💬 How to Use with Claude

### Quick Update Examples:
```
"Update @case-study to add a video section"
"Change the colors in @resume-bento to amber theme"
"Add a testimonials carousel to @tech-deep"
"Fix the navigation in @gallery"
```

### Bulk Operations:
```
"Update all @resume-* templates to include GitHub stats"
"Add dark mode toggle to all @project-* templates"
"Update contact sections in @case-study, @tech-deep, and @visual-show"
```

## 📊 Template Metadata

### Project Case Study (@case-study)
- **Purpose**: Comprehensive project documentation
- **Sections**: 5 tabs (Overview, Technical, Features, Gallery, Timeline)
- **Key Features**: Timeline, testimonials, metrics dashboard
- **Mock Data**: `projectData` object with 50 projects
- **Best For**: Client work, portfolio pieces

### Technical Deep Dive (@tech-deep)
- **Purpose**: Developer-focused documentation
- **Sections**: 7 sections (Architecture, Performance, Code, API, etc.)
- **Key Features**: Code snippets, benchmarks, API docs
- **Mock Data**: `projectData` with technical specs
- **Best For**: Open source, libraries, tools

### Visual Showcase (@visual-show)
- **Purpose**: Visual-heavy project presentation
- **Sections**: 8 sections (Hero, Gallery, Features, etc.)
- **Key Features**: Masonry grid, animations, 3D effects
- **Mock Data**: `projectData` with gallery items
- **Best For**: UI/UX, games, creative projects

### Timeline Resume (@resume-time)
- **Purpose**: Professional career progression
- **Sections**: 6 tabs (Timeline, Skills, Projects)
- **Key Features**: Career timeline, skill bars, achievements
- **Mock Data**: `profileData` with work history
- **Best For**: Traditional applications

### Bento Grid Resume (@resume-bento)
- **Purpose**: Modern, playful resume layout
- **Sections**: 12+ grid cards of varying sizes
- **Key Features**: GitHub graph, activity feed, counters
- **Mock Data**: `profileData` with 50 projects
- **Best For**: Modern tech companies

### Terminal Resume (@resume-term)
- **Purpose**: Interactive CLI resume
- **Sections**: Single terminal interface
- **Key Features**: 20+ commands, file system, easter eggs
- **Mock Data**: Built into command responses
- **Best For**: Developer roles, memorable impression

### Advanced Timeline (@timeline-adv)
- **Purpose**: Enhanced timeline with more features
- **Sections**: 12 sections with filters
- **Key Features**: Category filters, year counter, testimonials
- **Mock Data**: Extended `profileData`
- **Best For**: Comprehensive career display

### SaaS Landing (@saas-land)
- **Purpose**: High-converting product landing page
- **Sections**: 14 sections (Hero, Pricing, FAQ, etc.)
- **Key Features**: Pricing cards, newsletter, integrations
- **Mock Data**: `productData` with pricing tiers
- **Best For**: SaaS products, startups

## 🎨 Color Themes Available

Each template can use these theme variations:
- `terminal` - Emerald/cyan/teal (current)
- `amber` - Amber/orange/yellow
- `carbon` - Gray/slate/zinc
- `light` - Light mode variant

### Quick Theme Change:
```
"Apply amber theme to @resume-bento"
"Switch @case-study to carbon theme"
```

## 📁 Project Structure

```
my-portfolio/
├── app/
│   └── templates/
│       ├── page.tsx                    (@gallery)
│       ├── project-case-study/         (@case-study)
│       ├── project-technical/          (@tech-deep)
│       ├── project-visual/             (@visual-show)
│       ├── resume-timeline/            (@resume-time)
│       ├── resume-bento/               (@resume-bento)
│       ├── resume-terminal/            (@resume-term)
│       ├── timeline/                   (@timeline-adv)
│       └── saas-landing/               (@saas-land)
```

## 🔧 Common Update Requests

### Add Section
```
"Add a testimonials section to @tech-deep after the features"
```

### Update Mock Data
```
"Update @resume-bento to show 75 projects instead of 50"
```

### Change Animation
```
"Make the cards in @visual-show float more dramatically"
```

### Fix Issue
```
"Fix the mobile responsiveness in @case-study gallery"
```

### Add Component
```
"Add a floating chat widget to @saas-land"
```

## 🏗️ Component Dependencies

All templates use:
- `/components/SpaceBackground.tsx` - Animated background
- `/components/ui/*` - shadcn components
- `framer-motion` - Animations
- `lucide-react` - Icons

## 💡 Quick Tips

1. **Always specify the tag** when asking for updates
2. **Multiple tags** can be used for bulk updates
3. **Reference sections** by their names in the template
4. **Mock data variables** are at the top of each file
5. **Theme colors** are controlled by Tailwind classes

## 📝 Example Claude Prompts

### Specific Updates:
- "In @case-study, add a 'Tech Stack' card to the overview section"
- "Update @resume-term to add a new command called 'awards'"
- "Change the hero section in @saas-land to include a video"

### Bulk Updates:
- "Add loading skeletons to all @project-* templates"
- "Update all resumes (@resume-*) to include LinkedIn links"

### Theme Changes:
- "Apply the amber color theme to @visual-show"
- "Make @resume-bento use the carbon theme"

### Bug Fixes:
- "Fix the carousel navigation in @case-study gallery tab"
- "Debug why @resume-term commands aren't working"

This tagging system makes it super efficient to communicate with Claude about specific templates!
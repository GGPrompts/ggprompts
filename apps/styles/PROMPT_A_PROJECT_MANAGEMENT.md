# Project Management Suite - Build Prompts for Claude.ai

## CONTEXT
I'm building a portfolio website with 95+ production-ready Next.js templates. I need you to create **3 advanced project management templates** to add to my collection.

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v3
- Framer Motion (3D animations)
- shadcn/ui components
- Glassmorphism design (terminal theme with emerald/cyan glow)

**File Location:** `/home/matt/projects/portfolio-style-guides/app/templates/[template-name]/page.tsx`

**Design System:**
- **Theme**: Terminal-inspired with emerald/cyan accents on dark slate
- **Glassmorphism**: Use `.glass` utility class (frosted glass effect)
- **Animations**: Framer Motion for hover effects, transitions, stagger animations
- **Icons**: lucide-react
- **Components**: Use shadcn/ui (Button, Card, Badge, Tabs, Dialog, etc.)

---

## TEMPLATE 1: KANBAN BOARD

### Requirements
Create a fully interactive Kanban board at `/app/templates/kanban-board/page.tsx`

**Core Features:**
1. **Drag & Drop** - Cards draggable between columns (use Framer Motion `reorder`)
2. **5 Default Columns** - Backlog, Todo, In Progress, Review, Done
3. **Card Details:**
   - Title, description, assignee avatar
   - Priority badges (High/Medium/Low) with color coding
   - Tags/labels with color pills
   - Due date with urgency indicators
   - Attachment count, comment count, checklist progress
   - Card ID number

4. **Board Controls:**
   - Add new column button
   - Add new card (modal dialog)
   - Filter by assignee, priority, tags
   - Search cards
   - Sort options (due date, priority, created date)
   - Board settings (column limits, card colors)

5. **Visual Polish:**
   - Column headers with card count
   - Empty state for new columns
   - Hover effects on cards (lift with shadow)
   - Drag preview with glassmorphic effect
   - Smooth animations when moving cards
   - Progress bars for checklist items

6. **Mock Data:**
   - 20+ sample cards across columns
   - 6 team members with avatars
   - Various priorities, tags, due dates
   - Some cards overdue (red indicator)

**Design Notes:**
- Use glassmorphic cards with `backdrop-blur`
- Columns should have subtle borders with terminal glow
- Dragging should feel smooth (Framer Motion layoutId)
- Priority badges: High=red, Medium=amber, Low=emerald
- Assignee avatars should overlap when multiple

---

## TEMPLATE 2: PROJECT DASHBOARD

### Requirements
Create a comprehensive project management dashboard at `/app/templates/project-dashboard/page.tsx`

**Core Features:**
1. **Header Section:**
   - Project name, status badge (On Track/At Risk/Delayed)
   - Progress ring showing overall completion %
   - Quick stats: Tasks, Team Members, Days Remaining, Budget Used
   - Timeline selector (This Week, This Month, This Quarter)

2. **Gantt Chart View:**
   - Horizontal timeline with date markers
   - Task bars showing start/end dates
   - Dependencies shown as connecting lines
   - Milestones as diamond markers
   - Color-coded by project phase
   - Scroll/zoom controls
   - Today marker line

3. **Task List (below Gantt):**
   - Sortable table with columns: Task, Assignee, Status, Priority, Due Date, Progress
   - Inline progress bars
   - Quick actions (edit, delete, duplicate)
   - Expandable rows showing subtasks
   - Bulk actions (select multiple tasks)

4. **Team Section:**
   - Team member cards with avatar, name, role
   - Workload indicator (tasks assigned)
   - Capacity chart (hours allocated vs available)
   - Performance metrics (completed tasks, on-time %)

5. **Milestones Timeline:**
   - Vertical timeline of key milestones
   - Completion status for each
   - Days until next milestone
   - Risk indicators

6. **Right Sidebar:**
   - Recent activity feed
   - Upcoming deadlines (next 7 days)
   - Blockers/issues panel
   - Quick add task button

**Mock Data:**
- Project: "Platform Redesign" (60% complete)
- 35+ tasks across 4 phases (Discovery, Design, Development, Launch)
- 8 team members with varied workloads
- 6 milestones (2 completed, 1 at risk, 3 upcoming)
- Dependencies between 10+ tasks

**Design Notes:**
- Gantt bars should have glassmorphic gradient
- Use stagger animations when loading task list
- Timeline should be horizontally scrollable
- Hover on dependencies shows task details
- Status badges use terminal glow effect

---

## TEMPLATE 3: SPRINT BOARD (Agile/Scrum)

### Requirements
Create an agile sprint board at `/app/templates/sprint-board/page.tsx`

**Core Features:**
1. **Sprint Header:**
   - Sprint name (e.g., "Sprint 23")
   - Sprint dates (start - end)
   - Days remaining countdown
   - Sprint goals/objectives
   - Quick actions (Start Sprint, End Sprint, Sprint Settings)

2. **Burndown Chart:**
   - Line chart showing ideal vs actual progress
   - Story points remaining over time
   - Scope creep visualization (added work)
   - Velocity comparison to previous sprints
   - Interactive tooltips on hover

3. **Board Columns:**
   - Backlog (prioritized)
   - Sprint Backlog
   - In Progress (WIP limit indicator)
   - Code Review
   - Testing
   - Done
   - Drag-and-drop between columns

4. **Story Cards:**
   - Story points badge
   - User story format ("As a..., I want..., So that...")
   - Acceptance criteria checklist
   - Technical notes/details
   - Linked issues/dependencies
   - Time tracking (estimated vs actual)
   - Assignee, labels, priority

5. **Sprint Metrics Panel:**
   - Velocity chart (last 6 sprints)
   - Story points committed vs completed
   - WIP (Work in Progress) count
   - Average cycle time
   - Sprint health indicator

6. **Backlog Grooming Section:**
   - Drag to prioritize backlog items
   - Estimation poker interface (Fibonacci: 1, 2, 3, 5, 8, 13)
   - Bulk move to sprint
   - Story splitting tool

7. **Team Capacity:**
   - Team member availability (vacation, meetings, etc.)
   - Capacity vs commitment visualization
   - Over/under allocation warnings

**Mock Data:**
- Current sprint: "Sprint 23 - Q1 Features" (Day 8 of 14)
- 45 story points committed, 28 completed
- 25+ user stories across columns
- 6 sprints of historical data
- 7 team members with capacity data
- Velocity trending upward

**Design Notes:**
- Burndown chart uses emerald/cyan gradients
- Story point badges have glassmorphic pill design
- WIP limit violations highlighted in amber/red
- Velocity chart shows trend line
- Cards expand on click to show full details

---

## IMPORTANT GUIDELINES

### File Structure
Each template should be a single `page.tsx` file:
```tsx
"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { /* icons */ } from "lucide-react"
import { /* shadcn components */ } from "@/components/ui/*"

export default function TemplateName() {
  // State and logic
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Template content */}
    </div>
  )
}
```

### Glassmorphism Classes
```css
.glass {
  background: rgba(16, 185, 129, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.3);
  box-shadow:
    0 0 20px rgba(16, 185, 129, 0.1),
    inset 0 0 20px rgba(16, 185, 129, 0.02);
}

.terminal-glow {
  text-shadow:
    0 0 10px rgba(16, 185, 129, 0.5),
    0 0 20px rgba(16, 185, 129, 0.3),
    0 0 30px rgba(16, 185, 129, 0.2);
}
```

### Animation Patterns
```tsx
// Stagger children
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {/* content */}
    </motion.div>
  ))}
</motion.div>

// 3D hover
<motion.div whileHover={{ scale: 1.02, rotateY: 5 }}>

// Reorder (drag and drop)
import { Reorder } from "framer-motion"
<Reorder.Group values={items} onReorder={setItems}>
  {items.map(item => (
    <Reorder.Item key={item.id} value={item}>
      {/* draggable content */}
    </Reorder.Item>
  ))}
</Reorder.Group>
```

### Color Palette
- **Primary**: `hsl(160 84% 39%)` - Emerald/cyan
- **Background**: `hsl(220 13% 5%)` - Very dark slate
- **Foreground**: `hsl(160 84% 95%)` - Light cyan-white
- **Border**: `hsl(160 60% 25%)` - Cyan border
- **Muted**: `hsl(220 13% 20%)` - Dark slate

---

## TASK FOR YOU

**Please create all 3 templates** in separate code blocks, following:
1. All TypeScript types defined
2. Rich mock data (realistic project scenarios)
3. Full interactivity (drag-drop, filters, dialogs)
4. Glassmorphic design with terminal theme
5. Smooth Framer Motion animations
6. Responsive (mobile-first)
7. Comments explaining key sections

**Start with Template 1 (Kanban Board), then Template 2 (Project Dashboard), then Template 3 (Sprint Board).**

Each template should be 800-1500 lines of production-quality code. Make them IMPRESSIVE!

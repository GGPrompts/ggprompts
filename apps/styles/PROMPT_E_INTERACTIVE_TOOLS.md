# Interactive Tools Suite - Build Prompts for Claude.ai

## CONTEXT
I'm building a portfolio website with 101 production-ready Next.js templates. I need you to create **5 sophisticated interactive developer tools** that showcase advanced UI/UX, complex state management, and practical utility.

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v3
- Framer Motion (drag-and-drop, smooth animations)
- Recharts (for visualizations)
- shadcn/ui components
- Glassmorphism design (terminal theme with emerald/cyan glow)

**File Location:** `/home/matt/projects/portfolio-style-guides/app/templates/[template-name]/page.tsx`

**Design System:**
- **Theme**: Terminal-inspired with emerald/cyan accents on dark slate
- **Glassmorphism**: Use `.glass` utility class (frosted glass effect)
- **Animations**: Framer Motion for interactions, drag-and-drop
- **Icons**: lucide-react
- **Components**: Use shadcn/ui (Button, Card, Badge, Tabs, Dialog, Table, etc.)

---

## TEMPLATE 1: DATA VISUALIZATION STUDIO

### Requirements
Create an interactive chart builder/visualization studio at `/app/templates/data-viz-studio/page.tsx`

**Core Features:**

1. **Data Input Panel:**
   - JSON editor (textarea with syntax highlighting simulation)
   - CSV paste support
   - Sample datasets dropdown (Sales, Weather, Stock Prices, etc.)
   - Column detection and type inference
   - Data preview table (first 10 rows)
   - Row count, column count display

2. **Chart Type Selector:**
   - Visual gallery of chart types:
     - Line Chart
     - Bar Chart (vertical/horizontal)
     - Area Chart
     - Pie Chart
     - Scatter Plot
     - Radar Chart
     - Composed Chart (combo)
   - Chart type cards with preview icons
   - Click to select

3. **Configuration Panel:**
   - X-axis selector (column dropdown)
   - Y-axis selector (column dropdown)
   - Series/Groups (for multi-line/bar charts)
   - Color scheme picker (8-10 preset palettes)
   - Chart title input
   - Axis labels input
   - Show/hide legend
   - Show/hide grid lines
   - Data labels toggle

4. **Live Preview:**
   - Large chart canvas (updates in real-time)
   - Responsive container
   - Interactive tooltips on hover
   - Zoom/pan controls (for applicable charts)
   - Full-screen mode
   - Animation toggle

5. **Customization:**
   - Color customization per series
   - Line style (solid, dashed, dotted)
   - Point shapes (circle, square, triangle)
   - Fill opacity slider (0-100%)
   - Font size controls
   - Margin/padding adjustments

6. **Export Options:**
   - Download as PNG
   - Download as SVG
   - Copy as HTML
   - Export config (JSON)
   - Share link (simulated)
   - Embed code snippet

7. **Templates:**
   - Save current configuration
   - Load saved templates
   - Pre-built templates gallery
   - Template categories (Business, Science, Financial, etc.)

8. **Code Generation:**
   - Generate React code (with Recharts)
   - Generate HTML/CSS/JS
   - Copy to clipboard button
   - Syntax-highlighted code preview

**Mock Data:**
- Sample: Monthly sales data (12 months, 3 products)
- Chart: Line chart with 3 series
- Colors: Emerald, Cyan, Amber
- Title: "Q4 Sales Performance"
- 500 rows × 8 columns dataset

**Design Notes:**
- Split layout: controls left, preview right
- Chart updates instantly on config change
- Color picker with preset palettes
- Export buttons with download icons
- Code preview with Monaco-style formatting

---

## TEMPLATE 2: API PLAYGROUND

### Requirements
Create an interactive API testing tool at `/app/templates/api-playground/page.tsx`

**Core Features:**

1. **Request Builder:**
   - HTTP method dropdown (GET, POST, PUT, PATCH, DELETE)
   - URL input (with autocomplete suggestions)
   - Endpoint history (last 20)
   - Environment selector (Dev, Staging, Prod)
   - Save request to collection

2. **Request Tabs:**
   - **Params**: Query parameters (key-value pairs)
     - Add/remove rows
     - Auto-encode toggle
   - **Headers**: HTTP headers
     - Common headers dropdown (Content-Type, Authorization, etc.)
     - Add custom headers
   - **Body**:
     - Raw (JSON, XML, Text)
     - Form data (multipart)
     - x-www-form-urlencoded
     - Binary file upload
   - **Auth**:
     - Auth type (None, Bearer Token, Basic, API Key)
     - Token input
     - Username/password fields

3. **Response Viewer:**
   - Status code badge (200, 404, 500, etc.)
   - Response time (ms)
   - Response size (bytes/KB)
   - Response headers table
   - Response body:
     - JSON (formatted, syntax highlighted)
     - HTML preview
     - Raw text
     - Image preview
   - Search in response
   - Copy response button

4. **Code Generation:**
   - Generate code in multiple languages:
     - cURL
     - JavaScript (fetch)
     - Python (requests)
     - Go (net/http)
     - Ruby (HTTParty)
   - Copy to clipboard
   - Syntax highlighting

5. **Collections:**
   - Organize requests into folders
   - Request tree view
   - Drag-and-drop to reorder
   - Import/export collection (JSON)
   - Share collection link

6. **Environment Variables:**
   - Define variables ({{base_url}}, {{api_key}}, etc.)
   - Environment switcher
   - Variable substitution in URL/headers/body
   - Secure variables (hidden values)

7. **History:**
   - Request history log (last 100)
   - Filter by method, status
   - Re-run past requests
   - Star favorites
   - Clear history

8. **Response Testing:**
   - Status code assertions
   - JSON path validator
   - Response time threshold
   - Header checks
   - Test scripts editor (simulated)

**Mock Data:**
- Example API: https://jsonplaceholder.typicode.com/posts
- Endpoints: /posts, /comments, /users
- Sample responses with realistic JSON
- Response time: 45-120ms
- Collections: "JSONPlaceholder API", "My Project API"

**Design Notes:**
- Postman/Insomnia-inspired layout
- 3-panel split (sidebar, request, response)
- Method badges color-coded (GET=cyan, POST=emerald, DELETE=red)
- Syntax highlighting for JSON
- Status code with color indicator
- Loading spinner during "request"

---

## TEMPLATE 3: DATABASE SCHEMA DESIGNER

### Requirements
Create a visual database schema/ERD builder at `/app/templates/db-schema-designer/page.tsx`

**Core Features:**

1. **Canvas Area:**
   - Infinite pannable canvas
   - Zoom in/out controls
   - Grid background (optional)
   - Mini-map (overview in corner)
   - Auto-layout button
   - Fit-to-screen button

2. **Table Creation:**
   - Add table button (opens dialog)
   - Table properties:
     - Table name
     - Schema/database
     - Description
   - Drag tables to position
   - Resize tables
   - Delete table

3. **Column Management:**
   - Add column to table
   - Column properties:
     - Name
     - Type (VARCHAR, INT, BOOLEAN, DATE, etc.)
     - Length/precision
     - Nullable (checkbox)
     - Default value
     - Primary Key (icon)
     - Foreign Key (icon)
     - Unique constraint
     - Index
   - Reorder columns (drag handle)
   - Delete column

4. **Relationships:**
   - Draw relationships between tables
   - Relationship types:
     - One-to-One (1:1)
     - One-to-Many (1:N)
     - Many-to-Many (N:M)
   - Connector lines with crow's foot notation
   - Click to edit relationship
   - Cascade options (ON DELETE, ON UPDATE)
   - Delete relationship

5. **SQL Generation:**
   - Generate CREATE TABLE statements
   - Generate ALTER TABLE for relationships
   - Generate INSERT sample data
   - Dialect selector (PostgreSQL, MySQL, SQLite, SQL Server)
   - Copy SQL to clipboard
   - Download .sql file

6. **Schema Templates:**
   - Pre-built schemas:
     - E-commerce (users, products, orders, etc.)
     - Blog (posts, comments, categories)
     - Social Network (users, posts, likes, follows)
     - SaaS (tenants, users, subscriptions)
   - Load template button
   - Save custom template

7. **Import/Export:**
   - Import from SQL DDL
   - Import from JSON schema
   - Export as JSON
   - Export as PNG/SVG
   - Export as DDL

8. **Documentation:**
   - Table descriptions
   - Column comments
   - Generate documentation (HTML/Markdown)
   - Entity relationship descriptions

**Mock Data:**
- Sample schema: E-commerce
- Tables: users, products, categories, orders, order_items, reviews
- 6 tables, 40+ columns total
- Relationships connecting tables
- Primary/foreign keys defined

**Design Notes:**
- Tables as glassmorphic cards on canvas
- Columns listed inside table cards
- Relationship lines with arrows/crow's feet
- Primary keys highlighted in emerald
- Foreign keys with link icon
- Zoom controls in corner
- SQL output in monospace font

---

## TEMPLATE 4: REGEX TESTER & BUILDER

### Requirements
Create an interactive regex testing and learning tool at `/app/templates/regex-tester/page.tsx`

**Core Features:**

1. **Pattern Input:**
   - Regex pattern input (large text field)
   - Flags checkboxes:
     - Global (g)
     - Case insensitive (i)
     - Multiline (m)
     - Dotall (s)
     - Unicode (u)
   - Pattern history (last 20)
   - Common patterns library

2. **Test String Input:**
   - Multi-line text area
   - Sample text library:
     - Email addresses
     - Phone numbers
     - URLs
     - Dates
     - Credit cards
     - IP addresses
   - Load sample button

3. **Match Visualization:**
   - Matches highlighted in test string
   - Match count display
   - Individual match groups
   - Capture groups identified
   - Named groups labeled
   - Non-matching text dimmed

4. **Match Details Panel:**
   - List of all matches
   - Match index
   - Full match text
   - Capture groups (nested)
   - Match position (start, end)
   - Copy match button

5. **Pattern Library:**
   - Pre-built patterns by category:
     - Email validation
     - Phone numbers (US, international)
     - URLs (HTTP, HTTPS)
     - Dates (various formats)
     - Credit cards (Visa, MasterCard, etc.)
     - IPv4/IPv6 addresses
     - Hex colors
     - Social security numbers
   - Insert pattern button
   - Pattern descriptions

6. **Replace Mode:**
   - Replacement string input
   - Preview replacements
   - Capture group references ($1, $2, etc.)
   - Replace all preview
   - Copy result button

7. **Explanation:**
   - Pattern breakdown (explain each part)
   - Character class explanations
   - Quantifier meanings
   - Anchor descriptions
   - Group explanations
   - Interactive pattern diagram

8. **Code Generation:**
   - Generate code in languages:
     - JavaScript
     - Python
     - Java
     - PHP
     - Ruby
   - Copy to clipboard
   - Syntax highlighting

**Mock Data:**
- Pattern: `/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/`
- Test string: Multiple email addresses
- 12 matches found
- Sample patterns for all common use cases

**Design Notes:**
- Split view: pattern top, test string bottom, results side
- Matches highlighted with emerald background
- Capture groups color-coded
- Pattern explanation in expandable panel
- Common patterns as clickable chips
- Match count badge

---

## TEMPLATE 5: CRON EXPRESSION BUILDER

### Requirements
Create an interactive cron schedule builder at `/app/templates/cron-builder/page.tsx`

**Core Features:**

1. **Visual Builder:**
   - Tab interface for each part:
     - Minutes (0-59)
     - Hours (0-23)
     - Day of Month (1-31)
     - Month (1-12)
     - Day of Week (0-6, Sun-Sat)
   - Selection methods per tab:
     - Every (*)
     - Specific value (dropdown)
     - Range (from-to)
     - Interval (every N)
     - Multiple values (checkboxes)

2. **Cron Expression Display:**
   - Large, formatted cron string
   - Copy to clipboard button
   - Real-time updates as options change
   - Syntax validation
   - Error messages if invalid

3. **Human-Readable Description:**
   - Plain English translation
   - Examples:
     - "Every day at 9:00 AM"
     - "Every Monday at 6:30 PM"
     - "Every 15 minutes"
     - "On the 1st of every month at midnight"
   - Multiple phrasing options

4. **Next Execution Times:**
   - List of next 10 execution times
   - Full date-time format
   - Relative time ("in 2 hours", "tomorrow at 9am")
   - Time zone selector
   - Countdown to next execution

5. **Preset Templates:**
   - Common schedules:
     - Every minute
     - Every hour
     - Daily at specific time
     - Weekly on specific day
     - Monthly on specific date
     - Yearly
     - Business days only
     - Weekends only
   - Load preset button

6. **Advanced Mode:**
   - Direct cron syntax input
   - Syntax highlighting
   - Auto-complete suggestions
   - Validation feedback
   - Parse existing cron expression

7. **Test Scenarios:**
   - Date range selector (start, end)
   - Generate all executions in range
   - Execution count
   - Download schedule (CSV, iCal)

8. **Platform-Specific:**
   - Generate for:
     - Linux crontab
     - GitHub Actions
     - AWS CloudWatch Events
     - Jenkins
     - Kubernetes CronJob
   - Platform-specific syntax differences
   - YAML/JSON export

**Mock Data:**
- Expression: `0 9 * * 1-5` (9 AM weekdays)
- Description: "At 9:00 AM, Monday through Friday"
- Next 10 executions listed
- Time zone: America/New_York

**Design Notes:**
- Tab navigation for each time component
- Checkbox grid for day of week
- Time picker for hours/minutes
- Cron string in monospace font
- Next executions in timeline view
- Preset templates as cards
- Validation with helpful error messages

---

## IMPORTANT GUIDELINES

### File Structure
Each template should be a single `page.tsx` file:
```tsx
"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { /* icons */ } from "lucide-react"
import { /* shadcn components */ } from "@/components/ui/*"

export default function TemplateName() {
  // State and logic
  // Interactive handlers
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
    0 0 20px rgba(16, 185, 129, 0.3);
}
```

### Interactive Patterns
```tsx
// Copy to clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}

// Code syntax highlighting (simulated with color classes)
<pre className="bg-slate-950 p-4 rounded-lg">
  <code className="text-emerald-400">
    {codeString}
  </code>
</pre>

// Drag and drop (Framer Motion)
<motion.div
  drag
  dragConstraints={containerRef}
  dragElastic={0.1}
>
  {content}
</motion.div>
```

### Color Coding
- **Success**: Emerald (`text-emerald-500`)
- **Error**: Red (`text-red-500`)
- **Warning**: Amber (`text-amber-500`)
- **Info**: Cyan (`text-cyan-500`)
- **Code**: Monospace font with syntax colors

---

## TASK FOR YOU

**Please create all 5 templates** in separate code blocks, following:
1. All TypeScript types defined
2. Rich interactive functionality
3. Copy-to-clipboard features
4. Code generation capabilities
5. Glassmorphic design with terminal theme
6. Smooth Framer Motion animations
7. Responsive layout (mobile-first)
8. Comments explaining interactive patterns

**Start with Template 1 (Data Viz Studio), then Template 2 (API Playground), then Template 3 (DB Schema Designer), then Template 4 (Regex Tester), then Template 5 (Cron Builder).**

Each template should be 1400-2000 lines of production-quality code. Make them USEFUL tools that developers actually want to use!

### Pro Tips:
- Add "Copy to clipboard" with success feedback (✓ Copied!)
- Keyboard shortcuts (Ctrl+Enter to run, etc.)
- Export/download functionality (even if simulated)
- Validation with helpful error messages
- Tooltips explaining advanced features
- Sample data/templates to get started quickly
- Undo/redo support where applicable
- Save state to localStorage

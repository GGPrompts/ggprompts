# Automation Pages Plan

Transform ggprompts-next into a collection of AI-automatable pages designed for TabzChrome MCP tools.

## Concept

Each page is a **self-contained automation target** with:
- Known, stable CSS selectors (`id`, `data-testid`, `data-action`)
- Visible "Selectors Panel" documenting all interactive elements
- State feedback (success/error indicators, progress bars)
- Template variables that can be filled via `tabz_fill`
- Actions that can be triggered via `tabz_click`

## Reference Documentation (TabzChrome)

Before building, read these files from `~/projects/TabzChrome`:

### Core Patterns
| File | Purpose |
|------|---------|
| `backend/public/templates/mcp-test/index.html` | Master example - selector patterns, layout, quick start |
| `backend/public/templates/mcp-test/forms.html` | Form patterns - inputs, selects, checkboxes, wizards |
| `backend/public/templates/mcp-test/buttons.html` | Button patterns - states, toggles, feedback |
| `backend/public/templates/mcp-test/navigation.html` | Nav patterns - tabs, modals, dropdowns |
| `backend/public/templates/mcp-test/data.html` | Data display - tables, cards, lists |
| `backend/public/templates/mcp-test/network.html` | API calls - fetch, loading states, results |

### Prompty Format
| File | Purpose |
|------|---------|
| `.prompts/images/dalle3.prompty` | Example workflow with selectors + template vars |
| `.prompts/diagrams/diagrams.prompty` | Multi-step workflow with fallback methods |
| `.prompts/dev/add-audio-event.prompty` | Internal dev workflow template |
| `extension/dashboard/utils/promptyUtils.ts` | Parser for prompty format |

### MCP Tools Reference
| File | Purpose |
|------|---------|
| `tabz-mcp-server/MCP_TOOLS.md` | All available MCP tools |
| `docs/API.md` | Backend API (spawn, terminals) |

### Key Selectors Pattern
```html
<!-- Primary (preferred) -->
<button id="btn-submit">Submit</button>
<input id="search-input" data-testid="search-input" />
<div data-action="toggle-theme">Toggle</div>

<!-- Fallback -->
<button class="btn-primary" type="submit">Submit</button>
```

## Pages to Create

### Tier 1: Core Automation Pages

#### 1. `/automations/dalle3`
**Purpose:** Generate images via ChatGPT DALL-E 3

**Key Elements:**
- `#prompt-input` - Main prompt textarea
- `#style-select` - Style dropdown (photorealistic, digital art, etc.)
- `#aspect-select` - Aspect ratio (square, wide, portrait)
- `#btn-generate` - Triggers workflow
- `#btn-copy-prompt` - Copy composed prompt
- `#output-preview` - Shows generated prompt
- `#selectors-panel` - Collapsible selector reference

**Workflow Steps:**
1. Fill template variables
2. Click generate → opens ChatGPT in new tab
3. Auto-fills prompt textarea
4. User clicks send (or automation continues)

**Reference:** `.prompts/images/dalle3.prompty`

---

#### 2. `/automations/diagrams`
**Purpose:** Create diagrams via Diagrams GPT or Mermaid Live

**Key Elements:**
- `#diagram-type` - Select (flowchart, sequence, architecture, ERD)
- `#diagram-subject` - What to diagram
- `#diagram-style` - Detail level
- `#btn-chatgpt-method` - Use Diagrams GPT
- `#btn-mermaid-method` - Use Mermaid Live (faster)
- `#mermaid-output` - Generated Mermaid code
- `#btn-copy-mermaid` - Copy to clipboard

**Reference:** `.prompts/diagrams/diagrams.prompty`

---

#### 3. `/automations/research`
**Purpose:** Multi-source research aggregator

**Key Elements:**
- `#research-query` - Search input
- `#src-web`, `#src-github`, `#src-llms` - Source checkboxes
- `#btn-search` - Execute search
- `#results-panel` - Aggregated results
- `#btn-copy-all` - Copy all findings
- `#btn-send-terminal` - Send to Claude terminal

**New page - no existing reference**

---

#### 4. `/automations/sora`
**Purpose:** Generate videos via Sora

**Key Elements:**
- `#video-prompt` - Prompt textarea
- `#duration-select` - Video length
- `#style-select` - Visual style
- `#btn-generate` - Start generation

**Reference:** `.prompts/video/sora.prompty`

---

#### 5. `/automations/canva`
**Purpose:** Create designs via Canva

**Key Elements:**
- `#design-type` - Select (social, presentation, logo)
- `#design-prompt` - Description
- `#btn-open-canva` - Open Canva with prompt

**Reference:** `.prompts/images/canva.prompty`

---

### Tier 2: Developer Tools

#### 6. `/automations/github-pr`
**Purpose:** Create PRs with proper format

**Key Elements:**
- `#pr-title` - Title input
- `#pr-summary` - Summary bullets
- `#pr-test-plan` - Test plan checklist
- `#target-repo` - Repository
- `#btn-create-pr` - Execute `gh pr create`

---

#### 7. `/automations/commit`
**Purpose:** Compose conventional commits

**Key Elements:**
- `#commit-type` - Select (feat, fix, docs, refactor)
- `#commit-scope` - Scope input
- `#commit-message` - Message textarea
- `#btn-preview` - Show formatted commit
- `#btn-execute` - Run git commit

---

#### 8. `/automations/docs-generator`
**Purpose:** Generate documentation

**Key Elements:**
- `#doc-type` - Select (README, API, JSDoc)
- `#source-files` - File picker
- `#btn-analyze` - Scan files
- `#doc-output` - Generated docs
- `#btn-save` - Write to file

---

### Tier 3: Workflow Orchestration

#### 9. `/prompt-launcher`
**Purpose:** Meta-page - load any .prompty file, fill variables, execute

**Key Elements:**
- `#prompty-select` - Dropdown of available prompty files
- `#variables-form` - Dynamic form based on template vars
- `#preview-panel` - Rendered prompt
- `#target-terminal` - Select terminal
- `#btn-copy` - Copy prompt
- `#btn-send` - Send to terminal
- `#btn-execute-mcp` - Run MCP workflow

**This is the power page** - works with any prompty file

---

#### 10. `/agent-dashboard`
**Purpose:** Monitor and control Claude workers

**Key Elements:**
- `#agent-list` - Cards for each agent
- `#agent-{id}-status` - Status per agent
- `#agent-{id}-context` - Context % per agent
- `#agent-{id}-send` - Send prompt button
- `#btn-spawn-new` - Create new agent
- `#btn-kill-all` - Kill all agents
- `#global-prompt` - Send to all agents

**Calls:** `localhost:8129/api/agents`, `/api/spawn`

---

#### 11. `/workflow-builder`
**Purpose:** Visual workflow editor

**Key Elements:**
- `#workflow-name` - Name input
- `#steps-list` - Sortable step list
- `#step-{n}-action` - Action type per step
- `#step-{n}-selector` - Selector input
- `#step-{n}-value` - Value input
- `#btn-add-step` - Add new step
- `#btn-test-workflow` - Execute workflow
- `#btn-export-prompty` - Export as .prompty

---

### Tier 4: Asset Management

#### 12. `/assets/images`
**Purpose:** Gallery of generated images

**Key Elements:**
- `#asset-grid` - Image grid
- `#asset-{id}` - Individual asset
- `#btn-rename` - Rename asset
- `#btn-delete` - Delete asset
- `#btn-insert` - Insert into project

---

#### 13. `/assets/downloads`
**Purpose:** Manage downloaded files

**Key Elements:**
- `#downloads-list` - File list
- `#download-{id}` - Individual download
- `#btn-open-folder` - Open in file manager
- `#btn-move` - Move to project

---

## Implementation Notes

### Tech Stack
- Keep Next.js (already set up)
- Each automation page is a route under `/automations/`
- Use existing shadcn/ui components for consistency
- Add selectors panel as reusable component

### Selectors Panel Component
Create `components/SelectorsPanel.tsx`:
```tsx
interface Selector {
  id: string
  description: string
}

export function SelectorsPanel({ selectors }: { selectors: Selector[] }) {
  // Collapsible panel showing all selectors
  // Fixed position bottom-right
  // Same style as MCP test pages
}
```

### TabzChrome Integration
Each page can call the Tabz backend:
```typescript
// Spawn terminal
await fetch('http://localhost:8129/api/spawn', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Token': authToken
  },
  body: JSON.stringify({
    name: 'Claude: Task',
    workingDir: '/path',
    command: 'claude --dangerously-skip-permissions'
  })
})

// Get auth token (user needs to provide or we detect)
const authToken = localStorage.getItem('tabz-auth-token')
```

### Prompty Integration
Load and parse .prompty files:
```typescript
import { parsePrompty, substituteVariables } from './promptyUtils'

const raw = await fetch('/prompts/dalle3.prompty').then(r => r.text())
const { frontmatter, content, variables } = parsePrompty(raw)
const filled = substituteVariables(content, userValues)
```

## Execution Plan

### Phase 1: Foundation
1. Create `SelectorsPanel` component
2. Create `/automations` index page
3. Build `/automations/dalle3` as reference implementation
4. Test with TabzChrome MCP tools

### Phase 2: Core Pages
5. Build remaining Tier 1 pages
6. Build Tier 2 developer tools

### Phase 3: Orchestration
7. Build `/prompt-launcher`
8. Build `/agent-dashboard`
9. Build `/workflow-builder`

### Phase 4: Polish
10. Add authentication for saving preferences
11. Add community submissions
12. Add usage analytics

## Worker Assignment (for Conductor)

When executing with conductor, split work across workers:

| Worker | Pages | Skills to Use |
|--------|-------|---------------|
| Worker 1 | dalle3, sora, canva | `nextjs`, `shadcn-ui`, `tailwindcss` |
| Worker 2 | diagrams, research | `nextjs`, `shadcn-ui` |
| Worker 3 | github-pr, commit, docs-generator | `nextjs`, `shadcn-ui` |
| Worker 4 | prompt-launcher, agent-dashboard | `nextjs`, `shadcn-ui` |
| Worker 5 | workflow-builder, assets | `nextjs`, `shadcn-ui` |

Each worker should:
1. Read the TabzChrome reference files first
2. Create the page with all required selectors
3. Add SelectorsPanel with documentation
4. Test that selectors are accessible

## Success Criteria

A page is complete when:
- [ ] All interactive elements have `id` attributes
- [ ] SelectorsPanel lists all selectors
- [ ] Page works standalone (no TabzChrome required)
- [ ] Page works with TabzChrome MCP tools
- [ ] Has visual feedback for actions
- [ ] Responsive design (works in sidebar widths)

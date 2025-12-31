# Navigation System

The sidebar uses an accordion-style navigation pattern with expandable sections and contextual sub-items.

## Layout Structure

```
┌──────────────────────┬─────────────────────────────────┐
│ [Home Button]        │                                 │
│ ──────────────────── │                                 │
│ ▸ Weather            │                                 │
│ ▼ Daily Feed         │        Section Content          │
│   • Sources          │                                 │
│   • Saved Items      │                                 │
│   • Refresh          │                                 │
│ ▸ API Playground     │                                 │
│ ▸ Quick Notes        │                                 │
│ ▸ Settings           │                                 │
└──────────────────────┴─────────────────────────────────┘
```

## Accordion Behavior

- **Click section header**: Navigates to section AND toggles expand/collapse
- **Click sub-item**: Navigates to section (closes mobile menu)
- **Auto-collapse**: Only one section expanded at a time
- **Chevron rotation**: Indicates expanded (▾) or collapsed (▸) state

## Desktop vs Mobile

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Sidebar | Always visible, collapsible | Hidden in Sheet drawer |
| Toggle | Collapse button (-right-4) | Hamburger menu (top-left) |
| Width | 280px expanded, 80px collapsed | 288px (w-72) |
| Sub-items | Hidden when collapsed | Always shown |

## Navigation Configuration

Defined in `app/page.tsx` and `hooks/useSectionPreferences.ts`:

```typescript
// Toggleable sections (can be hidden/reordered)
type ToggleableSection = "weather" | "feed" | "api-playground" | "notes" | "bookmarks" | "search" | "stocks" | "tasks" | "integrations" | "profile"

// All sections
type Section = "home" | ToggleableSection | "settings"

interface NavigationItem {
  id: Section
  label: string
  icon: React.ElementType
  description: string
  subItems?: SubItem[]
}
```

## Current Sections

| Section | Icon | Sub-items |
|---------|------|-----------|
| **Weather** | Cloud | Forecast, Radar, Alerts |
| **Daily Feed** | Newspaper | Sources, Saved Items, Refresh |
| **API Playground** | Zap | Collections, History |
| **Quick Notes** | FileText | Browse Files, Recent |
| **Bookmarks** | Bookmark | All Links, Search |
| **Search Hub** | Search | Search, AI Chat, Image AI |
| **Paper Trading** | TrendingUp | Portfolio, Watchlist, History |
| **Tasks** | CheckCircle2 | To Do, Completed |
| **Integrations** | Link2 | Authentication, API Services, Data Sources |
| **Profile** | User | Account, Sync Status |
| **Settings** | Settings | Appearance, Sections, Feed Config, API Keys |

## Section Visibility & Order

Users can customize which sections appear and their order:

- **Settings → Sections**: Toggle visibility, reorder with up/down buttons
- **Hook**: `useSectionPreferences()` from `hooks/useSectionPreferences.ts`
- **Storage**: localStorage key `section-preferences`
- **Hydration**: Uses `DEFAULT_SECTION_ORDER` during SSR, switches to user prefs after load

## Adding a New Section

1. **Update types** in `hooks/useSectionPreferences.ts`:
   ```typescript
   type ToggleableSection = "weather" | ... | "new-section"
   ```
   Also add to `DEFAULT_SECTION_ORDER` and `DEFAULT_VISIBILITY`.

2. **Add to navigationItems array** in `app/page.tsx`:
   ```typescript
   {
     id: "new-section",
     label: "New Section",
     icon: IconComponent,
     description: "Description for tooltip",
     subItems: [
       { id: "sub1", label: "Sub Item 1", icon: SubIcon1 },
       { id: "sub2", label: "Sub Item 2", icon: SubIcon2 },
     ]
   }
   ```

3. **Create section component** in `app/sections/new-section.tsx`

4. **Import and add to renderContent()** switch statement:
   ```typescript
   case "new-section":
     return <NewSection />
   ```

5. **Add to SectionSettings** in `components/SectionSettings.tsx`:
   ```typescript
   "new-section": { label: "New Section", icon: IconComponent, description: "..." }
   ```

6. **Add card to HomeSection** (optional):
   ```typescript
   {checkVisible("new-section") && (
     <button onClick={() => onNavigate("new-section")} className="glass ...">
       ...
     </button>
   )}
   ```

## State Management

| State | Type | Purpose |
|-------|------|---------|
| `activeSection` | `Section` | Currently displayed section |
| `expandedSection` | `Section \| null` | Which sidebar section is expanded |
| `sidebarCollapsed` | `boolean` | Desktop sidebar collapsed state |
| `mobileMenuOpen` | `boolean` | Mobile sheet drawer open state |

## Accessibility

- Sheet includes visually hidden title/description for screen readers
- Tooltips show labels when sidebar is collapsed
- Keyboard navigation supported

## File Locations

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main component, SidebarContent, HomeSection, SettingsSection |
| `hooks/useSectionPreferences.ts` | Section visibility/order preferences hook |
| `components/SectionSettings.tsx` | Settings UI for toggling/reordering sections |
| `components/WorldClocks.tsx` | World clocks widget on Home page |
| `app/sections/*.tsx` | Individual section components |

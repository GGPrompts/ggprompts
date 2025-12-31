# GGPrompts Plugin UX Improvements

## What We Learned Today

### Key Discoveries

1. **Remote Marketplace Installation**
   ```bash
   /plugin marketplace add GGPrompts/ggprompts-marketplace
   /plugin install skill-name@ggprompts-marketplace --scope user
   ```

2. **Plugin Structure Requirements**
   - Remote plugins **cannot use symlinks** - files must be actual copies
   - Each plugin needs proper directory structure:
     ```
     plugins/
       skill-name/
         skills/
           skill-name/
             SKILL.md
         commands/
           cmd.md
     ```
   - Use `marketplace.json` OR `plugin.json`, **not both**

3. **Categories Are Metadata Only**
   - Categories in marketplace.json don't create visual groupings in `/plugin` UI
   - Plugins appear in a flat list regardless of category

4. **Command Prefixing**
   - Format: `/plugin-name:command-name`
   - Prefix is optional unless there are naming conflicts

5. **TabzChrome Integration**
   - Can send commands directly to Claude Code terminal via `queueToChat()`
   - Perfect for automating plugin installation

---

## Current Architecture Problems

### my-gg-plugins Issues

```
my-gg-plugins/
├── .claude-plugin/
│   ├── marketplace.json    ❌ Has both files (conflict)
│   └── plugin.json         ❌
├── skills/                  ❌ Direct skill dirs, not plugin structure
│   └── ui-styling/
└── commands/               ❌ Flat commands, not in plugins/
```

**Problems:**
1. Has both `marketplace.json` AND `plugin.json`
2. `source: "./skills/ui-styling"` points to skill dirs, not plugin dirs
3. No `plugins/` subdirectory structure for individual installs
4. Won't work as remote marketplace properly

### Current User Flow (Too Many Steps)

```
Browse GGPrompts → Add to Toolkit → Sync to GitHub → Clone Repo → claude plugin load .
         1              2                3              4                5
```

---

## Proposed Architecture

### New Centralized Marketplace

```
GGPrompts/ggprompts-marketplace/          # Public repo, maintained by GGPrompts
├── .claude-plugin/
│   └── marketplace.json                  # ONLY marketplace.json
└── plugins/
    ├── ui-styling/
    │   └── skills/ui-styling/SKILL.md
    ├── debugging/
    │   └── skills/debugging/...
    ├── handoff/
    │   └── commands/handoff.md
    ├── wipe/
    │   └── commands/wipe.md
    └── full-toolkit/                     # Bundle option
        └── (all components)
```

### New User Flow (2 Steps)

```
Browse GGPrompts → Click "Install" → Done!
       1                2
```

**Behind the scenes:**
1. First install triggers: `/plugin marketplace add GGPrompts/ggprompts-marketplace`
2. Each install sends: `/plugin install {slug}@ggprompts-marketplace --scope user`
3. TabzChrome delivers commands to terminal

---

## Implementation Plan

### Phase 1: Fix my-gg-plugins Structure

**Goal:** Make my-gg-plugins work as a proper remote marketplace

**Tasks:**
1. Remove `plugin.json` (keep only `marketplace.json`)
2. Add `$schema` to marketplace.json
3. Create `plugins/` directory structure
4. Copy each component into proper plugin subdirectory:
   ```
   plugins/
     ui-styling/
       skills/
         ui-styling/
           SKILL.md
           references/
   ```
5. Update `source` paths in marketplace.json: `"./plugins/ui-styling"`
6. Test with `/plugin marketplace add` from fresh Claude Code session

**Estimated effort:** 2-3 hours

### Phase 2: TabzChrome Integration for Plugin Install

**Goal:** "Install" button sends command directly to Claude Code

**New Component:** `InstallPluginButton.tsx`

```typescript
interface InstallPluginButtonProps {
  slug: string;
  marketplace?: string; // default: 'ggprompts-marketplace'
  scope?: 'user' | 'project' | 'local';
}

function InstallPluginButton({ slug, marketplace = 'ggprompts-marketplace', scope = 'user' }) {
  const { queueToChat, isAvailable, ensureMarketplace } = useTabzChrome();

  const handleInstall = async () => {
    // First time: add marketplace
    await ensureMarketplace('GGPrompts/ggprompts-marketplace');

    // Send install command
    await queueToChat(`/plugin install ${slug}@${marketplace} --scope ${scope}`);

    toast.success('Install command sent to Claude Code');
  };

  if (!isAvailable) {
    return <CopyCommandButton command={`/plugin install ${slug}@${marketplace}`} />;
  }

  return (
    <Button onClick={handleInstall}>
      <Terminal className="w-4 h-4 mr-2" />
      Install to Claude
    </Button>
  );
}
```

**New Hook Methods:**
```typescript
// useTabzChrome.tsx additions
const ensureMarketplace = async (repo: string) => {
  // Check if marketplace already added (store in localStorage)
  const added = localStorage.getItem(`marketplace:${repo}`);
  if (!added) {
    await queueToChat(`/plugin marketplace add ${repo}`);
    localStorage.setItem(`marketplace:${repo}`, 'true');
  }
};

const installPlugin = async (slug: string, marketplace: string, scope: string) => {
  await queueToChat(`/plugin install ${slug}@${marketplace} --scope ${scope}`);
};

const uninstallPlugin = async (slug: string, marketplace: string) => {
  await queueToChat(`/plugin uninstall ${slug}@${marketplace}`);
};
```

**Estimated effort:** 4-6 hours

### Phase 3: Scope Selection UI

**Goal:** Let users choose where to install

**UI Addition:**
```
┌─────────────────────────────────────┐
│ Install "ui-styling"                │
│                                     │
│ Scope:                              │
│ ○ User (available everywhere)       │
│ ○ Project (shared with team)        │
│ ○ Local (this project only)         │
│                                     │
│ [Cancel]              [Install]     │
└─────────────────────────────────────┘
```

**Estimated effort:** 2-3 hours

### Phase 4: Bulk Install / Toolkit Sync

**Goal:** Install entire toolkit with one click

**Two Options:**

**Option A: Install Each Plugin**
```typescript
const installToolkit = async (toolkit: Component[]) => {
  await ensureMarketplace('GGPrompts/ggprompts-marketplace');

  for (const component of toolkit) {
    await queueToChat(`/plugin install ${component.slug}@ggprompts-marketplace`);
    await sleep(500); // Brief delay between commands
  }
};
```

**Option B: Generate Toolkit Bundle**
- Create user-specific bundle in marketplace
- Single install: `/plugin install user-toolkit-{userId}@ggprompts-marketplace`
- Requires dynamic marketplace generation

**Estimated effort:** 4-6 hours

### Phase 5: Status Indicator

**Goal:** Show which plugins are currently installed

**Challenge:** Need to read Claude Code settings from `~/.claude/settings.json`

**Options:**
1. **TabzChrome Bridge:** Add endpoint that reads settings file
2. **User Reports:** Ask user to paste installed plugins
3. **Assume Installed:** Track what we've sent install commands for

**New Component:**
```typescript
function PluginStatus({ slug }: { slug: string }) {
  const { installedPlugins } = useInstalledPlugins();

  const isInstalled = installedPlugins.includes(`${slug}@ggprompts-marketplace`);

  return isInstalled ? (
    <Badge variant="success">Installed</Badge>
  ) : (
    <InstallPluginButton slug={slug} />
  );
}
```

**Estimated effort:** 4-8 hours (depending on approach)

### Phase 6: Uninstall & Toggle

**Goal:** Full lifecycle management

```typescript
// Uninstall
await queueToChat(`/plugin uninstall ${slug}@ggprompts-marketplace`);

// Enable/Disable (requires settings.json modification)
// Option 1: Send /plugin enable/disable commands
// Option 2: Direct settings.json edit via TabzChrome
```

**Estimated effort:** 2-4 hours

---

## UI Mockups

### Component Card (Updated)

```
┌─────────────────────────────────────┐
│ 🧩 UI Styling                  ⭐ 4.8│
│ skill • ui-design                   │
│                                     │
│ Tailwind CSS and shadcn/ui          │
│ patterns for modern web styling     │
│                                     │
│ [Install ▾]  [Preview]  [♡ 234]    │
│  └─ User / Project / Local          │
└─────────────────────────────────────┘
```

### Toolkit Page (Updated)

```
┌─────────────────────────────────────────────────────────┐
│ My Claude Code Toolkit                                  │
│                                                         │
│ ┌─ TabzChrome: ● Connected ─────────────────────────┐  │
│ │ Commands will be sent directly to Claude Code     │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ Skills (3)                                              │
│ ├── ✅ UI Styling        [Installed] [Uninstall]       │
│ ├── ✅ Debugging         [Installed] [Uninstall]       │
│ └── ⬜ Web Frameworks    [Install]                     │
│                                                         │
│ Commands (2)                                            │
│ ├── ✅ handoff           [Installed] [Uninstall]       │
│ └── ✅ wipe              [Installed] [Uninstall]       │
│                                                         │
│ [Install All Not Installed]  [Sync to GitHub]          │
└─────────────────────────────────────────────────────────┘
```

### First-Time Setup

```
┌─────────────────────────────────────────────────────────┐
│ 🚀 Quick Setup                                          │
│                                                         │
│ To install plugins directly from GGPrompts:             │
│                                                         │
│ 1. Make sure TabzChrome is running                      │
│ 2. Click "Add Marketplace" below                        │
│ 3. Then install any plugin with one click!              │
│                                                         │
│ [Add GGPrompts Marketplace]                             │
│                                                         │
│ This sends: /plugin marketplace add GGPrompts/ggprompts │
└─────────────────────────────────────────────────────────┘
```

---

## Dual Installation Paths

**Both methods coexist permanently** - user chooses based on their setup.

### Path A: TabzChrome Direct Install (Recommended)

For users with TabzChrome browser extension:

```
┌─────────────────────────────────────┐
│ Install "ui-styling"                │
│                                     │
│ ● TabzChrome detected!              │
│                                     │
│ [Install to Claude]                 │
│   └─ Sends command directly         │
└─────────────────────────────────────┘
```

**Pros:**
- Instant (2 clicks)
- No GitHub account needed
- No repo management

**Best for:** Individual developers, quick setup, trying things out

### Path B: GitHub Sync (Power Users)

For users without TabzChrome or who want repo-based management:

```
┌─────────────────────────────────────┐
│ Install "ui-styling"                │
│                                     │
│ ○ TabzChrome not detected           │
│                                     │
│ [Add to Toolkit]                    │
│   └─ Then sync to GitHub            │
│                                     │
│ Or copy command:                    │
│ ┌─────────────────────────────────┐ │
│ │ /plugin install ui-styling@...  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Pros:**
- Works without TabzChrome
- Version controlled toolkit
- Share with team (project scope)
- Works offline

**Best for:** Teams, CI/CD setups, users who want control

### Adaptive UI

The UI adapts based on TabzChrome availability:

```typescript
function InstallOptions({ component }) {
  const { isAvailable } = useTabzChrome();

  return (
    <div>
      {isAvailable ? (
        // Primary: Direct install
        <InstallPluginButton slug={component.slug} />
      ) : (
        // Primary: Add to toolkit
        <AddToToolkitButton component={component} />
      )}

      {/* Always show alternatives */}
      <Collapsible title="Other options">
        {isAvailable && <AddToToolkitButton component={component} />}
        {!isAvailable && <CopyCommandButton slug={component.slug} />}
        <DownloadZipButton component={component} />
      </Collapsible>
    </div>
  );
}
```

### Feature Comparison

| Feature | TabzChrome Install | GitHub Sync | Copy Command |
|---------|-------------------|-------------|--------------|
| Speed | Instant | Minutes | Manual |
| GitHub required | No | Yes | No |
| TabzChrome required | Yes | No | No |
| Team sharing | No | Yes | No |
| Offline setup | No | Yes | Yes |
| Bulk install | Yes | Yes | No |
| Version control | No | Yes | No |

---

## Technical Requirements

### TabzChrome Enhancements

1. **Health check before commands** - Verify connection before sending
2. **Command queue** - Handle multiple rapid installs
3. **Feedback channel** - Know if command succeeded (stretch goal)

### GGPrompts Backend

1. **Marketplace repo** - Host `GGPrompts/ggprompts-marketplace` on GitHub
2. **Auto-publish** - When component approved, add to marketplace
3. **Version sync** - Keep marketplace in sync with database

### Claude Code Requirements

- Relies on existing `/plugin` commands
- No Claude Code changes needed
- Works with current plugin system

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Steps to install | 5+ | 2 |
| Time to first plugin | 10+ min | 30 sec |
| GitHub account required | Yes | No |
| Works without TabzChrome | No | Yes (copy command) |

---

## Priority Order

1. **Phase 1:** Fix my-gg-plugins structure (required for everything else)
2. **Phase 2:** TabzChrome install integration (biggest UX win)
3. **Phase 3:** Scope selection (nice to have)
4. **Phase 4:** Bulk install (power user feature)
5. **Phase 5:** Status indicator (polish)
6. **Phase 6:** Uninstall & toggle (complete lifecycle)

---

## Open Questions

1. **Marketplace naming:** `ggprompts-marketplace` or `my-gg-plugins`?
2. **User toolkits:** Keep GitHub sync or move to direct install only?
3. **Private plugins:** How to handle non-public components?
4. **Rate limiting:** How many installs before Claude Code complains?
5. **Feedback loop:** Can TabzChrome report install success/failure?

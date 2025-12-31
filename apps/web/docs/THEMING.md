# Theming

GGPrompts uses a CSS variable-based theming system with 10 color themes.

## Available Themes

| Theme | Primary Color | Description |
|-------|--------------|-------------|
| `amber` | #ffc857 | Golden amber on dark purple-blue (default) |
| `terminal` | #10b981 | Green/cyan on dark slate |
| `carbon` | #ffffff | White on pure black |
| `light` | #0066cc | Professional blue on off-white |
| `ocean` | #00d4ff | Bright aqua on deep blue |
| `sunset` | #ff6633 | Orange/coral on purple |
| `forest` | #8aff00 | Lime-green on dark green |
| `midnight` | #ff66ff | Magenta/fuchsia on indigo |
| `neon` | #ff0099 | Hot pink/cyan on near-black |
| `slate` | #33b3ff | Sky blue on slate-gray |

## How It Works

Themes are applied via the `data-theme` attribute on `<html>`:

```html
<html data-theme="amber">
```

CSS variables are defined per theme in `app/globals.css`:

```css
:root[data-theme="amber"] {
  --background: 260 30% 8%;
  --foreground: 45 100% 95%;
  --primary: 45 100% 60%;
  --primary-rgb: 255 200 87;
  /* ... more variables */
}
```

## ThemeProvider

Located at `components/ThemeProvider.tsx`:

```typescript
import { useTheme } from '@/components/ThemeProvider'

function MyComponent() {
  const { theme, setTheme, themes } = useTheme()

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      {themes.map(t => <option key={t} value={t}>{t}</option>)}
    </select>
  )
}
```

### API

- `theme` - Current theme name
- `setTheme(name)` - Change theme (persists to localStorage)
- `themes` - Array of all theme names

### Persistence

Theme is saved to `localStorage` key `ggprompts-theme` and restored on page load.

## CSS Variables

Each theme defines these variables:

| Variable | Purpose |
|----------|---------|
| `--background` | Page background |
| `--foreground` | Default text color |
| `--card` | Card backgrounds |
| `--card-foreground` | Card text |
| `--primary` | Primary accent color |
| `--primary-foreground` | Text on primary |
| `--secondary` | Secondary accent |
| `--muted` | Muted backgrounds |
| `--muted-foreground` | Muted text |
| `--border` | Border color |
| `--primary-rgb` | RGB values for glows |
| `--glass-bg` | Glass effect tint |

## Glass Utilities

Glass effects for cards and overlays:

```css
/* Subtle glass with blur */
.glass {
  background: rgba(var(--glass-bg), 0.12);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid hsl(var(--border) / 0.6);
  box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.2);
}

/* Darker glass */
.glass-dark {
  background: hsl(var(--glass-dark-bg) / 0.8);
  backdrop-filter: blur(16px) saturate(180%);
}

/* Strong overlay */
.glass-overlay {
  background: hsl(var(--glass-overlay-bg) / 0.97);
  backdrop-filter: blur(20px) saturate(180%);
}
```

Usage:

```tsx
<Card className="glass border-primary/30">
  {/* Content */}
</Card>

<div className="glass-dark p-4 rounded-lg">
  {/* Dark glass panel */}
</div>
```

## Text Effects

```css
/* Glowing text matching theme */
.terminal-glow {
  text-shadow: 0 0 10px rgba(var(--primary-rgb), 0.5);
}

/* Gradient text */
.gradient-text-theme {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## Using with shadcn/ui

All shadcn/ui components automatically use theme variables:

```tsx
// Button uses --primary automatically
<Button>Click me</Button>

// Cards use --card and --border
<Card className="border-primary/30">
  <CardHeader>
    <CardTitle className="text-primary">Title</CardTitle>
  </CardHeader>
</Card>
```

## Adding a New Theme

1. Add theme name to `ThemeProvider.tsx`:

```typescript
const themes = ['amber', 'terminal', ..., 'your-theme'] as const
```

2. Add CSS variables in `globals.css`:

```css
:root[data-theme="your-theme"] {
  --background: /* HSL values */;
  --foreground: /* HSL values */;
  --primary: /* HSL values */;
  /* ... all required variables */
}
```

3. Add glass overrides if needed:

```css
:root[data-theme="your-theme"] .glass {
  /* Custom glass effect */
}
```

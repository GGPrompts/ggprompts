# @ggprompts/themes

Unified theme system for GGPrompts - 9 color themes x 2 modes = 18 total combinations.

## Installation

```bash
npm install @ggprompts/themes
```

## Usage

### With Tailwind v4

```css
/* In your main CSS file */
@import "tailwindcss";
@import "@ggprompts/themes";
```

### HTML Structure

```html
<html data-theme="ocean" data-mode="dark" data-bg-tone="ocean">
  <!-- Your content -->
</html>
```

## Themes

| Theme | Description | Primary Color |
|-------|-------------|---------------|
| `terminal` | Phosphor glow terminal aesthetic | Emerald/Cyan |
| `amber` | Warm golden tones on purple | Gold/Orange |
| `carbon` | Monochrome slate/gray | Grayscale |
| `ocean` | Deep blue with coral accents | Aqua/Turquoise |
| `sunset` | Purple-pink with orange | Orange/Pink |
| `forest` | Dark green with lime accents | Lime/Chartreuse |
| `midnight` | Deep indigo with magenta | Magenta/Fuchsia |
| `neon` | Near-black with neon accents | Hot Pink/Cyan |
| `slate` | Blue-gray professional | Sky Blue |

## Modes

Each theme supports two modes:

- `dark` (default) - Dark backgrounds with light text
- `light` - Light backgrounds with dark text

```html
<!-- Dark mode (default) -->
<html data-theme="ocean" data-mode="dark">

<!-- Light mode -->
<html data-theme="ocean" data-mode="light">
```

## Background Tones

Independent of theme colors - controls body background gradient:

| Tone | Dark Mode | Light Mode |
|------|-----------|------------|
| `charcoal` | Dark slate | Silver |
| `deep-purple` | Purple-blue | Lavender |
| `pure-black` | True black | White |
| `ocean` | Deep blue | Sky blue |
| `sunset` | Purple-pink | Rose/Blush |
| `forest` | Dark green | Mint |
| `midnight` | Indigo | Periwinkle |
| `neon-dark` | Near-black | Soft gray |
| `slate` | Blue-gray | Light steel |

```html
<html data-theme="terminal" data-mode="dark" data-bg-tone="charcoal">
```

## CSS Variables

All themes provide these CSS variables (HSL format):

### Colors
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--accent`, `--accent-foreground`
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--muted`, `--muted-foreground`
- `--destructive`, `--destructive-foreground`

### Border & Input
- `--border`
- `--input`
- `--ring`

### RGB Values (for rgba usage)
- `--primary-rgb`
- `--secondary-rgb`

### Glass Variables
- `--glass-bg`
- `--glass-dark-bg`
- `--glass-overlay-bg`

### Gradient Variables
- `--gradient-1`, `--gradient-2`
- `--gradient-text`

## Utility Classes

### Glassmorphism

```html
<!-- Standard glass -->
<div class="glass">...</div>

<!-- Darker variant -->
<div class="glass-dark">...</div>

<!-- High-opacity overlay -->
<div class="glass-overlay">...</div>
```

### Glow Effects

```html
<!-- Text glow -->
<span class="terminal-glow">Glowing text</span>

<!-- Border/box glow -->
<div class="border-glow">...</div>
```

### Gradient Text

```html
<h1 class="gradient-text-theme">Gradient Title</h1>
```

### Animations

```html
<!-- Animated gradient background -->
<div class="animate-gradient">...</div>

<!-- Cursor blink -->
<span class="animate-cursor-blink">|</span>

<!-- Pulsing glow -->
<div class="animate-pulse-glow">...</div>

<!-- Shimmer loading -->
<div class="animate-shimmer">...</div>
```

### Scrollbar

```html
<!-- Hide scrollbar -->
<div class="scrollbar-hidden overflow-auto">...</div>

<!-- Styled visible scrollbar -->
<div class="scrollbar-visible overflow-auto">...</div>
```

## Background Styles

```html
<!-- Gradient background -->
<div class="bg-style-gradient">...</div>

<!-- Mesh gradient -->
<div class="bg-style-mesh">...</div>

<!-- Minimal vignette -->
<div class="bg-style-minimal">...</div>

<!-- Textured with noise -->
<div class="bg-style-textured">...</div>
```

## Using Variables in Tailwind

```html
<!-- Using HSL variables -->
<div class="bg-[hsl(var(--primary))]">...</div>
<div class="text-[hsl(var(--foreground))]">...</div>

<!-- Using RGB variables for alpha -->
<div class="bg-[rgba(var(--primary-rgb),0.5)]">...</div>
```

## Individual Imports

Import specific parts if needed:

```css
/* Just themes */
@import "@ggprompts/themes/themes/ocean.css";
@import "@ggprompts/themes/themes/terminal.css";

/* Just modes */
@import "@ggprompts/themes/modes";

/* Just backgrounds */
@import "@ggprompts/themes/backgrounds";

/* Just utilities */
@import "@ggprompts/themes/utilities";
```

## File Structure

```
packages/themes/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.css           # Main entry (imports all)
    ├── modes.css           # Dark/light mode definitions
    ├── backgrounds.css     # Background tones
    ├── utilities.css       # Glass, gradients, glows
    └── themes/
        ├── terminal.css
        ├── amber.css
        ├── carbon.css
        ├── ocean.css
        ├── sunset.css
        ├── forest.css
        ├── midnight.css
        ├── neon.css
        └── slate.css
```

## License

MIT

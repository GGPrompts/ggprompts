# Enhance Themes, Backgrounds & Header Colors - Full Context Prompt

**Copy everything below this line and paste into Claude.ai**

---

# Project Context

I have a Next.js 15 portfolio with **116 production templates** and a complete template gallery. Currently I have 4 themes (Terminal, Amber, Carbon, Light) and I want to expand this with more themes, add background selection options, and make headers have unique, eye-catching colors.

## Tech Stack
- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v3** with custom terminal theme
- **Framer Motion** for animations
- **shadcn/ui components** (40+)
- **ThemeProvider** component for theme switching

## Current Design System

### Existing Theme Structure
Located in `app/globals.css`:

```css
/* Current themes use CSS variables */
[data-theme="terminal"] {
  --background: 220 13% 5%;
  --foreground: 160 84% 95%;
  --primary: 160 84% 39%;
  --secondary: 173 80% 40%;
  --border: 160 60% 25%;
  /* ... more variables */
}

[data-theme="amber"] { /* ... */ }
[data-theme="carbon"] { /* ... */ }
[data-theme="light"] { /* ... */ }
```

### Current Background Component
`components/SpaceBackground.tsx` - Animated space background with stars, nebulae, shooting stars

### Theme Provider
`components/ThemeProvider.tsx` - Context provider that manages theme switching and localStorage

## What I Need You to Build

### 1. **Add 4-6 New Themes**

Create visually distinct themes that complement the existing ones:

**Suggested themes:**
- **Ocean** - Deep blues/teals with aqua accents
- **Sunset** - Warm oranges/purples with pink highlights
- **Forest** - Deep greens with lime accents
- **Midnight** - Purple/indigo with magenta highlights
- **Neon** - Cyberpunk-inspired bright colors
- **Slate** - Professional grays with blue accents

**Requirements:**
- Each theme needs full CSS variable definitions in `app/globals.css`
- Follow the existing pattern with all required variables
- Test that glassmorphism (`.glass` class) works beautifully with each theme
- Ensure good contrast for accessibility
- Make sure terminal glow effects adapt to theme colors

### 2. **Add Background Selection System**

Create a new `BackgroundProvider` and multiple background options:

**Background Options to Create:**
1. **Space** (current) - Stars, nebulae, shooting stars
2. **Particles** - Floating geometric particles
3. **Waves** - Animated wave patterns
4. **Grid** - Animated grid/mesh effect
5. **Gradient** - Smooth animated gradients
6. **Minimal** - Solid color with subtle texture
7. **None** - Just the page background color

**Technical Requirements:**
- Create `components/BackgroundProvider.tsx` with context
- Create individual background components in `components/backgrounds/`
- Add background selector to template gallery header (next to theme switcher)
- Save background preference to localStorage
- All backgrounds should be performant (60fps)
- Backgrounds should adapt to the active theme's colors
- Hide heavy animations in light theme for performance

**UI for Background Selector:**
- Use Select component (like theme switcher)
- Icon: Grid3x3 or Layers
- Position: In header badges area, after theme switcher
- Should match the styling of theme switcher

### 3. **Enhance Header Colors**

Make headers throughout the site more visually striking with unique gradients:

**Headers to Style:**

1. **"Ultimate Template Gallery"** (main h1)
   - Current: `bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400`
   - Make it even more vibrant and eye-catching
   - Add subtle animation (slow pulse or shimmer effect)

2. **Category Headers** (E-commerce, Dashboards, SaaS, etc.)
   - Each category should have a unique gradient color scheme
   - Use the category's `color` property from template metadata
   - Example: E-commerce gets green gradient, Dashboards gets blue, etc.
   - Apply to both the category tab labels AND the h2 headers in each section

3. **Template Card Titles**
   - Subtle gradient on hover that matches the template's color scheme
   - Terminal glow effect that adapts to theme

4. **Section Headers**
   - Stats section ("Why This Gallery")
   - Features section headers
   - Any other h2/h3 elements

**Color Enhancement Techniques:**
- Use `bg-gradient-to-r`, `bg-gradient-to-br`, `text-transparent`, `bg-clip-text`
- Add `terminal-glow` class for phosphor effect
- Consider `animate-gradient` for subtle movement
- Use Framer Motion for sophisticated hover effects
- Ensure colors adapt to active theme (brighter in dark themes, more subtle in light)

### 4. **Theme Switcher Enhancement**

Update the theme switcher to show all new themes:

**Current Switcher Location:**
`app/page.tsx` and `app/templates/page.tsx` - in the header badges area

**What to Update:**
- Add all new themes to the dropdown
- Consider adding theme preview icons/colors in the dropdown
- Maybe show a live preview when hovering over theme options
- Keep the current styling (gradient background, Palette icon)

## File Structure

```
app/
├── page.tsx                      # Homepage (template gallery)
├── templates/page.tsx            # Templates route (same gallery)
└── globals.css                   # Theme definitions

components/
├── ThemeProvider.tsx             # Current theme management
├── BackgroundProvider.tsx        # NEW - Background management
├── SpaceBackground.tsx           # Current space background
└── backgrounds/                  # NEW folder
    ├── ParticlesBackground.tsx
    ├── WavesBackground.tsx
    ├── GridBackground.tsx
    ├── GradientBackground.tsx
    └── MinimalBackground.tsx
```

## Implementation Strategy

You can use **subagents** to parallelize:

1. **Agent 1**: Create new theme CSS variables in `globals.css` (4-6 themes)
2. **Agent 2**: Create BackgroundProvider and background components
3. **Agent 3**: Update header colors with gradients and animations
4. **Agent 4**: Update theme/background selectors in header
5. **Agent 5**: Test everything works together and fix any issues

OR build it all in sequence - whatever works best!

## Code Quality Standards

- **TypeScript**: Strict types for all props, state, functions
- **Performance**: Optimize animations (use transform/opacity, CSS when possible)
- **Accessibility**: Ensure good contrast ratios, respect prefers-reduced-motion
- **Clean code**: Well-commented, production-ready
- **Theme-aware**: Everything adapts to active theme
- **Responsive**: Works on mobile and desktop

## Example: Category Header Colors

```tsx
// Before
<h2 className="text-3xl font-bold mb-6">E-commerce Templates</h2>

// After
<h2 className="text-3xl font-bold mb-6">
  <span className="bg-gradient-to-r from-emerald-400 to-green-500 text-transparent bg-clip-text terminal-glow">
    E-commerce Templates
  </span>
</h2>
```

## Example: Background Provider Usage

```tsx
// In layout or provider
<BackgroundProvider>
  <ThemeProvider>
    {children}
  </ThemeProvider>
</BackgroundProvider>

// In template gallery header (next to theme switcher)
<Select value={background} onValueChange={setBackground}>
  <SelectTrigger className="w-[140px] h-7 font-mono text-sm bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0">
    <Layers className="h-3 w-3 mr-1" />
    <SelectValue />
  </SelectTrigger>
  <SelectContent className="font-mono">
    <SelectItem value="space">Space</SelectItem>
    <SelectItem value="particles">Particles</SelectItem>
    <SelectItem value="waves">Waves</SelectItem>
    <SelectItem value="grid">Grid</SelectItem>
    <SelectItem value="gradient">Gradient</SelectItem>
    <SelectItem value="minimal">Minimal</SelectItem>
    <SelectItem value="none">None</SelectItem>
  </SelectContent>
</Select>
```

## Success Criteria

When you're done, I should have:

✅ **8-10 total themes** (4 existing + 4-6 new) all looking amazing
✅ **7 background options** that work beautifully with all themes
✅ **Vibrant header colors** with unique gradients for each category
✅ **Easy switching** between themes and backgrounds in the header
✅ **Smooth performance** - 60fps animations, no jank
✅ **Theme adaptation** - backgrounds and colors adapt to active theme
✅ **localStorage persistence** - preferences saved between sessions

## Additional Notes

- Feel free to get creative with theme names and color palettes!
- Make backgrounds visually interesting but not distracting
- Headers should "pop" and guide the eye
- Everything should feel polished and professional
- The glassmorphism aesthetic should be enhanced, not hidden
- Test in both light and dark themes

## Bonus (Optional)

If you have time/creativity:
- Add a "Random Theme" button that cycles through themes
- Create a "Theme of the Day" feature
- Add smooth transitions between background changes
- Implement background customization (intensity slider, speed control)
- Add theme preview thumbnails in the dropdown

Build something amazing! 🚀

---

**End of prompt - paste everything above into Claude.ai**

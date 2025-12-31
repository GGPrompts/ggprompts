# Button Variant Styling Investigation

## Problem
Several button variants on the `/styleguide` page appear identical or are too transparent to see properly. They may be missing CSS or using opacity values that don't work well with the dark terminal theme.

## What to Check

### 1. Inspect Button Component
- **File**: `components/ui/button.tsx`
- Check the `buttonVariants` using `cva()` from class-variance-authority
- Verify each variant has distinct styling:
  - `default` - Should use primary colors
  - `secondary` - Should use secondary colors
  - `destructive` - Should use destructive/red colors
  - `outline` - Should have visible border
  - `ghost` - Should have hover state
  - `link` - Should look like text link

### 2. Check CSS Variables
- **File**: `app/globals.css`
- Verify all shadcn color variables are properly defined in the terminal theme:
  ```css
  --primary: 160 84% 39%
  --secondary: 173 80% 40%
  --destructive: 0 84% 60%
  --muted: 220 13% 15%
  ```
- These should work with dark backgrounds

### 3. Test on Styleguide Page
- **URL**: `http://localhost:3000/styleguide`
- Navigate to "Buttons & Badges" section
- Each button variant should be visually distinct
- Check both normal and hover states

### 4. Common Issues to Fix
- **Transparency problem**: Buttons using `bg-white/10` or similar might be too transparent on black background
- **Missing contrast**: Some variants might blend into the dark terminal background
- **Undefined variables**: shadcn components expect certain CSS variables to be defined

### 5. Recommended Fix Strategy
1. Read `components/ui/button.tsx` to see current variant definitions
2. Check if colors are using `hsl(var(--primary))` format (correct) or hardcoded values
3. Test each variant on dark background - ensure sufficient contrast
4. Consider adding the terminal glow effect to primary/default buttons
5. Make outline variant use `border-glow` class for visibility
6. Update styleguide examples to show all variants side-by-side for comparison

## Expected Outcome
All 6 button variants (default, secondary, destructive, outline, ghost, link) should be clearly visible and visually distinct on the dark terminal-themed background.

## Context Files
- `components/ui/button.tsx` - Button component with variants
- `app/globals.css` - CSS variables and terminal theme
- `app/styleguide/page.tsx` - Where buttons are showcased
- `CLAUDE.md` - Full project context

## Quick Test Command
```bash
npm run dev
# Then visit http://localhost:3000/styleguide
# Scroll to "Buttons & Badges" section
```

# Component Guide

How to add, customize, and maintain components in design2prompt.

---

## Adding a New Component

### Step 1: Create Preview Component

```typescript
// components/component-previews/cards/MyNewCard.tsx
'use client'

import { motion } from 'framer-motion'
import type { PreviewProps } from '@/types/component'

export function MyNewCardPreview({ customization }: PreviewProps) {
  return (
    <motion.div
      className="w-full max-w-sm p-6 rounded-xl"
      style={{
        backgroundColor: customization.primaryColor,
        borderRadius: `${customization.borderRadius}px`,
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-bold mb-2">My New Card</h3>
      <p className="text-sm opacity-80">
        This is a new card component with custom styling.
      </p>
    </motion.div>
  )
}
```

### Step 2: Add to Component Registry

```typescript
// lib/component-registry.ts
import { MyNewCardPreview } from '@/components/component-previews/cards/MyNewCard'

export const componentRegistry = {
  // ... existing components

  'my-new-card': {
    id: 'my-new-card',
    name: 'My New Card',
    category: 'cards',
    description: 'A beautiful new card with custom features',
    tags: ['card', 'modern', 'custom'],
    preview: MyNewCardPreview,

    defaultCustomization: {
      primaryColor: '#10b981',
      secondaryColor: '#06b6d4',
      borderRadius: '12',
      // ... other defaults
    },

    customizableProps: [
      {
        key: 'primaryColor',
        label: 'Primary Color',
        type: 'color',
        defaultValue: '#10b981',
        description: 'Main background color',
      },
      {
        key: 'borderRadius',
        label: 'Border Radius',
        type: 'slider',
        min: 0,
        max: 32,
        step: 1,
        defaultValue: 12,
        description: 'Corner roundness in pixels',
      },
      // Add more customizable props
    ],

    thumbnail: '/thumbnails/my-new-card.png', // Optional
  },
}
```

### Step 3: Create Component-Specific Options (Optional)

```typescript
// components/customization/ComponentSpecificOptions.tsx

if (component.id === 'my-new-card') {
  return (
    <div className="space-y-4">
      <div>
        <Label>Special Feature</Label>
        <Switch
          checked={customization.specialFeature}
          onCheckedChange={(v) => updateCustomization('specialFeature', v)}
        />
      </div>
    </div>
  )
}
```

### Step 4: Test the Component

```bash
npm run dev
```

Navigate to `/studio` and:
1. Find your component in the library
2. Test all customization options
3. Verify preview updates in real-time
4. Save to a collection
5. Add to canvas
6. Export as prompt

---

## Component Categories

**Current categories:**
- `cards` - Card components
- `buttons` - Button variants
- `forms` - Form elements
- `navigation` - Navigation components
- `effects` - Visual effects
- `data-display` - Stats, metrics, progress
- `modals` - Dialogs, drawers, toasts
- `headers` - Hero sections, headers

**Adding a new category:**

```typescript
// types/component.ts
export type ComponentCategory =
  | 'cards'
  | 'buttons'
  | 'my-new-category' // Add here

// Update category config
export const categoryConfig = {
  'my-new-category': {
    label: 'My Category',
    description: 'Description of this category',
    icon: MyIcon,
  },
}
```

---

## Customization Props

### Prop Types

**Color:**
```typescript
{
  key: 'primaryColor',
  type: 'color',
  defaultValue: '#10b981',
}
```

**Slider:**
```typescript
{
  key: 'opacity',
  type: 'slider',
  min: 0,
  max: 100,
  step: 5,
  defaultValue: 50,
}
```

**Select:**
```typescript
{
  key: 'variant',
  type: 'select',
  options: ['solid', 'outline', 'ghost'],
  defaultValue: 'solid',
}
```

**Toggle:**
```typescript
{
  key: 'showBorder',
  type: 'toggle',
  defaultValue: true,
}
```

**Text:**
```typescript
{
  key: 'label',
  type: 'text',
  defaultValue: 'Click me',
}
```

---

## Best Practices

### Performance

**✅ Do:**
- Use CSS for static styles
- Use inline styles for dynamic values
- Memoize expensive calculations
- Use Framer Motion sparingly

**❌ Don't:**
- Recreate objects in render
- Use complex animations on every component
- Fetch data in preview components

### Styling

**✅ Do:**
- Use Tailwind classes where possible
- Use inline styles for user customization
- Follow existing component patterns
- Support dark mode

**❌ Don't:**
- Use !important
- Create new global styles
- Hardcode colors
- Break responsive design

### Accessibility

**✅ Do:**
- Use semantic HTML
- Add ARIA labels
- Support keyboard navigation
- Maintain color contrast

**❌ Don't:**
- Use divs for buttons
- Forget focus states
- Ignore screen readers
- Use color as only indicator

---

## Component Templates

### Minimal Card

```typescript
export function MinimalCardPreview({ customization }: PreviewProps) {
  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        backgroundColor: customization.backgroundColor,
        borderColor: customization.primaryColor,
        borderRadius: `${customization.borderRadius}px`,
      }}
    >
      <h3>Card Title</h3>
      <p>Card content</p>
    </div>
  )
}
```

### Animated Button

```typescript
export function AnimatedButtonPreview({ customization }: PreviewProps) {
  return (
    <motion.button
      className="px-6 py-3 rounded-lg font-medium"
      style={{
        backgroundColor: customization.primaryColor,
        borderRadius: `${customization.borderRadius}px`,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Click me
    </motion.button>
  )
}
```

### Glassmorphic Component

```typescript
export function GlassComponentPreview({ customization }: PreviewProps) {
  return (
    <div
      className="backdrop-blur-md border"
      style={{
        backgroundColor: `${customization.primaryColor}15`,
        borderColor: `${customization.primaryColor}40`,
        backdropFilter: `blur(${customization.blurAmount}px)`,
      }}
    >
      {/* Content */}
    </div>
  )
}
```

---

## Debugging Components

### Common Issues

**Component doesn't show:**
- Check it's registered in `componentRegistry`
- Verify category is valid
- Check for console errors

**Customization not working:**
- Verify prop is in `customizableProps`
- Check prop key matches exactly
- Ensure default value is set

**Preview looks broken:**
- Check CSS conflicts
- Verify style prop syntax
- Test with default customization

### Debug Tools

```typescript
// Add to preview component
console.log('Customization:', customization)
console.log('Computed styles:', {
  backgroundColor: customization.primaryColor,
  // ... other computed values
})
```

---

## Migration Guide

### From portfolio-style-guides

If extracting components from the portfolio project:

1. **Copy preview logic** from `claude-component-studio/page.tsx`
2. **Extract to separate file** in `component-previews/`
3. **Convert to PreviewProps interface**
4. **Add to registry** with metadata
5. **Test in studio**

Example:

```typescript
// Before (in one file)
if (component.id === 'glass-card') {
  return <div>...</div>
}

// After (separate file)
export function GlassCardPreview({ customization }: PreviewProps) {
  return <div>...</div>
}
```

---

Last Updated: 2025-11-29

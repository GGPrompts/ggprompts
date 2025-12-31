# Mobile UI Audit Prompt for Portfolio Templates

## Context

This project contains **95 production-ready templates** across 18 categories, totaling 74,515 lines of TypeScript/React code. The templates are built with Next.js 15, shadcn/ui components, Framer Motion animations, and a custom glassmorphism design system with 4 theme variants (Terminal, Amber, Carbon, Light).

When tested on mobile devices (Vercel deployment), several templates exhibit mobile UI issues including:
- Text overflowing outside of containers/boxes
- Layout breaking at mobile breakpoints
- Elements not properly wrapping or stacking
- Touch targets too small
- Horizontal scrolling where it shouldn't occur

## Your Task

Systematically audit all 95 templates for mobile responsiveness issues and create fixes. Focus on templates in order of priority (most commonly used first).

## Template Categories to Audit

Located in `app/templates/[template-name]/page.tsx`:

**High Priority (User-Facing):**
1. SaaS (5): roadmap, help-center, api-reference, community, affiliates
2. Authentication (5): login, signup, password-reset, 2fa-setup, email-verification
3. Marketing (8): features, integrations, comparison, testimonials, about, press-kit, careers, security
4. Landing Pages (3): saas-landing, pricing, contact-hub
5. Portfolio (3): portfolio-minimal, portfolio-bento, portfolio-magazine

**Medium Priority (Interactive):**
6. Onboarding (4): product-tour, setup-wizard, onboarding-checklist, welcome-series
7. E-Commerce (6): product-detail, cart, checkout, product-listing, product-comparison, order-confirmation
8. Forms & Builders (4): form-builder, survey-builder, quiz-builder, event-registration
9. Social & Community (3): social-feed, user-directory, leaderboard

**Lower Priority (Admin/Internal):**
10. Dashboards (9): dashboard, admin-dashboard, analytics-dashboard, sales-dashboard, devops-dashboard, finance-dashboard, marketing-dashboard, support-dashboard, user-profile
11. Billing & Payments (5): billing-history, subscription-management, invoice-detail, usage-metering, payment-methods
12. Monitoring & Status (4): status-page, uptime-monitor, incident-report, maintenance
13. Blog & Content (6): author-profile, category, tag, archive, newsletter, resources
14. Projects & Documentation (3): case-study, api-docs, blog-post, docs-hub
15. Launch & Email (9): waitlist, product-launch, landing-app, landing-agency, squeeze-page, email-transactional, email-marketing, email-campaign-builder, email-analytics
16. Utility (6): changelog, settings, search-results, 404, 500
17. Resumes (4): resume-timeline, resume-bento, resume-terminal

## Mobile Breakpoints to Test

Follow Tailwind CSS breakpoints:
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 768px (sm to md)
- **Desktop**: > 768px (md+)

Primary focus: **Mobile portrait mode (375px - 428px width)**

## Common Mobile Issues to Check

### 1. **Text Overflow**
- [ ] Long text (titles, descriptions, usernames) breaking out of containers
- [ ] Text not wrapping properly with `whitespace-nowrap` where it shouldn't be
- [ ] Missing `truncate`, `line-clamp`, or proper `overflow-hidden` classes
- [ ] Card titles, badges, and labels extending beyond card boundaries

**Example Fix:**
```tsx
// Bad
<h2 className="text-2xl font-bold">Very Long Title That Breaks Layout</h2>

// Good
<h2 className="text-xl md:text-2xl font-bold truncate">Very Long Title That Breaks Layout</h2>
// or
<h2 className="text-xl md:text-2xl font-bold line-clamp-2">Very Long Title That Breaks Layout</h2>
```

### 2. **Fixed Widths**
- [ ] Elements with `w-64`, `w-80`, `w-96` etc. that don't scale down
- [ ] Min-width constraints that are too large for mobile
- [ ] Missing `max-w-full` on containers

**Example Fix:**
```tsx
// Bad
<div className="w-96">Content</div>

// Good
<div className="w-full max-w-96">Content</div>
```

### 3. **Horizontal Scrolling**
- [ ] Flex containers without proper wrapping
- [ ] Grid layouts with too many columns
- [ ] Tables without horizontal scroll wrappers
- [ ] Missing `overflow-x-auto` where needed

**Example Fix:**
```tsx
// Bad - 4 columns on mobile
<div className="grid grid-cols-4 gap-4">

// Good - 1-2 columns on mobile, 4 on desktop
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
```

### 4. **Padding/Spacing**
- [ ] Excessive padding on mobile (p-8, p-12 should scale down)
- [ ] Content too close to edges (needs minimum p-4)
- [ ] Gap between elements too large for small screens

**Example Fix:**
```tsx
// Bad
<div className="p-12">

// Good
<div className="p-4 md:p-8 lg:p-12">
```

### 5. **Font Sizes**
- [ ] Text too large on mobile (text-4xl, text-5xl, text-6xl)
- [ ] Text too small to read (text-xs without responsive scaling)
- [ ] Missing responsive text classes

**Example Fix:**
```tsx
// Bad
<h1 className="text-6xl font-bold">

// Good
<h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">
```

### 6. **Touch Targets**
- [ ] Buttons/links smaller than 44x44px (Apple guideline)
- [ ] Clickable elements too close together
- [ ] Missing `min-h-[44px]` or proper padding

**Example Fix:**
```tsx
// Bad
<button className="px-2 py-1 text-xs">

// Good
<button className="px-4 py-3 text-sm min-h-[44px]">
```

### 7. **Navigation & Headers**
- [ ] Fixed headers covering content
- [ ] Missing mobile hamburger menus
- [ ] Desktop navigation not collapsing
- [ ] Proper `pt-16` or `pt-20` on main content under fixed headers

### 8. **Dialogs & Modals**
- [ ] Modals not fitting on small screens
- [ ] Missing `max-h-screen` and scroll behavior
- [ ] Content extending beyond viewport

**Example Fix:**
```tsx
// Bad
<DialogContent className="max-w-2xl">

// Good
<DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
```

### 9. **Images & Media**
- [ ] Images with fixed dimensions breaking layout
- [ ] Missing `object-cover` or `object-contain`
- [ ] Aspect ratios not maintained

### 10. **Complex Layouts**
- [ ] Multi-column layouts not stacking on mobile
- [ ] Sidebars not becoming full-width
- [ ] Missing `flex-col` on mobile, `flex-row` on desktop

## Systematic Audit Process

For each template:

### Step 1: Visual Inspection (5 min)
1. Open template in browser at 375px width
2. Scroll through entire page
3. Note obvious issues (overflow, breaking, cramped)
4. Test at 428px (iPhone 14 Pro Max)
5. Test at 360px (common Android)

### Step 2: Interactive Testing (3 min)
1. Click all buttons/links (check touch targets)
2. Open all dialogs/modals
3. Expand all accordions/dropdowns
4. Fill out forms if present
5. Test horizontal scrolling areas

### Step 3: Code Review (10 min)
1. Search for fixed widths: `className="w-\d+"`
2. Search for large text: `text-[456]xl`
3. Check grid columns: `grid-cols-[3-9]` without responsive variants
4. Review padding: `p-[89]|p-1[02]` without responsive variants
5. Look for `whitespace-nowrap` on text that should wrap

### Step 4: Fix & Verify (10-15 min)
1. Apply fixes using responsive Tailwind classes
2. Test fixes at all three breakpoints
3. Ensure no regressions on desktop
4. Commit changes per template or per category

## Output Format

Create a report for each template in this format:

```markdown
## Template: [template-name]

**Status:** ✅ Pass | ⚠️ Minor Issues | ❌ Major Issues

**Issues Found:**
1. [Issue type] - [Description] - Line [number]
   - Fix: [What you did]
2. ...

**Files Modified:**
- app/templates/[template-name]/page.tsx

**Testing Notes:**
- Tested at 375px, 428px, 768px
- All touch targets > 44px
- No horizontal overflow
- Text properly wraps
```

## Priority Order

Start with these templates (most commonly viewed):

1. **portfolio-minimal** - Already has some fixes
2. **login** / **signup** - Critical user flows
3. **saas-landing** / **pricing** - Main marketing pages
4. **product-detail** / **cart** / **checkout** - E-commerce flow
5. **dashboard** / **user-profile** - Main app pages
6. Then proceed through remaining categories

## Quick Fixes Reference

```tsx
// Common responsive patterns
className="
  // Text sizes
  text-sm md:text-base lg:text-lg
  text-2xl md:text-3xl lg:text-4xl

  // Spacing
  p-4 md:p-6 lg:p-8
  gap-4 md:gap-6 lg:gap-8
  space-y-4 md:space-y-6

  // Layout
  flex flex-col md:flex-row
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  w-full md:w-auto

  // Containers
  max-w-full md:max-w-xl lg:max-w-4xl
  min-h-[44px] // Touch targets
  overflow-x-auto // Tables/wide content

  // Text handling
  truncate // Single line
  line-clamp-2 // Multi-line
  break-words // Long words
"
```

## Design System Classes to Use

The project has these custom glassmorphism utilities:
- `.glass` - Light glassmorphism
- `.glass-dark` - Darker glassmorphism
- `.glass-overlay` - High opacity for dialogs
- `.terminal-glow` - Text glow effect
- `.border-glow` - Border glow effect

These work across all 4 themes and are already mobile-friendly.

## Testing Tools

1. **Browser DevTools**: Chrome/Safari device toolbar (Cmd+Shift+M)
2. **Real Device**: Test on actual phone via Vercel preview URL
3. **Responsive Design Mode**: Firefox (Cmd+Opt+M)

## Success Criteria

A template passes mobile audit when:
- ✅ No horizontal scrolling (except intended carousels)
- ✅ All text visible and readable (no overflow)
- ✅ Touch targets minimum 44x44px
- ✅ Content stacks/reflows properly at 375px
- ✅ Modals/dialogs fit within viewport
- ✅ Images scale appropriately
- ✅ Forms are usable with mobile keyboard
- ✅ No content cut off or hidden

## Start Here

Begin with: "I'll audit the templates for mobile UI issues starting with [template-name]. Let me check for text overflow, fixed widths, and touch targets..."

Work through templates systematically, creating fixes and testing as you go. Focus on the most critical user-facing templates first.

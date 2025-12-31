# Component Mapping: portfolio-style-guides -> design2prompt

## Executive Summary

This document provides a comprehensive mapping of components from `~/projects/portfolio-style-guides` to the `design2prompt` component registry. The source project contains:

- **44 UI Components** in `components/ui/`
- **116 Page Templates** in `app/templates/`
- **1 Styleguide** showcasing all components in `app/styleguide/page.tsx`

### Current State of design2prompt
- 6 components (3 cards, 3 buttons)
- 8 categories defined: cards, buttons, forms, navigation, effects, data-display, modals, headers

### Goal
Expand to **50+ components** across all categories with rich customization options.

---

## Component Inventory: Base UI Components (44 total)

### From portfolio-style-guides/components/ui/

| File | Component | Category Mapping | Priority | Notes |
|------|-----------|------------------|----------|-------|
| `accordion.tsx` | Accordion | navigation | HIGH | Collapsible content sections |
| `alert.tsx` | Alert | data-display | MEDIUM | Status messages with variants |
| `alert-dialog.tsx` | AlertDialog | modals | HIGH | Confirmation dialogs |
| `animated-background.tsx` | AnimatedBackground | effects | HIGH | Hover-following background |
| `avatar.tsx` | Avatar | data-display | MEDIUM | User profile images |
| `badge.tsx` | Badge | data-display | HIGH | Status indicators, labels |
| `border-trail.tsx` | BorderTrail | effects | HIGH | Animated border effect |
| `button.tsx` | Button | buttons | HIGH | Already have variants |
| `card.tsx` | Card | cards | HIGH | Already have variants |
| `carousel.tsx` | Carousel | navigation | MEDIUM | Image/content sliders |
| `chart.tsx` | Chart | data-display | HIGH | Recharts integration |
| `checkbox.tsx` | Checkbox | forms | HIGH | Form input |
| `collapsible.tsx` | Collapsible | navigation | LOW | Simple expand/collapse |
| `command.tsx` | Command | navigation | HIGH | Command palette (Cmd+K) |
| `dialog.tsx` | Dialog | modals | HIGH | Modal dialogs |
| `drawer.tsx` | Drawer | modals | HIGH | Slide-out panels |
| `dropdown-menu.tsx` | DropdownMenu | navigation | HIGH | Context menus |
| `glow-effect.tsx` | GlowEffect | effects | HIGH | Multi-mode glow animations |
| `GlassCard.tsx` | GlassCard | cards | HIGH | Glassmorphic effect |
| `hover-card.tsx` | HoverCard | data-display | MEDIUM | Preview on hover |
| `input.tsx` | Input | forms | HIGH | Text input |
| `kbd.tsx` | Kbd | data-display | LOW | Keyboard shortcuts |
| `label.tsx` | Label | forms | MEDIUM | Form labels |
| `navigation-menu.tsx` | NavigationMenu | navigation | HIGH | Main nav component |
| `popover.tsx` | Popover | modals | MEDIUM | Floating content |
| `progress.tsx` | Progress | data-display | HIGH | Progress bars |
| `radio-group.tsx` | RadioGroup | forms | HIGH | Radio selections |
| `scroll-area.tsx` | ScrollArea | navigation | LOW | Custom scrollbars |
| `scroll-progress.tsx` | ScrollProgress | effects | MEDIUM | Page scroll indicator |
| `select.tsx` | Select | forms | HIGH | Dropdown select |
| `separator.tsx` | Separator | data-display | LOW | Visual dividers |
| `sheet.tsx` | Sheet | modals | HIGH | Bottom/side sheets |
| `skeleton.tsx` | Skeleton | data-display | MEDIUM | Loading placeholders |
| `slider.tsx` | Slider | forms | HIGH | Range input |
| `sonner.tsx` | Sonner/Toast | data-display | HIGH | Toast notifications |
| `spinner.tsx` | Spinner | data-display | MEDIUM | Loading spinner |
| `switch.tsx` | Switch | forms | HIGH | Toggle switch |
| `table.tsx` | Table | data-display | HIGH | Data tables |
| `tabs.tsx` | Tabs | navigation | HIGH | Tabbed content |
| `text-morph.tsx` | TextMorph | effects | HIGH | Character animation |
| `textarea.tsx` | Textarea | forms | HIGH | Multi-line input |
| `toggle.tsx` | Toggle | forms | MEDIUM | Toggle button |
| `toggle-group.tsx` | ToggleGroup | forms | MEDIUM | Grouped toggles |
| `tooltip.tsx` | Tooltip | data-display | MEDIUM | Hover tooltips |

---

## Template-Derived Components (from 116 templates)

### HIGH PRIORITY - Dashboard Widgets

| Template Source | Component Name | Category | Customization Options |
|-----------------|----------------|----------|----------------------|
| `analytics-dashboard` | KPICard | data-display | icon, trend direction, color scheme |
| `analytics-dashboard` | AreaChartWidget | data-display | gradient colors, height, data format |
| `analytics-dashboard` | FunnelChart | data-display | colors per stage, labels |
| `analytics-dashboard` | TrafficSourcePie | data-display | colors, legend position |
| `finance-dashboard` | MetricsGrid | data-display | columns, card style |
| `sales-dashboard` | StatCard | data-display | icon, change indicator |
| `status-page` | ServiceStatusCard | data-display | status colors, metrics |
| `status-page` | UptimeChart | data-display | time range, threshold |

### HIGH PRIORITY - Marketing Components

| Template Source | Component Name | Category | Customization Options |
|-----------------|----------------|----------|----------------------|
| `saas-landing` | HeroSection | headers | gradient colors, animation |
| `saas-landing` | FeatureGrid | data-display | columns, icon style, hover effect |
| `saas-landing` | StatsCounter | data-display | animation duration, format |
| `saas-landing` | TestimonialCarousel | navigation | autoplay, card style |
| `saas-landing` | CTASection | headers | gradient, button variants |
| `pricing` | PricingCard | cards | highlight popular, feature list |
| `pricing` | PricingTable | data-display | comparison matrix |
| `testimonials` | TestimonialCard | cards | avatar size, rating stars |
| `testimonials` | QuoteCarousel | navigation | navigation style |

### HIGH PRIORITY - Auth Components

| Template Source | Component Name | Category | Customization Options |
|-----------------|----------------|----------|----------------------|
| `login` | LoginForm | forms | social providers, animation |
| `signup` | SignupForm | forms | steps, password strength |
| `password-reset` | PasswordResetForm | forms | security questions |
| `2fa-setup` | TwoFactorSetup | forms | method options |

### HIGH PRIORITY - Navigation Patterns

| Template Source | Component Name | Category | Customization Options |
|-----------------|----------------|----------|----------------------|
| `kanban-board` | KanbanColumn | navigation | limit badge, drag handles |
| `kanban-board` | KanbanCard | cards | priority colors, avatars |
| `sprint-board` | SprintColumn | navigation | progress indicator |
| `settings` | SidebarNav | navigation | icon style, collapse mode |
| Multiple | Breadcrumb | navigation | separator style |

### MEDIUM PRIORITY - E-commerce

| Template Source | Component Name | Category | Customization Options |
|-----------------|----------------|----------|----------------------|
| `product-detail` | ProductCard | cards | image ratio, badge placement |
| `product-listing` | ProductGrid | data-display | columns, hover effect |
| `cart` | CartItem | cards | quantity controls |
| `checkout` | CheckoutForm | forms | steps, payment icons |

### MEDIUM PRIORITY - Content

| Template Source | Component Name | Category | Customization Options |
|-----------------|----------------|----------|----------------------|
| `blog-post` | ArticleCard | cards | metadata style, excerpt lines |
| `docs-hub` | DocsSidebar | navigation | search, collapsible |
| `timeline` | TimelineItem | data-display | orientation, connector style |
| `roadmap` | RoadmapCard | cards | status badges |

---

## Detailed Category Breakdown

### 1. CARDS (Current: 3, Target: 12+)

| Component | Source | Priority | Customization Options |
|-----------|--------|----------|----------------------|
| GlassmorphicCard | Existing | - | glassOpacity, blurAmount, borderOpacity |
| FloatingCard | Existing | - | floatHeight, rotationX, rotationY |
| NeonCard | Existing | - | glowIntensity, glowSpread, pulseSpeed |
| **PricingCard** | pricing | HIGH | highlighted, featureCount, priceSize |
| **TestimonialCard** | testimonials | HIGH | avatarSize, ratingStyle, quoteStyle |
| **ProductCard** | product-detail | MEDIUM | imageRatio, badgePosition, hoverEffect |
| **KanbanCard** | kanban-board | HIGH | priority, assignee, tags, checklistProgress |
| **StatCard** | analytics-dashboard | HIGH | iconSize, trendDirection, colorScheme |
| **ArticleCard** | blog-post | MEDIUM | excerptLines, metadata, imagePosition |
| **FeatureCard** | saas-landing | HIGH | iconStyle, alignment, hoverEffect |
| **ProfileCard** | user-profile | MEDIUM | avatarSize, socialLinks, statsDisplay |
| **EventCard** | event-registration | LOW | dateFormat, attendeeCount, ctaStyle |

### 2. BUTTONS (Current: 3, Target: 10+)

| Component | Source | Priority | Customization Options |
|-----------|--------|----------|----------------------|
| GradientButton | Existing | - | gradientAngle, hoverScale |
| NeomorphicButton | Existing | - | neoDepth, softShadow |
| ParticleButton | Existing | - | particleCount, explosionRadius |
| **GlassButton** | styleguide | HIGH | glassOpacity, blurAmount |
| **PrimaryButton** | button.tsx | HIGH | size, iconPosition, loading |
| **SecondaryButton** | button.tsx | HIGH | variant, outline |
| **DestructiveButton** | button.tsx | HIGH | confirmDialog |
| **IconButton** | Multiple | HIGH | shape (circle/square), tooltip |
| **SocialButton** | login | MEDIUM | provider, iconOnly |
| **LoadingButton** | login | MEDIUM | spinnerStyle, loadingText |
| **CTAButton** | saas-landing | HIGH | gradient, arrow, pulse |

### 3. FORMS (Current: 2, Target: 15+)

| Component | Source | Priority | Customization Options |
|-----------|--------|----------|----------------------|
| AnimatedForm | Existing | - | fieldStagger, animation |
| StepForm | Existing | - | stepCount, progressStyle |
| **TextInput** | input.tsx | HIGH | icon, validation, placeholder animation |
| **PasswordInput** | login | HIGH | showToggle, strengthMeter |
| **EmailInput** | login | HIGH | validation, icon |
| **Textarea** | textarea.tsx | HIGH | autoResize, characterCount |
| **Select** | select.tsx | HIGH | searchable, multiSelect |
| **Checkbox** | checkbox.tsx | HIGH | variant (default, toggle) |
| **RadioGroup** | radio-group.tsx | HIGH | layout (horizontal, vertical, grid) |
| **Switch** | switch.tsx | HIGH | size, labelPosition |
| **Slider** | slider.tsx | HIGH | range, marks, tooltip |
| **DatePicker** | Multiple | MEDIUM | format, range |
| **FileUpload** | kanban-board | MEDIUM | preview, dragDrop, multiple |
| **SearchInput** | kanban-board | HIGH | icon, clearButton, suggestions |
| **TagInput** | kanban-board | MEDIUM | addOnEnter, suggestions |

### 4. NAVIGATION (Current: 2, Target: 12+)

| Component | Source | Priority | Customization Options |
|-----------|--------|----------|----------------------|
| FloatingNav | Existing | - | navPosition, navSpacing |
| SidebarNav | Existing | - | sidebarWidth, collapseWidth |
| **Tabs** | tabs.tsx | HIGH | variant (line, boxed, pill), animation |
| **Accordion** | accordion.tsx | HIGH | allowMultiple, icon |
| **Carousel** | carousel.tsx | MEDIUM | autoplay, indicators, navigation |
| **Breadcrumb** | Multiple | HIGH | separator, truncate |
| **Pagination** | Multiple | MEDIUM | compact, showTotal |
| **CommandPalette** | command.tsx | HIGH | sections, shortcuts |
| **NavigationMenu** | navigation-menu.tsx | HIGH | megaMenu, indicators |
| **DropdownMenu** | dropdown-menu.tsx | HIGH | nested, icons, shortcuts |
| **KanbanColumn** | kanban-board | HIGH | limit, addCard, draggable |
| **ScrollToTop** | saas-landing | LOW | style, threshold |

### 5. EFFECTS (Current: 2, Target: 10+)

| Component | Source | Priority | Customization Options |
|-----------|--------|----------|----------------------|
| CursorFollow | Existing | - | trailLength, blendMode, size |
| ParallaxScroll | Existing | - | speed, layers, direction |
| **BorderTrail** | border-trail.tsx | HIGH | size, duration, color |
| **GlowEffect** | glow-effect.tsx | HIGH | mode, colors, blur, scale |
| **TextMorph** | text-morph.tsx | HIGH | transition, stagger |
| **AnimatedBackground** | animated-background.tsx | HIGH | enableHover, transition |
| **ScrollProgress** | scroll-progress.tsx | MEDIUM | position, color, height |
| **FloatingParticles** | login | MEDIUM | count, speed, color |
| **TypewriterText** | Multiple | MEDIUM | speed, cursor, delay |
| **FadeInView** | Multiple | HIGH | direction, delay, threshold |

### 6. DATA-DISPLAY (Current: 0, Target: 15+)

| Component | Source | Priority | Customization Options |
|-----------|--------|----------|----------------------|
| **Badge** | badge.tsx | HIGH | variant, size, dot |
| **Table** | table.tsx | HIGH | striped, hoverable, sortable |
| **Progress** | progress.tsx | HIGH | variant, showValue, animated |
| **Avatar** | avatar.tsx | HIGH | size, status, group |
| **Spinner** | spinner.tsx | MEDIUM | size, color |
| **Skeleton** | skeleton.tsx | MEDIUM | variant (text, avatar, card) |
| **Tooltip** | tooltip.tsx | MEDIUM | position, arrow, delay |
| **KPICard** | analytics-dashboard | HIGH | trend, icon, sparkline |
| **ChartArea** | analytics-dashboard | HIGH | gradient, smooth |
| **ChartBar** | analytics-dashboard | HIGH | stacked, horizontal |
| **ChartLine** | analytics-dashboard | HIGH | multi-line, dots |
| **ChartPie** | analytics-dashboard | MEDIUM | donut, legend |
| **Alert** | alert.tsx | HIGH | variant, icon, dismissible |
| **Kbd** | kbd.tsx | LOW | size, modifier |
| **HoverCard** | hover-card.tsx | MEDIUM | delay, side |

### 7. MODALS (Current: 0, Target: 8+)

| Component | Source | Priority | Customization Options |
|-----------|--------|----------|----------------------|
| **Dialog** | dialog.tsx | HIGH | size, position, animation |
| **AlertDialog** | alert-dialog.tsx | HIGH | variant, confirmText |
| **Drawer** | drawer.tsx | HIGH | side, size |
| **Sheet** | sheet.tsx | HIGH | side, overlay |
| **Popover** | popover.tsx | MEDIUM | trigger, align |
| **CommandDialog** | command.tsx | HIGH | search, sections |
| **ImageLightbox** | product-detail | MEDIUM | gallery, zoom |
| **ConfirmModal** | kanban-board | HIGH | variant, loading |

### 8. HEADERS (Current: 0, Target: 8+)

| Component | Source | Priority | Customization Options |
|-----------|--------|----------|----------------------|
| **HeroSection** | saas-landing | HIGH | gradient, animation, image |
| **PageHeader** | Multiple | HIGH | breadcrumb, actions |
| **SectionHeader** | saas-landing | HIGH | badge, subtitle |
| **Navbar** | saas-landing | HIGH | sticky, transparent |
| **BannerHeader** | status-page | MEDIUM | dismissible, variant |
| **CTABanner** | pricing | HIGH | gradient, countdown |
| **AnnouncementBar** | Multiple | MEDIUM | link, dismissible |
| **ProfileHeader** | user-profile | MEDIUM | cover, actions |

---

## NEW CATEGORIES TO ADD

Based on template analysis, consider adding these categories:

### 9. MARKETING
Components specifically for marketing pages:
- CTASection
- FeatureShowcase
- LogoCloud
- TrustBadges
- ValueProposition

### 10. DASHBOARDS
Pre-composed dashboard widgets:
- MetricsRow
- ActivityFeed
- QuickActions
- StatusOverview
- RecentItems

### 11. FEEDBACK
User feedback components:
- Toast/Sonner
- SuccessState
- ErrorState
- EmptyState
- LoadingState

---

## Implementation Priority Matrix

### Phase 1 (Immediate - High Impact)
1. **Effects**: BorderTrail, GlowEffect, TextMorph, FadeInView
2. **Cards**: PricingCard, TestimonialCard, StatCard, KanbanCard
3. **Forms**: TextInput, PasswordInput, Select, SearchInput
4. **Data-Display**: Badge, Table, Progress, Alert, KPICard
5. **Modals**: Dialog, AlertDialog, Drawer
6. **Headers**: HeroSection, PageHeader, Navbar

**Estimated Components: 25**

### Phase 2 (Short-term - Core Features)
1. **Navigation**: Tabs, Accordion, CommandPalette, DropdownMenu
2. **Buttons**: GlassButton, IconButton, CTAButton, LoadingButton
3. **Forms**: Checkbox, RadioGroup, Switch, Slider
4. **Data-Display**: Avatar, Skeleton, ChartArea, ChartBar

**Estimated Components: 16**

### Phase 3 (Medium-term - Polish)
1. **Cards**: ProductCard, ArticleCard, ProfileCard, FeatureCard
2. **Navigation**: Carousel, Breadcrumb, Pagination
3. **Effects**: AnimatedBackground, ScrollProgress, FloatingParticles
4. **Data-Display**: Spinner, Tooltip, HoverCard, ChartLine, ChartPie

**Estimated Components: 14**

---

## Total Component Count Goals

| Category | Current | Target | New to Add |
|----------|---------|--------|------------|
| Cards | 3 | 12 | 9 |
| Buttons | 3 | 10 | 7 |
| Forms | 2 | 15 | 13 |
| Navigation | 2 | 12 | 10 |
| Effects | 2 | 10 | 8 |
| Data-Display | 0 | 15 | 15 |
| Modals | 0 | 8 | 8 |
| Headers | 0 | 8 | 8 |
| **TOTAL** | **12** | **90** | **78** |

---

## Implementation Notes

### Customization Pattern
Each component should follow this customization structure:
```typescript
{
  id: string,
  name: string,
  category: ComponentCategory,
  description: string,
  tags: string[],
  customizableProps: string[],
  defaultCustomization: Partial<Customization>
}
```

### Key Customization Properties to Support
From analysis of portfolio-style-guides templates:

1. **Visual Effects**
   - `glassOpacity`: 0-100 (glassmorphism transparency)
   - `blurAmount`: 0-20 (backdrop blur intensity)
   - `glowIntensity`: 0-100 (neon/glow effects)
   - `gradientAngle`: 0-360 (gradient direction)

2. **Animation**
   - `duration`: 100-1000ms (transition speed)
   - `animation`: 'none' | 'smooth' | 'spring' | 'bounce'
   - `stagger`: 0-0.5s (staggered animation delay)

3. **Layout**
   - `padding`: 'compact' | 'default' | 'spacious'
   - `borderRadius`: 'none' | 'sm' | 'md' | 'lg' | 'full'
   - `shadowIntensity`: 0-100

4. **Colors**
   - `primaryColor`: color picker
   - `secondaryColor`: color picker
   - `variant`: 'default' | 'primary' | 'secondary' | 'destructive'

### File Structure for New Components
```
components/component-previews/
  cards/
    pricing-card.tsx
    testimonial-card.tsx
    stat-card.tsx
    ...
  buttons/
    glass-button.tsx
    icon-button.tsx
    ...
  forms/
    text-input.tsx
    password-input.tsx
    ...
  ...
```

### Template Patterns Worth Preserving
1. **Glass morphism** (from styleguide) - `.glass`, `.glass-dark` classes
2. **Terminal glow** - `.terminal-glow` text effect
3. **Border glow** - `.border-glow` for cards
4. **Framer Motion patterns** - staggered animations, hover effects
5. **Recharts integration** - for chart components

---

## References

### Source Files
- Styleguide: `~/projects/portfolio-style-guides/app/styleguide/page.tsx`
- UI Components: `~/projects/portfolio-style-guides/components/ui/`
- Templates: `~/projects/portfolio-style-guides/app/templates/`

### Target Files
- Component Registry: `/home/matt/projects/design2prompt/lib/component-registry.ts`
- Component Types: `/home/matt/projects/design2prompt/types/component.ts`
- Customization Types: `/home/matt/projects/design2prompt/types/customization.ts`

# Useless.io Monorepo Migration Audit

**Project:** useless-io
**Location:** ~/projects/useless-io
**Live URL:** https://useless-io.vercel.app
**Audit Date:** 2025-12-31

---

## 1. Package.json Analysis

### Framework & Runtime
| Package | Version |
|---------|---------|
| Next.js | ^16.0.7 |
| React | ^19.2.1 |
| TypeScript | ^5.9.3 |
| Node Types | ^22.0.0 |

### Key Dependencies
| Category | Packages |
|----------|----------|
| **ORM** | drizzle-orm ^0.45.0, drizzle-kit ^0.31.8 |
| **Database** | @neondatabase/serverless ^1.0.2 |
| **Auth** | better-auth ^1.4.6-beta.3 |
| **Payments** | stripe ^20.0.0 |
| **UI** | 19 @radix-ui/* packages, cmdk ^1.1.1, vaul ^1.1.2 |
| **Animation** | framer-motion ^12.23.25, motion ^12.23.25 |
| **Styling** | tailwindcss ^3.4.18, tailwind-merge ^3.4.0, class-variance-authority ^0.7.1 |
| **Charts** | recharts ^3.5.1 |
| **Utilities** | date-fns ^4.1.0, lucide-react ^0.556.0, sonner ^2.0.7, next-themes ^0.4.6 |

### Scripts
```json
{
  "dev": "next dev -p 3007",
  "build": "next build",
  "start": "next start -p 3007",
  "lint": "next lint",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio",
  "db:seed": "npx tsx lib/db/seed.ts",
  "db:seed-reviews": "npx tsx lib/db/seed-reviews.ts",
  "db:seed-all": "npx tsx lib/db/seed.ts && npx tsx lib/db/seed-reviews.ts"
}
```

**Note:** Dev runs on port 3007 (non-standard).

---

## 2. Authentication

### Auth System: Better Auth
- **Library:** `better-auth` v1.4.6-beta.3 (NOT NextAuth or Supabase Auth)
- **Adapter:** Drizzle adapter for PostgreSQL
- **Session:** 7-day expiry, 1-day refresh

### OAuth Providers
| Provider | Status | Notes |
|----------|--------|-------|
| GitHub | Active | Uses genericOAuth plugin with PKCE disabled |
| Email/Password | Active | 8 char min password, auto sign-in enabled |

### Auth Configuration (`lib/auth.ts`)
- Trusted origins: Vercel production, Vercel preview, localhost
- Secure cookies in production only
- Database hooks create wallet ($1000 UselessBucks) and "early_adopter" achievement on signup

### Environment Variables Required
```
BETTER_AUTH_URL
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```

---

## 3. Database

### Database: PostgreSQL via Neon
- **Provider:** @neondatabase/serverless
- **ORM:** Drizzle ORM
- **Schema:** `lib/db/schema.ts`

### Tables (14 total)
| Table | Purpose |
|-------|---------|
| `users` | Core user data + isAdmin flag |
| `sessions` | Auth sessions |
| `accounts` | OAuth accounts |
| `verifications` | Email verification tokens |
| `wallets` | UselessBucks balance, last claim |
| `wallet_transactions` | Transaction history |
| `user_achievements` | Unlocked achievements |
| `user_progress` | XP and level tracking |
| `products` | Product catalog |
| `reviews` | Product reviews |
| `orders` | Order records |
| `order_items` | Order line items |
| `cart_items` | Shopping cart (session or user) |
| `wishlist_items` | User wishlists |

### Key Features in Schema
- UselessBucks virtual currency system
- Achievement types: 16 total (first_purchase, big_spender, window_shopper, etc.)
- Wallet transaction types: signup_bonus, purchase, refund, daily_claim, review_bonus, achievement
- Order statuses: pending, confirmed, processing, shipped, delivered, cancelled
- Payment methods: useless_bucks, stripe

---

## 4. Theming System

### Theme Implementation
- Uses CSS custom properties (`--background`, `--primary`, etc.)
- Managed via `data-theme` and `data-mode` attributes on `:root`
- next-themes for theme switching

### Available Color Themes (10)
| Theme | Primary Color | Description |
|-------|---------------|-------------|
| Terminal (default) | Emerald/Cyan | Retro terminal aesthetic |
| Amber | Golden/Orange | Warm amber tones |
| Carbon | White/Gray | Monochrome minimal |
| Light | Blue/Teal | Professional light theme |
| Ocean | Aqua/Turquoise | Deep sea blues |
| Sunset | Orange/Pink | Warm sunset gradient |
| Forest | Lime/Green | Nature-inspired greens |
| Midnight | Magenta/Purple | Deep purple/indigo |
| Neon | Hot Pink/Cyan | High contrast neon |
| Slate | Sky Blue/Steel | Cool professional blues |

### Mode Support
- Each color theme has both dark and light mode variants
- `data-mode="light"` triggers light mode CSS

### Background Tones (9)
Separate from color themes: charcoal, deep-purple, pure-black, light, ocean, sunset, forest, midnight, neon-dark, slate

### Utility Classes
- `.glass` - Glassmorphism effect (theme-aware)
- `.glass-dark` - Darker glass variant
- `.glass-overlay` - High-opacity glass
- `.terminal-glow` - Text glow effect
- `.border-glow` - Border glow effect
- `.gradient-text-theme` - Theme-aware gradient text

---

## 5. Shared Components (shadcn/ui)

### 45 UI Components
```
accordion          alert              alert-dialog       animated-background
avatar             badge              border-trail       button
card               carousel           chart              checkbox
collapsible        command            dialog             drawer
dropdown-menu      GlassCard          glow-effect        hover-card
input              kbd                label              navigation-menu
popover            progress           radio-group        scroll-area
scroll-progress    select             separator          sheet
skeleton           slider             sonner             spinner
switch             table              tabs               text-morph
textarea           toggle             toggle-group       tooltip
VideoPlayer
```

### Custom Components (non-shadcn)
- `GlassCard.tsx` - Custom glassmorphism card
- `animated-background.tsx` - Animated gradients
- `border-trail.tsx` - Animated border effect
- `glow-effect.tsx` - Glow animations
- `kbd.tsx` - Keyboard shortcut display
- `scroll-progress.tsx` - Scroll indicator
- `spinner.tsx` - Loading spinner
- `text-morph.tsx` - Text animation
- `VideoPlayer.tsx` - Video playback

---

## 6. TabzChrome Integration

**Status:** No integration

Only references found are in demo/planning files:
- `DEMO_CHAOS_PLAN.md`
- `.claude/commands/implement-issue-demo.md`

No actual TabzChrome MCP tools or browser automation implemented.

---

## 7. Key Routes & Pages

### Public Routes (8)
| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/products` | Product listing |
| `/products/[slug]` | Product detail |
| `/search` | Search page |
| `/about` | About page |
| `/faq` | FAQ page |
| `/leaderboard` | Gamification leaderboard |
| `/void` | Easter egg page |

### Auth Routes (5)
| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/signup` | Register |
| `/forgot-password` | Password reset request |
| `/reset-password` | Password reset |
| `/verify-email` | Email verification |

### User Routes (7)
| Route | Description |
|-------|-------------|
| `/cart` | Shopping cart |
| `/wishlist` | Saved items |
| `/checkout` | Checkout flow |
| `/order-confirmation/[orderId]` | Order success |
| `/account` | Account overview |
| `/account/profile` | Profile settings |
| `/account/orders` | Order history |
| `/account/achievements` | Achievement display |
| `/account/settings` | Account settings |

### Admin Routes (5)
| Route | Description |
|-------|-------------|
| `/admin` | Admin dashboard |
| `/admin/products` | Product management |
| `/admin/orders` | Order management |
| `/admin/users` | User management |
| `/admin/settings` | Admin settings |

### Other Routes (2)
| Route | Description |
|-------|-------------|
| `/waitlist` | Waitlist signup |
| `/submit-idea` | Product idea submission |

---

## 8. Migration Considerations

### Potential Conflicts
1. **Port 3007** - Hardcoded dev port, may conflict with other apps
2. **Better Auth** - Different from other projects using NextAuth/Supabase
3. **Drizzle ORM** - May need shared schema or separate database

### Shared Opportunities
1. **shadcn/ui components** - 45 components available for reuse
2. **Theming system** - Comprehensive 10-theme + light/dark system
3. **Glass/glow utilities** - Reusable UI effects

### Environment Variables Needed
```
# Database
DATABASE_URL (Neon PostgreSQL)

# Auth
BETTER_AUTH_URL
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET

# Payments
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY

# App
NEXT_PUBLIC_BETTER_AUTH_URL
```

### Recommended Actions
1. Decide on shared vs isolated database strategy
2. Consider migrating to shared auth (if other projects use different auth)
3. Extract reusable UI components to shared package
4. Standardize port allocation in monorepo

---

## Summary

Useless.io is a feature-complete satirical e-commerce demo with:
- Modern stack (Next.js 16, React 19, TypeScript 5.9)
- Custom auth via Better Auth (GitHub OAuth + email/password)
- PostgreSQL on Neon with Drizzle ORM
- Comprehensive theming (10 themes x 2 modes)
- 45 shadcn/ui components + custom glass effects
- Gamification (achievements, XP, leaderboard)
- Virtual currency (UselessBucks)
- Stripe integration for payments
- No existing TabzChrome integration

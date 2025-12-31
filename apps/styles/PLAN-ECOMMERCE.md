# Useless.io - E-Commerce Portfolio Project Plan

## Project Vision

**Name:** Useless.io
**Location:** `~/projects/useless-io` (standalone project)
**Domain:** useless.io (or useless-io.vercel.app)

A fully-functional, production-quality e-commerce site selling absurd non-existent products - treated with complete seriousness. The juxtaposition of professional execution with silly products creates a memorable portfolio piece that demonstrates real-world skills.

**Why This Works:**
- Shows complete full-stack development capability
- Modern auth, payments, and database integration
- Demonstrates humor and personality (memorable to recruiters)
- All the complexity of real e-commerce without legal/inventory concerns
- Copies best templates from portfolio-style-guides as starting point
- Standalone project = cleaner architecture, own Git history, dedicated deployment

---

## Tech Stack

### Frontend (Already Configured)
- **Next.js 15** - App Router, Server Components, SSR/SSG
- **TypeScript** - Full type safety
- **Tailwind CSS v3** - Utility-first styling
- **shadcn/ui** - 40+ accessible components
- **Framer Motion** - Animations and 3D effects
- **Glassmorphism design system** - Already themed

### Authentication (New)
- **Better Auth** - Modern TypeScript auth framework
  - Email/password with verification
  - OAuth (GitHub, Google)
  - 2FA/TOTP support
  - Session management
  - Rate limiting built-in
  - *Skill available:* `better-auth` from claudekit-skills

### Database
- **PostgreSQL** - Relational DB (perfect for e-commerce transactions)
- **Drizzle ORM** - Type-safe, lightweight ORM for TypeScript
  - Better DX than Prisma for Next.js App Router
  - Native SQL-like syntax
  - Excellent migrations
- **Neon** - Serverless PostgreSQL hosting
  - Generous free tier (0.5GB storage, 190 hours/month)
  - Branching for dev/staging/prod
  - Excellent Next.js/Vercel integration

### Payments
- **Stripe** (Test Mode) - Industry standard, real integration
  - Checkout sessions with real Stripe UI
  - Webhooks for order fulfillment
  - Payment intents for flexibility
  - Test cards simulate all scenarios (success, decline, 3DS)
  - Impressive for portfolio (shows production-ready skills)

### Play Money System (UselessBucks)
- **Virtual wallet** for each user
  - New users get $1,000.00 in UselessBucks on signup
  - Balance displayed in header
  - Tracked in database
- **Dual payment options at checkout**
  - Pay with UselessBucks (instant, no Stripe UI)
  - Pay with test card (full Stripe flow)
- **Gamification**
  - Earn bonus UselessBucks for actions (reviews, referrals, daily login)
  - "Top Spenders" leaderboard
  - Achievement badges ("Big Spender", "Early Adopter", etc.)
- **Refill options**
  - Claim more UselessBucks (once per day or on empty wallet)
  - Makes site infinitely playable

### Deployment
- **Vercel** - Optimized for Next.js
- **Vercel Postgres/Neon** - Serverless PostgreSQL
- **Vercel Blob** - Image storage (if needed)

---

## Existing Templates to Integrate

### E-Commerce Flow (Ready to Use)
| Template | Purpose | Lines | Status |
|----------|---------|-------|--------|
| `product-listing` | Browse products with filters | 580 | Complete |
| `product-detail` | Individual product page | 720 | Complete |
| `product-comparison` | Compare products | 650 | Complete |
| `cart` | Shopping cart | 520 | Complete |
| `checkout` | Multi-step checkout | 890 | Complete |
| `order-confirmation` | Order success page | 480 | Complete |

### Authentication Flow (Ready to Use)
| Template | Purpose | Lines | Status |
|----------|---------|-------|--------|
| `login` | Sign in page | 380 | Complete |
| `signup` | Multi-step registration | 620 | Complete |
| `password-reset` | Forgot password flow | 450 | Complete |
| `2fa-setup` | Two-factor setup | 580 | Complete |
| `email-verification` | Verify email | 320 | Complete |

### User Account (Ready to Use)
| Template | Purpose | Lines | Status |
|----------|---------|-------|--------|
| `user-profile` | Profile page | 890 | Complete |
| `settings` | Account settings | 1,497 | Complete |
| `billing-history` | Order history | 480 | Complete |

### Supporting Pages (Ready to Use)
| Template | Purpose | Lines | Status |
|----------|---------|-------|--------|
| `404` | Error page (matrix effect) | 420 | Complete |
| `500` | Server error page | 380 | Complete |
| `search-results` | Search results | 450 | Complete |

---

## Silly Product Universe

### Existing Products (from templates)
| Product | Brand | Price | Absurdity |
|---------|-------|-------|-----------|
| Self-Aware Toaster 3000 | JudgyAppliances | $499 | Comments on your breakfast choices |
| Invisible Socks | GhostWear | $19.99 | 1.2 star rating (can't find them) |
| Telepathic TV Remote | MindControl Inc | $299 | Works 38% of the time |
| Procrastination Timer | LaterTech | $59.99 | Counts time you should be working |
| Self-Folding Laundry Basket | LazyHome | $149 | Folds itself, not your clothes |

### New Product Ideas
| Product | Brand | Price | Description |
|---------|-------|-------|-------------|
| Quantum Uncertainty Dice | SchrdingerGames | $29.99 | Shows all numbers simultaneously |
| WiFi-Enabled Rock | SmartRock Co | $199 | It's a rock. It has WiFi. |
| Bluetooth Candle | TechLume | $89.99 | Control flame color from app |
| AI-Powered Pet Rock | RockAI Labs | $149 | Learns your schedule (does nothing) |
| Noise-Canceling Sunglasses | SilentShades | $399 | Blocks sound... somehow |
| Subscription Air | FreshAir.io | $9.99/mo | Premium oxygen delivered |
| Left-Handed Ruler | Southpaw Tools | $24.99 | Numbers go right to left |
| Organic USB Cable | GreenTech | $34.99 | Farm-to-table data transfer |
| Anti-Gravity Coffee Mug | PhysicsBreak | $79.99 | Spills upward |
| Motivational Paper Clip | InspiClip | $12.99 | Whispers encouragement |

### Brand Hierarchy
- **JudgyAppliances** - Kitchen appliances with opinions
- **GhostWear** - Invisible/questionable apparel
- **MindControl Inc** - Telepathic/brain-powered devices
- **LaterTech** - Productivity tools for procrastinators
- **LazyHome** - Home goods that do less than advertised
- **SchrdingerGames** - Quantum gaming supplies
- **SmartRock Co** - IoT for rocks
- **RockAI Labs** - AI pet rock division

---

## Database Schema

### Core Tables

```sql
-- Users (managed by Better Auth + extended)
users (
  id, email, name, emailVerified, image, createdAt, updatedAt
)

-- User Wallet (UselessBucks)
wallets (
  id, userId, balance, lastClaimAt, createdAt, updatedAt
)

-- Wallet Transactions (audit trail)
walletTransactions (
  id, userId, amount, type, description, orderId?, createdAt
  -- type: 'signup_bonus', 'purchase', 'refund', 'daily_claim', 'review_bonus', 'achievement'
)

-- Achievements
userAchievements (
  id, usreId, achievementType, unlockedAt
  -- types: 'first_purchase', 'big_spender', 'review_king', 'early_adopter', etc.
)

-- Products
products (
  id, slug, name, brand, description, price, originalPrice,
  images[], category, tags[], inStock, featured, createdAt
)

-- Product Reviews
reviews (
  id, productId, userId, rating, title, content, helpful, verified, createdAt
)

-- Orders
orders (
  id, userId, status, subtotal, shipping, tax, discount, total,
  shippingAddress, billingAddress, paymentMethod, paymentIntent?, createdAt
  -- paymentMethod: 'useless_bucks' | 'stripe'
)

-- Order Items
orderItems (
  id, orderId, productId, name, price, quantity, color, size
)

-- Cart (can be session-based or user-linked)
cartItems (
  id, sessionId?, userId?, productId, quantity, color, size, createdAt
)

-- Wishlist
wishlistItems (
  id, userId, productId, createdAt
)
```

---

## Implementation Phases

### Phase 0: Project Bootstrap
1. Create new Next.js 15 project at `~/projects/useless-io`
2. Copy shadcn/ui components from portfolio-style-guides
3. Copy globals.css with glassmorphism theme
4. Copy ThemeProvider and core layout components
5. Set up Tailwind with terminal theme
6. Initialize Git repository

### Phase 1: Foundation (Backend Setup)
1. Create Neon PostgreSQL database
2. Install and configure Drizzle ORM
3. Create database schema and migrations
4. Integrate Better Auth (using claudekit skill)
   - Mount API routes
   - Create auth client
   - Configure email/password + OAuth
5. Seed database with silly products

### Phase 2: Core E-Commerce Flow
1. Create API routes for products
   - `GET /api/products` - List with filtering
   - `GET /api/products/[slug]` - Single product
2. Connect product-listing template to real data
3. Connect product-detail template to real data
4. Implement cart functionality
   - Session-based for guests
   - User-linked for logged-in users
   - Persist across sessions
5. Wire up cart template to real state

### Phase 3: Checkout & Payments
1. Set up Stripe (test mode)
2. Create checkout API
   - Create Stripe checkout session
   - Handle webhooks for order creation
3. Connect checkout template to Stripe
4. Implement order confirmation with real order data
5. Add order history to user profile

### Phase 4: User Experience
1. Wire auth templates to Better Auth
   - Login with email/OAuth
   - Signup with email verification
   - Password reset flow
   - 2FA setup (optional, nice-to-have)
2. Connect user-profile template to real user data
3. Implement wishlist functionality
4. Add product reviews (users can review purchased items)

### Phase 5: Play Money & Gamification
1. Create wallet system
   - Wallet API routes (`/api/wallet/balance`, `/api/wallet/claim`)
   - Create wallet on signup with $1000 UselessBucks
   - Balance display in header
2. Add UselessBucks as payment option in checkout
   - Toggle between UselessBucks and Stripe test cards
   - Deduct from wallet on purchase
3. Daily claim feature
   - Button to claim $100 UselessBucks per day
   - Cooldown tracking in database
4. Achievement system
   - Track milestones (first purchase, 5 orders, etc.)
   - Award bonus UselessBucks for achievements
   - Display badges on profile

### Phase 6: Polish & Launch
1. SEO optimization (metadata, OG images)
2. Performance audit
3. Mobile responsiveness check
4. Add loading states and error handling
5. Write silly product descriptions and reviews
6. Deploy to Vercel
7. Create portfolio case study

---

## Project Structure (New Standalone Project)

```
~/projects/useless-io/
├── app/
│   ├── layout.tsx                      # Root layout (fonts, theme)
│   ├── page.tsx                        # Homepage (featured products)
│   ├── globals.css                     # Tailwind + glassmorphism
│   │
│   ├── api/
│   │   ├── auth/[...all]/route.ts      # Better Auth handler
│   │   ├── products/route.ts           # Product listing API
│   │   ├── products/[slug]/route.ts    # Single product API
│   │   ├── cart/route.ts               # Cart operations
│   │   ├── checkout/route.ts           # Create Stripe session OR UselessBucks payment
│   │   ├── webhooks/stripe/route.ts    # Stripe webhooks
│   │   ├── orders/route.ts             # Order history
│   │   ├── wishlist/route.ts           # Wishlist operations
│   │   ├── wallet/
│   │   │   ├── route.ts                # GET balance, POST claim daily bonus
│   │   │   └── transactions/route.ts   # Transaction history
│   │   └── achievements/route.ts       # User achievements
│   │
│   ├── products/                       # Product pages
│   │   ├── page.tsx                    # Product listing (from template)
│   │   └── [slug]/page.tsx             # Product detail (from template)
│   │
│   ├── cart/page.tsx                   # Shopping cart (from template)
│   ├── checkout/page.tsx               # Checkout flow (from template)
│   ├── order-confirmation/page.tsx     # Success page (from template)
│   │
│   ├── (auth)/                         # Auth routes group
│   │   ├── login/page.tsx              # (from template)
│   │   ├── signup/page.tsx             # (from template)
│   │   ├── forgot-password/page.tsx    # (from template)
│   │   ├── reset-password/page.tsx
│   │   └── verify-email/page.tsx       # (from template)
│   │
│   └── account/                        # Protected user routes
│       ├── page.tsx                    # Redirect to profile
│       ├── profile/page.tsx            # (from template)
│       ├── orders/page.tsx             # Order history
│       ├── settings/page.tsx           # (from template)
│       └── wishlist/page.tsx           # Wishlist page
│
├── components/
│   ├── ui/                             # shadcn/ui components (copy from portfolio)
│   ├── layout/
│   │   ├── Header.tsx                  # Site header with cart
│   │   ├── Footer.tsx                  # Site footer
│   │   └── CartIcon.tsx                # Cart with item count
│   ├── products/
│   │   ├── ProductCard.tsx             # Product card component
│   │   ├── ProductGrid.tsx             # Grid layout
│   │   └── ProductFilters.tsx          # Filter sidebar
│   └── cart/
│       ├── CartItem.tsx                # Cart item row
│       └── CartSummary.tsx             # Order summary
│
├── lib/
│   ├── auth.ts                         # Better Auth server config
│   ├── auth-client.ts                  # Better Auth client
│   ├── db/
│   │   ├── index.ts                    # Drizzle client
│   │   ├── schema.ts                   # Database schema
│   │   └── seed.ts                     # Seed silly products
│   ├── stripe.ts                       # Stripe config
│   ├── cart.ts                         # Cart state utilities
│   └── utils.ts                        # cn() helper, etc.
│
├── drizzle/
│   └── migrations/                     # Database migrations
│
├── public/
│   ├── products/                       # Product images
│   └── brand/                          # Logo, favicon
│
├── .env.local                          # Environment variables
├── drizzle.config.ts                   # Drizzle config
├── tailwind.config.ts                  # Tailwind config
├── next.config.ts                      # Next.js config
└── package.json
```

### Templates to Copy from portfolio-style-guides

From `app/templates/`:
- `product-listing/page.tsx` → `products/page.tsx`
- `product-detail/page.tsx` → `products/[slug]/page.tsx`
- `cart/page.tsx` → `cart/page.tsx`
- `checkout/page.tsx` → `checkout/page.tsx`
- `order-confirmation/page.tsx` → `order-confirmation/page.tsx`
- `login/page.tsx` → `(auth)/login/page.tsx`
- `signup/page.tsx` → `(auth)/signup/page.tsx`
- `password-reset/page.tsx` → `(auth)/forgot-password/page.tsx`
- `email-verification/page.tsx` → `(auth)/verify-email/page.tsx`
- `2fa-setup/page.tsx` → `account/security/page.tsx`
- `user-profile/page.tsx` → `account/profile/page.tsx`
- `settings/page.tsx` → `account/settings/page.tsx`
- `billing-history/page.tsx` → `account/orders/page.tsx`
- `404/page.tsx` → `not-found.tsx`

From `components/ui/`:
- Copy entire `ui/` directory (40+ shadcn components)
- Copy `ThemeProvider.tsx`
- Copy relevant background components

---

## Key Technical Decisions

### Why Better Auth over NextAuth/Clerk?
- TypeScript-first with excellent types
- Framework-agnostic (portable skills)
- Built-in 2FA, rate limiting, session management
- No vendor lock-in
- Matches existing skill in claudekit-skills

### Why Drizzle over Prisma?
- Lighter weight (no binary)
- SQL-like syntax (more intuitive)
- Better serverless performance
- Native TypeScript (no codegen)
- Excellent with Vercel/Neon

### Why PostgreSQL over MongoDB?
- E-commerce needs ACID transactions
- Relational data (orders → items → products)
- Better for complex queries
- Industry standard for commerce

### Why Stripe Test Mode?
- Real payment flow without real money
- Industry-standard integration
- Excellent documentation
- Test cards simulate all scenarios

---

## Success Metrics

A successful portfolio piece will demonstrate:

1. **Full-stack competence** - Frontend ↔ API ↔ Database ↔ Auth
2. **Modern practices** - TypeScript, Server Components, edge functions
3. **Security** - Proper auth, CSRF, rate limiting
4. **UX polish** - Loading states, error handling, animations
5. **Production quality** - SEO, performance, accessibility
6. **Personality** - Memorable silly products, cohesive brand

---

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Project name | **Useless.io** | Clean, memorable, tech vibe |
| Database hosting | **Neon** | Generous free tier, excellent DX |
| Payments | **Stripe test mode** | Real integration, impressive for portfolio |
| Project location | **Standalone** (`~/projects/useless-io`) | Clean architecture, own repo |
| OAuth providers | GitHub + Google | Most common, easy setup |
| Initial products | 15-20 | Enough variety to demo filtering |

---

## Estimated Scope

| Phase | Focus | Complexity |
|-------|-------|------------|
| Phase 0 | Project Bootstrap | Low |
| Phase 1 | Database + Auth | Medium |
| Phase 2 | Core E-Commerce | Medium-High |
| Phase 3 | Checkout + Payments | Medium |
| Phase 4 | User Experience | Medium |
| Phase 5 | Play Money + Gamification | Medium |
| Phase 6 | Polish + Deploy | Low-Medium |

The existing templates provide ~70% of the frontend work already done. Main effort is backend integration, wiring everything together, and the fun gamification layer.

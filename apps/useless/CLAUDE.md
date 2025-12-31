# Useless.io - Satirical E-Commerce App

E-commerce platform for absurd, non-functional products. A satirical take on consumer culture.

## Quick Reference

| What | Where |
|------|-------|
| Dev server | `pnpm dev --filter=@ggprompts/useless` (port 3007) |
| Tech stack | Next.js 16, shadcn/ui, Tailwind v4, Better Auth, Drizzle |
| Database | Neon PostgreSQL via Drizzle ORM |
| Themes | 9 themes via @ggprompts/themes |

## Auth System: Better Auth

**IMPORTANT**: This app uses **Better Auth** instead of Supabase Auth (used by other apps).

### Why Different?
- Original useless-io project was built with Better Auth
- Includes custom features: wallet auto-creation on signup, achievement system hooks
- Uses Drizzle adapter for direct database integration

### Future Consideration
If consolidating auth across the monorepo, migrating to Supabase would require:
1. Migrating user data from Better Auth tables to Supabase Auth
2. Updating OAuth providers (GitHub, Google) in Supabase dashboard
3. Replacing `better-auth` with `@supabase/ssr` and `@supabase/supabase-js`
4. Updating auth hooks (wallet creation, achievements) to Supabase triggers

### Auth Files
```
lib/auth.ts            # Server-side Better Auth config
lib/auth-client.ts     # Client-side auth hooks (useSession, signIn, signOut)
app/api/auth/[...all]/ # Better Auth API handler
```

### Auth Features
- Email/password authentication
- GitHub OAuth (with custom email fetching)
- Session management via cookies
- Database hooks for:
  - Auto-creating wallet with 1000 UselessBucks on signup
  - Awarding "early_adopter" achievement

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with product marquee |
| `/products` | Product catalog with filters |
| `/products/[slug]` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Checkout (UselessBucks or Stripe) |
| `/account/*` | Account pages (profile, orders, achievements, settings) |
| `/admin/*` | Admin dashboard (products, orders, users) |
| `/(auth)/*` | Auth pages (login, signup, forgot-password, etc.) |

## Database

Uses Drizzle ORM with Neon PostgreSQL.

### Key Tables
- `users`, `sessions`, `accounts`, `verifications` - Better Auth tables
- `wallets`, `walletTransactions` - Virtual currency system
- `userAchievements`, `userProgress` - Gamification
- `products`, `reviews` - Product catalog
- `orders`, `orderItems` - Order management
- `cartItems`, `wishlistItems` - Shopping features

### Database Commands
```bash
pnpm --filter=@ggprompts/useless db:generate  # Generate migrations
pnpm --filter=@ggprompts/useless db:migrate   # Run migrations
pnpm --filter=@ggprompts/useless db:push      # Push schema to DB
pnpm --filter=@ggprompts/useless db:studio    # Open Drizzle Studio
pnpm --filter=@ggprompts/useless db:seed      # Seed products
```

## Features

### Gamification
- UselessBucks virtual currency (1000 on signup)
- Daily claim bonus with streak multipliers
- 20 achievement types with XP rewards
- Level progression system

### Easter Eggs
- Konami code activation
- Fake live chat
- Satirical toast notifications
- Cookie consent parody

### Themes
Uses @ggprompts/themes - 9 color themes x 2 modes:
- terminal, amber, carbon, ocean, sunset, forest, midnight, neon, slate
- dark/light mode via `data-mode` attribute

## Environment Variables

```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3007
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3007
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Key Differences from Other Apps

| Feature | useless | Other apps (web, kit, etc.) |
|---------|---------|----------------------------|
| Auth | Better Auth | Supabase Auth |
| Database | Drizzle + Neon | Supabase (or none) |
| UI | @ggprompts/ui | @ggprompts/ui |
| Themes | @ggprompts/themes | @ggprompts/themes |

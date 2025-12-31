# Vercel Deployment Guide

This monorepo is configured for Vercel deployment with 4 apps.

## Deployed Apps

| App | Vercel Project | Domain | Status |
|-----|----------------|--------|--------|
| web | matts-projects-e61c0393/web | TBD | Ready |
| design | matts-projects-e61c0393/design | TBD | Ready |
| styles | matts-projects-e61c0393/styles | TBD | Ready |
| useless | matts-projects-e61c0393/useless | TBD | Ready |

**Not Deployed**: `kit` (local-only app with filesystem/TabzChrome access)

## Deployment Commands

```bash
# Deploy from app directory
cd apps/web && vercel --prod

# Or deploy all apps from root
for app in web design styles useless; do
  (cd apps/$app && vercel --prod)
done
```

## Environment Variables

### web (@ggprompts/web)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Set via:
```bash
cd apps/web
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

### design (@ggprompts/design)

No environment variables required - client-side only app.

### styles (@ggprompts/styles)

No environment variables required - static template gallery.

### useless (@ggprompts/useless)

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=your-random-secret
BETTER_AUTH_URL=https://your-useless-domain.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-useless-domain.vercel.app

# OAuth (GitHub)
GITHUB_CLIENT_ID=Ov23li...
GITHUB_CLIENT_SECRET=...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Set via:
```bash
cd apps/useless
vercel env add DATABASE_URL production
vercel env add BETTER_AUTH_SECRET production
vercel env add BETTER_AUTH_URL production
vercel env add NEXT_PUBLIC_BETTER_AUTH_URL production
vercel env add GITHUB_CLIENT_ID production
vercel env add GITHUB_CLIENT_SECRET production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
```

## Build Configuration

Each app uses Turborepo for builds:

```json
{
  "buildCommand": "cd ../.. && pnpm turbo build --filter=@ggprompts/<app>",
  "installCommand": "cd ../.. && pnpm install",
  "ignoreCommand": "cd ../.. && npx turbo-ignore @ggprompts/<app>"
}
```

The `turbo-ignore` command enables Vercel to skip builds when the app hasn't changed.

## Connecting to GitHub

Each app should be connected to the same GitHub repo with different root directories:

1. Go to Vercel Dashboard > Project Settings > Git
2. Set "Root Directory" to `apps/<app-name>`
3. Vercel will auto-deploy on push to main

Or via CLI:
```bash
vercel git connect
```

## Troubleshooting

### Build fails with "pnpm not found"
Vercel should auto-detect pnpm from `packageManager` in root `package.json`. If not:
```bash
vercel env add ENABLE_EXPERIMENTAL_COREPACK 1 production
```

### Turbo cache not working
Enable Remote Caching:
```bash
npx turbo login
npx turbo link
```

### TypeScript errors
All apps use `ignoreBuildErrors: true` in `next.config.ts` due to React 19 compatibility issues with some libraries.

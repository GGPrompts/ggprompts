# Vercel Deployment Configuration

## Overview

This monorepo deploys 3 apps to Vercel via GitHub integration. Each app has its own Vercel project.

## Projects

| App | Vercel Project | Project ID | Domain |
|-----|---------------|------------|--------|
| useless | useless | `prj_96AaZe3Voppvi2v3kiqSmL7fUTFg` | useless-io.vercel.app |
| design | design | `prj_NARsJll7bFsjK8tkst75rcKSenEk` | design-matts-projects-e61c0393.vercel.app |
| styles | styles | `prj_F0TZhCAh8dXzVOuK6qT2Irbq9qH2` | styles-matts-projects-e61c0393.vercel.app |

Team ID: `team_cxSo0zrpA4SWClAmnEd8VZyb`

## Required Dashboard Settings

For each app, configure these settings in the Vercel dashboard:

### Settings → General

| Setting | useless | design | styles |
|---------|---------|--------|--------|
| **Framework Preset** | Next.js | Next.js | Next.js |
| **Root Directory** | `apps/useless` | `apps/design` | `apps/styles` |
| **Node.js Version** | 20.x (or latest) | 20.x | 20.x |

### Settings → Deployment Protection

| Setting | Value |
|---------|-------|
| Vercel Authentication | **Disabled** (for public access) |

Or keep enabled if you want SSO-protected previews.

## vercel.json Configuration

Each app has a `vercel.json` in its directory (`apps/<name>/vercel.json`):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "cd ../.. && pnpm turbo build --filter=@ggprompts/<name>",
  "installCommand": "cd ../.. && pnpm install",
  "ignoreCommand": "cd ../.. && npx turbo-ignore @ggprompts/<name>"
}
```

**How it works:**
1. Vercel clones the repo and `cd`s into the Root Directory (`apps/<name>`)
2. The `cd ../..` in each command navigates to the monorepo root
3. Turbo builds only the specified app and its dependencies
4. `turbo-ignore` skips builds when the app wasn't affected by a commit

## Environment Variables

Set these in each Vercel project under Settings → Environment Variables:

### useless (requires database)
- `DATABASE_URL` - Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth secret
- `BETTER_AUTH_URL` - `https://useless-io.vercel.app`
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Same as above
- `GITHUB_CLIENT_ID` - GitHub OAuth
- `GITHUB_CLIENT_SECRET` - GitHub OAuth

### design & styles
- No special env vars required (static apps)

## Troubleshooting

### 404 after successful build
- Check **Framework Preset** is set to "Next.js" in dashboard
- The `framework` in vercel.json alone is not sufficient

### Build fails with "could not determine executable"
- Check **Root Directory** is set to `apps/<name>`
- Without this, Vercel ignores the app's vercel.json

### Deployment Protection blocking access
- Disable under Settings → Deployment Protection
- Or access via Vercel SSO login

### Rate limited (too many failed deploys)
- Wait for the cooldown period (usually resets in ~9 hours)
- Use `vercel --prod` CLI as a workaround (requires full repo context)

## Verifying Settings

Use the Vercel MCP to check project settings:

```bash
mcp-cli call vercel/get_project '{"projectId": "prj_XXX", "teamId": "team_cxSo0zrpA4SWClAmnEd8VZyb"}'
```

Check that:
- `framework` shows `"nextjs"` (not `null`)
- `latestDeployment.readyState` shows `"READY"`

## Local Linking

Each app has a `.vercel/project.json` linking it to its Vercel project (gitignored):

```bash
cd apps/useless && vercel link --project=useless
cd apps/design && vercel link --project=design
cd apps/styles && vercel link --project=styles
```

This enables `vercel` CLI commands from each app directory.

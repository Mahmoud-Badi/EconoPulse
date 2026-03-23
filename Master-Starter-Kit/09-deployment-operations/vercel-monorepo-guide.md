# Vercel Monorepo Deployment Guide

Step-by-step guide for deploying a Turborepo + Next.js monorepo to Vercel.

---

## Step 1: Create Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. **Important:** Do not deploy yet — configure settings first

---

## Step 2: Configure Project Settings

### Root Directory

Set this to your monorepo root. If your monorepo lives in a subdirectory (e.g., `V3/`), set it to that subdirectory.

```
Root Directory: V3/          # If monorepo is in a subdirectory
Root Directory: ./           # If monorepo IS the repo root
```

**Gotcha:** Root Directory is set on the Vercel Dashboard (Settings > General > Root Directory), NOT in vercel.json.

### Framework

Select: **Next.js**

**Gotcha:** Vercel auto-detects the framework by looking for `next` in package.json. For monorepos, `next` must be listed as a `devDependency` in the ROOT package.json (not just in apps/web/package.json).

```jsonc
// Root package.json — add next as devDependency for framework detection
{
  "devDependencies": {
    "next": "^16.0.0"
  }
}
```

### Build Command

```bash
pnpm --filter @{project}/web build
```

This tells Turborepo to build only the web app and its dependencies — not the entire monorepo.

**Gotcha:** Do not use `turbo build` here unless your turbo.json is configured to only build the web app. `pnpm --filter` is more explicit and reliable.

### Output Directory

```
apps/web/.next
```

This is relative to the Root Directory.

### Install Command

```bash
pnpm install
```

Vercel auto-detects pnpm if a `pnpm-lock.yaml` exists.

---

## Step 3: Set Environment Variables

Set all required env vars in Vercel Dashboard > Settings > Environment Variables.

| Variable | Example | Environments |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://...` | Production, Preview |
| `DIRECT_URL` | `postgresql://...` | Production, Preview |
| `BETTER_AUTH_SECRET` | `random-32-char-string` | Production, Preview |
| `BETTER_AUTH_URL` | `https://yourdomain.com` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://yourdomain.com` | Production |

**Gotcha:** See [env-var-management.md](./env-var-management.md) for the Windows trailing newline trap.

---

## Step 4: Deploy

Push to main. Vercel auto-deploys.

```bash
git push origin main
```

Or trigger manually:

```bash
vercel --prod
```

**Gotcha:** Run `vercel` CLI from the REPO ROOT, not from the monorepo subdirectory. The Vercel Root Directory setting handles the path offset.

---

## Step 5: Verify Deployment

1. Check build logs in Vercel Dashboard for errors
2. Visit the deployment URL
3. Verify: page loads, auth works, API returns data

---

## vercel.json Configuration

Place `vercel.json` at the Root Directory (e.g., `V3/vercel.json`):

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm --filter @{project}/web build",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install"
}
```

### Optional: Cron Jobs

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-digest",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 3 * * 0"
    }
  ]
}
```

### Optional: Rewrites/Redirects

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

---

## Preview Deployments

Vercel automatically creates a preview deployment for every PR/branch push. Each preview deployment gets a unique URL.

**Use preview deployments for:**
- PR review (share the link with reviewers)
- QA testing before merge
- Stakeholder demos

**Preview environment variables:** Set separate values for the "Preview" environment in Vercel if needed (e.g., different database, different auth URL).

---

## Custom Domain Setup

1. Vercel Dashboard > Settings > Domains
2. Add your domain (e.g., `app.yourdomain.com`)
3. Configure DNS: CNAME record pointing to `cname.vercel-dns.com`
4. Wait for SSL certificate (automatic, usually < 5 minutes)
5. **Critical:** Update `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to match the custom domain

---

## Troubleshooting

### Build fails: "Cannot find module 'next'"

`next` is not in the root package.json devDependencies. Add it:
```bash
pnpm add -D next -w
```

### Build fails: "Module not found" for internal packages

The internal package is not listed as a dependency in apps/web/package.json:
```json
{
  "dependencies": {
    "@{project}/api": "workspace:*",
    "@{project}/db": "workspace:*",
    "@{project}/ui": "workspace:*",
    "@{project}/validators": "workspace:*"
  }
}
```

### Build fails: Server Component importing client module

Add `"use client"` directive at the top of the file that uses hooks, state, or browser APIs.

### Deploy succeeds but page shows 500 error

Check Vercel Function Logs (Dashboard > Deployments > Functions tab). Common causes:
- Missing environment variable
- Database connection refused (wrong connection string or SSL config)
- Auth configuration mismatch (BETTER_AUTH_URL does not match domain)

### Deploy succeeds but API returns empty data

- Database is empty (run seed script)
- Database connection uses wrong schema (pgSchema mismatch)
- Query uses wrong date format (SQL `::date` cast vs JS Date)

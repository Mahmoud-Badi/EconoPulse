# Deployment Flow

## Overview

The deployment path is: **Local --> Git --> Staging (Preview) --> Production**

Every change goes through this pipeline. There are no shortcuts, no "just push to production," no hotfixes that skip testing.

---

## Step 1: Local Verification

Before any code leaves your machine, all three checks must pass:

```bash
pnpm typecheck   # TypeScript strict mode -- no type errors
pnpm test        # Unit tests -- all passing
pnpm build       # Production build -- compiles successfully
```

### Why All Three

| Check | What It Catches |
|-------|----------------|
| `typecheck` | Type mismatches, missing properties, incorrect function signatures |
| `test` | Logic errors, regressions, broken validators |
| `build` | Import issues, missing exports, env var references, dead code elimination bugs |

A common trap: code that typechecks and passes tests but fails to build. This happens when the build process (tree-shaking, bundling, SSR) exposes issues that the dev server tolerates.

**Rule: Never push code that fails any of these three checks.**

---

## Step 2: Commit

```
/commit
```

Or manually:

```bash
git add [specific files]
git commit -m "feat(domain): description of what was done"
```

### Commit Message Convention

```
type(scope): description

Types:
  feat     - new feature
  fix      - bug fix
  refactor - code restructuring (no behavior change)
  style    - CSS/design changes (no logic change)
  test     - adding or updating tests
  docs     - documentation only
  chore    - build config, deps, tooling
  perf     - performance improvement

Scope:
  The domain or area (auth, trips, billing, shell, db)
```

**Examples:**
```
feat(trips): add trip creation form with address validation
fix(auth): correct session cookie path for production domain
refactor(billing): extract invoice total calculation to shared util
style(dashboard): apply design tokens to KPI cards
test(drivers): add E2E test for driver assignment flow
```

---

## Step 3: Push to Remote

```bash
git push origin main
```

This triggers automatic deployment to your hosting platform (Vercel, Netlify, etc.).

### For Monorepos on Vercel

Vercel detects which packages changed and only rebuilds affected projects. In a turborepo setup:

```
Root/
  V3/                    <-- Vercel root directory
    apps/web/            <-- The Next.js app
    packages/db/         <-- Schema, migrations
    packages/api/        <-- tRPC routers
    packages/validators/ <-- Shared validators
    packages/ui/         <-- Shared components
```

If you only changed files in `packages/validators/`, Vercel still rebuilds `apps/web/` because it depends on validators. This is correct behavior.

### Important: Push from Repo Root

```bash
# CORRECT: push from repo root
cd /path/to/project-root
git push origin main

# For Vercel CLI deploys:
# Run from repo root, NOT from the monorepo subdir
vercel
```

The Vercel project is configured with `rootDirectory: "V3/"`, so the CLI knows where to look.

---

## Step 4: Verify Staging/Preview

After push, check the deployment:

1. **Watch the build log**: Monitor for build errors (Vercel dashboard or CLI)
2. **Check the preview URL**: Every push to main gets a production deployment. PRs get preview deployments.
3. **Verify critical paths**:
   - Can you log in?
   - Does the dashboard load with data?
   - Does the primary feature you changed work?
   - Are there console errors? (Open DevTools)

### Quick Smoke Test Checklist

```
[ ] Page loads without errors
[ ] Authentication works (login, access protected page)
[ ] Data displays correctly (not empty, not error state)
[ ] The specific feature you changed works end-to-end
[ ] No console errors in browser DevTools
[ ] No CORS errors in Network tab
```

---

## Step 5: If Issues Found

**Fix locally. Never fix on staging.**

```
1. Identify the issue in production/staging
2. Reproduce locally
3. Fix locally
4. Run all 3 checks (typecheck, test, build)
5. Commit and push again
6. Verify the fix in staging
```

**Why not fix on staging?** Because staging changes that aren't in your local repo create drift. Your local code and production code diverge. The next push overwrites the staging fix.

---

## Environment Management

### Three Environments

| Environment | Purpose | Data | URL |
|------------|---------|------|-----|
| Development | Local coding | Seed data | localhost:3000 |
| Preview | PR verification | Seed or staging data | auto-generated per PR |
| Production | Live users | Real data | your-domain.com |

### Environment Variables

**Local development:**
```bash
# .env (NOT committed to git)
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=local-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Vercel (staging + production):**
Set via Vercel dashboard or CLI:
```bash
# View current env vars
vercel env pull

# Set a new env var
node -e "process.stdout.write('value')" | vercel env add VAR_NAME production
```

### Critical Gotchas

**Windows `echo` corrupts env vars:**
```bash
# BAD: adds trailing \n
echo "my-secret" | vercel env add SECRET production

# GOOD: clean output
node -e "process.stdout.write('my-secret')" | vercel env add SECRET production
```

**CORS and auth domain matching:**
```bash
# These MUST match exactly:
BETTER_AUTH_URL=https://your-domain.com    # in Vercel env
NEXT_PUBLIC_APP_URL=https://your-domain.com # in Vercel env

# If they don't match, auth cookies won't be set and you'll get
# CORS errors or "UNAUTHORIZED" on every protected route
```

**Verify after setting:**
```bash
vercel env pull .env.production
# Open .env.production and verify values are correct
# Look for trailing whitespace, newlines, or wrong URLs
```

---

## Database Migrations in Production

### Before Deploying Schema Changes

```bash
# Generate migration
cd packages/db
npx drizzle-kit generate

# Review the generated SQL
cat drizzle/XXXX_migration.sql

# Apply to production (use DIRECT_URL, not pooled URL)
DATABASE_URL=$DIRECT_URL npx drizzle-kit migrate
```

### Migration Safety Rules

1. **Always review generated SQL** before applying
2. **Never drop columns** in production without a deprecation period
3. **Add new columns as nullable** first, then backfill, then add NOT NULL
4. **Test migrations on a copy** of production data first (if available)
5. **Have a rollback plan** for every migration

### Seed Data in Production

**Never run seed scripts against production.** Seed data is for development and testing only.

Exception: initial deployment when production has no data yet. In that case, run seed once, verify, then never again.

---

## Rollback Plan

### If Production is Broken

**Option 1: Quick rollback (Vercel)**
```
Vercel Dashboard > Deployments > Find last working deployment > Redeploy
```
This takes ~60 seconds and doesn't require any code changes.

**Option 2: Git revert**
```bash
git revert HEAD    # Reverts the last commit
git push origin main  # Triggers new deployment with the revert
```

**Option 3: Fix forward**
If the fix is small and obvious, fix it locally and push. This is faster than reverting if you know exactly what's wrong.

### Decision Guide

| Situation | Action |
|-----------|--------|
| Production is completely down | Vercel rollback (fastest) |
| Feature is broken but app works | Fix forward if <15 min, else revert |
| Data corruption | Stop everything, assess damage, plan carefully |
| Auth is broken | Vercel rollback immediately (users can't access the app) |

---

## Deployment Checklist

Use this for every deployment:

```
PRE-DEPLOY:
[ ] pnpm typecheck passes
[ ] pnpm test passes
[ ] pnpm build succeeds
[ ] Commit message follows convention
[ ] No .env files or secrets in commit

DEPLOY:
[ ] git push to main
[ ] Build succeeds on hosting platform
[ ] No build warnings that indicate issues

POST-DEPLOY:
[ ] Site loads at production URL
[ ] Login works
[ ] Dashboard shows data
[ ] Changed feature works end-to-end
[ ] No console errors
[ ] No CORS errors
[ ] No 500 errors in server logs
```

---

## Anti-Patterns

| Anti-Pattern | Consequence |
|-------------|-------------|
| Push without local checks | Build fails in CI, 5 min wasted per push |
| Fix directly on staging/production | Local/remote drift, overwritten on next push |
| Deploy on Friday afternoon | If something breaks, you're debugging all weekend |
| Skip smoke test after deploy | Broken production goes unnoticed |
| Set env vars with Windows `echo` | Trailing newlines break auth, database connections |
| Deploy schema migration + code at same time | If either fails, the other is in an inconsistent state |
| No rollback plan | Production outage with no quick recovery |

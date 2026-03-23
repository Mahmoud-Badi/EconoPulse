# Deployment Gotchas

Deployment issues are the most stressful to debug because they happen at the worst time — when you are trying to ship. Every gotcha here was discovered during a real deployment.

---

## Vercel CLI: Run From Repo Root

```bash
# WRONG — running from monorepo subdirectory
cd V3/
vercel --prod
# Result: Vercel looks for V3/V3/ because Root Directory is already set to V3/

# CORRECT — run from repo root
cd /path/to/repo
vercel --prod
# Result: Vercel applies Root Directory setting correctly
```

**Symptom:** Build fails with "directory not found" or "package.json not found."
**Root cause:** The Vercel Dashboard Root Directory setting is an offset from the repo root. Running `vercel` from the subdirectory doubles the offset.
**Fix:** Always run `vercel` CLI from the repository root.

---

## Vercel Root Directory: Dashboard Setting, Not vercel.json

```
Root Directory is configured on:
  Vercel Dashboard > Project Settings > General > Root Directory

Root Directory is NOT configured in:
  vercel.json
```

**Symptom:** You set `rootDirectory` in vercel.json but Vercel ignores it.
**Fix:** Set it in the Dashboard. The vercel.json file configures build/output settings, not the root directory.

---

## Framework Detection: next in Root package.json

Vercel auto-detects the framework by scanning `package.json`. In a monorepo, it scans the root (or Root Directory) `package.json`.

```jsonc
// Root package.json (or V3/package.json if Root Directory is V3/)
{
  "devDependencies": {
    "next": "^16.0.0"    // Required for framework detection
  }
}
```

**Symptom:** Vercel detects "Other" framework instead of "Next.js." Build settings are wrong.
**Fix:** Add `next` as a devDependency in the package.json at your Root Directory.

---

## Build Command: Must Use --filter

```bash
# CORRECT — builds only the web app and its workspace dependencies
pnpm --filter @{project}/web build

# WRONG — builds everything in the monorepo
pnpm build

# WRONG — turbo may build packages you do not want
turbo build
```

**Why --filter matters:** Without it, Vercel might try to build all packages, including ones that require different environments or have separate deployment targets.

---

## Output Directory: Relative to Root Directory

```
If Root Directory = V3/
And apps/web outputs to .next

Output Directory = apps/web/.next    (relative to V3/)
Full path = V3/apps/web/.next
```

**Symptom:** "No output directory found" after successful build.
**Fix:** Set Output Directory relative to your Root Directory, not relative to the web app.

---

## Environment Variables: Trailing Newlines

The single most insidious deployment bug on Windows.

```bash
# WRONG — Windows echo adds \n
echo "my-secret" | vercel env add MY_SECRET production
# Stored value: "my-secret\n"

# CORRECT — clean output
node -e "process.stdout.write('my-secret')" | vercel env add MY_SECRET production
# Stored value: "my-secret"
```

**Symptom:** Auth breaks with cryptic errors. Database connection fails. API keys rejected. The values LOOK correct in the Vercel Dashboard (the newline is invisible).

**How to detect:**
```bash
vercel env pull .env.vercel-check
# Open the file and look for trailing whitespace
# Or use: cat -A .env.vercel-check (shows $ at end of line, ^J for newlines)
```

**Fix:** Always use `node -e "process.stdout.write(...)"` on Windows. Always verify with `vercel env pull` after setting.

---

## Preview Deployments: Per-Branch, Automatic

Every push to a non-main branch creates a preview deployment with a unique URL.

**Useful for:**
- PR review (share the preview URL with reviewers)
- Testing before merging to main
- Stakeholder demos of in-progress work

**Gotcha:** Preview deployments use "Preview" environment variables. If you have not set Preview-specific values, they inherit from Production — which may have wrong URLs or auth settings.

**Fix:** Set separate environment variables for the Preview environment:
```
# Production
BETTER_AUTH_URL=https://app.yourdomain.com

# Preview
BETTER_AUTH_URL=https://preview.yourdomain.com  # Or leave as auto-generated Vercel URL
```

---

## Build Caching: When to Clear

Vercel caches node_modules and build output between deployments. Usually this speeds things up, but sometimes the cache causes problems.

**When to clear cache:**
- After changing pnpm-lock.yaml significantly
- After upgrading major dependencies (React, Next.js)
- After changing Turborepo configuration
- When build passes locally but fails on Vercel for no apparent reason

**How to clear:**
- Vercel Dashboard > Project Settings > General > Build & Development Settings > "Clear Cache and Redeploy"
- CLI: `vercel --force`

---

## Function Size Limits

Vercel Serverless Functions have a 50MB size limit (compressed). Exceeding this causes build failure.

**Symptom:** "Function size exceeded" error in build logs.

**Common causes:**
- Importing a heavy library in an API route (e.g., full AWS SDK, Puppeteer)
- Not tree-shaking: importing the entire library instead of specific modules

```typescript
// WRONG — imports entire library
import AWS from "aws-sdk";

// CORRECT — import only what you need
import { S3Client } from "@aws-sdk/client-s3";
```

---

## Monorepo Internal Package Resolution

Internal packages must be listed in `apps/web/package.json` with `workspace:*`:

```jsonc
{
  "dependencies": {
    "@{project}/api": "workspace:*",
    "@{project}/db": "workspace:*",
    "@{project}/ui": "workspace:*",
    "@{project}/validators": "workspace:*",
    "@{project}/auth": "workspace:*"
  }
}
```

**And** each internal package must specify its entry point in its own package.json:

```jsonc
// packages/api/package.json
{
  "name": "@{project}/api",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

**Symptom:** "Module not found: @{project}/api" during Vercel build.
**Fix:** Verify both the dependency declaration and the package entry point.

---

## Turborepo Remote Caching (Optional but Helpful)

```bash
# Link to Vercel for remote build caching
npx turbo login
npx turbo link
```

This caches build artifacts across team members and CI/CD. If the source has not changed, the build is instant.

**Gotcha:** Remote cache keys include environment variables. If env vars differ between local and CI, the cache will miss. Set consistent env vars in turbo.json:

```jsonc
{
  "globalEnv": ["DATABASE_URL", "BETTER_AUTH_URL"]
}
```

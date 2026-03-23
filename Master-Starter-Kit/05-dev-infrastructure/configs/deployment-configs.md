# Deployment Configuration Guide

## Target Platforms

This guide covers three deployment targets with complete configs and gotchas for each.

---

## Option 1: Vercel (Recommended for Next.js Monorepos)

### vercel.json

Place at the monorepo root directory configured on Vercel (e.g., `V3/` if your Vercel root is `V3/`):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "pnpm --filter @{project}/web build",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install",
  "crons": [
    {
      "path": "/api/cron/daily-cleanup",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/billing-reminders",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

### Vercel Dashboard Settings

1. **Root Directory**: Set to your monorepo root (e.g., `V3/`). This is the directory Vercel `cd`s into before running commands.
2. **Framework Preset**: Next.js
3. **Build Command**: Override with `pnpm --filter @{project}/web build`
4. **Output Directory**: `apps/web/.next`
5. **Install Command**: `pnpm install`

### Environment Variables

Set in Vercel Dashboard > Settings > Environment Variables:

```
# Database (from Supabase or your provider)
DATABASE_URL=postgresql://user:pass@host:6543/db?pgbouncer=true
DIRECT_URL=postgresql://user:pass@host:5432/db

# Auth
BETTER_AUTH_SECRET=<random-64-char-string>
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Cron protection
CRON_SECRET=<random-string>
```

**Critical**: Set for all environments (Production, Preview, Development). Use different values for Production vs Preview for auth URLs.

### Vercel CLI Deployment

```bash
# Install CLI
npm i -g vercel

# Link project (first time)
vercel link

# Deploy preview
vercel

# Deploy production
vercel --prod

# Set env vars via CLI
node -e "process.stdout.write('value')" | vercel env add VAR_NAME production
```

**Windows gotcha**: `echo` adds trailing newlines that corrupt env values (especially auth secrets). Always use `node -e "process.stdout.write('value')"` to pipe clean values.

### Vercel Gotchas

1. **Root Directory vs Build Command**: Root Directory on Vercel dashboard is where Vercel starts. The `buildCommand` in `vercel.json` runs from there. If Root Directory is `V3/`, then `pnpm --filter @{project}/web build` runs inside `V3/`.

2. **Deploy from repo root**: The `vercel` CLI should be run from the git repository root, not from the monorepo root. Vercel applies its own Root Directory setting.

3. **Env var trailing newlines**: Windows `echo` and some shells add `\n` to piped env values. This silently breaks HMAC-based secrets (Better Auth, Stripe webhooks). Always verify with `vercel env pull` after setting.

4. **Build cache**: Vercel caches `node_modules` and `.next/cache`. If builds fail mysteriously, go to Settings > General > Build Cache and clear it.

5. **Monorepo detection**: Vercel auto-detects Turborepo. It only rebuilds when files affecting the configured app change (based on `turbo.json` dependency graph).

---

## Option 2: AWS (via SST)

### sst.config.ts

```typescript
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "{project-name}",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: { region: "us-east-1" },
      },
    };
  },
  async run() {
    const database = new sst.aws.Postgres("Database", {
      scaling: { min: "0.5 ACU", max: "4 ACU" },
    });

    const site = new sst.aws.Nextjs("Web", {
      path: "apps/web",
      link: [database],
      environment: {
        DATABASE_URL: database.host,
        BETTER_AUTH_SECRET: new sst.Secret("AuthSecret").value,
        BETTER_AUTH_URL: $interpolate`https://${site.url}`,
        NEXT_PUBLIC_APP_URL: $interpolate`https://${site.url}`,
      },
      domain: {
        name: "yourdomain.com",
        dns: sst.aws.dns(),
      },
    });

    return {
      url: site.url,
      database: database.host,
    };
  },
});
```

### SST Deployment

```bash
# Install
pnpm add -D sst -w

# Deploy dev stage
npx sst dev

# Deploy production
npx sst deploy --stage production

# Set secrets
npx sst secret set AuthSecret "your-secret-here" --stage production
```

### SST Gotchas

1. **Cold starts**: Lambda-based Next.js has cold starts (1-3s). Use provisioned concurrency for production.
2. **Build output**: SST uses OpenNext to package Next.js for Lambda. Some features (ISR, middleware) work differently than on Vercel.
3. **Database connectivity**: Lambda functions need VPC configuration to reach RDS. SST handles this automatically with `link`.
4. **Cost**: Very cheap at low traffic ($5-20/mo). Can spike with high concurrency due to Lambda invocations.

---

## Option 3: Docker

### Dockerfile (Multi-Stage Build)

**apps/web/Dockerfile:**

```dockerfile
# Stage 1: Dependencies
FROM node:22-alpine AS deps
RUN corepack enable
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/api/package.json ./packages/api/
COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/
COPY packages/validators/package.json ./packages/validators/
COPY tooling/typescript/package.json ./tooling/typescript/
COPY tooling/biome/package.json ./tooling/biome/

RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:22-alpine AS builder
RUN corepack enable
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/*/node_modules ./packages/*/node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @{project}/web build

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
```

### next.config.ts (Standalone Output)

```typescript
const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: [
    "@{project}/api",
    "@{project}/db",
    "@{project}/ui",
    "@{project}/validators",
  ],
};
```

### docker-compose.yml

```yaml
services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/{project}
      - DIRECT_URL=postgresql://postgres:postgres@db:5432/{project}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - BETTER_AUTH_URL=http://localhost:3000
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: {project}
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

### Docker Gotchas

1. **Standalone output**: Next.js `output: "standalone"` creates a self-contained `server.js` that includes all dependencies. Required for Docker but not for Vercel.

2. **Multi-stage builds**: The three-stage pattern (deps -> build -> run) keeps the final image small (~150MB vs ~1GB).

3. **pnpm in Docker**: Enable corepack (`corepack enable`) in each stage. Alpine images need it explicitly.

4. **Monorepo COPY order**: Copy `package.json` files first, then `pnpm install`, then source code. This maximizes Docker layer caching -- dependencies only reinstall when lockfile changes.

5. **Environment at build vs runtime**: `NEXT_PUBLIC_*` vars are inlined at build time. They must be available during `docker build` or set as build args. Non-public vars can be passed at runtime via `docker run -e`.

6. **.dockerignore**: Create one to exclude `node_modules`, `.next`, `.git`, `test-results`:

```
node_modules
.next
.git
*.md
test-results
playwright-report
coverage
```

---

## Environment Variable Management

Regardless of platform, follow these rules:

1. **Never commit secrets**: `.env` files are gitignored. Use `.env.example` as a template.
2. **Separate environments**: Production, staging, and development should have different secrets.
3. **Validate at startup**: Use Zod to validate required env vars at app startup (see `env-vars.template.md`).
4. **Rotate secrets**: Change auth secrets and API keys on a regular schedule.
5. **Audit access**: Document who has access to production secrets and review quarterly.

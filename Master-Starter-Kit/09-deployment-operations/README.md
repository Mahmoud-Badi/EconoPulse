# 09 - Deployment & Operations

## Deployment Orchestrator

Deploy early and often. The foundation phase (Phase 0) should deploy to staging on day 1. A deployed empty shell proves the pipeline works. Waiting to deploy until "it's ready" is how deployment problems compound into deployment crises.

## Core Principles

1. **Deploy on day 1.** Even if it is an empty Next.js shell with a login page. The act of deploying catches environment, build, and infrastructure problems when they are cheap to fix.
2. **Every merge to main is a deployment.** If you are not comfortable deploying what is on main, main should not have it.
3. **Environment parity.** Dev, preview, and production should be as similar as possible. Same database provider, same auth config, same env var structure.
4. **Rollback is always an option.** Vercel keeps every deployment. You can roll back to any previous deployment instantly. This is your safety net — make sure it works before you need it.

## Files in This Section

| File | Purpose |
|------|---------|
| [vercel-monorepo-guide.md](./vercel-monorepo-guide.md) | Step-by-step Vercel + Turborepo deployment setup |
| [database-setup-guide.md](./database-setup-guide.md) | Database provisioning for Supabase, Neon, PlanetScale, self-hosted |
| [auth-deployment-guide.md](./auth-deployment-guide.md) | Auth provider production configuration (Better Auth, NextAuth, Clerk) |
| [env-var-management.md](./env-var-management.md) | Environment variable setup, verification, and safety |
| [monitoring.template.md](./monitoring.template.md) | Error tracking, analytics, uptime, and logging setup |
| [go-live-checklist.md](./go-live-checklist.md) | Comprehensive pre-deploy, during-deploy, and post-deploy checklist |
| [mobile-deployment-guide.md](./mobile-deployment-guide.md) | Mobile deployment pipeline (dev → preview → production) |
| [app-store-go-live-checklist.md](./app-store-go-live-checklist.md) | Pre-submission checklist for App Store and Play Store |

## Deployment Timeline

```
Phase 0 (Day 1)
  Deploy empty shell → Proves pipeline works
  |
Phase 1-3 (Foundation)
  Deploy after auth works → Proves auth + DB in production
  |
Phase 4-8 (Core Features)
  Deploy after each phase → Catches environment-specific bugs early
  |
Phase 9+ (Polish)
  Deploy after each feature → Users can preview progress
  |
Go-Live
  Run go-live-checklist.md → Full production verification
```

## The Cost of Delayed Deployment

When you wait to deploy:
- **Environment bugs hide.** Works locally but fails in production due to missing env vars, different Node version, different SSL config.
- **Problems compound.** One deployment bug is easy to fix. Ten deployment bugs discovered at once is a crisis.
- **Confidence drops.** The longer between deployments, the more terrifying each deployment becomes. The more terrifying, the longer you wait. A vicious cycle.
- **Feedback delays.** Stakeholders cannot see progress. "It works on my machine" is not a demo.

Deploy. Today. Even if it is not "ready."

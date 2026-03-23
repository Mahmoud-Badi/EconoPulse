# Environment Management

> **Purpose:** Define how configuration differs across environments, how secrets are managed, and how to keep environments in sync. A misconfigured environment is the #1 cause of "works locally, breaks in production."

---

## 1. Environment Definitions

| Environment | Purpose | Who Uses It | Data |
|-------------|---------|------------|------|
| **Development** | Local dev machine | Individual developers | Seeded test data |
| **Preview** | Per-PR ephemeral deploy | Reviewers, QA | Shared staging DB or isolated |
| **Staging** | Pre-production mirror | QA, stakeholders, demos | Copy of production (anonymized) |
| **Production** | Live users | End users | Real data |

### Environment Parity Rule

Staging must mirror production as closely as possible:
- Same database engine and version
- Same hosting provider / runtime
- Same third-party service tiers (or sandbox equivalents)
- Same environment variable names (different values)

The more staging differs from production, the more "works on staging, breaks in production" surprises you'll get.

---

## 2. Environment Variable Strategy

### File Hierarchy

```
.env                    # Shared defaults (committed, no secrets)
.env.local              # Local overrides (git-ignored, contains secrets)
.env.development        # Dev-specific defaults (committed)
.env.production         # Production hints (committed, no actual secrets)
.env.test               # Test-specific overrides (committed)
```

**Rules:**
- Never commit actual secrets (API keys, database passwords, auth secrets)
- `.env.local` is always git-ignored — it's your personal config
- `.env.example` documents every variable with placeholder values
- Variables load in order: `.env` → `.env.[environment]` → `.env.local` (last wins)

### Naming Convention

```
# Service prefix + descriptive name
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Third-party services: PROVIDER_KEY
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG....

# Feature configuration: FEATURE_SETTING
AUTH_SESSION_TTL=3600
UPLOAD_MAX_SIZE_MB=10

# Environment awareness
NODE_ENV=development
APP_ENV=staging
```

**Never:**
- Use generic names like `API_KEY` or `SECRET` (which API? which secret?)
- Use different variable names across environments
- Store JSON objects in env vars (use separate vars or a config file)

---

## 3. Configuration by Environment

| Variable | Development | Staging | Production |
|----------|------------|---------|------------|
| `NODE_ENV` | `development` | `production` | `production` |
| `DATABASE_URL` | `localhost:5432/dev` | Managed DB URL | Managed DB URL |
| `LOG_LEVEL` | `debug` | `info` | `warn` |
| `ENABLE_SOURCE_MAPS` | `true` | `true` | `false` |
| `RATE_LIMIT_ENABLED` | `false` | `true` | `true` |
| `EMAIL_PROVIDER` | Console logger | Sandbox | Live |
| `PAYMENT_MODE` | Test/mock | Sandbox | Live |
| `ERROR_REPORTING_DSN` | Empty (disabled) | Staging DSN | Production DSN |
| `CORS_ORIGINS` | `localhost:*` | Preview URLs | Production domain |

### Environment-Specific Behaviors

**Development only:**
- Debug logging enabled
- Hot module replacement active
- API rate limiting disabled
- Email sends to console (never to real addresses)
- Payment processing in test mode
- Detailed error messages in API responses

**Staging only:**
- Same build as production (no dev shortcuts)
- Error reporting to a separate staging project
- Can use sandbox API keys for third-party services
- Seeded with anonymized production-like data

**Production only:**
- Minified builds, no source maps in client bundles
- Structured JSON logging
- Full rate limiting active
- Error messages are generic (no stack traces to users)
- Real payment processing
- HTTPS enforced

---

## 4. Secret Management

### By Project Stage

| Stage | Strategy | Tools |
|-------|----------|-------|
| **MVP / Solo** | `.env.local` + hosting platform env vars | Vercel / Railway / Fly.io dashboard |
| **Small team** | Shared password manager + hosting env vars | 1Password / Bitwarden + Vercel |
| **Growth** | Dedicated secret manager | AWS SSM Parameter Store / HashiCorp Vault |
| **Enterprise** | Secret rotation + audit logging | Vault + rotation policies |

### Secret Hygiene Rules

1. **Rotate secrets on any suspected leak** — don't debate, just rotate
2. **Different secrets per environment** — never share a production key with staging
3. **Never log secrets** — audit your logging to ensure keys aren't in log output
4. **Short-lived tokens where possible** — prefer OAuth tokens over long-lived API keys
5. **Access controls** — not every developer needs production database access

### Vercel-Specific Secret Management

```bash
# Set a secret for production only
vercel env add SECRET_NAME production

# Pull all env vars to local file for debugging
vercel env pull .env.local

# IMPORTANT: On Windows, use node to avoid trailing newline
node -e "process.stdout.write('secret-value')" | vercel env add SECRET_NAME production
```

See `env-var-management.md` for the full Vercel env var guide and the Windows trailing newline trap.

---

## 5. CI/CD Environment Variables

### GitHub Actions

Store secrets in **Settings > Secrets and variables > Actions**:

```yaml
# .github/workflows/ci.yml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  NODE_ENV: test

jobs:
  test:
    env:
      # Job-level env vars override workflow-level
      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
```

**Rules:**
- Use `secrets.*` for sensitive values, `vars.*` for non-sensitive config
- CI database should be ephemeral (Docker service container)
- Never use production credentials in CI

### Environment-Specific Deployments

```yaml
# Deploy to staging on push to main
# Deploy to production on release tag
jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/main'
    environment: staging

  deploy-production:
    if: startsWith(github.ref, 'refs/tags/v')
    environment: production
```

---

## 6. Preview / Branch Deployments

### Vercel Preview Deployments

Every PR automatically gets a preview URL: `https://project-git-branch-org.vercel.app`

**Configuration for preview environments:**
- Database: shared staging DB (read-only) or per-PR isolated DB
- Auth: redirect URLs must include preview domain pattern
- API: point to staging backend or co-deployed preview

**Common gotcha:** Auth callback URLs. If your auth provider requires exact redirect URIs, preview deployments break authentication. Solutions:
1. Use wildcard redirect patterns (if provider supports it)
2. Add a dynamic callback URL based on `VERCEL_URL` env var
3. Skip auth testing in previews and test on staging

### Isolated Preview Databases

For teams that need data isolation per PR:

```bash
# Create a branch-specific database (Neon, PlanetScale, Supabase branching)
# Set DATABASE_URL in Vercel preview environment to the branch DB URL
# Seed the branch database on creation
# Delete the branch database when PR is merged/closed
```

---

## 7. Environment Verification

### Health Check Endpoint

Every environment should expose a health check:

```
GET /health
→ { "status": "ok", "environment": "production", "version": "1.2.3" }

GET /ready
→ { "status": "ok", "database": "connected", "cache": "connected" }
```

`/health` — is the process running? (for load balancers)
`/ready` — are all dependencies connected? (for deployment verification)

### Post-Deploy Verification Script

After every deployment, verify:

```bash
# 1. Health check passes
curl -f https://your-app.com/health

# 2. Key API endpoint responds
curl -f https://your-app.com/api/v1/status

# 3. Auth flow works (if applicable)
# Manual or automated smoke test

# 4. Error rate is stable (check monitoring dashboard)
# No spike in 5xx errors within 5 minutes of deploy
```

### Environment Configuration Audit

Run periodically to catch drift:

- [ ] All variables in `.env.example` exist in every environment
- [ ] No environment has stale/unused variables
- [ ] Secrets were rotated within the last 90 days
- [ ] Staging config matches production structure
- [ ] CI/CD secrets are current and not expired
- [ ] Error reporting DSNs point to correct projects

---

*Generated by the Master Starter Kit. Update this document when environment strategy changes.*

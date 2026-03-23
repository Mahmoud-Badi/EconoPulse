# CI/CD Pipeline Architecture for {{PROJECT_NAME}}

> The complete pipeline design: every stage, trigger, cache, and artifact defined before a single workflow file is written.

---

## Pipeline Overview

| Attribute | Value |
|-----------|-------|
| **CI Provider** | {{CI_PROVIDER}} |
| **Project** | {{PROJECT_NAME}} |
| **Package Manager** | {{PKG_MANAGER}} |
| **Frontend Framework** | {{FRONTEND_FRAMEWORK}} |
| **Deployment Strategy** | {{DEPLOY_STRATEGY}} |
| **Primary Language** | {{PRIMARY_LANGUAGE}} |
| **Monorepo** | {{IS_MONOREPO}} |

---

## 1. Pipeline Stages

The pipeline is organized into sequential gates. Each gate must pass before the next begins, except where parallelization is explicitly noted.

### Stage Dependency Graph

```
                    ┌──────────┐
                    │  Trigger  │
                    └────┬─────┘
                         │
                    ┌────▼─────┐
                    │  Install  │
                    └────┬─────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
         ┌────▼───┐ ┌───▼────┐ ┌──▼───────┐
         │  Lint  │ │  Type  │ │  Security │
         │        │ │  Check │ │   Scan    │
         └────┬───┘ └───┬────┘ └──┬───────┘
              │          │         │
              └──────────┼─────────┘
                         │
                    ┌────▼─────┐
                    │   Unit   │
                    │  Tests   │
                    └────┬─────┘
                         │
                    ┌────▼─────┐
                    │  Build   │
                    └────┬─────┘
                         │
              ┌──────────┼──────────┐
              │                     │
         ┌────▼───────┐    ┌───────▼────┐
         │ Integration│    │    E2E     │
         │   Tests    │    │   Tests    │
         └────┬───────┘    └───────┬────┘
              │                    │
              └──────────┬─────────┘
                         │
                    ┌────▼─────┐
                    │  Deploy  │
                    └────┬─────┘
                         │
                    ┌────▼─────┐
                    │  Smoke   │
                    │  Tests   │
                    └──────────┘
```

### Stage Definitions

| # | Stage | Purpose | Runs On | Timeout | Parallelizable With |
|---|-------|---------|---------|---------|---------------------|
| 1 | **Install** | Install dependencies, restore cache | All triggers | 3 min | None (first stage) |
| 2a | **Lint** | Code style, formatting, ESLint | All triggers | 3 min | Type Check, Security Scan |
| 2b | **Type Check** | TypeScript compilation check | All triggers | 3 min | Lint, Security Scan |
| 2c | **Security Scan** | Dependency audit, SAST | All triggers | 5 min | Lint, Type Check |
| 3 | **Unit Tests** | Fast, isolated tests | All triggers | 5 min | None (depends on 2) |
| 4 | **Build** | Compile/bundle application | All triggers | 8 min | None (depends on 3) |
| 5a | **Integration Tests** | API/service integration tests | Push to main/develop | 10 min | E2E Tests |
| 5b | **E2E Tests** | Browser-based end-to-end tests | Push to main/develop | 15 min | Integration Tests |
| 6 | **Deploy** | Deploy to target environment | Push to main/develop | 10 min | None (depends on 5) |
| 7 | **Smoke Tests** | Verify deployment health | After deploy | 3 min | None (depends on 6) |

---

## 2. Parallelization Strategy

### What Runs in Parallel

```yaml
# Gate 1: Install (sequential — everything depends on this)
install: []

# Gate 2: Static analysis (all parallel — independent checks)
lint:          [install]
type-check:    [install]
security-scan: [install]

# Gate 3: Unit tests (sequential — depends on all Gate 2 passing)
unit-tests:    [lint, type-check, security-scan]

# Gate 4: Build (sequential — depends on tests)
build:         [unit-tests]

# Gate 5: Heavy tests (parallel — both depend on build, independent of each other)
integration-tests: [build]
e2e-tests:         [build]

# Gate 6: Deploy (sequential — depends on all tests)
deploy:        [integration-tests, e2e-tests]

# Gate 7: Verify (sequential — depends on deploy)
smoke-tests:   [deploy]
```

### Estimated Pipeline Duration

| Pipeline Type | Stages | Target Duration | Max Acceptable |
|--------------|--------|-----------------|----------------|
| **PR Check** | Install + Lint + Type + Unit + Build | **< 8 minutes** | 12 minutes |
| **Staging Deploy** | Full pipeline minus approval | **< 15 minutes** | 20 minutes |
| **Production Deploy** | Full pipeline + approval + smoke | **< 20 minutes** | 30 minutes |
| **Scheduled Security** | Install + Security + Audit | **< 5 minutes** | 10 minutes |

<!-- IF {{IS_MONOREPO}} == "yes" -->
### Monorepo Parallelization

For monorepo setups, each package/app gets its own parallel track:

```
install → ┌── packages/api:    lint → test → build ──┐
          ├── packages/web:    lint → test → build ──┤→ integration → deploy
          ├── packages/shared: lint → test → build ──┤
          └── packages/mobile: lint → test → build ──┘
```

Use {{PKG_MANAGER}} workspace filtering to run only affected packages:

```bash
# pnpm example
pnpm --filter ...[origin/main] run lint
pnpm --filter ...[origin/main] run test
pnpm --filter ...[origin/main] run build
```
<!-- ENDIF -->

---

## 3. Caching Strategy

Caching is the single largest factor in pipeline speed. Every cacheable artifact should be cached.

### Cache Definitions

| Cache Key | What Is Cached | Invalidation Key | Expected Hit Rate |
|-----------|---------------|-------------------|-------------------|
| **Dependencies** | `node_modules/` | `{{PKG_MANAGER}}-lock` hash | 90%+ |
| **Build cache** | `.next/cache/`, `dist/`, `.turbo/` | Source file hash | 70-80% |
| **Docker layers** | Docker build layers | `Dockerfile` + deps hash | 80%+ |
| **Playwright browsers** | Browser binaries | Playwright version | 95%+ |
| **Cypress binary** | Cypress binary | Cypress version | 95%+ |
| **ESLint cache** | `.eslintcache` | ESLint config hash | 85%+ |
| **TypeScript** | `tsconfig.tsbuildinfo` | TS config + source hash | 80%+ |

### Cache Configuration for {{PKG_MANAGER}}

<!-- IF {{PKG_MANAGER}} == "npm" -->
```yaml
- name: Cache node_modules
  uses: actions/cache@v4
  with:
    path: node_modules
    key: node-modules-${{ hashFiles('package-lock.json') }}
    restore-keys: |
      node-modules-
```
<!-- ENDIF -->

<!-- IF {{PKG_MANAGER}} == "pnpm" -->
```yaml
- name: Get pnpm store directory
  shell: bash
  run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

- name: Cache pnpm store
  uses: actions/cache@v4
  with:
    path: ${{ env.STORE_PATH }}
    key: pnpm-store-${{ hashFiles('pnpm-lock.yaml') }}
    restore-keys: |
      pnpm-store-
```
<!-- ENDIF -->

<!-- IF {{PKG_MANAGER}} == "yarn" -->
```yaml
- name: Get yarn cache directory
  id: yarn-cache
  shell: bash
  run: echo "dir=$(yarn cache dir)" >> $GITHUB_OUTPUT

- name: Cache yarn dependencies
  uses: actions/cache@v4
  with:
    path: ${{ steps.yarn-cache.outputs.dir }}
    key: yarn-cache-${{ hashFiles('yarn.lock') }}
    restore-keys: |
      yarn-cache-
```
<!-- ENDIF -->

<!-- IF {{PKG_MANAGER}} == "bun" -->
```yaml
- name: Cache bun dependencies
  uses: actions/cache@v4
  with:
    path: ~/.bun/install/cache
    key: bun-cache-${{ hashFiles('bun.lockb') }}
    restore-keys: |
      bun-cache-
```
<!-- ENDIF -->

### Build Artifact Caching

<!-- IF {{FRONTEND_FRAMEWORK}} == "next" -->
```yaml
- name: Cache Next.js build
  uses: actions/cache@v4
  with:
    path: .next/cache
    key: nextjs-${{ hashFiles('**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx') }}
    restore-keys: |
      nextjs-
```
<!-- ENDIF -->

<!-- IF {{FRONTEND_FRAMEWORK}} == "vite" -->
```yaml
- name: Cache Vite build
  uses: actions/cache@v4
  with:
    path: node_modules/.vite
    key: vite-${{ hashFiles('vite.config.*') }}-${{ hashFiles('src/**') }}
    restore-keys: |
      vite-
```
<!-- ENDIF -->

---

## 4. Artifact Management

### Build Artifacts

| Artifact | Produced By | Consumed By | Retention |
|----------|-------------|-------------|-----------|
| **Build output** (`dist/`, `.next/`) | Build stage | Deploy stage | 7 days |
| **Test results** (JUnit XML) | Test stages | PR status checks | 30 days |
| **Coverage reports** | Unit test stage | Coverage bot, dashboards | 30 days |
| **Docker image** | Build stage | Deploy stage | Per tag policy |
| **Source maps** | Build stage | Error tracking (Sentry) | 90 days |
| **Bundle analysis** | Build stage | PR comment bot | 7 days |
| **SBOM** | Security scan | Compliance, audit trail | 1 year |

### Artifact Upload Configuration

```yaml
- name: Upload build artifacts
  uses: actions/upload-artifact@v4
  with:
    name: build-output
    path: |
      dist/
      .next/
      !.next/cache/
    retention-days: 7

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: |
      coverage/
      test-results/
      junit.xml
    retention-days: 30
```

### Docker Image Tagging Strategy

```
{{REGISTRY_URL}}/{{PROJECT_NAME}}:latest          # Latest main build
{{REGISTRY_URL}}/{{PROJECT_NAME}}:sha-abc1234     # Commit SHA (immutable)
{{REGISTRY_URL}}/{{PROJECT_NAME}}:v1.2.3          # Semantic version tag
{{REGISTRY_URL}}/{{PROJECT_NAME}}:staging          # Current staging image
{{REGISTRY_URL}}/{{PROJECT_NAME}}:pr-123           # PR preview image
```

---

## 5. Pipeline Triggers

### Trigger Matrix

| Trigger | Branches | Stages Run | Deploy Target |
|---------|----------|-----------|---------------|
| **Pull Request opened/updated** | Any → `main`, Any → `develop` | Lint, Type, Unit, Build | Preview (optional) |
| **Push to `develop`** | `develop` | Full pipeline | Staging |
| **Push to `main`** | `main` | Full pipeline + approval | Production |
| **Git tag `v*`** | Tags matching `v*.*.*` | Full pipeline + approval | Production (release) |
| **Schedule (nightly)** | `main` | Security scan, dependency audit | None |
| **Manual dispatch** | Any | Configurable | Configurable |

### Trigger Configuration

```yaml
on:
  pull_request:
    branches: [main, develop]
    types: [opened, synchronize, reopened]

  push:
    branches: [main, develop]
    tags: ['v*.*.*']

  schedule:
    - cron: '0 6 * * 1-5'  # Weekdays at 6 AM UTC

  workflow_dispatch:
    inputs:
      environment:
        description: 'Deploy target environment'
        required: true
        type: choice
        options: [staging, production]
      skip_tests:
        description: 'Skip test stages (emergency only)'
        required: false
        type: boolean
        default: false
```

---

## 6. Branch Strategy Mapping

### Branch-to-Environment Mapping

| Branch Pattern | Environment | Auto-Deploy | Approval Required | URL Pattern |
|---------------|-------------|-------------|-------------------|-------------|
| `main` | **Production** | No | Yes (manual gate) | `{{PRODUCTION_URL}}` |
| `develop` | **Staging** | Yes | No | `{{STAGING_URL}}` |
| `feature/*` | **Preview** | Yes | No | `preview-{{BRANCH}}.{{DOMAIN}}` |
| `hotfix/*` | **Staging → Production** | Staging: Yes | Production: Yes | `{{STAGING_URL}}` |
| `release/*` | **Staging** | Yes | No | `{{STAGING_URL}}` |

### Branch Protection Rules

```
main:
  - Require PR review (1 reviewer minimum)
  - Require status checks to pass (lint, type-check, unit-tests, build)
  - Require branch to be up-to-date before merging
  - No direct push allowed
  - No force push allowed
  - Require signed commits (recommended)

develop:
  - Require status checks to pass (lint, type-check, unit-tests)
  - No force push allowed
```

---

## 7. Conditional Execution

Run only what is needed based on which files changed. This dramatically reduces pipeline time for changes that only affect a subset of the codebase.

### Path-Based Conditional Stages

| Changed Files | Stages to Run |
|--------------|---------------|
| `src/frontend/**`, `*.tsx`, `*.css` | Lint, Type Check, Unit Tests, Build, E2E Tests |
| `src/api/**`, `*.ts` (backend) | Lint, Type Check, Unit Tests, Integration Tests |
| `docs/**`, `*.md` | Lint (markdown), Build docs only |
| `infrastructure/**`, `terraform/**` | Terraform validate, plan |
| `.github/workflows/**` | Pipeline syntax validation |
| `package.json`, lockfile | Full pipeline (dependency change) |
| `Dockerfile`, `docker-compose.*` | Docker build, security scan |

### Implementation

```yaml
- name: Detect changed files
  id: changes
  uses: dorny/paths-filter@v3
  with:
    filters: |
      frontend:
        - 'src/frontend/**'
        - '*.tsx'
        - '*.css'
        - 'public/**'
      backend:
        - 'src/api/**'
        - 'src/server/**'
        - 'prisma/**'
      infrastructure:
        - 'infrastructure/**'
        - 'terraform/**'
        - 'Dockerfile'
      docs:
        - 'docs/**'
        - '*.md'
      dependencies:
        - 'package.json'
        - '{{LOCKFILE}}'

- name: Run E2E tests
  if: steps.changes.outputs.frontend == 'true' || steps.changes.outputs.dependencies == 'true'
  run: {{PKG_MANAGER}} run test:e2e

- name: Run integration tests
  if: steps.changes.outputs.backend == 'true' || steps.changes.outputs.dependencies == 'true'
  run: {{PKG_MANAGER}} run test:integration
```

---

## 8. Environment Variables and Secrets

### Variable Hierarchy

```
Repository Secrets (encrypted, never logged)
  ├── DEPLOY_TOKEN
  ├── DATABASE_URL
  ├── API_KEYS
  └── SIGNING_KEYS

Repository Variables (plaintext, non-sensitive)
  ├── NODE_VERSION
  ├── APP_NAME
  └── DEPLOY_REGION

Environment-Specific Secrets (per environment)
  ├── staging/
  │   ├── DATABASE_URL
  │   ├── API_KEY
  │   └── STRIPE_KEY (test mode)
  └── production/
      ├── DATABASE_URL
      ├── API_KEY
      └── STRIPE_KEY (live mode)
```

### Required Secrets for {{PROJECT_NAME}}

| Secret Name | Environment | Purpose | Rotation Schedule |
|-------------|-------------|---------|-------------------|
| `DEPLOY_TOKEN` | All | Authentication to {{HOSTING_PROVIDER}} | 90 days |
| `DATABASE_URL` | Per environment | Database connection string | On credential rotation |
| `SENTRY_AUTH_TOKEN` | All | Source map upload | 1 year |
| `CODECOV_TOKEN` | All | Coverage report upload | 1 year |
| `NPM_TOKEN` | All (if publishing) | NPM package publishing | 90 days |
| `DOCKER_USERNAME` | All (if using Docker) | Container registry auth | 90 days |
| `DOCKER_PASSWORD` | All (if using Docker) | Container registry auth | 90 days |

---

## 9. Failure Handling and Notifications

### Failure Matrix

| Stage | On Failure | Notification | Block Deploy |
|-------|-----------|--------------|--------------|
| Lint | Fail pipeline | PR check status | Yes |
| Type Check | Fail pipeline | PR check status | Yes |
| Unit Tests | Fail pipeline | PR check status + Slack | Yes |
| Build | Fail pipeline | PR check status + Slack | Yes |
| Integration Tests | Fail pipeline | Slack channel | Yes |
| E2E Tests | Fail pipeline | Slack channel + on-call page | Yes |
| Deploy | Trigger rollback | Slack channel + on-call page | N/A |
| Smoke Tests | Trigger rollback | Slack channel + on-call page | N/A |

### Notification Configuration

```yaml
- name: Notify on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Pipeline failed for {{PROJECT_NAME}}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Pipeline Failed* :x:\n*Repo:* {{PROJECT_NAME}}\n*Branch:* ${{ github.ref_name }}\n*Commit:* ${{ github.sha }}\n*Author:* ${{ github.actor }}\n*Stage:* ${{ github.job }}"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Rollback Triggers

```yaml
- name: Smoke test
  id: smoke
  run: |
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" {{PRODUCTION_URL}}/api/health)
    if [ "$HTTP_STATUS" != "200" ]; then
      echo "Smoke test failed with status $HTTP_STATUS"
      exit 1
    fi

- name: Rollback on failure
  if: failure() && steps.smoke.outcome == 'failure'
  run: |
    echo "Smoke test failed. Initiating rollback..."
    # Rollback command depends on {{HOSTING_PROVIDER}}
    # Vercel: vercel rollback
    # AWS: aws deploy stop-deployment
    # Railway: railway rollback
```

---

## 10. Pipeline Metrics and Monitoring

Track these metrics to keep the pipeline healthy and fast:

| Metric | Target | Alert Threshold | How to Measure |
|--------|--------|-----------------|----------------|
| **PR check duration** | < 8 min | > 12 min | CI provider dashboard |
| **Full deploy duration** | < 20 min | > 30 min | CI provider dashboard |
| **Cache hit rate** | > 80% | < 60% | CI provider cache stats |
| **Pipeline success rate** | > 95% | < 90% | Weekly report |
| **Flaky test rate** | < 2% | > 5% | Test analytics |
| **Deploy frequency** | Daily+ | < weekly | Deployment log |
| **Mean time to recovery** | < 30 min | > 1 hour | Incident log |
| **Change failure rate** | < 5% | > 15% | Deployment + incident log |

### DORA Metrics Dashboard

These four metrics (deploy frequency, lead time, MTTR, change failure rate) are the industry standard for measuring engineering team performance. Track them from day one.

---

## 11. Pipeline Cost Estimation

### {{CI_PROVIDER}} Cost Projections

| Team Size | Monthly CI Minutes | Estimated Cost | Optimization Target |
|-----------|--------------------|----------------|---------------------|
| Solo (1 dev) | 500-1,500 min | Free tier | None needed |
| Small team (2-5 devs) | 3,000-10,000 min | $15-50/month | Cache optimization |
| Medium team (5-15 devs) | 10,000-50,000 min | $50-200/month | Parallelization + caching |
| Large team (15+ devs) | 50,000+ min | $200+/month | Self-hosted runners |

### Cost Optimization Strategies

1. **Cache aggressively** -- Every cache hit saves 1-3 minutes of install time.
2. **Skip unnecessary stages** -- Path-based filtering avoids running irrelevant tests.
3. **Use spot/preemptible runners** -- 60-80% cheaper for non-time-critical jobs.
4. **Limit concurrent jobs** -- Prevent runaway costs from parallel PR checks.
5. **Self-hosted runners** -- For large teams, dedicated machines are cheaper than metered billing.

---

## 12. Checklist Before First Pipeline Run

- [ ] All secrets configured in CI provider (not hardcoded)
- [ ] Branch protection rules enabled on `main` and `develop`
- [ ] Cache keys tested and verified
- [ ] Pipeline runs locally first (`act` for GitHub Actions)
- [ ] Notification channels configured (Slack, email)
- [ ] Rollback procedure documented and tested
- [ ] Pipeline YAML committed and reviewed via PR
- [ ] Cost alerts configured for CI billing
- [ ] Team briefed on pipeline stages and failure handling
- [ ] Deployment environments created in CI provider

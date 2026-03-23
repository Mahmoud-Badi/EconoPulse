# Phase 22: CI/CD Pipeline Architecture

> Design the pipeline before writing the workflow file. A well-designed CI/CD pipeline is the difference between deploying with confidence and deploying with crossed fingers.

---

## Why This Exists

Every team eventually faces the same inflection point: manual deployments become a bottleneck, a liability, or both. Someone forgets to run tests before pushing. A production deploy happens from a developer's laptop with uncommitted changes. A rollback takes 45 minutes because nobody documented the process.

CI/CD pipeline architecture solves these problems by codifying your entire build-test-deploy process into a repeatable, auditable, automated system. But a pipeline is only as good as its design. A poorly designed pipeline is slow, flaky, and eventually bypassed by the team. A well-designed pipeline is fast, reliable, and trusted.

This section provides the architectural decisions, templates, and patterns you need to design a pipeline that your team will actually use.

### How This Connects to Other Sections

| Section | Relationship |
|---------|-------------|
| **05 - Dev Infrastructure** | CI/CD builds on the dev toolchain decisions made there (linters, formatters, test runners). Your pipeline runs the same tools your developers run locally. |
| **09 - Deployment Operations** | Deployment operations define *where* and *how* you deploy. CI/CD defines the automated pipeline that executes those operations. |
| **10 - Testing Strategy** | Your test strategy determines which tests run at which pipeline stage. Unit tests gate PRs; e2e tests gate production deploys. |
| **14 - Security Architecture** | Pipeline security (secrets management, dependency scanning, SAST/DAST) implements the security policies defined in your security architecture. |
| **17 - Monitoring & Observability** | Post-deploy smoke tests and health checks in your pipeline feed into your monitoring stack. |

---

## Files in This Section

| File | Type | Purpose | Orchestrator Step |
|------|------|---------|-------------------|
| `pipeline-architecture.template.md` | Template | Full pipeline design with stages, caching, triggers, and branch strategy | 22.1 |
| `environment-promotion-strategy.md` | Guide | Rules for promoting code from dev through staging to production | 22.2 |
| `ci-provider-decision-tree.md` | Guide | Choose the right CI/CD provider for your project | 22.3 |
| `iac-decision-tree.md` | Guide | Decide if and when to adopt Infrastructure as Code | 22.4 |
| `container-strategy-decision-tree.md` | Guide | Choose between serverless, Docker, and Kubernetes | 22.5 |
| `deployment-patterns.md` | Guide | Blue-green, canary, rolling updates, and feature flags | 22.6 |
| `pipeline-security.md` | Guide | Secrets management, scanning, and supply chain security | 22.7 |
| `github-actions-templates/ci.yml.template` | Template | PR check workflow (lint, type-check, test, build) | 22.8 |
| `github-actions-templates/deploy-staging.yml.template` | Template | Staging deployment workflow | 22.9 |
| `github-actions-templates/deploy-production.yml.template` | Template | Production deployment with approval gates | 22.10 |
| `github-actions-templates/pr-checks.yml.template` | Template | PR-specific checks with preview deploys | 22.11 |
| `cicd-gotchas.md` | Guide | Production lessons and anti-patterns to avoid | 22.12 |

---

## Recommended Reading Order

1. **ci-provider-decision-tree.md** -- Pick your CI platform first.
2. **pipeline-architecture.template.md** -- Design your pipeline stages.
3. **environment-promotion-strategy.md** -- Define promotion rules.
4. **deployment-patterns.md** -- Choose a deployment strategy.
5. **container-strategy-decision-tree.md** -- Decide on containerization.
6. **iac-decision-tree.md** -- Determine if you need IaC.
7. **pipeline-security.md** -- Lock down the pipeline.
8. **github-actions-templates/** -- Implement the actual workflows.
9. **cicd-gotchas.md** -- Learn from others' mistakes.

---

## Key Principles

**1. Fast feedback wins.** A pipeline that takes 30 minutes to tell you your code is broken will be bypassed. Target <10 minutes for PR checks, <20 minutes for full deploy.

**2. Pipeline as code.** Your CI/CD configuration lives in your repo, version-controlled, reviewed via PR, and auditable. Never configure pipelines through a web UI.

**3. Fail fast, fail loud.** Run the cheapest checks first (lint, type-check). If those fail, do not waste time running expensive tests.

**4. Environment parity.** Your staging environment must mirror production. If it does not, every staging sign-off is meaningless.

**5. Rollback is not optional.** Every deployment strategy must include a rollback plan. If you cannot roll back in under 5 minutes, your deploy process is incomplete.

**6. Security is not a phase.** Security scanning runs in every pipeline, not as a quarterly audit. Secrets are encrypted, rotated, and never logged.

---

## Quick Start

If you want to get a CI/CD pipeline running today:

1. Use **GitHub Actions** (unless you have a reason not to).
2. Copy `github-actions-templates/ci.yml.template` into `.github/workflows/ci.yml`.
3. Replace the `{{PLACEHOLDER}}` variables with your project values.
4. Push to a branch, open a PR, and verify the pipeline runs.
5. Iterate from there using the architecture template.

---

## Placeholder Variables Used in This Section

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{CI_PROVIDER}}` | CI/CD platform | `github-actions`, `gitlab-ci`, `circleci` |
| `{{PROJECT_NAME}}` | Repository/project name | `my-saas-app`, `acme-api` |
| `{{PKG_MANAGER}}` | Package manager | `npm`, `pnpm`, `yarn`, `bun` |
| `{{NODE_VERSION}}` | Node.js version | `20`, `22`, `20.x` |
| `{{FRONTEND_FRAMEWORK}}` | Frontend framework | `next`, `remix`, `vite`, `astro` |
| `{{DEPLOY_STRATEGY}}` | Deployment pattern | `blue-green`, `canary`, `rolling` |
| `{{HOSTING_PROVIDER}}` | Where the app is hosted | `vercel`, `railway`, `aws`, `gcp` |
| `{{REGISTRY_URL}}` | Container registry URL | `ghcr.io`, `ecr.aws`, `docker.io` |
| `{{STAGING_URL}}` | Staging environment URL | `https://staging.example.com` |
| `{{PRODUCTION_URL}}` | Production environment URL | `https://example.com` |

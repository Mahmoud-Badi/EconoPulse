# Pipeline Security

> Your CI/CD pipeline has access to production secrets, deployment credentials, and your entire codebase. It is one of the highest-value attack targets in your organization. Treat it accordingly.

---

## The Threat Model

Your pipeline is vulnerable at every stage:

```
Source Code ──▶ Build ──▶ Test ──▶ Deploy ──▶ Production
     │            │         │         │            │
     ▼            ▼         ▼         ▼            ▼
  Malicious    Supply     Secrets   Credential   Runtime
  commit       chain      leaked    theft        exploit
               attack     in logs
```

| Attack Vector | Impact | Likelihood | Mitigation |
|--------------|--------|------------|------------|
| Secrets exposed in build logs | Credential theft | High | Mask secrets, audit logs |
| Unpinned action/plugin versions | Supply chain compromise | Medium | Pin versions with SHA |
| Vulnerable dependencies | Code execution in prod | High | Dependency scanning |
| Malicious PR from fork | Code execution in CI | Medium | Restrict fork permissions |
| Compromised build artifact | Trojan in production | Low | Sign artifacts, verify checksums |
| Stolen deployment token | Unauthorized deploy | Medium | Rotate tokens, limit scope |

---

## 1. Secrets Management

### Principles

1. **Never hardcode secrets.** Not in code, not in config files, not in Dockerfiles.
2. **Never log secrets.** CI providers mask known secrets, but custom scripts can leak them.
3. **Never expose secrets in build output.** Build args, environment variables in browser bundles, error messages.
4. **Rotate secrets regularly.** 90-day rotation for deployment tokens, immediately on team member departure.
5. **Least privilege.** Every secret should have the minimum permissions required.

### GitHub Secrets

```yaml
# Secrets are automatically masked in logs
# Reference them with ${{ secrets.SECRET_NAME }}

steps:
  - name: Deploy
    env:
      DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
    run: |
      # DEPLOY_TOKEN and DATABASE_URL are available as env vars
      # They will appear as *** in logs if accidentally printed
      echo "Deploying..."
```

**Secret Scoping:**

| Scope | Access | Use Case |
|-------|--------|----------|
| **Repository secrets** | All workflows in the repo | Project-specific tokens |
| **Organization secrets** | Shared across repos in org | Shared deployment credentials |
| **Environment secrets** | Only workflows targeting that environment | Staging vs production credentials |

**Environment Protection Rules:**
```
Environment: production
├── Required reviewers: 1+ (manual approval gate)
├── Wait timer: 5 minutes (prevents accidental instant deploy)
├── Deployment branches: main only
└── Secrets: production-specific DATABASE_URL, API keys
```

### HashiCorp Vault (Enterprise)

For teams that need dynamic secrets, centralized management, or audit trails beyond what GitHub Secrets provides.

```yaml
# GitHub Actions + Vault
steps:
  - name: Import secrets from Vault
    uses: hashicorp/vault-action@v3
    with:
      url: https://vault.example.com
      method: jwt
      role: ci-deploy
      secrets: |
        secret/data/production/db url | DATABASE_URL ;
        secret/data/production/api key | API_KEY ;

  - name: Deploy
    env:
      DATABASE_URL: ${{ steps.vault.outputs.DATABASE_URL }}
    run: deploy.sh
```

**When to use Vault:**
- You need dynamic secrets (generated per-use, auto-rotated)
- You need centralized secret management across multiple CI providers
- You need detailed audit logs of secret access
- Compliance requires secret versioning and access policies

### AWS SSM Parameter Store / Secrets Manager

```yaml
# Fetch secrets from AWS SSM
steps:
  - name: Configure AWS credentials
    uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123456789:role/ci-deploy
      aws-region: us-east-1

  - name: Get secrets
    run: |
      DATABASE_URL=$(aws ssm get-parameter --name "/prod/database-url" --with-decryption --query 'Parameter.Value' --output text)
      echo "::add-mask::$DATABASE_URL"
      echo "DATABASE_URL=$DATABASE_URL" >> $GITHUB_ENV
```

**SSM vs Secrets Manager:**

| Feature | SSM Parameter Store | Secrets Manager |
|---------|--------------------|-----------------|
| **Cost** | Free (standard), $0.05/advanced | $0.40/secret/month |
| **Rotation** | Manual | Automatic (Lambda-based) |
| **Cross-account** | Via IAM | Native |
| **Versioning** | Yes | Yes |
| **Best for** | Config values, simple secrets | Database credentials, API keys needing rotation |

### Common Secrets Mistakes

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| Secret in `docker build --build-arg` | Visible in image layer history | Use multi-stage builds, Docker secrets, or build-time-only stages |
| Secret in `console.log` or `print()` | Visible in CI logs forever | Never log variables that might contain secrets |
| `.env` file committed to git | Secret in git history forever | `.gitignore` + `git-secrets` pre-commit hook |
| Same API key for all environments | Staging compromise = production compromise | Separate keys per environment |
| Secret in client-side bundle | Visible in browser dev tools | Use `NEXT_PUBLIC_` / `VITE_` prefixes intentionally; server-only secrets stay server-side |
| Hardcoded secret in test files | Secret in source control | Use test fixtures, mock secrets, or environment variables |

---

## 2. SAST / DAST Scanning

### Static Application Security Testing (SAST)

SAST analyzes source code for vulnerabilities without executing it. Run it on every PR.

**CodeQL (GitHub-native, free for public repos):**
```yaml
name: CodeQL Analysis
on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'  # Weekly Monday scan

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript-typescript

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
```

**Semgrep (open-source, fast, customizable rules):**
```yaml
- name: Semgrep SAST scan
  uses: semgrep/semgrep-action@v1
  with:
    config: >-
      p/javascript
      p/typescript
      p/react
      p/nodejs
      p/owasp-top-ten
      p/secrets
```

**What SAST catches:**
- SQL injection patterns
- Cross-site scripting (XSS) sinks
- Hardcoded secrets and credentials
- Insecure cryptographic usage
- Path traversal vulnerabilities
- Command injection patterns
- Prototype pollution

### Dynamic Application Security Testing (DAST)

DAST tests the running application for vulnerabilities. Run it against staging after deployment.

**OWASP ZAP (industry standard, free):**
```yaml
- name: OWASP ZAP Scan
  uses: zaproxy/action-full-scan@v0.11.0
  with:
    target: 'https://staging.example.com'
    rules_file_name: '.zap-rules.tsv'
    cmd_options: '-a'
```

**What DAST catches:**
- Missing security headers
- Cookie configuration issues
- CORS misconfigurations
- Server information disclosure
- SSL/TLS configuration problems
- Authentication bypass
- Actual injection vulnerabilities (not just patterns)

### When to Run Each

| Scan Type | Trigger | Target | Duration | Blocks Deploy |
|-----------|---------|--------|----------|---------------|
| SAST (CodeQL) | Every PR | Source code | 5-10 min | Yes (critical/high) |
| SAST (Semgrep) | Every PR | Source code | 1-3 min | Yes (critical/high) |
| DAST (ZAP baseline) | Every staging deploy | Staging URL | 5 min | No (informational) |
| DAST (ZAP full) | Weekly schedule | Staging URL | 30-60 min | No (report only) |

---

## 3. Dependency Vulnerability Scanning

### Dependabot (GitHub-native)

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    reviewers:
      - "security-team"
    labels:
      - "dependencies"
      - "security"
    # Group minor/patch updates to reduce PR noise
    groups:
      production-dependencies:
        patterns:
          - "*"
        update-types:
          - "minor"
          - "patch"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "ci"
      - "dependencies"
```

### npm audit / pnpm audit

```yaml
- name: Audit dependencies
  run: |
    # Fail on critical and high severity
    npm audit --audit-level=high

    # Or with pnpm
    pnpm audit --audit-level=high
```

### Snyk (more comprehensive than npm audit)

```yaml
- name: Snyk security scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    command: test
    args: --severity-threshold=high
```

### Vulnerability Response Policy

| Severity | Response Time | Action |
|----------|--------------|--------|
| **Critical** (CVSS 9.0-10.0) | < 24 hours | Patch immediately, deploy hotfix |
| **High** (CVSS 7.0-8.9) | < 72 hours | Patch within current sprint |
| **Medium** (CVSS 4.0-6.9) | < 2 weeks | Patch in next release |
| **Low** (CVSS 0.1-3.9) | < 30 days | Patch when convenient |

---

## 4. Supply Chain Security

Your dependencies are code you did not write but run with full trust. A compromised dependency means compromised production.

### Pin Action Versions

```yaml
# BAD: Using @main or @v3 — can be changed by the action maintainer at any time
- uses: actions/checkout@main        # ← Supply chain attack vector
- uses: actions/checkout@v4          # ← Slightly better, but tags can be moved

# GOOD: Pin to a specific commit SHA
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1
# Add a comment with the version for readability
```

**How to get the SHA:**
```bash
# Find the commit SHA for a specific version
gh api repos/actions/checkout/git/refs/tags/v4.1.1 --jq '.object.sha'
```

### Lockfile Verification

```yaml
# Ensure lockfile matches package.json (detect tampering)
- name: Install dependencies (frozen lockfile)
  run: |
    # npm
    npm ci   # Uses package-lock.json exactly, fails if it doesn't match

    # pnpm
    pnpm install --frozen-lockfile

    # yarn
    yarn install --frozen-lockfile

    # bun
    bun install --frozen-lockfile
```

**Why `npm ci` instead of `npm install`:**
- `npm install` can modify `package-lock.json`
- `npm ci` requires an exact match between `package.json` and `package-lock.json`
- If someone tampered with a dependency version, `npm ci` will fail

### Verified Publishers and Provenance

```yaml
# Use only verified actions from GitHub Marketplace
# Look for the "Verified Creator" badge

# Verify npm package provenance (npm >=9.5.0)
npm audit signatures
```

### Restrict Fork PRs

Fork PRs should never have access to secrets or be able to trigger deployments.

```yaml
# Restrict secret access for PRs from forks
jobs:
  test:
    # Only run with secrets if PR is from the same repo (not a fork)
    if: github.event.pull_request.head.repo.full_name == github.repository
    steps:
      - name: Deploy preview
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
        run: deploy-preview.sh

  # Safe to run on fork PRs (no secrets needed)
  lint:
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint
```

---

## 5. Container Image Scanning

### Trivy (recommended, fast, comprehensive)

```yaml
- name: Build Docker image
  run: docker build -t my-app:${{ github.sha }} .

- name: Scan image with Trivy
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'my-app:${{ github.sha }}'
    format: 'sarif'
    output: 'trivy-results.sarif'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'  # Fail the build on critical/high vulnerabilities

- name: Upload scan results to GitHub Security tab
  uses: github/codeql-action/upload-sarif@v3
  if: always()
  with:
    sarif_file: 'trivy-results.sarif'
```

### Grype (alternative, from Anchore)

```yaml
- name: Scan image with Grype
  uses: anchore/scan-action@v4
  with:
    image: 'my-app:${{ github.sha }}'
    fail-build: true
    severity-cutoff: high
```

### Docker Scout (Docker-native)

```yaml
- name: Docker Scout scan
  uses: docker/scout-action@v1
  with:
    command: cves
    image: 'my-app:${{ github.sha }}'
    only-severities: critical,high
    exit-code: true
```

---

## 6. SBOM Generation (Software Bill of Materials)

An SBOM is a complete inventory of every component in your software. Required for compliance in many industries and increasingly expected by enterprise customers.

### What an SBOM Contains

- Every direct and transitive dependency
- Version numbers for all components
- License information
- Package source (registry URL)
- Checksums / hashes

### Generate SBOM in CI

```yaml
# Using Syft (from Anchore)
- name: Generate SBOM
  uses: anchore/sbom-action@v0
  with:
    image: 'my-app:${{ github.sha }}'
    format: spdx-json
    output-file: sbom.spdx.json

- name: Upload SBOM
  uses: actions/upload-artifact@v4
  with:
    name: sbom
    path: sbom.spdx.json
    retention-days: 365
```

```yaml
# Using Trivy for SBOM
- name: Generate SBOM with Trivy
  run: |
    trivy image --format spdx-json --output sbom.json my-app:${{ github.sha }}
```

### SBOM Formats

| Format | Standard | Best For |
|--------|----------|---------|
| **SPDX** | ISO/IEC 5962:2021 | Compliance, government, enterprise |
| **CycloneDX** | OWASP | Security-focused, vulnerability correlation |

---

## 7. Common CI/CD Security Anti-Patterns

### Anti-Pattern 1: Secrets in Environment Variables Logged to Console

```yaml
# BAD: This will print the secret in plaintext
- run: echo "Token is $DEPLOY_TOKEN"
  env:
    DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}

# BAD: Debug mode that dumps all env vars
- run: env | sort

# BAD: Curl with token in URL (appears in logs)
- run: curl https://api.example.com?token=$API_KEY

# GOOD: Use the secret without printing it
- run: |
    curl -H "Authorization: Bearer $API_KEY" https://api.example.com
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

### Anti-Pattern 2: Overly Permissive GITHUB_TOKEN

```yaml
# BAD: Default permissions are too broad
permissions: write-all

# GOOD: Explicitly request only what you need
permissions:
  contents: read
  pull-requests: write
  packages: write
```

### Anti-Pattern 3: Running CI Commands as Root

```dockerfile
# BAD: Running the app as root in the container
FROM node:20-alpine
COPY . .
RUN npm install
CMD ["node", "server.js"]

# GOOD: Create a non-root user
FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --chown=appuser:appgroup . .
USER appuser
RUN npm install
CMD ["node", "server.js"]
```

### Anti-Pattern 4: Using Third-Party Actions Without Review

```yaml
# BAD: Using an unverified action from a random GitHub user
- uses: random-user/deploy-action@main

# GOOD: Use verified actions, pin to SHA, or write your own
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1
```

### Anti-Pattern 5: No Branch Protection

```
# Without branch protection, anyone can:
# - Push directly to main (bypassing CI)
# - Force-push to main (deleting history)
# - Merge without reviews
# - Merge with failing checks

# Always enable:
# - Require PR reviews before merging
# - Require status checks to pass
# - Require branches to be up-to-date
# - No force push to main
# - No deletion of main
```

### Anti-Pattern 6: Deploying Without Smoke Tests

```yaml
# BAD: Deploy and hope
- name: Deploy
  run: deploy-to-production.sh
# Done! (fingers crossed)

# GOOD: Deploy, verify, rollback if broken
- name: Deploy
  run: deploy-to-production.sh

- name: Smoke test
  run: |
    for i in {1..10}; do
      HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://example.com/health)
      if [ "$HTTP_STATUS" = "200" ]; then
        echo "Health check passed"
        exit 0
      fi
      echo "Attempt $i: got $HTTP_STATUS, retrying..."
      sleep 5
    done
    echo "Smoke test failed after 10 attempts"
    exit 1

- name: Rollback on failure
  if: failure()
  run: rollback-production.sh
```

### Anti-Pattern 7: Shared Credentials Between Environments

```yaml
# BAD: Same token for staging and production
env:
  DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}  # Used for both staging and prod

# GOOD: Environment-specific credentials
jobs:
  deploy-staging:
    environment: staging
    env:
      DEPLOY_TOKEN: ${{ secrets.STAGING_DEPLOY_TOKEN }}

  deploy-production:
    environment: production
    env:
      DEPLOY_TOKEN: ${{ secrets.PRODUCTION_DEPLOY_TOKEN }}
```

---

## Security Checklist for CI/CD Pipelines

### Secrets

- [ ] No secrets hardcoded in code, config files, or Dockerfiles
- [ ] All secrets stored in CI provider's secret store (encrypted at rest)
- [ ] Secrets scoped to appropriate environments (staging vs production)
- [ ] Secret rotation schedule defined and automated where possible
- [ ] Team departure procedure includes rotating all secrets they had access to

### Access Control

- [ ] Branch protection rules enabled on main and develop
- [ ] PR reviews required before merge
- [ ] CI status checks required before merge
- [ ] Force push disabled on protected branches
- [ ] Deployment approvals required for production
- [ ] GITHUB_TOKEN permissions minimized per workflow

### Supply Chain

- [ ] GitHub Actions pinned to commit SHAs (not floating tags)
- [ ] Lockfile committed and enforced (`npm ci` / `--frozen-lockfile`)
- [ ] Dependabot or Renovate configured for automated dependency updates
- [ ] npm audit or Snyk running in CI
- [ ] Fork PRs cannot access secrets

### Scanning

- [ ] SAST scanning on every PR (CodeQL or Semgrep)
- [ ] Dependency vulnerability scanning on every PR
- [ ] Container image scanning before push to registry
- [ ] DAST scanning against staging (weekly minimum)
- [ ] SBOM generated and stored for each release

### Runtime

- [ ] Containers run as non-root user
- [ ] Docker images use minimal base (Alpine, distroless)
- [ ] Production images scanned for vulnerabilities
- [ ] Smoke tests verify deployment health
- [ ] Rollback procedure documented and tested

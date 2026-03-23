# Dependency Scan Protocol

> Your application is 10% your code and 90% other people's code. Scan accordingly.

---

## Tool Recommendations

| Tool | Strength | Cost | Best For |
|------|----------|------|----------|
| **npm audit** | Built-in, zero setup | Free | Quick local checks, CI gating |
| **Snyk** | Deep reachability analysis, fix PRs | Free tier / $25+/mo | Teams wanting actionable remediation |
| **Socket.dev** | Supply chain attack detection (typosquatting, install scripts) | Free tier / paid | Catching malicious packages, not just CVEs |
| **Dependabot** | GitHub-native, automatic PRs | Free (GitHub) | Teams on GitHub wanting automated updates |
| **OSV-Scanner** | Google's open-source vulnerability database | Free | Cross-ecosystem scanning (npm, pip, Go, etc.) |

**Recommendation:** Use npm audit as the baseline (free, always available), add Snyk or Socket.dev for production projects, enable Dependabot for automated PRs.

---

## How to Run Each Tool

### npm audit

```bash
# Production dependencies only (skip devDependencies)
npm audit --production

# JSON output for CI parsing
npm audit --production --json > audit-results.json

# Auto-fix where possible (review changes before committing)
npm audit fix

# See what audit fix would do without applying
npm audit fix --dry-run

# Force fix (may include breaking changes — review carefully)
npm audit fix --force --dry-run
```

### Snyk

```bash
# Install (one-time)
npm install -g snyk && snyk auth

# Test for vulnerabilities
snyk test

# Production only
snyk test --production

# Monitor (sends results to Snyk dashboard)
snyk monitor

# Get fix recommendations
snyk fix
```

### Socket.dev

```bash
# Install
npm install -g @socketsecurity/cli

# Scan current project
socket scan

# Check a specific package before installing
socket npm info <package-name>
```

### OSV-Scanner

```bash
# Install
go install github.com/google/osv-scanner/cmd/osv-scanner@latest

# Scan lockfile
osv-scanner --lockfile=package-lock.json

# Scan entire directory
osv-scanner -r .
```

### Dependabot (GitHub configuration)

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    reviewers:
      - "{{GITHUB_SECURITY_REVIEWER}}"
    labels:
      - "dependencies"
      - "security"
```

---

## How to Interpret Results

### Severity Does Not Equal Exploitability

npm audit reports severity based on the CVE's CVSS score in isolation. This does not account for:

- **Is the vulnerable function actually called?** Many CVEs affect specific functions that your code never invokes.
- **Is the dependency a devDependency?** Vulnerabilities in build tools, test frameworks, and linters do not affect production.
- **Is the vulnerable code reachable from user input?** A prototype pollution in a deeply nested utility is different from one in your request parser.
- **Is there a network path to the vulnerability?** A ReDoS in a server-side regex is exploitable; the same regex in a build script is not.

### Reachability Analysis

Snyk provides reachability analysis that answers "is the vulnerable function actually called in your code path?" This reduces noise dramatically. For projects without Snyk:

1. Identify the affected function from the CVE advisory.
2. Check if your code (or your direct dependencies) calls that function.
3. Check if user input can reach that function.
4. If not reachable, document as known false positive (see below).

---

## Triage Guide

| Scenario | Action | Timeline |
|----------|--------|----------|
| Critical CVE in production dependency, reachable from user input | Patch immediately, deploy hotfix | Hours |
| Critical CVE in production dependency, NOT reachable | Schedule upgrade for current sprint | Days |
| Critical CVE in devDependency | Schedule upgrade, do not block release | Next sprint |
| High CVE with available patch, minor version bump | Upgrade and test | Current sprint |
| High CVE with available patch, major version bump | Evaluate breaking changes, schedule migration | 1-2 sprints |
| Medium CVE, no patch available | Document as accepted risk with compensating controls | Review monthly |
| Low CVE, informational | Add to backlog, batch with other dependency updates | Quarterly |
| Malicious package detected (Socket.dev alert) | Remove immediately, audit for data exfiltration | Hours |

---

## False Positive Handling

Maintain a false positive registry to prevent re-triaging the same non-issues every sprint.

```markdown
## Known False Positives

| Package | CVE | Reason Not Applicable | Documented By | Date | Review Date |
|---------|-----|-----------------------|--------------|------|-------------|
| nth-check | CVE-2021-3803 | Only used in css-select during build, not reachable in production | @dev | 2026-01-15 | 2026-04-15 |
| semver | CVE-2022-25883 | ReDoS only affects untrusted input; we only parse our own version strings | @dev | 2026-02-01 | 2026-05-01 |
```

**Rules:**
- Every false positive must have a written justification (not just "false positive").
- Review every 90 days — conditions change, new code paths may make it reachable.
- If the package is updated to a fixed version, remove from false positive list.

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Security Scan
on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'  # Every Monday at 6 AM

jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '{{NODE_VERSION}}'
      - run: npm ci
      - run: npm audit --production --audit-level=high
      - name: Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

### Block merges on critical findings:

Add `npm audit --production --audit-level=critical` as a required status check on the main branch protection rule.

---

## Emergency Response: Zero-Day in a Dependency

When a zero-day CVE drops for a package you use in production:

1. **Assess exposure (< 1 hour).** Is the vulnerable function reachable? Is it in production or only dev?
2. **Check for a patch.** Is a fixed version available? Can you upgrade without breaking changes?
3. **If patch available:** Upgrade, run tests, deploy hotfix. Skip normal release cadence.
4. **If no patch available:** Evaluate workarounds — can you pin a safe version, add a WAF rule, disable the affected feature, or replace the package?
5. **If actively exploited:** Treat as a SEV1 incident per Section 21 incident response runbook. Notify stakeholders.
6. **Document** the finding in the vulnerability tracker with timeline and resolution.
7. **Post-incident:** Review whether automated scanning would have caught this earlier. Adjust scan configuration if needed.

**Key principle:** Speed of assessment matters more than speed of patching. Knowing you are NOT affected in 30 minutes is more valuable than a panicked upgrade that breaks production.

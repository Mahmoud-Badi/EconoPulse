# CI/CD Gotchas and Production Lessons

> Every lesson here was learned the hard way by someone. Most of them were learned at 2 AM during an incident. Learn from their pain instead of repeating it.

---

## 1. Flaky Tests Kill CI Trust

**The problem:** A test passes 95% of the time and fails 5% of the time. Nobody investigates because "it's just flaky." Developers re-run the pipeline until it passes. Eventually, the team stops trusting the pipeline entirely, and real failures get ignored.

**The rule:** Fix or delete flaky tests. Never ignore them.

**How to detect flaky tests:**
```bash
# Run the same test suite 10 times and look for inconsistencies
for i in {1..10}; do
  npm test -- --reporter=json > "run-$i.json" 2>&1
done
```

**How to fix them:**
- **Timing-dependent tests:** Use `waitFor` / `findBy` instead of `getBy` + `sleep`
- **Order-dependent tests:** Ensure proper setup/teardown, isolate test state
- **Network-dependent tests:** Mock all external HTTP calls in unit tests
- **Race conditions:** Use proper async/await patterns, avoid shared mutable state
- **Database-dependent tests:** Use transactions that roll back after each test

**If you cannot fix it:**
- Quarantine the test (move to a separate "flaky" test suite that does not block PRs)
- Create a ticket with a deadline to fix or delete
- Never leave a flaky test in the main pipeline for more than one sprint

---

## 2. Never Deploy on Friday

**The problem:** You deploy on Friday at 4 PM. The deploy has a subtle bug that only manifests under weekend traffic patterns. Nobody is around to notice until Monday morning. By then, thousands of users have been affected, error logs are massive, and you have no idea which of the 15 Friday commits caused it.

**The rule:** No production deploys on Friday unless you are willing to work on Saturday.

**Exceptions:**
- Critical security patches (P1 — must deploy regardless of day)
- The team has agreed and someone is on-call for the weekend
- Feature flag toggles (not code deploys) are acceptable anytime

**What to do instead:**
- Deploy Thursday. You get one business day of monitoring before the weekend.
- If you miss Thursday, deploy Monday morning.
- Use your Friday for code review, testing, and preparing Monday's deploy.

---

## 3. Staging Must Mirror Production

**The problem:** Staging uses SQLite, production uses PostgreSQL. Staging has no CDN, production has CloudFront. Staging runs Node 18, production runs Node 20. A feature that works perfectly on staging blows up on production because the environments are fundamentally different.

**The rule:** If staging does not mirror production, it is not staging. It is a second development environment.

**What "mirror" means:**
- Same database engine and version
- Same runtime version
- Same infrastructure services (cache, queue, CDN)
- Same SSL/TLS configuration
- Same environment variable structure (different values, same keys)

**What can differ:**
- Scale (fewer instances, smaller machines)
- Data (anonymized subset of production)
- Domain name
- Third-party service tiers (sandbox vs live)

**Red flags that your staging is broken:**
- "It works on staging" is a common phrase before incidents
- You cannot reproduce production bugs on staging
- Staging deploys take a different path than production deploys
- Staging has not been updated in weeks/months

---

## 4. Cache Invalidation Is the #1 CI Speed Improvement

**The problem:** Your CI pipeline takes 12 minutes. Eight of those minutes are `npm install`. You are downloading the same 200 MB of packages on every single run, even though your dependencies have not changed.

**The rule:** Cache everything that does not change between runs.

**What to cache (in order of impact):**
1. **node_modules / package store** -- Saves 1-5 minutes per run
2. **Build caches** (`.next/cache`, `.turbo/cache`, `dist/`) -- Saves 1-3 minutes
3. **Browser binaries** (Playwright, Cypress) -- Saves 1-2 minutes
4. **Docker layers** -- Saves 2-10 minutes for container builds
5. **ESLint cache** (`.eslintcache`) -- Saves 10-30 seconds
6. **TypeScript build info** (`tsconfig.tsbuildinfo`) -- Saves 10-30 seconds

**Common caching mistakes:**
- Cache key does not include the lockfile hash (cache never invalidates properly)
- Caching `node_modules` instead of the package store (pnpm store is more efficient)
- Not using `restore-keys` (misses partial cache hits)
- Caching too much (large caches take longer to restore than to rebuild)
- Not measuring cache hit rates (you do not know if caching is working)

**Measure your impact:**
```
Before caching: 12 minutes average
After caching:   4 minutes average
Savings:         8 minutes * 50 runs/day = 400 minutes/day = 6.7 hours/day of developer wait time eliminated
```

---

## 5. Secrets in CI Logs Are the #1 Security Incident

**The problem:** A developer adds `console.log(process.env)` for debugging. The CI log now contains every environment variable, including `DATABASE_URL`, `API_KEY`, and `STRIPE_SECRET_KEY`. CI logs are visible to every team member. Some CI logs are retained for months.

**The rule:** Assume CI logs are public. Never put anything in a log that you would not put on a billboard.

**How secrets leak in CI:**
- `echo $SECRET_VAR` in a run step (CI providers mask known secrets, but not always)
- `env | sort` for debugging (dumps ALL env vars)
- `curl -v` with auth headers (verbose mode prints headers)
- Build tools that print config on startup
- Error messages that include connection strings
- `docker inspect` showing environment variables
- `printenv` in Dockerfile RUN steps

**How to prevent it:**
- CI providers mask registered secrets, but only exact matches. If you concatenate a secret (`echo "prefix-$SECRET"`), the masked value may not match.
- Use `::add-mask::` in GitHub Actions to manually mask values:
  ```yaml
  - run: |
      MY_TOKEN=$(generate-token)
      echo "::add-mask::$MY_TOKEN"
      echo "TOKEN=$MY_TOKEN" >> $GITHUB_ENV
  ```
- Audit CI logs regularly (search for patterns that look like secrets)
- Rotate any secret that may have been exposed (assume compromise)

---

## 6. Pin Your CI Action Versions

**The problem:** You use `actions/checkout@v4` in your workflow. The maintainer of that action pushes a malicious update to the `v4` tag. Your next CI run downloads and executes the compromised code with access to your secrets, your code, and your deployment credentials.

**The rule:** Pin actions to commit SHAs, not tags.

```yaml
# BAD: Tag can be moved to point to any commit
- uses: actions/checkout@v4

# BAD: Branch reference, changes with every push
- uses: actions/checkout@main

# GOOD: Pinned to specific commit (immutable)
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1
```

**Why this matters:**
- Git tags are mutable. Anyone with write access can move a tag to a different commit.
- The `@v4` tag is a convenience alias that points to the latest v4.x release. When the maintainer releases v4.2.0, `@v4` moves to point to that new commit.
- If the maintainer's account is compromised, the attacker can move `@v4` to a malicious commit.
- Commit SHAs are immutable. Once pinned, the exact code you reviewed is the code that runs.

**How to maintain pinned versions:**
- Use Dependabot or Renovate to automatically update action SHAs
- Add a comment with the human-readable version next to each SHA
- Review action updates in PRs before merging

---

## 7. The Pipeline That Takes 30+ Minutes Will Be Bypassed

**The problem:** Your pipeline starts at 8 minutes. Over six months, new tests, new checks, and new stages are added. Nobody notices that it is now 35 minutes. Developers start pushing directly to `develop` or merging PRs without waiting for checks. The pipeline becomes a suggestion, not a gate.

**The rule:** PR checks must complete in under 10 minutes. Full deploy pipeline must complete in under 20 minutes.

**How pipelines get slow:**
- Running ALL tests on every PR (instead of affected tests only)
- No caching (or broken caching)
- Sequential stages that could run in parallel
- E2E tests on every PR (should run on staging deploy, not PR check)
- Full builds when only docs changed
- Waiting for slow external services (use mocks in CI)

**How to keep them fast:**
- **Parallelize:** Lint, type-check, and security scan should run simultaneously
- **Cache aggressively:** Dependencies, build artifacts, browser binaries
- **Run affected only:** Use path filters to skip irrelevant stages
- **Separate PR and deploy pipelines:** PRs get fast checks; deploys get full tests
- **Profile your pipeline:** Most CI providers show time per step. Find the bottleneck.
- **Set a budget:** "No PR that adds > 1 minute to the pipeline merges without optimization"

---

## 8. Test Your Rollback Process Before You Need It

**The problem:** You have a rollback script that has never been run. Production breaks. You run the rollback script. It fails because it references a deprecated API, uses an expired token, or has a typo that was never caught. You are now debugging your rollback script during a production incident.

**The rule:** Test rollback quarterly. If you have never tested it, it does not work.

**What to test:**
- Can you roll back to the previous version in under 5 minutes?
- Does the rollback script actually work? (Run it against staging.)
- Are the required credentials still valid?
- Does the old version work with the current database schema?
- Do health checks pass after rollback?
- Does the team know how to initiate a rollback? (Not just the person who wrote the script.)

**Rollback drill checklist:**
1. Deploy a known-good version to staging
2. Deploy a "broken" version (intentionally failing health check)
3. Execute the rollback procedure
4. Verify staging is back to the known-good version
5. Time the entire process (target: < 5 minutes)
6. Document any issues encountered
7. Fix any issues before the next drill

---

## 9. Branch Protection Rules Are Not Optional

**The problem:** A developer force-pushes to `main` at 3 AM, overwriting the last 12 commits. Or a junior developer pushes directly to `main` without a PR, breaking the build. Or someone merges a PR with failing checks because "it's just a lint warning."

**The rule:** Enable branch protection on day one. Not day two. Not "when we have more developers." Day one.

**Minimum branch protection for `main`:**
```
Required:
  [x] Require pull request before merging
      [x] Require at least 1 approval
      [x] Dismiss stale reviews on new commits
  [x] Require status checks to pass
      [x] lint
      [x] type-check
      [x] unit-tests
      [x] build
  [x] Require branches to be up-to-date before merging
  [x] Do not allow force pushes
  [x] Do not allow deletions

Recommended:
  [x] Require signed commits
  [x] Require linear history (no merge commits)
  [x] Restrict who can push (only CI bot for automated deploys)
```

**What happens without branch protection:**
- Accidental force pushes destroy commit history
- Broken code reaches production without review
- Merge conflicts silently introduce bugs
- There is no audit trail of who approved what
- "Move fast and break things" becomes "move fast and break everything"

---

## 10. Monitor Your CI Costs

**The problem:** Your team grows from 3 to 10 developers. Each developer opens 3 PRs per day. Each PR triggers a 15-minute pipeline with 5 parallel jobs. Your CI bill goes from $20/month to $400/month, and nobody notices until the invoice arrives.

**The rule:** Set up billing alerts and review CI costs monthly.

**Where costs hide:**
- **macOS runners** are 10x the cost of Linux runners (GitHub Actions)
- **Parallel jobs** multiply cost linearly (5 parallel jobs = 5x the minutes)
- **Re-runs** from flaky tests double or triple your effective cost
- **Scheduled workflows** (nightly builds, security scans) run whether anyone looks at them or not
- **Abandoned preview deployments** that nobody cleans up
- **Large Docker image builds** that take 10+ minutes each

**Cost optimization strategies:**
1. Fix flaky tests (eliminate re-runs)
2. Use path-based filtering (do not run everything on every PR)
3. Consolidate parallel jobs where possible (lint + type-check in one job)
4. Use spot/preemptible runners for non-critical jobs
5. Set concurrency limits (prevent 50 simultaneous PR checks)
6. Clean up preview deployments when PRs close
7. Move large or slow jobs to self-hosted runners at scale

**Monthly cost review template:**
```
- Total CI minutes used: ____
- Cost: $____
- Cost per developer: $____
- Average pipeline duration: ____ minutes
- Pipeline success rate: ____%
- Re-run rate (due to flaky tests): ____%
- Top 3 slowest stages: ____
- Optimization actions for next month: ____
```

---

## Bonus Gotchas

### "It worked in CI" (but not locally)

**Cause:** CI runs on a clean environment. Your local machine has stale caches, old node_modules, or environment-specific config.

**Fix:** Use `npm ci` (not `npm install`) locally. Run the same commands CI runs. Use Docker for local development to match the CI environment.

### The CI provider goes down

**Impact:** Nobody can merge PRs, nobody can deploy. Your entire development process halts.

**Fix:** Have a documented emergency process for bypassing CI. It should require explicit approval from a lead and be audited. Branch protection rules can be temporarily relaxed by admins.

### Someone commits a 500 MB binary

**Impact:** Every `git clone` and `git checkout` in CI now downloads 500 MB. Pipeline times spike. Git history is permanently bloated.

**Fix:** Use `.gitattributes` with Git LFS for large files. Add a pre-commit hook or CI check that rejects files over a size threshold.

```yaml
# CI check for large files
- name: Check for large files
  run: |
    LARGE_FILES=$(find . -type f -size +5M -not -path './.git/*' -not -path './node_modules/*')
    if [ -n "$LARGE_FILES" ]; then
      echo "::error::Large files detected (>5MB). Use Git LFS or remove them."
      echo "$LARGE_FILES"
      exit 1
    fi
```

### The "works on my machine" Docker image

**Cause:** Dockerfile uses `FROM node:latest` which changes over time. Or it installs system packages without pinning versions.

**Fix:** Pin every version. Base images, system packages, everything.

```dockerfile
# Bad
FROM node:latest
RUN apt-get install -y imagemagick

# Good
FROM node:20.11-alpine
RUN apk add --no-cache imagemagick=7.1.1.26-r0
```

### CI credentials that expire silently

**Impact:** Deploys suddenly fail on a random Tuesday because a token expired 90 days ago and nobody set up rotation or expiry alerts.

**Fix:** Document every credential's expiry date. Set calendar reminders 2 weeks before expiry. Better yet, automate rotation.

```
Credential Inventory:
| Secret               | Expires    | Owner      | Rotation |
|---------------------|------------|------------|----------|
| VERCEL_TOKEN        | 2025-06-15 | @devops    | Manual   |
| AWS_ROLE_ARN        | Never      | @devops    | N/A      |
| NPM_TOKEN           | 2025-04-01 | @lead-dev  | Manual   |
| SENTRY_AUTH_TOKEN   | 2025-12-31 | @lead-dev  | Manual   |
| SLACK_WEBHOOK_URL   | Never      | @devops    | N/A      |
```

### Merge queue traffic jams

**Impact:** With branch protection requiring "up-to-date before merge," every merge forces every other PR to rebase and re-run CI. With 10 PRs in the queue, the last one runs CI 10 times.

**Fix:** Use GitHub Merge Queue (built-in) or a merge bot (Mergify, Kodiak). These batch PRs and test them together, reducing total CI runs.

---

## The CI/CD Maturity Checklist

Rate yourself on each item. Be honest.

| Practice | Level 0 (None) | Level 1 (Basic) | Level 2 (Good) | Level 3 (Excellent) |
|----------|---------------|-----------------|----------------|---------------------|
| **Automated tests** | No tests | Some unit tests | Unit + integration | Unit + integration + E2E |
| **Pipeline speed** | > 30 min | 15-30 min | 8-15 min | < 8 min |
| **Caching** | None | Dependencies only | Deps + build | Deps + build + browsers |
| **Branch protection** | None | Require PR | PR + checks | PR + checks + approvals |
| **Secrets management** | Hardcoded | .env files | CI secrets | CI secrets + rotation |
| **Rollback** | Manual redeploy | Script exists | Script tested | Automatic on failure |
| **Monitoring** | None | Basic uptime | Metrics + alerts | DORA metrics tracked |
| **Security scanning** | None | npm audit | SAST on PRs | SAST + DAST + SBOM |
| **Deploy frequency** | Monthly | Weekly | Daily | Multiple per day |
| **Change failure rate** | Unknown | > 15% | 5-15% | < 5% |

**Your target:** Level 2 across the board before shipping to production. Level 3 is aspirational and comes with time and operational maturity.

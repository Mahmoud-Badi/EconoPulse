# Stack Health Decision Tree

> Not every situation calls for a two-hour deep audit. This decision tree helps you choose the right audit depth based on your current context, then guides you through what to check at each level.

---

## Step 1: Determine Audit Depth

```
START
  |
  v
Is this triggered by a security advisory or CVE disclosure?
  |
  YES --> Quick Health Check (security-focused)
  NO  --> continue
  |
  v
Is this a routine periodic check (quarterly, end-of-phase)?
  |
  YES --> Standard Audit
  NO  --> continue
  |
  v
Is this before a major release, fundraising round, or scaling event?
  |
  YES --> Deep Audit
  NO  --> continue
  |
  v
Is a major dependency releasing a new major version?
  |
  YES --> Standard Audit (focused on that dependency)
  NO  --> continue
  |
  v
Are you experiencing performance or cost issues at scale?
  |
  YES --> Deep Audit (focused on performance + cost sections)
  NO  --> continue
  |
  v
Has a dependency been deprecated or changed license?
  |
  YES --> Deep Audit (focused on that dependency + alternatives)
  NO  --> Quick Health Check (general maintenance)
```

---

## Quick Health Check (5-10 minutes)

**When to use:** Routine maintenance, security advisory response, monthly housekeeping, or when you just want to confirm nothing is on fire.

**What to check:**

1. **Version currency scan**
   - Run `npm outdated` / `pip list --outdated` / equivalent
   - Flag anything more than 1 major version behind
   - Check EOL dates for runtime (Node.js, Python, Ruby) and database

2. **CVE scan**
   - Run `npm audit` / `pip audit` / `cargo audit` / equivalent
   - Focus only on CRITICAL and HIGH severity
   - For each finding: is the vulnerable code path reachable in your application?

3. **Quick cost glance**
   - Check hosting dashboard for unexpected cost spikes
   - Compare this month's bill to last month's — flag >20% increase

**Output:** A one-paragraph summary. Either "all clear, next check in [timeframe]" or "found issues, escalating to standard/deep audit."

**Template sections to complete:** Version Currency table (direct deps only), Security check table, Cost total only.

---

## Standard Audit (30-60 minutes)

**When to use:** End of development phase, quarterly review, when a major dependency releases a new version, or when a quick check surfaces concerns.

**What to check:** Everything in the Quick Health Check, plus:

4. **Full version currency table**
   - All direct dependencies, not just frameworks
   - Include dev dependencies that affect build/deploy (bundlers, linters, test frameworks)
   - Note any dependency with a pending major version migration

5. **Security deep-dive**
   - Full `npm audit` with remediation paths
   - Check if any dependency has had a maintainer account compromise
   - Review deprecated packages still in use — these stop receiving security patches

6. **Performance baseline**
   - Bundle size measurement (compare to last audit)
   - Core web vitals snapshot (if web app)
   - Database query performance — any slow queries added since last audit?
   - Cold start times (if serverless)

7. **Cost breakdown**
   - Per-service cost breakdown (not just total)
   - Identify top 3 cost drivers
   - Project costs at 2x current usage

8. **Migration risk scan**
   - For any OUTDATED or EOL dependency, estimate migration effort
   - Check if migration guides exist for pending major version upgrades

**Output:** Completed audit template minus the Community Health section. Action items with priorities.

**Template sections to complete:** All sections except Community Health (section 5).

---

## Deep Audit (2-4 hours)

**When to use:** Before fundraising, before major releases, annually, when performance/cost issues emerge at scale, when evaluating a potential pivot, or when a dependency is deprecated.

**What to check:** Everything in the Standard Audit, plus:

9. **Community health assessment**
   - GitHub activity metrics for each major dependency
   - Maintainer count and bus factor analysis
   - Corporate backing stability (has the sponsor laid off the team? pivoted away?)
   - Ecosystem momentum — are new projects choosing this dependency or moving away?

10. **Alternative comparison**
    - For each major dependency, identify the top 2 alternatives
    - Compare on: performance, bundle size, community size, learning curve, migration effort
    - This is NOT a recommendation to switch — it is awareness of your options

11. **10x scale projection**
    - Project costs at 10x current usage
    - Identify which dependencies hit pricing cliffs or performance walls at 10x
    - Document non-linear cost scaling (e.g., auth providers that jump from $0.05/MAU to $0.02/MAU at 100k but have a $5k minimum)

12. **License audit**
    - Verify license compatibility for all direct dependencies
    - Check for recent license changes (MIT to BSL, Apache to SSPL)
    - Flag any copyleft dependencies that might affect your licensing

13. **Supply chain audit**
    - Transitive dependency count and depth
    - Any transitive dependency with known vulnerabilities?
    - Any dependency pulling from non-standard registries?

14. **Historical trend analysis**
    - Compare this audit to previous audits
    - Is stack health improving, stable, or declining?
    - Which dimensions are trending in the wrong direction?

**Output:** Fully completed audit template, all 7 sections, with action items, upgrade assessments for any flagged dependencies, and cost impact analyses for any proposed changes.

**Template sections to complete:** All sections, plus separate upgrade-assessment and cost-impact-analysis documents for each flagged dependency.

---

## Post-Audit Actions by Verdict

| Verdict | Immediate Action | Follow-Up |
|---------|-----------------|-----------|
| **KEEP** | None | Re-evaluate at next scheduled audit |
| **UPGRADE** | Create upgrade ticket with effort estimate | Complete `upgrade-assessment.template.md` before starting |
| **PIVOT** | Complete full `upgrade-assessment.template.md` and `cost-impact-analysis.template.md` | Present findings to team for decision |
| **MONITOR** | Add to watchlist with specific concern noted | Check at next audit or when trigger fires |

---

## Audit Cadence Recommendations

| Project Stage | Recommended Cadence | Default Depth |
|--------------|--------------------|----|
| Active development (pre-launch) | End of each phase | Standard |
| Post-launch, growing | Quarterly | Standard |
| Stable, maintenance mode | Every 6 months | Quick |
| Pre-fundraising | Ad-hoc | Deep |
| Pre-major-release | Ad-hoc | Standard |
| Post-security-advisory | Immediate | Quick (security-focused) |

---

## Quick Reference: Commands by Ecosystem

| Ecosystem | Version Check | Security Scan | Outdated Deps |
|-----------|--------------|---------------|---------------|
| Node.js / npm | `node -v && npm -v` | `npm audit` | `npm outdated` |
| Node.js / pnpm | `pnpm -v` | `pnpm audit` | `pnpm outdated` |
| Python / pip | `python --version` | `pip-audit` | `pip list --outdated` |
| Ruby / Bundler | `ruby -v` | `bundle audit` | `bundle outdated` |
| Rust / Cargo | `rustc --version` | `cargo audit` | `cargo outdated` |
| Go | `go version` | `govulncheck ./...` | `go list -m -u all` |
| .NET | `dotnet --version` | `dotnet list package --vulnerable` | `dotnet list package --outdated` |

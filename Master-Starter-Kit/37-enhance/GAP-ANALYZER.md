# Gap Analyzer

**Purpose:** Compare the existing application against Master Starter Kit standards across 6 dimensions. Identifies what's missing from the planning, documentation, infrastructure, and code layers — not just what needs to be improved, but what's entirely absent.

**Output:** `dev_docs/audit/gap-analysis.md`

**Path:** Enhance only

**Prerequisites:**
- `dev_docs/intake/enhance-intake.md` — confirmed tech stack and scope
- `dev_docs/audit/quality-scorecard.md` — composite score and blockers

---

## When to Run

Run this as Step E3 immediately after the Quality Scorecard is written. The Gap Analyzer surfaces systematic absences, while the audit surfaces quality problems. Together they drive the Enhancement Backlog.

---

## What Gap Analysis Is (and Is Not)

**Gap analysis finds:** Things that are entirely missing from the app or its planning artifacts.
**Audit found:** Things that exist but are done poorly.

Do not duplicate audit findings here. If something exists but scores low — that's an audit finding. If something doesn't exist at all — that's a gap.

---

## The 6 Gap Dimensions

### Gap Dimension 1 — Services & Backend

Compare the app's backend services against what a complete application at this scope requires.

**Questions to answer:**

1. **Service inventory:** List every backend service/module that exists in the codebase. What does each one do?
2. **Standard service checklist:** For the app type (SaaS / API / marketplace / etc.), what services does a complete application require?
   - Auth & user management
   - Billing & payments (if monetized)
   - Notifications (email, push, in-app)
   - File storage & uploads (if needed)
   - Search (if applicable)
   - Analytics & events
   - Admin/backoffice
   - Audit logging
   - Background jobs / queues
   - Webhooks (inbound and/or outbound)
   - Multi-tenancy (if applicable)
3. **Gap table:** Which services from the standard checklist are entirely absent?
4. **Severity rating per gap:** Would this absence block users from using the product (Critical), create significant friction (High), or just limit functionality (Medium)?

**Output for this dimension:**

| Expected Service | Status | Gap Severity |
|----------------|--------|-------------|
| Auth & user management | Exists / Partial / Missing | Critical / High / Medium / Low |
| Billing & payments | Exists / Partial / Missing | {severity} |
| Notifications | Exists / Partial / Missing | {severity} |
| {etc.} | | |

---

### Gap Dimension 2 — Screens & User Flows

Compare the app's screen inventory against what a complete UX at this scope requires.

**Questions to answer:**

1. **Screen inventory:** List every screen/page/route in the app. What user action does each serve?
2. **Standard screen checklist:** For this app type, what screens does a complete product require?
   - Onboarding / signup / login
   - Dashboard / home
   - Core feature screens (app-specific)
   - Settings (account, notifications, billing, team/org)
   - Profile
   - Billing & subscription management
   - Admin panel
   - 404 / 500 error pages
   - Empty states (first-run experience)
   - Mobile-specific screens (if applicable)
3. **Gap table:** Which screens from the standard checklist are entirely absent?
4. **Critical flow gaps:** Are there user flows with no supporting screen? (e.g., password reset exists in the backend but there's no UI)

**Output for this dimension:**

| Expected Screen | Status | Gap Severity |
|----------------|--------|-------------|
| Onboarding / signup | Exists / Partial / Missing | {severity} |
| Dashboard | Exists / Partial / Missing | {severity} |
| {etc.} | | |

---

### Gap Dimension 3 — Task & Backlog Coverage

Identify what work is untracked or unplanned.

**Questions to answer:**

1. **Backlog inventory:** Does any task tracking exist? (GitHub issues, Linear, Jira, Notion, README TODO section, anything)
2. **Task category coverage:** For a complete software development backlog, these categories should exist:
   - Bug fixes (known bugs)
   - Feature completions (partial features needing completion)
   - Performance improvements
   - Security hardening tasks
   - Testing tasks
   - Documentation tasks
   - Infrastructure/DevOps tasks
   - Technical debt items
3. **Gap table:** Which task categories have zero documented tasks?
4. **Untracked work:** Based on the audit findings, what work is clearly needed but completely untracked?

**Output for this dimension:**

| Task Category | Status | Gap Severity |
|--------------|--------|-------------|
| Bug fixes tracked | Exists / Partial / Missing | {severity} |
| Performance work tracked | Exists / Partial / Missing | {severity} |
| {etc.} | | |

---

### Gap Dimension 4 — Infrastructure & DevOps

Compare the app's infrastructure against the kit's standard infrastructure checklist.

**Questions to answer:**

1. **Infrastructure inventory:** What infrastructure components exist? (CI/CD, Docker, linting, formatting, git hooks, etc.)
2. **Standard infrastructure checklist:**
   - CI/CD pipeline (runs on every PR)
   - Automated testing in CI (not just lint)
   - Linter configured and enforced
   - Formatter configured and enforced
   - Git hooks (pre-commit, pre-push)
   - Docker / containerization (or equivalent)
   - Environment management (dev, staging, production)
   - Secrets management (not hardcoded)
   - Database migrations system
   - Health check endpoint
   - Error tracking (Sentry or equivalent)
   - Application monitoring / metrics
   - Log aggregation
   - Backup strategy (for database)
   - Deployment runbook
3. **Gap table:** Which infrastructure components are entirely absent?

**Output for this dimension:**

| Infrastructure Component | Status | Gap Severity |
|------------------------|--------|-------------|
| CI/CD pipeline | Exists / Partial / Missing | {severity} |
| Automated tests in CI | Exists / Partial / Missing | {severity} |
| {etc.} | | |

---

### Gap Dimension 5 — Testing Gaps

Go beyond the audit score — identify specifically what test scenarios are completely absent.

**Questions to answer:**

1. **Test type inventory:** What types of tests exist at all? (unit, integration, e2e, API contract, performance, accessibility)
2. **Critical path coverage:** Are these flows tested end-to-end?
   - User signup and login
   - Core product use case (primary feature)
   - Payment flow (if applicable)
   - Permission/RBAC enforcement
   - API error scenarios (401, 404, 500)
   - Data validation (bad input rejection)
3. **Regression risk:** What areas of the code have ZERO test coverage? Are they high-risk?

**Output for this dimension:**

| Test Scenario | Status | Gap Severity |
|--------------|--------|-------------|
| Signup flow tested | Exists / Partial / Missing | {severity} |
| Core feature e2e tested | Exists / Partial / Missing | {severity} |
| {etc.} | | |

---

### Gap Dimension 6 — Documentation Gaps

Identify documentation that is entirely absent vs. what a production-ready app requires.

**Questions to answer:**

1. **Documentation inventory:** What documentation artifacts exist?
2. **Standard documentation checklist:**
   - README (setup + run + test instructions)
   - API reference (endpoint list with request/response examples)
   - Database schema documentation (ERD or schema file)
   - Environment variables reference
   - Deployment guide
   - Architecture overview
   - Developer onboarding guide
   - User guide / help documentation
   - Changelog / release notes
   - Incident response runbook
3. **Gap table:** Which documentation artifacts are entirely absent?

**Output for this dimension:**

| Documentation Artifact | Status | Gap Severity |
|-----------------------|--------|-------------|
| README | Exists / Partial / Missing | {severity} |
| API reference | Exists / Partial / Missing | {severity} |
| {etc.} | | |

---

## Gap Analysis Report Format

Write to `dev_docs/audit/gap-analysis.md`:

```markdown
# Gap Analysis — {App Name}

> **Date:** {date}
> **Dimensions analyzed:** 6
> **Total gaps identified:** {count}

---

## Summary

| Dimension | Critical Gaps | High Gaps | Medium Gaps | Total |
|-----------|-------------|----------|-------------|-------|
| Services & Backend | {N} | {N} | {N} | {N} |
| Screens & User Flows | {N} | {N} | {N} | {N} |
| Task & Backlog Coverage | {N} | {N} | {N} | {N} |
| Infrastructure & DevOps | {N} | {N} | {N} | {N} |
| Testing Gaps | {N} | {N} | {N} | {N} |
| Documentation | {N} | {N} | {N} | {N} |
| **Total** | **{N}** | **{N}** | **{N}** | **{N}** |

---

## Critical Gaps (Must Close Before Shipping)

{List all gaps rated Critical with specific descriptions and why they're critical}

---

## High-Severity Gaps

{List all High gaps}

---

## Medium-Severity Gaps

{List all Medium gaps — these go to the Enhancement Backlog as medium-term items}

---

## Dimension Detail Tables

{Paste the 6 gap tables from above, one per dimension}

---

## Relationship to Audit Findings

The following audit findings are related to gaps — these items exist but are inadequate enough to treat as gaps for planning purposes:

| Audit Finding | Dimension | Score | Gap Decision |
|--------------|-----------|-------|-------------|
| {finding} | {dimension} | {score}/10 | Treat as gap (rebuild) / Treat as improvement (enhance) |

---

## Next Step

Proceed to **Step E4: Enhancement Backlog** — `37-enhance/ENHANCEMENT-BACKLOG.md`
```

---

## Quality Rules

1. **Gaps vs. quality problems are different.** If a README exists but is bad — audit problem. If no README exists — gap. Keep them separate.
2. **Rate gaps by user impact.** A missing auth system is Critical. A missing changelog is Low. Use your judgment on the specific app.
3. **Cross-reference audit findings.** Some items that scored ≤4 in the audit may be so bad they should be treated as gaps (rebuild from scratch vs. improve). Flag these explicitly.
4. **Count gaps accurately.** The summary table counts drive the Enhancement Backlog scope. Undercounting leads to an incomplete backlog.
5. **Announce the gate.** After writing the gap analysis, announce: *"{N} total gaps identified. {N} critical, {N} high, {N} medium. Proceeding to Step E4: Enhancement Backlog."*

# Deep Audit Generator

**Purpose:** Perform a comprehensive 6-dimension audit of an existing application. Each dimension runs a 3-round protocol (surface scan → deep dive → recommendations). Produces one audit report per dimension.

**Output:** `dev_docs/audit/enhance-audit-{dimension}.md` for each of 6 dimensions

**Path:** Enhance only (replaces Step 7 for the Enhance path)

**Prerequisite:** `dev_docs/intake/enhance-intake.md` must exist and be confirmed.

---

## When to Run

Run this as Step E1 in the Enhance path. All 6 dimensions must complete before proceeding to Step E2 (Quality Scorecard). Do not skip or partial-run dimensions.

---

## The 6 Audit Dimensions

| # | Dimension | Focus |
|---|-----------|-------|
| E1-A | Architecture & Code Quality | Structure, patterns, coupling, complexity, maintainability |
| E1-B | UX & Screen Coverage | Screens, flows, edge cases, accessibility, responsiveness |
| E1-C | Performance & Scalability | Bundle size, query efficiency, caching, load handling |
| E1-D | Security & Compliance | Auth, RBAC, input validation, OWASP, secrets management |
| E1-E | Testing Coverage | Unit/integration/e2e presence, coverage, critical path gaps |
| E1-F | Documentation & Ops | README, API docs, deployment, monitoring, runbooks |

Run dimensions sequentially. Each produces one output file.

---

## Dimension E1-A — Architecture & Code Quality

### Round 1: Surface Scan

Answer these questions in the conversation before generating the report:

1. What is the top-level directory structure? Does it follow a recognizable pattern (feature-based, layer-based, DDD, etc.)?
2. Are there any files exceeding 500 LOC? List them.
3. Is there a clear separation of concerns? (UI vs. logic vs. data access)
4. Are TypeScript strict settings enabled (or equivalent for the language)? Any `any` types / type suppressions?
5. What's the average file size? Are there obvious god files?
6. Are imports circular? Are there obvious coupling problems?

### Round 2: Deep Dive

7. Pick the 5 most complex files. Read them fully. For each: what is its responsibility, is it doing too much, are there obvious refactors needed?
8. Is there a consistent architectural pattern throughout, or does each module look different?
9. Are there duplicated patterns that should be abstracted? List specific examples.
10. Is the folder naming consistent and predictable? Can you navigate the codebase without a map?
11. Are there obvious dead code blocks, commented-out code, or unused exports?
12. How is shared logic managed? (utils/, shared/, libs/, common/) — is it organized or a dumping ground?

### Round 3: Recommendations

13. What are the top 3 architecture improvements that would most improve the codebase?
14. Which files are protect-list candidates (high quality, should not be touched)?
15. What's a realistic refactor plan — what to fix now vs. later?

**Output:** `dev_docs/audit/enhance-audit-architecture.md`

---

## Dimension E1-B — UX & Screen Coverage

### Round 1: Surface Scan

1. List all screens/pages/routes in the application.
2. For each screen: does it have a loading state? An error state? An empty state?
3. Are all primary user flows documented anywhere?
4. Is the app mobile-responsive? Test at common breakpoints.
5. What navigation patterns exist? (sidebar, tabs, breadcrumbs, etc.)

### Round 2: Deep Dive

6. Walk through the main user journey end-to-end. Note every friction point, broken state, or missing step.
7. Are forms validated on the client side? Do they show meaningful error messages?
8. Is accessibility considered? (ARIA labels, keyboard nav, focus management, color contrast)
9. Are there screens that do too much? (single screens trying to handle multiple user goals)
10. Are modals/dialogs properly managed? (focus trapping, keyboard escape, backdrop behavior)
11. Is there a consistent component library or is UI invented per screen?

### Round 3: Recommendations

12. What screens are missing entirely vs. what a complete app at this scope would have?
13. What's the single biggest UX improvement available with minimal code change?
14. Which screens need a redesign vs. minor polish?

**Output:** `dev_docs/audit/enhance-audit-ux.md`

---

## Dimension E1-C — Performance & Scalability

### Round 1: Surface Scan

1. What is the client-side bundle size? (check build output, `next build`, webpack-bundle-analyzer, etc.)
2. Are images optimized? (proper formats, lazy loading, CDN)
3. Are there N+1 query patterns visible in the data access layer?
4. Is any caching implemented? (in-memory, Redis, CDN, HTTP cache headers)
5. What is the deployment infrastructure? Can it scale horizontally?

### Round 2: Deep Dive

6. Profile the 3 most data-heavy screens or API endpoints. What queries do they run? Estimate their cost at 10× current load.
7. Are database queries using indexes? Look for queries without WHERE clause indexes, full table scans, unindexed joins.
8. Are there synchronous operations that could be async or queued? (blocking email sends, heavy computation in request path)
9. Are there obvious memory leaks? (event listeners not cleaned up, timers not cleared, growing in-memory caches)
10. What happens at 10× the current user load? What breaks first?
11. Are third-party API calls failing gracefully? What happens if Stripe/SendGrid/etc. is down?

### Round 3: Recommendations

12. What's the lowest-effort, highest-impact performance improvement?
13. What would need to change before the app could handle 100× current load?
14. Are there quick wins in query optimization or caching that could be done in a sprint?

**Output:** `dev_docs/audit/enhance-audit-performance.md`

---

## Dimension E1-D — Security & Compliance

### Round 1: Surface Scan

1. Is authentication implemented? What type? (JWT, session, OAuth, etc.)
2. Are secrets in environment variables or hardcoded anywhere? Check for API keys in source.
3. Is HTTPS enforced?
4. Is there any form of rate limiting on APIs?
5. Are database inputs parameterized (protection against SQL injection)?

### Round 2: Deep Dive

6. Check OWASP Top 10 against this application:
   - **A01 Broken Access Control**: Are authorization checks on every protected route/endpoint?
   - **A02 Cryptographic Failures**: Are passwords hashed with bcrypt/argon2? Are tokens signed securely?
   - **A03 Injection**: Are user inputs sanitized? Any raw string queries?
   - **A04 Insecure Design**: Is there a rate limiter? Brute force protection on auth?
   - **A05 Security Misconfiguration**: CORS settings, default credentials, debug mode in production?
   - **A06 Vulnerable Components**: Run `npm audit` / `pip audit` / equivalent. How many vulnerabilities?
   - **A07 Auth Failures**: Session fixation? Token storage in localStorage (vs HttpOnly cookies)?
   - **A08 Integrity Failures**: Are file uploads validated for type and size?
   - **A09 Logging Failures**: Are security events logged? Are logs accessible in production?
   - **A10 SSRF**: Are server-side URL fetches validated against an allowlist?
7. Is RBAC (role-based access control) implemented? Are role checks in middleware or scattered?
8. Is PII handled properly? What data is stored, how, and who has access?

### Round 3: Recommendations

9. List all P0 security issues (exploitable right now or data loss risk).
10. What's the minimum security hardening needed before handling real user data?
11. Are there compliance considerations (GDPR, HIPAA, SOC2) based on the user data handled?

**Output:** `dev_docs/audit/enhance-audit-security.md`

---

## Dimension E1-E — Testing Coverage

### Round 1: Surface Scan

1. Do test files exist? What percentage of source files have corresponding test files?
2. What test frameworks are installed? (Jest, Vitest, Playwright, pytest, RSpec, etc.)
3. Does `npm test` (or equivalent) run without errors?
4. Is there a CI pipeline that runs tests? Does it pass?
5. What is the current test coverage percentage? (check coverage reports, README badges, CI output)

### Round 2: Deep Dive

6. What types of tests exist? (unit only / unit + integration / unit + integration + e2e)
7. Are the most critical user flows covered by e2e tests? List the flows and their test status.
8. Are API endpoints tested? With happy path only or also error cases and edge conditions?
9. Are tests isolated? (no shared state, no test-order dependencies)
10. Are mocks realistic? (avoid mocking so much that the tests don't test anything real)
11. What's the most dangerous untested code path? (auth flow, payment processing, data deletion)

### Round 3: Recommendations

12. What's the minimum test coverage to consider the app production-safe?
13. What's the single highest-value test to write today?
14. Is the current test infrastructure salvageable or should it be rebuilt from a standard config?

**Output:** `dev_docs/audit/enhance-audit-testing.md`

---

## Dimension E1-F — Documentation & Ops

### Round 1: Surface Scan

1. Does a README exist? Can a new developer get the app running from scratch using only the README?
2. Is there an API reference? (OpenAPI spec, Swagger, README section, auto-generated docs)
3. Is there a deployment guide? Does it cover all environments (dev, staging, production)?
4. Are environment variables documented? (`.env.example` + explanations)
5. Is there a CHANGELOG or release history?

### Round 2: Deep Dive

6. Is there any monitoring or observability? (error tracking, application metrics, uptime monitoring)
7. Are errors logged with enough context to debug in production? (request ID, user ID, stack traces)
8. Is there an on-call or incident response plan? (even minimal)
9. Is the database schema documented? (ERD, schema file, migration history)
10. Is there a developer onboarding guide? How long would it take a new developer to be productive?
11. Are architectural decisions documented? (ADRs, decision log)

### Round 3: Recommendations

12. What's the single most dangerous documentation gap? (the thing that would cause the worst incident if undocumented)
13. What docs can be auto-generated vs. must be written by hand?
14. What's the minimum docs needed before this app is team-hand-off ready?

**Output:** `dev_docs/audit/enhance-audit-docs.md`

---

## Audit Report Format

Write each dimension report to `dev_docs/audit/enhance-audit-{dimension}.md`:

```markdown
# Audit: {Dimension Name}

> **App:** {app name}
> **Dimension:** {E1-A through E1-F}
> **Date:** {date}
> **Rounds completed:** 3/3

---

## Score: {X}/10 — {Critical / Needs Work / Solid / Excellent}

---

## Round 1 Findings (Surface Scan)

{Answers to Round 1 questions with specific evidence — file paths, line counts, etc.}

---

## Round 2 Findings (Deep Dive)

{Answers to Round 2 questions with specific code references and examples}

---

## Recommendations

Ordered by priority:

1. **[P0]** {action} — `{file}` — {why this matters}
2. **[P1]** {action} — `{file}` — {why this matters}
3. **[P2]** {action} — {why this matters}

---

## Protect List (this dimension)

| File | Score | Reason |
|------|-------|--------|
| `{path}` | {8+}/10 | {why it should not be touched} |

---

## Summary

{2-3 sentence executive summary: overall state of this dimension, top priority action, estimated effort to bring to production quality.}
```

---

## Quality Rules

1. **Read the code, don't assume.** Every finding must cite a specific file, line, or pattern in the actual codebase — not a generic observation.
2. **Score honestly.** A 4/10 is not an insult — it's a roadmap. Inflated scores obscure real problems.
3. **Round 2 deepens Round 1.** Don't repeat surface observations in the deep dive — go further each round.
4. **All 6 dimensions must complete** before passing to the Quality Scorecard. No partial audits.
5. **Specific recommendations only.** "Improve error handling" is useless. "`src/api/orders.ts:87` — missing try/catch block in createOrder, will crash the server on DB timeout" is actionable.
6. **Note what works.** Call out high-quality code worth replicating. Audits are not just defect lists.
7. **Gate enforcement:** After completing all 6 dimensions, announce: *"All 6 audit dimensions complete. Proceeding to Step E2: Quality Scorecard."*

# Test Tier Promotion Guide

Not every project needs every test type from day one. This guide defines which tests are mandatory at which stage, and when to promote optional tests to required. Start lean, scale up based on evidence — but never skip the foundation.

---

## Test Tiers

### Tier 1 — Always Required

These tests are mandatory for every project, from the first commit. No exceptions, no "we'll add them later."

| Test Type | What It Covers | Minimum Bar | Tool |
|-----------|---------------|-------------|------|
| **Unit tests** | Business logic, validators, transformations, utilities | ≥ 80% coverage on business logic modules | Vitest, Jest |
| **Integration tests (API)** | Every API endpoint: happy path + error cases | Every endpoint has at least 1 success + 1 failure test | Supertest, app.inject |
| **Authentication tests** | Login, logout, token refresh, session expiry, protected routes | Every auth flow + every protected route tested | Integration tests |
| **TypeScript / type checking** | Compile-time safety across entire codebase | Zero type errors | `tsc --noEmit` |
| **Linting** | Code style, common mistakes, security patterns | Zero errors (warnings acceptable with justification) | ESLint, Biome |

**Why these are non-negotiable:** A project without unit tests has untested business logic. A project without integration tests has untested API contracts. A project without auth tests has untested security boundaries. These three together catch the majority of bugs.

#### Tier 1 Checklist

```markdown
- [ ] Unit tests exist for every service/module with business logic
- [ ] Unit test coverage ≥ 80% on business logic (not just overall)
- [ ] Integration tests exist for every API endpoint
- [ ] Every protected route tested with valid token, invalid token, and no token
- [ ] `pnpm typecheck` passes with zero errors
- [ ] `pnpm lint` passes with zero errors
```

---

### Tier 2 — Required for Features

These tests are required once a project has user-facing features. Add them as soon as you build your first feature.

| Test Type | What It Covers | When Required | Tool |
|-----------|---------------|--------------|------|
| **E2E happy path** | Critical user journeys work end-to-end | First deployable feature | Playwright |
| **Accessibility (axe-core)** | WCAG 2.1 AA compliance | Any page with forms, navigation, or interactive elements | axe-core, jest-axe |
| **Contract tests** | API request/response shapes match between client and server | Multi-package monorepo or separate frontend/backend | Pact, Zod schema tests |
| **Component tests** | UI components render correctly with various props | Any shared/reusable component library | Testing Library |
| **Regression tests** | Bugs don't recur | First bug fix | See `regression-test-protocol.md` |

**Why these unlock at feature stage:** E2E tests need a deployable app. Accessibility tests need rendered UI. Contract tests need multiple consumers. Before features exist, these tests have nothing to test.

#### Tier 2 Checklist

```markdown
- [ ] E2E tests cover the 5-10 most critical user journeys
- [ ] Every page passes axe-core with zero violations
- [ ] API contract schemas validated between frontend and backend
- [ ] Every shared component has a test with at least 3 prop variations
- [ ] Every bug fix has a regression test (see regression-test-protocol.md)
```

---

### Tier 3 — Required at Scale

These tests become required when the project reaches production scale. "Scale" means: real users, real data volumes, real uptime requirements.

| Test Type | What It Covers | Trigger to Require | Tool |
|-----------|---------------|-------------------|------|
| **Load testing** | Performance under concurrent users | ≥ 100 concurrent users expected | k6, autocannon |
| **Mutation testing** | Test quality (do tests actually catch bugs?) | Test coverage ≥ 80% but bug rate still high | Stryker |
| **Chaos testing** | System resilience to failures | Running on distributed infrastructure | Chaos Monkey, custom |
| **Database migration tests** | Migrations work on production-sized data | Any migration touching tables with > 100K rows | See `migration-testing.md` |
| **Performance baselines** | No performance regressions | Any performance SLA or SLO in place | See `performance-baseline.md` |
| **Security automation** | SAST, DAST, dependency scanning | Any app handling PII, payments, or auth | See `security-automation.md` |

**Why these unlock at scale:** Load testing a prototype with 10 users is waste. Mutation testing with 20% coverage tells you nothing useful. Chaos testing on a single-server app is pointless. These tests deliver value only at scale.

#### Tier 3 Checklist

```markdown
- [ ] Load test simulates expected peak traffic ({{PEAK_CONCURRENT_USERS}} users)
- [ ] All API endpoints meet p95 response time targets under load
- [ ] Mutation testing score ≥ 70% on critical business logic
- [ ] Chaos scenarios defined for: database down, cache down, external API timeout
- [ ] All migrations tested with production-scale data ({{PRODUCTION_ROW_COUNT}} rows)
- [ ] Performance baselines captured for all endpoints and key pages
- [ ] SAST + dependency scanning in CI pipeline
- [ ] DAST scan runs weekly against staging
```

---

### Tier 4 — Recommended

These tests add value in specific contexts. They are never required by default but become required when the trigger condition is met.

| Test Type | What It Covers | When to Add | Tool |
|-----------|---------------|-------------|------|
| **Visual regression** | Screenshots match expected appearance | Design system with > 20 components, or pixel-perfect brand requirements | Playwright screenshots, Chromatic |
| **Cross-browser** | App works in Chrome, Firefox, Safari, Edge | B2C app with diverse user base | Playwright multi-browser, BrowserStack |
| **Mobile-specific** | Touch interactions, viewport behavior, native features | Mobile-first app or PWA | Playwright mobile emulation, Detox |
| **i18n/l10n** | Translations complete, RTL layout, date/number formatting | App supports ≥ 2 languages | Custom test suite |
| **API fuzzing** | Unexpected inputs don't crash the API | Public-facing API or API with external consumers | Schemathesis, custom fuzzers |
| **Snapshot tests** | Component output stability (with caution) | Rapidly iterating team that needs change detection | Vitest snapshots |

#### Tier 4 Promotion Triggers

| Test Type | Promote to Required When... |
|-----------|---------------------------|
| Visual regression | A visual bug reaches production that a screenshot test would have caught |
| Cross-browser | Analytics show > 10% traffic from non-Chrome browsers |
| Mobile-specific | Mobile traffic exceeds 30% or app is distributed as PWA |
| i18n | Second language is being added to the application |
| API fuzzing | API is documented as public or consumed by third-party integrations |

---

## Promotion Criteria

### When to Promote a Test from Optional to Required

A test type should be promoted from its current tier to "required" when any of these conditions are met:

1. **Incident-driven:** A production incident occurs that this test type would have prevented. One incident = permanent promotion.

2. **Scale-driven:** The project crosses the scale threshold for that test type (see Tier 3 triggers).

3. **Compliance-driven:** A regulatory or contractual requirement mandates the test type (e.g., accessibility for government contracts, security scanning for SOC 2).

4. **Risk-driven:** The feature being built has characteristics that make this test type essential (e.g., a payment flow needs load testing even if the rest of the app doesn't).

### Promotion Process

```
1. Identify the trigger (incident, scale, compliance, or risk)
2. Document the trigger in dev_docs/decisions/
3. Add the test type to the project's required list
4. Set a deadline for existing features to add the test (typically: end of current phase)
5. Add the test type to Feature Gate and Phase Gate checklists
6. Update CI pipeline to enforce the new requirement
```

---

## Project-Specific Tier Customization

```markdown
## Test Requirements — {{PROJECT_NAME}}

### Active Requirements (Current Phase: {{CURRENT_PHASE}})

| Test Type | Tier | Status | Required Since | Trigger |
|-----------|------|--------|---------------|---------|
| Unit tests | 1 | Required | Phase 1 | Always required |
| Integration tests (API) | 1 | Required | Phase 1 | Always required |
| Auth tests | 1 | Required | Phase 1 | Always required |
| TypeScript checking | 1 | Required | Phase 1 | Always required |
| Linting | 1 | Required | Phase 1 | Always required |
| E2E happy path | 2 | {{STATUS}} | {{SINCE}} | First feature deployed |
| Accessibility | 2 | {{STATUS}} | {{SINCE}} | First UI feature |
| Contract tests | 2 | {{STATUS}} | {{SINCE}} | Monorepo created |
| Regression tests | 2 | {{STATUS}} | {{SINCE}} | First bug fix |
| Load testing | 3 | {{STATUS}} | {{SINCE}} | {{TRIGGER}} |
| Mutation testing | 3 | {{STATUS}} | {{SINCE}} | {{TRIGGER}} |
| Security scanning | 3 | {{STATUS}} | {{SINCE}} | {{TRIGGER}} |
| Performance baselines | 3 | {{STATUS}} | {{SINCE}} | {{TRIGGER}} |
| Visual regression | 4 | {{STATUS}} | — | — |
| Cross-browser | 4 | {{STATUS}} | — | — |
| Mobile-specific | 4 | {{STATUS}} | — | — |

### Promotion Log

| Date | Test Type | Previous Tier | Promoted To | Trigger |
|------|-----------|--------------|-------------|---------|
| {{DATE}} | {{TEST_TYPE}} | {{OLD_TIER}} | Required | {{PROMOTION_TRIGGER}} |

### Phase-Specific Additions
<!-- Tests that are required only for specific phases -->
| Phase | Additional Required Tests | Reason |
|-------|--------------------------|--------|
| {{PHASE_NUMBER}} | {{TEST_TYPE}} | {{REASON}} |
```

---

## Quick Reference: "Which Tests Do I Need?"

### Day 1 (New Project)
- Unit tests, integration tests, auth tests, typecheck, lint
- **Time to set up:** 1-2 hours

### First Feature Deployed
- Add: E2E for critical path, accessibility, regression protocol
- **Time to set up:** 2-4 hours

### First Real Users (MVP Launch)
- Add: Performance baselines, security scanning (SAST + dependency audit)
- **Time to set up:** 4-8 hours

### Growth (100+ users, SLAs in place)
- Add: Load testing, mutation testing, DAST
- **Time to set up:** 1-2 days

### Scale (1000+ users, multiple environments)
- Add: Chaos testing, migration testing on prod-size data, visual regression
- **Time to set up:** 2-5 days

---

## Anti-Pattern: All-or-Nothing Testing

**"We'll add all test types once we have time"** — This never happens. The project either starts with too many test types (burnout, slow velocity) or too few (production bugs).

The tier system solves this by making the tradeoff explicit:
- Tier 1 is the cost of writing software. Non-negotiable.
- Tier 2 is the cost of shipping features. Required when features exist.
- Tier 3 is the cost of running at scale. Required when scale exists.
- Tier 4 is insurance. Buy it when the risk justifies the cost.

---

## Integration with Feature Gate

The Feature Gate checklist (see `enforcement/feature-gate.md`) should check the project's active test requirements:

```
For each test type where status = "Required":
  - Does this feature have tests of that type? → If NO and applicable: FAIL
  - Do those tests pass? → If NO: FAIL
```

A Tier 1 test type that is missing blocks the feature. A Tier 4 test type that is "Recommended" but missing does not.

# Technical Debt Registry

> A living document that tracks known technical debt, scores its impact, and drives prioritized paydown. Review monthly; schedule quarterly paydown sprints.

---

## Debt Registry Table

| ID | Description | Category | Impact (1-5) | Effort | Files Affected | Date Logged | Owner | Status |
|----|-------------|----------|---------------|--------|----------------|-------------|-------|--------|
| TD-001 | {{DEBT_DESCRIPTION}} | Deliberate | 4 | M | `src/{{FILE_PATH}}` | {{DATE}} | {{OWNER}} | Open |
| TD-002 | Hardcoded API base URL used in 12 files instead of env variable | Accidental | 3 | S | `src/lib/api.ts`, `src/hooks/useFetch.ts` | 2024-01-15 | @backend-lead | Open |

---

## Debt Categories

- **Deliberate** — Shortcuts taken knowingly under time pressure. Example: skipping input validation to hit a deadline, using `any` types to unblock a feature.
- **Accidental** — Discovered after the fact. Example: a hook that causes unnecessary re-renders found during a performance audit.
- **Bit Rot** — Accumulated over time through small changes. Example: a utility file that grew from 50 to 800 lines with no refactoring, deprecated dependency APIs still in use.
- **Design Debt** — Wrong abstraction or architecture choice. Example: a state management approach that does not scale, a database schema that requires joins for every simple query.

---

## Impact Scoring (1-5)

Calculate impact using three factors, then average:

| Factor | 1 (Low) | 3 (Medium) | 5 (High) |
|--------|---------|------------|----------|
| **Frequency of contact** | Rarely touched code | Touched monthly | Touched daily |
| **Pain when contacted** | Minor inconvenience | Slows development | Blocks work or causes bugs |
| **Blast radius** | Single file | Single feature | Cross-cutting, affects many features |

**Formula:** `Impact = round((Frequency + Pain + Blast Radius) / 3)`

Example: A duplicated validation function (Frequency: 4, Pain: 3, Blast Radius: 3) = Impact **3**.

---

## Effort Estimation

| Size | Hour Range | Description |
|------|------------|-------------|
| **S** | 1-4 hours | Single file change, straightforward fix, no API changes |
| **M** | 4-16 hours | Multi-file refactor, may require test updates, no breaking changes |
| **L** | 16-40 hours | Significant refactor, may change interfaces, requires migration plan |
| **XL** | 40+ hours | Architectural change, multi-sprint effort, needs design review first |

---

## Paydown Prioritization Framework

Prioritize using this quadrant:

```
                    High Impact
                        |
         [DO FIRST]     |    [PLAN NEXT]
         High Impact    |    High Impact
         Low Effort     |    High Effort
                        |
  ----------------------+----------------------
                        |
         [DO IF TIME]   |    [RECONSIDER]
         Low Impact     |    Low Impact
         Low Effort     |    High Effort
                        |
                    Low Impact
```

**Sort the registry by:** Impact descending, then Effort ascending (S before M before L).

---

## Review Cadence

### Monthly Debt Review (30 minutes)
1. Review all open debt items — is the scoring still accurate?
2. Add any new debt discovered during the month
3. Close any items resolved through normal development
4. Identify the top 3 items for paydown consideration

### Quarterly Paydown Sprint (1-2 days)
1. Select 3-5 items from the "DO FIRST" quadrant
2. Create tasks in `STATUS.md` under a "Tech Debt Paydown" section
3. Allocate dedicated time — do not mix with feature work
4. After paydown, update the registry and close resolved items

---

## Integration with STATUS.md

When scheduling debt paydown, add entries to your project STATUS.md:

```markdown
## Current Sprint — Tech Debt Paydown

- [ ] TD-001: Extract hardcoded API URLs to environment config (S, Impact 4)
- [ ] TD-005: Replace copy-pasted form validation with shared hook (M, Impact 3)
- [ ] TD-003: Add missing error boundaries to route segments (S, Impact 3)
```

---

## Common Tech Debt Patterns in Web Projects

| Pattern | Category | Typical Impact | Suggested Fix |
|---------|----------|---------------|---------------|
| Hardcoded values (URLs, keys, magic numbers) | Accidental | 3 | Extract to constants or env vars |
| Copy-pasted logic across components | Bit Rot | 3-4 | Extract shared hooks or utility functions |
| Missing tests for critical paths | Deliberate | 4-5 | Add integration tests for core user flows |
| Deprecated dependencies with known CVEs | Bit Rot | 4-5 | Upgrade or replace; check with `npm audit` |
| Inconsistent patterns (some files use X, others Y) | Bit Rot | 2-3 | Pick one pattern, lint for it, migrate incrementally |
| God components (500+ line components) | Bit Rot | 3 | Decompose into smaller, focused components |
| Missing TypeScript types (`any` usage) | Deliberate | 2-3 | Add proper types incrementally, start with public APIs |
| No error handling on API calls | Accidental | 4 | Add error boundaries and try/catch with user-facing messages |
| Unused code and dead imports | Bit Rot | 1-2 | Run `knip` or tree-shaking analysis, remove dead code |
| Missing loading and empty states | Accidental | 3 | Audit all data-fetching components, add skeleton/empty UIs |

---

## Getting Started

1. Copy this template into your project at `docs/technical-debt-registry.md`
2. Do an initial audit: grep for `TODO`, `HACK`, `FIXME`, `WORKAROUND` in the codebase
3. Score each item found and add it to the registry
4. Schedule your first monthly review
5. After 2-3 monthly reviews, schedule your first quarterly paydown sprint

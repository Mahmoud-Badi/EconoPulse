# 08 - Quality & Testing

## Quality Orchestrator

Quality is not a phase — it is every phase. Every feature, every commit, every PR must pass the same gates. There are no shortcuts, no "I'll fix it later," no "it works on my machine."

## Core Principles

1. **Never mark a feature done until /verify passes all 8 checks.** Not 7 out of 8. All 8.
2. **Design bugs are bugs.** A misaligned button, a hardcoded color, a missing hover state — these are defects, not "nice to haves."
3. **Missing states are bugs.** Loading, error, empty, and data — all four must exist for every data-driven component. Users hit all four states in production.
4. **A feature without tests is not a feature.** It is a liability with a countdown timer. Untested code is code you cannot confidently change.
5. **If you can't show it, it didn't happen.** Every claim of "tests pass" must include actual proof — console output, screenshots, reports. Not "all tests pass" but the literal evidence. See [Enforcement System](./enforcement/).

## Major Sections

| Section | Purpose |
|---------|---------|
| [Testing Catalog](./testing-catalog/) | Comprehensive reference of all 32 test types across 5 tiers — what each is, when to use it, setup guides, templates, and proof artifacts |
| [Test Selection Matrix](./testing-catalog/test-selection-matrix.md) | Decision matrix: answer feature characteristic questions → get your required test types |
| [Enforcement System](./enforcement/) | The "Show Me" rule, Test Requirements Cards, and 3-level verification gates (feature → phase → release) |
| [Quality Gates](./quality-gates.md) | The 8-step /verify sequence — what each check does and why it matters |

## Files in This Section

| File | Purpose |
|------|---------|
| [quality-gates.md](./quality-gates.md) | The 8-step /verify sequence — what each check does and why it matters |
| [unit-test-templates.md](./unit-test-templates.md) | Copy-paste test patterns for validators, routers, and components |
| [e2e-test-templates.md](./e2e-test-templates.md) | End-to-end test patterns for auth, lists, forms, and detail pages |
| [feature-completion-checklist.md](./feature-completion-checklist.md) | 5-layer checklist: DB, API, UI, Testing, Quality |
| [regression-prevention.md](./regression-prevention.md) | Branch strategy, CI/CD pipeline, testing discipline |
| [mobile-test-templates.md](./mobile-test-templates.md) | Mobile unit test patterns per framework, native module mocking |
| [mobile-e2e-templates.md](./mobile-e2e-templates.md) | Mobile E2E patterns (Detox, Maestro, Flutter integration_test) |

## Workflow Integration

```
Feature code complete
        |
        v
/feature-checklist  -->  Missing layer?  -->  Go back and build it
        |
        v (all 5 layers exist)
pnpm typecheck  -->  Errors?  -->  Fix types
        |
        v (zero errors)
pnpm test  -->  Failures?  -->  Fix tests
        |
        v (all pass)
pnpm lint  -->  Violations?  -->  Fix lint
        |
        v (clean)
pnpm build  -->  Build error?  -->  Fix build
        |
        v (success)
/design-verify  -->  Violations?  -->  Fix design
        |
        v (compliant)
Playwright visual  -->  Issues?  -->  Fix UI
        |
        v (all clear)
State verification  -->  Missing state?  -->  Add it
        |
        v (all 4 states)
FEATURE COMPLETE ✓
```

## The Cost of Skipping

Every skipped check has a price:
- **Skip typecheck**: runtime TypeError in production, 3am alert
- **Skip tests**: regression in the next feature, 2 hours debugging
- **Skip build**: deploy fails, rollback, lost momentum
- **Skip design-verify**: visual drift compounds, "template look" returns
- **Skip state verification**: user sees blank page, files support ticket

Pay the 5 minutes now or pay the 5 hours later. The math never changes.

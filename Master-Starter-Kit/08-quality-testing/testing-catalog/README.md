# Testing Catalog

A comprehensive reference of every test type you should know about, organized into 5 tiers by when they run and what they catch. Use the [Test Selection Matrix](./test-selection-matrix.md) to determine which tests a specific feature requires.

## The 5 Tiers

| Tier | When It Runs | What It Catches | Test Count |
|------|-------------|-----------------|------------|
| [Tier 1: Foundation](./tier-1-foundation/) | Every save/commit | Logic bugs, type errors, style violations | 4 types |
| [Tier 2: Integration](./tier-2-integration/) | Before merge | Broken module interactions, API drift, regressions | 5 types |
| [Tier 3: System](./tier-3-system/) | Before deploy | Broken user flows, visual bugs, accessibility, compatibility | 7 types |
| [Tier 4: Specialized](./tier-4-specialized/) | On schedule / before release | Performance, security, chaos, edge cases | 11 types |
| [Tier 5: Planning](./tier-5-planning/) | During kit execution | Shallow specs, missing coverage, orphaned features | 5 types |

**Total: 32 test types across 5 tiers.**

---

## Quick Reference: All 32 Test Types

### Tier 1 — Foundation (every save/commit)
| Test Type | File | One-Line Summary |
|-----------|------|-----------------|
| Unit Tests | [unit-tests.md](./tier-1-foundation/unit-tests.md) | Isolated logic verification for functions, validators, components |
| Type Checking | [type-checking.md](./tier-1-foundation/type-checking.md) | Compile-time type safety across the codebase |
| Linting | [linting.md](./tier-1-foundation/linting.md) | Code style, dead code detection, common mistake prevention |
| Snapshot Tests | [snapshot-tests.md](./tier-1-foundation/snapshot-tests.md) | Detect unintended changes to UI output or data structures |

### Tier 2 — Integration (before merge)
| Test Type | File | One-Line Summary |
|-----------|------|-----------------|
| Integration Tests | [integration-tests.md](./tier-2-integration/integration-tests.md) | Verify modules work together correctly through their interfaces |
| API Contract Tests | [api-contract-tests.md](./tier-2-integration/api-contract-tests.md) | Catch frontend/backend schema drift before it ships |
| Database Tests | [database-tests.md](./tier-2-integration/database-tests.md) | Validate migrations, queries, constraints, and data integrity |
| Component Integration | [component-integration-tests.md](./tier-2-integration/component-integration-tests.md) | Test multi-component compositions (parent-child, context, routing) |
| Regression Tests | [regression-tests.md](./tier-2-integration/regression-tests.md) | Curated suites that catch "it used to work" breakage |

### Tier 3 — System (before deploy)
| Test Type | File | One-Line Summary |
|-----------|------|-----------------|
| E2E Tests | [e2e-tests.md](./tier-3-system/e2e-tests.md) | Full user journey verification through the real application |
| Visual Regression | [visual-regression-tests.md](./tier-3-system/visual-regression-tests.md) | Screenshot comparison to catch unintended UI changes |
| Accessibility Tests | [accessibility-tests.md](./tier-3-system/accessibility-tests.md) | WCAG compliance, screen reader support, keyboard navigation |
| Cross-Browser Tests | [cross-browser-tests.md](./tier-3-system/cross-browser-tests.md) | Browser-specific rendering and JavaScript compatibility |
| Responsive Tests | [responsive-tests.md](./tier-3-system/responsive-tests.md) | Layout verification across viewport sizes and orientations |
| Compatibility Tests | [compatibility-tests.md](./tier-3-system/compatibility-tests.md) | Cross-device, cross-OS, network condition, screen reader testing |
| UAT Tests | [uat-tests.md](./tier-3-system/uat-tests.md) | Does the feature solve the user's actual problem? |

### Tier 4 — Specialized (on schedule / before release)
| Test Type | File | One-Line Summary |
|-----------|------|-----------------|
| Load/Performance | [load-performance-tests.md](./tier-4-specialized/load-performance-tests.md) | Throughput, latency, memory leaks under realistic load |
| Security Tests | [security-tests.md](./tier-4-specialized/security-tests.md) | XSS, injection, auth bypass, CSRF, data exposure |
| Chaos Tests | [chaos-tests.md](./tier-4-specialized/chaos-tests.md) | System behavior when dependencies fail unpredictably |
| Smoke Tests | [smoke-tests.md](./tier-4-specialized/smoke-tests.md) | Critical path validation after every deployment |
| Sanity Tests | [sanity-tests.md](./tier-4-specialized/sanity-tests.md) | Quick core functionality check after hotfixes |
| Mutation Tests | [mutation-tests.md](./tier-4-specialized/mutation-tests.md) | Find weak tests that pass regardless of code correctness |
| Contract Tests (Pact) | [contract-tests-pact.md](./tier-4-specialized/contract-tests-pact.md) | Consumer-driven contract verification for microservices |
| Data Migration Tests | [data-migration-tests.md](./tier-4-specialized/data-migration-tests.md) | Verify existing data survives schema changes correctly |
| i18n Tests | [i18n-tests.md](./tier-4-specialized/i18n-tests.md) | Translation rendering, RTL layouts, locale-specific formats |
| State Recovery Tests | [state-recovery-tests.md](./tier-4-specialized/state-recovery-tests.md) | App behavior after crash, refresh, reconnect, session expiry |
| Rate Limit Tests | [rate-limit-tests.md](./tier-4-specialized/rate-limit-tests.md) | Rate limiting enforcement and graceful 429 handling |

### Tier 5 — Planning Verification (during kit execution)
| Test Type | File | One-Line Summary |
|-----------|------|-----------------|
| Spec Completeness Audit | [spec-completeness-audit.md](./tier-5-planning/spec-completeness-audit.md) | Verify specs have all required fields with real depth |
| Cross-Reference Checks | [cross-reference-checks.md](./tier-5-planning/cross-reference-checks.md) | Every feature has screens, every screen has tasks |
| Depth Scoring | [depth-scoring.md](./tier-5-planning/depth-scoring.md) | Quantitative + qualitative scoring against kit thresholds |
| Coverage Matrix Validation | [coverage-matrix-validation.md](./tier-5-planning/coverage-matrix-validation.md) | No gaps between phases, no orphaned tasks |
| Anti-Pattern Scan | [anti-pattern-scan.md](./tier-5-planning/anti-pattern-scan.md) | Known bad patterns flagged in generated documentation |

---

## How to Use This Catalog

1. **Starting a new feature?** → Go to the [Test Selection Matrix](./test-selection-matrix.md), answer the feature characteristic questions, get your Test Requirements Card
2. **Setting up a project?** → Read through each tier to understand what's available, configure the ones that apply to your stack
3. **Not sure which test type you need?** → Each file has a "When It's Required" section with clear decision criteria
4. **Need a template?** → Every file has a copy-paste starter under "Template"

## Related Sections

- [Enforcement System](../enforcement/) — The gate system that ensures tests actually get run and proven
- [Quality Gates](../quality-gates.md) — The 8-step /verify sequence
- [Feature Completion Checklist](../feature-completion-checklist.md) — 5-layer checklist including Testing layer
- [Test Configs](../test-configs/) — Framework-specific configuration templates

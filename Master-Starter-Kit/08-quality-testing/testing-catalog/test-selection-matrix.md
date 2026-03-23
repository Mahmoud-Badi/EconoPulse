# Test Selection Matrix

Use this matrix to determine exactly which tests a feature requires. Answer the characteristic questions, then read off the required test types. The output is a **Test Requirements Card** — a checklist of tests that must be written and proven before the feature can be marked done.

---

## Step 1: Feature Characteristics Checklist

For the feature you're about to build, check all that apply:

| # | Characteristic | Check |
|---|---------------|-------|
| C1 | Has business logic (calculations, validations, rules) | ☐ |
| C2 | Has a database (schema, queries, migrations) | ☐ |
| C3 | Has an API endpoint (REST, tRPC, GraphQL) | ☐ |
| C4 | Has a user interface (pages, forms, components) | ☐ |
| C5 | Has user input (forms, search, file uploads) | ☐ |
| C6 | Has authentication or authorization | ☐ |
| C7 | Handles money, billing, or financial data | ☐ |
| C8 | Integrates with third-party services | ☐ |
| C9 | Modifies an existing feature or flow | ☐ |
| C10 | Will serve >100 concurrent users | ☐ |
| C11 | Has multi-language or RTL support | ☐ |
| C12 | Runs as a distributed system or microservice | ☐ |
| C13 | Involves data migration or schema changes on existing data | ☐ |
| C14 | Is user-facing (not internal/admin only) | ☐ |
| C15 | Has offline or poor-connectivity scenarios | ☐ |

---

## Step 2: Characteristic → Required Tests Matrix

Read across from each checked characteristic. Every test type marked with **●** is required. Tests marked with **○** are recommended but optional.

| Test Type | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | C10 | C11 | C12 | C13 | C14 | C15 |
|-----------|----|----|----|----|----|----|----|----|----|----|-----|-----|-----|-----|-----|
| **Tier 1** |
| Unit Tests | ● | ● | ● | ● | ● | ● | ● | ● | ● | | | | | | |
| Type Checking | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| Linting | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| Snapshot Tests | | | | ● | | | | | ○ | | | | | | |
| **Tier 2** |
| Integration Tests | | ● | ● | | | ● | ● | ● | ● | | | ● | | | |
| API Contract Tests | | | ● | | | | ● | ● | ○ | | | ● | | | |
| Database Tests | | ● | | | | | ● | | ○ | | | | ● | | |
| Component Integration | | | | ● | ● | | | | ● | | | | | | |
| Regression Tests | | | | | | | ● | | ● | | | | | | |
| **Tier 3** |
| E2E Tests | | | | ● | ● | ● | ● | | | | | | | ● | |
| Visual Regression | | | | ● | | | | | ● | | | | | ● | |
| Accessibility Tests | | | | ● | ● | | | | | | | | | ● | |
| Cross-Browser Tests | | | | ● | | | | | | | | | | ● | |
| Responsive Tests | | | | ● | | | | | | | | | | ● | |
| Compatibility Tests | | | | ● | | | | | | | | | | ● | ● |
| UAT Tests | | | | | | | ● | | | | | | | ● | |
| **Tier 4** |
| Load/Performance | | ● | ● | | | | ● | | | ● | | | | | |
| Security Tests | | | ● | | ● | ● | ● | | | | | | | | |
| Chaos Tests | | | | | | | | ● | | ● | | ● | | | ● |
| Smoke Tests | | | ● | ● | | | ● | | | | | | | ● | |
| Sanity Tests | | | | | | | | | ● | | | | | | |
| Mutation Tests | ● | | | | | | ● | | | | | | | | |
| Contract Tests (Pact) | | | | | | | | ● | | | | ● | | | |
| Data Migration Tests | | ● | | | | | ● | | | | | | ● | | |
| i18n Tests | | | | ● | | | | | | | ● | | | | |
| State Recovery Tests | | | | ● | | | | | | | | | | | ● |
| Rate Limit Tests | | | ● | | | ● | | ● | | ● | | | | | |

---

## Step 3: Generate the Test Requirements Card

Count your required tests (●) from the matrix. This becomes your Test Requirements Card — use the [template](../enforcement/test-requirements-card.template.md) to formalize it.

**Minimum test counts by feature complexity:**

| Complexity | Characteristics Checked | Minimum Required Tests |
|-----------|------------------------|----------------------|
| Simple | 1-3 | 4-8 test types |
| Medium | 4-7 | 8-15 test types |
| Complex | 8-11 | 15-22 test types |
| Critical | 12+ | 22+ test types (nearly all) |

---

## Step 4: Common Feature Type Quick-Reference

For speed, here are pre-built test requirements for common feature archetypes:

### CRUD Screen (list + detail + create + edit + delete)
**Characteristics:** C1, C2, C3, C4, C5, C14
**Required tests:** Unit, Type Checking, Linting, Snapshot, Integration, API Contract, Database, Component Integration, E2E, Visual Regression, Accessibility, Cross-Browser, Responsive, Smoke
**Total: 14 test types**

### Authentication/Authorization Flow
**Characteristics:** C1, C2, C3, C4, C5, C6, C14
**Required tests:** Unit, Type Checking, Linting, Integration, API Contract, Database, Component Integration, E2E, Accessibility, Security, Smoke, Rate Limit
**Total: 12 test types**

### Payment/Billing Feature
**Characteristics:** C1, C2, C3, C4, C5, C6, C7, C8, C14
**Required tests:** Unit, Type Checking, Linting, Integration, API Contract, Database, Component Integration, Regression, E2E, Visual Regression, Accessibility, UAT, Load/Performance, Security, Smoke, Mutation, Contract (Pact), Data Migration
**Total: 18 test types (zero tolerance — money features get maximum coverage)**

### Third-Party Integration
**Characteristics:** C1, C3, C8
**Required tests:** Unit, Type Checking, Linting, Integration, API Contract, Contract (Pact), Chaos, Rate Limit
**Total: 8 test types**

### Existing Feature Modification
**Characteristics:** C9 + whatever the original feature had
**Required tests:** Everything the original had PLUS Regression, Sanity, Visual Regression
**Mandatory addition: regression test covering the specific change**

### Mobile/Offline Feature
**Characteristics:** C4, C14, C15
**Required tests:** Unit, Type Checking, Linting, E2E, Compatibility, State Recovery, Smoke
**Total: 7 test types**

### Report/Dashboard (read-only, data-heavy)
**Characteristics:** C1, C2, C3, C4, C10, C14
**Required tests:** Unit, Type Checking, Linting, Integration, Database, E2E, Visual Regression, Accessibility, Responsive, Load/Performance, Smoke
**Total: 11 test types**

---

## Rules

1. **Type Checking and Linting are always required.** No exceptions, no features exempt.
2. **Money features get maximum coverage.** If the feature handles financial data, billing, or payments — apply every applicable test type. The cost of a billing bug is orders of magnitude higher than the cost of testing.
3. **Modifications inherit the original's requirements.** Changing an existing feature means you need all the tests the original had, plus regression and sanity tests.
4. **When in doubt, include it.** The cost of an unnecessary test is minutes. The cost of a missing test is hours to days of debugging in production.
5. **The matrix is the minimum, not the maximum.** Teams can always add more test types. They cannot remove required ones without documented justification in the Test Requirements Card.

# Per-Service Tribunal Scoring System

## Overview

Every service audit produces two scores and a delta. This scoring system provides an objective, evidence-based measure of service health and hub accuracy.

---

## Score Dimensions

### Hub Score (0-10)

How accurate was the hub file BEFORE the audit? Measures documentation quality.

| Score | Meaning | Criteria |
|-------|---------|----------|
| 9-10 | Excellent | All sections accurate, counts match code, no phantom entries |
| 7-8 | Good | Minor inaccuracies (1-3 fields wrong), mostly reflects reality |
| 5-6 | Fair | Multiple sections inaccurate, significant gaps in coverage |
| 3-4 | Poor | Major sections wrong, stub/placeholder content, misleading |
| 1-2 | Critical | Hub actively misleads, most data is wrong or fabricated |
| 0 | Empty | Hub is a stub with no real content |

### Verified Score (0-10)

How healthy is the service AFTER thorough code inspection? Measures implementation quality.

| Score | Meaning | Criteria |
|-------|---------|----------|
| 9-10 | Production-ready | Full CRUD, auth, tests, error handling, no critical gaps |
| 7-8 | Near-ready | Core functionality complete, minor gaps (test coverage, edge cases) |
| 5-6 | Partial | Core CRUD works but significant gaps (security, tests, states) |
| 3-4 | Incomplete | Basic scaffolding exists, major features missing or broken |
| 1-2 | Stub | Placeholder code only, no real business logic |
| 0 | Not started | No code exists for this service |

### Delta (Verified - Hub)

The gap between what the hub claims and what actually exists.

| Delta | Meaning | Action |
|-------|---------|--------|
| +3 or more | Hub severely understates reality | Hub needs major upgrade — code is better than docs say |
| +1 to +2 | Hub slightly understates | Update hub to reflect actual progress |
| 0 | Hub is accurate | Ideal state — hub reflects reality |
| -1 to -2 | Hub slightly overstates | Fix hub claims, add missing implementations to backlog |
| -3 or worse | Hub severely overstates | STOP-SHIP risk — hub is misleading about readiness |

---

## Scoring Rubric (Detailed)

### Verified Score Breakdown

| Dimension | Weight | 10/10 | 7/10 | 4/10 | 1/10 |
|-----------|--------|-------|------|------|------|
| **Functionality** | 30% | All CRUD + business rules implemented | Core CRUD works, some rules missing | Basic create/read only | Stubs/placeholders only |
| **Data Integrity** | 20% | All validations, constraints, relations correct | Most validations present, minor gaps | Basic DTOs, missing constraints | No validation, raw data pass-through |
| **UI/UX** | 20% | All 4 states (loading/empty/error/populated), responsive | 3/4 states, mostly responsive | 1-2 states, desktop only | No state handling, broken layout |
| **State Management** | 15% | Proper cache invalidation, optimistic updates, error recovery | Basic React Query/state, some cache issues | Manual state, no cache strategy | No state management, prop drilling |
| **Accessibility** | 10% | ARIA labels, keyboard nav, screen reader tested | Some ARIA labels, basic keyboard support | Minimal a11y, some semantic HTML | No a11y consideration |
| **Code Quality** | 5% | TypeScript strict, no lint errors, clean architecture | Minor type issues, consistent patterns | Some `any` types, inconsistent patterns | No types, spaghetti code |

### Hub Score Breakdown

| Section | Weight | Accurate | Partially Accurate | Inaccurate |
|---------|--------|----------|-------------------|------------|
| Status Box | 15% | All fields match code | 1-2 fields wrong | 3+ fields wrong |
| Endpoints | 20% | All listed, correct status | Missing 1-3 endpoints | Missing 5+ or phantom endpoints |
| Screens | 15% | All routes, correct quality scores | 1-2 routes wrong | Major routes missing or phantom |
| Components | 10% | Count matches, all listed | Count off by 1-3 | Count off by 5+ |
| Data Model | 15% | All models, fields, relations correct | 1-3 field errors | Phantom models or major errors |
| Tests | 10% | Correct count, correct quality tier | Count off, quality tier wrong | "No tests" when tests exist |
| Business Rules | 10% | All rules documented and correct | Missing 1-2 rules | Rules don't match implementation |
| Dependencies | 5% | All deps listed | Missing 1-2 deps | Major deps missing |

---

## Verdict Criteria

| Verdict | When to Use | Required Score |
|---------|-------------|---------------|
| **AFFIRM** | Hub is accurate AND service is healthy | Hub ≥ 8, Verified ≥ 8, Delta ≤ ±1 |
| **MODIFY** | Hub needs corrections OR service needs work | Any score below threshold |
| **REVERSE** | Hub is fundamentally wrong, needs complete rewrite | Hub ≤ 3 OR Delta ≤ -5 |
| **DEFER** | Cannot assess — blocked by external dependency | N/A |

---

## Aggregate Metrics

After auditing all services, compute:

| Metric | Formula | Target |
|--------|---------|--------|
| Mean Hub Score | Σ(hub scores) / service count | ≥ 7.0 |
| Mean Verified Score | Σ(verified scores) / service count | ≥ 6.0 (MVP), ≥ 8.0 (Production) |
| Mean Delta | Σ(deltas) / service count | 0 ± 1 |
| MODIFY Rate | MODIFY verdicts / total verdicts | < 30% (healthy), > 70% (needs doc overhaul) |
| Worst Delta | min(all deltas) | > -5 |
| Best Delta | max(all deltas) | < +5 (if too high, hubs are stale) |

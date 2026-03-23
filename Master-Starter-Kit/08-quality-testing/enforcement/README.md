# Enforcement System — If You Can't Show It, It Didn't Happen

## The Core Problem

Developers and AI agents claim "done" without proof. "Tests pass" means nothing unless you can see the test output. "The UI looks good" means nothing unless there are screenshots at every breakpoint. "Security is handled" means nothing unless there is a scan report with zero critical findings. The gap between "I did it" and "here is the evidence I did it" is where bugs, regressions, and quality debt hide.

This enforcement system closes that gap. Every claim of quality requires proof — not assertions, not promises, not "trust me." Literal, verifiable evidence.

---

## The "Show Me" Rule

The single principle behind this entire system:

> **Every claim of "tests pass" must include actual output — console logs, screenshots, reports. Not "all tests pass" but the literal evidence.**

Examples of what counts and what does not:

| Claim | Not Proof | Proof |
|-------|-----------|-------|
| "Unit tests pass" | "I ran the tests and they all pass" | Console output showing `42 passed, 0 failed` with test names visible |
| "The UI is responsive" | "I checked it on mobile" | Screenshots at 375px, 768px, and 1440px for every page |
| "Security scan is clean" | "I ran npm audit" | `npm audit` output showing `0 vulnerabilities` |
| "Performance is good" | "The page loads fast" | Lighthouse report showing Performance score with specific metrics |
| "Accessibility passes" | "I used semantic HTML" | axe-core scan output showing `0 critical, 0 serious violations` |
| "Coverage meets thresholds" | "Coverage is above 80%" | `coverage-summary.json` showing exact percentages per category |

---

## The 3 Enforcement Layers

The enforcement system operates at three levels, each building on the previous:

### Layer 1: Test Selection Matrix (Before Coding)

**When:** Before a single line of code is written for a feature.
**What:** Determines which test types are required based on the feature's characteristics.
**How:** Developer answers 15 characteristic questions (C1-C15), the matrix outputs required test types, and these are recorded on a **Test Requirements Card**.
**File:** [Test Selection Matrix](../testing-catalog/test-selection-matrix.md)
**Template:** [Test Requirements Card](./test-requirements-card.template.md)

The Test Requirements Card is the contract. It lists every test type that must be written, and every one of those test types must eventually produce a proof artifact. No card = no development starts.

### Layer 2: Proof Artifact Requirements (During/After Coding)

**When:** As tests are written and run during development.
**What:** Defines exactly what constitutes acceptable proof for each of the ~28 test types.
**How:** Each test type has a specific proof format. "Test passed" is never sufficient — the format specifies what output is required, where to store it, and what does not count.
**File:** [Proof Artifacts](./proof-artifacts.md)

The proof artifact file is the reference. When a developer finishes a test type, they check this file to see exactly what evidence they need to capture. Generic output ("all tests pass") is explicitly listed as unacceptable for every test type.

### Layer 3: Verification Checkpoints (Gates That Block Progress)

**When:** At three escalating levels — feature completion, phase completion, and release.
**What:** Gates that block forward progress until all required evidence is collected and verified.
**How:** Checklists that must be fully satisfied. Partial completion does not pass.

| Gate | Scope | Blocks Until | File |
|------|-------|-------------|------|
| **Feature Gate** | Single feature | All test types on the card have proof artifacts | [Feature Gate](./feature-gate.md) |
| **Phase Gate** | All features in a dev phase | All feature gates pass + cross-feature regression + coverage | [Phase Gate](./phase-gate.md) |
| **Release Gate** | Entire release | Full E2E, performance, security, UAT, staging verification | [Release Gate](./release-gate.md) |

---

## How This Integrates with Existing Systems

The enforcement system does not replace the existing quality infrastructure — it adds the accountability layer on top:

| Existing System | What It Does | What Enforcement Adds |
|----------------|-------------|----------------------|
| [Quality Gates](../quality-gates.md) (8-step /verify) | Defines the 8 verification steps per feature | The Feature Gate requires proof that all 8 steps actually ran and passed |
| [Test Selection Matrix](../testing-catalog/test-selection-matrix.md) | Maps feature characteristics to test types | The Test Requirements Card formalizes the matrix output as a binding contract |
| [Feature Completion Checklist](../feature-completion-checklist.md) | 6-layer checklist for feature done-ness | The Feature Gate adds a Testing layer enforcement requirement on top of the existing layers |
| [Testing Catalog](../testing-catalog/) (32 test types) | Describes what each test type is and how to set it up | Proof Artifacts defines what evidence each test type must produce |

The enforcement system is the **accountability layer** that ensures these existing systems are actually followed, not just acknowledged.

---

## Workflow Summary

```
Feature Planning
    │
    ▼
┌─────────────────────────────────┐
│  Layer 1: Test Selection Matrix │
│  → Test Requirements Card       │
│  → Required test types defined  │
└──────────────┬──────────────────┘
               │
               ▼
         Development
               │
               ▼
┌─────────────────────────────────┐
│  Layer 2: Proof Artifacts       │
│  → Tests written and run        │
│  → Evidence captured per type   │
│  → Artifacts stored and linked  │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Layer 3: Verification Gates    │
│  → Feature Gate (per feature)   │
│  → Phase Gate (per dev phase)   │
│  → Release Gate (per release)   │
└─────────────────────────────────┘
```

---

## Files in This Directory

| File | Purpose |
|------|---------|
| [test-requirements-card.template.md](./test-requirements-card.template.md) | Template filled out per-feature before coding starts |
| [proof-artifacts.md](./proof-artifacts.md) | What counts as evidence for each of the ~28 test types |
| [feature-gate.md](./feature-gate.md) | Checkpoint before a feature can be marked "done" |
| [phase-gate.md](./phase-gate.md) | Checkpoint before moving to the next development phase |
| [release-gate.md](./release-gate.md) | Final checkpoint before deploying to production |

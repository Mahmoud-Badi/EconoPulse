# Quality Scorecard

**Purpose:** Aggregate the 6 audit dimension scores into a single scorecard. Identifies critical blockers, calculates a composite score, and produces a triage priority that drives the Enhancement Backlog.

**Output:** `dev_docs/audit/quality-scorecard.md`

**Path:** Enhance only

**Prerequisite:** All 6 dimension audit reports in `dev_docs/audit/enhance-audit-*.md` must exist and be complete.

---

## When to Run

Run this as Step E2 immediately after all 6 audit dimensions complete. Do not proceed to Step E3 (Gap Analyzer) until this scorecard is written and reviewed.

---

## Scoring Protocol

### Step 1 — Extract Scores

Read each dimension report and extract:
1. The dimension score (0-10)
2. The recommendation list (P0, P1, P2, P3 items)
3. The protect list candidates

Do not re-score. Use the scores from the dimension reports as authoritative.

### Step 2 — Apply Thresholds

| Score | Label | Action Required |
|-------|-------|----------------|
| 9-10 | Excellent | Document and protect. No action needed. |
| 7-8 | Solid | Minor gaps. Enhancement backlog items only. |
| 5-6 | Needs Work | Systematic improvement plan required. |
| ≤4 | Critical | Must fix before adding new features or scaling. |

Any dimension scoring ≤4 is a **blocker**. Blockers must appear at the top of the Enhancement Backlog.

### Step 3 — Calculate Composite Score

Weighted formula:

| Dimension | Weight | Rationale |
|-----------|--------|-----------|
| Architecture & Code Quality | 25% | Foundation — everything else depends on it |
| Security & Compliance | 25% | Non-negotiable — can't ship insecure apps |
| Testing Coverage | 20% | Determines ability to safely change anything |
| UX & Screen Coverage | 15% | User-facing quality signal |
| Performance & Scalability | 10% | Matters more at scale, lower weight at early stage |
| Documentation & Ops | 5% | Important but improvable quickly |

**Formula:**
```
Composite = (Architecture × 0.25) + (Security × 0.25) + (Testing × 0.20) +
            (UX × 0.15) + (Performance × 0.10) + (Docs × 0.05)
```

### Step 4 — Identify Top 3 Blockers

From all dimension recommendations, identify the top 3 findings that:
- Are P0 or P1 severity
- Score ≤4 in their dimension, OR
- Would cause data loss, security breach, or production outage if left unaddressed

These become the "Critical Blockers" section of the scorecard. No new feature work should begin until blockers are resolved.

---

## Scorecard Output Format

Write to `dev_docs/audit/quality-scorecard.md`:

```markdown
# Quality Scorecard — {App Name}

> **Date:** {date}
> **Audit dimensions completed:** 6/6
> **Composite score:** {X.X}/10

---

## Composite Score Breakdown

| Dimension | Score | Weight | Weighted | Label |
|-----------|-------|--------|----------|-------|
| Architecture & Code Quality | {X}/10 | 25% | {X×0.25} | {Excellent/Solid/Needs Work/Critical} |
| Security & Compliance | {X}/10 | 25% | {X×0.25} | {label} |
| Testing Coverage | {X}/10 | 20% | {X×0.20} | {label} |
| UX & Screen Coverage | {X}/10 | 15% | {X×0.15} | {label} |
| Performance & Scalability | {X}/10 | 10% | {X×0.10} | {label} |
| Documentation & Ops | {X}/10 | 5% | {X×0.05} | {label} |
| **Composite** | | 100% | **{X.X}/10** | **{Overall label}** |

---

## Overall Assessment

{2-3 sentences: what the composite score means for this specific app. Not generic — reference what you actually found.}

---

## Critical Blockers (Must Fix Before New Feature Work)

These are non-negotiable. Address these before planning any new capabilities.

### Blocker 1: {Name}
- **Dimension:** {E1-A through E1-F}
- **Severity:** P0 / P1
- **Finding:** {Specific issue with file references}
- **Risk if unaddressed:** {What breaks, gets hacked, or causes data loss}
- **Estimated fix effort:** {hours / days / weeks}

### Blocker 2: {Name}
- **Dimension:** {E1-A through E1-F}
- **Severity:** P0 / P1
- **Finding:** {Specific issue with file references}
- **Risk if unaddressed:** {What breaks, gets hacked, or causes data loss}
- **Estimated fix effort:** {hours / days / weeks}

### Blocker 3: {Name}
- **Dimension:** {E1-A through E1-F}
- **Severity:** P0 / P1
- **Finding:** {Specific issue with file references}
- **Risk if unaddressed:** {What breaks, gets hacked, or causes data loss}
- **Estimated fix effort:** {hours / days / weeks}

---

## Strengths (Protect These)

High-quality areas that should not be disrupted by enhancement work:

| Area | Score | What works well |
|------|-------|----------------|
| {dimension or specific module} | {score} | {what's good} |

---

## Full Protect List

Aggregate all protect-list candidates from dimension reports:

| File | Dimension | Score | Reason |
|------|-----------|-------|--------|
| `{path}` | {dimension} | {8+}/10 | {why to protect} |

---

## Dimension-by-Dimension Triage

For each dimension, one-line triage status:

| Dimension | Score | Triage |
|-----------|-------|--------|
| Architecture & Code Quality | {X}/10 | {one-line action or "No action needed"} |
| Security & Compliance | {X}/10 | {one-line action or "No action needed"} |
| Testing Coverage | {X}/10 | {one-line action or "No action needed"} |
| UX & Screen Coverage | {X}/10 | {one-line action or "No action needed"} |
| Performance & Scalability | {X}/10 | {one-line action or "No action needed"} |
| Documentation & Ops | {X}/10 | {one-line action or "No action needed"} |

---

## Recommended Enhancement Path

Based on the composite score and blocker analysis:

**Path:** {Targeted Hardening / Comprehensive Enhancement / Full Rebuild Considerations}

- **Targeted Hardening** (composite ≥7): Fix blockers, then proceed directly to gap analysis and full planning. Most work is additive.
- **Comprehensive Enhancement** (composite 5-6): Fix blockers, refactor weak dimensions, then full planning. Expect significant rework.
- **Full Rebuild Considerations** (composite ≤4): Multiple critical-scoring dimensions suggest the foundation may need replacement. Recommend architectural review before planning new features.

---

## Next Step

Proceed to **Step E3: Gap Analyzer** — `37-enhance/GAP-ANALYZER.md`
```

---

## Quality Rules

1. **Do not re-audit in this step.** Only aggregate from the 6 dimension reports. If a score seems wrong, go back and update the dimension report — don't override it here.
2. **Blockers must be specific.** Every blocker must name a file, an endpoint, or a measurable gap. "Security is weak" is not a blocker.
3. **Protect list is additive.** Combine protect candidates from all 6 dimension reports — don't drop any.
4. **Composite score is a compass, not a grade.** Communicate what it means for THIS app's specific situation.
5. **Announce the gate.** After writing the scorecard, announce: *"Quality Scorecard complete. Composite score: {X}/10. {N} critical blockers identified. Proceeding to Step E3: Gap Analyzer."*

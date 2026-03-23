# Enhancement Backlog

**Purpose:** Convert audit findings and gap analysis results into a prioritized, actionable backlog organized into three time horizons. This is the primary deliverable of the Enhance path — it tells you exactly what to do, in what order, and roughly how long each item takes.

**Output:** `dev_docs/enhancement-backlog.md`

**Path:** Enhance only

**Prerequisites:**
- `dev_docs/audit/quality-scorecard.md` — composite score and blockers
- `dev_docs/audit/gap-analysis.md` — gap inventory

---

## When to Run

Run this as Step E4 immediately after the Gap Analyzer completes. This document becomes the master prioritized backlog that drives all subsequent enhancement work.

---

## Think-Then-Generate (TTG) Protocol

Before writing the backlog, answer these questions in the conversation:

1. How many total items need to go into the backlog? (count audit P0+P1 findings + critical+high gaps)
2. What are the top 3 items that, if done, would have the highest user impact?
3. What are the top 3 items that, if skipped, would cause the most serious risk (security breach, data loss, production outage)?
4. Are there any items that are dependencies for other items? (e.g., fix auth before adding multi-user features)
5. Are there any items that can be done in parallel vs. must be sequential?
6. What is the team's capacity? (from intake — solo dev / small team / larger team)

---

## Prioritization Algorithm

For each item from the audit + gap analysis, score it on 3 factors:

| Factor | Description | Score |
|--------|-------------|-------|
| **Impact** | How much does fixing this improve the app for users? | 1-5 |
| **Risk** | How bad is it if this stays unfixed? (security, reliability, UX) | 1-5 |
| **Effort** | How hard is this to fix? (inverted — easy = higher score) | 1-5 |

**Priority Score = Impact + Risk + Effort**
- 12-15: Quick Win candidates (high impact, high risk, or low effort)
- 8-11: Medium-term items
- ≤7: Long-term / nice to have

Override rule: **Any P0 security or reliability issue is automatically a Tier 1 blocker regardless of score.**

---

## The Three Tiers

### Tier 1 — Critical Blockers & Quick Wins (≤1 week each)

**What goes here:**
- All P0 audit findings (blockers from the Quality Scorecard)
- All Critical-rated gaps
- High-impact items that are also low effort (score ≥12)

These must be addressed before planning new features.

### Tier 2 — Core Enhancements (1-4 weeks each)

**What goes here:**
- P1 audit findings not already in Tier 1
- High-severity gaps
- Medium-complexity improvements that meaningfully improve UX, performance, or maintainability
- Infrastructure and DevOps gaps

### Tier 3 — Depth & Polish (4+ weeks each or long-term planning)

**What goes here:**
- P2 and P3 audit findings
- Medium-severity gaps
- Major refactors, new capabilities, platform expansion
- Items that require significant architectural decisions

---

## Backlog Item Format

Each item follows this template:

```markdown
### [TIER-N] {Short Title}

- **Category:** {Bug Fix / Gap: Missing Feature / Gap: Missing Infra / Quality Improvement / Refactor / Documentation}
- **Source:** {Audit: E1-A Security finding / Gap: Services - Billing / Scorecard Blocker #2}
- **Effort:** {XS (<4h) / S (1-2d) / M (3-5d) / L (1-2w) / XL (2-4w)}
- **Impact:** {description of what improves for users or the team}
- **Risk if skipped:** {what breaks, who gets hurt, what technical debt compounds}
- **Dependencies:** {what must be done before this / what this unlocks}
- **Acceptance criteria:**
  - {specific, testable outcome 1}
  - {specific, testable outcome 2}
  - {specific, testable outcome 3}
```

---

## Enhancement Backlog Report Format

Write to `dev_docs/enhancement-backlog.md`:

```markdown
# Enhancement Backlog — {App Name}

> **Date:** {date}
> **Composite score at intake:** {X.X}/10
> **Total items:** {N} ({N} Tier 1, {N} Tier 2, {N} Tier 3)
> **Estimated total effort:** {XS through XL aggregate}

---

## How to Use This Backlog

1. **Tier 1 first.** Do not start new features until all Tier 1 items are resolved.
2. **Dependencies govern order.** Within each tier, complete items that other items depend on first.
3. **Estimate re-assessment.** After completing Tier 1, re-assess Tier 2 priorities — the app landscape changes.
4. **This backlog feeds the kit's standard planning.** After completing Tier 1, return to the Enhance path and run Steps 5-16 to build out the full planning overlay.

---

## Tier 1 — Critical Blockers & Quick Wins

> These must be done before planning new features. Estimated: {N} items, ~{X} weeks.

### [T1-01] {Title}
{Full item template}

### [T1-02] {Title}
{Full item template}

{...continue for all Tier 1 items}

---

## Tier 2 — Core Enhancements

> Systematic improvements. Do after Tier 1 completes. Estimated: {N} items, ~{X} weeks.

### [T2-01] {Title}
{Full item template}

{...continue for all Tier 2 items}

---

## Tier 3 — Depth & Polish

> Long-term improvements and new capabilities. Plan these after Tier 1+2 complete. Estimated: {N} items, ~{X} weeks.

### [T3-01] {Title}
{Full item template}

{...continue for all Tier 3 items}

---

## Dependency Map

Items that must be done before others:

```
{T1-01} → {T1-03} (fix auth before adding RBAC)
{T1-02} → {T2-04} (fix DB schema before adding reporting)
{T2-01} → {T3-02} (add test infrastructure before writing tests for new features)
```

---

## Parallel Work Streams

Items that can be worked on simultaneously by different team members:

**Stream A:** {T1-01}, {T1-04}, {T2-02}
**Stream B:** {T1-02}, {T1-05}, {T2-01}
**Stream C:** {T1-03}, {T2-03} (documentation and testing)

---

## Enhancement Completion Criteria

The enhancement phase is complete when:
- [ ] All Tier 1 items are resolved and verified with proof artifacts
- [ ] Composite score re-audit shows ≥7/10
- [ ] No P0 audit findings remain open
- [ ] No Critical gaps remain open
- [ ] The kit's standard planning (Steps 5-16) has been run on the enhanced codebase

---

## Next Step

Proceed to **Step 2: AI Config** (`Master-Starter-Kit/ORCHESTRATOR.md` Step 2), then continue with Steps 5-16 using the **Enhance Plan Overlay** (`37-enhance/ENHANCE-PLAN-OVERLAY.md`) to adapt each step for existing-codebase context.
```

---

## Quality Rules

1. **Every item needs acceptance criteria.** "Fix the auth bug" has no definition of done. "Auth tokens expire after 24h and force re-login, tested with Jest" does.
2. **Effort estimates are required.** Even rough T-shirt sizes (XS/S/M/L/XL) are better than no estimate. They let the team plan sprints.
3. **Source every item.** Each backlog item must trace to either an audit finding (dimension + severity) or a gap analysis entry. No mystery items.
4. **Dependency map is mandatory.** One missing dependency can derail a sprint. Map them before handing this to a team.
5. **Tier 1 must be exhaustive.** Missing a P0 item from Tier 1 defeats the purpose of the audit.
6. **Announce completion.** After writing the backlog, announce: *"Enhancement Backlog complete. {N} items: {N} Tier 1 (blockers/quick wins), {N} Tier 2 (core enhancements), {N} Tier 3 (depth & polish). Estimated total effort: {X} weeks. Proceeding to Step 2: AI Config."*

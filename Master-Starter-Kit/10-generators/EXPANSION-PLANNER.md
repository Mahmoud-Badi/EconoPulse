# Expansion Planner — Generator Prompt

> **Used by:** Step 33 (Expansion Planning)
> **Input:** Deep dive nice-to-haves, tribunal research, project brief, features list
> **Output:** Expansion plan, vertical analysis, growth strategy in `dev_docs/hardening/expansion/`

---

## Generator Instructions

You are generating a comprehensive expansion plan for the project. This is the final planning step — after this, the project is ready to start coding. Your job is to look beyond MVP and map out how the product can grow.

### Before Starting

1. Read `dev_docs/hardening/deep-dive/nice-to-haves.md` — features identified but deferred from MVP
2. Read `dev_docs/tribunal/VERDICT.md` — competitive landscape and market insights
3. Read `dev_docs/project-brief.md` — core product identity and positioning
4. Read `dev_docs/features-list.md` — current feature scope
5. Read `dev_docs/project-phases.md` — current development timeline
6. If marketing docs exist, read `MARKETING-HANDOFF.md` — growth channels already planned
7. Read `34-hardening/expansion-planning.template.md` — output template
8. Create the output directory: `dev_docs/hardening/expansion/`

---

### Step 1: Post-MVP Feature Roadmap

**Process:**

1. Collect all nice-to-have features from `nice-to-haves.md`
2. Add features from tribunal research that were marked as "future" or "post-MVP"
3. For each feature, assess:
   - **Impact:** How much does this improve the product? (1-5)
   - **Effort:** How much work to build? (1-5, where 5 = most work)
   - **Dependencies:** What must exist first?
   - **Revenue potential:** Does this enable new revenue or reduce churn?

4. Prioritize using Impact/Effort matrix:
   - **Quick wins** (high impact, low effort) → Quarter 1
   - **Strategic bets** (high impact, high effort) → Quarter 2-3
   - **Easy adds** (low impact, low effort) → Quarter 2 (when bandwidth allows)
   - **Moonshots** (low impact, high effort) → Quarter 4 or backlog

5. Organize into quarterly roadmap in the template

**Output:** Fill the "Post-MVP Feature Roadmap" section of `expansion-plan.md`

---

### Step 2: Vertical & Market Analysis

**Process:**

1. From the project brief, identify the primary market/vertical
2. Identify 3-5 adjacent verticals where the product could be adapted:
   - Same technology, different industry
   - Same industry, different segment (SMB → Enterprise, B2C → B2B)
   - Same problem, different geography

3. For each vertical, assess:
   - **Market size:** Is it worth pursuing?
   - **Fit score (1-10):** How much of the existing product can be reused?
   - **Adaptation needed:** What changes are required? (features, compliance, branding)
   - **Go-to-market:** How would you enter this vertical?

4. Rank verticals by Fit Score × Market Size

**Output:** `dev_docs/hardening/expansion/vertical-analysis.md`

```markdown
# Vertical Analysis — {{PROJECT_NAME}}

## Current Market
- Primary vertical: {VERTICAL}
- Current positioning: {POSITIONING}

## Adjacent Verticals

### 1. {VERTICAL_NAME}
- **Market size:** {SIZE}
- **Fit score:** {SCORE}/10
- **Why it fits:** {RATIONALE}
- **Adaptation needed:** {CHANGES}
- **Go-to-market:** {GTM_STRATEGY}
- **Timeline:** {WHEN}

[Repeat for each vertical]

## Recommendation
Best expansion opportunity: {TOP_VERTICAL}
Reason: {WHY}
Prerequisites: {WHAT_MUST_HAPPEN_FIRST}
```

---

### Step 3: Growth Strategy

**Process:**

1. **Analyze organic growth potential:**
   - Can users invite others? (referral loops)
   - Does usage generate content that attracts new users? (content flywheel)
   - Does the product improve with more users? (network effects)
   - What search queries does the product naturally answer? (SEO)

2. **Analyze paid growth potential:**
   - What is the target CAC? (from intake question G2)
   - What channels are most efficient for this audience?
   - What is the expected payback period?

3. **Analyze enterprise/upmarket potential:**
   - What enterprise features would unlock larger deals?
   - What compliance certifications are needed?
   - What integration partnerships would drive distribution?

4. **Analyze platform/ecosystem potential:**
   - Can the product become a platform? (API, SDK, marketplace)
   - Can third parties build on it? (plugins, extensions, integrations)
   - Is white-labeling viable?

5. **Analyze competitive moat:**
   - What defensibility does the product build over time?
   - What switching costs exist for users?
   - What data advantages accumulate?

**Output:** `dev_docs/hardening/expansion/growth-strategy.md`

```markdown
# Growth Strategy — {{PROJECT_NAME}}

## Organic Growth
[Strategies with specific tactics]

## Paid Growth
[Channel recommendations with CAC targets]

## Enterprise Expansion
[Features and certifications needed]

## Platform & Ecosystem
[API, marketplace, partnership opportunities]

## Competitive Moat
[Short-term, medium-term, long-term defensibility]

## Recommended Growth Sequence
1. [First growth lever to pull]
2. [Second growth lever]
3. [Third growth lever]

## Metrics to Track
| Metric | Target (Month 3) | Target (Month 6) | Target (Month 12) |
|--------|-----------------|-----------------|-------------------|
| | | | |
```

---

### Final Assembly

1. Fill `34-hardening/expansion-planning.template.md` with all findings
2. Save as `dev_docs/hardening/expansion/expansion-plan.md`
3. Save vertical analysis as `dev_docs/hardening/expansion/vertical-analysis.md`
4. Save growth strategy as `dev_docs/hardening/expansion/growth-strategy.md`

Present summary:
```
EXPANSION PLAN COMPLETE

Post-MVP features identified: {N}
New verticals analyzed: {M}
Growth strategies defined: {K}
Recommended first expansion: {FIRST_MOVE}

Ready to start coding: Run /kickoff
```

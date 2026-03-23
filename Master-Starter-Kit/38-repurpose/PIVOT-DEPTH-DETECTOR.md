# Pivot Depth Detector

**Purpose:** Score the pivot across 5 dimensions to classify its depth as Shallow, Medium, or Deep. The pivot depth classification is a hard gate — it determines which path the Repurpose workflow takes for the rest of the run.

**Output:** `dev_docs/repurpose/pivot-depth-score.md`

**Path:** Repurpose only

**Prerequisite:** `dev_docs/intake/repurpose-intake.md` must be complete and confirmed.

---

## When to Run

Run this as Step R1 immediately after the Repurpose Intake is confirmed. Do not begin feature planning until the pivot depth is classified. The depth classification cannot be assumed or skipped.

---

## The 5 Scoring Dimensions

Score each dimension 0-2 using the rubric below. Maximum possible score: 10.

---

### Dimension 1 — Workflow Similarity

**Question:** How similar are the core user workflows between the source vertical and the target vertical?

| Score | Criteria |
|-------|----------|
| 0 | Same core user actions — the job-to-be-done is identical. Only terminology and branding differ. (Example: project management for designers → project management for copywriters) |
| 1 | Adapted user actions — the workflow is recognizable but has meaningful differences in sequence, data captured, or outcomes. (Example: booking platform for salons → booking platform for veterinary clinics) |
| 2 | Fundamentally different workflows — users in the new vertical do things in a different order, with different constraints, different stakeholders, or a different mental model. (Example: event management platform → patient appointment platform with clinical documentation requirements) |

**Your score:** ___

**Evidence from intake:** {cite specific workflow differences from the intake document}

---

### Dimension 2 — Data Model Delta

**Question:** How different is the core data model required for the new vertical vs. the source app?

| Score | Criteria |
|-------|----------|
| 0 | Same entities — new vertical's data is structurally the same. A few field renames may be needed but no structural changes. |
| 1 | Extended entities — source app entities remain but need new fields, new relations, or new entity types added. (Example: add "clinical_notes" to Appointment entity; add "Treatment" entity) |
| 2 | New core entities — the new vertical's primary data structures are different enough that new tables/collections are required and some source entities may be deprecated. (Example: source app has Projects and Tasks; new vertical needs Cases, Hearings, and Evidence) |

**Your score:** ___

**Evidence from intake:** {cite core entities in source app vs. what new vertical needs}

---

### Dimension 3 — Feature Change Ratio

**Question:** What percentage of the source app's features need to change (be added, replaced, or removed) for the new vertical?

| Score | Criteria |
|-------|----------|
| 0 | <20% of features change. Primarily terminology updates, branding, and configuration. Core features all transfer. |
| 1 | 20-50% of features change. Some features transfer as-is, some need adaptation, some new features required. |
| 2 | >50% of features change. Most features need significant adaptation or replacement. New vertical-specific features outnumber transferred features. |

**Calculation method:**
1. List all major features in the source app (from intake)
2. For each feature, classify: Carry Over / Adapt / Replace / New Required
3. Calculate: (Adapt + Replace + New Required) / Total as a percentage

| Feature | Source Status | New Vertical Status | Change? |
|---------|--------------|---------------------|---------|
| {feature} | Exists | Carry Over / Adapt / Replace / Remove / New | Yes / No |

**Percentage of features changing:** ____%

**Your score:** ___

---

### Dimension 4 — Compliance Requirements

**Question:** How much do compliance requirements increase from source app to new vertical?

| Score | Criteria |
|-------|----------|
| 0 | No new compliance requirements. New vertical has the same or lighter regulatory burden than the source app. |
| 1 | Soft compliance additions. New vertical has best-practice requirements (data residency preferences, audit logging, role-based permissions) but no hard regulatory mandates. |
| 2 | Hard regulatory requirements. New vertical requires certified compliance (HIPAA, GDPR with DPA requirements, PCI DSS, SOC 2, FCA authorization, FERPA, etc.) that the source app does not currently meet. |

**Your score:** ___

**Evidence from intake:** {cite specific compliance requirements identified}

---

### Dimension 5 — UX & Terminology Delta

**Question:** How different does the user-facing experience need to be for the new vertical?

| Score | Criteria |
|-------|----------|
| 0 | Same UX, terminology update only. The same screens, same flows, same layout — but with different labels, copy, and branding. A localization-style change. |
| 1 | Adapted UX. Some screens need redesign for vertical-specific workflows. Terminology changes throughout. New domain-specific UI patterns required (e.g., clinical SOAP note format, legal case timeline view). |
| 2 | Full UX redesign for the new vertical. The existing UX doesn't map to how the new vertical works. New navigation model, new primary workflows, new dashboard layout. The app would look and feel fundamentally different. |

**Your score:** ___

**Evidence from intake:** {cite terminology differences and UX workflow differences}

---

## Classification

Sum the 5 dimension scores (maximum: 10):

| Total Score | Classification | Description |
|-------------|---------------|-------------|
| 0-3 | **Shallow — Rebrand + Config Layer** | Same product, new coat of paint. Primarily branding, copy, feature flags, and configuration. Estimated effort: days to weeks. |
| 4-6 | **Medium — Vertical Wrapper** | Same architecture, vertical-specific features. Data model extensions, new screens, new integrations. Estimated effort: weeks to months. |
| 7-10 | **Deep — Product Fork** | Shared core, diverging product lines. Significant data model changes, new workflows, full UX adaptation, possible compliance architecture. Estimated effort: months. |

---

## Output Format

Write to `dev_docs/repurpose/pivot-depth-score.md`:

```markdown
# Pivot Depth Score — {Source App} → {Target Vertical}

> **Date:** {date}
> **Classification:** {Shallow / Medium / Deep}
> **Total score:** {N}/10

---

## Scoring Breakdown

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Workflow Similarity | {0/1/2} | {1-2 sentence justification with evidence from intake} |
| Data Model Delta | {0/1/2} | {1-2 sentence justification} |
| Feature Change Ratio | {0/1/2} | {N}% of features changing — {list the Adapt/Replace/New features} |
| Compliance Requirements | {0/1/2} | {1-2 sentence justification} |
| UX & Terminology Delta | {0/1/2} | {1-2 sentence justification} |
| **Total** | **{N}/10** | **{Classification}** |

---

## Classification: {Shallow / Medium / Deep}

### What this means for the {source app} → {target vertical} pivot:

{2-3 sentences specific to this pivot, not generic. What does this classification mean for the actual work ahead?}

---

## Routing Decision

**This pivot is classified as {Shallow / Medium / Deep}.**

Proceed as follows:

### If Shallow:
→ Step R2: Feature Inheritance Map (quick version — mainly Carry Over and Adapt items)
→ Step R3: Market Fit Analyzer
→ Step R4: Vertical Differentiation Plan (Shallow tier)
→ Steps 29-33: Hardening

### If Medium:
→ Step R2: Feature Inheritance Map (full version)
→ Step R3: Market Fit Analyzer
→ Step R4: Vertical Differentiation Plan (Medium tier)
→ Steps 5-6, 8 (adapted for vertical)
→ Steps 29-33: Hardening

### If Deep:
→ Step R2: Feature Inheritance Map (full version)
→ Step R3: Market Fit Analyzer
→ Step R4: Vertical Differentiation Plan (Deep tier)
→ Step R4-FORK: Fork Architecture (`38-repurpose/FORK-ARCHITECTURE.md`)
→ Steps 5-16 (full kit planning for new vertical product)
→ Steps 29-33: Hardening

---

## Feature Classification Table

| Feature | Source Status | New Vertical Status | Change Category |
|---------|--------------|---------------------|----------------|
| {feature} | Active | Carry Over / Adapt / Replace / Remove | - |
| {new feature} | N/A | New Required | New |
```

---

## Quality Rules

1. **The pivot depth is a hard gate.** Do not route to the next step until the score is calculated and the classification is written. No "I think it's probably Medium" — score it.
2. **Score based on evidence.** Every dimension score must cite specific findings from the intake document. No generic rationale.
3. **The feature classification table drives Step R2.** Be thorough — every major source app feature must appear in the table.
4. **Don't round down to seem easier.** Underestimating pivot depth leads to plans that miss the real work. Score honestly.
5. **Announce the gate.** After writing the score document, announce: *"Pivot classified as {Shallow / Medium / Deep} ({N}/10). Routing to the {Shallow / Medium / Deep} repurpose track. Proceeding to Step R2: Feature Inheritance Map."*

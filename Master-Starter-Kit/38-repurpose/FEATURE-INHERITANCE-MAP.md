# Feature Inheritance Map

**Purpose:** For every feature in the source application, determine exactly what happens to it in the new vertical: carry it over unchanged, adapt it, replace it, deprecate it, or create something new. Defines the shared core boundary and the vertical-specific feature set.

**Output:** `dev_docs/repurpose/feature-inheritance-map.md`

**Path:** Repurpose only

**Prerequisite:** `dev_docs/repurpose/pivot-depth-score.md` must be complete. Use the Feature Classification Table from that document as your starting point.

---

## When to Run

Run this as Step R2 immediately after the Pivot Depth Score is classified. The inheritance map is the technical contract between the source app and the new vertical product.

---

## Feature Classification Definitions

| Status | Definition | Implications |
|--------|-----------|-------------|
| **Carry Over** | Feature works in the new vertical exactly as-is. No code changes needed. | Include in shared core. Zero development cost for this feature. |
| **Adapt** | Feature is relevant but needs changes: terminology, configuration, UI adjustments, or minor logic changes. Core code stays. | Parameterize the source feature. Budget 10-40% of original feature's development time. |
| **Replace** | Feature concept is needed but the existing implementation doesn't fit. Rebuild with the vertical in mind. | New implementation required. Budget 60-100% of original feature's development time. |
| **Deprecate** | Feature is irrelevant or counterproductive in the new vertical. Remove or hide it. | No development cost. Reduces maintenance surface. |
| **New** | Capability required by the new vertical that doesn't exist in the source app at all. | Full development required. Budget as a new feature. |

---

## Think-Then-Generate Protocol

Before writing the inheritance map, answer these questions in the conversation:

1. How many total features are in the source app?
2. What percentage do you estimate will Carry Over vs. Adapt vs. Replace vs. Deprecate?
3. What are the top 5 entirely New features the new vertical requires?
4. What is the single hardest feature to adapt (the one with the most entangled source implementation)?
5. After completing this map, what's the rough development effort estimate: is this a 1-month job, a 3-month job, or a 6+ month job?

---

## Mapping Protocol

### Step 1 — Enumerate Source App Features

List every major feature in the source application. Group by module/area:

```
Auth & Users
  - User signup / login
  - Password reset
  - User profile management
  - Email verification

{Module 2}
  - {Feature}
  - {Feature}

{etc.}
```

### Step 2 — Classify Each Feature

For each feature, determine its status in the new vertical. Use the pivot depth score and intake answers as evidence.

Classification decision rules:
- If the feature name and behavior transfer with only copy/label changes → **Adapt** (not Carry Over — terminology changes are still changes)
- If core data structures are the same but UX must change → **Adapt**
- If the underlying concept is the same but the implementation is entangled with source-specific assumptions → **Replace**
- If the feature serves a workflow that simply doesn't exist in the new vertical → **Deprecate**
- If the new vertical's users would use the feature but it doesn't exist yet → **New**

### Step 3 — Identify the Shared Core

After classifying all features, group Carry Over and Adapt features:
- Features classified **Carry Over** are the shared core — they live in `packages/core/` (or equivalent) with zero vertical-specific code.
- Features classified **Adapt** are near-core — they live in the core with configurable parameters (terminology, validation rules, UI labels) controlled by vertical-specific config.

### Step 4 — Define Vertical Packages

Features classified as **Replace** or **New** are vertical-specific. They live in the vertical's package:
- `packages/{target-vertical}/` for Deep pivots
- Feature-flagged modules for Medium pivots
- Hidden behind config flags for Shallow pivots

### Step 5 — Estimate Effort per Feature

For each non-Carry-Over feature, estimate effort using T-shirt sizes:

| Size | Time |
|------|------|
| XS | < 4 hours |
| S | 1-2 days |
| M | 3-5 days |
| L | 1-2 weeks |
| XL | 2-4 weeks |

---

## Output Format

Write to `dev_docs/repurpose/feature-inheritance-map.md`:

```markdown
# Feature Inheritance Map — {Source App} → {Target Vertical}

> **Date:** {date}
> **Pivot depth:** {Shallow / Medium / Deep} ({N}/10)
> **Total features mapped:** {N}

---

## Summary

| Status | Count | % of Features | Effort |
|--------|-------|--------------|--------|
| Carry Over | {N} | {%} | Zero |
| Adapt | {N} | {%} | {aggregate T-shirt} |
| Replace | {N} | {%} | {aggregate T-shirt} |
| Deprecate | {N} | {%} | Zero |
| New | {N} | {%} | {aggregate T-shirt} |
| **Total** | **{N}** | **100%** | **{total estimate}** |

---

## Shared Core (Carry Over + Adapt)

These features form the foundation of the repurposed product. They live in shared code.

### Carry Over — No Changes

| Feature | Module | Notes |
|---------|--------|-------|
| {feature} | {module/area} | {any caveats} |

### Adapt — Changes Required

| Feature | Module | What Changes | Effort |
|---------|--------|-------------|--------|
| {feature} | {module} | {specific changes needed} | {XS/S/M/L/XL} |

For each Adapt item, describe the adaptation:

#### Adapt: {Feature Name}
- **Current implementation:** {brief description of how it works now}
- **Required changes for {target vertical}:**
  - Terminology: {source term} → {vertical term}
  - Validation rules: {what changes}
  - UI: {what changes}
  - Data: {what new fields/entities are needed}
- **Effort:** {XS/S/M/L/XL}

---

## Vertical-Specific Features

These features are specific to the {target vertical} product. Not shared with source app.

### Replace — New Implementation of Existing Concept

| Feature | Why Replace (Not Adapt) | Effort |
|---------|------------------------|--------|
| {feature} | {specific reason the existing implementation is incompatible} | {XS/S/M/L/XL} |

For each Replace item:

#### Replace: {Feature Name}
- **Source implementation:** {brief description}
- **Why it can't be adapted:** {specific technical or UX reason}
- **New vertical implementation:** {brief description of the new approach}
- **Effort:** {XS/S/M/L/XL}

---

### New — Required Capabilities Not in Source App

| Feature | User Need | Priority | Effort |
|---------|-----------|----------|--------|
| {feature} | {why the new vertical needs this} | Critical / High / Medium | {XS/S/M/L/XL} |

For each New item:

#### New: {Feature Name}
- **User need:** {who needs this and why in the new vertical}
- **Source app gap:** {why this doesn't exist}
- **High-level design:** {brief description of how it would work}
- **Effort:** {XS/S/M/L/XL}

---

### Deprecate — Remove or Hide

| Feature | Reason for Deprecation | Handling |
|---------|----------------------|---------|
| {feature} | {why this doesn't belong in new vertical} | Hide (feature flag) / Remove from codebase / Archive |

---

## Shared Core Boundary

The following boundary defines what is shared between the source app and the new vertical product:

**In shared core:**
- {list all Carry Over and Adapt features}
- Auth & user management
- {etc.}

**Not in shared core (vertical-specific):**
- {list all Replace and New features}

**Shared interfaces (types/contracts that both verticals consume):**
- `User` entity (shared schema)
- `{other shared entity}`
- `{API contract}`

---

## Effort Summary

| Category | Features | Total Effort |
|----------|---------|-------------|
| Carry Over | {N} | 0 |
| Adapt | {N} | {aggregate} |
| Replace | {N} | {aggregate} |
| New | {N} | {aggregate} |
| **Total pivot development** | | **{total estimate}** |

**Confidence:** {High / Medium / Low} — {brief note on what's uncertain in these estimates}

---

## Next Step

Proceed to **Step R3: Market Fit Analyzer** — `38-repurpose/MARKET-FIT-ANALYZER.md`
```

---

## Quality Rules

1. **Every feature must be classified.** No features from the source app may be left as "TBD" or unclassified. The inheritance map must be exhaustive.
2. **Adapt ≠ Carry Over.** If terminology changes are needed, it's Adapt. If zero code changes are needed, it's Carry Over. Don't blur this distinction.
3. **Replace needs a justification.** Don't classify something as Replace if Adapt would work. Replace means the implementation is fundamentally incompatible — explain why specifically.
4. **Effort estimates are required for Adapt, Replace, and New.** No item can have a blank effort field.
5. **The shared core boundary is the key output.** This drives the fork architecture and team organization for Deep pivots, and the feature flag strategy for Medium pivots.

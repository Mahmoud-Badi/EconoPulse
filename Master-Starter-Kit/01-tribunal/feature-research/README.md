# Feature Area Deep Dives

## Purpose

Feature area deep dives go beyond the surface-level feature list to understand **how each major feature cluster actually works** — the user flows, data requirements, compliance implications, and implementation complexity. This research prevents the most expensive kind of surprise: discovering mid-build that a "simple" feature actually requires 3 external integrations and a compliance review.

## When to Do Feature Deep Dives

- **Full Tribunal:** Always. One document per major feature cluster.
- **Abbreviated Tribunal:** Skip. Fold essential insights into persona documents and address remaining questions during Round 2 (Feasibility).

## How to Identify Feature Clusters

Group the `features-list.md` into clusters of related features. A cluster is a set of features that:

1. Share the same primary user type
2. Operate on the same data entities
3. Would live in the same section of the application

### Example Clustering

For a transportation management system:

| Cluster | Features |
|---------|----------|
| Dispatch & Scheduling | Trip creation, assignment, timeline view, route optimization |
| Fleet Management | Vehicle tracking, maintenance scheduling, driver management |
| Billing & Invoicing | Invoice generation, payment tracking, insurance claims |
| Compliance & Reporting | Audit logs, regulatory reports, driver certifications |
| Communication | In-app messaging, SMS notifications, automated alerts |

**Rule of thumb:** 5-10 clusters for a large project, 3-5 for a medium project.

## Research Process

### Step 1: Identify the Core Workflow

For each cluster, map the end-to-end user flow:

1. What triggers this workflow? (User action, scheduled event, external input)
2. What steps does the user take?
3. What data is created, read, updated, or deleted at each step?
4. What can go wrong at each step? (Error cases, edge cases)
5. How does this workflow interact with other clusters?

### Step 2: Research Market Leaders

Use **Gemini deep research** and **Firecrawl** to understand how best-in-class products implement this feature area:

```
Research how leading [DOMAIN] products implement [FEATURE AREA].

Focus on:
1. The step-by-step user workflow
2. Must-have sub-features (what every product includes)
3. Differentiating sub-features (what only the best products include)
4. Common gotchas and limitations
5. Data model patterns
6. Compliance requirements (if applicable)

Products to analyze: [List 2-3 competitors known to be strong in this area]
```

### Step 3: Assess Complexity

For each feature cluster, estimate:

- **Data complexity:** How many tables? How many relationships? Any complex queries?
- **UI complexity:** How many screens? Any complex interactions (drag-drop, real-time, canvas)?
- **Integration complexity:** External APIs? Third-party services? Authentication flows?
- **Compliance complexity:** Audit requirements? Data encryption? Access control rules?

### Step 4: Fill Out the Template

Complete `feature-area.template.md` for each cluster and save as `[cluster-name].md`.

### Step 5: Build the Gap Matrix

After all clusters are researched, compile `gap-matrix.template.md` to identify table stakes vs. differentiation opportunities at the feature level.

## Research Sources

| Source | What to Look For |
|--------|-----------------|
| **Competitor help docs** | Feature descriptions, workflow guides, limitations |
| **Competitor changelogs** | Recent feature additions (market direction) |
| **Industry publications** | Compliance requirements, market trends |
| **User forums / Reddit** | What users actually want vs. what vendors provide |
| **API documentation** | Integration possibilities, data models |
| **Regulatory bodies** | Compliance checklists, required fields, audit requirements |

## Output Files

```
feature-research/
  README.md                        # This file
  feature-area.template.md         # Per-cluster research template
  gap-matrix.template.md           # Table stakes vs. differentiators
  [cluster-a].md                   # e.g., dispatch-scheduling.md
  [cluster-b].md                   # e.g., billing-invoicing.md
  [cluster-c].md                   # e.g., fleet-management.md
  ...
  gap-matrix.md                    # Compiled matrix
```

## Tips

- **Don't skip error cases.** The happy path is easy. What happens when an address is wrong? When a driver doesn't show up? When an invoice amount is disputed? These edge cases drive 60% of the implementation complexity.
- **Map the data lifecycle.** For each entity (trip, invoice, vehicle), trace it from creation to archival. Every status transition is a potential bug and a potential feature.
- **Identify the "iceberg" features.** Some features look simple (1 sentence in the brief) but are actually massive. "Automated billing" sounds like one feature but might mean: generate invoices, apply rate tables, handle partial payments, manage credits, export to accounting software, and comply with Medicaid billing rules.
- **Note integration requirements early.** If a feature requires an external API (geocoding, SMS, payment processing), document it now. These have cost implications, rate limits, and failure modes that affect architecture decisions.

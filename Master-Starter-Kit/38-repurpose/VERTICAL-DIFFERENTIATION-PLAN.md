# Vertical Differentiation Plan

**Purpose:** Generate the concrete plan for adapting the source application to the target vertical. Plan depth is determined by the pivot classification — Shallow, Medium, or Deep. Each tier produces a different scope of planning output.

**Output:** `dev_docs/repurpose/vertical-differentiation-plan.md`

**Path:** Repurpose only

**Prerequisites:**
- `dev_docs/repurpose/pivot-depth-score.md` — pivot classification
- `dev_docs/repurpose/feature-inheritance-map.md` — what changes
- `dev_docs/repurpose/market-fit-analysis.md` — buyer, compliance, competitive context

---

## When to Run

Run this as Step R4, the final step in the R-series. After this document, the workflow branches based on pivot depth:

- **Shallow** → Hardening (Steps 29-33)
- **Medium** → Steps 5-6, 8 (adapted for vertical) → Hardening
- **Deep** → Fork Architecture (`38-repurpose/FORK-ARCHITECTURE.md`) → Steps 5-16 → Hardening

---

## Think-Then-Generate Protocol

Before generating the plan, answer in the conversation:

1. What's the single highest-leverage change — the one thing that, if done right, most signals to the new vertical that this is built for them?
2. What's the earliest milestone where you could get a real new-vertical user's feedback? (days / weeks into the plan)
3. Are there any changes that sound straightforward but are actually deeply entangled in the source codebase?
4. What does "done" look like for this pivot? Specifically — what would make a new-vertical buyer sign up without hesitation?

---

## Shallow Plan (Score 0-3)

> **Use when:** The pivot is primarily branding, terminology, and configuration. Core functionality transfers unchanged.

**Estimated effort:** Days to 2 weeks per vertical

### Shallow Plan Output

#### Section 1 — Config Layer Architecture

Define a vertical configuration file that controls all surface-level differences:

```typescript
// Example: vertical-config.ts
export const verticalConfig = {
  verticalId: '{target-vertical-slug}',
  displayName: '{Vertical Display Name}',

  // Terminology overrides
  terminology: {
    client: 'patient',           // or 'customer', 'member', 'resident', etc.
    project: 'case',
    task: 'session',
    invoice: 'billing statement',
    // ... all terms from the terminology map
  },

  // Feature flags
  features: {
    billing: true,
    fileUploads: true,
    teamCollaboration: false,    // not needed in this vertical
    {verticalSpecificFeature}: true,
  },

  // Branding
  branding: {
    primaryColor: '{hex}',
    logoPath: '{path}',
    faviconPath: '{path}',
    appName: '{vertical app name}',
    supportEmail: '{support email}',
  },

  // Compliance flags
  compliance: {
    hipaa: false,
    gdpr: true,
    auditLogging: true,
  }
}
```

#### Section 2 — Branding Asset Checklist

List every asset that needs to be created or updated for the new vertical:

| Asset | Size/Format | Description |
|-------|------------|-------------|
| Logo (light) | SVG + PNG @2x | Primary logo for light backgrounds |
| Logo (dark) | SVG + PNG @2x | Primary logo for dark backgrounds / nav |
| Favicon | ICO + 32×32 PNG | Browser tab icon |
| OG image | 1200×630 PNG | Social sharing card |
| Email header image | 600px wide PNG | Used in transactional emails |
| App store icons | 1024×1024 PNG (scaled) | If mobile |

#### Section 3 — Copy & Content Update Map

List every place in the application where copy needs to change:

| Location | Current Copy | New Vertical Copy | Priority |
|----------|-------------|------------------|---------|
| Marketing headline | {current} | {vertical-specific} | Critical |
| Signup page | {current} | {vertical-specific} | Critical |
| Empty state messages | {current} | {vertical-specific} | High |
| Email templates | {current} | {vertical-specific} | High |
| Onboarding flow | {current} | {vertical-specific} | High |
| Help documentation | {current} | {vertical-specific} | Medium |

#### Section 4 — Implementation Checklist

Ordered by priority:

- [ ] Create `vertical-config/{target-vertical}.ts` with all config values
- [ ] Update terminology renderer to use config values throughout UI
- [ ] Apply feature flags to hide irrelevant features for this vertical
- [ ] Replace all branding assets
- [ ] Update landing page / marketing copy
- [ ] Update transactional email templates
- [ ] Update onboarding flow copy
- [ ] Update error messages and empty states
- [ ] Update help documentation
- [ ] Set up vertical-specific domain / subdomain (if applicable)
- [ ] Test full user flow in vertical context
- [ ] QA all terminology changes for consistency

**Estimated total effort:** {X days / 1-2 weeks}

---

## Medium Plan (Score 4-6)

> **Use when:** The pivot requires new screens, data model extensions, and vertical-specific features, but the core architecture remains the same.

**Estimated effort:** 4-12 weeks depending on scope

### Medium Plan Output

Includes everything in the Shallow Plan, plus:

#### Section 5 — Data Model Extensions

For each entity that needs changes (from the Feature Inheritance Map "Adapt" items):

| Entity | Current Fields | New Fields Required | New Relations |
|--------|---------------|--------------------|--------------|
| {entity} | {existing fields} | {new fields for vertical} | {new FK/relations} |

For each new entity required:

```markdown
#### New Entity: {EntityName}

**Purpose in {target vertical}:** {what this entity represents}

**Fields:**
- {field}: {type} — {description}
- {field}: {type} — {description}

**Relations:**
- belongs_to: {OtherEntity}
- has_many: {OtherEntity}

**Vertical-specific constraints:**
- {constraint} — {why this vertical requires it}

**Migration strategy:** {Add to existing schema / Separate vertical schema / Multi-tenant extension}
```

#### Section 6 — New Screens Required

For each screen identified as missing in the Feature Inheritance Map "New" items:

| Screen | User Need | Priority | Effort |
|--------|-----------|----------|--------|
| {screen name} | {what user does here} | Critical / High / Medium | {XS-XL} |

Brief spec for each new screen:

```markdown
#### Screen: {Screen Name}

**Route:** /{path}
**User need:** {who uses this and what they accomplish}

**Core elements:**
- {element 1}
- {element 2}
- {element 3}

**States:**
- Loading: {description}
- Empty: {description}
- Populated: {description}
- Error: {description}

**Vertical-specific requirements:**
- {requirement from market fit analysis}
```

#### Section 7 — New Integrations Required

| Integration | Vertical Need | Priority | Source App Status |
|-------------|--------------|----------|------------------|
| {service} | {why this vertical needs it} | Critical / High / Medium | Exists / Absent |

For each new integration, brief spec:

```markdown
#### Integration: {Service Name}

**Why {target vertical} needs this:** {specific reason}
**Integration type:** {REST API / Webhook / SDK / OAuth}
**Key capabilities needed:**
- {capability 1}
- {capability 2}
**Estimated integration effort:** {XS-XL}
```

#### Section 8 — Medium Plan Implementation Order

Sequenced by dependency:

**Phase 0 — Foundation (Week 1):**
1. Implement vertical config layer (from Shallow Plan)
2. Apply all branding and terminology changes
3. Extend database schema for new entities

**Phase 1 — Core Vertical Features (Weeks 2-6):**
{List Replace and New features from inheritance map, sequenced by dependency}

**Phase 2 — Integrations & Polish (Weeks 7+):**
{List new integrations and polish items}

---

## Deep Plan (Score 7-10)

> **Use when:** The pivot requires a product fork — significant data model changes, new workflows, full UX adaptation, and/or compliance architecture. The source app becomes a foundation, not a feature set.

**Estimated effort:** 3-6+ months

### Deep Plan Output

The Deep Plan is a summary that routes to full kit planning (Steps 5-16) rather than a self-contained plan. It provides the strategic framework that those steps will flesh out in detail.

#### Section 9 — Fork Summary

What the fork means in concrete terms:

| Dimension | Source App | {Target Vertical} Product | Delta |
|-----------|-----------|--------------------------|-------|
| Primary user | {persona} | {persona} | {different / same} |
| Core workflow | {workflow} | {workflow} | {different / similar} |
| Data model | {entity count} entities | {entity count} entities ({N} new, {N} changed) | {delta} |
| Compliance profile | {source compliance} | {target compliance} | {additions} |
| Estimated total effort | — | — | {total from inheritance map} |

#### Section 10 — Forking Strategy

How should the fork be implemented? (This feeds directly into `FORK-ARCHITECTURE.md`)

**Recommended approach:**
- [ ] Monorepo with separate packages (see `FORK-ARCHITECTURE.md`)
- [ ] Separate repositories sharing a core library
- [ ] Feature-flagged single codebase (may become too complex at this depth)

**Shared vs. forked infrastructure:**
| Infrastructure | Shared | Per-Vertical | Notes |
|---------------|--------|-------------|-------|
| Auth service | {Yes / No} | {Yes / No} | {why} |
| Database | {Yes / No} | {Yes / No} | {why} |
| Billing | {Yes / No} | {Yes / No} | {why} |
| Email system | {Yes / No} | {Yes / No} | {why} |
| File storage | {Yes / No} | {Yes / No} | {why} |
| Monitoring/observability | {Yes / No} | {Yes / No} | {why} |

#### Section 11 — Deep Plan Implementation Phases

High-level phase structure (to be detailed in Steps 5-16):

**Phase 0 — Fork Foundation:**
- Set up monorepo structure per `FORK-ARCHITECTURE.md`
- Extract shared core from existing codebase
- Set up separate vertical app shell
- Establish compliance baseline (before writing any vertical-specific code)

**Phase 1 — Core Vertical Product:**
- Implement new data model entities
- Build Replace features (new implementations of existing concepts)
- Build top-priority New features

**Phase 2 — Vertical Completeness:**
- Build remaining New features
- Implement all integrations
- Full UX adaptation

**Phase 3 — Compliance & Hardening:**
- Compliance implementation (if required)
- Security audit
- Performance testing
- Full kit hardening (Steps 29-33)

#### Section 12 — Routing to Full Kit Planning

For Deep pivots, the standard kit steps run on the NEW VERTICAL PRODUCT — not the source app. When running Steps 5-16:

- **Step 5 (Service Specs):** Write service specs for the new vertical product. Reference the inheritance map to know which services carry over vs. need new specs.
- **Step 6 (Screen Specs):** Write screen specs for all screens — including Carry Over/Adapt screens (document what they do in the new vertical context) and all New screens.
- **Step 8 (Tasks):** Task files should be tagged with their inheritance status (Carry Over / Adapt / Replace / New) to help the team understand the nature of each work item.
- All other steps: Run per standard ORCHESTRATOR.md protocol, but with the new vertical as the target product.

**Proceed to:** `38-repurpose/FORK-ARCHITECTURE.md` (Step R4-FORK), then Steps 5-16.

---

## Output Format

Write to `dev_docs/repurpose/vertical-differentiation-plan.md`:

```markdown
# Vertical Differentiation Plan — {Source App} → {Target Vertical}

> **Date:** {date}
> **Pivot depth:** {Shallow / Medium / Deep}
> **Total estimated effort:** {days / weeks / months}

{Include all sections appropriate to the pivot depth}

---

## Next Step

{Based on pivot depth:}
- Shallow: Proceed to Steps 29-33 (Hardening)
- Medium: Proceed to Steps 5-6, 8 (adapted via Vertical Wrapper protocol), then Steps 29-33
- Deep: Proceed to `38-repurpose/FORK-ARCHITECTURE.md`, then Steps 5-16, then Steps 29-33
```

---

## Quality Rules

1. **Shallow plans must include a complete implementation checklist.** A list of files to change and assets to create — not a strategy document.
2. **Medium plans must include sequenced phases.** Unsequenced lists of changes create sprint planning chaos.
3. **Deep plans must be honest about effort.** A 6-month fork is not a "quick pivot." Give an honest time estimate.
4. **Every change must trace to the inheritance map or market fit analysis.** No changes appear in this plan that weren't identified in prior steps.
5. **Announce the route.** After writing the plan, announce: *"Vertical Differentiation Plan complete. Pivot depth: {Shallow/Medium/Deep}. Routing to: {next step}."*

# Technical Feasibility Assessment

## Purpose

Technical feasibility assessment is the reality check that prevents the most dangerous failure mode in software projects: **estimating complexity based on feature descriptions instead of implementation details.**

"Add GPS tracking" sounds like one feature. In reality it means: choose a GPS provider, handle real-time WebSocket connections, manage battery drain on mobile, store millions of location data points, handle stale/offline data, and comply with privacy regulations. That's 3-6 weeks of work hidden inside 3 words.

The feasibility assessment exposes this hidden complexity before the Tribunal votes on feature priorities, so that when personas allocate their votes, they understand the true cost of what they're asking for.

## When to Do Feasibility Assessments

- **Full Tribunal:** Always. Produce frontend and backend assessments for each P0/P1 feature.
- **Abbreviated Tribunal:** Skip formal documents. Address feasibility concerns inline during Round 4 (Prioritization). The expert agents still participate but don't produce standalone documents.

## Process

### Step 1: Identify P0/P1 Features

From the priority matrix (persona votes) and the gap matrix (table stakes analysis), identify features that are:

- **P0 (Must-Have candidates):** High persona votes + table stakes
- **P1 (Should-Have candidates):** Medium persona votes or differentiation opportunities

These are the features worth assessing. Don't waste time on P2/P3 features — they'll be deferred anyway.

### Step 2: Assign Expert Agents

Two agents work in parallel:

| Agent | Focus | Template |
|-------|-------|----------|
| **Frontend Developer** | Client-side complexity, state management, UI components, performance | `frontend-feasibility.template.md` |
| **Backend Developer** | Data model, API design, integrations, migrations, compliance | `backend-feasibility.template.md` |

### Step 3: Assess Each Feature

For each P0/P1 feature, both agents independently fill out their templates. They should:

1. **Describe the approach** — not just "build it" but specifically how
2. **Identify library candidates** — what npm packages or services would we use?
3. **Rate complexity honestly** — S/M/L/XL with justification (not optimistic guessing)
4. **Surface risks** — what could go wrong? What's the worst case?
5. **Make a recommendation** — build in V1, defer, simplify, or prototype first

### Step 4: Cross-Reference

After both agents complete their assessments, compare:

- Did both agents flag the same features as high-complexity?
- Are there features where the frontend says "easy" but the backend says "hard" (or vice versa)?
- Do any features have external dependencies that both sides underestimated?

### Step 5: Feed into Round 2

The completed assessments become the primary input for Round 2 (Technical Feasibility Debate), where all 5 expert agents discuss and produce effort estimates.

## Complexity Scale

Use this consistent scale across all assessments:

| Rating | Meaning | Typical Timeframe | Characteristics |
|--------|---------|-------------------|-----------------|
| **S (Small)** | Straightforward implementation | 1-3 days | Standard CRUD, existing patterns, no external dependencies |
| **M (Medium)** | Moderate complexity | 3-7 days | Custom business logic, 1-2 external integrations, some state management |
| **L (Large)** | Significant complexity | 1-3 weeks | Complex state management, real-time features, multiple integrations, compliance requirements |
| **XL (Extra Large)** | Major engineering effort | 3-6 weeks | Novel architecture, heavy external dependencies, performance-critical, regulatory compliance |

**Important:** These estimates include testing. An M feature is 3-7 days of coding + testing + edge case handling, not 3-7 days of just writing the happy path.

## Risk Categories

Flag risks in these categories:

| Category | Examples |
|----------|---------|
| **Dependency Risk** | External API might be unreliable, library might be unmaintained, service might be expensive |
| **Performance Risk** | Feature might be slow with production data volumes, real-time updates might overload the server |
| **Security Risk** | Feature handles PII/PHI, authentication edge cases, CSRF/XSS vectors |
| **Compliance Risk** | HIPAA audit logging, GDPR data deletion, PCI payment data handling |
| **Scalability Risk** | Feature works for 10 users but breaks at 1,000, data model doesn't partition well |
| **UX Risk** | Feature is technically feasible but creates a confusing user experience |
| **Integration Risk** | Feature depends on another feature being built first, circular dependencies |

## Output Files

```
technical-feasibility/
  README.md                           # This file
  frontend-feasibility.template.md    # Per-feature frontend assessment
  backend-feasibility.template.md     # Per-feature backend assessment
  frontend-feasibility.md             # Filled frontend assessments
  backend-feasibility.md              # Filled backend assessments
```

## Tips

- **Estimate for a single developer.** Don't assume parallel work. "This takes 1 week with 3 developers" is not a useful estimate. Say "3 developer-weeks" and let the project plan handle parallelism.
- **Include the hidden work.** Every feature has: implementation + testing + error handling + loading states + empty states + mobile adaptation + documentation. A feature that "takes 2 days to build" really takes 4-5 days when all of this is included.
- **Name the library.** Don't say "we'll use a drag-and-drop library." Say "we'll use dnd-kit (8KB, maintained, React 19 compatible, supports keyboard accessibility)." Naming it forces you to verify it exists and works.
- **Flag the "looks easy" features.** The most dangerous features are the ones that sound simple. "Add search" sounds like an afternoon. Full-text search with relevance ranking across 6 entity types with type-ahead suggestions is 2 weeks.
- **Don't optimize prematurely in the assessment.** If a feature needs a basic implementation first, say "build basic version in V1 (M complexity), optimize in V2 if performance is an issue." Don't estimate for the optimized version upfront.

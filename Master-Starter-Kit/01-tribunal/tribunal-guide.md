# Tribunal Process Guide

Complete step-by-step instructions for running a Tribunal — from pre-work through final verdict.

---

## Prerequisites

Before starting the Tribunal, you must have:

- [ ] Completed `00-discovery/PROJECT-BRIEF.md` (product vision, user types, initial feature list)
- [ ] Identified all distinct user types (roles with meaningfully different workflows)
- [ ] Access to AI tools: Claude (agents), Firecrawl (web scraping), Gemini (deep research)
- [ ] Allocated 2-5 days for full Tribunal or 1 day for abbreviated

---

## Step 1: Pre-Work (30-60 minutes)

### 1.1 Read the Project Brief

Open `00-discovery/PROJECT-BRIEF.md` and extract:

- **Product domain** (e.g., transportation management, healthcare scheduling, e-commerce)
- **User types** (every distinct role mentioned — count them)
- **Initial feature list** (even if rough)
- **Known constraints** (budget, timeline, compliance requirements, tech stack preferences)

### 1.2 Identify User Types

List every user type. Be specific — "Admin" is too vague. Instead:

| Generic | Specific |
|---------|----------|
| Admin | Fleet Operations Manager who oversees 15 drivers |
| User | Dispatcher handling 40+ trip assignments per shift |
| User | Billing Clerk processing 200+ invoices monthly |

**Rule of thumb:** If two "users" have different daily workflows, they are different personas.

### 1.3 Identify Competitors

List 5-10 direct competitors and 2-3 adjacent-market products. Sources:

- Google search: "[domain] software" (e.g., "NEMT software", "fleet management software")
- G2/Capterra category pages
- Product Hunt collections
- Industry publications and buyer's guides
- Subreddits for the domain (r/fleet, r/logistics, etc.)

### 1.4 Create the Features List

Create a master `features-list.md` with every feature mentioned in the brief, plus any obvious ones from competitor research. Format:

```markdown
| # | Feature | Category | Source |
|---|---------|----------|--------|
| 1 | Trip scheduling | Dispatch | Brief |
| 2 | Real-time GPS tracking | Fleet | Competitor X |
| 3 | Automated invoicing | Billing | Brief |
```

This list will be the "ballot" that personas vote on.

---

## Step 2: Generate Personas (Parallel — 1 agent per user type)

**Time:** 15-30 minutes per persona (run in parallel)

For each user type identified in Step 1:

1. Spawn a dedicated agent
2. Give it the `persona.template.md` template and the PROJECT-BRIEF.md
3. Instruct it to create a fully fleshed-out persona document
4. Save to `personas/[role-name].md` (e.g., `personas/dispatcher-maria.md`)

### Agent Prompt Template

```
You are generating a detailed user persona for the [PROJECT NAME] Tribunal process.

User type: [ROLE — e.g., "Wheelchair transport dispatcher"]
Context: [2-3 sentences from PROJECT-BRIEF.md about this role]

Using the persona.template.md format, create a complete persona document. The persona should:
- Have a realistic name and background
- Describe a specific daily workflow (not generic)
- Express genuine pain points (emotional, not just functional)
- Allocate exactly 10 feature votes across the features list below
- Identify concrete deal-breakers

Features list for voting:
[Paste features-list.md here]

Save to: personas/[name].md
```

### Key Rules

- Each persona gets exactly **10 votes** to allocate across features (can split: 3+2+2+1+1+1)
- Votes must total exactly 10 — no more, no less
- At least one vote must go to a feature that no other persona is likely to prioritize (forces coverage)
- Deal-breakers must be specific and testable ("I need HIPAA-compliant audit logs" not "it needs to be secure")

---

## Step 3: Research Competitors (Parallel — 1 agent per competitor)

**Time:** 20-40 minutes per competitor (run in parallel)

**Skip in abbreviated mode.** Just create the competition-matrix.template.md with checkboxes.

For each competitor identified in Step 1:

1. Use **Firecrawl** to scrape the competitor's product pages, feature pages, and pricing page
2. Use **Gemini deep research** to analyze the scraped content
3. Fill out `competitors/competitor.template.md`
4. Save to `competitors/[company-name].md`

### Firecrawl Targets (per competitor)

- Homepage
- Features/product page
- Pricing page
- Help docs / knowledge base (for feature depth)
- Customer testimonials / case studies (for target market insight)

### After All Competitors

Compile the `competitors/competition-matrix.template.md` — a single grid showing feature coverage across all competitors. This grid is essential input for Rounds 1 and 4.

---

## Step 4: Feature Area Deep Dives (Parallel — 1 agent per feature cluster)

**Time:** 20-30 minutes per feature area (run in parallel)

**Skip in abbreviated mode.** Fold key insights into persona documents instead.

Group features from `features-list.md` into 5-10 clusters (e.g., "Dispatch & Scheduling", "Billing & Invoicing", "Fleet Management", "Compliance & Reporting").

For each cluster:

1. Use **Gemini deep research** to understand how market leaders implement this feature area
2. Use **Firecrawl** to scrape 2-3 best-in-class implementations
3. Fill out `feature-research/feature-area.template.md`
4. Save to `feature-research/[area-name].md`

### After All Feature Areas

Compile the `feature-research/gap-matrix.template.md` — showing table stakes vs. differentiators across the market.

---

## Step 5: Design UX Research (1 agent)

**Time:** 30-60 minutes

**Skip in abbreviated mode.** Use 2-3 reference products and skip the formal design brief.

1. Identify 5+ best-in-class products in the domain (not just competitors — include adjacent domains with similar UX needs)
2. Use **Firecrawl** to scrape screenshots, landing pages, and product tours
3. Use **Gemini** for pattern analysis across the scraped material
4. Fill out `design-research/design-brief.template.md` and `design-research/ux-patterns.template.md`

### Focus Areas

- **Data density:** How much information per screen? (Dashboard-heavy apps need high density)
- **Color language:** How do competitors use color to communicate status, urgency, health?
- **Navigation:** Sidebar vs. topbar vs. tabs — what works for this domain's information architecture?
- **Data tables:** Sorting, filtering, column customization, row actions, bulk operations
- **Mobile:** Is mobile essential or optional for each user type?

---

<!-- IF {{HAS_MOBILE}} == "true" -->
## Step 6: Technical Feasibility Assessment (3 agents — frontend + backend + mobile)
<!-- ENDIF -->
<!-- IF {{HAS_MOBILE}} != "true" -->
## Step 6: Technical Feasibility Assessment (2 agents — frontend + backend)
<!-- ENDIF -->

**Time:** 30-45 minutes per assessment

**Skip in abbreviated mode.** Fold into Round 2 proceedings.

For each P0 (must-have) feature from the rough priority list:

1. **Frontend agent** fills out `technical-feasibility/frontend-feasibility.template.md`
2. **Backend agent** fills out `technical-feasibility/backend-feasibility.template.md`
<!-- IF {{HAS_MOBILE}} == "true" -->
3. **Mobile agent** fills out `technical-feasibility/mobile-feasibility.template.md` — assesses native API requirements, offline complexity, platform differences, and App Store implications
<!-- ENDIF -->

### Critical Questions Per Feature

- How long will this actually take? (Not optimistic estimate — realistic with testing)
- What external dependencies are required? (APIs, services, libraries)
- What could go wrong? (Known gotchas, performance cliffs, compatibility issues)
- What's the data model impact? (New tables, migrations, relationship complexity)
- Does this feature have compliance implications? (Audit logs, encryption, access control)

---

## Round 1: User Needs Debate

**Time:** 45-60 minutes

### Format

This is a structured debate where every persona speaks. No persona can be interrupted or overruled — every voice is recorded.

### Procedure

1. **Opening Statements:** Each persona agent delivers a 2-paragraph statement:
   - Paragraph 1: Who they are, what their day looks like, what's broken
   - Paragraph 2: Their #1 feature request and why it matters more than anything else

2. **Vote Tally:** Compile votes from all persona documents into a single table:
   ```
   | Feature | Persona A | Persona B | Persona C | Total |
   |---------|-----------|-----------|-----------|-------|
   | Feature 1 | 3 | 0 | 2 | 5 |
   | Feature 2 | 1 | 4 | 0 | 5 |
   ```

3. **Consensus Identification:** Features where 3+ personas allocated at least 1 vote. These are strong candidates for Must-Have.

4. **Conflict Identification:** Features where one persona allocated 3+ votes but another allocated 0. These tensions must be explicitly named and addressed.

5. **Deal-Breaker Audit:** List every deal-breaker from every persona. Any feature that is a deal-breaker for ANY persona must be discussed — even if other personas don't care about it.

6. **Synthesis:** Produce a ranked feature list (by total votes), identify top 3 conflicts, and determine the "must-win" persona (the user type whose satisfaction is most critical for adoption).

### Output

Fill out `proceedings/round-1-user-needs.template.md`

---

## Round 2: Technical Feasibility Debate

**Time:** 30-45 minutes

### Format

<!-- IF {{HAS_MOBILE}} == "true" -->
The 6 technical expert agents review the top features from Round 1 and provide reality checks.
<!-- ENDIF -->
<!-- IF {{HAS_MOBILE}} != "true" -->
The 5 technical expert agents review the top features from Round 1 and provide reality checks.
<!-- ENDIF -->

### Procedure

1. **Expert Assessments:** Each expert reviews the top 10-15 features from Round 1:
   - UX Researcher: Are these workflows realistic? Are we missing steps?
   - UI Designer: Can these features coexist in a coherent interface?
   - Frontend Dev: What's the state management complexity? Performance implications?
   - Backend Dev: Data model implications? Migration risks? External API dependencies?
   - Feature Researcher: How do competitors implement this? What gotchas have they encountered?
<!-- IF {{HAS_MOBILE}} == "true" -->
   - Mobile Developer: What native APIs are needed? What is the offline complexity? What can be shared with web? How do iOS and Android differ for this feature?
<!-- ENDIF -->

2. **Effort Estimation Table:** For each feature:
   ```
   | Feature | Complexity | Days | Blockers | Risk |
   |---------|-----------|------|----------|------|
   ```

3. **Technical Flags:** Hidden complexity that personas wouldn't know about:
   - "Real-time GPS tracking requires WebSocket infrastructure and costs $X/month in API calls"
   - "HIPAA compliance adds 2 weeks of audit logging work to every feature"
   - "Drag-and-drop on mobile is fundamentally different from desktop — double the work"
<!-- IF {{HAS_MOBILE}} == "true" -->
   - "Background location tracking drains battery and requires persistent notification on Android"
   - "Push notifications require APNs (iOS) and FCM (Android) — two separate integrations"
   - "Offline sync with conflict resolution adds 2-4 weeks per data domain"
   - "App Store review adds 1-7 days to every release cycle"
<!-- ENDIF -->

4. **Recommended Deferrals:** Features that should move to V2 because:
   - Complexity is disproportionate to value
   - External dependencies aren't mature enough
   - The feature requires infrastructure that benefits future features (build it later when there's more to build on)

5. **Synthesis:** Revised feature list with effort estimates and a draft phase allocation.

### Output

Fill out `proceedings/round-2-feasibility.template.md`

---

## Round 3: Design Direction Debate

**Time:** 30-45 minutes

**Skip in abbreviated mode.** Use defaults from the design brief template.

### Format

The UI Designer and UX Researcher lead. Other experts and personas provide input on what "professional" and "trustworthy" mean in this domain.

### Procedure

1. **Anti-Patterns:** What does bad design look like in this domain? (e.g., "fleet management apps that look like Excel with a sidebar", "dashboards with 47 KPIs and no hierarchy")

2. **Reference Products:** Present 3-5 products (from design research) with specific callouts:
   - "Stripe's dashboard: clean data density, clear status hierarchy"
   - "Linear: keyboard-first navigation, minimal chrome"
   - "Notion: flexible layout system, good information architecture"

3. **Design Language Proposal:** Colors, typography, density, component style — with rationale for each choice.

4. **Critical Screens:** Identify the 3-5 most important screens and describe what each must communicate at a glance. The dispatcher's main screen is different from the billing clerk's main screen.

5. **Synthesis:** Approved design direction, tokens to establish in the design system, anti-patterns to encode as lint rules.

### Output

Fill out `proceedings/round-3-design.template.md`

---

## Round 4: Final MoSCoW Prioritization

**Time:** 45-60 minutes

### Format

Every agent (all personas + all experts) gets a final vote. This is the binding vote that produces the approved feature list.

### Procedure

1. **Present the Revised List:** Show the feature list as modified by Rounds 1-3, with effort estimates and technical flags.

2. **MoSCoW Classification:** For each feature, classify:
   - **Must Have:** Without this, the product cannot launch. Launch blockers only.
   - **Should Have:** Important and expected, but the product is usable without it. Target for V1 but deferrable.
   - **Could Have:** Nice to have. Include if time permits.
   - **Won't Have (this time):** Explicitly deferred to V2+. Not forgotten — documented with rationale.

3. **Vote Record:** Each agent votes Yes / Yes-with-Reservations / No on each Must-Have feature. A feature needs majority Yes to stay in Must-Have.

4. **Phase Allocation:** Group Must-Have and Should-Have features into phases:
   ```
   Phase 0: Foundation (auth, DB, project structure) — 1-2 weeks
   Phase 1: [Core workflow] — X weeks
   Phase 2: [Second workflow] — X weeks
   ...
   ```

5. **Final Verdict:** Compile everything into the verdict document.

### Output

Fill out `proceedings/round-4-prioritization.template.md` and `proceedings/verdict.template.md`

---

## Abbreviated Tribunal Path

For smaller projects (1-3 months, 1-3 user types):

### What to Do

1. **Pre-work:** Same as full Tribunal (Steps 1.1-1.4)
2. **Personas:** Generate all personas (Step 2) — this is never skipped
3. **Quick Competition Scan:** Fill out competition-matrix.template.md without full competitor deep-dives
4. **Round 1:** Run User Needs debate (same format, fewer personas = faster)
5. **Round 4:** Run Final Prioritization (same format, skip design and feasibility rounds)
6. **Verdict:** Produce verdict document

### What to Skip

- Step 3 (full competitor deep dives) — just do the matrix
- Step 4 (feature area deep dives) — fold into persona docs
- Step 5 (design research) — use 2-3 reference products, decide direction in 15 minutes
- Step 6 (formal feasibility docs) — address feasibility inline during Round 4
- Round 2 (feasibility debate) — fold into Round 4
- Round 3 (design debate) — fold into Round 4

### Time Savings

- Full Tribunal: 2-5 days
- Abbreviated Tribunal: 4-8 hours

---

## After the Tribunal

The verdict document feeds into:

1. **`04-phase-planning/`** — Features become phases with week-level timelines
2. **`02-architecture/`** — Tech stack and data model decisions are confirmed
3. **`07-ui-design-system/`** — Design tokens and component library are established
4. **`03-documentation/`** — Feature specs are written from the approved feature list

The Tribunal is complete when the verdict is produced. Revisit the Tribunal only if:

- A major new user type is discovered mid-project
- External constraints change dramatically (budget cut, timeline compressed, compliance requirement added)
- A Phase retrospective reveals that the feature list has fundamental gaps

---

## Tips From Experience

1. **Don't skimp on personas.** A persona that says "I need it to be fast" is useless. A persona that says "I process 40 trip assignments between 6am and 8am and if the Kanban board takes more than 200ms to update I'll miss the 7:15am pickup window" is gold.

2. **Let personas disagree.** The whole point is surfacing conflicts. If all personas agree on everything, the personas aren't specific enough.

3. **Trust the votes.** When a feature gets 0 votes from 5 personas, it doesn't matter how cool it is — defer it. When a feature gets votes from every persona, it doesn't matter how hard it is — build it.

4. **Technical experts are advisors, not vetoes.** An expert can flag that a feature takes 3 weeks instead of 3 days, but they can't remove a Must-Have feature. They can only recommend deferral — the final vote decides.

5. **The verdict is a contract.** Once approved, the feature list doesn't change without a mini-Tribunal. This prevents scope creep better than any project management tool.

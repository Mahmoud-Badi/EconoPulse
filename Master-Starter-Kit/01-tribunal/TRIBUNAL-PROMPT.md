# The Tribunal Prompt — Universal Product Audit & Roadmap Generator

**What this does:** Runs a full multi-agent product tribunal on any software project.
Produces 60-100 research documents, a prioritized feature roadmap, and implementation-ready specs.
Covers: competitor analysis, user persona debates, feature gap audit, design/UX research,
technical feasibility, MoSCoW prioritization, phase-by-phase roadmap, and executive summary.

**How to use:** Just paste this file into any Claude Code conversation and say "run the tribunal".
Claude will interview you first (6 questions), fill in everything itself, then execute all 10 rounds.

**Expected output:** 60-100 markdown files, ~2MB of research, a complete roadmap with
implementation specs ready to execute. Estimated runtime: 3-5 hours of Claude work.

---

## ═══════════════════════════════════════════════
## STEP 1 — INTAKE INTERVIEW (Claude asks, user answers)
## ═══════════════════════════════════════════════

**CLAUDE: Before running the tribunal, ask the user these 6 questions in a single message.
Number them clearly. Wait for all answers before proceeding to STEP 2.**

```
Ask the user:

1. What is your project called, and what does it do?
   (Name + 2-3 sentences: what it does, who uses it, what stage it's at)

2. What triggered this audit — what's the specific problem you want to solve?
   (Examples: "demo went badly", "losing to competitor X", "users churn after week 2",
   "product feels unfinished", "missing features users keep asking for")

3. Who are the main people who use or buy your product?
   (List the roles — e.g. "CEO, dispatcher, driver, patient" — or say "figure it out for me")

4. Who are your main competitors?
   (Name them, or say "find them for me")

5. Where should I save all the research files?
   (A folder path relative to your project root — e.g. "docs/tribunal/" or "research/audit/")

6. Do you have any existing audit docs, research notes, or planning files I should read first?
   (Give the folder path, or say "none")
```

---

## ═══════════════════════════════════════════════
## STEP 2 — CLAUDE FILLS IN THE VARIABLES
## ═══════════════════════════════════════════════

**CLAUDE: Once the user answers the 6 questions, do the following BEFORE running any rounds:**

1. **Explore the codebase** — Use Glob to find the tech stack (package.json, requirements.txt,
   Gemfile, pubspec.yaml, etc.). Read the most important config files to identify the framework,
   language, and database. Don't ask — just detect it.

2. **Infer the industry and target market** — From the project description + codebase, determine
   the industry and who the target customers are.

3. **Define personas** — If the user said "figure it out", use the project description + industry
   to propose 8-12 specific personas. Show them briefly and confirm before proceeding.

4. **Define feature areas** — Use Glob to explore the codebase structure (pages, routes, components,
   models). Infer the 6-10 core feature domains from the actual code. Don't ask — just detect.

5. **Fill in all variables** — Write a brief confirmation block showing what you detected:

```
CONFIRMED SETUP:
  Project: [name] — [1-line description]
  Industry: [detected industry]
  Tech stack: [detected stack]
  Problem: [user's problem statement]
  Target market: [inferred from description]
  Competitors: [user-provided or "will identify in Round 1"]
  Personas: [list of 8-12 roles]
  Feature areas: [list of 6-10 domains from codebase]
  Output folder: [user-specified]
  Existing docs: [user-specified or "none"]

Ready to run 10 rounds. Proceed? (or say what to change)
```

6. **Wait for user confirmation** — Let them correct anything before starting Round 0.

---

## ═══════════════════════════════════════════════
## CRITICAL RULES — Read Before Running
## These apply to EVERY agent in every round.
## ═══════════════════════════════════════════════

**RULE 1 — TOKEN LIMIT PROTECTION (MANDATORY):**
Every agent MUST write output to markdown files using the Write tool AS IT WORKS, not at the end.
Never attempt to return large research as a single response — it will hit the 32K token output limit and fail.
Each agent must:
- Create its output file(s) at the START (even if empty)
- Write content section by section, saving after each major section
- Return only a brief summary when done (file names + 3-5 key findings)
All research value lives in the files, not in the agent's final response.

**RULE 2 — MAX 3 PARALLEL AGENTS:**
Never launch more than 3 agents simultaneously in a single batch.
This prevents rate limit errors. Wait for a batch to complete before launching the next batch.

**RULE 3 — COMPETITOR RESEARCH TOOL:**
Use Firecrawl MCP (`firecrawl_scrape`, `firecrawl_search`) for competitor research.
Do NOT use WebSearch for competitor scraping — it is often blocked.
Use `gemini-deep-research` for industry context and market analysis.

**FALLBACK (if Firecrawl/Gemini MCPs are not installed):**
Use `WebSearch` to find competitor information and `WebFetch` to read their websites.
Results may be less detailed but the process still works. For each competitor:
- WebSearch: "[competitor name] features pricing reviews"
- WebFetch: competitor's main website, features page, pricing page
- WebSearch: "[competitor name] G2 reviews" or "Capterra reviews"

**RULE 4 — DEBATE ROUNDS USE SEQUENTIAL THINKING:**
All 4 tribunal debate rounds (Round 6) MUST use the Sequential Thinking MCP.
This enables genuine multi-perspective reasoning where personas argue against each other.

**FALLBACK (if Sequential Thinking MCP is not installed):**
Write the debate as a structured dialogue in markdown. Have each persona present their argument,
then write counter-arguments, then synthesize. Less dynamic but still produces useful output.

**RULE 5 — MOSCOW PRIORITIZATION:**
Round 6, Debate 4 MUST classify every feature as:
Must Have / Should Have / Could Have / Won't Have (for now)
No feature escapes classification. Every feature gets a phase allocation.

**RULE 6 — CODEBASE READING:**
Round 5 (Technical Feasibility) agents MUST actually read the codebase files, not make assumptions.
Use Glob to find relevant files, then Read to inspect them.

---

## ═══════════════════════════════════════════════
## ROUND 0 — Existing Docs Synthesis
## SKIP if EXISTING_DOCS = "none"
## ═══════════════════════════════════════════════

**Agent count:** 1
**Purpose:** Synthesize any existing audit/research docs into a clean starting point.
**Input:** All files in [EXISTING_DOCS]

**Instructions for the agent:**
You are a product analyst synthesizing existing research for [PROJECT_NAME].

Read all files in [EXISTING_DOCS]. Create these 3 files in [OUTPUT_FOLDER]/01-existing-synthesis/:

**File 1: `synthesis.md`**
- Summary of all existing findings (what's working, what's broken)
- Gap severity tiers: P0 (critical, blocking), P1 (high, important), P2 (medium), P3 (low/nice-to-have)
- What V1/previous versions had that the current version doesn't
- Patterns across all existing docs

**File 2: `competitive-positioning.md`**
- Current product's score vs itself (previous version) and vs the market
- Estimated win rate and why deals are lost
- Where the product sits on the feature/experience spectrum

**File 3: `failure-analysis.md`**
- Root cause analysis of the specific problem in PROBLEM_STATEMENT
- What specific changes would have prevented the problem
- Immediate fixes vs structural improvements

Write incrementally. Return only: file names created + top 5 findings.

---

## ═══════════════════════════════════════════════
## ROUND 1 — Competitor Deep Dive
## 3 batches × 3 agents = up to 9 agent runs
## ═══════════════════════════════════════════════

**Purpose:** Deep analysis of competitors using Firecrawl + Gemini.
**Tools:** `firecrawl_scrape`, `firecrawl_search`, `gemini-deep-research`, `gemini-analyze-url`
**Fallback tools:** `WebSearch`, `WebFetch` (if MCPs not installed)
**Output folder:** [OUTPUT_FOLDER]/02-competitor-research/

**How to batch competitors:**
Take [KNOWN_COMPETITORS] and split into 3 groups of ~3 competitors each.
If "identify for me" was written, first use `gemini-deep-research` to identify 8-12 competitors
in [INDUSTRY] targeting [TARGET_MARKET], then split them into 3 groups.

**Instructions for EACH competitor agent:**
You are a competitive intelligence analyst for [PROJECT_NAME] in the [INDUSTRY] market.

For each competitor assigned to you, research them thoroughly using Firecrawl + Gemini.
Create one file per competitor: `[competitor-name].md`

Each competitor file MUST include:
1. **Overview** — What they do, founded, company size, target market, pricing model
2. **Core Value Proposition** — Their main selling point in one sentence
3. **Top 10 Features** — Detailed descriptions of their best features
4. **UI/UX Philosophy** — Modern/legacy, dense/spacious, mobile-first/desktop, design language
5. **Integrations** — What they connect with (billing, mapping, APIs, etc.)
6. **Unique Innovations** — What they do that nobody else does
7. **Weaknesses** — Customer complaints (use Firecrawl to scrape reviews from G2/Capterra/Trustpilot)
8. **Pricing** — Tiers, per-seat, per-usage, enterprise
9. **What [PROJECT_NAME] could learn** — 3-5 specific feature ideas worth stealing
10. **Direct threat level** — How directly they compete with [PROJECT_NAME] (High/Medium/Low + why)

Write each file incrementally. After all competitor files are written, the LAST agent in the batch
also creates:

**`competition-matrix.md`** — Feature comparison table (all competitors vs [PROJECT_NAME]):
Rows = features, Columns = [PROJECT_NAME] + each competitor
Mark each cell: ✅ (has it), ⚠️ (partial), ❌ (missing), 🔒 (enterprise only)

**`innovation-opportunities.md`** — Where [PROJECT_NAME] can win:
- Features all competitors have that [PROJECT_NAME] is missing (table stakes gaps)
- Features only 1-2 competitors have (competitive parity gaps)
- Features NO competitor has but users need (white space opportunities)
- [PROJECT_NAME]'s unique strengths that competitors can't easily copy

Return only: file names created + top 5 competitive insights.

---

## ═══════════════════════════════════════════════
## ROUND 2 — User Persona Research
## 1 agent per 2-3 personas, batches of 3
## ═══════════════════════════════════════════════

**Purpose:** Each user persona writes their requirements, frustrations, and feature priorities.
**Output folder:** [OUTPUT_FOLDER]/03-persona-research/

**How to structure batches:**
Take [USER_PERSONAS] and assign 2-3 personas per agent.
Run in batches of 3 agents max. If "define for me" was written, use gemini-deep-research to
identify the 8-16 most important personas for a [INDUSTRY] product targeting [TARGET_MARKET].

**Instructions for EACH persona agent:**
You are conducting user research interviews for [PROJECT_NAME] in the [INDUSTRY] market.

For each persona assigned to you, write a detailed research document from THEIR perspective.
Speak as them — their goals, frustrations, daily workflows, and needs.
Create one file per persona: `persona-[N]-[role-name].md`

Each persona file MUST include:
1. **Who I Am** — Role description, company size, technical level, how long in this role
2. **My Daily Workflow** — Step-by-step what I do with this product every day
3. **My Top 5 Pain Points with [PROJECT_NAME]** — Specific, concrete frustrations
4. **My Deal-Breakers** — Features I absolutely need or I will switch to a competitor
5. **My Feature Priority Rankings** — Score 1-10 for each area in [FEATURE_AREAS] + any missing areas
6. **My Wish List** — 5 features I want, written as user stories:
   "Given [context], When [I do X], Then [I expect Y]"
7. **Competitor Envy** — Which competitor feature I wish [PROJECT_NAME] had
8. **If I Could Change ONE Thing** — Single most impactful improvement
9. **What Would Make Me Evangelize This Product** — What would make me recommend it to others
10. **Red Flags** — What current issues make me distrust or avoid the product

Write incrementally. The LAST batch also creates:
**`persona-priorities-matrix.md`** — Heat map: all personas × all feature areas
Show which personas care most about which features. Include deal-breakers column.

Return only: file names created + top 3 insights per persona.

---

## ═══════════════════════════════════════════════
## ROUND 3 — Feature Area Deep Dives
## 3 agents parallel, 3 feature areas each
## ═══════════════════════════════════════════════

**Purpose:** Comprehensive analysis of each feature domain with 20-40 row feature inventories.
**Output folder:** [OUTPUT_FOLDER]/04-feature-research/

**How to split feature areas:**
Take [FEATURE_AREAS] and split evenly into 3 groups (add related areas if needed to reach 9 total).
Each agent gets 3 feature areas.

**Instructions for EACH feature research agent:**
You are a product analyst doing a deep-dive feature audit for [PROJECT_NAME].

For each feature area assigned to you, create one deep-dive file: `[feature-area-name].md`

Each feature file MUST include:
1. **Current State** — What [PROJECT_NAME] has today, scored /10
2. **Gap vs Previous Versions** — Features that existed before and were removed/degraded
3. **Industry Standard Features** — Table stakes (all competitors have), differentiators, innovations
4. **Competitor Best Practices** — Who does this area best and specifically how
5. **Persona Needs** — Which personas from Round 2 care most and what they specifically need
6. **Feature Inventory Table** (20-40 rows):

   | Feature | Current Product | Industry Standard | Top Competitor | Priority | Effort |
   |---------|----------------|-------------------|----------------|----------|--------|
   | [feature] | ✅/⚠️/❌ | Must/Should/Could | Who has it | P0/P1/P2/P3 | S/M/L/XL |

7. **Quick Wins** — Features that are high impact + low effort (≤3 days of work)
8. **Recommended Phase** — Which improvement belongs in which phase (Near/Mid/Long-term)
9. **Integration Requirements** — Third-party services needed to implement features

After all 3 agents complete, run a 4th synthesis agent:
**`feature-gap-matrix.md`** — Master list: all features across all areas, sorted by P0→P3 priority
Include effort estimates and which phase each belongs in.

Return only: file names created + top 5 highest-priority gaps found.

---

## ═══════════════════════════════════════════════
## ROUND 4 — Design & UX Research
## 2 agents parallel
## ═══════════════════════════════════════════════

**Purpose:** Research design directions, UI/UX patterns, and plan visual improvements.
**Output folder:** [OUTPUT_FOLDER]/05-design-research/
**Tools:** `firecrawl_scrape`, `gemini-analyze-url`, `gemini-deep-research`
**Fallback tools:** `WebSearch`, `WebFetch`

### Agent A — UI Design Researcher

Create these files:

**`competitor-ui-teardown.md`**
Scrape the top 5-8 competitors from Round 1 and analyze their UI/UX:
- Color palette (hex codes if available)
- Typography choices
- Layout density (spacious/compact/dense)
- Navigation patterns
- Dashboard design philosophy
- Mobile vs desktop approach
- Animation and interaction patterns
- First impression score /10

**`design-language-options.md`**
Propose 3 distinct visual directions for [PROJECT_NAME]:
- Direction 1: [Conservative/Professional] — For buyers who value trust and reliability
- Direction 2: [Modern/Bold] — For buyers who want to look cutting-edge
- Direction 3: [Clean/Minimal] — For buyers who value simplicity and speed
For each: color palette, typography, spacing philosophy, pros/cons, effort estimate

**`inspiration-gallery.md`**
Best-in-class UIs from adjacent industries that [PROJECT_NAME] could draw inspiration from.
Include specific features/patterns worth adopting. Focus on products known for great UX
(examples: Linear, Stripe, Vercel dashboard, Notion, Figma, Intercom).

### Agent B — Design System Architect

Read the current codebase UI components (if accessible) or analyze product screenshots.
Create these files:

**`component-audit.md`**
List of all UI components in the current product:
- Components that look generic/unpolished (quick wins to customize)
- Components with interaction problems
- Missing components that industry peers have
- Recommended customizations for each (specific CSS/Tailwind changes)

**`design-system-roadmap.md`**
Phase-by-phase plan to improve the visual design:
- Phase 1 (Quick wins, 1-2 weeks): Color/spacing/shadow tweaks — biggest ROI
- Phase 2 (Core, 3-4 weeks): Typography, icon system, component library customization
- Phase 3 (Polish, 4-6 weeks): Custom illustrations, animations, micro-interactions
- Phase 4 (Rebrand, 6-10 weeks): Full custom design system with brand identity

Return only: file names created + top 3 design recommendations.

---

## ═══════════════════════════════════════════════
## ROUND 5 — Technical Feasibility
## 2 agents parallel — MUST READ ACTUAL CODEBASE
## ═══════════════════════════════════════════════

**Purpose:** Reality-check ALL proposed features against the actual codebase.
**Output folder:** [OUTPUT_FOLDER]/06-technical-feasibility/
**IMPORTANT:** These agents MUST use Glob + Read to inspect the actual codebase. No assumptions.

### Agent A — Frontend Feasibility

Use Glob to find all frontend components, pages, and UI code.
Read the most important files to understand the current architecture.

Create these files:

**`frontend-feasibility.md`**
- Current frontend architecture (framework, component library, state management, routing)
- Feature feasibility table for all features identified in Rounds 1-4:

  | Feature | Feasibility | Reason | Effort | Risk |
  |---------|-------------|--------|--------|------|
  | Timeline view | High/Med/Low | Uses existing X | S/M/L/XL | Low/Med/High |

- Performance concerns (bundle size, render performance, mobile performance)
- Library/dependency gaps (what npm packages would be needed)
- Breaking changes (features that require architectural changes)

**`performance-analysis.md`**
- Current performance bottlenecks visible in the code
- Optimization opportunities
- Mobile responsiveness audit

### Agent B — Backend Feasibility

Use Glob to find all database schemas, API routes, and services.
Read the most important files to understand the data model and API patterns.

Create these files:

**`backend-feasibility.md`**
- Current backend architecture (API pattern, ORM, database, auth)
- Database schema changes needed for each proposed feature
- API endpoint additions/changes needed
- Integration complexity for third-party services

**`effort-estimation-framework.md`**
Combined effort estimates for ALL features across frontend + backend:

| Feature | Frontend | Backend | Total Effort | Risk | Recommended Phase |
|---------|----------|---------|--------------|------|-------------------|

T-shirt sizing definitions:
- S = 1-2 days, M = 3-5 days, L = 1-2 weeks, XL = 2-4 weeks, XXL = 1+ months

Also include:
- "Quick wins" list (S effort, P0/P1 priority) — what to ship first
- "High risk" list (features with unknown unknowns that need a spike/POC first)
- Recommended team size and total calendar estimate

Return only: file names created + top 5 technical findings.

---

## ═══════════════════════════════════════════════
## ROUND 6 — The Tribunal Proceedings
## 4 sequential debate rounds using Sequential Thinking MCP
## ═══════════════════════════════════════════════

**Purpose:** Simulated boardroom debate between all personas and technical experts.
All findings from Rounds 1-5 are now fed to a single agent that runs 4 debate rounds.
**Tool:** Sequential Thinking MCP — use it for genuine multi-perspective reasoning.
**Fallback:** Write structured dialogue in markdown if Sequential Thinking MCP is unavailable.
**Output folder:** [OUTPUT_FOLDER]/07-tribunal-proceedings/

**Instructions for the Tribunal Agent:**

You are the moderator of a product tribunal for [PROJECT_NAME].
You have read all research from Rounds 0-5. You will now simulate 4 debate rounds.
Use Sequential Thinking to genuinely think through each perspective before writing.

Read all files from [OUTPUT_FOLDER]/ before starting. Then run 4 debates:

---

**DEBATE ROUND 1 — User Needs (output: `round-1-user-needs.md`)**

Simulate a meeting where all personas from Round 2 present their top priorities.
Each persona gets 3 minutes to argue for their #1 feature request.
Format: "[Persona Name]: I need [feature] because [specific pain point from their research doc].
Without this, [specific negative consequence]."

Then simulate voting: each persona allocates 10 votes across all features.
Tally the votes. Identify:
- Features with consensus (all/most personas want it)
- Features with conflict (one persona's win is another's lose)
- The single most-requested feature (regardless of effort)
- The single most-controversial feature

---

**DEBATE ROUND 2 — Technical Reality Check (output: `round-2-feasibility.md`)**

Simulate the engineering team pushing back on the top-voted features from Round 1.
Technical experts respond to each top-voted feature with:
- "Yes, and we can do it in [timeframe]" (if quick win)
- "Yes, but it requires [X prerequisite] first" (if dependency exists)
- "This is harder than it looks because [specific technical reason]" (if complex)
- "We need to prototype this first before committing" (if high risk)

Identify the true "quick wins" list: high persona priority + low technical effort.
Identify the "must-POC" list: high value features that need validation before full build.

---

**DEBATE ROUND 3 — Design Priority (output: `round-3-design.md`)**

4-way argument between:
- UX Researcher: argues for fixing broken workflows first (users can't do their job)
- UI Designer: argues for visual redesign first (product looks unprofessional, losing deals)
- Power User (most active persona): argues for their #1 workflow need
- Sales/Demo Persona (if exists): argues for "wow factor" features that win demos

Debate the fundamental question: What order do we fix things in?
a) Operations features first (can demo a polished-looking but limited product)
b) Design/visual polish first (makes everything look better but missing features)
c) Both in parallel (more resources, slower pace)
d) Quick wins first, then big bets (pragmatic but may lack coherence)

The debate must reach a consensus decision with explicit rationale.

---

**DEBATE ROUND 4 — Final Prioritization & MoSCoW (output: `round-4-prioritization.md`)**

Classify EVERY feature identified across all rounds into MoSCoW:
- **Must Have** — Product is broken without this. Ship ASAP.
- **Should Have** — Important for competitiveness. Ship within 3 months.
- **Could Have** — Nice to have. Ship when capacity allows.
- **Won't Have (for now)** — Deliberately excluded. Document why.

For Must Have and Should Have features, assign to a phase:
- Phase A (Weeks 1-4): Quick wins + critical fixes
- Phase B (Weeks 5-12): Core experience improvements
- Phase C (Weeks 13-20): Advanced features + market differentiation
- Phase D (Weeks 21+): Enterprise/long-term vision

Final vote: personas + technical experts vote on the complete roadmap.
Record: X votes Yes / Y votes Yes-with-reservations / Z votes No
Document any "No" votes and their specific objections.

---

**DEBATE ROUND 5 (Optional — add if user requests enterprise/specific features)**
Document any special-request features here with full debate treatment.

Return: all 4 debate files written + roadmap approved/rejected status.

---

## ═══════════════════════════════════════════════
## ROUND 7 — Near-Term Roadmap
## 2 agents sequential
## ═══════════════════════════════════════════════

**Purpose:** Detailed sprint plan for Phase A and Phase B (the first 12 weeks).
**Output folder:** [OUTPUT_FOLDER]/08-roadmap/

### Agent A — Phase A Sprint Planner (reads tribunal verdict)

Create `phase-a-sprint-plan.md`:
- Feature list (all Must Have + top Should Have, prioritized)
- Week-by-week breakdown:
  - Week 1-2: Sprint 1 — what ships
  - Week 3-4: Sprint 2 — what ships
- Dependencies (what must be done first)
- Success criteria per sprint
- Risk flags (features that may slip)
- Day-1 action: the single most impactful thing to do on Monday morning

### Agent B — Phase B Planner (reads Phase A plan)

Create `phase-b-plan.md`:
- 8-week plan for core experience improvements
- Design system rollout schedule
- Major workflow redesigns with before/after
- Integration timeline (third-party APIs, services)
- Team size recommendations

Return: file names + the single most important insight from near-term planning.

---

## ═══════════════════════════════════════════════
## ROUND 8 — Long-Term Roadmap + Success Metrics
## 2 agents sequential
## ═══════════════════════════════════════════════

**Purpose:** Phase C+D strategy and a complete metrics framework.
**Output folder:** [OUTPUT_FOLDER]/08-roadmap/

### Agent A — Long-Term Strategist

Create `phase-cd-strategy.md`:
- Phase C: Advanced features that create competitive moat
- Phase D: Enterprise/market differentiator features
- Long-term vision (12+ month horizon)
- Market positioning after full roadmap execution

Create `long-term-vision.md`:
- Where the product could be in 24 months if roadmap executes
- Potential market expansion opportunities
- Features that would make this a category leader

### Agent B — Success Metrics Designer

Create `success-metrics.md`:

For EACH phase (A, B, C, D), define:
- 5-8 measurable KPIs (e.g. task completion time, feature adoption %, NPS, win rate)
- Current baseline value (estimate if unknown)
- Target value after phase completion
- How to measure it (analytics event, survey, A/B test, sales data)
- Review cadence (weekly, monthly, quarterly)

Also create a "North Star Metric" — the single number that represents product health.

Return: file names + top 3 metrics that matter most.

---

## ═══════════════════════════════════════════════
## ROUND 9 — Implementation Specs
## 3-4 batches of 3 agents = 9-12 spec files
## ═══════════════════════════════════════════════

**Purpose:** Detailed, implementation-ready specs for the top features from the tribunal.
**Output folder:** [OUTPUT_FOLDER]/09-implementation-specs/

**How to determine which features get specs:**
Take all "Must Have" features from Round 6 Debate 4. Assign the top 9-12 to agents (3 per batch).
Rank by: user vote count × business impact ÷ effort.

**Instructions for EACH spec agent:**

You are a senior engineer writing an implementation spec for [PROJECT_NAME] using [TECH_STACK].
Create one spec file per feature: `spec-[N]-[feature-name].md`

Each spec MUST include all of the following sections:

**1. Feature Overview**
- What it is (1-2 sentences)
- Why it's needed (pain point it solves, which personas requested it, vote count)
- Where it lives in the product (which page/section/workflow)
- Priority: P0/P1/P2
- Effort estimate: S/M/L/XL
- Recommended phase: A/B/C/D

**2. User Stories (5-8 stories)**
Format strictly as:
"Given [user is in X context],
When [user does Y action],
Then [system does Z result]."

**3. Acceptance Criteria (10+ testable items)**
Numbered list. Each item is a testable statement:
"✅ User can [do X] and sees [Y result]"
"✅ System [does X] within [Y milliseconds/seconds]"
"✅ Error state shows [X] when [Y condition]"

**4. UI/UX Description**
- ASCII wireframe of the key screen(s)
- Component list (what UI elements are needed)
- Interaction description (what happens on each user action)
- Empty state, loading state, error state
- Mobile behavior

**5. Database Changes**
- New tables needed (with column definitions)
- New columns on existing tables
- New indexes
- Migration approach (backward compatible? requires downtime?)

**6. API / Backend Changes**
- New endpoints or procedures needed (with input/output types)
- Business logic description
- Edge cases and validation rules
- Performance considerations

**7. Frontend Components**
- List of components to create or modify
- Props and state for key components
- Data fetching approach (where data comes from)

**8. Test Plan**
- Unit tests: what to test, example test names
- Integration tests: what workflows to test end-to-end
- Edge cases to explicitly test

**9. Rollout Plan**
- Feature flag needed? (Yes/No, flag name)
- Gradual rollout strategy (if high-risk)
- User communication needed (changelog, in-app announcement)
- Monitoring: what metrics to watch after launch

**10. Accessibility & Mobile**
- WCAG requirements for this feature
- Mobile-specific considerations
- Keyboard navigation requirements

Write each spec section by section, saving to file as you go.
Return only: file names created + top 3 implementation risks.

---

## ═══════════════════════════════════════════════
## ROUND 10 — Final Deliverables
## 2 agents sequential
## ═══════════════════════════════════════════════

**Purpose:** Create the documents you'll actually use to drive decisions and start work.
**Output folder:** [OUTPUT_FOLDER]/10-deliverables/

### Agent A — Executive Summary

Read all files from the entire tribunal. Create `executive-summary.md`:

**Page 1: The Problem**
- What triggered this audit (the PROBLEM_STATEMENT)
- Root causes found (top 5, specific and evidence-backed)
- Current state score vs target state score
- Revenue/growth impact of the gaps

**Page 2: The Tribunal Process**
- How many agents, documents, what was researched
- Consensus decisions reached
- Roadmap approval status (X yes / Y with reservations / Z no)

**Page 3: The Roadmap**
- Phase A-D overview (what ships, when, impact)
- Top 5 market differentiators after full execution
- Win rate / conversion / retention targets

**Page 4: Revenue Impact**
- What does completing this roadmap unlock?
- Cost savings (efficiency gains)
- Revenue upside (win rate improvement, new market segments)
- Risk of NOT doing this (competitive risk, churn risk)

**Page 5: Go-Live Criteria**
- What does "done" look like for Phase A?
- Success metrics checklist

### Agent B — Sprint Backlog

Read the Phase A sprint plan and all implementation specs.
Create `phase-a-backlog.md`:

For each feature in Phase A, write a user story card:

```
Story #[N]: [Feature Name]
As a [persona], I want [feature], so that [benefit].
Points: [Fibonacci: 1/2/3/5/8/13]
Sprint: [Week 1-2 / Week 3-4]
Dependencies: [Story #X must be done first, or "none"]
Acceptance Criteria:
  - [ ] [Testable criterion 1]
  - [ ] [Testable criterion 2]
  - [ ] [Testable criterion 3]
Technical Notes: [1-2 sentences on implementation approach]
```

Also create a `day-1-checklist.md`:
The single most impactful thing to do on Day 1 of execution.
Step-by-step instructions to complete it in a single working session.

Return: file names created + the Day 1 action item.

---

## ═══════════════════════════════════════════════
## OUTPUT FOLDER STRUCTURE
## What to expect when the tribunal is complete
## ═══════════════════════════════════════════════

After all rounds complete, [OUTPUT_FOLDER] will contain:

```
[OUTPUT_FOLDER]/
├── 01-existing-synthesis/          (Round 0 — skip if EXISTING_DOCS=none)
│   ├── synthesis.md
│   ├── competitive-positioning.md
│   └── failure-analysis.md
│
├── 02-competitor-research/         (Round 1)
│   ├── [competitor-1].md
│   ├── [competitor-2].md
│   ├── ... (1 file per competitor)
│   ├── competition-matrix.md
│   └── innovation-opportunities.md
│
├── 03-persona-research/            (Round 2)
│   ├── persona-01-[role].md
│   ├── persona-02-[role].md
│   ├── ... (1 file per persona)
│   └── persona-priorities-matrix.md
│
├── 04-feature-research/            (Round 3)
│   ├── [feature-area-1].md
│   ├── [feature-area-2].md
│   ├── ... (1 file per feature area)
│   └── feature-gap-matrix.md
│
├── 05-design-research/             (Round 4)
│   ├── competitor-ui-teardown.md
│   ├── design-language-options.md
│   ├── inspiration-gallery.md
│   ├── component-audit.md
│   └── design-system-roadmap.md
│
├── 06-technical-feasibility/       (Round 5)
│   ├── frontend-feasibility.md
│   ├── backend-feasibility.md
│   ├── performance-analysis.md
│   └── effort-estimation-framework.md
│
├── 07-tribunal-proceedings/        (Round 6)
│   ├── round-1-user-needs.md
│   ├── round-2-feasibility.md
│   ├── round-3-design.md
│   └── round-4-prioritization.md
│
├── 08-roadmap/                     (Rounds 7-8)
│   ├── phase-a-sprint-plan.md
│   ├── phase-b-plan.md
│   ├── phase-cd-strategy.md
│   ├── long-term-vision.md
│   └── success-metrics.md
│
├── 09-implementation-specs/        (Round 9)
│   ├── spec-01-[feature].md
│   ├── spec-02-[feature].md
│   └── ... (9-12 spec files)
│
└── 10-deliverables/                (Round 10)
    ├── executive-summary.md
    ├── phase-a-backlog.md
    └── day-1-checklist.md

Total: ~60-100 markdown files, ~1.5-3MB of research
```

---

## ═══════════════════════════════════════════════
## WHAT TO DO WITH THE RESULTS
## ═══════════════════════════════════════════════

When the tribunal completes:

**Immediate actions:**
1. Read `10-deliverables/executive-summary.md` — the 1-page summary of everything
2. Read `10-deliverables/day-1-checklist.md` — what to do right now
3. Read `08-roadmap/phase-a-sprint-plan.md` — the first 4 weeks in detail
4. Check `07-tribunal-proceedings/round-4-prioritization.md` — tribunal vote results

**Tracking progress:**
- Update your project's STATUS.md: mark Phase A as active (0/N tasks)
- Update your CLAUDE.md or handoff.md: reference this tribunal folder for context
- At session end, update handoff.md with which spec you're working on

**If you disagree with any prioritization:**
Read `round-4-prioritization.md`, find the feature in question, and note the personas
and experts who voted for it. Use this to have an informed discussion about reprioritizing.

**To add features that were classified as "Won't Have":**
Read `round-4-prioritization.md` to see why they were deferred.
Then tell Claude which ones you want to promote and to which phase.

---

## ═══════════════════════════════════════════════
## EXECUTION ORDER — Paste this to Claude to start
## ═══════════════════════════════════════════════

After the intake interview, paste this prompt to Claude and say:

> "Run the full tribunal for [PROJECT_NAME].
> Follow the rounds in order: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10.
> Remember the critical rules: write to files incrementally, max 3 agents parallel,
> use Firecrawl for competitor research, use Sequential Thinking for debates.
> Start with Round 0 (or Round 1 if EXISTING_DOCS=none).
> Report back after each round with: files created, key findings, ready for next round?"

Claude will execute each round and check in between rounds for your feedback or adjustments.
You can pause at any point (e.g., after Round 6) to review findings before proceeding.

---

*Adapt the personas, competitors, and feature areas to your industry for best results.*
*This process has been tested on production projects, generating 60-100 files and ~2MB of research.*

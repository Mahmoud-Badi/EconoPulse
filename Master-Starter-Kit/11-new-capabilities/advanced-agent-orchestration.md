# Advanced Agent Orchestration

> **When to read:** Step 17 (Advanced Capabilities Setup) and any time spawning multi-agent workflows.
> **Prerequisites:** Read `parallel-subagent-orchestration.md` first — this document extends it.
> **Activation:** Add `AGENT_ORCHESTRATION` config to STATE BLOCK during Step 17.
> **Output:** `dev_docs/orchestration/` directory with policy, routing, and communication files.
> **Additive only:** All 7 patterns extend existing kit mechanisms. Nothing is removed or replaced.

---

## Section 1 — CONFIG Extension

Add this block to the STATE BLOCK alongside existing CONFIG fields. None of these keys conflict with existing fields (GATE_MODE, IN_PROGRESS, CURRENT_STEP, etc.).

```yaml
AGENT_ORCHESTRATION:
  ENABLED: true                                          # Set false to disable all 7 patterns
  SUPERVISOR_GATES: ["arch-approval", "design-signoff", "go-live"]
  PARALLEL_DOMAINS: ["frontend", "backend", "database", "design"]
  POLICY_ENABLED: true                                   # Pattern 5: per-role execution budgets
  SKILL_LOADING: "dynamic"                               # Pattern 6: "dynamic" | "full"
  CACHE_TIER: "instructions"                             # Pattern 4: "metadata" | "instructions" | "resources"
  TEAM_COMMS: true                                       # Pattern 7: inter-agent message queue
  VALIDATION_UPFRONT: true                               # Pattern 2: OVP blocks before generation
```

### Step 17 Activation Sequence

When `AGENT_ORCHESTRATION.ENABLED == true`, execute during Step 17 (Advanced Capabilities Setup):

1. **If POLICY_ENABLED:** Run `10-generators/AGENT-POLICY-SCHEMA.md` → produces `dev_docs/orchestration/agent-policies.md` and `dev_docs/orchestration/agent-registry.md`
2. **If SKILL_LOADING == "dynamic":** Copy `04-phase-planning/skill-loading-matrix.md` to `dev_docs/orchestration/skill-loading-matrix.md` (project-specific copy, customizable)
3. **If TEAM_COMMS:** Create `dev_docs/orchestration/agent-comms.md` and `dev_docs/orchestration/knowledge-graph-updates.md` (both empty with header only)
4. **If VALIDATION_UPFRONT:** Create `dev_docs/orchestration/ovp-log.md` (empty with header only)
5. **Always:** Create `dev_docs/orchestration/agent-registry.md` and `dev_docs/orchestration/escalations.md`
6. Update `session-context.md` with the orchestration config that was activated

---

## Section 2 — Pattern 1: Agent Supervisor

### Problem It Solves

The kit already has 27+ gate checkpoints. In `semi-auto` mode, 6 structural gates pause for review. But this is still either too many (blocks flow) or too few (misses critical decisions). The Agent Supervisor pattern reclassifies gates into Supervisor Gates (require human) and Informational Gates (auto-pass), making the tradeoff explicit and project-configurable.

### How It Integrates

Adds `supervised` as a new valid value for `GATE_MODE`. Existing values (`manual`, `semi-auto`, `auto`) are unchanged. In `supervised` mode, only the 3 Supervisor Gates pause — all other gates auto-pass with logged summaries.

**Updated GATE_MODE options:**

| Mode | Behavior |
|------|----------|
| `manual` | All gates pause for human approval (existing, unchanged) |
| `semi-auto` | 6 structural gates pause (existing, unchanged) |
| `supervised` | **NEW** — Only 3 Supervisor Gates pause; all others auto-pass |
| `auto` | All gates auto-pass with logged summaries (existing, unchanged) |

### Supervisor Gate Definitions

| Gate ID | Trigger | What to Review | Auto-Pass Criteria (if supervisor unavailable) |
|---------|---------|---------------|-----------------------------------------------|
| `arch-approval` | End of Step 5 (service specs complete) | Service count, entity model, API surface — 3-5 minutes max | All service specs ≥8/10 depth AND unmapped features == 0 |
| `design-signoff` | End of Step 6 (screen specs complete) | Top 3 screens by user frequency (not all screens) | All screen specs ≥7/10 depth |
| `go-live` | End of Step 16 (pre-handoff verification) | Completeness dashboard + open risk items | All 16 enforcement gates pass |

### Supervisor Checkpoint Format

When a Supervisor Gate triggers, present this block:

```
⏸ SUPERVISOR GATE: [gate-id]
Triggered by: [step that completed]

Reviewable artifacts:
  → [path 1]
  → [path 2] (if applicable)

Focus areas for review:
  [2-3 specific questions the supervisor should answer]

Auto-pass status: [ELIGIBLE if criteria met | BLOCKED if criteria not met]
Auto-pass criteria not met: [list which checks failed, if any]

Options:
  A) Approve — proceed to next step
  B) Approve with notes — add notes to session-context.md, then proceed
  C) Reject — specify what must change before re-review
```

### Failure Modes

**Supervisor unavailable AND auto-pass criteria not met:** Gate BLOCKS execution. Announce: "Supervisor gate blocked. Auto-pass criteria: [list failed checks]. Resolve before proceeding." Write to `handoff.md`: "BLOCKED at [gate-id] — awaiting supervisor."

**Supervisor approves a spec that later fails depth verification:** Supervisor approval is advisory on architecture direction only. It does NOT bypass mechanical depth checks at Steps 31-32. Depth failures are caught during hardening regardless of prior approval.

---

## Section 3 — Pattern 2: Objective-Validation Protocol (OVP)

### Problem It Solves

The TTG (Think-Then-Generate) protocol already requires 5-8 questions answered before generation. But TTG is reasoning — it doesn't produce measurable success criteria, and it doesn't mandate a separate validator. OVP adds: (1) explicit measurable criteria declared BEFORE execution, (2) mandatory adversarial validation by a separate agent, (3) a PASS/FAIL verdict with structured diff.

### How It Integrates

OVP runs **after** TTG reasoning and **before** generation begins for Steps 5, 6, and 8. It does not replace TTG — it extends it. The OVP block is stored in `dev_docs/orchestration/ovp-log.md` (one entry per major generation).

**Protocol order:**
```
TTG (Think-Then-Generate reasoning) → OVP Block declared → Generation executes → OVP Validation runs → PASS | FAIL | PARTIAL
```

### OVP Block Template (copy verbatim)

```markdown
## OVP Block — [STEP NAME] — [ARTIFACT NAME]
**Declared before execution on:** [date and step number]
**Generating agent:** [role / agent-id]
**Validating agent:** [different role — NEVER the same agent that generated]

### Success Criteria
| # | Criterion | Measurement Method | Pass Threshold |
|---|-----------|-------------------|----------------|
| 1 | Word count | Count words in output | ≥ [1500 service / 800 screen / 350 task] |
| 2 | Business rules | Count items under ## Business Rules | ≥ 8 |
| 3 | API endpoints | Count rows in ## Endpoints table | ≥ 7 |
| 4 | Real entity references | Entities from intake/tribunal docs appear | ≥ 1 per 200 words |
| 5 | States documented | Count states in ## States section | ≥ 8 (screen) / ≥ 6 (error scenarios) |
| 6 | Edge cases | Count items under ## Edge Cases | ≥ 8 (service) / ≥ 4 (screen) |

### Post-Execution Verdict
**Validator agent ran:** yes | no
**Result:** PASS | FAIL | PARTIAL
**Diff:**
  - Criterion 1 ([actual]): PASS | FAIL
  - Criterion 2 ([actual]): PASS | FAIL
  - Criterion 3 ([actual]): PASS | FAIL
  - [...]
**Action if FAIL:** Re-generate failing sections only (not the whole file). Re-run OVP. Max 3 iterations.
**Action if 3 iterations exhausted without PASS:** Escalate to human. Flag in handoff.md. Block step completion.
```

### Critical Rules

1. **Criteria are set BEFORE execution.** They cannot be revised downward after seeing the output. An agent that sets criteria, generates output, then lowers the bar to match has invalidated OVP.
2. **The validating agent MUST be separate.** Spawn via Agent tool or clink. In-line self-validation is forbidden. Tag the validator agent with role `ovp-validator-{artifact-slug}`.
3. **Iteration cap is 3.** After 3 failed attempts, the issue is structural — more generation won't fix it. Escalate with the OVP diff as evidence.
4. **Append to ovp-log.md.** Every OVP block (including result) is appended to `dev_docs/orchestration/ovp-log.md`. This creates an audit trail of what was validated and when.

### Failure Modes

**Same agent validates its own output:** Invalidates OVP. The validator must be spawned with a fresh context that does not include the generator's reasoning.

**Criteria set too low to guarantee a pass:** OVP criteria have minimums (column thresholds). Any criterion set below the kit's depth requirements (DEPTH-REQUIREMENTS.md) is invalid. Use the depth requirements thresholds as floor values.

---

## Section 4 — Pattern 3: Parallel Domain Routing

### Problem It Solves

The kit documents fan-out/fan-in and Domain Partitioning patterns (parallel-agent-patterns.md). But agents still decide ad-hoc which tasks to parallelize and what context to give each agent. The Domain Router fixes this: every task is pre-assigned to one of 4 domains, domain agents receive pre-loaded context specific to that domain, and a fixed pipeline sequencing prevents dependency violations.

### How It Integrates

The Domain Router runs during Step 8 (Task Generation) after task files exist. Each task's reading list category (Backend / Frontend / Database) from `04-phase-planning/pre-task-reading-lists.md` IS its domain assignment — no separate routing step needed. Domain agents use the Short-Lived Agent naming convention from parallel-subagent-orchestration.md §3.

### Domain Router Table

| Domain | Trigger Condition | Pre-Loaded Context (additions to standard reading list) | Merge Step Owner |
|--------|------------------|---------------------------------------------------------|-----------------|
| `database` | Task creates/modifies: schema, migrations, seed files | Schema overview + naming conventions + soft-delete spec | Main orchestrator |
| `backend` | Task creates/modifies: routers, services, repositories, validators | Service hub for target service + auth patterns + error catalog | Main orchestrator |
| `design` | Task creates/modifies: design tokens, Storybook stories, primitive UI components | Design system file + component primitive mapping + design tokens | Main orchestrator |
| `frontend` | Task creates/modifies: pages, composite components, hooks | Screen spec for target screen + component catalog + design tokens | Main orchestrator (runs AFTER backend) |

### Pipeline Sequencing (Mandatory)

```
Stage 1: database domain agents
  (establishes entity contracts — all other domains depend on this)
         ↓ Wait for Stage 1 to complete
Stage 2: backend domain agents     ← run in parallel
         design domain agents      ← run in parallel
  (backend builds on DB contracts; design is independent of both)
         ↓ Wait for Stage 2 to complete
Stage 3: frontend domain agents
  (frontend consumes backend API contracts + design system — must come last)
         ↓
Stage 4: Main orchestrator — merge
  (barrel exports, root router, API catalog update, STATUS.md update)
```

**Dependency lock:** Before spawning Stage 3 (frontend), the orchestrator MUST verify `dev_docs/specs/contracts/api-catalog.md` reflects Stage 2 completions. If missing: block Stage 3.

### Agent Limits Per Domain

Maximum 3 agents running simultaneously within any single domain. This extends the existing 3-5 total agent limit from parallel-agent-patterns.md — per-domain, not global.

### Forbidden Operations for Domain Agents

Domain agents CANNOT write to:
- `STATUS.md`
- `handoff.md`
- `session-context.md`
- `DEVLOG.md`
- `master-tracker.md`
- Any shared index file

These are orchestrator-only writes. Domain agents write their assigned artifacts only. This extends the existing anti-pattern rule from parallel-agent-patterns.md.

### Failure Modes

**Frontend domain starts before backend contracts are ready:** The dependency lock prevents this. If an agent attempts to skip the lock, fail loudly: "Stage 3 blocked — api-catalog.md not updated from Stage 2."

**Two domain agents write to a shared file (e.g., both backend and design update a barrel export):** Pre-assign ownership. Barrel exports belong to the merge step (Stage 4, main orchestrator). Flag in agent-comms.md if a domain agent needs to signal a barrel export update.

---

## Section 5 — Pattern 4: Prompt Caching Strategy

### Problem It Solves

The kit's SKILL.md files already use progressive disclosure (documented in parallel-subagent-orchestration.md §5). But this is informal — no agent knows which content belongs in which tier, and large templates get loaded eagerly even when only a small section is needed. This pattern formalizes the 3-tier structure into an explicit cache policy with version tracking.

### Tier Definitions

| Tier | Size Budget | Content | When Loaded | Cache Benefit |
|------|------------|---------|-------------|---------------|
| **Metadata** | ≤ 100 tokens | Skill name, one-line description, trigger condition, version number | Always (every context) | Minimal — always needed |
| **Instructions** | ≤ 5,000 tokens | Step-by-step workflow, decision rules, output format | On skill invocation | High: same skill reused across sessions |
| **Resources** | Varies | Templates, reference tables, example outputs | On-demand: only the specific section being written | Maximum: large templates only loaded when writing that artifact type |

### Key Caching Candidates in This Kit

| Content | Tier | Rationale |
|---------|------|-----------|
| ORCHESTRATOR STATE BLOCK + CONFIG schema | Metadata | Read every new session — cache only this section, not the full 300+ step doc |
| Pre-task reading lists (universal 4 items) | Instructions | Read before every task — high reuse |
| Skill invocation guide table (per-step skills) | Instructions | Consulted at every step — reuse is near 100% |
| Service spec template (full) | Resources | Used once per service, not per session |
| Screen spec template (full) | Resources | Used once per screen type |
| DEPTH-REQUIREMENTS.md (scoring rubrics) | Instructions | Read during spec generation and auditing |

### Token Savings Estimate

| Content Type | Reuse Rate | Cache Tier | Estimated Savings Per Project |
|-------------|-----------|-----------|-------------------------------|
| ORCHESTRATOR STATE BLOCK header (~300 tokens) | Every session | Metadata | ~300 tokens × N sessions |
| Pre-task reading lists (universal 4 items, ~800 tokens) | Every task | Instructions | ~800 × task count |
| Service spec template full (~1,200 tokens) | Once per service | Resources | ~1,200 × (services - 1) |
| Skill invocation guide (~600 tokens) | Every step | Instructions | ~600 × step count |

Combined effect across a Standard path (20+ steps, 30+ tasks, 8+ services): estimated **85-92% reduction** in repeated context loading compared to loading all content fresh every invocation.

### Cache Versioning

Every cached document must include a `version` field in its metadata tier:

```
version: "2026-03-19"   # Date of last meaningful update
```

Agents compare the cached version against the source file's modification date. If stale, reload from source. This prevents agents from using outdated templates after kit updates.

### Failure Modes

**Agent loads the full template when only writing one section:** Instruct agents to load only the specific section being written. Use heading anchors: "Read only the ## Data Model section of the service-spec template."

**Stale cache from a kit update:** The version field catches this. If an agent notices the source file is newer than the cached version, it must reload and update its cached copy.

---

## Section 6 — Pattern 5: Agentic Runtimes with Policy-Driven Schemas

### Problem It Solves

Agents can spiral: re-reading the same files, regenerating outputs that already exist, or running past their useful context window without producing results. There is no external runtime enforcing limits — but agents can enforce them on themselves if given explicit policies. This pattern adds per-role execution policies that agents read before starting and self-enforce throughout.

### How It Integrates

The full policy schema is in `10-generators/AGENT-POLICY-SCHEMA.md`. This section provides the summary view — how policies map to the L0-L3 hierarchy and what the anti-spiral mechanism looks like at runtime.

### Policy-per-Role Summary

| Agent Role | Max Steps | Error Retry Budget | Allowed Tools | Escalation Target |
|-----------|-----------|-------------------|---------------|-------------------|
| L0 Meta-Orchestrator | Unlimited | 0 (escalates to human) | All tools | Human via GATE |
| L1 Domain Orchestrator | 50 steps per phase | 3 retries then escalate | Read, Write, Bash, Agent, Skill | L0 |
| L2 Coordinator | 20 steps per deliverable | 2 retries then escalate | Read, Write, Agent | L1 |
| L3 Worker | 10 steps per task | 1 retry then escalate | Read, Write only | L2 |

**L3 workers NEVER spawn subagents.** No Agent tool. No Skill tool. They read files and write files only. This is the most important boundary in the policy system.

### Anti-Spiral Protocol

When any L1/L2/L3 agent exceeds its step budget:

```
Step budget exceeded
        ↓
1. Write current output state to assigned artifact file (even if incomplete)
2. Append escalation record to dev_docs/orchestration/escalations.md
3. Update step-counter file: STATUS: escalated
4. Stop work — return control to parent agent
```

The parent agent receives the escalation, assesses the partial output, and either continues in a new agent invocation or escalates further up the hierarchy.

### Failure Modes

**Agent ignores its policy and continues running:** Detectable via Post-Task Protocol. If DEVLOG.md shows more steps than the policy limit for a single invocation, flag it. The existing `commit-state-check` hook can be extended to validate step counts against policy limits.

**L3 worker attempts to use Agent tool:** Policy explicitly bans this. If a worker identifies work that requires spawning a subagent, it escalates to L2 instead. L2 decides whether to spawn.

**Full policy schema:** See `10-generators/AGENT-POLICY-SCHEMA.md`.

---

## Section 7 — Pattern 6: Dynamic Skill Loading

### Problem It Solves

The ORCHESTRATOR's Skill Invocation Guide lists which skills to invoke per step. But there is no enforcement: agents load whatever skills seem relevant, context balloons, and by Step 16 the context window is at 70%+ before any spec is written. Dynamic Skill Loading adds a budget layer: for each step and task type, only 3-4 skills are permitted, and a `Do Not Load` list prevents high-cost skills from being loaded when they are irrelevant.

### How It Integrates

The full matrix is in `04-phase-planning/skill-loading-matrix.md`. This section provides the routing logic and budget tiers. The matrix and the ORCHESTRATOR's Skill Invocation Guide are complementary: the guide says WHAT is appropriate, the matrix enforces HOW MANY.

**If they conflict:** The matrix takes precedence for budget enforcement. The guide is canonical for skill selection. Both must be satisfied simultaneously.

### Routing Logic (Decision Tree)

```
1. What is CURRENT_STEP?
   → Look up step range in skill-loading-matrix.md
   → Load all skills in "Always Load" column (≤ 2 skills)
   → Evaluate "Conditional Load" column — load only if CONFIG condition matches
   → Never load skills in "Do Not Load" column for this step range

2. What is the task type?
   → backend task:     load code-review; conditional: anti-pattern-check
   → frontend task:    load frontend-design (if new screen); conditional: playwright
   → database task:    no skill additions (reading list sufficient)
   → integration task: load context7, firecrawl
   → e2e test task:    load playwright
   → mobile task:      load frontend-design; conditional: platform-specific

3. What is the context budget level?
   → Healthy (< 40% full):   up to 4 skills
   → Moderate (40-60% full): Always Load only (max 2)
   → Tight (60-80% full):    0 skills — reading lists only
   → Critical (> 80% full):  Stop work; write state; signal session boundary
```

### Context Level Estimation

Estimate context usage: count approximate lines of conversation output ÷ 4,000 (approximate lines per 150k token window for Claude Sonnet 4.x). If above 60%, reduce skill loading immediately.

**Full loading matrix:** See `04-phase-planning/skill-loading-matrix.md`.

---

## Section 8 — Pattern 7: Agent Team Inter-Communication

### Problem It Solves

Parallel subagents currently report back to the main orchestrator only. They cannot challenge each other's assumptions, flag contradictions, or coordinate on shared decisions. Pattern 7 adds: (1) a message queue file for worker-to-worker communication, (2) a Challenge Protocol for structured objections, and (3) a knowledge graph update protocol so decisions made by one agent are visible to all others before they proceed.

### How It Integrates

Extends the Worker Heartbeat / Event Loop from parallel-subagent-orchestration.md §8. The existing pattern handles lead-to-worker messaging. This pattern adds a worker-to-worker side channel via a shared file. The lead agent processes this channel on each heartbeat alongside its normal ON handlers.

### Message Queue File

`dev_docs/orchestration/agent-comms.md` — append-only, processed on heartbeat, archived after processing.

**Format:**
```markdown
## Message — [timestamp] — [message-type]
**From:** [agent-id]
**To:** [target-agent-id] | orchestrator | all
**Type:** challenge | coordination | info | shutdown-request
**Re:** [artifact or decision being referenced]
**Body:**
[message content]
**Resolution required by:** step [N] | end-of-stage-[N] | urgent
---
```

**Lead agent heartbeat processing:**
1. Read all unprocessed entries in agent-comms.md
2. For `challenge` type: evaluate and route (see Challenge Protocol below)
3. For `coordination` type: update knowledge-graph-updates.md with any decision changes
4. For `info` type: acknowledge, no action required
5. Move processed entries to `dev_docs/orchestration/agent-comms-archive.md`
6. Active file retains only unprocessed messages

### Challenge Protocol Template (copy verbatim)

```markdown
## Challenge Entry — [timestamp]
**From:** [challenger agent-id]
**To:** [target agent-id]
**Re:** [artifact name and specific section being challenged]
**Type:** challenge

**Assumption being challenged:**
[Exact claim or decision the challenger disagrees with — specific, not general]

**Evidence for challenge:**
[File path, line, or section reference that supports the objection — not just opinion]

**Proposed alternative:**
[What the challenger believes should replace the assumption — specific]

**Impact if unchallenged:**
[What fails downstream if this assumption proceeds to implementation]

**Resolution required by:** step [N]
---
```

### Challenge Routing Rules

| Challenge Status | Condition | Action |
|----------------|-----------|--------|
| **Active** | Resolution step is in the future AND the challenged gate has not passed | Lead evaluates; routes to target agent or escalates to human |
| **Stale** | Resolution step has passed OR the challenged gate already auto-passed | Mark STALE; route to next Supervisor Gate for human review |
| **Auto-resolved** | The challenged decision is within L2/L3 scope | Lead agent applies the proposed alternative directly |
| **Escalated** | L1+ scope — architectural decision | Route to human at next Supervisor Gate |

### Knowledge Graph Update Protocol

When any agent completes work that changes a documented decision (entity model, API contract, routing decision, architectural choice), it MUST append a knowledge graph entry to `dev_docs/orchestration/knowledge-graph-updates.md` **before its turn ends**.

```markdown
## KG Update — [timestamp]
**Agent:** [agent-id]
**MCD Section affected:** [1-Overview | 2-Architecture | 3-Data Models | 4-API Contracts | 5-Task Registry | 6-Decisions Log | 7-Known Issues | 8-Completion Criteria]
**Change:**
  Previous: [what was true before]
  New: [what is true now]
**Reason:** [one sentence]
**Affects agents:** [list agent-ids or "all" if domain-wide]
---
```

The lead agent applies pending KG updates on each heartbeat before dispatching new work. This ensures agents in Stage 3 always see Stage 2 decisions.

### Failure Modes

**agent-comms.md grows unbounded:** Lead archives processed entries after each heartbeat. The active file should never contain processed messages. If archiving is skipped, the file grows and eventually becomes too large to read in one pass — detect by file size.

**Challenge filed for a locked decision (past SB boundary):** Mark as STALE. Route to next Supervisor Gate. Do not re-litigate settled architectural decisions at the agent level — that path leads to infinite debate loops.

**Two agents simultaneously write to agent-comms.md:** Both appending is safe — each entry is self-contained (append-only). Last-writer-wins is acceptable since entries are non-overlapping. If the file is corrupted by concurrent writes, the lead flags it in escalations.md and rebuilds from archive.

---

## Section 9 — Runtime Integration Sequence

### During Kit Setup (Steps 0-2)

No activation yet. The `advanced-agent-orchestration.md` and `parallel-subagent-orchestration.md` files are added to Step 0's ecosystem reading list. The AGENT_ORCHESTRATION config block is added to the STATE BLOCK template alongside existing CONFIG.

### During Step 17 (Advanced Capabilities Setup)

Execute the activation sequence from Section 1. Create all `dev_docs/orchestration/` files. Update SESSION-CONTEXT with which patterns were activated and why.

### During Planning Steps (Steps 3-16)

- **Step 5 (Service Specs):** OVP block declared before each spec → Supervisor Gate `arch-approval` at step end
- **Step 6 (Screen Specs):** OVP block declared before each screen spec → Supervisor Gate `design-signoff` at step end
- **Step 8 (Task Generation):** Domain Router assigns each task to a domain; pipeline sequencing spec written to `dev_docs/orchestration/domain-routing-plan.md`
- **Step 16 (Pre-Handoff Verification):** Supervisor Gate `go-live` evaluates completeness dashboard

### During Development Phases (Post SB-4)

For each development session:
1. Check skill-loading-matrix.md for step range → load only permitted skills
2. Declare OVP block for the artifact being generated → store in ovp-log.md
3. Spawn domain-specific agents per Domain Router assignment
4. Monitor agent-comms.md on each heartbeat → process challenges + KG updates
5. At each GATE: check if Supervisor Gate → pause; otherwise auto-pass with logged summary

### After Each Task

The existing Post-Task Protocol (5 file updates) remains unchanged. The orchestration layer adds one additional step:
- If any KG updates exist in knowledge-graph-updates.md since last heartbeat: apply them before starting next task

---

## Section 10 — Additive Guarantees

This is the definitive list of what is NOT changed by any of the 7 patterns:

| Existing Mechanism | How It Is Preserved |
|--------------------|---------------------|
| `manual`, `semi-auto`, `auto` GATE_MODE values | `supervised` is additive. All three existing values work exactly as before. |
| TTG (Think-Then-Generate) protocol | OVP runs after TTG. TTG is not shortened or replaced. |
| Fan-out/fan-in pattern | Domain Routing extends it. Fan-out/fan-in still works for non-domain tasks. |
| Pipeline Stages pattern | Domain Routing uses it. The pattern itself is unchanged. |
| Existing SKILL.md tier structure | Pattern 4 formalizes what already exists. No SKILL.md files need to be rewritten. |
| ORCHESTRATOR.md step sequence (all 46 steps) | Policies are declarations agents read. No step is removed or reordered. |
| Skill Invocation Guide in ORCHESTRATOR.md | Skill loading matrix adds budget enforcement. The guide remains canonical for skill selection. |
| Agent Teams heartbeat pattern (parallel-subagent-orchestration.md §8) | agent-comms.md is an additional side channel. The heartbeat mechanism is unchanged. |
| All existing state files (STATUS.md, handoff.md, DEVLOG.md, session-context.md) | Domain agents are forbidden from writing these. Orchestrator writes them as before. |
| Post-Task Protocol (5 mandatory file updates) | Unchanged. One optional addition (KG update check) runs before the next task, not during. |
| Cross-Reference Validator (12 consistency checks) | OVP validation is additional, upstream. The validator still runs at Step 16 as before. |
| MECHANICAL-DEPTH-CHECKER.md | OVP uses depth check thresholds as minimums. The checker still runs during hardening. |

---

## Cross-References

- `11-new-capabilities/parallel-subagent-orchestration.md` — foundational patterns this document extends
- `10-generators/AGENT-POLICY-SCHEMA.md` — full policy schema for Pattern 5 (agentic runtimes)
- `04-phase-planning/skill-loading-matrix.md` — full loading matrix for Pattern 6 (dynamic skill loading)
- `10-generators/DEPTH-REQUIREMENTS.md` — thresholds used as OVP criteria floor values
- `04-phase-planning/pre-task-reading-lists.md` — task type taxonomy used by Domain Router
- `06-development-workflow/parallel-agent-patterns.md` — fan-out/fan-in and Domain Partitioning that Pattern 3 extends

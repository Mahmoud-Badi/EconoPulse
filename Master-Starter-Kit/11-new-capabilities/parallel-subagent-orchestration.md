# Parallel Subagent Orchestration

**Source repos cloned to:** `C:/Users/USER/claude-tools/`
**Last updated:** 2026-03-19

Patterns extracted from production multi-agent systems for use in Master Kit GSD and Kit phases.

> **Extended by:** `11-new-capabilities/advanced-agent-orchestration.md`
> That document integrates 7 production orchestration patterns into the kit. Read it before using
> Agent Teams, parallel spawning, or skill invocation in multi-session workflows.
> Key extensions: `supervised` Gate Mode (Pattern 1), OVP blocks (Pattern 2), Domain Router (Pattern 3),
> Prompt Caching tiers (Pattern 4), Policy Schema (Pattern 5), Skill Loading Matrix (Pattern 6),
> Challenge Protocol (Pattern 7).

---

## 1. Four-Level Skill Hierarchy

*Source: [levnikolaevich/claude-code-skills](https://github.com/levnikolaevich/claude-code-skills) — `SKILL_ARCHITECTURE_GUIDE.md`*

```
L0  Meta-Orchestrator     Coordinates Agent Teams (TeamCreate)
     └─ L1  Domain Orchestrators   High-level coordinators per domain
            └─ L2  Coordinators    Mid-level workflow managers
                   └─ L3  Workers  Single-responsibility executors (minimal context)
```

### Mapping to Master Kit Phases

| Master Kit Phase | Hierarchy Role | Skill Example Pattern |
|-----------------|---------------|----------------------|
| ORCHESTRATOR.md (step driver) | L0 Meta-Orchestrator | Reads state, delegates phase skills |
| Phase skills (01-tribunal, 02-arch…) | L1 Domain Orchestrator | Coordinates subskills within the phase |
| Section generators (spec sections, diagrams) | L2 Coordinator | Manages a specific deliverable |
| Individual writers (one file, one section) | L3 Worker | Writes exactly one artifact |

### Core Rules

- **L3 workers load minimal context.** Do not pass the full project brief — pass only what the worker needs.
- **Fresh worker per stage.** Prevents context exhaustion. Never reuse a worker across phases.
- **One worker = one responsibility.** A worker invokes a single skill and reports the result.
- **Embed effort budgets in prompts.** Specify "high"/"medium"/"low" — never let agents decide their own effort level.

---

## 2. Orchestrator-Worker Pattern

*Source: levnikolaevich/claude-code-skills, backed by Anthropic's "Building Effective Agents" (2026)*

**Proven result: 90.2% performance improvement on complex tasks** (Anthropic Multi-Agent Research System, 2025)

```
Orchestrator
├── Loads context (reads project state)
├── Makes routing decisions
├── Delegates to Workers via Agent/Skill tool
└── Manages workflow state, checkpoints

Workers (spawned per task)
├── Receive scoped inputs only
├── Execute single-responsibility work
└── Return structured result to orchestrator
```

### Delegation Pattern Selection

| Condition | Use Subagents (Agent tool) | Use Agent Teams (TeamCreate) |
|-----------|--------------------------|------------------------------|
| Workers are independent | ✅ | |
| Only result matters, not discussion | ✅ | |
| Workers need to message each other | | ✅ |
| Shared task list / self-coordination | | ✅ |
| Complex multi-stage lifecycle | | ✅ |
| Lower token cost priority | ✅ | |
| Domain routing needed (frontend/backend/database/design) | ✅ Use Domain Router from `advanced-agent-orchestration.md` §4 | |
| OVP validation required (output needs adversarial scoring) | | ✅ Spawn dedicated `ovp-validator-{slug}` worker |

---

## 3. Short-Lived Agent Pattern

*Source: [rinadelph/Agent-MCP](https://github.com/rinadelph/Agent-MCP)*

Each agent lives **only as long as its specific task.** Core benefits:
- Eliminates context pollution across phases
- Reduces security risk surface
- Forces clean input/output contracts

```
Task assigned → Agent spawned → Task completed → Agent shutdown
                                      ↓
                              Result stored in shared knowledge graph
                              (persistent across all agents)
```

### Unique Worker Naming Convention (prevents race conditions)

```
{domain}-{task-id}-s{stage}-cycle{n}

Examples:
  spec-auth-s1-cycle1      # spec domain, auth task, stage 1, first cycle
  diagram-erd-s2-cycle1    # diagram domain, ERD task, stage 2
  audit-security-s1-fix1   # audit domain, security, stage 1, first fix
```

---

## 4. Parallel Multi-Model Review

*Source: levnikolaevich/claude-code-skills — `ln-620-codebase-auditor` and multi-model review system*

For quality gates in GSD phases, run parallel review agents and resolve via consensus:

```
Primary agent produces output
         ↓
    ┌────┴────┐
Reviewer A  Reviewer B    (run simultaneously in background)
    └────┬────┘
         ↓
  Claude validates: AGREE / DISAGREE / UNCERTAIN
         ↓
  If DISAGREE → debate round (max 2 rounds)
  If confidence ≥ 90% AND impact > 2% → apply suggestion
  If external agents unavailable → fallback to Claude Opus
```

**Audit trail:** Save all reviews to `.agent-review/{agent}/` for transparency.

---

## 5. Progressive Disclosure for SKILL.md Files

*Source: travisvn/awesome-claude-skills — progressive disclosure architecture*

Structure every Master Kit SKILL.md in three load tiers:

| Tier | Size | When Loaded | Contents |
|------|------|-------------|----------|
| **Metadata** | ~100 tokens | Always | name, description, trigger conditions |
| **Instructions** | < 5k tokens | When skill is invoked | workflow steps, decision rules |
| **Resources** | Varies | Only when needed | templates, examples, reference tables |

**SKILL.md token efficiency targets** (from levnikolaevich research):

| Technique | Savings |
|-----------|---------|
| Concise terms (replace verbose phrases) | -30 to -40% |
| Remove filler words | -40 to -50% |
| Active voice | -15 to -20% |
| Chunked phases (Phase 1 \| Phase 2 \| …) | -20% |

---

## 6. Shared Knowledge Graph (Cross-Agent State)

*Source: rinadelph/Agent-MCP — Main Context Document (MCD) pattern*

The MCD is a persistent document that all agents share as their single source of truth. Prevents:
- Context loss between sessions
- Agents making contradictory decisions
- Duplication of work across parallel agents

**MCD 8-Section Structure:**

```
1. Overview & Goals          — vision, users, success criteria
2. Technical Architecture    — stack, APIs, infra decisions
3. Data Models               — schema, relationships, constraints
4. API Contracts             — endpoints, request/response shapes
5. Agent Task Registry       — who owns what, current status
6. Decisions Log             — why choices were made (prevents re-litigation)
7. Known Issues              — blockers, workarounds
8. Completion Criteria       — measurable done conditions
```

**Master Kit application:** Use the project's `00-discovery/` output as the MCD seed. Update it after each Kit phase so all subsequent agents have accurate state.

---

## 7. Evaluator-Optimizer Loop

*Source: lastmile-ai/mcp-agent — composable workflow patterns*

For outputs requiring quality gates (spec docs, architecture decisions, test plans):

```
Generator agent produces draft
         ↓
Evaluator agent critiques against criteria
         ↓
  Pass?  ──Yes──→  Accept output
    │
    No
    ↓
Optimizer agent revises
         ↓
Loop (max 3 iterations, then escalate)
```

**When to use:** Spec sections, ADRs, task decompositions, any output where "first draft = final" is unacceptable.

---

## 8. Worker Heartbeat / Event Loop (Agent Teams)

*Source: levnikolaevich/claude-code-skills — `AGENT_TEAMS_PLATFORM_GUIDE.md`*

When using Agent Teams (not subagents), the heartbeat pattern drives coordination:

```
Lead turn ends
    → Stop hook fires (exit 2)
    → NEW agentic loop starts
    → Queued worker messages delivered
    → Lead processes ON handlers
    → Turn ends → next heartbeat (60s optimal)
```

**Anti-patterns to avoid:**

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `sleep` + filesystem polling | Let turn end; hook drives heartbeat |
| Reading `~/.claude/` internals | Messages arrive as conversation turns automatically |
| Lead says "waiting…" then stops | Lead must keep turn active until heartbeat fires |
| Force-kill worker | `shutdown_request` → worker approves → exits gracefully |

---

## 9. clink — Isolated Subagent Spawning (PAL MCP)

*Source: BeehiveInnovations/pal-mcp-server — `clink` tool*

`clink` spawns an isolated CLI instance from within the current session:

```
Main session → clink("role: code-reviewer, task: review PR #42")
                      ↓
              Isolated agent with scoped context
                      ↓
              Returns structured result to main thread
              (without polluting main context window)
```

**Available via:** PAL MCP server (configured in `mcpServers` — see setup below)

**Built-in PAL tools for orchestration:**

| Tool | Purpose |
|------|---------|
| `clink` | Spawn isolated role agent |
| `consensus` | Multi-model agreement protocol |
| `thinkdeep` | Extended reasoning on a problem |
| `planner` | Structured task decomposition |
| `challenge` | Critical analysis / devil's advocate |
| `apilookup` | Live API docs (prevents stale training data) |

---

## 10. Setup Reference

### Repos Cloned Locally

| Repo | Local Path | Key Docs |
|------|-----------|---------|
| levnikolaevich/claude-code-skills | `C:/Users/USER/claude-tools/claude-code-skills/` | `docs/architecture/SKILL_ARCHITECTURE_GUIDE.md`, `AGENT_TEAMS_PLATFORM_GUIDE.md` |
| rinadelph/Agent-MCP | `C:/Users/USER/claude-tools/Agent-MCP/` | `docs/mcd-guide.md`, `docs/getting-started.md` |

### MCP Servers (Active)

Configured in `~/.claude/settings.json` (global) and `.mcp.json` (project):

| Server | Purpose | Status |
|--------|---------|--------|
| `pal-mcp-server` | Subagent spawning via `clink`, multi-model consensus | ✅ Configured (needs OPENROUTER_API_KEY) |
| `Agent-MCP` | Shared knowledge graph for cross-agent state | ✅ Configured (needs server running: `uv run -m agent_mcp.cli`) |

### Starting Agent-MCP Server

```bash
cd C:/Users/USER/claude-tools/Agent-MCP
cp .env.example .env
# Edit .env: add OPENAI_API_KEY for embeddings
uv venv && uv pip install -e .
uv run -m agent_mcp.cli --port 8080 --project-dir /path/to/your/project
```

Then open dashboard: `cd agent_mcp/dashboard && npm run dev`

### Installing mcp-agent (Python framework)

```bash
uv add "mcp-agent[anthropic]"
uvx mcp-agent init
```

Use for: map-reduce workflows, evaluator-optimizer loops, durable long-running agent pipelines.

### uberSKILLS (Skill IDE)

```bash
npx @uberskillsdev/uberskills
# Opens at http://localhost:3000
# Design, test, and deploy SKILL.md files before committing
```

---

## 11. Integration Index (advanced-agent-orchestration.md)

The advanced orchestration guide (`11-new-capabilities/advanced-agent-orchestration.md`) extends the following sections of this document with 7 production patterns. Read it before using Agent Teams, parallel spawning, or skill invocation in multi-session workflows.

| This Section | Extended By | New Capability Added |
|-------------|-------------|---------------------|
| §1 Four-Level Skill Hierarchy | Pattern 5 (Policy Schema) | Per-role execution budgets — L0 unlimited, L1 50 steps, L2 20 steps, L3 10 steps |
| §2 Orchestrator-Worker Pattern | Pattern 3 (Domain Router) | Domain-specific context pre-loading; pipeline sequencing (DB → backend+design → frontend) |
| §2 Orchestrator-Worker Pattern | Pattern 2 (OVP) | OVP validator worker spawned via Agent Teams for adversarial output scoring |
| §4 Parallel Multi-Model Review | Pattern 2 (OVP) | Formalizes review as Objective-Validation Protocol with PASS/FAIL verdict and diff |
| §5 Progressive Disclosure | Pattern 4 (Prompt Caching) | Formalizes 3-tier loading into explicit cache policy with version tracking |
| §6 Shared Knowledge Graph | Pattern 7 (Inter-Agent Comms) | Knowledge graph update protocol — agents append changes before turn ends |
| §7 Evaluator-Optimizer Loop | Pattern 2 (OVP) | OVP block is the structured evaluator input; 3-iteration cap with escalation |
| §8 Worker Heartbeat | Pattern 7 (Inter-Agent Comms) | Worker-to-worker message queue (`agent-comms.md`); Challenge Protocol for structured objections |
| *(new)* | Pattern 1 (Agent Supervisor) | `supervised` GATE_MODE — 3 Supervisor Gates pause; all others auto-pass |
| *(new)* | Pattern 6 (Dynamic Skill Loading) | Skill loading matrix enforces 3-4 skill maximum per step and task type |

**Full specifications:** `11-new-capabilities/advanced-agent-orchestration.md`
**Policy schema generator:** `10-generators/AGENT-POLICY-SCHEMA.md`
**Skill loading matrix:** `04-phase-planning/skill-loading-matrix.md`

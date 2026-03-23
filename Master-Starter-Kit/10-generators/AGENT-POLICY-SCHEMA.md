# Agent Policy Schema

> **Orchestrator Step:** 17 (Advanced Capabilities Setup)
> **Prerequisite:** `AGENT_ORCHESTRATION.POLICY_ENABLED == true` in STATE BLOCK
> **Output:** `dev_docs/orchestration/agent-policies.md` + `dev_docs/orchestration/agent-registry.md`
> **Purpose:** Define per-role execution budgets to prevent agent spirals, infinite loops, and
>              uncontrolled tool usage. All agents MUST read their policy before executing.
> **Format:** Follows generator format — Inputs → Schema → Standard Policies → Generator Instructions → Quality Gate

---

## Inputs

Before generating, read:
1. `STATE BLOCK` — extract `CONFIG.MVP_SERVICES` (list of services) and `AGENT_ORCHESTRATION` config
2. `11-new-capabilities/advanced-agent-orchestration.md` Section 6 — policy-per-role summary table
3. `11-new-capabilities/parallel-subagent-orchestration.md` §1 — L0-L3 hierarchy definitions

---

## Section 1 — Policy Schema Definition

Every policy document uses this YAML-style schema. Agents parse it as structured text (no tooling required):

```yaml
# Agent Policy v1.0
# One block per agent role. Copy and customize per deployment.

policy:
  role: "[L0|L1|L2|L3]-[domain]-[purpose]"
  # Examples:
  #   L0-meta-orchestrator
  #   L1-backend-domain
  #   L2-auth-service-coordinator
  #   L3-schema-writer
  version: "1.0"
  created: "[YYYY-MM-DD]"

  execution:
    max_steps: [integer | "unlimited"]
    # What counts as a step: every Read, Write, or Bash call = 1 step
    # What does NOT count: Agent-spawning calls (new counter starts for the spawned agent)
    # What does NOT count: Reasoning / thinking
    step_counter_file: "dev_docs/orchestration/step-counters/[agent-id].md"
    timeout_signal: "dev_docs/handoff.md"   # Where to write state on budget exhaustion

  error_handling:
    retry_budget: [integer]
    # 0 = no retries, escalate immediately
    # N = retry up to N times before escalating
    retry_strategy: "immediate"    # immediate | backoff | human
    escalation_target: "[parent role]"
    escalation_file: "dev_docs/orchestration/escalations.md"

  tool_allowlist:
    # List only the tools this role is permitted to use
    # L3 workers: Read + Write only — never Agent, never Skill
    - Read
    - Write
    - Bash       # Only if role requires shell execution
    - Agent      # L0 and L1 only
    - Skill      # L1 and above only
    - WebSearch  # L0 only
    - WebFetch   # L0 only

  output_contract:
    required_files:
      - "[path pattern of artifacts this agent MUST produce before completing]"
    forbidden_files:
      # These state files are orchestrator-only — domain agents never write them
      - "dev_docs/STATUS.md"
      - "dev_docs/handoff.md"
      - "dev_docs/session-context.md"
      - "dev_docs/DEVLOG.md"
      - "dev_docs/master-tracker.md"
    completion_signal: "[Instruction for how to signal completion to parent agent]"

  anti_spiral_rules:
    # These rules are self-enforced — the agent reads and follows them
    - "If step_count reaches max_steps: write partial output; append to escalations.md; STATUS: escalated; STOP"
    - "If same file is Read 5+ times in one session: log to escalations.md as potential loop; escalate"
    - "If error_count exceeds retry_budget: write error context to escalations.md; escalate; do NOT retry"
    - "If context window > 80% full: write progress checkpoint to assigned output file; signal L2 for fresh agent"
```

---

## Section 2 — Four Standard Policies

### L0 Meta-Orchestrator Policy

```yaml
policy:
  role: "L0-meta-orchestrator"
  version: "1.0"

  execution:
    max_steps: "unlimited"
    # L0 drives the entire 46-step kit — step limits would break the workflow
    timeout_signal: "dev_docs/handoff.md"

  error_handling:
    retry_budget: 0
    # L0 does not retry — it escalates to the human immediately
    # Autonomous recovery at L0 risks silently skipping mandatory gates
    retry_strategy: "human"
    escalation_target: "human-via-GATE"
    escalation_file: "dev_docs/handoff.md"
    # Writes to handoff.md (not escalations.md) — this is the human's inbox

  tool_allowlist:
    - Read
    - Write
    - Bash
    - Agent
    - Skill
    - WebSearch
    - WebFetch

  output_contract:
    required_files:
      - "dev_docs/STATUS.md"         # Must keep current
      - "dev_docs/handoff.md"        # Must keep current
      - "dev_docs/session-context.md"  # Must keep current
    forbidden_files: []              # L0 can write anything
    completion_signal: "Update STATE BLOCK CURRENT_STEP; update handoff.md with next action"

  anti_spiral_rules:
    - "If a gate fails auto-pass criteria 3 times: escalate to human; do not attempt 4th auto-pass"
    - "If context window > 80% full: trigger Session Boundary; write SB state files; stop"
```

### L1 Domain Orchestrator Policy

```yaml
policy:
  role: "L1-[domain]-domain-orchestrator"
  # domain = frontend | backend | database | design
  version: "1.0"

  execution:
    max_steps: 50
    # 50 steps covers one full domain across a moderately complex project
    step_counter_file: "dev_docs/orchestration/step-counters/L1-[domain].md"
    timeout_signal: "dev_docs/orchestration/escalations.md"

  error_handling:
    retry_budget: 3
    retry_strategy: "immediate"
    escalation_target: "L0-meta-orchestrator"
    escalation_file: "dev_docs/orchestration/escalations.md"

  tool_allowlist:
    - Read
    - Write
    - Bash
    - Agent
    - Skill

  output_contract:
    required_files:
      - "dev_docs/services/[domain]-hub.md OR dev_docs/specs/[domain]-*.md"
    forbidden_files:
      - "dev_docs/STATUS.md"
      - "dev_docs/handoff.md"
      - "dev_docs/session-context.md"
      - "dev_docs/DEVLOG.md"
      - "dev_docs/master-tracker.md"
    completion_signal: "Append completion record to dev_docs/orchestration/agent-registry.md; signal L0"

  anti_spiral_rules:
    - "If step_count reaches 50: write state dump to dev_docs/orchestration/agent-state-dump-[id].md; append to escalations.md; STOP"
    - "If same tool called with identical parameters 3 times consecutively: log as loop; escalate to L0"
    - "Do not write to forbidden_files — if update needed, write to agent-comms.md and signal orchestrator"
```

### L2 Coordinator Policy

```yaml
policy:
  role: "L2-[service]-coordinator"
  # service = slug from CONFIG.MVP_SERVICES (e.g., auth, billing, notifications)
  version: "1.0"

  execution:
    max_steps: 20
    # 20 steps covers producing all sections of one service spec or screen spec
    step_counter_file: "dev_docs/orchestration/step-counters/L2-[service].md"
    timeout_signal: "dev_docs/orchestration/escalations.md"

  error_handling:
    retry_budget: 2
    retry_strategy: "immediate"
    escalation_target: "L1-[domain]-domain-orchestrator"
    escalation_file: "dev_docs/orchestration/escalations.md"

  tool_allowlist:
    - Read
    - Write
    - Agent
    # No Bash (shell execution) — coordinators do not run commands
    # No Skill (too expensive for mid-level coordinators; L1 handles skill invocation)

  output_contract:
    required_files:
      - "At least 1 substantive file per invocation (the assigned artifact)"
    forbidden_files:
      - "dev_docs/STATUS.md"
      - "dev_docs/handoff.md"
      - "dev_docs/session-context.md"
      - "dev_docs/DEVLOG.md"
      - "dev_docs/master-tracker.md"
      - "ORCHESTRATOR.md"           # Never modify the orchestrator
    completion_signal: "Return structured result to L1 (artifact path + word count); append KG update if decision changed"

  anti_spiral_rules:
    - "If step_count reaches 20: write partial output; escalate to L1"
    - "Do not spawn subagents for work that fits within 10 steps — do it directly instead"
    - "If an L3 worker fails both retry attempts: escalate the whole task to L1; do not spawn a third L3"
    - "After completing work: always append to dev_docs/orchestration/knowledge-graph-updates.md if a decision changed"
```

### L3 Worker Policy

```yaml
policy:
  role: "L3-worker"
  # L3 is universal — all workers use the same policy regardless of domain
  version: "1.0"

  execution:
    max_steps: 10
    # 10 steps = 1 focused artifact (a spec section, a schema table, a component stub)
    # If the artifact requires more than 10 steps, it should be split by L2
    step_counter_file: "dev_docs/orchestration/step-counters/L3-[agent-id].md"
    timeout_signal: "dev_docs/orchestration/escalations.md"

  error_handling:
    retry_budget: 1
    retry_strategy: "immediate"
    escalation_target: "L2-[service]-coordinator"
    escalation_file: "dev_docs/orchestration/escalations.md"

  tool_allowlist:
    - Read
    - Write
    # NO Agent — L3 workers NEVER spawn subagents
    # NO Skill — L3 workers NEVER invoke skills
    # NO Bash — L3 workers NEVER run shell commands
    # If work requires these tools, it belongs at L2 or higher

  output_contract:
    required_files:
      - "Exactly 1 file per invocation — the single assigned artifact"
    forbidden_files:
      - "dev_docs/STATUS.md"
      - "dev_docs/handoff.md"
      - "dev_docs/session-context.md"
      - "dev_docs/DEVLOG.md"
      - "dev_docs/master-tracker.md"
      - "dev_docs/orchestration/agent-registry.md"  # Orchestrator-only
      - "dev_docs/orchestration/knowledge-graph-updates.md"  # L2+ only
      - "Any hub file (dev_docs/services/*-hub.md)"  # L1 managed
      - "Any index file (*/index.md, */_index.md)"   # Orchestrator managed
    completion_signal: "Return to L2: artifact path + word count + OVP pass/fail if applicable"

  anti_spiral_rules:
    - "Do not read files outside your assigned artifact's domain (extra reads cost steps)"
    - "Do not attempt to spawn subagents — if work needs spawning, write partial, escalate to L2"
    - "If content exceeds context before completion: write partial with [INCOMPLETE] marker; signal L2 for continuation agent"
    - "Never read the same file twice in one invocation — capture what you need on first read"
    - "One artifact only — if you notice adjacent work that needs doing, note it in escalations.md for L2 to assign"
```

---

## Section 3 — Self-Counting Protocol

Agents track their own steps since there is no external runtime counter. This is the protocol every L1/L2/L3 agent must follow.

### Step Counter File Format

Location: `dev_docs/orchestration/step-counters/[agent-id].md`

```
AGENT: [agent-id per naming convention: {domain}-{task-id}-s{stage}-cycle{n}]
ROLE: L1 | L2 | L3
POLICY_VERSION: 1.0
STARTED: [step number from ORCHESTRATOR]
MAX_STEPS: [from policy]
CURRENT_COUNT: [integer, start at 0]
LAST_ACTION: [description of last action taken]
LAST_FILE: [last file read or written]
STATUS: active | escalated | complete
ESCALATION_REASON: [blank unless STATUS == escalated]
```

### What Counts as a Step

| Action | Counts? |
|--------|---------|
| Read (any file) | +1 step |
| Write (any file) | +1 step |
| Bash (any command) | +1 step |
| Agent tool (spawning a subagent) | +0 for parent (the spawned agent starts its own counter) |
| Skill tool | +1 step |
| Reasoning / thinking (internal) | +0 (not a tool call) |

### Step Counter Update Protocol

The agent updates its counter file **after every tool call**:
1. Increment CURRENT_COUNT by 1
2. Update LAST_ACTION with what was just done
3. Update LAST_FILE with the file read/written

**On budget exhaustion** (CURRENT_COUNT reaches MAX_STEPS):
1. Immediately write current output to the assigned artifact file (even if incomplete — add `[INCOMPLETE — escalated at step {N}]` marker)
2. Append to `dev_docs/orchestration/escalations.md`:
   ```
   ESCALATION — [timestamp]
   Agent: [agent-id]
   Role: L1 | L2 | L3
   Reason: step_budget_exceeded (MAX_STEPS: [N], CURRENT: [N])
   Partial output: [artifact path]
   Next step needed: [what remains to be done]
   Escalated to: [parent role]
   ```
3. Update step-counter file: STATUS: escalated
4. Stop work — return control to parent

---

## Section 4 — Generator Instructions (Step 17)

Run this generator during Step 17 when `AGENT_ORCHESTRATION.POLICY_ENABLED == true`.

### Step 1 — Read Inputs

```
Read STATE BLOCK → extract:
  CONFIG.MVP_SERVICES  (list of service slugs, e.g., ["auth", "billing", "notifications", "trips"])
  AGENT_ORCHESTRATION.PARALLEL_DOMAINS (e.g., ["frontend", "backend", "database", "design"])
```

### Step 2 — Generate `dev_docs/orchestration/agent-policies.md`

Produce one file containing:

**Header:**
```
# Agent Policies — [PROJECT_NAME]
Generated: [date]
Kit version: [ORCHESTRATOR version]
Policy schema version: 1.0
```

**Section A — L0 Policy:** Copy the standard L0 policy from Section 2 above (no customization needed).

**Section B — L1 Policies:** One policy block per domain in `AGENT_ORCHESTRATION.PARALLEL_DOMAINS`. Copy the L1 template; replace `[domain]` with each domain slug.

**Section C — L2 Policies:** One policy block per service in `CONFIG.MVP_SERVICES`. Copy the L2 template; replace `[service]` with each service slug. Set `escalation_target` to the domain orchestrator that owns this service (backend for API services, frontend for UI-only services, etc.).

**Section D — L3 Policy:** Copy the universal L3 policy once. It applies to all workers regardless of domain.

### Step 3 — Generate `dev_docs/orchestration/agent-registry.md`

Pre-populate the registry with expected agents based on the project's service list:

```markdown
# Agent Registry — [PROJECT_NAME]
Last updated: [date]
Note: Mark STATUS as "active" when an agent starts; "complete" when it finishes; "escalated" if it escalated.

| Agent ID | Role | Assigned To | Max Steps | STATUS | Notes |
|---------|------|-------------|-----------|--------|-------|
| L0-meta-orchestrator | L0 | Full kit | unlimited | pending | |
| L1-backend-domain | L1 | backend domain | 50 | pending | |
| L1-frontend-domain | L1 | frontend domain | 50 | pending | |
| L1-database-domain | L1 | database domain | 50 | pending | |
| L1-design-domain | L1 | design domain | 50 | pending | |
| L2-auth-s1 | L2 | auth service | 20 | pending | |
| L2-billing-s1 | L2 | billing service | 20 | pending | |
[... one row per service from CONFIG.MVP_SERVICES ...]
```

### Step 4 — Initialize Supporting Files

Create these files with headers only (content populated at runtime):

**`dev_docs/orchestration/escalations.md`:**
```
# Escalation Log
Append entries in chronological order. Never delete entries.
---
```

**`dev_docs/orchestration/step-counters/`** — create the directory; individual counter files created by each agent when it starts.

---

## Section 5 — Failure Modes Reference

| Failure | Detection Method | Response |
|---------|-----------------|----------|
| Agent exceeds step budget | step-counter CURRENT_COUNT > MAX_STEPS | Write partial; escalate; parent resumes in fresh invocation |
| Agent writes a forbidden file | Post-Task Protocol checks; commit-state-check hook | Revert write; log to escalations.md; human reviews at next GATE |
| L3 worker uses Agent tool | Policy explicitly bans this | If noticed: cancel spawn; escalate to L2 to reassign as L2 task |
| Escalation loop (L3→L2→L1→L0→L0 again) | escalations.md has 3+ entries for same task | Human gate required; block until supervisor reviews the failing task |
| Step counter file missing | Agent starts but no counter file exists | L2/L3 agents must create their counter file as their very first action (step 1 of their budget) |
| Agent ignores retry budget and retries beyond limit | escalations.md shows retries > budget | Flag in handoff.md; human intervenes; investigate root cause before allowing any further agent execution on that task |
| Context window exhaustion without step-budget exhaustion | Agent notices >80% context usage before step limit | Write checkpoint; signal L2 for fresh agent continuation regardless of remaining step budget |

---

## Quality Gate

After generating `dev_docs/orchestration/agent-policies.md`, verify:

- [ ] One L0 policy block (unlimited steps, human-only escalation)
- [ ] One L1 policy block per domain in AGENT_ORCHESTRATION.PARALLEL_DOMAINS
- [ ] One L2 policy block per service in CONFIG.MVP_SERVICES
- [ ] One L3 universal policy block
- [ ] agent-registry.md pre-populated with one row per expected agent
- [ ] escalations.md initialized with header
- [ ] step-counters/ directory created
- [ ] All L3 policies show tool_allowlist: [Read, Write] ONLY (no Agent, no Skill, no Bash)
- [ ] All policies reference the correct escalation target (L3→L2→L1→L0→human)

# Master Tracker Template

**Purpose:** Template for the 6-file master tracker suite generated in ORCHESTRATOR Step 9.5. The master tracker is the atomic-level project tracker — distinct from STATUS.md (which is a dashboard). A project manager should be able to run the entire project from the master tracker alone.

**Output directory:** `dev_docs/tracker/`

---

## File 1: master-tracker.md

The single source of truth for all work at the subtask level.

```markdown
# Master Tracker — {{PROJECT_NAME}}

> Generated: {{DATE}} | Total tasks: {{TASK_COUNT}} | Total subtasks: {{SUBTASK_COUNT}}
> Source: dev_docs/STATUS.md

## How to Use This File

- Every task from STATUS.md is expanded into 5-15 subtasks
- Each subtask is independently completable in 1-4 hours
- Update status as work progresses: not-started → in-progress → blocked → complete
- Blocked items must include a "blocked-by" reference

## Phase {{N}}: {{PHASE_NAME}}

### Task {{TASK_ID}}: {{TASK_TITLE}}

**Service:** {{SERVICE_NAME}} | **Effort:** {{EFFORT}} | **Priority:** {{PRIORITY}}

| # | Subtask | Description | Hours | Status | Blocked By | Assigned |
|---|---------|-------------|-------|--------|------------|----------|
| 1 | {{SUBTASK_TITLE}} | {{SPECIFIC_DESCRIPTION}} | {{HOURS}} | not-started | — | — |
| 2 | {{SUBTASK_TITLE}} | {{SPECIFIC_DESCRIPTION}} | {{HOURS}} | not-started | ST-1 | — |
| ... | ... | ... | ... | ... | ... | ... |

<!-- Repeat for every task in STATUS.md -->
<!-- Target: 500+ subtasks for a typical 10-service project -->
```

---

## File 2: dependency-map.md

Complete task dependency graph with critical path identification.

```markdown
# Dependency Map — {{PROJECT_NAME}}

## Hard Dependencies (must complete A before B)

| Upstream Task | Downstream Task | Reason |
|---------------|-----------------|--------|
| {{TASK_ID_A}} | {{TASK_ID_B}} | {{WHY_BLOCKED}} |

## Soft Dependencies (easier if A is done, but B can start without it)

| Upstream Task | Downstream Task | Impact if Skipped |
|---------------|-----------------|-------------------|
| {{TASK_ID_A}} | {{TASK_ID_B}} | {{IMPACT}} |

## Parallel Execution Matrix

Tasks in the same column can run simultaneously:

| Track 1 | Track 2 | Track 3 | Track 4 |
|---------|---------|---------|---------|
| {{TASK}} | {{TASK}} | {{TASK}} | {{TASK}} |

## Critical Path

The longest chain of hard dependencies — this determines the minimum project duration.

```mermaid
graph LR
  {{TASK_A}} --> {{TASK_B}} --> {{TASK_C}} --> {{TASK_D}}
```

**Critical path duration:** {{WEEKS}} weeks
**Longest non-critical path:** {{WEEKS}} weeks
**Float (slack):** {{WEEKS}} weeks
```

---

## File 3: timeline.md

Week-by-week schedule for the full project timeline.

```markdown
# Project Timeline — {{PROJECT_NAME}}

> Total duration: {{TIMELINE_WEEKS}} weeks | Team size: {{TEAM_SIZE}}
> Risk buffer: {{BUFFER_WEEKS}} weeks included

## Timeline Summary

| Milestone | Optimistic | Expected | Pessimistic |
|-----------|-----------|----------|-------------|
| {{MILESTONE_NAME}} | Week {{N}} | Week {{N}} | Week {{N}} |

## Week-by-Week Detail

### Week {{N}} ({{DATE_RANGE}})

**Active work streams:** {{STREAM_1}}, {{STREAM_2}}
**Hours allocated:** {{HOURS}} / {{AVAILABLE_HOURS}}

| Subtask | Owner | Hours | Status |
|---------|-------|-------|--------|
| {{SUBTASK}} | {{OWNER}} | {{HOURS}} | planned |

**Milestones due:** {{MILESTONE_OR_NONE}}
**External blockers:** {{BLOCKERS_OR_NONE}}
**External actions needed:** {{ACTIONS_OR_NONE}}
**Phase gate:** {{GATE_CRITERIA_OR_NONE}}

<!-- Repeat for every week in the project timeline -->
```

---

## File 4: milestones.md

Every milestone with gate criteria and stakeholder communication triggers.

```markdown
# Milestones — {{PROJECT_NAME}}

## Milestone {{N}}: {{MILESTONE_NAME}}

**Target date:** Week {{N}} ({{DATE}})
**Phase:** {{PHASE_NAME}}

### Gate Criteria (all must be true to pass)

- [ ] {{CRITERION_1}}
- [ ] {{CRITERION_2}}
- [ ] {{CRITERION_3}}

### Go/No-Go Decision

| Factor | Go Condition | Current Status |
|--------|-------------|----------------|
| Feature completeness | ≥{{PCT}}% of tasks complete | — |
| Test coverage | ≥{{PCT}}% passing | — |
| Blockers | Zero P0 blockers | — |

### Stakeholder Communication

- **Who to notify:** {{STAKEHOLDERS}}
- **Communication channel:** {{CHANNEL}}
- **Template:** Use `dev_docs/comms/{{PHASE_PACK}}/`

<!-- Repeat for every milestone -->
```

---

## File 5: parallel-execution-guide.md

How to run multiple work streams concurrently.

```markdown
# Parallel Execution Guide — {{PROJECT_NAME}}

## Work Stream Definitions

| Stream | Services/Features | Lead | Duration |
|--------|-------------------|------|----------|
| {{STREAM_NAME}} | {{SERVICES}} | {{LEAD}} | {{WEEKS}} weeks |

## Conflict Prevention Rules

These files/schemas are shared across streams — coordinate changes:

| Shared Resource | Streams That Touch It | Coordination Rule |
|-----------------|----------------------|-------------------|
| {{RESOURCE}} | {{STREAMS}} | {{RULE}} |

## Integration Points

Points where parallel streams must sync before proceeding:

| Integration Point | Streams | When | What Must Be True |
|-------------------|---------|------|-------------------|
| {{POINT}} | {{STREAMS}} | Week {{N}} | {{CRITERIA}} |

## Agent-Based Parallel Execution (Claude Code)

When using Claude Code agents for parallel execution:

1. **Launch agents per stream:** Each agent works on one stream's tasks
2. **Shared files:** Agents must NOT modify files listed in the Conflict Prevention table simultaneously
3. **Sync protocol:** After all parallel agents complete, run an integration verification step
4. **Conflict resolution:** If two agents modified the same file, the later agent must merge changes manually
```

---

## File 6: progress-log.md

Pre-populated weekly log template for tracking actual vs planned progress.

```markdown
# Progress Log — {{PROJECT_NAME}}

## Week {{N}} ({{DATE_RANGE}})

**Planned subtasks:** {{COUNT}}
**Completed subtasks:** {{COUNT}}
**Velocity:** {{SUBTASKS_PER_WEEK}}
**On track:** Yes / No / At Risk

### Completed This Week

- {{SUBTASK}}: {{BRIEF_OUTCOME}}

### Blocked

- {{SUBTASK}}: {{BLOCKER_DESCRIPTION}} — **Action:** {{NEXT_STEP}}

### Decisions Made

- {{DECISION}}: {{RATIONALE}}

### Next Week Plan

- {{SUBTASK_1}}
- {{SUBTASK_2}}

---
<!-- Copy this template for each week -->
```

---

## Generation Rules

1. **Source data:** All tasks come from `dev_docs/STATUS.md` (Step 9 output). Every task in STATUS.md must appear in master-tracker.md — no gaps.
2. **Subtask granularity:** Each subtask should be completable by one developer in 1-4 hours. If a subtask would take longer, break it down further.
3. **Dependency accuracy:** Only mark hard dependencies where the upstream task's OUTPUT is the downstream task's INPUT. Shared infrastructure (like database) is a soft dependency unless the schema doesn't exist yet.
4. **Timeline realism:** Use CONFIG.TEAM_SIZE and CONFIG.TIMELINE_WEEKS to calculate available hours per week. Don't schedule more hours than available.
5. **Cross-reference:** After generation, verify master-tracker.md subtask count against STATUS.md task count. Ratio should be 5:1 to 15:1.

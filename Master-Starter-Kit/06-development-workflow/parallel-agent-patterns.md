# Parallel Agent Patterns

## What Are Parallel Agents?

Claude Code can dispatch multiple independent Claude instances (agents) that work simultaneously on different tasks. Each agent gets its own context, works on its own files, and reports back when done.

This is the single biggest time multiplier available. A task that takes 60 minutes sequentially can take 15 minutes with 4 parallel agents.

But parallelism is not free. Misused, it causes file conflicts, resource contention, and wasted work. This document defines when to parallelize, when not to, and the proven patterns.

---

## When to Parallelize

### Safe for Parallelism

These tasks have **zero file overlap** and **zero state dependencies**:

- **Documentation generation**: Each agent writes a different file
- **Schema generation for independent domains**: trips schema vs billing schema vs users schema
- **Seed file generation for independent tables**: each agent seeds a different table
- **E2E test files for different features**: trip tests vs billing tests vs driver tests
- **Component generation for independent UI sections**: each agent builds a different component
- **Audit/analysis docs**: each agent analyzes a different aspect

### Proven Examples from V3

| Task | Agents | Time Saved | Details |
|------|--------|------------|---------|
| Persona generation | 16 | 15 min vs ~3 hours | One agent per persona file |
| Audit documentation | 5 | 10 min vs ~50 min | One agent per analysis type |
| Schema generation | 3 | 5 min vs ~15 min | Independent domain schemas |
| Research docs | 8 | 12 min vs ~1.5 hours | One agent per research topic |

---

## When NOT to Parallelize

### Dangerous for Parallelism

These tasks have **shared state** or **dependencies**:

- **Tasks that modify the same file**: Two agents editing `schema/index.ts` = merge conflict
- **Tasks with sequential dependencies**: Router needs schema first, form needs validator first
- **Tasks that share state files**: Both update `STATUS.md` = last write wins, data lost
- **Tasks that depend on build output**: One agent builds, another needs the build artifact
- **Database migrations**: Must run sequentially, strict ordering
- **Tasks that read+write the same config**: `package.json`, `tsconfig.json`, barrel exports

### The Overlap Rule

Before dispatching parallel agents, answer this question:

> "Could Agent A's output conflict with Agent B's output?"

If yes: run sequentially.
If no: safe to parallelize.

Specifically check:
- Do they write to any of the same files?
- Does one produce output the other needs as input?
- Do they both update shared indexes or barrel exports?

---

## How to Dispatch

### Using Superpowers Plugin

```
Use superpowers:dispatching-parallel-agents
```

This provides structured dispatch with:
- Clear scope per agent
- File boundaries
- No overlap verification

### Manual Dispatch Pattern

When dispatching manually, each agent needs:

1. **Explicit scope**: "You are responsible for X. Do not modify anything outside X."
2. **Specific files**: "Create/modify only these files: [list]"
3. **No overlap declaration**: "No other agent is working on these files."
4. **Completion signal**: "When done, report: files created, files modified, any issues."

### Example: Dispatching 4 Documentation Agents

```
Agent 1:
  Scope: Write competitor-analysis.md
  Files: docs/research/competitor-analysis.md (create only)
  Context: [competitor data]

Agent 2:
  Scope: Write market-trends.md
  Files: docs/research/market-trends.md (create only)
  Context: [market data]

Agent 3:
  Scope: Write user-personas.md
  Files: docs/research/user-personas.md (create only)
  Context: [persona data]

Agent 4:
  Scope: Write feature-gaps.md
  Files: docs/research/feature-gaps.md (create only)
  Context: [gap analysis data]
```

Each agent creates one file. No overlap. No dependencies. Safe.

---

## Resource Limits

### Recommended Maximums

| Resource | Limit | Reason |
|----------|-------|--------|
| Concurrent agents | 3-5 | More causes resource contention on the machine |
| Files per agent | 1-3 | Keeps scope clear and manageable |
| Task duration per agent | 5-15 min | Longer tasks risk context overflow |

### Signs of Over-Parallelism

- Agents taking much longer than expected (resource contention)
- File write conflicts or corruption
- Agents producing inconsistent output (different patterns/conventions)
- Machine slowdown (CPU/memory saturation)

---

## Coordination Patterns

### Pattern 1: Fan-Out / Fan-In

```
                   Agent 1 --> File A
                  /
Main Agent ----> Agent 2 --> File B
                  \
                   Agent 3 --> File C
                        |
                        v
              Main Agent collects results,
              updates barrel exports / indexes
```

**Use for:** Generating multiple independent files (docs, schemas, tests).

**Key rule:** The main agent handles any shared files (barrel exports, index files) AFTER all agents complete.

### Pattern 2: Pipeline Stages

```
Stage 1: Agent 1 creates schemas (trips, billing, users)
         |
         v
Stage 2: Agent 2 creates trip router     (parallel)
         Agent 3 creates billing router   (parallel)
         Agent 4 creates user router      (parallel)
         |
         v
Stage 3: Main agent integrates (barrel exports, root router)
```

**Use for:** Tasks that have a dependency between stages but independence within each stage.

### Pattern 3: Domain Partitioning

```
Agent 1: Everything for "trips" domain
  - schema, seed, router, validators, tests

Agent 2: Everything for "billing" domain
  - schema, seed, router, validators, tests

Agent 3: Everything for "drivers" domain
  - schema, seed, router, validators, tests
```

**Use for:** Building multiple independent feature domains simultaneously.

**Caution:** Each domain's files must be in separate directories. Shared files (root router, barrel exports) are updated by the main agent after all domains are built.

---

## Error Handling

### When an Agent Fails

1. Check its output for the error message
2. Determine if the failure affects other agents
3. If isolated: fix and re-run just that agent
4. If cascading: stop all agents, fix the root cause, re-run all

### Common Failure Modes

| Failure | Cause | Fix |
|---------|-------|-----|
| File conflict | Two agents wrote same file | Redesign scope boundaries |
| Import error | Agent imported from another agent's scope | Add dependency to agent context |
| Type error | Agents used inconsistent types | Define shared types first, pass to all agents |
| Incomplete output | Agent ran out of context | Reduce scope, provide more focused instructions |

---

## Checklist Before Dispatching

- [ ] Each agent has a clear, non-overlapping scope
- [ ] No two agents write to the same file
- [ ] Dependencies between agents are resolved (earlier stage must complete first)
- [ ] Total agents <= 5
- [ ] Each agent's task is achievable in 5-15 minutes
- [ ] Shared files (barrel exports, configs) are handled by the main agent post-completion
- [ ] Error handling plan exists (what if one agent fails?)

---

## Anti-Patterns

| Anti-Pattern | Why It Fails |
|-------------|-------------|
| 10+ agents at once | Resource contention, machine slowdown |
| Agents sharing a file | Last write wins, work lost |
| No scope boundaries | Agents duplicate work or conflict |
| Agents updating state files | STATUS.md, handoff.md get corrupted |
| Parallelizing dependent tasks | Second agent guesses at first agent's output |
| No integration step after | Barrel exports, indexes never updated |

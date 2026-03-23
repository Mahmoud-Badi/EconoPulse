# PST Batch Execution Guide

## Why Batch?

Auditing all services in one session causes context rot — the AI starts hallucinating findings, confusing services, and losing precision after ~3 deep audits. Batching prevents this.

**Proven results from Ultra TMS:** 39 services audited in 6 batches across 7 sessions. Zero hallucination issues. All 162 action items traceable to real code.

---

## Batch Planning

### Step 1: Order Services by Priority

| Order | Rationale |
|-------|-----------|
| 1. P0/MVP services | Highest business impact, most code to review |
| 2. Infrastructure services | Affect all other services (auth, storage, email) |
| 3. P1/Post-MVP services | Next wave of development |
| 4. P2/Extended services | Lower priority but may have hidden issues |
| 5. P3/Future services | Often stubs — quick to audit |

### Step 2: Create Batches of 3-5 Services

**Rules:**
- Max 5 services per batch (3 is ideal for thorough audits)
- Group related services together (e.g., all accounting-related)
- Put the largest/most complex service first in each batch (freshest context)
- Put stub services last (quick to audit, less context needed)

### Step 3: Assign Batches to Sessions

- **One session = one batch** (start fresh conversation for each batch)
- **One service = one chat** (recommended: new chat per service to prevent bleed)
- Allow 1-2 hours per service for full 5-phase audit
- Schedule user review between batches

---

## Execution Protocol

### Before Starting a Batch

1. Read `_PROGRESS.md` — know what's been done
2. Read `_CONSOLIDATED-VERDICTS.md` — know what patterns emerged so far
3. Read `_CROSS-CUTTING-ADDENDUM.md` — know what CCFs to watch for
4. Identify the services for this batch

### During Each Service Audit

1. **Start a new chat** (prevents context contamination from previous service)
2. **Give the AI context:** "Read [service hub file] and [PST-TEMPLATE.md]. Run a full 5-phase PST audit on this service."
3. **Phase 1 (Hub Verification):** Let AI compare hub against code. Intervene if it's clearly wrong.
4. **Phase 2 (Code Quality):** Let AI scan for security, code health, API compliance.
5. **Phase 3 (Business Logic):** Verify rules, validations, state machines.
6. **Phase 4 (Tribunal):** AI conducts adversarial debate. Review the arguments.
7. **Phase 5 (Outputs):** AI generates corrections, action items, new tasks.
8. **Save the PST file** to `05-audit/tribunal/per-service/batch-N/PST-XX-service-name.md`

### After Each Service

- Update `_PROGRESS.md` with verdict and scores
- Add action items to `_CONSOLIDATED-VERDICTS.md`
- Check: Does any finding appear in 3+ services? → Promote to CCF

### After Completing a Batch

1. **Review all verdicts** from this batch
2. **Identify cross-cutting patterns** (findings that repeat across services)
3. **Promote CCFs:** Move findings affecting 3+ services to `_CROSS-CUTTING-ADDENDUM.md`
4. **Update aggregate metrics** in `_PROGRESS.md`
5. **User approval gate:** Review verdicts before starting next batch

---

## Parallel Agent Batching (Advanced)

If using multiple AI agents simultaneously:

### Setup

- Assign each agent a different service from the same batch
- Give each agent the same template (PST-TEMPLATE.md) and scoring system (PST-SCORING.md)
- Ensure agents don't read each other's output mid-audit

### Coordination

1. **Pre-audit:** All agents read the same `_PROGRESS.md` and `_CROSS-CUTTING-ADDENDUM.md`
2. **During audit:** Agents work independently (no cross-contamination)
3. **Post-audit:** One coordinating agent merges results:
   - Collects all PST files
   - Updates `_PROGRESS.md` with all verdicts
   - Checks for new CCF promotions
   - Updates `_CONSOLIDATED-VERDICTS.md` with all action items

### Agent Count

| Project Size | Recommended Agents | Batch Size |
|-------------|-------------------|------------|
| 1-10 services | 1 agent, sequential | 3-5 |
| 11-25 services | 2-3 agents in parallel | 3-4 per agent |
| 26-50 services | 3-5 agents in parallel | 3-5 per agent |
| 50+ services | 5 agents max | 3-4 per agent |

---

## File Organization

```
05-audit/tribunal/per-service/
├── _PROGRESS.md                    # Master progress tracker
├── _CONSOLIDATED-VERDICTS.md       # All action items from all PSTs
├── _CROSS-CUTTING-ADDENDUM.md      # Systemic findings (3+ services)
├── batch-1/
│   ├── PST-01-service-name.md
│   ├── PST-02-service-name.md
│   └── PST-03-service-name.md
├── batch-2/
│   ├── PST-04-service-name.md
│   └── PST-05-service-name.md
└── batch-N/
    └── ...
```

---

## Common Pitfalls

| Pitfall | Prevention |
|---------|-----------|
| Context rot after 3+ services in one chat | New chat per service |
| AI hallucinating endpoint counts | Always verify with `grep` commands |
| Hub corrections applied before all batches done | Apply corrections in bulk after batch review |
| CCF findings missed because batches reviewed in isolation | Review CCF addendum after EVERY batch |
| Scores inflated because AI wants to be positive | Adversarial tribunal structure forces honest assessment |
| "No tests" claims without checking | Always `find . -name "*.test.*" -o -name "*.spec.*"` |

# Step Dependency Graph

## Purpose

Maps which ORCHESTRATOR steps depend on which, enabling parallel execution of independent steps and helping estimate total runtime.

## Dependency Graph

```
Step 0 (Ecosystem)
  └──▶ Step 1 (Intake)
         └──▶ Step 1.7 (Comms Setup)
                └──▶ Step 2 (AI Config)
                └──▶ Step 3 (Tribunal)
                       └──▶ Step 4 (Foundation Docs)
                              ├──▶ Step 5 (Service Specs) ─────┐
                              │     ├──▶ Step 5.1 (Module Hubs) [conditional: MODULE_HUBS]
                              │     └──▶ Step 5.2 (Domain Specs) [conditional: DOMAIN_SPECS]
                              │                                 │
                       └──▶ Step 3.6 (Spike Planning)
                              └──▶ Step 5.5 (Native Audit) ────┤
                                    ├──▶ Step 5.6 (Mobile Arch) ─┐
                                    ├──▶ Step 5.7 (Mobile Offline)├── Cluster M (parallel)
                                    ├──▶ Step 5.8 (Mobile Screens)│
                                    └──▶ Step 5.9 (Mobile Deploy)─┘
                                                                │
                              └──▶ Step 6 (Screen Specs) ──────┤
                                                                │
                                   Step 7 (Audit) ◀────────────┘
                                     │                 (only if existing code)
                                     ▼
                                   Step 7.1 (Directory Init)
                                     │
                                     ▼
                                   Step 8 (Tasks)
                                     │
                                     ├──▶ Step 8.1 (Component Catalog) ─┐
                                     ├──▶ Step 8.2 (Decision Log+Journal)├── Parallel
                                     │                                   │
                                     ▼
                                   Step 8.4 (Catalog Generation)
                                     │
                                     ▼
                                   Step 8.5 (Coverage + Gap Traceability)
                                     │
                                     ▼
                                   Step 8.6 (Cross-Reference Validator)
                                     │
                                     ▼
                                   Step 9 (Dashboard)
                                     │
                                     ├──▶ Step 8.3 (Sprint Plans)
                                     ├──▶ Step 9.5 (Master Tracker) [conditional: MASTER_TRACKER]
                                     │
                                     ▼
                                   Step 10 (API Contracts)
                                     │
                                   Step 10.5 (Code Templates)
                                     │
                                   Step 10.6 (Mock Server) [conditional: MOCK_SERVER]
                                     │
                    ┌────────────────┬┴───────────────┐
                    ▼                ▼                 ▼
              Step 11          Step 12           Step 13
            (Infrastructure)  (Testing)        (Design System)
                    │                │                 │
                    ▼                ▼                 ▼
              Step 14          Step 15
            (Security)       (Observability)
                    │                │
                    └────────┬───────┘
                             ▼
                    Step 15.7
                    (Diagram Suite)
                             │
                             ▼
                    Step 16
                    (Handoff)
                             │
                             ▼
                    Steps 16.1-16.5
                    (Quality & Standards)
                             │
                    Step 16.6 (Seed Data) [conditional: SEED_DATA]
                             │
                    Step 16.7 (Directory Audit)
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
              Step 17            Step 18
            (Capabilities)     (Onboarding)
                    │                 │
                    ▼                 ▼
              Steps 18.5-18.8    Steps 19-28.5
            (Operational)       (Marketing)
                    │                 │
                    └────────┬────────┘
                             ▼
                    Step 28.5 (Legal)
                             │
                             ▼
                    Step 29 (Post-Completion Audit)
                             │
                             ▼
                    Step 30 (Enhancement Rounds)
                             │
                             ▼
                    Step 31 (Depth Verification)
                             │
                             ▼
                    Step 32 (Deep Dive Audit)
                             │
                             ▼
                    Step 33 (Expansion Planning)
```

## Parallel Execution Clusters

Steps within the same cluster can run simultaneously using parallel agents.

### Cluster A: Post-Contract (after Step 10)

```
Step 11 (Infrastructure) ─┐
Step 12 (Testing)         ├── Can run in parallel
Step 13 (Design System)  ─┘
```

**Why safe:** These three steps read from service specs and API contracts but don't modify them. They produce independent output (config files, test configs, design tokens).

**Time saved:** ~30-45 minutes

### Cluster B: Post-Infrastructure (after Steps 11-13)

```
Step 14 (Security)        ─┐
Step 14.9 (Integrations)  ─┤── Can run in parallel
Step 15 (Observability)   ─┘
```

**Why safe:** Security hardening and observability setup are independent concerns. Neither modifies the other's output.

**Time saved:** ~15-20 minutes

### Cluster C: Operational Setup (after Step 18)

```
Step 18.5 (Team Ceremonies)     ─┐
Step 18.6 (Incident Response)   ─┤── Can run in parallel
Step 18.7 (Customer Support)    ─┤
Step 18.8 (Post-Launch)         ─┘
      │
Step 18.7 ──▶ Step 18.7.5 (CX Operations) ──▶ Step 18.8
              (conditional — requires 18.7 complete)
```

**Why safe:** Steps 18.5-18.8 are independent operational documents. Step 18.7.5 is the exception — it depends on 18.7 (Customer Support) because CX operations build on support strategy decisions.

**Time saved:** ~20-30 minutes

### Cluster E: Post-Task Directory Init (after Step 8)

```
Step 8.1 (Component Catalog)  ─┐
Step 8.2 (Decision Log)       ─┘── Can run in parallel
```

**Why safe:** Component catalog and decision log populate independent directories (`dev_docs/components/` and `dev_docs/decisions/`). Neither reads the other's output.

**Time saved:** ~5 minutes

### Cluster M: Mobile Deep Dive (after Step 5.5)

```
Step 5.6 (Mobile Architecture) ─┐
Step 5.7 (Mobile Offline)       ├── Can run in parallel
Step 5.8 (Mobile Screens)       │
Step 5.9 (Mobile Deploy)       ─┘
```

**Why safe:** Each step reads from independent template sections (14, 15, 16, 17). They produce output in separate subdirectories of `dev_docs/mobile/`.

**Time saved:** ~25-35 minutes

### Cluster D: Marketing (after Step 20)

```
Step 21 (Content Strategy)  ─┐
Step 22 (Email Marketing)   ─┤── Can run in parallel
Step 23 (Social Strategy)   ─┘
```

**Why safe:** Channel-specific strategies are independent once positioning is defined.

**Note:** Step 22 (Website, Landing Pages & Conversion) includes the walkthrough demo generation, which depends on feature list (Step 4), brand voice (Step 20), and personas (Step 3/Tribunal). All these are available by the time marketing steps begin.

**Time saved:** ~15-20 minutes

## Steps That CANNOT Be Parallelized

| Step | Must Follow | Reason |
|------|-------------|--------|
| Step 1 → Step 2 | Step 1 | Config depends on intake answers |
| Step 3 → Step 4 | Step 3 | Foundation docs reference tribunal verdict |
| Step 3.5 → Step 3.6 | Step 3.5 | Spikes plan from tribunal findings |
| Step 5 → Step 5.1 | Step 5 | Module hubs break down service specs |
| Step 5.1 → Step 8 | Step 5.1 | Task files reference service specs and module hubs |
| Step 8 → Step 8.4 | Step 8 | Catalogs consolidate from service specs |
| Step 8.4 → Step 8.5 | Step 8.4 | Coverage verification needs catalogs |
| Step 8.5 → Step 8.6 | Step 8.5 | Cross-reference validator checks consistency |
| Step 8.6 → Step 9 | Step 8.6 | Dashboard requires 100% consistency |
| Step 9 → Step 9.5 | Step 9 | Master tracker expands STATUS.md tasks into subtasks |
| Step 10 → Step 10.5 | Step 10 | Code templates need API contracts |
| Step 10.5 → Step 10.6 | Step 10.5 | Mock server uses templates + contracts |
| Step 10.6 → Steps 11-13 | Step 10.6 | Infrastructure/testing reference API contracts |
| Step 15.7 → Step 16 | Steps 14, 15, 15.5 | Diagrams reference infrastructure, security, observability, and user docs |
| Step 16 → 16.1-16.5 | Step 16 | Quality checks verify handoff completeness |
| Step 28.5 → Step 29 | Step 28.5 | Audit requires all prior steps complete |
| Step 29 → Step 30 | Step 29 | Enhancement builds on audit findings |
| Step 30 → Step 31 | Step 30 | Depth verification builds on enhancements |
| Step 31 → Step 32 | Step 31 | Deep dive builds on depth verification |
| Step 32 → Step 33 | Step 32 | Expansion builds on deep dive findings |

### Hardening Chain (Steps 29-33)

Steps 29-33 are **strictly sequential** — each round depends on the previous step's output. No parallelization is possible within the hardening phase.

```
Step 28.5 ──▶ Step 29 ──▶ Step 30 ──▶ Step 31 ──▶ Step 32 ──▶ Step 33
(Legal)      (Audit)    (Enhance)   (Depth)     (Deep Dive) (Expand)
              3 rounds   3 rounds    5 rounds    3 rounds    1 pass
              ~30 min    ~45 min     ~60 min     ~60 min     ~30 min
```

**Why not parallelizable:** Each step reads and modifies files produced or improved by the previous step. Running them concurrently would cause conflicting writes and missed improvements.

## Time Estimates by Path

### Express Path (~4 hours)

```
[0] 5min ──▶ [1-express] 10min ──▶ [combined] 15min
  ──▶ [29-33] ~3.5 hours (hardening)
```

### Lite Path (~5.5 hours)

```
[0] 10min ──▶ [1] 20min ──▶ [2] 5min ──▶ [5] 30min ──▶ [6] 25min ──▶ [8] 20min
  ──▶ [29-33] ~3.5 hours (hardening)
```

### Standard Path (~7.5 hours, ~6.7 hours with parallel)

```
[0] 10min ──▶ [1] 20min ──▶ [2] 5min ──▶ [3] 60min ──▶ [4] 15min ──▶ [5] 30min
  ──▶ [6] 25min ──▶ [8] 20min ──▶ [9] 10min ──▶ [10] 20min
  ──▶ [11|12|13] 30min parallel ──▶ [14|15] 15min parallel
  ──▶ [15.7] 20min (diagrams) ──▶ [16] 10min ──▶ [16.1-16.5] 15min ──▶ [18] 10min
  ──▶ [29-33] ~3.5 hours (hardening)
```

### Full Path (~10-12 hours, ~9-10 hours with parallel)

Standard + Operational (~1 hour) + Marketing (~2 hours) + Hardening (~3.5 hours)

## Using Parallel Execution

Tell Claude:

```
Run Steps 11, 12, and 13 in parallel using separate agents.
```

Claude will launch 3 agents simultaneously, each generating independent output. When all complete, proceed to the next sequential step.

**Requirements for safe parallel execution:**
1. Steps must be in the same cluster (listed above)
2. No step modifies files that another parallel step reads
3. All prerequisite steps are complete
4. STATE BLOCK is updated after ALL parallel steps finish (not individually)

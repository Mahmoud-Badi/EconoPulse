# Phased Roadmap — {{PROJECT_NAME}} Roadmap

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all `{{PLACEHOLDER}}` values with project-specific data before rendering.

```mermaid
mindmap
  root(({{PROJECT_NAME}} Roadmap))
    Phase 0 — Foundation
      Duration: {{PHASE_0_DURATION}}
      Deliverables
        CI/CD pipeline & dev environment
        Database schema & migrations
        Authentication & authorization
        Design system & component library
        Architecture documentation
      Phase Gate
        All devs can run locally
        Auth flow works end-to-end
        DB schema reviewed & approved
        Design system tokens published
    Phase 1 — Core MVP
      Duration: {{PHASE_1_DURATION}}
      Deliverables
        {{PHASE_1_DELIVERABLE_1}}
        {{PHASE_1_DELIVERABLE_2}}
        {{PHASE_1_DELIVERABLE_3}}
        {{PHASE_1_DELIVERABLE_4}}
        {{PHASE_1_DELIVERABLE_5}}
      Phase Gate
        {{PHASE_1_GATE_1}}
        {{PHASE_1_GATE_2}}
        {{PHASE_1_GATE_3}}
        Core workflows pass E2E tests
    Phase 2 — Enhanced
      Duration: {{PHASE_2_DURATION}}
      Deliverables
        {{PHASE_2_DELIVERABLE_1}}
        {{PHASE_2_DELIVERABLE_2}}
        {{PHASE_2_DELIVERABLE_3}}
        {{PHASE_2_DELIVERABLE_4}}
      Phase Gate
        {{PHASE_2_GATE_1}}
        {{PHASE_2_GATE_2}}
        Performance benchmarks met
        Security audit passed
    Phase 3+ — Growth / Polish / Launch
      Duration: {{PHASE_3_DURATION}}
      Deliverables
        {{PHASE_3_DELIVERABLE_1}}
        {{PHASE_3_DELIVERABLE_2}}
        {{PHASE_3_DELIVERABLE_3}}
        Public API & documentation
        Launch readiness checklist
      Phase Gate
        Load testing passed at {{TARGET_CONCURRENT_USERS}} users
        UAT sign-off from stakeholders
        Production environment validated
        Monitoring & alerting configured
```

---

## Phase Summary Table

| Phase | Name | Duration | Key Deliverables | Gate Criteria | Dependencies |
|-------|------|----------|-----------------|---------------|-------------|
| 0 | Foundation | {{PHASE_0_DURATION}} | CI/CD, Auth, DB schema, Design system | Devs run locally, auth works E2E, schema approved | None |
| 1 | Core MVP | {{PHASE_1_DURATION}} | {{PHASE_1_DELIVERABLE_1}}, {{PHASE_1_DELIVERABLE_2}}, {{PHASE_1_DELIVERABLE_3}} | {{PHASE_1_GATE_1}}, core E2E tests pass | Phase 0 complete |
| 2 | Enhanced | {{PHASE_2_DURATION}} | {{PHASE_2_DELIVERABLE_1}}, {{PHASE_2_DELIVERABLE_2}}, {{PHASE_2_DELIVERABLE_3}} | {{PHASE_2_GATE_1}}, security audit passed | Phase 1 complete |
| 3+ | Growth / Launch | {{PHASE_3_DURATION}} | {{PHASE_3_DELIVERABLE_1}}, Public API, Launch checklist | Load test passed, UAT sign-off, prod validated | Phase 2 complete |

---

## Critical Path

The critical path is the longest chain of dependent deliverables that determines minimum project duration.

```
{{CRITICAL_PATH_STEP_1}} (Phase 0)
  --> {{CRITICAL_PATH_STEP_2}} (Phase 1)
    --> {{CRITICAL_PATH_STEP_3}} (Phase 1)
      --> {{CRITICAL_PATH_STEP_4}} (Phase 2)
        --> {{CRITICAL_PATH_STEP_5}} (Phase 3)
          --> Launch
```

**Estimated minimum duration:** {{TOTAL_MINIMUM_DURATION}}

**Parallel workstreams that can reduce wall-clock time:**
- {{PARALLEL_STREAM_1}} can start during {{PARALLEL_WITH_1}}
- {{PARALLEL_STREAM_2}} can start during {{PARALLEL_WITH_2}}
- {{PARALLEL_STREAM_3}} can start during {{PARALLEL_WITH_3}}

---

### How to Use This Roadmap

1. Replace all `{{PLACEHOLDER}}` values with your project's actual phases, deliverables, and durations.
2. Adjust the number of deliverables per phase -- most projects have 3-8 per phase.
3. Phase gates are go/no-go checkpoints -- customize them to match what your stakeholders need to see.
4. The critical path should be updated as the project progresses and dependencies shift.
5. For detailed timeline with dates, see the Gantt chart: `roadmap-gantt.template.md`.

---

## Cross-References

- **Gantt chart with dates:** `roadmap-gantt.template.md`
- **Service map (what's being built):** `overview-service-map.template.md`
- **Dependency graph (build order):** `dependency-graph.template.md`
- **Feature breakdown:** `feature-mind-map.template.md`
- **Service-level features:** `svc-feature-map.template.md`

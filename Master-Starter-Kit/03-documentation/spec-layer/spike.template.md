# Spike: {{SPIKE_TITLE}}

> **Project:** {{PROJECT_NAME}}
> **Author:** {{SPIKE_AUTHOR}}
> **Date Created:** {{SPIKE_DATE}}
> **Status:** Planned | In Progress | Complete

---

## Question

What specific technical question are we answering?

> {{SPIKE_QUESTION}}

**Context:** Why does this question need answering before we can proceed with implementation? What depends on the outcome?

> {{SPIKE_CONTEXT}}

**Related Risk:** Link to the tribunal risk item or architectural decision that triggered this spike.

> See: `01-tribunal/proceedings/round-2-feasibility.template.md` — Risk #{{RISK_ID}}

---

## Time Box

| Parameter | Value |
|-----------|-------|
| **Hard stop** | {{SPIKE_TIMEBOX}} hours |
| **Start** | {{SPIKE_START_DATE}} |
| **Deadline** | {{SPIKE_END_DATE}} |
| **Branch** | `spike/{{SPIKE_SLUG}}` |

**Rule:** When the time box expires, stop and document findings regardless of completion. A spike that runs over budget has already answered the question — the answer is "this is harder than expected."

---

## Success Criteria

What result gives us confidence to proceed? Be specific and measurable.

- [ ] {{SUCCESS_CRITERION_1}}
- [ ] {{SUCCESS_CRITERION_2}}
- [ ] {{SUCCESS_CRITERION_3}}

**Minimum viable outcome:** What is the absolute minimum we need to learn to make a decision?

> {{SPIKE_MINIMUM_OUTCOME}}

---

## Approach

Numbered steps to investigate. Keep it focused — this is not a full implementation plan.

1. {{SPIKE_STEP_1}}
2. {{SPIKE_STEP_2}}
3. {{SPIKE_STEP_3}}
4. {{SPIKE_STEP_4}}
5. {{SPIKE_STEP_5}}

### Out of Scope

These items are explicitly NOT part of this spike:

- Production-quality code (spike code is throwaway)
- Full test coverage
- UI polish
- {{SPIKE_OUT_OF_SCOPE}}

---

## Findings

> _Fill this section after the spike is complete._

### What We Learned

{{SPIKE_FINDINGS}}

### Performance / Benchmarks

| Metric | Target | Actual | Pass? |
|--------|--------|--------|-------|
| {{BENCHMARK_METRIC_1}} | {{BENCHMARK_TARGET_1}} | — | — |
| {{BENCHMARK_METRIC_2}} | {{BENCHMARK_TARGET_2}} | — | — |

### Risks Discovered

| Risk | Severity | Mitigation |
|------|----------|------------|
| {{DISCOVERED_RISK_1}} | High / Medium / Low | {{MITIGATION_1}} |

### Constraints Identified

- {{CONSTRAINT_1}}
- {{CONSTRAINT_2}}

---

## Decision

> _Fill after findings are documented. This is the actionable output of the spike._

| Option | Decision |
|--------|----------|
| **Proceed** | The approach works. Move to implementation. |
| **Pivot** | The approach partially works. Adjust the plan. |
| **Abandon** | The approach does not work. Choose an alternative. |

**Decision:** {{SPIKE_DECISION}}

**Rationale:** {{SPIKE_RATIONALE}}

**Impact on plan:** What changes in the project plan as a result of this decision?

> {{SPIKE_PLAN_IMPACT}}

---

## Artifacts

| Artifact | Location | Notes |
|----------|----------|-------|
| Spike branch | `spike/{{SPIKE_SLUG}}` | Do NOT merge — reference only |
| Code samples | `dev_docs/spikes/{{SPIKE_SLUG}}/` | Key code snippets preserved |
| Benchmark data | `dev_docs/spikes/{{SPIKE_SLUG}}/benchmarks/` | Raw performance data |
| Screenshots | `dev_docs/spikes/{{SPIKE_SLUG}}/screenshots/` | Visual evidence if applicable |

---

## Pre-Generated Spike Files

The tribunal identified the following high-risk items. Generate a spike file for each using this template:

| Risk Item | Spike File | Priority |
|-----------|-----------|----------|
| {{HIGH_RISK_ITEM_1}} | `dev_docs/spikes/spike-001-{{SPIKE_SLUG_1}}.md` | P1 |
| {{HIGH_RISK_ITEM_2}} | `dev_docs/spikes/spike-002-{{SPIKE_SLUG_2}}.md` | P1 |
| {{HIGH_RISK_ITEM_3}} | `dev_docs/spikes/spike-003-{{SPIKE_SLUG_3}}.md` | P2 |

Generate these during Phase A setup so they are ready when developers encounter the risk.

---

## Spike Review Checklist

Before closing a spike, verify:

- [ ] All success criteria have a pass/fail result
- [ ] Findings section is filled with specific, reusable knowledge
- [ ] Decision is clearly stated with rationale
- [ ] Artifacts are committed and linked
- [ ] Plan impact is documented and communicated to the team
- [ ] Spike branch is NOT merged into main

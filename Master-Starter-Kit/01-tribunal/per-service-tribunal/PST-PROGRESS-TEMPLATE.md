# Per-Service Tribunal — Progress Tracker

> **Project:** {{PROJECT_NAME}}
> **Total Services:** {{SERVICE_COUNT}}
> **Started:** {{START_DATE}}
> **Target Completion:** {{TARGET_DATE}}

---

## Batch Status

| Batch | Services | Status | Date Started | Date Completed |
|-------|----------|--------|-------------|----------------|
| Batch 1 | _list 3-5 services_ | NOT STARTED | | |
| Batch 2 | _list 3-5 services_ | NOT STARTED | | |
| Batch 3 | _list 3-5 services_ | NOT STARTED | | |

---

## Individual Service Status

| # | Service | Tier | Status | Verdict | Hub Score | Verified | Delta | Critical Findings | PST File |
|---|---------|------|--------|---------|-----------|----------|-------|-------------------|----------|
| 1 | | | PENDING | | | | | | |
| 2 | | | PENDING | | | | | | |
| 3 | | | PENDING | | | | | | |

**Status values:** PENDING → IN PROGRESS → COMPLETE → CORRECTIONS APPLIED

---

## Session Log

| Session | Date | Services Audited | Duration | Notes |
|---------|------|-----------------|----------|-------|
| 1 | | | | |
| 2 | | | | |

---

## Aggregate Metrics (Updated After Each Batch)

| Metric | Value |
|--------|-------|
| Services Audited | 0 / {{SERVICE_COUNT}} |
| AFFIRM Verdicts | 0 |
| MODIFY Verdicts | 0 |
| REVERSE Verdicts | 0 |
| DEFER Verdicts | 0 |
| Mean Hub Score | — |
| Mean Verified Score | — |
| Mean Delta | — |
| P0 Actions Generated | 0 |
| CCF Findings Promoted | 0 |

---

## Rules

1. **Batch size:** 3-5 services per session (prevents context fatigue)
2. **New chat per service:** Start a fresh conversation for each PST audit (prevents context rot and hallucination)
3. **P0 services first:** Audit highest-priority services in early batches
4. **Review between batches:** User reviews verdicts before next batch starts
5. **CCF promotion:** After each batch, check if local findings appear in 3+ services → promote to CCF
6. **Hub corrections:** Apply corrections in a separate session after all PSTs in a batch are complete

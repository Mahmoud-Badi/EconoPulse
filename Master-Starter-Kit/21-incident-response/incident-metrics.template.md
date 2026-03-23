# Incident Metrics

> What gets measured gets improved. Track incident response performance to build a culture of continuous reliability improvement.

---

## Project Information

| Field | Value |
|-------|-------|
| **Project** | {{PROJECT_NAME}} |
| **Metrics Owner** | [Name — person responsible for updating this document] |
| **Review Cadence** | Monthly (metrics update), Quarterly (full review) |
| **Last Updated** | [YYYY-MM-DD] |

---

## Key Metrics Definitions

| Metric | Definition | How to Calculate |
|--------|-----------|-----------------|
| **MTTD** (Mean Time to Detect) | Average time from incident start to first alert or report | (Detection timestamp - Incident start timestamp), averaged across incidents |
| **MTTA** (Mean Time to Acknowledge) | Average time from alert to human acknowledgment | (Acknowledgment timestamp - Alert timestamp), averaged across incidents |
| **MTTM** (Mean Time to Mitigate) | Average time from detection to service restored (temporary fix) | (Mitigation timestamp - Detection timestamp), averaged across incidents |
| **MTTR** (Mean Time to Resolve) | Average time from detection to root cause fixed (permanent fix) | (Resolution timestamp - Detection timestamp), averaged across incidents |
| **Incident Frequency** | Number of incidents per time period by severity | Count of incidents, grouped by severity and time period |
| **SLA Compliance** | Percentage of incidents resolved within the SLA for their severity | (Incidents within SLA / Total incidents) x 100 |

---

## MTTD — Mean Time to Detect

Track how quickly your monitoring catches problems.

### Monthly MTTD by Severity

| Month | SEV1 MTTD | SEV2 MTTD | SEV3 MTTD | SEV4 MTTD | Overall MTTD |
|-------|-----------|-----------|-----------|-----------|-------------|
| [YYYY-MM] | [X min] | [X min] | [X min] | [X min] | [X min] |
| [YYYY-MM] | [X min] | [X min] | [X min] | [X min] | [X min] |
| [YYYY-MM] | [X min] | [X min] | [X min] | [X min] | [X min] |
| [YYYY-MM] | [X min] | [X min] | [X min] | [X min] | [X min] |
| [YYYY-MM] | [X min] | [X min] | [X min] | [X min] | [X min] |
| [YYYY-MM] | [X min] | [X min] | [X min] | [X min] | [X min] |

**Target MTTD:**
- SEV1: <5 minutes
- SEV2: <15 minutes
- SEV3: <60 minutes
- SEV4: <1 business day

**If MTTD is increasing:** Your monitoring has gaps. Review alert coverage, thresholds, and synthetic monitoring.

### Detection Source Breakdown

| Detection Source | Count | % of Total |
|-----------------|-------|-----------|
| Automated monitoring alert | [N] | [X%] |
| Customer support report | [N] | [X%] |
| Internal team discovery | [N] | [X%] |
| Social media report | [N] | [X%] |
| Synthetic monitoring | [N] | [X%] |
| Third-party notification | [N] | [X%] |

**Goal:** >80% of incidents detected by automated monitoring. If customers are detecting incidents before your monitoring does, you have a monitoring problem.

---

## MTTR — Mean Time to Resolve

Track how quickly your team resolves incidents.

### Monthly MTTR by Severity

| Month | SEV1 MTTR | SEV2 MTTR | SEV3 MTTR | SEV4 MTTR | Overall MTTR |
|-------|-----------|-----------|-----------|-----------|-------------|
| [YYYY-MM] | [X hr] | [X hr] | [X hr] | [X hr] | [X hr] |
| [YYYY-MM] | [X hr] | [X hr] | [X hr] | [X hr] | [X hr] |
| [YYYY-MM] | [X hr] | [X hr] | [X hr] | [X hr] | [X hr] |
| [YYYY-MM] | [X hr] | [X hr] | [X hr] | [X hr] | [X hr] |
| [YYYY-MM] | [X hr] | [X hr] | [X hr] | [X hr] | [X hr] |
| [YYYY-MM] | [X hr] | [X hr] | [X hr] | [X hr] | [X hr] |

**Target MTTR:**
- SEV1: <4 hours
- SEV2: <8 hours
- SEV3: <48 hours
- SEV4: <2 sprints

**MTTR breakdown (for deeper analysis):**

| Month | Avg Time to Detect | Avg Time to Triage | Avg Time to Mitigate | Avg Time to Resolve |
|-------|-------------------|-------------------|---------------------|-------------------|
| [YYYY-MM] | [X min] | [X min] | [X min] | [X hr] |
| [YYYY-MM] | [X min] | [X min] | [X min] | [X hr] |
| [YYYY-MM] | [X min] | [X min] | [X min] | [X hr] |

This breakdown reveals WHERE time is being spent. If detection is fast but mitigation is slow, invest in runbooks. If triage is slow, improve severity definitions.

---

## Incident Frequency

### Monthly Incident Count by Severity

| Month | SEV1 | SEV2 | SEV3 | SEV4 | Total |
|-------|------|------|------|------|-------|
| [YYYY-MM] | [N] | [N] | [N] | [N] | [N] |
| [YYYY-MM] | [N] | [N] | [N] | [N] | [N] |
| [YYYY-MM] | [N] | [N] | [N] | [N] | [N] |
| [YYYY-MM] | [N] | [N] | [N] | [N] | [N] |
| [YYYY-MM] | [N] | [N] | [N] | [N] | [N] |
| [YYYY-MM] | [N] | [N] | [N] | [N] | [N] |

### Quarterly Trend

| Quarter | SEV1 | SEV2 | SEV3 | SEV4 | Total | Trend vs Previous |
|---------|------|------|------|------|-------|------------------|
| [Q1 YYYY] | [N] | [N] | [N] | [N] | [N] | [+/- X%] |
| [Q2 YYYY] | [N] | [N] | [N] | [N] | [N] | [+/- X%] |
| [Q3 YYYY] | [N] | [N] | [N] | [N] | [N] | [+/- X%] |
| [Q4 YYYY] | [N] | [N] | [N] | [N] | [N] | [+/- X%] |

**Targets:**
- SEV1: 0 per quarter (aspirational but important to track)
- SEV2: <2 per quarter
- Total incidents trending down quarter-over-quarter
- SEV1+SEV2 should be <10% of total incidents (most incidents should be low severity)

---

## SLA Compliance

### Monthly SLA Compliance by Severity

| Month | SEV1 (within 4hr) | SEV2 (within 8hr) | SEV3 (within 48hr) | SEV4 (within sprint) | Overall |
|-------|-------------------|-------------------|--------------------|--------------------|---------|
| [YYYY-MM] | [X%] | [X%] | [X%] | [X%] | [X%] |
| [YYYY-MM] | [X%] | [X%] | [X%] | [X%] | [X%] |
| [YYYY-MM] | [X%] | [X%] | [X%] | [X%] | [X%] |
| [YYYY-MM] | [X%] | [X%] | [X%] | [X%] | [X%] |
| [YYYY-MM] | [X%] | [X%] | [X%] | [X%] | [X%] |
| [YYYY-MM] | [X%] | [X%] | [X%] | [X%] | [X%] |

**Target:** >95% SLA compliance across all severities.

### SLA Breaches

| Incident ID | Severity | SLA Target | Actual Resolution | Breach Amount | Root Cause of Breach |
|------------|----------|-----------|-------------------|---------------|---------------------|
| [INC-YYYY-NNN] | SEV[X] | [X hr] | [X hr] | [+X hr over SLA] | [Why SLA was missed] |
| [INC-YYYY-NNN] | SEV[X] | [X hr] | [X hr] | [+X hr over SLA] | [Why SLA was missed] |

---

## Recurring Incident Patterns

Track incidents that share the same root cause or affected component. Recurrence means the previous postmortem action items were insufficient.

### Recurring Incidents

| Pattern / Root Cause | Occurrences | Severities | First Seen | Last Seen | Status |
|---------------------|-------------|-----------|------------|-----------|--------|
| [e.g., "Database connection pool exhaustion"] | [N times] | [SEV2, SEV2, SEV3] | [YYYY-MM-DD] | [YYYY-MM-DD] | [Open / Resolved] |
| [e.g., "Memory leak in image processing service"] | [N times] | [SEV3, SEV3] | [YYYY-MM-DD] | [YYYY-MM-DD] | [Open / Resolved] |
| [e.g., "Third-party payment provider outage"] | [N times] | [SEV1, SEV2] | [YYYY-MM-DD] | [YYYY-MM-DD] | [Accepted risk / Fallback implemented] |
| [Pattern] | [N] | [Severities] | [Date] | [Date] | [Status] |

**Rule:** Any incident pattern that recurs 3+ times within a quarter must have a dedicated reliability investment (not just a postmortem action item).

### Incidents by Component

| Component | SEV1 | SEV2 | SEV3 | SEV4 | Total | % of All Incidents |
|-----------|------|------|------|------|-------|-------------------|
| API | [N] | [N] | [N] | [N] | [N] | [X%] |
| Database | [N] | [N] | [N] | [N] | [N] | [X%] |
| Authentication | [N] | [N] | [N] | [N] | [N] | [X%] |
| Payments | [N] | [N] | [N] | [N] | [N] | [X%] |
| Third-party | [N] | [N] | [N] | [N] | [N] | [X%] |
| Deployment | [N] | [N] | [N] | [N] | [N] | [X%] |
| Infrastructure | [N] | [N] | [N] | [N] | [N] | [X%] |
| Other | [N] | [N] | [N] | [N] | [N] | [X%] |

This table reveals which components need the most reliability investment.

---

## Incident Cost Estimation

### Per-Incident Cost

| Incident ID | Severity | Duration | Eng Hours | Revenue Lost | Support Cost | Credits/Refunds | Total Cost |
|------------|----------|----------|-----------|-------------|-------------|----------------|-----------|
| [INC-YYYY-NNN] | SEV[X] | [X hr] | [X hr x $Y] | [$X] | [$X] | [$X] | [$TOTAL] |
| [INC-YYYY-NNN] | SEV[X] | [X hr] | [X hr x $Y] | [$X] | [$X] | [$X] | [$TOTAL] |
| [INC-YYYY-NNN] | SEV[X] | [X hr] | [X hr x $Y] | [$X] | [$X] | [$X] | [$TOTAL] |

### Quarterly Cost Summary

| Quarter | Total Incidents | Total Eng Hours | Total Revenue Lost | Total Support Cost | Total Credits | Grand Total |
|---------|----------------|----------------|-------------------|--------------------|--------------|------------|
| [Q1 YYYY] | [N] | [X hr] | [$X] | [$X] | [$X] | [$TOTAL] |
| [Q2 YYYY] | [N] | [X hr] | [$X] | [$X] | [$X] | [$TOTAL] |
| [Q3 YYYY] | [N] | [X hr] | [$X] | [$X] | [$X] | [$TOTAL] |
| [Q4 YYYY] | [N] | [X hr] | [$X] | [$X] | [$X] | [$TOTAL] |

**Cost formula:**
```
Total cost = Engineering hours x hourly rate
           + Lost revenue during outage
           + Customer support hours x hourly rate
           + Customer credits / refunds issued
           + Indirect costs (churn risk, reputation damage) — estimate
```

Use these numbers to justify reliability investments. If incidents cost $50K/quarter and a reliability project costs $30K, the ROI is obvious.

---

## Postmortem Completion Tracking

| Metric | This Month | Last Month | Target |
|--------|-----------|------------|--------|
| Incidents requiring postmortem (SEV1-SEV3) | [N] | [N] | N/A |
| Postmortems completed within 48 hours | [N / N = X%] | [X%] | 100% |
| Postmortem action items generated | [N] | [N] | >=2 per postmortem |
| Action items completed on time | [N / N = X%] | [X%] | >80% |
| Action items overdue | [N] | [N] | 0 |

**If postmortems are not being completed:** The incident response process is incomplete. Incidents without postmortems will repeat.

**If action items are overdue:** Reliability work is being deprioritized. Escalate to engineering leadership.

---

## Quarterly Incident Review Template

Use this template for your quarterly incident review meeting.

### Meeting Setup

- **Attendees:** Engineering leadership, team leads, on-call engineers, SRE/DevOps
- **Duration:** 60-90 minutes
- **Cadence:** End of each quarter
- **Preparation:** Update all metrics in this document before the meeting

### Agenda

1. **Metrics review** (15 min)
   - MTTD, MTTR, incident frequency trends
   - SLA compliance
   - Cost summary

2. **Recurring patterns** (15 min)
   - Which incidents repeated?
   - What postmortem action items were not completed?
   - Which components are most incident-prone?

3. **Wins** (10 min)
   - What improved this quarter?
   - Which reliability investments paid off?
   - Call out good incident response (specific examples)

4. **Areas for improvement** (15 min)
   - Where are we falling short?
   - What reliability investments should we prioritize?
   - Are there staffing, tooling, or process gaps?

5. **Action items for next quarter** (15 min)
   - Reliability projects to fund
   - Process improvements to implement
   - Monitoring gaps to close
   - Training or game days to schedule

### Quarterly Review Summary

| Area | Q[X] Status | Goal for Q[X+1] |
|------|------------|-----------------|
| SEV1 count | [N] | [Target] |
| SEV2 count | [N] | [Target] |
| Overall MTTR | [X hr] | [Target] |
| SLA compliance | [X%] | [Target] |
| Postmortem completion | [X%] | 100% |
| Action item completion | [X%] | >80% |
| Total incident cost | [$X] | [Target] |

### Next Quarter Priorities

1. [Priority 1 — e.g., "Reduce database-related incidents by implementing connection pooling"]
2. [Priority 2 — e.g., "Improve MTTD by adding synthetic monitoring for critical user journeys"]
3. [Priority 3 — e.g., "Conduct 2 game day exercises"]
4. [Priority 4]
5. [Priority 5]

---

## Incident Log

Running log of all incidents for reference. Link to full postmortem where applicable.

| Incident ID | Date | Severity | Title | Duration | MTTR | Component | Postmortem Link |
|------------|------|----------|-------|----------|------|-----------|----------------|
| INC-[YYYY]-001 | [YYYY-MM-DD] | SEV[X] | [Title] | [X hr] | [X hr] | [Component] | [Link] |
| INC-[YYYY]-002 | [YYYY-MM-DD] | SEV[X] | [Title] | [X hr] | [X hr] | [Component] | [Link] |
| INC-[YYYY]-003 | [YYYY-MM-DD] | SEV[X] | [Title] | [X hr] | [X hr] | [Component] | [Link] |
| INC-[YYYY]-004 | [YYYY-MM-DD] | SEV[X] | [Title] | [X hr] | [X hr] | [Component] | [Link] |
| INC-[YYYY]-005 | [YYYY-MM-DD] | SEV[X] | [Title] | [X hr] | [X hr] | [Component] | [Link] |

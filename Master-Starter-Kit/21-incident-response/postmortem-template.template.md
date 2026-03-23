# Postmortem Report

> A blameless analysis of what happened, why it happened, and what we will do to prevent it from happening again.

---

## Incident Information

| Field | Details |
|-------|---------|
| **Project** | {{PROJECT_NAME}} |
| **Incident ID** | [INC-YYYY-NNN] |
| **Incident Title** | [Descriptive title — e.g., "Database connection pool exhaustion caused API outage"] |
| **Severity** | SEV[1/2/3/4] |
| **Date** | [YYYY-MM-DD] |
| **Duration** | [X hours Y minutes] |
| **Time to Detect (TTD)** | [Minutes from start to first alert] |
| **Time to Mitigate (TTM)** | [Minutes from detection to service restored] |
| **Time to Resolve (TTR)** | [Minutes from detection to root cause fixed] |
| **Incident Commander** | [Name] |
| **Technical Lead** | [Name] |
| **Communications Lead** | [Name] |
| **Postmortem Author** | [Name] |
| **Postmortem Date** | [YYYY-MM-DD — within 48 hours of resolution] |
| **Status** | [Draft / Reviewed / Final] |

---

## Incident Summary

**What happened:**
[2-4 sentences describing the incident in plain language. What broke, who was affected, how long it lasted. Write this so someone outside the team can understand it.]

**Impact:**

| Metric | Value |
|--------|-------|
| Users affected | [Number or percentage] |
| Duration of user impact | [X hours Y minutes] |
| Support tickets received | [Number] |
| Revenue impact | [$X estimated or "none measurable"] |
| SLA breached | [Yes/No — which SLA if yes] |
| Data loss | [Yes/No — describe if yes] |
| Security impact | [Yes/No — describe if yes] |
| Customer churn attributed | [Number or "TBD — monitoring"] |

---

## Timeline of Events

All times in UTC. Document every significant event from first signal to full resolution.

| Time (UTC) | Event | Actor |
|------------|-------|-------|
| [HH:MM] | [First anomalous signal — e.g., "Error rate begins climbing from 0.1% to 2%"] | System |
| [HH:MM] | [Alert fires — e.g., "PagerDuty alert: API error rate > 1%"] | Monitoring |
| [HH:MM] | [On-call acknowledges alert] | [Name] |
| [HH:MM] | [Initial investigation begins — e.g., "Checked dashboard, confirmed elevated errors"] | [Name] |
| [HH:MM] | [Severity assessed — e.g., "Declared SEV2, posted in #incidents channel"] | [Name] |
| [HH:MM] | [Incident Commander assigned] | [Name] |
| [HH:MM] | [Status page updated to Investigating] | [Name] |
| [HH:MM] | [Key diagnostic finding — e.g., "Identified connection pool exhaustion in logs"] | [Name] |
| [HH:MM] | [Mitigation attempted — e.g., "Restarted API servers to clear connection pool"] | [Name] |
| [HH:MM] | [Mitigation result — e.g., "Error rate dropped to 0.5%, recovering"] | System |
| [HH:MM] | [Service restored — e.g., "All metrics returned to baseline"] | System |
| [HH:MM] | [Status page updated to Monitoring] | [Name] |
| [HH:MM] | [Status page updated to Resolved] | [Name] |
| [HH:MM] | [Root cause fix deployed — e.g., "Connection pool config updated and deployed"] | [Name] |
| [HH:MM] | [Incident closed] | [IC Name] |

---

## Root Cause Analysis

### Direct Cause

[What directly caused the incident. One paragraph. Be specific and technical.]

### 5 Whys Analysis

Use the 5 Whys method to dig beyond the surface cause. Stop when you reach a systemic/process issue.

**Why #1: Why did the service go down?**
[Answer — e.g., "The API servers ran out of database connections."]

**Why #2: Why did the API servers run out of database connections?**
[Answer — e.g., "A new background job was opening connections without releasing them."]

**Why #3: Why was a job opening connections without releasing them?**
[Answer — e.g., "The job did not use the connection pool correctly — it opened raw connections."]

**Why #4: Why did the code bypass the connection pool?**
[Answer — e.g., "The background job framework uses a different initialization path that was not covered by our database wrapper."]

**Why #5: Why was this initialization path not covered?**
[Answer — e.g., "We had no integration test for database connection handling in background jobs, and the code review did not catch the pattern because it is a known gap in our review checklist."]

**Root cause (systemic):** [Summarize the deepest why — e.g., "Insufficient test coverage for database connection lifecycle in background jobs, combined with a gap in our code review checklist for connection management patterns."]

---

## Contributing Factors

List all factors that contributed to the incident occurring or worsened its impact. These are not the root cause but made things worse.

| Factor | How It Contributed |
|--------|-------------------|
| [e.g., "No connection pool monitoring"] | [e.g., "We had no alert for connection pool utilization, so we did not detect the leak until connections were exhausted"] |
| [e.g., "Deployed on Friday afternoon"] | [e.g., "Reduced staffing meant slower detection and response"] |
| [e.g., "No integration tests for background jobs"] | [e.g., "The connection leak was not caught before production"] |
| [e.g., "Runbook did not cover connection pool issues"] | [e.g., "On-call engineer had to investigate from scratch instead of following a playbook"] |
| [Factor] | [How it contributed] |

---

## What Went Well

**Always include positives.** Incident response is stressful and the team needs to recognize what worked. This section is mandatory, not optional.

- [e.g., "Alert fired within 3 minutes of the issue starting — our monitoring investment paid off"]
- [e.g., "On-call engineer acknowledged within 2 minutes and had the incident channel set up quickly"]
- [e.g., "Status page was updated promptly — only 2 customer support tickets before we posted"]
- [e.g., "Rollback was clean and fast — service restored in under 10 minutes"]
- [e.g., "Communication was clear and timely — leadership felt informed without needing to ask"]
- [Positive observation]
- [Positive observation]

---

## What Went Poorly

Be honest. This section drives improvement. Remember: blameless means we critique the process, not the person.

- [e.g., "Detection took 20 minutes — we had no alert for this specific failure mode"]
- [e.g., "On-call engineer was unsure of escalation path — had to look up the process mid-incident"]
- [e.g., "Customer-facing communication was delayed by 45 minutes — template was not immediately accessible"]
- [e.g., "Initial mitigation attempt (restart) failed and wasted 15 minutes"]
- [e.g., "No runbook existed for connection pool exhaustion — responder had to diagnose from scratch"]
- [Issue]
- [Issue]

---

## Action Items

Every action item must have an owner and a deadline. Unowned action items do not get done. Track these in your project management tool.

| # | Action Item | Owner | Deadline | Priority | Status | Ticket |
|---|-------------|-------|----------|----------|--------|--------|
| 1 | [e.g., "Add connection pool utilization alert (warn at 70%, critical at 90%)"] | [Name] | [YYYY-MM-DD] | P1 | [Open/In Progress/Done] | [TICKET-123] |
| 2 | [e.g., "Add integration test for background job database connections"] | [Name] | [YYYY-MM-DD] | P1 | [Open/In Progress/Done] | [TICKET-124] |
| 3 | [e.g., "Update code review checklist to include connection management patterns"] | [Name] | [YYYY-MM-DD] | P2 | [Open/In Progress/Done] | [TICKET-125] |
| 4 | [e.g., "Create runbook for database connection pool exhaustion"] | [Name] | [YYYY-MM-DD] | P2 | [Open/In Progress/Done] | [TICKET-126] |
| 5 | [e.g., "Add deployment freeze policy for Friday afternoons"] | [Name] | [YYYY-MM-DD] | P3 | [Open/In Progress/Done] | [TICKET-127] |
| 6 | [Action item] | [Name] | [YYYY-MM-DD] | [P1/P2/P3] | [Status] | [Ticket] |

**Priority definitions:**
- **P1:** Must be completed before the next on-call rotation (prevents immediate recurrence)
- **P2:** Must be completed within 2 weeks (reduces risk of recurrence)
- **P3:** Should be completed within the current quarter (systemic improvement)

---

## Prevention Measures

Beyond the specific action items above, what systemic changes should we consider to prevent this class of incident?

### Short-Term (This Sprint)

- [e.g., "Add monitoring for all connection pools, not just the ones we have had issues with"]
- [e.g., "Audit all background jobs for proper resource cleanup"]
- [Measure]

### Medium-Term (This Quarter)

- [e.g., "Implement circuit breakers for database connections"]
- [e.g., "Add chaos engineering tests for resource exhaustion scenarios"]
- [Measure]

### Long-Term (This Year)

- [e.g., "Migrate to a connection pooler (PgBouncer) to centralize connection management"]
- [e.g., "Implement automated canary deployments to detect connection leaks before full rollout"]
- [Measure]

---

## Metrics Impact

Document the measurable impact of the incident on key metrics.

### During Incident

| Metric | Normal Baseline | During Incident | Peak Degradation |
|--------|----------------|-----------------|------------------|
| Error rate | [e.g., 0.1%] | [e.g., 15%] | [e.g., 45% at HH:MM] |
| P50 latency | [e.g., 120ms] | [e.g., 2,500ms] | [e.g., 8,000ms at HH:MM] |
| P95 latency | [e.g., 350ms] | [e.g., 12,000ms] | [e.g., 30,000ms at HH:MM] |
| Requests/min | [e.g., 5,000] | [e.g., 1,200] | [e.g., 800 at HH:MM] |
| Active users | [e.g., 2,500] | [e.g., 900] | [e.g., 400 at HH:MM] |
| [Custom metric] | [Baseline] | [During] | [Peak] |

### Recovery

| Metric | Time to Return to Baseline |
|--------|---------------------------|
| Error rate | [e.g., "15 minutes after mitigation"] |
| Latency | [e.g., "25 minutes after mitigation"] |
| Active users | [e.g., "2 hours — users gradually returned"] |
| [Custom metric] | [Recovery time] |

### Business Impact

| Impact Area | Estimated Cost |
|-------------|---------------|
| Lost revenue | [$X] |
| Engineering hours spent | [X hours x $Y/hr = $Z] |
| Customer support hours | [X hours x $Y/hr = $Z] |
| Customer credits/refunds issued | [$X] |
| Estimated customer churn risk | [X customers, $Y ARR at risk] |
| **Total estimated cost** | **[$TOTAL]** |

---

## Appendix

### Links and References

| Resource | Link |
|----------|------|
| Incident {{TEAM_COMMUNICATION_TOOL}} channel | [Link to archived channel or thread] |
| Monitoring dashboard (incident time range) | [Link with time range parameters] |
| Relevant log queries | [Link to log search] |
| Deployment that triggered (if applicable) | [Link to deployment/PR/commit] |
| Related previous incidents | [INC-YYYY-NNN, INC-YYYY-NNN] |
| Status page incident | [Link to public incident page] |
| Customer support tickets | [Link to filtered ticket view] |

### Incident Response Process Feedback

_Use this section to improve the incident response process itself._

- **Did the runbook help?** [Yes/No — if no, what was missing?]
- **Did alerts fire correctly?** [Yes/No — if no, what was missed?]
- **Was communication timely?** [Yes/No — where were the delays?]
- **Were the right people involved?** [Yes/No — who was missing or unnecessary?]
- **What would you change about how we responded?** [Free text]

---

## Sign-Off

| Role | Name | Date | Reviewed |
|------|------|------|----------|
| Incident Commander | [Name] | [Date] | [ ] |
| Technical Lead | [Name] | [Date] | [ ] |
| Engineering Manager | [Name] | [Date] | [ ] |
| Postmortem Author | [Name] | [Date] | [ ] |

---

_This postmortem follows the blameless postmortem principles of {{PROJECT_NAME}}. We examine systems and processes, not individuals. If you see blame language in this document, flag it for revision._

# Severity Levels

> A shared vocabulary for incident severity that eliminates triage debates and drives consistent response times.

---

## Overview

Severity levels are the foundation of incident response. Without clear, agreed-upon definitions, every incident starts with a debate: "Is this really a SEV1?" That debate wastes the most critical minutes of your response. Define severity once, get team buy-in, and never argue about it during an active incident again.

These definitions are intentionally opinionated. Adjust the thresholds for your project, but keep the structure. Four levels is the sweet spot — fewer creates ambiguity, more creates decision paralysis.

---

## Severity Definitions

### SEV1 — Critical

**Definition:** Complete service outage or critical functionality is unavailable for all or most users. Data loss or security breach is occurring or imminent.

**Response Time SLA:** Acknowledge within **5 minutes**. First responder engaged within **15 minutes**. Incident commander assigned within **15 minutes**.

**Resolution Target:** Mitigated within **1 hour**. Fully resolved within **4 hours**.

**Customer Impact:**
- 50-100% of users affected
- Revenue-generating features are completely unavailable
- Data integrity is compromised or at risk
- Security breach in progress

**Real-World Examples:**
- Production database is down — no reads or writes
- Payment processing is completely broken — no transactions going through
- Authentication system is down — nobody can log in
- Data breach discovered — customer PII is exposed
- Main application returns 500 errors for all users
- DNS failure — domain is unreachable

**Who Gets Notified:**

| Role | Method | Timing |
|------|--------|--------|
| On-call engineer | Phone call + SMS + push notification | Immediately |
| Engineering manager | Phone call + SMS | Within 5 minutes |
| Incident commander (if separate) | Phone call | Within 5 minutes |
| VP of Engineering / CTO | SMS + email | Within 15 minutes |
| Customer support lead | Slack/Teams + email | Within 15 minutes |
| CEO / Founders | SMS | Within 30 minutes (if prolonged) |

---

### SEV2 — High

**Definition:** Major feature is degraded or unavailable for a significant portion of users. No data loss, but user experience is severely impacted.

**Response Time SLA:** Acknowledge within **15 minutes**. First responder engaged within **30 minutes**.

**Resolution Target:** Mitigated within **2 hours**. Fully resolved within **8 hours**.

**Customer Impact:**
- 10-50% of users affected
- Core feature is degraded but workarounds exist
- Performance is severely degraded (>5x normal latency)
- Revenue impact is partial but measurable

**Real-World Examples:**
- API response times are 10x normal — app is usable but painfully slow
- Search functionality is broken but users can browse manually
- Email notifications are not sending — users miss updates
- File uploads fail intermittently — 30% success rate
- Mobile app crashes on a specific OS version affecting 20% of users
- Webhook deliveries are delayed by 30+ minutes

**Who Gets Notified:**

| Role | Method | Timing |
|------|--------|--------|
| On-call engineer | Push notification + SMS | Immediately |
| Engineering manager | Slack/Teams message | Within 15 minutes |
| Incident commander (if needed) | Slack/Teams message | Within 15 minutes |
| Customer support lead | Slack/Teams message | Within 30 minutes |

---

### SEV3 — Moderate

**Definition:** Non-critical feature is impaired or a bug is affecting a small subset of users. Core functionality is intact. Workarounds are available.

**Response Time SLA:** Acknowledge within **1 hour**. First responder engaged within **4 hours** (next business day if after hours).

**Resolution Target:** Resolved within **24-48 hours**.

**Customer Impact:**
- 1-10% of users affected
- Non-core feature is broken
- Cosmetic or UX issues that cause confusion
- Minor data inconsistencies (no loss)

**Real-World Examples:**
- Dashboard charts are not rendering for users on Firefox
- CSV export includes duplicate rows
- Push notifications are delayed by 2-5 minutes
- Profile image upload fails for images over 5MB
- Timezone display is wrong for users in specific regions
- Pagination breaks on the 100th page of results

**Who Gets Notified:**

| Role | Method | Timing |
|------|--------|--------|
| On-call engineer | Slack/Teams message | Within 1 hour |
| Relevant team lead | Slack/Teams message | Next standup |

---

### SEV4 — Low

**Definition:** Minor issue with minimal user impact. Cosmetic bugs, minor inconveniences, or issues with internal tooling. No customer-facing impact or negligible impact.

**Response Time SLA:** Acknowledge within **1 business day**. Resolution planned in regular sprint.

**Resolution Target:** Resolved within **1-2 sprints** (planned work, not interrupt-driven).

**Customer Impact:**
- <1% of users affected (or internal only)
- Cosmetic issue — no functional impact
- Internal tooling degradation
- Performance is slightly below target but within acceptable range

**Real-World Examples:**
- Admin panel CSS is broken on one page
- Internal metrics dashboard loads slowly
- Tooltip text has a typo
- Dark mode has a color contrast issue on one component
- Log messages contain unnecessary warnings
- Staging environment has a configuration drift

**Who Gets Notified:**

| Role | Method | Timing |
|------|--------|--------|
| Team backlog | Ticket created | Next triage session |

---

## Escalation Triggers

An incident escalates to a higher severity when these thresholds are crossed. Escalation is not failure — it is the system working correctly.

### SEV4 escalates to SEV3 when:
- A customer reports the issue (it is not just internal)
- The issue affects more users than initially estimated
- The bug blocks a specific workflow that has no workaround
- Multiple SEV4 tickets for the same root cause accumulate

### SEV3 escalates to SEV2 when:
- Affected user count exceeds 10%
- The issue persists for more than 4 hours without a fix
- A workaround stops working or is too complex for users
- Customer support ticket volume spikes due to the issue
- Revenue impact is confirmed (even if small)

### SEV2 escalates to SEV1 when:
- Affected user count exceeds 50%
- Mitigation efforts fail after 1 hour
- Data loss or corruption is discovered
- A security vector is identified
- The degradation worsens (error rates climbing, not stable)
- Executive or board visibility is required

### Automatic SEV1 Triggers (bypass triage):
- Complete service outage (health check fails)
- Confirmed data breach or unauthorized access
- Database corruption detected
- All payments failing
- Legal/compliance violation discovered

---

## Customer Impact Matrix

| Dimension | SEV1 | SEV2 | SEV3 | SEV4 |
|-----------|------|------|------|------|
| **Users affected** | >50% | 10-50% | 1-10% | <1% |
| **Revenue impact** | Total loss of revenue capability | Partial revenue loss | Negligible | None |
| **Data integrity** | Loss or corruption occurring | At risk but not occurring | Minor inconsistency | No impact |
| **Core functionality** | Completely unavailable | Severely degraded | Partially impaired | Fully functional |
| **Workaround available** | No | Yes, but difficult | Yes, straightforward | Not needed |
| **Security risk** | Active breach or imminent | Potential exposure identified | Low risk, no active exploit | None |
| **Reputational impact** | Press/social media coverage likely | Customer complaints spike | Isolated complaints | None |

---

## Severity Decision Tree

Use this flowchart when you are unsure how to classify an incident. Start at the top and follow the branches.

```
START: Is the service completely down for all/most users?
  |
  YES --> Is there a data breach or data loss?
  |         YES --> SEV1 (Critical + Security)
  |         NO  --> SEV1 (Critical)
  |
  NO --> Is a core feature severely degraded or unavailable?
    |
    YES --> Are >10% of users affected?
    |         YES --> SEV2 (High)
    |         NO  --> Is there revenue impact?
    |                   YES --> SEV2 (High)
    |                   NO  --> SEV3 (Moderate)
    |
    NO --> Is the issue customer-facing?
      |
      YES --> Are >1% of users affected?
      |         YES --> SEV3 (Moderate)
      |         NO  --> SEV4 (Low)
      |
      NO --> SEV4 (Low / Internal)
```

**When in doubt, round up.** It is better to over-classify and de-escalate than to under-classify and scramble later. A SEV2 that turns out to be a SEV3 wastes 30 minutes of extra attention. A SEV3 that should have been a SEV2 wastes hours of inadequate response.

---

## Common Misclassifications

| Incident | Often Classified As | Should Be |  Why |
|----------|-------------------|-----------|------|
| "Slow API but nobody complained" | SEV4 | SEV3 | Users leave before complaining. Check analytics, not just tickets. |
| "One customer lost data" | SEV3 | SEV2 | Any data loss escalates immediately. One customer today could be many tomorrow. |
| "Internal admin tool is down" | SEV4 | SEV3 | If it blocks support from helping customers, it is customer-facing by proxy. |
| "Deployment is stuck" | SEV3 | SEV2 | If you cannot deploy, you cannot fix anything else. Deployment pipeline is critical infrastructure. |
| "Authentication is slow" | SEV3 | SEV2 | Auth latency multiplies across every user action. A 3-second auth delay makes the whole app feel broken. |
| "Error rate went from 0.1% to 2%" | SEV4 | SEV3 | A 20x increase in error rate is significant regardless of absolute numbers. |

---

## Severity Level Quick Reference Card

Print this. Put it on the wall. Put it in the incident response Slack channel topic.

```
SEV1  CRITICAL   All/most users down, data loss, security breach
                  Response: 5 min ack, 15 min engage, 1 hr mitigate
                  Notify: Everyone. Phone calls.

SEV2  HIGH       Major feature degraded, 10-50% of users affected
                  Response: 15 min ack, 30 min engage, 2 hr mitigate
                  Notify: On-call + eng manager + support lead.

SEV3  MODERATE   Non-critical feature impaired, <10% of users
                  Response: 1 hr ack, 4 hr engage (business hours)
                  Notify: On-call + team lead at next standup.

SEV4  LOW        Cosmetic, internal, minimal impact
                  Response: 1 business day ack, sprint-planned fix
                  Notify: Ticket in backlog.
```

# SLA Definitions — {{PROJECT_NAME}}

> Service Level Agreements define what your users can expect from your support team. Publish them, measure them, and take it seriously when you miss them.

---

## Overview

This document defines the Service Level Agreement (SLA) targets for {{PROJECT_NAME}} customer support across all tiers and channels. SLAs are not aspirational goals — they are commitments. When you publish an SLA, you are making a promise to your users. Breaking that promise erodes trust faster than almost anything else.

**Support Platform:** {{SUPPORT_PLATFORM}}
**Active Channels:** {{SUPPORT_CHANNELS}}

---

## SLA Definitions by Tier and Channel

### Free Tier

| Channel | First Response | Resolution Target | Escalation Trigger | Availability |
|---------|---------------|--------------------|--------------------|-------------|
| Email | {{FREE_TIER_SLA}} | 5 business days | No escalation | Business hours (Mon-Fri) |
| Knowledge Base | Self-serve | Self-serve | N/A | 24/7 |
| Community (Discord/Forum) | Best effort | Best effort | N/A | Community-driven |

**Notes:**
- Free tier SLAs are "best effort" — they are targets, not contractual commitments
- Free users should be directed to self-serve resources (KB, docs, community) before email support
- Free tier email support is deprioritized below paid tiers in the queue

### Pro Tier

| Channel | First Response | Resolution Target | Escalation Trigger | Availability |
|---------|---------------|--------------------|--------------------|-------------|
| Email | 24 hours | 2 business days | No response in 48 hours | Business hours (Mon-Fri) |
| Chat | 4 hours | 1 business day | No response in 8 hours | Business hours (Mon-Fri) |
| Knowledge Base | Self-serve | Self-serve | N/A | 24/7 |

**Notes:**
- Pro users receive priority over free users in the queue
- Chat SLA applies during business hours only — messages sent after hours are queued for next business day
- Pro users receive a confirmation email when their ticket is received

### Business Tier

| Channel | First Response | Resolution Target | Escalation Trigger | Availability |
|---------|---------------|--------------------|--------------------|-------------|
| Email | 4 hours | 1 business day | No response in 8 hours | Extended hours (Mon-Sat) |
| Chat | 1 hour | 4 hours | No response in 2 hours | Extended hours (Mon-Sat) |
| Phone | 15 minutes | 2 hours | Immediate upon contact | Business hours (Mon-Fri) |
| Knowledge Base | Self-serve | Self-serve | N/A | 24/7 |

**Notes:**
- Business tier tickets are flagged as high priority automatically
- Phone support is available during business hours with voicemail after hours (callback within 4 hours on next business day)
- Business users have access to a named support contact

### Enterprise Tier

| Channel | First Response | Resolution Target | Escalation Trigger | Availability |
|---------|---------------|--------------------|--------------------|-------------|
| Dedicated Slack Channel | 1 hour | 4 hours | Immediate | 24/7 (with on-call) |
| Email | 2 hours | 4 hours | No response in 4 hours | 24/7 |
| Phone | 15 minutes | 2 hours | Immediate upon contact | 24/7 |
| Video Call | Scheduled within 4 hours | Same day | Immediate | Business hours |
| Knowledge Base | Self-serve | Self-serve | N/A | 24/7 |

**Notes:**
- Enterprise users have a dedicated Customer Success Manager (CSM)
- Enterprise SLAs may be customized per contract — check the customer's agreement before applying defaults
- 24/7 support is backed by an on-call rotation (see Section 21: Incident Response)
- Quarterly business reviews include SLA compliance reporting

---

## SLA Definitions

### First Response Time

The time between when a user submits a ticket and when a human support agent sends the first meaningful reply. Automated acknowledgments ("We received your ticket") do not count as a first response. The first response must demonstrate that a human has read and understood the issue.

### Resolution Time

The time between when a user submits a ticket and when the issue is resolved to the user's satisfaction. Resolution is confirmed when:
- The user confirms the issue is resolved, OR
- The user does not respond within 72 hours after a solution is provided (auto-resolved), OR
- The issue is determined to be outside the scope of support (with explanation)

### Escalation Trigger

The condition under which a ticket is automatically escalated to a higher priority or management attention. Escalation triggers are safety nets — they ensure that no ticket is silently dropped.

---

## Severity-Based SLA Modifiers

SLAs are modified based on ticket severity, regardless of the user's pricing tier.

| Severity | Description | SLA Modifier | Examples |
|----------|-------------|-------------|----------|
| **SEV1 — Critical** | Service is down, data loss, security breach | All tiers: 1-hour first response, 4-hour resolution | Login completely broken, data deleted, payment processing failed |
| **SEV2 — Major** | Core feature broken, significant impact, no workaround | Paid tiers: 50% faster than standard SLA | Cannot export data, search is broken, API returning errors |
| **SEV3 — Minor** | Feature degraded, workaround exists, limited impact | Standard SLA applies | Slow loading, cosmetic issue, minor feature broken |
| **SEV4 — Cosmetic** | Visual issue, typo, minor inconvenience | Standard SLA applies, lowest queue priority | Button misaligned, typo in UI, color rendering issue |

**Rule:** A SEV1 from a free user is handled faster than a SEV4 from an enterprise user. Severity overrides tier for critical issues.

---

## SLA Breach Protocol

### What Happens When an SLA Is Missed

**Level 1 — Warning (SLA at 80% of target):**
- Ticket is highlighted in the support queue
- Agent receives a notification
- No management action required

**Level 2 — Breach (SLA target exceeded):**
- Ticket is auto-escalated to the support lead
- Support lead assigns or reassigns the ticket within 30 minutes
- Breach is logged in the SLA compliance report
- User receives a proactive update: "We apologize for the delay — your issue is being reviewed by a senior team member"

**Level 3 — Critical Breach (SLA exceeded by 2x or more):**
- Ticket is escalated to the Head of Support / VP of Customer Success
- User receives a personal outreach (email or call) with an apology and timeline
- Root cause analysis is conducted: why was the SLA missed?
- Action item is created to prevent recurrence
- If contractual SLA (Enterprise), check for penalty/credit obligations

### Breach Notification Templates

**Internal (Slack/Team Channel):**
```
:warning: SLA BREACH — Ticket #[ID]
User: [Name] ([Tier])
Channel: [Email/Chat]
Issue: [One-line summary]
SLA Target: [X hours]
Actual: [Y hours]
Status: [Unassigned / Assigned to [Agent]]
Action needed: [Assign / Respond / Escalate]
```

**External (User-Facing):**
```
Hi [Name],

I want to apologize — our response time on your recent request did not meet the
standard we hold ourselves to. Your issue is now being reviewed by a senior team
member, and you should hear back within [timeframe].

Thank you for your patience, and I'm sorry for the delay.

[Agent Name]
{{PROJECT_NAME}} Support
```

---

## SLA Measurement Methodology

### What Counts Toward SLA Time

- Business hours only (unless 24/7 SLA applies): Monday-Friday, 9:00 AM - 6:00 PM in the customer's timezone
- Extended hours (Business tier): Monday-Saturday, 8:00 AM - 8:00 PM in the customer's timezone
- 24/7 (Enterprise): All hours, all days

### What Does NOT Count Toward SLA Time

- Time while waiting for the user to respond (SLA clock pauses on "awaiting customer reply")
- Planned maintenance windows (announced 48+ hours in advance)
- Force majeure events (see Exclusions section)
- Time spent on user-caused issues (misconfiguration, exceeded limits)

### SLA Clock Rules

1. **Clock starts** when the ticket is created (not when it is assigned)
2. **Clock pauses** when the status changes to "Awaiting Customer Reply"
3. **Clock resumes** when the customer replies
4. **Clock stops** when the ticket is resolved
5. **Auto-resolve:** If a customer does not reply within 72 hours after a solution is provided, the ticket is auto-resolved. The SLA clock stops at the time the solution was sent.

---

## SLA Reporting

### Weekly Report Template

```markdown
# {{PROJECT_NAME}} Support — Weekly SLA Report
**Week of:** [Date Range]
**Prepared by:** [Name]

## Summary
- Total tickets: [N]
- Tickets within SLA: [N] ([%])
- SLA breaches: [N] ([%])
- Average first response time: [X hours]
- Average resolution time: [X hours]

## SLA Compliance by Tier
| Tier | Tickets | Within SLA | Breaches | Compliance % |
|------|---------|------------|----------|-------------|
| Free | | | | |
| Pro | | | | |
| Business | | | | |
| Enterprise | | | | |

## Breach Details
| Ticket # | Tier | Channel | SLA Target | Actual | Root Cause |
|----------|------|---------|------------|--------|------------|
| | | | | | |

## Actions Taken
- [List any corrective actions from breaches]

## Trends
- [Notable trends: volume changes, common issues, staffing concerns]
```

### Monthly Report Additions

Add to the weekly template:
- Month-over-month SLA compliance trend
- Top 5 ticket categories and their average resolution time
- Staffing vs. volume analysis (do we need more agents?)
- KB effectiveness: how many tickets could have been prevented with better self-serve content?

### Quarterly Strategy Review

- SLA target review: are current targets appropriate?
- Tier-specific analysis: which tiers are underserved?
- Channel effectiveness: which channels have the best resolution rates?
- Cost per ticket by tier and channel
- Recommendations for SLA adjustments based on data

---

## Exclusions

The following situations are excluded from SLA calculations:

### Planned Maintenance

- Maintenance windows announced 48+ hours in advance via status page and email
- During maintenance, support tickets related to the maintenance are excluded from SLA
- Non-maintenance tickets during maintenance windows still follow standard SLAs

### Force Majeure

- Natural disasters, wars, pandemics, government actions
- Infrastructure provider outages beyond our control (AWS, GCP, Azure region failures)
- Internet backbone disruptions
- DDoS attacks exceeding reasonable mitigation capacity

### Customer-Caused Issues

- Tickets resulting from the customer violating terms of service
- Issues caused by customer-side infrastructure (their network, browser, custom code)
- Requests for features that do not exist (reclassified as feature requests, not support tickets)

### Abuse and Spam

- Duplicate tickets submitted for the same issue
- Tickets submitted in bad faith or for harassment
- Automated ticket submissions (bot spam)

---

## SLA Revision History

| Date | Change | Rationale |
|------|--------|-----------|
| <!-- {{START_DATE}} --> | Initial SLA definitions published | Launch baseline |
| | | |
| | | |

**Review cadence:** SLAs are reviewed quarterly and updated as needed based on team capacity, ticket volume trends, and customer feedback. Any SLA changes are communicated to customers 30 days before taking effect.

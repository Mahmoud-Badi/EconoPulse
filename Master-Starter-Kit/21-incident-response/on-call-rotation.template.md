# On-Call Rotation

> A fair, sustainable on-call system that ensures someone is always watching production without burning anyone out.

---

## Project Information

| Field | Value |
|-------|-------|
| **Project** | {{PROJECT_NAME}} |
| **On-Call Tool** | {{ONCALL_TOOL}} |
| **Team Size** | {{TEAM_SIZE}} |
| **Rotation Cadence** | Weekly (configurable) |
| **Handoff Day/Time** | Tuesday 10:00 AM local time (avoids Monday chaos and Friday surprises) |
| **Rotation Last Updated** | [YYYY-MM-DD] |

---

## On-Call Philosophy

On-call is a professional responsibility, not a punishment. It exists because production systems need human judgment when automated systems cannot self-heal. A good on-call rotation is:

- **Fair:** Everyone participates. No one person carries the burden.
- **Sustainable:** On-call should not degrade quality of life. If it does, the system is broken, not the person.
- **Supported:** The on-call engineer is never alone. Escalation paths are clear and backup is always available.
- **Compensated:** On-call work is recognized and rewarded, whether through time off, pay, or both.

---

## Rotation Schedule

### Weekly Rotation Template

<!-- IF {{TEAM_SIZE}} == "small" -->
With a small team (2-4 engineers), each person is on call every 2-4 weeks. This is sustainable if incident volume is low. If anyone is on call more than every other week, the team needs to grow or the system needs to be more reliable.
<!-- ENDIF -->

<!-- IF {{TEAM_SIZE}} == "medium" -->
With a medium team (5-8 engineers), each person is on call approximately once every 5-8 weeks. This is a healthy cadence. Consider having a primary and secondary on-call.
<!-- ENDIF -->

<!-- IF {{TEAM_SIZE}} == "large" -->
With a large team (9+ engineers), consider sub-team rotations where each team owns their services. A primary and secondary on-call per sub-team prevents single-person bottlenecks.
<!-- ENDIF -->

| Week | Dates | Primary On-Call | Secondary On-Call | Notes |
|------|-------|----------------|-------------------|-------|
| 1 | [MM/DD - MM/DD] | [Name] | [Name] | |
| 2 | [MM/DD - MM/DD] | [Name] | [Name] | |
| 3 | [MM/DD - MM/DD] | [Name] | [Name] | |
| 4 | [MM/DD - MM/DD] | [Name] | [Name] | |
| 5 | [MM/DD - MM/DD] | [Name] | [Name] | |
| 6 | [MM/DD - MM/DD] | [Name] | [Name] | |
| 7 | [MM/DD - MM/DD] | [Name] | [Name] | |
| 8 | [MM/DD - MM/DD] | [Name] | [Name] | |

**Primary on-call:** First responder for all alerts. Carries the pager.
**Secondary on-call:** Backup if primary does not respond within 10 minutes. Also available for escalation.

### Schedule Rules

1. **No back-to-back weeks.** At least one week off between on-call shifts.
2. **Swap policy:** Engineers can swap shifts with mutual agreement. Post all swaps in the team channel and update {{ONCALL_TOOL}}.
3. **Holiday coverage:** Holidays are assigned round-robin. Volunteering for holiday on-call earns an extra day off.
4. **New engineer ramp-up:** New team members shadow for 2 on-call rotations before taking primary. They are secondary on their first solo rotation.
5. **PTO conflicts:** If your on-call week falls during PTO, it is your responsibility to find a swap at least 1 week in advance.

---

## On-Call Responsibilities

### What You Must Do

- [ ] **Respond to alerts within 5 minutes** during on-call hours (15 minutes during sleeping hours for SEV3+, immediately for SEV1/SEV2)
- [ ] **Triage every alert.** Acknowledge, assess severity, and take action or escalate.
- [ ] **Keep your pager/phone charged and within reach.** If you step away (shower, errand), ensure secondary knows.
- [ ] **Check monitoring dashboards twice per shift** (morning and evening) even without alerts
- [ ] **Be within reasonable response proximity.** You do not need to sit at your laptop, but you need to be able to get to one within 15 minutes.
- [ ] **Document all incidents** in the incident channel, no matter how small.
- [ ] **Update runbooks** if you discover something undocumented during your shift.
- [ ] **Complete the handoff** to the next on-call at the end of your rotation.

### What You Are NOT Expected To Do

- Fix everything yourself. Escalation is not failure.
- Be awake for 24 hours. If an incident wakes you up at 3 AM and you resolve it, adjust your next workday.
- Have deep expertise on every system. Runbooks and escalation paths exist for this reason.
- Sacrifice personal commitments. If something comes up, swap your shift. The process supports this.

---

## Alert Response Protocol

### During Business Hours (9 AM - 6 PM local)

| Alert Severity | Response Time | Action |
|---------------|---------------|--------|
| SEV1 | 5 minutes | Drop everything. Acknowledge, declare incident, begin response. |
| SEV2 | 15 minutes | Acknowledge. Assess if you can handle or need to pull in help. |
| SEV3 | 1 hour | Acknowledge. Investigate when current task reaches a stopping point. |
| SEV4 | 4 hours | Acknowledge. Create a ticket if one does not exist. |

### After Hours (6 PM - 9 AM, weekends, holidays)

| Alert Severity | Response Time | Action |
|---------------|---------------|--------|
| SEV1 | 5 minutes | Wake up and respond. This is why on-call exists. |
| SEV2 | 15 minutes | Wake up and respond. Assess if it can wait until morning. |
| SEV3 | Next morning | Acknowledge if you see it. Otherwise handle first thing in the morning. |
| SEV4 | Next business day | Do not wake up for this. Handle during business hours. |

**Configure {{ONCALL_TOOL}} to only wake you up for SEV1 and SEV2 after hours.** SEV3/SEV4 should route to less intrusive notification channels (email, Slack) outside business hours.

---

## Escalation Policy

If the primary on-call does not respond within the SLA, {{ONCALL_TOOL}} automatically escalates.

```
Alert fires
  |
  +-- 0 min:  Primary on-call notified (push + SMS)
  +-- 5 min:  Primary re-notified (phone call) if no acknowledgment
  +-- 10 min: Secondary on-call notified (push + SMS + phone call)
  +-- 15 min: Engineering manager notified (SMS + phone call)
  +-- 20 min: VP Engineering / CTO notified (SMS)
```

### Manual Escalation

The on-call engineer should manually escalate when:

- The issue is outside their area of expertise (page the domain expert)
- Mitigation attempts have failed after 30 minutes
- The incident scope is growing (more systems affected)
- A customer-facing decision is needed (e.g., take a feature offline)
- They are unsure about the severity level (round up and escalate)

---

## Handoff Protocol

Every rotation handoff must include the following. This happens at the scheduled handoff time (Tuesday 10:00 AM by default).

### Outgoing On-Call Delivers

1. **Active issues summary:**
   - Any ongoing incidents (severity, status, what is being monitored)
   - Any degraded services or known issues being tracked
   - Any alerts that are flapping or need attention

2. **Shift log:**
   - Incidents that occurred during the shift (even if resolved)
   - Notable alerts that did not become incidents
   - Any changes made to monitoring, alerting, or infrastructure

3. **Heads-up items:**
   - Upcoming deployments that might cause issues
   - Known maintenance windows
   - Any flaky tests or builds that might trigger false alerts
   - Customer-reported issues still being investigated

4. **Runbook updates:**
   - Any new runbook entries or updates made during the shift
   - Any gaps discovered in existing runbooks

### Incoming On-Call Confirms

- [ ] I have read the shift log and active issues summary
- [ ] I have access to {{ONCALL_TOOL}} and am receiving test notifications
- [ ] I know who my secondary on-call is: [Name]
- [ ] I know the current escalation path
- [ ] I have reviewed any pending deployments for this week
- [ ] My phone/pager is charged and configured
- [ ] I have the incident response runbook bookmarked/accessible

### Handoff Format

Post in the team channel at handoff time:

```
ON-CALL HANDOFF: [Outgoing Name] -> [Incoming Name]

Active issues: [None / List them]
Shift summary: [Brief — e.g., "Quiet week, one SEV4 for dashboard CSS, resolved"]
Heads-up: [Any upcoming deployments, maintenance, or known risks]
Runbook updates: [Any changes made]

[Incoming Name] — you are now primary on-call. [Secondary Name] is your backup.
```

---

## Compensation and Time-Off Policy

On-call work is real work and should be recognized. These are guidelines — adjust for your organization.

### Compensation Options

| Option | Description | Recommended For |
|--------|-------------|----------------|
| **Stipend** | Fixed weekly payment for being on call ($X/week) | Teams where on-call is part of the role |
| **Hourly rate** | Paid for actual incident response time at 1.5x rate | Teams with frequent after-hours pages |
| **Time off in lieu** | 1 hour off for every hour of after-hours incident work | Startups with limited budget |
| **Combination** | Base stipend + hourly for after-hours incidents | Best balance of recognition and fairness |

### Time-Off Guidelines

- **After a nighttime page (12 AM - 6 AM):** Start the next workday late. Sleep is not optional.
- **After a long incident (>4 hours after hours):** Take the next half day or full day off.
- **After a weekend-consuming incident:** Take a compensatory day off the following week.
- **After back-to-back difficult weeks:** Manager should proactively offer recovery time.

---

## On-Call Wellness

Sustainable on-call requires deliberate attention to engineer well-being.

### Hard Limits

| Rule | Limit |
|------|-------|
| Maximum consecutive on-call days | 7 days (1 week) |
| Maximum on-call frequency | 1 week out of every 3 weeks minimum |
| Maximum after-hours pages per week before review | 5 |
| Minimum team size for 24/7 on-call | 4 engineers |

### If These Limits Are Exceeded

If the on-call engineer is getting paged too frequently, the problem is not the person — it is the system. Response:

1. **Immediately:** Route non-critical alerts to async channels (email, ticket) during off-hours
2. **This sprint:** Identify the top 3 alerting services and invest in fixing them
3. **This quarter:** Re-evaluate SLOs and alerting thresholds — are you alerting on things that do not need human intervention?
4. **This year:** Invest in self-healing automation to reduce human-in-the-loop requirements

<!-- IF {{TEAM_SIZE}} == "large" -->
### Follow-the-Sun Rotation

For distributed teams across time zones, consider a follow-the-sun model:

| Time Zone | On-Call Hours | Coverage |
|-----------|-------------- |----------|
| Americas (UTC-8 to UTC-5) | 06:00 - 14:00 UTC | [Team/Names] |
| Europe/Africa (UTC-1 to UTC+3) | 14:00 - 22:00 UTC | [Team/Names] |
| Asia/Pacific (UTC+5 to UTC+12) | 22:00 - 06:00 UTC | [Team/Names] |

**Benefits:** Nobody gets paged at 3 AM. Every engineer is on call during their business hours.
**Requirements:** At least 2 engineers per time zone band, consistent handoff protocol.
<!-- ENDIF -->

---

## Tooling Setup Guide

### {{ONCALL_TOOL}} Configuration

<!-- IF {{ONCALL_TOOL}} == "PagerDuty" -->
**PagerDuty Setup:**

1. Create a service for {{PROJECT_NAME}} in PagerDuty
2. Set up an escalation policy:
   - Level 1: Primary on-call (immediately)
   - Level 2: Secondary on-call (after 5 minutes)
   - Level 3: Engineering manager (after 10 minutes)
3. Create a schedule matching the rotation table above
4. Integrate with your monitoring tools:
   - Connect Datadog/New Relic/CloudWatch for automated alerts
   - Connect your status page for incident lifecycle
5. Install the PagerDuty mobile app and enable push notifications + phone calls
6. Configure alert grouping to prevent alert storms (30-second grouping window)
7. Set up Slack integration for the incident channel
8. Test the integration: trigger a test alert and verify it reaches the on-call engineer
<!-- ENDIF -->

<!-- IF {{ONCALL_TOOL}} == "Opsgenie" -->
**Opsgenie Setup:**

1. Create a team for {{PROJECT_NAME}} in Opsgenie
2. Set up routing rules per severity level
3. Create a schedule matching the rotation table above
4. Configure escalation policies:
   - Wait 5 minutes, then escalate to secondary
   - Wait 10 minutes, then escalate to engineering manager
5. Integrate with your monitoring stack (Datadog, Prometheus, CloudWatch)
6. Install Opsgenie mobile app, enable all notification channels
7. Configure alert deduplication and auto-close rules
8. Set up Slack/Teams integration for the incident channel
9. Test: trigger a test alert through each integration
<!-- ENDIF -->

<!-- IF {{ONCALL_TOOL}} == "phone-tree" -->
**Phone Tree Setup:**

For teams without dedicated on-call tooling, maintain a simple phone tree:

1. Print the on-call schedule and post it where everyone can see it
2. Save all team members' phone numbers in a shared contact group
3. Designate a monitoring email address that forwards to the on-call engineer's phone
4. Set up simple uptime monitoring (UptimeRobot, Pingdom free tier) pointing to the monitoring email
5. Escalation is manual: if primary does not respond in 10 minutes, caller moves to next person on the list
6. Document the phone tree in a place accessible offline (not just in the app that might be down)

**Phone Tree:**
| Order | Name | Phone | Role |
|-------|------|-------|------|
| 1 | [Primary on-call] | [Phone] | First responder |
| 2 | [Secondary on-call] | [Phone] | Backup |
| 3 | [Engineering manager] | [Phone] | Escalation |
| 4 | [CTO/VP Eng] | [Phone] | Final escalation |
<!-- ENDIF -->

---

## On-Call Readiness Checklist

Complete this checklist before your first on-call shift. Review before each subsequent shift.

### Access Verification

- [ ] I can log into the production cloud console
- [ ] I can access the monitoring dashboard
- [ ] I can access the log aggregation tool
- [ ] I can access the deployment pipeline
- [ ] I can access the database admin panel (read-only at minimum)
- [ ] I can access the feature flag management tool
- [ ] I can access the status page admin
- [ ] I have the VPN configured (if required)
- [ ] I have {{ONCALL_TOOL}} installed and receiving notifications

### Knowledge Verification

- [ ] I know how to trigger a deployment rollback
- [ ] I know how to toggle feature flags
- [ ] I know how to restart services
- [ ] I know how to scale up/down infrastructure
- [ ] I know how to access the incident response runbook offline
- [ ] I know the escalation path and have backup contacts saved
- [ ] I have reviewed the common runbooks in this section

### Equipment Verification

- [ ] Phone is charged and will remain charged overnight
- [ ] Laptop is accessible within 15 minutes at all times
- [ ] Internet connection is reliable from my on-call location
- [ ] Notification volume is turned up / Do Not Disturb is configured to allow {{ONCALL_TOOL}} through

---

## On-Call Retrospective

At the end of each rotation cycle (monthly or quarterly), review on-call health:

| Metric | This Period | Last Period | Trend |
|--------|-----------|-------------|-------|
| Total pages | [N] | [N] | [Up/Down/Stable] |
| After-hours pages | [N] | [N] | [Up/Down/Stable] |
| False positive alerts | [N] | [N] | [Up/Down/Stable] |
| Average response time | [N min] | [N min] | [Up/Down/Stable] |
| On-call satisfaction (1-5) | [N] | [N] | [Up/Down/Stable] |
| Incidents per rotation | [N] | [N] | [Up/Down/Stable] |

**If pages are trending up:** Invest in reliability. The system is getting noisier, which means engineers will start ignoring alerts.
**If false positives are >20%:** Re-tune alert thresholds. Alert fatigue kills incident response.
**If satisfaction is below 3:** Something is broken — too many pages, too little support, or inadequate compensation. Fix it before you lose people.

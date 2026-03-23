# Incident Response Runbook

> The step-by-step playbook your team follows when production breaks. No improvisation required.

---

## Project Information

| Field | Value |
|-------|-------|
| **Project** | {{PROJECT_NAME}} |
| **On-Call Tool** | {{ONCALL_TOOL}} |
| **Status Page** | {{STATUS_PAGE_PROVIDER}} |
| **Team Communication** | {{TEAM_COMMUNICATION_TOOL}} |
| **Incident Channel** | `#{{PROJECT_NAME}}-incidents` |
| **Runbook Last Updated** | {{LAST_UPDATED_DATE}} |

---

## Role Definitions

Every incident of SEV2 or higher requires these three roles to be assigned. For SEV3/SEV4, the on-call engineer may fill all roles.

### Incident Commander (IC)

**Who:** The person who coordinates the response. Does NOT fix the problem.

**Responsibilities:**
- Declare the incident and its severity level
- Assign the Technical Lead and Communications Lead roles
- Make decisions on escalation, scope, and resource allocation
- Run the incident bridge/call — keep it focused
- Track timeline of events in real time
- Call for status updates every 15 minutes (SEV1) or 30 minutes (SEV2)
- Decide when the incident is resolved and close it out
- Ensure a postmortem is scheduled within 48 hours

**The IC does not write code during the incident.** Their job is to keep the response organized and information flowing. If the IC starts debugging, coordination breaks down.

### Technical Lead (TL)

**Who:** The engineer closest to the affected system. Usually the on-call engineer or a subject matter expert.

**Responsibilities:**
- Diagnose the root cause
- Implement mitigation (rollback, feature flag, config change, scaling)
- Implement the permanent fix
- Communicate technical status to the IC in plain language
- Request additional engineers if needed
- Document technical findings for the postmortem

### Communications Lead (CL)

**Who:** The person who handles all internal and external messaging. Can be an engineering manager, support lead, or designated team member.

**Responsibilities:**
- Post updates to the status page ({{STATUS_PAGE_PROVIDER}})
- Send internal updates to {{TEAM_COMMUNICATION_TOOL}} channels
- Draft and send customer-facing communications
- Handle incoming customer inquiries with support team
- Escalate to leadership when thresholds are met
- Compile communication timeline for the postmortem

---

## Phase 1: Detect

How incidents are discovered for {{PROJECT_NAME}}.

### Automated Detection

| Source | What It Catches | Alert Destination |
|--------|----------------|-------------------|
| Uptime monitor | Complete outages, health check failures | {{ONCALL_TOOL}} (phone + SMS) |
| Error rate alerts | Error rate exceeds threshold (>1% for SEV2, >5% for SEV1) | {{ONCALL_TOOL}} (push notification) |
| Latency alerts | P95 latency exceeds 2x baseline | {{TEAM_COMMUNICATION_TOOL}} channel |
| Database alerts | Connection pool exhaustion, replication lag, disk >80% | {{ONCALL_TOOL}} (push notification) |
| Security alerts | Failed auth spikes, unusual API patterns, WAF triggers | {{ONCALL_TOOL}} (phone + SMS) |
| Synthetic monitors | Critical user journey failures (login, checkout, signup) | {{ONCALL_TOOL}} (push notification) |
| Log anomaly detection | Unusual log patterns, new error types | {{TEAM_COMMUNICATION_TOOL}} channel |

### Manual Detection

| Source | Action |
|--------|--------|
| Customer support ticket spike | Support lead alerts on-call engineer in {{TEAM_COMMUNICATION_TOOL}} |
| Social media reports | Community manager alerts on-call engineer |
| Internal team report | Engineer posts in `#{{PROJECT_NAME}}-incidents` channel |
| Third-party status page | {{TEAM_COMMUNICATION_TOOL}} integration posts automatically |

### On-Call Engineer Receives Alert

**Within 5 minutes of receiving an alert:**

1. Acknowledge the alert in {{ONCALL_TOOL}}
2. Open the monitoring dashboard for {{PROJECT_NAME}}
3. Check the alert details — what metric triggered, what threshold was crossed
4. Check the incident channel (`#{{PROJECT_NAME}}-incidents`) for related alerts or reports
5. Proceed to Phase 2: Triage

---

## Phase 2: Triage

**Goal:** Determine severity and initial scope within 10 minutes.

### Step 2.1: Quick Assessment (2 minutes)

Answer these questions:

- [ ] Is the service completely down? (Check health endpoint)
- [ ] What percentage of users are affected? (Check error rates, active users)
- [ ] Is data integrity at risk? (Check for write errors, corruption signals)
- [ ] Is this a security incident? (Check for unauthorized access patterns)
- [ ] When did this start? (Check when metrics first degraded)
- [ ] Was there a recent deployment? (Check deployment log within last 2 hours)

### Step 2.2: Assign Severity

Use the severity decision tree from `severity-levels.md`:

```
Is the service completely down for all/most users?
  YES --> SEV1
  NO  --> Is a core feature degraded and >10% users affected?
    YES --> SEV2
    NO  --> Is it customer-facing and >1% users affected?
      YES --> SEV3
      NO  --> SEV4
```

### Step 2.3: Declare the Incident

Post in `#{{PROJECT_NAME}}-incidents`:

```
@here INCIDENT DECLARED

Severity: SEV[X]
Summary: [One sentence describing the issue]
Impact: [Who is affected, what is broken]
Started: [Timestamp or approximate time]
Incident Commander: [Your name or TBD]
Technical Lead: [Your name]
Communications Lead: [TBD]

Incident bridge: [Link to call/room if SEV1/SEV2]
```

<!-- IF {{ONCALL_TOOL}} == "PagerDuty" -->
Create a PagerDuty incident and link it in the channel. Use the PagerDuty Slack integration to manage roles.
<!-- ENDIF -->

<!-- IF {{ONCALL_TOOL}} == "Opsgenie" -->
Create an Opsgenie alert and link it in the channel. Assign responders using the Opsgenie integration.
<!-- ENDIF -->

---

## Phase 3: Communicate

**Goal:** Ensure all stakeholders know an incident is in progress.

### Step 3.1: Internal Notification

**SEV1/SEV2 — Immediate:**

1. Post incident declaration in `#{{PROJECT_NAME}}-incidents` (done in Phase 2)
2. Start an incident bridge (video call or dedicated voice channel)
3. Notify engineering leadership via {{ONCALL_TOOL}} escalation
4. Alert customer support team with initial talking points
5. Pin the incident declaration message in the channel

**SEV3 — Within 1 hour:**

1. Post incident declaration in `#{{PROJECT_NAME}}-incidents`
2. Assign directly to the relevant engineer or team
3. No bridge required unless investigation reveals escalation

**SEV4 — Within 1 business day:**

1. Create a ticket in the project backlog
2. Tag for next triage session

### Step 3.2: External Communication

**SEV1/SEV2 — Within 15 minutes of declaration:**

1. Update {{STATUS_PAGE_PROVIDER}} status to "Investigating"
2. Use the communication template from `communication-templates.md`
3. Post initial customer-facing message:
   - What: "We are experiencing issues with [component]"
   - Impact: "Users may see [symptom]"
   - Action: "Our team is actively investigating"
   - Next update: "We will provide an update within [30 minutes]"

**SEV3 — If customer-visible:**

1. Update {{STATUS_PAGE_PROVIDER}} component to "Degraded Performance" if applicable
2. Prepare a brief customer-facing message if support tickets are incoming

### Step 3.3: Ongoing Updates

| Severity | Internal Update Cadence | External Update Cadence |
|----------|------------------------|------------------------|
| SEV1 | Every 15 minutes | Every 30 minutes |
| SEV2 | Every 30 minutes | Every 60 minutes |
| SEV3 | At key milestones | At resolution only |
| SEV4 | Not required | Not required |

---

## Phase 4: Assemble

**Goal:** Get the right people in the room.

### Step 4.1: Assign Roles (SEV1/SEV2)

If not already assigned during triage:

1. **Incident Commander:** The most senior available engineer, or a designated IC from the rotation. The IC does NOT need to be a domain expert — they coordinate.
2. **Technical Lead:** The engineer with the deepest knowledge of the affected system. Start with the on-call engineer; escalate to the system owner if needed.
3. **Communications Lead:** Engineering manager, support lead, or a designated team member. Whoever writes clearly under pressure.

### Step 4.2: Page Additional Responders (if needed)

Use {{ONCALL_TOOL}} to page:

- Database team (if database-related)
- Infrastructure team (if cloud/hosting-related)
- Security team (if security-related)
- Frontend team (if client-side-related)
- Specific engineer who owns the affected service

**Escalation ladder for non-response:**

| Time Without Response | Action |
|----------------------|--------|
| 5 minutes | Re-page via {{ONCALL_TOOL}} |
| 10 minutes | Phone call directly |
| 15 minutes | Page their backup/manager |
| 20 minutes | Page engineering leadership |

### Step 4.3: Set Up Incident Infrastructure

- [ ] Incident channel in {{TEAM_COMMUNICATION_TOOL}} created (or use existing `#{{PROJECT_NAME}}-incidents`)
- [ ] Incident bridge/call started (SEV1/SEV2)
- [ ] Shared document opened for real-time timeline tracking
- [ ] Relevant dashboards and logs open and shared
- [ ] Status page updated

---

## Phase 5: Mitigate

**Goal:** Stop the bleeding. Restore service. Do NOT fix the root cause yet.

### Step 5.1: Identify Quick Mitigations

Check these options in order of speed (fastest first):

| Mitigation | Time to Execute | When to Use |
|-----------|----------------|-------------|
| **Feature flag kill switch** | Seconds | Feature-specific failure, new feature causing issues |
| **Rollback deployment** | 1-5 minutes | Issue started after a deployment |
| **Scale up resources** | 2-10 minutes | Capacity-related issues (CPU, memory, connections) |
| **Restart service** | 1-5 minutes | Memory leaks, stuck processes |
| **Failover to backup** | 5-15 minutes | Primary resource failure (database, region) |
| **Block bad traffic** | 1-5 minutes | DDoS, abusive API usage, bot traffic |
| **DNS redirect** | 5-30 minutes | Regional outage, total infrastructure failure |
| **Disable non-essential features** | 1-5 minutes | Reduce load to protect core functionality |

### Step 5.2: Execute Mitigation

1. **Announce** what you are about to do in the incident channel before executing
2. **Execute** the mitigation step
3. **Verify** the mitigation worked by checking:
   - Error rates decreasing
   - Latency returning to baseline
   - Health checks passing
   - User-facing functionality restored
4. **Announce** the result in the incident channel

### Step 5.3: Confirm Mitigation

- [ ] Core functionality is restored for users
- [ ] Error rates are back to normal range
- [ ] Monitoring confirms stability for at least 15 minutes
- [ ] Communications Lead updates status page to "Monitoring"
- [ ] IC announces mitigation in the incident channel

**If mitigation fails:** Escalate severity by one level and return to Step 5.1 with the next option. Announce the failed mitigation in the incident channel.

---

## Phase 6: Resolve

**Goal:** Implement the permanent fix and confirm full resolution.

### Step 6.1: Root Cause Investigation

Once service is restored via mitigation:

1. Identify the root cause (not just the trigger)
2. Determine if the mitigation is the permanent fix or if additional work is needed
3. If additional work is needed, create a ticket and assign it
4. Do NOT rush a permanent fix while the mitigation is holding — schedule it properly

### Step 6.2: Implement Permanent Fix

1. Develop the fix in a normal development workflow (branch, code review, tests)
2. Test the fix in staging/preview environment
3. Deploy the fix with extra monitoring
4. Verify the fix resolves the root cause without reintroducing the issue

### Step 6.3: Verify Resolution

- [ ] Root cause is addressed (not just symptoms)
- [ ] Monitoring shows normal metrics for 30+ minutes after fix deployed
- [ ] No related alerts firing
- [ ] Rollback mitigation is no longer needed (or can be safely removed)
- [ ] Edge cases tested

### Step 6.4: Close the Incident

1. IC posts in `#{{PROJECT_NAME}}-incidents`:
   ```
   INCIDENT RESOLVED

   Severity: SEV[X]
   Duration: [X hours, Y minutes]
   Summary: [What happened]
   Root Cause: [Brief description]
   Fix: [What was done]
   Postmortem: Scheduled for [date within 48 hours]
   ```
2. Communications Lead updates {{STATUS_PAGE_PROVIDER}} to "Resolved"
3. Communications Lead sends final customer communication
4. Close the incident in {{ONCALL_TOOL}}

---

## Phase 7: Postmortem

**Goal:** Learn from the incident and prevent recurrence. No blame.

### Step 7.1: Schedule the Postmortem

- Schedule within **48 hours** of resolution (memories fade quickly)
- Invite all incident responders plus relevant stakeholders
- Allocate **60-90 minutes** for SEV1/SEV2, **30 minutes** for SEV3
- SEV4 does not require a postmortem meeting (written summary is sufficient)

### Step 7.2: Prepare

Before the meeting:

1. IC compiles the incident timeline from channel logs
2. TL writes up the root cause analysis
3. CL gathers customer impact data (support tickets, churn, revenue impact)
4. All participants review the timeline independently

### Step 7.3: Conduct the Postmortem

Use the template in `postmortem-template.template.md`. Key rules:

- **Blameless.** Replace "Person X should have..." with "The system allowed..."
- **Focus on process.** "Why did our monitoring not catch this?" not "Why did you deploy that?"
- **Action items are mandatory.** Every postmortem produces at least 2 action items
- **Action items have owners and deadlines.** Unowned action items do not get done.

### Step 7.4: Follow Up

- [ ] Postmortem document shared with the team
- [ ] Action items created as tickets in the project tracker
- [ ] Action items reviewed in the next sprint planning
- [ ] Runbooks updated if the incident revealed a gap
- [ ] Monitoring/alerting updated if detection was slow
- [ ] Incident metrics updated in `incident-metrics.template.md`

---

## Quick Reference: Response Timeline

```
INCIDENT DETECTED
  |
  +-- 0 min:  Alert fires / report received
  +-- 5 min:  On-call acknowledges alert
  +-- 10 min: Triage complete, severity assigned
  +-- 15 min: Incident declared, roles assigned
  +-- 15 min: Status page updated (SEV1/SEV2)
  +-- 15 min: Incident bridge started (SEV1/SEV2)
  +-- 30 min: First external update posted
  |
  MITIGATION IN PROGRESS
  |
  +-- Every 15 min: IC requests status update (SEV1)
  +-- Every 30 min: IC requests status update (SEV2)
  +-- Every 30 min: External update posted (SEV1)
  +-- Every 60 min: External update posted (SEV2)
  |
  SERVICE RESTORED
  |
  +-- 0 min:  IC confirms mitigation
  +-- 5 min:  Status page updated to "Monitoring"
  +-- 15 min: Stability confirmed
  +-- 30 min: Status page updated to "Resolved"
  +-- 30 min: Final customer communication sent
  |
  POST-INCIDENT
  |
  +-- 48 hrs: Postmortem conducted
  +-- 1 week: Action items in sprint
  +-- 2 weeks: Action items completed
  +-- 1 month: Verify recurrence prevention
```

---

## Appendix: Emergency Contacts

| Role | Name | Phone | Email | {{TEAM_COMMUNICATION_TOOL}} Handle |
|------|------|-------|-------|------|
| Primary on-call | _____________ | _____________ | _____________ | _____________ |
| Secondary on-call | _____________ | _____________ | _____________ | _____________ |
| Engineering manager | _____________ | _____________ | _____________ | _____________ |
| Infrastructure lead | _____________ | _____________ | _____________ | _____________ |
| Database admin | _____________ | _____________ | _____________ | _____________ |
| Security lead | _____________ | _____________ | _____________ | _____________ |
| VP Engineering / CTO | _____________ | _____________ | _____________ | _____________ |
| Customer support lead | _____________ | _____________ | _____________ | _____________ |

---

## Appendix: Key URLs

| Resource | URL |
|----------|-----|
| Monitoring dashboard | _____________ |
| Status page (admin) | _____________ |
| Status page (public) | _____________ |
| Log aggregation | _____________ |
| Deployment pipeline | _____________ |
| Feature flags | _____________ |
| Database admin panel | _____________ |
| Cloud provider console | _____________ |
| {{ONCALL_TOOL}} dashboard | _____________ |
| Incident history | _____________ |

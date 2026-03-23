# On-Call Rotation

> On-call structure for **{{PROJECT_NAME}}** production operations. On-call engineers are the first line of defense when production issues occur outside business hours. This document defines the rotation, escalation, and support structure.

---

## Rotation Schedule

### Team Roster

| Name | Role | Phone | Slack Handle | Time Zone |
|------|------|-------|-------------|-----------|
| {{ONCALL_PERSON_1}} | {{ONCALL_ROLE_1}} | {{ONCALL_PHONE_1}} | @{{ONCALL_SLACK_1}} | {{ONCALL_TZ_1}} |
| {{ONCALL_PERSON_2}} | {{ONCALL_ROLE_2}} | {{ONCALL_PHONE_2}} | @{{ONCALL_SLACK_2}} | {{ONCALL_TZ_2}} |
| {{ONCALL_PERSON_3}} | {{ONCALL_ROLE_3}} | {{ONCALL_PHONE_3}} | @{{ONCALL_SLACK_3}} | {{ONCALL_TZ_3}} |
| {{ONCALL_PERSON_4}} | {{ONCALL_ROLE_4}} | {{ONCALL_PHONE_4}} | @{{ONCALL_SLACK_4}} | {{ONCALL_TZ_4}} |

### Rotation Pattern

| Week | Primary | Secondary |
|------|---------|-----------|
| Week 1 | {{ONCALL_PERSON_1}} | {{ONCALL_PERSON_2}} |
| Week 2 | {{ONCALL_PERSON_2}} | {{ONCALL_PERSON_3}} |
| Week 3 | {{ONCALL_PERSON_3}} | {{ONCALL_PERSON_4}} |
| Week 4 | {{ONCALL_PERSON_4}} | {{ONCALL_PERSON_1}} |

**Rotation cadence:** Weekly, starting Monday {{ONCALL_START_TIME}} and ending the following Monday at the same time.

**Schedule management tool:** {{ONCALL_SCHEDULE_TOOL}} (e.g., PagerDuty, Opsgenie, linear)

---

## Escalation Timeline

| Time Since Alert | Action | Who |
|------------------|--------|-----|
| 0 min | Alert fires — notification sent via {{ALERT_CHANNEL}} | Automated |
| 5 min | Primary on-call acknowledges | {{ONCALL_PRIMARY}} |
| 15 min | If no acknowledgment → escalate to secondary | {{ONCALL_SECONDARY}} |
| 30 min | If no acknowledgment → escalate to engineering lead | {{ENGINEERING_LEAD}} |
| 60 min | If unresolved and Severity 1 → escalate to {{EXECUTIVE_CONTACT}} | {{EXECUTIVE_CONTACT}} |

### Severity Definitions

| Severity | Description | Response SLA | Resolution SLA |
|----------|-------------|-------------|----------------|
| **SEV-1** | Complete outage, data loss, security breach | 5 min ack, 15 min response | 4 hours |
| **SEV-2** | Major feature broken, significant performance degradation | 15 min ack, 30 min response | 8 hours |
| **SEV-3** | Minor feature issue, cosmetic bug in production | 1 hour ack | Next business day |
| **SEV-4** | Non-urgent improvement, monitoring noise | Next business day | Sprint backlog |

---

## On-Call Responsibilities

### During On-Call Shift

1. **Keep phone charged and accessible** — alerts come via {{ALERT_CHANNEL}}
2. **Acknowledge alerts within the SLA** — even if you cannot fix immediately
3. **Triage and assess severity** — use the severity definitions above
4. **Communicate status** — post updates in {{INCIDENT_CHANNEL}} every 30 minutes for SEV-1/2
5. **Escalate if needed** — do not be a hero; escalate early rather than late
6. **Document actions** — log every action taken during an incident

### NOT On-Call Responsibilities

- Feature development or sprint work
- Responding to non-urgent support requests
- Fixing bugs that are not production-impacting
- Attending non-essential meetings during off-hours

---

## Compensation and Time Off

| Item | Policy |
|------|--------|
| On-call stipend | {{ONCALL_STIPEND}} per week of on-call duty |
| Incident response (off-hours) | {{INCIDENT_COMP}} per hour for active incident work |
| Recovery time | {{RECOVERY_HOURS}} hours off following any off-hours incident > 1 hour |
| Swap policy | Swaps allowed with 48-hour notice — update {{ONCALL_SCHEDULE_TOOL}} |
| Holiday coverage | Volunteer first, then round-robin; {{HOLIDAY_COMP}} compensation |
| Maximum consecutive weeks | {{MAX_CONSECUTIVE_WEEKS}} weeks — then mandatory break |

---

## Handoff Procedure

Every rotation handoff (Monday at {{ONCALL_START_TIME}}) must include:

### Outgoing On-Call

1. Post a handoff summary in {{INCIDENT_CHANNEL}}:
   - Number of alerts received during the week
   - Any ongoing issues or investigations
   - Any temporary workarounds in place
   - Any alerts that should be tuned (too noisy, too quiet)
2. Ensure all incidents are documented in {{INCIDENT_TRACKER}}
3. Transfer any open incidents to the incoming on-call

### Incoming On-Call

1. Read the handoff summary
2. Verify you have access to all on-call tools (see toolkit below)
3. Confirm you can receive alerts on your phone
4. Acknowledge the handoff in {{INCIDENT_CHANNEL}}

### Handoff Template

```markdown
## On-Call Handoff: Week of {{HANDOFF_DATE}}

**Outgoing:** {{OUTGOING_NAME}}
**Incoming:** {{INCOMING_NAME}}

### Summary
- Total alerts: X
- SEV-1 incidents: X
- SEV-2 incidents: X
- Ongoing issues: (list or "None")

### Active Workarounds
- (list or "None")

### Alert Tuning Recommendations
- (list or "None")

### Notes for Incoming
- (anything the next person should know)
```

---

## On-Call Toolkit

The on-call engineer must have access to and familiarity with these tools before their first shift:

| Tool | Purpose | Access URL | Credential Location |
|------|---------|-----------|---------------------|
| {{HOSTING_PROVIDER}} Dashboard | Deployment, logs, scaling | {{HOSTING_DASHBOARD_URL}} | {{CREDENTIAL_STORE}} |
| Database Console | Query, connection monitoring | {{DB_DASHBOARD_URL}} | {{CREDENTIAL_STORE}} |
| {{MONITORING_TOOL}} | Error tracking, alerts | {{MONITORING_URL}} | {{CREDENTIAL_STORE}} |
| {{UPTIME_MONITOR}} | Uptime status, incident history | {{UPTIME_URL}} | {{CREDENTIAL_STORE}} |
| VPN | Secure access to internal resources | {{VPN_INSTRUCTIONS}} | {{CREDENTIAL_STORE}} |
| Deployment pipeline | Emergency rollback | {{CI_CD_URL}} | {{CREDENTIAL_STORE}} |
| Runbooks | Step-by-step procedures | `{{RUNBOOK_PATH}}` | In repo |
| DR Playbooks | Disaster scenarios | `09-deployment-operations/dr-playbooks.template.md` | In repo |

### Pre-Shift Checklist

Before your first on-call shift, verify:

- [ ] I can log into {{HOSTING_PROVIDER}} dashboard
- [ ] I can access the database console
- [ ] I can view errors in {{MONITORING_TOOL}}
- [ ] I can trigger a deployment rollback
- [ ] I receive test alerts on my phone
- [ ] I have read the DR playbooks
- [ ] I know the escalation contacts
- [ ] I have VPN access configured and tested

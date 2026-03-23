# Communication Templates

> Pre-written messages for every stage of an incident. Copy, fill in the blanks, send. Do not craft prose under pressure.

---

## Why Pre-Written Templates Matter

During an incident, your brain is in fight-or-flight mode. Writing clear, empathetic, accurate communication from scratch while your pager is screaming and Slack is flooding with questions is a recipe for disaster. You will either say too much (causing panic), say too little (causing distrust), or say nothing (causing both).

These templates are designed to be copied and filled in within 60 seconds. Every blank is marked with `[square brackets]`. Replace the brackets and send. Do not overthink. Do not wordsmith. Speed and accuracy beat eloquence during an outage.

---

## Internal Alert Templates (Slack / Discord / Teams)

### Initial Detection Alert

```
:rotating_light: INCIDENT DETECTED

Severity: SEV[1/2/3/4]
Component: [API / Web App / Database / Auth / Payments / etc.]
Summary: [One sentence — what is broken]
Impact: [Who is affected and how]
Detected by: [Monitoring alert / Customer report / Manual discovery]
Started approximately: [Time or "unknown, investigating"]
On-call responder: @[name]

I am investigating now. Updates to follow in this channel.
```

### Triage Complete

```
:mag: TRIAGE COMPLETE — INCIDENT CONFIRMED

Severity: SEV[X] [upgraded/downgraded from initial SEV[Y] if applicable]
Component: [Affected component]
Summary: [More detailed summary after investigation]
Impact: [X% of users affected / specific user segments]
Root cause hypothesis: [Best guess at this point]
Mitigation plan: [What we are going to try first]

Roles assigned:
  - Incident Commander: @[name]
  - Technical Lead: @[name]
  - Communications Lead: @[name]

Incident bridge: [Link to call/room]
Next update: [Time — 15 min for SEV1, 30 min for SEV2]
```

### Mitigation In Progress

```
:wrench: MITIGATION UPDATE — [Time]

Status: Mitigation in progress
Action: [What is being done — e.g., "Rolling back deployment v2.4.1 to v2.4.0"]
Progress: [Result so far — e.g., "Rollback initiated, waiting for deployment to complete"]
Impact update: [Any change in scope — e.g., "Error rate dropped from 15% to 8%"]

Next update: [Time]
```

### Mitigation Successful

```
:white_check_mark: SERVICE RESTORED — [Time]

Status: Mitigated — monitoring for stability
Mitigation: [What was done — e.g., "Rolled back to v2.4.0"]
Current state: [e.g., "Error rates back to baseline, latency normal"]
Remaining risk: [e.g., "Root cause not yet identified, monitoring closely"]

We are now in monitoring mode. Permanent fix to follow.
Status page will be updated to "Monitoring."
Next update: [Time — or "at resolution"]
```

### Incident Resolved

```
:checkered_flag: INCIDENT RESOLVED

Severity: SEV[X]
Duration: [X hours Y minutes] ([start time] — [end time])
Summary: [What happened in 2-3 sentences]
Root cause: [Brief root cause description]
Fix applied: [What was done to permanently resolve]
Customer impact: [X users affected, Y support tickets, Z revenue impact if known]

Postmortem: Scheduled for [date and time]
Postmortem document: [Link — to be created]

Action items (preliminary):
- [ ] [Action 1]
- [ ] [Action 2]
- [ ] [Action 3]

Thank you to everyone who responded: @[name], @[name], @[name]
```

### Escalation to Leadership

```
:arrow_up: ESCALATION — SEV[X] Incident Requires Leadership Awareness

@[engineering-manager] @[vp-engineering] @[cto]

Incident: [Brief summary]
Severity: SEV[X]
Duration so far: [X minutes/hours]
Customer impact: [Who and how many are affected]
Current status: [What the team is doing right now]
Why escalating: [e.g., "Mitigation efforts have failed", "Customer-facing for >1 hour", "Data loss confirmed"]
Decision needed: [If any — e.g., "Approve emergency maintenance window", "Authorize rollback of database migration"]

Incident channel: #[channel-name]
Incident bridge: [Link]
```

---

## Customer-Facing Templates (Status Page)

### Investigating

**Title:** Investigating issues with [Component Name]

```
We are currently investigating reports of [brief symptom description —
e.g., "elevated error rates" / "degraded performance" / "intermittent
connectivity issues"] affecting [Component Name].

Our engineering team is actively looking into this issue. We will provide
an update within [30 minutes / 1 hour].

If you are experiencing issues, we appreciate your patience.
```

### Identified

**Title:** [Component Name] — Issue Identified

```
We have identified the cause of the issues affecting [Component Name].
[Brief, non-technical description of the problem — e.g., "A configuration
change caused increased response times for API requests."]

Our team is implementing a fix. We expect the issue to be resolved within
[estimated time].

Affected services:
- [Service/feature 1]
- [Service/feature 2]

We will post another update within [30 minutes / 1 hour] or when the
issue is resolved.
```

### Monitoring

**Title:** [Component Name] — Fix Deployed, Monitoring

```
A fix has been deployed for the issue affecting [Component Name]. We are
monitoring the results to ensure full recovery.

Current status:
- [Service 1]: Operational
- [Service 2]: Recovering

If you continue to experience issues, please contact our support team at
[support email/URL].

We will provide a final update once we have confirmed full recovery.
```

### Resolved

**Title:** [Component Name] — Resolved

```
The issue affecting [Component Name] has been fully resolved.

Summary: Between [start time] and [end time] (UTC), [brief description
of what users experienced — e.g., "some users experienced intermittent
errors when accessing the dashboard"].

Root cause: [One sentence, non-technical — e.g., "A database scaling
operation did not complete as expected, causing temporary connectivity
issues."]

We apologize for any inconvenience. Our team will be conducting a
thorough review to prevent similar issues in the future.

If you continue to experience any problems, please contact us at
[support email/URL].
```

---

## Scheduled Maintenance Templates

### Upcoming Maintenance

**Title:** Scheduled Maintenance — [Component Name] — [Date]

```
We will be performing scheduled maintenance on [Component Name] on
[Day, Date] from [Start Time] to [End Time] (UTC).

During this window, [describe expected impact — e.g., "the API may be
temporarily unavailable" / "users may experience brief interruptions" /
"read-only mode will be enabled"].

What you need to do: [e.g., "No action required" / "Save your work
before the maintenance window" / "Expect to re-authenticate after
maintenance"]

We will notify you when maintenance begins and when it is complete.
If you have questions, contact [support email/URL].
```

### Maintenance In Progress

```
Scheduled maintenance on [Component Name] is now in progress. We expect
to complete by [End Time] (UTC).

Current status:
- [Step in progress]
- Estimated remaining time: [X minutes/hours]
```

### Maintenance Complete

```
Scheduled maintenance on [Component Name] has been completed successfully.
All services are fully operational.

If you experience any issues, please contact [support email/URL].
```

---

## Stakeholder Email Templates

### Executive Briefing (During Incident)

**Subject:** [ONGOING] SEV[X] Incident — [Brief Description]

```
Hi [Name/Team],

I am writing to inform you of an ongoing SEV[X] incident affecting
[Component].

Key facts:
- Started: [Time] (UTC)
- Duration so far: [X hours Y minutes]
- Customer impact: [Estimated X users / Y% of traffic affected]
- Revenue impact: [Estimated $X / hour or "under assessment"]
- Current status: [Investigating / Mitigation in progress / Monitoring]

Our incident response team is actively working on this:
- Incident Commander: [Name]
- Technical Lead: [Name]
- Next steps: [Brief description of mitigation plan]

I will send another update in [30 minutes / 1 hour] or when status changes
significantly.

For real-time updates, join the incident channel: [Link]

[Your name]
```

### Executive Briefing (Post-Resolution)

**Subject:** [RESOLVED] SEV[X] Incident — [Brief Description]

```
Hi [Name/Team],

The SEV[X] incident affecting [Component] has been resolved.

Summary:
- Duration: [X hours Y minutes] ([start time] — [end time])
- Root cause: [1-2 sentences, non-technical]
- Customer impact: [X users affected, Y support tickets received]
- Revenue impact: [Estimated $X or "minimal"]
- Resolution: [What was done to fix it]

Postmortem:
- Scheduled for: [Date and time]
- Key areas of investigation: [What we want to learn]
- Document: [Link — will be shared when complete]

Immediate action items:
1. [Action item 1]
2. [Action item 2]
3. [Action item 3]

I will share the full postmortem report when it is complete.

[Your name]
```

---

## Post-Resolution Customer Email

**Subject:** Update: What happened with [Component/Service] on [Date]

```
Hi [Customer Name / team],

On [Date], between [Start Time] and [End Time] (UTC), you may have
experienced [brief description of user-visible symptom — e.g., "errors
when submitting forms" / "slow page load times" / "inability to access
your dashboard"].

What happened:
[2-3 sentences explaining the issue in non-technical terms. Focus on
impact, not internal details.]

What we did:
[1-2 sentences explaining how it was fixed.]

What we are doing to prevent this:
[2-3 bullet points of concrete preventive actions. Be specific enough
to build confidence without revealing internal architecture.]

- [Action 1 — e.g., "Added redundant monitoring for this component"]
- [Action 2 — e.g., "Implemented automatic failover for the affected service"]
- [Action 3 — e.g., "Updated our deployment process to catch this class of issue"]

We sincerely apologize for any disruption this caused. Reliability is
our top priority, and we are committed to earning your trust.

If you have any questions or are still experiencing issues, please
contact us at [support email/URL].

[Signature]
```

---

## Social Media Response Templates

### When the Outage Trends on Twitter / X

**Initial Acknowledgment:**
```
We're aware of the issues affecting [service/feature] and our team is
actively investigating. We'll share updates on our status page:
[status page URL]
```

**Progress Update:**
```
Update: We've identified the cause of today's [service] issues and are
implementing a fix. Follow our status page for real-time updates:
[status page URL]
```

**Resolution:**
```
[Service] is back to normal. We apologize for the disruption and are
taking steps to prevent this from happening again. Details:
[blog post / status page URL]
```

**Responding to Individual User Complaints:**
```
We're sorry for the trouble. The issue has been [identified / resolved].
If you're still experiencing problems, please reach out to our support
team at [support URL] and we'll help you directly.
```

---

## Template Usage Checklist

During an incident, use this checklist to track communication:

- [ ] Internal initial alert posted
- [ ] Status page updated to "Investigating"
- [ ] Triage complete message posted internally
- [ ] Status page updated to "Identified" (if applicable)
- [ ] First scheduled update posted (internal and external)
- [ ] Leadership escalation sent (SEV1/SEV2)
- [ ] Status page updated to "Monitoring" (when mitigated)
- [ ] Resolution message posted internally
- [ ] Status page updated to "Resolved"
- [ ] Post-resolution customer email sent (SEV1/SEV2)
- [ ] Social media responses posted (if trending)
- [ ] Executive post-resolution briefing sent
- [ ] Postmortem meeting invitation sent

---

## Tone Guidelines

**Do:**
- Use plain language — no jargon, no acronyms in customer-facing messages
- Be specific about what is affected ("dashboard loading times" not "some services")
- Commit to a next-update time and honor it
- Acknowledge the impact on users
- Take responsibility without over-apologizing

**Do not:**
- Blame third parties in customer-facing messages (even if it is their fault)
- Promise exact resolution times unless you are certain
- Use passive voice to dodge responsibility ("errors were experienced" vs "you experienced errors")
- Share internal details, stack traces, or code references externally
- Use humor during active incidents
- Say "we take security seriously" (everyone says this, nobody believes it)

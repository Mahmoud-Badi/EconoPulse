# Stakeholder Update Cadence

> Stakeholders who feel informed are stakeholders who trust the team. Stakeholders who are surprised by bad news become micromanagers. The difference is a communication cadence — proactive, consistent, and calibrated to each stakeholder's needs. This template maps your stakeholders, defines their cadence, and provides copy-paste update templates.

---

## Project: {{PROJECT_NAME}}

---

## 1. Stakeholder Map

Identify every person or group who needs to know what is happening. If they can block your project, fund your project, or are affected by your project — they are a stakeholder.

| Stakeholder | Role | Needs | Cadence | Format | Channel | Owner |
|-------------|------|-------|---------|--------|---------|-------|
| {{STAKEHOLDER_1}} | Investor / Funder | Progress, metrics, risks, runway | Monthly | Email + dashboard | Email | {{PROJECT_LEAD}} |
| {{STAKEHOLDER_2}} | Product Owner | Features, blockers, scope changes | Weekly | Standup summary | Slack / Email | {{PROJECT_LEAD}} |
| {{STAKEHOLDER_3}} | Client / Customer | Milestones, demos, timelines | Bi-weekly | Demo + report | Video call + email | {{PROJECT_LEAD}} |
| {{STAKEHOLDER_4}} | Board / Advisor | Strategy, key metrics, asks | Quarterly | Deck + meeting | Video call | {{PROJECT_LEAD}} |
| {{STAKEHOLDER_5}} | Engineering Manager | Velocity, technical debt, team health | Weekly | Sprint metrics | Slack / dashboard | {{TECH_LEAD}} |
| {{STAKEHOLDER_6}} | Design Lead | UX feedback, design system changes | Weekly | Design review notes | Figma comments + Slack | {{DESIGN_LEAD}} |
| {{STAKEHOLDER_7}} | QA / Testing | Quality metrics, test coverage, known issues | Per sprint | Sprint report | Shared doc | {{QA_LEAD}} |
| | [Add more as needed] | | | | | |

### Stakeholder Priority Matrix

| | High Influence | Low Influence |
|---|---------------|---------------|
| **High Interest** | Manage closely (weekly+) | Keep informed (bi-weekly) |
| **Low Interest** | Keep satisfied (monthly) | Monitor (quarterly) |

Place each stakeholder in the matrix. Adjust cadence accordingly:
- **Manage closely:** Weekly updates, invite to demos, flag risks early
- **Keep informed:** Bi-weekly summaries, demo recordings
- **Keep satisfied:** Monthly reports, quarterly meetings
- **Monitor:** Quarterly email, available on request

---

## 2. Weekly Update Template

**Sent to:** Product Owner, Engineering Manager, active team members
**Cadence:** Every Friday by 5pm (or Monday AM for the previous week)
**Format:** 5 bullets, takes 5 minutes to write, 1 minute to read
**Channel:** Email or Slack post

```
Subject: {{PROJECT_NAME}} — Weekly Update (Week of [DATE])

**Progress:**
- [Biggest accomplishment this week — feature shipped, milestone hit, problem solved]
- [Second accomplishment — with specific metrics if possible]

**Wins:**
- [Something worth celebrating — even small wins count]

**Blockers / Risks:**
- [Current blocker and what is needed to unblock it]
- [Emerging risk and mitigation plan]

**Key Metrics:**
- Sprint velocity: [X]% | Tasks completed: [Y] | Open bugs: [Z]

**Next Week:**
- [Top 1-2 priorities for next week]
- [Key deadline or milestone approaching]
```

### Weekly Update Rules

1. **Send it even when there is nothing exciting.** "Steady progress on TASK-043, no blockers" is a valid update. Silence causes anxiety.
2. **Bad news first.** If there is a risk or delay, lead with it. Stakeholders respect honesty.
3. **Include a number.** At least one metric in every update. Progress without measurement is an opinion.
4. **Keep it under 150 words.** This is a summary, not a report. Stakeholders will skim — make it skimmable.
5. **Send on the same day every week.** Consistency builds trust. If you miss a week, stakeholders notice.

---

## 3. Monthly Investor / Executive Update

**Sent to:** Investors, Board members, Executive team
**Cadence:** First week of each month (covering previous month)
**Format:** Email with structured sections
**Channel:** Email (formal, archivable)

```
Subject: {{PROJECT_NAME}} — Monthly Update ([MONTH] [YEAR])

## Executive Summary
[2-3 sentences: What happened this month? Is the project on track? Any major decisions?]

## Key Metrics

| Metric | Last Month | This Month | Target | Status |
|--------|-----------|------------|--------|--------|
| Sprint velocity (avg) | | | | On Track / Behind / Ahead |
| Features shipped | | | | |
| Active users (if applicable) | | | | |
| Revenue (if applicable) | | | | |
| Burn rate / runway | | | | |
| Team size | | | | |
| Customer NPS (if applicable) | | | | |

## Accomplishments
1. [Major accomplishment with business impact]
2. [Major accomplishment with business impact]
3. [Major accomplishment with business impact]

## Challenges & Risks
1. [Challenge] — **Mitigation:** [what you are doing about it]
2. [Risk] — **Likelihood:** [H/M/L] — **Mitigation:** [plan]

## Key Decisions Made
- [Decision] — [Rationale in one sentence] (see PDR-[number] for details)

## Next Month Plan
1. [Priority 1 — expected outcome]
2. [Priority 2 — expected outcome]
3. [Priority 3 — expected outcome]

## Asks
- [Anything you need from the reader: introductions, funding, decisions, resources]
- [Be specific: "Need a decision on pricing tier structure by March 5"]

---
Sent by {{PROJECT_LEAD}} | {{DATE}}
Full project dashboard: [link if applicable]
```

### Monthly Update Rules

1. **Write for a 2-minute read.** Executives scan. Use bullets, bold key words, keep paragraphs short.
2. **Always include Asks.** If you need nothing, say "No asks this month." But almost always, you need something.
3. **Compare to targets.** Raw numbers mean nothing without context. "50 users" is meaningless. "50 users, target was 40, 25% ahead" tells a story.
4. **Do not hide bad news.** Investors and executives find out eventually. Better to hear it from you with a mitigation plan than to discover it themselves.
5. **Archive every update.** Create a folder or channel for monthly updates. They become a project history.

---

## 4. Quarterly Business Review

**Sent to:** Board, Advisors, Executive sponsors
**Cadence:** End of each quarter
**Format:** Slide deck (10-15 slides) + 30-minute meeting
**Channel:** Video call with deck shared in advance

### Slide Deck Structure

| Slide | Content | Time |
|-------|---------|------|
| 1 | Title + quarter summary (1 sentence) | 1 min |
| 2 | Quarter goals vs results (table: goal / status / notes) | 3 min |
| 3-4 | Key metrics dashboard (trends over 3+ months) | 4 min |
| 5-6 | Major accomplishments with demos or screenshots | 4 min |
| 7 | Challenges and how they were addressed | 3 min |
| 8 | Key decisions made (reference product decision log) | 2 min |
| 9 | Team health and capacity (reference health check) | 2 min |
| 10 | Next quarter goals and priorities | 3 min |
| 11 | Risks and dependencies for next quarter | 2 min |
| 12 | Asks and open questions | 3 min |
| 13 | Appendix: detailed metrics (for reference, not presented) | — |

### QBR Preparation Checklist

- [ ] Metrics compiled from monthly updates
- [ ] Product decision log reviewed for major decisions
- [ ] Team health check completed for the quarter
- [ ] Next quarter goals drafted and reviewed with team
- [ ] Deck shared with attendees 48 hours before meeting
- [ ] Meeting scheduled with all required attendees confirmed

---

## 5. Communication Channel Matrix

Different messages need different channels. Using the wrong channel causes either noise (too urgent) or missed information (too casual).

| Situation | Channel | Response Expectation | Example |
|-----------|---------|---------------------|---------|
| **Urgent blocker** | Phone call / Slack DM with @mention | Within 30 minutes | "Production is down, need your approval to rollback" |
| **Important but not urgent** | Email | Within 24 hours | "Sprint velocity dropped 30%, here is our plan" |
| **Status update** | Slack channel post | Read within 24 hours, no reply needed | Weekly update, standup summary |
| **Decision needed** | Email with clear deadline | By stated deadline | "Need pricing decision by Friday COB" |
| **Informal question** | Slack DM or channel thread | Within 4 hours during business hours | "Quick question about the API spec" |
| **Formal report** | Email with attachment | Acknowledgment within 48 hours | Monthly investor update |
| **Demo or showcase** | Video call + recording | Attend live or watch within 1 week | Sprint demo |
| **Complex discussion** | Scheduled meeting with agenda | During meeting | Technical design review, scope negotiation |
| **Sensitive topic** | Private video call or in-person | Schedule within 24 hours of request | Team conflict, performance concern, budget cut |

### Channel Rules

1. **Never deliver bad news over Slack.** Use email or a call. Tone matters for bad news.
2. **Never send urgent requests via email.** Use Slack DM or phone. Email is not an urgent channel.
3. **Default to the lowest-urgency appropriate channel.** If it can be a Slack post, do not schedule a meeting.
4. **Put decisions in writing.** Even if decided on a call, follow up with an email or Slack summary: "To confirm, we decided X because Y."

---

## 6. Escalation Protocol

When something goes wrong, stakeholders need to know — but not all stakeholders, and not all at once. Escalation should be structured.

### Escalation Levels

| Level | Trigger | Who to Notify | Timeline | Format |
|-------|---------|--------------|----------|--------|
| **L1 — Team** | Blocker affecting 1-2 tasks | Team lead + affected team members | Within 4 hours | Slack message |
| **L2 — Project** | Blocker affecting sprint goal | Project lead + product owner | Within 8 hours | Email with impact assessment |
| **L3 — Stakeholder** | Milestone at risk, budget impact, timeline slip | Executive sponsor + affected stakeholders | Within 24 hours | Email + meeting request |
| **L4 — Crisis** | Production outage, data breach, legal issue, team departure | All relevant stakeholders + legal if needed | Immediately | Phone call + incident report |

### Escalation Message Template

```
**Escalation Level:** L[1/2/3/4]
**Subject:** [Short description of the issue]

**What happened:** [Factual description — no blame, no speculation]
**Impact:** [What is affected — timeline, budget, users, scope]
**Current status:** [What has been done so far]
**What we need:** [Specific ask — decision, resource, approval, information]
**Proposed plan:** [What the team recommends]
**Deadline for response:** [When you need the answer by]
```

### Escalation Rules

1. **Escalate early, not late.** A risk flagged early is a planning conversation. A risk flagged late is a crisis.
2. **Never surprise stakeholders.** If there is a chance of a miss, communicate the risk when it emerges — not when it materializes.
3. **Always include a recommendation.** Do not just escalate the problem — escalate a proposed solution.
4. **Follow up in writing.** Even if you escalated via call, send a written summary afterward.
5. **Track escalations.** Log them in the product decision log. Patterns in escalations reveal systemic issues.

---

## 7. Stakeholder Communication Calendar

### Monthly View

| Week | Monday | Tuesday | Wednesday | Thursday | Friday |
|------|--------|---------|-----------|----------|--------|
| 1 | Monthly investor update sent | | | | Weekly update |
| 2 | | Sprint demo (bi-weekly) | | | Weekly update |
| 3 | | | | | Weekly update |
| 4 | | Sprint demo (bi-weekly) | | | Weekly update + month prep |

### Quarterly View

| Month | Key Communications |
|-------|--------------------|
| Month 1 | Monthly update, 2 sprint demos, 4 weekly updates |
| Month 2 | Monthly update, 2 sprint demos, 4 weekly updates |
| Month 3 | Monthly update, 2 sprint demos, 4 weekly updates, QBR prep |
| Quarter End | Quarterly Business Review meeting |

---

## 8. Update Tracking

Track that updates are actually being sent and read.

| Update Type | Last Sent | Next Due | Sent By | Acknowledged By |
|------------|----------|---------|---------|-----------------|
| Weekly update | | | | |
| Monthly investor update | | | | |
| Sprint demo | | | | |
| Quarterly business review | | | | |

If a stakeholder stops acknowledging updates for 2+ cycles, reach out directly to confirm the cadence still works for them.

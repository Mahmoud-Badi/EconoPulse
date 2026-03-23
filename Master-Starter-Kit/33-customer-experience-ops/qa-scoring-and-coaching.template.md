# QA Scoring, Coaching & Performance Management

> {{PROJECT_NAME}} — Measure, coach, and improve support quality systematically. What you don't measure, you can't improve.

---

## Overview

QA scoring is not about catching mistakes — it's about creating a feedback loop that continuously raises the quality bar. Without it, support quality is inconsistent, agents don't know what "good" looks like, and customers get wildly different experiences depending on who handles their ticket.

**Cross-references:**
- For agent onboarding and initial quality expectations, see `agent-onboarding-playbook.template.md`
- For role definitions and team structure, see `support-team-hiring.template.md`
- For support metrics context, see `23-customer-support/support-metrics.template.md`

---

## QA Scoring Rubric

### Six Dimensions of Quality

| Dimension | Weight | What It Measures |
|-----------|--------|-----------------|
| Accuracy | 25% | Was the answer factually correct? Did it solve the problem? |
| Completeness | 20% | Did the response address ALL parts of the question? Were next steps provided? |
| Tone & Empathy | 20% | Was the response warm, professional, and empathetic? |
| Efficiency | 15% | Was the issue resolved in minimum exchanges? Was the response concise? |
| Process Adherence | 10% | Were internal protocols followed? Tags applied? Notes added? |
| Personalization | 10% | Was the response tailored to this customer, or a generic paste? |

### Detailed Scoring Criteria

#### Accuracy (25%)

| Score | Criteria | Example |
|-------|----------|---------|
| **1 — Poor** | Factually wrong. Would make the problem worse. Hallucinated features or steps. | Tells user to click a button that doesn't exist. Gives wrong pricing. |
| **2 — Below Standard** | Partially correct but contains errors. Missing critical details that could mislead. | Correct feature but wrong navigation path. Right process, wrong prerequisite. |
| **3 — Meets Standard** | Factually correct. Solves the stated problem. No errors. | Provides correct steps to accomplish the task. Accurate billing explanation. |
| **4 — Exceeds** | Correct and anticipates follow-up. Includes relevant caveats or edge cases. | "This will work for your case. Note: if you're using SSO, there's an extra step..." |
| **5 — Exceptional** | Perfect accuracy with deep product insight. Identifies root cause, not just symptom. | "The error you're seeing is because X. Here's the fix, and here's how to prevent it." |

#### Completeness (20%)

| Score | Criteria | Example |
|-------|----------|---------|
| **1 — Poor** | Doesn't address the question. Off-topic or irrelevant response. | User asks about billing, agent responds about a feature. |
| **2 — Below Standard** | Partially addresses the question. Missing key parts. No next steps. | Answers the first question but ignores the second question in the same ticket. |
| **3 — Meets Standard** | Addresses all parts of the question. Provides clear next steps. | Answers both questions, says "Let me know if you need anything else." |
| **4 — Exceeds** | Complete answer plus proactive information the user would likely need next. | Answers the question, links relevant KB article, mentions related feature. |
| **5 — Exceptional** | Comprehensive response that prevents 2-3 predictable follow-up questions. | Full answer + edge cases + preventive steps + links + offers to schedule a call for complex setup. |

#### Tone & Empathy (20%)

| Score | Criteria | Example |
|-------|----------|---------|
| **1 — Poor** | Dismissive, rude, or robotic. Makes customer feel worse. | "As I already said..." or "That's not a bug, it's by design." |
| **2 — Below Standard** | Polite but cold. Doesn't acknowledge emotions or frustration. | "Here are the steps to fix your issue: 1. 2. 3." (no greeting, no acknowledgment) |
| **3 — Meets Standard** | Warm, professional. Acknowledges the situation. Uses customer's name. | "Hi Sarah, I understand that's frustrating. Let me help you sort this out." |
| **4 — Exceeds** | Genuinely empathetic. Adapts tone to the customer's emotional state. De-escalates. | "I completely understand why that would be concerning, especially with your deadline. Let me prioritize this for you." |
| **5 — Exceptional** | Transforms a negative experience into a positive one. Customer feels valued and heard. | De-escalates anger, solves the problem, follows up proactively, customer responds with gratitude. |

#### Efficiency (15%)

| Score | Criteria | Example |
|-------|----------|---------|
| **1 — Poor** | Response is confusing, overly long, or requires multiple back-and-forths to clarify. | 500-word response that doesn't answer the question. Multiple "what do you mean?" exchanges. |
| **2 — Below Standard** | Correct but unnecessarily verbose. Could have been resolved in fewer exchanges. | 3 exchanges for something that should have been resolved in 1. |
| **3 — Meets Standard** | Clear and concise. Resolved in a reasonable number of exchanges. | Issue resolved in 1-2 exchanges. Response is appropriate length. |
| **4 — Exceeds** | Resolved in minimum possible exchanges. Response is perfectly calibrated in length. | One-touch resolution with exactly enough detail — not too much, not too little. |
| **5 — Exceptional** | Resolved in one touch with elegant brevity. Sets a model for the team. | Single response that perfectly answers the question, anticipates follow-ups, and closes cleanly. |

#### Process Adherence (10%)

| Score | Criteria | Example |
|-------|----------|---------|
| **1 — Poor** | Violated protocol. No tags, no notes, SLA missed, wrong escalation path. | Ticket left untagged and unassigned. Responded after SLA breach without acknowledgment. |
| **2 — Below Standard** | Partial compliance. Some tags missing, notes incomplete. | Tagged but wrong category. Internal notes missing context for escalation. |
| **3 — Meets Standard** | Followed all standard protocols. Tags, notes, SLA, escalation path all correct. | Properly tagged, internal notes added, responded within SLA, escalated correctly. |
| **4 — Exceeds** | Followed protocols and improved the process. Updated macros, suggested tag improvements. | Noticed a recurring pattern and proposed a new canned response for it. |
| **5 — Exceptional** | Process champion. Identifies gaps and fixes them proactively. | Created a new troubleshooting decision tree for a frequently-misrouted issue type. |

#### Personalization (10%)

| Score | Criteria | Example |
|-------|----------|---------|
| **1 — Poor** | Obviously pasted template with no customization. Wrong name or context. | "Dear Customer, Thank you for reaching out to us about your issue..." |
| **2 — Below Standard** | Template with name filled in but no context-awareness. | "Hi Sarah, Here are the steps to..." (same response regardless of context) |
| **3 — Meets Standard** | Uses customer's name, references their specific situation. | "Hi Sarah, I looked into the export issue you mentioned on your Dashboard..." |
| **4 — Exceeds** | References customer history, acknowledges their context, shows they reviewed the account. | "Hi Sarah, I see you've been using the reporting feature since January — great choice for your use case. For the export issue..." |
| **5 — Exceptional** | Deeply personalized. References past interactions, adapts to customer's expertise level. | Notices customer is technical → skips basics. Recalls previous ticket → "I know you had a similar issue last month with exports..." |

---

## Composite Score Calculation

```
QA Score = (Accuracy × 0.25) + (Completeness × 0.20) + (Tone × 0.20) +
           (Efficiency × 0.15) + (Process × 0.10) + (Personalization × 0.10)

Scaled to percentage: (QA Score / 5) × 100
```

**Example:** Accuracy=4, Completeness=3, Tone=4, Efficiency=3, Process=3, Personalization=3
→ (4×0.25 + 3×0.20 + 4×0.20 + 3×0.15 + 3×0.10 + 3×0.10) = 3.35 → 67%

**Score interpretation:**
| Range | Rating | Action |
|-------|--------|--------|
| 90-100% | Exceptional | Recognize publicly. Use as training example. |
| {{CX_QA_PASS_SCORE}}-89% | Meets standard | On track. Focus coaching on growth areas. |
| 70-{{CX_QA_PASS_SCORE}}% | Below standard | Targeted coaching. 2-week improvement plan. |
| < 70% | Needs improvement | Intensive coaching. PIP if sustained. |

---

## Scoring Calibration Process

### Why Calibration Matters

Without calibration, one reviewer gives 4/5 for a response that another reviewer rates 2/5. Agents lose trust in the QA system. The rubric above reduces subjectivity, but calibration eliminates it.

### Monthly Calibration Session (1 hour)

1. **Preparation (15 min before):** Select 5 tickets — mix of clear-cut and ambiguous cases
2. **Independent scoring (15 min):** Each reviewer (3+) scores all 5 tickets independently using the rubric
3. **Compare and discuss (30 min):**
   - Reveal scores side-by-side
   - For each disagreement > 1 point: discuss reasoning, reach consensus
   - Document the consensus as a "scoring precedent"
4. **Update guidelines (15 min):** Add clarifying examples to the rubric based on today's discussion

### Inter-Rater Reliability

- **Target:** Cohen's Kappa ≥ 0.75 between any two reviewers
- **How to measure:** Calculate agreement on the same 20 tickets quarterly
- **If < 0.70:** Scoring guidelines are ambiguous — schedule extra calibration sessions
- **Track per dimension:** Accuracy and Process typically have higher agreement; Tone and Personalization need more calibration

### Scoring Precedents Document

Maintain a living document of calibration decisions:

```markdown
## Precedent: Customer uses profanity but has a valid issue
- **Scenario:** Customer writes "This f***ing feature is broken again"
- **Tone score for agent:** Score the agent's response tone, not the customer's message.
  A warm, professional response to a profane customer is a 4 or 5.
- **Decided:** 2026-01-15, calibration session #3

## Precedent: Agent provides correct but outdated instructions
- **Scenario:** Agent gives steps that worked last month but the UI changed
- **Accuracy score:** 2 (Below Standard) — the answer is technically correct for the
  old UI but wrong for the customer's current experience
- **Decided:** 2026-02-12, calibration session #4
```

---

## QA Review Process

### Sampling Methodology

| Parameter | Standard | High-Volume Teams |
|-----------|----------|-------------------|
| Sample size per agent | 5 tickets/week (minimum) | 5% of tickets/week (minimum 5) |
| Sampling method | Stratified random | Stratified random |
| Stratification | By channel, priority, and outcome | By channel, priority, outcome, and time of day |
| Review frequency | {{CX_QA_REVIEW_FREQUENCY}} | {{CX_QA_REVIEW_FREQUENCY}} |

### Stratified Sampling Rules

- At least 1 ticket from each active channel per review
- At least 1 escalated ticket per review (if any occurred)
- At least 1 ticket with CSAT < 4 per review (if any occurred)
- Mix of quick resolutions and complex multi-touch tickets
- Don't cherry-pick — randomize within strata

### Reviewer Assignment

- Team leads are primary reviewers
- Rotate secondary reviewers among senior agents (builds empathy, shares best practices)
- No agent reviews their own tickets
- Manager reviews the reviewer's scoring quarterly (meta-QA)

### Dispute Resolution

1. Agent disagrees with a score → writes specific objection (which dimension, why)
2. Reviewer responds with rationale
3. If still disagreed → team lead makes final decision
4. If team lead was the reviewer → CX manager decides
5. Decision is final. Document and add to scoring precedents if it reveals ambiguity.
6. Track dispute rate — if > 20% of reviews are disputed, the rubric needs clarification

---

## Coaching Framework

### 1:1 Coaching Sessions

| Attribute | Standard |
|-----------|----------|
| Frequency | {{CX_QA_REVIEW_FREQUENCY}} (same cadence as QA reviews) |
| Duration | 30 minutes |
| Participants | Manager/lead + agent |
| Format | In-person or video call (not async) |

### Session Agenda

```
1. Check-in (3 min)
   - How are you feeling about your work this week?
   - Any blockers or frustrations?

2. Wins (5 min)
   - Review 1 ticket that the agent handled exceptionally
   - Specifically call out what they did well (SBI: Situation, Behavior, Impact)
   - "In this ticket [situation], you [behavior], which resulted in [impact]."

3. Growth Area (10 min)
   - Review 1 ticket that shows the biggest improvement opportunity
   - Ask the agent: "What would you do differently now?"
   - Discuss together — coach, don't lecture
   - If accuracy issue: walk through the correct answer together
   - If tone issue: rewrite the response together
   - If efficiency issue: discuss how to streamline

4. QA Score Review (5 min)
   - Share scores for this period
   - Highlight trend (improving, stable, declining)
   - Compare to team average (contextualize, don't rank)

5. Development Goal (5 min)
   - Set 1 specific goal for next period
   - SMART: "Improve first-contact resolution from 55% to 65% by end of month"
   - How to measure it? What support is needed?

6. Wrap-up (2 min)
   - Any questions?
   - Any process improvements to suggest?
```

### Feedback Delivery: SBI Model

- **Situation:** "In the ticket from the enterprise customer yesterday..."
- **Behavior:** "You acknowledged their frustration before jumping into the solution..."
- **Impact:** "The customer responded positively and rated the interaction 5/5."

Always lead with a positive SBI before a growth-area SBI. Never deliver only negative feedback.

### Recognition Program

- **Weekly highlight:** Share 1 exceptional ticket in team channel with commentary on what made it great
- **Monthly top performer:** Agent with highest QA score gets public recognition
- **Quarterly award:** "Customer Champion" — based on CSAT + QA + peer nominations
- **Peer recognition:** Agents can nominate each other's tickets for highlights

---

## Agent Performance Metrics Dashboard

### Individual Metrics

| Metric | Target | Source |
|--------|--------|--------|
| Tickets handled (daily) | 25-35 | {{SUPPORT_PLATFORM}} |
| Average first response time | Within SLA | {{SUPPORT_PLATFORM}} |
| Average resolution time | Within SLA | {{SUPPORT_PLATFORM}} |
| First contact resolution rate | > 60% | {{SUPPORT_PLATFORM}} |
| Personal CSAT | ≥ {{CX_CSAT_TARGET}} | CSAT survey |
| QA score (rolling 30-day avg) | ≥ {{CX_QA_PASS_SCORE}}% | QA system |
| Reopen rate | < 10% | {{SUPPORT_PLATFORM}} |
| Escalation rate | < 15% | {{SUPPORT_PLATFORM}} |

### Dashboard Display

Color-code each metric:
- **Green:** Meets or exceeds target
- **Yellow:** Within 10% of target
- **Red:** Below target

Show trend arrows (↑ improving, → stable, ↓ declining) for each metric.

### Team Performance Analytics

| View | What It Shows | Frequency |
|------|---------------|-----------|
| Team CSAT trend | 30-day rolling CSAT across all agents | Daily update |
| QA score distribution | Histogram of all agent QA scores this period | Per review cycle |
| Workload distribution | Tickets per agent (bar chart) — identify overloaded agents | Daily |
| Peer comparison | Anonymized ranking by composite score | Monthly |
| Capacity forecast | Projected ticket volume vs. agent capacity (next 30 days) | Weekly |

---

## Performance Improvement Plan (PIP)

### Trigger Criteria

A PIP is initiated when an agent meets ANY of these conditions:
- QA score < {{CX_QA_PASS_SCORE}}% for 3 consecutive review periods
- Personal CSAT < {{CX_CSAT_TARGET}} minus 0.5 for 30+ days
- Multiple customer complaints about the same agent
- Pattern of process violations after coaching

### PIP Template

```markdown
# Performance Improvement Plan

**Agent:** {{agent_name}}
**Manager:** {{manager_name}}
**Start Date:** {{start_date}}
**Duration:** 30 days
**Review Date:** {{end_date}}

## Current Performance
- QA Score: X% (target: {{CX_QA_PASS_SCORE}}%)
- CSAT: X.X (target: {{CX_CSAT_TARGET}})
- Specific areas of concern: [list with examples]

## Improvement Targets
1. QA score ≥ {{CX_QA_PASS_SCORE}}% for 2 consecutive weeks
2. CSAT ≥ {{CX_CSAT_TARGET}} minus 0.2 for 2 consecutive weeks
3. [Specific behavior change — e.g., "Complete internal notes on every ticket"]

## Support Provided
- Weekly 1:1 coaching (30 min) instead of biweekly
- Paired with senior agent buddy for daily check-ins
- Additional training resources: [specific courses, KB deep-dives, shadowing]
- Reduced ticket load during PIP (20/day instead of 30)

## Check-in Schedule
- Week 1: daily 10-min check-in with manager
- Week 2: every-other-day check-in
- Week 3-4: weekly check-in

## Outcomes
- **Success:** QA and CSAT targets met for 2 consecutive weeks → PIP closed, normal monitoring resumes
- **Partial improvement:** Significant progress but targets not fully met → extend PIP by 2 weeks
- **No improvement:** Targets not met and no meaningful progress → discuss role fit and next steps
```

### Important Notes on PIPs

- A PIP is a support mechanism, not a punishment. Frame it as "here's how we're going to help you improve."
- Document everything. Every check-in, every score, every coaching conversation.
- If an agent is struggling, consider: is it a training gap, a motivation issue, or a role-fit issue? The PIP addresses training gaps. Motivation and fit are different conversations.
- Never surprise someone with a PIP. The coaching conversations should have already flagged the issues.

---

## Shift Scheduling Patterns

### Business Hours Only

```
{{CX_SHIFT_MODEL}} = "business-hours"

Coverage: Mon-Fri, 9:00 AM - 5:00 PM ({{TIMEZONE}})
Team size: 2+ agents (for coverage during breaks/PTO)
After-hours: autoresponder with expected response time
Weekend: autoresponder
```

### Extended Hours

```
{{CX_SHIFT_MODEL}} = "extended"

Coverage: Mon-Fri, 8:00 AM - 10:00 PM ({{TIMEZONE}})
Split shifts: 8:00-4:00 (morning) + 2:00-10:00 (evening)
Overlap: 2:00-4:00 PM (handoff, team meeting, knowledge sharing)
Weekend: reduced hours (10:00-6:00) with 1 agent
```

### Follow-the-Sun

```
{{CX_SHIFT_MODEL}} = "follow-the-sun"

3 timezone regions covering 24 hours:
- Americas: 8:00 AM - 4:00 PM EST (UTC-5)
- EMEA: 8:00 AM - 4:00 PM CET (UTC+1)
- APAC: 8:00 AM - 4:00 PM SGT (UTC+8)

Handoff protocol:
1. Outgoing team: summarize open tickets, flag urgent items
2. Handoff channel: #support-handoff (Slack/Teams)
3. Incoming team: review handoff notes, claim assigned tickets
4. No ticket should be orphaned during handoff
```

### 24/7

```
{{CX_SHIFT_MODEL}} = "24-7"

4 shifts: Morning (6:00-14:00), Afternoon (14:00-22:00), Night (22:00-6:00), Day Off
Rotation: 4 days on, 2 days off (rotating)
Night shift: premium pay (1.2-1.5x), minimum 2 agents
Coverage: 2+ agents per shift always
On-call: 1 senior agent on-call for emergencies during all shifts
```

### Coverage Matrix Template

```
| Hour (UTC) | Mon | Tue | Wed | Thu | Fri | Sat | Sun |
|------------|-----|-----|-----|-----|-----|-----|-----|
| 00:00-04:00| A,B | B,C | C,D | D,A | A,B | B   | A   |
| 04:00-08:00| A,B | B,C | C,D | D,A | A,B | B   | A   |
| 08:00-12:00| C,D | D,A | A,B | B,C | C,D | C   | B   |
| 12:00-16:00| C,D | D,A | A,B | B,C | C,D | C   | B   |
| 16:00-20:00| A,B | B,C | C,D | D,A | A,B | -   | -   |
| 20:00-00:00| A,B | B,C | C,D | D,A | A,B | -   | -   |
```

---

## Internal Knowledge Management

### Team Wiki Structure

```
support-wiki/
├── known-issues/          → Active bugs and workarounds
├── edge-cases/            → Unusual scenarios with resolution steps
├── decision-trees/        → When KB doesn't cover a scenario
├── tribal-knowledge/      → Undocumented tips from experienced agents
├── common-mistakes/       → "Don't do X because Y" with examples
├── escalation-contacts/   → Who to contact for what, with response expectations
└── tool-tips/             → {{SUPPORT_PLATFORM}} shortcuts, admin panel tricks
```

### Knowledge Sharing

- **Weekly session (15 min):** One agent presents a learning from the week
  - Interesting ticket, new troubleshooting technique, KB gap discovered
  - Rotate presenter — everyone participates
- **"Today I Learned" channel:** Slack channel for quick knowledge sharing throughout the day
- **Mentor pairing:** Senior agents paired with junior agents for quarterly knowledge transfer

---

## Implementation Checklist

- [ ] Customize QA scoring rubric (adjust weights and criteria for your product)
- [ ] Create scoring precedents document (start empty, populate through calibration)
- [ ] Schedule first calibration session (3+ reviewers)
- [ ] Set up QA review tracking (spreadsheet or tool: Klaus, MaestroQA, or custom)
- [ ] Design agent performance dashboard
- [ ] Schedule recurring 1:1 coaching sessions at {{CX_QA_REVIEW_FREQUENCY}} cadence
- [ ] Create PIP template (customize from above)
- [ ] Choose and configure shift scheduling model ({{CX_SHIFT_MODEL}})
- [ ] Build coverage matrix for current team
- [ ] Set up internal wiki structure
- [ ] Schedule weekly knowledge sharing sessions
- [ ] Train reviewers on rubric and calibration process

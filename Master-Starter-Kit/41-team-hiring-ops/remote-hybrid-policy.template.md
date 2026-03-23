# Remote / Hybrid Work Policy

> Ambiguity about work arrangements is the #1 source of early attrition in post-2020 hiring. This template defines your policy explicitly — core hours, timezone overlap, communication norms, equipment, travel, and performance measurement — so that every employee and candidate knows exactly what to expect before they join.

---

## 1. Policy Statement

{{PROJECT_NAME}} operates on a **{{WORK_LOCATION_POLICY}}** basis.

<!-- IF {{WORK_LOCATION_POLICY}} == "remote-first" -->
**Remote-first** means remote is the default, not the exception. All processes, meetings, documentation, and decisions are designed to work without co-location. We may have a physical office or co-working space, but no employee is disadvantaged by not being in it. Asynchronous communication is the primary mode; synchronous meetings are scheduled deliberately and sparingly.
<!-- ENDIF -->

<!-- IF {{WORK_LOCATION_POLICY}} == "hybrid" -->
**Hybrid** means employees are expected to be in the office {{HYBRID_DAYS_PER_WEEK}} days per week on designated days. Remote days are fully supported with the same tools and norms as in-office days. Meetings that include any remote participant are conducted as if everyone is remote (individual video, shared doc, no sidebar conversations).
<!-- ENDIF -->

<!-- IF {{WORK_LOCATION_POLICY}} == "on-site" -->
**On-site** means employees work from the company office during standard business hours. Occasional remote work is available by arrangement for personal appointments, illness recovery (when feeling well enough to work), or exceptional circumstances.
<!-- ENDIF -->

### Policy Scope

This policy applies to all employees, contractors, and interns. Exceptions require VP-level approval and must be documented.

---

## 2. Core Hours & Timezone Overlap Requirements

### Core Hours

| Parameter | Value | Notes |
|-----------|-------|-------|
| **Core hours** | {{CORE_HOURS_START}} - {{CORE_HOURS_END}} {{CORE_TIMEZONE}} | All synchronous meetings must fall within core hours |
| **Timezone overlap requirement** | {{TIMEZONE_OVERLAP_HOURS}} hours minimum | Employees must overlap with core hours for this many hours daily |
| **Flexible hours** | Remainder of workday | Work when you are most productive, as long as overlap is maintained |

### Timezone Guidelines

| Timezone Range | Status | Notes |
|---------------|--------|-------|
| Within 2 hours of {{CORE_TIMEZONE}} | **Fully compatible** | Full overlap with core hours |
| 3-5 hours from {{CORE_TIMEZONE}} | **Compatible with adjustment** | May need to shift work hours to ensure {{TIMEZONE_OVERLAP_HOURS}} hours overlap |
| 6-8 hours from {{CORE_TIMEZONE}} | **Challenging** | Requires significant schedule flexibility. Case-by-case approval. |
| 9+ hours from {{CORE_TIMEZONE}} | **Incompatible** | Insufficient overlap. Not recommended unless role is fully async. |

### Meeting Scheduling Rules

- All recurring meetings must start and end within core hours
- One-off meetings with external timezone participants may extend 1 hour before or after core hours
- No meetings before {{CORE_HOURS_START}} or after {{CORE_HOURS_END}} {{CORE_TIMEZONE}} without explicit consent of all attendees
- Friday afternoons are meeting-free (focus time / informal social only)
- All meetings must have an agenda shared 24 hours in advance and a designated note-taker

---

## 3. Communication Norms (Sync vs Async)

### Async-First Communication

| Use Async (Slack, email, docs) For | Use Sync (video, call) For |
|------------------------------------|-----------------------------|
| Status updates and progress reports | Brainstorming and creative exploration |
| Code reviews and technical feedback | Conflict resolution and difficult conversations |
| Decisions that can wait 4-24 hours | Decisions that need alignment across 3+ people simultaneously |
| Questions that have factual answers | Complex debugging that requires screen sharing |
| Announcements and FYIs | 1:1 manager check-ins and career conversations |
| Written proposals and RFCs | Onboarding new team members (first 2 weeks) |

### Expected Response Times

| Channel | Expected Response | Maximum Response | Notes |
|---------|-------------------|-----------------|-------|
| **Slack DM** | 2-4 hours during work hours | 8 hours | Not urgent? Use async. Urgent? Say so explicitly. |
| **Slack channel** | 4-8 hours | 24 hours | Tag specific people if you need a specific response |
| **Email** | 24 hours | 48 hours | For external communication and formal matters |
| **PR review** | 24 hours | 48 hours | Blocking? Mark as "URGENT" in title |
| **Incident page** | 15 minutes | 30 minutes | Only for production incidents (P0/P1) |

### Slack Norms

- **Threads always.** Never respond to a message in the channel — use threads.
- **@here sparingly.** Only for messages that genuinely need everyone's attention right now.
- **Status emoji.** Set your status when away, in focus mode, or offline.
- **No expectation of after-hours response.** Unless on-call, Slack after work hours is optional.
- **Written over verbal.** If a Slack conversation exceeds 5 back-and-forth messages, move to a call. Then summarize the call outcome in writing.

---

## 4. Meeting Cadence & Etiquette

### Standard Meeting Cadence

| Meeting | Frequency | Duration | Attendees | Purpose |
|---------|-----------|----------|-----------|---------|
| Team standup | Daily (async option available) | 15 min sync / 5 min async | Immediate team | Blockers, progress, plan |
| Sprint planning | Bi-weekly | 60 min | Team + PM | Scope and commit to next sprint |
| Sprint retro | Bi-weekly | 45 min | Team | What worked, what didn't, improvements |
| 1:1 (manager) | Weekly | 30 min | Manager + report | Career, blockers, growth, feedback |
| Team social | Weekly | 30 min | Team (optional) | Non-work conversation, games, connection |
| All-hands | Monthly | 45 min | Entire company | Company updates, wins, Q&A |
| Demo day | Bi-weekly or monthly | 30 min | Company-wide | Show what shipped |

### Meeting Etiquette

**Before the meeting:**
- Agenda shared 24 hours in advance (no agenda = cancel the meeting)
- Pre-read materials linked in the calendar invite
- Attendee list trimmed to only necessary participants

**During the meeting:**
- Video on (unless bandwidth issues or agreed team norm)
- One person talks at a time (use hand-raise in video tools)
- Designated note-taker captures decisions and action items
- Start on time, end 5 minutes early (buffer for next meeting)
- No multitasking — if the meeting does not need your attention, leave

**After the meeting:**
- Notes and action items posted in relevant Slack channel within 1 hour
- Action items have owners and deadlines
- Recordings shared for absent team members (if meeting was recorded)

---

## 5. Home Office Stipend & Equipment

### One-Time Setup Stipend

| Item | Budget | Notes |
|------|--------|-------|
| Desk | $300-$800 | Standing desk strongly recommended for health |
| Chair | $300-$700 | Ergonomic chair is a health investment, not a perk |
| Monitor | $200-$500 | 27"+ 4K recommended for development work |
| Keyboard + Mouse | $100-$250 | Employee's preference |
| Headset / Microphone | $100-$250 | Noise-cancelling for clear meeting audio |
| Webcam | $50-$150 | If laptop webcam is insufficient |
| Lighting | $50-$100 | Ring light or desk lamp for video calls |
| **Total one-time budget** | **$1,000 - $2,500** | |

### Ongoing Monthly Stipend

| Category | Monthly Amount | Notes |
|----------|---------------|-------|
| Internet | $50-$100 | Covers home internet upgrade for reliable video calls |
| Utilities | $25-$50 | Electricity, heating/cooling for home office |
| Coffee / snacks | $25-$50 | What you would get in an office |
| **Total monthly** | **$100-$200** | |

### Equipment Refresh Cycle

| Equipment | Refresh Period | Process |
|-----------|---------------|---------|
| Laptop | Every 3 years | Company-owned, returned on departure |
| Monitor | Every 4-5 years | Employee-owned after 2 years |
| Keyboard / Mouse / Headset | As needed | Employee submits request with justification |

---

## 6. Coworking Space Policy

<!-- IF {{WORK_LOCATION_POLICY}} == "remote-first" -->
Employees who prefer working outside their home may use a coworking space. The company provides a monthly coworking stipend.

| Parameter | Value |
|-----------|-------|
| Monthly coworking budget | $200-$500 |
| Approved providers | Any coworking space (WeWork, Regus, local options) |
| Hot desk vs dedicated desk | Employee's choice within budget |
| Reimbursement process | Monthly expense report with receipt |
| Day passes | Covered under the monthly budget |
<!-- ENDIF -->

---

## 7. Travel & Meetup Budget

### Team Gatherings

| Gathering | Frequency | Budget Per Person | Duration | Purpose |
|-----------|-----------|-------------------|----------|---------|
| Company offsite | Annual | $3,000-$5,000 | 3-5 days | Company-wide alignment, planning, social bonding |
| Team offsite | Semi-annual | $1,500-$3,000 | 2-3 days | Team planning, relationship building, working sessions |
| Pair meetup | As needed | $500-$1,500 | 1-2 days | Two team members co-working in person for a specific project |

### Travel Policy

| Component | Policy |
|-----------|--------|
| **Flights** | Economy class for flights under 6 hours. Premium economy for 6+ hours. Business class requires VP approval. |
| **Hotels** | Up to $200/night in standard markets, $300/night in high-cost cities. Book through approved platform. |
| **Meals** | $75/day per diem (or actual expense with receipts, whichever is less) |
| **Ground transport** | Rideshare or public transit. Rental car for multi-person groups when cheaper. |
| **Advance booking** | Book flights 3+ weeks in advance for best rates |
| **Expense reports** | Submit within 14 days of return with receipts |

---

## 8. Performance Measurement (Output-Based vs Hours)

### Output-Based Measurement

{{PROJECT_NAME}} measures performance by outcomes, not hours.

| We Measure | We Do NOT Measure |
|-----------|-------------------|
| Features shipped and their impact | Hours logged per day |
| Code quality and review throughput | Time spent in Slack showing "active" |
| Problems solved and decisions made | First/last login times |
| Collaboration quality and team contribution | Response time to non-urgent messages outside core hours |
| Meeting commitments and deadlines | Physical presence in a specific location |
| Growth against development goals | Activity metrics (commits per day, lines of code) |

### Accountability Mechanisms

| Mechanism | Frequency | Purpose |
|-----------|-----------|---------|
| Sprint commitments | Bi-weekly | Team-level accountability for planned work |
| 1:1s with manager | Weekly | Individual accountability, blockers, support |
| Sprint retrospectives | Bi-weekly | Team reflection on what is and is not working |
| Performance reviews | {{REVIEW_CADENCE}} | Formal assessment against role expectations |
| Project post-mortems | Per project | Team learning from completed work |

### Warning Signs (Manager Watch List)

| Signal | What It Might Mean | Response |
|--------|-------------------|----------|
| Consistently missing sprint commitments | Overcommitting, struggling, or disengaged | 1:1 conversation about capacity and support |
| Low PR review activity | Isolated, overwhelmed, or avoiding collaboration | Check in on workload and engagement |
| Absence from async discussions | May be struggling, burned out, or checking out | Direct check-in, not passive monitoring |
| Low meeting participation | Timezone issues, meeting overload, or disengagement | Adjust meeting times or reduce meeting load |
| Quality decline in delivered work | Burnout, personal issues, or skill gap | Supportive conversation, not punitive |

**Important:** These signals trigger supportive conversations, not surveillance. Remote work requires trust. If you find yourself monitoring activity metrics to manage people, you have a management problem, not a remote work problem.

---

## 9. Documentation Requirements

### What Must Be Written Down

| Item | Where | Who Updates | Frequency |
|------|-------|-------------|-----------|
| Architecture decisions | ADR docs (Section 03) | Engineer making the decision | Per decision |
| Meeting outcomes and action items | Slack channel or Notion | Meeting note-taker | Per meeting |
| Sprint goals and progress | Project management tool | PM + team | Bi-weekly |
| Process changes | Team handbook / Notion | Person proposing the change | Per change |
| Incident post-mortems | Incident log (Section 21) | Incident lead | Per incident |
| Onboarding information | This section + Section 06 | Hiring manager | Per hire |
| Product decisions and rationale | Product docs | PM | Per decision |

### Why Documentation Matters More for Remote/Hybrid

In an office, undocumented knowledge persists through hallway conversations, whiteboard sessions, and overheard discussions. Remote teams have none of these passive knowledge channels. If it is not written down, it does not exist. The documentation overhead is the price of distributed work — and it pays dividends because written documentation is searchable, permanent, and accessible to future hires.

---

## Checklist

- [ ] Published {{WORK_LOCATION_POLICY}} policy statement visible to all employees and candidates
- [ ] Defined core hours with {{TIMEZONE_OVERLAP_HOURS}} hours of overlap requirement
- [ ] Established async-first communication norms with response time expectations
- [ ] Set meeting cadence with agenda and note-taking requirements
- [ ] Allocated home office setup budget and ongoing stipend
- [ ] Defined coworking space policy (if remote-first)
- [ ] Budgeted for annual company offsite and semi-annual team offsites
- [ ] Documented output-based performance measurement approach
- [ ] Created documentation requirements for all key decisions and processes
- [ ] Communicated policy to all current employees and included in offer letters for new hires

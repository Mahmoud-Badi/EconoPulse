# Meeting Agenda Templates

> A meeting without an agenda is a conversation that should have been an email. A meeting without a facilitator is a free-for-all. A meeting without documented action items is a waste of everyone's time. This guide provides ready-to-use agendas for the four most common non-sprint meetings, plus universal rules that apply to every meeting.

---

## General Meeting Rules

Before reading the specific agendas, internalize these rules. They apply to every meeting your team runs.

### Every Meeting Must Have

| Requirement | Why | What Happens Without It |
|-------------|-----|------------------------|
| **Agenda shared in advance** | Attendees prepare, meeting stays focused | Rambling, tangents, "what are we here for?" |
| **Facilitator** | One person keeps time and redirects tangents | Loudest voice dominates, meeting runs over |
| **Timekeeper** | Can be the facilitator or a separate person | Meeting runs 30 minutes over, everyone late to next thing |
| **Note-taker** | Can be the facilitator or a separate person | Action items lost, decisions forgotten, same meeting next week |
| **Documented action items** | Every action has an owner and a deadline | Nothing happens after the meeting |
| **Clear end time** | People plan their day around it | Meeting expands to fill all available time |

### Default Meeting Lengths

| Intended Duration | Scheduled Duration | Buffer |
|------------------|--------------------|--------|
| 25 minutes | 25 minutes | 5 min before next meeting |
| 50 minutes | 50 minutes | 10 min before next meeting |
| 75 minutes | 80 minutes (use sparingly) | 10 min before next meeting |

Never schedule 30-minute or 60-minute meetings. The 25/50-minute default creates natural buffer time for bio breaks, context-switching, and walking between rooms.

### Meeting Decision Framework

Before scheduling a meeting, ask:

```
Can this be resolved with an async message (Slack/email)?
  |
  +-- YES --> Do not schedule a meeting. Send the message.
  |
  +-- NO --> Does this require real-time back-and-forth discussion?
              |
              +-- YES --> Schedule a meeting with an agenda.
              |
              +-- NO --> Write an RFC or proposal document. Collect async feedback.
```

### Who Should Attend

Apply the "two-pizza rule" — if you cannot feed the attendees with two pizzas (~6-8 people), the meeting is too large. For each person on the invite:

- **Must attend:** Their input is required for a decision, or they are directly affected by the outcome
- **Optional:** They may benefit from the information but are not required
- **Should not attend:** They can read the notes afterward

Send notes to everyone who might care. Only invite people whose presence is necessary.

---

## Agenda 1: One-on-One Meeting

**Purpose:** Build trust, surface concerns, discuss career growth, and remove blockers between a team lead and a team member.
**Duration:** 25 minutes (weekly or bi-weekly)
**Attendees:** 2 people (lead + team member)
**Facilitator:** The team member drives the agenda. The lead listens more than talks.

### Agenda

| Section | Time | Owner | Notes |
|---------|------|-------|-------|
| **Check-in** | 2 min | Both | "How are you doing? Really." Not a status update — a human check-in. |
| **Review previous action items** | 3 min | Both | Were they completed? Any carry-over? |
| **What is going well?** | 5 min | Team member | Wins, things to celebrate, positive momentum |
| **What is challenging?** | 10 min | Team member | Blockers, frustrations, concerns. Lead asks questions, does not jump to solutions. |
| **Career growth / learning** | 5 min | Team member | Skill development, interesting projects, goals for the quarter |
| **Action items** | 3 min | Both | Concrete next steps with owners. Keep to 1-3 items. |

### One-on-One Best Practices

1. **Never cancel.** Rescheduling is fine. Canceling sends the message "you are not important." If you must cancel, explain why and reschedule immediately.
2. **This is not a status update.** Do not ask "what did you work on this week?" That is what standup is for. Ask "how are you feeling about the project?"
3. **The team member owns the agenda.** They should come with topics. If they have nothing, ask: "What is the most important thing we could discuss right now?"
4. **Take notes.** Not transcripts — just key points and action items. Share them afterward so both parties have the same understanding.
5. **Follow through on commitments.** If you said you would talk to someone about a blocker, do it before the next 1-on-1. Broken commitments destroy trust.

### Conversation Starters (When Neither Person Has Topics)

| Category | Questions |
|----------|-----------|
| **Work** | "What is the most interesting thing you worked on recently?" |
| **Blockers** | "Is there anything slowing you down that I could help with?" |
| **Team** | "How is the team dynamic? Anything I should know?" |
| **Growth** | "What skill do you want to develop this quarter?" |
| **Feedback** | "Is there anything I could do differently as a lead?" |
| **Energy** | "On a scale of 1-10, where is your energy level? What would move it up?" |
| **Big picture** | "Do you feel like your work connects to the project's goals?" |

---

## Agenda 2: Technical Design Review

**Purpose:** Review a proposed technical approach before implementation starts. Catch issues early when they are cheap to fix, not late when they are expensive.
**Duration:** 50 minutes
**Attendees:** Author of the design + 2-5 reviewers (engineers who will implement or be affected)
**Facilitator:** Author presents; a senior engineer or tech lead facilitates discussion.

### Prerequisites (Before the Meeting)

- [ ] Design document written and shared **at least 24 hours before** the meeting
- [ ] Reviewers have read the document (if you haven't read it, do not attend — you will slow the meeting)
- [ ] Author has marked sections where they want specific feedback

### Design Document Minimum Contents

The design doc should cover at minimum:

1. **Problem statement** — What problem are we solving? Why now?
2. **Proposed solution** — How we plan to solve it (architecture, data model, API, etc.)
3. **Alternatives considered** — What else we thought about and why we rejected it
4. **Trade-offs** — What we are accepting/giving up
5. **Open questions** — What the author is unsure about

### Agenda

| Section | Time | Owner | Notes |
|---------|------|-------|-------|
| **Problem statement** | 5 min | Author | Brief recap — attendees have read the doc. Focus on context, not re-reading the doc. |
| **Solution walkthrough** | 15 min | Author | Walk through the proposed solution. Diagrams help. Focus on the "why" behind design choices. |
| **Questions and concerns** | 15 min | Facilitator | Open floor. Facilitator ensures everyone speaks. Capture concerns on a shared doc. |
| **Alternatives discussion** | 5 min | All | Are there alternatives the author missed? Are the trade-offs acceptable? |
| **Decision** | 5 min | Facilitator | Options: Approved / Approved with changes / Needs revision / Rejected |
| **Action items and next steps** | 5 min | Facilitator | What changes are needed? Who implements? When? |

### Design Review Outcomes

| Outcome | Meaning | Next Step |
|---------|---------|-----------|
| **Approved** | Design is good as-is | Author proceeds to implementation |
| **Approved with changes** | Design is mostly good, minor changes needed | Author updates doc, no follow-up meeting needed |
| **Needs revision** | Significant concerns that require rethinking | Author revises and schedules a follow-up review |
| **Rejected** | Fundamental issues with the approach | Author explores alternatives, may need a new design doc |

### Design Review Anti-Patterns

| Anti-Pattern | Fix |
|-------------|-----|
| Reviewers did not read the doc | Cancel and reschedule. "Has everyone read the doc?" at the start. |
| Discussion becomes bikeshedding (arguing about trivial details) | Facilitator: "Is this a blocking concern or a preference? If preference, let the author decide." |
| No one raises concerns (groupthink) | Facilitator explicitly asks: "What could go wrong with this approach?" |
| Author is defensive | Frame feedback as questions: "What happens if X?" not "X is wrong." |
| Meeting becomes implementation planning | Design review decides WHAT, not HOW. Implementation details come after approval. |

---

## Agenda 3: Incident Postmortem

**Purpose:** Understand what happened, why it happened, and how to prevent it from happening again. Blameless by design.
**Duration:** 50 minutes
**Attendees:** Everyone involved in the incident + team lead + anyone who wants to learn
**Facilitator:** Someone NOT directly involved in the incident (reduces bias and defensiveness)
**Timing:** Within 3-5 business days of incident resolution (soon enough to remember, late enough to have perspective)

### Prerequisites (Before the Meeting)

- [ ] Incident timeline written (who did what, when, based on logs/chat/alerts)
- [ ] Impact assessment completed (users affected, duration, severity)
- [ ] All relevant data collected (logs, metrics, screenshots, alert history)
- [ ] Facilitator has reviewed the timeline

### Agenda

| Section | Time | Owner | Notes |
|---------|------|-------|-------|
| **Set the tone** | 2 min | Facilitator | "This is a blameless postmortem. We are here to improve systems and processes, not to assign blame. Everyone involved did their best with the information they had." |
| **Timeline review** | 10 min | Author of timeline | Walk through the incident chronologically. What happened, when, who noticed, who responded. |
| **Root cause analysis (5 Whys)** | 15 min | Facilitator | Ask "Why?" five times to get past symptoms to root causes. |
| **What went well** | 5 min | All | What worked during incident response? What should we keep doing? |
| **What could improve** | 10 min | All | What would have prevented this? What would have reduced impact? What would have sped up resolution? |
| **Action items** | 8 min | Facilitator | Specific, measurable actions with owners and deadlines. Prioritize by impact. |

### 5 Whys Example

```
Incident: Users could not log in for 45 minutes on Tuesday.

Why 1: Why could users not log in?
  --> The auth service was returning 500 errors.

Why 2: Why was the auth service returning 500 errors?
  --> The database connection pool was exhausted.

Why 3: Why was the connection pool exhausted?
  --> A background job was holding connections open for too long.

Why 4: Why was the background job holding connections?
  --> It was doing a full table scan on the users table without a timeout.

Why 5: Why was there no timeout on the query?
  --> We do not have default query timeouts configured, and the background job
      was written before we established that convention.

Root cause: Missing default query timeout configuration.
Action: Add default 30s query timeout to database configuration. Audit existing
        background jobs for long-running queries.
```

### Postmortem Document Template

After the meeting, the facilitator writes and shares:

```markdown
## Incident Postmortem: [Incident Title]

**Date of incident:** [date]
**Duration:** [how long it lasted]
**Severity:** P0 / P1 / P2 / P3
**Impact:** [users affected, revenue impact, data impact]
**Resolved by:** [who and how]

### Timeline
| Time | Event |
|------|-------|
| [HH:MM] | [What happened] |
| [HH:MM] | [What happened] |

### Root Cause
[Result of 5 Whys analysis]

### What Went Well
- [List]

### What Could Improve
- [List]

### Action Items
| Action | Owner | Due Date | Priority | Status |
|--------|-------|----------|----------|--------|
| | | | P0/P1/P2 | Open |
| | | | | |

### Lessons Learned
[1-2 paragraphs of key takeaways]
```

### Postmortem Rules

1. **Blameless means blameless.** "The deploy script failed" not "Alex ran the deploy script wrong." If someone feels blamed, the postmortem has failed.
2. **Focus on systems, not people.** "Our deploy process does not have a rollback step" not "The deployer should have known to rollback."
3. **Every postmortem produces action items.** If it does not, it was a storytelling session, not a postmortem.
4. **Action items get tracked.** Add them to STATUS.md. Review in the next sprint planning.
5. **Share the postmortem publicly** (within the org). Other teams learn from your incidents.
6. **Postmortems for near-misses too.** Something almost went wrong? Still worth a 25-minute mini-postmortem.

---

## Agenda 4: Backlog Grooming / Refinement

**Purpose:** Ensure the backlog is prioritized, estimated, and ready for sprint planning. Sprint planning should select from a groomed backlog, not groom tasks on the fly.
**Duration:** 50 minutes (weekly or bi-weekly, depending on sprint length)
**Attendees:** Product owner + development team
**Facilitator:** Product owner or project lead

### Agenda

| Section | Time | Owner | Notes |
|---------|------|-------|-------|
| **Review upcoming priorities** | 5 min | Product owner | What is coming in the next 1-2 sprints? Any changes in priority? |
| **Groom top items** | 30 min | All | For each item: Is the description clear? Is acceptance criteria defined? Can it be estimated? Does it need decomposition? |
| **Estimate** | 10 min | Development team | T-shirt sizing (S/M/L/XL) or story points. Quick estimation, not detailed planning. |
| **Identify blockers and dependencies** | 5 min | All | Any items that cannot be worked on until something else happens? Flag them. |

### Grooming Checklist (Per Item)

A backlog item is "groomed" when all of the following are true:

- [ ] Title is clear and specific (not "Fix the thing")
- [ ] Description explains the what and the why
- [ ] Acceptance criteria defined (how do we know this is done?)
- [ ] Estimated (story points or T-shirt size)
- [ ] Dependencies identified
- [ ] No open questions that would block implementation
- [ ] Small enough to complete in one sprint (if not, decompose)

---

## Meeting Notes Template

Use this template for documenting any meeting.

```markdown
## Meeting: [Title]
**Date:** [date]
**Attendees:** [names]
**Facilitator:** [name]
**Note-taker:** [name]

### Agenda
1. [Topic 1]
2. [Topic 2]
3. [Topic 3]

### Discussion Notes
**[Topic 1]:**
- [Key point]
- [Key point]
- Decision: [if any]

**[Topic 2]:**
- [Key point]
- [Key point]
- Decision: [if any]

### Action Items
| Action | Owner | Due Date |
|--------|-------|----------|
| | | |
| | | |

### Decisions Made
- [Decision 1] — Rationale: [brief]
- [Decision 2] — Rationale: [brief]

### Next Meeting
- Date: [date]
- Topics to carry over: [list]
```

---

## Meeting Anti-Patterns

| Anti-Pattern | Symptom | Fix |
|-------------|---------|-----|
| **No agenda** | "So... what are we here to discuss?" | Cancel meetings without agendas. Send the agenda 24 hours before. |
| **No facilitator** | Meeting goes off on tangents for 20 minutes | Assign a facilitator. Their job is to redirect: "Interesting — can we take that offline?" |
| **Meetings that should be emails** | Status updates read aloud, no discussion needed | Ask: "Does this require real-time discussion?" If no, send an email or Slack post. |
| **Recurring meetings nobody cancels** | Weekly meeting where people check phones and contribute nothing | Audit recurring meetings quarterly. If it has been useless for 3 sessions, cancel it. |
| **Meeting runs over** | 30-minute meeting hits 45 minutes, everyone is late to next commitment | Hard stop at scheduled time. "We are at time. Remaining items move to [next meeting / async]." |
| **One person dominates** | Senior engineer or manager talks 80% of the time | Facilitator calls on quiet people: "[Name], what do you think?" Set a speaking time limit. |
| **No action items** | Good discussion, nothing changes | Last 5 minutes always reserved for action items. No action items = no meeting purpose. |
| **Too many attendees** | 12 people in a meeting, 4 are speaking, 8 are multitasking | Cut the invite list. Share notes with the 8 who do not need to attend live. |
| **Back-to-back meetings** | No time to process, prepare, or take breaks | Schedule 25/50-minute meetings. Block "focus time" on calendars. |

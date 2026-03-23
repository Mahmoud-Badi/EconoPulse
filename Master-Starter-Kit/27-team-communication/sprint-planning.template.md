# Sprint Planning

> Sprint planning is where the team converts a prioritized backlog into a committed plan. A bad planning session produces either an overloaded sprint (team burns out, velocity drops) or an underloaded sprint (stakeholders lose confidence, momentum stalls). This template produces a realistic commitment every time.

---

## Sprint {{SPRINT_NUMBER}} Planning

**Project:** {{PROJECT_NAME}}
**Date:** {{DATE}}
**Sprint Duration:** {{SPRINT_DURATION}}
**Sprint Dates:** {{START_DATE}} -- {{END_DATE}}
**Facilitator:** [rotate each sprint]
**Attendees:** [all team members who will work on sprint tasks]

---

### 1. Review Last Sprint (10 min)

| Metric | Value |
|--------|-------|
| Planned | {{PLANNED_POINTS}} story points |
| Completed | {{COMPLETED_POINTS}} story points |
| Velocity | {{VELOCITY}}% |
| Carry-over items | [number] |
| Bugs introduced | [number] |
| Unplanned work added | [number of items] |

**Incomplete items carried over:**

| Task ID | Title | Remaining Effort | Reason Incomplete |
|---------|-------|-----------------|-------------------|
| | | | Blocked / Underestimated / Deprioritized |
| | | | |
| | | | |

**Key observations from last sprint:**
- [What went well that we should repeat]
- [What surprised us — scope, complexity, blockers]
- [Any retro action items that affect this sprint's planning]

---

### 2. Capacity Calculation (5 min)

<!-- IF {{TEAM_SIZE}} == "1" -->
| Team Member | Available Days | Focus Hours/Day | Planned PTO/Off | Total Hours |
|-------------|---------------|-----------------|-----------------|-------------|
| {{MEMBER_1}} | | 6 | | |
| **Total Capacity** | | | | |
<!-- ENDIF -->

<!-- IF {{TEAM_SIZE}} == "2" -->
| Team Member | Available Days | Focus Hours/Day | Planned PTO/Off | Total Hours |
|-------------|---------------|-----------------|-----------------|-------------|
| {{MEMBER_1}} | | 6 | | |
| {{MEMBER_2}} | | 6 | | |
| **Total Capacity** | | | | |
<!-- ENDIF -->

<!-- IF {{TEAM_SIZE}} == "3-5" -->
| Team Member | Available Days | Focus Hours/Day | Planned PTO/Off | Total Hours |
|-------------|---------------|-----------------|-----------------|-------------|
| {{MEMBER_1}} | | 6 | | |
| {{MEMBER_2}} | | 6 | | |
| {{MEMBER_3}} | | 6 | | |
| {{MEMBER_4}} | | 6 | | |
| {{MEMBER_5}} | | 6 | | |
| **Total Capacity** | | | | |
<!-- ENDIF -->

**Capacity notes:**
- Default focus hours = 6 per day (accounts for meetings, context-switching, breaks)
- Subtract 1 hour/day for each recurring meeting on the calendar
- Subtract full days for PTO, holidays, company events
- If this is the first sprint, estimate conservatively — you will calibrate after 2-3 sprints
- Carry-over items consume capacity — account for them before adding new work

**Capacity formula:**
```
Available Hours = (Available Days x Focus Hours/Day) - Carry-Over Estimate
Story Points Budget = Available Hours / Average Hours Per Point (from last sprint)
```

---

### 3. Sprint Goal (5 min)

**Sprint Goal:** [One sentence that defines success for this sprint. This is what you demo at sprint end.]

Examples of good sprint goals:
- "Users can sign up, log in, and reset their password end-to-end."
- "Payment integration processes test transactions on staging."
- "Dashboard loads in under 2 seconds with production-scale data."

Examples of bad sprint goals:
- "Work on the backend." (too vague)
- "Complete TASK-42 through TASK-67." (that is a task list, not a goal)
- "Fix all bugs." (unmeasurable, likely impossible)

**Sprint Goal Checklist:**
- [ ] Goal is one sentence
- [ ] Goal describes a user-visible or stakeholder-visible outcome
- [ ] Goal is achievable within the sprint
- [ ] Goal is measurable (you can demo it or verify it)
- [ ] All team members understand and agree to the goal

---

### 4. Task Selection (20 min)

Pull from STATUS.md backlog by priority, then dependency order. Do not cherry-pick easy tasks.

**Selected tasks:**

| Task ID | Title | Effort (pts) | Priority | Assigned To | Dependencies |
|---------|-------|-------------|----------|-------------|--------------|
| | | | P0-Critical | | None |
| | | | P0-Critical | | |
| | | | P1-High | | |
| | | | P1-High | | |
| | | | P2-Medium | | |
| | | | P2-Medium | | |
| | | | P2-Medium | | |
| | | | P3-Low | | |

**Total committed points:** [sum] / [capacity budget] story points

**Task selection rules:**
1. Take all carry-over items first (they already started, finishing them is higher ROI than starting new work)
2. Take P0 items next (critical path, no negotiation)
3. Take P1 items until capacity is ~80% full
4. Fill remaining 20% with P2 items or tech debt
5. P3 items only if all P1/P2 items are genuinely done or blocked
6. Never commit to more than 85% of calculated capacity — leave room for unplanned work

**Assignment rules:**
- Each task has exactly one owner (not "the team")
- Balance workload across team members (no one person gets 60% of the points)
- Consider skill match — but also consider growth (pair a junior on a stretch task with a senior reviewer)
- Assign in the meeting, not after — people should leave knowing exactly what they own

---

### 5. Risk Identification (5 min)

| Risk | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation | Owner |
|------|-------------------|-----------------|------------|-------|
| [External dependency delayed] | | | [Identify fallback or parallel work] | |
| [Key team member OOO mid-sprint] | | | [Cross-train or defer their tasks] | |
| [Technical uncertainty in task X] | | | [Timebox spike to 4 hours, then re-estimate] | |
| [Scope creep from stakeholder] | | | [Point to sprint commitment, defer to backlog] | |
| | | | | |

**Risk response protocol:**
- High likelihood + High impact: Mitigate now (before sprint starts)
- High likelihood + Low impact: Accept and monitor
- Low likelihood + High impact: Prepare contingency plan
- Low likelihood + Low impact: Accept

---

### 6. Commitment

The team agrees on scope. **Scope does not change mid-sprint without explicit renegotiation.** If new urgent work appears, something of equal size must be removed from the sprint.

**Commitment checklist:**
- [ ] All team members agree on the sprint goal
- [ ] Capacity matches committed work (not exceeding 85% of available hours)
- [ ] All dependencies are identified and either resolved or have a mitigation plan
- [ ] Every task has exactly one owner
- [ ] Carry-over items from last sprint are accounted for
- [ ] No task exceeds 1/3 of the sprint duration (break it down if so)
- [ ] Sprint board is set up with all committed tasks

**Signatures (informal):**
- [ ] {{MEMBER_1}} — committed
- [ ] {{MEMBER_2}} — committed

---

## Sprint Duration Selection Guide

| Duration | Best For | Pros | Cons |
|----------|---------|------|------|
| **1 week** | Early-stage projects, high uncertainty, rapid prototyping | Fast feedback, quick pivots, low planning overhead | High ceremony-to-work ratio, less time for deep work |
| **2 weeks** | Standard for most teams, stable feature development | Good balance of planning and execution, industry standard | Can feel long for fast-moving projects |
| **3 weeks** | Complex features, research-heavy sprints, small teams | More deep work time, fewer planning sessions | Delayed feedback, harder to estimate, scope creep risk |
| **4 weeks** | Avoid unless regulatory/compliance requires it | Maximum deep work time | Too long for feedback loops, too much scope creep |

**Recommendation:** Start with **{{SPRINT_DURATION}}** sprints. Adjust after 3-4 sprints based on velocity consistency and team feedback.

<!-- IF {{SPRINT_DURATION}} == "1 week" -->
**1-week sprint ceremony schedule:**
- Monday AM: Sprint planning (30 min)
- Daily: Standup (10 min)
- Friday PM: Demo (20 min) + Retrospective (30 min)
- Ceremony overhead: ~3 hours/week
<!-- ENDIF -->

<!-- IF {{SPRINT_DURATION}} == "2 weeks" -->
**2-week sprint ceremony schedule:**
- Sprint Day 1 AM: Sprint planning (60 min)
- Daily: Standup (10-15 min)
- Sprint Day 9: Demo (30 min)
- Sprint Day 10: Retrospective (60 min)
- Ceremony overhead: ~4.5 hours/2 weeks
<!-- ENDIF -->

<!-- IF {{SPRINT_DURATION}} == "3 weeks" -->
**3-week sprint ceremony schedule:**
- Sprint Day 1 AM: Sprint planning (60 min)
- Daily: Standup (10-15 min)
- Mid-sprint: Check-in on sprint goal (15 min)
- Sprint Day 14: Demo (30 min)
- Sprint Day 15: Retrospective (60 min)
- Ceremony overhead: ~6 hours/3 weeks
<!-- ENDIF -->

---

## Sprint Board Setup

### Board Columns

| Column | WIP Limit | Entry Criteria | Exit Criteria |
|--------|-----------|---------------|---------------|
| **Backlog** | No limit | Groomed and estimated | Selected for sprint |
| **To Do** | No limit | In sprint commitment | Work has started |
| **In Progress** | {{TEAM_SIZE}} x 1.5 | Developer has started work | PR submitted |
| **In Review** | {{TEAM_SIZE}} x 1 | PR submitted, CI passing | PR approved + merged |
| **Done** | No limit | Merged to main, tests passing | Verified in staging |

### WIP Limit Enforcement

Work-in-progress limits prevent the team from starting everything and finishing nothing.

- **In Progress WIP limit:** No team member should have more than 2 tasks in progress simultaneously. Ideally 1. Finish before starting.
- **In Review WIP limit:** If the review column is full, stop starting new work and review existing PRs first.
- **Violation protocol:** If WIP limits are exceeded, the standup facilitator raises it. The team decides what to pause.

---

## Sprint Metrics to Track

| Metric | How to Calculate | What It Tells You |
|--------|-----------------|-------------------|
| **Velocity** | Story points completed per sprint | Capacity for future planning |
| **Carry-over rate** | Incomplete items / total items | Planning accuracy |
| **Cycle time** | Time from "In Progress" to "Done" | Flow efficiency |
| **Sprint goal hit rate** | Sprints where goal achieved / total sprints | Goal-setting quality |
| **Unplanned work ratio** | Unplanned items / total items | Stability of sprint commitment |

**Healthy targets after 4+ sprints:**
- Velocity: consistent within +/- 20%
- Carry-over rate: < 15%
- Sprint goal hit rate: > 80%
- Unplanned work ratio: < 20%

---

## First Sprint Special Considerations

If this is Sprint 1 (no historical velocity):

1. **Estimate conservatively.** Commit to 60% of what you think you can do.
2. **Pick 1-2 high-priority items** and make them the sprint goal. Add smaller tasks as stretch.
3. **Expect the unexpected.** Environment setup, tooling issues, and integration surprises will eat time.
4. **Do not skip the retrospective.** Sprint 1 retro sets the tone for every retro after it.
5. **Document your actual hours per story point.** This calibrates future sprints.

After Sprint 1, adjust capacity using actual data instead of estimates.

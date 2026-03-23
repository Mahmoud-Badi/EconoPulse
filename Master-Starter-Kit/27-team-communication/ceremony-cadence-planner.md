# Ceremony Cadence Planner

> More ceremonies is not better. Fewer ceremonies is not better. The right ceremonies for your team size, maturity, and working style is the goal. This guide provides a decision tree that tells you exactly which ceremonies to adopt based on your team configuration, with time budgets to keep overhead in check.

---

## The Core Principle

**Start with the minimum. Add ceremonies only when pain points emerge.**

Every ceremony has a cost (time, energy, context-switching) and a benefit (alignment, learning, accountability). When the cost exceeds the benefit, the ceremony is waste. When the benefit exceeds the cost, the ceremony is infrastructure.

The cadence planner below starts you with the minimum viable ceremony set for your team size. As problems arise (miscommunication, repeated mistakes, alignment drift), you add specific ceremonies to address them. You never add a ceremony "because that's what Scrum says" — you add it because the team needs it.

---

## Decision Tree by Team Size

### Solo Developer

**Ceremonies:**
| Ceremony | Cadence | Duration | Purpose |
|----------|---------|----------|---------|
| Weekly self-review | Friday PM (or Monday AM) | 30 min | Reflect on what shipped, plan next week, catch drift |
| Monthly self-retrospective | Last Friday of month | 30 min | Identify patterns, adjust process, prevent burnout |
| Product decision log | Ongoing | 5 min per entry | Document decisions for future self and future team |

**What you do NOT need:**
- Daily standups (no one to stand up with)
- Sprint planning (your weekly review covers this)
- Sprint demos (demo to yourself during weekly review, or to a stakeholder monthly)
- Team health checks (use the solo version quarterly instead)

**When to add more:**
- Add a **monthly stakeholder update** when you have investors, clients, or advisors
- Add a **quarterly self-health check** when you have been solo for 3+ months (burnout prevention)
- Add a **design review** when you are about to make a significant architectural decision (recruit a peer for a one-time review)

**Weekly schedule:**

```
Monday:    [Deep work]
Tuesday:   [Deep work]
Wednesday: [Deep work]
Thursday:  [Deep work]
Friday:    [Deep work AM] [Weekly self-review 30 min PM]
```

**Total ceremony time:** ~1 hour/week (2.5% of a 40-hour week)

---

### 2-Person Team

**Ceremonies:**
| Ceremony | Cadence | Duration | Purpose |
|----------|---------|----------|---------|
| Async daily standup | Daily | 3 min to write, 3 min to read | Stay aligned on what each person is doing |
| Weekly planning session | Monday AM | 30 min | Set the week's priorities, divide work, identify blockers |
| Bi-weekly retrospective | Every 2 weeks, Friday PM | 45 min | Reflect and improve the process |
| Weekly stakeholder update | Friday PM | 15 min to write | Keep stakeholders informed proactively |
| Product decision log | Ongoing | 5 min per entry | Document decisions so they are not relitigated |

**What you do NOT need (yet):**
- Formal sprint planning (your weekly planning covers this)
- Sprint demos (combine with stakeholder update or do bi-weekly)
- Team health checks (discuss health informally in retros)
- 1-on-1s (you are talking to each other constantly)

**When to add more:**
- Add **sprint demos** when you have external stakeholders who need to see working software
- Add **design reviews** when either person is building something the other person will need to maintain
- Add a **quarterly health check** after 3+ months (formalize what was probably informal)

**Weekly schedule:**

```
Monday:    [Weekly planning 30 min AM] [Deep work]
Tuesday:   [Deep work] [Async standup post by 10am]
Wednesday: [Deep work] [Async standup post by 10am]
Thursday:  [Deep work] [Async standup post by 10am]
Friday:    [Deep work AM] [Retro 45 min bi-weekly PM] [Stakeholder update 15 min]
```

**Total ceremony time:** ~2 hours/week (2.5% of 80 person-hours)

---

### 3-5 Person Team

**Ceremonies:**
| Ceremony | Cadence | Duration | Purpose |
|----------|---------|----------|---------|
| Daily standup | Daily (sync or async) | 15 min (sync) or 5 min (async) | Alignment, blocker surfacing |
| Sprint planning | Start of each sprint | 60 min | Commit to sprint scope, assign tasks |
| Sprint review / demo | End of each sprint | 30 min | Show work to stakeholders, capture feedback |
| Sprint retrospective | End of each sprint | 60 min | Reflect and improve process |
| Weekly stakeholder update | Weekly | 15 min to write | Proactive stakeholder communication |
| Backlog grooming | Weekly or bi-weekly | 30 min | Prepare backlog for next sprint |
| Product decision log | Ongoing | 5 min per entry | Document significant decisions |

**What you may add based on need:**
- **1-on-1s** (bi-weekly, 25 min) — add when team lead has 3+ direct reports
- **Design reviews** (as needed, 50 min) — add when building complex features
- **Quarterly team health check** (quarterly, 60 min) — add after the first quarter together

**When to add more:**
- Add **1-on-1s** when team members start feeling disconnected or when career development conversations are needed
- Add **design reviews** when PRs are frequently rejected due to architectural disagreements
- Add **health checks** when you sense morale or energy issues that are not surfacing in retros

**Weekly schedule (2-week sprint example):**

```
Sprint Day 1 (Monday):
  [Sprint planning 60 min AM] [Standup 15 min after planning] [Deep work PM]

Sprint Days 2-4 (Tue-Thu):
  [Standup 15 min AM] [Deep work]

Sprint Day 5 (Friday):
  [Standup 15 min AM] [Backlog grooming 30 min PM] [Stakeholder update 15 min]

Sprint Days 6-8 (Mon-Wed):
  [Standup 15 min AM] [Deep work]

Sprint Day 9 (Thursday):
  [Standup 15 min AM] [Sprint demo 30 min PM]

Sprint Day 10 (Friday):
  [Standup 15 min AM] [Sprint retrospective 60 min PM] [Stakeholder update 15 min]
```

**Total ceremony time:** ~4-6 hours/2-week sprint (3-5% of 120-200 person-hours)

---

### 6+ Person Team

**Ceremonies:**
| Ceremony | Cadence | Duration | Purpose |
|----------|---------|----------|---------|
| Daily standup | Daily (sync or async) | 15 min | Alignment, blocker surfacing |
| Sprint planning | Start of each sprint | 60-90 min | Commit to sprint scope |
| Sprint review / demo | End of each sprint | 45 min | Show work, capture feedback |
| Sprint retrospective | End of each sprint | 60 min | Reflect and improve |
| Backlog grooming | Weekly | 50 min | Prepare backlog |
| Weekly stakeholder update | Weekly | 15 min to write | Proactive communication |
| 1-on-1s | Bi-weekly per person | 25 min each | Individual connection, career growth |
| Team health check | Quarterly | 60 min | Measure and improve team health |
| Technical design reviews | As needed | 50 min | Vet significant technical decisions |
| Product decision log | Ongoing | 5 min per entry | Document decisions |

**Additional considerations for 6+ teams:**
- **Cross-team sync** (weekly, 30 min) — if multiple sub-teams or squads exist
- **Quarterly planning** (quarterly, half-day) — align on quarterly goals and OKRs
- **All-hands / town hall** (monthly, 30 min) — broader team alignment if org is growing

**When sub-teams form:**
Once a team exceeds 8 people, split into sub-teams (squads) of 3-5. Each sub-team runs its own ceremonies. Add a weekly cross-team sync (30 min) for alignment.

**Weekly schedule (2-week sprint, 8-person team example):**

```
Sprint Day 1 (Monday):
  [Sprint planning 90 min AM] [Standup 15 min after planning]

Sprint Days 2-4 (Tue-Thu):
  [Standup 15 min AM] [1-on-1s scattered throughout week, 25 min each]
  [Design review as needed, 50 min]

Sprint Day 5 (Friday):
  [Standup 15 min AM] [Backlog grooming 50 min PM] [Stakeholder update]

Sprint Days 6-8 (Mon-Wed):
  [Standup 15 min AM] [Deep work] [1-on-1s continued]

Sprint Day 9 (Thursday):
  [Standup 15 min AM] [Sprint demo 45 min PM]

Sprint Day 10 (Friday):
  [Standup 15 min AM] [Sprint retrospective 60 min PM] [Stakeholder update]
```

**Total ceremony time:** ~8-12 hours/2-week sprint per person (4-5% of 240+ person-hours)

---

## Time Budget Summary

| Team Size | Ceremony Hours/Week (Per Person) | Work Hours/Week (Per Person) | Ceremony Ratio | Max Acceptable Ratio |
|-----------|--------------------------------|------------------------------|----------------|---------------------|
| 1 (solo) | 1 | 40 | 2.5% | 5% |
| 2 | 2 | 40 | 5% | 8% |
| 3-5 | 2.5-3 | 40 | 6-8% | 10% |
| 6-8 | 3-4 | 40 | 8-10% | 12% |
| 9+ | 4-5 | 40 | 10-12% | 15% |

**If ceremony time exceeds the max acceptable ratio, you have too many meetings.** Audit your ceremonies:

1. List every recurring meeting
2. For each meeting, ask: "If we stopped this meeting, what specific problem would occur?"
3. If you cannot name a specific problem, cancel the meeting
4. If the problem can be solved async, convert the meeting to an async process
5. If the meeting is necessary, can it be shorter? Fewer attendees? Less frequent?

---

## Ceremony Adoption Sequence

Do not adopt all ceremonies at once. Roll them out in this order:

### Phase 1: Foundation (Week 1)
- [ ] Daily standup (sync or async)
- [ ] Product decision log (start logging immediately)

### Phase 2: Planning (Week 2-3)
- [ ] Sprint planning (or weekly planning for teams < 3)
- [ ] Backlog grooming

### Phase 3: Feedback (Week 4-5)
- [ ] Sprint demo / showcase
- [ ] Sprint retrospective
- [ ] Stakeholder update

### Phase 4: Growth (Month 2+)
- [ ] 1-on-1s (when team > 3)
- [ ] Design reviews (when needed)
- [ ] Team health check (first quarter-end)

### Phase 5: Scale (When team > 6)
- [ ] Cross-team sync
- [ ] Quarterly planning
- [ ] Formal escalation protocol

---

## Calendar Template: Visual Weekly Schedule

### Small Team (3-5 People, 2-Week Sprints)

```
         Mon          Tue          Wed          Thu          Fri
      +------------+------------+------------+------------+------------+
 9AM  | Sprint     | Standup    | Standup    | Standup    | Standup    |
      | Planning   | (15 min)   | (15 min)   | (15 min)   | (15 min)   |
      | (60 min)   |            |            |            |            |
10AM  |            |            |            |            |            |
      |            | Deep Work  | Deep Work  | Deep Work  | Backlog    |
11AM  | Deep Work  |            |            |            | Grooming   |
      |            |            |            |            | (30 min)   |
12PM  | Lunch      | Lunch      | Lunch      | Lunch      | Lunch      |
      |            |            |            |            |            |
 1PM  | Deep Work  | Deep Work  | Deep Work  | Deep Work  | Deep Work  |
      |            |            |            |            |            |
 2PM  |            |            |            |            |            |
      |            |            |            |            |            |
 3PM  |            |            |            | Demo       | Retro      |
      |            |            |            | (30 min)   | (60 min)   |
 4PM  |            |            |            | (sprint    | (sprint    |
      |            |            |            |  end only) |  end only) |
 5PM  |            |            |            |            | Stakeholder|
      |            |            |            |            | update     |
      +------------+------------+------------+------------+------------+

Non-sprint-end weeks: Thu and Fri afternoons are deep work.
```

### Larger Team (6+ People, 2-Week Sprints)

```
         Mon          Tue          Wed          Thu          Fri
      +------------+------------+------------+------------+------------+
 9AM  | Sprint     | Standup    | Standup    | Standup    | Standup    |
      | Planning   | (15 min)   | (15 min)   | (15 min)   | (15 min)   |
      | (90 min)   |            |            |            |            |
10AM  |            | 1-on-1     |            | 1-on-1     | Backlog    |
      |            | (25 min)   | Deep Work  | (25 min)   | Grooming   |
11AM  | Deep Work  |            |            |            | (50 min)   |
      |            | Deep Work  |            | Design     |            |
12PM  | Lunch      | Lunch      | Lunch      | Review     | Lunch      |
      |            |            |            | (50 min    |            |
 1PM  | Deep Work  | Deep Work  | Deep Work  | as needed) | Deep Work  |
      |            |            |            |            |            |
 2PM  |            |            |            | Deep Work  |            |
      |            |            |            |            |            |
 3PM  |            |            |            | Demo       | Retro      |
      |            |            |            | (45 min)   | (60 min)   |
 4PM  |            |            |            | (sprint    | (sprint    |
      |            |            |            |  end only) |  end only) |
 5PM  |            |            |            |            | Stakeholder|
      |            |            |            |            | update     |
      +------------+------------+------------+------------+------------+

1-on-1s rotate across the week. Not everyone has one every week.
```

---

## Ceremony Health Audit

Run this audit quarterly. For each ceremony, answer:

| Question | Expected Answer | If Not |
|----------|----------------|--------|
| Does this ceremony have a clear purpose? | Yes — stated in one sentence | Redefine or cancel |
| Does every attendee need to be there? | Yes — each person contributes | Trim the invite list |
| Does the ceremony produce output? (decisions, action items, artifacts) | Yes — documented and tracked | Add structure or cancel |
| Is the ceremony the right length? | Yes — finishes on time without rushing | Adjust duration |
| Would the team miss it if we skipped it? | Yes — problems would emerge within 1-2 weeks | Keep it |
| Has anyone complained about this ceremony in the last month? | No | Investigate complaints and adjust |

### Red Flags That You Have Too Many Ceremonies

- Team members have less than 4 hours of uninterrupted deep work per day
- People regularly skip ceremonies or arrive late
- Action items from ceremonies are not completed
- Team describes ceremonies as "overhead" or "process theater"
- Ceremony time exceeds the max ratio for your team size (see time budget table)

### Red Flags That You Have Too Few Ceremonies

- Same miscommunication happens repeatedly
- Decisions are made and forgotten (or relitigated)
- New team members take weeks to understand what is happening
- Stakeholders are frequently surprised by the team's direction
- Team morale issues surface only when someone quits

---

## Transitioning Ceremony Cadence

When your team grows (or shrinks), adjust ceremonies:

### Growing from 1 to 2 People
1. Add async daily standups immediately
2. Add weekly planning session within the first week
3. Add bi-weekly retrospective after the first 2 weeks
4. Keep the product decision log

### Growing from 2-3 to 4-5 People
1. Switch from weekly planning to formal sprint planning
2. Add sprint demos
3. Add backlog grooming sessions
4. Consider adding 1-on-1s if you are the team lead
5. First team health check after 1 quarter together

### Growing from 5 to 6+ People
1. Consider splitting into sub-teams
2. Add cross-team sync
3. Add formal 1-on-1s for all direct reports
4. Add quarterly planning
5. Add design reviews as a standard process (not ad-hoc)

### Shrinking (Layoffs, Departures, End of Contract)
1. Immediately reduce ceremony frequency (cancel anything that feels like overhead)
2. Keep standups and retros (communication matters more when the team is stressed)
3. Consolidate roles (one person can facilitate multiple ceremonies)
4. Re-evaluate after 2 weeks and settle on a new cadence

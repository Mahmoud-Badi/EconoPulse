# Standup Templates

> The daily standup is the highest-frequency ceremony on any team. Done well, it takes 10 minutes and replaces a dozen interruptions. Done poorly, it wastes 30 minutes and teaches the team that meetings are theater. This guide provides three standup formats — pick the one that fits your team's working style.

---

## Format 1: Synchronous Standup

**Best for:** Co-located teams, teams in the same timezone, teams of 3-8 people.
**Duration:** 15 minutes maximum. Hard stop. No exceptions.
**Frequency:** Daily, same time every day.
**Medium:** In-person (standing) or video call (cameras on).

### The Three Questions

Every person answers three questions and only three questions:

1. **What did I complete since last standup?** — Reference specific task IDs from STATUS.md. Not "I worked on the backend" but "I completed TASK-042 (user settings API endpoint) and submitted PR #38."
2. **What will I work on before next standup?** — Again, specific task IDs. "Starting TASK-043 (notification preferences) and writing tests for the settings service."
3. **Do I have any blockers?** — Anything preventing progress. Be specific: "Waiting on API contract for notifications service from @backend-lead" not "I'm kind of stuck."

### Rules

| Rule | Why |
|------|-----|
| Stand up (if in person) | Physical discomfort keeps it short |
| 90 seconds per person maximum | 8 people x 90 seconds = 12 minutes |
| No problem-solving during standup | Say "take it offline" — schedule a separate 15-min huddle |
| No laptops open (if in person) | Forces attention and brevity |
| Reference task IDs from STATUS.md | Keeps standup connected to real work |
| Facilitator rotates weekly | Prevents one person from dominating |
| Start on time, even if people are missing | Teaches punctuality |
| Late arrivals do not get a recap | They read the notes or async summary |

### Facilitator Responsibilities

The weekly facilitator:

1. Starts the meeting at the scheduled time (do not wait for stragglers)
2. Calls on each person in order (rotate order to avoid "last person gets rushed")
3. Interrupts problem-solving with "take it offline"
4. Tracks blockers and assigns owners for resolution
5. Posts a 3-line summary to the team channel within 5 minutes of standup ending
6. Ends the meeting at 15 minutes regardless of completion

### Post-Standup Huddles

If a blocker or discussion topic comes up during standup:

1. Facilitator notes it: "Offline: [topic], [person A] + [person B]"
2. Standup continues
3. After standup, relevant people stay for a 5-15 minute huddle
4. Huddle results get posted to the team channel

### Standup Summary Format (Posted to Team Channel)

```
## Standup — [DATE]

**Completed:** TASK-042, TASK-039, PR #38 merged
**In Progress:** TASK-043, TASK-044, TASK-040 (in review)
**Blockers:**
- TASK-043: Waiting on notifications API contract (@backend-lead)
**Offline Huddles:**
- Database migration strategy: @dev-1 + @dev-2, 10:15am
```

---

## Format 2: Async Standup

**Best for:** Remote teams, teams across 2+ timezones, teams that prefer deep work mornings.
**Duration:** 2-3 minutes to write, skim all updates in 5 minutes.
**Frequency:** Daily, posted by a consistent time (e.g., "by 10am your local time").
**Medium:** Slack channel, Discord thread, GitHub Discussion, or dedicated standup tool.

### Template

Each team member posts daily in the designated channel:

```
**Yesterday**: Completed TASK-042 (user settings page), reviewed PR #38
**Today**: Starting TASK-043 (notification preferences), writing tests for settings service
**Blockers**: Waiting on API contract for notifications service (cc @backend-lead)
**Mood**: (optional team health signal)
```

### Mood Indicators (Optional)

A simple pulse check that surfaces burnout early:

| Indicator | Meaning |
|-----------|---------|
| Green circle | Good — productive, energized |
| Yellow circle | Okay — some friction but manageable |
| Red circle | Struggling — blocked, stressed, or overwhelmed |

If someone posts a red indicator two days in a row, the team lead should reach out privately. This is not a performance metric — it is a support signal.

### Async Standup Rules

1. **Post by the deadline.** If you miss it, post when you can — but respect the cadence.
2. **Read everyone else's update.** The standup only works if people actually read it. React with an emoji to show you read it.
3. **Reply in threads.** If you have a question about someone's update, reply in a thread — do not clutter the main channel.
4. **Keep it factual.** This is not a diary entry. Task IDs, PR numbers, specific blockers.
5. **Tag blockers explicitly.** If you are blocked by someone, `@mention` them. They should respond within 4 hours.
6. **Do not skip weekdays.** Even if you had a meeting-heavy day: "Yesterday: meetings all day, no coding progress. Today: catching up on TASK-043."

### Async Standup Channel Setup

```
Channel name: #standup-[team-name]
Channel topic: "Daily async standup. Post by 10am local time. Format: Yesterday / Today / Blockers / Mood"
Pinned message: The template above
Integrations: Geekbot or Standuply for automated reminders (optional)
```

### Tool Recommendations

| Tool | Cost | Best For |
|------|------|----------|
| Geekbot | $3/user/mo | Slack teams, automated reminders and reports |
| Standuply | $2/user/mo | Slack teams, includes async retro features |
| Discord threads | Free | Discord-based teams, manual posting |
| GitHub Discussions | Free | Open-source teams, everything-in-GitHub approach |
| Linear Updates | Included | Teams already using Linear for project management |
| Simple Slack channel | Free | Any team, no tooling overhead |

---

## Format 3: Weekly Standup

**Best for:** Solo developers, very async teams (3+ timezone spread), teams that meet less than daily.
**Duration:** 15-30 minutes (self-review) or 30 minutes (team meeting).
**Frequency:** Once per week, typically Monday morning or Friday afternoon.
**Medium:** Written document (solo) or short video call (team).

### Solo Developer Weekly Review

Every Friday (or Monday), spend 30 minutes answering:

```
## Weekly Review — Week of [DATE]

### This Week
- Completed: [list of completed tasks with IDs]
- Shipped: [anything that went to production]
- Learned: [one thing you learned this week]

### Metrics
- Tasks completed: [number]
- PRs merged: [number]
- Bugs fixed: [number]
- Hours of deep work: [estimate]

### Next Week
- Top 3 priorities:
  1. [task]
  2. [task]
  3. [task]
- Key deadline: [if any]

### Open Questions
- [Anything you need input on, even if it is just from your future self]

### Energy Level
- This week: [high / medium / low]
- Trend: [up / down / stable]
```

This doubles as a personal accountability tool and a breadcrumb trail for your future self. When someone asks "what happened in January?" you have 4-5 weekly reviews to reference.

### Team Weekly Standup

For very async teams that cannot do daily standups:

1. **Written updates** posted by Thursday EOD (same async format above, but weekly scope)
2. **30-minute sync call** on Friday to discuss blockers, align on next week
3. **Agenda:**
   - Round-robin: highlights and blockers (2 min per person)
   - Top blocker discussion (10 min)
   - Next week alignment (5 min)
   - Action items (5 min)

---

## Anti-Patterns

| Anti-Pattern | Symptom | Fix |
|-------------|---------|-----|
| **Status report to the manager** | Everyone faces the manager when speaking, not each other | Manager sits down / mutes. Team speaks peer-to-peer. |
| **Standup exceeds 15 minutes** | Someone is problem-solving or giving a monologue | Facilitator interrupts: "Take it offline." Hard stop at 15 min. |
| **Not referencing STATUS.md** | Vague updates: "I worked on stuff" | Require task IDs. If it is not in STATUS.md, it did not happen. |
| **Same person always speaks last** | Last person gets rushed or skipped | Rotate speaking order. Use reverse alphabetical, random, or round-robin. |
| **Async updates are novels** | 10-paragraph standup messages | Enforce the template. Three lines. Task IDs. That is it. |
| **Nobody reads async updates** | People post but nobody reacts or responds to blockers | Require emoji reactions. Track who reads. |
| **Standup at a bad time** | Team dreads the meeting because it interrupts deep work | Move standup to natural transition points: start of day, after lunch, or end of day. |
| **Skipping standup when "nothing happened"** | Standups become intermittent and lose value | Post anyway: "Yesterday: meetings, no code progress. Today: TASK-043." |
| **Standup becomes the only communication** | Team only talks at standup, not throughout the day | Standup is a sync point, not the only communication channel. Encourage async threads. |

---

## Choosing Your Format

```
Is your team in the same timezone (+/- 2 hours)?
  |
  +-- YES --> Is your team 2-8 people?
  |             |
  |             +-- YES --> Synchronous Standup
  |             +-- NO (1 person) --> Weekly Standup (solo review)
  |             +-- NO (9+ people) --> Split into sub-teams, each does Synchronous Standup
  |
  +-- NO --> Async Standup
              |
              +-- If team rarely overlaps --> Add a Weekly Standup sync call
```

---

## Measuring Standup Effectiveness

After 2 weeks of standups, ask the team:

1. Do I know what everyone is working on? (If no: updates are too vague)
2. Are blockers getting resolved within 24 hours? (If no: blocker escalation is broken)
3. Does standup take less than 15 minutes? (If no: facilitator is not enforcing rules)
4. Do I look forward to standup, or dread it? (If dread: format needs changing)
5. Has standup replaced ad-hoc status questions? (If no: team has not adopted the habit)

If three or more answers are negative, switch formats or revisit the anti-patterns list above.

# Sprint Plan Generator

**Purpose:** Generate sprint plans from the STATUS.md backlog, producing structured sprint documents with task assignments, capacity calculations, and risk assessments.

**Output:** Sprint plan documents in `dev_docs/sprints/`

---

## When to Run

Run this generator:

1. During Orchestrator Step 18.5 (Team Ceremonies Setup) to create the initial sprint plan
2. At the start of every new sprint thereafter
3. Available as a slash command: `/generate-sprint-plan`

---

## Inputs Required

| Input | Location | What It Provides |
|-------|----------|-----------------|
| STATUS.md | `{{STATUS_FILE_PATH}}` | Full task backlog with priorities and effort estimates |
| Previous Sprint | `dev_docs/sprints/sprint-{N-1}.md` | Velocity data, carryover tasks |
| Team Config | CONFIG → TEAM_SIZE | Available capacity |
| Sprint Duration | CONFIG → SPRINT_DURATION | Sprint length (default: 2 weeks) |
| Phase Index | `dev_docs/phase-index.md` | Current phase and phase goals |

---

## Generation Instructions

### Step 1: Calculate Capacity

```
Team capacity = TEAM_SIZE × available_days × focus_hours_per_day

Where:
  available_days = sprint_duration_in_weeks × 5 (workdays)
  focus_hours_per_day = 6 (accounts for meetings, breaks, context switching)

Example: 2 devs × 10 days × 6 hours = 120 hours available
```

Subtract ceremony time:
- Daily standups: 15 min × days × team_size
- Sprint planning: 1 hour
- Sprint review: 30 min
- Sprint retro: 1 hour
- Buffer for unexpected work: 10% of remaining capacity

### Step 2: Determine Velocity

If this is Sprint 1:
- Assume velocity = 70% of calculated capacity (conservative for new teams)
- Convert to story points if using points (1 point ≈ 4 hours for small teams)

If Sprint 2+:
- Read previous sprint document
- Calculate actual velocity: completed_points / planned_points
- Use trailing 3-sprint average if available
- Apply velocity to capacity: committable_work = capacity × velocity_percentage

### Step 3: Select Tasks from Backlog

Read STATUS.md and select tasks using this priority order:

1. **Carryover tasks** (incomplete from last sprint — these come first)
2. **Blocked-then-unblocked** (tasks that were waiting on dependencies now resolved)
3. **Phase-critical** (tasks required to complete the current phase)
4. **Highest priority** (P0 > P1 > P2 > P3)
5. **Dependency order** (if task B depends on task A, include A first)

Stop selecting when total effort reaches committed capacity.

### Step 4: Assign Tasks

For teams > 1:
- Distribute by expertise (backend tasks to backend dev, frontend to frontend dev)
- Balance workload (no team member >110% of per-person capacity)
- Pair complex tasks when possible
- Leave 1-2 "stretch goal" tasks at the bottom (nice-to-have if sprint goes well)

For solo developers:
- Order by dependency chain, then priority
- Mark top 80% as committed, bottom 20% as stretch goals

### Step 5: Identify Risks

For each sprint, assess:

| Risk Category | Check |
|---------------|-------|
| Dependencies | Any task blocked by external team, API, or third-party? |
| Knowledge gaps | Any task in unfamiliar technology/domain? |
| Scope creep | Any task with unclear acceptance criteria? |
| Technical debt | Any task touching fragile/untested code? |
| Availability | Any team member with planned time off? |

### Step 6: Generate Sprint Document

Create `dev_docs/sprints/sprint-{N}.md`:

```markdown
# Sprint {{SPRINT_NUMBER}}

> **Status:** Active | Completed
> **Duration:** {{SPRINT_DURATION}}
> **Dates:** {{START_DATE}} — {{END_DATE}}
> **Sprint Goal:** [One sentence defining sprint success]

---

## Capacity

| Team Member | Available Days | Focus Hours | Capacity |
|-------------|---------------|-------------|----------|
| {{MEMBER_1}} | {{DAYS}} | 6/day | {{HOURS}}h |
| {{MEMBER_2}} | {{DAYS}} | 6/day | {{HOURS}}h |
| **Total** | | | **{{TOTAL}}h** |

**Velocity factor:** {{VELOCITY}}% (based on [first sprint estimate / trailing average])
**Committable capacity:** {{COMMITTABLE}}h

---

## Sprint Goal

[One clear sentence: "By the end of this sprint, [specific outcome]"]

---

## Committed Tasks

| # | Task ID | Title | Effort | Priority | Assigned | Status |
|---|---------|-------|--------|----------|----------|--------|
| 1 | TASK-XXX | [title] | [S/M/L] | P0 | [name] | To Do |
| 2 | TASK-XXX | [title] | [S/M/L] | P1 | [name] | To Do |
| ... | | | | | | |

**Total committed effort:** {{HOURS}}h / {{COMMITTABLE}}h ({{PERCENT}}%)

---

## Stretch Goals (if time permits)

| Task ID | Title | Effort | Priority |
|---------|-------|--------|----------|
| TASK-XXX | [title] | [S/M/L] | P2 |

---

## Dependencies

| Task | Depends On | Status | Risk |
|------|-----------|--------|------|
| TASK-XXX | [dependency] | [resolved/pending] | [low/med/high] |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| [risk] | [low/med/high] | [low/med/high] | [plan] |

---

## Sprint Review (fill at end of sprint)

| Metric | Planned | Actual |
|--------|---------|--------|
| Tasks completed | {{PLANNED}} | |
| Story points | {{POINTS}} | |
| Velocity | | |
| Carryover tasks | | |

### What shipped:
-

### What didn't ship (and why):
-

### Carryover to next sprint:
-
```

---

## Output Files

| File | Location |
|------|----------|
| Sprint plan | `dev_docs/sprints/sprint-{N}.md` |
| Updated STATUS.md | `{{STATUS_FILE_PATH}}` (mark tasks as "In Progress" for current sprint) |

---

## Presentation

```
SPRINT {{N}} PLAN GENERATED:
  Sprint goal: [goal]
  Duration: {{SPRINT_DURATION}} ({{START_DATE}} — {{END_DATE}})
  Capacity: {{TOTAL}}h ({{VELOCITY}}% velocity)
  Tasks committed: [X] tasks, [Y]h estimated
  Stretch goals: [Z] tasks
  Risks identified: [N]

  Start: dev_docs/sprints/sprint-{N}.md
```

---

## Rules

- **Never commit more than 90% of calculated capacity.** Leave room for surprises.
- **Carryover tasks always come first.** Finishing started work beats starting new work.
- **Sprint goals must be specific and testable.** "Make progress on features" is not a goal. "Ship user settings page with tests" is.
- **Update STATUS.md immediately** after generating the sprint plan — mark committed tasks as sprint-assigned.
- **Solo developers still benefit from sprint planning.** It forces prioritization and prevents scope creep.

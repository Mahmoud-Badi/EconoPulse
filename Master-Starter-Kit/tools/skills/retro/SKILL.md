---
name: retro
description: |
  Engineering retrospective with velocity stats, commit analysis, and trend tracking.
  Analyzes git history, work log entries, and sprint state across any date range.

  Use when:
  - User says "retro", "weekly retro", "/retro", "what did I ship"
  - User says "show me stats", "velocity", "how productive was this week"
  - User wants to review work patterns, session cadence, or category breakdown
  - End of a sprint or work week

  Examples:
  - "/retro" — last 7 days (default)
  - "/retro 24h" — last 24 hours
  - "/retro 14d" — last 14 days
  - "/retro 30d" — last 30 days
  - "/retro compare" — compare this period vs prior same-length period
---

# /retro — Engineering Retrospective

Generate a comprehensive engineering retrospective analyzing commit history, work patterns, session cadence, and velocity trends. Reads from existing data sources — produces narrative stats that `/log` and `/weekly-report` don't cover.

## How This Differs From Other Tools

| Tool | Scope | Output |
| --- | --- | --- |
| `/log` | Single session | Appends one entry to work-log.md |
| `/weekly-report` | One calendar week | HTML file with metric cards |
| `/retro` | Any date range | Narrative stats summary in terminal |

`/retro` never writes to work-log.md or generates HTML. It reads and analyzes.

---

## Arguments

Parse `$ARGUMENTS` to determine the time window:

- No argument → 7 days
- `24h` → last 24 hours
- `Nd` → last N days (e.g., `14d`, `30d`)
- `compare` → compare current window vs prior same-length window (default 7d)
- `compare Nd` → compare with explicit window

If the argument doesn't match these patterns, show usage and stop:

```
Usage: /retro [window]
  /retro              — last 7 days (default)
  /retro 24h          — last 24 hours
  /retro 14d          — last 14 days
  /retro 30d          — last 30 days
  /retro compare      — compare this period vs prior period
  /retro compare 14d  — compare with explicit window
```

**Midnight-aligned windows:** For day units, compute an absolute start date at local midnight. Use `--since="YYYY-MM-DDT00:00:00"` for git log queries. For hour units, use `--since="N hours ago"`.

---

## Step 1: Gather Raw Data

Detect the default branch first:

```bash
git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main"
```

Then run ALL of these git commands **in parallel** (they are independent):

```bash
# 1. Commits with stats
git log origin/<default> --since="<window>" --format="%H|%aN|%ae|%ai|%s" --shortstat

# 2. Per-commit numstat for test vs production LOC
git log origin/<default> --since="<window>" --format="COMMIT:%H|%aN" --numstat

# 3. Commit timestamps for session detection
git log origin/<default> --since="<window>" --format="%at|%aN|%ai|%s" | sort -n

# 4. File hotspots (most frequently changed)
git log origin/<default> --since="<window>" --format="" --name-only | grep -v '^$' | sort | uniq -c | sort -rn | head -20

# 5. Per-author commit counts
git shortlog origin/<default> --since="<window>" -sn --no-merges

# 6. Test file count in repo
find . -name '*.test.*' -o -name '*.spec.*' -o -name '*_test.*' -o -name '*_spec.*' 2>/dev/null | grep -v node_modules | wc -l

# 7. Test files changed in window
git log origin/<default> --since="<window>" --format="" --name-only | grep -E '\.(test|spec)\.' | sort -u | wc -l
```

Also read these files (if they exist):

```bash
# Work log for session count
cat dev_docs/weekly-reports/work-log.md 2>/dev/null || true

# Sprint state for task completion
ls .gsd/sprints/ 2>/dev/null || true
cat .gsd/state.json 2>/dev/null || true

# Kit feedback candidates
ls dev_docs/kit-feedback/pending/ 2>/dev/null | wc -l || echo "0"
```

---

## Step 2: Metrics Table

Calculate and present:

```
┌─────────────────────────────────────────────┐
│  RETRO — [start date] to [end date] ([Nd])  │
├─────────────────────────┬───────────────────┤
│ Commits to default      │ N                 │
│ Contributors            │ N                 │
│ Total insertions        │ +N                │
│ Total deletions         │ -N                │
│ Net LOC                 │ +/-N              │
│ Test LOC (insertions)   │ N                 │
│ Test LOC ratio          │ N%                │
│ Active days             │ N / N possible    │
│ Sessions logged         │ N (from work log) │
│ Avg LOC / session       │ N                 │
│ File hotspot            │ [most-changed]    │
│ Sprint tasks completed  │ N (if GSD active) │
│ Kit feedback candidates │ N pending         │
└─────────────────────────┴───────────────────┘
```

**Contributor leaderboard** (immediately below):

```
Contributor          Commits    +/-           Top Area
You (name)                32   +2400/-300    src/services/
alice                     12   +800/-150     src/components/
```

Current user (from `git config user.name`) always appears first, labeled "You (name)". Sort others by commits descending.

---

## Step 3: Commit Time Distribution

Show hourly histogram in local time:

```
Hour  Commits  ████████████████
 08:    2      ██
 09:    5      █████
 10:    8      ████████
 ...
```

Call out:
- Peak productive hours
- Dead zones
- Late-night clusters (after 10pm) — flag as potential burnout signal
- Whether pattern is bimodal (morning/evening) or continuous

---

## Step 4: Work Session Detection

Detect sessions using **45-minute gap** threshold between consecutive commits.

For each session:
- Start/end time
- Number of commits
- Duration in minutes

Classify:
- **Deep sessions** (50+ min, 5+ commits) — sustained focus
- **Burst sessions** (< 20 min, 1-3 commits) — quick fixes
- **Standard sessions** (everything else)

Report session mix: "8 sessions detected: 3 deep, 2 standard, 3 burst"

---

## Step 5: Work Category Breakdown

Classify commits by message patterns:

| Category | Pattern Match |
| --- | --- |
| Features | `feat:`, `add`, `implement`, `create`, `build` |
| Fixes | `fix:`, `bug`, `patch`, `resolve`, `hotfix` |
| Refactoring | `refactor:`, `clean`, `simplify`, `restructure` |
| Docs | `docs:`, `readme`, `document`, `comment` |
| Tests | `test:`, `spec`, `coverage` |
| Infrastructure | `ci:`, `build:`, `config`, `deploy`, `infra` |
| Kit/Planning | `kit`, `spec`, `template`, `orchestrator`, `planning` |

Show as a simple bar chart:

```
Features       ████████████  12 (35%)
Fixes          ██████         6 (18%)
Kit/Planning   █████          5 (15%)
Tests          ████           4 (12%)
Docs           ███            3 (9%)
Refactoring    ██             2 (6%)
Infra          ██             2 (6%)
```

---

## Step 6: Velocity Trends (Compare Mode)

**Only if `compare` argument was provided.**

Run the same data gathering for the prior window (e.g., if current is last 7d, prior is 7-14d ago).

Present side-by-side:

```
                    This Period    Prior Period    Delta
Commits                   34            28        +21%
Net LOC               +2,400        +1,800        +33%
Sessions                   8             6        +33%
Test ratio               35%           28%         +7pp
Active days              5/7           4/7          +1
Deep sessions            3/8           2/6        +17%
```

Add a one-sentence velocity narrative: "Shipping velocity increased 33% week-over-week with stronger test coverage. Deep session ratio is healthy."

---

## Step 7: Narrative Summary

End with a 3-5 sentence human-readable summary:

> **This week in [project name]:** Shipped [N] commits across [N] sessions over [N] active days. Main focus was [top category] ([N]% of commits), with [notable achievement]. Test coverage ratio is [N]% — [assessment]. [One forward-looking observation about work patterns or velocity trend.]

If `compare` mode: include the trend direction in the narrative.

---

## Output Rules

- All output goes to terminal — no files written
- Use the table/chart formats above for consistency
- Times in local timezone (do not set TZ)
- If a data source doesn't exist (no work-log.md, no .gsd/, no kit-feedback/), skip that metric silently — don't show "N/A" rows
- If git has zero commits in the window, say so and exit: "No commits found in the last [N] days."

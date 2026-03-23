# Session Completion Checklist

> **Purpose:** Mandatory 7-step protocol executed at EVERY session boundary — no exceptions.
> **When:** Before ending any Claude Code conversation, at every Session Boundary (SB-1 through SB-6), and before any context window refresh.
> **Golden Rule:** "{{GOLDEN_RULE_STATEMENT}}"

---

## The Checklist

Complete ALL 7 steps in order. Do not skip any step. Do not end the session until all boxes are checked.

### Step 1: Update STATUS.md

- [ ] Open `dev_docs/STATUS.md`
- [ ] Toggle checkboxes for all tasks/subtasks completed this session
- [ ] Verify task counts in the header match actual checkbox counts
- [ ] Verify phase progress percentages are accurate

**Proof:** STATUS.md diff showing updated checkboxes and counts.

### Step 2: Update handoff.md

- [ ] Open `dev_docs/handoff.md`
- [ ] Replace the "Last Session" section with what was done THIS session
- [ ] Update "Next Actions" with the exact first thing the next session should do
- [ ] List any decisions made and their rationale
- [ ] List any blockers or open questions
- [ ] List all files created or modified this session

**Proof:** handoff.md contains current-session content, not stale content from a previous session.

### Step 3: Append to DEVLOG.md

- [ ] Open `dev_docs/DEVLOG.md`
- [ ] Append a new entry with today's date and session number
- [ ] Include: tasks completed, time spent, key decisions, problems encountered
- [ ] Include: files created/modified (with paths)

**Proof:** DEVLOG.md has a new entry dated today.

### Step 4: Sync Master Tracker

- [ ] Open `dev_docs/tracker/master-tracker.md` (if it exists)
- [ ] Update subtask statuses to match work completed
- [ ] Verify task counts match STATUS.md
- [ ] Run `scripts/check-tracker.js` if available — zero discrepancies required

**Proof:** `check-tracker.js` output shows PASS, or manual verification that counts match.

### Step 5: Persist Session Context

- [ ] Open `dev_docs/session-context.md`
- [ ] Record any architecture decisions made this session (with reasoning)
- [ ] Record any scope changes or deferred items
- [ ] Record the user's exact words on any preference or direction change
- [ ] Record any rejected alternatives and why they were rejected

**Proof:** session-context.md contains entries from this session.

### Step 6: Verify Client Log

- [ ] Open `dev_docs/client-log/week-{{CURRENT_WEEK}}.md` (if client project)
- [ ] Verify client log entries match DEVLOG entries for this session (every completed task has a corresponding client log entry)
- [ ] Verify developer attribution is correct on all entries
- [ ] Verify the milestone dashboard header is current (progress percentages match STATUS.md)

**Proof:** Client log weekly task count matches DEVLOG entries for the session. Developer names are non-empty.

### Step 7: Echo the Golden Rule

- [ ] State the project's Golden Rule in your final message
- [ ] Confirm all 6 steps above are complete
- [ ] Announce: "Session boundary reached. You can safely start a new conversation."

---

## What Happens If You Skip This

1. The next session starts with stale context
2. The agent wastes 30+ minutes reconstructing what happened
3. STATUS.md lies about progress
4. Master tracker diverges from reality
5. Decisions are lost and relitigated
6. The user loses trust in the system

**This checklist takes 2-3 minutes. Skipping it costs 30+ minutes next session. Always complete it.**

---

## Quick Reference

| State File | What to Update | Location |
|-----------|---------------|----------|
| STATUS.md | Task checkboxes + counts | `dev_docs/STATUS.md` |
| handoff.md | Last session + next actions | `dev_docs/handoff.md` |
| DEVLOG.md | Append work entry | `dev_docs/DEVLOG.md` |
| master-tracker.md | Subtask statuses | `dev_docs/tracker/master-tracker.md` |
| session-context.md | Decisions + reasoning | `dev_docs/session-context.md` |
| client-log | Task entries + developer attribution | `dev_docs/client-log/week-NN.md` |

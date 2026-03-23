---
name: context-anchor
description: Before context compaction, inject critical process reminders that survive the compression. Prevents progressive discipline decay.
event: PreCompact
---

# Context Anchor Hook

Injects critical process discipline reminders into the conversation immediately before context compaction. These reminders become part of the compressed context, ensuring process discipline survives even after aggressive compaction drops earlier instructions.

## Trigger

Activates on the **PreCompact** event — right before Claude Code compresses the conversation context to reclaim token space.

## Behavior

Output the following anchor block. This text is designed to be high-signal and concise so the compaction algorithm retains it:

```
CONTEXT ANCHOR — PROCESS DISCIPLINE REMINDERS
==============================================
MANDATORY after EVERY task/subtask completion:
1. Update dev_docs/STATUS.md (toggle checkbox, update phase %, update active task)
2. Update dev_docs/handoff.md (what was done, what's next, any blockers)
3. Append to dev_docs/DEVLOG.md (timestamped entry: task ID, outcome, files changed)
4. Update dev_docs/tracker/master-tracker.md (subtask status, if file exists)
5. Update dev_docs/CONTEXT-RECOVERY.md (current state, if file exists)

MANDATORY after EVERY plan modification (new features, phases, tasks, deferrals):
1. Update dev_docs/STATUS.md (add/remove tasks, update phase counts)
2. Update dev_docs/tracker/master-tracker.md (add/remove subtask rows, if file exists)
3. Update dev_docs/tracker/dependency-map.md (update dependency graph, if file exists)
4. Update dev_docs/tracker/timeline.md (assign to weeks, if file exists)
5. Update dev_docs/handoff.md (note plan change under Key Decisions)
6. Append to dev_docs/DEVLOG.md (timestamped plan change entry)
Or run /plan-changed to update all trackers automatically.
The plan-change-detector hook will auto-propagate if you forget.

MANDATORY after context compaction or new session start:
1. Read dev_docs/ARCH-ANCHOR.md FIRST (system understanding — what we're building and why)
2. Read dev_docs/handoff.md (what was done, what's next)
3. Read dev_docs/STATUS.md (progress dashboard)
4. Read dev_docs/DEVLOG.md (last 3 entries only)
5. Run /verify-context to prove understanding before doing any work
6. If user provides an answer to a previous question: read handoff.md Blockers, acknowledge the question, confirm resolution, update handoff.md, THEN continue

Before EVERY git commit:
- Verify STATUS.md, handoff.md, and DEVLOG.md are staged
- If they aren't staged, update and stage them BEFORE committing

After EVERY feature completion:
- Run quality-gate skill (minimum 6.0/10 to pass)
- Run /code-review before final commit
- Update the relevant service hub file in dev_docs/services/

PROCESS RULES:
- NEVER skip state file updates. They are part of the task, not overhead.
- NEVER claim "done" without proof artifacts (test output, screenshots, reports).
- NEVER batch multiple tasks before updating state files. One task = one update cycle.
- If unsure what to do next, read dev_docs/handoff.md — it has the answer.
- If resuming after a break, read dev_docs/handoff.md and dev_docs/STATUS.md first.
- If ARCH-ANCHOR.md exists, it is the PRIMARY source of system understanding. Trust it over memory.
- After modifying schema, auth, API contracts, or service boundaries: update ARCH-ANCHOR.md.

Current state files to maintain:
- dev_docs/STATUS.md        → Task dashboard (what's done, what's active)
- dev_docs/handoff.md       → Session bridge (last done, next action, blockers)
- dev_docs/DEVLOG.md        → Work log (timestamped history of all work)
- dev_docs/tracker/         → Master tracker (subtask-level tracking)

Reference: 03-documentation/state-files/POST-TASK-PROTOCOL.md
==============================================
```

## Rules

- **Always output the full anchor** — do not abbreviate or summarize
- **Output only this block** — no additional commentary or explanation
- **Idempotent** — outputting this multiple times is fine; it's the same content each time
- **No file I/O** — this hook only outputs text, it does not read or write files
- **Fast** — instant output, no computation needed

## Why This Exists

Context compaction is the primary cause of progressive discipline decay. When Claude Code compresses a long conversation:

1. Early instructions about process discipline get dropped (lower signal-to-noise ratio)
2. Recent code context is retained (higher signal-to-noise ratio)
3. The result: Claude remembers WHAT it was building but forgets HOW it should track progress

This hook ensures that process reminders are injected at the exact moment before compaction, giving them maximum recency and therefore maximum survival probability in the compressed output.

## Compaction Survival Design

The anchor block is designed with compaction survival in mind:

- **Short, dense format** — bullet points, not paragraphs
- **Action-oriented** — "Update X" not "You should consider updating X"
- **File paths included** — concrete references survive better than abstract concepts
- **Repetition of key rules** — "NEVER skip" appears multiple times for emphasis
- **Structured with clear delimiters** — the `======` lines signal "important block"

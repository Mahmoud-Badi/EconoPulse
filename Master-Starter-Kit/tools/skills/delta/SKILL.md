---
name: delta
description: Start a new Delta TMS V3 coding session. Reads project status, shows what's next, and gets you coding.
---

# /delta - Delta TMS V3 Session Start

Quick session startup. Read status, show next task, start coding.

> **Note:** This skill is configured for Delta TMS V3. Customize the file paths below for your project.

## Steps

1. **Read these two files** (in parallel):
   - `V3/STATUS.md` — current phase, progress counts, active task
   - `V3/.claude/handoff.md` — what was done last, exact next action

2. **Run `git log --oneline -5`** in the V3 directory

3. **Present the briefing:**

```
## Delta TMS V3 - Session Briefing

**Phase:** {current phase}
**Next task:** {active task from STATUS.md}
**Progress:** {key counts — tables, pages, components, tests}

### Last session
{1-2 lines from handoff.md}

### What's next
{Next exact action from handoff.md — be specific}

### Recent commits
{last 3-5 commits}

Starting now: {first concrete action}
```

4. **Immediately begin working** on the next task — do NOT wait for user confirmation, do NOT ask "ready?", do NOT ask "should I start?", do NOT pause after the briefing. The briefing and the first action happen in the same response. Start writing code right away.

# Session Ritual

## The Problem This Solves

Without a start/end ritual, every Claude session begins with re-discovery. Claude reads the codebase, makes assumptions about what's been done, and potentially conflicts with decisions from previous sessions. On a 320+ task project, this re-orientation can waste 20+ minutes per session and introduce architectural drift.

The ritual takes 2 minutes and eliminates this entirely.

## The Four State Files

These files bridge sessions. They are the shared memory between your past self, your present self, and Claude:

| File | Purpose | Updated By |
|------|---------|------------|
| `STATUS.md` | Phase progress, active task, counts | `/session-end` |
| `handoff.md` | What to do next session (specific task + context) | `/session-end` |
| `DEVLOG.md` | Historical log of what was done each session | `/session-end` |
| `CLAUDE.md` | AI context -- architecture, patterns, lessons | `/revise-claude-md` when needed |

**Rule:** Never manually edit these files during a session. The custom skills handle formatting and consistency. Manual edits cause format drift that breaks the skills.

---

## Starting a Session

### Step 1: Run `/session-start`

```
/session-start
```

This skill reads `STATUS.md` and `handoff.md`, then reports:
- Current phase and overall progress
- Last session's work summary
- The specific next task queued in handoff.md
- Any blockers or notes from the previous session

**Why:** Claude now has full context without reading every file in the project. It knows exactly where things left off.

### Step 2: Run `/phase-check`

```
/phase-check
```

This skill reports:
- Remaining tasks in the current phase
- Health status (any failing tests, type errors, build issues)
- Dependencies that might affect the next task

**Why:** Even if handoff.md says "implement X next," there might be a failing test from the last session that needs fixing first. Phase-check catches this.

### Step 3: Query Context7 for Relevant Docs

If the next task involves a library or pattern you haven't used recently:

```
Use context7 MCP to look up: [library/pattern] latest docs
```

Examples:
- About to implement drag-drop? Query `dnd-kit` docs
- About to add real-time? Query `SSE` + your framework docs
- About to add auth? Query `better-auth` docs

**Why:** Library APIs change. Context7 pulls live documentation so Claude doesn't hallucinate deprecated APIs.

### Step 4: Confirm with User

Claude should explicitly confirm before starting work:

```
"Next task is [X] from handoff.md. Current phase is [Y] with [N] tasks remaining.
Ready to proceed?"
```

**Why:** The user might have changed priorities, encountered a production bug, or want to focus on something different. A 5-second confirmation prevents building the wrong thing.

---

## During a Session

### Keep the Rhythm

- **One task at a time.** Finish it, verify it, then move to the next.
- **Test after every meaningful change.** Don't batch testing to the end.
- **If you discover a new lesson** (a gotcha, a pattern), note it immediately. You'll add it to CLAUDE.md at session end.

### When You Hit a Blocker

1. Document the blocker clearly (what you tried, what failed, what error)
2. If it's a 5-minute fix, fix it now
3. If it's a rabbit hole (30+ minutes), stop -- note it in handoff.md and move to the next task
4. Never silently skip a blocker. It will come back worse.

---

## Ending a Session

### Step 1: Run All Checks

```bash
pnpm test        # unit tests
pnpm typecheck   # TypeScript strict mode
pnpm build       # full production build
```

**All three must pass.** If any fail, fix them before ending the session. Leaving a broken build for the next session is a trap -- the next session starts with debugging instead of building.

### Step 2: Fix Any Failures

If tests fail: fix them now. Even if it takes 10 extra minutes, a clean state saves 20 minutes next session.

If you absolutely cannot fix something before ending:
- Document the failure clearly in handoff.md
- Include the exact error message
- Include what you tried
- Mark the task as "blocked" not "done"

### Step 3: Run `/session-end`

```
/session-end
```

This skill:
- Updates `STATUS.md` with completed tasks and new counts
- Updates `handoff.md` with the next task and any context
- Appends to `DEVLOG.md` with a session summary

**Why:** The next session (possibly days later, possibly with a different Claude context) needs to pick up exactly where you left off.

### Step 4: Commit Changes

```
/commit
```

Or manually:

```bash
git add -A
git commit -m "feat(domain): description of what was done"
```

**Why:** Uncommitted changes are invisible to future sessions. A clean commit history also serves as a backup and audit trail.

### Step 5: Update CLAUDE.md (If Needed)

If you discovered new patterns, gotchas, or lessons during the session:

```
/revise-claude-md
```

This skill reviews CLAUDE.md and integrates new knowledge without breaking the existing structure.

**When to update:**
- Found a library gotcha (e.g., "Better Auth requires `name` + `image` on users table")
- Established a new pattern (e.g., "All forms use zodResolver with shared schemas")
- Changed architecture (e.g., "Switched from middleware.ts to proxy.ts for Next.js 16")

**When NOT to update:**
- Normal feature completion (that goes in DEVLOG.md)
- Temporary workarounds (those are session-specific, not project-wide)

---

## The 2-Minute Investment

| Action | Time |
|--------|------|
| `/session-start` | 15 seconds |
| `/phase-check` | 15 seconds |
| Context7 query | 30 seconds |
| User confirmation | 10 seconds |
| **Total start** | **~70 seconds** |

| Action | Time |
|--------|------|
| Run checks | 30 seconds |
| `/session-end` | 15 seconds |
| `/commit` | 15 seconds |
| `/revise-claude-md` (if needed) | 30 seconds |
| **Total end** | **~60-90 seconds** |

**Total ritual: ~2.5 minutes per session.**

This prevents: re-orientation waste (20 min), conflicting decisions (hours of rework), broken builds bleeding across sessions (30 min debugging), and lost lessons (repeated mistakes).

---

## Anti-Patterns

| Anti-Pattern | Consequence |
|-------------|-------------|
| Skip `/session-start`, just start coding | Build the wrong thing, conflict with previous decisions |
| Skip `/session-end`, just close the editor | Next session has no handoff, wastes 20 min re-orienting |
| Leave failing tests at session end | Next session starts debugging instead of building |
| Manually edit STATUS.md | Format drift breaks the `/phase-check` skill |
| Never update CLAUDE.md | Lessons are lost, same mistakes repeat |
| Update CLAUDE.md every session | Bloat -- it should stay lean (~80-100 lines) |

---

## Ultra TMS Enhancements (Battle-Tested Rules)

### Max 6 Files Before Coding

**Rule:** Read at most 6 files before you start writing code. If you need more context, you're doing too much in one task.

**The 6 files:**
1. STATUS.md — where are we?
2. handoff.md — what's next?
3. Task file — what exactly to do?
4. Service hub — what's the service context?
5-6. Code files — the actual files you'll modify

**Why:** More than 6 files causes context overload. AI starts hallucinating connections between unrelated code. Keep it focused.

### Context Headers

Every task file should list 5-8 files to read before starting. This is the task's "context header":

```markdown
## Context (read these before starting)
- `STATUS.md` — current phase and sprint
- `dev_docs/services/auth.md` — service hub
- `apps/api/src/modules/auth/auth.service.ts` — main service file
- `apps/api/src/modules/auth/auth.controller.ts` — endpoint definitions
- `apps/web/app/login/page.tsx` — current login page
```

### AI Agent Handoff Protocol

When ending a session that will be picked up by a different AI agent (or a fresh context):

**Sending agent must:**
1. Complete the current task fully OR document partial state in STATUS.md
2. Update handoff.md with specific next steps (not vague "continue working on X")
3. List any gotchas discovered ("the endpoint returns 201 not 200", "the hook needs unwrap()")
4. Note any files that were modified but not yet tested
5. Never assume the receiving agent has any context beyond what's written

**Receiving agent must:**
1. Read STATUS.md -> handoff.md -> task file -> service hub -> code files (in that order)
2. Never assume the previous agent finished its work
3. Always re-read modified files (don't trust descriptions of changes)
4. Run tests before making new changes (verify clean state)

### Three-Way Verification at Session End

Before marking a task as complete:
1. **Check code** — does the implementation match the task requirements?
2. **Check hub** — is the service hub updated with new endpoints/components/routes?
3. **Check tests** — do tests pass and cover the new functionality?

All three must agree. If the hub says 5 endpoints but code has 7, update the hub.

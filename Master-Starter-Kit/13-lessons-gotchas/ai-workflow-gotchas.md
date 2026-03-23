# AI Workflow Gotchas

> Hard-won lessons about working with AI coding assistants (Claude Code, Cursor, Copilot) on real projects. These apply regardless of which AI tool you use.

## 1. Write Tool Requires Read First

**The trap:** Trying to edit or overwrite a file the AI hasn't read in the current context.

**What happens:** The Write tool fails with an error. Even if the file was read earlier in a long conversation that got compacted, it needs to be read again.

**The fix:** Always Read a file before Writing to it. This is a hard requirement, not a suggestion.

```
# WRONG - will fail
Write file.ts with new content

# RIGHT
Read file.ts
Write file.ts with new content
```

**Why it matters:** In long sessions, context compaction removes earlier file reads. The tool enforces a fresh read to prevent blind overwrites.

---

## 2. Context Compaction Loses Details

**The trap:** Assuming the AI remembers everything from earlier in a long conversation.

**What happens:** After ~50-100 tool calls, earlier messages get compressed. Specific code snippets, error messages, and file contents are lost. The AI may "forget" decisions made earlier.

**The fix:** Use the anti-context-rot state files:
- `STATUS.md` — Current phase and progress (source of truth)
- `handoff.md` — What to do next (session continuity)
- `DEVLOG.md` — Historical record (what was done when)
- `CLAUDE.md` — Persistent AI context (always loaded)

**Pattern:** Write important decisions to these files immediately. Don't rely on conversation memory for anything that matters beyond 20 minutes.

---

## 3. One Feature at a Time

**The trap:** Asking the AI to build multiple features simultaneously in a single session.

**What happens:** Context gets polluted with multiple incomplete features. The AI loses track of which feature it's working on, mixes up file paths, and produces inconsistent code.

**The fix:** Complete one feature fully (schema → API → UI → tests → verify) before starting the next. Mark it done in STATUS.md. Then start the next one.

**Exception:** Parallel agents can work on independent features, but only if they share no state (different database tables, different routes, different components).

---

## 4. Parallel Agent Limits

**The trap:** Launching too many parallel agents (8+) assuming more = faster.

**What happens:** Rate limits hit, agents compete for API quota, some agents get "You've hit your limit" errors before completing. Work is partially done with no clear record of what completed.

**The fix:**
- **Documentation tasks:** 4-6 agents max (they're write-heavy, low API competition)
- **Code generation tasks:** 2-3 agents max (they need more back-and-forth)
- **Research tasks:** 3-4 agents max
- Always check agent outputs — "completed" status doesn't guarantee the work finished if rate limits were hit

**Pattern:** After parallel agents complete, run a gap-check to verify all expected outputs exist.

---

## 5. Verify Before Claiming Done

**The trap:** The AI says "Done! All tests pass!" without actually running the tests.

**What happens:** The AI makes optimistic claims based on its understanding of the code, not on actual execution results. Tests may be failing, the build may be broken, or features may not work as described.

**The fix:** Require evidence before accepting completion claims:
```
# The /verify skill enforces this:
1. pnpm typecheck    → must see "0 errors"
2. pnpm test         → must see "X passed, 0 failed"
3. pnpm lint         → must see "No errors"
4. pnpm build        → must see "Build completed"
5. Visual check      → must see screenshot/Playwright result
```

**Rule:** No completion claims without fresh terminal output. "I believe it works" is not evidence.

---

## 6. Counts-After-Each-Step

**The trap:** Losing track of project progress in long multi-phase projects.

**What happens:** After 100+ tasks across 10+ phases, nobody knows the actual state. "How many routers exist?" "How many tests pass?" "What's the total line count?" Answers become guesses.

**The fix:** After every step that changes project state, update counts:

```markdown
## Counts After Step 3.2

| Metric | Count |
|--------|-------|
| Schema tables | 14 |
| Seed records | 1,300+ |
| tRPC routers | 12 |
| tRPC procedures | 67 |
| React components | 45 |
| Pages/routes | 30+ |
| Unit tests | 89 (89 pass) |
| E2E scenarios | 12 |
| TypeScript errors | 0 |
| Build status | passing |
```

**Why:** Vibes-based progress tracking fails at scale. Numbers don't lie.

---

## 7. Documentation Before Code (181 Docs Before Line 1)

**The trap:** Starting to code immediately because "we can figure it out as we go."

**What happens:** V1 of our project had 50% broken features. V2 was architecturally better but missing 60% of features. V3 wrote 181 documents before any code — result was zero architectural pivots across 18 phases and 320+ tasks.

**The fix:** Use this starter kit. The entire purpose is to front-load the thinking.

**The math:**
- Fixing an architecture decision mid-project: 2-5 days of rework
- Writing a 1-page architecture decision document: 30 minutes
- ROI: 4-10x time saved per decision

---

## 8. Don't Trust AI-Generated Tests That Pass on First Run

**The trap:** AI writes a test, it passes immediately, you move on.

**What happens:** The test might be testing nothing. Common patterns:
- Testing that a mock returns what you told it to return
- Testing component renders without asserting any content
- Testing that `true === true` with extra steps

**The fix:** TDD — write the test FIRST, watch it FAIL, then implement. If a test passes before you write the implementation, the test is suspicious.

```
# TDD Cycle
1. Write test → RED (fails because feature doesn't exist)
2. Write minimum code → GREEN (test passes)
3. Refactor → still GREEN
```

---

## 9. AI Generates "Slop" UI by Default

**The trap:** Asking the AI to "build a dashboard" without design constraints.

**What happens:** You get the same blue-purple gradient, equal-sized cards, generic icons, and "Welcome back, User!" header that every AI generates. Users rate it 2/10 at best.

**The fix:**
1. Run design research first (look at real products: Vercel, Stripe, Linear)
2. Define design tokens (colors, spacing, typography) before any UI work
3. Apply anti-slop rules (see `07-ui-design-system/anti-slop-rulebook.md`)
4. Use the multi-AI design pipeline (research → concept → review → components)
5. Run design-verify after every UI change

**The demo story:** Our V3 app looked like every other AI-generated SaaS until we did a comprehensive design overhaul. The difference between "AI-generated" and "professionally designed" is entirely about constraints and references.

---

## 10. Session Start/End Rituals Are Not Optional

**The trap:** Jumping straight into coding without checking state files, or ending a session without updating them.

**What happens:**
- **No start ritual:** You rebuild something that's already done, or break something that was working, because you didn't know the current state.
- **No end ritual:** The next session (or the next AI instance) has no idea what happened. Work gets repeated or contradicted.

**The fix:** Every session follows the ritual:

```
# Start (2 minutes)
/session-start          # Reads STATUS.md + handoff.md
                        # Shows current state
                        # Asks "what's next?"

# End (3 minutes)
/session-end            # Updates STATUS.md with progress
                        # Writes handoff.md with next action
                        # Appends to DEVLOG.md
                        # Commits state files
```

**Investment:** 5 minutes per session. **Return:** Never losing context across sessions, even across different AI instances or human developers.

---

## 11. Don't Let AI Amend Commits After Hook Failures

**The trap:** A pre-commit hook fails (lint error, type error). The AI "fixes" it and runs `git commit --amend`.

**What happens:** The failed commit never happened — git didn't create it. `--amend` modifies the PREVIOUS commit, which was an unrelated, already-completed piece of work. You lose that previous commit's integrity.

**The fix:** After a hook failure:
1. Fix the issue
2. `git add` the fixed files
3. Create a NEW commit (never `--amend` after a hook failure)

---

## Quick Reference

| Gotcha | One-Line Fix |
|--------|-------------|
| Write needs Read | Always Read before Write |
| Context compaction | Write decisions to state files immediately |
| Feature mixing | One feature at a time, fully complete |
| Agent overload | Max 4-6 for docs, 2-3 for code |
| Fake "done" | Require terminal output evidence |
| Progress drift | Update counts after every step |
| Code-first | Write 100+ docs before line 1 of code |
| Passing-on-first-run tests | TDD: RED → GREEN → REFACTOR |
| Slop UI | Design tokens + anti-slop rules + references |
| No session ritual | /session-start and /session-end every time |
| Amend after hook fail | New commit, never amend |

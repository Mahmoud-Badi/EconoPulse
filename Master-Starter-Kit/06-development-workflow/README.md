# 06 - Development Workflow

## Purpose

This folder defines how you actually build features day-to-day. Not the architecture (that's in `02-architecture/`). Not the phase plan (that's in `04-phase-planning/`). This is the operational rhythm -- the session-to-session process that keeps a project moving forward without drift, rework, or "it works on my machine" surprises.

## Why This Exists

Your CLAUDE.md file has a workflow section. It tells Claude _what_ the steps are. This folder explains _why_ each step exists, _when_ to use each pattern, and _what goes wrong_ when you skip steps.

The difference matters. Claude follows instructions, but when edge cases arise (and they always do), understanding the reasoning behind the workflow prevents bad judgment calls. These documents are the reasoning.

## The Core Loop

Every development session follows the same loop:

```
Start Session --> Pick Task --> Build Feature --> Verify --> Commit --> End Session
     |                                                                    |
     +--- reads state files                              writes state files ---+
```

The state files (`STATUS.md`, `handoff.md`, `DEVLOG.md`, `CLAUDE.md`) are the bridge between sessions. Without them, every session starts from zero.

## Files in This Folder

| File | What It Covers | When to Reference |
|------|---------------|-------------------|
| [session-ritual.md](./session-ritual.md) | Start/end session protocol | Every session start and end |
| [feature-development-flow.md](./feature-development-flow.md) | Complete feature lifecycle (17 steps) | Before starting any new feature |
| [scaffolding-sequence.md](./scaffolding-sequence.md) | Correct build order for any feature | During implementation |
| [tdd-patterns.md](./tdd-patterns.md) | Test-driven patterns per layer | When writing tests |
| [parallel-agent-patterns.md](./parallel-agent-patterns.md) | When/how to use parallel agents | For batch tasks (docs, schemas, tests) |
| [debugging-protocol.md](./debugging-protocol.md) | Systematic bug investigation | When something breaks |
| [code-review-gates.md](./code-review-gates.md) | When code review is mandatory | Before merging or advancing phases |
| [deployment-flow.md](./deployment-flow.md) | Local to staging to production | When deploying changes |

## Reading Order

If you are setting up a new project, read them in order -- each builds on the previous:

1. **Session ritual** -- establishes the daily rhythm
2. **Feature development flow** -- the complete lifecycle
3. **Scaffolding sequence** -- the correct build order within a feature
4. **TDD patterns** -- how to write tests at each layer
5. **Parallel agents** -- how to speed up independent work
6. **Debugging protocol** -- when things go wrong
7. **Code review gates** -- quality gates before merge
8. **Deployment flow** -- getting code to production

## Relationship to CLAUDE.md

Your project's `CLAUDE.md` should contain a compact workflow section (10-15 lines) that references these files. Claude reads `CLAUDE.md` every session. It reads these files when it needs the full context.

Think of it as:
- `CLAUDE.md` = the checklist on the cockpit wall
- This folder = the pilot's operating handbook

Both are necessary. The checklist keeps you fast. The handbook keeps you correct.

## Key Principle

**Process exists to prevent rework.** Every step in this workflow was added because skipping it caused a real problem in a real project. The session ritual prevents re-orientation waste. The scaffolding sequence prevents dependency tangles. The debugging protocol prevents guess-and-fix loops. The review gates prevent shipping broken auth.

If a step feels unnecessary for your project, that's fine -- skip it. But understand what it prevents before you do.

# Multi-AI Coordination Guide

## Overview

This guide defines how to coordinate multiple AI tools (Claude Code, Gemini/Codex, GitHub Copilot) on a single codebase without conflicts, duplication, or architectural drift. The core principle: **each AI has a lane, a shared memory layer keeps them in sync**.

---

## When to Use Each AI Tool

### Claude Code
- Architecture decisions and system design
- Complex multi-file refactors (e.g., migrating an API envelope pattern across 40+ hooks)
- Code audits and adversarial review (tribunals, quality sprints)
- WebSocket and real-time feature implementation
- Type safety enforcement across frontend/backend boundaries
- Debugging complex issues (race conditions, tenant isolation bugs, Prisma edge cases)
- Writing tests for critical paths (auth, payments, tenant isolation)
- Multi-step plans that require reasoning across many files

### Gemini / Codex
- CRUD endpoint scaffolding (controller + service + DTO + module)
- Form generation from Prisma models
- Test writing for straightforward cases (unit tests for utils, simple component tests)
- Design token extraction from Figma or screenshots
- Image analysis (comparing mockups to implementations)
- Bulk repetitive tasks (renaming 30 files, adding error boundaries to 20 pages)
- Documentation generation from code (JSDoc, OpenAPI annotations)

### GitHub Copilot
- Inline completions while writing code in IDE
- Boilerplate code (imports, type declarations, simple functions)
- PR reviews via GitHub integration (`.github/copilot-instructions.md` provides context)
- Autocomplete for repetitive patterns within a single file
- Quick test stubs when the pattern is already established nearby

---

## Keeping AI Tools in Sync

### Shared Configuration Files

| File | Purpose | Read By |
|------|---------|---------|
| `CLAUDE.md` | Claude Code project instructions | Claude Code |
| `AGENTS.md` | Codex agent instructions | Codex |
| `GEMINI.md` | Gemini agent instructions | Gemini |
| `.github/copilot-instructions.md` | Copilot context | GitHub Copilot |
| `MEMORY.md` | Persistent memory across sessions | Claude Code (primary), all (reference) |

### What All Config Files Must Share
- API envelope convention: `{ data: T }` single, `{ data: T[], pagination }` list
- Frontend access pattern: `response.data.data` (not `response.data`)
- Naming conventions (kebab-case files, PascalCase components, camelCase functions)
- Protected files list (Load Planner, Truck Types, Login -- do not modify)
- Anti-patterns from `dev_docs_v3/05-audit/recurring-patterns.md`
- Prisma model conventions (tenant isolation, soft deletes, audit fields)

### Single Source of Truth

`MEMORY.md` is the canonical project state. It tracks:
- Current sprint and phase
- Known bugs (P0/P1)
- Codebase metrics (routes, components, models)
- Completed work and decisions
- Protect list

When any AI config file conflicts with MEMORY.md, MEMORY.md wins.

---

## Task Allocation Matrix

| Task Type | Best AI | Why | Handoff To |
|-----------|---------|-----|------------|
| Architecture design | Claude Code | Reasons across many files, holds full context | Gemini (implementation) |
| CRUD endpoint | Gemini/Codex | Fast pattern generation, follows templates | Claude (review) |
| Inline completion | Copilot | Real-time in IDE, low friction | None |
| Code audit | Claude Code | Adversarial reasoning, finds subtle bugs | Gemini (fixes) |
| Test generation (simple) | Gemini/Codex | Bulk output, follows established patterns | Claude (critical path tests) |
| Test generation (critical) | Claude Code | Understands edge cases, tenant isolation | None |
| Complex debugging | Claude Code | Multi-file reasoning, stack trace analysis | None |
| Form refactor | Gemini/Codex | Repetitive, pattern-based | Copilot (inline tweaks) |
| Design token extraction | Gemini | Image analysis capability | Claude (integration) |
| PR review | Claude Code | Deep context, catches anti-patterns | None |
| Bulk file operations | Gemini/Codex | Handles repetition without fatigue | Claude (verification) |
| WebSocket implementation | Claude Code | Stateful, requires architecture awareness | None |
| Documentation from code | Gemini/Codex | Extracts and formats efficiently | Claude (review) |

---

## Handoff Protocol

### Step 1: Complete Your AI Session
Finish all planned work. Do not leave half-done files.

### Step 2: Update MEMORY.md
Add to the relevant section:
- Decisions made (e.g., "Chose polling over WebSocket for dashboard refresh")
- Files created or significantly modified
- Bugs found or fixed
- New protect-list entries if applicable

### Step 3: Update STATUS.md
Mark task statuses: `DONE`, `IN PROGRESS`, `BLOCKED`, with the date.

### Step 4: Write Handoff Notes
When the next session will use a different AI, include in MEMORY.md or the task file:

```
## Last AI Session (2026-03-10)
- **AI Used:** Claude Code
- **Work Done:** Designed WebSocket namespace for /notifications, wrote 3 handler files
- **Files Changed:** apps/api/src/modules/notifications/notifications.gateway.ts (new),
  apps/api/src/modules/notifications/notifications.module.ts (modified)
- **Next Step:** Generate 12 notification event DTOs (good Gemini task)
- **Blockers:** None
- **Decisions:** Used Socket.IO rooms for tenant isolation (see ADR-016)
```

### Step 5: Verify Before Switching AIs
Before starting work with a different AI:
1. Read MEMORY.md to get current state
2. Read the specific task file for context
3. Run `pnpm build` to confirm no broken state
4. Run `pnpm test` to confirm tests still pass

---

## Anti-Patterns

### 1. Asking Multiple AIs the Same Question
**Problem:** Claude says "use server components," Gemini says "use client components." Now you have conflicting patterns in the codebase.
**Fix:** Architecture questions go to Claude only. Record the decision in MEMORY.md. Other AIs follow it.

### 2. Letting AIs Contradict Architectural Decisions
**Problem:** Gemini generates a CRUD endpoint using `response.data` instead of `response.data.data` because it was not given the envelope convention.
**Fix:** All AI config files include the same conventions. Review AI output against `recurring-patterns.md` before merging.

### 3. Using Copilot for Architecture
**Problem:** Copilot suggests a file structure based on autocomplete patterns, not project architecture.
**Fix:** Copilot handles line-level and function-level completions only. File structure and module design go to Claude.

### 4. Using Claude for Bulk Repetitive Tasks
**Problem:** Asking Claude to generate 30 nearly identical form components wastes tokens and time.
**Fix:** Claude designs the pattern for one. Gemini replicates it across all 30. Claude spot-checks 3-4.

### 5. Skipping Memory Updates Between Sessions
**Problem:** Next AI session re-discovers bugs already found, or repeats work already done.
**Fix:** Every session ends with a MEMORY.md update. No exceptions.

### 6. Mixing AI Outputs Without Review
**Problem:** Gemini-generated code gets committed without checking it follows project conventions.
**Fix:** Claude reviews Gemini/Codex output before merge, especially for: tenant isolation, error handling, API envelope compliance.

---

## Memory Synchronization

### MEMORY.md Structure
MEMORY.md is organized by topic:
- **Project Overview** -- stack, paths, credentials
- **Current Phase** -- active sprint, task counts
- **Codebase Metrics** -- verified counts of routes, components, models
- **Known Bugs** -- P0/P1 with file locations and line numbers
- **Protect List** -- files no AI should modify
- **Design System** -- approved tokens and components

### Topic Files for Deep Dives
When a topic needs more than a few lines in MEMORY.md, create a topic file:
- `memory/testing.md` -- mock patterns, jest config, SWC setup
- `memory/design-system.md` -- full token architecture, component inventory
- `memory/api-patterns.md` -- envelope format, pagination, error codes

### Update Rules
1. Update MEMORY.md at the **end** of every AI session (not during -- avoid mid-session conflicts)
2. Include the date with every update
3. Mark stale information explicitly: ~~old fact~~ replaced by new fact
4. Keep MEMORY.md under 500 lines -- move details to topic files
5. Never delete history -- mark items as FIXED, DONE, or SUPERSEDED

---

## Example Workflows

### Workflow 1: Building a New CRUD Service

```
1. Claude Code: Design the service architecture
   - Define Prisma models, relations, tenant isolation strategy
   - Write the controller interface (endpoints, DTOs, response types)
   - Create the service hub file in dev_docs_v3
   - Update MEMORY.md with decisions

2. Gemini/Codex: Generate the implementation
   - Scaffold controller, service, module, DTOs from Claude's design
   - Generate basic unit tests following project patterns
   - Create frontend form components from Prisma model

3. Claude Code: Review and harden
   - Audit tenant isolation in generated code
   - Verify API envelope compliance
   - Write integration tests for edge cases
   - Fix any anti-patterns from recurring-patterns.md

4. Copilot: Assist with inline polish
   - Autocomplete remaining type annotations
   - Fill in JSDoc comments
   - Help write remaining simple test cases
```

### Workflow 2: Debugging a Production Issue

```
1. Claude Code: Investigate and fix
   - Analyze error logs, trace through call stack
   - Identify root cause across multiple files
   - Implement fix with proper error handling
   - Write regression test
   - Update MEMORY.md with bug details and fix

2. Gemini/Codex: Apply fix pattern elsewhere
   - If the bug exists in similar code, Gemini applies the same fix pattern
   - Generate tests for all similar code paths

3. Claude Code: Final verification
   - Review all changes for consistency
   - Run full test suite, confirm no regressions
```

### Workflow 3: Design System Update

```
1. Gemini: Extract tokens from new Figma mockups (image analysis)
2. Claude Code: Map tokens to the 3-layer architecture (brand > semantic > Tailwind)
3. Gemini/Codex: Update all 31 TMS components with new tokens
4. Claude Code: Review for consistency, update design-system.md
```

---

## Quick Reference Card

| Question | Answer |
|----------|--------|
| Who designs it? | Claude Code |
| Who builds the boilerplate? | Gemini/Codex |
| Who reviews it? | Claude Code |
| Who assists inline? | Copilot |
| Where is the truth? | MEMORY.md |
| Where are conventions? | CLAUDE.md, AGENTS.md, GEMINI.md, copilot-instructions.md |
| Where are anti-patterns? | dev_docs_v3/05-audit/recurring-patterns.md |
| What to update after every session? | MEMORY.md + STATUS.md |

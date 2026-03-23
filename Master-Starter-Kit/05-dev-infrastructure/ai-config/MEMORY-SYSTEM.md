# Memory System Guide

## Purpose

The memory system gives AI agents persistent context across sessions. Without it, every new conversation starts from zero — the AI re-reads files, makes wrong assumptions, and repeats past mistakes.

**Proven on Ultra TMS:** 5 months of development across 100+ sessions. The memory system prevented context rot and ensured consistent decisions across sessions with different AI agents.

---

## Architecture

```
.claude/projects/{project-hash}/memory/
├── MEMORY.md          ← Hub file (always loaded into context)
├── testing.md         ← Testing patterns, mock strategies, gotchas
├── design-system.md   ← Approved design tokens, component inventory
├── debugging.md       ← Past bugs and their solutions
├── architecture.md    ← Key architectural decisions and patterns
└── {topic}.md         ← Additional topic files as needed
```

### MEMORY.md (Hub File)

This is the main file — always loaded into the AI's context at session start. Keep it under 200 lines. It should contain:

```markdown
# {{PROJECT_NAME}} Project Memory

## Project Overview
- **Repo:** org/repo on GitHub
- **Stack:** [frontend], [backend], [database], [ORM]
- **Structure:** [monorepo/standalone], paths to key directories
- **Path:** absolute path to project root

## Current Phase
- **Phase:** Phase N — [name]
- **Sprint:** MP-NN [name]
- **Next task:** [specific task ID and description]

## Codebase Metrics (verified YYYY-MM-DD)
- Frontend routes: N
- Components: N
- Backend modules: N
- Database models: N
- Tests: N passing (N% coverage)

## API Envelope (CRITICAL)
- Format: { data: T } or { data: T[], pagination: {...} }
- Frontend MUST: response.data.data (not response.data)

## Known P0 Bugs
- [Bug description — file:line — status]

## PROTECT LIST (do NOT touch)
- [Page name] (/route) — score/10, reason

## User Preferences
- [Preference 1]
- [Preference 2]
```

### Topic Files

Create topic files for detailed knowledge that would bloat MEMORY.md:

| Topic File | What Goes Here |
|-----------|---------------|
| `testing.md` | Mock patterns, test setup, SWC config, jest aliases |
| `design-system.md` | Approved tokens, component inventory, build log |
| `debugging.md` | Past bugs, root causes, solutions |
| `architecture.md` | Key patterns, module organization, data flow |
| `deployment.md` | Deploy process, env vars, CI/CD notes |

---

## 12 Information Categories

Track these categories across MEMORY.md and topic files:

| # | Category | Where | Example |
|---|----------|-------|---------|
| 1 | Project identity | MEMORY.md | Repo URL, stack, paths |
| 2 | Current phase/sprint | MEMORY.md | Phase 1, Sprint MP-01 |
| 3 | Codebase metrics | MEMORY.md | Routes, components, models |
| 4 | API patterns | MEMORY.md | Envelope format, auth flow |
| 5 | Known bugs | MEMORY.md | P0 bugs with file:line |
| 6 | Protected items | MEMORY.md | Pages that must not be modified |
| 7 | User preferences | MEMORY.md | Workflow preferences |
| 8 | Testing patterns | testing.md | Mock strategies, setup |
| 9 | Design decisions | design-system.md | Tokens, approved components |
| 10 | Past bugs/fixes | debugging.md | Root causes, solutions |
| 11 | Architecture | architecture.md | Module patterns, data flow |
| 12 | Deploy/infra | deployment.md | CI/CD, env vars |

---

## Temporal Markers

Add dates to time-sensitive information so stale data can be identified:

```markdown
## Codebase Metrics (verified 2026-03-07)  ← Date tells you when this was accurate

## Known P0 Bugs (last reviewed 2026-03-10)  ← Review date

**Previously listed — now FIXED:**  ← Track what's been resolved
- P0-003 FIXED: carriers page EXISTS (was listed as missing)
```

---

## Update Triggers

| Event | What to Update |
|-------|---------------|
| **Sprint change** | MEMORY.md: Current Phase section |
| **Bug found** | MEMORY.md: Known P0 Bugs |
| **Bug fixed** | MEMORY.md: Move to "Previously listed — now FIXED" |
| **New pattern discovered** | Topic file (testing.md, debugging.md, etc.) |
| **Codebase metrics changed significantly** | MEMORY.md: Metrics section (after adding routes, models) |
| **Design system update** | design-system.md |
| **Architecture decision** | architecture.md + MEMORY.md if it affects daily work |
| **Page reaches 8/10** | MEMORY.md: PROTECT LIST |
| **User states a preference** | MEMORY.md: User Preferences |

---

## What to Save vs What NOT to Save

### Save:
- Stable patterns confirmed across multiple sessions
- Key architectural decisions and file paths
- User preferences for workflow and communication
- Solutions to recurring problems
- API patterns that every hook must follow
- Metrics that help orient new sessions

### Do NOT Save:
- Session-specific context (current task details, in-progress work)
- Information that might be incomplete — verify first
- Anything that duplicates CLAUDE.md instructions
- Speculative conclusions from reading a single file
- Temporary workarounds that will be removed

### Explicit User Requests:
- When user says "remember X" → save it immediately
- When user says "forget X" → remove the entry
- When user corrects something from memory → update the entry immediately

---

## Setup During Project Bootstrap

The ORCHESTRATOR creates the initial memory system at Step 21:

1. Create `.claude/projects/{hash}/memory/` directory
2. Generate MEMORY.md hub from intake answers (project name, stack, paths)
3. Create empty topic files (testing.md, design-system.md)
4. Add memory directory path to CLAUDE.md
5. Configure auto-memory in Claude Code settings

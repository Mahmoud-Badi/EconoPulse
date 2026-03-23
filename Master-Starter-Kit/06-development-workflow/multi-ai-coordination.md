# Multi-AI Coordination Guide

> How to run multiple AI agents (Claude Code, Codex, Gemini, Copilot) on the same project without conflicts.

## Architecture

All AI agents share the same source of truth:

```
STATUS.md          ← Task board (who's working on what)
CLAUDE.md          ← Claude Code instructions
AGENTS.md          ← Universal AI instructions (Codex, others)
GEMINI.md          ← Gemini-specific instructions
.github/copilot-instructions.md  ← Copilot instructions
WORKFLOWS.md       ← Manual workflow equivalents for non-Claude AIs
LEARNINGS.md       ← Shared knowledge base (all AIs append here)
```

## Task Claiming Protocol

Multiple AI agents can work from the same STATUS.md task board. To prevent conflicts:

### Claiming a Task

```bash
# 1. Pull latest
git pull origin main

# 2. Update STATUS.md — change task status to "In Progress" and set "Assigned" to your AI tool
# 3. Commit the claim immediately
git commit -m "claim: TASK-XXX (Claude Code)"

# 4. Push immediately — first commit wins
git push origin main
```

### Rules

1. **First commit wins.** If two AIs claim the same task, the one whose commit lands first owns it.
2. **One task at a time per agent.** Complete or release before claiming another.
3. **Never work on unclaimed tasks.** Always claim first, then start coding.
4. **Release if blocked.** If you can't finish, update STATUS.md to "Ready" and unclaim.

## AI-Specific Config Files

| AI Tool | Auto-Loads | Manual Reference |
|---------|------------|-----------------|
| Claude Code | `CLAUDE.md` (root), `.claude/commands/`, `.claude/skills/` | — |
| OpenAI Codex | `AGENTS.md` (root) | `WORKFLOWS.md` for command equivalents |
| Google Gemini | `GEMINI.md` (root) | `WORKFLOWS.md` for command equivalents |
| GitHub Copilot | `.github/copilot-instructions.md` | `AGENTS.md` for architecture context |

## What Each AI Tool Does Best

| Task Type | Best Tool | Why |
|-----------|-----------|-----|
| Full feature development | Claude Code | Slash commands, MCP tools, plugin ecosystem |
| Isolated backend modules | Codex | Parallel sandbox execution |
| Research & design review | Gemini | Deep research, image generation, YouTube analysis |
| Inline code completion | Copilot | Real-time suggestions in IDE |
| UI concept generation | Stitch (via Claude MCP) | AI-powered UI mockups |
| Competitor research | Firecrawl (via Claude MCP) | Web scraping at scale |

## Parallel Work Patterns

### Safe to Parallelize

- Different services (e.g., Claude on Orders, Codex on Invoices)
- Backend vs frontend of the same service (if contracts are defined)
- Independent test files
- Documentation generation
- Separate database domains

### Never Parallelize

- Same file modifications
- Database migrations (one at a time)
- Shared config files (turbo.json, package.json)
- State file updates (STATUS.md, DEVLOG.md)
- Auth/permission changes

## Shared Knowledge Base (LEARNINGS.md)

When any AI agent discovers something useful (a gotcha, a pattern, a fix), it appends to LEARNINGS.md:

```markdown
## [Date] [AI Tool] — [Topic]

**Context:** What was being done
**Discovery:** What was learned
**Fix/Pattern:** The solution or pattern to follow
```

This prevents each AI from rediscovering the same issues independently.

## Workflow for Non-Claude AIs

AIs without plugin/command access use `WORKFLOWS.md` which provides step-by-step manual equivalents for:
- **Kickoff** — How to read STATUS.md, pick a task, load context
- **Quality Gate** — How to run lint, types, tests, build in sequence
- **Preflight** — How to check readiness before starting a feature
- **Log** — How to record a work session
- **Commit** — How to format commits and update state files

## Conflict Resolution

If two AIs accidentally work on the same thing:
1. Compare outputs — keep the better implementation
2. The AI that claimed first in git history has priority
3. Merge manually if both have useful pieces
4. Update LEARNINGS.md with what caused the conflict

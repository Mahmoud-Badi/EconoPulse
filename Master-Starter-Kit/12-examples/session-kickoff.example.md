# Session Kickoff Guide
# ============================================================
# EXAMPLE FILE — This is the real session-kickoff.md from Ultra TMS.
# Your project's session kickoff will be generated from the template
# in 03-documentation/execution-layer/foundations/session-kickoff.md.template
# ============================================================

How to start any AI coding session on Ultra TMS. Designed to prevent context rot and hallucination.

---

## Quick Orient (30 seconds)

1. **CLAUDE.md** loads automatically in Claude Code (project context, commands, conventions)
2. **Read the service hub file** for the service you're working on: `dev_docs/services/{service}.md`
3. Read **dev_docs/STATUS.md** to find your specific task and check assignments
4. Read the task file in **dev_docs/tasks/{current-phase}/** for detailed acceptance criteria

---

## Maximum Files Before Coding: 6

```
Level 0 (auto):     CLAUDE.md
Level 1 (30 sec):   dev_docs/services/{service}.md → service hub
Level 2 (task):     dev_docs/STATUS.md → find your task → task file in tasks/
Level 3 (deep):     Full 15-section design spec (ONLY if task requires it)
```

**Do NOT read more than 6 files before starting to code.** Every task file lists exactly which files you need.

---

## Context Header Pattern

Every task file starts with a Context Header:

```markdown
## Context Header

Before starting, read:
1. CLAUDE.md (auto-loaded in Claude Code)
2. [specific file relevant to this task]
3. [one more if needed — max 3 items here]
```

**Only read what's listed.** The task file is self-contained.

---

## By Task Type

### Fixing a bug
1. Read `dev_docs/STATUS.md` → find your BUG task
2. Read the task file in `dev_docs/tasks/phase-0-bugs/`
3. The task file points to the exact file and line number

### Building a component
1. Read `dev_docs/STATUS.md` → find your COMP task
2. Read the task file in `dev_docs/tasks/phase-1-design/`
3. The task file references the design-system.md for tokens/colors

### Building a page
1. Read `dev_docs/services/{service}.md` → the hub file has everything
2. Read `dev_docs/STATUS.md` → find your specific task
3. Read the task file — it links to the web-dev-prompt and design spec

---

## After Coding

1. **Update STATUS.md** — mark your task as DONE, add the date
2. **Run verification** — `pnpm check-types && pnpm lint`
3. **Commit** — use `/commit` or `git commit`
4. **Update work log** — use `/log` to add an entry to work-log.md

---

## For Non-Claude AI Agents

| AI Tool | Auto-loads | What to do |
|---------|-----------|------------|
| OpenAI Codex | `AGENTS.md` | Follow the Quick Start section |
| Gemini CLI | `GEMINI.md` | Read `AGENTS.md` for full context |
| GitHub Copilot | `.github/copilot-instructions.md` | Read `AGENTS.md` for full context |
| Claude Code | `CLAUDE.md` | Use `/kickoff` |

---

## Rules

1. **One task = one session.** Don't try multiple tasks in one context window.
2. **Read only what's listed.** Context Header tells you what you need.
3. **Update STATUS.md immediately** when you start or finish a task.
4. **Check dependencies** before starting.
5. **Don't rebuild backend services that already exist.**
6. **Rebuild UI from design specs.** Don't patch old code.
7. **PROTECT LIST:** Load Planner, Truck Types, Login — don't touch.
8. **Always fix security bugs** regardless.

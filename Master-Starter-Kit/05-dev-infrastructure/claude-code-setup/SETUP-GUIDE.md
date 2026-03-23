# Claude Code Ecosystem Setup Guide

Complete setup guide for configuring the Claude Code ecosystem on a new project. Follow each phase in order — later phases depend on earlier ones.

---

## Prerequisites

- Claude Code CLI installed and authenticated (`claude --version`)
- Node.js 18+ and npm/pnpm installed
- Git repository initialized
- GitHub CLI (`gh`) installed and authenticated (for PR workflows)

---

## Phase 1: Plugin Installation

Plugins extend Claude Code with specialized skills, slash commands, and MCP servers. Some plugins auto-configure MCP servers (Context7, Playwright), so install plugins first.

1. Open your terminal in the project root.
2. Follow the checklist in **[install-plugins.md](./install-plugins.md)** to install all 14 plugins.
3. Verify each plugin is loaded: `claude plugins list`

**Time estimate:** 5-10 minutes

---

## Phase 2: MCP Server Setup

MCP servers give Claude Code access to external tools (web scraping, browser automation, deep research). Some are auto-configured by plugins; others need manual setup.

1. Follow the server-by-server instructions in **[mcp-servers-guide.md](./mcp-servers-guide.md)**.
2. Add config JSON to your `.claude/settings.json` or project-level settings.
3. Verify each server responds to a test query.

**Time estimate:** 10-20 minutes (depends on API keys needed)

---

## Phase 3: Settings Files Creation

Claude Code reads settings from multiple levels. Create all three:

### 3a. User-Level Settings (`~/.claude/settings.json`)

```jsonc
// ~/.claude/settings.json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git add*)",
      "Bash(git commit*)",
      "Bash(npm run*)",
      "Bash(pnpm *)",
      "Bash(npx *)",
      "Read(*)",
      "Write(*)",
      "Edit(*)"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(git push --force*)",
      "Bash(git reset --hard*)"
    ]
  },
  "preferences": {
    "theme": "dark",
    "autoApprove": false
  }
}
```

### 3b. Project-Level Settings (`.claude/settings.json` in repo root)

Copy from the template — it includes **full bypass permissions** so Claude Code won't prompt for every file edit, read, write, git command, or package manager command:

```bash
cp 05-dev-infrastructure/settings/settings.json.template .claude/settings.json
# Then replace {{PKG_MANAGER}} with your actual package manager (npm, pnpm, yarn, bun)
```

The template pre-allows: all file tools (Read, Edit, Write, Glob, Grep), all git commands, package manager commands, Docker, Node, and common shell utilities. Destructive operations (`rm -rf /`, `git push --force`, `git reset --hard`) are explicitly denied.

```jsonc
// .claude/settings.json
{
  "mcpServers": {
    // Paste MCP server configs from Phase 2 here
  },
  "permissions": {
    "allow": [
      "Read(*)", "Edit(*)", "Write(*)", "Glob(*)", "Grep(*)",
      "Bash(git *)", "Bash(pnpm *)", "Bash(npx *)", "..."
    ],
    "deny": [
      "Bash(rm -rf /)", "Bash(git push --force*)", "Bash(git reset --hard*)"
    ]
  }
}
```

### 3c. Project-Level Local Settings (`.claude/settings.local.json`)

For secrets and machine-specific config. **Add this to `.gitignore`.**

```jsonc
// .claude/settings.local.json
{
  "mcpServers": {
    // Servers with API keys go here (not committed to git)
  },
  "env": {
    "FIRECRAWL_API_KEY": "fc-...",
    "GEMINI_API_KEY": "AIza..."
  }
}
```

**Important:** Add `.claude/settings.local.json` to `.gitignore`:

```bash
echo ".claude/settings.local.json" >> .gitignore
```

---

## Phase 4: Commands Installation

Custom slash commands live in `.claude/commands/`. They define reusable prompts you invoke with `/project:command-name`.

### Directory structure:

```
.claude/
  commands/
    kickoff.md          # Session start briefing
    wrapup.md           # Session end summary + work log
    audit.md            # Code quality audit
    fix.md              # Bug fix workflow
    test.md             # Test writing workflow
```

### Creating a command:

Each `.md` file becomes a slash command. The filename (minus extension) is the command name.

```bash
mkdir -p .claude/commands
```

Example `kickoff.md`:

```markdown
Read the project memory files, check git status, review recent commits, and provide a briefing on:
1. What was done in the last session
2. What is next on the task list
3. Any blockers or context needed

Then immediately begin work on the next task.
```

### User-level commands:

Commands in `~/.claude/commands/` are available across all projects:

```bash
mkdir -p ~/.claude/commands
```

See the `commands/` directory in this starter kit for ready-made command templates.

### Project-level documentation commands

These are installed during **ORCHESTRATOR Step 15.5** (User Documentation). Copy the templates from the starter kit:

```bash
# Copy documentation command templates
cp 05-dev-infrastructure/commands/document-feature.template.md .claude/commands/document-feature.md
cp 05-dev-infrastructure/commands/capture-screenshots.template.md .claude/commands/capture-screenshots.md
cp 05-dev-infrastructure/commands/doc-quality-gate.template.md .claude/commands/doc-quality-gate.md
```

| Command | Template Source | Purpose |
|---------|----------------|---------|
| `/project:document-feature` | `commands/document-feature.template.md` | Generate user-facing docs after completing a feature |
| `/project:capture-screenshots` | `commands/capture-screenshots.template.md` | Capture screenshots for documentation placeholders |
| `/project:doc-quality-gate` | `commands/doc-quality-gate.template.md` | Phase-end documentation coverage check |

---

## Phase 5: Skills Installation

Skills are more powerful than commands — they can define multi-step workflows with tool access. They live as plugins or in `.claude/skills/`.

The plugins installed in Phase 1 provide most skills automatically:

| Skill | Source | Invocation |
|-------|--------|-----------|
| Feature development | feature-dev plugin | `/feature-dev` |
| Code review | code-review plugin | `/code-review` |
| PR review | pr-review-toolkit plugin | `/review-pr` |
| Brainstorming | superpowers plugin | `/brainstorming` |
| Frontend design | frontend-design plugin | `/frontend-design` |
| Commit workflow | commit-commands plugin | `/commit` |
| Claude.md management | claude-md-management plugin | `/revise-claude-md` |

### Project-level documentation skills

These skills are installed during **ORCHESTRATOR Step 15.5** (User Documentation). They live in `.claude/skills/` within your project:

```bash
# Copy skill templates (the ORCHESTRATOR does this automatically)
mkdir -p .claude/skills/document-feature .claude/skills/capture-screenshots
cp 05-dev-infrastructure/skills/document-feature/SKILL.md.template .claude/skills/document-feature/SKILL.md
cp 05-dev-infrastructure/skills/capture-screenshots/SKILL.md.template .claude/skills/capture-screenshots/SKILL.md
```

| Skill | Source | Invocation | When to Use |
|-------|--------|------------|-------------|
| Document feature | project skill | `/document-feature` | After completing any feature task |
| Capture screenshots | project skill | `/capture-screenshots` | After design phase, when UI is ready |

The `/doc-quality-gate` command (installed in Phase 4) acts as a phase-end quality gate for documentation coverage.

Verify skills are available:

```bash
# In a Claude Code session, type "/" and tab to see all available commands/skills
```

---

## Phase 5.5: Documentation Enforcement Hooks

These hooks make documentation enforcement automatic — no manual invocation needed. Installed during **ORCHESTRATOR Step 15.5**.

### Claude Code hooks

Add to `.claude/settings.json` to auto-detect task completions and phase transitions:

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "bash hooks/doc-enforcement-dispatcher.sh" }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "bash hooks/session-end-doc-check.sh" }
        ]
      }
    ]
  }
}
```

| Hook | Trigger | Action |
|------|---------|--------|
| Task completion | STATUS.md edited with "DONE" | Injects `/document-feature` instruction |
| Phase transition | STATUS.md CURRENT_STEP changed | Injects `/doc-quality-gate` instruction |
| Session end | Claude stops | Warns about undocumented tasks |

### Git pre-commit hook

Warns (or blocks) commits that change feature code without updating `user_docs/`:

```bash
cp hooks/pre-commit-doc-gate.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

Set `DOC_GATE_STRICT=true` to block commits, or leave as `false` (default) for warnings only.

### Hook scripts to install

```bash
mkdir -p hooks
cp 05-dev-infrastructure/hooks/doc-enforcement-dispatcher.template.sh hooks/doc-enforcement-dispatcher.sh
cp 05-dev-infrastructure/hooks/session-end-doc-check.template.sh hooks/session-end-doc-check.sh
cp 05-dev-infrastructure/hooks/pre-commit-doc-gate.template.sh hooks/pre-commit-doc-gate.sh
chmod +x hooks/*.sh
```

Full documentation: `05-dev-infrastructure/hooks/doc-enforcement.md`

---

## Phase 6: AI Config Generation

Create the `CLAUDE.md` file at your project root. This is the single most important file — it tells Claude Code how to work with your project.

### Minimal CLAUDE.md template:

```markdown
# Project Name

## Tech Stack
- Framework: [e.g., Next.js 16]
- Language: [e.g., TypeScript 5.x]
- Styling: [e.g., Tailwind 4 + shadcn/ui]
- Backend: [e.g., NestJS + PostgreSQL + Prisma]
- Package manager: [e.g., pnpm]

## Project Structure
- `src/` or `apps/web/` — frontend
- `api/` or `apps/api/` — backend
- `prisma/` — database schema

## Commands
- Dev: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test`
- Lint: `pnpm lint`

## Rules
- [Coding conventions, naming patterns, etc.]
- [Files or directories to never modify]
- [Testing requirements]
```

### Multi-AI config (if collaborating with other AI tools):

Also create:

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Claude Code instructions |
| `AGENTS.md` | OpenAI Codex / ChatGPT instructions |
| `GEMINI.md` | Google Gemini instructions |
| `.github/copilot-instructions.md` | GitHub Copilot instructions |
| `LEARNINGS.md` | Shared knowledge base across all AIs |

---

## Phase 7: Memory Initialization

Memory files persist context across sessions. Set up the memory directory:

```bash
mkdir -p memory
```

### Core memory files:

| File | Purpose |
|------|---------|
| `memory/MEMORY.md` | Master context — project overview, stack, rules, preferences |
| `memory/design-system.md` | Design decisions and revision history |
| `memory/testing.md` | Test infrastructure notes, mocking patterns |
| `memory/work-log.md` | Session-by-session work log |

### Claude-level memory:

Claude Code also reads from `~/.claude/projects/{project-hash}/memory/MEMORY.md`. This is for user-private notes that are not committed to the repo.

```bash
# Claude manages this automatically, but you can seed it:
mkdir -p ~/.claude/projects/$(pwd | md5sum | cut -c1-16)/memory
```

---

## Phase 8: Verification Checklist

Run through this checklist to confirm everything is working:

### Plugins
- [ ] `claude plugins list` shows all installed plugins
- [ ] `/brainstorming` responds (superpowers)
- [ ] `/feature-dev` responds (feature-dev)
- [ ] `/code-review` responds (code-review)
- [ ] `/commit` responds (commit-commands)
- [ ] `/frontend-design` responds (frontend-design)

### MCP Servers
- [ ] Firecrawl: Can scrape a test URL
- [ ] Gemini: Can answer a research question
- [ ] Sequential Thinking: Can reason through a problem
- [ ] Context7: Library doc queries return results
- [ ] Playwright: Can navigate to a URL and take a screenshot

### Settings
- [ ] `.claude/settings.json` exists in project root
- [ ] `.claude/settings.local.json` exists and is in `.gitignore`
- [ ] Permissions allow common operations (git, npm, file read/write)

### Commands
- [ ] `.claude/commands/` directory exists with at least `kickoff.md`
- [ ] `/project:kickoff` executes successfully

### Config Files
- [ ] `CLAUDE.md` exists at project root with stack and rules
- [ ] Memory directory exists with `MEMORY.md`

### Smoke Test
- [ ] Start a new Claude Code session
- [ ] Run `/project:kickoff` — it should read memory and provide a briefing
- [ ] Ask Claude to make a small code change — it should follow CLAUDE.md rules
- [ ] Run `/commit` — it should stage, commit, and follow conventions

---

## Quick Reference: File Locations

```
project-root/
  CLAUDE.md                          # AI instructions
  AGENTS.md                          # Multi-AI config (optional)
  .claude/
    settings.json                    # Project settings (committed)
    settings.local.json              # Local secrets (gitignored)
    commands/
      kickoff.md                     # /project:kickoff
      wrapup.md                      # /project:wrapup
  memory/
    MEMORY.md                        # Master context
    work-log.md                      # Session log

~/.claude/
  settings.json                      # User-level settings
  commands/                          # Global commands
  projects/{hash}/memory/MEMORY.md   # Private project memory
```

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Plugin not found | Run `claude plugins install <id>` again; check network |
| MCP server timeout | Verify API key in settings.local.json; check `npx` can run the server |
| Slash command not appearing | Ensure `.md` file is in `.claude/commands/`; restart session |
| Claude ignores CLAUDE.md rules | Check file is at project root; verify no syntax errors |
| Memory not persisting | Ensure `memory/MEMORY.md` exists; check Claude is reading it on session start |
| Permission denied errors | Add the command pattern to `permissions.allow` in settings |

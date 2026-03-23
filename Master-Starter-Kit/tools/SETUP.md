# Master Starter Kit — Full Setup Guide

Get everything installed on a new machine in under 5 minutes.

---

## Step 1 — Run the Install Script

**Windows (PowerShell):**
```powershell
cd Master-Starter-Kit\tools
powershell -ExecutionPolicy Bypass -File install.ps1
```

**Mac / Linux:**
```bash
cd Master-Starter-Kit/tools
bash install.sh
```

This copies all skills and commands into `~/.claude/`, replaces path placeholders, and merges the GSD hooks into your settings.

**Then restart Claude Code.**

---

## Step 2 — Install Plugins

Open Claude Code and install the core plugins:

```
/plugin install superpowers@claude-plugins-official
/plugin install frontend-design@claude-plugins-official
/plugin install feature-dev@claude-plugins-official
/plugin install context7@claude-plugins-official
/plugin install playwright@claude-plugins-official
/plugin install commit-commands@claude-plugins-official
/plugin install code-review@claude-plugins-official
/plugin install hookify@claude-plugins-official
```

See [plugins-recommended.md](plugins-recommended.md) for the full list with descriptions.

---

## Step 3 — Verify

After restarting Claude Code, these should all work:

| Command | What It Does |
|---------|-------------|
| `/kit` | Start Master Starter Kit planning from Step 0 |
| `/kit resume` | Resume an in-progress planning session |
| `/kit audit` | Run quality hardening (Steps 29–33) |
| `/kit status` | Show current planning progress |
| `/gsd [path]` | Build a planned project autonomously |
| `/gsd-status` | Show GSD execution progress |
| `/log` | Log today's work session |

---

## What Was Installed

```
~/.claude/
├── skills/
│   ├── kit/SKILL.md         ← Master Starter Kit autopilot
│   ├── gsd/SKILL.md         ← Autonomous project builder
│   ├── recreate/SKILL.md    ← Screenshot-to-code
│   ├── delta/SKILL.md       ← Project session startup (customize)
│   └── kickoff/SKILL.md     ← Session kickoff (customize)
├── commands/
│   ├── kit.md               ← /kit command
│   ├── gsd-status.md        ← /gsd-status command
│   └── log.md               ← /log command
└── settings.json            ← GSD hooks merged in (Stop + PreCompact)
```

---

## Customizing delta and kickoff

The `delta` and `kickoff` skills are session-startup tools tied to specific project structures. Edit them after install to match your project:

```
~/.claude/skills/delta/SKILL.md    ← update file paths for your project
~/.claude/skills/kickoff/SKILL.md  ← update service map and paths
```

---

## Updating

When the kit is updated with new skills or improvements, re-run the install script. It overwrites existing files (your `{{KIT_HOME}}` path is re-patched automatically).

---

## Troubleshooting

**Skills not appearing:** Restart Claude Code completely (not just a new window).

**`/kit` points to wrong directory:** Re-run the install script. It patches the path automatically from wherever the script is located.

**Hooks not firing:** Check `~/.claude/settings.json` has a `"hooks"` key with `"Stop"` and `"PreCompact"` entries. If missing, manually merge `tools/hooks-snippet.json`.

**GSD can't find task files:** Check your project has `dev_docs/tasks/*.md` files, or create `[project]/.gsd/config.json` with `{"task_dir": "your/tasks/path"}`.

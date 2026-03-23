# Claude Code Configuration Guide

## Overview

Claude Code has three independent configuration systems. Each serves a different purpose and lives in a different location. Set them up in any order.

| System | File Location | Purpose |
|--------|--------------|---------|
| Plugins | `~/.claude/settings.json` | Enable Claude Code plugins (superpowers, frontend-design, etc.) |
| MCP Servers | `~/.claude.json` | Connect external AI tools (Gemini, Firecrawl, Stitch, etc.) |
| Post-tool Hooks | `{project}/.claude/settings.json` | Auto-run commands after Claude edits files |

## Quick Setup Checklist

1. **Plugins** -- Edit `~/.claude/settings.json` to enable plugins via `enabledPlugins`. See `plugins-guide.md` for the full list with install instructions.

2. **MCP Servers** -- Edit `~/.claude.json` (in your home directory) to configure MCP server connections. See `mcp-servers-guide.md` for all 9 servers with API key setup.

3. **Hooks** -- Create `{project}/.claude/settings.json` in your project to set up PostToolUse hooks (auto-typecheck, auto-test, auto-lint). See `hooks-guide.md` for the proven config.

4. **Skills Manifest** -- Create `.claude/skills.md` in your project listing all available slash commands. See `skills-manifest.template.md` for the template.

5. **Slash Commands** -- Create `.claude/commands/*.md` files for each custom slash command. See the `commands/` folder for all 21 templates.

## After Setup

After changing MCP server configuration in `~/.claude.json`, you must **restart Claude Code in VS Code** for the changes to take effect. Plugin and hook changes take effect immediately.

## File Locations Summary

```
~/.claude/settings.json        # Plugins + permissions (global)
~/.claude.json                  # MCP servers (global)
{project}/.claude/settings.json # Hooks (per-project)
{project}/.claude/skills.md     # Skills manifest (per-project)
{project}/.claude/commands/     # Slash command definitions (per-project)
{project}/CLAUDE.md             # AI context file (per-project)
```

## Key Distinctions

- `~/.claude/settings.json` = global permissions and plugin enablement
- `~/.claude.json` = global MCP server connections and metadata
- These are **different files** despite similar names. Do not confuse them.
- Per-project `.claude/settings.json` is for hooks only and lives inside the project directory, not the home directory.

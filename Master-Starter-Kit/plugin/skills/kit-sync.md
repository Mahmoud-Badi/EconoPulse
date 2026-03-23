---
name: kit-sync
description: |
  Sync Master Starter Kit updates to all projects. Pushes plugin files,
  skills, scripts, and hooks from the source Master Kit to every project
  copy found on disk.

  Use when:
  - User says "sync kit", "kit sync", "/kit-sync", "push kit updates"
  - User says "update all projects", "sync to projects", "propagate changes"
  - User updated the Master Kit and wants all projects to get the changes

  Examples:
  - "/kit-sync" — sync all projects
  - "/kit-sync --dry-run" — preview what would be synced
---

# Kit Sync — Push Master Kit Updates to All Projects

Finds every project on disk that has a `Master-Starter-Kit/plugin/` directory
and syncs the latest plugin files from the source Master Kit.

## Instructions

1. **Do NOT ask for confirmation. Run immediately.**

2. Run the sync script:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/../../sync-to-projects.sh"
```

If the script doesn't exist at that path, fall back to finding it:

```bash
SCRIPT=$(find "C:/Users/USER/Desktop/websites/1-LIVE/Master-Kit" -name "sync-to-projects.sh" -maxdepth 1 2>/dev/null | head -1)
if [ -n "$SCRIPT" ]; then
  bash "$SCRIPT"
else
  echo "ERROR: sync-to-projects.sh not found in Master Kit root"
fi
```

3. If the user said `--dry-run`, pass that flag to the script.

4. Report the results: how many projects synced, how many skipped, any errors.

## What Gets Synced

- `plugin/skills/*.md` — All skill files
- `tools/scripts/*.sh` — All automation scripts (autopilot, setup, etc.)
- `plugin/plugin.json` — Skill registrations (additive only, won't remove existing entries)

## What Does NOT Get Synced

- Project-specific files (CLAUDE.md, dev_docs/, .gsd/)
- Hooks (projects may have customized hooks)
- Agents (projects may have custom agents)
- Commands (projects may have custom commands)

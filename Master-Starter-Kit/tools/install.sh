#!/usr/bin/env bash
# Master Starter Kit — Claude Code Setup (Cross-Platform)
# Run: bash Master-Starter-Kit/tools/install.sh

set -e

TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT_HOME="$(dirname "$TOOLS_DIR")"   # Master-Starter-Kit/
REPO_ROOT="$(dirname "$KIT_HOME")"
CLAUDE_DIR="$HOME/.claude"
SKILLS_DST="$CLAUDE_DIR/skills"
CMDS_DST="$CLAUDE_DIR/commands"
SETTINGS_F="$CLAUDE_DIR/settings.json"

echo ""
echo "Master Starter Kit — Claude Code Setup"
echo "Kit home : $KIT_HOME"
echo "Claude   : $CLAUDE_DIR"
echo ""

mkdir -p "$SKILLS_DST" "$CMDS_DST"

# ── Copy skills ──────────────────────────────────────────────────────────────
for skill in kit delta kickoff recreate gsd website-builder master-kit-upgrade kit-upgrade; do
    src="$TOOLS_DIR/skills/$skill"
    if [ -d "$src" ]; then
        cp -r "$src" "$SKILLS_DST/"
        echo "  [skill] $skill -> $SKILLS_DST/$skill"
    fi
done

# ── Replace {{KIT_HOME}} in kit skill ───────────────────────────────────────
KIT_SKILL="$SKILLS_DST/kit/SKILL.md"
if [ -f "$KIT_SKILL" ]; then
    sed -i.bak "s|{{KIT_HOME}}|$KIT_HOME|g" "$KIT_SKILL" && rm -f "$KIT_SKILL.bak"
    echo "  [patch] kit skill: KIT_HOME = $KIT_HOME"
fi

# ── Replace {{WEBSITE_BUILDER_DIR}} in website-builder skill ────────────────
WB_SKILL="$SKILLS_DST/website-builder/SKILL.md"
WB_DIR="$SKILLS_DST/website-builder"
if [ -f "$WB_SKILL" ]; then
    sed -i.bak "s|{{WEBSITE_BUILDER_DIR}}|$WB_DIR|g" "$WB_SKILL" && rm -f "$WB_SKILL.bak"
    echo "  [patch] website-builder skill: WEBSITE_BUILDER_DIR = $WB_DIR"
fi

# ── Replace {{KIT_HOME}} in master-kit-upgrade skill ────────────────────────
MKU_SKILL="$SKILLS_DST/master-kit-upgrade/SKILL.md"
if [ -f "$MKU_SKILL" ]; then
    sed -i.bak "s|{{KIT_HOME}}|$KIT_HOME|g" "$MKU_SKILL" && rm -f "$MKU_SKILL.bak"
    echo "  [patch] master-kit-upgrade skill: KIT_HOME = $KIT_HOME"
fi

# ── Copy commands ────────────────────────────────────────────────────────────
for cmd in kit.md log.md gsd-status.md; do
    src="$TOOLS_DIR/commands/$cmd"
    if [ -f "$src" ]; then
        cp "$src" "$CMDS_DST/"
        echo "  [cmd]   $cmd -> $CMDS_DST"
    fi
done

# ── Replace {{KIT_HOME}} in kit command ─────────────────────────────────────
KIT_CMD="$CMDS_DST/kit.md"
if [ -f "$KIT_CMD" ]; then
    sed -i.bak "s|{{KIT_HOME}}|$KIT_HOME|g" "$KIT_CMD" && rm -f "$KIT_CMD.bak"
    echo "  [patch] kit command: KIT_HOME = $KIT_HOME"
fi

# ── JSON merge helper (node preferred, python3 fallback) ────────────────────
json_merge_plugins() {
    local settings_file="$1"
    local plugins_file="$2"

    if command -v node &>/dev/null; then
        node - "$settings_file" "$plugins_file" <<'NODEOF'
const fs = require('fs');
const [,, settingsPath, pluginsPath] = process.argv;
let settings = {};
if (fs.existsSync(settingsPath)) {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
}
const plugins = JSON.parse(fs.readFileSync(pluginsPath, 'utf8'));
if (!settings.enabledPlugins) settings.enabledPlugins = {};
for (const [key, val] of Object.entries(plugins)) {
    if (!(key in settings.enabledPlugins)) {
        settings.enabledPlugins[key] = val;
    }
}
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
NODEOF
    elif command -v python3 &>/dev/null; then
        python3 -c "
import json, sys
sf, pf = sys.argv[1], sys.argv[2]
with open(sf) as f: s = json.load(f)
with open(pf) as f: p = json.load(f)
ep = s.setdefault('enabledPlugins', {})
for k, v in p.items():
    if k not in ep:
        ep[k] = v
with open(sf, 'w') as f: json.dump(s, f, indent=2)
" "$settings_file" "$plugins_file"
    else
        echo "  [warn]  No node or python3 — skipping plugin merge"
        return 1
    fi
}

# ── Ensure global settings.json exists ───────────────────────────────────────
if [ ! -f "$SETTINGS_F" ]; then
    echo '{}' > "$SETTINGS_F"
fi

# ── Merge hooks into settings.json ──────────────────────────────────────────
HOOKS_SNIPPET="$TOOLS_DIR/hooks-snippet.json"
if [ -f "$HOOKS_SNIPPET" ]; then
    if command -v node &>/dev/null; then
        node - "$SETTINGS_F" "$HOOKS_SNIPPET" <<'NODEOF'
const fs = require('fs');
const [,, settingsPath, snippetPath] = process.argv;
let settings = {};
if (fs.existsSync(settingsPath)) {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
}
const snippet = JSON.parse(fs.readFileSync(snippetPath, 'utf8'));
if (!settings.hooks) settings.hooks = {};
for (const [event, handlers] of Object.entries(snippet.hooks)) {
    settings.hooks[event] = handlers;
}
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
NODEOF
        echo "  [hooks] Merged Stop + PreCompact into $SETTINGS_F"
    elif command -v python3 &>/dev/null; then
        python3 -c "
import json, sys
with open(sys.argv[1]) as f: s = json.load(f)
with open(sys.argv[2]) as f: h = json.load(f)
s.setdefault('hooks', {}).update(h.get('hooks', {}))
with open(sys.argv[1], 'w') as f: json.dump(s, f, indent=2)
" "$SETTINGS_F" "$HOOKS_SNIPPET"
        echo "  [hooks] Merged Stop + PreCompact into $SETTINGS_F"
    else
        echo "  [warn]  No node or python3 — manually merge hooks-snippet.json into $SETTINGS_F"
    fi
fi

# ── Merge recommended plugins into settings.json ────────────────────────────
PLUGINS_FILE="$TOOLS_DIR/recommended-plugins.json"
if [ -f "$PLUGINS_FILE" ]; then
    if json_merge_plugins "$SETTINGS_F" "$PLUGINS_FILE"; then
        echo "  [plugins] Merged recommended plugins into $SETTINGS_F"
    fi
fi

# ── Copy .mcp.json.template if .mcp.json doesn't exist ──────────────────────
MCP_TEMPLATE="$REPO_ROOT/.mcp.json.template"
MCP_TARGET="$REPO_ROOT/.mcp.json"
if [ -f "$MCP_TEMPLATE" ] && [ ! -f "$MCP_TARGET" ]; then
    cp "$MCP_TEMPLATE" "$MCP_TARGET"
    echo "  [mcp]   Created .mcp.json from template (add your API keys!)"
fi

# ── Write installed version marker ──────────────────────────────────────────
if [ -f "$TOOLS_DIR/VERSION" ]; then
    tr -d '[:space:]' < "$TOOLS_DIR/VERSION" > "$SKILLS_DST/.kit-version"
    echo "  [ver]   $(cat "$SKILLS_DST/.kit-version") written to $SKILLS_DST/.kit-version"
fi

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo "Done! Restart Claude Code to activate all skills and commands."
echo ""
echo "Available after restart:"
echo "  /kit          -- Master Starter Kit autopilot"
echo "  /kit resume   -- Resume in-progress planning session"
echo "  /kit audit    -- Quality hardening (Steps 29-33)"
echo "  /gsd [path]   -- Autonomous project build"
echo "  /gsd-status   -- GSD execution progress"
echo "  /log          -- Log work session"
echo "  /delta           -- Delta TMS session start  (customize skill for your project)"
echo "  /kickoff         -- Session kickoff          (customize skill for your project)"
echo "  /website-builder -- Build a complete Next.js site from a brief"
echo "  /kit-upgrade     -- Upgrade project plans to latest kit version"
echo ""
if [ -f "$MCP_TEMPLATE" ] && [ ! -f "$MCP_TARGET" ]; then
    echo "NOTE: Edit .mcp.json and add your API keys for MCP servers."
    echo ""
fi

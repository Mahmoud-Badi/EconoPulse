---
name: health-check
description: Verify all MCP servers, plugins, and tools are working before starting an ORCHESTRATOR run or resuming.
allowed_tools:
  - Bash
  - Read
  - Glob
  - AskUserQuestion
---

# /health-check — Pre-Flight System Check

Verify that all required tools, MCP servers, and plugins are operational before starting or resuming the ORCHESTRATOR.

## Protocol

### 1. Check Claude Code Environment

```bash
# Verify Claude Code is running with expected capabilities
echo "Claude Code environment: OK"
```

### 2. Check MCP Servers

For each MCP server configured in `.claude.json` or `.claude/settings.json`:

| Server | Test | Pass Criteria |
|--------|------|---------------|
| **Firecrawl** | Attempt `firecrawl_search` with a simple query | Returns results without error |
| **Context7** | Attempt `resolve-library-id` for "react" | Returns a library ID |
| **Playwright** | Attempt `browser_navigate` to `about:blank` | Browser launches successfully |
| **Gemini** | Attempt `gemini-query` with "hello" | Returns a response |

For each server:
- If available and responding: mark **OK**
- If configured but not responding: mark **WARN** with error message
- If not configured: mark **SKIP** (note which ORCHESTRATOR steps require it)

### 3. Check Plugin Registration

Verify the master-starter-kit plugin is loaded:
- Read `.claude/settings.json` or `.claude/settings.local.json`
- Check that `master-starter-kit` appears in plugin list
- Verify commands are accessible (attempt to list `/bootstrap`, `/resume`, etc.)

### 4. Check File System

```
- Kit root accessible: {path}
- ORCHESTRATOR.md readable: {yes/no}
- PLACEHOLDER-REGISTRY.md readable: {yes/no}
- LESSONS-LEARNED.md readable: {yes/no}
- scripts/validate-kit.sh executable: {yes/no}
- dev_docs/ directory exists: {yes/no} (only if project already bootstrapped)
```

### 5. Check Git Status

```
- Git repository: {yes/no}
- Current branch: {branch name}
- Uncommitted changes: {count}
- Remote configured: {yes/no}
```

### 6. Report

```
HEALTH CHECK RESULTS
====================
Environment:  {OK/WARN/FAIL}
MCP Servers:  {X}/{Y} operational
  - Firecrawl: {OK/WARN/SKIP}
  - Context7:  {OK/WARN/SKIP}
  - Playwright: {OK/WARN/SKIP}
  - Gemini:    {OK/WARN/SKIP}
Plugin:       {OK/FAIL}
File System:  {OK/FAIL}
Git:          {OK/WARN}

{If any WARN or FAIL:}
RECOMMENDATIONS
===============
- {specific fix for each issue}

{If all OK:}
All systems operational. Ready to run /bootstrap or /resume.
```

## When to Run

- **Before /bootstrap** — ensures MCP servers are ready for Tribunal research
- **Before /resume** — ensures environment matches what was used in previous session
- **After MCP server configuration changes** — verify new servers are responding
- **When the ORCHESTRATOR reports unexpected errors** — diagnose tool availability

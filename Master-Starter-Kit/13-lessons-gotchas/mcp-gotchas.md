# MCP Server Gotchas

Model Context Protocol (MCP) servers extend Claude Code with external tools. Configuration is straightforward but the failure modes are silent — servers that do not start simply do not appear in the tool list, with no error message.

---

## Config File: .claude.json, NOT settings.json

The most common MCP configuration mistake is putting the server config in the wrong file.

```
~/.claude.json          <-- MCP servers go HERE
~/.claude/settings.json <-- Permissions and enabledPlugins only
```

```jsonc
// ~/.claude.json — CORRECT location for MCP servers
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-playwright"]
    }
  }
}
```

```jsonc
// ~/.claude/settings.json — NOT for MCP servers
{
  "permissions": { /* ... */ },
  "enabledPlugins": ["superpowers", "commit-commands"]
}
```

**Symptom:** MCP server tools do not appear after configuring.
**Fix:** Move the config to `~/.claude.json`.

---

## Restart After Config Changes

MCP server configuration is loaded at Claude Code startup. Editing the config while Claude Code is running has no effect until restart.

**After editing ~/.claude.json:**
1. Stop Claude Code (Ctrl+C in terminal)
2. Close the VS Code terminal
3. Reopen Claude Code
4. Verify tools are available

**Symptom:** New MCP server tools not available after config edit.
**Fix:** Restart Claude Code.

---

## Deferred Tools: ToolSearch Before Calling

MCP server tools are "deferred" — they are not loaded into Claude Code's context until explicitly discovered via ToolSearch.

```
WRONG workflow:
  1. Call mcp__context7__query-docs directly
  2. Error: tool not found

CORRECT workflow:
  1. ToolSearch("context7")           <-- Loads the tool
  2. Call mcp__context7__query-docs    <-- Now available
```

**Symptom:** "Tool not found" error when calling an MCP tool you know is configured.
**Fix:** Call ToolSearch with a keyword or `select:toolname` before calling the tool.

---

## HTTP vs stdio Transport

MCP servers use two transport types. The configuration is different for each.

### stdio (Most Common)

The MCP server runs as a local process. Claude Code communicates via stdin/stdout.

```jsonc
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### HTTP

The MCP server runs as a remote HTTP service.

```jsonc
{
  "mcpServers": {
    "remote-tool": {
      "type": "http",
      "url": "https://mcp-server.example.com/mcp"
    }
  }
}
```

**Gotcha:** Do not mix the two formats. An HTTP server configured as stdio will fail silently. A stdio server configured as HTTP will fail with connection errors.

---

## API Keys in MCP Config

MCP servers that require API keys store them in an `env` block within the MCP config, NOT in your project's `.env` file.

```jsonc
// ~/.claude.json
{
  "mcpServers": {
    "gemini": {
      "command": "npx",
      "args": ["-y", "gemini-mcp-server@latest"],
      "env": {
        "GEMINI_API_KEY": "AIza...",
        "GEMINI_OUTPUT_DIR": "C:/Users/USER/project/public/images"
      }
    }
  }
}
```

**Symptom:** MCP server starts but API calls fail with "unauthorized" or "missing API key."
**Fix:** Add the API key to the `env` block in the MCP config, not to your project `.env`.

---

## Gemini MCP: Output Directory

The Gemini MCP server generates images and saves them to a local directory. You must set `GEMINI_OUTPUT_DIR` to a path within your project.

```jsonc
"env": {
  "GEMINI_OUTPUT_DIR": "C:/Users/USER/Desktop/project/V3/apps/web/public/images"
}
```

**Gotcha:** Use an absolute path. Relative paths resolve from the MCP server's working directory, not your project's directory.

**Gotcha:** The directory must exist before calling the image generation tool. Create it if it does not exist.

---

## Tool Availability: Not All Tools Are Immediate

Some MCP servers have tools that require setup or initialization before they can be used.

**Playwright MCP:**
- `browser_navigate` requires a browser instance
- Call `browser_install` first if Playwright browsers are not installed
- Browser state (cookies, localStorage) does not persist between sessions

**Stitch MCP:**
- `generate_screen_from_text` requires a project to exist first
- Call `create_project` before generating screens

**Gemini MCP:**
- Image generation requires sufficient API quota
- Large requests may time out — use smaller batch sizes

---

## Common MCP Server Setup

### context7 (Library Docs)

```jsonc
{
  "context7": {
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp@latest"]
  }
}
```
No API key needed. Provides `resolve-library-id` and `query-docs` tools.

### Playwright (Browser Automation)

```jsonc
{
  "playwright": {
    "command": "npx",
    "args": ["@anthropic-ai/mcp-playwright"]
  }
}
```
No API key needed. Install browsers with `browser_install` on first use.

### Gemini (AI Features)

```jsonc
{
  "gemini": {
    "command": "npx",
    "args": ["-y", "gemini-mcp-server@latest"],
    "env": {
      "GEMINI_API_KEY": "your-api-key",
      "GEMINI_OUTPUT_DIR": "/absolute/path/to/output"
    }
  }
}
```
Requires Google AI API key from [aistudio.google.com](https://aistudio.google.com).

### Firecrawl (Web Scraping)

```jsonc
{
  "firecrawl": {
    "command": "npx",
    "args": ["-y", "firecrawl-mcp"],
    "env": {
      "FIRECRAWL_API_KEY": "your-api-key"
    }
  }
}
```
Requires API key from [firecrawl.dev](https://firecrawl.dev).

---

## Debugging MCP Servers

When an MCP server is not working:

1. **Check config location:** Is it in `~/.claude.json` (not `settings.json`)?
2. **Check syntax:** Is the JSON valid? Use a JSON validator.
3. **Check command:** Can you run the command manually in a terminal?
   ```bash
   npx -y @upstash/context7-mcp@latest
   # Should start without error
   ```
4. **Check env vars:** Are API keys set in the `env` block?
5. **Restart:** Did you restart Claude Code after editing the config?
6. **Check npm:** Is the package name correct? Is it published?
   ```bash
   npm view @upstash/context7-mcp
   ```

If all of the above check out and the server still does not work, check for version incompatibilities or open issues on the MCP server's GitHub repository.

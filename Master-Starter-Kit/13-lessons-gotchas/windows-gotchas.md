# Windows Gotchas

Windows-specific traps when developing with Node.js, Claude Code, and MCP servers. Most documentation assumes macOS/Linux. These are the differences that matter.

---

## MCP Server Configuration: Command Format

On Windows, stdio MCP servers use `"command": "npx"` directly. No `cmd /c` wrapper is needed.

```jsonc
// CORRECT — direct npx command
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}

// WRONG — unnecessary cmd wrapper
{
  "mcpServers": {
    "context7": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

**Symptom:** MCP server fails to start, or starts but immediately exits.
**Fix:** Use `"command": "npx"` directly with args as an array.

---

## MCP Config File Locations

Two files, two purposes. Do not confuse them.

| File | Location | Contains |
|------|----------|----------|
| `.claude.json` | `~/.claude.json` (user home) | mcpServers, metadata, OAuth info |
| `settings.json` | `~/.claude/settings.json` | permissions, enabledPlugins |

```
C:\Users\USER\.claude.json           <-- MCP servers go here
C:\Users\USER\.claude\settings.json  <-- Permissions go here
```

**Symptom:** You add an MCP server to `settings.json` and it does not appear.
**Fix:** Add MCP server config to `.claude.json`, not `settings.json`.

---

## After Editing MCP Config: Restart Required

After editing `~/.claude.json` to add or modify MCP servers, you MUST restart Claude Code in VS Code. The config is read at startup only.

**Steps:**
1. Edit `~/.claude.json`
2. Close Claude Code (Ctrl+C in terminal, or close the VS Code terminal)
3. Reopen Claude Code
4. Verify the MCP server is available (try calling one of its tools)

**Symptom:** You added a new MCP server but its tools are not available.
**Fix:** Restart Claude Code.

---

## echo Command: Trailing Newline

Windows `echo` adds a trailing newline (`\n`) to piped output. This corrupts environment variables, secrets, and any value that is sensitive to whitespace.

```bash
# WRONG — adds trailing \n
echo "my-secret-value" | vercel env add SECRET production
# Stored as: "my-secret-value\n"

# CORRECT — no trailing newline
node -e "process.stdout.write('my-secret-value')" | vercel env add SECRET production
# Stored as: "my-secret-value"
```

**This affects:**
- `vercel env add` — corrupts env var values
- Piping to any tool that reads stdin
- Creating files with `echo > file.txt`

**How to verify:**
```bash
# Check for trailing newlines in a file
node -e "const fs=require('fs');const c=fs.readFileSync('.env.local','utf8');console.log(JSON.stringify(c))"
# Look for \n at the end of values
```

---

## Path Separators

Windows uses backslashes (`\`), Unix uses forward slashes (`/`). Most Node.js tools accept forward slashes on Windows, but some do not.

```bash
# Works in most contexts (Node.js, pnpm, git)
packages/api/src/routers/trips.ts

# Required by some Windows-specific tools
packages\api\src\routers\trips.ts

# Best practice: use path.join() in Node.js code
import path from "path";
const filePath = path.join("packages", "api", "src", "routers", "trips.ts");
```

**Where forward slashes fail on Windows:**
- Windows Explorer "Open in Terminal" commands
- Some PowerShell cmdlets
- Windows batch files (.bat, .cmd)

**Where forward slashes work fine:**
- Node.js `fs` module
- pnpm / npm commands
- git commands
- VS Code integrated terminal (bash, zsh, or PowerShell)

---

## Line Endings: CRLF vs LF

Windows uses `\r\n` (CRLF). Unix uses `\n` (LF). Mixing them causes:
- Git diffs that show every line as changed
- Bash scripts that fail with `\r: command not found`
- Lint errors on every file

### Fix: Configure Git

```bash
# Set global autocrlf — converts to LF on commit, CRLF on checkout
git config --global core.autocrlf true
```

### Fix: Add .gitattributes

```
# .gitattributes (commit this to the repo)
* text=auto eol=lf
*.sh text eol=lf
*.bat text eol=crlf
```

This forces LF line endings in the repository regardless of the developer's OS.

### Fix: Configure Editor

In VS Code, set default line endings:
```jsonc
// .vscode/settings.json
{
  "files.eol": "\n"
}
```

---

## Node.js Version Manager

On Windows, use one of these for managing Node.js versions:

**nvm-windows:** https://github.com/coreybutler/nvm-windows
```bash
nvm install 20
nvm use 20
```

**fnm (Fast Node Manager):** https://github.com/Schniz/fnm
```bash
fnm install 20
fnm use 20
```

**Gotcha:** nvm-windows and the Unix nvm are DIFFERENT tools with different commands. Do not follow Unix nvm tutorials on Windows.

---

## Long Path Support

Windows has a default path length limit of 260 characters. Node.js monorepos with deeply nested `node_modules` often exceed this.

**Enable long paths:**
1. Open Group Policy Editor (gpedit.msc)
2. Navigate to: Computer Configuration > Administrative Templates > System > Filesystem
3. Enable "Enable Win32 long paths"

**Or via registry:**
```
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem
LongPathsEnabled = 1 (DWORD)
```

**Symptom:** `ENAMETOOLONG` errors during `pnpm install`, or files that cannot be deleted.
**Fix:** Enable long path support. This is a one-time system setting.

---

## Process Termination

On Windows, Ctrl+C sometimes does not kill child processes (e.g., the Next.js dev server spawned by Playwright).

```bash
# If a process is stuck on a port:
netstat -ano | findstr :3000
# Find the PID and kill it:
taskkill /PID <pid> /F
```

**Or use the cross-platform approach:**
```bash
npx kill-port 3000
```

**Symptom:** "Port 3000 is already in use" when starting the dev server.
**Fix:** Kill the orphaned process, then restart.

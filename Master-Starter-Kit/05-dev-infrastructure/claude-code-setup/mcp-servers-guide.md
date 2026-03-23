# MCP Servers Setup Guide

MCP (Model Context Protocol) servers extend Claude Code with external tool access. This guide covers setup for each server, including configuration, verification, and fallback alternatives.

---

## How MCP Servers Work

- MCP servers run as background processes that Claude Code communicates with via JSON-RPC.
- Configuration goes in `.claude/settings.json` (committed) or `.claude/settings.local.json` (gitignored, for API keys).
- Some servers are auto-configured by plugins (Context7, Playwright) — no manual setup needed.
- Servers start on-demand when Claude Code needs them and shut down when the session ends.

---

## Configuration Locations

MCP servers can be configured at two levels:

| Location | Scope | Committed to Git? | Use For |
|----------|-------|-------------------|---------|
| `.claude/settings.json` | Project-level | Yes | Servers without secrets |
| `.claude/settings.local.json` | Project-level | No (gitignored) | Servers with API keys |
| `~/.claude.json` | User-level (all projects) | N/A | Personal servers you want everywhere |

All use the same `mcpServers` key format:

```jsonc
// .claude/settings.json, .claude/settings.local.json, or ~/.claude.json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": {
        "API_KEY": "your-key-here"
      }
    }
  }
}
```

**Rule of thumb:** If the config includes an API key, put it in `settings.local.json` (project) or `~/.claude.json` (global) — never in committed files.

---

## Server 1: Firecrawl

**Purpose:** Web scraping and crawling — extract content from competitor websites, documentation, or any public URL. Converts pages to clean markdown.

### Setup

1. Get an API key from [firecrawl.dev](https://www.firecrawl.dev/)

2. Add to `.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-your-key-here"
      }
    }
  }
}
```

### Verification

Ask Claude: "Use Firecrawl to scrape https://example.com and summarize the content."

Claude should use the `firecrawl_scrape` tool and return structured markdown content.

### Available Tools

| Tool | Purpose |
|------|---------|
| `firecrawl_scrape` | Scrape a single URL to markdown |
| `firecrawl_crawl` | Crawl an entire site (follows links) |
| `firecrawl_map` | Get sitemap/URL list for a domain |
| `firecrawl_search` | Search the web and scrape results |
| `firecrawl_extract` | Extract structured data from a page |

### Fallback (No API Key)

If you do not have a Firecrawl API key, Claude Code can achieve similar results with built-in tools:

```
WebFetch: Fetches a URL and processes it with a prompt.
  - "Fetch https://competitor.com and extract their pricing tiers"
  - Works for public pages, no API key needed
  - Cannot crawl entire sites or follow links

WebSearch: Searches the web for information.
  - "Search for [competitor name] pricing page"
  - Combine with WebFetch to scrape the results
```

**Limitations of fallback:** Cannot crawl multiple pages, no structured extraction, may fail on JavaScript-heavy sites.

---

## Server 2: Gemini

**Purpose:** Deep research, image analysis, code analysis, video analysis, and extended reasoning. Uses Google's Gemini models as a secondary AI for specialized tasks.

### Setup

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/)

2. Add to `.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "gemini": {
      "command": "npx",
      "args": ["-y", "@anthropic/gemini-mcp"],
      "env": {
        "GEMINI_API_KEY": "AIza-your-key-here"
      }
    }
  }
}
```

### Verification

Ask Claude: "Use Gemini to do deep research on the best practices for Next.js App Router authentication in 2026."

Claude should invoke a Gemini tool and return comprehensive research results.

### Available Tools

| Tool | Purpose |
|------|---------|
| `gemini-deep-research` | Multi-step research with source synthesis |
| `gemini-analyze-image` | Analyze screenshots, diagrams, mockups |
| `gemini-analyze-code` | Secondary AI code review |
| `gemini-analyze-url` | Analyze a web page |
| `gemini-search` | Web search via Gemini |
| `gemini-run-code` | Execute code snippets |
| `gemini-generate-image` | Generate images |
| `gemini-youtube` | Analyze YouTube videos |
| `gemini-summarize-pdf` | Summarize PDF documents |

### Fallback (No API Key)

```
WebSearch: For research tasks.
  - "Search for Next.js App Router authentication best practices 2026"
  - Returns search results with links

WebFetch: For analyzing URLs.
  - "Fetch https://nextjs.org/docs/app/building-your-application/authentication and summarize"

Read: For analyzing local images.
  - Claude Code can read and analyze image files natively (PNG, JPG, etc.)
```

**Limitations of fallback:** No deep multi-step research, no video analysis, no secondary AI perspective.

---

## Server 3: Sequential Thinking

**Purpose:** Multi-perspective reasoning for complex decisions. Forces step-by-step analysis with the ability to revise and branch thinking paths. Excellent for architecture decisions, debugging complex issues, and trade-off analysis.

### Setup

Add to `.claude/settings.json` (no API key needed):

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@anthropic/sequential-thinking-mcp"]
    }
  }
}
```

### Verification

Ask Claude: "Use sequential thinking to analyze whether we should use server actions or API routes for form submissions in our Next.js app."

Claude should invoke the `sequentialthinking` tool and work through the problem step by step.

### Available Tools

| Tool | Purpose |
|------|---------|
| `sequentialthinking` | Step-by-step reasoning with revision capability |

### Fallback (No MCP)

Sequential thinking is a reasoning pattern, not an external service. You can approximate it by prompting Claude directly:

```
"Think through this step by step. Consider at least 3 different approaches,
list the trade-offs of each, then recommend one with your reasoning.
Feel free to revise earlier conclusions if later analysis changes your mind."
```

**Limitations of fallback:** Claude may skip steps or not revise earlier thinking. The MCP server enforces the structured reasoning pattern.

---

## Server 4: Context7 (Auto-Configured)

**Purpose:** Fetches up-to-date library documentation. When you ask about a React hook, a Tailwind class, or a Prisma method, Context7 pulls the latest docs instead of relying on training data.

### Setup

**Automatic** — installed with the `context7@claude-plugins-official` plugin. No additional configuration needed.

If you need to configure it manually:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@anthropic/context7-mcp"]
    }
  }
}
```

### Verification

Ask Claude: "What are the props for the Next.js 16 Link component? Use Context7 to check the latest docs."

Claude should use `resolve-library-id` and `query-docs` tools to fetch live documentation.

### Available Tools

| Tool | Purpose |
|------|---------|
| `resolve-library-id` | Find the Context7 ID for a library |
| `query-docs` | Query documentation for a specific library |

### Fallback (No MCP)

```
WebSearch: Search for library documentation.
  - "Next.js 16 Link component props site:nextjs.org"

WebFetch: Fetch the documentation page.
  - "Fetch https://nextjs.org/docs/app/api-reference/components/link and list all props"
```

**Limitations of fallback:** Manual process, may return outdated cached results, requires knowing the docs URL.

---

## Server 5: Playwright (Auto-Configured)

**Purpose:** Browser automation — navigate to URLs, click buttons, fill forms, take screenshots, run E2E tests interactively. Essential for visual verification and debugging.

### Setup

**Automatic** — installed with the `playwright@claude-plugins-official` plugin.

First, install Playwright browsers:

```bash
npx playwright install
```

If you need to configure it manually:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@anthropic/playwright-mcp"]
    }
  }
}
```

### Verification

Ask Claude: "Navigate to http://localhost:3000 and take a screenshot."

Claude should use `browser_navigate` and `browser_take_screenshot` tools.

### Available Tools

| Tool | Purpose |
|------|---------|
| `browser_navigate` | Go to a URL |
| `browser_click` | Click an element |
| `browser_fill_form` | Fill in form fields |
| `browser_take_screenshot` | Capture the page |
| `browser_snapshot` | Get accessibility tree snapshot |
| `browser_evaluate` | Run JavaScript in the page |
| `browser_wait_for` | Wait for an element or condition |
| `browser_close` | Close the browser |

### Fallback (No MCP)

There is no good fallback for browser automation. Without Playwright:

- You cannot take screenshots of your running app.
- You cannot interact with the UI programmatically.
- You must manually verify UI changes.

**Recommendation:** Always install Playwright. It is the most impactful MCP server for frontend development.

---

## Server 6: Superdesign (Optional)

**Purpose:** Design system generation — creates logos, icons, illustrations, and design assets. Useful for prototyping and generating placeholder assets.

### Setup

```json
{
  "mcpServers": {
    "superdesign": {
      "command": "npx",
      "args": ["-y", "@anthropic/superdesign-mcp"],
      "env": {
        "SUPERDESIGN_API_KEY": "your-key-here"
      }
    }
  }
}
```

### Verification

Ask Claude: "Use Superdesign to generate a logo for my project."

### Available Tools

| Tool | Purpose |
|------|---------|
| `superdesign_generate` | Generate design assets |
| `superdesign_iterate` | Refine a generated design |
| `superdesign_gallery` | Browse generated designs |
| `superdesign_extract_system` | Extract design tokens from an image |

### Fallback (No MCP)

```
WebSearch: Find design inspiration.
  - "Modern SaaS dashboard design inspiration logistics"

Gemini (if available): Generate images.
  - Use gemini-generate-image for quick mockups

Manual: Use Figma, Canva, or another design tool for production assets.
```

**Skip if:** You have a designer on the team or are using an existing design system.

---

## Server 7: Figma (Optional)

**Purpose:** Import designs from Figma — extract components, design tokens, variables, and layout information. Bridges the design-to-code gap.

### Setup

Requires Figma API access. Follow the [Claude AI Figma MCP setup guide](https://github.com/anthropics/claude-figma-mcp).

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic/claude-figma-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-figma-token"
      }
    }
  }
}
```

### Verification

Ask Claude: "Get the metadata for this Figma file: [paste Figma URL]."

### Available Tools

| Tool | Purpose |
|------|---------|
| `get_design_context` | Extract component specs from a Figma frame |
| `get_metadata` | Get file structure and pages |
| `get_screenshot` | Capture a Figma frame as an image |
| `get_variable_defs` | Extract design tokens / variables |
| `get_code_connect_suggestions` | Map Figma components to code |

### Fallback (No MCP)

```
Read: Claude Code can read screenshot images natively.
  - Export Figma frames as PNG, then ask Claude to analyze them
  - "Read this screenshot and implement the UI in React + Tailwind"

Manual: Export design tokens from Figma as JSON and provide them to Claude.
```

**Skip if:** You are not using Figma or your design system is already implemented in code.

---

## Server 8: Magic / MagicUI (Optional)

**Purpose:** Pre-built animated component library — provides production-ready UI components with animations, backgrounds, and special effects. Speeds up frontend development with polished UI elements.

### Setup

Auto-configured if using the Magic or MagicUI plugins. For manual setup:

```json
{
  "mcpServers": {
    "magic": {
      "command": "npx",
      "args": ["-y", "@anthropic/magic-mcp"]
    },
    "magicui": {
      "command": "npx",
      "args": ["-y", "@anthropic/magicui-mcp"]
    }
  }
}
```

### Verification

Ask Claude: "Show me available MagicUI button components."

### Available Tools

| Tool | Purpose |
|------|---------|
| `21st_magic_component_builder` | Build custom animated components |
| `21st_magic_component_inspiration` | Browse component gallery |
| `getAnimations` | List animation components |
| `getButtons` | List button variants |
| `getBackgrounds` | List background effects |
| `getUIComponents` | List general UI components |
| `getSpecialEffects` | List special effects (particles, etc.) |

### Fallback (No MCP)

```
WebSearch: Find component libraries.
  - "Best React animation component libraries 2026"
  - "shadcn/ui animated components"

WebFetch: Browse component library docs.
  - "Fetch https://magicui.design/docs and list available components"

Manual: Use shadcn/ui, Radix, or Framer Motion directly.
```

**Skip if:** You are using a custom design system or do not need pre-built animated components.

---

## Server 9: Stitch (Optional)

**Purpose:** AI-powered UI concept generation from Google. Creates HTML/Tailwind mockups from text descriptions. Useful for rapid prototyping before building real components.

### Setup

Requires a Google API key with Stitch API enabled.

```json
{
  "mcpServers": {
    "stitch": {
      "type": "http",
      "url": "https://stitch.withgoogle.com/mcp/sse",
      "headers": {
        "x-api-key": "your-google-stitch-key"
      }
    }
  }
}
```

### Available Tools

| Tool | Purpose |
|------|---------|
| `generate_screen_from_text` | Create UI mockup from a text prompt |
| `edit_screens` | Modify generated screens |
| `generate_variants` | Create variations of a screen |
| `list_projects` / `get_project` | Manage generated projects |

### Fallback (No MCP)

Use the Magic or MagicUI servers for component generation, or describe the UI to Claude and have it generate React + Tailwind code directly.

**Skip if:** You prefer to design in Figma or code UI directly.

---

## Server 10: UI Expert (Optional)

**Purpose:** WCAG accessibility auditing and design token validation. Checks components for accessibility violations, contrast ratios, keyboard navigation, and design system compliance.

### Setup

No API key required:

```json
{
  "mcpServers": {
    "ui-expert": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/ui-expert-mcp@latest"]
    }
  }
}
```

### Available Tools

| Tool | Purpose |
|------|---------|
| Accessibility audit | Check components for WCAG 2.1 AA/AAA compliance |
| Contrast validation | Verify color contrast ratios |
| Design token check | Validate design system compliance |

### Fallback (No MCP)

Use Lighthouse CI for accessibility auditing, or ask Claude to manually review components against WCAG guidelines.

**Skip if:** You have a dedicated accessibility testing pipeline.

---

## Combined Configuration Example

Here is a complete `.claude/settings.local.json` with all servers configured:

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-your-key"
      }
    },
    "gemini": {
      "command": "npx",
      "args": ["-y", "@anthropic/gemini-mcp"],
      "env": {
        "GEMINI_API_KEY": "AIza-your-key"
      }
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@anthropic/sequential-thinking-mcp"]
    }
  }
}
```

Note: Context7, Playwright, Magic, and MagicUI are auto-configured by their respective plugins and do not need entries here unless you want to override defaults.

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Server fails to start | Run `npx -y <package>` manually to check for errors |
| API key rejected | Verify key in settings.local.json, check for trailing whitespace |
| Tool not found | Restart Claude Code session; MCP servers load at session start |
| Timeout errors | Check network; some servers need time to initialize on first run |
| "npx not found" | Ensure Node.js is installed and `npx` is on your PATH |
| Server crashes mid-session | Check Node.js version (18+ required); restart session |

### Checking Server Status

To see which MCP servers are connected in the current session, ask Claude:

```
"What MCP servers are currently connected?"
```

Or use the ToolSearch tool to browse available MCP-provided tools.

---

## Windows-Specific Notes

- Use `"command": "npx"` directly. Do **not** wrap with `cmd /c` or `cmd.exe`. Claude Code on Windows handles npx natively.
- Paths in `env` values should use forward slashes or escaped backslashes.
- Some MCP servers download on first run via `npx -y`. This may take 30-60 seconds the first time.

---

## API Key Costs

| Server | Free Tier | Paid |
|--------|-----------|------|
| Sequential Thinking | Free (local) | N/A |
| Context7 | Free (plugin) | N/A |
| Playwright | Free (plugin) | N/A |
| UI Expert | Free (local) | N/A |
| MagicUI | Free (local) | N/A |
| Gemini | Generous free tier | Pay per token |
| Firecrawl | 500 credits free | $19/mo+ |
| Magic (21st.dev) | Limited free | $10/mo+ |
| Stitch | Free preview | TBD |
| Superdesign | Limited free | Contact for pricing |
| Figma | Free with Figma account | N/A |

---

## Server Priority Guide

If you are limited on setup time or API keys, install in this priority order:

1. **Context7** (free, auto via plugin) — library docs are always useful
2. **Playwright** (free, auto via plugin) — visual verification is essential
3. **Sequential Thinking** (free, no API key) — better reasoning for complex decisions
4. **Firecrawl** (paid, API key) — needed for competitive research
5. **Gemini** (free tier available, API key) — deep research and image analysis
6. **Figma** (free with Figma account) — only if you use Figma
7. **Superdesign** (paid) — only for design asset generation
8. **Magic/MagicUI** (free) — only if you want pre-built animated components

# 10 - Lessons & Gotchas

## How to Use This Section

**Read the relevant file BEFORE working with that technology.** Not after. Not "when you run into a problem." Before.

These are lessons paid for with hours of debugging. Each gotcha entry represents real time lost, real frustration endured, and a real resolution discovered. Do not pay the same price twice.

## When to Add New Gotchas

When you discover something that:
- Took more than 30 minutes to debug
- Had a non-obvious root cause
- Would trip up someone new to the technology
- Contradicts documentation or common assumptions
- Is specific to your stack combination (not just a general coding mistake)

Add it to the appropriate file. Include:
1. **Severity** — see Severity Tiers below
2. **What happened** (the symptom — what error message or behavior did you see?)
3. **Why it happened** (the root cause)
4. **How to fix it** (the solution)
5. **How to prevent it** (the guard — lint rule, test, grep pattern if possible)
6. **Applies to** (technology versions where this gotcha is confirmed)

## Severity Tiers

Every gotcha should be tagged with a severity level:

| Severity     | Label            | Meaning                                                  | Examples                                                                          |
| ------------ | ---------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **CRITICAL** | `🔴 CRITICAL` | Data loss, security vulnerability, or production outage  | Unencrypted secrets in env, missing auth middleware, cascade delete without guard  |
| **HIGH**     | `🟠 HIGH`     | Blocks deployment or causes user-facing bugs             | Build failures, broken migrations, auth redirect loops                            |
| **MEDIUM**   | `🟡 MEDIUM`   | Causes bugs that are recoverable or affect DX            | Flaky tests, type errors in edge cases, stale cache                               |
| **LOW**      | `🟢 LOW`      | Cosmetic issues, DX annoyances, or minor inefficiencies  | Wrong font loading, slow HMR, verbose console output                              |

**When adding a new gotcha, always include the severity label at the start of the entry heading:**

```markdown
### 🟠 HIGH — Drizzle pgSchema breaks migration generation

**Error you'll see:** `relation "public.users" does not exist`
**Applies to:** Drizzle ORM v0.30+, PostgreSQL with custom schemas
...
```

### Detection Patterns

Where possible, include a detection pattern — a grep command, lint rule, or test that catches the gotcha automatically:

```markdown
**Detection:** `grep -r "process.env\." --include="*.ts" src/ | grep -v "process.env.NODE_ENV"`
**Lint rule:** `no-process-env` (eslint-plugin-node)
```

## Files in This Section

| File | Covers |
|------|--------|
| [auth-gotchas.md](./auth-gotchas.md) | Better Auth, NextAuth, Clerk — required columns, CORS, cookies, client types |
| [database-gotchas.md](./database-gotchas.md) | Drizzle ORM, Supabase, Prisma — SSL, pgSchema, enums, migrations |
| [nextjs-gotchas.md](./nextjs-gotchas.md) | App Router, Server/Client components, proxy.ts, Turbopack, shadcn |
| [trpc-gotchas.md](./trpc-gotchas.md) | Error codes, context, procedures, superjson, batching |
| [deployment-gotchas.md](./deployment-gotchas.md) | Vercel CLI, Root Directory, framework detection, env vars |
| [typescript-gotchas.md](./typescript-gotchas.md) | noUncheckedIndexedAccess, enum widening, module resolution, strict mode |
| [testing-gotchas.md](./testing-gotchas.md) | Vitest, Playwright, coverage, flaky tests, accessible selectors |
| [windows-gotchas.md](./windows-gotchas.md) | MCP config, echo newlines, path separators, line endings |
| [design-gotchas.md](./design-gotchas.md) | Default shadcn trap, design-before-code, slop accumulation, empty states |
| [mcp-gotchas.md](./mcp-gotchas.md) | Config location, deferred tools, HTTP vs stdio, API keys |
| [ai-workflow-gotchas.md](./ai-workflow-gotchas.md) | Write tool, context compaction, parallel agents, verification |
| [react-native-gotchas.md](./react-native-gotchas.md) | Expo managed/bare, Metro monorepo, EAS Build, Hermes, New Architecture |
| [flutter-gotchas.md](./flutter-gotchas.md) | Null safety, platform channels, widget keys, CocoaPods, Gradle |
| [mobile-deployment-gotchas.md](./mobile-deployment-gotchas.md) | App Store rejections, code signing, EAS, TestFlight, Play Store |

## The Pattern

Every gotcha follows the same lifecycle:

```
1. Encounter the problem (waste 1-4 hours)
2. Discover the root cause (often non-obvious)
3. Fix the immediate issue
4. Document the gotcha (this section)
5. Never encounter it again
```

Step 4 is what separates teams that move fast from teams that keep tripping over the same rocks. Do not skip step 4.

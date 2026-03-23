# Sanitization Rules

All feedback candidates are sanitized before leaving the project. This protects client confidentiality and ensures only generalizable knowledge flows back to the kit.

## Always Strip

| Category | Examples | Replacement |
|----------|----------|-------------|
| Project names | "Acme Dashboard", "Project Neptune" | "the project", "the application" |
| Client/company names | "Acme Corp", "John's Bakery" | "the client", "the business" |
| Domain names | `acme.com`, `api.neptune.io` | `example.com`, `api.example.com` |
| IP addresses | `192.168.1.100`, `10.0.0.5` | `<IP_ADDRESS>` |
| URLs | `https://acme.com/api/v2` | `https://example.com/api/v2` |
| API keys & tokens | `sk_live_abc123`, `ghp_xyz789` | `<API_KEY>`, `<TOKEN>` |
| Env var values | `DATABASE_URL=postgres://user:pass@host/db` | `DATABASE_URL=<CONNECTION_STRING>` |
| Database connection strings | `postgres://admin:secret@db.acme.com:5432/prod` | `postgres://<USER>:<PASS>@<HOST>:<PORT>/<DB>` |
| User/employee names | "Built by Sarah", "John's PR" | "a team member", "a contributor" |
| Email addresses | `sarah@acme.com` | `<EMAIL>` |
| Business-specific terms | "invoice dunning workflow", "meal prep algorithm" | Generic: "the billing workflow", "the core algorithm" |
| Revenue/financial figures | "$50K MRR", "2,400 paying users" | "the business metrics" |
| Internal tool names | "AcmeBot", "NeptuneSync" | "the internal tool", "the sync service" |

## Always Keep

| Category | Examples | Why |
|----------|----------|-----|
| Technology names | Next.js, Drizzle, Stripe, PostgreSQL | Essential for the lesson's applicability |
| Library versions | `better-auth@1.2.3`, `next@16.0.0` | Version-specific gotchas need version context |
| Error messages | `TypeError: Cannot read property 'x' of undefined` | Core of the gotcha; genericize file paths within |
| Stack traces | (with paths genericized) | Helps identify the issue pattern |
| Configuration patterns | `turbopack: { ... }`, `drizzle.config.ts` | The actual fix/pattern |
| Code snippets | Functions, components, configs | The generalizable solution (with names genericized) |
| CLI commands | `npx drizzle-kit push`, `vercel deploy` | Reproduction steps |
| HTTP status codes | 401, 500, 422 | Part of the technical pattern |
| File paths (generic) | `src/lib/auth.ts`, `app/api/route.ts` | Structure patterns (genericize project-specific segments) |

## Sanitization Process

### Step 1: Automated Pass

The `/kit-feedback` skill runs these transformations automatically:

1. **Scan for project identifiers** -- read `.kit-feedback-config.json` for `project_name` and `client_name`, replace all occurrences
2. **URL/domain replacement** -- regex match URLs and domains, replace with `example.com` variants
3. **Credential detection** -- regex patterns for API keys (`sk_`, `pk_`, `ghp_`, `Bearer `), tokens, connection strings
4. **Email detection** -- standard email regex, replace with `<EMAIL>`
5. **IP detection** -- IPv4/IPv6 patterns, replace with `<IP_ADDRESS>`
6. **Env var value stripping** -- in `.env` format lines, keep key names but replace values

### Step 2: User Review

After automated sanitization, the candidate is presented to the user with highlighted replacements. The user verifies:

- No project-specific details leaked through
- Replacements didn't destroy the meaning of the lesson
- The improvement is still understandable after sanitization

### Step 3: Export-Time Verification

When running `/kit-feedback export`, a final scan checks for:

- Any remaining non-generic domain names
- Any strings matching the project name or client name
- Any patterns that look like credentials

If any are found, the export pauses and asks the user to review.

## Edge Cases

### Code Snippets
Code that demonstrates a pattern should have:
- Variable names genericized (`acmeUser` → `user`, `bakeryOrder` → `order`)
- File paths genericized (`src/acme/` → `src/app/`)
- Import paths genericized if they reveal project structure

### Error Messages
Keep the error message verbatim, but genericize any file paths within:
- `Error in /Users/sarah/acme-dashboard/src/auth.ts` → `Error in src/auth.ts`

### Database Schemas
Table/column names that reveal business logic should be genericized:
- `meal_prep_recipes` → `items` or `records`
- Keep generic names like `users`, `sessions`, `posts`

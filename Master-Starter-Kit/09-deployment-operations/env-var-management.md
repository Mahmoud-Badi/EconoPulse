# Environment Variable Management

Environment variables are the most fragile part of deployment. A single trailing newline, a missing quote, or a variable set in the wrong environment will break your application in ways that are extremely difficult to debug.

---

## Setting Variables on Vercel

### Via Dashboard (Recommended for Most Cases)

1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add each variable with its value
3. Select which environments it applies to: Production, Preview, Development

### Via CLI

```bash
# Add a variable
vercel env add VARIABLE_NAME

# Add for specific environment
vercel env add VARIABLE_NAME production

# List all variables
vercel env ls

# Remove a variable
vercel env rm VARIABLE_NAME
```

### The Windows Trailing Newline Trap

On Windows, piping with `echo` adds a trailing `\n` to the value:

```bash
# WRONG — adds trailing newline
echo "my-secret-value" | vercel env add BETTER_AUTH_SECRET production
# Actual stored value: "my-secret-value\n"
# Result: auth breaks with mysterious "invalid signature" errors
```

```bash
# CORRECT — no trailing newline
node -e "process.stdout.write('my-secret-value')" | vercel env add BETTER_AUTH_SECRET production
```

This is one of the most insidious bugs you will encounter. The value looks correct in the dashboard (the newline is invisible), the error messages are not helpful, and you will waste hours before discovering the cause.

---

## Verification After Setting

Always verify env vars after setting them:

```bash
# Pull all env vars to a local file
vercel env pull .env.vercel-check

# Inspect the file — look for trailing whitespace/newlines
cat -A .env.vercel-check | grep BETTER_AUTH
# Should show: BETTER_AUTH_SECRET=my-secret-value$
# NOT: BETTER_AUTH_SECRET=my-secret-value\n$
```

Clean up the check file after verification:

```bash
rm .env.vercel-check
# Add to .gitignore to prevent accidental commits
echo ".env.vercel-check" >> .gitignore
```

---

## Variable Categories

### Public Variables (NEXT_PUBLIC_*)

```
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

**Rules:**
- Prefix with `NEXT_PUBLIC_` to make available in client-side code
- These are embedded in the JavaScript bundle at BUILD TIME
- NEVER put secrets, API keys, or passwords in public variables
- Changing these requires a new build/deployment

### Server Variables (No Prefix)

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
SENTRY_AUTH_TOKEN=...
STRIPE_SECRET_KEY=sk_live_...
```

**Rules:**
- Only available in server-side code (API routes, server components, tRPC routers)
- NOT accessible from the browser
- Safe for secrets, API keys, connection strings
- Changing these on Vercel takes effect immediately (no rebuild needed for serverless functions)

### Per-Environment Variables

Vercel supports three environments: Production, Preview, Development.

| Variable | Production | Preview | Development |
|----------|-----------|---------|-------------|
| `DATABASE_URL` | Production DB | Staging DB | Local DB |
| `BETTER_AUTH_URL` | `https://app.yourdomain.com` | `https://preview.yourdomain.com` | `http://localhost:3000` |
| `BETTER_AUTH_SECRET` | Strong random | Different random | Any string |

**Preview vs Production databases:** Use a separate database (or schema) for preview deployments. Otherwise, PR previews will read/write production data.

---

## .env File Structure

### .env.example (Committed to Git)

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
DIRECT_URL=postgresql://user:password@host:5432/dbname

# Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-here

# Public
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional
SENTRY_DSN=
POSTHOG_KEY=
```

**Purpose:** Documents every required env var. New developers copy this to `.env.local` and fill in values.

### .env.local (Never Committed)

```bash
# Actual values for local development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=dev-secret-not-for-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### .gitignore

```
.env
.env.local
.env.production
.env.vercel-check
.env*.local
```

**Rule:** NEVER commit .env files with real values. The .env.example with placeholder values is the only .env file that belongs in git.

---

## Troubleshooting

### "BETTER_AUTH_URL is undefined"

- Variable not set in the correct environment (Production vs Preview vs Development)
- Fix: Check Vercel Dashboard > Environment Variables, verify the variable exists for the correct environment

### "Cannot connect to database"

- `DATABASE_URL` has wrong connection string
- SSL not configured (Supabase requires `ssl: "require"` in postgres.js options)
- IP not allowlisted (some providers restrict IP access)
- Fix: `vercel env pull`, inspect the DATABASE_URL value, test connection locally with that value

### "Auth works locally but not in production"

- `BETTER_AUTH_URL` is set to `http://localhost:3000` in production
- Cookie secure flag mismatch (secure cookies require HTTPS)
- Fix: Verify `BETTER_AUTH_URL` matches the exact production domain (with https://)

### "Variable changed but not taking effect"

- Public variables (`NEXT_PUBLIC_*`) are embedded at build time — you need to redeploy
- Server variables take effect immediately for new function invocations, but may be cached
- Fix: Trigger a new deployment after changing public variables

---

## Security Rules

1. **Never commit secrets to git.** Not even in a "test" branch. Git history is permanent.
2. **Rotate secrets if exposed.** If a secret appears in a commit, it is compromised. Generate a new one immediately.
3. **Use different secrets per environment.** Production, preview, and development should never share secrets.
4. **Audit env vars quarterly.** Remove unused variables. Rotate long-lived secrets. Verify access.
5. **Use 1Password / Bitwarden for team sharing.** Never share secrets via Slack, email, or plain text files.

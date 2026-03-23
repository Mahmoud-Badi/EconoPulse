# Environment Variables Template

## .env.example

Copy this file to `.env` and fill in the values. Only include sections relevant to your chosen integrations.

```bash
# ============================================================================
# DATABASE
# ============================================================================
# Connection string for your PostgreSQL database.
# For Supabase: use the "Connection pooling" URL (port 6543) for DATABASE_URL
# and the "Direct connection" URL (port 5432) for DIRECT_URL.
# For local Docker: postgresql://postgres:postgres@localhost:5432/{project}
DATABASE_URL=postgresql://user:password@host:6543/database?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:5432/database

# ============================================================================
# AUTH
# ============================================================================
# Secret key for signing auth tokens. Generate with: openssl rand -base64 48
# MUST be at least 32 characters. Different value per environment.
BETTER_AUTH_SECRET=generate-a-random-64-character-string-here

# The canonical URL where your auth server runs.
# Development: http://localhost:3000
# Production: https://yourdomain.com (must match the actual domain)
BETTER_AUTH_URL=http://localhost:3000

# Public-facing app URL. Used for redirects, emails, CORS.
# Must match BETTER_AUTH_URL in most setups.
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ============================================================================
# PAYMENTS (if using Stripe)
# ============================================================================
# Stripe API keys from https://dashboard.stripe.com/apikeys
# Use test keys (sk_test_, pk_test_) for development.
# STRIPE_SECRET_KEY=sk_test_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe webhook secret from https://dashboard.stripe.com/webhooks
# Required for processing webhook events securely.
# STRIPE_WEBHOOK_SECRET=whsec_...

# ============================================================================
# EMAIL (if using SendGrid)
# ============================================================================
# SendGrid API key from https://app.sendgrid.com/settings/api_keys
# SENDGRID_API_KEY=SG.xxx

# Verified sender email address (must match SendGrid sender identity)
# EMAIL_FROM=noreply@yourdomain.com

# ============================================================================
# EMAIL (if using Resend)
# ============================================================================
# Resend API key from https://resend.com/api-keys
# RESEND_API_KEY=re_xxx

# ============================================================================
# SMS (if using Twilio)
# ============================================================================
# Twilio credentials from https://console.twilio.com
# TWILIO_ACCOUNT_SID=AC...
# TWILIO_AUTH_TOKEN=...
# TWILIO_PHONE_NUMBER=+1...

# ============================================================================
# MAPS / GEOCODING (if using Google Maps)
# ============================================================================
# Google Maps API key with Maps JavaScript API, Geocoding API, and
# Directions API enabled. Restrict to your domains in Google Cloud Console.
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...

# ============================================================================
# MAPS / GEOCODING (if using Mapbox)
# ============================================================================
# Mapbox access token from https://account.mapbox.com/access-tokens/
# NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.xxx

# ============================================================================
# FILE STORAGE (if using AWS S3)
# ============================================================================
# AWS credentials with S3 read/write permissions on your bucket.
# AWS_ACCESS_KEY_ID=AKIA...
# AWS_SECRET_ACCESS_KEY=...
# AWS_REGION=us-east-1
# AWS_S3_BUCKET={project}-uploads

# ============================================================================
# FILE STORAGE (if using Uploadthing)
# ============================================================================
# UPLOADTHING_SECRET=sk_live_...
# UPLOADTHING_APP_ID=...

# ============================================================================
# REAL-TIME (if using Pusher)
# ============================================================================
# PUSHER_APP_ID=...
# PUSHER_KEY=...
# PUSHER_SECRET=...
# PUSHER_CLUSTER=us2

# ============================================================================
# ANALYTICS (if using PostHog)
# ============================================================================
# NEXT_PUBLIC_POSTHOG_KEY=phc_...
# NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# ============================================================================
# ERROR TRACKING (if using Sentry)
# ============================================================================
# SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
# SENTRY_AUTH_TOKEN=sntrys_...
# SENTRY_ORG=your-org
# SENTRY_PROJECT=your-project

# ============================================================================
# AI / LLM (if using OpenAI)
# ============================================================================
# OPENAI_API_KEY=sk-...

# ============================================================================
# APP
# ============================================================================
# Environment: development, test, production
NODE_ENV=development

# Secret for protecting cron job endpoints. Generate with: openssl rand -hex 32
# Cron routes check: Authorization: Bearer {CRON_SECRET}
# CRON_SECRET=generate-a-random-string-here
```

## Runtime Validation with Zod

Create a validation file that fails fast if required vars are missing:

**packages/db/env.ts:**

```typescript
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  DIRECT_URL: z.string().url().startsWith("postgresql://"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);
```

**apps/web/src/env.ts:**

```typescript
import { z } from "zod";

const envSchema = z.object({
  // Server-only
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  DATABASE_URL: z.string().url(),

  // Public (available in browser)
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

// Only validate on server (process.env not available in browser)
export const env = typeof window === "undefined"
  ? envSchema.parse(process.env)
  : {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
    } as z.infer<typeof envSchema>;
```

## Rules

1. **Only include what you use**: Remove all commented sections for services you haven't integrated. An `.env` file with 50 unused variables creates confusion.

2. **Comment every variable**: Each var should have a one-line comment explaining what it is and where to get it.

3. **Never commit `.env`**: Add `.env`, `.env.local`, `.env.production` to `.gitignore`. Only `.env.example` gets committed.

4. **Separate secrets from config**: `NODE_ENV` is config (not secret). `BETTER_AUTH_SECRET` is a secret. Secrets get rotated; config doesn't.

5. **Validate at startup**: Use the Zod validation pattern above. A missing env var discovered at runtime is much harder to debug than a clear startup error.

6. **NEXT_PUBLIC_ prefix**: Variables prefixed with `NEXT_PUBLIC_` are inlined into the client bundle at build time. Never put secrets in `NEXT_PUBLIC_` variables.

7. **Per-environment values**: Auth URLs, app URLs, and webhook URLs differ between development (`localhost:3000`) and production (`yourdomain.com`). Set them correctly per environment.

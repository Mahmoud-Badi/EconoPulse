# Integration Gotchas — Production Lessons

> These are the integration failures that don't show up in tutorials, documentation, or sandbox testing. They appear at 2 AM when your traffic spikes, your provider has a partial outage, or a silent API change breaks your payment flow. Learn from them before they happen to you.

---

## Authentication & Credentials

### Token Refresh Race Condition
**What happens:** Two concurrent requests both detect an expired OAuth token. Both attempt to refresh it simultaneously. One succeeds, the other gets a "token already refreshed" error and fails.
**Fix:** Use a mutex/lock around token refresh. Only one request refreshes; others wait for the result.

### Clock Skew Breaks Signature Verification
**What happens:** Your server's clock is 30 seconds ahead of the provider's clock. Timestamp-based signature verification rejects valid webhooks because they appear to be from the future.
**Fix:** Allow a ±5 minute tolerance in timestamp verification. Use NTP to keep your server clocks synchronized.

### API Key in Git History
**What happens:** A developer commits an `.env` file or hardcodes an API key. Even if removed in the next commit, it's in git history forever. Bots scan GitHub for exposed keys within minutes.
**Fix:** Pre-commit hooks (`gitleaks`, `trufflehog`), `.gitignore` for `.env*` files, and immediate rotation if any key is ever committed. Never hardcode keys — always use environment variables.

### Credential Rotation Breaks Production
**What happens:** You rotate an API key, update it in your secrets manager, but forget that a background worker, cron job, or cached process is still using the old key.
**Fix:** Rotation protocol: generate new key → deploy to all services → verify health checks → revoke old key. Never revoke before deploying.

### Sandbox vs. Production Key Confusion
**What happens:** Production code accidentally uses sandbox API keys. Payments succeed in test mode, but no money actually moves. Discovered days later when finance notices missing revenue.
**Fix:** Environment-specific key naming (`STRIPE_SECRET_KEY_LIVE` vs `STRIPE_SECRET_KEY_TEST`), startup validation that production environments have production keys.

---

## Webhook Failures

### Webhook Events Arrive Out of Order
**What happens:** Stripe sends `invoice.paid` before `invoice.created` due to network timing. Your handler for `invoice.paid` fails because the invoice doesn't exist in your database yet.
**Fix:** Queue webhooks and process with retry. If a handler fails because a prerequisite event hasn't arrived, retry after a delay. Design handlers to be order-independent where possible.

### Webhook Replay After Deployment
**What happens:** Your deployment takes 2 minutes. During that time, webhook deliveries fail (no server to receive them). The provider retries, but your new deployment processes them — potentially alongside the original events if the provider also retried successfully.
**Fix:** Idempotency keys for every webhook event. Zero-downtime deployments (rolling deploy, blue-green).

### Silent Webhook Registration Expiry
**What happens:** Some providers (Shopify) expire webhook registrations after a period of inactivity or when your app's access token is refreshed. You stop receiving events with no error message.
**Fix:** Monthly cron job to verify webhook registrations are active. Re-register if missing.

### Webhook Signature Breaks After Framework Upgrade
**What happens:** You upgrade Express from v4 to v5 (or Next.js, or any framework). The body parser behavior changes, corrupting the raw body that signature verification depends on.
**Fix:** Pin your raw body parsing middleware. Test webhook signature verification as part of your framework upgrade checklist.

### Provider Sends Unexpected Event Types
**What happens:** A provider adds new webhook event types. Your handler receives an event type it doesn't recognize and throws an unhandled error, causing the provider to retry indefinitely.
**Fix:** Default case in event routing: log unknown events, return 200. Never return an error for an event type you don't handle.

---

## Data Synchronization

### Eventual Consistency Surprise
**What happens:** You create a resource via API, then immediately query for it. The query returns 404 because the provider's read replica hasn't replicated yet.
**Fix:** After creating, use the response body (which contains the created resource) instead of immediately querying. If you must query, add a 1-2 second delay or implement retry.

### Timezone Mismatch
**What happens:** Your application stores dates in UTC. The provider's API returns dates in their local timezone (or the user's timezone). Your comparison logic produces wrong results.
**Fix:** Always convert to UTC immediately upon receiving external dates. Store in UTC. Convert to local timezone only for display.

### ID Format Changes
**What happens:** A provider silently changes their ID format (e.g., from integer to UUID, or from `cus_` prefix to `customer_`). Your database column or validation logic breaks.
**Fix:** Store external IDs as strings (never integers). Don't validate format — just store whatever the provider sends.

### Pagination Cursor Invalidation
**What happens:** You're paginating through a large dataset from a provider. Mid-pagination, the underlying data changes, and your cursor becomes invalid. You either skip records or process duplicates.
**Fix:** Use timestamp-based pagination where available. Accept that bulk sync operations may have small inconsistencies. Run a reconciliation job after large syncs.

### Character Encoding Mismatch
**What happens:** A provider sends data with special characters (emoji, accented characters, CJK). Your database column is `VARCHAR` (Latin-1) instead of `NVARCHAR` (UTF-8). Characters are silently corrupted or the insert fails.
**Fix:** Use UTF-8 encoding everywhere. Database columns that store external data should support full Unicode.

---

## Cost Surprises

### Unexpected API Billing
**What happens:** Your batch job makes 100,000 API calls overnight. The provider bills per request. Your monthly bill jumps from $50 to $5,000.
**Fix:** Set up billing alerts. Calculate expected API costs before building batch operations. Cache aggressively. Use batch endpoints where available.

### Egress Charges on Cloud Storage
**What happens:** You serve files directly from S3 to users. Traffic spikes, and your AWS bill shows $500 in data transfer charges.
**Fix:** Put a CDN (CloudFront, Cloudflare) in front of storage. CDN egress is 5-10x cheaper than direct S3 egress.

### Development Environment Consuming Production Quota
**What happens:** Multiple developers running the app locally, each making API calls to the same provider account. The combined load hits rate limits or consumes billable quota.
**Fix:** Sandbox/test environments for development. MSW mocks for local development. Separate API keys per developer.

### Free Tier Cliff
**What happens:** Your usage crosses the free tier threshold (e.g., SendGrid's 100 emails/day free, then $20/month). The provider doesn't warn you — they just start billing.
**Fix:** Monitor usage against free tier limits. Set up alerts at 50%, 80%, 100% of free tier. Budget for the paid tier before hitting the cliff.

---

## Security

### Over-Scoped API Keys
**What happens:** You create an API key with full admin permissions because it's easier. The key leaks. The attacker now has full access to your provider account.
**Fix:** Principle of least privilege. Create keys with only the permissions your application needs. Review key scopes quarterly.

### SSRF via Integration URLs
**What happens:** Your application accepts a URL from user input and makes a server-side request to it (e.g., "Enter your webhook URL"). An attacker enters `http://169.254.169.254/latest/meta-data/` (AWS metadata endpoint) and extracts your server's IAM credentials.
**Fix:** Validate and sanitize URLs. Block private IP ranges. Use an allowlist of permitted domains if possible.

### Storing Sensitive Data from Integrations
**What happens:** You log full API responses for debugging. Those responses contain customer PII (names, emails, addresses). Your log storage isn't encrypted or access-controlled.
**Fix:** Redact PII from logs. Never log full API response bodies in production. Use structured logging with sensitive field masking.

---

## Provider-Specific Gotchas

### Stripe
- **Webhook event ordering is not guaranteed.** An `invoice.paid` can arrive before `invoice.created`.
- **Test mode webhooks have different behavior.** Some events only fire in live mode.
- **Stripe.js must be loaded from Stripe's CDN** — you cannot bundle it. This is a PCI compliance requirement.
- **Idempotency keys expire after 24 hours.** Don't reuse them for recurring operations.

### SendGrid / Email Providers
- **Bounce handling is async.** You won't know a send failed until the bounce webhook arrives (minutes to hours later).
- **Suppression lists are per-account.** If an email bounces, the provider blocks future sends to that address. You must handle this in your application.
- **HTML email rendering varies wildly** across email clients. Test with Litmus or Email on Acid.

### Shopify
- **Webhook registrations can silently expire.** Verify monthly.
- **API versioning is date-based and mandatory.** Shopify removes old versions aggressively (1 year cycle).
- **Rate limits differ between REST (40 req/s) and GraphQL (1000 cost/s).** GraphQL is almost always better.

### AWS S3
- **Eventual consistency for overwrite PUTs and DELETEs.** After overwriting or deleting an object, you may still read the old version for a few seconds. (Note: S3 now offers strong read-after-write consistency for PUTs of new objects.)
- **Pre-signed URL expiry is a UX problem.** If a user's upload URL expires mid-upload, the upload fails silently.
- **S3 bucket names are globally unique.** If you delete a bucket, someone else can claim the name.

### Auth0 / Identity Providers
- **Management API rate limits are separate from Authentication API.** Management is typically 2 req/s.
- **Custom claims have size limits.** JWTs with too many custom claims exceed header size limits and break reverse proxies.
- **Silent authentication fails in Safari** due to ITP (Intelligent Tracking Prevention). Always have a fallback login flow.

---

## General Integration Anti-Patterns

1. **"It works in sandbox"** — Sandbox environments have different behavior, data, rate limits, and failure modes than production. Always test with production-like conditions.
2. **String-matching on error messages** — Error messages change without notice. Match on error codes, HTTP status codes, or structured error fields.
3. **Hardcoding provider URLs** — Use configuration. Provider URLs can change (region migration, new API domain).
4. **Not handling partial success** — Batch API calls may partially succeed. If you send 100 emails, 97 may succeed and 3 may fail. Handle both cases.
5. **Assuming API responses are fast** — The same endpoint that responds in 50ms today may respond in 5 seconds during a provider incident. Always set timeouts.
6. **Building before reading** — Read the provider's best practices, migration guides, and known issues before writing integration code. Many gotchas are documented.

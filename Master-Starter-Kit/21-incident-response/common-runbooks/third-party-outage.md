# Third-Party Outage Runbook

> Symptoms: Features dependent on external services failing, timeout errors to external APIs, degraded functionality | Likely Causes: Provider outage, API deprecation, rate limit exhaustion, credential expiration, network/DNS issues | Expected Resolution Time: Variable (15 minutes for fallback, hours if waiting for provider)

---

## Symptoms

- Specific features fail while the rest of the application works normally
- Timeout errors in logs pointing to external API calls (Stripe, SendGrid, Twilio, AWS S3, etc.)
- Increased latency on endpoints that call third-party services
- Payment processing failures (Stripe, PayPal, Braintree down)
- Email delivery stops (SendGrid, Mailgun, SES down)
- SMS/notifications stop sending (Twilio, SNS down)
- File uploads/downloads fail (S3, Cloudinary, GCS down)
- Search functionality degrades (Algolia, Elasticsearch Cloud down)
- Analytics or tracking stops (Segment, Mixpanel, Amplitude down)
- Maps or geolocation features fail (Google Maps, Mapbox down)
- Error messages contain external service domain names or API URLs

---

## Diagnostic Steps

### 1. Confirm It Is a Third-Party Issue (Not Yours)

```bash
# Can you reach the third-party API from your servers?
curl -s -o /dev/null -w "%{http_code} %{time_total}s" https://api.stripe.com/v1/charges
curl -s -o /dev/null -w "%{http_code} %{time_total}s" https://api.sendgrid.com/v3/mail/send

# Check from multiple locations (not just your servers)
# Use a tool like https://downdetector.com or https://isitdown.site

# Check the provider's official status page
```

### 2. Check Provider Status Pages

| Provider | Status Page |
|----------|------------|
| **AWS** | https://health.aws.amazon.com |
| **Google Cloud** | https://status.cloud.google.com |
| **Azure** | https://status.azure.com |
| **Stripe** | https://status.stripe.com |
| **PayPal** | https://www.paypal-status.com |
| **SendGrid** | https://status.sendgrid.com |
| **Mailgun** | https://status.mailgun.com |
| **Twilio** | https://status.twilio.com |
| **Cloudflare** | https://www.cloudflarestatus.com |
| **Vercel** | https://www.vercel-status.com |
| **Netlify** | https://www.netlifystatus.com |
| **GitHub** | https://www.githubstatus.com |
| **Algolia** | https://status.algolia.com |
| **Auth0** | https://status.auth0.com |
| **Firebase** | https://status.firebase.google.com |
| **Supabase** | https://status.supabase.com |
| **PlanetScale** | https://www.planetscalestatus.com |
| **Redis Cloud** | https://status.redis.io |
| **Cloudinary** | https://status.cloudinary.com |

### 3. Check Your Integration

```bash
# Are your API credentials still valid?
# Check for 401/403 errors in logs (credential expiration, key rotation)

# Are you hitting rate limits?
# Check for 429 errors and rate limit headers in responses

# Did the provider release a breaking API change?
# Check their changelog and API version headers

# Check your outbound network — can your servers reach external services?
# DNS resolution, firewall rules, egress restrictions
```

### 4. Assess Impact Scope

- Which features depend on this third-party service?
- What percentage of your users use those features?
- Is there a fallback or queue mechanism in place?
- How long can you operate without this service before critical impact?

---

## Mitigation Steps by Service Type

### Payment Processing (Stripe, PayPal, Braintree)

**If payments are completely down:**

1. **Do NOT queue payment attempts silently** — this creates compliance and reconciliation nightmares
2. **Show users a clear error message:**
   "Payment processing is temporarily unavailable. Your card has not been charged. Please try again in a few minutes."
3. **If you have a backup payment processor:**
   - Switch traffic to the backup processor
   - Verify the backup is configured and tested (do NOT test in production for the first time during an outage)
4. **If no backup processor:**
   - Consider offering invoice/manual payment for enterprise customers
   - Disable "Buy" buttons if appropriate to prevent frustration
   - Monitor the provider's status page for recovery
5. **Update your status page** — be transparent that payments are affected

**After recovery:**
- Reconcile any pending transactions
- Check for duplicate charges from retry logic
- Notify customers who were affected

### Email Delivery (SendGrid, Mailgun, SES)

**If emails are not sending:**

1. **Implement email queuing** (if not already in place):
   - Queue emails in your database or message queue
   - Retry delivery when the provider recovers
2. **If you have a backup email provider:**
   - Switch the email sending configuration to the backup
   - Send a test email to verify before switching all traffic
3. **Prioritize transactional emails** over marketing/bulk:
   - Password resets, account verification, and payment receipts are critical
   - Newsletter and marketing emails can wait
4. **For time-sensitive emails** (password resets, MFA codes):
   - Consider providing alternative verification methods in the UI
   - Extend token expiration times temporarily
5. **Update your status page** if email delivery is a user-visible feature

### SMS / Push Notifications (Twilio, SNS)

**If SMS is not sending:**

1. **If used for MFA/2FA:**
   - Enable backup MFA methods (authenticator app, email, backup codes)
   - Display a message on the login page: "SMS verification is delayed. Please use an alternative method."
2. **Queue SMS messages** for retry when the provider recovers
3. **If you have a backup SMS provider:**
   - Switch to the backup provider
   - Be aware of sender ID/number changes that might confuse recipients
4. **For critical notifications (alerts, security):**
   - Fall back to email delivery
   - Use push notifications as an alternative channel

### File Storage / CDN (S3, Cloudinary, GCS)

**If file storage is down:**

1. **For file uploads:**
   - Queue uploads locally and process when the service recovers
   - Show users: "Upload queued. Your file will be processed shortly."
   - Set a maximum local queue size to prevent disk exhaustion
2. **For file downloads / media serving:**
   - If using a CDN: check if the CDN has cached copies (the origin may be down but CDN cache might still serve)
   - If the CDN itself is down: switch DNS to a backup CDN or serve directly from origin
   - For critical assets (JS, CSS): serve from a backup location or inline critical assets
3. **For database backups stored in cloud storage:**
   - Verify backups are still running
   - If backups fail, switch to local backup temporarily

### Search (Algolia, Elasticsearch Cloud)

**If search is down:**

1. **Degrade gracefully:**
   - Show a message: "Search is temporarily unavailable. Please browse our categories."
   - Redirect search to a basic database query (LIKE/ILIKE) as a fallback
   - Display recently viewed or popular items instead of search results
2. **Do NOT hide the search bar** — show it with a helpful message
3. **Queue indexing operations** for when search recovers

### General Third-Party Fallback Strategy

```
Third-party call fails
  |
  v
Is there a circuit breaker? ----NO----> Implement one now (or add timeout)
  |
  YES (circuit open)
  |
  v
Is there a fallback? ----NO----> Return graceful error to user
  |
  YES
  |
  v
Execute fallback
  |
  v
Queue the original operation for retry
  |
  v
Log the failure and monitor for provider recovery
```

---

## Resolution Steps

1. **Confirm provider recovery** on their status page and via direct API calls from your servers
2. **Process any queued operations** (emails, payments, uploads, indexing)
3. **Verify queue processing** — check that all queued items were processed successfully
4. **Remove temporary fallbacks** if they were manually enabled
5. **Check for data consistency:**
   - Were any payments duplicated or lost?
   - Were any emails sent twice?
   - Were file uploads completed?
6. **Verify all dependent features** work end-to-end
7. **Monitor for 30 minutes** to confirm stability
8. **Update status page** to resolved

---

## Communication During Third-Party Outages

### What to Tell Customers

**Do say:**
- "We are experiencing issues with [feature] due to an outage with one of our service providers."
- "Our team is monitoring the situation and implementing workarounds."
- "We expect service to be restored within [time frame if known, or 'the coming hours']."

**Do NOT say:**
- "Stripe is down" (do not name the provider publicly — it is unprofessional and shifts blame)
- "This is not our fault" (customers do not care whose fault it is)
- "There is nothing we can do" (there is always something — queue, fallback, communicate)

### What to Tell Your Team (Internal)

Be specific internally:
- "[Provider] is experiencing an outage affecting [specific API/service]"
- "Their status page: [URL]"
- "Our fallback status: [active/not available]"
- "Queued operations: [count]"
- "Estimated provider recovery: [time from their status page or 'unknown']"

---

## Prevention

- **Implement circuit breakers** for every third-party integration — fail fast instead of waiting for timeouts
- **Set aggressive timeouts** on external API calls (3-5 seconds for synchronous calls)
- **Use message queues** for all non-synchronous third-party operations (email, webhooks, analytics)
- **Maintain a backup provider** for critical services (payment processing, email delivery)
- **Test failover** to backup providers quarterly — an untested backup is not a backup
- **Subscribe to provider status pages** with automated alerts (email + Slack webhook)
- **Implement graceful degradation** — your app should function (with reduced capability) even when any single dependency is down
- **Cache third-party responses** where appropriate (e.g., feature flags, configuration, non-sensitive data)
- **Monitor third-party API latency and error rates** in your own dashboards — do not rely on their status page alone
- **Audit your third-party dependencies quarterly** — know which services are critical path and which are optional
- **Keep API credentials rotated and documented** — expired keys during a provider recovery make a bad situation worse
- **Version-pin third-party SDKs** and review changelogs before upgrading — breaking changes in SDKs cause outages

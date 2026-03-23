# Authentication Failure Runbook

> Symptoms: Users cannot log in, token validation errors, session expiration, SSO redirect loops | Likely Causes: Auth provider outage, token signing key rotation, session store failure, misconfigured CORS/redirect URIs | Expected Resolution Time: 15-60 minutes

---

## Symptoms

- Users report "Unable to log in" or "Session expired" errors
- Login page returns 500 errors or infinite redirect loops
- Token validation failures in application logs (invalid signature, expired token, malformed token)
- Spike in 401 (Unauthorized) or 403 (Forbidden) responses across all endpoints
- SSO login flow fails or redirects in a loop
- "Invalid state parameter" errors during OAuth/OIDC flow
- Session store (Redis, database) errors in logs
- JWT verification failures after a deployment or configuration change
- Magic link or password reset emails not sending or links expired
- Multi-factor authentication (MFA) verification consistently failing

---

## Diagnostic Steps

### 1. Identify the Failure Point

Determine where in the authentication flow the failure occurs:

```
User clicks "Login"
  |
  v
[A] Login page loads? ----NO----> Web app issue (not auth-specific)
  |
  YES
  |
  v
[B] Redirect to auth provider works? ----NO----> Auth provider or config issue
  |
  YES
  |
  v
[C] Auth provider login succeeds? ----NO----> Auth provider outage or user issue
  |
  YES
  |
  v
[D] Callback/redirect to app works? ----NO----> Redirect URI misconfiguration
  |
  YES
  |
  v
[E] Session/token created? ----NO----> Token creation or session store failure
  |
  YES
  |
  v
[F] Subsequent requests authenticated? ----NO----> Token validation or session lookup failure
  |
  YES
  |
  v
  User is authenticated successfully
```

### 2. Check Auth Provider Status

```bash
# Check third-party auth provider status pages:
# Auth0:        https://status.auth0.com
# Firebase Auth: https://status.firebase.google.com
# Okta:         https://status.okta.com
# AWS Cognito:  https://health.aws.amazon.com
# Clerk:        https://status.clerk.com
# Supabase:     https://status.supabase.com

# If self-hosted auth: check the auth service health
curl -s https://your-auth-service.com/health
```

### 3. Check Token Validation

```bash
# Decode a failing JWT (without verification) to inspect claims
# Use jwt.io or command line:
echo "<token>" | cut -d'.' -f2 | base64 -d 2>/dev/null | jq .

# Check: Is the token expired? (exp claim vs current time)
# Check: Is the issuer correct? (iss claim)
# Check: Is the audience correct? (aud claim)
# Check: Is the signing algorithm what you expect? (header.alg)
```

### 4. Check Session Store

```bash
# If using Redis for sessions:
redis-cli ping
redis-cli info memory
redis-cli info clients
redis-cli dbsize

# If using database for sessions:
# Check session table size and oldest/newest sessions
SELECT count(*) FROM sessions;
SELECT max(created_at), min(created_at) FROM sessions;

# Check for connection issues to session store in application logs
```

### 5. Check Recent Changes

```bash
# Was there a deployment in the last 2 hours?
# Check for changes to:
# - Auth configuration (client ID, client secret, redirect URIs)
# - Token signing keys or secrets
# - CORS settings
# - Cookie domain/path/secure/sameSite settings
# - Session expiration settings
# - Auth middleware or guards

# Were there infrastructure changes?
# - DNS changes that affect auth callback URLs
# - SSL certificate changes
# - Load balancer or CDN changes affecting cookie handling
```

### 6. Check Environment Variables

```bash
# Verify auth-related environment variables are set and correct:
# - AUTH_CLIENT_ID / AUTH0_CLIENT_ID / etc.
# - AUTH_CLIENT_SECRET
# - AUTH_DOMAIN / AUTH_ISSUER_URL
# - JWT_SECRET / JWT_SIGNING_KEY
# - SESSION_SECRET
# - REDIRECT_URI / CALLBACK_URL

# Common issue: environment variable was changed, rotated, or
# accidentally deleted during deployment
```

---

## Mitigation Steps

### Auth Provider Outage

1. **Confirm the outage** on the provider's status page
2. **If your app supports multiple auth methods** (e.g., email + SSO):
   - Disable the failing auth method
   - Redirect users to an alternative login method
   - Post a notice on the login page: "SSO is temporarily unavailable. Please log in with email/password."
3. **If the auth provider is your only login method:**
   - You cannot mitigate this — you are dependent on them restoring service
   - Update your status page: "Login is temporarily unavailable due to an issue with our authentication provider."
   - Monitor the provider's status page for updates
   - Notify affected users with an ETA when available
4. **Do NOT try to bypass authentication** as a mitigation — this creates a security incident

### Token Validation Failures

1. **Check if signing keys were rotated:**
   - JWKS endpoint: fetch the current keys and compare to what your app is caching
   - If keys rotated: restart your application to clear cached keys, or trigger a JWKS refresh
2. **Check token configuration:**
   - Verify issuer URL matches what your app expects
   - Verify audience claim matches your app's client ID
   - Verify token expiration is reasonable (not too short)
3. **If a deployment changed auth configuration:**
   - Roll back the deployment
   - Or hot-fix the configuration (environment variables, config files)
4. **Clear your app's token/key cache** and restart if needed

### Session Store Failure (Redis / Database)

1. **If Redis is down:**
   - Restart Redis if it crashed
   - Check memory limits — Redis may have been OOM killed
   - If Redis cannot be restored quickly, switch to a fallback session store (database) if configured
   - All existing sessions will be lost — users will need to re-authenticate
2. **If Redis is slow:**
   - Check for memory pressure (eviction policies)
   - Check connection count — are there too many connections?
   - Check for large keys that may be blocking
3. **If the session database is failing:**
   - See `database-outage.md` for database-specific mitigation
   - Consider clearing expired sessions: `DELETE FROM sessions WHERE expires_at < now();`

### SSO Redirect Loops

1. **Check redirect URI configuration:**
   - The callback URL registered with the auth provider MUST match exactly (including trailing slash, http vs https)
   - Check for URL encoding issues
2. **Check cookie settings:**
   - `SameSite` attribute: must be `None` for cross-origin auth flows, `Lax` for same-site
   - `Secure` flag: must be `true` in production (HTTPS)
   - `Domain`: must match your application domain
   - Third-party cookie blocking: modern browsers block third-party cookies — ensure your auth flow does not depend on them
3. **Check CORS configuration:**
   - Auth provider's domain must be allowed in CORS
   - Credentials must be included in CORS preflight responses
4. **Clear cookies in the browser** and test again — stale cookies cause loops
5. **Check the `state` parameter:** it must match between the auth request and the callback

### MFA Failures

1. **Check if the MFA provider is working** (TOTP, SMS, push notification)
2. **For TOTP (authenticator app):** Time sync issues — if the server clock is skewed >30 seconds, TOTP codes will fail
3. **For SMS:** Check your SMS provider status (Twilio, etc.) — see `third-party-outage.md`
4. **Provide a bypass option** for affected users (backup codes, admin-assisted reset) if your security policy allows it

---

## Resolution Steps

1. Confirm the root cause from diagnostics above
2. Implement the permanent fix:
   - Update misconfigured auth settings
   - Fix token validation logic
   - Restore or reconfigure session store
   - Update redirect URIs and CORS settings
3. Verify the fix:
   - Test login flow end-to-end (new user, existing user, SSO, email/password)
   - Test token refresh flow
   - Test session persistence across page reloads
   - Test logout flow
   - Verify no users are stuck in a broken state
4. Monitor auth metrics for 30 minutes:
   - Login success rate
   - Token validation error rate
   - Session creation rate
   - 401/403 response rate
5. Communicate resolution to affected users

---

## Prevention

- **Monitor auth success/failure rates** separately from general application metrics — a 50% auth failure rate is a SEV1 even if overall error rate looks low
- **Alert on login failure rate spikes** (threshold: 2x normal failure rate)
- **Cache JWKS keys with a TTL** and automatic refresh — do not fetch on every request, do not cache forever
- **Test auth flows in CI/CD** — include login, token refresh, and logout in integration tests
- **Document all auth provider configuration** — client IDs, redirect URIs, scopes, key rotation schedules
- **Set up redundant session storage** — if Redis goes down, can you fall back to database sessions?
- **Monitor your auth provider's status** with automated alerts (subscribe to their status page)
- **Rotate secrets on a schedule** (quarterly) and automate the process to avoid human error
- **Never store tokens in localStorage** — use httpOnly, Secure cookies to prevent XSS theft
- **Test with third-party cookie blocking enabled** — this is the default in Safari and increasingly in Chrome
- **Keep auth provider SDKs updated** — security patches and compatibility fixes are frequent

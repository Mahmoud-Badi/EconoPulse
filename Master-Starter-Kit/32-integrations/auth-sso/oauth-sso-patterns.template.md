# {{PROJECT_NAME}} — OAuth/SSO Integration

> **Owner:** {{LEAD_DEVELOPER}}
> **SSO Provider:** {{AUTH_SSO_PROVIDER}}
> **Social Login Providers:** {{AUTH_SSO_PROVIDERS}}
> **Last Updated:** {{DATE}}

---

## 1. Provider Selection

### Selected Provider: {{AUTH_SSO_PROVIDER}}

| Feature | Auth0 | Clerk | Supabase Auth | Firebase Auth | Custom |
|---------|-------|-------|---------------|---------------|--------|
| Social login providers | 30+ | 20+ | 10+ | 15+ | DIY |
| Enterprise SSO (SAML/OIDC) | ✅ | ✅ | ❌ | ❌ | DIY |
| Multi-factor auth | ✅ | ✅ | ✅ | ✅ | DIY |
| Passwordless | ✅ | ✅ | ✅ (magic link) | ✅ | DIY |
| User management UI | ✅ | ✅ | ✅ | ✅ | DIY |
| Free tier | 7,500 MAU | 10,000 MAU | Unlimited (self-host) | Unlimited | — |
| Pricing model | Per MAU | Per MAU | Per MAU (cloud) | Per verification | — |
| React/Next.js SDK | ✅ | ✅ (best) | ✅ | ✅ | — |
| Session management | Cookie/JWT | Cookie/JWT | Cookie/JWT | Token | — |
| Customizable login UI | Universal Login | Pre-built components | Pre-built components | FirebaseUI | — |

**Decision rationale:** {{AUTH_PROVIDER_RATIONALE}}

---

## 2. Authentication Flows

### Authorization Code Flow with PKCE (Recommended)

For web applications and SPAs. PKCE (Proof Key for Code Exchange) prevents authorization code interception.

```
1. User clicks "Sign in with Google"
2. App generates code_verifier (random string) and code_challenge (SHA256 hash)
3. App redirects to provider's /authorize endpoint with:
   - response_type=code
   - client_id
   - redirect_uri
   - scope (openid profile email)
   - code_challenge
   - code_challenge_method=S256
   - state (CSRF protection)
4. User authenticates with the identity provider (Google, GitHub, etc.)
5. Provider redirects back to redirect_uri with authorization code
6. App exchanges code + code_verifier for tokens at /oauth/token
7. Provider returns: access_token, id_token, refresh_token
8. App validates id_token, creates/updates user session
```

### Token Types

| Token | Purpose | Lifetime | Storage |
|-------|---------|----------|---------|
| **ID Token** (JWT) | User identity claims (name, email, picture) | 1 hour | Memory only (don't persist) |
| **Access Token** | API authorization | 1 hour | HTTP-only cookie or memory |
| **Refresh Token** | Obtain new access/ID tokens | 7–30 days | HTTP-only, Secure, SameSite cookie |

### Token Storage Security

| Storage | XSS Vulnerable | CSRF Vulnerable | Recommendation |
|---------|---------------|-----------------|----------------|
| `localStorage` | ✅ Yes | ❌ No | Never for tokens |
| `sessionStorage` | ✅ Yes | ❌ No | Never for tokens |
| Memory (variable) | ❌ No | ❌ No | Best for access tokens (lost on refresh) |
| HTTP-only cookie | ❌ No | ✅ Yes (mitigate with SameSite) | Best for refresh tokens |
| Secure, HTTP-only, SameSite=Lax cookie | ❌ No | ❌ No | Recommended |

---

## 3. Social Login Configuration

### Provider Setup

| Provider | OAuth Endpoint | Scopes Required | Dashboard URL |
|----------|---------------|-----------------|---------------|
| Google | `accounts.google.com/o/oauth2/v2/auth` | `openid profile email` | console.cloud.google.com |
| GitHub | `github.com/login/oauth/authorize` | `user:email read:user` | github.com/settings/developers |
| Microsoft | `login.microsoftonline.com/{tenant}/oauth2/v2/authorize` | `openid profile email User.Read` | portal.azure.com |
| Apple | `appleid.apple.com/auth/authorize` | `name email` | developer.apple.com |
| Discord | `discord.com/api/oauth2/authorize` | `identify email` | discord.com/developers |
| LinkedIn | `linkedin.com/oauth/v2/authorization` | `openid profile email` | linkedin.com/developers |

### Per-Provider Configuration

| Provider | Client ID Key | Client Secret Key | Redirect URI |
|----------|--------------|-------------------|-------------|
| Google | `GOOGLE_CLIENT_ID` | `GOOGLE_CLIENT_SECRET` | `{{APP_URL}}/api/auth/callback/google` |
| GitHub | `GITHUB_CLIENT_ID` | `GITHUB_CLIENT_SECRET` | `{{APP_URL}}/api/auth/callback/github` |
| {{PROVIDER_3}} | `{{PROVIDER_3}}_CLIENT_ID` | `{{PROVIDER_3}}_CLIENT_SECRET` | `{{APP_URL}}/api/auth/callback/{{PROVIDER_3_SLUG}}` |

---

## 4. Account Linking

### The Problem

A user signs up with Google (alice@gmail.com), then later tries to sign in with GitHub (which has the same email). Should these be the same account?

### Linking Strategy

| Strategy | Description | Risk | Best For |
|----------|-------------|------|----------|
| **Auto-link by email** | Same email = same account, auto-merge | Medium (email spoofing) | Consumer apps with verified emails |
| **Prompt to link** | Ask user "You already have an account with Google. Link GitHub?" | Low | B2B apps, security-conscious |
| **Separate accounts** | Different providers = different accounts | None | High-security apps |
| **Link in settings** | User manually links providers from account settings | Low | Most apps |

**Selected strategy:** {{ACCOUNT_LINKING_STRATEGY}}

### Implementation Notes

- Only auto-link if both providers have verified the email address
- Store provider-specific user IDs in a separate `user_identities` table (not the main `users` table)
- A user can have multiple identities (Google + GitHub + email/password) linked to one account
- Unlinking should be possible from account settings (but require at least one identity to remain)

---

## 5. Session Management

### Session Architecture

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **JWT-based** | Stateless tokens, validated by signature | No server state, scalable | Can't revoke individual sessions |
| **Database sessions** | Session ID in cookie, data in DB | Revocable, flexible | DB lookup per request |
| **Hybrid** | Short-lived JWT + database-backed refresh | Best of both | More complex |

**Selected approach:** {{SESSION_STRATEGY}}

### Session Configuration

```
Access Token TTL:    {{ACCESS_TOKEN_TTL}} (e.g., 15 minutes)
Refresh Token TTL:   {{REFRESH_TOKEN_TTL}} (e.g., 7 days)
Session Idle Timeout: {{SESSION_IDLE_TIMEOUT}} (e.g., 30 minutes)
Session Absolute Timeout: {{SESSION_ABSOLUTE_TIMEOUT}} (e.g., 24 hours)
Concurrent Sessions: {{MAX_CONCURRENT_SESSIONS}} (e.g., 5)
```

### Token Refresh Flow

```
1. Client makes API request with access token
2. Server validates token → expired (401)
3. Client sends refresh token to /api/auth/refresh
4. Server validates refresh token:
   a. Valid → issue new access token + rotate refresh token
   b. Invalid/expired → redirect to login
5. Client retries original request with new access token
```

**Critical:** Implement refresh token rotation — each refresh issues a new refresh token and invalidates the old one. This limits the damage window if a refresh token is stolen.

---

## 6. Enterprise SSO (SAML/OIDC)

> Skip this section if your product doesn't serve enterprise customers.

### When to Add Enterprise SSO

- Enterprise customers require it (Okta, Azure AD, OneLogin)
- You're selling to companies with > 50 employees
- SOC 2 or similar compliance requires centralized identity management
- Customer IT teams need to enforce their own auth policies

### SAML vs OIDC

| Factor | SAML 2.0 | OIDC |
|--------|----------|------|
| Protocol | XML-based | JSON-based (REST) |
| Complexity | High | Low |
| Enterprise adoption | Very high (legacy) | Growing |
| Mobile support | Poor | Good |
| Implementation effort | Days–weeks | Hours–days |

**Recommendation:** Support OIDC first. Add SAML only if enterprise customers require it.

### Per-Tenant SSO Configuration

| Customer | Protocol | IdP | Entity ID / Issuer | Metadata URL | Status |
|----------|----------|-----|-------------------|-------------|--------|
| {{CUSTOMER_1}} | SAML/OIDC | {{IDP}} | {{ENTITY_ID}} | {{METADATA_URL}} | Active / Pending |

---

## 7. Multi-Factor Authentication (MFA)

### MFA Strategy

| Factor | Implementation | UX Impact | Security Level |
|--------|---------------|-----------|----------------|
| TOTP (authenticator app) | Standard, well-supported | Medium | High |
| SMS OTP | Easy to implement | Low | Medium (SIM swap risk) |
| Email OTP | Easiest to implement | Low | Medium |
| WebAuthn/Passkeys | Modern, phishing-resistant | Low (biometric) | Highest |
| Push notification | Requires mobile app | Low | High |

### MFA Configuration

```
MFA Required:     {{MFA_REQUIRED}} (e.g., optional, required for admins, required for all)
MFA Factors:      {{MFA_FACTORS}} (e.g., TOTP + WebAuthn)
Recovery Codes:   {{RECOVERY_CODES_COUNT}} (e.g., 10 one-time codes)
Remember Device:  {{MFA_REMEMBER_DAYS}} days
```

---

## 8. Security Checklist

- [ ] PKCE enabled for all OAuth flows (no implicit flow)
- [ ] Tokens stored in HTTP-only, Secure, SameSite cookies (not localStorage)
- [ ] Refresh token rotation implemented
- [ ] CSRF protection on all state-changing endpoints
- [ ] Rate limiting on login, registration, and token endpoints
- [ ] Account lockout after failed attempts (5 failures → 15 minute lockout)
- [ ] Email verification required before account activation
- [ ] Password requirements enforced (if supporting email/password)
- [ ] Brute force protection (progressive delays, CAPTCHA)
- [ ] Session invalidation on password change
- [ ] Audit log for all auth events (login, logout, password change, MFA enroll)
- [ ] Secure redirect URI validation (exact match, no open redirect)
- [ ] State parameter validated for CSRF protection in OAuth flows

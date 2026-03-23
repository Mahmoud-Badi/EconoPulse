# Audit: Security & Compliance

> **App:** EconoPulse
> **Dimension:** E1-D
> **Date:** 2026-03-23
> **Rounds completed:** 3/3

---

## Score: 2/10 — Critical

---

## Round 1 Findings (Surface Scan)

**1. Authentication:** None. Zero. No login, no session, no JWT, no cookies. Every API endpoint is publicly accessible with no identity checks.

**2. Secrets in environment variables vs. source:**
- **P0 — LIVE SECURITY INCIDENT**: `backend/.env.example` contains **real, active API keys** committed to the public GitHub repository at `https://github.com/Mahmoud-Badi/EconoPulse`:
  ```
  FINNHUB_API_KEY=d6tnb81r01qhkb44sga0d6tnb81r01qhkb44sgag
  ALPHA_VANTAGE_KEY=8TSUX5UFHDB8ZGO3
  COINMARKETCAP_API_KEY=a06e6cc7494f4e06bf6cf6c4db8327fd
  NEWS_API_KEY=adccbc16d61b4486aced41176ef39872
  ```
  These keys are publicly visible in git history. Any actor who cloned or starred this repo can use these keys, consuming your free-tier quota or (for paid tiers) incurring charges on your behalf.
  **Immediate action required**: Rotate all 4 keys in each provider's dashboard before doing anything else. Replace file contents with placeholder strings.

**3. HTTPS enforced:** Vercel enforces HTTPS automatically on `econopulse.live`. ✓ (Not application-level — infrastructure-level.)

**4. Rate limiting on APIs:** None. `helmet` is installed and configured (`app.use(helmet())`) but Helmet does not provide rate limiting — it sets HTTP security headers only. No `express-rate-limit` or equivalent is installed. Any caller can hammer every endpoint indefinitely.

**5. Database inputs parameterized:** No database exists — not applicable for SQL injection.

---

## Round 2 Findings (Deep Dive)

**6. OWASP Top 10 analysis:**

| # | Risk | Status | Evidence |
|---|------|--------|----------|
| A01 Broken Access Control | CRITICAL | No auth, no RBAC, no protected routes. All 7 API domains are publicly accessible. Once auth is added, route-level guards must be implemented from the start. |
| A02 Cryptographic Failures | N/A now | No passwords, no tokens stored. Will become critical when auth is added — must use bcrypt/argon2 for passwords, HttpOnly cookies or short-lived JWTs. |
| A03 Injection | Low risk | No user inputs accepted by any current endpoint. No query parameters used. Backend calls hardcoded external APIs only. Risk increases significantly once watchlist (user-supplied symbols) or search features are added. |
| A04 Insecure Design | HIGH | No rate limiting on any endpoint. No brute-force protection. Once auth is added, login endpoint needs rate limiting + lockout. |
| A05 Security Misconfiguration | CRITICAL | `app.use(cors())` in `backend/server.js:9` — no origin restriction. Any domain on the internet can make cross-origin requests to the EconoPulse API. Should restrict to `https://econopulse.live` in production. |
| A06 Vulnerable Components | LOW | `npm audit` not run during this scan. Express 4.19.x had CVE-2024-29041 (open redirect) patched in 4.19.2 — current version is `^4.19.2` which should include the patch. Recommend running `npm audit` and pinning. |
| A07 Auth Failures | N/A now | No auth tokens or sessions exist. Critical to implement correctly when auth is added: HttpOnly + Secure + SameSite=Strict cookies for session tokens, or short-lived JWT (15min) + refresh token rotation. |
| A08 Integrity Failures | N/A | No file uploads. |
| A09 Logging Failures | MEDIUM | Only `console.error('Unhandled error:', err.message)` in the global error handler (`server.js:29`). No request logging, no structured logs, no error tracking service. Production incidents are invisible. |
| A10 SSRF | LOW | Backend fetches from Finnhub, Alpha Vantage, CMC, and NewsAPI — all hardcoded URLs. No user-supplied URLs are fetched. Risk increases if a "custom data source" feature is ever added. |

**7. RBAC:** None. Will need to be designed and implemented when auth is added. The planned watchlist feature requires at minimum a user-scoped resource model (users can only read/write their own watchlists).

**8. PII handling:**
- Currently no PII is stored — no users, no accounts, no personal data.
- When auth is added: email addresses and hashed passwords will constitute PII. Must implement proper storage (hashed passwords, not plaintext), secure token handling, and a basic privacy policy.

---

## Recommendations

Ordered by priority:

1. **[P0 — IMMEDIATE]** Rotate all 4 API keys and replace `.env.example` contents with placeholders — `backend/.env.example` — Real credentials are publicly exposed in git history. Go to Finnhub Dashboard → API Keys → Regenerate; Alpha Vantage → My API Key → Revoke/Regenerate; CoinMarketCap → API Keys → Rotate; NewsAPI → Account → API Key → Regenerate. Then update `backend/.env.example`:
   ```
   FINNHUB_API_KEY=your_finnhub_api_key_here
   ALPHA_VANTAGE_KEY=your_alpha_vantage_key_here
   COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here
   NEWS_API_KEY=your_newsapi_key_here
   PORT=5001
   ```

2. **[P0]** Restrict CORS to known origins — `backend/server.js:9` — Replace `app.use(cors())` with:
   ```js
   app.use(cors({
     origin: process.env.NODE_ENV === 'production'
       ? 'https://econopulse.live'
       : 'http://localhost:3000',
     credentials: true,
   }))
   ```

3. **[P1]** Add `express-rate-limit` to all API routes — `backend/server.js` — Prevent API scraping and rate-limit exhaustion. Basic config: 100 requests per 15-minute window per IP. Stricter limit (10/min) on future auth endpoints.

4. **[P1]** Add `morgan` or structured request logging — `backend/server.js` — Visibility into what requests are hitting the API is a prerequisite for debugging production issues and detecting abuse.

5. **[P1]** Design auth with security-first patterns before implementation — `dev_docs/decisions/` — When implementing JWT auth: use short-lived access tokens (15min), refresh token rotation, HttpOnly + Secure + SameSite=Strict cookies for refresh tokens. Do not store JWTs in `localStorage`. Document this decision before writing code.

6. **[P2]** Add `npm audit` to CI pipeline — `.github/workflows/` — Automated vulnerability scanning on every PR prevents silent dependency vulnerabilities from entering the codebase.

7. **[P2]** Add input validation (Zod) to all current and future route handlers — `backend/routes/*.js` — No user inputs exist today, but any query parameters added for filtering (e.g., `?symbol=AAPL`) need validation. Establish Zod as the validation standard now rather than inconsistently later.

---

## Protect List (this dimension)

| File | Score | Reason |
|------|-------|--------|
| `backend/server.js` | 6/10 | Helmet is correctly configured. Error handler structure is good. CORS and rate limiting fixes are surgical additions, not rewrites. |

---

## Summary

EconoPulse has two P0 security findings that require action before any other work: real API keys committed to a public GitHub repository (rotate immediately), and a fully open CORS policy. The broader security posture is "not dangerous today because there are no users or user data" — but this changes the moment auth and watchlists are added. The security design for auth (token storage, session management, RBAC) must be spec'd and decided before a single line of auth code is written. This audit dimension scores 2/10 solely because of the committed credentials and open CORS — structural security for a read-only data dashboard is otherwise adequate.

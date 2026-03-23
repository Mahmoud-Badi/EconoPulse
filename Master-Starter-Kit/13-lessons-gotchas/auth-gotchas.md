# Auth Gotchas

Authentication is the feature most likely to break silently and most painful when it does. Every gotcha here was discovered in production or during deployment.

---

## Better Auth

### Required Columns That Are Not Obvious

Better Auth will silently fail — or produce cryptic errors — if these columns are missing from your database schema.

**users table — MUST have:**
| Column | Type | Notes |
|--------|------|-------|
| `name` | varchar | Required even if your app does not use display names |
| `image` | varchar, nullable | Required even if you do not support profile images |
| `email` | varchar | Required |
| `emailVerified` | boolean | Required |
| `createdAt` | timestamp | Required |
| `updatedAt` | timestamp | Required |

**accounts table — MUST have:**
| Column | Type | Notes |
|--------|------|-------|
| `password` | varchar, nullable | Stores hashed password HERE, NOT on users table |
| `providerId` | varchar | "credential" for email/password auth |
| `accountId` | varchar | User's email address for credential provider |

**sessions table — MUST have:**
| Column | Type | Notes |
|--------|------|-------|
| `updatedAt` | timestamp | Better Auth updates this on every session touch |

**Symptom:** Login returns 500 or silently fails. No clear error message.
**Fix:** Add all required columns. Check Better Auth docs for the exact schema.

---

### UUID Generation Config

```typescript
// WRONG — this does nothing
advanced: {
  generateId: "uuid",
}

// CORRECT — nested under database
advanced: {
  database: {
    generateId: "uuid",
  },
}
```

**Symptom:** Users get auto-increment integer IDs instead of UUIDs. Foreign key types mismatch.
**Fix:** Use the nested `advanced.database.generateId` path.

---

### Password Hashing: Scrypt vs Bcrypt

Better Auth defaults to scrypt. If your seed data or existing users use bcrypt hashes, login will fail silently.

```typescript
// Explicit bcrypt configuration
emailAndPassword: {
  enabled: true,
  password: {
    hash: async (password) => bcrypt.hash(password, 12),
    verify: async ({ password, hash }) => bcrypt.compare(password, hash),
  },
},
```

**Symptom:** Seed users cannot log in. Password is correct, but auth returns "invalid credentials."
**Fix:** Configure the hash algorithm explicitly. Do not assume the default.

---

### Client Type Inference for Custom Fields

If your users table has custom fields (e.g., `role`, `phone`, `organizationId`), the client will not know about them unless you use the `inferAdditionalFields` plugin.

```typescript
// packages/auth/src/client.ts
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
  ],
});
```

**Symptom:** `session.user.role` is `undefined` even though the column exists in the database.
**Fix:** Add the `inferAdditionalFields` plugin to the client.

---

### Forgot Password Not in Client Types

The `forgetPassword` method is not exported in Better Auth's TypeScript client types.

```typescript
// WRONG — will not compile
await authClient.forgetPassword({ email });

// CORRECT — use direct fetch
await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/forget-password`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email }),
});
```

**Symptom:** TypeScript error: "Property 'forgetPassword' does not exist."
**Fix:** Use direct fetch to the REST endpoint.

---

### CORS Failure on Production Domain

Better Auth checks the request origin against `BETTER_AUTH_URL`. If they do not match exactly, the request is rejected.

```bash
# WILL FAIL — accessing via Vercel auto-domain but BETTER_AUTH_URL is custom domain
BETTER_AUTH_URL=https://app.yourdomain.com
# User accesses: https://myapp-ten.vercel.app  <-- CORS failure
```

**Symptom:** Login works locally, fails on production. Browser shows CORS error.
**Fix:** Always access your app via the domain that matches `BETTER_AUTH_URL`. Add both domains to `trustedOrigins` if you need to support multiple.

---

### Cookie Prefix Consistency

If you set a custom `cookiePrefix` in Better Auth config, you MUST use the same prefix when reading session cookies in proxy.ts (or middleware.ts).

```typescript
// auth config
cookiePrefix: "myapp"
// Cookie name becomes: myapp.session_token

// proxy.ts — MUST match
const sessionCookie = request.cookies.get("myapp.session_token");
// NOT: request.cookies.get("better-auth.session_token")
```

**Symptom:** Auth works on the server, but proxy/middleware cannot find the session cookie. Routes that should be protected are publicly accessible.
**Fix:** Use the same cookie prefix everywhere.

---

## NextAuth (Auth.js)

### Session Callback Must Explicitly Return Data

NextAuth strips custom user fields from the session by default. You must explicitly add them in the session callback.

```typescript
callbacks: {
  session({ session, token }) {
    // Without these lines, session.user only has name, email, image
    if (token.sub) session.user.id = token.sub;
    if (token.role) session.user.role = token.role as string;
    return session;
  },
  jwt({ token, user }) {
    // Persist custom fields in the JWT
    if (user) {
      token.role = user.role;
    }
    return token;
  },
},
```

**Symptom:** `session.user.id` is `undefined`. Role-based access checks fail because `session.user.role` is `undefined`.
**Fix:** Add the fields explicitly in both the `jwt` and `session` callbacks.

---

### NEXTAUTH_URL Must Include Protocol

```bash
# WRONG
NEXTAUTH_URL=app.yourdomain.com

# CORRECT
NEXTAUTH_URL=https://app.yourdomain.com
```

**Symptom:** Redirects loop infinitely or go to the wrong URL.
**Fix:** Always include `https://` (or `http://` for localhost).

---

## Clerk

### Publishable Key Must Be NEXT_PUBLIC_ Prefixed

```bash
# WRONG — will be undefined in the browser
CLERK_PUBLISHABLE_KEY=pk_live_...

# CORRECT
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
```

**Symptom:** Clerk components render blank or throw "missing publishable key" error in the browser.
**Fix:** Use the `NEXT_PUBLIC_` prefix. Clerk requires this key client-side.

---

### Webhook Signature Verification

Always verify webhook signatures. Without verification, anyone can send fake events to your webhook endpoint.

```typescript
import { Webhook } from "svix";

const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
try {
  const evt = wh.verify(body, headers);
  // Process verified event
} catch (err) {
  return new Response("Invalid signature", { status: 400 });
}
```

**Symptom:** Without verification, your database can be manipulated by sending crafted POST requests to your webhook URL.
**Fix:** Always verify. Use the `svix` library that Clerk provides.

---

## General Auth Gotchas (All Providers)

### Secure Cookies Require HTTPS

Secure cookies (which all auth providers use in production) are only sent over HTTPS connections.

**Symptom:** Login works in dev (HTTP), but session cookie is not set in production.
**Fix:** Ensure production uses HTTPS. Vercel does this automatically. If self-hosting, configure SSL.

### Session Expiry Mismatch

If your session expires but your client does not handle the 401 response, the user sees a broken page instead of a redirect to login.

```typescript
// Global error handler for expired sessions
if (error.data?.code === "UNAUTHORIZED") {
  window.location.href = "/login";
}
```

**Symptom:** User is "logged in" but every API call fails. Page shows error states everywhere.
**Fix:** Handle 401 responses globally — redirect to login page.

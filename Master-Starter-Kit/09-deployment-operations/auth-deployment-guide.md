# Auth Deployment Guide

Authentication is the most deployment-sensitive part of your stack. A misconfigured auth URL, a wrong cookie setting, or a missing env var will lock every user out of your application. Get it right before go-live.

---

## Better Auth

### Required Environment Variables

| Variable | Example | Notes |
|----------|---------|-------|
| `BETTER_AUTH_URL` | `https://app.yourdomain.com` | MUST match production domain exactly |
| `BETTER_AUTH_SECRET` | `a1b2c3d4e5f6...` (32+ chars) | Random string, NEVER commit to git |

### Production Configuration

```typescript
// packages/auth/src/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@{project}/db";
import bcrypt from "bcryptjs";

export const auth = betterAuth({
  database: drizzleAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  // UUID primary keys (not auto-increment)
  advanced: {
    database: {
      generateId: "uuid",   // NOT advanced.generateId — that is wrong
    },
  },

  // Explicit bcrypt (Better Auth defaults to scrypt)
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => bcrypt.hash(password, 12),
      verify: async ({ password, hash }) => bcrypt.compare(password, hash),
    },
  },

  // Trusted origins for CORS
  trustedOrigins: [
    process.env.BETTER_AUTH_URL!,
    "http://localhost:3000",   // Development
  ],

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7,   // 7 days
    updateAge: 60 * 60 * 24,        // Update session every 24 hours
  },
});
```

### Required Database Columns

Better Auth silently fails if these columns are missing:

**users table:**
- `name` (varchar) — required, even if your app does not use display names
- `image` (varchar, nullable) — required, even if you do not support profile images
- `email` (varchar) — required
- `emailVerified` (boolean) — required
- `createdAt` (timestamp) — required
- `updatedAt` (timestamp) — required

**accounts table:**
- `password` (varchar, nullable) — stores hashed password here, NOT on users table
- `providerId` (varchar) — "credential" for email/password
- `accountId` (varchar) — user's email for credential provider

**sessions table:**
- `updatedAt` (timestamp) — required, Better Auth updates this on every session touch

### Client Configuration

```typescript
// packages/auth/src/client.ts
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),   // Required for custom field types
  ],
});
```

### Common Deployment Issues

**Issue: "Invalid CORS origin"**
- `BETTER_AUTH_URL` does not match the domain you are accessing from
- Fix: Set `BETTER_AUTH_URL` to your exact production domain (with https://)
- Do NOT use the Vercel auto-domain (e.g., `your-project.vercel.app`) — use your custom domain

**Issue: "Session not found" after login**
- Cookie domain mismatch — secure cookies only work on HTTPS
- Fix: Ensure production uses HTTPS (Vercel auto-enables this)

**Issue: Login works in dev but not production**
- `BETTER_AUTH_URL` is set to `http://localhost:3000` in production env vars
- Fix: Set separate values per environment in Vercel

**Issue: "forgetPassword is not a function"**
- `forgetPassword` is not exported in the Better Auth client types
- Fix: Use direct fetch instead:
```typescript
await fetch(`${baseURL}/api/auth/forget-password`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email }),
});
```

---

## NextAuth (Auth.js)

### Required Environment Variables

| Variable | Example | Notes |
|----------|---------|-------|
| `NEXTAUTH_URL` | `https://app.yourdomain.com` | Must include protocol |
| `NEXTAUTH_SECRET` | output of `openssl rand -base64 32` | Random string |

### Production Configuration

```typescript
// auth.config.ts
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@{project}/db";

export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        // Validate credentials against database
        // Return user object or null
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,   // 7 days
  },
  callbacks: {
    session({ session, token }) {
      // MUST explicitly add user data you need
      if (token.sub) session.user.id = token.sub;
      if (token.role) session.user.role = token.role;
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
};
```

### Common Issues

- **Session callback must explicitly return fields:** NextAuth strips custom fields by default. Add them in the session callback.
- **NEXTAUTH_URL must include protocol:** `yourdomain.com` will fail. Use `https://yourdomain.com`.

---

## Clerk

### Required Environment Variables

| Variable | Example | Notes |
|----------|---------|-------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | Public, embedded in client |
| `CLERK_SECRET_KEY` | `sk_live_...` | Secret, server-only |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/login` | Custom sign-in page path |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/register` | Custom sign-up page path |

### User Sync (If Using Own Database)

Clerk manages users externally. If you need users in your own database (for relations, queries), set up a webhook:

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { db } from "@{project}/db";
import { users } from "@{project}/db/schema";

export async function POST(req: Request) {
  const payload = await req.json();
  const headerPayload = headers();

  // Verify webhook signature
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  const evt = wh.verify(JSON.stringify(payload), {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  });

  // Sync user to database
  if (evt.type === "user.created") {
    await db.insert(users).values({
      id: evt.data.id,
      email: evt.data.email_addresses[0]?.email_address,
      name: `${evt.data.first_name} ${evt.data.last_name}`,
    });
  }
}
```

---

## General Auth Deployment Checklist

- [ ] Auth URL env var matches production domain exactly (protocol + domain + port if non-standard)
- [ ] Secret is strong (32+ characters), random, and NOT committed to git
- [ ] Secure cookies enabled in production (HTTPS required)
- [ ] Session expiry configured (7 days for web is reasonable)
- [ ] CORS/trusted origins include production domain
- [ ] Login, register, logout all work on production URL
- [ ] Password reset flow works (email delivery configured)
- [ ] Role-based access works (admin can access admin pages, drivers cannot)
- [ ] Session persists across page refreshes
- [ ] Session expires correctly after configured timeout

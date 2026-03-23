# Auth System Design Guide

## Purpose

Authentication is the single most security-critical component of any application. This guide covers provider selection, configuration patterns, role-based access control, session management, and the real-world gotchas that documentation doesn't warn you about.

---

## Provider Selection

Choose your auth provider based on these criteria:

| Criteria | Better Auth | NextAuth (Auth.js) | Clerk | Custom |
|----------|-------------|-------------------|-------|--------|
| **Self-hosted** | Yes | Yes | No (managed) | Yes |
| **Cost** | Free | Free | $25+/mo at scale | Free |
| **Setup time** | 2-4 hours | 1-3 hours | 30 min | 1-2 weeks |
| **Customization** | High | Medium | Low | Unlimited |
| **Data ownership** | Full | Full | Vendor-owned | Full |
| **OAuth providers** | Growing | Many (50+) | Many (20+) | DIY |
| **TypeScript DX** | Excellent | Good (improving) | Excellent | DIY |
| **Community size** | Small (growing) | Large | Medium | N/A |
| **Production maturity** | Proven | Proven | Proven | Depends |

---

## Better Auth Setup Guide

**Recommended for:** Most new projects where you want full control over auth data and flows.

### Package Structure

```
packages/auth/
  src/
    index.ts      # Server-side auth instance (betterAuth config)
    client.ts     # Client-side auth hooks (createAuthClient)
    config.ts     # Shared configuration constants
```

### Server Configuration

```typescript
// packages/auth/src/index.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@project/db";
import * as schema from "@project/db/schema";
import bcrypt from "bcryptjs";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    // IMPORTANT: Configure bcrypt explicitly. Default is scrypt which
    // may have compatibility issues across environments.
    password: {
      hash: async (password) => bcrypt.hash(password, 12),
      verify: async ({ hash, password }) => bcrypt.compare(password, hash),
    },
  },

  session: {
    // Session duration: 7 days for "remember me", 24h otherwise
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
    updateAge: 60 * 60 * 24,     // Refresh session daily
  },

  advanced: {
    database: {
      // CRITICAL: Use this exact path for UUID primary keys
      // NOT advanced.generateId — that's a different (wrong) option
      generateId: "uuid",
    },
  },
});
```

### Client Configuration

```typescript
// packages/auth/src/client.ts
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    // REQUIRED: For custom user fields (role, organizationId, etc.)
    // to be available in the client-side session type
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        organizationId: { type: "string" },
      },
    }),
  ],
});

export const { useSession, signIn, signUp, signOut } = authClient;
```

### Required Database Columns (Critical Gotchas)

Better Auth has strict requirements for its database tables that are NOT always clear from documentation:

**Users table MUST have:**
| Column | Type | Why |
|--------|------|-----|
| `name` | `varchar(255)` | Better Auth reads this on every session |
| `image` | `text` (nullable) | Required for OAuth providers, must exist even if null |
| `email` | `varchar(255)` | Primary identifier |
| `emailVerified` | `boolean` | Email verification tracking |

**Accounts table MUST have:**
| Column | Type | Why |
|--------|------|-----|
| `password` | `text` (nullable) | Passwords are stored HERE, not in users table |
| `providerId` | `varchar(255)` | "email", "google", etc. |
| `accountId` | `varchar(255)` | User's ID from the provider |

**Sessions table MUST have:**
| Column | Type | Why |
|--------|------|-----|
| `updatedAt` | `timestamp` | Better Auth updates this on session refresh |
| `expiresAt` | `timestamp` | Session expiration tracking |
| `token` | `text` | Session token (unique) |

### Common Better Auth Mistakes

1. **Password storage location:** Passwords are in `accounts.password`, NOT `users.passwordHash`. If you add a `passwordHash` column to users, it will never be used.

2. **UUID generation:** Use `advanced.database.generateId: "uuid"`. The path `advanced.generateId` is different and won't work for database records.

3. **Forgot password not in client types:** The `forgetPassword` method isn't available on the typed client. Use a direct fetch:
```typescript
await fetch("/api/auth/forget-password", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email }),
});
```

4. **CORS and auth URL mismatch:** `BETTER_AUTH_URL` must match the production domain exactly. If you deploy at `app.example.com` but `BETTER_AUTH_URL` is `https://my-vercel-project.vercel.app`, session cookies won't work.

5. **Env var corruption on Vercel:** Setting env vars via CLI can introduce trailing `\n` characters in `BETTER_AUTH_SECRET`. Always verify with `vercel env pull` after setting.

---

## NextAuth (Auth.js) Setup Guide

**Recommended for:** Projects needing many OAuth providers quickly, teams already experienced with NextAuth.

### Configuration

```typescript
// packages/auth/src/index.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@project/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials against database
        // Return user object or null
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Enrich session with custom fields
      session.user.role = user.role;
      session.user.organizationId = user.organizationId;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.organizationId = user.organizationId;
      }
      return token;
    },
  },
});
```

### Common NextAuth Pitfalls

1. **v5 type augmentation:** Custom session fields require TypeScript module augmentation in `types/next-auth.d.ts`
2. **Credentials provider + database adapter:** These don't play well together by default — sessions are JWT-only with credentials
3. **NEXTAUTH_SECRET:** Must be at least 32 characters. Generate with `openssl rand -base64 32`

---

## Clerk Setup Guide

**Recommended for:** Teams that want zero auth code, budget-friendly at small scale, polished UI needed immediately.

### Configuration

```typescript
// apps/web/src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

```typescript
// apps/web/src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html><body>{children}</body></html>
    </ClerkProvider>
  );
}
```

### Clerk Considerations

1. **Cost:** Free for 10K monthly active users, then $0.02/user/month
2. **Data ownership:** User data lives on Clerk's servers. Syncing to your DB requires webhooks
3. **Custom UI:** Clerk provides pre-built components. Custom auth UI requires `<SignIn />` component customization
4. **Roles:** Clerk has its own role/permission system (Organizations feature). Map to your app's RBAC

---

## Role-Based Access Control (RBAC)

### Numeric Hierarchy Pattern

Assign each role a numeric level. Higher numbers = more privileges. This makes permission checks simple: `userLevel >= requiredLevel`.

```typescript
// packages/auth/src/config.ts
export const ROLES = {
  viewer: { level: 10, label: "Viewer", description: "Read-only access" },
  member: { level: 20, label: "Member", description: "Standard user" },
  dispatcher: { level: 30, label: "Dispatcher", description: "Can manage trips and drivers" },
  manager: { level: 40, label: "Manager", description: "Full access except system settings" },
  admin: { level: 50, label: "Admin", description: "Full access to organization" },
  superAdmin: { level: 100, label: "Super Admin", description: "System-wide access" },
} as const;

export type RoleName = keyof typeof ROLES;

// Permission check helper
export function hasMinimumRole(userRole: RoleName, requiredRole: RoleName): boolean {
  return ROLES[userRole].level >= ROLES[requiredRole].level;
}

// Usage in API middleware
if (!hasMinimumRole(ctx.user.role, "dispatcher")) {
  throw new TRPCError({ code: "FORBIDDEN" });
}
```

### Why Numeric Levels

- Simple comparison: `level >= 30` covers dispatchers, managers, admins, and super admins
- Easy to add intermediate roles later (level 25 = "senior member")
- No need to maintain explicit permission arrays per role
- Works across any auth provider

---

## Permission System Patterns

### Simple: Role-Level Checks (Recommended for Most Projects)

Check the user's role level against the minimum required role.

```typescript
// Middleware approach
const requireRole = (minRole: RoleName) => {
  return protectedProcedure.use(async ({ ctx, next }) => {
    if (!hasMinimumRole(ctx.user.role, minRole)) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return next({ ctx });
  });
};

// Usage
export const tripsRouter = router({
  list: requireRole("member").query(...),
  create: requireRole("dispatcher").query(...),
  delete: requireRole("admin").mutation(...),
});
```

### Advanced: Granular Permissions (For Complex Authorization)

When role levels aren't sufficient, add explicit permission checks.

```typescript
// packages/auth/src/permissions.ts
export const PERMISSIONS = {
  "trips:read": { roles: ["viewer", "member", "dispatcher", "manager", "admin"] },
  "trips:create": { roles: ["dispatcher", "manager", "admin"] },
  "trips:assign": { roles: ["dispatcher", "manager", "admin"] },
  "trips:delete": { roles: ["admin"] },
  "billing:read": { roles: ["manager", "admin"] },
  "billing:create": { roles: ["manager", "admin"] },
  "settings:manage": { roles: ["admin"] },
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(userRole: RoleName, permission: Permission): boolean {
  return (PERMISSIONS[permission].roles as readonly string[]).includes(userRole);
}
```

### Resource-Level Authorization

For "owner or admin" patterns where a user can only edit their own records:

```typescript
const ownerOrAdmin = protectedProcedure.use(async ({ ctx, input, next }) => {
  if (hasMinimumRole(ctx.user.role, "admin")) {
    return next({ ctx }); // Admins can access anything
  }

  // For non-admins, verify ownership
  const record = await db.query.trips.findFirst({
    where: and(
      eq(trips.id, (input as { id: string }).id),
      eq(trips.createdBy, ctx.user.id),
    ),
  });

  if (!record) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({ ctx: { ...ctx, record } });
});
```

---

## Session Management

### Strategy Comparison

| Strategy | How It Works | Best For |
|----------|-------------|----------|
| **Session-based** (DB) | Session ID in cookie, data in database | Most apps (Better Auth default) |
| **JWT** | All data in token, signed but not encrypted | Stateless APIs, microservices |
| **Hybrid** | JWT for short-lived access, DB session for refresh | High-performance apps |

### Session-Based (Recommended)

```typescript
// Server: Session stored in database
// Cookie: Contains only the session token (opaque string)
// On each request: Look up session in DB, verify expiration, return user

// Session refresh pattern
// - Session expires in 7 days
// - If session is accessed within the last 24 hours of its life, extend it
// - This means active users never get logged out, inactive users expire after 7 days
```

### Security Checklist

- [ ] Session cookies are `httpOnly` (not accessible to JavaScript)
- [ ] Session cookies are `secure` (HTTPS only)
- [ ] Session cookies have `sameSite: "lax"` (CSRF protection)
- [ ] Sessions expire after a reasonable period (7-30 days)
- [ ] Sessions are invalidated on password change
- [ ] Failed login attempts are rate-limited (5 attempts per 15 minutes)
- [ ] Password reset tokens expire after 1 hour
- [ ] Auth endpoints don't reveal if an email exists ("If an account exists, we sent a reset link")

---

## Multi-Tenant Auth Isolation

### Pattern: Organization-Scoped Sessions

```typescript
// User belongs to one or more organizations
// Session includes the active organization
// All queries filter by session.organizationId

// On login:
// 1. Authenticate user
// 2. Look up user's organizations
// 3. Set default organization in session
// 4. All subsequent queries use session.organizationId

// Organization switching:
// 1. User selects different org from dropdown
// 2. API call updates session.activeOrganizationId
// 3. All subsequent queries use new org context
```

### Implementation

```typescript
// In tRPC context
export const createContext = async ({ req }: { req: Request }) => {
  const session = await auth.getSession(req);
  return {
    session,
    user: session?.user ?? null,
    organizationId: session?.user?.organizationId ?? null,
  };
};

// In every query
const trips = await db.query.trips.findMany({
  where: and(
    eq(trips.organizationId, ctx.organizationId!), // NEVER forget this
    isNull(trips.deletedAt),
  ),
});
```

### Data Isolation Rules

1. **EVERY** user-owned query MUST filter by `organizationId`
2. **NEVER** allow cross-organization data access (even for admins — super admins use a separate mechanism)
3. **Test** by logging in as User A and trying to access User B's organization data via direct API call
4. **Foreign keys** within a tenant don't need org filtering (a trip's driver is already in the same org by referential integrity), but top-level queries always need it

---

## Auth Flow Pages

Every auth system needs these pages:

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Email + password, OAuth buttons |
| Register | `/register` | Create account (if self-registration allowed) |
| Forgot Password | `/forgot-password` | Email input, sends reset link |
| Reset Password | `/reset-password` | New password form (from email link) |
| Verify Email | `/verify-email` | Email verification landing page |
| Accept Invite | `/accept-invite` | Organization invitation acceptance |

### Auth Route Group Pattern (Next.js)

```
apps/web/src/app/
  (auth)/
    login/page.tsx
    register/page.tsx
    forgot-password/page.tsx
    reset-password/page.tsx
    layout.tsx              # Centered card layout, no sidebar
  (dashboard)/
    layout.tsx              # Full app layout with sidebar
    page.tsx                # Dashboard home (redirect after login)
```

# Shared Code Architecture

## Purpose

One of the biggest advantages of React Native in a TypeScript monorepo is code sharing with the web app. But the line between "can share" and "cannot share" is not obvious, and getting it wrong means broken builds, mysterious Metro errors, and wasted hours. This guide draws a bright line.

**The rule:** If it imports React or uses DOM/CSS, it cannot be shared with mobile.

---

## What CAN Be Shared (Monorepo Packages)

These packages contain **pure TypeScript** with no platform-specific imports. They work identically in Next.js (web), React Native (mobile), and Node.js (server).

### TypeScript Types

```typescript
// packages/types/src/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "member" | "viewer";
  avatarUrl: string | null;
  createdAt: string;
}

export interface UserProfile extends User {
  bio: string | null;
  phoneNumber: string | null;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  language: string;
}
```

**Consumed by:** `apps/web`, `apps/mobile`, `packages/api`, `packages/validators`

### Zod Validators

```typescript
// packages/validators/src/user.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
```

**Why it works:** Zod is a pure JavaScript library. No DOM, no Node.js, no platform-specific code.

### Business Logic Utilities

```typescript
// packages/utils/src/currency.ts
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100); // assuming cents
}

// packages/utils/src/dates.ts
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return target.toLocaleDateString();
}

// packages/utils/src/strings.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
```

**Why it works:** These are pure functions using only ECMAScript standard APIs (`Intl`, `Date`, `String`). No DOM. No Node.js.

### Constants and Enums

```typescript
// packages/types/src/enums.ts
export const ORDER_STATUS = {
  DRAFT: "draft",
  PENDING: "pending",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const USER_ROLES = ["admin", "member", "viewer"] as const;
export type UserRole = (typeof USER_ROLES)[number];

// packages/types/src/constants.ts
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE_MB: 10,
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
} as const;
```

### API Client Types (Type-Only Imports)

```typescript
// In apps/mobile/lib/api.ts
import type { AppRouter } from "@{{PROJECT_SLUG}}/api";
// ^^^^
// "type" import — erased at compile time, no runtime dependency on the api package
```

**Critical:** Use `import type` for API router types. This ensures Metro does not try to bundle the server-side API package (which would fail because it depends on Node.js).

---

## What CANNOT Be Shared

### React Web Components

```typescript
// packages/ui/src/Button.tsx — CANNOT be used in mobile
import React from "react";

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onClick}>
      {children}
    </button>
  );
}
// Uses <button> (DOM element), className (CSS), onClick (DOM event)
// None of these exist in React Native
```

**Mobile equivalent:** Rewrite using React Native primitives:

```tsx
// apps/mobile/components/ui/Button.tsx
import { Pressable, Text, StyleSheet } from "react-native";

export function Button({ children, onPress }: ButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: "#3B82F6", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  text: { color: "#FFFFFF", fontWeight: "600" },
});
```

### CSS / Tailwind Utilities

```typescript
// packages/ui/src/lib/utils.ts — CANNOT be used in mobile
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Tailwind class merging — no CSS engine in React Native
```

**Mobile equivalent:** React Native uses `StyleSheet.create()` and inline style objects. NativeWind exists as a Tailwind-like layer for React Native, but it is a separate system from web Tailwind.

### Next.js Server Components / Middleware

```typescript
// apps/web/src/app/api/webhooks/route.ts — CANNOT be used in mobile
import { NextRequest } from "next/server";
// Server-only code — no concept of this in a mobile app
```

### Packages That Import `react-dom`

```typescript
// Any package with this import cannot be used in mobile:
import { createPortal } from "react-dom";
import { renderToString } from "react-dom/server";
```

### Node.js Built-in Modules

```typescript
// Any package with these imports cannot be used in mobile:
import fs from "fs";
import path from "path";
import crypto from "crypto";
// React Native has no access to the Node.js runtime
```

### Server-Side Packages (Database, Auth)

```typescript
// packages/db — CANNOT be used in mobile
import { drizzle } from "drizzle-orm/neon-http";
// Direct database access from a mobile app is a security vulnerability

// packages/auth — CANNOT be used in mobile (usually)
import { betterAuth } from "better-auth";
// Auth libraries typically depend on server-side cookies/sessions
```

---

## The Shared Package Pattern

### Package Structure

```
packages/
  shared/                       # Pure TypeScript — the safe sharing zone
    package.json                # name: "@{{PROJECT_SLUG}}/shared"
    src/
      index.ts                  # Public exports
      types/                    # TypeScript interfaces and types
        user.ts
        order.ts
        api.ts
      validators/               # Zod schemas
        user.ts
        order.ts
      utils/                    # Pure utility functions
        currency.ts
        dates.ts
        strings.ts
      constants/                # Enums, config values
        statuses.ts
        roles.ts
        limits.ts
```

### Package.json

```json
{
  "name": "@{{PROJECT_SLUG}}/shared",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types/index.ts",
    "./validators": "./src/validators/index.ts",
    "./utils": "./src/utils/index.ts",
    "./constants": "./src/constants/index.ts"
  },
  "dependencies": {
    "zod": "^3.23.0"
  }
}
```

### Validation Rule

Before adding anything to the shared package, ask:

1. Does it import from `react`? **NO** → Maybe shareable. **YES** → Not shareable.
2. Does it import from `react-dom`? **NO** → Maybe shareable. **YES** → Not shareable.
3. Does it use any DOM APIs (`document`, `window`, `localStorage`)? **NO** → Maybe shareable. **YES** → Not shareable.
4. Does it import Node.js built-ins (`fs`, `path`, `crypto`)? **NO** → Maybe shareable. **YES** → Not shareable.
5. Does it use CSS class names or Tailwind? **NO** → Maybe shareable. **YES** → Not shareable.
6. Is it a pure function or type definition? **YES** → Shareable.

If it passes all six checks, it belongs in the shared package.

---

## Flutter and Native: API Contract Sharing

Since Flutter (Dart) and Native (Swift/Kotlin) cannot import TypeScript packages, the sharing strategy is different. Instead of sharing code, you share the **API contract**.

### OpenAPI Spec Generation

```
TypeScript Backend
    ↓ exports
openapi.json (or openapi.yaml)
    ↓ consumed by
┌─────────────────┬──────────────────┬──────────────────┐
│  Dart codegen    │  Swift codegen   │  Kotlin codegen  │
│  (openapi-gen)   │  (swift-openapi) │  (openapi-gen)   │
└─────────────────┴──────────────────┴──────────────────┘
```

#### Backend: Export OpenAPI Spec

For tRPC backends, use `trpc-openapi` to generate the spec:

```typescript
// packages/api/src/openapi-export.ts
import { generateOpenApiDocument } from "trpc-openapi";
import { appRouter } from "./router";

const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "{{PROJECT_NAME}} API",
  version: "1.0.0",
  baseUrl: "{{API_BASE_URL}}",
});

// Write to file
import fs from "fs";
fs.writeFileSync("../../openapi.json", JSON.stringify(openApiDocument, null, 2));
```

For REST backends with Hono, Fastify, or Express, use their built-in OpenAPI/Swagger generators.

#### Flutter: Generate Dart Client

```bash
# Install generator
dart pub global activate openapi_generator_cli

# Generate
openapi-generator generate \
  -i openapi.json \
  -g dart-dio \
  -o lib/generated/api_client
```

#### Swift: Generate Swift Client

```bash
# Using Apple's Swift OpenAPI Generator
swift package add-dependency https://github.com/apple/swift-openapi-generator
swift package add-dependency https://github.com/apple/swift-openapi-urlsession

# Configure in openapi-generator-config.yaml and build
swift build
```

#### Kotlin: Generate Kotlin Client

```bash
openapi-generator generate \
  -i openapi.json \
  -g kotlin \
  --library jvm-retrofit2 \
  -o generated/api-client
```

### Manual Contract Alignment (Small APIs)

For small APIs (< 20 endpoints), manual alignment is acceptable:

1. Maintain the `ARCHITECTURE/api/` documentation as the source of truth
2. Each platform mirrors the types in their native language
3. Add integration tests that verify the contract holds
4. Review for drift during every sprint

---

## Decision Framework Summary

| Code Type | React Native (Monorepo) | Flutter | Native |
|-----------|------------------------|---------|--------|
| TypeScript types | Direct import | OpenAPI codegen | OpenAPI codegen |
| Zod validators | Direct import | Manual / codegen | Manual / codegen |
| Pure utility functions | Direct import | Rewrite in Dart | Rewrite in Swift/Kotlin |
| Constants/enums | Direct import | Rewrite in Dart | Rewrite in Swift/Kotlin |
| API client types | `import type` (erased) | Generated client | Generated client |
| React components | Cannot share | N/A | N/A |
| CSS/Tailwind | Cannot share | N/A | N/A |
| Server-side code | Cannot share | Cannot share | Cannot share |
| Business logic (pure) | Direct import | Rewrite in Dart | Rewrite in Swift/Kotlin |

### The Quick Test

Before importing a shared package in your mobile app, run this mental check:

```
Does this package...
  ✗ import "react"?              → STOP. Cannot share.
  ✗ import "react-dom"?          → STOP. Cannot share.
  ✗ use DOM APIs?                → STOP. Cannot share.
  ✗ use Node.js built-ins?       → STOP. Cannot share.
  ✗ reference CSS/Tailwind?      → STOP. Cannot share.
  ✓ contain only types/schemas/functions? → Safe to share.
```

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| Importing `@{{PROJECT_SLUG}}/ui` in mobile | Metro bundler crash — tries to resolve `react-dom` | Create mobile-specific components in `apps/mobile/components/` |
| Using `import` instead of `import type` for API router | Metro tries to bundle server code | Always use `import type { AppRouter }` |
| Putting `localStorage` calls in shared utilities | Runtime crash on mobile (no `localStorage`) | Use dependency injection — pass storage adapter as parameter |
| Sharing a Zustand store that uses `persist` with `localStorage` | Compiles but crashes at runtime | Create separate persist configs per platform (MMKV for mobile, localStorage for web) |
| Adding `React.FC` components to the shared package | Package becomes unshareable the moment a component is added | Shared packages must have zero React imports — put components in app-specific code |

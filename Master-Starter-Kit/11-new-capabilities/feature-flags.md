# Feature Flags

## Purpose

Implement feature flags to decouple deployment from release, enable gradual rollouts, and safely test new features in production. This guide covers simple env-based flags through to full-featured flag services.

## Feature Flag Library Setup

### Option A: Simple Env-Based Flags (MVP / Small Teams)

No library needed. Use environment variables for binary on/off flags.

```typescript
// lib/flags.ts
export const FLAGS = {
  ENABLE_NEW_DASHBOARD: process.env.NEXT_PUBLIC_FLAG_NEW_DASHBOARD === "true",
  ENABLE_AI_FEATURES: process.env.NEXT_PUBLIC_FLAG_AI_FEATURES === "true",
  ENABLE_BILLING_V2: process.env.FLAG_BILLING_V2 === "true", // server-only (no NEXT_PUBLIC_)
} as const;

export type FlagName = keyof typeof FLAGS;
```

```env
# .env.local
NEXT_PUBLIC_FLAG_NEW_DASHBOARD=true
NEXT_PUBLIC_FLAG_AI_FEATURES=false
FLAG_BILLING_V2=false
```

### Option B: Unleash (Self-Hosted / Open Source)

```bash
npm install @unleash/proxy-client-react
```

```typescript
// lib/flags-unleash.ts
import { FlagProvider } from "@unleash/proxy-client-react";

export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  return (
    <FlagProvider
      config={{
        url: "{{UNLEASH_PROXY_URL}}",
        clientKey: "{{UNLEASH_CLIENT_KEY}}",
        appName: "{{PROJECT_NAME}}",
        refreshInterval: 30,
      }}
    >
      {children}
    </FlagProvider>
  );
}
```

### Option C: LaunchDarkly (Enterprise / Full-Featured)

```bash
npm install @launchdarkly/node-server-sdk  # Server
npm install launchdarkly-react-client-sdk   # Client
```

## Flag Naming Conventions

Use a dot-separated hierarchy: `feature.module.name`.

| Pattern                        | Example                           | Description                       |
| ------------------------------ | --------------------------------- | --------------------------------- |
| `feature.<module>.<name>`      | `feature.dashboard.new-charts`    | New feature in a specific module  |
| `experiment.<name>`            | `experiment.pricing-page-v2`      | A/B test variant                  |
| `ops.<name>`                   | `ops.maintenance-mode`            | Operational kill switch           |
| `permission.<name>`            | `permission.beta-access`          | Access control gate               |

Rules:
- Lowercase with hyphens within segments, dots between segments.
- Prefix indicates purpose (`feature`, `experiment`, `ops`, `permission`).
- Include a ticket or issue reference in the flag description.

## Flag Types

| Type              | Use Case                              | Example                          |
| ----------------- | ------------------------------------- | -------------------------------- |
| Boolean           | Simple on/off                         | `feature.billing.invoices`       |
| Percentage rollout| Gradual release to % of users         | 10% -> 25% -> 50% -> 100%       |
| User targeting    | Enable for specific users/orgs        | Beta users, internal team        |
| A/B variant       | Serve different experiences            | `control` vs `variant-a`        |

## Env-Based Feature Flag Implementation

```typescript
// lib/flags.ts (expanded with runtime check helper)
export const FLAGS = {
  ENABLE_NEW_DASHBOARD: process.env.NEXT_PUBLIC_FLAG_NEW_DASHBOARD === "true",
  ENABLE_AI_FEATURES: process.env.NEXT_PUBLIC_FLAG_AI_FEATURES === "true",
} as const;

export function isEnabled(flag: keyof typeof FLAGS): boolean {
  return FLAGS[flag] ?? false;
}

// Usage in a component
import { isEnabled } from "@/lib/flags";

export function Sidebar() {
  return (
    <nav>
      <Link href="/home">Home</Link>
      {isEnabled("ENABLE_NEW_DASHBOARD") && <Link href="/dashboard-v2">New Dashboard</Link>}
      {isEnabled("ENABLE_AI_FEATURES") && <Link href="/ai">AI Assistant</Link>}
    </nav>
  );
}
```

## Client-Side and Server-Side Flag Evaluation

### Client-Side (for UI toggles)

```typescript
// Prefix env vars with NEXT_PUBLIC_ so they are bundled into client JS.
// Good for: UI variations, showing/hiding components.
// Risk: Flags are visible in the browser; do not gate security-sensitive logic here.

function PricingPage() {
  const showNewPricing = isEnabled("ENABLE_PRICING_V2");
  return showNewPricing ? <PricingV2 /> : <PricingV1 />;
}
```

### Server-Side (for API logic and access control)

```typescript
// Do NOT prefix with NEXT_PUBLIC_. Evaluated only on the server.
// Good for: billing logic, access control, API behavior changes.

// app/api/billing/route.ts
export async function POST(req: Request) {
  const useBillingV2 = process.env.FLAG_BILLING_V2 === "true";

  if (useBillingV2) {
    return handleBillingV2(req);
  }
  return handleBillingV1(req);
}
```

## Flag Lifecycle

```
1. CREATE   -> Define flag with name, type, description, owner, and ticket reference.
2. DEVELOP  -> Implement both code paths (flag on + flag off).
3. TEST     -> Test both paths in staging. Write tests for both states.
4. ROLLOUT  -> Enable for internal team -> beta users -> 10% -> 50% -> 100%.
5. STABILIZE -> Monitor metrics for 1-2 weeks at 100%.
6. CLEANUP  -> Remove flag, dead code path, and env variable. Merge cleanup PR.
```

## Flag Cleanup Process

Stale flags create technical debt. Clean them up aggressively.

### Stale Flag Detection

```bash
# Find flags defined in code but potentially unused or old
# Run periodically (e.g., monthly) or in CI

# List all flag references
grep -r "ENABLE_\|FLAG_\|feature\." --include="*.ts" --include="*.tsx" src/ | \
  grep -oP '(ENABLE_[A-Z_]+|FLAG_[A-Z_]+)' | sort | uniq -c | sort -n
```

### Cleanup Checklist

- [ ] Confirm flag is at 100% rollout for at least 2 weeks.
- [ ] Remove the flag evaluation code; keep only the "enabled" path.
- [ ] Remove the env variable from `.env`, `.env.example`, and deployment config.
- [ ] Remove the flag definition from the flag service (if using one).
- [ ] Delete tests for the "disabled" path.
- [ ] Create a PR titled `chore: remove stale flag <FLAG_NAME>`.

## Gradual Rollout Configuration

```typescript
// For percentage rollouts without a flag service, use a simple hash-based approach.
import { createHash } from "crypto";

export function isEnabledForUser(flagName: string, userId: string, percentage: number): boolean {
  const hash = createHash("md5").update(`${flagName}:${userId}`).digest("hex");
  const value = parseInt(hash.substring(0, 8), 16);
  const threshold = (percentage / 100) * 0xffffffff;
  return value < threshold;
}

// Usage: enable for 25% of users, deterministic per user
const showNewFeature = isEnabledForUser("feature.dashboard.new-charts", user.id, 25);
```

## Feature Flag Testing Strategy

Always test both paths. Flags that are never tested in the "off" state will break when toggled.

```typescript
// __tests__/Sidebar.test.tsx
import { FLAGS } from "@/lib/flags";

describe("Sidebar", () => {
  it("shows AI link when flag is enabled", () => {
    vi.spyOn(FLAGS, "ENABLE_AI_FEATURES", "get").mockReturnValue(true);
    render(<Sidebar />);
    expect(screen.getByText("AI Assistant")).toBeInTheDocument();
  });

  it("hides AI link when flag is disabled", () => {
    vi.spyOn(FLAGS, "ENABLE_AI_FEATURES", "get").mockReturnValue(false);
    render(<Sidebar />);
    expect(screen.queryByText("AI Assistant")).not.toBeInTheDocument();
  });
});
```

## Anti-Patterns

| Anti-Pattern                          | Why It Is Harmful                                  | Fix                                        |
| ------------------------------------- | -------------------------------------------------- | ------------------------------------------ |
| Using flags for permanent config      | Flags should be temporary; config belongs in config | Move permanent settings to app config      |
| Too many active flags (> 15-20)       | Combinatorial complexity, impossible to test fully  | Enforce cleanup SLA (2 weeks after 100%)   |
| Nested flag checks                    | Exponential code paths, untestable                  | Flatten logic; one flag per decision point |
| No flag ownership                     | Nobody cleans up; flags rot forever                 | Assign an owner and ticket to every flag   |
| Gating security logic client-side     | Users can bypass by modifying JS                    | Gate security on the server only           |

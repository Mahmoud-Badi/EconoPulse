# Self-Serve Upgrade Flows

> Design the complete self-serve purchasing experience — from pricing page UX and checkout optimization to plan comparison, upgrade modals, downgrade retention, and annual vs. monthly toggle mechanics.

---

## 1. Pricing Page UX

The pricing page is the highest-leverage page in your PLG product. It is visited by every user considering an upgrade, and its conversion rate directly determines revenue. Every element — plan names, feature lists, CTAs, social proof — must be deliberate.

### Pricing Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                        {{PROJECT_NAME}} Pricing                      │
│                                                                       │
│              "Simple pricing that scales with your team"              │
│              ┌─────────────┐                                         │
│              │ Monthly │ Annual (Save 20%) │   ← Toggle             │
│              └─────────────┘                                         │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │     Free     │  │  ██ Pro ██   │  │  Business    │               │
│  │              │  │  POPULAR     │  │              │               │
│  │    $0/mo     │  │  $__/mo      │  │  $__/mo      │               │
│  │              │  │  per user    │  │  per user    │               │
│  │  For getting │  │  For growing │  │  For scaling │               │
│  │  started     │  │  teams       │  │  orgs        │               │
│  │              │  │              │  │              │               │
│  │  ✓ Feature A │  │  ✓ All Free  │  │  ✓ All Pro   │               │
│  │  ✓ Feature B │  │  ✓ Feature C │  │  ✓ Feature F │               │
│  │  ✓ Feature C │  │  ✓ Feature D │  │  ✓ Feature G │               │
│  │  ✗ Feature D │  │  ✓ Feature E │  │  ✓ Feature H │               │
│  │  ✗ Feature E │  │  ✗ Feature F │  │  ✓ Feature I │               │
│  │              │  │              │  │              │               │
│  │ [Current]    │  │ [Upgrade →]  │  │ [Upgrade →]  │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │  Enterprise — Custom pricing, SSO, SLA, dedicated support │      │
│  │                    [Contact Sales]                          │      │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                       │
│  ┌─ Social Proof ───────────────────────────────────────────┐       │
│  │  "Trusted by 5,000+ teams" │ Logo bar │ Testimonial       │      │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                       │
│  ┌─ FAQ Accordion ──────────────────────────────────────────┐       │
│  │  Can I change plans?  │  What payment methods?  │ Refund? │      │
│  └──────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

### Pricing Page Best Practices

| Practice | Rationale | Implementation |
|----------|-----------|---------------|
| Highlight recommended plan | Anchoring effect drives most conversions to middle tier | Visual emphasis: border, "Popular" badge, larger card |
| Show annual savings | Annual plans improve LTV and reduce churn | Toggle with "Save X%" label, show monthly equivalent |
| Use per-user pricing | Scales naturally with team growth | "$X/user/month" with clear seat count |
| Limit plan count to 3-4 | Choice overload reduces conversion | Free, Pro, Business (+Enterprise CTA) |
| Feature comparison below fold | Detailed comparison for researchers | Expandable feature table |
| Include social proof | Reduces purchase anxiety | Logo bar, testimonial, customer count |
| FAQ section | Answers objections without requiring support | 5-8 common questions |
| Money-back guarantee | Reduces risk perception | "30-day money-back guarantee" badge |

### Pricing Page React Component

```tsx
// src/components/pricing/PricingPage.tsx

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;          // per month when billed annually
  features: Array<{
    name: string;
    included: boolean;
    limit?: string;              // e.g., "Up to 10", "Unlimited"
  }>;
  cta: string;
  highlighted: boolean;
  badge?: string;                // e.g., "Most Popular"
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "For individuals getting started",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      { name: "Projects", included: true, limit: "{{FREE_TIER_LIMITS}}" },
      { name: "Team members", included: true, limit: "1 user" },
      { name: "Core features", included: true },
      { name: "Community support", included: true },
      { name: "Advanced analytics", included: false },
      { name: "API access", included: false },
      { name: "Priority support", included: false },
    ],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing teams",
    monthlyPrice: 0,       // Fill in actual price
    annualPrice: 0,         // Fill in actual price
    features: [
      { name: "Projects", included: true, limit: "Unlimited" },
      { name: "Team members", included: true, limit: "Up to 20" },
      { name: "Core features", included: true },
      { name: "Email support", included: true },
      { name: "Advanced analytics", included: true },
      { name: "API access", included: true },
      { name: "Priority support", included: false },
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "business",
    name: "Business",
    description: "For scaling organizations",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      { name: "Projects", included: true, limit: "Unlimited" },
      { name: "Team members", included: true, limit: "Unlimited" },
      { name: "Core features", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced analytics", included: true },
      { name: "API access", included: true },
      { name: "SSO / SAML", included: true },
    ],
    cta: "Upgrade to Business",
    highlighted: false,
  },
];

function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual"
  );

  return (
    <div className="pricing-page">
      <header className="pricing-header">
        <h1>Simple pricing that scales with your team</h1>
        <BillingToggle value={billingCycle} onChange={setBillingCycle} />
      </header>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
          />
        ))}
      </div>

      <EnterpriseCTA />
      <SocialProof />
      <FeatureComparison plans={plans} />
      <FAQ />
    </div>
  );
}
```

---

## 2. Checkout Optimization

Checkout is where purchase intent converts to revenue. Every unnecessary field, confusing step, or trust concern causes drop-off.

### Checkout Flow

```
Step 1: Plan Selection (from pricing page or upgrade modal)
  ↓
Step 2: Seat Count / Usage Confirmation
  ↓
Step 3: Billing Information (card or invoice)
  ↓
Step 4: Review & Confirm
  ↓
Step 5: Success + Immediate Feature Unlock
```

### Checkout Optimization Tactics

| Tactic | Expected Lift | Effort |
|--------|-------------|--------|
| Pre-fill plan from context (e.g., upgrade modal already selected Pro) | 5-10% | Low |
| Show "what you'll unlock" summary during checkout | 3-8% | Low |
| Accept Google Pay / Apple Pay for 1-click payment | 10-20% | Medium |
| Show trust badges (SSL, SOC 2, money-back guarantee) | 3-5% | Low |
| Remove header nav during checkout (reduce exits) | 2-5% | Low |
| Show "X teams upgraded today" social proof | 2-4% | Low |
| Prorated billing for mid-cycle upgrades | Reduces objections | Medium |
| Inline validation (instant feedback on card errors) | 5-8% | Low |
| Remember payment method for returning users | 10-15% | Medium |
| Offer coupon/promo code field (collapsed by default) | Mixed — test it | Low |

### Checkout Drop-off Tracking

```typescript
// src/growth/checkout-events.ts

const CHECKOUT_EVENTS = [
  "checkout.started",              // User entered checkout flow
  "checkout.plan_selected",        // Plan choice confirmed
  "checkout.seats_confirmed",      // Seat count set
  "checkout.billing_entered",      // Payment info entered
  "checkout.review_viewed",        // Review page viewed
  "checkout.confirmed",            // Payment submitted
  "checkout.succeeded",            // Payment succeeded
  "checkout.failed",               // Payment failed (card declined, etc.)
  "checkout.abandoned",            // User left checkout without completing
] as const;

// Track drop-off between each step
// Target: < 20% drop-off at any single step
// Red flag: > 40% drop-off at any step means UX problem
```

---

## 3. Plan Comparison Table

A detailed feature comparison table for users who want to research before purchasing. This lives below the fold on the pricing page.

### Feature Comparison Matrix

```
┌───────────────────────────────┬──────────┬──────────┬──────────┬────────────┐
│ Feature                       │   Free   │   Pro    │ Business │ Enterprise │
├───────────────────────────────┼──────────┼──────────┼──────────┼────────────┤
│ CORE                          │          │          │          │            │
│ Core feature A                │    ✓     │    ✓     │    ✓     │     ✓      │
│ Core feature B                │    ✓     │    ✓     │    ✓     │     ✓      │
│ Core feature C                │  Limited │    ✓     │    ✓     │     ✓      │
├───────────────────────────────┼──────────┼──────────┼──────────┼────────────┤
│ COLLABORATION                 │          │          │          │            │
│ Team members                  │    1     │   20     │ Unlimited│  Unlimited │
│ Workspaces                    │    1     │    5     │ Unlimited│  Unlimited │
│ Guest access                  │    ✗     │    ✓     │    ✓     │     ✓      │
│ Role-based permissions        │    ✗     │    ✗     │    ✓     │     ✓      │
├───────────────────────────────┼──────────┼──────────┼──────────┼────────────┤
│ ANALYTICS & REPORTING         │          │          │          │            │
│ Basic analytics               │    ✓     │    ✓     │    ✓     │     ✓      │
│ Advanced analytics            │    ✗     │    ✓     │    ✓     │     ✓      │
│ Custom reports                │    ✗     │    ✗     │    ✓     │     ✓      │
│ Data export                   │    ✗     │    ✓     │    ✓     │     ✓      │
├───────────────────────────────┼──────────┼──────────┼──────────┼────────────┤
│ INTEGRATIONS                  │          │          │          │            │
│ Standard integrations         │    3     │   20     │ Unlimited│  Unlimited │
│ API access                    │    ✗     │    ✓     │    ✓     │     ✓      │
│ Webhooks                      │    ✗     │    ✗     │    ✓     │     ✓      │
│ Custom integrations           │    ✗     │    ✗     │    ✗     │     ✓      │
├───────────────────────────────┼──────────┼──────────┼──────────┼────────────┤
│ SECURITY & COMPLIANCE         │          │          │          │            │
│ SSO / SAML                    │    ✗     │    ✗     │    ✓     │     ✓      │
│ Audit logs                    │    ✗     │    ✗     │    ✓     │     ✓      │
│ SOC 2 compliance              │    ✗     │    ✗     │    ✗     │     ✓      │
│ Custom SLA                    │    ✗     │    ✗     │    ✗     │     ✓      │
├───────────────────────────────┼──────────┼──────────┼──────────┼────────────┤
│ SUPPORT                       │          │          │          │            │
│ Community support             │    ✓     │    ✓     │    ✓     │     ✓      │
│ Email support                 │    ✗     │    ✓     │    ✓     │     ✓      │
│ Priority support              │    ✗     │    ✗     │    ✓     │     ✓      │
│ Dedicated success manager     │    ✗     │    ✗     │    ✗     │     ✓      │
├───────────────────────────────┼──────────┼──────────┼──────────┼────────────┤
│ STORAGE & LIMITS              │          │          │          │            │
│ Storage                       │  100 MB  │  10 GB   │  100 GB  │  Unlimited │
│ API rate limit                │  N/A     │ 1K/min   │ 10K/min  │  Custom    │
│ File upload size              │  10 MB   │  100 MB  │  500 MB  │  Custom    │
└───────────────────────────────┴──────────┴──────────┴──────────┴────────────┘
```

---

## 4. Upgrade Modal and Banner Patterns

### Contextual Upgrade Modal

Shown when a user hits a feature gate or usage limit.

```tsx
// src/components/upgrade/UpgradeModal.tsx

interface UpgradeModalProps {
  trigger: "feature_gate" | "usage_limit" | "team_limit" | "manual";
  feature?: string;
  currentUsage?: number;
  limit?: number;
  recommendedPlan: string;
}

function UpgradeModal({
  trigger,
  feature,
  currentUsage,
  limit,
  recommendedPlan,
}: UpgradeModalProps) {
  const headlines: Record<string, string> = {
    feature_gate: `Unlock ${feature} with ${recommendedPlan}`,
    usage_limit: `You've used ${currentUsage} of ${limit} — upgrade for more`,
    team_limit: `Your team is growing! Upgrade to add more members`,
    manual: `Get more from {{PROJECT_NAME}}`,
  };

  return (
    <Modal>
      <Modal.Header>
        <h2>{headlines[trigger]}</h2>
      </Modal.Header>

      <Modal.Body>
        {/* Show what user unlocks — not what they're missing */}
        <UnlockList plan={recommendedPlan} />

        {/* Show social proof specific to this plan */}
        <p className="social-proof">
          Join {planUserCount} teams already on {recommendedPlan}
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={goToCheckout}>
          Upgrade to {recommendedPlan}
        </Button>
        <Button variant="ghost" onClick={dismiss}>
          Maybe later
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
```

### Upgrade Banner Patterns

```tsx
// src/components/upgrade/UpgradeBanner.tsx

// Pattern 1: Usage limit approaching (inline banner)
function UsageLimitBanner({ used, limit, resource }: LimitBannerProps) {
  const pct = Math.round((used / limit) * 100);
  if (pct < 75) return null; // Only show at 75%+

  return (
    <Banner variant={pct >= 90 ? "warning" : "info"}>
      <ProgressBar value={pct} />
      <span>
        {used} of {limit} {resource} used
        {pct >= 90 ? " — upgrade to avoid interruption" : ""}
      </span>
      <Button size="sm" onClick={goToUpgrade}>
        Upgrade
      </Button>
    </Banner>
  );
}

// Pattern 2: Feature discovery (tooltip upgrade prompt)
function FeatureGateTooltip({ feature, plan }: GateTooltipProps) {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Button disabled>
          {feature} <LockIcon />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>{feature} is available on {plan}</p>
        <Button size="sm" onClick={goToUpgrade}>
          See plans
        </Button>
      </Tooltip.Content>
    </Tooltip>
  );
}

// Pattern 3: Subtle sidebar nudge
function SidebarUpgradeNudge() {
  return (
    <div className="sidebar-upgrade-nudge">
      <SparkleIcon />
      <span>Unlock advanced features</span>
      <ArrowRightIcon />
    </div>
  );
}
```

### Upgrade Prompt Timing Rules

| Rule | Implementation | Rationale |
|------|---------------|-----------|
| Do not prompt during first session | Wait until user has experienced value | Premature prompts increase churn |
| Maximum 1 modal per session | Cooldown after modal dismiss | Prevents annoyance |
| Maximum 3 banners per day | Banner frequency cap | Diminishing returns |
| No prompt within 5 minutes of signup | Grace period | Let user explore first |
| Prompt after value moment, not before | Trigger after success, not during setup | Positive context increases conversion |
| Cool down 7 days after "Maybe later" | Respect user choice | Hard sells backfire |
| Escalate only after 3+ gate encounters | Show upgrade only after repeated need | Confirms genuine need |

---

## 5. Downgrade and Cancellation Flow

Downgrade and cancellation flows are retention opportunities. A well-designed offboarding experience reduces churn by 10-30%.

### Cancellation Flow

```
Step 1: "Are you sure?" confirmation
  ↓
Step 2: Cancellation reason survey (required, 4-6 options)
  ↓
Step 3: Targeted retention offer based on reason
  ↓
Step 4: Data impact warning ("You'll lose access to...")
  ↓
Step 5: Final confirmation with end-of-billing-period notice
  ↓
Step 6: Confirmation email + re-activation path
```

### Cancellation Reason → Retention Offer Map

| Cancellation Reason | Retention Offer | Expected Save Rate |
|--------------------|-----------------|--------------------|
| "Too expensive" | Offer 20% discount for 3 months | 15-25% |
| "Missing features" | Show upcoming roadmap items | 5-10% |
| "Switching to competitor" | Offer concierge migration help | 5-8% |
| "Not using enough" | Offer free downgrade to keep data | 20-30% |
| "Too complex" | Offer 1:1 onboarding call | 10-15% |
| "Temporary — will return" | Offer pause instead of cancel | 30-50% |

### Downgrade Impact Warning

```tsx
// src/components/billing/DowngradeWarning.tsx

function DowngradeWarning({
  currentPlan,
  targetPlan,
  impactedFeatures,
  impactedData,
}: DowngradeWarningProps) {
  return (
    <div className="downgrade-warning">
      <h3>What changes when you move to {targetPlan.name}</h3>

      <section className="feature-impact">
        <h4>Features you'll lose access to:</h4>
        <ul>
          {impactedFeatures.map((f) => (
            <li key={f.id}>
              <CrossIcon /> {f.name}
              {f.dataAtRisk && (
                <span className="data-warning">
                  — {f.dataAtRisk} will be archived
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="limit-impact">
        <h4>New limits:</h4>
        <table>
          <thead>
            <tr>
              <th>Resource</th>
              <th>Current</th>
              <th>After Downgrade</th>
              <th>Your Usage</th>
            </tr>
          </thead>
          <tbody>
            {impactedData.map((d) => (
              <tr key={d.resource} className={d.overLimit ? "over-limit" : ""}>
                <td>{d.resource}</td>
                <td>{d.currentLimit}</td>
                <td>{d.newLimit}</td>
                <td>
                  {d.currentUsage}
                  {d.overLimit && <WarningIcon />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {impactedData.some((d) => d.overLimit) && (
        <Alert variant="warning">
          Your current usage exceeds the {targetPlan.name} limits.
          You'll need to reduce usage before the downgrade takes effect.
        </Alert>
      )}
    </div>
  );
}
```

---

## 6. Annual vs Monthly Toggle

The annual/monthly toggle is a high-leverage micro-interaction. Getting it right can shift 20-40% of signups from monthly to annual billing.

### Toggle Design Principles

| Principle | Implementation |
|-----------|---------------|
| Default to annual | Annual should be pre-selected (higher LTV) |
| Show savings prominently | "Save 20%" or "$X/year saved" next to annual |
| Show monthly equivalent | "$X/mo billed annually" reduces sticker shock |
| Anchor on monthly | Show monthly price first, annual as discount |
| Animate savings | Highlight the price change when toggling |

### Toggle Component

```tsx
// src/components/pricing/BillingToggle.tsx

interface BillingToggleProps {
  value: "monthly" | "annual";
  onChange: (value: "monthly" | "annual") => void;
  savingsPercent: number;  // e.g., 20
}

function BillingToggle({ value, onChange, savingsPercent }: BillingToggleProps) {
  return (
    <div className="billing-toggle" role="radiogroup" aria-label="Billing cycle">
      <button
        role="radio"
        aria-checked={value === "monthly"}
        className={value === "monthly" ? "active" : ""}
        onClick={() => onChange("monthly")}
      >
        Monthly
      </button>
      <button
        role="radio"
        aria-checked={value === "annual"}
        className={value === "annual" ? "active" : ""}
        onClick={() => onChange("annual")}
      >
        Annual
        <span className="savings-badge">Save {savingsPercent}%</span>
      </button>
    </div>
  );
}
```

### Annual Conversion Optimization

| Tactic | Expected Impact | Notes |
|--------|----------------|-------|
| Default to annual toggle | +15-25% annual selection | Most users accept default |
| Show total annual savings in dollars | +5-10% | "$240 saved/year" > "Save 20%" |
| Offer annual-only features | +10-15% | e.g., priority support only on annual |
| Show "most popular" on annual plans | +3-5% | Social proof for annual |
| End-of-trial email offering annual discount | +5-8% | Capture at decision point |
| In-app prompt to switch monthly→annual at month 3 | +10-20% of monthly users | Users already validated value |

---

## Checklist

- [ ] Designed pricing page with 3-4 plans, recommended plan highlighted
- [ ] Built annual/monthly toggle defaulting to annual with savings badge
- [ ] Created detailed feature comparison table
- [ ] Implemented checkout flow with maximum 4-5 steps
- [ ] Added checkout drop-off tracking at each step
- [ ] Designed contextual upgrade modals for feature gates and usage limits
- [ ] Implemented upgrade banner with frequency caps and cooldowns
- [ ] Built downgrade flow with reason survey and retention offers
- [ ] Added cancellation flow with targeted save offers
- [ ] Tested checkout with Stripe/payment provider test mode
- [ ] Validated upgrade conversion rate: target {{UPGRADE_CONVERSION_TARGET}}%
- [ ] Verified pricing page loads in < 2 seconds

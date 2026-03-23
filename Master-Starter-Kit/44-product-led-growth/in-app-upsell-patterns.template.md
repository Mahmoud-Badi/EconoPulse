# In-App Upsell Patterns

> Design contextual upsell and cross-sell patterns — trigger taxonomy, UI pattern library, timing rules with frequency caps and cooldowns, A/B testing framework, anti-pattern avoidance, and revenue attribution.

---

## 1. Trigger Taxonomy

Upsell triggers are in-product moments where showing an upgrade prompt is both contextually relevant and likely to convert. Triggers fall into five categories based on user state.

### Trigger Categories

| Category | Description | Urgency | Conversion Potential |
|----------|-------------|---------|---------------------|
| Limit triggers | User approaches or hits a plan limit | High | Very High (20-40%) |
| Feature triggers | User discovers or attempts a paid feature | Medium | High (10-25%) |
| Success triggers | User achieves a milestone or success moment | Low | Medium (5-15%) |
| Growth triggers | Account grows (team size, usage volume) | Medium | High (15-25%) |
| Time triggers | Calendar-based (trial expiry, anniversary) | Varies | Medium (8-15%) |

### Complete Trigger Registry

| ID | Trigger | Category | Context | Recommended Pattern |
|----|---------|----------|---------|-------------------|
| UP-001 | Storage at 80% | Limit | Dashboard/upload | Inline banner |
| UP-002 | Storage at 100% | Limit | Upload blocked | Blocking modal |
| UP-003 | Project limit reached | Limit | Create project | Blocking modal |
| UP-004 | Seat limit reached | Limit | Invite member | Blocking modal |
| UP-005 | API rate limit hit | Limit | API response | Dashboard warning |
| UP-006 | Clicked locked feature | Feature | Feature page | Tooltip or soft modal |
| UP-007 | Searched for paid feature | Feature | Search results | Inline result badge |
| UP-008 | Viewed paid feature docs | Feature | Documentation | Inline CTA |
| UP-009 | Attempted export/integration | Feature | Export dialog | Feature gate modal |
| UP-010 | Created 5th project | Success | Project list | Celebratory nudge |
| UP-011 | Invited 3rd teammate | Success | Team settings | Growth suggestion |
| UP-012 | Used product 10 days straight | Success | Dashboard | Achievement + upgrade |
| UP-013 | Team grew to 5+ members | Growth | Team settings | Plan comparison email |
| UP-014 | Usage doubled month-over-month | Growth | Dashboard | Scale suggestion |
| UP-015 | Added users from new department | Growth | Team admin | Enterprise pitch |
| UP-016 | Trial 3 days from expiry | Time | Header banner | Urgency banner |
| UP-017 | Trial expired | Time | Login | Full-page conversion |
| UP-018 | 6-month free anniversary | Time | Dashboard | Loyalty upgrade offer |
| UP-019 | Visited pricing page | Intent | Pricing page | — (already there) |
| UP-020 | Compared plans | Intent | Pricing page | Highlight recommendation |

---

## 2. UI Pattern Library

### Pattern 1: Inline Banner

Low-intrusiveness notification within the product's content area. Best for awareness and limit warnings.

```tsx
// src/components/upsell/InlineBanner.tsx

interface InlineBannerProps {
  type: "info" | "warning" | "success";
  message: string;
  cta: string;
  onCtaClick: () => void;
  onDismiss: () => void;
  dismissible: boolean;
}

function InlineBanner({
  type,
  message,
  cta,
  onCtaClick,
  onDismiss,
  dismissible,
}: InlineBannerProps) {
  return (
    <div className={`upsell-banner upsell-banner--${type}`} role="alert">
      <div className="upsell-banner__icon">
        {type === "info" && <InfoIcon />}
        {type === "warning" && <WarningIcon />}
        {type === "success" && <SparkleIcon />}
      </div>
      <p className="upsell-banner__message">{message}</p>
      <button className="upsell-banner__cta" onClick={onCtaClick}>
        {cta}
      </button>
      {dismissible && (
        <button
          className="upsell-banner__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}

// Usage:
<InlineBanner
  type="warning"
  message="You've used 85% of your storage (85 MB of 100 MB)"
  cta="Upgrade for more"
  onCtaClick={() => navigate("/settings/billing")}
  onDismiss={() => dismissUpsell("storage_warning")}
  dismissible={true}
/>
```

**When to use:** Usage limit approaching (75-95%), feature awareness, non-urgent nudges.

### Pattern 2: Upgrade Modal

Medium-intrusiveness overlay that captures full attention. Best for feature gates and limit blocks.

```tsx
// src/components/upsell/UpgradeModal.tsx

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  headline: string;
  description: string;
  features: string[];
  plan: string;
  price: string;
  billingCycle: string;
}

function UpgradeModal({
  isOpen,
  onClose,
  headline,
  description,
  features,
  plan,
  price,
  billingCycle,
}: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <div className="upgrade-modal__header">
          <SparkleIcon className="upgrade-icon" />
          <h2>{headline}</h2>
          <p>{description}</p>
        </div>

        <div className="upgrade-modal__features">
          <h3>What you get with {plan}:</h3>
          <ul>
            {features.map((feature) => (
              <li key={feature}>
                <CheckIcon /> {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="upgrade-modal__pricing">
          <span className="price">{price}</span>
          <span className="cycle">/{billingCycle}</span>
        </div>

        <div className="upgrade-modal__actions">
          <Button variant="primary" size="lg" onClick={startCheckout}>
            Upgrade to {plan}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Maybe later
          </Button>
        </div>

        <p className="upgrade-modal__guarantee">
          30-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
```

**When to use:** Hard feature gates, critical limit blocks, post-trial conversion.

### Pattern 3: Tooltip Upgrade Prompt

Very low intrusiveness. Appears when user hovers or clicks a locked element.

```tsx
// src/components/upsell/UpgradeTooltip.tsx

function UpgradeTooltip({ feature, plan, children }: UpgradeTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="locked-feature">
            {children}
            <LockIcon className="lock-icon" size={14} />
          </span>
        </TooltipTrigger>
        <TooltipContent className="upgrade-tooltip">
          <p className="tooltip-feature">{feature}</p>
          <p className="tooltip-plan">Available on {plan}</p>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate("/pricing")}
          >
            See plans
          </Button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

**When to use:** Locked nav items, disabled buttons, preview-mode features.

### Pattern 4: Full-Page Conversion (Post-Trial)

Maximum intrusiveness. Used only when the user has no access at all (trial expired, account locked).

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│                   Your trial has ended                            │
│                                                                   │
│        Your data is saved and ready when you are.                │
│                                                                   │
│  During your trial, you:                                         │
│    ✓ Created 12 projects                                         │
│    ✓ Invited 4 teammates                                         │
│    ✓ Used advanced analytics 23 times                            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Pro — $X/mo         │  Business — $X/mo                │    │
│  │  [Choose Pro]        │  [Choose Business]                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Or continue with Free (limited to {{FREE_TIER_LIMITS}})         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**When to use:** Trial expiry only. Never for active free tier users.

### Pattern 5: Contextual Inline CTA

Embedded within feature UI, appearing naturally in the workflow.

```tsx
// src/components/upsell/InlineCTA.tsx

function InlineCTA({ feature, context }: InlineCTAProps) {
  return (
    <div className="inline-cta">
      <div className="inline-cta__preview">
        {/* Show a blurred/dimmed preview of the paid feature */}
        <div className="preview-blur">{context.preview}</div>
      </div>
      <div className="inline-cta__content">
        <p>
          <strong>{feature}</strong> — unlock {context.valueProposition}
        </p>
        <Button size="sm" onClick={() => showUpgradeModal(feature)}>
          Upgrade to unlock
        </Button>
      </div>
    </div>
  );
}
```

**When to use:** Analytics dashboards (show blurred advanced charts), report pages, integration directories.

---

## 3. Timing Rules

### Global Frequency Caps

| Rule | Value | Enforcement |
|------|-------|-------------|
| Max modals per user per day | 1 | Client-side counter, reset at midnight |
| Max banners per user per session | 2 | Session-scoped counter |
| Max tooltips per user per page | 3 | Page-scoped counter |
| Max upsell emails per week | 1 | Server-side frequency cap |
| Cooldown after modal dismiss | 72 hours | Stored in user preferences |
| Cooldown after "Not interested" | 30 days | Stored in user preferences |
| Cooldown after failed payment | 48 hours | Billing event listener |
| Grace period after signup | 48 hours | No upsell triggers for first 48h |

### Cooldown Configuration

```typescript
// src/growth/upsell-cooldowns.ts

interface CooldownConfig {
  triggerId: string;
  pattern: "modal" | "banner" | "tooltip" | "email" | "full_page";
  cooldowns: {
    afterDismiss: number;       // hours
    afterNotInterested: number;  // hours
    afterView: number;           // hours (minimum time before showing again)
    afterConversion: number;     // hours (do not upsell after upgrading — infinity)
  };
  maxPerDay: number;
  maxPerWeek: number;
  maxPerMonth: number;
}

const COOLDOWN_DEFAULTS: Record<string, Partial<CooldownConfig["cooldowns"]>> = {
  modal: {
    afterDismiss: 72,
    afterNotInterested: 720,    // 30 days
    afterView: 24,
  },
  banner: {
    afterDismiss: 24,
    afterNotInterested: 168,    // 7 days
    afterView: 4,
  },
  tooltip: {
    afterDismiss: 1,
    afterNotInterested: 72,
    afterView: 0,               // tooltips can repeat on hover
  },
  email: {
    afterDismiss: 168,          // 7 days
    afterNotInterested: 720,
    afterView: 168,
  },
};

function canShowUpsell(
  userId: string,
  triggerId: string,
  config: CooldownConfig
): boolean {
  const history = getUserUpsellHistory(userId, triggerId);

  // Check absolute frequency caps
  if (history.viewsToday >= config.maxPerDay) return false;
  if (history.viewsThisWeek >= config.maxPerWeek) return false;
  if (history.viewsThisMonth >= config.maxPerMonth) return false;

  // Check cooldowns
  if (history.lastDismissAt) {
    const hoursSinceDismiss = getHoursSince(history.lastDismissAt);
    if (hoursSinceDismiss < config.cooldowns.afterDismiss) return false;
  }

  if (history.lastNotInterestedAt) {
    const hoursSinceNI = getHoursSince(history.lastNotInterestedAt);
    if (hoursSinceNI < config.cooldowns.afterNotInterested) return false;
  }

  if (history.lastViewAt) {
    const hoursSinceView = getHoursSince(history.lastViewAt);
    if (hoursSinceView < config.cooldowns.afterView) return false;
  }

  // Never upsell a user who already upgraded
  if (history.hasConvertedForTrigger) return false;

  return true;
}
```

---

## 4. Cross-Sell Map

Cross-sell opportunities arise when a user on one product or plan would benefit from a complementary product or add-on.

### Cross-Sell Opportunity Matrix

| User Context | Cross-Sell Opportunity | Trigger Signal | Pattern |
|-------------|----------------------|----------------|---------|
| Using project management | Analytics add-on | Creates 5+ reports manually | Inline CTA |
| Using free API | API rate limit increase | Hits rate limit 3+ times | Upgrade banner |
| Single workspace | Multi-workspace plan | Creates 2nd workspace | Tooltip |
| Basic integrations | Premium integrations | Browses integration catalog | Feature gate |
| Standard support | Priority support | Files 3+ support tickets/month | Email upsell |
| Monthly billing | Annual billing | Active for 3+ months | In-app offer |
| Individual plan | Team plan | Invites 2+ collaborators | Modal |

### Cross-Sell Timing

```
GOOD timing for cross-sell:
  ✓ User just successfully completed a task related to the cross-sell
  ✓ User is browsing features adjacent to the cross-sell
  ✓ User hit a limitation that the cross-sell resolves
  ✓ Account usage pattern matches cross-sell value proposition

BAD timing for cross-sell:
  ✗ User is in the middle of a focused workflow
  ✗ User just encountered an error or frustration
  ✗ User is in onboarding (first 48 hours)
  ✗ User just dismissed another upsell prompt
  ✗ User has already declined this specific cross-sell
```

---

## 5. A/B Testing Upsell Patterns

### Testable Elements

| Element | Variants to Test | Primary Metric |
|---------|-----------------|----------------|
| Headline copy | Value-focused vs urgency-focused | Modal → checkout rate |
| CTA text | "Upgrade" vs "Unlock X" vs "Get started" | Click-through rate |
| Social proof | With/without team count or logos | Modal → checkout rate |
| Feature list length | 3 features vs 5 features vs full list | Modal → checkout rate |
| Pricing display | Monthly vs annual-first | Plan selection |
| Dismiss option | "Maybe later" vs "Not interested" vs X button | Re-engagement rate |
| Modal timing | Immediate vs 2-second delay vs after scroll | Dismiss rate |
| Banner color | Brand color vs warning yellow vs info blue | Click-through rate |
| Placement | Top of page vs inline vs sidebar | Visibility + click rate |

### Upsell Experiment Template

```
Experiment ID:    UE-____
Pattern:          Modal / Banner / Tooltip / Email
Trigger:          ________________________________________

Hypothesis:
  If we [change] ________________________________________
  Then [metric] will [improve/decrease] by _____%
  Because ________________________________________

Variants:
  Control: ________________________________________
  Variant: ________________________________________

Metrics:
  Primary:   Trigger → Checkout start rate
  Secondary: Checkout → Completed rate
  Guard rail: User satisfaction score (NPS)

Sample Size: ____ per variant
Duration:    ____ days
```

---

## 6. Anti-Patterns

Upsell patterns that damage trust, reduce engagement, or violate user expectations.

| Anti-Pattern | Problem | Alternative |
|-------------|---------|-------------|
| Dark patterns (hidden upsell in workflow) | Erodes trust, may violate regulations | Always make upgrade optional and clearly labeled |
| Bait-and-switch (feature appears free, is paywalled on use) | Creates frustration and distrust | Show lock icon before user invests effort |
| Nagware (constant upsell prompts) | User ignores all prompts, may churn | Enforce frequency caps and cooldowns |
| Guilt-tripping ("Don't you want to grow?") | Manipulative, damages brand | Use positive framing ("Here's what you'd gain") |
| Removing features from free tier | Penalizes loyal users, PR risk | Grandfather existing users, apply to new signups |
| Fake urgency ("Offer expires today!") | Users learn to ignore, loses credibility | Use real deadlines only (trial expiry) |
| Checkout dark patterns (pre-checked add-ons) | May violate consumer protection laws | All upgrades require explicit opt-in |
| Preventing downgrade (hidden downgrade flow) | Frustrates users, invites chargebacks | Make downgrade as easy as upgrade |
| Upselling during errors | Callous timing, damages relationship | Never show upsell adjacent to error states |
| Spamming modal after every login | Users develop modal blindness | Max 1 modal per session, with cooldown |

---

## 7. Revenue Attribution

### Attribution Model

```typescript
// src/growth/upsell-attribution.ts

interface UpsellConversion {
  userId: string;
  accountId: string;
  conversionType: "upgrade" | "add_seat" | "add_on" | "annual_switch";
  mrrChange: number;
  touchpoints: Array<{
    triggerId: string;
    pattern: string;
    timestamp: string;
    action: "viewed" | "clicked" | "dismissed" | "converted";
  }>;
}

function attributeRevenue(conversion: UpsellConversion): Record<string, number> {
  const touchpoints = conversion.touchpoints.filter(
    (t) => t.action === "viewed" || t.action === "clicked"
  );

  if (touchpoints.length === 0) {
    return { organic: conversion.mrrChange }; // No upsell touchpoint
  }

  // Last-touch attribution for simplicity
  const lastTouch = touchpoints[touchpoints.length - 1];
  return { [lastTouch.triggerId]: conversion.mrrChange };
}
```

### Revenue Attribution Dashboard

```
Month: ________

Total Upgrade Revenue (MRR):   $________

Revenue by Trigger:
  Limit triggers:      $________ (____%)
  Feature triggers:    $________ (____%)
  Success triggers:    $________ (____%)
  Growth triggers:     $________ (____%)
  Time triggers:       $________ (____%)
  Organic (no prompt): $________ (____%)

Revenue by Pattern:
  Modal:               $________ (____%)
  Banner:              $________ (____%)
  Tooltip:             $________ (____%)
  Email:               $________ (____%)
  Full page:           $________ (____%)
  Pricing page:        $________ (____%)

Top 5 Triggers by Revenue:
  1. UP-___ (________): $________ (____%)
  2. UP-___ (________): $________ (____%)
  3. UP-___ (________): $________ (____%)
  4. UP-___ (________): $________ (____%)
  5. UP-___ (________): $________ (____%)

Trigger Efficiency:
  | Trigger | Impressions | Clicks | Conversions | Revenue | Revenue/Impression |
  |---------|-------------|--------|-------------|---------|-------------------|
  | UP-___ | ________ | ________ | ________ | $________ | $________ |
  | UP-___ | ________ | ________ | ________ | $________ | $________ |
  | UP-___ | ________ | ________ | ________ | $________ | $________ |
```

---

## Checklist

- [ ] Catalogued all upsell triggers with category and recommended pattern
- [ ] Built UI component library (banner, modal, tooltip, inline CTA, full page)
- [ ] Implemented global frequency caps (1 modal/day, 2 banners/session)
- [ ] Configured cooldowns per pattern type
- [ ] Mapped cross-sell opportunities with timing rules
- [ ] Created A/B testing framework for upsell pattern optimization
- [ ] Reviewed all patterns against anti-pattern checklist
- [ ] Set up revenue attribution tracking per trigger and pattern
- [ ] Verified upsell patterns respect 48-hour post-signup grace period
- [ ] Tested all upgrade CTAs lead to working checkout flow
- [ ] Set up monthly upsell revenue attribution report

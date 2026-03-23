# Conversion Tracking & Event Plan for {{PROJECT_NAME}}

> **Project:** {{PROJECT_NAME}}
> **Product Type:** {{PRODUCT_TYPE}}
> **Primary Goal:** {{PRIMARY_CONVERSION_GOAL}}
> **Date:** {{DATE}}

---

## Conversion Funnel Definition

A conversion funnel maps the stages a user moves through from first discovering {{PROJECT_NAME}} to becoming (and staying) a customer. Each stage has measurable events that tell you how many people progress — and where they drop off.

### The Five Stages

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌──────────────┐     ┌──────────────┐
│  AWARENESS   │  →  │  INTEREST    │  →  │  CONSIDERATION   │  →  │  CONVERSION  │  →  │  RETENTION   │
│              │     │              │     │                  │     │              │     │              │
│ They know    │     │ They're      │     │ They're          │     │ They buy or  │     │ They stay,   │
│ you exist    │     │ exploring    │     │ evaluating       │     │ subscribe    │     │ expand, refer│
└──────────────┘     └──────────────┘     └──────────────────┘     └──────────────┘     └──────────────┘
```

### Stage 1: Awareness

**What happens:** People discover {{PROJECT_NAME}} exists. They have not yet engaged meaningfully.

| Metric | How to Track | Tool |
|--------|-------------|------|
| Website visits (unique users) | GA4: Users metric | GA4 |
| Ad impressions | Platform dashboards (Google, Meta, LinkedIn) | Ad platforms |
| Social media reach | Impressions, profile visits | Social analytics |
| Brand search volume | Google Search Console: branded queries | GSC |
| Referral traffic | GA4: Traffic acquisition > Source/Medium | GA4 |

**Key Conversion:** Unknown person → Website visitor

### Stage 2: Interest

**What happens:** Visitors engage with your content. They read, browse, and explore. They are not yet evaluating your product specifically.

| Metric | How to Track | Tool |
|--------|-------------|------|
| Pages per session | GA4: Engagement > Pages per session | GA4 |
| Average engagement time | GA4: Average engagement time | GA4 |
| Blog/content engagement | GA4: page_view events on /blog/* | GA4 |
| Newsletter signup | Custom event: newsletter_subscribed | GA4 + Email tool |
| Social media engagement | Likes, comments, shares, saves | Social analytics |
| Return visits | GA4: Returning users | GA4 |

**Key Conversion:** Visitor → Engaged visitor (or email subscriber)

### Stage 3: Consideration

**What happens:** The user is actively evaluating {{PROJECT_NAME}} as a solution. They are comparing options, checking pricing, and assessing fit.

| Metric | How to Track | Tool |
|--------|-------------|------|
| Pricing page views | Custom event: pricing_page_viewed | GA4 |
| Feature/product page views | Custom event: feature_page_viewed (with feature_name) | GA4 |
| Comparison page views | page_view on /compare/* or /vs-* | GA4 |
| Demo requests | Custom event: demo_requested | GA4 + CRM |
| Free trial signups | Custom event: trial_started | GA4 + Product analytics |
| Lead magnet downloads | Custom event: resource_downloaded | GA4 + Email tool |
| Webinar registrations | Custom event: webinar_registered | GA4 + Event tool |

**Key Conversion:** Engaged visitor → Trial user or demo request

### Stage 4: Conversion

**What happens:** The user makes a purchase decision — they subscribe, buy, or commit.

| Metric | How to Track | Tool |
|--------|-------------|------|
| Purchases / Subscriptions | Custom event: purchase | GA4 + Stripe |
| Plan selection | Custom event: plan_selected (with plan_name, value) | GA4 |
| Upgrade from free | Custom event: plan_upgraded (from free to paid) | Product analytics |
| Contract signed | CRM: deal stage = "Closed Won" | CRM |

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
**SaaS-Specific Conversion Events:**
| Event | Trigger | Properties |
|-------|---------|------------|
| trial_to_paid | User converts from trial to paid plan | plan_name, value, trial_duration, features_used |
| annual_upgrade | Switches from monthly to annual | monthly_value, annual_value, savings |
| seat_added | Adds additional team members | seat_count, total_seats, incremental_value |
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "e-commerce" -->
**E-commerce-Specific Conversion Events:**
| Event | Trigger | Properties |
|-------|---------|------------|
| add_to_cart | Product added to cart | product_id, product_name, value, quantity |
| begin_checkout | Checkout flow started | cart_value, item_count |
| purchase | Payment completed | transaction_id, value, items, shipping, tax |
| refund | Refund processed | transaction_id, value, reason |
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
**Marketplace-Specific Conversion Events:**
| Event | Trigger | Properties |
|-------|---------|------------|
| listing_created | New listing/service posted | category, price, seller_id |
| booking_requested | Buyer initiates transaction | listing_id, value, buyer_id |
| transaction_completed | Both parties confirm completion | transaction_id, value, commission |
<!-- ENDIF -->

**Key Conversion:** Trial user / Lead → Paying customer

### Stage 5: Retention

**What happens:** The customer continues using and paying. They expand usage, refer others, and become advocates.

| Metric | How to Track | Tool |
|--------|-------------|------|
| Monthly/Daily active users | Product analytics: unique users with any event | Mixpanel/PostHog |
| Feature adoption | Custom events: feature_used with feature_name | Product analytics |
| Repeat purchases | Purchase events per user over time | GA4 + payment |
| Expansion revenue | plan_upgraded, seat_added events | Product analytics + Stripe |
| Referrals sent | Custom event: referral_sent | Product analytics |
| NPS score | Custom event: nps_submitted (with score) | Survey tool |
| Churn | subscription_cancelled or no activity for X days | Stripe + product analytics |

**Key Conversion:** Customer → Retained customer (or Churned)

---

## Event Tracking Plan

### Event Naming Conventions

**Rules:**
1. Use `snake_case` for all event names (not camelCase, not kebab-case).
2. Use `verb_noun` format: what action was performed on what object.
3. Keep names concise but descriptive.
4. Be consistent — the same action should always have the same event name.
5. Include relevant properties for segmentation, not everything under the sun.

**Examples:**
| Good | Bad | Why |
|------|-----|-----|
| `clicked_cta` | `CTA_Click` | Wrong case, wrong order |
| `completed_onboarding` | `onboarding` | Missing verb |
| `viewed_pricing_page` | `pageView_pricing` | Inconsistent format |
| `submitted_form` | `form-submitted` | Wrong case format |
| `started_trial` | `freeTrialStartedByUser` | Too verbose |

### Event Tracking Plan Template for {{PROJECT_NAME}}

**Navigation Events:**

| Event Name | Category | Trigger | Properties | Tool |
|------------|----------|---------|------------|------|
| page_viewed | Navigation | Any page load | page_url, page_title, referrer, utm_source, utm_medium, utm_campaign | GA4, Mixpanel |
| tab_clicked | Navigation | Tab navigation in app | tab_name, previous_tab | Product analytics |
| search_performed | Navigation | Site or in-app search | query, results_count, category | GA4, Product analytics |
| external_link_clicked | Navigation | Click to external site | destination_url, link_text, page_url | GA4 |

**Acquisition Events:**

| Event Name | Category | Trigger | Properties | Tool |
|------------|----------|---------|------------|------|
| signed_up | Acquisition | Account creation | method (email/google/github), referral_source, plan, utm_source, utm_medium, utm_campaign | GA4, Mixpanel, CRM |
| newsletter_subscribed | Acquisition | Email list signup | form_location, lead_magnet, utm_source | GA4, Email tool |
| demo_requested | Acquisition | Demo form submitted | company, role, company_size, use_case | GA4, CRM |
| resource_downloaded | Acquisition | Content download | resource_name, resource_type, form_location | GA4, Email tool |
| referral_link_clicked | Acquisition | Referral link used | referrer_id, campaign | GA4, Product analytics |

**Activation Events:**

| Event Name | Category | Trigger | Properties | Tool |
|------------|----------|---------|------------|------|
| onboarding_started | Activation | First onboarding step | — | Product analytics |
| onboarding_step_completed | Activation | Each step finished | step_number, step_name, time_spent | Product analytics |
| onboarding_completed | Activation | All steps done | total_time, steps_skipped | Product analytics |
| first_feature_used | Activation | First use of core feature | feature_name | Product analytics |
| aha_moment_reached | Activation | Key value event | trigger_action, time_since_signup | Product analytics |
| invited_team_member | Activation | Team invite sent | invite_count, role | Product analytics |

**Engagement Events:**

| Event Name | Category | Trigger | Properties | Tool |
|------------|----------|---------|------------|------|
| feature_used | Engagement | Any feature interaction | feature_name, duration, success | Product analytics |
| project_created | Engagement | New project/workspace | project_type, template_used | Product analytics |
| content_created | Engagement | User creates content | content_type, word_count, media_count | Product analytics |
| export_completed | Engagement | Data/report exported | export_format, data_size | Product analytics |
| settings_changed | Engagement | User modifies settings | setting_name, old_value, new_value | Product analytics |

**Revenue Events:**

| Event Name | Category | Trigger | Properties | Tool |
|------------|----------|---------|------------|------|
| plan_selected | Revenue | Clicks on a plan | plan_name, plan_price, billing_period | GA4 |
| checkout_started | Revenue | Enters payment flow | plan_name, value, currency | GA4 |
| purchase_completed | Revenue | Payment succeeds | plan_name, value, currency, payment_method | GA4, Stripe |
| plan_upgraded | Revenue | Moves to higher plan | from_plan, to_plan, value_change | Product analytics, Stripe |
| plan_downgraded | Revenue | Moves to lower plan | from_plan, to_plan, value_change | Product analytics, Stripe |
| subscription_renewed | Revenue | Auto-renewal succeeds | plan_name, value, months_active | Stripe |
| subscription_cancelled | Revenue | Cancels subscription | plan_name, reason, months_active | Stripe, Product analytics |

---

## Attribution Models

Attribution answers the question: "Which marketing touchpoint gets credit for this conversion?"

### Model Comparison

| Model | How It Works | Best For | Example |
|-------|-------------|----------|---------|
| **First-Touch** | 100% credit to the first interaction | Understanding which channels drive awareness | User found you via Google search → later came direct → bought. Google gets 100% credit. |
| **Last-Touch** | 100% credit to the last interaction before conversion | Understanding which channels close deals | User found you via Google → came back via email → bought. Email gets 100% credit. |
| **Linear** | Equal credit to every touchpoint | Balanced view when all touchpoints matter | Google (33%) → Email (33%) → Direct (33%) |
| **Time-Decay** | More credit to touchpoints closer to conversion | Valuing bottom-of-funnel activity | Google (10%) → Email (30%) → Direct (60%) |
| **Position-Based (U-shaped)** | 40% to first touch, 40% to last touch, 20% split among middle | Valuing both discovery and closing channels | Google (40%) → Social (10%) → Email (10%) → Direct (40%) |
| **Data-Driven** | Algorithmic, based on your actual data patterns | When you have enough conversion data (1000+ conversions) | Algorithm determines credit based on statistical analysis |

### Which Model to Start With

**Start with Last-Touch attribution.** Here is why:
- It is the simplest to implement and understand.
- GA4 defaults to last-touch in most reports.
- It directly answers: "What was the final push that made them convert?"
- You can layer on multi-touch models later when you have more data and more channels.

**When to Add Multi-Touch:**
- You are spending on 3+ marketing channels.
- You have 500+ conversions per month.
- Last-touch data seems misleading (e.g., "direct" gets all credit because people bookmark your site).

---

## UTM Parameter Strategy

UTM (Urchin Tracking Module) parameters are tags added to URLs that tell analytics tools where traffic came from. They are the foundation of marketing attribution.

### UTM Parameters

| Parameter | Purpose | Examples |
|-----------|---------|---------|
| `utm_source` | Where the traffic comes from | google, facebook, twitter, linkedin, newsletter, partner_name |
| `utm_medium` | How the traffic comes | cpc, organic, social, email, referral, display, video |
| `utm_campaign` | Which campaign or initiative | spring_launch, black_friday, product_update_jan, webinar_ai |
| `utm_content` | Which specific creative or link (optional) | hero_cta, sidebar_banner, blue_button, testimonial_version |
| `utm_term` | Which keyword (paid search, optional) | project_management_tool, best_crm_software |

### Naming Conventions

**Rules:**
1. Always use lowercase: `utm_source=facebook` not `utm_source=Facebook`.
2. Use underscores for spaces: `utm_campaign=spring_launch` not `spring-launch` or `spring launch`.
3. Be consistent and document your conventions.
4. Never use special characters or spaces.
5. Keep values concise but descriptive.

### UTM Builder for {{PROJECT_NAME}}

**Base URL:** `{{PROJECT_URL}}`

**Social Media Posts:**
```
{{PROJECT_URL}}?utm_source=twitter&utm_medium=social&utm_campaign={{CAMPAIGN_NAME}}&utm_content={{POST_TYPE}}
{{PROJECT_URL}}?utm_source=linkedin&utm_medium=social&utm_campaign={{CAMPAIGN_NAME}}&utm_content={{POST_TYPE}}
{{PROJECT_URL}}?utm_source=reddit&utm_medium=social&utm_campaign={{CAMPAIGN_NAME}}&utm_content={{SUBREDDIT}}
```

**Email Campaigns:**
```
{{PROJECT_URL}}?utm_source=newsletter&utm_medium=email&utm_campaign={{EMAIL_NAME}}&utm_content={{LINK_POSITION}}
{{PROJECT_URL}}?utm_source=drip_sequence&utm_medium=email&utm_campaign=welcome_series&utm_content=email_{{NUMBER}}
```

**Paid Ads:**
```
{{PROJECT_URL}}?utm_source=google&utm_medium=cpc&utm_campaign={{CAMPAIGN_NAME}}&utm_term={{KEYWORD}}&utm_content={{AD_VARIANT}}
{{PROJECT_URL}}?utm_source=facebook&utm_medium=cpc&utm_campaign={{CAMPAIGN_NAME}}&utm_content={{AD_SET}}_{{CREATIVE}}
{{PROJECT_URL}}?utm_source=linkedin&utm_medium=cpc&utm_campaign={{CAMPAIGN_NAME}}&utm_content={{AUDIENCE}}_{{FORMAT}}
```

**Partnership/Directory Links:**
```
{{PROJECT_URL}}?utm_source={{PARTNER_NAME}}&utm_medium=referral&utm_campaign=partner_{{YEAR}}
{{PROJECT_URL}}?utm_source=producthunt&utm_medium=referral&utm_campaign=launch_{{DATE}}
{{PROJECT_URL}}?utm_source=g2&utm_medium=referral&utm_campaign=review_listing
```

**Content/Blog Links:**
```
{{PROJECT_URL}}?utm_source=blog&utm_medium=content&utm_campaign={{POST_SLUG}}&utm_content={{CTA_TYPE}}
```

### Where to Use UTMs

| Channel | Use UTMs? | Notes |
|---------|-----------|-------|
| Social media posts (organic) | Yes | Every link shared on social should have UTMs |
| Email campaigns and sequences | Yes | Every link in every email |
| Paid ads (Google, Meta, LinkedIn) | Yes | Ad platforms also add auto-tagging (gclid, fbclid) |
| Partner links | Yes | Track which partners drive traffic |
| Directory listings | Yes | ProductHunt, G2, Capterra, etc. |
| Blog post CTAs | Yes | Track which blog content converts |
| QR codes | Yes | Physical marketing → digital tracking |
| Internal links (your own site) | **No** | UTMs on internal links break session tracking |
| Direct/organic search | **No** | Handled automatically by analytics |

### UTM Tracking Spreadsheet

Maintain a master list of all UTM links to prevent duplication and inconsistency:

| Date | Destination URL | Source | Medium | Campaign | Content | Term | Short URL | Used In |
|------|----------------|--------|--------|----------|---------|------|-----------|---------|
| ____ | ______________ | ______ | ______ | ________ | _______ | ____ | _________ | _______ |
| ____ | ______________ | ______ | ______ | ________ | _______ | ____ | _________ | _______ |
| ____ | ______________ | ______ | ______ | ________ | _______ | ____ | _________ | _______ |

---

## Cross-Platform Tracking

### Connecting Website → Product → CRM

The full picture requires connecting three data layers:

```
WEBSITE (GA4)                    PRODUCT (Mixpanel/PostHog)          CRM (HubSpot/Pipedrive)
─────────────                    ──────────────────────────          ─────────────────────────
Anonymous visitor                Anonymous user                     No record yet
  │                                │                                  │
  ├── utm_source=google            │                                  │
  ├── Visited pricing page         │                                  │
  │                                │                                  │
  ▼ [SIGNUP EVENT]                 ▼ [IDENTIFY with user ID]         ▼ [Contact created]
  │                                │                                  │
  ├── GA4 knows: traffic source    ├── Mixpanel knows: features used  ├── CRM knows: lead source
  ├── GA4 knows: pages visited     ├── Mixpanel knows: engagement     ├── CRM knows: deal value
  │                                │                                  │
  └── Connected via user ID ───────┴── Connected via email/user ID ───┘
```

**How to Connect:**
1. Use the same user ID across all platforms when identifying users.
2. Pass UTM parameters from GA4 to CRM (via form hidden fields or URL parsing).
3. Sync CRM data to product analytics (push plan, revenue, lifecycle stage).
4. Use a data warehouse (BigQuery, Snowflake) for full cross-platform analysis when you reach scale.

---

## Event Tracking Plan for {{PROJECT_NAME}}

### Priority Events (Implement First)

| Priority | Event | Stage | Why |
|----------|-------|-------|-----|
| P0 | page_viewed | All | Foundation — everything depends on pageview data |
| P0 | signed_up | Acquisition | Core conversion event |
| P0 | purchase_completed | Revenue | Revenue tracking |
| P1 | pricing_page_viewed | Consideration | High-intent signal |
| P1 | trial_started | Consideration | Key funnel step |
| P1 | onboarding_completed | Activation | Activation metric |
| P1 | feature_used | Engagement | Product engagement |
| P2 | cta_clicked | Interest | Content effectiveness |
| P2 | form_submitted | Acquisition | Lead generation |
| P2 | plan_upgraded | Revenue | Expansion revenue |
| P2 | subscription_cancelled | Retention | Churn tracking |
| P3 | search_performed | Engagement | UX optimization |
| P3 | settings_changed | Engagement | Personalization signal |
| P3 | referral_sent | Retention | Viral growth |

### Implementation Checklist

- [ ] Define event naming conventions (documented above)
- [ ] Create event tracking plan with all events, properties, and tools
- [ ] Implement P0 events first (page_viewed, signed_up, purchase_completed)
- [ ] Verify P0 events in GA4 real-time and product analytics debugger
- [ ] Implement P1 events (pricing_page_viewed, trial_started, onboarding_completed, feature_used)
- [ ] Set up conversion marking in GA4 for key events
- [ ] Implement UTM tracking for all marketing channels
- [ ] Set up attribution model in GA4 (start with last-touch)
- [ ] Create UTM naming convention document and share with team
- [ ] Implement P2 and P3 events
- [ ] Build conversion funnel reports
- [ ] Schedule weekly event data review

---

*This conversion tracking plan is part of the {{PROJECT_NAME}} Master Starter Kit — Marketing section.*
*Last updated: {{DATE}}*

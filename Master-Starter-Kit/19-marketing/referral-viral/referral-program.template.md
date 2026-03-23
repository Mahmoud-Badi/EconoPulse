# Referral Program Design for {{PROJECT_NAME}}

> Turn your happiest customers into your best acquisition channel.
> Product Type: {{PRODUCT_TYPE}} | Target Audience: {{TARGET_AUDIENCE}}
> Current User Count: {{USER_COUNT}} | Monthly Active Users: {{MAU}}

---

## Table of Contents

1. [Referral Program Types](#referral-program-types)
2. [Incentive Design](#incentive-design)
3. [Referral Mechanics](#referral-mechanics)
4. [Program Placement and Visibility](#program-placement-and-visibility)
5. [Timing the Referral Ask](#timing-the-referral-ask)
6. [Technical Implementation](#technical-implementation)
7. [Launching Your Referral Program](#launching-your-referral-program)
8. [Measuring Referral Success](#measuring-referral-success)
9. [Optimization and A/B Testing](#optimization-and-ab-testing)
10. [Example Referral Programs](#example-referral-programs)
11. [Template for {{PROJECT_NAME}}](#template-for-project_name)
12. [Anti-Fraud Measures](#anti-fraud-measures)

---

## Referral Program Types

Choose the model that best fits {{PROJECT_NAME}}'s business model, customer behavior, and what your users value most.

### One-Sided Reward

Only the referrer gets rewarded.

| Aspect | Detail |
|--------|--------|
| **How it works** | Existing user shares. If friend signs up, referrer gets reward. Friend gets nothing extra. |
| **Best for** | Products where the product itself is the incentive for the friend (strong product, friend needs it anyway) |
| **Pros** | Simple to implement, lower cost per referral |
| **Cons** | Lower conversion rate on the friend side (no incentive to act) |
| **Example** | "Refer a friend, get $10 credit" |

### Two-Sided Reward (Recommended for Most Products)

Both the referrer and the friend get rewarded.

| Aspect | Detail |
|--------|--------|
| **How it works** | Referrer shares. Friend signs up and gets a bonus. Referrer also gets a bonus. |
| **Best for** | Most products -- aligns incentives for both parties |
| **Pros** | Higher conversion rate (friend has reason to act), feels generous not spammy |
| **Cons** | Higher cost per referral, more complex tracking |
| **Example** | "Give $10, Get $10" or "Give 1 month free, Get 1 month free" |

### Tiered Rewards

Rewards increase with more referrals.

| Aspect | Detail |
|--------|--------|
| **How it works** | Referrer unlocks increasingly valuable rewards as they refer more people |
| **Best for** | Products with highly engaged power users willing to actively promote |
| **Pros** | Motivates ongoing referral behavior, gamification element |
| **Cons** | Complex to implement and communicate, can attract gaming behavior |
| **Example** | "1 referral = sticker, 3 = t-shirt, 5 = free month, 10 = lifetime discount" |

### Credit-Based

Referrals earn product credits or account balance.

| Aspect | Detail |
|--------|--------|
| **How it works** | Each referral adds credits to the referrer's account |
| **Best for** | Subscription products, usage-based pricing, products with clear unit economics |
| **Pros** | Low cash cost, keeps users engaged with the product, easy to understand |
| **Cons** | Only valuable if users need more credits/time |
| **Example** | "Refer a friend, get 1 month free" (Notion) or "Get 500MB extra storage" (Dropbox) |

### Feature-Unlock

Referrals unlock premium features.

| Aspect | Detail |
|--------|--------|
| **How it works** | Referring friends unlocks features normally behind the paywall |
| **Best for** | Freemium products with clear free/paid divide |
| **Pros** | Zero cash cost, drives product engagement, introduces users to premium features |
| **Cons** | Only works if locked features are desirable, may cannibalize upgrades |
| **Example** | "Invite 3 friends, unlock dark mode and custom themes" |

---

## Incentive Design

### Two-Sided: "Give $X, Get $X"

The most proven referral incentive model.

**How to set the dollar amount:**
```
Maximum referral cost = Customer Acquisition Cost (CAC) via paid ads

If your paid ads CPA is $50:
  Referrer reward: $15-25 (30-50% of CAC)
  Friend reward:   $15-25 (30-50% of CAC)
  Total cost:      $30-50 per referred customer

This is still cheaper than your paid CPA of $50, AND referred customers
have higher LTV and retention.
```

**Reward structure options:**

| Reward Type | Referrer Gets | Friend Gets | Best For |
|-------------|--------------|-------------|----------|
| Account credit | $X credit | $X credit | Subscription products |
| Discount | X% off next bill | X% off first bill | E-commerce, SaaS |
| Free time | 1 month free | 1 month free | Subscription products |
| Cash | $X cash/gift card | $X cash/gift card | High-LTV products |
| Feature | Premium feature | Extended trial | Freemium products |

### Credit-Based: "Refer a Friend, Get Free Months"

```
Referral earns: 1 month free on {{PROJECT_NAME}}
Friend gets:    Extended trial ({{TRIAL_LENGTH}} + 14 days)
Max cap:        12 months free per year (prevent abuse)
```

### Feature-Based: "Invite Friends, Unlock Features"

```
1 referral:   Unlock {{PREMIUM_FEATURE_1}}
3 referrals:  Unlock {{PREMIUM_FEATURE_2}}
5 referrals:  Unlock {{PREMIUM_FEATURE_3}}
10 referrals: Full premium access for 1 year
```

### Cash vs Credit vs Feature Comparison

| Factor | Cash | Credit | Feature |
|--------|------|--------|---------|
| Cost to you | Highest | Medium | Lowest |
| Perceived value | High | Medium | Medium |
| Payout complexity | Tax implications, payment processing | Simple (account adjustment) | Simplest |
| Keeps users in product | No | Yes | Yes |
| Risk of gaming | Highest | Medium | Lowest |
| Best for | High-LTV products, marketplaces | Subscription SaaS | Freemium products |

**Recommendation for {{PROJECT_NAME}}:**

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
Use **credit-based** rewards: "Give 1 month free, Get 1 month free." Simple, low cost, keeps users engaged. If your price point is under $20/month, consider $20 credit for both sides instead (the perceived value of cash may be higher).
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "ecommerce" -->
Use **discount-based** two-sided rewards: "Give 15% off, Get 15% off next order." Drives immediate purchase behavior on both sides.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
Use **feature-unlock** rewards: "Invite 3 friends, unlock premium features." Low cost and drives adoption. Combine with in-app rewards (badges, achievements) for gamification.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
Use **credit-based** two-sided rewards: "Give $15 credit, Get $15 credit." Works for both supply side and demand side. Run separate referral programs for each side of the marketplace.
<!-- ENDIF -->

---

## Referral Mechanics

### Unique Referral Links

The simplest and most common mechanism. Each user gets a unique URL they can share.

```
https://{{DOMAIN}}/refer/{{UNIQUE_CODE}}
Example: https://{{DOMAIN}}/refer/john-smith-x7k2
```

**Implementation notes:**
- Generate unique codes at account creation
- Codes should be readable (not random hashes) for trust
- Landing page should acknowledge the referral: "John invited you! You both get..."
- Track: link clicks, signups, conversions, reward fulfillment

### Referral Codes

Manual codes the user can share verbally or via text.

```
Your referral code: {{USERNAME}}-REF
Share with friends at signup for mutual rewards.
```

**Best for:** Products where sharing happens in conversation (word-of-mouth, communities, events).

### Email Invites

Built-in email invite system within your product.

```
Subject: "{{REFERRER_NAME}} invited you to try {{PROJECT_NAME}}"
Body: "[Referrer] thinks you'd love {{PROJECT_NAME}}.
       They're giving you [reward]. Click here to claim it."
```

**Implementation:**
- Pre-fill referrer's contacts (with permission) or provide email input field
- Limit to 10-20 invites per day (anti-spam)
- Track email sends, opens, clicks, and conversions

### Social Sharing

One-click sharing to social platforms.

**Share buttons for:**
- Twitter/X: Pre-written tweet with referral link
- LinkedIn: Share with professional network
- WhatsApp/SMS: Direct message with link
- Facebook: Share to timeline or Messenger
- Copy link: For pasting anywhere

**Pre-written share messages:**

```
Twitter: "I've been using {{PROJECT_NAME}} for {{TASK}} and it's a game-changer.
Try it free (we both get a bonus): [referral link]"

WhatsApp/SMS: "Hey! Check out {{PROJECT_NAME}} -- it's helped me
with {{BENEFIT}}. We both get [reward] if you sign up: [referral link]"

Email: "Subject: You should try {{PROJECT_NAME}}
I've been using {{PROJECT_NAME}} for [task] and thought of you.
If you sign up with my link, we both get [reward]: [referral link]"
```

---

## Program Placement and Visibility

Your referral program is useless if people do not know it exists. Place it everywhere that makes sense.

### In-Product Placements

| Location | Type | Timing |
|----------|------|--------|
| **Dashboard sidebar** | Permanent link: "Refer & Earn" | Always visible |
| **Settings/Account page** | Dedicated referral section | On demand |
| **Post-positive-action modal** | Popup after completing a key task | Triggered by success |
| **Navigation menu** | Menu item with gift icon | Always accessible |
| **Empty states** | "Invite your team" in collaborative features | When feature is empty |

### Outside-Product Placements

| Location | Format | Frequency |
|----------|--------|-----------|
| **Onboarding email sequence** | Dedicated referral email | Day 7-14 of signup |
| **Monthly newsletter** | Referral CTA section | Monthly |
| **Post-purchase email** | "Share with friends" CTA | After conversion |
| **NPS survey follow-up** | Ask promoters (9-10) to refer | After NPS survey |
| **Transactional emails** | Footer referral link | Every email |
| **Help center / FAQ** | Referral program explanation | Permanent |

### Visibility Best Practices

1. **Do not hide it.** The #1 reason referral programs fail is nobody knows they exist.
2. **Use clear language.** "Give $10, Get $10" is better than "Participate in our referral program."
3. **Show the reward prominently.** Lead with what the user gets, not the mechanics.
4. **Make sharing effortless.** One click to copy link. Pre-written messages for social sharing.
5. **Show progress.** "You've referred 3 friends and earned $30" motivates continued sharing.

---

## Timing the Referral Ask

When you ask matters as much as how you ask. Request referrals at moments of peak satisfaction.

### Best Times to Ask

| Trigger | Why It Works | Implementation |
|---------|-------------|----------------|
| **After first success** | User just experienced the product's value | In-app modal: "Love {{PROJECT_NAME}}? Share with a friend!" |
| **After completing a milestone** | Achievement triggers positive emotions | Celebration screen with share option |
| **After NPS 9-10 response** | User literally said they'd recommend you | Follow-up: "You said you'd recommend us -- here's an easy way!" |
| **After customer support resolution** | Gratitude from getting help | Post-ticket email: "Glad we could help! Share {{PROJECT_NAME}} with friends?" |
| **After upgrade to paid** | User just committed financially (high confidence) | Post-purchase page/email with referral CTA |
| **On anniversary** | Nostalgia and loyalty moment | "You've been with us 1 year! Celebrate by sharing with friends" |
| **After sharing content** | User already in sharing mode | After export/share: "Share {{PROJECT_NAME}} too?" |

### When NOT to Ask

- During onboarding (too early -- they have not experienced value yet)
- When they are frustrated (after a bug, during support escalation)
- Too frequently (max once per week in-app, once per month via email)
- Before they have used core features (they cannot honestly recommend you)

---

## Technical Implementation

### System Architecture Overview

```
[User Dashboard] -> [Referral Widget] -> [Unique Link Generator]
                                              |
                                    [Link Click Tracking]
                                              |
                                    [Signup Attribution]
                                              |
                                    [Conversion Tracking]
                                              |
                                    [Reward Fulfillment]
                                              |
                                    [Notification to Both Parties]
```

### Data Model

```
Referral:
  - referrer_id: user ID of the person sharing
  - referral_code: unique code/link slug
  - referred_email: email of the invited person (optional, for email invites)
  - referred_user_id: user ID of the person who signed up (null until signup)
  - status: pending | signed_up | converted | rewarded | expired | fraudulent
  - channel: link | email | social | code
  - created_at: timestamp
  - converted_at: timestamp (when qualifying action completed)
  - rewarded_at: timestamp (when rewards were distributed)
```

### Attribution Logic

```
Priority order for attributing a referral:
1. Referral code in URL parameter (?ref=xxx) at signup
2. Referral code entered manually during signup
3. Cookie from referral link click (7-30 day window)
4. Email invite match (referred email matches signup email)
```

### Fraud Prevention Rules

```
- One reward per referred user (no double-dipping)
- Referred user must be genuinely new (no existing account with same email/device)
- Referred user must complete qualifying action (not just sign up)
- Rate limit: max 50 referral link shares per day
- Max rewards per referrer: {{MAX_MONTHLY_REFERRAL_REWARDS}} per month
- Referrer and referred cannot share same IP/device fingerprint
- Minimum account age before referral program access: 7 days
```

### Implementation Options

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **Build in-house** | Full control, no ongoing fees | Development time, maintenance | Teams with engineering bandwidth |
| **Referral SaaS (ReferralCandy, Friendbuy)** | Quick setup, managed infrastructure | Monthly fees, less customization | Teams wanting fast launch |
| **Viral Loops** | Simple setup, multiple campaign types | Limited customization | Early-stage startups |
| **GrowSurf** | Good for SaaS, widget-based | Features may not fit all models | SaaS products |
| **Rewardful** | Built for SaaS + Stripe integration | SaaS-only focus | Stripe-based SaaS products |

---

## Launching Your Referral Program

### Pre-Launch Checklist

- [ ] Referral incentive decided and documented
- [ ] Unique link generation working
- [ ] Attribution and tracking tested end-to-end
- [ ] Reward fulfillment automated
- [ ] Fraud prevention rules implemented
- [ ] Referral landing page created (where referred friends arrive)
- [ ] In-app referral widget/page built
- [ ] Share messages written for all channels
- [ ] Notification emails created (reward earned, friend signed up)
- [ ] Terms and conditions written
- [ ] Internal team briefed

### Launch Sequence

**Week 1: Soft Launch to Power Users**
- Email your top 50 most active users
- Subject: "You're invited to our new referral program"
- Personalize: mention their specific usage/achievements
- Ask for feedback on the experience

**Week 2: Broader Email Announcement**
- Email entire user base
- Subject: "Give {{REWARD}}, Get {{REWARD}} -- Introducing referrals"
- Clear explanation of how it works
- CTA: "Get your referral link"

**Week 3: In-Product Launch**
- Enable referral widget/banner for all users
- One-time modal announcing the program
- Add permanent referral link to settings/dashboard

**Week 4: Social Announcement**
- Post on social media channels
- Consider a launch promotion (2x rewards for first 30 days)
- Encourage early referrers to share their success

### Launch Email Template

```
Subject: Give {{REFERRAL_FRIEND_REWARD}}, Get {{REFERRAL_REFERRER_REWARD}} -- New Referral Program

Hi {{USER_NAME}},

Great news! You can now earn rewards for sharing {{PROJECT_NAME}}
with people you know.

Here's how it works:

1. Share your unique referral link
2. When a friend signs up, they get {{REFERRAL_FRIEND_REWARD}}
3. You get {{REFERRAL_REFERRER_REWARD}} when they {{QUALIFYING_ACTION}}

Your unique referral link:
{{REFERRAL_LINK}}

Share it on: [Twitter] [LinkedIn] [Email] [Copy Link]

Thank you for being part of the {{PROJECT_NAME}} community!

-- The {{PROJECT_NAME}} Team
```

---

## Measuring Referral Success

### Key Metrics

| Metric | Formula | Good Benchmark | Target for {{PROJECT_NAME}} |
|--------|---------|---------------|---------------------------|
| **Referral rate** | Users who refer / Total users | 2-5% | ___% |
| **Share rate** | Referral links shared / Users who see referral CTA | 10-20% | ___% |
| **Click-through rate** | Link clicks / Links shared | 20-40% | ___% |
| **Conversion rate** | Signups / Link clicks | 5-15% | ___% |
| **K-factor** | Invites per user x Conversion rate per invite | 0.1-0.5 for referral program | ___ |
| **Viral coefficient** | New users from referrals / Total new users | 10-30% | ___% |
| **Referral revenue** | Revenue from referred customers | Track monthly | $____ |
| **Referral CAC** | Total referral rewards paid / Referred customers acquired | < Paid ads CAC | $____ |
| **Referred user LTV** | Lifetime value of referred customers | 15-25% higher than average | $____ |

### Referral Funnel

```
Users who see referral program:   {{TOTAL_USERS}}
Users who share referral link:    ____ (___% share rate)
Total link clicks:                ____ (___% CTR)
Signups from referrals:           ____ (___% conversion)
Converted to paid:                ____ (___% qualification)
Rewards distributed:              ____ ($____ total cost)
```

### Monthly Referral Report

| Metric | This Month | Last Month | Change |
|--------|-----------|------------|--------|
| Active referrers | ____ | ____ | ___% |
| Referral links shared | ____ | ____ | ___% |
| Referred signups | ____ | ____ | ___% |
| Referred conversions | ____ | ____ | ___% |
| Rewards paid out | $____ | $____ | ___% |
| Referral revenue | $____ | $____ | ___% |
| Referral CAC | $____ | $____ | ___% |
| % of new users from referrals | ___% | ___% | |

---

## Optimization and A/B Testing

### What to Test

| Element | Variant A | Variant B | Expected Impact |
|---------|-----------|-----------|----------------|
| **Incentive amount** | Give $10, Get $10 | Give $20, Get $20 | Higher reward may not proportionally increase referrals |
| **Incentive type** | Credit | Cash | Cash may attract more referrals but lower quality |
| **Reward timing** | Instant reward | Reward after friend upgrades | Delayed reward = higher quality referrals |
| **Placement** | Dashboard sidebar | Post-action modal | Modal may drive more shares but annoy some users |
| **Share message** | Feature-focused | Benefit-focused | Test which messaging resonates |
| **Referral page design** | Minimal | Detailed with social proof | More info may build trust |
| **Email subject line** | "Give $10, Get $10" | "Your friends will thank you" | Test emotional vs transactional |

### Optimization Priorities

1. **Increase share rate** - Make the referral program more visible and the reward more compelling
2. **Increase click-through** - Improve share messages so recipients want to click
3. **Increase conversion** - Optimize the referral landing page for signup
4. **Increase qualification** - Ensure referred users actually become active/paying

---

## Example Referral Programs

### Dropbox (The Gold Standard)
- **Incentive:** 500MB free storage for both parties (later increased to 1GB)
- **Why it worked:** Storage was the product's core constraint. Referrals directly improved the user experience. Cost to Dropbox was nearly zero (marginal storage cost).
- **Result:** 3900% user growth over 15 months. 35% of daily signups came from referrals.

### Notion
- **Incentive:** $5 credit for both parties
- **Why it worked:** Credit applied to Notion's subscription, keeping users in the ecosystem. Low enough to scale, high enough to motivate.

### Superhuman
- **Incentive:** Invite-only access (no monetary reward)
- **Why it worked:** Exclusivity created demand. Getting an invite was the reward. Users felt special sharing invites.

### Robinhood
- **Incentive:** Free stock for both parties (random value $3-200)
- **Why it worked:** Gamification element (what stock will I get?). Aligned with the product (you're investing). The randomness made it fun and shareable.

### Uber
- **Incentive:** $20 ride credit for both parties
- **Why it worked:** Direct, immediate value. Credit applied to first ride, reducing friction for new users. High enough to matter for a single ride.

### PayPal (Early Days)
- **Incentive:** $10 cash for both parties
- **Why it worked:** Direct cash incentive at a time when PayPal needed rapid user growth. Cost $60M+ but built a massive user base. Not sustainable at scale but achieved the growth goal.

---

## Template for {{PROJECT_NAME}}

### Incentive Structure

```
Referral Model:      [one-sided / two-sided / credit / feature]
Referrer Reward:     {{REFERRER_REWARD}}
Friend Reward:       {{FRIEND_REWARD}}
Qualifying Action:   [signup / trial start / first purchase / paid upgrade]
Reward Timing:       [instant / after qualifying action / after 30 days]
Max Rewards/Month:   {{MAX_MONTHLY_REFERRAL_REWARDS}}
```

### Messaging

**Tagline:** "Give {{FRIEND_REWARD}}, Get {{REFERRER_REWARD}}"

**One-liner:** "Love {{PROJECT_NAME}}? Share it with friends and you both get rewarded."

**Referral page headline:** "Spread the love. Get rewarded."

**Referral page subheadline:** "For every friend who joins {{PROJECT_NAME}}, you both get {{REWARD_DESCRIPTION}}."

**Share message (pre-written):**
"I've been using {{PROJECT_NAME}} for {{USE_CASE}} and it's been great. If you sign up with my link, we both get {{REWARD_DESCRIPTION}}: [referral link]"

### Tracking Plan

| Event | When | Data Captured |
|-------|------|---------------|
| Referral link generated | User clicks "Get referral link" | referrer_id, code, timestamp |
| Referral link shared | User shares via any channel | referrer_id, channel, timestamp |
| Referral link clicked | Friend clicks link | referrer_id, friend_ip, timestamp |
| Referred signup | Friend creates account | referrer_id, friend_id, timestamp |
| Referred qualification | Friend completes qualifying action | referrer_id, friend_id, action, timestamp |
| Reward distributed | Rewards sent to both parties | referrer_id, friend_id, reward_type, reward_value |

---

## Anti-Fraud Measures

Referral programs attract abuse. Implement these safeguards from day one.

### Common Fraud Patterns

| Fraud Type | Description | Prevention |
|------------|-------------|------------|
| **Self-referral** | User refers themselves with a second account | Same IP/device check, email domain matching |
| **Fake accounts** | Creating fake accounts to farm rewards | Email verification, phone verification, activity requirement |
| **Referral rings** | Groups of people referring each other in circles | Graph analysis, reward caps, qualifying actions |
| **Bot signups** | Automated account creation via referral links | CAPTCHA, rate limiting, device fingerprinting |
| **Reward abuse** | Signing up, claiming reward, immediately canceling | Minimum usage period before reward, clawback policy |

### Prevention Measures

1. **Rate limiting:** Max 50 referral shares per day, max {{MAX_MONTHLY_REFERRAL_REWARDS}} rewards per month
2. **Email verification:** Referred users must verify email before rewards distribute
3. **Qualifying action required:** Reward only triggers after meaningful action (not just signup)
4. **Device fingerprinting:** Flag referrals from same device
5. **IP monitoring:** Flag multiple signups from same IP
6. **Minimum account age:** Referrer must have account for 7+ days before referring
7. **Clawback policy:** If referred user cancels within 30 days, reward is reversed
8. **Manual review threshold:** Flag accounts with 10+ referrals per week for manual review
9. **Reward caps:** Maximum annual reward limit per user

### Terms and Conditions (Key Points to Include)

- Rewards are non-transferable and have no cash value (for credit/feature rewards)
- {{PROJECT_NAME}} reserves the right to modify or terminate the program
- Fraudulent activity results in account suspension and reward forfeiture
- Referrer and referred must be different individuals
- Maximum {{MAX_MONTHLY_REFERRAL_REWARDS}} rewards per calendar month
- Rewards distributed within [X] business days of qualification
- {{PROJECT_NAME}} reserves the right to review and approve referrals before distributing rewards

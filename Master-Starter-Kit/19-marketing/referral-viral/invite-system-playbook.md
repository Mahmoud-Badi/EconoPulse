# Invite System Playbook for {{PROJECT_NAME}}

> A complete guide to building invite flows, waitlists, and exclusivity-driven growth.
> Product Type: {{PRODUCT_TYPE}} | Target Audience: {{TARGET_AUDIENCE}}
> Launch Stage: {{LAUNCH_STAGE}}

---

## Table of Contents

1. [Invite-Only Strategy: When and Why](#invite-only-strategy-when-and-why)
2. [Waitlist Design](#waitlist-design)
3. [Invite Code System](#invite-code-system)
4. [Exclusivity Psychology](#exclusivity-psychology)
5. [Invite-Only Phases](#invite-only-phases)
6. [The Clubhouse/Gmail/Notion Effect](#the-clubhousegmailnotion-effect)
7. [Invite UX Patterns](#invite-ux-patterns)
8. [When Exclusivity Backfires](#when-exclusivity-backfires)
9. [Transitioning to Public Access](#transitioning-to-public-access)
10. [Templates for {{PROJECT_NAME}}](#templates-for-project_name)

---

## Invite-Only Strategy: When and Why

### When to Use an Invite-Only Launch

An invite-only or waitlist launch is not always the right choice. Use it when:

| Reason | Explanation |
|--------|-------------|
| **Demand generation** | You want to create buzz and anticipation before launch |
| **Quality control** | You need to curate early users to get the right feedback |
| **Infrastructure limits** | Your systems cannot handle unlimited users yet |
| **Community building** | You want to build a tight-knit early community |
| **Network effects** | Your product needs a critical mass of users in clusters (teams, regions) |
| **Premium positioning** | You want to signal that your product is special and worth waiting for |

### When NOT to Use Invite-Only

| Situation | Why Open Access is Better |
|-----------|--------------------------|
| You need volume fast | Invite-only slows growth by definition |
| Your product is commodity | Exclusivity only works if the product is perceived as differentiated |
| No demand signal exists | If no one knows or cares about your product, a waitlist will sit empty |
| Self-serve product | If your product does not require onboarding or curation, gating serves no purpose |
| B2B with sales team | Enterprise deals need direct access, not waitlists |

### Decision Framework

```
Should {{PROJECT_NAME}} launch invite-only?

  Is there existing demand or buzz?
    YES → Invite-only can capitalize on it
    NO  → Build demand first, then consider gating

  Do you need feedback from specific user types?
    YES → Invite-only lets you curate early users
    NO  → Open access with feedback mechanisms works fine

  Can your infrastructure handle open access?
    YES → Open access unless other reasons apply
    NO  → Invite-only or phased rollout is necessary

  Is exclusivity consistent with your brand?
    YES → Invite-only reinforces premium positioning
    NO  → Forced exclusivity will feel inauthentic
```

---

## Waitlist Design

### Waitlist Landing Page Elements

A great waitlist page creates excitement while collecting valuable information.

**Essential Elements:**

1. **Headline:** What the product does and why it matters
   ```
   "{{PROJECT_NAME}}: {{ONE_LINE_DESCRIPTION}}"
   ```

2. **Subheadline:** Why they should join the waitlist
   ```
   "Join {{WAITLIST_COUNT}}+ {{TARGET_AUDIENCE}} getting early access."
   ```

3. **Email capture:** Single-field signup (email only)
   ```
   [Email input] [Join the Waitlist]
   ```

4. **Social proof:** Number of people on the waitlist, notable early users, logos
   ```
   "{{WAITLIST_COUNT}} people ahead of you | Teams from [Company A], [Company B], [Company C]"
   ```

5. **What to expect:** Brief explanation of what happens next
   ```
   "We're letting in small groups every week. You'll get an email when it's your turn."
   ```

6. **Referral mechanic:** How they can move up the waitlist
   ```
   "Want to skip the line? Share your unique link and move up for every friend who joins."
   ```

### Waitlist with Referral Mechanics

The most powerful waitlist design combines exclusivity with virality. When people can move up the waitlist by referring friends, your waitlist becomes a growth engine.

**How it works:**
```
1. User joins waitlist → Gets position #{{POSITION}}
2. User gets unique referral link
3. For each friend who joins via their link, user moves up X positions
4. User sees their position update in real-time
5. Top-of-list users get access first
```

**Position mechanics:**
```
Base position:          Based on signup order
Per referral boost:     Move up {{REFERRAL_BOOST}} positions per referral
Display:                "You're #{{POSITION}} on the waitlist.
                         Refer friends to move up! You've referred {{REFERRAL_COUNT}} people."
```

### Waitlist Tools

| Tool | Features | Pricing | Best For |
|------|----------|---------|----------|
| **Waitlist API** | API-first, embeddable widget, referral mechanics | Free tier + paid | Developers who want full control |
| **Viral Loops** | Pre-built templates, referral campaigns, analytics | $35-208/month | Quick launch with referral virality |
| **LaunchList** | Simple waitlist + referral, analytics | Free tier + paid | Simple waitlists |
| **GetWaitlist** | No-code widget, referral tracking, analytics | Free tier + paid | Non-technical teams |
| **Custom build** | Complete control, integrated with your stack | Development time | Teams with engineering resources |

### Waitlist Email Sequence

**Email 1: Confirmation (Immediate)**
```
Subject: You're on the list! Here's your spot.

Hi {{USER_NAME}},

You're #{{POSITION}} on the {{PROJECT_NAME}} waitlist.

We're letting in small groups every week based on waitlist position.

Want to get in sooner? Share your unique link and move up
for every friend who joins:

Your link: {{REFERRAL_LINK}}

You've referred: {{REFERRAL_COUNT}} people
Your position: #{{POSITION}}

See you soon,
The {{PROJECT_NAME}} Team
```

**Email 2: Update (Weekly)**
```
Subject: Your {{PROJECT_NAME}} waitlist update

Hi {{USER_NAME}},

Quick update on your waitlist status:

Your position: #{{POSITION}} (moved up {{POSITIONS_GAINED}} spots this week!)
People who joined after you: {{NEW_SIGNUPS}}

Reminder: Share your link to move up faster: {{REFERRAL_LINK}}

Here's what we've been building this week: [brief product update]

Hang tight -- you're getting closer!
```

**Email 3: Access Granted**
```
Subject: You're in! Welcome to {{PROJECT_NAME}}

Hi {{USER_NAME}},

The wait is over. Your {{PROJECT_NAME}} account is ready.

Click here to get started: {{SIGNUP_LINK}}

A few things to know:
- {{QUICK_START_TIP_1}}
- {{QUICK_START_TIP_2}}
- {{QUICK_START_TIP_3}}

You waited. We built. Let's go.

The {{PROJECT_NAME}} Team

P.S. You still have {{REMAINING_INVITES}} invites to share with friends: {{REFERRAL_LINK}}
```

---

## Invite Code System

### Code Generation

**Human-readable codes:**
```
Format: [WORD]-[WORD]-[NUMBER]
Examples:
  ROCKET-LAUNCH-2024
  BUILD-FAST-7742
  {{PROJECT_NAME_SHORT}}-BETA-001
```

**Personalized codes:**
```
Format: [USERNAME]-INVITE
Examples:
  JOHN-INVITE
  SARAH-VIP
  [REFERRER]-{{PROJECT_NAME_SHORT}}
```

**Alphanumeric codes:**
```
Format: [6-8 character alphanumeric]
Examples:
  XK7N2P
  BETA-4R9M
  INV-2024-Q3F8
```

### Code Distribution Rules

```
Codes per user:          {{INVITE_CODES_PER_USER}} (start small: 3-5)
Replenishment:           New codes every {{CODE_REPLENISH_INTERVAL}} days
                         OR after milestones (e.g., refer 3, get 3 more)
Expiration:              Codes expire after {{CODE_EXPIRY_DAYS}} days if unused
Tracking:                Every code maps to a referrer for attribution
Single-use:              Each code can only be redeemed once
```

### Code Sharing UX

**In-app code display:**
```
+------------------------------------------+
|  YOUR INVITE CODES                        |
|                                           |
|  [ROCKET-LAUNCH-2024]  [Copy] [Share]     |  Available
|  [BUILD-FAST-7742]     [Copy] [Share]     |  Available
|  [START-HERE-1199]     Used by Sarah K.   |  Redeemed
|                                           |
|  3 of 5 codes available                   |
|  Share all 5 to unlock more invites       |
+------------------------------------------+
```

---

## Exclusivity Psychology

Understanding why exclusivity drives demand helps you wield it effectively.

### Psychological Principles at Work

**1. Scarcity**
When something is limited, people perceive it as more valuable.
- "Only 100 spots available this week"
- "Invite-only access -- limited codes"
- People want what they cannot easily have

**2. Social Proof**
Seeing others want something makes you want it too.
- "12,847 people on the waitlist"
- "Teams from Google, Stripe, and Shopify already inside"
- High demand signals high value

**3. FOMO (Fear of Missing Out)**
People are motivated by the fear of being left behind.
- "Your competitors are already using {{PROJECT_NAME}}"
- "Don't miss the early access window"
- Urgency combined with exclusivity is powerful

**4. Belonging**
Being part of an exclusive group satisfies a deep human need.
- "Welcome to the {{PROJECT_NAME}} founding members"
- "You're one of the first 500 users"
- Early adopters feel ownership and pride

**5. Reciprocity**
When someone gives you access (an invite), you feel obligated to engage.
- The inviter recommends the product
- The invitee feels social obligation to try it
- Personal recommendations carry implicit endorsement

### How to Trigger Each Principle

| Principle | Trigger | Example for {{PROJECT_NAME}} |
|-----------|---------|------------------------------|
| Scarcity | Limit supply | "Only accepting 50 new users this week" |
| Social proof | Show demand | "Join {{WAITLIST_COUNT}} people waiting" |
| FOMO | Create urgency | "Early access pricing ends when we open to public" |
| Belonging | Create identity | "You're a Founding Member of {{PROJECT_NAME}}" |
| Reciprocity | Gift access | "{{REFERRER}} thought you'd love this" |

---

## Invite-Only Phases

### Phase 1: Founder's Circle (10-50 Users)

**Who:** Hand-picked users you personally know or have identified as ideal early adopters.

**Goal:** Validate core value proposition and get brutally honest feedback.

**How to recruit:**
- Personal email outreach
- DMs on Twitter/LinkedIn to people who fit your ideal user profile
- Existing contacts from your network
- Online community members who expressed the problem you solve

**What to give them:**
- Direct access to founders (Slack channel, email, weekly calls)
- Influence on product roadmap
- Permanent "Founding Member" status
- Early access pricing locked in forever

**Success criteria before moving to Phase 2:**
- [ ] At least 40% weekly active rate
- [ ] Net Promoter Score of 8+ from at least 10 users
- [ ] Users can articulate the product's value in their own words
- [ ] Critical bugs are resolved
- [ ] Core workflow functions reliably

### Phase 2: Invite-Only with Referrals (100-500 Users)

**Who:** Phase 1 users invite their contacts. Each user gets 3-5 invite codes.

**Goal:** Test product-market fit with a broader but still curated audience.

**How to grow:**
- Invite codes distributed to Phase 1 users
- Additional codes earned by completing onboarding or providing feedback
- Targeted outreach to community leaders and micro-influencers

**What to give them:**
- 3-5 invite codes to share
- Early adopter pricing or extended trial
- Access to founder AMAs or community calls
- Input on upcoming features

**Success criteria before moving to Phase 3:**
- [ ] Organic referral rate above 20% (1 in 5 users refers someone)
- [ ] Retention rate above 30% at 30 days
- [ ] Support infrastructure can handle volume
- [ ] Onboarding flow works without manual intervention
- [ ] Revenue or engagement metrics trending positively

### Phase 3: Open Waitlist with Priority Access (500-5000 Users)

**Who:** Anyone can join the waitlist. Priority access for referrers and targeted segments.

**Goal:** Scale growth while maintaining quality and managing infrastructure.

**How to grow:**
- Public waitlist on landing page
- Referral mechanics (refer friends to move up)
- PR and content marketing drive waitlist signups
- Social media buzz from existing users

**What to give them:**
- Waitlist position with referral acceleration
- Weekly updates with product progress
- Priority access based on referral count and user profile fit
- Launch day pricing guarantee

**Success criteria before moving to Phase 4:**
- [ ] Waitlist has strong demand signal (1000+ signups)
- [ ] Infrastructure tested at 5-10x current load
- [ ] Onboarding is fully self-serve
- [ ] Customer support is scalable (docs, FAQ, chatbot)
- [ ] Business model is validated (paying users with acceptable churn)

### Phase 4: Open Access -- General Availability

**Who:** Anyone can sign up immediately.

**Goal:** Maximize growth and capture the market you have validated.

**How to launch:**
- Email entire waitlist with access
- Public launch announcement (Product Hunt, Hacker News, social media)
- Remove all access gates
- Full marketing channels active (paid ads, content, partnerships)

**What to give waitlisters:**
- Thank them for patience
- Honor any early-access pricing promises
- Founding member badges or recognition
- Priority feature requests

---

## The Clubhouse/Gmail/Notion Effect

### How Exclusivity Drove Massive Demand

**Gmail (2004):**
- Launched invite-only when email was a commodity
- Each user got 2-3 invites
- People sold Gmail invites on eBay for $50-150
- Invite-only lasted over 5 years (2004-2009!)
- Created perception of premium email before Gmail was even differentiated

**Clubhouse (2020-2021):**
- Audio social network launched invite-only
- Celebrity adoption (Elon Musk, Oprah) created massive buzz
- Invites traded on secondary markets
- Peaked at 10M+ downloads during invite-only phase
- Cautionary tale: lost momentum when opened to public (exclusivity WAS the product for many users)

**Notion (2018-2020):**
- Free plan with limited blocks drove waitlist for additional features
- Ambassador program created inner circle of power users
- Template gallery spread Notion without direct marketing
- Community-driven growth felt organic, not forced

**Superhuman (2014-present):**
- Invite-only for years with personal onboarding for every user
- $30/month email client (premium positioning matched by exclusivity)
- Every user was personally onboarded by the team
- Exclusivity maintained as genuine quality control (they only onboard users who will succeed with the product)

### Lessons for {{PROJECT_NAME}}

1. **Exclusivity must match product quality.** If the product does not live up to the hype, exclusivity backfires.
2. **Give insiders a reason to talk.** Invites only spread if users are genuinely excited.
3. **Have a plan for post-exclusivity.** Clubhouse's decline shows that exclusivity cannot be the only value.
4. **Use the exclusive period productively.** Improve the product, build community, learn from users.

---

## Invite UX Patterns

### Invite Modal Design

```
+--------------------------------------------------+
|                                                    |
|   Invite your friends to {{PROJECT_NAME}}          |
|                                                    |
|   You have {{REMAINING_INVITES}} invites left      |
|                                                    |
|   [Email address                    ] [Send]       |
|   [Email address                    ] [Send]       |
|   [Email address                    ] [Send]       |
|                                                    |
|   -- or share your invite link --                  |
|                                                    |
|   [https://{{DOMAIN}}/invite/xxx    ] [Copy]       |
|                                                    |
|   [Twitter] [LinkedIn] [WhatsApp] [Email]          |
|                                                    |
|   Invite status:                                   |
|   - john@email.com    Joined!  ✓                   |
|   - sarah@email.com   Pending  ⏳                   |
|   - mike@email.com    Opened   📨                   |
|                                                    |
+--------------------------------------------------+
```

### Invite Email Template

```
Subject: {{REFERRER_NAME}} invited you to {{PROJECT_NAME}}

Hi there,

{{REFERRER_NAME}} thinks you'd love {{PROJECT_NAME}} -- {{ONE_LINE_DESCRIPTION}}.

{{PROJECT_NAME}} is currently invite-only, and {{REFERRER_NAME}}
reserved a spot just for you.

[Accept Invitation]

What you'll get:
- {{BENEFIT_1}}
- {{BENEFIT_2}}
- {{BENEFIT_3}}

This invitation expires in {{INVITE_EXPIRY_DAYS}} days.

-- The {{PROJECT_NAME}} Team
```

### Invite Status Tracking

Show users the status of their invitations to encourage follow-up:

| Status | Icon | Meaning |
|--------|------|---------|
| Sent | Envelope | Invitation email delivered |
| Opened | Eye | Recipient opened the email |
| Clicked | Cursor | Recipient clicked the invitation link |
| Joined | Checkmark | Recipient created an account |
| Active | Star | Recipient is actively using the product |

---

## When Exclusivity Backfires

### Warning Signs

1. **Too long:** Waitlist has been open for 6+ months with no access granted. People forget and lose interest.
2. **Too restrictive:** Users who want to bring their team cannot because invites are too limited. They leave for an accessible alternative.
3. **No communication:** Waitlisted users hear nothing for weeks/months. They assume the product is dead.
4. **Perceived arrogance:** The exclusivity feels more about ego than product quality. "Who do they think they are?"
5. **Forgotten users:** Early waitlisters are passed over in favor of later signups who referred more people. Creates resentment.
6. **No product improvement:** The exclusive period is used for gatekeeping, not for improving the product. Users granted access are disappointed.
7. **Competitor swoops in:** While you are slowly letting people in, a competitor launches openly and captures the market.

### Mitigation Strategies

| Risk | Mitigation |
|------|-----------|
| Too long | Set a maximum waitlist duration (3-6 months). Communicate timeline publicly. |
| Too restrictive | Increase invite codes regularly. Offer team plans that bypass individual limits. |
| No communication | Send weekly waitlist updates. Share what you're building. |
| Perceived arrogance | Be humble in messaging. Frame exclusivity as "we want to serve you well" not "we're too cool for you." |
| Forgotten users | First-in, first-out as the base. Referral boost as a bonus, not a replacement. |
| No improvement | Use the exclusive period to ship fast. Share progress publicly. |
| Competitor risk | Monitor competitors. Be ready to open access if market dynamics change. |

---

## Transitioning to Public Access

### Announcement Strategy

**Two weeks before open access:**
- Email waitlist: "We're opening to everyone on [date]. You get in first."
- Social media teaser: "Something big coming [date]"
- Prepare launch assets: blog post, social graphics, email templates

**Launch day:**
- Email #1 (waitlist): "We're open! Here's your access"
- Email #2 (all subscribers): "{{PROJECT_NAME}} is now available to everyone"
- Social media: Launch announcement across all channels
- Product Hunt launch (if applicable)
- Press/blog outreach with the story of your invite-only journey

**Post-launch week:**
- Share metrics from the invite-only period: "X users, Y results"
- Highlight founding member stories
- Run a launch promotion (limited time pricing, bonus features)

### Pricing Transition

If you offered early access pricing, honor it:

```
Founding Members (Phase 1):   Locked at $X/month forever
Early Adopters (Phase 2-3):   Locked at $Y/month for 12 months
Waitlist Users:                $Z/month (introductory pricing for 3 months)
General Public:                $W/month (standard pricing)
```

---

## Templates for {{PROJECT_NAME}}

### Waitlist Page Copy

**Headline:**
```
"{{PROJECT_NAME}}: {{ONE_LINE_DESCRIPTION}}"
```

**Subheadline:**
```
"We're building the {{PRODUCT_CATEGORY}} that {{TARGET_AUDIENCE}} deserve.
Join {{WAITLIST_COUNT}}+ people who want in early."
```

**CTA:**
```
[Enter your email] [Join the Waitlist]
```

**Below-fold content:**
```
What is {{PROJECT_NAME}}?
[2-3 sentences describing the product]

Why a waitlist?
"We're perfecting the experience before opening to everyone.
Waitlist members get early access, founding member pricing,
and direct input on what we build."

Move up the list:
"Share your unique link. For every friend who joins,
you move up {{REFERRAL_BOOST}} spots."
```

### Invite Email Template (Personalized)

```
Subject: {{REFERRER_NAME}} saved you a spot on {{PROJECT_NAME}}

{{REFERRER_NAME}} has been using {{PROJECT_NAME}} and thought
you'd find it useful for {{USE_CASE}}.

{{PROJECT_NAME}} is currently invite-only --
{{REFERRER_NAME}} used one of their limited invites for you.

Here's what {{PROJECT_NAME}} does:
- {{BENEFIT_1}}
- {{BENEFIT_2}}
- {{BENEFIT_3}}

[Claim Your Spot]

This invitation expires in {{INVITE_EXPIRY_DAYS}} days
and cannot be transferred.

-- The {{PROJECT_NAME}} Team
```

### Access Granted Email

```
Subject: Welcome to {{PROJECT_NAME}} -- you're in!

Hi {{USER_NAME}},

Your wait is over. Your {{PROJECT_NAME}} account is ready.

[Get Started Now]

Here's how to make the most of your first 10 minutes:
1. {{ONBOARDING_STEP_1}}
2. {{ONBOARDING_STEP_2}}
3. {{ONBOARDING_STEP_3}}

As a thank-you for your patience, you've been granted
Founding Member status:
- {{FOUNDING_MEMBER_PERK_1}}
- {{FOUNDING_MEMBER_PERK_2}}
- {{FOUNDING_MEMBER_PERK_3}}

You also have {{INVITE_CODES_PER_USER}} invites to share
with friends: {{INVITE_PAGE_URL}}

Welcome aboard.
The {{PROJECT_NAME}} Team
```

---

## Implementation Checklist

- [ ] Decide launch strategy: invite-only vs open waitlist vs open access
- [ ] Build waitlist landing page with email capture
- [ ] Implement referral mechanics for waitlist (move up by referring)
- [ ] Create invite code generation and redemption system
- [ ] Write and automate waitlist email sequence (confirmation, updates, access granted)
- [ ] Design invite UX (modal, status tracking, sharing options)
- [ ] Write invite email templates
- [ ] Set up analytics: signups, referrals, conversions, position changes
- [ ] Define phase transition criteria
- [ ] Plan the transition from invite-only to public access
- [ ] Prepare launch day assets and communications

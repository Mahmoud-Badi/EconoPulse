# Email Automation Workflows

> **Project:** {{PROJECT_NAME}}
> **Email Platform:** {{EMAIL_PLATFORM}}
> **Product Type:** {{PRODUCT_TYPE}}
> **Key User Actions Tracked:** {{TRACKED_EVENTS}}
> **Current Automation Status:** {{AUTOMATION_STATUS}}

---

## Why Email Automation

Manual email marketing does not scale. When you have 100 subscribers, you can send each person the right email at the right time manually. When you have 1,000 or 10,000, you cannot.

Email automation solves this by triggering emails based on user behavior, timing, and segmentation -- so every subscriber receives personalized, relevant content without you touching a button.

**What automation gives you:**
- Right message at the right time (behavior-triggered, not calendar-triggered)
- Consistent experience for every user regardless of when they join
- Scalable personalization without additional human effort
- Higher engagement rates (automated emails have 70-80% higher open rates than batch emails)
- Revenue generation while you sleep

---

## Workflow Types

| Type | Trigger | Purpose | Priority |
|------|---------|---------|----------|
| **Welcome** | New subscriber | Introduce, deliver value, build trust | Must-have |
| **Onboarding** | New user signup / trial start | Activate user, guide to first value | Must-have |
| **Nurture** | Subscriber but not user | Move subscribers toward product trial | High |
| **Re-Engagement** | No activity for 30-90 days | Win back inactive subscribers/users | High |
| **Cart Abandonment** | Started checkout but didn't complete | Recover lost revenue | High (if applicable) |
| **Event-Triggered** | Specific user action in product | Deepen engagement, upsell, support | Medium |
| **Trial-to-Paid** | Trial started | Convert trial users to paying customers | Must-have |
| **Churn Prevention** | Declining usage signals | Intervene before customer cancels | High |
| **Feature Adoption** | User hasn't tried key feature | Increase product stickiness | Medium |
| **Milestone/Anniversary** | Time-based (30 days, 1 year) | Celebrate, reinforce value, request review | Low |

---

## Behavioral Trigger Definitions

Automations are only as good as the triggers that start them. Here are the key behavioral events to track and act on.

### Signup/Subscription Events
| Event | Description | Automation |
|-------|-------------|------------|
| `subscriber.created` | Someone joins your email list | Welcome sequence |
| `user.signed_up` | Someone creates a product account | Onboarding sequence |
| `user.trial_started` | Trial period begins | Trial-to-paid sequence |
| `user.upgraded` | Converted from free to paid | Post-purchase onboarding |
| `user.downgraded` | Moved to a lower tier | Churn prevention / feedback request |
| `user.cancelled` | Cancelled subscription | Win-back sequence |

### Product Usage Events
| Event | Description | Automation |
|-------|-------------|------------|
| `feature.first_use` | User tries a feature for the first time | Feature adoption encouragement |
| `feature.not_used` | User has NOT tried key feature after X days | Feature discovery email |
| `project.created` | User creates their first project/item | Congratulations + next steps |
| `milestone.reached` | User hits a usage milestone | Celebration + upgrade prompt |
| `usage.declining` | Usage dropped significantly (30%+ drop week-over-week) | Churn prevention |
| `usage.inactive` | No login for 7/14/30 days | Re-engagement sequence |

### Engagement Events
| Event | Description | Automation |
|-------|-------------|------------|
| `email.not_opened` | Hasn't opened last 5 emails | Re-engagement or cleanup |
| `email.link_clicked` | Clicked a specific link | Send related follow-up content |
| `page.visited` | Visited pricing page or specific feature page | Send targeted information |
| `form.submitted` | Submitted a form (demo request, contact) | Sales follow-up sequence |
| `nps.submitted` | Submitted NPS score | Route based on score (promoter/detractor) |

### Transaction Events
| Event | Description | Automation |
|-------|-------------|------------|
| `payment.failed` | Payment didn't process | Dunning sequence (update card) |
| `trial.expiring` | Trial ends in 3/7 days | Urgency emails |
| `subscription.renewing` | Annual renewal approaching (30 days) | Renewal reminder / upsell |
| `invoice.paid` | Successful payment | Thank you + receipt |

---

## Workflow Diagrams

### Workflow 1: Welcome Sequence

```
[New Subscriber]
       |
       v
  Tag: source={{SIGNUP_SOURCE}}
  Tag: interest={{LEAD_MAGNET_TOPIC}}
       |
       v
  [Email 1: Welcome + Deliver Lead Magnet] -- Day 0
       |
       v
  Wait 1 day
       |
       v
  [Email 2: Quick Win / Value] -- Day 1
       |
       v
  Wait 2 days
       |
       v
  [Email 3: Origin Story] -- Day 3
       |
       v
  Wait 2 days
       |
       v
  ----[Did they sign up for product?]----
  |                                      |
  YES                                    NO
  |                                      |
  v                                      v
  Move to                          [Email 4: Feature + Social Proof] -- Day 5
  Onboarding                             |
  Workflow                               v
                                   Wait 2 days
                                         |
                                         v
                                   [Email 5: Objection Handling] -- Day 7
                                         |
                                         v
                                   Wait 3 days
                                         |
                                         v
                                   [Email 6: Case Study] -- Day 10
                                         |
                                         v
                                   Wait 4 days
                                         |
                                         v
                                   [Email 7: CTA / Offer] -- Day 14
                                         |
                                         v
                                   ----[Did they convert?]----
                                   |                          |
                                   YES                        NO
                                   |                          |
                                   v                          v
                                   Move to                Move to
                                   Onboarding             Newsletter
                                   Workflow               Segment
```

### Workflow 2: Trial-to-Conversion

```
[User Starts Trial]
       |
       v
  Tag: stage=trial
  Tag: plan={{TRIAL_PLAN}}
  Record: trial_start_date
       |
       v
  [Email 1: Welcome + Quick Start Guide] -- Immediate
       |
       v
  Wait 1 day
       |
       v
  ----[Has user completed onboarding?]----
  |                                        |
  YES                                      NO
  |                                        |
  v                                        v
  [Email 2A: Power User Tips]        [Email 2B: Need Help Getting Started?]
       |                                   |
       v                                   v
  Wait 3 days                         Wait 2 days
       |                                   |
       +------ Merge ------+               |
              |                            v
              v                      [Email 2C: Onboarding Video Tutorial]
  [Email 3: Feature Spotlight +            |
   Social Proof] -- Day 5                  v
       |                              Wait 2 days
       v                                   |
  Wait until Trial Day -7                  |
  (7 days before expiry)                   v
       |                              Merge back
       v                                   |
  [Email 4: Trial Ending Soon --           |
   Urgency + Offer]                        |
       |                                   |
       v                                   |
  Wait until Trial Day -3            <-----+
  (3 days before expiry)
       |
       v
  [Email 5: Last Chance --
   Final CTA]
       |
       v
  Wait until Trial Day +1
  (1 day after expiry)
       |
       v
  ----[Did they convert?]----
  |                          |
  YES                        NO
  |                          |
  v                          v
  Tag: stage=customer   [Email 6: We Saved Your Data --
  Move to                Come Back Offer]
  Post-Purchase              |
  Onboarding                 v
                        Tag: stage=expired_trial
                        Move to Re-Engagement
                        Workflow (after 14 days)
```

### Workflow 3: Feature Adoption

```
[User Has Been Active for 7+ Days]
       |
       v
  ----[Has user tried {{KEY_FEATURE_1}}?]----
  |                                           |
  YES                                         NO
  |                                           |
  v                                           v
  (Skip -- already adopted)            [Email: Discover {{KEY_FEATURE_1}}]
                                              |
                                              v
                                        Wait 3 days
                                              |
                                              v
                                  ----[Tried it now?]----
                                  |                      |
                                  YES                    NO
                                  |                      |
                                  v                      v
                            (Great! Check              [Email: How {{CUSTOMER}}
                             next feature)              Uses {{KEY_FEATURE_1}}
                                                        + Video Tutorial]
                                                              |
                                                              v
                                                        Wait 5 days
                                                              |
                                                              v
                                                  ----[Tried it now?]----
                                                  |                      |
                                                  YES                    NO
                                                  |                      |
                                                  v                      v
                                            (Move on)              (Stop trying --
                                                                    they may not
                                                                    need this feature)
```

### Workflow 4: Churn Prevention

```
[Usage Declining Signal Detected]
(30%+ drop in activity week-over-week for 2+ consecutive weeks)
       |
       v
  Tag: risk=at_risk
  Alert: Notify {{SALES_TEAM}} or {{ACCOUNT_MANAGER}}
       |
       v
  [Email 1: "We Miss You" --
   Value reminder + helpful resources]
       |
       v
  Wait 3 days
       |
       v
  ----[Activity resumed?]----
  |                          |
  YES                        NO
  |                          |
  v                          v
  Remove tag: risk=at_risk  [Email 2: "Is Everything Okay?" --
  (Crisis averted)           Direct ask + offer help]
                                   |
                                   v
                             Wait 4 days
                                   |
                                   v
                       ----[Activity resumed?]----
                       |                          |
                       YES                        NO
                       |                          |
                       v                          v
                       (Safe)               ----[On paid plan?]----
                                            |                      |
                                            YES                    NO
                                            |                      |
                                            v                      v
                                      [Email 3:              [Email 3:
                                       Retention Offer --     Win-Back Offer --
                                       Downgrade option,      Special pricing
                                       pause subscription,    or extended trial]
                                       personal call offer]
                                            |
                                            v
                                      Tag: risk=high_risk
                                      Alert: Escalate to
                                      {{FOUNDER_NAME}}
```

---

## Segmentation Strategy

### Segment by Behavior

| Segment | Definition | Email Strategy |
|---------|------------|---------------|
| **Active Users** | Logged in within last 7 days | Feature tips, product updates, upsell |
| **Warm Users** | Logged in within last 30 days | Value reinforcement, feature discovery |
| **Cooling Users** | Last login 30-60 days ago | Re-engagement, "what's new" summary |
| **Cold Users** | No login for 60+ days | Win-back offer, feedback request |
| **Power Users** | Top 10% by usage | Beta access, referral requests, case study |
| **New Users** | Joined within last 14 days | Onboarding, quick wins, support |

### Segment by Source

| Segment | Source | Content Approach |
|---------|--------|-----------------|
| `source:organic` | Found you via search/social | Educational content, build awareness |
| `source:referral` | Referred by existing user | Social proof, get started quickly |
| `source:paid` | Came from paid ads | Direct value prop, conversion-focused |
| `source:content` | Downloaded lead magnet or read blog | Topic-specific nurture based on what they read |
| `source:event` | Webinar or event attendee | Follow-up on event content, relationship building |

### Segment by Engagement Level

| Level | Email Behavior | Action |
|-------|---------------|--------|
| **Super Engaged** | Opens 80%+, clicks frequently, replies | Increase frequency OK, ask for referrals, testimonials |
| **Engaged** | Opens 40-80%, occasional clicks | Standard frequency, mix of value and promotional |
| **Passive** | Opens 20-40%, rare clicks | More value-heavy content, fewer CTAs |
| **Disengaged** | Opens <20%, no clicks in 60 days | Re-engagement sequence, then remove if no response |
| **Ghost** | No opens in 90+ days | Final re-engagement, then remove from active list |

---

## Dynamic Content

Dynamic content personalizes email sections based on subscriber data without creating separate emails.

### How It Works
Instead of creating 5 versions of an email for 5 segments, you create 1 email with dynamic blocks that change based on subscriber attributes.

### Dynamic Content Examples

**By plan/tier:**
```
{{IF plan == "free"}}
  Upgrade to Pro to unlock {{PREMIUM_FEATURE}}: {{UPGRADE_URL}}
{{ELSE IF plan == "pro"}}
  You're on Pro! Have you tried {{ADVANCED_FEATURE}} yet?
{{ELSE IF plan == "enterprise"}}
  Your dedicated account manager {{AM_NAME}} is available for
  any questions: {{AM_EMAIL}}
{{ENDIF}}
```

**By usage level:**
```
{{IF projects_created == 0}}
  Ready to create your first project? Here's how: {{GUIDE_URL}}
{{ELSE IF projects_created < 5}}
  Great start! You've created {{projects_created}} projects.
  Here's a tip to make them even better: {{TIP}}
{{ELSE}}
  You're a power user with {{projects_created}} projects!
  Have you explored our API for bulk operations? {{API_DOCS_URL}}
{{ENDIF}}
```

**By industry:**
```
{{IF industry == "ecommerce"}}
  See how other ecommerce teams use {{PROJECT_NAME}}: {{ECOM_CASE_STUDY}}
{{ELSE IF industry == "saas"}}
  SaaS companies love our {{FEATURE}} for {{USE_CASE}}: {{SAAS_CASE_STUDY}}
{{ELSE}}
  Check out how teams like yours use {{PROJECT_NAME}}: {{GENERAL_CASE_STUDY}}
{{ENDIF}}
```

### Implementation Notes
- Most email platforms support dynamic content (ConvertKit uses Liquid, Mailchimp uses merge tags, etc.)
- Start simple: dynamic CTAs based on plan tier are the highest-impact first step
- Test dynamic emails thoroughly -- send test versions for each segment to verify correct rendering
- Fallback content for when data is missing: always have a default block

---

## Lead Scoring Integration

Email engagement feeds your lead scoring model, helping sales prioritize who to focus on.

### Email-Based Lead Score Points

| Action | Points | Rationale |
|--------|--------|-----------|
| Opens email | +1 | Basic interest signal |
| Clicks link in email | +3 | Active engagement |
| Clicks pricing page link | +10 | High purchase intent |
| Replies to email | +5 | Direct engagement |
| Forwards email | +3 | Sharing with colleagues (buying committee signal) |
| Completes welcome sequence | +5 | Committed subscriber |
| Downloads lead magnet | +5 | Active research phase |
| Does not open 3 consecutive emails | -5 | Losing interest |
| Unsubscribes | -20 | Remove from scoring |

### Lead Score Thresholds

| Score Range | Label | Action |
|-------------|-------|--------|
| 0-10 | Cold | Continue nurture sequence |
| 11-25 | Warming | Increase email frequency, more targeted content |
| 26-50 | Warm | Sales outreach appropriate, demo offer |
| 51-75 | Hot | Prioritize for sales call, direct CTA |
| 76+ | On Fire | Immediate sales follow-up, personal outreach from founder |

### Integrating with CRM
- Sync lead scores from your email platform to your CRM
- Set up alerts for sales when a lead crosses the "warm" threshold
- Use lead score to prioritize sales team's daily outreach
- Review and adjust scoring weights quarterly based on conversion data

---

## Workflow Testing

### A/B Testing Within Automations

**What you can test:**
| Element | How to Test | Minimum Sample |
|---------|-------------|---------------|
| Subject lines | Split test at each email step | 200+ per variant |
| Send timing | Test different wait periods between emails | 200+ per variant |
| Content length | Short vs. long versions of the same email | 200+ per variant |
| CTA type | Button vs. text link, different copy | 200+ per variant |
| Split paths | Different sequences for different segments | 100+ per path |

### Split Path Testing
Instead of A/B testing a single email, test entire sequence paths:

```
[New Trial User]
       |
       v
  ----[Random 50/50 split]----
  |                            |
  Path A                       Path B
  (5 emails over 14 days)     (3 emails over 7 days,
                               more aggressive)
  |                            |
  v                            v
  Measure conversion rate      Measure conversion rate
```

After 200+ users go through each path, compare which sequence converts better.

### Pre-Launch Testing Checklist
Before activating ANY automation:
- [ ] Send test emails to yourself for every email in the sequence
- [ ] Verify all links work correctly
- [ ] Check that personalization variables render properly (no "Hi {{FIRST_NAME}}" showing up)
- [ ] Test on mobile and desktop email clients
- [ ] Verify trigger conditions are correct (the right event starts the right workflow)
- [ ] Confirm exit conditions work (users leave the workflow when they should)
- [ ] Check that users cannot enter the same workflow twice simultaneously
- [ ] Verify tagging and segmentation updates occur at each step
- [ ] Test the workflow with a real email address on a real email client

---

## Tool-Agnostic Workflow Design

These workflows are designed to be implemented in ANY email tool. Here is how common tools handle automation:

| Concept | ConvertKit | Mailchimp | Loops | Resend | Brevo |
|---------|-----------|-----------|-------|--------|-------|
| Workflows | Visual Automations | Customer Journeys | Loops | Code-based (API) | Automation workflows |
| Triggers | Tags, forms, purchases | Signup, tags, events | Events, properties | API events | Events, lists, tags |
| Conditions | If/else on tags/fields | Conditional splits | Property-based | Code-based | If/else conditions |
| Wait steps | Time-based waits | Delay, date-based | Time delays | Code-based | Delay, date-based |
| Dynamic content | Liquid templating | Merge tags, conditionals | Handlebars | React components | Dynamic lists |

### Implementation Approach
1. **Design the workflow** on paper or in a diagramming tool first (do not start in the email platform)
2. **Define triggers and conditions** clearly before building
3. **Write all email copy** separately, then load it into the platform
4. **Build the workflow** in your email platform
5. **Test thoroughly** before activating
6. **Monitor** daily for the first week, then weekly

---

## Example Workflows for {{PROJECT_NAME}}

### Example: Trial-to-Conversion Workflow

| Step | Trigger/Condition | Email | Wait |
|------|-------------------|-------|------|
| 1 | `user.trial_started` | Welcome + Quick Start | Immediate |
| 2 | Wait | -- | 1 day |
| 3 | Check: completed onboarding? | If YES: Power tips / If NO: Help email | -- |
| 4 | Wait | -- | 3 days |
| 5 | -- | Feature spotlight + social proof | -- |
| 6 | Wait until trial_end - 7 days | -- | Variable |
| 7 | Check: still on trial? | If YES: Urgency email / If NO: skip (already converted) | -- |
| 8 | Wait until trial_end - 3 days | -- | Variable |
| 9 | Check: still on trial? | If YES: Last chance email / If NO: skip | -- |
| 10 | Wait until trial_end + 1 day | -- | Variable |
| 11 | Check: converted? | If YES: Post-purchase onboarding / If NO: Win-back offer | -- |

### Example: Feature Adoption Workflow

| Step | Trigger/Condition | Email | Wait |
|------|-------------------|-------|------|
| 1 | `user.active_for_7_days` AND `feature.{{KEY_FEATURE}}.not_used` | Discover {{KEY_FEATURE}} | -- |
| 2 | Wait | -- | 3 days |
| 3 | Check: used {{KEY_FEATURE}} now? | If YES: exit / If NO: continue | -- |
| 4 | -- | How-to video + customer example | -- |
| 5 | Wait | -- | 5 days |
| 6 | Check: used {{KEY_FEATURE}} now? | If YES: exit / If NO: stop workflow (not relevant for them) | -- |

### Example: Churn Prevention Workflow

| Step | Trigger/Condition | Email | Wait |
|------|-------------------|-------|------|
| 1 | `usage.declining` (30%+ drop for 2 weeks) | We noticed you're less active -- here's what's new | -- |
| 2 | Tag: `risk=at_risk` | Alert to team | Immediate |
| 3 | Wait | -- | 3 days |
| 4 | Check: activity resumed? | If YES: remove tag, exit / If NO: continue | -- |
| 5 | -- | Is everything OK? + offer help/call | -- |
| 6 | Wait | -- | 4 days |
| 7 | Check: activity resumed? | If YES: exit / If NO: retention offer | -- |
| 8 | -- | Downgrade/pause option or special pricing | -- |
| 9 | Tag: `risk=high_risk` | Escalate to founder | -- |

---

## Metrics Per Workflow

### Track These for Every Automation

| Metric | Formula | Target |
|--------|---------|--------|
| **Completion Rate** | Users who finish sequence / Users who enter | 70%+ |
| **Drop-off Point** | Which email causes the most exits? | Identify and fix weak emails |
| **Conversion Rate** | Users who take desired action / Users who enter | Varies by workflow (see below) |
| **Time to Convert** | Average time from workflow entry to conversion | Decreasing over time |
| **Revenue per Workflow** | Revenue attributable to workflow / Users who enter | Increasing over time |

### Benchmark Conversion Rates by Workflow

| Workflow | Conversion Target | What "Conversion" Means |
|----------|-------------------|------------------------|
| Welcome sequence | 5-15% start trial | Subscriber → trial user |
| Trial-to-paid | 15-30% convert | Trial user → paying customer |
| Feature adoption | 30-50% try feature | User → feature adopter |
| Churn prevention | 20-40% retained | At-risk user → active user |
| Re-engagement | 10-20% reactivated | Inactive → active |
| Referral request | 5-15% refer | Customer → referrer |
| Win-back | 5-10% return | Churned → resubscribed |

### Monthly Automation Dashboard

| Workflow | Entries | Completions | Conversions | Conv. Rate | Revenue | Notes |
|----------|---------|-------------|-------------|------------|---------|-------|
| Welcome | | | | | | |
| Trial-to-Paid | | | | | | |
| Feature Adoption | | | | | | |
| Churn Prevention | | | | | | |
| Re-Engagement | | | | | | |

---

## Implementation Priority

### Phase 1 (Week 1-2): Must-Have Automations
1. Welcome sequence (see welcome-sequence.template.md)
2. Trial-to-paid conversion workflow
3. Basic onboarding emails

### Phase 2 (Week 3-4): High-Impact Automations
4. Re-engagement sequence for inactive subscribers
5. Post-purchase onboarding
6. Trial expiration urgency emails

### Phase 3 (Month 2-3): Growth Automations
7. Feature adoption workflows
8. Churn prevention workflow
9. Referral request sequence
10. Lead scoring integration

### Phase 4 (Month 4+): Optimization
11. A/B testing within all workflows
12. Dynamic content personalization
13. Advanced segmentation-based paths
14. Revenue attribution tracking

---

## Action Items

- [ ] Map out your key user events and behavioral triggers
- [ ] Design your top 3 workflows on paper before building in-platform
- [ ] Write email copy for your Phase 1 automations
- [ ] Set up event tracking in your product (to trigger behavior-based emails)
- [ ] Build and test your welcome sequence
- [ ] Build and test your trial-to-paid workflow
- [ ] Set up your segmentation tags and lead scoring
- [ ] Schedule a monthly review of automation performance metrics
- [ ] Plan Phase 2 automations for implementation next month

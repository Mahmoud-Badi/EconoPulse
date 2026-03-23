# CTA & Lead Capture Strategy for {{PROJECT_NAME}}

> **Configure every call-to-action, lead capture form, and follow-up automation in the interactive demo.**
> Maximize conversion without disrupting the demo experience.

---

## Table of Contents

1. [Entry Gate Configuration](#entry-gate-configuration)
2. [Mid-Tour CTA Triggers](#mid-tour-cta-triggers)
3. [End-Screen CTA Design](#end-screen-cta-design)
4. [Form Fields & Validation](#form-fields--validation)
5. [Submission Endpoints](#submission-endpoints)
6. [Follow-Up Automation](#follow-up-automation)
7. [A/B Test Variations](#ab-test-variations)
8. [GDPR / Privacy Compliance](#gdpr--privacy-compliance)
9. [CTA Performance Benchmarks](#cta-performance-benchmarks)
10. [Checklist](#checklist)

---

## Entry Gate Configuration

### Gate Decision

| Option | Description | Pros | Cons |
|--------|-----------|------|------|
| **No Gate** | Demo starts immediately | Highest start rate, zero friction | No lead capture before demo |
| **Soft Gate** | Gate shown but skippable | Captures willing leads, low friction | Lower capture rate than hard gate |
| **Hard Gate** | Email required to proceed | Maximum lead capture | Significant drop-off (30-60% typical) |

**Selected option:** {{SELECTED_GATE, e.g., "Soft Gate"}}

**Rationale:** {{RATIONALE}}

### Gate Design

<!-- IF {{ENTRY_GATE_ENABLED}} -->

```
┌─────────────────────────────────────────────┐
│                                             │
│            [{{PROJECT_LOGO}}]               │
│                                             │
│    {{GATE_HEADLINE}}                        │
│    {{GATE_SUBHEADLINE}}                     │
│                                             │
│    ┌───────────────────────────────────┐     │
│    │ {{EMAIL_PLACEHOLDER}}            │     │
│    └───────────────────────────────────┘     │
│    ┌───────────────────────────────────┐     │
│    │ {{ADDITIONAL_FIELD_PLACEHOLDER}}  │     │
│    └───────────────────────────────────┘     │
│                                             │
│    [{{SUBMIT_BUTTON_TEXT}}]                  │
│                                             │
│    {{SKIP_LINK_TEXT}}                        │
│    {{PRIVACY_MICRO_COPY}}                   │
│                                             │
└─────────────────────────────────────────────┘
```

| Element | Value |
|---------|-------|
| **Headline** | {{GATE_HEADLINE, e.g., "See {{PROJECT_NAME}} in action"}} |
| **Subheadline** | {{GATE_SUBHEADLINE, e.g., "Enter your email to get started with the interactive demo"}} |
| **Background** | {{BACKGROUND, e.g., "Product screenshot, blurred"}} |
| **Logo** | {{LOGO_PLACEMENT, e.g., "Centered, 120px wide"}} |
| **Form Position** | {{POSITION, e.g., "Center of viewport, card layout"}} |

### Gate Fields

| Field | Type | Required? | Placeholder | Validation |
|-------|------|-----------|-------------|-----------|
| Email | email | {{YES/NO}} | {{PLACEHOLDER}} | Valid email format |
| {{FIELD_2, e.g., "Full Name"}} | text | {{YES/NO}} | {{PLACEHOLDER}} | {{VALIDATION}} |
| {{FIELD_3, e.g., "Company"}} | text | {{YES/NO}} | {{PLACEHOLDER}} | {{VALIDATION}} |
| {{FIELD_4, e.g., "Role"}} | select | {{YES/NO}} | {{PLACEHOLDER}} | {{VALIDATION}} |

### Gate Behavior

| Behavior | Value |
|----------|-------|
| **Skip Allowed?** | {{YES/NO}} |
| **Skip Link Text** | {{SKIP_TEXT, e.g., "Skip — I just want to explore"}} |
| **Skip Tracking** | {{TRACKING, e.g., "Track as 'gate_skipped' event"}} |
| **Remember Submission** | {{REMEMBER, e.g., "Cookie for 30 days — don't re-gate return visitors"}} |
| **Submit Animation** | {{ANIMATION, e.g., "Button shows spinner, then transitions to welcome screen"}} |

<!-- ENDIF -->

---

## Mid-Tour CTA Triggers

### Trigger Configuration

| # | Appears After Step | Trigger Type | CTA Format | Dismissible? | Re-Shows? |
|---|-------------------|-------------|-----------|-------------|-----------|
| 1 | {{STEP_NUMBER}} | {{TYPE, e.g., "Step completion"}} | {{FORMAT, e.g., "Slide-up banner"}} | {{YES/NO}} | {{BEHAVIOR, e.g., "No, once dismissed it's gone"}} |
| 2 | {{STEP_NUMBER}} | {{TYPE, e.g., "Time-based (60s in demo)"}} | {{FORMAT, e.g., "Modal overlay"}} | {{YES/NO}} | {{BEHAVIOR}} |
| 3 | {{STEP_NUMBER}} | {{TYPE, e.g., "Feature interaction"}} | {{FORMAT, e.g., "Inline card"}} | {{YES/NO}} | {{BEHAVIOR}} |

### Mid-Tour CTA #1 Detail

| Element | Value |
|---------|-------|
| **Trigger** | After completing Step {{STEP_NUMBER}} ("{{STEP_TITLE}}") |
| **Format** | {{FORMAT}} |
| **Headline** | {{HEADLINE, e.g., "Impressed? There's more."}} |
| **Body** | {{BODY, e.g., "You've seen the core workflow. Ready to try it with your own data?"}} |
| **Primary Action** | {{PRIMARY, e.g., "Start Free Trial"}} |
| **Primary URL** | {{PRIMARY_URL}} |
| **Secondary Action** | {{SECONDARY, e.g., "Keep Exploring"}} |
| **Dismiss Behavior** | {{DISMISS, e.g., "Clicking secondary or X resumes demo, CTA does not reappear"}} |
| **Design** | {{DESIGN, e.g., "Matches brand colors, subtle slide-up from bottom"}} |

### Mid-Tour CTA #2 Detail

<!-- IF {{SECOND_MID_CTA}} -->

| Element | Value |
|---------|-------|
| **Trigger** | {{TRIGGER}} |
| **Format** | {{FORMAT}} |
| **Headline** | {{HEADLINE}} |
| **Body** | {{BODY}} |
| **Primary Action** | {{PRIMARY}} |
| **Primary URL** | {{PRIMARY_URL}} |
| **Secondary Action** | {{SECONDARY}} |
| **Dismiss Behavior** | {{DISMISS}} |

<!-- ENDIF -->

### Mid-Tour CTA Rules

- [ ] Never show more than {{MAX_MID_CTAS, e.g., 2}} mid-tour CTAs per session
- [ ] Never interrupt an interactive step — only appear after completion
- [ ] Always provide a "Keep Exploring" option
- [ ] If user already submitted entry gate, skip the first mid-tour CTA
- [ ] Track impression and click for every CTA shown

---

## End-Screen CTA Design

### End-Screen Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│     {{COMPLETION_ICON, e.g., "Checkmark / Party"}}  │
│                                                     │
│     {{END_HEADLINE}}                                │
│     {{END_BODY}}                                    │
│                                                     │
│     ┌────────────────────┐                          │
│     │ {{PRIMARY_CTA}}    │  ← Primary action        │
│     └────────────────────┘                          │
│                                                     │
│     ┌────────────────────┐                          │
│     │ {{SECONDARY_CTA}}  │  ← Secondary action      │
│     └────────────────────┘                          │
│                                                     │
│     {{TERTIARY_LINK}}                               │
│                                                     │
│     {{SOCIAL_PROOF_ELEMENT}}                        │
│                                                     │
│     ┌──────────────────────────────────────────┐    │
│     │ {{TESTIMONIAL_OR_STATS}}                 │    │
│     └──────────────────────────────────────────┘    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### End-Screen Copy

| Element | Copy | URL / Action |
|---------|------|-------------|
| **Headline** | {{END_HEADLINE, e.g., "You've seen it all. Ready to build?"}} | — |
| **Body** | {{END_BODY, e.g., "{{PROJECT_NAME}} is ready for your team. Start free, upgrade when you're ready."}} | — |
| **Primary CTA** | {{PRIMARY_CTA, e.g., "Start Free Trial"}} | {{PRIMARY_URL}} |
| **Secondary CTA** | {{SECONDARY_CTA, e.g., "Book a Demo with Sales"}} | {{SECONDARY_URL}} |
| **Tertiary Link** | {{TERTIARY, e.g., "Replay the Tour"}} | {{TERTIARY_ACTION, e.g., "Reset to Step 1"}} |
| **Social Proof** | {{SOCIAL_PROOF, e.g., "Trusted by 500+ teams including [Logo] [Logo] [Logo]"}} | — |
| **Testimonial** | {{TESTIMONIAL, e.g., "'We cut our onboarding time by 70%' — Jane D., VP Product"}} | — |

### End-Screen Variations by Source

<!-- IF {{SOURCE_BASED_END_SCREEN}} -->

| Traffic Source (UTM) | Headline Variant | Primary CTA | Secondary CTA |
|---------------------|-----------------|-------------|--------------|
| {{UTM_SOURCE_1, e.g., "email"}} | {{HEADLINE}} | {{CTA}} | {{CTA}} |
| {{UTM_SOURCE_2, e.g., "paid_social"}} | {{HEADLINE}} | {{CTA}} | {{CTA}} |
| {{UTM_SOURCE_3, e.g., "organic"}} | {{HEADLINE}} | {{CTA}} | {{CTA}} |
| Default | {{HEADLINE}} | {{CTA}} | {{CTA}} |

<!-- ENDIF -->

---

## Form Fields & Validation

### Field Definitions

| Field Name | HTML Type | Required | Placeholder | Validation Rule | Error Message |
|-----------|----------|----------|-------------|----------------|--------------|
| {{FIELD_1, e.g., "Email"}} | {{TYPE, e.g., "email"}} | {{YES/NO}} | {{PLACEHOLDER}} | {{RULE, e.g., "RFC 5322 email format"}} | {{ERROR, e.g., "Please enter a valid email address"}} |
| {{FIELD_2, e.g., "Full Name"}} | {{TYPE}} | {{YES/NO}} | {{PLACEHOLDER}} | {{RULE}} | {{ERROR}} |
| {{FIELD_3, e.g., "Company"}} | {{TYPE}} | {{YES/NO}} | {{PLACEHOLDER}} | {{RULE}} | {{ERROR}} |
| {{FIELD_4, e.g., "Company Size"}} | {{TYPE, e.g., "select"}} | {{YES/NO}} | {{PLACEHOLDER}} | {{RULE}} | {{ERROR}} |
| {{FIELD_5, e.g., "Role"}} | {{TYPE}} | {{YES/NO}} | {{PLACEHOLDER}} | {{RULE}} | {{ERROR}} |

### Select Field Options

#### {{SELECT_FIELD, e.g., "Company Size"}}

| Value | Display Label |
|-------|-------------|
| {{VALUE_1}} | {{LABEL_1, e.g., "1-10 employees"}} |
| {{VALUE_2}} | {{LABEL_2, e.g., "11-50 employees"}} |
| {{VALUE_3}} | {{LABEL_3, e.g., "51-200 employees"}} |
| {{VALUE_4}} | {{LABEL_4, e.g., "201-1000 employees"}} |
| {{VALUE_5}} | {{LABEL_5, e.g., "1000+ employees"}} |

#### {{SELECT_FIELD_2, e.g., "Role"}}

| Value | Display Label |
|-------|-------------|
| {{VALUE_1}} | {{LABEL_1}} |
| {{VALUE_2}} | {{LABEL_2}} |
| {{VALUE_3}} | {{LABEL_3}} |
| {{VALUE_4}} | {{LABEL_4}} |

### Form UX Rules

- [ ] Inline validation — show errors as user leaves each field
- [ ] Submit button disabled until all required fields pass validation
- [ ] Loading spinner on submit — prevent double-submission
- [ ] Success state: {{SUCCESS_BEHAVIOR, e.g., "Green checkmark, then auto-transition to demo"}}
- [ ] Error state: {{ERROR_BEHAVIOR, e.g., "Red highlight on invalid fields, retry button"}}
- [ ] Autofocus first field on gate load
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] Mobile: use appropriate input types (email keyboard, number pad)

---

## Submission Endpoints

### Webhook Configuration

| Destination | Method | URL | Auth | Payload Format |
|------------|--------|-----|------|---------------|
| **Primary CRM** | {{METHOD, e.g., "POST"}} | {{URL, e.g., "https://hooks.zapier.com/..."}} | {{AUTH, e.g., "None (webhook secret in URL)"}} | {{FORMAT, e.g., "JSON"}} |
| **Email Platform** | {{METHOD}} | {{URL}} | {{AUTH}} | {{FORMAT}} |
| **Analytics** | {{METHOD}} | {{URL}} | {{AUTH}} | {{FORMAT}} |
| **Slack Notification** | {{METHOD}} | {{URL}} | {{AUTH}} | {{FORMAT}} |

### Payload Schema

```json
{
  "source": "interactive_demo",
  "demo_version": "{{DEMO_VERSION}}",
  "submitted_at": "{{ISO_TIMESTAMP}}",
  "gate_type": "{{GATE_TYPE, e.g., entry / mid_tour / end_screen}}",
  "utm_source": "{{UTM_SOURCE}}",
  "utm_medium": "{{UTM_MEDIUM}}",
  "utm_campaign": "{{UTM_CAMPAIGN}}",
  "fields": {
    "email": "{{USER_EMAIL}}",
    "name": "{{USER_NAME}}",
    "company": "{{USER_COMPANY}}",
    "company_size": "{{USER_COMPANY_SIZE}}",
    "role": "{{USER_ROLE}}"
  },
  "demo_context": {
    "steps_completed": {{STEPS_COMPLETED}},
    "total_steps": {{TOTAL_STEPS}},
    "mode": "{{MODE, e.g., guided / free_explore}}",
    "time_spent_seconds": {{TIME_SPENT}},
    "features_explored": ["{{FEATURE_1}}", "{{FEATURE_2}}"]
  }
}
```

### CRM Integration

| CRM | Integration Method | Lead Status | Lead Source | Tags |
|-----|-------------------|------------|-----------|------|
| {{CRM_NAME, e.g., "HubSpot"}} | {{METHOD, e.g., "Native API / Zapier / Segment"}} | {{STATUS, e.g., "Marketing Qualified Lead"}} | {{SOURCE, e.g., "Interactive Demo"}} | {{TAGS, e.g., "demo-viewer, {{UTM_CAMPAIGN}}"}} |

### Submission Fallback

| Scenario | Behavior |
|----------|---------|
| Webhook fails (5xx) | {{FALLBACK, e.g., "Retry 3x with exponential backoff, then store in localStorage"}} |
| User offline | {{FALLBACK, e.g., "Queue submission, send when connection restored"}} |
| Rate limited | {{FALLBACK, e.g., "Batch submissions, send every 30s"}} |
| Invalid response | {{FALLBACK, e.g., "Log error, still allow user to proceed with demo"}} |

---

## Follow-Up Automation

### Email Drip Sequence

| # | Trigger | Delay | Subject Line | Content | CTA |
|---|---------|-------|-------------|---------|-----|
| 1 | {{TRIGGER, e.g., "Email submitted at entry gate"}} | {{DELAY, e.g., "Immediate"}} | {{SUBJECT, e.g., "Your {{PROJECT_NAME}} demo recap"}} | {{CONTENT, e.g., "Summary of what they saw + link to replay"}} | {{CTA, e.g., "Start Free Trial"}} |
| 2 | {{TRIGGER, e.g., "Email 1 sent"}} | {{DELAY, e.g., "+2 days"}} | {{SUBJECT}} | {{CONTENT}} | {{CTA}} |
| 3 | {{TRIGGER}} | {{DELAY, e.g., "+5 days"}} | {{SUBJECT}} | {{CONTENT}} | {{CTA}} |
| 4 | {{TRIGGER}} | {{DELAY, e.g., "+10 days"}} | {{SUBJECT}} | {{CONTENT}} | {{CTA}} |

### CRM Tags & Lead Scoring

| Condition | Tag Applied | Score Impact |
|-----------|-----------|-------------|
| Submitted entry gate | {{TAG, e.g., "demo-lead"}} | {{SCORE, e.g., "+10"}} |
| Completed 50%+ of demo | {{TAG, e.g., "demo-engaged"}} | {{SCORE, e.g., "+15"}} |
| Completed full demo | {{TAG, e.g., "demo-completed"}} | {{SCORE, e.g., "+25"}} |
| Clicked end-screen CTA | {{TAG, e.g., "demo-high-intent"}} | {{SCORE, e.g., "+30"}} |
| Revisited demo | {{TAG, e.g., "demo-return-visitor"}} | {{SCORE, e.g., "+10"}} |

### Slack Notifications

<!-- IF {{SLACK_NOTIFICATIONS_ENABLED}} -->

| Event | Slack Channel | Message Format |
|-------|-------------|---------------|
| New lead submitted | {{CHANNEL, e.g., "#demo-leads"}} | {{FORMAT, e.g., "New demo lead: {{NAME}} ({{EMAIL}}) from {{COMPANY}} — completed {{STEPS}}/{{TOTAL}} steps"}} |
| High-intent action | {{CHANNEL}} | {{FORMAT}} |
| Demo error | {{CHANNEL, e.g., "#demo-alerts"}} | {{FORMAT}} |

<!-- ENDIF -->

### Sales Handoff

| Condition | Action | Owner |
|-----------|--------|-------|
| Lead score ≥ {{THRESHOLD}} | {{ACTION, e.g., "Auto-create deal in CRM, assign to SDR"}} | {{OWNER}} |
| Clicked "Book a Demo" | {{ACTION, e.g., "Calendly link, auto-schedule with AE"}} | {{OWNER}} |
| Enterprise company detected | {{ACTION, e.g., "Slack ping to enterprise sales team"}} | {{OWNER}} |

---

## A/B Test Variations

### CTA A/B Tests

| Test # | Element | Variant A | Variant B | Hypothesis | Primary Metric |
|--------|---------|-----------|-----------|-----------|---------------|
| 1 | Entry gate type | {{A, e.g., "Soft gate (skippable)"}} | {{B, e.g., "No gate"}} | {{HYPOTHESIS, e.g., "Soft gate captures 30%+ leads without reducing completion rate"}} | {{METRIC, e.g., "Lead capture rate"}} |
| 2 | End-screen CTA text | {{A, e.g., "'Start Free Trial'"}} | {{B, e.g., "'Get Started Now'"}} | {{HYPOTHESIS}} | {{METRIC}} |
| 3 | Mid-tour CTA timing | {{A, e.g., "After Step 4"}} | {{B, e.g., "After Step 6"}} | {{HYPOTHESIS}} | {{METRIC}} |
| 4 | Form field count | {{A, e.g., "Email only"}} | {{B, e.g., "Email + Name + Company"}} | {{HYPOTHESIS}} | {{METRIC}} |
| 5 | Social proof on end screen | {{A, e.g., "With testimonial"}} | {{B, e.g., "Without testimonial"}} | {{HYPOTHESIS}} | {{METRIC}} |

### Test Prioritization

1. **{{TEST_NAME}}** — Run first: {{REASON}}
2. **{{TEST_NAME}}** — Run second: {{REASON}}
3. **{{TEST_NAME}}** — Run if resources allow: {{REASON}}

---

## GDPR / Privacy Compliance

### Consent Requirements

| Requirement | Implementation | Status |
|------------|---------------|--------|
| **Explicit consent for email** | {{IMPLEMENTATION, e.g., "Checkbox: 'I agree to receive follow-up emails'"}} | {{STATUS}} |
| **Privacy policy link** | {{IMPLEMENTATION, e.g., "Link below form: 'Privacy Policy'"}} | {{STATUS}} |
| **Cookie consent banner** | {{IMPLEMENTATION, e.g., "Banner on first visit with Accept/Decline"}} | {{STATUS}} |
| **Right to deletion** | {{IMPLEMENTATION, e.g., "Email support@{{DOMAIN}} to request deletion"}} | {{STATUS}} |
| **Data processing disclosure** | {{IMPLEMENTATION, e.g., "Micro-copy: 'Your data is processed by [CRM] per our privacy policy'"}} | {{STATUS}} |
| **Analytics opt-out** | {{IMPLEMENTATION, e.g., "Respect Do Not Track header, provide opt-out link"}} | {{STATUS}} |

### Regional Considerations

| Region | Additional Requirements | Implementation |
|--------|----------------------|---------------|
| EU (GDPR) | {{REQUIREMENTS}} | {{IMPLEMENTATION}} |
| California (CCPA) | {{REQUIREMENTS}} | {{IMPLEMENTATION}} |
| Canada (PIPEDA) | {{REQUIREMENTS}} | {{IMPLEMENTATION}} |
| Other: {{REGION}} | {{REQUIREMENTS}} | {{IMPLEMENTATION}} |

### Consent Copy

| Element | Copy |
|---------|------|
| **Checkbox Label** | {{CONSENT_TEXT, e.g., "I'd like to receive product updates and tips from {{PROJECT_NAME}}. You can unsubscribe anytime."}} |
| **Privacy Link** | {{PRIVACY_LINK_TEXT, e.g., "Read our Privacy Policy"}} |
| **Cookie Banner** | {{COOKIE_TEXT, e.g., "We use cookies to improve your demo experience and track analytics."}} |

---

## CTA Performance Benchmarks

### Industry Benchmarks

| Metric | Poor | Average | Good | Excellent |
|--------|------|---------|------|-----------|
| Demo start rate | <20% | 20-35% | 35-50% | >50% |
| Demo completion rate | <30% | 30-50% | 50-70% | >70% |
| Entry gate submission | <5% | 5-15% | 15-30% | >30% |
| Mid-tour CTA click | <2% | 2-5% | 5-10% | >10% |
| End-screen CTA click | <5% | 5-12% | 12-20% | >20% |
| Email-to-trial conversion | <3% | 3-8% | 8-15% | >15% |

### {{PROJECT_NAME}} Targets

| Metric | Current | Target | Benchmark Category |
|--------|---------|--------|--------------------|
| Demo start rate | {{CURRENT}} | {{TARGET}} | {{CATEGORY}} |
| Demo completion rate | {{CURRENT}} | {{TARGET}} | {{CATEGORY}} |
| Entry gate submission | {{CURRENT}} | {{TARGET}} | {{CATEGORY}} |
| Mid-tour CTA click | {{CURRENT}} | {{TARGET}} | {{CATEGORY}} |
| End-screen CTA click | {{CURRENT}} | {{TARGET}} | {{CATEGORY}} |
| Email-to-trial conversion | {{CURRENT}} | {{TARGET}} | {{CATEGORY}} |

### Optimization Playbook

| If Metric Is Below Target | Investigate | Common Fixes |
|--------------------------|------------|-------------|
| Low demo start rate | Page load time, CTA visibility, copy clarity | Improve above-fold CTA, reduce page load, sharpen headline |
| Low completion rate | Drop-off step, tour length, content quality | Shorten tour, improve weak step, add skip option |
| Low gate submission | Form length, value proposition, trust signals | Reduce fields, add social proof, make skippable |
| Low end-screen click | CTA copy, placement, value clarity | Test copy variants, add testimonial, strengthen offer |
| Low email-to-trial | Follow-up timing, email content, landing page | Shorten delay, personalize content, improve trial onboarding |

---

## Checklist

- [ ] Entry gate strategy selected and designed
- [ ] Mid-tour CTA triggers defined (max {{MAX_MID_CTAS}})
- [ ] End-screen CTA designed with primary, secondary, and tertiary actions
- [ ] All form fields defined with validation rules
- [ ] Submission endpoints configured and tested
- [ ] Follow-up email sequence drafted
- [ ] CRM tags and lead scoring rules defined
- [ ] A/B tests prioritized
- [ ] GDPR / privacy compliance verified
- [ ] Performance benchmarks set with optimization playbook

---

*This template is part of the Master Starter Kit walkthrough demo system. See `WALKTHROUGH-DEMO-GENERATOR.md` for the generation prompt.*

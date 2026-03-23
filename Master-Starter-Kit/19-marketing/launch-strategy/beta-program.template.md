# Beta Program — {{PROJECT_NAME}}

> Design, recruit, manage, and graduate a beta program that validates your product and builds your launch audience.

---

## Beta Program Overview

| Element | Value |
|---------|-------|
| Product | {{PROJECT_NAME}} |
| Target audience | {{TARGET_AUDIENCE}} |
| Beta duration | 2-4 weeks (recommended) |
| Target beta users | 20-50 users |
| Beta type | Closed (invite-only) |

---

## Beta Goals

The beta program exists to answer these questions before public launch:

1. **Activation:** Can new users reach the "aha moment" without hand-holding?
2. **Value:** Do users get real value from the product?
3. **Retention:** Do users come back after day 1? Day 7?
4. **Bugs:** What breaks in real-world usage?
5. **Messaging:** How do users describe the product in their own words?
6. **Willingness to pay:** Would users pay for this? How much?

---

## Beta User Recruitment

### Ideal Beta User Profiles

**Power Users (40% of beta):**
- Technically capable, will push the product to its limits
- Provide detailed bug reports and feature suggestions
- Source: Developer communities, existing network, Twitter/X

**Target Users (40% of beta):**
- Match your actual target audience exactly
- Provide feedback on usability, onboarding, and value
- Source: Communities where {{TARGET_AUDIENCE}} hangs out

**Edge Case Testers (20% of beta):**
- Use different devices, browsers, workflows than you expect
- Reveal assumptions you didn't know you had
- Source: Diverse recruitment, different geographies

### Recruitment Channels

| Channel | How | Expected Conversion |
|---------|-----|-------------------|
| Personal network | Direct message, explain the beta | 30-50% of those asked |
| Twitter/X | "Building [X] — looking for 20 beta testers" post | 5-10% of respondents qualify |
| Communities | Post in relevant subreddits, Discord, Slack groups | 3-8% of respondents qualify |
| Waitlist | Email your existing waitlist with beta invitation | 15-25% accept |
| Cold outreach | Identify ideal users, send personalized invite | 10-20% respond |

### Beta Application Form

Collect from applicants:
- Name and email
- What they currently use to solve this problem (competitor or manual process)
- What frustrates them about their current solution
- Device/browser they'll primarily use
- How many hours per week they'd commit to testing
- (Optional) Social profile or company for verification

### Selection Criteria
- Prioritize users who have the problem your product solves
- Mix of technical and non-technical users
- Mix of company sizes (if B2B)
- Favor people who are articulate about their needs (they give better feedback)
- Avoid: people who just want free stuff, competitors doing research

---

## Beta Invitation

### Invitation Email Template

```
Subject: You're invited to beta test {{PROJECT_NAME}}

Hi [Name],

I'm building {{PROJECT_NAME}} — [one-line description].

I read your [application / post / comment about X] and think you'd be a perfect beta tester. You clearly understand the problem of [specific pain point they mentioned].

Here's what beta testing involves:
- Free access to {{PROJECT_NAME}} for [X weeks]
- Use it for your real work (not just kicking the tires)
- Share feedback through [method: in-app, Slack channel, weekly survey]
- 30 minutes for a feedback call at the end

What you get:
- [Incentive — see section below]
- Direct influence on the product roadmap
- Early access before public launch

Interested? Click here to get started: [onboarding link]

Thanks,
[Your name]
```

---

## Beta Incentives

| Incentive | Best For | Cost |
|-----------|----------|------|
| Free access during beta + discounted rate after | SaaS products | Low |
| Lifetime deal (locked-in price forever) | Early-stage SaaS | Medium |
| Extended free tier (3-6 months free) | Products with free tier | Low |
| Exclusive features (beta badge, early access to new features) | Community-driven products | Free |
| Swag (stickers, t-shirt) | Developer tools | $10-30/user |
| Public credit (name in changelog, "founding users" page) | Indie products | Free |
| Gift card ($25-50 Amazon) | General | $25-50/user |

**Recommended combination:** Lifetime discounted price + founding user recognition + direct line to founder.

---

## Feedback Collection Framework

### In-App Feedback
- Feedback button always visible (persistent widget)
- Bug report form: what happened, what you expected, screenshot upload
- Feature request form: what you want, why it matters, priority
- NPS survey at end of week 1 and end of beta

### Weekly Survey (5 questions max)

```
1. How many times did you use {{PROJECT_NAME}} this week? [0, 1-2, 3-5, 5+]
2. What did you accomplish with it? [free text]
3. What frustrated you? [free text]
4. What feature do you wish existed? [free text]
5. On a scale of 1-10, how likely are you to recommend this to a colleague? [NPS]
```

### Feedback Calls (End of Beta)
Schedule a 30-minute call with each beta user. Questions:

1. Walk me through how you've been using the product this week.
2. What's the most valuable thing about it for you?
3. What almost made you stop using it?
4. If you could change one thing, what would it be?
5. How would you describe this product to a friend?
6. Would you pay for this? How much feels right?
7. What would make you switch from [current solution] to this permanently?

### Feedback Triage System

| Category | Priority | Action |
|----------|----------|--------|
| Critical bug (data loss, crash, security) | P0 — fix immediately | Hotfix within 24 hours |
| Usability blocker (can't complete core flow) | P1 — fix before launch | Fix within the beta period |
| Friction point (confusing but workable) | P2 — fix for launch | Add to pre-launch sprint |
| Feature request (nice to have) | P3 — evaluate | Add to backlog, prioritize by frequency |
| Polish (visual, copy, minor UX) | P4 — when possible | Batch for post-launch updates |

---

## Beta Iteration Cadence

### Week 1: Onboard and Observe
- Day 1-2: All beta users get access, welcome email, onboarding guide
- Day 3-5: Monitor activation rate, identify blockers
- Day 5-7: First weekly survey, triage feedback, ship P0/P1 fixes

### Week 2: Iterate and Improve
- Ship fixes for top 3 issues from Week 1
- Release update to beta users with changelog
- Second weekly survey
- Schedule end-of-beta calls

### Week 3: Polish and Validate (if 3-week beta)
- Final round of fixes
- Run the end-of-beta survey and calls
- Collect testimonials from happy users
- Confirm pricing willingness

### Week 4: Graduation (if 4-week beta)
- Final build incorporating beta feedback
- Collect case studies and testimonials
- Send graduation email (see below)
- Transition beta users to production

---

## Beta Graduation Criteria

The beta is ready to end when:

- [ ] **Activation rate > 60%** — most users reach the aha moment
- [ ] **Critical bugs resolved** — no P0 or P1 issues remaining
- [ ] **Core flow works** — users can complete the primary use case end-to-end
- [ ] **Positive NPS** — average NPS score > 30
- [ ] **Retention signal** — users return after day 1 without prompting
- [ ] **Pricing validated** — at least 50% of beta users say they'd pay
- [ ] **Testimonials collected** — 3-5 usable testimonials with permission

---

## Converting Beta Users to Paying Customers

### Graduation Email Template

```
Subject: {{PROJECT_NAME}} is launching — and you get a special deal

Hi [Name],

Thank you for being one of our founding beta testers. Your feedback shaped
{{PROJECT_NAME}} into what it is today. Specifically, [mention one piece of
their feedback that was implemented].

We're launching publicly on [date]. As a founding beta tester, you get:

🎯 [Incentive: e.g., "50% off for life" or "3 months free" or "Founding User badge"]

Your special link: [personalized upgrade/signup link]

This offer is available until [deadline — 7 days after launch].

After that, standard pricing applies.

Thank you for believing in {{PROJECT_NAME}} early. You helped build this.

[Your name]
```

### Conversion Tactics
- Give beta users a better deal than public launch pricing
- Create urgency with a deadline for the beta-exclusive offer
- Personalize the ask — reference specific feedback they gave
- Make the transition seamless (no data loss, no re-onboarding)
- Ask happy beta users to support your Product Hunt or public launch

---

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
## SaaS Beta Specifics
- Beta access should use the same billing system as production (test the full flow)
- Track feature usage to validate which features matter most
- Beta pricing should be clearly "beta pricing" — not the final price
- Multi-tenant isolation should be tested with real beta user data
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
## Mobile App Beta Specifics
- Use TestFlight (iOS) and Google Play Internal Testing (Android)
- Limit to 10,000 testers on TestFlight
- Collect device-specific feedback (which phones, OS versions)
- Test push notifications during beta
- Beta builds should include crash reporting (Sentry, Crashlytics)
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
## Developer Tool Beta Specifics
- Provide beta access via invite-only API keys or npm package tags
- Documentation must exist during beta — developers won't test without docs
- Create a Discord or Slack channel for real-time beta feedback
- Track API usage patterns to understand real-world integration needs
- Beta users often become your best early advocates and contributors
<!-- ENDIF -->

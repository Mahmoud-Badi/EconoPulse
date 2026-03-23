# Knowledge Base Architecture — {{PROJECT_NAME}}

> Your knowledge base is the single highest-leverage support investment you will make. Every article you write prevents hundreds of future tickets.

---

## Overview

This document defines the structure, content strategy, maintenance cadence, and analytics framework for the {{PROJECT_NAME}} knowledge base. A well-structured KB does not just answer questions — it prevents them. The goal is a **self-serve resolution rate of 70%+**, meaning seven out of ten users find their answer without contacting a human.

**Platform:** {{SUPPORT_PLATFORM}}
**KB URL:** {{KB_URL}}

---

## Top-Level Category Structure

Design your KB with six core categories. Every article lives in exactly one category. If an article could fit in two categories, pick the one a confused user would look in first, and add a cross-link from the other.

### Category 1: Getting Started

> For brand-new users. First 15 minutes of using {{PROJECT_NAME}}.

| Article | Priority | Status |
|---------|----------|--------|
| What is {{PROJECT_NAME}} and who is it for? | P0 | <!-- Draft / Published --> |
| Creating your account | P0 | |
| Quick start guide (first 5 minutes) | P0 | |
| Navigating the dashboard | P0 | |
| Setting up your profile / workspace | P1 | |
| Inviting team members | P1 | |
| Understanding your plan and limits | P1 | |
| Glossary of key terms | P2 | |

### Category 2: Features & How-To

> Task-oriented guides for every core feature. One article per feature or workflow.

| Article | Priority | Status |
|---------|----------|--------|
| <!-- List every core feature of {{PROJECT_NAME}} as an article --> | | |
| How to [primary action] | P0 | |
| How to [secondary action] | P0 | |
| How to configure [settings area] | P1 | |
| How to use [advanced feature] | P1 | |
| How to [import/export data] | P1 | |
| How to [collaborate with team] | P1 | |
| How to [customize appearance/settings] | P2 | |
| Keyboard shortcuts and power-user tips | P2 | |

### Category 3: Account & Billing

> Everything related to accounts, subscriptions, payments, and data.

| Article | Priority | Status |
|---------|----------|--------|
| How to change your password | P0 | |
| How to update your email address | P0 | |
| How to upgrade or downgrade your plan | P0 | |
| How to cancel your subscription | P0 | |
| How to request a refund | P0 | |
| How to download your invoice | P1 | |
| How to export your data | P1 | |
| How to delete your account | P1 | |
| Understanding usage limits by plan | P1 | |
| Two-factor authentication setup | P1 | |
| How to transfer account ownership | P2 | |
| Tax and VAT information | P2 | |

### Category 4: Troubleshooting

> Problem-oriented articles. "X is not working" → solution.

| Article | Priority | Status |
|---------|----------|--------|
| I cannot log in to my account | P0 | |
| The page is loading slowly or not at all | P0 | |
| I am seeing an error message (error code reference) | P0 | |
| My data is not saving / syncing | P0 | |
| Notifications are not working | P1 | |
| [Feature] is not behaving as expected | P1 | |
| Browser compatibility issues | P1 | |
| Mobile app issues | P1 | |
| Email notifications going to spam | P2 | |
| Known issues and workarounds | P2 | |

### Category 5: API & Integrations

<!-- IF {{SUPPORT_PLATFORM}} == "intercom" -->
> For developers integrating with {{PROJECT_NAME}}. Link to full API docs for deep dives.
<!-- ENDIF -->

| Article | Priority | Status |
|---------|----------|--------|
| API overview and authentication | P0 | |
| Getting your API key | P0 | |
| Rate limits and best practices | P1 | |
| Common API error codes | P1 | |
| Webhook setup and events | P1 | |
| Integration with [popular tool 1] | P1 | |
| Integration with [popular tool 2] | P1 | |
| Integration with [popular tool 3] | P2 | |
| Zapier / Make integration guide | P2 | |
| SDK installation and quickstart | P2 | |

### Category 6: FAQ

> Quick answers to the most common questions. Each answer is 1-3 sentences with a link to a full article.

| Question | Links To |
|----------|----------|
| What is {{PROJECT_NAME}}? | Getting Started > What is {{PROJECT_NAME}} |
| How much does it cost? | Account & Billing > Plans |
| Is there a free trial? | Account & Billing > Plans |
| Can I cancel anytime? | Account & Billing > Cancel |
| Is my data secure? | Trust/Security page |
| Do you offer refunds? | Account & Billing > Refunds |
| What browsers are supported? | Troubleshooting > Browser |
| How do I contact support? | (link to contact page) |
| Is there an API? | API & Integrations > Overview |
| Can I import my data from [competitor]? | Getting Started or Features |

---

## Content Strategy

### Writing for Scanning

Users do not read KB articles — they scan them. Optimize for scanning:

- **Use descriptive headers.** Not "Step 1" but "Step 1: Connect your account."
- **Lead with the answer.** Put the solution in the first paragraph, then explain why below.
- **Use numbered steps for procedures.** Every how-to article should be numbered steps.
- **Use bullet points for lists.** Never write a paragraph when a list will do.
- **Bold key terms.** Make important words visually distinct.
- **Include screenshots.** A screenshot reduces "where do I click?" tickets by 40%.
- **Add Loom/video recordings** for complex multi-step workflows.
- **Keep articles focused.** One article = one topic. If it covers two topics, split it into two articles.

### Search-Optimized Titles

Write titles the way users search, not the way your product team names features.

| Bad Title | Good Title |
|-----------|------------|
| SSO Configuration | How to set up single sign-on (SSO) |
| Billing Module | How to update your payment method |
| API Rate Limiting | API rate limits: how many requests can I make? |
| Data Export | How to export your data as CSV |
| Error 403 | "Access Denied" error — how to fix it |
| Workspace Settings | How to change your workspace name and settings |

**Rule:** If a user Googles their problem, would your article title match their search query? If not, rewrite the title.

### Article Quality Checklist

Before publishing any KB article, verify:

- [ ] Title is a question or "How to..." format
- [ ] First paragraph answers the question directly
- [ ] Steps are numbered and specific
- [ ] Screenshots are current and annotated (arrows, highlights)
- [ ] Related articles are linked at the bottom
- [ ] Article is tagged with the correct category
- [ ] "Last updated" date is set
- [ ] Article has been tested by someone who did not write it

---

## Article Template

Use this structure for every KB article:

```markdown
# [Descriptive Title — Written as the User Would Search]

> **Summary:** One sentence that answers the question or describes the task.

**Applies to:** [All plans / Pro and above / Enterprise only]
**Last updated:** YYYY-MM-DD

---

## [Steps / Solution / Answer]

1. Step one — what to do and where to click.
   ![Screenshot description](screenshot-url.png)
2. Step two — next action.
3. Step three — expected result.

---

## Additional Notes

- Edge case or caveat users should know.
- Platform-specific differences (web vs. mobile).

---

## Related Articles

- [Related Article 1](link)
- [Related Article 2](link)
- [Related Article 3](link)

---

## Still Need Help?

If this article did not resolve your issue, [contact our support team]({{SUPPORT_EMAIL}}).
```

---

## Maintenance Cadence

A stale knowledge base is worse than no knowledge base. Outdated articles create false confidence, then generate tickets when the instructions do not match the product.

### Ongoing (Every Feature Release)

- [ ] Update every KB article affected by the feature change
- [ ] Add new KB articles for new features
- [ ] Update screenshots that show changed UI
- [ ] Verify all links still work

### Monthly

- [ ] Review "most viewed" articles — are they accurate?
- [ ] Review "least helpful" articles (low helpfulness ratings) — rewrite or remove
- [ ] Review search queries with no results — write missing articles
- [ ] Check for duplicate articles and consolidate

### Quarterly

- [ ] Full audit: read every article, flag outdated content
- [ ] Review category structure — do new features warrant new categories?
- [ ] Analyze self-serve resolution rate trend
- [ ] Interview support agents: "What questions do users ask that the KB does not answer?"
- [ ] Review and update article template if needed
- [ ] Publish a "What's New" roundup article covering recent changes

### Annually

- [ ] Complete KB restructure review
- [ ] Archive articles for deprecated features
- [ ] Evaluate KB platform — is it still the right tool?
- [ ] Review multilingual KB strategy (if applicable)

---

## Analytics to Track

### Core Metrics

| Metric | Tool | Target | Why It Matters |
|--------|------|--------|----------------|
| Self-serve resolution rate | {{SUPPORT_PLATFORM}} | >70% | Primary measure of KB effectiveness |
| Most viewed articles (top 20) | {{SUPPORT_PLATFORM}} | Review monthly | Tells you what users struggle with most |
| Search queries with no results | {{SUPPORT_PLATFORM}} | <10% of searches | These are your content gaps — fill them |
| Article helpfulness rating | {{SUPPORT_PLATFORM}} | >80% "helpful" | Low ratings = articles need rewriting |
| Bounce rate on KB articles | Analytics | <40% | High bounce = article did not answer the question |
| Time on article | Analytics | 1-3 minutes | Too short = scanned and left; too long = confusing |
| Ticket volume trend | {{SUPPORT_PLATFORM}} | Decreasing | KB should reduce tickets over time |
| Search-to-article click rate | {{SUPPORT_PLATFORM}} | >60% | Low rate = poor search results or bad titles |

### Content Gap Detection

Track these signals to find missing KB content:

1. **Search queries with zero results** — Direct signal. Someone looked for an answer and found nothing.
2. **Repeat ticket categories** — If you answer the same question 5+ times, it needs a KB article.
3. **Support agent feedback** — Ask agents weekly: "What question did you answer most this week?"
4. **Feature launch without KB update** — Every feature shipped without a KB article is a future support ticket.
5. **Onboarding drop-off points** — Where users abandon setup flows = where KB articles are needed.

---

## Multilingual KB Strategy

<!-- IF {{PROJECT_NAME}} == "multilingual" -->
If {{PROJECT_NAME}} serves users in multiple languages, follow this strategy:
<!-- ENDIF -->

### When to Translate

- **Translate when:** >20% of users speak a non-English language, or you are expanding to a market where English is not the business language.
- **Do not translate when:** <5% of users speak another language. Focus on English KB quality first.

### Translation Priority Order

1. **Getting Started** articles — new users need onboarding in their language
2. **FAQ** articles — most viewed, highest impact
3. **Troubleshooting** articles — reduce frustrated tickets from non-English speakers
4. **Features** articles — only for the most-used features
5. **API & Integrations** — lowest priority (developers typically read English)

### Translation Approach

| Approach | Cost | Quality | Speed |
|----------|------|---------|-------|
| Professional human translation | $0.10-0.20/word | Highest | Slow (1-2 weeks) |
| AI translation + human review | $0.02-0.05/word | High | Fast (1-2 days) |
| AI translation only | ~Free | Medium | Instant |
| Community translation | Free | Variable | Unpredictable |

**Recommendation:** Use AI translation (Claude/GPT) for a first pass, then have a native speaker review for accuracy and tone. This gives you 90% of the quality at 20% of the cost.

### Multilingual Maintenance

- Every English article update must trigger a translation update
- Use translation memory tools to avoid re-translating unchanged content
- Flag translated articles as "needs review" when the English source changes
- Set a maximum staleness threshold: if a translated article is >30 days behind the English version, mark it with a "content may be outdated" banner

---

## KB Launch Checklist

Before announcing your knowledge base to users:

- [ ] Minimum 20 articles published covering the most common questions
- [ ] All Getting Started articles complete
- [ ] All Account & Billing articles complete
- [ ] Search is functional and returns relevant results
- [ ] Article helpfulness ratings are enabled
- [ ] Analytics tracking is configured
- [ ] KB is linked from: main app navigation, support widget, footer, onboarding emails
- [ ] Mobile-responsive design verified
- [ ] 3+ team members have reviewed all articles for accuracy
- [ ] "Contact support" fallback is visible on every article
- [ ] SEO metadata (title, description) is set for every article
- [ ] Custom domain configured (if applicable): {{KB_URL}}

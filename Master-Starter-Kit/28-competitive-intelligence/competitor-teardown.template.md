# Competitor Teardown: {{COMPETITOR_NAME}}

> A structured deep-dive into a single competitor. Use this template when you need to go beyond surface-level monitoring and truly understand a competitor's product, pricing, technology, growth, and strategy. Takes 2-4 hours per competitor.

---

**Project:** {{PROJECT_NAME}}
**Date:** {{DATE}}
**Analyst:** {{ANALYST}}
**Teardown Type:** Full / Update (circle one)
**Previous Teardown Date:** N/A or [date]

---

## When to Run a Teardown

- **Initial setup:** Run for your top 2-3 competitors when first populating competitive intelligence
- **Triggered by:** Win/loss data showing 30%+ losses to this competitor
- **Triggered by:** Competitor raises significant funding (>$5M)
- **Triggered by:** Competitor ships a major feature that directly competes with your core value proposition
- **Triggered by:** New competitor enters market with strong positioning
- **Scheduled:** At least once per year during the annual deep refresh

---

## 1. Company Overview

| Dimension | Details |
|-----------|---------|
| **Company Name** | {{COMPETITOR_NAME}} |
| **Website** | |
| **Founded** | |
| **Headquarters** | |
| **Team Size** | (estimate from LinkedIn company page) |
| **Total Funding** | |
| **Last Funding Round** | (amount, date, investors) |
| **Revenue Estimate** | (from pricing x review count heuristic, or public data) |
| **Key Executives** | CEO:, CTO:, VP Product:, VP Sales: |
| **Mission/Tagline** | (copy from their homepage) |
| **Target Market** | (who they sell to, based on their messaging) |
| **Product Category** | (G2/Capterra category) |

### Revenue Estimation Heuristic

If revenue is not public, estimate using available signals:

```
Method 1: Review Count Heuristic
- G2 reviews: [X]
- Estimated customers = reviews x 50-100 (typical review rate: 1-2%)
- Average plan price: $[Y]/mo
- Estimated MRR = customers x average price
- Estimated ARR = MRR x 12

Method 2: Employee Count Heuristic
- LinkedIn employees: [X]
- Revenue per employee benchmark: $100K-$300K/year (SaaS)
- Estimated ARR = employees x $150K (midpoint)

Method 3: Pricing Page + Traffic
- SimilarWeb monthly visits: [X]
- Estimated conversion rate: 1-3%
- Average plan price: $[Y]/mo
- Estimated MRR = visits x conversion rate x price

Confidence: Low / Medium / High
```

---

## 2. UX Teardown (Score: ___ / 5)

Sign up for their product using a real email. Document the full user journey.

### User Journey Documentation

| Step | Experience Description | Friction Points | Delights | Screenshot Link |
|------|----------------------|----------------|----------|----------------|
| **Landing Page** | What is the first impression? Is the value proposition clear? How long to understand what the product does? | | | [link] |
| **Sign Up** | How many fields? Social login? Email verification required? How long does it take? | | | [link] |
| **Onboarding** | Is there a product tour? Setup wizard? How many steps before value? What is the time-to-value? | | | [link] |
| **Core Feature (1st use)** | Use their primary feature. How intuitive is it? How does it compare to ours? | | | [link] |
| **Core Feature (power use)** | Try an advanced use case. How does it handle complexity? | | | [link] |
| **Navigation / IA** | How is the product organized? Can you find things? Is the information architecture logical? | | | [link] |
| **Settings / Admin** | How configurable is the product? Team management? Integrations setup? | | | [link] |
| **Billing / Upgrade** | What is the upgrade flow like? Is pricing transparent? Any dark patterns? | | | [link] |
| **Help / Support** | Is there in-app help? Knowledge base? Chat support? How fast do they respond? | | | [link] |
| **Mobile Experience** | If they have a mobile app or responsive site: how does it compare to desktop? | | | [link] |

### UX Assessment Summary

| Dimension | Score (1-5) | Notes |
|-----------|-------------|-------|
| First impression / visual design | | |
| Onboarding / time-to-value | | |
| Core feature usability | | |
| Navigation / information architecture | | |
| Performance / speed | | |
| Error handling / edge cases | | |
| Help / documentation quality | | |
| Mobile experience | | |

**Overall UX Score: ___ / 5**

**Key UX Takeaway:** [One sentence — what is their UX strength or weakness?]

---

## 3. Pricing Teardown (Score: ___ / 5)

| Tier | Price (Monthly) | Price (Annual) | Key Features Included | Usage Limits | Notes |
|------|----------------|---------------|----------------------|-------------|-------|
| Free | | N/A | | | |
| Starter / Basic | | | | | |
| Pro / Growth | | | | | |
| Business / Team | | | | | |
| Enterprise | | | | | |

### Pricing Analysis

| Question | Answer |
|----------|--------|
| What is the pricing model? (per-seat, flat, usage-based, hybrid) | |
| What is the activation metric? (what triggers a user to become a paying customer?) | |
| What features gate the upgrade from free to paid? | |
| What features gate the upgrade from paid to enterprise? | |
| Is there a free trial? How long? | |
| Is there a money-back guarantee? | |
| Do they require a credit card for the free trial? | |
| What is the annual discount percentage? | |
| Are there any hidden costs? (setup fees, overage charges, add-ons) | |
| How does their per-user cost compare to ours at 1, 10, 50, 100 users? | |

### Price Comparison at Scale

| Team Size | {{PROJECT_NAME}} Monthly Cost | {{COMPETITOR_NAME}} Monthly Cost | Difference | Who Wins? |
|-----------|------------------------------|--------------------------------|------------|-----------|
| 1 user | | | | |
| 5 users | | | | |
| 10 users | | | | |
| 25 users | | | | |
| 50 users | | | | |
| 100 users | | | | |

**Overall Pricing Score: ___ / 5**

**Key Pricing Takeaway:** [One sentence — are they cheaper, more expensive, or differently structured?]

---

## 4. Feature Teardown (Score: ___ / 5)

### Core Features

| Feature | Available? | Tier Required | Quality (1-5) | Notes / Comparison to {{PROJECT_NAME}} |
|---------|-----------|--------------|---------------|---------------------------------------|
| | | | | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |

### Advanced Features

| Feature | Available? | Tier Required | Quality (1-5) | Notes / Comparison to {{PROJECT_NAME}} |
|---------|-----------|--------------|---------------|---------------------------------------|
| | | | | |
| | | | | |
| | | | | |
| | | | | |

### Enterprise Features

| Feature | Available? | Tier Required | Quality (1-5) | Notes / Comparison to {{PROJECT_NAME}} |
|---------|-----------|--------------|---------------|---------------------------------------|
| SSO / SAML | | | | |
| RBAC | | | | |
| Audit logs | | | | |
| API access | | | | |
| Custom branding | | | | |

### Unique Features (They Have, We Do Not)

| Feature | Quality | User Demand for This | Should We Build It? | Effort Estimate |
|---------|---------|---------------------|--------------------|-----------------|
| | | | | |
| | | | | |
| | | | | |

### Features We Have That They Do Not

| Feature | Our Quality | Their Gap Severity | Marketing Opportunity? |
|---------|-------------|-------------------|----------------------|
| | | | |
| | | | |
| | | | |

**Overall Feature Score: ___ / 5**

**Key Feature Takeaway:** [One sentence — where do they lead and where do they lag?]

---

## 5. Tech Stack Teardown (Score: ___ / 5)

Sources: BuiltWith, Wappalyzer, job postings, GitHub, developer blog posts.

| Layer | Technology | Source | Notes |
|-------|-----------|--------|-------|
| **Frontend Framework** | | | |
| **CSS / UI Library** | | | |
| **Backend Language** | | | |
| **Backend Framework** | | | |
| **Database** | | | |
| **Hosting / Cloud** | | | |
| **CDN** | | | |
| **Analytics** | | | |
| **Error Tracking** | | | |
| **Payment Processing** | | | |
| **Email Provider** | | | |
| **Search** | | | |
| **Caching** | | | |
| **CI/CD** | | | |

### Performance Assessment

| Metric | Value | Rating | Source |
|--------|-------|--------|--------|
| Lighthouse Performance Score | | /100 | Chrome DevTools |
| Lighthouse Accessibility Score | | /100 | Chrome DevTools |
| Largest Contentful Paint (LCP) | | ms | PageSpeed Insights |
| First Input Delay (FID) | | ms | PageSpeed Insights |
| Cumulative Layout Shift (CLS) | | | PageSpeed Insights |
| Time to Interactive (TTI) | | ms | Chrome DevTools |
| Page size (homepage) | | KB | Chrome DevTools |
| Number of requests (homepage) | | | Chrome DevTools |

### Technical Architecture Observations

- **Strengths:** [What is their tech stack good at?]
- **Weaknesses:** [Any technical debt signals? Slow performance? Outdated tech?]
- **Implications:** [What does their stack tell us about their engineering culture and velocity?]

**Overall Tech Stack Score: ___ / 5**

**Key Tech Takeaway:** [One sentence — are they technically strong or showing debt?]

---

## 6. Growth Teardown (Score: ___ / 5)

### Traffic and Visibility

| Metric | Value | Source | Trend (Up/Down/Flat) |
|--------|-------|--------|---------------------|
| Monthly web traffic estimate | | SimilarWeb | |
| Domain authority / rating | | Ahrefs / Moz | |
| Referring domains | | Ahrefs | |
| Top traffic source | | SimilarWeb | |
| Organic search traffic % | | SimilarWeb | |
| Paid search traffic % | | SimilarWeb | |

### Social Presence

| Platform | Followers / Subscribers | Engagement Rate | Content Frequency | Notes |
|----------|------------------------|----------------|-------------------|-------|
| Twitter / X | | | | |
| LinkedIn | | | | |
| YouTube | | | | |
| Instagram | | | | |
| TikTok | | | | |
| Reddit (if official) | | | | |
| GitHub (if applicable) | | | | |

### Reviews and Reputation

| Platform | Number of Reviews | Average Rating | Trend | Notable Themes |
|----------|------------------|---------------|-------|----------------|
| G2 | | /5 | | |
| Capterra | | /5 | | |
| TrustRadius | | /5 | | |
| Product Hunt | | upvotes | | |
| App Store (if applicable) | | /5 | | |
| Play Store (if applicable) | | /5 | | |

### Growth Channels Assessment

| Channel | Investment Level | Effectiveness | Notes |
|---------|-----------------|---------------|-------|
| SEO / Content | Low / Medium / High | Low / Medium / High | |
| Paid Search | Low / Medium / High | Low / Medium / High | |
| Paid Social | Low / Medium / High | Low / Medium / High | |
| Social Media (organic) | Low / Medium / High | Low / Medium / High | |
| Email Marketing | Low / Medium / High | Low / Medium / High | |
| Partnerships | Low / Medium / High | Low / Medium / High | |
| Community / Word of Mouth | Low / Medium / High | Low / Medium / High | |
| Product Hunt / Directories | Low / Medium / High | Low / Medium / High | |

**Overall Growth Score: ___ / 5**

**Key Growth Takeaway:** [One sentence — how are they growing and is it working?]

---

## 7. Strategy Assessment

### SWOT Analysis

| | Positive | Negative |
|---|---------|---------|
| **Internal** | **Strengths:** | **Weaknesses:** |
| | 1. | 1. |
| | 2. | 2. |
| | 3. | 3. |
| **External** | **Opportunities (for them):** | **Threats (to them):** |
| | 1. | 1. |
| | 2. | 2. |
| | 3. | 3. |

### Strategic Direction Assessment

| Question | Assessment |
|----------|-----------|
| Where are they heading? (based on features, hiring, messaging) | |
| What market segment are they doubling down on? | |
| What are they de-prioritizing? | |
| What would they need to beat us? | |
| What is their likely next major move? | |
| What is their biggest vulnerability? | |

---

## 8. Overall Scorecard

| Dimension | Score (1-5) | Weight | Weighted Score |
|-----------|-------------|--------|---------------|
| UX / Product Quality | | 25% | |
| Pricing / Value | | 20% | |
| Features / Capability | | 25% | |
| Tech Stack / Performance | | 10% | |
| Growth / Market Presence | | 20% | |
| **Overall** | | **100%** | **___ / 5.0** |

---

## 9. Key Takeaways

### Their Biggest Strength We Should Learn From
> [One paragraph — what are they doing well that we should consider adopting or learning from? Be honest.]

### Their Biggest Weakness We Should Exploit
> [One paragraph — where is their product, pricing, or experience genuinely weak? How can we position against this?]

### Strategic Insight for {{PROJECT_NAME}}
> [One paragraph — what does this teardown tell us about our own strategy? What should we do differently?]

---

## 10. Action Items from This Teardown

| Action | Priority | Owner | Deadline | Status |
|--------|----------|-------|----------|--------|
| | | | | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |

---

## Teardown History

| Date | Analyst | Type | Key Finding | Action Taken |
|------|---------|------|-------------|-------------|
| {{DATE}} | {{ANALYST}} | Full | | |
| | | | | |
| | | | | |

---

## Appendix: Evidence Links

Store screenshots, recordings, and source links here for reference.

| Evidence | Type | URL / Location | Date Captured |
|----------|------|---------------|---------------|
| Homepage screenshot | Screenshot | | |
| Pricing page screenshot | Screenshot | | |
| Onboarding recording | Video | | |
| Feature comparison notes | Notes | | |
| BuiltWith report | Report | | |
| G2 profile | Link | | |
| LinkedIn company page | Link | | |
| Crunchbase profile | Link | | |

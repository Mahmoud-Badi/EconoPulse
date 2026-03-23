# CRM Setup & Configuration Guide for {{PROJECT_NAME}}

> **Project:** {{PROJECT_NAME}}
> **Product Type:** {{PRODUCT_TYPE}}
> **Stage:** {{CURRENT_STAGE}}
> **Date:** {{DATE}}

---

## What Is a CRM and Why You Need One

A CRM (Customer Relationship Management) system is a centralized database that tracks every interaction between your business and your leads, prospects, and customers. It is not just a contact list — it is the single source of truth for your revenue pipeline.

### Why You Need a CRM Even as a Solo Founder

- **Memory is unreliable.** You will forget who emailed you three weeks ago. A CRM will not.
- **Patterns emerge from data.** Knowing that 40% of your conversions come from Twitter DMs changes your strategy.
- **Handoff readiness.** When you hire your first salesperson or marketer, they inherit a clean system, not a mess of sticky notes.
- **Automation requires structure.** You cannot automate follow-ups, scoring, or nurture sequences without organized contact data.
- **Investor credibility.** Being able to show pipeline metrics, conversion rates, and growth trends signals maturity.

Even if your "CRM" starts as a spreadsheet, the discipline of recording every interaction pays dividends from day one.

---

## CRM Selection Guide by Stage and Budget

### Free Tier ($0/month)

| Tool | Best For | Limitations |
|------|----------|-------------|
| **HubSpot CRM (Free)** | Best free option overall — unlimited contacts, deal tracking, email integration, forms, live chat | Limited automation (only simple sequences), reporting caps |
| **Notion** | Flexible database for early-stage tracking, customizable views and fields | No native email integration, no pipeline automation, manual effort |
| **Google Sheets** | Absolute minimum viable CRM, zero learning curve | No automation, no integrations, breaks at 200+ contacts |

**Recommendation for {{PROJECT_NAME}}:** Start with HubSpot CRM Free. It costs nothing and gives you a real pipeline, email tracking, and forms. You will outgrow Notion and spreadsheets faster than you think.

### Small Budget ($15-50/month)

| Tool | Price | Best For |
|------|-------|----------|
| **Pipedrive** | $15/mo | Visual pipeline management, sales-focused teams, simple and clean UI |
| **Folk** | $20/mo | Relationship-first CRM, great for networking-heavy businesses, clean UX |
| **Close** | $29/mo | Built-in calling and SMS, aggressive outbound sales workflows |

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
**SaaS Recommendation:** Pipedrive or Close for outbound-heavy, HubSpot Free for inbound-heavy.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
**Marketplace Recommendation:** Folk for managing relationships with both supply and demand sides.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "e-commerce" -->
**E-commerce Recommendation:** HubSpot Free with Shopify integration, or Pipedrive for B2B wholesale.
<!-- ENDIF -->

### Medium Budget ($50-300/month)

| Tool | Price | Best For |
|------|-------|----------|
| **HubSpot Sales Hub Starter** | $50/mo | Full marketing + sales alignment, growing teams, inbound-first companies |
| **Salesforce Essentials** | $25/user/mo | Enterprise-grade features at smaller scale, massive integration ecosystem |

### Enterprise ($300+/month)

| Tool | Price | Best For |
|------|-------|----------|
| **Salesforce Professional+** | $80+/user/mo | Complex sales processes, large teams, custom objects, advanced reporting |
| **HubSpot Enterprise** | $1,200+/mo | Full inbound marketing + sales + service platform, attribution reporting |

---

## CRM Setup Checklist

### Step 1: Contact Properties

Configure these standard properties for every contact:

**Required Properties:**

| Property | Type | Purpose |
|----------|------|---------|
| First Name | Text | Personalization |
| Last Name | Text | Personalization |
| Email | Email | Primary identifier and communication |
| Phone | Phone | Sales outreach |
| Company | Text | Account association |
| Job Title / Role | Text | Decision-maker identification |
| Lead Source | Dropdown | Attribution (organic, paid, referral, direct, social, event) |
| Lifecycle Stage | Dropdown | Where they are in your funnel |
| Lead Status | Dropdown | Sales qualification status |
| Date Created | Date (auto) | Tracking acquisition timing |

**Custom Properties for {{PROJECT_NAME}}:**

| Property | Type | Values / Purpose |
|----------|------|------------------|
| Product Interest | Dropdown | {{PRODUCT_FEATURES}} — which feature drew them in |
| Plan Interest | Dropdown | Free, Starter, Pro, Enterprise — based on {{MONETIZATION_MODEL}} |
| Feature Interest | Multi-checkbox | Specific features they have expressed interest in |
| Use Case | Dropdown | Primary problem they are trying to solve |
| Referral Source Detail | Text | Specific referral (e.g., "John Smith", "ProductHunt launch") |
| Trial Start Date | Date | When free trial began |
| Trial End Date | Date | When trial expires |
| NPS Score | Number | Latest Net Promoter Score |

### Step 2: Company Properties

| Property | Type | Purpose |
|----------|------|---------|
| Company Name | Text | Account identification |
| Company Size | Dropdown | 1-10, 11-50, 51-200, 201-1000, 1000+ |
| Industry | Dropdown | Vertical market segment |
| Annual Revenue | Currency | Budget qualification |
| Website | URL | Research and enrichment |
| Total Deal Value | Currency (calculated) | Sum of all deals with this company |
| Number of Contacts | Number (calculated) | How many people you know there |
| Account Status | Dropdown | Prospect, Customer, Churned, Partner |

### Step 3: Pipeline Stages

Configure your primary sales pipeline with these stages:

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────┐   ┌──────────────┐   ┌───────────┐
│   Lead   │ → │   MQL    │ → │   SQL    │ → │Opportunity│ → │ Negotiation  │ → │  Closed Won  │   │Closed Lost│
│          │   │          │   │          │   │          │   │              │   │              │   │           │
│ Score<30 │   │Score 30+ │   │Score 60+ │   │Demo/Trial│   │Proposal Sent │   │  Customer!   │   │  Lost :(  │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────────┘   └──────────────┘   └───────────┘
```

**Stage Definitions:**

| Stage | Entry Criteria | Exit Criteria | Probability |
|-------|---------------|---------------|-------------|
| Lead | Any new contact enters the system | Lead score reaches 30+ or qualifies manually | 5% |
| MQL (Marketing Qualified) | Engaged with marketing content, fits ICP loosely | Sales reviews and accepts, schedules call | 15% |
| SQL (Sales Qualified) | Discovery call completed, confirmed fit and interest | Demo scheduled or trial started | 30% |
| Opportunity | Demo completed or trial active, expressed buying intent | Proposal/pricing sent | 50% |
| Negotiation | Pricing discussed, terms being negotiated | Verbal agreement or rejection | 75% |
| Closed Won | Contract signed, payment received | N/A — deal is complete | 100% |
| Closed Lost | Rejected, went silent, chose competitor | N/A — document reason and move on | 0% |

### Step 4: Deal Properties

| Property | Type | Purpose |
|----------|------|---------|
| Deal Name | Text | Descriptive (e.g., "Acme Corp — Pro Plan Annual") |
| Deal Value | Currency | Expected revenue from this deal |
| Expected Close Date | Date | When you anticipate closing |
| Deal Probability | Percentage | Likelihood of closing (auto from stage or manual override) |
| Deal Source | Dropdown | How this deal originated (inbound, outbound, referral, partner) |
| Close Lost Reason | Dropdown | Budget, timing, competitor, feature gap, no response |
| Competitor | Text | Who you lost to (if applicable) |
| Contract Length | Dropdown | Monthly, Annual, Multi-year |
| Discount Applied | Percentage | For tracking discounting patterns |

---

## Data Import Guide

### Importing Existing Contacts

**From a Spreadsheet:**
1. Export your current data to CSV format.
2. Map columns to CRM fields (first name, last name, email, company, etc.).
3. Clean data before import: remove duplicates, standardize formatting, validate emails.
4. Import in batches of 500-1000 to catch errors early.
5. Verify import: spot-check 10-20 random records for accuracy.

**From Email (Gmail/Outlook):**
1. Connect email account to CRM (most CRMs offer native integration).
2. Enable automatic contact creation for new email addresses.
3. Sync historical emails to populate contact timelines.
4. Set rules: exclude personal emails, internal team emails, newsletters.

**From Other Tools:**
1. Export from old tool (CSV or API).
2. Map fields between old and new system.
3. Pay attention to custom fields — they often get lost in migration.
4. Migrate deals/opportunities separately from contacts.
5. Verify pipeline totals match after import.

---

## Integration Setup

### Essential Integrations for {{PROJECT_NAME}}

| Integration | Purpose | Priority |
|------------|---------|----------|
| Email (Gmail/Outlook) | Auto-log emails, send from CRM, track opens | Critical |
| Calendar (Google/Outlook) | Meeting scheduling, activity tracking | Critical |
| Website Forms | Auto-create contacts from form submissions | Critical |
| Analytics (GA4) | See which pages contacts visited before converting | High |
| Payment Processor (Stripe) | Auto-update deal status on payment | High |
| Support Tool (Intercom/Zendesk) | See support history in CRM | Medium |
| Social Media | Track social interactions with contacts | Low |

### Email Integration Setup
1. Connect your business email account (never use personal email).
2. Enable two-way sync so sent/received emails appear in CRM.
3. Set up email tracking (open and click notifications).
4. Create email templates for common outreach (intro, follow-up, proposal).
5. Test: send yourself a test email and verify it appears in CRM.

### Website Form Integration
1. Create forms in CRM or use embedded forms on your website.
2. Map form fields to contact properties.
3. Set automation: form submission creates contact + triggers welcome email.
4. Test every form with a test submission before going live.

---

## Automation Basics

### Lead Assignment Rules
- **Round-robin:** Distribute leads evenly across sales team members.
- **Territory-based:** Assign by geography, industry, or company size.
- **Score-based:** High-score leads go to senior reps; low-score to nurture sequences.

### Follow-Up Reminders
- Create tasks automatically when a deal enters a new stage.
- Set reminders: follow up 2 days after sending a proposal, 7 days after no response.
- Escalate: if no follow-up within SLA, notify manager.

### Stage Movement Triggers
- Contact opens pricing email → move to "Interested" status.
- Contact requests demo → create deal, assign to sales rep.
- Deal inactive for 14 days → send re-engagement email, notify rep.
- Payment received → move to "Closed Won", trigger onboarding workflow.

---

## Contact Lifecycle Stages

```
Subscriber → Lead → MQL → SQL → Opportunity → Customer → Evangelist
```

| Stage | Definition | Trigger to Advance |
|-------|-----------|-------------------|
| **Subscriber** | Signed up for newsletter or content only | Engages with product-related content |
| **Lead** | Showed initial interest (visited site, downloaded resource) | Lead score reaches MQL threshold |
| **MQL** | Marketing Qualified — engages consistently, fits ICP | Sales accepts and schedules contact |
| **SQL** | Sales Qualified — confirmed need, budget, timeline | Demo/trial started |
| **Opportunity** | Active deal in pipeline with defined value | Proposal accepted or payment made |
| **Customer** | Paying customer | Renews, expands, or refers |
| **Evangelist** | Active promoter — refers others, leaves reviews, case study | Ongoing program membership |

---

## CRM Hygiene

### Duplicate Management
- Run duplicate check monthly (most CRMs have built-in dedup tools).
- Merge strategy: keep the record with more data, combine notes.
- Prevention: set dedup rules on import (match by email address).

### Data Cleanup Schedule

| Frequency | Task |
|-----------|------|
| Weekly | Review new contacts for completeness, update deal stages |
| Monthly | Deduplicate contacts, clean bounced emails, update lifecycle stages |
| Quarterly | Audit custom properties (still relevant?), review pipeline stage definitions, archive old deals |
| Annually | Major cleanup — remove contacts with no engagement in 12 months, review all automations |

### Data Enrichment
- Use tools like Clearbit, Apollo, or Hunter.io to auto-fill company and contact data.
- Enrich on creation: when a new contact is added, auto-fill company size, industry, LinkedIn.
- Manual enrichment: before a sales call, research and update the contact record.

---

## Reporting

### Pipeline Dashboard (Review Weekly)

| Metric | Current | Last Week | Target |
|--------|---------|-----------|--------|
| Total Pipeline Value | $____ | $____ | $____ |
| Number of Open Deals | ____ | ____ | ____ |
| Deals Created This Week | ____ | ____ | ____ |
| Deals Won This Week | ____ | ____ | ____ |
| Deals Lost This Week | ____ | ____ | ____ |
| Average Deal Value | $____ | $____ | $____ |
| Win Rate | ___% | ___% | ___% |
| Average Sales Cycle (days) | ____ | ____ | ____ |

### Conversion Rate Report

| Stage Transition | Rate | Target |
|-----------------|------|--------|
| Lead → MQL | ___% | 20-30% |
| MQL → SQL | ___% | 30-50% |
| SQL → Opportunity | ___% | 50-70% |
| Opportunity → Won | ___% | 20-40% |
| Overall Lead → Won | ___% | 2-5% |

### Revenue Forecast

| Month | Weighted Pipeline | Closed Revenue | Forecast Accuracy |
|-------|------------------|----------------|-------------------|
| {{MONTH_1}} | $____ | $____ | ___% |
| {{MONTH_2}} | $____ | $____ | ___% |
| {{MONTH_3}} | $____ | $____ | ___% |

---

## CRM Configuration Plan for {{PROJECT_NAME}}

### Phase 1: Foundation (Week 1)
- [ ] Select CRM tool: ____________________
- [ ] Create account and configure basic settings
- [ ] Set up contact properties (standard + custom for {{PROJECT_NAME}})
- [ ] Set up company properties
- [ ] Configure pipeline stages based on {{MONETIZATION_MODEL}}
- [ ] Connect email account
- [ ] Import existing contacts (if any)

### Phase 2: Integration (Week 2)
- [ ] Connect website forms to CRM
- [ ] Set up analytics integration (GA4 → CRM)
- [ ] Connect payment processor (if applicable)
- [ ] Set up calendar integration
- [ ] Create email templates (welcome, follow-up, proposal)

### Phase 3: Automation (Week 3)
- [ ] Configure lead assignment rules
- [ ] Set up follow-up reminders
- [ ] Create stage movement triggers
- [ ] Set up basic lead scoring (see lead-scoring.template.md)
- [ ] Configure notification rules for team

### Phase 4: Reporting (Week 4)
- [ ] Build pipeline dashboard
- [ ] Create conversion rate report
- [ ] Set up weekly email report
- [ ] Schedule first pipeline review meeting
- [ ] Document CRM usage guidelines for team

### CRM Tool Decision for {{PROJECT_NAME}}

**Selected Tool:** ____________________
**Reason:** ____________________
**Monthly Cost:** $____
**Users:** ____
**Key Integrations Needed:** ____________________

---

*This guide is part of the {{PROJECT_NAME}} Master Starter Kit — Marketing section.*
*Last updated: {{DATE}}*

# Lead Scoring Model for {{PROJECT_NAME}}

> **Project:** {{PROJECT_NAME}}
> **Product Type:** {{PRODUCT_TYPE}}
> **Target Audience:** {{TARGET_AUDIENCE}}
> **Date:** {{DATE}}

---

## What Is Lead Scoring?

Lead scoring is a methodology for assigning a numerical value to each lead based on two factors: how well they match your ideal customer profile (fit) and how engaged they are with your marketing and product (behavior). The combined score tells you which leads are most likely to become customers and deserve immediate attention.

**Without lead scoring:**
- Sales wastes time on unqualified leads.
- Hot leads go cold because nobody followed up.
- Marketing cannot tell which campaigns generate quality leads vs. noise.
- You treat every signup the same, which means you optimize for nobody.

**With lead scoring:**
- Sales focuses on leads most likely to close.
- Automations trigger at the right moment (not too early, not too late).
- Marketing and sales align on what "qualified" actually means.
- You can calculate true cost per qualified lead, not just cost per signup.

---

## Two Dimensions of Lead Scoring

Lead scoring is not one-dimensional. A lead who perfectly matches your ICP but has never visited your site is not the same as a highly engaged visitor from a completely wrong industry. You need both dimensions.

### Dimension 1: Fit Score (Demographic/Firmographic)

Fit score measures how closely a lead matches your ideal customer profile. This is based on WHO they are, not what they have done.

**Fit Criteria for {{PROJECT_NAME}}:**

| Criteria | Data Point | Points | Rationale |
|----------|-----------|--------|-----------|
| **Company Size** | | | |
| Ideal size ({{IDEAL_COMPANY_SIZE}}) | 11-200 employees | +15 | Sweet spot for {{PROJECT_NAME}} |
| Acceptable size | 1-10 or 201-1000 | +5 | Can still be a good fit |
| Too large or too small | 1000+ or unknown | +0 | Low conversion probability |
| **Industry** | | | |
| Primary target industry | {{PRIMARY_INDUSTRY}} | +15 | Highest conversion rate historically |
| Secondary target industry | {{SECONDARY_INDUSTRY}} | +10 | Good fit, slightly lower conversion |
| Neutral industry | Other B2B | +5 | Could work but not proven |
| Poor fit industry | Government, academia | +0 | Very low conversion probability |
| **Job Title / Role** | | | |
| Decision maker | CEO, CTO, VP, Director, Head of | +20 | Can approve purchase |
| Influencer | Manager, Lead, Senior | +10 | Can champion internally |
| End user | Individual contributor | +5 | Can drive bottom-up adoption |
| Irrelevant role | Student, intern, unrelated dept | +0 | Unlikely to convert |
| **Geography** | | | |
| Primary market | {{PRIMARY_MARKET}} | +10 | Full product support, local pricing |
| Secondary market | {{SECONDARY_MARKET}} | +5 | Partial support |
| Unsupported market | Regions without product support | +0 | Cannot serve effectively |
| **Budget Indicator** | | | |
| Stated budget matches pricing | Matches {{PRICING_TIER}} | +10 | Can afford the product |
| Budget unclear | Not stated | +0 | Unknown |
| Budget too low | Stated below minimum plan | -5 | Unlikely to convert to paid |

**Maximum Fit Score: 70 points**

### Dimension 2: Behavior Score (Engagement)

Behavior score measures how interested and engaged a lead is based on their ACTIONS — what they have done with your marketing, website, and product.

**Behavior Criteria for {{PROJECT_NAME}}:**

| Action | Points | Decay | Rationale |
|--------|--------|-------|-----------|
| **Website Activity** | | | |
| Website visit (any page) | +1 | Per visit, max 5/week | Shows awareness |
| Pricing page visit | +10 | Per visit | High purchase intent |
| Feature/product page visit | +5 | Per visit | Evaluating solution |
| Blog/resource page visit | +2 | Per visit | Learning, early stage |
| Comparison page visit | +8 | Per visit | Actively evaluating options |
| **Email Engagement** | | | |
| Email opened | +1 | Per open | Minimal engagement |
| Email link clicked | +3 | Per click | Active engagement |
| Replied to email | +10 | Per reply | Very high engagement |
| Unsubscribed from email | -10 | One-time | Disengagement signal |
| Email bounced | -5 | One-time | Bad data |
| **Content Engagement** | | | |
| Downloaded lead magnet/resource | +5 | Per download | Exchanged info for content |
| Watched webinar/video | +7 | Per event | Invested significant time |
| Read case study | +5 | Per read | Evaluating credibility |
| Shared content on social | +5 | Per share | Advocacy signal |
| **High-Intent Actions** | | | |
| Requested demo | +25 | One-time | Explicit buying signal |
| Started free trial | +20 | One-time | Hands-on evaluation |
| Contacted sales/support | +15 | Per contact | Active engagement |
| Attended live event | +10 | Per event | Invested time |
| Returned after 7+ days of inactivity | +5 | Per return | Re-engagement |
| **Product Usage (if trial/freemium)** | | | |
| Completed onboarding | +15 | One-time | Invested in setup |
| Used core feature | +10 | Per use, max 3/week | Finding value |
| Invited team member | +15 | Per invite | Expansion signal |
| Created project/data | +10 | One-time | Invested content/data |
| Hit usage limit | +10 | One-time | Power user, upsell candidate |
| **Negative Signals** | | | |
| No activity for 14 days | -5 | Per 14-day period | Losing interest |
| No activity for 30 days | -10 | Per 30-day period | Likely disengaged |
| Marked email as spam | -25 | One-time | Severe disengagement |
| Visited careers page (not customer) | -10 | One-time | Probably a job seeker |

**Maximum Behavior Score: Uncapped (but practically 0-100 range)**

---

## Combined Scoring Model

The total lead score combines Fit + Behavior to create a comprehensive picture:

```
Total Lead Score = Fit Score + Behavior Score
```

### Score Interpretation Matrix

|  | **High Fit (50-70)** | **Medium Fit (25-49)** | **Low Fit (0-24)** |
|---|---|---|---|
| **High Behavior (60+)** | **A-Lead: Immediate sales outreach** — perfect match and very engaged | **B-Lead: Sales outreach** — engaged but may not be ideal fit, worth qualifying | **C-Lead: Monitor** — engaged but wrong profile, could be an edge case |
| **Medium Behavior (30-59)** | **B-Lead: Nurture aggressively** — great fit, needs more engagement | **C-Lead: Standard nurture** — moderate fit and engagement | **D-Lead: Low-effort nurture** — unlikely to convert |
| **Low Behavior (0-29)** | **C-Lead: Long-term nurture** — great fit but not ready yet | **D-Lead: Newsletter only** — maintain awareness, low investment | **F-Lead: Deprioritize** — wrong fit and not engaged |

---

## Score Thresholds and Actions

| Score Range | Classification | CRM Status | Automated Action |
|-------------|---------------|------------|-----------------|
| **0-29** | Cold | Lead | Monthly newsletter, educational content only |
| **30-59** | Warm (MQL) | Marketing Qualified Lead | Enter nurture sequence, increase email frequency, retarget |
| **60-89** | Hot (SQL) | Sales Qualified Lead | Alert sales rep, schedule outreach within 24 hours |
| **90+** | Sales-Ready | Opportunity | Immediate sales action, personal email or call within 4 hours |

### Threshold Configuration for {{PROJECT_NAME}}

```
MQL Threshold:  30 points  (adjustable after first 90 days of data)
SQL Threshold:  60 points  (adjustable after first 90 days of data)
Sales-Ready:    90 points  (adjustable after first 90 days of data)
```

**How to adjust thresholds:**
- If sales says too many unqualified leads: raise MQL threshold by 10.
- If pipeline is too thin: lower MQL threshold by 10.
- Review conversion rates by score range quarterly and calibrate.

---

## MQL to SQL Handoff Process

The handoff from marketing to sales is where most leads die. Define a clear process:

### Handoff Criteria
A lead becomes SQL when:
- Lead score reaches 60+ (combined fit + behavior), OR
- Lead explicitly requests a demo or sales contact, OR
- Lead starts a trial AND matches ICP (fit score 40+)

### Handoff Process

```
[Lead reaches SQL threshold]
      │
      ▼
[CRM: Update lifecycle to "SQL"]
[CRM: Assign to sales rep (round-robin or territory)]
[Automation: Send notification to assigned rep]
  Notification includes: lead score, fit details, key behaviors, recent activity
      │
      ▼
[Sales SLA: Follow up within {{SALES_SLA_HOURS}} hours]
  Default: 4 hours during business hours, next morning if after hours
      │
      ▼
[Sales actions:]
  1. Review lead profile and activity in CRM
  2. Send personalized email (not a template)
  3. Attempt call if phone number available
  4. Log all activity in CRM
      │
      ▼
[Within 48 hours: Sales accepts or rejects]
  Accept → Move to "Opportunity" stage
  Reject → Document reason, return to marketing for further nurture
```

### SLA Agreement Between Marketing and Sales

| Commitment | Owner | Metric |
|-----------|-------|--------|
| Deliver X SQLs per month | Marketing | SQL volume |
| SQL meets minimum quality criteria | Marketing | SQL acceptance rate (target: 70%+) |
| Follow up within {{SALES_SLA_HOURS}} hours | Sales | Response time |
| Log outcome for every SQL | Sales | Disposition rate (target: 100%) |
| Provide feedback on lead quality weekly | Sales | Qualitative feedback |

---

## Lead Scoring Tools

### Built-In CRM Scoring

| Tool | Scoring Capability | Notes |
|------|-------------------|-------|
| **HubSpot** | Built-in scoring with fit + behavior criteria | Free tier has manual scoring; paid has predictive |
| **Salesforce** | Einstein Lead Scoring (AI-powered) on higher tiers | Requires Sales Cloud, data-hungry for AI scoring |
| **Pipedrive** | Basic scoring via custom fields and automations | Not as sophisticated, but workable for small teams |
| **ActiveCampaign** | Contact scoring built into automation builder | Good for email-behavior-based scoring |

### Manual Scoring (Spreadsheet)

If you are pre-CRM or want to validate your model before implementing:

```
Score = SUM(
  IF(company_size = ideal, 15, IF(company_size = acceptable, 5, 0)),
  IF(industry = primary, 15, IF(industry = secondary, 10, 0)),
  IF(role = decision_maker, 20, IF(role = influencer, 10, 0)),
  IF(geography = primary, 10, IF(geography = secondary, 5, 0)),
  website_visits * 1,
  pricing_page_visits * 10,
  email_clicks * 3,
  demo_requests * 25,
  trial_signups * 20,
  IF(days_inactive > 30, -10, IF(days_inactive > 14, -5, 0))
)
```

---

## Predictive Lead Scoring

When you have enough data (typically 1000+ converted leads), you can layer AI/ML-based predictive scoring on top of your manual model:

**What predictive scoring does:**
- Analyzes patterns in your historical data to find which attributes correlate with conversion.
- Discovers non-obvious signals (e.g., leads from .edu domains who visit the API docs page convert 3x better).
- Continuously learns and adjusts as more data comes in.

**When to consider it:**
- You have 6+ months of CRM data with clear won/lost outcomes.
- Your manual model has been running for at least one quarter.
- You have 500+ leads per month flowing through the system.

**Tools for predictive scoring:**
- HubSpot Predictive Scoring (Enterprise tier)
- Salesforce Einstein Lead Scoring
- MadKudu (standalone predictive scoring)
- Custom ML model (if you have data science resources)

**For {{PROJECT_NAME}} right now:** Start with manual scoring. Move to predictive when you have 6+ months of conversion data.

---

## Iterating the Model

Your initial scoring model is a hypothesis. You MUST iterate based on real data.

### Quarterly Review Process

**Step 1: Pull data**
- Export all leads from the quarter with their scores at time of conversion (or loss).
- Group by outcome: converted to customer, lost, still in pipeline.

**Step 2: Analyze score accuracy**
- What was the average score of leads who converted? (Should be high — if not, your model is broken.)
- What was the average score of leads who churned or were lost? (Should be lower.)
- Are there leads who scored low but converted? (Your model is missing something.)
- Are there leads who scored high but never converted? (Your model overvalues something.)

**Step 3: Adjust weights**
- Increase points for criteria that correlate with actual conversion.
- Decrease points for criteria that do not predict conversion.
- Add new criteria if you discover new patterns.
- Remove criteria that add noise without predictive value.

**Step 4: Update thresholds**
- If MQL acceptance rate is below 50%, raise the MQL threshold.
- If sales is starved for leads, lower the threshold.
- Target: 60-80% of MQLs should be accepted as SQLs.

**Step 5: Document changes**
- Record what changed and why.
- Communicate to both marketing and sales teams.
- Monitor the impact over the next quarter.

### Score Decay

Scores should decay over time. A lead who was very active 6 months ago but has gone silent is not the same as someone active today.

| Inactivity Period | Score Adjustment |
|-------------------|-----------------|
| 14 days no activity | -5 points |
| 30 days no activity | -10 points |
| 60 days no activity | -15 points |
| 90 days no activity | Reset behavior score to 0 (keep fit score) |

---

## Lead Scoring Model for {{PROJECT_NAME}}

### Customized Fit Criteria

| Criteria | Best Match (Max Points) | Your Value | Points |
|----------|------------------------|------------|--------|
| Company Size | {{IDEAL_COMPANY_SIZE}} | __________ | /15 |
| Industry | {{PRIMARY_INDUSTRY}} | __________ | /15 |
| Role/Title | Decision Maker | __________ | /20 |
| Geography | {{PRIMARY_MARKET}} | __________ | /10 |
| Budget | Matches {{PRICING_TIER}} | __________ | /10 |
| **Total Fit Score** | | | **/70** |

### Customized Behavior Criteria

| Action | Points | Relevant to {{PROJECT_NAME}}? | Adjusted Points |
|--------|--------|------------------------------|-----------------|
| Website visit | +1 | Yes / No | _______ |
| Pricing page visit | +10 | Yes / No | _______ |
| Blog visit | +2 | Yes / No | _______ |
| Email open | +1 | Yes / No | _______ |
| Email click | +3 | Yes / No | _______ |
| Resource download | +5 | Yes / No | _______ |
| Demo request | +25 | Yes / No | _______ |
| Trial signup | +20 | Yes / No | _______ |
| Core feature used | +10 | Yes / No | _______ |
| Team member invited | +15 | Yes / No | _______ |
| Webinar attended | +7 | Yes / No | _______ |
| Social share | +5 | Yes / No | _______ |

### Custom Actions for {{PROJECT_NAME}}

Add product-specific scoring actions here:

| Action | Points | Rationale |
|--------|--------|-----------|
| _________________________ | +____ | _________________________ |
| _________________________ | +____ | _________________________ |
| _________________________ | +____ | _________________________ |
| _________________________ | +____ | _________________________ |
| _________________________ | +____ | _________________________ |

### Thresholds for {{PROJECT_NAME}}

| Threshold | Score | Action |
|-----------|-------|--------|
| Cold → Warm (MQL) | ____ points | Enter nurture sequence, increase touchpoints |
| Warm → Hot (SQL) | ____ points | Alert sales, outreach within ____ hours |
| Hot → Sales-Ready | ____ points | Immediate personal contact, priority handling |

### Implementation Checklist

- [ ] Define ICP criteria and assign fit scores
- [ ] List all trackable user actions and assign behavior scores
- [ ] Set initial thresholds (start with recommended: 30 / 60 / 90)
- [ ] Configure scoring in CRM tool (or build spreadsheet model)
- [ ] Set up automated notifications for threshold crossings
- [ ] Define MQL → SQL handoff process and SLA
- [ ] Communicate model to sales team
- [ ] Schedule first quarterly review date: ____________________
- [ ] Document scoring model in team wiki/docs

---

*This lead scoring model is part of the {{PROJECT_NAME}} Master Starter Kit — Marketing section.*
*Last updated: {{DATE}}*

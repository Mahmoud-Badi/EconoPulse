# Unified Metrics Registry — Delta TMS V3 (Example)

> **This is a filled-in example from the Delta TMS V3 project.** It demonstrates how the metrics registry template looks when resolved for a real SaaS product. Do not copy this into your project — generate fresh content from the template during Step 28.7.

---

## Registry Metadata

| Field | Value |
|-------|-------|
| Project | Delta TMS V3 |
| BI Maturity Level | Governed |
| BI Warehouse | PostgreSQL (analytics schema) |
| BI Platform | Metabase |
| BI ETL Tool | Custom (pg_dump + dbt) |
| Total Metrics | 47 |
| Last Reviewed | 2026-01-15 |
| Registry Owner | Data Team (Marcus Chen) |

---

## Revenue & Growth

| Metric | Definition | Formula | Source System | Warehouse Table | Dashboard | Owner | Target | Alert Threshold |
|--------|-----------|---------|--------------|-----------------|-----------|-------|--------|-----------------|
| Monthly Recurring Revenue (MRR) | Total recurring subscription revenue normalized to monthly | SUM(active_subscriptions.monthly_amount) | Stripe API | analytics.mrr_movements | Executive > Revenue | Finance | $85K by Q2 | Red: decline >5% MoM |
| Annual Recurring Revenue (ARR) | MRR annualized | MRR × 12 | Derived | analytics.mrr_movements | Executive > Revenue | Finance | $1M by EOY | Red: decline >5% |
| MRR Growth Rate | Month-over-month MRR change | (Current MRR - Previous MRR) / Previous MRR × 100 | Derived | analytics.mrr_movements | Executive > Revenue | Finance | >8% MoM | Yellow: <5%, Red: <0% |
| New MRR | Revenue from new customers in period | SUM(mrr_movements WHERE type = 'new') | Stripe API | analytics.mrr_movements | Revenue Waterfall | Sales | >$8K/mo | Yellow: <$5K |
| Expansion MRR | Revenue increase from existing customers | SUM(mrr_movements WHERE type = 'expansion') | Stripe API | analytics.mrr_movements | Revenue Waterfall | CS | >$3K/mo | Yellow: <$1K |
| Contraction MRR | Revenue decrease from downgrades | SUM(mrr_movements WHERE type = 'contraction') | Stripe API | analytics.mrr_movements | Revenue Waterfall | CS | <$1K/mo | Red: >$3K |
| Churned MRR | Revenue lost from cancellations | SUM(mrr_movements WHERE type = 'churn') | Stripe API | analytics.mrr_movements | Revenue Waterfall | CS | <$2K/mo | Red: >$5K |
| Quick Ratio | Growth efficiency | (New MRR + Expansion MRR) / (Contraction MRR + Churned MRR) | Derived | analytics.mrr_movements | Executive > Revenue | Finance | >4.0 | Yellow: <3.0, Red: <2.0 |

---

## Unit Economics

| Metric | Definition | Formula | Source System | Warehouse Table | Dashboard | Owner | Target | Alert Threshold |
|--------|-----------|---------|--------------|-----------------|-----------|-------|--------|-----------------|
| Customer Acquisition Cost (CAC) | Blended cost to acquire one customer | (Marketing Spend + Sales Spend) / New Customers | Stripe + Google Ads + HubSpot | analytics.unit_economics | Executive > Unit Economics | Marketing | <$200 | Yellow: >$250, Red: >$400 |
| Lifetime Value (LTV) | Expected total revenue from a customer | ARPU × (1 / Monthly Churn Rate) | Derived | analytics.unit_economics | Executive > Unit Economics | Finance | >$2,400 | Yellow: <$1,500 |
| LTV:CAC Ratio | Unit economics efficiency | LTV / CAC | Derived | analytics.unit_economics | Executive > Unit Economics | Finance | >3:1 | Yellow: <3:1, Red: <1:1 |
| CAC Payback Period | Months to recover acquisition cost | CAC / (ARPU × Gross Margin) | Derived | analytics.unit_economics | Executive > Unit Economics | Finance | <12 months | Yellow: >14mo, Red: >18mo |
| Net Revenue Retention (NRR) | Revenue retention including expansion | (Start MRR + Expansion - Contraction - Churn) / Start MRR × 100 | Stripe API | analytics.mrr_movements | Executive > Unit Economics | CS | >110% | Yellow: <100%, Red: <90% |
| Gross Margin | Revenue after direct costs | (Revenue - COGS) / Revenue × 100 | Stripe + AWS billing | analytics.unit_economics | Finance Dashboard | Finance | >75% | Yellow: <70%, Red: <60% |
| ARPU | Average revenue per user per month | MRR / Active Subscribers | Derived | analytics.unit_economics | Executive > Unit Economics | Finance | $65 | Yellow: declining 3 consecutive months |

---

## Product Health

| Metric | Definition | Formula | Source System | Warehouse Table | Dashboard | Owner | Target | Alert Threshold |
|--------|-----------|---------|--------------|-----------------|-----------|-------|--------|-----------------|
| Daily Active Users (DAU) | Unique users with ≥1 meaningful action per day | COUNT(DISTINCT user_id WHERE event_type IN ('shipment_created', 'route_planned', 'invoice_sent')) | PostHog | analytics.daily_active_users | Product Dashboard | Product | 450 | Yellow: <350, Red: <250 |
| DAU/MAU Ratio | Product stickiness | DAU / MAU × 100 | Derived | analytics.daily_active_users | Product Dashboard | Product | >30% | Yellow: <20%, Red: <15% |
| Activation Rate | New users completing onboarding | Users completing 3 key actions within 7 days / Total new signups × 100 | PostHog | analytics.activation_funnel | Product Dashboard | Product | >65% | Yellow: <50%, Red: <35% |
| Feature Adoption (Route Optimizer) | % of active users using route optimization | Users using route_optimizer / MAU × 100 | PostHog | analytics.feature_adoption | Product Dashboard | Product | >40% | Yellow: <25% |
| Feature Adoption (Live Tracking) | % of active users using real-time shipment tracking | Users using live_tracking / MAU × 100 | PostHog | analytics.feature_adoption | Product Dashboard | Product | >60% | Yellow: <40% |
| Session Duration (median) | Typical session length | MEDIAN(session_end - session_start) | PostHog | analytics.sessions | Product Dashboard | Product | >12 min | Yellow: <8 min |
| Time to Value | Days from signup to first value event | MEDIAN(first_value_event_date - signup_date) | PostHog + App DB | analytics.activation_funnel | Product Dashboard | Product | <3 days | Yellow: >5 days, Red: >7 days |

---

## Customer Health

| Metric | Definition | Formula | Source System | Warehouse Table | Dashboard | Owner | Target | Alert Threshold |
|--------|-----------|---------|--------------|-----------------|-----------|-------|--------|-----------------|
| Net Promoter Score (NPS) | Customer loyalty indicator | % Promoters (9-10) - % Detractors (0-6) | Delighted | analytics.nps_scores | CX Dashboard | CX | >50 | Yellow: <30, Red: <10 |
| CSAT | Post-interaction satisfaction | AVG(satisfaction_rating) on 1-5 scale | Zendesk | analytics.csat_scores | CX Dashboard | CX | >4.3/5 | Yellow: <4.0, Red: <3.5 |
| Logo Churn Rate | % of customers lost per month | Customers cancelled / Start-of-month customers × 100 | Stripe API | analytics.churn | Executive > Customer Health | CS | <3% | Yellow: >4%, Red: >6% |
| Revenue Churn Rate | % of MRR lost to churn per month | Churned MRR / Start-of-month MRR × 100 | Stripe API | analytics.mrr_movements | Executive > Customer Health | Finance | <2% | Yellow: >3%, Red: >5% |
| Customer Health Score | Composite score (0-100) of account health | Weighted: usage (30%) + support tickets (20%) + NPS (15%) + billing (15%) + engagement (20%) | Multiple | analytics.customer_health | CX Dashboard | CS | Median >70 | Red: >20% of accounts below 40 |
| At-Risk Accounts | Accounts with health score below threshold | COUNT(accounts WHERE health_score < 40) | Derived | analytics.customer_health | CX Dashboard | CS | <10% of base | Red: >15% |
| First Response Time | Median time to first support response | MEDIAN(first_response_at - ticket_created_at) | Zendesk | analytics.support_metrics | CX Dashboard | CX | <2 hours | Yellow: >4h, Red: >8h |

---

## Marketing Efficiency

| Metric | Definition | Formula | Source System | Warehouse Table | Dashboard | Owner | Target | Alert Threshold |
|--------|-----------|---------|--------------|-----------------|-----------|-------|--------|-----------------|
| Website Traffic | Monthly unique visitors | COUNT(DISTINCT visitor_id) per month | Google Analytics | analytics.web_traffic | Marketing Dashboard | Marketing | >15K/mo | Yellow: declining 2 months |
| Visitor → Signup Rate | Landing page conversion | Signups / Unique Visitors × 100 | GA + App DB | analytics.marketing_funnel | Marketing Dashboard | Marketing | >3.5% | Yellow: <2.5%, Red: <1.5% |
| Trial → Paid Rate | Free trial conversion | Paid conversions / Trial starts × 100 | App DB + Stripe | analytics.marketing_funnel | Marketing Dashboard | Marketing | >15% | Yellow: <10%, Red: <5% |
| CAC by Channel | Cost per acquisition by marketing channel | Channel spend / Channel conversions | Google Ads + LinkedIn + HubSpot | analytics.channel_attribution | Marketing Dashboard | Marketing | Varies by channel | Red: any channel CAC >2x blended |
| Email Open Rate | Marketing email engagement | Opens / Delivered × 100 | SendGrid | analytics.email_metrics | Marketing Dashboard | Marketing | >25% | Yellow: <18% |

---

## Operational Health

| Metric | Definition | Formula | Source System | Warehouse Table | Dashboard | Owner | Target | Alert Threshold |
|--------|-----------|---------|--------------|-----------------|-----------|-------|--------|-----------------|
| Uptime | Service availability | (Total minutes - Downtime minutes) / Total minutes × 100 | Datadog | analytics.uptime | Engineering Dashboard | Engineering | >99.9% | Yellow: <99.5%, Red: <99% |
| Error Rate (5xx) | Server error percentage | 5xx responses / Total responses × 100 | Datadog | analytics.error_rates | Engineering Dashboard | Engineering | <0.1% | Yellow: >0.5%, Red: >1% |
| API Latency (p95) | 95th percentile response time | PERCENTILE(response_time_ms, 0.95) | Datadog | analytics.api_latency | Engineering Dashboard | Engineering | <200ms | Yellow: >300ms, Red: >500ms |
| Deployment Frequency | How often code ships to production | COUNT(deployments) per week | GitHub Actions | analytics.dora_metrics | Engineering Dashboard | Engineering | >5/week | Yellow: <2/week |
| Infrastructure Cost per User | Cloud cost efficiency | Monthly AWS bill / MAU | AWS Cost Explorer | analytics.infra_costs | Finance Dashboard | Engineering | <$0.50/user | Yellow: >$0.75, Red: >$1.00 |

---

## Data Lineage Summary (Top 5 Metrics)

### MRR (Monthly Recurring Revenue)
```
Source:       Stripe API → subscription.created/updated/deleted webhooks
Extraction:   Custom webhook handler → raw.stripe_webhook_events (real-time)
Staging:      dbt model: staging.stg_stripe_subscriptions (hourly)
Transform:    dbt model: marts.finance.mrr_movements (hourly, incremental)
Warehouse:    analytics.mrr_movements (fact table)
Dashboards:   Executive > Revenue, Revenue Waterfall, Board Deck Slide 3
Board Deck:   Slide 3: Revenue & Growth
Alert:        MRR decline >5% MoM → #finance-alerts Slack channel
Owner:        Finance (Sarah Kim)
PII:          None (financial aggregates only)
```

### Net Promoter Score (NPS)
```
Source:       Delighted API → survey responses
Extraction:   Delighted webhook → raw.delighted_responses (real-time)
Staging:      dbt model: staging.stg_delighted_surveys (daily)
Transform:    dbt model: marts.cx.nps_scores (daily)
Warehouse:    analytics.nps_scores (fact table)
Dashboards:   CX Dashboard > Feedback Pulse, Executive > Customer Health
Board Deck:   Slide 6: Customer Health
Alert:        NPS <30 → #cx-alerts Slack channel
Owner:        CX (Jordan Park)
PII:          Contains respondent email (masked in analytics layer)
```

### Customer Health Score
```
Source:       Multiple: App DB (usage), Zendesk (tickets), Delighted (NPS), Stripe (billing), PostHog (engagement)
Extraction:   Mixed: CDC for App DB, API pulls for Zendesk/Delighted/Stripe, PostHog export (daily)
Staging:      5 staging models joined in intermediate layer
Transform:    dbt model: marts.cx.customer_health (daily, full refresh)
Warehouse:    analytics.customer_health (slowly changing dimension, Type 2)
Dashboards:   CX Dashboard > Health Overview, Executive > Customer Health
Board Deck:   Slide 6: Customer Health (distribution chart)
Alert:        >20% accounts below 40 → #cx-alerts + email to CS Manager
Owner:        CS (Alex Rivera)
PII:          Contains account names (visible to CS team only via row-level security)
```

### DAU (Daily Active Users)
```
Source:       PostHog → tracked events (shipment_created, route_planned, invoice_sent)
Extraction:   PostHog S3 export → raw.posthog_events (hourly)
Staging:      dbt model: staging.stg_posthog_events (hourly)
Transform:    dbt model: marts.product.daily_active_users (hourly, incremental)
Warehouse:    analytics.daily_active_users (fact table, partitioned by date)
Dashboards:   Product Dashboard > Engagement, Executive > Product Health
Board Deck:   Slide 2: Product Metrics
Alert:        DAU <250 on weekday → #product-alerts Slack channel
Owner:        Product (Taylor Nguyen)
PII:          User IDs only (no PII in analytics layer)
```

### CAC (Customer Acquisition Cost)
```
Source:       Multiple: Google Ads API, LinkedIn Ads API, HubSpot CRM, Stripe (for conversion attribution)
Extraction:   API pulls → raw.google_ads_spend, raw.linkedin_ads_spend, raw.hubspot_deals (daily)
Staging:      3 staging models + attribution join
Transform:    dbt model: marts.marketing.channel_attribution → marts.finance.unit_economics (daily)
Warehouse:    analytics.unit_economics (fact table), analytics.channel_attribution (detail)
Dashboards:   Marketing Dashboard > Channel Performance, Executive > Unit Economics
Board Deck:   Slide 4: Unit Economics
Alert:        Blended CAC >$400 → #marketing-alerts Slack channel
Owner:        Marketing (Jamie Walsh)
PII:          None (aggregated spend data)
```

---

## Registry Maintenance Notes

- **Last quarterly review:** 2026-01-15 — removed 3 deprecated metrics (old funnel stages), added 2 new ones (Feature Adoption: Live Tracking, Infrastructure Cost per User)
- **Known issues:** LinkedIn Ads API has intermittent failures; CAC by channel can be 1 day stale on Mondays
- **Upcoming changes:** Migrating from Delighted to in-app NPS surveys in Q2 — will require staging model update and backfill plan
- **Metric dispute log:** "Churn rate" definition was disputed between Finance (revenue churn) and Product (logo churn) in Nov 2025. Resolution: both are tracked as separate metrics with clear naming. Registry updated to include both.

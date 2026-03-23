# Unified Metrics Registry

> **This registry is the canonical definition of every metric tracked by {{PROJECT_NAME}}. When two teams disagree about what a number means, this document is the arbiter.** No dashboard, board deck, or Slack message should report a metric whose definition is not recorded here. If a metric is not in this registry, it does not officially exist.

**Project:** {{PROJECT_NAME}}
**Registry Owner:** {{BI_METRIC_OWNER_DEFAULT}}
**Last Full Review:** {{LAST_REGISTRY_REVIEW_DATE}}
**Next Scheduled Review:** {{NEXT_REGISTRY_REVIEW_DATE}}
**Total Registered Metrics:** {{REGISTERED_METRIC_COUNT}}

---

## How to Read This Registry

Each metric entry contains:

| Column | Purpose |
|--------|---------|
| **Metric** | Human-readable name used in dashboards and conversation |
| **Category** | Grouping for organization (Revenue, Unit Economics, Product, Customer, Marketing, Operational) |
| **Definition** | Plain-English description of what this metric measures — the authoritative meaning |
| **Formula** | Mathematical formula or calculation logic |
| **Source Section** | Which kit section originally defined this metric |
| **Source System** | The application or service that generates the raw data |
| **Warehouse Table** | The analytics table and column where the final value lives |
| **Dashboard** | Which dashboard(s) display this metric |
| **Owner** | The team or person accountable for this metric's accuracy |
| **Target** | Current target or benchmark |
| **Alert Threshold** | The value that triggers an alert (see alert-threshold-registry.template.md for full escalation details) |
| **Refresh Cadence** | How often this metric is recalculated |

---

## 1. Revenue & Growth

*Source sections: 25-financial-modeling, 35-business-intelligence*

| Metric | Definition | Formula | Source System | Warehouse Table | Dashboard | Owner | Target | Alert Threshold | Refresh Cadence |
|--------|-----------|---------|---------------|-----------------|-----------|-------|--------|----------------|-----------------|
| **Monthly Recurring Revenue (MRR)** | The total predictable revenue normalized to a monthly period from all active subscriptions, excluding one-time charges, overages, and professional services | `SUM(active_subscriptions.normalized_monthly_amount)` where normalized_monthly_amount = annual plans / 12, quarterly / 3, monthly as-is | {{BILLING_PROVIDER}} API | `analytics_{{PROJECT_NAME}}.finance.fct_mrr_current` | Executive > Revenue & Growth | Finance | {{MRR_TARGET}} | < {{MRR_FLOOR}} | Daily |
| **Annual Recurring Revenue (ARR)** | MRR multiplied by 12. Represents the annualized run rate assuming no changes to the subscription base | `MRR * 12` | Derived from MRR | `analytics_{{PROJECT_NAME}}.finance.fct_mrr_current` (computed column) | Executive > Revenue & Growth, Board Deck Slide 3 | Finance | {{ARR_TARGET}} | < {{ARR_FLOOR}} | Daily |
| **MRR Growth Rate** | Month-over-month percentage change in MRR. The single most important metric for early-stage SaaS | `(MRR_current - MRR_previous) / MRR_previous * 100` | Derived from MRR | `analytics_{{PROJECT_NAME}}.finance.fct_mrr_movements` | Executive > Revenue & Growth | Finance | > 5% MoM | < 0% (decline) | Monthly |
| **Net New MRR** | The total change in MRR from all sources in a given period. Decomposes into new, expansion, contraction, churned, and reactivation | `New MRR + Expansion MRR - Contraction MRR - Churned MRR + Reactivation MRR` | Derived from MRR components | `analytics_{{PROJECT_NAME}}.finance.fct_mrr_movements` | Executive > Revenue & Growth, MRR Waterfall | Finance | > {{NET_NEW_MRR_TARGET}}/mo | Negative for 2 consecutive months | Monthly |
| **New MRR** | MRR added from brand-new customers who did not have a subscription in the prior period | `SUM(mrr) WHERE customer_first_subscription_month = current_month` | {{BILLING_PROVIDER}} API | `analytics_{{PROJECT_NAME}}.finance.fct_mrr_movements` (movement_type = 'new') | MRR Waterfall | Sales / Marketing | {{NEW_MRR_TARGET}} | < 50% of target | Monthly |
| **Expansion MRR** | MRR increase from existing customers through upgrades, add-ons, or seat expansion | `SUM(mrr_change) WHERE mrr_change > 0 AND customer_tenure_months > 0` | {{BILLING_PROVIDER}} API | `analytics_{{PROJECT_NAME}}.finance.fct_mrr_movements` (movement_type = 'expansion') | MRR Waterfall, Unit Economics | Product / CS | {{EXPANSION_MRR_TARGET}} | < 30% of net new MRR | Monthly |
| **Contraction MRR** | MRR decrease from existing customers through downgrades (customer remains active but pays less) | `ABS(SUM(mrr_change)) WHERE mrr_change < 0 AND customer_still_active = true` | {{BILLING_PROVIDER}} API | `analytics_{{PROJECT_NAME}}.finance.fct_mrr_movements` (movement_type = 'contraction') | MRR Waterfall | CS / Product | < 2% of starting MRR | > 5% of starting MRR | Monthly |
| **Churned MRR** | MRR lost from customers who fully cancelled their subscription | `ABS(SUM(last_mrr)) WHERE subscription_status changed to 'cancelled'` | {{BILLING_PROVIDER}} API | `analytics_{{PROJECT_NAME}}.finance.fct_mrr_movements` (movement_type = 'churn') | MRR Waterfall, Churn Analysis | CS | < 3% of starting MRR | > 5% of starting MRR | Monthly |
| **Reactivation MRR** | MRR from customers who previously churned and have now resubscribed | `SUM(mrr) WHERE customer_previously_churned = true AND subscription_reactivated_this_month = true` | {{BILLING_PROVIDER}} API | `analytics_{{PROJECT_NAME}}.finance.fct_mrr_movements` (movement_type = 'reactivation') | MRR Waterfall | CS / Marketing | Track only | N/A | Monthly |
| **Quick Ratio** | Measures growth efficiency: how much MRR you add for every dollar you lose. A Quick Ratio > 4 indicates healthy growth; < 1 means the business is shrinking | `(New MRR + Expansion MRR + Reactivation MRR) / (Churned MRR + Contraction MRR)` | Derived from MRR components | `analytics_{{PROJECT_NAME}}.finance.fct_mrr_summary` | Executive > Revenue & Growth | Finance | > 4.0 | < 2.0 | Monthly |
| **ARR Run Rate** | Forward-looking ARR projection based on the most recent month's MRR, adjusted for known upcoming changes (signed contracts not yet live, announced cancellations) | `Current MRR * 12 + Signed_Not_Started - Announced_Cancellations` | {{BILLING_PROVIDER}} + {{CRM_PROVIDER}} | `analytics_{{PROJECT_NAME}}.finance.fct_arr_forecast` | Board Deck Slide 3 | Finance | {{ARR_RUN_RATE_TARGET}} | N/A (forecast) | Monthly |

---

## 2. Unit Economics

*Source sections: 25-financial-modeling, 19-marketing*

| Metric | Definition | Formula | Source System | Warehouse Table | Dashboard | Owner | Target | Alert Threshold | Refresh Cadence |
|--------|-----------|---------|---------------|-----------------|-----------|-------|--------|----------------|-----------------|
| **Customer Acquisition Cost (CAC)** | Fully-loaded cost to acquire one new paying customer, including all sales and marketing spend, salaries, tools, and overhead allocated to acquisition | `(Total Sales & Marketing Spend) / (New Customers Acquired)` in the same period | {{ACCOUNTING_PROVIDER}}, {{AD_PLATFORMS}}, payroll | `analytics_{{PROJECT_NAME}}.finance.fct_unit_economics` | Unit Economics, Board Deck Slide 5 | Marketing / Finance | < {{CAC_TARGET}} | > {{CAC_CEILING}} | Monthly |
| **CAC by Channel** | CAC broken down by acquisition channel (organic, paid search, paid social, content, referral, outbound sales) to identify the most efficient channels | `Channel_Spend / Channel_New_Customers` | {{AD_PLATFORMS}}, {{ANALYTICS_PROVIDER}}, {{CRM_PROVIDER}} | `analytics_{{PROJECT_NAME}}.marketing.fct_cac_by_channel` | Marketing > Channel Performance | Marketing | Varies by channel | Any channel CAC > 3x blended CAC | Monthly |
| **Lifetime Value (LTV)** | The total gross profit a customer generates over their entire relationship with the business | `ARPU * Gross Margin % * (1 / Monthly Churn Rate)` or for cohort-based: `SUM(monthly_gross_profit) over observed customer lifetime` | {{BILLING_PROVIDER}}, cost allocation | `analytics_{{PROJECT_NAME}}.finance.fct_unit_economics` | Unit Economics, Board Deck Slide 5 | Finance | > {{LTV_TARGET}} | < 3x CAC | Monthly |
| **LTV:CAC Ratio** | The ratio of customer lifetime value to acquisition cost. The single most important unit economics metric. Below 3:1 means unprofitable growth; above 5:1 means you may be underinvesting in growth | `LTV / CAC` | Derived | `analytics_{{PROJECT_NAME}}.finance.fct_unit_economics` | Unit Economics, Executive > Revenue & Growth | Finance | 3:1 to 5:1 | < 3:1 | Monthly |
| **CAC Payback Period** | Number of months required for a new customer to generate enough gross profit to recover their acquisition cost | `CAC / (ARPU * Gross Margin %)` | Derived | `analytics_{{PROJECT_NAME}}.finance.fct_unit_economics` | Unit Economics, Board Deck Slide 5 | Finance | < 12 months | > 18 months | Monthly |
| **Net Revenue Retention (NRR)** | Revenue retained from an existing customer cohort after accounting for expansion, contraction, and churn. NRR > 100% means the business grows even without new customers | `(Starting MRR + Expansion - Contraction - Churn) / Starting MRR * 100` for a defined cohort over a period | {{BILLING_PROVIDER}} API | `analytics_{{PROJECT_NAME}}.finance.fct_nrr_cohorts` | Unit Economics, Board Deck Slide 4, Executive > Revenue & Growth | CS / Finance | > 110% | < 90% | Monthly |
| **Gross Revenue Retention (GRR)** | Revenue retained from an existing customer cohort excluding expansion — measures only contraction and churn. Cannot exceed 100%. Shows the "floor" of retention before upsells | `(Starting MRR - Contraction - Churn) / Starting MRR * 100` | {{BILLING_PROVIDER}} API | `analytics_{{PROJECT_NAME}}.finance.fct_nrr_cohorts` | Unit Economics | CS / Finance | > 90% | < 80% | Monthly |
| **Average Revenue Per User (ARPU)** | Average monthly revenue generated per individual user. Use for PLG/self-serve models where individual users are the billing unit | `MRR / Total Active Paying Users` | {{BILLING_PROVIDER}} API | `analytics_{{PROJECT_NAME}}.finance.fct_unit_economics` | Unit Economics, Product Health | Finance / Product | {{ARPU_TARGET}} | Decline > 10% MoM | Monthly |
| **Average Revenue Per Account (ARPA)** | Average monthly revenue generated per account/organization. Use for B2B models where organizations are the billing unit and may contain multiple seats | `MRR / Total Active Paying Accounts` | {{BILLING_PROVIDER}} API | `analytics_{{PROJECT_NAME}}.finance.fct_unit_economics` | Unit Economics | Finance / Sales | {{ARPA_TARGET}} | Decline > 10% MoM | Monthly |
| **Expansion Revenue Rate** | Percentage of revenue growth attributable to expansion within existing customers versus new customer acquisition | `Expansion MRR / Net New MRR * 100` | Derived from MRR components | `analytics_{{PROJECT_NAME}}.finance.fct_mrr_movements` | Unit Economics | CS / Product | > 30% | < 15% | Monthly |
| **Gross Margin** | Percentage of revenue remaining after deducting cost of goods sold (COGS): hosting, infrastructure, third-party API costs, payment processing, and support labor directly tied to service delivery | `(Revenue - COGS) / Revenue * 100` | {{ACCOUNTING_PROVIDER}}, infrastructure cost tags | `analytics_{{PROJECT_NAME}}.finance.fct_gross_margin` | Unit Economics, Board Deck Slide 6 | Finance | > 70% | < 60% | Monthly |

---

## 3. Product Health

*Source section: 20-post-launch*

| Metric | Definition | Formula | Source System | Warehouse Table | Dashboard | Owner | Target | Alert Threshold | Refresh Cadence |
|--------|-----------|---------|---------------|-----------------|-----------|-------|--------|----------------|-----------------|
| **Daily Active Users (DAU)** | Count of unique users who performed at least one meaningful action in the product within a calendar day. "Meaningful action" excludes passive page loads and bot traffic — defined as {{DAU_QUALIFYING_EVENT}} | `COUNT(DISTINCT user_id) WHERE event IN (qualifying_events) AND event_date = date` | {{ANALYTICS_PROVIDER}}, application events | `analytics_{{PROJECT_NAME}}.product.fct_active_users` | Product Health, Executive > Product | Product | {{DAU_TARGET}} | Decline > 15% WoW | Daily |
| **Weekly Active Users (WAU)** | Count of unique users who performed at least one meaningful action within a rolling 7-day window | `COUNT(DISTINCT user_id) WHERE event IN (qualifying_events) AND event_date >= date - 7` | {{ANALYTICS_PROVIDER}} | `analytics_{{PROJECT_NAME}}.product.fct_active_users` | Product Health | Product | {{WAU_TARGET}} | Decline > 15% WoW | Daily |
| **Monthly Active Users (MAU)** | Count of unique users who performed at least one meaningful action within a rolling 28-day window. 28-day window used for consistency regardless of month length | `COUNT(DISTINCT user_id) WHERE event IN (qualifying_events) AND event_date >= date - 28` | {{ANALYTICS_PROVIDER}} | `analytics_{{PROJECT_NAME}}.product.fct_active_users` | Product Health, Executive > Product, Board Deck Slide 7 | Product | {{MAU_TARGET}} | Decline > 10% MoM | Daily |
| **DAU/MAU Ratio (Stickiness)** | The percentage of monthly users who use the product on any given day. Measures habitual engagement. Social apps target > 50%, SaaS tools target > 20%, B2B enterprise > 10% | `DAU / MAU * 100` | Derived | `analytics_{{PROJECT_NAME}}.product.fct_active_users` | Product Health, Executive > Product | Product | > {{STICKINESS_TARGET}}% | < 15% | Daily |
| **Feature Adoption Rate** | Percentage of active users who have used a specific feature at least once within a defined period (typically 28 days) | `Users_Who_Used_Feature / MAU * 100` per feature | {{ANALYTICS_PROVIDER}} | `analytics_{{PROJECT_NAME}}.product.fct_feature_adoption` | Product Health > Feature Drilldown | Product | Varies by feature | Core feature < 40% | Weekly |
| **Activation Rate** | Percentage of new signups who reach the "aha moment" — the point where they have experienced enough value to be likely to retain. Defined as completing {{ACTIVATION_MILESTONE}} | `Users_Completed_Activation / New_Signups * 100` within {{ACTIVATION_WINDOW}} days of signup | {{ANALYTICS_PROVIDER}}, application events | `analytics_{{PROJECT_NAME}}.product.fct_activation_funnel` | Product Health, Growth > Activation | Product / Growth | > {{ACTIVATION_RATE_TARGET}}% | < 25% | Daily |
| **Time to Value** | Median time from user signup to completing the activation milestone. Lower is better — users who take too long to reach value are unlikely to convert | `MEDIAN(activation_timestamp - signup_timestamp)` for users who activated | {{ANALYTICS_PROVIDER}} | `analytics_{{PROJECT_NAME}}.product.fct_activation_funnel` | Product Health, Growth > Activation | Product | < {{TIME_TO_VALUE_TARGET}} minutes | > 2x target | Weekly |
| **Session Duration** | Average time spent in the product per session. Calculated as time between first and last event in a session, with sessions defined by a {{SESSION_TIMEOUT_MINUTES}}-minute inactivity gap | `AVG(last_event_timestamp - first_event_timestamp)` per session | {{ANALYTICS_PROVIDER}} | `analytics_{{PROJECT_NAME}}.product.fct_sessions` | Product Health | Product | {{SESSION_DURATION_TARGET}} min | Decline > 20% WoW | Daily |
| **Sessions per User** | Average number of sessions per active user over a given period. Measures return frequency | `Total Sessions / Active Users` in period | {{ANALYTICS_PROVIDER}} | `analytics_{{PROJECT_NAME}}.product.fct_sessions` | Product Health | Product | {{SESSIONS_PER_USER_TARGET}}/week | Decline > 20% WoW | Weekly |
| **Core Feature Usage** | Daily usage count of the product's primary value-delivering feature. This is the "did they do the thing?" metric — e.g., messages sent, reports generated, deployments run | `COUNT(events) WHERE event_name = '{{CORE_FEATURE_EVENT}}'` | Application events | `analytics_{{PROJECT_NAME}}.product.fct_feature_usage` | Product Health | Product | {{CORE_FEATURE_USAGE_TARGET}}/day | Decline > 25% WoW | Daily |
| **Power User Percentage** | Percentage of MAU who qualify as "power users" based on usage intensity. Power users are defined as users who perform > {{POWER_USER_ACTION_THRESHOLD}} {{CORE_FEATURE_EVENT}} actions per week | `Users_Above_Threshold / MAU * 100` | {{ANALYTICS_PROVIDER}} | `analytics_{{PROJECT_NAME}}.product.fct_user_segments` | Product Health > User Segmentation | Product | > 15% | < 8% | Weekly |

---

## 4. Customer Health

*Source sections: 20-post-launch, 33-customer-experience-ops*

| Metric | Definition | Formula | Source System | Warehouse Table | Dashboard | Owner | Target | Alert Threshold | Refresh Cadence |
|--------|-----------|---------|---------------|-----------------|-----------|-------|--------|----------------|-----------------|
| **Net Promoter Score (NPS)** | Measures customer loyalty by asking "How likely are you to recommend {{PROJECT_NAME}} to a colleague?" on a 0-10 scale. Calculated as % Promoters (9-10) minus % Detractors (0-6) | `(Promoters / Total Responses * 100) - (Detractors / Total Responses * 100)` | {{SURVEY_PROVIDER}} | `analytics_{{PROJECT_NAME}}.cx.fct_nps_responses` | Customer Health, Executive > CX, Board Deck Slide 9 | CX / Product | > 50 | < 20 | Quarterly |
| **Customer Satisfaction (CSAT)** | Post-interaction satisfaction rating, typically 1-5 scale. Reported as percentage of respondents who gave 4 or 5 | `COUNT(rating >= 4) / COUNT(all_responses) * 100` | {{SUPPORT_PLATFORM}}, {{SURVEY_PROVIDER}} | `analytics_{{PROJECT_NAME}}.cx.fct_csat_responses` | Customer Health, Support Dashboard | CX / Support | > 90% | < 80% | Weekly |
| **Customer Effort Score (CES)** | Measures how easy it was for a customer to accomplish their goal. Scored 1-7, reported as percentage who gave 5-7 (low effort) | `COUNT(score >= 5) / COUNT(all_responses) * 100` | {{SURVEY_PROVIDER}} | `analytics_{{PROJECT_NAME}}.cx.fct_ces_responses` | Customer Health | CX / Product | > 75% | < 55% | Monthly |
| **Customer Health Score** | Composite score (0-100) combining product usage, support interactions, billing status, NPS, and engagement recency to predict churn risk. Weights: usage 35%, engagement recency 25%, support sentiment 20%, billing health 10%, NPS 10% | Weighted composite — see Section 33 health score methodology | Multiple ({{ANALYTICS_PROVIDER}}, {{SUPPORT_PLATFORM}}, {{BILLING_PROVIDER}}) | `analytics_{{PROJECT_NAME}}.cx.fct_customer_health` | Customer Health, CS > Account Overview | CS | > 70 average | Any enterprise account < 40 | Daily |
| **Churn Rate (Logo)** | Percentage of customers (by count) who cancelled in a given period, regardless of their revenue contribution. One enterprise customer and one free-trial-to-$9-plan customer count equally | `Churned Customers / Starting Customers * 100` | {{BILLING_PROVIDER}} API | `analytics_{{PROJECT_NAME}}.finance.fct_churn_analysis` | Customer Health, Executive > Revenue & Growth | CS | < 3% monthly | > 5% monthly | Monthly |
| **Churn Rate (Revenue)** | Percentage of MRR lost to cancellations in a given period. Weights churned customers by their revenue — losing one $5K/mo customer matters more than losing ten $9/mo customers | `Churned MRR / Starting MRR * 100` | {{BILLING_PROVIDER}} API | `analytics_{{PROJECT_NAME}}.finance.fct_churn_analysis` | Customer Health, Executive > Revenue & Growth, Board Deck Slide 4 | CS / Finance | < 2% monthly | > 5% monthly | Monthly |
| **Voluntary Churn Rate** | Churn initiated by a deliberate customer action (cancellation, non-renewal). Indicates product-market fit or competitive pressure issues | `Voluntarily_Churned / Starting_Customers * 100` | {{BILLING_PROVIDER}} API + cancellation reason tags | `analytics_{{PROJECT_NAME}}.finance.fct_churn_analysis` | Customer Health > Churn Breakdown | CS / Product | < 2% monthly | > 3% monthly | Monthly |
| **Involuntary Churn Rate** | Churn caused by failed payments (expired cards, insufficient funds, payment processor errors). Preventable through dunning and payment recovery | `Involuntarily_Churned / Starting_Customers * 100` | {{BILLING_PROVIDER}} API (payment failure events) | `analytics_{{PROJECT_NAME}}.finance.fct_churn_analysis` | Customer Health > Churn Breakdown | Finance / Engineering | < 0.5% monthly | > 1% monthly | Monthly |
| **At-Risk Account Count** | Number of accounts whose Customer Health Score has dropped below 40, indicating high churn probability within 90 days | `COUNT(accounts) WHERE health_score < 40` | Derived from Customer Health Score | `analytics_{{PROJECT_NAME}}.cx.fct_customer_health` | Customer Health, CS > Risk Dashboard | CS | < 5% of total accounts | > 10% of total accounts | Daily |
| **Support Ticket Volume** | Total number of new support tickets/conversations created in a period | `COUNT(tickets) WHERE created_at IN period` | {{SUPPORT_PLATFORM}} | `analytics_{{PROJECT_NAME}}.cx.fct_support_tickets` | Support Dashboard, Operational Health | Support | Track (no fixed target) | > 2x rolling 4-week average | Daily |
| **First Response Time** | Median time from ticket creation to first human response, excluding auto-acknowledgments and bot replies | `MEDIAN(first_human_response_at - ticket_created_at)` | {{SUPPORT_PLATFORM}} | `analytics_{{PROJECT_NAME}}.cx.fct_support_tickets` | Support Dashboard | Support | < {{FIRST_RESPONSE_SLA}} hours | > 2x SLA | Daily |
| **Resolution Time** | Median time from ticket creation to final resolution (ticket marked as solved and not reopened within 48 hours) | `MEDIAN(resolved_at - ticket_created_at)` excluding reopened tickets within 48h | {{SUPPORT_PLATFORM}} | `analytics_{{PROJECT_NAME}}.cx.fct_support_tickets` | Support Dashboard | Support | < {{RESOLUTION_SLA}} hours | > 2x SLA | Daily |

---

## 5. Marketing Efficiency

*Source section: 19-marketing*

| Metric | Definition | Formula | Source System | Warehouse Table | Dashboard | Owner | Target | Alert Threshold | Refresh Cadence |
|--------|-----------|---------|---------------|-----------------|-----------|-------|--------|----------------|-----------------|
| **Website Traffic** | Total unique visitors to {{PROJECT_DOMAIN}} in a period, deduplicated by session ID. Excludes known bots and internal IP ranges | `COUNT(DISTINCT session_id) WHERE is_bot = false AND is_internal = false` | {{ANALYTICS_PROVIDER}} | `analytics_{{PROJECT_NAME}}.marketing.fct_website_traffic` | Marketing > Traffic & Acquisition | Marketing | {{TRAFFIC_TARGET}}/month | Decline > 20% MoM | Daily |
| **Traffic by Channel** | Website traffic segmented by acquisition channel: organic search, paid search, paid social, direct, referral, email, affiliate | `COUNT(DISTINCT session_id) GROUP BY utm_channel` | {{ANALYTICS_PROVIDER}} | `analytics_{{PROJECT_NAME}}.marketing.fct_website_traffic` | Marketing > Channel Breakdown | Marketing | Varies by channel | Any primary channel decline > 30% | Weekly |
| **Conversion Rate (Visitor to Signup)** | Percentage of unique website visitors who create an account | `New Signups / Unique Visitors * 100` | {{ANALYTICS_PROVIDER}}, application database | `analytics_{{PROJECT_NAME}}.marketing.fct_conversion_funnel` | Marketing > Funnel, Growth > Acquisition | Marketing / Growth | > {{VISITOR_SIGNUP_RATE_TARGET}}% | < 1% | Weekly |
| **Conversion Rate (Signup to Activation)** | Percentage of new signups who reach the activation milestone (see Activation Rate above) | `Activated Users / New Signups * 100` within {{ACTIVATION_WINDOW}} days | Application events | `analytics_{{PROJECT_NAME}}.product.fct_activation_funnel` | Growth > Activation | Product / Growth | > {{SIGNUP_ACTIVATION_RATE_TARGET}}% | < 20% | Weekly |
| **Conversion Rate (Trial to Paid)** | Percentage of trial users who convert to a paid subscription before or within {{TRIAL_GRACE_PERIOD}} days of trial expiration | `Converted_Trials / Total_Expired_Trials * 100` | {{BILLING_PROVIDER}} API | `analytics_{{PROJECT_NAME}}.marketing.fct_conversion_funnel` | Growth > Conversion, Marketing > Funnel | Growth / Sales | > {{TRIAL_CONVERSION_TARGET}}% | < 5% | Weekly |
| **Marketing Qualified Leads (MQL)** | Leads that meet predefined behavioral and firmographic criteria indicating sales readiness. Criteria defined in {{MQL_SCORING_MODEL}} | `COUNT(leads) WHERE lead_score >= {{MQL_THRESHOLD}}` | {{CRM_PROVIDER}}, {{MARKETING_AUTOMATION_PROVIDER}} | `analytics_{{PROJECT_NAME}}.marketing.fct_lead_pipeline` | Marketing > Pipeline | Marketing | {{MQL_TARGET}}/month | < 50% of target | Weekly |
| **Sales Qualified Leads (SQL)** | MQLs that have been reviewed and accepted by sales as genuine opportunities worth pursuing | `COUNT(leads) WHERE status = 'sales_accepted'` | {{CRM_PROVIDER}} | `analytics_{{PROJECT_NAME}}.marketing.fct_lead_pipeline` | Sales > Pipeline | Sales | {{SQL_TARGET}}/month | < 50% of target | Weekly |
| **MQL to SQL Conversion** | Percentage of MQLs that sales accepts as SQLs. Low conversion indicates misalignment between marketing qualification criteria and sales expectations | `SQLs / MQLs * 100` | {{CRM_PROVIDER}} | `analytics_{{PROJECT_NAME}}.marketing.fct_lead_pipeline` | Marketing > Pipeline Efficiency | Marketing / Sales | > 30% | < 15% | Monthly |
| **Email Open Rate** | Percentage of delivered marketing emails that were opened. Unreliable as a primary metric after Apple MPP (Mail Privacy Protection) but useful for trend analysis | `Opened / Delivered * 100` (excluding MPP-inflated opens where detectable) | {{EMAIL_PROVIDER}} | `analytics_{{PROJECT_NAME}}.marketing.fct_email_performance` | Marketing > Email | Marketing | > 25% | < 15% | Per campaign |
| **Email Click Rate** | Percentage of delivered marketing emails where the recipient clicked at least one link. More reliable than open rate as an engagement signal | `Clicked / Delivered * 100` | {{EMAIL_PROVIDER}} | `analytics_{{PROJECT_NAME}}.marketing.fct_email_performance` | Marketing > Email | Marketing | > 3% | < 1% | Per campaign |
| **Content Engagement Score** | Composite score measuring content effectiveness: weighted combination of time on page (30%), scroll depth (20%), social shares (15%), backlinks (15%), conversion events triggered from content (20%) | Weighted composite — see Section 19 content scoring methodology | {{ANALYTICS_PROVIDER}}, {{CMS_PROVIDER}} | `analytics_{{PROJECT_NAME}}.marketing.fct_content_performance` | Marketing > Content | Marketing | > 60/100 | Bottom quartile content flagged for review | Monthly |

---

## 6. Operational Health

*Source sections: 20-post-launch, 32-integrations*

| Metric | Definition | Formula | Source System | Warehouse Table | Dashboard | Owner | Target | Alert Threshold | Refresh Cadence |
|--------|-----------|---------|---------------|-----------------|-----------|-------|--------|----------------|-----------------|
| **Uptime Percentage** | Percentage of time the production application was fully operational (all critical user-facing endpoints returning 2xx within SLA latency) in a given period | `(Total Minutes - Downtime Minutes) / Total Minutes * 100` | {{MONITORING_PROVIDER}}, status page | `analytics_{{PROJECT_NAME}}.ops.fct_uptime` | Engineering > Reliability, Executive > Operational | Engineering / SRE | > 99.9% | < 99.0% | Hourly |
| **Error Rate (4xx)** | Percentage of HTTP responses returning 4xx status codes. Elevated 4xx often indicates broken client integrations, changed API contracts, or bot abuse | `COUNT(4xx responses) / COUNT(total responses) * 100` | {{APM_PROVIDER}}, application logs | `analytics_{{PROJECT_NAME}}.ops.fct_error_rates` | Engineering > Reliability | Engineering | < 2% | > 5% | Hourly |
| **Error Rate (5xx)** | Percentage of HTTP responses returning 5xx status codes. Indicates server-side failures — unhandled exceptions, timeouts, downstream service failures | `COUNT(5xx responses) / COUNT(total responses) * 100` | {{APM_PROVIDER}}, application logs | `analytics_{{PROJECT_NAME}}.ops.fct_error_rates` | Engineering > Reliability, Executive > Operational | Engineering / SRE | < 0.1% | > 1% | Hourly (5-minute granularity) |
| **API Latency (p50)** | Median response time for API requests. Represents the "typical" user experience | `PERCENTILE(response_time_ms, 0.50)` | {{APM_PROVIDER}} | `analytics_{{PROJECT_NAME}}.ops.fct_latency` | Engineering > Performance | Engineering | < 100ms | > 200ms | Hourly (5-minute granularity) |
| **API Latency (p95)** | 95th percentile response time. Represents the experience of your slowest 5% of requests — the users most likely to be frustrated | `PERCENTILE(response_time_ms, 0.95)` | {{APM_PROVIDER}} | `analytics_{{PROJECT_NAME}}.ops.fct_latency` | Engineering > Performance, Executive > Operational | Engineering | < 200ms | > 500ms | Hourly (5-minute granularity) |
| **API Latency (p99)** | 99th percentile response time. The "tail latency" that catches pathological cases — long-running queries, cold starts, retry storms | `PERCENTILE(response_time_ms, 0.99)` | {{APM_PROVIDER}} | `analytics_{{PROJECT_NAME}}.ops.fct_latency` | Engineering > Performance | Engineering | < 500ms | > 2000ms | Hourly |
| **Deployment Frequency** | Number of production deployments per period. One of the four DORA metrics. Higher frequency correlates with higher-performing engineering teams | `COUNT(deployments) WHERE environment = 'production'` per period | {{CI_CD_PROVIDER}} | `analytics_{{PROJECT_NAME}}.ops.fct_dora_metrics` | Engineering > DORA, Executive > Engineering | Engineering | {{DEPLOY_FREQUENCY_TARGET}} per week | < 1 per week (for teams targeting daily+) | Weekly |
| **Lead Time for Changes** | Median time from code commit to that commit running in production. The second DORA metric | `MEDIAN(deploy_timestamp - commit_timestamp)` | {{CI_CD_PROVIDER}}, {{SCM_PROVIDER}} | `analytics_{{PROJECT_NAME}}.ops.fct_dora_metrics` | Engineering > DORA | Engineering | < {{LEAD_TIME_TARGET}} hours | > 1 week | Weekly |
| **Mean Time to Recovery (MTTR)** | Mean time from incident detection to full service restoration. The third DORA metric | `AVG(resolved_at - detected_at)` for severity 1-2 incidents | {{INCIDENT_MANAGEMENT_PROVIDER}} | `analytics_{{PROJECT_NAME}}.ops.fct_dora_metrics` | Engineering > DORA, Executive > Operational | Engineering / SRE | < {{MTTR_TARGET}} hours | > 4 hours | Per incident |
| **Change Failure Rate** | Percentage of deployments that cause a degradation in service requiring a hotfix, rollback, or patch. The fourth DORA metric | `Failed Deployments / Total Deployments * 100` | {{CI_CD_PROVIDER}}, {{INCIDENT_MANAGEMENT_PROVIDER}} | `analytics_{{PROJECT_NAME}}.ops.fct_dora_metrics` | Engineering > DORA | Engineering | < 15% | > 30% | Weekly |
| **Infrastructure Cost per User** | Total infrastructure spend divided by MAU. Tracks efficiency of scaling — this number should decrease (or remain stable) as you grow | `Total_Infra_Cost / MAU` | {{CLOUD_PROVIDER}} billing API | `analytics_{{PROJECT_NAME}}.ops.fct_infra_costs` | Engineering > Cost, Executive > Operational | Engineering / Finance | < {{COST_PER_USER_TARGET}} | Increase > 20% MoM | Monthly |

---

## How to Add a New Metric

Adding a metric to this registry is a deliberate act. Do not add metrics speculatively — every metric you add is a metric someone must maintain, verify, and defend.

### Process

1. **Propose** — Open a metric proposal with: name, definition, formula, why it matters, who will own it, and where the raw data comes from. Use the template at the bottom of this file.
2. **Check for duplicates** — Search this registry for existing metrics that measure the same thing under a different name. If one exists, either use the existing metric or propose a formal rename with migration plan.
3. **Define the lineage** — Before any dashboard work, document the full data lineage in `data-lineage-catalog.template.md`: source system, extraction method, staging model, transformation logic, final warehouse table.
4. **Implement the pipeline** — Build the ETL/transform and validate with at least 2 weeks of data before marking the metric as production-ready.
5. **Set thresholds** — Add Green/Yellow/Red thresholds to `alert-threshold-registry.template.md`. If you cannot define what "bad" looks like for this metric, question whether you need it.
6. **Register** — Add the completed row to the appropriate category table above. Update `cross-section-metric-map.md` with the lineage summary.
7. **Announce** — Notify stakeholders that a new metric is available, what it measures, and where to find it.

### New Metric Proposal Template

```
Metric Name:        ___
Category:           Revenue & Growth | Unit Economics | Product Health | Customer Health | Marketing Efficiency | Operational Health
Definition:         ___
Formula:            ___
Why It Matters:     ___
Source System:      ___
Proposed Owner:     ___
Proposed Target:    ___
Alert Thresholds:   Green: ___ | Yellow: ___ | Red: ___
Dashboard Location: ___
Duplicate Check:    [Confirmed no duplicates / Similar to ___ but differs because ___]
```

---

## How to Resolve Metric Definition Disputes

When two teams disagree about what a metric means (and they will), follow this escalation path:

1. **Check this registry.** If the metric is defined here, the registry definition wins. That is the entire point of this document.
2. **If the registry is ambiguous**, the metric owner (listed in the Owner column) has authority to clarify the definition. They update the registry, and the updated definition becomes canonical.
3. **If the dispute crosses ownership boundaries** (e.g., Finance defines churn differently than Product), escalate to {{BI_METRIC_OWNER_DEFAULT}} to facilitate resolution. Both sides present their definition and rationale. The resolution must be documented in this registry with a note explaining why the chosen definition was selected.
4. **If the dispute reveals that one word maps to two legitimately different concepts**, create two separate metrics with distinct names. Example: "Logo Churn Rate" and "Revenue Churn Rate" are both valid, both useful, and should both exist in this registry as separate entries. The problem is not that two definitions exist — the problem is when both are called "churn rate" without qualification.
5. **Never resolve by creating a third metric** that "combines" the two disputed definitions. That gives you three metrics nobody trusts instead of one.

---

## Quarterly Registry Review Checklist

Perform this review every quarter. Schedule it on the calendar. It will not happen otherwise.

- [ ] **Completeness audit** — Are all metrics currently shown on any production dashboard registered here? If a dashboard shows a number that is not in this registry, either register it or remove it from the dashboard.
- [ ] **Staleness check** — Are any metrics in this registry no longer being tracked? Mark them as `[DEPRECATED]` with the deprecation date and reason. Do not delete them — deprecate them.
- [ ] **Definition accuracy** — For each metric, does the definition still match what the underlying SQL/model actually computes? Definitions drift when someone changes a dbt model without updating the registry.
- [ ] **Owner verification** — Is the listed owner still the right person/team? People change roles. Teams get reorganized. Update the owner column.
- [ ] **Target relevance** — Are the targets still appropriate? A 5% MoM MRR growth target that made sense at $50K MRR is unrealistic at $5M MRR. Adjust targets as the business scales.
- [ ] **Threshold tuning** — Review the alert threshold registry. Were any alerts firing too frequently (false positives) or not at all (thresholds too loose)? Adjust. See `alert-threshold-registry.template.md` for threshold tuning guidance.
- [ ] **Cross-reference check** — Do the metrics in Section 19 (marketing), Section 20 (post-launch), Section 25 (financial modeling), and Section 33 (CX ops) still align with the definitions here? If any section was updated, sync the registry.
- [ ] **New metric proposals** — Review any proposed metrics that were not added during the quarter. Accept, reject, or defer each one.
- [ ] **Sign-off** — Registry owner signs off on the review and updates `{{LAST_REGISTRY_REVIEW_DATE}}` and `{{NEXT_REGISTRY_REVIEW_DATE}}` at the top of this file.

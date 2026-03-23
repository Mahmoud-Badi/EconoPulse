# Alert Threshold Registry

> This registry defines the Green/Yellow/Red thresholds for every business metric worth alerting on. It complements Section 09's operational alerting (server health, infrastructure) with business metric alerting (revenue health, customer health, growth health). Section 09 tells you the server is down. This registry tells you the business is in trouble.

**Project:** {{PROJECT_NAME}}
**Registry Owner:** {{BI_METRIC_OWNER_DEFAULT}}
**Last Threshold Review:** {{LAST_THRESHOLD_REVIEW_DATE}}
**Next Scheduled Review:** {{NEXT_THRESHOLD_REVIEW_DATE}}

---

## Severity Definitions

| Level | Meaning | Response Time | Who Gets Notified |
|-------|---------|---------------|-------------------|
| **Green (Healthy)** | Metric is within normal operating range. No action needed. | N/A | Nobody — this is the default state |
| **Yellow (Warning)** | Metric is trending toward a problem or has crossed a soft threshold. Investigate within 24-48 hours. May self-resolve. | 24-48 hours | Metric owner + team channel |
| **Red (Critical)** | Metric has crossed a hard threshold. Active intervention required. This is affecting revenue, customers, or operations in a material way. | 4 hours (business hours) | Metric owner + department head + {{BI_METRIC_OWNER_DEFAULT}} |

---

## Revenue & Growth Thresholds

| Metric | Green (Healthy) | Yellow (Warning) | Red (Critical) | Notification Channel | Escalation Path | Auto-Action |
|--------|-----------------|-------------------|-----------------|---------------------|-----------------|-------------|
| **MRR Growth Rate** | > 5% MoM | 0-5% MoM (stagnation) | < 0% MoM (decline) | `#finance-alerts` | Finance Lead → VP Finance → CEO | None — requires human analysis |
| **Net New MRR** | Positive, on track to target | Positive but < 50% of monthly target at mid-month | Negative (losing more MRR than gaining) | `#finance-alerts` | Finance Lead → VP Finance | Trigger mid-month revenue review meeting |
| **Quick Ratio** | > 4.0 | 2.0 - 4.0 | < 2.0 (adding less than 2x what you lose) | `#finance-alerts` | Finance Lead → VP Finance → CEO | None |
| **MRR** | Above {{MRR_FLOOR}} and trending up | Above {{MRR_FLOOR}} but flat or trending down | Below {{MRR_FLOOR}} | `#executive-alerts` | VP Finance → CEO → Board notification | None |
| **ARR Run Rate** | On track to annual target | > 10% behind annual target pace | > 25% behind annual target pace | `#executive-alerts` | VP Finance → CEO | None |

---

## Unit Economics Thresholds

| Metric | Green (Healthy) | Yellow (Warning) | Red (Critical) | Notification Channel | Escalation Path | Auto-Action |
|--------|-----------------|-------------------|-----------------|---------------------|-----------------|-------------|
| **LTV:CAC Ratio** | 3:1 to 5:1 | 5:1+ (underinvesting) or 2:1-3:1 (marginal) | < 2:1 (unprofitable growth) | `#finance-alerts` | Marketing Lead + Finance Lead → VP | None |
| **CAC** | Below {{CAC_TARGET}} | {{CAC_TARGET}} to {{CAC_CEILING}} | Above {{CAC_CEILING}} | `#marketing-alerts` | Marketing Lead → VP Marketing → CFO | Pause lowest-performing paid channel |
| **CAC Payback Period** | < 12 months | 12-18 months | > 18 months | `#finance-alerts` | Finance Lead → VP Finance → CEO | None |
| **Net Revenue Retention (NRR)** | > 110% | 90-110% (flat: surviving but not expanding) | < 90% (shrinking from within) | `#finance-alerts`, `#cs-alerts` | CS Lead + Finance Lead → VP → CEO | Trigger account-level NRR analysis to identify contraction sources |
| **Gross Revenue Retention (GRR)** | > 90% | 80-90% | < 80% (losing too much base revenue) | `#cs-alerts` | CS Lead → VP CS → CEO | Trigger churn investigation sprint |
| **Gross Margin** | > 70% | 60-70% | < 60% | `#finance-alerts` | Finance Lead → CFO | Flag for cost structure review |
| **ARPU** | Stable or increasing | Declining < 5% MoM | Declining > 10% MoM | `#finance-alerts` | Product Lead + Finance Lead | Investigate: pricing issue, mix shift, or discounting? |

---

## Product Health Thresholds

| Metric | Green (Healthy) | Yellow (Warning) | Red (Critical) | Notification Channel | Escalation Path | Auto-Action |
|--------|-----------------|-------------------|-----------------|---------------------|-----------------|-------------|
| **DAU/MAU Ratio (Stickiness)** | > 25% | 15-25% | < 15% (users sign up but do not come back) | `#product-alerts` | Product Lead → VP Product | None |
| **DAU** | Within 15% of trailing 4-week average | Decline 15-25% WoW | Decline > 25% WoW | `#product-alerts` | Product Lead → VP Product → CTO | Verify not a data pipeline issue before escalating |
| **Activation Rate** | > {{ACTIVATION_RATE_TARGET}}% | 25% - {{ACTIVATION_RATE_TARGET}}% | < 25% | `#product-alerts`, `#growth-alerts` | Product Lead + Growth Lead | None |
| **Time to Value** | < {{TIME_TO_VALUE_TARGET}} min | 1x-2x target | > 2x target | `#product-alerts` | Product Lead | None |
| **Feature Adoption (Core)** | > 60% of MAU | 40-60% of MAU | < 40% of MAU using core feature | `#product-alerts` | Product Lead → VP Product | None |
| **Power User Percentage** | > 15% of MAU | 8-15% of MAU | < 8% of MAU (product lacks depth) | `#product-alerts` | Product Lead | None |

---

## Customer Health Thresholds

| Metric | Green (Healthy) | Yellow (Warning) | Red (Critical) | Notification Channel | Escalation Path | Auto-Action |
|--------|-----------------|-------------------|-----------------|---------------------|-----------------|-------------|
| **Net Promoter Score (NPS)** | > 50 | 20-50 | < 20 (more detractors than promoters) | `#cx-alerts` | CX Lead → VP Product → CEO | Trigger detractor outreach campaign |
| **Customer Satisfaction (CSAT)** | > 90% | 80-90% | < 80% | `#cx-alerts`, `#support-alerts` | Support Lead → CX Lead | Review recent support interactions for systemic issues |
| **Customer Health Score (avg)** | > 70 | 50-70 | < 50 | `#cs-alerts` | CS Lead → VP CS | Trigger at-risk account review |
| **Churn Rate (Logo)** | < 3% monthly | 3-5% monthly | > 5% monthly | `#cs-alerts`, `#executive-alerts` | CS Lead → VP CS → CEO | Trigger win-back campaign for recent churns |
| **Churn Rate (Revenue)** | < 2% monthly | 2-5% monthly | > 5% monthly | `#finance-alerts`, `#executive-alerts` | CS Lead + Finance Lead → CEO | Same as logo churn + financial impact analysis |
| **Involuntary Churn Rate** | < 0.5% monthly | 0.5-1% monthly | > 1% monthly (payment recovery broken) | `#finance-alerts`, `#engineering-alerts` | Finance Lead + Engineering Lead | Review dunning email sequence, check payment processor status |
| **At-Risk Account Count** | < 5% of total accounts | 5-10% of total accounts | > 10% of total accounts | `#cs-alerts` | CS Lead → VP CS | Assign at-risk accounts to CSMs for immediate outreach |
| **Support Ticket Volume** | Within 1.5x rolling 4-week average | 1.5x-2x average (elevated) | > 2x average (something is broken) | `#support-alerts` | Support Lead → CX Lead → Engineering Lead (if product bug suspected) | Cross-reference with deployment log — did a release cause this? |
| **First Response Time** | Within SLA (< {{FIRST_RESPONSE_SLA}} hours) | 1x-2x SLA | > 2x SLA | `#support-alerts` | Support Lead | Auto-assign unresponded tickets to available agents |
| **Resolution Time** | Within SLA (< {{RESOLUTION_SLA}} hours) | 1x-2x SLA | > 2x SLA | `#support-alerts` | Support Lead → CX Lead | Flag for staffing review |

---

## Marketing Efficiency Thresholds

| Metric | Green (Healthy) | Yellow (Warning) | Red (Critical) | Notification Channel | Escalation Path | Auto-Action |
|--------|-----------------|-------------------|-----------------|---------------------|-----------------|-------------|
| **Website Traffic** | Within 20% of target | 20-40% below target | > 40% below target | `#marketing-alerts` | Marketing Lead → VP Marketing | Check for SEO penalty, broken tracking, or seasonal pattern |
| **Visitor to Signup Rate** | > {{VISITOR_SIGNUP_RATE_TARGET}}% | 1%-target | < 1% | `#growth-alerts` | Growth Lead → Marketing Lead | None |
| **Trial to Paid Rate** | > {{TRIAL_CONVERSION_TARGET}}% | 5%-target | < 5% | `#growth-alerts`, `#finance-alerts` | Growth Lead → VP Product → VP Finance | Investigate: pricing issue, activation issue, or wrong audience? |
| **MQL Volume** | > 75% of monthly target | 50-75% of target | < 50% of target | `#marketing-alerts` | Marketing Lead → VP Marketing | Review campaign performance, consider budget reallocation |
| **MQL to SQL Conversion** | > 30% | 15-30% | < 15% (marketing/sales misalignment) | `#marketing-alerts`, `#sales-alerts` | Marketing Lead + Sales Lead | Schedule marketing-sales alignment meeting |
| **Email Click Rate** | > 3% | 1-3% | < 1% | `#marketing-alerts` | Marketing Lead | Review email content and list hygiene |

---

## Operational Health Thresholds

| Metric | Green (Healthy) | Yellow (Warning) | Red (Critical) | Notification Channel | Escalation Path | Auto-Action |
|--------|-----------------|-------------------|-----------------|---------------------|-----------------|-------------|
| **Uptime** | > 99.9% | 99.0-99.9% | < 99.0% | `#engineering-alerts`, `#executive-alerts` | SRE Lead → VP Engineering → CTO → CEO (if SLA breach affects customers) | Integrates with Section 21 incident response — critical uptime breach auto-creates P1 incident |
| **Error Rate (5xx)** | < 0.1% | 0.1-1% | > 1% | `#engineering-alerts` | SRE Lead → Engineering Lead | If > 5% for > 5 minutes, auto-create P1 incident (Section 21 integration) |
| **Error Rate (4xx)** | < 2% | 2-5% | > 5% | `#engineering-alerts` | Engineering Lead | None — usually requires investigation, not incident response |
| **API Latency (p95)** | < 200ms | 200-500ms | > 500ms | `#engineering-alerts` | Engineering Lead → SRE Lead | If > 1000ms for > 10 minutes, auto-create P2 incident |
| **API Latency (p99)** | < 500ms | 500-2000ms | > 2000ms | `#engineering-alerts` | SRE Lead | None |
| **Deployment Frequency** | > {{DEPLOY_FREQUENCY_TARGET}}/week | 50-100% of target | < 50% of target | `#engineering-alerts` | Engineering Lead → VP Engineering | None — investigate blockers in next standup |
| **MTTR** | < {{MTTR_TARGET}} hours | 1x-2x target | > 2x target | `#engineering-alerts` | SRE Lead → VP Engineering | Trigger incident response retrospective |
| **Change Failure Rate** | < 15% | 15-30% | > 30% | `#engineering-alerts` | Engineering Lead → VP Engineering | Review CI/CD pipeline and test coverage |
| **Infrastructure Cost per User** | Stable or decreasing | Increase 10-20% MoM | Increase > 20% MoM | `#finance-alerts`, `#engineering-alerts` | Engineering Lead + Finance Lead | Flag specific resource categories driving the increase |

---

## Integration with Section 21: Incident Response

Business metric alerts and operational incident response must be connected, not siloed. A revenue drop might be caused by an outage. An outage might be invisible until customers start churning.

### When Business Metrics Trigger Incidents

The following business metric thresholds should auto-create or escalate incidents in the Section 21 incident response system:

| Business Metric Alert | Incident Action |
|----------------------|-----------------|
| 5xx error rate > 5% for > 5 minutes | Auto-create P1 incident |
| API latency p95 > 1000ms for > 10 minutes | Auto-create P2 incident |
| Uptime < 99% in trailing 24 hours | Escalate any open incident to P1 |
| Support ticket volume > 3x average within 2 hours | Auto-create P2 incident (potential undetected outage) |
| Involuntary churn rate spikes > 3x in a single day | Alert engineering — possible payment processor outage |

### When Incidents Should Check Business Impact

During any P1 or P2 incident, the incident commander should reference these dashboards to assess business impact:

1. **Revenue impact** — Is MRR being affected? Are payments failing?
2. **Customer impact** — How many active users are affected? What is the support ticket velocity?
3. **Contractual impact** — Are any SLA commitments being breached that trigger credits or penalties?

This information goes into the incident post-mortem and informs severity classification.

---

## Integration with Section 09: Operational Alerting

Section 09 defines infrastructure-level monitoring and alerting. This registry defines business-level alerting. They complement each other:

| Layer | Section 09 (Infrastructure) | Section 35 (Business) |
|-------|----------------------------|----------------------|
| **What it monitors** | CPU, memory, disk, network, process health, certificate expiry | MRR, churn, NPS, conversion rates, unit economics |
| **Alert latency** | Seconds to minutes | Minutes to hours (warehouse-based) |
| **Who responds** | On-call engineer | Metric owner, department head |
| **Resolution** | Restart service, scale infrastructure, roll back deploy | Investigate root cause, adjust strategy, intervene with customers |

**Do not duplicate.** If Section 09 already alerts on 5xx error rate in real-time, Section 35 does not need a real-time 5xx alert. Section 35's value is the trend view — "5xx rate has been creeping up 0.1% per week for a month" — which real-time monitoring misses.

**Do connect.** When Section 09 fires an infrastructure alert, the business metric dashboards should be consulted for impact assessment. When Section 35 detects a business metric anomaly, the infrastructure dashboards should be checked for root cause.

---

## Alert Fatigue Prevention

Alert fatigue is the number one reason alerting systems fail. When everything alerts, nothing alerts — people stop reading notifications. The following policies keep alerts meaningful.

### Threshold Tuning Policy

- **Review thresholds monthly for the first quarter**, then quarterly after stabilization. New thresholds are almost always wrong — they are either too tight (constant false positives) or too loose (miss real problems).
- **Track alert frequency.** If a Yellow alert fires more than 3 times in a month without leading to action, the threshold is too tight. Loosen it or remove the alert.
- **Track alert-to-action ratio.** If fewer than 30% of Red alerts lead to a meaningful intervention, the thresholds need recalibration.

### Snooze Policies

| Scenario | Snooze Duration | Who Can Snooze | Documentation Required |
|----------|----------------|----------------|----------------------|
| Known issue being actively worked | 24 hours (renewable) | Metric owner | Link to tracking issue |
| Seasonal pattern (e.g., holiday traffic drop) | Duration of seasonal period | {{BI_METRIC_OWNER_DEFAULT}} | Written justification with expected return-to-normal date |
| Planned maintenance | Maintenance window + 2 hours | SRE Lead | Maintenance ticket reference |
| Data pipeline issue (metric is wrong, not the business) | Until pipeline is fixed | {{BI_METRIC_OWNER_DEFAULT}} | Pipeline incident reference |

### Deduplication

- If a metric crosses from Green to Yellow and then to Red within the same hour, send only the Red alert (not Yellow then Red).
- If a metric is already in Red and a new data refresh confirms it is still Red, do not re-alert. Alert once, then send a daily summary until resolved.
- Group related alerts: if MRR, NRR, and Churn all go Red simultaneously, send one consolidated alert, not three separate ones. The root cause is likely the same.

---

## Seasonal Adjustment Guidance

Business metrics fluctuate with predictable patterns. An alert system that does not account for seasonality will cry wolf every December and every end-of-quarter.

### Common Seasonal Patterns

| Pattern | Affected Metrics | Typical Impact | Adjustment |
|---------|-----------------|----------------|------------|
| **End of quarter** | MQL, SQL, trial starts, new MRR | Spike (especially in enterprise/sales-led) | Widen Yellow thresholds by 30% for last 2 weeks of quarter; tighten for first 2 weeks (post-rush dip is normal) |
| **Holiday season (Dec 20 - Jan 5)** | DAU, website traffic, support tickets, signup rate | 20-40% decline (B2B); spike (B2C) | Apply B2B or B2C adjustment factor; do not alert on traffic drops during known holiday windows |
| **Annual renewal cycle** | Churn rate, GRR, NRR | Spike in month when first annual cohort renews | Track annual and monthly churn separately; adjust churn thresholds during renewal-heavy months |
| **Major product launch** | DAU, MAU, support tickets, error rate | Spike across all engagement and support metrics | Temporarily widen operational thresholds for 2 weeks post-launch |
| **Budget season (Oct-Nov for calendar-year companies)** | MQL, SQL, new deals | Slowdown as prospects defer decisions | Note in alert context, do not loosen thresholds (pipeline slowdown here predicts Q1 problems) |

### How to Apply Seasonal Adjustments

1. **Document the pattern.** Before adjusting any threshold, write down which metrics are affected, when, and by how much based on historical data.
2. **Create named seasonal profiles** (e.g., "holiday-b2b", "quarter-end", "post-launch") in your alerting tool.
3. **Apply profiles on a schedule.** Do not adjust thresholds manually each time — that is how you forget to revert.
4. **Always revert.** Every seasonal adjustment has an end date. Set a calendar reminder to revert to standard thresholds.
5. **Re-validate annually.** Last year's seasonal patterns may not hold this year. Compare actual vs. predicted seasonal impact and update profiles.

---

## Weekly Alert Review

Every Monday (or the first business day of the week), the metric owner for each department reviews:

- [ ] **Alerts fired last week** — Were they legitimate? Did they lead to action? If not, why?
- [ ] **Alerts that should have fired but did not** — Were there business problems last week that the alerting system missed? If so, add or tighten thresholds.
- [ ] **Currently open Yellow/Red states** — What is still in warning or critical? What is the remediation status?
- [ ] **Upcoming seasonal adjustments** — Are any seasonal profiles about to activate or expire?
- [ ] **Threshold change proposals** — Based on last week's experience, should any thresholds be adjusted?

This review takes 15 minutes. It prevents the alerting system from rotting. Skip it for a month and you will be back to ignoring alerts by month two.

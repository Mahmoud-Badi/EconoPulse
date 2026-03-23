# Status Page Strategy

> Your public commitment to transparency. A well-run status page builds trust; a neglected one destroys it.

---

## Why You Need a Status Page

A status page is not optional for any production service. Without one, customers have no way to distinguish between "the service is down" and "my internet is broken." They flood your support queue, they post on social media, and they lose trust. A status page gives customers a single source of truth and gives your team a structured way to communicate during incidents.

The goal is not to hide problems. It is to communicate them clearly and consistently so customers know you are aware, working on it, and competent.

---

## Provider Comparison

| Feature | Statuspage (Atlassian) | Instatus | BetterUptime | Self-Hosted (Cachet/Gatus) |
|---------|----------------------|----------|--------------|---------------------------|
| **Pricing** | Free tier (1 page), $29+/mo for teams | Free tier, $20+/mo | Free tier, $20+/mo | Free (hosting costs only) |
| **Custom domain** | Paid plans only | All plans | Paid plans | Yes |
| **Subscriber notifications** | Email, SMS, webhook | Email, SMS, webhook, Slack | Email, SMS, Slack, webhook | Depends on implementation |
| **API** | Full REST API | REST API | REST API | Depends on tool |
| **Incident management** | Built-in | Built-in | Built-in with monitoring | Manual or scripted |
| **Uptime monitoring** | Separate (via Opsgenie) | Built-in | Built-in (core feature) | Built-in (Gatus) |
| **Maintenance windows** | Yes | Yes | Yes | Manual |
| **Component groups** | Yes | Yes | Yes | Depends on tool |
| **Third-party integrations** | Jira, PagerDuty, Datadog, etc. | Slack, PagerDuty, Datadog | Slack, PagerDuty, Datadog | Limited |
| **SSO/Team management** | Enterprise plan | Business plan | Business plan | Self-managed |
| **Historical uptime** | 90 days (free), unlimited (paid) | Configurable | 90+ days | Configurable |
| **Best for** | Teams already using Atlassian tools | Clean UI, modern startups | Teams wanting monitoring + status in one tool | Full control, privacy-conscious teams |

### Recommendation by Team Size

| Team Size | Budget | Recommended Provider | Why |
|-----------|--------|---------------------|-----|
| Solo / tiny | $0 | BetterUptime free tier | Monitoring + status page in one tool |
| Small (2-5) | $20-50/mo | Instatus | Clean, fast, good free tier, modern API |
| Medium (5-15) | $50-100/mo | Statuspage (Atlassian) | Deep integrations with Jira, PagerDuty, Confluence |
| Large (15+) | $100+/mo | Statuspage (Atlassian) Business/Enterprise | SSO, team management, SLA reporting |
| Privacy-first | Hosting costs | Gatus (self-hosted) | Full control, no third-party data sharing |

---

## Component Definitions

Define what you monitor and show on your status page. Not every internal service needs a public component.

### Recommended Components

| Component | What It Covers | Public? | Impact Level |
|-----------|---------------|---------|-------------|
| **Web Application** | Main user-facing website/app | Yes | Critical |
| **API** | REST/GraphQL API endpoints | Yes | Critical |
| **Authentication** | Login, signup, SSO, session management | Yes | Critical |
| **Database** | Primary data store availability | No (show as "Core Services") | Critical |
| **Payments / Billing** | Payment processing, subscription management | Yes | Critical |
| **Email Notifications** | Transactional email delivery | Yes | High |
| **File Storage / CDN** | File uploads, downloads, media serving | Yes | High |
| **Search** | Search functionality | Yes (if core feature) | Medium |
| **Webhooks** | Outbound webhook delivery | Yes (if offered) | Medium |
| **Admin Dashboard** | Internal admin panel | No | Low |
| **Background Jobs** | Async processing, queues | No (show impact on user-facing features) | Medium |
| **Third-Party Integrations** | External service connections (Stripe, Twilio, etc.) | Yes (grouped) | Varies |

### Component Grouping

Group related components to keep the status page readable:

```
Core Services
  - Web Application
  - API
  - Authentication

Data & Storage
  - Database (shown as "Core Services" or omit)
  - File Storage / CDN

Communication
  - Email Notifications
  - Webhooks

Integrations
  - Payment Processing
  - Third-Party Services
```

### Component Status Values

| Status | Meaning | Visual |
|--------|---------|--------|
| **Operational** | Everything is working normally | Green |
| **Degraded Performance** | Slower than normal but functional | Yellow |
| **Partial Outage** | Some users or features affected | Orange |
| **Major Outage** | Service is down or severely broken | Red |
| **Under Maintenance** | Planned downtime in progress | Blue |

---

## Incident Communication Cadence

How often to update the status page during an active incident.

### By Severity Level

| Severity | First Update | Subsequent Updates | Status Transitions |
|----------|-------------|-------------------|-------------------|
| SEV1 | Within 10 minutes of detection | Every 30 minutes minimum | Investigating -> Identified -> Monitoring -> Resolved |
| SEV2 | Within 15 minutes of detection | Every 60 minutes minimum | Investigating -> Identified -> Monitoring -> Resolved |
| SEV3 | Within 1 hour (if customer-visible) | At key milestones only | Investigating -> Resolved |
| SEV4 | Not posted | N/A | N/A |

### Status Page Incident Lifecycle

```
1. INVESTIGATING
   "We are aware of an issue affecting [component] and are investigating."
   [Posted immediately upon incident declaration]

2. IDENTIFIED
   "We have identified the cause and are working on a fix."
   [Posted when root cause is known]

3. MONITORING
   "A fix has been implemented and we are monitoring the results."
   [Posted when mitigation is applied and service appears restored]

4. RESOLVED
   "This incident has been resolved."
   [Posted after 15-30 minutes of stable monitoring]
```

### Update Rules

1. **Never go silent.** If you said "next update in 30 minutes," post an update in 30 minutes even if the only update is "still investigating."
2. **Be specific.** "We are investigating elevated error rates on the API" not "We are investigating an issue."
3. **Acknowledge impact.** "Some users may experience slow page loads" not "Minor performance impact."
4. **Set expectations.** "We expect to have more information within the next 30 minutes."
5. **Do not over-promise.** "We are working to restore service as quickly as possible" not "This will be fixed in 10 minutes."

---

## Maintenance Window Protocol

### Minimum Lead Time

| Maintenance Type | Minimum Notice | Recommended Notice |
|-----------------|---------------|-------------------|
| No user impact | 24 hours | 48 hours |
| Brief interruption (<5 min) | 48 hours | 72 hours |
| Extended downtime (5-60 min) | 72 hours | 1 week |
| Major migration/downtime (>1 hr) | 1 week | 2 weeks |
| Emergency maintenance | As soon as possible | As soon as possible |

### Maintenance Window Best Practices

1. **Schedule during lowest traffic.** Check your analytics for the lowest-traffic time window. Typically early morning on a weekday (Tuesday-Thursday) for B2B, late night for B2C.
2. **Never schedule maintenance on Friday.** If something goes wrong, you are debugging on the weekend.
3. **Provide a clear start time, end time, and expected impact.** "Maintenance will occur from 02:00-04:00 UTC. During this window, file uploads may be temporarily unavailable."
4. **Send reminders.** Notify at scheduling time, 24 hours before, and 1 hour before.
5. **Update the status page before, during, and after.** Move the component to "Under Maintenance" at start, back to "Operational" at completion.
6. **Have a rollback plan.** If the maintenance goes wrong, you need to be able to abort and restore service.

### Maintenance Announcement Template

```
Scheduled Maintenance: [Component Name]
Date: [Day, Date]
Time: [Start] - [End] (UTC)
Expected Impact: [What users will experience]
Reason: [Brief, non-technical explanation]

We will update this page when maintenance begins and when it is complete.
```

---

## Public vs. Internal Status

Not everything belongs on the public status page. Use an internal status page or dashboard for operational details.

### Public Status Page Shows

- User-facing component health
- Active incidents with customer-friendly descriptions
- Scheduled maintenance windows
- Historical uptime (90-day view)
- Subscriber signup for notifications

### Internal Status Page / Dashboard Shows

- All components including internal services
- Detailed metrics (latency, error rates, resource utilization)
- Deployment status
- Alert status and on-call information
- Incident timeline with technical details
- Database replication lag, queue depths, cache hit rates

### What to NEVER Show Publicly

- Internal infrastructure details (server names, IP addresses, cloud regions)
- Technical root cause details during an active incident
- Customer-specific impact (names, account numbers)
- Security vulnerability details
- Anything that could help an attacker

---

## Subscriber Notification Strategy

### Notification Channels

| Channel | Best For | Setup |
|---------|----------|-------|
| **Email** | All subscribers — primary channel | Automatic via status page provider |
| **SMS** | Critical notifications only (SEV1/SEV2) | Optional subscriber opt-in |
| **Slack/Teams webhook** | Engineering and ops teams | Configure per-channel |
| **RSS feed** | Power users and monitoring tools | Automatic via status page provider |
| **Twitter/X** | Public awareness during major outages | Manual posting |

### Notification Rules

| Event | Email | SMS | Webhook |
|-------|-------|-----|---------|
| SEV1 incident created | Yes | Yes | Yes |
| SEV2 incident created | Yes | Optional | Yes |
| SEV3 incident created | Yes | No | Yes |
| Incident updated | Yes (digest, not every update) | No | Yes |
| Incident resolved | Yes | Yes (if notified of creation) | Yes |
| Maintenance scheduled | Yes | No | Yes |
| Maintenance started | No | No | Yes |
| Maintenance completed | Yes | No | Yes |

### Subscriber Segmentation

If your status page provider supports it, segment subscribers:

| Segment | Receives Notifications For |
|---------|--------------------------|
| All components | Everything |
| API only | API incidents and maintenance |
| Specific component | That component only |
| Major incidents only | SEV1 and SEV2 only |

---

## Integration with Monitoring Tools

### Automated Status Updates

Where possible, connect your monitoring to your status page for automated component health updates:

| Monitoring Tool | Integration Method | Supported Providers |
|----------------|-------------------|-------------------|
| Datadog | Webhook or native integration | Statuspage, Instatus, BetterUptime |
| PagerDuty | Bi-directional integration | Statuspage (native), others via webhook |
| Opsgenie | Webhook integration | Statuspage, Instatus |
| UptimeRobot | Webhook | Instatus, BetterUptime |
| Prometheus/Grafana | Webhook via Alertmanager | All (via API) |
| AWS CloudWatch | SNS -> Lambda -> API | All (via custom Lambda) |

### Automation Flow

```
Monitoring detects issue
  |
  v
Alert fires in on-call tool
  |
  v
On-call engineer assesses severity
  |
  v
[Automated] Status page component set to "Degraded" or "Outage"
  |
  v
[Manual] Incident created on status page with description
  |
  v
[Automated] Subscriber notifications sent
  |
  v
[Manual] Updates posted per communication cadence
  |
  v
[Manual] Incident resolved, component set to "Operational"
  |
  v
[Automated] Resolution notification sent to subscribers
```

**Recommendation:** Automate component health transitions (operational -> degraded -> outage) based on monitoring thresholds. Keep incident descriptions and updates manual — humans write better customer-facing communication than automated templates.

---

## Status Page Audit Checklist

Review your status page quarterly:

- [ ] All public-facing components are represented
- [ ] Component descriptions are accurate and current
- [ ] Status page URL is linked from your app (footer, help page, docs)
- [ ] Subscriber notification channels are working (send a test)
- [ ] Maintenance windows are being announced with proper lead time
- [ ] Historical data is accurate (no incidents missing)
- [ ] Status page reflects reality — if it says "operational" but your monitoring shows degradation, something is misconfigured
- [ ] At least one incident in the last 90 days has been publicly documented (if your status page is always green, customers will not trust it)
- [ ] Team knows how to update the status page (run a drill)
- [ ] Mobile access works (you might need to update the status page from your phone at 3 AM)

# SEO Incident Response Runbook

When organic traffic drops, rankings disappear, or Google slaps you with a manual penalty, the response needs to be fast, structured, and calm. This runbook defines severity levels, response procedures, and communication templates for SEO-specific incidents.

For general incident response procedures, see `21-incident-response/`. This document extends that framework with SEO-specific severity definitions, diagnostics, and recovery paths.

---

## SEO Severity Levels

### Sev-1: Critical — Immediate Response Required

**Definition:** The site's organic presence is fundamentally compromised.

| Trigger | Example |
| ------- | ------- |
| Manual penalty (site-wide) | Google Search Console shows "Manual Actions" across entire site |
| Site deindexed | `site:yourdomain.com` returns zero results |
| Domain hijacked | DNS records changed, domain pointing elsewhere |
| robots.txt blocking entire site | `Disallow: /` in production robots.txt |
| Sitewide noindex deployed | Meta noindex tag on all pages (staging config leaked to prod) |
| SSL certificate expired site-wide | HTTPS errors on every page, browsers showing security warnings |

**Response time:** Within 1 hour of detection.
**Notification:** VP/Director of Marketing, CTO, CEO (if public-facing impact).
**Expected resolution:** Same day for technical issues (robots.txt, noindex, SSL). Days to weeks for manual penalties.

### Sev-2: High — Same-Day Response

**Definition:** Major organic traffic or visibility loss requiring urgent diagnosis.

| Trigger | Example |
| ------- | ------- |
| >30% organic traffic drop (sustained 3+ days) | GA4 shows 30%+ decline in organic sessions vs. prior period |
| Core Web Vitals failing site-wide | All pages in "Poor" CWV bucket in Search Console |
| XML sitemap blocked or returning errors | Sitemap returning 404/500, or blocked by robots.txt |
| SSL expired on key subdomain | Blog or product subdomain showing certificate errors |
| Googlebot blocked by firewall/WAF | Server logs show 403/429 responses to Googlebot |
| Key landing pages returning 404/500 | Top 10 organic pages all broken |

**Response time:** Within 4 hours of detection.
**Notification:** SEO Lead, Engineering Lead, Marketing Director.
**Expected resolution:** 1-3 days for technical issues. 2-4 weeks for algorithm-related drops.

### Sev-3: Medium — Next Business Day Response

**Definition:** Notable organic performance decline or indexation issues on a subset of pages.

| Trigger | Example |
| ------- | ------- |
| 10-30% organic traffic drop | Sustained decline over 1+ week |
| Key term ranking drops (top 5 terms) | Primary keywords dropped from page 1 to page 2+ |
| Indexation issues on page subset | 50+ pages suddenly "Excluded" in Coverage report |
| Crawl budget waste detected | Googlebot spending crawl budget on parameter URLs, infinite facets |
| Significant new 404s from organic | 404 spike in Search Console covering previously-ranking URLs |
| Competitor overtook key positions | Lost #1 ranking for brand term or primary keyword |

**Response time:** Within 24 hours.
**Notification:** SEO Lead, Content Lead.
**Expected resolution:** 1-2 weeks.

### Sev-4: Low — Scheduled Response

**Definition:** Minor fluctuations or isolated issues that should be monitored but do not require urgent action.

| Trigger | Example |
| ------- | ------- |
| <10% organic traffic drop | Could be normal volatility |
| Minor ranking fluctuations | Position 3 → 5 on secondary keywords |
| Isolated CWV issues | 2-3 pages with poor CWV scores |
| New crawl errors (small count) | <20 new 404s or soft errors |
| Schema validation warnings | Non-critical structured data warnings |

**Response time:** Within 1 week (address in next monthly audit).
**Notification:** SEO Lead (log in monthly audit).
**Expected resolution:** Addressed in regular optimization cycle.

---

## First-Response Checklist (First 30 Minutes)

When a potential SEO incident is detected, run through this checklist before escalating:

### 1. Verify the Data (5 min)

- [ ] Is the measurement correct? Check GA4 tracking code is still deployed.
- [ ] Has a GA4 filter, view, or property changed?
- [ ] Is the date range comparison correct (watch for holidays, weekends)?
- [ ] Check a second data source (GSC if you saw the drop in GA4, or vice versa).
- [ ] Check real-time GA4 — is organic traffic flowing right now?

### 2. Check for Obvious Technical Issues (10 min)

- [ ] Is the site up? Check from multiple locations (use downdetector or uptime monitor).
- [ ] Check `robots.txt` in production: `curl -s https://yourdomain.com/robots.txt`
- [ ] Check for `noindex` meta tags on key pages: `curl -s https://yourdomain.com/ | grep -i noindex`
- [ ] Check SSL certificate expiry: `echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates`
- [ ] Check Search Console for manual actions (Search Console → Security & Manual Actions → Manual Actions).
- [ ] Check Search Console for security issues.
- [ ] Check recent deployments — did anything ship in the last 48 hours?

### 3. Assess Scope (10 min)

- [ ] Is the drop site-wide or page-specific?
- [ ] Is it affecting all search engines or just Google?
- [ ] Is it affecting all countries/languages or specific ones?
- [ ] What page types are affected (blog, product, landing pages)?
- [ ] When exactly did the drop start? (Narrow to the day in GSC.)

### 4. Check External Factors (5 min)

- [ ] Was there a confirmed Google algorithm update? Check:
  - [Google Search Status Dashboard](https://status.search.google.com/summary)
  - [Search Engine Roundtable](https://www.seroundtable.com/)
  - [Semrush Sensor](https://www.semrush.com/sensor/)
  - [MozCast](https://moz.com/mozcast/)
- [ ] Did a major competitor launch new content or a campaign?
- [ ] Is there a seasonal explanation? (Check Google Trends for your primary queries.)

---

## Response Procedures by Severity

### Sev-1 Response Procedure

```
MINUTE 0-15:    Verify incident is real (First-Response Checklist items 1-2)
MINUTE 15-30:   Identify root cause category (technical, penalty, hijack)
MINUTE 30-60:   Implement immediate fix if technical (revert deploy, fix robots.txt, etc.)
HOUR 1-2:       If penalty/hijack → escalate to CTO + legal (for hijack)
HOUR 2-4:       Send internal notification (use template below)
HOUR 4-24:      Begin recovery procedure (see penalty-recovery.md for manual actions)
DAY 1-7:        Daily monitoring and stakeholder updates
```

**Escalation path:** SEO Lead → Marketing Director → CTO → CEO (for domain hijack or deindex)

### Sev-2 Response Procedure

```
HOUR 0-4:       Complete First-Response Checklist
HOUR 4-8:       Deep diagnosis using traffic-drop-diagnosis.md flowchart
DAY 1-2:        Implement fixes for identified issues
DAY 2-7:        Monitor recovery
WEEK 2:         Assess if further action needed
```

**Escalation path:** SEO Lead → Marketing Director → Engineering Lead (if technical root cause)

### Sev-3 Response Procedure

```
DAY 0-1:        Complete First-Response Checklist
DAY 1-3:        Diagnosis using traffic-drop-diagnosis.md flowchart
DAY 3-7:        Implement fixes
WEEK 2-4:       Monitor recovery
```

**Escalation path:** SEO Lead → Content Lead / Engineering Lead (depending on root cause)

### Sev-4 Response Procedure

```
Log the issue in the monthly audit checklist.
Address during the next regular optimization cycle.
No escalation unless the issue persists or worsens.
```

---

## Communication Templates

### Internal Notification — Initial Alert

```
Subject: [SEV-X] SEO Incident — [Brief Description]

Team,

We have detected an SEO incident requiring attention.

**Severity:** Sev-X
**Detected:** YYYY-MM-DD HH:MM UTC
**Impact:** [What is affected — traffic, rankings, indexation]
**Scope:** [Site-wide / specific pages / specific keywords]
**Current status:** Investigating / Root cause identified / Fix deployed

**What we know:**
- [Fact 1]
- [Fact 2]

**What we don't know yet:**
- [Unknown 1]

**Immediate actions taken:**
- [Action 1]
- [Action 2]

**Next update:** [Time — within 2 hours for Sev-1, within 24 hours for Sev-2]

— [Your Name], SEO Lead
```

### Stakeholder Update — Ongoing

```
Subject: [SEV-X] SEO Incident Update #N — [Brief Description]

**Status:** Investigating / Fix deployed / Monitoring recovery
**Time since detection:** X hours/days

**Progress since last update:**
- [What was done]
- [What was learned]

**Current metrics:**
- Organic traffic: [current] vs [normal] ([X% down/up])
- Key rankings: [status]
- Indexation: [status]

**Next steps:**
- [Planned action 1]
- [Planned action 2]

**Expected resolution:** [Estimate]
**Next update:** [Time]

— [Your Name], SEO Lead
```

---

## Post-Incident Review Template

Conduct within 1 week of incident resolution (for Sev-1 and Sev-2).

```markdown
## SEO Incident Post-Mortem

**Incident ID:** SEO-INC-YYYY-XXX
**Severity:** Sev-X
**Duration:** [Detection time] to [Resolution time]
**Impact:** [Estimated lost traffic / revenue during incident]

### Timeline

| Time | Event |
| ---- | ----- |
| YYYY-MM-DD HH:MM | Incident began (estimated) |
| YYYY-MM-DD HH:MM | Incident detected |
| YYYY-MM-DD HH:MM | First response initiated |
| YYYY-MM-DD HH:MM | Root cause identified |
| YYYY-MM-DD HH:MM | Fix deployed |
| YYYY-MM-DD HH:MM | Recovery confirmed |

### Root Cause

[Detailed explanation of what caused the incident]

### Detection

- How was the incident detected? [Automated alert / manual check / user report]
- How long between incident start and detection? [Duration]
- Could we have detected it faster? [Yes/No — how?]

### Response Assessment

- Was the severity correctly assessed? [Yes/No]
- Was the response time appropriate? [Yes/No]
- Were the right people notified? [Yes/No]
- Were any unnecessary escalations made? [Yes/No]

### Recovery

- What fixed the issue?
- How long did recovery take after the fix was deployed?
- Is recovery complete or ongoing?

### Prevention

| Action Item | Owner | Due Date | Status |
| ----------- | ----- | -------- | ------ |
| [Preventive measure 1] | | | |
| [Preventive measure 2] | | | |
| [Monitoring improvement] | | | |

### Lessons Learned

- [Lesson 1]
- [Lesson 2]
```

---

## On-Call Responsibilities for SEO Incidents

### Who Monitors What

| Monitor | Frequency | Responsible | Escalation Trigger |
| ------- | --------- | ----------- | ------------------ |
| Google Search Console (manual actions, security) | Daily (automated alert preferred) | SEO Lead | Any manual action or security issue |
| Organic traffic (GA4) | Daily | SEO Lead | >15% day-over-day drop sustained 2+ days |
| Uptime / availability | Continuous (automated) | Engineering on-call | Any downtime |
| Core Web Vitals | Weekly | Frontend Lead | Site-wide CWV regression |
| robots.txt changes | On every deploy (CI/CD check) | DevOps | Any change to robots.txt in production |
| SSL certificate expiry | Automated 30-day warning | DevOps | Certificate expiring within 14 days |

### Automated Alerts to Configure

1. **Google Search Console email alerts** — Enable for all properties (manual actions, security issues, coverage spikes).
2. **GA4 custom alert** — Organic sessions drop >20% compared to same day last week.
3. **Uptime monitoring** — Pingdom, UptimeRobot, or equivalent on key landing pages.
4. **robots.txt CI/CD check** — Fail the deploy if robots.txt contains `Disallow: /` on production branch.
5. **SSL monitor** — Alert 30 days before certificate expiry.
6. **Deploy diff check** — Flag any deploy that modifies meta robots, canonical tags, or sitemap references.

---

## Cross-References

- **General incident response:** `21-incident-response/`
- **Traffic drop diagnosis:** `36-seo/incident/traffic-drop-diagnosis.md`
- **Algorithm update playbook:** `36-seo/incident/algorithm-update-playbook.md`
- **Penalty recovery:** `36-seo/incident/penalty-recovery.md`
- **Monthly audit (prevention):** `36-seo/audit/monthly-audit-checklist.md`

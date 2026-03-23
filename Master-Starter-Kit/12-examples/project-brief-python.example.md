# PROJECT BRIEF: DataPulse
# ============================================================
# EXAMPLE FILE — This is a fictional project brief for a Python/Django SaaS.
# Demonstrates how the project brief template works for non-JavaScript stacks.
# Your project's brief will be generated from the template
# in 00-discovery/project-brief.template.md
# ============================================================

> Generated from Phase 0 Discovery Interview on 2026-02-15
> Status: APPROVED
> Last updated: 2026-02-15

---

## 1. What It Does

**One-sentence summary:** DataPulse is a self-service analytics dashboard that helps small businesses understand their sales, marketing, and customer data without needing a data team.

**Expanded description:**
Small businesses generate data across dozens of tools — Shopify, Stripe, Mailchimp, Google Analytics, QuickBooks — but have no way to see the full picture. DataPulse connects to these data sources, normalizes the data, and presents it in pre-built dashboards tailored to small business KPIs.

Unlike enterprise BI tools (Looker, Tableau, Power BI), DataPulse requires zero SQL knowledge and zero configuration. Users connect a data source, and within minutes they see dashboards that answer their most common questions: "What are my best-selling products?", "Which marketing channel has the best ROI?", "Am I on track for my monthly revenue goal?"

**Core loop (the ONE thing users do every day):**
Open the dashboard, check the daily revenue summary, spot anomalies, and drill down into specific metrics.

---

## 2. Business Model

**Customer type:** B2B (small businesses, 1-50 employees)

**Revenue model:** Subscription (per-workspace, tiered by data sources connected)

**Pricing notes:**
- Free: 2 data sources, 7-day retention, 1 user
- Starter ($29/mo): 5 data sources, 90-day retention, 3 users
- Growth ($79/mo): Unlimited sources, 1-year retention, 10 users, custom dashboards
- Business ($199/mo): Everything + API access, white-label, priority support

---

## 3. Current State

**Existing system:** None (greenfield)

**What's broken about the current approach:**
- Small businesses export CSVs from each tool and paste into Google Sheets
- No automated data refresh — reports are always stale
- Business owners spend 3-5 hours/week manually assembling reports

**What works well and must be preserved:**
- N/A (greenfield)

---

## 4. User Types

| Role | Description | Key Daily Workflow | Biggest Frustration | Platform |
|------|-------------|-------------------|---------------------|----------|
| Business Owner | Founder/CEO of small business | Check revenue dashboard, review weekly trends | "I don't know if we're on track until month-end" | Desktop + Mobile |
| Marketing Manager | Runs campaigns across channels | Check campaign ROI, compare channels | "I can't see which channel actually drives purchases" | Desktop |
| Bookkeeper | Manages financials | Reconcile revenue data, export reports | "Numbers never match between Stripe and QuickBooks" | Desktop |

**Critical user type for day one:** Business Owner — they are the buyer and the primary daily user.

**Total user types:** 3

**Accessibility requirements:** WCAG 2.1 AA (standard web accessibility)

**User count targets:**
- Launch: 200 workspaces
- Year 1: 5,000 workspaces

---

## 5. Competitors

| Competitor | What They Do Well | What They Do Poorly | Key Feature to Steal |
|------------|-------------------|---------------------|---------------------|
| Databox | Beautiful mobile dashboards | Complex setup, expensive for small biz | Mobile-first dashboard design |
| Klipfolio | Flexible data modeling | Requires technical knowledge | Custom metric builder |
| Google Looker Studio | Free, powerful | Steep learning curve, no pre-built templates | Data source connector library |

**Competitive positioning:** DataPulse is the "Squarespace of analytics" — pre-built, opinionated dashboards that work out of the box for small businesses, with zero configuration.

---

## 6. Tech Stack (Finalized)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Backend | Django 5.2 + Django REST Framework | Mature, batteries-included, great ORM |
| Frontend | htmx + Alpine.js + Tailwind CSS | Server-rendered with progressive enhancement, minimal JS |
| Database | PostgreSQL 16 (Supabase) | JSON support for flexible metric storage, proven scale |
| Cache | Redis (Upstash) | Dashboard query caching, Celery broker |
| Task Queue | Celery + Redis | Background data sync jobs |
| Auth | django-allauth | Social login (Google), magic links, team invitations |
| Testing | pytest + pytest-django + Playwright | Unit + integration + E2E |
| Linting | ruff + mypy | Fast linting + strict type checking |
| Data Connectors | Custom + Singer taps | ETL pipeline for each data source |
| Charts | Apache ECharts | High-performance, customizable charts |

**Stack source:** User preference (Python ecosystem expertise)

**Non-default choices and rationale:**
htmx over React — the team has deep Python experience and wants to keep the frontend simple. Dashboard interactivity (drill-down, filtering) is handled with htmx partial swaps and Alpine.js for client-side state. This avoids a separate frontend build pipeline entirely.

---

## 7. Integrations Required

| Service | Purpose | Phase | Mock Strategy |
|---------|---------|-------|---------------|
| Stripe | Payment data source + billing | Phase 1 | Stripe test mode |
| Shopify | E-commerce data source | Phase 1 | Fixture data in JSON |
| Google Analytics | Web traffic data source | Phase 2 | GA4 demo account |
| Mailchimp | Email marketing data source | Phase 2 | API sandbox |
| QuickBooks | Accounting data source | Phase 3 | Intuit sandbox |
| Resend | Transactional email | Phase 1 | Console output in dev |

**Total integrations:** 6
**MVP integrations (Phase 0-2):** Stripe, Shopify, Google Analytics, Mailchimp, Resend
**Post-MVP integrations:** QuickBooks

---

## 8. Compliance Requirements

| Regulation | Applicable? | Impact |
|------------|-------------|--------|
| HIPAA | No | N/A |
| PCI DSS | No (Stripe handles payment data) | N/A |
| SOC 2 | No (future consideration for Growth plan) | N/A |
| GDPR | Yes | Data processing agreements, right to deletion, consent |

**Compliance summary:** Primary concern is GDPR since we store business data from EU customers. All data source connections must support deletion, and users must be able to export/delete their workspace data.

---

## 9. Deployment & Infrastructure

**Deployment target:** Railway (backend) + Vercel (static assets/CDN)

**Database hosting:** Supabase (managed PostgreSQL)

**Multi-tenancy:** Row-level (workspace_id on every table)

**Environment strategy:**
- Development: Local (Docker Compose for Postgres + Redis)
- Staging: Railway preview environments
- Production: Railway production

**CI/CD:** GitHub Actions (pytest + mypy + ruff + Playwright)

---

## 10. Scale Targets

| Metric | Launch | 6 Months | 1 Year |
|--------|--------|----------|--------|
| Workspaces | 200 | 2,000 | 5,000 |
| Concurrent users | 50 | 500 | 1,500 |
| Data volume | 10 GB | 500 GB | 2 TB |
| API requests/day | 10,000 | 200,000 | 1,000,000 |

**Scale-driven architecture decisions:**
Dashboard queries are cached in Redis with a 5-minute TTL. Background Celery tasks refresh data on a schedule (hourly for most sources, real-time for Stripe webhooks). This means the web server never queries data sources directly.

---

## 11. Team

| Member | Role | Availability | Experience Level |
|--------|------|-------------|-----------------|
| Sarah Chen | Full-stack (Python focus) | Full-time | Senior |
| Marcus Rivera | Backend + data pipelines | Part-time (20 hrs/week) | Mid |

**QA strategy:** Automated (pytest + Playwright) + self-test

**Estimated feature velocity:** 2 features per week

---

## 12. Timeline

| Milestone | Target Date | Scope |
|-----------|------------|-------|
| MVP | 2026-04-15 | 2 data sources (Stripe + Shopify), 3 pre-built dashboards |
| Beta | 2026-06-01 | 4 data sources, custom dashboard builder, team features |
| Launch | 2026-07-15 | Full feature set, billing, onboarding |

**Available development time:** 8 weeks to MVP

**Feasibility check:**
- Features requested: 18
- Max features achievable: 1.5 devs x 2 features/week x 8 weeks = 24
- Assessment: FEASIBLE

---

## 13. Tribunal Notes

- Business owners check dashboards on mobile 60% of the time — responsive design is critical, but a native mobile app is not needed for MVP
- Shopify merchants are the most likely early adopters (clear pain point, willingness to pay for tools)
- Data freshness expectations vary: revenue data should be near-real-time (webhook), marketing data can be hourly
- Singer taps exist for most target data sources but quality varies — build custom connectors for Stripe and Shopify, use Singer for the rest

---

## 14. Open Questions

- [ ] Should the free tier include Stripe only or Stripe + Shopify?
- [ ] Do we need a data warehouse layer (e.g., DuckDB) for complex queries, or is PostgreSQL sufficient at launch scale?

---

## 15. Next Steps

1. [x] User reviews and approves this brief
2. [ ] Resolve all Open Questions above
3. [ ] Proceed to **01-research/** for competitor analysis and persona development
4. [ ] Proceed to **02-architecture/** for technical design

---

*This brief was generated by Claude during Phase 0: Discovery.*
*This is an EXAMPLE showing how the template works for a Python/Django stack.*

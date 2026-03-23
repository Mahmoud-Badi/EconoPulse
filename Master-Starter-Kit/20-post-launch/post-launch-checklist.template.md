# Post-Launch Checklist

> **A phased verification system for {{PROJECT_NAME}} that ensures nothing falls through the cracks in the critical first 90 days after launch.** Each phase builds on the previous one. Do not skip ahead.

---

## How to Use This Checklist

Work through each phase sequentially. Check off items as you complete them. If an item fails, fix it before moving to the next phase. The first 90 days after launch are when most products either establish a healthy operating rhythm or accumulate the neglect that kills them six months later.

**Ownership:** Assign a single person (or yourself, if solo) as the post-launch owner. Every item needs a name next to it, not "the team."

---

## Phase 1: Day 1 (Launch Day Verification)

**Goal:** Confirm that production is stable, monitoring is active, and users can complete core flows.

### Production Health

- [ ] **Application is accessible** — Load the production URL in an incognito browser window. Verify it loads in under 3 seconds.
- [ ] **SSL certificate is valid** — Check the padlock icon. Verify the certificate is not self-signed and expiration is 60+ days out.
- [ ] **DNS is resolving correctly** — Run `dig {{PROJECT_NAME}}.com` (or your domain). Verify A/CNAME records point to production.
- [ ] **CDN is serving static assets** — Open DevTools > Network. Verify CSS, JS, and images come from your CDN, not the origin server.
- [ ] **Environment variables are production values** — Check that no staging/dev API keys leaked into production. Look for `localhost` references in network calls.

### Monitoring Verification

- [ ] **Error tracking is receiving events** — Trigger a deliberate error (e.g., visit a 404 page). Verify it appears in {{MONITORING_PROVIDER}} within 5 minutes.
- [ ] **Uptime monitoring is active** — Verify your uptime checker (Pingdom, UptimeRobot, Better Uptime) is configured and has received at least one successful check.
- [ ] **Alert channels are working** — Send a test alert. Verify it arrives via the configured channel (Slack, PagerDuty, email, SMS).
- [ ] **Log aggregation is receiving logs** — Check your log provider. Verify application logs are streaming in real-time.
- [ ] **Performance monitoring baseline** — Record the current p50, p95, and p99 response times. This is your Day 1 baseline.

### Core User Flows

- [ ] **Registration/signup works** — Create a new account using the production signup flow. Verify confirmation email arrives.
- [ ] **Login works** — Log in with the account you just created. Verify session persists across page refreshes.
- [ ] **Primary user action works** — Complete the single most important action your product enables. End to end.
- [ ] **Payment processing works** — If applicable, run a test transaction (use Stripe test mode or a $1 charge you refund).
- [ ] **Email delivery works** — Trigger a transactional email (welcome, password reset). Verify it arrives and is not in spam.

### Support Readiness

- [ ] **{{SUPPORT_CHANNELS}} are active** — Verify all support channels are live and someone is monitoring them.
- [ ] **Support team has access** — Confirm support staff can log into admin panels, dashboards, and ticket systems.
- [ ] **Canned responses are loaded** — Pre-written responses for common questions (password reset, billing, getting started) are ready.
- [ ] **Escalation path is documented** — Support knows who to contact for technical issues, billing issues, and security issues.

### Hotfix Protocol

- [ ] **Hotfix branch strategy is documented** — Team knows to branch from `main`, not `develop`.
- [ ] **Emergency deploy process is tested** — You have deployed at least once today using the production deploy pipeline.
- [ ] **Rollback procedure is verified** — You know how to revert to the previous deployment within 5 minutes.
- [ ] **On-call rotation is set** — Someone is explicitly on-call for the next 72 hours with phone notifications enabled.

---

## Phase 2: Week 1 (Stabilization)

**Goal:** Establish operational rhythm. Identify and fix the issues that only appear under real user load.

### Performance Benchmarks

- [ ] **Capture Core Web Vitals** — Record LCP, FID/INP, and CLS from real user data (not Lighthouse). Use Chrome UX Report or your RUM tool.
- [ ] **Database query performance** — Identify the 10 slowest queries. Add indexes or optimize any query over 500ms.
- [ ] **API response time audit** — List all endpoints. Flag any with p95 > 1 second.
- [ ] **Memory and CPU baselines** — Record average server memory and CPU utilization. Set alerts at 80% of current capacity.
- [ ] **Error rate baseline** — Calculate your error rate (errors / total requests). Target: below 0.1%. Set alert at 0.5%.

### User Feedback Activation

- [ ] **{{FEEDBACK_CHANNEL}} is live** — Feedback collection widget, email address, or survey is accessible to all users.
- [ ] **Feedback triage process is active** — Someone is reviewing incoming feedback daily (not weekly, daily).
- [ ] **Bug report flow works** — Users can report bugs and receive acknowledgment within 24 hours.
- [ ] **First-week user interviews scheduled** — Book 3-5 calls with early users. Ask what confused them, what they expected, what they would change.

### Security Audit (Post-Launch Scan)

- [ ] **Dependency vulnerability scan** — Run `npm audit` (or equivalent). Fix all critical and high severity issues.
- [ ] **OWASP Top 10 quick scan** — Run an automated scanner (ZAP, Burp Suite Community) against production. Review results.
- [ ] **Authentication edge cases** — Test: expired tokens, concurrent sessions, password reset flow, OAuth callback URLs.
- [ ] **Rate limiting is active** — Verify API rate limits are enforced. Attempt rapid-fire requests and confirm throttling.
- [ ] **Sensitive data exposure check** — Review API responses for fields that should not be exposed (internal IDs, email addresses of other users, debug information).

### Documentation Accuracy

- [ ] **API documentation matches production** — Compare documented endpoints with actual API behavior. Fix any drift.
- [ ] **User documentation reflects current UI** — Screenshots and instructions match the shipped product. Update any that changed during final sprint.
- [ ] **README and setup guides work** — Clone the repo fresh and follow the setup guide. Fix any steps that fail.
- [ ] **Environment variable documentation is complete** — Every required env var is documented with description, format, and example value.

### Metrics Baseline

- [ ] **DAU/MAU tracking is active** — Verify daily and monthly active user counts are being recorded.
- [ ] **Retention tracking is configured** — D1, D7, and D30 cohort tracking is set up and recording.
- [ ] **Conversion funnel is instrumented** — Every step of the primary conversion funnel fires an analytics event.
- [ ] **Revenue metrics are accurate** — If applicable, verify MRR, ARPU, and churn calculations match your payment provider.

---

## Phase 3: Month 1 (Foundation)

**Goal:** Move from reactive firefighting to proactive product management. Establish the processes that will sustain the product long-term.

### Operational Processes

- [ ] **Weekly metrics review is scheduled** — Recurring calendar event. Review dashboard, identify trends, document decisions.
- [ ] **Incident retrospective for any Week 1 incidents** — If anything broke, write a blameless postmortem. Share findings with the team.
- [ ] **On-call rotation is sustainable** — If you have been on-call 24/7 for a month, that is not a rotation. Set up proper coverage.
- [ ] **Backup and recovery verified** — Trigger a database restore from backup. Verify data integrity. Time the recovery.
- [ ] **Cost monitoring is active** — Review cloud/infra bills. Set budget alerts. Identify any runaway costs (e.g., unoptimized queries, excessive logging).

### Product Health

- [ ] **Feature adoption rates documented** — For each major feature, what percentage of active users have used it at least once?
- [ ] **User onboarding completion rate** — What percentage of signups complete the onboarding flow? Target: 60%+. Below 40% is an emergency.
- [ ] **Support ticket volume trending** — Is ticket volume increasing, stable, or decreasing? Categorize top 5 ticket types.
- [ ] **NPS or CSAT baseline collected** — Send your first satisfaction survey. Record the baseline score. This is your benchmark.
- [ ] **Churn analysis started** — If any users have left, understand why. Direct outreach to churned users is the most valuable feedback you will get.

### Technical Health

- [ ] **Technical debt inventory** — List the shortcuts taken during launch sprint. Prioritize by risk (not by engineering preference).
- [ ] **Dependency update audit** — Check for outdated dependencies. Plan updates for anything more than 2 major versions behind.
- [ ] **Performance regression check** — Compare current p50/p95/p99 against Day 1 baselines. Investigate any degradation over 20%.
- [ ] **Database growth projection** — At current insertion rate, when do you hit your storage or connection limits? Plan ahead.
- [ ] **CI/CD pipeline health** — Are builds passing consistently? Average build time? Flaky tests?

### Growth Foundation

- [ ] **First roadmap draft created** — Based on user feedback, support tickets, and usage data. Not based on what you wish users wanted.
- [ ] **Feature request backlog established** — All incoming requests are captured in one place with consistent tagging.
- [ ] **Release cadence decided** — Weekly? Biweekly? Monthly? Document it and communicate it.
- [ ] **Changelog started** — Even if you have only shipped one version, start the changelog now. Future you will thank present you.

---

## Phase 4: Month 3 (Maturity)

**Goal:** Evaluate product-market fit signals. Decide whether to double down, pivot, or iterate.

### Product-Market Fit Assessment

- [ ] **Sean Ellis test** — Survey users: "How would you feel if you could no longer use {{PROJECT_NAME}}?" Target: 40%+ say "Very disappointed."
- [ ] **Retention curve analysis** — Plot D1/D7/D30/D60/D90 retention. A flattening curve = retention. A declining curve = trouble.
- [ ] **Organic growth signals** — Are users referring others without incentive? Are you getting inbound interest you did not create?
- [ ] **Revenue trajectory** — If monetized: is MRR growing, flat, or declining? What is the trend line for the next 6 months?
- [ ] **Competitive position check** — Has the competitive landscape changed since launch? New entrants? Feature parity shifts?

### Operational Maturity

- [ ] **Incident response has been tested** — You have handled at least one real incident using your documented process. If not, run a game day.
- [ ] **Monitoring coverage is complete** — No major user-facing flow is unmonitored. Alert fatigue is managed (less than 5 non-actionable alerts per week).
- [ ] **Deploy confidence is high** — Team can ship to production with confidence. Rollbacks are fast. Feature flags are used for risky changes.
- [ ] **Documentation is maintained** — Docs are updated with each release, not as an afterthought months later.

### Strategic Decisions

- [ ] **Roadmap v2 published** — Updated roadmap based on 3 months of real user data, not pre-launch assumptions.
- [ ] **Deprecation candidates identified** — Features with less than 5% adoption after 3 months are candidates for removal or redesign.
- [ ] **Scaling plan documented** — Based on growth trajectory, when do you need to scale infrastructure? What is the plan?
- [ ] **Team capacity assessment** — Is the current team sufficient for the next 6 months of planned work? If not, what roles are needed?
- [ ] **Post-launch retrospective completed** — Full team retrospective covering the launch and first 90 days. Document what worked, what did not, and what to change.

---

## Completion Criteria

All four phases are complete when:

1. Every checkbox above is checked (or explicitly marked N/A with a reason)
2. Metrics baselines are recorded and dashboards are live
3. Operational processes (on-call, releases, feedback triage) are running on a sustainable cadence
4. The Month 3 retrospective is written and shared

**What happens next:** This checklist transitions into the ongoing operational cadence defined by the other files in this section — weekly metrics reviews, monthly roadmap updates, and quarterly strategic planning.

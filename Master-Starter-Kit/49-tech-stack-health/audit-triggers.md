# Stack Health Audit Triggers

> You should not be running stack health audits on a feeling. This file defines every event that should trigger an audit, what priority it carries, what depth of audit to run, and what outcome to expect.

---

## Overview

Audit triggers fall into two categories: **scheduled** (predictable, calendar-based) and **reactive** (event-driven, unpredictable). Scheduled triggers maintain baseline awareness. Reactive triggers catch emerging risks before they become crises. Both are necessary. A team that only runs scheduled audits misses urgent security advisories. A team that only runs reactive audits never establishes the baseline trends that reveal slow-moving problems like community decline or cost creep.

---

## Scheduled Triggers

### Trigger 1: End of Development Phase

| Field | Value |
|-------|-------|
| **Priority** | P2 (Medium) |
| **Audit Depth** | Standard |
| **When** | After completing each orchestrator phase milestone |
| **Why** | Each phase adds dependencies and changes usage patterns. Catch issues before they compound into the next phase. |
| **Expected Action** | Update the stack health audit template. Flag any new dependencies added during the phase. Verify that added dependencies meet version currency and security baselines. |
| **Skip Condition** | Phase duration was less than 1 week and no new dependencies were added. |

### Trigger 2: Before Major Release

| Field | Value |
|-------|-------|
| **Priority** | P1 (High) |
| **Audit Depth** | Standard |
| **When** | During release candidate preparation, before final QA sign-off |
| **Why** | A release locks you into the current dependency versions for all users. Shipping a release with a known CVE or EOL dependency is avoidable if you check first. |
| **Expected Action** | Run full security scan. Verify no direct dependency is EOL. Confirm bundle size has not regressed. Update version currency table. |
| **Skip Condition** | Never skip. Every major release gets an audit. |

### Trigger 3: Quarterly Review (Ongoing Projects)

| Field | Value |
|-------|-------|
| **Priority** | P2 (Medium) |
| **Audit Depth** | Standard (escalate to Deep annually) |
| **When** | First week of each quarter (January, April, July, October) |
| **Why** | Dependencies age whether you are actively developing or not. Quarterly reviews catch version drift, accumulating CVEs, cost creep, and community health changes. |
| **Expected Action** | Complete full standard audit. Compare results to previous quarter. Identify trends. Schedule upgrades for any OUTDATED dependencies. |
| **Skip Condition** | Project is in active development and end-of-phase audits are happening at least monthly. |

---

## Reactive Triggers

### Trigger 4: Major Dependency Releases New Major Version

| Field | Value |
|-------|-------|
| **Priority** | P2 (Medium) |
| **Audit Depth** | Standard (focused on the releasing dependency) |
| **When** | Within 2 weeks of a major version release for any direct dependency |
| **Why** | A new major version means your current version is now N-1. It also means breaking changes exist, and the community will begin migrating — leaving your version with declining support. You do not need to upgrade immediately, but you need to assess the migration path and timeline. |
| **Expected Action** | Review changelog and breaking changes. Estimate migration effort. Determine if the upgrade is mandatory (security), recommended (features/performance), or optional (cosmetic). Set a target date for migration. Complete `upgrade-assessment.template.md` if migration effort is MODERATE or higher. |
| **Skip Condition** | The dependency is a dev-only tool (linter, formatter) with no production impact. Still update, but no formal audit needed. |

### Trigger 5: Security Advisory Published

| Field | Value |
|-------|-------|
| **Priority** | P0 (Critical) if CVSS >= 9.0, P1 (High) if CVSS >= 7.0, P2 otherwise |
| **Audit Depth** | Quick (security-focused) |
| **When** | Within 24 hours of advisory publication for P0, within 1 week for P1/P2 |
| **Why** | Known vulnerabilities in your dependency tree are the most common attack vector for web applications. The window between advisory publication and exploit availability is shrinking — often to hours. |
| **Expected Action** | Determine if the vulnerable code path is reachable in your application. If yes: patch immediately if a fix exists, or implement a workaround if not. If no: document the finding and monitor for patch availability. Update the security section of the audit template. |
| **Skip Condition** | Never skip security advisories. Even if you believe the code path is unreachable, document your analysis. |

### Trigger 6: Before Fundraising

| Field | Value |
|-------|-------|
| **Priority** | P1 (High) |
| **Audit Depth** | Deep |
| **When** | 4-6 weeks before beginning investor conversations |
| **Why** | Technical due diligence is standard in fundraising. Investors will ask about tech debt, dependency health, scalability, and infrastructure costs. A clean stack health audit is due diligence ammunition. A stack full of EOL dependencies and unpatched CVEs will surface during diligence and erode confidence. |
| **Expected Action** | Complete full deep audit. Remediate all P0 and P1 findings before investor meetings. Prepare a one-page stack health summary suitable for a data room. Cross-reference infrastructure costs with Section 40 fundraising materials. |
| **Skip Condition** | Never skip before fundraising. |

### Trigger 7: Performance Issues Emerge at Scale

| Field | Value |
|-------|-------|
| **Priority** | P1 (High) |
| **Audit Depth** | Deep (focused on performance + cost sections) |
| **When** | When monitoring surfaces sustained performance degradation correlated with scale growth |
| **Why** | Performance issues at scale are often dependency-level, not application-level. An ORM that generates efficient queries at 1,000 rows may produce catastrophic query plans at 1 million. A hosting provider with generous free tiers may throttle at scale. Identifying whether the bottleneck is your code or your dependency is the first diagnostic step. |
| **Expected Action** | Profile the performance bottleneck. Determine if the root cause is a dependency limitation or application code. If dependency: assess alternatives with `upgrade-assessment.template.md`. If application: out of scope for this section, escalate to development team. |
| **Skip Condition** | Performance issue is clearly application-level (e.g., missing database index, unoptimized query you wrote). |

### Trigger 8: Dependency Deprecated or License Changed

| Field | Value |
|-------|-------|
| **Priority** | P1 (High) for license change, P2 (Medium) for deprecation |
| **Audit Depth** | Deep (focused on the affected dependency + alternatives) |
| **When** | Within 1 week of deprecation notice or license change announcement |
| **Why** | A deprecated dependency will stop receiving security patches. You have a finite window to migrate before the risk becomes critical. A license change may invalidate your legal right to use the dependency in a commercial product — this requires immediate legal review. |
| **Expected Action** | For deprecation: identify the recommended successor or alternatives. Estimate migration effort. Set a migration deadline (before security patches stop). For license change: consult legal. Determine if the new license is compatible with your use case. If not: treat as emergency migration. Complete `upgrade-assessment.template.md` for both cases. |
| **Skip Condition** | Never skip. Both deprecation and license changes require documented response. |

---

## Trigger Priority Matrix

| Priority | Response Time | Audit Depth | Escalation |
|----------|--------------|-------------|------------|
| **P0 (Critical)** | Within 24 hours | Quick (security-focused) | Immediately notify tech lead. Patch or mitigate same day. |
| **P1 (High)** | Within 1 week | Standard or Deep | Add to current sprint. Block release if pre-release audit. |
| **P2 (Medium)** | Within 2 weeks | Standard | Add to next sprint planning. Track in backlog. |
| **P3 (Low)** | Next scheduled audit | Quick | Note for future review. No immediate action. |

---

## Trigger Calendar Template

Use this calendar to track scheduled triggers for the current year. Add reactive triggers as they occur.

| Month | Scheduled Trigger | Reactive Triggers (add as they occur) | Audit Completed? |
|-------|------------------|---------------------------------------|-------------------|
| January | Q1 Quarterly Review | | |
| February | | | |
| March | | | |
| April | Q2 Quarterly Review | | |
| May | | | |
| June | | | |
| July | Q3 Quarterly Review + Annual Deep Audit | | |
| August | | | |
| September | | | |
| October | Q4 Quarterly Review | | |
| November | | | |
| December | | | |

---

## Integration with CI/CD

For automated trigger detection, consider adding these checks to your CI/CD pipeline:

- **Pre-deploy hook:** Run `npm audit --audit-level=critical` (or equivalent). Fail the deploy if critical CVEs are found.
- **Weekly cron:** Run `npm outdated` and post results to a Slack channel or GitHub issue.
- **Dependency update bot:** Enable Dependabot, Renovate, or equivalent. Auto-create PRs for patch and minor updates. Require manual review for major updates.
- **License scanner:** Run `license-checker` or equivalent in CI to catch license changes in transitive dependencies.

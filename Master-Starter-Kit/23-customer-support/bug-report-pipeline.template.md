# Bug Report Pipeline — {{PROJECT_NAME}}

> Every bug report is a gift from a user who cared enough to tell you something is broken. Treat it with a structured pipeline, not a prayer.

---

## Overview

This document defines the complete bug lifecycle for {{PROJECT_NAME}}: from initial user report through triage, prioritization, fix, verification, and closure. A well-defined bug pipeline ensures that no report falls through the cracks, priority is assigned objectively (not by who shouts loudest), and users always know the status of their issue.

---

## Pipeline Stages

```
[1. REPORT] → [2. ACKNOWLEDGE] → [3. TRIAGE] → [4. PRIORITIZE] → [5. ASSIGN] → [6. FIX] → [7. VERIFY] → [8. RELEASE] → [9. CONFIRM] → [10. CLOSE]
```

| Stage | Owner | Time Target | Outcome |
|-------|-------|-------------|---------|
| 1. Report | User | N/A | Bug report submitted |
| 2. Acknowledge | Support (L1) | Per SLA (first response) | User receives confirmation |
| 3. Triage | Support (L2) | Within 4 hours of acknowledgment | Severity assigned, reproducibility confirmed |
| 4. Prioritize | Support Lead / PM | Within 1 business day | Priority (P0-P3) assigned |
| 5. Assign | Engineering Lead | Within priority timeframe | Developer assigned |
| 6. Fix | Engineering | Per priority time-to-fix target | Code fix implemented |
| 7. Verify | QA / Peer Review | Within 1 business day of fix | Fix verified, regression test added |
| 8. Release | DevOps / Engineering | Per release schedule | Fix deployed to production |
| 9. Confirm | Support → User | Within 24 hours of release | User confirms fix works |
| 10. Close | Support | After user confirmation or 72h auto-close | Ticket closed |

---

## Stage 1: Bug Report

### Bug Report Template

Users submit bug reports via the support widget, email, or in-app feedback. Regardless of the channel, the following information is captured (some fields auto-populated by the platform):

```markdown
## Bug Report — {{PROJECT_NAME}}

### Summary
[One sentence: What is broken?]

### Steps to Reproduce
1. [First step — be specific about what you clicked, typed, or navigated to]
2. [Second step]
3. [Third step]
4. [Continue until the bug appears]

### Expected Behavior
[What should have happened?]

### Actual Behavior
[What actually happened? Include exact error messages if any.]

### Environment
- **Browser:** [e.g., Chrome 120, Safari 17, Firefox 121]
- **Operating System:** [e.g., macOS 14.2, Windows 11, iOS 17]
- **App Version:** [e.g., v2.4.1 or "latest"]
- **Device:** [e.g., MacBook Pro, iPhone 15, Desktop PC]
- **Account Email:** [your email — for account-specific investigation]
- **Screen Size:** [if relevant — e.g., 1920x1080, mobile]

### Severity Self-Assessment
- [ ] **Blocker** — I cannot use {{PROJECT_NAME}} at all
- [ ] **Critical** — A core feature is completely broken
- [ ] **Major** — Something important is broken but I can work around it
- [ ] **Minor** — Something is off but it does not block my work
- [ ] **Cosmetic** — Visual issue, typo, or minor polish problem

### Screenshots / Videos
[Attach screenshots with annotations, or a Loom/screen recording showing the issue]

### Additional Context
[Anything else that might help: does it happen every time? Did it start after a specific action? Does it affect other team members?]
```

### Auto-Populated Fields (When Available)

If your support platform or in-app feedback tool supports it, auto-populate:

- Browser and OS (from user agent)
- App version (from build metadata)
- Account email (from session)
- Current page URL
- Console errors (if using an error tracking tool like Sentry)
- Session replay link (if using LogRocket, FullStory, or similar)

**The more you auto-populate, the fewer fields the user has to fill in, and the fewer incomplete bug reports you receive.**

---

## Stage 2: Acknowledge

**Owner:** Support Agent (L1)
**SLA:** Per tier-specific first response SLA

The acknowledgment tells the user their report has been received and sets expectations. This is not the triage — it is a human confirmation that someone has read the report.

**Acknowledgment Response:**

```
Hi [Name],

Thank you for reporting this. We have received your bug report and our team is
reviewing it now.

Here is what happens next:
- Our team will reproduce and investigate the issue
- We will update you once we have more information
- If we need any additional details, we will reach out

Your reference number is #[TICKET_ID].

[Agent Name]
{{PROJECT_NAME}} Support
```

---

## Stage 3: Triage

**Owner:** Support Agent (L2) or Triage Engineer
**Time Target:** Within 4 hours of acknowledgment

Triage answers three questions:

1. **Is this reproducible?** Try to reproduce the bug using the steps provided. If reproducible, proceed. If not, ask the user for more details.
2. **Is this a known issue?** Check the issue tracker for existing reports. If duplicate, link to the existing ticket and notify the user.
3. **What is the severity?** Assign severity based on the rubric below, overriding the user's self-assessment if necessary.

### Severity Rubric

| Severity | Definition | Examples |
|----------|-----------|----------|
| **S1 — Blocker** | Application is down, data loss occurring, security vulnerability, payment processing broken. No workaround. Affects all or most users. | Login broken for all users, data being deleted, payment charging wrong amounts, API completely down |
| **S2 — Critical** | Core feature completely broken, significant user impact, no reasonable workaround. Affects a segment of users. | Search returns no results, file upload fails, dashboard not loading for Chrome users, integration broken |
| **S3 — Major** | Important feature degraded, workaround exists, moderate user impact. | Slow page load (>10s), export generates wrong format, filter does not work on one field, email notifications delayed by hours |
| **S4 — Minor** | Non-core feature has an issue, easy workaround, low user impact. | Tooltip shows wrong text, sort order incorrect on one column, date picker shows wrong timezone |
| **S5 — Cosmetic** | Visual issue only, no functional impact. | Button misaligned by 2px, font weight inconsistent, color slightly off from design spec, typo in error message |

### Triage Checklist

- [ ] Attempted reproduction (document exact steps and environment)
- [ ] Checked for duplicates in issue tracker
- [ ] Severity assigned using rubric above
- [ ] Affected user count estimated (one user? some users? all users?)
- [ ] Workaround identified (if any)
- [ ] Screenshots/logs attached to the engineering ticket
- [ ] User notified of triage status

---

## Stage 4: Prioritize

**Owner:** Support Lead + Product Manager (for P0/P1) or Support Lead (for P2/P3)
**Time Target:** Within 1 business day of triage

Priority is assigned using a scoring matrix that combines severity, frequency, and workaround availability.

### Priority Scoring Matrix

| Factor | Weight | 5 (Highest) | 3 (Medium) | 1 (Lowest) |
|--------|--------|-------------|------------|------------|
| **Severity** | 3x | S1 Blocker | S3 Major | S5 Cosmetic |
| **Frequency** | 2x | Affects all users | Affects some users | Affects one user |
| **Workaround** | 1x | No workaround | Difficult workaround | Easy workaround |

**Priority Score = (Severity x 3) + (Frequency x 2) + (Workaround x 1)**

| Score Range | Priority | Action |
|-------------|----------|--------|
| 25-30 | **P0 — Fix Now** | Drop everything. Hotfix within hours. Incident response process may apply. |
| 18-24 | **P1 — Fix This Sprint** | Must be fixed in the current sprint. Sprint scope is adjusted to accommodate. |
| 11-17 | **P2 — Next Sprint** | Scheduled for the next sprint. Important but not urgent. |
| 6-10 | **P3 — Backlog** | Added to the backlog. Fixed when capacity allows or bundled with related work. |

### Priority Definitions

**P0 — Fix Now (Drop Everything)**
- Response: Immediately
- Time-to-fix target: < 4 hours
- Who is involved: On-call engineer, engineering lead, support lead
- Communication: Status page update, proactive user communication
- Process: May follow incident response protocol (Section 21)
- Example: Production API is returning 500 errors for all authenticated requests

**P1 — Fix This Sprint**
- Response: Within 4 hours
- Time-to-fix target: < 3 business days
- Who is involved: Assigned engineer, engineering lead aware
- Communication: User updated daily until resolved
- Process: Added to current sprint, existing work deprioritized if needed
- Example: CSV export generates corrupted files for accounts with >1000 records

**P2 — Next Sprint**
- Response: Within 1 business day
- Time-to-fix target: < 10 business days
- Who is involved: Assigned engineer
- Communication: User updated when fix is scheduled and when deployed
- Process: Added to next sprint planning
- Example: Dark mode toggle does not persist after page reload

**P3 — Backlog**
- Response: Within 2 business days
- Time-to-fix target: Best effort (no hard target)
- Who is involved: Assigned when capacity allows
- Communication: User notified when fix is deployed (could be weeks/months)
- Process: Tagged and added to backlog, reviewed in monthly grooming
- Example: Tooltip on settings page shows "undefined" instead of helper text

---

## Stage 5: Assign

**Owner:** Engineering Lead
**Time Target:** Immediately for P0, same day for P1, within sprint planning for P2-P3

The engineering lead assigns the bug to a developer based on:

1. **Domain expertise** — Who knows this part of the codebase best?
2. **Current workload** — Who has capacity?
3. **Context** — Is anyone already working on related code?

### Engineering Ticket Template

When the bug is handed from support to engineering, create a ticket with:

```markdown
## Bug: [One-line summary]

**Priority:** P[0-3]
**Severity:** S[1-5]
**Reporter:** [User name/email] via [channel]
**Support Ticket:** #[TICKET_ID]
**Assigned To:** [Engineer]
**Sprint:** [Current / Next / Backlog]

### Reproduction Steps
1. [Exact steps from triage, verified by the triage engineer]

### Expected vs. Actual
- **Expected:** [What should happen]
- **Actual:** [What happens]

### Environment
- [Browser, OS, version details]

### Evidence
- [Screenshots, logs, Sentry link, session replay link]

### User Impact
- Affected users: [Count or estimate]
- Workaround: [Description, or "None"]

### Acceptance Criteria
- [ ] Bug is fixed (reproduction steps no longer produce the bug)
- [ ] Regression test added
- [ ] Fix verified in staging
- [ ] User notified of fix
```

---

## Stage 6: Fix

**Owner:** Assigned Engineer
**Time Target:** Per priority time-to-fix targets

The engineer:
1. Reproduces the bug locally
2. Identifies the root cause
3. Implements the fix
4. Writes a regression test that would have caught the bug
5. Creates a PR with the fix and test
6. PR is reviewed and approved

### Fix Quality Checklist

- [ ] Root cause identified (not just symptoms patched)
- [ ] Regression test added (the exact scenario from the bug report)
- [ ] No new issues introduced (existing tests pass)
- [ ] Fix is backwards-compatible (does not break existing user data/workflows)
- [ ] PR description links to the support ticket and engineering ticket
- [ ] If P0/P1: hotfix branch created and expedited review requested

---

## Stage 7: Verify

**Owner:** QA Engineer or Peer Reviewer
**Time Target:** Within 1 business day of fix

Verification confirms that:

1. The original reproduction steps no longer produce the bug
2. The regression test passes
3. The fix does not introduce new issues (full test suite passes)
4. Edge cases are tested (different browsers, account types, data sizes)

### Verification Checklist

- [ ] Reproduced original bug (confirmed it exists before fix)
- [ ] Applied fix and confirmed bug is resolved
- [ ] Tested in staging environment (not just locally)
- [ ] Regression test runs and passes
- [ ] Exploratory testing around the affected area (no new issues found)
- [ ] Performance not degraded (if relevant)

---

## Stage 8: Release

**Owner:** DevOps / Engineering
**Time Target:** Per release schedule (P0 = immediate hotfix, P1-P3 = next scheduled release)

| Priority | Release Strategy |
|----------|-----------------|
| P0 | Hotfix: merge to main, deploy immediately |
| P1 | Expedited: include in next scheduled deploy (daily or weekly) |
| P2 | Standard: include in next sprint release |
| P3 | Standard: include in next sprint release |

After deployment:
- [ ] Smoke test in production
- [ ] Monitor error tracking (Sentry) for the next 30 minutes
- [ ] Check relevant dashboards for anomalies

---

## Stage 9: Confirm with User

**Owner:** Support Agent
**Time Target:** Within 24 hours of production release

**Confirmation Message:**

```
Hi [Name],

Good news — the issue you reported has been fixed and the fix is now live.

Here's what was wrong:
[One sentence explaining the root cause in user-friendly language]

Here's what we changed:
[One sentence explaining the fix in user-friendly language]

Can you please verify that the issue is resolved on your end? If you are still
experiencing the problem, reply to this message and we will investigate further.

Thank you for reporting this — your feedback helps us improve {{PROJECT_NAME}} for
everyone.

[Agent Name]
{{PROJECT_NAME}} Support
```

---

## Stage 10: Close

**Owner:** Support Agent
**Time Target:** After user confirmation, or 72 hours after confirmation request (auto-close)

Closure conditions:
- **User confirms:** Close immediately with a thank-you message
- **User reports still broken:** Reopen, re-triage, re-assign
- **User does not respond within 72 hours:** Auto-close with a message: "We're closing this ticket as the fix has been deployed. If you're still experiencing the issue, reply to reopen."

---

## Duplicate Detection Workflow

Duplicate bug reports waste engineering time and create confusion. Follow this process:

### Detection

1. **Before triage:** Search the issue tracker for the same symptoms (error message, affected feature, user description)
2. **Keywords to search:** The error message, the affected feature name, the user's description
3. **If potential duplicate found:** Compare reproduction steps, affected environment, and root cause

### Handling Duplicates

- **Confirmed duplicate:** Link the new ticket to the original. Notify the user: "This is a known issue we're already working on. I've linked your report to the existing investigation so you'll be updated when it's resolved."
- **Similar but different:** Keep as separate ticket. Add a note referencing the similar issue for the engineer's context.
- **Same symptom, different root cause:** Keep as separate ticket. The symptom may be the same, but the fix may be different.

### Tracking Duplicate Volume

Track the number of duplicate reports per bug. High duplicate counts indicate:
- The bug is widespread (increase priority)
- Your status page or in-app messaging is not communicating the known issue
- Your KB does not have a "Known Issues" article

---

## Time-to-Fix Targets by Priority

| Priority | First Response | Fix Started | Fix Verified | Released | User Confirmed |
|----------|---------------|-------------|-------------|----------|----------------|
| P0 | Immediate | < 1 hour | < 4 hours | < 6 hours | < 12 hours |
| P1 | < 4 hours | < 1 day | < 3 days | < 5 days | < 7 days |
| P2 | < 1 day | < 1 sprint | < 1 sprint + 2 days | Next release | < 2 weeks |
| P3 | < 2 days | When capacity allows | Within 1 sprint of start | Next release | Best effort |

---

## Bug Report Analytics

Track these metrics monthly to understand your bug pipeline health:

| Metric | Target | Description |
|--------|--------|-------------|
| Total bugs reported | Trending down | If increasing, product quality is declining |
| Bugs by severity | S1/S2 < 10% | Most bugs should be minor/cosmetic |
| Average time-to-fix by priority | Within targets above | Measures engineering responsiveness |
| Bug reopen rate | < 5% | High rate = fixes are incomplete or wrong |
| Duplicate rate | < 20% | High rate = need better known-issue communication |
| Reporter satisfaction (CSAT) | > 85% | Did the user feel their bug was handled well? |
| Regression rate | < 3% | Bugs that come back after being fixed |
| Bugs fixed without regression test | 0% | Every fix should include a test |

---

## Common Bug Report Anti-Patterns

**"Works on my machine"** — Never dismiss a bug because you cannot reproduce it locally. Ask for more environment details, check logs, check for race conditions.

**"Low priority" indefinitely** — P3 bugs that sit in the backlog for 6+ months should be reviewed. Either fix them, wontfix them with explanation, or acknowledge they will never be fixed.

**"Quick fix, no test"** — Every fix without a regression test is a bug waiting to return. No exceptions.

**"Fixed, not verified"** — A fix that has not been verified in staging is not a fix. It is a hope.

**"Closed without user confirmation"** — Always give the user a chance to confirm. Auto-closing without notice makes users feel ignored.

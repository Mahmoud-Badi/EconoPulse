# Privacy Testing Checklist

> {{PROJECT_NAME}} — Privacy-specific test cases for consent flows, DSR fulfillment, data minimization, retention enforcement, cross-border compliance, third-party audits, and regression testing.

---

## Overview

Privacy controls that are implemented but not tested are privacy controls that will break silently. Unlike functional tests (where failures are visible to users), privacy test failures are invisible until a regulator asks questions or a breach exposes the gap. This checklist defines concrete, executable test cases for every privacy control in {{PROJECT_NAME}}.

**Integration with CI/CD:** Critical and High priority tests should run on every deployment. Medium tests should run nightly. Low tests should run weekly.

---

## 1. Consent Flow Tests

| Test ID | Description | Expected Result | Priority |
|---------|-------------|-----------------|----------|
| CON-001 | First visit with no consent cookie — consent banner appears | Banner is visible, no analytics/marketing cookies set, no tracking scripts loaded | Critical |
| CON-002 | Accept all cookies — all categories enabled | All consent categories stored as `true`, analytics and marketing scripts load, consent record persisted to server | Critical |
| CON-003 | Reject all cookies — only necessary cookies remain | Only necessary cookies remain, all tracking cookies deleted, analytics/marketing scripts do NOT load | Critical |
| CON-004 | Selective consent — accept analytics, reject marketing | Analytics cookies set, marketing cookies absent, consent record reflects exact selection | High |
| CON-005 | Consent persists across sessions — returning user | User who consented does not see banner on return visit, consent cookie is valid | High |
| CON-006 | Consent withdrawal via settings page | Previously granted consent is revoked, corresponding cookies deleted, processing stops immediately | Critical |
| CON-007 | Consent withdrawal via email unsubscribe link | Marketing consent revoked, user removed from mailing lists within 24 hours | High |
| CON-008 | Re-open cookie preferences from footer link | Previous preferences pre-selected, user can modify and save | High |
| CON-009 | GPC signal active — analytics and marketing blocked | When `Sec-GPC: 1` header is present, analytics and marketing are automatically opted out | High |
| CON-010 | Consent version change triggers re-consent | When consent text version changes, existing consent is invalidated, re-consent banner appears | High |
| CON-011 | Consent banner accessibility — screen reader | Banner is announced by screen readers, all controls are keyboard-navigable | High |
| CON-012 | Consent banner does not block page functionality | Page content is accessible and usable while banner is displayed | Medium |
| CON-013 | No analytics events fire before consent is collected | Monitor network requests — no calls to analytics endpoints before consent banner interaction | Critical |
| CON-014 | Consent record includes timestamp, version, method, jurisdiction | Database record contains all required metadata for compliance proof | High |
| CON-015 | Accept and Reject buttons have equal visual weight | Button sizes, colors, and positions do not create a dark pattern favoring acceptance | Medium |

---

## 2. DSR Fulfillment Tests

| Test ID | Description | Expected Result | Priority |
|---------|-------------|-----------------|----------|
| DSR-001 | Submit access request as authenticated user | Request created with status `identity_verified`, deadline set to {{DSR_SLA_DAYS}} days from now | Critical |
| DSR-002 | Access request generates complete data export | Export contains data from all registered data sources (profile, content, billing, activity, third-party) | Critical |
| DSR-003 | Erasure request deletes data from primary database | User record deleted or anonymized, content removed, search index cleared | Critical |
| DSR-004 | Erasure request deletes data from object storage | User uploads (avatars, documents) deleted from S3/object store | High |
| DSR-005 | Erasure request propagates to third parties | Deletion requests sent to analytics provider, email service, support platform | High |
| DSR-006 | Erasure request anonymizes billing records | Billing records anonymized (not deleted — tax obligation), PII replaced with `REDACTED` | High |
| DSR-007 | Erasure request adds user to backup exclusion list | Deleted user ID recorded in exclusion list for backup restore filtering | High |
| DSR-008 | Rectification request updates user data across services | Updated field propagated to all services that store it (primary DB, search index, cache) | High |
| DSR-009 | Portability request exports data in machine-readable JSON | Export is valid JSON with documented schema, downloadable via authenticated endpoint | Medium |
| DSR-010 | Restriction request stops processing but retains data | User data is retained but flagged as restricted, no processing occurs until restriction is lifted | Medium |
| DSR-011 | Objection request withdraws consent for specified purpose | Consent record updated, processing for that purpose stops immediately | High |
| DSR-012 | DSR identity verification — email confirmation | Unverified requests require email confirmation before processing begins | High |
| DSR-013 | DSR deadline monitoring — 7-day warning alert | Requests approaching deadline trigger alerts at 7, 3, and 0 days remaining | High |
| DSR-014 | DSR deadline monitoring — overdue escalation | Overdue requests trigger critical alerts to privacy lead and engineering lead | Critical |
| DSR-015 | DSR exception handling — litigation hold prevents erasure | Erasure request for user under litigation hold is routed to legal review, not auto-fulfilled | High |
| DSR-016 | DSR completion sends confirmation to data subject | User receives email confirming their request was fulfilled | Medium |
| DSR-017 | DSR audit log records all actions taken | Every step of DSR fulfillment is logged with timestamps and operator identity | High |

---

## 3. Data Minimization Verification

| Test ID | Description | Expected Result | Priority |
|---------|-------------|-----------------|----------|
| MIN-001 | Registration endpoint rejects unexpected fields | POST `/api/v1/auth/register` with extra fields (phone, birthday) returns 400 | High |
| MIN-002 | API responses do not leak internal fields | GET `/api/v1/users/:id` does not return `passwordHash`, `mfaSecret`, `internalNotes` | Critical |
| MIN-003 | Analytics events do not contain raw PII | Analytics pipeline receives pseudonymized user IDs, no emails or names | High |
| MIN-004 | Log sanitization removes PII from application logs | Request logs do not contain email, name, phone, or payment data in structured fields | High |
| MIN-005 | Error tracking scrubs PII from stack traces | Sentry/error tracker does not capture user email or payment info in error context | High |
| MIN-006 | Development database uses synthetic data | Staging/dev environments contain only faker-generated data, not production PII | Medium |
| MIN-007 | API projections vary by purpose | Same endpoint returns different field sets based on requesting service's declared purpose | Medium |
| MIN-008 | Unused data fields are not collected | No form fields collect data that is not used by any processing activity | Low |

---

## 4. Retention Policy Enforcement Tests

| Test ID | Description | Expected Result | Priority |
|---------|-------------|-----------------|----------|
| RET-001 | Session tokens expire after defined TTL | Sessions older than 24 hours are automatically invalidated and removed | High |
| RET-002 | Application logs rotate after 90 days | Logs older than 90 days are deleted by automated rotation | High |
| RET-003 | Analytics events are purged after retention period | Events older than {{DATA_RETENTION_DEFAULT}} are deleted by purge job | High |
| RET-004 | Deleted account data is purged after 30-day grace period | User data is hard-deleted 30 days after account deletion | High |
| RET-005 | Billing records are anonymized after 7 years | Billing records older than 7 years have PII replaced with anonymized values | Medium |
| RET-006 | Support tickets are anonymized after 24 months | Tickets resolved more than 24 months ago have user PII anonymized | Medium |
| RET-007 | Purge job handles litigation holds correctly | Records under litigation hold are skipped by purge jobs | High |
| RET-008 | Purge job monitoring — errors trigger alerts | Purge job failures send alerts to DevOps channel | Medium |
| RET-009 | Backup retention aligns with data retention | Backups older than 30 days are automatically deleted | Medium |
| RET-010 | Purge dry-run produces accurate report | Dry-run mode reports records that would be purged without actually deleting them | Medium |

---

## 5. Cross-Border Transfer Compliance Tests

| Test ID | Description | Expected Result | Priority |
|---------|-------------|-----------------|----------|
| CBT-001 | Data processing stays in configured region | Database queries confirm all user data is stored in {{PRIVACY_SHIELD_REGION}} | High |
| CBT-002 | Third-party API calls include appropriate auth | All calls to cross-border processors use encrypted channels with authentication | High |
| CBT-003 | CDN access logs do not retain PII beyond 7 days | Edge logs with IP addresses are rotated within 7-day window | Medium |
| CBT-004 | Transfer inventory matches actual data flows | Network monitoring confirms no undocumented cross-border data transfers | Medium |
| CBT-005 | SCC documentation is current for all processors | All sub-processors have signed SCCs dated within the last 12 months | Medium |
<!-- IF {{CROSS_BORDER_MECHANISM}} != "none" -->
| CBT-006 | Transfer Impact Assessments are completed for all SCC transfers | TIA documents exist and are reviewed within the last 12 months | Medium |
| CBT-007 | Supplementary measures are implemented where TIA requires them | Encryption/pseudonymization measures documented in TIA are verified in code | High |
<!-- ENDIF -->

---

## 6. Third-Party Data Sharing Audit

| Test ID | Description | Expected Result | Priority |
|---------|-------------|-----------------|----------|
| TPS-001 | All third-party SDKs are documented in sub-processor register | Every SDK that sends data externally has a corresponding register entry | High |
| TPS-002 | Third-party SDKs respect consent state | Analytics SDK does not initialize when analytics consent is denied | Critical |
| TPS-003 | Marketing pixels do not fire without marketing consent | Network monitor confirms no marketing pixel requests when consent is denied | Critical |
| TPS-004 | DPA is signed with every processor | Sub-processor register shows `dpa_signed: true` for all active processors | Medium |
| TPS-005 | Third-party data deletion requests are fulfilled | Sending a deletion request to each processor returns success confirmation | Medium |
| TPS-006 | Third-party sub-processor lists are reviewed | Each processor's sub-processor list has been reviewed within 12 months | Low |
| TPS-007 | No undocumented third-party data flows | Network monitoring shows no outbound data flows to unlisted third parties | High |
| TPS-008 | Third-party SDKs are using latest versions | All privacy-relevant SDKs are updated to versions with latest privacy features | Medium |

---

## 7. Privacy Regression Test Suite

These tests should run on every deployment to catch privacy regressions introduced by new features or code changes.

| Test ID | Description | Expected Result | Priority |
|---------|-------------|-----------------|----------|
| REG-001 | No new cookies set without consent | After code deployment, cookie audit shows no new tracking cookies appearing before consent | Critical |
| REG-002 | No new API endpoints leak PII | New endpoints do not return password hashes, MFA secrets, or payment data | Critical |
| REG-003 | No new analytics events contain raw PII | New analytics events use pseudonymized IDs, no email/name in properties | High |
| REG-004 | No new log statements contain PII | New log entries do not include user email, phone, or payment data | High |
| REG-005 | Consent service still gates analytics pipeline | Analytics events for users without consent are still blocked after deployment | Critical |
| REG-006 | DSR erasure still covers all data sources | Erasure pipeline queries all registered data sources after deployment | High |
| REG-007 | Purge jobs still run on schedule | After deployment, purge job monitoring confirms scheduled execution | Medium |
| REG-008 | Privacy settings page renders correctly | Privacy settings page displays all consent categories with correct toggle states | Medium |
| REG-009 | Cookie consent banner renders correctly | Banner appears for new users, dismiss/accept/reject functions work | High |
| REG-010 | Retention policies are not extended by new code | No database migration extends retention periods without documented approval | Medium |

### Automated Privacy Regression Test Example

```typescript
// tests/privacy/regression.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Privacy Regression Suite', () => {
  test('no tracking cookies before consent', async ({ page, context }) => {
    // Clear all cookies
    await context.clearCookies();

    // Visit the app
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Check cookies
    const cookies = await context.cookies();
    const trackingCookies = cookies.filter((c) =>
      ['_ga', '_gid', '_fbp', '_gcl_au', 'li_sugr'].includes(c.name)
    );

    expect(trackingCookies).toHaveLength(0);
  });

  test('API user endpoint does not leak sensitive fields', async ({ request }) => {
    const response = await request.get('/api/v1/users/me', {
      headers: { Authorization: `Bearer ${TEST_TOKEN}` },
    });
    const user = await response.json();

    // These fields must NEVER appear in API responses
    expect(user).not.toHaveProperty('passwordHash');
    expect(user).not.toHaveProperty('mfaSecret');
    expect(user).not.toHaveProperty('recoveryCode');
    expect(user).not.toHaveProperty('internalNotes');
  });

  test('erasure removes user from search index', async ({ request }) => {
    // Create test user
    const userId = await createTestUser();

    // Submit erasure request
    await request.post('/api/v1/privacy/dsr', {
      data: { type: 'erasure' },
      headers: { Authorization: `Bearer ${userToken}` },
    });

    // Wait for processing
    await waitForDSRCompletion(userId);

    // Verify search index no longer contains user content
    const searchResults = await searchClient.search({ query: `author:${userId}` });
    expect(searchResults.hits).toHaveLength(0);
  });
});
```

### Privacy Testing Implementation Checklist

- [ ] All Critical priority tests are implemented and passing
- [ ] All High priority tests are implemented and passing
- [ ] Critical and High tests run on every deployment (CI/CD pipeline)
- [ ] Medium tests run nightly via scheduled pipeline
- [ ] Low tests run weekly via scheduled pipeline
- [ ] Test failures trigger alerts to the privacy engineering team
- [ ] New features require a privacy test review before merge
- [ ] Privacy test coverage is reviewed quarterly
- [ ] Test data uses synthetic/generated data, not production PII
- [ ] Privacy regression suite prevents new privacy violations in deployments

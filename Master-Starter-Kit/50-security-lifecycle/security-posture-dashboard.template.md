# Security Posture Dashboard — {{PROJECT_NAME}}

> **Last Updated:** {{DASHBOARD_LAST_UPDATED}}
> **Updated By:** {{DASHBOARD_UPDATED_BY}}
> **Next Scheduled Audit:** {{NEXT_AUDIT_DATE}}

---

## Overall Security Grade: {{SECURITY_GRADE}}

| Grade | Criteria |
|-------|----------|
| **A** | Zero critical/high findings. All medium findings under 14 days old. Security headers 100%. Auth coverage 100%. Compliance current. |
| **B** | Zero critical findings. High findings < 3 and within SLA. Security headers >= 5/6. Auth coverage >= 95%. |
| **C** | Zero critical findings. High findings within SLA. Security headers >= 4/6. Auth coverage >= 90%. |
| **D** | Critical findings exist but are within 24h SLA. Multiple high findings approaching SLA. Headers or auth gaps. |
| **F** | Critical findings past SLA. High findings past SLA. Known auth bypasses. Missing encryption. Compliance lapsed. |

---

## Open Findings by Severity

| Severity | Open Count | In Progress | Oldest Finding Age | SLA | SLA Status |
|----------|-----------|-------------|-------------------|-----|------------|
| Critical | {{CRITICAL_OPEN_COUNT}} | {{CRITICAL_IN_PROGRESS}} | {{CRITICAL_OLDEST_AGE}} | 24 hours | {{CRITICAL_SLA_STATUS}} |
| High | {{HIGH_OPEN_COUNT}} | {{HIGH_IN_PROGRESS}} | {{HIGH_OLDEST_AGE}} | 7 days | {{HIGH_SLA_STATUS}} |
| Medium | {{MEDIUM_OPEN_COUNT}} | {{MEDIUM_IN_PROGRESS}} | {{MEDIUM_OLDEST_AGE}} | 30 days | {{MEDIUM_SLA_STATUS}} |
| Low | {{LOW_OPEN_COUNT}} | {{LOW_IN_PROGRESS}} | {{LOW_OLDEST_AGE}} | 90 days | {{LOW_SLA_STATUS}} |

**Total Open Findings:** {{TOTAL_OPEN_FINDINGS}}
**Days Since Last Audit:** {{DAYS_SINCE_LAST_AUDIT}}
**Days Since Last Dependency Scan:** {{DAYS_SINCE_LAST_DEP_SCAN}}

---

## Dependency Vulnerability Count

| Source | Critical | High | Medium | Low | Last Scanned |
|--------|----------|------|--------|-----|-------------|
| npm audit | {{NPM_CRITICAL}} | {{NPM_HIGH}} | {{NPM_MEDIUM}} | {{NPM_LOW}} | {{NPM_LAST_SCAN}} |
| Snyk | {{SNYK_CRITICAL}} | {{SNYK_HIGH}} | {{SNYK_MEDIUM}} | {{SNYK_LOW}} | {{SNYK_LAST_SCAN}} |
| Dependabot | {{DEPENDABOT_CRITICAL}} | {{DEPENDABOT_HIGH}} | {{DEPENDABOT_MEDIUM}} | {{DEPENDABOT_LOW}} | {{DEPENDABOT_LAST_SCAN}} |

**Known False Positives (excluded from counts):** {{FALSE_POSITIVE_COUNT}}

---

## Security Headers Status

| Header | Status | Value |
|--------|--------|-------|
| Content-Security-Policy (CSP) | {{CSP_STATUS}} | {{CSP_VALUE}} |
| Strict-Transport-Security (HSTS) | {{HSTS_STATUS}} | {{HSTS_VALUE}} |
| X-Frame-Options | {{XFRAME_STATUS}} | {{XFRAME_VALUE}} |
| X-Content-Type-Options | {{XCONTENT_STATUS}} | {{XCONTENT_VALUE}} |
| Referrer-Policy | {{REFERRER_STATUS}} | {{REFERRER_VALUE}} |
| Permissions-Policy | {{PERMISSIONS_STATUS}} | {{PERMISSIONS_VALUE}} |

**Header Score:** {{HEADER_SCORE}}/6
**Verification Method:** {{HEADER_VERIFICATION_METHOD}} (e.g., securityheaders.com, curl, automated test)

---

## Authentication & Authorization Coverage

| Route Pattern | Auth Required | Method | Auth Mechanism | Last Verified |
|---------------|--------------|--------|---------------|---------------|
| {{ROUTE_PATTERN_1}} | {{ROUTE_AUTH_1}} | {{ROUTE_METHOD_1}} | {{ROUTE_MECHANISM_1}} | {{ROUTE_VERIFIED_1}} |
| {{ROUTE_PATTERN_2}} | {{ROUTE_AUTH_2}} | {{ROUTE_METHOD_2}} | {{ROUTE_MECHANISM_2}} | {{ROUTE_VERIFIED_2}} |
| {{ROUTE_PATTERN_3}} | {{ROUTE_AUTH_3}} | {{ROUTE_METHOD_3}} | {{ROUTE_MECHANISM_3}} | {{ROUTE_VERIFIED_3}} |

**Protected Routes:** {{PROTECTED_ROUTE_COUNT}} / {{TOTAL_ROUTE_COUNT}}
**Public Routes (intentional):** {{PUBLIC_ROUTE_COUNT}}
**Known Auth Bypasses:** {{AUTH_BYPASS_COUNT}} — {{AUTH_BYPASS_DETAILS}}

---

## Data Encryption Status

| Layer | Status | Details |
|-------|--------|---------|
| **In Transit (TLS)** | {{TLS_STATUS}} | TLS version: {{TLS_VERSION}}, certificate expires: {{TLS_CERT_EXPIRY}} |
| **At Rest (Database)** | {{DB_ENCRYPTION_STATUS}} | {{DB_ENCRYPTION_DETAILS}} |
| **Application-Level** | {{APP_ENCRYPTION_STATUS}} | Fields encrypted: {{ENCRYPTED_FIELDS}}, algorithm: {{ENCRYPTION_ALGORITHM}} |
| **Backups** | {{BACKUP_ENCRYPTION_STATUS}} | {{BACKUP_ENCRYPTION_DETAILS}} |
| **Secrets Management** | {{SECRETS_MGMT_STATUS}} | Provider: {{SECRETS_PROVIDER}}, last rotation: {{SECRETS_LAST_ROTATION}} |

---

## Compliance Status

### {{COMPLIANCE_FRAMEWORK_1}} (e.g., GDPR / SOC2 / HIPAA / PCI-DSS)

| Requirement | Status | Evidence | Last Reviewed |
|-------------|--------|----------|---------------|
| {{COMPLIANCE_REQ_1}} | {{COMPLIANCE_STATUS_1}} | {{COMPLIANCE_EVIDENCE_1}} | {{COMPLIANCE_REVIEWED_1}} |
| {{COMPLIANCE_REQ_2}} | {{COMPLIANCE_STATUS_2}} | {{COMPLIANCE_EVIDENCE_2}} | {{COMPLIANCE_REVIEWED_2}} |
| {{COMPLIANCE_REQ_3}} | {{COMPLIANCE_STATUS_3}} | {{COMPLIANCE_EVIDENCE_3}} | {{COMPLIANCE_REVIEWED_3}} |

**Overall Compliance:** {{COMPLIANCE_PERCENTAGE}}% requirements met
**Next Compliance Review:** {{NEXT_COMPLIANCE_REVIEW}}
**Compliance Officer/Owner:** {{COMPLIANCE_OWNER}}

---

## Security Changelog (Last 10 Changes)

| Date | Change | Category | Impact | Author |
|------|--------|----------|--------|--------|
| {{SEC_CHANGE_DATE_1}} | {{SEC_CHANGE_DESC_1}} | {{SEC_CHANGE_CAT_1}} | {{SEC_CHANGE_IMPACT_1}} | {{SEC_CHANGE_AUTHOR_1}} |
| {{SEC_CHANGE_DATE_2}} | {{SEC_CHANGE_DESC_2}} | {{SEC_CHANGE_CAT_2}} | {{SEC_CHANGE_IMPACT_2}} | {{SEC_CHANGE_AUTHOR_2}} |
| {{SEC_CHANGE_DATE_3}} | {{SEC_CHANGE_DESC_3}} | {{SEC_CHANGE_CAT_3}} | {{SEC_CHANGE_IMPACT_3}} | {{SEC_CHANGE_AUTHOR_3}} |
| {{SEC_CHANGE_DATE_4}} | {{SEC_CHANGE_DESC_4}} | {{SEC_CHANGE_CAT_4}} | {{SEC_CHANGE_IMPACT_4}} | {{SEC_CHANGE_AUTHOR_4}} |
| {{SEC_CHANGE_DATE_5}} | {{SEC_CHANGE_DESC_5}} | {{SEC_CHANGE_CAT_5}} | {{SEC_CHANGE_IMPACT_5}} | {{SEC_CHANGE_AUTHOR_5}} |

**Categories:** `dependency-update` | `header-change` | `auth-update` | `encryption-change` | `compliance-update` | `vulnerability-fix` | `access-change` | `config-change`

---

## Dashboard Maintenance

- **Update frequency:** After every sprint security check, after every audit, after every security-related deployment.
- **Owner:** {{SECURITY_DASHBOARD_OWNER}}
- **Escalation:** If grade drops below C, notify {{SECURITY_ESCALATION_CONTACT}} within 24 hours.
- **History:** Previous dashboard snapshots archived at {{DASHBOARD_ARCHIVE_PATH}}.

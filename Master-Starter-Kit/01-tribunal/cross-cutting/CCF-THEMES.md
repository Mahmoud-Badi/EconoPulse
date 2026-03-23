# Cross-Cutting Finding Themes

## Purpose

After auditing multiple services, patterns emerge. Individual CCFs cluster into larger themes — systemic issues that share a root cause. Identifying themes enables systemic fixes instead of one-off patches.

---

## How to Identify Themes

1. After each batch of PSTs, review all CCFs
2. Group CCFs that share a root cause or affected layer
3. Name the theme descriptively
4. Identify the systemic fix (one fix that addresses multiple CCFs)

---

## Theme Template

### Theme: _[Name]_

**Related CCFs:** CCF-XXX, CCF-YYY, CCF-ZZZ

**Root Cause:** _[Why do these findings keep appearing?]_

**Affected Layer:** Backend / Frontend / Database / Infrastructure / Documentation

**Affected Services:** _[Union of all related CCFs' affected services]_

**Systemic Fix:** _[One architectural or process change that prevents all related CCFs]_

**Effort:** S / M / L / XL

**Priority:** CRITICAL / HIGH / MEDIUM / LOW

---

## Common Theme Categories

These themes commonly emerge from service audits. Use as a starting checklist:

### 1. Authorization Gaps
- Missing role guards on endpoints
- Inconsistent permission checks
- Admin-only routes accessible to regular users

### 2. Multi-Tenant Isolation
- Missing tenant filters on queries
- Cross-tenant data leakage in list endpoints
- Tenant context not propagated to sub-queries

### 3. Data Model Documentation Drift
- Hub files list phantom fields/models
- Schema changes not reflected in hub data model section
- Enum values out of sync between hub and code

### 4. API Contract Inconsistency
- Response envelope format varies across services
- Error format not standardized
- HTTP status codes used incorrectly

### 5. Test Coverage Gaps
- "No tests" claims when tests exist
- Unit tests only — no integration or E2E
- Test quality tier mismatch (claimed comprehensive, actually basic assertions)

### 6. Soft-Delete Filtering
- Deleted records appearing in list queries
- Soft-delete not applied to relation queries
- Cascade soft-delete not implemented

### 7. Input Validation Gaps
- DTOs missing validation decorators
- Validation rules in hub don't match DTO constraints
- No server-side validation for critical fields

### 8. State Management Issues
- Missing loading/error/empty states in UI
- Optimistic updates without rollback
- Cache invalidation missing after mutations

### 9. Hub Accuracy
- Endpoint counts wrong
- Component counts wrong
- "Not implemented" labels on implemented features

### 10. Security Hygiene
- Credentials in environment variables not documented
- Rate limiting not applied to sensitive endpoints
- CORS configuration too permissive

---

## Tracking

| # | Theme | CCF Count | Services Affected | Systemic Fix Status |
|---|-------|-----------|-------------------|-------------------|
| 1 | | | | NOT STARTED |
| 2 | | | | NOT STARTED |
| 3 | | | | NOT STARTED |

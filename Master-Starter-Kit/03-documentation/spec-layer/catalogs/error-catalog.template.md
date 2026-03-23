# Error Catalog

> **Purpose:** Standardized error code system across all services in {{PROJECT_NAME}}.
> Every error the system can return — API, background job, integration — is registered here with its code, user message, and recovery action.
> If an error is not in this catalog, it must not be thrown.
>
> **Target:** 100-150 error codes across all services.

---

## How to Use This Catalog

1. **During spec writing:** When a service spec describes an error scenario, assign it a code from this catalog (or add a new one).
2. **During implementation:** Developers throw errors using the exact codes and messages defined here. No ad-hoc error strings.
3. **During frontend work:** UI developers map error codes to user-facing messages and recovery UX.
4. **During testing:** QA triggers every error code and verifies the user sees the correct message and recovery action.
5. **Cross-reference:** Every error code in service specs must appear here. The CROSS-REFERENCE-VALIDATOR checks this.

---

## Error Code Naming Convention

Format: `{SERVICE}_{ERROR_TYPE}_{SPECIFIC}` (UPPER_SNAKE_CASE)

| Component | Rule | Examples |
|-----------|------|----------|
| `SERVICE` | 2-5 letter service abbreviation | `AUTH`, `BIL`, `ORD`, `{{SERVICE_CODE_1}}`, `{{SERVICE_CODE_2}}` |
| `ERROR_TYPE` | Error category | `NOT_FOUND`, `VALIDATION`, `CONFLICT`, `FORBIDDEN`, `LIMIT`, `INTEGRATION`, `INTERNAL` |
| `SPECIFIC` | Specific context | `USER`, `EMAIL_TAKEN`, `EXPIRED_TOKEN`, `RATE_EXCEEDED` |

Examples:
- `AUTH_NOT_FOUND_USER` — User not found during authentication
- `AUTH_VALIDATION_EMAIL_FORMAT` — Email does not match required format
- `BIL_CONFLICT_DUPLICATE_CHARGE` — Attempted duplicate charge on same invoice

---

## Error Registry

| Code | HTTP Equiv | User Message | Service | Recovery Action | Retry? |
|------|-----------|-------------|---------|-----------------|--------|
| `AUTH_NOT_FOUND_USER` | 404 | The account associated with this email was not found. | {{AUTH_SERVICE}} | Verify email or create a new account | No |
| `AUTH_VALIDATION_PASSWORD_WEAK` | 422 | Password must be at least {{MIN_PASSWORD_LENGTH}} characters with uppercase, lowercase, and a number. | {{AUTH_SERVICE}} | Re-enter a stronger password | No |
| `AUTH_FORBIDDEN_ACCOUNT_LOCKED` | 403 | Your account has been locked due to too many failed attempts. Try again in {{LOCKOUT_MINUTES}} minutes. | {{AUTH_SERVICE}} | Wait for lockout period or contact support | No |
| `AUTH_CONFLICT_EMAIL_TAKEN` | 409 | An account with this email already exists. | {{AUTH_SERVICE}} | Log in or use a different email | No |
| `AUTH_LIMIT_RATE_EXCEEDED` | 429 | Too many requests. Please wait a moment and try again. | {{AUTH_SERVICE}} | Wait and retry | Yes |
| `{{ERROR_CODE}}` | {{HTTP_STATUS}} | {{USER_MESSAGE}} | {{SERVICE_NAME}} | {{RECOVERY_ACTION}} | {{YES_NO}} |
<!-- Repeat for every error. Target: 100-150 rows. -->
<!-- Group by service. Cover: validation, not-found, conflict, forbidden, rate-limit, integration, internal errors. -->

### HTTP Equivalence Guide

| HTTP Status | When to Use | Error Type Suffix |
|-------------|-------------|-------------------|
| 400 | Malformed request (bad JSON, missing required params) | `BAD_REQUEST` |
| 401 | Not authenticated (no token, expired token) | `UNAUTHENTICATED` |
| 403 | Authenticated but not authorized | `FORBIDDEN` |
| 404 | Resource not found | `NOT_FOUND` |
| 409 | Conflict with current state (duplicate, stale update) | `CONFLICT` |
| 422 | Validation failed (valid JSON but business rules violated) | `VALIDATION` |
| 429 | Rate limit exceeded | `LIMIT` |
| 502 | Upstream integration failure | `INTEGRATION` |
| 503 | Service temporarily unavailable | `UNAVAILABLE` |
| 500 | Unexpected internal error | `INTERNAL` |

---

## Error Response Envelope Format

All API errors MUST use this response envelope. No exceptions.

```json
{
  "success": false,
  "error": {
    "code": "AUTH_VALIDATION_PASSWORD_WEAK",
    "message": "Password must be at least 8 characters with uppercase, lowercase, and a number.",
    "details": [
      {
        "field": "password",
        "rule": "minLength",
        "expected": 8,
        "received": 3
      }
    ],
    "traceId": "abc-123-def-456",
    "timestamp": "2026-03-14T10:30:00Z"
  }
}
```

### Envelope Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `success` | boolean | Yes | Always `false` for errors |
| `error.code` | string | Yes | Error code from this catalog |
| `error.message` | string | Yes | User-safe message (never expose internals) |
| `error.details` | array | No | Field-level validation details (422 errors only) |
| `error.traceId` | string | Yes | Correlation ID for debugging (links to logs) |
| `error.timestamp` | ISO 8601 | Yes | When the error occurred |

### What NEVER Appears in Error Responses

| Prohibited | Reason |
|-----------|--------|
| Stack traces | Security risk — exposes internal code paths |
| Database query text | Security risk — exposes schema |
| Internal service names | Security risk — exposes architecture |
| Raw exception messages | Often contain PII or internal details |
| File paths | Security risk — exposes server structure |

---

## Error Code Naming Convention (Detailed)

### Per-Service Code Allocation

| Service | Code Prefix | Range | Allocated |
|---------|------------|-------|-----------|
| {{AUTH_SERVICE}} | `AUTH_` | 001-030 | {{COUNT}} |
| {{SERVICE_NAME_1}} | `{{SERVICE_CODE_1}}_` | 031-060 | {{COUNT}} |
| {{SERVICE_NAME_2}} | `{{SERVICE_CODE_2}}_` | 061-090 | {{COUNT}} |
| {{SERVICE_NAME_3}} | `{{SERVICE_CODE_3}}_` | 091-120 | {{COUNT}} |
| Shared / Infrastructure | `SYS_` | 121-150 | {{COUNT}} |

### Common Error Patterns Per Service

Every service should have at minimum:

| Pattern | Example | Count |
|---------|---------|-------|
| Not found for each entity | `SVC_NOT_FOUND_{ENTITY}` | 1 per entity |
| Validation for each create/update DTO | `SVC_VALIDATION_{FIELD}_{RULE}` | 2-5 per entity |
| Conflict for unique constraints | `SVC_CONFLICT_{FIELD}_TAKEN` | 1 per unique field |
| Forbidden for each protected action | `SVC_FORBIDDEN_{ACTION}` | 1 per restricted action |
| Integration failure per external dep | `SVC_INTEGRATION_{PROVIDER}_FAILED` | 1 per integration |

---

## Retry Policy

| Retry? | Meaning | Client Behavior |
|--------|---------|----------------|
| Yes | Transient error, may succeed on retry | Retry with exponential backoff ({{RETRY_BASE_MS}}ms base, {{RETRY_MAX_ATTEMPTS}} max attempts) |
| No | Permanent error, retry will not help | Show error to user with recovery action |
| Conditional | Depends on `Retry-After` header | Respect the `Retry-After` value if present |

---

## Completeness Checklist

- [ ] Every error scenario in every service spec has a matching error code here
- [ ] Every error code follows the naming convention
- [ ] Every error has a user-safe message (no internal details leaked)
- [ ] Every error has a recovery action (what should the user do?)
- [ ] Retry policy defined for every error code
- [ ] Error response envelope implemented consistently across all services
- [ ] Frontend error handling maps every code to appropriate UX (toast, inline, page-level)
- [ ] Error codes tested: every code is triggerable in integration tests
- [ ] No two error codes share the same HTTP status + message combination (each is distinguishable)

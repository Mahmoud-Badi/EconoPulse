# Error Handling Strategy — TaskFlow (Example)

> **READ ONLY — reference example.** This shows what a completed error handling spec looks like.

---

## HTTP Error Code Mapping

| HTTP Code | Meaning | When We Use It | User-Facing Message |
|-----------|---------|----------------|---------------------|
| **400** | Bad Request | Malformed request body, missing required fields | "Something went wrong with your request. Please check your input and try again." |
| **401** | Unauthorized | Missing or expired auth token | "Your session has expired. Please log in again." |
| **403** | Forbidden | Valid auth but insufficient permissions | "You don't have permission to perform this action." |
| **404** | Not Found | Resource doesn't exist or was deleted | "We couldn't find what you're looking for." |
| **409** | Conflict | Duplicate entry, version conflict | "This conflicts with an existing record. Please refresh and try again." |
| **422** | Unprocessable | Validation failed (correct format, wrong values) | Shows specific field-level errors (see below) |
| **429** | Rate Limited | Too many requests from this client | "You're making requests too quickly. Please wait a moment." |
| **500** | Server Error | Unhandled exception, infrastructure failure | "Something went wrong on our end. We've been notified and are looking into it." |

---

## Application-Level Error Codes

Every API error response follows this shape:

```json
{
  "error": {
    "code": "PROJECT_NAME_TAKEN",
    "message": "A project with this name already exists in your workspace.",
    "field": "name",
    "details": {}
  }
}
```

### Project Errors

| Code | HTTP | When | Message |
|------|------|------|---------|
| `PROJECT_NOT_FOUND` | 404 | Project ID doesn't exist | "Project not found." |
| `PROJECT_NAME_TAKEN` | 409 | Duplicate name in workspace | "A project with this name already exists." |
| `PROJECT_ARCHIVED` | 403 | Attempting to modify archived project | "This project is archived. Unarchive it to make changes." |
| `PROJECT_LIMIT_REACHED` | 403 | Free tier project limit | "You've reached your project limit. Upgrade to create more." |

### Task Errors

| Code | HTTP | When | Message |
|------|------|------|---------|
| `TASK_NOT_FOUND` | 404 | Task ID doesn't exist | "Task not found." |
| `TASK_ALREADY_ASSIGNED` | 409 | Task claimed by another user | "This task was just claimed by someone else. Please refresh." |
| `TASK_DEPENDENCY_INCOMPLETE` | 422 | Trying to start task with unfinished dependencies | "This task depends on [task name], which isn't complete yet." |
| `TASK_STATUS_INVALID` | 422 | Invalid status transition | "Can't move task from [current] to [target]." |

### Auth Errors

| Code | HTTP | When | Message |
|------|------|------|---------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Wrong email/password | "Invalid email or password." |
| `AUTH_EMAIL_TAKEN` | 409 | Registration with existing email | "An account with this email already exists." |
| `AUTH_TOKEN_EXPIRED` | 401 | JWT expired | "Your session has expired. Please log in again." |
| `AUTH_INSUFFICIENT_ROLE` | 403 | Action requires higher role | "This action requires admin privileges." |
| `AUTH_ACCOUNT_DISABLED` | 403 | Account suspended/disabled | "Your account has been disabled. Contact support." |

### Billing Errors

| Code | HTTP | When | Message |
|------|------|------|---------|
| `BILLING_PAYMENT_FAILED` | 402 | Stripe charge declined | "Your payment was declined. Please update your payment method." |
| `BILLING_PLAN_REQUIRED` | 403 | Feature requires paid plan | "This feature requires a Pro plan. Upgrade to access it." |
| `BILLING_SEAT_LIMIT` | 403 | Team member limit reached | "You've reached the member limit for your plan." |

---

## Validation Error Format

For 422 errors, return field-level errors:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Please fix the following errors.",
    "fields": {
      "name": "Name must be between 1 and 100 characters.",
      "email": "Please enter a valid email address.",
      "startDate": "Start date must be in the future."
    }
  }
}
```

### Validation Rules

| Field Pattern | Rule | Error Message |
|--------------|------|---------------|
| Email | RFC 5322 format | "Please enter a valid email address." |
| Password | Min 8 chars, 1 uppercase, 1 number | "Password must be at least 8 characters with one uppercase letter and one number." |
| Name fields | 1-100 chars, no leading/trailing whitespace | "[Field] must be between 1 and 100 characters." |
| URLs | Valid URL format with protocol | "Please enter a valid URL (e.g., https://example.com)." |
| Dates | ISO 8601, logical range | "Please enter a valid date." / "[Field] must be after [other field]." |
| Numbers | Positive, within range | "[Field] must be a positive number." / "[Field] must be between [min] and [max]." |

---

## Retry Strategy

| Error Type | Retry? | Strategy | Max Attempts |
|-----------|--------|----------|-------------|
| **Network timeout** | Yes | Exponential backoff: 1s, 2s, 4s | 3 |
| **500 Server Error** | Yes | Exponential backoff: 2s, 4s, 8s | 3 |
| **429 Rate Limited** | Yes | Use `Retry-After` header, or 10s default | 3 |
| **401 Token Expired** | Yes (once) | Refresh token, then retry original request | 1 |
| **400/403/404/409/422** | No | Show error to user immediately | 0 |

### Frontend Retry Implementation

```typescript
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);

    if (response.ok) return response;

    // Don't retry client errors (except 429)
    if (response.status >= 400 && response.status < 500 && response.status !== 429) {
      throw new AppError(await response.json());
    }

    // Don't retry on last attempt
    if (attempt === maxRetries) {
      throw new AppError(await response.json());
    }

    // Exponential backoff
    const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}
```

---

## Error Logging Format

Every error gets logged with this structure:

```json
{
  "level": "error",
  "timestamp": "2025-03-15T14:30:00.000Z",
  "requestId": "req_abc123",
  "userId": "user_456",
  "method": "POST",
  "path": "/api/v1/projects",
  "statusCode": 409,
  "errorCode": "PROJECT_NAME_TAKEN",
  "message": "Duplicate project name in workspace ws_789",
  "stack": "Error: PROJECT_NAME_TAKEN\n    at createProject (src/services/projects.ts:45)...",
  "metadata": {
    "workspaceId": "ws_789",
    "projectName": "My Project"
  }
}
```

**What to log:**
- All 5xx errors (always — these are bugs)
- All 401/403 errors (security audit trail)
- 429 errors (rate limit monitoring)
- 4xx errors with unusual frequency (possible abuse)

**What NOT to log:**
- Passwords, tokens, or secrets (redact before logging)
- Full request bodies with PII (log field names only)
- Expected 404s (routine misses from clients)

---

## Graceful Degradation

When a non-critical service fails, degrade gracefully instead of crashing:

| Service | If It Fails | Fallback |
|---------|------------|----------|
| **Notifications** | Email/push fails | Queue for retry, show in-app banner "Notification delayed" |
| **Analytics** | Tracking endpoint down | Drop events silently, don't block user actions |
| **Search** | Elasticsearch down | Fall back to basic database LIKE query |
| **File uploads** | S3 unavailable | Show "Upload temporarily unavailable, try again in a few minutes" |
| **Third-party APIs** | Stripe/Twilio timeout | Queue the action, retry with backoff, notify user if it fails permanently |

**Rule:** Never let a non-critical service failure block the user's primary workflow. The core loop (see A3 in intake) must always work.

---

## Soft vs Hard Errors

Not all errors are equal. The distinction between soft and hard errors determines whether execution continues or halts.

### Soft Errors (Non-Critical)

Soft errors represent failures in auxiliary systems that **do not block the user's primary workflow**. The application logs them, may retry in the background, but never surfaces them as blocking errors to the user.

| Category | Example | Handling |
|----------|---------|----------|
| **Notification failure** | Email send fails via Resend API | Log error, queue for retry (max 3 attempts), user sees "notification delayed" badge at most |
| **Analytics tracking failure** | Tracking endpoint returns 500 or times out | Drop the event silently, increment a `analytics_dropped` metric counter, never block the user action |
| **Search indexing delay** | Elasticsearch indexing queue is backed up | New records are still saved to the database (source of truth), search results may be stale for minutes, show "results may be updating" hint |
| **Third-party enrichment** | Company logo lookup API fails | Show placeholder avatar, retry on next page load |
| **Cache write failure** | Redis write times out | Fall through to database read, log cache miss, do not crash |

**Key principle:** If the user's core action (create project, assign task, log time) succeeded in the database, auxiliary failures are soft errors.

### Hard Errors (Critical)

Hard errors represent failures that **must stop execution immediately**. Continuing past a hard error would result in security breaches, data corruption, or incorrect business logic.

| Category | Example | Response |
|----------|---------|----------|
| **Authentication failure** | JWT is invalid, expired, or missing | Return `401 Unauthorized`, redirect to login, do not execute any business logic |
| **Tenant isolation breach** | Request attempts to access a resource in another workspace | Return `403 Forbidden` with `TENANT_ACCESS_DENIED`, log as security incident, alert on-call if frequency exceeds threshold |
| **Data integrity violation** | Foreign key constraint failure, unique constraint violation, invalid enum value | Return `500 Internal Server Error`, rollback transaction, log full stack trace with request context |
| **Payment processing failure** | Stripe returns a charge error during a plan upgrade | Return `402 Payment Required`, do not provision the upgrade, show clear error to user |
| **Schema migration failure** | Migration fails mid-execution | Halt deployment, rollback migration, alert DevOps team |

**Key principle:** If continuing would compromise security, data integrity, or financial accuracy, it is a hard error. Stop immediately.

---

## Graceful Degradation Table

| Feature | Failure Mode | Degraded Behavior | User Impact |
|---------|-------------|-------------------|-------------|
| **Notifications** | Email queue (Resend/SES) is down | Notifications are written to `notification_log` table for retry. In-app notification bell still works (database-backed). Background job retries every 5 minutes for up to 1 hour. | User sees delayed email notifications (minutes to 1 hour). In-app notifications work normally. |
| **Search** | Elasticsearch index unavailable | Search falls back to PostgreSQL `ILIKE` query with `tsvector` full-text search. Results are accurate but slower (~200ms vs ~20ms). Autocomplete is disabled. | User sees slower search results. No autocomplete suggestions. Complex queries (fuzzy match, synonyms) are degraded. |
| **File Upload** | S3 / object storage timeout | Retry with exponential backoff (1s, 2s, 4s). After 3 failures, show a retry prompt to the user with a "Try Again" button. File is held in browser memory (not lost). | User sees a retry prompt. File is not lost — they can retry without re-selecting. Upload resumes from where it failed if multipart. |
| **Dashboard KPIs** | Analytics aggregation query times out | Show cached KPI values from the last successful calculation (stored in `kpi_cache` table with TTL). Display "Last updated: X minutes ago" label. | User sees slightly stale numbers with a staleness indicator. Core navigation and CRUD still work. |
| **Real-time Updates** | WebSocket connection drops | Fall back to polling every 30 seconds. Show a subtle "reconnecting..." banner. Auto-reconnect with backoff. | User sees slightly delayed updates. Manual refresh always works. Banner disappears on reconnect. |
| **Third-Party Integrations** | Stripe, Twilio, or external API timeout | Queue the action for async retry. Show "Processing..." status. Notify user via in-app notification when the action completes or permanently fails. | User is not blocked. They see a processing indicator and get notified of the outcome. |

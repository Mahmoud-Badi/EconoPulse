# API Versioning Strategy

> **How to evolve your API without breaking the people who depend on it.** API versioning is not a technical problem. It is a trust problem. Every breaking change tests your consumers' patience. This guide helps you make the right versioning decisions and communicate changes effectively.

---

## Why API Versioning Matters

The moment someone writes code against your API, you have made an implicit promise: "This will keep working." Every time you break that promise, you cost your consumers hours of debugging, deploys, and frustration. Do it enough times and they leave.

API versioning is the mechanism that lets you evolve your API while honoring that promise. Get it wrong, and you end up with either a frozen API that cannot improve or a constantly-breaking API that nobody trusts.

---

## Versioning Strategies

### Strategy 1: URL Path Versioning

```
GET /api/v1/users
GET /api/v2/users
```

**How it works:** The version is part of the URL path. Each major version is a distinct set of endpoints.

**Advantages:**
- Most intuitive for developers
- Easy to test (just change the URL)
- Easy to route at the load balancer level
- Version is visible in logs, monitoring, and debugging
- Cache-friendly (different URLs = different cache keys)

**Disadvantages:**
- Tempts you to create too many versions (version sprawl)
- Every version is a full set of endpoints to maintain
- Consumers must update URLs throughout their codebase

**Best for:** Public APIs, REST APIs, APIs with external consumers

### Strategy 2: Header Versioning

```
GET /api/users
Accept: application/vnd.myapp.v2+json
```

**How it works:** The version is specified in the `Accept` header (or a custom header like `X-API-Version: 2`).

**Advantages:**
- Clean URLs (no version clutter)
- URL stays stable — consumers only change a header
- Easier to experiment with new versions (toggle a header)

**Disadvantages:**
- Harder to test (cannot just paste a URL into a browser)
- Version is invisible in URL-based logging and monitoring
- Some clients (especially browser-based) make custom headers difficult
- Not cache-friendly without Vary header configuration

**Best for:** APIs consumed primarily by backend services, APIs where URL cleanliness matters (public-facing docs)

### Strategy 3: Query Parameter Versioning

```
GET /api/users?version=2
```

**How it works:** The version is a query parameter.

**Advantages:**
- Easy to implement
- Easy to test (add parameter to URL)
- Optional — can default to latest or a pinned version

**Disadvantages:**
- Feels hacky (version is not really a "query")
- Can conflict with other query parameters
- Caching is complicated (query params vary cache keys unpredictably)
- Not RESTful (version is not a resource property)

**Best for:** Internal APIs, rapid prototyping, APIs where you do not want to commit to a formal versioning strategy yet

### Strategy 4: No Explicit Versioning (Additive Changes Only)

```
GET /api/users
# Response always grows, never shrinks
```

**How it works:** You never create versions. You only make additive changes (new fields, new endpoints). You never remove or rename anything.

**Advantages:**
- Zero versioning overhead
- Consumers never have to migrate
- Simplest to maintain

**Disadvantages:**
- Eventually, the API becomes bloated with legacy fields
- You can never fix naming mistakes
- Performance degrades as responses grow
- Only works for small, stable APIs

**Best for:** Internal APIs with a single consumer, APIs in early development

---

## Decision Tree: Choosing Your Strategy

```
START
│
├─ Is this a public API with external consumers?
│  └─ YES → URL Path Versioning (/api/v1/)
│     (External consumers expect this. It is the most forgiving strategy.)
│
├─ Is this consumed by mobile apps you control?
│  └─ YES → URL Path Versioning
│     (Mobile apps in the wild cannot be force-updated. You need old versions
│      to keep working until users update.)
│
├─ Is this consumed only by your own frontend?
│  └─ YES → No Explicit Versioning (additive changes)
│     (You control both sides. Just deploy both at the same time.)
│
├─ Is this consumed by a small number (<10) of known backend integrators?
│  └─ YES → Header Versioning
│     (You can coordinate with them directly.)
│
└─ Not sure?
   └─ URL Path Versioning
      (It is the safest default. You can always migrate to a more
       sophisticated strategy later. You cannot easily migrate away
       from the wrong one.)
```

---

## Backward Compatibility Rules

Understanding what is safe and what is breaking prevents accidental version bumps.

### Safe Changes (No Version Bump Needed)

| Change | Why It Is Safe |
|--------|---------------|
| Add a new endpoint | Existing consumers do not call it |
| Add a new optional field to a request | Existing consumers do not send it |
| Add a new field to a response | Consumers should ignore unknown fields |
| Add a new optional query parameter | Existing consumers do not send it |
| Add a new enum value to a response field | Consumers should handle unknown values gracefully |
| Add a new webhook event type | Consumers should ignore unknown events |
| Increase a rate limit | More capacity is never breaking |
| Fix a bug (correct behavior to match docs) | Spec-compliant behavior is not a break (but communicate it) |

### Breaking Changes (Require a Version Bump)

| Change | Why It Breaks |
|--------|--------------|
| Remove an endpoint | Consumers calling it get 404s |
| Remove a field from a response | Consumers parsing it get null/undefined |
| Rename a field | Same as remove + add (consumers parse the old name) |
| Change a field's type | `"id": 123` to `"id": "abc"` breaks parsing |
| Change the meaning of a value | `"status": "active"` now means something different |
| Make an optional field required | Existing requests without it start failing |
| Change authentication mechanism | All existing auth tokens stop working |
| Change the URL structure | All hardcoded URLs break |
| Reduce a rate limit | Consumers within the old limit start getting throttled |
| Remove an enum value from a request | Consumers sending it get validation errors |

### The Gray Zone

| Change | Safe? | Recommendation |
|--------|-------|---------------|
| Add a required field to a request | BREAKING | Always make new fields optional with a default |
| Change error response format | Depends | If consumers parse error responses, it is breaking |
| Change pagination format | BREAKING | Consumers have pagination logic built |
| Reorder response fields | Technically safe | But test it — some consumers depend on order |
| Change default sort order | BREAKING | Consumers expect consistent ordering |
| Add server-side validation | Depends | If it rejects previously accepted input, it is breaking |

---

## Breaking Change Policy

When a breaking change is unavoidable:

### 1. Create a New Version

```
/api/v1/users  ← continues to work (old behavior)
/api/v2/users  ← new behavior
```

### 2. Communicate with a 90-Day Runway

Follow the timeline in `feature-deprecation-playbook.md`:
- Day 0: Announce the new version and deprecation of the old
- Day 30: Send targeted communication to active consumers of the old version
- Day 60: Final notice with hard removal date
- Day 90: Remove (or stop maintaining) the old version

### 3. Provide Migration Tools

- **Diff documentation:** Show exactly what changed between v1 and v2 for each endpoint
- **Code examples:** Before (v1) and After (v2) for every breaking change
- **Automated migration:** If possible, provide a script or tool that updates consumer code
- **Compatibility layer:** If feasible, run a translation layer that maps v1 requests to v2 internally (buys time for consumers)

### 4. Add Deprecation Headers to Old Version Responses

```http
HTTP/1.1 200 OK
Deprecation: Sat, 15 Feb 2026 00:00:00 GMT
Sunset: Sat, 15 May 2026 00:00:00 GMT
Link: <https://docs.example.com/api/v2/migration>; rel="deprecation"
```

---

## Version Lifecycle

Every API version moves through these stages:

```
ACTIVE ──────→ DEPRECATED ──────→ SUNSET ──────→ REMOVED
(current)      (still works,      (read-only or   (returns 410)
               warnings added)    degraded)
```

| Stage | Duration | What Happens |
|-------|----------|-------------|
| **Active** | Until next major version ships | Full support, new features, bug fixes |
| **Deprecated** | Minimum 90 days (longer for major APIs) | Works normally but warnings are sent. No new features. Security and critical bug fixes only. |
| **Sunset** | 30 days (optional stage) | May operate in read-only mode. Degraded performance acceptable. |
| **Removed** | Permanent | Endpoints return `410 Gone` with migration information |

### How Many Versions to Support Simultaneously

| API Type | Max Active Versions | Rationale |
|----------|-------------------|-----------|
| Internal (single consumer) | 1 | You control both sides |
| Internal (multiple teams) | 2 | Gives teams a quarter to migrate |
| Public (small user base) | 2 | 90-day deprecation is sufficient |
| Public (large user base) | 2-3 | Larger user base needs more time |
| Enterprise / regulated | 3+ | Contractual obligations may require longer support |

**Rule of thumb:** Never support more than 3 major versions simultaneously. If you are supporting 4+, you are not deprecating aggressively enough.

---

## API Changelog Format

Maintain a changelog separate from the product changelog. API consumers care about different things than product users.

```markdown
# API Changelog

## v2.3.0 - 2026-02-15

### Added
- `GET /api/v2/reports/export` — Export reports in CSV or JSON format
- `user.timezone` field added to `GET /api/v2/users/:id` response
- `filter[created_after]` query parameter on `GET /api/v2/items`

### Changed
- `GET /api/v2/items` now returns 50 items per page (was 25)
- Rate limit for authenticated requests increased to 1000/hour (was 500/hour)

### Fixed
- `PATCH /api/v2/users/:id` no longer returns 500 when updating email to current value
- Pagination `next_cursor` field now correctly omitted on last page (was returning null)

### Deprecated
- `GET /api/v1/users` — Use `GET /api/v2/users` instead. Sunset date: 2026-05-15.
- `api_key` authentication — Use OAuth 2.0 instead. Sunset date: 2026-06-01.
```

---

## SDK Versioning Strategy

If you provide client SDKs (JavaScript, Python, Ruby, etc.), their versioning must coordinate with the API versioning.

### SDK Version Mapping

```
API v1 → SDK v1.x.x
API v2 → SDK v2.x.x (major bump when API has a major bump)
```

### SDK Versioning Rules

1. **SDK major version matches API major version.** If the API is v2, the SDK is v2.x.x.
2. **SDK minor/patch versions are independent.** SDK bug fixes and improvements bump SDK versions independently of the API.
3. **Support the same number of SDK versions as API versions.** If API v1 is deprecated, SDK v1 is deprecated.
4. **Pin SDK to API version.** The SDK should send the API version it was built for, not "latest."

```javascript
// Good: SDK pins to a specific API version
const client = new MyAppClient({
  apiKey: "...",
  apiVersion: "2026-02-01"  // Pinned version
});

// Bad: SDK uses whatever the server default is
const client = new MyAppClient({
  apiKey: "..."
  // No version pinned — behavior changes without SDK update
});
```

---

## GraphQL Versioning Considerations

GraphQL complicates traditional versioning because there is typically one endpoint (`/graphql`) and the schema evolves.

### How GraphQL Handles Versioning

GraphQL's built-in approach is **schema evolution** (no explicit versions):

1. **Add new fields freely** — Consumers only get fields they query for
2. **Mark fields as deprecated** with the `@deprecated` directive
3. **Never remove fields** — Only deprecate them

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  username: String @deprecated(reason: "Use `name` instead. Will be removed 2026-06-01.")
}
```

### When GraphQL Still Needs Versioning

- **Schema redesigns** — If the type structure fundamentally changes, you may need a v2 schema
- **Authentication changes** — Same as REST; auth changes are always breaking
- **Performance changes** — If query cost limits change, existing queries may start failing

### GraphQL Deprecation Best Practices

```
1. Add @deprecated directive with reason and removal date
2. Log usage of deprecated fields (who is still querying them?)
3. Send targeted communication to consumers querying deprecated fields
4. Remove the field only when zero active consumers query it (or after the sunset date)
```

---

## Monitoring API Version Usage

You cannot deprecate what you cannot measure. Track these metrics:

| Metric | How to Measure | Why |
|--------|---------------|-----|
| Requests per version per day | API gateway logs | Know which versions are active |
| Unique consumers per version | API key / OAuth client tracking | Know who to notify |
| Deprecated endpoint usage | Request logs filtered by deprecated endpoints | Know when it is safe to remove |
| Error rates by version | Error tracking per version | Old versions may degrade without notice |
| Migration progress | % of consumers on latest version over time | Track adoption of new versions |

### Dashboard Setup

```
Version Distribution (pie chart):
  v2: 73% of requests
  v1: 27% of requests (deprecated)

Migration Trend (line chart over 90 days):
  v2 adoption: 45% → 73% (trending up)
  v1 usage: 55% → 27% (trending down)

At-Risk Consumers (table):
  | Consumer | Version | Last Request | Contact |
  |----------|---------|-------------|---------|
  | Acme Corp | v1 | Today | api@acme.com |
  | Beta Inc | v1 | 3 days ago | dev@beta.io |
```

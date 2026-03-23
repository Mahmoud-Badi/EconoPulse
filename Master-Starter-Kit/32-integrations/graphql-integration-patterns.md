# GraphQL Integration Patterns

> Consuming a third-party GraphQL API differs significantly from REST. This guide covers client setup, schema-driven type generation, query optimization, caching strategies, and the gotchas that trip up teams new to GraphQL consumption.

---

## When You're Consuming GraphQL APIs

Common third-party GraphQL APIs:
- **GitHub API v4** — Repository, PR, and organization data
- **Shopify Storefront API** — Product catalog, cart, checkout
- **Contentful GraphQL API** — Headless CMS content
- **Hasura** — Auto-generated GraphQL from database
- **Stripe (limited)** — Some data available via GraphQL
- **WPGraphQL** — WordPress data via GraphQL
- **Hygraph (ex-GraphCMS)** — Headless CMS

---

## Client Selection

| Client | Language | Best For | Bundle Size | Learning Curve |
|--------|----------|----------|-------------|----------------|
| **Apollo Client** | JS/TS | Full-featured apps, normalized caching | ~33KB gzip | Medium |
| **urql** | JS/TS | Lightweight apps, simpler caching | ~7KB gzip | Low |
| **graphql-request** | JS/TS | Server-side, simple queries, no caching | ~3KB gzip | Very low |
| **TanStack Query + graphql-request** | JS/TS | Server-side with React Query patterns | ~5KB gzip | Low |
| **gql.tada** | TS | Type-safe queries without codegen step | ~2KB gzip | Low |

### Decision Tree

```
Need normalized client-side cache?
  ├─ Yes → Apollo Client or urql
  │   ├─ Complex cache invalidation needs? → Apollo Client
  │   └─ Simpler is better? → urql
  └─ No
      ├─ Server-side only (API routes, SSR)?
      │   └─ graphql-request (or fetch with tagged templates)
      └─ Client-side but using React Query/TanStack?
          └─ graphql-request + TanStack Query
```

---

## Schema Introspection & Type Generation

### Why Generate Types

GraphQL APIs have a schema — a machine-readable definition of every type, field, and relationship. Use this to generate TypeScript types so your queries are type-safe:

- Catch query errors at build time, not runtime
- Get autocomplete for field names in your editor
- Response types are automatically derived from your queries

### Codegen Workflow

```
1. Introspect remote schema → download schema.graphql
2. Write your queries/mutations in .graphql files
3. Run codegen → generates TypeScript types + typed hooks
4. Import and use typed hooks in your application code
```

### Tools

| Tool | Generates | Framework Support |
|------|-----------|------------------|
| **GraphQL Code Generator** | Types, hooks (Apollo/urql/React Query), resolvers | All |
| **gql.tada** | Types at build time, no separate codegen step | TypeScript only |
| **Relay Compiler** | Types + optimized queries for Relay | Relay only |

### Schema Refresh Strategy

- **Development:** Introspect on demand (`npm run codegen`)
- **CI:** Introspect and verify types match on every PR
- **Monthly:** Re-download schema to catch provider changes
- **On breaking change:** Re-run codegen immediately, fix type errors

---

## Query Optimization

### Persisted Queries

Instead of sending the full query string with every request, send a hash. The server looks up the full query by hash.

**Benefits:**
- Reduced bandwidth (hash vs. full query text)
- Prevents arbitrary queries (security — only pre-registered queries allowed)
- CDN-cacheable (GET requests with query hash)

**Support:** Shopify Storefront API, Apollo Server, Hasura, most production GraphQL servers.

### Query Batching

Combine multiple independent queries into a single HTTP request:

```
Before: 3 requests (user, products, settings)
After:  1 request  [{ query: userQuery }, { query: productsQuery }, { query: settingsQuery }]
```

**Caution:** Not all providers support batching. Check documentation.

### Fragment Reuse

Define reusable fragments for common field selections to keep queries DRY and consistent:

```graphql
fragment ProductFields on Product {
  id
  title
  price
  imageUrl
}

query GetProducts {
  products { ...ProductFields }
}

query GetProduct($id: ID!) {
  product(id: $id) { ...ProductFields }
}
```

### Pagination Patterns

| Pattern | Description | Pros | Cons |
|---------|-------------|------|------|
| **Cursor-based** | `after: "cursor123", first: 20` | Efficient, consistent | Can't jump to page N |
| **Offset-based** | `offset: 40, limit: 20` | Simple, jump to any page | Slow for deep pages |
| **Relay-style** | `edges { node { ... } cursor } pageInfo` | Standardized | Verbose |

Most GraphQL APIs use cursor-based pagination. Implement infinite scroll or "Load More" UI patterns.

---

## Caching Strategies

### Normalized Cache (Apollo Client)

Apollo Client stores data in a normalized cache keyed by `__typename:id`:

```
Cache: {
  "Product:123": { id: "123", title: "Widget", price: 29.99 },
  "Product:456": { id: "456", title: "Gadget", price: 49.99 },
  "User:1": { id: "1", name: "Alice" }
}
```

**Benefits:** Update a product in one query, and all queries referencing that product automatically reflect the change.

**When to use:** Client-side applications with multiple views showing the same data.

### Document Cache (urql, TanStack Query)

Cache entire query responses keyed by the query + variables:

```
Cache: {
  "{ products(first: 20) }": { data: [...] },
  "{ product(id: 123) }": { data: { ... } }
}
```

**Benefits:** Simpler mental model, less overhead.

**When to use:** Server-side rendering, simpler applications, or when data doesn't overlap across queries.

### Cache Policies

| Policy | Description | Use Case |
|--------|-------------|----------|
| **cache-first** | Return cached data, don't fetch | Static data (categories, settings) |
| **cache-and-network** | Return cached immediately, fetch in background | Dynamic data (products, posts) |
| **network-only** | Always fetch, update cache | Fresh data required (cart, checkout) |
| **no-cache** | Always fetch, don't cache | Sensitive data (tokens, secrets) |

---

## Error Handling

### GraphQL Error Types

GraphQL responses can contain both data and errors simultaneously:

```json
{
  "data": { "user": { "name": "Alice" }, "products": null },
  "errors": [
    { "message": "Not authorized", "path": ["products"], "extensions": { "code": "FORBIDDEN" } }
  ]
}
```

### Error Categories

| Category | `extensions.code` | Retry? | User Action |
|----------|-------------------|--------|-------------|
| Validation | `GRAPHQL_VALIDATION_FAILED` | No | Fix the query |
| Authentication | `UNAUTHENTICATED` | After re-auth | Redirect to login |
| Authorization | `FORBIDDEN` | No | Show permission error |
| Not Found | `NOT_FOUND` | No | Show 404 |
| Rate Limited | `RATE_LIMITED` | Yes (with backoff) | Wait and retry |
| Internal Error | `INTERNAL_SERVER_ERROR` | Yes (limited) | Show error, retry |
| Network Error | (no GraphQL response) | Yes | Show offline state |

### Partial Data Handling

Unlike REST (where 200 = success, 500 = failure), GraphQL can return partial success. Your code must handle:

1. Query succeeds fully → render all data
2. Query partially succeeds → render available data, show error for failed parts
3. Query fails completely → show error state
4. Network error → show offline state

---

## Security Considerations

### Query Complexity Limits

If you're building a GraphQL API (not just consuming), protect against expensive queries:

- **Depth limiting:** Reject queries deeper than N levels
- **Complexity scoring:** Assign cost to each field, reject queries exceeding budget
- **Timeout:** Kill queries running longer than X seconds

When consuming third-party GraphQL APIs, be aware they may have complexity limits — your query may be rejected if it's too nested or requests too many fields.

### Introspection in Production

Many providers disable introspection in production. Download and store the schema during development:

```
# Download schema for offline reference
npx graphql-inspector introspect https://api.provider.com/graphql > schema.graphql
```

---

## Migration: REST to GraphQL

If a provider offers both REST and GraphQL (e.g., GitHub, Shopify), consider migrating:

### When to Switch

| Factor | Stay with REST | Switch to GraphQL |
|--------|---------------|-------------------|
| Data needs | Simple CRUD, standard responses | Complex nested data, multiple resources per request |
| Over-fetching | Acceptable | Significant bandwidth waste |
| Under-fetching | Rare | Multiple REST calls for one UI view |
| Team experience | REST-only team | GraphQL experience available |
| Rate limits | Comfortable margin | Near limit (GraphQL reduces call count) |

### Migration Strategy

1. Keep REST for existing working integrations
2. Use GraphQL for new features requiring complex data
3. Migrate REST → GraphQL incrementally (one endpoint at a time)
4. Run both in parallel during migration (REST as fallback)
5. Remove REST calls once GraphQL is proven stable

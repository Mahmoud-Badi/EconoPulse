# {{PROJECT_NAME}} — Shopify Integration

> **Owner:** {{LEAD_DEVELOPER}}
> **Integration Type:** Custom App / Public App / Storefront API only
> **Shopify API Version:** {{SHOPIFY_API_VERSION}}
> **Last Updated:** {{DATE}}

---

## 1. Integration Scope

| Feature | API | Purpose | Status |
|---------|-----|---------|--------|
| Product catalog sync | Admin API (REST/GraphQL) | Keep product data in sync | Planned / Done |
| Storefront display | Storefront API (GraphQL) | Display products in custom frontend | Planned / Done |
| Order management | Admin API | Process and manage orders | Planned / Done |
| Webhook events | Admin API webhooks | React to store events | Planned / Done |
| Checkout | Checkout API / Storefront API | Custom checkout flow | Planned / Done |

---

## 2. API Selection

### Shopify's APIs

| API | Auth | Use Case | Rate Limit |
|-----|------|----------|------------|
| **Admin REST API** | Admin access token | CRUD operations on store data | 2 req/s (leaky bucket, 40 capacity) |
| **Admin GraphQL API** | Admin access token | Complex queries, mutations | 1000 cost points/s (50 point bucket) |
| **Storefront API** | Storefront access token | Read-only product/collection data, cart, checkout | No rate limit (but throttled under load) |
| **Hydrogen/Oxygen** | Storefront token | Shopify's React framework for custom storefronts | N/A |

**Recommendation:** Use **GraphQL Admin API** for backend operations and **Storefront API** for frontend product display. REST Admin API only for endpoints not yet available in GraphQL.

### GraphQL Cost Calculation

Shopify GraphQL queries have a calculated "cost" based on complexity:

```
Query cost = requested_fields × connection_size

Example:
  products(first: 10) {    ← 10 products
    variants(first: 5) {   ← 5 variants each
      title
    }
  }
  Cost = 10 + (10 × 5) = 60 points

Available points: 1000/s, bucket: 50 points
Bucket refills at 50 points/s
```

Use `extensions.cost` in GraphQL responses to track actual vs. estimated costs.

---

## 3. Authentication

### Custom App (Single Store)

For integrating with your own Shopify store or a specific client's store:

1. Create Custom App in Shopify Admin → Settings → Apps → Develop Apps
2. Configure Admin API scopes
3. Install app → receive Admin API access token
4. Store token as `SHOPIFY_ADMIN_TOKEN`

### Public App (Multi-Store / App Store)

For apps distributed via Shopify App Store:

1. Create app in Shopify Partners dashboard
2. Implement OAuth flow:
   ```
   Store owner clicks Install
     → Redirect to your /auth with shop URL
     → Redirect to Shopify /admin/oauth/authorize
     → User approves scopes
     → Shopify redirects to your callback with auth code
     → Exchange code for access token
     → Store token per shop (database)
   ```
3. Handle access token refresh (Shopify tokens don't expire for custom apps, but may be revoked)

### Required Scopes

| Scope | Purpose | Required For |
|-------|---------|-------------|
| `read_products` | Read product data | Product sync |
| `write_products` | Create/update products | Product management |
| `read_orders` | Read order data | Order sync |
| `write_orders` | Update orders | Order management |
| `read_customers` | Read customer data | Customer sync |
| `read_inventory` | Read inventory levels | Stock management |
| {{ADDITIONAL_SCOPE}} | {{PURPOSE}} | {{FEATURE}} |

---

## 4. Webhook Configuration

### Critical Webhooks

| Topic | Event | Handler | Priority |
|-------|-------|---------|----------|
| `orders/create` | New order placed | `handleOrderCreate` | High |
| `orders/paid` | Order payment confirmed | `handleOrderPaid` | High |
| `orders/fulfilled` | Order shipped | `handleOrderFulfilled` | Medium |
| `orders/cancelled` | Order cancelled | `handleOrderCancelled` | High |
| `products/update` | Product modified | `handleProductUpdate` | Medium |
| `products/delete` | Product removed | `handleProductDelete` | Medium |
| `app/uninstalled` | Store uninstalls your app | `handleAppUninstalled` | Critical |
| `shop/update` | Store settings changed | `handleShopUpdate` | Low |

### Webhook Verification

Shopify webhooks are signed with HMAC-SHA256:
- Header: `X-Shopify-Hmac-Sha256`
- Compare: Base64-encoded HMAC of raw body using `SHOPIFY_WEBHOOK_SECRET`

### Webhook Gotchas

- **Registrations can silently expire.** Verify monthly with `GET /admin/api/{{VERSION}}/webhooks.json`
- **Shopify retries failed webhooks** for 48 hours (19 attempts with increasing delays)
- **Webhook payloads don't include all fields.** You may need to fetch the full resource via API
- **Topic format changed between API versions.** Pin your API version

---

## 5. Product Sync Strategy

### Sync Direction

| Direction | Mechanism | Frequency |
|-----------|-----------|-----------|
| Shopify → Your System | Webhooks (real-time) + daily full sync | Continuous + daily |
| Your System → Shopify | API calls on change | On-demand |
| Bidirectional | Webhooks + API calls + conflict resolution | Continuous |

### Full Sync Implementation

```
Daily Full Sync (scheduled job):
1. Fetch all products via GraphQL (paginated, cursor-based)
2. For each product, compare with local database
3. Upsert local records (update if changed, insert if new)
4. Soft-delete local records not found in Shopify
5. Log sync summary (created, updated, deleted, unchanged)
```

### Rate Limit-Aware Sync

```
Query cost budget: 1000 points/s
Average product query cost: ~50 points
Max products per second: ~20

For 10,000 products at 250 per page:
  - 40 pages × 50 points = 2000 points
  - At 50 points/s refill: ~40 seconds total
  - Add buffer for cost spikes: ~60 seconds
```

---

## 6. Storefront Integration

### Headless Commerce Pattern

```
Your Frontend (Next.js / React)
  │
  ├─ Storefront API → Product catalog, collections, search
  ├─ Cart API → Add to cart, update quantities, remove items
  └─ Checkout API → Create checkout, apply discounts, complete purchase
```

### Storefront Access Token

- **Public token** — safe to expose in client-side code
- Scoped to Storefront API only (no admin access)
- Cannot modify store data (read-only + cart operations)

---

## 7. API Versioning

Shopify releases new API versions quarterly and removes old versions after 1 year:

```
Release schedule:
  January (e.g., 2024-01)
  April (e.g., 2024-04)
  July (e.g., 2024-07)
  October (e.g., 2024-10)

Support timeline:
  Current version: supported
  Previous 3 versions: supported
  Older: removed (API calls return errors)
```

**Strategy:** Pin to a specific version. Upgrade annually during hardening. Test in staging before updating the version header.

---

## 8. Implementation Checklist

- [ ] Shopify app created (custom or public)
- [ ] API scopes configured (minimum required)
- [ ] Access token stored securely
- [ ] Webhook endpoints configured and verified
- [ ] Webhook signature verification implemented
- [ ] Rate limiting implemented (leaky bucket for REST, cost tracking for GraphQL)
- [ ] API version pinned (not using `unstable` or unversioned)
- [ ] Product sync strategy implemented (webhook + daily full sync)
- [ ] Error handling for API failures (retry with backoff)
- [ ] Monthly webhook registration verification job scheduled
- [ ] App uninstall handler implemented (clean up stored data)

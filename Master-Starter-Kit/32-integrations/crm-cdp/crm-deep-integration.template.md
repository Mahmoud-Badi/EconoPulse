# {{PROJECT_NAME}} — CRM Deep Integration

> **Owner:** {{LEAD_DEVELOPER}}
> **CRM Platform:** {{CRM_PLATFORM}}
> **Sync Direction:** Unidirectional / Bidirectional
> **Last Updated:** {{DATE}}

---

## 1. CRM Platform Configuration

### Selected Platform: {{CRM_PLATFORM}}

| Feature | Salesforce | HubSpot | Pipedrive | Zoho CRM |
|---------|-----------|---------|-----------|----------|
| **API Type** | REST + SOQL | REST | REST | REST |
| **Rate Limits** | 100,000 calls/24h (Enterprise) | 100 calls/10s (free), 150/10s (paid) | 100 calls/10s | 5,000 calls/day (free) |
| **Webhooks** | Platform Events / Outbound Messages | Webhook subscriptions | Webhooks | Webhooks |
| **Bulk API** | ✅ (Bulk API 2.0) | ✅ (batch import/export) | ❌ | ✅ |
| **Real-time sync** | ✅ (Streaming API) | ✅ (webhooks) | ✅ (webhooks) | ⚠️ (polling) |
| **Custom objects** | ✅ | ✅ (Enterprise) | ✅ | ✅ |
| **Free tier** | ❌ | ✅ (limited) | ❌ (14-day trial) | ✅ (3 users) |

---

## 2. Data Sync Strategy

### Sync Architecture

```
Your Application ──── Sync Layer ──── CRM Platform
     │                    │                 │
     ├─ Users        →    │    →     Contacts
     ├─ Companies    →    │    →     Companies/Accounts
     ├─ Deals        ←→   │    ←→   Deals/Opportunities
     ├─ Activities   →    │    →     Activities/Tasks
     └─ Custom data  →    │    →     Custom Objects/Properties
```

### Object Mapping

| Your Application | CRM Object | Sync Direction | Conflict Resolution |
|-----------------|------------|----------------|---------------------|
| `users` table | Contacts | App → CRM | App wins (source of truth for user data) |
| `organizations` table | Companies / Accounts | Bidirectional | Last-write-wins with timestamp |
| `deals` table | Deals / Opportunities | CRM → App | CRM wins (sales team manages deals) |
| `support_tickets` table | Activities / Tasks | App → CRM | App wins |
| {{CUSTOM_OBJECT}} | {{CRM_OBJECT}} | {{DIRECTION}} | {{RESOLUTION}} |

### Field Mapping

| Your Field | CRM Field | Transform | Notes |
|-----------|-----------|-----------|-------|
| `user.email` | `contact.email` | None | Primary key for matching |
| `user.full_name` | `contact.firstname` + `contact.lastname` | Split on space | Handle single-name users |
| `user.created_at` | `contact.createdate` | ISO 8601 → Unix ms (HubSpot) | Timezone-aware |
| `user.plan` | `contact.{{CUSTOM_PROPERTY}}` | Enum mapping | Create custom property first |
| `org.mrr` | `company.annual_revenue` | Multiply × 12 | Different units |

---

## 3. Sync Mechanisms

### Real-Time Sync (Event-Driven)

```
App event occurs (user signs up, upgrades plan, etc.)
  → Enqueue sync job to integration queue
  → Worker calls CRM API to create/update record
  → CRM confirms with response
  → Update local sync metadata (last_synced, crm_id)
```

### Batch Sync (Scheduled)

```
Daily at 2am:
  1. Query local records modified since last sync
  2. Batch update CRM records (100-200 per batch)
  3. Query CRM records modified since last sync
  4. Update local records from CRM changes
  5. Log sync summary
```

### Full Reconciliation (Weekly/Monthly)

```
Weekly reconciliation:
  1. Fetch all records from CRM (paginated)
  2. Compare with local database
  3. Identify:
     - Missing in CRM → Create in CRM
     - Missing locally → Flag for review (may be deleted intentionally)
     - Mismatched fields → Apply conflict resolution rules
  4. Generate reconciliation report
```

---

## 4. Conflict Resolution

### Strategies

| Strategy | Description | Use When |
|----------|-------------|----------|
| **Source of truth wins** | One system always wins | Clear ownership per object |
| **Last-write-wins** | Most recent update wins | Both systems update same fields |
| **Field-level rules** | Different winner per field | Complex ownership models |
| **Manual resolution** | Flag conflicts for human review | High-value data (deal amounts) |

### Conflict Detection

```
Detect conflicts by comparing:
  1. Local `updated_at` vs CRM `lastmodifieddate`
  2. If both changed since last sync → conflict
  3. Apply resolution strategy based on object type and field
```

### Conflict Log

| Timestamp | Object | Record ID | Field | Local Value | CRM Value | Resolution | Resolved By |
|-----------|--------|-----------|-------|-------------|-----------|------------|-------------|
| Auto-populated during sync |

---

## 5. Authentication

### Salesforce

```
OAuth 2.0 (JWT Bearer Flow for server-to-server):
  1. Create Connected App in Salesforce
  2. Upload your public key certificate
  3. Grant app pre-authorized permissions
  4. Use JWT assertion to get access token (no user interaction)
  Token refresh: JWT assertion whenever token expires (1-2 hours)
```

### HubSpot

```
OAuth 2.0 (Authorization Code Flow):
  1. Create Private App in HubSpot
  2. Request scopes (crm.objects.contacts.read, crm.objects.contacts.write, etc.)
  3. Install app → receive access token
  Private Apps: Token doesn't expire
  OAuth Apps: Refresh token every 6 hours
```

### Credential Storage

| Credential | Env Variable | Rotation |
|-----------|-------------|----------|
| CRM API Key / Token | `{{CRM_PLATFORM}}_ACCESS_TOKEN` | Per provider policy |
| CRM Client ID | `{{CRM_PLATFORM}}_CLIENT_ID` | When compromised |
| CRM Client Secret | `{{CRM_PLATFORM}}_CLIENT_SECRET` | When compromised |
| Webhook Secret | `{{CRM_PLATFORM}}_WEBHOOK_SECRET` | Annually |

---

## 6. Error Handling

### Common Sync Failures

| Error | Cause | Resolution |
|-------|-------|-----------|
| 400 Bad Request | Invalid field value or missing required field | Validate data before sending, check field mapping |
| 401 Unauthorized | Token expired or revoked | Refresh token, re-authenticate |
| 404 Not Found | CRM record deleted | Remove local CRM ID reference, re-create if needed |
| 409 Conflict | Concurrent update detected | Retry with latest data |
| 429 Rate Limited | Too many API calls | Queue and throttle, respect Retry-After |
| Duplicate detected | CRM dedup rules triggered | Search for existing record, update instead of create |

### Idempotency

Every sync operation must be idempotent:
- Use CRM record IDs (not email) as the primary sync key
- Store CRM record ID locally after first create
- Always update (PUT/PATCH) if CRM ID exists, create (POST) only if it doesn't
- Handle "already exists" errors gracefully (search and update instead)

---

## 7. Custom Properties / Fields

### Properties to Create in CRM

Before syncing, create custom properties in the CRM for fields that don't have standard mappings:

| Property Name | Label | Type | Description | Group |
|--------------|-------|------|-------------|-------|
| `app_user_id` | App User ID | String | Internal application user ID | App Integration |
| `subscription_plan` | Subscription Plan | Enumeration | Current subscription tier | App Integration |
| `signup_date` | Signup Date | Date | When user signed up in your app | App Integration |
| `last_active_date` | Last Active Date | Date | Most recent app activity | App Integration |
| `feature_usage_score` | Feature Usage Score | Number | Engagement/usage score (0-100) | App Integration |

### Creating Properties via API

Create properties during app setup (one-time operation):
```
POST /crm/v3/properties/contacts (HubSpot)
POST /sobjects/Contact/describe (Salesforce — custom field via metadata API)
```

---

## 8. Implementation Checklist

- [ ] CRM app/integration created and authenticated
- [ ] Custom properties created in CRM
- [ ] Field mapping documented and validated
- [ ] Real-time sync implemented (event → queue → API call)
- [ ] Batch sync scheduled (daily reconciliation)
- [ ] Conflict resolution strategy tested
- [ ] Error handling covers all common failure modes
- [ ] Rate limiting implemented (below CRM's limits)
- [ ] Sync metadata tracked (last_synced, crm_id per record)
- [ ] Monitoring dashboard shows sync health (success rate, lag, errors)
- [ ] Alert on sync failures > threshold
- [ ] Full reconciliation job scheduled (weekly)
- [ ] Documentation for sales/support team on what syncs and when

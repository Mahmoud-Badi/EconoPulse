# Capacity Planning

> Infrastructure scaling model for **{{PROJECT_NAME}}**. Maps customer growth to resource requirements so you upgrade proactively — never reactively. Update this model quarterly or after any scaling event.

---

## Scaling Table

| Metric | 10 Customers | 50 Customers | 100 Customers | 500 Customers | Action Trigger |
|--------|-------------|-------------|---------------|---------------|----------------|
| **Database connections** | {{DB_CONN_10}} | {{DB_CONN_50}} | {{DB_CONN_100}} | {{DB_CONN_500}} | > {{DB_CONN_THRESHOLD}}% pool utilization |
| **API requests/sec** | {{RPS_10}} | {{RPS_50}} | {{RPS_100}} | {{RPS_500}} | P95 latency > {{LATENCY_THRESHOLD_MS}}ms |
| **WebSocket connections** | {{WS_10}} | {{WS_50}} | {{WS_100}} | {{WS_500}} | > {{WS_THRESHOLD}} concurrent connections |
| **Storage (GB)** | {{STORAGE_10}} | {{STORAGE_50}} | {{STORAGE_100}} | {{STORAGE_500}} | > {{STORAGE_THRESHOLD}}% disk used |
| **Monthly cost** | ${{COST_10}} | ${{COST_50}} | ${{COST_100}} | ${{COST_500}} | Budget threshold: ${{COST_CEILING}}/mo |
| **Background jobs/hour** | {{JOBS_10}} | {{JOBS_50}} | {{JOBS_100}} | {{JOBS_500}} | Queue depth > {{QUEUE_THRESHOLD}} |
| **Email sends/day** | {{EMAIL_10}} | {{EMAIL_50}} | {{EMAIL_100}} | {{EMAIL_500}} | Provider tier limit approach |
| **CDN bandwidth (GB/mo)** | {{CDN_10}} | {{CDN_50}} | {{CDN_100}} | {{CDN_500}} | > {{CDN_THRESHOLD}}% of tier |

---

## Estimation Assumptions

| Assumption | Value | Source |
|------------|-------|--------|
| Users per customer (average) | {{USERS_PER_CUSTOMER}} | {{ASSUMPTION_SOURCE_1}} |
| Active sessions per user per day | {{SESSIONS_PER_USER}} | {{ASSUMPTION_SOURCE_2}} |
| API calls per session | {{API_CALLS_PER_SESSION}} | {{ASSUMPTION_SOURCE_3}} |
| Average document size | {{AVG_DOCUMENT_SIZE}} | {{ASSUMPTION_SOURCE_4}} |
| Peak-to-average ratio | {{PEAK_RATIO}}x | Industry standard |
| Data growth per customer per month | {{DATA_GROWTH_PER_CUSTOMER}} | Estimated |

---

## Per-Tier Action Items

### Tier 1: 1-10 Customers (MVP)

| Resource | Configuration | Monthly Cost |
|----------|--------------|-------------|
| Hosting | {{HOSTING_PROVIDER}} free/hobby tier | ${{TIER1_HOSTING_COST}} |
| Database | {{DB_PROVIDER}} free tier, single instance | ${{TIER1_DB_COST}} |
| Workers | None — inline processing | $0 |
| Storage | {{STORAGE_PROVIDER}} free tier | $0 |
| **Total** | | **${{TIER1_TOTAL}}** |

**No scaling actions needed.** Focus on product-market fit.

### Tier 2: 10-50 Customers (Growth)

| Resource | Configuration | Monthly Cost |
|----------|--------------|-------------|
| Hosting | {{HOSTING_PROVIDER}} Pro tier | ${{TIER2_HOSTING_COST}} |
| Database | {{DB_PROVIDER}} paid tier, connection pooling enabled | ${{TIER2_DB_COST}} |
| Workers | Add background job processor ({{WORKER_PROVIDER}}) | ${{TIER2_WORKER_COST}} |
| Storage | Upgrade to paid tier | ${{TIER2_STORAGE_COST}} |
| **Total** | | **${{TIER2_TOTAL}}** |

**Scaling actions at this tier:**
- [ ] Enable connection pooling (PgBouncer or provider equivalent)
- [ ] Move heavy computation to background jobs (report generation, email sending)
- [ ] Add a CDN for static assets
- [ ] Set up database backups with {{BACKUP_FREQUENCY}} frequency

### Tier 3: 50-100 Customers (Scale)

| Resource | Configuration | Monthly Cost |
|----------|--------------|-------------|
| Hosting | {{HOSTING_PROVIDER}} Team/Business tier | ${{TIER3_HOSTING_COST}} |
| Database | Add read replica for reporting queries | ${{TIER3_DB_COST}} |
| Workers | Dedicated worker instance | ${{TIER3_WORKER_COST}} |
| Cache | Add Redis for session and query caching | ${{TIER3_CACHE_COST}} |
| Storage | Implement archival policy for data > {{ARCHIVE_AGE_MONTHS}} months | ${{TIER3_STORAGE_COST}} |
| **Total** | | **${{TIER3_TOTAL}}** |

**Scaling actions at this tier:**
- [ ] Add read replica — route reporting and analytics queries to replica
- [ ] Implement Redis caching for frequently accessed data
- [ ] Add rate limiting per tenant
- [ ] Implement data archival for records older than {{ARCHIVE_AGE_MONTHS}} months
- [ ] Set up horizontal auto-scaling for API servers

### Tier 4: 100-500 Customers (Enterprise)

| Resource | Configuration | Monthly Cost |
|----------|--------------|-------------|
| Hosting | Dedicated infrastructure or reserved instances | ${{TIER4_HOSTING_COST}} |
| Database | Primary + read replicas + connection pooling | ${{TIER4_DB_COST}} |
| Workers | Auto-scaling worker pool | ${{TIER4_WORKER_COST}} |
| Cache | Redis cluster | ${{TIER4_CACHE_COST}} |
| Search | Dedicated search engine ({{SEARCH_PROVIDER}}) | ${{TIER4_SEARCH_COST}} |
| Storage | Tiered storage (hot/warm/cold) | ${{TIER4_STORAGE_COST}} |
| **Total** | | **${{TIER4_TOTAL}}** |

**Scaling actions at this tier:**
- [ ] Implement database sharding or partitioning strategy
- [ ] Add dedicated search infrastructure (Elasticsearch, Meilisearch, Typesense)
- [ ] Implement multi-region deployment for latency reduction
- [ ] Add dedicated monitoring and APM tooling
- [ ] Evaluate reserved/committed-use pricing for cost reduction

---

## Cost Projection Curve

```
Monthly Cost ($)
    |
    |                                          ___--- ${{COST_500}}
    |                                    __---
    |                              __---
    |                        __--- ${{COST_100}}
    |                  __---
    |            __--- ${{COST_50}}
    |      __---
    | __--- ${{COST_10}}
    |---
    +------------------------------------------------→ Customers
    0    10       50       100              500
```

**Key inflection points:**
- **10 → 50 customers:** First major cost jump — database and hosting tier upgrades
- **50 → 100 customers:** Read replica and caching infrastructure added
- **100 → 500 customers:** Enterprise infrastructure — search, multi-region, dedicated instances

---

## Monitoring and Alerts

Set alerts for scaling triggers before they become emergencies:

| Metric | Warning Threshold | Critical Threshold | Action |
|--------|-------------------|--------------------|---------|
| DB connection pool | {{DB_WARNING}}% | {{DB_CRITICAL}}% | Increase pool size or add replica |
| API P95 latency | {{LATENCY_WARNING}}ms | {{LATENCY_CRITICAL}}ms | Scale API servers or optimize queries |
| Disk usage | {{DISK_WARNING}}% | {{DISK_CRITICAL}}% | Expand storage or archive old data |
| Memory usage | {{MEM_WARNING}}% | {{MEM_CRITICAL}}% | Scale instance or fix memory leak |
| Monthly cost | ${{COST_WARNING}} | ${{COST_CRITICAL}} | Review cost optimization, negotiate pricing |

---

## Review Cadence

| Frequency | Action |
|-----------|--------|
| Monthly | Check current metrics against projections — are we on track? |
| Quarterly | Update projections based on actual growth rate |
| At each tier transition | Execute the tier action items checklist above |
| After any scaling incident | Retrospective — update thresholds and projections |

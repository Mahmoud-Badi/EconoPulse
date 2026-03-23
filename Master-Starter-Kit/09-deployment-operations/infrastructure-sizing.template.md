# Infrastructure Sizing & Cost Guide

> **Project:** `{{PROJECT_NAME}}`
> **Prepared by:** `{{AUTHOR_NAME}}`
> **Date:** `{{DATE}}`
> **Last reviewed:** `{{LAST_REVIEW_DATE}}`

---

> The cheapest infrastructure is the one that's right-sized. Over-provisioning wastes money, under-provisioning loses customers.

Store completed sizing document in: `dev_docs/infrastructure/infrastructure-sizing.md`

---

## Section 1: Tier Definitions

| Tier | Tenant Count | Typical Users | Characteristics |
|------|-------------|---------------|-----------------|
| Starter | 1–10 | {{STARTER_USERS}} | Validation phase, minimal redundancy acceptable, cost-sensitive |
| Growth | 11–50 | {{GROWTH_USERS}} | Product-market fit confirmed, need reliability, moderate traffic |
| Scale | 51–100 | {{SCALE_USERS}} | Scaling challenges emerge, need horizontal scaling, monitoring critical |
| Enterprise | 101–500 | {{ENTERPRISE_USERS}} | Multi-region, high availability required, SLA commitments, dedicated support |

---

## Section 2: Per-Tier Infrastructure

| Component | Starter | Growth | Scale | Enterprise | Notes |
|-----------|---------|--------|-------|------------|-------|
| **Application Server** | {{STARTER_APP}} | {{GROWTH_APP}} | {{SCALE_APP}} | {{ENTERPRISE_APP}} | |
| Monthly cost | ${{STARTER_APP_COST}} | ${{GROWTH_APP_COST}} | ${{SCALE_APP_COST}} | ${{ENTERPRISE_APP_COST}} | |
| **Database** | {{STARTER_DB}} | {{GROWTH_DB}} | {{SCALE_DB}} | {{ENTERPRISE_DB}} | |
| Monthly cost | ${{STARTER_DB_COST}} | ${{GROWTH_DB_COST}} | ${{SCALE_DB_COST}} | ${{ENTERPRISE_DB_COST}} | |
| **Cache** | {{STARTER_CACHE}} | {{GROWTH_CACHE}} | {{SCALE_CACHE}} | {{ENTERPRISE_CACHE}} | |
| Monthly cost | ${{STARTER_CACHE_COST}} | ${{GROWTH_CACHE_COST}} | ${{SCALE_CACHE_COST}} | ${{ENTERPRISE_CACHE_COST}} | |
| **Job Queue** | {{STARTER_QUEUE}} | {{GROWTH_QUEUE}} | {{SCALE_QUEUE}} | {{ENTERPRISE_QUEUE}} | |
| Monthly cost | ${{STARTER_QUEUE_COST}} | ${{GROWTH_QUEUE_COST}} | ${{SCALE_QUEUE_COST}} | ${{ENTERPRISE_QUEUE_COST}} | |
| **File Storage** | {{STARTER_STORAGE}} | {{GROWTH_STORAGE}} | {{SCALE_STORAGE}} | {{ENTERPRISE_STORAGE}} | |
| Monthly cost | ${{STARTER_STORAGE_COST}} | ${{GROWTH_STORAGE_COST}} | ${{SCALE_STORAGE_COST}} | ${{ENTERPRISE_STORAGE_COST}} | |
| **CDN** | {{STARTER_CDN}} | {{GROWTH_CDN}} | {{SCALE_CDN}} | {{ENTERPRISE_CDN}} | |
| Monthly cost | ${{STARTER_CDN_COST}} | ${{GROWTH_CDN_COST}} | ${{SCALE_CDN_COST}} | ${{ENTERPRISE_CDN_COST}} | |
| **Monitoring** | {{STARTER_MONITORING}} | {{GROWTH_MONITORING}} | {{SCALE_MONITORING}} | {{ENTERPRISE_MONITORING}} | |
| Monthly cost | ${{STARTER_MON_COST}} | ${{GROWTH_MON_COST}} | ${{SCALE_MON_COST}} | ${{ENTERPRISE_MON_COST}} | |
| **Email Service** | {{STARTER_EMAIL}} | {{GROWTH_EMAIL}} | {{SCALE_EMAIL}} | {{ENTERPRISE_EMAIL}} | |
| Monthly cost | ${{STARTER_EMAIL_COST}} | ${{GROWTH_EMAIL_COST}} | ${{SCALE_EMAIL_COST}} | ${{ENTERPRISE_EMAIL_COST}} | |
| **Auth Provider** | {{STARTER_AUTH}} | {{GROWTH_AUTH}} | {{SCALE_AUTH}} | {{ENTERPRISE_AUTH}} | |
| Monthly cost | ${{STARTER_AUTH_COST}} | ${{GROWTH_AUTH_COST}} | ${{SCALE_AUTH_COST}} | ${{ENTERPRISE_AUTH_COST}} | |
| **AI API** | {{STARTER_AI}} | {{GROWTH_AI}} | {{SCALE_AI}} | {{ENTERPRISE_AI}} | |
| Monthly cost | ${{STARTER_AI_COST}} | ${{GROWTH_AI_COST}} | ${{SCALE_AI_COST}} | ${{ENTERPRISE_AI_COST}} | |
| **Total Monthly** | **${{STARTER_TOTAL}}** | **${{GROWTH_TOTAL}}** | **${{SCALE_TOTAL}}** | **${{ENTERPRISE_TOTAL}}** | |

---

## Section 3: Server Recommendations

### Starter Tier (1–10 tenants)

| Component | Provider | Instance/Plan | Specs | Monthly Cost | Rationale |
|-----------|----------|---------------|-------|-------------|-----------|
| App Server | {{PROVIDER}} | {{INSTANCE}} | {{SPECS}} | ${{COST}} | {{RATIONALE}} |
| Database | {{PROVIDER}} | {{INSTANCE}} | {{SPECS}} | ${{COST}} | {{RATIONALE}} |

### Growth Tier (11–50 tenants)

| Component | Provider | Instance/Plan | Specs | Monthly Cost | Rationale |
|-----------|----------|---------------|-------|-------------|-----------|
| App Server | {{PROVIDER}} | {{INSTANCE}} | {{SPECS}} | ${{COST}} | {{RATIONALE}} |
| Database | {{PROVIDER}} | {{INSTANCE}} | {{SPECS}} | ${{COST}} | {{RATIONALE}} |

### Scale Tier (51–100 tenants)

| Component | Provider | Instance/Plan | Specs | Monthly Cost | Rationale |
|-----------|----------|---------------|-------|-------------|-----------|
| App Server | {{PROVIDER}} | {{INSTANCE}} | {{SPECS}} | ${{COST}} | {{RATIONALE}} |
| Database | {{PROVIDER}} | {{INSTANCE}} | {{SPECS}} | ${{COST}} | {{RATIONALE}} |

### Enterprise Tier (101–500 tenants)

| Component | Provider | Instance/Plan | Specs | Monthly Cost | Rationale |
|-----------|----------|---------------|-------|-------------|-----------|
| App Server | {{PROVIDER}} | {{INSTANCE}} | {{SPECS}} | ${{COST}} | {{RATIONALE}} |
| Database | {{PROVIDER}} | {{INSTANCE}} | {{SPECS}} | ${{COST}} | {{RATIONALE}} |

---

## Section 4: Database Sizing

| Parameter | Starter | Growth | Scale | Enterprise |
|-----------|---------|--------|-------|------------|
| Connection pool size | {{STARTER_POOL}} | {{GROWTH_POOL}} | {{SCALE_POOL}} | {{ENTERPRISE_POOL}} |
| Estimated storage (Year 1) | {{STARTER_STORAGE_EST}} | {{GROWTH_STORAGE_EST}} | {{SCALE_STORAGE_EST}} | {{ENTERPRISE_STORAGE_EST}} |
| Estimated storage (Year 3) | {{STARTER_STORAGE_Y3}} | {{GROWTH_STORAGE_Y3}} | {{SCALE_STORAGE_Y3}} | {{ENTERPRISE_STORAGE_Y3}} |
| Read replicas | {{STARTER_REPLICAS}} | {{GROWTH_REPLICAS}} | {{SCALE_REPLICAS}} | {{ENTERPRISE_REPLICAS}} |
| Backup frequency | {{STARTER_BACKUP_FREQ}} | {{GROWTH_BACKUP_FREQ}} | {{SCALE_BACKUP_FREQ}} | {{ENTERPRISE_BACKUP_FREQ}} |
| Backup retention | {{STARTER_BACKUP_RET}} | {{GROWTH_BACKUP_RET}} | {{SCALE_BACKUP_RET}} | {{ENTERPRISE_BACKUP_RET}} |
| Point-in-time recovery | {{STARTER_PITR}} | {{GROWTH_PITR}} | {{SCALE_PITR}} | {{ENTERPRISE_PITR}} |

**Sizing formula:**
```
Storage per tenant = (avg rows/tenant × avg row size) + (blob storage/tenant)
Total storage = tenants × storage per tenant × growth factor (1.5x for Year 1, 3x for Year 3)
Connection pool = (concurrent users per tenant × tenants) / connection reuse ratio
```

---

## Section 5: Cost Per Tenant

| Metric | Starter (10 tenants) | Growth (50 tenants) | Scale (100 tenants) | Enterprise (500 tenants) |
|--------|---------------------|--------------------|--------------------|------------------------|
| Total monthly infrastructure | ${{STARTER_TOTAL}} | ${{GROWTH_TOTAL}} | ${{SCALE_TOTAL}} | ${{ENTERPRISE_TOTAL}} |
| Cost per tenant | ${{STARTER_CPT}} | ${{GROWTH_CPT}} | ${{SCALE_CPT}} | ${{ENTERPRISE_CPT}} |
| Cost trend | Baseline | {{GROWTH_TREND}} | {{SCALE_TREND}} | {{ENTERPRISE_TREND}} |

**Cost per tenant should DECREASE as tier increases** (economies of scale). If it increases, the architecture has a scaling problem.

---

## Section 6: Break-Even Analysis

| Item | Value |
|------|-------|
| Fixed monthly costs (infrastructure, SaaS tools, domains) | ${{FIXED_COSTS}} |
| Variable cost per user per month | ${{VARIABLE_COST_PER_USER}} |
| Average revenue per user per month (ARPU) | ${{ARPU}} |
| Contribution margin per user | ${{CONTRIBUTION_MARGIN}} |
| Break-even user count | ${{FIXED_COSTS}} ÷ ${{CONTRIBUTION_MARGIN}} = **{{BREAK_EVEN_USERS}}** |
| Break-even tenant count (at avg users/tenant) | **{{BREAK_EVEN_TENANTS}}** |

**Break-even formula:**
```
Contribution margin = ARPU - Variable cost per user
Break-even users = Fixed costs / Contribution margin
Break-even tenants = Break-even users / Avg users per tenant
```

**Sanity checks:**
- [ ] Break-even is achievable within {{MONTHS_TO_BREAK_EVEN}} months given growth trajectory
- [ ] ARPU covers variable costs with positive margin
- [ ] Fixed costs do not require Enterprise tier to justify

---

## Section 7: Scaling Triggers

Define when to scale — not based on gut feeling, but on measurable thresholds.

| # | Metric | Threshold | Action | Estimated Cost Impact |
|---|--------|-----------|--------|----------------------|
| 1 | API response latency | P95 > 200ms for 15 min | Add application server instance | +${{COST_IMPACT}} |
| 2 | Database CPU | > 80% for 10 min | Upgrade database instance | +${{COST_IMPACT}} |
| 3 | Database connections | > 80% of pool max | Increase pool size or add read replica | +${{COST_IMPACT}} |
| 4 | Memory usage | > 85% for 10 min | Upgrade instance or add horizontal scaling | +${{COST_IMPACT}} |
| 5 | Disk usage | > 75% | Expand storage | +${{COST_IMPACT}} |
| 6 | Queue depth | > {{QUEUE_THRESHOLD}} pending jobs for 5 min | Add worker instance | +${{COST_IMPACT}} |
| 7 | Error rate | > 1% of requests for 5 min | Investigate root cause, scale if load-related | Variable |
| 8 | CDN bandwidth | > 80% of plan limit | Upgrade CDN plan | +${{COST_IMPACT}} |

**Rule:** Scaling triggers should fire BEFORE users notice degradation. If users report slowness before your alerts fire, your thresholds are too lenient.

---

## Section 8: Cost Monitoring

### Alerts to Configure

| Alert | Trigger | Notification Channel |
|-------|---------|---------------------|
| Monthly spend exceeds budget | Spend > ${{BUDGET_THRESHOLD}} | {{NOTIFICATION_CHANNEL}} |
| Single service cost spike | Any service > 150% of last month | {{NOTIFICATION_CHANNEL}} |
| Unused resources detected | Instance CPU < 10% for 7 days | {{NOTIFICATION_CHANNEL}} |
| Storage growth exceeds forecast | Storage > 120% of projected | {{NOTIFICATION_CHANNEL}} |

### Dashboards to Create

| Dashboard | Contents | Review Frequency |
|-----------|----------|-----------------|
| Infrastructure Overview | Total spend, per-service breakdown, trend line | Weekly |
| Cost Per Tenant | Tenant count, total cost, cost/tenant trend | Monthly |
| Resource Utilization | CPU, memory, disk, connections per service | Daily (automated) |
| Scaling Events | When scaling was triggered, cost impact, was it justified | Monthly |

### Monthly Review Checklist

- [ ] Review total spend vs. budget
- [ ] Identify any underutilized resources (candidates for downsizing)
- [ ] Review cost per tenant trend — is it decreasing with scale?
- [ ] Verify scaling triggers fired correctly (no false positives/negatives)
- [ ] Compare actual costs to this document's projections — update if >20% deviation
- [ ] Check for new pricing tiers or competitors that could reduce costs
- [ ] Validate break-even projection against actual growth

---

## Gate 10 Verification

This document satisfies Gate 10 (Infrastructure Cost & Sizing) when:

- [ ] All 10 components have cost projections at all 4 tiers
- [ ] Server recommendations include specific providers and instance types
- [ ] Database sizing includes connection pools, storage, replicas, and backups
- [ ] Cost per tenant calculated and shows decreasing trend
- [ ] Break-even analysis completed with achievable timeline
- [ ] Scaling triggers defined with measurable thresholds
- [ ] Cost monitoring alerts and dashboards specified
- [ ] Monthly review checklist established

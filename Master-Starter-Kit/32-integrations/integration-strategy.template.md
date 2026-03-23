# {{PROJECT_NAME}} — Integration Strategy

> **Owner:** {{LEAD_DEVELOPER}}
> **Maturity Level:** {{INTEGRATION_MATURITY_LEVEL}}
> **Integration Count:** {{INTEGRATION_COUNT}}
> **Last Updated:** {{DATE}}

---

## 1. Integration Inventory

> Extend your Section 00 `integrations-map` with strategic fields. Every third-party service your application depends on must appear here.

| # | Service | Category | Direction | Criticality | Fallback Strategy | SLA Requirement | Monthly Cost | Sandbox Available |
|---|---------|----------|-----------|-------------|-------------------|-----------------|--------------|-------------------|
| 1 | {{INTEGRATION_1_NAME}} | {{INTEGRATION_1_CATEGORY}} | Inbound / Outbound / Bidirectional | P0-Critical / P1-High / P2-Medium / P3-Low | {{INTEGRATION_1_FALLBACK}} | {{INTEGRATION_1_SLA}} | {{INTEGRATION_1_COST}} | Yes / No |
| 2 | {{INTEGRATION_2_NAME}} | {{INTEGRATION_2_CATEGORY}} | | | | | | |
| 3 | | | | | | | | |

**Categories:** Auth, Payments, Email, Storage, Analytics, Search, Monitoring, CRM, Communication, E-commerce, AI/ML, CDN, CI/CD, Other

**Criticality Definitions:**
- **P0-Critical:** Application cannot function without this service. Outage = full or partial downtime. Requires fallback provider.
- **P1-High:** Core feature depends on this service. Outage = degraded experience for significant user segment. Should have graceful degradation.
- **P2-Medium:** Non-core feature depends on this service. Outage = feature unavailable, user can work around it. Queue and retry is sufficient.
- **P3-Low:** Nice-to-have integration. Outage = invisible to most users. Fail silently with logging.

---

## 2. Integration Dependency Graph

> Map which integrations depend on each other. This prevents cascading failures and informs implementation order.

```mermaid
graph TD
    A[{{PROJECT_NAME}}] --> B[Auth Provider]
    A --> C[Payment Provider]
    A --> D[Email Provider]
    A --> E[Storage Provider]
    C --> D
    B --> A

    classDef critical fill:#ff6b6b,stroke:#333
    classDef high fill:#ffa94d,stroke:#333
    classDef medium fill:#ffd43b,stroke:#333
    classDef low fill:#69db7c,stroke:#333

    class B,C critical
    class D,E high
```

**Dependency chains to watch:**
- {{DEPENDENCY_CHAIN_1}}: Failure in upstream integration cascades to downstream
- {{DEPENDENCY_CHAIN_2}}: Circular dependency requires careful initialization order

---

## 3. Implementation Timeline

> Order integrations by dependency and criticality. Build foundations first, enhancements last.

### Phase 1: Foundation (Sprint 1–2)
| Integration | Reason | Blocks |
|-------------|--------|--------|
| {{FOUNDATION_INTEGRATION_1}} | {{REASON}} | {{BLOCKS}} |
| {{FOUNDATION_INTEGRATION_2}} | {{REASON}} | {{BLOCKS}} |

### Phase 2: Core Features (Sprint 3–4)
| Integration | Reason | Blocks |
|-------------|--------|--------|
| {{CORE_INTEGRATION_1}} | {{REASON}} | {{BLOCKS}} |

### Phase 3: Enhancement (Sprint 5+)
| Integration | Reason | Blocks |
|-------------|--------|--------|
| {{ENHANCEMENT_INTEGRATION_1}} | {{REASON}} | {{BLOCKS}} |

### Post-Launch
| Integration | Reason | Target |
|-------------|--------|--------|
| {{POSTLAUNCH_INTEGRATION_1}} | {{REASON}} | {{TARGET_DATE}} |

---

## 4. Data Flow Architecture

> Document how data moves between your system and each external service. Identify what data is sent, received, and stored.

### Inbound Data Flows (External → Your System)

| Source | Data Type | Mechanism | Frequency | Storage | Retention |
|--------|-----------|-----------|-----------|---------|-----------|
| {{SOURCE_1}} | {{DATA_TYPE}} | Webhook / Polling / SSE | Real-time / Batch / On-demand | {{STORAGE}} | {{RETENTION}} |

### Outbound Data Flows (Your System → External)

| Destination | Data Type | Mechanism | Frequency | Contains PII | Encryption |
|-------------|-----------|-----------|-----------|-------------|------------|
| {{DEST_1}} | {{DATA_TYPE}} | API Call / Webhook / File Upload | {{FREQUENCY}} | Yes / No | In-transit / At-rest / Both |

### Data Residency Considerations

- **PII-handling integrations:** {{PII_INTEGRATIONS}}
- **Data residency requirements:** {{DATA_RESIDENCY}}
- **Cross-border transfer mechanisms:** {{TRANSFER_MECHANISM}}

---

## 5. Credential Management Strategy

### Secrets Manager

| Environment | Secrets Solution | Access Pattern |
|-------------|-----------------|----------------|
| Local Development | `.env.local` (gitignored) | `process.env.VARIABLE` |
| CI/CD | {{CI_SECRETS_SOLUTION}} | Environment injection |
| Staging | {{STAGING_SECRETS_SOLUTION}} | {{ACCESS_PATTERN}} |
| Production | {{SECRETS_MANAGER}} | {{ACCESS_PATTERN}} |

### API Key Inventory

| Service | Key Type | Rotation Schedule | Last Rotated | Environments |
|---------|----------|-------------------|-------------|--------------|
| {{SERVICE_1}} | API Key / OAuth Token / Service Account | {{ROTATION_SCHEDULE}} | {{LAST_ROTATED}} | Dev, Staging, Prod |

### Rotation Protocol

1. Generate new key in provider dashboard
2. Update secret in {{SECRETS_MANAGER}}
3. Deploy to staging → verify integration health check passes
4. Deploy to production → monitor for 15 minutes
5. Revoke old key in provider dashboard
6. Update `Last Rotated` in this document

### Emergency Rotation

If a key is compromised:
1. **Immediately** revoke the compromised key in the provider dashboard
2. Generate a new key
3. Update {{SECRETS_MANAGER}} for all affected environments
4. Deploy affected services (hotfix, skip staging if P0)
5. Audit logs for unauthorized usage during exposure window
6. File incident report per Section 21

---

## 6. Integration Cost Budget

### Monthly Cost Projection

| Service | Free Tier Limit | Current Usage | Projected Usage (6mo) | Monthly Cost | Annual Cost |
|---------|----------------|---------------|----------------------|-------------|-------------|
| {{SERVICE_1}} | {{FREE_LIMIT}} | {{CURRENT}} | {{PROJECTED}} | {{MONTHLY}} | {{ANNUAL}} |

**Total Monthly Integration Budget:** {{INTEGRATION_BUDGET_MONTHLY}}
**Annual Integration Budget:** {{INTEGRATION_BUDGET_ANNUAL}}

### Cost Optimization Strategies

- [ ] Use free tiers during development and staging
- [ ] Batch API calls where possible (reduce per-request charges)
- [ ] Implement caching to reduce redundant API calls
- [ ] Set up billing alerts at 50%, 80%, 100% of budget
- [ ] Review usage quarterly — remove unused integrations
- [ ] Negotiate enterprise pricing when usage exceeds $500/month per service

### Cost Alert Configuration

| Threshold | Action | Notification Channel |
|-----------|--------|---------------------|
| 50% of monthly budget | Log warning | {{HEALTH_ALERT_CHANNEL}} |
| 80% of monthly budget | Alert team | {{HEALTH_ALERT_CHANNEL}} + email |
| 100% of monthly budget | Page on-call | PagerDuty / OpsGenie |
| 150% of monthly budget | Investigate + throttle non-critical integrations | Incident channel |

---

## 7. Environment Strategy

### Per-Environment Configuration

| Integration | Development | Staging | Production |
|-------------|------------|---------|------------|
| {{SERVICE_1}} | Sandbox/Mock | Sandbox | Live |
| {{SERVICE_2}} | Mock (MSW) | Sandbox | Live |

### Mock Strategy for Development

| Integration | Mock Approach | Mock Data Source |
|-------------|---------------|-----------------|
| {{SERVICE_1}} | {{MOCK_APPROACH}} | {{MOCK_SOURCE}} |

**Mock approaches:** MSW (API mocking), Local emulator, Sandbox environment, Recorded fixtures, In-memory stub

---

## 8. Integration Architecture Decisions

> Document key architectural decisions for your integration layer.

### Decision 1: Webhook Processing Architecture

- **Options considered:** Synchronous processing / Queue-based async / Hybrid
- **Decision:** {{WEBHOOK_ARCHITECTURE_DECISION}}
- **Rationale:** {{WEBHOOK_ARCHITECTURE_RATIONALE}}

### Decision 2: Circuit Breaker Strategy

- **Options considered:** Per-integration / Shared / None
- **Decision:** {{CIRCUIT_BREAKER_DECISION}}
- **Rationale:** {{CIRCUIT_BREAKER_RATIONALE}}

### Decision 3: Multi-Provider Fallback

- **Options considered:** Active-passive / Active-active / No fallback
- **Decision:** {{FALLBACK_DECISION}}
- **Rationale:** {{FALLBACK_RATIONALE}}
- **Integrations with fallback:** {{FALLBACK_INTEGRATIONS}}

### Decision 4: Integration Testing Approach

- **Options considered:** Contract testing / Recorded fixtures / Live sandbox / Hybrid
- **Decision:** {{TESTING_DECISION}}
- **Rationale:** {{TESTING_RATIONALE}}

---

## 9. Risk Register

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|-----------|--------|------------|-------|
| Provider outage during launch | Medium | High | Multi-provider fallback for P0 integrations | {{OWNER}} |
| API deprecation without migration time | Low | High | Sunset header monitoring + changelog subscriptions | {{OWNER}} |
| Credential leak in repository | Low | Critical | Pre-commit hooks + secret scanning + rotation protocol | {{OWNER}} |
| Rate limit exceeded during traffic spike | Medium | Medium | Client-side rate limiting + queue-based throttling | {{OWNER}} |
| Webhook events lost during deployment | Medium | High | Queue-based processing + dead letter queue + replay | {{OWNER}} |
| Integration cost overrun | Medium | Low | Billing alerts + caching + batch optimization | {{OWNER}} |
| Data format change in external API | Medium | Medium | Contract testing + version pinning + integration health checks | {{OWNER}} |

---

## 10. Implementation Checklist

### Before First Integration

- [ ] Set up {{SECRETS_MANAGER}} for all environments
- [ ] Configure pre-commit hooks for secret scanning (`gitleaks`, `trufflehog`)
- [ ] Create integration health check endpoint (`/api/health/integrations`)
- [ ] Set up integration monitoring dashboard
- [ ] Define standard integration client wrapper pattern (with circuit breaker, retry, logging)
- [ ] Configure billing alerts for all paid integrations
- [ ] Set up webhook infrastructure (if applicable)

### Per-Integration Checklist

- [ ] Add to integration inventory (Section 1 above)
- [ ] Document data flows (Section 4 above)
- [ ] Create per-service integration plan (Section 02 template)
- [ ] Add API keys to {{SECRETS_MANAGER}}
- [ ] Implement health check for this integration
- [ ] Write contract tests or recorded fixture tests
- [ ] Configure mock/sandbox for development environment
- [ ] Add monitoring alerts for this integration
- [ ] Document failure mode and degradation behavior
- [ ] Add to cost budget (Section 6 above)

### Before Launch

- [ ] All P0/P1 integrations have health checks responding ✅
- [ ] Circuit breakers configured for P0 integrations
- [ ] Fallback providers configured for P0 integrations (if applicable)
- [ ] All webhook endpoints verified with provider test events
- [ ] Dead letter queue configured and monitored
- [ ] Credential rotation tested end-to-end
- [ ] Integration cost projections reviewed and budget set
- [ ] All integration tests passing in CI
- [ ] Runbook created for each P0 integration outage (Section 21)

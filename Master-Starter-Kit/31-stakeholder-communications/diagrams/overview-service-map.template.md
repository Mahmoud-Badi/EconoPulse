# Overview Service Map — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all `{{PLACEHOLDER}}` values with project-specific data before rendering.

```mermaid
mindmap
  root(({{PROJECT_NAME}}))
    {{SERVICE_1_NAME}}
      Priority: {{SERVICE_1_PRIORITY}}
      Endpoints: {{SERVICE_1_ENDPOINT_COUNT}}
      Tables: {{SERVICE_1_TABLE_COUNT}}
      Dependencies
        {{SERVICE_1_DEP_1}}
        {{SERVICE_1_DEP_2}}
      Key Features
        {{SERVICE_1_FEATURE_1}}
        {{SERVICE_1_FEATURE_2}}
        {{SERVICE_1_FEATURE_3}}
    {{SERVICE_2_NAME}}
      Priority: {{SERVICE_2_PRIORITY}}
      Endpoints: {{SERVICE_2_ENDPOINT_COUNT}}
      Tables: {{SERVICE_2_TABLE_COUNT}}
      Dependencies
        {{SERVICE_2_DEP_1}}
        {{SERVICE_2_DEP_2}}
      Key Features
        {{SERVICE_2_FEATURE_1}}
        {{SERVICE_2_FEATURE_2}}
        {{SERVICE_2_FEATURE_3}}
    {{SERVICE_3_NAME}}
      Priority: {{SERVICE_3_PRIORITY}}
      Endpoints: {{SERVICE_3_ENDPOINT_COUNT}}
      Tables: {{SERVICE_3_TABLE_COUNT}}
      Dependencies
        {{SERVICE_3_DEP_1}}
        {{SERVICE_3_DEP_2}}
      Key Features
        {{SERVICE_3_FEATURE_1}}
        {{SERVICE_3_FEATURE_2}}
        {{SERVICE_3_FEATURE_3}}
    {{SERVICE_4_NAME}}
      Priority: {{SERVICE_4_PRIORITY}}
      Endpoints: {{SERVICE_4_ENDPOINT_COUNT}}
      Tables: {{SERVICE_4_TABLE_COUNT}}
      Dependencies
        {{SERVICE_4_DEP_1}}
        {{SERVICE_4_DEP_2}}
      Key Features
        {{SERVICE_4_FEATURE_1}}
        {{SERVICE_4_FEATURE_2}}
        {{SERVICE_4_FEATURE_3}}
    {{SERVICE_5_NAME}}
      Priority: {{SERVICE_5_PRIORITY}}
      Endpoints: {{SERVICE_5_ENDPOINT_COUNT}}
      Tables: {{SERVICE_5_TABLE_COUNT}}
      Dependencies
        {{SERVICE_5_DEP_1}}
        {{SERVICE_5_DEP_2}}
      Key Features
        {{SERVICE_5_FEATURE_1}}
        {{SERVICE_5_FEATURE_2}}
        {{SERVICE_5_FEATURE_3}}
    Platform & Infrastructure
      Authentication
        {{AUTH_PROVIDER}}
        SSO / OAuth
        Role-based access control
        Session management
      Shared Database
        {{PRIMARY_DATABASE}}
        Migrations
        Seed data
      Caching
        {{CACHE_ENGINE}}
        Cache invalidation strategy
      Monitoring & Observability
        {{MONITORING_PROVIDER}}
        Error tracking
        Health checks
        Structured logging
      CI/CD
        Build pipeline
        Automated testing
        Staging & production deploys
      Cross-Cutting Concerns
        Rate limiting
        Input validation
        Audit logging
        Multi-tenancy
```

---

## Service Summary Table

| # | Service | Priority | Endpoints | Tables | Key Dependencies |
|---|---------|----------|-----------|--------|-----------------|
| 1 | {{SERVICE_1_NAME}} | {{SERVICE_1_PRIORITY}} | {{SERVICE_1_ENDPOINT_COUNT}} | {{SERVICE_1_TABLE_COUNT}} | {{SERVICE_1_DEP_1}}, {{SERVICE_1_DEP_2}} |
| 2 | {{SERVICE_2_NAME}} | {{SERVICE_2_PRIORITY}} | {{SERVICE_2_ENDPOINT_COUNT}} | {{SERVICE_2_TABLE_COUNT}} | {{SERVICE_2_DEP_1}}, {{SERVICE_2_DEP_2}} |
| 3 | {{SERVICE_3_NAME}} | {{SERVICE_3_PRIORITY}} | {{SERVICE_3_ENDPOINT_COUNT}} | {{SERVICE_3_TABLE_COUNT}} | {{SERVICE_3_DEP_1}}, {{SERVICE_3_DEP_2}} |
| 4 | {{SERVICE_4_NAME}} | {{SERVICE_4_PRIORITY}} | {{SERVICE_4_ENDPOINT_COUNT}} | {{SERVICE_4_TABLE_COUNT}} | {{SERVICE_4_DEP_1}}, {{SERVICE_4_DEP_2}} |
| 5 | {{SERVICE_5_NAME}} | {{SERVICE_5_PRIORITY}} | {{SERVICE_5_ENDPOINT_COUNT}} | {{SERVICE_5_TABLE_COUNT}} | {{SERVICE_5_DEP_1}}, {{SERVICE_5_DEP_2}} |

> **Priority values:** MVP = must-ship for launch, Enhanced = Phase 2 improvement, Future = Phase 3+ roadmap item.

### How to Use This Map

1. Replace all `{{PLACEHOLDER}}` values with your project's actual service names, counts, and dependencies.
2. Add or remove service branches as needed -- most projects have 5-12 services.
3. For services with more than 3 dependencies, add additional `{{SERVICE_N_DEP_N}}` lines.
4. The "Platform & Infrastructure" branch is shared across all services -- update it to match your actual stack.

---

## Cross-References

- **Dependency graph (build order):** `dependency-graph.template.md`
- **Architecture layers:** `system-architecture-flowchart.template.md`
- **Feature breakdown per service:** `svc-feature-map.template.md`
- **Phased roadmap:** `overview-phased-roadmap.template.md`
- **Full project mind map:** `feature-mind-map.template.md`

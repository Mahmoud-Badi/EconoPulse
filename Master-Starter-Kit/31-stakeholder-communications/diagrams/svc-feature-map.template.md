# Service Feature Map — {{SERVICE_NAME}} — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all `{{PLACEHOLDER}}` values with project-specific data before rendering.

**Reading Guide:** This mindmap uses a 4-level hierarchy convention. **Level 1** (branches off root) = major feature areas within the service. **Level 2** = specific features under each area. **Level 3** = sub-features, business rules, API endpoints, or data entities that implement the feature. **Level 4** (where present) = validation rules, edge cases, or configuration details. Read top-to-bottom within each branch to understand scope; read left-to-right across branches to see the full service surface area.

```mermaid
mindmap
  root(({{SERVICE_NAME}}))
    {{FEATURE_AREA_1}}
      {{FEATURE_1_1}}
        {{FEATURE_1_1_SUB_1}}
        {{FEATURE_1_1_SUB_2}}
        {{FEATURE_1_1_SUB_3}}
        Endpoint: {{FEATURE_1_1_ENDPOINT}}
      {{FEATURE_1_2}}
        {{FEATURE_1_2_SUB_1}}
        {{FEATURE_1_2_SUB_2}}
        Endpoint: {{FEATURE_1_2_ENDPOINT}}
      {{FEATURE_1_3}}
        {{FEATURE_1_3_SUB_1}}
        {{FEATURE_1_3_SUB_2}}
    {{FEATURE_AREA_2}}
      {{FEATURE_2_1}}
        {{FEATURE_2_1_SUB_1}}
        {{FEATURE_2_1_SUB_2}}
        Endpoint: {{FEATURE_2_1_ENDPOINT}}
        Validation: {{FEATURE_2_1_VALIDATION}}
      {{FEATURE_2_2}}
        {{FEATURE_2_2_SUB_1}}
        {{FEATURE_2_2_SUB_2}}
        {{FEATURE_2_2_SUB_3}}
        Endpoint: {{FEATURE_2_2_ENDPOINT}}
      {{FEATURE_2_3}}
        {{FEATURE_2_3_SUB_1}}
        {{FEATURE_2_3_SUB_2}}
    {{FEATURE_AREA_3}}
      {{FEATURE_3_1}}
        {{FEATURE_3_1_SUB_1}}
        {{FEATURE_3_1_SUB_2}}
        Endpoint: {{FEATURE_3_1_ENDPOINT}}
      {{FEATURE_3_2}}
        {{FEATURE_3_2_SUB_1}}
        Endpoint: {{FEATURE_3_2_ENDPOINT}}
      {{FEATURE_3_3}}
        {{FEATURE_3_3_SUB_1}}
        {{FEATURE_3_3_SUB_2}}
    {{FEATURE_AREA_4}}
      {{FEATURE_4_1}}
        {{FEATURE_4_1_SUB_1}}
        {{FEATURE_4_1_SUB_2}}
        Endpoint: {{FEATURE_4_1_ENDPOINT}}
      {{FEATURE_4_2}}
        {{FEATURE_4_2_SUB_1}}
        {{FEATURE_4_2_SUB_2}}
    {{FEATURE_AREA_5}}
      {{FEATURE_5_1}}
        {{FEATURE_5_1_SUB_1}}
        {{FEATURE_5_1_SUB_2}}
      {{FEATURE_5_2}}
        {{FEATURE_5_2_SUB_1}}
    Data Model
      {{TABLE_1}}
        {{TABLE_1_KEY_COL_1}}
        {{TABLE_1_KEY_COL_2}}
        FK: {{TABLE_1_RELATION}}
      {{TABLE_2}}
        {{TABLE_2_KEY_COL_1}}
        {{TABLE_2_KEY_COL_2}}
      {{TABLE_3}}
        {{TABLE_3_KEY_COL_1}}
        {{TABLE_3_KEY_COL_2}}
    Future / Phase D+
      {{FUTURE_FEATURE_1}}
        {{FUTURE_FEATURE_1_DETAIL}}
      {{FUTURE_FEATURE_2}}
        {{FUTURE_FEATURE_2_DETAIL}}
      {{FUTURE_FEATURE_3}}
        {{FUTURE_FEATURE_3_DETAIL}}
```

---

## Feature Summary Table

| Feature Area | Features | Endpoints | Auth Required |
|-------------|----------|-----------|---------------|
| {{FEATURE_AREA_1}} | {{FEATURE_1_1}}, {{FEATURE_1_2}}, {{FEATURE_1_3}} | {{FEATURE_AREA_1_ENDPOINT_COUNT}} | {{FEATURE_AREA_1_AUTH}} |
| {{FEATURE_AREA_2}} | {{FEATURE_2_1}}, {{FEATURE_2_2}}, {{FEATURE_2_3}} | {{FEATURE_AREA_2_ENDPOINT_COUNT}} | {{FEATURE_AREA_2_AUTH}} |
| {{FEATURE_AREA_3}} | {{FEATURE_3_1}}, {{FEATURE_3_2}}, {{FEATURE_3_3}} | {{FEATURE_AREA_3_ENDPOINT_COUNT}} | {{FEATURE_AREA_3_AUTH}} |
| {{FEATURE_AREA_4}} | {{FEATURE_4_1}}, {{FEATURE_4_2}} | {{FEATURE_AREA_4_ENDPOINT_COUNT}} | {{FEATURE_AREA_4_AUTH}} |
| {{FEATURE_AREA_5}} | {{FEATURE_5_1}}, {{FEATURE_5_2}} | {{FEATURE_AREA_5_ENDPOINT_COUNT}} | {{FEATURE_AREA_5_AUTH}} |
| Data Model | {{TABLE_1}}, {{TABLE_2}}, {{TABLE_3}} | -- | -- |
| Future / Phase D+ | {{FUTURE_FEATURE_1}}, {{FUTURE_FEATURE_2}}, {{FUTURE_FEATURE_3}} | TBD | TBD |

---

## Service Metadata

| Property | Value |
|----------|-------|
| Service ID | {{SERVICE_ID}} |
| Priority | {{SERVICE_PRIORITY}} |
| Total endpoints | {{SERVICE_TOTAL_ENDPOINTS}} |
| Total tables | {{SERVICE_TOTAL_TABLES}} |
| Depends on | {{SERVICE_DEPENDENCIES}} |
| Depended on by | {{SERVICE_DEPENDENTS}} |
| Phase introduced | {{SERVICE_PHASE}} |

---

## File Naming Convention

Generate one file per service using this naming pattern:

```
svc-{NN}-{service-name}-features.md
```

**Examples:**
- `svc-01-auth-features.md`
- `svc-02-billing-features.md`
- `svc-03-notifications-features.md`
- `svc-04-reporting-features.md`
- `svc-05-user-management-features.md`

Replace `{NN}` with the zero-padded service number from the service matrix. Replace `{service-name}` with the kebab-case service name.

---

## Instructions

1. Copy this template once per service in your project.
2. Replace all `{{PLACEHOLDER}}` values with service-specific data from the service spec and hub file.
3. Adjust the number of feature areas (3-6 is typical), features per area, and sub-features per feature.
4. The "Data Model" branch should list only the key tables owned by this service -- not shared/platform tables.
5. The "Future / Phase D+" branch captures planned features that are not yet scheduled. Remove this branch if no future features are identified.
6. Update the Feature Summary Table to match the mindmap content.
7. If a service has more than 80 nodes, split it into two mindmaps: one for features and one for data model + endpoints.

---

## Cross-References

- **System-wide service map:** `overview-service-map.template.md`
- **Workflow diagrams (cross-service):** `wf-workflow.template.md`
- **State machines (domain groups):** `sm-state-machine.template.md`
- **MASTER mind map (all services):** `MASTER-mind-map-generator.md`
- **Dependency graph:** `dependency-graph.template.md`
- **Architecture flowchart:** `system-architecture-flowchart.template.md`

# Multi-Tenant Isolation Architecture — {{PROJECT_NAME}}

<!-- CONDITIONAL: Generate only if {{IS_MULTI_TENANT}} == "true" -->

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all {{PLACEHOLDER}} values with project-specific data before rendering.

```mermaid
flowchart TB
    subgraph RequestLayer["Request Layer — Tenant Detection"]
        REQ_IN["Incoming Request"]
        SD["Subdomain Detection<br/>{{TENANT_DETECTION_SUBDOMAIN}}"]
        HD["Header Detection<br/>X-Tenant-ID"]
        JWT["JWT Claim Extraction<br/>tenant_id from {{AUTH_PROVIDER}}"]
        TR["Tenant Resolver"]

        REQ_IN --> SD
        REQ_IN --> HD
        REQ_IN --> JWT
        SD --> TR
        HD --> TR
        JWT --> TR
        TR -->|"Resolved: tenant_id"| CTX["Tenant Context Set"]
    end

    subgraph DataLayer["Data Layer — Tenant Isolation"]
        direction TB
        RLS["Row-Level Security<br/>Policies on {{PRIMARY_DATABASE}}"]
        TCF["Tenant Column Filtering<br/>WHERE tenant_id = ?"]
        SS["Schema Separation<br/>{{SCHEMA_STRATEGY}}"]

        CTX --> RLS
        CTX --> TCF
        CTX --> SS

        RLS --> DB_READ["Database Read"]
        TCF --> DB_READ
        SS --> DB_READ
        RLS --> DB_WRITE["Database Write"]
        TCF --> DB_WRITE
        SS --> DB_WRITE
    end

    subgraph CacheLayer["Cache Layer — Tenant-Prefixed Keys"]
        CACHE_KEY["Key Format:<br/>tenant:{{TENANT_ID}}:resource:id"]
        CACHE_READ["Cache Read<br/>{{CACHE_ENGINE}}"]
        CACHE_WRITE["Cache Write<br/>TTL: {{CACHE_TTL}}"]
        CACHE_INVALIDATE["Cache Invalidation<br/>Per-tenant flush"]

        CTX --> CACHE_KEY
        CACHE_KEY --> CACHE_READ
        CACHE_KEY --> CACHE_WRITE
        CACHE_KEY --> CACHE_INVALIDATE
    end

    subgraph StorageLayer["Storage Layer — Tenant-Scoped"]
        BUCKET["Bucket / Container<br/>{{STORAGE_PROVIDER}}"]
        PATH_STRATEGY["Path: /{{TENANT_ID}}/uploads/..."]
        ACCESS_POLICY["Scoped Access Policy<br/>Signed URLs per tenant"]

        CTX --> BUCKET
        BUCKET --> PATH_STRATEGY
        BUCKET --> ACCESS_POLICY
    end

    %% Data classification color coding
    style REQ_IN fill:#4CAF50,color:#fff
    style DB_READ fill:#4CAF50,color:#fff
    style DB_WRITE fill:#4CAF50,color:#fff
    style CACHE_READ fill:#2196F3,color:#fff
    style CACHE_WRITE fill:#2196F3,color:#fff
    style BUCKET fill:#9E9E9E,color:#fff

    classDef tenantScoped fill:#4CAF50,color:#fff
    classDef referenceData fill:#2196F3,color:#fff
    classDef globalData fill:#9E9E9E,color:#fff
```

<!-- IF {{COMPLIANCE_REQUIREMENTS}} != "none" -->

```mermaid
flowchart TB
    subgraph ComplianceOverlay["Compliance Overlay — {{COMPLIANCE_REQUIREMENTS}}"]
        AUDIT["Audit Logging<br/>All tenant data access"]
        ENCRYPT_AT_REST["Encryption at Rest<br/>{{ENCRYPTION_ALGORITHM}}"]
        ENCRYPT_TRANSIT["Encryption in Transit<br/>TLS 1.3"]
        DATA_RESIDENCY["Data Residency<br/>Region: {{DATA_REGION}}"]
        RETENTION["Data Retention<br/>{{RETENTION_PERIOD}}"]
        RIGHT_TO_DELETE["Right to Deletion<br/>Tenant data purge pipeline"]

        AUDIT --> ENCRYPT_AT_REST
        AUDIT --> ENCRYPT_TRANSIT
        ENCRYPT_AT_REST --> DATA_RESIDENCY
        DATA_RESIDENCY --> RETENTION
        RETENTION --> RIGHT_TO_DELETE
    end
```

<!-- END IF -->

---

## Data Classification

| Data Type | Scope | Isolation Method | Encryption | Example |
|---|---|---|---|---|
| {{DATA_TYPE_1}} | Tenant-scoped | Row-Level Security | AES-256 at rest, TLS in transit | User profiles, orders |
| {{DATA_TYPE_2}} | Tenant-scoped | Tenant column filter | AES-256 at rest, TLS in transit | Documents, uploads |
| {{DATA_TYPE_3}} | Reference (shared read) | Read-only global table | TLS in transit | Country codes, categories |
| {{DATA_TYPE_4}} | Global | No isolation needed | TLS in transit | System configuration |
| {{DATA_TYPE_5}} | Tenant-scoped | Schema separation | AES-256 at rest, TLS in transit | Financial records |

**Legend:**
- Tenant-scoped (green): Fully isolated per tenant; no cross-tenant access permitted
- Reference data (blue): Shared read-only data; tenants cannot modify
- Global data (gray): System-level data; not tenant-specific

## Tenant Operations

| Operation | Description | Isolation Impact | Rollback Strategy |
|---|---|---|---|
| Tenant Provisioning | Create tenant record, schema, cache namespace, storage path | Full isolation from creation | Delete all tenant artifacts |
| Tenant Suspension | Disable access while retaining data | Block at Request Layer | Re-enable tenant context |
| Tenant Deletion | Purge all tenant data across all layers | Remove RLS rows, cache keys, storage path | {{BACKUP_FREQUENCY}} backup restore |
| Tenant Migration | Move tenant data to different region/shard | Re-route at Data Layer | Revert DNS + data pointer |
| Tenant Data Export | Export all tenant data (GDPR/compliance) | Read-only cross-layer scan | N/A |

---

## Cross-References

- **System Architecture:** `system-architecture-flowchart.template.md`
- **Security Zones:** `infra-security-zones.template.md`
- **Auth & Security:** `xc-auth-security.template.md`
- **Data Flow:** `data-flow.template.md`
- **Secrets Management:** `infra-secrets-management.template.md`

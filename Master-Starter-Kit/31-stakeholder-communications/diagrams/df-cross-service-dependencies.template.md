# Cross-Service Data Dependencies — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all {{PLACEHOLDER}} values with project-specific data before rendering.

---

```mermaid
flowchart TB
    subgraph DOMAIN_1["{{DOMAIN_1_NAME}}"]
        SVC_1["{{SERVICE_1_NAME}}<br/>{{SERVICE_1_DESCRIPTION}}"]
        SVC_2["{{SERVICE_2_NAME}}<br/>{{SERVICE_2_DESCRIPTION}}"]
    end

    subgraph DOMAIN_2["{{DOMAIN_2_NAME}}"]
        SVC_3["{{SERVICE_3_NAME}}<br/>{{SERVICE_3_DESCRIPTION}}"]
        SVC_4["{{SERVICE_4_NAME}}<br/>{{SERVICE_4_DESCRIPTION}}"]
    end

    subgraph DOMAIN_3["{{DOMAIN_3_NAME}}"]
        SVC_5["{{SERVICE_5_NAME}}<br/>{{SERVICE_5_DESCRIPTION}}"]
        SVC_6["{{SERVICE_6_NAME}}<br/>{{SERVICE_6_DESCRIPTION}}"]
    end

    subgraph INFRASTRUCTURE["Infrastructure Services"]
        GW["API Gateway"]
        MQ["Message Queue<br/>{{MESSAGE_QUEUE_NAME}}"]
        CACHE["Cache<br/>{{CACHE_TECHNOLOGY}}"]
    end

    subgraph DATA_STORES["Data Stores"]
        DB_1[("{{DB_1_NAME}}")]
        DB_2[("{{DB_2_NAME}}")]
        DB_3[("{{DB_3_NAME}}")]
    end

    %% Synchronous dependencies (solid arrows)
    GW ==>|"route requests"| SVC_1
    GW ==>|"route requests"| SVC_3
    GW ==>|"route requests"| SVC_5
    SVC_1 -->|"{{SYNC_DEP_1_DATA}}"| SVC_3
    SVC_3 -->|"{{SYNC_DEP_2_DATA}}"| SVC_5
    SVC_1 -->|"{{SYNC_DEP_3_DATA}}"| SVC_2
    SVC_4 -->|"{{SYNC_DEP_4_DATA}}"| SVC_6

    %% Asynchronous dependencies (dashed arrows)
    SVC_1 -.->|"{{ASYNC_DEP_1_EVENT}}"| MQ
    MQ -.->|"{{ASYNC_DEP_1_EVENT}}"| SVC_3
    SVC_3 -.->|"{{ASYNC_DEP_2_EVENT}}"| MQ
    MQ -.->|"{{ASYNC_DEP_2_EVENT}}"| SVC_5
    SVC_2 -.->|"{{ASYNC_DEP_3_EVENT}}"| MQ
    MQ -.->|"{{ASYNC_DEP_3_EVENT}}"| SVC_4
    SVC_5 -.->|"{{ASYNC_DEP_4_EVENT}}"| MQ
    MQ -.->|"{{ASYNC_DEP_4_EVENT}}"| SVC_6

    %% Data store connections
    SVC_1 -->|"read/write"| DB_1
    SVC_2 -->|"read/write"| DB_1
    SVC_3 -->|"read/write"| DB_2
    SVC_4 -->|"read/write"| DB_2
    SVC_5 -->|"read/write"| DB_3
    SVC_6 -->|"read/write"| DB_3

    %% Cache connections
    SVC_1 -.->|"cache read"| CACHE
    SVC_3 -.->|"cache read"| CACHE
    SVC_5 -.->|"cache write"| CACHE

    %% Styling
    linkStyle 6,7,8,9 stroke:#e74c3c,stroke-width:2px
    linkStyle 10,11,12,13,14,15,16,17 stroke:#3498db,stroke-width:2px,stroke-dasharray:5
```

### Legend

| Arrow Style | Meaning |
|-------------|---------|
| **Solid line** (`-->`) | Synchronous dependency — caller blocks until response |
| **Dashed line** (`-.->`) | Asynchronous dependency — event-driven, non-blocking |
| **Bold line** (`==>`) | Gateway routing — entry point for external requests |

---

## Dependency Matrix

| Producer Service | Data Produced | Consumer Service | Type | Coupling Level |
|------------------|---------------|------------------|------|----------------|
| {{SERVICE_1_NAME}} | {{SYNC_DEP_1_DATA}} | {{SERVICE_3_NAME}} | Sync | {{COUPLING_1_LEVEL}} |
| {{SERVICE_3_NAME}} | {{SYNC_DEP_2_DATA}} | {{SERVICE_5_NAME}} | Sync | {{COUPLING_2_LEVEL}} |
| {{SERVICE_1_NAME}} | {{SYNC_DEP_3_DATA}} | {{SERVICE_2_NAME}} | Sync | {{COUPLING_3_LEVEL}} |
| {{SERVICE_4_NAME}} | {{SYNC_DEP_4_DATA}} | {{SERVICE_6_NAME}} | Sync | {{COUPLING_4_LEVEL}} |
| {{SERVICE_1_NAME}} | {{ASYNC_DEP_1_EVENT}} | {{SERVICE_3_NAME}} | Async | Loose |
| {{SERVICE_3_NAME}} | {{ASYNC_DEP_2_EVENT}} | {{SERVICE_5_NAME}} | Async | Loose |
| {{SERVICE_2_NAME}} | {{ASYNC_DEP_3_EVENT}} | {{SERVICE_4_NAME}} | Async | Loose |
| {{SERVICE_5_NAME}} | {{ASYNC_DEP_4_EVENT}} | {{SERVICE_6_NAME}} | Async | Loose |

## Circular Dependency Check

| Potential Cycle | Services | Mitigation |
|-----------------|----------|------------|
| {{CYCLE_1_DESCRIPTION}} | {{CYCLE_1_SERVICES}} | {{CYCLE_1_MITIGATION}} |
| {{CYCLE_2_DESCRIPTION}} | {{CYCLE_2_SERVICES}} | {{CYCLE_2_MITIGATION}} |

## Failure Cascade Analysis

| If This Service Fails | Directly Affected | Indirectly Affected | Blast Radius |
|-----------------------|-------------------|---------------------|--------------|
| {{SERVICE_1_NAME}} | {{SERVICE_1_DIRECT_IMPACT}} | {{SERVICE_1_INDIRECT_IMPACT}} | {{SERVICE_1_BLAST_RADIUS}} |
| {{SERVICE_3_NAME}} | {{SERVICE_3_DIRECT_IMPACT}} | {{SERVICE_3_INDIRECT_IMPACT}} | {{SERVICE_3_BLAST_RADIUS}} |
| {{SERVICE_5_NAME}} | {{SERVICE_5_DIRECT_IMPACT}} | {{SERVICE_5_INDIRECT_IMPACT}} | {{SERVICE_5_BLAST_RADIUS}} |
| {{MESSAGE_QUEUE_NAME}} | All async consumers | All downstream services | Critical |

## Notes

- **Coupling targets:** No service should have more than {{MAX_SYNC_DEPENDENCIES}} synchronous dependencies. Prefer async for cross-domain communication.
- **Data ownership:** Each database is owned by a single domain. Cross-domain reads go through the owning service's API, never directly to the database.
- **Event schema registry:** All async events are registered in {{EVENT_SCHEMA_REGISTRY}} with versioned schemas.

## Cross-References

- **Data flow sequences:** `data-flow.template.md`
- **Value chain:** `df-value-chain.template.md`
- **System architecture:** `system-architecture-flowchart.template.md`
- **Real-time paths:** `df-realtime-paths.template.md`

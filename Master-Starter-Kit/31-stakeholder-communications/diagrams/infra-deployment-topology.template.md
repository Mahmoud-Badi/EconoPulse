# Deployment Topology — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all {{PLACEHOLDER}} values with project-specific data before rendering.

```mermaid
flowchart TB
    subgraph DevEnv["Development Environment"]
        DEV_HOST["Hosting<br/>{{DEV_HOSTING}}<br/>local / preview"]
        DEV_APP["App Server<br/>{{DEV_APP_RUNTIME}}<br/>Hot reload enabled"]
        DEV_DB["Database<br/>{{PRIMARY_DATABASE}}<br/>Local instance"]
        DEV_CACHE["Cache<br/>{{CACHE_ENGINE}}<br/>Local instance"]
        DEV_STORAGE["File Storage<br/>Local filesystem<br/>or emulated bucket"]

        DEV_HOST --> DEV_APP
        DEV_APP --> DEV_DB
        DEV_APP --> DEV_CACHE
        DEV_APP --> DEV_STORAGE
    end

    subgraph StagingEnv["Staging Environment"]
        STG_CDN["CDN<br/>{{CDN_PROVIDER}}<br/>Staging distribution"]
        STG_HOST["Hosting<br/>{{CLOUD_PROVIDER}}<br/>{{CONTAINER_ORCHESTRATOR}}"]
        STG_APP["App Server<br/>{{STG_INSTANCE_TYPE}}<br/>Replicas: {{STG_REPLICAS}}"]
        STG_DB["Database<br/>{{PRIMARY_DATABASE}}<br/>Single instance"]
        STG_CACHE["Cache<br/>{{CACHE_ENGINE}}<br/>Shared instance"]
        STG_STORAGE["File Storage<br/>{{STORAGE_PROVIDER}}<br/>Staging bucket"]
        STG_MON["Monitoring<br/>{{MONITORING_PROVIDER}}<br/>Alerts: staging channel"]

        STG_CDN --> STG_HOST
        STG_HOST --> STG_APP
        STG_APP --> STG_DB
        STG_APP --> STG_CACHE
        STG_APP --> STG_STORAGE
        STG_APP --> STG_MON
    end

    subgraph ProdEnv["Production Environment"]
        PROD_CDN["CDN<br/>{{CDN_PROVIDER}}<br/>Production distribution"]
        PROD_LB["Load Balancer<br/>{{LOAD_BALANCER}}<br/>SSL termination"]
        PROD_APP["App Server<br/>{{PROD_INSTANCE_TYPE}}<br/>Replicas: {{PROD_MIN_REPLICAS}}–{{PROD_MAX_REPLICAS}}"]
        PROD_DB_PRIMARY["Database Primary<br/>{{PRIMARY_DATABASE}}<br/>{{PROD_DB_INSTANCE_TYPE}}"]
        PROD_DB_REPLICA["Database Replica<br/>{{PRIMARY_DATABASE}}<br/>Read replica"]
        PROD_CACHE["Cache<br/>{{CACHE_ENGINE}}<br/>Cluster: {{PROD_CACHE_NODES}} nodes"]
        PROD_STORAGE["File Storage<br/>{{STORAGE_PROVIDER}}<br/>Production bucket"]
        PROD_MON["Monitoring<br/>{{MONITORING_PROVIDER}}<br/>Full observability"]
        PROD_BACKUP["Backups<br/>{{BACKUP_FREQUENCY}}<br/>Retention: {{BACKUP_RETENTION}}"]

        PROD_CDN --> PROD_LB
        PROD_LB --> PROD_APP
        PROD_APP -->|"writes"| PROD_DB_PRIMARY
        PROD_APP -->|"reads"| PROD_DB_REPLICA
        PROD_DB_PRIMARY -->|"async replication"| PROD_DB_REPLICA
        PROD_APP --> PROD_CACHE
        PROD_APP --> PROD_STORAGE
        PROD_APP --> PROD_MON
        PROD_DB_PRIMARY --> PROD_BACKUP
    end

    %% Cross-environment connections
    DEV_APP -.->|"deploy to staging<br/>via {{CI_TOOL}}"| STG_APP
    STG_APP -.->|"promote to prod<br/>manual approval gate"| PROD_APP

    style DevEnv fill:#E3F2FD,stroke:#1565C0
    style StagingEnv fill:#FFF3E0,stroke:#E65100
    style ProdEnv fill:#E8F5E9,stroke:#2E7D32
```

<!-- IF {{COMPLIANCE_REQUIREMENTS}} != "none" -->

```mermaid
flowchart TB
    subgraph ComplianceAnnotations["Compliance Layer — {{COMPLIANCE_REQUIREMENTS}}"]
        ENC_TRANSIT["🔒 Encryption in Transit<br/>TLS 1.3 on all connections"]
        ENC_REST["🔒 Encryption at Rest<br/>{{ENCRYPTION_ALGORITHM}}<br/>All databases + storage"]
        AUDIT_LOG["📋 Audit Logging<br/>All data access events<br/>Retention: {{AUDIT_LOG_RETENTION}}"]
        SENS_DATA["🛡️ Sensitive Data Handling<br/>PII encrypted at field level<br/>Masking in non-prod envs"]
        DATA_RES["📍 Data Residency<br/>Region: {{DATA_REGION}}<br/>No cross-region replication"]

        ENC_TRANSIT --> AUDIT_LOG
        ENC_REST --> AUDIT_LOG
        AUDIT_LOG --> SENS_DATA
        SENS_DATA --> DATA_RES
    end

    style ComplianceAnnotations fill:#FCE4EC,stroke:#C62828
```

<!-- END IF -->

---

## Environment Comparison

| Component | Development | Staging | Production |
|---|---|---|---|
| Hosting | Local / {{DEV_HOSTING}} | {{CLOUD_PROVIDER}} | {{CLOUD_PROVIDER}} |
| Orchestration | None (direct run) | {{CONTAINER_ORCHESTRATOR}} | {{CONTAINER_ORCHESTRATOR}} |
| App Replicas | 1 | {{STG_REPLICAS}} | {{PROD_MIN_REPLICAS}}–{{PROD_MAX_REPLICAS}} (auto-scale) |
| Database | Local {{PRIMARY_DATABASE}} | Single instance | Primary + read replica |
| DB Instance | Local | {{STG_DB_INSTANCE_TYPE}} | {{PROD_DB_INSTANCE_TYPE}} |
| Cache | Local {{CACHE_ENGINE}} | Shared instance | {{PROD_CACHE_NODES}}-node cluster |
| CDN | None | {{CDN_PROVIDER}} (staging) | {{CDN_PROVIDER}} (production) |
| File Storage | Local filesystem | {{STORAGE_PROVIDER}} staging bucket | {{STORAGE_PROVIDER}} production bucket |
| SSL/TLS | Self-signed / localhost | Managed certificate | Managed certificate |
| Monitoring | Console logging | {{MONITORING_PROVIDER}} (basic) | {{MONITORING_PROVIDER}} (full) |
| Backups | None | Daily | {{BACKUP_FREQUENCY}} |
| Data | Seed / fixtures | Anonymized production subset | Live data |

## Scaling Configuration

| Resource | Metric | Threshold | Scale Action | Cooldown |
|---|---|---|---|---|
| App Servers | CPU utilization | > {{CPU_SCALE_UP_THRESHOLD}}% | Add 1 replica (max {{PROD_MAX_REPLICAS}}) | {{SCALE_COOLDOWN}} |
| App Servers | CPU utilization | < {{CPU_SCALE_DOWN_THRESHOLD}}% | Remove 1 replica (min {{PROD_MIN_REPLICAS}}) | {{SCALE_COOLDOWN}} |
| Database Replicas | Read query latency | > {{DB_LATENCY_THRESHOLD}}ms | Add read replica | Manual |
| Cache Cluster | Memory utilization | > {{CACHE_MEMORY_THRESHOLD}}% | Resize node / add shard | Manual |
| CDN | Cache hit ratio | < {{CDN_HIT_RATIO_MIN}}% | Review cache rules | N/A |
| File Storage | Storage usage | > {{STORAGE_WARN_THRESHOLD}} | Alert + review retention | N/A |

---

## Cross-References

- **CI/CD Pipeline:** `infra-cicd-pipeline.template.md`
- **Security Zones:** `infra-security-zones.template.md`
- **Monitoring & Observability:** `infra-monitoring-observability.template.md`
- **Disaster Recovery:** `infra-disaster-recovery.template.md`
- **System Architecture:** `system-architecture-flowchart.template.md`

# Network Security Zones — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all {{PLACEHOLDER}} values with project-specific data before rendering.

```mermaid
flowchart TB
    subgraph PublicZone["Public Zone — Trust Level 0"]
        CDN["CDN<br/>{{CDN_PROVIDER}}"]
        STATIC["Static Assets<br/>HTML, CSS, JS, images"]
        PUBLIC_API["Public API Endpoints<br/>(unauthenticated)"]
    end

    subgraph EdgeZone["Edge Zone — Trust Level 1"]
        LB["Load Balancer<br/>{{LOAD_BALANCER}}"]
        WAF["Web Application Firewall<br/>{{WAF_PROVIDER}}"]
        DDOS["DDoS Protection<br/>{{DDOS_PROVIDER}}"]
        SSL_TERM["SSL Termination<br/>TLS 1.3"]

        DDOS --> WAF
        WAF --> LB
        LB --> SSL_TERM
    end

    subgraph AppZone["Application Zone — Trust Level 3"]
        API_1["API Server 1<br/>{{APP_RUNTIME}}"]
        API_2["API Server 2<br/>{{APP_RUNTIME}}"]
        API_N["API Server N<br/>{{APP_RUNTIME}}"]
        WORKERS["Worker Processes<br/>Background jobs<br/>Queue consumers"]
        SCHEDULER["Task Scheduler<br/>Cron / scheduled tasks"]

        API_1 & API_2 & API_N --> WORKERS
        WORKERS --> SCHEDULER
    end

    subgraph DataZone["Data Zone — Trust Level 4"]
        DB_PRIMARY["Database Primary<br/>{{PRIMARY_DATABASE}}"]
        DB_REPLICA["Database Replica<br/>Read-only"]
        CACHE["Cache<br/>{{CACHE_ENGINE}}"]
        SEARCH["Search Engine<br/>{{SEARCH_ENGINE}}"]
        QUEUE["Message Queue<br/>{{QUEUE_ENGINE}}"]

        DB_PRIMARY -->|"replication"| DB_REPLICA
    end

    subgraph IntegrationZone["Integration Zone — Trust Level 2"]
        EXT_API["External API Connectors<br/>{{EXTERNAL_API_1}}<br/>{{EXTERNAL_API_2}}"]
        WEBHOOK_RX["Webhook Receivers<br/>Inbound from third parties"]
        WEBHOOK_TX["Webhook Dispatchers<br/>Outbound to subscribers"]
        OAUTH["OAuth Providers<br/>{{AUTH_PROVIDER}}"]
    end

    subgraph MgmtZone["Management Zone — Trust Level 5"]
        MONITORING["Monitoring<br/>{{MONITORING_PROVIDER}}"]
        LOGGING["Log Aggregation<br/>{{LOG_AGGREGATOR}}"]
        CI_CD["CI/CD Agents<br/>{{CI_TOOL}}"]
        BASTION["Bastion Host<br/>SSH jump box"]
        SECRETS["Secrets Manager<br/>{{SECRETS_PROVIDER}}"]
    end

    %% Zone-to-zone connections with firewall rules
    CDN -->|"HTTPS/443"| LB
    PUBLIC_API -->|"HTTPS/443"| LB
    SSL_TERM -->|"HTTP/{{APP_PORT}}"| API_1
    SSL_TERM -->|"HTTP/{{APP_PORT}}"| API_2
    SSL_TERM -->|"HTTP/{{APP_PORT}}"| API_N

    API_1 -->|"TCP/{{DB_PORT}}"| DB_PRIMARY
    API_1 -->|"TCP/{{DB_PORT}}"| DB_REPLICA
    API_1 -->|"TCP/{{CACHE_PORT}}"| CACHE
    API_1 -->|"TCP/{{SEARCH_PORT}}"| SEARCH
    WORKERS -->|"TCP/{{QUEUE_PORT}}"| QUEUE
    WORKERS -->|"TCP/{{DB_PORT}}"| DB_PRIMARY

    API_1 -->|"HTTPS/443"| EXT_API
    WEBHOOK_RX -->|"HTTPS/443<br/>via Edge"| API_1
    WORKERS -->|"HTTPS/443"| WEBHOOK_TX

    MONITORING -.->|"Agent/{{MONITOR_PORT}}"| API_1
    MONITORING -.->|"Agent/{{MONITOR_PORT}}"| DB_PRIMARY
    LOGGING -.->|"TCP/{{LOG_PORT}}"| API_1
    CI_CD -.->|"SSH/22"| BASTION
    BASTION -.->|"SSH/22"| API_1
    SECRETS -.->|"HTTPS/443"| API_1

    style PublicZone fill:#FFEBEE,stroke:#C62828
    style EdgeZone fill:#FFF3E0,stroke:#E65100
    style AppZone fill:#E3F2FD,stroke:#1565C0
    style DataZone fill:#E8F5E9,stroke:#2E7D32
    style IntegrationZone fill:#F3E5F5,stroke:#6A1B9A
    style MgmtZone fill:#ECEFF1,stroke:#37474F
```

<!-- IF {{COMPLIANCE_REQUIREMENTS}} != "none" -->

```mermaid
flowchart TB
    subgraph ComplianceMapping["Compliance Framework Mapping — {{COMPLIANCE_REQUIREMENTS}}"]
        direction LR
        PCI["PCI-DSS Controls"]
        SOC["SOC 2 Controls"]
        GDPR["GDPR Articles"]
        HIPAA["HIPAA Safeguards"]

        PCI --> PCI_1["Req 1: Firewall<br/>→ Edge Zone + zone boundaries"]
        PCI --> PCI_2["Req 3: Protect stored data<br/>→ Data Zone encryption"]
        PCI --> PCI_3["Req 6: Secure systems<br/>→ App Zone hardening"]
        PCI --> PCI_4["Req 10: Track access<br/>→ Mgmt Zone logging"]

        SOC --> SOC_1["CC6.1: Logical access<br/>→ Zone trust levels"]
        SOC --> SOC_2["CC6.6: External threats<br/>→ Edge Zone WAF + DDoS"]
        SOC --> SOC_3["CC7.2: Monitoring<br/>→ Mgmt Zone observability"]

        GDPR --> GDPR_1["Art 25: Data protection by design<br/>→ Data Zone isolation"]
        GDPR --> GDPR_2["Art 32: Security of processing<br/>→ All zone encryption"]

        HIPAA --> HIPAA_1["164.312(a): Access control<br/>→ Zone boundaries"]
        HIPAA --> HIPAA_2["164.312(e): Transmission security<br/>→ TLS between zones"]
    end

    style ComplianceMapping fill:#FCE4EC,stroke:#C62828
```

<!-- END IF -->

---

## Zone Trust Matrix

| Source Zone | Public (0) | Edge (1) | Integration (2) | Application (3) | Data (4) | Management (5) |
|---|---|---|---|---|---|---|
| **Public (0)** | -- | HTTPS/443 only | Denied | Denied | Denied | Denied |
| **Edge (1)** | Response traffic | -- | Denied | HTTP/{{APP_PORT}} | Denied | Denied |
| **Integration (2)** | Denied | Via Edge only | -- | HTTPS/443 (webhook) | Denied | Denied |
| **Application (3)** | Denied | Denied | HTTPS/443 (outbound) | Internal | TCP/{{DB_PORT}}, {{CACHE_PORT}} | Agent ports |
| **Data (4)** | Denied | Denied | Denied | Response traffic | Internal replication | Backup agents |
| **Management (5)** | Denied | Read-only metrics | Denied | SSH via bastion | Read-only metrics | Internal |

## Firewall Rules

| Rule ID | Source Zone | Dest Zone | Protocol | Port | Direction | Purpose |
|---|---|---|---|---|---|---|
| FW-001 | Public | Edge | TCP | 443 | Inbound | Client HTTPS traffic |
| FW-002 | Edge | Application | TCP | {{APP_PORT}} | Inbound | Decrypted app traffic |
| FW-003 | Application | Data | TCP | {{DB_PORT}} | Outbound | Database queries |
| FW-004 | Application | Data | TCP | {{CACHE_PORT}} | Outbound | Cache reads/writes |
| FW-005 | Application | Data | TCP | {{SEARCH_PORT}} | Outbound | Search queries |
| FW-006 | Application | Data | TCP | {{QUEUE_PORT}} | Outbound | Queue publish/consume |
| FW-007 | Application | Integration | TCP | 443 | Outbound | External API calls |
| FW-008 | Integration | Edge | TCP | 443 | Inbound | Inbound webhooks |
| FW-009 | Management | Application | TCP | 22 | Inbound | SSH via bastion only |
| FW-010 | Management | All zones | TCP | {{MONITOR_PORT}} | Inbound | Monitoring agents |
| FW-011 | Management | Application | TCP | {{LOG_PORT}} | Inbound | Log collection |
| FW-012 | ALL | ALL | * | * | Both | **Default: DENY** |

---

## Cross-References

- **Deployment Topology:** `infra-deployment-topology.template.md`
- **Auth & Security:** `xc-auth-security.template.md`
- **Secrets Management:** `infra-secrets-management.template.md`
- **Monitoring & Observability:** `infra-monitoring-observability.template.md`
- **API Topology:** `infra-api-topology.template.md`

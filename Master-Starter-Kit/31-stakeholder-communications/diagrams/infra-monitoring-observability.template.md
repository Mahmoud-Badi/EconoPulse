# Monitoring & Observability Architecture — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all {{PLACEHOLDER}} values with project-specific data before rendering.

```mermaid
flowchart TB
    subgraph ErrorTracking["Error Tracking"]
        APP_ERROR["Application Error<br/>Unhandled exception /<br/>caught + reported"]
        ERROR_CTX["Error Context<br/>Stack trace, user ID,<br/>request ID, env"]
        ERROR_SVC["Error Service<br/>{{ERROR_TRACKING_PROVIDER}}"]
        ERROR_DEDUP["Deduplication<br/>Group by fingerprint"]
        ERROR_ALERT["Error Alert<br/>Threshold: {{ERROR_RATE_THRESHOLD}}/min"]

        APP_ERROR --> ERROR_CTX
        ERROR_CTX --> ERROR_SVC
        ERROR_SVC --> ERROR_DEDUP
        ERROR_DEDUP -->|"new or regression"| ERROR_ALERT
    end

    subgraph Metrics["Metrics Collection"]
        BIZ_METRICS["Business Metrics<br/>{{METRIC_1}}, {{METRIC_2}},<br/>{{METRIC_3}}"]
        PERF_METRICS["Performance Metrics<br/>Response time, throughput,<br/>error rate, saturation"]
        METRICS_BACKEND["Metrics Backend<br/>{{METRICS_PROVIDER}}"]
        DASHBOARDS["Dashboards<br/>{{DASHBOARD_TOOL}}"]

        BIZ_METRICS --> METRICS_BACKEND
        PERF_METRICS --> METRICS_BACKEND
        METRICS_BACKEND --> DASHBOARDS
    end

    subgraph InfraMonitoring["Infrastructure Monitoring"]
        SERVER_HEALTH["Server Health<br/>CPU, memory, disk, network"]
        DB_HEALTH["Database Health<br/>Connections, query time,<br/>replication lag"]
        CACHE_HEALTH["Cache Health<br/>Hit ratio, memory,<br/>eviction rate"]
        MON_AGENT["Monitoring Agent<br/>{{MONITORING_PROVIDER}}"]
        INFRA_DASH["Infrastructure Dashboard"]

        SERVER_HEALTH --> MON_AGENT
        DB_HEALTH --> MON_AGENT
        CACHE_HEALTH --> MON_AGENT
        MON_AGENT --> INFRA_DASH
    end

    subgraph LogPipeline["Log Pipeline"]
        STRUCT_LOG["Structured Logs<br/>JSON format<br/>request_id, tenant_id,<br/>user_id, action, level"]
        LOG_SHIP["Log Shipper<br/>{{LOG_SHIPPER}}"]
        LOG_AGG["Log Aggregator<br/>{{LOG_AGGREGATOR}}"]
        LOG_SEARCH["Search & Analysis<br/>Full-text + field queries"]
        LOG_RETAIN["Log Retention<br/>Hot: {{LOG_HOT_RETENTION}}<br/>Warm: {{LOG_WARM_RETENTION}}<br/>Cold: {{LOG_COLD_RETENTION}}"]

        STRUCT_LOG --> LOG_SHIP
        LOG_SHIP --> LOG_AGG
        LOG_AGG --> LOG_SEARCH
        LOG_AGG --> LOG_RETAIN
    end

    subgraph APM["Application Performance Monitoring"]
        TRACE["Distributed Tracing<br/>{{APM_TOOL}}"]
        TRACE_SPAN["Span Collection<br/>Request → service → DB"]
        SLOW_QUERY["Slow Query Detection<br/>Threshold: {{SLOW_QUERY_THRESHOLD}}ms"]
        PERF_BASELINE["Performance Baseline<br/>p50, p95, p99 latencies"]

        TRACE --> TRACE_SPAN
        TRACE_SPAN --> SLOW_QUERY
        TRACE_SPAN --> PERF_BASELINE
    end

    subgraph Alerting["Alerting & Escalation"]
        P1["P1 — Critical<br/>Service down / data loss<br/>Response: {{P1_RESPONSE_TIME}}"]
        P2["P2 — High<br/>Degraded performance<br/>Response: {{P2_RESPONSE_TIME}}"]
        P3["P3 — Medium<br/>Non-critical component issue<br/>Response: {{P3_RESPONSE_TIME}}"]
        P4["P4 — Low<br/>Informational / cosmetic<br/>Response: {{P4_RESPONSE_TIME}}"]

        NOTIFY_PAGE["{{PAGING_PROVIDER}}<br/>Phone + SMS"]
        NOTIFY_SLACK["{{CHAT_PROVIDER}}<br/>Channel alert"]
        NOTIFY_EMAIL["Email<br/>Notification"]
        NOTIFY_TICKET["Ticket System<br/>{{TICKET_PROVIDER}}"]

        P1 -->|"immediate"| NOTIFY_PAGE
        P1 -->|"immediate"| NOTIFY_SLACK
        P2 -->|"within {{P2_RESPONSE_TIME}}"| NOTIFY_SLACK
        P2 -->|"auto-create"| NOTIFY_TICKET
        P3 -->|"next business day"| NOTIFY_EMAIL
        P3 -->|"auto-create"| NOTIFY_TICKET
        P4 -->|"weekly digest"| NOTIFY_EMAIL

        ESC_1["Escalation L1<br/>On-call engineer<br/>{{ESCALATION_L1_TIMEOUT}}"]
        ESC_2["Escalation L2<br/>Team lead<br/>{{ESCALATION_L2_TIMEOUT}}"]
        ESC_3["Escalation L3<br/>Engineering manager<br/>{{ESCALATION_L3_TIMEOUT}}"]

        NOTIFY_PAGE -->|"no ack"| ESC_1
        ESC_1 -->|"no resolution"| ESC_2
        ESC_2 -->|"no resolution"| ESC_3
    end

    %% Cross-subgraph connections
    ERROR_ALERT -->|"P1/P2"| P1
    ERROR_ALERT -->|"P3/P4"| P3
    DASHBOARDS -.->|"threshold breach"| P2
    INFRA_DASH -.->|"threshold breach"| P1
    SLOW_QUERY -.->|"threshold breach"| P3
    LOG_SEARCH -.->|"error pattern detected"| P2

    style P1 fill:#F44336,color:#fff
    style P2 fill:#FF9800,color:#fff
    style P3 fill:#FFC107,color:#000
    style P4 fill:#2196F3,color:#fff
```

---

## SLO Targets

| Service | Metric | Target | Measurement Window | Burn Rate Alert |
|---|---|---|---|---|
| {{SERVICE_1_NAME}} | Availability | {{SLO_AVAILABILITY_1}}% | 30-day rolling | > 2x in 1h |
| {{SERVICE_1_NAME}} | Latency (p95) | < {{SLO_LATENCY_P95_1}}ms | 30-day rolling | > 1.5x in 6h |
| {{SERVICE_2_NAME}} | Availability | {{SLO_AVAILABILITY_2}}% | 30-day rolling | > 2x in 1h |
| {{SERVICE_2_NAME}} | Latency (p95) | < {{SLO_LATENCY_P95_2}}ms | 30-day rolling | > 1.5x in 6h |
| {{SERVICE_N_NAME}} | Availability | {{SLO_AVAILABILITY_N}}% | 30-day rolling | > 2x in 1h |
| Overall Error Rate | Error ratio | < {{SLO_ERROR_RATE}}% | 30-day rolling | > 3x in 1h |

## Alert Severity Definitions

| Level | Description | Response Time | Notification Channel | Escalation Path | Example |
|---|---|---|---|---|---|
| P1 — Critical | Service outage, data loss risk, security breach | {{P1_RESPONSE_TIME}} | {{PAGING_PROVIDER}} + {{CHAT_PROVIDER}} | L1 → L2 → L3 | Database unreachable, auth service down |
| P2 — High | Degraded performance, partial feature outage | {{P2_RESPONSE_TIME}} | {{CHAT_PROVIDER}} + auto-ticket | L1 → L2 | API latency > 5x baseline, cache cluster down |
| P3 — Medium | Non-critical issue, single component degraded | {{P3_RESPONSE_TIME}} | Email + auto-ticket | L1 (next business day) | Background job failures, non-critical API errors |
| P4 — Low | Informational, cosmetic, minor degradation | {{P4_RESPONSE_TIME}} | Weekly email digest | None (backlog) | Deprecation warnings, minor UI issues |

## Log Retention Policy

| Log Category | Hot Storage | Warm Storage | Cold / Archive | Total Retention | Compliance Requirement |
|---|---|---|---|---|---|
| Application logs | {{LOG_HOT_RETENTION}} | {{LOG_WARM_RETENTION}} | {{LOG_COLD_RETENTION}} | {{LOG_TOTAL_RETENTION}} | {{LOG_COMPLIANCE}} |
| Access logs | {{LOG_HOT_RETENTION}} | {{LOG_WARM_RETENTION}} | {{LOG_COLD_RETENTION}} | {{LOG_TOTAL_RETENTION}} | {{LOG_COMPLIANCE}} |
| Security / audit logs | 90 days | 1 year | {{AUDIT_LOG_RETENTION}} | {{AUDIT_LOG_RETENTION}} | {{COMPLIANCE_REQUIREMENTS}} |
| Error tracking | 30 days | 90 days | 1 year | 1 year | None |
| Performance traces | 7 days | 30 days | None | 30 days | None |

---

## Cross-References

- **Deployment Topology:** `infra-deployment-topology.template.md`
- **Disaster Recovery:** `infra-disaster-recovery.template.md`
- **Security Zones:** `infra-security-zones.template.md`
- **CI/CD Pipeline:** `infra-cicd-pipeline.template.md`
- **API Topology:** `infra-api-topology.template.md`

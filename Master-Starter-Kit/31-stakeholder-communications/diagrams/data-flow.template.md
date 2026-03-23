# Data Flow Diagram — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all {{PLACEHOLDER}} values with project-specific data before rendering.

---

## Flow 1: {{FLOW_1_NAME}}

```mermaid
sequenceDiagram
    participant U as User/Client
    participant FE as Frontend
    participant GW as API Gateway
    participant S1 as {{SERVICE_1_NAME}}
    participant S2 as {{SERVICE_2_NAME}}
    participant DB as {{DATABASE_NAME}}
    participant C as {{CACHE_NAME}}

    U->>FE: {{FLOW_1_USER_ACTION}}
    FE->>GW: {{FLOW_1_REQUEST_METHOD}} {{FLOW_1_ENDPOINT}}
    GW->>GW: Authenticate / Rate-limit
    GW->>S1: Forward request ({{FLOW_1_PAYLOAD_DESC}})

    alt Cache hit
        S1->>C: GET {{FLOW_1_CACHE_KEY}}
        C-->>S1: Cached {{FLOW_1_CACHED_DATA}}
    else Cache miss
        S1->>DB: {{FLOW_1_DB_QUERY}}
        DB-->>S1: {{FLOW_1_DB_RESULT}}
        S1->>C: SET {{FLOW_1_CACHE_KEY}} TTL={{FLOW_1_CACHE_TTL}}
    end

    S1-->>GW: 200 OK ({{FLOW_1_RESPONSE_DESC}})
    GW-->>FE: JSON response
    FE-->>U: {{FLOW_1_UI_UPDATE}}

    alt Error — {{FLOW_1_ERROR_SCENARIO}}
        S1-->>GW: {{FLOW_1_ERROR_CODE}} {{FLOW_1_ERROR_MESSAGE}}
        GW-->>FE: Error response
        FE-->>U: {{FLOW_1_ERROR_UI_MESSAGE}}
    end
```

## Flow 2: {{FLOW_2_NAME}}

```mermaid
sequenceDiagram
    participant U as User/Client
    participant FE as Frontend
    participant GW as API Gateway
    participant S1 as {{SERVICE_1_NAME}}
    participant S2 as {{SERVICE_2_NAME}}
    participant S3 as {{SERVICE_3_NAME}}
    participant DB as {{DATABASE_NAME}}
    participant EXT as {{EXTERNAL_API_1_NAME}}

    U->>FE: {{FLOW_2_USER_ACTION}}
    FE->>GW: {{FLOW_2_REQUEST_METHOD}} {{FLOW_2_ENDPOINT}}
    GW->>S1: Route to {{SERVICE_1_NAME}}
    S1->>S2: {{FLOW_2_INTER_SERVICE_CALL}} ({{FLOW_2_INTER_SERVICE_DATA}})
    S2->>EXT: {{FLOW_2_EXTERNAL_REQUEST}}
    EXT-->>S2: {{FLOW_2_EXTERNAL_RESPONSE}}
    S2-->>S1: {{FLOW_2_ENRICHED_DATA}}
    S1->>DB: {{FLOW_2_DB_WRITE}}
    DB-->>S1: Confirmation
    S1->>S3: Emit event: {{FLOW_2_EVENT_NAME}}
    S3->>S3: {{FLOW_2_ASYNC_PROCESSING}}
    S1-->>GW: 201 Created
    GW-->>FE: JSON response
    FE-->>U: {{FLOW_2_UI_CONFIRMATION}}

    alt Error — External service unavailable
        EXT-->>S2: 503 Service Unavailable
        S2-->>S1: Fallback to {{FLOW_2_FALLBACK_STRATEGY}}
        S1-->>GW: 200 OK (degraded)
        GW-->>FE: Partial response
        FE-->>U: {{FLOW_2_DEGRADED_UI_MESSAGE}}
    end
```

## Flow 3: {{FLOW_3_NAME}}

```mermaid
sequenceDiagram
    participant U as User/Client
    participant FE as Frontend
    participant GW as API Gateway
    participant S1 as {{SERVICE_1_NAME}}
    participant S2 as {{SERVICE_2_NAME}}
    participant DB as {{DATABASE_NAME}}
    participant C as {{CACHE_NAME}}

    U->>FE: {{FLOW_3_USER_ACTION}}
    FE->>GW: {{FLOW_3_REQUEST_METHOD}} {{FLOW_3_ENDPOINT}}
    GW->>S1: {{FLOW_3_COMMAND}}
    S1->>S1: Validate {{FLOW_3_VALIDATION_RULES}}

    alt Validation passes
        S1->>DB: {{FLOW_3_DB_OPERATION}}
        DB-->>S1: {{FLOW_3_DB_RESULT}}
        S1->>C: Invalidate {{FLOW_3_INVALIDATED_KEYS}}
        S1->>S2: Notify ({{FLOW_3_NOTIFICATION_PAYLOAD}})
        S1-->>GW: 200 OK
        GW-->>FE: Success response
        FE-->>U: {{FLOW_3_SUCCESS_UI}}
    else Validation fails
        S1-->>GW: 422 Unprocessable Entity ({{FLOW_3_VALIDATION_ERRORS}})
        GW-->>FE: Validation error response
        FE-->>U: {{FLOW_3_VALIDATION_UI_MESSAGE}}
    end
```

## Flow 4: {{FLOW_4_NAME}}

```mermaid
sequenceDiagram
    participant EXT as {{EXTERNAL_API_2_NAME}}
    participant GW as API Gateway
    participant S2 as {{SERVICE_2_NAME}}
    participant S3 as {{SERVICE_3_NAME}}
    participant DB as {{DATABASE_NAME}}
    participant FE as Frontend
    participant U as User/Client

    EXT->>GW: Webhook POST {{FLOW_4_WEBHOOK_ENDPOINT}}
    GW->>S2: Forward webhook payload
    S2->>S2: Verify signature ({{FLOW_4_SIGNATURE_METHOD}})
    S2->>DB: {{FLOW_4_DB_UPDATE}}
    DB-->>S2: Confirmation
    S2->>S3: Emit event: {{FLOW_4_EVENT_NAME}}
    S3->>FE: Push notification ({{FLOW_4_PUSH_CHANNEL}})
    FE-->>U: {{FLOW_4_REALTIME_UI_UPDATE}}

    alt Error — Invalid signature
        S2-->>GW: 401 Unauthorized
        S2->>S2: Log security event
    end
```

## Flow 5: {{FLOW_5_NAME}}

```mermaid
sequenceDiagram
    participant CRON as Scheduler
    participant S3 as {{SERVICE_3_NAME}}
    participant S1 as {{SERVICE_1_NAME}}
    participant DB as {{DATABASE_NAME}}
    participant EXT as {{EXTERNAL_API_1_NAME}}
    participant U as User/Client

    CRON->>S3: Trigger {{FLOW_5_SCHEDULE}} job
    S3->>DB: {{FLOW_5_DATA_QUERY}}
    DB-->>S3: {{FLOW_5_DATASET}}
    S3->>S3: {{FLOW_5_PROCESSING_STEP}}
    S3->>S1: Request enrichment ({{FLOW_5_ENRICHMENT_DATA}})
    S1->>EXT: {{FLOW_5_EXTERNAL_CALL}}
    EXT-->>S1: {{FLOW_5_EXTERNAL_RESULT}}
    S1-->>S3: Enriched dataset
    S3->>DB: {{FLOW_5_DB_WRITE}}
    S3->>U: {{FLOW_5_NOTIFICATION}} (email/push)

    alt Error — Batch processing failure
        S3->>S3: Retry {{FLOW_5_RETRY_COUNT}} times
        S3->>DB: Log failed batch ({{FLOW_5_FAILURE_LOG}})
        S3->>U: {{FLOW_5_FAILURE_NOTIFICATION}}
    end
```

---

## Data Flow Summary

| Flow | Trigger | Services Involved | Data Exchanged | Storage Points |
|------|---------|-------------------|----------------|----------------|
| {{FLOW_1_NAME}} | {{FLOW_1_USER_ACTION}} | {{SERVICE_1_NAME}}, Cache | {{FLOW_1_PAYLOAD_DESC}} → {{FLOW_1_RESPONSE_DESC}} | {{DATABASE_NAME}}, {{CACHE_NAME}} |
| {{FLOW_2_NAME}} | {{FLOW_2_USER_ACTION}} | {{SERVICE_1_NAME}}, {{SERVICE_2_NAME}}, {{SERVICE_3_NAME}} | {{FLOW_2_INTER_SERVICE_DATA}} + {{FLOW_2_EXTERNAL_RESPONSE}} | {{DATABASE_NAME}} |
| {{FLOW_3_NAME}} | {{FLOW_3_USER_ACTION}} | {{SERVICE_1_NAME}}, {{SERVICE_2_NAME}} | {{FLOW_3_COMMAND}} → {{FLOW_3_DB_RESULT}} | {{DATABASE_NAME}} |
| {{FLOW_4_NAME}} | External webhook | {{SERVICE_2_NAME}}, {{SERVICE_3_NAME}} | {{FLOW_4_WEBHOOK_ENDPOINT}} payload | {{DATABASE_NAME}} |
| {{FLOW_5_NAME}} | Scheduled ({{FLOW_5_SCHEDULE}}) | {{SERVICE_3_NAME}}, {{SERVICE_1_NAME}} | {{FLOW_5_DATASET}} → {{FLOW_5_ENRICHMENT_DATA}} | {{DATABASE_NAME}} |

## Notes

- **Authentication:** All requests through the API Gateway carry a `Bearer {{AUTH_TOKEN_TYPE}}` header. Gateway validates before routing.
- **Rate limiting:** Gateway enforces {{RATE_LIMIT_REQUESTS}}/{{RATE_LIMIT_WINDOW}} per client.
- **Timeouts:** Service-to-service calls use a {{INTER_SERVICE_TIMEOUT_MS}}ms timeout with {{RETRY_POLICY}} retry policy.
- **Idempotency:** Flows 2 and 4 use idempotency keys (`X-Idempotency-Key`) to prevent duplicate processing.

## Cross-References

- **System architecture:** `system-architecture-flowchart.template.md`
- **Service dependencies:** `df-cross-service-dependencies.template.md`
- **Value chain:** `df-value-chain.template.md`
- **Real-time paths:** `df-realtime-paths.template.md`
- **Integration registry:** `int-phase1-mvp.template.md`

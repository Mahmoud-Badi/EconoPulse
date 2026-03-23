<!-- CONDITIONAL: Generate only if {{HAS_REALTIME}} == "true" -->

# Real-Time Data Paths — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all {{PLACEHOLDER}} values with project-specific data before rendering.

---

```mermaid
flowchart LR
    subgraph SOURCES["Data Sources"]
        SRC_1["{{RT_SOURCE_1_NAME}}<br/>{{RT_SOURCE_1_DESC}}"]
        SRC_2["{{RT_SOURCE_2_NAME}}<br/>{{RT_SOURCE_2_DESC}}"]
        SRC_3["{{RT_SOURCE_3_NAME}}<br/>{{RT_SOURCE_3_DESC}}"]
    end

    subgraph WS_CHANNELS["WebSocket Channels"]
        WS_1["{{WS_CHANNEL_1_NAME}}<br/>Protocol: WebSocket<br/>Freq: {{WS_CHANNEL_1_FREQUENCY}}"]
        WS_2["{{WS_CHANNEL_2_NAME}}<br/>Protocol: WebSocket<br/>Freq: {{WS_CHANNEL_2_FREQUENCY}}"]
        WS_3["{{WS_CHANNEL_3_NAME}}<br/>Protocol: WebSocket<br/>Freq: {{WS_CHANNEL_3_FREQUENCY}}"]
    end

    subgraph SSE_STREAMS["Server-Sent Events"]
        SSE_1["{{SSE_STREAM_1_NAME}}<br/>Protocol: SSE<br/>Freq: {{SSE_STREAM_1_FREQUENCY}}"]
        SSE_2["{{SSE_STREAM_2_NAME}}<br/>Protocol: SSE<br/>Freq: {{SSE_STREAM_2_FREQUENCY}}"]
    end

    subgraph PUSH["Push Notifications"]
        PUSH_1["{{PUSH_CHANNEL_1_NAME}}<br/>Protocol: {{PUSH_1_PROTOCOL}}<br/>Freq: {{PUSH_CHANNEL_1_FREQUENCY}}"]
        PUSH_2["{{PUSH_CHANNEL_2_NAME}}<br/>Protocol: {{PUSH_2_PROTOCOL}}<br/>Freq: {{PUSH_CHANNEL_2_FREQUENCY}}"]
    end

    subgraph SUBSCRIBERS["Subscriber Types"]
        SUB_WEB["Web Client<br/>{{WEB_CLIENT_DESC}}"]
        SUB_MOBILE["Mobile Client<br/>{{MOBILE_CLIENT_DESC}}"]
        SUB_ADMIN["Admin Dashboard<br/>{{ADMIN_DASHBOARD_DESC}}"]
        SUB_SERVICE["Internal Service<br/>{{INTERNAL_SERVICE_DESC}}"]
    end

    subgraph FALLBACKS["Fallback Modes"]
        FB_POLL["Polling Fallback<br/>Interval: {{POLLING_FALLBACK_INTERVAL}}"]
        FB_LONG["Long-Polling Fallback<br/>Timeout: {{LONG_POLL_TIMEOUT}}"]
        FB_CACHE["Cache Read Fallback<br/>Staleness: {{CACHE_STALENESS_LIMIT}}"]
    end

    %% Source → Channel routing
    SRC_1 -->|"{{RT_SOURCE_1_EVENT_TYPE}}"| WS_1
    SRC_1 -->|"{{RT_SOURCE_1_EVENT_TYPE}}"| SSE_1
    SRC_2 -->|"{{RT_SOURCE_2_EVENT_TYPE}}"| WS_2
    SRC_2 -->|"{{RT_SOURCE_2_EVENT_TYPE}}"| SSE_2
    SRC_3 -->|"{{RT_SOURCE_3_EVENT_TYPE}}"| WS_3
    SRC_3 -->|"{{RT_SOURCE_3_EVENT_TYPE}}"| PUSH_1
    SRC_1 -->|"{{RT_SOURCE_1_PUSH_EVENT}}"| PUSH_2

    %% Channel → Subscriber delivery
    WS_1 -->|"live stream"| SUB_WEB
    WS_1 -->|"live stream"| SUB_MOBILE
    WS_2 -->|"live stream"| SUB_WEB
    WS_2 -->|"live stream"| SUB_ADMIN
    WS_3 -->|"live stream"| SUB_ADMIN
    WS_3 -->|"live stream"| SUB_SERVICE
    SSE_1 -->|"event stream"| SUB_WEB
    SSE_2 -->|"event stream"| SUB_ADMIN
    PUSH_1 -->|"push"| SUB_MOBILE
    PUSH_2 -->|"push"| SUB_MOBILE

    %% Fallback connections
    WS_1 -.->|"on disconnect"| FB_POLL
    WS_2 -.->|"on disconnect"| FB_POLL
    WS_3 -.->|"on disconnect"| FB_LONG
    SSE_1 -.->|"on disconnect"| FB_CACHE
    SSE_2 -.->|"on disconnect"| FB_CACHE
    FB_POLL -.->|"degraded"| SUB_WEB
    FB_LONG -.->|"degraded"| SUB_ADMIN
    FB_CACHE -.->|"stale read"| SUB_WEB
```

---

## Real-Time Channel Registry

| Channel | Protocol | Source | Subscribers | Frequency | Payload Size | Fallback |
|---------|----------|--------|-------------|-----------|--------------|----------|
| {{WS_CHANNEL_1_NAME}} | WebSocket | {{RT_SOURCE_1_NAME}} | Web, Mobile | {{WS_CHANNEL_1_FREQUENCY}} | {{WS_CHANNEL_1_PAYLOAD_SIZE}} | Polling ({{POLLING_FALLBACK_INTERVAL}}) |
| {{WS_CHANNEL_2_NAME}} | WebSocket | {{RT_SOURCE_2_NAME}} | Web, Admin | {{WS_CHANNEL_2_FREQUENCY}} | {{WS_CHANNEL_2_PAYLOAD_SIZE}} | Polling ({{POLLING_FALLBACK_INTERVAL}}) |
| {{WS_CHANNEL_3_NAME}} | WebSocket | {{RT_SOURCE_3_NAME}} | Admin, Service | {{WS_CHANNEL_3_FREQUENCY}} | {{WS_CHANNEL_3_PAYLOAD_SIZE}} | Long-polling ({{LONG_POLL_TIMEOUT}}) |
| {{SSE_STREAM_1_NAME}} | SSE | {{RT_SOURCE_1_NAME}} | Web | {{SSE_STREAM_1_FREQUENCY}} | {{SSE_STREAM_1_PAYLOAD_SIZE}} | Cache read ({{CACHE_STALENESS_LIMIT}}) |
| {{SSE_STREAM_2_NAME}} | SSE | {{RT_SOURCE_2_NAME}} | Admin | {{SSE_STREAM_2_FREQUENCY}} | {{SSE_STREAM_2_PAYLOAD_SIZE}} | Cache read ({{CACHE_STALENESS_LIMIT}}) |
| {{PUSH_CHANNEL_1_NAME}} | {{PUSH_1_PROTOCOL}} | {{RT_SOURCE_3_NAME}} | Mobile | {{PUSH_CHANNEL_1_FREQUENCY}} | {{PUSH_CHANNEL_1_PAYLOAD_SIZE}} | In-app inbox |
| {{PUSH_CHANNEL_2_NAME}} | {{PUSH_2_PROTOCOL}} | {{RT_SOURCE_1_NAME}} | Mobile | {{PUSH_CHANNEL_2_FREQUENCY}} | {{PUSH_CHANNEL_2_PAYLOAD_SIZE}} | In-app inbox |

## Connection Management

| Parameter | Value | Notes |
|-----------|-------|-------|
| Max concurrent WS connections | {{MAX_WS_CONNECTIONS}} | Per server instance |
| WS heartbeat interval | {{WS_HEARTBEAT_INTERVAL}} | Keepalive ping/pong |
| WS reconnect backoff | {{WS_RECONNECT_BACKOFF}} | Exponential: {{WS_RECONNECT_BASE_MS}}ms base |
| SSE retry header | {{SSE_RETRY_MS}}ms | Browser-managed reconnect |
| Connection auth | {{RT_AUTH_METHOD}} | Token refresh before expiry |
| Message ordering guarantee | {{MESSAGE_ORDERING}} | Per-channel / global |

## Scaling Considerations

- **Horizontal scaling:** Real-time connections balanced via {{RT_LOAD_BALANCER}} with sticky sessions ({{STICKY_SESSION_METHOD}}).
- **Pub/Sub backbone:** {{RT_PUBSUB_TECHNOLOGY}} distributes events across server instances.
- **Backpressure:** When subscriber lag exceeds {{BACKPRESSURE_THRESHOLD}}, the channel switches to {{BACKPRESSURE_STRATEGY}}.
- **Fan-out limit:** Maximum {{MAX_FANOUT}} subscribers per channel before sharding.

## Notes

- **Graceful degradation:** All real-time channels have a fallback mode. The client SDK automatically switches when connectivity drops.
- **Message deduplication:** Each message carries an idempotency ID (`{{RT_IDEMPOTENCY_HEADER}}`). Clients deduplicate within a {{RT_DEDUP_WINDOW}} window.
- **Bandwidth budget:** Total real-time bandwidth target: {{RT_BANDWIDTH_BUDGET}} per active user.

## Cross-References

- **Data flow sequences:** `data-flow.template.md`
- **Service dependencies:** `df-cross-service-dependencies.template.md`
- **System architecture:** `system-architecture-flowchart.template.md`
- **Mobile offline sync:** `df-mobile-offline-sync.template.md`

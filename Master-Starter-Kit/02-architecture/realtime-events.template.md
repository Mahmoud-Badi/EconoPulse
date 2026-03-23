# Real-Time Events Registry: {{PROJECT_NAME}}

> Generated during Orchestrator Step 15 (Observability & Error Handling).
> Documents all real-time events in the system: who publishes, who subscribes, and the payload schema.

---

## Strategy Selection

**Real-time approach:** {{REALTIME_STRATEGY}}
**Infrastructure:** {{REALTIME_INFRA}}
**Scaling approach:** {{REALTIME_SCALING}}

| Factor | Value |
|--------|-------|
| Expected concurrent connections | {{CONCURRENT_USERS}} |
| Average events per minute | {{EVENTS_PER_MINUTE}} |
| Message size (avg) | {{AVG_MESSAGE_SIZE}} |
| Latency requirement | {{LATENCY_REQUIREMENT}} |

---

## Event Type Registry

| Event Type | Domain | Publisher | Subscribers | Payload | Priority |
|-----------|--------|-----------|-------------|---------|----------|
| `{{EVENT_1}}` | {{DOMAIN}} | {{SERVICE}} | {{SCREENS}} | See below | {{HIGH_MED_LOW}} |
| `{{EVENT_2}}` | {{DOMAIN}} | {{SERVICE}} | {{SCREENS}} | See below | {{HIGH_MED_LOW}} |
| `{{EVENT_3}}` | {{DOMAIN}} | {{SERVICE}} | {{SCREENS}} | See below | {{HIGH_MED_LOW}} |

---

## Event Payloads

### {{EVENT_1}}

```typescript
interface {{EventType}}Payload {
  type: "{{EVENT_1}}";
  timestamp: string;       // ISO 8601
  organizationId: string;  // Tenant isolation
  data: {
    id: string;
    // {{ENTITY_FIELDS}}
  };
  metadata: {
    triggeredBy: string;   // User ID or "system"
    correlationId: string; // Request trace ID
  };
}
```

---

## Per-Service Requirements

| Service | Publishes | Subscribes To | Connection Type |
|---------|-----------|--------------|-----------------|
| {{SERVICE_1}} | {{EVENT_LIST}} | {{EVENT_LIST}} | {{SSE_OR_WS}} |
| {{SERVICE_2}} | {{EVENT_LIST}} | {{EVENT_LIST}} | {{SSE_OR_WS}} |
| {{SERVICE_3}} | — | {{EVENT_LIST}} | {{SSE_OR_WS}} |

---

## Channel / Topic Design

Events are grouped into channels for efficient delivery. Clients subscribe to channels, not individual events.

| Channel Pattern | Example | Events Included |
|----------------|---------|-----------------|
| `org:{orgId}:{{DOMAIN}}` | `org:abc123:trips` | All {{DOMAIN}} events for that org |
| `user:{userId}:notifications` | `user:xyz789:notifications` | Personal notifications |
| `admin:system` | `admin:system` | System health, alerts (admin only) |

---

## Authentication & Authorization

- All real-time connections require a valid auth token
- Tokens are validated on connection establishment
- Channel subscriptions are filtered by `organizationId` (tenant isolation)
- Admin-only channels require role verification
- Connections are terminated on token expiry (client must reconnect)

---

## Offline / Reconnection

| Scenario | Behavior |
|----------|----------|
| Client disconnects briefly (<30s) | Auto-reconnect with exponential backoff |
| Client disconnects long (>30s) | Reconnect + fetch missed events via REST endpoint |
| Server restarts | Clients reconnect; last-event-id used for SSE catch-up |
| Network partition | Client falls back to polling ({{POLLING_INTERVAL}}) |

---

## Monitoring

| Metric | Alert Threshold |
|--------|----------------|
| Active connections | > {{MAX_CONNECTIONS}} |
| Event delivery latency (p95) | > {{LATENCY_THRESHOLD}} |
| Failed deliveries per minute | > {{FAILURE_THRESHOLD}} |
| Reconnection rate | > {{RECONNECT_THRESHOLD}} per minute |

---

## Implementation Checklist

- [ ] Event type registry matches screen requirements (every screen that shows live data has events)
- [ ] All payloads include `organizationId` for tenant isolation
- [ ] All payloads include `correlationId` for tracing
- [ ] Channel authorization is enforced (users cannot subscribe to other orgs)
- [ ] Reconnection logic handles missed events gracefully
- [ ] Load test confirms system handles {{CONCURRENT_USERS}} connections
- [ ] Monitoring alerts are configured for all metrics above

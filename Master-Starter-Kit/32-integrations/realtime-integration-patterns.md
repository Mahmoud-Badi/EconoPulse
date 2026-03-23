# Real-Time Integration Patterns

> When data must flow continuously between your application and external services — live chat, collaborative editing, real-time notifications, stock prices, IoT sensors — you need patterns beyond request/response. This guide covers WebSockets, Server-Sent Events, polling, and the tradeoffs between each.

---

## Pattern Selection

### Decision Tree

```
Need bidirectional communication?
  ├─ Yes → WebSockets
  │   ├─ Through Cloudflare/load balancer? → Verify WebSocket support
  │   └─ Mobile clients? → Consider connection lifecycle carefully
  └─ No (server → client only)
      ├─ Need multiple event types / structured data?
      │   ├─ Yes → Server-Sent Events (SSE)
      │   └─ No, just periodic checks → Polling
      └─ Behind corporate proxy that blocks SSE?
          └─ Long Polling (fallback)
```

### Comparison Matrix

| Factor | WebSockets | SSE | Short Polling | Long Polling |
|--------|-----------|-----|---------------|-------------|
| Direction | Bidirectional | Server → Client | Client → Server → Client | Client → Server → Client |
| Connection | Persistent | Persistent | New per request | Held open |
| Protocol | `ws://` / `wss://` | HTTP | HTTP | HTTP |
| Browser support | All modern | All modern (no IE) | Universal | Universal |
| Proxy/CDN support | Often blocked | Usually works | Always works | Usually works |
| Reconnection | Manual | Built-in (EventSource) | Not applicable | Manual |
| Multiplexing | Manual (channels) | Manual (event types) | Not applicable | Not applicable |
| Server complexity | High | Medium | Low | Medium |
| Scalability | Requires sticky sessions or pub/sub | Requires sticky sessions or pub/sub | Stateless, easy to scale | Moderate |
| Battery impact (mobile) | Medium | Medium | High (frequent polls) | Low |

---

## WebSocket Integration

### Connection Lifecycle

```
1. CONNECTING     → Establish connection (handshake)
2. CONNECTED      → Send/receive messages
3. RECONNECTING   → Connection lost, attempting reconnect
4. DISCONNECTED   → Intentionally closed or max retries exceeded
```

### Reconnection Strategy

| Attempt | Delay | Strategy |
|---------|-------|----------|
| 1 | 0s (immediate) | Connection might have dropped transiently |
| 2 | 1s | Brief pause |
| 3 | 2s | Exponential backoff starts |
| 4 | 4s | Continue backoff |
| 5 | 8s | Continue backoff |
| 6-10 | 15s | Cap at 15s between attempts |
| 11+ | 30s | Reduce frequency, show user notification |
| Max (20) | — | Stop reconnecting, show "connection lost" UI |

**Add jitter** (±20%) to prevent thundering herd when server recovers.

### Heartbeat / Keep-Alive

WebSocket connections can silently die (especially on mobile networks). Implement heartbeats:

```
Client: Send PING every 30 seconds
Server: Respond with PONG within 5 seconds
Client: If no PONG received, assume connection dead → reconnect
```

### State Synchronization on Reconnect

After reconnection, your client's state may be stale. Strategies:

| Strategy | Description | Best For |
|----------|-------------|----------|
| **Full sync** | Request all current state on reconnect | Small state (< 100 items) |
| **Delta sync** | Send last received timestamp, get missed events | Large state, ordered events |
| **Snapshot + stream** | Get current snapshot, then resume streaming | Real-time data (prices, positions) |
| **Version vector** | Compare client version with server version | Collaborative editing |

### Provider-Specific WebSocket Patterns

| Provider | Protocol | Client Library | Use Case |
|----------|----------|---------------|----------|
| **Pusher** | WebSocket + Channels protocol | `pusher-js` | Real-time notifications, chat |
| **Ably** | WebSocket + Ably protocol | `ably` | Pub/sub messaging, presence |
| **Socket.io** | WebSocket + Socket.io protocol | `socket.io-client` | General real-time (with fallback) |
| **Supabase Realtime** | WebSocket + Phoenix protocol | `@supabase/supabase-js` | Database change streams |
| **Firebase Realtime DB** | WebSocket + Firebase protocol | `firebase` | Real-time sync, offline-first |
| **AWS AppSync** | WebSocket + GraphQL subscriptions | `aws-amplify` | GraphQL subscriptions |

---

## Server-Sent Events (SSE)

### When to Use SSE

SSE is ideal when you only need server-to-client updates and want simpler infrastructure than WebSockets:

- Live activity feeds
- Progress updates (file processing, AI generation)
- Real-time notifications
- Stock ticker / price updates
- Server log streaming

### SSE Advantages Over WebSockets

1. **Works over HTTP/2** — multiplexed with other requests, no separate connection
2. **Automatic reconnection** — `EventSource` API reconnects automatically
3. **Last-Event-ID** — built-in mechanism for resuming where you left off
4. **Simpler server** — just write to a response stream, no protocol handling
5. **Proxy-friendly** — works through HTTP proxies that block WebSockets

### SSE Implementation Notes

```
Server sends:
  event: notification
  id: 123
  data: {"type": "new_message", "content": "Hello"}

  event: heartbeat
  id: 124
  data: {}

Client (EventSource):
  - Connects to /api/events
  - Receives events as they're pushed
  - On disconnect, automatically reconnects with Last-Event-ID: 124
  - Server replays events since ID 124
```

### SSE Limitations

- **Unidirectional only** — client cannot send data back through the SSE connection (use regular HTTP requests)
- **Connection limit** — browsers limit ~6 SSE connections per domain (HTTP/1.1). HTTP/2 multiplexing solves this
- **No binary data** — text only (use base64 encoding if needed)
- **Internet Explorer** — no support (use polyfill or long polling fallback)

---

## Polling Strategies

### Short Polling

Client makes periodic HTTP requests at a fixed interval:

```
Client: GET /api/updates every 5 seconds
Server: Returns current data (or empty if no changes)
```

| Interval | Latency | Server Load | Best For |
|----------|---------|-------------|----------|
| 1s | ~500ms avg | Very high | Near real-time, few clients |
| 5s | ~2.5s avg | High | Dashboard updates |
| 15s | ~7.5s avg | Medium | Status checks |
| 60s | ~30s avg | Low | Background sync |

### Long Polling

Client sends request, server holds the connection open until data is available:

```
Client: GET /api/updates (with timeout 30s)
Server: Holds connection until new data available → responds
Client: Immediately sends another request
```

**Advantages over short polling:** Lower latency, less wasted traffic
**Disadvantages:** More complex server, connection management overhead

### Adaptive Polling

Dynamically adjust polling interval based on activity:

```
Rules:
  - User is active on page → poll every 5s
  - User idle for 1 minute → poll every 15s
  - User idle for 5 minutes → poll every 60s
  - Tab is hidden (visibilitychange) → poll every 120s or pause
  - New data received → temporarily increase frequency
  - No new data for 5 polls → decrease frequency
```

---

## Scaling Real-Time Integrations

### The Sticky Session Problem

WebSocket and SSE connections are persistent — they're bound to the specific server instance that accepted them. This creates challenges with load balancers:

| Solution | Description | Complexity |
|----------|-------------|------------|
| **Sticky sessions** | Load balancer routes same client to same server | Low (but limits scaling) |
| **Pub/Sub backbone** | Redis Pub/Sub, NATS, or Kafka between servers | Medium |
| **Managed service** | Use Pusher, Ably, or Supabase Realtime | Low (but adds cost) |
| **Edge workers** | Cloudflare Durable Objects, Fly.io machines | High (but excellent latency) |

### Recommended Architecture

```
Clients ──→ Load Balancer ──→ App Servers ──→ Redis Pub/Sub
                                                    ↑
                                              Integration Workers
                                              (consume third-party
                                               real-time streams)
```

- **Integration workers** connect to third-party WebSocket/SSE streams
- Workers publish received events to Redis Pub/Sub
- App servers subscribe to relevant channels and forward to connected clients
- Decouples third-party connection management from client connection management

---

## Error Handling & Resilience

### Connection State UI

Always communicate connection state to the user:

| State | UI Treatment |
|-------|-------------|
| Connected | Green dot / no indicator |
| Reconnecting | Yellow banner: "Reconnecting..." |
| Disconnected (temporary) | Yellow banner: "Connection lost. Retrying..." |
| Disconnected (permanent) | Red banner: "Connection lost. Please refresh." |
| Stale data | Subtle indicator: "Last updated 5 minutes ago" |

### Offline Handling

For mobile and unreliable networks:

1. **Queue outbound messages** — store locally, send when reconnected
2. **Cache last known state** — show stale data with timestamp
3. **Conflict resolution** — when reconnecting with queued changes, merge conflicts
4. **Optimistic updates** — apply changes locally immediately, reconcile on reconnect

---

## Monitoring Real-Time Integrations

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Active connections | Within expected range | ±50% of normal | > 2x or near 0 |
| Message latency (P95) | < 500ms | 500ms–2s | > 2s |
| Reconnection rate | < 1/min per client | 1–5/min | > 5/min |
| Message delivery rate | > 99% | 95–99% | < 95% |
| Connection duration (avg) | > 10 min | 2–10 min | < 2 min (constant reconnects) |

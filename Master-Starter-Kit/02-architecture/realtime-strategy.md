# Real-Time Strategy Guide

## Purpose

This guide helps you decide whether your application needs real-time features, and if so, which implementation approach to use. The decision is not binary — different parts of your app may use different strategies.

---

## Decision Framework

### Step 1: Does Your Feature Need Real-Time?

| Feature Type | Real-Time Needed? | Why |
|-------------|-------------------|-----|
| Dashboard KPIs | Yes (SSE) | Numbers should update when data changes |
| Status boards (Kanban) | Yes (SSE) | Cards should move when status changes |
| Notification bell | Yes (SSE) | Alerts should appear immediately |
| Chat / messaging | Yes (WebSocket) | Bidirectional, low-latency required |
| Collaborative editing | Yes (WebSocket) | Multiple cursors, conflict resolution |
| Activity feed | Maybe (SSE or polling) | Depends on update frequency |
| Data tables | No (polling or manual) | User can refresh; auto-refresh optional |
| Forms | No | Static until submitted |
| Reports | No | Generated on demand |
| Settings pages | No | Rarely changes |

### Step 2: Choose Your Strategy

```
Does the feature need updates WITHOUT user action?
├── No  → Use manual refresh or React Query refetchOnWindowFocus
├── Yes
    ├── Is the update frequency < 1 per minute?
    │   └── Yes → Use polling (30-60s interval)
    │   └── No
    │       ├── Does the client need to SEND data in real-time?
    │       │   └── Yes → Use WebSocket
    │       │   └── No  → Use SSE (Server-Sent Events)
    │       └── Does the feature need < 100ms latency?
    │           └── Yes → Use WebSocket
    │           └── No  → Use SSE
```

---

## Strategy 1: SSE (Server-Sent Events) -- Recommended Default

### When SSE is Enough

- Dashboards showing live KPIs
- Dispatch/kanban boards with moving cards
- Notification streams
- Status updates (order tracking, trip progress)
- Live activity feeds
- Any scenario where the server pushes updates and the client only listens

### Architecture

```
┌──────────────┐     HTTP GET (keep-alive)      ┌──────────────┐
│   Browser     │ ─────────────────────────────> │   Server     │
│               │ <───────────── SSE stream ──── │              │
│  EventSource  │    data: {"type":"trip",...}    │  Event Bus   │
│               │    data: {"type":"kpi",...}     │              │
└──────────────┘                                 └──────┬───────┘
                                                        │
                                                 ┌──────┴───────┐
                                                 │  Database     │
                                                 │  (triggers or │
                                                 │   app events) │
                                                 └──────────────┘
```

### Server Implementation (Next.js Route Handler)

```typescript
// apps/web/src/app/api/events/route.ts
import { getSession } from "@project/auth";

// In-memory event bus (replace with Redis pub/sub for multi-instance)
type EventListener = (event: SSEEvent) => void;
const listeners = new Map<string, Set<EventListener>>();

export type SSEEvent = {
  type: "trip_updated" | "kpi_changed" | "notification" | "dispatch_update";
  data: Record<string, unknown>;
  organizationId: string;
};

// Publish an event (called from mutations)
export function publishEvent(event: SSEEvent) {
  const orgListeners = listeners.get(event.organizationId);
  if (orgListeners) {
    for (const listener of orgListeners) {
      listener(event);
    }
  }
}

// SSE endpoint
export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const orgId = session.user.organizationId;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection event
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`)
      );

      // Register listener for this organization
      const listener: EventListener = (event) => {
        controller.enqueue(
          encoder.encode(`event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`)
        );
      };

      if (!listeners.has(orgId)) {
        listeners.set(orgId, new Set());
      }
      listeners.get(orgId)!.add(listener);

      // Cleanup on disconnect
      req.signal.addEventListener("abort", () => {
        listeners.get(orgId)?.delete(listener);
        if (listeners.get(orgId)?.size === 0) {
          listeners.delete(orgId);
        }
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

### Publishing Events from Mutations

```typescript
// packages/api/src/routers/trips.ts
import { publishEvent } from "../events";

export const tripsRouter = router({
  complete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const trip = await db.update(trips)
        .set({ status: "completed", completedAt: new Date() })
        .where(eq(trips.id, input.id))
        .returning();

      // Publish real-time event
      publishEvent({
        type: "trip_updated",
        data: { tripId: input.id, status: "completed" },
        organizationId: ctx.organizationId,
      });

      // Also trigger KPI refresh
      publishEvent({
        type: "kpi_changed",
        data: { domain: "trips" },
        organizationId: ctx.organizationId,
      });

      return trip[0];
    }),
});
```

### Client Hook with Exponential Backoff

```typescript
// apps/web/src/hooks/use-event-stream.ts
import { useEffect, useRef, useCallback } from "react";

type EventHandler = (data: unknown) => void;

export function useEventStream(handlers: Record<string, EventHandler>) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 10;

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource("/api/events");
    eventSourceRef.current = es;

    // Reset retry count on successful connection
    es.onopen = () => {
      retryCountRef.current = 0;
    };

    // Register event handlers
    for (const [eventType, handler] of Object.entries(handlers)) {
      es.addEventListener(eventType, (event) => {
        try {
          const data = JSON.parse(event.data);
          handler(data);
        } catch (err) {
          console.error(`Failed to parse SSE event ${eventType}:`, err);
        }
      });
    }

    // Handle errors with exponential backoff
    es.onerror = () => {
      es.close();

      if (retryCountRef.current < maxRetries) {
        const delay = Math.min(1000 * 2 ** retryCountRef.current, 30000); // Max 30s
        retryCountRef.current++;
        console.log(`SSE reconnecting in ${delay}ms (attempt ${retryCountRef.current})`);
        setTimeout(connect, delay);
      } else {
        console.error("SSE max retries reached. Falling back to polling.");
      }
    };
  }, [handlers]);

  useEffect(() => {
    connect();
    return () => {
      eventSourceRef.current?.close();
    };
  }, [connect]);
}

// Usage in a component
function DispatchBoard() {
  const utils = trpc.useUtils();

  useEventStream({
    trip_updated: () => {
      utils.trips.list.invalidate();       // Refresh trip list
    },
    dispatch_update: () => {
      utils.dispatch.getBoardState.invalidate(); // Refresh board
    },
    kpi_changed: () => {
      utils.dashboard.getSnapshot.invalidate();  // Refresh KPIs
    },
  });

  // ... render board
}
```

### SSE Gotchas

1. **Connection limit:** Browsers allow ~6 SSE connections per domain. Multiplex all event types into one stream.
2. **Proxy timeout:** Some reverse proxies (nginx) close idle connections after 60s. Send periodic heartbeat events:
   ```typescript
   // Heartbeat every 30 seconds
   const heartbeat = setInterval(() => {
     controller.enqueue(encoder.encode(": heartbeat\n\n"));
   }, 30000);
   ```
3. **Multi-instance scaling:** In-memory event bus only works for single-server deployments. For multi-instance (Vercel), use Redis pub/sub or a managed service.
4. **Vercel limitation:** Serverless functions have execution time limits. SSE on Vercel requires Edge Functions or a separate WebSocket service.

---

## Strategy 2: WebSocket

### When WebSocket is Needed

- Chat applications (bidirectional messages)
- Collaborative document editing (multiple cursors, real-time sync)
- Multiplayer games (low-latency state sync)
- Video/audio call signaling
- Any feature requiring client-to-server real-time messages

### Architecture

```
┌──────────────┐     WebSocket (upgrade)        ┌──────────────┐
│   Browser     │ ←─────────────────────────────→│   Server     │
│               │     Bidirectional messages      │              │
│  socket.io    │     ← server pushes            │  socket.io   │
│  client       │     → client sends             │  server      │
└──────────────┘                                 └──────────────┘
```

### Server Implementation (socket.io)

```typescript
// packages/services/src/realtime/socket-server.ts
import { Server } from "socket.io";
import { verifySession } from "@project/auth";

export function createSocketServer(httpServer: any) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.NEXT_PUBLIC_APP_URL },
  });

  // Auth middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    const session = await verifySession(token);
    if (!session) return next(new Error("Unauthorized"));
    socket.data.user = session.user;
    socket.data.organizationId = session.user.organizationId;
    next();
  });

  io.on("connection", (socket) => {
    const orgId = socket.data.organizationId;

    // Join organization room
    socket.join(`org:${orgId}`);

    // Handle client messages
    socket.on("chat:send", async (data) => {
      // Validate, save to DB, broadcast to room
      const message = await saveChatMessage(data);
      io.to(`org:${orgId}`).emit("chat:message", message);
    });

    socket.on("disconnect", () => {
      // Cleanup
    });
  });

  return io;
}
```

### Client Implementation

```typescript
// apps/web/src/hooks/use-socket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "@project/auth/client";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.token) return;

    const socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token: session.token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [session?.token]);

  return socketRef.current;
}
```

---

## Strategy 3: Polling

### When Polling is Fine

- Low-frequency updates (every 30-60+ seconds)
- Simple apps with few concurrent users
- Quick prototyping (upgrade to SSE later)
- Environments where SSE/WebSocket is blocked

### Implementation with TanStack Query

```typescript
// Polling is built into TanStack Query via refetchInterval
function useTripList(filters: TripFilters) {
  return trpc.trips.list.useQuery(filters, {
    refetchInterval: 30_000,            // Poll every 30 seconds
    refetchIntervalInBackground: false,  // Stop polling when tab is hidden
    refetchOnWindowFocus: true,          // Refresh when user returns to tab
    staleTime: 10_000,                   // Consider data fresh for 10 seconds
  });
}

// Adaptive polling: increase frequency based on activity
function useAdaptivePolling(baseInterval: number) {
  const [interval, setInterval] = useState(baseInterval);

  // When user interacts with the page, poll faster
  useEffect(() => {
    const handleActivity = () => setInterval(baseInterval);
    const handleIdle = () => setInterval(baseInterval * 3);

    window.addEventListener("mousemove", handleActivity);
    const idleTimer = setTimeout(handleIdle, 60_000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      clearTimeout(idleTimer);
    };
  }, [baseInterval]);

  return interval;
}
```

---

## Hybrid Approach (Recommended for Most Apps)

Most applications don't need one strategy for everything. Use the right tool for each feature:

```
┌─────────────────────────────────────────────────┐
│                    Your App                      │
│                                                  │
│  Dashboard KPIs ──────── SSE (live numbers)      │
│  Dispatch Board ──────── SSE (card movement)     │
│  Notifications ────────── SSE (alert badges)     │
│  Chat (if any) ────────── WebSocket              │
│  Data Tables ─────────── TanStack Query polling  │
│  Settings ────────────── No real-time needed     │
│  Reports ─────────────── No real-time needed     │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Scaling Considerations

| Scale | SSE Strategy | WebSocket Strategy |
|-------|-------------|-------------------|
| Single server | In-memory event bus | socket.io in-memory adapter |
| 2-5 servers | Redis pub/sub | socket.io Redis adapter |
| 10+ servers | Managed service (Ably, Pusher) | Managed service (Ably, Pusher) |
| Serverless (Vercel) | Edge Runtime SSE or third-party | Third-party (Pusher, Ably, PartyKit) |

### Redis Pub/Sub for Multi-Instance SSE

```typescript
import { createClient } from "redis";

const publisher = createClient({ url: process.env.REDIS_URL });
const subscriber = createClient({ url: process.env.REDIS_URL });

// Publish event (called from any server instance)
export async function publishEvent(event: SSEEvent) {
  await publisher.publish(
    `events:${event.organizationId}`,
    JSON.stringify(event)
  );
}

// Subscribe (in SSE endpoint, per connection)
export async function subscribeToOrg(orgId: string, callback: EventListener) {
  await subscriber.subscribe(`events:${orgId}`, (message) => {
    const event = JSON.parse(message) as SSEEvent;
    callback(event);
  });
}
```

---

## Real-Time Design Checklist

- [ ] Each feature evaluated for real-time need (see decision tree)
- [ ] Strategy chosen per feature (SSE / WebSocket / polling / none)
- [ ] Event types documented with payload shapes
- [ ] Auth included in real-time connections
- [ ] Tenant isolation maintained (org-scoped rooms/channels)
- [ ] Reconnection logic with exponential backoff
- [ ] Heartbeat/keep-alive configured for SSE
- [ ] Scaling strategy decided (single server vs Redis vs managed)
- [ ] Serverless platform limitations checked
- [ ] Fallback behavior defined (what happens when connection drops)

# Real-time Patterns — {{PROJECT_NAME}}

> **Two approaches documented:** Server-Sent Events (SSE) for server→client push, and WebSocket for bidirectional communication. Choose based on your needs.

---

## When to Use Which

| Pattern | Use When | Examples |
|---------|----------|---------|
| SSE | Server pushes updates to client (one-way) | Live status updates, dashboard refresh, notifications |
| WebSocket | Bidirectional real-time needed | Chat, collaborative editing, live cursors |
| Polling | Simplest option, low frequency | Check for new data every 30s |
| Neither | Data changes rarely, not time-sensitive | Settings pages, static content |

**Default choice:** SSE. It's simpler, works through proxies/CDNs, auto-reconnects, and covers 90% of real-time use cases.

---

## Approach 1: Server-Sent Events (SSE)

### Architecture

```
┌──────────┐    tRPC mutation    ┌──────────┐    EventEmitter    ┌──────────┐
│  Client A │ ──────────────────→ │  Server  │ ─────────────────→ │ Event Bus │
│ (action)  │                     │          │                     │           │
└──────────┘                     └──────────┘                     └─────┬─────┘
                                                                        │
                                                                        │ emit
                                                                        ↓
┌──────────┐    SSE stream       ┌──────────┐    subscribe       ┌──────────┐
│  Client B │ ←────────────────── │ SSE Route│ ←───────────────── │ Event Bus │
│ (listener)│                     │          │                     │           │
└──────────┘                     └──────────┘                     └──────────┘
```

### 1. Server Event Bus

```typescript
// packages/api/src/lib/event-bus.ts
import { EventEmitter } from "events";

// Singleton event bus (shared across all requests in the server process)
const globalBus = new EventEmitter();
globalBus.setMaxListeners(100); // Support many concurrent SSE connections

export type EventType =
  | "{entity}:created"
  | "{entity}:updated"
  | "{entity}:deleted"
  | "{entity}:statusChanged"
  | "notification:new";

export interface ServerEvent {
  type: EventType;
  companyId: string; // Scope events to company (multi-tenant)
  payload: Record<string, unknown>;
  timestamp: number;
}

export const eventBus = {
  emit(event: ServerEvent) {
    // Emit to company-specific channel
    globalBus.emit(`company:${event.companyId}`, event);
  },

  subscribe(
    companyId: string,
    handler: (event: ServerEvent) => void
  ): () => void {
    const channel = `company:${companyId}`;
    globalBus.on(channel, handler);

    // Return unsubscribe function
    return () => {
      globalBus.off(channel, handler);
    };
  },
};
```

### 2. Emitting Events from tRPC Procedures

```typescript
// packages/api/src/routers/{entity}.ts
import { eventBus } from "../lib/event-bus";

export const {entity}Router = router({
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      status: z.enum(["{STATUS_1}", "{STATUS_2}"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db
        .update({entity})
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq({entity}.id, input.id))
        .returning();

      // Emit event for SSE listeners
      eventBus.emit({
        type: "{entity}:statusChanged",
        companyId: ctx.session.user.companyId,
        payload: {
          id: input.id,
          status: input.status,
          updatedBy: ctx.session.user.id,
        },
        timestamp: Date.now(),
      });

      return updated[0];
    }),
});
```

### 3. SSE Stream Endpoint

```typescript
// apps/web/app/api/events/route.ts
import { eventBus, type ServerEvent } from "@{PROJECT}/api/lib/event-bus";
import { auth } from "~/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Auth check — only authenticated users can subscribe
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const companyId = session.user.companyId;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`)
      );

      // Keep-alive every 30 seconds (prevents proxy/CDN timeout)
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keep-alive\n\n"));
        } catch {
          clearInterval(keepAlive);
        }
      }, 30_000);

      // Subscribe to company events
      const unsubscribe = eventBus.subscribe(
        companyId,
        (event: ServerEvent) => {
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
            );
          } catch {
            // Client disconnected
            cleanup();
          }
        }
      );

      // Cleanup on disconnect
      function cleanup() {
        clearInterval(keepAlive);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Already closed
        }
      }

      // Handle client disconnect
      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
```

### 4. Client Hook

```typescript
// apps/web/hooks/use-event-stream.ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import { api } from "~/lib/trpc";

interface UseEventStreamOptions {
  /** Event types to listen for */
  eventTypes?: string[];
  /** Called when an event is received */
  onEvent?: (event: ServerEvent) => void;
  /** Whether to auto-invalidate TanStack Query cache */
  autoInvalidate?: boolean;
}

export function useEventStream(options: UseEventStreamOptions = {}) {
  const { eventTypes, onEvent, autoInvalidate = true } = options;
  const utils = api.useUtils();
  const retryCount = useRef(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    // Close existing connection
    eventSourceRef.current?.close();

    const es = new EventSource("/api/events");
    eventSourceRef.current = es;

    es.onopen = () => {
      retryCount.current = 0; // Reset retry count on successful connection
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Filter by event type if specified
        if (eventTypes && !eventTypes.includes(data.type)) return;

        // Custom handler
        onEvent?.(data);

        // Auto-invalidate relevant queries
        if (autoInvalidate) {
          invalidateForEvent(utils, data);
        }
      } catch {
        // Ignore parse errors (keep-alive comments, etc.)
      }
    };

    es.onerror = () => {
      es.close();

      // Exponential backoff: 1s, 2s, 5s, 10s, 30s
      const delays = [1000, 2000, 5000, 10_000, 30_000];
      const delay = delays[Math.min(retryCount.current, delays.length - 1)]!;
      retryCount.current++;

      setTimeout(connect, delay);
    };
  }, [eventTypes, onEvent, autoInvalidate, utils]);

  useEffect(() => {
    connect();

    // Reconnect when tab becomes visible (user returns)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        connect();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      eventSourceRef.current?.close();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [connect]);
}

// Map event types to query invalidations
function invalidateForEvent(
  utils: ReturnType<typeof api.useUtils>,
  event: ServerEvent
) {
  const type = event.type;

  if (type.startsWith("{entity}:")) {
    utils.{entity}.list.invalidate();
    if (event.payload.id) {
      utils.{entity}.getById.invalidate({ id: event.payload.id as string });
    }
  }

  // Add more invalidation rules per event type
  if (type === "notification:new") {
    utils.notification.list.invalidate();
  }
}
```

### 5. Usage in Components

```typescript
// apps/web/app/(app)/{entities}/page.tsx
"use client";

import { useEventStream } from "~/hooks/use-event-stream";
import { toast } from "sonner";

export default function {Entities}Page() {
  // Auto-invalidates {entity}.list when events arrive
  useEventStream({
    eventTypes: ["{entity}:created", "{entity}:statusChanged"],
    onEvent: (event) => {
      if (event.type === "{entity}:created") {
        toast.info("New {entity} added");
      }
    },
  });

  // ... rest of page (data auto-refreshes via invalidation)
}
```

---

## Approach 2: WebSocket (Bidirectional)

### When SSE Isn't Enough

Use WebSocket when you need:
- Client→server real-time messages (not just mutations)
- Very low latency (<50ms)
- Binary data transfer
- Multiplexed channels

### Server Setup (socket.io)

```typescript
// apps/web/server/socket.ts
import { Server as SocketServer } from "socket.io";
import type { Server as HTTPServer } from "http";

export function initSocketServer(httpServer: HTTPServer) {
  const io = new SocketServer(httpServer, {
    cors: { origin: process.env.NEXT_PUBLIC_APP_URL },
    path: "/api/ws",
  });

  // Auth middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const session = await verifySession(token);
      socket.data.user = session.user;
      socket.data.companyId = session.user.companyId;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const { companyId } = socket.data;

    // Join company room (multi-tenant isolation)
    socket.join(`company:${companyId}`);

    // Handle client messages
    socket.on("{entity}:subscribe", (entityId: string) => {
      socket.join(`{entity}:${entityId}`);
    });

    socket.on("{entity}:unsubscribe", (entityId: string) => {
      socket.leave(`{entity}:${entityId}`);
    });

    socket.on("disconnect", () => {
      // Cleanup handled automatically by socket.io
    });
  });

  return io;
}

// Emit from anywhere in the server
export function emitToCompany(
  io: SocketServer,
  companyId: string,
  event: string,
  data: unknown
) {
  io.to(`company:${companyId}`).emit(event, data);
}
```

### Client Hook (socket.io)

```typescript
// apps/web/hooks/use-socket.ts
"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_APP_URL!, {
      path: "/api/ws",
      auth: { token: getSessionToken() },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      reconnectionAttempts: Infinity,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket] Connected");
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}
```

---

## Scaling Considerations

| Concern | SSE Solution | WebSocket Solution |
|---------|-------------|-------------------|
| Multiple server instances | Redis pub/sub adapter | Redis adapter for socket.io |
| Connection limits | Nginx/CDN SSE support varies | Dedicated WebSocket server |
| Load balancing | Sticky sessions or Redis | Sticky sessions or Redis |
| Memory per connection | ~2KB (lightweight) | ~10KB (more overhead) |
| Max connections per server | ~10K (Node.js) | ~5K (more overhead) |

### Redis Adapter (for multi-instance)

```typescript
// When running multiple server instances behind a load balancer:
import { createClient } from "redis";

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

// SSE: Use Redis pub/sub instead of in-memory EventEmitter
// WebSocket: Use socket.io Redis adapter
```

---

## Choosing Your Approach

```
Do you need bidirectional real-time?
├── NO → Use SSE (simpler, works everywhere)
│   └── Need low latency (<100ms)?
│       ├── NO → SSE is fine
│       └── YES → Consider WebSocket
└── YES → Use WebSocket
    └── Only need it for one feature?
        ├── YES → SSE for everything else, WebSocket for that one feature
        └── NO → WebSocket everywhere
```

**For most CRUD applications:** SSE covers all needs. The {{PROJECT_NAME}} uses SSE for: {{LIST_SSE_USE_CASES}}.

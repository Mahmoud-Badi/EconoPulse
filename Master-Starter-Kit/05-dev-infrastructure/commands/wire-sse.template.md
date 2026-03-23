# /wire-sse $ARGUMENT

Generate a complete SSE (Server-Sent Events) real-time infrastructure for the given feature.

## Steps

1. **Determine event types** for `$ARGUMENT`. Common patterns:
   - CRUD updates: `{entity}_created`, `{entity}_updated`, `{entity}_deleted`
   - Status changes: `{entity}_status_changed`
   - Notifications: `{entity}_alert`, `{entity}_reminder`

2. **Generate event type definitions** at `packages/api/src/events/$ARGUMENT.ts`:

   ```typescript
   // Event type definitions for {feature} real-time updates

   export type {Feature}CreatedEvent = {
     type: "{feature}_created";
     payload: {
       id: string;
       // ... key fields
       createdAt: string;
     };
   };

   export type {Feature}UpdatedEvent = {
     type: "{feature}_updated";
     payload: {
       id: string;
       // ... changed fields
       updatedAt: string;
     };
   };

   export type {Feature}StatusChangedEvent = {
     type: "{feature}_status_changed";
     payload: {
       id: string;
       previousStatus: string;
       newStatus: string;
       changedBy: string;
       changedAt: string;
     };
   };

   export type {Feature}DeletedEvent = {
     type: "{feature}_deleted";
     payload: {
       id: string;
       deletedAt: string;
     };
   };

   // Union of all events for this feature
   export type {Feature}Event =
     | {Feature}CreatedEvent
     | {Feature}UpdatedEvent
     | {Feature}StatusChangedEvent
     | {Feature}DeletedEvent;

   // ─── Event Emitter ─────────────────────────────────────────
   import { EventEmitter } from "node:events";

   // Company-scoped channel: each company gets its own event stream
   const emitters = new Map<string, EventEmitter>();

   export function get{Feature}Emitter(companyId: string): EventEmitter {
     let emitter = emitters.get(companyId);
     if (!emitter) {
       emitter = new EventEmitter();
       emitter.setMaxListeners(100); // Support many concurrent connections
       emitters.set(companyId, emitter);
     }
     return emitter;
   }

   export function emit{Feature}Event(companyId: string, event: {Feature}Event) {
     const emitter = get{Feature}Emitter(companyId);
     emitter.emit("{feature}", event);
   }

   // Clean up emitter when no listeners remain
   export function cleanup{Feature}Emitter(companyId: string) {
     const emitter = emitters.get(companyId);
     if (emitter && emitter.listenerCount("{feature}") === 0) {
       emitters.delete(companyId);
     }
   }
   ```

3. **Generate SSE endpoint** at `apps/web/src/app/api/v1/$ARGUMENT/stream/route.ts`:

   ```typescript
   import { auth } from "~/lib/auth";
   import {
     get{Feature}Emitter,
     cleanup{Feature}Emitter,
     type {Feature}Event,
   } from "@{project}/api/events/{feature}";

   export const runtime = "nodejs";
   export const dynamic = "force-dynamic";

   export async function GET(request: Request) {
     // ─── Auth Check ──────────────────────────────────────────
     const session = await auth.api.getSession({
       headers: request.headers,
     });

     if (!session?.user) {
       return new Response("Unauthorized", { status: 401 });
     }

     const companyId = session.user.companyId ?? "default";

     // ─── SSE Stream ──────────────────────────────────────────
     const encoder = new TextEncoder();
     const stream = new ReadableStream({
       start(controller) {
         // Send initial connection event
         controller.enqueue(
           encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`),
         );

         // Listen for events
         const emitter = get{Feature}Emitter(companyId);
         const handler = (event: {Feature}Event) => {
           try {
             controller.enqueue(
               encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
             );
           } catch {
             // Client disconnected
             cleanup();
           }
         };

         emitter.on("{feature}", handler);

         // Heartbeat every 30 seconds to keep connection alive
         const heartbeat = setInterval(() => {
           try {
             controller.enqueue(encoder.encode(": heartbeat\n\n"));
           } catch {
             cleanup();
           }
         }, 30000);

         // Cleanup on disconnect
         function cleanup() {
           clearInterval(heartbeat);
           emitter.off("{feature}", handler);
           cleanup{Feature}Emitter(companyId);
           try {
             controller.close();
           } catch {
             // Already closed
           }
         }

         // Handle client disconnect via AbortSignal
         request.signal.addEventListener("abort", cleanup);
       },
     });

     return new Response(stream, {
       headers: {
         "Content-Type": "text/event-stream",
         "Cache-Control": "no-cache, no-transform",
         Connection: "keep-alive",
         "X-Accel-Buffering": "no", // Disable Nginx buffering
       },
     });
   }
   ```

4. **Generate client hook** at `apps/web/src/hooks/use-{feature}-stream.ts`:

   ```typescript
   "use client";

   import { useEffect, useRef, useCallback } from "react";
   import { useQueryClient } from "@tanstack/react-query";
   import type { {Feature}Event } from "@{project}/api/events/{feature}";

   const BACKOFF_SCHEDULE = [1000, 2000, 5000, 10000, 30000] as const;

   interface Use{Feature}StreamOptions {
     enabled?: boolean;
     onEvent?: (event: {Feature}Event) => void;
   }

   export function use{Feature}Stream(options: Use{Feature}StreamOptions = {}) {
     const { enabled = true, onEvent } = options;
     const queryClient = useQueryClient();
     const eventSourceRef = useRef<EventSource | null>(null);
     const retryCountRef = useRef(0);
     const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

     const connect = useCallback(() => {
       // Clean up existing connection
       if (eventSourceRef.current) {
         eventSourceRef.current.close();
       }

       const es = new EventSource("/api/v1/{feature}/stream");
       eventSourceRef.current = es;

       es.onopen = () => {
         retryCountRef.current = 0; // Reset backoff on successful connection
       };

       es.onmessage = (event) => {
         try {
           const data = JSON.parse(event.data) as {Feature}Event | { type: "connected" };

           if (data.type === "connected") {
             return; // Initial connection event, no action needed
           }

           // Invalidate relevant TanStack Query cache
           switch (data.type) {
             case "{feature}_created":
             case "{feature}_updated":
             case "{feature}_deleted":
             case "{feature}_status_changed":
               // Invalidate list queries
               queryClient.invalidateQueries({
                 queryKey: [/* tRPC query key for {feature}.list */],
               });
               // Invalidate specific entity if we have the ID
               if ("payload" in data && "id" in data.payload) {
                 queryClient.invalidateQueries({
                   queryKey: [/* tRPC query key for {feature}.getById, data.payload.id */],
                 });
               }
               break;
           }

           // Call custom event handler
           onEvent?.(data as {Feature}Event);
         } catch (err) {
           console.error("Failed to parse SSE event:", err);
         }
       };

       es.onerror = () => {
         es.close();
         eventSourceRef.current = null;

         // Exponential backoff reconnection
         const backoffIndex = Math.min(
           retryCountRef.current,
           BACKOFF_SCHEDULE.length - 1,
         );
         const delay = BACKOFF_SCHEDULE[backoffIndex]!;

         retryTimerRef.current = setTimeout(() => {
           retryCountRef.current++;
           connect();
         }, delay);
       };
     }, [queryClient, onEvent]);

     useEffect(() => {
       if (!enabled) return;

       connect();

       // Reconnect on visibility change (user returns to tab)
       const handleVisibility = () => {
         if (document.visibilityState === "visible" && !eventSourceRef.current) {
           retryCountRef.current = 0;
           connect();
         }
       };

       document.addEventListener("visibilitychange", handleVisibility);

       return () => {
         // Cleanup
         if (retryTimerRef.current) {
           clearTimeout(retryTimerRef.current);
         }
         if (eventSourceRef.current) {
           eventSourceRef.current.close();
           eventSourceRef.current = null;
         }
         document.removeEventListener("visibilitychange", handleVisibility);
       };
     }, [enabled, connect]);
   }
   ```

5. **Update barrel export** at `packages/api/src/index.ts`:
   ```typescript
   export * from "./events/{feature}";
   ```

6. **Run typecheck**:
   ```bash
   pnpm typecheck 2>&1 | tail -20
   ```

7. **Output report**:
   ```
   SSE WIRED
   ==========
   Feature: $ARGUMENT
   Files created:
   - packages/api/src/events/$ARGUMENT.ts (event types + emitter)
   - apps/web/src/app/api/v1/$ARGUMENT/stream/route.ts (SSE endpoint)
   - apps/web/src/hooks/use-$ARGUMENT-stream.ts (client hook)
   Files updated:
   - packages/api/src/index.ts (barrel export)
   Event types: {list}
   Backoff schedule: 1s, 2s, 5s, 10s, 30s
   TypeScript: {PASS/FAIL}
   ```

## Rules

- **Company-scoped channels**: Each company/organization gets its own EventEmitter. Never broadcast events across companies.
- **Auth on connection**: Verify the session on the SSE endpoint. Unauthenticated connections get 401.
- **Heartbeat every 30 seconds**: Prevents proxies and load balancers from closing idle connections.
- **Clean up EventSource on unmount**: The React hook's cleanup function must close the EventSource to prevent memory leaks.
- **Exponential backoff**: Reconnection delays: 1s, 2s, 5s, 10s, 30s (max). Never hammer the server with immediate reconnects.
- **Visibility reconnect**: When the user returns to the tab, reconnect immediately (reset backoff counter).
- **TanStack Query invalidation**: SSE events should invalidate query cache keys, not update cache directly. This keeps data consistent with the server.

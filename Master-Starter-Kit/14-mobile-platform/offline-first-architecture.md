# Offline-First Architecture Guide

> Design apps that work without a network connection and sync gracefully when connectivity returns.

---

## Why Offline-First Matters

Mobile users lose connectivity constantly — elevators, subways, rural areas, airplane mode. An app that shows a spinner or error on every network hiccup feels broken. Offline-first means the local device is the source of truth, and the server is a sync target.

**Core principle:** The app must be usable with zero network connectivity. Server sync is a background concern, not a blocking operation.

---

## Optimistic Updates

Update the UI immediately when the user takes an action. Queue the operation for server sync.

### How It Works

```
User taps "Complete Task"
  → UI updates instantly (task shows as complete)
  → Operation queued in local sync queue
  → Background process sends to server when online
  → If server rejects: roll back UI, notify user
```

### Implementation Pattern

```
1. Write change to local database
2. Update UI from local database (not server response)
3. Add operation to sync queue with:
   - Unique operation ID (for idempotency)
   - Timestamp
   - Operation type and payload
   - Retry count (start at 0)
4. Trigger sync if online
```

### When NOT to Use Optimistic Updates

| Scenario | Why Not | Alternative |
|----------|---------|-------------|
| Payment processing | Money movement must be confirmed | Show pending state, block until confirmed |
| Inventory reservation | Race condition with other buyers | Show "reserving..." state |
| Account deletion | Irreversible, needs confirmation | Require online + confirmation |
| Multi-user collaborative edits | High conflict probability | Show "saving..." with conflict resolution |

---

## Conflict Resolution Strategies

When the same record is modified offline on multiple devices, or modified both offline and on the server, you need a conflict resolution strategy.

### Strategy 1: Last-Write-Wins (LWW)

**How it works:** Each write carries a timestamp. The most recent timestamp wins.

**When to use:** User profile fields, preferences, settings — data where one user "owns" the record.

**Pitfalls:**
- Clock skew between devices can cause wrong winner
- User's careful edit can be silently overwritten by a stale device syncing late
- Use server-assigned timestamps on sync, not device-local timestamps

**Implementation:**
```
Each record stores: { data, updated_at, device_id }
On conflict: compare updated_at → keep higher timestamp
Tie-breaker: compare device_id alphabetically (deterministic)
```

### Strategy 2: Field-Level Merge

**How it works:** Compare changes at the field level. If Device A changed `name` and Device B changed `email`, merge both changes.

**When to use:** Records with independent fields (user profiles, settings objects).

**Implementation:**
```
Store a "base" snapshot when device goes offline
On sync, compare:
  - Base → Server version (server changes)
  - Base → Local version (local changes)
  - If same field changed in both: flag as conflict
  - If different fields changed: merge automatically
```

### Strategy 3: Manual Resolution

**How it works:** Present both versions to the user and let them choose.

**When to use:** High-value content (documents, notes), collaborative data.

**UI pattern:**
```
┌─────────────────────────────────┐
│  Conflict Detected              │
│                                 │
│  Your version:                  │
│  "Meeting moved to 3pm Tuesday" │
│                                 │
│  Server version:                │
│  "Meeting cancelled"            │
│                                 │
│  [Keep Mine] [Keep Theirs] [Edit] │
└─────────────────────────────────┘
```

### Strategy 4: Operational Transform / CRDTs

**How it works:** Instead of syncing state, sync operations. Operations are designed to be commutative (order doesn't matter).

**When to use:** Real-time collaborative editing, shared lists, counters.

**Examples:**
- Counter: sync increment/decrement operations, not the value
- Set: sync add/remove operations
- Text: sync insert/delete at position operations

**Complexity:** High. Use a library (Yjs, Automerge) rather than building from scratch.

### Decision Guide

```
Is there only one writer per record?
  → YES: Last-Write-Wins
  → NO: Are fields independent?
    → YES: Field-Level Merge
    → NO: Is it high-value content?
      → YES: Manual Resolution
      → NO: Is it collaborative real-time?
        → YES: CRDTs
        → NO: Last-Write-Wins with notification
```

---

## Sync Reconciliation

### Sync Queue Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  Local Database  │────▶│  Sync Queue  │────▶│   Server    │
│  (source of     │     │  (pending    │     │   (sync     │
│   truth for UI) │◀────│   operations)│◀────│    target)  │
└─────────────────┘     └──────────────┘     └─────────────┘
```

### Queue Operation Format

```
{
  "operation_id": "uuid-v4",          // Idempotency key
  "type": "CREATE | UPDATE | DELETE",
  "entity": "task",
  "entity_id": "task-123",
  "payload": { "title": "New title" },
  "created_at": "2024-01-15T10:30:00Z",
  "retry_count": 0,
  "max_retries": 5,
  "status": "pending | in_flight | failed | completed"
}
```

### Idempotency

Every operation MUST include a unique `operation_id`. The server MUST:

1. Check if `operation_id` has been processed before
2. If yes: return the original response (do not re-process)
3. If no: process and store the `operation_id` with the result

**Why this matters:** Network failures mean you can't know if the server received your request. Without idempotency, retrying a "create" operation could create duplicates.

### Sync Order Rules

1. Process operations in chronological order per entity
2. CREATE must come before UPDATE/DELETE for the same entity
3. DELETE cancels any pending UPDATE for the same entity
4. Batch operations where possible (reduce round trips)

### Retry Strategy

```
Attempt 1: immediate
Attempt 2: 1 second delay
Attempt 3: 5 second delay
Attempt 4: 30 second delay
Attempt 5: 5 minute delay
After 5 failures: mark as "failed", surface to user
```

**Do NOT retry on 4xx errors** (client errors). Only retry on network failures and 5xx errors.

### Full Sync vs Incremental Sync

| Approach | When to Use | Implementation |
|----------|-------------|----------------|
| Full sync | First launch, after long offline period, data corruption recovery | Download all records, replace local database |
| Incremental sync | Normal operation | Send/receive only changes since last sync timestamp |
| Delta sync | Large datasets | Server sends only changed fields, not full records |

**Track sync state:**
```
{
  "last_sync_at": "2024-01-15T10:30:00Z",
  "last_sync_status": "success",
  "pending_operations": 3,
  "failed_operations": 0
}
```

---

## Storage Layer Decision Guide

### Option Comparison

| Feature | AsyncStorage | SQLite (expo-sqlite) | WatermelonDB | MMKV |
|---------|-------------|---------------------|--------------|------|
| Data model | Key-value | Relational tables | Relational + observable | Key-value |
| Max practical size | ~6MB | Hundreds of MB | Hundreds of MB | ~50MB |
| Query capability | Get by key only | Full SQL | Query builder | Get by key only |
| Performance (10K records) | Slow (serialization) | Fast | Very fast (lazy loading) | Very fast |
| Sync support | Manual | Manual | Built-in sync engine | Manual |
| Relationships | No | Yes (joins) | Yes (associations) | No |
| Observable/reactive | No | No (without wrapper) | Yes (auto-updating queries) | No |
| Best for | Settings, tokens, small caches | Structured data, complex queries | Large datasets with sync needs | High-frequency read/write |

### Decision Tree

```
Is your data just settings/tokens/small config?
  → YES: MMKV (fastest key-value) or AsyncStorage (simplest)
  → NO: Do you have more than 1,000 records of structured data?
    → NO: SQLite (simple, well-understood)
    → YES: Do you need built-in sync primitives?
      → YES: WatermelonDB
      → NO: Do you need complex SQL queries?
        → YES: SQLite
        → NO: WatermelonDB (better performance at scale)
```

### Storage Limits to Know

- **AsyncStorage (Android):** 6MB default, can increase but performance degrades
- **AsyncStorage (iOS):** No hard limit, but performance degrades past ~10MB
- **SQLite:** Practical limit ~200MB on mobile (storage space dependent)
- **Device storage check:** Always check available storage before large writes. On low-storage devices (<500MB free), show a warning and reduce cache aggressively.

---

## Network Status Detection

### Detection Pattern

```
Monitor two signals:
1. Device connectivity state (Wi-Fi/cellular/none)
2. Actual server reachability (can we ping the API?)

Device says "connected" ≠ actually online
  - Captive portals (hotel/airport Wi-Fi)
  - DNS failures
  - Server downtime

Implementation:
  - Listen to connectivity change events
  - On "connected" event: verify with a lightweight health check endpoint
  - Health check: GET /api/health → 200 OK (< 1KB response)
  - Timeout: 5 seconds
  - If health check fails: treat as offline despite device reporting connected
```

### Graceful Degradation Tiers

```
Tier 1 — Full Online
  All features available
  Real-time sync active
  Show "connected" indicator (or hide it — connected is the default)

Tier 2 — Slow/Unstable Connection
  Disable real-time features (live updates, video)
  Increase request timeouts
  Reduce image quality
  Show "slow connection" indicator

Tier 3 — Fully Offline
  Read from local database only
  Queue all write operations
  Disable features that require server (see checklist below)
  Show "offline — changes will sync when connected" banner

Tier 4 — Reconnecting
  Process sync queue (oldest first)
  Show "syncing X changes..." progress
  Resolve any conflicts
  Transition to Tier 1 when queue is empty
```

---

## Offline-Capable Feature Checklist

Use this checklist to classify every feature in your app.

### Template

```markdown
| Feature | Works Offline | Degraded Offline | Online Only | Notes |
|---------|:------------:|:----------------:|:-----------:|-------|
| View {{FEATURE_LIST}} | Y | | | Cached locally |
| Create {{FEATURE_ITEM}} | Y | | | Queued for sync |
| Edit {{FEATURE_ITEM}} | Y | | | Queued for sync |
| Delete {{FEATURE_ITEM}} | Y | | | Queued for sync |
| Search {{FEATURE_LIST}} | | Y | | Local search only, no server results |
| View images/media | | Y | | Only cached images available |
| Upload media | | | Y | Requires network |
| Push notifications | | | Y | Requires server connection |
| User authentication | | Y | | Cached session, no new login |
| Payment/purchase | | | Y | Never process payments offline |
| Real-time chat | | | Y | Requires WebSocket |
| View analytics | | | Y | Data lives on server |
```

### Rules for Classification

- **Works Offline:** Feature is fully functional with local data
- **Degraded Offline:** Feature works but with limitations (stale data, local-only search)
- **Online Only:** Feature cannot function without server (payments, auth, real-time)

---

## Data Freshness Indicators

Users must know when they're looking at stale data.

### UI Patterns

**Last sync timestamp:**
```
┌──────────────────────────────────┐
│  Tasks                     ↻     │
│  Last synced: 2 minutes ago      │
│  ─────────────────────────────── │
│  ☑ Design review                 │
│  ☐ Update API docs               │
└──────────────────────────────────┘
```

**Stale data warning (offline > 1 hour):**
```
┌──────────────────────────────────┐
│  ⚠ You're viewing offline data   │
│  Last synced: 3 hours ago        │
│  Some information may be outdated│
│  [Sync Now]                      │
└──────────────────────────────────┘
```

**Per-item freshness (when items sync at different times):**
```
Task: "Design review"
  Status: Complete ✓
  Updated: 5 min ago (synced)

Task: "Fix login bug"
  Status: In Progress ⟳
  Updated: just now (pending sync)
```

### Freshness Thresholds

| Time Since Sync | Indicator | Color |
|-----------------|-----------|-------|
| < 1 minute | "Just now" | Green / no indicator |
| 1–5 minutes | "X minutes ago" | None |
| 5–60 minutes | "X minutes ago" | Yellow subtle |
| 1–24 hours | "X hours ago" | Yellow |
| > 24 hours | "X days ago — data may be outdated" | Orange with warning |
| > 7 days | "Last synced X days ago — tap to refresh" | Red with prominent warning |

---

## Testing Offline Scenarios

### Test Categories

**1. Basic offline operation:**
- Turn on airplane mode → use all "works offline" features → verify functionality
- Create/edit/delete records offline → verify they appear in local UI
- Verify "online only" features show appropriate messaging (not crashes)

**2. Sync queue replay:**
- Perform 10+ operations offline (mix of create, update, delete)
- Go online → verify all operations sync in correct order
- Verify no duplicates created
- Verify final state matches expectations

**3. Conflict scenarios:**
- Modify same record on two devices while both offline
- Bring both online → verify conflict resolution works as designed
- Test each conflict strategy (LWW, merge, manual)

**4. Network interruption during sync:**
- Start syncing → kill network mid-sync
- Restore network → verify sync resumes without duplicates
- Verify partially-synced operations are handled correctly

**5. Edge cases:**
- Offline for extended period (days) → large sync queue
- Storage nearly full → verify graceful handling
- App killed while offline → verify queue persists on restart
- Token expiry while offline → re-auth flow on reconnect

### Network Simulation Tools

| Tool | Platform | What It Does |
|------|----------|--------------|
| Network Link Conditioner | iOS (Xcode) | Simulate slow/lossy/offline networks |
| Android Emulator Network Settings | Android | Toggle connectivity, set latency |
| Flipper Network Plugin | Both | Inspect and block network requests |
| Charles Proxy | Both | Throttle, block, modify network traffic |
| `NetInfo` mock in tests | Both | Mock connectivity state in unit tests |

### Automated Test Pattern

```
Test: "Operations sync correctly after offline period"

Setup:
  1. Seed local database with known state
  2. Mock network as offline
  3. Perform operations: create item A, update item B, delete item C

Execute:
  4. Mock network as online
  5. Trigger sync

Assert:
  6. Sync queue is empty
  7. Server has item A (created)
  8. Server has item B (updated)
  9. Server does not have item C (deleted)
  10. No duplicate items exist
  11. Operation IDs are recorded (idempotency)
```

---

## Common Pitfalls

### 1. Cache Invalidation Mistakes

**Problem:** Stale cache served indefinitely because invalidation logic is wrong.

**Fix:** Every cached item needs a TTL (time-to-live) and a version number:
```
{
  "data": { ... },
  "cached_at": "2024-01-15T10:00:00Z",
  "ttl_seconds": 3600,
  "version": 42
}
```
On sync, compare server version with cached version. If server version is higher, replace cache.

### 2. Storage Limit Exceeded

**Problem:** App crashes or silently fails when device storage is full.

**Fix:**
- Check available storage before large writes
- Implement cache eviction: LRU (least recently used) items deleted first
- Set a maximum cache size (e.g., 100MB) and enforce it
- Show user warning at 80% of budget: "Storage almost full, oldest cached data will be removed"

### 3. Background Sync Battery Drain

**Problem:** Aggressive background sync drains battery, users uninstall.

**Fix:**
- Minimum sync interval: 15 minutes for background sync
- Use OS-provided background fetch APIs (they respect battery state)
- Reduce sync frequency when battery < 20%
- Never sync on cellular if user has "Wi-Fi only" preference
- Batch operations: 1 request with 10 operations, not 10 separate requests

### 4. Queue Growing Unbounded

**Problem:** User offline for days, queue has thousands of operations, sync takes forever.

**Fix:**
- Compact the queue: if item A was updated 5 times, keep only the latest update
- Set a queue size limit (e.g., 500 operations)
- At 80% of limit, warn user: "You have many unsynced changes. Connect to sync."
- At 100%, stop accepting new offline operations for non-critical features

### 5. Authentication Token Expiry

**Problem:** User goes offline, token expires, all sync requests fail with 401.

**Fix:**
- Before processing sync queue, check token expiry
- If expired, attempt silent refresh
- If refresh fails, prompt user to re-authenticate
- Do NOT discard the sync queue on auth failure — keep it for after re-auth

### 6. Ignoring Server-Side Deletions

**Problem:** Item deleted on server while user was offline. User still sees it locally.

**Fix:**
- On sync, server returns list of deleted IDs since last sync
- Soft-delete locally (mark as deleted, hide from UI)
- If user modified a locally-deleted item while offline: surface conflict to user

### 7. Not Testing on Real Devices with Real Networks

**Problem:** Offline works perfectly in simulator, breaks on real device.

**Fix:**
- Test on actual devices with airplane mode
- Test on slow 3G connections (not just off/on)
- Test in areas with flaky connectivity (elevator test)
- Test with app in background during connectivity changes

---

## Architecture Decision Record Template

```markdown
## Offline Architecture Decisions for {{PROJECT_NAME}}

### Storage Layer
- **Choice:** {{STORAGE_CHOICE}}
- **Reason:** {{REASON}}
- **Max cache size:** {{CACHE_SIZE_MB}}MB

### Conflict Resolution
- **Default strategy:** {{CONFLICT_STRATEGY}}
- **Exceptions:** {{EXCEPTIONS}}

### Sync Configuration
- **Foreground sync interval:** {{FG_SYNC_SECONDS}} seconds
- **Background sync interval:** {{BG_SYNC_MINUTES}} minutes
- **Max queue size:** {{MAX_QUEUE_SIZE}} operations
- **Retry policy:** {{RETRY_POLICY}}

### Feature Classification
| Feature | Offline Support |
|---------|----------------|
| {{FEATURE_1}} | {{OFFLINE_SUPPORT_1}} |
| {{FEATURE_2}} | {{OFFLINE_SUPPORT_2}} |

### Data Freshness
- **Warning threshold:** {{STALE_WARNING_MINUTES}} minutes
- **Critical threshold:** {{STALE_CRITICAL_HOURS}} hours
```
